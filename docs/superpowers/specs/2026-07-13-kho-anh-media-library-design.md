# Kho ảnh (Media library) — Thiết kế

**Ngày:** 2026-07-13
**Trạng thái:** Đã duyệt thiết kế, chờ implement

## Mục tiêu

Admin cần một trang riêng để **upload ảnh và lấy link (URL) để dán vào bài viết** (hoặc bất kỳ đâu). Ảnh upload một lần, copy link dùng lại nhiều lần.

Hiện đã có nút chèn ảnh trong editor và ảnh bìa, nhưng chúng chèn ảnh thẳng chứ không đưa cho admin một **link để cầm và tái sử dụng**. Trang gallery "Thư viện ảnh" hiện tại thì bắt buộc gắn ảnh vào một mục công khai cố định (sân cầu / sân bóng / tiệc cưới / café) → không phù hợp làm kho link tự do.

## Bối cảnh sẵn có (không cần làm lại)

- Mọi ảnh upload qua `/api/admin/upload` được lưu vào Supabase Storage bucket **`post-images`** với tên ngẫu nhiên (`<timestamp>-<random>.<ext>`), whitelist JPG/PNG/WEBP/GIF, tối đa 5MB, trả về `{ url }` là public URL.
- Bucket `post-images` đã tồn tại & public (ảnh hiện tại hiển thị được qua `next/image`).
- `createAdminClient()` (`src/lib/supabase/admin.ts`) dùng service role key — chỉ ở server routes.
- `requireAdmin()` (`src/lib/auth.ts`) trả `{ user, response }`; nếu `response` khác null thì trả luôn response đó (pattern chuẩn của mọi route admin).

## Phạm vi

### Làm
1. **API `/api/admin/media/route.ts`** (bảo vệ bằng `requireAdmin()`):
   - `GET`: `supabase.storage.from('post-images').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })`. Với mỗi object lấy `getPublicUrl` → trả `{ images: [{ name, url, size, created_at }] }`. Bỏ qua entry placeholder/thư mục (name rỗng hoặc `.emptyFolderPlaceholder`).
   - `DELETE?name=<filename>`: validate `name` không rỗng và không chứa `/` (chỉ file ở gốc bucket), gọi `storage.remove([name])`. Trả 200 hoặc lỗi.
2. **Trang `/admin/media/page.tsx`** (client component, theo phong cách `src/app/admin/gallery/page.tsx`):
   - Ô upload đầu trang (chọn file → gọi `/api/admin/upload` → tự `fetchImages()` lại). Trạng thái `uploading`.
   - Lưới ảnh (grid 2/3/4 cột responsive). Mỗi ô: thumbnail (`next/image`) + 2 nút hiện khi hover:
     - **"Copy link"**: `navigator.clipboard.writeText(url)` → hiện toast/nhãn "Đã copy link" ~2 giây (state cục bộ theo từng ảnh, không cần thư viện toast).
     - **Xoá**: `confirm(...)` → `DELETE /api/admin/media?name=<name>` → `fetchImages()`.
   - Trạng thái loading / rỗng / lỗi giống trang gallery.
3. **Sidebar** (`src/app/admin/layout.tsx`): thêm mục `{ href: '/admin/media', icon: ImageDown, label: 'Kho ảnh' }` ngay dưới "Thư viện ảnh". Import thêm icon `ImageDown` từ `lucide-react`.

### Không làm (YAGNI)
- Không tạo bảng DB, không migration (đọc thẳng Storage).
- Không tìm kiếm, không chú thích/tag, không phân trang (giới hạn 100 ảnh gần nhất là đủ).
- Không đổi tên file, không sửa `/api/admin/upload`.
- Không đụng tới trang gallery "Thư viện ảnh" hiện có.

## Quyết định thiết kế

- **Tên hiển thị:** "Kho ảnh" (phân biệt với "Thư viện ảnh" = gallery công khai).
- **Nút copy** copy **public URL trực tiếp** của ảnh (`.jpg/.png/...`) — đúng cái để dán vào bài viết/Facebook.
- **Nguồn dữ liệu:** liệt kê trực tiếp bucket `post-images`. Nghĩa là kho này hiện **tất cả** ảnh đã từng upload (kể cả ảnh chèn trong editor và ảnh bìa) — đúng ý "dùng lại nhiều lần".
  - *Hệ quả cần lưu ý:* xoá một ảnh ở đây sẽ xoá file thật trong Storage; nếu ảnh đó đang được dùng trong một bài viết thì bài viết sẽ hỏng ảnh. Chấp nhận được cho công cụ admin nội bộ; nút xoá có `confirm()` cảnh báo.

## Kiểm thử / Nghiệm thu

- Upload 1 ảnh mới ở `/admin/media` → ảnh xuất hiện trong lưới, đầu danh sách.
- Bấm "Copy link" → clipboard chứa đúng public URL, dán vào editor bài viết hiển thị được ảnh.
- Bấm Xoá → ảnh biến mất khỏi lưới và khỏi bucket.
- `npm run build` pass, `tsc --noEmit` sạch.
- Truy cập API khi chưa đăng nhập admin → bị chặn (401/403 qua `requireAdmin`).
