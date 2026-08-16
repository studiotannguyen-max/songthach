import type { GalleryImage } from '@/lib/gallery';

export interface HeroSlide {
  src: string;
  alt: string;
}

/** Ghép ảnh hero trang chủ: ảnh đầu của mỗi mục, bỏ mục chưa có ảnh.
 *  Thứ tự cố định cầu lông → bóng đá → tiệc cưới. */
export function buildHeroSlides(
  badminton: GalleryImage[],
  football: GalleryImage[],
  wedding: GalleryImage[],
): HeroSlide[] {
  const sources: [GalleryImage[], string][] = [
    [badminton, 'Sân cầu lông Song Thạch'],
    [football,  'Sân bóng đá Song Thạch'],
    [wedding,   'Sảnh tiệc cưới Song Thạch'],
  ];

  return sources.flatMap(([images, fallbackAlt]) => {
    const first = images[0];
    if (!first) return [];
    return [{ src: first.url, alt: first.caption?.trim() || fallbackAlt }];
  });
}
