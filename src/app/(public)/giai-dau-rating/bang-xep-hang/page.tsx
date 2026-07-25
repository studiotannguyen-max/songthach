'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bandLabel, effectivePoints } from '@/lib/rating';
import { initials } from '@/lib/player-display';
import './../rating.css';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; }

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<P[]>([]);
  const [band, setBand] = useState<'all' | number>('all');
  useEffect(() => { fetch('/api/players').then(r => r.json()).then(d => setPlayers(d.players ?? [])); }, []);
  const list = players.filter(p => band === 'all' || p.band === band);

  return (
    <div className="rating-page">
      <div className="wrap">
        <h1 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Bảng xếp hạng <span style={{ color: 'var(--terra)' }}>CLB Song Thạch</span></h1>
        <p style={{ color: 'var(--brown)', fontWeight: 600, marginBottom: 20 }}>Xếp theo điểm hiệu dụng. Đủ 100 điểm tiến độ thì lên hạng. Điểm chỉ tăng, lịch sử công khai.</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {(['all', 500, 400, 300, 200, 100] as const).map(b => (
            <button key={b} onClick={() => setBand(b)}
              style={{ fontFamily: 'Baloo 2', fontWeight: 700, padding: '5px 14px', borderRadius: 999, border: '2.5px solid var(--ink)', cursor: 'pointer', background: band === b ? 'var(--ink)' : 'var(--cream2)', color: band === b ? 'var(--cream2)' : 'var(--ink)' }}>
              {b === 'all' ? 'Tất cả' : `A${b}`}
            </button>
          ))}
        </div>

        {list.map((p, i) => {
          const eff = effectivePoints(p); const atMax = p.band === 500;
          return (
            <Link key={p.id} href={`/giai-dau-rating/vdv/${p.id}`} className="row">
              <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: 19, textAlign: 'center' }}>{i + 1}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div className="ava">{p.avatar_url ? <img src={p.avatar_url} alt="" /> : initials(p.full_name)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Baloo 2', fontWeight: 700, fontSize: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nickname || p.full_name}</span>
                    <span className={`band b${p.band}`}>{bandLabel(p.band)}</span>
                  </div>
                </div>
              </div>
              <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: 19, textAlign: 'right' }}>{eff}</div>
              <div>
                <div className="num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                  <span>{atMax ? `${p.progress_points} điểm sau A500` : `${p.progress_points} / 100`}</span>
                  <span>{atMax ? '—' : `còn ${100 - p.progress_points}`}</span>
                </div>
                <div className="bar"><i className={atMax ? 'max' : ''} style={{ width: atMax ? '100%' : `${p.progress_points}%` }} /></div>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && <p style={{ color: 'var(--muted)', padding: '40px 0' }}>Chưa có VĐV nào.</p>}
      </div>
    </div>
  );
}
