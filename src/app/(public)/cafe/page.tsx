import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
  title: 'Café Lavie en Rose',
  description: 'Café Lavie en Rose — không gian xanh mát, yên tĩnh trong khuôn viên Song Thạch. Cà phê, trà, nước ép tươi. Mở cửa 07:00–22:00, phục vụ khách nội khu và bên ngoài.',
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

// 3 mã QR gọi món tại bàn (KiotViet). Thả file PNG tương ứng vào public/images/cafe/
const ORDER_QR = [
  { label: 'Sân Cầu',   img: '/images/cafe/qr-san-cau.png' },
  { label: 'Sân Bóng',  img: '/images/cafe/qr-san-bong.png' },
];

const SPACES = [
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', label: 'Không gian trong nhà' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', label: 'Quầy bar' },
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80', label: 'Góc ngoài trời' },
];

export default function CafePage() {
  return (
    <div style={{ background: '#f5f0e8' }}>
      <Navbar />

      {/* Hero */}
      <section id="main-content" className="relative h-[80vh] min-h-[500px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80"
          alt="Không gian quán café Lavie en Rose trong khuôn viên tổ hợp Song Thạch"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(28,40,32,0.2) 0%, rgba(28,40,32,0.85) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <span className="cafe-tag mb-4 inline-block">Tiện ích nội khu</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Lavie en Rose
          </h1>
          <p className="text-white/70 text-lg mb-2" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
            La vie en rose — Cuộc sống màu hồng
          </p>
          <p className="text-white/60 text-sm">Mở cửa 07:00 – 22:00 · Phục vụ khách nội khu & bên ngoài</p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-px bg-cafe-accent mx-auto mb-8" />
          <p className="text-cafe-primary text-xs tracking-widest uppercase mb-4">Câu chuyện của chúng tôi</p>
          <p className="text-2xl text-cafe-dark leading-relaxed" style={{ fontFamily: 'var(--font-playfair)' }}>
            Một không gian xanh mát, yên tĩnh giữa lòng tổ hợp — nơi bạn thư giãn sau những trận đấu sôi nổi, hoặc đơn giản là thưởng thức một tách cà phê chất lượng trong không gian kiến trúc tinh tế.
          </p>
          <div className="w-12 h-px bg-cafe-accent mx-auto mt-8" />
        </div>
      </section>

      {/* Space Gallery — kiến trúc, không bóng người */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 h-72">
            {SPACES.map((s, i) => (
              <div key={s.label} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2' : ''}`}>
                <Image
                  src={s.src}
                  alt={`${s.label} — café Lavie en Rose tại Song Thạch`}
                  fill
                  sizes={i === 0 ? '(max-width: 768px) 100vw, 67vw' : '(max-width: 768px) 100vw, 33vw'}
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-sm font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-cafe-primary text-xs tracking-widest uppercase mb-3">Thực đơn</p>
            <h2 className="text-3xl font-bold text-cafe-dark" style={{ fontFamily: 'var(--font-playfair)' }}>Menu thức uống</h2>
            <p className="text-gray-400 text-sm mt-3">Xem trước menu rồi quét QR tại bàn để gọi món</p>
          </div>

          {/* Thanh gọi món QR — nhỏ gọn, ngay đầu menu */}
          <div id="order-qr" className="mb-12 rounded-2xl border border-cafe-accent/40 bg-cafe-light/60 p-5 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-cafe-primary font-semibold tracking-wide">Gọi món tại bàn qua QR</p>
              <p className="text-gray-500 text-xs mt-1 max-w-xs">Quét mã khu bạn đang ngồi bằng camera điện thoại — món gửi thẳng tới quầy.</p>
              <p className="text-gray-400 text-[10px] mt-1">Vận hành bởi KiotViet</p>
            </div>
            <div className="flex gap-3">
              {ORDER_QR.map((qr) => (
                <div key={qr.label} className="text-center">
                  <div className="relative w-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden" style={{ aspectRatio: '420 / 600' }}>
                    <Image
                      src={qr.img}
                      alt={`Mã QR gọi món khu vực ${qr.label} — Café Lavie en Rose`}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                  <p className="text-cafe-dark text-[11px] font-medium mt-1.5">{qr.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {MENU.map((cat) => (
              <div
                key={cat.category}
                className={cat.highlight ? 'rounded-2xl border border-cafe-accent/40 bg-cafe-light/50 p-6' : ''}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-cafe-accent/30">
                  <h3 className="text-cafe-primary font-semibold text-sm tracking-widest uppercase">
                    {cat.category}
                  </h3>
                  {cat.sizes && (
                    <div className="flex gap-6 text-[11px] font-semibold text-cafe-accent tracking-widest">
                      <span className="w-8 text-right">M</span>
                      <span className="w-8 text-right">L</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-4">
                      <p className="font-medium text-cafe-dark text-sm flex items-center gap-2">
                        {item.name}
                        {item.best && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-cafe-primary rounded-full px-2 py-0.5">
                            Best
                          </span>
                        )}
                      </p>
                      {cat.sizes ? (
                        <div className="flex gap-6 text-sm whitespace-nowrap">
                          <span className="w-8 text-right text-cafe-primary font-semibold">{item.m}k</span>
                          <span className="w-8 text-right text-cafe-primary font-semibold">{item.l ?? '—'}</span>
                        </div>
                      ) : (
                        <span className="text-cafe-primary font-semibold text-sm whitespace-nowrap">{item.m}k</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-10">
            Giá tính theo nghìn đồng (k) · Đã bao gồm VAT · Menu có thể thay đổi theo mùa
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
