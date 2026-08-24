async function testTranslate() {
  const title = 'Veeta Disappeared Into a Tiny Hole';
  const content = 'When elderly dog Veeta vanished down a narrow desert crevice, volunteer rescuers refused to give up.\n\nFor twelve hours, search crews worked with specialized cameras and extraction ropes.\n\nToday, Veeta is safe and warm.';

  // Google Translate free endpoint (super fast, high quality)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(content)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const translated = json[0].map(item => item[0]).join('');
    console.log('=== TRANSLATION TEST RESULT (SPANISH) ===\n');
    console.log(translated);
  } catch (err) {
    console.error('Error:', err);
  }
}

testTranslate();
