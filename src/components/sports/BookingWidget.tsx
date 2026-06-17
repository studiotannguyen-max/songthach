'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Info, Banknote, MapPin, CheckCircle2, Loader2, ArrowLeft, QrCode, User, Phone, Mail } from 'lucide-react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn, formatCurrency, isWeekend } from '@/lib/utils';
import { getPriceRules } from '@/lib/pricing';
import { VenueType } from '@/types';

interface Court {
  id: string;
  name: string;
  type: VenueType;
}

interface Props {
  courts: Court[];
  venueName: string;
}

type PaymentMethod = 'bank_transfer' | 'pay_at_venue';
type Step = 'form' | 'confirm' | 'success';

function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const total  = h * 60 + m + Math.round(hours * 60);
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

// Sân bóng đá: theo giờ. Sân cầu lông: theo 30 phút (đặt được 30', 1h, 1h30'...)
const FOOTBALL_SLOTS = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
const BADMINTON_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
}); // 06:00 ~ 21:30

function formatDuration(h: number): string {
  if (h === 0.5) return '30 phút';
  const whole = Math.floor(h);
  const hasHalf = h % 1 !== 0;
  return hasHalf ? `${whole}g 30'` : `${whole} giờ`;
}

export default function BookingWidget({ courts, venueName }: Props) {
  const today = new Date();

  const [step,          setStep]         = useState<Step>('form');
  const [weekStart,     setWeekStart]    = useState(today);
  const [selectedDate,  setSelectedDate] = useState(today);
  const [selectedCourt, setSelectedCourt]= useState<Court>(courts[0]);
  const [selectedSlot,  setSelectedSlot] = useState<string | null>(null);
  const [duration,      setDuration]     = useState(1);

  const isBadminton = selectedCourt.type === 'badminton';
  const slots       = isBadminton ? BADMINTON_SLOTS : FOOTBALL_SLOTS;
  const durations   = isBadminton ? [0.5, 1, 1.5, 2, 2.5, 3] : [1, 1.5, 2, 2.5, 3];
  const [paymentMethod, setPaymentMethod]= useState<PaymentMethod | null>(null);
  const [guestName,     setGuestName]    = useState('');
  const [guestPhone,    setGuestPhone]   = useState('');
  const [guestEmail,    setGuestEmail]   = useState('');
  const [submitting,    setSubmitting]   = useState(false);
  const [error,         setError]        = useState('');
  const [bookingId,     setBookingId]    = useState('');
  const [bookedSlots,   setBookedSlots]  = useState<string[]>([]);
  const [blockedSlots,  setBlockedSlots] = useState<string[]>([]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    if (!selectedDate || !selectedCourt) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    fetch(`/api/bookings?court_id=${selectedCourt.id}&date=${dateStr}`)
      .then(r => r.json())
      .then(d => {
        setBookedSlots((d.booked_slots ?? []) as string[]);
        setBlockedSlots((d.blocked_slots ?? []) as string[]);
      })
      .catch(() => { setBookedSlots([]); setBlockedSlots([]); });
  }, [selectedDate, selectedCourt]);

  const priceInfo  = selectedSlot ? getPriceRules(selectedSlot, selectedCourt.type) : null;
  const totalPrice = priceInfo ? priceInfo.price * duration : 0;
  const endTime    = selectedSlot ? addHoursToTime(selectedSlot, duration) : '';

  function isBooked(slot: string)  { return bookedSlots.includes(slot); }
  function isBlocked(slot: string) { return blockedSlots.includes(slot); }

  function validateConfirm() {
    if (!guestPhone.trim()) return 'Vui lòng nhập số điện thoại';
    if (!guestEmail.trim()) return 'Vui lòng nhập email để nhận xác nhận';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) return 'Email không hợp lệ';
    if (!paymentMethod) return 'Vui lòng chọn phương thức thanh toán';
    return '';
  }

  async function handleSubmit() {
    const validationError = validateConfirm();
    if (validationError) { setError(validationError); return; }
    if (!selectedSlot) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          court_id:       selectedCourt.id,
          court_name:     selectedCourt.name,
          venue_type:     selectedCourt.type,
          booking_date:   format(selectedDate, 'yyyy-MM-dd'),
          start_time:     selectedSlot,
          end_time:       endTime,
          duration,
          total_price:    totalPrice,
          payment_method: paymentMethod,
          user_name:      guestName.trim() || null,
          user_phone:     guestPhone.trim(),
          user_email:     guestEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Lỗi không xác định');
      setBookingId(data.booking_id);
      setStep('success');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setStep('form');
    setSelectedSlot(null);
    setDuration(1);
    setPaymentMethod(null);
    setBookingId('');
    setError('');
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
  }

  /* ── SUCCESS ─────────────────────────────────── */
  if (step === 'success') {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="gradient-sports px-6 py-5">
          <h2 className="sports-hero-text text-xl font-bold text-white">Đặt sân thành công!</h2>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Mã đặt sân</p>
          <p className="font-mono font-bold text-xl text-gray-900 mb-1">{bookingId}</p>
          <p className="text-xs text-gray-500 mb-5">Xác nhận đã gửi đến <strong>{guestEmail}</strong></p>

          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 mb-5">
            {[
              { label: 'Sân',    value: `${selectedCourt.name} · ${venueName}` },
              { label: 'Ngày',   value: format(selectedDate, 'dd/MM/yyyy', { locale: vi }) },
              { label: 'Giờ',    value: `${selectedSlot} – ${endTime} (${duration}h)` },
              { label: 'Tên',    value: guestName || '(Không điền)' },
              { label: 'SĐT',    value: guestPhone },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{r.label}</span>
                <span className="font-semibold text-gray-900 text-right">{r.value}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-sports-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {paymentMethod === 'bank_transfer' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left mb-5">
              <p className="text-sm font-semibold text-blue-800 mb-1">Chuyển khoản để giữ sân</p>
              <p className="text-xs text-blue-700 leading-relaxed mb-3">
                Vui lòng chuyển <strong>{formatCurrency(totalPrice)}</strong> — sân được giữ trong <strong>2 giờ</strong>.
              </p>
              <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                <div className="w-28 h-28 bg-gray-100 rounded-xl mx-auto flex items-center justify-center mb-2">
                  <QrCode size={48} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Thông tin QR & tài khoản sẽ được cập nhật sớm</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-left mb-5">
              <p className="text-sm font-semibold text-green-800 mb-1">Thanh toán tại sân</p>
              <p className="text-xs text-green-700 leading-relaxed">
                Đến sân trước <strong>10 phút</strong>, xuất trình mã <strong>{bookingId}</strong> để check-in.
              </p>
            </div>
          )}

          <div className="bg-sports-light border border-sports-primary/20 rounded-2xl p-4 text-left mb-5">
            <p className="text-sm font-semibold text-sports-dark mb-1">🎁 Quà tặng kèm</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sau khi xác nhận đặt cọc, bạn được tặng <strong>1 ly nước miễn phí</strong> tại Café Lavie
              (hạn 7 ngày). Khi đến quầy chỉ cần đọc <strong>số điện thoại đặt sân</strong> để nhận.
            </p>
          </div>

          <button onClick={resetForm} className="w-full sports-btn py-3.5 text-base">
            Đặt sân khác
          </button>
        </div>
      </div>
    );
  }

  /* ── CONFIRM ─────────────────────────────────── */
  if (step === 'confirm') {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="gradient-sports px-6 py-5">
          <h2 className="sports-hero-text text-xl font-bold text-white">Xác nhận đặt sân</h2>
          <p className="text-white/70 text-sm mt-0.5">Điền thông tin để nhận xác nhận</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Booking summary */}
          <div className="bg-sports-light rounded-2xl p-4 space-y-2">
            {[
              { label: 'Sân',  value: `${selectedCourt.name} · ${venueName}` },
              { label: 'Ngày', value: format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi }) },
              { label: 'Giờ',  value: `${selectedSlot} – ${endTime} (${duration}h)` },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{r.label}</span>
                <span className="font-semibold text-gray-900 text-right">{r.value}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base border-t border-sports-primary/20 pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-sports-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Thông tin liên hệ
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="Số điện thoại *"
                  required
                  className="w-full pl-9 pr-4 py-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all"
                />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  inputMode="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="Email nhận xác nhận *"
                  required
                  className="w-full pl-9 pr-4 py-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all"
                />
              </div>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Họ và tên (tuỳ chọn)"
                  className="w-full pl-9 pr-4 py-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Phương thức thanh toán
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('bank_transfer')}
                className={cn(
                  'border-2 rounded-2xl p-4 text-left transition-all active:scale-[0.97]',
                  paymentMethod === 'bank_transfer'
                    ? 'border-sports-primary bg-sports-light'
                    : 'border-gray-200 hover:border-sports-primary/40',
                )}
              >
                <Banknote size={20} className={cn('mb-2', paymentMethod === 'bank_transfer' ? 'text-sports-primary' : 'text-gray-400')} />
                <p className="text-sm font-semibold text-gray-900">Chuyển khoản</p>
                <p className="text-xs text-gray-500 mt-0.5">QR / số tài khoản</p>
              </button>
              <button
                onClick={() => setPaymentMethod('pay_at_venue')}
                className={cn(
                  'border-2 rounded-2xl p-4 text-left transition-all active:scale-[0.97]',
                  paymentMethod === 'pay_at_venue'
                    ? 'border-sports-primary bg-sports-light'
                    : 'border-gray-200 hover:border-sports-primary/40',
                )}
              >
                <MapPin size={20} className={cn('mb-2', paymentMethod === 'pay_at_venue' ? 'text-sports-primary' : 'text-gray-400')} />
                <p className="text-sm font-semibold text-gray-900">Tại sân</p>
                <p className="text-xs text-gray-500 mt-0.5">Trả tiền khi đến</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center gap-2">
              <Info size={15} className="shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Action buttons — sticky bottom on mobile */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex gap-3">
          <button
            onClick={() => { setStep('form'); setPaymentMethod(null); setError(''); }}
            className="flex items-center gap-1.5 px-4 py-4 border border-gray-200 rounded-2xl text-sm text-gray-600 hover:bg-gray-50 active:scale-[0.97] transition-all"
          >
            <ArrowLeft size={15} /> Quay lại
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={cn(
              'flex-1 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2',
              !submitting
                ? 'gradient-sports text-white hover:opacity-90 active:scale-[0.98] sports-hero-text'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            )}
          >
            {submitting
              ? <><Loader2 size={18} className="animate-spin" /> Đang xử lý...</>
              : 'XÁC NHẬN ĐẶT SÂN'
            }
          </button>
        </div>
      </div>
    );
  }

  /* ── FORM ─────────────────────────────────────── */
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="gradient-sports px-6 py-5">
        <h2 className="sports-hero-text text-xl font-bold text-white">Đặt {venueName}</h2>
        <p className="text-white/70 text-sm mt-0.5">Chọn sân · Chọn ngày · Chọn giờ</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Bước 1: Sân */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Bước 1 — Chọn sân
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {courts.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCourt(c); setSelectedSlot(null); setDuration(1); }}
                className={cn(
                  'py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all',
                  selectedCourt.id === c.id
                    ? 'border-sports-primary bg-sports-primary text-white'
                    : 'border-gray-200 text-gray-700 hover:border-sports-primary/50',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bước 2: Ngày */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bước 2 — Chọn ngày</label>
            <div className="flex gap-1">
              <button onClick={() => setWeekStart(d => addDays(d, -7))} className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setWeekStart(d => addDays(d, 7))} className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const past = day < new Date(new Date().setHours(0,0,0,0));
              return (
                <button
                  key={day.toISOString()}
                  disabled={past}
                  onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                  className={cn(
                    'flex flex-col items-center py-2.5 rounded-xl transition-all text-xs',
                    past && 'opacity-30 cursor-not-allowed',
                    isSameDay(day, selectedDate)
                      ? 'bg-sports-primary text-white'
                      : isWeekend(day)
                        ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        : 'hover:bg-gray-50',
                  )}
                >
                  <span className="font-medium">{format(day, 'EEE', { locale: vi }).slice(0,2)}</span>
                  <span className="font-bold text-sm mt-0.5">{format(day, 'd')}</span>
                  {isToday(day) && <span className="w-1 h-1 rounded-full bg-sports-accent mt-1" />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
            {isWeekend(selectedDate) && <span className="ml-2 text-orange-500 font-medium">· Cuối tuần</span>}
          </p>
        </div>

        {/* Bước 3: Giờ */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Bước 3 — Chọn khung giờ
          </label>
          <div className={cn('gap-2 grid', isBadminton ? 'grid-cols-4 sm:grid-cols-8' : 'grid-cols-4')}>
            {slots.map((slot) => {
              const booked  = isBooked(slot);
              const blocked = isBlocked(slot);
              const taken   = booked || blocked;
              const isPeak  = getPriceRules(slot, selectedCourt.type).label.includes('Giờ vàng');
              return (
                <button
                  key={slot}
                  disabled={taken}
                  onClick={() => setSelectedSlot(slot === selectedSlot ? null : slot)}
                  className={cn(
                    'time-slot flex flex-col items-center',
                    blocked
                      ? 'time-slot-booked opacity-60'
                      : booked
                        ? 'time-slot-booked'
                        : selectedSlot === slot
                          ? 'time-slot-selected'
                          : 'time-slot-available',
                  )}
                >
                  <span>{slot}</span>
                  {blocked ? (
                    <span className="text-[9px] font-bold text-gray-400">Bảo trì</span>
                  ) : booked ? (
                    <span className="text-[9px] font-bold text-gray-400">Đã đặt</span>
                  ) : isPeak && (
                    <span className={cn('text-[9px] font-bold', selectedSlot === slot ? 'text-orange-200' : 'text-orange-500')}>
                      Giờ vàng
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-sports-primary" />Trống</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sports-primary" />Đã chọn</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-300" />Đã đặt</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-200 opacity-60" />Bảo trì</span>
          </div>
        </div>

        {/* Thời gian + giá */}
        {selectedSlot && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Thời gian chơi
              </label>
              <div className="flex gap-2 flex-wrap">
                {durations.map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                      duration === h
                        ? 'border-sports-primary bg-sports-primary text-white'
                        : 'border-gray-200 hover:border-sports-primary/50',
                    )}
                  >
                    {formatDuration(h)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-sports-light rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <Clock size={14} /> {selectedSlot} – {endTime} · {priceInfo?.label}
                </span>
                <span className="font-bold text-sports-primary">{formatCurrency(priceInfo!.price)}/h</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-sports-primary/20 pt-2">
                <span>Tổng tiền</span>
                <span className="text-sports-primary">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <Info size={12} /> Không cần đặt cọc · Thanh toán khi đến hoặc chuyển khoản
              </div>
            </div>

            <button
              onClick={() => setStep('confirm')}
              className="w-full py-4 rounded-2xl font-bold text-base gradient-sports text-white hover:opacity-90 active:scale-[0.98] transition-all sports-hero-text tracking-wider"
            >
              Tiếp tục →
            </button>
          </>
        )}

        {!selectedSlot && (
          <div className="w-full py-4 rounded-2xl font-bold text-base bg-gray-100 text-gray-400 text-center cursor-not-allowed">
            Chọn khung giờ để tiếp tục
          </div>
        )}
      </div>
    </div>
  );
}
