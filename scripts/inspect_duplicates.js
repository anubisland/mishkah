const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const target = "activeTab === 'hifz'";
let pos = 0;
let occurrences = [];
while ((pos = html.indexOf(target, pos)) !== -1) {
  occurrences.push(pos);
  pos += target.length;
}
console.log('Occurrences of activeTab === hifz:', occurrences);

// Let's see what precedes each occurrence
occurrences.forEach((idx, i) => {
  console.log(`\n=== Occurrence ${i+1} at index ${idx} ===`);
  console.log('Before:', JSON.stringify(html.slice(Math.max(0, idx - 80), idx)));
  console.log('After start:', JSON.stringify(html.slice(idx, idx + 120)));
});
