import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
import SportPickerTrigger from '@/components/shared/SportPickerTrigger';
import { FootballIcon, ShuttlecockIcon, RacketIcon, TrophyIcon } from '@/components/icons';
import { getGallery } from '@/lib/gallery';
import { buildHeroSlides } from '@/lib/hero-slides';
import { getPublishedPosts } from '@/lib/posts';
import { PageHero, SectionHeader, Card, CardBody, Badge } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Song Thạch — Khu thể thao, Tiệc cưới & Café',
  description: 'Đặt sân bóng đá, sân cầu lông tại Song Thạch. Mở cửa 06:00–22:00, đặt sân online trong 60 giây.',
};

// Đọc lại ảnh/bài viết từ DB mỗi 60s
export const revalidate = 60;

const ADDRESS    = '9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai';
const OPEN_HOURS = '06:00 – 22:00';
const PHONE      = '0378 990 979';

type IconProps = { size?: number };

function RingsIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
    </svg>
  );
}
function CupIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 8h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M17 9h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 3v2M11 3v2" />
    </svg>
  );
}

const SERVICES = [
  { href: '/sports/badminton',         id: undefined, icon: ShuttlecockIcon, imgSrc: '/icon-shuttlecock.png', label: 'Sân Cầu Lông',       desc: 'Đặt sân theo giờ, lịch trống cập nhật trực tiếp.', badge: 'Đặt theo giờ',   go: 'Đặt sân' },
  { href: '/sports/football',          id: undefined, icon: FootballIcon,    imgSrc: '/icon-football.png',    label: 'Sân Bóng Đá',        desc: 'Sân cỏ chuẩn, đặt nhanh cho cả đội của bạn.',      badge: 'Đặt theo giờ',   go: 'Đặt sân' },
  { href: '/sports/football#classes',  id: 'daotao',  icon: TrophyIcon,      imgSrc: undefined,               label: 'Đào tạo Bóng đá',    desc: 'Lớp 7–14 tuổi, huấn luyện viên theo sát.',         badge: 'Ghi danh',       go: 'Xem lớp' },
  { href: '/sports/badminton#classes', id: undefined, icon: RacketIcon,      imgSrc: undefined,               label: 'Đào tạo Cầu lông',   desc: 'Rèn kỹ thuật bài bản theo từng cấp độ.',           badge: 'Ghi danh',       go: 'Xem lớp' },
  { href: '/wedding',                  id: undefined, icon: RingsIcon,       imgSrc: '/icon-wedding.png',     label: 'Tiệc Cưới',          desc: 'Sảnh tiệc sức chứa 700 khách cho ngày trọng đại.', badge: 'Tư vấn',         go: 'Đặt tư vấn' },
  { href: '/cafe',                     id: 'cafe',    icon: CupIcon,         imgSrc: undefined,               label: 'Café Lavie en Rose', desc: 'Góc sân vườn kiểu Pháp để nghỉ chân.',             badge: 'Mở 07:00–22:00', go: 'Xem menu' },
];

const STATS = [
  { n: '3',        t: 'sân cầu lông' },
  { n: '2',        t: 'sân bóng đá' },
  { n: '2',        t: 'lớp đào tạo thể thao' },
  { n: OPEN_HOURS, t: 'mở cửa mỗi ngày' },
];

export default async function HomePage() {
  const [cafePhotos, posts, badmintonPhotos, footballPhotos, weddingPhotos] = await Promise.all([
    getGallery('cafe'),
    getPublishedPosts(3),
    getGallery('badminton'),
    getGallery('football'),
    getGallery('wedding'),
  ]);
  const cafeImage  = cafePhotos[0]?.url;
  const heroSlides = buildHeroSlides(badmintonPhotos, footballPhotos, weddingPhotos);

  return (
    <>
      {/* ── Dải thông báo ───────────────── */}
      <div className="bg-ink text-white text-center text-xs py-2 px-4">
        Đặt sân online — <b className="text-brand">giữ chỗ trong 60 giây</b>, mở cửa {OPEN_HOURS} mỗi ngày
      </div>

      {/* ── Hero ───────────────── */}
      <PageHero
        label="Tổ hợp thể thao · tiệc cưới · cà phê — Đồng Nai"
        title="Song Thạch — Come play, stay, relax"
        description="Sân cầu lông, sân bóng đá, lớp đào tạo thể thao, tiệc cưới sân vườn và Café Lavie en Rose — tất cả ở cùng một địa chỉ."
        slides={heroSlides}
      >
        <SportPickerTrigger className="btn-brand">
          Đặt sân ngay <ArrowRight size={16} aria-hidden="true" />
        </SportPickerTrigger>
        <Link
          href="#dichvu"
          className="btn-on-dark"
        >
          Khám phá tổ hợp
        </Link>
      </PageHero>

      {/* ── Con số ───────────────── */}
      <div className="border-b border-line">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          {STATS.map((s) => (
            <div key={s.t}>
              <b className="block font-display text-2xl text-fg">{s.n}</b>
              <span className="text-sm text-fg-muted">{s.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dịch vụ ───────────────── */}
      <section id="dichvu" className="section">
        <div className="container-page">
          <SectionHeader label="Khám phá theo dịch vụ" title="Dịch vụ tại Song Thạch" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="relative">
                  <Link href={s.href} id={s.id} className="block h-full">
                    <CardBody>
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <span className="w-[50px] h-[50px] grid place-items-center rounded border border-line bg-bg-subtle text-brand-strong overflow-hidden">
                          {s.imgSrc
                            ? <Image src={s.imgSrc} alt="" width={40} height={40} className="object-contain" />
                            : <Icon size={22} />}
                        </span>
                        <Badge>{s.badge}</Badge>
                      </div>
                      <h3 className="text-xl mb-1.5">{s.label}</h3>
                      <p className="text-sm text-fg-muted">{s.desc}</p>
                      <span className="mt-4 flex items-center gap-1.5 text-sm font-display uppercase tracking-[0.06em] text-brand-strong">
                        {s.go} <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </CardBody>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Đặt sân nhanh ───────────────── */}
      <section className="section bg-ink text-white">
        <div className="container-page flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-[clamp(28px,3.5vw,44px)]">Đặt sân trong 60 giây</h2>
            <p className="mt-3 text-white/75 max-w-[52ch]">
              Chọn môn, chọn khung giờ còn trống và giữ chỗ ngay — không cần gọi điện.
            </p>
          </div>
          <SportPickerTrigger className="btn-brand shrink-0">
            Đặt sân ngay <ArrowRight size={16} aria-hidden="true" />
          </SportPickerTrigger>
        </div>
      </section>

      {/* ── Café ───────────────── */}
      <section className="section bg-bg-subtle">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 lg:h-[380px] rounded border border-line bg-bg grid place-items-center overflow-hidden">
            {cafeImage && (
              <Image src={cafeImage} alt="Café Lavie en Rose" width={260} height={260} className="object-contain" />
            )}
          </div>
          <div>
            <SectionHeader
              label="La Vie en Rose"
              title="Nghỉ chân giữa một góc bình yên"
              description="Một không gian xanh mát, yên tĩnh giữa lòng tổ hợp — nơi bạn thư giãn sau những trận đấu sôi nổi, hoặc đơn giản là thưởng thức một tách cà phê chất lượng trong không gian kiến trúc tinh tế."
            />
            <Link
              href="/cafe"
              className="btn-brand"
            >
              Xem menu &amp; không gian <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tin tức ───────────────── */}
      <section id="tintuc" className="section">
        <div className="container-page">
          <SectionHeader label="Tin tức & sự kiện" title="Đang diễn ra tại Song Thạch" />

          {posts.length === 0 ? (
            <p className="text-fg-muted">Chưa có tin tức nào.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <Link href={`/tin-tuc/${post.slug}`} className="block">
                    <div className="relative w-full bg-bg-subtle" style={{ aspectRatio: '16/10' }}>
                      {post.cover_image && (
                        <Image
                          src={post.cover_image} alt="" fill
                          sizes="(max-width: 768px) 100vw, 33vw" className="object-cover"
                        />
                      )}
                    </div>
                    <CardBody>
                      {post.published_at && (
                        <div className="text-xs font-semibold text-brand-strong mb-2">
                          {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      )}
                      <h3 className="text-lg leading-snug">{post.title}</h3>
                    </CardBody>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <Link
            href="/tin-tuc"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-display uppercase tracking-[0.06em] text-brand-strong"
          >
            Xem tất cả tin tức <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Ghé Song Thạch ───────────────── */}
      <section className="section bg-bg-subtle">
        <div className="container-page grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-center">
          <div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] mb-6">Ghé Song Thạch</h2>

            <div className="flex gap-3 items-start mb-4">
              <MapPin size={20} className="shrink-0 mt-0.5 text-brand-strong" aria-hidden="true" />
              <span className="text-fg-muted"><b className="block text-fg">Địa chỉ</b>{ADDRESS}</span>
            </div>
            <div className="flex gap-3 items-start mb-4">
              <Clock size={20} className="shrink-0 mt-0.5 text-brand-strong" aria-hidden="true" />
              <span className="text-fg-muted"><b className="block text-fg">Giờ mở cửa</b>{OPEN_HOURS} mỗi ngày</span>
            </div>
            <div className="flex gap-3 items-start mb-6">
              <Phone size={20} className="shrink-0 mt-0.5 text-brand-strong" aria-hidden="true" />
              <span className="text-fg-muted"><b className="block text-fg">Đặt sân &amp; tư vấn</b>{PHONE}</span>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-brand"
            >
              Chỉ đường <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="h-[280px] md:h-[320px] rounded border border-line bg-bg grid place-items-center text-sm text-fg-muted">
            Bản đồ Google Maps
          </div>
        </div>
      </section>
    </>
  );
}
