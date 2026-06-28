'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2, Eye, EyeOff, Loader2, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'badminton' | 'football' | 'wedding' | 'cafe';

const TABS: { key: Category; label: string; hint: string }[] = [
  { key: 'badminton', label: 'Sân Cầu lông', hint: 'Ảnh sân cầu lông hiển thị ở trang Sân Cầu lông' },
  { key: 'football',  label: 'Sân Bóng đá',  hint: 'Ảnh sân bóng hiển thị ở trang Sân Bóng đá'     },
  { key: 'wedding',   label: 'Tiệc cưới',    hint: 'Ảnh sảnh tiệc hiển thị ở trang Tiệc cưới'       },
  { key: 'cafe',      label: 'Café Lavie',   hint: 'Ảnh/logo Café Lavie hiển thị ở trang chủ'       },
];

interface GalleryImage {
  id: string;
  category: Category;
  url: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminGalleryPage() {
  const [active, setActive]   = useState<Category>('badminton');
  const [images, setImages]   = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Trạng thái upload tấm mới
  const [pendingUrl, setPendingUrl] = useState('');
  const [caption, setCaption]       = useState('');
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const res  = await fetch(`/api/admin/gallery?category=${active}`);
    const data = await res.json();
    setImages(data.images ?? []);
    setLoading(false);
  }, [active]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setPendingUrl(data.url);
    else setError(data.error || 'Upload thất bại');
  }

  async function addImage() {
    if (!pendingUrl) return;
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: active, url: pendingUrl, caption }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setPendingUrl('');
      setCaption('');
      fetchImages();
    } else {
      setError(data.error || 'Lưu thất bại');
    }
  }

  async function toggleActive(img: GalleryImage) {
    await fetch(`/api/admin/gallery/${img.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !img.is_active }),
    });
    fetchImages();
  }

  async function remove(id: string) {
    if (!confirm('Xoá ảnh này khỏi thư viện?')) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    fetchImages();
  }

  const tab = TABS.find(t => t.key === active)!;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thư viện ảnh</h1>
        <p className="text-gray-500 text-sm mt-1">Upload ảnh và phân vào từng mục — ảnh sẽ hiển thị ở trang tương ứng ngoài website.</p>
      </div>

      {/* Tabs mục */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              active === t.key ? 'bg-sports-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4">{tab.hint}</p>

      {/* Khu upload tấm mới */}
      <div className="bg-white border-2 border-gray-200 p-5 mb-8">
        <p className="font-semibold text-gray-800 text-sm mb-3">Thêm ảnh vào mục “{tab.label}”</p>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Ô upload / preview */}
          {pendingUrl ? (
            <div className="relative w-40 h-28 overflow-hidden border border-gray-200 shrink-0">
              <Image src={pendingUrl} alt="Ảnh sắp thêm" fill sizes="160px" className="object-cover" />
              <button
                onClick={() => setPendingUrl('')}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                aria-label="Bỏ ảnh"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="w-40 h-28 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-sports-primary hover:bg-gray-50 transition-colors shrink-0 text-gray-400">
              {uploading ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
              <span className="text-xs">{uploading ? 'Đang tải...' : 'Chọn ảnh'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>
          )}

          <div className="flex-1 flex flex-col gap-3">
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Chú thích (tuỳ chọn) — vd: Sảnh Grand, Sân số 1..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/40"
              maxLength={150}
            />
            <button
              onClick={addImage}
              disabled={!pendingUrl || saving}
              className="self-start inline-flex items-center gap-2 bg-sports-primary text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              Thêm vào mục này
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <p className="text-gray-400 text-xs">JPG / PNG / WEBP · tối đa 5MB.</p>
          </div>
        </div>
      </div>

      {/* Lưới ảnh hiện có */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Đang tải...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm border border-dashed border-gray-200">
          Chưa có ảnh nào trong mục này. Upload ảnh đầu tiên ở trên.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className={cn('group relative overflow-hidden border bg-white', img.is_active ? 'border-gray-200' : 'border-gray-200 opacity-50')}>
              <div className="relative w-full aspect-[4/3]">
                <Image src={img.url} alt={img.caption || 'Ảnh thư viện'} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{img.caption || <span className="text-gray-300">Không chú thích</span>}</p>
              </div>
              {/* Hành động */}
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleActive(img)}
                  className="bg-black/60 text-white rounded-lg p-1.5 hover:bg-black"
                  title={img.is_active ? 'Đang hiện — bấm để ẩn' : 'Đang ẩn — bấm để hiện'}
                >
                  {img.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => remove(img.id)}
                  className="bg-red-500/80 text-white rounded-lg p-1.5 hover:bg-red-600"
                  title="Xoá"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
