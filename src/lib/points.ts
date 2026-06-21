import type { SupabaseClient } from '@supabase/supabase-js';

export const POINTS_PER_VND = 1 / 10_000; // 10.000đ = 1 điểm (tích)
export const VND_PER_POINT  = 1_000;       // 1 điểm = 1.000đ (đổi)

/** Tổng điểm hiện có của user — tính từ sổ point_transactions, không lưu số dư rời rạc. */
export async function getUserPointsBalance(admin: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await admin
    .from('point_transactions')
    .select('points')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + row.points, 0);
}

/** Cộng điểm khi booking được xác nhận. Không làm gì nếu booking không có user_id (khách vãng lai). */
export async function awardPointsForBooking(
  admin: SupabaseClient,
  booking: { id: string; user_id: string | null; total_price: number },
): Promise<void> {
  if (!booking.user_id) return;
  const points = Math.floor(booking.total_price * POINTS_PER_VND);
  if (points <= 0) return;

  await admin.from('point_transactions').insert({
    user_id:    booking.user_id,
    booking_id: booking.id,
    type:       'earn',
    points,
    note:       `Tích điểm từ đặt sân #${booking.id.slice(0, 8).toUpperCase()}`,
  });
}

/** Trừ điểm khi khách dùng điểm giảm giá lúc đặt sân. Gọi sau khi đã validate đủ điểm. */
export async function redeemPoints(
  admin: SupabaseClient,
  params: { userId: string; bookingId: string; points: number },
): Promise<void> {
  if (params.points <= 0) return;
  await admin.from('point_transactions').insert({
    user_id:    params.userId,
    booking_id: params.bookingId,
    type:       'redeem',
    points:     -params.points,
    note:       `Dùng điểm giảm giá cho đặt sân #${params.bookingId.slice(0, 8).toUpperCase()}`,
  });
}
