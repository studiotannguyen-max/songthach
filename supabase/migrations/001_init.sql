-- Songthach.com — Database Migration v1
-- Chạy file này trong Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(15) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE,
  password_hash TEXT,
  role          VARCHAR(20) DEFAULT 'customer',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- VENUES
CREATE TABLE venues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(20) NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE
);

INSERT INTO venues (name, type) VALUES
  ('Sân 1',  'badminton'),
  ('Sân 2',  'badminton'),
  ('Sân 3',  'badminton'),
  ('Sân 5A', 'football_5'),
  ('Sân 5B', 'football_5'),
  ('Sân 7A', 'football_7');

-- PRICING RULES
CREATE TABLE pricing_rules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id     UUID REFERENCES venues(id) ON DELETE CASCADE,
  label        VARCHAR(50),
  day_type     VARCHAR(20) NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  price        NUMERIC(10,2) NOT NULL
);

-- Giá cầu lông mẫu (áp dụng cho tất cả sân cầu lông)
INSERT INTO pricing_rules (venue_id, label, day_type, start_time, end_time, price)
SELECT id, 'Giờ thường', 'weekday', '06:00', '17:00', 100000 FROM venues WHERE type = 'badminton'
UNION ALL
SELECT id, 'Giờ vàng',   'weekday', '17:00', '21:00', 150000 FROM venues WHERE type = 'badminton'
UNION ALL
SELECT id, 'Giờ thường', 'weekend', '06:00', '17:00', 140000 FROM venues WHERE type = 'badminton'
UNION ALL
SELECT id, 'Giờ vàng',   'weekend', '17:00', '21:00', 180000 FROM venues WHERE type = 'badminton';

-- BOOKINGS
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  venue_id        UUID REFERENCES venues(id),
  booking_date    DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  total_price     NUMERIC(10,2) NOT NULL,
  deposit_amount  NUMERIC(10,2) NOT NULL,
  deposit_rate    NUMERIC(5,2) DEFAULT 30,
  status          VARCHAR(20) DEFAULT 'pending',
  cancel_reason   TEXT,
  cancelled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Không được đặt trùng sân + ngày + giờ
CREATE UNIQUE INDEX bookings_no_overlap
  ON bookings (venue_id, booking_date, start_time)
  WHERE status NOT IN ('cancelled');

-- PAYMENTS
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID REFERENCES bookings(id),
  amount          NUMERIC(10,2) NOT NULL,
  method          VARCHAR(30),
  transaction_ref VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'pending',
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- WEDDING INQUIRIES
CREATE TABLE wedding_inquiries (
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

-- Row Level Security
ALTER TABLE bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_inquiries ENABLE ROW LEVEL SECURITY;

-- Khách chỉ xem được booking của mình
CREATE POLICY "own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);

-- Admin xem tất cả
CREATE POLICY "admin all bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
