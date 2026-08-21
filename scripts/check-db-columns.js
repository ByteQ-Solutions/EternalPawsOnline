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
  const { data, error } = await supabase.from('stories').select('*').limit(1);
  if (data && data.length > 0) {
    const row = data[0];
    console.log('All DB columns for first story:');
    for (const [key, val] of Object.entries(row)) {
      const display = typeof val === 'string' && val.length > 60 ? val.slice(0, 60) + '...' : val;
      console.log(`  ${key}: ${display}`);
    }
  }
  console.log('Error:', error);
}

check();
