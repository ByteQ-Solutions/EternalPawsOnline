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

async function restore() {
  const supabase = createClient(url, key);
  
  if (fs.existsSync('public/images/stories/bentley-journey-4226.jpg')) {
    const bBuf = fs.readFileSync('public/images/stories/bentley-journey-4226.jpg');
    const bBase64 = 'data:image/jpeg;base64,' + bBuf.toString('base64');
    const { error: bErr } = await supabase.from('stories').update({ hero_image_url: bBase64 }).eq('slug', 'bentley-journey-4226');
    console.log('Restored Bentley original image to DB:', bErr ? bErr.message : 'OK');
  }

  if (fs.existsSync('public/images/stories/prieta-journey-0558.jpg')) {
    const pBuf = fs.readFileSync('public/images/stories/prieta-journey-0558.jpg');
    const pBase64 = 'data:image/jpeg;base64,' + pBuf.toString('base64');
    const { error: pErr } = await supabase.from('stories').update({ hero_image_url: pBase64 }).eq('slug', 'prieta-journey-0558');
    console.log('Restored Prieta original image to DB:', pErr ? pErr.message : 'OK');
  }
}

restore();
