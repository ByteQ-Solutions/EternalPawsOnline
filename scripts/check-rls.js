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
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function check() {
  const supabase = createClient(url, key);
  
  // Test reading from tables
  const { data: sData, error: sErr } = await supabase.from('stories').select('id').limit(1);
  console.log('stories SELECT:', sErr ? sErr.message : 'OK (' + sData.length + ')');

  const { data: subData, error: subErr } = await supabase.from('story_submissions').select('id').limit(1);
  console.log('story_submissions SELECT:', subErr ? subErr.message : 'OK (' + subData.length + ')');

  const { data: nlData, error: nlErr } = await supabase.from('newsletter_subscribers').select('id').limit(1);
  console.log('newsletter_subscribers SELECT:', nlErr ? nlErr.message : 'OK (' + nlData.length + ')');

  const { data: cData, error: cErr } = await supabase.from('correction_tickets').select('id').limit(1);
  console.log('correction_tickets SELECT:', cErr ? cErr.message : 'OK (' + cData.length + ')');
}

check();
