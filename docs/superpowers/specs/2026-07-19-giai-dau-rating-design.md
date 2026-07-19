# Design: Hệ thống Giải đấu Phân trình độ (Rating Band) — songthach.com/giai-dau-rating

**Date:** 2026-07-19
**Type:** Tính năng mới, tích hợp vào Next.js + Supabase sẵn có
**Route gốc:** `songthach.com/giai-dau-rating`

---

## Mục tiêu

Quản lý các giải cầu lông nội bộ của CLB Song Thạch theo hệ thống phân trình độ A100–A500.
Cặp đôi được ghép sao cho tổng điểm không vượt hạn mức công bố của giải, để mọi cặp có cơ hội
thắng ngang nhau. Điểm chỉ tăng, lịch sử công khai để cộng đồng giám sát, chống giấu trình
(sandbagging).

**Phạm vi:** CHỈ phục vụ giải nội bộ theo rating band. Giải "Song Thạch Mở Rộng 2026" (phân
theo nhóm tuổi, ở `src/app/(public)/giai-cau-long-2026`) vẫn quản lý riêng, hệ thống này không
đụng tới.

---

## Quyết định nền tảng

| Quyết định | Chốt |
|---|---|
| Kiến trúc | Tích hợp vào Next.js hiện tại (không tách subdomain, không dùng Notion) |
| Tài khoản VĐV | Không có. Admin nhập toàn bộ dữ liệu; VĐV chỉ xem |
| Đăng ký giải | Form công khai không cần login, admin duyệt sau khi nhận lệ phí |
| Trận đấu | Chỉ nhập kết quả chung cuộc (Vô địch / Á quân / Hạng ba). Không có bracket |
| Mô hình điểm | Lưu riêng `band` và `progress_points` (không gộp một số) |
| Ghép cặp | Tổng điểm hiệu dụng = `band + progress_points` của cả hai người |
| Trần A500 | Không có A600. `progress_points` tiếp tục tăng để xếp hạng nội bộ nhóm mạnh |
| Hiển thị công khai | Tên/biệt danh + band + điểm + ảnh. **KHÔNG hiện SĐT** |

---

## Luật điểm (nguồn sự thật của hệ thống)

**Cấu trúc điểm.** Mỗi VĐV có `band` (100/200/300/400/500) và `progress_points`.
Điểm hiệu dụng = `band + progress_points`.

**Cộng điểm.** Chỉ cộng khi cặp **vô địch** (hạng Nhất). Á quân và hạng ba không được điểm.

- Hai người **khác band**: người band cao hơn **+100**, người band thấp hơn **+50**
- Hai người **cùng band**: **cả hai +100** (không ai gánh ai)

**Thăng hạng.** Khi `progress_points >= 100` và `band < 500`:
`band += 100`, `progress_points -= 100`. Lặp lại nếu vẫn còn ≥ 100.

**Trần.** Khi `band = 500`, KHÔNG thăng hạng nữa; `progress_points` tích lũy không giới hạn.

**Danh hiệu "Kiện tướng CLB".** Hiển thị cho VĐV có `band = 500` VÀ có ít nhất một
`rating_events` với `reason` bắt đầu bằng `champion_` mà **tại thời điểm ghi, band đã là 500**
(tức sự kiện chỉ làm tăng `progress_points`, không đổi band). Xác định bằng cách chạy lại sổ
theo thứ tự `created_at` — không lưu cột riêng.

**Điểm không bao giờ giảm** qua thi đấu. Chỉ admin mới điều chỉnh được, và mọi điều chỉnh
đều ghi vào sổ kèm lý do.

### Ví dụ kiểm chứng (dùng làm test case)

| Trước | Sự kiện | Sau |
|---|---|---|
| A300, tiến độ 60 | Vô địch, vai trò band cao | A400, tiến độ 60 |
| A300, tiến độ 60 | Vô địch, vai trò band thấp | A400, tiến độ 10 |
| A200, tiến độ 0 | Vô địch cùng band với A200 khác | A300, tiến độ 0 (cả hai) |
| A500, tiến độ 30 | Vô địch, vai trò band cao | A500, tiến độ 130 |
| A100, tiến độ 90 | Điều chỉnh tay +60 | A200, tiến độ 50 |

---

## Mô hình dữ liệu

Migration mới: `supabase/migrations/011_tournament_rating.sql`.

### `players` — hồ sơ VĐV

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | UUID PK | |
| `full_name` | TEXT NOT NULL | |
| `nickname` | TEXT | tên hiển thị ưu tiên nếu có |
| `phone` | TEXT | **chỉ admin thấy**; phân biệt người trùng tên |
| `avatar_url` | TEXT | admin upload; trống thì hiện chữ cái đầu |
| `band` | INT NOT NULL | CHECK IN (100,200,300,400,500) |
| `progress_points` | INT NOT NULL DEFAULT 0 | CHECK >= 0 |
| `tested_at` | DATE | ngày test trình tại sân |
| `test_note` | TEXT | ghi chú đánh giá |
| `is_active` | BOOLEAN DEFAULT TRUE | tắt thay cho xoá |
| `created_at` | TIMESTAMPTZ | |

Index: `(is_active, band DESC)` cho bảng xếp hạng.

### `rating_events` — sổ điểm, append-only

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | UUID PK | |
| `player_id` | UUID → players | |
| `tournament_id` | UUID → tournaments, NULL được | NULL cho `initial`/`manual_adjust` |
| `points` | INT NOT NULL | |
| `reason` | TEXT NOT NULL | `initial` / `champion_high` / `champion_low` / `champion_equal` / `manual_adjust` |
| `note` | TEXT | bắt buộc khi `manual_adjust` |
| `created_at` | TIMESTAMPTZ | |

UNIQUE `(player_id, tournament_id)` khi `tournament_id IS NOT NULL` — chặn cộng điểm hai lần.

Cột `band`/`progress_points` ở `players` là số đã tính sẵn để truy vấn nhanh, nhưng **sổ này
là nguồn sự thật**. Cùng pattern với `point_transactions` trong `src/lib/points.ts`.

### `tournaments` — giải đấu

| Cột | Ghi chú |
|---|---|
| `id` | UUID PK |
| `name`, `slug` | slug UNIQUE, dùng cho URL |
| `event_date` | ngày thi đấu |
| `venue` | địa điểm |
| `tier_max_points` | INT — hạn tổng điểm công bố, ví dụ 600 |
| `entry_fee` | INT — lệ phí mỗi cặp (VNĐ) |
| `status` | `draft` / `open` / `closed` / `finished` |
| `description` | thể thức, ghi chú của BTC |
| `poster_url` | ảnh giải |
| `created_at` | |

### `tournament_entries` — cặp đăng ký

| Cột | Ghi chú |
|---|---|
| `id` | UUID PK |
| `tournament_id` | → tournaments |
| `player1_id`, `player2_id` | → players; CHECK khác nhau |
| `total_points` | INT — **chốt cứng tại thời điểm đăng ký** |
| `status` | `pending` / `approved` / `rejected` |
| `placement` | `champion` / `runner_up` / `third` / NULL |
| `contact_phone` | SĐT liên hệ, chỉ admin thấy |
| `note` | |
| `created_at` | |

`total_points` chốt cứng để một VĐV thăng hạng ở giải khác không làm vô hiệu cặp đã duyệt.

Ràng buộc: UNIQUE `(tournament_id, placement)` khi `placement = 'champion'` — mỗi giải chỉ
một nhà vô địch.

### RLS

Bật RLS trên cả 4 bảng, theo đúng nguyên tắc của `supabase/migrations/004_security_rls.sql`.

- Tạo view `players_public` — **không có cột `phone`**, chỉ `is_active = TRUE`
- Anon `SELECT` được: `players_public`, `tournaments` (trừ `draft`), `tournament_entries`
  đã `approved`, `rating_events`
- Anon KHÔNG đọc trực tiếp bảng `players`
- Mọi thao tác ghi đi qua API route dùng service-role, như các phần khác của site

---

## Các trang công khai

| Route | Nội dung |
|---|---|
| `/giai-dau-rating` | Trang chủ: giải sắp diễn ra, top 10 BXH, link các mục |
| `/giai-dau-rating/bang-xep-hang` | Toàn bộ VĐV, lọc theo band, sắp theo điểm hiệu dụng giảm dần. Cột: hạng, ảnh, tên, band, thanh tiến độ tới mốc 100, số chức vô địch. Huy hiệu Kiện tướng CLB |
| `/giai-dau-rating/vdv/[id]` | Hồ sơ: ảnh, band, tiến độ, ngày test trình, lịch sử điểm từ `rating_events`, giải đã dự + thành tích |
| `/giai-dau-rating/giai-dau` | Lịch giải: sắp diễn ra (hạng công bố, lệ phí, nút Đăng ký) + đã kết thúc |
| `/giai-dau-rating/giai-dau/[slug]` | Chi tiết giải: thể thức, danh sách cặp đã duyệt kèm tổng điểm, kết quả nếu đã xong |
| `/giai-dau-rating/the-le` | Thể lệ: rating band, ghép cặp, thăng hạng, chống giấu trình |

Giao diện dùng lại hệ màu retro của site (cream / mustard / terra / ink, Baloo 2 + Nunito),
nhất quán với trang `giai-cau-long-2026`. Mobile-first.

---

## Luồng đăng ký cặp (công khai, không login)

1. Bấm **Đăng ký** ở trang giải có `status = 'open'`
2. Chọn 2 VĐV bằng ô tìm kiếm (gõ tên → gợi ý). Chỉ hiện người `is_active`
3. Hiện ngay kết quả tính: `A300 (340) + A200 (210) = 550 / hạn 600` kèm ✅ hoặc ❌ quá hạn
4. Nhập SĐT liên hệ → gửi. Bản ghi vào `pending`
5. Hiện thông tin chuyển khoản lệ phí + Zalo BTC
6. Admin nhận tiền → **Duyệt** → cặp xuất hiện công khai ở trang giải

**Chặn lạm dụng:**

- Vượt hạn điểm: **server từ chối**, không chỉ ẩn nút
- Trùng: một VĐV chỉ có 1 đăng ký `pending` hoặc `approved` mỗi giải
- Rate-limit qua `src/lib/rate-limit.ts` sẵn có
- Báo Telegram cho BTC khi có đăng ký mới, qua `src/lib/telegram.ts`
- Kiểm tra `status = 'open'` ở server, không tin trạng thái nút bấm

---

## Trang quản trị

Thêm mục **"Giải đấu rating"** vào sidebar `src/app/admin/layout.tsx`,
route `/admin/giai-dau-rating`, gồm 3 tab:

**VĐV** — thêm/sửa hồ sơ, upload ảnh, đặt band ban đầu + ghi chú test trình,
điều chỉnh điểm tay (bắt buộc nhập lý do, luôn ghi vào sổ).

**Giải đấu** — tạo giải, đặt `tier_max_points`, đổi trạng thái
`draft → open → closed → finished`.

**Đăng ký & Kết quả** — duyệt/từ chối cặp; sau giải chọn cặp Vô địch. Trước khi ghi,
hộp xác nhận **hiện rõ ai được +100, ai +50, band mới là gì**. Đây là thao tác khó hoàn tác.

---

## Xử lý lỗi

| Rủi ro | Cách chặn |
|---|---|
| Bấm "Vô địch" hai lần → cộng điểm đôi | UNIQUE `(player_id, tournament_id)` trên `rating_events`; hàm cộng điểm kiểm tra tồn tại trước khi ghi — **idempotent** |
| `band`/`progress` lệch so với sổ | Script đối soát cộng lại toàn bộ `rating_events` từ điểm khởi tạo, so với cột đã lưu, báo chênh |
| Xoá VĐV đã có lịch sử | Không cho xoá — chỉ `is_active = false`. Khoá ngoại chặn cứng |
| Đăng ký khi giải đã đóng | Kiểm tra `status` ở server |
| Rò SĐT ra công khai | View `players_public` không có cột `phone`; anon không đọc được bảng gốc |
| Cặp đăng ký trùng người | CHECK `player1_id <> player2_id` + kiểm tra trùng ở tầng API |

---

## Kiểm thử

**Test trước (TDD) cho `src/lib/rating.ts`** — chỗ sai thì hỏng dữ liệu thật:

- Khác band → +100 / +50 đúng người
- Cùng band → cả hai +100
- Tiến độ 60 + 50 → thăng band, còn 10
- A500 +100 → vẫn A500, tiến độ 130
- Cộng điểm hai lần cho cùng (VĐV, giải) → chỉ ghi một lần
- Tiến độ 90 + điều chỉnh tay 60 → thăng band, còn 50

**Test riêng cho validate ghép cặp:** đúng hạn, vượt hạn 1 điểm, VĐV không `is_active`,
trùng người, giải không `open`.

**Các trang UI:** kiểm tra bằng preview trên trình duyệt.

---

## Thứ tự triển khai

Mỗi bước chạy được độc lập, không phải chờ tới bước cuối.

1. Migration `011` + `src/lib/rating.ts` + test luật điểm
2. Admin: quản lý VĐV — nhập được dữ liệu thật vào
3. Công khai: bảng xếp hạng + hồ sơ VĐV
4. Admin: tạo giải + công khai lịch giải
5. Form đăng ký công khai + duyệt ở admin
6. Nhập kết quả + tự cộng điểm — **rủi ro nhất, làm cuối khi mọi thứ đã ổn định**
7. Trang thể lệ + trang chủ hệ thống

---

## Ngoài phạm vi

- Sơ đồ thi đấu (bracket), tỷ số từng trận, vòng bảng
- Tài khoản đăng nhập cho VĐV
- Giải "Song Thạch Mở Rộng 2026" phân theo nhóm tuổi
- Thanh toán lệ phí online (vẫn chuyển khoản thủ công + admin duyệt)
- Điểm giảm, hạ hạng
- Ứng dụng di động
