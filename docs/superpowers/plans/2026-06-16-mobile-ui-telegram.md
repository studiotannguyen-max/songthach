# Mobile UI + Telegram Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the booking widget to the top of sports pages on mobile, and send an instant Telegram message to the owner whenever a court booking is successfully created.

**Architecture:** Two independent changes. (1) Swap HTML order of info/widget divs and use explicit CSS grid column placement so desktop layout is preserved. (2) New `lib/telegram.ts` module calls Telegram Bot API via `fetch`; called fire-and-forget from the booking API route, same pattern as the existing email call.

**Tech Stack:** Next.js 14, Tailwind CSS, Telegram Bot API (no new npm packages)

---

## File Map

| Action | File | What changes |
|---|---|---|
| Create | `src/lib/telegram.ts` | New module — formats and sends Telegram message |
| Modify | `src/app/api/bookings/route.ts` | Import and call `sendTelegramNotification` after booking insert |
| Modify | `src/app/(public)/sports/football/page.tsx` | Swap widget/info div order; add explicit lg grid columns |
| Modify | `src/app/(public)/sports/badminton/page.tsx` | Same swap as football |
| Modify | `.env.local.example` | Document 3 new env vars |

---

## Task 1: Create `src/lib/telegram.ts`

**Files:**
- Create: `src/lib/telegram.ts`

- [ ] **Step 1: Create the file with this exact content**

```typescript
const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const date = new Date(+y, +m - 1, +d);
  return `${WEEKDAYS[date.getDay()]}, ${d}/${m}/${y}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export interface TelegramBookingData {
  booking_id:     string;
  court_name:     string;
  venue_label:    string;
  booking_date:   string; // yyyy-MM-dd
  start_time:     string;
  end_time:       string;
  duration:       number;
  user_name:      string | null;
  user_phone:     string;
  total_price:    number;
  payment_method: 'bank_transfer' | 'pay_at_venue';
}

export async function sendTelegramNotification(data: TelegramBookingData): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const paymentLabel = data.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán tại sân';
  const name         = data.user_name || '(Không tên)';

  const text = [
    `🏟️ *ĐẶT SÂN MỚI*`,
    ``,
    `📌 \`${data.booking_id}\``,
    `🏟 ${data.court_name} · ${data.venue_label}`,
    `📅 ${formatDate(data.booking_date)}`,
    `⏰ ${data.start_time} – ${data.end_time} (${data.duration}h)`,
    ``,
    `👤 ${name}`,
    `📞 ${data.user_phone}`,
    `💰 ${formatCurrency(data.total_price)} — ${paymentLabel}`,
    ``,
    `👉 [Xem admin](${siteUrl}/admin/bookings)`,
  ].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd D:/songthach
npx tsc --noEmit
```

Expected: no output (zero errors). If errors appear, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
cd D:/songthach
git add src/lib/telegram.ts
git commit -m "feat: add telegram notification module"
```

---

## Task 2: Wire Telegram into the booking API

**Files:**
- Modify: `src/app/api/bookings/route.ts`

- [ ] **Step 1: Add the import at the top of the file**

Open `src/app/api/bookings/route.ts`. After the existing import line:
```typescript
import { sendBookingConfirmation } from '@/lib/email';
```
Add:
```typescript
import { sendTelegramNotification } from '@/lib/telegram';
```

- [ ] **Step 2: Add the Telegram call after the email call**

Find this block (around line 205–217):
```typescript
    // Gửi email xác nhận — không block response nếu email thất bại
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
      total_price,
      payment_method,
    }).catch(err => console.error('[Email] Gửi thất bại:', err));
```

Add these lines immediately after (before the `return NextResponse.json(...)` line):
```typescript
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
      total_price,
      payment_method,
    }).catch(err => console.error('[Telegram] Gửi thất bại:', err));
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd D:/songthach
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd D:/songthach
git add src/app/api/bookings/route.ts
git commit -m "feat: send telegram notification on new booking"
```

---

## Task 3: Fix mobile layout — football page

**Files:**
- Modify: `src/app/(public)/sports/football/page.tsx`

**Context:** The page has a 5-column grid containing two children: the info div (col-span-2) and the booking widget div (col-span-3). On mobile they stack in HTML order — info first, widget second. We need widget first on mobile but info first on desktop.

**How:** Put the widget div first in HTML. Give it `lg:col-start-3 lg:col-span-3` (columns 3–5 on desktop). Give the info div `lg:col-start-1 lg:row-start-1 lg:col-span-2` (columns 1–2, same row, on desktop). On mobile (1-column grid, no `lg:` classes active), widget renders first naturally.

- [ ] **Step 1: Find the main grid div**

In `src/app/(public)/sports/football/page.tsx`, locate:
```tsx
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
```

- [ ] **Step 2: Swap the two divs and update class names**

Replace the entire grid div (from `<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">` to its closing `</div>`) with the widget div first, then the info div. The key class changes are:

**Widget div** — was `<div className="lg:col-span-3">`, becomes:
```tsx
            {/* Booking widget — first in HTML = first on mobile */}
            <div className="lg:col-start-3 lg:col-span-3">
```

**Info div** — was `<div className="lg:col-span-2 space-y-8">`, becomes:
```tsx
            {/* Info — explicit col placement keeps it left on desktop */}
            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-8">
```

The full replacement looks like:
```tsx
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Booking widget — first in HTML = first on mobile */}
            <div className="lg:col-start-3 lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                <div className="flex gap-2">
                  {['Sân 5 người', 'Sân 7 người'].map((tab, i) => (
                    <button key={tab} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${i === 0 ? 'bg-sports-primary text-white' : 'bg-card border border-border text-foreground/70 hover:border-sports-primary'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
                <BookingWidget courts={COURTS_5} venueName="Sân Bóng đá 5 người" />
              </div>
            </div>

            {/* Info — explicit col placement keeps it left on desktop */}
            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-8">
```

(The contents of both divs are unchanged — only the order and class names differ.)

- [ ] **Step 3: Verify the page compiles**

```bash
cd D:/songthach
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Check in browser at mobile size (390px wide)**

Start dev server if not running: `npm run dev`

Open `http://localhost:3000/sports/football` in a browser with DevTools → set viewport to 390×844 (iPhone 14). Verify the booking widget ("Đặt Sân Bóng Đá") is the first thing visible after the hero image — before any court cards or price tables.

- [ ] **Step 5: Check desktop layout is unchanged**

Set DevTools viewport back to 1280×800. Verify: info/court cards on the left, booking widget on the right.

- [ ] **Step 6: Commit**

```bash
cd D:/songthach
git add src/app/(public)/sports/football/page.tsx
git commit -m "fix: show booking widget first on mobile (football page)"
```

---

## Task 4: Fix mobile layout — badminton page

**Files:**
- Modify: `src/app/(public)/sports/badminton/page.tsx`

**Context:** Same problem and same fix as Task 3. The badminton page also uses `grid grid-cols-1 lg:grid-cols-5` with info div before widget div.

- [ ] **Step 1: Find the main grid div**

In `src/app/(public)/sports/badminton/page.tsx`, locate:
```tsx
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left: info */}
            <div className="lg:col-span-2 space-y-8">
```

- [ ] **Step 2: Swap the two divs and update class names**

**Widget div** — was `<div className="lg:col-span-3">`, becomes:
```tsx
            {/* Right: booking widget — first in HTML = first on mobile */}
            <div className="lg:col-start-3 lg:col-span-3">
```

**Info div** — was `<div className="lg:col-span-2 space-y-8">`, becomes:
```tsx
            {/* Left: info — explicit col placement keeps it left on desktop */}
            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-8">
```

The full replacement:
```tsx
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Right: booking widget — first in HTML = first on mobile */}
            <div className="lg:col-start-3 lg:col-span-3">
              <div className="sticky top-24">
                <BookingWidget courts={COURTS} venueName="Sân Cầu lông" />
              </div>
            </div>

            {/* Left: info — explicit col placement keeps it left on desktop */}
            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-8">
```

(Contents of both divs are unchanged.)

- [ ] **Step 3: Verify TypeScript**

```bash
cd D:/songthach
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Check in browser at mobile size**

Open `http://localhost:3000/sports/badminton` at 390px viewport. Booking widget must be visible first, above court list and price table.

- [ ] **Step 5: Check desktop layout is unchanged**

At 1280px: info left, widget right — same as before.

- [ ] **Step 6: Commit**

```bash
cd D:/songthach
git add src/app/(public)/sports/badminton/page.tsx
git commit -m "fix: show booking widget first on mobile (badminton page)"
```

---

## Task 5: Document new env vars

**Files:**
- Modify: `.env.local.example`

- [ ] **Step 1: Add the new variables**

Open `.env.local.example`. After the `# Email (Resend)` block, add:

```
# Telegram (thông báo đặt sân về chủ)
TELEGRAM_BOT_TOKEN=123456789:ABCdef...   # lấy từ @BotFather
TELEGRAM_CHAT_ID=987654321               # chat ID của bạn
NEXT_PUBLIC_SITE_URL=https://songthach.vn
```

- [ ] **Step 2: Commit**

```bash
cd D:/songthach
git add .env.local.example
git commit -m "docs: document Telegram and site URL env vars"
```

---

## Task 6: Setup Telegram bot and end-to-end test

This task is done by the **owner** (not the code agent). It verifies the full flow works on the real server.

- [ ] **Step 1: Create the bot**

  1. Open Telegram, search for `@BotFather`
  2. Send `/newbot`
  3. Follow the prompts (choose a name and username)
  4. Copy the token that BotFather gives you (format: `123456789:ABCdef...`)

- [ ] **Step 2: Get your Chat ID**

  1. Send any message (e.g. "hello") to your new bot
  2. Open this URL in a browser (replace `TOKEN` with your actual token):
     ```
     https://api.telegram.org/botTOKEN/getUpdates
     ```
  3. Find `"chat":{"id":XXXXXXXXX}` in the JSON response — that number is your `CHAT_ID`

- [ ] **Step 3: Add env vars to server**

On your VPS, add to the `.env.local` file in the project folder:
```
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
NEXT_PUBLIC_SITE_URL=https://songthach.vn
```
Then restart the Next.js server (e.g. `pm2 restart songthach` or your deployment command).

- [ ] **Step 4: Make a test booking**

Go to `https://songthach.vn/sports/badminton`, fill in a real booking with your own phone/email, and submit.

Expected results:
- You receive a Telegram message within ~2 seconds with all booking details
- The customer email arrives in your inbox (existing feature)
- The booking appears in `/admin/bookings`

- [ ] **Step 5: Verify mobile layout on real device**

Open `https://songthach.vn/sports/football` on your phone. The booking widget should be the first content block visible after the hero image — no scrolling needed.
