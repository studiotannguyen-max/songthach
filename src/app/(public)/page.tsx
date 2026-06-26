import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import SportPickerTrigger from '@/components/shared/SportPickerTrigger';
import { vi } from 'date-fns/locale';
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
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

function ShuttlecockIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="17" r="3" />
      <path d="M12 14 L9 5 M12 14 L15 5 M9 5 L15 5 M8 7 L16 7" />
    </svg>
  );
}
function BallIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l4 3-1.5 4.5h-5L8 10z" />
    </svg>
  );
}
function CapIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4l8 4-8 4-8-4 8-4z" />
      <path d="M6 10v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
    </svg>
  );
}
function RacketIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <ellipse cx="9" cy="9" rx="5" ry="6.5" transform="rotate(-40 9 9)" />
      <path d="M13 13l6 6" />
    </svg>
  );
}
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
  { href: '/sports/badminton',         id: undefined,  icon: ShuttlecockIcon, image: '/images/icons/badminton.png', label: 'Sân Cầu Lông',     desc: 'Đặt sân theo giờ, lịch trống cập nhật trực tiếp.', badge: 'Đặt theo giờ', go: 'Đặt sân', accent: 'green' as const },
  { href: '/sports/football',          id: undefined,  icon: BallIcon,        image: '/images/icons/football.png',  label: 'Sân Bóng Đá',      desc: 'Sân cỏ chuẩn, đặt nhanh cho cả đội của bạn.',        badge: 'Đặt theo giờ', go: 'Đặt sân', accent: 'green' as const },
  { href: '/sports/football#classes',  id: 'daotao',    icon: CapIcon,         image: undefined,                     label: 'Đào tạo Bóng đá',  desc: 'Lớp 7–14 tuổi, huấn luyện viên theo sát.',           badge: 'Ghi danh',     go: 'Xem lớp', accent: 'green' as const },
  { href: '/sports/badminton#classes', id: undefined,  icon: RacketIcon,      image: undefined,                     label: 'Đào tạo Cầu lông', desc: 'Rèn kỹ thuật bài bản theo từng cấp độ.',             badge: 'Ghi danh',     go: 'Xem lớp', accent: 'green' as const },
  { href: '/wedding',                  id: undefined,  icon: RingsIcon,       image: '/images/icons/wedding.png',   label: 'Tiệc Cưới',        desc: 'Sảnh tiệc sức chứa 800 khách cho ngày trọng đại.',   badge: 'Tư vấn',       go: 'Đặt tư vấn', accent: 'rose' as const },
  { href: '/cafe',                     id: 'cafe',      icon: CupIcon,         image: undefined,                     label: 'Café Lavie en Rose', desc: 'Góc sân vườn kiểu Pháp để nghỉ chân.',             badge: `Mở 07:00–22:00`, go: 'Xem menu', accent: 'rose' as const },
];

function CourtLines() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.16 }}>
      <span className="absolute top-0 bottom-0 w-[1.5px] bg-white" style={{ left: '22%' }} />
      <span className="absolute top-0 bottom-0 w-[1.5px] bg-white" style={{ left: '50%' }} />
      <span className="absolute top-0 bottom-0 w-[1.5px] bg-white" style={{ left: '78%' }} />
      <span className="absolute left-0 right-0 h-[1.5px] bg-white" style={{ top: '50%' }} />
      <span
        className="absolute rounded-full border-[1.5px] border-white"
        style={{ width: 280, height: 280, right: -70, top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
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
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(251,250,247,.88)', backdropFilter: 'blur(10px)', borderColor: LINE }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 flex items-center gap-7 h-16">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg" style={{ fontFamily: 'var(--font-bricolage)', color: INK }}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LIME_DEEP, boxShadow: `0 0 0 4px rgba(63,143,51,.18)` }} />
            SONG THẠCH
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-2 text-sm font-medium" style={{ color: '#2c322a' }}>
            <a href="#dichvu" className="hover:opacity-70">Dịch vụ</a>
            <Link href="/sports" className="hover:opacity-70">Đặt sân</Link>
            <a href="#daotao" className="hover:opacity-70">Đào tạo</a>
            <a href="#cafe" className="hover:opacity-70">Cafe</a>
            <Link href="/tin-tuc" className="hover:opacity-70">Tin tức</Link>
          </div>
          <div className="ml-auto flex items-center gap-3.5">
            <Link href="/login" className="hidden sm:inline text-sm font-medium" style={{ color: PITCH }}>Đăng nhập</Link>
            <Link href="/login?mode=register" className="hidden sm:inline text-sm font-semibold underline" style={{ color: PITCH }}>Đăng ký</Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm font-semibold" style={{ color: PITCH }}>
              <Phone size={14} /> {PHONE}
            </span>
            <SportPickerTrigger className="rounded-full text-sm font-semibold px-5 py-2.5" style={{ background: LIME, color: INK }}>
              Đặt sân
            </SportPickerTrigger>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────── */}
      <header className="relative overflow-hidden" style={{ background: PITCH, color: PAPER }}>
        <CourtLines />
        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center py-16 lg:py-20">
          <div>
            <span
              className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-5 border"
              style={{ color: LIME, borderColor: 'rgba(156,226,92,.4)' }}
            >
              Tổ hợp thể thao · tiệc cưới · cà phê — Đồng Nai
            </span>
            <h1 className="font-extrabold leading-[1.02] tracking-tight" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(38px,6.2vw,64px)' }}>
              SONG THẠCH — come play, <span style={{ color: LIME }}>stay, relax</span>
            </h1>
            <p className="text-base mt-5 mb-7 max-w-[46ch]" style={{ color: '#d7e3da' }}>
              Sân cầu lông, sân bóng đá, lớp đào tạo thể thao, tiệc cưới sân vườn và Café Lavie en Rose — tất cả ở cùng một địa chỉ.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <SportPickerTrigger className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3" style={{ background: LIME, color: INK }}>
                Đặt sân ngay <ArrowRight size={16} />
              </SportPickerTrigger>
              <a href="#dichvu" className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3 border" style={{ borderColor: 'rgba(255,255,255,.4)', color: PAPER }}>
                Khám phá tổ hợp
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
          <div id="tintuc" className="rounded-[20px] p-6 border" style={{ background: `linear-gradient(160deg,#15543d,#0c3022)`, borderColor: 'rgba(156,226,92,.22)' }}>
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: LIME, color: INK }}>Tin tức &amp; sự kiện</span>
            <h3 className="mt-3.5 mb-4 text-lg" style={{ fontFamily: 'var(--font-bricolage)' }}>Đang diễn ra tại Song Thạch</h3>

            {posts.length === 0 ? (
              <p className="text-sm" style={{ color: '#aebfb4' }}>Chưa có tin tức nào.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="flex gap-3 items-center rounded-xl p-2.5 transition-colors hover:bg-white/5"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ background: '#0e3a2a' }}>
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
              <h2 className="font-bold tracking-tight max-w-[18ch]" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(26px,4vw,38px)', color: INK }}>
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
                  className="relative block rounded-[14px] border p-6 transition-shadow hover:shadow-lg"
                  style={{ background: '#fff', borderColor: LINE }}
                >
                  <span
                    className="absolute top-4.5 right-4.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: rose ? ROSE_SOFT : SAND, color: rose ? ROSE : PITCH }}
                  >
                    {s.badge}
                  </span>
                  <div
                    className="w-[50px] h-[50px] rounded-xl flex items-center justify-center mt-7 mb-4 overflow-hidden"
                    style={{ background: rose ? ROSE_SOFT : SAND, color: rose ? ROSE : PITCH }}
                  >
                    {s.image ? (
                      <Image src={s.image} alt="" width={32} height={32} />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1.5" style={{ fontFamily: 'var(--font-bricolage)', color: INK }}>{s.label}</h3>
                  <p className="text-sm" style={{ color: MUTED }}>{s.desc}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold" style={{ color: rose ? ROSE : LIME_DEEP }}>
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
          <div className="relative h-72 lg:h-[380px] rounded-[18px] overflow-hidden flex items-center justify-center" style={{ background: '#fff', border: `1px solid ${LINE}` }}>
            {cafeImage ? (
              <Image src={cafeImage} alt="Café Lavie en Rose" width={260} height={260} className="object-contain" />
            ) : null}
          </div>
          <div>
            <div className="text-xs font-semibold mb-2.5" style={{ color: ROSE }}>La Vie en Rose</div>
            <h2 className="font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(28px,4vw,38px)', color: INK }}>
              Nghỉ chân giữa một góc bình yên
            </h2>
            <p className="text-[15.5px] mb-6 max-w-[44ch]" style={{ color: '#54584d' }}>
              Một không gian xanh mát, yên tĩnh giữa lòng tổ hợp — nơi bạn thư giãn sau những trận đấu sôi nổi, hoặc đơn giản là thưởng thức một tách cà phê chất lượng trong không gian kiến trúc tinh tế.
            </p>
            <Link href="/cafe" className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3" style={{ background: INK, color: PAPER }}>
              Xem menu &amp; không gian <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Location ───────────────── */}
      <section className="py-16 md:py-20" style={{ background: PITCH, color: PAPER }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-center">
          <div>
            <h2 className="font-bold tracking-tight mb-5" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(26px,4vw,34px)' }}>Ghé Song Thạch</h2>
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
              className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3 mt-2"
              style={{ background: LIME, color: INK }}
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
      <footer className="py-12 md:py-16" style={{ background: INK, color: '#cfd4cb' }}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-9 mb-11">
            <div>
              <div className="flex items-center gap-2.5 font-extrabold text-lg mb-3.5" style={{ fontFamily: 'var(--font-bricolage)', color: PAPER }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: LIME_DEEP }} />
                SONG THẠCH
              </div>
              <p className="text-[13.5px] max-w-[34ch]" style={{ color: '#9aa098' }}>
                Tổ hợp dịch vụ thể thao, tiệc cưới và café — nơi mọi khoảnh khắc đều trở nên đáng nhớ.
              </p>
            </div>
            <div>
              <h5 className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ fontFamily: 'var(--font-plex-mono)', color: '#7f867d' }}>Thể thao</h5>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/sports/football" className="hover:text-white">Sân Bóng Đá</Link></li>
                <li><Link href="/sports/badminton" className="hover:text-white">Sân Cầu Lông</Link></li>
                <li><Link href="/sports/football#classes" className="hover:text-white">Đào tạo Bóng đá</Link></li>
                <li><Link href="/sports/badminton#classes" className="hover:text-white">Đào tạo Cầu lông</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ fontFamily: 'var(--font-plex-mono)', color: '#7f867d' }}>Dịch vụ</h5>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/wedding" className="hover:text-white">Tiệc cưới</Link></li>
                <li><Link href="/cafe" className="hover:text-white">Café Lavie en Rose</Link></li>
                <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] tracking-[0.1em] uppercase mb-4" style={{ fontFamily: 'var(--font-plex-mono)', color: '#7f867d' }}>Liên hệ</h5>
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
