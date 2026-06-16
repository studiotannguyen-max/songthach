import nodemailer from 'nodemailer';

// Tạo transporter một lần — tái sử dụng connection pool
function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? 'localhost',
    port:   Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== 'false', // true cho port 465, false cho 587
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
  });
}

const FROM = process.env.SMTP_FROM ?? 'Song Thạch <noreply@songthach.vn>';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

interface BookingEmailData {
  to:             string;
  booking_id:     string;
  user_name:      string | null;
  court_name:     string;
  venue_name:     string;
  booking_date:   string;
  start_time:     string;
  end_time:       string;
  duration:       number;
  total_price:    number;
  payment_method: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const {
    to, booking_id, user_name, court_name, venue_name,
    booking_date, start_time, end_time, duration,
    total_price, payment_method,
  } = data;

  const isBankTransfer = payment_method === 'bank_transfer';
  const greeting       = user_name ? `Xin chào <strong>${user_name}</strong>,` : 'Xin chào,';

  const paymentSection = isBankTransfer
    ? `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-top:20px;">
        <p style="margin:0 0 8px;font-weight:700;color:#1d4ed8;font-size:15px;">💳 Hoàn tất chuyển khoản để giữ sân</p>
        <p style="margin:0 0 12px;color:#1e40af;font-size:14px;line-height:1.6;">
          Vui lòng chuyển khoản <strong>${formatCurrency(total_price)}</strong> theo thông tin bên dưới.
          Sân được giữ trong <strong>2 giờ</strong> kể từ thời điểm đặt.
        </p>
        <div style="background:#fff;border-radius:8px;padding:16px;border:1px solid #bfdbfe;text-align:center;">
          <p style="margin:0;color:#6b7280;font-size:13px;">Thông tin chuyển khoản & QR sẽ được cập nhật sớm.</p>
          <p style="margin:8px 0 0;color:#6b7280;font-size:12px;">Chúng tôi sẽ liên hệ xác nhận qua email này.</p>
        </div>
      </div>`
    : `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-top:20px;">
        <p style="margin:0 0 8px;font-weight:700;color:#15803d;font-size:15px;">📍 Thanh toán tại sân</p>
        <p style="margin:0;color:#166534;font-size:14px;line-height:1.6;">
          Vui lòng đến sân trước <strong>10 phút</strong> và xuất trình mã đặt sân
          <strong>${booking_id}</strong> để check-in. Thanh toán <strong>${formatCurrency(total_price)}</strong> tại quầy lễ tân.
        </p>
      </div>`;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a6b3a,#2d9e5f);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:10px;padding:8px 16px;margin-bottom:12px;">
            <span style="color:#fff;font-weight:900;font-size:18px;letter-spacing:2px;">SONG THẠCH</span>
          </div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Xác nhận đặt sân thành công!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">${greeting}</p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
            Chúng tôi đã nhận được yêu cầu đặt sân của bạn. Dưới đây là chi tiết lịch đặt:
          </p>

          <!-- Booking ID -->
          <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center;border:2px dashed #d1fae5;">
            <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Mã đặt sân</p>
            <p style="margin:0;font-size:28px;font-weight:900;color:#1a6b3a;letter-spacing:3px;font-family:monospace;">${booking_id}</p>
          </div>

          <!-- Details table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            ${[
              ['🏟️ Sân',        `${court_name} · ${venue_name}`],
              ['📅 Ngày',        formatDate(booking_date)],
              ['⏰ Giờ',         `${start_time} – ${end_time} (${duration}h)`],
              ['💰 Tổng tiền',   formatCurrency(total_price)],
              ['💳 Thanh toán',  isBankTransfer ? 'Chuyển khoản ngân hàng' : 'Thanh toán tại sân'],
            ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
                <td style="padding:12px 16px;font-size:13px;color:#6b7280;width:130px;">${label}</td>
                <td style="padding:12px 16px;font-size:14px;color:#111827;font-weight:600;">${value}</td>
              </tr>
            `).join('')}
          </table>

          ${paymentSection}

          <!-- Footer note -->
          <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;text-align:center;">
            Nếu cần hỗ trợ, liên hệ chúng tôi qua email hoặc gọi trực tiếp đến sân.<br>
            Xin cảm ơn và hẹn gặp bạn tại <strong>Song Thạch</strong>!
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            © 2026 Song Thạch · Email này được gửi tự động, vui lòng không reply.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const transporter = createTransporter();
  return transporter.sendMail({
    from:    FROM,
    to,
    subject: `[Song Thạch] Xác nhận đặt sân ${booking_id} — ${court_name} ngày ${formatDate(booking_date)}`,
    html,
  });
}

interface VoucherEmailData {
  to:          string;
  user_name:   string | null;
  code:        string;
  reward_note: string;
  expires_at:  string; // ISO
}

export async function sendVoucherEmail(data: VoucherEmailData) {
  const { to, user_name, code, reward_note, expires_at } = data;
  const greeting = user_name ? `Xin chào <strong>${user_name}</strong>,` : 'Xin chào,';
  const expiry   = new Date(expires_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f5f2;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <tr><td style="background:linear-gradient(135deg,#292723,#a9781f,#d8b257);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:10px;padding:8px 16px;margin-bottom:12px;">
            <span style="color:#fff;font-weight:900;font-size:18px;letter-spacing:2px;">SONG THẠCH</span>
          </div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🎁 Bạn được tặng voucher!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Quà cảm ơn vì đã đặt sân tại Song Thạch</p>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">${greeting}</p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
            Đặt sân của bạn đã được xác nhận. Tặng bạn: <strong>${reward_note}</strong>.
          </p>

          <div style="background:#fdf8ec;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;border:2px dashed #d8b257;">
            <p style="margin:0 0 4px;font-size:12px;color:#8b8579;text-transform:uppercase;letter-spacing:1px;">Mã voucher</p>
            <p style="margin:0;font-size:30px;font-weight:900;color:#c1922f;letter-spacing:4px;font-family:monospace;">${code}</p>
            <p style="margin:8px 0 0;font-size:13px;color:#8b8579;">Hạn dùng đến hết ngày <strong>${expiry}</strong></p>
          </div>

          <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
            <strong>Cách dùng:</strong> đến quầy <strong>Café Lavie</strong> tại Song Thạch,
            đọc mã voucher hoặc <strong>số điện thoại đặt sân</strong> cho nhân viên là xong.
          </p>

          <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;text-align:center;">
            Hẹn gặp bạn tại <strong>Song Thạch</strong>!
          </p>
        </td></tr>

        <tr><td style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Song Thạch · Email này được gửi tự động, vui lòng không reply.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const transporter = createTransporter();
  return transporter.sendMail({
    from:    FROM,
    to,
    subject: `[Song Thạch] 🎁 Voucher ${code} — ${reward_note}`,
    html,
  });
}
