import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { computeLedger, validateFinanceInput, type FinanceEntryRow } from '@/lib/finance';

// GET /api/admin/finance?month=YYYY-MM — danh sách giao dịch trong tháng + tổng hợp
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
  return NextResponse.json({ month, ...ledger });
}

// POST /api/admin/finance — thêm giao dịch thu/chi
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const validated = validateFinanceInput(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('finance_entries')
    .insert(validated.data)
    .select('id, entry_date, type, category, description, amount, note, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data }, { status: 201 });
}
