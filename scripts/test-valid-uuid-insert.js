const fs = require('fs');
const crypto = require('crypto');
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
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testInsert() {
  const supabase = createClient(url, anonKey);
  const now = new Date();
  const uuid = crypto.randomUUID();
  
  const testPayload = {
    id: uuid,
    ticket_code: 'SUB-2026-0821-TEST',
    submitter_name: 'Avish Test',
    submitter_email: 'test@example.com',
    submitter_phone: '1234567890',
    dog_name: 'Buddy',
    dog_breed: 'Golden Retriever',
    location_city: 'Colombo',
    location_state: 'Western',
    event_year: '2026',
    category: 'rescues',
    emotional_themes: ['heartwarming'],
    story_title: 'Buddy The Brave Golden Retriever',
    story_narrative: 'This is a test narrative of over fifty words to test the submission pipeline in Supabase database. Buddy was rescued from a shelter and became an emotional therapy dog for children in need. He brought so much joy and happiness to everyone in the neighborhood. We are proud of Buddy.',
    photo_name: 'buddy.jpg',
    photo_credit: 'Photo by Avish',
    license_type: 'user_submitted_verified',
    source_name: 'Local Shelter',
    source_url: 'https://example.com',
    rights_confirmed: true,
    status: 'pending_review',
    created_at: now.toISOString(),
  };

  const { data, error } = await supabase.from('story_submissions').insert(testPayload).select();
  console.log('UUID Insert Result:');
  console.log('Error:', error);
  console.log('Inserted Row:', data);
}

testInsert();
