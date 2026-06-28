# System Infrastructure Upgrade — Design Spec

**Date:** 2026-06-28
**Scope:** Nâng cấp hạ tầng Song Thạch để phục vụ ~200 users/ngày
**Approach:** Incremental — từng phần độc lập, không gây downtime

---

## Bối cảnh

Web Song Thạch đang chạy production trên VPS Long Vân (Ubuntu, Nginx, PM2, Next.js standalone). Audit kiến trúc xác định 5 thành phần cần bổ sung theo thứ tự ưu tiên:

1. Cache HTTP headers cho static assets
2. Health check endpoint
3. CI/CD tự động qua GitHub Actions
4. Backup database tự động
5. Cloudflare CDN + hướng dẫn Sentry

Load Balancer và Redis **không cần** ở quy mô 200 users/ngày.

---

## Phần 1: Cache HTTP Headers

### Vấn đề
`next.config.mjs` hiện chỉ có security headers. Static assets (`/_next/static/*`) và ảnh public không có `Cache-Control` header — trình duyệt phải tải lại mỗi lần.

### Giải pháp
Thêm 2 rule vào `headers()` trong `next.config.mjs`:

| Route | Header | Giá trị | Lý do |
|---|---|---|---|
| `/_next/static/(.*)` | `Cache-Control` | `public, max-age=31536000, immutable` | Next.js hash tên file, URL đổi khi code đổi |
| `/images/(.*)` | `Cache-Control` | `public, max-age=2592000` | Ảnh tĩnh, 30 ngày |

API routes (`/api/*`) giữ nguyên — không cache.

---

## Phần 2: Health Check Endpoint

### Vấn đề
Không có endpoint để monitor biết app còn sống. PM2 chỉ check process, không check HTTP.

### Giải pháp
Tạo `src/app/api/health/route.ts`:

```
GET /api/health
→ 200 { status: "ok", timestamp: "ISO8601", version: "0.1.0" }
```

- Không cần auth
- Không query database (tránh false negative khi DB chậm)
- Dùng được với Uptime Robot (free), PM2 health check, hoặc Nginx `proxy_next_upstream`

---

## Phần 3: CI/CD GitHub Actions

### Vấn đề
Deploy thủ công: SSH vào VPS, chạy 6–7 lệnh, dễ quên bước, mất 5–10 phút mỗi lần.

### Giải pháp
File `.github/workflows/deploy.yml` — trigger khi push vào `main`.

**Luồng:**
```
push main
  → GitHub Actions runner
    → SSH vào VPS (deploy user)
      → git pull origin main
      → npm ci
      → npm run build
      → cp -r .next/static .next/standalone/.next/static
      → cp -r public .next/standalone/public
      → cp .env.local .next/standalone/.env.local
      → pm2 restart songthach
```

**Secrets cần thêm vào GitHub (1 lần):**
| Secret | Giá trị |
|---|---|
| `VPS_HOST` | IP VPS Long Vân |
| `VPS_USER` | `deploy` (user non-root) |
| `VPS_SSH_KEY` | Private key SSH riêng cho CI |
| `VPS_PORT` | `22` (hoặc port đã đổi) |

**SSH key:** Tạo key riêng cho CI (`ssh-keygen -t ed25519 -C "github-actions"`), KHÔNG dùng key cá nhân. Public key thêm vào `~/.ssh/authorized_keys` trên VPS.

**Rollback:** Nếu build thất bại, PM2 giữ nguyên version cũ — không downtime. `pm2 restart` chỉ chạy sau khi build thành công.

---

## Phần 4: Backup Script

### Vấn đề
Database nằm trên Supabase cloud — Supabase tự backup nhưng không có quy trình documented, không có bản backup local/off-site.

### Giải pháp
Script `scripts/backup.sh` chạy cron hàng ngày lúc 2:00 AM trên VPS:

```
pg_dump (Supabase connection string)
  → nén .sql.gz
  → lưu vào ~/backups/backup-YYYY-MM-DD.sql.gz
  → xóa file > 30 ngày
```

**Yêu cầu:**
- `postgresql-client` cài trên VPS
- `DATABASE_URL` (Supabase connection string dạng `postgres://...`) trong file `.env.backup` trên VPS (không commit vào git)
- Cron: `0 2 * * * /home/deploy/songthach/scripts/backup.sh >> /home/deploy/backups/backup.log 2>&1`

**Giữ 30 bản** — xóa tự động sau 30 ngày để không đầy ổ.

---

## Phần 5a: Cloudflare CDN

### Vấn đề
Domain trỏ thẳng IP VPS — không có edge cache, không có DDoS protection.

### Giải pháp (hướng dẫn — không tự động hóa được)
1. Đăng ký miễn phí tại cloudflare.com
2. Thêm domain `songthach.com`
3. Đổi nameserver tại nhà đăng ký domain sang nameserver Cloudflare
4. Cấu hình:
   - Proxy status: **Proxied** (cam) cho A record
   - SSL/TLS mode: **Full (strict)**
   - Cache rules: cache static assets `/_next/static/*` tại edge
   - Browser Cache TTL: 1 năm cho static
5. Tắt Let's Encrypt trên VPS nếu dùng Cloudflare SSL (hoặc giữ cả hai)

**Lợi ích:** CDN edge Việt Nam, che IP VPS, DDoS mitigation, analytics miễn phí.

---

## Phần 5b: Sentry Monitoring

### Vấn đề
Không có error tracking — lỗi production chỉ biết khi user báo.

### Giải pháp
- Cài `@sentry/nextjs`
- Tạo `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- Thêm `withSentryConfig` vào `next.config.mjs`
- `SENTRY_DSN` thêm vào `.env.local`

**Yêu cầu:** Bạn tạo account miễn phí tại sentry.io, tạo project "Next.js", copy DSN.

Free tier: 5,000 errors/tháng — đủ cho 200 users/ngày.

---

## Thứ tự thực hiện

1. Cache headers + Health check (1 commit, deploy ngay)
2. CI/CD GitHub Actions (1 commit + thiết lập secrets 1 lần)
3. Backup script (1 commit + cài cron 1 lần trên VPS)
4. Sentry (1 commit, sau khi bạn tạo account)
5. Cloudflare (hướng dẫn từng bước, cần truy cập DNS)

---

## Không nằm trong scope

- Load Balancer — không cần < 1,000 users/ngày
- Redis — ISR 60s + Nginx cache đủ ở quy mô này
- Docker/Kubernetes — overkill cho 1 VPS
- GraphQL — REST đang hoạt động tốt
