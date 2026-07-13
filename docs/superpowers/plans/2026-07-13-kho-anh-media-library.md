# Kho ảnh (Media Library) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm trang admin "Kho ảnh" để upload ảnh và copy link (public URL) dán vào bài viết, đọc thẳng từ Supabase Storage bucket `post-images`.

**Architecture:** Một API route mới `/api/admin/media` liệt kê & xoá object trong bucket `post-images` (không có bảng DB). Một trang client `/admin/media` upload (tái dùng `/api/admin/upload`) + lưới ảnh có nút Copy link / Xoá. Thêm 1 mục sidebar.

**Tech Stack:** Next.js App Router (route handlers + client component), Supabase Storage qua `createAdminClient()` (service role), `lucide-react`, Tailwind, `next/image`.

## Global Constraints

- Mọi route dưới `/api/admin/*` phải gọi `requireAdmin()` đầu handler và `return response` nếu `response` khác null.
- `createAdminClient()` (service role) chỉ dùng trong server route handlers, không bao giờ ở client.
- Bucket Storage: **`post-images`** (đã tồn tại & public). Không tạo bucket, không sửa `/api/admin/upload`.
- Không tạo bảng DB, không migration.
- Dự án **không có test framework**; verify bằng `npm run build` (bao gồm typecheck) + kiểm thử thủ công qua trình duyệt. Đây là quy ước sẵn có của repo.
- Ngôn ngữ UI/text: tiếng Việt, theo phong cách `src/app/admin/gallery/page.tsx`.

---

### Task 1: API route `/api/admin/media` (GET liệt kê + DELETE xoá)

**Files:**
- Create: `src/app/api/admin/media/route.ts`

**Interfaces:**
- Consumes: `createAdminClient()` từ `@/lib/supabase/admin`; `requireAdmin()` từ `@/lib/auth` (trả `{ user, response }`).
- Produces:
  - `GET /api/admin/media` → `{ images: Array<{ name: string; url: string; size: number | null; created_at: string | null }> }` (tối đa 100 ảnh, mới nhất trước).
  - `DELETE /api/admin/media?name=<filename>` → `{ ok: true }` hoặc `{ error }`.

- [ ] **Step 1: Tạo file route với đầy đủ code**

Create `src/app/api/admin/media/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

const BUCKET = 'post-images';

// GET /api/admin/media — liệt kê ảnh trong kho (Storage bucket post-images)
export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const images = (data ?? [])
    .filter(obj => obj.name && obj.name !== '.emptyFolderPlaceholder')
    .map(obj => ({
      name:       obj.name,
      url:        supabase.storage.from(BUCKET).getPublicUrl(obj.name).data.publicUrl,
      size:       (obj.metadata?.size as number | undefined) ?? null,
      created_at: obj.created_at ?? null,
    }));

  return NextResponse.json({ images });
}

// DELETE /api/admin/media?name=<filename> — xoá 1 ảnh khỏi kho
export async function DELETE(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const name = new URL(req.url).searchParams.get('name');
  if (!name || name.includes('/')) {
    return NextResponse.json({ error: 'Tên file không hợp lệ' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Build để verify compile + typecheck**

Run: `npm run build`
Expected: Build thành công, không lỗi TypeScript. Route `/api/admin/media` xuất hiện trong danh sách route (ƒ hoặc λ dynamic).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/media/route.ts
git commit -m "feat(media): API /api/admin/media liệt kê + xoá ảnh trong kho"
```

---

### Task 2: Trang `/admin/media` + mục sidebar "Kho ảnh"

**Files:**
- Create: `src/app/admin/media/page.tsx`
- Modify: `src/app/admin/layout.tsx` (thêm import icon + 1 entry `NAV`)

**Interfaces:**
- Consumes: `GET /api/admin/media` và `DELETE /api/admin/media?name=` (Task 1); `POST /api/admin/upload` (đã có, trả `{ url }`).
- Produces: trang admin điều hướng được tại `/admin/media`.

- [ ] **Step 1: Tạo trang với đầy đủ code**

Create `src/app/admin/media/page.tsx`:

```tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, Copy, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaImage {
  name: string;
  url: string;
  size: number | null;
  created_at: string | null;
}

export default function AdminMediaPage() {
  const [images, setImages]     = useState<MediaImage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/admin/media');
    const data = await res.json();
    setImages(data.images ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) fetchImages();
    else setError(data.error || 'Upload thất bại');
  }

  async function copyLink(url: string, name: string) {
    await navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(c => (c === name ? null : c)), 2000);
  }

  async function remove(name: string) {
    if (!confirm('Xoá ảnh này khỏi kho? Nếu ảnh đang dùng trong bài viết, bài đó sẽ mất ảnh.')) return;
    await fetch(`/api/admin/media?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
    fetchImages();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kho ảnh</h1>
        <p className="text-gray-500 text-sm mt-1">Upload ảnh và copy link để dán vào bài viết. Đây là tất cả ảnh đã upload lên website.</p>
      </div>

      {/* Khu upload */}
      <div className="bg-white border-2 border-gray-200 p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="w-40 h-28 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-sports-primary hover:bg-gray-50 transition-colors shrink-0 text-gray-400">
            {uploading ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
            <span className="text-xs">{uploading ? 'Đang tải...' : 'Upload ảnh mới'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </label>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Chọn ảnh để tải lên kho. Sau khi upload, bấm <strong>Copy link</strong> ở ảnh tương ứng rồi dán vào bài viết.</p>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <p className="text-gray-400 text-xs mt-2">JPG / PNG / WEBP / GIF · tối đa 5MB.</p>
          </div>
        </div>
      </div>

      {/* Lưới ảnh */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Đang tải...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm border border-dashed border-gray-200">
          Chưa có ảnh nào. Upload ảnh đầu tiên ở trên.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.name} className="group relative overflow-hidden border border-gray-200 bg-white">
              <div className="relative w-full aspect-[4/3]">
                <Image src={img.url} alt={img.name} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-2 flex gap-2">
                <button
                  onClick={() => copyLink(img.url, img.name)}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-colors',
                    copied === img.name ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  )}
                >
                  {copied === img.name ? <><Check size={13} /> Đã copy</> : <><Copy size={13} /> Copy link</>}
                </button>
                <button
                  onClick={() => remove(img.name)}
                  className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  title="Xoá"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Thêm mục sidebar trong `src/app/admin/layout.tsx`**

Trong dòng import từ `'lucide-react'`, thêm `ImageDown` vào danh sách import (cạnh `Images`).

Đổi import (dòng ~5-8) thành có `ImageDown`:

```tsx
import {
  LayoutDashboard, Calendar, MapPin, Users,
  Heart, Settings, LogOut, ChevronRight, FileText, Ticket, Images, Wallet, ImageDown,
} from 'lucide-react';
```

Trong mảng `NAV`, thêm entry ngay **sau** dòng `{ href: '/admin/gallery', ... }`:

```tsx
  { href: '/admin/media',    icon: ImageDown,       label: 'Kho ảnh'            },
```

- [ ] **Step 3: Build để verify compile + typecheck**

Run: `npm run build`
Expected: Build thành công, route `/admin/media` xuất hiện (○ static hoặc prerendered client page), không lỗi TypeScript/ESLint.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/media/page.tsx src/app/admin/layout.tsx
git commit -m "feat(media): trang /admin/media (Kho ảnh) + mục sidebar"
```

---

### Task 3: Kiểm thử thủ công end-to-end trên trình duyệt

**Files:** không sửa file (chỉ verify).

**Interfaces:** dùng Task 1 + Task 2.

- [ ] **Step 1: Chạy dev server**

Run: `npm run dev`
Expected: server chạy ở `http://localhost:3000`.

- [ ] **Step 2: Đăng nhập admin và mở `/admin/media`**

Mở `http://localhost:3000/admin/media` (đăng nhập admin nếu bị chuyển về login).
Expected: thấy tiêu đề "Kho ảnh", ô upload, và lưới ảnh (các ảnh đã upload trước đó hiển thị nếu có).

- [ ] **Step 3: Upload 1 ảnh test**

Bấm ô "Upload ảnh mới", chọn 1 file JPG/PNG < 5MB.
Expected: sau khi tải xong, ảnh mới xuất hiện ở đầu lưới.

- [ ] **Step 4: Copy link và kiểm tra**

Bấm "Copy link" ở ảnh vừa upload → nút đổi thành "Đã copy" (xanh) ~2 giây.
Dán link vào thanh địa chỉ trình duyệt (tab mới) → ảnh mở được (public URL hợp lệ).
Bonus: mở `/admin/posts/new`, dùng nút chèn link/ảnh dán URL → ảnh hiển thị trong editor.

- [ ] **Step 5: Xoá ảnh test**

Bấm nút Xoá (thùng rác) ở ảnh test → xác nhận → ảnh biến mất khỏi lưới. Reload trang xác nhận ảnh không còn (đã xoá khỏi bucket).

- [ ] **Step 6: (không commit — chỉ xác nhận)**

Ghi lại kết quả kiểm thử. Nếu mọi bước pass, tính năng hoàn tất.

---

## Self-Review

**Spec coverage:**
- API GET liệt kê bucket → Task 1. ✅
- API DELETE xoá → Task 1. ✅
- Trang upload + lưới + Copy link + Xoá → Task 2. ✅
- Sidebar "Kho ảnh" → Task 2. ✅
- Tái dùng `/api/admin/upload`, không migration → Task 1/2 (không đụng). ✅
- Nghiệm thu upload/copy/xoá/build → Task 3 + build steps. ✅

**Placeholder scan:** Không có TBD/TODO; mọi step có code hoặc lệnh cụ thể + expected. ✅

**Type consistency:** `MediaImage { name, url, size, created_at }` khớp giữa API response (Task 1) và interface trang (Task 2). Hàm `copyLink(url, name)`, `remove(name)`, `fetchImages()` dùng nhất quán. Icon `ImageDown` import đúng chỗ. ✅
