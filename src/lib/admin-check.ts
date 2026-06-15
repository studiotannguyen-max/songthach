import type { User } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

// Module edge-safe (không import next/headers) — dùng được trong cả middleware lẫn API route.

// Danh sách email admin bootstrap qua env (phân cách bằng dấu phẩy)
// Ưu tiên check role='admin' trong bảng users; env chỉ là phương án dự phòng ban đầu.
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Kiểm tra user có quyền admin không. */
export async function isAdminUser(user: User): Promise<boolean> {
  const email = user.email?.toLowerCase();
  if (email && getAdminEmails().includes(email)) return true;

  const admin = createAdminClient();

  // Khớp theo auth user id
  const { data: byId } = await admin
    .from('users')
    .select('id')
    .eq('id', user.id)
    .eq('role', 'admin')
    .limit(1);
  if (byId && byId.length > 0) return true;

  // Khớp theo email (trường hợp bảng users tạo thủ công, id không trùng auth.uid)
  if (email) {
    const { data: byEmail } = await admin
      .from('users')
      .select('id')
      .eq('email', email)
      .eq('role', 'admin')
      .limit(1);
    if (byEmail && byEmail.length > 0) return true;
  }

  return false;
}
