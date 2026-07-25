import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/players — công khai, đọc view players_public (KHÔNG có phone)
export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('players_public')
    .select('id, full_name, nickname, avatar_url, band, progress_points')
    .order('band', { ascending: false })
    .order('progress_points', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ players: data ?? [] });
}
