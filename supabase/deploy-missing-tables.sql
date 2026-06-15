-- ============================================================================
-- SONG THẠCH — SCRIPT TỔNG HỢP: tạo các bảng còn thiếu trên Supabase production
-- ============================================================================
-- Gộp 007_missing_core_tables.sql + 005_bookings_schema_sync.sql + 006_gallery.sql
-- thành 1 script duy nhất để copy/paste 1 lần vào Supabase SQL Editor → Run.
--
-- KHÔNG có lệnh CREATE TABLE bookings / CREATE TABLE posts (2 bảng này đã tồn tại).
-- An toàn chạy lại nhiều lần (idempotent).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== USERS =====
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(15) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE,
  password_hash TEXT,
  role          VARCHAR(20) DEFAULT 'customer',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===== VENUES =====
CREATE TABLE IF NOT EXISTS venues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(20) NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE
);

INSERT INTO venues (name, type)
SELECT v.name, v.type FROM (VALUES
  ('Sân 1',  'badminton'),
  ('Sân 2',  'badminton'),
  ('Sân 3',  'badminton'),
  ('Sân 5A', 'football_5'),
  ('Sân 5B', 'football_5'),
  ('Sân 7A', 'football_7')
) AS v(name, type)
WHERE NOT EXISTS (SELECT 1 FROM venues);

-- ===== PRICING RULES =====
CREATE TABLE IF NOT EXISTS pricing_rules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id     UUID REFERENCES venues(id) ON DELETE CASCADE,
  label        VARCHAR(50),
  day_type     VARCHAR(20) NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  price        NUMERIC(10,2) NOT NULL
);

INSERT INTO pricing_rules (venue_id, label, day_type, start_time, end_time, price)
SELECT id, 'Giờ thường', 'weekday', '06:00'::time, '17:00'::time, 100000 FROM venues
  WHERE type = 'badminton' AND NOT EXISTS (SELECT 1 FROM pricing_rules)
UNION ALL
SELECT id, 'Giờ vàng',   'weekday', '17:00'::time, '21:00'::time, 150000 FROM venues
  WHERE type = 'badminton' AND NOT EXISTS (SELECT 1 FROM pricing_rules)
UNION ALL
SELECT id, 'Giờ thường', 'weekend', '06:00'::time, '17:00'::time, 140000 FROM venues
  WHERE type = 'badminton' AND NOT EXISTS (SELECT 1 FROM pricing_rules)
UNION ALL
SELECT id, 'Giờ vàng',   'weekend', '17:00'::time, '21:00'::time, 180000 FROM venues
  WHERE type = 'badminton' AND NOT EXISTS (SELECT 1 FROM pricing_rules);

-- ===== PAYMENTS =====
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID REFERENCES bookings(id),
  amount          NUMERIC(10,2) NOT NULL,
  method          VARCHAR(30),
  transaction_ref VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'pending',
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===== WEDDING INQUIRIES =====
CREATE TABLE IF NOT EXISTS wedding_inquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name     VARCHAR(100) NOT NULL,
  phone            VARCHAR(15) NOT NULL,
  email            VARCHAR(100),
  event_date       DATE,
  guest_count      INT,
  table_count      INT,
  hall_preference  VARCHAR(50),
  special_requests TEXT,
  status           VARCHAR(20) DEFAULT 'new',
  admin_notes      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ===== VOUCHER CAMPAIGNS / ISSUED VOUCHERS =====
CREATE TABLE IF NOT EXISTS voucher_campaigns (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  trigger_type VARCHAR(30)  NOT NULL CHECK (trigger_type IN ('booking_badminton', 'booking_football', 'manual')),
  reward_type  VARCHAR(30)  NOT NULL CHECK (reward_type IN ('free_drink', 'court_discount')),
  reward_value NUMERIC(10,2) DEFAULT 0,
  reward_note  VARCHAR(200),
  valid_days   INT DEFAULT 7,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issued_vouchers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       UUID NOT NULL REFERENCES voucher_campaigns(id),
  code              VARCHAR(20) UNIQUE NOT NULL,
  customer_phone    VARCHAR(15) NOT NULL,
  source_booking_id UUID REFERENCES bookings(id),
  status            VARCHAR(20) DEFAULT 'issued'
                    CHECK (status IN ('issued', 'redeemed', 'expired', 'revoked')),
  expires_at        TIMESTAMPTZ NOT NULL,
  redeemed_at       TIMESTAMPTZ,
  redeemed_note     VARCHAR(200),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS one_voucher_per_booking
  ON issued_vouchers (source_booking_id, campaign_id)
  WHERE status <> 'revoked';

CREATE INDEX IF NOT EXISTS idx_issued_vouchers_phone ON issued_vouchers (customer_phone);
CREATE INDEX IF NOT EXISTS idx_issued_vouchers_code  ON issued_vouchers (code);

INSERT INTO voucher_campaigns (name, trigger_type, reward_type, reward_value, reward_note, valid_days)
SELECT * FROM (VALUES
  ('Đặt sân cầu lông tặng nước', 'booking_badminton', 'free_drink', 0::numeric, '1 ly nước miễn phí tại Café Lavie (trà đá / nước suối / cà phê đen)', 7),
  ('Đặt sân bóng đá tặng nước',  'booking_football',  'free_drink', 0::numeric, '1 ly nước miễn phí tại Café Lavie (trà đá / nước suối / cà phê đen)', 7)
) AS v(name, trigger_type, reward_type, reward_value, reward_note, valid_days)
WHERE NOT EXISTS (SELECT 1 FROM voucher_campaigns);

-- ===== COURT BLOCKS + cột bookings còn thiếu (003) =====
CREATE TABLE IF NOT EXISTS court_blocks (
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

CREATE INDEX IF NOT EXISTS court_blocks_court_date_idx ON court_blocks (court_id, block_date);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS recurring_id UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'customer';

-- ===== RLS — cho các bảng mới (004) =====
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_blocks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_campaigns  ENABLE ROW LEVEL SECURITY;
ALTER TABLE issued_vouchers    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own row" ON users;
CREATE POLICY "users read own row" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "public read active venues" ON venues;
CREATE POLICY "public read active venues" ON venues
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "public read pricing" ON pricing_rules;
CREATE POLICY "public read pricing" ON pricing_rules
  FOR SELECT USING (TRUE);

-- payments, wedding_inquiries, court_blocks, voucher_campaigns, issued_vouchers:
-- bật RLS, không tạo policy nào cho anon/authenticated → chỉ service role truy cập.

-- ===== BOOKINGS policies (001 + 004) =====
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own bookings" ON bookings;
DROP POLICY IF EXISTS "own bookings read" ON bookings;
CREATE POLICY "own bookings read" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin all bookings" ON bookings;
CREATE POLICY "admin all bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- 005_bookings_schema_sync.sql — đồng bộ cột bookings với code hiện tại
-- ============================================================================
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS court_id       VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS court_name     VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS venue_type     VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration       NUMERIC(4,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_email     VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_name      VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_phone     VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30);

DO $$ BEGIN
  ALTER TABLE bookings ALTER COLUMN deposit_amount DROP NOT NULL;
  ALTER TABLE bookings ALTER COLUMN deposit_amount SET DEFAULT 0;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE bookings ALTER COLUMN venue_id DROP NOT NULL;
EXCEPTION WHEN others THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS bookings_court_date_idx
  ON bookings (court_id, booking_date)
  WHERE status IN ('pending', 'confirmed');

DROP INDEX IF EXISTS bookings_no_overlap;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_no_dup_start
  ON bookings (court_id, booking_date, start_time)
  WHERE status IN ('pending', 'confirmed');

-- ============================================================================
-- 006_gallery.sql — thư viện ảnh quản lý trong admin
-- ============================================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    VARCHAR(20) NOT NULL CHECK (category IN ('badminton', 'football', 'wedding')),
  url         TEXT NOT NULL,
  caption     VARCHAR(150),
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_cat
  ON gallery_images (category, sort_order)
  WHERE is_active;

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active gallery" ON gallery_images;
CREATE POLICY "public read active gallery" ON gallery_images
  FOR SELECT USING (is_active = true);
