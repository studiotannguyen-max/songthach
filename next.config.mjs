/** @type {import('next').NextConfig} */

// Security headers áp dụng cho mọi route
const securityHeaders = [
  // Chặn nhúng site vào iframe (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Chặn đoán MIME type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Hạn chế gửi referrer ra ngoài
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Tắt các API trình duyệt không dùng
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Ép HTTPS 2 năm (chỉ có hiệu lực khi đã chạy HTTPS qua Nginx + SSL)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Bảo vệ XSS cơ bản cho trình duyệt cũ
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];

const nextConfig = {
  // Ẩn header "X-Powered-By: Next.js"
  poweredByHeader: false,

  // Build standalone — tối ưu deploy VPS (chỉ cần copy .next/standalone)
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    // Tree-shaking tốt hơn cho các package lớn, giảm bundle size
    optimizePackageImports: ['lucide-react', '@tiptap/react', '@tiptap/starter-kit'],
    // Bật instrumentation hook (src/instrumentation.ts) — cấu hình mạng lúc server khởi động
    instrumentationHook: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Bản chạy thật: tên file có hash nên cache vĩnh viễn là đúng.
        // Lúc `next dev --turbo`: tên file KHÔNG đổi khi nội dung đổi, để immutable thì
        // trình duyệt bám bản cũ mãi — sửa CSS/JS xong màn hình không đổi, hoặc tệ hơn là
        // trộn chunk cũ với chunk mới rồi vỡ lúc chạy.
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production'
              ? 'public, max-age=31536000, immutable'
              : 'no-store',
          },
        ],
      },
      {
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
};

export default nextConfig;
