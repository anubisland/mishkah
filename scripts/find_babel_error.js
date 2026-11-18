const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sIdx = html.indexOf('<script type="text/babel">');
const eIdx = html.indexOf('</script>', sIdx);
const script = html.slice(sIdx + '<script type="text/babel">'.length, eIdx);
const lines = script.split('\n');

let braceCount = 0;
let appLine = lines.findIndex(l => l.includes('function App('));
console.log('function App is at line:', appLine + 1);

for (let i = appLine; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/\{/g) || []).length;
  const closes = (line.match(/\}/g) || []).length;
  braceCount += (opens - closes);
  if (braceCount <= 0) {
    console.log(`Braces hit <= 0 at line ${i + 1} (count=${braceCount}): ${line.trim()}`);
    for(let j = Math.max(0, i-5); j <= Math.min(lines.length-1, i+5); j++) {
      console.log(`  [${j+1}] ${lines[j]}`);
    }
    break;
  }
}
