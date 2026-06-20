import Link from 'next/link';
import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const GREEN  = '#0D4428';
const YELLOW = '#FBD043';

export default function Footer() {
  return (
    <footer aria-label="Thông tin Song Thạch" className="pb-24 sm:pb-0">
      {/* Mobile footer — chỉ địa chỉ + SĐT, giữ nguyên gọn nhẹ */}
      <div className="sm:hidden px-4 py-6 space-y-2.5" style={{ background: GREEN, color: '#fff' }}>
        <a href="https://maps.google.com/?q=9B/3+Ấp+An+Hoà,+Xã+Hưng+Thịnh,+TP+Đồng+Nai" target="_blank" rel="noopener noreferrer"
           className="flex items-start gap-2.5">
          <MapPin size={14} style={{ color: YELLOW }} className="shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed">9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai</span>
        </a>
        <div className="flex items-center gap-2.5">
          <Phone size={14} style={{ color: YELLOW }} className="shrink-0" />
          <span className="text-xs">
            <a href="tel:0378990979" className="hover:underline">0378 990 979</a>
            <span className="mx-1.5 opacity-50">·</span>
            <a href="tel:0886798690" className="hover:underline">0886 798 690</a>
          </span>
        </div>
      </div>

      {/* Desktop footer — nền xanh rêu, logo + social ở giữa, 2 cột link 2 bên */}
      <div className="hidden sm:block" style={{ background: GREEN, color: 'rgba(255,255,255,.75)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Logo + tagline + social — hàng trên, full chiều ngang */}
          <div className="flex flex-col items-center text-center pb-10 border-b border-white/15">
            <span className="text-3xl tracking-[0.2em] uppercase font-semibold text-white"
                  style={{ fontFamily: 'var(--font-playfair)' }}>Song Thạch</span>
            <p className="text-sm leading-relaxed mt-3 max-w-md">
              Tổ hợp dịch vụ thể thao, tiệc cưới và café — nơi mọi khoảnh khắc đều trở nên đáng nhớ.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Song Thạch trên Facebook" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: YELLOW, color: GREEN }}>
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Song Thạch trên Instagram" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: YELLOW, color: GREEN }}>
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* 3 cột thông tin — hàng dưới */}
          <div className="grid sm:grid-cols-3 gap-10 items-start mt-10">
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em] text-white">Khu Thể thao</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/sports/football" className="hover:text-white transition-colors">Sân Bóng Đá 5 người</Link></li>
                <li><Link href="/sports/football" className="hover:text-white transition-colors">Sân Bóng Đá 7 người</Link></li>
                <li><Link href="/sports/badminton" className="hover:text-white transition-colors">Sân Cầu Lông</Link></li>
                <li><Link href="/sports" className="hover:text-white transition-colors">Bảng giá &amp; Khuyến mãi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em] text-white">Nhà hàng Tiệc cưới</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/wedding" className="hover:text-white transition-colors">Giới thiệu sảnh</Link></li>
                <li><Link href="/wedding#gallery" className="hover:text-white transition-colors">Thư viện ảnh</Link></li>
                <li><Link href="/wedding#inquiry" className="hover:text-white transition-colors">Đặt lịch tư vấn</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em] text-white">Liên hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} style={{ color: YELLOW }} className="mt-0.5 shrink-0" />
                  <span>9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={15} style={{ color: YELLOW }} className="mt-0.5 shrink-0" />
                  <span className="flex flex-col">
                    <a href="tel:0378990979" className="hover:text-white transition-colors">0378 990 979</a>
                    <a href="tel:0886798690" className="hover:text-white transition-colors">0886 798 690</a>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={15} style={{ color: YELLOW }} className="mt-0.5 shrink-0" />
                  <span>Mở cửa hàng ngày: 06:00 – 22:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — vàng, copyright + pháp lý */}
      <div className="hidden sm:block" style={{ background: YELLOW, color: GREEN }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>© {new Date().getFullYear()} Song Thạch. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Chính sách bảo mật</a>
            <a href="#" className="hover:underline">Điều khoản sử dụng</a>
            <a href="#" className="hover:underline">Chính sách hủy sân</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
