'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError('Email hoặc mật khẩu không đúng.');
      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm bg-white border-2 border-[#0F3C2C] p-8" style={{ boxShadow: '6px 6px 0 #9CE25C' }}>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-sports-primary flex items-center justify-center text-white font-bold border border-[#3F8F33]" style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem' }}>ST</div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Song Thạch</p>
            <p className="text-gray-400 text-xs">Admin Dashboard</p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Đăng nhập quản trị</h1>
        <p className="text-gray-500 text-sm mb-6">Dành cho quản trị viên.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all text-sm disabled:opacity-50"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full sports-btn py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Đang đăng nhập...</>
            ) : (
              <>Đăng nhập <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <Link href="/" className="block text-center text-xs text-gray-400 mt-6 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
}
