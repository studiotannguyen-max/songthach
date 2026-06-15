import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const InquirySchema = z.object({
  contact_name:     z.string().min(1, 'Vui lòng nhập tên').max(100),
  phone:            z.preprocess(
    (v) => (typeof v === 'string' ? v.replace(/[\s.\-()]/g, '') : v),
    z.string().regex(/^(0|\+84)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ'),
  ),
  email:            z.string().email().max(100).optional().nullable().or(z.literal('')),
  event_date:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal('')),
  guest_count:      z.number().int().min(1).max(5000).optional().nullable(),
  table_count:      z.number().int().min(1).max(500).optional().nullable(),
  hall_preference:  z.string().max(50).optional().nullable(),
  special_requests: z.string().max(2000).optional().nullable(),
});

// POST /api/wedding — Gửi yêu cầu tư vấn tiệc cưới
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 yêu cầu / 5 phút / IP — chống spam form
    const ip = getClientIp(req);
    if (!rateLimit(`wedding:${ip}`, 3, 5 * 60_000)) {
      return NextResponse.json({ error: 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau.' }, { status: 429 });
    }

    const parsed = InquirySchema.safeParse(await req.json());
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const d = parsed.data;
    const admin = createAdminClient();
    const { error } = await admin.from('wedding_inquiries').insert({
      contact_name:     d.contact_name.trim(),
      phone:            d.phone.trim(),
      email:            d.email?.trim() || null,
      event_date:       d.event_date || null,
      guest_count:      d.guest_count ?? null,
      table_count:      d.table_count ?? null,
      hall_preference:  d.hall_preference?.trim() || null,
      special_requests: d.special_requests?.trim() || null,
      status:           'new',
    });

    if (error) {
      console.error('[Wedding inquiry] DB error:', error.message);
      return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại' }, { status: 500 });
    }

    // Báo email cho admin (không block response nếu thất bại)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      import('resend').then(({ Resend }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);
        return resend.emails.send({
          from:    process.env.RESEND_FROM_EMAIL ?? 'Song Thạch <onboarding@resend.dev>',
          to:      process.env.ADMIN_EMAIL!,
          subject: `Yêu cầu tư vấn tiệc cưới mới — ${d.contact_name}`,
          html:    `<p>Khách: ${d.contact_name} — ${d.phone}</p>
                    <p>Email: ${d.email || '—'}</p>
                    <p>Ngày dự kiến: ${d.event_date || '—'}</p>
                    <p>Số khách: ${d.guest_count ?? '—'} · Số bàn: ${d.table_count ?? '—'}</p>
                    <p>Yêu cầu: ${d.special_requests || '—'}</p>`,
        });
      }).catch((err) => console.error('[Wedding inquiry] Email thất bại:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
