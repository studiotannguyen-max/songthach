import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

const UpdateSchema = z.object({
  is_active:   z.boolean().optional(),
  reward_note: z.string().min(1).max(200).optional(),
  valid_days:  z.number().int().min(1).max(90).optional(),
});

// PATCH /api/admin/voucher-campaigns/:id — bật/tắt, sửa quà & hạn dùng
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = UpdateSchema.safeParse(await req.json());
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('voucher_campaigns')
    .update(parsed.data)
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
