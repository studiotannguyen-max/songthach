'use client';
import { useEffect, useState } from 'react';
import { Search, RefreshCw, User, Mail, Phone, Calendar, Award } from 'lucide-react';

interface Customer {
  phone: string;
  name: string | null;
  email: string;
  userId: string | null;
  bookingCount: number;
  pointsBalance: number | null;
}

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => setCustomers(d.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.phone.includes(q) || c.name?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Gộp theo số điện thoại từ lịch sử đặt sân</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500">
          <Calendar size={14} /> {customers.length} khách
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên, SĐT, email..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
        />
      </div>

      <div className="admin-card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw size={18} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">Chưa có khách hàng nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">Khách hàng</th>
                <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">Liên hệ</th>
                <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">Tài khoản</th>
                <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-medium">Điểm tích lũy</th>
                <th className="text-right py-2.5 px-3 text-xs text-gray-500 font-medium">Số lần đặt sân</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.phone} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                      <User size={13} className="text-gray-400" /> {c.name || '(Chưa rõ tên)'}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-gray-700 flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {c.phone}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><Mail size={11} /> {c.email}</p>
                  </td>
                  <td className="py-3 px-3">
                    {c.userId ? (
                      <span className="status-badge status-completed">Có tài khoản</span>
                    ) : (
                      <span className="status-badge status-pending">Khách vãng lai</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {c.pointsBalance !== null ? (
                      <span className="flex items-center gap-1.5 font-semibold text-amber-700">
                        <Award size={13} /> {c.pointsBalance} điểm
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sports-primary">{c.bookingCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
