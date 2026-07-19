# Design: CSDL VĐV & Hệ điểm trình độ (Rating Band) — songthach.com/giai-dau-rating

**Date:** 2026-07-19
**Type:** Tính năng mới, tích hợp vào Next.js + Supabase sẵn có
**Route gốc:** `songthach.com/giai-dau-rating`

---

## Mục tiêu

Xây nền móng cho hệ thống giải đấu phân trình độ của CLB Song Thạch: **cơ sở dữ liệu VĐV**
với trình độ A100–A500, sổ điểm minh bạch, trang quản trị để BTC nhập liệu, và bảng xếp hạng
công khai để cộng đồng giám sát (chống giấu trình).

Phần quản lý giải đấu — tạo giải, đăng ký cặp, nhập kết quả, tự cộng điểm — **sẽ là một spec
riêng sau**. Spec này cố ý thiết kế sao cho phần đó gắn vào được mà không phải đập đi xây lại.

**Ngoài phạm vi rõ ràng:** giải "Song Thạch Mở Rộng 2026" (phân theo nhóm tuổi, ở
`src/app/(public)/giai-cau-long-2026`) vẫn quản lý riêng, không đụng tới.

---

## Quyết định nền tảng

| Quyết định | Chốt |
|---|---|
| Kiến trúc | Tích hợp vào Next.js hiện tại (không tách subdomain, không dùng Notion) |
| Tài khoản VĐV | Không có. Admin nhập toàn bộ dữ liệu; VĐV chỉ xem |
| Mô hình điểm | Lưu riêng `band` và `progress_points` (không gộp một số) |
| Điểm hiệu dụng | `band + progress_points` — dùng để xếp hạng và (sau này) ghép cặp |
| Trần A500 | Không có A600. `progress_points` tiếp tục tăng để xếp hạng nội bộ nhóm mạnh |
| Hiển thị công khai | Tên/biệt danh + band + điểm + ảnh. **KHÔNG hiện SĐT** |
| Cộng điểm ở giai đoạn này | Admin nhập tay, bắt buộc kèm lý do, luôn ghi vào sổ |

---

## Luật điểm

**Cấu trúc.** Mỗi VĐV có `band` (100/200/300/400/500) và `progress_points`.
Điểm hiệu dụng = `band + progress_points`.

**Thăng hạng.** Khi `progress_points >= 100` và `band < 500`:
`band += 100`, `progress_points -= 100`. Lặp lại nếu vẫn còn ≥ 100.

**Trần.** Khi `band = 500`, KHÔNG thăng hạng nữa; `progress_points` tích lũy không giới hạn.

**Điểm không giảm qua thi đấu.** Không có cơ chế hạ hạng khi thua. Admin sửa được nhưng mọi
thay đổi ghi vào sổ kèm lý do — kể cả khi sửa sai sót nhập liệu (ghi bút toán âm, không xoá
lịch sử).

**Bút toán âm.** Khi trừ điểm mà `progress_points` không đủ, band **bị hạ xuống** tương ứng:
ví dụ A300 tiến độ 10, trừ 50 → A200 tiến độ 60. Đây là hành vi đúng vì bút toán âm chỉ dùng
để hoàn tác một lần cộng sai. Sàn tuyệt đối là **A100 tiến độ 0** — trừ quá thì dừng ở đó.

**Luật cộng điểm khi vô địch** (+100 người band cao, +50 người band thấp, cùng band thì cả hai
+100) đã chốt nhưng **thuộc spec giải đấu**. Giai đoạn này admin tự nhập con số tương ứng.
Hàm thăng hạng viết ở đây sẽ được spec đó dùng lại nguyên vẹn.

### Ví dụ kiểm chứng (dùng làm test case)

| Trước | Cộng | Sau |
|---|---|---|
| A300, tiến độ 60 | +100 | A400, tiến độ 60 |
| A300, tiến độ 60 | +50 | A400, tiến độ 10 |
| A100, tiến độ 90 | +60 | A200, tiến độ 50 |
| A100, tiến độ 0 | +450 | A500, tiến độ 50 |
| A500, tiến độ 30 | +100 | A500, tiến độ 130 |
| A200, tiến độ 40 | −40 (sửa nhập sai) | A200, tiến độ 0 |
| A300, tiến độ 10 | −50 (hoàn tác cộng sai) | A200, tiến độ 60 |

---

## Mô hình dữ liệu

Migration mới: `supabase/migrations/011_players_rating.sql`.

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
| `is_active` | BOOLEAN NOT NULL DEFAULT TRUE | tắt thay cho xoá |
| `created_at` | TIMESTAMPTZ DEFAULT NOW() | |

Index: `(is_active, band DESC, progress_points DESC)` cho bảng xếp hạng.

### `rating_events` — sổ điểm, append-only

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | UUID PK | |
| `player_id` | UUID NOT NULL → players | |
| `points` | INT NOT NULL | dương khi cộng, âm khi sửa sai |
| `reason` | TEXT NOT NULL | `initial` / `manual_adjust` |
| `note` | TEXT | bắt buộc khi `manual_adjust` |
| `created_at` | TIMESTAMPTZ DEFAULT NOW() | |

Cột `band`/`progress_points` ở `players` là số đã tính sẵn để truy vấn nhanh, nhưng **sổ này
là nguồn sự thật**. Cùng pattern với `point_transactions` trong `src/lib/points.ts`.

**Chừa chỗ cho spec giải đấu:** cột `tournament_id UUID NULL` và các giá trị `reason` khác
(`champion_high`, `champion_low`, `champion_equal`) sẽ thêm bằng migration sau — không phá vỡ
dữ liệu đã có. Vì vậy `reason` để kiểu TEXT thay vì ENUM.

### RLS

Bật RLS trên cả 2 bảng, theo nguyên tắc của `supabase/migrations/004_security_rls.sql`.

- Tạo view `players_public` — **không có cột `phone`**, chỉ `is_active = TRUE`
- Anon `SELECT` được: `players_public`, `rating_events`
- Anon **KHÔNG** đọc trực tiếp bảng `players`
- Mọi thao tác ghi đi qua API route dùng service-role, như các phần khác của site

---

## `src/lib/rating.ts`

Module thuần logic, không phụ thuộc Supabase — để test dễ và để spec giải đấu dùng lại.

- `applyPoints(band, progress, points)` → `{ band, progress }` — áp luật thăng hạng và trần A500
- `effectivePoints(player)` → `band + progress_points`
- `bandLabel(band)` → `"A300"`
- `replayLedger(events)` → cộng dồn từ đầu, dùng cho script đối soát

Hàm ghi vào CSDL nằm riêng (`src/lib/players.ts`): thêm dòng `rating_events` và cập nhật
`players.band` / `players.progress_points` trong cùng một thao tác.

---

## Trang quản trị

Thêm mục **"VĐV cầu lông"** vào sidebar `src/app/admin/layout.tsx`, route `/admin/players`.

**Danh sách VĐV** — bảng có tìm kiếm theo tên/SĐT, lọc theo band, lọc `is_active`.
Cột: ảnh, tên, biệt danh, SĐT, band, tiến độ, ngày test, trạng thái.

**Thêm/sửa VĐV** — form gồm họ tên, biệt danh, SĐT, ảnh (dùng lại luồng upload của
`/admin/media`), band ban đầu, ngày test trình, ghi chú test. Khi tạo mới, band ban đầu ghi
vào sổ với `reason = 'initial'`.

**Cộng/trừ điểm** — hộp thoại nhập số điểm + lý do (bắt buộc). Trước khi ghi, **hiện trước
kết quả**: "A300 tiến độ 60 → +50 → **A400 tiến độ 10**". Thao tác này khó hoàn tác nên phải
xem trước.

**Không có nút xoá VĐV** — chỉ bật/tắt `is_active`.

---

## Trang công khai

| Route | Nội dung |
|---|---|
| `/giai-dau-rating` | Trang chủ: top 10 bảng xếp hạng, giới thiệu ngắn hệ thống, link tới các mục |
| `/giai-dau-rating/bang-xep-hang` | Toàn bộ VĐV `is_active`, lọc theo band, sắp theo điểm hiệu dụng giảm dần. Cột: hạng, ảnh, tên, band, thanh tiến độ tới mốc 100 |
| `/giai-dau-rating/vdv/[id]` | Hồ sơ: ảnh, band, tiến độ, ngày test trình, **lịch sử điểm** từ `rating_events` |
| `/giai-dau-rating/the-le` | Thể lệ: rating band là gì, cách tính điểm hiệu dụng, cách thăng hạng, cách ghép cặp (giải thích luật), vì sao công khai lịch sử điểm |

Giao diện dùng lại hệ màu retro của site (cream / mustard / terra / ink, Baloo 2 + Nunito),
nhất quán với trang `giai-cau-long-2026`. Mobile-first.

**Huy hiệu "Kiện tướng CLB"** cần đếm số chức vô địch nên hoãn sang spec giải đấu. Giai đoạn
này A500 chỉ hiển thị như một band bình thường.

---

## Xử lý lỗi

| Rủi ro | Cách chặn |
|---|---|
| `band`/`progress` lệch so với sổ | Script đối soát chạy lại toàn bộ `rating_events` bằng `replayLedger`, so với cột đã lưu, báo chênh |
| Xoá VĐV đã có lịch sử | Không có nút xoá; khoá ngoại từ `rating_events` chặn cứng |
| Rò SĐT ra công khai | View `players_public` không có cột `phone`; anon không đọc được bảng gốc |
| Nhập band ngoài 100–500 | CHECK ở CSDL + validate ở API |
| Trừ điểm quá tay thành âm | `applyPoints` hạ band khi cần, kẹp sàn ở `band = 100, progress = 0`; CHECK `progress_points >= 0` giữ CSDL sạch |
| Trùng tên VĐV | Cho phép trùng `full_name`; admin phân biệt bằng SĐT và biệt danh. Cảnh báo (không chặn) khi tạo trùng tên |

---

## Kiểm thử

**Test trước (TDD) cho `src/lib/rating.ts`** — chỗ sai thì hỏng dữ liệu thật. Toàn bộ 6 dòng
trong bảng "Ví dụ kiểm chứng" ở trên thành test case, cộng thêm:

- Cộng 0 điểm → không đổi gì
- Trừ quá sàn (A100 tiến độ 0, −50) → vẫn A100 tiến độ 0
- `replayLedger` cộng dồn nhiều sự kiện ra đúng kết quả cuối

**Các trang UI:** kiểm tra bằng preview trên trình duyệt.

---

## Thứ tự triển khai

Mỗi bước chạy được độc lập.

1. Migration `011` + `src/lib/rating.ts` + test luật điểm
2. `src/lib/players.ts` + API route quản trị
3. Admin: danh sách + thêm/sửa VĐV — **nhập được dữ liệu thật vào**
4. Admin: cộng/trừ điểm có xem trước
5. Công khai: bảng xếp hạng
6. Công khai: hồ sơ VĐV + lịch sử điểm
7. Công khai: trang chủ + trang thể lệ

---

## Ngoài phạm vi

- **Toàn bộ phần giải đấu:** tạo giải, đăng ký cặp, form đăng ký công khai, duyệt lệ phí,
  nhập kết quả, tự cộng điểm khi vô địch, lịch sử giải, huy hiệu Kiện tướng CLB → **spec riêng**
- Sơ đồ thi đấu (bracket), tỷ số từng trận
- Tài khoản đăng nhập cho VĐV
- Giải "Song Thạch Mở Rộng 2026" phân theo nhóm tuổi
- Điểm giảm, hạ hạng qua thi đấu
- Ứng dụng di động
