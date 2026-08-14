import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getPostBySlug } from '@/lib/posts';

const PITCH = '#3B2A1E';

export const revalidate = 60;

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <article className="pb-16 pt-12">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-semibold" style={{ color: PITCH }}>
            {post.published_at && format(new Date(post.published_at), 'dd/MM/yyyy', { locale: vi })} · {post.author_name}
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold" style={{ color: PITCH }}>{post.title}</h1>
          {post.cover_image && (
            <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden mt-6">
              <Image src={post.cover_image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
            </div>
          )}
          <div
            className="mt-8 text-sm md:text-base leading-relaxed text-foreground [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_img]:rounded-xl [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>
      </article>
    </>
  );
}
