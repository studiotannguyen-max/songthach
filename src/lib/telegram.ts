const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const date = new Date(+y, +m - 1, +d);
  return `${WEEKDAYS[date.getDay()]}, ${d}/${m}/${y}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export interface TelegramBookingData {
  booking_id:     string;
  court_name:     string;
  venue_label:    string;
  booking_date:   string; // yyyy-MM-dd
  start_time:     string;
  end_time:       string;
  duration:       number;
  user_name:      string | null;
  user_phone:     string;
  total_price:    number;
  payment_method: 'bank_transfer' | 'pay_at_venue';
}

export async function sendTelegramNotification(data: TelegramBookingData): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const paymentLabel = data.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán tại sân';
  const name         = data.user_name || '(Không tên)';

  const text = [
    `🏟️ *ĐẶT SÂN MỚI*`,
    ``,
    `📌 \`${data.booking_id}\``,
    `🏟 ${data.court_name} · ${data.venue_label}`,
    `📅 ${formatDate(data.booking_date)}`,
    `⏰ ${data.start_time} – ${data.end_time} (${data.duration}h)`,
    ``,
    `👤 ${name}`,
    `📞 ${data.user_phone}`,
    `💰 ${formatCurrency(data.total_price)} — ${paymentLabel}`,
    ``,
    `👉 [Xem admin](${siteUrl}/admin/bookings)`,
  ].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
}
