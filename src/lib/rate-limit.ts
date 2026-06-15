import type { NextRequest } from 'next/server';

// Rate limit in-memory (sliding window) — phù hợp khi chạy 1 instance trên VPS.
// Nếu sau này scale nhiều instance, thay bằng Redis (ioredis / upstash).
const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 10_000;

export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();

  // Chống phình bộ nhớ
  if (buckets.size > MAX_BUCKETS) {
    buckets.forEach((arr, k) => {
      if (arr.length === 0 || now - arr[arr.length - 1] > windowMs) buckets.delete(k);
    });
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false; // vượt giới hạn
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}

/** Lấy IP client thật khi chạy sau Nginx reverse proxy (X-Forwarded-For). */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
