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
