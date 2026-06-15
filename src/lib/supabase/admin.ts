import { createClient } from '@supabase/supabase-js';

// Dùng service role key — chỉ dùng trong server-side routes, không bao giờ expose ra client
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
