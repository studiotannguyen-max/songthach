# Admin: đăng nhập mật khẩu + đăng xuất + dashboard số liệu thật — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đăng nhập admin bằng email+mật khẩu (tách khỏi luồng magic-link của khách hàng), nút "Đăng xuất" hoạt động, và dashboard `/admin` hiển thị số liệu thật từ Supabase thay vì data giả hardcode.

**Architecture:** Next.js 14 App Router (`src/app`), Supabase (`@supabase/ssr` cho browser/server client, `@supabase/supabase-js` cho service-role admin client). Middleware ở `src/middleware.ts` bảo vệ route `/admin/*` và `/api/admin/*`. Các trang admin hiện tại đều theo pattern: client component `'use client'` fetch dữ liệu từ `/api/admin/...` (route handler dùng `requireAdmin()` rồi `createAdminClient()`).

**Tech Stack:** Next.js 14.2 (turbo), TypeScript, Supabase Auth + Postgres, Tailwind CSS, lucide-react, date-fns.

## Global Constraints

- Không có test framework tự động trong repo (không Jest/Vitest/Playwright config). Verify bằng `npm run build` (type-check + lint) và kiểm tra thủ công qua `curl` / browser — không viết unit test giả.
- Màu theme dùng hex trong CSS var — KHÔNG dùng opacity modifier kiểu `bg-background/95` (xem `src/app/globals.css`). Các class như `sports-primary`, `wedding-accent`, `status-*`, `admin-card`, `sports-btn` đã tồn tại sẵn trong `globals.css` — chỉ tái sử dụng, không tạo class mới.
- Không commit secret (mật khẩu, service-role key) vào git.
- Mỗi task kết thúc bằng một commit riêng.

---

### Task 1: Set mật khẩu khởi tạo cho tài khoản admin

**Files:**
- Create tạm: `scripts/set-admin-password.mjs` (xoá ngay sau khi chạy xong, KHÔNG commit)

**Interfaces:**
- Không ảnh hưởng code khác — chỉ thay đổi dữ liệu trong Supabase Auth.

- [ ] **Step 1: Viết script set password**

```js
// scripts/set-admin-password.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const EMAIL = 'studiotannguyen@gmail.com';
const PASSWORD = 'TinhTe91';

const { data: list, error: listError } = await admin.auth.admin.listUsers();
if (listError) { console.error(listError); process.exit(1); }

const target = list.users.find((u) => u.email?.toLowerCase() === EMAIL);
if (!target) { console.error('User not found:', EMAIL); process.exit(1); }

const { error } = await admin.auth.admin.updateUserById(target.id, { password: PASSWORD });
if (error) { console.error(error); process.exit(1); }

console.log('Password set OK for', EMAIL);
```

- [ ] **Step 2: Chạy script**

Run: `node scripts/set-admin-password.mjs`
Expected output: `Password set OK for studiotannguyen@gmail.com`

- [ ] **Step 3: Xoá script (không để lại trong repo)**

Run: `rm scripts/set-admin-password.mjs && rmdir scripts 2>/dev/null || true`

- [ ] **Step 4: Không commit gì ở bước này** (đây là thay đổi dữ liệu, không phải code).

---

### Task 2: Trang đăng nhập admin `/admin/login`

**Files:**
- Create: `src/app/admin/login/page.tsx`

**Interfaces:**
- Dùng `createClient()` từ `@/lib/supabase/client` (đã có, không đổi).
- Sau khi `signInWithPassword()` thành công → `window.location.href = '/admin'` (hard navigation để middleware nhận cookie mới).

- [ ] **Step 1: Viết trang đăng nhập**

```tsx
// src/app/admin/login/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError('Email hoặc mật khẩu không đúng.');
      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-sports-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">ST</div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Song Thạch</p>
            <p className="text-gray-400 text-xs">Admin Dashboard</p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Đăng nhập quản trị</h1>
        <p className="text-gray-500 text-sm mb-6">Dành cho quản trị viên.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all text-sm disabled:opacity-50"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full sports-btn py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Đang đăng nhập...</>
            ) : (
              <>Đăng nhập <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <Link href="/" className="block text-center text-xs text-gray-400 mt-6 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check / build**

Run: `npm run build`
Expected: build thành công, không lỗi TypeScript ở `src/app/admin/login/page.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/login/page.tsx
git commit -m "feat(admin): thêm trang đăng nhập admin bằng email + mật khẩu"
```

---

### Task 3: Middleware redirect tới `/admin/login` (và tránh vòng lặp redirect)

**Files:**
- Modify: `src/middleware.ts:29-42`

**Interfaces:**
- Không đổi signature `middleware()`, chỉ đổi logic xác định `isAdminPage` và đích redirect.

- [ ] **Step 1: Sửa logic `isAdminPage` để loại trừ `/admin/login`, và đổi đích redirect**

Trong `src/middleware.ts`, thay đoạn:

```ts
  const path        = request.nextUrl.pathname;
  const isAdminPage = path === '/admin' || path.startsWith('/admin/');
  const isAdminApi  = path.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    if (!user) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
```

bằng:

```ts
  const path        = request.nextUrl.pathname;
  const isAdminLogin = path === '/admin/login';
  const isAdminPage  = (path === '/admin' || path.startsWith('/admin/')) && !isAdminLogin;
  const isAdminApi   = path.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    if (!user) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
```

(Phần còn lại của hàm — kiểm tra `isAdminUser`, redirect `/` nếu không phải admin — giữ nguyên không đổi.)

- [ ] **Step 2: Build + kiểm tra thủ công**

Run: `npm run build && npm run start &` (hoặc `npm run dev`), sau đó:

```bash
curl -s -D - -o /dev/null http://localhost:3000/admin --max-time 5
curl -s -D - -o /dev/null http://localhost:3000/admin/login --max-time 5
```

Expected:
- `/admin` (chưa đăng nhập) → `307` với `location: /admin/login?next=%2Fadmin`.
- `/admin/login` → `200` (không bị redirect, không vòng lặp).

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(admin): redirect chưa đăng nhập tới /admin/login, tránh vòng lặp redirect"
```

---

### Task 4: Nối nút "Đăng xuất"

**Files:**
- Modify: `src/app/admin/layout.tsx`

**Interfaces:**
- Dùng `createClient()` từ `@/lib/supabase/client`.

- [ ] **Step 1: Thêm import và handler, nối `onClick`**

Trong `src/app/admin/layout.tsx`, thêm import:

```ts
import { createClient } from '@/lib/supabase/client';
```

Thêm trong component, trước `return`:

```tsx
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }
```

Sửa nút đăng xuất từ:

```tsx
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full">
            <LogOut size={17} /> Đăng xuất
          </button>
```

thành:

```tsx
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full">
            <LogOut size={17} /> Đăng xuất
          </button>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: thành công, không lỗi TypeScript.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "fix(admin): nối nút Đăng xuất (trước đó không có onClick)"
```

---

### Task 5: API `/api/admin/dashboard-stats`

**Files:**
- Create: `src/app/api/admin/dashboard-stats/route.ts`

**Interfaces:**
- Produces JSON: `{ bookingsToday: number, revenueThisMonth: number, newCustomers30d: number, courtsInUse: number, totalCourts: number, recentBookings: Array<{ id, user_name, user_email, court_name, venue_type, booking_date, start_time, end_time, status }>, weddingLeads: Array<{ id, contact_name, phone, event_date, table_count, status }> }`.
- Consumes: `requireAdmin()` từ `@/lib/auth`, `createAdminClient()` từ `@/lib/supabase/admin` (cả hai đã có sẵn, dùng nguyên).

- [ ] **Step 1: Viết route handler**

```ts
// src/app/api/admin/dashboard-stats/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

const TOTAL_COURTS = 7; // 3 cầu lông + 3 bóng đá 5 + 1 bóng đá 7, xem src/app/admin/venues/page.tsx

export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const now           = new Date();
  const today          = now.toISOString().slice(0, 10);
  const nowTime        = now.toTimeString().slice(0, 5);
  const monthStart     = `${today.slice(0, 7)}-01`;
  const thirtyDaysAgo  = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    bookingsTodayRes,
    monthBookingsRes,
    newCustomersRes,
    todayConfirmedRes,
    recentBookingsRes,
    weddingLeadsRes,
  ] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('booking_date', today).neq('status', 'cancelled'),
    supabase.from('bookings').select('total_price')
      .gte('booking_date', monthStart).lte('booking_date', today)
      .in('status', ['confirmed', 'completed']),
    supabase.from('users').select('id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo),
    supabase.from('bookings').select('start_time, end_time')
      .eq('booking_date', today).eq('status', 'confirmed'),
    supabase.from('bookings')
      .select('id, user_name, user_email, court_name, venue_type, booking_date, start_time, end_time, status')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('wedding_inquiries')
      .select('id, contact_name, phone, event_date, table_count, status')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false }).limit(3),
  ]);

  const revenueThisMonth = (monthBookingsRes.data ?? []).reduce(
    (sum, b) => sum + (b.total_price ?? 0), 0,
  );
  const courtsInUse = (todayConfirmedRes.data ?? []).filter(
    (b) => b.start_time <= nowTime && nowTime < b.end_time,
  ).length;

  return NextResponse.json({
    bookingsToday:    bookingsTodayRes.count ?? 0,
    revenueThisMonth,
    newCustomers30d:  newCustomersRes.count ?? 0,
    courtsInUse,
    totalCourts:      TOTAL_COURTS,
    recentBookings:   recentBookingsRes.data ?? [],
    weddingLeads:     weddingLeadsRes.data ?? [],
  });
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: thành công.

- [ ] **Step 3: Kiểm tra thủ công (route phải đòi đăng nhập)**

Run: `npm run dev` (terminal riêng), sau đó:

```bash
curl -s http://localhost:3000/api/admin/dashboard-stats --max-time 5
```

Expected: `{"error":"Chưa đăng nhập"}` (vì curl không có cookie đăng nhập) — xác nhận route được bảo vệ đúng.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/dashboard-stats/route.ts
git commit -m "feat(admin): thêm API tổng hợp số liệu dashboard từ dữ liệu thật"
```

---

### Task 6: Dashboard `/admin` dùng số liệu thật

**Files:**
- Modify: `src/app/admin/page.tsx` (viết lại toàn bộ file)

**Interfaces:**
- Consumes: `GET /api/admin/dashboard-stats` (Task 5) — response shape như trên.
- Consumes: `formatCurrency(amount: number): string` từ `@/lib/utils` (đã có).

- [ ] **Step 1: Viết lại `src/app/admin/page.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Users, TrendingUp, Clock, ArrowUpRight, CheckCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardBooking {
  id: string;
  user_name: string | null;
  user_email: string;
  court_name: string;
  venue_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface DashboardLead {
  id: string;
  contact_name: string;
  phone: string;
  event_date: string | null;
  table_count: number | null;
  status: string;
}

interface DashboardStats {
  bookingsToday: number;
  revenueThisMonth: number;
  newCustomers30d: number;
  courtsInUse: number;
  totalCourts: number;
  recentBookings: DashboardBooking[];
  weddingLeads: DashboardLead[];
}

const BOOKING_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Chờ xác nhận', cls: 'status-pending' },
  confirmed: { label: 'Đã xác nhận',  cls: 'status-deposit_paid' },
  completed: { label: 'Hoàn thành',   cls: 'status-completed' },
  cancelled: { label: 'Đã hủy',       cls: 'status-cancelled' },
};

const WEDDING_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  new:       { label: 'Mới',          cls: 'status-new' },
  contacted: { label: 'Đã liên hệ',  cls: 'status-contacted' },
  quoted:    { label: 'Đã báo giá',   cls: 'status-quoted' },
  booked:    { label: 'Đã đặt cọc',  cls: 'status-deposit_paid' },
  cancelled: { label: 'Huỷ',          cls: 'status-cancelled' },
};

const VENUE_LABEL: Record<string, string> = {
  badminton:  'Cầu lông',
  football_5: 'Bóng đá 5',
  football_7: 'Bóng đá 7',
};

export default function AdminDashboard() {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <RefreshCw size={20} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  const STATS = [
    { label: 'Đặt sân hôm nay',     value: String(stats.bookingsToday),                  icon: Calendar,   color: 'bg-blue-500'   },
    { label: 'Doanh thu tháng này', value: formatCurrency(stats.revenueThisMonth),        icon: TrendingUp, color: 'bg-green-500'  },
    { label: 'Khách hàng mới',      value: String(stats.newCustomers30d),                 icon: Users,      color: 'bg-purple-500' },
    { label: 'Sân đang sử dụng',    value: `${stats.courtsInUse}/${stats.totalCourts}`,   icon: Clock,      color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">
            {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-xl">
          <CheckCircle size={14} />
          Hệ thống hoạt động bình thường
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="admin-card flex items-start gap-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 truncate">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Đặt sân gần đây</h2>
            <a href="/admin/bookings" className="text-xs text-sports-primary hover:underline flex items-center gap-1">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          {stats.recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Chưa có lượt đặt sân nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Khách hàng</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Sân & Giờ</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentBookings.map((b) => {
                    const cfg = BOOKING_STATUS_MAP[b.status] ?? BOOKING_STATUS_MAP.pending;
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900">{b.user_name || b.user_email}</p>
                          <p className="text-xs text-gray-400">{format(new Date(b.booking_date), 'dd/MM/yyyy', { locale: vi })}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-gray-700">{b.court_name} · {VENUE_LABEL[b.venue_type] ?? b.venue_type}</p>
                          <p className="text-xs text-gray-400">{b.start_time}–{b.end_time}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Wedding leads */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Yêu cầu tiệc cưới</h2>
            <a href="/admin/wedding" className="text-xs text-wedding-accent hover:underline flex items-center gap-1">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          {stats.weddingLeads.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Chưa có yêu cầu mới.</p>
          ) : (
            <div className="space-y-3">
              {stats.weddingLeads.map((lead) => {
                const cfg = WEDDING_STATUS_MAP[lead.status] ?? WEDDING_STATUS_MAP.new;
                return (
                  <div key={lead.id} className="border border-gray-100 rounded-xl p-3 hover:border-wedding-accent/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-semibold text-sm text-gray-900 leading-tight">{lead.contact_name}</p>
                      <span className={`status-badge ${cfg.cls} shrink-0`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {lead.event_date ? format(new Date(lead.event_date), 'dd/MM/yyyy', { locale: vi }) : 'Chưa rõ ngày'} · {lead.table_count ?? '?'} bàn
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{lead.phone}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <h2 className="font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Quản lý đặt sân', href: '/admin/bookings', color: 'bg-sports-light text-sports-primary border-sports-primary/20' },
            { label: 'Cập nhật bảng giá', href: '/admin/venues',  color: 'bg-orange-50 text-orange-700 border-orange-200' },
            { label: 'Quản lý voucher', href: '/admin/vouchers',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Yêu cầu tiệc cưới', href: '/admin/wedding', color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map((a) => (
            <a key={a.label} href={a.href} className={`border rounded-xl px-4 py-3 text-sm font-medium text-center hover:opacity-80 transition-opacity ${a.color}`}>
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Lưu ý: các nút "Thao tác nhanh" đổi từ chỉ trỏ tới `/admin/bookings/new` (404), `/admin/settings` (404), `#` (rỗng) sang 4 trang admin đã tồn tại thật (`bookings`, `venues`, `vouchers`, `wedding`), để không để lại link chết trong lúc đang sửa chính file này. Trang `/admin/settings` sẽ được tạo ở Phần 2 — lúc đó có thể thêm lại link "Cài đặt" nếu cần.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build thành công, không lỗi TypeScript/ESLint.

- [ ] **Step 3: Kiểm tra thủ công bằng trình duyệt**

1. `npm run dev`
2. Mở `http://localhost:3000/admin/login`, đăng nhập bằng `studiotannguyen@gmail.com` / mật khẩu đã set ở Task 1.
3. Xác nhận redirect vào `/admin`, dashboard hiển thị số liệu (không phải "12", "28.500.000đ" hardcode cũ — số liệu phải khớp dữ liệu thật, có thể là 0 nếu chưa có booking).
4. Bấm nút "Đăng xuất" ở sidebar → xác nhận chuyển về `/admin/login` và truy cập lại `/admin` bị redirect về login (đã đăng xuất thật).

Expected: tất cả đúng như trên, không lỗi console.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): dashboard dùng số liệu thật từ /api/admin/dashboard-stats"
```

---

## Self-Review Notes (đã kiểm tra trước khi đưa cho người thực thi)

- Spec coverage: cả 3 mục trong spec (đăng nhập mật khẩu, nút đăng xuất, dashboard số liệu thật) đều có task tương ứng (Task 1-4: đăng nhập+đăng xuất; Task 5-6: dashboard).
- Không có placeholder/TBD — mọi step có code đầy đủ.
- Type/field names khớp giữa Task 5 (API trả về) và Task 6 (interface client) — đã đối chiếu: `bookingsToday`, `revenueThisMonth`, `newCustomers30d`, `courtsInUse`, `totalCourts`, `recentBookings`, `weddingLeads`, field từng item trong `recentBookings`/`weddingLeads` khớp 1:1.
- Ngoài phạm vi: trang `/admin/users`, `/admin/settings`, báo cáo doanh thu theo tháng — để Phần 2/3.
