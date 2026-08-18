# Quản lý VĐV nữ — thang trình A100–A400

Ngày: 2026-08-16 · Nhánh: `feat/giao-dien-moi`

## Vấn đề

Hệ điểm hiện chỉ có một thang A100–A500, neo cứng trần 500 trong `deriveBandProgress()`. CLB cần
quản lý cả VĐV nữ, xếp theo thang **A100–A400**. Không có chỗ nào trong CSDL ghi giới tính.

## Quyết định

- Thêm cột `gender` vào `players`, giá trị `'nam' | 'nu'`, mặc định `'nam'` — mọi VĐV đang có thành
  nam, đúng ý chủ site.
- Trần hạng theo giới: nam 500, nữ 400. Chạm trần thì điểm cộng thêm dồn vào tiến độ, chạy không
  giới hạn — giống hệt cách A500 đang hoạt động bên nam.
- Quản trị: **một** trang `/admin/players` với bộ lọc Nam/Nữ/Tất cả, không tách menu.
- Công khai: bảng xếp hạng tách thành **hai khu xếp chồng** — VĐV Nam ở trên, VĐV Nữ ở dưới.
  (Ban đầu chốt một bảng chung có cột Giới tính; chủ site đổi ý ngày 2026-08-17 sau khi thấy thực
  tế. Tách khu đúng hơn: mỗi giới có thang trình riêng nên xếp chung là so sai chuẩn.)

## CSDL — `supabase/migrations/012_players_gender.sql`

```sql
ALTER TABLE players ADD COLUMN gender TEXT NOT NULL DEFAULT 'nam'
  CHECK (gender IN ('nam','nu'));

CREATE OR REPLACE VIEW players_public AS
  SELECT id, full_name, nickname, avatar_url, band, progress_points, tested_at, created_at, gender
  FROM players
  WHERE is_active = TRUE;
```

Cột `gender` thêm vào **cuối** danh sách cột của view — `CREATE OR REPLACE VIEW` của Postgres chỉ
cho nối thêm cột ở cuối, không cho chèn giữa hay đổi thứ tự.

**Chủ site phải tự chạy trong Supabase SQL Editor.** Code mới sẽ lỗi cho tới khi chạy xong.

## `src/lib/rating.ts` (sửa — hàm thuần, có test)

```ts
export type Gender = 'nam' | 'nu';
export const BAND_CEILING: Record<Gender, Band> = { nam: 500, nu: 400 };

export function bandsFor(gender: Gender): Band[]
export function deriveBandProgress(effective: number, gender: Gender): { band: Band; progress: number }
export function applyPoints(band: number, progress: number, delta: number, gender: Gender): { band: Band; progress: number }
export function replayLedger(events: { points: number }[], gender: Gender): { band: Band; progress: number; effective: number }
```

`gender` **bắt buộc**, cố tình không đặt giá trị mặc định: để trình biên dịch chỉ ra hết mọi chỗ gọi
thiếu, thay vì âm thầm tính theo thang nam.

`bandsFor('nam')` → `[100,200,300,400,500]`; `bandsFor('nu')` → `[100,200,300,400]`.

`deriveBandProgress` giữ nguyên sàn 100, chỉ đổi trần: `e >= BAND_CEILING[gender]` thì trả
`{ band: trần, progress: e - trần }`.

`checkEventEdit` và `canDeleteEvent` không đổi.

## `src/lib/players.ts` (sửa)

- `PlayerInput` thêm `gender: Gender`.
- `createPlayer` ghi `gender` vào hàng mới.
- `adjustPoints` và `recalcFromLedger` đọc thêm cột `gender` của VĐV rồi truyền xuống
  `applyPoints` / `replayLedger`.
- `commitImport` truyền `gender: 'nam'` cho mọi dòng (xem phần Không làm).

## API

- `POST /api/admin/players` — nhận `gender`, mặc định `'nam'` nếu thiếu; chặn giá trị lạ; hạng phải
  nằm trong `bandsFor(gender)`, sai thì 400 `'Mức trình không hợp lệ với giới tính đã chọn'`.
- `PATCH /api/admin/players/[id]` — nhận `gender`. Đổi giới tính xong thì gọi `recalcFromLedger` để
  quy lại hạng theo trần mới.
- `GET /api/admin/players` và `GET /api/players` — trả thêm cột `gender`.

## Quy tắc khi đổi giới tính

Trình độ được **tính lại từ sổ điểm theo trần mới**, không sửa sổ. VĐV nam A500 tiến độ 20 (hiệu
dụng 520) chuyển sang nữ thành **A400 tiến độ 120**: tổng điểm không đổi, chỉ đổi cách quy ra hạng.
Đổi ngược lại thì về đúng A500 tiến độ 20.

## Giao diện quản trị

- `PlayerForm` — thêm ô chọn Nam/Nữ. Danh sách hạng đổi theo lựa chọn (`bandsFor`). Đang để A500 mà
  chuyển sang nữ thì hạng tự hạ về A400 ngay trên form, để không gửi lên tổ hợp không hợp lệ.
- `/admin/players` — thêm cột Giới tính và ô lọc Nam / Nữ / Tất cả, đặt cạnh hai ô lọc sẵn có.

## Trang công khai

`/giai-dau-rating/bang-xep-hang` tách thành hai khu, mỗi khu là một `<BangXepHang>`:

| | VĐV Nam | VĐV Nữ |
|---|---|---|
| Bộ lọc hạng | Tất cả, A500 → A100 | Tất cả, A400 → A100 |
| Thứ hạng | đánh số từ 1 | đánh số từ 1, độc lập |
| Nền | trắng | `bg-bg-subtle` để phân tách |

Bộ lọc hạng dựng từ `bandsFor(gender)` nên khu nữ không bao giờ hiện A500. Không còn cột Giới tính —
tách khu rồi thì cột đó thừa.

`/giai-dau-rating/vdv/[id]` dùng `BAND_CEILING[player.gender]` để biết đã kịch trần chưa.

## Kiểm thử

`src/lib/rating.test.ts` cập nhật theo chữ ký mới, thêm các ca cho nữ:

- `deriveBandProgress(520, 'nu')` → `{ band: 400, progress: 120 }`; cùng số đó với `'nam'` →
  `{ band: 500, progress: 20 }`.
- `deriveBandProgress(400, 'nu')` → `{ band: 400, progress: 0 }`.
- `applyPoints(400, 50, 100, 'nu')` → `{ band: 400, progress: 150 }` (không có A500 để lên).
- `replayLedger` cùng bộ sự kiện cho ra hạng khác nhau giữa hai giới.
- `bandsFor('nu')` không chứa 500; `bandsFor('nam')` đủ 5 hạng.
- Sàn A100 giữ nguyên cho cả hai giới.

Phần chạm CSDL không có test tự động. Nghiệm thu tay sau khi chạy migration:

1. VĐV cũ đều hiện **Nam**, hạng và điểm không đổi.
2. Thêm VĐV nữ A300 → lưu được; ô chọn hạng của nữ **không** có A500.
3. Cộng điểm cho nữ A400 vượt trần → hạng đứng A400, tiến độ tăng tiếp.
4. Đổi một VĐV nam A500 tiến độ 20 sang nữ → thành A400 tiến độ 120; đổi ngược lại về đúng cũ.
5. Bộ lọc Nam/Nữ/Tất cả lọc đúng; cột Giới tính hiện đúng.
6. Bảng xếp hạng công khai có hai khu Nam/Nữ, khu nữ không có nút lọc A500, số liệu khớp khu quản trị.

## Không làm

- **Nhập Excel không có cột giới tính.** Mọi dòng nhập vào là nam. Trang `/admin/players/nhap-excel`
  hiện một dòng cảnh báo rõ điều này, sửa tay sau nếu cần. Thêm cột vào đó phải sửa
  `player-import.ts` cùng 25 test của nó — tách thành việc riêng.
- Không tách menu quản trị, không tách bảng xếp hạng công khai.
- Không đụng `checkEventEdit`, `canDeleteEvent`, hay cơ chế sửa/xoá dòng sổ vừa làm.
