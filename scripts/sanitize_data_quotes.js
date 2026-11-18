const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Find the block between ISLAMIC_BRANCH_WORKSHEETS and PRELOADED_HIFZ_PASSAGES
const startMarker = '// ================= BRANCH 3: ISLAMIC STUDIES WORKSHEETS (DATA) =================';
const endMarker = 'const PRELOADED_HIFZ_PASSAGES = [';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  let block = html.substring(startIdx, endIdx);
  
  // Replace all textEn: '...' with double quotes, escaping any inner double quotes
  block = block.replace(/textEn:\s*'([^']*(?:\\'[^']*)*)'/g, (match, p1) => {
    const unescaped = p1.replace(/\\'/g, "'");
    const jsonStr = JSON.stringify(unescaped);
    return `textEn: ${jsonStr}`;
  });
  
  // Replace questionEn: '...' with double quotes
  block = block.replace(/questionEn:\s*'([^']*(?:\\'[^']*)*)'/g, (match, p1) => {
    const unescaped = p1.replace(/\\'/g, "'");
    const jsonStr = JSON.stringify(unescaped);
    return `questionEn: ${jsonStr}`;
  });

  // Replace titleEn: '...' with double quotes
  block = block.replace(/titleEn:\s*'([^']*(?:\\'[^']*)*)'/g, (match, p1) => {
    const unescaped = p1.replace(/\\'/g, "'");
    const jsonStr = JSON.stringify(unescaped);
    return `titleEn: ${jsonStr}`;
  });

  // Replace categoryEn: '...' with double quotes
  block = block.replace(/categoryEn:\s*'([^']*(?:\\'[^']*)*)'/g, (match, p1) => {
    const unescaped = p1.replace(/\\'/g, "'");
    const jsonStr = JSON.stringify(unescaped);
    return `categoryEn: ${jsonStr}`;
  });

  html = html.substring(0, startIdx) + block + html.substring(endIdx);
  fs.writeFileSync('public/index.html', html, 'utf8');
  console.log('Sanitized all English strings into JSON double-quoted strings!');
} else {
  console.error('Markers not found!');
}
