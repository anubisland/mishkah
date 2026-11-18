const fs = require('fs');
const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('islamic-screen-pattern') || l.includes('min-h-screen') || l.includes('id="root"') || l.includes('islamic-chat-wallpaper')) {
    console.log((idx + 1) + ': ' + l.trim());
  }
});
