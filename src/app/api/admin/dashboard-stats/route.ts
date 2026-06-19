import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';

const TOTAL_COURTS = 7; // 3 cầu lông + 3 bóng đá 5 + 1 bóng đá 7, xem src/app/admin/venues/page.tsx

export async function GET() {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const supabase = createAdminClient();
  const now           = new Date();
  const today          = now.toISOString().slice(0, 10);
  const nowTime        = now.toTimeString().slice(0, 5);
  const monthStart     = `${today.slice(0, 7)}-01`;
  const thirtyDaysAgo  = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    bookingsTodayRes,
    monthBookingsRes,
    newCustomersRes,
    todayConfirmedRes,
    recentBookingsRes,
    weddingLeadsRes,
  ] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('booking_date', today).neq('status', 'cancelled'),
    supabase.from('bookings').select('total_price')
      .gte('booking_date', monthStart).lte('booking_date', today)
      .in('status', ['confirmed', 'completed']),
    supabase.from('users').select('id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo),
    supabase.from('bookings').select('start_time, end_time')
      .eq('booking_date', today).eq('status', 'confirmed'),
    supabase.from('bookings')
      .select('id, user_name, user_email, court_name, venue_type, booking_date, start_time, end_time, status')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('wedding_inquiries')
      .select('id, contact_name, phone, event_date, table_count, status')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false }).limit(3),
  ]);

  const revenueThisMonth = (monthBookingsRes.data ?? []).reduce(
    (sum, b) => sum + (b.total_price ?? 0), 0,
  );
  const courtsInUse = (todayConfirmedRes.data ?? []).filter(
    (b) => b.start_time <= nowTime && nowTime < b.end_time,
  ).length;

  return NextResponse.json({
    bookingsToday:    bookingsTodayRes.count ?? 0,
    revenueThisMonth,
    newCustomers30d:  newCustomersRes.count ?? 0,
    courtsInUse,
    totalCourts:      TOTAL_COURTS,
    recentBookings:   recentBookingsRes.data ?? [],
    weddingLeads:     weddingLeadsRes.data ?? [],
  });
}
