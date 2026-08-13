# Điều Lệ Giải Cầu Lông 2026 — Standalone HTML Retro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Viết lại `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html` thành standalone HTML đẹp theo retro style của songthach.com.

**Architecture:** Single self-contained HTML file. All CSS inline trong `<style>`. Google Fonts qua `<link>`. Accordion bằng `<details>/<summary>` (no JS). Responsive via CSS grid/flexbox.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), Google Fonts (Baloo 2 + Nunito)

## Global Constraints

- Output: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`
- Không dùng framework, không dùng JS
- Fonts: Baloo 2 (700/800) + Nunito (400/600/700/800) via Google Fonts
- Tokens: `--cream #F4E9D6` · `--mustard #E3A21A` · `--terra #C5532F` · `--ink #3B2A1E`
- Border: `2.5px solid var(--ink)` + offset box-shadow
- lang="vi", charset UTF-8
- Dữ liệu lấy từ file gốc HTML (6 nhóm, lệ phí đúng theo HTML gốc)

---

### Task 1: HTML shell + toàn bộ CSS + Hero section

**Files:**
- Create: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

**Interfaces:**
- Produces: File HTML hợp lệ với toàn bộ CSS design tokens và hero section có thể xem trong browser

- [ ] **Step 1: Viết file HTML hoàn chỉnh với CSS + Hero**

Tạo file mới với nội dung sau:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Điều Lệ Giải Cầu Lông Song Thạch 2026 — Gây Quỹ Học Bổng</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --cream:#F4E9D6;--cream2:#FBF4E6;--paper:#FFFBF2;
  --mustard:#E3A21A;--mustard-d:#C5860F;--mustard-soft:#F6DD9E;
  --terra:#C5532F;--terra-d:#A33E1F;--terra-soft:#F1C9B4;
  --ink:#3B2A1E;--brown:#7A5638;--muted:#8A6E54;--line:#E2CFA9;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',system-ui,sans-serif;color:var(--ink);background:var(--cream);line-height:1.62;font-size:16px;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;line-height:1.05}
a{color:inherit}svg{display:block}
.wrap{max-width:1100px;margin:0 auto;padding:0 22px}

/* Buttons */
.g-btn{display:inline-flex;align-items:center;gap:9px;font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;text-decoration:none;border-radius:999px;cursor:pointer;border:2.5px solid var(--ink);transition:transform .12s ease,box-shadow .12s ease;box-shadow:4px 4px 0 var(--ink)}
.g-btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink)}
.g-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
.btn-terra{background:var(--terra);color:#FFF6EC;padding:12px 24px}
.btn-cream{background:var(--cream2);color:var(--ink);padding:12px 24px}
.btn-mustard{background:var(--mustard);color:var(--ink);padding:12px 24px}
.btn-lg{padding:15px 32px;font-size:18px}

/* Kicker pill */
.kicker{display:inline-block;font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;color:var(--terra);font-size:14px;letter-spacing:.04em;background:var(--terra-soft);border:2px solid var(--ink);padding:4px 14px;border-radius:999px;box-shadow:2px 2px 0 var(--ink);transform:rotate(-1.5deg);margin-bottom:16px}

/* Section */
section{padding:52px 0}
.sec-head{max-width:60ch;margin-bottom:32px}
.sec-head h2{font-size:clamp(1.8rem,4vw,2.8rem);color:var(--ink);margin-top:8px}
.sec-head p{margin-top:12px;color:var(--brown);font-size:1rem;font-weight:600}

/* Ribbon */
.ribbon{background:var(--ink);color:var(--cream2);font-family:'Baloo 2',system-ui,sans-serif;font-size:13.5px;font-weight:700;text-align:center;padding:9px 16px;letter-spacing:.01em}
.ribbon b{color:var(--mustard)}

/* Hero */
.hero{position:relative;overflow:hidden;background:radial-gradient(60% 80% at 88% 6%,var(--mustard-soft) 0%,transparent 60%),var(--cream);padding:52px 0 56px}
.hero .sunburst{position:absolute;top:-160px;right:-160px;width:520px;height:520px;opacity:.4;color:var(--mustard);z-index:0}
.hero-inner{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:0 22px}
.sticker{display:inline-flex;align-items:center;gap:8px;background:var(--terra);color:#FFF6EC;font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;font-size:13.5px;letter-spacing:.06em;text-transform:uppercase;padding:8px 16px;border:2.5px solid var(--ink);border-radius:999px;box-shadow:3px 3px 0 var(--ink);transform:rotate(-2deg);margin-bottom:24px}
.sticker .dot{width:8px;height:8px;border-radius:50%;background:var(--mustard);display:inline-block}
h1.title{font-size:clamp(2.2rem,6vw,4.2rem);letter-spacing:-.01em;max-width:16ch}
h1.title .a{color:var(--terra)}
h1.title .b{color:var(--mustard-d)}
.lede{margin-top:14px;font-size:clamp(1rem,2vw,1.2rem);max-width:56ch;color:var(--brown);font-weight:600}
.facts{display:flex;flex-wrap:wrap;gap:14px;margin-top:22px}
.fact{display:flex;align-items:center;gap:12px;background:var(--cream2);border:2.5px solid var(--ink);border-radius:16px;padding:12px 18px;box-shadow:3px 3px 0 var(--ink)}
.fact .ic{width:38px;height:38px;border-radius:11px;background:var(--mustard-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.fact .ic svg{width:21px;height:21px;color:var(--terra-d)}
.fact .k{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:800}
.fact .v{font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;font-size:15px;line-height:1.2}
.hero-cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:24px}
.wave{display:block;width:100%;height:46px}

/* Group cards */
.groups{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.grp{background:var(--paper);border:2.5px solid var(--ink);border-radius:22px;padding:18px;box-shadow:5px 5px 0 var(--ink);transition:transform .14s ease,box-shadow .14s ease}
.grp:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--ink)}
.grp .top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.gnum{display:inline-block;font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:12px;letter-spacing:.05em;color:#FFF6EC;background:var(--mustard-d);border:2px solid var(--ink);padding:2px 11px;border-radius:999px;margin-bottom:6px}
.grp h3{font-size:1.1rem;color:var(--ink);line-height:1.1}
.grp .age{color:var(--muted);font-size:.9rem;font-weight:700;margin-top:3px}
.fee{flex-shrink:0;font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;font-size:.9rem;padding:6px 14px;border-radius:999px;background:var(--mustard);color:var(--ink);border:2.5px solid var(--ink);box-shadow:2px 2px 0 var(--ink);white-space:nowrap;transform:rotate(2deg)}
.fee.free{background:#BFD9A0}
.grp-content{margin-top:16px;padding-top:16px;border-top:2.5px dashed var(--line)}
.c-lbl{font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:800;margin-bottom:8px}
.events{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px}
.events span{font-family:'Baloo 2',system-ui,sans-serif;font-weight:600;font-size:.88rem;background:var(--cream);border:2px solid var(--ink);padding:3px 11px;border-radius:999px}
.prize-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;font-size:.95rem;font-weight:700}
.prize-row:last-child{margin-bottom:0}
.pmedal{width:22px;height:22px;flex-shrink:0}
.pmedal.g{color:var(--mustard)}.pmedal.s{color:#B98A5E}.pmedal.b{color:var(--terra)}
.prize-row .amt{font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;color:var(--terra-d)}
.prize-note{margin-top:10px;font-size:.88rem;color:var(--brown);font-weight:700;display:flex;align-items:center;gap:7px}

/* Fees + Rules 2-col */
.bg-cream2{background:var(--cream2)}
.lephi-rules-row{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
.feetable{width:100%;border-collapse:separate;border-spacing:0;border:2.5px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:5px 5px 0 var(--ink);background:var(--paper)}
.feetable th,.feetable td{padding:13px 16px;text-align:left;border-bottom:2px solid var(--line);font-weight:700}
.feetable thead th{background:var(--mustard);color:var(--ink);font-family:'Baloo 2',system-ui,sans-serif;border-bottom:2.5px solid var(--ink)}
.feetable tbody tr:last-child td{border-bottom:none}
.feetable td:last-child,.feetable th:last-child{text-align:right;font-family:'Baloo 2',system-ui,sans-serif;white-space:nowrap}
.feetable tbody tr:nth-child(even){background:var(--cream2)}
.fee-free{color:#3A6B2A;font-weight:800}
.rules-grid{display:grid;gap:10px}
.rule{display:flex;gap:10px;align-items:flex-start}
.rule .ico{flex-shrink:0;width:28px;height:28px;border-radius:50%;background:var(--mustard);color:var(--ink);border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:.8rem;box-shadow:2px 2px 0 var(--ink)}
.rule p{font-size:.9rem;color:#4a3424;font-weight:600;line-height:1.5;margin:0}

/* Register */
.register{background:var(--terra);color:#FFF6EC;border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);position:relative;overflow:hidden}
.register .rays{position:absolute;inset:0;color:rgba(255,255,255,.08);width:100%;height:100%}
.reg-card{position:relative;display:grid;grid-template-columns:1fr .85fr;gap:42px;align-items:center;z-index:1;padding:40px 0}
.reg-card .kicker{background:var(--mustard);color:var(--ink)}
.reg-card h2{color:#FFF6EC;font-size:clamp(1.8rem,4vw,2.6rem);margin-top:8px}
.reg-card .lede{color:rgba(255,246,236,.92)}
.reg-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.pay{background:var(--cream2);color:var(--ink);border:3px solid var(--ink);border-radius:22px;padding:20px 24px;box-shadow:7px 7px 0 var(--ink)}
.pay h4{font-family:'Baloo 2',system-ui,sans-serif;font-size:1rem;color:var(--terra);margin-bottom:14px;font-weight:800}
.pay .row{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:2px dashed var(--line);font-size:.9rem;font-weight:700}
.pay .row:last-of-type{border-bottom:none}
.pay .row .lbl{color:var(--muted)}
.pay .row .val{font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;text-align:right}
.pay-notes{margin-top:14px;font-size:.85rem;color:var(--brown);font-weight:700;display:flex;flex-direction:column;gap:6px}

/* Accordion học bổng */
.hb-section{background:var(--cream2);border-top:3px solid var(--ink)}
.hb-intro{font-size:.95rem;color:var(--brown);font-weight:600;margin-bottom:20px;max-width:70ch}
details.hb-accordion{border:2.5px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:5px 5px 0 var(--ink)}
details.hb-accordion summary{background:var(--ink);color:var(--cream2);font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;font-size:1rem;padding:16px 22px;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;user-select:none}
details.hb-accordion summary::-webkit-details-marker{display:none}
details.hb-accordion summary .badge{background:var(--mustard);color:var(--ink);border-radius:999px;padding:3px 12px;font-size:.85rem;border:2px solid rgba(59,42,30,.4)}
details.hb-accordion summary .chevron{width:20px;height:20px;transition:transform .2s ease;flex-shrink:0}
details.hb-accordion[open] summary .chevron{transform:rotate(180deg)}
.hb-table-wrap{overflow-x:auto;background:var(--paper)}
.hb-table{width:100%;border-collapse:collapse;font-size:.88rem}
.hb-table th{background:var(--mustard-soft);color:var(--ink);font-family:'Baloo 2',system-ui,sans-serif;padding:10px 12px;text-align:left;border-bottom:2px solid var(--line);font-weight:800}
.hb-table td{padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}
.hb-table tbody tr:nth-child(even){background:var(--cream2)}
.hb-table td:first-child{width:36px;text-align:center;font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;color:var(--muted)}
.hb-table td:nth-child(2){font-weight:700;min-width:160px}
.hb-table td:nth-child(4){width:50px;text-align:center}

/* Footer */
.site-footer{background:var(--ink);color:var(--cream2);padding:36px 0;font-weight:600}
.site-footer .inner{max-width:1100px;margin:0 auto;padding:0 22px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;align-items:center}
.site-footer .brand{display:flex;align-items:center;gap:10px;font-family:'Baloo 2',system-ui,sans-serif;font-weight:700;font-size:17px;color:var(--mustard)}
.site-footer a{color:var(--mustard);text-decoration:none;font-weight:800}
.site-footer .meta{font-size:.9rem;opacity:.85;text-align:right}

/* Responsive */
@media(max-width:960px){.groups{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){.lephi-rules-row{grid-template-columns:1fr;gap:32px}.reg-card{grid-template-columns:1fr;gap:28px}}
@media(max-width:640px){.groups{grid-template-columns:1fr}.facts{flex-direction:column}}

/* Print */
@media print{
  .hero .sunburst,.register .rays{display:none}
  .g-btn{box-shadow:none;border:1px solid #333}
  .grp,.feetable,details.hb-accordion{box-shadow:none}
  details.hb-accordion{overflow:visible}
}
</style>
</head>
<body>

<!-- SVG symbols dùng chung -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="ic-medal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="14" r="6"/><path d="M9 8L7 2h10l-2 6"/>
  </symbol>
  <symbol id="ic-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </symbol>
  <symbol id="ic-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 21s-7-5.3-7-11a7 7 0 0114 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>
  </symbol>
  <symbol id="ic-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
  </symbol>
  <symbol id="ic-gift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M12 8S9 3 6.5 4.5 9 8 12 8s5.5.5 5.5-1.5S14.5 3 12 8z"/>
  </symbol>
  <symbol id="ic-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </symbol>
  <symbol id="ic-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </symbol>
  <symbol id="ic-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 1.23 2 2 0 014 .05h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </symbol>
</svg>

<!-- RIBBON -->
<div class="ribbon">
  Đơn vị tổ chức: <b>CLB Cầu Lông Song Thạch</b> &nbsp;·&nbsp;
  Đơn vị đồng hành: <b>Đoàn Thanh niên xã Hưng Thịnh</b>
</div>

<!-- HERO -->
<section class="hero">
  <svg class="sunburst" viewBox="0 0 200 200" aria-hidden="true">
    <g fill="currentColor">
      <path d="M100 0l8 40-8 0-8-40zM100 200l8-40-8 0-8 40zM0 100l40 8 0-8-40-8zM200 100l-40 8 0-8 40-8zM29 29l34 23-6 6-23-34zM171 171l-34-23 6-6 23 34zM171 29l-23 34-6-6 34-23zM29 171l23-34 6 6-34 23z"/>
      <circle cx="100" cy="100" r="20"/>
    </g>
  </svg>
  <div class="hero-inner">
    <span class="sticker"><span class="dot"></span> Điều lệ chính thức · Giải gây quỹ từ thiện</span>
    <h1 class="title">
      Giải Cầu Lông <span class="a">Song Thạch</span> <span class="b">Mở Rộng 2026</span>
    </h1>
    <p class="lede">Giao lưu học hỏi, lan tỏa yêu thương — gây quỹ trao học bổng cho các em học sinh vượt khó học giỏi trên địa bàn xã Hưng Thịnh.</p>
    <div class="facts">
      <div class="fact">
        <span class="ic"><svg width="21" height="21"><use href="#ic-cal"/></svg></span>
        <div><div class="k">Thời gian thi đấu</div><div class="v">31/07 &amp; 01–02/08/2026</div></div>
      </div>
      <div class="fact">
        <span class="ic"><svg width="21" height="21"><use href="#ic-pin"/></svg></span>
        <div><div class="k">Địa điểm</div><div class="v">Sân CL Song Thạch, xã Hưng Thịnh, Đồng Nai</div></div>
      </div>
      <div class="fact">
        <span class="ic"><svg width="21" height="21"><use href="#ic-clock"/></svg></span>
        <div><div class="k">Hạn chót đăng ký</div><div class="v">21/07/2026</div></div>
      </div>
    </div>
    <div class="hero-cta">
      <a class="g-btn btn-terra btn-lg" href="#dangky">
        Đăng ký thi đấu <svg width="19" height="19"><use href="#ic-arrow"/></svg>
      </a>
      <a class="g-btn btn-cream btn-lg" href="#noidung">Xem nội dung &amp; thể lệ</a>
    </div>
  </div>
</section>

<svg class="wave" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true">
  <path fill="#FBF4E6" d="M0,30 C150,6 300,6 450,24 C600,42 750,42 900,24 C1050,6 1150,6 1200,18 L1200,46 L0,46 Z"/>
</svg>

<!-- SECTION I: NỘI DUNG THI ĐẤU -->
<!-- PLACEHOLDER_SECTION_I -->

<!-- SECTION II/III: LỆ PHÍ & QUY ĐỊNH -->
<!-- PLACEHOLDER_SECTION_II_III -->

<!-- SECTION IV: ĐĂNG KÝ -->
<!-- PLACEHOLDER_SECTION_IV -->

<!-- SECTION V: HỌC BỔNG -->
<!-- PLACEHOLDER_SECTION_V -->

<!-- FOOTER -->
<!-- PLACEHOLDER_FOOTER -->

</body>
</html>
```

- [ ] **Step 2: Mở file trong browser, kiểm tra hero**

Mở `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html` trong Chrome/Edge.

Kiểm tra:
- Ribbon màu ink (#3B2A1E) nền tối, chữ vàng
- Hero: background cream với sunburst mustard mờ góc phải
- Sticker pill đỏ terra xoay nhẹ
- Title to, "Song Thạch" màu terra, "Mở Rộng 2026" màu mustard-d
- 3 fact cards viền ink, shadow offset
- 2 nút CTA pill có shadow

---

### Task 2: Section I — 6 group cards

**Files:**
- Modify: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

**Interfaces:**
- Consumes: CSS classes từ Task 1 (`.groups`, `.grp`, `.gnum`, `.fee`, `.events`, `.prize-row`, `.pmedal`, `.amt`)
- Produces: Section I hiển thị 6 group cards dạng grid 3 cột

- [ ] **Step 1: Thay `<!-- PLACEHOLDER_SECTION_I -->` bằng HTML sau**

```html
<!-- SECTION I: NỘI DUNG THI ĐẤU -->
<section id="noidung">
  <div class="wrap">
    <div class="sec-head">
      <span class="kicker">Nội dung &amp; khen thưởng</span>
      <h2>6 nhóm thi đấu</h2>
      <p>Mỗi nội dung chỉ tổ chức khi đủ số lượng VĐV/cặp. Cấm VĐV đạt thành tích quốc gia; Nhóm 5 &amp; 6 cấm thêm thành tích cấp tỉnh/TP, năng khiếu.</p>
    </div>
    <div class="groups">

      <!-- Nhóm 1 -->
      <article class="grp">
        <div class="top">
          <div>
            <span class="gnum">Nhóm 1</span>
            <h3>Tiểu học</h3>
            <div class="age">≤ 11 tuổi</div>
          </div>
          <span class="fee free">Miễn phí</span>
        </div>
        <div class="grp-content">
          <div class="c-lbl">Nội dung thi đấu</div>
          <div class="events"><span>Đơn nam</span><span>Đơn nữ</span></div>
          <div class="c-lbl">Giải thưởng</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">350.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">250.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">150.000đ</span></div>
          <div class="prize-note"><svg width="17" height="17"><use href="#ic-gift"/></svg> + Huy chương &amp; bằng khen</div>
        </div>
      </article>

      <!-- Nhóm 2 -->
      <article class="grp">
        <div class="top">
          <div>
            <span class="gnum">Nhóm 2</span>
            <h3>12 – 13 tuổi</h3>
            <div class="age">Thiếu niên</div>
          </div>
          <span class="fee">100.000đ</span>
        </div>
        <div class="grp-content">
          <div class="c-lbl">Nội dung thi đấu</div>
          <div class="events"><span>Đơn nam</span><span>Đơn nữ</span><span>Đôi nam</span></div>
          <div class="c-lbl">Giải đơn</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">350.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">250.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">150.000đ</span></div>
          <div class="c-lbl" style="margin-top:10px">Giải đôi nam</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">500.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">400.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">300.000đ</span></div>
          <div class="prize-note"><svg width="17" height="17"><use href="#ic-gift"/></svg> + Huy chương &amp; bằng khen</div>
        </div>
      </article>

      <!-- Nhóm 3 -->
      <article class="grp">
        <div class="top">
          <div>
            <span class="gnum">Nhóm 3</span>
            <h3>14 – 15 tuổi</h3>
            <div class="age">Thiếu niên</div>
          </div>
          <span class="fee">100.000đ</span>
        </div>
        <div class="grp-content">
          <div class="c-lbl">Nội dung thi đấu</div>
          <div class="events"><span>Đơn nam</span><span>Đơn nữ</span><span>Đôi nam</span></div>
          <div class="c-lbl">Giải đơn</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">350.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">250.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">150.000đ</span></div>
          <div class="c-lbl" style="margin-top:10px">Giải đôi nam</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">500.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">400.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">300.000đ</span></div>
          <div class="prize-note"><svg width="17" height="17"><use href="#ic-gift"/></svg> + Huy chương &amp; bằng khen</div>
        </div>
      </article>

      <!-- Nhóm 4 -->
      <article class="grp">
        <div class="top">
          <div>
            <span class="gnum">Nhóm 4</span>
            <h3>16 – 18 tuổi</h3>
            <div class="age">Thanh thiếu niên</div>
          </div>
          <span class="fee">150.000đ</span>
        </div>
        <div class="grp-content">
          <div class="c-lbl">Nội dung thi đấu</div>
          <div class="events"><span>Đôi nam</span><span>Đôi nam nữ</span></div>
          <div class="c-lbl">Giải thưởng</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">800.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">600.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">400.000đ</span></div>
          <div class="prize-note"><svg width="17" height="17"><use href="#ic-gift"/></svg> + Huy chương &amp; bằng khen</div>
        </div>
      </article>

      <!-- Nhóm 5 -->
      <article class="grp">
        <div class="top">
          <div>
            <span class="gnum">Nhóm 5</span>
            <h3>Phong trào — Khách mời</h3>
            <div class="age">Không phân biệt tuổi · CLB khách mời</div>
          </div>
          <span class="fee">250.000đ</span>
        </div>
        <div class="grp-content">
          <div class="c-lbl">Nội dung thi đấu</div>
          <div class="events"><span>Đôi nam</span><span>Đôi nữ</span><span>Đôi nam nữ</span></div>
          <div class="c-lbl">Giải thưởng</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">3.000.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">2.000.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">1.000.000đ</span></div>
          <div class="prize-note"><svg width="17" height="17"><use href="#ic-gift"/></svg> + Huy chương &amp; bằng khen</div>
        </div>
      </article>

      <!-- Nhóm 6 -->
      <article class="grp">
        <div class="top">
          <div>
            <span class="gnum">Nhóm 6</span>
            <h3>Phong trào nâng cao</h3>
            <div class="age">Không phân biệt tuổi · trình độ khá</div>
          </div>
          <span class="fee">250.000đ</span>
        </div>
        <div class="grp-content">
          <div class="c-lbl">Nội dung thi đấu</div>
          <div class="events"><span>Đôi nam</span><span>Đôi nữ</span><span>Đôi nam nữ</span></div>
          <div class="c-lbl">Giải thưởng</div>
          <div class="prize-row"><svg class="pmedal g"><use href="#ic-medal"/></svg> Nhất <span class="amt">3.000.000đ</span></div>
          <div class="prize-row"><svg class="pmedal s"><use href="#ic-medal"/></svg> Nhì <span class="amt">2.000.000đ</span></div>
          <div class="prize-row"><svg class="pmedal b"><use href="#ic-medal"/></svg> Ba <span class="amt">1.000.000đ</span></div>
          <div class="prize-note"><svg width="17" height="17"><use href="#ic-gift"/></svg> + Huy chương &amp; bằng khen</div>
        </div>
      </article>

    </div><!-- .groups -->
  </div><!-- .wrap -->
</section>
```

- [ ] **Step 2: Kiểm tra trong browser**

Reload file. Kiểm tra:
- 6 cards hiển thị 3 cột (desktop)
- Badge nhóm pill vàng mustard-d
- Pill phí xoay 2deg
- Pill "Miễn phí" xanh lá
- Icon huy chương màu vàng/bạc/đồng
- Số tiền màu terra-d đậm

---

### Task 3: Section II/III — Lệ phí & Quy định

**Files:**
- Modify: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

**Interfaces:**
- Consumes: `.lephi-rules-row`, `.feetable`, `.rules-grid`, `.rule`, `.bg-cream2`
- Produces: Section lệ phí + quy định 2 cột ngang

- [ ] **Step 1: Thay `<!-- PLACEHOLDER_SECTION_II_III -->` bằng HTML sau**

```html
<!-- SECTION II/III: LỆ PHÍ & QUY ĐỊNH -->
<section id="lephi-quydinh" class="bg-cream2">
  <div class="wrap">
    <div class="lephi-rules-row">

      <!-- Lệ phí -->
      <div>
        <div class="sec-head">
          <span class="kicker">Lệ phí thi đấu</span>
          <h2>Mức lệ phí theo nhóm</h2>
          <p>Tính theo mỗi nội dung đăng ký của một vận động viên.</p>
        </div>
        <table class="feetable">
          <thead>
            <tr><th>Nhóm</th><th>Đối tượng</th><th>Lệ phí / VĐV / nội dung</th></tr>
          </thead>
          <tbody>
            <tr><td>Nhóm 1</td><td>Tiểu học (≤ 11 tuổi)</td><td class="fee-free">Miễn phí</td></tr>
            <tr><td>Nhóm 2 &amp; 3</td><td>12 – 15 tuổi</td><td>100.000đ</td></tr>
            <tr><td>Nhóm 4</td><td>16 – 18 tuổi</td><td>150.000đ</td></tr>
            <tr><td>Nhóm 5 &amp; 6</td><td>Phong trào</td><td>250.000đ</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Quy định -->
      <div>
        <div class="sec-head">
          <span class="kicker">Quy định thi đấu</span>
          <h2>Điều lệ chung</h2>
        </div>
        <div class="rules-grid">
          <div class="rule"><span class="ico">1</span><p><strong>Luật thi đấu:</strong> Nhóm 1–4 loại trực tiếp 1 hiệp 25 điểm. Nhóm 5–6 loại trực tiếp 3 hiệp 15 điểm.</p></div>
          <div class="rule"><span class="ico">2</span><p>Nhóm 1–4 tổ chức khi đủ <strong>12 VĐV/cặp</strong> mỗi nội dung. Nhóm 5 đủ <strong>16 cặp</strong>; Nhóm 6 đủ <strong>20 cặp</strong>.</p></div>
          <div class="rule"><span class="ico">3</span><p>Cầu thi đấu chính thức: <strong>Bamboo tốc độ 76</strong> hoặc cầu chất lượng tương đương.</p></div>
          <div class="rule"><span class="ico">4</span><p>VĐV mang theo <strong>CCCD / bản sao Giấy khai sinh / Hộ chiếu / Thẻ học sinh</strong> còn hiệu lực khi có yêu cầu.</p></div>
          <div class="rule"><span class="ico">5</span><p>Khiếu nại bằng văn bản của trưởng đoàn trước trận đấu. Phí khiếu nại <strong>300.000đ</strong>, không hoàn nếu sai.</p></div>
          <div class="rule"><span class="ico">6</span><p>BTC chỉ giải quyết khiếu nại <strong>trước vòng bán kết</strong>; từ bán kết trở đi không giải quyết khiếu nại về nhân sự.</p></div>
          <div class="rule"><span class="ico">7</span><p>Cấm VĐV đã đạt thành tích cấp quốc gia. Nhóm 5 &amp; 6 cấm thêm thành tích cấp tỉnh/TP và VĐV năng khiếu.</p></div>
          <div class="rule"><span class="ico">8</span><p>BTC có quyền thay đổi hoặc bổ sung điều lệ cho phù hợp với thực tế.</p></div>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Kiểm tra trong browser**

Reload. Kiểm tra:
- 2 cột đứng cạnh nhau (desktop), stack 1 cột ≤ 860px
- Bảng lệ phí bo góc, viền ink, header vàng mustard
- "Miễn phí" màu xanh lá đậm
- 8 rule items với circle icon mustard

---

### Task 4: Section IV — Đăng ký & Chuyển khoản

**Files:**
- Modify: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

**Interfaces:**
- Consumes: `.register`, `.reg-card`, `.pay`, `.g-btn`
- Produces: Banner terra đỏ với card thanh toán nổi bật

- [ ] **Step 1: Thay `<!-- PLACEHOLDER_SECTION_IV -->` bằng HTML sau**

```html
<!-- SECTION IV: ĐĂNG KÝ & CHUYỂN KHOẢN -->
<section class="register" id="dangky">
  <svg class="rays" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="currentColor">
      <path d="M100 0l6 60h-12zM100 200l6-60h-12zM0 100l60 6v-12zM200 100l-60 6v-12zM26 26l44 32-10 10zM174 174l-44-32 10-10zM174 26l-32 44-10-10zM26 174l32-44 10 10z"/>
    </g>
  </svg>
  <div class="wrap">
    <div class="reg-card">
      <div>
        <span class="kicker">Đăng ký tham gia</span>
        <h2>Sẵn sàng ra sân?</h2>
        <p class="lede">Điền form đăng ký và chuyển khoản lệ phí theo hướng dẫn. Sau khi chuyển khoản, nhắn Zalo để xác nhận.</p>
        <div class="reg-cta">
          <a class="g-btn btn-mustard btn-lg" href="https://docs.google.com/forms/d/1T7WlV7UVsLfAykyDU7FwXJL_ks74St44Y2o3C_QKkvY/viewform" target="_blank" rel="noopener">
            Mở biểu mẫu đăng ký <svg width="19" height="19"><use href="#ic-arrow"/></svg>
          </a>
        </div>
        <p style="margin-top:16px;font-size:.9rem;color:rgba(255,246,236,.8);font-weight:600">
          Hoặc liên hệ Zalo <strong style="color:#F6DD9E">0988918418 (Linh)</strong> để đăng ký trực tiếp.
        </p>
      </div>
      <div class="pay">
        <h4>Chuyển khoản lệ phí</h4>
        <div class="row"><span class="lbl">Ngân hàng</span><span class="val">VPBANK</span></div>
        <div class="row"><span class="lbl">Chủ tài khoản</span><span class="val">Nguyễn Thị Thùy Linh</span></div>
        <div class="row"><span class="lbl">Số tài khoản</span><span class="val">0988918418</span></div>
        <div class="row"><span class="lbl">Cú pháp</span><span class="val">Le phi CL [Tên] Nhom [số]</span></div>
        <div class="pay-notes">
          <span>⚠️ Sau khi đăng ký <strong>không hoàn lệ phí</strong> — đọc kỹ điều lệ trước khi đăng ký.</span>
          <span>📱 Chuyển khoản xong nhắn Zalo <strong>0988918418</strong> để xác nhận.</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Kiểm tra trong browser**

Reload. Kiểm tra:
- Background đỏ terra, ray SVG mờ phía sau
- 2 cột: trái CTA text, phải card thanh toán cream
- Card pay có viền ink + shadow 7px offset
- Nút "Mở biểu mẫu" màu mustard với shadow

---

### Task 5: Section V — Accordion học bổng (89 học sinh)

**Files:**
- Modify: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

**Interfaces:**
- Consumes: `.hb-section`, `details.hb-accordion`, `.hb-table`
- Produces: Accordion ẩn mặc định, click mở bảng 89 học sinh đầy đủ

- [ ] **Step 1: Thay `<!-- PLACEHOLDER_SECTION_V -->` bằng HTML sau**

Lưu ý: copy toàn bộ 89 hàng `<tr>` từ file HTML gốc vào vị trí `<!-- 89 rows here -->`.

```html
<!-- SECTION V: HỌC BỔNG -->
<section class="hb-section" id="hocbong">
  <div class="wrap">
    <div class="sec-head">
      <span class="kicker">Học bổng từ thiện</span>
      <h2>Mục đích gây quỹ</h2>
    </div>
    <p class="hb-intro">Toàn bộ tiền lệ phí và tài trợ vượt chi phí tổ chức giải sẽ được dùng để trao học bổng cho <strong>89 em học sinh vượt khó, học giỏi</strong> trên địa bàn xã Hưng Thịnh và các xã lân cận.</p>

    <details class="hb-accordion">
      <summary>
        <span>Danh sách 89 em học sinh xin học bổng — click để xem</span>
        <span style="display:flex;align-items:center;gap:10px">
          <span class="badge">89 em</span>
          <svg class="chevron"><use href="#ic-chevron-down"/></svg>
        </span>
      </summary>
      <div class="hb-table-wrap">
        <table class="hb-table">
          <thead>
            <tr><th>STT</th><th>Họ và tên</th><th>Trường</th><th>Lớp</th><th>Hoàn cảnh (tóm tắt)</th></tr>
          </thead>
          <tbody>
<tr><td>1</td><td>Mai Bảo Thy</td><td>THCS Nguyễn Công Trứ</td><td>6/1</td><td>Học lực giỏi, ba mẹ khuyết tật không có khả năng lao động, ở với bà</td></tr>
<tr><td>2</td><td>Doãn Thị Hồng Ngọc</td><td>THCS Nguyễn Công Trứ</td><td>7/4</td><td>Học lực: Khá, Hạnh kiểm: Tốt.</td></tr>
<tr><td>3</td><td>Nguyễn Trần Ngọc Uyên</td><td>THCS Nguyễn Công Trứ</td><td>8/2</td><td>Học lực: Xuất sắc, Hạnh kiểm: Tốt. Ba mẹ li hôn, ở với ông bà nội.</td></tr>
<tr><td>4</td><td>Võ Minh Thư</td><td>THCS Nguyễn Công Trứ</td><td>8/2</td><td>Học lực: Khá, Hạnh kiểm: Tốt. Ba mẹ li hôn, ở trọ với ông bà nội (ông bà già yếu).</td></tr>
<tr><td>5</td><td>Nguyễn Ngọc Kim Ngân</td><td>THCS Nguyễn Công Trứ</td><td>8/3</td><td>Học lực: Giỏi, Hạnh kiểm: Tốt. Nhà bằng gỗ cũ kĩ, chật hẹp; 4 chị em đang đi học, còn nhỏ.</td></tr>
<tr><td>6</td><td>Nguyễn Ngọc Thái Thiên Hà</td><td>THCS Nguyễn Công Trứ</td><td>8/5</td><td>Học lực: Xuất sắc, Hạnh kiểm: Tốt. Bố mất…</td></tr>
<tr><td>7</td><td>Trần Bình Phương</td><td>THCS Nguyễn Công Trứ</td><td>9/1</td><td>Học lực: Giỏi, Hạnh kiểm: Tốt.</td></tr>
<tr><td>8</td><td>Nguyễn Thị Thanh Phúc</td><td>THCS Nguyễn Công Trứ</td><td>9/3</td><td>Học sinh Xuất sắc. Bị vẹo cột sống vô căn; nhà đông con, không có tiền phẫu thuật…</td></tr>
<tr><td>9</td><td>Lầm Gia Khánh</td><td>THCS Huỳnh Thúc Kháng</td><td>6.5</td><td>Bố mất; mẹ nuôi 2 con đang đi học, mẹ làm công ty và ở nhà trọ.</td></tr>
<tr><td>10</td><td>Vương Huỳnh Thái An</td><td>THCS Huỳnh Thúc Kháng</td><td>7.1</td><td>Gia đình khó khăn; mẹ là lao động chính, một mình nuôi con và chu cấp cho ông bà ngoại ở quê…</td></tr>
<tr><td>11</td><td>Nguyễn Thị Hương Thơm</td><td>THCS Huỳnh Thúc Kháng</td><td>8.1</td><td>Học lực Giỏi. Bố mất; mẹ đi làm nuôi 5 con đang tuổi ăn học; ở nhà thuê…</td></tr>
<tr><td>12</td><td>Hồ Phan Gia Bảo</td><td>THCS Phan Chu Trinh</td><td>6.6</td><td>Học lực: Khá, Hạnh kiểm: Tốt. Bố mẹ bỏ đi từ nhỏ; em ở với ông bà ngoại (cận nghèo).</td></tr>
<tr><td>13</td><td>Nguyễn Hà Phương Hạ</td><td>THCS Phan Chu Trinh</td><td>7.1</td><td>Học lực: Giỏi, Hạnh kiểm: Tốt. Mồ côi cha mẹ…</td></tr>
<tr><td>14</td><td>Thái Phan Thảo My</td><td>THCS Phan Chu Trinh</td><td>7.2</td><td>Học lực: Tốt (đạt HSG), Hạnh kiểm: Tốt. Ba, mẹ bán vé số (thuộc hộ nghèo).</td></tr>
<tr><td>15</td><td>Trần Hồng Trân</td><td>THCS Phan Chu Trinh</td><td>7.4</td><td>Học lực: Tốt (đạt HSG), Hạnh kiểm: Tốt. Ba mất; mẹ làm công nuôi 4 chị em ăn học (hộ nghèo).</td></tr>
<tr><td>16</td><td>Chế Thị Lan Nhi</td><td>THCS Phan Chu Trinh</td><td>8.1</td><td>Không có cha; nhà nghèo, một mình mẹ nuôi 3 con ăn học.</td></tr>
<tr><td>17</td><td>Huỳnh Tấn Đạt</td><td>THCS Phan Chu Trinh</td><td>8.1</td><td>Ba mất; mẹ bỏ rơi, ở với ngoại đã già yếu.</td></tr>
<tr><td>18</td><td>Nguyễn Hoàng Phương Thảo</td><td>THCS Phan Chu Trinh</td><td>8.1</td><td>Học lực: Khá, Hạnh kiểm: Tốt. Ba mất; không có nhà, ở trọ; mẹ nuôi 3 con.</td></tr>
<tr><td>19</td><td>Trương Khánh Băng</td><td>THCS Phan Chu Trinh</td><td>8.6</td><td>Nhà nghèo (xã chứng nhận); một mình mẹ nuôi 4 anh em đi học.</td></tr>
<tr><td>20</td><td>Trần Minh Huy</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Hộ cận nghèo. Bố bị liệt; mẹ bán hotdog ở cổng trường nuôi 2 chị em ăn học.</td></tr>
<tr><td>21</td><td>Đỗ Hoàng Trọng Phú</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Gia đình khó khăn; ba mẹ công việc tự do, thất thường; bố đau ốm thường xuyên.</td></tr>
<tr><td>22</td><td>Vy Đức Thạch</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Gia đình khó khăn; mồ côi cha; ở trọ.</td></tr>
<tr><td>23</td><td>Bùi Bảo Trâm</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Cha mẹ li hôn, ở với ba, ở trọ; ba đi làm tự do.</td></tr>
<tr><td>24</td><td>Võ Thái Tùng Sơn</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Ba mẹ ly hôn; ở với bà từ nhỏ, bà tuổi già không có thu nhập.</td></tr>
<tr><td>25</td><td>Huỳnh Minh Phương</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Học sinh Xuất sắc. Ở với mẹ đơn thân, việc làm không ổn định; gia đình khó khăn.</td></tr>
<tr><td>26</td><td>Nguyễn Văn Phú</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Nhà ở trọ; bố mẹ công việc thất thường, ai thuê gì làm nấy; bố mẹ nhiều bệnh, hay ốm đau.</td></tr>
<tr><td>27</td><td>Huỳnh Thị Nhã Thư</td><td>THCS Nguyễn Thượng Hiền</td><td>—</td><td>Ba mẹ li hôn; ở với ông bà nội đã già yếu.</td></tr>
<tr><td>28</td><td>Lương Ngọc Thành</td><td>TH Nguyễn Khuyến</td><td>1A</td><td>Bố mẹ ở trọ; mẹ bán vé số, bố công việc không ổn định.</td></tr>
<tr><td>29</td><td>Đặng Huỳnh Khánh Vân</td><td>TH Nguyễn Khuyến</td><td>1B</td><td>Bố mẹ bỏ nhau; ở nhà thuê; mẹ mới sinh con thứ ba, làm nghề sửa quần áo nuôi 2 bé…</td></tr>
<tr><td>30</td><td>Lại Nguyễn Hoàng Anh</td><td>TH Nguyễn Khuyến</td><td>2C</td><td>Mồ côi mẹ; ở với bà ngoại đã già yếu.</td></tr>
<tr><td>31</td><td>Trần Ngọc Đạt</td><td>TH Nguyễn Khuyến</td><td>2D</td><td>Ba mẹ li hôn; một mình ba đi làm công trình nuôi 3 anh em đi học…</td></tr>
<tr><td>32</td><td>Nguyễn Thị Thu Ngân</td><td>TH Nguyễn Khuyến</td><td>3A</td><td>Ba mất sớm; ở với bà ngoại; mẹ làm công nhân, nuôi 3 chị em.</td></tr>
<tr><td>33</td><td>Nguyễn Khánh Bảo Ngân</td><td>TH Nguyễn Khuyến</td><td>3B</td><td>Mẹ mất sớm; một mình ba nuôi 3 chị em.</td></tr>
<tr><td>34</td><td>Trần Minh Nhật</td><td>TH Nguyễn Khuyến</td><td>4A</td><td>Bố mẹ li hôn, sống với ông bà nội.</td></tr>
<tr><td>35</td><td>Lê Huỳnh Ngọc Anh</td><td>TH Nguyễn Khuyến</td><td>4C</td><td>Hộ cận nghèo; bố không có việc làm ổn định.</td></tr>
<tr><td>36</td><td>Nguyễn Lê Bình An</td><td>TH Nguyễn Tri Phương</td><td>1.2</td><td>Học sinh Tiêu biểu. Gia đình khó khăn, ở nhà thuê; mẹ đơn thân nuôi 2 con nhỏ…</td></tr>
<tr><td>37</td><td>Đặng Thiên Quốc</td><td>TH Nguyễn Tri Phương</td><td>1.4</td><td>Học sinh Tiêu biểu. Bố mẹ nuôi ông bà và 3 con đi học; gia đình là hộ cận nghèo.</td></tr>
<tr><td>38</td><td>Trương Gia Hân</td><td>TH Nguyễn Tri Phương</td><td>2.3</td><td>Nhà 4 chị em; mẹ bỏ đi, cha đi tù mới về; ở với ông bà nội đang ở đất thuê.</td></tr>
<tr><td>39</td><td>Đặng Phương Linh</td><td>TH Nguyễn Tri Phương</td><td>2.6</td><td>Hộ nghèo.</td></tr>
<tr><td>40</td><td>Trần Mạnh Hùng</td><td>TH Nguyễn Tri Phương</td><td>3.4</td><td>Bố mất sớm; mẹ nuôi 3 con nhỏ, ở trọ.</td></tr>
<tr><td>41</td><td>Tô Nguyễn Khánh Ngọc</td><td>TH Nguyễn Tri Phương</td><td>3.5</td><td>Mẹ ở trọ nuôi 3 con nhỏ; bố bỏ đi.</td></tr>
<tr><td>42</td><td>Nguyễn Lê Huy Hoàng</td><td>TH Nguyễn Tri Phương</td><td>4.1</td><td>Mẹ mất; bố làm việc không ổn định; ở với bà đã già yếu.</td></tr>
<tr><td>43</td><td>Danh Minh Khang</td><td>TH Nguyễn Tri Phương</td><td>4.4</td><td>Gia đình khó khăn, ở nhà thuê; bố thất nghiệp, mẹ đi làm mướn; có em nhỏ bị bệnh mãn tính.</td></tr>
<tr><td>44</td><td>Nguyễn Ngọc Duy Phúc</td><td>TH Trần Quý Cáp</td><td>1C</td><td>Bố mẹ làm công nhân; nhà 3 con đi học; chưa có nhà ở.</td></tr>
<tr><td>45</td><td>Trần Thuỷ Tiên</td><td>TH Trần Quý Cáp</td><td>1D</td><td>Học sinh Tiêu biểu. Nhà đông con; bố mẹ đi làm xa, ở chung với ông bà.</td></tr>
<tr><td>46</td><td>Phạm Tuấn Khang</td><td>TH Trần Quý Cáp</td><td>2B</td><td>Bố không có việc làm; ở trọ; hoàn cảnh khó khăn.</td></tr>
<tr><td>47</td><td>Võ Phạm Trúc Linh</td><td>TH Trần Quý Cáp</td><td>2D</td><td>Bố mẹ làm công nhân; ở trọ; hoàn cảnh khó khăn.</td></tr>
<tr><td>48</td><td>Nguyễn Hoài An Nhiên</td><td>TH Trần Quý Cáp</td><td>3A</td><td>Gia đình khó khăn; bố mẹ bỏ nhau từ nhỏ; ở trọ…</td></tr>
<tr><td>49</td><td>Nguyễn Thị Hồng Luyến</td><td>TH Trần Quý Cáp</td><td>3B</td><td>Hộ nghèo; mẹ công nhân, bố không có việc làm ổn định.</td></tr>
<tr><td>50</td><td>Dương Khả Di</td><td>TH Trần Quý Cáp</td><td>4A</td><td>Học sinh Xuất sắc. Một mẹ một con, sống cùng bà ngoại luôn đau yếu…</td></tr>
<tr><td>51</td><td>Trương Nguyễn Hoàng Thịnh</td><td>TH Trần Quý Cáp</td><td>4C</td><td>Học sinh Xuất sắc. Ba làm sơn nước, công việc không ổn định…</td></tr>
<tr><td>52</td><td>Trần Nguyên Bảo Anh</td><td>TH Nam Cao</td><td>1B</td><td>Cha mẹ li hôn; ở với mẹ và dượng, ở trọ; mẹ không có việc làm, đang nuôi con nhỏ.</td></tr>
<tr><td>53</td><td>Nguyễn Thị Thảo Nguyên</td><td>TH Nam Cao</td><td>1D</td><td>Ba mất; mẹ bán hàng rong nuôi 5 anh em ăn học; ở trọ.</td></tr>
<tr><td>54</td><td>Nguyễn Ngọc An Nhiên</td><td>TH Nam Cao</td><td>2B</td><td>Học sinh Xuất sắc. Gia đình khó khăn, ở trọ; ba mẹ công việc không ổn định…</td></tr>
<tr><td>55</td><td>Nguyễn Thị Thuỳ Dương</td><td>TH Nam Cao</td><td>2C</td><td>Học sinh Xuất sắc. Bố mất; mẹ bán vé số, một mình mẹ nuôi 2 con đi học; ở trọ.</td></tr>
<tr><td>56</td><td>Trương Gia Kỳ</td><td>TH Nam Cao</td><td>3A</td><td>Bố mẹ làm công nhân; ở trọ; hoàn cảnh khó khăn; em là học sinh khuyết tật, không đi lại được.</td></tr>
<tr><td>57</td><td>Võ Kim Ngọc</td><td>TH Nam Cao</td><td>3B</td><td>Học sinh Xuất sắc. Cha bỏ đi từ nhỏ; một mình mẹ nuôi 2 con; ở trọ.</td></tr>
<tr><td>58</td><td>Nguyễn Thanh Trúc</td><td>TH Nam Cao</td><td>4A</td><td>Bố mất vì tai nạn; mẹ làm công ti tư nhân lương thấp, không ổn định, một bên tai nghe không rõ.</td></tr>
<tr><td>59</td><td>Nguyễn Khánh Ly</td><td>TH Nam Cao</td><td>4D</td><td>Học sinh Xuất sắc. Bố mẹ già 70 tuổi; bố bị áp xe phổi, viêm giác mạc; 2 con nhỏ…</td></tr>
<tr><td>60</td><td>Mai Đức Thịnh</td><td>TH An Bình</td><td>1.2</td><td>Học sinh Tiêu biểu. Bố mẹ câm điếc; 2 chị em ở với bà ngoại.</td></tr>
<tr><td>61</td><td>Phạm Nguyễn Thành Danh</td><td>TH An Bình</td><td>1.5</td><td>Học sinh Tiêu biểu. Bố mẹ bỏ rơi; ở với ông bà đã lớn tuổi.</td></tr>
<tr><td>62</td><td>Vũ Ngọc Vân Anh</td><td>TH An Bình</td><td>2.2</td><td>Học sinh Xuất sắc. Gia đình khó khăn; nhà ở chưa ổn định; nhà đông anh chị em.</td></tr>
<tr><td>63</td><td>Trương Tấn Dũng</td><td>TH An Bình</td><td>2.5</td><td>Học sinh Tiêu biểu. Cha bị bại liệt, nằm một chỗ; mẹ là lao động chính; chưa có nhà ở.</td></tr>
<tr><td>64</td><td>Đặng Phương Thảo</td><td>TH An Bình</td><td>3.3</td><td>Học sinh Tiêu biểu. Bố mẹ ly hôn; ở với ông bà.</td></tr>
<tr><td>65</td><td>Nguyễn Thiên Duyên</td><td>TH An Bình</td><td>3.3</td><td>Học sinh Xuất sắc. Nhà đông con; đang ở trọ.</td></tr>
<tr><td>66</td><td>Ngô Thiện Nhân</td><td>TH An Bình</td><td>4.4</td><td>Học sinh Tiêu biểu. Mẹ bị bệnh hiểm nghèo; bố công việc không ổn định; nhà đông con.</td></tr>
<tr><td>67</td><td>Lê Vũ Hoài Thương</td><td>TH An Bình</td><td>4.5</td><td>Học sinh Xuất sắc. Mẹ đơn thân nuôi 2 con; ở nhờ nhà ngoại.</td></tr>
<tr><td>68</td><td>Mai Quốc Thiên</td><td>MN Hoa Hồng</td><td>Mầm</td><td>Gia đình khó khăn.</td></tr>
<tr><td>69</td><td>Phan Lê Phương Anh</td><td>MN Hoa Hồng</td><td>Chồi</td><td>Gia đình khó khăn.</td></tr>
<tr><td>70</td><td>Thù Bảo Anh</td><td>MN Hoa Hồng</td><td>Lá</td><td>Gia đình khó khăn.</td></tr>
<tr><td>71</td><td>Nguyễn Hữu Thiên Đức</td><td>MN Hoa Anh Đào</td><td>Chồi</td><td>Hộ cận nghèo.</td></tr>
<tr><td>72</td><td>Nguyễn Hùng Cường</td><td>MN Hoa Anh Đào</td><td>Lá</td><td>Hộ nghèo.</td></tr>
<tr><td>73</td><td>Hoàng Nguyễn Tâm An</td><td>MN Hoa Phượng</td><td>Chồi</td><td>Gia đình khó khăn; mẹ hay bị bệnh; một mình bố đi làm nuôi cả gia đình.</td></tr>
<tr><td>74</td><td>Phan Ngọc Thành</td><td>MN Hoa Phượng</td><td>Lá</td><td>Mẹ bị bệnh, một mình nuôi 2 anh em; ở trọ.</td></tr>
<tr><td>75</td><td>Nguyễn Thảo Vy</td><td>MN Hoa Phượng</td><td>Lá</td><td>Học sinh khuyết tật.</td></tr>
<tr><td>76</td><td>Trần Minh Trí</td><td>CLB Cầu lông Song Thạch</td><td>Lá</td><td>Gia đình khó khăn.</td></tr>
<tr><td>77</td><td>Nguyễn Thành Thiện</td><td>CLB Cầu lông Song Thạch</td><td>2</td><td>Gia đình khó khăn.</td></tr>
<tr><td>78</td><td>Nguyễn Thành Danh</td><td>CLB Cầu lông Song Thạch</td><td>Lá</td><td>Gia đình khó khăn, ba mẹ ở nhà trọ.</td></tr>
<tr><td>79</td><td>Vũ Trương Vũ Ngọc</td><td>CLB Cầu lông Song Thạch</td><td>Lá</td><td>Gia đình khó khăn.</td></tr>
<tr><td>80</td><td>Vũ Ngọc Hà Trang</td><td>CLB Cầu lông Song Thạch</td><td>Chồi</td><td>Gia đình khó khăn, ba mẹ ở nhà trọ.</td></tr>
<tr><td>81</td><td>Đỗ Thành Đạt</td><td>CLB Cầu lông Song Thạch</td><td>7</td><td>Gia đình khó khăn, ở nhà trọ, cộng thêm trong quá trình làm ăn bị thua lỗ.</td></tr>
<tr><td>82</td><td>Phan Đình Phong</td><td>CLB Cầu lông Song Thạch</td><td>3</td><td>Ba mẹ li hôn, ba bị bệnh tâm thần, em ở với ông bà nội.</td></tr>
<tr><td>83</td><td>Phạm Quốc Huy</td><td>CLB Cầu lông Song Thạch</td><td>6</td><td>Ba mẹ li hôn, em sống với ba ngoại.</td></tr>
<tr><td>84</td><td>Trần Anh Tuấn</td><td>CLB Cầu lông Song Thạch</td><td>2</td><td>Gia đình khó khăn.</td></tr>
<tr><td>85</td><td>Nguyễn Hoàng Minh Ngọc</td><td>CLB Cầu lông Song Thạch</td><td>7</td><td>Ba mẹ li hôn, em ở với ông bà ngoại.</td></tr>
<tr><td>86</td><td>Trần Thiện Nhân</td><td>CLB Cầu lông Song Thạch</td><td>7</td><td>Gia đình khó khăn.</td></tr>
<tr><td>87</td><td>Võ Ngọc Bảo An</td><td>CLB Cầu lông Song Thạch</td><td>Lá</td><td>Hoàn cảnh gia đình khó khăn, ba mẹ li hôn, một mình mẹ lo cho gia đình, ba mẹ con ở nhà trọ.</td></tr>
<tr><td>88</td><td>Trần Ngọc Tú Uyên</td><td>CLB Cầu lông Song Thạch</td><td>Lá</td><td>Ba mẹ li hôn em ở với bà ngoại, hoàn cảnh gia đình khó khăn.</td></tr>
<tr><td>89</td><td>Vũ Hoàng Nhân Eban</td><td>CLB Cầu lông Song Thạch</td><td>1</td><td>Học sinh xuất sắc — Gia đình khó khăn, nhưng ba mẹ vẫn cố gắng cho con được đến trường.</td></tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</section>
```

- [ ] **Step 2: Kiểm tra trong browser**

Reload. Kiểm tra:
- Section background cream2
- Accordion ẩn mặc định (bảng không hiển thị)
- Click summary → bảng 89 em hiện ra
- Chevron icon xoay 180° khi mở
- Badge "89 em" màu mustard trên summary

---

### Task 6: Footer + kiểm tra cuối

**Files:**
- Modify: `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html`

**Interfaces:**
- Consumes: `.site-footer`
- Produces: File HTML hoàn chỉnh, responsive, sẵn sàng deploy

- [ ] **Step 1: Thay `<!-- PLACEHOLDER_FOOTER -->` bằng HTML sau**

```html
<!-- FOOTER -->
<footer class="site-footer">
  <div class="inner">
    <div class="brand">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="8" rx="6.1" ry="7.1"/>
        <path d="M12 15.1v5.4"/><path d="M10.2 20.5h3.6"/>
      </svg>
      Giải Cầu Lông Song Thạch Mở Rộng 2026
    </div>
    <div class="meta">
      CLB Cầu Lông Song Thạch &amp; Đoàn Thanh niên xã Hưng Thịnh<br>
      Mọi thắc mắc: Zalo/SĐT <a href="tel:0988918418">0988918418</a> (Linh)<br>
      <a href="https://songthach.com" target="_blank" rel="noopener">songthach.com</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Kiểm tra responsive**

Dùng DevTools (F12 → Toggle device toolbar) thu nhỏ viewport:
- **960px**: cards group chuyển 2 cột ✓
- **860px**: lệ phí + quy định stack 1 cột; register stack 1 cột ✓
- **640px**: cards group 1 cột; facts stack dọc ✓

- [ ] **Step 3: Kiểm tra toàn trang cuối**

Scroll từ đầu đến cuối, kiểm tra:
- [ ] Ribbon hiển thị đúng
- [ ] Hero: sunburst, sticker, title, facts, CTA
- [ ] Section I: 6 cards, icon medal màu đúng, số tiền terra-d
- [ ] Section II/III: bảng lệ phí + 8 rules hiển thị cạnh nhau
- [ ] Section IV: banner terra + card thanh toán
- [ ] Section V: accordion đóng mặc định, click mở → 89 hàng
- [ ] Footer: ink, mustard links, link songthach.com
- [ ] Hover cards: shadow offset tăng lên

- [ ] **Step 4: Xác nhận file sẵn sàng**

File `D:\GIAI DAU SONG THACH\dieu-le-giai-cau-long-song-thach-2026.html` hoàn chỉnh, standalone, không phụ thuộc external file nào ngoài Google Fonts.
