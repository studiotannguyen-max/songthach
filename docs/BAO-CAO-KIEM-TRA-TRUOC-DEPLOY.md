# Báo cáo kiểm tra toàn bộ luồng đặt sân — trước deploy Long Vân

> Ngày kiểm tra: 10/06/2026. Phương pháp: chạy e2e thật trên Next.js dev server với mock Supabase (giả lập PostgREST + Auth), 20 ca kiểm thử qua HTTP.

## 1. Kết quả kiểm thử

### Luồng khách đặt sân (public) — `/api/bookings` + BookingWidget

| Ca kiểm thử | Kết quả |
|---|---|
| Xem slot trống theo sân/ngày | ✅ 200, trả đúng `booked_slots` + `blocked_slots` |
| Đặt sân hợp lệ 06:00–07:00 | ✅ 201, mã BK-xxx, giá server tự tính (50.000đ/h) |
| Slot bị chiếm hiển thị đúng (mở rộng theo bước 30') | ✅ 06:00 + 06:30 |
| Đặt khung giờ KHÁC cùng ngày (08:00) | ❌ → ✅ **Lỗi nghiêm trọng, đã sửa** (xem mục 2) |
| Đặt trùng giờ (06:30) | ✅ 409 từ chối |
| Đặt 07:00 kéo dài 1,5h chạm mép booking 08:00 | ✅ 409 từ chối |
| Đặt ngày quá khứ | ✅ 400 |
| SĐT không hợp lệ | ✅ 400 |
| 21:00 + 2h vượt giờ đóng cửa 22:00 | ✅ 400 |
| Spam >5 lượt đặt/phút cùng IP | ✅ 429 (rate limit hoạt động) |
| Client gửi `total_price` giả | ✅ Server bỏ qua, tự tính lại |

### Quản lý khách đặt sân (admin) — `/admin/bookings` + API admin

| Ca kiểm thử | Kết quả |
|---|---|
| Gọi API admin khi chưa đăng nhập | ✅ 401 |
| Đăng nhập admin → xem danh sách booking (đủ tên/SĐT/email/giá) | ✅ 200 |
| Lọc theo trạng thái `?status=confirmed` | ✅ đúng dữ liệu |
| PATCH xác nhận booking (pending → confirmed) | ✅ 200 |
| PATCH trạng thái không hợp lệ | ✅ 400 |
| Tạo lịch cố định 4 tuần (thứ 6, 18:00–20:00) | ✅ 201, tạo 4 booking, gắn `recurring_id` |
| Slot lịch cố định chiếm chỗ trên widget khách | ✅ 18:00–20:00 hiện "Đã đặt" |
| Khoá sân bảo trì 14:00–16:00 | ✅ 201; khách đặt 15:00 bị 409; widget hiện "Bảo trì" |

TypeScript toàn dự án: `tsc --noEmit` — **0 lỗi**.

## 2. Lỗi nghiêm trọng đã phát hiện & sửa

**File:** `src/app/api/bookings/route.ts` (kiểm tra trùng lịch khi POST)

Điều kiện cũ `.or('start_time.gte.X, start_time.lt.Y')` luôn đúng với MỌI booking cùng sân/ngày → hễ sân có 1 lượt đặt trong ngày thì **mọi khung giờ khác đều bị báo "đã có người đặt" (409)**. Khách không thể đặt lượt thứ 2 trong ngày — mất doanh thu trực tiếp.

Đã thay bằng điều kiện giao khoảng chuẩn: `existing.start < new.end AND existing.end > new.start` (`.lt('start_time', end_time).gt('end_time', start_time)`). Đã re-test: đặt 2 khung giờ khác nhau cùng ngày → cả hai 201; mọi ca trùng/chạm mép → 409.

## 3. File mới: `supabase/migrations/005_bookings_schema_sync.sql`

`001_init.sql` định nghĩa bảng `bookings` theo thiết kế cũ (venue_id UUID, deposit_amount NOT NULL) — không khớp các cột code đang dùng (`court_id`, `court_name`, `venue_type`, `duration`, `user_email`, `user_phone`, `payment_method`). DB production đang chạy đúng do đã chỉnh tay, nhưng dựng lại DB từ migrations sẽ hỏng. Migration 005 đồng bộ schema (idempotent, chạy lại an toàn) và thêm unique index chống race condition 2 người đặt cùng giờ.

**Khuyến nghị chạy 005 trên Supabase production** (vô hại nếu cột đã tồn tại).

## 4. Việc còn lại trước khi deploy (theo thứ tự)

1. **Chạy `npm run build` trên máy bạn** để xác nhận production build (sandbox kiểm tra bị giới hạn thời gian nên chỉ chạy được typecheck — đã pass).
2. Chạy `004_security_rls.sql` và `005_bookings_schema_sync.sql` trong Supabase SQL Editor (nếu 004 chưa chạy).
3. Điền giá trị thật vào `.env.local` production — hiện còn placeholder: `NEXTAUTH_SECRET` (sinh chuỗi ngẫu nhiên 32+ ký tự), `RESEND_API_KEY` (đang `re_xxxxx` → email xác nhận sẽ KHÔNG gửi được), `ADMIN_EMAIL` (đặt email đăng nhập thật của bạn), VNPay (đang sandbox — chưa go-live thanh toán thì giữ nguyên).
4. Supabase Dashboard → Authentication → URL Configuration: thêm `https://songthach.com/auth/callback`, Site URL = `https://songthach.com`.
5. Làm theo `docs/DEPLOY-VPS-LONGVAN.md` (đã đầy đủ: bảo mật VPS, PM2 standalone, Nginx, SSL) và tick checklist bảo mật cuối tài liệu.

## 5. Đánh giá chung

Luồng đặt sân → quản lý khách → khoá sân → lịch cố định hoạt động đúng end-to-end sau khi sửa lỗi trùng lịch. Bảo mật tốt: middleware + requireAdmin chặn 2 lớp, giá tính phía server, rate limit, RLS, security headers, `.gitignore` chặn `.env.local`. Sẵn sàng deploy sau khi hoàn tất 5 mục ở phần 4.
