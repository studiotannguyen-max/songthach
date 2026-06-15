import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/voucher-campaigns — danh sách chương trình
export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('voucher_campaigns')
    .select('id, name, trigger_type, reward_type, reward_value, reward_note, valid_days, is_active, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
}
