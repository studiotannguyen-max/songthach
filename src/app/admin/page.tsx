'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Users, TrendingUp, Clock, ArrowUpRight, CheckCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardBooking {
  id: string;
  user_name: string | null;
  user_email: string;
  court_name: string;
  venue_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface DashboardLead {
  id: string;
  contact_name: string;
  phone: string;
  event_date: string | null;
  table_count: number | null;
  status: string;
}

interface DashboardStats {
  bookingsToday: number;
  revenueThisMonth: number;
  newCustomers30d: number;
  courtsInUse: number;
  totalCourts: number;
  recentBookings: DashboardBooking[];
  weddingLeads: DashboardLead[];
}

const BOOKING_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Chờ xác nhận', cls: 'status-pending' },
  confirmed: { label: 'Đã xác nhận',  cls: 'status-deposit_paid' },
  completed: { label: 'Hoàn thành',   cls: 'status-completed' },
  cancelled: { label: 'Đã hủy',       cls: 'status-cancelled' },
};

const WEDDING_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  new:       { label: 'Mới',          cls: 'status-new' },
  contacted: { label: 'Đã liên hệ',  cls: 'status-contacted' },
  quoted:    { label: 'Đã báo giá',   cls: 'status-quoted' },
  booked:    { label: 'Đã đặt cọc',  cls: 'status-deposit_paid' },
  cancelled: { label: 'Huỷ',          cls: 'status-cancelled' },
};

const VENUE_LABEL: Record<string, string> = {
  badminton:  'Cầu lông',
  football_5: 'Bóng đá 5',
  football_7: 'Bóng đá 7',
};

export default function AdminDashboard() {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <RefreshCw size={20} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  const STATS = [
    { label: 'Đặt sân hôm nay',     value: String(stats.bookingsToday),                  icon: Calendar,   color: 'bg-blue-500'   },
    { label: 'Doanh thu tháng này', value: formatCurrency(stats.revenueThisMonth),        icon: TrendingUp, color: 'bg-green-500'  },
    { label: 'Khách hàng mới',      value: String(stats.newCustomers30d),                 icon: Users,      color: 'bg-purple-500' },
    { label: 'Sân đang sử dụng',    value: `${stats.courtsInUse}/${stats.totalCourts}`,   icon: Clock,      color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">
            {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5">
          <CheckCircle size={14} />
          Hệ thống hoạt động bình thường
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="admin-card flex items-start gap-4">
            <div className={`w-10 h-10 ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 truncate">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Đặt sân gần đây</h2>
            <a href="/admin/bookings" className="text-xs text-sports-primary hover:underline flex items-center gap-1">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          {stats.recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Chưa có lượt đặt sân nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Khách hàng</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Sân & Giờ</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentBookings.map((b) => {
                    const cfg = BOOKING_STATUS_MAP[b.status] ?? BOOKING_STATUS_MAP.pending;
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900">{b.user_name || b.user_email}</p>
                          <p className="text-xs text-gray-400">{format(new Date(b.booking_date), 'dd/MM/yyyy', { locale: vi })}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-gray-700">{b.court_name} · {VENUE_LABEL[b.venue_type] ?? b.venue_type}</p>
                          <p className="text-xs text-gray-400">{b.start_time}–{b.end_time}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Wedding leads */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Yêu cầu tiệc cưới</h2>
            <a href="/admin/wedding" className="text-xs text-wedding-accent hover:underline flex items-center gap-1">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          {stats.weddingLeads.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Chưa có yêu cầu mới.</p>
          ) : (
            <div className="space-y-3">
              {stats.weddingLeads.map((lead) => {
                const cfg = WEDDING_STATUS_MAP[lead.status] ?? WEDDING_STATUS_MAP.new;
                return (
                  <div key={lead.id} className="border border-gray-100 p-3 hover:border-wedding-accent/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-semibold text-sm text-gray-900 leading-tight">{lead.contact_name}</p>
                      <span className={`status-badge ${cfg.cls} shrink-0`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {lead.event_date ? format(new Date(lead.event_date), 'dd/MM/yyyy', { locale: vi }) : 'Chưa rõ ngày'} · {lead.table_count ?? '?'} bàn
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{lead.phone}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <h2 className="font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Quản lý đặt sân', href: '/admin/bookings', color: 'bg-sports-light text-sports-primary border-sports-primary/20' },
            { label: 'Cập nhật bảng giá', href: '/admin/venues',  color: 'bg-orange-50 text-orange-700 border-orange-200' },
            { label: 'Quản lý voucher', href: '/admin/vouchers',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Yêu cầu tiệc cưới', href: '/admin/wedding', color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map((a) => (
            <a key={a.label} href={a.href} className={`border-2 px-4 py-3 text-sm font-medium text-center hover:opacity-80 transition-opacity ${a.color}`}>
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
