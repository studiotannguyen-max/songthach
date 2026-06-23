import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendRegistrationWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');

  // Chống open redirect: chỉ cho phép đường dẫn nội bộ ('/abc'), chặn '//evil.com' và URL tuyệt đối
  const rawNext = searchParams.get('next') ?? '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('\\')
    ? rawNext
    : '/';

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const meta = data.user.user_metadata ?? {};
      const hasProfile = meta.full_name || meta.onboarded;

      // email_confirmed_at chỉ được set đúng 1 lần, tại thời điểm xác nhận đầu tiên —
      // dùng để nhận biết đây là lượt xác nhận tài khoản mới, không phải đăng nhập lại
      const confirmedAt = data.user.email_confirmed_at ? new Date(data.user.email_confirmed_at).getTime() : 0;
      const isFirstConfirmation = Date.now() - confirmedAt < 60_000;
      if (isFirstConfirmation) {
        sendRegistrationWelcomeEmail(data.user.email!, meta.full_name || null)
          .catch((err) => console.error('[Auth callback] Welcome email thất bại:', err));
      }

      // Lần đầu đăng nhập → điền thông tin
      if (!hasProfile) {
        return NextResponse.redirect(`${origin}/complete-profile`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
