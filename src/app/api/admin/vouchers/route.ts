import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/vouchers?q=ST-XXXXXX | SĐT — tra cứu voucher tại quầy
// Không có q: trả về 50 voucher mới nhất
export async function GET(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const q = (new URL(req.url).searchParams.get('q') ?? '').trim();
  const supabase = createAdminClient();

  let query = supabase
    .from('issued_vouchers')
    .select(`
      id, code, customer_phone, status, expires_at, redeemed_at, redeemed_note, created_at,
      campaign:voucher_campaigns ( name, reward_type, reward_value, reward_note ),
      booking:bookings!issued_vouchers_source_booking_id_fkey ( court_name, booking_date, start_time )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (q) {
    // Mã voucher (chứa chữ) hoặc số điện thoại (chỉ số)
    if (/^[0-9+\s.\-()]+$/.test(q)) {
      query = query.eq('customer_phone', q.replace(/[\s.\-()]/g, ''));
    } else {
      query = query.eq('code', q.toUpperCase());
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Đánh dấu hết hạn khi đọc (không cần cron riêng)
  const now = Date.now();
  const vouchers = (data ?? []).map(v => ({
    ...v,
    status: v.status === 'issued' && new Date(v.expires_at).getTime() < now ? 'expired' : v.status,
  }));

  return NextResponse.json({ vouchers });
}
