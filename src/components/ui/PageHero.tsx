import Image from 'next/image';
import Link from 'next/link';
import HeroSlideshow from './HeroSlideshow';
import type { HeroSlide } from '@/lib/hero-slides';

/** Hero dùng chung cho mọi trang công khai.
 *  Mặc định là hero tĩnh: không nút chuyển ảnh, không tự chạy.
 *  Riêng trang chủ truyền `slides` để ảnh nền chạy vòng.
 *  Không truyền `image` lẫn `slides` thì nền đen lộ ra — đó là biến thể không ảnh,
 *  cố tình như vậy để không bao giờ có ô ảnh trống. */
export default function PageHero({
  label, title, description, image, slides, cta, children,
}: {
  label?: string;
  title: string;
  description?: string;
  image?: string;
  /** Ảnh nền chạy vòng — ưu tiên hơn `image` khi có ít nhất 1 ảnh */
  slides?: HeroSlide[];
  cta?: { label: string; href: string };
  /** Nút tuỳ biến thay cho `cta` — dùng khi cần mở hộp thoại thay vì đi tới trang khác */
  children?: React.ReactNode;
}) {
  // Có ảnh thì nền tối + phủ đậm để chữ nổi trên mọi tấm ảnh.
  // Không ảnh thì nền xanh thương hiệu, phủ nhẹ thôi — phủ đậm sẽ làm xanh thành đen xỉn.
  const hasMedia = (slides && slides.length > 0) || Boolean(image);

  // Chiều cao TỐI THIỂU chứ không cố định: màn hình thấp (laptop 1366×768 chỉ còn ~640px
  // sau thanh trình duyệt) từng làm chữ và nút tràn ra rồi bị cắt cụt ở đáy hero.
  // Giờ hero tự cao thêm theo nội dung; `flex items-center` giữ nguyên kiểu canh giữa
  // khi màn hình cao hơn nội dung.
  return (
    <section
      className={`relative w-full min-h-[44vh] md:min-h-[56vh] py-14 md:py-16 flex items-center ${
        hasMedia ? 'bg-ink' : 'bg-brand-strong hero-no-media'
      }`}
    >
      {slides && slides.length > 0 ? (
        <HeroSlideshow slides={slides} />
      ) : (
        image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      {/* Lớp phủ chuyển từ trái — giữ chữ trắng đủ tương phản */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: hasMedia
            ? 'linear-gradient(90deg, rgb(16 19 20 / .78), rgb(16 19 20 / .25))'
            : 'linear-gradient(90deg, rgb(16 19 20 / .45), rgb(16 19 20 / .15))',
        }}
      />
      <div className="container-page relative w-full">
        <div className="max-w-2xl">
          {label && (
            <p className="text-xs uppercase tracking-[0.08em] text-white/80 font-semibold mb-3">
              {label}
            </p>
          )}
          <h1 className="text-[clamp(40px,6vw,72px)] text-white">{title}</h1>
          {description && (
            <p className="mt-4 text-white/85 text-base md:text-lg">{description}</p>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="mt-8 btn-brand"
            >
              {cta.label}
            </Link>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
