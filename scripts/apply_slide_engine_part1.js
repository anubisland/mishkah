const fs = require('fs');
const babelParser = require('@babel/parser');

console.log('Reading public/index.html...');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Locate and inspect the functions to replace:
// cleanSlideTitle, extractConciseSlideBullets, handleProcessCustomLecture, handleExportIslamicPowerPoint

// Replace cleanSlideTitle and extractConciseSlideBullets
const oldBulletsStart = html.indexOf('function cleanSlideTitle(rawTitle) {');
const oldBulletsEnd = html.indexOf('function handleProcessCustomLecture() {');

if (oldBulletsStart === -1 || oldBulletsEnd === -1) {
  console.error('Could not find cleanSlideTitle or handleProcessCustomLecture');
  process.exit(1);
}

const newSlideHelpers = `function cleanSlideTitle(rawTitle) {
        if (!rawTitle) return 'محور الدرس';
        let t = rawTitle.replace(/^(?:المحور \\d+[:\\s]*|Theme \\d+[:\\s]*)/, '').trim();
        t = t.replace(/(?:تأليف|للمؤلف|دار|نشر|صفحة|طبعة|تحقيق|إعداد|ردمك|ISBN)[\\s\\S]*$/, '').trim();
        t = t.replace(/[:\\-–—].*$/, '').trim();
        if (t.length > 55) t = t.substring(0, 52) + '...';
        return t || 'محور الدرس ومسائله';
      }

      // Professional Slide Distiller: Converts text into 3 articulate, substantive scholarly bullets
      function extractConciseSlideBullets(lines, secTitle) {
        const bullets = [];
        const isNoiseLine = (t) => /^(?:ملاحظة منهجية|هذا الملخص|نسخة ممسوحة|التعرف على نصوصها|أخطاء طباعية|دار النشر|دار الوعي|طبعة ورقية|ملحق تعقيبي|ردمك|ISBN|\\(?\\d+\\s*صفحة\\)?)/i.test(t);

        for (const line of lines) {
          const clean = line.replace(/^[#*\\-•\\s\\d\\.\\)\\:،]+/, '').trim();
          if (!clean || isNoiseLine(clean)) continue;

          // Split ONLY on sentence boundaries (period, newline, semicolon), NEVER commas!
          const sentences = clean.split(/[.\\n؛]/).map(s => s.trim()).filter(s => s.length >= 28);
          for (let s of sentences) {
            if (isNoiseLine(s)) continue;
            if (/^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|المبحث|المطلب|الفصل|الباب|المحور|القسم)/.test(s)) continue;

            // Handle long sentences gracefully without destroying meaning
            if (s.length > 115) {
              const subClauses = s.split(/(?:\\s+بل\\s+|\\s+حيث\\s+|\\s+كما\\s+|\\s+إذ\\s+)/).map(c => c.trim()).filter(c => c.length >= 28 && c.length <= 115);
              if (subClauses.length > 0) {
                s = subClauses[0];
              } else {
                s = s.substring(0, 110).trim() + '...';
              }
            }

            if (!bullets.includes(s)) {
              bullets.push(s);
              if (bullets.length >= 3) break;
            }
          }
          if (bullets.length >= 3) break;
        }

        const baseTitle = cleanSlideTitle(secTitle);
        if (bullets.length === 0) {
          bullets.push(\`تحرير ومناقشة أبعاد: \${baseTitle}\`);
          bullets.push('بيان الضوابط الشرعية والقواعد المنهجية الحاكمة للمسألة');
          bullets.push('الأثر السلوكي والواجب المنهجي المنضبط في واقع الدارسين');
        } else if (bullets.length === 1) {
          bullets.push('تحرير محل النزاع وتحديد المفاهيم الشرعية بدقة');
          bullets.push('الأثر المنهجي والواجب العملي تجاه مقتضيات هذا المحور');
        } else if (bullets.length === 2) {
          bullets.push('خلاصة المسألة وتوجيهات التطبيق العملي للدارسين');
        }

        return bullets.slice(0, 3);
      }

      `;

html = html.substring(0, oldBulletsStart) + newSlideHelpers + html.substring(oldBulletsEnd);
console.log('Replaced cleanSlideTitle and extractConciseSlideBullets successfully');

fs.writeFileSync('public/index.html', html, 'utf8');
