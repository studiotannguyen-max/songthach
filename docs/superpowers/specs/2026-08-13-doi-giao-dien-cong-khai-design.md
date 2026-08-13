# Đổi giao diện khu công khai — Song Thạch

**Ngày:** 2026-08-13
**Phạm vi:** toàn bộ khu công khai — 13 trang trong nhóm `(public)` sau khi xoá trang Giải
Cầu Lông 2026, cộng 2 trang xác thực `(auth)` mà khách nhìn thấy (`/login`,
`/complete-profile`)
**Không đụng tới:** khu `/admin`, mọi API route, logic đặt sân / gửi email / xác thực

---

## 1. Mục tiêu

Giao diện hiện tại dùng ngôn ngữ poster retro (kem `#F4E9D6`, mù tạt `#E3A21A`, terracotta
`#C5532F`, bo góc `0px`, bóng đổ cứng lệch). Chủ site đánh giá là **cũ và thiếu sang**.

Đích đến: khung trắng sạch, chữ in hoa gọn, một màu nhấn xanh lá — theo mẫu trang YONEX
(`yonex.com/badminton`) mà chủ site đưa ra, **nhưng không có slider ảnh**: hero tĩnh.

Thành công khi:

- Không còn mã màu nào của bảng cũ trong khu công khai.
- Mọi trang công khai dùng chung một bộ token và một bộ thành phần dùng lại được.
- Xem trên màn 360px không có thanh cuộn ngang, không có chữ dưới 14px, không có vùng
  bấm nhỏ hơn 44px.
- `npm run build` và `tsc --noEmit` sạch.

## 2. Quyết định đã chốt

| Vấn đề | Quyết định |
|---|---|
| Phạm vi | Toàn bộ khu công khai, làm một lượt trong một spec |
| Bảng màu | Một màu nhấn duy nhất cho cả site, **không** đổi màu theo khu |
| Slider | Không dùng. Hero tĩnh |
| Nhận diện riêng trang giải | Bỏ. Không còn `giai.css` / `rating.css` |
| Trang Giải Cầu Lông 2026 | **Xoá hẳn khỏi web** (giải đã tổ chức xong) |
| Cụm Giải đấu Rating | Giữ, có đổi giao diện |
| Nguồn ảnh hero | Ảnh sẵn có trên Supabase Storage |
| Font | Oswald in hoa cho tiêu đề, Geist cho nội dung |
| Bo góc | `4px` |
| Mobile | Ưu tiên ngang hàng máy tính, thiết kế từ 360px trở lên |

## 3. Token thiết kế

### 3.1 Màu — đúng chín màu

| Biến | Mã | Dùng ở đâu |
|---|---|---|
| `--bg` | `#FFFFFF` | nền trang |
| `--bg-subtle` | `#F4F5F6` | section xen kẽ, nền thẻ |
| `--fg` | `#111315` | tiêu đề, nội dung |
| `--fg-muted` | `#5B6165` | mô tả, chú thích, nhãn |
| `--line` | `#E3E5E7` | viền thẻ, kẻ bảng, viền ô nhập |
| `--ink` | `#101314` | chân trang, dải nhấn tối |
| `--brand` | `#00A94F` | mảng màu, gạch chân mục đang xem, biểu tượng |
| `--brand-strong` | `#007A33` | nền nút, chữ link |
| `--danger` | `#D92D20` | lỗi form, trạng thái huỷ |

`--brand` trên nền trắng chỉ đạt tương phản 2.9:1 nên **không bao giờ dùng cho chữ**. Mọi chữ
và nút dùng `--brand-strong` (4.6:1). Khách của sân bóng và tiệc cưới có nhiều người lớn tuổi.

Ba biến `sports` / `wedding` / `cafe` trong `tailwind.config.ts` bị gỡ; các token shadcn
(`--primary`, `--background`, …) ánh xạ lại sang bảng trên.

### 3.2 Chữ

Chỉ hai font. `@import` trong `globals.css` gỡ bỏ **Playfair Display, Bricolage Grotesque,
IBM Plex Mono** (khai báo nhưng không dùng tới).

> **Lỗi đang tồn tại cần sửa:** `--font-bebas` trỏ tới `'Barlow Condensed'` nhưng font này
> **chưa bao giờ được nạp** trong `@import`. Mọi tiêu đề lớn (`page.tsx:126`, tiêu đề section
> trang chủ, chân trang) đang rơi về font mặc định của máy khách — mỗi máy hiện một kiểu.
> Đây nhiều khả năng là nguyên nhân chính của cảm giác "cũ / thiếu sang". Biến `--font-bebas`
> bị xoá, mọi chỗ dùng nó chuyển sang `--font-display`.

| Biến | Giá trị |
|---|---|
| `--font-display` | Oswald — in hoa, `font-weight: 600`, `letter-spacing: 0.02em` |
| `--font-sans` | Geist — `line-height: 1.6` |

| Cấp | Cỡ | Font |
|---|---|---|
| Tiêu đề hero | `clamp(40px, 6vw, 72px)` | display, in hoa |
| Tiêu đề section | `clamp(28px, 3.5vw, 44px)` | display, in hoa |
| Tiêu đề thẻ | `20px` | display |
| Nội dung | `16px` (bài viết dài `17px`) | sans |
| Chú thích | `14px` | sans |
| Nhãn nhỏ | `12px`, in hoa, `letter-spacing: 0.08em` | sans |

### 3.3 Khoảng cách, bo góc, hiệu ứng

- Thang khoảng cách bội số 4: `4 8 12 16 24 32 48 64 96`.
- Section: `padding-block` 64px (mobile) / 96px (desktop). Thay cho `py-16 md:py-20` không
  nhất quán hiện nay.
- Khung nội dung: rộng tối đa `1280px`, lề `16px` mobile / `24px` desktop.
- Bo góc `--radius: 4px` (đang là `0px`).
- **Bỏ toàn bộ bóng đổ cứng lệch** (`box-shadow: 3px 3px 0`, `translate(-2px,-2px)` ở nút
  Navbar và MobileTabBar) — đó là ngôn ngữ poster retro. Thay bằng viền `1px var(--line)`;
  khi rê chuột đổi viền sang `--brand` và thêm `box-shadow: 0 2px 8px rgb(0 0 0 / .08)`.
- Giữ `animation: fade-up / fade-in`; bỏ `float` (bập bênh 6 giây, không hợp phong cách mới).
- Tôn trọng `prefers-reduced-motion`: tắt mọi chuyển động.

## 4. Thành phần dùng chung

`src/components/ui/` hiện **rỗng** dù `tailwind.config.ts` đã khai báo đầy đủ token kiểu
shadcn. Dựng thật, mỗi file một thành phần:

| Thành phần | Nội dung |
|---|---|
| `Button` | 3 kiểu: `solid` (nền `--brand-strong`), `outline`, `ghost`. 3 cỡ, cỡ nhỏ nhất vẫn cao 44px |
| `Card` | viền `1px`, bo `4px`, có biến thể ảnh trên / chữ dưới |
| `SectionHeader` | nhãn nhỏ + tiêu đề in hoa + mô tả tuỳ chọn |
| `Badge` | trạng thái: còn trống / đã đặt / sắp diễn ra |
| `Field` | nhãn + ô nhập + báo lỗi, gắn `aria-describedby` |
| `Breadcrumb` | đường dẫn cho trang con |
| `PageHero` | hero tĩnh dùng chung cho mọi trang (mục 5.3) |
| `DataTable` | bảng cuộn ngang có cột đầu ghim, tự đổi sang dạng thẻ dưới 768px |

Mỗi thành phần nhận props rõ ràng, không đọc `pathname` hay gọi API bên trong — trừ
`Navbar`/`MobileTabBar` vốn cần biết trang đang xem.

## 5. Khung chung

### 5.1 Navbar

Hiện tại nav **trong suốt khi ở đầu trang** rồi mới chuyển sang đặc khi cuộn, kèm hai bộ màu
chữ (trắng / nâu) cho hai trạng thái — nguồn gốc của lỗi chữ trắng trên nền sáng. Bỏ hẳn:

- Nền trắng đặc, luôn luôn. Cao 72px desktop / 56px mobile. Viền dưới `1px var(--line)`.
  Dính trên cùng khi cuộn.
- Logo trái. Menu giữa: `--font-display` in hoa 13px, `letter-spacing: 0.06em`, màu `--fg`.
  **Bỏ toàn bộ icon lucide cạnh chữ.**
- Mục đang xem: gạch chân `2px var(--brand)`, không đổi nền.
- Phải: nút **ĐẶT SÂN** (`Button solid`) và avatar tài khoản.
- Menu mobile: mở tràn màn hình nền trắng, danh sách chữ in hoa cỡ lớn, mỗi mục cao 56px.
- Danh sách menu còn 5 mục sau khi gỡ "Giải Cầu Lông 2026".

### 5.2 Footer và MobileTabBar

- **Footer:** nền `--ink`, chữ trắng 75%, tiêu đề cột `--font-display` in hoa màu `--brand`.
  Bỏ viền vàng `4px` phía trên. Giữ nguyên cấu trúc (logo + mô tả + mạng xã hội, rồi 3 cột).
- **MobileTabBar:** giữ 4 tab + nút Đặt sân nổi giữa. Bỏ bóng cứng `3px 3px 0`, nút đổi sang
  `--brand-strong`, viền trên `1px var(--line)` thay viền nâu `3px`.

### 5.3 PageHero

Một thành phần cho cả 13 trang. **Không slider, không tự chạy, không nút chuyển ảnh.**

- Ảnh nền phủ kín chiều ngang. Cao `56vh` desktop (tối đa 640px), `44vh` mobile.
- Lớp phủ `linear-gradient(90deg, rgb(16 19 20 / .78), rgb(16 19 20 / .25))` để chữ luôn đọc
  được bất kể ảnh sáng hay tối.
- Nội dung căn trái trong khung 1280px: nhãn nhỏ in hoa → tiêu đề `--font-display` → một dòng
  mô tả → **đúng một** nút chính.
- Props: `label`, `title`, `description`, `cta`, `image`. Không truyền `image` thì dùng biến
  thể nền `--ink` với chữ lớn — **không để ô ảnh trống**.
- Ảnh khai báo sẵn `width`/`height` để trang không giật khi tải.

## 6. Quy tắc mobile

Áp cho mọi trang, kiểm trước khi coi là xong:

- Ba mốc: `360 / 768 / 1280`. Thiết kế từ 360px trở lên.
- Vùng bấm tối thiểu `44×44px`, cách nhau `≥ 8px`.
- Chữ nội dung `≥ 14px`.
- Mỗi trang chừa `padding-bottom: 96px` để thanh tab dưới không che nội dung. Hiện chỉ
  `Footer` có `pb-24`, các trang khác thiếu.
- Bảng rộng dùng `DataTable`: cuộn ngang trong khung riêng, cột đầu ghim. Trang không bao giờ
  bị đẩy ngang.
- Form một cột. Ô điện thoại đặt `inputMode="tel"`. Nút gửi dính đáy màn ở form dài.
- Ảnh khai báo sẵn tỉ lệ.

## 7. Từng trang

| Trang | Cấu trúc |
|---|---|
| `/` | Hero → 3 thẻ dịch vụ (Thể thao / Tiệc cưới / Cafe) → dải "Đặt sân nhanh" nền `--ink` → 3 tin mới nhất → bản đồ + liên hệ. Mobile xếp dọc, không cuộn ngang |
| `/sports` | Hero → 2 thẻ lớn chọn môn |
| `/sports/football` | Hero → bảng giá theo khung giờ → widget đặt sân → tiện ích → hỏi đáp |
| `/sports/badminton` | như trên |
| `/wedding` | Hero → thư viện ảnh dạng lưới → gói tiệc → form tư vấn (**giữ nguyên logic đã sửa ở `InquiryForm.tsx`**, chỉ thay lớp áo) |
| `/cafe` | Hero → menu đồ uống → không gian → giờ mở cửa. Giữ 2 mã QR hiện có |
| `/tin-tuc` | Lưới thẻ 3 cột, 1 cột dưới 768px |
| `/tin-tuc/[slug]` | Một cột rộng 720px, chữ 17px, ảnh tràn lề. Bài soạn bằng HTML thô (`content_format='html'`) cũng phải hiển thị đẹp trong khung này |
| `/giai-dau-rating` | Hero → giới thiệu → link sang 3 trang con |
| `/giai-dau-rating/bang-xep-hang` | `DataTable`; dưới 768px chuyển sang **thẻ xếp dọc** (hạng + tên + điểm + biến động) |
| `/giai-dau-rating/the-le` | Một cột chữ dài, mục lục dính bên trên ở mobile |
| `/giai-dau-rating/vdv/[id]` | Thông tin VĐV → biểu đồ điểm → lịch sử (`DataTable`) |
| `/profile` | Form một cột dùng `Field` |
| `/login` | Form một cột, báo lỗi rõ ràng |
| `/complete-profile` | Form một cột dùng `Field` |

Bảng giá theo khung giờ trên mobile hiển thị **dạng danh sách**, không phải bảng.

## 8. Xoá trang Giải Cầu Lông 2026

Giải đã tổ chức xong. Xoá hẳn, link cũ trả 404.

**Bước 0 bắt buộc — commit trước khi xoá.** Trong thư mục này có file **chưa từng được
commit**: `nha-tai-tro-data.ts` (git báo `??`), cùng `scripts/import-hoc-bong.mjs`. Xoá file
chưa commit là mất vĩnh viễn, git không khôi phục được. Phải commit toàn bộ hiện trạng lên
nhánh làm việc trước, rồi mới xoá ở commit sau.

Xoá:

- Cả thư mục `src/app/(public)/giai-cau-long-2026/` — `page.tsx` (526 dòng), `giai.css`
  (265 dòng), `hoc-bong-data.ts`, `nha-tai-tro-data.ts`, `qua-tang-data.ts`.
- Dòng 15 `src/components/shared/Navbar.tsx` — mục menu "Giải Cầu Lông 2026".
- `scripts/import-hoc-bong.mjs` — chỉ để sinh ra `hoc-bong-data.ts` của trang này.

Cụm `/giai-dau-rating` **không bị ảnh hưởng**: nó có `rating.css` riêng, tự khai báo token
retro trong phạm vi của nó (`rating.css:1`). File này sẽ bị xoá ở phần đổi giao diện cụm
rating chứ không phải ở bước xoá này.

Sau khi xoá, chạy `grep -rn "giai-cau-long-2026" src/ scripts/` phải không còn kết quả.

## 9. Việc kỹ thuật xuyên suốt

**Gom màu cứng về token.** Khu công khai đang có **khoảng 170 mã hex viết cứng trong 18
file** — `page.tsx` khai hằng `PAPER/SAND/PITCH/INK` ở đầu file, `Navbar.tsx` hardcode
`#3B2A1E` và `#C5860F`, `Footer.tsx` khai `const GREEN = '#3B2A1E'`. Đây là phần chiếm nhiều
công nhất, không phải việc dựng giao diện. Năm mã xuất hiện dày nhất: `#3B2A1E` (49 lần),
`#E3A21A` (18), `#C5860F` (12), `#A33E1F` (12), `#FFF6EC` (9).

Nguyên tắc: sau khi xong, `grep -rn "#[0-9A-Fa-f]\{6\}" src/app/\(public\) src/components/shared`
chỉ được trả về kết quả trong file định nghĩa token.

**Ảnh hero.** Lấy từ Supabase Storage. Khoá `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local`
local hiện **không hợp lệ** với project `tqhihuvpjegjmbbokcfb` (`401 Unregistered API key`,
khoá dạng mới `sb_secret_…`), nên chưa liệt kê được kho ảnh. Cần chủ site cấp khoá mới hoặc
gửi thẳng link ảnh. **Không chặn** phần dựng giao diện: `PageHero` có biến thể không ảnh,
dựng trước rồi gắn ảnh sau.

## 10. Thứ tự làm

Làm một lượt, nhưng theo thứ tự này để mỗi bước đều xem được kết quả:

1. Commit hiện trạng lên nhánh làm việc (bảo toàn file chưa commit).
2. Token: `globals.css` + `tailwind.config.ts`.
3. Bộ thành phần `src/components/ui/`.
4. Khung chung: `Navbar`, `Footer`, `MobileTabBar`, `PageHero`.
5. Trang chủ — mốc để chủ site duyệt "đúng cảm giác chưa" trước khi nhân ra các trang còn lại.
6. Xoá trang Giải Cầu Lông 2026.
7. Khu thể thao → tiệc cưới → cafe → tin tức → cụm rating → profile/login.
8. Rà mobile toàn bộ ở 360px.
9. `tsc --noEmit` + `npm run build`.

## 11. Kiểm chứng

Dự án **không có framework test** — cách xác minh đã quen dùng ở đây là dựng thật và xem
bằng mắt.

- `npm run build` và `tsc --noEmit` sạch.
- **Không chạy `npm run build` khi dev server đang chạy** — làm hỏng `.next`
  (`Cannot find module './XXXX.js'`).
- Xem thật ở 360px và 1280px: từng trang trong bảng mục 7.
- Kiểm tương phản `--brand-strong` trên nền trắng và chữ trắng trên `--brand-strong`.
- Thử bằng bàn phím: nút, link, menu mobile đều nhận được tiêu điểm và thấy rõ viền tiêu điểm.
- Đặt thử một sân và gửi thử một form tư vấn tiệc cưới sau khi đổi giao diện — chỉ để chắc
  lớp áo mới không làm hỏng luồng đang chạy.

## 12. Không nằm trong phạm vi

- Khu `/admin` — giữ nguyên hoàn toàn.
- Mọi API route, logic đặt sân, gửi email, xác thực.
- Nội dung chữ nghĩa trên các trang (chỉ đổi cách trình bày).
- Bug email magic-link Supabase (việc riêng, đang chờ log Auth Logs).
