import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import SportPickerTrigger from '@/components/shared/SportPickerTrigger';
import { vi } from 'date-fns/locale';
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
import { FootballIcon, ShuttlecockIcon, RacketIcon, TrophyIcon } from '@/components/icons';
import { getGallery } from '@/lib/gallery';
import { getPublishedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Song Thạch — Khu thể thao, Tiệc cưới & Café',
  description: 'Đặt sân bóng đá, sân cầu lông tại Song Thạch. Mở cửa 06:00–22:00, đặt sân online trong 60 giây.',
};

// Đọc lại ảnh/bài viết từ DB mỗi 60s
export const revalidate = 60;

const PITCH      = '#0F3C2C';
const PITCH_2    = '#0A2C20';
const INK        = '#10150F';
const LIME       = '#9CE25C';
const LIME_DEEP  = '#3F8F33';
const SAND       = '#F4EEE1';
const PAPER      = '#FBFAF7';
const LINE       = '#E6E2D6';
const MUTED      = '#6A6F66';
const ROSE       = '#C8746B';
const ROSE_SOFT  = '#F6EBE9';

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
  { href: '/sports/badminton',         id: undefined,  icon: ShuttlecockIcon, imgSrc: '/icon-shuttlecock.png', label: 'Sân Cầu Lông',      desc: 'Đặt sân theo giờ, lịch trống cập nhật trực tiếp.', badge: 'Đặt theo giờ', go: 'Đặt sân',    accent: 'green' as const },
  { href: '/sports/football',          id: undefined,  icon: FootballIcon,    imgSrc: '/icon-football.png',    label: 'Sân Bóng Đá',       desc: 'Sân cỏ chuẩn, đặt nhanh cho cả đội của bạn.',      badge: 'Đặt theo giờ', go: 'Đặt sân',    accent: 'green' as const },
  { href: '/sports/football#classes',  id: 'daotao',   icon: TrophyIcon,      imgSrc: undefined,               label: 'Đào tạo Bóng đá',   desc: 'Lớp 7–14 tuổi, huấn luyện viên theo sát.',         badge: 'Ghi danh',     go: 'Xem lớp',   accent: 'green' as const },
  { href: '/sports/badminton#classes', id: undefined,  icon: RacketIcon,      imgSrc: undefined,               label: 'Đào tạo Cầu lông',  desc: 'Rèn kỹ thuật bài bản theo từng cấp độ.',            badge: 'Ghi danh',     go: 'Xem lớp',   accent: 'green' as const },
  { href: '/wedding',                  id: undefined,  icon: RingsIcon,       imgSrc: '/icon-wedding.png',     label: 'Tiệc Cưới',         desc: 'Sảnh tiệc sức chứa 700 khách cho ngày trọng đại.',  badge: 'Tư vấn',       go: 'Đặt tư vấn', accent: 'rose' as const },
  { href: '/cafe',                     id: 'cafe',     icon: CupIcon,         imgSrc: undefined,               label: 'Café Lavie en Rose', desc: 'Góc sân vườn kiểu Pháp để nghỉ chân.',             badge: 'Mở 07:00–22:00', go: 'Xem menu', accent: 'rose' as const },
];

function DiagonalStripe() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(156,226,92,0.08) 4px, rgba(156,226,92,0.08) 8px)',
    }} />
  );
}

export default async function HomePage() {
  const [cafePhotos, posts] = await Promise.all([
    getGallery('cafe'),
    getPublishedPosts(3),
  ]);
  const cafeImage = cafePhotos[0]?.url;

  return (
    <>
      {/* ── Announcement bar ───────────────── */}
      <div className="text-center text-xs py-2 px-4" style={{ background: INK, color: PAPER }}>
        Đặt sân online — <b style={{ color: LIME }}>giữ chỗ trong 60 giây</b>, mở cửa {OPEN_HOURS} mỗi ngày
      </div>

      {/* ── Nav ───────────────── */}
      <nav className="sticky top-0 z-50" style={{ background: PAPER, borderBottom: `3px solid ${PITCH}` }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 flex items-center gap-7 h-16">
          <Link href="/" aria-label="Song Thạch — Trang chủ">
            <Image src="/logo.jpg" alt="Song Thạch" width={80} height={40} className="object-contain" style={{ maxHeight: '38px', width: 'auto' }} />
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-2 text-sm font-semibold uppercase" style={{ fontFamily: 'var(--font-oswald)', color: '#2c322a' }}>
            <a href="#dichvu" className="hover:opacity-70">Dịch vụ</a>
            <Link href="/sports" className="hover:opacity-70">Đặt sân</Link>
            <a href="#daotao" className="hover:opacity-70">Đào tạo</a>
            <a href="#cafe" className="hover:opacity-70">Cafe</a>
            <Link href="/tin-tuc" className="hover:opacity-70">Tin tức</Link>
          </div>
          <div className="ml-auto flex items-center gap-3.5">
            <Link href="/login" className="hidden sm:inline text-sm font-semibold uppercase" style={{ color: PITCH, fontFamily: 'var(--font-oswald)' }}>Đăng nhập</Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm font-semibold" style={{ color: PITCH, fontFamily: 'var(--font-oswald)' }}>
              <Phone size={14} /> {PHONE}
            </span>
            <SportPickerTrigger
              className="text-sm px-5 py-2.5 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              style={{ background: LIME, color: INK, borderRadius: 0, fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', letterSpacing: '0.08em', border: `2px solid ${PITCH}`, boxShadow: `3px 3px 0 ${PITCH}` }}
            >
              ĐẶT SÂN
            </SportPickerTrigger>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────── */}
      <header className="relative overflow-hidden" style={{ background: PITCH, color: PAPER }}>
        <DiagonalStripe />
        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center py-16 lg:py-20">
          <div>
            <span
              className="inline-block text-xs font-semibold px-3 py-1.5 mb-5 border-2"
              style={{ color: LIME, borderColor: 'rgba(156,226,92,.6)', fontFamily: 'var(--font-bebas)', letterSpacing: '0.1em' }}
            >
              TỔ HỢP THỂ THAO · TIỆC CƯỚI · CÀ PHÊ — ĐỒNG NAI
            </span>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '0.04em', lineHeight: 0.95 }}>
              SONG THẠCH — COME PLAY, <span style={{ color: LIME }}>STAY, RELAX</span>
            </h1>
            <p className="text-base mt-5 mb-7 max-w-[46ch]" style={{ color: '#d7e3da' }}>
              Sân cầu lông, sân bóng đá, lớp đào tạo thể thao, tiệc cưới sân vườn và Café Lavie en Rose — tất cả ở cùng một địa chỉ.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <SportPickerTrigger
                className="inline-flex items-center gap-2 text-sm px-6 py-3 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                style={{ background: LIME, color: INK, borderRadius: 0, border: `2px solid ${PITCH}`, boxShadow: `4px 4px 0 ${PITCH}`, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}
              >
                ĐẶT SÂN NGAY <ArrowRight size={16} />
              </SportPickerTrigger>
              <a href="#dichvu"
                className="inline-flex items-center gap-2 text-sm px-6 py-3 border-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                style={{ borderColor: 'rgba(255,255,255,.6)', color: PAPER, borderRadius: 0, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}
              >
                KHÁM PHÁ TỔ HỢP
              </a>
            </div>
            <div className="flex gap-8 mt-10 pt-6 border-t flex-wrap" style={{ borderColor: 'rgba(255,255,255,.14)' }}>
              <div>
                <b className="block text-2xl font-bold" style={{ fontFamily: 'var(--font-bricolage)' }}>3</b>
                <span className="text-xs" style={{ color: '#aebfb4' }}>sân cầu lông</span>
              </div>
              <div>
                <b className="block text-2xl font-bold" style={{ fontFamily: 'var(--font-bricolage)' }}>2</b>
                <span className="text-xs" style={{ color: '#aebfb4' }}>sân bóng đá</span>
              </div>
              <div>
                <b className="block text-2xl font-bold" style={{ fontFamily: 'var(--font-bricolage)' }}>2</b>
                <span className="text-xs" style={{ color: '#aebfb4' }}>lớp đào tạo thể thao</span>
              </div>
              <div>
                <b className="block text-2xl font-bold" style={{ fontFamily: 'var(--font-bricolage)' }}>{OPEN_HOURS}</b>
                <span className="text-xs" style={{ color: '#aebfb4' }}>mở cửa mỗi ngày</span>
              </div>
            </div>
          </div>

          {/* Tin tức & sự kiện */}
          <div id="tintuc" className="p-6 border-2" style={{ background: `linear-gradient(160deg,#15543d,#0c3022)`, borderColor: 'rgba(156,226,92,.4)' }}>
            <span className="inline-block text-xs font-semibold px-2.5 py-1" style={{ background: LIME, color: INK, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}>TIN TỨC &amp; SỰ KIỆN</span>
            <h3 className="mt-3.5 mb-4" style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.15rem', letterSpacing: '0.04em' }}>ĐANG DIỄN RA TẠI SONG THẠCH</h3>

            {posts.length === 0 ? (
              <p className="text-sm" style={{ color: '#aebfb4' }}>Chưa có tin tức nào.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="flex gap-3 items-center p-2.5 transition-colors hover:bg-white/5"
                  >
                    <div className="relative w-16 h-16 overflow-hidden shrink-0" style={{ background: '#0e3a2a' }}>
                      {post.cover_image && (
                        <Image src={post.cover_image} alt={post.title} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      {post.published_at && (
                        <div className="text-[11px] font-semibold" style={{ color: LIME }}>
                          {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      )}
                      <p className="text-sm font-semibold leading-snug truncate" style={{ color: PAPER }}>{post.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/tin-tuc" className="mt-4 flex items-center gap-1.5 text-sm font-semibold" style={{ color: LIME }}>
              Xem tất cả tin tức <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Services ───────────────── */}
      <section className="py-16 md:py-20" id="dichvu" style={{ background: PAPER }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-5 mb-8 flex-wrap">
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: LIME_DEEP }}>Khám phá theo dịch vụ</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(30px,4.5vw,46px)', letterSpacing: '0.04em', color: INK }}>
                DỊCH VỤ TẠI SONG THẠCH
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const rose = s.accent === 'rose';
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  id={s.id}
                  className="relative block border-[3px] p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{
                    background: '#fff',
                    borderColor: rose ? '#C8746B' : '#0F3C2C',
                    boxShadow: rose ? '5px 5px 0 rgba(200,116,107,0.3)' : '5px 5px 0 #9CE25C',
                  }}
                >
                  <span
                    className="absolute top-4 right-4 text-[10.5px] font-semibold px-2.5 py-1"
                    style={{ background: rose ? ROSE_SOFT : SAND, color: rose ? ROSE : PITCH, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}
                  >
                    {s.badge}
                  </span>
                  <div
                    className="w-[50px] h-[50px] flex items-center justify-center mt-7 mb-4 border-2 overflow-hidden"
                    style={{ background: rose ? ROSE_SOFT : SAND, color: rose ? ROSE : PITCH, borderColor: rose ? ROSE : PITCH }}
                  >
                    {s.imgSrc
                      ? <Image src={s.imgSrc} alt={s.label} width={40} height={40} className="object-contain" />
                      : <Icon size={22} />
                    }
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.25rem', letterSpacing: '0.04em', color: INK, marginBottom: '0.375rem' }}>{s.label}</h3>
                  <p className="text-sm" style={{ color: MUTED }}>{s.desc}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold" style={{ color: rose ? ROSE : LIME_DEEP, fontFamily: 'var(--font-bebas)', letterSpacing: '0.06em' }}>
                    {s.go} <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Cafe spotlight ───────────────── */}
      <section className="py-16 md:py-20" style={{ background: SAND }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 lg:h-[380px] overflow-hidden flex items-center justify-center" style={{ background: '#fff', border: `3px solid ${LINE}` }}>
            {cafeImage ? (
              <Image src={cafeImage} alt="Café Lavie en Rose" width={260} height={260} className="object-contain" />
            ) : null}
          </div>
          <div>
            <div className="text-xs font-semibold mb-2.5" style={{ color: ROSE }}>La Vie en Rose</div>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(30px,4vw,42px)', letterSpacing: '0.04em', color: INK, marginBottom: '1rem' }}>
              NGHỈ CHÂN GIỮA MỘT GÓC BÌNH YÊN
            </h2>
            <p className="text-[15.5px] mb-6 max-w-[44ch]" style={{ color: '#54584d' }}>
              Một không gian xanh mát, yên tĩnh giữa lòng tổ hợp — nơi bạn thư giãn sau những trận đấu sôi nổi, hoặc đơn giản là thưởng thức một tách cà phê chất lượng trong không gian kiến trúc tinh tế.
            </p>
            <Link href="/cafe" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all" style={{ background: INK, color: PAPER, borderRadius: 0, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${ROSE}`, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}>
              Xem menu &amp; không gian <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Location ───────────────── */}
      <section className="py-16 md:py-20" style={{ background: PITCH, color: PAPER }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-center">
          <div>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(28px,4vw,40px)', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>GHÉ SONG THẠCH</h2>
            <div className="flex gap-3 items-start mb-4" style={{ color: '#d7e3da' }}>
              <MapPin size={20} style={{ color: LIME }} className="shrink-0 mt-0.5" />
              <span><b className="block text-white font-semibold">Địa chỉ</b>{ADDRESS}</span>
            </div>
            <div className="flex gap-3 items-start mb-4" style={{ color: '#d7e3da' }}>
              <Clock size={20} style={{ color: LIME }} className="shrink-0 mt-0.5" />
              <span><b className="block text-white font-semibold">Giờ mở cửa</b>{OPEN_HOURS} mỗi ngày</span>
            </div>
            <div className="flex gap-3 items-start mb-4" style={{ color: '#d7e3da' }}>
              <Phone size={20} style={{ color: LIME }} className="shrink-0 mt-0.5" />
              <span><b className="block text-white font-semibold">Đặt sân &amp; tư vấn</b>{PHONE}</span>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 mt-2 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              style={{ background: LIME, color: INK, borderRadius: 0, border: `2px solid ${PITCH}`, boxShadow: `3px 3px 0 ${PITCH}`, fontFamily: 'var(--font-bebas)', letterSpacing: '0.08em' }}
            >
              Chỉ đường <ArrowRight size={16} />
            </a>
          </div>
          <div
            className="h-[280px] md:h-[300px] rounded-[18px] flex items-center justify-center text-sm border"
            style={{ background: PITCH_2, borderColor: 'rgba(156,226,92,.25)', color: '#86a394' }}
          >
            Bản đồ Google Maps
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────── */}
      <footer className="py-12 md:py-16" style={{ background: INK, color: '#cfd4cb', borderTop: '4px solid #9CE25C' }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-9 mb-11">
            <div>
              <div className="mb-3.5">
                <Image src="/logo.jpg" alt="Song Thạch" width={120} height={60} className="object-contain" style={{ maxHeight: '50px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p className="text-[13.5px] max-w-[34ch]" style={{ color: '#9aa098' }}>
                Tổ hợp dịch vụ thể thao, tiệc cưới và café — nơi mọi khoảnh khắc đều trở nên đáng nhớ.
              </p>
            </div>
            <div>
              <h5 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.15em', color: '#9CE25C', marginBottom: '1rem' }}>Thể thao</h5>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/sports/football" className="hover:text-white">Sân Bóng Đá</Link></li>
                <li><Link href="/sports/badminton" className="hover:text-white">Sân Cầu Lông</Link></li>
                <li><Link href="/sports/football#classes" className="hover:text-white">Đào tạo Bóng đá</Link></li>
                <li><Link href="/sports/badminton#classes" className="hover:text-white">Đào tạo Cầu lông</Link></li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.15em', color: '#9CE25C', marginBottom: '1rem' }}>Dịch vụ</h5>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/wedding" className="hover:text-white">Tiệc cưới</Link></li>
                <li><Link href="/cafe" className="hover:text-white">Café Lavie en Rose</Link></li>
                <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.15em', color: '#9CE25C', marginBottom: '1rem' }}>Liên hệ</h5>
              <ul className="space-y-2.5 text-sm">
                <li><a href="tel:0378990979" className="hover:text-white">0378 990 979</a></li>
                <li><a href="tel:0886798690" className="hover:text-white">0886 798 690</a></li>
                <li><Link href="/login" className="hover:text-white">Tài khoản của tôi</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-5 flex flex-wrap justify-between gap-2.5 text-xs" style={{ borderColor: 'rgba(255,255,255,.1)', color: '#7f867d' }}>
            <span>© {new Date().getFullYear()} Song Thạch. Mọi quyền được bảo lưu.</span>
            <span>Hưng Thịnh, Đồng Nai · songthach.com</span>
          </div>
        </div>
      </footer>
    </>
  );
}
