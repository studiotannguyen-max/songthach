import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/wedding — Lấy danh sách yêu cầu tiệc cưới
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const admin = createAdminClient();
  let query = admin
    .from('wedding_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ inquiries: data ?? [] });
}

// PATCH /api/admin/wedding/[id] — Cập nhật trạng thái
export async function PATCH(req: NextRequest) {
  const { id, status, note } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'Thiếu id hoặc status' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('wedding_inquiries')
    .update({ status, ...(note !== undefined ? { admin_note: note } : {}) })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
