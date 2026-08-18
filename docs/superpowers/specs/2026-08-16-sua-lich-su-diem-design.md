# Sửa & xoá dòng trong sổ điểm

Ngày: 2026-08-16 · Nhánh: `feat/giao-dien-moi`

## Vấn đề

Sổ `rating_events` chỉ có thao tác ghi thêm. Nhập nhầm một dòng — gõ `+500` thay vì `+50`, ghi sai lý
do, ghi thừa hẳn một dòng — thì không sửa được, chỉ có cách cộng/trừ bù, để lại sổ vừa sai vừa rối.

## Quyết định nền

Sau **bất kỳ** thay đổi nào lên sổ, trình độ VĐV được tính lại từ **toàn bộ sổ** bằng
`replayLedger()`, không cộng dồn kiểu `adjustPoints` hiện tại. Đây đúng nguyên tắc đã ghi trong
`src/lib/rating.ts`: *band/progress luôn suy ra được từ tổng điểm sổ*. Nhờ vậy sửa dòng cũ bao nhiêu
lần số liệu vẫn khớp sổ.

`adjustPoints` (thêm dòng mới) giữ nguyên, không đụng tới.

## Đánh đổi đã chấp nhận

Sổ hết còn là "chỉ ghi thêm, không sửa dòng cũ" như comment trong `011_players_rating.sql`. Sửa xong
không còn dấu vết dòng cũ từng tồn tại, kể cả với khách xem trang VĐV công khai. Chủ site đã cân
nhắc và chọn thế: CLB một người quản trị, ưu tiên sổ sạch hơn là vết kiểm toán. Hệ quả cần biết —
nếu sau này có tranh cãi về điểm của một VĐV thì không có gì để đối chiếu.

## Thành phần

### `src/lib/rating.ts` (thêm — hàm thuần, có test)

```ts
export function checkEventEdit(input: { reason: string; points: number; note: string }): string | null
export function canDeleteEvent(reason: string): boolean
```

`checkEventEdit` trả câu lỗi tiếng Việt, hoặc `null` nếu hợp lệ:

- điểm không phải số nguyên → `'Điểm phải là số nguyên'`
- lý do rỗng/toàn khoảng trắng → `'Bắt buộc nhập lý do'`
- dòng `initial` mà điểm < 100 → `'Xếp trình ban đầu không được dưới 100'`
- dòng khác `initial` mà điểm = 0 → `'Số điểm phải khác 0'`

`canDeleteEvent` trả `false` đúng với `reason === 'initial'`.

### `src/lib/players.ts` (thêm)

- `recalcFromLedger(admin, playerId)` — đọc hết `rating_events` của VĐV, `replayLedger`, ghi
  `band`/`progress_points` mới. Trả về giá trị mới.
- `updateRatingEvent(admin, playerId, eventId, { points, note })` — cập nhật dòng rồi
  `recalcFromLedger`.
- `deleteRatingEvent(admin, playerId, eventId)` — xoá dòng rồi `recalcFromLedger`.

Cả hai hàm sau đều lọc `.eq('player_id', playerId)` để không bao giờ chạm sổ của người khác.

### `src/app/api/admin/players/[id]/points/[eventId]/route.ts` (mới)

`PATCH` — sửa dòng:

1. `requireAdmin`
2. đọc dòng sổ theo `id` **và** `player_id` → không có thì 404 `'Không tìm thấy dòng sổ này'`
3. `checkEventEdit` → có lỗi thì 400 kèm đúng câu đó
4. `updateRatingEvent` → trả `{ band, progress_points }` mới

`DELETE` — xoá dòng: bước 1–2 như trên, rồi `canDeleteEvent` → `false` thì 400
`'Không xoá được dòng Xếp trình ban đầu — đó là điểm gốc của cả sổ'`, sau đó `deleteRatingEvent`.

### `src/app/admin/players/AdjustPointsPanel.tsx` (sửa)

Mỗi dòng trong "Lịch sử điểm" thêm nút **Sửa** và **Xoá**:

- Bấm Sửa → dòng đổi thành ô nhập số điểm + ô lý do, kèm nút Lưu / Huỷ. Hiện ngay trình độ sẽ thành
  gì sau khi sửa, tính tại chỗ bằng `replayLedger` trên sổ đã thay dòng đó — cùng kiểu ô xem trước
  đang có ở phần cộng/trừ điểm.
- Bấm Xoá → hỏi xác nhận ngay trong dòng (không dùng `confirm()` của trình duyệt), rồi gọi `DELETE`.
- Dòng "Xếp trình ban đầu" không hiện nút Xoá.
- Xong thì `toast` + `onDone()` để trang tải lại.

## Kiểm thử

Test mới trong `src/lib/rating.test.ts` cho `checkEventEdit` và `canDeleteEvent`: điểm không nguyên,
lý do rỗng, dòng initial dưới sàn, dòng thường bằng 0, ca hợp lệ, và `canDeleteEvent` với cả hai
loại dòng. `replayLedger` đã có test sẵn, không cần thêm.

Phần chạm CSDL không có test tự động (bộ vitest chạy `environment: node`, chỉ nhận
`src/**/*.test.ts`). Nghiệm thu tay, cần phiên đăng nhập admin:

1. Mở hồ sơ VĐV → cộng `+500` với lý do bất kỳ → trình độ nhảy vọt.
2. Bấm **Sửa** dòng vừa ghi, đổi thành `+50` → lưu → trình độ phải về đúng như cộng 50 ngay từ đầu.
3. Bấm **Xoá** dòng đó → trình độ phải về đúng lúc chưa cộng gì.
4. Dòng "Xếp trình ban đầu" phải **không** có nút Xoá; sửa số của nó thì trình độ đổi theo.
5. Mở `/giai-dau-rating/vdv/<id>` công khai → lịch sử và điểm khớp với khu quản trị.

## Không làm

- Không đụng `adjustPoints` (ghi dòng mới) — đang đúng.
- Không thêm cột "đã sửa lúc nào / ai sửa": chủ site đã chọn bỏ vết kiểm toán.
- Không cho sửa `reason` của dòng — chỉ số điểm và lý do.
