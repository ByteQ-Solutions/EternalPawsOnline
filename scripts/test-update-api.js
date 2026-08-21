const fs = require('fs');

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

const { createClient } = require('@supabase/supabase-js');
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simulate what the fixed EditStoryModal sends and directly update via Supabase
async function testDirectUpdate() {
  const supabase = createClient(url, key);
  
  const testImageUrl = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';
  
  const { error } = await supabase
    .from('stories')
    .update({ 
      hero_image_url: testImageUrl,
      hero_image_credit: 'Test - Bandit rescue dog'
    })
    .eq('slug', 'bandit-was-lost-in-a-marsh-for-days');
  
  console.log('Direct DB update test:', error ? error.message : 'OK');
  
  const { data } = await supabase.from('stories').select('slug, hero_image_url').eq('slug', 'bandit-was-lost-in-a-marsh-for-days');
  console.log('Current Bandit image URL:', data?.[0]?.hero_image_url?.slice(0, 60));
}

testDirectUpdate();
