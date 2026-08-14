import { cn } from '@/lib/utils';

export default function SectionHeader({
  label, title, description, align = 'left',
}: { label?: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return (
    <div className={cn('mb-8 md:mb-12', align === 'center' && 'text-center mx-auto max-w-2xl')}>
      {label && (
        <p className="text-xs uppercase tracking-[0.08em] text-brand-strong font-semibold mb-3">
          {label}
        </p>
      )}
      <h2 className="text-[clamp(28px,3.5vw,44px)]">{title}</h2>
      {description && <p className="mt-4 text-fg-muted">{description}</p>}
    </div>
  );
}
