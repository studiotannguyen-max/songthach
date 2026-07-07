'use client';
import { useState } from 'react';
import { X, Loader2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS, type FinanceEntryWithBalance, type FinanceType, type FinanceCategory } from '@/lib/finance';

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [FinanceCategory, string][];

interface Props {
  initialData?: FinanceEntryWithBalance | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function FinanceEntryModal({ initialData, onClose, onSaved }: Props) {
  const isEdit = Boolean(initialData);

  const [type,        setType]        = useState<FinanceType>(initialData?.type ?? 'thu');
  const [entryDate,   setEntryDate]   = useState(initialData?.entry_date ?? new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [amount,      setAmount]      = useState(initialData ? String(initialData.amount) : '');
  const [category,    setCategory]    = useState<FinanceCategory>(initialData?.category ?? CATEGORY_OPTIONS[0][0]);
  const [note,        setNote]        = useState(initialData?.note ?? '');

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  async function submit() {
    if (!entryDate)              { setError('Vui lòng chọn ngày'); return; }
    if (!description.trim())     { setError('Vui lòng nhập diễn giải'); return; }
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) { setError('Số tiền phải lớn hơn 0'); return; }

    setError('');
    setSubmitting(true);

    const payload = {
      entry_date: entryDate,
      type,
      category: type === 'chi' ? category : null,
      description: description.trim(),
      amount: amountNum,
      note: note.trim() || null,
    };

    const url = isEdit ? `/api/admin/finance/${initialData!.id}` : '/api/admin/finance';
    const res = await fetch(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) { setError(data.error ?? 'Lỗi khi lưu giao dịch'); return; }
    toast.success(isEdit ? 'Đã lưu thay đổi' : 'Đã thêm giao dịch');
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{isEdit ? 'Sửa giao dịch' : 'Thêm giao dịch'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('thu')}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all',
                type === 'thu' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500',
              )}
            >
              <TrendingUp size={16} /> Thu
            </button>
            <button
              onClick={() => setType('chi')}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all',
                type === 'chi' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500',
              )}
            >
              <TrendingDown size={16} /> Chi
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ngày</label>
            <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Diễn giải</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="VD: San S5 19:00"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Số tiền (VNĐ)</label>
              <input type="number" min={1} value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="170000"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
            </div>
            {type === 'chi' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Danh mục</label>
                <select value={category} onChange={e => setCategory(e.target.value as FinanceCategory)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary">
                  {CATEGORY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ghi chú (tuỳ chọn)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary" />
          </div>

          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1.5"><AlertTriangle size={13} /> {error}</p>
          )}

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-sports-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isEdit ? 'Lưu thay đổi' : 'Thêm giao dịch'}
          </button>
        </div>
      </div>
    </div>
  );
}
