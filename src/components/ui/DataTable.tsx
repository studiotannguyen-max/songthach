import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Column { key: string; header: string; align?: 'left' | 'right' }

/** Bảng dữ liệu: dưới 768px hiện dạng thẻ xếp dọc, từ 768px hiện bảng
 *  cuộn ngang có cột đầu ghim. Trang không bao giờ bị đẩy ngang. */
export default function DataTable({
  columns, rows, cardTitle,
}: {
  columns: Column[];
  rows: Record<string, ReactNode>[];
  cardTitle: (row: Record<string, ReactNode>) => ReactNode;
}) {
  return (
    <>
      <ul className="md:hidden space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="rounded border border-line p-4">
            <div className="font-display uppercase text-fg mb-3">{cardTitle(row)}</div>
            <dl className="space-y-1.5">
              {columns.slice(1).map((c) => (
                <div key={c.key} className="flex justify-between gap-4 text-sm">
                  <dt className="text-fg-muted">{c.header}</dt>
                  <dd className="text-fg text-right">{row[c.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden md:block overflow-x-auto rounded border border-line">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-bg-subtle">
              {columns.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 font-display uppercase tracking-[0.06em] text-xs text-fg whitespace-nowrap',
                    c.align === 'right' ? 'text-right' : 'text-left',
                    i === 0 && 'sticky left-0 bg-bg-subtle z-10',
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-line">
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    className={cn(
                      'px-4 py-3 text-fg',
                      c.align === 'right' ? 'text-right' : 'text-left',
                      ci === 0 && 'sticky left-0 bg-bg z-10 font-semibold',
                    )}
                  >
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
