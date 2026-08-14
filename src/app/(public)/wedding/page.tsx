import type { Metadata } from 'next';
import Image from 'next/image';
import InquiryForm from '@/components/wedding/InquiryForm';
import { Users, Clock } from 'lucide-react';
import { getGallery } from '@/lib/gallery';
import { PageHero, SectionHeader } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Nhà hàng Tiệc cưới',
  description: 'Song Thạch — cho thuê mặt bằng tổ chức sự kiện, tiệc cưới, hội nghị. 1 sảnh tiệc sang trọng, sức chứa lên đến 700 khách. Tư vấn miễn phí, gói dịch vụ trọn gói từ thực đơn đến trang trí.',
};

// Đọc lại ảnh gallery từ DB mỗi 60s — admin upload ảnh mới sẽ hiện sau ~1 phút
export const revalidate = 60;

const HERO_IMAGE = 'https://tqhihuvpjegjmbbokcfb.supabase.co/storage/v1/object/public/post-images/1781334301759-r7i5ybpnys.jpg';

// Ảnh mặc định khi admin chưa upload ảnh nào cho mục Tiệc cưới
const FALLBACK_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', label: 'Sảnh Grand' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', label: 'Trang trí bàn tiệc' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', label: 'Hoa cưới' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', label: 'Không gian sảnh' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', label: 'Tiệc ngoài trời' },
];

const HALL = {
  name: 'Sảnh Grand',
  capacity: 700,
  tables: 70,
  desc: 'Không gian đa năng sang trọng — lý tưởng cho tiệc cưới, hội nghị, hội thảo và các sự kiện lớn.',
};

const STATS = [
  { icon: Users, value: '700',  label: 'Sức chứa tối đa (khách)' },
  { icon: Clock, value: '15+',  label: 'Năm kinh nghiệm' },
];

export default async function WeddingPage() {
  // Ưu tiên ảnh admin đã upload; chưa có thì dùng ảnh mặc định.
  const dbImages = await getGallery('wedding');
  const GALLERY = dbImages.length > 0
    ? dbImages.slice(0, 5).map((img) => ({
        src:   img.url,
        label: img.caption || 'Tiệc cưới Song Thạch',
      }))
    : FALLBACK_GALLERY;

  return (
    <>
      <PageHero
        label="Song Thạch trân trọng giới thiệu"
        title="Nhà hàng Tiệc cưới"
        description="Cho thuê mặt bằng tổ chức sự kiện, tiệc cưới, hội nghị — sảnh tiệc sức chứa đến 700 khách."
        image={HERO_IMAGE}
        cta={{ label: 'Đặt lịch tư vấn miễn phí', href: '#inquiry' }}
      />

      {/* ── Con số ───────────────── */}
      <div className="bg-ink text-white">
        <div className="container-page grid grid-cols-2 gap-6 py-10 max-w-2xl">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon size={22} className="text-brand mx-auto mb-2" aria-hidden="true" />
              <div className="font-display text-2xl mb-1">{s.value}</div>
              <div className="text-sm text-white/75">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sảnh tiệc ───────────────── */}
      <section id="main-content" className="section">
        <div className="container-page">
          <SectionHeader label="Không gian tổ chức" title="Sảnh tiệc không gian mở" align="center" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative h-80 md:h-[420px] rounded border border-line overflow-hidden">
              <Image
                src={GALLERY[1]?.src || GALLERY[0].src}
                alt={`${HALL.name} — nhà hàng tiệc cưới Song Thạch`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl mb-2">{HALL.name}</h3>
              <p className="text-brand-strong font-semibold mb-4">{HALL.capacity} khách · {HALL.tables} bàn</p>
              <p className="text-fg-muted">{HALL.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Thư viện ảnh ───────────────── */}
      <section id="gallery" className="section bg-bg-subtle">
        <div className="container-page">
          <SectionHeader label="Thư viện hình ảnh" title="Những khoảnh khắc đẹp" align="center" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((img, i) => (
              <div
                key={img.src}
                className={`relative rounded border border-line overflow-hidden ${i === 0 ? 'col-span-2 md:row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '4/3' : '1/1' }}
              >
                <Image
                  src={img.src}
                  alt={`${img.label} — tiệc cưới tại Song Thạch`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form tư vấn ───────────────── */}
      <section id="inquiry" className="section">
        <div className="container-page max-w-2xl">
          <SectionHeader
            label="Liên hệ tư vấn"
            title="Bắt đầu hành trình của bạn"
            description="Để lại thông tin — đội ngũ tư vấn của chúng tôi sẽ liên hệ trong vòng 24 giờ với báo giá chi tiết."
            align="center"
          />
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
