import { describe, it, expect } from 'vitest';
import { boDau, khopTim, type CoTheTim } from './player-display';

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

describe('khopTim — luật khớp của ô tìm', () => {
  const duong: CoTheTim = { full_name: 'Phạm Nam Dương', nickname: null, band: 200, progress_points: 50 };
  const khoa:  CoTheTim = { full_name: 'Lê Khoa', nickname: 'Khoa Lê', band: 300, progress_points: 0 };

  it('chuỗi rỗng thì ai cũng khớp — chưa gõ gì thì hiện cả bảng', () => {
    expect(khopTim(duong, '')).toBe(true);
  });

  it('khớp tên thật, bỏ dấu', () => {
    expect(khopTim(duong, 'pham')).toBe(true);
  });

  it('khớp biệt danh', () => {
    expect(khopTim(khoa, 'khoa le')).toBe(true);
  });

  it('gõ số trần "200" ra nhóm A200', () => {
    expect(khopTim(duong, '200')).toBe(true);
  });

  it('gõ "a200" cũng ra nhóm A200', () => {
    expect(khopTim(duong, 'a200')).toBe(true);
  });

  it('A300 không lọt vào kết quả tìm "200"', () => {
    expect(khopTim(khoa, '200')).toBe(false);
  });

  it('gõ điểm hiệu dụng "250" ra người A200 đang tích 50', () => {
    expect(khopTim(duong, '250')).toBe(true);
  });

  it('không khớp thì trả false', () => {
    expect(khopTim(duong, 'xyz')).toBe(false);
  });

  it('nickname null không làm nổ hàm', () => {
    expect(khopTim(duong, 'khoa')).toBe(false);
  });
});
