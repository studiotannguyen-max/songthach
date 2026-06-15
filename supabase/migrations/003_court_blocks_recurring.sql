-- Songthach.com — Database Migration v3
-- Chạy file này trong Supabase SQL Editor

-- KHOÁ SÂN BẢO TRÌ
-- start_time/end_time = NULL  →  khoá nguyên ngày
-- court_id/court_name lưu dạng chuỗi giống bảng "bookings" (vd: 'court-1' · 'Sân 1'),
-- KHÔNG tham chiếu UUID của bảng "venues" — vì hệ thống đặt sân hiện tại định danh sân bằng chuỗi tĩnh khai báo trong trang.
CREATE TABLE court_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id    VARCHAR(50) NOT NULL,
  court_name  VARCHAR(100),
  venue_type  VARCHAR(20),
  block_date  DATE NOT NULL,
  start_time  TIME,
  end_time    TIME,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX court_blocks_court_date_idx ON court_blocks (court_id, block_date);

-- ĐẶT GIỜ CỐ ĐỊNH — gắn nhãn các booking được tạo theo loạt bởi admin
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS recurring_id UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'customer';
