const { execSync } = require('child_process');
const original = execSync('git show HEAD:public/index.html', { encoding: 'utf8' });
const lines = original.split('\n');

const start = lines.findIndex(l => l.includes("hifzViewMode === 'interactive_test'"));
const end = lines.findIndex(l => l.includes("POST-RECITATION WHATSAPP BROADCAST TOOL"));

console.log('original start:', start + 1, 'end:', end + 1);

let depth = 0;
for (let i = start; i < end; i++) {
  const line = lines[i];
  const opens = (line.match(/<div[ >]/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += opens - closes;
}
console.log('Original net depth:', depth);
