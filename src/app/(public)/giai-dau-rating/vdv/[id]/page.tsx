'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { bandLabel, effectivePoints } from '@/lib/rating';
import { initials } from '@/lib/player-display';
import './../../rating.css';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; tested_at: string | null; }
interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }
const REASON: Record<string, string> = { initial: 'Xếp trình ban đầu', manual_adjust: 'Điều chỉnh điểm' };

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<P | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/players/${id}`).then(r => r.json()).then(d => { setPlayer(d.player ?? null); setEvents(d.events ?? []); }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="rating-page"><div className="wrap">Đang tải...</div></div>;
  if (!player) return <div className="rating-page"><div className="wrap">Không tìm thấy VĐV.</div></div>;
  const eff = effectivePoints(player); const atMax = player.band === 500;

  return (
    <div className="rating-page">
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,320px) 1fr', gap: 24, alignItems: 'start' }} className="profile-grid">
          <div style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 20, boxShadow: '5px 5px 0 var(--ink)', padding: 22, textAlign: 'center' }}>
            <div className="ava" style={{ width: 96, height: 96, fontSize: 34, margin: '0 auto 14px' }}>{player.avatar_url ? <img src={player.avatar_url} alt="" /> : initials(player.full_name)}</div>
            <h1 style={{ fontSize: '1.8rem' }}>{player.full_name}</h1>
            {player.nickname && <div style={{ color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>"{player.nickname}"</div>}
            <span className={`band b${player.band}`}>{bandLabel(player.band)}</span>
            <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: '2.4rem', marginTop: 14 }}>{eff}<span style={{ display: 'block', fontFamily: 'Nunito', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>điểm hiệu dụng</span></div>
            <div style={{ marginTop: 14 }}>
              <div className="num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 5 }}>
                <span>{atMax ? 'Đã đạt mức cao nhất' : `Tiến độ lên A${player.band + 100}`}</span><span>{atMax ? '—' : `${player.progress_points}/100`}</span>
              </div>
              <div className="bar"><i className={atMax ? 'max' : ''} style={{ width: atMax ? '100%' : `${player.progress_points}%` }} /></div>
            </div>
            {player.tested_at && <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>Test trình: {player.tested_at}</div>}
          </div>

          <div style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: 20, boxShadow: '5px 5px 0 var(--ink)', padding: 22 }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 14 }}>Lịch sử điểm</h2>
            {events.map(ev => (
              <div key={ev.id} style={{ display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 12, padding: '13px 0', borderBottom: '2px dashed var(--line)' }}>
                <div className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{new Date(ev.created_at).toLocaleDateString('vi-VN')}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{REASON[ev.reason] ?? ev.reason}{ev.note && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)' }}>{ev.note}</span>}</div>
                <span className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, padding: '3px 12px', border: '2.5px solid var(--ink)', borderRadius: 999, background: ev.reason === 'initial' ? 'var(--cream2)' : ev.points < 0 ? 'var(--terra-soft)' : 'var(--mustard-soft)', height: 'fit-content' }}>
                  {ev.reason === 'initial' ? ev.points : (ev.points > 0 ? `+${ev.points}` : ev.points)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
