# Football "Lớp Bóng Đá Hè" Chiêu Sinh Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder 3-card "chiêu sinh" section on the football page with a real single-program section for "Lớp Bóng Đá Hè" (Văn Tâm Đồng Nai – Vệ tinh PVF), styled like the badminton page's `id="classes"` section.

**Architecture:** Single-file change to `src/app/(public)/sports/football/page.tsx` — swap the `FB_CLASSES` data array for two small consts (`SUMMER_CLASS`, `ENROLL_CONTACTS`), and replace the `id="classes"` JSX section with a 2-column layout reusing existing `sports-card` / `gradient-sports` / `sports-btn` classes already used elsewhere on this page and on the badminton page.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind, lucide-react icons. No test framework in this project — verification is via `npm run lint`/`tsc` and a manual dev-server check.

---

### Task 1: Update imports and replace placeholder data

**Files:**
- Modify: `D:\songthach\src\app\(public)\sports\football\page.tsx:1-7` (imports)
- Modify: `D:\songthach\src\app\(public)\sports\football\page.tsx:18-61` (FB_CLASSES block)

- [ ] **Step 1: Update the lucide-react import and remove the unused `Link` import**

Replace lines 1-7:

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Lightbulb, Car, GraduationCap, Clock, CalendarDays, CheckCircle2, Users } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import BookingWidget from '@/components/sports/BookingWidget';
```

with:

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { Lightbulb, Car, GraduationCap, Clock, CalendarDays, Users, MapPin, Phone, Building2 } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import BookingWidget from '@/components/sports/BookingWidget';
```

(`Link` and `CheckCircle2` are no longer used anywhere in this file after Task 2 removes the only section that used them; `MapPin`, `Phone`, `Building2` are newly needed.)

- [ ] **Step 2: Replace the `FB_CLASSES` array with the new data consts**

Replace lines 18-61 (the entire `const FB_CLASSES = [...]` block) with:

```tsx
const SUMMER_CLASS = {
  org: 'Trung tâm đào tạo bóng đá Văn Tâm Đồng Nai – Vệ tinh PVF',
  ageRange: '7 – 14 tuổi',
  startDate: '01/06/2026',
  schedule: 'Thứ 2, Thứ 4, Thứ 6 · 17h30 – 19h00',
  price: '500.000đ / tháng',
  address: '9B/3, Ấp An Hòa, Xã Hưng Thịnh',
};

const ENROLL_CONTACTS = [
  { phone: '0837781818', display: '0837 781 818', name: 'Thầy Phụng' },
  { phone: '0915178939', display: '0915 178 939', name: 'Cô Hà' },
];
```

- [ ] **Step 3: Save the file** (no test to run yet — verification happens in Task 3)

---

### Task 2: Replace the "classes" section JSX

**Files:**
- Modify: `D:\songthach\src\app\(public)\sports\football\page.tsx` — the `{/* ─── CHIÊU SINH LỚP BÓNG ĐÁ ──...` section (originally lines 213-299, line numbers will have shifted slightly after Task 1's edits — search for the comment `CHIÊU SINH LỚP BÓNG ĐÁ` to locate it)

- [ ] **Step 1: Replace the entire section (from the `{/* ─── CHIÊU SINH...` comment through its closing `</section>`) with:**

```tsx
      {/* ─── CHIÊU SINH LỚP BÓNG ĐÁ HÈ ──────────────────── */}
      <section id="classes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sports-light text-sports-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              <GraduationCap size={14} /> Chiêu sinh hè — Văn Tâm Đồng Nai (Vệ tinh PVF)
            </div>
            <h2 className="sports-hero-text text-4xl font-bold text-sports-dark mb-2">Lớp Bóng Đá Hè</h2>
            <p className="text-gray-500 flex items-center justify-center gap-1.5">
              <MapPin size={14} className="text-sports-primary shrink-0" /> Sân bóng đá Song Thạch — {SUMMER_CLASS.address}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cột trái: thông tin chương trình + liên hệ đăng ký */}
            <div className="lg:col-span-2 space-y-6">
              <div className="sports-card p-6">
                <h3 className="sports-hero-text text-lg font-bold text-sports-dark mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-sports-primary" /> Thông tin chương trình
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                      <Building2 size={15} className="text-sports-primary" />
                    </div>
                    <span className="text-sm text-gray-700">{SUMMER_CLASS.org}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                      <Users size={15} className="text-sports-primary" />
                    </div>
                    <span className="text-sm text-gray-700">Đối tượng: {SUMMER_CLASS.ageRange}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                      <CalendarDays size={15} className="text-sports-primary" />
                    </div>
                    <span className="text-sm text-gray-700">Khai giảng: {SUMMER_CLASS.startDate}</span>
                  </li>
                </ul>
              </div>

              <div className="sports-card p-6 text-center">
                <p className="text-gray-500 text-sm mb-3">Liên hệ đăng ký (Phone / Zalo)</p>
                <div className="flex flex-col gap-3">
                  {ENROLL_CONTACTS.map((c, i) => (
                    <a
                      key={c.phone}
                      href={`tel:${c.phone}`}
                      className={i === 0
                        ? 'sports-btn flex items-center justify-center gap-2'
                        : 'flex items-center justify-center gap-2 border border-sports-primary text-sports-primary font-semibold px-6 py-3 rounded-xl hover:bg-sports-light transition-all'}
                    >
                      <Phone size={16} /> {c.display} ({c.name})
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải: lịch học, học phí, địa điểm */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="gradient-sports px-4 py-3">
                  <p className="sports-hero-text font-bold text-white text-sm tracking-wider">THÔNG TIN LỚP HỌC</p>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted">
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Thông tin</th>
                    <th className="text-right px-4 py-2 text-muted-foreground font-medium">Chi tiết</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground/80 font-medium text-xs">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-sports-primary" /> Lịch học</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">{SUMMER_CLASS.schedule}</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground/80 font-medium text-xs">
                        <span className="flex items-center gap-2"><GraduationCap size={14} className="text-sports-primary" /> Học phí</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">{SUMMER_CLASS.price}</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground/80 font-medium text-xs align-top">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-sports-primary" /> Địa điểm</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">Sân bóng đá Song Thạch<br />{SUMMER_CLASS.address}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground px-4 py-3 border-t border-border">Đăng ký theo tháng · Liên hệ trực tiếp HLV phụ trách qua hotline bên cạnh</p>
              </div>
            </div>
          </div>
        </div>
      </section>
```

---

### Task 3: Verify

**Files:** none (verification only)

- [ ] **Step 1: Run typecheck/lint**

Run: `cd D:\songthach && npm run lint`

Expected: no errors about unused imports (`Link`, `CheckCircle2`, `FB_CLASSES`) and no errors about undefined identifiers (`MapPin`, `Phone`, `Building2`, `SUMMER_CLASS`, `ENROLL_CONTACTS`).

- [ ] **Step 2: Manual visual check**

Run: `cd D:\songthach && npm run dev`

Open `http://localhost:3000/sports/football`, scroll to the "Lớp Bóng Đá Hè" section, and confirm:
- Section renders with white background, 2-column layout (info+contact card on left, schedule/price table on right)
- Both phone numbers are clickable `tel:` links
- Layout looks like the equivalent section on `http://localhost:3000/sports/badminton`

Stop the dev server after checking.

---

## Self-review

- **Spec coverage:** org name, age range, start date, schedule, price, address, and both contacts are all present in `SUMMER_CLASS`/`ENROLL_CONTACTS` and rendered. Layout follows badminton's 2-column `id="classes"` pattern as specified.
- **Placeholder scan:** none — all code blocks are complete and copy-pasteable.
- **Type consistency:** `SUMMER_CLASS.*` and `ENROLL_CONTACTS[].{phone,display,name}` field names match between Task 1 (definition) and Task 2 (usage).
- No git repo in `D:\songthach`, so no commit steps are included.
