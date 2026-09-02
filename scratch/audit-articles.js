const fs = require('fs');
const path = require('path');

// Read wellness.ts
const wellnessPath = path.join(__dirname, '../src/lib/data/wellness.ts');
const wellnessContent = fs.readFileSync(wellnessPath, 'utf8');

// Read food-safety.ts
const foodSafetyPath = path.join(__dirname, '../src/lib/data/food-safety.ts');
const foodSafetyContent = fs.readFileSync(foodSafetyPath, 'utf8');

console.log('=== AUDITING WELLNESS & FOOD SAFETY ASSETS ===\n');

// Extract guides roughly
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Check total size
console.log('wellness.ts line count:', wellnessContent.split('\n').length);
console.log('food-safety.ts line count:', foodSafetyContent.split('\n').length);

console.log('\n--- 3 NEW CANINE PSYCHOLOGY GUIDES AUDIT ---');
const guides = [
  'why-does-my-dog-sleep-between-my-legs',
  'why-do-dogs-put-their-paw-on-you',
  'why-does-my-dog-sigh-when-laying-down',
];

for (const slug of guides) {
  const index = wellnessContent.indexOf(`slug: '${slug}'`);
  if (index === -1) {
    console.log(`❌ ERROR: ${slug} NOT FOUND`);
    continue;
  }
  // Extract chunk
  const nextChunk = wellnessContent.substring(index, index + 4500);
  const words = countWords(nextChunk);
  console.log(`✅ ${slug}: ~${words} words raw definition`);
}

console.log('\n--- 3 NEW FOOD SAFETY ITEMS AUDIT ---');
const foods = ['mango', 'dragon-fruit', 'pistachios'];
for (const slug of foods) {
  const index = foodSafetyContent.indexOf(`slug: '${slug}'`);
  if (index === -1) {
    console.log(`❌ ERROR: ${slug} NOT FOUND`);
    continue;
  }
  const nextChunk = foodSafetyContent.substring(index, index + 3500);
  const words = countWords(nextChunk);
  console.log(`✅ ${slug}: ~${words} words raw definition`);
}
