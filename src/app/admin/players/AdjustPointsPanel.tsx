'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { applyPoints, bandLabel, effectivePoints } from '@/lib/rating';
import type { PlayerRecord } from './PlayerForm';
import { RatingEvent } from '@/lib/player-display';

const REASON_LABEL: Record<string, string> = {
  initial: 'Xếp trình ban đầu', manual_adjust: 'Điều chỉnh tay',
};

export default function AdjustPointsPanel({ player, events, onDone }: { player: PlayerRecord; events: RatingEvent[]; onDone: () => void }) {
  const [delta, setDelta] = useState('');
  const [note, setNote]   = useState('');
  const [saving, setSaving] = useState(false);

  const d = Number(delta);
  const valid = Number.isInteger(d) && d !== 0 && note.trim().length > 0;
  const preview = Number.isInteger(d) && d !== 0 ? applyPoints(player.band, player.progress_points, d) : null;

  async function submit() {
    if (!valid) return;
    setSaving(true);
    const res = await fetch(`/api/admin/players/${player.id}/points`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta: d, note: note.trim() }),
    }).then(r => r.json());
    setSaving(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success('Đã ghi vào sổ điểm');
    setDelta(''); setNote(''); onDone();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="admin-card p-5 space-y-4">
        <h3 className="font-bold">Cộng / trừ điểm</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Số điểm (âm để trừ)</span>
            <input className="inp tabular-nums" value={delta} onChange={e => setDelta(e.target.value)} placeholder="+50 hoặc -50" /></label>
        </div>
        <label className="block"><span className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Lý do (bắt buộc)</span>
          <input className="inp" value={note} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: Vô địch giải hạng 600 ngày 14/06" /></label>

        {preview && (
          <div className="bg-[#FBF4E6] border-2 border-[#3B2A1E] rounded-xl p-4">
            <div className="text-xs font-bold uppercase text-gray-500 mb-2">Kết quả sau khi ghi</div>
            <div className="flex items-center gap-3 flex-wrap font-bold">
              <span>{bandLabel(player.band)} tiến độ {player.progress_points}</span>
              <span className="text-[#C5532F] text-lg">→</span>
              <span className="bg-[#C5532F] text-[#FFF6EC] border-2 border-[#3B2A1E] rounded-full px-3 py-0.5">
                {bandLabel(preview.band)} · tiến độ {preview.progress}
              </span>
            </div>
            {preview.band !== player.band && (
              <div className="text-xs font-bold text-[#92400E] mt-2">
                {effectivePoints({ band: preview.band, progress_points: preview.progress }) > effectivePoints(player)
                  ? `Thăng hạng lên ${bandLabel(preview.band)}` : `Hạ xuống ${bandLabel(preview.band)}`}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={submit} disabled={!valid || saving} className="px-6 py-2.5 bg-sports-primary text-white rounded-xl font-medium disabled:opacity-50">
            {saving ? 'Đang ghi...' : 'Ghi vào sổ điểm'}
          </button>
        </div>
      </div>

      <div className="admin-card p-5">
        <h3 className="font-bold mb-3">Lịch sử điểm</h3>
        <div className="divide-y">
          {events.map(ev => (
            <div key={ev.id} className="py-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{REASON_LABEL[ev.reason] ?? ev.reason}</div>
                {ev.note && <div className="text-xs text-gray-500 mt-0.5">{ev.note}</div>}
                <div className="text-xs text-gray-400 mt-0.5 tabular-nums">{new Date(ev.created_at).toLocaleDateString('vi-VN')}</div>
              </div>
              <span className={`font-extrabold tabular-nums px-3 py-0.5 rounded-full border-2 border-[#3B2A1E] ${ev.reason === 'initial' ? 'bg-[#FBF4E6]' : ev.points < 0 ? 'bg-[#F1C9B4]' : 'bg-[#F6DD9E]'}`}>
                {ev.reason === 'initial' ? ev.points : (ev.points > 0 ? `+${ev.points}` : ev.points)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
