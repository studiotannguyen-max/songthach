import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { createPlayer } from '@/lib/players';
import { BANDS } from '@/lib/rating';

// GET /api/admin/players — danh sách đầy đủ (có phone) cho khu quản trị
export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('players')
    .select('id, full_name, nickname, phone, avatar_url, band, progress_points, tested_at, is_active')
    .order('band', { ascending: false })
    .order('progress_points', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ players: data ?? [] });
}

// POST /api/admin/players — tạo VĐV mới
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const fullName = (body.full_name ?? '').trim();
  if (!fullName) return NextResponse.json({ error: 'Thiếu họ tên' }, { status: 400 });
  if (!BANDS.includes(body.band)) {
    return NextResponse.json({ error: 'Mức trình phải là A100–A500' }, { status: 400 });
  }
  const progress = Number(body.progress_points ?? 0);
  if (!Number.isInteger(progress) || progress < 0) {
    return NextResponse.json({ error: 'Điểm tiến độ phải là số không âm' }, { status: 400 });
  }
  if (body.band < 500 && progress >= 100) {
    return NextResponse.json({ error: 'Tiến độ vượt mốc 100 khi chưa phải A500' }, { status: 400 });
  }

  const admin = createAdminClient();
  try {
    const { id } = await createPlayer(admin, {
      full_name:       fullName,
      nickname:        body.nickname?.trim() || null,
      phone:           body.phone?.trim() || null,
      avatar_url:      body.avatar_url || null,
      band:            body.band,
      progress_points: progress,
      tested_at:       body.tested_at || null,
      test_note:       body.test_note?.trim() || null,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
