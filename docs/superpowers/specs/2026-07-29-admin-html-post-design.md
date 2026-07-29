# Thiết kế: Soạn bài viết bằng HTML thô trong Admin

Ngày: 2026-07-29
Phạm vi: Song Thạch — khu quản trị bài viết/tin tức

## Mục tiêu

Cho phép admin soạn/đăng bài viết bằng **HTML thô toàn vẹn** (giữ nguyên
`div`, `table`, `style`, `class`…), song song với trình soạn thảo rich-text
Tiptap hiện có. Dùng khi có HTML dựng sẵn muốn dán vào cho nhanh.

## Bối cảnh hiện tại (không đổi)

- `posts.content` đã lưu dạng HTML (Tiptap `getHTML()`).
- Trang công khai `src/app/(public)/tin-tuc/[slug]/page.tsx` render bằng
  `dangerouslySetInnerHTML` → **khâu hiển thị không cần sửa gì**.
- Vấn đề duy nhất: mở lại bài bằng Tiptap sẽ lược bỏ thẻ HTML không hỗ trợ,
  nên mỗi bài cần nhớ nó thuộc chế độ soạn thảo nào.

## Quyết định thiết kế

- **Nhập HTML = một chế độ soạn thảo**, không phải ô dán riêng. Dán thẳng vào
  textarea là nội dung được lưu y nguyên → không cần nút "Áp dụng".
- **Đánh dấu chế độ bằng cột DB** `content_format` (`richtext` | `html`).

## Thay đổi

### 1. Database — migration mới

File `supabase/migrations/003_posts_content_format.sql`:

```sql
ALTER TABLE posts
  ADD COLUMN content_format VARCHAR(20) DEFAULT 'richtext';
```

Chạy một lần trong Supabase SQL Editor. Bài cũ mặc định `richtext`.

### 2. API

- `POST /api/admin/posts` (`route.ts`): nhận `content_format` từ body, mặc
  định `'richtext'`, chèn vào bản ghi.
- `PATCH /api/admin/posts/[id]` (`[id]/route.ts`): passthrough `content_format`
  vào `updates` khi `!== undefined` (theo đúng pattern các trường khác).

### 3. UI — `src/components/admin/PostForm.tsx`

- Thêm `content_format: string` vào interface `PostData` và state, khởi tạo
  `initial?.content_format ?? 'richtext'` (edit page đã `select('*')` nên
  `initial` mang sẵn cột này).
- Thêm segmented control ở đầu khu nội dung:
  `[ ✎ Soạn thảo ]  [ </> HTML ]`, đổi giá trị `form.content_format`. Đổi chế
  độ **không** đụng tới `form.content` (giữ nguyên nội dung).
- Render theo chế độ:
  - `richtext` → `<PostEditor>` (Tiptap) như hiện tại.
  - `html` → `<textarea>` monospace nối trực tiếp `form.content` +
    khung xem trước bên dưới (`dangerouslySetInnerHTML`) để kiểm tra nhanh
    trước khi đăng.
- `content_format` được đưa vào `payload` khi `save()` (đã trải `...form`).

### 4. Hiển thị công khai

Không đổi. Bài `html` render giống hệt bài `richtext` vì cả hai đều là HTML.

## An toàn

- Chỉ admin (`requireAdmin`) mới ghi được `content` → HTML thô là nội dung tin
  cậy. Trang công khai vốn đã dùng `dangerouslySetInnerHTML` cho content; không
  mở rộng bề mặt rủi ro.

## Ngoài phạm vi (YAGNI)

- Không sanitize/lọc HTML (nội dung admin tin cậy).
- Không làm trình sửa HTML có syntax-highlight — `<textarea>` thuần là đủ.
- Không chuyển đổi hai chiều richtext↔html tự động.
```