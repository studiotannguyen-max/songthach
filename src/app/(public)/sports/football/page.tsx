import type { Metadata } from 'next';
import Image from 'next/image';
import { Lightbulb, Car, GraduationCap, Clock, CalendarDays, Users, MapPin, Phone, Building2 } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FootballBookingPanel from '@/components/sports/FootballBookingPanel';
import { getGallery } from '@/lib/gallery';

// Đọc lại ảnh từ DB mỗi 60s — admin đổi ảnh nền sẽ hiện sau ~1 phút
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sân Bóng đá',
  description: 'Sân bóng đá 5 và 7 người tại Song Thạch — cỏ nhân tạo FIFA approved, đèn LED 1000W, phòng thay đồ đầy đủ. Đặt sân online 24/7.',
};

const SUMMER_CLASS = {
  org: 'Trung tâm đào tạo bóng đá Văn Tâm Đồng Nai – Vệ tinh PVF',
  ageRange: '7 – 14 tuổi',
  startDate: '01/06/2026',
  schedule: 'Thứ 2, Thứ 4, Thứ 6 · 17h30 – 19h00',
  price: '500.000đ / tháng',
  address: '9B/3, Ấp An Hòa, Xã Hưng Thịnh',
};

const ENROLL_CONTACTS = [
  { phone: '0837781818', display: '0837 781 818', name: 'Thầy Phụng' },
  { phone: '0915178939', display: '0915 178 939', name: 'Cô Hà' },
];

const COURTS_5 = [
  { id: 'fb5-1', name: 'Sân 5A', type: 'football_5' as const },
  { id: 'fb5-2', name: 'Sân 5B', type: 'football_5' as const },
  { id: 'fb5-3', name: 'Sân 5C', type: 'football_5' as const },
];
const COURTS_7 = [
  { id: 'fb7-1', name: 'Sân 7A', type: 'football_7' as const },
];

const FEATURES = [
  { icon: Lightbulb, title: 'Hệ thống đèn LED đạt tiêu chuẩn', desc: 'Đủ sáng cho thi đấu ban đêm.' },
  { icon: Car,       title: 'Bãi đỗ xe rộng rãi',              desc: 'Miễn phí 100% cho khách đặt sân.' },
];

export default async function FootballPage() {
  const dbImages = await getGallery('football');
  const heroSrc  = dbImages[0]?.url ?? 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80';

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section id="main-content" className="relative h-[42vh] sm:h-[55vh] min-h-[320px] flex items-end">
        <Image
          src={heroSrc}
          alt="Sân bóng đá cỏ nhân tạo thế hệ 3 tại Song Thạch, đèn LED chuẩn thi đấu"
          sizes="100vw"
          fill className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sports-dark/40 to-sports-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <p className="sports-hero-text text-sports-accent text-sm tracking-widest mb-2">KHU THỂ THAO SONG THẠCH</p>
          <h1 className="sports-hero-text text-5xl md:text-6xl font-bold text-white">SÂN BÓNG ĐÁ</h1>
          <div className="flex gap-3 mt-3">
            <span className="sports-hero-text text-sm font-medium bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full">
              3 sân 5 người
            </span>
            <span className="sports-hero-text text-sm font-medium bg-sports-primary text-white px-3 py-1 rounded-full">
              1 sân 7 người
            </span>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="bg-background py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Booking widget — first in HTML = first on mobile */}
            <div className="lg:col-start-3 lg:col-span-3">
              <FootballBookingPanel courts5={COURTS_5} courts7={COURTS_7} />
            </div>

            {/* Info — explicit col placement keeps it left on desktop */}
            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-8">
              {/* Sân 5 */}
              <div>
                <h2 className="sports-hero-text text-xl font-bold text-sports-dark mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-sports-accent rounded-md flex items-center justify-center text-white text-xs font-bold">5</span>
                  Sân 5 người
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {COURTS_5.map((c) => (
                    <div key={c.id} className="sports-card p-4">
                      {/* Tên sân — hiển thị lớn, ưu tiên cao nhất */}
                      <p className="sports-hero-text text-3xl font-bold text-sports-primary">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Kích thước 25×45m</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs text-green-600 font-medium">Đang trống</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sân 7 */}
              <div>
                <h2 className="sports-hero-text text-xl font-bold text-sports-dark mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-sports-primary rounded-md flex items-center justify-center text-white text-xs font-bold">7</span>
                  Sân 7 người
                </h2>
                {COURTS_7.map((c) => (
                  <div key={c.id} className="sports-card p-4">
                    <p className="sports-hero-text text-3xl font-bold text-sports-primary">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Kích thước 45×65m · Sức chứa 14 VĐV</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-xs text-green-600 font-medium">Đang trống</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map((f) => (
                  <div key={f.title} className="bg-card rounded-xl p-3 border border-border">
                    <f.icon size={18} className="text-sports-primary mb-2" />
                    <p className="font-semibold text-xs text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Price table */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="gradient-sports px-4 py-3">
                  <p className="sports-hero-text font-bold text-white text-sm tracking-wider">BẢNG GIÁ</p>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted">
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Loại sân · Khung giờ</th>
                    <th className="text-right px-4 py-2 text-muted-foreground font-medium">Giá / giờ</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { label: 'Sân 5 · Giờ thường (06:00 – 17:00)', price: '120.000' },
                      { label: 'Sân 5 · Giờ vàng (17:00 – 22:00)',   price: '170.000', peak: true },
                      { label: 'Sân 7 · Giờ thường (06:00 – 17:00)', price: '300.000' },
                      { label: 'Sân 7 · Giờ vàng (17:00 – 22:00)',   price: '350.000', peak: true },
                    ].map(row => (
                      <tr key={row.label} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-foreground/80 font-medium text-xs">{row.label}
                          {row.peak && <span className="ml-1 text-[9px] bg-sports-light text-sports-primary font-bold px-1 py-0.5 rounded">Giờ vàng</span>}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">{row.price}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground px-4 py-3 border-t border-border">Giá tính theo giờ/sân · Đặt cọc 30–50% khi đặt online</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CHIÊU SINH LỚP BÓNG ĐÁ HÈ ──────────────────── */}
      <section id="classes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sports-light text-sports-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              <GraduationCap size={14} /> Chiêu sinh hè — Văn Tâm Đồng Nai (Vệ tinh PVF)
            </div>
            <h2 className="sports-hero-text text-4xl font-bold text-sports-dark mb-2">Lớp Bóng Đá Hè</h2>
            <p className="text-gray-500 flex items-center justify-center gap-1.5">
              <MapPin size={14} className="text-sports-primary shrink-0" /> Sân bóng đá Song Thạch — {SUMMER_CLASS.address}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cột trái: thông tin chương trình + liên hệ đăng ký */}
            <div className="lg:col-span-2 space-y-6">
              <div className="sports-card p-6">
                <h3 className="sports-hero-text text-lg font-bold text-sports-dark mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-sports-primary" /> Thông tin chương trình
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                      <Building2 size={15} className="text-sports-primary" />
                    </div>
                    <span className="text-sm text-gray-700">{SUMMER_CLASS.org}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                      <Users size={15} className="text-sports-primary" />
                    </div>
                    <span className="text-sm text-gray-700">Đối tượng: {SUMMER_CLASS.ageRange}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                      <CalendarDays size={15} className="text-sports-primary" />
                    </div>
                    <span className="text-sm text-gray-700">Khai giảng: {SUMMER_CLASS.startDate}</span>
                  </li>
                </ul>
              </div>

              <div className="sports-card p-6 text-center">
                <p className="text-gray-500 text-sm mb-3">Liên hệ đăng ký (Phone / Zalo)</p>
                <div className="flex flex-col gap-3">
                  {ENROLL_CONTACTS.map((c, i) => (
                    <a
                      key={c.phone}
                      href={`tel:${c.phone}`}
                      className={i === 0
                        ? 'sports-btn flex items-center justify-center gap-2'
                        : 'flex items-center justify-center gap-2 border border-sports-primary text-sports-primary font-semibold px-6 py-3 rounded-xl hover:bg-sports-light transition-all'}
                    >
                      <Phone size={16} /> {c.display} ({c.name})
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải: lịch học, học phí, địa điểm */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="gradient-sports px-4 py-3">
                  <p className="sports-hero-text font-bold text-white text-sm tracking-wider">THÔNG TIN LỚP HỌC</p>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted">
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Thông tin</th>
                    <th className="text-right px-4 py-2 text-muted-foreground font-medium">Chi tiết</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground/80 font-medium text-xs">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-sports-primary" /> Lịch học</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">{SUMMER_CLASS.schedule}</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground/80 font-medium text-xs">
                        <span className="flex items-center gap-2"><GraduationCap size={14} className="text-sports-primary" /> Học phí</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">{SUMMER_CLASS.price}</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground/80 font-medium text-xs align-top">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-sports-primary" /> Địa điểm</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sports-primary text-xs">Sân bóng đá Song Thạch<br />{SUMMER_CLASS.address}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground px-4 py-3 border-t border-border">Đăng ký theo tháng · Liên hệ trực tiếp HLV phụ trách qua hotline bên cạnh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
