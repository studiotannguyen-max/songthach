import type { Metadata } from 'next';
import './globals.css';
import { Barlow_Condensed } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';

const barlow = Barlow_Condensed({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-bebas',
  weight: ['800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://songthach.vn'),
  title: {
    default: 'Song Thạch — Tổ hợp Thể thao & Tiệc cưới',
    template: '%s | Song Thạch',
  },
  description:
    'Tổ hợp dịch vụ Song Thạch — Sân bóng đá, Sân cầu lông, Nhà hàng tiệc cưới và Café Lavie en Rose tại một địa điểm tại TP.HCM.',
  keywords: ['sân bóng đá', 'sân cầu lông', 'tiệc cưới', 'nhà hàng', 'song thạch', 'đặt sân', 'tp hcm'],
  authors: [{ name: 'Song Thạch' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Song Thạch',
    title: 'Song Thạch — Tổ hợp Thể thao & Tiệc cưới',
    description: 'Sân bóng đá, Sân cầu lông, Nhà hàng tiệc cưới và Café Lavie en Rose tại một địa điểm tại TP.HCM.',
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
      telephone: '+84901234567',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Đường Song Thạch, Phường X, Quận Y',
        addressLocality: 'Thành phố Hồ Chí Minh',
        addressCountry: 'VN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.7769,
        longitude: 106.7009,
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
      hasMap: 'https://maps.google.com',
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
      <body className={barlow.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
        />
        {/* Skip to main content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-sports-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
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
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#1a6b3a', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
