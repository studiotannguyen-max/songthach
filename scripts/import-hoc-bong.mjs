/**
 * Nhập danh sách học bổng từ Excel -> src/app/(public)/giai-cau-long-2026/hoc-bong-data.ts
 *
 *   node scripts/import-hoc-bong.mjs ["đường dẫn file .xlsx"]
 *
 * Sheet đầu tiên phải có tiêu đề ở dòng 1: STT | Họ và tên | Trường | Lớp | Hoàn cảnh
 * (thứ tự cột được nhận diện theo tên tiêu đề nên có thể xê dịch).
 *
 * Trang /giai-cau-long-2026 là trang công khai, nên script tự loại địa chỉ nhà và
 * số điện thoại khỏi cột "Hoàn cảnh" — file Excel gốc không bị thay đổi.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import ExcelJS from 'exceljs';

const SRC = process.argv[2] ?? 'D:/GIAI DAU SONG THACH/danh sach nhan hoc bong 2026.xlsx';
const OUT = path.join(process.cwd(), 'src/app/(public)/giai-cau-long-2026/hoc-bong-data.ts');

const txt = (v) => {
  if (v == null) return '';
  if (typeof v === 'object') {
    if (v.richText) return v.richText.map((t) => t.text).join('');
    if ('result' in v) return String(v.result ?? '');
    if (v.text) return String(v.text);
  }
  return String(v);
};

/** Bỏ địa chỉ nhà / SĐT khỏi phần hoàn cảnh trước khi công khai lên web. */
const sanitize = (s) => {
  const out = txt(s)
    .replace(/\s+/g, ' ')
    .replace(/[.,;]?\s*(Địa\s*chỉ|Đ\/c|ĐC)\s*:.*$/i, '')
    .replace(/[.,;]?\s*(SĐT|SDT|Số\s*điện\s*thoại|Điện\s*thoại|ĐT)\s*:?\s*0\d[\d\s.-]{6,}/gi, '')
    .replace(/[.,;]?\s*\b0\d{8,10}\b/g, '')
    .replace(/[\s,;.]+$/, '')
    .trim();
  return out ? `${out}.` : '';
};

/** Chuẩn hoá cột lớp: bỏ tiền tố "Lớp", bỏ dữ liệu rác. */
const cleanCls = (v) => {
  const c = txt(v).trim().replace(/^Lớp\s*/i, '').replace(/[-–]\s*$/, '').trim();
  return /^(Nguyễn)?$/i.test(c) ? '' : c;
};

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(SRC);
const ws = wb.worksheets[0];

// Nhận diện cột theo tiêu đề dòng 1
const col = {};
ws.getRow(1).eachCell((cell, c) => {
  const h = txt(cell.value).toLowerCase();
  if (h.includes('stt')) col.stt = c;
  else if (h.includes('tên')) col.name = c;
  else if (h.includes('trường')) col.school = c;
  else if (h.includes('lớp')) col.cls = c;
  else if (h.includes('hoàn cảnh')) col.situation = c;
});
for (const k of ['stt', 'name', 'school', 'cls', 'situation']) {
  if (!col[k]) throw new Error(`Không tìm thấy cột "${k}" trong dòng tiêu đề của ${SRC}`);
}

const groups = [];
let n = 0;
ws.eachRow((row, i) => {
  if (i === 1) return;
  const name = txt(row.getCell(col.name).value).trim();
  if (!name) return; // bỏ dòng trống
  const school = txt(row.getCell(col.school).value).trim() || 'Khác';
  let g = groups.find((x) => x.school === school);
  if (!g) groups.push((g = { school, students: [] }));
  g.students.push({
    stt: ++n,
    name,
    cls: cleanCls(row.getCell(col.cls).value),
    situation: sanitize(row.getCell(col.situation).value),
  });
});

const stamp = new Date().toLocaleDateString('vi-VN');
let out = `export interface Student {
  stt: number;
  name: string;
  cls: string;
  situation: string;
}

export interface SchoolGroup {
  school: string;
  students: Student[];
}

// TỰ SINH — đừng sửa tay. Nguồn: "${path.basename(SRC)}" (nhập ngày ${stamp}).
// Cập nhật: node scripts/import-hoc-bong.mjs "<đường dẫn file .xlsx>"
// ${n} suất học bổng / ${groups.length} trường.
export const HOC_BONG_DATA: SchoolGroup[] = [
`;
for (const g of groups) {
  out += `  {\n    school: ${q(g.school)},\n    students: [\n`;
  for (const s of g.students) {
    out += `      { stt: ${s.stt}, name: ${q(s.name)}, cls: ${q(s.cls)}, situation: ${q(s.situation)} },\n`;
  }
  out += `    ],\n  },\n`;
}
out += `];\n`;

writeFileSync(OUT, out, 'utf8');

console.log(`Nguồn : ${SRC}`);
console.log(`Ghi   : ${OUT}`);
console.log(`Tổng  : ${n} học sinh / ${groups.length} trường`);
groups.forEach((g) => console.log(`  ${String(g.students.length).padStart(2)}  ${g.school}`));
console.log(`Kinh phí: ${n} × 800.000đ = ${(n * 800000).toLocaleString('vi-VN')}đ`);
