import Link from 'next/link';
import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t border-border pb-24 sm:pb-0" aria-label="Thông tin Song Thạch">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">

        {/* Brand — full width trên mobile */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
          <span className="text-foreground text-lg tracking-[0.18em] uppercase font-semibold"
                style={{ fontFamily: 'var(--font-playfair)' }}>Song Thạch</span>
          <div className="flex gap-2">
            <a href="#" aria-label="Facebook" className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
              <Facebook size={14} />
            </a>
            <a href="#" aria-label="Instagram" className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
              <Instagram size={14} />
            </a>
          </div>
        </div>

        {/* Nav links — 2 cột trên mobile */}
        <div className="grid grid-cols-2 sm:hidden gap-x-4 gap-y-4 mb-6 text-sm">
          <div>
            <h4 className="text-foreground font-semibold mb-2 text-xs uppercase tracking-widest">Thể thao</h4>
            <ul className="space-y-1.5">
              <li><Link href="/sports/football" className="hover:text-primary transition-colors">Sân Bóng Đá</Link></li>
              <li><Link href="/sports/badminton" className="hover:text-primary transition-colors">Sân Cầu Lông</Link></li>
              <li><Link href="/sports" className="hover:text-primary transition-colors">Bảng giá</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-2 text-xs uppercase tracking-widest">Tiệc cưới</h4>
            <ul className="space-y-1.5">
              <li><Link href="/wedding" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
              <li><Link href="/wedding#gallery" className="hover:text-primary transition-colors">Thư viện ảnh</Link></li>
              <li><Link href="/wedding#inquiry" className="hover:text-primary transition-colors">Đặt lịch</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact — compact trên mobile */}
        <div className="sm:hidden border-t border-border pt-4 mb-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={13} className="text-primary shrink-0" />
              <span className="text-xs">9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={13} className="text-primary shrink-0" />
              <span className="text-xs">
                <a href="tel:0378990979" className="hover:text-foreground">0378 990 979</a>
                {' · '}
                <a href="tel:0886798690" className="hover:text-foreground">0886 798 690</a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={13} className="text-primary shrink-0" />
              <span className="text-xs">Mở cửa hàng ngày: 06:00 – 22:00</span>
            </li>
          </ul>
        </div>

        {/* Copyright mobile */}
        <div className="sm:hidden text-xs text-center pt-3 border-t border-border">
          <p>© {new Date().getFullYear()} Song Thạch. Bảo lưu mọi quyền.</p>
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
