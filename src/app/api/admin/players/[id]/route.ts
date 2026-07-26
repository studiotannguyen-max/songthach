import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { updatePlayer, setActive, type PlayerInput } from '@/lib/players';

// Hồ sơ quản trị phải luôn tươi — chặn Next cache lại phản hồi fetch của supabase-js.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const admin = createAdminClient();
  const [{ data: player, error: pErr }, { data: events, error: eErr }] = await Promise.all([
    admin.from('players').select('*').eq('id', params.id).single(),
    admin.from('rating_events').select('*').eq('player_id', params.id).order('created_at', { ascending: false }),
  ]);
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 404 });
  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 500 });
  return NextResponse.json({ player, events: events ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const admin = createAdminClient();
  try {
    if (typeof body.is_active === 'boolean') await setActive(admin, params.id, body.is_active);

    // Chỉ đưa vào patch những trường thực sự có trong request — tránh ghi đè null
    // lên các cột không gửi lên (updatePlayer chỉ cập nhật key nào có mặt).
    const patch: Partial<PlayerInput> = {};
    if ('full_name'  in body) patch.full_name  = String(body.full_name ?? '').trim();
    if ('nickname'   in body) patch.nickname   = (body.nickname   as string)?.trim() || null;
    if ('phone'      in body) patch.phone      = (body.phone      as string)?.trim() || null;
    if ('avatar_url' in body) patch.avatar_url = (body.avatar_url as string) || null;
    if ('tested_at'  in body) patch.tested_at  = (body.tested_at  as string) || null;
    if ('test_note'  in body) patch.test_note  = (body.test_note  as string)?.trim() || null;
    await updatePlayer(admin, params.id, patch);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
