const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

interface TelegramBookingPayload {
  booking_id:     string;
  court_name:     string;
  venue_label:    string;
  booking_date:   string;
  start_time:     string;
  end_time:       string;
  duration:       number;
  user_name:      string | null;
  user_phone:     string;
  total_price:    number;
  payment_method: 'bank_transfer' | 'pay_at_venue';
}

function formatPrice(amount: number) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export async function sendTelegramNotification(payload: TelegramBookingPayload) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const paymentLabel = payload.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán tại sân';

  const text = [
    `🏟 *ĐẶT SÂN MỚI — ${payload.booking_id}*`,
    ``,
    `📍 *${payload.venue_label}* · ${payload.court_name}`,
    `📅 ${formatDate(payload.booking_date)} · ${payload.start_time} – ${payload.end_time} (${payload.duration}h)`,
    `💰 ${formatPrice(payload.total_price)} · ${paymentLabel}`,
    ``,
    `👤 ${payload.user_name || 'Khách'}`,
    `📞 ${payload.user_phone}`,
  ].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}
