'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bandLabel, effectivePoints } from '@/lib/rating';
import { initials } from '@/lib/player-display';
import './rating.css';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; }

export default function RatingHomePage() {
  const [players, setPlayers] = useState<P[]>([]);
  useEffect(() => { fetch('/api/players').then(r => r.json()).then(d => setPlayers((d.players ?? []).slice(0, 10))); }, []);

  return (
    <div className="rating-page">
      <div className="wrap">
        <span style={{ display: 'inline-block', background: 'var(--terra)', color: '#FFF6EC', fontFamily: 'Baloo 2', fontWeight: 700, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', padding: '7px 15px', border: '2.5px solid var(--ink)', borderRadius: 999, boxShadow: '3px 3px 0 var(--ink)', transform: 'rotate(-2deg)' }}>Giải đấu phân trình độ</span>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', margin: '18px 0 10px' }}>CLB Cầu Lông <span style={{ color: 'var(--terra)' }}>Song Thạch</span></h1>
        <p style={{ color: 'var(--brown)', fontWeight: 600, maxWidth: '60ch', marginBottom: 26 }}>Hệ thống điểm trình A100–A500. Ghép cặp theo tổng điểm để mọi trận cân sức. Điểm chỉ tăng, lịch sử công khai để ai cũng soi được.</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 34 }}>
          <Link href="/giai-dau-rating/bang-xep-hang" style={btn('var(--terra)', '#FFF6EC')}>Xem bảng xếp hạng →</Link>
          <Link href="/giai-dau-rating/the-le" style={btn('var(--cream2)', 'var(--ink)')}>Thể lệ</Link>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: 14 }}>Top 10</h2>
        {players.map((p, i) => (
          <Link key={p.id} href={`/giai-dau-rating/vdv/${p.id}`} className="row" style={{ gridTemplateColumns: '40px 1fr auto' }}>
            <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800, textAlign: 'center' }}>{i + 1}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="ava">{p.avatar_url ? <img src={p.avatar_url} alt="" /> : initials(p.full_name)}</div>
              <span style={{ fontFamily: 'Baloo 2', fontWeight: 700 }}>{p.nickname || p.full_name}</span>
              <span className={`band b${p.band}`}>{bandLabel(p.band)}</span>
            </div>
            <div className="num" style={{ fontFamily: 'Baloo 2', fontWeight: 800 }}>{effectivePoints(p)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
function btn(bg: string, color: string): React.CSSProperties {
  return { fontFamily: 'Baloo 2', fontWeight: 700, textDecoration: 'none', padding: '12px 24px', borderRadius: 999, border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', background: bg, color };
}
