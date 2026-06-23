import { VenueType } from '@/types';

// Giá theo khung giờ — áp dụng chung cho mọi ngày (không phân biệt cuối tuần)
const PRICE_MAP: Record<VenueType, [normal: number, peak: number]> = {
  badminton:  [50000,  60000],
  football_5: [120000, 170000],
  football_7: [300000, 350000],
};

export function isPeakHour(slotStart: string): boolean {
  const hour = parseInt(slotStart.split(':')[0]);
  return hour >= 17 && hour < 22;
}

export function getPriceRules(slotStart: string, type: VenueType) {
  const [norm, peak] = PRICE_MAP[type];
  return isPeakHour(slotStart)
    ? { price: peak, label: 'Giờ vàng (17:00 - 22:00)' }
    : { price: norm, label: 'Giờ thường' };
}

export interface PriceSegment { label: string; price: number; hours: number; }

// Tính tổng tiền theo từng mốc 30', vì 1 lượt đặt có thể giao nhau giữa giờ thường và giờ vàng
// (VD: đặt 15:00-18:00 thì 15:00-17:00 là giờ thường, 17:00-18:00 là giờ vàng).
export function calculateBookingPrice(startTime: string, duration: number, type: VenueType) {
  const [norm, peak] = PRICE_MAP[type];
  const [h, m]     = startTime.split(':').map(Number);
  const startMin   = h * 60 + m;
  const totalMin   = Math.round(duration * 60);
  const STEP       = 30;

  let normalHours = 0;
  let peakHours   = 0;
  for (let t = startMin; t < startMin + totalMin; t += STEP) {
    const hour = Math.floor((t % (24 * 60)) / 60);
    if (hour >= 17 && hour < 22) peakHours += STEP / 60;
    else normalHours += STEP / 60;
  }

  const segments: PriceSegment[] = [];
  if (normalHours > 0) segments.push({ label: 'Giờ thường', price: norm, hours: normalHours });
  if (peakHours > 0)   segments.push({ label: 'Giờ vàng (17:00 - 22:00)', price: peak, hours: peakHours });

  const total = normalHours * norm + peakHours * peak;
  return { total, segments };
}
