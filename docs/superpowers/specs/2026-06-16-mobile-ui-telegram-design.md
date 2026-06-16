# Design: Mobile UI Optimization + Telegram Booking Notification

**Date:** 2026-06-16  
**Status:** Approved

---

## Overview

Two independent improvements:
1. Move the booking widget to the top of the page on mobile so users see it immediately without scrolling.
2. Send an instant Telegram message to the owner whenever a court booking is successfully created.

---

## Part 1: Mobile UI — Widget First on Mobile

### Problem

`football/page.tsx` and `badminton/page.tsx` use a `grid grid-cols-1 lg:grid-cols-5` layout. In HTML, the info section (court list, price table, features) comes before the booking widget. On desktop, CSS grid places them side-by-side (2 + 3 columns). On mobile (single column), HTML order = display order — users must scroll past the entire info section before reaching the booking widget.

### Fix

Swap the HTML order in both pages: move the booking widget div before the info div. Add `lg:col-start-1 lg:col-span-2` to the info div so it snaps back to the left columns on desktop. The widget div keeps its existing `lg:col-span-3` class.

**Result:**
- Mobile: widget renders first (top of page), info section below
- Desktop (lg+): layout unchanged — info left (2 cols), widget right (3 cols)

### Files Changed

- `src/app/(public)/sports/football/page.tsx` — swap info and widget divs, add `lg:col-start-1` to info div
- `src/app/(public)/sports/badminton/page.tsx` — same change

---

## Part 2: Telegram Instant Notification

### Architecture

A thin `lib/telegram.ts` module calls the Telegram Bot API (`sendMessage`) via `fetch`. No external library. Called from `api/bookings/route.ts` after the booking is inserted into the database, fire-and-forget (errors are caught and logged, never block the HTTP response).

### New File: `src/lib/telegram.ts`

Exports one function:

```ts
sendTelegramNotification(data: TelegramBookingData): Promise<void>
```

Sends a Markdown-formatted message to the configured chat. Silently returns if env vars are missing (so the app works in dev without Telegram configured).

### Message Format

```
🏟️ ĐẶT SÂN MỚI

📌 BK-XXXXXXXX
🏟 [court_name] · [venue_label]
📅 [weekday], [dd/MM/yyyy]
⏰ [start_time] – [end_time] ([duration]h)

👤 [user_name or "(Không tên)"]
📞 [user_phone]
💰 [total_price VND] — [payment_label]

👉 Xem admin: https://[domain]/admin/bookings
```

Payment label: `Chuyển khoản` or `Thanh toán tại sân`.

### API Route Change: `src/app/api/bookings/route.ts`

After the existing `sendBookingConfirmation(...)` call, add:

```ts
sendTelegramNotification({ ... }).catch(err => console.error('[Telegram]', err));
```

### New Environment Variables

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather |
| `TELEGRAM_CHAT_ID` | Your personal chat ID or group ID |
| `NEXT_PUBLIC_SITE_URL` | Production domain, e.g. `https://songthach.vn` — used to build the admin link in the Telegram message |

`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are optional at runtime — if absent, `sendTelegramNotification` returns early without error. `NEXT_PUBLIC_SITE_URL` falls back to `http://localhost:3000` if not set.

### Setup Steps (owner does once)

1. Open Telegram, search `@BotFather`, send `/newbot`, follow prompts → copy the token
2. Send any message to your new bot
3. Visit `https://api.telegram.org/bot{TOKEN}/getUpdates` → find `"chat":{"id":...}` → copy that number
4. Add to `.env.local` on VPS:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABCdef...
   TELEGRAM_CHAT_ID=987654321
   ```
5. Restart the Next.js server

---

## What Is NOT Changing

- Email confirmation to customers: already working, no changes needed
- Admin panel, booking logic, pricing, auth: untouched
- Desktop layout: unchanged

---

## Testing Plan

- [ ] Mobile (390px viewport): booking widget visible above the fold on `/sports/football` and `/sports/badminton`
- [ ] Desktop (1280px): layout unchanged — info left, widget right
- [ ] Complete a test booking → Telegram message received within ~2 seconds
- [ ] Complete a test booking → customer email received (verify existing feature still works)
- [ ] Missing `TELEGRAM_BOT_TOKEN`: booking succeeds, no crash, error logged to console
