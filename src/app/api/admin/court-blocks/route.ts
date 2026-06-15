import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/court-blocks?court_id=xxx — Danh sách khoá sân (sắp tới / hiện tại)
export async function GET(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const court_id = searchParams.get('court_id');

  const supabase = createAdminClient();
  let query = supabase
    .from('court_blocks')
    .select('id, court_id, court_name, venue_type, block_date, start_time, end_time, reason, created_at')
    .gte('block_date', new Date().toISOString().slice(0, 10))
    .order('block_date', { ascending: true });

  if (court_id) query = query.eq('court_id', court_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ blocks: data });
}

// POST /api/admin/court-blocks — Khoá sân (nguyên ngày hoặc theo khung giờ)
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { court_id, court_name, venue_type, block_date, start_time, end_time, reason } = body;

  if (!court_id || !block_date) {
    return NextResponse.json({ error: 'Vui lòng chọn sân và ngày khoá' }, { status: 400 });
  }
  if ((start_time && !end_time) || (!start_time && end_time)) {
    return NextResponse.json({ error: 'Vui lòng nhập đủ giờ bắt đầu và kết thúc, hoặc để trống cả hai để khoá nguyên ngày' }, { status: 400 });
  }
  if (start_time && end_time && start_time >= end_time) {
    return NextResponse.json({ error: 'Giờ kết thúc phải sau giờ bắt đầu' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('court_blocks')
    .insert({
      court_id,
      court_name: court_name ?? null,
      venue_type: venue_type ?? null,
      block_date,
      start_time: start_time || null,
      end_time:   end_time || null,
      reason:     reason?.trim() || null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
