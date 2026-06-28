# Giai Cau Long Layout Compact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thu gọn bố cục trang `/giai-cau-long-2026` bằng cách xóa section Mission thừa, giảm padding hero, compact section Đăng ký, và giảm spacing toàn trang.

**Architecture:** Chỉnh sửa trực tiếp 2 file — `page.tsx` (xóa JSX section Mission, chỉnh lede đăng ký) và `giai.css` (giảm padding/margin). Không thêm component mới, không thay đổi cấu trúc routing.

**Tech Stack:** Next.js App Router, CSS thuần (scoped dưới `.giai-page`), TypeScript/JSX

## Global Constraints

- Không thay đổi màu sắc, font, border-radius, box-shadow
- Giữ nguyên responsive breakpoints (`@media(max-width:780px)`)
- Không xóa bất kỳ nội dung thông tin nào khác ngoài section Mission
- Dev server chạy tại `http://localhost:3000`

---

### Task 1: Xóa section Mission khỏi page.tsx

**Files:**
- Modify: `D:\songthach\src\app\(public)\giai-cau-long-2026\page.tsx` (dòng 119–138)

**Interfaces:**
- Produces: section `#mucdich` không còn trong HTML render

- [ ] **Step 1: Xóa khối JSX Mission**

Trong `page.tsx`, xóa toàn bộ đoạn từ comment `{/* Mission */}` đến hết thẻ đóng `</section>` của section mission (dòng 119–138):

```tsx
        {/* Mission */}
        <section className="mission" id="mucdich">
          <div className="wrap mission-grid">
            <div>
              <span className="kicker">Mục đích giải đấu</span>
              <h2>Mỗi trận đấu — <span className="hl">thêm phần quà cho các em!</span></h2>
              <p>Giải Cầu Lông Song Thạch Mở Rộng 2026 là sân chơi thể thao lành mạnh dành cho mọi lứa tuổi — nơi mọi người <strong>giao lưu học hỏi, lan tỏa yêu thương</strong>.</p>
              <p>Tinh thần của giải hướng tới việc <strong>gây quỹ trao học bổng và quà</strong> cho các em học sinh có hoàn cảnh khó khăn nhưng vẫn nỗ lực vươn lên học giỏi tại địa phương.</p>
            </div>
            <div className="stat-card">
              <svg className="rays" viewBox="0 0 200 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                <g fill="currentColor">
                  <path d="M100 0l6 50h-12zM100 200l6-50h-12zM0 100l50 6v-12zM200 100l-50 6v-12zM30 30l40 28-8 8zM170 170l-40-28 8-8zM170 30l-28 40-8-8zM30 170l28-40 8 8z"/>
                </g>
              </svg>
              <div className="big">7</div>
              <div className="lbl">nhóm thi đấu — từ thiếu nhi tiểu học đến phong trào nâng cao &amp; khách mời</div>
            </div>
          </div>
        </section>
```

Xóa đoạn trên, phần còn lại giữ nguyên.

- [ ] **Step 2: Kiểm tra trình duyệt**

Mở `http://localhost:3000/giai-cau-long-2026` — sau hero và wave, nội dung tiếp theo phải là section "7 nhóm thi đấu" (không còn section nền kem "Mục đích giải đấu").

---

### Task 2: Xóa CSS của Mission trong giai.css

**Files:**
- Modify: `D:\songthach\src\app\(public)\giai-cau-long-2026\giai.css`

**Interfaces:**
- Produces: Không còn dead CSS cho `.mission`, `.mission-grid`, `.stat-card`, `.rays`

- [ ] **Step 1: Xóa các CSS rule của Mission**

Trong `giai.css`, xóa toàn bộ block comment `/* mission */` và các rule bên dưới nó (dòng 67–77):

```css
/* mission */
.giai-page .mission{background:var(--cream2)}
.giai-page .mission-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:46px;align-items:center}
.giai-page .mission-grid h2 .hl{color:var(--terra)}
.giai-page .mission-grid p{font-size:1.13rem;color:#4a3424;margin-top:18px;font-weight:600}
.giai-page .mission-grid p strong{color:var(--terra-d)}
.giai-page .stat-card{position:relative;background:var(--terra);color:#FFF6EC;border:3px solid var(--ink);border-radius:26px;padding:38px;box-shadow:8px 8px 0 var(--ink);overflow:hidden;text-align:center}
.giai-page .stat-card .rays{position:absolute;inset:0;color:rgba(255,255,255,.12);z-index:0;display:block;width:100%;height:100%}
.giai-page .stat-card .big{position:relative;font-family:"Baloo 2";font-weight:800;font-size:clamp(4rem,11vw,6.5rem);color:var(--mustard);line-height:.9;z-index:1;text-shadow:3px 3px 0 var(--ink)}
.giai-page .stat-card .lbl{position:relative;z-index:1;margin-top:6px;font-size:1.06rem;font-weight:700}
@media(max-width:780px){.giai-page .mission-grid{grid-template-columns:1fr;gap:30px}}
```

- [ ] **Step 2: Commit Task 1 + 2**

```bash
git add src/app/\(public\)/giai-cau-long-2026/page.tsx src/app/\(public\)/giai-cau-long-2026/giai.css
git commit -m "feat: remove mission section from giai-cau-long-2026 page"
```

---

### Task 3: Giảm padding Hero và spacing toàn trang trong giai.css

**Files:**
- Modify: `D:\songthach\src\app\(public)\giai-cau-long-2026\giai.css`

**Interfaces:**
- Produces: Hero thấp hơn, khoảng cách giữa các section nhỏ hơn

- [ ] **Step 1: Giảm padding hero-inner**

Tìm dòng:
```css
.giai-page .hero-inner{position:relative;z-index:1;padding:60px 22px 78px;max-width:1100px;margin:0 auto}
```
Sửa thành:
```css
.giai-page .hero-inner{position:relative;z-index:1;padding:44px 22px 52px;max-width:1100px;margin:0 auto}
```

- [ ] **Step 2: Giảm margin-top của .lede, .facts, .hero-cta**

Tìm:
```css
.giai-page .lede{margin-top:22px;font-size:clamp(1.08rem,2.2vw,1.32rem);max-width:56ch;color:var(--brown);font-weight:600}
.giai-page .facts{display:flex;flex-wrap:wrap;gap:14px;margin-top:32px}
.giai-page .hero-cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:34px}
```
Sửa thành:
```css
.giai-page .lede{margin-top:14px;font-size:clamp(1.08rem,2.2vw,1.32rem);max-width:56ch;color:var(--brown);font-weight:600}
.giai-page .facts{display:flex;flex-wrap:wrap;gap:14px;margin-top:20px}
.giai-page .hero-cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:22px}
```

- [ ] **Step 3: Giảm padding section và margin sec-head toàn trang**

Tìm:
```css
.giai-page section{padding:64px 0}
```
Sửa thành:
```css
.giai-page section{padding:48px 0}
```

Tìm:
```css
.giai-page .sec-head{max-width:60ch;margin-bottom:40px}
```
Sửa thành:
```css
.giai-page .sec-head{max-width:60ch;margin-bottom:28px}
```

- [ ] **Step 4: Kiểm tra trình duyệt**

Mở `http://localhost:3000/giai-cau-long-2026` — hero phải thấp hơn rõ rệt, các section gần nhau hơn, không bị vỡ layout ở mobile (thu nhỏ browser xuống 375px để kiểm tra).

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/giai-cau-long-2026/giai.css
git commit -m "feat: reduce hero padding and section spacing on giai-cau-long-2026"
```

---

### Task 4: Thu gọn section Đăng ký

**Files:**
- Modify: `D:\songthach\src\app\(public)\giai-cau-long-2026\page.tsx` (section `#dangky`)
- Modify: `D:\songthach\src\app\(public)\giai-cau-long-2026\giai.css`

**Interfaces:**
- Produces: Section đăng ký thấp hơn — padding ngoài giảm, lede ngắn hơn, khối thanh toán compact hơn

- [ ] **Step 1: Giảm padding reg-card trong page.tsx**

Tìm dòng trong `page.tsx`:
```tsx
          <div className="wrap reg-card" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
```
Sửa thành:
```tsx
          <div className="wrap reg-card" style={{ paddingTop: '36px', paddingBottom: '36px' }}>
```

- [ ] **Step 2: Rút ngắn lede đăng ký**

Tìm:
```tsx
              <p className="lede">Hoàn tất đăng ký qua Google Biểu mẫu và chuyển khoản lệ phí theo hướng dẫn. Mỗi lượt đăng ký của bạn góp thêm một phần quà cho các em.</p>
```
Sửa thành:
```tsx
              <p className="lede">Hoàn tất đăng ký qua Google Biểu mẫu và chuyển khoản lệ phí theo hướng dẫn bên cạnh.</p>
```

- [ ] **Step 3: Giảm padding khối .pay trong giai.css**

Tìm:
```css
.giai-page .pay{background:var(--cream2);color:var(--ink);border:3px solid var(--ink);border-radius:22px;padding:26px;box-shadow:7px 7px 0 var(--ink)}
```
Sửa thành:
```css
.giai-page .pay{background:var(--cream2);color:var(--ink);border:3px solid var(--ink);border-radius:22px;padding:18px 22px;box-shadow:7px 7px 0 var(--ink)}
```

- [ ] **Step 4: Giảm padding row trong .pay**

Tìm:
```css
.giai-page .pay .row{display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:2px dashed var(--line);font-size:.97rem;font-weight:700}
```
Sửa thành:
```css
.giai-page .pay .row{display:flex;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:2px dashed var(--line);font-size:.93rem;font-weight:700}
```

- [ ] **Step 5: Kiểm tra trình duyệt**

Mở `http://localhost:3000/giai-cau-long-2026`, scroll xuống section đỏ Đăng ký — phải thấp hơn rõ rệt, thông tin chuyển khoản vẫn đọc được rõ ràng. Kiểm tra mobile 375px.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(public\)/giai-cau-long-2026/page.tsx src/app/\(public\)/giai-cau-long-2026/giai.css
git commit -m "feat: compact registration section on giai-cau-long-2026"
```
