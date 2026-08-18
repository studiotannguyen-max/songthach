import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getGallery } from '@/lib/gallery';
import { PageHero, SectionHeader, Card, CardImage, CardBody, Badge } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Khu Thể thao',
  description: 'Sân bóng đá cỏ nhân tạo và sân cầu lông tiêu chuẩn BWF tại Song Thạch. Mở cửa 06:00–22:00, đặt sân online.',
};

// Đọc lại ảnh từ DB mỗi 60s — admin đổi ảnh sẽ hiện sau ~1 phút
export const revalidate = 60;

export default async function SportsPage() {
  const [footballImages, badmintonImages] = await Promise.all([
    getGallery('football'),
    getGallery('badminton'),
  ]);

  const ZONES = [
    {
      href:  '/sports/football',
      title: 'Sân Bóng Đá',
      badge: '3 sân 5 người · 1 sân 7 người',
      desc:  'Cỏ nhân tạo thế hệ 3, hệ thống đèn LED chuẩn thi đấu ban đêm. Phù hợp mọi trình độ.',
      image: footballImages[0]?.url,
    },
    {
      href:  '/sports/badminton',
      title: 'Sân Cầu Lông',
      badge: '3 sân tiêu chuẩn BWF',
      desc:  'Sàn PVC chính hãng, hệ thống thông gió, cho thuê vợt và cầu ngay tại sân.',
      image: badmintonImages[0]?.url ?? '/images/sports/badminton-hero.jpg',
    },
  ];

  return (
    <>
      <PageHero
        label="Song Thạch"
        title="Khu Thể Thao"
        description="Dành cho mọi người · Mở cửa 06:00 – 22:00 mỗi ngày"
        image={badmintonImages[0]?.url ?? '/images/sports/badminton-hero.jpg'}
        cta={{ label: 'Xem sân cầu lông', href: '/sports/badminton' }}
      />

      <section className="section">
        <div className="container-page">
          <SectionHeader label="Chọn môn" title="Hai khu sân tại Song Thạch" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ZONES.map((zone) => (
              <Card key={zone.href}>
                <Link href={zone.href} className="block">
                  {zone.image
                    ? <CardImage src={zone.image} alt={zone.title} ratio="16/10" />
                    : <div className="w-full bg-bg-subtle" style={{ aspectRatio: '16/10' }} />}
                  <CardBody>
                    <Badge>{zone.badge}</Badge>
                    <h2 className="text-2xl mt-4 mb-2">{zone.title}</h2>
                    <p className="text-sm text-fg-muted">{zone.desc}</p>
                    <span className="mt-5 flex items-center gap-1.5 text-sm font-display uppercase tracking-[0.06em] text-brand-strong">
                      Xem chi tiết &amp; đặt sân <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </CardBody>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
