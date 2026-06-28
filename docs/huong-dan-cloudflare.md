# Hướng dẫn cài Cloudflare CDN cho songthach.com

> Miễn phí hoàn toàn. Tăng tốc + chống DDoS + che IP VPS.

---

## Bước 1: Tạo account Cloudflare
- Vào cloudflare.com → Sign Up (miễn phí)
- Chọn plan **Free**

## Bước 2: Thêm domain
- Dashboard → **Add a Site** → nhập `songthach.com`
- Chọn plan **Free** → Continue

## Bước 3: Kiểm tra DNS records
- Cloudflare tự scan DNS hiện tại và liệt kê
- Đảm bảo có **A record** trỏ về IP VPS Long Vân
- Cột **Proxy status** phải là **Proxied** (biểu tượng cam) — không phải DNS only (xám)
- Nhấn **Continue to activation**

## Bước 4: Đổi Nameserver tại nhà đăng ký domain
- Cloudflare cấp 2 nameserver, ví dụ:
  ```
  nina.ns.cloudflare.com
  roan.ns.cloudflare.com
  ```
- Vào nhà đăng ký domain (Tenten / Inet / NameCheap...) → quản lý `songthach.com`
- Xóa nameserver cũ, thêm 2 NS của Cloudflare
- Lưu lại → chờ 5–30 phút để DNS propagate

## Bước 5: Cấu hình SSL/TLS
- Cloudflare Dashboard → **SSL/TLS** → Overview
- Chọn mode: **Full (strict)**
  - Lý do: VPS đã có Let's Encrypt cert hợp lệ — Full strict đảm bảo HTTPS cả 2 đầu

## Bước 6: Cấu hình Cache
- **SSL/TLS** → Edge Certificates → bật **Always Use HTTPS**
- **Caching** → Configuration:
  - Browser Cache TTL: **1 year**
- **Caching** → Cache Rules → Create Rule:
  - Name: `Cache Next.js static`
  - URL pattern: `songthach.com/_next/static/*`
  - Cache status: **Cache Everything**
  - Edge Cache TTL: **1 month**

## Bước 7: Bật bảo mật
- **Security** → Settings:
  - Security Level: **Medium**
  - Bot Fight Mode: **ON**
- DDoS protection: tự động bật miễn phí

## Bước 8: Kiểm tra
```bash
curl -I https://songthach.com/api/health
```
Kết quả phải thấy header `CF-Ray: ...` — xác nhận traffic đang đi qua Cloudflare.

---

## Lưu ý
- Let's Encrypt trên VPS vẫn giữ nguyên (không cần xóa)
- Nếu đổi IP VPS sau này: chỉ cần sửa A record trong Cloudflare Dashboard — không cần đổi NS lại
- IP VPS thật bị che, bảo vệ khỏi scan và DDoS trực tiếp
