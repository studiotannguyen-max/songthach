# Design: Thu gọn bố cục trang giai-cau-long-2026

**Date:** 2026-06-27
**Files:** `src/app/(public)/giai-cau-long-2026/page.tsx`, `src/app/(public)/giai-cau-long-2026/giai.css`

## Mục tiêu

Trang hiện tại quá dài do section Mission thừa và spacing/padding lớn. Thu gọn lại để nội dung compact hơn mà không mất thông tin quan trọng.

## Thay đổi

### 1. Xóa section Mission (`#mucdich`)
- Xóa toàn bộ HTML của `<section className="mission" id="mucdich">` (khoảng 15 dòng)
- Xóa CSS: `.mission`, `.mission-grid`, `.stat-card`, `.rays`, `@media .mission-grid`
- Lý do: nội dung (mục đích giải + stat "7 nhóm") đã được hero lede và section nhóm truyền đạt đủ

### 2. Hero gọn hơn
- `hero-inner` padding: `60px 22px 78px` → `44px 22px 52px`
- `.lede` margin-top: `22px` → `14px`
- `.facts` margin-top: `32px` → `20px`
- `.hero-cta` margin-top: `34px` → `22px`

### 3. Section Đăng ký compact
- `reg-card` padding inline: `64px` → `36px` (top/bottom)
- Lede rút ngắn bỏ câu thứ 2
- `.pay` font và padding giảm nhẹ: `padding: 26px` → `20px`

### 4. Spacing toàn trang
- `section { padding: 64px 0 }` → `padding: 48px 0`
- `.sec-head { margin-bottom: 40px }` → `margin-bottom: 28px`

## Không thay đổi
- Cấu trúc HTML các section còn lại (Groups, Lệ phí, Quy định)
- Màu sắc, font, border-radius, box-shadow
- Responsive breakpoints
