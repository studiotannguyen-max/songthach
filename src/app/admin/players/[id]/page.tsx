'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PlayerForm, { type PlayerRecord } from '../PlayerForm';
import AdjustPointsPanel from '../AdjustPointsPanel';
import PlayerStatusPanel from '../PlayerStatusPanel';
import { RatingEvent } from '@/lib/player-display';

/** Bản ghi đầy đủ từ API — có thêm cờ sinh hoạt mà form không đụng tới. */
type AdminPlayer = PlayerRecord & { is_active: boolean };

/** Chỉ đưa cho PlayerForm những trường thuộc về nó. Form gửi nguyên state khi lưu,
 *  nên nếu để lọt is_active vào đây thì bản lưu sẽ ghi đè ngược trạng thái nghỉ. */
function toFormRecord(p: AdminPlayer): PlayerRecord {
  return {
    id: p.id, full_name: p.full_name, nickname: p.nickname, phone: p.phone,
    avatar_url: p.avatar_url, gender: p.gender, band: p.band, progress_points: p.progress_points,
    tested_at: p.tested_at, test_note: p.test_note,
  };
}

export default function EditPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<AdminPlayer | null>(null);
  const [events, setEvents] = useState<RatingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  function reload() {
    fetch(`/api/admin/players/${id}`).then(r => r.json()).then(d => {
      setPlayer(d.player); setEvents(d.events ?? []);
    }).finally(() => setLoading(false));
  }
  useEffect(reload, [id]);

  if (loading) return <p className="text-gray-400 py-16 text-center">Đang tải...</p>;
  if (!player) return <p className="text-gray-400 py-16 text-center">Không tìm thấy VĐV.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">{player.full_name}</h1>
        {!player.is_active && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Đã nghỉ</span>
        )}
      </div>
      <PlayerForm initial={toFormRecord(player)} onSaved={() => router.push('/admin/players')} />
      <AdjustPointsPanel player={player} events={events} onDone={reload} />
      <PlayerStatusPanel
        id={player.id!}
        fullName={player.full_name}
        isActive={player.is_active}
        onDone={reload}
      />
    </div>
  );
}
