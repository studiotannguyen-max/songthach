'use client';
import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Lock, Unlock, Plus, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const COURTS = [
  { id: 'court-1', name: 'Sân 1 (Cầu lông)',    venue_type: 'badminton'  },
  { id: 'court-2', name: 'Sân 2 (Cầu lông)',    venue_type: 'badminton'  },
  { id: 'court-3', name: 'Sân 3 (Cầu lông)',    venue_type: 'badminton'  },
  { id: 'fb5-1',   name: 'Sân 5A (Bóng đá)',    venue_type: 'football_5' },
  { id: 'fb5-2',   name: 'Sân 5B (Bóng đá)',    venue_type: 'football_5' },
  { id: 'fb5-3',   name: 'Sân 5C (Bóng đá)',    venue_type: 'football_5' },
  { id: 'fb7-1',   name: 'Sân 7A (Bóng đá)',    venue_type: 'football_7' },
];

interface CourtBlock {
  id: string;
  court_id: string;
  court_name: string | null;
  block_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

export default function AdminVenuesPage() {
  const [blocks,    setBlocks]    = useState<CourtBlock[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [creating,  setCreating]  = useState(false);
  const [removing,  setRemoving]  = useState<string | null>(null);
  const [error,     setError]     = useState('');

  const [courtId,    setCourtId]    = useState(COURTS[0].id);
  const [date,       setDate]       = useState('');
  const [wholeDay,   setWholeDay]   = useState(true);
  const [startTime,  setStartTime]  = useState('14:00');
  const [endTime,    setEndTime]    = useState('16:00');
  const [reason,     setReason]     = useState('');

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/admin/court-blocks');
    const data = await res.json();
    setBlocks(data.blocks ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

  async function createBlock() {
    if (!date) { setError('Vui lòng chọn ngày khoá'); return; }
    setError('');
    setCreating(true);

    const court = COURTS.find(c => c.id === courtId)!;
    const res = await fetch('/api/admin/court-blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        court_id:   court.id,
        court_name: court.name,
        venue_type: court.venue_type,
        block_date: date,
        start_time: wholeDay ? null : startTime,
        end_time:   wholeDay ? null : endTime,
        reason,
      }),
    });
    const data = await res.json();
    setCreating(false);

    if (!res.ok) { setError(data.error ?? 'Lỗi khi tạo khoá sân'); return; }

    setDate(''); setReason(''); setWholeDay(true);
    fetchBlocks();
  }

  async function removeBlock(id: string) {
    if (!confirm('Gỡ khoá sân này?')) return;
    setRemoving(id);
    await fetch(`/api/admin/court-blocks/${id}`, { method: 'DELETE' });
    await fetchBlocks();
    setRemoving(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sân</h1>
        <p className="text-gray-500 text-sm mt-1">Khoá sân bảo trì — sân bị khoá sẽ ẩn khỏi lịch đặt của khách.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form tạo khoá */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 h-fit">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Lock size={16} /> Khoá sân bảo trì</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sân</label>
            <select
              value={courtId}
              onChange={e => setCourtId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
            >
              {COURTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ngày khoá</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="whole-day"
              type="checkbox"
              checked={wholeDay}
              onChange={e => setWholeDay(e.target.checked)}
              className="rounded border-gray-300 text-sports-primary focus:ring-sports-primary/30"
            />
            <label htmlFor="whole-day" className="text-sm text-gray-700">Khoá nguyên ngày</label>
          </div>

          {!wholeDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Từ giờ</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Đến giờ</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lý do (tuỳ chọn)</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="VD: Bảo trì sàn, thay lưới..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1.5"><AlertTriangle size={13} /> {error}</p>
          )}

          <button
            onClick={createBlock}
            disabled={creating}
            className="w-full flex items-center justify-center gap-2 bg-sports-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Tạo khoá sân
          </button>
        </div>

        {/* Danh sách khoá */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Sân đang/sắp bị khoá</h2>
            <button onClick={fetchBlocks} className="px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              <RefreshCw size={18} className="animate-spin mr-2" /> Đang tải...
            </div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Lock size={32} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">Chưa có sân nào bị khoá</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {blocks.map(b => (
                <div key={b.id} className="flex items-center justify-between gap-4 border border-gray-100 rounded-xl p-3.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{b.court_name ?? b.court_id}</span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        b.start_time ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700',
                      )}>
                        {b.start_time && b.end_time ? `${b.start_time} – ${b.end_time}` : 'Nguyên ngày'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(b.block_date), "EEEE, dd/MM/yyyy", { locale: vi })}
                      {b.reason && <span className="text-gray-400"> · {b.reason}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBlock(b.id)}
                    disabled={removing === b.id}
                    title="Gỡ khoá"
                    className="shrink-0 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-sports-primary transition-all"
                  >
                    {removing === b.id ? <RefreshCw size={16} className="animate-spin" /> : <Unlock size={16} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
