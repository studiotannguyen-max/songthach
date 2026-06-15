-- Songthach.com — Voucher khuyến mãi chéo (đặt sân → tặng nước)
-- Chạy file này trong Supabase SQL Editor sau 001_init.sql

-- Chương trình voucher (admin bật/tắt, đổi quà, đổi hạn dùng)
CREATE TABLE voucher_campaigns (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  -- Điều kiện phát: đặt sân cầu lông / đặt sân bóng / phát tay tại quầy
  trigger_type VARCHAR(30)  NOT NULL CHECK (trigger_type IN ('booking_badminton', 'booking_football', 'manual')),
  -- Loại quà: nước miễn phí / giảm tiền đặt sân
  reward_type  VARCHAR(30)  NOT NULL CHECK (reward_type IN ('free_drink', 'court_discount')),
  reward_value NUMERIC(10,2) DEFAULT 0,            -- 0 với free_drink; số tiền giảm với court_discount
  reward_note  VARCHAR(200),                        -- mô tả hiện cho khách & nhân viên quầy
  valid_days   INT DEFAULT 7,                       -- hạn dùng tính từ ngày phát
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Voucher đã phát cho từng khách
CREATE TABLE issued_vouchers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       UUID NOT NULL REFERENCES voucher_campaigns(id),
  code              VARCHAR(20) UNIQUE NOT NULL,    -- vd: ST-K7M2X9
  customer_phone    VARCHAR(15) NOT NULL,           -- khách không cần tài khoản → định danh bằng SĐT
  source_booking_id UUID REFERENCES bookings(id),   -- voucher luôn bắt nguồn từ một booking
  status            VARCHAR(20) DEFAULT 'issued'
                    CHECK (status IN ('issued', 'redeemed', 'expired', 'revoked')),
  expires_at        TIMESTAMPTZ NOT NULL,
  redeemed_at       TIMESTAMPTZ,
  redeemed_note     VARCHAR(200),                   -- ghi chú khi đổi (vd món nước, ca trực)
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Mỗi booking chỉ được phát 1 voucher cho mỗi chương trình (chặn phát trùng khi admin bấm xác nhận nhiều lần)
CREATE UNIQUE INDEX one_voucher_per_booking
  ON issued_vouchers (source_booking_id, campaign_id)
  WHERE status <> 'revoked';

CREATE INDEX idx_issued_vouchers_phone ON issued_vouchers (customer_phone);
CREATE INDEX idx_issued_vouchers_code  ON issued_vouchers (code);

-- Seed 2 chương trình đang chạy
INSERT INTO voucher_campaigns (name, trigger_type, reward_type, reward_value, reward_note, valid_days) VALUES
  ('Đặt sân cầu lông tặng nước', 'booking_badminton', 'free_drink', 0, '1 ly nước miễn phí tại Café Lavie (trà đá / nước suối / cà phê đen)', 7),
  ('Đặt sân bóng đá tặng nước',  'booking_football',  'free_drink', 0, '1 ly nước miễn phí tại Café Lavie (trà đá / nước suối / cà phê đen)', 7);
