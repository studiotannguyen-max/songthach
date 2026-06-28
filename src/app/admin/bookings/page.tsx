'use client';
import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Search, Filter, RefreshCw, CheckCircle2, XCircle, Clock3, ChevronDown, Repeat, Plus } from 'lucide-react';
import RecurringBookingModal from '@/components/admin/RecurringBookingModal';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Status = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  user_email: string;
  user_name: string | null;
  user_phone: string | null;
  court_name: string;
  venue_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number;
  points_used: number;
  points_discount_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  recurring_id?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  pending:   { label: 'Chờ xác nhận',  cls: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  confirmed: { label: 'Đã xác nhận',   cls: 'bg-blue-100 text-blue-800',     dot: 'bg-blue-500'   },
  completed: { label: 'Hoàn thành',    cls: 'bg-green-100 text-green-800',   dot: 'bg-green-500'  },
  cancelled: { label: 'Đã hủy',        cls: 'bg-red-100 text-red-700',       dot: 'bg-red-400'    },
};

const PAYMENT_LABEL: Record<string, string> = {
  bank_transfer: 'Chuyển khoản',
  pay_at_venue:  'Tại sân',
};

const VENUE_LABEL: Record<string, string> = {
  badminton:  'Cầu lông',
  football_5: 'Bóng đá 5',
  football_7: 'Bóng đá 7',
};

export default function AdminBookingsPage() {
  const [bookings,    setBookings]   = useState<Booking[]>([]);
  const [loading,     setLoading]    = useState(true);
  const [statusFilter, setStatus]   = useState<Status>('all');
  const [search,      setSearch]     = useState('');
  const [updating,    setUpdating]   = useState<string | null>(null);
  const [actionMenu,  setActionMenu] = useState<string | null>(null);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [selected,    setSelected]   = useState<Set<string>>(new Set());
  const [bulkRunning, setBulkRunning] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    const res  = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Đóng action menu khi click ngoài
  useEffect(() => {
    if (!actionMenu) return;
    const close = () => setActionMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [actionMenu]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    setActionMenu(null);
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await fetchBookings();
    setUpdating(null);
  }

  async function bulkUpdateStatus(status: string) {
    setBulkRunning(true);
    await Promise.all(
      Array.from(selected).map(id =>
        fetch(`/api/admin/bookings/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }),
      ),
    );
    setSelected(new Set());
    await fetchBookings();
    setBulkRunning(false);
  }

  function toggleSelected(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.user_email?.toLowerCase().includes(q) ||
      b.user_name?.toLowerCase().includes(q)  ||
      b.user_phone?.includes(q)               ||
      b.court_name?.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt sân</h1>
          <p className="text-gray-500 text-sm mt-1">{bookings.length} lượt đặt</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecurringModal(true)}
            className="flex items-center gap-2 text-sm text-white bg-sports-primary px-4 py-2 rounded-xl hover:bg-opacity-90 transition-colors font-semibold"
          >
            <Plus size={15} /> Tạo lịch cố định
          </button>
          <button onClick={fetchBookings} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {showRecurringModal && (
        <RecurringBookingModal
          onClose={() => setShowRecurringModal(false)}
          onCreated={() => { setShowRecurringModal(false); fetchBookings(); }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT, mã..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as Status[]).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                statusFilter === s
                  ? 'bg-sports-primary border-sports-primary text-white'
                  : 'border-gray-200 text-gray-600 hover:border-sports-primary/40',
              )}
            >
              {s === 'all' ? 'Tất cả' : STATUS_CONFIG[s].label}
              <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <RefreshCw size={20} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Filter size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Không có dữ liệu phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Khách hàng</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Sân & Lịch</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Thanh toán</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Tổng tiền</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => {
                  const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      {/* Khách hàng */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900">{b.user_name || '(Chưa điền tên)'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.user_email}</p>
                        {b.user_phone && <p className="text-xs text-gray-400">{b.user_phone}</p>}
                        <p className="font-mono text-[10px] text-gray-300 mt-1">
                          BK-{b.id.slice(0,8).toUpperCase()}
                        </p>
                      </td>

                      {/* Sân & Lịch */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-gray-900">{b.court_name}</p>
                          {b.recurring_id && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              <Repeat size={10} /> Lịch cố định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{VENUE_LABEL[b.venue_type] ?? b.venue_type}</p>
                        <p className="text-xs text-gray-700 mt-1 font-medium">
                          {format(new Date(b.booking_date), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {b.start_time} – {b.end_time} ({b.duration}h)
                        </p>
                      </td>

                      {/* Thanh toán */}
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          'inline-block text-xs font-medium px-2.5 py-1 rounded-lg',
                          b.payment_method === 'bank_transfer'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-600',
                        )}>
                          {PAYMENT_LABEL[b.payment_method] ?? b.payment_method}
                        </span>
                      </td>

                      {/* Tổng tiền */}
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-sports-primary">
                          {formatCurrency(b.total_price - (b.points_discount_amount || 0))}
                        </p>
                        {b.points_used > 0 && (
                          <p className="text-[10px] text-amber-600 mt-0.5">
                            Đã giảm {b.points_used} điểm (giá gốc {formatCurrency(b.total_price)})
                          </p>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-4 py-3.5">
                        <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg', cfg.cls)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="px-4 py-3.5">
                        {updating === b.id ? (
                          <RefreshCw size={16} className="animate-spin text-gray-400" />
                        ) : (
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setActionMenu(actionMenu === b.id ? null : b.id)}
                              className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cập nhật <ChevronDown size={12} />
                            </button>
                            {actionMenu === b.id && (
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                {b.status !== 'confirmed' && (
                                  <button
                                    onClick={() => updateStatus(b.id, 'confirmed')}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-blue-700 hover:bg-blue-50 transition-colors"
                                  >
                                    <CheckCircle2 size={14} /> Xác nhận đặt sân
                                  </button>
                                )}
                                {b.status !== 'completed' && (
                                  <button
                                    onClick={() => updateStatus(b.id, 'completed')}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-green-700 hover:bg-green-50 transition-colors"
                                  >
                                    <CheckCircle2 size={14} /> Đánh dấu hoàn thành
                                  </button>
                                )}
                                {b.status === 'pending' && (
                                  <button
                                    onClick={() => updateStatus(b.id, 'cancelled')}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <XCircle size={14} /> Hủy đặt sân
                                  </button>
                                )}
                                {b.status === 'cancelled' && (
                                  <button
                                    onClick={() => updateStatus(b.id, 'pending')}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                                  >
                                    <Clock3 size={14} /> Khôi phục
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
