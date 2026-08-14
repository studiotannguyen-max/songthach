'use client';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Field, inputClass, Button } from '@/components/ui';

type Step = 'input' | 'sending' | 'sent';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const isRegister   = searchParams.get('mode') === 'register';

  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [step, setStep]     = useState<Step>('input');
  const [error, setError]   = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (isRegister && !phone.trim()) { setError('Vui lòng nhập số điện thoại'); return; }
    setError('');
    setStep('sending');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        ...(isRegister && {
          data: { full_name: name.trim(), phone: phone.trim(), onboarded: true },
        }),
      },
    });

    if (error) {
      setError(error.message);
      setStep('input');
    } else {
      setStep('sent');
    }
  }

  const BENEFITS = isRegister
    ? ['Tích điểm mỗi lần đặt sân (10.000đ = 1 điểm)', 'Dùng điểm giảm giá lần đặt sau', 'Theo dõi điểm & lịch sử tại trang cá nhân']
    : ['Đặt sân online 24/7', 'Nhận xác nhận qua email', 'Quản lý lịch đặt dễ dàng'];

  return (
    <div className="min-h-screen flex">
      {/* Cột giới thiệu — chỉ hiện trên máy tính */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink items-center justify-center p-12">
        <div className="max-w-sm">
          <h2 className="text-4xl text-white mb-4">Song Thạch</h2>
          <p className="text-white/75">
            {isRegister
              ? 'Đăng ký tài khoản miễn phí — tích điểm mỗi lần đặt sân, dùng điểm giảm giá ngay.'
              : 'Đăng nhập để đặt sân nhanh chóng, theo dõi lịch đặt và nhận ưu đãi độc quyền.'}
          </p>
          <div className="mt-10 space-y-3">
            {BENEFITS.map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/80 text-sm">
                <CheckCircle2 size={16} className="text-brand shrink-0" aria-hidden="true" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cột form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-bg">
        <div className="w-full max-w-[480px]">

          <Link href="/" className="inline-block mb-8 lg:hidden font-display uppercase tracking-[0.06em] text-fg">
            Song Thạch
          </Link>

          {step !== 'sent' ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl">{isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h1>
                <p className="text-fg-muted mt-2">
                  Nhập email — chúng tôi gửi link {isRegister ? 'đăng ký' : 'đăng nhập'} về hộp thư của bạn.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {isRegister && (
                  <>
                    <Field label="Họ và tên" htmlFor="name" hint="Không bắt buộc">
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        disabled={step === 'sending'}
                        aria-describedby="name-hint"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Số điện thoại" htmlFor="phone" required>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0901 234 567"
                        required
                        disabled={step === 'sending'}
                        className={inputClass}
                      />
                    </Field>
                  </>
                )}

                <Field label="Địa chỉ email" htmlFor="email" required error={error}>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    required
                    disabled={step === 'sending'}
                    aria-describedby={error ? 'email-error' : undefined}
                    className={inputClass}
                  />
                </Field>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={step === 'sending' || !email.trim() || (isRegister && !phone.trim())}
                >
                  {step === 'sending' ? (
                    <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Đang gửi...</>
                  ) : (
                    <>Gửi link {isRegister ? 'đăng ký' : 'đăng nhập'} <ArrowRight size={18} aria-hidden="true" /></>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-fg-muted mt-6">
                Không cần mật khẩu · Link có hiệu lực 60 phút
              </p>
            </>
          ) : (
            /* Đã gửi email */
            <div className="text-center">
              <div className="w-16 h-16 rounded border border-line bg-bg-subtle grid place-items-center mx-auto mb-5">
                <Mail size={28} className="text-brand-strong" aria-hidden="true" />
              </div>
              <h1 className="text-2xl mb-2">Kiểm tra hộp thư</h1>
              <p className="text-fg-muted">Chúng tôi đã gửi link đăng nhập đến</p>
              <p className="font-semibold text-fg mb-6">{email}</p>
              <p className="text-sm text-fg-muted mb-8">
                Nhấn vào link trong email để hoàn tất đăng nhập. Link có hiệu lực 60 phút.
              </p>
              <button
                onClick={() => { setStep('input'); setEmail(''); }}
                className="min-h-[44px] px-4 text-sm text-brand-strong font-semibold hover:underline"
              >
                Dùng email khác
              </button>
              <p className="text-sm text-fg-muted mt-4">
                Không thấy email? Kiểm tra mục Spam hoặc Promotions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
