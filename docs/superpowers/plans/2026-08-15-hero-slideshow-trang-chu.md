# Slide ảnh trong hero trang chủ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hero trang chủ chạy slide 3 ảnh (sân cầu lông → sân bóng đá → tiệc cưới) lấy từ Kho ảnh admin, tự đổi mỗi 5 giây bằng hiệu ứng mờ dần, có chấm bấm chọn.

**Architecture:** Logic ghép danh sách ảnh tách ra hàm thuần `buildHeroSlides()` trong `src/lib/` để test bằng vitest. Phần chạy slide là client component `HeroSlideshow` cắm vào `PageHero` qua prop mới `slides`; prop `image` cũ giữ nguyên nên 12 trang công khai còn lại không đụng tới.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, vitest.

**Spec:** `docs/superpowers/specs/2026-08-15-hero-slideshow-trang-chu-design.md`

## Global Constraints

- Nhánh làm việc: `feat/giao-dien-moi`. Không tạo nhánh mới.
- **KHÔNG chạy `npm run build` khi dev server (`npm run dev`) đang chạy** — sẽ hỏng `.next` với lỗi `Cannot find module './XXXX.js'`. Kiểm tra kiểu bằng `npx tsc --noEmit`.
- Bộ test chạy `environment: node`, chỉ nhận `src/**/*.test.ts` (không `.tsx`). Không thêm thư viện test component, không sửa `vitest.config.ts`.
- Không thêm thư viện slider ngoài. Tự viết bằng React state + `setInterval`.
- Chỉ hero **trang chủ** đổi. Không đụng hero của trang nào khác.
- Chữ tiếng Việt trong code và comment giữ nguyên giọng của codebase hiện tại (comment tiếng Việt, không dấu chấm câu thừa).
- Kho ảnh trống → hero về nền đen. Không dùng ảnh Unsplash cho hero trang chủ.
- Thứ tự slide cố định: cầu lông → bóng đá → tiệc cưới.
- Alt mặc định (dùng đúng nguyên văn): `Sân cầu lông Song Thạch`, `Sân bóng đá Song Thạch`, `Sảnh tiệc cưới Song Thạch`.

---

### Task 1: Hàm `buildHeroSlides()`

**Files:**
- Create: `src/lib/hero-slides.ts`
- Test: `src/lib/hero-slides.test.ts`

**Interfaces:**
- Consumes: `GalleryImage` từ `src/lib/gallery.ts` — `{ url: string; caption: string | null }`
- Produces:
  - `export interface HeroSlide { src: string; alt: string }`
  - `export function buildHeroSlides(badminton: GalleryImage[], football: GalleryImage[], wedding: GalleryImage[]): HeroSlide[]`

- [ ] **Step 1: Viết test thất bại**

Tạo `src/lib/hero-slides.test.ts`:

```ts
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
      { src: 'cau-1.jpg', alt: 'Sân cầu lông Song Thạch' },
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
```

- [ ] **Step 2: Chạy test cho chắc là nó fail**

Chạy: `npm test -- src/lib/hero-slides.test.ts`
Mong đợi: FAIL — không tìm thấy module `./hero-slides`.

- [ ] **Step 3: Viết bản cài đặt tối thiểu**

Tạo `src/lib/hero-slides.ts`:

```ts
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
```

- [ ] **Step 4: Chạy lại test cho chắc là nó pass**

Chạy: `npm test -- src/lib/hero-slides.test.ts`
Mong đợi: PASS, 5 test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hero-slides.ts src/lib/hero-slides.test.ts
git commit -m "feat: them buildHeroSlides ghep anh hero trang chu"
```

---

### Task 2: Component `HeroSlideshow`

**Files:**
- Create: `src/components/ui/HeroSlideshow.tsx`
- Modify: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `HeroSlide` từ `src/lib/hero-slides.ts` (Task 1)
- Produces: `export default function HeroSlideshow({ slides }: { slides: HeroSlide[] })` — export thêm ở `src/components/ui/index.ts` dưới tên `HeroSlideshow`

Không có test tự động cho task này: bộ vitest chạy `environment: node` và không nhận `.tsx`. Nghiệm thu bằng mắt ở Task 4.

- [ ] **Step 1: Đọc `src/components/ui/index.ts` để biết cách nó export**

Chạy: mở `src/components/ui/index.ts`. Giữ đúng kiểu export sẵn có khi thêm dòng mới.

- [ ] **Step 2: Tạo component**

Tạo `src/components/ui/HeroSlideshow.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { HeroSlide } from '@/lib/hero-slides';

const INTERVAL_MS = 5000;

/** Ảnh nền hero chạy vòng, mờ dần giữa các ảnh.
 *  Máy bật "giảm chuyển động" thì đứng yên, chỉ đổi khi khách bấm chấm. */
export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

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
```

- [ ] **Step 3: Export component**

Thêm `HeroSlideshow` vào `src/components/ui/index.ts` theo đúng kiểu export mà file đó đang dùng.

- [ ] **Step 4: Kiểm tra kiểu**

Chạy: `npx tsc --noEmit`
Mong đợi: không lỗi. (Không chạy `npm run build` — xem Global Constraints.)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/HeroSlideshow.tsx src/components/ui/index.ts
git commit -m "feat: them component HeroSlideshow cho hero trang chu"
```

---

### Task 3: `PageHero` nhận prop `slides`

**Files:**
- Modify: `src/components/ui/PageHero.tsx`

**Interfaces:**
- Consumes: `HeroSlideshow` (Task 2), `HeroSlide` (Task 1)
- Produces: `PageHero` thêm prop tuỳ chọn `slides?: HeroSlide[]`. Có `slides` (≥1 phần tử) thì render `HeroSlideshow`; không thì giữ nguyên nhánh `image` cũ. Truyền cả hai thì `slides` thắng.

- [ ] **Step 1: Sửa phần khai báo props**

Trong `src/components/ui/PageHero.tsx`, thêm import và prop. Khối comment đầu file hiện ghi "Không slider" — sửa lại cho khớp thực tế:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import HeroSlideshow from './HeroSlideshow';
import type { HeroSlide } from '@/lib/hero-slides';

/** Hero dùng chung cho mọi trang công khai.
 *  Mặc định là hero tĩnh: không nút chuyển ảnh, không tự chạy.
 *  Riêng trang chủ truyền `slides` để ảnh nền chạy vòng.
 *  Không truyền `image` lẫn `slides` thì nền đen lộ ra — đó là biến thể không ảnh,
 *  cố tình như vậy để không bao giờ có ô ảnh trống. */
export default function PageHero({
  label, title, description, image, slides, cta, children,
}: {
  label?: string;
  title: string;
  description?: string;
  image?: string;
  /** Ảnh nền chạy vòng — ưu tiên hơn `image` khi có ít nhất 1 ảnh */
  slides?: HeroSlide[];
  cta?: { label: string; href: string };
  /** Nút tuỳ biến thay cho `cta` — dùng khi cần mở hộp thoại thay vì đi tới trang khác */
  children?: React.ReactNode;
}) {
```

- [ ] **Step 2: Sửa phần render ảnh nền**

Thay khối `{image && (...)}` hiện tại (dòng ~21-23) bằng:

```tsx
      {slides && slides.length > 0 ? (
        <HeroSlideshow slides={slides} />
      ) : (
        image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
```

Giữ nguyên lớp phủ gradient và toàn bộ phần chữ/CTA phía dưới. Lưu ý lớp phủ nằm **sau** khối này trong DOM nên vẫn phủ lên ảnh; chấm bấm của `HeroSlideshow` có `z-10` nên vẫn bấm được.

- [ ] **Step 3: Kiểm tra kiểu**

Chạy: `npx tsc --noEmit`
Mong đợi: không lỗi. Không trang nào phải sửa vì `image` giữ nguyên chữ ký cũ.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/PageHero.tsx
git commit -m "feat: PageHero nhan prop slides cho anh nen chay vong"
```

---

### Task 4: Cắm slide vào trang chủ

**Files:**
- Modify: `src/app/(public)/page.tsx` — phần import (dòng ~9-11) và thân `HomePage()` (dòng ~61-90)

**Interfaces:**
- Consumes: `buildHeroSlides` (Task 1), `PageHero` với prop `slides` (Task 3), `getGallery` từ `src/lib/gallery.ts`

- [ ] **Step 1: Thêm import**

Trong `src/app/(public)/page.tsx`, thêm cạnh các import sẵn có:

```tsx
import { buildHeroSlides } from '@/lib/hero-slides';
```

- [ ] **Step 2: Lấy thêm 3 mục ảnh**

Thay khối `Promise.all` hiện tại:

```tsx
  const [cafePhotos, posts] = await Promise.all([
    getGallery('cafe'),
    getPublishedPosts(3),
  ]);
  const cafeImage = cafePhotos[0]?.url;
```

bằng:

```tsx
  const [cafePhotos, posts, badmintonPhotos, footballPhotos, weddingPhotos] = await Promise.all([
    getGallery('cafe'),
    getPublishedPosts(3),
    getGallery('badminton'),
    getGallery('football'),
    getGallery('wedding'),
  ]);
  const cafeImage  = cafePhotos[0]?.url;
  const heroSlides = buildHeroSlides(badmintonPhotos, footballPhotos, weddingPhotos);
```

- [ ] **Step 3: Truyền `slides` vào `PageHero`**

Thêm `slides={heroSlides}` vào `<PageHero>` của trang chủ, ngay sau prop `description`. Kho ảnh trống thì `heroSlides` là mảng rỗng và `PageHero` tự về nền đen — không cần thêm điều kiện.

- [ ] **Step 4: Chạy toàn bộ test + kiểm tra kiểu**

Chạy: `npm test`
Mong đợi: PASS toàn bộ, gồm cả 5 test của `buildHeroSlides`.

Chạy: `npx tsc --noEmit`
Mong đợi: không lỗi.

- [ ] **Step 5: Nghiệm thu bằng mắt**

Chạy `npm run dev` (nếu chưa chạy) rồi mở `http://localhost:3000/`:
- Hero hiện ảnh sân cầu lông, sau ~5 giây mờ sang ảnh sân bóng đá, rồi tiệc cưới, rồi quay lại.
- Bấm từng chấm → nhảy đúng ảnh tương ứng.
- Chữ "Song Thạch — Come play, stay, relax" và 2 nút "Đặt sân ngay" / "Khám phá tổ hợp" vẫn đọc rõ và bấm được trên nền ảnh.
- Mở `/wedding` → hero vẫn là ảnh tĩnh như cũ, không có chấm.

**Nếu hero vẫn đen:** kiểm tra `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local`. Key đang lỗi `401 Unregistered API key` nên `getGallery()` trả rỗng ở local — đó là lỗi môi trường, không phải lỗi code. Xác nhận bằng cách gọi thẳng `getGallery` hoặc mở `/admin/gallery`.

- [ ] **Step 6: Commit**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat: hero trang chu chay slide anh cau long, bong da, tiec cuoi"
```

---

### Task 5: Commit spec và plan

**Files:**
- Modify: `docs/superpowers/specs/2026-08-15-hero-slideshow-trang-chu-design.md`
- Modify: `docs/superpowers/plans/2026-08-15-hero-slideshow-trang-chu.md`

- [ ] **Step 1: Commit tài liệu**

```bash
git add docs/superpowers/specs/2026-08-15-hero-slideshow-trang-chu-design.md docs/superpowers/plans/2026-08-15-hero-slideshow-trang-chu.md
git commit -m "docs: spec va plan cho slide anh hero trang chu"
```
