# Hướng dẫn Deploy Song Thạch lên VPS Longvan

**VPS:** 42.96.18.163 | 1 Core | 2GB RAM | 50GB Storage | Ubuntu  
**Stack:** Next.js + PM2 + Nginx + Supabase (giữ nguyên)

---

## Tổng quan kiến trúc

```
Máy bạn (Windows)
    ↓ push code
GitHub (repo private)
    ↓ git pull
VPS 42.96.18.163
    ├── Nginx (cổng 80/443, nhận request từ internet)
    ├── Next.js app (PM2, chạy nền ở cổng 3000)
    └── .env.local (chứa key Supabase, Resend...)
```

---

## BƯỚC 1 — Đưa code lên GitHub (làm trên máy Windows)

> Chỉ làm 1 lần duy nhất

Mở PowerShell tại thư mục `d:\songthach`:

```powershell
git init
git add .
git commit -m "first commit"
```

Vào **github.com** → đăng nhập → **New repository**:
- Repository name: `songthach`
- Chọn **Private**
- Nhấn **Create repository**

Sau khi tạo xong, GitHub sẽ hiện lệnh — chạy tiếp trong PowerShell:

```powershell
git remote add origin https://github.com/TEN_BAN_GITHUB/songthach.git
git push -u origin main
```

> Thay `TEN_BAN_GITHUB` bằng username GitHub của bạn

---

## BƯỚC 2 — SSH vào VPS

Mở PowerShell trên máy Windows:

```powershell
ssh root@42.96.18.163
```

Nhập password Longvan đã gửi qua email khi mua VPS.

---

## BƯỚC 3 — Cài phần mềm cần thiết (chỉ làm 1 lần)

Sau khi đã SSH vào VPS, chạy từng lệnh:

```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Kiểm tra đã cài thành công
node -v
npm -v

# Cài PM2 — giữ app chạy nền 24/7
npm install -g pm2

# Cài Nginx — nhận request từ internet
apt install -y nginx git
```

---

## BƯỚC 4 — Kéo code từ GitHub về VPS

```bash
cd /var/www
git clone https://github.com/TEN_BAN_GITHUB/songthach.git
cd songthach
npm install
```

> Bước `npm install` mất khoảng 1-2 phút

---

## BƯỚC 5 — Tạo file cấu hình môi trường (.env)

```bash
nano /var/www/songthach/.env.local
```

Dán nội dung sau vào (sửa các giá trị có dấu `← ĐỔI`):

```env
# Supabase — giữ nguyên, copy từ file .env.local trên máy bạn
NEXT_PUBLIC_SUPABASE_URL=https://tqhihuvpjegjmbbokcfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZwpbVs15XuFAjeJDK2Upxg_LLktZDRK
SUPABASE_SERVICE_ROLE_KEY=sb_secret_n1cLS0QTeOy8D5L9OFzR9Q_sR2CczlN

# Bảo mật session — tự nghĩ 1 chuỗi dài bất kỳ, VD: songthach2026secretkey!@#$%
NEXTAUTH_SECRET=songthach2026secretkey_tự_đặt_ít_nhất_32_ký_tự   ← ĐỔI
NEXTAUTH_URL=http://42.96.18.163

# Email Resend — lấy từ resend.com (xem hướng dẫn riêng)
RESEND_API_KEY=re_xxxxxxxxxxxx   ← ĐỔI
ADMIN_EMAIL=email_của_bạn@gmail.com   ← ĐỔI
```

**Lưu file:** nhấn `Ctrl+O` → Enter → `Ctrl+X`

---

## BƯỚC 6 — Build và khởi động app

```bash
cd /var/www/songthach

# Build Next.js (mất 3-5 phút, RAM 2GB đủ dùng)
NODE_OPTIONS=--max-old-space-size=1536 npm run build

# Chạy app bằng PM2
pm2 start npm --name "songthach" -- start

# Lưu cấu hình PM2
pm2 save

# Cài PM2 tự khởi động khi VPS reboot
pm2 startup
```

> Sau lệnh `pm2 startup`, nó sẽ in ra 1 lệnh bắt đầu bằng `sudo env PATH=...`
> Copy lệnh đó và chạy tiếp

---

## BƯỚC 7 — Cấu hình Nginx

```bash
nano /etc/nginx/sites-available/songthach
```

Dán vào:

```nginx
server {
    listen 80;
    server_name 42.96.18.163;

    # Giới hạn upload ảnh tối đa 20MB
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Lưu file:** `Ctrl+O` → Enter → `Ctrl+X`

```bash
# Kích hoạt cấu hình
ln -s /etc/nginx/sites-available/songthach /etc/nginx/sites-enabled/

# Kiểm tra cú pháp
nginx -t

# Nếu in ra "syntax is ok" thì reload
systemctl reload nginx
```

---

## BƯỚC 8 — Kiểm tra

Mở trình duyệt, vào địa chỉ: **http://42.96.18.163**

Website sẽ hiện ra. Nếu không hiện, kiểm tra bằng lệnh:

```bash
pm2 logs songthach    # xem log lỗi của app
pm2 status            # kiểm tra app có đang chạy không
```

---

## Khi cập nhật code mới (các lần sau)

Trên **máy Windows** — push code mới lên GitHub:

```powershell
git add .
git commit -m "mô tả thay đổi"
git push
```

Trên **VPS** — kéo về và build lại:

```bash
cd /var/www/songthach
git pull
npm run build
pm2 restart songthach
```

---

## Thêm tên miền + HTTPS (sau khi có domain)

Nếu bạn đã mua tên miền (VD: `songthach.vn`), làm thêm 2 bước:

**1. Trỏ DNS:** Vào nơi quản lý domain → thêm record:
```
Type: A
Name: @
Value: 42.96.18.163
```

**2. Cài SSL miễn phí (Let's Encrypt):**

```bash
apt install -y certbot python3-certbot-nginx

# Thay songthach.vn bằng domain thật của bạn
certbot --nginx -d songthach.vn -d www.songthach.vn
```

Sau đó cập nhật `.env.local`:
```
NEXTAUTH_URL=https://songthach.vn
```

Rồi build lại: `npm run build && pm2 restart songthach`

---

## Lệnh PM2 hay dùng

| Lệnh | Tác dụng |
|---|---|
| `pm2 status` | Xem app đang chạy không |
| `pm2 logs songthach` | Xem log lỗi |
| `pm2 restart songthach` | Khởi động lại app |
| `pm2 stop songthach` | Dừng app |

---

## Lưu ý quan trọng

- **KHÔNG** đưa file `.env.local` lên GitHub — file `.gitignore` đã chặn sẵn
- Khi đổi bất kỳ biến môi trường nào trong `.env.local` → phải chạy `npm run build` và `pm2 restart songthach` lại
- Backup `.env.local` ra nơi an toàn (file này chứa key quan trọng)
