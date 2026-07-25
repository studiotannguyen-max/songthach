import { describe, it, expect } from 'vitest';
import { normalizePhone, parseBand, reconcileImport, type RawRow, type ExistingPlayer } from './player-import';

describe('normalizePhone', () => {
  it('chuẩn hoá các cách viết về cùng một số', () => {
    expect(normalizePhone('0988918418')).toBe('0988918418');
    expect(normalizePhone('0988.918.418')).toBe('0988918418');
    expect(normalizePhone('+84 988 918 418')).toBe('0988918418');
    expect(normalizePhone('')).toBe('');
    expect(normalizePhone(null)).toBe('');
  });

  it('không cắt nhầm số nội địa 084 bị rớt số 0 đầu', () => {
    // 841234567 (9 số) là 0841234567 bị Excel rớt số 0, KHÔNG phải mã quốc gia
    expect(normalizePhone('841234567')).toBe('841234567');
  });

  it('vẫn chuẩn hoá đúng dạng quốc tế đủ 11 số', () => {
    expect(normalizePhone('84841234567')).toBe('0841234567');
  });
});

describe('parseBand', () => {
  it('nhận A300 và 300', () => {
    expect(parseBand('A300')).toBe(300);
    expect(parseBand('300')).toBe(300);
    expect(parseBand('a500')).toBe(500);
  });
  it('trả null khi sai', () => {
    expect(parseBand('A250')).toBe(null);
    expect(parseBand('abc')).toBe(null);
    expect(parseBand('')).toBe(null);
  });
});

describe('reconcileImport', () => {
  const existing: ExistingPlayer[] = [
    { id: 'p1', full_name: 'Lê Đăng Khoa', phone: '0938771209', band: 400, progress_points: 60 },
    { id: 'p2', full_name: 'Bùi Thị Tú Anh', phone: '0356882470', band: 200, progress_points: 50 },
  ];

  it('người mới (SĐT chưa có)', () => {
    const rows: RawRow[] = [{ rowNum: 2, full_name: 'Ngô Quang Huy', band: 'A100', phone: '0964118220' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('new');
    expect(r[0].autoSelect).toBe(true);
  });

  it('thiếu họ tên → lỗi', () => {
    const rows: RawRow[] = [{ rowNum: 3, band: 'A100', phone: '0900000000' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('error');
    expect(r[0].errors.join(' ')).toMatch(/họ tên/i);
  });

  it('mức trình sai → lỗi', () => {
    const rows: RawRow[] = [{ rowNum: 4, full_name: 'X', band: 'A250', phone: '0900000001' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('error');
  });

  it('tiến độ ≥100 khi chưa A500 → lỗi', () => {
    const rows: RawRow[] = [{ rowNum: 5, full_name: 'Y', band: 'A300', progress_points: '120', phone: '0900000002' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('error');
  });

  it('đã có, khác dữ liệu (nâng trình) → update, tự tích', () => {
    const rows: RawRow[] = [{ rowNum: 6, full_name: 'Lê Đăng Khoa', band: 'A500', progress_points: '0', phone: '0938.771.209' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('update');
    expect(r[0].existingId).toBe('p1');
    expect(r[0].autoSelect).toBe(true);
  });

  it('đã có, y hệt → same, không tích', () => {
    const rows: RawRow[] = [{ rowNum: 7, full_name: 'Lê Đăng Khoa', band: 'A400', progress_points: '60', phone: '0938771209' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('same');
    expect(r[0].autoSelect).toBe(false);
  });

  it('cập nhật chỉ đổi thông tin, điểm hiệu dụng không đổi → vẫn tự tích', () => {
    const rows: RawRow[] = [{ rowNum: 9, full_name: 'Lê Đăng Khoa (biệt danh mới)', band: 'A400', progress_points: '60', phone: '0938771209' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('update');
    expect(r[0].autoSelect).toBe(true);
    expect(r[0].warning).toBeUndefined();
  });

  it('cập nhật làm mất điểm mà không thêm gì → không tự tích', () => {
    // File để trống tiến độ (→0) trong khi hệ thống đang có 50
    const rows: RawRow[] = [{ rowNum: 8, full_name: 'Bùi Thị Tú Anh', band: 'A200', phone: '0356882470' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('update');
    expect(r[0].autoSelect).toBe(false);
    expect(r[0].warning).toMatch(/mất|xoá|giảm/i);
  });

  it('hai dòng cùng file trùng SĐT → dòng sau lỗi', () => {
    const rows: RawRow[] = [
      { rowNum: 2, full_name: 'A', band: 'A100', phone: '0900001111' },
      { rowNum: 3, full_name: 'B', band: 'A100', phone: '0900001111' },
    ];
    const r = reconcileImport(rows, existing);
    expect(r[1].kind).toBe('error');
    expect(r[1].errors.join(' ')).toMatch(/trùng/i);
  });

  it('nhập lại đúng dữ liệu đã có → toàn bộ same', () => {
    const rows: RawRow[] = [
      { rowNum: 2, full_name: 'Lê Đăng Khoa', band: 'A400', progress_points: '60', phone: '0938771209' },
      { rowNum: 3, full_name: 'Bùi Thị Tú Anh', band: 'A200', progress_points: '50', phone: '0356882470' },
    ];
    const r = reconcileImport(rows, existing);
    expect(r.every(x => x.kind === 'same')).toBe(true);
  });
});
