# Hướng dẫn Deploy songthach.com lên VPS Long Vân

> Áp dụng cho VPS Ubuntu 22.04/24.04 tại Long Vân (longvan.net).
> Stack: Next.js 14 (standalone) + Supabase (cloud) + Nginx + PM2 + Let's Encrypt.

---

## 0. Chuẩn bị

- VPS Long Vân đã có IP public, SSH root.
- Domain `songthach.com` trỏ A record về IP VPS (cả `www` nếu dùng).
- **Chạy ĐỦ các migration trong Supabase SQL Editor, theo thứ tự** (idempotent, chạy lại an toàn):
  `001_init` → `002_posts` → `002_vouchers` → `003_court_blocks_recurring` → `004_security_rls` (BẮT BUỘC) → `005_bookings_schema_sync` → `006_gallery`.
- **Tạo Storage bucket `post-images`** (Dashboard → Storage → New bucket, đặt **Public**). Dùng chung cho ảnh bài viết VÀ Thư viện ảnh sân/cưới. Policies: chỉ tạo **SELECT cho public**, KHÔNG tạo INSERT/UPDATE/DELETE cho anon (ghi đi qua API admin bằng service role). Thiếu bucket này → upload ảnh sẽ lỗi.
- Tạo admin: trong bảng `users`, thêm dòng có `email` = email đăng nhập của bạn và `role` = 'admin' (hoặc đặt `ADMIN_EMAILS` trong env).

## 1. Bảo mật VPS cơ bản (làm NGAY sau khi nhận VPS)

```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Tạo user riêng, không chạy app bằng root
adduser deploy
usermod -aG sudo deploy

# SSH: tắt đăng nhập root + đổi sang key
# (copy key trước: ssh-copy-id deploy@IP)
nano /etc/ssh/sshd_config
#   PermitRootLogin no
#   PasswordAuthentication no
#   Port 22  (có thể đổi port để giảm scan tự động)
systemctl restart sshd

# Firewall UFW: chỉ mở SSH + HTTP + HTTPS
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status

# Fail2ban chống brute-force SSH
apt install -y fail2ban
systemctl enable --now fail2ban
```

> Lưu ý: KHÔNG mở port 3000 ra ngoài. App Next.js chỉ nghe localhost, Nginx làm reverse proxy.

## 2. Cài Node.js 20 LTS + PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

## 3. Đưa code lên VPS

```bash
# Cách 1: Git (khuyến nghị — đã có .gitignore chặn .env.local)
su - deploy
git clone <repo-url> ~/songthach
cd ~/songthach

# Cách 2: rsync từ máy local (Windows dùng WSL hoặc scp)
# rsync -avz --exclude node_modules --exclude .next --exclude .env.local ./ deploy@IP:~/songthach/
```

> ⚠️ Dự án hiện CHƯA phải git repo. Muốn dùng Cách 1 phải `git init` + tạo repo (GitHub/GitLab private) rồi push trước.
> Nếu dùng Cách 2 (rsync/scp): nhớ KHÔNG loại trừ thư mục `public/` (chứa ảnh QR KiotViet `public/images/cafe/*.png`), và **copy `.env.local` riêng** (đã bị loại trừ ở lệnh trên vì bảo mật) — sẽ điền ở bước 4.

## 4. Cấu hình env PRODUCTION

```bash
cd ~/songthach
cp .env.local.example .env.local
nano .env.local
```

Giá trị production cần đổi:

| Biến | Giá trị |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase thật |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key thật |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key thật — TUYỆT MẬT |
| `ADMIN_EMAILS` | email admin, phân cách dấu phẩy |
| `RESEND_API_KEY` | key Resend production |
| `RESEND_FROM_EMAIL` | `Song Thạch <noreply@songthach.com>` (cần verify domain trong Resend) |
| `NEXTAUTH_URL` | `https://songthach.com` |
| `VNPAY_RETURN_URL` | `https://songthach.com/api/payments/callback` |
| `VNPAY_URL` | URL production của VNPay (bỏ sandbox) khi go-live thanh toán |

```bash
chmod 600 .env.local   # chỉ chủ file đọc được
```

> Supabase Dashboard → Authentication → URL Configuration: thêm `https://songthach.com/auth/callback` vào Redirect URLs, đổi Site URL thành `https://songthach.com`.

## 5. Build & chạy bằng PM2

Project đã bật `output: 'standalone'` trong `next.config.mjs`:

```bash
cd ~/songthach
npm ci
npm run build

# Copy static assets vào bản standalone
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.local .next/standalone/.env.local

# Chạy bằng PM2
cd .next/standalone
pm2 start server.js --name songthach --env production
pm2 save
pm2 startup   # chạy lệnh nó in ra để tự khởi động cùng VPS
```

App nghe ở `http://127.0.0.1:3000` (mặc định). Kiểm tra: `curl -I http://127.0.0.1:3000`.

## 6. Nginx reverse proxy

```bash
apt install -y nginx
nano /etc/nginx/sites-available/songthach
```

```nginx
server {
    listen 80;
    server_name songthach.com www.songthach.com;

    # Giới hạn kích thước upload (ảnh bài viết tối đa 5MB + đệm)
    client_max_body_size 6m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/songthach /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

> Header `X-Forwarded-For` quan trọng: rate limit trong code đọc IP thật từ header này.

## 7. SSL miễn phí (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d songthach.com -d www.songthach.com
# Tự gia hạn đã được cài sẵn qua systemd timer; kiểm tra:
certbot renew --dry-run
```

Sau khi có SSL, header `Strict-Transport-Security` trong app sẽ có hiệu lực.

## 8. Rate limit thêm ở tầng Nginx (tuỳ chọn, khuyến nghị)

Thêm vào `/etc/nginx/nginx.conf` trong block `http {}`:

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

Và trong server block của songthach, trước `location /`:

```nginx
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 9. Cập nhật phiên bản mới

```bash
cd ~/songthach
git pull
npm ci
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.local .next/standalone/.env.local
pm2 restart songthach
```

## 10. Giám sát & backup

```bash
pm2 logs songthach          # xem log app
pm2 monit                   # CPU/RAM
journalctl -u nginx -f      # log nginx
```

- Database nằm trên Supabase cloud — bật Point-in-Time Recovery hoặc backup định kỳ trong Supabase Dashboard.
- Long Vân thường có snapshot VPS — bật snapshot tuần.

---

## Checklist bảo mật trước khi go-live

- [ ] Đã chạy ĐỦ migration `001` → `006` (đặc biệt `004_security_rls`, `005_bookings_schema_sync`, `006_gallery`)
- [ ] Storage bucket `post-images` đã tạo, Public, chỉ có policy SELECT cho anon
- [ ] Ảnh tĩnh `public/images/cafe/qr-*.png` đã được chuyển lên VPS (nằm trong bản build)
- [ ] Bảng `users` có đúng 1 dòng role='admin' (email của bạn); `ADMIN_EMAILS` đặt đúng
- [ ] Đăng nhập bằng email KHÔNG phải admin → vào `/admin` bị đẩy về trang chủ
- [ ] Chưa đăng nhập gọi `GET /api/admin/bookings` → trả 401
- [ ] `.env.local` không nằm trong Git (`git status` không thấy)
- [ ] `chmod 600 .env.local` trên VPS
- [ ] UFW chỉ mở 22/80/443; port 3000 KHÔNG truy cập được từ ngoài
- [ ] SSH chỉ đăng nhập bằng key, root login tắt
- [ ] HTTPS hoạt động, HTTP tự redirect sang HTTPS
- [ ] Supabase Redirect URLs đã thêm domain production
- [ ] Test đặt sân: sửa `total_price` trong request → server vẫn tính giá đúng
