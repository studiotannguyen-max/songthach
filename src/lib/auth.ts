import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin-check';

export { isAdminUser };

/**
 * Bắt buộc đăng nhập + quyền admin cho API route.
 * Cách dùng:
 *   const { user, response } = await requireAdmin();
 *   if (response) return response;
 */
export async function requireAdmin(): Promise<{ user: User | null; response: NextResponse | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 }) };
  }
  if (!(await isAdminUser(user))) {
    return { user: null, response: NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 }) };
  }
  return { user, response: null };
}
