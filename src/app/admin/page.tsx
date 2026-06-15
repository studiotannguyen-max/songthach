'use client';
import { Calendar, Users, TrendingUp, Clock, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const STATS = [
  { label: 'Đặt sân hôm nay',     value: '12',          sub: '+3 so với hôm qua',  icon: Calendar,    color: 'bg-blue-500' },
  { label: 'Doanh thu tháng này',  value: '28.500.000đ', sub: '+12% so với tháng trước', icon: TrendingUp, color: 'bg-green-500' },
  { label: 'Khách hàng mới',       value: '47',          sub: 'trong 30 ngày qua',  icon: Users,       color: 'bg-purple-500' },
  { label: 'Sân đang sử dụng',     value: '3/6',         sub: 'Cập nhật realtime',  icon: Clock,       color: 'bg-orange-500' },
];

const RECENT_BOOKINGS = [
  { id: 'BK001', user: 'Nguyễn Văn An',   venue: 'Sân 1 · Cầu lông', date: '06/06/2026', time: '18:00–19:00', status: 'deposit_paid', amount: 45000 },
  { id: 'BK002', user: 'Trần Thị Bình',   venue: 'Sân 5A · Bóng đá', date: '06/06/2026', time: '17:00–18:30', status: 'deposit_paid', amount: 105000 },
  { id: 'BK003', user: 'Lê Minh Châu',    venue: 'Sân 2 · Cầu lông', date: '07/06/2026', time: '07:00–08:00', status: 'pending',      amount: 30000 },
  { id: 'BK004', user: 'Phạm Quốc Dũng',  venue: 'Sân 7A · Bóng đá', date: '07/06/2026', time: '16:00–17:30', status: 'completed',    amount: 0 },
  { id: 'BK005', user: 'Hoàng Thị Em',    venue: 'Sân 3 · Cầu lông', date: '08/06/2026', time: '19:00–20:00', status: 'cancelled',    amount: 0 },
];

const WEDDING_LEADS = [
  { name: 'Anh Tuấn & Chị Lan', date: '20/10/2026', tables: 35, status: 'new',       phone: '0901234567' },
  { name: 'Anh Khoa & Chị Hoa', date: '05/11/2026', tables: 28, status: 'contacted', phone: '0912345678' },
  { name: 'Anh Nam & Chị Yến',  date: '15/12/2026', tables: 50, status: 'quoted',    phone: '0923456789' },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:      { label: 'Chờ xử lý', cls: 'status-pending' },
  deposit_paid: { label: 'Đã đặt cọc', cls: 'status-deposit_paid' },
  completed:    { label: 'Hoàn thành', cls: 'status-completed' },
  cancelled:    { label: 'Đã hủy', cls: 'status-cancelled' },
  new:          { label: 'Mới', cls: 'status-new' },
  contacted:    { label: 'Đã liên hệ', cls: 'status-contacted' },
  quoted:       { label: 'Đã báo giá', cls: 'status-quoted' },
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 text-sm mt-1">Thứ Bảy, 06/06/2026</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-xl">
          <CheckCircle size={14} />
          Hệ thống hoạt động bình thường
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="admin-card flex items-start gap-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 truncate">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight size={11} /> {s.sub}
              </p>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Mã</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Khách hàng</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Sân & Giờ</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_BOOKINGS.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-gray-400">{b.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{b.user}</p>
                      <p className="text-xs text-gray-400">{b.date}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-gray-700">{b.venue}</p>
                      <p className="text-xs text-gray-400">{b.time}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`status-badge ${STATUS_MAP[b.status].cls}`}>
                        {STATUS_MAP[b.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wedding leads */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Yêu cầu tiệc cưới</h2>
            <a href="/admin/wedding" className="text-xs text-wedding-accent hover:underline flex items-center gap-1">
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="space-y-3">
            {WEDDING_LEADS.map((lead) => (
              <div key={lead.name} className="border border-gray-100 rounded-xl p-3 hover:border-wedding-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-semibold text-sm text-gray-900 leading-tight">{lead.name}</p>
                  <span className={`status-badge ${STATUS_MAP[lead.status].cls} shrink-0`}>
                    {STATUS_MAP[lead.status].label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{lead.date} · {lead.tables} bàn</p>
                <p className="text-xs text-gray-400 mt-1">{lead.phone}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
            <AlertCircle size={14} className="text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-700">
              <strong>1 yêu cầu mới</strong> chờ liên hệ trong hôm nay.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <h2 className="font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Tạo đặt sân thủ công', href: '/admin/bookings/new', color: 'bg-sports-light text-sports-primary border-sports-primary/20' },
            { label: 'Cập nhật bảng giá',    href: '/admin/venues',       color: 'bg-orange-50 text-orange-700 border-orange-200' },
            { label: 'Xuất báo cáo Excel',   href: '#',                   color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Cài đặt thông báo',    href: '/admin/settings',     color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map((a) => (
            <a key={a.label} href={a.href} className={`border rounded-xl px-4 py-3 text-sm font-medium text-center hover:opacity-80 transition-opacity ${a.color}`}>
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
