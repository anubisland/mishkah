const fs = require('fs');

const code = fs.readFileSync('scripts/inline_babel.js', 'utf8');
const lines = code.split('\n');

const hifzStart = lines.findIndex(l => l.includes("activeTab === 'hifz'"));
const tajweedStart = lines.findIndex(l => l.includes("activeTab === 'tajweed'"));

console.log('hifzStart:', hifzStart + 1, 'tajweedStart:', tajweedStart + 1);

let depth = 0;
for (let i = hifzStart; i < tajweedStart; i++) {
  const line = lines[i];
  const opens = (line.match(/<div[ >]/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += opens - closes;
  if (depth < 0) {
    console.log('Depth went negative at line ' + (i + 1) + ': ' + line);
    break;
  }
}
console.log('Final depth at tajweedStart:', depth);
