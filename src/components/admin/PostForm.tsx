'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  Save, Send, ArrowLeft, ImagePlus, X, Loader2, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PostEditor = dynamic(() => import('./PostEditor'), { ssr: false });

interface PostData {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  status: string;
  author_name: string;
}

const CATEGORIES = [
  { value: 'general',   label: 'Tin chung'   },
  { value: 'football',  label: 'Bóng đá'     },
  { value: 'badminton', label: 'Cầu lông'    },
  { value: 'wedding',   label: 'Tiệc cưới'   },
  { value: 'cafe',      label: 'Café Lavie'  },
  { value: 'promotion', label: 'Khuyến mãi'  },
];

export default function PostForm({ initial }: { initial?: Partial<PostData> }) {
  const router   = useRouter();
  const coverRef = useRef<HTMLInputElement>(null);
  const isEdit   = !!initial?.id;

  const [form, setForm] = useState<PostData>({
    title:       initial?.title       ?? '',
    excerpt:     initial?.excerpt     ?? '',
    content:     initial?.content     ?? '',
    cover_image: initial?.cover_image ?? '',
    category:    initial?.category    ?? 'general',
    status:      initial?.status      ?? 'draft',
    author_name: initial?.author_name ?? 'Admin',
  });

  const [saving,          setSaving]          = useState(false);
  const [uploadingCover,  setUploadingCover]  = useState(false);
  const [error,           setError]           = useState('');

  function update(field: keyof PostData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function uploadCover(file: File) {
    setUploadingCover(true);
    const fd = new FormData();
    fd.append('file', file);
    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploadingCover(false);
    if (data.url) update('cover_image', data.url);
  }

  async function save(publishStatus?: 'draft' | 'published') {
    if (!form.title.trim()) { setError('Vui lòng nhập tiêu đề'); return; }
    setSaving(true);
    setError('');

    const payload = { ...form, status: publishStatus ?? form.status };
    const url     = isEdit ? `/api/admin/posts/${initial!.id}` : '/api/admin/posts';
    const method  = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? 'Lỗi khi lưu'); return; }

    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {form.status === 'published' ? 'Đang hiển thị' : 'Bản nháp'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Lưu nháp
          </button>
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 gradient-sports rounded-xl text-sm text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {form.status === 'published' ? 'Cập nhật' : 'Đăng bài'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Editor */}
        <div className="xl:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Tiêu đề bài viết..."
            className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-0 border-b-2 border-gray-100 focus:border-sports-primary focus:outline-none py-3 transition-colors bg-transparent"
          />

          {/* Excerpt */}
          <textarea
            value={form.excerpt}
            onChange={e => update('excerpt', e.target.value)}
            placeholder="Mô tả ngắn (hiển thị ngoài trang chủ)..."
            rows={2}
            className="w-full text-sm text-gray-600 placeholder-gray-300 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary resize-none"
          />

          {/* Rich text editor */}
          <PostEditor
            content={form.content}
            onChange={v => update('content', v)}
          />
        </div>

        {/* Right: Settings */}
        <div className="space-y-4">
          {/* Cover image */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Ảnh bìa</p>
            {form.cover_image ? (
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <Image src={form.cover_image} alt="Ảnh bìa" fill className="object-cover" />
                <button
                  onClick={() => update('cover_image', '')}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverRef.current?.click()}
                disabled={uploadingCover}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-sports-primary/50 hover:bg-gray-50 transition-all text-gray-400"
              >
                {uploadingCover
                  ? <Loader2 size={24} className="animate-spin" />
                  : <ImagePlus size={24} />
                }
                <span className="text-xs">{uploadingCover ? 'Đang tải lên...' : 'Nhấn để chọn ảnh'}</span>
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) uploadCover(e.target.files[0]); e.target.value = ''; }}
            />
            <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP · Tối đa 5MB</p>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Chuyên mục</p>
            <div className="relative">
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary pr-10"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Author */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Tác giả</p>
            <input
              type="text"
              value={form.author_name}
              onChange={e => update('author_name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
            />
          </div>

          {/* Status toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Trạng thái</p>
            <div className="grid grid-cols-2 gap-2">
              {(['draft', 'published'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => update('status', s)}
                  className={cn(
                    'py-2 rounded-xl text-sm font-medium border-2 transition-all',
                    form.status === s
                      ? s === 'published'
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-400 bg-gray-700 text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  )}
                >
                  {s === 'published' ? 'Đăng ngay' : 'Nháp'}
                </button>
              ))}
            </div>
          </div>

          {/* Save buttons (bottom) */}
          <div className="space-y-2">
            <button
              onClick={() => save('published')}
              disabled={saving}
              className="w-full py-3 gradient-sports rounded-xl text-sm text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {form.status === 'published' ? 'Cập nhật bài viết' : 'Đăng bài'}
            </button>
            <button
              onClick={() => save('draft')}
              disabled={saving}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} /> Lưu nháp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
