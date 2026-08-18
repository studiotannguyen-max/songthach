import { describe, it, expect } from 'vitest';
import { deriveBandProgress, applyPoints, effectivePoints, bandLabel, replayLedger, checkEventEdit, canDeleteEvent, bandsFor } from './rating';

describe('deriveBandProgress — nam (trần A500)', () => {
  it('hiệu dụng 100 → A100 tiến độ 0 (sàn)', () => {
    expect(deriveBandProgress(100, 'nam')).toEqual({ band: 100, progress: 0 });
  });
  it('dưới sàn → kẹp về A100 tiến độ 0', () => {
    expect(deriveBandProgress(50, 'nam')).toEqual({ band: 100, progress: 0 });
    expect(deriveBandProgress(0, 'nam')).toEqual({ band: 100, progress: 0 });
  });
  it('360 → A300 tiến độ 60', () => {
    expect(deriveBandProgress(360, 'nam')).toEqual({ band: 300, progress: 60 });
  });
  it('460 → A400 tiến độ 60', () => {
    expect(deriveBandProgress(460, 'nam')).toEqual({ band: 400, progress: 60 });
  });
  it('250 → A200 tiến độ 50', () => {
    expect(deriveBandProgress(250, 'nam')).toEqual({ band: 200, progress: 50 });
  });
  it('500 → A500 tiến độ 0', () => {
    expect(deriveBandProgress(500, 'nam')).toEqual({ band: 500, progress: 0 });
  });
  it('630 → A500 tiến độ 130 (không có A600)', () => {
    expect(deriveBandProgress(630, 'nam')).toEqual({ band: 500, progress: 130 });
  });
});

describe('deriveBandProgress — nữ (trần A400)', () => {
  it('sàn A100 giữ nguyên như nam', () => {
    expect(deriveBandProgress(100, 'nu')).toEqual({ band: 100, progress: 0 });
    expect(deriveBandProgress(30, 'nu')).toEqual({ band: 100, progress: 0 });
  });
  it('dưới trần thì chia hạng y như nam', () => {
    expect(deriveBandProgress(360, 'nu')).toEqual({ band: 300, progress: 60 });
    expect(deriveBandProgress(250, 'nu')).toEqual({ band: 200, progress: 50 });
  });
  it('400 → A400 tiến độ 0', () => {
    expect(deriveBandProgress(400, 'nu')).toEqual({ band: 400, progress: 0 });
  });
  it('vượt trần thì dồn hết vào tiến độ, không lên A500', () => {
    expect(deriveBandProgress(460, 'nu')).toEqual({ band: 400, progress: 60 });
    expect(deriveBandProgress(630, 'nu')).toEqual({ band: 400, progress: 230 });
  });
  it('cùng một điểm hiệu dụng, hai giới quy ra hạng khác nhau', () => {
    expect(deriveBandProgress(520, 'nu')).toEqual({ band: 400, progress: 120 });
    expect(deriveBandProgress(520, 'nam')).toEqual({ band: 500, progress: 20 });
  });
});

describe('bandsFor', () => {
  it('nam có đủ 5 hạng', () => {
    expect(bandsFor('nam')).toEqual([100, 200, 300, 400, 500]);
  });
  it('nữ dừng ở A400, không có A500', () => {
    expect(bandsFor('nu')).toEqual([100, 200, 300, 400]);
  });
});

describe('effectivePoints', () => {
  it('cộng band và tiến độ', () => {
    expect(effectivePoints({ band: 400, progress_points: 60 })).toBe(460);
  });
});

describe('bandLabel', () => {
  it('gắn tiền tố A', () => {
    expect(bandLabel(300)).toBe('A300');
    expect(bandLabel(500)).toBe('A500');
  });
});

describe('applyPoints', () => {
  it('A300 tiến độ 60 +100 → A400 tiến độ 60', () => {
    expect(applyPoints(300, 60, 100, 'nam')).toEqual({ band: 400, progress: 60 });
  });
  it('A300 tiến độ 60 +50 → A400 tiến độ 10', () => {
    expect(applyPoints(300, 60, 50, 'nam')).toEqual({ band: 400, progress: 10 });
  });
  it('A100 tiến độ 90 +60 → A200 tiến độ 50', () => {
    expect(applyPoints(100, 90, 60, 'nam')).toEqual({ band: 200, progress: 50 });
  });
  it('A100 tiến độ 0 +450 → A500 tiến độ 50', () => {
    expect(applyPoints(100, 0, 450, 'nam')).toEqual({ band: 500, progress: 50 });
  });
  it('A500 tiến độ 30 +100 → A500 tiến độ 130 (không lên A600)', () => {
    expect(applyPoints(500, 30, 100, 'nam')).toEqual({ band: 500, progress: 130 });
  });
  it('A200 tiến độ 40 −40 → A200 tiến độ 0', () => {
    expect(applyPoints(200, 40, -40, 'nam')).toEqual({ band: 200, progress: 0 });
  });
  it('A300 tiến độ 10 −50 → A200 tiến độ 60 (bút toán âm hạ band)', () => {
    expect(applyPoints(300, 10, -50, 'nam')).toEqual({ band: 200, progress: 60 });
  });
  it('A100 tiến độ 0 −50 → vẫn A100 tiến độ 0 (sàn)', () => {
    expect(applyPoints(100, 0, -50, 'nam')).toEqual({ band: 100, progress: 0 });
  });
  it('cộng 0 → không đổi', () => {
    expect(applyPoints(300, 40, 0, 'nam')).toEqual({ band: 300, progress: 40 });
  });
  it('nữ A400 tiến độ 50 +100 → A400 tiến độ 150, không có hạng nào để lên', () => {
    expect(applyPoints(400, 50, 100, 'nu')).toEqual({ band: 400, progress: 150 });
  });
  it('nữ A300 tiến độ 60 +100 → A400 tiến độ 60, dưới trần vẫn lên hạng bình thường', () => {
    expect(applyPoints(300, 60, 100, 'nu')).toEqual({ band: 400, progress: 60 });
  });
});

describe('replayLedger', () => {
  it('cộng dồn: initial 300, +100, +50, −50 → A400 tiến độ 0, hiệu dụng 400', () => {
    const events = [{ points: 300 }, { points: 100 }, { points: 50 }, { points: -50 }];
    expect(replayLedger(events, 'nam')).toEqual({ band: 400, progress: 0, effective: 400 });
  });
  it('sổ rỗng → sàn A100', () => {
    expect(replayLedger([], 'nam')).toEqual({ band: 100, progress: 0, effective: 100 });
  });
  it('cùng bộ sự kiện, nữ quy ra hạng khác nam', () => {
    const events = [{ points: 300 }, { points: 220 }];
    expect(replayLedger(events, 'nam')).toEqual({ band: 500, progress: 20, effective: 520 });
    expect(replayLedger(events, 'nu')).toEqual({ band: 400, progress: 120, effective: 520 });
  });
});

describe('checkEventEdit', () => {
  const ok = { reason: 'manual_adjust', points: 50, note: 'Vô địch giải hạng 600' };

  it('dòng điều chỉnh hợp lệ → null', () => {
    expect(checkEventEdit(ok)).toBeNull();
  });
  it('dòng xếp trình ban đầu hợp lệ → null', () => {
    expect(checkEventEdit({ reason: 'initial', points: 300, note: 'Xếp trình ban đầu' })).toBeNull();
  });
  it('điểm không phải số nguyên', () => {
    expect(checkEventEdit({ ...ok, points: 50.5 })).toBe('Điểm phải là số nguyên');
  });
  it('điểm là NaN', () => {
    expect(checkEventEdit({ ...ok, points: NaN })).toBe('Điểm phải là số nguyên');
  });
  it('lý do chỉ có khoảng trắng', () => {
    expect(checkEventEdit({ ...ok, note: '   ' })).toBe('Bắt buộc nhập lý do');
  });
  it('dòng xếp trình ban đầu dưới sàn 100', () => {
    expect(checkEventEdit({ reason: 'initial', points: 90, note: 'x' }))
      .toBe('Xếp trình ban đầu không được dưới 100');
  });
  it('dòng điều chỉnh bằng 0', () => {
    expect(checkEventEdit({ ...ok, points: 0 })).toBe('Số điểm phải khác 0');
  });
  it('dòng điều chỉnh âm vẫn hợp lệ', () => {
    expect(checkEventEdit({ ...ok, points: -50 })).toBeNull();
  });
});

describe('canDeleteEvent', () => {
  it('không cho xoá dòng xếp trình ban đầu', () => {
    expect(canDeleteEvent('initial')).toBe(false);
  });
  it('cho xoá dòng điều chỉnh tay', () => {
    expect(canDeleteEvent('manual_adjust')).toBe(true);
  });
});
