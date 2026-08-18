import { describe, it, expect } from 'vitest';
import { buildHeroSlides } from './hero-slides';

const img = (url: string, caption: string | null = null) => ({ url, caption });

describe('buildHeroSlides', () => {
  it('lấy ảnh đầu mỗi mục, đúng thứ tự cầu lông → bóng đá → tiệc cưới', () => {
    expect(
      buildHeroSlides(
        [img('cau-1.jpg'), img('cau-2.jpg')],
        [img('bong-1.jpg')],
        [img('cuoi-1.jpg')],
      ).map((s) => s.src),
    ).toEqual(['cau-1.jpg', 'bong-1.jpg', 'cuoi-1.jpg']);
  });

  it('dùng caption làm alt khi có', () => {
    expect(buildHeroSlides([img('cau-1.jpg', 'Sân số 3 buổi tối')], [], [])).toEqual([
      { src: 'cau-1.jpg', alt: 'Sân số 3 buổi tối' },
    ]);
  });

  it('caption rỗng hoặc chỉ khoảng trắng thì dùng alt mặc định của mục', () => {
    expect(buildHeroSlides([img('cau-1.jpg', '   ')], [img('bong-1.jpg', '')], [img('cuoi-1.jpg')])).toEqual([
      { src: 'cau-1.jpg',  alt: 'Sân cầu lông Song Thạch' },
      { src: 'bong-1.jpg', alt: 'Sân bóng đá Song Thạch' },
      { src: 'cuoi-1.jpg', alt: 'Sảnh tiệc cưới Song Thạch' },
    ]);
  });

  it('bỏ qua mục chưa có ảnh', () => {
    expect(buildHeroSlides([], [img('bong-1.jpg')], []).map((s) => s.src)).toEqual(['bong-1.jpg']);
  });

  it('không mục nào có ảnh thì trả mảng rỗng', () => {
    expect(buildHeroSlides([], [], [])).toEqual([]);
  });
});
