'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { HeroSlide } from '@/lib/hero-slides';

const INTERVAL_MS = 5000;

/** Ảnh nền hero chạy vòng, mờ dần giữa các ảnh.
 *  Máy bật "giảm chuyển động" thì đứng yên, chỉ đổi khi khách bấm chấm. */
export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  // Ảnh trong Kho ảnh có thể trỏ tới file đã bị xoá trên Supabase (URL trả 400).
  // Không loại ra thì tấm chết vẫn chiếm một lượt: hero đen thui 5 giây rồi mới sang tấm sau.
  const [broken, setBroken] = useState<string[]>([]);
  const live = slides.filter((s) => !broken.includes(s.src));
  const index = live.length > 0 ? current % live.length : 0;

  const markBroken = (src: string) =>
    setBroken((list) => (list.includes(src) ? list : [...list, src]));

  // Ảnh do máy chủ dựng sẵn thường lỗi xong TRƯỚC khi React hydrate, lúc đó `onError`
  // chưa gắn nên không bao giờ chạy (next/image cũng không chuyển tiếp `ref` xuống thẻ img).
  // Vì vậy quét thẳng trên DOM: tải xong mà rộng 0 nghĩa là hỏng. Quét lại một nhịp nữa cho
  // ảnh hỏng muộn; ảnh hỏng muộn hơn thì `onError` bắt.
  useEffect(() => {
    const scan = () => {
      document.querySelectorAll<HTMLImageElement>('img[data-hero-slide]').forEach((img) => {
        const src = img.dataset.heroSlide;
        if (src && img.complete && img.naturalWidth === 0) markBroken(src);
      });
    };
    scan();
    const id = setTimeout(scan, 1500);
    return () => clearTimeout(id);
  }, [slides]);

  // Phụ thuộc `current` nên bấm chấm sẽ đếm lại từ đầu 5 giây,
  // không bị nhảy ảnh ngay sau khi khách vừa chọn.
  useEffect(() => {
    if (live.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setTimeout(() => {
      setCurrent((i) => (i + 1) % live.length);
    }, INTERVAL_MS);
    return () => clearTimeout(id);
  }, [current, live.length]);

  if (live.length === 0) return null;

  return (
    <>
      {live.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          data-hero-slide={slide.src}
          onError={() => markBroken(slide.src)}
          className={`object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {live.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-10 flex justify-center">
          {live.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              className="grid place-items-center w-11 h-11"
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/45'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
