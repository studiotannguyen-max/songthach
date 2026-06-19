# Trang chủ v2: lưới mosaic + khung giá/uy tín — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay section "Zone grid" (thẻ ảnh full-bleed vừa làm) + section "Info strip" trên trang chủ bằng 1 section mới: lưới mosaic 4 khu màu rực (trái) + 2 khung thông tin giá/uy tín (phải), theo đúng cấu trúc ảnh tham khảo đã được chốt qua visual companion.

**Architecture:** Vẫn 1 file `src/app/(public)/page.tsx`, vẫn async Server Component dùng `getGallery('wedding')` (đã có). Bỏ hẳn các SVG `FootballArt`/`BadmintonArt`/`CafeArt` khỏi trang chủ (3 khu này giờ dùng nền gradient màu phẳng, không phải ảnh/SVG) — chỉ giữ `WeddingArt` làm fallback khi chưa có ảnh thật. Dùng lại pattern 2-khối-JSX (mobile riêng / desktop riêng) đã có sẵn trong file gốc, thay vì 1 grid CSS dùng `col-span`/`row-span` đổi theo breakpoint (dễ vỡ, khó verify) — breakpoint chuyển từ `sm:` (640px) sang `lg:` (1024px) vì layout mới có thêm cột thông tin bên phải, cần nhiều chỗ hơn layout thẻ cũ.

**Tech Stack:** Next.js 14 App Router, `next/image`, Tailwind CSS (layout/spacing) + inline `style` cho các gradient màu cụ thể (bắt buộc — xem Global Constraints).

## Global Constraints

- KHÔNG dùng opacity modifier kiểu `bg-primary/90` trên màu CSS-var của theme — mọi gradient/overlay màu phải viết bằng `style={{ background: '...' }}` với giá trị hex/rgba trực tiếp.
- KHÔNG bịa số liệu (rating, lượt đặt) khi chưa có dữ liệu thật — chỉ hiển thị: địa chỉ, giờ mở, danh sách dịch vụ, "xác nhận trong vài phút" (mô tả quy trình, không phải số liệu đo được).
- Giữ nguyên `Navbar`, `HeroCarousel`, `Footer` — không đổi.
- Không có test framework tự động trong repo — verify bằng `npm run build` + kiểm tra thủ công qua `curl` và trình duyệt.
- Section "Info strip" cũ (địa chỉ/giờ mở/SĐT dạng dải ngang) bị xoá hoàn toàn, không giữ lại.

---

### Task 1: Viết lại `src/app/(public)/page.tsx` với lưới mosaic + khung thông tin mới

**Files:**
- Modify: `src/app/(public)/page.tsx` (viết lại toàn bộ file)

**Interfaces:**
- Consumes: `getGallery('wedding'): Promise<{ url: string; caption: string | null }[]>` từ `@/lib/gallery` (đã có, không đổi).
- Consumes: `WeddingArt: React.ComponentType<{ className?: string }>` từ `@/components/shared/ZoneArt` (đã có, không đổi). KHÔNG còn import `FootballArt`, `BadmintonArt`, `CafeArt`.

- [ ] **Step 1: Viết lại file**

```tsx
// src/app/(public)/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Goal, Feather, Heart, Coffee, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroCarousel from '@/components/shared/HeroCarousel';
import { WeddingArt } from '@/components/shared/ZoneArt';
import { getGallery } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Song Thạch — Khu thể thao, Tiệc cưới & Café',
  description: 'Đặt sân bóng đá, sân cầu lông tại Song Thạch. Mở cửa 06:00–22:00, đặt sân online trong 60 giây.',
};

// Đọc lại ảnh gallery từ DB mỗi 60s — admin upload ảnh mới sẽ hiện sau ~1 phút (giống trang /wedding)
export const revalidate = 60;

const ADDRESS = '9B/3 Ấp An Hoà , Xã Hưng Thịnh , TP Đồng Nai';
const OPEN_HOURS = '06:00 – 22:00 hàng ngày';

const ZONES = [
  { href: '/sports/football',  icon: Goal,    label: 'Sân Bóng Đá',  price: 'Từ 120.000đ / giờ', gradient: 'linear-gradient(160deg, #34a35e, #15623a)' },
  { href: '/sports/badminton', icon: Feather, label: 'Sân Cầu Lông', price: 'Từ 50.000đ / giờ',   gradient: 'linear-gradient(160deg, #e0476f, #a02c50)' },
  { href: '/wedding',          icon: Heart,   label: 'Tiệc Cưới',    price: 'Tư vấn miễn phí',    gradient: 'linear-gradient(160deg, #a0407a, #6e2440)' },
  { href: '/cafe',             icon: Coffee,  label: 'Café Lavie',   price: 'Mở 07:00–22:00',     gradient: 'linear-gradient(160deg, #caa86d, #a07c45)' },
];

type Zone = typeof ZONES[number];

function TileLabel({ icon: Icon, label, price }: { icon: Zone['icon']; label: string; price: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
        <Icon size={13} /> {label}
      </span>
      <span className="mt-1 text-base font-extrabold">{price}</span>
    </div>
  );
}

function MosaicTile({ zone, imageUrl, className }: { zone: Zone; imageUrl?: string; className: string }) {
  return (
    <Link
      href={zone.href}
      className={`group relative block overflow-hidden rounded-2xl ${className}`}
      style={imageUrl ? undefined : { background: zone.gradient }}
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(216,178,87,.55), rgba(20,18,16,.55))' }} />
        </>
      ) : zone.href === '/wedding' ? (
        <WeddingArt className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <TileLabel icon={zone.icon} label={zone.label} price={zone.price} />
    </Link>
  );
}

export default async function HomePage() {
  const weddingPhotos = await getGallery('wedding');
  const weddingImage = weddingPhotos[0]?.url;
  const [football, badminton, wedding, cafe] = ZONES;
  const zoneLabels = ZONES.map((z) => z.label).join(', ');

  const infoCards = (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-2xl font-extrabold text-foreground">Từ 50.000đ / giờ</p>
        <p className="mt-2.5 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Giờ mở cửa:</span> {OPEN_HOURS}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Loại sân:</span> {zoneLabels}
        </p>
        <Link
          href="/sports/football"
          className="mt-4 flex items-center justify-center gap-2 w-full text-white font-bold text-sm py-3.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: '#e0476f' }}
        >
          Đặt sân ngay <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0"
            style={{ background: '#15623a' }}
          >
            ST
          </div>
          <p className="font-bold text-sm text-foreground">
            Song Thạch{' '}
            <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-md ml-1" style={{ background: '#34a35e' }}>
              UY TÍN
            </span>
          </p>
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin size={15} className="text-accent shrink-0 mt-0.5" /> {ADDRESS}
        </p>
        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
          <Clock size={15} className="text-accent shrink-0 mt-0.5" /> Xác nhận đặt sân trong vài phút
        </p>
        <p className="mt-2 text-sm text-muted-foreground">4 dịch vụ: {zoneLabels}</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <HeroCarousel />

      {/* ── Mosaic + info section ───────────────── */}
      <section className="bg-background py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mb-6 md:mb-14">
            <span className="eyebrow">Dịch vụ</span>
            <h2 className="mt-1.5 text-foreground text-2xl md:text-4xl font-bold tracking-tight">
              Một địa điểm, bốn không gian
            </h2>
          </div>

          {/* ── Dưới lg: mosaic xếp dọc, info cards bên dưới ── */}
          <div className="lg:hidden space-y-5">
            <div className="rounded-3xl p-3" style={{ background: '#0e0e0e' }}>
              <div className="space-y-3">
                <MosaicTile zone={football} className="h-36" />
                <div className="grid grid-cols-3 gap-3">
                  <MosaicTile zone={badminton} className="h-28" />
                  <MosaicTile zone={wedding} imageUrl={weddingImage} className="h-28" />
                  <MosaicTile zone={cafe} className="h-28" />
                </div>
              </div>
            </div>
            {infoCards}
          </div>

          {/* ── lg trở lên: mosaic trái, info cards phải, cùng hàng ── */}
          <div className="hidden lg:grid lg:grid-cols-[1.6fr_1fr] gap-5">
            <div className="rounded-3xl p-4" style={{ background: '#0e0e0e' }}>
              <div className="grid grid-cols-[1.3fr_1fr] grid-rows-3 gap-3 h-[440px]">
                <MosaicTile zone={football} className="row-span-3 h-full" />
                <MosaicTile zone={badminton} className="h-full" />
                <MosaicTile zone={wedding} imageUrl={weddingImage} className="h-full" />
                <MosaicTile zone={cafe} className="h-full" />
              </div>
            </div>
            {infoCards}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build để type-check**

Run: `npm run build`
Expected: build thành công, không lỗi TypeScript. Chú ý: `next/image` với `fill` cần phần tử cha `position: relative` — `MosaicTile` đã có class `relative` trong `group relative block overflow-hidden ...`.

- [ ] **Step 3: Kiểm tra HTML có đủ 4 khu + ảnh thật Tiệc cưới + không còn Info strip cũ**

Run (sau khi `npm run dev` ở terminal khác):

```bash
curl -s http://localhost:3000/ --max-time 5 -o /tmp/home-v2.html
grep -c "Sân Bóng Đá" /tmp/home-v2.html
grep -c "Sân Cầu Lông" /tmp/home-v2.html
grep -c "Café Lavie" /tmp/home-v2.html
grep -o 'post-images/[a-zA-Z0-9_.-]*\.jpg' /tmp/home-v2.html | head -1
grep -c "Mở cửa hàng ngày" /tmp/home-v2.html
```

Expected:
- 3 dòng đầu mỗi dòng ra số ≥ 2 (mỗi khu xuất hiện cả ở khối mobile và khối desktop trong cùng 1 trang HTML — bình thường vì cả 2 khối cùng render, chỉ ẩn/hiện bằng CSS).
- Dòng 4 ra 1 dòng `post-images/....jpg` (ảnh thật Tiệc cưới có trong HTML).
- Dòng cuối (`Mở cửa hàng ngày`) ra **0** — xác nhận câu chữ cũ của Info strip (`"Mở cửa hàng ngày · 06:00 – 22:00"`) không còn, đã đổi thành "Giờ mở cửa: 06:00 – 22:00 hàng ngày".

- [ ] **Step 4: Kiểm tra thủ công bằng trình duyệt (mobile + desktop)**

1. Mở `http://localhost:3000/`.
2. Cỡ mobile/tablet (dưới 1024px): mosaic xếp dọc (Bóng đá to nằm ngang trên, 3 ô Cầu lông/Cưới/Café chia 3 cột dưới), 2 khung thông tin nằm dưới mosaic.
3. Cỡ desktop (≥1024px): mosaic bên trái (Bóng đá to chiếm hết chiều cao bên trái, 3 ô nhỏ xếp dọc bên phải nó trong cùng khối mosaic), 2 khung thông tin nằm bên phải, cùng hàng với mosaic.
4. Xác nhận: ô Tiệc cưới hiển thị ảnh thật (không phải hình vẽ), 3 ô còn lại là nền màu gradient (không phải hình vẽ SVG cũ).
5. Bấm nút "Đặt sân ngay" → chuyển tới `/sports/football`.
6. Xác nhận dải thông tin ngang cũ (nền nâu, danh sách icon địa chỉ/giờ/SĐT) **không còn xuất hiện** ở bất kỳ đâu trên trang.

Expected: đúng như trên, không lỗi console, không vỡ layout ở cả 2 cỡ màn hình.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/page.tsx
git commit -m "feat(home): đổi trang chủ sang lưới mosaic màu rực + khung giá/uy tín (thay thế thẻ ảnh + info strip)"
```

---

## Self-Review Notes

- Spec coverage: bố cục 2 cột (mosaic/info) → Step 1, 2 khối JSX (`lg:hidden` / `hidden lg:grid`). Màu rực theo từng khu, không thêm xanh dương/hồng neon lạ → `ZONES[].gradient` dùng đúng 4 màu đã chốt qua mockup (magenta/vàng-nâu lấy từ màu gốc `WeddingArt`/`CafeArt` đã có, không phải màu tự bịa). Ảnh thật Tiệc cưới + fallback SVG → `MosaicTile` nhánh `imageUrl ? <Image/> : (zone.href === '/wedding' ? <WeddingArt/> : null)`. Xoá Info strip cũ, thay khung giá/CTA + khung uy tín → biến `infoCards` dùng lại ở cả 2 khối, không còn section Info strip nào trong file. Không bịa rating/lượt đặt → khung uy tín trong code không có dòng "⭐ 4.9" như mockup, đúng quyết định trong spec.
- Không có placeholder/TBD — code đầy đủ trong Step 1.
- Type consistency: `Zone` type suy ra từ `typeof ZONES[number]`, dùng nhất quán trong `TileLabel`, `MosaicTile`. `zoneLabels` tính 1 lần, dùng lại ở cả khung giá và khung uy tín.
- Ngoài phạm vi (đã ghi trong spec): ảnh thật cho 3 khu còn lại, rating/lượt đặt thật, Hero/Navbar/Footer.
