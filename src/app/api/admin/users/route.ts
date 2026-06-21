import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

interface CustomerRow {
  phone: string;
  name: string | null;
  email: string;
  userId: string | null;
  bookingCount: number;
  pointsBalance: number | null;
}

// GET /api/admin/users — danh sách khách hàng, gộp từ bảng bookings theo SĐT
// (public.users không dùng thực tế trong dự án này — luôn rỗng, xem lib/points.ts).
export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const admin = createAdminClient();

  const [{ data: bookings, error: bErr }, { data: pointTxns, error: pErr }] = await Promise.all([
    admin
      .from('bookings')
      .select('user_phone, user_name, user_email, user_id, created_at')
      .order('created_at', { ascending: false }),
    admin.from('point_transactions').select('user_id, points'),
  ]);

  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 });
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  // Số dư điểm theo user_id — tính 1 lần, dùng lại cho mọi khách có tài khoản
  const balanceByUser = new Map<string, number>();
  for (const t of pointTxns ?? []) {
    balanceByUser.set(t.user_id, (balanceByUser.get(t.user_id) ?? 0) + t.points);
  }

  // Gộp booking theo SĐT — khách vãng lai và khách có tài khoản đều định danh bằng SĐT
  const byPhone = new Map<string, CustomerRow>();
  for (const b of bookings ?? []) {
    if (!b.user_phone) continue;
    const existing = byPhone.get(b.user_phone);
    if (existing) {
      existing.bookingCount += 1;
      // Booking mới nhất (đã order theo created_at desc) quyết định tên/email/user_id hiện hành
    } else {
      byPhone.set(b.user_phone, {
        phone:         b.user_phone,
        name:          b.user_name,
        email:         b.user_email,
        userId:        b.user_id,
        bookingCount:  1,
        pointsBalance: b.user_id ? (balanceByUser.get(b.user_id) ?? 0) : null,
      });
    }
  }

  const customers = Array.from(byPhone.values()).sort((a, b) => b.bookingCount - a.bookingCount);
  return NextResponse.json({ customers });
}
