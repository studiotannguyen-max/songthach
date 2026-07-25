-- supabase/migrations/011_players_rating.sql
-- CSDL vận động viên & hệ điểm trình độ A100–A500 — chạy trong Supabase SQL Editor.
-- Sổ rating_events là nguồn sự thật; cột band/progress_points ở players là số tính sẵn.

-- 1. HỒ SƠ VĐV
CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  nickname        TEXT,
  phone           TEXT,                          -- CHỈ admin thấy; không ra công khai
  avatar_url      TEXT,
  band            INT  NOT NULL CHECK (band IN (100,200,300,400,500)),
  progress_points INT  NOT NULL DEFAULT 0 CHECK (progress_points >= 0),
  tested_at       DATE,
  test_note       TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX players_rank_idx ON players (is_active, band DESC, progress_points DESC);

-- 2. SỔ ĐIỂM (chỉ ghi thêm, không sửa dòng cũ)
-- tournament_id để NULL ở giai đoạn này; cột chừa sẵn cho spec giải đấu sau.
CREATE TABLE rating_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id     UUID NOT NULL REFERENCES players(id),
  tournament_id UUID,                            -- chừa cho spec giải đấu
  points        INT  NOT NULL,                   -- initial: giá trị hiệu dụng tuyệt đối; còn lại: delta
  reason        TEXT NOT NULL,                   -- 'initial' | 'manual_adjust' | (sau: champion_*)
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX rating_events_player_idx ON rating_events (player_id, created_at);

-- 3. VIEW CÔNG KHAI — KHÔNG có cột phone, chỉ VĐV đang sinh hoạt
CREATE VIEW players_public AS
  SELECT id, full_name, nickname, avatar_url, band, progress_points, tested_at, created_at
  FROM players
  WHERE is_active = TRUE;

-- 4. RLS — bật trên cả 2 bảng (nguyên tắc như 004_security_rls.sql)
ALTER TABLE players       ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating_events ENABLE ROW LEVEL SECURITY;

-- players: KHÔNG policy nào cho anon/authenticated → chỉ service role (admin API) đọc/ghi.
-- Công khai đọc qua view players_public (chạy security_invoker=off mặc định của Postgres view,
-- nhưng để chắc chắn, cấp SELECT trên view cho anon):
GRANT SELECT ON players_public TO anon, authenticated;

-- rating_events: công khai được đọc (lịch sử điểm minh bạch), ghi qua service role.
CREATE POLICY "public read rating events" ON rating_events
  FOR SELECT USING (TRUE);
