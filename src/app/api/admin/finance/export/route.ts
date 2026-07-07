import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { computeLedger, CATEGORY_LABELS, type FinanceEntryRow } from '@/lib/finance';

// GET /api/admin/finance/export?month=YYYY-MM — xuất sổ thu chi của tháng ra .xlsx
export async function GET(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const month = new URL(req.url).searchParams.get('month') ?? new Date().toISOString().slice(0, 7);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('finance_entries')
    .select('id, entry_date, type, category, description, amount, note, created_at')
    .order('entry_date', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ledger = computeLedger((data ?? []) as FinanceEntryRow[], month);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sổ Thu Chi');
  sheet.addRow(['Ngày', 'Loại', 'Diễn giải', 'Danh mục', 'Thu (VNĐ)', 'Chi (VNĐ)', 'Số Dư', 'Ghi Chú']);
  sheet.getRow(1).font = { bold: true };

  for (const e of ledger.entries) {
    sheet.addRow([
      e.entry_date,
      e.type === 'thu' ? 'Thu' : 'Chi',
      e.description,
      e.category ? CATEGORY_LABELS[e.category] : '',
      e.type === 'thu' ? e.amount : '',
      e.type === 'chi' ? e.amount : '',
      e.balance,
      e.note ?? '',
    ]);
  }
  sheet.columns.forEach((col) => { col.width = 18; });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="so-thu-chi-${month}.xlsx"`,
    },
  });
}
