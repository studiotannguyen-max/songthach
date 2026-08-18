import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Đường dẫn" className="flex items-center gap-1.5 text-xs text-fg-muted flex-wrap">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
          {item.href
            ? <Link href={item.href} className="hover:text-brand-strong">{item.label}</Link>
            : <span className="text-fg">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
