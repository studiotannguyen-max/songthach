// Upload ảnh tiệc cưới từ D:\songthach\Tiec Cuoi lên Storage (post-images) + gallery_images (category=wedding)
// Chạy:  node scripts/upload-wedding-gallery.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const SRC_DIR = 'D:\\songthach\\Tiec Cuoi';

// Bỏ qua file trùng nội dung đã đổi tên kiểu "(1)"
const files = readdirSync(SRC_DIR)
  .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
  .filter(f => !/\(\d+\)\.\w+$/.test(f));

console.log(`Tìm thấy ${files.length} ảnh để upload.`);

// sort_order tiếp theo trong mục wedding
const { data: last } = await supabase
  .from('gallery_images')
  .select('sort_order')
  .eq('category', 'wedding')
  .order('sort_order', { ascending: false })
  .limit(1)
  .maybeSingle();

let sortOrder = (last?.sort_order ?? 0) + 1;

for (const file of files) {
  const filePath = path.join(SRC_DIR, file);
  const buffer = readFileSync(filePath);
  const ext = path.extname(file).slice(1).toLowerCase();
  const contentType = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[ext];
  const storageName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext === 'jpeg' ? 'jpg' : ext}`;

  const { error: upErr } = await supabase.storage
    .from('post-images')
    .upload(storageName, buffer, { contentType, upsert: false });

  if (upErr) {
    console.error(`✗ ${file}: lỗi upload — ${upErr.message}`);
    continue;
  }

  const { data: pub } = supabase.storage.from('post-images').getPublicUrl(storageName);

  const { error: insErr } = await supabase.from('gallery_images').insert({
    category: 'wedding',
    url: pub.publicUrl,
    caption: null,
    sort_order: sortOrder,
  });

  if (insErr) {
    console.error(`✗ ${file}: lỗi insert DB — ${insErr.message}`);
    continue;
  }

  console.log(`✓ ${file} → ${storageName} (sort_order=${sortOrder})`);
  sortOrder++;
}

console.log('Hoàn tất.');
