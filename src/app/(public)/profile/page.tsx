import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserPointsBalance } from '@/lib/points';

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
    <section className="section">
      <div className="container-page max-w-2xl">
        <h1 className="text-3xl normal-case">Xin chào, {displayName}</h1>
        <p className="text-fg-muted mt-1">{user.email}</p>

        <div className="mt-8 rounded border border-line bg-bg-subtle p-6">
          <p className="text-sm text-fg-muted">Điểm tích lũy hiện có</p>
          <p className="font-display text-4xl text-fg mt-1">{balance} điểm</p>
          <p className="text-sm text-fg-muted mt-1">
            Tương đương {(balance * 1000).toLocaleString('vi-VN')}đ — dùng để giảm giá khi đặt sân.
          </p>
        </div>

        <h2 className="text-xl mt-10 mb-4">Lịch sử điểm</h2>
        {!history || history.length === 0 ? (
          <p className="text-fg-muted">Chưa có giao dịch điểm nào.</p>
        ) : (
          <ul className="rounded border border-line divide-y divide-line">
            {history.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-fg">{t.note}</p>
                  <p className="text-sm text-fg-muted">
                    {format(new Date(t.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </p>
                </div>
                <span className={t.points > 0 ? 'font-semibold text-brand-strong' : 'font-semibold text-danger'}>
                  {t.points > 0 ? '+' : ''}{t.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
