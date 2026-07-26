import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Hồ sơ đổi mỗi khi admin cộng điểm — luôn render động, không cache tĩnh.
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = createAdminClient();
  const [{ data: player, error: pErr }, { data: events }] = await Promise.all([
    admin.from('players_public').select('id, full_name, nickname, avatar_url, band, progress_points, tested_at, created_at').eq('id', params.id).single(),
    admin.from('rating_events').select('id, points, reason, note, created_at').eq('player_id', params.id).order('created_at', { ascending: false }),
  ]);
  if (pErr || !player) return NextResponse.json({ error: 'Không tìm thấy VĐV' }, { status: 404 });
  return NextResponse.json({ player, events: events ?? [] });
}
