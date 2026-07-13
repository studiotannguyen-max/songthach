// Chạy 1 lần khi server Node khởi động (Next.js instrumentation hook).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const [net, dns] = await Promise.all([import('net'), import('dns')]);

    // VPS (VN) không route được IPv6, nhưng nhiều host (vd api.telegram.org) có bản ghi AAAA.
    // Happy-Eyeballs của Node đua IPv4+IPv6 song song; lượt IPv6 báo ENETUNREACH làm hỏng cả
    // lượt IPv4 vốn dĩ thông → fetch() tới Telegram bị ETIMEDOUT (thông báo đặt sân không gửi được).
    // Tắt autoSelectFamily + ưu tiên IPv4 để mọi fetch server-side kết nối ổn định qua IPv4.
    dns.setDefaultResultOrder('ipv4first');
    net.setDefaultAutoSelectFamily?.(false);
  }
}
