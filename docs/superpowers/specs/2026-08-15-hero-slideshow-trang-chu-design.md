# Slide ảnh trong hero trang chủ

Ngày: 2026-08-15 · Nhánh: `feat/giao-dien-moi`

## Vấn đề

Hero trang chủ đang là biến thể **không ảnh** của `PageHero` — nền đen trơn. Đây là khung hình đầu
tiên khách nhìn thấy nhưng lại không cho thấy Song Thạch trông ra sao. Ảnh sân cầu lông, sân bóng đá
và tiệc cưới đã có sẵn trong Kho ảnh (`/admin/gallery`) nhưng chưa dùng ở trang chủ.

## Giải pháp

Hero trang chủ chạy slide 3 ảnh: **sân cầu lông → sân bóng đá → tiệc cưới**, tự đổi mỗi 5 giây bằng
hiệu ứng mờ dần, có 3 chấm để bấm chọn. Chữ và 2 nút CTA giữ nguyên, nằm đè lên ảnh như hiện tại.

Đây là ngoại lệ có chủ ý so với spec `2026-08-13-doi-giao-dien-cong-khai-design.md` ("hero tĩnh,
không slider"). Ngoại lệ **chỉ áp dụng cho trang chủ**; 12 trang công khai còn lại vẫn hero tĩnh.

## Thành phần

### `src/components/ui/HeroSlideshow.tsx` (mới, client component)

| | |
|---|---|
| Nhận vào | `slides: { src: string; alt: string }[]` |
| Việc | Hiển thị ảnh nền chạy vòng cho hero |
| Phụ thuộc | `next/image` |

- Các ảnh xếp chồng `absolute inset-0`; ảnh đang hiện `opacity-100`, còn lại `opacity-0`, chuyển
  bằng `transition-opacity` 700ms.
- Tự đổi mỗi 5000ms. Dùng `setTimeout` đặt lại theo `current` (không phải `setInterval`) để khi
  khách bấm chấm thì đồng hồ đếm lại từ đầu — nếu không, vừa bấm chọn ảnh là 1 giây sau nó tự nhảy.
- `prefers-reduced-motion: reduce` → **không** tự chạy; ảnh chỉ đổi khi khách bấm chấm.
- Chấm bấm: `<button>` thật, sát đáy hero, canh giữa, có `aria-label="Xem ảnh N"` và
  `aria-current` cho chấm đang chọn; vùng chạm ≥ 44px.
- `slides.length <= 1` → không render chấm, không chạy timer.
- Ảnh đầu tiên đặt `priority` để không làm chậm LCP.

### `src/components/ui/PageHero.tsx` (sửa)

Thêm prop tuỳ chọn `slides?: { src: string; alt: string }[]`.

- Có `slides` (≥1 phần tử) → render `<HeroSlideshow>` thay cho `<Image>` đơn.
- Không có → giữ nguyên hành vi cũ: có `image` thì render ảnh tĩnh, không có thì lộ nền đen.
- Lớp phủ gradient, phần chữ, CTA: không đổi. Truyền cả `slides` lẫn `image` thì `slides` thắng.

Các trang khác không phải sửa gì vì `image` giữ nguyên chữ ký cũ.

### `src/lib/hero-slides.ts` (mới)

Hàm thuần `buildHeroSlides(badminton, football, wedding)` nhận 3 mảng `GalleryImage[]`, trả về
`HeroSlide[]`. Tách riêng khỏi `page.tsx` để test được bằng vitest (bộ test hiện chạy
`environment: node`, chỉ nhận `src/**/*.test.ts` — không test được component).

- Lấy **ảnh đầu tiên** của mỗi mục theo đúng thứ tự admin đã sắp, bỏ mục nào chưa có ảnh.
- `alt` lấy từ `caption`; caption rỗng/chỉ khoảng trắng thì dùng mặc định theo mục: "Sân cầu lông
  Song Thạch", "Sân bóng đá Song Thạch", "Sảnh tiệc cưới Song Thạch".
- Thứ tự slide cố định: cầu lông → bóng đá → tiệc cưới.

### `src/app/(public)/page.tsx` (sửa)

Gọi thêm `getGallery('badminton')`, `getGallery('football')`, `getGallery('wedding')` song song
trong `Promise.all` đang có, đưa qua `buildHeroSlides()` rồi truyền kết quả vào `PageHero`.

## Khi kho ảnh trống — hero nền xanh

Không mục nào có ảnh → không truyền `slides` → hero về biến thể không ảnh. **Không** dùng ảnh
Unsplash mặc định cho hero trang chủ: khung hình đầu tiên khách thấy không được là ảnh của nơi khác.
(Các trang con vẫn giữ fallback Unsplash của chúng, không đụng tới.)

Biến thể không ảnh **đổi từ nền đen `--ink` sang xanh lá thương hiệu `--brand-strong` (#007A33)**,
cho hợp tông trắng + xanh lá của giao diện mới. Đổi này áp dụng cho mọi trang đang dùng hero không
ảnh (trang chủ, `/tin-tuc`, cụm giải đấu rating), không chỉ trang chủ.

Kéo theo hai chỉnh sửa bắt buộc:

1. **Lớp phủ nhẹ đi** — `rgb(16 19 20 / .45 → .15)` thay cho `.78 → .25`. Giữ phủ đậm thì xanh
   thành đen xỉn, mất luôn ý nghĩa của việc đổi màu. Chữ trắng vẫn đủ tương phản.
2. **Nút chính đảo thành trắng** — `.btn-brand` dùng đúng màu `--brand-strong`, đặt lên nền xanh
   thì chìm hẳn. Thêm lớp `.hero-no-media` trên `<section>` và rule đè trong `globals.css`:
   nền trắng, chữ `--brand-strong`. Hero **có ảnh** giữ nguyên nút xanh như cũ.

Nút của prop `cta` trước đây viết class Tailwind inline trùng hệt `.btn-brand`; đổi sang dùng thẳng
`.btn-brand` để nó cũng ăn rule đè trên. Giao diện các trang khác không đổi.

## Đổi ảnh sau này

Chủ site vào `/admin/gallery`, kéo ảnh muốn dùng lên đầu mục tương ứng. Trang chủ có
`revalidate = 60` nên ảnh mới hiện sau khoảng 1 phút.

## Nghiệm thu

- `npm test` xanh (có test cho `buildHeroSlides`), `npx tsc --noEmit` sạch. Không chạy
  `npm run build` khi dev server đang chạy.
- Mở `/`: hero chạy 3 ảnh, đổi sau 5s, bấm chấm nhảy đúng ảnh, chữ và 2 nút CTA vẫn đọc/bấm được.
- Mở một trang hero tĩnh bất kỳ (`/wedding`) để chắc chắn không bị ảnh hưởng.

**Bẫy cache khi nghiệm thu:** `next.config.mjs` gắn `Cache-Control: immutable` cho
`/_next/static/(.*)`. Ở production tên file có hash nên không sao, nhưng `next dev --turbo` giữ
nguyên tên file khi nội dung đổi → trình duyệt bám CSS/JS cũ, sửa xong mà màn hình không đổi.
Ctrl+F5 không phải lúc nào cũng ăn. Cách chắc chắn: mở qua origin khác (`127.0.0.1:3000` hay
`192.168.x.x:3000`) vì cache tính theo origin.

**Cảnh báo môi trường:** `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local` đang lỗi `401`, nên
`getGallery()` trả rỗng khi chạy local — hero sẽ **vẫn đen**. Đó là lỗi môi trường, không phải lỗi
code. Muốn nghiệm thu bằng mắt tại local thì phải thay key đúng trước.

## Không làm

- Không thêm nút mũi tên ‹ › (dễ bấm nhầm khi hero đã có 2 nút CTA).
- Không đổi hero của bất kỳ trang nào khác.
- Không thêm thư viện slider ngoài — tự viết bằng state + `setInterval` là đủ.
