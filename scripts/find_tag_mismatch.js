const fs = require('fs');

const code = fs.readFileSync('scripts/inline_babel.js', 'utf8');
const lines = code.split('\n');

const hifzStart = lines.findIndex(l => l.includes("activeTab === 'hifz'"));
const tajweedStart = lines.findIndex(l => l.includes("activeTab === 'tajweed'"));

// We can check stack of tags
let stack = [];
for (let i = hifzStart; i < tajweedStart; i++) {
  const line = lines[i];
  // Match tags
  const tags = line.match(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g) || [];
  for (const tag of tags) {
    if (tag.startsWith('</')) {
      const tagName = tag.match(/<\/([a-zA-Z0-9]+)>/)[1];
      const popped = stack.pop();
      if (popped?.name !== tagName) {
        console.log('MISMATCH at line ' + (i+1) + ': expected </' + popped?.name + '> (from line ' + popped?.line + ') but got ' + tag);
      }
    } else if (!tag.endsWith('/>') && !tag.startsWith('<img') && !tag.startsWith('<input') && !tag.startsWith('<br') && !tag.startsWith('<hr')) {
      const match = tag.match(/<([a-zA-Z0-9]+)/);
      if (match) {
        stack.push({ name: match[1], line: i + 1 });
      }
    }
  }
}

console.log('Remaining unclosed tags in stack:');
stack.forEach(s => console.log('Line ' + s.line + ': <' + s.name + '>'));
