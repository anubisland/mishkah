const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const startTag = '<script type="text/babel">';
const endTag = '</script>';

const sIdx = html.indexOf(startTag);
const eIdx = html.indexOf(endTag, sIdx);

const scriptContent = html.substring(sIdx + startTag.length, eIdx);
const lines = scriptContent.split('\n');

console.log('Script total lines:', lines.length);
console.log('Around script line 3347 (lines 3340 to 3355):');
console.log(lines.slice(3339, 3355).map((l, i) => (3340 + i) + ': ' + l).join('\n'));

fs.writeFileSync('scripts/inline_babel.js', scriptContent, 'utf8');
