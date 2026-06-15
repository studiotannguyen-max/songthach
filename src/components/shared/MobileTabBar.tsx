'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Heart, Phone, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Thể thao', href: '/sports', icon: Dumbbell },
  { label: 'Tiệc cưới', href: '/wedding', icon: Heart },
  { label: 'Gọi', href: 'tel:0378990979', icon: Phone, external: true },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative grid grid-cols-5 items-end h-16">
        {/* 2 tab đầu */}
        {TABS.slice(0, 2).map((t) => (
          <TabItem key={t.href} {...t} active={isActive(t.href)} />
        ))}

        {/* Nút Đặt sân nổi giữa */}
        <div className="flex justify-center">
          <Link
            href="/sports/football"
            aria-label="Đặt sân ngay"
            className="absolute -top-5 grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            <CalendarPlus size={24} />
          </Link>
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
    active ? 'text-primary' : 'text-muted-foreground',
  );
  return external ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
