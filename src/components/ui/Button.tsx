import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  solid:   'bg-brand-strong text-white border border-brand-strong hover:bg-[#00692C]',
  outline: 'bg-transparent text-fg border border-line hover:border-brand hover:text-brand-strong',
  ghost:   'bg-transparent text-brand-strong border border-transparent hover:bg-bg-subtle',
};

// Cỡ nhỏ nhất vẫn cao 44px — quy tắc vùng bấm tối thiểu trên điện thoại.
const SIZES: Record<Size, string> = {
  sm: 'min-h-[44px] px-4 text-sm',
  md: 'min-h-[48px] px-6 text-sm',
  lg: 'min-h-[56px] px-8 text-base',
};

export default function Button({
  variant = 'solid', size = 'md', className, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded font-display uppercase tracking-[0.06em]',
        'transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant], SIZES[size], className,
      )}
    />
  );
}
