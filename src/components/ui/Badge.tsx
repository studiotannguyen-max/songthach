import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const TONES = {
  neutral: 'bg-bg-subtle text-fg-muted border-line',
  brand:   'bg-[#E6F6EC] text-brand-strong border-[#B9E3C9]',
  danger:  'bg-[#FDECEA] text-danger border-[#F5C3BE]',
} as const;

export default function Badge({
  tone = 'neutral', className, children,
}: { tone?: keyof typeof TONES; className?: string; children: ReactNode }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em]',
      TONES[tone], className,
    )}>
      {children}
    </span>
  );
}
