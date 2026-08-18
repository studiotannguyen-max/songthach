'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, MapPin, Users,
  Heart, Settings, LogOut, ChevronRight, FileText, Ticket, Images, Wallet, ImageDown,
  Menu, X, Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Tổng quan'          },
  { href: '/admin/bookings', icon: Calendar,        label: 'Đặt sân'            },
  { href: '/admin/finance',  icon: Wallet,          label: 'Tài chính'          },
  { href: '/admin/vouchers', icon: Ticket,          label: 'Voucher'            },
  { href: '/admin/posts',    icon: FileText,        label: 'Bài viết & Tin tức' },
  { href: '/admin/gallery',  icon: Images,          label: 'Thư viện ảnh'       },
  { href: '/admin/media',    icon: ImageDown,       label: 'Kho ảnh'            },
  { href: '/admin/venues',   icon: MapPin,          label: 'Quản lý sân'        },
  { href: '/admin/users',    icon: Users,           label: 'Khách hàng'         },
  { href: '/admin/players',  icon: Trophy,          label: 'VĐV cầu lông'       },
  { href: '/admin/wedding',  icon: Heart,           label: 'Yêu cầu tiệc cưới' },
  { href: '/admin/settings', icon: Settings,        label: 'Cài đặt'            },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Đóng menu mobile mỗi khi chuyển trang
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  // Trang đăng nhập không dùng khung sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-gray-950 flex flex-col shrink-0',
          'fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Song Thạch" width={69} height={32} className="object-contain" style={{ maxHeight: '32px', width: 'auto' }} />
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white md:hidden"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 text-sm transition-all group',
                  active
                    ? 'bg-sports-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={17} />
                  {item.label}
                </div>
                {active && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full">
            <LogOut size={17} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Thanh trên cùng cho mobile */}
        <header className="flex items-center gap-3 px-4 py-3 bg-gray-950 md:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white"
            aria-label="Mở menu"
          >
            <Menu size={22} />
          </button>
          <Image src="/logo.png" alt="Song Thạch" width={62} height={28} className="object-contain" style={{ maxHeight: '28px', width: 'auto' }} />
          <p className="text-gray-500 text-xs">Admin</p>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
