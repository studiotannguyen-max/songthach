import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { updateRatingEvent, deleteRatingEvent } from '@/lib/players';
import { checkEventEdit, canDeleteEvent } from '@/lib/rating';

// Sổ điểm phải luôn tươi — chặn Next cache lại phản hồi fetch của supabase-js.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type Params = { params: { id: string; eventId: string } };

/** Đọc dòng sổ theo cả id lẫn player_id — vừa để biết reason, vừa chặn sửa nhầm sổ người khác. */
async function loadEvent(admin: ReturnType<typeof createAdminClient>, playerId: string, eventId: string) {
  const { data } = await admin
    .from('rating_events').select('id, reason')
    .eq('id', eventId).eq('player_id', playerId)
    .maybeSingle();
  return data as { id: string; reason: string } | null;
}

// PATCH /api/admin/players/[id]/points/[eventId] — sửa một dòng sổ đã ghi
export async function PATCH(req: NextRequest, { params }: Params) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const admin = createAdminClient();
  const event = await loadEvent(admin, params.id, params.eventId);
  if (!event) return NextResponse.json({ error: 'Không tìm thấy dòng sổ này' }, { status: 404 });

  const points = Number(body.points);
  const note   = typeof body.note === 'string' ? body.note.trim() : '';
  const loi    = checkEventEdit({ reason: event.reason, points, note });
  if (loi) return NextResponse.json({ error: loi }, { status: 400 });

  try {
    const result = await updateRatingEvent(admin, params.id, params.eventId, { points, note });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// DELETE /api/admin/players/[id]/points/[eventId] — xoá hẳn một dòng sổ
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const admin = createAdminClient();
  const event = await loadEvent(admin, params.id, params.eventId);
  if (!event) return NextResponse.json({ error: 'Không tìm thấy dòng sổ này' }, { status: 404 });

  if (!canDeleteEvent(event.reason)) {
    return NextResponse.json(
      { error: 'Không xoá được dòng Xếp trình ban đầu — đó là điểm gốc của cả sổ' },
      { status: 400 },
    );
  }

  try {
    const result = await deleteRatingEvent(admin, params.id, params.eventId);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
