'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, Copy, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Copy vào clipboard — chạy cả trên HTTP (nơi navigator.clipboard không tồn tại).
async function copyToClipboard(text: string): Promise<boolean> {
  // Ưu tiên Clipboard API (chỉ có trong secure context: HTTPS/localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // rơi xuống fallback bên dưới
    }
  }
  // Fallback cũ (deprecated nhưng chạy được trên HTTP)
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

interface MediaImage {
  name: string;
  url: string;
  size: number | null;
  created_at: string | null;
}

export default function AdminMediaPage() {
  const [images, setImages]       = useState<MediaImage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/admin/media');
    const data = await res.json();
    setImages(data.images ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) fetchImages();
    else setError(data.error || 'Upload thất bại');
  }

  async function copyLink(url: string, name: string) {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(name);
      setTimeout(() => setCopied(c => (c === name ? null : c)), 2000);
    } else {
      // Không copy tự động được (trình duyệt chặn) — cho copy tay
      window.prompt('Copy link ảnh (Ctrl+C rồi Enter):', url);
    }
  }

  async function remove(name: string) {
    if (!confirm('Xoá ảnh này khỏi kho? Nếu ảnh đang dùng trong bài viết, bài đó sẽ mất ảnh.')) return;
    await fetch(`/api/admin/media?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
    fetchImages();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kho ảnh</h1>
        <p className="text-gray-500 text-sm mt-1">Upload ảnh và copy link để dán vào bài viết. Đây là tất cả ảnh đã upload lên website.</p>
      </div>

      {/* Khu upload */}
      <div className="bg-white border-2 border-gray-200 p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="w-40 h-28 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-sports-primary hover:bg-gray-50 transition-colors shrink-0 text-gray-400">
            {uploading ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
            <span className="text-xs">{uploading ? 'Đang tải...' : 'Upload ảnh mới'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
            />
          </label>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Chọn ảnh để tải lên kho. Sau khi upload, bấm <strong>Copy link</strong> ở ảnh tương ứng rồi dán vào bài viết.</p>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <p className="text-gray-400 text-xs mt-2">JPG / PNG / WEBP / GIF · tối đa 5MB.</p>
          </div>
        </div>
      </div>

      {/* Lưới ảnh */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Đang tải...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm border border-dashed border-gray-200">
          Chưa có ảnh nào. Upload ảnh đầu tiên ở trên.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.name} className="group relative overflow-hidden border border-gray-200 bg-white">
              <div className="relative w-full aspect-[4/3]">
                <Image src={img.url} alt={img.name} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-2 flex gap-2">
                <button
                  onClick={() => copyLink(img.url, img.name)}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-colors',
                    copied === img.name ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  )}
                >
                  {copied === img.name ? <><Check size={13} /> Đã copy</> : <><Copy size={13} /> Copy link</>}
                </button>
                <button
                  onClick={() => remove(img.name)}
                  className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  title="Xoá"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
