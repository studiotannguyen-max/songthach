import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getPublishedPosts } from '@/lib/posts';
import { PageHero, Card, CardBody } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Tin tức & sự kiện — Song Thạch',
  description: 'Tin tức, sự kiện và thông báo mới nhất từ Song Thạch.',
};

export const revalidate = 60;

export default async function NewsListPage() {
  const posts = await getPublishedPosts(50);

  return (
    <>
      <PageHero
        label="Song Thạch"
        title="Tin tức &amp; sự kiện"
        description="Thông báo, sự kiện và những gì đang diễn ra tại tổ hợp."
      />

      <section className="section">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-fg-muted">Chưa có tin tức nào.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id}>
                  <Link href={`/tin-tuc/${post.slug}`} className="block">
                    <div className="relative w-full bg-bg-subtle" style={{ aspectRatio: '16/10' }}>
                      {post.cover_image && (
                        <Image
                          src={post.cover_image} alt="" fill
                          sizes="(max-width: 768px) 100vw, 33vw" className="object-cover"
                        />
                      )}
                    </div>
                    <CardBody>
                      {post.published_at && (
                        <div className="text-xs font-semibold text-brand-strong mb-2">
                          {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      )}
                      <h2 className="text-lg leading-snug normal-case">{post.title}</h2>
                      {post.excerpt && <p className="text-sm text-fg-muted mt-2">{post.excerpt}</p>}
                    </CardBody>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
