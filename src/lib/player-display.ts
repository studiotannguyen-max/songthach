/** Chữ cái đầu tên để làm ảnh đại diện mặc định khi VĐV chưa có ảnh. */
export function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}

/** Một dòng trong sổ điểm rating_events. */
export interface RatingEvent {
  id: string;
  points: number;
  reason: string;
  note: string | null;
  created_at: string;
}
