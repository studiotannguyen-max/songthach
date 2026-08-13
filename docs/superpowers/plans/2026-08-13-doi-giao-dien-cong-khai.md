# Đổi giao diện khu công khai Song Thạch — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay toàn bộ giao diện khu công khai từ poster retro (kem/mù tạt/terracotta) sang khung trắng sạch với một màu nhấn xanh lá, hero tĩnh, theo spec `docs/superpowers/specs/2026-08-13-doi-giao-dien-cong-khai-design.md`.

**Architecture:** Đổi token trước (`globals.css` + `tailwind.config.ts`), dựng bộ thành phần dùng lại trong `src/components/ui/`, rồi chuyển từng trang sang dùng bộ đó. Khu `/admin` được đóng băng bằng một file CSS riêng giữ nguyên màu cũ, nên việc đổi token công khai không đụng tới nó. Trang chủ làm sớm để chủ site duyệt hướng trước khi nhân ra 12 trang còn lại.

**Tech Stack:** Next.js 14.2.35 App Router (chạy dev bằng `--turbo`), React 18, TypeScript, Tailwind CSS 3.4 (config `tailwind.config.ts`), lucide-react, Supabase. Không có framework test.

## Global Constraints

- **Không có framework test trong dự án.** Xác minh = `npx tsc --noEmit` sạch + `npm run build` sạch + xem thật bằng mắt ở 360px và 1280px. Không được bịa ra test runner.
- **KHÔNG chạy `npm run build` khi dev server đang chạy** — làm hỏng `.next` (`Cannot find module './XXXX.js'`). Tắt dev server trước, hoặc chỉ dùng `npx tsc --noEmit` trong lúc dev.
- **Không sửa** bất kỳ file nào trong `src/app/admin/`, `src/components/admin/`, `src/app/api/`, `src/lib/`. Ngoại lệ duy nhất: Task 1 tạo file CSS mới để đóng băng giao diện admin.
- **Không sửa logic** đặt sân, gửi email, xác thực. Chỉ đổi lớp trình bày.
- Bảng màu — đúng chín giá trị, không thêm màu nào khác:
  `--bg: #FFFFFF` · `--bg-subtle: #F4F5F6` · `--fg: #111315` · `--fg-muted: #5B6165` · `--line: #E3E5E7` · `--ink: #101314` · `--brand: #00A94F` · `--brand-strong: #007A33` · `--danger: #D92D20`
- `--brand` (`#00A94F`) **không bao giờ dùng cho chữ** (tương phản 2.9:1). Mọi chữ và nền nút dùng `--brand-strong` (`#007A33`).
- Hai font: `--font-display` = Oswald (in hoa, weight 600, letter-spacing 0.02em), `--font-sans` = Geist.
- `--radius: 4px`.
- Vùng bấm tối thiểu `44×44px`, cách nhau `≥ 8px`. Chữ nội dung `≥ 14px`.
- Mốc responsive: `360 / 768 / 1280`. Khung nội dung rộng tối đa `1280px`.
- Mỗi trang công khai chừa `padding-bottom: 96px` để thanh tab dưới không che nội dung.
- Không slider, không carousel, không ảnh tự chạy.
- Commit tiếng Việt, mỗi task một commit, kết thúc bằng:
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

---

## Cấu trúc file

**Tạo mới**

| File | Trách nhiệm |
|---|---|
| `src/app/admin-legacy.css` | Đóng băng giao diện admin: giữ nguyên các lớp cũ với mã màu literal |
| `src/components/ui/Button.tsx` | Nút 3 kiểu × 3 cỡ |
| `src/components/ui/Card.tsx` | Thẻ viền, có biến thể ảnh trên |
| `src/components/ui/SectionHeader.tsx` | Nhãn + tiêu đề section + mô tả |
| `src/components/ui/Badge.tsx` | Nhãn trạng thái |
| `src/components/ui/Field.tsx` | Nhãn + ô nhập + báo lỗi |
| `src/components/ui/Breadcrumb.tsx` | Đường dẫn trang con |
| `src/components/ui/PageHero.tsx` | Hero tĩnh dùng chung |
| `src/components/ui/DataTable.tsx` | Bảng cuộn ngang, tự đổi sang thẻ dưới 768px |
| `src/components/ui/index.ts` | Xuất gộp |

**Sửa**

| File | Việc |
|---|---|
| `src/app/globals.css` | Thay toàn bộ token; gỡ lớp zone cũ; gỡ font thừa |
| `src/app/layout.tsx` | Nạp `admin-legacy.css` |
| `tailwind.config.ts` | Gỡ `sports`/`wedding`/`cafe`; ánh xạ lại token |
| `src/components/shared/Navbar.tsx` | Dựng lại |
| `src/components/shared/Footer.tsx` | Dựng lại |
| `src/components/shared/MobileTabBar.tsx` | Thay lớp áo |
| `src/app/(public)/layout.tsx` | Thêm đệm dưới 96px |
| `src/app/(public)/page.tsx` | Dựng lại bằng bộ ui |
| `src/app/(public)/sports/page.tsx` + `football/` + `badminton/` | Dựng lại |
| `src/components/sports/BookingWidget.tsx` | Thay lớp `.time-slot*` |
| `src/app/(public)/wedding/page.tsx`, `src/components/wedding/InquiryForm.tsx` | Dựng lại |
| `src/app/(public)/cafe/page.tsx` | Dựng lại |
| `src/app/(public)/tin-tuc/page.tsx` + `[slug]/page.tsx` | Dựng lại |
| `src/app/(public)/giai-dau-rating/**` (4 trang) | Dựng lại |
| `src/app/(public)/profile/page.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/complete-profile/page.tsx` | Dựng lại form |

**Xoá**

| File | Lý do |
|---|---|
| `src/app/(public)/giai-cau-long-2026/` (5 file) | Giải đã tổ chức xong |
| `scripts/import-hoc-bong.mjs` | Chỉ sinh dữ liệu cho trang trên |
| `src/app/(public)/giai-dau-rating/rating.css` | Token retro riêng, không còn dùng |

---

### Task 0: Bảo toàn hiện trạng trước khi đụng vào gì

Trong cây làm việc đang có file **chưa từng được commit** — xoá là mất vĩnh viễn, git không khôi phục được. Task này phải chạy trước mọi task khác.

**Files:**
- Modify: không sửa file nào, chỉ thao tác git

**Interfaces:**
- Consumes: không
- Produces: nhánh `feat/giao-dien-moi` với toàn bộ hiện trạng đã commit

- [ ] **Step 1: Xem những gì đang chưa commit**

```bash
git -C /d/songthach status -sb
```

Phải thấy các dòng `??` gồm ít nhất `src/app/(public)/giai-cau-long-2026/nha-tai-tro-data.ts` và `scripts/import-hoc-bong.mjs`. Nếu không thấy `??` nào thì hiện trạng đã sạch, sang Step 4.

- [ ] **Step 2: Tạo nhánh làm việc từ nhánh hiện tại**

```bash
git -C /d/songthach checkout -b feat/giao-dien-moi
```

Nhánh gốc là `feat/giai-dau-rating`. Không đụng tới `main`.

- [ ] **Step 3: Commit toàn bộ hiện trạng**

```bash
git -C /d/songthach add -A
git -C /d/songthach commit -m "chore: lưu hiện trạng trước khi đổi giao diện

Gồm cả file chưa từng commit: nha-tai-tro-data.ts, scripts/import-hoc-bong.mjs,
dữ liệu học bổng và các bài viết PR ở thư mục gốc. Commit này để mọi thứ có thể
lấy lại được sau khi xoá trang Giải Cầu Lông 2026 ở task sau.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: Xác nhận cây làm việc sạch**

```bash
git -C /d/songthach status -s
```

Kỳ vọng: không in ra gì. Nếu còn dòng nào, dừng lại và báo người dùng — không được sang task sau khi còn file chưa commit.

---

### Task 1: Token nền tảng và đóng băng admin

Đây là task rủi ro nhất: gỡ màu cũ sẽ làm vỡ khu admin nếu không xử lý trước. Các lớp `.admin-card` (6 trang admin), `.status-badge` (3 trang), `.sports-btn` (`src/app/admin/login/page.tsx`), `.gradient-sports` (`src/components/admin/PostForm.tsx`) đều đang ăn theo token công khai.

Cách xử lý: chép các lớp admin dùng sang file riêng với **mã màu literal đúng như đang hiển thị hôm nay**, admin không đổi một pixel nào.

**Files:**
- Create: `src/app/admin-legacy.css`
- Modify: `src/app/globals.css` (thay toàn bộ), `tailwind.config.ts:13-91`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: không
- Produces: biến CSS `--bg --bg-subtle --fg --fg-muted --line --ink --brand --brand-strong --danger --radius --font-display --font-sans`; lớp Tailwind `bg-bg bg-bg-subtle text-fg text-fg-muted border-line bg-ink bg-brand bg-brand-strong text-brand-strong text-danger`; lớp tiện ích `.container-page`, `.section`, `.h-display`

- [ ] **Step 1: Tạo file đóng băng admin**

Tạo `src/app/admin-legacy.css`. Mọi mã màu ở đây là literal, cố tình không dùng biến — mục đích là admin miễn nhiễm với mọi thay đổi token về sau.

```css
/* Giao diện cũ của khu /admin — ĐÓNG BĂNG.
   Các lớp này trước đây nằm trong globals.css và ăn theo token của khu công khai.
   Khu công khai đã đổi sang bảng màu mới, nên chép sang đây với mã màu literal
   để admin giữ nguyên hình dạng cũ. Đừng sửa file này khi đổi giao diện công khai. */

.admin-card {
  background: #ffffff;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0;
  box-shadow: 3px 3px 0 #e5e7eb;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0;
  letter-spacing: 0.05em;
}
.status-pending      { background: #fef9c3; color: #854d0e; }
.status-deposit_paid { background: #dbeafe; color: #1e40af; }
.status-completed    { background: #dcfce7; color: #166534; }
.status-cancelled    { background: #fee2e2; color: #991b1b; }
.status-new          { background: #f3e8ff; color: #6b21a8; }
.status-contacted    { background: #dbeafe; color: #1e40af; }
.status-quoted       { background: #ffedd5; color: #9a3412; }
.status-booked       { background: #dcfce7; color: #166534; }

.inp {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}
.inp:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(197, 83, 47, 0.3);
}

/* admin/login dùng .sports-btn; PostForm dùng .gradient-sports */
.admin-legacy-btn,
.sports-btn {
  background: #C5532F;
  color: #ffffff;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 0;
  border: 2px solid #3B2A1E;
  box-shadow: 3px 3px 0 #A33E1F;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.sports-btn:hover  { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 #A33E1F; }
.sports-btn:active { transform: translate(2px, 2px);   box-shadow: 1px 1px 0 #A33E1F; }

.gradient-sports { background: #3B2A1E; }
```

Lưu ý về `.status-badge`: bản cũ đặt `font-family: var(--font-bebas)`, mà font đó **chưa bao giờ được nạp** nên trình duyệt vẫn đang dựng bằng font mặc định. Bỏ dòng đó đi cho kết quả y hệt.

`.sports-btn` cố tình giữ tên cũ vì `src/app/admin/login/page.tsx` đang dùng — không được sửa file admin.

- [ ] **Step 2: Nạp file đóng băng**

Trong `src/app/layout.tsx`, thêm ngay dưới dòng import `globals.css`:

```tsx
import './globals.css';
import './admin-legacy.css';
```

- [ ] **Step 3: Viết lại globals.css**

Thay **toàn bộ** nội dung `src/app/globals.css` bằng:

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Oswald:wght@500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* ── Chữ ── */
  --font-sans:    'Geist', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Oswald', var(--font-sans);

  /* ── Chín màu, không hơn ── */
  --bg:           #FFFFFF;
  --bg-subtle:    #F4F5F6;
  --fg:           #111315;
  --fg-muted:     #5B6165;
  --line:         #E3E5E7;
  --ink:          #101314;
  --brand:        #00A94F;
  --brand-strong: #007A33;
  --danger:       #D92D20;

  --radius: 4px;

  /* ── Ánh xạ token shadcn sang bảng trên ── */
  --background: var(--bg);
  --foreground: var(--fg);
  --card: var(--bg);
  --card-foreground: var(--fg);
  --popover: var(--bg);
  --popover-foreground: var(--fg);
  --primary: var(--brand-strong);
  --primary-foreground: #FFFFFF;
  --secondary: var(--bg-subtle);
  --secondary-foreground: var(--fg);
  --muted: var(--bg-subtle);
  --muted-foreground: var(--fg-muted);
  --accent: var(--brand);
  --accent-foreground: #FFFFFF;
  --destructive: var(--danger);
  --destructive-foreground: #FFFFFF;
  --border: var(--line);
  --input: var(--line);
  --ring: var(--brand-strong);
}

@layer base {
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--font-sans);
    color: var(--fg);
    background: var(--bg);
    line-height: 1.6;
  }

  h1, h2, h3 {
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    line-height: 1.1;
  }

  :focus-visible {
    outline: 2px solid var(--brand-strong);
    outline-offset: 2px;
  }

  ::selection { background: var(--brand); color: #FFFFFF; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-subtle); }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }
}

@layer components {
  .container-page {
    width: 100%;
    max-width: 1280px;
    margin-inline: auto;
    padding-inline: 16px;
  }
  @media (min-width: 768px) {
    .container-page { padding-inline: 24px; }
  }

  .section { padding-block: 64px; }
  @media (min-width: 768px) {
    .section { padding-block: 96px; }
  }

  .h-display {
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
}

@layer utilities {
  .text-balance { text-wrap: balance; }
  .animate-delay-100 { animation-delay: 100ms; }
  .animate-delay-200 { animation-delay: 200ms; }
  .animate-delay-300 { animation-delay: 300ms; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Những thứ bị gỡ và lý do:

| Gỡ | Lý do |
|---|---|
| `Playfair Display`, `Bricolage Grotesque`, `IBM Plex Mono` trong `@import` | Khai báo nhưng không trang nào dùng |
| `--font-bebas` (`'Barlow Condensed'`) | Chưa bao giờ được nạp — tiêu đề đang rơi về font mặc định của máy khách |
| `--font-playfair`, `--font-oswald`, `--font-geist`, `--font-inter`, `--font-mono`, `--font-bricolage`, `--font-plex-mono` | Gộp còn hai biến |
| Toàn bộ `--gia-*` (13 biến) | Bảng màu retro |
| `--chart-1..5`, `--sidebar-*` | Không nơi nào dùng |
| `.sports-card`, `.sports-btn-accent`, `.sports-hero-text`, `.time-slot*`, `.wedding-*`, `.gold-divider`, `.cafe-tag` | Chuyển sang bộ `ui/`, các task sau thay thế |
| `.admin-card`, `.status-badge*`, `.inp`, `.sports-btn`, `.gradient-sports` | Đã chép sang `admin-legacy.css` |
| `.eyebrow`, `.img-editorial*`, `.gradient-wedding`, `.animate-float-sticker`, `@keyframes float-sticker` | Không nơi nào dùng |

`.sports-btn`, `.sports-card`, `.sports-hero-text`, `.gradient-sports` vẫn còn được các trang **công khai** dùng ở thời điểm này (`sports/`, `login`, `complete-profile`) — chúng sẽ tạm dựng bằng bản trong `admin-legacy.css` cho tới khi task tương ứng thay xong. Trang sẽ trông lệch tông trong vài task, đó là dự kiến.

- [ ] **Step 4: Sửa tailwind.config.ts**

Trong `tailwind.config.ts`, xoá ba khối `sports`, `wedding`, `cafe` (dòng 64-83) và toàn bộ `chart` (57-63) và `sidebar` (47-56). Thay khối `colors` và `fontFamily` bằng:

```ts
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary:     { DEFAULT: 'var(--primary)',     foreground: 'var(--primary-foreground)' },
        secondary:   { DEFAULT: 'var(--secondary)',   foreground: 'var(--secondary-foreground)' },
        destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
        muted:       { DEFAULT: 'var(--muted)',       foreground: 'var(--muted-foreground)' },
        accent:      { DEFAULT: 'var(--accent)',      foreground: 'var(--accent-foreground)' },
        popover:     { DEFAULT: 'var(--popover)',     foreground: 'var(--popover-foreground)' },
        card:        { DEFAULT: 'var(--card)',        foreground: 'var(--card-foreground)' },

        bg:            'var(--bg)',
        'bg-subtle':   'var(--bg-subtle)',
        fg:            'var(--fg)',
        'fg-muted':    'var(--fg-muted)',
        line:          'var(--line)',
        ink:           'var(--ink)',
        brand:         'var(--brand)',
        'brand-strong':'var(--brand-strong)',
        danger:        'var(--danger)',
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
```

Trong `keyframes`/`animation`, xoá `float` (bập bênh 6 giây, không hợp phong cách mới). Giữ `fadeUp`, `fadeIn`, `slideLeft`.

- [ ] **Step 5: Tìm chỗ vỡ do gỡ token**

```bash
cd /d/songthach && grep -rn "sports-primary\|sports-accent\|sports-dark\|sports-light\|wedding-primary\|wedding-accent\|wedding-dark\|wedding-cream\|wedding-rose\|cafe-primary\|cafe-accent\|cafe-dark\|cafe-light\|font-bebas\|font-serif\|font-sport\|--gia-" src/ --include=*.tsx --include=*.ts --include=*.css | grep -v admin-legacy.css
```

Ghi lại danh sách này — mỗi dòng là một chỗ các task sau phải xử lý. Chưa sửa gì ở task này. Các lớp Tailwind không còn tồn tại sẽ **không gây lỗi biên dịch**, chúng chỉ lặng lẽ không sinh ra CSS; đó là lý do phải grep thủ công thay vì trông chờ `tsc`.

- [ ] **Step 6: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

Kỳ vọng: không lỗi.

- [ ] **Step 7: Xem admin còn nguyên không**

Chạy dev server (`npm run dev`), mở `http://localhost:3000/admin/login` và `http://localhost:3000/admin`. Nút đăng nhập và các thẻ `admin-card` phải trông **y như trước** — nền trắng, viền xám 2px, bóng đổ cứng 3px. Nếu lệch, sửa `admin-legacy.css` chứ không sửa file admin.

- [ ] **Step 8: Commit**

```bash
git -C /d/songthach add src/app/globals.css src/app/admin-legacy.css src/app/layout.tsx tailwind.config.ts
git -C /d/songthach commit -m "feat(ui): bảng màu trắng + xanh lá, hai font, đóng băng giao diện admin

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Bộ thành phần cơ bản

**Files:**
- Create: `src/components/ui/Button.tsx`, `Card.tsx`, `SectionHeader.tsx`, `Badge.tsx`, `Field.tsx`, `Breadcrumb.tsx`, `index.ts`

**Interfaces:**
- Consumes: token từ Task 1; `cn` từ `@/lib/utils`
- Produces:
  - `Button({ variant?: 'solid'|'outline'|'ghost', size?: 'sm'|'md'|'lg', className?, ...button })`
  - `Card({ className?, children })`, `CardImage({ src, alt, ratio? })`, `CardBody({ children })`
  - `SectionHeader({ label?, title, description?, align?: 'left'|'center' })`
  - `Badge({ tone?: 'neutral'|'brand'|'danger', children })`
  - `Field({ label, htmlFor, error?, hint?, required?, children })`
  - `Breadcrumb({ items: { label: string; href?: string }[] })`

- [ ] **Step 1: Button**

```tsx
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  solid:   'bg-brand-strong text-white border border-brand-strong hover:bg-[#00692C]',
  outline: 'bg-transparent text-fg border border-line hover:border-brand hover:text-brand-strong',
  ghost:   'bg-transparent text-brand-strong border border-transparent hover:bg-bg-subtle',
};

// Cỡ nhỏ nhất vẫn cao 44px — quy tắc vùng bấm tối thiểu trên điện thoại.
const SIZES: Record<Size, string> = {
  sm: 'min-h-[44px] px-4 text-sm',
  md: 'min-h-[48px] px-6 text-sm',
  lg: 'min-h-[56px] px-8 text-base',
};

export default function Button({
  variant = 'solid', size = 'md', className, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded font-display uppercase tracking-[0.06em]',
        'transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant], SIZES[size], className,
      )}
    />
  );
}
```

- [ ] **Step 2: Card**

```tsx
// src/components/ui/Card.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn(
      'rounded border border-line bg-bg overflow-hidden',
      'transition-[border-color,box-shadow] duration-150',
      'hover:border-brand hover:shadow-[0_2px_8px_rgb(0_0_0/0.08)]',
      className,
    )}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt, ratio = '16/10' }: { src: string; alt: string; ratio?: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
    </div>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}
```

- [ ] **Step 3: SectionHeader**

```tsx
// src/components/ui/SectionHeader.tsx
import { cn } from '@/lib/utils';

export default function SectionHeader({
  label, title, description, align = 'left',
}: { label?: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return (
    <div className={cn('mb-8 md:mb-12', align === 'center' && 'text-center mx-auto max-w-2xl')}>
      {label && (
        <p className="text-xs uppercase tracking-[0.08em] text-brand-strong font-semibold mb-3">
          {label}
        </p>
      )}
      <h2 className="text-[clamp(28px,3.5vw,44px)]">{title}</h2>
      {description && <p className="mt-4 text-fg-muted">{description}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Badge**

```tsx
// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const TONES = {
  neutral: 'bg-bg-subtle text-fg-muted border-line',
  brand:   'bg-[#E6F6EC] text-brand-strong border-[#B9E3C9]',
  danger:  'bg-[#FDECEA] text-danger border-[#F5C3BE]',
} as const;

export default function Badge({
  tone = 'neutral', children,
}: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em]',
      TONES[tone],
    )}>
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Field**

```tsx
// src/components/ui/Field.tsx
import type { ReactNode } from 'react';

export default function Field({
  label, htmlFor, error, hint, required, children,
}: {
  label: string; htmlFor: string; error?: string; hint?: string;
  required?: boolean; children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-fg mb-2">
        {label}{required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {hint  && <p id={`${htmlFor}-hint`}  className="mt-1.5 text-xs text-fg-muted">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

// Lớp dùng chung cho <input>/<select>/<textarea> đặt bên trong Field.
// Cao 48px để đạt vùng bấm tối thiểu.
export const inputClass =
  'w-full min-h-[48px] rounded border border-line bg-bg px-3 text-base text-fg ' +
  'placeholder:text-fg-muted focus:border-brand-strong focus:outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-brand-strong';
```

`aria-describedby` phải đặt trên chính thẻ `<input>` khi dùng, ví dụ:
`<input id="phone" aria-describedby={error ? 'phone-error' : undefined} className={inputClass} />`

- [ ] **Step 6: Breadcrumb**

```tsx
// src/components/ui/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Đường dẫn" className="flex items-center gap-1.5 text-xs text-fg-muted flex-wrap">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
          {item.href
            ? <Link href={item.href} className="hover:text-brand-strong">{item.label}</Link>
            : <span className="text-fg">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 7: index.ts**

```ts
// src/components/ui/index.ts
export { default as Button } from './Button';
export { Card, CardImage, CardBody } from './Card';
export { default as SectionHeader } from './SectionHeader';
export { default as Badge } from './Badge';
export { default as Field, inputClass } from './Field';
export { default as Breadcrumb } from './Breadcrumb';
export { default as PageHero } from './PageHero';
export { default as DataTable } from './DataTable';
```

Hai dòng cuối trỏ tới file của Task 3 nên `tsc` sẽ báo lỗi cho tới khi Task 3 xong. Tạm thời **chú thích hai dòng đó lại**, Task 3 sẽ bỏ chú thích.

- [ ] **Step 8: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

Kỳ vọng: không lỗi.

- [ ] **Step 9: Commit**

```bash
git -C /d/songthach add src/components/ui
git -C /d/songthach commit -m "feat(ui): bộ thành phần dùng chung — Button, Card, SectionHeader, Badge, Field, Breadcrumb

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: PageHero và DataTable

**Files:**
- Create: `src/components/ui/PageHero.tsx`, `src/components/ui/DataTable.tsx`
- Modify: `src/components/ui/index.ts` (bỏ chú thích 2 dòng cuối)

**Interfaces:**
- Consumes: `Button` từ Task 2
- Produces:
  - `PageHero({ label?, title, description?, image?, cta? })` với `cta: { label: string; href: string }`
  - `DataTable({ columns, rows, cardTitle })` với `columns: { key: string; header: string; align?: 'left'|'right' }[]`, `rows: Record<string, ReactNode>[]`, `cardTitle: (row) => ReactNode`

- [ ] **Step 1: PageHero**

Không slider, không nút chuyển ảnh, không tự chạy — hero là một ảnh tĩnh.

```tsx
// src/components/ui/PageHero.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function PageHero({
  label, title, description, image, cta,
}: {
  label?: string;
  title: string;
  description?: string;
  image?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative w-full h-[44vh] md:h-[56vh] md:max-h-[640px] min-h-[320px] bg-ink">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* Lớp phủ chuyển từ trái — chữ đọc được bất kể ảnh sáng hay tối */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgb(16 19 20 / .78), rgb(16 19 20 / .25))' }}
      />
      <div className="container-page relative h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          {label && (
            <p className="text-xs uppercase tracking-[0.08em] text-white/80 font-semibold mb-3">
              {label}
            </p>
          )}
          <h1 className="text-[clamp(40px,6vw,72px)] text-white">{title}</h1>
          {description && <p className="mt-4 text-white/85 text-base md:text-lg">{description}</p>}
          {cta && (
            <Link href={cta.href} className="inline-block mt-8">
              <span className="inline-flex items-center justify-center min-h-[48px] px-6 rounded bg-brand-strong text-white font-display uppercase tracking-[0.06em] text-sm hover:bg-[#00692C] transition-colors">
                {cta.label}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
```

Không truyền `image` thì nền `bg-ink` lộ ra — đó là biến thể không ảnh, **không để ô ảnh trống**.

- [ ] **Step 2: DataTable**

Dưới 768px hiện dạng thẻ xếp dọc; từ 768px trở lên hiện bảng cuộn ngang có cột đầu ghim.

```tsx
// src/components/ui/DataTable.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Column { key: string; header: string; align?: 'left' | 'right' }

export default function DataTable({
  columns, rows, cardTitle,
}: {
  columns: Column[];
  rows: Record<string, ReactNode>[];
  cardTitle: (row: Record<string, ReactNode>) => ReactNode;
}) {
  return (
    <>
      {/* Điện thoại — thẻ xếp dọc, không bao giờ đẩy trang ngang */}
      <ul className="md:hidden space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="rounded border border-line p-4">
            <div className="font-display uppercase text-fg mb-3">{cardTitle(row)}</div>
            <dl className="space-y-1.5">
              {columns.slice(1).map((c) => (
                <div key={c.key} className="flex justify-between gap-4 text-sm">
                  <dt className="text-fg-muted">{c.header}</dt>
                  <dd className="text-fg text-right">{row[c.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Máy tính — bảng cuộn ngang trong khung riêng, cột đầu ghim */}
      <div className="hidden md:block overflow-x-auto rounded border border-line">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-bg-subtle">
              {columns.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 font-display uppercase tracking-[0.06em] text-xs text-fg whitespace-nowrap',
                    c.align === 'right' ? 'text-right' : 'text-left',
                    i === 0 && 'sticky left-0 bg-bg-subtle z-10',
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-line">
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    className={cn(
                      'px-4 py-3 text-fg',
                      c.align === 'right' ? 'text-right' : 'text-left',
                      ci === 0 && 'sticky left-0 bg-bg z-10 font-semibold',
                    )}
                  >
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Bật lại hai dòng export**

Bỏ chú thích hai dòng `PageHero` và `DataTable` trong `src/components/ui/index.ts`.

- [ ] **Step 4: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

Kỳ vọng: không lỗi.

- [ ] **Step 5: Commit**

```bash
git -C /d/songthach add src/components/ui
git -C /d/songthach commit -m "feat(ui): PageHero tĩnh và DataTable tự đổi sang thẻ trên điện thoại

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Navbar

**Files:**
- Modify: `src/components/shared/Navbar.tsx` (dựng lại toàn bộ, 262 dòng → khoảng 150)

**Interfaces:**
- Consumes: `Button` từ Task 2; `useAuth` từ `@/components/providers/AuthProvider`; `useSportPicker` từ `@/components/providers/SportPickerProvider`
- Produces: không có API mới — vẫn là `export default function Navbar()`

Bốn thay đổi hành vi so với bản cũ:

1. **Bỏ nền trong suốt.** Bản cũ tính `solid = scrolled || isHome || (!isSports && !isWedding)` rồi đổi giữa hai bộ màu chữ — nguồn gốc lỗi chữ trắng trên nền sáng. Nay luôn nền trắng, một bộ màu duy nhất. Xoá luôn state `scrolled` và listener `scroll`.
2. **Bỏ toàn bộ icon lucide cạnh chữ menu** (`Goal`, `Feather`, `Trophy`, `Medal`, `Heart`, `Coffee`).
3. **Bỏ mục "Giải Cầu Lông 2026"** — còn 5 mục.
4. **Menu điện thoại mở tràn màn hình** thay vì khay xổ chật. Mỗi mục cao 56px.

- [ ] **Step 1: Viết lại Navbar**

```tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSportPicker } from '@/components/providers/SportPickerProvider';
import { Button } from '@/components/ui';

const ZONE_LINKS = [
  { label: 'Sân Bóng Đá',     href: '/sports/football' },
  { label: 'Sân Cầu Lông',    href: '/sports/badminton' },
  { label: 'Giải đấu Rating', href: '/giai-dau-rating' },
  { label: 'Tiệc Cưới',       href: '/wedding' },
  { label: 'Lavie en Rose',   href: '/cafe' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading, signOut } = useAuth();
  const { open: openSportPicker }  = useSportPicker();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);

  useEffect(() => {
    if (!userMenu) return;
    const close = () => setUserMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userMenu]);

  // Khoá cuộn nền khi menu tràn màn hình đang mở
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Tài khoản';
  const initials    = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOut();
    setUserMenu(false);
    setMobileOpen(false);
    router.push('/');
  }

  return (
    <nav aria-label="Điều hướng chính" className="sticky top-0 z-50 bg-bg border-b border-line">
      <div className="container-page">
        <div className="flex items-center justify-between h-14 md:h-[72px] gap-6">

          <Link href="/" aria-label="Song Thạch — Trang chủ" className="shrink-0">
            <Image src="/logo.png" alt="Song Thạch" width={95} height={44}
                   className="object-contain" style={{ maxHeight: '40px', width: 'auto' }} />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {ZONE_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'font-display uppercase text-[13px] tracking-[0.06em] whitespace-nowrap',
                    'py-2 border-b-2 transition-colors',
                    active
                      ? 'text-fg border-brand'
                      : 'text-fg border-transparent hover:text-brand-strong',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {loading ? (
              <Loader2 size={18} className="animate-spin text-fg-muted" aria-label="Đang tải..." />
            ) : user ? (
              <div className="relative" onClick={(e) => { e.stopPropagation(); setUserMenu(!userMenu); }}>
                <button
                  className="flex items-center gap-2 min-h-[44px] px-2 rounded hover:bg-bg-subtle transition-colors"
                  aria-expanded={userMenu}
                  aria-haspopup="menu"
                  aria-label={`Tài khoản: ${displayName}`}
                >
                  <span className="w-8 h-8 rounded-full bg-brand-strong text-white grid place-items-center font-bold text-sm" aria-hidden="true">
                    {initials}
                  </span>
                  <span className="text-sm font-medium max-w-[120px] truncate text-fg">{displayName}</span>
                  <ChevronDown size={14} className="text-fg-muted" aria-hidden="true" />
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded border border-line bg-bg shadow-[0_2px_8px_rgb(0_0_0/0.08)] py-1" role="menu">
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-xs text-fg-muted">Đăng nhập với</p>
                      <p className="text-sm font-semibold text-fg truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" role="menuitem" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-fg hover:bg-bg-subtle">
                      <User size={15} aria-hidden="true" /> Thông tin tài khoản
                    </Link>
                    <button onClick={handleSignOut} role="menuitem"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-bg-subtle">
                      <LogOut size={15} aria-hidden="true" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-fg hover:text-brand-strong px-3 min-h-[44px] flex items-center">
                Đăng nhập
              </Link>
            )}
            <Button size="sm" onClick={openSportPicker}>Đặt sân</Button>
          </div>

          <button
            className="lg:hidden grid place-items-center w-11 h-11 -mr-2 text-fg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-40 bg-bg overflow-y-auto">
          <ul className="container-page py-2">
            {ZONE_LINKS.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center h-14 font-display uppercase text-lg tracking-[0.04em] text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="container-page py-6 space-y-3">
            <Button className="w-full" onClick={() => { setMobileOpen(false); openSportPicker(); }}>
              Đặt sân ngay
            </Button>
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center min-h-[48px] rounded border border-line text-sm text-fg">
                  Thông tin tài khoản
                </Link>
                <button onClick={handleSignOut}
                        className="w-full min-h-[48px] rounded border border-line text-sm text-danger">
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center min-h-[48px] rounded border border-line text-sm text-fg">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Sửa đệm trên của các trang**

Navbar cũ là `fixed`, nay là `sticky` — các trang đang tự chừa khoảng trống cho nav sẽ dư ra một khoảng trắng.

```bash
cd /d/songthach && grep -rn "pt-16\|pt-20\|pt-\[64px\]\|pt-\[80px\]\|mt-16\|mt-20" "src/app/(public)" src/app/\(auth\) | head -20
```

Xoá các lớp đệm trên đó — `sticky` không chiếm chỗ như `fixed` nên không cần bù.

- [ ] **Step 3: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 4: Xem thật**

Chạy `npm run dev`. Kiểm ở 360px và 1280px:

- Nav luôn trắng, kể cả khi ở đầu trang `/wedding` và `/sports/football` (hai trang trước đây dùng nav trong suốt).
- 5 mục menu, không có icon, mục đang xem có gạch chân xanh.
- Ở 360px: chỉ thấy logo + nút hamburger; bấm vào mở tràn màn hình, nền không cuộn được sau lưng.
- Dùng phím Tab đi hết nav — mọi mục đều thấy viền tiêu điểm.

- [ ] **Step 5: Commit**

```bash
git -C /d/songthach add src/components/shared/Navbar.tsx "src/app/(public)" "src/app/(auth)"
git -C /d/songthach commit -m "feat(nav): thanh nav trắng, bỏ nền trong suốt và icon, menu mobile tràn màn hình

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Footer, MobileTabBar, đệm dưới

**Files:**
- Modify: `src/components/shared/Footer.tsx`, `src/components/shared/MobileTabBar.tsx`, `src/app/(public)/layout.tsx`

**Interfaces:**
- Consumes: token Task 1
- Produces: không có API mới

- [ ] **Step 1: Footer**

Giữ nguyên cấu trúc và toàn bộ nội dung chữ (địa chỉ `9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai`, số `0378 990 979` và `0886 798 690`, các liên kết). Chỉ thay lớp trình bày trong `src/components/shared/Footer.tsx`:

| Cũ | Mới |
|---|---|
| `const GREEN = '#3B2A1E'` | xoá hằng, dùng `bg-ink` |
| `const YELLOW = '#E3A21A'` | xoá hằng, dùng `text-brand` |
| `borderTop: '4px solid #E3A21A'` | xoá hẳn |
| `color: 'rgba(255,255,255,.75)'` | `text-white/75` |
| tiêu đề cột `fontFamily: 'var(--font-bebas)'` | `className="font-display text-brand text-lg tracking-[0.08em]"` |
| ô mạng xã hội `border: 2px solid #E3A21A` | `border border-white/25 text-white hover:border-brand hover:text-brand`, kích thước `w-11 h-11` (đạt 44px) |
| `py-14` | `py-16` |
| `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | `container-page` |

Giữ `pb-24 sm:pb-0` ở thẻ `<footer>` — đó là chỗ chừa cho thanh tab dưới.

- [ ] **Step 2: MobileTabBar**

Giữ nguyên 4 tab và nút Đặt sân nổi giữa. Thay lớp áo trong `src/components/shared/MobileTabBar.tsx`:

| Cũ | Mới |
|---|---|
| `bg-card border-t-[3px] border-[#3B2A1E]` | `bg-bg border-t border-line` |
| nút giữa `bg-[#3B2A1E]` + `border: '2px solid #3B2A1E'` + `boxShadow: '3px 3px 0 #A33E1F'` | `bg-brand-strong text-white rounded` , bỏ hẳn `boxShadow` và `border` |
| nút giữa `active:translate-x-[2px] active:translate-y-[2px]` | `active:opacity-80` |
| `text-primary` ở nhãn "Đặt sân" | `text-brand-strong` |
| tab đang chọn (trong `TabItem`) | chữ + icon `text-brand-strong`, tab thường `text-fg-muted` |

Mỗi ô tab phải cao ít nhất 44px — kiểm lại `h-16` của lưới là đủ.

- [ ] **Step 3: Đệm dưới cho mọi trang công khai**

Trong `src/app/(public)/layout.tsx`, bọc `{children}` bằng phần tử có đệm dưới:

```tsx
<main className="pb-24 lg:pb-0">{children}</main>
```

`pb-24` = 96px, đúng con số trong spec. Từ `lg` trở lên thanh tab dưới ẩn nên không cần đệm.

- [ ] **Step 4: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 5: Xem thật ở 360px**

Cuộn xuống cuối mọi trang công khai — nội dung cuối cùng không bị thanh tab dưới che. Chân trang nền đen, tiêu đề cột màu xanh, không còn viền vàng.

- [ ] **Step 6: Commit**

```bash
git -C /d/songthach add src/components/shared/Footer.tsx src/components/shared/MobileTabBar.tsx "src/app/(public)/layout.tsx"
git -C /d/songthach commit -m "feat(ui): chân trang nền đen, thanh tab dưới theo hệ màu mới, đệm dưới 96px

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Trang chủ — mốc duyệt

Đây là mốc để chủ site xác nhận "đúng cảm giác chưa" trước khi nhân ra 12 trang còn lại. **Dừng lại xin duyệt sau task này.**

**Files:**
- Modify: `src/app/(public)/page.tsx` (364 dòng, dựng lại)

**Interfaces:**
- Consumes: `PageHero`, `SectionHeader`, `Card`, `CardImage`, `CardBody`, `Button` từ `@/components/ui`
- Produces: không

- [ ] **Step 1: Gỡ hằng màu cũ**

Đầu `src/app/(public)/page.tsx` có các hằng `PAPER`, `SAND`, `PITCH`, `INK` (và có thể vài hằng khác). Xoá hết. Mọi `style={{ background: PAPER }}` thay bằng lớp Tailwind `bg-bg` / `bg-bg-subtle` / `bg-ink`.

- [ ] **Step 2: Dựng lại theo bố cục spec**

Thứ tự section, mỗi section bọc trong `<section className="section">` và nội dung trong `<div className="container-page">`:

1. `<PageHero>` — `label="Tổ hợp thể thao · tiệc cưới · café"`, `title="SONG THẠCH"`, mô tả một dòng, `cta={{ label: 'Đặt sân ngay', href: '/sports' }}`. Chưa có ảnh thì **không truyền** `image` (dùng biến thể nền đen), Task 15 sẽ gắn ảnh.
2. Ba thẻ dịch vụ — lưới `grid gap-6 md:grid-cols-3`, mỗi thẻ là `<Card>` gồm `<CardImage>` + `<CardBody>` (tên khu, một câu mô tả, link). Ba khu: Thể thao `/sports`, Tiệc cưới `/wedding`, Lavie en Rose `/cafe`. Trên 360px xếp dọc — `grid-cols-1` là mặc định nên không cần thêm gì.
3. Dải "Đặt sân nhanh" — `<section className="section bg-ink text-white">`, tiêu đề + một `<Button>` gọi `openSportPicker` hoặc link `/sports`.
4. Ba tin mới nhất — giữ nguyên cách lấy dữ liệu đang có trong file; chỉ thay khung hiển thị bằng `<Card>`. Nếu file hiện chưa lấy tin thì bỏ qua section này, Task 11 thêm sau.
5. Bản đồ + liên hệ — giữ nguyên nội dung, đưa vào `container-page`, khung bản đồ bọc `rounded border border-line overflow-hidden`.

Mọi tiêu đề section dùng `<SectionHeader>`. Không tự viết `<h2>` với `style` inline.

- [ ] **Step 3: Kiểm tra không còn hex cứng**

```bash
cd /d/songthach && grep -n "#[0-9A-Fa-f]\{6\}" "src/app/(public)/page.tsx"
```

Kỳ vọng: không in ra gì.

- [ ] **Step 4: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 5: Xem thật ở 360px và 1280px**

- Không có thanh cuộn ngang ở 360px.
- Ba thẻ dịch vụ xếp dọc trên điện thoại, ba cột trên máy tính.
- Chữ nhỏ nhất trên trang không dưới 14px.
- Tiêu đề hero hiện bằng Oswald in hoa (không phải font mặc định của máy).

- [ ] **Step 6: Commit**

```bash
git -C /d/songthach add "src/app/(public)/page.tsx"
git -C /d/songthach commit -m "feat(home): dựng lại trang chủ theo hệ giao diện mới

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 7: DỪNG — xin chủ site duyệt**

Báo: trang chủ đã xong, mời xem ở `localhost:3000`. Hỏi rõ có đúng hướng không trước khi làm 12 trang còn lại. Nếu cần chỉnh hướng thì sửa ở đây rồi mới đi tiếp — sửa một trang rẻ hơn sửa mười ba trang.

---

### Task 7: Xoá trang Giải Cầu Lông 2026

Chỉ chạy sau khi Task 0 đã commit xong — nếu không, `nha-tai-tro-data.ts` và `scripts/import-hoc-bong.mjs` sẽ mất vĩnh viễn.

**Files:**
- Delete: `src/app/(public)/giai-cau-long-2026/` (`page.tsx`, `giai.css`, `hoc-bong-data.ts`, `nha-tai-tro-data.ts`, `qua-tang-data.ts`), `scripts/import-hoc-bong.mjs`
- Modify: `src/components/shared/Navbar.tsx` — mục menu đã gỡ ở Task 4, chỉ cần xác nhận

**Interfaces:**
- Consumes: không
- Produces: không

- [ ] **Step 1: Xác nhận Task 0 đã commit**

```bash
git -C /d/songthach log --oneline -1 --all -- "src/app/(public)/giai-cau-long-2026/nha-tai-tro-data.ts"
```

Kỳ vọng: in ra một commit. **Nếu không in ra gì, DỪNG LẠI** — file chưa được commit, xoá là mất vĩnh viễn. Quay lại làm Task 0.

- [ ] **Step 2: Xoá**

```bash
cd /d/songthach && git rm -r "src/app/(public)/giai-cau-long-2026" scripts/import-hoc-bong.mjs
```

- [ ] **Step 3: Xác nhận không còn tham chiếu**

```bash
cd /d/songthach && grep -rn "giai-cau-long-2026\|hoc-bong-data\|nha-tai-tro-data\|qua-tang-data" src/ scripts/ 2>/dev/null
```

Kỳ vọng: chỉ còn đúng một dòng — chú thích ở đầu `src/app/(public)/giai-dau-rating/rating.css` nhắc tới tên trang cũ. Sửa chú thích đó hoặc bỏ qua (file này sẽ bị xoá ở Task 12). Không được còn `import` nào.

- [ ] **Step 4: Kiểm tra biên dịch và dựng**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 5: Xác nhận link cũ trả 404**

Mở `http://localhost:3000/giai-cau-long-2026` — phải ra trang 404 của Next. Kiểm cả nav trên máy tính và menu điện thoại: không còn mục "Giải Cầu Lông 2026".

- [ ] **Step 6: Commit**

```bash
git -C /d/songthach commit -m "feat: xoá trang Giải Cầu Lông 2026 (giải đã tổ chức xong)

Xoá cả thư mục trang, dữ liệu học bổng, nhà tài trợ, quà tặng và script nhập
Excel. Nội dung vẫn lấy lại được từ commit trước đó nếu cần.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Khu thể thao

**Files:**
- Modify: `src/app/(public)/sports/page.tsx` (60 dòng), `src/app/(public)/sports/football/page.tsx`, `src/app/(public)/sports/badminton/page.tsx`, `src/components/sports/BookingWidget.tsx`, `src/components/sports/FootballBookingPanel.tsx`

**Interfaces:**
- Consumes: `PageHero`, `SectionHeader`, `Card`, `Button`, `Badge` từ `@/components/ui`
- Produces: không

**Không đổi một dòng logic đặt sân nào** — chỉ đổi lớp trình bày.

- [ ] **Step 1: `/sports`**

`<PageHero>` + hai `<Card>` lớn chọn môn (Bóng đá → `/sports/football`, Cầu lông → `/sports/badminton`). Thay `.sports-card` và `.sports-hero-text`.

- [ ] **Step 2: Hai trang môn**

Thứ tự: `<PageHero>` → bảng giá theo khung giờ → widget đặt sân → tiện ích → hỏi đáp.

Bảng giá trên điện thoại hiển thị **dạng danh sách**, không phải bảng:

```tsx
{/* Điện thoại — danh sách */}
<ul className="md:hidden divide-y divide-line rounded border border-line">
  {GIA.map((g) => (
    <li key={g.khung} className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-fg">{g.khung}</span>
      <span className="text-sm font-semibold text-fg">{g.gia}</span>
    </li>
  ))}
</ul>
{/* Máy tính — bảng */}
<table className="hidden md:table w-full ...">…</table>
```

- [ ] **Step 3: Thay lớp `.time-slot*` trong BookingWidget**

`src/components/sports/BookingWidget.tsx` dùng `.time-slot`, `.time-slot-available`, `.time-slot-selected`, `.time-slot-booked` — các lớp này đã bị gỡ khỏi `globals.css` ở Task 1. Thay bằng lớp Tailwind ngay tại chỗ:

```tsx
const SLOT_BASE =
  'min-h-[44px] px-1.5 py-2.5 sm:px-3 text-xs sm:text-sm font-medium rounded border ' +
  'cursor-pointer select-none flex flex-col items-center justify-center transition-colors duration-150';
const SLOT_AVAILABLE = 'border-line text-fg hover:border-brand hover:text-brand-strong';
const SLOT_SELECTED  = 'border-brand-strong bg-brand-strong text-white';
const SLOT_BOOKED    = 'border-line bg-bg-subtle text-fg-muted cursor-not-allowed line-through';
```

Giữ nguyên `min-h-[44px]` — bản cũ đã đúng chuẩn vùng bấm, đừng làm nhỏ đi.

- [ ] **Step 4: Kiểm tra không còn lớp cũ**

```bash
cd /d/songthach && grep -rn "sports-card\|sports-btn\|sports-hero-text\|time-slot\|gradient-sports\|sports-primary\|sports-accent\|sports-dark\|sports-light" "src/app/(public)/sports" src/components/sports
```

Kỳ vọng: không in ra gì.

- [ ] **Step 5: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 6: Đặt thử một sân**

Ở `localhost:3000/sports/badminton`, chọn ngày, chọn khung giờ, điền tên và số điện thoại, đặt thật. Phải ra mã `ST…` và màn hình thành công. Sau đó vào `/admin/bookings` xoá bản ghi thử. Đây là cách duy nhất chắc chắn lớp áo mới không làm hỏng luồng đặt sân — dự án không có test tự động.

- [ ] **Step 7: Commit**

```bash
git -C /d/songthach add "src/app/(public)/sports" src/components/sports
git -C /d/songthach commit -m "feat(sports): dựng lại khu thể thao theo hệ giao diện mới

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Tiệc cưới

**Files:**
- Modify: `src/app/(public)/wedding/page.tsx` (168 dòng), `src/components/wedding/InquiryForm.tsx`

**Interfaces:**
- Consumes: `PageHero`, `SectionHeader`, `Card`, `Button`, `Field`, `inputClass` từ `@/components/ui`
- Produces: không

**Giữ nguyên toàn bộ logic `onSubmit` của `InquiryForm.tsx`** — phần kiểm `res.ok` và `toast.error` là bản vá cho bug báo thành công giả, không được đụng vào.

- [ ] **Step 1: Trang wedding**

`<PageHero>` → thư viện ảnh dạng lưới → gói tiệc (`<Card>`) → form tư vấn.

Thay lớp: `.wedding-serif` → `font-display`; `.gold-divider` → xoá hẳn (dùng khoảng cách section thay cho đường kẻ trang trí); `.wedding-btn` → `<Button>`.

- [ ] **Step 2: InquiryForm**

Mỗi ô nhập bọc trong `<Field>`, `<input>` dùng `className={inputClass}`. Ô điện thoại thêm `inputMode="tel"`. Nút gửi dùng `<Button className="w-full">`. Thay `.wedding-input` và `.wedding-btn`.

Đặt `aria-describedby` trỏ tới id lỗi khi có lỗi:

```tsx
<Field label="Số điện thoại" htmlFor="phone" required error={errors.phone}>
  <input id="phone" name="phone" type="tel" inputMode="tel"
         aria-describedby={errors.phone ? 'phone-error' : undefined}
         className={inputClass} />
</Field>
```

- [ ] **Step 3: Kiểm tra không còn lớp cũ**

```bash
cd /d/songthach && grep -rn "wedding-serif\|wedding-btn\|wedding-input\|gold-divider\|wedding-primary\|wedding-accent\|wedding-dark\|wedding-cream\|wedding-rose\|font-playfair" "src/app/(public)/wedding" src/components/wedding
```

Kỳ vọng: không in ra gì.

- [ ] **Step 4: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 5: Gửi thử form tư vấn**

Gửi một lần với dữ liệu thật → phải hiện màn hình cảm ơn. Gửi thêm 3 lần liên tiếp → lần thứ 4 bị chặn bởi giới hạn 3 lần/5 phút/IP, form phải **ở lại màn nhập và hiện toast lỗi**, không được hiện cảm ơn. Sau đó xoá các bản ghi thử ở `/admin/wedding`.

- [ ] **Step 6: Commit**

```bash
git -C /d/songthach add "src/app/(public)/wedding" src/components/wedding
git -C /d/songthach commit -m "feat(wedding): dựng lại trang tiệc cưới và form tư vấn theo hệ mới

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Cafe

**Files:**
- Modify: `src/app/(public)/cafe/page.tsx` (218 dòng)

**Interfaces:**
- Consumes: `PageHero`, `SectionHeader`, `Card`, `Badge` từ `@/components/ui`
- Produces: không

- [ ] **Step 1: Dựng lại**

`<PageHero>` → menu đồ uống → không gian → giờ mở cửa. Giữ nguyên hai mã QR (`public/images/cafe/qr-san-bong.png`, `qr-san-cau.png`) và mọi nội dung chữ.

Thay `.cafe-tag` bằng `<Badge tone="brand">`.

- [ ] **Step 2: Kiểm tra không còn lớp cũ**

```bash
cd /d/songthach && grep -n "cafe-tag\|cafe-primary\|cafe-accent\|cafe-dark\|cafe-light\|#[0-9A-Fa-f]\{6\}" "src/app/(public)/cafe/page.tsx"
```

Kỳ vọng: không in ra gì.

- [ ] **Step 3: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 4: Xem thật ở 360px** — hai mã QR không bị vỡ, menu đồ uống đọc được, không cuộn ngang.

- [ ] **Step 5: Commit**

```bash
git -C /d/songthach add "src/app/(public)/cafe"
git -C /d/songthach commit -m "feat(cafe): dựng lại trang Lavie en Rose theo hệ giao diện mới

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Tin tức

**Files:**
- Modify: `src/app/(public)/tin-tuc/page.tsx` (70 dòng), `src/app/(public)/tin-tuc/[slug]/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Card`, `CardImage`, `CardBody`, `Breadcrumb` từ `@/components/ui`
- Produces: lớp `.prose-song` trong `globals.css` để dựng nội dung bài viết

- [ ] **Step 1: Trang danh sách**

`<PageHero>` (không ảnh) → lưới thẻ `grid gap-6 md:grid-cols-2 lg:grid-cols-3`, mỗi bài một `<Card>` với `<CardImage>` + `<CardBody>` (ngày, tiêu đề, trích dẫn). Một cột dưới 768px.

- [ ] **Step 2: Thêm lớp dựng nội dung bài viết**

Bài viết có thể lưu dạng HTML thô (`posts.content_format = 'html'`) và đổ ra bằng `dangerouslySetInnerHTML`, nên phải có CSS cho các thẻ HTML trần. Thêm vào `@layer components` trong `src/app/globals.css`:

```css
  .prose-song {
    font-size: 17px;
    line-height: 1.75;
    color: var(--fg);
  }
  .prose-song > * + * { margin-top: 1.25em; }
  .prose-song h2 { font-size: 28px; margin-top: 2em; }
  .prose-song h3 { font-size: 22px; margin-top: 1.75em; }
  .prose-song p  { font-family: var(--font-sans); text-transform: none; }
  .prose-song a  { color: var(--brand-strong); text-decoration: underline; }
  .prose-song ul { list-style: disc;    padding-left: 1.5em; }
  .prose-song ol { list-style: decimal; padding-left: 1.5em; }
  .prose-song li + li { margin-top: 0.4em; }
  .prose-song img { max-width: 100%; height: auto; border-radius: var(--radius); }
  .prose-song blockquote {
    border-left: 3px solid var(--brand);
    padding-left: 1em;
    color: var(--fg-muted);
  }
  .prose-song table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }
  .prose-song th, .prose-song td { border: 1px solid var(--line); padding: 0.5em 0.75em; }
```

Quy tắc `h1,h2,h3 { text-transform: uppercase }` ở `@layer base` sẽ áp cả vào tiêu đề trong bài viết. Nếu chủ site không muốn tiêu đề trong bài viết bị in hoa, thêm `.prose-song h2, .prose-song h3 { text-transform: none; }`. Hỏi trước khi quyết.

- [ ] **Step 3: Trang bài viết**

`<Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tin tức', href: '/tin-tuc' }, { label: post.title }]} />` → tiêu đề → ngày → nội dung bọc `<div className="prose-song max-w-[720px] mx-auto">`.

- [ ] **Step 4: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 5: Xem thật**

Mở một bài viết soạn bằng **HTML thô** và một bài soạn bằng **trình soạn thảo** — cả hai phải đọc tốt ở 360px, ảnh không tràn ra ngoài, bảng trong bài cuộn ngang chứ không đẩy trang.

- [ ] **Step 6: Commit**

```bash
git -C /d/songthach add "src/app/(public)/tin-tuc" src/app/globals.css
git -C /d/songthach commit -m "feat(tin-tuc): dựng lại danh sách và trang bài viết, thêm .prose-song

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Cụm Giải đấu Rating

**Files:**
- Modify: `src/app/(public)/giai-dau-rating/page.tsx`, `bang-xep-hang/page.tsx`, `the-le/page.tsx`, `vdv/[id]/page.tsx`
- Delete: `src/app/(public)/giai-dau-rating/rating.css`

**Interfaces:**
- Consumes: `PageHero`, `SectionHeader`, `Card`, `DataTable`, `Breadcrumb`, `Badge` từ `@/components/ui`
- Produces: không

- [ ] **Step 1: Xem rating.css đang cấp những gì**

```bash
cd /d/songthach && cat "src/app/(public)/giai-dau-rating/rating.css" | head -40
cd /d/songthach && grep -rn "rating.css\|rt-" "src/app/(public)/giai-dau-rating" | head -20
```

Ghi lại danh sách lớp đang dùng để thay hết, không sót.

- [ ] **Step 2: Trang giới thiệu và trang thể lệ**

`/giai-dau-rating`: `<PageHero>` → giới thiệu → ba `<Card>` link sang 3 trang con.

`/giai-dau-rating/the-le`: một cột chữ dài, bọc `<div className="prose-song max-w-[720px] mx-auto">` (lớp đã tạo ở Task 11).

- [ ] **Step 3: Bảng xếp hạng**

Dùng `<DataTable>`. Cột: `hang` (Hạng), `ten` (Vận động viên), `diem` (Điểm, `align: 'right'`), `bien_dong` (Biến động, `align: 'right'`).

```tsx
<DataTable
  columns={[
    { key: 'hang', header: 'Hạng' },
    { key: 'ten',  header: 'Vận động viên' },
    { key: 'diem', header: 'Điểm', align: 'right' },
    { key: 'bien_dong', header: 'Biến động', align: 'right' },
  ]}
  rows={rows}
  cardTitle={(row) => <>#{row.hang} · {row.ten}</>}
/>
```

Dưới 768px `DataTable` tự đổi sang thẻ xếp dọc — không cần viết thêm gì.

- [ ] **Step 4: Trang VĐV**

`<Breadcrumb>` → thông tin VĐV → biểu đồ điểm (giữ nguyên thư viện biểu đồ đang dùng, chỉ đổi màu đường sang `#007A33`) → lịch sử điểm bằng `<DataTable>`.

- [ ] **Step 5: Xoá rating.css**

```bash
cd /d/songthach && git rm "src/app/(public)/giai-dau-rating/rating.css"
cd /d/songthach && grep -rn "rating.css" src/
```

Kỳ vọng: grep không in ra gì.

- [ ] **Step 6: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 7: Xem thật ở 360px**

Bảng xếp hạng hiện dạng thẻ, **trang không bị đẩy ngang**. Ở 1280px hiện bảng, cột "Hạng" ghim lại khi cuộn ngang.

- [ ] **Step 8: Commit**

```bash
git -C /d/songthach add "src/app/(public)/giai-dau-rating"
git -C /d/songthach commit -m "feat(rating): dựng lại cụm giải đấu rating, bảng xếp hạng đổi sang thẻ trên điện thoại

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Các trang form

**Files:**
- Modify: `src/app/(public)/profile/page.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/complete-profile/page.tsx`

**Interfaces:**
- Consumes: `Field`, `inputClass`, `Button`, `PageHero` từ `@/components/ui`
- Produces: không

`login` và `complete-profile` đang dùng `.sports-btn`, `.gradient-sports`, `.sports-hero-text` — các lớp này hiện chỉ còn sống nhờ `admin-legacy.css`. Task này cắt đứt phụ thuộc đó.

- [ ] **Step 1: Ba trang form**

Mỗi trang: một cột, rộng tối đa 480px, căn giữa. Mọi ô nhập bọc `<Field>` với `className={inputClass}`. Nút chính `<Button className="w-full">`.

Không đổi logic gọi `supabase.auth.signInWithOtp` hay bất kỳ luồng xác thực nào.

- [ ] **Step 2: Kiểm tra không còn lớp cũ**

```bash
cd /d/songthach && grep -rn "sports-btn\|gradient-sports\|sports-hero-text\|font-bebas" "src/app/(auth)" "src/app/(public)/profile"
```

Kỳ vọng: không in ra gì.

- [ ] **Step 3: Kiểm tra biên dịch**

```bash
cd /d/songthach && npx tsc --noEmit
```

- [ ] **Step 4: Xem thật ở 360px** — form một cột, ô nhập cao ít nhất 48px, nhãn rõ ràng, thông báo lỗi màu đỏ hiện đúng chỗ.

- [ ] **Step 5: Commit**

```bash
git -C /d/songthach add "src/app/(auth)" "src/app/(public)/profile"
git -C /d/songthach commit -m "feat(auth): dựng lại các trang form theo hệ giao diện mới

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Dọn tàn dư và rà soát toàn bộ

**Files:**
- Modify: `src/app/admin-legacy.css` (gỡ phần chỉ còn công khai dùng), và bất kỳ file nào grep còn phát hiện

**Interfaces:**
- Consumes: không
- Produces: không

- [ ] **Step 1: Gỡ lớp công khai khỏi file đóng băng admin**

Đến đây khu công khai không còn dùng `.sports-btn` và `.gradient-sports` nữa. Kiểm lại ai còn dùng:

```bash
cd /d/songthach && grep -rn "sports-btn\|gradient-sports" src/ --include=*.tsx
```

Kỳ vọng: chỉ còn `src/app/admin/login/page.tsx` (`.sports-btn`) và `src/components/admin/PostForm.tsx` (`.gradient-sports`). Nếu đúng vậy thì **giữ nguyên** hai lớp đó trong `admin-legacy.css` — không sửa file admin. Nếu grep còn ra file công khai nào, quay lại task tương ứng.

- [ ] **Step 2: Rà hex cứng trong khu công khai**

```bash
cd /d/songthach && grep -rn "#[0-9A-Fa-f]\{6\}" "src/app/(public)" "src/app/(auth)" src/components/shared src/components/sports src/components/wedding src/components/ui
```

Kỳ vọng: chỉ còn các mã nằm trong `Badge.tsx` (nền nhạt `#E6F6EC`, `#B9E3C9`, `#FDECEA`, `#F5C3BE`) và màu hover nút `#00692C` — đó là các sắc phái sinh có chủ đích. Mọi mã khác phải chuyển sang biến.

- [ ] **Step 3: Rà token đã gỡ**

```bash
cd /d/songthach && grep -rn "sports-primary\|sports-accent\|sports-dark\|sports-light\|wedding-primary\|wedding-accent\|wedding-dark\|wedding-cream\|wedding-rose\|cafe-primary\|cafe-accent\|cafe-dark\|cafe-light\|font-bebas\|font-serif\|font-sport\|--gia-" src/ --include=*.tsx --include=*.ts --include=*.css | grep -v admin-legacy.css
```

Kỳ vọng: không in ra gì.

- [ ] **Step 4: Rà mobile toàn bộ ở 360px**

Mở lần lượt 13 trang ở bề rộng 360px. Với mỗi trang kiểm bốn điều:

1. Không có thanh cuộn ngang.
2. Nội dung cuối trang không bị thanh tab dưới che.
3. Không có chữ nào nhỏ hơn 14px (trừ nhãn 12px in hoa).
4. Mọi nút và link bấm được thoải mái bằng ngón tay.

Danh sách trang: `/` · `/sports` · `/sports/football` · `/sports/badminton` · `/wedding` · `/cafe` · `/tin-tuc` · một bài viết · `/giai-dau-rating` · `/giai-dau-rating/bang-xep-hang` · `/giai-dau-rating/the-le` · một trang VĐV · `/profile` · `/login`

- [ ] **Step 5: Thử bằng bàn phím và kiểm tương phản**

Trên trang chủ, nhấn Tab đi hết trang. Mọi nút, link, ô nhập đều phải thấy viền tiêu điểm xanh 2px. Menu điện thoại mở được bằng Enter và đóng được bằng Escape hoặc nút X.

Kiểm tương phản bằng DevTools (chọn phần tử → ô màu → hiện tỉ lệ):

- Chữ trắng trên nền nút `#007A33` — phải ≥ 4.5:1.
- Chữ `#007A33` trên nền trắng — phải ≥ 4.5:1.
- Chữ phụ `#5B6165` trên nền trắng — phải ≥ 4.5:1.

Nếu chỗ nào dùng `#00A94F` làm màu chữ, đó là lỗi — đổi sang `#007A33`.

- [ ] **Step 6: Dựng bản production**

**Tắt dev server trước.** Chạy `npm run build` khi dev đang chạy sẽ làm hỏng `.next` với lỗi `Cannot find module './XXXX.js'`.

```bash
cd /d/songthach && npx tsc --noEmit && npm run build
```

Kỳ vọng: cả hai sạch, bảng Route in ra đầy đủ.

- [ ] **Step 7: Commit**

```bash
git -C /d/songthach add -A
git -C /d/songthach commit -m "chore(ui): dọn tàn dư bảng màu cũ, rà soát mobile toàn khu công khai

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Gắn ảnh hero

Task này **phụ thuộc vào chủ site** cấp khoá Supabase mới hoặc gửi thẳng link ảnh. Làm cuối cùng, và nếu chưa có ảnh thì bỏ qua — mọi trang đã chạy được với hero nền đen.

**Files:**
- Modify: các trang có `<PageHero>`; có thể thêm `next.config.ts` (danh sách host ảnh)

**Interfaces:**
- Consumes: `PageHero` từ Task 3
- Produces: không

- [ ] **Step 1: Xin nguồn ảnh**

Khoá `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local` local đang bị từ chối:

```bash
cd /d/songthach && node -e "
const fs=require('fs');
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
fetch(env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/gallery_images?select=id&limit=1',{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY}}).then(r=>r.text()).then(t=>console.log(t));
"
```

Nếu vẫn ra `Unregistered API key`, hỏi chủ site lấy khoá mới ở Supabase Dashboard → Settings → API keys, hoặc nhờ gửi trực tiếp link ảnh từ `/admin/media`.

- [ ] **Step 2: Khai báo host ảnh**

Nếu ảnh nằm trên Supabase Storage, `next.config.ts` phải có host `tqhihuvpjegjmbbokcfb.supabase.co` trong `images.remotePatterns`. Kiểm trước:

```bash
cd /d/songthach && grep -n "remotePatterns" -A 10 next.config.ts
```

- [ ] **Step 3: Gắn ảnh**

Truyền `image` cho từng `<PageHero>`: trang chủ (toàn cảnh), `/sports` và hai trang môn (`public/images/sports/badminton-hero.jpg` đã có sẵn cho trang cầu lông), `/wedding` (sảnh tiệc), `/cafe` (không gian quán).

- [ ] **Step 4: Kiểm tra**

```bash
cd /d/songthach && npx tsc --noEmit
```

Xem thật: ảnh không bị méo, chữ trên hero vẫn đọc rõ nhờ lớp phủ, trang không giật khi ảnh tải xong.

- [ ] **Step 5: Commit**

```bash
git -C /d/songthach add -A
git -C /d/songthach commit -m "feat(ui): gắn ảnh hero cho các trang công khai

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Sau khi xong

Deploy theo runbook `/deploy-songthach` — chủ site tự SSH vào VPS, máy local không SSH được. Trước khi `git pull` trên VPS, nhớ kiểm nhánh đang đứng (`git branch --show-current`) và merge `feat/giao-dien-moi` vào `main` trước.
