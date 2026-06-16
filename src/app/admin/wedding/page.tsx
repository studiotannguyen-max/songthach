'use client';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Phone, Mail, CalendarDays, Users, RefreshCw, ChevronDown, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'all' | 'new' | 'contacted' | 'quoted' | 'booked' | 'cancelled';

interface Inquiry {
  id: string;
  contact_name: string;
  phone: string;
  email: string | null;
  event_date: string | null;
  guest_count: number | null;
  table_count: number | null;
  hall_preference: string | null;
  special_requests: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  new:       { label: 'Mới',          cls: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  contacted: { label: 'Đã liên hệ',  cls: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500'   },
  quoted:    { label: 'Đã báo giá',   cls: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  booked:    { label: 'Đã đặt cọc',  cls: 'bg-green-100 text-green-800',  dot: 'bg-green-500'  },
  cancelled: { label: 'Huỷ',         cls: 'bg-red-100 text-red-700',      dot: 'bg-red-400'    },
};

const STATUS_FLOW: Record<string, string[]> = {
  new:       ['contacted', 'cancelled'],
  contacted: ['quoted', 'cancelled'],
  quoted:    ['booked', 'cancelled'],
  booked:    [],
  cancelled: ['new'],
};

export default function AdminWeddingPage() {
  const [inquiries,    setInquiries]   = useState<Inquiry[]>([]);
  const [loading,      setLoading]     = useState(true);
  const [statusFilter, setStatus]      = useState<Status>('all');
  const [updating,     setUpdating]    = useState<string | null>(null);
  const [actionMenu,   setActionMenu]  = useState<string | null>(null);
  const [expanded,     setExpanded]    = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
    const res  = await fetch(`/api/admin/wedding${params}`);
    const data = await res.json();
    setInquiries(data.inquiries ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  useEffect(() => {
    if (!actionMenu) return;
    const close = () => setActionMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [actionMenu]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    setActionMenu(null);
    await fetch('/api/admin/wedding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await fetchInquiries();
    setUpdating(null);
  }

  const counts = {
    all:       inquiries.length,
    new:       inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    quoted:    inquiries.filter(i => i.status === 'quoted').length,
    booked:    inquiries.filter(i => i.status === 'booked').length,
    cancelled: inquiries.filter(i => i.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart size={20} className="text-pink-500" /> Yêu cầu tiệc cưới
          </h1>
          <p className="text-gray-500 text-sm mt-1">{counts.all} yêu cầu · {counts.new} mới chưa xử lý</p>
        </div>
        <button
          onClick={fetchInquiries}
          className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'contacted', 'quoted', 'booked', 'cancelled'] as Status[]).map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
              statusFilter === s
                ? 'bg-pink-500 border-pink-500 text-white'
                : 'border-gray-200 text-gray-600 hover:border-pink-300',
            )}
          >
            {s === 'all' ? 'Tất cả' : STATUS_CONFIG[s].label}
            <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <RefreshCw size={20} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Heart size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Chưa có yêu cầu nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const cfg      = STATUS_CONFIG[inq.status] ?? STATUS_CONFIG.new;
            const isOpen   = expanded === inq.id;
            const nextSteps = STATUS_FLOW[inq.status] ?? [];
            return (
              <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Row chính */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : inq.id)}
                >
                  {/* Tên + SĐT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{inq.contact_name}</p>
                      <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', cfg.cls)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-pink-600 transition-colors" onClick={e => e.stopPropagation()}>
                        <Phone size={11} /> {inq.phone}
                      </a>
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-pink-600 transition-colors" onClick={e => e.stopPropagation()}>
                          <Mail size={11} /> {inq.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Ngày + bàn */}
                  <div className="flex gap-4 text-sm shrink-0">
                    {inq.event_date && (
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <CalendarDays size={14} className="text-pink-400" />
                        {format(new Date(inq.event_date), 'dd/MM/yyyy', { locale: vi })}
                      </div>
                    )}
                    {inq.table_count && (
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Users size={14} className="text-pink-400" />
                        {inq.table_count} bàn
                      </div>
                    )}
                  </div>

                  {/* Thời gian tạo */}
                  <p className="text-xs text-gray-400 shrink-0">
                    {format(new Date(inq.created_at), 'dd/MM HH:mm', { locale: vi })}
                  </p>

                  {/* Thao tác */}
                  <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
                    {updating === inq.id ? (
                      <RefreshCw size={16} className="animate-spin text-gray-400" />
                    ) : nextSteps.length > 0 ? (
                      <>
                        <button
                          onClick={() => setActionMenu(actionMenu === inq.id ? null : inq.id)}
                          className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cập nhật <ChevronDown size={12} />
                        </button>
                        {actionMenu === inq.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                            {nextSteps.map(s => (
                              <button
                                key={s}
                                onClick={() => updateStatus(inq.id, s)}
                                className={cn(
                                  'w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-gray-50 transition-colors',
                                  s === 'cancelled' ? 'text-red-600' : 'text-gray-700',
                                )}
                              >
                                <span className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[s]?.dot ?? 'bg-gray-400')} />
                                → {STATUS_CONFIG[s]?.label ?? s}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Chi tiết mở rộng */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3 text-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Sảnh mong muốn</p>
                        <p className="font-medium text-gray-800">{inq.hall_preference || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Số khách</p>
                        <p className="font-medium text-gray-800">{inq.guest_count ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Số bàn</p>
                        <p className="font-medium text-gray-800">{inq.table_count ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Ngày sự kiện</p>
                        <p className="font-medium text-gray-800">
                          {inq.event_date ? format(new Date(inq.event_date), 'dd/MM/yyyy', { locale: vi }) : '—'}
                        </p>
                      </div>
                    </div>
                    {inq.special_requests && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          <MessageSquare size={11} /> Yêu cầu đặc biệt
                        </p>
                        <p className="text-gray-700 bg-white rounded-lg p-3 border border-gray-100 text-sm leading-relaxed">
                          {inq.special_requests}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
