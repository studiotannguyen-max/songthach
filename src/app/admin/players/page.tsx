'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, Plus, Upload } from 'lucide-react';
import { bandLabel, effectivePoints } from '@/lib/rating';
import { initials } from '@/lib/player-display';

interface Player {
  id: string; full_name: string; nickname: string | null; phone: string | null;
  avatar_url: string | null; band: number; progress_points: number;
  tested_at: string | null; is_active: boolean;
}

const BAND_BG: Record<number, string> = {
  100: 'bg-[#FFFBF2] text-[#3B2A1E]', 200: 'bg-[#F6DD9E] text-[#3B2A1E]',
  300: 'bg-[#E3A21A] text-[#3B2A1E]', 400: 'bg-[#F1C9B4] text-[#3B2A1E]',
  500: 'bg-[#C5532F] text-[#FFF6EC]',
};

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [band,    setBand]    = useState<'all' | number>('all');
  const [active,  setActive]  = useState<'active' | 'inactive' | 'all'>('active');

  function reload() {
    setLoading(true);
    fetch('/api/admin/players').then(r => r.json())
      .then(d => setPlayers(d.players ?? [])).finally(() => setLoading(false));
  }
  useEffect(reload, []);

  const filtered = players.filter(p => {
    const q = search.trim().toLowerCase();
    if (q && !p.full_name.toLowerCase().includes(q) && !(p.phone ?? '').includes(q)
        && !(p.nickname ?? '').toLowerCase().includes(q)) return false;
    if (band !== 'all' && p.band !== band) return false;
    if (active === 'active' && !p.is_active) return false;
    if (active === 'inactive' && p.is_active) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">VĐV cầu lông</h1>
          <p className="text-gray-500 text-sm mt-1">Hồ sơ trình độ & điểm — số điện thoại chỉ hiện ở đây</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/players/nhap-excel" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Upload size={15} /> Nhập Excel
          </Link>
          <Link href="/admin/players/moi" className="inline-flex items-center gap-2 px-4 py-2.5 bg-sports-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Plus size={15} /> Thêm VĐV
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, biệt danh, SĐT..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30" />
        </div>
        <select value={band} onChange={e => setBand(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
          <option value="all">Tất cả trình</option>
          {[500,400,300,200,100].map(b => <option key={b} value={b}>A{b}</option>)}
        </select>
        <select value={active} onChange={e => setActive(e.target.value as typeof active)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
          <option value="active">Đang sinh hoạt</option>
          <option value="inactive">Đã nghỉ</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      <div className="admin-card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw size={18} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">Chưa có VĐV nào.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b">
                <th className="px-4 py-3">Vận động viên</th><th className="px-4 py-3">Trình</th>
                <th className="px-4 py-3 text-right">Tiến độ</th><th className="px-4 py-3 text-right">Hiệu dụng</th>
                <th className="px-4 py-3">Ngày test</th><th className="px-4 py-3">Trạng thái</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border-2 border-[#3B2A1E] grid place-items-center text-xs font-bold bg-[#F6DD9E] overflow-hidden">
                        {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(p.full_name)}
                      </div>
                      <div>
                        <div className="font-semibold">{p.full_name}</div>
                        {p.phone && <div className="text-xs text-gray-500 tabular-nums">{p.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-block px-2.5 py-0.5 rounded-full border-2 border-[#3B2A1E] text-xs font-extrabold ${BAND_BG[p.band]}`}>{bandLabel(p.band)}</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.progress_points}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold">{effectivePoints(p)}</td>
                  <td className="px-4 py-3 tabular-nums text-gray-500">{p.tested_at ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Đang sinh hoạt' : 'Đã nghỉ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/players/${p.id}`} className="text-sports-primary font-semibold hover:underline">Mở</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
