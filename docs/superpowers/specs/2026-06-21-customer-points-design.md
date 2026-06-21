# Hệ thống tích điểm cho tài khoản khách hàng

## Bối cảnh

Chủ quán muốn khuyến khích khách tạo tài khoản (hiện đăng nhập bằng magic-link OTP, không bắt buộc khi đặt sân) bằng cách: có tài khoản thì được tích điểm khi đặt sân, dùng điểm để giảm giá ở lần đặt sau.

Phát hiện trong lúc khảo sát: nút "Thông tin tài khoản" trên menu (Navbar) đang trỏ tới `/profile` — route này **chưa tồn tại** (404). Đây là nơi hợp lý để hiện điểm tích lũy, nên sẽ tạo luôn trong phần này.

## Phạm vi

- **Chỉ áp dụng cho đặt sân bóng đá/cầu lông qua web** (bảng `bookings`). Café thanh toán qua KiotViet (hệ thống riêng), tư vấn tiệc cưới chưa có bước thanh toán trên web — không tích điểm được cho 2 dịch vụ này ở giai đoạn này.
- Khách **phải đăng nhập** (có `user_id` gắn với booking) mới tích/dùng điểm. Đặt sân không đăng nhập (khách vẫn được phép, giữ nguyên hành vi hiện tại) sẽ không tích điểm.

## Cơ chế

- **Tỷ lệ tích:** 10.000đ giá trị đặt sân **gốc** (`total_price`, trước khi trừ điểm) = 1 điểm.
- **Thời điểm tích:** khi admin chuyển trạng thái booking sang `confirmed` (giống thời điểm phát voucher nước hiện tại — tái dùng đúng pattern đó).
- **Tỷ lệ đổi:** 1 điểm = 1.000đ khi dùng để giảm giá.
- **Giới hạn dùng:** được dùng tối đa 100% giá trị đặt sân (nếu đủ điểm, có thể đặt sân 0đ).
- **Không hết hạn.**
- Nếu booking sau đó bị huỷ: **không tự hoàn điểm đã trừ** ở giai đoạn này (ghi rõ là hạn chế biết trước, xử lý tay nếu cần — xem mục Ngoài phạm vi).

## Thiết kế kỹ thuật

### Dữ liệu

Bảng mới `point_transactions` (sổ ghi điểm — không lưu số dư rời rạc, tính bằng tổng các dòng để tránh lệch số):
```
id            UUID PK
user_id       UUID NOT NULL REFERENCES users(id)
booking_id    UUID REFERENCES bookings(id)
type          VARCHAR(10) CHECK (type IN ('earn', 'redeem'))
points        INT NOT NULL          -- dương cho earn, âm cho redeem
note          VARCHAR(200)
created_at    TIMESTAMPTZ DEFAULT NOW()
```

Thêm 2 cột vào `bookings`:
- `points_used INT DEFAULT 0` — số điểm khách dùng cho booking này.
- `points_discount_amount NUMERIC(10,2) DEFAULT 0` — số tiền được giảm (= points_used × 1000).

`total_price` **giữ nguyên là giá gốc** (không trừ điểm) — để vẫn dùng làm cơ sở tính điểm tích sau này. Số tiền khách **thực phải trả** = `total_price - points_discount_amount`; các nơi hiển thị "tổng tiền" cho khách/admin cần hiện số này, không phải `total_price` thô.

### Luồng tích điểm (sửa `PATCH /api/admin/bookings/[id]`)

Khi `status` chuyển thành `confirmed` và booking có `user_id`: thêm 1 dòng `point_transactions` (`type='earn'`, `points = floor(total_price / 10000)`). Đặt trong cùng khối try/catch với việc phát voucher hiện có — lỗi tích điểm không chặn việc xác nhận booking (đúng tinh thần code hiện tại).

### Luồng dùng điểm (sửa `POST /api/bookings`)

Thêm field `points_used` (tuỳ chọn, mặc định 0) vào payload đặt sân:
- Nếu `points_used > 0` mà chưa đăng nhập → lỗi "Cần đăng nhập để dùng điểm tích lũy".
- Tính số dư điểm hiện tại của user (tổng các dòng `point_transactions`).
- Validate: `points_used <= số dư` và `points_used * 1000 <= total_price`.
- Lưu `points_used`, `points_discount_amount` vào booking khi insert.
- Sau khi insert booking thành công, ghi 1 dòng `point_transactions` (`type='redeem'`, `points = -points_used`) nếu `points_used > 0`.

### UI cần sửa

- **Trang đặt sân** (`/sports/football`, `/sports/badminton`): ở bước xem lại trước khi đặt, nếu khách đã đăng nhập → hiện số điểm hiện có + ô chọn dùng bao nhiêu điểm (tự tính lại số tiền phải trả). Nếu chưa đăng nhập → hiện dòng nhỏ "Đăng nhập để tích & dùng điểm" link tới `/login`.
- **API mới** `GET /api/points/balance` — trả số dư điểm của user đang đăng nhập (dùng cho UI trên + trang profile).
- **Trang `/profile`** (mới, đang là link chết) — hiện tên/email khách, số điểm hiện có, lịch sử điểm (earn/redeem) lấy từ `point_transactions`.
- **Trang admin đặt sân** (`/admin/bookings`): cột "Tổng tiền" hiện thêm số điểm đã dùng (nếu có) để nhân viên biết số thực thu là `total_price - points_discount_amount`, không thu nhầm giá gốc.

## Ngoài phạm vi (làm sau)

- Tự hoàn điểm khi booking bị huỷ sau khi đã trừ điểm.
- Tích điểm cho café (KiotViet) và tiệc cưới — cần có bước thanh toán trên web trước.
- Banner/marketing quảng bá "tạo tài khoản để tích điểm" ở trang chủ hoặc lúc đăng nhập.
- Race condition khi 2 booking dùng điểm gửi đồng thời (chấp nhận rủi ro thấp do quy mô 1 địa điểm, không khoá giao dịch ở mức DB).
