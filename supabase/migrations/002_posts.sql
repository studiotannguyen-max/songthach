-- Songthach.com — Database Migration v2
-- Chạy file này trong Supabase SQL Editor

CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(220) UNIQUE NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  cover_image   TEXT,
  category      VARCHAR(20) DEFAULT 'general',
  status        VARCHAR(20) DEFAULT 'draft',
  author_name   VARCHAR(100) DEFAULT 'Admin',
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX posts_status_idx ON posts (status);

-- Ai cũng đọc được bài đã đăng; admin (service role) full quyền qua API route
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published posts" ON posts
  FOR SELECT USING (status = 'published');
