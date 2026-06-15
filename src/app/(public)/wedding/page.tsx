import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import InquiryForm from '@/components/wedding/InquiryForm';
import { Users, Clock } from 'lucide-react';
import { getGallery } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Nhà hàng Tiệc cưới',
  description: 'Song Thạch — cho thuê mặt bằng tổ chức sự kiện, tiệc cưới, hội nghị. 1 sảnh tiệc sang trọng, sức chứa lên đến 700 khách. Tư vấn miễn phí, gói dịch vụ trọn gói từ thực đơn đến trang trí.',
};

// Đọc lại ảnh gallery từ DB mỗi 60s — admin upload ảnh mới sẽ hiện sau ~1 phút
export const revalidate = 60;

// Ảnh mặc định khi admin chưa upload ảnh nào cho mục Tiệc cưới
const FALLBACK_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', span: 'col-span-2 row-span-2', label: 'Sảnh Grand' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', span: '', label: 'Trang trí bàn tiệc' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', span: '', label: 'Hoa cưới' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', span: '', label: 'Không gian sảnh' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', span: '', label: 'Tiệc ngoài trời' },
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
    ? dbImages.slice(0, 5).map((img, i) => ({
        src:   img.url,
        label: img.caption || 'Tiệc cưới Song Thạch',
        span:  i === 0 ? 'col-span-2 row-span-2' : '',
      }))
    : FALLBACK_GALLERY;

  return (
    <div className="bg-wedding-cream">
      <Navbar />

      {/* ── HERO ── */}
      <section id="main-content" className="relative h-screen min-h-[600px] flex items-center justify-center">
        <Image
          src="https://tqhihuvpjegjmbbokcfb.supabase.co/storage/v1/object/public/post-images/1781334301759-r7i5ybpnys.jpg"
          alt="Sảnh tiệc cưới sang trọng tại nhà hàng Song Thạch — trang trí hoa tươi, ánh sáng ấm áp"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-wedding-dark/70 via-wedding-dark/50 to-wedding-dark/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="wedding-serif italic text-wedding-accent text-lg mb-4 tracking-wide">
            Song Thạch trân trọng giới thiệu
          </p>
          <h1 className="wedding-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Nhà hàng<br />
            <em className="text-wedding-accent">Tiệc cưới</em>
          </h1>
          <div className="gold-divider max-w-md mx-auto">
            <span className="wedding-serif italic text-wedding-accent/70 text-sm">Cho thuê mặt bằng tổ chức sự kiện, tiệc cưới, hội nghị</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="#inquiry" className="wedding-btn px-10 py-4 inline-flex items-center gap-2 justify-center">
              Đặt lịch tư vấn miễn phí
            </a>
            <a href="#gallery" className="inline-flex items-center gap-2 justify-center border border-white/40 text-white px-10 py-4 hover:bg-white/10 transition-all tracking-widest text-sm uppercase" style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.15em' }}>
              Xem thư viện ảnh
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-wedding-dark py-12">
        <div className="max-w-md mx-auto px-4 grid grid-cols-2 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon size={22} className="text-wedding-accent mx-auto mb-2" />
              <div className="wedding-serif text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HALL ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-wedding-accent text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Không gian tổ chức</p>
            <h2 className="wedding-serif text-4xl md:text-5xl font-bold text-wedding-dark">Sảnh tiệc không gian mở</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative h-80 md:h-[420px] overflow-hidden rounded-2xl">
              <Image
                src={GALLERY[1]?.src || GALLERY[0].src}
                alt={`${HALL.name} — nhà hàng tiệc cưới Song Thạch`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="wedding-serif text-3xl font-bold text-wedding-dark mb-2">{HALL.name}</h3>
              <p className="text-wedding-accent text-lg mb-4">{HALL.capacity} khách · {HALL.tables} bàn</p>
              <p className="text-wedding-primary/70 leading-relaxed">{HALL.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-wedding-accent text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Thư viện hình ảnh</p>
            <h2 className="wedding-serif text-4xl font-bold text-wedding-dark">Những khoảnh khắc đẹp</h2>
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[480px]">
            {GALLERY.map((img) => (
              <div key={img.src} className={`relative overflow-hidden rounded-xl ${img.span}`}>
                <Image
                  src={img.src}
                  alt={`${img.label} — tiệc cưới tại Song Thạch`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="wedding-serif text-white text-sm italic">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section id="inquiry" className="py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-wedding-accent text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Liên hệ tư vấn</p>
            <h2 className="wedding-serif text-4xl font-bold text-wedding-dark mb-3">Bắt đầu hành trình của bạn</h2>
            <p className="text-wedding-primary/60 leading-relaxed">
              Để lại thông tin — đội ngũ tư vấn của chúng tôi sẽ liên hệ trong vòng 24 giờ với báo giá chi tiết.
            </p>
          </div>
          <InquiryForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
