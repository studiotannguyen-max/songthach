'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';
import { applyPoints, bandLabel, effectivePoints, replayLedger, checkEventEdit, canDeleteEvent, type Gender } from '@/lib/rating';
import type { PlayerRecord } from './PlayerForm';
import { RatingEvent } from '@/lib/player-display';

const REASON_LABEL: Record<string, string> = {
  initial: 'Xếp trình ban đầu', manual_adjust: 'Điều chỉnh tay',
};

/** Một dòng sổ điểm: xem, sửa tại chỗ, hoặc xoá.
 *  Dòng "Xếp trình ban đầu" không cho xoá — nó giữ điểm gốc của cả sổ. */
function EventRow({ event: ev, events, playerId, gender, onDone }: {
  event: RatingEvent; events: RatingEvent[]; playerId: string; gender: Gender; onDone: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [points, setPoints] = useState(String(ev.points));
  const [note, setNote] = useState(ev.note ?? '');
  const [busy, setBusy] = useState(false);

  const p = Number(points);
  const loi = checkEventEdit({ reason: ev.reason, points: p, note });

  // Trình độ sau khi sửa — chạy lại cả sổ với dòng này đã thay số.
  const sauKhiSua = loi ? null : replayLedger(events.map(e => (e.id === ev.id ? { points: p } : { points: e.points })), gender);

  function huy() { setEditing(false); setPoints(String(ev.points)); setNote(ev.note ?? ''); }

  async function luu() {
    if (loi) return;
    setBusy(true);
    const res = await fetch(`/api/admin/players/${playerId}/points/${ev.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: p, note: note.trim() }),
    }).then(r => r.json()).catch(() => ({ error: 'Không gọi được máy chủ' }));
    setBusy(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success('Đã sửa dòng sổ điểm');
    setEditing(false); onDone();
  }

  async function xoa() {
    setBusy(true);
    const res = await fetch(`/api/admin/players/${playerId}/points/${ev.id}`, { method: 'DELETE' })
      .then(r => r.json()).catch(() => ({ error: 'Không gọi được máy chủ' }));
    setBusy(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success('Đã xoá dòng sổ điểm');
    setConfirming(false); onDone();
  }

  if (editing) {
    return (
      <div className="py-3 space-y-3">
        <div className="text-sm font-medium">{REASON_LABEL[ev.reason] ?? ev.reason}</div>
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <input className="inp tabular-nums" value={points} onChange={e => setPoints(e.target.value)} placeholder="+50" />
          <input className="inp" value={note} onChange={e => setNote(e.target.value)} placeholder="Lý do" />
        </div>

        {loi
          ? <p className="text-xs font-bold text-[#C5532F]">{loi}</p>
          : sauKhiSua && (
              <p className="text-xs text-gray-600">
                Sau khi sửa: <b>{bandLabel(sauKhiSua.band)} · tiến độ {sauKhiSua.progress}</b>
              </p>
            )}

        <div className="flex gap-2">
          <button onClick={luu} disabled={!!loi || busy}
            className="px-4 py-2 bg-sports-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {busy ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button onClick={huy} disabled={busy}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{REASON_LABEL[ev.reason] ?? ev.reason}</div>
        {ev.note && <div className="text-xs text-gray-500 mt-0.5">{ev.note}</div>}
        <div className="text-xs text-gray-400 mt-0.5 tabular-nums">{new Date(ev.created_at).toLocaleDateString('vi-VN')}</div>

        {confirming ? (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#C5532F]">Xoá hẳn dòng này?</span>
            <button onClick={xoa} disabled={busy}
              className="px-3 py-1 bg-[#C5532F] text-white rounded-lg text-xs font-bold disabled:opacity-50">
              {busy ? 'Đang xoá...' : 'Xoá'}
            </button>
            <button onClick={() => setConfirming(false)} disabled={busy}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium">
              Thôi
            </button>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-3">
            <button onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sports-primary hover:underline">
              <Pencil size={12} /> Sửa
            </button>
            {canDeleteEvent(ev.reason) && (
              <button onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#C5532F]">
                <Trash2 size={12} /> Xoá
              </button>
            )}
          </div>
        )}
      </div>

      <span className={`shrink-0 font-extrabold tabular-nums px-3 py-0.5 rounded-full border-2 border-[#3B2A1E] ${ev.reason === 'initial' ? 'bg-[#FBF4E6]' : ev.points < 0 ? 'bg-[#F1C9B4]' : 'bg-[#F6DD9E]'}`}>
        {ev.reason === 'initial' ? ev.points : (ev.points > 0 ? `+${ev.points}` : ev.points)}
      </span>
    </div>
  );
}

export default function AdjustPointsPanel({ player, events, onDone }: { player: PlayerRecord; events: RatingEvent[]; onDone: () => void }) {
  const [delta, setDelta] = useState('');
  const [note, setNote]   = useState('');
  const [saving, setSaving] = useState(false);

  const d = Number(delta);
  const valid = Number.isInteger(d) && d !== 0 && note.trim().length > 0;
  const preview = Number.isInteger(d) && d !== 0 ? applyPoints(player.band, player.progress_points, d, player.gender) : null;

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
            <EventRow
              key={ev.id}
              event={ev}
              events={events}
              playerId={player.id!}
              gender={player.gender}
              onDone={onDone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
