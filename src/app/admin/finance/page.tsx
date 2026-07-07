'use client';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ChevronLeft, ChevronRight, Plus, Download, RefreshCw,
  TrendingUp, TrendingDown, Wallet, Pencil, Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import FinanceEntryModal from '@/components/admin/FinanceEntryModal';
import { CATEGORY_LABELS, type FinanceEntryWithBalance } from '@/lib/finance';
import { formatCurrency, cn } from '@/lib/utils';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function AdminFinancePage() {
  const [month,   setMonth]   = useState(currentMonth());
  const [entries, setEntries] = useState<FinanceEntryWithBalance[]>([]);
  const [totalThu, setTotalThu] = useState(0);
  const [totalChi, setTotalChi] = useState(0);
  const [balanceAtMonthEnd, setBalanceAtMonthEnd] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FinanceEntryWithBalance | null>(null);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/finance?month=${month}`);
    const data = await res.json();
    setEntries(data.entries ?? []);
    setTotalThu(data.totalThu ?? 0);
    setTotalChi(data.totalChi ?? 0);
    setBalanceAtMonthEnd(data.balanceAtMonthEnd ?? 0);
    setLoading(false);
  }, [month]);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(entry: FinanceEntryWithBalance) { setEditing(entry); setShowModal(true); }

  async function handleDelete(entry: FinanceEntryWithBalance) {
    if (!confirm(`Xoá giao dịch "${entry.description}"?`)) return;
    const res = await fetch(`/api/admin/finance/${entry.id}`, { method: 'DELETE' });
    if (!res.ok) { toast.error('Lỗi khi xoá'); return; }
    toast.success('Đã xoá');
    fetchLedger();
  }

  const [year, monthNum] = month.split('-');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sổ thu chi</h1>
          <p className="text-gray-500 text-sm mt-1">{entries.length} giao dịch trong tháng</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openCreate}
            className="flex items-center gap-2 text-sm text-white bg-sports-primary px-4 py-2 rounded-xl hover:bg-opacity-90 transition-colors font-semibold">
            <Plus size={15} /> Thêm giao dịch
          </button>
          <a href={`/api/admin/finance/export?month=${month}`}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={15} /> Xuất Excel
          </a>
          <button onClick={fetchLedger}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {showModal && (
        <FinanceEntryModal
          initialData={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchLedger(); }}
        />
      )}

      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setMonth(m => shiftMonth(m, -1))} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <p className="font-semibold text-gray-900 capitalize">Tháng {monthNum}/{year}</p>
        <button onClick={() => setMonth(m => shiftMonth(m, 1))} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card flex items-start gap-4">
          <div className="w-10 h-10 bg-green-500 flex items-center justify-center shrink-0"><TrendingUp size={18} className="text-white" /></div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(totalThu)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tổng thu tháng này</p>
          </div>
        </div>
        <div className="admin-card flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500 flex items-center justify-center shrink-0"><TrendingDown size={18} className="text-white" /></div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(totalChi)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tổng chi tháng này</p>
          </div>
        </div>
        <div className="admin-card flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center shrink-0"><Wallet size={18} className="text-white" /></div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(balanceAtMonthEnd)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Số dư luỹ kế</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <RefreshCw size={20} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Wallet size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có giao dịch nào trong tháng này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Ngày</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Diễn giải</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Danh mục</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Số tiền</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Số dư</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Ghi chú</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">{format(new Date(e.entry_date), 'dd/MM/yyyy', { locale: vi })}</td>
                    <td className="px-4 py-3.5">{e.description}</td>
                    <td className="px-4 py-3.5 text-gray-500">{e.category ? CATEGORY_LABELS[e.category] : '—'}</td>
                    <td className={cn('px-4 py-3.5 font-bold whitespace-nowrap', e.type === 'thu' ? 'text-green-600' : 'text-red-600')}>
                      {e.type === 'thu' ? '+' : '-'}{formatCurrency(e.amount)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(e.balance)}</td>
                    <td className="px-4 py-3.5 text-gray-500">{e.note ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(e)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
