import type { SupabaseClient } from '@supabase/supabase-js';

// Sinh mã voucher dạng ST-XXXXXX — bỏ các ký tự dễ nhầm (0/O, 1/I/L)
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function generateVoucherCode(): string {
  let s = '';
  for (let i = 0; i < 6; i++) {
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `ST-${s}`;
}

interface BookingForVoucher {
  id: string;
  venue_type: string;       // badminton | football_5 | football_7
  user_phone: string;
}

export interface IssuedVoucherInfo {
  code:        string;
  reward_note: string;
  expires_at:  string;
}

/**
 * Phát voucher cho một booking vừa được xác nhận.
 * - Tìm chương trình đang bật khớp với loại sân.
 * - Idempotent: unique index (source_booking_id, campaign_id) chặn phát trùng
 *   nếu admin bấm xác nhận nhiều lần.
 * Trả về thông tin voucher mới phát (hoặc null nếu không có chương trình / đã phát rồi).
 */
export async function issueVoucherForBooking(
  admin: SupabaseClient,
  booking: BookingForVoucher,
): Promise<IssuedVoucherInfo | null> {
  const trigger = booking.venue_type === 'badminton' ? 'booking_badminton' : 'booking_football';

  const { data: campaign } = await admin
    .from('voucher_campaigns')
    .select('id, valid_days, reward_note')
    .eq('trigger_type', trigger)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (!campaign) return null;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (campaign.valid_days ?? 7));

  // Thử tối đa 3 lần phòng trùng mã ngẫu nhiên
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateVoucherCode();
    const { error } = await admin.from('issued_vouchers').insert({
      campaign_id:       campaign.id,
      code,
      customer_phone:    booking.user_phone,
      source_booking_id: booking.id,
      expires_at:        expiresAt.toISOString(),
    });

    if (!error) {
      return {
        code,
        reward_note: campaign.reward_note ?? 'Quà tặng từ Song Thạch',
        expires_at:  expiresAt.toISOString(),
      };
    }
    // 23505 = unique violation: trùng code → thử lại; trùng booking+campaign → đã phát rồi
    if (error.code === '23505' && error.message.includes('one_voucher_per_booking')) return null;
    if (error.code !== '23505') throw error;
  }
  return null;
}

/** Thu hồi các voucher chưa dùng khi booking bị hủy. */
export async function revokeVouchersForBooking(
  admin: SupabaseClient,
  bookingId: string,
): Promise<void> {
  await admin
    .from('issued_vouchers')
    .update({ status: 'revoked' })
    .eq('source_booking_id', bookingId)
    .eq('status', 'issued');
}
