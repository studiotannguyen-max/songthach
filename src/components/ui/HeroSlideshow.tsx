'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { HeroSlide } from '@/lib/hero-slides';

const INTERVAL_MS = 5000;

/** Ảnh nền hero chạy vòng, mờ dần giữa các ảnh.
 *  Máy bật "giảm chuyển động" thì đứng yên, chỉ đổi khi khách bấm chấm. */
export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  // Phụ thuộc `current` nên bấm chấm sẽ đếm lại từ đầu 5 giây,
  // không bị nhảy ảnh ngay sau khi khách vừa chọn.
  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setTimeout(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearTimeout(id);
  }, [current, slides.length]);

  if (slides.length === 0) return null;

  return (
    <>
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-10 flex justify-center">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === current}
              className="grid place-items-center w-11 h-11"
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? 'bg-white' : 'bg-white/45'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
