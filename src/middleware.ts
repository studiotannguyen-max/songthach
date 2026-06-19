import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser } from '@/lib/admin-check';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session nếu hết hạn
  const { data: { user } } = await supabase.auth.getUser();

  // ===== Bảo vệ khu vực admin (trang + API) =====
  const path         = request.nextUrl.pathname;
  const isAdminLogin = path === '/admin/login';
  const isAdminPage  = (path === '/admin' || path.startsWith('/admin/')) && !isAdminLogin;
  const isAdminApi   = path.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    if (!user) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }

    const isAdmin = await isAdminUser(user);
    if (!isAdmin) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
