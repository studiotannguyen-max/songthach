'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from 'lucide-react';

type Slide = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  sub: string;
  cta: string;
  href: string;
  img: string;
  tint: string; // overlay accent color (rgba)
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'Sân Bóng Đá',
    title: 'CHƠI HẾT',
    titleAccent: 'MÌNH',
    sub: '1 sân 7 người · 3 sân 5 người · đèn thi đấu ban đêm · đặt online 60 giây.',
    cta: 'Đặt sân bóng đá',
    href: '/sports/football',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80',
    tint: 'rgba(15,40,25,0.55)',
  },
  {
    eyebrow: 'Sân Cầu Lông',
    title: 'ĐAM MÊ',
    titleAccent: 'KẾT NỐI',
    sub: '3 mặt sân thảm Elite vân cát · đặt theo khung 30 phút.',
    cta: 'Đặt sân cầu lông',
    href: '/sports/badminton',
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80',
    tint: 'rgba(60,25,15,0.5)',
  },
  {
    eyebrow: 'Nhà hàng Tiệc cưới',
    title: 'NGÀY',
    titleAccent: 'TRỌNG ĐẠI',
    sub: '1 sảnh tiệc sức chứa 800 khách · đội ngũ hoạch định riêng cho bạn.',
    cta: 'Tư vấn tiệc cưới',
    href: '/wedding',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    tint: 'rgba(50,15,30,0.55)',
  },
  {
    eyebrow: 'Café Lavie en Rose',
    title: 'KHOẢNG',
    titleAccent: 'LẶNG',
    sub: 'Cà phê đặc sản · bánh ngọt thủ công · điểm hẹn trước & sau trận.',
    cta: 'Khám phá café',
    href: '/cafe',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
    tint: 'rgba(45,30,15,0.5)',
  },
];

const INTERVAL = 5500;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  // Vuốt trên điện thoại
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 50) prev();
    else if (dx < -50) next();
    touchX.current = null;
  };

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(next, INTERVAL);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, next, index]);

  return (
    <section
      className="relative h-[80svh] min-h-[480px] w-full overflow-hidden bg-secondary"
      aria-roledescription="carousel"
      aria-label="Dịch vụ nổi bật Song Thạch"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Track */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.href}
            className="relative h-full w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${SLIDES.length}: ${s.eyebrow}`}
            aria-hidden={i !== index}
          >
            <Image
              src={s.img}
              alt={s.eyebrow}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover img-editorial"
            />
            <div className="absolute inset-0" style={{ background: s.tint }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12">
                <div
                  className={`max-w-2xl transition-all duration-700 ${
                    i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase text-accent">
                    <span className="w-7 h-px bg-accent" /> {s.eyebrow}
                  </span>
                  <h1 className="mt-4 font-black uppercase leading-[0.9] tracking-[-0.02em] text-white text-[clamp(2.25rem,6vw,5rem)]">
                    {s.title}<br />
                    <span className="text-accent">{s.titleAccent}</span>
                  </h1>
                  <p className="mt-5 max-w-md text-white/80 text-sm sm:text-base leading-relaxed">
                    {s.sub}
                  </p>
                  <Link
                    href={s.href}
                    className="mt-7 inline-flex items-center gap-2 bg-white text-secondary font-bold text-sm tracking-wide px-7 py-3.5 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {s.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Slide trước"
        className="hidden sm:grid absolute left-5 top-1/2 -translate-y-1/2 z-20 place-items-center w-11 h-11 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Slide kế tiếp"
        className="hidden sm:grid absolute right-5 top-1/2 -translate-y-1/2 z-20 place-items-center w-11 h-11 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom controls: play/pause + dots */}
      <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-4">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Tạm dừng' : 'Phát'}
          className="grid place-items-center w-8 h-8 rounded-full text-white/80 hover:text-white transition-colors"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex items-center gap-2.5" role="tablist" aria-label="Chọn slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.href}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${s.eyebrow}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-7 bg-accent' : 'w-2 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
