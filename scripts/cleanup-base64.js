const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

let env = {};
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const parts = line.split('=');
    const k = parts[0];
    const v = parts.slice(1).join('=');
    if (k && v) {
      env[k.trim()] = v.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  if (!url || !key) {
    console.log('No Supabase credentials found.');
    return;
  }
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('stories').select('id, slug, hero_image_url');
  if (error) {
    console.error('Supabase query error:', error);
    return;
  }
  for (const s of (data || [])) {
    if (s.hero_image_url && s.hero_image_url.startsWith('data:image/')) {
      const newUrl = '/images/stories/' + s.slug + '.jpg';
      const { error: upErr } = await supabase.from('stories').update({ hero_image_url: newUrl }).eq('id', s.id);
      console.log('Updated story', s.slug, 'to', newUrl, upErr ? upErr.message : 'SUCCESS');
    } else {
      console.log('Story', s.slug, 'has URL:', s.hero_image_url);
    }
  }
}

run();
