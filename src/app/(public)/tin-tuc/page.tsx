import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { getPublishedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tin tức & sự kiện — Song Thạch',
  description: 'Tin tức, sự kiện và thông báo mới nhất từ Song Thạch.',
};

export const revalidate = 60;

const PITCH      = '#0F3C2C';
const LIME_DEEP  = '#3F8F33';
const INK        = '#10150F';
const LINE       = '#E6E2D6';
const MUTED      = '#6A6F66';
const PAPER      = '#FBFAF7';

export default async function NewsListPage() {
  const posts = await getPublishedPosts(50);

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 pb-16" style={{ background: PAPER }}>
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
      <Footer />
    </>
  );
}
