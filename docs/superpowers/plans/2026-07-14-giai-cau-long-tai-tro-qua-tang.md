# Mục Quà tặng & Đồng hành/Tài trợ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm 2 section mới (Bộ quà VPP + Đồng hành/Tài trợ) vào cuối trang `/giai-cau-long-2026`, ngay sau danh sách 82 học sinh, giao diện đồng bộ và responsive điện thoại.

**Architecture:** Dữ liệu quà tách ra file `qua-tang-data.ts` (theo mẫu `hoc-bong-data.ts`). Hai section là JSX tĩnh thêm vào `page.tsx`, dùng lại `GiftIcon`/`ArrowIcon` và biến màu sẵn có. CSS mới thêm vào `giai.css`, tái dùng phong cách neo-brutalist (viền `2.5px var(--ink)`, `box-shadow` khối).

**Tech Stack:** Next.js (App Router), React (TSX), CSS thuần trong `giai.css`. Không có test framework — xác minh bằng `npm run build`, `npm run lint`, và kiểm tra trực quan (Playwright screenshot desktop + mobile).

## Global Constraints

- Thư mục trang: `src/app/(public)/giai-cau-long-2026/`.
- Mọi class CSS đặt dưới namespace `.giai-page` (bắt buộc — CSS file dùng namespace này).
- Biến màu dùng sẵn: `--cream #F4E9D6`, `--cream2 #FBF4E6`, `--paper #FFFBF2`, `--mustard #E3A21A`, `--mustard-soft #F6DD9E`, `--terra #C5532F`, `--terra-d #A33E1F`, `--ink #3B2A1E`, `--brown #7A5638`, `--muted #8A6E54`, `--line #E2CFA9`. KHÔNG thêm biến màu mới.
- Font tiêu đề: `"Baloo 2"` (đã import sẵn).
- Section tự có `padding:48px 0` (rule `.giai-page section`). Không set lại padding dọc cho section mới.
- Số liệu quà (chốt): Cấp1 45×736.000=33.120.000 · Cấp2 23×670.000=15.410.000 · Mầm non 14×800.000=11.200.000 · Xe đạp 10×1.600.000=16.000.000 · **Tổng 75.730.000**.
- Thông tin nhận ủng hộ (đúng nguyên văn Thư Ngỏ): Chủ TK **Hộ Kinh Doanh Song Thạch**, STK **165099** (không có tên ngân hàng), Nội dung CK `Ho tro hoc bong Song Thach 2026 - [Tên nhà tài trợ]`, người phụ trách **Nguyễn Nhật Tân – 0378.99.09.79 (Zalo)**. STK này KHÁC với STK lệ phí thi đấu (VPBANK 0988918418) — không được lẫn.
- Mục tiêu học bổng (theo Thư Ngỏ): **82 suất × 800.000đ = 65.650.000đ**; kết quả 2025: 67 suất / 40.000.000đ.

---

### Task 1: Data file quà tặng

**Files:**
- Create: `src/app/(public)/giai-cau-long-2026/qua-tang-data.ts`

**Interfaces:**
- Produces: `GiftBundle` interface; `QUA_TANG_DATA: GiftBundle[]`; `QUA_TANG_TONG: number` (= 75730000). Task 3 import cả ba.

- [ ] **Step 1: Tạo file dữ liệu**

Create `src/app/(public)/giai-cau-long-2026/qua-tang-data.ts`:

```ts
export interface GiftBundle {
  group: string;      // nhóm học sinh, vd 'Tiểu học'
  bundle: string;     // tên bộ quà, vd 'Bộ VPP Cấp 1'
  count: number;      // số HS (hoặc số xe với phần thưởng)
  unitPrice: number;  // đơn giá/phần (đ)
  total: number;      // thành tiền (đ)
  note: string;       // mô tả ngắn nội dung bộ quà
  isReward?: boolean; // true = phần thưởng hiện vật (xe đạp)
}

export const QUA_TANG_DATA: GiftBundle[] = [
  { group: 'Tiểu học', bundle: 'Bộ VPP Cấp 1', count: 45, unitPrice: 736000, total: 33120000, note: 'Vở, bìa bao, bút chì/gel, bộ thước, bút màu, hồ, kéo, bảng… trọn bộ dụng cụ học tập.' },
  { group: 'THCS', bundle: 'Bộ VPP Cấp 2', count: 23, unitPrice: 670000, total: 15410000, note: 'Vở, bút bi/highlight, bút chì bấm, và máy tính Casio Fx-580VN X.' },
  { group: 'Mầm non', bundle: 'Phần quà sữa & bánh', count: 14, unitPrice: 800000, total: 11200000, note: 'Sữa tươi tiệt trùng, sữa chua uống & bánh dinh dưỡng.' },
  { group: 'Phần thưởng', bundle: 'Xe đạp', count: 10, unitPrice: 1600000, total: 16000000, isReward: true, note: 'Phần thưởng hiện vật tiếp thêm động lực đến trường cho các em.' },
];

export const QUA_TANG_TONG = QUA_TANG_DATA.reduce((sum, b) => sum + b.total, 0);
```

- [ ] **Step 2: Kiểm tra tổng cộng đúng 75.730.000**

Run: `node -e "const path=require('path'); const {execSync}=require('child_process'); execSync('npx tsc --noEmit --skipLibCheck \"src/app/(public)/giai-cau-long-2026/qua-tang-data.ts\"',{stdio:'inherit'})"`

Đơn giản hơn — kiểm tra tổng bằng cách tính tay từ dữ liệu:
Run: `node -e "const d=[33120000,15410000,11200000,16000000]; const t=d.reduce((a,b)=>a+b,0); if(t!==75730000){console.error('SAI TONG',t);process.exit(1)} console.log('OK tong=',t)"`
Expected: `OK tong= 75730000`

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/giai-cau-long-2026/qua-tang-data.ts"
git commit -m "feat(giai): dữ liệu bộ quà tặng VPP + xe đạp"
```

---

### Task 2: CSS cho 2 section mới

**Files:**
- Modify: `src/app/(public)/giai-cau-long-2026/giai.css` (thêm vào cuối file)

**Interfaces:**
- Produces: các class `.qt-grid .qt-card .qt-top .qt-group .qt-note .qt-meta .qt-total .qt-foot` (section quà) và `.donate-goal .donate-forms .pay.donate` (section tài trợ). Task 3 dùng các class này.

- [ ] **Step 1: Thêm CSS vào cuối `giai.css`**

Append vào cuối `src/app/(public)/giai-cau-long-2026/giai.css`:

```css
/* ===== Bộ quà tặng ===== */
.giai-page .qt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.giai-page .qt-card{background:var(--paper);border:2.5px solid var(--ink);border-radius:22px;padding:16px;box-shadow:5px 5px 0 var(--ink);display:flex;flex-direction:column;transition:transform .14s ease,box-shadow .14s ease}
.giai-page .qt-card:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--ink)}
.giai-page .qt-card.reward{background:var(--mustard-soft)}
.giai-page .qt-top{display:flex;gap:12px;align-items:flex-start}
.giai-page .qt-top svg{width:26px;height:26px;color:var(--terra-d);flex-shrink:0;display:inline-block}
.giai-page .qt-card h3{font-family:"Baloo 2";font-size:1.1rem;color:var(--ink);line-height:1.1}
.giai-page .qt-group{color:var(--muted);font-size:.9rem;font-weight:700;margin-top:3px}
.giai-page .qt-note{margin-top:12px;color:var(--brown);font-size:.85rem;font-weight:600;line-height:1.5;flex:1}
.giai-page .qt-meta{margin-top:14px;padding-top:12px;border-top:2.5px dashed var(--line)}
.giai-page .qt-meta .row{display:flex;justify-content:space-between;gap:10px;padding:5px 0;font-size:.9rem;font-weight:700}
.giai-page .qt-meta .row span{color:var(--muted)}
.giai-page .qt-meta .row b{font-family:"Baloo 2"}
.giai-page .qt-meta .row.total b{color:var(--terra)}
.giai-page .qt-total{margin-top:22px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;background:var(--ink);color:var(--cream2);border-radius:18px;padding:16px 24px;box-shadow:5px 5px 0 var(--terra)}
.giai-page .qt-total span{font-family:"Baloo 2";font-weight:700;font-size:1.05rem}
.giai-page .qt-total b{font-family:"Baloo 2";font-size:1.5rem;color:var(--mustard)}
.giai-page .qt-foot{margin-top:14px;font-size:.85rem;color:var(--brown);font-weight:600;line-height:1.5}
@media(max-width:960px){.giai-page .qt-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.giai-page .qt-grid{grid-template-columns:1fr}}

/* ===== Đồng hành / Tài trợ ===== */
.giai-page .donate-goal{margin-top:20px;display:flex;flex-direction:column;gap:10px}
.giai-page .donate-goal>div{display:flex;flex-direction:column;background:rgba(255,255,255,.12);border:2px solid rgba(255,246,236,.35);border-radius:14px;padding:10px 16px}
.giai-page .donate-goal .k{font-size:.8rem;font-weight:700;color:rgba(255,246,236,.85);text-transform:uppercase;letter-spacing:.04em}
.giai-page .donate-goal .v{font-family:"Baloo 2";font-weight:700;font-size:1.08rem;color:#FFF6EC;margin-top:2px}
.giai-page .donate-forms{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px}
.giai-page .donate-forms span{background:var(--mustard);color:var(--ink);border:2.5px solid var(--ink);border-radius:999px;padding:7px 15px;font-family:"Baloo 2";font-weight:700;font-size:.88rem;box-shadow:3px 3px 0 var(--ink)}
.giai-page .pay.donate h4{color:var(--terra)}
.giai-page .pay.donate .val{text-align:right;max-width:62%}
```

- [ ] **Step 2: Build kiểm tra CSS không phá vỡ build**

Run: `npm run build`
Expected: build thành công, không lỗi (CSS mới chưa dùng nên chỉ kiểm cú pháp/không hồi quy).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/giai-cau-long-2026/giai.css"
git commit -m "style(giai): CSS mục quà tặng & tài trợ"
```

---

### Task 3: Hai section JSX + xác minh trực quan

**Files:**
- Modify: `src/app/(public)/giai-cau-long-2026/page.tsx` (thêm import + `formatVND` + 2 `<section>`)

**Interfaces:**
- Consumes: `QUA_TANG_DATA`, `QUA_TANG_TONG` (Task 1); các class CSS (Task 2); `GiftIcon`, `ArrowIcon` (đã có trong `page.tsx`).

- [ ] **Step 1: Thêm import dữ liệu**

Sửa `page.tsx` — ngay dưới dòng `import { HOC_BONG_DATA } from './hoc-bong-data';` thêm:

```tsx
import { QUA_TANG_DATA, QUA_TANG_TONG } from './qua-tang-data';
```

- [ ] **Step 2: Thêm helper `formatVND`**

Trong `page.tsx`, ngay trên `export default function GiaiCauLong2026Page() {`, thêm:

```tsx
const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';
```

- [ ] **Step 3: Chèn section ① Bộ quà — ngay SAU `</section>` đóng của `#hoc-bong`, TRƯỚC comment `{/* Mini footer bar cho giải */}`**

```tsx
        {/* Bộ quà trao tận tay các em */}
        <section id="qua-tang" style={{ background: 'var(--cream2)' }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Quỹ giải dùng vào đâu</span>
              <h2>Bộ quà trao tận tay các em</h2>
              <p>Bên cạnh học bổng, mỗi em còn nhận bộ quà học tập thiết thực. Toàn bộ chi phí được công khai minh bạch.</p>
            </div>
            <div className="qt-grid">
              {QUA_TANG_DATA.map((b) => (
                <article key={b.bundle} className={`qt-card${b.isReward ? ' reward' : ''}`}>
                  <div className="qt-top">
                    <GiftIcon />
                    <div>
                      <h3>{b.bundle}</h3>
                      <div className="qt-group">{b.group}</div>
                    </div>
                  </div>
                  <p className="qt-note">{b.note}</p>
                  <div className="qt-meta">
                    <div className="row"><span>{b.isReward ? 'Số lượng' : 'Số học sinh'}</span><b>{b.count}{b.isReward ? ' xe' : ' em'}</b></div>
                    <div className="row"><span>Đơn giá/phần</span><b>{formatVND(b.unitPrice)}</b></div>
                    <div className="row total"><span>Thành tiền</span><b>{formatVND(b.total)}</b></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="qt-total">
              <span>Tổng giá trị quà tặng &amp; phần thưởng</span>
              <b>{formatVND(QUA_TANG_TONG)}</b>
            </div>
            <p className="qt-foot">Chi tiết từng món (vở, bút, thước, máy tính Casio…) theo bảng báo giá VPP. Phần quà mầm non gồm sữa tươi, sữa chua &amp; bánh dinh dưỡng.</p>
          </div>
        </section>
```

- [ ] **Step 4: Chèn section ② Tài trợ — ngay SAU section `#qua-tang` vừa thêm, vẫn TRƯỚC `{/* Mini footer bar cho giải */}`**

```tsx
        {/* Đồng hành cùng chương trình — kêu gọi tài trợ */}
        <section className="register" id="tai-tro">
          <svg className="rays" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="currentColor">
              <path d="M100 0l6 60h-12zM100 200l6-60h-12zM0 100l60 6v-12zM200 100l-60 6v-12zM26 26l44 32-10 10zM174 174l-44-32 10-10zM174 26l-32 44-10-10zM26 174l32-44 10 10z"/>
            </g>
          </svg>
          <div className="wrap reg-card" style={{ paddingTop: '36px', paddingBottom: '36px' }}>
            <div>
              <span className="kicker">Tiếp Bước Em Đến Trường 2026</span>
              <h2>Đồng hành cùng chương trình</h2>
              <p className="lede">Toàn bộ nguồn quỹ vận động được dành trọn để trao học bổng cho các em học sinh mồ côi cha mẹ, sống cùng ông bà già yếu, gia đình hộ nghèo – cận nghèo nhưng vẫn kiên trì đến trường và học tốt.</p>
              <div className="donate-goal">
                <div><span className="k">Mục tiêu học bổng 2026</span><span className="v">82 suất × 800.000đ = 65.650.000đ</span></div>
                <div><span className="k">Năm 2025 đã trao</span><span className="v">67 suất · 40.000.000đ + nhiều hiện vật</span></div>
              </div>
              <div className="donate-forms">
                <span>💰 Tài trợ tiền mặt</span>
                <span>🎁 Tài trợ hiện vật</span>
                <span>🎓 Trao học bổng trực tiếp</span>
              </div>
            </div>
            <div className="pay donate">
              <h4>Thông tin nhận ủng hộ</h4>
              <div className="row"><span className="lbl">Chủ tài khoản</span><span className="val">Hộ Kinh Doanh Song Thạch</span></div>
              <div className="row"><span className="lbl">Số tài khoản</span><span className="val">165099</span></div>
              <div className="row"><span className="lbl">Nội dung CK</span><span className="val">Ho tro hoc bong Song Thach 2026 - [Tên nhà tài trợ]</span></div>
              <div className="row"><span className="lbl">Người phụ trách</span><span className="val">Nguyễn Nhật Tân</span></div>
              <a className="g-btn btn-mustard btn-lg" href="https://zalo.me/0378990979" target="_blank" rel="noopener" style={{ marginTop: '16px' }}>
                Liên hệ tài trợ · Zalo 0378.99.09.79 <ArrowIcon />
              </a>
              <p className="note">BTC cam kết sử dụng nguồn tài trợ đúng mục đích, minh bạch và công khai danh sách sau chương trình. Xin trân trọng cảm ơn!</p>
            </div>
          </div>
        </section>
```

- [ ] **Step 5: Build + lint**

Run: `npm run build`
Expected: build thành công, không lỗi type/JSX.
Run: `npm run lint`
Expected: không lỗi mới trong `giai-cau-long-2026`.

- [ ] **Step 6: Xác minh trực quan desktop**

Run: `npm run dev` (nền), mở `http://localhost:3000/giai-cau-long-2026`.
Dùng Playwright: `browser_navigate` tới URL, cuộn xuống cuối trang, `browser_take_screenshot` (full page hoặc vùng 2 section mới).
Kiểm:
- Section "Bộ quà trao tận tay các em": 4 thẻ (Cấp 1 / Cấp 2 / Sữa&bánh / Xe đạp-nền vàng), số liệu khớp (33.120.000đ, 15.410.000đ, 11.200.000đ, 16.000.000đ), dải tổng **75.730.000đ**.
- Section "Đồng hành cùng chương trình": nền terra, mục tiêu 65.650.000đ, 3 pill hình thức, thẻ ủng hộ đúng STK **165099** / Hộ Kinh Doanh Song Thạch / nút Zalo 0378.99.09.79.
- Section lệ phí thi đấu (#dangky) vẫn giữ STK VPBANK 0988918418 — KHÔNG bị lẫn.

- [ ] **Step 7: Xác minh trực quan mobile**

Dùng Playwright `browser_resize` về `390 × 844` (iPhone), reload, `browser_take_screenshot` 2 section mới.
Kiểm:
- Lưới quà xuống **1 cột**, thẻ không tràn ngang.
- Thẻ tài trợ (`reg-card`) xếp **1 cột** (breakpoint 780px), nút Zalo và các dòng STK không tràn/không vỡ chữ.
- Dải `qt-total` xuống dòng gọn (flex-wrap), không tràn.

- [ ] **Step 8: Commit**

```bash
git add "src/app/(public)/giai-cau-long-2026/page.tsx"
git commit -m "feat(giai): mục Bộ quà tặng & Đồng hành/Tài trợ (responsive)"
```

---

## Self-Review

**Spec coverage:**
- Spec §3.1 (dữ liệu quà) → Task 1. ✓
- Spec §3.2 (thông tin tài trợ) → Task 3 Step 4. ✓
- Spec §4 ① (section quà) → Task 2 (CSS) + Task 3 Step 3. ✓
- Spec §4 ② (section tài trợ) → Task 2 (CSS) + Task 3 Step 4. ✓
- Spec §5 (thêm file data, sửa page.tsx, sửa giai.css, formatVND) → Task 1/2/3. ✓
- Spec §6 (build + visual + responsive + tách STK) → Task 3 Steps 5–7. ✓
- Spec §7 (YAGNI: không bảng chi tiết từng món, không nhúng PDF, không QR) → không có task nào làm các mục này. ✓

**Placeholder scan:** Không có TBD/TODO; mọi code hiển thị đầy đủ; "[Tên nhà tài trợ]" là nội dung CK cố ý (đúng nguyên văn Thư Ngỏ), không phải placeholder plan.

**Type consistency:** `GiftBundle` fields (`group, bundle, count, unitPrice, total, note, isReward`) dùng nhất quán ở Task 1 (định nghĩa) và Task 3 Step 3 (tiêu thụ). `QUA_TANG_TONG` và `formatVND(n:number)` khớp chữ ký. ✓
