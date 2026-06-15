import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/posts/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ post: data });
}

// PATCH /api/admin/posts/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { title, content, excerpt, cover_image, category, status, author_name } = body;

  const updates: Record<string, unknown> = {};
  if (title       !== undefined) updates.title       = title;
  if (content     !== undefined) updates.content     = content;
  if (excerpt     !== undefined) updates.excerpt     = excerpt;
  if (cover_image !== undefined) updates.cover_image = cover_image;
  if (category    !== undefined) updates.category    = category;
  if (author_name !== undefined) updates.author_name = author_name;
  if (status      !== undefined) {
    updates.status = status;
    if (status === 'published') updates.published_at = new Date().toISOString();
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('posts').update(updates).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE /api/admin/posts/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { error } = await supabase.from('posts').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
