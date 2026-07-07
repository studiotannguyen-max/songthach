// src/lib/finance.ts
export type FinanceType = 'thu' | 'chi';
export type FinanceCategory = 'luong' | 'dien_nuoc' | 'dung_cu' | 'sua_chua' | 'khac';

export const CATEGORY_LABELS: Record<FinanceCategory, string> = {
  luong:      'Lương',
  dien_nuoc:  'Điện nước',
  dung_cu:    'Dụng cụ sân',
  sua_chua:   'Sửa chữa',
  khac:       'Khác',
};

export interface FinanceEntryRow {
  id: string;
  entry_date: string; // YYYY-MM-DD
  type: FinanceType;
  category: FinanceCategory | null;
  description: string;
  amount: number;
  note: string | null;
  created_at: string;
}

export interface FinanceEntryWithBalance extends FinanceEntryRow {
  balance: number;
}

export interface LedgerSummary {
  entries: FinanceEntryWithBalance[];
  totalThu: number;
  totalChi: number;
  balanceAtMonthEnd: number;
}

/**
 * allEntries phải đã sort theo entry_date rồi created_at tăng dần.
 * month dạng "YYYY-MM". Số dư tính luỹ kế từ toàn bộ lịch sử, không reset theo tháng.
 */
export function computeLedger(allEntries: FinanceEntryRow[], month: string): LedgerSummary {
  let running = 0;
  let balanceAtMonthEnd = 0;
  const monthEntries: FinanceEntryWithBalance[] = [];
  let totalThu = 0;
  let totalChi = 0;

  for (const entry of allEntries) {
    running += entry.type === 'thu' ? entry.amount : -entry.amount;
    const entryMonth = entry.entry_date.slice(0, 7);

    if (entryMonth === month) {
      monthEntries.push({ ...entry, balance: running });
      if (entry.type === 'thu') totalThu += entry.amount;
      else totalChi += entry.amount;
    }
    if (entryMonth <= month) {
      balanceAtMonthEnd = running;
    }
  }

  return { entries: monthEntries, totalThu, totalChi, balanceAtMonthEnd };
}

export interface FinanceInputPayload {
  entry_date: string;
  type: FinanceType;
  category: FinanceCategory | null;
  description: string;
  amount: number;
  note: string | null;
}

export function validateFinanceInput(body: unknown): { data: FinanceInputPayload } | { error: string } {
  if (typeof body !== 'object' || body === null) return { error: 'Dữ liệu không hợp lệ' };
  const b = body as Record<string, unknown>;

  if (typeof b.entry_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.entry_date)) {
    return { error: 'Ngày không hợp lệ' };
  }
  if (b.type !== 'thu' && b.type !== 'chi') {
    return { error: 'Loại phải là "thu" hoặc "chi"' };
  }
  if (typeof b.description !== 'string' || !b.description.trim()) {
    return { error: 'Vui lòng nhập diễn giải' };
  }
  if (typeof b.amount !== 'number' || !(b.amount > 0)) {
    return { error: 'Số tiền phải lớn hơn 0' };
  }

  let category: FinanceCategory | null = null;
  if (b.type === 'chi') {
    if (typeof b.category !== 'string' || !(b.category in CATEGORY_LABELS)) {
      return { error: 'Vui lòng chọn danh mục chi' };
    }
    category = b.category as FinanceCategory;
  }

  const note = typeof b.note === 'string' && b.note.trim() ? b.note.trim() : null;

  return {
    data: {
      entry_date: b.entry_date,
      type: b.type,
      category,
      description: b.description.trim(),
      amount: b.amount,
      note,
    },
  };
}
