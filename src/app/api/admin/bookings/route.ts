import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/bookings?status=pending&date=2026-06-10&venue_type=badminton
export async function GET(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status      = searchParams.get('status');
  const date        = searchParams.get('date');
  const venue_type  = searchParams.get('venue_type');

  const supabase = createAdminClient();
  let query = supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: true })
    .order('start_time',   { ascending: true });

  if (status)     query = query.eq('status',     status);
  if (date)       query = query.eq('booking_date', date);
  if (venue_type) query = query.eq('venue_type', venue_type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data });
}
