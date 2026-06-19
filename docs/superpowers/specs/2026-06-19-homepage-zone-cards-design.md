# Trang chủ: thẻ khu vực kiểu ảnh full-bleed + gradient đáy

## Bối cảnh

Chủ quán thấy trang chủ (songthach.com) "xấu" trên cả mobile và desktop. Sau khi xem 3 hướng phong cách (khối màu bạo / lưới mosaic / ảnh thật + duotone) qua visual companion, đã chọn hướng **C: giữ nội dung hình ảnh hiện có, đổi cách trình bày thẻ** — cụ thể là ảnh/hình full thẻ + gradient tối ở đáy + bỏ viền + chữ to, áp dụng đồng bộ cho cả 4 thẻ khu vực.

Khi audit, phát hiện: hệ thống đã có 10 ảnh thật cho khu **Tiệc cưới** (upload qua `/admin/gallery`, bảng `gallery_images`, category `wedding`), nhưng **chưa có ảnh thật** cho Bóng đá/Cầu lông/Café — 3 khu này tạm tiếp tục dùng hình vẽ SVG hiện tại (`ZoneArt.tsx`), chỉ đổi khung bao quanh để đồng bộ. Khi chủ quán upload ảnh thật cho 3 khu này qua trang quản lý sẵn có, có thể lặp lại đúng cách làm của khu Tiệc cưới (ngoài phạm vi của task này).

## Phạm vi

**Chỉ đổi:** cách trình bày 4 thẻ khu vực trong section "Một địa điểm, bốn không gian" ở `src/app/(public)/page.tsx`.

**Không đổi:** `HeroCarousel`, dải thông tin liên hệ (`INFO` section), `Footer`, `Navbar`, và cấu trúc lưới hiện có (mobile: 1 thẻ to + 3 thẻ nhỏ; tablet/desktop: 4 thẻ bằng nhau trong grid).

## Thiết kế

### 1. Lấy ảnh thật cho khu Tiệc cưới

- `HomePage` đổi thành `async function`, gọi `getGallery('wedding')` (đã có sẵn ở `src/lib/gallery.ts`, dùng chung pattern với `src/app/(public)/wedding/page.tsx`).
- Lấy ảnh đầu tiên trong danh sách trả về (đã sắp theo `sort_order`) làm ảnh đại diện cho thẻ Tiệc cưới ở trang chủ.
- Nếu danh sách rỗng (chưa có ảnh hoặc admin tắt hết) → fallback dùng lại `WeddingArt` SVG như hiện tại — không vỡ trang.

### 2. Thẻ khu vực kiểu mới (áp dụng cho cả 4 khu, cả mobile và desktop)

- Ảnh/hình vẽ (`<Art />` hoặc `<img>`) chiếm **toàn bộ** chiều cao thẻ (`absolute inset-0`), không chia ảnh-trên/chữ-dưới như hiện tại.
- Phủ một lớp gradient: `linear-gradient(180deg, transparent 35%, rgba(44,42,38,.92) 100%)` (màu dựa trên `--secondary` hiện có trong theme) đặt trên ảnh.
- Nội dung (nhãn khu, mô tả ngắn, giá, nút mũi tên) đặt ở **đáy thẻ**, đè lên phần gradient đậm, chữ màu trắng.
- **Bỏ `border border-border`** quanh thẻ — bo góc giữ nguyên (`rounded-2xl`/`rounded-[var(--radius)]`).
- Tăng cỡ chữ nhãn khu và giá (ví dụ giá từ `text-sm`/`text-[11px]` lên `text-base`/`text-lg` tuỳ kích thước thẻ) để rõ và "bold" hơn.
- Nút mũi tên (`ArrowUpRight`) giữ dạng hình tròn nhưng đổi nền sang màu accent (`bg-accent`) thay vì nền xám mờ, để nổi trên ảnh tối.
- Cấu trúc lưới (số cột, kích thước "1 to + 3 nhỏ" trên mobile, 4 cột bằng nhau từ `sm:` lên) **giữ nguyên hoàn toàn** — chỉ thay nội dung bên trong từng thẻ.

### 3. Phạm vi áp dụng

- Cả khối "mobile: 1 big + 3 small" và khối "tablet+: grid 4 cột" trong `page.tsx` đều cần sửa theo kiểu thẻ mới — hai khối code riêng biệt hiện tại, sửa cả hai cho đồng bộ.

## Ngoài phạm vi

- Ảnh thật cho Bóng đá/Cầu lông/Café — chờ chủ quán upload qua `/admin/gallery`, làm sau bằng cách lặp lại bước 1 ở trên cho từng category.
- Đổi cấu trúc lưới/layout (mosaic không đều, v.v.) — không nằm trong lựa chọn đã chốt.
- Hero, Info strip, Footer — không đổi.
