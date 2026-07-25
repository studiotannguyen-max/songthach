'use client';
import type { PlayerRecord } from './PlayerForm';

interface Ev { id: string; points: number; reason: string; note: string | null; created_at: string; }

// PLACEHOLDER — Task 9 thay bằng bảng cộng/trừ điểm có xem trước.
export default function AdjustPointsPanel({ player, events, onDone }: { player: PlayerRecord; events: Ev[]; onDone: () => void }) {
  return null;
}
