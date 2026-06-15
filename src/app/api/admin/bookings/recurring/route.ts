import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { getPriceRules } from '@/lib/pricing';
import { VenueType } from '@/types';

function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const total  = h * 60 + m + Math.round(hours * 60);
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Sinh `weeks` ngày cùng thứ trong tuần (day_of_week: 0=CN..6=T7), bắt đầu từ ngày >= start_date
function buildOccurrences(startDate: string, dayOfWeek: number, weeks: number): string[] {
  const start = new Date(`${startDate}T00:00:00`);
  const diff  = (dayOfWeek - start.getDay() + 7) % 7;
  const first = new Date(start);
  first.setDate(first.getDate() + diff);

  const dates: string[] = [];
  for (let i = 0; i < weeks; i++) {
    const d = new Date(first);
    d.setDate(d.getDate() + i * 7);
    dates.push(toDateStr(d));
  }
  return dates;
}

// POST /api/admin/bookings/recurring — Tạo loạt đặt sân cố định hàng tuần cho khách quen
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const {
    court_id, court_name, venue_type,
    start_date, day_of_week, start_time, duration, weeks,
    user_name, user_phone, user_email, note,
  } = body;

  if (!court_id || !start_date || day_of_week === undefined || !start_time || !duration || !weeks) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
  }
  if (!user_phone?.trim()) {
    return NextResponse.json({ error: 'Vui lòng nhập số điện thoại khách hàng' }, { status: 400 });
  }
  if (weeks < 1 || weeks > 52) {
    return NextResponse.json({ error: 'Số tuần lặp lại phải từ 1 đến 52' }, { status: 400 });
  }

  const admin    = createAdminClient();
  const end_time = addHoursToTime(start_time, duration);
  const dates    = buildOccurrences(start_date, day_of_week, weeks);

  // Lấy các booking & khoá sân hiện có để kiểm tra trùng lịch cho từng ngày
  const [{ data: existing }, { data: blocks }] = await Promise.all([
    admin.from('bookings')
      .select('booking_date, start_time, end_time')
      .eq('court_id', court_id)
      .in('booking_date', dates)
      .in('status', ['pending', 'confirmed']),
    admin.from('court_blocks')
      .select('block_date, start_time, end_time')
      .eq('court_id', court_id)
      .in('block_date', dates),
  ]);

  function overlaps(aStart: string, aEnd: string, bStart: string | null, bEnd: string | null) {
    if (!bStart || !bEnd) return true; // khoá nguyên ngày
    return aStart < bEnd && bStart < aEnd;
  }

  const skipped: string[] = [];
  const toInsert: string[] = [];

  for (const date of dates) {
    const bookingConflict = (existing ?? []).some(
      b => b.booking_date === date && overlaps(start_time, end_time, b.start_time, b.end_time),
    );
    const blockConflict = (blocks ?? []).some(
      b => b.block_date === date && overlaps(start_time, end_time, b.start_time, b.end_time),
    );
    if (bookingConflict || blockConflict) skipped.push(date);
    else toInsert.push(date);
  }

  const recurring_id = randomUUID();
  const { price }    = getPriceRules(start_time, venue_type as VenueType);
  const total_price  = price * duration;

  if (toInsert.length > 0) {
    const rows = toInsert.map(date => ({
      court_id,
      court_name,
      venue_type,
      booking_date:   date,
      start_time,
      end_time,
      duration,
      total_price,
      payment_method: 'pay_at_venue',
      user_name:      user_name?.trim() || null,
      user_phone:     user_phone.trim(),
      user_email:     user_email?.trim() || null,
      status:         'confirmed',
      source:         'admin_recurring',
      recurring_id,
    }));

    const { error } = await admin.from('bookings').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    recurring_id,
    created: toInsert.length,
    skipped,
    note: note ?? null,
  }, { status: 201 });
}
