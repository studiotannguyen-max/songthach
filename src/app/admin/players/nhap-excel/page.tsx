'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface Reconciled {
  rowNum: number; kind: 'new'|'update'|'same'|'error'; errors: string[];
  autoSelect: boolean; warning?: string; existingId?: string;
  parsed: { full_name: string; phone: string | null; band: number; progress_points: number };
}
const KIND_LABEL = { new: 'Người mới', update: 'Đã có — cập nhật', same: 'Y hệt — bỏ qua', error: 'Lỗi' };
const KIND_CLS = {
  new: 'bg-green-100 text-green-700', update: 'bg-amber-100 text-amber-700',
  same: 'bg-gray-100 text-gray-500', error: 'bg-red-100 text-red-700',
};

export default function ImportPage() {
  const router = useRouter();
  const [rows, setRows]   = useState<Reconciled[] | null>(null);
  const [ticks, setTicks] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  async function upload(file: File) {
    setLoading(true); setFileName(file.name);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/players/import', { method: 'POST', body: fd }).then(r => r.json());
    setLoading(false);
    if (res.error) { toast.error(res.error); return; }
    setRows(res.rows);
    const init: Record<number, boolean> = {};
    for (const r of res.rows as Reconciled[]) init[r.rowNum] = r.autoSelect;
    setTicks(init);
  }

  const tally = rows ? {
    new: rows.filter(r => r.kind === 'new').length,
    update: rows.filter(r => r.kind === 'update').length,
    same: rows.filter(r => r.kind === 'same').length,
    error: rows.filter(r => r.kind === 'error').length,
  } : null;

  const selected = rows?.filter(r => ticks[r.rowNum] && (r.kind === 'new' || r.kind === 'update')) ?? [];

  async function commit() {
    setLoading(true);
    const res = await fetch('/api/admin/players/import', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rows: selected }),
    }).then(r => r.json());
    setLoading(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`Đã ghi ${res.created} mới + ${res.updated} cập nhật`);
    router.push('/admin/players');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nhập danh sách từ Excel</h1>

      {!rows ? (
        <div className="admin-card p-8 text-center">
          <FileSpreadsheet size={40} className="mx-auto mb-3 text-green-600" />
          <p className="font-semibold">Chọn file .xlsx hoặc .csv</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Dòng đầu là tên cột: Họ và tên, Mức trình, Số điện thoại, Biệt danh, Điểm tiến độ, Ngày test, Ghi chú test</p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-sports-primary text-white rounded-xl font-medium cursor-pointer">
            <Upload size={16} /> {loading ? 'Đang đọc...' : 'Chọn file'}
            <input type="file" accept=".xlsx,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          </label>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Tile label="Người mới" v={tally!.new} cls="border-l-green-500" />
            <Tile label="Cập nhật" v={tally!.update} cls="border-l-amber-500" />
            <Tile label="Y hệt" v={tally!.same} cls="border-l-gray-400" />
            <Tile label="Dòng lỗi" v={tally!.error} cls="border-l-red-500" />
          </div>

          <div className="admin-card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead><tr className="text-left text-xs uppercase text-gray-500 border-b">
                <th className="px-3 py-3 text-center">Ghi</th><th className="px-3 py-3">Dòng</th><th className="px-3 py-3">Họ tên</th>
                <th className="px-3 py-3">SĐT</th><th className="px-3 py-3">Trình</th><th className="px-3 py-3 text-right">Tiến độ</th><th className="px-3 py-3">Kết quả</th>
              </tr></thead>
              <tbody>
                {rows.map(r => {
                  const selectable = r.kind === 'new' || r.kind === 'update';
                  return (
                    <tr key={r.rowNum} className={`border-b last:border-0 ${r.kind === 'error' ? 'bg-red-50' : r.warning ? 'bg-amber-50' : ''}`}>
                      <td className="px-3 py-3 text-center">
                        <input type="checkbox" disabled={!selectable} checked={!!ticks[r.rowNum]}
                          onChange={e => setTicks(t => ({ ...t, [r.rowNum]: e.target.checked }))} />
                      </td>
                      <td className="px-3 py-3 tabular-nums text-gray-500">{r.rowNum}</td>
                      <td className="px-3 py-3 font-medium">{r.parsed.full_name || <span className="text-red-600">(trống)</span>}</td>
                      <td className="px-3 py-3 tabular-nums">{r.parsed.phone ?? '—'}</td>
                      <td className="px-3 py-3">A{r.parsed.band}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{r.parsed.progress_points}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${KIND_CLS[r.kind]}`}>{KIND_LABEL[r.kind]}</span>
                        {r.errors.length > 0 && <div className="text-xs text-red-600 font-medium mt-1">{r.errors.join(' · ')}</div>}
                        {r.warning && <div className="text-xs text-amber-700 font-medium mt-1">{r.warning}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 admin-card p-4">
            <div className="text-sm font-medium">
              Sẽ ghi <b>{selected.filter(r => r.kind === 'new').length} hồ sơ mới</b> + <b>{selected.filter(r => r.kind === 'update').length} cập nhật</b>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setRows(null); setFileName(''); }} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium">Huỷ, chọn file khác</button>
              <button onClick={commit} disabled={loading || selected.length === 0} className="px-5 py-2.5 bg-sports-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">
                Ghi {selected.length} dòng vào hệ thống
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">Muốn sửa dòng lỗi thì sửa trong file Excel rồi tải lên lại — để file gốc và dữ liệu trên web luôn khớp.</p>
        </>
      )}
    </div>
  );
}

function Tile({ label, v, cls }: { label: string; v: number; cls: string }) {
  return (
    <div className={`admin-card p-4 border-l-[6px] ${cls}`}>
      <div className="text-xs font-bold uppercase text-gray-500">{label}</div>
      <div className="text-2xl font-extrabold tabular-nums mt-0.5">{v}</div>
    </div>
  );
}
