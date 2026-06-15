-- Songthach.com — Database Migration v5: ĐỒNG BỘ SCHEMA BOOKINGS VỚI CODE
--
-- Vấn đề: 001_init.sql định nghĩa bảng bookings theo thiết kế cũ (venue_id UUID,
-- deposit_amount NOT NULL...) trong khi code hiện tại (/api/bookings) insert theo
-- thiết kế mới (court_id chuỗi, user_email, payment_method...). DB production đã
-- được chỉnh tay nên đang chạy đúng; file này giúp việc DỰNG LẠI DB từ migrations
-- (hoặc tạo môi trường staging) không bị lệch schema.
--
-- An toàn chạy lại nhiều lần (idempotent). Chạy trong Supabase SQL Editor.

-- 1. Các cột code đang sử dụng
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS court_id       VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS court_name     VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS venue_type     VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration       NUMERIC(4,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_email     VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_name      VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_phone     VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30);
-- (recurring_id, source đã thêm ở 003)

-- 2. Nới các ràng buộc cũ mà code mới không dùng
DO $$ BEGIN
  ALTER TABLE bookings ALTER COLUMN deposit_amount DROP NOT NULL;
  ALTER TABLE bookings ALTER COLUMN deposit_amount SET DEFAULT 0;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE bookings ALTER COLUMN venue_id DROP NOT NULL;
EXCEPTION WHEN others THEN NULL; END $$;

-- 3. Index phục vụ truy vấn chống trùng lịch & widget xem slot
CREATE INDEX IF NOT EXISTS bookings_court_date_idx
  ON bookings (court_id, booking_date)
  WHERE status IN ('pending', 'confirmed');

-- 4. Index cũ bookings_no_overlap dựa trên venue_id (UUID) — không còn tác dụng
-- với court_id chuỗi. Thay bằng unique index theo court_id + ngày + giờ bắt đầu:
DROP INDEX IF EXISTS bookings_no_overlap;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_no_dup_start
  ON bookings (court_id, booking_date, start_time)
  WHERE status IN ('pending', 'confirmed');
-- Lưu ý: index này chặn 2 booking CÙNG giờ bắt đầu ở tầng DB (chống race condition
-- khi 2 người bấm đặt cùng lúc). Trùng lịch chéo giờ đã được API kiểm tra.
