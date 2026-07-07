// scripts/verify-finance-ledger.mjs
// Kiểm tra logic tính sổ thu chi — chạy: npx tsx scripts/verify-finance-ledger.mjs
import { computeLedger } from '../src/lib/finance.ts';

const entries = [
  { id: '1', entry_date: '2026-06-30', type: 'thu', category: null,    description: 'Thu cuối tháng 6', amount: 100000, note: null, created_at: '2026-06-30T00:00:00Z' },
  { id: '2', entry_date: '2026-07-01', type: 'thu', category: null,    description: 'San S5 19:00',     amount: 170000, note: null, created_at: '2026-07-01T00:00:00Z' },
  { id: '3', entry_date: '2026-07-02', type: 'chi', category: 'khac',  description: 'Da + nuoc',        amount: 50000,  note: null, created_at: '2026-07-02T00:00:00Z' },
  { id: '4', entry_date: '2026-08-01', type: 'thu', category: null,    description: 'San tháng 8',      amount: 90000,  note: null, created_at: '2026-08-01T00:00:00Z' },
];

const result = computeLedger(entries, '2026-07');

let failed = false;
function check(actual, expected, label) {
  if (actual !== expected) {
    console.error(`❌ ${label}: mong đợi ${expected}, thực tế ${actual}`);
    failed = true;
  } else {
    console.log(`✅ ${label}: ${actual}`);
  }
}

check(result.entries.length, 2, 'số dòng trong tháng 7');
check(result.totalThu, 170000, 'totalThu');
check(result.totalChi, 50000, 'totalChi');
check(result.balanceAtMonthEnd, 220000, 'balanceAtMonthEnd'); // 100000 + 170000 - 50000
check(result.entries[0].balance, 270000, 'số dư dòng "San S5 19:00"'); // 100000 + 170000
check(result.entries[1].balance, 220000, 'số dư dòng "Da + nuoc"');   // 270000 - 50000

if (failed) { console.error('\n❌ CÓ KIỂM TRA THẤT BẠI'); process.exit(1); }
console.log('\n✅ Tất cả kiểm tra computeLedger đều đúng');
