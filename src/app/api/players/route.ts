import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Dữ liệu xếp hạng đổi mỗi khi admin cộng điểm — luôn render động, không cache tĩnh.
// force-no-store: supabase-js gọi qua global fetch mà Next instrument + cache; nếu không tắt,
// lần gọi đầu (rỗng) bị cache lại và phục vụ mãi. Bắt buộc đọc mới mỗi request.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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
