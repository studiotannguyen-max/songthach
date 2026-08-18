import type { Metadata } from 'next';
import './globals.css';
import './admin-legacy.css';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';

// Cả hai font nạp qua next/font (không @import) — có subset tiếng Việt, không chặn render.
// Cùng một họ Barlow: tiêu đề dùng bản hẹp, thân bài dùng bản thường cho dễ đọc đoạn dài.
const barlowCondensed = Barlow_Condensed({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const barlow = Barlow({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://songthach.vn'),
  title: {
    default: 'Song Thạch — Tổ hợp Thể thao & Tiệc cưới',
    template: '%s | Song Thạch',
  },
  description:
    'Tổ hợp dịch vụ Song Thạch — Sân bóng đá, Sân cầu lông, Nhà hàng tiệc cưới và Café Lavie en Rose tại một địa điểm tại Đồng Nai.',
  keywords: ['sân bóng đá', 'sân cầu lông', 'tiệc cưới', 'nhà hàng', 'song thạch', 'đặt sân', 'đồng nai'],
  authors: [{ name: 'Song Thạch' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Song Thạch',
    title: 'Song Thạch — Tổ hợp Thể thao & Tiệc cưới',
    description: 'Sân bóng đá, Sân cầu lông, Nhà hàng tiệc cưới và Café Lavie en Rose tại một địa điểm tại Đồng Nai.',
  },
};

const LOCAL_BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['SportsActivityLocation', 'LocalBusiness'],
      name: 'Song Thạch',
      description: 'Tổ hợp dịch vụ Song Thạch — Sân bóng đá, Sân cầu lông, Nhà hàng tiệc cưới và Café Lavie en Rose.',
      url: 'https://songthach.vn',
      telephone: '+84378990979',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '9B/3 Ấp An Hoà, Xã Hưng Thịnh',
        addressLocality: 'Đồng Nai',
        addressCountry: 'VN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.950334,
        longitude: 107.045569,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          opens: '06:00',
          closes: '22:00',
        },
      ],
      priceRange: '₫₫',
      currenciesAccepted: 'VND',
      paymentAccepted: 'Cash, Bank Transfer',
      hasMap: 'https://maps.app.goo.gl/As3cSj4JTF49MsLVA',
      sameAs: [
        'https://www.facebook.com/songthach',
        'https://www.instagram.com/songthach',
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${barlow.variable} ${barlowCondensed.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
        />
        {/* Skip to main content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-strong focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Chuyển đến nội dung chính
        </a>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-sans)', fontSize: '14px' },
            success: { iconTheme: { primary: '#007A33', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
