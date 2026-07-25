import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { reconcileImport, type RawRow, type ExistingPlayer, type Reconciled } from '@/lib/player-import';
import { commitImport } from '@/lib/players';

// Ánh xạ tên cột (không phân biệt hoa thường / dấu cách) → khoá RawRow
const COL: Record<string, keyof RawRow> = {
  'ho va ten': 'full_name', 'ho ten': 'full_name', 'ten': 'full_name',
  'muc trinh': 'band', 'trinh': 'band', 'band': 'band',
  'so dien thoai': 'phone', 'sdt': 'phone', 'dien thoai': 'phone',
  'biet danh': 'nickname',
  'diem tien do': 'progress_points', 'tien do': 'progress_points',
  'ngay test': 'tested_at', 'ghi chu test': 'test_note', 'ghi chu': 'test_note',
};

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
}

// exceljs trả value nhiều kiểu: Date cho ô ngày, {result} cho công thức, {text} cho rich text.
// Chuẩn hoá về chuỗi; riêng ngày trả yyyy-mm-dd để cột DATE nhận đúng, không lệ thuộc chuỗi múi giờ.
function cellToStr(v: unknown): string {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object') {
    const o = v as { result?: unknown; text?: unknown };
    if (o.text != null) return String(o.text).trim();
    if (o.result != null) return String(o.result).trim();
  }
  return String(v).trim();
}

// POST — đọc file (.xlsx hoặc .csv), trả phân loại (chưa ghi gì)
export async function POST(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Không có file' }, { status: 400 });

  // Đọc file → danh sách hàng kèm SỐ DÒNG THẬT trong file (hàng đầu = tiêu đề). Hỗ trợ .xlsx và .csv.
  const name = (file.name || '').toLowerCase();
  const fileRows: { rowNum: number; cells: string[] }[] = [];
  if (name.endsWith('.csv')) {
    const text = Buffer.from(await file.arrayBuffer()).toString('utf-8').replace(/^﻿/, '');
    text.split(/\r?\n/).forEach((line, i) => {
      if (line.trim() === '') return;
      fileRows.push({ rowNum: i + 1, cells: line.split(',').map((c) => c.trim()) });
    });
  } else {
    const wb = new ExcelJS.Workbook();
    // exceljs khai kiểu tham số `load` bằng `Buffer` không tham số hoá; bản @types/node hiện tại
    // (Buffer<T> generic hoá theo ArrayBufferLike) không khớp cấu trúc dù cùng là Buffer thật —
    // ép kiểu qua chính kiểu tham số khai báo của hàm để tránh phụ thuộc vào cách hai bên tham số hoá.
    await wb.xlsx.load(Buffer.from(await file.arrayBuffer()) as unknown as Parameters<typeof wb.xlsx.load>[0]);
    const ws = wb.worksheets[0];
    if (!ws) return NextResponse.json({ error: 'File không có sheet nào' }, { status: 400 });
    ws.eachRow({ includeEmpty: false }, (row) => {
      const cells: string[] = [];
      row.eachCell({ includeEmpty: true }, (cell) => { cells.push(cellToStr(cell.value)); });
      fileRows.push({ rowNum: row.number, cells });
    });
  }
  if (fileRows.length < 2) {
    return NextResponse.json({ error: 'File cần ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu' }, { status: 400 });
  }

  const header = fileRows[0].cells;
  const colIndex = new Map<number, keyof RawRow>();
  header.forEach((h, idx) => { const key = COL[norm(h)]; if (key) colIndex.set(idx, key); });

  const rows: RawRow[] = [];
  for (let i = 1; i < fileRows.length; i++) {
    const { rowNum, cells } = fileRows[i];
    const raw: RawRow = { rowNum };
    let hasAny = false;
    colIndex.forEach((key, idx) => {
      const v = cells[idx];
      if (v != null && v.trim() !== '') { (raw as Record<string, unknown>)[key] = v.trim(); hasAny = true; }
    });
    if (hasAny) rows.push(raw);
  }

  const admin = createAdminClient();
  const { data: existing, error: exErr } = await admin.from('players').select('id, full_name, phone, band, progress_points');
  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });
  const reconciled = reconcileImport(rows, (existing ?? []) as ExistingPlayer[]);
  return NextResponse.json({ rows: reconciled });
}

// PUT — ghi các dòng admin đã chọn (client gửi lại mảng đã lọc autoSelect/tick)
export async function PUT(req: NextRequest) {
  const { response: authError } = await requireAdmin();
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const rows = (body.rows ?? []) as Reconciled[];
  const toWrite = rows.filter((r) => r.kind === 'new' || r.kind === 'update');
  const admin = createAdminClient();
  try {
    const result = await commitImport(admin, toWrite);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
