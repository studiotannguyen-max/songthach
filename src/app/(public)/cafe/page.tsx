import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero, SectionHeader, Badge } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Café Lavie en Rose',
  description: 'Café Lavie en Rose — không gian xanh mát, yên tĩnh trong khuôn viên Song Thạch. Cà phê, trà,. Mở cửa 07:00–22:00, phục vụ khách nội khu và bên ngoài.',
};

// Menu thật — Lavie en Rose. m = size M, l = size L (k = nghìn đồng)
type MenuItem = { name: string; m: string; l?: string; best?: boolean };
type MenuCategory = { category: string; sizes?: boolean; highlight?: boolean; items: MenuItem[] };

const MENU: MenuCategory[] = [
  { category: 'Must Try', highlight: true, items: [
    { name: 'Choco Sữa Chuối',        m: '38' },
    { name: 'Sữa Chua Lắc Dâu Giòn',  m: '42' },
    { name: 'Phindi Hạnh Nhân',       m: '36' },
  ]},
  { category: 'Trà Sữa', sizes: true, items: [
    { name: 'Trà Sữa Ô Long Nhài',    m: '28', l: '32' },
    { name: 'Hồng Trà Tiramisu',      m: '34', l: '38', best: true },
    { name: 'Trà Sữa Truyền Thống',   m: '25', l: '30' },
  ]},
  { category: 'Matcha', sizes: true, items: [
    { name: 'Matcha Oreo',            m: '40', l: '46' },
    { name: 'Matcha Latte',           m: '36', l: '42' },
    { name: 'Matcha Sữa Dừa',         m: '40', l: '45' },
  ]},
  { category: 'Đá Xay', items: [
    { name: 'Cacao Đá Xay',           m: '36', best: true },
    { name: 'Đậu Xanh Đá Xay',        m: '35' },
    { name: 'Matcha Đá Xay',          m: '40' },
  ]},
  { category: 'Trà Trái Cây', sizes: true, items: [
    { name: 'Trà Cúc Lê',                 m: '32', l: '36' },
    { name: 'Trà Atiso Vải',              m: '30', l: '34', best: true },
    { name: 'Trà Atiso Thanh Xuân',       m: '30', l: '34', best: true },
    { name: 'Trà Thảo Mộc Lavie',         m: '34', l: '38' },
    { name: 'Trà Đào (Thạch Đào)',        m: '30', l: '35' },
    { name: 'Trà Đác Thơm',               m: '34', l: '38' },
    { name: 'Trà Chanh',                  m: '20', l: '24' },
    { name: 'Trà Măng Cầu Chanh Dây',     m: '34', l: '38' },
  ]},
  { category: 'Cà Phê', items: [
    { name: 'Cà Phê Đen',   m: '20' },
    { name: 'Cà Phê Sữa',   m: '20' },
    { name: 'Cà Phê Muối',  m: '25' },
    { name: 'Bạc Xỉu',      m: '25' },
  ]},
  { category: 'Toppings', items: [
    { name: 'Trân Châu Trắng',              m: '6' },
    { name: 'Trân Châu Tươi Đường Đen',     m: '10' },
    { name: 'Trân Châu Tươi Olong',         m: '10' },
  ]},
];

// Mã QR gọi món tại bàn (KiotViet). Thả file PNG tương ứng vào public/images/cafe/
const ORDER_QR = [
  { label: 'Sân Cầu',   img: '/images/cafe/qr-san-cau.png' },
  { label: 'Sân Bóng',  img: '/images/cafe/qr-san-bong.png' },
];

const HERO_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80';

const SPACES = [
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', label: 'Không gian trong nhà' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', label: 'Quầy bar' },
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', label: 'Góc ngoài trời' },
];

export default function CafePage() {
  return (
    <>
      <PageHero
        label="Tiện ích nội khu"
        title="Lavie en Rose"
        description="La vie en rose — Cuộc sống màu hồng. Mở cửa 07:00 – 22:00, phục vụ khách nội khu và bên ngoài."
        image={HERO_IMAGE}
        cta={{ label: 'Xem thực đơn', href: '#menu' }}
      />

      {/* ── Giới thiệu ───────────────── */}
      <section id="main-content" className="section">
        <div className="container-page max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.08em] text-brand-strong font-semibold mb-4">
            Câu chuyện của chúng tôi
          </p>
          <p className="text-xl md:text-2xl text-fg">
            Một không gian xanh mát, yên tĩnh giữa lòng tổ hợp — nơi bạn thư giãn sau những trận đấu sôi nổi,
            hoặc đơn giản là thưởng thức một tách cà phê chất lượng trong không gian kiến trúc tinh tế.
          </p>
        </div>
      </section>

      {/* ── Không gian ───────────────── */}
      <section className="section bg-bg-subtle">
        <div className="container-page">
          <SectionHeader label="Không gian" title="Ghé một góc yên tĩnh" align="center" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SPACES.map((s, i) => (
              <div
                key={s.label}
                className={`relative rounded border border-line overflow-hidden ${i === 0 ? 'col-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '16/9' : '1/1' }}
              >
                <Image
                  src={s.src}
                  alt={`${s.label} — café Lavie en Rose tại Song Thạch`}
                  fill
                  sizes={i === 0 ? '(max-width: 768px) 100vw, 67vw' : '(max-width: 768px) 50vw, 33vw'}
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink/70 to-transparent">
                  <p className="text-white text-sm font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thực đơn ───────────────── */}
      <section id="menu" className="section">
        <div className="container-page max-w-5xl">
          <SectionHeader
            label="Thực đơn"
            title="Menu thức uống"
            description="Xem trước menu rồi quét QR tại bàn để gọi món."
            align="center"
          />

          {/* Gọi món tại bàn qua QR */}
          <div
            id="order-qr"
            className="mb-12 rounded border border-line bg-bg-subtle p-5 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <div className="text-center sm:text-left">
              <p className="font-display uppercase tracking-[0.06em] text-fg">Gọi món tại bàn qua QR</p>
              <p className="text-sm text-fg-muted mt-1 max-w-xs">
                Quét mã khu bạn đang ngồi bằng camera điện thoại — món gửi thẳng tới quầy.
              </p>
              <p className="text-sm text-fg-muted mt-1">Vận hành bởi KiotViet</p>
            </div>
            <div className="flex gap-4">
              {ORDER_QR.map((qr) => (
                <div key={qr.label} className="text-center">
                  <div className="relative w-24 rounded border border-line bg-bg overflow-hidden" style={{ aspectRatio: '420 / 600' }}>
                    <Image
                      src={qr.img}
                      alt={`Mã QR gọi món khu vực ${qr.label} — Café Lavie en Rose`}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-fg mt-1.5">{qr.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {MENU.map((cat) => (
              <div
                key={cat.category}
                className={cat.highlight ? 'rounded border border-brand bg-bg-subtle p-6' : ''}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                  <h3 className="text-base tracking-[0.06em]">{cat.category}</h3>
                  {cat.sizes && (
                    <div className="flex gap-6 text-xs font-semibold text-fg-muted tracking-[0.08em]">
                      <span className="w-8 text-right">M</span>
                      <span className="w-8 text-right">L</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-4">
                      <p className="text-sm text-fg flex items-center gap-2 flex-wrap">
                        {item.name}
                        {item.best && <Badge tone="brand">Best</Badge>}
                      </p>
                      {cat.sizes ? (
                        <div className="flex gap-6 text-sm whitespace-nowrap">
                          <span className="w-8 text-right text-brand-strong font-semibold">{item.m}k</span>
                          <span className="w-8 text-right text-brand-strong font-semibold">{item.l ?? '—'}</span>
                        </div>
                      ) : (
                        <span className="text-brand-strong font-semibold text-sm whitespace-nowrap">{item.m}k</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-fg-muted mt-10">
            Giá tính theo nghìn đồng (k) · Đã bao gồm VAT · Menu có thể thay đổi theo mùa
          </p>
        </div>
      </section>
    </>
  );
}
