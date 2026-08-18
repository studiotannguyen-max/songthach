import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn(
      'rounded border border-line bg-bg overflow-hidden',
      'transition-[border-color,box-shadow] duration-150',
      'hover:border-brand hover:shadow-[0_2px_8px_rgb(0_0_0/0.08)]',
      className,
    )}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt, ratio = '16/10' }: { src: string; alt: string; ratio?: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}
