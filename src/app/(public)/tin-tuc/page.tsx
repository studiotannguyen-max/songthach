import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getPublishedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tin tức & sự kiện — Song Thạch',
  description: 'Tin tức, sự kiện và thông báo mới nhất từ Song Thạch.',
};

export const revalidate = 60;

const PITCH      = '#3B2A1E';
const LIME_DEEP  = '#A33E1F';
const INK        = '#3B2A1E';
const LINE       = '#E6E2D6';
const MUTED      = '#8A6E54';
const PAPER      = '#FFFBF2';

export default async function NewsListPage() {
  const posts = await getPublishedPosts(50);

  return (
    <>
      <div className="pb-16 pt-12" style={{ background: PAPER }}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <h1 className="font-bold tracking-tight mb-10" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(28px,4vw,42px)', color: INK }}>
          Tin tức &amp; sự kiện
        </h1>

        {posts.length === 0 ? (
          <p className="text-sm" style={{ color: MUTED }}>Chưa có tin tức nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/tin-tuc/${post.slug}`}
                className="block rounded-[14px] overflow-hidden border transition-transform hover:-translate-y-1"
                style={{ background: '#fff', borderColor: LINE }}
              >
                <div className="relative h-[172px]" style={{ background: '#ece7da' }}>
                  {post.cover_image && (
                    <Image src={post.cover_image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  )}
                </div>
                <div className="p-5">
                  {post.published_at && (
                    <div className="text-[11.5px] font-semibold mb-2" style={{ color: LIME_DEEP }}>
                      {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: vi })}
                    </div>
                  )}
                  <h2 className="font-semibold text-[17.5px] leading-snug mb-2" style={{ fontFamily: 'var(--font-bricolage)', color: INK }}>{post.title}</h2>
                  {post.excerpt && <p className="text-sm" style={{ color: MUTED }}>{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
