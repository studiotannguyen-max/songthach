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
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
