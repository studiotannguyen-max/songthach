import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { adjustPoints } from '@/lib/players';

// POST /api/admin/players/[id]/points — cộng/trừ điểm, bắt buộc kèm lý do
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const delta = Number(body.delta);
  const note  = (body.note ?? '').trim();
  if (!Number.isInteger(delta) || delta === 0) {
    return NextResponse.json({ error: 'Số điểm phải là số nguyên khác 0' }, { status: 400 });
  }
  if (!note) return NextResponse.json({ error: 'Bắt buộc nhập lý do' }, { status: 400 });

  const admin = createAdminClient();
  try {
    const result = await adjustPoints(admin, params.id, delta, note);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
