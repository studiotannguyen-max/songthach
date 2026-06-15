# Football "Chiêu sinh" Section Redesign — Lớp Bóng Đá Hè

## Context

`src/app/(public)/sports/football/page.tsx` has a `id="classes"` section showing 3
placeholder classes (`FB_CLASSES`) with fake Song Thạch coach data. This is being
replaced with a real partner program, styled to match the badminton page's
`id="classes"` section (`src/app/(public)/sports/badminton/page.tsx`).

## Content (provided by user)

- Tên chương trình: Chiêu Sinh Lớp Bóng Đá Hè
- Đơn vị tổ chức: Trung tâm đào tạo bóng đá Văn Tâm Đồng Nai – Vệ tinh PVF
- Đối tượng: 7 – 14 tuổi
- Khai giảng: 01/06/2026 (kept as provided, even though in the past relative to today)
- Lịch học: Thứ 2 – Thứ 4 – Thứ 6, 17h30 – 19h00
- Địa điểm: Sân bóng đá Song Thạch, 9B/3, Ấp An Hòa, Xã Hưng Thịnh
- Học phí: 500.000đ / tháng
- Liên hệ: 0837 781 818 (Thầy Phụng), 0915 178 939 (Cô Hà)

## Changes

### Data (top of `football/page.tsx`)
- Remove `FB_CLASSES` array and the now-unused icon imports it required
  (`CalendarDays`, `Users`, `CheckCircle2`, `Link` — re-check each against
  remaining usages before removing).
- Add new consts:
  - `SUMMER_CLASS` — object with `org`, `ageRange`, `startDate`.
  - `ENROLL_CONTACTS` — array of `{ phone, display, name }`, same shape as
    badminton's `ENROLL_CONTACTS` (Thầy Phụng primary, Cô Hà secondary).

### Section JSX (replaces current lines ~213–299, `id="classes"`)
Mirrors badminton's `id="classes"` section structure:

- **Header**: badge "Chiêu sinh hè — Văn Tâm Đồng Nai (Vệ tinh PVF)", title
  "Lớp Bóng Đá Hè", location line with `MapPin` icon →
  "Sân bóng đá Song Thạch — 9B/3, Ấp An Hòa, Xã Hưng Thịnh".
- **Left column** (`lg:col-span-2`):
  - Card "Thông tin chương trình": đơn vị tổ chức, đối tượng (7–14 tuổi),
    khai giảng (01/06/2026) as icon rows (reuse `GraduationCap`, `Users`,
    `CalendarDays`).
  - Card "Liên hệ đăng ký": 2 phone buttons, same style as badminton's
    `ENROLL_CONTACTS` rendering (`sports-btn` for primary, outlined for
    secondary), needs `Phone` icon import.
- **Right column** (`lg:col-span-3`): single card with `gradient-sports`
  "BẢNG GIÁ"-style header, rows for:
  - Lịch học: Thứ 2-4-6, 17h30–19h00
  - Học phí: 500.000đ/tháng
  - Địa điểm: full address

## Out of scope
- No new CSS classes — reuse `sports-card`, `gradient-sports`, `sports-btn`,
  existing icon-row patterns.
- No changes to `BookingWidget`, hero section, or price table for courts.
- No test framework changes (project has none; this is static content).

## Self-review notes
- Date 01/06/2026 kept per user decision, despite being in the past relative
  to "today" (2026-06-14) — informational class info, not a booking date.
- No git repo in `D:\songthach`, so this spec is not committed to git.
