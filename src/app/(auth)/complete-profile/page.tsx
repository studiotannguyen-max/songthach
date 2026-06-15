'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, ArrowRight, SkipForward, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CompleteProfilePage() {
  const router  = useRouter();
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const supabase = createClient();

  async function save(skip = false) {
    setSaving(true);
    setError('');
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: skip ? '' : name.trim(),
        phone:     skip ? '' : phone.trim(),
        onboarded: true,
      },
    });
    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.replace('/');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

        <div className="w-12 h-12 gradient-sports rounded-2xl flex items-center justify-center mb-6">
          <User size={22} className="text-white" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Hoàn tất thông tin</h1>
        <p className="text-sm text-gray-500 mb-7">
          Tên và số điện thoại giúp chúng tôi liên hệ khi cần. Bạn có thể bỏ qua.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Họ và tên <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số điện thoại <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            onClick={() => save(false)}
            disabled={saving}
            className="w-full sports-btn py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            Lưu và vào trang
          </button>

          <button
            onClick={() => save(true)}
            disabled={saving}
            className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <SkipForward size={15} /> Bỏ qua, điền sau
          </button>
        </div>
      </div>
    </div>
  );
}
