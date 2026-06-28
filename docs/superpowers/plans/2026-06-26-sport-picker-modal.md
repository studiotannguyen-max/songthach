# Sport Picker Modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khi bấm bất kỳ nút "Đặt sân" nào trên web, hiện modal/bottom-sheet chọn loại sân (Bóng Đá hoặc Cầu Lông) trước khi điều hướng đến trang đặt sân tương ứng.

**Architecture:** Dùng React Context (`SportPickerContext`) đặt trong public layout để mọi component con đều gọi được `open()`. Modal render một lần duy nhất trong layout. Các button đặt sân chỉ cần gọi `useSportPicker().open()` thay vì navigate.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, `useRouter` từ `next/navigation`.

## Global Constraints

- Project root: `D:\songthach`
- Không có test framework — dùng manual verification (mở browser, bấm nút, quan sát)
- Design tokens Tailwind: `sports-primary` (#0F3C2C), `sports-accent` (#9CE25C), `sports-light` (#F4EEE1), `sports-dark` (#10150F)
- CSS vars: `--primary`, `--background`, `--foreground`, `--border`, `--muted`
- Tất cả client components phải có `'use client'` ở dòng đầu
- `FootballArt` và `BadmintonArt` export từ `@/components/shared/ZoneArt`
- Import alias: `@/` = `src/`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/providers/SportPickerProvider.tsx` | Context state (`isOpen`, `open`, `close`) + hook |
| Create | `src/components/shared/SportPickerModal.tsx` | UI modal (desktop) / bottom-sheet (mobile) |
| Create | `src/components/shared/SportPickerTrigger.tsx` | Thin client wrapper dùng trong server components |
| Modify | `src/app/(public)/layout.tsx` | Bọc provider, mount modal |
| Modify | `src/components/shared/MobileTabBar.tsx` | Center FAB gọi `open()` thay vì `<Link>` |
| Modify | `src/components/shared/Navbar.tsx` | "Đặt sân ngay" button gọi `open()`, xoá dropdown cũ |
| Modify | `src/app/(public)/page.tsx` | Thay 2 `<Link href="/sports">` bằng `<SportPickerTrigger>` |

---

### Task 1: SportPickerProvider

**Files:**
- Create: `src/components/providers/SportPickerProvider.tsx`

**Interfaces:**
- Produces:
  - `SportPickerProvider({ children })` — React component bọc layout
  - `useSportPicker()` — hook trả `{ isOpen: boolean; open: () => void; close: () => void }`

- [ ] **Step 1: Tạo file provider**

```tsx
// src/components/providers/SportPickerProvider.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type SportPickerContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const SportPickerContext = createContext<SportPickerContextType | null>(null);

export function SportPickerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SportPickerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </SportPickerContext.Provider>
  );
}

export function useSportPicker() {
  const ctx = useContext(SportPickerContext);
  if (!ctx) throw new Error('useSportPicker must be used inside SportPickerProvider');
  return ctx;
}
```

- [ ] **Step 2: Verify TypeScript**

```powershell
cd D:\songthach
npx tsc --noEmit 2>&1 | Select-String "SportPicker"
```
Expected: không có lỗi liên quan SportPicker.

- [ ] **Step 3: Commit**

```bash
git add src/components/providers/SportPickerProvider.tsx
git commit -m "feat: add SportPickerProvider context"
```

---

### Task 2: SportPickerModal

**Files:**
- Create: `src/components/shared/SportPickerModal.tsx`

**Interfaces:**
- Consumes: `useSportPicker()` từ `@/components/providers/SportPickerProvider`
- Consumes: `FootballArt`, `BadmintonArt` từ `@/components/shared/ZoneArt`
- Consumes: `useRouter` từ `next/navigation`
- Produces: `SportPickerModal()` — component không nhận props, tự đọc context

- [ ] **Step 1: Tạo file modal**

```tsx
// src/components/shared/SportPickerModal.tsx
'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useSportPicker } from '@/components/providers/SportPickerProvider';
import { FootballArt, BadmintonArt } from '@/components/shared/ZoneArt';

const SPORTS = [
  {
    label: 'Sân Bóng Đá',
    sub: '3 sân · 5 người & 7 người',
    href: '/sports/football',
    Art: FootballArt,
  },
  {
    label: 'Sân Cầu Lông',
    sub: '3 sân tiêu chuẩn BWF',
    href: '/sports/badminton',
    Art: BadmintonArt,
  },
] as const;

export default function SportPickerModal() {
  const { isOpen, close } = useSportPicker();
  const router = useRouter();

  if (!isOpen) return null;

  function pick(href: string) {
    close();
    router.push(href);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={close}
    >
      {/* Panel — bottom-sheet trên mobile, dialog giữa trên desktop */}
      <div
        className="
          relative w-full bg-white
          rounded-t-2xl md:rounded-2xl
          p-5 md:p-7
          md:max-w-[440px]
          pb-[calc(env(safe-area-inset-bottom)+20px)] md:pb-7
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-sports-dark" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Chọn loại sân
          </h2>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-sports-light transition-colors"
            aria-label="Đóng"
          >
            <X size={18} className="text-sports-primary" />
          </button>
        </div>

        {/* Sport cards */}
        <div className="grid grid-cols-2 gap-3">
          {SPORTS.map(({ label, sub, href, Art }) => (
            <button
              key={href}
              onClick={() => pick(href)}
              className="group flex flex-col rounded-xl border-2 border-transparent hover:border-sports-primary overflow-hidden transition-all active:scale-[0.97]"
              style={{ background: '#f9f7f4' }}
            >
              <div className="w-full h-28 overflow-hidden">
                <Art className="w-full h-full" />
              </div>
              <div className="p-3 text-left">
                <p className="font-bold text-sm text-sports-dark leading-tight">{label}</p>
                <p className="text-xs text-[#6A6F66] mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={close}
          className="mt-4 w-full py-2.5 text-sm text-[#6A6F66] hover:text-sports-dark transition-colors"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```powershell
cd D:\songthach
npx tsc --noEmit 2>&1 | Select-String "SportPickerModal"
```
Expected: không có lỗi.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/SportPickerModal.tsx
git commit -m "feat: add SportPickerModal bottom-sheet UI"
```

---

### Task 3: Wire provider + modal vào public layout

**Files:**
- Modify: `src/app/(public)/layout.tsx`

**Interfaces:**
- Consumes: `SportPickerProvider` từ `@/components/providers/SportPickerProvider`
- Consumes: `SportPickerModal` từ `@/components/shared/SportPickerModal`

- [ ] **Step 1: Sửa layout.tsx**

Thay toàn bộ nội dung file:

```tsx
// src/app/(public)/layout.tsx
import MobileTabBar from '@/components/shared/MobileTabBar';
import { SportPickerProvider } from '@/components/providers/SportPickerProvider';
import SportPickerModal from '@/components/shared/SportPickerModal';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SportPickerProvider>
      <div className="pb-16 lg:pb-0">{children}</div>
      <MobileTabBar />
      <SportPickerModal />
    </SportPickerProvider>
  );
}
```

- [ ] **Step 2: Verify build**

```powershell
cd D:\songthach
npm run build 2>&1 | tail -20
```
Expected: build thành công, không có lỗi.

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/layout.tsx
git commit -m "feat: wire SportPickerProvider and modal into public layout"
```

---

### Task 4: Update MobileTabBar

**Files:**
- Modify: `src/components/shared/MobileTabBar.tsx`

**Interfaces:**
- Consumes: `useSportPicker()` từ `@/components/providers/SportPickerProvider`

- [ ] **Step 1: Sửa MobileTabBar.tsx**

Thêm import và thay center FAB. Toàn bộ file sau khi sửa:

```tsx
// src/components/shared/MobileTabBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Heart, Phone, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSportPicker } from '@/components/providers/SportPickerProvider';

const TABS = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Thể thao', href: '/sports', icon: Dumbbell },
  { label: 'Tiệc cưới', href: '/wedding', icon: Heart },
  { label: 'Gọi', href: 'tel:0378990979', icon: Phone, external: true },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const { open } = useSportPicker();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative grid grid-cols-5 items-end h-16">
        {/* 2 tab đầu */}
        {TABS.slice(0, 2).map((t) => (
          <TabItem key={t.href} {...t} active={isActive(t.href)} />
        ))}

        {/* Nút Đặt sân nổi giữa */}
        <div className="flex justify-center">
          <button
            onClick={open}
            aria-label="Đặt sân ngay"
            className="absolute -top-5 grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            <CalendarPlus size={24} />
          </button>
          <span className="text-[10px] font-medium text-primary mb-1.5">Đặt sân</span>
        </div>

        {/* 2 tab cuối */}
        {TABS.slice(2).map((t) => (
          <TabItem key={t.href} {...t} active={isActive(t.href)} />
        ))}
      </div>
    </nav>
  );
}

function TabItem({
  label, href, icon: Icon, active, external,
}: {
  label: string; href: string; icon: typeof Home; active?: boolean; external?: boolean;
}) {
  const inner = (
    <span className="flex flex-col items-center justify-center gap-1 h-full">
      <Icon size={21} aria-hidden="true" />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </span>
  );
  const cls = cn(
    'flex items-center justify-center h-16 transition-colors',
    active ? 'text-primary' : 'text-muted-foreground',
  );
  return external ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
```

- [ ] **Step 2: Manual verify**

Mở `http://localhost:3000` trên màn hình nhỏ (hoặc DevTools mobile). Bấm nút tròn giữa tab bar → modal hiện lên từ phía dưới.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/MobileTabBar.tsx
git commit -m "feat: MobileTabBar FAB opens sport picker modal"
```

---

### Task 5: Update Navbar

**Files:**
- Modify: `src/components/shared/Navbar.tsx`

**Interfaces:**
- Consumes: `useSportPicker()` từ `@/components/providers/SportPickerProvider`
- Xoá: state `bookingOpen`, dropdown JSX (lines ~196–225 và ~270–277)

- [ ] **Step 1: Thêm import useSportPicker**

Trong `src/components/shared/Navbar.tsx`, thêm vào block imports hiện có:

```tsx
import { useSportPicker } from '@/components/providers/SportPickerProvider';
```

- [ ] **Step 2: Thêm hook vào component**

Trong function `Navbar()`, thêm dòng sau ngay sau các `useState` hiện có:

```tsx
const { open: openSportPicker } = useSportPicker();
```

- [ ] **Step 3: Xoá state bookingOpen**

Xoá dòng:
```tsx
const [bookingOpen,  setBookingOpen] = useState(false);
```

Xoá useEffect đóng booking dropdown (4 dòng):
```tsx
// Đóng booking dropdown khi click ngoài
useEffect(() => {
  if (!bookingOpen) return;
  const close = () => setBookingOpen(false);
  document.addEventListener('click', close);
  return () => document.removeEventListener('click', close);
}, [bookingOpen]);
```

- [ ] **Step 4: Thay dropdown desktop bằng button đơn giản**

Tìm đoạn:
```tsx
<div className="relative" onClick={(e) => { e.stopPropagation(); setBookingOpen(!bookingOpen); }}>
  <button
    className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#a9781f] transition-colors active:scale-95 tracking-wide"
    aria-expanded={bookingOpen}
    aria-haspopup="menu"
  >
    Đặt sân ngay
    <ChevronDown size={14} aria-hidden="true" className={cn('transition-transform', bookingOpen && 'rotate-180')} />
  </button>
  {bookingOpen && (
    <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border overflow-hidden py-1 shadow-md" role="menu">
      <Link
        href="/sports/football"
        className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/80 hover:bg-muted transition-colors"
        onClick={() => setBookingOpen(false)}
        role="menuitem"
      >
        <Goal size={15} aria-hidden="true" /> Sân Bóng Đá
      </Link>
      <Link
        href="/sports/badminton"
        className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/80 hover:bg-muted transition-colors"
        onClick={() => setBookingOpen(false)}
        role="menuitem"
      >
        <Feather size={15} aria-hidden="true" /> Sân Cầu Lông
      </Link>
    </div>
  )}
</div>
```

Thay bằng:
```tsx
<button
  onClick={openSportPicker}
  className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#a9781f] transition-colors active:scale-95 tracking-wide"
>
  Đặt sân ngay
</button>
```

- [ ] **Step 5: Thêm nút "Đặt sân" vào trạng thái đã đăng nhập**

Tìm block user đã đăng nhập (bắt đầu bằng `/* Đã đăng nhập */`). Sau `</div>` đóng của `relative` div (dropdown user menu), thêm:

```tsx
<button
  onClick={openSportPicker}
  className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#a9781f] transition-colors active:scale-95 tracking-wide"
>
  Đặt sân
</button>
```

- [ ] **Step 6: Xoá import ChevronDown nếu không còn dùng**

Kiểm tra xem `ChevronDown` còn được dùng ở chỗ nào khác trong file không. Nếu không còn, xoá khỏi import.

- [ ] **Step 7: Verify TypeScript**

```powershell
cd D:\songthach
npx tsc --noEmit 2>&1 | Select-String "Navbar"
```
Expected: không có lỗi.

- [ ] **Step 8: Manual verify**

Mở `http://localhost:3000` desktop. Bấm nút "Đặt sân ngay" trên Navbar → modal hiện giữa màn hình. Đăng nhập → vẫn có nút "Đặt sân" → bấm → modal hiện.

- [ ] **Step 9: Commit**

```bash
git add src/components/shared/Navbar.tsx
git commit -m "feat: Navbar booking button opens sport picker modal"
```

---

### Task 6: Update Homepage (page.tsx)

**Files:**
- Create: `src/components/shared/SportPickerTrigger.tsx`
- Modify: `src/app/(public)/page.tsx`

**Interfaces:**
- Consumes: `useSportPicker()` từ `@/components/providers/SportPickerProvider`
- Produces: `SportPickerTrigger({ className, children })` — button gọi `open()`

- [ ] **Step 1: Tạo SportPickerTrigger**

```tsx
// src/components/shared/SportPickerTrigger.tsx
'use client';

import { useSportPicker } from '@/components/providers/SportPickerProvider';

export default function SportPickerTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSportPicker();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Sửa nút "Đặt sân" trong nav của page.tsx**

Trong `src/app/(public)/page.tsx`, thêm import ở đầu file (sau các import hiện có):

```tsx
import SportPickerTrigger from '@/components/shared/SportPickerTrigger';
```

Tìm dòng (trong inline nav, ~line 144):
```tsx
<Link href="/sports" className="rounded-full text-sm font-semibold px-5 py-2.5" style={{ background: LIME, color: INK }}>
  Đặt sân
</Link>
```

Thay bằng:
```tsx
<SportPickerTrigger className="rounded-full text-sm font-semibold px-5 py-2.5" style={{ background: LIME, color: INK }}>
  Đặt sân
</SportPickerTrigger>
```

- [ ] **Step 3: Sửa nút "Đặt sân ngay" trong hero**

Tìm dòng (trong hero section, ~line 169):
```tsx
<Link href="/sports" className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3" style={{ background: LIME, color: INK }}>
  Đặt sân ngay <ArrowRight size={16} />
</Link>
```

Thay bằng:
```tsx
<SportPickerTrigger className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3" style={{ background: LIME, color: INK }}>
  Đặt sân ngay <ArrowRight size={16} />
</SportPickerTrigger>
```

> **Lưu ý:** `page.tsx` là server component (`async function`). `SportPickerTrigger` là client component, được phép import vào server component vì Next.js App Router hỗ trợ interleaving này.

- [ ] **Step 4: Verify build**

```powershell
cd D:\songthach
npm run build 2>&1 | tail -20
```
Expected: `✓ Compiled successfully`, 29/29 static pages.

- [ ] **Step 5: Manual verify toàn bộ**

Mở `http://localhost:3000` và kiểm tra từng điểm:
1. Nút "Đặt sân" trong nav trang chủ → modal hiện
2. Nút "Đặt sân ngay" trong hero → modal hiện
3. Navbar desktop → "Đặt sân ngay" → modal hiện
4. Mobile tab bar (DevTools mobile view) → nút tròn giữa → bottom-sheet trượt lên
5. Bấm backdrop → đóng modal
6. Chọn "Sân Bóng Đá" → navigate `/sports/football`, modal đóng
7. Chọn "Sân Cầu Lông" → navigate `/sports/badminton`, modal đóng
8. Bấm "Huỷ" → modal đóng, không navigate
9. Đăng nhập → Navbar vẫn có nút "Đặt sân" → modal hiện

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/SportPickerTrigger.tsx src/app/(public)/page.tsx
git commit -m "feat: homepage booking buttons open sport picker modal"
```

---

## Checklist tổng (self-review)

- [x] Spec coverage: 4 buttons được xử lý (homepage nav, homepage hero, Navbar, MobileTabBar)
- [x] Provider + Modal tách bạch, không circular dependency
- [x] `page.tsx` vẫn là server component (chỉ import client component, không dùng hooks trực tiếp)
- [x] ESC/backdrop close — xử lý qua click backdrop trong modal
- [x] `safe-area-inset-bottom` cho bottom-sheet — có trong Task 2
- [x] Logged-in state có nút Đặt sân — có trong Task 5 Step 5
- [x] Không placeholder, mọi step có code đầy đủ
