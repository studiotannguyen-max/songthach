import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// PATCH /api/admin/vouchers/:id — Đổi voucher tại quầy (hoặc thu hồi)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { action, note } = await req.json();
  if (!['redeem', 'revoke'].includes(action)) {
    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: voucher, error: findError } = await supabase
    .from('issued_vouchers')
    .select('id, status, expires_at')
    .eq('id', params.id)
    .single();

  if (findError || !voucher) {
    return NextResponse.json({ error: 'Không tìm thấy voucher' }, { status: 404 });
  }

  if (action === 'redeem') {
    if (voucher.status !== 'issued') {
      return NextResponse.json({ error: `Voucher không còn hiệu lực (trạng thái: ${voucher.status})` }, { status: 409 });
    }
    if (new Date(voucher.expires_at).getTime() < Date.now()) {
      await supabase.from('issued_vouchers').update({ status: 'expired' }).eq('id', voucher.id);
      return NextResponse.json({ error: 'Voucher đã hết hạn' }, { status: 409 });
    }
  }

  const { error } = await supabase
    .from('issued_vouchers')
    .update(
      action === 'redeem'
        ? { status: 'redeemed', redeemed_at: new Date().toISOString(), redeemed_note: note || null }
        : { status: 'revoked' },
    )
    .eq('id', voucher.id)
    .eq('status', voucher.status); // chặn 2 nhân viên cùng đổi 1 voucher

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
