'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useSportPicker } from '@/components/providers/SportPickerProvider';
import { FootballArt, BadmintonArt } from '@/components/shared/ZoneArt';

const SPORTS = [
  {
    label: 'Sân Bóng Đá',
    sub: '3 sân · 5 người & 7 người',
    href: '/sports/football',
    Art: FootballArt,
  },
  {
    label: 'Sân Cầu Lông',
    sub: '3 sân tiêu chuẩn BWF',
    href: '/sports/badminton',
    Art: BadmintonArt,
  },
] as const;

export default function SportPickerModal() {
  const { isOpen, close } = useSportPicker();
  const router = useRouter();

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
        className="
          relative w-full bg-white
          rounded-t-2xl md:rounded-2xl
          p-5 md:p-7
          md:max-w-[440px]
          pb-[calc(env(safe-area-inset-bottom)+20px)] md:pb-7
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-sports-dark" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Chọn loại sân
          </h2>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-sports-light transition-colors"
            aria-label="Đóng"
          >
            <X size={18} className="text-sports-primary" />
          </button>
        </div>

        {/* Sport cards */}
        <div className="grid grid-cols-2 gap-3">
          {SPORTS.map(({ label, sub, href, Art }) => (
            <button
              key={href}
              onClick={() => pick(href)}
              className="group flex flex-col rounded-xl border-2 border-transparent hover:border-sports-primary overflow-hidden transition-all active:scale-[0.97]"
              style={{ background: '#f9f7f4' }}
            >
              <div className="w-full h-28 overflow-hidden">
                <Art className="w-full h-full" />
              </div>
              <div className="p-3 text-left">
                <p className="font-bold text-sm text-sports-dark leading-tight">{label}</p>
                <p className="text-xs text-[#6A6F66] mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={close}
          className="mt-4 w-full py-2.5 text-sm text-[#6A6F66] hover:text-sports-dark transition-colors"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
