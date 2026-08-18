'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { bandLabel, effectivePoints } from '@/lib/rating';
import { initials } from '@/lib/player-display';
import { PageHero, SectionHeader, Card, CardBody, Badge } from '@/components/ui';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; band: number; progress_points: number; }

const LINKS = [
  { href: '/giai-dau-rating/bang-xep-hang', title: 'Bảng xếp hạng', desc: 'Toàn bộ VĐV xếp theo điểm hiệu dụng, lọc theo mức trình.' },
  { href: '/giai-dau-rating/the-le',        title: 'Thể lệ',        desc: 'Cách tính điểm, ghép cặp và điều kiện thăng hạng.' },
];

export default function RatingHomePage() {
  const [players, setPlayers] = useState<P[]>([]);
  useEffect(() => { fetch('/api/players').then(r => r.json()).then(d => setPlayers((d.players ?? []).slice(0, 10))); }, []);

  return (
    <>
      <PageHero
        label="Giải đấu phân trình độ"
        title="CLB Cầu Lông Song Thạch"
        description="Hệ thống điểm trình A100–A500. Ghép cặp theo tổng điểm để mọi trận cân sức. Điểm chỉ tăng, lịch sử công khai."
        cta={{ label: 'Xem bảng xếp hạng', href: '/giai-dau-rating/bang-xep-hang' }}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 mb-16">
            {LINKS.map((l) => (
              <Card key={l.href}>
                <Link href={l.href} className="block h-full">
                  <CardBody>
                    <h2 className="text-xl mb-2">{l.title}</h2>
                    <p className="text-sm text-fg-muted">{l.desc}</p>
                    <span className="mt-4 flex items-center gap-1.5 text-sm font-display uppercase tracking-[0.06em] text-brand-strong">
                      Xem <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </CardBody>
                </Link>
              </Card>
            ))}
          </div>

          <SectionHeader label="Đang dẫn đầu" title="Top 10" />

          {players.length === 0 ? (
            <p className="text-fg-muted">Chưa có VĐV nào.</p>
          ) : (
            <ul className="rounded border border-line divide-y divide-line">
              {players.map((p, i) => (
                <li key={p.id}>
                  <Link
                    href={`/giai-dau-rating/vdv/${p.id}`}
                    className="flex items-center gap-4 px-4 py-3 min-h-[56px] hover:bg-bg-subtle transition-colors"
                  >
                    <span className="w-8 text-center font-display text-lg text-fg-muted tabular-nums">{i + 1}</span>
                    <span className="w-10 h-10 shrink-0 rounded-full border border-line bg-bg-subtle grid place-items-center overflow-hidden font-display text-sm text-fg">
                      {p.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                        : initials(p.full_name)}
                    </span>
                    <span className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-fg truncate">{p.nickname || p.full_name}</span>
                      <Badge tone={p.band >= 400 ? 'brand' : 'neutral'}>{bandLabel(p.band)}</Badge>
                    </span>
                    <span className="font-display text-lg text-fg tabular-nums">{effectivePoints(p)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
