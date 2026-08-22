'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { bandLabel, effectivePoints, BAND_CEILING, type Gender } from '@/lib/rating';
import { initials } from '@/lib/player-display';
import { Card, CardBody, Badge, Breadcrumb, DataTable } from '@/components/ui';

interface P { id: string; full_name: string; nickname: string | null; avatar_url: string | null; gender: Gender; band: number; progress_points: number; tested_at: string | null; }
const GENDER_LABEL: Record<Gender, string> = { nam: 'Nam', nu: 'Nữ' };
interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }
const REASON: Record<string, string> = { initial: 'Xếp trình ban đầu', manual_adjust: 'Điều chỉnh điểm' };

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<P | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/players/${id}`).then(r => r.json()).then(d => { setPlayer(d.player ?? null); setEvents(d.events ?? []); }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="section container-page text-fg-muted">Đang tải...</div>;
  }
  if (!player) {
    return <div className="section container-page text-fg-muted">Không tìm thấy VĐV.</div>;
  }

  const eff   = effectivePoints(player);
  // Kịch trần tuỳ giới: nam A500, nữ A400.
  const atMax = player.band === BAND_CEILING[player.gender];

  const rows = events.map((ev) => ({
    ngay:  <span className="tabular-nums">{new Date(ev.created_at).toLocaleDateString('vi-VN')}</span>,
    ly_do: (
      <span>
        {REASON[ev.reason] ?? ev.reason}
        {ev.note && <span className="block text-sm text-fg-muted">{ev.note}</span>}
      </span>
    ),
    diem: (
      <span className="font-display tabular-nums">
        {ev.reason === 'initial' ? ev.points : (ev.points > 0 ? `+${ev.points}` : ev.points)}
      </span>
    ),
  }));

  return (
    <section className="section">
      <div className="container-page">
        <Breadcrumb
          items={[
            { label: 'Trang chủ',       href: '/' },
            { label: 'Rally Grand Prix', href: '/giai-dau-rating' },
            { label: 'Bảng xếp hạng',   href: '/giai-dau-rating/bang-xep-hang' },
            { label: player.nickname || player.full_name },
          ]}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] items-start">
          {/* Thông tin VĐV */}
          <Card>
            <CardBody>
              <div className="text-center">
                <span className="w-24 h-24 mx-auto mb-4 rounded-full border border-line bg-bg-subtle grid place-items-center overflow-hidden font-display text-3xl text-fg">
                  {player.avatar_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
                    : initials(player.full_name)}
                </span>
                <h1 className="text-2xl normal-case">{player.full_name}</h1>
                {player.nickname && <p className="text-fg-muted mt-1">&ldquo;{player.nickname}&rdquo;</p>}
                <div className="mt-3">
                  <Badge tone={player.band >= 400 ? 'brand' : 'neutral'}>{bandLabel(player.band)}</Badge>
                </div>

                <p className="mt-5 font-display text-4xl text-fg tabular-nums">{eff}</p>
                <p className="text-xs uppercase tracking-[0.08em] text-fg-muted">điểm hiệu dụng</p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-fg-muted mb-1.5 tabular-nums">
                  <span>{atMax ? 'Đã đạt mức cao nhất' : `Tiến độ lên A${player.band + 100}`}</span>
                  <span>{atMax ? '—' : `${player.progress_points}/100`}</span>
                </div>
                <div className="h-2 rounded bg-bg-subtle border border-line overflow-hidden">
                  <div
                    className={atMax ? 'h-full bg-brand-strong' : 'h-full bg-brand'}
                    style={{ width: atMax ? '100%' : `${player.progress_points}%` }}
                  />
                </div>
              </div>

              {player.tested_at && (
                <p className="mt-4 text-sm text-fg-muted text-center">Test trình: {player.tested_at}</p>
              )}
            </CardBody>
          </Card>

          {/* Lịch sử điểm */}
          <div>
            <h2 className="text-xl mb-4">Lịch sử điểm</h2>
            {rows.length === 0 ? (
              <p className="text-fg-muted">Chưa có thay đổi điểm nào.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'ly_do', header: 'Lý do' },
                  { key: 'ngay',  header: 'Ngày' },
                  { key: 'diem',  header: 'Điểm', align: 'right' },
                ]}
                rows={rows}
                cardTitle={(row) => row.ly_do}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
