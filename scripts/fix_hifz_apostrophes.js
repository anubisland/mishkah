const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const additionalFixes = [
  ["As-Sa'eer", "As-Sa\\'eer"],
  ["ansha'akum", "ansha\\'akum"],
  ["Ma'een", "Ma\\'een"]
];

for (const [before, after] of additionalFixes) {
  html = html.split(before).join(after);
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed hifz quiz transliteration apostrophes');
