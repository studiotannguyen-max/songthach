# Lock chéo Sân 7A ↔ Sân 5A/5B

## Bối cảnh

Sân bóng đá tại Song Thạch có 3 sân 5 người (`fb5-1` Sân 5A, `fb5-2` Sân 5B, `fb5-3` Sân 5C) và 1 sân 7 người (`fb7-1` Sân 7A). Về mặt vật lý, Sân 7A nằm chung diện tích với Sân 5A + Sân 5B (Sân 5C tách biệt, không liên quan). Hiện hệ thống kiểm tra trùng lịch và hiển thị slot đã đặt chỉ theo từng `court_id` riêng lẻ, nên có thể xảy ra double-book thực tế: khách đặt Sân 7A cùng giờ một khách khác đã đặt Sân 5A.

## Yêu cầu đã chốt

- Đặt Sân 7A ở một khung giờ → khoá (không cho đặt) Sân 5A và Sân 5B ở khung giờ đó, và ngược lại — đặt Sân 5A hoặc Sân 5B → khoá Sân 7A (lock 2 chiều).
- Sân 5C không nằm trong nhóm lock này.
- Áp dụng cho mọi đường tạo booking: khách đặt online (`POST /api/bookings`) và admin tạo/đặt định kỳ (`POST /api/admin/bookings/recurring`). Không có cơ chế admin override.
- Khoá bảo trì (`court_blocks`) trên một sân trong nhóm cũng phải lan sang sân liên kết — nếu Sân 5A đang bị block bảo trì, Sân 7A cũng không đặt được trong khung giờ đó.
- Hiển thị cho khách: slot bị khoá do sân liên kết hiển thị giống hệt slot đã được đặt bình thường (không có nhãn/giải thích riêng).
- Không có schema DB mới, không có dữ liệu cần dọn dẹp khi booking bị huỷ — trạng thái lock phải luôn được suy ra trực tiếp từ dữ liệu `bookings`/`court_blocks` hiện có tại thời điểm truy vấn.

## Thiết kế

### 1. Config nhóm lock — `src/lib/court-locks.ts` (file mới)

```ts
const COURT_LOCK_GROUPS: Record<string, string[]> = {
  'fb7-1': ['fb5-1', 'fb5-2'],
  'fb5-1': ['fb7-1'],
  'fb5-2': ['fb7-1'],
};

// Trả về court_id gốc + các court_id bị lock chéo với nó (nếu có)
export function getLockGroupCourtIds(courtId: string): string[] {
  return [courtId, ...(COURT_LOCK_GROUPS[courtId] ?? [])];
}
```

Hardcode tĩnh, đặt cạnh các hằng số sân khác (`COURTS_5`/`COURTS_7` trong `src/app/(public)/sports/football/page.tsx`) — không cần bảng DB vì danh sách sân của venue này cố định và đã hardcode sẵn ở nơi khác.

### 2. `GET /api/bookings/route.ts` — hiển thị slot cho widget

Hiện tại lọc theo `eq('court_id', court_id)` cho cả truy vấn `bookings` và `court_blocks`. Đổi thành `in('court_id', getLockGroupCourtIds(court_id))` cho cả hai truy vấn. Kết quả `booked_slots`/`blocked_slots` trả về sẽ tự động gồm cả các slot bị bận do sân liên kết — không cần đổi gì ở phần tính toán phía sau hay ở component `BookingWidget`.

### 3. `POST /api/bookings/route.ts` — tạo booking của khách

- Conflict check (dòng ~148-160): đổi `.eq('court_id', court_id)` → `.in('court_id', getLockGroupCourtIds(court_id))`.
- Maintenance block check (dòng ~163-176): đổi truy vấn `court_blocks` tương tự, dùng `getLockGroupCourtIds(court_id)`.
- Thông báo lỗi giữ nguyên y như hiện tại ("Khung giờ này đã có người đặt..." / "Sân đang bảo trì...") — không cần phân biệt lý do.

### 4. `POST /api/admin/bookings/recurring/route.ts` — admin đặt tay/định kỳ

Cả hai truy vấn lấy dữ liệu để check trùng theo từng ngày (`existing` bookings và `blocks`) hiện lọc `eq('court_id', court_id)` — đổi thành `in('court_id', getLockGroupCourtIds(court_id))`. Logic `overlaps()`/loop theo `dates` giữ nguyên, vì việc check trùng vẫn dựa trên from `booking_date`/`block_date` như cũ, chỉ mở rộng tập `court_id` được xét.

### Không đổi

- Giá tiền (`calculateBookingPrice`), email/Telegram notification, schema DB, UI/copy hiển thị cho khách.
- Sân 5C không bị ảnh hưởng bởi nhóm lock này.

## Kiểm thử

Vì project không có test framework, xác minh thủ công/qua API (giống cách đã làm trước đây cho booking flow):
1. Đặt Sân 7A khung giờ X → gọi `GET /api/bookings?court_id=fb5-1&date=...` và `fb5-2` phải trả về slot X nằm trong `booked_slots`.
2. Thử `POST /api/bookings` đặt Sân 5A khung giờ X sau khi Sân 7A đã đặt → phải trả 409.
3. Thử ngược lại: đặt Sân 5B trước, sau đó đặt Sân 7A cùng giờ → phải trả 409.
4. Đặt Sân 5C cùng giờ X (không liên quan nhóm lock) → phải thành công bình thường, không bị ảnh hưởng bởi Sân 7A.
5. Tạo `court_blocks` bảo trì cho Sân 5A trong khung giờ X → thử đặt Sân 7A khung giờ X qua `POST /api/bookings` → phải bị chặn (409 "đang bảo trì").
6. Test tương tự qua `POST /api/admin/bookings/recurring` cho ít nhất 1 ngày trong loạt — phải nằm trong danh sách `skipped` khi có xung đột chéo nhóm.
7. Huỷ booking Sân 7A vừa tạo ở bước 1 → gọi lại `GET /api/bookings?court_id=fb5-1` → slot X phải trở lại trạng thái trống (không có dữ liệu rác sót lại).
