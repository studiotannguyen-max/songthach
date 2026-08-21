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

/** Những gì một VĐV có thể bị đem ra so khớp khi tìm. */
export interface CoTheTim {
  full_name: string;
  nickname: string | null;
  band: number;
  progress_points: number;
}

/**
 * Một VĐV có khớp chuỗi tìm hay không. Chuỗi tìm phải bỏ dấu sẵn bằng boDau().
 * Khớp trên bốn thứ người xem nhìn thấy ngay trên dòng đó:
 *   - tên thật và biệt danh — "nguyen" ra "Nguyễn";
 *   - mức trình, cả dạng có chữ lẫn không: "a200" và "200" đều ra nhóm A200;
 *   - điểm hiệu dụng: "250" ra người A200 đang tích 50 điểm tiến độ.
 * Gõ số là cách nhanh nhất để lọc theo trình mà không phải rời tay khỏi bàn phím.
 */
export function khopTim(p: CoTheTim, q: string): boolean {
  if (!q) return true;
  const hieuDung = p.band + p.progress_points;
  return boDau(p.full_name).includes(q)
    || boDau(p.nickname ?? '').includes(q)
    || `a${p.band}`.includes(q)
    || String(hieuDung).includes(q);
}

/** Một dòng trong sổ điểm rating_events. */
export interface RatingEvent {
  id: string;
  points: number;
  reason: string;
  note: string | null;
  created_at: string;
}
