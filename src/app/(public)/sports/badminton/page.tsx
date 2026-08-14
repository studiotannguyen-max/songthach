import type { Metadata } from 'next';
import { Shield, Wrench, Users, GraduationCap, CheckCircle2, BookOpen, Award, Zap, TrendingUp, MapPin, Phone, ArrowRight } from 'lucide-react';
import BookingWidget from '@/components/sports/BookingWidget';
import { getGallery } from '@/lib/gallery';
import { PageHero, SectionHeader, Card, CardBody, Badge } from '@/components/ui';

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

const PRICE_ROWS = [
  { label: '05:00 – 17:00', price: '50.000đ', tag: 'Giờ thường' },
  { label: '17:00 – 22:00', price: '60.000đ', tag: 'Giờ vàng' },
];

export default async function BadmintonPage() {
  const dbImages = await getGallery('badminton');
  const heroSrc  = dbImages[0]?.url ?? '/images/sports/badminton-hero.jpg';

  return (
    <>
      <PageHero
        label="Khu thể thao Song Thạch"
        title="Sân Cầu Lông"
        description="3 sân tiêu chuẩn BWF · Mở cửa 06:00 – 22:00 mỗi ngày"
        image={heroSrc}
      />

      {/* ── Đặt sân + thông tin sân ───────────────── */}
      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Widget đặt sân — đứng trước trong HTML nên lên đầu trên điện thoại */}
            <div className="lg:col-start-3 lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <BookingWidget courts={COURTS} venueName="Sân Cầu lông" />
              </div>
            </div>

            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-10">
              {/* Danh sách sân */}
              <div>
                <h2 className="text-xl mb-4">Danh sách sân</h2>
                <div className="space-y-3">
                  {COURTS.map((c) => (
                    <div key={c.id} className="rounded border border-line bg-bg p-4">
                      <p className="font-display text-2xl text-brand-strong">{c.name}</p>
                      <p className="text-sm text-fg-muted mt-0.5">Tiêu chuẩn BWF · Sàn PVC</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiện ích */}
              <div>
                <h2 className="text-xl mb-4">Tiện ích &amp; thiết bị</h2>
                <div className="space-y-3">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="flex items-start gap-3 rounded border border-line bg-bg p-4">
                      <span className="w-10 h-10 grid place-items-center shrink-0 rounded border border-line bg-bg-subtle text-brand-strong">
                        <f.icon size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-fg">{f.title}</p>
                        <p className="text-sm text-fg-muted mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bảng giá */}
              <div>
                <h2 className="text-xl mb-4">Bảng giá thuê sân</h2>

                {/* Điện thoại — danh sách */}
                <ul className="md:hidden rounded border border-line divide-y divide-line">
                  {PRICE_ROWS.map((row) => (
                    <li key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                      <span className="text-sm text-fg">
                        {row.label}
                        <span className="block text-xs text-fg-muted">{row.tag}</span>
                      </span>
                      <span className="text-sm font-semibold text-fg">{row.price}</span>
                    </li>
                  ))}
                </ul>

                {/* Máy tính — bảng */}
                <table className="hidden md:table w-full rounded border border-line border-collapse text-sm">
                  <thead>
                    <tr className="bg-bg-subtle">
                      <th scope="col" className="text-left px-4 py-3 font-display uppercase tracking-[0.06em] text-xs text-fg">Khung giờ</th>
                      <th scope="col" className="text-right px-4 py-3 font-display uppercase tracking-[0.06em] text-xs text-fg">Giá / giờ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_ROWS.map((row) => (
                      <tr key={row.label} className="border-t border-line">
                        <td className="px-4 py-3 text-fg">
                          {row.label}
                          <span className="block text-xs text-fg-muted">{row.tag}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-fg">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="text-sm text-fg-muted mt-3">Giá tính theo giờ/sân · Đặt cọc 30% khi đặt online</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Chiêu sinh lớp cầu lông ───────────────── */}
      <section id="classes" className="section bg-bg-subtle">
        <div className="container-page">
          <SectionHeader
            label="Chiêu sinh — Song Thạch Badminton Club"
            title="Lớp cầu lông chất lượng cao"
            description="Nâng tầm kỹ thuật – Chắp cánh đam mê. Học tại sân cầu lông Song Thạch."
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Cột trái: tiêu chí, hình thức tuyển sinh, liên hệ */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardBody>
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-brand-strong" aria-hidden="true" /> Tiêu chí đào tạo
                  </h3>
                  <ul className="space-y-3 mb-4">
                    {TRAINING_HIGHLIGHTS.map((h) => (
                      <li key={h.title} className="flex items-center gap-3">
                        <span className="w-9 h-9 grid place-items-center shrink-0 rounded border border-line bg-bg-subtle text-brand-strong">
                          <h.icon size={15} aria-hidden="true" />
                        </span>
                        <span className="text-sm text-fg">{h.title}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-fg-muted border-t border-line pt-3">
                    <span className="text-brand-strong font-semibold">Cam kết:</span> Có nhiều năm kinh nghiệm thi đấu và huấn luyện. Đảm bảo uy tín – Tận tâm – Chất lượng đầu ra.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Users size={18} className="text-brand-strong" aria-hidden="true" /> Hình thức tuyển sinh
                  </h3>
                  <ul className="space-y-2">
                    {ENROLL_OPTIONS.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-sm text-fg">
                        <CheckCircle2 size={15} className="text-brand-strong shrink-0" aria-hidden="true" /> {o}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-sm text-fg-muted mb-3 text-center">Liên hệ đăng ký (Phone / Zalo)</p>
                  <div className="flex flex-col gap-3">
                    {ENROLL_CONTACTS.map((c, i) => (
                      <a
                        key={c.phone}
                        href={`tel:${c.phone}`}
                        className={i === 0 ? 'btn-brand' : 'inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded border border-line text-sm text-fg hover:border-brand hover:text-brand-strong transition-colors'}
                      >
                        <Phone size={16} aria-hidden="true" /> {c.display} ({c.name})
                      </a>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Cột phải: giáo trình & học phí theo cấp độ */}
            <div className="lg:col-span-3 space-y-4">
              {PRICE_LEVELS.map((lvl) => (
                <Card key={lvl.level}>
                  <CardBody>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
                      <div className="flex-1">
                        <Badge tone="brand">{lvl.level}</Badge>
                        <h3 className="text-xl mt-3 mb-1">Cấp độ {lvl.level}</h3>
                        <p className="text-sm text-fg-muted mb-3">{lvl.desc}</p>
                        <ul className="space-y-1.5">
                          {lvl.curriculum.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm text-fg-muted">
                              <CheckCircle2 size={14} className="text-brand-strong mt-1 shrink-0" aria-hidden="true" /> {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <ul className="w-full sm:w-56 shrink-0 self-start rounded border border-line divide-y divide-line">
                        {lvl.rows.map((r) => (
                          <li key={r.age} className="px-3 py-3">
                            <p className="text-sm text-fg-muted">{r.age}</p>
                            <p className="text-fg font-semibold">
                              {r.perMonth}đ<span className="text-fg-muted font-normal text-sm">/tháng</span>
                            </p>
                            <p className="text-sm text-fg-muted">{r.perSession}đ/buổi</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardBody>
                </Card>
              ))}
              <p className="text-center text-sm text-fg-muted">
                <GraduationCap size={14} className="inline mr-1 text-brand-strong" aria-hidden="true" />
                Tất cả các lớp đều học 8 buổi / tháng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vị trí ───────────────── */}
      <section className="section">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] mb-4">Vị trí sân cầu lông</h2>
            <p className="flex items-start gap-2 text-fg-muted mb-6">
              <MapPin size={18} className="text-brand-strong shrink-0 mt-1" aria-hidden="true" />
              9B/3, Ấp An Hòa, Xã Hưng Thịnh, Đồng Nai
            </p>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="btn-brand">
              Chỉ đường <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="rounded border border-line overflow-hidden h-[300px]">
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
    </>
  );
}
