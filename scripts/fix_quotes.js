const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Fix shaa'a
html = html.replace(`textEn: 'Saying: "Qaddar Allahu wa maa shaa\\'a fa\\'ala"'`, `textEn: "Saying: \\"Qaddar Allahu wa maa shaa'a fa'ala\\""`);
html = html.replace(`textEn: 'Saying: "Qaddar Allahu wa maa shaa'a fa'ala"'`, `textEn: "Saying: \\"Qaddar Allahu wa maa shaa'a fa'ala\\""`);

// Check if there are other quotes like shaa'a or Mas'ud or ra'aita
html = html.replace(/shaa'a/g, `shaa\\'a`);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed quotes in public/index.html');
