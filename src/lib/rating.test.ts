import { describe, it, expect } from 'vitest';
import { deriveBandProgress } from './rating';

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
