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

async function sync() {
  const supabase = createClient(url, key);
  const { data: dbStories } = await supabase.from('stories').select('*');
  
  if (dbStories && dbStories.length > 0) {
    if (fs.existsSync('src/data/live_stories.json')) {
      const live = JSON.parse(fs.readFileSync('src/data/live_stories.json', 'utf8'));
      for (const item of live) {
        const matching = dbStories.find(s => s.slug === item.slug);
        if (matching && matching.hero_image_url) {
          item.heroImage = item.heroImage || {};
          item.heroImage.url = matching.hero_image_url;
        }
      }
      fs.writeFileSync('src/data/live_stories.json', JSON.stringify(live, null, 2), 'utf8');
      console.log('Synced live_stories.json with Supabase images!');
    }
  }
}

sync();
