import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserPointsBalance } from '@/lib/points';

const PITCH = '#0F3C2C';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile');

  const admin = createAdminClient();
  const [balance, { data: history }] = await Promise.all([
    getUserPointsBalance(admin, user.id),
    admin
      .from('point_transactions')
      .select('id, type, points, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Khách hàng';

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 pb-16 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold" style={{ color: PITCH }}>Xin chào, {displayName}</h1>
        <p className="text-sm text-muted-foreground mt-1">{user.email}</p>

        <div className="mt-6 rounded-2xl border p-6" style={{ borderColor: '#E6E2D6', background: '#F4EEE1' }}>
          <p className="text-sm text-muted-foreground">Điểm tích lũy hiện có</p>
          <p className="text-3xl font-bold mt-1" style={{ color: PITCH }}>{balance} điểm</p>
          <p className="text-xs text-muted-foreground mt-1">Tương đương {(balance * 1000).toLocaleString('vi-VN')}đ — dùng để giảm giá khi đặt sân.</p>
        </div>

        <h2 className="text-lg font-bold mt-8 mb-3" style={{ color: PITCH }}>Lịch sử điểm</h2>
        {!history || history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có giao dịch điểm nào.</p>
        ) : (
          <div className="space-y-2">
            {history.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-border py-2.5">
                <div>
                  <p className="text-foreground">{t.note}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(t.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                </div>
                <span className={t.points > 0 ? 'font-bold text-green-600' : 'font-bold text-red-500'}>
                  {t.points > 0 ? '+' : ''}{t.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
