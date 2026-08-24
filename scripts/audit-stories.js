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

async function audit() {
  const supabase = createClient(url, key);
  const { data: dbStories, error } = await supabase.from('stories').select('id, slug, title, published_at, created_at').order('published_at', { ascending: false });
  
  console.log('=== SUPABASE STORIES (' + (dbStories ? dbStories.length : 0) + ') ===');
  if (error) console.error('Supabase error:', error);
  (dbStories || []).forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.id}] slug="${s.slug}" | title="${s.title}" | pub=${s.published_at}`);
  });

  const localFile = 'src/data/live_stories.json';
  if (fs.existsSync(localFile)) {
    const local = JSON.parse(fs.readFileSync(localFile, 'utf8'));
    console.log('\n=== LOCAL live_stories.json (' + local.length + ') ===');
    local.forEach((s, idx) => {
      console.log(`${idx + 1}. [${s.id}] slug="${s.slug}" | title="${s.title}" | pub=${s.publishedAt || s.published_at}`);
    });
  }
}

audit();
