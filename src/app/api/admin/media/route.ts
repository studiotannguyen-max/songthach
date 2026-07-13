import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

const BUCKET = 'post-images';

// GET /api/admin/media — liệt kê ảnh trong kho (Storage bucket post-images)
export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const images = (data ?? [])
    .filter(obj => obj.name && obj.name !== '.emptyFolderPlaceholder')
    .map(obj => ({
      name:       obj.name,
      url:        supabase.storage.from(BUCKET).getPublicUrl(obj.name).data.publicUrl,
      size:       (obj.metadata?.size as number | undefined) ?? null,
      created_at: obj.created_at ?? null,
    }));

  return NextResponse.json({ images });
}

// DELETE /api/admin/media?name=<filename> — xoá 1 ảnh khỏi kho
export async function DELETE(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const name = new URL(req.url).searchParams.get('name');
  if (!name || name.includes('/')) {
    return NextResponse.json({ error: 'Tên file không hợp lệ' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
