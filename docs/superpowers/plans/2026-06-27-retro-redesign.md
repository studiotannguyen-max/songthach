# Retro Redesign — Bold 90s Athletic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign toàn bộ Song Thạch website sang phong cách Bold 90s Athletic retro — góc vuông, thick borders, offset shadow, Bebas Neue headlines, flat color blocks.

**Architecture:** Design tokens trong `globals.css` làm nền tảng cho tất cả các tầng. Shared components (Navbar, Footer, MobileTabBar) được retro hóa trước, sau đó public pages, cuối cùng admin pages nhận light retro touch.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3, React Server Components, TypeScript. Không có test framework — verification là `npm run build` + visual check.

## Global Constraints

- **Màu sắc giữ nguyên hex:** `#0F3C2C` (Pitch), `#9CE25C` (Lime), `#10150F` (Ink), `#F4EEE1` (Sand), `#FBFAF7` (Paper), `#C8746B` (Rose), `#c1922f` (Gold), `#FBD043` (Yellow)
- **border-radius: 0** trên tất cả elements trừ avatar người dùng (giữ rounded để nhận dạng)
- **Quan trọng:** Tailwind `rounded-lg/md/sm` dùng `var(--radius)` nên tự về 0 sau Task 1. `rounded-full`, `rounded-xl`, `rounded-2xl` v.v. KHÔNG dùng CSS var — phải tìm và xóa thủ công từng file.
- **Bebas Neue** cho h1, h2, h3, buttons, badges — ALL CAPS, `letter-spacing: 0.04–0.08em`
- **Oswald** giữ cho secondary labels, sport text
- **Playfair Display** chỉ còn trong wedding zone (h3 trở xuống)
- **Không thay đổi** logic booking, form, API, Supabase
- Sau mỗi task: `npm run build` phải pass (TypeScript clean)

---

## File Map

**Create:**
- `src/components/icons/FootballIcon.tsx`
- `src/components/icons/ShuttlecockIcon.tsx`
- `src/components/icons/RacketIcon.tsx`
- `src/components/icons/TrophyIcon.tsx`
- `src/components/icons/index.ts`

**Modify:**
- `src/app/globals.css` — tokens, font, CSS classes
- `tailwind.config.ts` — thêm font-bebas
- `src/components/shared/Navbar.tsx`
- `src/components/shared/Footer.tsx`
- `src/components/shared/MobileTabBar.tsx`
- `src/app/(public)/page.tsx` — homepage (inline nav + footer riêng)
- `src/app/(public)/sports/page.tsx`
- `src/app/(public)/sports/football/page.tsx`
- `src/app/(public)/sports/badminton/page.tsx`
- `src/app/(public)/wedding/page.tsx`
- `src/app/(public)/cafe/page.tsx`
- `src/app/(public)/giai-cau-long-2026/page.tsx`
- `src/app/admin/layout.tsx`

---

## Task 1: Design Foundation — Tokens, Typography, CSS Classes

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: `--font-bebas` CSS variable, `--radius: 0px`, classes `.sports-card`, `.sports-btn`, `.sports-btn-accent`, `.wedding-btn`, `.wedding-input`, `.time-slot`, `.admin-card`, `.status-badge`, `.cafe-tag`

- [ ] **Step 1: Thêm Bebas Neue vào Google Fonts import trong `globals.css`**

Thay dòng `@import url(...)` hiện tại bằng:
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@100..900&family=Geist+Mono:wght@300..700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Oswald:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500&display=swap');
```

- [ ] **Step 2: Thêm `--font-bebas` và đổi `--radius` trong `:root` block**

Trong `:root { ... }`, thêm sau `--font-plex-mono`:
```css
  --font-bebas: 'Bebas Neue', sans-serif;
```

Đổi dòng `--radius: 1.25rem;` thành:
```css
  --radius: 0px;
```

- [ ] **Step 3: Thêm `bebas` vào `tailwind.config.ts`**

Trong `theme.extend.fontFamily`, thêm:
```typescript
bebas: ['var(--font-bebas)', 'sans-serif'],
```

- [ ] **Step 4: Viết lại toàn bộ `@layer components` trong `globals.css`**

Thay thế phần `@layer components { ... }` hiện tại bằng:
```css
@layer components {
  /* ── Sports zone ─────────────────────────── */
  .sports-hero-text {
    font-family: var(--font-bebas);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .sports-card {
    background: var(--card);
    border: 3px solid #0F3C2C;
    border-radius: 0;
    box-shadow: 5px 5px 0 #9CE25C;
    transition: transform 150ms ease, box-shadow 150ms ease;
  }
  .sports-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 #9CE25C;
  }

  .sports-btn {
    @apply bg-sports-primary text-white font-semibold px-6 py-3;
    font-family: var(--font-bebas);
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: 0;
    border: 2px solid #0A2C20;
    box-shadow: 3px 3px 0 #3F8F33;
    transition: transform 150ms ease, box-shadow 150ms ease;
  }
  .sports-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #3F8F33;
  }
  .sports-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #3F8F33;
  }

  .sports-btn-accent {
    @apply bg-sports-accent text-sports-dark font-semibold px-6 py-3;
    font-family: var(--font-bebas);
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: 0;
    border: 2px solid #0F3C2C;
    box-shadow: 3px 3px 0 #0F3C2C;
    transition: transform 150ms ease, box-shadow 150ms ease;
  }
  .sports-btn-accent:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #0F3C2C;
  }
  .sports-btn-accent:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #0F3C2C;
  }

  .time-slot {
    @apply border-2 px-1.5 py-2.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium cursor-pointer
           transition-all duration-150 select-none min-h-[44px] flex flex-col items-center justify-center;
    border-radius: 0;
  }
  .time-slot-available {
    @apply border-sports-primary/30 text-sports-primary hover:border-sports-primary hover:bg-sports-light;
  }
  .time-slot-selected {
    @apply border-sports-primary bg-sports-primary text-white;
  }
  .time-slot-booked {
    @apply border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed line-through decoration-gray-400;
  }

  /* ── Wedding zone ────────────────────────── */
  .wedding-serif { font-family: var(--font-bebas); }

  .wedding-btn {
    @apply bg-wedding-accent text-white font-semibold px-8 py-4 uppercase;
    font-family: var(--font-bebas);
    font-size: 1rem;
    letter-spacing: 0.08em;
    border-radius: 0;
    border: 2px solid #A85E56;
    box-shadow: 3px 3px 0 #8B3D37;
    transition: transform 150ms ease, box-shadow 150ms ease;
  }
  .wedding-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #8B3D37;
  }
  .wedding-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #8B3D37;
  }

  .wedding-input {
    @apply w-full bg-transparent py-3 px-3
           text-wedding-dark placeholder-wedding-primary/40 focus:outline-none
           transition-colors duration-200;
    font-family: var(--font-playfair);
    border: 2px solid rgba(200, 116, 107, 0.5);
    border-radius: 0;
  }
  .wedding-input:focus {
    border-color: #C8746B;
  }

  .gold-divider {
    @apply flex items-center gap-4 my-8;
  }
  .gold-divider::before,
  .gold-divider::after {
    content: '';
    @apply flex-1 border-t-2 border-wedding-accent/60;
  }

  /* ── Cafe zone ───────────────────────────── */
  .cafe-tag {
    @apply inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase
           bg-cafe-primary/10 text-cafe-primary;
    font-family: var(--font-bebas);
    border-radius: 0;
    border: 1.5px solid rgba(200, 116, 107, 0.4);
  }

  /* ── Admin ───────────────────────────────── */
  .admin-card {
    @apply bg-white p-6;
    border: 2px solid #e5e7eb;
    border-radius: 0;
    box-shadow: 3px 3px 0 #e5e7eb;
  }

  .status-badge {
    @apply inline-flex items-center px-2.5 py-0.5 text-xs font-medium;
    border-radius: 0;
    font-family: var(--font-bebas);
    letter-spacing: 0.05em;
  }
  .status-pending      { @apply bg-yellow-100 text-yellow-800; }
  .status-deposit_paid { @apply bg-blue-100 text-blue-800; }
  .status-completed    { @apply bg-green-100 text-green-800; }
  .status-cancelled    { @apply bg-red-100 text-red-800; }
  .status-new          { @apply bg-purple-100 text-purple-800; }
  .status-contacted    { @apply bg-blue-100 text-blue-800; }
  .status-quoted       { @apply bg-orange-100 text-orange-800; }
  .status-booked       { @apply bg-green-100 text-green-800; }
}
```

- [ ] **Step 5: Chạy build kiểm tra**

```bash
cd D:\songthach && npm run build
```
Expected: build thành công, không có TypeScript error.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css tailwind.config.ts
git commit -m "style: retro design foundation — Bebas Neue, radius 0, retro component classes"
```

---

## Task 2: Retro Icon Components

**Files:**
- Create: `src/components/icons/FootballIcon.tsx`
- Create: `src/components/icons/ShuttlecockIcon.tsx`
- Create: `src/components/icons/RacketIcon.tsx`
- Create: `src/components/icons/TrophyIcon.tsx`
- Create: `src/components/icons/index.ts`

**Interfaces:**
- Produces: `FootballIcon`, `ShuttlecockIcon`, `RacketIcon`, `TrophyIcon` — all accept `{ size?: number; color?: string }` props, default `size=24`, `color='currentColor'`

- [ ] **Step 1: Tạo `src/components/icons/FootballIcon.tsx`**

```tsx
type IconProps = { size?: number; color?: string };

export function FootballIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5"/>
      <path
        d="M12 4.5L15 9H9L12 4.5Z"
        fill={color}
      />
      <path
        d="M9 9L5.5 11.5L7 16H12H17L18.5 11.5L15 9"
        stroke={color} strokeWidth="2" strokeLinejoin="miter" fill="none"
      />
      <path d="M7 16L9 19.5M17 16L15 19.5M12 16V19.5" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
```

- [ ] **Step 2: Tạo `src/components/icons/ShuttlecockIcon.tsx`**

```tsx
type IconProps = { size?: number; color?: string };

export function ShuttlecockIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="19" r="2.5" stroke={color} strokeWidth="2.5"/>
      <line x1="12" y1="16.5" x2="12" y2="10" stroke={color} strokeWidth="2.5"/>
      <path d="M7.5 10.5L12 3L16.5 10.5" stroke={color} strokeWidth="2.5" strokeLinejoin="miter" fill="none"/>
      <line x1="8" y1="8.5" x2="16" y2="8.5" stroke={color} strokeWidth="2"/>
      <line x1="7.5" y1="10.5" x2="16.5" y2="10.5" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
```

- [ ] **Step 3: Tạo `src/components/icons/RacketIcon.tsx`**

```tsx
type IconProps = { size?: number; color?: string };

export function RacketIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse
        cx="9" cy="8.5" rx="5.5" ry="7"
        transform="rotate(-40 9 8.5)"
        stroke={color} strokeWidth="2.5"
      />
      <line x1="8" y1="14" x2="6" y2="16" stroke={color} strokeWidth="2"/>
      <line x1="11" y1="11" x2="9" y2="13" stroke={color} strokeWidth="2"/>
      <line x1="13" y1="14" x2="20" y2="21" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
}
```

- [ ] **Step 4: Tạo `src/components/icons/TrophyIcon.tsx`**

```tsx
type IconProps = { size?: number; color?: string };

export function TrophyIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 3H19V11C19 14.3137 15.866 17 12 17C8.13401 17 5 14.3137 5 11V3Z"
        stroke={color} strokeWidth="2.5" strokeLinejoin="miter"/>
      <path d="M5 6H2V10C2 11.6569 3.34315 13 5 13" stroke={color} strokeWidth="2.5"/>
      <path d="M19 6H22V10C22 11.6569 20.6569 13 19 13" stroke={color} strokeWidth="2.5"/>
      <line x1="12" y1="17" x2="12" y2="20" stroke={color} strokeWidth="2.5"/>
      <line x1="7" y1="20" x2="17" y2="20" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
}
```

- [ ] **Step 5: Tạo `src/components/icons/index.ts`**

```typescript
export { FootballIcon } from './FootballIcon';
export { ShuttlecockIcon } from './ShuttlecockIcon';
export { RacketIcon } from './RacketIcon';
export { TrophyIcon } from './TrophyIcon';
```

- [ ] **Step 6: Build check**

```bash
npm run build
```
Expected: pass, no TS errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/icons/
git commit -m "feat: add retro sports icon components (football, shuttlecock, racket, trophy)"
```

---

## Task 3: Shared Navbar

**Files:**
- Modify: `src/components/shared/Navbar.tsx`

**Interfaces:**
- Consumes: CSS classes từ Task 1 (`.sports-btn`), font `var(--font-bebas)`
- No interface changes — same props as current component

- [ ] **Step 1: Đổi `navBg` — bỏ `backdrop-blur-md`, thêm thick border**

Tìm:
```typescript
const navBg = solid
  ? 'bg-background backdrop-blur-md border-b border-border shadow-sm'
  : 'bg-transparent';
```
Thay bằng:
```typescript
const navBg = solid
  ? 'bg-background border-b-[3px] border-[#0F3C2C]'
  : 'bg-transparent';
```

- [ ] **Step 2: Đổi logo — Bebas Neue, bỏ viền tròn**

Tìm `<span` trong Logo `<Link>` với class có `font-semibold` và `font-playfair`, thay bằng:
```tsx
<span className={cn('tracking-[0.2em] uppercase transition-colors select-none', textColor)}
  style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem' }}>
  SONG THẠCH
</span>
```

- [ ] **Step 3: Đổi nav links — uppercase, Oswald**

Tìm class của nav links (cả 2 nhóm `ZONE_LINKS.slice(0,3)` và `ZONE_LINKS.slice(3,5)`):
```tsx
'flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap',
```
Thêm `uppercase` vào className, và thay font bằng inline style Oswald:
```tsx
className={cn(
  'flex items-center gap-1 text-xs font-semibold tracking-wider transition-colors whitespace-nowrap uppercase',
  active ? zoneActive : zoneIdle,
)}
style={{ fontFamily: 'var(--font-oswald)' }}
```

- [ ] **Step 4: Đổi CTA buttons — bỏ `rounded-full`, dùng `.sports-btn` style**

Tìm tất cả `<button onClick={openSportPicker}` và `<Link href="/login?mode=register"` CTA, thay từng cái:

```tsx
{/* Chưa đăng nhập — CTA "Đặt sân ngay" */}
<button
  onClick={openSportPicker}
  className="flex items-center gap-1.5 bg-[#0F3C2C] text-white px-5 py-2.5 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-150"
  style={{
    fontFamily: 'var(--font-bebas)',
    fontSize: '0.95rem',
    letterSpacing: '0.08em',
    borderRadius: 0,
    border: '2px solid #0A2C20',
    boxShadow: '3px 3px 0 #3F8F33',
  }}
>
  ĐẶT SÂN NGAY
</button>
```

```tsx
{/* Đã đăng nhập — CTA "Đặt sân" */}
<button
  onClick={openSportPicker}
  className="flex items-center gap-1.5 bg-[#0F3C2C] text-white px-5 py-2.5 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-150"
  style={{
    fontFamily: 'var(--font-bebas)',
    fontSize: '0.95rem',
    letterSpacing: '0.08em',
    borderRadius: 0,
    border: '2px solid #0A2C20',
    boxShadow: '3px 3px 0 #3F8F33',
  }}
>
  ĐẶT SÂN
</button>
```

- [ ] **Step 5: Đổi user dropdown — vuông góc**

Tìm dropdown `<div className="absolute right-0 ...">`:
```tsx
<div className="absolute right-0 top-full mt-2 w-52 bg-card border-2 border-[#0F3C2C] overflow-hidden py-1" role="menu">
```
(thay `border border-border` → `border-2 border-[#0F3C2C]`, đảm bảo không có `rounded`)

- [ ] **Step 6: Mobile menu — bỏ `rounded-xl`**

Tìm các `rounded-xl` trong mobile menu, xóa hết. Tìm `rounded-xl` trên mobile Link buttons và thay bằng không có radius.

- [ ] **Step 7: Build + visual check**

```bash
npm run build
```
Chạy dev: `npm run dev`, mở `http://localhost:3000` — navbar phải solid border dưới, logo Bebas Neue, CTA vuông với offset shadow.

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/Navbar.tsx
git commit -m "style: retro navbar — solid border, square CTA, Bebas Neue logo"
```

---

## Task 4: Shared Footer

**Files:**
- Modify: `src/components/shared/Footer.tsx`

- [ ] **Step 1: Thêm `borderTop: '4px solid #9CE25C'` vào desktop footer block**

Tìm:
```tsx
<div className="hidden sm:block" style={{ background: GREEN, color: 'rgba(255,255,255,.75)' }}>
```
Thay bằng:
```tsx
<div className="hidden sm:block" style={{ background: GREEN, color: 'rgba(255,255,255,.75)', borderTop: '4px solid #9CE25C' }}>
```

- [ ] **Step 2: Section titles dùng Bebas Neue**

Tìm tất cả `<h4 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em] text-white">`, thay bằng:
```tsx
<h4 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.15em', color: '#9CE25C', marginBottom: '1rem' }}>
```
(3 instances: "Khu Thể thao", "Nhà hàng Tiệc cưới", "Liên hệ")

- [ ] **Step 3: Social icons — square frame, bỏ `rounded-full`**

Tìm social `<a>` tags (Facebook, Instagram), thay từng cái:
```tsx
<a href="#" aria-label="Song Thạch trên Facebook"
   className="w-9 h-9 flex items-center justify-center transition-colors"
   style={{ color: YELLOW, border: `2px solid ${YELLOW}`, background: 'transparent' }}>
  <Facebook size={16} />
</a>
<a href="#" aria-label="Song Thạch trên Instagram"
   className="w-9 h-9 flex items-center justify-center transition-colors"
   style={{ color: YELLOW, border: `2px solid ${YELLOW}`, background: 'transparent' }}>
  <Instagram size={16} />
</a>
```

- [ ] **Step 4: Logo trong footer — Bebas Neue**

Tìm `<span className="text-3xl tracking-[0.2em] uppercase font-semibold text-white"`, thay bằng:
```tsx
<span className="text-white" style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.2em' }}>
  SONG THẠCH
</span>
```

- [ ] **Step 5: Copyright bar — đổi sang Lime**

Tìm:
```tsx
<div className="hidden sm:block" style={{ background: YELLOW, color: GREEN }}>
```
Thay bằng (LIME = `#9CE25C`):
```tsx
<div className="hidden sm:block" style={{ background: '#9CE25C', color: GREEN }}>
```

- [ ] **Step 6: Mobile footer — thêm top border**

Tìm:
```tsx
<div className="sm:hidden px-4 py-6 space-y-2.5" style={{ background: GREEN, color: '#fff' }}>
```
Thêm `borderTop: '4px solid #9CE25C'`:
```tsx
<div className="sm:hidden px-4 py-6 space-y-2.5" style={{ background: GREEN, color: '#fff', borderTop: '4px solid #9CE25C' }}>
```

- [ ] **Step 7: Build + commit**

```bash
npm run build
git add src/components/shared/Footer.tsx
git commit -m "style: retro footer — lime top border, Bebas Neue titles, square social icons"
```

---

## Task 5: MobileTabBar

**Files:**
- Modify: `src/components/shared/MobileTabBar.tsx`

- [ ] **Step 1: Đổi `<nav>` container — solid border, bỏ blur**

Tìm:
```tsx
className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]"
```
Thay bằng:
```tsx
className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t-[3px] border-[#0F3C2C] pb-[env(safe-area-inset-bottom)]"
```

- [ ] **Step 2: Đổi active tab style — square highlight**

Tìm trong `TabItem`:
```tsx
active ? 'text-primary' : 'text-muted-foreground',
```
Thay bằng:
```tsx
active ? 'text-[#9CE25C] bg-[#0F3C2C]' : 'text-muted-foreground',
```

- [ ] **Step 3: Đổi "Đặt sân" center button — vuông, offset shadow**

Tìm:
```tsx
className="absolute -top-5 grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
```
Thay bằng:
```tsx
className="absolute -top-5 grid place-items-center w-14 h-14 bg-[#0F3C2C] text-white transition-all active:translate-x-[2px] active:translate-y-[2px]"
style={{ border: '2px solid #0A2C20', boxShadow: '3px 3px 0 #3F8F33' }}
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/components/shared/MobileTabBar.tsx
git commit -m "style: retro mobile tab bar — solid border, square active state"
```

---

## Task 6: Homepage

**Files:**
- Modify: `src/app/(public)/page.tsx`

> **Lưu ý:** Homepage có **inline `<nav>` và `<footer>` riêng**, không dùng shared Navbar/Footer. Phải update cả 2 trong file này.

- [ ] **Step 1: Đổi inline `<nav>` — solid border, bỏ backdrop blur**

Tìm:
```tsx
<nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(251,250,247,.88)', backdropFilter: 'blur(10px)', borderColor: LINE }}>
```
Thay bằng:
```tsx
<nav className="sticky top-0 z-50" style={{ background: PAPER, borderBottom: `3px solid ${PITCH}` }}>
```

- [ ] **Step 2: Logo trong inline nav — Bebas Neue, bỏ dot**

Tìm `<Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg"` với `<span className="w-2.5 h-2.5 rounded-full shrink-0"` bên trong. Thay toàn bộ Link đó bằng:
```tsx
<Link href="/" className="flex items-center" style={{ fontFamily: 'var(--font-bebas)', color: INK, fontSize: '1.4rem', letterSpacing: '0.2em' }}>
  SONG THẠCH
</Link>
```

- [ ] **Step 3: CTA trong inline nav — bỏ `rounded-full`**

Tìm `<SportPickerTrigger className="rounded-full text-sm font-semibold px-5 py-2.5"`:
```tsx
<SportPickerTrigger
  className="text-sm px-5 py-2.5 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
  style={{
    background: LIME, color: INK, borderRadius: 0,
    fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', letterSpacing: '0.08em',
    border: `2px solid ${PITCH}`, boxShadow: `3px 3px 0 ${PITCH}`,
  }}
>
  ĐẶT SÂN
</SportPickerTrigger>
```

- [ ] **Step 4: Thay `CourtLines` component bằng `DiagonalStripe`**

Xóa hàm `CourtLines()` hiện tại, thêm:
```tsx
function DiagonalStripe() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(156,226,92,0.08) 4px, rgba(156,226,92,0.08) 8px)',
    }} />
  );
}
```
Thay `<CourtLines />` trong Hero section bằng `<DiagonalStripe />`.

- [ ] **Step 5: Hero H1 — Bebas Neue, larger**

Tìm `<h1 className="font-extrabold leading-[1.02] tracking-tight"` với `fontFamily: 'var(--font-bricolage)'`, thay bằng:
```tsx
<h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(52px,7.5vw,88px)', letterSpacing: '0.04em', lineHeight: 0.93 }}>
  SONG THẠCH — COME PLAY, <span style={{ color: LIME }}>STAY, RELAX</span>
</h1>
```

- [ ] **Step 6: Hero CTA buttons — vuông, offset shadow**

Tìm `<SportPickerTrigger className="inline-flex items-center gap-2 rounded-full`:
```tsx
<SportPickerTrigger
  className="inline-flex items-center gap-2 text-sm px-6 py-3 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
  style={{
    background: LIME, color: INK, borderRadius: 0,
    border: `2px solid ${PITCH}`, boxShadow: `4px 4px 0 ${PITCH}`,
    fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em',
  }}
>
  ĐẶT SÂN NGAY <ArrowRight size={16} />
</SportPickerTrigger>
<a href="#dichvu"
  className="inline-flex items-center gap-2 text-sm px-6 py-3 border-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
  style={{ borderColor: 'rgba(255,255,255,.6)', color: PAPER, borderRadius: 0, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}
>
  KHÁM PHÁ TỔ HỢP
</a>
```

- [ ] **Step 7: Hero news card — vuông, Bebas Neue tag**

Tìm `<div id="tintuc" className="rounded-[20px] p-6 border"`:
```tsx
<div id="tintuc" className="p-6 border-2" style={{ background: `linear-gradient(160deg,#15543d,#0c3022)`, borderColor: 'rgba(156,226,92,.4)' }}>
```

Tìm `<span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"`:
```tsx
<span className="inline-block text-xs font-semibold px-2.5 py-1" style={{ background: LIME, color: INK, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}>
  TIN TỨC &amp; SỰ KIỆN
</span>
```

Tìm `<Link href="/tin-tuc" className="mt-4 flex items-center gap-1.5 text-sm font-semibold"` (nút "Xem tất cả"):
thêm `style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}`.

- [ ] **Step 8: Import retro icon components, cập nhật SERVICES array**

Thêm import ở đầu file:
```tsx
import { FootballIcon, ShuttlecockIcon, RacketIcon, TrophyIcon } from '@/components/icons';
```

Cập nhật `SERVICES` array — thay `icon` và xóa `image` prop (dùng icon SVG thay PNG):
```tsx
const SERVICES = [
  { href: '/sports/badminton',         id: undefined,  icon: ShuttlecockIcon, label: 'Sân Cầu Lông',      desc: 'Đặt sân theo giờ, lịch trống cập nhật trực tiếp.', badge: 'Đặt theo giờ', go: 'Đặt sân',    accent: 'green' as const },
  { href: '/sports/football',          id: undefined,  icon: FootballIcon,    label: 'Sân Bóng Đá',       desc: 'Sân cỏ chuẩn, đặt nhanh cho cả đội của bạn.',      badge: 'Đặt theo giờ', go: 'Đặt sân',    accent: 'green' as const },
  { href: '/sports/football#classes',  id: 'daotao',   icon: TrophyIcon,      label: 'Đào tạo Bóng đá',   desc: 'Lớp 7–14 tuổi, huấn luyện viên theo sát.',         badge: 'Ghi danh',     go: 'Xem lớp',   accent: 'green' as const },
  { href: '/sports/badminton#classes', id: undefined,  icon: RacketIcon,      label: 'Đào tạo Cầu lông',  desc: 'Rèn kỹ thuật bài bản theo từng cấp độ.',            badge: 'Ghi danh',     go: 'Xem lớp',   accent: 'green' as const },
  { href: '/wedding',                  id: undefined,  icon: RingsIcon,       label: 'Tiệc Cưới',         desc: 'Sảnh tiệc sức chứa 700 khách cho ngày trọng đại.',  badge: 'Tư vấn',       go: 'Đặt tư vấn', accent: 'rose' as const },
  { href: '/cafe',                     id: 'cafe',     icon: CupIcon,         label: 'Café Lavie en Rose', desc: 'Góc sân vườn kiểu Pháp để nghỉ chân.',             badge: 'Mở 07:00–22:00', go: 'Xem menu', accent: 'rose' as const },
];
```
Xóa `image` prop từ type/interface và xóa `Image` usage trong service card render (dùng `<Icon size={22} />` cho tất cả).

Cập nhật service card render — bỏ `rounded-[14px]`, thêm retro border + shadow:
```tsx
<Link
  key={s.label}
  href={s.href}
  id={s.id}
  className="relative block border-[3px] p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
  style={{
    background: '#fff',
    borderColor: rose ? '#C8746B' : '#0F3C2C',
    boxShadow: rose ? '5px 5px 0 rgba(200,116,107,0.3)' : '5px 5px 0 #9CE25C',
  }}
>
  <span
    className="absolute top-4 right-4 text-[10.5px] font-semibold px-2.5 py-1"
    style={{ background: rose ? ROSE_SOFT : SAND, color: rose ? ROSE : PITCH, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}
  >
    {s.badge}
  </span>
  <div
    className="w-[50px] h-[50px] flex items-center justify-center mt-7 mb-4 border-2"
    style={{ background: rose ? ROSE_SOFT : SAND, color: rose ? ROSE : PITCH, borderColor: rose ? ROSE : PITCH }}
  >
    <Icon size={22} />
  </div>
  <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.25rem', letterSpacing: '0.04em', color: INK, marginBottom: '0.375rem' }}>{s.label}</h3>
  <p className="text-sm" style={{ color: MUTED }}>{s.desc}</p>
  <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold" style={{ color: rose ? ROSE : LIME_DEEP, fontFamily: 'var(--font-bebas)', letterSpacing: '0.06em' }}>
    {s.go} <ArrowRight size={14} />
  </span>
</Link>
```

- [ ] **Step 9: Cafe spotlight — square image frame**

Tìm `<div className="relative h-72 lg:h-[380px] rounded-[18px] overflow-hidden`:
```tsx
<div className="relative h-72 lg:h-[380px] overflow-hidden flex items-center justify-center" style={{ background: '#fff', border: `3px solid ${LINE}` }}>
```

- [ ] **Step 10: Services section heading — Bebas Neue**

Tìm `<h2 className="font-bold tracking-tight max-w-[18ch]"` với `fontFamily: 'var(--font-bricolage)'`:
```tsx
<h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(30px,4.5vw,46px)', letterSpacing: '0.04em', color: INK }}>
  DỊCH VỤ TẠI SONG THẠCH
</h2>
```

- [ ] **Step 11: Inline footer — Bebas Neue section titles, lime top border, square social icons**

Tìm `<footer className="py-12 md:py-16" style={{ background: INK, color: '#cfd4cb' }}>`:
```tsx
<footer className="py-12 md:py-16" style={{ background: INK, color: '#cfd4cb', borderTop: '4px solid #9CE25C' }}>
```

Tìm `<h5 className="text-[11px] tracking-[0.1em] uppercase mb-4"` (3 cột: Thể thao, Dịch vụ, Liên hệ):
```tsx
<h5 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.15em', color: '#9CE25C', marginBottom: '1rem' }}>
```

Inline footer logo:
```tsx
<div className="flex items-center gap-2.5 font-extrabold text-lg mb-3.5" style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: PAPER, letterSpacing: '0.2em' }}>
  SONG THẠCH
</div>
```
(Xóa `<span className="w-2.5 h-2.5 rounded-full"` dot bên trong)

- [ ] **Step 12: Build + commit**

```bash
npm run build
git add src/app/(public)/page.tsx
git commit -m "style: retro homepage — Bebas Neue hero, diagonal stripe, square service cards, retro icons"
```

---

## Task 7: Football Page

**Files:**
- Modify: `src/app/(public)/sports/football/page.tsx`

- [ ] **Step 1: Hero badges — bỏ `rounded-full`**

Tìm `<span className="sports-hero-text text-sm font-medium bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full">` (2 badges "3 sân 5 người", "1 sân 7 người"):
```tsx
<span className="sports-hero-text text-sm font-medium bg-white/20 text-white px-3 py-1">
  3 sân 5 người
</span>
<span className="sports-hero-text text-sm font-medium bg-sports-primary text-white px-3 py-1">
  1 sân 7 người
</span>
```

- [ ] **Step 2: Court info cards — thêm retro number badge**

Tìm `<div key={c.id} className="sports-card p-4">` — `sports-card` đã có retro style từ Task 1, chỉ cần đảm bảo không có class `rounded` nào override. Kiểm tra `p` có class `sports-hero-text` rồi thay `text-3xl font-bold` bằng `text-4xl`:
```tsx
<p className="sports-hero-text text-4xl font-bold text-sports-primary">{c.name}</p>
```

- [ ] **Step 3: Feature list — square icon boxes**

Tìm FEATURES render, tìm icon container (nếu có `rounded`), đổi sang vuông. Đảm bảo `.sports-card` được dùng cho feature cards.

- [ ] **Step 4: Page H1 — Bebas Neue (đã dùng `.sports-hero-text` từ Task 1)**

`sports-hero-text` đã được update sang Bebas Neue trong Task 1, không cần sửa thêm. Kiểm tra `<h1 className="sports-hero-text text-5xl md:text-6xl font-bold text-white">` — OK.

- [ ] **Step 5: Classes section heading nếu có**

Tìm section đào tạo, đảm bảo headings dùng `.sports-hero-text` hoặc Bebas Neue style.

- [ ] **Step 6: Build + commit**

```bash
npm run build
git add src/app/(public)/sports/football/page.tsx
git commit -m "style: retro football page — square badges, retro cards"
```

---

## Task 8: Badminton Page

**Files:**
- Modify: `src/app/(public)/sports/badminton/page.tsx`

Áp dụng cùng pattern như Task 7:

- [ ] **Step 1: Hero badges — bỏ `rounded-full`, `rounded`**

Tìm mọi badge/pill có `rounded-full` hoặc `rounded-*` trong hero section, xóa hết.

- [ ] **Step 2: Level badges trong PRICE_LEVELS**

Tìm trong file mọi `rounded-full`, `rounded-xl`, `rounded-2xl`, `rounded-lg` (chữ `rounded-lg/md/sm` đã về 0 từ Task 1, chỉ cần xóa các class cụ thể hơn). Với level badge span:
```tsx
<span className={`inline-block px-2 py-0.5 text-xs font-semibold ${p.levelColor}`}>
  {p.level}
</span>
```
(Đảm bảo không có `rounded-*` trong className — xóa nếu có)

- [ ] **Step 3: Price table — đảm bảo không có border-radius**

Tìm bảng giá (nếu là `<table>` hoặc grid), đảm bảo `<th>`, `<td>` không có radius. Thêm `border-b-2 border-[#0F3C2C]` vào `<th>` nếu có.

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/app/(public)/sports/badminton/page.tsx
git commit -m "style: retro badminton page — square elements, retro badges"
```

---

## Task 9: Sports Landing Page

**Files:**
- Modify: `src/app/(public)/sports/page.tsx`

- [ ] **Step 1: Hero sub-text — sports-hero-text đã là Bebas Neue**

Kiểm tra `<p className="sports-hero-text text-sports-accent text-sm tracking-widest mb-2">` — OK từ Task 1.
`<h1 className="sports-hero-text text-5xl md:text-7xl font-bold text-white">` — OK.

- [ ] **Step 2: Sport cards — `sports-card` đã retro, thêm square overflow**

Tìm `<Link key={item.href} href={item.href} className="group sports-card overflow-hidden block">`:
Xóa `overflow-hidden` khỏi Link, thêm vào `<div className="relative h-64">`:
```tsx
<Link key={item.href} href={item.href} className="group sports-card block">
  <div className="relative h-64 overflow-hidden">
```

- [ ] **Step 3: Section bg — bỏ `bg-gray-50`, dùng Sand**

```tsx
<section className="py-20" style={{ background: '#F4EEE1' }}>
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/app/(public)/sports/page.tsx
git commit -m "style: retro sports landing — retro cards, sand bg"
```

---

## Task 10: Wedding Page

**Files:**
- Modify: `src/app/(public)/wedding/page.tsx`

- [ ] **Step 1: H1 hero — Bebas Neue**

Tìm `<h1` hoặc heading lớn nhất trong hero section. Nếu dùng Playfair Display, thay bằng:
```tsx
<h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(52px, 7vw, 88px)', letterSpacing: '0.06em', lineHeight: 0.92 }}>
  TIỆC CƯỚI<br/>SONG THẠCH
</h1>
```

- [ ] **Step 2: H2 section titles — Bebas Neue**

Tìm mọi `<h2` trong wedding page, thêm `style={{ fontFamily: 'var(--font-bebas)', ... }}`.

- [ ] **Step 3: H3, sub-headings — giữ Playfair Display**

Tìm mọi `<h3` — thêm `style={{ fontFamily: 'var(--font-playfair)' }}` để khẳng định.

- [ ] **Step 4: Gallery images — square frames**

Tìm mọi `rounded-*` trên image containers trong gallery, xóa hết. Thêm `border: '3px solid #C8746B'` nếu không có border.

- [ ] **Step 5: Stats badges (700 khách, 15+ năm)**

Tìm STATS render, thêm `borderRadius: 0` và square icon box.

- [ ] **Step 6: Inquiry form wrapper — square**

Nếu form có `rounded-*` className, xóa. `.wedding-input` đã là vuông từ Task 1.

- [ ] **Step 7: CTA buttons — `.wedding-btn` đã retro từ Task 1**

Kiểm tra CTA buttons dùng `.wedding-btn` — OK. Nếu có inline `rounded-none` override cần thiết thì thêm.

- [ ] **Step 8: Build + commit**

```bash
npm run build
git add src/app/(public)/wedding/page.tsx
git commit -m "style: retro wedding page — Bebas Neue titles, square gallery, square form"
```

---

## Task 11: Cafe Page

**Files:**
- Modify: `src/app/(public)/cafe/page.tsx`

- [ ] **Step 1: Hero/heading — Bebas Neue**

Tìm heading lớn nhất, thay sang Bebas Neue (xem pattern Task 10 Step 1).

- [ ] **Step 2: Menu category headers — Bebas Neue**

Tìm `category` render trong menu, thay heading bằng:
```tsx
<h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.1em', color: '#C8746B' }}>
  {cat.category.toUpperCase()}
</h3>
```

- [ ] **Step 3: `.cafe-tag` — đã retro từ Task 1**

Nếu có inline styled tags, thay bằng class `.cafe-tag`.

- [ ] **Step 4: Menu item containers — square borders**

Nếu có `rounded-*` trên menu cards/sections, xóa.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/app/(public)/cafe/page.tsx
git commit -m "style: retro cafe page — Bebas Neue headings, square menu cards"
```

---

## Task 12: Giải Cầu Lông 2026 Page

**Files:**
- Modify: `src/app/(public)/giai-cau-long-2026/page.tsx`
- Check: `src/app/(public)/giai-cau-long-2026/giai.css` (nếu có `border-radius`, `rounded`)

- [ ] **Step 1: Đọc `giai.css` và xóa border-radius**

Tìm trong `giai.css` mọi `border-radius:` rule, đổi về `0` hoặc xóa.

- [ ] **Step 2: Page headings — Bebas Neue**

Tìm mọi `<h1>`, `<h2>` trong page, thêm Bebas Neue style.

- [ ] **Step 3: Tournament brackets/cards — square**

Tìm mọi `rounded-*` trong page component, xóa hoặc đổi sang `rounded-none`.

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/app/(public)/giai-cau-long-2026/
git commit -m "style: retro tournament page — square elements, Bebas Neue headings"
```

---

## Task 13: Admin Layout + Pages (Light Retro Touch)

**Files:**
- Modify: `src/app/admin/layout.tsx`

- [ ] **Step 1: Sidebar — bỏ `rounded-xl` trên nav links, `rounded-lg` trên logo badge**

Trong `layout.tsx`:

Logo badge — tìm `className="w-8 h-8 bg-sports-primary rounded-lg flex items-center justify-center text-white font-bold text-sm"`:
```tsx
className="w-8 h-8 bg-sports-primary flex items-center justify-center text-white font-bold text-sm"
style={{ borderRadius: 0 }}
```

Nav links — tìm `rounded-xl` trong link className:
```tsx
className={cn(
  'flex items-center justify-between px-3 py-2.5 text-sm transition-all group',
  active
    ? 'bg-sports-primary text-white'
    : 'text-gray-400 hover:text-white hover:bg-gray-800',
)}
```
(Bỏ `rounded-xl`)

Logout button — tương tự, bỏ `rounded-xl`.

- [ ] **Step 2: Admin page titles — Bebas Neue**

Mở `src/app/admin/page.tsx` (dashboard). Tìm `<h1` hoặc page title heading, thêm:
```tsx
style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
```

- [ ] **Step 3: `.admin-card` đã retro từ Task 1**

`.admin-card` class đã được cập nhật trong Task 1. Build và kiểm tra visual dashboard.

- [ ] **Step 4: Admin login page — square form**

Mở `src/app/admin/login/page.tsx`. Tìm mọi `rounded-*` trên input, button, card, xóa hết.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add src/app/admin/layout.tsx src/app/admin/page.tsx src/app/admin/login/page.tsx
git commit -m "style: retro admin — square sidebar, Bebas Neue page titles"
```

---

## Task 14: Final Build Verification

**Files:** (không có file mới)

- [ ] **Step 1: Full production build**

```bash
cd D:\songthach && npm run build
```
Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
Route (app)                              Size
...
✓ Generating static pages (29/29)
```
Nếu có TypeScript error: đọc error, fix file liên quan, re-run.

- [ ] **Step 2: Chạy dev server và kiểm tra visual từng trang**

```bash
npm run dev
```
Checklist visual:
- `http://localhost:3000` — hero Bebas Neue to, CTA vuông offset shadow, service cards retro, inline nav/footer retro
- `http://localhost:3000/sports` — hero H1 Bebas Neue, cards vuông
- `http://localhost:3000/sports/football` — badges vuông, booking panel time-slots vuông
- `http://localhost:3000/sports/badminton` — tương tự
- `http://localhost:3000/wedding` — Bebas Neue H1, Playfair H3, gallery square frames
- `http://localhost:3000/cafe` — menu category headers retro
- `http://localhost:3000/giai-cau-long-2026` — square elements
- `http://localhost:3000/admin` — sidebar nav vuông, dashboard cards vuông
- Navbar trên mọi trang: solid border `3px #0F3C2C`, logo Bebas Neue, CTA square shadow
- Footer: lime top border `4px`, Bebas Neue section titles, square social icons, lime copyright bar
- Mobile: MobileTabBar solid top border, center button square

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "style: complete retro redesign — Bold 90s Athletic, all pages verified"
```
