const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Strengthen .font-quran CSS to be 100% bold, high-contrast black, crystal clear and crisp
const oldQuranCSS = `    /* Sacred Quranic Text strictly locked to Uthmani font */
    .font-quran, .font-quran * {
      font-family: 'Amiri Quran', 'Amiri', 'Traditional Arabic', serif !important;
      line-height: 2.3 !important;
      letter-spacing: 0.02em;
    }`;

const newQuranCSS = `    /* Sacred Quranic Text strictly locked to Uthmani font with maximum crispness and high contrast */
    .font-quran, .font-quran * {
      font-family: 'Amiri Quran', 'Amiri', 'Traditional Arabic', serif !important;
      font-weight: 700 !important;
      color: #021a12 !important;
      line-height: 2.5 !important;
      letter-spacing: 0.03em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }`;

html = html.replace(oldQuranCSS, newQuranCSS);

// 2. Enhance Ayah card contrast and font size in Hifz recitation board
html = html.replace(
  'font-quran text-2xl sm:text-3xl leading-[2.5] text-emerald-950 text-right flex flex-wrap gap-x-2 gap-y-3 items-baseline select-none',
  'font-quran text-3xl sm:text-4xl font-bold leading-[2.6] text-black text-right flex flex-wrap gap-x-2.5 gap-y-3.5 items-baseline select-none'
);

// Enhance card background to pure crisp white with noble border
html = html.replace(
  "bg-white/60 border-slate-200 hover:bg-white",
  "bg-white border-2 border-emerald-900/15 shadow-sm hover:border-gold-500/50"
);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully enhanced Quranic font contrast, sharpness, and visibility!');
