'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Loader2, Goal, Feather, Heart, Coffee, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSportPicker } from '@/components/providers/SportPickerProvider';

// Một bảng accent vàng (gold) duy nhất cho mọi khu vực — nhất quán thương hiệu
const ZONE_LINKS = [
  { label: 'Sân Bóng Đá', href: '/sports/football', icon: Goal },
  { label: 'Sân Cầu Lông', href: '/sports/badminton', icon: Feather },
  { label: 'Giải Cầu Lông 2026', href: '/giai-cau-long-2026', icon: Trophy },
  { label: 'Tiệc Cưới', href: '/wedding', icon: Heart },
  { label: 'Lavie en Rose', href: '/cafe', icon: Coffee },
];

const ZONE_IDLE = 'border-[#c1922f]/40 text-[#292723]/80 hover:border-primary hover:text-primary';
const ZONE_ACTIVE = 'bg-primary text-primary-foreground border-primary';

export default function Navbar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user, loading, signOut } = useAuth();

  const [scrolled,     setScrolled]    = useState(false);
  const [mobileOpen,   setMobileOpen]  = useState(false);
  const [userMenu,     setUserMenu]    = useState(false);
  const { open: openSportPicker } = useSportPicker();

  const isWedding = pathname.startsWith('/wedding');
  const isSports  = pathname.startsWith('/sports');
  const isHome    = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Đóng user menu khi click ngoài
  useEffect(() => {
    if (!userMenu) return;
    const close = () => setUserMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userMenu]);

  // Trang chủ không còn hero ảnh tối phía sau navbar (đã bỏ slide) — luôn dùng nền đặc.
  const solid = scrolled || isHome || (!isSports && !isWedding);

  const navBg = solid
    ? 'bg-background border-b-[3px] border-[#0F3C2C]'
    : 'bg-transparent';

  const textColor = solid ? 'text-foreground' : 'text-white';

  // Link khu vực kiểu chữ gọn (không khung/pill), sát logo — giống mẫu Olipop
  // Lưu ý: KHÔNG dùng opacity modifier (vd /70) với màu CSS-var dạng hex — sẽ ra CSS lỗi.
  const zoneIdle = solid
    ? 'text-[#292723]/80 hover:text-primary'
    : 'text-white/85 hover:text-white';
  const zoneActive = solid
    ? 'text-primary'
    : 'text-white';

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Tài khoản';
  const initials    = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    await signOut();
    setUserMenu(false);
    router.push('/');
  }

  return (
    <nav aria-label="Điều hướng chính" className={cn('fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300', navBg)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between md:justify-center md:gap-8 h-16 md:h-20">

          {/* Logo — đứng giữa, các nhóm menu nằm sát 2 bên */}
          <Link href="/" className="flex items-center group" aria-label="Song Thạch — Trang chủ">
            <Image src="/logo.jpg" alt="Song Thạch" width={80} height={40} className="object-contain" style={{ maxHeight: '40px', width: 'auto' }} />
          </Link>

          {/* Desktop nav — trái: Bóng đá, Cầu lông, Giải CL 2026 */}
          <div className="hidden md:flex items-center gap-4" role="list">
            {ZONE_LINKS.slice(0, 3).map((link) => {
              const Icon   = link.icon;
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  className={cn(
                    'flex items-center gap-1 text-xs font-semibold tracking-wider transition-colors whitespace-nowrap uppercase',
                    active ? zoneActive : zoneIdle,
                  )}
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  <Icon size={15} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA / User area — trái: Tiệc cưới, Café, rồi đăng nhập/đặt sân */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-4" role="list">
              {ZONE_LINKS.slice(3, 5).map((link) => {
                const Icon   = link.icon;
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="listitem"
                    className={cn(
                      'flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap',
                      active ? zoneActive : zoneIdle,
                    )}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            {loading ? (
              <Loader2 size={18} className={cn('animate-spin', textColor)} aria-label="Đang tải..." />
            ) : user ? (
              /* Đã đăng nhập */
              <>
              <div className="relative" onClick={(e) => { e.stopPropagation(); setUserMenu(!userMenu); }}>
                <button
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-white/10 transition-colors"
                  aria-expanded={userMenu}
                  aria-haspopup="menu"
                  aria-label={`Tài khoản: ${displayName}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm" aria-hidden="true">
                    {initials}
                  </div>
                  <span className={cn('text-sm font-medium max-w-[120px] truncate', textColor)}>
                    {displayName}
                  </span>
                  <ChevronDown size={14} className={textColor} aria-hidden="true" />
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border-2 border-[#0F3C2C] overflow-hidden py-1" role="menu">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">Đăng nhập với</p>
                      <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-muted transition-colors"
                      onClick={() => setUserMenu(false)}
                      role="menuitem"
                    >
                      <User size={15} aria-hidden="true" /> Thông tin tài khoản
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-muted transition-colors"
                      role="menuitem"
                    >
                      <LogOut size={15} aria-hidden="true" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={openSportPicker}
                className="flex items-center gap-1.5 bg-[#0F3C2C] text-white px-5 py-2.5 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-150"
              style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', letterSpacing: '0.08em', borderRadius: 0, border: '2px solid #0A2C20', boxShadow: '3px 3px 0 #3F8F33' }}
              >
                Đặt sân
              </button>
              </>
            ) : (
              /* Chưa đăng nhập */
              <>
                <Link
                  href="/login"
                  className={cn('text-sm font-medium transition-colors px-4 py-2 rounded-full hover:text-primary whitespace-nowrap', textColor)}
                >
                  Đăng nhập
                </Link>
                <button
                  onClick={openSportPicker}
                  className="flex items-center gap-1.5 bg-[#0F3C2C] text-white px-5 py-2.5 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-150"
              style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', letterSpacing: '0.08em', borderRadius: 0, border: '2px solid #0A2C20', boxShadow: '3px 3px 0 #3F8F33' }}
                >
                  Đặt sân ngay
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={cn('md:hidden p-2 rounded-lg transition-colors', textColor, 'hover:bg-white/10')}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — chỉ user auth, tab bar lo navigation */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-3">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 border border-red-400/30 rounded-lg shrink-0"
                >
                  <LogOut size={13} /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="py-2.5 text-center text-sm text-foreground/80 border-2 border-[#0F3C2C]" onClick={() => setMobileOpen(false)}>
                  Đăng nhập
                </Link>
                <div className="flex gap-2">
                  <Link href="/sports/football" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm bg-[#0F3C2C] text-white font-semibold" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.06em' }} onClick={() => setMobileOpen(false)}>
                    <Goal size={14} aria-hidden="true" /> SÂN BÓNG ĐÁ
                  </Link>
                  <Link href="/sports/badminton" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm bg-[#0F3C2C] text-white font-semibold" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.06em' }} onClick={() => setMobileOpen(false)}>
                    <Feather size={14} aria-hidden="true" /> SÂN CẦU LÔNG
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
