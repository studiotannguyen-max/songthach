import Image from 'next/image';
import Link from 'next/link';

/** Hero tĩnh dùng chung cho mọi trang công khai.
 *  Không slider, không nút chuyển ảnh, không tự chạy.
 *  Không truyền `image` thì nền đen lộ ra — đó là biến thể không ảnh,
 *  cố tình như vậy để không bao giờ có ô ảnh trống. */
export default function PageHero({
  label, title, description, image, cta,
}: {
  label?: string;
  title: string;
  description?: string;
  image?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative w-full h-[44vh] md:h-[56vh] md:max-h-[640px] min-h-[320px] bg-ink">
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      {/* Lớp phủ chuyển từ trái — chữ đọc được bất kể ảnh sáng hay tối */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgb(16 19 20 / .78), rgb(16 19 20 / .25))' }}
      />
      <div className="container-page relative h-full flex flex-col justify-center">
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
              className="mt-8 inline-flex items-center justify-center min-h-[48px] px-6 rounded bg-brand-strong text-white font-display uppercase tracking-[0.06em] text-sm hover:bg-[#00692C] transition-colors"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
