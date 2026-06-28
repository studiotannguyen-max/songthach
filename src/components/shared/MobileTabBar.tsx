'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Heart, Phone, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSportPicker } from '@/components/providers/SportPickerProvider';

const TABS = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Thể thao', href: '/sports', icon: Dumbbell },
  { label: 'Tiệc cưới', href: '/wedding', icon: Heart },
  { label: 'Gọi', href: 'tel:0378990979', icon: Phone, external: true },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const { open } = useSportPicker();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t-[3px] border-[#0F3C2C] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative grid grid-cols-5 items-end h-16">
        {/* 2 tab đầu */}
        {TABS.slice(0, 2).map((t) => (
          <TabItem key={t.href} {...t} active={isActive(t.href)} />
        ))}

        {/* Nút Đặt sân nổi giữa */}
        <div className="flex justify-center">
          <button
            onClick={open}
            aria-label="Đặt sân ngay"
            className="absolute -top-5 grid place-items-center w-14 h-14 bg-[#0F3C2C] text-white transition-all active:translate-x-[2px] active:translate-y-[2px]"
            style={{ border: '2px solid #0A2C20', boxShadow: '3px 3px 0 #3F8F33' }}
          >
            <CalendarPlus size={24} />
          </button>
          <span className="text-[10px] font-medium text-primary mb-1.5">Đặt sân</span>
        </div>

        {/* 2 tab cuối */}
        {TABS.slice(2).map((t) => (
          <TabItem key={t.href} {...t} active={isActive(t.href)} />
        ))}
      </div>
    </nav>
  );
}

function TabItem({
  label, href, icon: Icon, active, external,
}: {
  label: string; href: string; icon: typeof Home; active?: boolean; external?: boolean;
}) {
  const inner = (
    <span className="flex flex-col items-center justify-center gap-1 h-full">
      <Icon size={21} aria-hidden="true" />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </span>
  );
  const cls = cn(
    'flex items-center justify-center h-16 transition-colors',
    active ? 'text-[#9CE25C] bg-[#0F3C2C]' : 'text-muted-foreground',
  );
  return external ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
