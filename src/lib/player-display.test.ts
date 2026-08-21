import { describe, it, expect } from 'vitest';
import { boDau } from './player-display';

describe('boDau — chuẩn hoá chuỗi để tìm kiếm', () => {
  it('bỏ dấu thanh và dấu mũ', () => {
    expect(boDau('Nguyễn Hoàng Ánh')).toBe('nguyen hoang anh');
  });

  it('đổi đ thành d — NFD không tách được chữ này', () => {
    expect(boDau('Đặng Đức')).toBe('dang duc');
  });

  it('hạ chữ thường', () => {
    expect(boDau('TRẦN')).toBe('tran');
  });

  it('chuỗi đã không dấu thì giữ nguyên', () => {
    expect(boDau('minh 01')).toBe('minh 01');
  });

  it('chuỗi rỗng ra chuỗi rỗng', () => {
    expect(boDau('')).toBe('');
  });

  it('gõ không dấu khớp được tên có dấu', () => {
    expect(boDau('Lê Đăng Khoa').includes(boDau('dang khoa'))).toBe(true);
  });
});
