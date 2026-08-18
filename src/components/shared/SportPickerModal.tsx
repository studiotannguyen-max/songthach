'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useSportPicker } from '@/components/providers/SportPickerProvider';

const SPORTS = [
  {
    label: 'Sân Bóng Đá',
    sub: '3 sân · 5 người & 7 người',
    href: '/sports/football',
    icon: '/icon-football.png',
  },
  {
    label: 'Sân Cầu Lông',
    sub: '3 sân tiêu chuẩn BWF',
    href: '/sports/badminton',
    icon: '/icon-shuttlecock.png',
  },
] as const;

export default function SportPickerModal() {
  const { isOpen, close } = useSportPicker();
  const router = useRouter();

  // Fix 1: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Fix 3: Body scroll lock while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  function pick(href: string) {
    close();
    router.push(href);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={close}
    >
      {/* Panel — bottom-sheet trên mobile, dialog giữa trên desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sport-picker-title"
        className="
          relative w-full bg-bg border border-line
          rounded-t md:rounded
          p-5 md:p-7
          md:max-w-[440px]
          pb-[calc(env(safe-area-inset-bottom)+20px)] md:pb-7
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="sport-picker-title" className="text-lg">
            Chọn loại sân
          </h2>
          <button
            onClick={close}
            className="w-11 h-11 -mr-2 rounded flex items-center justify-center text-fg hover:bg-bg-subtle transition-colors"
            aria-label="Đóng"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Sport cards */}
        <div className="grid grid-cols-2 gap-3">
          {SPORTS.map(({ label, sub, href, icon }) => (
            <button
              key={href}
              onClick={() => pick(href)}
              className="flex flex-col rounded border border-line bg-bg-subtle overflow-hidden transition-colors hover:border-brand"
            >
              <div className="relative w-full h-28 p-6">
                <Image src={icon} alt="" fill className="object-contain" sizes="200px" />
              </div>
              <div className="p-3 text-left">
                <p className="font-semibold text-sm text-fg leading-tight">{label}</p>
                <p className="text-sm text-fg-muted mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={close}
          className="mt-4 w-full min-h-[44px] text-sm text-fg-muted hover:text-fg transition-colors"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
