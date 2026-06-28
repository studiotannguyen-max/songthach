# System Infrastructure Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng cấp hạ tầng Song Thạch với cache headers, health check, CI/CD tự động, backup DB, và hướng dẫn Cloudflare/Sentry — phục vụ ~200 users/ngày.

**Architecture:** Incremental — 5 task độc lập, mỗi task có thể deploy riêng. Không có downtime. Task 1–3 là code thuần; Task 4 cần account Sentry; Task 5 là hướng dẫn Cloudflare (không tự động hóa được).

**Tech Stack:** Next.js 14 App Router, TypeScript, Nginx (VPS), PM2, GitHub Actions, @sentry/nextjs

## Global Constraints

- Node.js 20 LTS trên VPS
- Next.js 14 với App Router (không dùng Pages Router)
- File API routes đặt tại `src/app/api/**` với `NextRequest`/`NextResponse`
- Không có test framework — verify bằng `curl` và `npm run build`
- Deploy target: VPS Long Vân, user `deploy`, app tại `~/songthach`
- GitHub repo: `github.com/studiotannguyen-max/songthach`
- PM2 app name: `songthach`

---

## Task 1: Cache HTTP Headers + Health Check Endpoint

**Files:**
- Modify: `next.config.mjs`
- Create: `src/app/api/health/route.ts`

**Interfaces:**
- Produces: `GET /api/health` → `{ status: "ok", timestamp: string, version: string }`

- [ ] **Step 1: Thêm cache headers vào `next.config.mjs`**

Mở `next.config.mjs`. Thêm 2 rule vào mảng trả về trong `headers()`, đặt SAU rule security headers hiện có:

```js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
    {
      // Static assets Next.js: hash trong tên file, immutable 1 năm
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Ảnh tĩnh trong /public/images/
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=2592000',
        },
      ],
    },
  ];
},
```

- [ ] **Step 2: Tạo health check endpoint**

Tạo file `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  });
}
```

- [ ] **Step 3: Build để kiểm tra không có lỗi TypeScript**

```bash
npm run build
```

Expected: build thành công, không có lỗi. Nếu có lỗi → sửa trước khi tiếp.

- [ ] **Step 4: Chạy dev server và test health endpoint**

```bash
npm run dev
```

Mở terminal khác:

```bash
curl http://localhost:3000/api/health
```

Expected output:
```json
{"status":"ok","timestamp":"2026-06-28T...","version":"0.1.0"}
```

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs src/app/api/health/route.ts
git commit -m "feat: add cache headers for static assets and health check endpoint"
```

---

## Task 2: CI/CD GitHub Actions

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: GitHub Secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`
- Produces: Auto-deploy khi push vào `main`

- [ ] **Step 1: Tạo thư mục và file workflow**

```bash
mkdir -p .github/workflows
```

Tạo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            cd ~/songthach
            git pull origin main
            npm ci
            npm run build
            cp -r .next/static .next/standalone/.next/static
            cp -r public .next/standalone/public
            cp .env.local .next/standalone/.env.local
            pm2 restart songthach
            echo "Deploy complete at $(date)"
```

- [ ] **Step 2: Tạo SSH key riêng cho CI (chạy trên máy local hoặc VPS)**

Chạy lệnh này trên máy local (Windows Git Bash hoặc WSL):

```bash
ssh-keygen -t ed25519 -C "github-actions-songthach" -f ~/.ssh/songthach_ci -N ""
```

Lệnh tạo ra 2 file:
- `~/.ssh/songthach_ci` — private key (thêm vào GitHub Secrets)
- `~/.ssh/songthach_ci.pub` — public key (thêm vào VPS)

- [ ] **Step 3: Thêm public key vào VPS**

SSH vào VPS với key hiện tại, rồi chạy:

```bash
# Trên máy local: in public key ra
cat ~/.ssh/songthach_ci.pub
# Copy toàn bộ output

# SSH vào VPS
ssh deploy@<VPS_IP>

# Trên VPS: thêm public key
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test: thoát VPS rồi test SSH bằng key mới
exit
ssh -i ~/.ssh/songthach_ci deploy@<VPS_IP> "echo 'CI key works'"
```

Expected: in ra `CI key works` mà không hỏi mật khẩu.

- [ ] **Step 4: Thêm Secrets vào GitHub**

Vào `github.com/studiotannguyen-max/songthach` → Settings → Secrets and variables → Actions → New repository secret.

Thêm lần lượt 4 secrets:

| Name | Value |
|---|---|
| `VPS_HOST` | IP VPS Long Vân (ví dụ `103.x.x.x`) |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Nội dung file `~/.ssh/songthach_ci` (private key, bắt đầu bằng `-----BEGIN OPENSSH PRIVATE KEY-----`) |
| `VPS_PORT` | `22` (hoặc port SSH đã đổi) |

- [ ] **Step 5: Commit và push để test CI**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions CI/CD auto-deploy to VPS"
git push origin main
```

- [ ] **Step 6: Kiểm tra CI chạy thành công**

Vào `github.com/studiotannguyen-max/songthach` → tab **Actions**.

Expected: thấy workflow "Deploy to VPS" đang chạy (màu vàng) rồi chuyển xanh ✅.

Nếu đỏ ❌: click vào job để xem log lỗi. Lỗi phổ biến:
- `Permission denied` → public key chưa thêm đúng vào VPS
- `Host key verification failed` → thêm `StrictHostKeyChecking no` vào ssh options trong workflow (xem bước sửa bên dưới)

Nếu lỗi host key, sửa `deploy.yml` thêm option:

```yaml
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          script_stop: true
          options: "-o StrictHostKeyChecking=no"
```

---

## Task 3: Backup Script

**Files:**
- Create: `scripts/backup.sh`

**Interfaces:**
- Consumes: `DATABASE_URL` từ file `.env.backup` trên VPS (không commit)
- Produces: `~/backups/backup-YYYY-MM-DD.sql.gz` trên VPS, giữ 30 ngày

- [ ] **Step 1: Tạo thư mục scripts**

```bash
mkdir -p scripts
```

- [ ] **Step 2: Tạo `scripts/backup.sh`**

```bash
#!/bin/bash
set -euo pipefail

# Load DATABASE_URL từ file env riêng (không phải .env.local của app)
ENV_FILE="$HOME/.env.backup"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Create it with DATABASE_URL=postgres://..."
  exit 1
fi
source "$ENV_FILE"

BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y-%m-%d)
FILENAME="backup-${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/$FILENAME"
echo "[$(date)] Backup saved: $BACKUP_DIR/$FILENAME"

# Xóa backup cũ hơn 30 ngày
find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +30 -delete
echo "[$(date)] Old backups cleaned."
```

- [ ] **Step 3: Commit script**

```bash
git add scripts/backup.sh
git commit -m "feat: add daily database backup script"
```

- [ ] **Step 4: Thiết lập trên VPS (làm 1 lần)**

SSH vào VPS, rồi chạy:

```bash
# Cài postgresql-client để có pg_dump
sudo apt install -y postgresql-client

# Tạo file env chứa connection string Supabase
# Lấy DATABASE_URL tại: Supabase Dashboard → Settings → Database → Connection string → URI
nano ~/.env.backup
# Thêm dòng: DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

chmod 600 ~/.env.backup

# Đặt quyền execute cho script
chmod +x ~/songthach/scripts/backup.sh

# Test chạy thử
~/songthach/scripts/backup.sh

# Kiểm tra file được tạo
ls -lh ~/backups/
```

Expected: thấy file `backup-2026-06-28.sql.gz`.

- [ ] **Step 5: Cài cron job**

```bash
crontab -e
```

Thêm dòng cuối file (chạy lúc 2:00 AM mỗi ngày):

```
0 2 * * * /home/deploy/songthach/scripts/backup.sh >> /home/deploy/backups/backup.log 2>&1
```

Lưu và thoát. Kiểm tra:

```bash
crontab -l
```

Expected: thấy dòng cron vừa thêm.

---

## Task 4: Sentry Error Monitoring

> **Yêu cầu trước:** Bạn phải tạo account miễn phí tại sentry.io, tạo project "Next.js", và copy DSN (dạng `https://xxx@oyyy.ingest.sentry.io/zzz`).

**Files:**
- Modify: `package.json` (qua npm install)
- Modify: `next.config.mjs`
- Create: `sentry.client.config.ts`
- Create: `sentry.server.config.ts`
- Create: `sentry.edge.config.ts`
- Modify: `.env.local` (thêm SENTRY_DSN)

**Interfaces:**
- Consumes: `SENTRY_DSN` env var
- Produces: Error tracking tự động gửi về Sentry dashboard

- [ ] **Step 1: Cài @sentry/nextjs**

```bash
npm install @sentry/nextjs
```

- [ ] **Step 2: Tạo `sentry.client.config.ts`**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
});
```

- [ ] **Step 3: Tạo `sentry.server.config.ts`**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
});
```

- [ ] **Step 4: Tạo `sentry.edge.config.ts`**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
});
```

- [ ] **Step 5: Wrap next config với `withSentryConfig` trong `next.config.mjs`**

Sửa `next.config.mjs` — thêm import và wrap export:

```js
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const securityHeaders = [
  // ... giữ nguyên toàn bộ mảng securityHeaders hiện có ...
];

const nextConfig = {
  // ... giữ nguyên toàn bộ nextConfig hiện có ...
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: 'YOUR_SENTRY_ORG',       // tên org trong Sentry
  project: 'YOUR_SENTRY_PROJECT', // tên project trong Sentry
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
```

Thay `YOUR_SENTRY_ORG` và `YOUR_SENTRY_PROJECT` bằng giá trị thật từ Sentry dashboard (Settings → General).

- [ ] **Step 6: Thêm SENTRY_DSN vào `.env.local`**

Mở `.env.local`, thêm vào cuối:

```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
```

Thay bằng DSN thật từ Sentry → Settings → Client Keys.

- [ ] **Step 7: Build để kiểm tra**

```bash
npm run build
```

Expected: build thành công. Nếu thấy warning về Sentry source maps — bình thường, không phải lỗi.

- [ ] **Step 8: Test Sentry nhận được lỗi**

Tạm thêm dòng này vào `src/app/api/health/route.ts` để test (xóa sau):

```typescript
// Test Sentry — XÓA SAU KHI TEST
import * as Sentry from '@sentry/nextjs';
Sentry.captureException(new Error('Test Sentry từ Song Thạch'));
```

Chạy `npm run dev`, gọi `curl http://localhost:3000/api/health`, vào Sentry dashboard kiểm tra Issues.

Sau khi thấy lỗi test xuất hiện trong Sentry → xóa dòng test đó.

- [ ] **Step 9: Thêm SENTRY_DSN vào VPS .env.local**

SSH vào VPS:

```bash
nano ~/songthach/.env.local
# Thêm: NEXT_PUBLIC_SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
nano ~/songthach/.next/standalone/.env.local
# Thêm dòng tương tự
```

- [ ] **Step 10: Commit**

```bash
git add sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts next.config.mjs package.json package-lock.json
git commit -m "feat: add Sentry error monitoring"
git push origin main
```

---

## Task 5: Hướng dẫn Cloudflare CDN

> Task này là tài liệu hướng dẫn — không có code changes. Bạn thực hiện thủ công trên Cloudflare dashboard.

**Files:**
- Create: `docs/huong-dan-cloudflare.md`

- [ ] **Step 1: Tạo tài liệu hướng dẫn Cloudflare**

Tạo `docs/huong-dan-cloudflare.md`:

```markdown
# Hướng dẫn cài Cloudflare CDN cho songthach.com

## Bước 1: Tạo account Cloudflare
- Vào cloudflare.com → Sign Up (miễn phí)
- Chọn plan Free

## Bước 2: Thêm domain
- Dashboard → Add a Site → nhập `songthach.com`
- Chọn plan Free → Continue

## Bước 3: Cloudflare scan DNS records
- Cloudflare tự scan và liệt kê DNS records hiện tại
- Kiểm tra có A record trỏ về IP VPS Long Vân không
- Đảm bảo cột **Proxy** của A record đang là **Proxied** (cam) — không phải DNS only (xám)
- Nhấn Continue

## Bước 4: Đổi Nameserver tại nhà đăng ký domain
- Cloudflare cho 2 nameserver, ví dụ: `nina.ns.cloudflare.com` và `roan.ns.cloudflare.com`
- Vào nhà đăng ký domain (Tenten, Inet, Godaddy...) → quản lý domain `songthach.com`
- Đổi Nameserver từ NS hiện tại sang 2 NS của Cloudflare
- Lưu lại
- Chờ 5–30 phút để DNS propagate toàn cầu

## Bước 5: Cấu hình SSL/TLS
- Cloudflare Dashboard → SSL/TLS → Overview
- Chọn **Full (strict)** — vì VPS đã có Let's Encrypt cert hợp lệ

## Bước 6: Cấu hình Cache
- Cloudflare Dashboard → Caching → Configuration
- Browser Cache TTL: **1 year**
- Cloudflare Dashboard → Caching → Cache Rules → Create Rule:
  - URL: `songthach.com/_next/static/*`
  - Cache Status: **Cache Everything**
  - Edge Cache TTL: **1 month**

## Bước 7: Bật tính năng bảo mật
- Security → Settings:
  - Security Level: **Medium**
  - Bot Fight Mode: **ON**
- DDoS: tự động bật miễn phí

## Kiểm tra
```bash
curl -I https://songthach.com/api/health
```
Kết quả nên thấy header `CF-Ray: ...` — xác nhận traffic đi qua Cloudflare.

## Lưu ý
- Sau khi bật Cloudflare, Let's Encrypt trên VPS vẫn giữ (không cần xóa)
- Nếu cần đổi IP VPS sau này: cập nhật A record trong Cloudflare Dashboard (không cần đổi NS nữa)
```

- [ ] **Step 2: Commit tài liệu**

```bash
git add docs/huong-dan-cloudflare.md
git commit -m "docs: add Cloudflare CDN setup guide"
git push origin main
```

- [ ] **Step 3: Thực hiện các bước trong tài liệu**

Làm theo `docs/huong-dan-cloudflare.md` trên Cloudflare dashboard.

Sau khi xong, test:

```bash
curl -I https://songthach.com/api/health
```

Expected: response có header `CF-Ray: ...`
```

---

## Thứ tự thực hiện gợi ý

1. Task 1 (Cache + Health) — 15 phút, không rủi ro
2. Task 2 (CI/CD) — 20 phút + thiết lập secrets 1 lần
3. Task 3 (Backup) — 10 phút code + 10 phút cài VPS
4. Task 4 (Sentry) — 20 phút, cần tạo account trước
5. Task 5 (Cloudflare) — 15 phút, làm sau cùng khi mọi thứ ổn định
