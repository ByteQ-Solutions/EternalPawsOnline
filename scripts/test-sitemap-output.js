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

// Emulate Next.js sitemap generation
const { createClient } = require('@supabase/supabase-js');
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function test() {
  const supabase = createClient(url, key);
  const { data: stories } = await supabase.from('stories').select('slug, updated_at, published_at, featured');
  const baseUrl = 'https://eternalpaws.online';
  const now = new Date();

  console.log('Stories count:', stories ? stories.length : 0);
  (stories || []).forEach(s => {
    const dateVal = s.updated_at || s.published_at || now;
    const d = new Date(dateVal);
    const isValid = !isNaN(d.getTime());
    console.log(`URL: ${baseUrl}/stories/${s.slug} | Date: ${d.toISOString()} | Valid Date: ${isValid}`);
  });
}

test();
