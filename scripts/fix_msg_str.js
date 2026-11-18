const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const badPattern = `const curSurah = (MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك';
                        const msg = '🕌 *حلقة القرآن الكريم — وِرد مدارسة ومراجعة الوجه*
' +
                          '📖 *المقرر:* سورة ' + curSurah + ' (صفحة ' + mushafPageNumber + ' من مصحف المدينة)

' +
                          '🔁 *توجيه الشيخ:* يُرجى تكرار هذا الوجه 5 مرات غيباً وتثبيت فواصل الآيات ومواضع المتشابهات قبل الحلقة القادمة.

' +
                          '✨ *منظومة مِشكاة — AnubisLand*';`;

const goodCode = `const curSurah = (MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك';
                        const msg = '🕌 *حلقة القرآن الكريم — وِرد مدارسة ومراجعة الوجه*\\n' +
                          '📖 *المقرر:* سورة ' + curSurah + ' (صفحة ' + mushafPageNumber + ' من مصحف المدينة)\\n\\n' +
                          '🔁 *توجيه الشيخ:* يُرجى تكرار هذا الوجه 5 مرات غيباً وتثبيت فواصل الآيات ومواضع المتشابهات قبل الحلقة القادمة.\\n\\n' +
                          '✨ *منظومة مِشكاة — AnubisLand*';`;

html = html.replace(badPattern, goodCode);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed WhatsApp msg string in public/index.html!');
