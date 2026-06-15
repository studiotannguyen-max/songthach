-- Songthach.com — Database Migration v6: THƯ VIỆN ẢNH QUẢN LÝ TRONG ADMIN
--
-- Mục tiêu: admin upload 1 ảnh → chọn mục (sân cầu / sân bóng / tiệc cưới) →
-- ảnh hiển thị trong gallery của mục đó ngoài trang public, sửa/xoá trong admin.
-- Ảnh lưu trên Supabase Storage (bucket post-images, đã có sẵn); bảng này chỉ
-- lưu URL + phân loại + thứ tự.
--
-- An toàn chạy lại nhiều lần (idempotent). Chạy trong Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    VARCHAR(20) NOT NULL CHECK (category IN ('badminton', 'football', 'wedding')),
  url         TEXT NOT NULL,
  caption     VARCHAR(150),                 -- chú thích hiện dưới ảnh (tuỳ chọn)
  sort_order  INT DEFAULT 0,                -- thứ tự hiển thị (nhỏ → trước)
  is_active   BOOLEAN DEFAULT TRUE,         -- tắt để ẩn khỏi web mà không xoá
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Truy vấn theo mục + thứ tự (chỉ ảnh đang bật)
CREATE INDEX IF NOT EXISTS idx_gallery_cat
  ON gallery_images (category, sort_order)
  WHERE is_active;

-- RLS: public chỉ ĐỌC ảnh đang bật; GHI chỉ service role (createAdminClient).
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active gallery" ON gallery_images;
CREATE POLICY "public read active gallery" ON gallery_images
  FOR SELECT USING (is_active = true);
-- Lưu ý: KHÔNG tạo policy INSERT/UPDATE/DELETE cho anon — mọi thao tác ghi đi qua
-- API admin (service role) đã kiểm tra quyền bằng requireAdmin().
