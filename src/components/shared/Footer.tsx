import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const ADDRESS = '9B/3 Ấp An Hoà, Xã Hưng Thịnh, TP Đồng Nai';
const MAP_URL = 'https://maps.google.com/?q=9B/3+Ấp+An+Hoà,+Xã+Hưng+Thịnh,+TP+Đồng+Nai';

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display uppercase text-brand text-lg tracking-[0.08em] mb-4">{children}</h4>
  );
}

export default function Footer() {
  return (
    <footer aria-label="Thông tin Song Thạch" className="bg-ink text-white/75 pb-24 sm:pb-0">
      {/* Điện thoại — chỉ địa chỉ + SĐT, giữ gọn nhẹ */}
      <div className="sm:hidden container-page py-6 space-y-3">
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5">
          <MapPin size={15} className="shrink-0 mt-0.5 text-brand" aria-hidden="true" />
          <span className="text-sm leading-relaxed">{ADDRESS}</span>
        </a>
        <div className="flex items-center gap-2.5">
          <Phone size={15} className="shrink-0 text-brand" aria-hidden="true" />
          <span className="text-sm">
            <a href="tel:0378990979" className="hover:text-white">0378 990 979</a>
            <span className="mx-1.5 opacity-50">·</span>
            <a href="tel:0886798690" className="hover:text-white">0886 798 690</a>
          </span>
        </div>
      </div>

      {/* Máy tính — logo + mạng xã hội ở trên, 3 cột liên kết ở dưới */}
      <div className="hidden sm:block">
        <div className="container-page py-16">
          <div className="flex flex-col items-center text-center pb-10 border-b border-white/15">
            <Image
              src="/logo.png" alt="Song Thạch" width={138} height={64}
              className="object-contain" style={{ maxHeight: '64px', width: 'auto' }}
            />
            <p className="text-sm leading-relaxed mt-3 max-w-md">
              Tổ hợp dịch vụ thể thao, tiệc cưới và café — nơi mọi khoảnh khắc đều trở nên đáng nhớ.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#" aria-label="Song Thạch trên Facebook"
                className="w-11 h-11 grid place-items-center rounded border border-white/25 text-white hover:border-brand hover:text-brand transition-colors"
              >
                <Facebook size={16} aria-hidden="true" />
              </a>
              <a
                href="#" aria-label="Song Thạch trên Instagram"
                className="w-11 h-11 grid place-items-center rounded border border-white/25 text-white hover:border-brand hover:text-brand transition-colors"
              >
                <Instagram size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-10 items-start mt-10">
            <div>
              <ColTitle>Khu Thể thao</ColTitle>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/sports/football"  className="hover:text-white transition-colors">Sân Bóng Đá 5 người</Link></li>
                <li><Link href="/sports/football"  className="hover:text-white transition-colors">Sân Bóng Đá 7 người</Link></li>
                <li><Link href="/sports/badminton" className="hover:text-white transition-colors">Sân Cầu Lông</Link></li>
                <li><Link href="/sports"           className="hover:text-white transition-colors">Bảng giá &amp; Khuyến mãi</Link></li>
              </ul>
            </div>

            <div>
              <ColTitle>Nhà hàng Tiệc cưới</ColTitle>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/wedding"          className="hover:text-white transition-colors">Giới thiệu sảnh</Link></li>
                <li><Link href="/wedding#gallery"  className="hover:text-white transition-colors">Thư viện ảnh</Link></li>
                <li><Link href="/wedding#inquiry"  className="hover:text-white transition-colors">Đặt lịch tư vấn</Link></li>
              </ul>
            </div>

            <div>
              <ColTitle>Liên hệ</ColTitle>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  <span>{ADDRESS}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  <span className="flex flex-col">
                    <a href="tel:0378990979" className="hover:text-white transition-colors">0378 990 979</a>
                    <a href="tel:0886798690" className="hover:text-white transition-colors">0886 798 690</a>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  <span>Mở cửa hàng ngày: 06:00 – 22:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng cuối — bản quyền */}
      <div className="hidden sm:block border-t border-white/15">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Song Thạch. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách hủy sân</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
