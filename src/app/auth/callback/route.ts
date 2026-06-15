import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

      // Lần đầu đăng nhập → điền thông tin
      if (!hasProfile) {
        return NextResponse.redirect(`${origin}/complete-profile`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
