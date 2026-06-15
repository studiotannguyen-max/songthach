'use client';
import { useState } from 'react';
import { X, Repeat, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const COURTS = [
  { id: 'court-1', name: 'Sân 1', venue_type: 'badminton' },
  { id: 'court-2', name: 'Sân 2', venue_type: 'badminton' },
  { id: 'court-3', name: 'Sân 3', venue_type: 'badminton' },
];

const WEEKDAYS = [
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
  { value: 0, label: 'Chủ nhật' },
];

interface Result {
  created: number;
  skipped: string[];
}

export default function RecurringBookingModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [courtId,    setCourtId]    = useState(COURTS[0].id);
  const [dayOfWeek,  setDayOfWeek]  = useState(WEEKDAYS[0].value);
  const [startTime,  setStartTime]  = useState('18:00');
  const [duration,   setDuration]   = useState(1.5);
  const [startDate,  setStartDate]  = useState('');
  const [weeks,      setWeeks]      = useState(8);
  const [userName,   setUserName]   = useState('');
  const [userPhone,  setUserPhone]  = useState('');
  const [userEmail,  setUserEmail]  = useState('');
  const [note,       setNote]       = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [result,     setResult]     = useState<Result | null>(null);

  async function submit() {
    if (!startDate)        { setError('Vui lòng chọn ngày bắt đầu'); return; }
    if (!userPhone.trim()) { setError('Vui lòng nhập số điện thoại khách hàng'); return; }

    setError('');
    setSubmitting(true);

    const court = COURTS.find(c => c.id === courtId)!;
    const res = await fetch('/api/admin/bookings/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        court_id:    court.id,
        court_name:  court.name,
        venue_type:  court.venue_type,
        start_date:  startDate,
        day_of_week: dayOfWeek,
        start_time:  startTime,
        duration,
        weeks,
        user_name:   userName.trim() || null,
        user_phone:  userPhone.trim(),
        user_email:  userEmail.trim() || null,
        note,
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) { setError(data.error ?? 'Lỗi khi tạo lịch cố định'); return; }
    setResult({ created: data.created, skipped: data.skipped ?? [] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Repeat size={18} /> Tạo lịch cố định</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {result ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <p className="font-bold text-lg text-gray-900 mb-1">Đã tạo {result.created} lượt đặt cố định</p>
            {result.skipped.length > 0 ? (
              <p className="text-sm text-gray-500 mb-5">
                Bỏ qua {result.skipped.length} ngày do trùng lịch hoặc sân đang khoá: {result.skipped.join(', ')}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-5">Không có ngày nào bị trùng lịch.</p>
            )}
            <button
              onClick={onCreated}
              className="bg-sports-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Xong
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sân</label>
                <select value={courtId} onChange={e => setCourtId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary">
                  {COURTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lặp lại vào</label>
                <select value={dayOfWeek} onChange={e => setDayOfWeek(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary">
                  {WEEKDAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Giờ bắt đầu</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thời lượng (giờ)</label>
                <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary">
                  {[1, 1.5, 2, 2.5, 3].map(h => <option key={h} value={h}>{h}h</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Số tuần lặp</label>
                <input type="number" min={1} max={52} value={weeks} onChange={e => setWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bắt đầu từ ngày</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
            </div>

            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tên khách hàng</label>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="VD: Anh Nam"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                <input type="text" value={userPhone} onChange={e => setUserPhone(e.target.value)} placeholder="09xxxxxxxx"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email (tuỳ chọn)</label>
              <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="khach@email.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ghi chú (tuỳ chọn)</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="VD: Khách quen, ưu tiên giữ sân..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
            </div>

            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1.5"><AlertTriangle size={13} /> {error}</p>
            )}

            <button
              onClick={submit}
              disabled={submitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 bg-sports-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50',
              )}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Repeat size={16} />}
              Tạo lịch cố định
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
