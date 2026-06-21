import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { issueVoucherForBooking, revokeVouchersForBooking } from '@/lib/vouchers';
import { sendVoucherEmail } from '@/lib/email';
import { awardPointsForBooking } from '@/lib/points';

// PATCH /api/admin/bookings/:id — Cập nhật trạng thái
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { status } = await req.json();

  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', params.id)
    .select('id, venue_type, user_id, user_phone, user_email, user_name, total_price')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Khuyến mãi chéo: xác nhận (đã nhận cọc) → phát voucher nước; hủy → thu hồi voucher chưa dùng
  let voucher_code: string | null = null;
  try {
    if (status === 'confirmed' && booking) {
      const voucher = await issueVoucherForBooking(supabase, booking);
      voucher_code = voucher?.code ?? null;

      // Gửi mã voucher cho khách qua email — lỗi email không chặn response
      if (voucher && booking.user_email) {
        sendVoucherEmail({
          to:          booking.user_email,
          user_name:   booking.user_name ?? null,
          code:        voucher.code,
          reward_note: voucher.reward_note,
          expires_at:  voucher.expires_at,
        }).catch(err => console.error('[Email] Gửi voucher thất bại:', err));
      }

      await awardPointsForBooking(supabase, booking);
    } else if (status === 'cancelled' && booking) {
      await revokeVouchersForBooking(supabase, booking.id);
    }
  } catch (e) {
    // Voucher/điểm lỗi không được chặn việc đổi trạng thái booking
    console.error('[Voucher/Points] Lỗi phát/thu hồi:', e);
  }

  return NextResponse.json({ success: true, voucher_code });
}
