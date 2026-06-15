import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// POST /api/admin/upload — Upload ảnh lên Supabase Storage
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const formData = await req.formData();
  const file     = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'Không có file' }, { status: 400 });

  // Đuôi file suy ra từ MIME type đã whitelist — KHÔNG tin tên file người dùng gửi lên
  const MIME_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png':  'png',
    'image/webp': 'webp',
    'image/gif':  'gif',
  };
  const ext = MIME_EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Chỉ chấp nhận JPG, PNG, WEBP, GIF' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File tối đa 5MB' }, { status: 400 });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from('post-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from('post-images').getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
