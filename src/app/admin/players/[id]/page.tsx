'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PlayerForm, { type PlayerRecord } from '../PlayerForm';
import AdjustPointsPanel from '../AdjustPointsPanel';

interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }

export default function EditPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerRecord | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
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
      <h1 className="text-2xl font-bold text-gray-900">{player.full_name}</h1>
      <PlayerForm initial={player} onSaved={() => router.push('/admin/players')} />
      <AdjustPointsPanel player={player} events={events} onDone={reload} />
    </div>
  );
}
