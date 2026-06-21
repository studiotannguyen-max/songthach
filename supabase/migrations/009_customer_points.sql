-- Hệ thống tích điểm khách hàng — chạy trong Supabase SQL Editor

CREATE TABLE point_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  booking_id  UUID REFERENCES bookings(id),
  type        VARCHAR(10) NOT NULL CHECK (type IN ('earn', 'redeem')),
  points      INT NOT NULL,            -- dương cho earn, âm cho redeem
  note        VARCHAR(200),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX point_transactions_user_idx ON point_transactions (user_id);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS points_used INT DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS points_discount_amount NUMERIC(10,2) DEFAULT 0;

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Khách chỉ xem được điểm của chính mình; mọi thay đổi đi qua service-role (API route)
CREATE POLICY "user reads own points" ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);
