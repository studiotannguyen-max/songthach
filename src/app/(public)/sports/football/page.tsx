import type { Metadata } from 'next';
import { Lightbulb, Car, GraduationCap, Clock, CalendarDays, Users, MapPin, Phone, Building2 } from 'lucide-react';
import FootballBookingPanel from '@/components/sports/FootballBookingPanel';
import { getGallery } from '@/lib/gallery';
import { PageHero, SectionHeader, Card, CardBody } from '@/components/ui';

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

const PRICE_ROWS = [
  { label: 'Sân 5 · Giờ thường (06:00 – 17:00)', price: '120.000đ' },
  { label: 'Sân 5 · Giờ vàng (17:00 – 22:00)',   price: '170.000đ' },
  { label: 'Sân 7 · Giờ thường (06:00 – 17:00)', price: '300.000đ' },
  { label: 'Sân 7 · Giờ vàng (17:00 – 22:00)',   price: '350.000đ' },
];

const CLASS_ROWS = [
  { icon: Clock,          label: 'Lịch học', value: SUMMER_CLASS.schedule },
  { icon: GraduationCap,  label: 'Học phí',  value: SUMMER_CLASS.price },
  { icon: MapPin,         label: 'Địa điểm', value: `Sân bóng đá Song Thạch — ${SUMMER_CLASS.address}` },
];

export default async function FootballPage() {
  const dbImages = await getGallery('football');
  const heroSrc  = dbImages[0]?.url;

  return (
    <>
      <PageHero
        label="Khu thể thao Song Thạch"
        title="Sân Bóng Đá"
        description="3 sân 5 người và 1 sân 7 người · Cỏ nhân tạo thế hệ 3, đèn LED chuẩn thi đấu"
        image={heroSrc}
      />

      {/* ── Đặt sân + thông tin sân ───────────────── */}
      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Widget đặt sân — đứng trước trong HTML nên lên đầu trên điện thoại */}
            <div className="lg:col-start-3 lg:col-span-3">
              <FootballBookingPanel courts5={COURTS_5} courts7={COURTS_7} />
            </div>

            <div className="lg:col-start-1 lg:row-start-1 lg:col-span-2 space-y-10">
              {/* Sân 5 người */}
              <div>
                <h2 className="text-xl mb-4">Sân 5 người</h2>
                <div className="grid grid-cols-2 gap-3">
                  {COURTS_5.map((c) => (
                    <div key={c.id} className="rounded border border-line bg-bg p-4">
                      <p className="font-display text-2xl text-brand-strong">{c.name}</p>
                      <p className="text-sm text-fg-muted mt-0.5">Kích thước 25×45m</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sân 7 người */}
              <div>
                <h2 className="text-xl mb-4">Sân 7 người</h2>
                {COURTS_7.map((c) => (
                  <div key={c.id} className="rounded border border-line bg-bg p-4">
                    <p className="font-display text-2xl text-brand-strong">{c.name}</p>
                    <p className="text-sm text-fg-muted mt-0.5">Kích thước 45×65m · Sức chứa 14 VĐV</p>
                  </div>
                ))}
              </div>

              {/* Tiện ích */}
              <div>
                <h2 className="text-xl mb-4">Tiện ích</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="rounded border border-line bg-bg p-4">
                      <f.icon size={20} className="text-brand-strong mb-2" aria-hidden="true" />
                      <p className="font-semibold text-sm text-fg">{f.title}</p>
                      <p className="text-sm text-fg-muted mt-0.5">{f.desc}</p>
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
                      <span className="text-sm text-fg">{row.label}</span>
                      <span className="text-sm font-semibold text-fg whitespace-nowrap">{row.price}</span>
                    </li>
                  ))}
                </ul>

                {/* Máy tính — bảng */}
                <table className="hidden md:table w-full rounded border border-line border-collapse text-sm">
                  <thead>
                    <tr className="bg-bg-subtle">
                      <th scope="col" className="text-left px-4 py-3 font-display uppercase tracking-[0.06em] text-xs text-fg">Loại sân · Khung giờ</th>
                      <th scope="col" className="text-right px-4 py-3 font-display uppercase tracking-[0.06em] text-xs text-fg">Giá / giờ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_ROWS.map((row) => (
                      <tr key={row.label} className="border-t border-line">
                        <td className="px-4 py-3 text-fg">{row.label}</td>
                        <td className="px-4 py-3 text-right font-semibold text-fg whitespace-nowrap">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="text-sm text-fg-muted mt-3">Giá tính theo giờ/sân · Đặt cọc 30–50% khi đặt online</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Chiêu sinh lớp bóng đá ───────────────── */}
      <section id="classes" className="section bg-bg-subtle">
        <div className="container-page">
          <SectionHeader
            label="Chiêu sinh — Văn Tâm Đồng Nai (Vệ tinh PVF)"
            title="Lớp bóng đá hè"
            description={`Học tại sân bóng đá Song Thạch — ${SUMMER_CLASS.address}`}
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Cột trái: thông tin chương trình + liên hệ */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardBody>
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Building2 size={18} className="text-brand-strong" aria-hidden="true" /> Thông tin chương trình
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { icon: Building2,    text: SUMMER_CLASS.org },
                      { icon: Users,        text: `Đối tượng: ${SUMMER_CLASS.ageRange}` },
                      { icon: CalendarDays, text: `Khai giảng: ${SUMMER_CLASS.startDate}` },
                    ].map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        <span className="w-9 h-9 grid place-items-center shrink-0 rounded border border-line bg-bg-subtle text-brand-strong">
                          <item.icon size={15} aria-hidden="true" />
                        </span>
                        <span className="text-sm text-fg">{item.text}</span>
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

            {/* Cột phải: lịch học, học phí, địa điểm */}
            <div className="lg:col-span-3">
              <Card>
                <CardBody>
                  <h3 className="text-lg mb-4">Thông tin lớp học</h3>
                  <ul className="rounded border border-line divide-y divide-line">
                    {CLASS_ROWS.map((row) => (
                      <li key={row.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3">
                        <span className="flex items-center gap-2 text-sm text-fg-muted">
                          <row.icon size={14} className="text-brand-strong" aria-hidden="true" /> {row.label}
                        </span>
                        <span className="text-sm font-semibold text-fg sm:text-right">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-fg-muted mt-3">
                    Đăng ký theo tháng · Liên hệ trực tiếp HLV phụ trách qua hotline bên cạnh
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
