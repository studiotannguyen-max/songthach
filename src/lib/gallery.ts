import { createAdminClient } from '@/lib/supabase/admin';

export type GalleryCategory = 'badminton' | 'football' | 'wedding' | 'cafe';

export interface GalleryImage {
  url: string;
  caption: string | null;
}

/**
 * Lấy ảnh thư viện đang bật của một mục, theo thứ tự admin sắp.
 * Dùng trong server component của trang public. Trả mảng rỗng nếu chưa có ảnh
 * (trang sẽ tự fallback về ảnh mặc định).
 */
export async function getGallery(category: GalleryCategory): Promise<GalleryImage[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('gallery_images')
      .select('url, caption')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}
