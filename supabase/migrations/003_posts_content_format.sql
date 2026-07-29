-- Songthach.com — Database Migration v3
-- Thêm chế độ soạn thảo cho bài viết: 'richtext' (Tiptap) hoặc 'html' (HTML thô)
-- Chạy file này trong Supabase SQL Editor

ALTER TABLE posts
  ADD COLUMN content_format VARCHAR(20) DEFAULT 'richtext';
