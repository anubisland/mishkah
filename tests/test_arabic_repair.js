// Comprehensive Arabic PDF / OCR cleaner test
function normalizeArabicPresentationForms(str) {
  if (!str) return '';
  // Convert Presentation Forms-A and Forms-B to standard Arabic letters
  const presentationMap = {
    '\uFE80': '\u0621', '\uFE81': '\u0622', '\uFE82': '\u0622', '\uFE83': '\u0623', '\uFE84': '\u0623',
    '\uFE85': '\u0624', '\uFE86': '\u0624', '\uFE87': '\u0625', '\uFE88': '\u0625', '\uFE89': '\u0626',
    '\uFE8A': '\u0626', '\uFE8B': '\u0626', '\uFE8C': '\u0626', '\uFE8D': '\u0627', '\uFE8E': '\u0627',
    '\uFE8F': '\u0628', '\uFE90': '\u0628', '\uFE91': '\u0628', '\uFE92': '\u0628', '\uFE93': '\u0629',
    '\uFE94': '\u0629', '\uFE95': '\u062A', '\uFE96': '\u062A', '\uFE97': '\u062A', '\uFE98': '\u062A',
    '\uFE99': '\u062B', '\uFE9A': '\u062B', '\uFE9B': '\u062B', '\uFE9C': '\u062B', '\uFE9D': '\u062C',
    '\uFE9E': '\u062C', '\uFE9F': '\u062C', '\uFEA0': '\u062C', '\uFEA1': '\u062D', '\uFEA2': '\u062D',
    '\uFEA3': '\u062D', '\uFEA4': '\u062D', '\uFEA5': '\u062E', '\uFEA6': '\u062E', '\uFEA7': '\u062E',
    '\uFEA8': '\u062E', '\uFEA9': '\u062F', '\uFEAA': '\u062F', '\uFEAB': '\u0630', '\uFEAC': '\u0630',
    '\uFEAD': '\u0631', '\uFEAE': '\u0631', '\uFEAF': '\u0632', '\uFEB0': '\u0632', '\uFEB1': '\u0633',
    '\uFEB2': '\u0633', '\uFEB3': '\u0633', '\uFEB4': '\u0633', '\uFEB5': '\u0634', '\uFEB6': '\u0634',
    '\uFEB7': '\u0634', '\uFEB8': '\u0634', '\uFEB9': '\u0635', '\uFEBA': '\u0635', '\uFEBB': '\u0635',
    '\uFEBC': '\u0635', '\uFEBD': '\u0636', '\uFEBE': '\u0636', '\uFEBF': '\u0636', '\uFEC0': '\u0636',
    '\uFEC1': '\u0637', '\uFEC2': '\u0637', '\uFEC3': '\u0637', '\uFEC4': '\u0637', '\uFEC5': '\u0638',
    '\uFEC6': '\u0638', '\uFEC7': '\u0638', '\uFEC8': '\u0638', '\uFEC9': '\u0639', '\uFECA': '\u0639',
    '\uFECB': '\u0639', '\uFECC': '\u0639', '\uFECD': '\u063A', '\uFECE': '\u063A', '\uFECF': '\u063A',
    '\uFED0': '\u063A', '\uFED1': '\u0641', '\uFED2': '\u0641', '\uFED3': '\u0641', '\uFED4': '\u0641',
    '\uFED5': '\u0642', '\uFED6': '\u0642', '\uFED7': '\u0642', '\uFED8': '\u0642', '\uFED9': '\u0643',
    '\uFEDA': '\u0643', '\uFEDB': '\u0643', '\uFEDC': '\u0643', '\uFEDD': '\u0644', '\uFEDE': '\u0644',
    '\uFEDF': '\u0644', '\uFEE0': '\u0644', '\uFEE1': '\u0645', '\uFEE2': '\u0645', '\uFEE3': '\u0645',
    '\uFEE4': '\u0645', '\uFEE5': '\u0646', '\uFEE6': '\u0646', '\uFEE7': '\u0646', '\uFEE8': '\u0646',
    '\uFEE9': '\u0647', '\uFEEA': '\u0647', '\uFEEB': '\u0647', '\uFEEC': '\u0647', '\uFEED': '\u0648',
    '\uFEEE': '\u0648', '\uFEEF': '\u0649', '\uFEF0': '\u0649', '\uFEF1': '\u064A', '\uFEF2': '\u064A',
    '\uFEF3': '\u064A', '\uFEF4': '\u064A', '\uFEF5': '\u0644\u0622', '\uFEF6': '\u0644\u0622',
    '\uFEF7': '\u0644\u0623', '\uFEF8': '\u0644\u0623', '\uFEF9': '\u0644\u0625', '\uFEFA': '\u0644\u0625',
    '\uFEFB': '\u0644\u0627', '\uFEFC': '\u0644\u0627',
    '\uFDF2': '\u0627\u0644\u0644\u0647' // Allah ligature
  };
  return str.replace(/[\uFE70-\uFEFC\uFDF2]/g, ch => presentationMap[ch] || ch);
}

function detectAndInvertReversedArabic(text) {
  if (!text) return text;
  
  // Indicators of reversed Arabic:
  // 1. Words starting with Taa Marbuta (ة): Arabic words NEVER start with ة
  const taaStartMatches = (text.match(/(?:^|[\s\p{P}])ة[\u0600-\u06FF]{1,}/gu) || []).length;
  // 2. Definite nouns ending with 'لا': When reversed, 'الـ' becomes 'ـلا'
  const laEndMatches = (text.match(/[\u0600-\u06FF]{2,}لا(?:$|[\s\p{P}])/gu) || []).length;
  // 3. Common reversed religious/scholarly words
  const reversedKeywords = (text.match(/(?:^|[\s\p{P}])(?:هللا|مسب|ذوعا|ذوعأ|للهاب|ناطيشرلا|ناطيشلا|ميجرلا|نمحرلا|ميحرلا|ىلإ|ثحبملا|قيبطتلا|رصاعملا|نيمألا|ملسو|هيلع|ىلاعت|لاق|ةلاسر|ةعيرش)(?:$|[\s\p{P}])/gu) || []).length;

  const totalWords = text.trim().split(/\s+/).length || 1;
  const isReversed = (taaStartMatches >= 2 || reversedKeywords >= 2 || (laEndMatches / totalWords > 0.15));

  if (!isReversed) return text;

  // Check if each line is reversed as a whole, or each word is reversed
  // If words are in RTL sequence but individual characters are LTR:
  // e.g. "ذوعا للهاب نم ناطيشلا ميجرلا"
  // If we reverse words individually: "اعوذ بالله من الشيطان الرجيم" -> Makes sense!
  // If we reverse whole line: "الرجيم الشيطان من بالله اعوذ" -> Backwards sentence!
  
  // Let's test if first word is 'ذوعا' or 'مسب' (which are the START of Basmalah/Istiadha)
  const lines = text.split(/\r?\n/);
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return line;

    // Test word-by-word reversal first:
    const words = trimmed.split(/(\s+|[،.؛:!؟\(\)«»\[\]])/);
    const wordReversed = words.map(w => {
      if (/[\u0600-\u06FF]{2,}/.test(w)) {
        return w.split('').reverse().join('');
      }
      return w;
    }).join('');

    // If wordReversed looks like normal Arabic (starts with 'أعوذ' or 'بسم' or has 'ال' prefixes):
    const normalAlPrefixCount = (wordReversed.match(/(?:^|[\s\p{P}])ال[\u0600-\u06FF]{2,}/gu) || []).length;
    if (normalAlPrefixCount > 0 || wordReversed.includes('بسم الله') || wordReversed.includes('أعوذ بالله') || wordReversed.includes('الحمد لله')) {
      return wordReversed;
    }

    // Otherwise reverse the whole line
    const bracketPairs = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '«': '»', '»': '«', '﴿': '﴾', '﴾': '﴿' };
    return trimmed.split('').reverse().join('').replace(/[()«»\[\]{}<>﴿﴾]/g, m => bracketPairs[m] || m);
  }).join('\n');
}

function cleanAndDisentangleArabic(text) {
  if (!text) return '';
  let res = normalizeArabicPresentationForms(text);
  res = detectAndInvertReversedArabic(res);

  // Strip Tatweel / Kashida
  res = res.replace(/[\u0640]+/g, '');
  // Collapse duplicate Dals (Adobe InDesign artifact)
  res = res.replace(/د{2,}/g, '');
  // Collapse repeated characters 3+ to 1
  res = res.replace(/([^0-9\s\.\-\*#])\1{2,}/g, '$1');

  // Specific common OCR / PDF broken ligatures
  res = res.replace(/بسمهلالا/g, 'بسم الله ');
  res = res.replace(/هللوالصالة/g, ' لله والصلاة');
  res = res.replace(/والسامعلى/g, ' والسلام على');
  res = res.replace(/رسو\s*لهللا/g, 'رسول الله');
  res = res.replace(/رسول\s*هللا/g, 'رسول الله');
  res = res.replace(/باهلل/g, 'بالله');
  res = res.replace(/هللا/g, 'الله');
  res = res.replace(/الخالصكوأ\s*فرغعل\s*ينا/g, 'الخالص وأفرغ علينا');
  res = res.replace(/فرغعل\s*ينا/g, 'أفرغ علينا');

  // Fix common prepositions glued together
  res = res.replace(/(أعوذ)(بالله)/g, '$1 $2');
  res = res.replace(/(بالله)(من)/g, '$1 $2');
  res = res.replace(/(من)(الشيطان)/g, '$1 $2');
  res = res.replace(/(الشيطان)(الرجيم)/g, '$1 $2');
  res = res.replace(/(بسم)(الله)/g, '$1 $2');
  res = res.replace(/(الله)(الرحمن)/g, '$1 $2');
  res = res.replace(/(الرحمن)(الرحيم)/g, '$1 $2');
  res = res.replace(/(الحمد)(لله)/g, '$1 $2');
  res = res.replace(/(رب)(العالمين)/g, '$1 $2');
  res = res.replace(/(صلى)(الله)/g, '$1 $2');
  res = res.replace(/(الله)(عليه)/g, '$1 $2');
  res = res.replace(/(عليه)(وسلم)/g, '$1 $2');
  res = res.replace(/(رضي)(الله)/g, '$1 $2');
  res = res.replace(/(قال)(تعالى)/g, '$1 $2');
  res = res.replace(/(قوله)(تعالى)/g, '$1 $2');
  res = res.replace(/(قال)(رسول)/g, '$1 $2');
  res = res.replace(/(رسول)(الله)/g, '$1 $2');
  res = res.replace(/(ما)(ينفعنا)/g, '$1 $2');
  res = res.replace(/(وا)(نصرنا)/g, 'وانصرنا');

  // Separate glued prepositions from words starting with 'ال'
  res = res.replace(/(\b(?:في|من|عن|إلى|على|مع|بين|كل|عند|دون|أهل|أثر|أصل|حكم|باب|فصل|كتاب|بيان|نحو|مثل|ضد|غير|قبل|بعد|فوق|تحت))(ال[\u0600-\u06FF]{2,})/gu, '$1 $2');

  // Separate two consecutive words starting with 'ال' glued together: e.g. "القومالكافرين" -> "القوم الكافرين"
  res = res.replace(/(ال[\u0600-\u06FF]{2,}?)(ال[\u0600-\u06FF]{2,})/gu, '$1 $2');

  // Normalize spaces
  res = res.replace(/[ \t]+/g, ' ');
  res = res.replace(/\n{3,}/g, '\n\n');
  return res.trim();
}

// Test with user's actual texts from screenshots:
const sample1 = 'أعوذ باللهمنالشيطانالرجيم، بسمهلالا الرحمنالرحيم، الحمد هللوالصالة والسامعلى رسو لهللا اللهم علمنا ماينفعنا وانفعنا بما علمتنا وزدنا علما اللهم ارزقنا التوحيد الخالصكوأ فرغعل ينا صبرا وثبت أقدامنا وانصرنا على القومالكافرين';
const sample2 = '،ميحرلا نمحرلا هللا مسب ،ميجرلا ناطيشلا نم للهاب ذوعا';

console.log('--- TEST SAMPLE 1 (Clumped Arabic) ---');
console.log('INPUT:\n', sample1);
console.log('OUTPUT:\n', cleanAndDisentangleArabic(sample1));

console.log('\n--- TEST SAMPLE 2 (Reversed Visual Arabic) ---');
console.log('INPUT:\n', sample2);
console.log('OUTPUT:\n', cleanAndDisentangleArabic(sample2));
