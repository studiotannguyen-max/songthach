# Sổ Thu Chi (quản lý tài chính) trong admin

## Bối cảnh

Chủ shop và nhân viên hiện quản lý thu/chi bằng file Excel riêng
(`D:\SHEETAPP\SÂN BANH 2026 BAN MOI UP SHEET.xlsx`, sheet "Sổ Thu Chi"),
nhập tay từng dòng: ngày, loại (Thu/Chi), diễn giải, số tiền thu, số tiền chi, số dư
luỹ kế, ghi chú. Booking online trong web hiện tại chỉ dùng để tránh trùng lịch sân
— khách hàng book online hay nhân viên nhận đặt qua điện thoại vẫn tách biệt với
việc ghi nhận thu/chi thật, nên **không** lấy dữ liệu từ bảng `bookings`/`payments`
để tự tính doanh thu.

Mục tiêu: đưa sổ thu chi này vào admin web, nhân viên nhập liệu trực tiếp thay cho
Excel, có báo cáo theo tháng và xuất Excel.

## Thiết kế

### 1. Bảng `finance_entries` (migration `010_finance_entries.sql`)

```sql
CREATE TABLE finance_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date  DATE NOT NULL,
  type        VARCHAR(10) NOT NULL CHECK (type IN ('thu', 'chi')),
  category    VARCHAR(20) CHECK (category IN ('luong', 'dien_nuoc', 'dung_cu', 'sua_chua', 'khac')),
  description TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE finance_entries ENABLE ROW LEVEL SECURITY;
-- Không tạo policy nào cho anon/authenticated — chỉ service role (admin API) truy cập,
-- giống payments/court_blocks ở 004_security_rls.sql.
```

- `category` chỉ áp dụng cho `type = 'chi'`; API sẽ ép về `NULL` khi `type = 'thu'`.
- Không có cột lưu số dư — số dư luôn tính động (xem mục 2) để tránh lệch dữ liệu
  khi có sửa/xoá dòng cũ.
- Không thêm role "nhân viên" riêng — dự án hiện chỉ có một tầng quyền admin
  (`isAdminUser` trong `src/lib/admin-check.ts`); nhân viên dùng chung tài khoản/đăng
  nhập admin hiện có. Việc phân quyền chi tiết hơn (nếu cần) sẽ là spec riêng.

### 2. API (`src/app/api/admin/finance/`)

Tất cả route dùng `requireAdmin()` + `createAdminClient()` như các route admin khác
(xem `src/app/api/admin/vouchers/route.ts` làm mẫu).

- **`GET /api/admin/finance?month=YYYY-MM`**
  - Lấy toàn bộ `finance_entries` sắp theo `entry_date, created_at` tăng dần (cần
    toàn bộ lịch sử để tính đúng số dư luỹ kế), tính `balance` chạy dần trong JS:
    `balance += type === 'thu' ? amount : -amount`.
  - Lọc lại chỉ những dòng có `entry_date` thuộc tháng `month` (default: tháng hiện
    tại) để trả về, nhưng giữ đúng giá trị `balance` đã tính (không tính lại từ đầu
    tháng).
  - Trả về: `{ entries: [...{ ...row, balance }], totalThu, totalChi, balanceAtMonthEnd }`
    — `totalThu`/`totalChi` là tổng của riêng các dòng trong tháng được lọc;
    `balanceAtMonthEnd` là `balance` của dòng cuối cùng thuộc tháng đó (hoặc số dư
    trước đó nếu tháng không có dòng nào).
- **`POST /api/admin/finance`** — body `{ entry_date, type, category?, description, amount, note? }`.
  Validate: `amount > 0`, `type` hợp lệ, `category` chỉ nhận khi `type === 'chi'`.
- **`PATCH /api/admin/finance/[id]`** — sửa một dòng, cùng validate như POST.
- **`DELETE /api/admin/finance/[id]`** — xoá một dòng.
- **`GET /api/admin/finance/export?month=YYYY-MM`** — trả file `.xlsx` (header
  `Content-Disposition: attachment; filename="so-thu-chi-YYYY-MM.xlsx"`), layout
  giống sheet hiện tại: cột Ngày | Loại | Diễn giải | Thu (VNĐ) | Chi (VNĐ) | Số Dư | Ghi Chú.
  Dùng lại đúng logic tính balance ở trên. Cần thêm dependency **`xlsx`** (SheetJS) —
  project chưa có lib xuất Excel nào.

### 3. UI

- **Sidebar** (`src/app/admin/layout.tsx`): thêm mục "Tài chính" vào mảng `NAV`,
  icon `Wallet` (lucide-react), route `/admin/finance`, đặt sau "Đặt sân".
- **`src/app/admin/finance/page.tsx`** (client component, theo đúng pattern
  `useState`/`useEffect`/`fetch` như `src/app/admin/bookings/page.tsx`):
  - Bộ chọn tháng dạng `◀ Tháng 7/2026 ▶` ở đầu trang.
  - 3 ô thống kê: "Tổng thu tháng này", "Tổng chi tháng này", "Số dư luỹ kế"
    (dùng `formatCurrency` từ `src/lib/utils.ts`, tô xanh cho thu/dư dương, đỏ cho chi).
  - Nút "+ Thêm giao dịch" mở modal (component mới `src/components/admin/FinanceEntryModal.tsx`,
    theo style `RecurringBookingModal.tsx`): toggle Thu/Chi, ngày, diễn giải, số tiền,
    dropdown danh mục (chỉ hiện khi chọn Chi: Lương, Điện nước, Dụng cụ sân, Sửa chữa, Khác),
    ghi chú. Dùng chung modal này cho cả tạo mới và sửa (props `initialData?`).
  - Bảng danh sách: Ngày | Loại (badge màu) | Diễn giải | Danh mục (chỉ hiện với Chi)
    | Số tiền (+/- màu xanh/đỏ) | Số dư | Ghi chú | Thao tác (Sửa/Xoá — xoá dùng
    `window.confirm` trước khi gọi API, đúng pattern đã dùng ở `admin/venues`,
    `admin/gallery`, `admin/posts`, `admin/vouchers`).
  - Nút "Xuất Excel" cạnh bộ chọn tháng, trigger tải file từ endpoint export ở trên.
  - Trạng thái rỗng khi tháng không có giao dịch nào (không lỗi).

## Ngoài phạm vi

- Không tự sinh dòng "Thu" từ bảng `bookings`/`payments` — nhập tay hoàn toàn theo
  đúng yêu cầu, giống Excel hiện tại.
- Không hỗ trợ nhiều lần thu cho 1 booking (đặt cọc + thanh toán còn lại) — mỗi
  booking chỉ có khái niệm 1 lần thu, và ở đây thậm chí không liên kết với booking.
- Không thêm role/quyền "nhân viên" riêng biệt với "admin".
- Không import lại dữ liệu lịch sử từ file Excel — chỉ là ứng dụng mới bắt đầu ghi
  nhận từ lúc triển khai (import dữ liệu cũ, nếu cần, sẽ bàn riêng).
