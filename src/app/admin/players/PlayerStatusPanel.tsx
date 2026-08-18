'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { UserMinus, UserCheck } from 'lucide-react';

/** Cho VĐV nghỉ / cho sinh hoạt lại.
 *  Nghỉ chỉ hạ cờ is_active — hồ sơ và sổ điểm giữ nguyên, bật lại lúc nào cũng được.
 *  View players_public lọc theo cờ này nên bảng xếp hạng công khai ẩn người nghỉ ngay. */
export default function PlayerStatusPanel({
  id, fullName, isActive, onDone,
}: {
  id: string;
  fullName: string;
  isActive: boolean;
  onDone: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    const res = await fetch(`/api/admin/players/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ is_active: !isActive }),
    }).then(r => r.json()).catch(() => ({ error: 'Không gọi được máy chủ' }));
    setSaving(false);

    if (res.error) { toast.error(res.error); return; }
    toast.success(isActive ? `Đã cho ${fullName} nghỉ` : `${fullName} đã sinh hoạt lại`);
    onDone();
  }

  return (
    <div className="admin-card p-5">
      <h3 className="font-bold mb-1">Trạng thái sinh hoạt</h3>
      <p className="text-sm text-gray-500 mb-4">
        {isActive
          ? 'Đang sinh hoạt — có mặt trên bảng xếp hạng công khai. Cho nghỉ thì VĐV ẩn khỏi trang công khai, hồ sơ và sổ điểm vẫn giữ nguyên.'
          : 'Đã nghỉ — không hiện trên bảng xếp hạng công khai. Sổ điểm vẫn còn nguyên, cho sinh hoạt lại là hiện lại như cũ.'}
      </p>

      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 ${
          isActive
            ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            : 'bg-sports-primary text-white hover:opacity-90'
        }`}
      >
        {isActive ? <UserMinus size={15} /> : <UserCheck size={15} />}
        {saving ? 'Đang lưu...' : isActive ? 'Cho nghỉ' : 'Cho sinh hoạt lại'}
      </button>
    </div>
  );
}
