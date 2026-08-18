// Hệ điểm trình độ A100–A500. Hàm thuần, không đụng CSDL — test bằng vitest.
// Điểm hiệu dụng = band + progress. Sổ rating_events là nguồn sự thật; band/progress
// luôn suy ra được bằng deriveBandProgress(tổng điểm sổ).

export type Band = 100 | 200 | 300 | 400 | 500;
export const BANDS: Band[] = [100, 200, 300, 400, 500];

export type Gender = 'nam' | 'nu';

/** Trần hạng theo giới. Chạm trần thì điểm cộng thêm dồn vào tiến độ, chạy không giới hạn. */
export const BAND_CEILING: Record<Gender, Band> = { nam: 500, nu: 400 };

/** Các hạng hợp lệ của một giới — nữ dừng ở A400. */
export function bandsFor(gender: Gender): Band[] {
  return BANDS.filter(b => b <= BAND_CEILING[gender]);
}

/**
 * Suy ra band + tiến độ từ tổng điểm hiệu dụng.
 * Sàn tuyệt đối: A100 tiến độ 0 (hiệu dụng 100). Trần tuỳ giới — xem BAND_CEILING.
 * `gender` cố tình không có giá trị mặc định: thiếu thì trình biên dịch báo,
 * còn hơn âm thầm tính mọi người theo thang nam.
 */
export function deriveBandProgress(effective: number, gender: Gender): { band: Band; progress: number } {
  const e = Math.max(100, Math.round(effective));
  const tran = BAND_CEILING[gender];
  if (e >= tran) return { band: tran, progress: e - tran };
  const band = (Math.floor(e / 100) * 100) as Band;
  return { band, progress: e - band };
}

/** Điểm hiệu dụng = band + tiến độ. */
export function effectivePoints(p: { band: number; progress_points: number }): number {
  return p.band + p.progress_points;
}

/** Nhãn hiển thị: 300 → "A300". */
export function bandLabel(band: number): string {
  return `A${band}`;
}

/**
 * Áp một khoản điểm (dương hoặc âm) lên (band, progress) hiện tại.
 * Delta bất kỳ — spec giải đấu sau này truyền +50; điều chỉnh tay truyền số admin nhập.
 */
export function applyPoints(band: number, progress: number, delta: number, gender: Gender): { band: Band; progress: number } {
  return deriveBandProgress(band + progress + delta, gender);
}

/**
 * Kiểm tra một lần sửa dòng sổ. Trả câu lỗi tiếng Việt, hoặc null nếu hợp lệ.
 * Dòng 'initial' giữ điểm hiệu dụng tuyệt đối nên phải từ sàn 100 trở lên;
 * các dòng còn lại là khoản cộng/trừ nên bằng 0 là vô nghĩa.
 */
export function checkEventEdit(input: { reason: string; points: number; note: string }): string | null {
  if (!Number.isInteger(input.points)) return 'Điểm phải là số nguyên';
  if (!input.note.trim()) return 'Bắt buộc nhập lý do';
  if (input.reason === 'initial') {
    if (input.points < 100) return 'Xếp trình ban đầu không được dưới 100';
  } else if (input.points === 0) {
    return 'Số điểm phải khác 0';
  }
  return null;
}

/** Dòng 'initial' là điểm gốc của cả sổ — xoá đi thì mọi thứ tụt về sàn A100. */
export function canDeleteEvent(reason: string): boolean {
  return reason !== 'initial';
}

/** Chạy lại toàn bộ sổ điểm từ đầu — dùng để đối soát với cột đã lưu. */
export function replayLedger(events: { points: number }[], gender: Gender): { band: Band; progress: number; effective: number } {
  const sum = events.reduce((s, e) => s + e.points, 0);
  const { band, progress } = deriveBandProgress(sum, gender);
  return { band, progress, effective: band + progress };
}
