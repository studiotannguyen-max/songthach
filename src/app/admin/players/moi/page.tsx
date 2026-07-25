'use client';
import { useRouter } from 'next/navigation';
import PlayerForm from '../PlayerForm';

export default function NewPlayerPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Thêm vận động viên</h1>
      <PlayerForm onSaved={() => router.push('/admin/players')} />
    </div>
  );
}
