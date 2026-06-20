-- Thêm category 'cafe' vào gallery_images (trước chỉ có badminton/football/wedding)
-- Chạy file này trong Supabase SQL Editor

ALTER TABLE gallery_images DROP CONSTRAINT gallery_images_category_check;
ALTER TABLE gallery_images ADD CONSTRAINT gallery_images_category_check
  CHECK (category IN ('badminton', 'football', 'wedding', 'cafe'));
