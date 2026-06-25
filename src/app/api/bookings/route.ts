import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendBookingConfirmation } from '@/lib/email';
import { sendTelegramNotification } from '@/lib/telegram';
import { calculateBookingPrice } from '@/lib/pricing';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getUserPointsBalance, redeemPoints, VND_PER_POINT } from '@/lib/points';
import { getLockGroupCourtIds } from '@/lib/court-locks';

// Dùng bước 30 phút để hỗ trợ cả sân cầu lông (30'/slot) và bóng đá (60'/slot)
// Widget bóng đá chỉ hiển thị slot chẵn giờ nên các slot :30 bị bỏ qua ở phía client
const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
}); // 06:00 ~ 21:30

// GET /api/bookings?court_id=xxx&date=2026-06-10
// Trả về các slot đã được đặt trong ngày để hiển thị trên widget
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const court_id    = searchParams.get('court_id');
  const date        = searchParams.get('date');

  if (!court_id || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ booked_slots: [] });
  }

  const supabase  = createAdminClient();
  const groupIds  = getLockGroupCourtIds(court_id);
  const [{ data }, { data: blocks }] = await Promise.all([
    supabase
      .from('bookings')
      .select('start_time, duration')
      .in('court_id', groupIds)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']),
    supabase
      .from('court_blocks')
      .select('start_time, end_time')
      .in('court_id', groupIds)
      .eq('block_date', date),
  ]);

  // Mở rộng các slot bị chiếm theo bước 30 phút
  // VD: 06:00 đặt 1h → ['06:00','06:30']; đặt 1.5h → ['06:00','06:30','07:00']
  function expandSlots(startTime: string, hours: number): string[] {
    const [h, m] = startTime.split(':').map(Number);
    const steps  = Math.round(hours * 2); // mỗi bước = 30 phút
    const result: string[] = [];
    for (let i = 0; i < steps; i++) {
      const total = h * 60 + m + i * 30;
      result.push(`${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`);
    }
    return result;
  }

  const bookedSlots: string[] = [];
  for (const row of data ?? []) {
    bookedSlots.push(...expandSlots(row.start_time as string, row.duration as number));
  }

  // start_time/end_time = NULL → khoá nguyên ngày (chiếm toàn bộ TIME_SLOTS hiển thị)
  const blockedSlots: string[] = [];
  for (const row of blocks ?? []) {
    if (!row.start_time || !row.end_time) {
      blockedSlots.push(...TIME_SLOTS);
    } else {
      const [sh, sm] = (row.start_time as string).split(':').map(Number);
      const [eh, em] = (row.end_time   as string).split(':').map(Number);
      const hours    = (eh * 60 + em - (sh * 60 + sm)) / 60;
      blockedSlots.push(...expandSlots(row.start_time as string, hours));
    }
  }

  return NextResponse.json({
    booked_slots:  bookedSlots,
    blocked_slots: Array.from(new Set(blockedSlots)),
  });
}

// ===== Validation schema cho đặt sân =====
const BookingSchema = z.object({
  court_id:       z.string().min(1).max(50),
  court_name:     z.string().min(1).max(100),
  venue_type:     z.enum(['badminton', 'football_5', 'football_7']),
  booking_date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày không hợp lệ'),
  start_time:     z.string().regex(/^([01]\d|2[01]):(00|30)$/, 'Giờ không hợp lệ'),
  duration:       z.number().min(0.5).max(4),
  payment_method: z.enum(['bank_transfer', 'pay_at_venue']),
  user_name:      z.string().max(100).optional().nullable(),
  user_phone:     z.preprocess(
    (v) => (typeof v === 'string' ? v.replace(/[\s.\-()]/g, '') : v),
    z.string().regex(/^(0|\+84)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ'),
  ),
  user_email:     z.string().email('Email không hợp lệ').max(100),
  points_used:    z.number().int().min(0).max(100_000).optional().default(0),
});

function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const total  = h * 60 + m + Math.round(hours * 60);
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

// POST /api/bookings — Tạo đặt sân (không cần đăng nhập)
export async function POST(req: NextRequest) {
  try {
    // Rate limit: tối đa 5 booking / phút / IP — chống spam giữ chỗ
    const ip = getClientIp(req);
    if (!rateLimit(`booking:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Bạn thao tác quá nhanh, vui lòng thử lại sau 1 phút.' }, { status: 429 });
    }

    const parsed = BookingSchema.safeParse(await req.json());
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const {
      court_id, court_name, venue_type,
      booking_date, start_time, duration,
      payment_method, user_name, user_phone, user_email,
      points_used,
    } = parsed.data;

    // Không cho đặt ngày quá khứ hoặc quá 60 ngày tới
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const bDate = new Date(`${booking_date}T00:00:00`);
    const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 60);
    if (isNaN(bDate.getTime()) || bDate < today || bDate > maxDate) {
      return NextResponse.json({ error: 'Ngày đặt sân không hợp lệ (chỉ nhận trong vòng 60 ngày tới)' }, { status: 400 });
    }

    // GIÁ TÍNH PHÍA SERVER — không tin total_price từ client
    const end_time    = addHoursToTime(start_time, duration);
    const { total: total_price } = calculateBookingPrice(start_time, duration, venue_type);

    // Giờ chơi phải nằm trong khung mở cửa 06:00 – 22:00
    if (start_time < '06:00' || end_time > '22:00') {
      return NextResponse.json({ error: 'Khung giờ ngoài giờ hoạt động (06:00 – 22:00)' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Kiểm tra trùng lịch — 2 khoảng giao nhau khi: existing.start < new.end VÀ existing.end > new.start
    // .in() thay .eq() vì 1 số sân nằm chung diện tích (xem getLockGroupCourtIds)
    const { data: conflict } = await admin
      .from('bookings')
      .select('id')
      .in('court_id', getLockGroupCourtIds(court_id))
      .eq('booking_date', booking_date)
      .in('status', ['pending', 'confirmed'])
      .lt('start_time', end_time)
      .gt('end_time', start_time)
      .limit(1);

    if (conflict && conflict.length > 0) {
      return NextResponse.json({ error: 'Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.' }, { status: 409 });
    }

    // Kiểm tra sân có đang bị khoá bảo trì trong khung giờ này không
    // (gồm cả sân liên kết — vd Sân 5A bảo trì thì Sân 7A cũng không đặt được)
    const { data: blocks } = await admin
      .from('court_blocks')
      .select('start_time, end_time')
      .in('court_id', getLockGroupCourtIds(court_id))
      .eq('block_date', booking_date);

    const isBlocked = (blocks ?? []).some(b => {
      if (!b.start_time || !b.end_time) return true; // khoá nguyên ngày
      return start_time < b.end_time && b.start_time < end_time;
    });

    if (isBlocked) {
      return NextResponse.json({ error: 'Sân đang bảo trì trong khung giờ này, vui lòng chọn sân hoặc khung giờ khác.' }, { status: 409 });
    }

    // Lấy user_id nếu đang đăng nhập (tuỳ chọn, không block booking nếu lỗi auth)
    // Lưu ý: public.users không dùng thực tế trong dự án này (luôn rỗng) — khách hàng
    // thật chỉ tồn tại trong auth.users, nên dùng trực tiếp auth.uid(), không qua public.users.
    let userId: string | null = null;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch { /* guest booking — bỏ qua lỗi auth */ }

    // Dùng điểm tích lũy giảm giá — chỉ cho phép khi đã đăng nhập
    let pointsDiscountAmount = 0;
    if (points_used > 0) {
      if (!userId) {
        return NextResponse.json({ error: 'Cần đăng nhập để dùng điểm tích lũy' }, { status: 400 });
      }
      const balance = await getUserPointsBalance(admin, userId);
      if (points_used > balance) {
        return NextResponse.json({ error: `Bạn chỉ có ${balance} điểm, không đủ để dùng ${points_used} điểm` }, { status: 400 });
      }
      pointsDiscountAmount = points_used * VND_PER_POINT;
      if (pointsDiscountAmount > total_price) {
        return NextResponse.json({ error: 'Số điểm dùng vượt quá giá trị đặt sân' }, { status: 400 });
      }
    }

    const { data: booking, error } = await admin
      .from('bookings')
      .insert({
        user_id:        userId,
        user_email,
        user_name:      user_name || null,
        user_phone,
        venue_type,
        court_id,
        court_name,
        booking_date,
        start_time,
        end_time,
        duration,
        total_price,
        points_used,
        points_discount_amount: pointsDiscountAmount,
        payment_method,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;

    // Trừ điểm sau khi tạo booking thành công
    if (points_used > 0 && userId) {
      await redeemPoints(admin, { userId, bookingId: booking.id, points: points_used });
    }

    // Mã đặt sân gọn: ST + 5 chữ số, suy ra từ id thật (không lưu cột riêng)
    const numericCode = parseInt(booking.id.replace(/-/g, '').slice(0, 8), 16) % 100_000;
    const bookingId   = `ST${numericCode.toString().padStart(5, '0')}`;
    const amountDue  = total_price - pointsDiscountAmount;

    // Gửi email xác nhận — không block response nếu email thất bại
    sendBookingConfirmation({
      to:             user_email,
      booking_id:     bookingId,
      user_name:      user_name || null,
      court_name,
      venue_name:     venue_type === 'badminton' ? 'Sân Cầu lông' : 'Sân Bóng đá',
      booking_date,
      start_time,
      end_time,
      duration,
      total_price:    amountDue,
      payment_method,
    }).catch(err => console.error('[Email] Gửi thất bại:', err));

    sendTelegramNotification({
      booking_id:     bookingId,
      court_name,
      venue_label:    venue_type === 'badminton' ? 'Sân Cầu lông' : 'Sân Bóng đá',
      booking_date,
      start_time,
      end_time,
      duration,
      user_name:      user_name || null,
      user_phone,
      total_price:    amountDue,
      payment_method,
    }).catch(err => console.error('[Telegram] Gửi thất bại:', err));

    return NextResponse.json({ success: true, booking_id: bookingId, id: booking.id, total_price: amountDue }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/bookings]', err);
    const isDev = process.env.NODE_ENV === 'development';
    const msg   = isDev && err instanceof Error ? err.message : 'Lỗi server, vui lòng thử lại';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
