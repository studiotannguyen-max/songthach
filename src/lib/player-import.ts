import { BANDS } from './rating';

export type RawRow = {
  rowNum: number;
  full_name?: string; nickname?: string; phone?: string;
  band?: string; progress_points?: string; tested_at?: string; test_note?: string;
};
export type ExistingPlayer = { id: string; full_name: string; phone: string | null; band: number; progress_points: number };
export type ParsedRow = {
  full_name: string; nickname: string | null; phone: string | null;
  band: number; progress_points: number; tested_at: string | null; test_note: string | null;
};
export type Reconciled = {
  rowNum: number;
  kind: 'new' | 'update' | 'same' | 'error';
  errors: string[];
  autoSelect: boolean;
  parsed: ParsedRow;
  existingId?: string;
  warning?: string;
};

/** Chuẩn hoá SĐT: bỏ ký tự không phải số, +84 (dạng quốc tế đủ 11 số) → 0. */
export function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  // Chỉ coi '84' là mã quốc gia khi ở dạng quốc tế đủ 11 số (84 + 9 số trong nước);
  // tránh cắt nhầm số nội địa đầu 084... khi Excel làm rớt số 0 ở đầu.
  if (digits.startsWith('84') && digits.length === 11) return '0' + digits.slice(2);
  return digits;
}

/** "A300" | "300" | "a500" → số; sai → null. */
export function parseBand(raw: unknown): number | null {
  if (raw == null) return null;
  const s = String(raw).trim().toUpperCase().replace(/^A/, '');
  const n = Number(s);
  return (BANDS as number[]).includes(n) ? n : null;
}

function parseProgress(raw: unknown): number | null {
  if (raw == null || String(raw).trim() === '') return 0;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

function sameData(p: ParsedRow, e: ExistingPlayer): boolean {
  return p.full_name.trim() === e.full_name.trim() && p.band === e.band && p.progress_points === e.progress_points;
}

export function reconcileImport(rows: RawRow[], existing: ExistingPlayer[]): Reconciled[] {
  const byPhone = new Map<string, ExistingPlayer>();
  for (const e of existing) { const k = normalizePhone(e.phone); if (k) byPhone.set(k, e); }

  const seenInFile = new Set<string>();
  const out: Reconciled[] = [];

  for (const row of rows) {
    const errors: string[] = [];
    const full = (row.full_name ?? '').trim();
    if (!full) errors.push('Thiếu họ tên');

    const band = parseBand(row.band);
    if (band == null) errors.push('Mức trình phải là A100, A200, A300, A400 hoặc A500');

    const progress = parseProgress(row.progress_points);
    if (progress == null) errors.push('Điểm tiến độ phải là số không âm');
    else if (band != null && band < 500 && progress >= 100) errors.push('Tiến độ vượt mốc 100 khi chưa phải A500');

    const phoneKey = normalizePhone(row.phone);
    if (phoneKey && seenInFile.has(phoneKey)) errors.push('Trùng số điện thoại với dòng khác trong file');
    if (phoneKey) seenInFile.add(phoneKey);

    const parsed: ParsedRow = {
      full_name: full, nickname: row.nickname?.trim() || null, phone: row.phone?.trim() || null,
      band: band ?? 100, progress_points: progress ?? 0,
      tested_at: row.tested_at?.trim() || null, test_note: row.test_note?.trim() || null,
    };

    if (errors.length) { out.push({ rowNum: row.rowNum, kind: 'error', errors, autoSelect: false, parsed }); continue; }

    const match = phoneKey ? byPhone.get(phoneKey) : undefined;
    if (!match) { out.push({ rowNum: row.rowNum, kind: 'new', errors: [], autoSelect: true, parsed }); continue; }

    if (sameData(parsed, match)) {
      out.push({ rowNum: row.rowNum, kind: 'same', errors: [], autoSelect: false, parsed, existingId: match.id });
      continue;
    }

    // Cập nhật khác dữ liệu: cảnh báo nếu làm giảm điểm hiệu dụng
    const oldEff = match.band + match.progress_points;
    const newEff = parsed.band + parsed.progress_points;
    const losesData = newEff < oldEff;
    out.push({
      rowNum: row.rowNum, kind: 'update', errors: [], autoSelect: !losesData, parsed, existingId: match.id,
      warning: losesData ? `File sẽ giảm điểm hiệu dụng ${oldEff} → ${newEff}` : undefined,
    });
  }
  return out;
}
