import { createClient } from '@/lib/supabase/server';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
}

export interface PostDetail extends PostSummary {
  content: string | null;
  author_name: string;
}

/** Lấy các bài viết đã đăng (status='published'), mới nhất trước. */
export async function getPublishedPosts(limit = 3): Promise<PostSummary[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** Lấy 1 bài viết đã đăng theo slug — null nếu không có hoặc chưa đăng. */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, content, author_name, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data ?? null;
}
