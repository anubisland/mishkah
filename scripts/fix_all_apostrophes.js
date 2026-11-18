const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// List of all english words with apostrophes in our newly added data:
const apostropheFixes = [
  ["rak'ahs", "rak\\'ahs"],
  ["rak'ah", "rak\\'ah"],
  ["Prophet's", "Prophet\\'s"],
  ["1st year AH", "1st year AH"],
  ["he never said Uff", "he never said Uff"],
  ["Allah's", "Allah\\'s"],
  ["brother's", "brother\\'s"],
  ["parents'", "parents\\'"]
];

for (const [before, after] of apostropheFixes) {
  html = html.split(before).join(after);
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed apostrophe words');
