# Lock chéo Sân 7A ↔ Sân 5A/5B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khi khách hoặc admin đặt Sân 7A, hệ thống tự khoá Sân 5A + Sân 5B ở cùng khung giờ (và ngược lại), để tránh double-book thực tế do Sân 7A nằm chung diện tích với 2 sân này.

**Architecture:** Một hàm helper tĩnh (`getLockGroupCourtIds`) trả về tập `court_id` cần xét (sân gốc + sân bị lock chéo). Ba điểm trong code hiện đang lọc theo `eq('court_id', court_id)` (kiểm tra trùng lịch khi đặt, kiểm tra khoá bảo trì, và hiển thị slot đã đặt cho widget) đổi sang `in('court_id', getLockGroupCourtIds(court_id))`. Không có schema DB mới — trạng thái lock luôn suy ra trực tiếp từ `bookings`/`court_blocks` hiện có.

**Tech Stack:** Next.js App Router API routes, Supabase (service-role client), TypeScript. Không có test framework trong repo — xác minh bằng cách chạy dev server thật và gọi API qua `curl`/script Node tạm thời (đúng quy ước đã dùng trong project này, xem `scripts/seed-bookings.mjs`).

## Global Constraints

- Nhóm lock: `fb7-1` (Sân 7A) ↔ `fb5-1` (Sân 5A), `fb5-2` (Sân 5B). `fb5-3` (Sân 5C) không thuộc nhóm này.
- Lock 2 chiều, áp dụng cho cả khách đặt online và admin (đặt tay/định kỳ). Không có override.
- Khoá bảo trì (`court_blocks`) trên 1 sân trong nhóm phải lan sang sân liên kết.
- Hiển thị cho khách: giống slot đã đặt bình thường, không thêm nhãn giải thích.
- Không thêm bảng/cột DB. Không có dữ liệu cần dọn khi booking bị huỷ.
- Mọi test phải tự dọn dữ liệu mình tạo ra (project test trực tiếp trên Supabase production, không có DB riêng cho test).

---

### Task 1: Helper `getLockGroupCourtIds`

**Files:**
- Create: `src/lib/court-locks.ts`

**Interfaces:**
- Produces: `getLockGroupCourtIds(courtId: string): string[]` — trả về `[courtId, ...các court_id bị lock chéo]`. Dùng bởi Task 2, 3, 4.

- [ ] **Step 1: Tạo file `src/lib/court-locks.ts`**

```ts
// Các sân nằm chung diện tích vật lý — đặt 1 sân thì sân liên kết phải bị khoá cùng giờ.
// Sân 7A (fb7-1) chiếm đúng diện tích của Sân 5A (fb5-1) + Sân 5B (fb5-2). Sân 5C không liên quan.
const COURT_LOCK_GROUPS: Record<string, string[]> = {
  'fb7-1': ['fb5-1', 'fb5-2'],
  'fb5-1': ['fb7-1'],
  'fb5-2': ['fb7-1'],
};

export function getLockGroupCourtIds(courtId: string): string[] {
  return [courtId, ...(COURT_LOCK_GROUPS[courtId] ?? [])];
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: không có lỗi mới liên quan đến `court-locks.ts` (file build sạch — đây là hàm thuần, không có I/O nên type-check là đủ ở bước này; hành vi thực tế được xác minh end-to-end ở Task 2/3 qua API thật).

- [ ] **Step 3: Commit**

```bash
git add src/lib/court-locks.ts
git commit -m "feat: add court lock group helper for Sân 7A <-> Sân 5A/5B"
```

---

### Task 2: Chặn trùng lịch chéo nhóm khi khách đặt sân — `POST /api/bookings`

**Files:**
- Modify: `src/app/api/bookings/route.ts:1-8` (thêm import), `:148-176` (2 query trong `POST`)

**Interfaces:**
- Consumes: `getLockGroupCourtIds(courtId: string): string[]` từ Task 1.

- [ ] **Step 1: Thêm import**

Trong `src/app/api/bookings/route.ts`, sau dòng `import { getUserPointsBalance, redeemPoints, VND_PER_POINT } from '@/lib/points';` thêm:

```ts
import { getLockGroupCourtIds } from '@/lib/court-locks';
```

- [ ] **Step 2: Mở rộng conflict-check sang nhóm lock**

Tìm đoạn (trong `POST`):

```ts
    // Kiểm tra trùng lịch — 2 khoảng giao nhau khi: existing.start < new.end VÀ existing.end > new.start
    const { data: conflict } = await admin
      .from('bookings')
      .select('id')
      .eq('court_id', court_id)
      .eq('booking_date', booking_date)
      .in('status', ['pending', 'confirmed'])
      .lt('start_time', end_time)
      .gt('end_time', start_time)
      .limit(1);
```

Đổi `.eq('court_id', court_id)` thành `.in('court_id', getLockGroupCourtIds(court_id))`:

```ts
    // Kiểm tra trùng lịch — 2 khoảng giao nhau khi: existing.start < new.end VÀ existing.end > new.start
    // .in() thay .eq() vì 1 số sân nằm chung diện tích (xem getLockGroupCourtIds)
    const { data: conflict } = await admin
      .from('bookings')
      .select('id')
      .in('court_id', getLockGroupCourtIds(court_id))
      .eq('booking_date', booking_date)
      .in('status', ['pending', 'confirmed'])
      .lt('start_time', end_time)
      .gt('end_time', start_time)
      .limit(1);
```

- [ ] **Step 3: Mở rộng kiểm tra khoá bảo trì sang nhóm lock**

Tìm đoạn:

```ts
    // Kiểm tra sân có đang bị khoá bảo trì trong khung giờ này không
    const { data: blocks } = await admin
      .from('court_blocks')
      .select('start_time, end_time')
      .eq('court_id', court_id)
      .eq('block_date', booking_date);
```

Đổi thành:

```ts
    // Kiểm tra sân có đang bị khoá bảo trì trong khung giờ này không
    // (gồm cả sân liên kết — vd Sân 5A bảo trì thì Sân 7A cũng không đặt được)
    const { data: blocks } = await admin
      .from('court_blocks')
      .select('start_time, end_time')
      .in('court_id', getLockGroupCourtIds(court_id))
      .eq('block_date', booking_date);
```

- [ ] **Step 4: Chạy dev server**

Run: `npm run dev` (chạy ở terminal riêng/background, giữ chạy cho các bước test dưới)
Expected: server lên ở `http://localhost:3000` (hoặc port tiếp theo nếu 3000 đang bận — note lại port thực tế dùng cho các lệnh `curl` sau).

- [ ] **Step 5: Test — đặt Sân 7A trước, Sân 5A/5B phải bị chặn**

```bash
cd /d/songthach
TEST_DATE=$(date -d '+45 days' +%Y-%m-%d)
echo "Test date: $TEST_DATE"

# 1. Đặt Sân 7A lúc 21:00 — phải thành công (201)
curl -s -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb7-1\",\"court_name\":\"Sân 7A\",\"venue_type\":\"football_7\",
  \"booking_date\":\"$TEST_DATE\",\"start_time\":\"21:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0901111111\",\"user_email\":\"courtlock-test@example.com\"
}"

# 2. Đặt Sân 5A cùng giờ — phải bị chặn (409)
curl -s -o /dev/null -w "Sân 5A status: %{http_code}\n" -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb5-1\",\"court_name\":\"Sân 5A\",\"venue_type\":\"football_5\",
  \"booking_date\":\"$TEST_DATE\",\"start_time\":\"21:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0902222222\",\"user_email\":\"courtlock-test@example.com\"
}"

# 3. Đặt Sân 5B cùng giờ — phải bị chặn (409)
curl -s -o /dev/null -w "Sân 5B status: %{http_code}\n" -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb5-2\",\"court_name\":\"Sân 5B\",\"venue_type\":\"football_5\",
  \"booking_date\":\"$TEST_DATE\",\"start_time\":\"21:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0903333333\",\"user_email\":\"courtlock-test@example.com\"
}"

# 4. Đặt Sân 5C cùng giờ — KHÔNG thuộc nhóm lock, phải thành công (201)
curl -s -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb5-3\",\"court_name\":\"Sân 5C\",\"venue_type\":\"football_5\",
  \"booking_date\":\"$TEST_DATE\",\"start_time\":\"21:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0904444444\",\"user_email\":\"courtlock-test@example.com\"
}"
```

Expected: bước 1 trả `"success":true` (201); bước 2 và 3 in ra `status: 409`; bước 4 trả `"success":true` (201).

- [ ] **Step 6: Test ngược — đặt Sân 5A trước, Sân 7A phải bị chặn**

```bash
TEST_DATE2=$(date -d '+46 days' +%Y-%m-%d)

# 1. Đặt Sân 5A lúc 20:00 — phải thành công (201)
curl -s -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb5-1\",\"court_name\":\"Sân 5A\",\"venue_type\":\"football_5\",
  \"booking_date\":\"$TEST_DATE2\",\"start_time\":\"20:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0905555555\",\"user_email\":\"courtlock-test@example.com\"
}"

# 2. Đặt Sân 7A cùng giờ — phải bị chặn (409)
curl -s -o /dev/null -w "Sân 7A status: %{http_code}\n" -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb7-1\",\"court_name\":\"Sân 7A\",\"venue_type\":\"football_7\",
  \"booking_date\":\"$TEST_DATE2\",\"start_time\":\"20:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0906666666\",\"user_email\":\"courtlock-test@example.com\"
}"
```

Expected: bước 1 trả 201; bước 2 in ra `status: 409`.

- [ ] **Step 7: Test — khoá bảo trì trên Sân 5A phải lan sang Sân 7A**

```bash
TEST_DATE3=$(date -d '+47 days' +%Y-%m-%d)
```

Tạo 1 dòng `court_blocks` bảo trì cho Sân 5A bằng script tạm `scripts/_tmp-seed-block.mjs`:

```js
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const dateStr = process.argv[2];
const { data, error } = await supabase.from('court_blocks').insert({
  court_id: 'fb5-1', court_name: 'Sân 5A', venue_type: 'football_5',
  block_date: dateStr, start_time: '19:00', end_time: '20:00',
  reason: 'TEST — sẽ xoá ngay sau khi verify court-lock',
}).select('id').single();
if (error) { console.error('Lỗi:', error.message); process.exit(1); }
console.log('block_id:', data.id);
```

Run: `node scripts/_tmp-seed-block.mjs $TEST_DATE3` (ghi lại `block_id` in ra)

Thử đặt Sân 7A trùng khung giờ bảo trì đó — phải bị chặn (409):

```bash
curl -s -o /dev/null -w "Sân 7A (maintenance block) status: %{http_code}\n" -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{
  \"court_id\":\"fb7-1\",\"court_name\":\"Sân 7A\",\"venue_type\":\"football_7\",
  \"booking_date\":\"$TEST_DATE3\",\"start_time\":\"19:00\",\"duration\":1,
  \"payment_method\":\"pay_at_venue\",\"user_phone\":\"0908888888\",\"user_email\":\"courtlock-test@example.com\"
}"
```

Expected: in ra `status: 409` (lỗi "Sân đang bảo trì...").

Xoá dòng `court_blocks` test bằng `block_id` đã ghi lại ở trên (script tạm tương tự, hoặc thêm 1 dòng `.delete().eq('id', '<block_id>')` rồi chạy), sau đó xoá cả 2 file tạm:

```bash
rm scripts/_tmp-seed-block.mjs
```

- [ ] **Step 8: Dọn dữ liệu test booking (giữ lại id để Task 3 tái sử dụng trước khi xoá)**

Để Task 3 (GET availability) có dữ liệu thật để kiểm tra trước khi xoá, CHƯA dọn ngay — chuyển sang Task 3 trước, dọn ở Step cuối của Task 3.

- [ ] **Step 9: Commit**

```bash
git add src/app/api/bookings/route.ts
git commit -m "feat: block cross-court conflicts when booking Sân 7A or Sân 5A/5B"
```

---

### Task 3: Hiển thị slot bị lock trên widget — `GET /api/bookings`

**Files:**
- Modify: `src/app/api/bookings/route.ts:30-43` (2 query trong `GET`)

**Interfaces:**
- Consumes: `getLockGroupCourtIds` (đã import ở Task 2, dùng lại).

- [ ] **Step 1: Mở rộng query `bookings` và `court_blocks` trong `GET` sang nhóm lock**

Tìm đoạn:

```ts
  const supabase = createAdminClient();
  const [{ data }, { data: blocks }] = await Promise.all([
    supabase
      .from('bookings')
      .select('start_time, duration')
      .eq('court_id', court_id)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']),
    supabase
      .from('court_blocks')
      .select('start_time, end_time')
      .eq('court_id', court_id)
      .eq('block_date', date),
  ]);
```

Đổi thành:

```ts
  const supabase  = createAdminClient();
  const groupIds  = getLockGroupCourtIds(court_id);
  const [{ data }, { data: blocks }] = await Promise.all([
    supabase
      .from('bookings')
      .select('start_time, duration')
      .in('court_id', groupIds)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']),
    supabase
      .from('court_blocks')
      .select('start_time, end_time')
      .in('court_id', groupIds)
      .eq('block_date', date),
  ]);
```

- [ ] **Step 2: Test — slot của Sân 7A (từ Task 2) phải hiện "đã đặt" khi xem Sân 5A/5B**

Dùng booking đã tạo ở Task 2 Step 5 (Sân 7A, `$TEST_DATE`, `21:00`):

```bash
curl -s "http://localhost:3000/api/bookings?court_id=fb5-1&date=$TEST_DATE"
curl -s "http://localhost:3000/api/bookings?court_id=fb5-2&date=$TEST_DATE"
curl -s "http://localhost:3000/api/bookings?court_id=fb5-3&date=$TEST_DATE"
```

Expected: `fb5-1` và `fb5-2` đều trả `"booked_slots":["21:00"]` (chứa `21:00`); `fb5-3` trả `"booked_slots":["21:00"]` cũng đúng riêng cho chính nó (vì có booking thật ở Step 5.4) nhưng KHÔNG bị ảnh hưởng bởi booking Sân 7A — xác nhận bằng cách kiểm tra `fb5-3` vẫn chỉ có đúng 1 slot `21:00` (của chính nó), không có gì thêm từ nhóm lock của 7A.

- [ ] **Step 3: Dọn toàn bộ dữ liệu test của Task 2 + 3**

Viết script tạm `scripts/_tmp-cleanup.mjs`:

```js
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await supabase
  .from('bookings')
  .delete()
  .eq('user_email', 'courtlock-test@example.com')
  .select('id');

if (error) { console.error('Lỗi xoá:', error.message); process.exit(1); }
console.log(`Đã xoá ${data.length} booking test.`);
```

Run: `node scripts/_tmp-cleanup.mjs`
Expected: in ra `Đã xoá 6 booking test.` (3 ở Step 5 + 1 ở Step 5.4 (Sân 5C) + 2 ở Step 6 của Task 2).

Sau đó xoá file tạm: `rm scripts/_tmp-cleanup.mjs`

- [ ] **Step 4: Commit**

```bash
git add src/app/api/bookings/route.ts
git commit -m "feat: include linked-court bookings in availability widget"
```

---

### Task 4: Áp dụng lock cho admin đặt tay/định kỳ — `POST /api/admin/bookings/recurring`

**Files:**
- Modify: `src/app/api/admin/bookings/recurring/route.ts:1-6` (import), `:60-71` (2 query check trùng)

**Interfaces:**
- Consumes: `getLockGroupCourtIds` từ Task 1.

- [ ] **Step 1: Thêm import**

Sau dòng `import { VenueType } from '@/types';` thêm:

```ts
import { getLockGroupCourtIds } from '@/lib/court-locks';
```

- [ ] **Step 2: Mở rộng query check trùng sang nhóm lock**

Tìm đoạn:

```ts
  // Lấy các booking & khoá sân hiện có để kiểm tra trùng lịch cho từng ngày
  const [{ data: existing }, { data: blocks }] = await Promise.all([
    admin.from('bookings')
      .select('booking_date, start_time, end_time')
      .eq('court_id', court_id)
      .in('booking_date', dates)
      .in('status', ['pending', 'confirmed']),
    admin.from('court_blocks')
      .select('block_date, start_time, end_time')
      .eq('court_id', court_id)
      .in('block_date', dates),
  ]);
```

Đổi thành:

```ts
  // Lấy các booking & khoá sân hiện có để kiểm tra trùng lịch cho từng ngày
  // (gồm cả sân liên kết — xem getLockGroupCourtIds)
  const groupIds = getLockGroupCourtIds(court_id);
  const [{ data: existing }, { data: blocks }] = await Promise.all([
    admin.from('bookings')
      .select('booking_date, start_time, end_time')
      .in('court_id', groupIds)
      .in('booking_date', dates)
      .in('status', ['pending', 'confirmed']),
    admin.from('court_blocks')
      .select('block_date, start_time, end_time')
      .in('court_id', groupIds)
      .in('block_date', dates),
  ]);
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: không có lỗi mới.

- [ ] **Step 4: Test logic trực tiếp qua Supabase (không cần đăng nhập admin)**

Route này yêu cầu đăng nhập admin (`requireAdmin()`) nên không gọi qua HTTP được từ đây. Xác minh trực tiếp đúng câu query mà route giờ thực thi, bằng script tạm `scripts/_tmp-verify-recurring.mjs`:

```js
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const TEST_DATE = new Date();
TEST_DATE.setDate(TEST_DATE.getDate() + 47);
const dateStr = TEST_DATE.toISOString().slice(0, 10);

// 1. Seed: 1 booking Sân 5A (fb5-1) ngày test, 20:00-21:00
const { data: seeded, error: seedErr } = await supabase.from('bookings').insert({
  user_email: 'courtlock-test@example.com', user_phone: '0907777777',
  venue_type: 'football_5', court_id: 'fb5-1', court_name: 'Sân 5A',
  booking_date: dateStr, start_time: '20:00', end_time: '21:00', duration: 1,
  total_price: 120000, payment_method: 'pay_at_venue', status: 'confirmed',
}).select('id').single();
if (seedErr) { console.error('Seed lỗi:', seedErr.message); process.exit(1); }

// 2. Đúng câu query mà route recurring giờ thực thi khi court_id = 'fb7-1' (nhóm lock = fb7-1, fb5-1, fb5-2)
const groupIds = ['fb7-1', 'fb5-1', 'fb5-2'];
const { data: existing, error: queryErr } = await supabase.from('bookings')
  .select('booking_date, start_time, end_time')
  .in('court_id', groupIds)
  .in('booking_date', [dateStr])
  .in('status', ['pending', 'confirmed']);
if (queryErr) { console.error('Query lỗi:', queryErr.message); process.exit(1); }

const found = existing.some(b => b.booking_date === dateStr && b.start_time === '20:00');
console.log(found
  ? '✅ PASS: query nhóm lock thấy booking Sân 5A khi xét Sân 7A — recurring route sẽ skip ngày này đúng như mong đợi.'
  : '❌ FAIL: query không thấy booking Sân 5A — kiểm tra lại groupIds/logic.');

// 3. Dọn dữ liệu test
await supabase.from('bookings').delete().eq('id', seeded.id);
console.log('Đã xoá booking test.');
```

Run: `node scripts/_tmp-verify-recurring.mjs`
Expected: in ra `✅ PASS: ...` rồi `Đã xoá booking test.`

Sau đó xoá file tạm: `rm scripts/_tmp-verify-recurring.mjs`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/bookings/recurring/route.ts
git commit -m "feat: block cross-court conflicts in admin recurring bookings"
```

---

### Task 5: Production build check

**Files:** không tạo/sửa file mới — chỉ xác minh toàn bộ thay đổi build sạch.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: build thành công, không lỗi TypeScript/lint, tất cả route compile (giống baseline đã ghi nhận trước đây: 29/29 static pages — số trang có thể khác do các thay đổi khác không thuộc phạm vi này, miễn không có lỗi).

- [ ] **Step 2: Dừng dev server nếu còn chạy từ Task 2**

Run: `pkill -f "next dev"` (hoặc đóng terminal đang chạy `npm run dev`)

---

## Sau khi hoàn thành plan này (không thuộc phạm vi implementation plan — làm sau khi 5 task trên xong)

1. Manual QA của bạn trong admin UI thật (route `POST /api/admin/bookings/recurring` yêu cầu đăng nhập admin nên không tự động hoá được từ phía tôi): mở `/admin/bookings`, tạo 1 booking đơn cho Sân 5A vào 1 ngày/giờ bất kỳ, sau đó thử tạo "Đặt định kỳ" cho Sân 7A trùng đúng ngày/giờ đó — kỳ vọng ngày đó nằm trong danh sách `skipped` trả về.
2. `git push` lên `origin/main`.
3. Deploy VPS theo `docs/DEPLOY-VPS-LONGVAN.md` (hoặc skill `deploy-songthach` nếu áp dụng).
