# Song Thạch — Retro Redesign (Bold 90s Athletic)

**Date:** 2026-06-27  
**Scope:** All pages — public site + admin  
**Approach:** Full design system overhaul (Hướng B)  
**Colors:** Unchanged — only the *way* colors are applied changes  

---

## 1. Design Principle

Phong cách **Bold 90s Athletic** — gợi nhớ poster thể thao Nike/Adidas thập niên 90: chữ condensed cực đậm ALL CAPS, góc vuông hoàn toàn, thick solid borders, offset "shadow" 3D giả, flat color blocks thay gradients, diagonal stripe accent. Không hoài cổ quá mức — vẫn cần readable và functional cho booking/form.

---

## 2. Design Tokens

### Border Radius
```css
--radius: 0px;
```
Tất cả bo tròn bị loại bỏ. Mọi card, button, input, badge đều vuông.

### Borders
- Default card/section border: `2–3px solid`
- Active/focus: `3px solid var(--primary)`
- Thick accent border (section divider): `4px solid`

### Shadows (Retro Offset)
- Card hover: `box-shadow: 5px 5px 0 <accent-color>`
- Button resting: `box-shadow: 3px 3px 0 <darker>`
- Button active (press): shadow collapsed to `1px 1px 0`
- Button hover: `transform: translate(-2px, -2px)` + shadow `5px 5px 0`

### Backgrounds
- Gradients loại bỏ hoàn toàn → flat solid fills
- Diagonal stripe pattern (decorative accent only):
  ```css
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(156,226,92,0.15) 4px,
    rgba(156,226,92,0.15) 8px
  );
  ```

---

## 3. Typography

### Font Changes
| Role | Trước | Sau |
|---|---|---|
| Hero / Section title | Bricolage Grotesque | **Bebas Neue** |
| Buttons, badges, labels | Oswald / mixed | **Bebas Neue** |
| Sport labels / secondary | Oswald | Oswald (giữ) |
| Body text | Geist | Geist (giữ) |
| Wedding serif | Playfair Display | Playfair Display (giữ, only wedding zone) |
| Mono labels (footer) | IBM Plex Mono | IBM Plex Mono (giữ) |

### Google Fonts import thêm
```
Bebas Neue:wght@400
```
(Bebas Neue chỉ có 1 weight — 400, nhưng intrinsically bold/condensed)

### Usage Rules
- Tất cả `h1`, `h2`, `h3`, section titles: Bebas Neue, `text-transform: uppercase`, `letter-spacing: 0.04em`
- Buttons, CTA: Bebas Neue, `font-size: 1rem–1.1rem`, `letter-spacing: 0.08em`
- Badges/tags: Bebas Neue, `font-size: 0.75rem`, `letter-spacing: 0.1em`
- Eyebrow labels: Oswald hoặc IBM Plex Mono, uppercase
- Body/description: Geist, normal case, `font-size: 0.875–1rem`

---

## 4. Color Application (palette unchanged)

| Token | Hex | Retro usage |
|---|---|---|
| Pitch (sports primary) | `#0F3C2C` | Solid fills, thick borders |
| Lime | `#9CE25C` | Offset shadow color, accent stripe, active state |
| Ink | `#10150F` | Dark backgrounds (hero, footer) |
| Sand | `#F4EEE1` | Light section backgrounds |
| Paper | `#FBFAF7` | Navbar bg, card bg |
| Rose | `#C8746B` | Wedding primary, offset shadow wedding |
| Gold | `#c1922f` | Primary actions, footer copyright bg |
| Yellow | `#FBD043` | Footer accent bar, social icon bg |

**Key rule:** No gradient between two of these colors. Colors used at full saturation as solid blocks.

---

## 5. Component Patterns

### `.sports-card` (and all cards)
```css
border: 3px solid #0F3C2C;
border-radius: 0;
box-shadow: 5px 5px 0 #9CE25C;
transition: transform 150ms, box-shadow 150ms;
```
Hover:
```css
transform: translate(-2px, -2px);
box-shadow: 7px 7px 0 #9CE25C;
```

### `.sports-btn`
```css
border-radius: 0;
border: 2px solid #0F3C2C;
font-family: 'Bebas Neue';
letter-spacing: 0.08em;
box-shadow: 3px 3px 0 #3F8F33;
```
Hover: `translate(-2px, -2px)`, shadow `5px 5px 0`  
Active: `translate(2px, 2px)`, shadow `1px 1px 0`

### `.sports-btn-accent` (Lime fill)
Same pattern, shadow color = `#0F3C2C` (Pitch)

### `.wedding-btn`
```css
border-radius: 0;
border: 2px solid #C8746B;
font-family: 'Bebas Neue'; /* overrides Playfair for buttons */
box-shadow: 3px 3px 0 #8B3D37;
```

### `.time-slot`
```css
border-radius: 0;
border: 2px solid;
```

### Badges / Tags
```css
border-radius: 0;
font-family: 'Bebas Neue';
font-size: 0.7rem;
letter-spacing: 0.1em;
text-transform: uppercase;
border: 1.5px solid currentColor;
```

---

## 6. Navbar

**Desktop:**
- `bg-[#FBFAF7]` solid (no blur/glassmorphism)
- `border-bottom: 3px solid #0F3C2C`
- Logo: Bebas Neue, `tracking-[0.2em]`, no dot decoration
- Nav links: Oswald, uppercase, `text-sm`, hover: underline offset 4px
- CTA "Đặt sân": Bebas Neue, square (no `rounded-full`), `border: 2px solid #0F3C2C`, offset shadow `3px 3px 0 #9CE25C`
- User dropdown: square corners, `border: 2px solid var(--border)`

**Mobile menu:**
- Full-width solid color blocks (no `rounded-xl`)
- Links: square bg highlight on active

---

## 7. Footer

**Main footer block:**
- `background: #10150F` (Ink)
- `border-top: 4px solid #9CE25C` (Lime stripe — retro accent)
- Section titles: Bebas Neue, `font-size: 1.1rem`, color Lime
- Body links: Geist, `color: rgba(255,255,255,0.7)`, hover: `color: white`
- Social icons: square frame `border: 2px solid #FBD043`, no `border-radius`, `color: #FBD043`

**Copyright bar:**
- `background: #9CE25C` (Lime solid — reversed from current yellow)
- `color: #10150F` (Ink)
- Font: Oswald, uppercase

---

## 8. Mobile Tab Bar

- `border-top: 3px solid #0F3C2C`
- No shadow, flat bg `#FBFAF7`
- Active tab: square bg fill `#0F3C2C`, icon + label `color: #9CE25C`
- Inactive: `color: #6A6F66`

---

## 9. Homepage

> **Lưu ý:** `src/app/(public)/page.tsx` render **inline `<nav>` và `<footer>` riêng** (không dùng shared `<Navbar />` / `<Footer />`). Cần update cả 2 chỗ này trong file homepage, song song với shared components.

- **Announcement bar:** `bg-[#10150F]`, Bebas Neue, lime accent — already retro-compatible, refine only
- **Inline nav (homepage):** Apply same rules as §6 — solid bg, `border-bottom: 3px solid #0F3C2C`, square CTA, Bebas Neue logo
- **Hero section:** Keep `bg-[#0F3C2C]`, replace `CourtLines` SVG with bold diagonal stripe CSS overlay. H1 in Bebas Neue, `font-size: clamp(48px, 7vw, 80px)`. News card: `border: 3px solid rgba(156,226,92,0.4)`, square corners, tag in Bebas Neue
- **Services section:** Cards → retro card pattern (§5). Service icons → retro SVG (§14)
- **Cafe spotlight:** flat Sand bg, square image frame `border: 3px solid #E6E2D6`
- **Location section:** Keep Pitch bg, square info blocks, retro icon style
- **Inline footer (homepage):** Apply same rules as §7 — ink bg, lime top border, Bebas Neue section titles, square social icons, lime copyright bar

---

## 10. Sports Pages (Football + Badminton)

- **Hero:** Image stays. Dark overlay replaced by: `bg-gradient-to-t from-[#10150F] via-[#10150F]/60 to-transparent` — keep dark bottom but sharper. Title: Bebas Neue, very large. Badges: square no-radius
- **BookingPanel / TimePicker:** `.time-slot` square corners. "Đặt sân" button: retro btn pattern
- **Info cards (Sân 5A, 5B…):** `.sports-card` retro pattern
- **Feature list (đèn LED, bãi đỗ xe):** square icon box `3px solid`, Bebas Neue label
- **Classes section:** square card, bold heading, offset shadow

---

## 11. Wedding Page

Retro applied more subtly — wedding still needs elegance.

**Font split (wedding zone only):**
- `h1`, `h2`, section titles, CTA buttons → **Bebas Neue** (retro energy, large scale)
- `h3`, sub-headings, pull quotes, form labels → **Playfair Display** (elegance, detail level)
- Body text, descriptions → Geist (unchanged)

**Other changes:**
- Inquiry form: `.wedding-input` border-bottom only → full `border: 2px solid #C8746B` on all 4 sides, square corners
- CTA button: `.wedding-btn` retro (§5)
- Gallery: square image frames `border: 3px solid #C8746B`, `border-radius: 0`
- Decorative dividers: `border: 2px solid #C8746B` (replace thin gold-divider with bolder line)

---

## 12. Cafe Page

- Rose color scheme, same retro token application
- Cards: `border: 3px solid #C8746B`, offset shadow `5px 5px 0 #F6EBE9`

---

## 13. Admin Pages

Light retro touch — prioritize usability:
- All `border-radius` → 0
- Page `<h1>/<h2>`: Bebas Neue
- `.admin-card`: `border: 2px solid #e5e7eb`, `border-radius: 0`, `box-shadow: 3px 3px 0 #e5e7eb`
- Table `<th>`: Oswald uppercase, `border-bottom: 2px solid #0F3C2C`
- Buttons: retro pattern (§5), smaller offset `2px 2px 0`
- Status badges: square corners, keep color coding
- Form inputs: `border-radius: 0`, `border: 2px solid`

---

## 14. Icons (Sports Retro)

**Source:** SVGRepo.com (free, no login, embed as inline SVG)

| Icon | Usage | SVGRepo search term |
|---|---|---|
| Football | Trang chủ service card, Navbar, football page | "soccer ball retro" / "football vintage" |
| Badminton shuttlecock | Service card, badminton page | "shuttlecock retro" / "badminton vintage" |
| Badminton racket | Service card, Navbar | "badminton racket flat" |
| Trophy | Giải đấu page, admin | "trophy vintage" |
| Court/field | Sports section | "sports field" |

**Implementation:** Inline SVG components in `src/components/icons/` — `FootballIcon.tsx`, `ShuttlecockIcon.tsx`, `RacketIcon.tsx`, `TrophyIcon.tsx`. Accept `size` and `color` props. Thick stroke (`strokeWidth: 2`), minimal detail = đúng chất retro flat.

Nếu SVGRepo free không có đủ style, fallback: vẽ inline SVG thủ công với thick stroke + flat geometry.

---

## 15. Out of Scope

- Không thay đổi màu sắc hex (giữ nguyên palette)
- Không thay đổi logic booking/form/API
- Không thay đổi Supabase auth flow
- Admin data tables: chỉ border + typography, không redesign layout

---

## 16. Implementation Order

1. `globals.css` — tokens (radius, font import, CSS classes)
2. `tailwind.config.ts` — font family, thêm Bebas Neue
3. Shared components: Navbar → Footer → MobileTabBar
4. Homepage (`src/app/(public)/page.tsx`)
5. Sports pages (football → badminton)
6. Wedding page
7. Cafe page
8. Admin pages (light touch)
9. Icon components (`src/components/icons/`)
10. Test build `npm run build`
