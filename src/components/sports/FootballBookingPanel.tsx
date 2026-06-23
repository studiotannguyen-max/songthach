'use client';
import { useState } from 'react';
import BookingWidget from '@/components/sports/BookingWidget';
import { VenueType } from '@/types';

interface Court { id: string; name: string; type: VenueType; }

interface Props {
  courts5: Court[];
  courts7: Court[];
}

export default function FootballBookingPanel({ courts5, courts7 }: Props) {
  const [tab, setTab] = useState<'5' | '7'>('5');

  return (
    <div className="sticky top-24 space-y-4">
      <div className="flex gap-2">
        {([['5', 'Sân 5 người'], ['7', 'Sân 7 người']] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === value ? 'bg-sports-primary text-white' : 'bg-card border border-border text-foreground/70 hover:border-sports-primary'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === '5' ? (
        <BookingWidget key="5" courts={courts5} venueName="Sân Bóng đá 5 người" />
      ) : (
        <BookingWidget key="7" courts={courts7} venueName="Sân Bóng đá 7 người" />
      )}
    </div>
  );
}
