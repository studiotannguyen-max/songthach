# Trang chủ: thẻ khu vực ảnh full-bleed + gradient đáy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đổi 4 thẻ khu vực ở trang chủ (`/`) từ kiểu "ảnh trên + chữ dưới có viền" sang kiểu "ảnh/hình full thẻ + gradient tối ở đáy + chữ trắng đè lên, không viền". Khu Tiệc cưới dùng ảnh thật từ thư viện ảnh đã có; 3 khu còn lại vẫn dùng hình vẽ SVG hiện tại.

**Architecture:** `src/app/(public)/page.tsx` chuyển từ component đồng bộ sang `async function` (Next.js Server Component có thể `async` trực tiếp), gọi `getGallery('wedding')` (đã có sẵn ở `src/lib/gallery.ts`) lúc render để lấy ảnh thật. Thêm 1 component nội bộ nhỏ `ZoneBackground` trong cùng file để dùng chung lớp ảnh/hình + gradient cho cả 3 khối thẻ (mobile-big, mobile-small, desktop-grid), tránh lặp code.

**Tech Stack:** Next.js 14 App Router (Server Component, async), `next/image` (đã whitelist `**.supabase.co`), Tailwind CSS, lucide-react.

## Global Constraints

- KHÔNG dùng opacity modifier kiểu `bg-secondary/90` trên các màu CSS-var của theme (gây lỗi CSS — xem ghi chú trong codebase). Gradient overlay phải dùng `style={{ background: 'linear-gradient(...)' }}` với giá trị hex/rgba viết trực tiếp, không qua class Tailwind có opacity modifier.
- Không có test framework tự động trong repo. Verify bằng `npm run build` (type-check) + kiểm tra thủ công qua `curl` và trình duyệt.
- Giữ nguyên cấu trúc lưới hiện tại (mobile: 1 thẻ to + 3 thẻ nhỏ; `sm:` trở lên: grid 4 cột bằng nhau) — chỉ đổi nội dung/kiểu trình bày bên trong mỗi thẻ.
- Không đổi `HeroCarousel`, `Navbar`, `Footer`, hay section "Info strip" phía dưới.

---

### Task 1: Viết lại thẻ khu vực trong `src/app/(public)/page.tsx`

**Files:**
- Modify: `src/app/(public)/page.tsx` (viết lại toàn bộ file)

**Interfaces:**
- Consumes: `getGallery(category: 'badminton' | 'football' | 'wedding'): Promise<{ url: string; caption: string | null }[]>` từ `@/lib/gallery` (đã có sẵn, không đổi).
- Consumes: `FootballArt`, `BadmintonArt`, `WeddingArt`, `CafeArt` — các component SVG nhận prop `{ className?: string }` từ `@/components/shared/ZoneArt` (đã có sẵn, không đổi).

- [ ] **Step 1: Viết lại file**

```tsx
// src/app/(public)/page.tsx
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
```

Lưu ý khi viết: phần "Info strip" và toàn bộ phần trên `</section>` đầu tiên (Hero, Navbar) y nguyên không đổi — chỉ phần `Zone grid` (3 khối: big card / 3 small cards / desktop grid) và phần khai báo ở đầu file (thêm import `Image`, `getGallery`, thêm `ZoneBackground`, đổi `HomePage` thành `async function`) là thay đổi thật.

- [ ] **Step 2: Build để type-check**

Run: `npm run build`
Expected: build thành công, không lỗi TypeScript (chú ý: `next/image` với prop `fill` yêu cầu phần tử cha có `position: relative` — đã đảm bảo vì `Link` có class `relative`).

- [ ] **Step 3: Kiểm tra HTML trả về có ảnh thật cho khu Tiệc cưới**

Run (sau khi `npm run dev` ở terminal khác):

```bash
curl -s http://localhost:3000/ --max-time 5 | grep -o 'post-images/[a-zA-Z0-9_.-]*\.jpg' | head -3
```

Expected: thấy ít nhất 1 dòng dạng `post-images/1781334299944-rkpurepvo2.jpg` (ảnh thật từ bảng `gallery_images`, category `wedding`) xuất hiện trong HTML — xác nhận trang chủ đã lấy ảnh thật thành công, không chỉ render SVG.

- [ ] **Step 4: Kiểm tra thủ công bằng trình duyệt (mobile + desktop)**

1. Mở `http://localhost:3000/` trên trình duyệt.
2. Thu nhỏ cửa sổ xuống cỡ điện thoại (hoặc dùng responsive mode của DevTools) — xác nhận: 1 thẻ to (Bóng đá) + 3 thẻ nhỏ, ảnh/hình chiếm toàn thẻ, chữ trắng đè lên gradient tối ở đáy, không còn viền `border`.
3. Mở rộng cửa sổ ra cỡ desktop — xác nhận: 4 thẻ bằng nhau, cùng kiểu ảnh full + gradient đáy.
4. Xác nhận riêng thẻ "Tiệc Cưới" hiển thị ảnh thật (ảnh tiệc cưới thật, không phải hình vẽ minh hoạ màu hồng-tím), 3 thẻ còn lại vẫn là hình vẽ SVG như trước.

Expected: đúng như mô tả trên, không lỗi console, không bị vỡ layout.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/page.tsx
git commit -m "feat(home): thẻ khu vực ảnh full-bleed + gradient đáy, khu Tiệc cưới dùng ảnh thật"
```

---

## Self-Review Notes

- Spec coverage: mục 1 (lấy ảnh thật wedding, fallback SVG) → Step 1 (`getGallery`, `weddingImage = weddingPhotos[0]?.url`, `imageUrl` chỉ set cho `/wedding`, `ZoneBackground` tự fallback về `Art` khi `imageUrl` undefined). Mục 2 (kiểu thẻ mới, áp dụng cả 4 khu, cả mobile/desktop) → Step 1 (cả 3 khối JSX dùng chung `ZoneBackground` + lớp chữ overlay đáy). Mục 3 (áp dụng cả 2 khối mobile lẫn desktop) → đã viết cả 3 khối (big/small/desktop) trong cùng Step 1.
- Không có placeholder/TBD — code đầy đủ trong Step 1.
- Ngoài phạm vi (đã ghi trong spec, không cần task): ảnh thật cho 3 khu còn lại, đổi Hero/Footer/Info strip, đổi cấu trúc lưới.
