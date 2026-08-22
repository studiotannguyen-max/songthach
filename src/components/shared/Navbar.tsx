'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSportPicker } from '@/components/providers/SportPickerProvider';
import { Button } from '@/components/ui';

const ZONE_LINKS = [
  { label: 'Sân Bóng Đá',     href: '/sports/football' },
  { label: 'Sân Cầu Lông',    href: '/sports/badminton' },
  { label: 'Rally Grand Prix', href: '/giai-dau-rating' },
  { label: 'Tiệc Cưới',       href: '/wedding' },
  { label: 'Lavie en Rose',   href: '/cafe' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading, signOut } = useAuth();
  const { open: openSportPicker }  = useSportPicker();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);

  useEffect(() => {
    if (!userMenu) return;
    const close = () => setUserMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userMenu]);

  // Khoá cuộn nền khi menu tràn màn hình đang mở
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Đóng menu bằng phím Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Tài khoản';
  const initials    = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOut();
    setUserMenu(false);
    setMobileOpen(false);
    router.push('/');
  }

  return (
    <nav aria-label="Điều hướng chính" className="sticky top-0 z-50 bg-bg border-b border-line">
      <div className="container-page">
        <div className="flex items-center justify-between h-14 md:h-[72px] gap-6">

          <Link href="/" aria-label="Song Thạch — Trang chủ" className="shrink-0">
            <Image
              src="/logo.png" alt="Song Thạch" width={95} height={44}
              className="object-contain" style={{ maxHeight: '40px', width: 'auto' }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {ZONE_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'font-display uppercase text-[13px] tracking-[0.06em] whitespace-nowrap',
                    'py-2 border-b-2 transition-colors',
                    active
                      ? 'text-fg border-brand'
                      : 'text-fg border-transparent hover:text-brand-strong',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {loading ? (
              <Loader2 size={18} className="animate-spin text-fg-muted" aria-label="Đang tải..." />
            ) : user ? (
              <div className="relative" onClick={(e) => { e.stopPropagation(); setUserMenu(!userMenu); }}>
                <button
                  className="flex items-center gap-2 min-h-[44px] px-2 rounded hover:bg-bg-subtle transition-colors"
                  aria-expanded={userMenu}
                  aria-haspopup="menu"
                  aria-label={`Tài khoản: ${displayName}`}
                >
                  <span
                    className="w-8 h-8 rounded-full bg-brand-strong text-white grid place-items-center font-bold text-sm"
                    aria-hidden="true"
                  >
                    {initials}
                  </span>
                  <span className="text-sm font-medium max-w-[120px] truncate text-fg">{displayName}</span>
                  <ChevronDown size={14} className="text-fg-muted" aria-hidden="true" />
                </button>

                {userMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 rounded border border-line bg-bg shadow-[0_2px_8px_rgb(0_0_0/0.08)] py-1"
                    role="menu"
                  >
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-xs text-fg-muted">Đăng nhập với</p>
                      <p className="text-sm font-semibold text-fg truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile" role="menuitem" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-fg hover:bg-bg-subtle"
                    >
                      <User size={15} aria-hidden="true" /> Thông tin tài khoản
                    </Link>
                    <button
                      onClick={handleSignOut} role="menuitem"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-bg-subtle"
                    >
                      <LogOut size={15} aria-hidden="true" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-fg hover:text-brand-strong px-3 min-h-[44px] flex items-center"
              >
                Đăng nhập
              </Link>
            )}
            <Button size="sm" onClick={openSportPicker}>Đặt sân</Button>
          </div>

          <button
            className="lg:hidden grid place-items-center w-11 h-11 -mr-2 text-fg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-40 bg-bg overflow-y-auto">
          <ul className="container-page py-2">
            {ZONE_LINKS.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center h-14 font-display uppercase text-lg tracking-[0.04em] text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="container-page py-6 space-y-3">
            <Button className="w-full" onClick={() => { setMobileOpen(false); openSportPicker(); }}>
              Đặt sân ngay
            </Button>
            {user ? (
              <>
                <Link
                  href="/profile" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center min-h-[48px] rounded border border-line text-sm text-fg"
                >
                  Thông tin tài khoản
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full min-h-[48px] rounded border border-line text-sm text-danger"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center min-h-[48px] rounded border border-line text-sm text-fg"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
