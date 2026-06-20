import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

const CATEGORIES = ['badminton', 'football', 'wedding', 'cafe'] as const;

// GET /api/admin/gallery?category=wedding — danh sách ảnh (admin xem cả ảnh đã tắt)
export async function GET(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const supabase = createAdminClient();
  let query = supabase
    .from('gallery_images')
    .select('id, category, url, caption, sort_order, is_active, created_at')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}

// POST /api/admin/gallery — thêm ảnh vào một mục
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { category, url, caption } = await req.json();

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Mục không hợp lệ (sân cầu / sân bóng / tiệc cưới / café)' }, { status: 400 });
  }
  if (!url?.trim()) {
    return NextResponse.json({ error: 'Thiếu ảnh — vui lòng upload trước' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // sort_order = đẩy xuống cuối mục hiện tại
  const { data: last } = await supabase
    .from('gallery_images')
    .select('sort_order')
    .eq('category', category)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      category,
      url:        url.trim(),
      caption:    caption?.trim() || null,
      sort_order: (last?.sort_order ?? 0) + 1,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
