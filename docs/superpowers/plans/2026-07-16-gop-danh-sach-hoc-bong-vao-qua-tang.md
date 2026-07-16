# Gộp danh sách học bổng vào khu Quà tặng (thanh xổ) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xoá section `#hoc-bong` rời trên trang `/giai-cau-long-2026`, đưa bảng 82 học sinh vào cuối section `#qua-tang` dưới dạng `<details>` đóng sẵn.

**Architecture:** Thuần trình bày, không đổi dữ liệu. Thêm 1 component icon (`ChevronIcon`) + 1 khối `<details className="hb-acc" id="hoc-bong">` trong `page.tsx`; thêm ~10 dòng CSS vào cuối `giai.css`. Dùng `<details>/<summary>` HTML thuần vì trang là server component (không `'use client'`, không thêm JS).

**Tech Stack:** Next.js App Router, React (TSX), CSS thuần trong `giai.css`. Không có test framework — xác minh bằng `npm run build` + kiểm tra trực quan (Playwright desktop/mobile).

**Spec:** `docs/superpowers/specs/2026-07-16-gop-danh-sach-hoc-bong-vao-qua-tang-design.md`

## Global Constraints

- Thư mục trang: `src/app/(public)/giai-cau-long-2026/`.
- Mọi class CSS đặt dưới namespace `.giai-page` (bắt buộc — cả file dùng namespace này).
- Biến màu dùng sẵn: `--cream2 #FBF4E6`, `--paper #FFFBF2`, `--mustard #E3A21A`, `--mustard-soft #F6DD9E`, `--terra #C5532F`, `--ink #3B2A1E`, `--brown #7A5638`, `--muted #8A6E54`, `--line #E2CFA9`. **KHÔNG thêm biến màu mới.**
- Font tiêu đề: `"Baloo 2"` (đã import sẵn).
- **KHÔNG chạy `npm run build` khi dev server của user đang chạy** — cả hai dùng chung `D:\songthach\.next`, build sẽ làm hỏng cache dev (`Error: Cannot find module './XXXX.js'`). Hỏi user tắt dev trước khi build.
- Không đụng tới: `hoc-bong-data.ts`, hàm `obscureName`, bảng quà (`qt-*`), khu `#tai-tro`, hero, nhóm thi đấu, lệ phí, đăng ký.
- Không thêm `@media print` (`giai.css` xưa nay không có — ngoài phạm vi).

---

### Task 1: CSS cho thanh xổ danh sách học bổng

**Files:**
- Modify: `src/app/(public)/giai-cau-long-2026/giai.css` (append vào cuối file, sau dòng cuối `.giai-page .pay.donate .val{...}` — file hiện 212 dòng)

**Interfaces:**
- Produces: các class `.hb-acc` (thẻ `<details>`), `.hb-acc > summary`, `.hb-acc .hb-acc-badge`, `.hb-acc .hb-acc-chevron`, `.hb-acc-intro`. Task 2 dùng đúng các tên này.

- [ ] **Step 1: Append CSS vào cuối `giai.css`**

```css

/* ===== Thanh xổ danh sách học bổng (trong khu quà tặng) ===== */
.giai-page .hb-acc{margin-top:22px;border:2.5px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:4px 4px 0 var(--ink);background:var(--paper)}
.giai-page .hb-acc>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;background:var(--ink);color:var(--cream2);font-family:"Baloo 2";font-weight:700;font-size:1rem;cursor:pointer;list-style:none;user-select:none}
.giai-page .hb-acc>summary::-webkit-details-marker{display:none}
.giai-page .hb-acc>summary .hb-acc-ttl{display:flex;align-items:center;gap:10px;min-width:0}
.giai-page .hb-acc-badge{flex-shrink:0;background:var(--mustard);color:var(--ink);border-radius:999px;padding:2px 11px;font-size:.82rem;font-weight:800}
.giai-page .hb-acc-chevron{flex-shrink:0;width:20px;height:20px;transition:transform .2s ease}
.giai-page .hb-acc[open] .hb-acc-chevron{transform:rotate(180deg)}
.giai-page .hb-acc-intro{padding:14px 20px 0;color:var(--brown);font-size:.9rem;font-weight:600;line-height:1.55}
/* Bảng bên trong bỏ khung riêng để không lồng khung trong khung */
.giai-page .hb-acc .hb-table-wrap{border:none;border-radius:0;box-shadow:none;margin-top:14px}
@media(max-width:640px){
  .giai-page .hb-acc{border-radius:16px}
  .giai-page .hb-acc>summary{padding:13px 15px;font-size:.95rem;gap:8px}
  .giai-page .hb-acc-intro{padding:13px 15px 0}
  .giai-page .hb-acc .hb-table-wrap{border-radius:0}
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(public)/giai-cau-long-2026/giai.css"
git commit -m "style(giai): CSS thanh xổ danh sách học bổng"
```

CSS này chưa có markup dùng tới nên chưa kiểm được trực quan — Task 2 kiểm cả hai cùng lúc.

---

### Task 2: Chuyển bảng 82 em vào `#qua-tang` + xoá section cũ

**Files:**
- Modify: `src/app/(public)/giai-cau-long-2026/page.tsx`
  - Thêm `ChevronIcon` sau `ArrowIcon` (quanh dòng 43)
  - Xoá section `#hoc-bong` (dòng 329–373: từ `{/* Danh sách học sinh nhận học bổng */}` tới `</section>` đóng)
  - Thêm khối `<details>` vào cuối section `#qua-tang`, ngay sau `<p className="qt-foot">…</p>` (quanh dòng 413)

**Interfaces:**
- Consumes: `.hb-acc`, `.hb-acc-ttl`, `.hb-acc-badge`, `.hb-acc-chevron`, `.hb-acc-intro` (Task 1); `HOC_BONG_DATA` + `obscureName` (đã có sẵn trong `page.tsx`); `.hb-table-wrap`/`.hb-table`/`hb-*` (CSS sẵn có, không sửa).

- [ ] **Step 1: Thêm `ChevronIcon`**

Trong `page.tsx`, ngay sau khối `const ArrowIcon = () => (…);` (kết thúc quanh dòng 43), thêm:

```tsx
const ChevronIcon = () => (
  <svg className="hb-acc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
```

- [ ] **Step 2: Xoá section `#hoc-bong`**

Xoá **toàn bộ** khối từ dòng `{/* Danh sách học sinh nhận học bổng */}` tới `</section>` ngay trước `{/* Bộ quà trao tận tay các em */}` (dòng 329–373 hiện tại). Sau khi xoá, `</section>` của `#dangky` phải nối thẳng tới comment `{/* Bộ quà trao tận tay các em */}`.

Không xoá `import { HOC_BONG_DATA }` và hàm `obscureName` — Step 3 dùng lại.

- [ ] **Step 3: Thêm khối `<details>` vào cuối `#qua-tang`**

Trong section `#qua-tang`, ngay **sau** dòng `<p className="qt-foot">…</p>` và **trước** `</div>` đóng `.wrap`, thêm:

```tsx
            <details className="hb-acc" id="hoc-bong">
              <summary>
                <span className="hb-acc-ttl">
                  Danh sách 82 em nhận học bổng 2026
                  <span className="hb-acc-badge">82 suất</span>
                </span>
                <ChevronIcon />
              </summary>
              <p className="hb-acc-intro">
                82 học sinh vượt khó trên địa bàn xã Hưng Thịnh sẽ được trao học bổng từ quỹ giải.
                Tên học sinh được ẩn một phần để bảo vệ quyền riêng tư.
              </p>
              <div className="hb-table-wrap">
                <table className="hb-table">
                  <thead>
                    <tr>
                      <th className="hb-stt">STT</th>
                      <th className="hb-name">Họ và tên</th>
                      <th className="hb-sit">Hoàn cảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOC_BONG_DATA.flatMap((g) => g.students).map((s) => {
                      const cls = s.cls?.trim() ?? '';
                      const showCls = cls && (/\d/.test(cls) || /Mầm|Chồi|Lá/.test(cls));
                      return (
                        <tr key={s.stt}>
                          <td className="hb-stt">{s.stt}</td>
                          <td className="hb-name">
                            {obscureName(s.name)}
                            {showCls && <span className="hb-cls">{cls.replace(/^Lớp\s*/i, '')}</span>}
                          </td>
                          <td className="hb-sit">
                            <input type="checkbox" id={`sit-${s.stt}`} className="hb-more-cb" aria-hidden="true" tabIndex={-1} />
                            <span className="hb-sit-text">{s.situation}</span>
                            <label htmlFor={`sit-${s.stt}`} className="hb-more-btn" aria-hidden="true" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
```

Bảng bên trong copy **nguyên si** từ section cũ — giữ nguyên cơ chế checkbox-CSS `hb-more-cb` (nút "Xem thêm/Thu gọn" trên mobile).

- [ ] **Step 4: Kiểm type**

Run: `npx tsc --noEmit`
Expected: không lỗi.

- [ ] **Step 5: Build**

**Trước khi chạy: hỏi user tắt dev server** (xem Global Constraints).

Run: `npm run build`
Expected: build thành công, 29/29 static pages, không lỗi type/JSX.

- [ ] **Step 6: Xác minh trực quan desktop**

Run: `npm run dev`, mở `http://localhost:3000/giai-cau-long-2026`.
Dùng Playwright: `browser_navigate`, cuộn tới khu "Quỹ giải dùng vào đâu", `browser_take_screenshot`.

Kiểm:
- Sau khu "Đăng ký" là thẳng tới khu "Quỹ giải dùng vào đâu" — **không còn** khu "Danh sách học bổng 2026" nền paper riêng.
- Khu quà: kicker "Quỹ giải dùng vào đâu", h2 "Bộ quà trao tận tay các em", bảng quà 4 dòng + tổng **75.730.000đ** vẫn nguyên.
- Dưới ghi chú VPP là thanh xổ nền ink: chữ "Danh sách 82 em nhận học bổng 2026" + chip vàng "82 suất" + chevron. **Đóng sẵn** — bảng tên không hiện.
- Bấm thanh xổ → chevron xoay 180°, hiện câu giới thiệu + đủ 82 dòng, STT chạy 1→82.
- Mở ra **không có khung lồng khung**: bảng nằm liền trong khung thanh xổ, không có viền/bóng thứ hai.

- [ ] **Step 7: Xác minh trực quan mobile**

Playwright `browser_resize` về `390 × 844`, reload, chụp lại.

Kiểm:
- Thanh xổ không tràn ngang; chữ dài không đẩy chip/chevron ra ngoài.
- Mở ra: bảng vẫn ở dạng thẻ (STT · Tên + chip lớp), hoàn cảnh rút gọn 2 dòng, bấm "Xem thêm ▾" của một em → xổ đủ chữ, đổi thành "Thu gọn ▴".

- [ ] **Step 8: Kiểm anchor cũ**

Mở `http://localhost:3000/giai-cau-long-2026#hoc-bong`.
Expected: trang cuộn tới thanh xổ (id đã chuyển sang `<details>`).

- [ ] **Step 9: Commit**

```bash
git add "src/app/(public)/giai-cau-long-2026/page.tsx"
git commit -m "feat(giai): gộp danh sách 82 em vào khu quà tặng dạng thanh xổ"
```

---

## Self-Review

**Spec coverage:**
- Spec §3 (cấu trúc sau gộp: details trong `#qua-tang`, xoá section cũ, giữ kicker/h2) → Task 2 Steps 2–3. ✓
- Spec §3 (giữ `id="hoc-bong"` cho link cũ) → Task 2 Step 3 (`id` trên `<details>`) + Step 8 (kiểm). ✓
- Spec §4 (đóng mặc định, `<details>` thuần, giữ hành vi bảng mobile) → Task 2 Step 3 (copy nguyên si) + Step 7 (kiểm). ✓
- Spec §5 (giao diện thanh xổ: nền ink, chip mustard, chevron xoay, viền 2.5px + bóng khối, bỏ khung bảng bên trong, margin-top 22px) → Task 1 Step 1. ✓
- Spec §6 (không đụng tới) → Global Constraints. ✓
- Spec §7 (xác minh: build, trực quan desktop/mobile, anchor) → Task 2 Steps 4–8. ✓
- Spec §8 (YAGNI: không tìm kiếm/phân trang/nhớ trạng thái/tự mở/đổi tiêu đề/print) → không task nào làm. ✓

**Placeholder scan:** Không có TBD/TODO. Mọi step sửa code đều có code đầy đủ; bảng 82 em ghi trọn vẹn thay vì "giống section cũ".

**Type consistency:** Tên class trong Task 1 (`.hb-acc`, `.hb-acc-ttl`, `.hb-acc-badge`, `.hb-acc-chevron`, `.hb-acc-intro`) khớp đúng markup Task 2 Step 3. `ChevronIcon` tự gắn `className="hb-acc-chevron"` (Step 1) nên Step 3 gọi `<ChevronIcon />` không cần truyền prop — khớp. `HOC_BONG_DATA`/`obscureName`/`s.stt`/`s.name`/`s.cls`/`s.situation` giữ đúng chữ ký đang dùng. ✓

**Ghi chú thứ tự task:** Task 1 (CSS) không kiểm được độc lập vì chưa markup nào dùng; đây là đánh đổi có chủ ý để giữ nếp commit tách style/feat của repo. Task 2 kiểm cả hai.
