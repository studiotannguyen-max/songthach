'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, SkipForward, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Field, inputClass, Button } from '@/components/ui';

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
    <div className="min-h-screen flex items-center justify-center bg-bg-subtle px-4 py-12">
      <div className="w-full max-w-[480px] rounded border border-line bg-bg p-6 sm:p-8">
        <h1 className="text-2xl mb-2">Hoàn tất thông tin</h1>
        <p className="text-fg-muted mb-8">
          Tên và số điện thoại giúp chúng tôi liên hệ khi cần. Bạn có thể bỏ qua.
        </p>

        <Field label="Họ và tên" htmlFor="name" hint="Không bắt buộc">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            aria-describedby="name-hint"
            className={inputClass}
          />
        </Field>

        <Field label="Số điện thoại" htmlFor="phone" hint="Không bắt buộc" error={error}>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901 234 567"
            aria-describedby={error ? 'phone-error' : 'phone-hint'}
            className={inputClass}
          />
        </Field>

        <Button onClick={() => save(false)} disabled={saving} className="w-full">
          {saving
            ? <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            : <ArrowRight size={18} aria-hidden="true" />}
          Lưu và vào trang
        </Button>

        <button
          onClick={() => save(true)}
          disabled={saving}
          className="w-full min-h-[44px] mt-3 text-sm text-fg-muted hover:text-fg flex items-center justify-center gap-1.5 transition-colors"
        >
          <SkipForward size={15} aria-hidden="true" /> Bỏ qua, điền sau
        </button>
      </div>
    </div>
  );
}
