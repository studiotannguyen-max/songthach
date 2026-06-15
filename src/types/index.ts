export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  role: UserRole;
  created_at: string;
}

export type VenueType = 'football_5' | 'football_7' | 'badminton';

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  description?: string;
  is_active: boolean;
}

export type DayType = 'weekday' | 'weekend';

export interface PricingRule {
  id: string;
  venue_id: string;
  label: string;        // "Giờ vàng", "Giờ thường"
  day_type: DayType;
  start_time: string;   // "07:00"
  end_time: string;     // "17:00"
  price: number;
}

export type BookingStatus = 'pending' | 'deposit_paid' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  venue_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  deposit_amount: number;
  deposit_rate: number;
  status: BookingStatus;
  cancel_reason?: string;
  cancelled_at?: string;
  created_at: string;
  venue?: Venue;
  user?: User;
}

export type PaymentMethod = 'vnpay' | 'momo' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  method: PaymentMethod;
  transaction_ref?: string;
  status: PaymentStatus;
  paid_at?: string;
  created_at: string;
}

export type WeddingInquiryStatus = 'new' | 'contacted' | 'quoted' | 'booked' | 'rejected';

export interface WeddingInquiry {
  id: string;
  contact_name: string;
  phone: string;
  email?: string;
  event_date?: string;
  guest_count?: number;
  table_count?: number;
  hall_preference?: string;
  special_requests?: string;
  status: WeddingInquiryStatus;
  admin_notes?: string;
  created_at: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  price: number;
  label: string;
  available: boolean;
}
