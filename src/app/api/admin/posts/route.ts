import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now().toString(36);
}

// GET /api/admin/posts?status=published&category=football
export async function GET(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status   = searchParams.get('status');
  const category = searchParams.get('category');

  const supabase = createAdminClient();
  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, category, status, published_at, created_at')
    .order('created_at', { ascending: false });

  if (status)   query = query.eq('status',   status);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

// POST /api/admin/posts — Tạo bài viết mới
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { title, content, excerpt, cover_image, category, status, author_name } = body;

  if (!title?.trim()) return NextResponse.json({ error: 'Tiêu đề không được bỏ trống' }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title:       title.trim(),
      slug:        generateSlug(title),
      content:     content ?? '',
      excerpt:     excerpt ?? '',
      cover_image: cover_image ?? null,
      category:    category ?? 'general',
      status:      status ?? 'draft',
      author_name: author_name ?? 'Admin',
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
