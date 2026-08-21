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

async function checkStorage() {
  const supabase = createClient(url, key);
  const { data: buckets, error } = await supabase.storage.listBuckets();
  console.log('Existing buckets:', buckets, 'Error:', error);

  // If story-media doesn't exist, create it as a public bucket!
  const hasStoryMedia = buckets && buckets.some(b => b.name === 'story-media' || b.name === 'story-images');
  if (!hasStoryMedia) {
    const { data: newBucket, error: createErr } = await supabase.storage.createBucket('story-media', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg']
    });
    console.log('Created public story-media bucket:', newBucket, createErr);
  } else {
    console.log('Public storage bucket already exists!');
  }
}

checkStorage();
