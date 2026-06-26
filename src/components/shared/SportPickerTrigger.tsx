'use client';

import { CSSProperties } from 'react';
import { useSportPicker } from '@/components/providers/SportPickerProvider';

export default function SportPickerTrigger({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  const { open } = useSportPicker();
  return (
    <button type="button" onClick={open} className={className} style={style}>
      {children}
    </button>
  );
}
