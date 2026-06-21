import type { Metadata } from 'next';
import Image from 'next/image';
import { Shield, Wrench, Users, GraduationCap, CheckCircle2, BookOpen, Award, Zap, TrendingUp, MapPin, Phone, ArrowRight } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import BookingWidget from '@/components/sports/BookingWidget';
import { getGallery } from '@/lib/gallery';

// Đọc lại ảnh từ DB mỗi 60s — admin đổi ảnh nền sẽ hiện sau ~1 phút
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sân Cầu lông',
  description: '3 sân cầu lông tiêu chuẩn BWF tại Song Thạch — sàn PVC chính hãng, ánh sáng LED. Đặt sân online nhanh chóng, mở cửa 06:00–22:00.',
};

const TRAINING_HIGHLIGHTS = [
  { icon: BookOpen,   title: 'Giáo trình bài bản' },
  { icon: Award,      title: 'Huấn luyện chuyên nghiệp' },
  { icon: Zap,        title: 'Môi trường năng động' },
  { icon: TrendingUp, title: 'Tiến bộ rõ rệt' },
];

const ENROLL_OPTIONS = [
  'Mọi trình độ – lứa tuổi',
  'Nhận dạy kèm 1 – 1',
  'Nhận dạy nhóm – gia đình – công ty',
];

const PRICE_LEVELS = [
  {
    level: 'Cơ bản',
    levelColor: 'bg-green-100 text-green-700',
    desc: 'Mới bắt đầu, học kỹ thuật nền tảng',
    curriculum: [
      'Kỹ thuật cầm vợt, di chuyển và tư thế chuẩn',
      'Giao cầu thấp tay, cao tay đúng luật',
      'Các đường đánh cơ bản: phông cầu, cắt cầu, bỏ nhỏ',
    ],
    rows: [
      { age: 'Dưới 11 tuổi', perSession: '62.500',  perMonth: '500.000' },
      { age: 'Trên 11 tuổi', perSession: '75.000',  perMonth: '600.000' },
    ],
  },
  {
    level: 'Trung bình',
    levelColor: 'bg-orange-100 text-orange-700',
    desc: 'Biết cơ bản, nâng cao kỹ thuật',
    curriculum: [
      'Hoàn thiện kỹ thuật đánh cao sâu, đập cầu, bỏ nhỏ tinh tế',
      'Phối hợp di chuyển – phòng thủ – tấn công',
      'Bài tập thể lực và chiến thuật đôi cơ bản',
    ],
    rows: [
      { age: 'Dưới 11 tuổi', perSession: '75.000',  perMonth: '600.000' },
      { age: 'Trên 11 tuổi', perSession: '87.500',  perMonth: '700.000' },
    ],
  },
  {
    level: 'Nâng cao',
    levelColor: 'bg-red-100 text-red-700',
    desc: 'Thi đấu, chiến thuật chuyên sâu',
    curriculum: [
      'Chiến thuật thi đấu đơn, đôi nâng cao',
      'Rèn phản xạ, tốc độ, sức bền chuyên sâu',
      'Cọ xát thi đấu thực tế, phân tích & khắc chế đối thủ',
    ],
    rows: [
      { age: 'Dưới 11 tuổi', perSession: '87.500',  perMonth: '700.000' },
      { age: 'Trên 11 tuổi', perSession: '100.000', perMonth: '800.000' },
    ],
  },
];

const ENROLL_CONTACTS = [
  { phone: '0794878297', display: '0794 878 297', name: 'Ms. Tiên' },
  { phone: '0378990979', display: '0378 990 979', name: 'Mr. Tân' },
];

const COURTS = [
  { id: 'court-1', name: 'Sân 1', type: 'badminton' as const },
  { id: 'court-2', name: 'Sân 2', type: 'badminton' as const },
  { id: 'court-3', name: 'Sân 3', type: 'badminton' as const },
];

const MAP_LINK = 'https://maps.app.goo.gl/As3cSj4JTF49MsLVA';
const MAP_EMBED_SRC = 'https://www.google.com/maps?q=10.950334,107.045569&z=16&output=embed';

const FEATURES = [
  { icon: Shield, title: 'Sàn PVC chính hãng',    desc: 'Giảm chấn tốt, bảo vệ khớp gối.' },
  { icon: Users,  title: 'Cho thuê vợt & cầu',    desc: 'Thiết bị chuẩn chất lượng cho thuê tại sân.' },
  { icon: Wrench, title: 'Nhận đan vợt',          desc: 'Dịch vụ đan vợt chuyên nghiệp, đa dạng loại dây và lực căng theo yêu cầu.' },
];

export default async function BadmintonPage() {
  const dbImages = await getGallery('badminton');
  const heroSrc  = dbImages[0]?.url ?? '/images/sports/badminton-hero.jpg';

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section id="main-content" className="relative h-[55vh] min-h-[400px] flex items-end">
        <Image
          src={heroSrc}
          alt="Sân cầu lông tiêu chuẩn BWF tại Song Thạch — sàn PVC chuyên nghiệp, ánh sáng LED"
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sports-dark/40 to-sports-dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <p className="sports-hero-text text-sports-accent text-sm tracking-widest mb-2">KHU THỂ THAO SONG THẠCH</p>
          <h1 className="sports-hero-text text-5xl md:text-6xl font-bold text-white">
            SÂN CẦU LÔNG
          </h1>
          <p className="text-white/70 mt-3 text-lg">3 sân tiêu chuẩn · Mở cửa 06:00 – 22:00</p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Right: booking widget — first in HTML = first on mobile */}
            <div className="lg:col-start-3 lg:col-span-3">
              <div className="sticky top-24">
                <BookingWidget courts={COURTS} venueName="Sân Cầu lông" />
              </div>
            </div>

            {/* Left: info — explicit col placement keeps it left on desktop */}
            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-8">
              {/* Court cards — Tên sân ưu tiên hiển thị lớn nhất */}
              <div>
                <h2 className="sports-hero-text text-xl font-bold text-sports-dark mb-4">Danh sách sân</h2>
                <div className="space-y-3">
                  {COURTS.map((c, i) => (
                    <div key={c.id} className="sports-card p-4 flex items-center justify-between">
                      <div>
                        {/* Tên sân: cấp bậc cao nhất, font lớn nhất */}
                        <p className="sports-hero-text text-2xl font-bold text-sports-primary">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Tiêu chuẩn BWF · Sàn PVC</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-red-400' : 'bg-green-400'}`} title={i === 1 ? 'Đang có người' : 'Trống'} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="sports-hero-text text-xl font-bold text-sports-dark mb-4">Tiện ích & Thiết bị</h2>
                <div className="grid grid-cols-1 gap-3">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                      <div className="w-9 h-9 bg-sports-light rounded-lg flex items-center justify-center shrink-0">
                        <f.icon size={18} className="text-sports-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{f.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="gradient-sports px-4 py-3">
                  <p className="sports-hero-text font-bold text-white text-sm tracking-wider">BẢNG GIÁ</p>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 text-gray-500 font-medium">Khung giờ</th>
                    <th className="text-right px-4 py-2 text-gray-500 font-medium">Giá / giờ</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { label: '05:00 – 17:00', price: '50.000', tag: 'Giờ thường' },
                      { label: '17:00 – 22:00', price: '60.000', tag: 'Giờ vàng' },
                    ].map(row => (
                      <tr key={row.label} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{row.label}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${row.tag === 'Giờ vàng' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{row.tag}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-sports-primary">{row.price}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 px-4 py-3 border-t border-gray-50">Giá tính theo giờ/sân · Đặt cọc 30% khi đặt online</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CHIÊU SINH LỚP CẦU LÔNG HÈ ─────────────────── */}
      <section id="classes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sports-light text-sports-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              <GraduationCap size={14} /> Chiêu sinh hè — Song Thạch Badminton Club
            </div>
            <h2 className="text-4xl font-bold text-sports-dark mb-2">Lớp Cầu Lông Chất Lượng Cao</h2>
            <p className="sports-hero-text text-sports-primary italic text-lg mb-3">Nâng tầm kỹ thuật – Chắp cánh đam mê</p>
            <p className="text-gray-500 flex items-center justify-center gap-1.5">
              <MapPin size={14} className="text-sports-primary shrink-0" /> Sân cầu lông Song Thạch
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cột trái: tiêu chí, hình thức tuyển sinh, liên hệ */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tiêu chí đào tạo */}
              <div className="sports-card p-6">
                <h3 className="sports-hero-text text-lg font-bold text-sports-dark mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-sports-primary" /> Tiêu chí đào tạo
                </h3>
                <ul className="space-y-3 mb-4">
                  {TRAINING_HIGHLIGHTS.map((h) => (
                    <li key={h.title} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sports-light flex items-center justify-center shrink-0">
                        <h.icon size={15} className="text-sports-primary" />
                      </div>
                      <span className="text-sm text-gray-700">{h.title}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span className="text-sports-primary font-semibold">Cam kết:</span> Có nhiều năm kinh nghiệm thi đấu và huấn luyện. Đảm bảo uy tín – Tận tâm – Chất lượng đầu ra.
                </p>
              </div>

              {/* Hình thức tuyển sinh */}
              <div className="sports-card p-6">
                <h3 className="sports-hero-text text-lg font-bold text-sports-dark mb-4 flex items-center gap-2">
                  <Users size={18} className="text-sports-primary" /> Hình thức tuyển sinh
                </h3>
                <ul className="space-y-2">
                  {ENROLL_OPTIONS.map((o) => (
                    <li key={o} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-sports-primary shrink-0" /> {o}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Liên hệ đăng ký */}
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

            {/* Cột phải: giáo trình & bảng giá theo cấp độ */}
            <div className="lg:col-span-3 space-y-4">
              {PRICE_LEVELS.map((lvl) => (
                <div key={lvl.level} className="sports-card p-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${lvl.levelColor}`}>{lvl.level}</span>
                    <h3 className="sports-hero-text text-xl font-bold text-sports-dark mt-2 mb-1">Cấp độ {lvl.level}</h3>
                    <p className="text-gray-400 text-xs mb-3">{lvl.desc}</p>
                    <ul className="space-y-1.5">
                      {lvl.curriculum.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={13} className="text-sports-primary mt-0.5 shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <table className="w-full sm:w-56 text-sm shrink-0 self-start">
                    <thead>
                      <tr className="text-gray-400 text-xs">
                        <th className="text-left pb-2 font-medium">Độ tuổi</th>
                        <th className="text-right pb-2 font-medium">Học phí</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lvl.rows.map((r) => (
                        <tr key={r.age}>
                          <td className="py-3 text-gray-600">{r.age}</td>
                          <td className="py-3 text-right">
                            <p className="text-sports-dark font-bold">{r.perMonth}đ<span className="text-gray-400 font-normal text-xs">/tháng</span></p>
                            <p className="text-gray-400 text-xs">{r.perSession}đ/buổi</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <p className="text-center text-gray-400 text-xs">Tất cả các lớp đều học 8 buổi / tháng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vị trí ──────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="sports-hero-text text-3xl font-bold text-sports-dark mb-4">Vị trí Sân Cầu lông</h2>
            <p className="flex items-start gap-2 text-gray-600 mb-6">
              <MapPin size={18} className="text-sports-primary shrink-0 mt-0.5" />
              9B/3, Ấp An Hòa, Xã Hưng Thịnh, Đồng Nai
            </p>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="sports-btn inline-flex items-center gap-2"
            >
              Chỉ đường <ArrowRight size={16} />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-[300px]">
            <iframe
              src={MAP_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí Sân Cầu lông Song Thạch"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
