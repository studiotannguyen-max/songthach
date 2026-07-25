import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { updatePlayer, setActive } from '@/lib/players';

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

  const body = await req.json();
  const admin = createAdminClient();
  try {
    if (typeof body.is_active === 'boolean') await setActive(admin, params.id, body.is_active);
    await updatePlayer(admin, params.id, {
      full_name:  body.full_name?.trim(),
      nickname:   body.nickname?.trim() || null,
      phone:      body.phone?.trim() || null,
      avatar_url: body.avatar_url ?? undefined,
      tested_at:  body.tested_at || null,
      test_note:  body.test_note?.trim() || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
