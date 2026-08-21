/** Chữ cái đầu tên để làm ảnh đại diện mặc định khi VĐV chưa có ảnh. */
export function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}

/** Bỏ dấu + hạ chữ thường để so khớp khi tìm: gõ "nguyen hoang" vẫn ra "Nguyễn Hoàng".
 *  NFD tách được dấu thanh thành ký tự tổ hợp U+0300–U+036F, nhưng không đụng tới
 *  đ/Đ nên phải thay tay. */
export function boDau(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

/** Một dòng trong sổ điểm rating_events. */
export interface RatingEvent {
  id: string;
  points: number;
  reason: string;
  note: string | null;
  created_at: string;
}
