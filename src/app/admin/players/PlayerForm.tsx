'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { effectivePoints, bandLabel } from '@/lib/rating';
import { initials } from '@/lib/player-display';

export interface PlayerRecord {
  id?: string; full_name: string; nickname: string | null; phone: string | null;
  avatar_url: string | null; band: number; progress_points: number;
  tested_at: string | null; test_note: string | null;
}

const BANDS = [100, 200, 300, 400, 500];
const BAND_BG: Record<number, string> = {
  100: 'bg-[#FFFBF2]', 200: 'bg-[#F6DD9E]', 300: 'bg-[#E3A21A]',
  400: 'bg-[#F1C9B4]', 500: 'bg-[#C5532F] text-[#FFF6EC]',
};

export default function PlayerForm({ initial, onSaved }: { initial?: PlayerRecord; onSaved: () => void }) {
  const isEdit = !!initial?.id;
  const [f, setF] = useState<PlayerRecord>(initial ?? {
    full_name: '', nickname: null, phone: null, avatar_url: null,
    band: 300, progress_points: 0, tested_at: null, test_note: null,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof PlayerRecord>(k: K, v: PlayerRecord[K]) { setF(prev => ({ ...prev, [k]: v })); }

  async function uploadAvatar(file: File) {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd }).then(r => r.json());
    setUploading(false);
    if (res.url) set('avatar_url', res.url); else toast.error(res.error ?? 'Upload lỗi');
  }

  async function save() {
    if (!f.full_name.trim()) { toast.error('Nhập họ tên'); return; }
    if (f.band < 500 && f.progress_points >= 100) { toast.error('Tiến độ vượt mốc 100 khi chưa phải A500'); return; }
    setSaving(true);
    const url = isEdit ? `/api/admin/players/${initial!.id}` : '/api/admin/players';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }).then(r => r.json());
    setSaving(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(isEdit ? 'Đã lưu' : 'Đã thêm VĐV');
    onSaved();
  }

  const effective = effectivePoints(f);

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
      <div className="space-y-5">
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-bold">Thông tin cá nhân</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Họ và tên *"><input className="inp" value={f.full_name} onChange={e => set('full_name', e.target.value)} /></Field>
            <Field label="Biệt danh"><input className="inp" value={f.nickname ?? ''} onChange={e => set('nickname', e.target.value || null)} /></Field>
            <Field label="Số điện thoại" hint="Chỉ hiện trong khu quản trị"><input className="inp tabular-nums" value={f.phone ?? ''} onChange={e => set('phone', e.target.value || null)} /></Field>
          </div>
        </div>

        <div className="admin-card p-5 space-y-4">
          <h3 className="font-bold">{isEdit ? 'Mức trình hiện tại' : 'Chấm mức trình ban đầu'}</h3>
          {isEdit ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center px-4 py-2 rounded-xl border-2 border-[#3B2A1E] font-extrabold ${BAND_BG[f.band]}`}>{bandLabel(f.band)}</span>
              <span className="text-sm text-gray-600">tiến độ <b className="tabular-nums">{f.progress_points}</b> · hiệu dụng <b className="tabular-nums">{effective}</b></span>
              <span className="w-full text-xs text-gray-500">Đổi trình qua mục <b>Cộng / trừ điểm</b> bên dưới — điểm luôn đi qua sổ để không sai lệch.</span>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {BANDS.map(b => (
                  <label key={b} className="cursor-pointer">
                    <input type="radio" name="band" className="sr-only peer" checked={f.band === b} onChange={() => set('band', b)} />
                    <span className={`flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl border-2 border-gray-300 peer-checked:border-[#3B2A1E] peer-checked:shadow-[3px_3px_0_#3B2A1E] ${f.band === b ? BAND_BG[b] : 'bg-white'}`}>
                      <span className="font-extrabold">A{b}</span><span className="text-[11px] text-gray-500 peer-checked:text-inherit">{b} điểm</span>
                    </span>
                  </label>
                ))}
              </div>
              <Field label="Điểm tiến độ khởi đầu" hint="Để 0 trừ khi chuyển dữ liệu cũ"><input type="number" min={0} className="inp tabular-nums" value={f.progress_points} onChange={e => set('progress_points', Math.max(0, Number(e.target.value) || 0))} /></Field>
            </>
          )}
          <Field label="Ngày test trình"><input type="date" className="inp tabular-nums" value={f.tested_at ?? ''} onChange={e => set('tested_at', e.target.value || null)} /></Field>
          <Field label="Ghi chú buổi test"><textarea className="inp min-h-[74px]" value={f.test_note ?? ''} onChange={e => set('test_note', e.target.value || null)} /></Field>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-sports-primary text-white rounded-xl font-medium disabled:opacity-50">
            {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Lưu VĐV'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="admin-card p-4">
          <div className="text-xs font-bold uppercase text-gray-500 mb-2">Ảnh đại diện</div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full border-2 border-[#3B2A1E] grid place-items-center text-2xl font-bold bg-[#F6DD9E] overflow-hidden">
              {f.avatar_url ? <img src={f.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(f.full_name)}
            </div>
            <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
              {uploading ? 'Đang tải...' : 'Chọn ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) uploadAvatar(file); }} />
            </label>
          </div>
        </div>
        <div className="admin-card p-4">
          <div className="text-xs font-bold uppercase text-gray-500 mb-2">Trang công khai sẽ hiện</div>
          <div className="text-center">
            <div className="font-bold text-lg">{f.full_name || 'Chưa có tên'}</div>
            {f.nickname && <div className="text-sm text-gray-500">"{f.nickname}"</div>}
            <div className="mt-2"><span className={`inline-block px-3 py-0.5 rounded-full border-2 border-[#3B2A1E] font-extrabold ${BAND_BG[f.band]}`}>{bandLabel(f.band)}</span></div>
            <div className="text-2xl font-extrabold mt-2 tabular-nums">{effective}<span className="block text-[10px] font-bold uppercase text-gray-500">điểm hiệu dụng</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}
