# Trang chủ v2: lưới mosaic + khung giá/uy tín (thay cho thiết kế thẻ ảnh full-bleed)

## Bối cảnh

Sau khi đã triển khai xong [[2026-06-19-homepage-zone-cards-design|thiết kế thẻ khu vực ảnh full-bleed]] (commit `cedb780`), chủ quán xem trên `localhost:3000` và muốn đổi hướng khác — gửi lại ảnh tham khảo một trang giới thiệu dịch vụ kiểu marketplace ("Sparkline"/Outcrowd) và muốn dựng **toàn bộ phần đầu trang chủ** theo đúng cấu trúc đó: lưới ảnh mosaic không đều bên trái + khung thông tin/giá/CTA bên phải.

Đã xác nhận qua visual companion (2 vòng mockup):
1. Cấu trúc 2 cột (mosaic trái / info phải) — đồng ý.
2. Màu sắc: dùng màu rực theo từng khu (xanh lá bóng đá, hồng-đỏ cầu lông, vàng-ảnh thật tiệc cưới, ...) thay vì giữ nguyên tông vàng/nâu trầm hiện tại của theme — đồng ý, **không** thêm màu xanh dương/hồng neon xa lạ với thương hiệu.
3. Dải thông tin địa chỉ/SĐT/giờ mở hiện có ở dưới trang chủ (section "Info strip") sẽ **bị xoá**, thay bằng khung thông tin mới (tránh trùng lặp).

**Thiết kế này thay thế (supersede) phần "Zone grid" vừa làm ở thiết kế trước** — không phải làm thêm song song. Hero carousel, Navbar, Footer giữ nguyên không đổi.

## Thiết kế

### Bố cục tổng thể (thay cho section "Zone grid" + "Info strip" cũ)

Một section mới, layout 2 cột trên `sm:` trở lên (`grid-cols-[1.6fr_1fr]` hoặc tương đương), xếp dọc thành 1 cột trên mobile (mosaic trước, 2 khung info sau):

**Cột trái — lưới mosaic 4 khu, nền đen bo góc lớn:**
- 1 ô lớn (Bóng đá) chiếm toàn bộ chiều cao cột trái, nền gradient xanh lá đậm (`#34a35e` → `#15623a`), chữ trắng: nhãn khu + giá.
- Cột nhỏ bên cạnh, chia 3 ô đều nhau theo chiều cao:
  - Cầu lông: nền gradient hồng-đỏ (`#e0476f` → `#a02c50`).
  - Tiệc cưới: ảnh thật từ `getGallery('wedding')` (ảnh đầu tiên), phủ gradient màu vàng đồng nhẹ (`rgba(216,178,87,.55)` → `rgba(20,18,16,.55)`) — fallback về `WeddingArt` SVG nếu chưa có ảnh.
  - Café: nền gradient vàng nâu theo màu hiện có của `CafeArt` (`#caa86d` → `#a07c45`).
- Mỗi ô: nhãn khu (icon + tên) + giá/mô tả ngắn, chữ trắng, góc dưới-trái. Bấm vào ô → điều hướng tới trang khu tương ứng (giữ nguyên `href` như `ZONES` hiện có).

**Cột phải — 2 khung thông tin (thay cho "Info strip" cũ):**
1. **Khung giá + CTA:** giá khởi điểm ("Từ 50.000đ / giờ"), giờ mở cửa (06:00–22:00 hàng ngày), danh sách loại sân, nút lớn "Đặt sân ngay" (màu hồng-đỏ `#e0476f`, dẫn tới `/sports/football` — giữ hành vi giống nút CTA cũ trong Info strip).
2. **Khung uy tín Song Thạch:** logo tròn "ST", nhãn "UY TÍN", địa chỉ, "Xác nhận đặt sân trong vài phút", "4 dịch vụ: Bóng đá, Cầu lông, Cưới, Café". (Số liệu "⭐ 4.9 (120+ lượt đặt)" trong mockup là minh hoạ — **không** có dữ liệu thật cho rating/lượt đặt nên bản code thật **bỏ dòng này**, chỉ giữ các dòng có thông tin thật: địa chỉ, thời gian xác nhận, danh sách dịch vụ.)

### Dữ liệu

- Vẫn dùng `getGallery('wedding')` (đã có ở `src/lib/gallery.ts`) lấy ảnh đầu tiên cho ô Tiệc cưới, `revalidate = 60` như thiết kế trước.
- 3 khu còn lại dùng màu gradient cứng (không phải ảnh) — không cần truy vấn thêm.
- Địa chỉ/giờ mở/SĐT lấy lại nguyên giá trị từ `INFO` (mảng hiện có trong `page.tsx`) — không bịa số liệu mới.

## Ngoài phạm vi

- Rating/số lượt đặt thật ("⭐ 4.9", "120+ lượt đặt") — không có dữ liệu thật, không làm giả, để dành cho lần khác nếu chủ quán muốn thu thập đánh giá thật.
- Ảnh thật cho Bóng đá/Cầu lông/Café — vẫn dùng màu gradient/SVG, giống như đã ghi trong spec trước.
- Hero carousel, Navbar, Footer — không đổi.
