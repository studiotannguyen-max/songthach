'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const CATEGORY_LABEL: Record<string, { label: string; cls: string }> = {
  general:   { label: 'Tin chung',    cls: 'bg-gray-100 text-gray-700'    },
  football:  { label: 'Bóng đá',      cls: 'bg-green-100 text-green-700'  },
  badminton: { label: 'Cầu lông',     cls: 'bg-blue-100 text-blue-700'    },
  wedding:   { label: 'Tiệc cưới',    cls: 'bg-pink-100 text-pink-700'    },
  cafe:      { label: 'Café Lavie',   cls: 'bg-amber-100 text-amber-700'  },
  promotion: { label: 'Khuyến mãi',   cls: 'bg-orange-100 text-orange-700'},
};

export default function AdminPostsPage() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState<'all' | 'published' | 'draft'>('all');
  const [search,  setSearch]  = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    const res  = await fetch(`/api/admin/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, [status]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function deletePost(id: string) {
    if (!confirm('Xoá bài viết này? Không thể khôi phục.')) return;
    setDeleting(id);
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    await fetchPosts();
    setDeleting(null);
  }

  async function toggleStatus(post: Post) {
    const next = post.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/admin/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    fetchPosts();
  }

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const counts = {
    all:       posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft:     posts.filter(p => p.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài viết & Tin tức</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} bài viết</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-sports-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all"
        >
          <Plus size={17} /> Viết bài mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sports-primary/30 focus:border-sports-primary"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                status === s
                  ? 'bg-sports-primary border-sports-primary text-white'
                  : 'border-gray-200 text-gray-600 hover:border-sports-primary/40',
              )}
            >
              {s === 'all' ? 'Tất cả' : s === 'published' ? 'Đã đăng' : 'Bản nháp'}
              <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
            </button>
          ))}
          <button onClick={fetchPosts} className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <RefreshCw size={20} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-25" />
          <p className="text-sm">Chưa có bài viết nào</p>
          <Link href="/admin/posts/new" className="inline-block mt-4 text-sports-primary text-sm font-semibold hover:underline">
            + Viết bài đầu tiên
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => {
            const cat = CATEGORY_LABEL[post.category] ?? CATEGORY_LABEL.general;
            return (
              <div key={post.id} className="bg-white border-2 border-gray-200 p-4 flex gap-4 transition-shadow">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-28 sm:h-20 overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={post.title} width={112} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={24} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', cat.cls)}>{cat.label}</span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
                    )}>
                      {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-1.5 leading-snug line-clamp-1">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">
                    {format(new Date(post.created_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleStatus(post)}
                    title={post.status === 'published' ? 'Gỡ xuống nháp' : 'Đăng bài'}
                    className={cn(
                      'p-2 rounded-xl border transition-all',
                      post.status === 'published'
                        ? 'border-green-200 text-green-600 hover:bg-green-50'
                        : 'border-gray-200 text-gray-400 hover:bg-gray-50',
                    )}
                  >
                    {post.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    {deleting === post.id
                      ? <RefreshCw size={16} className="animate-spin" />
                      : <Trash2 size={16} />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
