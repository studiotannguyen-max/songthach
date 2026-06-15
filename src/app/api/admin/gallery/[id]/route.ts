import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// PATCH /api/admin/gallery/:id — sửa chú thích / bật-tắt / đổi thứ tự
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const patch: Record<string, unknown> = {};
  if (typeof body.caption === 'string')    patch.caption    = body.caption.trim() || null;
  if (typeof body.is_active === 'boolean')  patch.is_active  = body.is_active;
  if (typeof body.sort_order === 'number')  patch.sort_order = body.sort_order;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Không có gì để cập nhật' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('gallery_images').update(patch).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE /api/admin/gallery/:id — xoá ảnh khỏi thư viện
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { error } = await supabase.from('gallery_images').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
