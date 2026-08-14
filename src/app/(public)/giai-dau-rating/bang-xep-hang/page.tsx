'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { bandLabel, effectivePoints } from '@/lib/rating';
import { initials } from '@/lib/player-display';
import { PageHero, Badge, DataTable } from '@/components/ui';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; }

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<P[]>([]);
  const [band, setBand] = useState<'all' | number>('all');
  useEffect(() => { fetch('/api/players').then(r => r.json()).then(d => setPlayers(d.players ?? [])); }, []);
  const list = players.filter(p => band === 'all' || p.band === band);

  const rows = list.map((p, i) => {
    const atMax = p.band === 500;
    return {
      hang: <span className="tabular-nums">{i + 1}</span>,
      ten: (
        <Link href={`/giai-dau-rating/vdv/${p.id}`} className="flex items-center gap-3 min-w-0 hover:text-brand-strong">
          <span className="w-9 h-9 shrink-0 rounded-full border border-line bg-bg-subtle grid place-items-center overflow-hidden font-display text-xs text-fg">
            {p.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
              : initials(p.full_name)}
          </span>
          <span className="truncate font-semibold">{p.nickname || p.full_name}</span>
          <Badge tone={p.band >= 400 ? 'brand' : 'neutral'}>{bandLabel(p.band)}</Badge>
        </Link>
      ),
      diem: <span className="font-display text-lg tabular-nums">{effectivePoints(p)}</span>,
      tien_do: (
        <div className="min-w-[140px]">
          <div className="flex justify-between text-xs text-fg-muted mb-1 tabular-nums">
            <span>{atMax ? `${p.progress_points} điểm sau A500` : `${p.progress_points} / 100`}</span>
            <span>{atMax ? '—' : `còn ${100 - p.progress_points}`}</span>
          </div>
          <div className="h-2 rounded bg-bg-subtle border border-line overflow-hidden">
            <div
              className={atMax ? 'h-full bg-brand-strong' : 'h-full bg-brand'}
              style={{ width: atMax ? '100%' : `${p.progress_points}%` }}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <>
      <PageHero
        label="CLB Song Thạch"
        title="Bảng xếp hạng"
        description="Xếp theo điểm hiệu dụng. Đủ 100 điểm tiến độ thì lên hạng. Điểm chỉ tăng, lịch sử công khai."
      />

      <section className="section">
        <div className="container-page">
          {/* Lọc theo mức trình */}
          <div className="flex gap-2 flex-wrap mb-8">
            {(['all', 500, 400, 300, 200, 100] as const).map(b => (
              <button
                key={b}
                onClick={() => setBand(b)}
                aria-pressed={band === b}
                className={cn(
                  'min-h-[44px] px-4 rounded border font-display uppercase tracking-[0.06em] text-sm transition-colors',
                  band === b
                    ? 'bg-brand-strong border-brand-strong text-white'
                    : 'bg-bg border-line text-fg hover:border-brand hover:text-brand-strong',
                )}
              >
                {b === 'all' ? 'Tất cả' : `A${b}`}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="text-fg-muted">Chưa có VĐV nào.</p>
          ) : (
            /* Cột "Vận động viên" đứng đầu để trên điện thoại nó thành tiêu đề thẻ,
               các cột còn lại xếp thành danh sách bên dưới — không lặp lại. */
            <DataTable
              columns={[
                { key: 'ten',     header: 'Vận động viên' },
                { key: 'hang',    header: 'Hạng', align: 'right' },
                { key: 'diem',    header: 'Điểm', align: 'right' },
                { key: 'tien_do', header: 'Tiến độ' },
              ]}
              rows={rows}
              cardTitle={(row) => row.ten}
            />
          )}
        </div>
      </section>
    </>
  );
}
