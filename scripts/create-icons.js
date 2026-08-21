const fs = require('fs');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="#1B3B2B"/>
  <circle cx="11" cy="11" r="2.5" fill="#E5A93C"/>
  <circle cx="21" cy="11" r="2.5" fill="#E5A93C"/>
  <circle cx="8" cy="17" r="2" fill="#E5A93C"/>
  <circle cx="24" cy="17" r="2" fill="#E5A93C"/>
  <path d="M16 16c-3 0-5 2.5-5 5 0 2 2 3 5 3s5-1 5-3c0-2.5-2-5-5-5z" fill="#E5A93C"/>
</svg>`;

if (!fs.existsSync('public')) fs.mkdirSync('public', { recursive: true });
if (!fs.existsSync('app')) fs.mkdirSync('app', { recursive: true });

fs.writeFileSync('public/icon.svg', svgIcon, 'utf8');
fs.writeFileSync('app/icon.svg', svgIcon, 'utf8');
fs.writeFileSync('public/favicon.ico', Buffer.from(svgIcon, 'utf8'));

console.log('Icons written cleanly to public/ and app/!');
