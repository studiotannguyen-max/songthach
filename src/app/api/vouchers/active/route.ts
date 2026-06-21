import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/vouchers/active?venue_type=badminton|football_5|football_7
// Trả nội dung ưu đãi của chương trình đang bật (admin chỉnh ở /admin/vouchers),
// để hiển thị công khai trước khi khách đặt sân — không hardcode nội dung quà tặng.
export async function GET(req: NextRequest) {
  const venueType = new URL(req.url).searchParams.get('venue_type');
  if (!venueType) {
    return NextResponse.json({ reward_note: null, valid_days: null });
  }

  const trigger = venueType === 'badminton' ? 'booking_badminton' : 'booking_football';

  const admin = createAdminClient();
  const { data: campaign } = await admin
    .from('voucher_campaigns')
    .select('reward_note, valid_days')
    .eq('trigger_type', trigger)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    reward_note: campaign?.reward_note ?? null,
    valid_days:  campaign?.valid_days ?? null,
  });
}
