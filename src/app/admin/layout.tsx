'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, MapPin, Users,
  Heart, Settings, LogOut, ChevronRight, FileText, Ticket, Images,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Tổng quan'          },
  { href: '/admin/bookings', icon: Calendar,        label: 'Đặt sân'            },
  { href: '/admin/vouchers', icon: Ticket,          label: 'Voucher'            },
  { href: '/admin/posts',    icon: FileText,        label: 'Bài viết & Tin tức' },
  { href: '/admin/gallery',  icon: Images,          label: 'Thư viện ảnh'       },
  { href: '/admin/venues',   icon: MapPin,          label: 'Quản lý sân'        },
  { href: '/admin/users',    icon: Users,           label: 'Khách hàng'         },
  { href: '/admin/wedding',  icon: Heart,           label: 'Yêu cầu tiệc cưới' },
  { href: '/admin/settings', icon: Settings,        label: 'Cài đặt'            },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sports-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">ST</div>
            <div>
              <p className="text-white font-bold text-sm">Song Thạch</p>
              <p className="text-gray-500 text-xs">Admin Dashboard</p>
            </div>
          </div>
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
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group',
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
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full">
            <LogOut size={17} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
