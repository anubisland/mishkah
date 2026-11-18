const fs = require('fs');
const lines = fs.readFileSync('public/index.html', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes("activeTab === 'tajweed'"));
console.log('Tajweed starts at line:', start);
for (let i = start; i < Math.min(lines.length, start + 70); i++) {
  console.log(i + ': ' + lines[i]);
}
