-- Songthach.com — Database Migration v4: SIẾT BẢO MẬT RLS
-- Chạy file này trong Supabase SQL Editor TRƯỚC KHI đưa web lên production.
--
-- Vấn đề: các bảng dưới đây chưa bật Row Level Security, nghĩa là bất kỳ ai
-- có anon key (công khai trong JS bundle) đều đọc/ghi được trực tiếp qua
-- Supabase REST API, bỏ qua hoàn toàn API routes của Next.js.
--
-- Nguyên tắc: bật RLS trên TẤT CẢ các bảng. Bảng nào không có policy nào
-- thì anon/authenticated bị chặn hoàn toàn — chỉ service role (dùng trong
-- API routes phía server) còn truy cập được.

-- 1. USERS — chứa role admin, tuyệt đối không cho client đọc/ghi trực tiếp
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Cho phép user đã đăng nhập xem đúng dòng của mình (nếu id khớp auth.uid)
CREATE POLICY "users read own row" ON users
  FOR SELECT USING (auth.uid() = id);

-- 2. VENUES — public chỉ được đọc sân đang hoạt động
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active venues" ON venues
  FOR SELECT USING (is_active = TRUE);

-- 3. PRICING RULES — public chỉ được đọc
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read pricing" ON pricing_rules
  FOR SELECT USING (TRUE);

-- 4. PAYMENTS — chỉ service role (không policy nào cho anon/authenticated)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 5. COURT BLOCKS — chỉ service role; client xem lịch khoá qua /api/bookings
ALTER TABLE court_blocks ENABLE ROW LEVEL SECURITY;

-- 6. BOOKINGS — đã bật RLS ở v1, nhưng policy "own bookings" dùng FOR ALL
--    khiến khách sửa/xoá được booking của chính mình ngoài luồng kiểm soát.
--    Thu hẹp lại: khách chỉ ĐỌC booking của mình; mọi ghi/sửa đi qua API (service role).
DROP POLICY IF EXISTS "own bookings" ON bookings;
CREATE POLICY "own bookings read" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy "admin all bookings" (v1) giữ nguyên nếu muốn admin đăng nhập
-- truy vấn trực tiếp; mọi thao tác admin trong web đều đã đi qua service role.

-- 7. WEDDING INQUIRIES — đã bật RLS ở v1, không có policy → chỉ service role. Giữ nguyên.

-- 8. STORAGE — đảm bảo bucket post-images chỉ cho service role ghi
--    (Vào Dashboard > Storage > post-images > Policies: chỉ tạo policy SELECT cho public,
--     KHÔNG tạo policy INSERT/UPDATE/DELETE cho anon.)
