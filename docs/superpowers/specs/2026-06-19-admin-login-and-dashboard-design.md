# Admin: đăng nhập bằng mật khẩu + nút đăng xuất + dashboard số liệu thật

## Bối cảnh

Khu admin (`/admin/*`) trước đó bị lỗi root cause: `middleware.ts` nằm sai vị trí (gốc project thay vì `src/`) nên Next.js không chạy middleware này — khiến session không được tự refresh, API admin lặng lẽ trả 401 sau khi token hết hạn (~1h), tạo cảm giác "bấm nút không có phản ứng gì". Đã fix bằng cách chuyển file vào `src/middleware.ts`.

Phần này (Phần 1/3) giải quyết thêm 3 việc nhỏ phát hiện trong lúc audit code:
1. Đăng nhập admin hiện dùng magic-link OTP (giống khách hàng) — bất tiện vì phải mở email mỗi lần. Đổi sang email + mật khẩu, tách riêng khỏi luồng khách hàng.
2. Nút "Đăng xuất" trong sidebar admin chưa nối `onClick`.
3. Trang Dashboard (`/admin`) hiển thị toàn số liệu giả (hardcode).

Phần 2 (trang Khách hàng + Cài đặt) và Phần 3 (báo cáo doanh thu theo tháng) sẽ làm sau, là spec riêng.

## Thiết kế

### 1. `/admin/login` — đăng nhập admin bằng mật khẩu

- Trang mới tại `src/app/admin/login/page.tsx` (client component), form email + password, gọi `supabase.auth.signInWithPassword()`.
- Sau khi `signInWithPassword()` thành công, điều hướng tới `/admin` (hoặc `next` param). Middleware (đã có sẵn logic `isAdminUser`) sẽ tự chặn nếu tài khoản không có quyền admin và redirect về `/`. Không cần thêm kiểm tra phía client.
- Trang `/login` của khách hàng (magic-link OTP) giữ nguyên, không đổi.
- `src/middleware.ts`: khi `isAdminPage` và chưa đăng nhập, đổi đích redirect từ `/login` → `/admin/login`. Logic còn lại (chặn API trả 401/403, chặn page redirect về `/` nếu không phải admin) giữ nguyên.
- Mật khẩu khởi tạo cho tài khoản `studiotannguyen@gmail.com`: set trực tiếp qua script một lần dùng `SUPABASE_SERVICE_ROLE_KEY` (`auth.admin.updateUserById` hoặc tương đương), không commit giá trị mật khẩu vào git. Script xoá sau khi chạy.

### 2. Nút "Đăng xuất"

- `src/app/admin/layout.tsx`: nối `onClick` của nút Đăng xuất → gọi `supabase.auth.signOut()` (client) → `router.push('/admin/login')`.

### 3. Dashboard số liệu thật

- API mới: `src/app/api/admin/dashboard-stats/route.ts` (GET, bảo vệ bởi `requireAdmin()` như các route admin khác). Trả về:
  - `bookingsToday`: số booking có `booking_date` = hôm nay (mọi trạng thái trừ `cancelled`).
  - `revenueThisMonth`: tổng `total_price` của booking trạng thái `confirmed` hoặc `completed`, `booking_date` trong tháng hiện tại.
  - `newCustomers30d`: số dòng trong `users` có `created_at` >= hôm nay - 30 ngày.
  - `courtsInUse`: số sân có booking trạng thái `confirmed` mà giờ hiện tại nằm trong `[start_time, end_time)` của ngày hôm nay, trên tổng 7 sân (hardcode theo `COURTS` ở `admin/venues/page.tsx`).
  - `recentBookings`: 5 booking mới nhất (`order by created_at desc limit 5`), các field cần cho bảng hiển thị (giống `Booking` interface ở trang bookings).
  - `weddingLeads`: 3 inquiry mới nhất có `status != 'cancelled'` (`order by created_at desc limit 3`).
- `src/app/admin/page.tsx`: chuyển thành phải fetch dữ liệu (giữ `'use client'`, dùng `useEffect` + `useState` như các trang admin khác đã làm), bỏ toàn bộ mảng `STATS`/`RECENT_BOOKINGS`/`WEDDING_LEADS` hardcode. Hiện loading state khi đang tải. Giữ nguyên layout/giao diện hiện tại, chỉ đổi nguồn dữ liệu.
- Nếu không có booking/inquiry nào, hiển thị trạng thái rỗng phù hợp (không lỗi).

## Ngoài phạm vi (out of scope cho Phần 1)

- Trang `/admin/users` (Khách hàng), `/admin/settings` (Cài đặt, đổi mật khẩu) — Phần 2.
- Báo cáo doanh thu theo tháng dạng kế toán — Phần 3.
- Nút "Xuất báo cáo Excel" ở dashboard — vẫn để placeholder, sẽ nối khi làm Phần 3.
