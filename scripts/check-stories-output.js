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

async function check() {
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('stories').select('slug, title, hero_image_url');
  console.log('Supabase stories:');
  for (const s of (data || [])) {
    console.log({
      slug: s.slug,
      title: s.title,
      urlPrefix: s.hero_image_url ? s.hero_image_url.slice(0, 50) : 'NULL',
      urlLength: s.hero_image_url ? s.hero_image_url.length : 0
    });
  }

  const live = JSON.parse(fs.readFileSync('src/data/live_stories.json', 'utf8'));
  console.log('live_stories.json stories:');
  for (const s of live) {
    console.log({
      slug: s.slug,
      title: s.title,
      urlPrefix: s.heroImage?.url ? s.heroImage.url.slice(0, 50) : 'NULL',
      urlLength: s.heroImage?.url ? s.heroImage.url.length : 0
    });
  }
}

check();
