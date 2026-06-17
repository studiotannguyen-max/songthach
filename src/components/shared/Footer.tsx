import Link from 'next/link';
import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t border-border pb-24 sm:pb-0" aria-label="Thông tin Song Thạch">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">

        {/* Mobile footer — chỉ địa chỉ + SĐT */}
        <div className="sm:hidden space-y-2.5">
          <a href="https://maps.google.com/?q=9B/3+Ấp+An+Hoà,+Xã+Hưng+Thịnh,+TP+Đồng+Nai" target="_blank" rel="noopener noreferrer"
             className="flex items-start gap-2.5">
            <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed">9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai</span>
          </a>
          <div className="flex items-center gap-2.5">
            <Phone size={14} className="text-primary shrink-0" />
            <span className="text-xs">
              <a href="tel:0378990979" className="hover:text-foreground transition-colors">0378 990 979</a>
              <span className="mx-1.5 opacity-40">·</span>
              <a href="tel:0886798690" className="hover:text-foreground transition-colors">0886 798 690</a>
            </span>
          </div>
        </div>

        {/* Desktop layout — giữ nguyên */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-10">
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-foreground text-xl tracking-[0.18em] uppercase font-semibold"
                    style={{ fontFamily: 'var(--font-playfair)' }}>Song Thạch</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Tổ hợp dịch vụ thể thao, tiệc cưới và café — nơi mọi khoảnh khắc đều trở nên đáng nhớ.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Song Thạch trên Facebook" className="w-9 h-9 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Song Thạch trên Instagram" className="w-9 h-9 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Khu Thể thao</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/sports/football" className="hover:text-primary transition-colors">Sân Bóng Đá 5 người</Link></li>
              <li><Link href="/sports/football" className="hover:text-primary transition-colors">Sân Bóng Đá 7 người</Link></li>
              <li><Link href="/sports/badminton" className="hover:text-primary transition-colors">Sân Cầu Lông</Link></li>
              <li><Link href="/sports" className="hover:text-primary transition-colors">Bảng giá & Khuyến mãi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Nhà hàng Tiệc cưới</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/wedding" className="hover:text-primary transition-colors">Giới thiệu sảnh</Link></li>
              <li><Link href="/wedding#gallery" className="hover:text-primary transition-colors">Thư viện ảnh</Link></li>
              <li><Link href="/wedding#inquiry" className="hover:text-primary transition-colors">Đặt lịch tư vấn</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <span>9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-primary mt-0.5 shrink-0" />
                <span className="flex flex-col">
                  <a href="tel:0378990979" className="hover:text-foreground transition-colors">0378 990 979</a>
                  <a href="tel:0886798690" className="hover:text-foreground transition-colors">0886 798 690</a>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-primary mt-0.5 shrink-0" />
                <span>Mở cửa hàng ngày: 06:00 – 22:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hidden sm:flex mt-12 pt-8 border-t border-border flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Song Thạch. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-foreground transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-foreground transition-colors">Chính sách hủy sân</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
