import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { validateFinanceInput } from '@/lib/finance';

// PATCH /api/admin/finance/:id — sửa giao dịch
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const validated = validateFinanceInput(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('finance_entries')
    .update(validated.data)
    .eq('id', params.id)
    .select('id, entry_date, type, category, description, amount, note, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}

// DELETE /api/admin/finance/:id — xoá giao dịch
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { error } = await supabase.from('finance_entries').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
