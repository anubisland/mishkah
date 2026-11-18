const fs = require('fs');
const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes("activeTab === 'hifz'"));
const end = lines.findIndex(l => l.includes("activeTab === 'tajweed'"));
console.log('Hifz starts at line:', start + 1, 'and Tajweed starts at line:', end + 1);
