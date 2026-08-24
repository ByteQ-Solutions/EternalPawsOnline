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

async function testPublish() {
  const supabase = createClient(url, key);
  
  const testStory = {
    slug: `test-story-publish-${Date.now().toString().slice(-4)}`,
    title: 'Test Published Story By Admin',
    subtitle: 'A test subtitle',
    excerpt: 'This is a test story to verify publish to Supabase.',
    content: 'This is the full narrative of the test story published by the admin.',
    dog_name: 'TestDog',
    dog_breed: 'Golden Mix',
    category: 'rescues',
    emotional_themes: ['heartwarming', 'inspiring'],
    hero_image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    hero_image_alt: 'Photo of TestDog',
    hero_image_credit: 'Admin Archive',
    hero_image_license: 'original_photography',
    hero_image_width: 1200,
    hero_image_height: 675,
    hero_image_aspect_ratio: '16:9',
    verification_status: 'Verified',
    verified_by: 'Elena Rostova, Fact Checker',
    confidence_score: 95,
    methodology_notes: 'Verified via official record review.',
    read_time_minutes: 3,
    location_city: 'Austin',
    location_state: 'Texas',
    location_country: 'United States',
    featured: true,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('stories').upsert(testStory, { onConflict: 'slug' }).select();
  console.log('Upsert result:');
  console.log('Error:', error);
  console.log('Inserted:', data);
}

testPublish();
