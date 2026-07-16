# Thiết kế: Gộp danh sách học bổng vào khu "Quỹ giải dùng vào đâu" (dạng xổ xuống)

- **Ngày:** 2026-07-16
- **Trang:** `src/app/(public)/giai-cau-long-2026/page.tsx` + `giai.css`
- **Liên quan:** spec `2026-07-14-giai-cau-long-tai-tro-qua-tang-design.md` (đã tạo section `#qua-tang`)

## 1. Mục tiêu

Trang `/giai-cau-long-2026` hiện có 2 section rời nhau nói về cùng một chuyện (quỹ giải dùng cho ai/việc gì):

1. `#hoc-bong` — bảng đầy đủ 82 em, luôn mở, chiếm rất nhiều chiều dài trang.
2. `#qua-tang` — kicker "Quỹ giải dùng vào đâu", bảng 4 dòng bộ quà + tổng 75.730.000đ.

Gộp (1) vào (2) dưới dạng **thanh xổ đóng sẵn**: người đọc lướt qua thấy ngay quỹ dùng vào đâu, ai cần xem danh sách từng em thì tự bấm mở. Mục đích là rút ngắn trang, không phải giấu thông tin.

## 2. Phạm vi & phương án

**Phương án chọn (A): một cột, thanh xổ nằm dưới bảng quà.**

Bảng 82 em giữ nguyên chiều rộng đầy đủ khi mở, mobile không bị bóp. Đã cân nhắc 2 phương án khác và loại:

- **Hai cột cạnh nhau** (bảng quà trái / danh sách phải): cột "Hoàn cảnh" chỉ còn nửa chiều rộng → chữ dồn cục, hỏng thành quả bảng-thẻ-mobile làm ngày 15/07.
- **Hai thanh xổ song song** (xổ cả bảng quà): con số tổng 75.730.000đ là điểm nhấn minh bạch của khu này, đóng lại thì mất.

## 3. Cấu trúc sau khi gộp

Section `#qua-tang` (nền `--cream2`), giữ nguyên kicker "Quỹ giải dùng vào đâu" và h2 "Bộ quà trao tận tay các em":

```
<section id="qua-tang">
  sec-head (kicker + h2 + p)      ← giữ nguyên
  .qt-table-wrap  (bảng quà)      ← giữ nguyên
  .qt-foot         (ghi chú VPP)  ← giữ nguyên
  <details id="hoc-bong" class="hb-acc">          ← MỚI
    <summary>Danh sách 82 em nhận học bổng 2026 · chip "82 suất" · chevron</summary>
    <p class="hb-acc-intro">…82 học sinh vượt khó xã Hưng Thịnh… tên được ẩn một phần…</p>
    .hb-table-wrap (bảng 82 em)   ← chuyển nguyên si từ #hoc-bong
  </details>
</section>
```

Section `#hoc-bong` cũ (nền `--paper`, nằm giữa `#dangky` và `#qua-tang`) bị **xoá hẳn**; `sec-head` của nó (kicker "Mục tiêu gây quỹ" + h2 "Danh sách học bổng 2026") không còn, câu giới thiệu 82 em + ghi chú riêng tư chuyển vào trong `<details>`.

**Giữ `id="hoc-bong"`** — gán lên thẻ `<details>` để link cũ `…/giai-cau-long-2026#hoc-bong` vẫn nhảy đúng chỗ. Hiện không có nav/menu nào trỏ tới id này (đã grep toàn `src/`), nhưng link có thể đã được chia sẻ ngoài site.

## 4. Trạng thái & tương tác

- **Đóng mặc định.** Dùng `<details>/<summary>` HTML thuần — trang là server component, không có `'use client'`, không thêm JS.
- Bảng bên trong giữ **toàn bộ** hành vi hiện có: bảng thường ở desktop, dạng thẻ + chip lớp + nút "Xem thêm/Thu gọn" từng em ở ≤640px (cơ chế checkbox-CSS `hb-more-cb`, không đụng tới).
- Không cần lo lồng nhau: `<details>` ngoài + checkbox-CSS trong là 2 cơ chế độc lập.

## 5. Giao diện thanh xổ

Đồng bộ neo-brutalist của trang, dùng lại đúng biến màu sẵn có (KHÔNG thêm biến mới):

- `summary`: nền `var(--ink)`, chữ `var(--cream2)`, font "Baloo 2" 700, padding `14px 20px`, cursor pointer, `list-style:none` + ẩn `::-webkit-details-marker`.
- Chip số suất: nền `var(--mustard)`, chữ `var(--ink)`, bo `999px`.
- Chevron: xoay 180° khi `[open]`, transition `.2s`.
- Bọc ngoài: viền `2.5px solid var(--ink)`, bo `18px`, `box-shadow:4px 4px 0 var(--ink)`, `overflow:hidden` — khớp `.hb-table-wrap` sẵn có.
- Khi mở: `.hb-table-wrap` bên trong **bỏ viền/bóng/bo góc riêng** (`.hb-acc .hb-table-wrap{border:none;border-radius:0;box-shadow:none}`) để không có khung lồng khung.
- `margin-top:22px` tách khỏi `.qt-foot`.

Class mới đặt dưới namespace `.giai-page` (bắt buộc — cả file CSS dùng namespace này): `.hb-acc`, `.hb-acc-intro`.

## 6. Không đụng tới

`hoc-bong-data.ts`, hàm `obscureName`, bảng quà (`qt-*`), khu tài trợ `#tai-tro`, hero, nhóm thi đấu, lệ phí, đăng ký.

## 7. Xác minh

Không có test framework. Kiểm bằng:

1. `npm run build` sạch (báo user tắt dev server trước — build lúc dev chạy làm hỏng `.next`).
2. Trực quan desktop: khu "Quỹ giải dùng vào đâu" có bảng quà + thanh xổ đóng; bấm → xổ ra đủ 82 dòng, không khung lồng khung; section `#hoc-bong` cũ không còn xuất hiện ở trên.
3. Trực quan mobile 390×844: thanh xổ không tràn ngang; mở ra vẫn là dạng thẻ, nút "Xem thêm" từng em còn chạy.
4. `…/giai-cau-long-2026#hoc-bong` cuộn tới thanh xổ.

## 8. YAGNI

Không làm: ô tìm kiếm/lọc trong danh sách, phân trang, nhớ trạng thái mở, tự mở khi vào bằng anchor, đổi tiêu đề khu, nút "mở tất cả", CSS in giấy (`giai.css` xưa nay không có `@media print`, không mở thêm mặt trận này).
