import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Clock, MapPin, Phone, Goal, Feather, Heart, Coffee } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroCarousel from '@/components/shared/HeroCarousel';
import { FootballArt, BadmintonArt, WeddingArt, CafeArt } from '@/components/shared/ZoneArt';

export const metadata: Metadata = {
  title: 'Song Thạch — Khu thể thao, Tiệc cưới & Café',
  description: 'Đặt sân bóng đá, sân cầu lông tại Song Thạch. Mở cửa 06:00–22:00, đặt sân online trong 60 giây.',
};

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

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroCarousel />

      {/* ── Zone grid ───────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <span className="eyebrow">Dịch vụ</span>
              <h2 className="mt-2 text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                Một địa điểm, bốn không gian
              </h2>
            </div>
            <Link href="/sports" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all shrink-0">
              Xem bảng giá <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {ZONES.map((z) => {
              const Icon = z.icon;
              const Art = z.Art;
              return (
                <Link
                  key={z.href}
                  href={z.href}
                  className="group relative overflow-hidden rounded-[var(--radius)] bg-card border border-border flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Art className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">
                      <Icon size={13} /> {z.label}
                    </span>
                    <p className="mt-1.5 text-xs text-muted-foreground">{z.sub}</p>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground tracking-tight">{z.price}</span>
                      <span className="grid place-items-center w-8 h-8 rounded-full bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowUpRight size={15} />
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
