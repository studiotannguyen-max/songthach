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
