# Design: Điều Lệ Giải Cầu Lông Song Thạch 2026 — Standalone HTML Retro

**Date:** 2026-07-01  
**Type:** Standalone HTML file redesign  
**Output:** `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

---

## Goal

Redesign the existing điều lệ HTML file to match the retro visual style of songthach.com, while keeping all original content accurate. The file must be a self-contained standalone HTML (no build step, no framework dependency) that can be shared as a link or via social media.

## Design Tokens (from songthach.com)

```css
--cream:     #F4E9D6
--cream2:    #FBF4E6
--paper:     #FFFBF2
--mustard:   #E3A21A
--mustard-d: #C5860F
--mustard-soft: #F6DD9E
--terra:     #C5532F
--terra-d:   #A33E1F
--terra-soft:#F1C9B4
--ink:       #3B2A1E
--brown:     #7A5638
--muted:     #8A6E54
--line:      #E2CFA9
```

**Fonts:** Baloo 2 (700/800, headings + badges) + Nunito (400/600/700/800, body) via Google Fonts.

**Border style:** `2.5px solid var(--ink)` + offset box-shadow `3–5px solid var(--ink)`.

**Pill badges:** `border-radius: 999px`.

**Cards:** `border-radius: 16–22px`.

---

## Page Structure

### 1. Hero (compact, formal)
- Background: `var(--cream)` with sunburst SVG (mustard, opacity 0.4) in top-right corner
- Pill sticker (terra): "Điều lệ chính thức · Giải gây quỹ từ thiện", rotated -2deg
- Title (Baloo 2, clamp 2.4rem → 4rem): "Giải Cầu Lông **Song Thạch** Mở Rộng 2026"  
  - "Song Thạch" colored `var(--terra)`, "Mở Rộng 2026" colored `var(--mustard-d)`
- Subtitle line: "CLB Cầu Lông Song Thạch & Đoàn Thanh niên xã Hưng Thịnh"
- 3 fact cards (cream2 bg, ink border, offset shadow): Thời gian · Địa điểm · Hạn đăng ký
- 2 CTA buttons (pill, ink border, offset shadow): "Đăng ký thi đấu →" (terra) + "Xem thể lệ" (cream2)

### 2. Phần I — Nội dung thi đấu & giải thưởng
- Section kicker pill (terra-soft, rotated): "Nội dung & khen thưởng"
- 6 group cards in responsive grid (3-col → 2-col → 1-col):
  - Each card: paper bg, 2.5px ink border, 22px radius, 5px offset shadow
  - Top row: group badge pill (mustard-d) + group name (Baloo 2) + age label | fee pill (mustard, rotated 2deg)
  - Divider: 2.5px dashed `var(--line)`
  - Content row: event pills (cream bg, ink border) + prize rows with medal SVG icons
  - Groups 1–3: prize = "Huy chương + bằng khen + tiền thưởng" (no detailed amounts shown in small pill)
  - Groups 4–6: prize rows with gold/silver/bronze medal icons + amount in terra-d
- Note under section: "Mỗi nội dung tổ chức khi đủ số lượng VĐV/cặp theo điều lệ"

**Data (from HTML file — authoritative):**
| Nhóm | Tên | Tuổi | Nội dung | Lệ phí | Giải nhất |
|------|-----|------|----------|--------|----------|
| 1 | Tiểu học | ≤11 | Đơn nam, Đơn nữ | Miễn phí | 350k + HC + bằng |
| 2 | 12–13 tuổi | 12–13 | Đơn nam, Đơn nữ, Đôi nam | 100k | Đơn 350k / Đôi 500k |
| 3 | 14–15 tuổi | 14–15 | Đơn nam, Đơn nữ, Đôi nam | 100k | Đơn 350k / Đôi 500k |
| 4 | 16–18 tuổi | 16–18 | Đôi nam, Đôi nam nữ | 150k | 800k |
| 5 | Phong trào CLB Khách mời | Không giới hạn | Đôi nam, Đôi nữ, Đôi nam nữ | 250k | 3.000k |
| 6 | Phong trào nâng cao | Không giới hạn | Đôi nam, Đôi nữ, Đôi nam nữ | 250k | 3.000k |

### 3. Phần II & III — Quy định & Lệ phí (2-column layout)
- Left column (0.9fr): Lệ phí table — ink border, mustard header, retro rounded corners
- Right column (1.1fr): Quy định — numbered rules with mustard circle icons (8 rules)
- Stacks to 1 column below 860px

### 4. Phần IV — Đăng ký & Chuyển khoản
- Full-width terra background section with subtle ray SVG overlay
- 2-column: left = CTA text + button; right = bank card (cream2, ink border, 7px offset shadow)
- Bank card rows: Ngân hàng, Chủ TK, Số TK, Cú pháp CK, Zalo xác nhận
- Notes: lệ phí không hoàn lại; liên hệ 0988918418

### 5. Phần V — Học bổng (accordion)
- `<details>/<summary>` native HTML — no JS needed
- Summary bar: ink bg, cream text, "89 em học sinh xin học bổng — click để xem"
- When open: full table with STT, Họ tên, Trường, Lớp, Hoàn cảnh
- Intro text above: "Toàn bộ tiền lệ phí, tài trợ vượt chi phí tổ chức sẽ được trao học bổng..."

### 6. Footer
- ink bg, cream2 text
- "Thay mặt Ban Tổ Chức · CLB Cầu Lông Song Thạch"
- "Mọi thắc mắc: Zalo/SĐT 0988918418 (Linh)"
- "songthach.com"

---

## Technical Constraints

- **Standalone HTML**: All CSS in `<style>` tag, no external CSS dependencies
- **Google Fonts**: `<link>` to Baloo 2 + Nunito (graceful fallback to system fonts)
- **No JavaScript**: Accordion via `<details>/<summary>`, responsive via CSS grid/flexbox
- **Mobile first**: Works on phone screens (360px+); grid collapses cleanly
- **Print friendly**: `@media print` — remove hero decorations, keep tables clean

---

## Out of Scope

- Animation / JavaScript interactions beyond native details/summary
- Dark mode
- Integration with Next.js project (this is a standalone HTML file only)
