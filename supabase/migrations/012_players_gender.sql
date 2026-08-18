-- supabase/migrations/012_players_gender.sql
-- Thêm giới tính cho VĐV — nữ xếp theo thang A100–A400, nam giữ A100–A500.
-- Chạy trong Supabase SQL Editor.

-- 1. CỘT GIỚI TÍNH
-- Mặc định 'nam': mọi VĐV đang có trở thành nam, đúng như hệ thống vận hành từ trước.
ALTER TABLE players ADD COLUMN gender TEXT NOT NULL DEFAULT 'nam'
  CHECK (gender IN ('nam','nu'));

-- 2. VIEW CÔNG KHAI — bổ sung gender
-- Cột mới phải nối vào CUỐI: CREATE OR REPLACE VIEW của Postgres không cho chèn giữa
-- hay đổi thứ tự cột của view đang tồn tại.
CREATE OR REPLACE VIEW players_public AS
  SELECT id, full_name, nickname, avatar_url, band, progress_points, tested_at, created_at, gender
  FROM players
  WHERE is_active = TRUE;
