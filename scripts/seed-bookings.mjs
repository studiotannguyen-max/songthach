// Seed dữ liệu mẫu cho bảng bookings — hiển thị ngay tại /admin/bookings
// Chạy:  node scripts/seed-bookings.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Đọc .env.local thủ công (không cần dotenv)
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ===== Giá đồng bộ với src/lib/pricing.ts =====
const PRICE_MAP = { badminton: [50000, 60000], football_5: [120000, 170000], football_7: [300000, 350000] };
const price = (start, type) => {
  const h = parseInt(start);
  return PRICE_MAP[type][h >= 17 && h < 22 ? 1 : 0];
};
const addH = (t, hrs) => {
  const [h, m] = t.split(':').map(Number);
  const total = h * 60 + m + Math.round(hrs * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};
const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// ===== 10 booking mẫu: đủ trạng thái, đủ loại sân =====
const SAMPLES = [
  // [offset ngày, court_id, court_name, venue_type, giờ, số giờ, thanh toán, status, tên, sđt, email]
  [0,  'court-1', 'Sân 1',  'badminton',  '07:00', 1,   'pay_at_venue',  'confirmed', 'Nguyễn Văn An',   '0901234567', 'an.nguyen@gmail.com'],
  [0,  'court-2', 'Sân 2',  'badminton',  '18:00', 1.5, 'bank_transfer', 'pending',   'Trần Thị Bích',   '0912345678', 'bich.tran@gmail.com'],
  [0,  'fb5-1',   'Sân 5A', 'football_5', '19:00', 1,   'bank_transfer', 'confirmed', 'Lê Hoàng Cường',  '0923456789', 'cuong.le@gmail.com'],
  [1,  'court-3', 'Sân 3',  'badminton',  '06:30', 2,   'pay_at_venue',  'pending',   'Phạm Minh Đức',   '0934567890', 'duc.pham@gmail.com'],
  [1,  'fb7-1',   'Sân 7A', 'football_7', '17:00', 1.5, 'bank_transfer', 'pending',   'Võ Thanh Em',     '0945678901', 'em.vo@gmail.com'],
  [2,  'court-1', 'Sân 1',  'badminton',  '20:00', 1,   'bank_transfer', 'confirmed', 'Đặng Quốc Phong', '0956789012', 'phong.dang@gmail.com'],
  [2,  'fb5-2',   'Sân 5B', 'football_5', '18:00', 2,   'pay_at_venue',  'pending',   'Bùi Thu Giang',   '0967890123', 'giang.bui@gmail.com'],
  [-1, 'court-2', 'Sân 2',  'badminton',  '08:00', 1,   'pay_at_venue',  'completed', 'Hồ Văn Hải',      '0978901234', 'hai.ho@gmail.com'],
  [-2, 'fb5-1',   'Sân 5A', 'football_5', '20:00', 1,   'bank_transfer', 'completed', 'Ngô Thị Lan',     '0989012345', 'lan.ngo@gmail.com'],
  [3,  'court-3', 'Sân 3',  'badminton',  '17:30', 1,   'bank_transfer', 'cancelled', 'Dương Văn Minh',  '0990123456', 'minh.duong@gmail.com'],
];

const rows = SAMPLES.map(([off, court_id, court_name, venue_type, start_time, duration, payment_method, status, user_name, user_phone, user_email]) => ({
  user_id: null,
  user_email, user_name, user_phone,
  venue_type, court_id, court_name,
  booking_date: day(off),
  start_time,
  end_time: addH(start_time, duration),
  duration,
  total_price: price(start_time, venue_type) * duration,
  payment_method,
  status,
}));

const { data, error } = await supabase.from('bookings').insert(rows).select('id, court_name, booking_date, start_time, status');
if (error) {
  console.error('❌ Lỗi:', error.message);
  process.exit(1);
}
console.log(`✅ Đã tạo ${data.length} booking mẫu:`);
for (const b of data) console.log(`   BK-${b.id.slice(0, 8).toUpperCase()}  ${b.booking_date} ${b.start_time}  ${b.court_name}  [${b.status}]`);
console.log('\n→ Mở http://localhost:3000/admin/bookings và bấm "Làm mới" để xem.');
