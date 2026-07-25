import { describe, it, expect } from 'vitest';
import { deriveBandProgress, applyPoints, effectivePoints, bandLabel, replayLedger } from './rating';

describe('deriveBandProgress', () => {
  it('hiệu dụng 100 → A100 tiến độ 0 (sàn)', () => {
    expect(deriveBandProgress(100)).toEqual({ band: 100, progress: 0 });
  });
  it('dưới sàn → kẹp về A100 tiến độ 0', () => {
    expect(deriveBandProgress(50)).toEqual({ band: 100, progress: 0 });
    expect(deriveBandProgress(0)).toEqual({ band: 100, progress: 0 });
  });
  it('360 → A300 tiến độ 60', () => {
    expect(deriveBandProgress(360)).toEqual({ band: 300, progress: 60 });
  });
  it('460 → A400 tiến độ 60', () => {
    expect(deriveBandProgress(460)).toEqual({ band: 400, progress: 60 });
  });
  it('250 → A200 tiến độ 50', () => {
    expect(deriveBandProgress(250)).toEqual({ band: 200, progress: 50 });
  });
  it('500 → A500 tiến độ 0', () => {
    expect(deriveBandProgress(500)).toEqual({ band: 500, progress: 0 });
  });
  it('630 → A500 tiến độ 130 (không có A600)', () => {
    expect(deriveBandProgress(630)).toEqual({ band: 500, progress: 130 });
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
    expect(applyPoints(300, 60, 100)).toEqual({ band: 400, progress: 60 });
  });
  it('A300 tiến độ 60 +50 → A400 tiến độ 10', () => {
    expect(applyPoints(300, 60, 50)).toEqual({ band: 400, progress: 10 });
  });
  it('A100 tiến độ 90 +60 → A200 tiến độ 50', () => {
    expect(applyPoints(100, 90, 60)).toEqual({ band: 200, progress: 50 });
  });
  it('A100 tiến độ 0 +450 → A500 tiến độ 50', () => {
    expect(applyPoints(100, 0, 450)).toEqual({ band: 500, progress: 50 });
  });
  it('A500 tiến độ 30 +100 → A500 tiến độ 130 (không lên A600)', () => {
    expect(applyPoints(500, 30, 100)).toEqual({ band: 500, progress: 130 });
  });
  it('A200 tiến độ 40 −40 → A200 tiến độ 0', () => {
    expect(applyPoints(200, 40, -40)).toEqual({ band: 200, progress: 0 });
  });
  it('A300 tiến độ 10 −50 → A200 tiến độ 60 (bút toán âm hạ band)', () => {
    expect(applyPoints(300, 10, -50)).toEqual({ band: 200, progress: 60 });
  });
  it('A100 tiến độ 0 −50 → vẫn A100 tiến độ 0 (sàn)', () => {
    expect(applyPoints(100, 0, -50)).toEqual({ band: 100, progress: 0 });
  });
  it('cộng 0 → không đổi', () => {
    expect(applyPoints(300, 40, 0)).toEqual({ band: 300, progress: 40 });
  });
});

describe('replayLedger', () => {
  it('cộng dồn: initial 300, +100, +50, −50 → A400 tiến độ 0, hiệu dụng 400', () => {
    const events = [{ points: 300 }, { points: 100 }, { points: 50 }, { points: -50 }];
    expect(replayLedger(events)).toEqual({ band: 400, progress: 0, effective: 400 });
  });
  it('sổ rỗng → sàn A100', () => {
    expect(replayLedger([])).toEqual({ band: 100, progress: 0, effective: 100 });
  });
});
