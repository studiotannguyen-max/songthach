import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getPostBySlug } from '@/lib/posts';
import { Breadcrumb } from '@/components/ui';

export const revalidate = 60;

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="py-12 md:py-16">
      <div className="container-page max-w-[720px]">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Tin tức',   href: '/tin-tuc' },
            { label: post.title },
          ]}
        />

        {/* Tiêu đề bài viết không in hoa — tiêu đề tiếng Việt dài, in hoa khó đọc */}
        <h1 className="mt-6 text-[clamp(28px,4vw,40px)] normal-case">{post.title}</h1>

        <p className="mt-3 text-sm text-fg-muted">
          {post.published_at && format(new Date(post.published_at), 'dd/MM/yyyy', { locale: vi })}
          {post.author_name ? ` · ${post.author_name}` : ''}
        </p>

        {post.cover_image && (
          <div className="relative mt-8 rounded border border-line overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={post.cover_image} alt="" fill
              sizes="(max-width: 768px) 100vw, 720px" className="object-cover" priority
            />
          </div>
        )}

        <div
          className="prose-song mt-8"
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />
      </div>
    </article>
  );
}
