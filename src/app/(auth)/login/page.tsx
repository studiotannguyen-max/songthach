'use client';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
  const [step, setStep]     = useState<Step>('input');
  const [error, setError]   = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setStep('sending');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setStep('input');
    } else {
      setStep('sent');
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-sports items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">ST</span>
          </div>
          <h2 className="sports-hero-text text-4xl font-bold text-white mb-4">SONG THẠCH</h2>
          <p className="text-white/70 leading-relaxed max-w-xs">
            {isRegister
              ? 'Đăng ký tài khoản miễn phí — tích điểm mỗi lần đặt sân, dùng điểm giảm giá ngay.'
              : 'Đăng nhập để đặt sân nhanh chóng, theo dõi lịch đặt và nhận ưu đãi độc quyền.'}
          </p>
          <div className="mt-10 space-y-3 text-left">
            {(isRegister
              ? ['Tích điểm mỗi lần đặt sân (10.000đ = 1 điểm)', 'Dùng điểm giảm giá lần đặt sau', 'Theo dõi điểm & lịch sử tại trang cá nhân']
              : ['Đặt sân online 24/7', 'Nhận xác nhận qua email', 'Quản lý lịch đặt dễ dàng']
            ).map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/80 text-sm">
                <CheckCircle2 size={16} className="text-sports-accent shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-sports-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">ST</div>
            <span className="font-bold text-gray-900">Song Thạch</span>
          </Link>

          {step !== 'sent' ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Nhập email — chúng tôi gửi link {isRegister ? 'đăng ký' : 'đăng nhập'} về hộp thư của bạn.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@example.com"
                      required
                      disabled={step === 'sending'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all text-sm disabled:opacity-50"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={step === 'sending' || !email.trim()}
                  className="w-full sports-btn py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 'sending' ? (
                    <><Loader2 size={18} className="animate-spin" /> Đang gửi...</>
                  ) : (
                    <>Gửi link {isRegister ? 'đăng ký' : 'đăng nhập'} <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Không cần mật khẩu · Link có hiệu lực 60 phút
              </p>
            </>
          ) : (
            /* Sent state */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail size={28} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Kiểm tra hộp thư</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-1">
                Chúng tôi đã gửi link đăng nhập đến
              </p>
              <p className="font-semibold text-gray-900 text-sm mb-6">{email}</p>
              <p className="text-xs text-gray-400 mb-8">
                Nhấn vào link trong email để hoàn tất đăng nhập. Link có hiệu lực 60 phút.
              </p>
              <button
                onClick={() => { setStep('input'); setEmail(''); }}
                className="text-sm text-sports-primary font-semibold hover:underline"
              >
                Dùng email khác
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Không thấy email? Kiểm tra mục Spam hoặc Promotions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
