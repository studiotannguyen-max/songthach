# Thiết kế: Bổ sung mục Quà tặng & Đồng hành/Tài trợ vào trang Giải Cầu Lông 2026

- **Ngày:** 2026-07-14
- **Trang:** `src/app/(public)/giai-cau-long-2026/page.tsx`
- **Nguồn dữ liệu:** `D:\GIAI DAU SONG THACH\BAO GIA VPP - HOC BONG 2026.xlsx` (báo giá quà) và `Thu Ngo ban nhap.pdf` (Thư Ngỏ kêu gọi tài trợ)

## 1. Mục tiêu

Đưa nội dung 2 tài liệu vào trang giải cầu lông:

1. **Thư Ngỏ** → một section **kêu gọi tài trợ công khai** ("Đồng hành cùng chương trình"), dành cho nhà hảo tâm / doanh nghiệp, có đầy đủ thông tin nhận ủng hộ.
2. **Báo giá VPP** → một section **minh bạch quà tặng** ("Bộ quà trao tận tay các em"), tóm tắt các nhóm quà và tổng giá trị.

Đối tượng của 2 section này là **nhà tài trợ**, khác với phần đăng ký/lệ phí (dành cho VĐV) đã có sẵn.

## 2. Phạm vi & phương án

- **Phương án chọn (A):** Thêm 2 section mới ở **cuối trang**, ngay **sau** section danh sách 82 học sinh (`#hoc-bong`) và **trước** `giai-footer`. Giữ nguyên toàn bộ nội dung hiện có.
- Mạch kể chuyện: *82 em cần giúp → các em sẽ nhận quà gì → cách bạn đồng hành*.
- Thứ tự: **① Bộ quà (VPP)** rồi **② Đồng hành & Tài trợ** (kết trang bằng lời kêu gọi).

Không đụng tới: hero, nhóm thi đấu, lệ phí/điều lệ, đăng ký, bảng 82 học sinh.

## 3. Dữ liệu

### 3.1 Bộ quà VPP (số liệu chốt theo yêu cầu người dùng, ghi đè số trong file Excel gốc)

| Nhóm | Bộ quà | Số HS | Đơn giá/phần (đ) | Thành tiền (đ) |
|---|---|---|---|---|
| Tiểu học | Bộ VPP Cấp 1 | 45 | 736.000 | 33.120.000 |
| THCS | Bộ VPP Cấp 2 | 23 | 670.000 | 15.410.000 |
| Mầm non | Phần quà sữa & bánh | 14 | 800.000 | 11.200.000 |
| Xe đạp (phần thưởng) | Xe đạp | 10 | 1.600.000 | 16.000.000 |
| **TỔNG CỘNG** | | **82 HS (+10 xe)** | | **75.730.000** |

- 3 dòng đầu (45+23+14 = 82) là quà học bổng theo cấp học.
- Xe đạp là **phần thưởng hiện vật** (10 chiếc), tách riêng về mặt ý nghĩa nhưng vẫn cộng vào tổng giá trị hiện vật.
- Tổng giá trị hiện vật: **75.730.000đ**.

Dữ liệu này tách ra file `qua-tang-data.ts` (theo mẫu `hoc-bong-data.ts`):

```ts
export interface GiftBundle {
  group: string;      // 'Tiểu học'
  bundle: string;     // 'Bộ VPP Cấp 1'
  count: number;      // 45
  unitPrice: number;  // 736000
  total: number;      // 33120000
  isReward?: boolean; // true cho Xe đạp
}
export const QUA_TANG_DATA: GiftBundle[];
export const QUA_TANG_TONG = 75730000;
```

### 3.2 Thông tin tài trợ (từ Thư Ngỏ)

- **Chương trình:** "Tiếp Bước Em Đến Trường" 2026 — gây quỹ từ Giải Cầu Lông Song Thạch Mở Rộng 2026 (Tranh cúp iStudio, lần thứ II).
- **Ý nghĩa:** Toàn bộ quỹ dành trọn trao học bổng cho HS mồ côi cha mẹ, sống cùng ông bà già yếu, hộ nghèo – cận nghèo nhưng vẫn kiên trì đến trường và học tốt.
- **Mục tiêu học bổng tiền mặt:** 82 suất × 800.000đ = **65.650.000đ** (theo Thư Ngỏ).
- **Kết quả 2025:** 200 VĐV tham gia, đã trao 67 suất / 40.000.000đ + nhiều hiện vật.
- **3 hình thức tài trợ:** tài trợ **tiền mặt** · tài trợ **hiện vật** (dụng cụ học tập, xe đạp…) · **trao học bổng trực tiếp**.
- **Thông tin nhận ủng hộ (hiển thị đúng như Thư Ngỏ):**
  - Chủ TK: **Hộ Kinh Doanh Song Thạch** — HKD Song Thạch
  - STK: **165099** (không có tên ngân hàng trong tài liệu — hiển thị đúng như vậy)
  - Nội dung CK: `Ho tro hoc bong Song Thach 2026 - [Tên nhà tài trợ]`
  - Người phụ trách: **Nguyễn Nhật Tân — 0378.99.09.79 (Zalo)**
- **Cam kết:** dùng đúng mục đích, minh bạch, công khai danh sách sau chương trình.

> Lưu ý: STK lệ phí thi đấu (VPBANK 0988918418 — Nguyễn Thị Thùy Linh) là **khác** với STK nhận ủng hộ. Hai section phải tách bạch rõ để tránh nhầm.

## 4. Thiết kế section

### ① Section "Bộ quà trao tận tay các em" — `#qua-tang`
- Nền `var(--cream2)` (đồng bộ section lệ phí).
- `.sec-head`: kicker "Quỹ giải dùng vào đâu" + h2 + mô tả ngắn về minh bạch.
- Lưới thẻ (tái dùng cảm giác thẻ `.grp`, class mới `.qt-card`): mỗi thẻ gồm icon, tên bộ quà, nhóm HS, số HS, đơn giá/phần, thành tiền. Thẻ Xe đạp gắn nhãn "Phần thưởng".
- Dòng tổng nổi bật: **Tổng giá trị quà & phần thưởng: 75.730.000đ**.
- Ghi chú nhỏ: chi tiết từng món (vở, bút, máy tính Casio…) theo bảng báo giá VPP; phần quà mầm non gồm sữa & bánh.

### ② Section "Đồng hành cùng chương trình" — `#tai-tro`
- Nền nổi bật giống section `.register` (terra/mustard) để tạo điểm nhấn CTA cuối trang.
- `.sec-head`: kicker "Tiếp Bước Em Đến Trường 2026" + h2 kêu gọi + đoạn ý nghĩa + mục tiêu **65.650.000đ** (kèm dòng nhắc kết quả 2025: 67 suất / 40 triệu).
- Hàng 3 hình thức tài trợ (tiền mặt / hiện vật / học bổng trực tiếp) dạng 3 ô icon.
- Thẻ thông tin nhận ủng hộ (`.pay` biến thể, class `.donate`): Chủ TK, STK, Nội dung CK, liên hệ Zalo. Nút "Liên hệ tài trợ (Zalo)" → `https://zalo.me/0378990979`.
- Dòng cam kết minh bạch ở cuối.

## 5. Thay đổi kỹ thuật

- **Thêm file:** `src/app/(public)/giai-cau-long-2026/qua-tang-data.ts` (dữ liệu 3.1).
- **Sửa `page.tsx`:** import `QUA_TANG_DATA`, `QUA_TANG_TONG`; thêm 2 `<section>` mới giữa `#hoc-bong` và `.giai-footer`. Định dạng tiền qua helper `formatVND(n)` (`n.toLocaleString('vi-VN')` + " đ").
- **Sửa `giai.css`:** thêm class `.qt-grid`, `.qt-card`, `.qt-total`, `.donate`, `.donate-forms` — tái dùng biến màu `--terra`, `--mustard`, `--cream2`, `--paper` sẵn có. Responsive: lưới quà 1 cột trên mobile, 2–4 cột desktop.
- Không thêm dependency. Không đổi route, không đổi component dùng chung.

## 6. Kiểm thử / xác minh

- `npm run build` pass (không lỗi type/lint).
- Chạy dev, mở `/giai-cau-long-2026`: 2 section mới hiển thị đúng thứ tự, số liệu khớp bảng 3.1 và tổng 75.730.000đ; thông tin STK 165099 / Hộ Kinh Doanh Song Thạch / Nguyễn Nhật Tân hiển thị đúng.
- Kiểm tra responsive mobile (lưới quà xuống 1 cột, thẻ tài trợ không tràn).
- Xác nhận STK lệ phí (section đăng ký) vẫn nguyên và không bị lẫn với STK tài trợ.

## 7. Ngoài phạm vi (YAGNI)

- Không làm bảng chi tiết từng sản phẩm trong mỗi bộ quà (chỉ tóm tắt 4 nhóm).
- Không nhúng toàn văn Thư Ngỏ / nút tải PDF (có thể bổ sung sau nếu cần).
- Không thêm QR chuyển khoản (có thể bổ sung sau khi có mã VietQR).
- Không sửa nav/menu neo (trang hiện không có nav neo nội bộ ngoài nút hero).
