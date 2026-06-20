'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LIME = '#9CE25C';
const INK  = '#10150F';

export default function QuickBook() {
  const router = useRouter();
  const [sport, setSport] = useState<'badminton' | 'football'>('badminton');

  function handleFind() {
    router.push(sport === 'badminton' ? '/sports/badminton' : '/sports/football');
  }

  return (
    <div className="flex gap-2">
      <select
        aria-label="Chọn môn"
        value={sport}
        onChange={(e) => setSport(e.target.value as 'badminton' | 'football')}
        className="flex-1 text-sm rounded-lg px-3 py-2.5 border border-white/20 bg-white/[.06] text-white"
      >
        <option value="badminton">🏸 Cầu lông</option>
        <option value="football">⚽ Bóng đá</option>
      </select>
      <button
        onClick={handleFind}
        className="text-sm font-semibold rounded-lg px-4 py-2.5 whitespace-nowrap"
        style={{ background: LIME, color: INK }}
      >
        Tìm sân
      </button>
    </div>
  );
}
