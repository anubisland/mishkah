const fs = require('fs');
const lines = fs.readFileSync('public/index.html', 'utf8').split('\n');
for (let i = 2772; i < Math.min(lines.length, 2850); i++) {
  console.log(i + ': ' + lines[i]);
}
