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

async function cleanup() {
  const supabase = createClient(url, key);
  
  // 1. Delete test story
  const { error: errTest } = await supabase.from('stories').delete().eq('slug', 'test-story-publish-5937');
  console.log('Delete test-story-publish-5937:', errTest ? errTest.message : 'OK');

  // 2. Delete older duplicates of Veeta, keeping the best one
  const { error: errV1 } = await supabase.from('stories').delete().eq('slug', 'veeta-journey-6079');
  console.log('Delete veeta-journey-6079:', errV1 ? errV1.message : 'OK');

  const { error: errV2 } = await supabase.from('stories').delete().eq('slug', 'veeta-journey-2507');
  console.log('Delete veeta-journey-2507:', errV2 ? errV2.message : 'OK');

  // Keep 'veeta-disappeared-into-a-tiny-hole'

  // List final clean stories
  const { data: finalStories } = await supabase.from('stories').select('id, slug, title, published_at').order('published_at', { ascending: false });
  console.log('\n=== FINAL CLEAN SUPABASE STORIES (' + finalStories.length + ') ===');
  finalStories.forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.id}] slug="${s.slug}" | title="${s.title}"`);
  });
}

cleanup();
