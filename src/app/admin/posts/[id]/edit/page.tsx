import { createAdminClient } from '@/lib/supabase/admin';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts').select('*').eq('id', params.id).single();

  if (error || !data) notFound();

  return <PostForm initial={data} />;
}
