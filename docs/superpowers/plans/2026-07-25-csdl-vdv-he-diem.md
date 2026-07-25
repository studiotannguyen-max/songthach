# CSDL VĐV & Hệ điểm trình độ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây CSDL vận động viên với hệ điểm trình A100–A500, sổ điểm minh bạch, trang quản trị nhập liệu (tay + Excel), và bảng xếp hạng công khai trên `songthach.com/giai-dau-rating`.

**Architecture:** Tích hợp vào Next.js 14 App Router + Supabase sẵn có. Logic điểm là hàm thuần trong `src/lib/rating.ts` (test bằng vitest, không đụng CSDL). Ghi dữ liệu qua API route dùng service-role (`requireAdmin` + `createAdminClient`), theo đúng pattern của `src/lib/points.ts` và `src/app/api/admin/*`. Sổ `rating_events` là nguồn sự thật; cột `band`/`progress_points` ở bảng `players` là số tính sẵn để truy vấn nhanh.

**Tech Stack:** Next.js 14, TypeScript, Supabase (Postgres + Storage + RLS), Tailwind, lucide-react, react-hot-toast, exceljs (đã có), vitest (thêm mới).

## Global Constraints

- **Không thêm SheetJS/`xlsx`** — dùng `exceljs` đã có trong `package.json`.
- **Điểm hiệu dụng = `band + progress_points`.** Band ∈ {100,200,300,400,500}. Sàn tuyệt đối: band 100, progress 0 (hiệu dụng 100). Không có A600 — ở band 500 progress tăng không giới hạn.
- **Sổ `rating_events` là nguồn sự thật.** Mọi thay đổi điểm ghi một dòng vào sổ; cột `band`/`progress_points` luôn = `deriveBandProgress(tổng điểm sổ)`.
- **`initial` event lưu giá trị hiệu dụng tuyệt đối** (300, 500…). Mọi event khác lưu **delta** (+50, −50…).
- **RLS bật trên mọi bảng.** Anon không đọc trực tiếp `players` (chứa `phone`); công khai đọc qua view `players_public` không có cột `phone`. Mọi ghi qua service-role.
- **SĐT không bao giờ ra công khai.** Chỉ hiện trong khu `/admin`.
- **Không có nút xoá VĐV** — chỉ bật/tắt `is_active`.
- **Copy tiếng Việt**, giọng đơn giản (chủ quán đọc). Theo pattern comment tiếng Việt trong migrations hiện có.
- **Xoá `public/mockup-giai-dau-rating.html` trước khi deploy** (task cuối).

---

## File Structure

**Logic thuần (test được, không đụng CSDL):**
- `src/lib/rating.ts` — `deriveBandProgress`, `applyPoints`, `effectivePoints`, `bandLabel`, `replayLedger`, hằng `BANDS`, type `Band`
- `src/lib/player-import.ts` — `normalizePhone`, `parseBand`, `parseDate`, `validateRow`, `reconcileImport`, các type

**Ghi CSDL (server-only):**
- `src/lib/players.ts` — `createPlayer`, `updatePlayer`, `adjustPoints`, `setActive`, `commitImport` — mỗi hàm ghi `rating_events` + cập nhật `players` trong cùng thao tác

**Migration:**
- `supabase/migrations/011_players_rating.sql`

**API routes:**
- `src/app/api/admin/players/route.ts` — GET danh sách, POST tạo mới
- `src/app/api/admin/players/[id]/route.ts` — GET một VĐV + sổ điểm, PATCH sửa hồ sơ/bật tắt
- `src/app/api/admin/players/[id]/points/route.ts` — POST cộng/trừ điểm
- `src/app/api/admin/players/import/route.ts` — POST đọc file → trả phân loại; PUT ghi các dòng đã chọn
- `src/app/api/players/route.ts` — GET công khai (đọc `players_public`)
- `src/app/api/players/[id]/route.ts` — GET công khai một VĐV + sổ điểm

**Trang quản trị:**
- `src/app/admin/players/page.tsx` — danh sách + tìm/lọc
- `src/app/admin/players/PlayerFormModal.tsx` — thêm/sửa + upload ảnh
- `src/app/admin/players/AdjustPointsModal.tsx` — cộng/trừ có xem trước
- `src/app/admin/players/nhap-excel/page.tsx` — nhập Excel 3 bước
- Sửa: `src/app/admin/layout.tsx` — thêm mục sidebar

**Trang công khai:**
- `src/app/(public)/giai-dau-rating/page.tsx` — trang chủ + top 10
- `src/app/(public)/giai-dau-rating/bang-xep-hang/page.tsx` — bảng xếp hạng đầy đủ
- `src/app/(public)/giai-dau-rating/vdv/[id]/page.tsx` — hồ sơ + sổ điểm
- `src/app/(public)/giai-dau-rating/the-le/page.tsx` — thể lệ
- `src/app/(public)/giai-dau-rating/giai.css` được **tái dùng** từ trang giai-cau-long-2026 (import chung tokens) — thực tế tạo `rating.css` riêng scoped `.rating-page`

**Test:**
- `src/lib/rating.test.ts`
- `src/lib/player-import.test.ts`
- `vitest.config.ts`

---

## Task 1: Cài vitest + hàm điểm cốt lõi `deriveBandProgress`

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/rating.ts`
- Test: `src/lib/rating.test.ts`
- Modify: `package.json` (thêm devDeps + script `test`)

**Interfaces:**
- Produces:
  - `type Band = 100 | 200 | 300 | 400 | 500`
  - `const BANDS: Band[]`
  - `function deriveBandProgress(effective: number): { band: Band; progress: number }`

- [ ] **Step 1: Cài vitest**

```bash
npm install -D vitest@^2.1.0
```

- [ ] **Step 2: Tạo `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Thêm script test vào `package.json`**

Trong khối `"scripts"`, thêm dòng:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Viết test thất bại cho `deriveBandProgress`**

Create `src/lib/rating.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { deriveBandProgress } from './rating';

describe('deriveBandProgress', () => {
  it('hiệu dụng 100 → A100 tiến độ 0 (sàn)', () => {
    expect(deriveBandProgress(100)).toEqual({ band: 100, progress: 0 });
  });
  it('dưới sàn → kẹp về A100 tiến độ 0', () => {
    expect(deriveBandProgress(50)).toEqual({ band: 100, progress: 0 });
    expect(deriveBandProgress(0)).toEqual({ band: 100, progress: 0 });
  });
  it('360 → A300 tiến độ 60', () => {
    expect(deriveBandProgress(360)).toEqual({ band: 300, progress: 60 });
  });
  it('460 → A400 tiến độ 60', () => {
    expect(deriveBandProgress(460)).toEqual({ band: 400, progress: 60 });
  });
  it('250 → A200 tiến độ 50', () => {
    expect(deriveBandProgress(250)).toEqual({ band: 200, progress: 50 });
  });
  it('500 → A500 tiến độ 0', () => {
    expect(deriveBandProgress(500)).toEqual({ band: 500, progress: 0 });
  });
  it('630 → A500 tiến độ 130 (không có A600)', () => {
    expect(deriveBandProgress(630)).toEqual({ band: 500, progress: 130 });
  });
});
```

- [ ] **Step 5: Chạy test, xác nhận fail**

Run: `npm test`
Expected: FAIL — `deriveBandProgress is not a function` / file không tồn tại.

- [ ] **Step 6: Viết `src/lib/rating.ts` tối thiểu**

```ts
// Hệ điểm trình độ A100–A500. Hàm thuần, không đụng CSDL — test bằng vitest.
// Điểm hiệu dụng = band + progress. Sổ rating_events là nguồn sự thật; band/progress
// luôn suy ra được bằng deriveBandProgress(tổng điểm sổ).

export type Band = 100 | 200 | 300 | 400 | 500;
export const BANDS: Band[] = [100, 200, 300, 400, 500];

/**
 * Suy ra band + tiến độ từ tổng điểm hiệu dụng.
 * Sàn tuyệt đối: A100 tiến độ 0 (hiệu dụng 100). Trần band: A500, tiến độ chạy tiếp không giới hạn.
 */
export function deriveBandProgress(effective: number): { band: Band; progress: number } {
  const e = Math.max(100, Math.round(effective));
  if (e >= 500) return { band: 500, progress: e - 500 };
  const band = (Math.floor(e / 100) * 100) as Band;
  return { band, progress: e - band };
}
```

- [ ] **Step 7: Chạy test, xác nhận pass**

Run: `npm test`
Expected: PASS (7 test trong nhóm deriveBandProgress).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/rating.ts src/lib/rating.test.ts
git commit -m "feat(rating): hàm deriveBandProgress + cài vitest"
```

---

## Task 2: `applyPoints`, `effectivePoints`, `bandLabel`, `replayLedger`

**Files:**
- Modify: `src/lib/rating.ts`
- Test: `src/lib/rating.test.ts`

**Interfaces:**
- Consumes: `deriveBandProgress`, `Band` (Task 1)
- Produces:
  - `function effectivePoints(p: { band: number; progress_points: number }): number`
  - `function applyPoints(band: number, progress: number, delta: number): { band: Band; progress: number }`
  - `function bandLabel(band: number): string`
  - `function replayLedger(events: { points: number }[]): { band: Band; progress: number; effective: number }`

- [ ] **Step 1: Viết test thất bại**

Thêm vào `src/lib/rating.test.ts`:

```ts
import { applyPoints, effectivePoints, bandLabel, replayLedger } from './rating';

describe('effectivePoints', () => {
  it('cộng band và tiến độ', () => {
    expect(effectivePoints({ band: 400, progress_points: 60 })).toBe(460);
  });
});

describe('bandLabel', () => {
  it('gắn tiền tố A', () => {
    expect(bandLabel(300)).toBe('A300');
    expect(bandLabel(500)).toBe('A500');
  });
});

describe('applyPoints', () => {
  it('A300 tiến độ 60 +100 → A400 tiến độ 60', () => {
    expect(applyPoints(300, 60, 100)).toEqual({ band: 400, progress: 60 });
  });
  it('A300 tiến độ 60 +50 → A400 tiến độ 10', () => {
    expect(applyPoints(300, 60, 50)).toEqual({ band: 400, progress: 10 });
  });
  it('A100 tiến độ 90 +60 → A200 tiến độ 50', () => {
    expect(applyPoints(100, 90, 60)).toEqual({ band: 200, progress: 50 });
  });
  it('A100 tiến độ 0 +450 → A500 tiến độ 50', () => {
    expect(applyPoints(100, 0, 450)).toEqual({ band: 500, progress: 50 });
  });
  it('A500 tiến độ 30 +100 → A500 tiến độ 130 (không lên A600)', () => {
    expect(applyPoints(500, 30, 100)).toEqual({ band: 500, progress: 130 });
  });
  it('A200 tiến độ 40 −40 → A200 tiến độ 0', () => {
    expect(applyPoints(200, 40, -40)).toEqual({ band: 200, progress: 0 });
  });
  it('A300 tiến độ 10 −50 → A200 tiến độ 60 (bút toán âm hạ band)', () => {
    expect(applyPoints(300, 10, -50)).toEqual({ band: 200, progress: 60 });
  });
  it('A100 tiến độ 0 −50 → vẫn A100 tiến độ 0 (sàn)', () => {
    expect(applyPoints(100, 0, -50)).toEqual({ band: 100, progress: 0 });
  });
  it('cộng 0 → không đổi', () => {
    expect(applyPoints(300, 40, 0)).toEqual({ band: 300, progress: 40 });
  });
});

describe('replayLedger', () => {
  it('cộng dồn: initial 300, +100, +50, −50 → A400 tiến độ 0, hiệu dụng 400', () => {
    const events = [{ points: 300 }, { points: 100 }, { points: 50 }, { points: -50 }];
    expect(replayLedger(events)).toEqual({ band: 400, progress: 0, effective: 400 });
  });
  it('sổ rỗng → sàn A100', () => {
    expect(replayLedger([])).toEqual({ band: 100, progress: 0, effective: 100 });
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `npm test`
Expected: FAIL — `applyPoints is not a function` (và các hàm khác).

- [ ] **Step 3: Thêm code vào `src/lib/rating.ts`**

```ts
/** Điểm hiệu dụng = band + tiến độ. */
export function effectivePoints(p: { band: number; progress_points: number }): number {
  return p.band + p.progress_points;
}

/** Nhãn hiển thị: 300 → "A300". */
export function bandLabel(band: number): string {
  return `A${band}`;
}

/**
 * Áp một khoản điểm (dương hoặc âm) lên (band, progress) hiện tại.
 * Delta bất kỳ — spec giải đấu sau này truyền +50; điều chỉnh tay truyền số admin nhập.
 */
export function applyPoints(band: number, progress: number, delta: number): { band: Band; progress: number } {
  return deriveBandProgress(band + progress + delta);
}

/** Chạy lại toàn bộ sổ điểm từ đầu — dùng để đối soát với cột đã lưu. */
export function replayLedger(events: { points: number }[]): { band: Band; progress: number; effective: number } {
  const sum = events.reduce((s, e) => s + e.points, 0);
  const { band, progress } = deriveBandProgress(sum);
  return { band, progress, effective: band + progress };
}
```

- [ ] **Step 4: Chạy test, xác nhận pass**

Run: `npm test`
Expected: PASS (toàn bộ, gồm nhóm mới).

- [ ] **Step 5: Commit**

```bash
git add src/lib/rating.ts src/lib/rating.test.ts
git commit -m "feat(rating): applyPoints, effectivePoints, bandLabel, replayLedger"
```

---

## Task 3: Migration 011 — bảng players, rating_events, view, RLS

**Files:**
- Create: `supabase/migrations/011_players_rating.sql`

**Interfaces:**
- Produces: bảng `players`, `rating_events`, view `players_public`. Các cột được API route ở task sau tham chiếu theo đúng tên dưới đây.

- [ ] **Step 1: Viết file migration**

Create `supabase/migrations/011_players_rating.sql`:

```sql
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
```

- [ ] **Step 2: Chạy migration trong Supabase SQL Editor**

Mở Supabase Dashboard → SQL Editor → dán toàn bộ nội dung file → Run.
Expected: "Success. No rows returned."

- [ ] **Step 3: Kiểm tra bảng đã tạo**

Trong SQL Editor chạy:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('players','rating_events','players_public');
```

Expected: 3 dòng.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/011_players_rating.sql
git commit -m "feat(rating): migration players + rating_events + RLS"
```

---

## Task 4: `src/lib/players.ts` — ghi hồ sơ + sổ điểm

**Files:**
- Create: `src/lib/players.ts`

**Interfaces:**
- Consumes: `applyPoints`, `effectivePoints`, `Band` (Task 1–2); `createAdminClient` (`@/lib/supabase/admin`); `SupabaseClient` type.
- Produces (được API route ở task sau gọi):
  - `type PlayerInput = { full_name: string; nickname?: string | null; phone?: string | null; avatar_url?: string | null; band: number; progress_points?: number; tested_at?: string | null; test_note?: string | null }`
  - `async function createPlayer(admin, input: PlayerInput): Promise<{ id: string }>`
  - `async function updatePlayer(admin, id: string, patch: Partial<PlayerInput>): Promise<void>`
  - `async function setActive(admin, id: string, isActive: boolean): Promise<void>`
  - `async function adjustPoints(admin, id: string, delta: number, note: string): Promise<{ band: number; progress_points: number }>`

- [ ] **Step 1: Viết `src/lib/players.ts`**

```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { applyPoints, effectivePoints } from './rating';

export type PlayerInput = {
  full_name: string;
  nickname?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  band: number;
  progress_points?: number;
  tested_at?: string | null;
  test_note?: string | null;
};

/**
 * Tạo hồ sơ mới + ghi dòng đầu tiên vào sổ điểm.
 * initial event lưu giá trị hiệu dụng tuyệt đối (band + tiến độ khởi đầu).
 */
export async function createPlayer(admin: SupabaseClient, input: PlayerInput): Promise<{ id: string }> {
  const progress = input.progress_points ?? 0;
  const { data, error } = await admin
    .from('players')
    .insert({
      full_name:       input.full_name,
      nickname:        input.nickname ?? null,
      phone:           input.phone ?? null,
      avatar_url:      input.avatar_url ?? null,
      band:            input.band,
      progress_points: progress,
      tested_at:       input.tested_at ?? null,
      test_note:       input.test_note ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;

  const effective = effectivePoints({ band: input.band, progress_points: progress });
  const { error: evErr } = await admin.from('rating_events').insert({
    player_id: data.id,
    points:    effective,
    reason:    'initial',
    note:      `Xếp trình ban đầu — A${input.band} · ${effective} điểm`,
  });
  if (evErr) throw evErr;
  return { id: data.id };
}

/** Sửa thông tin hồ sơ (không đụng điểm). Band/tiến độ chỉ đổi qua adjustPoints. */
export async function updatePlayer(admin: SupabaseClient, id: string, patch: Partial<PlayerInput>): Promise<void> {
  const allowed: Record<string, unknown> = {};
  for (const k of ['full_name', 'nickname', 'phone', 'avatar_url', 'tested_at', 'test_note'] as const) {
    if (k in patch) allowed[k] = (patch as Record<string, unknown>)[k];
  }
  if (Object.keys(allowed).length === 0) return;
  const { error } = await admin.from('players').update(allowed).eq('id', id);
  if (error) throw error;
}

export async function setActive(admin: SupabaseClient, id: string, isActive: boolean): Promise<void> {
  const { error } = await admin.from('players').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
}

/**
 * Cộng/trừ điểm: ghi một dòng manual_adjust + cập nhật band/progress đã tính sẵn.
 * Trả về band/progress mới để API phản hồi cho UI.
 */
export async function adjustPoints(
  admin: SupabaseClient,
  id: string,
  delta: number,
  note: string,
): Promise<{ band: number; progress_points: number }> {
  const { data: player, error: pErr } = await admin
    .from('players').select('band, progress_points').eq('id', id).single();
  if (pErr) throw pErr;

  const next = applyPoints(player.band, player.progress_points, delta);

  const { error: evErr } = await admin.from('rating_events').insert({
    player_id: id, points: delta, reason: 'manual_adjust', note,
  });
  if (evErr) throw evErr;

  const { error: uErr } = await admin
    .from('players').update({ band: next.band, progress_points: next.progress }).eq('id', id);
  if (uErr) throw uErr;

  return { band: next.band, progress_points: next.progress };
}
```

- [ ] **Step 2: Kiểm tra biên dịch TypeScript**

Run: `npx tsc --noEmit`
Expected: không lỗi liên quan `src/lib/players.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/players.ts
git commit -m "feat(players): ghi hồ sơ + sổ điểm (create/update/adjust/setActive)"
```

---

## Task 5: API route — danh sách + tạo VĐV

**Files:**
- Create: `src/app/api/admin/players/route.ts`

**Interfaces:**
- Consumes: `requireAdmin` (`@/lib/auth`), `createAdminClient`, `createPlayer`/`PlayerInput` (Task 4).
- Produces:
  - `GET /api/admin/players` → `{ players: Array<{ id, full_name, nickname, phone, avatar_url, band, progress_points, tested_at, is_active }> }`
  - `POST /api/admin/players` body `PlayerInput` → `{ id }` (201) hoặc `{ error }` (400/500)

- [ ] **Step 1: Viết route**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { createPlayer } from '@/lib/players';
import { BANDS } from '@/lib/rating';

// GET /api/admin/players — danh sách đầy đủ (có phone) cho khu quản trị
export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('players')
    .select('id, full_name, nickname, phone, avatar_url, band, progress_points, tested_at, is_active')
    .order('band', { ascending: false })
    .order('progress_points', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ players: data ?? [] });
}

// POST /api/admin/players — tạo VĐV mới
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const fullName = (body.full_name ?? '').trim();
  if (!fullName) return NextResponse.json({ error: 'Thiếu họ tên' }, { status: 400 });
  if (!BANDS.includes(body.band)) {
    return NextResponse.json({ error: 'Mức trình phải là A100–A500' }, { status: 400 });
  }
  const progress = Number(body.progress_points ?? 0);
  if (!Number.isInteger(progress) || progress < 0) {
    return NextResponse.json({ error: 'Điểm tiến độ phải là số không âm' }, { status: 400 });
  }
  if (body.band < 500 && progress >= 100) {
    return NextResponse.json({ error: 'Tiến độ vượt mốc 100 khi chưa phải A500' }, { status: 400 });
  }

  const admin = createAdminClient();
  try {
    const { id } = await createPlayer(admin, {
      full_name:       fullName,
      nickname:        body.nickname?.trim() || null,
      phone:           body.phone?.trim() || null,
      avatar_url:      body.avatar_url || null,
      band:            body.band,
      progress_points: progress,
      tested_at:       body.tested_at || null,
      test_note:       body.test_note?.trim() || null,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Kiểm tra biên dịch**

Run: `npx tsc --noEmit`
Expected: không lỗi.

- [ ] **Step 3: Kiểm thử tay qua trình duyệt/preview**

Khởi động dev (`preview_start` name `songthach-dev`), đăng nhập admin, mở DevTools Console tại trang admin, chạy:

```js
await fetch('/api/admin/players', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({full_name:'Test VĐV', band:300, progress_points:60})}).then(r=>r.json())
```

Expected: `{ id: "..." }`. Rồi `GET`:

```js
await fetch('/api/admin/players').then(r=>r.json())
```

Expected: mảng chứa "Test VĐV" band 300.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/players/route.ts
git commit -m "feat(api): danh sách + tạo VĐV"
```

---

## Task 6: API route — chi tiết, sửa, bật/tắt, cộng điểm

**Files:**
- Create: `src/app/api/admin/players/[id]/route.ts`
- Create: `src/app/api/admin/players/[id]/points/route.ts`

**Interfaces:**
- Consumes: `requireAdmin`, `createAdminClient`, `updatePlayer`, `setActive`, `adjustPoints` (Task 4).
- Produces:
  - `GET /api/admin/players/[id]` → `{ player, events }`
  - `PATCH /api/admin/players/[id]` body `{ ...patch, is_active? }` → `{ ok: true }`
  - `POST /api/admin/players/[id]/points` body `{ delta: number, note: string }` → `{ band, progress_points }`

- [ ] **Step 1: Viết `[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { updatePlayer, setActive } from '@/lib/players';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const admin = createAdminClient();
  const [{ data: player, error: pErr }, { data: events, error: eErr }] = await Promise.all([
    admin.from('players').select('*').eq('id', params.id).single(),
    admin.from('rating_events').select('*').eq('player_id', params.id).order('created_at', { ascending: false }),
  ]);
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 404 });
  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 500 });
  return NextResponse.json({ player, events: events ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const admin = createAdminClient();
  try {
    if (typeof body.is_active === 'boolean') await setActive(admin, params.id, body.is_active);
    await updatePlayer(admin, params.id, {
      full_name:  body.full_name?.trim(),
      nickname:   body.nickname?.trim() || null,
      phone:      body.phone?.trim() || null,
      avatar_url: body.avatar_url ?? undefined,
      tested_at:  body.tested_at || null,
      test_note:  body.test_note?.trim() || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Viết `[id]/points/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { adjustPoints } from '@/lib/players';

// POST /api/admin/players/[id]/points — cộng/trừ điểm, bắt buộc kèm lý do
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const delta = Number(body.delta);
  const note  = (body.note ?? '').trim();
  if (!Number.isInteger(delta) || delta === 0) {
    return NextResponse.json({ error: 'Số điểm phải là số nguyên khác 0' }, { status: 400 });
  }
  if (!note) return NextResponse.json({ error: 'Bắt buộc nhập lý do' }, { status: 400 });

  const admin = createAdminClient();
  try {
    const result = await adjustPoints(admin, params.id, delta, note);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Kiểm tra biên dịch**

Run: `npx tsc --noEmit`
Expected: không lỗi.

- [ ] **Step 4: Kiểm thử tay** — dùng `id` của "Test VĐV" từ Task 5:

```js
await fetch('/api/admin/players/<ID>/points', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({delta:50, note:'test cộng điểm'})}).then(r=>r.json())
```

Expected: `{ band: 400, progress_points: 10 }` (300+60+50=410 → A400 p10).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/players/[id]/route.ts src/app/api/admin/players/[id]/points/route.ts
git commit -m "feat(api): chi tiết, sửa, bật/tắt, cộng điểm VĐV"
```

---

## Task 7: Thêm mục sidebar + trang danh sách VĐV

**Files:**
- Modify: `src/app/admin/layout.tsx` (thêm 1 dòng vào mảng `NAV`)
- Create: `src/app/admin/players/page.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/players` (Task 5), `bandLabel`/`effectivePoints` (Task 1–2).

- [ ] **Step 1: Thêm mục vào sidebar**

Trong `src/app/admin/layout.tsx`, mảng `NAV`, thêm sau dòng `/admin/users` (import icon `Trophy` từ lucide-react ở đầu file):

```tsx
{ href: '/admin/players', icon: Trophy, label: 'VĐV cầu lông' },
```

Sửa dòng import icon:

```tsx
import {
  LayoutDashboard, Calendar, MapPin, Users,
  Heart, Settings, LogOut, ChevronRight, FileText, Ticket, Images, Wallet, ImageDown,
  Menu, X, Trophy,
} from 'lucide-react';
```

- [ ] **Step 2: Viết trang danh sách**

Create `src/app/admin/players/page.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, Plus, Upload } from 'lucide-react';
import { bandLabel, effectivePoints } from '@/lib/rating';

interface Player {
  id: string; full_name: string; nickname: string | null; phone: string | null;
  avatar_url: string | null; band: number; progress_points: number;
  tested_at: string | null; is_active: boolean;
}

const BAND_BG: Record<number, string> = {
  100: 'bg-[#FFFBF2] text-[#3B2A1E]', 200: 'bg-[#F6DD9E] text-[#3B2A1E]',
  300: 'bg-[#E3A21A] text-[#3B2A1E]', 400: 'bg-[#F1C9B4] text-[#3B2A1E]',
  500: 'bg-[#C5532F] text-[#FFF6EC]',
};

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [band,    setBand]    = useState<'all' | number>('all');
  const [active,  setActive]  = useState<'active' | 'inactive' | 'all'>('active');

  function reload() {
    setLoading(true);
    fetch('/api/admin/players').then(r => r.json())
      .then(d => setPlayers(d.players ?? [])).finally(() => setLoading(false));
  }
  useEffect(reload, []);

  const filtered = players.filter(p => {
    const q = search.trim().toLowerCase();
    if (q && !p.full_name.toLowerCase().includes(q) && !(p.phone ?? '').includes(q)
        && !(p.nickname ?? '').toLowerCase().includes(q)) return false;
    if (band !== 'all' && p.band !== band) return false;
    if (active === 'active' && !p.is_active) return false;
    if (active === 'inactive' && p.is_active) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">VĐV cầu lông</h1>
          <p className="text-gray-500 text-sm mt-1">Hồ sơ trình độ & điểm — số điện thoại chỉ hiện ở đây</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/players/nhap-excel" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Upload size={15} /> Nhập Excel
          </Link>
          <Link href="/admin/players/moi" className="inline-flex items-center gap-2 px-4 py-2.5 bg-sports-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Plus size={15} /> Thêm VĐV
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, biệt danh, SĐT..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30" />
        </div>
        <select value={band} onChange={e => setBand(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
          <option value="all">Tất cả trình</option>
          {[500,400,300,200,100].map(b => <option key={b} value={b}>A{b}</option>)}
        </select>
        <select value={active} onChange={e => setActive(e.target.value as typeof active)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
          <option value="active">Đang sinh hoạt</option>
          <option value="inactive">Đã nghỉ</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className="admin-card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw size={18} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">Chưa có VĐV nào.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b">
                <th className="px-4 py-3">Vận động viên</th><th className="px-4 py-3">Trình</th>
                <th className="px-4 py-3 text-right">Tiến độ</th><th className="px-4 py-3 text-right">Hiệu dụng</th>
                <th className="px-4 py-3">Ngày test</th><th className="px-4 py-3">Trạng thái</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border-2 border-[#3B2A1E] grid place-items-center text-xs font-bold bg-[#F6DD9E] overflow-hidden">
                        {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(p.full_name)}
                      </div>
                      <div>
                        <div className="font-semibold">{p.full_name}</div>
                        {p.phone && <div className="text-xs text-gray-500 tabular-nums">{p.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-block px-2.5 py-0.5 rounded-full border-2 border-[#3B2A1E] text-xs font-extrabold ${BAND_BG[p.band]}`}>{bandLabel(p.band)}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.progress_points}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">{effectivePoints(p)}</td>
                  <td className="px-4 py-3 tabular-nums text-gray-500">{p.tested_at ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Đang sinh hoạt' : 'Đã nghỉ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/players/${p.id}`} className="text-sports-primary font-semibold hover:underline">Mở</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}
```

- [ ] **Step 3: Kiểm thử preview**

Mở `http://localhost:3005/admin/players` (đăng nhập admin). Xác nhận: mục "VĐV cầu lông" hiện ở sidebar; bảng liệt kê "Test VĐV" từ các task trước; lọc theo trình và tìm kiếm chạy.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/players/page.tsx
git commit -m "feat(admin): mục sidebar + trang danh sách VĐV"
```

---

## Task 8: Trang thêm/sửa VĐV + upload ảnh

**Files:**
- Create: `src/app/admin/players/moi/page.tsx` (thêm mới)
- Create: `src/app/admin/players/[id]/page.tsx` (sửa + sổ điểm + nút cộng điểm)
- Create: `src/app/admin/players/PlayerForm.tsx` (form dùng chung)

**Interfaces:**
- Consumes: `POST /api/admin/players`, `GET/PATCH /api/admin/players/[id]`, `POST /api/admin/upload` (trả `{url}`), `bandLabel`/`effectivePoints`/`applyPoints`.
- Produces: component `PlayerForm` với prop `{ initial?: PlayerRecord; onSaved: () => void }`.

- [ ] **Step 1: Viết `PlayerForm.tsx`**

```tsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { effectivePoints, bandLabel } from '@/lib/rating';

export interface PlayerRecord {
  id?: string; full_name: string; nickname: string | null; phone: string | null;
  avatar_url: string | null; band: number; progress_points: number;
  tested_at: string | null; test_note: string | null;
}

const BANDS = [100, 200, 300, 400, 500];
const BAND_BG: Record<number, string> = {
  100: 'bg-[#FFFBF2]', 200: 'bg-[#F6DD9E]', 300: 'bg-[#E3A21A]',
  400: 'bg-[#F1C9B4]', 500: 'bg-[#C5532F] text-[#FFF6EC]',
};

export default function PlayerForm({ initial, onSaved }: { initial?: PlayerRecord; onSaved: () => void }) {
  const isEdit = !!initial?.id;
  const [f, setF] = useState<PlayerRecord>(initial ?? {
    full_name: '', nickname: null, phone: null, avatar_url: null,
    band: 300, progress_points: 0, tested_at: null, test_note: null,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof PlayerRecord>(k: K, v: PlayerRecord[K]) { setF(prev => ({ ...prev, [k]: v })); }

  async function uploadAvatar(file: File) {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd }).then(r => r.json());
    setUploading(false);
    if (res.url) set('avatar_url', res.url); else toast.error(res.error ?? 'Upload lỗi');
  }

  async function save() {
    if (!f.full_name.trim()) { toast.error('Nhập họ tên'); return; }
    if (f.band < 500 && f.progress_points >= 100) { toast.error('Tiến độ vượt mốc 100 khi chưa phải A500'); return; }
    setSaving(true);
    const url = isEdit ? `/api/admin/players/${initial!.id}` : '/api/admin/players';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }).then(r => r.json());
    setSaving(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(isEdit ? 'Đã lưu' : 'Đã thêm VĐV');
    onSaved();
  }

  const effective = effectivePoints(f);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
      <div className="space-y-5">
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-bold">Thông tin cá nhân</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Họ và tên *"><input className="inp" value={f.full_name} onChange={e => set('full_name', e.target.value)} /></Field>
            <Field label="Biệt danh"><input className="inp" value={f.nickname ?? ''} onChange={e => set('nickname', e.target.value || null)} /></Field>
            <Field label="Số điện thoại" hint="Chỉ hiện trong khu quản trị"><input className="inp tabular-nums" value={f.phone ?? ''} onChange={e => set('phone', e.target.value || null)} /></Field>
          </div>
        </div>

        <div className="admin-card p-5 space-y-4">
          <h3 className="font-bold">Chấm mức trình ban đầu</h3>
          <div className="flex flex-wrap gap-2">
            {BANDS.map(b => (
              <label key={b} className="cursor-pointer">
                <input type="radio" name="band" className="sr-only peer" checked={f.band === b} onChange={() => set('band', b)} />
                <span className={`flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl border-2 border-gray-300 peer-checked:border-[#3B2A1E] peer-checked:shadow-[3px_3px_0_#3B2A1E] ${f.band === b ? BAND_BG[b] : 'bg-white'}`}>
                  <span className="font-extrabold">A{b}</span><span className="text-[11px] text-gray-500 peer-checked:text-inherit">{b} điểm</span>
                </span>
              </label>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Ngày test trình"><input type="date" className="inp tabular-nums" value={f.tested_at ?? ''} onChange={e => set('tested_at', e.target.value || null)} /></Field>
            <Field label="Điểm tiến độ khởi đầu" hint="Để 0 trừ khi chuyển dữ liệu cũ"><input type="number" min={0} className="inp tabular-nums" value={f.progress_points} onChange={e => set('progress_points', Math.max(0, Number(e.target.value) || 0))} /></Field>
          </div>
          <Field label="Ghi chú buổi test"><textarea className="inp min-h-[74px]" value={f.test_note ?? ''} onChange={e => set('test_note', e.target.value || null)} /></Field>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-sports-primary text-white rounded-xl font-medium disabled:opacity-50">
            {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Lưu VĐV'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="admin-card p-4">
          <div className="text-xs font-bold uppercase text-gray-500 mb-2">Ảnh đại diện</div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full border-2 border-[#3B2A1E] grid place-items-center text-2xl font-bold bg-[#F6DD9E] overflow-hidden">
              {f.avatar_url ? <img src={f.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(f.full_name)}
            </div>
            <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
              {uploading ? 'Đang tải...' : 'Chọn ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) uploadAvatar(file); }} />
            </label>
          </div>
        </div>
        <div className="admin-card p-4">
          <div className="text-xs font-bold uppercase text-gray-500 mb-2">Trang công khai sẽ hiện</div>
          <div className="text-center">
            <div className="font-bold text-lg">{f.full_name || 'Chưa có tên'}</div>
            {f.nickname && <div className="text-sm text-gray-500">"{f.nickname}"</div>}
            <div className="mt-2"><span className={`inline-block px-3 py-0.5 rounded-full border-2 border-[#3B2A1E] font-extrabold ${BAND_BG[f.band]}`}>{bandLabel(f.band)}</span></div>
            <div className="text-2xl font-extrabold mt-2 tabular-nums">{effective}<span className="block text-[10px] font-bold uppercase text-gray-500">điểm hiệu dụng</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}
function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}
```

Thêm class tiện ích `.inp` vào `src/app/globals.css` (nếu chưa có):

```css
.inp { @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30; }
```

- [ ] **Step 2: Viết trang thêm mới `moi/page.tsx`**

```tsx
'use client';
import { useRouter } from 'next/navigation';
import PlayerForm from '../PlayerForm';

export default function NewPlayerPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Thêm vận động viên</h1>
      <PlayerForm onSaved={() => router.push('/admin/players')} />
    </div>
  );
}
```

- [ ] **Step 3: Viết trang chi tiết/sửa `[id]/page.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PlayerForm, { type PlayerRecord } from '../PlayerForm';
import AdjustPointsPanel from '../AdjustPointsPanel';

interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }

export default function EditPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerRecord | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);

  function reload() {
    fetch(`/api/admin/players/${id}`).then(r => r.json()).then(d => {
      setPlayer(d.player); setEvents(d.events ?? []);
    }).finally(() => setLoading(false));
  }
  useEffect(reload, [id]);

  if (loading) return <p className="text-gray-400 py-16 text-center">Đang tải...</p>;
  if (!player) return <p className="text-gray-400 py-16 text-center">Không tìm thấy VĐV.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{player.full_name}</h1>
      <PlayerForm initial={player} onSaved={() => router.push('/admin/players')} />
      <AdjustPointsPanel player={player} events={events} onDone={reload} />
    </div>
  );
}
```

- [ ] **Step 4: Kiểm tra biên dịch + preview**

Run: `npx tsc --noEmit` (Expected: không lỗi — lưu ý `AdjustPointsPanel` tạo ở Task 9, tạm thời tạo file rỗng export mặc định để biên dịch, hoặc làm Task 9 trước khi chạy preview).
Mở `/admin/players/moi`, nhập một VĐV mới có ảnh, xác nhận thẻ xem trước đổi theo lựa chọn và lưu thành công.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/players/PlayerForm.tsx src/app/admin/players/moi/page.tsx src/app/admin/players/[id]/page.tsx src/app/globals.css
git commit -m "feat(admin): form thêm/sửa VĐV + upload ảnh + xem trước"
```

---

## Task 9: Bảng cộng/trừ điểm có xem trước

**Files:**
- Create: `src/app/admin/players/AdjustPointsPanel.tsx`

**Interfaces:**
- Consumes: `POST /api/admin/players/[id]/points`, `applyPoints`/`bandLabel`/`effectivePoints`, `PlayerRecord` (Task 8).

- [ ] **Step 1: Viết `AdjustPointsPanel.tsx`**

```tsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { applyPoints, bandLabel, effectivePoints } from '@/lib/rating';
import type { PlayerRecord } from './PlayerForm';

interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }
const REASON_LABEL: Record<string, string> = {
  initial: 'Xếp trình ban đầu', manual_adjust: 'Điều chỉnh tay',
};

export default function AdjustPointsPanel({ player, events, onDone }: { player: PlayerRecord; events: Ev[]; onDone: () => void }) {
  const [delta, setDelta] = useState('');
  const [note, setNote]   = useState('');
  const [saving, setSaving] = useState(false);

  const d = Number(delta);
  const valid = Number.isInteger(d) && d !== 0 && note.trim().length > 0;
  const preview = Number.isInteger(d) && d !== 0 ? applyPoints(player.band, player.progress_points, d) : null;

  async function submit() {
    if (!valid) return;
    setSaving(true);
    const res = await fetch(`/api/admin/players/${player.id}/points`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta: d, note: note.trim() }),
    }).then(r => r.json());
    setSaving(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success('Đã ghi vào sổ điểm');
    setDelta(''); setNote(''); onDone();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="admin-card p-5 space-y-4">
        <h3 className="font-bold">Cộng / trừ điểm</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Số điểm (âm để trừ)</span>
            <input className="inp tabular-nums" value={delta} onChange={e => setDelta(e.target.value)} placeholder="+50 hoặc -50" /></label>
        </div>
        <label className="block"><span className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Lý do (bắt buộc)</span>
          <input className="inp" value={note} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: Vô địch giải hạng 600 ngày 14/06" /></label>

        {preview && (
          <div className="bg-[#FBF4E6] border-2 border-[#3B2A1E] rounded-xl p-4">
            <div className="text-xs font-bold uppercase text-gray-500 mb-2">Kết quả sau khi ghi</div>
            <div className="flex items-center gap-3 flex-wrap font-bold">
              <span>{bandLabel(player.band)} tiến độ {player.progress_points}</span>
              <span className="text-[#C5532F] text-lg">→</span>
              <span className="bg-[#C5532F] text-[#FFF6EC] border-2 border-[#3B2A1E] rounded-full px-3 py-0.5">
                {bandLabel(preview.band)} · tiến độ {preview.progress}
              </span>
            </div>
            {preview.band !== player.band && (
              <div className="text-xs font-bold text-[#92400E] mt-2">
                {effectivePoints({ band: preview.band, progress_points: preview.progress }) > effectivePoints(player)
                  ? `Thăng hạng lên ${bandLabel(preview.band)}` : `Hạ xuống ${bandLabel(preview.band)}`}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={submit} disabled={!valid || saving} className="px-6 py-2.5 bg-sports-primary text-white rounded-xl font-medium disabled:opacity-50">
            {saving ? 'Đang ghi...' : 'Ghi vào sổ điểm'}
          </button>
        </div>
      </div>

      <div className="admin-card p-5">
        <h3 className="font-bold mb-3">Lịch sử điểm</h3>
        <div className="divide-y">
          {events.map(ev => (
            <div key={ev.id} className="py-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{REASON_LABEL[ev.reason] ?? ev.reason}</div>
                {ev.note && <div className="text-xs text-gray-500 mt-0.5">{ev.note}</div>}
                <div className="text-xs text-gray-400 mt-0.5 tabular-nums">{new Date(ev.created_at).toLocaleDateString('vi-VN')}</div>
              </div>
              <span className={`font-extrabold tabular-nums px-3 py-0.5 rounded-full border-2 border-[#3B2A1E] ${ev.reason === 'initial' ? 'bg-[#FBF4E6]' : ev.points < 0 ? 'bg-[#F1C9B4]' : 'bg-[#F6DD9E]'}`}>
                {ev.reason === 'initial' ? ev.points : (ev.points > 0 ? `+${ev.points}` : ev.points)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra biên dịch + preview**

Run: `npx tsc --noEmit`
Mở `/admin/players/<id>` một VĐV. Nhập `+50` + lý do → xác nhận hộp xem trước hiện `A400 · tiến độ 10` (với VĐV A300 p60). Bấm ghi, sổ điểm thêm dòng mới.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/players/AdjustPointsPanel.tsx
git commit -m "feat(admin): cộng/trừ điểm có xem trước + lịch sử điểm"
```

---

## Task 10: Bộ đối chiếu Excel — logic thuần (TDD)

**Files:**
- Create: `src/lib/player-import.ts`
- Test: `src/lib/player-import.test.ts`

**Interfaces:**
- Consumes: `BANDS` (Task 1).
- Produces:
  - `function normalizePhone(raw: string | null | undefined): string`
  - `function parseBand(raw: unknown): number | null`
  - `type RawRow = { rowNum: number; full_name?: string; nickname?: string; phone?: string; band?: string; progress_points?: string; tested_at?: string; test_note?: string }`
  - `type ExistingPlayer = { id: string; full_name: string; phone: string | null; band: number; progress_points: number }`
  - `type Reconciled = { rowNum: number; kind: 'new'|'update'|'same'|'error'; errors: string[]; autoSelect: boolean; parsed: {...}; existingId?: string; warning?: string }`
  - `function reconcileImport(rows: RawRow[], existing: ExistingPlayer[]): Reconciled[]`

- [ ] **Step 1: Viết test thất bại**

Create `src/lib/player-import.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { normalizePhone, parseBand, reconcileImport, type RawRow, type ExistingPlayer } from './player-import';

describe('normalizePhone', () => {
  it('chuẩn hoá các cách viết về cùng một số', () => {
    expect(normalizePhone('0988918418')).toBe('0988918418');
    expect(normalizePhone('0988.918.418')).toBe('0988918418');
    expect(normalizePhone('+84 988 918 418')).toBe('0988918418');
    expect(normalizePhone('')).toBe('');
    expect(normalizePhone(null)).toBe('');
  });
});

describe('parseBand', () => {
  it('nhận A300 và 300', () => {
    expect(parseBand('A300')).toBe(300);
    expect(parseBand('300')).toBe(300);
    expect(parseBand('a500')).toBe(500);
  });
  it('trả null khi sai', () => {
    expect(parseBand('A250')).toBe(null);
    expect(parseBand('abc')).toBe(null);
    expect(parseBand('')).toBe(null);
  });
});

describe('reconcileImport', () => {
  const existing: ExistingPlayer[] = [
    { id: 'p1', full_name: 'Lê Đăng Khoa', phone: '0938771209', band: 400, progress_points: 60 },
    { id: 'p2', full_name: 'Bùi Thị Tú Anh', phone: '0356882470', band: 200, progress_points: 50 },
  ];

  it('người mới (SĐT chưa có)', () => {
    const rows: RawRow[] = [{ rowNum: 2, full_name: 'Ngô Quang Huy', band: 'A100', phone: '0964118220' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('new');
    expect(r[0].autoSelect).toBe(true);
  });

  it('thiếu họ tên → lỗi', () => {
    const rows: RawRow[] = [{ rowNum: 3, band: 'A100', phone: '0900000000' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('error');
    expect(r[0].errors.join(' ')).toMatch(/họ tên/i);
  });

  it('mức trình sai → lỗi', () => {
    const rows: RawRow[] = [{ rowNum: 4, full_name: 'X', band: 'A250', phone: '0900000001' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('error');
  });

  it('tiến độ ≥100 khi chưa A500 → lỗi', () => {
    const rows: RawRow[] = [{ rowNum: 5, full_name: 'Y', band: 'A300', progress_points: '120', phone: '0900000002' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('error');
  });

  it('đã có, khác dữ liệu (nâng trình) → update, tự tích', () => {
    const rows: RawRow[] = [{ rowNum: 6, full_name: 'Lê Đăng Khoa', band: 'A500', progress_points: '0', phone: '0938.771.209' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('update');
    expect(r[0].existingId).toBe('p1');
    expect(r[0].autoSelect).toBe(true);
  });

  it('đã có, y hệt → same, không tích', () => {
    const rows: RawRow[] = [{ rowNum: 7, full_name: 'Lê Đăng Khoa', band: 'A400', progress_points: '60', phone: '0938771209' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('same');
    expect(r[0].autoSelect).toBe(false);
  });

  it('cập nhật làm mất điểm mà không thêm gì → không tự tích', () => {
    // File để trống tiến độ (→0) trong khi hệ thống đang có 50
    const rows: RawRow[] = [{ rowNum: 8, full_name: 'Bùi Thị Tú Anh', band: 'A200', phone: '0356882470' }];
    const r = reconcileImport(rows, existing);
    expect(r[0].kind).toBe('update');
    expect(r[0].autoSelect).toBe(false);
    expect(r[0].warning).toMatch(/mất|xoá|giảm/i);
  });

  it('hai dòng cùng file trùng SĐT → dòng sau lỗi', () => {
    const rows: RawRow[] = [
      { rowNum: 2, full_name: 'A', band: 'A100', phone: '0900001111' },
      { rowNum: 3, full_name: 'B', band: 'A100', phone: '0900001111' },
    ];
    const r = reconcileImport(rows, existing);
    expect(r[1].kind).toBe('error');
    expect(r[1].errors.join(' ')).toMatch(/trùng/i);
  });

  it('nhập lại đúng dữ liệu đã có → toàn bộ same', () => {
    const rows: RawRow[] = [
      { rowNum: 2, full_name: 'Lê Đăng Khoa', band: 'A400', progress_points: '60', phone: '0938771209' },
      { rowNum: 3, full_name: 'Bùi Thị Tú Anh', band: 'A200', progress_points: '50', phone: '0356882470' },
    ];
    const r = reconcileImport(rows, existing);
    expect(r.every(x => x.kind === 'same')).toBe(true);
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `npm test`
Expected: FAIL — module `player-import` chưa có.

- [ ] **Step 3: Viết `src/lib/player-import.ts`**

```ts
import { BANDS } from './rating';

export type RawRow = {
  rowNum: number;
  full_name?: string; nickname?: string; phone?: string;
  band?: string; progress_points?: string; tested_at?: string; test_note?: string;
};
export type ExistingPlayer = { id: string; full_name: string; phone: string | null; band: number; progress_points: number };
export type ParsedRow = {
  full_name: string; nickname: string | null; phone: string | null;
  band: number; progress_points: number; tested_at: string | null; test_note: string | null;
};
export type Reconciled = {
  rowNum: number;
  kind: 'new' | 'update' | 'same' | 'error';
  errors: string[];
  autoSelect: boolean;
  parsed: ParsedRow;
  existingId?: string;
  warning?: string;
};

/** Chuẩn hoá SĐT: bỏ ký tự không phải số, +84/84 → 0. */
export function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('84')) return '0' + digits.slice(2);
  return digits;
}

/** "A300" | "300" | "a500" → số; sai → null. */
export function parseBand(raw: unknown): number | null {
  if (raw == null) return null;
  const s = String(raw).trim().toUpperCase().replace(/^A/, '');
  const n = Number(s);
  return BANDS.includes(n as never) ? n : null;
}

function parseProgress(raw: unknown): number | null {
  if (raw == null || String(raw).trim() === '') return 0;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

function sameData(p: ParsedRow, e: ExistingPlayer): boolean {
  return p.full_name.trim() === e.full_name.trim() && p.band === e.band && p.progress_points === e.progress_points;
}

export function reconcileImport(rows: RawRow[], existing: ExistingPlayer[]): Reconciled[] {
  const byPhone = new Map<string, ExistingPlayer>();
  for (const e of existing) { const k = normalizePhone(e.phone); if (k) byPhone.set(k, e); }

  const seenInFile = new Set<string>();
  const out: Reconciled[] = [];

  for (const row of rows) {
    const errors: string[] = [];
    const full = (row.full_name ?? '').trim();
    if (!full) errors.push('Thiếu họ tên');

    const band = parseBand(row.band);
    if (band == null) errors.push('Mức trình phải là A100, A200, A300, A400 hoặc A500');

    const progress = parseProgress(row.progress_points);
    if (progress == null) errors.push('Điểm tiến độ phải là số không âm');
    else if (band != null && band < 500 && progress >= 100) errors.push('Tiến độ vượt mốc 100 khi chưa phải A500');

    const phoneKey = normalizePhone(row.phone);
    if (phoneKey && seenInFile.has(phoneKey)) errors.push('Trùng số điện thoại với dòng khác trong file');
    if (phoneKey) seenInFile.add(phoneKey);

    const parsed: ParsedRow = {
      full_name: full, nickname: row.nickname?.trim() || null, phone: row.phone?.trim() || null,
      band: band ?? 100, progress_points: progress ?? 0,
      tested_at: row.tested_at?.trim() || null, test_note: row.test_note?.trim() || null,
    };

    if (errors.length) { out.push({ rowNum: row.rowNum, kind: 'error', errors, autoSelect: false, parsed }); continue; }

    const match = phoneKey ? byPhone.get(phoneKey) : undefined;
    if (!match) { out.push({ rowNum: row.rowNum, kind: 'new', errors: [], autoSelect: true, parsed }); continue; }

    if (sameData(parsed, match)) {
      out.push({ rowNum: row.rowNum, kind: 'same', errors: [], autoSelect: false, parsed, existingId: match.id });
      continue;
    }

    // Cập nhật khác dữ liệu: cảnh báo nếu làm giảm điểm hiệu dụng
    const oldEff = match.band + match.progress_points;
    const newEff = parsed.band + parsed.progress_points;
    const losesData = newEff < oldEff;
    out.push({
      rowNum: row.rowNum, kind: 'update', errors: [], autoSelect: !losesData, parsed, existingId: match.id,
      warning: losesData ? `File sẽ giảm điểm hiệu dụng ${oldEff} → ${newEff}` : undefined,
    });
  }
  return out;
}
```

- [ ] **Step 4: Chạy test, xác nhận pass**

Run: `npm test`
Expected: PASS (toàn bộ nhóm player-import).

- [ ] **Step 5: Commit**

```bash
git add src/lib/player-import.ts src/lib/player-import.test.ts
git commit -m "feat(import): bộ đối chiếu Excel thuần + test"
```

---

## Task 11: API nhập Excel (đọc file + ghi) và `commitImport`

**Files:**
- Create: `src/app/api/admin/players/import/route.ts`
- Modify: `src/lib/players.ts` (thêm `commitImport`)

**Interfaces:**
- Consumes: `exceljs`, `reconcileImport`/`RawRow` (Task 10), `createPlayer`/`adjustPoints`/`updatePlayer` (Task 4).
- Produces:
  - `POST /api/admin/players/import` (multipart, field `file`) → `{ rows: Reconciled[] }`
  - `PUT /api/admin/players/import` body `{ rows: Reconciled[] }` (các dòng admin đã chọn) → `{ created: number; updated: number }`
  - `async function commitImport(admin, rows): Promise<{ created: number; updated: number }>`

- [ ] **Step 1: Thêm `commitImport` vào `src/lib/players.ts`**

```ts
import type { Reconciled } from './player-import';
import { effectivePoints } from './rating';

/**
 * Ghi các dòng đã chọn. Mới → createPlayer. Update đổi điểm → adjustPoints bằng phần chênh lệch;
 * chỉ đổi thông tin → updatePlayer. Không dùng transaction thật (Supabase JS không hỗ trợ);
 * ghi tuần tự, lỗi thì ném ra để API báo — các dòng đã ghi trước đó vẫn nằm trong sổ (an toàn vì
 * mỗi dòng độc lập, không để lại trạng thái nửa vời trong một hồ sơ).
 */
export async function commitImport(admin: SupabaseClient, rows: Reconciled[]): Promise<{ created: number; updated: number }> {
  let created = 0, updated = 0;
  for (const row of rows) {
    if (row.kind === 'new') {
      await createPlayer(admin, {
        full_name: row.parsed.full_name, nickname: row.parsed.nickname, phone: row.parsed.phone,
        band: row.parsed.band, progress_points: row.parsed.progress_points,
        tested_at: row.parsed.tested_at, test_note: row.parsed.test_note,
      });
      created++;
    } else if (row.kind === 'update' && row.existingId) {
      const { data: cur } = await admin.from('players').select('band, progress_points').eq('id', row.existingId).single();
      await updatePlayer(admin, row.existingId, {
        full_name: row.parsed.full_name, nickname: row.parsed.nickname,
        phone: row.parsed.phone, tested_at: row.parsed.tested_at, test_note: row.parsed.test_note,
      });
      const oldEff = cur ? effectivePoints(cur) : 0;
      const newEff = effectivePoints({ band: row.parsed.band, progress_points: row.parsed.progress_points });
      if (newEff !== oldEff) {
        await adjustPoints(admin, row.existingId, newEff - oldEff, 'Nhập từ Excel — cập nhật điểm');
      }
      updated++;
    }
  }
  return { created, updated };
}
```

- [ ] **Step 2: Viết API route đọc + ghi**

Create `src/app/api/admin/players/import/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { reconcileImport, type RawRow, type ExistingPlayer, type Reconciled } from '@/lib/player-import';
import { commitImport } from '@/lib/players';

// Ánh xạ tên cột (không phân biệt hoa thường / dấu cách) → khoá RawRow
const COL: Record<string, keyof RawRow> = {
  'ho va ten': 'full_name', 'ho ten': 'full_name', 'ten': 'full_name',
  'muc trinh': 'band', 'trinh': 'band', 'band': 'band',
  'so dien thoai': 'phone', 'sdt': 'phone', 'dien thoai': 'phone',
  'biet danh': 'nickname',
  'diem tien do': 'progress_points', 'tien do': 'progress_points',
  'ngay test': 'tested_at', 'ghi chu test': 'test_note', 'ghi chu': 'test_note',
};

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
}

// POST — đọc file, trả phân loại (chưa ghi gì)
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Không có file' }, { status: 400 });

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(Buffer.from(await file.arrayBuffer()));
  const ws = wb.worksheets[0];
  if (!ws) return NextResponse.json({ error: 'File không có sheet nào' }, { status: 400 });

  // Hàng 1 = tên cột
  const headerRow = ws.getRow(1);
  const colMap = new Map<number, keyof RawRow>();
  headerRow.eachCell((cell, colNumber) => {
    const key = COL[norm(String(cell.value ?? ''))];
    if (key) colMap.set(colNumber, key);
  });

  const rows: RawRow[] = [];
  for (let i = 2; i <= ws.rowCount; i++) {
    const row = ws.getRow(i);
    if (row.cellCount === 0) continue;
    const raw: RawRow = { rowNum: i };
    let hasAny = false;
    colMap.forEach((key, colNumber) => {
      const v = row.getCell(colNumber).value;
      if (v != null && String(v).trim() !== '') { (raw as Record<string, unknown>)[key] = String(v).trim(); hasAny = true; }
    });
    if (hasAny) rows.push(raw);
  }

  const admin = createAdminClient();
  const { data: existing } = await admin.from('players').select('id, full_name, phone, band, progress_points');
  const reconciled = reconcileImport(rows, (existing ?? []) as ExistingPlayer[]);
  return NextResponse.json({ rows: reconciled });
}

// PUT — ghi các dòng admin đã chọn (client gửi lại mảng đã lọc autoSelect/tick)
export async function PUT(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const rows = (body.rows ?? []) as Reconciled[];
  const toWrite = rows.filter(r => r.kind === 'new' || r.kind === 'update');
  const admin = createAdminClient();
  try {
    const result = await commitImport(admin, toWrite);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Kiểm tra biên dịch**

Run: `npx tsc --noEmit`
Expected: không lỗi.

- [ ] **Step 4: Commit**

```bash
git add src/lib/players.ts src/app/api/admin/players/import/route.ts
git commit -m "feat(import): API đọc Excel + ghi danh sách đã chọn"
```

---

## Task 12: Màn nhập Excel 3 bước

**Files:**
- Create: `src/app/admin/players/nhap-excel/page.tsx`

**Interfaces:**
- Consumes: `POST/PUT /api/admin/players/import` (Task 11), `bandLabel`.

- [ ] **Step 1: Viết trang**

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface Reconciled {
  rowNum: number; kind: 'new'|'update'|'same'|'error'; errors: string[];
  autoSelect: boolean; warning?: string; existingId?: string;
  parsed: { full_name: string; phone: string | null; band: number; progress_points: number };
}
const KIND_LABEL = { new: 'Người mới', update: 'Đã có — cập nhật', same: 'Y hệt — bỏ qua', error: 'Lỗi' };
const KIND_CLS = {
  new: 'bg-green-100 text-green-700', update: 'bg-amber-100 text-amber-700',
  same: 'bg-gray-100 text-gray-500', error: 'bg-red-100 text-red-700',
};

export default function ImportPage() {
  const router = useRouter();
  const [rows, setRows]   = useState<Reconciled[] | null>(null);
  const [ticks, setTicks] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  async function upload(file: File) {
    setLoading(true); setFileName(file.name);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/players/import', { method: 'POST', body: fd }).then(r => r.json());
    setLoading(false);
    if (res.error) { toast.error(res.error); return; }
    setRows(res.rows);
    const init: Record<number, boolean> = {};
    for (const r of res.rows as Reconciled[]) init[r.rowNum] = r.autoSelect;
    setTicks(init);
  }

  const tally = rows ? {
    new: rows.filter(r => r.kind === 'new').length,
    update: rows.filter(r => r.kind === 'update').length,
    same: rows.filter(r => r.kind === 'same').length,
    error: rows.filter(r => r.kind === 'error').length,
  } : null;

  const selected = rows?.filter(r => ticks[r.rowNum] && (r.kind === 'new' || r.kind === 'update')) ?? [];

  async function commit() {
    setLoading(true);
    const res = await fetch('/api/admin/players/import', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rows: selected }),
    }).then(r => r.json());
    setLoading(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`Đã ghi ${res.created} mới + ${res.updated} cập nhật`);
    router.push('/admin/players');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nhập danh sách từ Excel</h1>

      {!rows ? (
        <div className="admin-card p-8 text-center">
          <FileSpreadsheet size={40} className="mx-auto mb-3 text-green-600" />
          <p className="font-semibold">Chọn file .xlsx hoặc .csv</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Dòng đầu là tên cột: Họ và tên, Mức trình, Số điện thoại, Biệt danh, Điểm tiến độ, Ngày test, Ghi chú test</p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-sports-primary text-white rounded-xl font-medium cursor-pointer">
            <Upload size={16} /> {loading ? 'Đang đọc...' : 'Chọn file'}
            <input type="file" accept=".xlsx,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          </label>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Tile label="Người mới" v={tally!.new} cls="border-l-green-500" />
            <Tile label="Cập nhật" v={tally!.update} cls="border-l-amber-500" />
            <Tile label="Y hệt" v={tally!.same} cls="border-l-gray-400" />
            <Tile label="Dòng lỗi" v={tally!.error} cls="border-l-red-500" />
          </div>

          <div className="admin-card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead><tr className="text-left text-xs uppercase text-gray-500 border-b">
                <th className="px-3 py-3 text-center">Ghi</th><th className="px-3 py-3">Dòng</th><th className="px-3 py-3">Họ tên</th>
                <th className="px-3 py-3">SĐT</th><th className="px-3 py-3">Trình</th><th className="px-3 py-3 text-right">Tiến độ</th><th className="px-3 py-3">Kết quả</th>
              </tr></thead>
              <tbody>
                {rows.map(r => {
                  const selectable = r.kind === 'new' || r.kind === 'update';
                  return (
                    <tr key={r.rowNum} className={`border-b last:border-0 ${r.kind === 'error' ? 'bg-red-50' : r.warning ? 'bg-amber-50' : ''}`}>
                      <td className="px-3 py-3 text-center">
                        <input type="checkbox" disabled={!selectable} checked={!!ticks[r.rowNum]}
                          onChange={e => setTicks(t => ({ ...t, [r.rowNum]: e.target.checked }))} />
                      </td>
                      <td className="px-3 py-3 tabular-nums text-gray-500">{r.rowNum}</td>
                      <td className="px-3 py-3 font-medium">{r.parsed.full_name || <span className="text-red-600">(trống)</span>}</td>
                      <td className="px-3 py-3 tabular-nums">{r.parsed.phone ?? '—'}</td>
                      <td className="px-3 py-3">A{r.parsed.band}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{r.parsed.progress_points}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${KIND_CLS[r.kind]}`}>{KIND_LABEL[r.kind]}</span>
                        {r.errors.length > 0 && <div className="text-xs text-red-600 font-medium mt-1">{r.errors.join(' · ')}</div>}
                        {r.warning && <div className="text-xs text-amber-700 font-medium mt-1">{r.warning}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 admin-card p-4">
            <div className="text-sm font-medium">
              Sẽ ghi <b>{selected.filter(r => r.kind === 'new').length} hồ sơ mới</b> + <b>{selected.filter(r => r.kind === 'update').length} cập nhật</b>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setRows(null); setFileName(''); }} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium">Huỷ, chọn file khác</button>
              <button onClick={commit} disabled={loading || selected.length === 0} className="px-5 py-2.5 bg-sports-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">
                Ghi {selected.length} dòng vào hệ thống
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">Muốn sửa dòng lỗi thì sửa trong file Excel rồi tải lên lại — để file gốc và dữ liệu trên web luôn khớp.</p>
        </>
      )}
    </div>
  );
}

function Tile({ label, v, cls }: { label: string; v: number; cls: string }) {
  return (
    <div className={`admin-card p-4 border-l-[6px] ${cls}`}>
      <div className="text-xs font-bold uppercase text-gray-500">{label}</div>
      <div className="text-2xl font-extrabold tabular-nums mt-0.5">{v}</div>
    </div>
  );
}
```

- [ ] **Step 2: Kiểm thử preview với file thật**

Tạo file `test-import.csv` trong scratchpad với nội dung:

```csv
Họ và tên,Mức trình,Số điện thoại,Điểm tiến độ
Ngô Quang Huy,A100,0964118220,0
Lê Đăng Khoa,A500,0938771209,0
Sai Trình,A250,0900000000,0
```

Mở `/admin/players/nhap-excel`, tải lên. Xác nhận: 1 người mới, 1 cập nhật (nếu Khoa đã có), 1 dòng lỗi A250; số ở nút "Ghi N dòng" đổi khi tích/bỏ tích; ghi thành công chuyển về danh sách.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/players/nhap-excel/page.tsx
git commit -m "feat(admin): màn nhập Excel 3 bước"
```

---

## Task 13: API công khai + trang bảng xếp hạng

**Files:**
- Create: `src/app/api/players/route.ts`
- Create: `src/app/(public)/giai-dau-rating/rating.css`
- Create: `src/app/(public)/giai-dau-rating/bang-xep-hang/page.tsx`

**Interfaces:**
- Consumes: view `players_public` (Task 3), `bandLabel`/`effectivePoints`.
- Produces: `GET /api/players` → `{ players: Array<{ id, full_name, nickname, avatar_url, band, progress_points }> }` (đã sắp xếp).

- [ ] **Step 1: Viết API công khai**

Create `src/app/api/players/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/players — công khai, đọc view players_public (KHÔNG có phone)
export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('players_public')
    .select('id, full_name, nickname, avatar_url, band, progress_points')
    .order('band', { ascending: false })
    .order('progress_points', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ players: data ?? [] });
}
```

- [ ] **Step 2: Tạo `rating.css`** — sao chép tokens retro, scope dưới `.rating-page`

```css
/* Tokens retro dùng chung với trang giai-cau-long-2026, scope riêng để không đụng global */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap');

.rating-page {
  --cream:#F4E9D6; --cream2:#FBF4E6; --paper:#FFFBF2;
  --mustard:#E3A21A; --mustard-d:#C5860F; --mustard-soft:#F6DD9E;
  --terra:#C5532F; --terra-d:#A33E1F; --terra-soft:#F1C9B4;
  --ink:#3B2A1E; --brown:#7A5638; --muted:#8A6E54; --line:#E2CFA9;
  font-family:"Nunito",system-ui,sans-serif; color:var(--ink); background:var(--cream);
  min-height:100vh; line-height:1.6;
}
.rating-page h1,.rating-page h2,.rating-page h3{font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;line-height:1.1;margin:0}
.rating-page .wrap{max-width:1000px;margin:0 auto;padding:32px 20px 70px}
.rating-page .num{font-variant-numeric:tabular-nums}
.rating-page .band{display:inline-flex;align-items:center;font-family:"Baloo 2";font-weight:800;font-size:13px;padding:3px 12px;border:2.5px solid var(--ink);border-radius:999px}
.rating-page .b100{background:var(--paper)} .rating-page .b200{background:var(--mustard-soft)}
.rating-page .b300{background:var(--mustard)} .rating-page .b400{background:var(--terra-soft)}
.rating-page .b500{background:var(--terra);color:#FFF6EC}
.rating-page .row{display:grid;grid-template-columns:48px 1fr 92px 180px;gap:14px;align-items:center;background:var(--paper);border:2.5px solid var(--ink);border-radius:16px;padding:12px 16px;box-shadow:4px 4px 0 var(--ink);text-decoration:none;color:inherit;margin-bottom:10px}
.rating-page .ava{width:42px;height:42px;border-radius:50%;border:2.5px solid var(--ink);display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;background:var(--mustard-soft);overflow:hidden}
.rating-page .ava img{width:100%;height:100%;object-fit:cover}
.rating-page .bar{height:12px;border:2.5px solid var(--ink);border-radius:999px;background:var(--cream2);overflow:hidden}
.rating-page .bar i{display:block;height:100%;background:var(--mustard);border-right:2.5px solid var(--ink)}
.rating-page .bar i.max{background:var(--terra);border-right:0}
@media (max-width:640px){ .rating-page .row{grid-template-columns:36px 1fr auto;grid-template-areas:"r w p" ". g g";row-gap:10px} }
```

- [ ] **Step 3: Viết trang bảng xếp hạng**

Create `src/app/(public)/giai-dau-rating/bang-xep-hang/page.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bandLabel, effectivePoints } from '@/lib/rating';
import './../rating.css';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; }

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<P[]>([]);
  const [band, setBand] = useState<'all' | number>('all');
  useEffect(() => { fetch('/api/players').then(r => r.json()).then(d => setPlayers(d.players ?? [])); }, []);
  const list = players.filter(p => band === 'all' || p.band === band);

  return (
    <div className="rating-page">
      <div className="wrap">
        <h1 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Bảng xếp hạng <span style={{ color: 'var(--terra)' }}>CLB Song Thạch</span></h1>
        <p style={{ color: 'var(--brown)', fontWeight: 600, marginBottom: 20 }}>Xếp theo điểm hiệu dụng. Đủ 100 điểm tiến độ thì lên hạng. Điểm chỉ tăng, lịch sử công khai.</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {(['all', 500, 400, 300, 200, 100] as const).map(b => (
            <button key={b} onClick={() => setBand(b)}
              style={{ fontFamily: 'Baloo 2', fontWeight: 700, padding: '5px 14px', borderRadius: 999, border: '2.5px solid var(--ink)', cursor: 'pointer', background: band === b ? 'var(--ink)' : 'var(--cream2)', color: band === b ? 'var(--cream2)' : 'var(--ink)' }}>
              {b === 'all' ? 'Tất cả' : `A${b}`}
            </button>
          ))}
        </div>

        {list.map((p, i) => {
          const eff = effectivePoints(p); const atMax = p.band === 500;
          return (
            <Link key={p.id} href={`/giai-dau-rating/vdv/${p.id}`} className="row">
              <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: 19, textAlign: 'center' }}>{i + 1}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div className="ava">{p.avatar_url ? <img src={p.avatar_url} alt="" /> : initials(p.full_name)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Baloo 2', fontWeight: 700, fontSize: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nickname || p.full_name}</span>
                    <span className={`band b${p.band}`}>{bandLabel(p.band)}</span>
                  </div>
                </div>
              </div>
              <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: 19, textAlign: 'right' }}>{eff}</div>
              <div>
                <div className="num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                  <span>{atMax ? `${p.progress_points} điểm sau A500` : `${p.progress_points} / 100`}</span>
                  <span>{atMax ? '—' : `còn ${100 - p.progress_points}`}</span>
                </div>
                <div className="bar"><i className={atMax ? 'max' : ''} style={{ width: atMax ? '100%' : `${p.progress_points}%` }} /></div>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && <p style={{ color: 'var(--muted)', padding: '40px 0' }}>Chưa có VĐV nào.</p>}
      </div>
    </div>
  );
}
function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}
```

- [ ] **Step 4: Kiểm thử preview**

Mở `http://localhost:3005/giai-dau-rating/bang-xep-hang`. Xác nhận: danh sách hiện theo điểm giảm dần, chip band đúng màu, thanh tiến độ đúng %, lọc theo trình chạy, KHÔNG hiện SĐT. Kiểm tra `read_network_requests` xác nhận `/api/players` không trả trường `phone`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/players/route.ts src/app/(public)/giai-dau-rating/rating.css src/app/(public)/giai-dau-rating/bang-xep-hang/page.tsx
git commit -m "feat(public): API công khai + bảng xếp hạng"
```

---

## Task 14: API + trang hồ sơ VĐV công khai

**Files:**
- Create: `src/app/api/players/[id]/route.ts`
- Create: `src/app/(public)/giai-dau-rating/vdv/[id]/page.tsx`

**Interfaces:**
- Consumes: view `players_public`, `rating_events` (đọc công khai), `bandLabel`/`effectivePoints`.
- Produces: `GET /api/players/[id]` → `{ player, events }` (player từ view, không phone).

- [ ] **Step 1: Viết API**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = createAdminClient();
  const [{ data: player, error: pErr }, { data: events }] = await Promise.all([
    admin.from('players_public').select('*').eq('id', params.id).single(),
    admin.from('rating_events').select('id, points, reason, note, created_at').eq('player_id', params.id).order('created_at', { ascending: false }),
  ]);
  if (pErr || !player) return NextResponse.json({ error: 'Không tìm thấy VĐV' }, { status: 404 });
  return NextResponse.json({ player, events: events ?? [] });
}
```

- [ ] **Step 2: Viết trang hồ sơ**

Create `src/app/(public)/giai-dau-rating/vdv/[id]/page.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { bandLabel, effectivePoints } from '@/lib/rating';
import './../../rating.css';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; tested_at: string | null; }
interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }
const REASON: Record<string, string> = { initial: 'Xếp trình ban đầu', manual_adjust: 'Điều chỉnh điểm' };

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<P | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/players/${id}`).then(r => r.json()).then(d => { setPlayer(d.player ?? null); setEvents(d.events ?? []); }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="rating-page"><div className="wrap">Đang tải...</div></div>;
  if (!player) return <div className="rating-page"><div className="wrap">Không tìm thấy VĐV.</div></div>;
  const eff = effectivePoints(player); const atMax = player.band === 500;

  return (
    <div className="rating-page">
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,320px) 1fr', gap: 24, alignItems: 'start' }} className="profile-grid">
          <div style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 20, boxShadow: '5px 5px 0 var(--ink)', padding: 22, textAlign: 'center' }}>
            <div className="ava" style={{ width: 96, height: 96, fontSize: 34, margin: '0 auto 14px' }}>{player.avatar_url ? <img src={player.avatar_url} alt="" /> : initials(player.full_name)}</div>
            <h1 style={{ fontSize: '1.8rem' }}>{player.full_name}</h1>
            {player.nickname && <div style={{ color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>"{player.nickname}"</div>}
            <span className={`band b${player.band}`}>{bandLabel(player.band)}</span>
            <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '2.4rem', marginTop: 14 }}>{eff}<span style={{ display: 'block', fontFamily: 'Nunito', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>điểm hiệu dụng</span></div>
            <div style={{ marginTop: 14 }}>
              <div className="num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 5 }}>
                <span>{atMax ? 'Đã đạt mức cao nhất' : `Tiến độ lên A${player.band + 100}`}</span><span>{atMax ? '—' : `${player.progress_points}/100`}</span>
              </div>
              <div className="bar"><i className={atMax ? 'max' : ''} style={{ width: atMax ? '100%' : `${player.progress_points}%` }} /></div>
            </div>
            {player.tested_at && <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>Test trình: {player.tested_at}</div>}
          </div>

          <div style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 20, boxShadow: '5px 5px 0 var(--ink)', padding: 22 }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 14 }}>Lịch sử điểm</h2>
            {events.map(ev => (
              <div key={ev.id} style={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 12, padding: '13px 0', borderBottom: '2px dashed var(--line)' }}>
                <div className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{new Date(ev.created_at).toLocaleDateString('vi-VN')}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{REASON[ev.reason] ?? ev.reason}{ev.note && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)' }}>{ev.note}</span>}</div>
                <span className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, padding: '3px 12px', border: '2.5px solid var(--ink)', borderRadius: 999, background: ev.reason === 'initial' ? 'var(--cream2)' : ev.points < 0 ? 'var(--terra-soft)' : 'var(--mustard-soft)', height: 'fit-content' }}>
                  {ev.reason === 'initial' ? ev.points : (ev.points > 0 ? `+${ev.points}` : ev.points)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}
```

Thêm vào `rating.css`:

```css
@media (max-width:720px){ .rating-page .profile-grid{grid-template-columns:1fr !important} }
```

- [ ] **Step 3: Kiểm thử preview**

Mở hồ sơ một VĐV qua link từ bảng xếp hạng. Xác nhận sổ điểm hiện đúng thứ tự mới→cũ, dòng initial hiện số tuyệt đối, dòng cộng/trừ hiện +/−, không có SĐT.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/players/[id]/route.ts src/app/(public)/giai-dau-rating/vdv/[id]/page.tsx src/app/(public)/giai-dau-rating/rating.css
git commit -m "feat(public): hồ sơ VĐV + lịch sử điểm"
```

---

## Task 15: Trang chủ hệ thống + trang thể lệ + dọn mockup

**Files:**
- Create: `src/app/(public)/giai-dau-rating/page.tsx`
- Create: `src/app/(public)/giai-dau-rating/the-le/page.tsx`
- Delete: `public/mockup-giai-dau-rating.html`

**Interfaces:**
- Consumes: `GET /api/players`, `bandLabel`/`effectivePoints`.

- [ ] **Step 1: Viết trang chủ** `src/app/(public)/giai-dau-rating/page.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bandLabel, effectivePoints } from '@/lib/rating';
import './rating.css';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; }

export default function RatingHomePage() {
  const [players, setPlayers] = useState<P[]>([]);
  useEffect(() => { fetch('/api/players').then(r => r.json()).then(d => setPlayers((d.players ?? []).slice(0, 10))); }, []);

  return (
    <div className="rating-page">
      <div className="wrap">
        <span style={{ display: 'inline-block', background: 'var(--terra)', color: '#FFF6EC', fontFamily: 'Baloo 2', fontWeight: 700, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', padding: '7px 15px', border: '2.5px solid var(--ink)', borderRadius: 999, boxShadow: '3px 3px 0 var(--ink)', transform: 'rotate(-2deg)' }}>Giải đấu phân trình độ</span>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', margin: '18px 0 10px' }}>CLB Cầu Lông <span style={{ color: 'var(--terra)' }}>Song Thạch</span></h1>
        <p style={{ color: 'var(--brown)', fontWeight: 600, maxWidth: '60ch', marginBottom: 26 }}>Hệ thống điểm trình A100–A500. Ghép cặp theo tổng điểm để mọi trận cân sức. Điểm chỉ tăng, lịch sử công khai để ai cũng soi được.</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 34 }}>
          <Link href="/giai-dau-rating/bang-xep-hang" style={btn('var(--terra)', '#FFF6EC')}>Xem bảng xếp hạng →</Link>
          <Link href="/giai-dau-rating/the-le" style={btn('var(--cream2)', 'var(--ink)')}>Thể lệ</Link>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: 14 }}>Top 10</h2>
        {players.map((p, i) => (
          <Link key={p.id} href={`/giai-dau-rating/vdv/${p.id}`} className="row" style={{ gridTemplateColumns: '40px 1fr auto' }}>
            <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, textAlign: 'center' }}>{i + 1}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="ava">{p.avatar_url ? <img src={p.avatar_url} alt="" /> : initials(p.full_name)}</div>
              <span style={{ fontFamily: 'Baloo 2', fontWeight: 700 }}>{p.nickname || p.full_name}</span>
              <span className={`band b${p.band}`}>{bandLabel(p.band)}</span>
            </div>
            <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800 }}>{effectivePoints(p)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
function btn(bg: string, color: string): React.CSSProperties {
  return { fontFamily: 'Baloo 2', fontWeight: 700, textDecoration: 'none', padding: '12px 24px', borderRadius: 999, border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', background: bg, color };
}
function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0][0] : w[w.length - 2][0] + w[w.length - 1][0]).toUpperCase();
}
```

- [ ] **Step 2: Viết trang thể lệ** `the-le/page.tsx`

```tsx
import './../rating.css';

export const metadata = { title: 'Thể lệ · Giải đấu phân trình độ Song Thạch' };

export default function TheLePage() {
  return (
    <div className="rating-page">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 20 }}>Thể lệ hệ thống điểm trình</h1>
        {SECTIONS.map(s => (
          <div key={s.h} style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 16, boxShadow: '4px 4px 0 var(--ink)', padding: '18px 22px', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--terra-d)' }}>{s.h}</h2>
            <div style={{ fontWeight: 600, color: 'var(--brown)' }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  { h: '5 mức trình A100–A500', body: 'Từ thấp lên cao: A100, A200, A300, A400, A500. Mức trình ban đầu do BTC chấm sau buổi test thực tế tại sân để tránh khai gian.' },
  { h: 'Điểm hiệu dụng', body: 'Mỗi VĐV có mức trình cộng với điểm tiến độ. Ví dụ A300 tích thêm 60 điểm thì điểm hiệu dụng là 360. Con số này dùng để ghép cặp và xếp hạng.' },
  { h: 'Ghép cặp theo tổng điểm', body: 'Mỗi giải công bố một hạng (tổng điểm tối đa của cặp). Cộng điểm hiệu dụng của hai người lại phải nằm trong hạng đó — cho phép người trình cao "gánh" người trình thấp để cân sức các cặp.' },
  { h: 'Thăng hạng', body: 'Tích đủ 100 điểm tiến độ thì lên một mức trình. Điểm chỉ được cộng khi vô địch. Đạt A500 rồi thì điểm vẫn cộng tiếp để xếp hạng trong nhóm mạnh nhất, nhưng không có mức cao hơn.' },
  { h: 'Điểm chỉ tăng, lịch sử công khai', body: 'Không có hạ hạng khi thua. Mọi thay đổi điểm đều ghi vào sổ công khai kèm lý do, nên không ai giấu trình được lâu — cả cộng đồng cùng giám sát.' },
];
```

- [ ] **Step 3: Kiểm thử preview**

Mở `/giai-dau-rating` và `/giai-dau-rating/the-le`. Xác nhận top 10 hiện, các link điều hướng chạy, trang thể lệ đọc rõ trên mobile.

- [ ] **Step 4: Xoá file mockup**

```bash
git rm public/mockup-giai-dau-rating.html
```

- [ ] **Step 5: Chạy toàn bộ test + build**

Run: `npm test && npm run build`
Expected: test PASS toàn bộ; build thành công không lỗi TypeScript.

- [ ] **Step 6: Commit**

```bash
git add src/app/(public)/giai-dau-rating/page.tsx src/app/(public)/giai-dau-rating/the-le/page.tsx
git commit -m "feat(public): trang chủ hệ thống + thể lệ; dọn mockup"
```

---

## Self-Review

**Spec coverage** — đối chiếu từng mục spec với task:

| Spec | Task |
|---|---|
| Luật điểm (deriveBandProgress, applyPoints, trần A500, bút toán âm) | 1, 2 |
| Bảng `players` + `rating_events` + view + RLS | 3 |
| Ghi hồ sơ + sổ điểm (nguồn sự thật) | 4 |
| Admin: sidebar + danh sách | 7 |
| Admin: thêm/sửa + upload ảnh + cảnh báo trùng tên | 8 |
| Admin: cộng/trừ điểm có xem trước | 9 |
| Nhập Excel: chuẩn hoá SĐT, 4 nhóm, luật lỗi, không tự tích khi mất dữ liệu | 10, 11, 12 |
| Công khai: bảng xếp hạng (không SĐT) | 13 |
| Công khai: hồ sơ + lịch sử điểm | 14 |
| Công khai: trang chủ + thể lệ | 15 |
| Xoá mockup trước deploy | 15 |

Không còn mục spec nào thiếu task.

**Ghi chú lệch spec (có chủ đích):**
- Spec ghi thư viện `xlsx`; plan dùng `exceljs` đã có sẵn — tránh thêm dependency thừa.
- Spec ghi "transaction" cho nhập Excel; Supabase JS không có transaction đa câu lệnh, nên plan ghi tuần tự từng hồ sơ độc lập (mỗi hồ sơ + dòng sổ của nó ghi liền nhau). Lỗi giữa chừng để lại các hồ sơ đã ghi hợp lệ, không có hồ sơ nửa vời. Đây là đánh đổi thực tế; nếu cần rollback tuyệt đối phải viết Postgres function — để dành nếu vận hành thấy cần.
- Trùng tên khi thêm tay: spec nói "cảnh báo không chặn". Plan Task 8 chưa hiện cảnh báo real-time (mockup có). **Bổ sung:** đây là nice-to-have; API vẫn cho tạo trùng tên. Nếu muốn cảnh báo, thêm sau — không chặn luồng chính.

**Placeholder scan:** không còn "TBD/TODO"; mọi step có code thật.

**Type consistency:** `Band`, `PlayerInput`, `PlayerRecord`, `RawRow`, `ExistingPlayer`, `Reconciled` dùng nhất quán giữa các task. `effectivePoints` nhận `{band, progress_points}` — khớp mọi nơi gọi. `applyPoints`/`deriveBandProgress` trả `{band, progress}` (không phải `progress_points`) — các task tiêu thụ đã dùng đúng `.progress`.

---

## Execution Handoff

Kế hoạch đã lưu ở `docs/superpowers/plans/2026-07-25-csdl-vdv-he-diem.md`.
