import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, MapPin, Phone, Goal, Feather, Heart, Coffee } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroCarousel from '@/components/shared/HeroCarousel';
import { FootballArt, BadmintonArt, WeddingArt, CafeArt } from '@/components/shared/ZoneArt';
import { getGallery } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Song Thạch — Khu thể thao, Tiệc cưới & Café',
  description: 'Đặt sân bóng đá, sân cầu lông tại Song Thạch. Mở cửa 06:00–22:00, đặt sân online trong 60 giây.',
};

// Đọc lại ảnh gallery từ DB mỗi 60s — admin upload ảnh mới sẽ hiện sau ~1 phút (giống trang /wedding)
export const revalidate = 60;

const ZONES = [
  { href: '/sports/football',  icon: Goal,    Art: FootballArt,  label: 'Sân Bóng Đá',  sub: '1 sân 7 người · 3 sân 5 người',   price: 'Từ 120.000đ / giờ' },
  { href: '/sports/badminton', icon: Feather, Art: BadmintonArt, label: 'Sân Cầu Lông', sub: '3 mặt sân thảm Elite vân cát',     price: 'Từ 50.000đ / giờ' },
  { href: '/wedding',          icon: Heart,   Art: WeddingArt,   label: 'Tiệc Cưới',    sub: '1 sảnh · sức chứa 800 khách',     price: 'Tư vấn miễn phí' },
  { href: '/cafe',             icon: Coffee,  Art: CafeArt,      label: 'Café Lavie',   sub: 'Lavie en Rose',                 price: 'Mở 07:00–22:00' },
];

const INFO = [
  { icon: MapPin, label: '9B/3 Ấp An Hoà , Xã Hưng Thịnh , TP Đồng Nai' },
  { icon: Clock,  label: 'Mở cửa hàng ngày · 06:00 – 22:00' },
  { icon: Phone,  label: '0378 990 979 , 0886 798690 ' },
];

// Gradient tối ở đáy thẻ để chữ trắng đọc được trên ảnh — viết trực tiếp bằng hex/rgba,
// KHÔNG dùng class Tailwind dạng bg-secondary/90 (vỡ CSS với theme hex-trong-CSS-var của project).
const ZONE_GRADIENT = 'linear-gradient(180deg, transparent 35%, rgba(44,42,38,.92) 100%)';

function ZoneBackground({
  Art,
  imageUrl,
  sizes,
}: {
  Art: React.ComponentType<{ className?: string }>;
  imageUrl?: string;
  sizes: string;
}) {
  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <Art className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      <div className="absolute inset-0" style={{ background: ZONE_GRADIENT }} />
    </>
  );
}

export default async function HomePage() {
  const weddingPhotos = await getGallery('wedding');
  const weddingImage = weddingPhotos[0]?.url;

  const zones = ZONES.map((z) => ({
    ...z,
    imageUrl: z.href === '/wedding' ? weddingImage : undefined,
  }));

  return (
    <>
      <Navbar />
      <HeroCarousel />

      {/* ── Zone grid ───────────────────────────── */}
      <section className="bg-background py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-14">
            <div>
              <span className="eyebrow">Dịch vụ</span>
              <h2 className="mt-1.5 text-foreground text-2xl md:text-4xl font-bold tracking-tight">
                Một địa điểm, bốn không gian
              </h2>
            </div>
            <Link href="/sports" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0">
              Xem bảng giá <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* ── Mobile: 1 big + 3 small ── */}
          <div className="sm:hidden space-y-3">
            {/* Big card — Bóng đá */}
            {(() => {
              const z = zones[0];
              const Icon = z.icon;
              return (
                <Link
                  href={z.href}
                  className="group relative block overflow-hidden rounded-2xl h-44 active:scale-[0.98] transition-transform"
                >
                  <ZoneBackground Art={z.Art} imageUrl={z.imageUrl} sizes="100vw" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-white/90">
                      <Icon size={11} /> {z.label}
                    </span>
                    <p className="mt-1 text-xs text-white/70 leading-snug">{z.sub}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-bold text-white">{z.price}</span>
                      <span className="grid place-items-center w-9 h-9 rounded-full bg-accent text-accent-foreground">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* 3 small cards */}
            <div className="grid grid-cols-3 gap-3">
              {zones.slice(1).map((z) => {
                const Icon = z.icon;
                return (
                  <Link
                    key={z.href}
                    href={z.href}
                    className="group relative block overflow-hidden rounded-xl h-32 active:scale-[0.97] transition-transform"
                  >
                    <ZoneBackground Art={z.Art} imageUrl={z.imageUrl} sizes="33vw" />
                    <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                      <span className="flex items-center gap-1 text-[9px] font-semibold tracking-wider uppercase text-white/90">
                        <Icon size={10} /> {z.label}
                      </span>
                      <p className="mt-0.5 text-[11px] font-bold text-white">{z.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Tablet+ grid ── */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {zones.map((z) => {
              const Icon = z.icon;
              return (
                <Link
                  key={z.href}
                  href={z.href}
                  className="group relative block overflow-hidden rounded-[var(--radius)] h-64"
                >
                  <ZoneBackground Art={z.Art} imageUrl={z.imageUrl} sizes="(max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/90">
                      <Icon size={13} /> {z.label}
                    </span>
                    <p className="mt-1.5 text-xs text-white/70">{z.sub}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-white tracking-tight">{z.price}</span>
                      <span className="grid place-items-center w-9 h-9 rounded-full bg-accent text-accent-foreground group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Info strip ──────────────────────────── */}
      <section className="bg-secondary text-secondary-foreground py-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5 text-secondary-foreground/80">
                  <Icon size={15} className="text-accent shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
          <Link
            href="/sports/football"
            className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground font-bold text-xs tracking-wide px-5 py-2.5 rounded-full hover:bg-white transition-colors"
          >
            Đặt sân ngay <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
