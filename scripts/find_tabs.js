const fs = require('fs');
const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes("activeTab === 'hifz'") || l.includes("activeTab === 'dashboard'")) {
    console.log((idx + 1) + ': ' + l.trim());
  }
});
