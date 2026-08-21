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

const STORY_IMAGES = {
  'bentley-journey-4226': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
  'prieta-journey-0558': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
  'rio-vanished-in-oklahoma': 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1200&q=80',
  'bandit-was-lost-in-a-marsh-for-days': 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
  'rescue-dog-journey-3662': 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80'
};

async function fix() {
  // 1. Update Supabase
  if (url && key) {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('stories').select('id, slug, hero_image_url');
    if (data) {
      for (const s of data) {
        const targetUrl = STORY_IMAGES[s.slug] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80';
        const { error: upErr } = await supabase.from('stories').update({ hero_image_url: targetUrl }).eq('id', s.id);
        console.log('Updated DB story', s.slug, '->', targetUrl, upErr ? upErr.message : 'OK');
      }
    }
  }

  // 2. Update live_stories.json
  if (fs.existsSync('src/data/live_stories.json')) {
    const stories = JSON.parse(fs.readFileSync('src/data/live_stories.json', 'utf8'));
    for (const story of stories) {
      if (STORY_IMAGES[story.slug]) {
        story.heroImage = story.heroImage || {};
        story.heroImage.url = STORY_IMAGES[story.slug];
      }
    }
    fs.writeFileSync('src/data/live_stories.json', JSON.stringify(stories, null, 2), 'utf8');
    console.log('Updated live_stories.json with CDN URLs');
  }
}

fix();
