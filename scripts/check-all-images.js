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
  const { data } = await supabase.from('stories').select('slug, title, hero_image_url, hero_image_credit');
  
  console.log('=== ALL STORIES IMAGE STATUS ===\n');
  for (const s of (data || [])) {
    const urlType = !s.hero_image_url ? 'MISSING' 
      : s.hero_image_url.startsWith('data:image/') ? 'BASE64 (user uploaded)' 
      : s.hero_image_url.includes('unsplash.com') ? 'STOCK (unsplash placeholder)'
      : 'URL';
    const urlLen = s.hero_image_url ? s.hero_image_url.length : 0;
    console.log(`${s.slug}`);
    console.log(`  Title: ${s.title}`);
    console.log(`  Image: ${urlType} (${urlLen} chars)`);
    console.log(`  Credit: ${s.hero_image_credit}`);
    console.log('');
  }
}

check();
