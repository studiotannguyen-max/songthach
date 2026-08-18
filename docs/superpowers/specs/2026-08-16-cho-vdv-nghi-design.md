# Cho VĐV nghỉ / cho sinh hoạt lại

Ngày: 2026-08-16 · Nhánh: `feat/giao-dien-moi`

## Vấn đề

Danh sách `/admin/players` có bộ lọc "Đã nghỉ", API `PATCH /api/admin/players/[id]` có sẵn nhánh
`is_active`, và view công khai `players_public` đã lọc `WHERE is_active = TRUE`. Nhưng **không có
nút nào trong giao diện** để cho một VĐV nghỉ — cờ này không cách gì đổi được từ khu quản trị.

## Giải pháp

Thêm một khung "Trạng thái sinh hoạt" ở cuối trang hồ sơ VĐV (`/admin/players/[id]`), có một nút
đổi qua lại giữa **Cho nghỉ** và **Cho sinh hoạt lại**.

Cho nghỉ chỉ hạ cờ `is_active`: VĐV ẩn khỏi bảng xếp hạng công khai ngay, hồ sơ và sổ điểm giữ
nguyên, bật lại lúc nào cũng được. Không có xoá vĩnh viễn trong phạm vi này — chủ site quyết định
tách ra làm sau.

## Thành phần

### `src/app/admin/players/PlayerStatusPanel.tsx` (mới, client component)

| | |
|---|---|
| Nhận vào | `id`, `fullName`, `isActive`, `onDone` |
| Việc | Gọi `PATCH /api/admin/players/[id]` với `{ is_active: !isActive }` rồi báo `onDone()` |
| Phụ thuộc | `react-hot-toast` (giống các form khác trong khu quản trị) |

Chữ trong khung đổi theo trạng thái, giải thích rõ nghỉ nghĩa là gì để người dùng không tưởng đây là
xoá. Nút khoá lại trong lúc đang lưu. Lỗi thì `toast.error`, thành công thì `toast.success` kèm tên.

Không sửa API: nhánh `is_active` trong `PATCH` đã có sẵn và đúng.

### `src/app/admin/players/[id]/page.tsx` (sửa)

- Giữ bản ghi đầy đủ dưới kiểu `AdminPlayer = PlayerRecord & { is_active: boolean }`.
- Gắn `PlayerStatusPanel` xuống cuối trang, `onDone` gọi `reload()`.
- Hiện nhãn "Đã nghỉ" cạnh tên khi VĐV đang nghỉ.

## Bẫy bắt buộc phải xử cùng lúc

`PlayerForm` khởi tạo state từ nguyên bản ghi API trả về (`select('*')`, nên **có** `is_active`) rồi
gửi **toàn bộ** state đó khi bấm Lưu. Trước khi có tính năng này thì vô hại vì giá trị không đổi.
Sau khi có: cho VĐV nghỉ → mở form sửa tên → bấm Lưu → `is_active` cũ (`true`) còn trong state form
ghi đè ngược, VĐV sinh hoạt lại như chưa hề nghỉ. `PlayerForm` không tự khởi tạo lại state khi prop
đổi (`useState(initial)` chỉ đọc lần đầu), nên `reload()` cũng không cứu được.

Cách xử: hàm `toFormRecord()` trong trang hồ sơ, chỉ đưa cho `PlayerForm` những trường thuộc về nó.
Form không còn thấy `is_active` thì không thể gửi lên, và nhánh `typeof body.is_active === 'boolean'`
trong API không kích hoạt.

## Nghiệm thu

Không có test tự động: bộ vitest chạy `environment: node` và chỉ nhận `src/**/*.test.ts`, còn đây là
component gọi API. Nghiệm thu bằng tay, cần phiên đăng nhập admin:

1. Mở hồ sơ một VĐV → bấm **Cho nghỉ** → hiện toast, nhãn "Đã nghỉ" xuất hiện cạnh tên.
2. Mở `/giai-dau-rating/bang-xep-hang` → VĐV đó biến mất khỏi bảng.
3. Quay lại hồ sơ → sửa họ tên → bấm **Lưu** → mở lại hồ sơ, VĐV **vẫn** phải đang nghỉ
   (đây là phép thử cho cái bẫy ở trên).
4. Bấm **Cho sinh hoạt lại** → VĐV hiện lại trên bảng xếp hạng công khai.

## Không làm

- Không xoá vĩnh viễn (tách ra việc sau). Khi làm sẽ phải xoá `rating_events` trước rồi mới xoá
  `players`, vì khoá ngoại `rating_events.player_id` **không** có `ON DELETE CASCADE`.
- Không thêm nút cho nghỉ ngay trên hàng của danh sách — bắt mở hồ sơ để khỏi bấm nhầm dòng.
