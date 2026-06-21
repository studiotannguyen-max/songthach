# Hệ thống tích điểm khách hàng — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khách có tài khoản tích điểm khi đặt sân (10.000đ = 1 điểm, cộng khi admin xác nhận), dùng điểm giảm giá lúc đặt sân tiếp theo (1 điểm = 1.000đ, tối đa 100%), xem điểm ở trang `/profile` (đang là link chết).

**Architecture:** Thêm bảng sổ ghi điểm `point_transactions` (không lưu số dư rời rạc — tính bằng tổng các dòng). Logic earn/redeem tập trung ở `src/lib/points.ts`, gọi từ 2 route đã có (`POST /api/bookings` lúc tạo đơn, `PATCH /api/admin/bookings/[id]` lúc xác nhận) theo đúng pattern voucher hiện tại (`issueVoucherForBooking`). Thêm `GET /api/points/balance` cho UI client đọc số dư.

**Tech Stack:** Next.js 14 App Router, Supabase Postgres, TypeScript, Zod (đã dùng trong `/api/bookings`).

## Global Constraints

- Chỉ tích/dùng điểm cho đặt sân bóng đá/cầu lông qua web (bảng `bookings`), không áp dụng café/tiệc cưới.
- Khách phải đăng nhập (`user_id` khác null) mới tích/dùng điểm.
- Tỷ lệ tích: 10.000đ giá gốc (`total_price`, trước giảm) = 1 điểm. Cộng điểm khi `status` → `confirmed`.
- Tỷ lệ đổi: 1 điểm = 1.000đ. Được dùng tối đa 100% giá trị đặt sân.
- Điểm không hết hạn. Không tự hoàn điểm khi huỷ booking (ngoài phạm vi).
- Không có test framework tự động trong repo — verify bằng `npm run build` + `curl`/script kiểm tra trực tiếp dữ liệu.
- Mỗi task kết thúc bằng 1 commit riêng.

---

### Task 1: Migration — bảng `point_transactions` + cột mới trên `bookings`

**Files:**
- Create: `supabase/migrations/009_customer_points.sql`

**Interfaces:**
- Produces bảng `point_transactions(id, user_id, booking_id, type, points, note, created_at)` và 2 cột mới trên `bookings`: `points_used INT DEFAULT 0`, `points_discount_amount NUMERIC(10,2) DEFAULT 0`.

- [ ] **Step 1: Viết migration**

```sql
-- supabase/migrations/009_customer_points.sql
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
```

- [ ] **Step 2: Báo người dùng chạy migration**

Đây là thay đổi schema database — báo cho chủ quán chạy file này trong Supabase SQL Editor, xác nhận chạy xong trước khi qua Task 2 (các task sau cần bảng này tồn tại để test).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/009_customer_points.sql
git commit -m "feat(points): thêm bảng point_transactions + cột points_used/points_discount_amount trên bookings"
```

---

### Task 2: `src/lib/points.ts` — logic tích/dùng điểm

**Files:**
- Create: `src/lib/points.ts`

**Interfaces:**
- Produces: `getUserPointsBalance(admin: SupabaseClient, userId: string): Promise<number>`, `awardPointsForBooking(admin: SupabaseClient, booking: { id: string; user_id: string | null; total_price: number }): Promise<void>`, `redeemPoints(admin: SupabaseClient, params: { userId: string; bookingId: string; points: number }): Promise<void>`.
- Consumes: `createAdminClient()` type từ `@/lib/supabase/admin` (chỉ dùng type `SupabaseClient` chung, không cần import riêng).

- [ ] **Step 1: Viết file**

```ts
// src/lib/points.ts
import type { SupabaseClient } from '@supabase/supabase-js';

export const POINTS_PER_VND = 1 / 10_000; // 10.000đ = 1 điểm (tích)
export const VND_PER_POINT  = 1_000;       // 1 điểm = 1.000đ (đổi)

/** Tổng điểm hiện có của user — tính từ sổ point_transactions, không lưu số dư rời rạc. */
export async function getUserPointsBalance(admin: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await admin
    .from('point_transactions')
    .select('points')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + row.points, 0);
}

/** Cộng điểm khi booking được xác nhận. Không làm gì nếu booking không có user_id (khách vãng lai). */
export async function awardPointsForBooking(
  admin: SupabaseClient,
  booking: { id: string; user_id: string | null; total_price: number },
): Promise<void> {
  if (!booking.user_id) return;
  const points = Math.floor(booking.total_price * POINTS_PER_VND);
  if (points <= 0) return;

  await admin.from('point_transactions').insert({
    user_id:    booking.user_id,
    booking_id: booking.id,
    type:       'earn',
    points,
    note:       `Tích điểm từ đặt sân #${booking.id.slice(0, 8).toUpperCase()}`,
  });
}

/** Trừ điểm khi khách dùng điểm giảm giá lúc đặt sân. Gọi sau khi đã validate đủ điểm. */
export async function redeemPoints(
  admin: SupabaseClient,
  params: { userId: string; bookingId: string; points: number },
): Promise<void> {
  if (params.points <= 0) return;
  await admin.from('point_transactions').insert({
    user_id:    params.userId,
    booking_id: params.bookingId,
    type:       'redeem',
    points:     -params.points,
    note:       `Dùng điểm giảm giá cho đặt sân #${params.bookingId.slice(0, 8).toUpperCase()}`,
  });
}
```

- [ ] **Step 2: Build để type-check**

Run: `npm run build`
Expected: thành công, không lỗi TypeScript (file mới chưa được import ở đâu nên không ảnh hưởng route khác).

- [ ] **Step 3: Commit**

```bash
git add src/lib/points.ts
git commit -m "feat(points): thêm lib/points.ts (tính số dư, cộng điểm, trừ điểm)"
```

---

### Task 3: Cộng điểm khi admin xác nhận booking

**Files:**
- Modify: `src/app/api/admin/bookings/[id]/route.ts`

**Interfaces:**
- Consumes: `awardPointsForBooking` từ `@/lib/points` (Task 2).

- [ ] **Step 1: Sửa route**

Trong `src/app/api/admin/bookings/[id]/route.ts`, sửa:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { issueVoucherForBooking, revokeVouchersForBooking } from '@/lib/vouchers';
import { sendVoucherEmail } from '@/lib/email';
import { awardPointsForBooking } from '@/lib/points';

// PATCH /api/admin/bookings/:id — Cập nhật trạng thái
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { status } = await req.json();

  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', params.id)
    .select('id, venue_type, user_id, user_phone, user_email, user_name, total_price')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Khuyến mãi chéo: xác nhận (đã nhận cọc) → phát voucher nước + cộng điểm; hủy → thu hồi voucher chưa dùng
  let voucher_code: string | null = null;
  try {
    if (status === 'confirmed' && booking) {
      const voucher = await issueVoucherForBooking(supabase, booking);
      voucher_code = voucher?.code ?? null;

      // Gửi mã voucher cho khách qua email — lỗi email không chặn response
      if (voucher && booking.user_email) {
        sendVoucherEmail({
          to:          booking.user_email,
          user_name:   booking.user_name ?? null,
          code:        voucher.code,
          reward_note: voucher.reward_note,
          expires_at:  voucher.expires_at,
        }).catch(err => console.error('[Email] Gửi voucher thất bại:', err));
      }

      await awardPointsForBooking(supabase, booking);
    } else if (status === 'cancelled' && booking) {
      await revokeVouchersForBooking(supabase, booking.id);
    }
  } catch (e) {
    // Voucher/điểm lỗi không được chặn việc đổi trạng thái booking
    console.error('[Voucher/Points] Lỗi phát/thu hồi:', e);
  }

  return NextResponse.json({ success: true, voucher_code });
}
```

(Thay đổi duy nhất so với code gốc: thêm `user_id, total_price` vào `.select()`, import + gọi `awardPointsForBooking(supabase, booking)` ngay sau đoạn gửi voucher.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: thành công.

- [ ] **Step 3: Kiểm tra thủ công bằng script** (cần đã có ít nhất 1 booking thật gắn `user_id` — nếu chưa có, tạo 1 booking khi đã đăng nhập trước khi test bước này)

Viết file tạm `verify-award.mjs` ở gốc project:

```js
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { data: booking } = await supabase.from('bookings').select('id, user_id, total_price, status').not('user_id', 'is', null).limit(1).single();
console.log('Booking dùng để test:', booking);
const res = await fetch('http://localhost:3000/api/admin/bookings/' + booking.id, {
  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'confirmed' }),
});
console.log('PATCH status:', res.status, await res.json());
const { data: txns } = await supabase.from('point_transactions').select('*').eq('booking_id', booking.id);
console.log('point_transactions:', txns);
```

Run: `node verify-award.mjs` (sau khi `npm run dev` đang chạy) rồi xoá file: `rm verify-award.mjs`
Expected: PATCH trả `{"success":true,...}`, và `point_transactions` có 1 dòng `type: 'earn'` với `points = floor(total_price/10000)`.

(Lưu ý: PATCH ở đây gọi trực tiếp không qua cookie admin — nếu route báo 401 "Chưa đăng nhập", nghĩa là `requireAdmin()` chặn request không có cookie phiên admin; trong trường hợp đó, bỏ qua bước script và kiểm tra bằng tay qua giao diện `/admin/bookings` → bấm "Xác nhận đặt sân" → query `point_transactions` bằng script chỉ-đọc tương tự nhưng bỏ phần PATCH.)

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/bookings/\[id\]/route.ts
git commit -m "feat(points): cộng điểm tích lũy khi admin xác nhận đặt sân"
```

---

### Task 4: Dùng điểm giảm giá lúc đặt sân

**Files:**
- Modify: `src/app/api/bookings/route.ts`

**Interfaces:**
- Consumes: `getUserPointsBalance`, `redeemPoints` từ `@/lib/points` (Task 2).
- Produces: `POST /api/bookings` nhận thêm field `points_used?: number` trong body; response giữ nguyên `{ success, booking_id, id, total_price }` nhưng `total_price` trả về giờ là **số tiền thực phải trả** (sau giảm) để client hiển thị đúng ở bước thành công.

- [ ] **Step 1: Sửa schema + logic**

Trong `src/app/api/bookings/route.ts`:

1) Thêm field vào `BookingSchema`:

```ts
const BookingSchema = z.object({
  court_id:       z.string().min(1).max(50),
  court_name:     z.string().min(1).max(100),
  venue_type:     z.enum(['badminton', 'football_5', 'football_7']),
  booking_date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày không hợp lệ'),
  start_time:     z.string().regex(/^([01]\d|2[01]):(00|30)$/, 'Giờ không hợp lệ'),
  duration:       z.number().min(0.5).max(4),
  payment_method: z.enum(['bank_transfer', 'pay_at_venue']),
  user_name:      z.string().max(100).optional().nullable(),
  user_phone:     z.preprocess(
    (v) => (typeof v === 'string' ? v.replace(/[\s.\-()]/g, '') : v),
    z.string().regex(/^(0|\+84)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ'),
  ),
  user_email:     z.string().email('Email không hợp lệ').max(100),
  points_used:    z.number().int().min(0).max(100_000).optional().default(0),
});
```

2) Thêm import ở đầu file:

```ts
import { getUserPointsBalance, redeemPoints, VND_PER_POINT } from '@/lib/points';
```

3) Sửa phần destructure dữ liệu đã parse (tìm dòng `const { court_id, court_name, ...} = parsed.data;`):

```ts
    const {
      court_id, court_name, venue_type,
      booking_date, start_time, duration,
      payment_method, user_name, user_phone, user_email,
      points_used,
    } = parsed.data;
```

4) Sau đoạn lấy `userId` (đã có sẵn — không đổi đoạn lấy `userId`), thêm validate điểm **trước khi insert booking**:

```ts
    // Dùng điểm tích lũy giảm giá — chỉ cho phép khi đã đăng nhập
    let pointsDiscountAmount = 0;
    if (points_used > 0) {
      if (!userId) {
        return NextResponse.json({ error: 'Cần đăng nhập để dùng điểm tích lũy' }, { status: 400 });
      }
      const balance = await getUserPointsBalance(admin, userId);
      if (points_used > balance) {
        return NextResponse.json({ error: `Bạn chỉ có ${balance} điểm, không đủ để dùng ${points_used} điểm` }, { status: 400 });
      }
      pointsDiscountAmount = points_used * VND_PER_POINT;
      if (pointsDiscountAmount > total_price) {
        return NextResponse.json({ error: 'Số điểm dùng vượt quá giá trị đặt sân' }, { status: 400 });
      }
    }
```

(Đoạn này đặt sau khối lấy `userId` hiện có, trước đoạn `const { data: booking, error } = await admin.from('bookings').insert(...)`.)

5) Sửa `.insert()` để lưu thêm 2 cột:

```ts
    const { data: booking, error } = await admin
      .from('bookings')
      .insert({
        user_id:        userId,
        user_email,
        user_name:      user_name || null,
        user_phone,
        venue_type,
        court_id,
        court_name,
        booking_date,
        start_time,
        end_time,
        duration,
        total_price,
        points_used,
        points_discount_amount: pointsDiscountAmount,
        payment_method,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;

    // Trừ điểm sau khi tạo booking thành công
    if (points_used > 0 && userId) {
      await redeemPoints(admin, { userId, bookingId: booking.id, points: points_used });
    }

    const amountDue = total_price - pointsDiscountAmount;
```

6) Sửa 2 lệnh gọi `sendBookingConfirmation` và `sendTelegramNotification` ngay sau đó — đổi field `total_price` (đang truyền biến `total_price` gốc) thành `amountDue`, để email/Telegram báo đúng số tiền cần thu (không phải giá gốc trước giảm):

```ts
    sendBookingConfirmation({
      to:             user_email,
      booking_id:     bookingId,
      user_name:      user_name || null,
      court_name,
      venue_name:     venue_type === 'badminton' ? 'Sân Cầu lông' : 'Sân Bóng đá',
      booking_date,
      start_time,
      end_time,
      duration,
      total_price:    amountDue,
      payment_method,
    }).catch(err => console.error('[Email] Gửi thất bại:', err));

    sendTelegramNotification({
      booking_id:     bookingId,
      court_name,
      venue_label:    venue_type === 'badminton' ? 'Sân Cầu lông' : 'Sân Bóng đá',
      booking_date,
      start_time,
      end_time,
      duration,
      user_name:      user_name || null,
      user_phone,
      total_price:    amountDue,
      payment_method,
    }).catch(err => console.error('[Telegram] Gửi thất bại:', err));
```

(Toàn bộ phần còn lại của 2 lệnh gọi này — `to`, `court_name`, `booking_date`... — giữ nguyên như code gốc, chỉ đổi đúng dòng `total_price`.)

7) Sửa response cuối cùng để trả số tiền thực phải trả:

```ts
    return NextResponse.json({
      success: true,
      booking_id: bookingId,
      id: booking.id,
      total_price: amountDue,
    }, { status: 201 });
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: thành công.

- [ ] **Step 3: Kiểm tra thủ công — dùng điểm vượt số dư phải bị chặn**

Run (sau `npm run dev`):

```bash
curl -s -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"court_id":"court-1","court_name":"Sân 1","venue_type":"badminton","booking_date":"2026-07-01","start_time":"08:00","duration":1,"payment_method":"pay_at_venue","user_phone":"0900000000","user_email":"test@example.com","points_used":5}'
```

Expected: trả lỗi `{"error":"Cần đăng nhập để dùng điểm tích lũy"}` với status 400 (vì curl không có cookie đăng nhập) — xác nhận validate hoạt động đúng cho khách vãng lai.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/bookings/route.ts
git commit -m "feat(points): cho phép dùng điểm tích lũy giảm giá lúc đặt sân"
```

---

### Task 5: API `GET /api/points/balance`

**Files:**
- Create: `src/app/api/points/balance/route.ts`

**Interfaces:**
- Produces: `GET /api/points/balance` — trả `{ balance: number }` (200) nếu đã đăng nhập, `{ error: 'Chưa đăng nhập' }` (401) nếu chưa.
- Consumes: `createClient()` từ `@/lib/supabase/server`, `createAdminClient()` từ `@/lib/supabase/admin`, `getUserPointsBalance` từ `@/lib/points`.

- [ ] **Step 1: Viết route**

```ts
// src/app/api/points/balance/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserPointsBalance } from '@/lib/points';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const admin = createAdminClient();
  const balance = await getUserPointsBalance(admin, user.id);
  return NextResponse.json({ balance });
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: thành công.

- [ ] **Step 3: Kiểm tra**

Run: `curl -s http://localhost:3000/api/points/balance --max-time 5`
Expected: `{"error":"Chưa đăng nhập"}` (curl không có cookie).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/points/balance/route.ts
git commit -m "feat(points): thêm API GET /api/points/balance"
```

---

### Task 6: Trang `/profile` (đang là link chết)

**Files:**
- Create: `src/app/(public)/profile/page.tsx`

**Interfaces:**
- Consumes: `createClient()` từ `@/lib/supabase/server`, `createAdminClient()` từ `@/lib/supabase/admin`, `getUserPointsBalance` từ `@/lib/points`.

- [ ] **Step 1: Viết trang**

```tsx
// src/app/(public)/profile/page.tsx
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserPointsBalance } from '@/lib/points';

const PITCH = '#0F3C2C';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile');

  const admin = createAdminClient();
  const [balance, { data: history }] = await Promise.all([
    getUserPointsBalance(admin, user.id),
    admin
      .from('point_transactions')
      .select('id, type, points, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Khách hàng';

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 pb-16 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold" style={{ color: PITCH }}>Xin chào, {displayName}</h1>
        <p className="text-sm text-muted-foreground mt-1">{user.email}</p>

        <div className="mt-6 rounded-2xl border p-6" style={{ borderColor: '#E6E2D6', background: '#F4EEE1' }}>
          <p className="text-sm text-muted-foreground">Điểm tích lũy hiện có</p>
          <p className="text-3xl font-bold mt-1" style={{ color: PITCH }}>{balance} điểm</p>
          <p className="text-xs text-muted-foreground mt-1">Tương đương {(balance * 1000).toLocaleString('vi-VN')}đ — dùng để giảm giá khi đặt sân.</p>
        </div>

        <h2 className="text-lg font-bold mt-8 mb-3" style={{ color: PITCH }}>Lịch sử điểm</h2>
        {!history || history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có giao dịch điểm nào.</p>
        ) : (
          <div className="space-y-2">
            {history.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-border py-2.5">
                <div>
                  <p className="text-foreground">{t.note}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(t.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                </div>
                <span className={t.points > 0 ? 'font-bold text-green-600' : 'font-bold text-red-500'}>
                  {t.points > 0 ? '+' : ''}{t.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: thành công.

- [ ] **Step 3: Kiểm tra**

Run: `curl -s -D - -o /dev/null http://localhost:3000/profile --max-time 5`
Expected: `307` redirect tới `/login?next=%2Fprofile` (chưa đăng nhập) — xác nhận trang không còn 404 nữa, và đòi đăng nhập đúng như mong đợi.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/profile/page.tsx"
git commit -m "feat(points): thêm trang /profile hiện điểm tích lũy + lịch sử (trước đó là link chết)"
```

---

### Task 7: UI dùng điểm trong `BookingWidget`

**Files:**
- Modify: `src/components/sports/BookingWidget.tsx`

**Interfaces:**
- Consumes: `useAuth()` từ `@/components/providers/AuthProvider` (đã có, dùng trong `Navbar.tsx` theo mẫu `const { user } = useAuth();`), API `GET /api/points/balance` (Task 5).
- Produces: `POST /api/bookings` được gọi kèm `points_used` trong body (khớp field đã thêm ở Task 4).

- [ ] **Step 1: Thêm state + fetch số dư điểm**

Thêm import ở đầu file:

```ts
import { useAuth } from '@/components/providers/AuthProvider';
```

Trong component, sau khai báo `const [blockedSlots, ...]`, thêm:

```ts
  const { user } = useAuth();
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [pointsUsed,    setPointsUsed]    = useState(0);

  useEffect(() => {
    if (!user) { setPointsBalance(null); setPointsUsed(0); return; }
    fetch('/api/points/balance')
      .then(r => r.ok ? r.json() : { balance: null })
      .then(d => setPointsBalance(d.balance ?? null))
      .catch(() => setPointsBalance(null));
  }, [user]);
```

- [ ] **Step 2: Tính giá sau giảm**

Sau dòng `const totalPrice = priceInfo ? priceInfo.price * duration : 0;`, thêm:

```ts
  const maxPointsUsable = pointsBalance !== null
    ? Math.min(pointsBalance, Math.floor(totalPrice / 1000))
    : 0;
  const pointsDiscount  = pointsUsed * 1000;
  const finalPrice      = totalPrice - pointsDiscount;
```

Mỗi khi `selectedSlot`/`duration` đổi, `pointsUsed` cũ có thể vượt `maxPointsUsable` mới — thêm effect kẹp lại:

```ts
  useEffect(() => {
    if (pointsUsed > maxPointsUsable) setPointsUsed(maxPointsUsable);
  }, [maxPointsUsable, pointsUsed]);
```

- [ ] **Step 3: Gửi `points_used` lúc submit**

Trong `handleSubmit`, sửa phần `body: JSON.stringify({...})` — thêm field:

```ts
        body: JSON.stringify({
          court_id:       selectedCourt.id,
          court_name:     selectedCourt.name,
          venue_type:     selectedCourt.type,
          booking_date:   format(selectedDate, 'yyyy-MM-dd'),
          start_time:     selectedSlot,
          end_time:       endTime,
          duration,
          total_price:    totalPrice,
          payment_method: paymentMethod,
          user_name:      guestName.trim() || null,
          user_phone:     guestPhone.trim(),
          user_email:     guestEmail.trim(),
          points_used:    pointsUsed,
        }),
```

- [ ] **Step 4: Thêm UI chọn điểm ở bước "confirm"**

Trong khối `/* ── CONFIRM ─────────────────────────────────── */`, ngay sau div "Booking summary" (đoạn kết thúc bằng `</div>` trước `{/* Contact info */}`), chèn thêm:

```tsx
          {/* Dùng điểm tích lũy */}
          {user ? (
            pointsBalance !== null && pointsBalance > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-amber-800">Dùng điểm tích lũy</p>
                  <p className="text-xs text-amber-700">Bạn có {pointsBalance} điểm</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPointsUsable}
                  value={pointsUsed}
                  onChange={(e) => setPointsUsed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-amber-700 mt-1">
                  <span>Dùng {pointsUsed} điểm (-{formatCurrency(pointsDiscount)})</span>
                  <span>Tối đa {maxPointsUsable} điểm</span>
                </div>
              </div>
            )
          ) : (
            <p className="text-xs text-gray-500">
              <a href="/login" className="text-sports-primary underline">Đăng nhập</a> để tích & dùng điểm cho lần đặt sân này.
            </p>
          )}
```

- [ ] **Step 5: Hiện giá sau giảm ở khối "Tổng tiền" trong bước confirm**

Trong cùng khối "Booking summary" của bước confirm, tìm đoạn:

```tsx
            <div className="flex justify-between font-bold text-base border-t border-sports-primary/20 pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-sports-primary">{formatCurrency(totalPrice)}</span>
            </div>
```

Sửa thành (thêm dòng giảm giá khi có dùng điểm, đổi số hiển thị cuối thành `finalPrice`):

```tsx
            {pointsUsed > 0 && (
              <div className="flex justify-between text-sm text-amber-700">
                <span>Giảm giá ({pointsUsed} điểm)</span>
                <span>-{formatCurrency(pointsDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-sports-primary/20 pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-sports-primary">{formatCurrency(finalPrice)}</span>
            </div>
```

- [ ] **Step 6: Hiện giá sau giảm ở bước "success"**

Trong khối `/* ── SUCCESS ─────────────────────────────────── */`, tìm đoạn:

```tsx
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-sports-primary">{formatCurrency(totalPrice)}</span>
            </div>
```

Sửa giống Step 5 (thêm dòng giảm giá nếu có, đổi số cuối thành `finalPrice`):

```tsx
            {pointsUsed > 0 && (
              <div className="flex justify-between text-sm text-amber-700">
                <span>Giảm giá ({pointsUsed} điểm)</span>
                <span>-{formatCurrency(pointsDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-sports-primary">{formatCurrency(finalPrice)}</span>
            </div>
```

Cũng sửa dòng "Vui lòng chuyển ... " trong khối thanh toán chuyển khoản (ngay dưới) từ `{formatCurrency(totalPrice)}` thành `{formatCurrency(finalPrice)}` — khách chuyển khoản đúng số tiền đã giảm, không phải giá gốc.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: thành công, không lỗi TypeScript/ESLint (biến `finalPrice`, `pointsDiscount`, `pointsUsed`, `pointsBalance`, `maxPointsUsable`, `user` đều đã khai báo ở Step 1-2).

- [ ] **Step 8: Kiểm tra thủ công bằng trình duyệt**

1. Đăng nhập bằng tài khoản đã có điểm (vd tài khoản vừa tích điểm ở Task 3).
2. Vào `/sports/badminton`, chọn sân/ngày/giờ → "Tiếp tục".
3. Ở bước xác nhận, xác nhận thấy khối "Dùng điểm tích lũy" với thanh trượt, kéo thử → "Tổng tiền" giảm đúng theo công thức `điểm × 1.000đ`.
4. Đặt sân → ở bước thành công, "Tổng tiền" hiển thị đúng số đã giảm.
5. Mở tab ẩn danh (chưa đăng nhập), lặp lại bước 2-3 → xác nhận thấy dòng "Đăng nhập để tích & dùng điểm" thay cho thanh trượt.

Expected: đúng như trên, không lỗi console.

- [ ] **Step 9: Commit**

```bash
git add src/components/sports/BookingWidget.tsx
git commit -m "feat(points): thêm UI dùng điểm tích lũy trong luồng đặt sân"
```

---

### Task 8: Admin bookings list — hiện điểm đã dùng

**Files:**
- Modify: `src/app/admin/bookings/page.tsx`

**Interfaces:**
- Không thêm API/type mới — chỉ đọc thêm 2 cột đã có sẵn trong bảng `bookings` từ Task 1 (`points_used`, `points_discount_amount`), vốn đã được trả về bởi `GET /api/admin/bookings` vì route đó dùng `select('*')`.

- [ ] **Step 1: Thêm field vào interface `Booking`**

Tìm interface `Booking` (đầu file `src/app/admin/bookings/page.tsx`), thêm 2 field:

```ts
interface Booking {
  id: string;
  user_email: string;
  user_name: string | null;
  user_phone: string | null;
  court_name: string;
  venue_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number;
  points_used: number;
  points_discount_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  recurring_id?: string | null;
}
```

- [ ] **Step 2: Hiện số tiền thực thu ở cột "Tổng tiền"**

Tìm đoạn (trong `<td>` "Tổng tiền"):

```tsx
                      {/* Tổng tiền */}
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-sports-primary">{formatCurrency(b.total_price)}</p>
                      </td>
```

Sửa thành:

```tsx
                      {/* Tổng tiền */}
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-sports-primary">
                          {formatCurrency(b.total_price - (b.points_discount_amount || 0))}
                        </p>
                        {b.points_used > 0 && (
                          <p className="text-[10px] text-amber-600 mt-0.5">
                            Đã giảm {b.points_used} điểm (giá gốc {formatCurrency(b.total_price)})
                          </p>
                        )}
                      </td>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: thành công.

- [ ] **Step 4: Kiểm tra**

Mở `/admin/bookings`, tìm booking đã dùng điểm ở Task 7 Step 8 — xác nhận cột "Tổng tiền" hiện số đã giảm + dòng chú thích nhỏ "Đã giảm N điểm (giá gốc ...)".

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/bookings/page.tsx
git commit -m "feat(points): hiện số điểm đã dùng + giá thực thu trên trang admin đặt sân"
```

---

## Self-Review Notes

- Spec coverage: bảng `point_transactions` + cột mới → Task 1. Tích điểm khi confirm → Task 3. Dùng điểm khi đặt (validate đăng nhập, đủ điểm, ≤100% giá trị) → Task 4. Trang `/profile` (sửa link chết) → Task 6. UI chọn dùng điểm + hiện đăng nhập cho khách vãng lai → Task 7. Admin thấy số thực thu → Task 8. API số dư cho UI đọc → Task 5.
- Không có placeholder/TBD — mọi step có code đầy đủ.
- Type consistency: `getUserPointsBalance(admin, userId)`, `awardPointsForBooking(admin, booking)`, `redeemPoints(admin, { userId, bookingId, points })` định nghĩa ở Task 2, dùng nguyên signature đó ở Task 3/4/5/6 — không đổi tên/thứ tự tham số giữa các task.
- Ngoài phạm vi (đã ghi trong spec): hoàn điểm khi huỷ booking, tích điểm cho café/tiệc cưới, banner quảng bá tạo tài khoản.

