'use client';
import { useCallback, useEffect, useState } from 'react';
import { Search, Ticket, Loader2, CheckCircle2, Phone, CalendarDays, Save, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  trigger_type: string;
  reward_type: string;
  reward_value: number;
  reward_note: string | null;
  valid_days: number;
  is_active: boolean;
}

const TRIGGER_LABEL: Record<string, string> = {
  booking_badminton: 'Đặt sân cầu lông',
  booking_football:  'Đặt sân bóng đá',
  manual:            'Phát tay tại quầy',
};

interface VoucherRow {
  id: string;
  code: string;
  customer_phone: string;
  status: 'issued' | 'redeemed' | 'expired' | 'revoked';
  expires_at: string;
  redeemed_at: string | null;
  redeemed_note: string | null;
  created_at: string;
  campaign: { name: string; reward_type: string; reward_value: number; reward_note: string | null } | null;
  booking: { court_name: string; booking_date: string; start_time: string } | null;
}

const STATUS_UI: Record<VoucherRow['status'], { label: string; cls: string }> = {
  issued:   { label: 'Còn hiệu lực', cls: 'bg-green-100 text-green-800' },
  redeemed: { label: 'Đã sử dụng',   cls: 'bg-blue-100 text-blue-800' },
  expired:  { label: 'Hết hạn',      cls: 'bg-gray-200 text-gray-600' },
  revoked:  { label: 'Đã thu hồi',   cls: 'bg-red-100 text-red-700' },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminVouchersPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<VoucherRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const search = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/vouchers?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRows(data.vouchers ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi tra cứu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { search(''); }, [search]);

  async function redeem(v: VoucherRow) {
    if (!confirm(`Xác nhận đổi voucher ${v.code} — ${v.campaign?.reward_note ?? ''}?`)) return;
    setRedeemingId(v.id);
    try {
      const res = await fetch(`/api/admin/vouchers/${v.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeem' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Đã đổi voucher ${v.code} — nhớ ghi nhận món 0đ trên KiotViet`);
      search(q);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi đổi voucher');
    } finally {
      setRedeemingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Voucher</h1>
        <p className="text-gray-500 text-sm mt-1">
          Khách đặt sân (đã xác nhận cọc) được tặng 1 ly nước — tra mã hoặc SĐT, bấm đổi, rồi ghi món 0đ trên KiotViet.
        </p>
      </div>

      <CampaignSection />

      {/* Tra cứu */}
      <form
        onSubmit={(e) => { e.preventDefault(); search(q); }}
        className="admin-card flex items-center gap-3"
      >
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nhập mã voucher (ST-XXXXXX) hoặc số điện thoại khách…"
          className="flex-1 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-sports-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          Tra cứu
        </button>
      </form>

      {/* Kết quả */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> Đang tải…
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Ticket size={32} className="mb-2" />
            <p className="text-sm">Không tìm thấy voucher</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500 font-medium">Mã</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500 font-medium">Khách</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500 font-medium">Quà</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500 font-medium">Từ booking</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500 font-medium">Hạn dùng</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500 font-medium">Trạng thái</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((v) => {
                  const ui = STATUS_UI[v.status];
                  return (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{v.code}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <Phone size={12} className="text-gray-400" /> {v.customer_phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-[220px]">
                        <p className="font-medium text-xs">{v.campaign?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{v.campaign?.reward_note}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {v.booking ? (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={12} className="text-gray-400" />
                            {v.booking.court_name} · {fmtDate(v.booking.booking_date)} {v.booking.start_time?.slice(0, 5)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">{fmtDate(v.expires_at)}</td>
                      <td className="py-3 px-4">
                        <span className={cn('status-badge', ui.cls)}>{ui.label}</span>
                        {v.redeemed_at && (
                          <p className="text-[10px] text-gray-400 mt-1">lúc {new Date(v.redeemed_at).toLocaleString('vi-VN')}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {v.status === 'issued' && (
                          <button
                            onClick={() => redeem(v)}
                            disabled={redeemingId === v.id}
                            className="inline-flex items-center gap-1.5 bg-sports-primary text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {redeemingId === v.id
                              ? <Loader2 size={13} className="animate-spin" />
                              : <CheckCircle2 size={13} />}
                            Đổi nước
                          </button>
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

/* ── Quản lý chương trình voucher ───────────── */
function CampaignSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  // Bản nháp chỉnh sửa: { [id]: { reward_note, valid_days } }
  const [drafts, setDrafts] = useState<Record<string, { reward_note: string; valid_days: number }>>({});

  useEffect(() => {
    fetch('/api/admin/voucher-campaigns')
      .then(r => r.json())
      .then(d => {
        const list: Campaign[] = d.campaigns ?? [];
        setCampaigns(list);
        setDrafts(Object.fromEntries(list.map(c => [c.id, {
          reward_note: c.reward_note ?? '',
          valid_days:  c.valid_days,
        }])));
      })
      .catch(() => toast.error('Không tải được danh sách chương trình'))
      .finally(() => setLoading(false));
  }, []);

  async function update(id: string, payload: Partial<{ is_active: boolean; reward_note: string; valid_days: number }>) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/voucher-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...payload } : c)));
      toast.success('Đã lưu chương trình');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi lưu chương trình');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-card flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 size={15} className="animate-spin" /> Đang tải chương trình…
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone size={16} className="text-sports-primary" />
        <h2 className="font-bold text-gray-900">Chương trình đang chạy</h2>
      </div>

      <div className="space-y-3">
        {campaigns.map((c) => {
          const draft = drafts[c.id] ?? { reward_note: c.reward_note ?? '', valid_days: c.valid_days };
          const dirty = draft.reward_note !== (c.reward_note ?? '') || draft.valid_days !== c.valid_days;
          return (
            <div key={c.id} className={cn(
              'border rounded-xl p-4 transition-colors',
              c.is_active ? 'border-sports-primary/30 bg-sports-light/40' : 'border-gray-200 bg-gray-50 opacity-75',
            )}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Điều kiện: {TRIGGER_LABEL[c.trigger_type] ?? c.trigger_type}
                  </p>
                </div>
                {/* Bật / tắt */}
                <button
                  onClick={() => update(c.id, { is_active: !c.is_active })}
                  disabled={savingId === c.id}
                  role="switch"
                  aria-checked={c.is_active}
                  aria-label={`${c.is_active ? 'Tắt' : 'Bật'} chương trình ${c.name}`}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors shrink-0',
                    c.is_active ? 'bg-sports-primary' : 'bg-gray-300',
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all',
                    c.is_active ? 'left-[22px]' : 'left-0.5',
                  )} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-2 items-center">
                <input
                  value={draft.reward_note}
                  onChange={(e) => setDrafts(p => ({ ...p, [c.id]: { ...draft, reward_note: e.target.value } }))}
                  placeholder="Mô tả quà tặng hiện cho khách…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sports-primary"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number" min={1} max={90}
                    value={draft.valid_days}
                    onChange={(e) => setDrafts(p => ({ ...p, [c.id]: { ...draft, valid_days: Number(e.target.value) } }))}
                    className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-sports-primary"
                    aria-label="Hạn dùng (ngày)"
                  />
                  <span className="text-xs text-gray-500">ngày</span>
                </div>
                <button
                  onClick={() => update(c.id, { reward_note: draft.reward_note, valid_days: draft.valid_days })}
                  disabled={!dirty || savingId === c.id}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all',
                    dirty
                      ? 'bg-sports-primary text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                  )}
                >
                  {savingId === c.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Lưu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Tắt chương trình → booking xác nhận sau đó sẽ không phát voucher nữa; voucher đã phát vẫn dùng được đến hết hạn.
      </p>
    </div>
  );
}
