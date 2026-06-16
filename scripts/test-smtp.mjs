// Chạy: node scripts/test-smtp.mjs
// Test kết nối Axigen SMTP trước khi deploy

import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Đọc .env.local thủ công (không cần dotenv)
const envPath = join(__dir, '..', '.env.local');
const envLines = readFileSync(envPath, 'utf-8').split('\n');
for (const line of envLines) {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
}

const config = {
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
};

console.log('📧 Config SMTP:');
console.log(`   Host   : ${config.host}`);
console.log(`   Port   : ${config.port}`);
console.log(`   Secure : ${config.secure}`);
console.log(`   User   : ${config.auth.user}`);
console.log(`   Pass   : ${'*'.repeat((config.auth.pass ?? '').length)}`);
console.log('');

if (!config.auth.pass || config.auth.pass === 'DIEN_MAT_KHAU_VAO_DAY') {
  console.error('❌ Chưa điền SMTP_PASS vào .env.local!');
  process.exit(1);
}

const transporter = nodemailer.createTransport({ ...config, tls: { rejectUnauthorized: false } });

try {
  console.log('🔌 Đang kết nối...');
  await transporter.verify();
  console.log('✅ Kết nối Axigen SMTP thành công!\n');

  console.log('📨 Gửi email test...');
  const info = await transporter.sendMail({
    from:    process.env.SMTP_USER,    // thử không có display name
    to:      process.env.SMTP_USER,
    subject: '[Test] Song Thach SMTP OK',
    html:    '<p>Email test từ hệ thống Song Thạch. Nếu bạn nhận được email này, SMTP đã hoạt động đúng.</p>',
  });

  console.log('✅ Email đã gửi thành công!');
  console.log(`   Message ID: ${info.messageId}`);
} catch (err) {
  console.error('❌ Lỗi SMTP:', err.message);
  if (err.code === 'ECONNREFUSED') console.error('   → Không kết nối được. Kiểm tra HOST và PORT.');
  if (err.responseCode === 535)    console.error('   → Sai mật khẩu hoặc username.');
  if (err.code === 'ENOTFOUND')    console.error('   → Không tìm thấy host. Kiểm tra SMTP_HOST.');
  process.exit(1);
}
