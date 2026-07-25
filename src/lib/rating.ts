// Hệ điểm trình độ A100–A500. Hàm thuần, không đụng CSDL — test bằng vitest.
// Điểm hiệu dụng = band + progress. Sổ rating_events là nguồn sự thật; band/progress
// luôn suy ra được bằng deriveBandProgress(tổng điểm sổ).

export type Band = 100 | 200 | 300 | 400 | 500;
export const BANDS: Band[] = [100, 200, 300, 400, 500];

/**
 * Suy ra band + tiến độ từ tổng điểm hiệu dụng.
 * Sàn tuyệt đối: A100 tiến độ 0 (hiệu dụng 100). Trần band: A500, tiến độ chạy tiếp không giới hạn.
 */
export function deriveBandProgress(effective: number): { band: Band; progress: number } {
  const e = Math.max(100, Math.round(effective));
  if (e >= 500) return { band: 500, progress: e - 500 };
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
export function applyPoints(band: number, progress: number, delta: number): { band: Band; progress: number } {
  return deriveBandProgress(band + progress + delta);
}

/** Chạy lại toàn bộ sổ điểm từ đầu — dùng để đối soát với cột đã lưu. */
export function replayLedger(events: { points: number }[]): { band: Band; progress: number; effective: number } {
  const sum = events.reduce((s, e) => s + e.points, 0);
  const { band, progress } = deriveBandProgress(sum);
  return { band, progress, effective: band + progress };
}
