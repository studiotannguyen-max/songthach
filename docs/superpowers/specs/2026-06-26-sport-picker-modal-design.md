# Sport Picker Modal — Design Spec
**Date:** 2026-06-26  
**Status:** Approved

## Problem

Tất cả các nút "Đặt sân" trên web hiện tại đều link thẳng đến `/sports` (trang danh sách) hoặc một trang cụ thể. Người dùng bấm nút không biết mình sẽ đặt sân bóng hay sân cầu — trải nghiệm không rõ ràng, đặc biệt trên mobile.

Nút "Đặt sân ngay" trong Navbar desktop đã có dropdown chọn loại sân nhưng: (1) biến mất khi đăng nhập, (2) không nhất quán với các nút khác, (3) dropdown không thân thiện với mobile.

## Goal

Khi bấm BẤT KỲ nút "Đặt sân" nào trên toàn web (desktop + mobile responsive), hiện ra một modal (desktop) / bottom-sheet (mobile) để người dùng chọn loại sân trước khi điều hướng đến trang đặt sân tương ứng.

## Scope

**Buttons bị ảnh hưởng:**
1. `src/app/(public)/page.tsx` — nút "Đặt sân" trong inline nav (line ~144)
2. `src/app/(public)/page.tsx` — nút "Đặt sân ngay" trong hero section (line ~169)
3. `src/components/shared/Navbar.tsx` — nút "Đặt sân ngay" desktop (thay thế dropdown hiện tại)
4. `src/components/shared/MobileTabBar.tsx` — nút tròn nổi giữa (center FAB)

**KHÔNG thay đổi:**
- Cards dịch vụ trong homepage (đã link thẳng đúng trang)
- Trang `/sports/page.tsx` (đã có 2 cards chọn sân)
- Các nút "Sân Bóng Đá" / "Sân Cầu Lông" riêng trong mobile menu của Navbar (đã đúng rồi)

## Architecture — Approach 1: Global SportPickerContext

### New files

**`src/components/providers/SportPickerProvider.tsx`**
- Client component
- Exports `SportPickerContext` với `{ isOpen, open, close }`
- Exports hook `useSportPicker()`

**`src/components/shared/SportPickerModal.tsx`**
- Client component
- Đọc context từ `useSportPicker()`
- Render:
  - Desktop (`md:` breakpoint trở lên): overlay tối + dialog căn giữa màn hình, ESC để đóng
  - Mobile (dưới `md:`): bottom-sheet trượt lên từ đáy, có rounded top corners
- Nội dung: tiêu đề "Chọn loại sân", 2 card lớn cạnh nhau, nút Huỷ
- Card Sân Bóng Đá → router.push('/sports/football') + close()
- Card Sân Cầu Lông → router.push('/sports/badminton') + close()
- Click backdrop → close()

### Modified files

**`src/app/(public)/layout.tsx`**
- Bọc children trong `<SportPickerProvider>`
- Đặt `<SportPickerModal />` trong layout (render một lần duy nhất)

**`src/app/(public)/page.tsx`**
- Tách 2 nút "Đặt sân" thành 1 client component `SportPickerTrigger` (có thể inline ngay trong file bằng `'use client'` directive trên component, hoặc tách file riêng `src/components/shared/SportPickerTrigger.tsx`)
- `SportPickerTrigger` chỉ render một `<button>` gọi `useSportPicker().open()`

**`src/components/shared/Navbar.tsx`**
- Xoá state `bookingOpen` và dropdown hiện tại
- Nút "Đặt sân ngay" gọi `useSportPicker().open()` thay vì toggle dropdown
- Áp dụng cho cả khi đăng nhập lẫn chưa đăng nhập (hiện tại dropdown chỉ hiện khi chưa đăng nhập)

**`src/components/shared/MobileTabBar.tsx`**
- Đổi center FAB từ `<Link href="/sports">` thành `<button>` gọi `useSportPicker().open()`

## UI Design

### Modal (desktop, md+)
```
Backdrop: rgba(0,0,0,0.5), fixed inset-0 z-50
Dialog: bg-white, rounded-2xl, p-6, w-[min(420px,90vw)], centered

┌─────────────────────────────────┐
│  Chọn loại sân            [×]   │
│                                 │
│  ┌──────────────┐ ┌───────────┐ │
│  │      ⚽       │ │     🏸    │ │
│  │  Sân Bóng Đá │ │ Sân Cầu  │ │
│  │  2 sân · 5v7 │ │  Lông    │ │
│  │              │ │ 3 sân BWF │ │
│  └──────────────┘ └───────────┘ │
│                                 │
│          [ Huỷ ]                │
└─────────────────────────────────┘
```

### Bottom Sheet (mobile, dưới md)
```
Fixed bottom-0 inset-x-0 z-50
rounded-t-2xl bg-white p-5
pb-[env(safe-area-inset-bottom)]
Backdrop: rgba(0,0,0,0.4) cover phần còn lại
```

### Colors (theo design system hiện tại)
- Card hover: `bg-[#F4EEE1]` (SAND)
- Card border active: `#0F3C2C` (PITCH)
- Icon bg: `#F4EEE1` (SAND)
- CTA color: `#9CE25C` (LIME) hoặc PITCH cho text

## Error Handling

- `useSportPicker()` throw nếu dùng ngoài Provider (standard pattern)
- Navigation: dùng `useRouter().push()` — nếu user đang trên trang `/sports/football` và chọn football, vẫn push (không optimize — đơn giản nhất)

## Testing Notes

- Bấm mọi nút "Đặt sân" → modal hiện
- ESC / click backdrop → modal đóng
- Chọn Sân Bóng Đá → navigate /sports/football, modal đóng
- Chọn Sân Cầu Lông → navigate /sports/badminton, modal đóng  
- Mobile: bottom-sheet trượt lên từ dưới
- Logged in + logged out: nút Navbar đều mở modal
