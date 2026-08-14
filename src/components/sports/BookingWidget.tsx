'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Info, Banknote, MapPin, CheckCircle2, Loader2, ArrowLeft, QrCode, User, Phone, Mail } from 'lucide-react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn, formatCurrency, isWeekend } from '@/lib/utils';
import { getPriceRules, calculateBookingPrice } from '@/lib/pricing';
import { VenueType } from '@/types';
import { useAuth } from '@/components/providers/AuthProvider';

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

// Ô khung giờ — thay cho các lớp .time-slot* của bảng màu cũ.
// Giữ min-h-[44px] để đủ vùng bấm trên điện thoại.
const SLOT_BASE =
  'min-h-[44px] px-1.5 py-2.5 sm:px-3 text-xs sm:text-sm font-medium rounded border ' +
  'select-none flex flex-col items-center justify-center transition-colors duration-150';
const SLOT_AVAILABLE = 'border-line text-fg hover:border-brand hover:text-brand-strong';
const SLOT_SELECTED  = 'border-brand-strong bg-brand-strong text-white';
const SLOT_BOOKED    = 'border-line bg-bg-subtle text-fg-muted cursor-not-allowed line-through';

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

  const { user } = useAuth();
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [pointsUsed,    setPointsUsed]    = useState(0);

  useEffect(() => {
    if (!user) { setPointsBalance(null); setPointsUsed(0); return; }
    fetch('/api/points/balance')
      .then(r => r.ok ? r.json() : { balance: null })
      .then(d => setPointsBalance(d.balance ?? null))
      .catch(() => setPointsBalance(null));
  }, [user]);

  // Nội dung ưu đãi đọc từ chương trình voucher admin đang bật — không viết cứng trong code,
  // để admin chỉnh ở /admin/vouchers là khách thấy ngay, không cần sửa code.
  const [rewardNote, setRewardNote] = useState<string | null>(null);
  const [rewardValidDays, setRewardValidDays] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/vouchers/active?venue_type=${selectedCourt.type}`)
      .then(r => r.json())
      .then(d => { setRewardNote(d.reward_note ?? null); setRewardValidDays(d.valid_days ?? null); })
      .catch(() => { setRewardNote(null); setRewardValidDays(null); });
  }, [selectedCourt.type]);

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

  const priceBreakdown = selectedSlot ? calculateBookingPrice(selectedSlot, duration, selectedCourt.type) : null;
  const totalPrice     = priceBreakdown?.total ?? 0;
  const endTime        = selectedSlot ? addHoursToTime(selectedSlot, duration) : '';

  const maxPointsUsable = pointsBalance !== null
    ? Math.min(pointsBalance, Math.floor(totalPrice / 1000))
    : 0;
  const pointsDiscount  = pointsUsed * 1000;
  const finalPrice      = totalPrice - pointsDiscount;

  useEffect(() => {
    if (pointsUsed > maxPointsUsable) setPointsUsed(maxPointsUsable);
  }, [maxPointsUsable, pointsUsed]);

  function isBooked(slot: string)  { return bookedSlots.includes(slot); }
  function isBlocked(slot: string) { return blockedSlots.includes(slot); }
  function isPastSlot(slot: string): boolean {
    if (!isToday(selectedDate)) return false;
    return slot <= new Date().toTimeString().slice(0, 5);
  }

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
          points_used:    pointsUsed,
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
      <div className="bg-bg rounded border border-line overflow-hidden">
        <div className="bg-ink px-6 py-5">
          <h2 className="font-display uppercase tracking-[0.04em] text-xl font-bold text-white">Đặt sân thành công!</h2>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-bg-subtle rounded flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-brand-strong" />
          </div>
          <p className="text-xs text-fg-muted mb-1">Mã đặt sân</p>
          <p className="font-mono font-bold text-xl text-fg mb-1">{bookingId}</p>
          <p className="text-xs text-fg-muted mb-5">Xác nhận đã gửi đến <strong>{guestEmail}</strong></p>

          <div className="bg-bg-subtle rounded p-4 text-left space-y-2 mb-5">
            {[
              { label: 'Sân',    value: `${selectedCourt.name} · ${venueName}` },
              { label: 'Ngày',   value: format(selectedDate, 'dd/MM/yyyy', { locale: vi }) },
              { label: 'Giờ',    value: `${selectedSlot} – ${endTime} (${duration}h)` },
              { label: 'Tên',    value: guestName || '(Không điền)' },
              { label: 'SĐT',    value: guestPhone },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-fg-muted">{r.label}</span>
                <span className="font-semibold text-fg text-right">{r.value}</span>
              </div>
            ))}
            {pointsUsed > 0 && (
              <div className="flex justify-between text-sm text-fg-muted">
                <span>Giảm giá ({pointsUsed} điểm)</span>
                <span>-{formatCurrency(pointsDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-line pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-brand-strong">{formatCurrency(finalPrice)}</span>
            </div>
          </div>

          {paymentMethod === 'bank_transfer' ? (
            <div className="bg-bg-subtle border border-line rounded p-4 text-left mb-5">
              <p className="text-sm font-semibold text-fg mb-1">Chuyển khoản để giữ sân</p>
              <p className="text-xs text-fg-muted leading-relaxed mb-3">
                Vui lòng chuyển <strong>{formatCurrency(finalPrice)}</strong> — sân được giữ trong <strong>2 giờ</strong>.
              </p>
              <div className="bg-bg rounded p-4 text-center border border-line">
                <div className="w-28 h-28 bg-bg-subtle rounded mx-auto flex items-center justify-center mb-2">
                  <QrCode size={48} className="text-fg-muted" />
                </div>
                <p className="text-xs text-fg-muted">Thông tin QR & tài khoản sẽ được cập nhật sớm</p>
              </div>
            </div>
          ) : (
            <div className="bg-bg-subtle border border-line rounded p-4 text-left mb-5">
              <p className="text-sm font-semibold text-fg mb-1">Thanh toán tại sân</p>
              <p className="text-xs text-fg-muted leading-relaxed">
                Đến sân trước <strong>10 phút</strong>, xuất trình mã <strong>{bookingId}</strong> để check-in.
              </p>
            </div>
          )}

          {rewardNote && (
            <div className="bg-bg-subtle border border-line rounded p-4 text-left mb-5">
              <p className="text-sm font-semibold text-fg mb-1">🎁 Quà tặng kèm</p>
              <p className="text-xs text-fg-muted leading-relaxed">
                Sau khi xác nhận đặt cọc, bạn được <strong>{rewardNote}</strong>
                {rewardValidDays ? ` (hạn ${rewardValidDays} ngày)` : ''}. Khi đến quầy chỉ cần đọc <strong>số điện thoại đặt sân</strong> để nhận.
              </p>
            </div>
          )}

          <button
            onClick={resetForm}
            className="w-full min-h-[48px] rounded bg-brand-strong text-white font-display uppercase tracking-[0.06em] text-sm hover:bg-[#00692C] transition-colors"
          >
            Đặt sân khác
          </button>
        </div>
      </div>
    );
  }

  /* ── CONFIRM ─────────────────────────────────── */
  if (step === 'confirm') {
    return (
      <div className="bg-bg rounded border border-line overflow-hidden">
        <div className="bg-ink px-6 py-5">
          <h2 className="font-display uppercase tracking-[0.04em] text-xl font-bold text-white">Xác nhận đặt sân</h2>
          <p className="text-white/70 text-sm mt-0.5">Điền thông tin để nhận xác nhận</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Booking summary */}
          <div className="bg-bg-subtle rounded p-4 space-y-2">
            {[
              { label: 'Sân',  value: `${selectedCourt.name} · ${venueName}` },
              { label: 'Ngày', value: format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi }) },
              { label: 'Giờ',  value: `${selectedSlot} – ${endTime} (${duration}h)` },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-fg-muted">{r.label}</span>
                <span className="font-semibold text-fg text-right">{r.value}</span>
              </div>
            ))}
            {pointsUsed > 0 && (
              <div className="flex justify-between text-sm text-fg-muted">
                <span>Giảm giá ({pointsUsed} điểm)</span>
                <span>-{formatCurrency(pointsDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-line pt-2 mt-1">
              <span>Tổng tiền</span>
              <span className="text-brand-strong">{formatCurrency(finalPrice)}</span>
            </div>
          </div>

          {/* Dùng điểm tích lũy */}
          {user ? (
            pointsBalance !== null && pointsBalance > 0 && (
              <div className="bg-bg-subtle border border-line rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-fg">Dùng điểm tích lũy</p>
                  <p className="text-xs text-fg-muted">Bạn có {pointsBalance} điểm</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPointsUsable}
                  value={pointsUsed}
                  onChange={(e) => setPointsUsed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-fg-muted mt-1">
                  <span>Dùng {pointsUsed} điểm (-{formatCurrency(pointsDiscount)})</span>
                  <span>Tối đa {maxPointsUsable} điểm</span>
                </div>
              </div>
            )
          ) : (
            <div className="bg-bg-subtle border border-line rounded p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-fg">Đăng ký thành viên — nhận thêm ưu đãi</p>
                <p className="text-xs text-fg-muted mt-0.5">Tích điểm mỗi lần đặt sân, dùng điểm giảm giá ngay lần sau.</p>
              </div>
              <a
                href="/login?mode=register"
                className="shrink-0 rounded-full bg-brand-strong text-white text-xs font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
              >
                Đăng ký
              </a>
            </div>
          )}

          {/* Contact info */}
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
              Thông tin liên hệ
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="Số điện thoại *"
                  required
                  className="w-full pl-9 pr-4 py-4 border border-line rounded text-base focus:outline-none focus:ring-2 focus:ring-0 focus:border-brand-strong transition-all"
                />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
                <input
                  type="email"
                  inputMode="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="Email nhận xác nhận *"
                  required
                  className="w-full pl-9 pr-4 py-4 border border-line rounded text-base focus:outline-none focus:ring-2 focus:ring-0 focus:border-brand-strong transition-all"
                />
              </div>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Họ và tên (tuỳ chọn)"
                  className="w-full pl-9 pr-4 py-4 border border-line rounded text-base focus:outline-none focus:ring-2 focus:ring-0 focus:border-brand-strong transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
              Phương thức thanh toán
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('bank_transfer')}
                className={cn(
                  'border-2 rounded p-4 text-left transition-all active:scale-[0.97]',
                  paymentMethod === 'bank_transfer'
                    ? 'border-brand-strong bg-bg-subtle'
                    : 'border-line hover:border-brand',
                )}
              >
                <Banknote size={20} className={cn('mb-2', paymentMethod === 'bank_transfer' ? 'text-brand-strong' : 'text-fg-muted')} />
                <p className="text-sm font-semibold text-fg">Chuyển khoản</p>
                <p className="text-xs text-fg-muted mt-0.5">QR / số tài khoản</p>
              </button>
              <button
                onClick={() => setPaymentMethod('pay_at_venue')}
                className={cn(
                  'border-2 rounded p-4 text-left transition-all active:scale-[0.97]',
                  paymentMethod === 'pay_at_venue'
                    ? 'border-brand-strong bg-bg-subtle'
                    : 'border-line hover:border-brand',
                )}
              >
                <MapPin size={20} className={cn('mb-2', paymentMethod === 'pay_at_venue' ? 'text-brand-strong' : 'text-fg-muted')} />
                <p className="text-sm font-semibold text-fg">Tại sân</p>
                <p className="text-xs text-fg-muted mt-0.5">Trả tiền khi đến</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-bg border border-danger rounded p-3 text-sm text-danger flex items-center gap-2">
              <Info size={15} className="shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Action buttons — sticky bottom on mobile */}
        <div className="sticky bottom-0 bg-bg border-t border-line px-4 sm:px-6 py-3 sm:py-4 flex gap-3">
          <button
            onClick={() => { setStep('form'); setPaymentMethod(null); setError(''); }}
            className="flex items-center gap-1.5 px-4 py-4 border border-line rounded text-sm text-fg-muted hover:bg-bg-subtle active:scale-[0.97] transition-all"
          >
            <ArrowLeft size={15} /> Quay lại
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={cn(
              'flex-1 py-4 rounded font-bold text-base transition-all flex items-center justify-center gap-2',
              !submitting
                ? 'bg-ink text-white hover:opacity-90 active:scale-[0.98] font-display uppercase tracking-[0.04em]'
                : 'bg-bg-subtle text-fg-muted cursor-not-allowed',
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
    <div className="bg-bg rounded border border-line overflow-hidden">
      <div className="bg-ink px-6 py-5">
        <h2 className="font-display uppercase tracking-[0.04em] text-xl font-bold text-white">Đặt {venueName}</h2>
        <p className="text-white/70 text-sm mt-0.5">Chọn sân · Chọn ngày · Chọn giờ</p>
      </div>

      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Bước 1: Sân */}
        <div>
          <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
            Bước 1 — Chọn sân
          </label>
          <div className="grid grid-cols-3 gap-2">
            {courts.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCourt(c); setSelectedSlot(null); setDuration(1); }}
                className={cn(
                  'py-3 px-2 rounded border-2 text-xs sm:text-sm font-bold transition-all active:scale-[0.97]',
                  selectedCourt.id === c.id
                    ? 'border-brand-strong bg-brand-strong text-white'
                    : 'border-line text-fg hover:border-brand',
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
            <label className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Bước 2 — Chọn ngày</label>
            <div className="flex gap-1">
              <button onClick={() => setWeekStart(d => addDays(d, -7))} className="p-1.5 rounded hover:bg-bg-subtle">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setWeekStart(d => addDays(d, 7))} className="p-1.5 rounded hover:bg-bg-subtle">
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
                    'flex flex-col items-center py-2.5 rounded transition-all text-xs',
                    past && 'opacity-30 cursor-not-allowed',
                    isSameDay(day, selectedDate)
                      ? 'bg-brand-strong text-white'
                      : isWeekend(day)
                        ? 'bg-bg-subtle text-fg hover:bg-line'
                        : 'hover:bg-bg-subtle',
                  )}
                >
                  <span className="font-medium">{format(day, 'EEE', { locale: vi }).slice(0,2)}</span>
                  <span className="font-bold text-sm mt-0.5">{format(day, 'd')}</span>
                  {isToday(day) && <span className="w-1 h-1 rounded-full bg-brand mt-1" />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-fg-muted mt-2">
            {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
            {isWeekend(selectedDate) && <span className="ml-2 text-brand-strong font-medium">· Cuối tuần</span>}
          </p>
        </div>

        {/* Bước 3: Giờ */}
        <div>
          <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
            Bước 3 — Chọn khung giờ
          </label>
          <div className={cn('gap-2 grid', isBadminton ? 'grid-cols-4 sm:grid-cols-8' : 'grid-cols-4')}>
            {slots.map((slot) => {
              const booked  = isBooked(slot);
              const blocked = isBlocked(slot);
              const past    = isPastSlot(slot);
              const taken   = booked || blocked || past;
              const isPeak  = getPriceRules(slot, selectedCourt.type).label.includes('Giờ vàng');
              return (
                <button
                  key={slot}
                  disabled={taken}
                  onClick={() => setSelectedSlot(slot === selectedSlot ? null : slot)}
                  className={cn(
                    SLOT_BASE,
                    blocked
                      ? `${SLOT_BOOKED} opacity-60`
                      : booked
                        ? SLOT_BOOKED
                        : past
                          ? `${SLOT_BOOKED} opacity-40`
                          : selectedSlot === slot
                            ? SLOT_SELECTED
                            : SLOT_AVAILABLE,
                  )}
                >
                  <span>{slot}</span>
                  {blocked ? (
                    <span className="text-[9px] font-bold text-fg-muted">Bảo trì</span>
                  ) : booked ? (
                    <span className="text-[9px] font-bold text-fg-muted">Đã đặt</span>
                  ) : past ? (
                    <span className="text-[9px] font-bold text-fg-muted">Đã qua</span>
                  ) : isPeak && (
                    <span className={cn('text-[9px] font-bold', selectedSlot === slot ? 'text-white/80' : 'text-brand-strong')}>
                      Giờ vàng
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-fg-muted flex-wrap">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-brand-strong" />Trống</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-strong" />Đã chọn</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-line" />Đã đặt</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-line opacity-60" />Bảo trì</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-line opacity-40" />Đã qua</span>
          </div>
        </div>

        {/* Thời gian + giá */}
        {selectedSlot && (
          <>
            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
                Thời gian chơi
              </label>
              <div className="flex gap-2 flex-wrap">
                {durations.map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className={cn(
                      'px-4 py-2 rounded text-sm font-semibold border-2 transition-all',
                      duration === h
                        ? 'border-brand-strong bg-brand-strong text-white'
                        : 'border-line hover:border-brand',
                    )}
                  >
                    {formatDuration(h)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bg-subtle rounded p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-fg-muted flex items-center gap-1.5">
                  <Clock size={14} /> {selectedSlot} – {endTime}
                </span>
              </div>
              {priceBreakdown?.segments.map(seg => (
                <div key={seg.label} className="flex justify-between items-center text-xs text-fg-muted">
                  <span>{seg.label} · {formatDuration(seg.hours)}</span>
                  <span>{formatCurrency(seg.price)}/h</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base border-t border-line pt-2">
                <span>Tổng tiền</span>
                <span className="text-brand-strong">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-fg-muted mt-1">
                <Info size={12} /> Không cần đặt cọc · Thanh toán khi đến hoặc chuyển khoản
              </div>
            </div>

            <button
              onClick={() => setStep('confirm')}
              className="w-full py-4 rounded font-bold text-base bg-ink text-white hover:opacity-90 active:scale-[0.98] transition-all font-display uppercase tracking-[0.04em] tracking-wider"
            >
              Tiếp tục →
            </button>
          </>
        )}

        {!selectedSlot && (
          <div className="w-full py-4 rounded font-bold text-base bg-bg-subtle text-fg-muted text-center cursor-not-allowed">
            Chọn khung giờ để tiếp tục
          </div>
        )}
      </div>
    </div>
  );
}
