    function normalizeArabicPresentationForms(str) {
      if (!str) return '';
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
        '\uFDF2': 'الله',
        '\uFDFD': 'بسم الله الرحمن الرحيم',
        '\uFDFA': 'صلى الله عليه وسلم',
        '\uFDFB': 'جل جلاله'
      };
      return str.replace(/[\uFE70-\uFEFC\uFDF0-\uFDFD]/g, ch => presentationMap[ch] || ch);
    }

    // Detection & Inversion of Reversed Visual-Order Arabic (LTR encoded PDFs)
    function detectAndInvertReversedArabic(text) {
      if (!text) return text;
      // Pre-normalize broken forms of Emtithal, Ahkam and Salah BEFORE reversal checks!
      text = text.replace(/االمتثال/gu, 'الامتثال');
      text = text.replace(/الاامتثال/gu, 'الامتثال');
      text = text.replace(/ألوامره/gu, 'لأوامره');
      text = text.replace(/لألحكام/gu, 'للأحكام');
      text = text.replace(/أَقَامُوا\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ا?ل\s*ص\s*َّ?\s*َ?\s*(?:ل\s*ا|لا)\s*ة/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:ة\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*(?:ل\s*ا|لا)\s*ص\s*ل?ا|ص\s*(?:ل\s*ا|لا)\s*ل?ا\s*ة)\s*(?:أَقَامُوا|اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)\s*(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:^|[\s«\("])ةَ?\s+الَ?َّ?\s*صلاَ?\s+أَقَامُوا(?=[\s»\)"،.؛!؟]|$)/gu, ' أَقَامُوا الصَّلَاةَ ');
      text = text.replace(/ة\s+الَ?َّ?\s*صلاَ?\s+أَقَامُوا/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)\s*(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)\s*أَقَامُوا/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/أَقَامُوا\s*(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:ة\s+الَّ?\s*صلا\s+اوُماَقَأ|اوُماَقَأ\s+صلا\s+الَّ?\s*ة|اوُماَقَأ\s+الصَّ?\s*لا\s*ةَ?|أَقَامُوا\s+الصَّ?\s*لا\s*ةَ?|ةَ?\s*ال\s*َّصلا\s*اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:^|[\s«\("])(?:ةَ?\s+الَّ?\s*صلا|صلا\s+الَّ?\s*ةَ?)(?=[\s»\)"،.؛!؟]|$)/gu, ' الصَّلَاةَ ');
      text = text.replace(/اوُماَقَأ/gu, 'أَقَامُوا');
      text = text.replace(/الصَّ?\s*لا\s*ةَ?/gu, 'الصَّلَاةَ');
      text = text.replace(/ولا\s+ضرا\s+اول/gu, 'ولا ضراً');
      text = text.replace(/ولا\s+ضرا\s+ا\s+ول/gu, 'ولا ضراً');
      text = text.replace(/ربدتب\s+أرقا-?/gu, '-اقرأ بتدبر');
      text = text.replace(/أرقا\s+ربدتب-?/gu, '-اقرأ بتدبر');

      const REVERSE_STEMS = new Set([
        'ةبعش', 'ةطامإ', 'ةينادحو', 'ةفرعم', 'ةنسلا', 'ةتباثلا', 'لصلأا', 'ثلاثلا',
        'هبر', 'ناك', 'ملعي', 'سيلبإ', 'كنأك', 'هارت', 'دبعت', 'كاري', 'هنإف',
        'نإف', 'نكت', 'نوعبسو', 'اهلاعأ', 'اهاندأو', 'لدت', 'هتيبوبرو', 'هتردقو',
        'نقوتو', 'نلأ', '؛لضفلأا', 'لضفلأا', 'كرت', 'كلذب', 'هنكل', 'هنع', 'قولخم',
        'زجاع', 'كلمي', 'ليحتسي', 'نوكي', 'يلاتلابو', 'ءاوس', 'ناكأ', 'نود', 'ادمحم',
        'هيبناً', 'لقثأ', 'نإ', 'ديري', 'اذاَم', 'اظام', 'كسفن', 'لأسا', 'ينم', 'أمناد', 'دانمأ', 'ربدتب', 'أرقا'
      ]);

      const isTokenReversed = (word) => {
        const clean = word.replace(/^[«"“\(\[\.،؛!؟\-]+|[»"”\)\]\.،؛!؟\-]+$/g, '');
        if (!clean) return false;
        if (/^[ةـة؟]/.test(clean)) return true;
        if (/^[^إ]*إ$/.test(clean) && clean.length <= 4) return true;
        if (/(?:لا|لأا)$/.test(clean) && clean.length >= 4 && !/^(?:كلا|ألا|إلا|هلا|علا|فلا|ولا|بلا|هللا|وهللا|الله|والله)$/.test(clean)) return true;
        if (REVERSE_STEMS.has(clean)) return true;
        return false;
      };

      const isTokenForward = (word) => {
        const clean = word.replace(/^[«"“\(\[\.،؛!؟\-]+|[»"”\)\]\.،؛!؟\-]+$/g, '');
        if (!clean) return false;
        if (/^(?:ال|وال|فال|بال|لل|كال|الله|والله|فالله|بالله|ولله|فلله|هللا|وهللا)/.test(clean) && clean.length >= 3) return true;
        if (/[ةـة]$/.test(clean)) return true;
        if (/^(?:في|من|عن|على|إلى|مع|أن|إن|هو|هي|هذا|هذه|ذلك|تلك|كان|يكون|قال|يقول|الذي|التي|ماذا|كيف|لماذا|هل|اسأل|اقرأ|ترك|عدم|حكم|الصلاة|صلاة)$/.test(clean)) return true;
        return false;
      };

      const invertTextUnit = (str) => {
        const words = str.trim().split(/\s+/);
        const invertedWords = words.map(w => {
          if (w === '؟ينم' || w === 'ينم؟') return 'مني؟';
          if (w === 'ديري') return 'يريد';
          if (w === 'اذاَم' || w === 'اظام') return 'ماذا';
          if (w === 'كسفن') return 'نفسك';
          if (w === 'لأسا') return 'اسأل';
          if (w === 'أمناد' || w === 'دانمأ') return 'دائماً';
          if (w === 'لقثأ') return 'أثقل';
          if (w === 'نإ') return 'إن';
          if (w === 'الله' || w === 'هللا') return 'الله';

          let rev = w.split('').reverse().join('');
          return rev
            .replace(/«/g, 'TEMP_OPEN_Q').replace(/»/g, '«').replace(/TEMP_OPEN_Q/g, '»')
            .replace(/\(/g, 'TEMP_OPEN_P').replace(/\)/g, '(').replace(/TEMP_OPEN_P/g, ')')
            .replace(/\[/g, 'TEMP_OPEN_B').replace(/\]/g, '[').replace(/TEMP_OPEN_B/g, ']')
            .replace(/\{/g, 'TEMP_OPEN_C').replace(/\}/g, '{').replace(/TEMP_OPEN_C/g, '}')
            .replace(/﴿/g, 'TEMP_OPEN_A').replace(/﴾/g, '﴿').replace(/TEMP_OPEN_A/g, '﴾')
            .replace(/؟/g, 'TEMP_Q').replace(/TEMP_Q/g, '؟');
        }).reverse();
        let res = invertedWords.join(' ');
        res = res.replace(/؟\s*([^\s؟]+)/g, '$1؟');
        res = res.replace(/هللا/g, 'الله');
        res = res.replace(/دانمأ|دانما/g, 'دائماً');
        return res;
      };

      const isSegmentReversed = (segment) => {
        const words = segment.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return false;
        let revCount = 0;
        let fwdCount = 0;
        words.forEach(w => {
          if (isTokenReversed(w)) revCount++;
          if (isTokenForward(w)) fwdCount++;
        });
        if (words.some(w => /^[ةـة؟][\u0600-\u06FF]{2,}/.test(w.replace(/^[^\u0600-\u06FF]+/, ''))) && revCount > fwdCount) return true;
        return revCount > fwdCount && revCount >= 1;
      };

      const lines = text.split(/\r?\n/);
      return lines.map(line => {
        if (!line || !line.trim()) return line;

        const lineWords = line.trim().split(/\s+/).filter(Boolean);
        let totalRev = 0;
        let totalFwd = 0;
        lineWords.forEach(w => {
          if (isTokenReversed(w)) totalRev++;
          if (isTokenForward(w)) totalFwd++;
        });

        // Entire line predominantly reversed
        if (totalRev >= 2 && totalFwd <= 1) {
          return invertTextUnit(line);
        }

        // Mixed line: invert reversed quotes (both "..." and «...» and “...”)
        let l = line.replace(/(["“«])([^"”»\n]{3,120})(["”»])/gu, (match, openQ, inner, closeQ) => {
          if (isSegmentReversed(inner) || inner.includes('؟ينم') || inner.includes('ديري') || inner.includes('اذاَم')) {
            return openQ + invertTextUnit(inner) + closeQ;
          }
          return match;
        });

        // Invert recognized reversed standalone phrases
        l = l.replace(/(?:أمناد|دانمأ)\s+كسفن\s+لأسا/gu, 'اسأل نفسك دائماً');
        l = l.replace(/لقثأ\s+نإ/gu, 'إن أثقل');

        // Check sub-chunks separated by colons, semicolons, commas, or periods
        const chunks = l.split(/([،؛:\.\?\!«»\(\)\[\]])/);
        const repaired = [];
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          if (isSegmentReversed(chunk)) {
            repaired.push(invertTextUnit(chunk));
          } else {
            repaired.push(chunk);
          }
        }

        return repaired.join('');
      }).join('\n');
    }

    function joinWrappedArabicLines(rawInput) {
      if (!rawInput) return '';
      const lines = Array.isArray(rawInput) ? rawInput : (rawInput || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const merged = [];

      for (let i = 0; i < lines.length; i++) {
        const cur = lines[i].trim();
        if (!cur) continue;
        if (merged.length === 0) {
          merged.push(cur);
          continue;
        }

        const prev = merged[merged.length - 1];

        // Headings MUST NEVER be merged into previous lines, and lines after a heading must NEVER be merged into it!
        const headingTest = (str) => /^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|المبحث|المطلب|الفصل|الباب|المحور|المسألة|الوقفة|القسم|الأصل|القاعدة|الضابط|العنصر|النقطة|\d+[\.\-\)])\s*(?:الأول|الثاني|الثالث|الرابع|الخامس|\d+|[\u0660-\u0669]+|[أ-ي])?[:\.\-\s]|^[#]{1,4}\s+|^(?:\d+|[\u0660-\u0669]+)\s*[\.\-\)]\s*/i.test(str);
        if (headingTest(cur) || headingTest(prev)) {
          merged.push(cur);
          continue;
        }

        // Check if prev line was incomplete and cur continues it (capped to 350 chars):
        const quranCount = (prev.match(/[﴿﴾]/g) || []).length;
        const openQuran = (quranCount % 2 !== 0) && prev.length < 350;

        const parenCount = (prev.match(/[\(\)（）]/g) || []).length;
        const openParen = (parenCount % 2 !== 0) && prev.length < 350;

        const bracketCount = (prev.match(/[\[\]]/g) || []).length;
        const openBracket = (bracketCount % 2 !== 0) && prev.length < 350;

        const quoteCount = (prev.match(/[«»"]/g) || []).length;
        const openQuote = (quoteCount % 2 !== 0) && prev.length < 350;

        const trailingConnector = /(?:من|إلى|عن|على|في|مع|بين|أن|إن|بأن|حيث|كما|إذ|دون|و|أو|التي|الذي|الذين|اللاتي|اللواتي|ما|لا|كل|عند|قبل|بعد|نحو|ضد|مثل|غير|أثر|حتى|لئلا|لكن|أم|بل|ثم|سواء)$/.test(prev);

        const startsWithCloser = /^[»\)）\]﴾\.،؛!؟]/.test(cur);
        const prevEndsWithTerminator = /[.؛!؟:—\-]$/.test(prev);

        if (openQuran || openParen || openBracket || openQuote || trailingConnector || startsWithCloser || (!prevEndsWithTerminator && cur.length > 0 && prev.length < 85)) {
          merged[merged.length - 1] = prev + ' ' + cur;
        } else {
          merged.push(cur);
        }
      }

      return merged.join('\n');
    }

    function trimToCompleteSentence(text, maxLen = 380) {
      if (!text) return '';
      const clean = text.trim();
      if (clean.length <= maxLen) return clean;

      // Infallible completion for Hadiths, quotations, and sentence endings
      const searchRange = clean.substring(0, Math.min(clean.length, maxLen + 160));
      const punctCandidates = ['.', '!', '؟', '؛', '»', '"', ':\n', '\n']
        .map(p => searchRange.lastIndexOf(p))
        .filter(idx => idx !== -1);

      if (punctCandidates.length > 0) {
        const bestPunct = Math.max(...punctCandidates);
        if (bestPunct >= maxLen - 100) {
          return clean.substring(0, bestPunct + 1).trim();
        }
      }

      const lastSpace = searchRange.substring(0, maxLen).lastIndexOf(' ');
      if (lastSpace > 80) {
        let cleanSub = clean.substring(0, lastSpace).trim();
        cleanSub = cleanSub.replace(/\s+(?:ال|كل|على|من|في|أن|إن|أو|ثم|مع|إلى|ثالث|عن|بين|وهو|وهي|التي|الذي|هذا|هذه|وإنما|وانما|بل|لكن|أهل|ولا|وقال|فقال)$/u, '');
        return cleanSub + '...';
      }
      return clean.substring(0, maxLen).trim() + '...';
    }

    function sanitizeIslamicDataObject(obj) {
      if (!obj) return obj;
      if (typeof obj === 'string') {
        return sanitizeArabicExtractedText(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeIslamicDataObject(item));
      }
      if (typeof obj === 'object') {
        const res = {};
        for (const key of Object.keys(obj)) {
          if (key === 'id' || key === 'slideNumber' || key === 'phaseNumber' || key === 'durationMinutes' || key === 'isCorrect' || key === 'order' || key === 'index') {
            res[key] = obj[key];
          } else {
            res[key] = sanitizeIslamicDataObject(obj[key]);
          }
        }
        return res;
      }
      return obj;
    }

    function sanitizeArabicExtractedText(rawText) {
      if (!rawText) return '';
      // Slide sections sometimes carry their text as an array of lines.
      if (Array.isArray(rawText)) rawText = rawText.filter(Boolean).join('\n');
      if (typeof rawText !== 'string') rawText = String(rawText);
      // 0. Pre-strip PDF Page Markers & OCR Inversion Artifacts before line processing:
      rawText = rawText.replace(/["“«]?\s*هِبْلَقِ\s+نِمْ[\s\S]*?لاَقَ\s+نَمْ\s*["”»]?/gu, '«مَنْ قَالَ لَا إِلَهَ إِلَّا اللَّهُ خَالِصًا مِنْ قَلْبِهِ»');
      rawText = rawText.replace(/مُهُتَعاَفَشْ\s+يِنْغُت\s+لا\s+تاَواَمَّسلاِ\s+يِف\s+كَلَمٍ\s+نِمْ\s+مَكَو/gu, '﴿وَكَمْ مِنْ مَلَكٍ فِي السَّمَاوَاتِ لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا﴾');
      rawText = rawText.replace(/تاَواَمَّسلاِ\s+يِف\s+كَلَمٍ\s+نِمْ\s+مَكَو/gu, '﴿وَكَمْ مِنْ مَلَكٍ فِي السَّمَاوَاتِ﴾');
      rawText = rawText.replace(/\(مُهْنِمْ\s+رَصَتْن\s+الََ\s+ُ\s*ءاَشَيُ\s+وَلَوْ\)/gu, '﴿وَلَوْ يَشَاءُ اللَّهُ لَانْتَصَرَ مِنْهُمْ﴾');
      rawText = rawText.replace(/هاضِرو\s+اللهِ\s+نْذإِ\s+دعَبَ\s+اَلّ\s+إ\s+اًئيَش\s+مهُتعافش\s+ينغُت\s+لا/gu, '«لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا إِلَّا مِنْ بَعْدِ إِذْنِ اللَّهِ وَرِضَاهُ»');
      rawText = rawText.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+(?:لوق|لوقُ)\s*([-\d\.\s]*)/gu, '$1 قول الله تعالى: ');
      rawText = rawText.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ)\s*هُعِّ?فَ?شُ?يف/gu, 'فيُشفّعُه الله تعالى');
      rawText = rawText.replace(/مَّ?لسو\s+هيلع\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+ىَّ?لص/gu, 'صلى الله عليه وسلم');
      rawText = rawText.replace(/اللهدبع\s+نب\s+رباج/gu, 'جابر بن عبدالله');
      rawText = rawText.replace(/اللهُ\s+لوقيُ/gu, 'يقول الله تعالى:');
      rawText = rawText.replace(/ِالخَ\s+الئِق/gu, 'الخلائق');
      rawText = rawText.replace(/إلعالء/gu, 'لإعلاء');
      rawText = rawText.replace(/كماالتهم/gu, 'كمالاتهم');
      rawText = rawText.replace(/خُذالن/gu, 'خذلان');
      rawText = rawText.replace(/أوالدك/gu, 'أولادك');
      rawText = rawText.replace(/وجالء/gu, 'وجلاء');
      rawText = rawText.replace(/اللوه/gu, 'اللهو');
      rawText = rawText.replace(/وهللا/gu, 'والله');
      rawText = rawText.replace(/عبدهللا/gu, 'عبدالله');
      rawText = rawText.replace(/هللا/gu, 'الله');
      rawText = rawText.replace(/---\s*P\d+\s*---\s*/gi, '\n');
      rawText = rawText.replace(/(?:^|[\s«\("])صَالة(?=[\s»\)"،.؛!؟]|$)/gu, ' صلاة ');
      rawText = rawText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]*صَ?ا?لَ?ة[\u064B-\u065F\u0670\u06D6-\u06ED]*\s+[\u064B-\u065F\u0670\u06D6-\u06ED]*الجُمُعة/gu, 'صلاة الجمعة');
      rawText = rawText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]*صَ?ا?لَ?ة[\u064B-\u065F\u0670\u06D6-\u06ED]*\s+[\u064B-\u065F\u0670\u06D6-\u06ED]*العِيد/gu, 'صلاة العيد');
      rawText = rawText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]*صَ?ا?لَ?ة[\u064B-\u065F\u0670\u06D6-\u06ED]*\s+[\u064B-\u065F\u0670\u06D6-\u06ED]*الجماعة/gu, 'صلاة الجماعة');
      rawText = rawText.replace(/صالة\s+الفرض/gu, 'صلاة الفرض');
      rawText = rawText.replace(/صالة\s+النافلة/gu, 'صلاة النافلة');
      rawText = rawText.replace(/صالة\s+المكتوبة/gu, 'صلاة المكتوبة');
      rawText = rawText.replace(/صَالة\s+ِالجَماعة/gu, 'صلاة الجماعة');
      rawText = rawText.replace(/صالة\s+الجماعة/gu, 'صلاة الجماعة');
      rawText = rawText.replace(/ًاقائل\s*:/gu, 'قائلاً:');
      rawText = rawText.replace(/ال\s*ُ?أفتَح\s*ٍ?ألحَد\s*قَبلَك/gu, 'لا أفتح لأحد قبلك');
      rawText = rawText.replace(/ٍألحَد/gu, 'لأحد');
      rawText = rawText.replace(/ََِّلا\s*ة/gu, 'صَلَاةِ');
      rawText = rawText.replace(/(?:ِ?\s*َ?َّ?لا?\s*ة\s*لِلص|لِلص\s*َّ?َ?لا?\s*ة)/gu, 'لِلصَّلَاةِ');
      rawText = rawText.replace(/االمتثال/gu, 'الامتثال');
      rawText = rawText.replace(/الاامتثال/gu, 'الامتثال');
      rawText = rawText.replace(/ألوامره/gu, 'لأوامره');
      rawText = rawText.replace(/لألحكام/gu, 'للأحكام');
      rawText = rawText.replace(/^[-\s]*P\d+[-\s]*$/gmi, '');
      rawText = rawText.replace(/(?:^|\s)P\d+\s*[-–—]+\s*/gi, ' ');
      rawText = rawText.replace(/(?:^|[\s«\("])باز\s+ابن(?=[\s»\)"،.؛!؟]|$)/gu, ' ابن باز ');
      rawText = rawText.replace(/س\s+ما\s+حكم\s+ترك\s+الجماعة\s+في\s+المسجد\s*؟\s*باز\s+ابن/gu, 'س: ما حكم ترك الجماعة في المسجد؟ (فتوى الشيخ ابن باز):');
      rawText = rawText.replace(/[“«"]?\s*ينم\s*؟?\s*(?:الله|هللا)?\s*ديري\s*(?:اذام|اذاَم|اظام)\s*[”»"]?/gu, '«ماذا يريد الله مني؟»');
      rawText = rawText.replace(/ينم\s*؟?\s*(?:الله|هللا)?\s*ديري\s*(?:اذام|اذاَم|اظام)/gu, 'ماذا يريد الله مني؟');
      rawText = rawText.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|ه\s*للا)\s+لوق\s+تحت:?/gu, 'تحت قول الله تعالى:');
      rawText = rawText.replace(/لوق\s+تحت/gu, 'تحت قول');
      rawText = rawText.replace(/ألتوهما/gu, 'لأتوهما');
      rawText = rawText.replace(/إعتالء/gu, 'إعلاء');
      rawText = rawText.replace(/المَ\s+الئِكة/gu, 'الملائكة');
      rawText = rawText.replace(/المَالئِكة/gu, 'الملائكة');
      rawText = rawText.replace(/(?:ِ?\s*َ?َّ?لا?\s*ة\s*لِلص|لِلص\s*َّ?َ?لا?\s*ة)/gu, 'لِلصَّلَاةِ');
      rawText = rawText.replace(/الأدلَّة\s*:\s*ا\s+أول\s*:/gu, 'الأدلة: أولاً:');
      rawText = rawText.replace(/ا\s+أول\s*:/gu, 'أولاً:');
      rawText = rawText.replace(/فالشفاعة\s+ال\s+صحيحة\s+التكون\s+إال/gu, 'فالشفاعة الصحيحة لا تكون إلا:');

      // Separate inline numbered sub-headings so they never get swallowed into cards:
      let text = rawText.replace(/([^\n])\s*(\d+[\-–\.]\s*(?:هجر|المحور|المطلب|المبحث|النوع|الأصل|القسم|الوقفة|القاعدة))/gu, '$1\n\n$2');

      // 1. Normalize presentation forms to standard Arabic characters
      text = normalizeArabicPresentationForms(text);
      // 2. Invert reversed visual lines line-by-line FIRST
      text = detectAndInvertReversedArabic(text);
      // 3. Smart join wrapped lines (strictly heading-immune)
      text = joinWrappedArabicLines(text);

      // Rejoin inverted Quranic brackets if in reverse order: "﴾آية﴿" -> "﴿آية﴾"
      text = text.replace(/﴾([^﴿﴾]{3,350})﴿/gu, (m, p1) => '﴿' + p1.trim() + '﴾');

      // Normalize specific inverted verse from PDF: لو كان فيهما آلهة إلا الله لفسدتا
      text = text.replace(/(?:﴿?\s*لَ?فَ?سَ?دَ?تَ?ا[\s\S]{0,60}?لَ?و[\s\u064B-\u0652]*كَ?ان[\s\u064B-\u0652]*فِ?يهِ?مَ?ا[\s\u064B-\u0652]*آلِ?هَ?ة[\s\S]*?﴾?|﴿?\s*لَ?و[\s\u064B-\u0652]*كَ?ان[\s\u064B-\u0652]*فِ?يهِ?مَ?ا[\s\u064B-\u0652]*آلِ?هَ?ة[\s\S]*?لَ?فَ?سَ?دَ?تَ?ا[\s\S]*?﴾?)\.?/gu, '﴿لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا﴾ [الأنبياء: 22]');

      // Strip spurious short bracketed fragments that are not valid Quranic verses
      text = text.replace(/«?\s*﴿\s*[^﴾\n]{1,12}\s*﴾\s*»?/gu, ' ');
      text = text.replace(/﴿\s*(?:لا|\.|\.?\s*إلا|الَِّ\s*\.|نعم|بلى|فقط|لا\s*\.?\s*إ|لا\s+بس)\s*﴾/g, ' ');

      // 1. Strip all Tatweel/Kashida characters
      text = text.replace(/[\u0640]+/g, '');

      // 2. Collapse 4+ repeated Dals
      text = text.replace(/د{4,}/g, '');
      text = text.replace(/(?:^|[\s(\[«])لق(?=[\s)\.،؛!؟»\]]|$)/gu, ' لقد ');

      // 3. Collapse any Arabic letter repeated 3+ times to 1
      text = text.replace(/([^0-9\s\.\-\*#])\1{2,}/g, '$1');

      // 4. Remove Table of Contents leader dots, underline streaks, and dashes
      text = text.replace(/\.{3,}/g, ' ');
      text = text.replace(/_{3,}/g, ' ');
      text = text.replace(/[\-]{4,}/g, ' ');
      text = text.replace(/={2,}/g, ' ');
      text = text.replace(/ألن\s+القلب/g, 'لأن القلب');
      text = text.replace(/الْعَ\s+الَمِين/g, 'الْعَالَمِينَ');
      text = text.replace(/الْعَالَمِين(?=[^َ]|$)/g, 'الْعَالَمِينَ');

      // 5. Systemic Arabic Sacred Names & Inversion Normalization
      text = normalizeIslamicSacredTerms(text);
      text = text.replace(/اعوذ/g, 'أعوذ');

      // 6. Universal Arabic OCR Ligature & Typo Corrections (NEVER use \b with Arabic!)
      text = text.replace(/(?:^|[\s«\("])(?:الاامتثال|االامتثال|االمتثال|المتثال)(?=[\s»\)"،.؛!؟]|$)/gu, ' الامتثال ');
      text = text.replace(/الامتثال\s+ألوامره/gu, 'الامتثال لأوامره');
      text = text.replace(/الامتثال\s+أوامره/gu, 'الامتثال لأوامره');
      text = text.replace(/المتثال/gu, 'الامتثال');
      text = text.replace(/(?:^|[\s«\("])وأخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' وأخلاقه ');
      text = text.replace(/(?:^|[\s«\("])أخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاقه ');
      text = text.replace(/(?:^|[\s«\("])أخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاق ');
      text = text.replace(/(?:^|[\s«\("])الأخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' الأخلاق ');
      text = text.replace(/ملسو\s+هيلع\s+هللا\s+ىلص/gu, 'صلى الله عليه وسلم');
      text = text.replace(/ىلص\s+هللا\s+هيلع\s+ملسو/gu, 'صلى الله عليه وسلم');
      text = text.replace(/(?:^|[\s«\("])باهلل(?=[\s»\)"،.؛!؟]|$)/gu, ' بالله ');
      text = text.replace(/(?:^|[\s«\("])هللا(?=[\s»\)"،.؛!؟]|$)/gu, ' الله ');
      text = text.replace(/السشفاء/gu, 'الاستشفاء');
      text = text.replace(/السفاء/gu, 'الاستشفاء');
      text = text.replace(/استسفاء/gu, 'استشفاء');
      text = text.replace(/في عالج علل/gu, 'في علاج علل');
      text = text.replace(/القرآنمثل/gu, 'القرآن مثل');
      text = text.replace(/اقائل/gu, 'القائل:');
      text = text.replace(/محض هلل/gu, 'محض لله');
      text = text.replace(/حق هلل/gu, 'حق لله');
      text = text.replace(/طاعة هلل/gu, 'طاعة لله');
      text = text.replace(/كتاب هلل/gu, 'كتاب لله');
      text = text.replace(/رسول هلل/gu, 'رسول لله');
      text = text.replace(/شريعة هلل/gu, 'شريعة لله');
      text = text.replace(/إخلاص هلل/gu, 'إخلاص لله');
      text = text.replace(/توحيد هلل/gu, 'توحيد لله');
      text = text.replace(/عبادة هلل/gu, 'عبادة لله');
      text = text.replace(/سبيل هلل/gu, 'سبيل لله');
      text = text.replace(/بيوت هلل/gu, 'بيوت لله');
      text = text.replace(/خلق هلل/gu, 'خلق لله');
      text = text.replace(/(?:^|[\s(\[«])هلل\s+(?:عز\s*وجل|وحده)/gu, ' لله عز وجل ');

      // Specific high-frequency decomposed / inverted PDF terms
      text = text.replace(/االستسالم/g, 'الاستسلام');
      text = text.replace(/واالستسالم/g, 'والاستسلام');
      text = text.replace(/الاستسالم/g, 'الاستسلام');
      text = text.replace(/واالنقيلد/g, 'والانقياد');
      text = text.replace(/االنقيلد/g, 'الانقياد');
      text = text.replace(/واالنقياد/g, 'والانقياد');
      text = text.replace(/االنقياد/g, 'الانقياد');
      text = text.replace(/الإس\s*الم/g, 'الإسلام');
      text = text.replace(/الإسالم/g, 'الإسلام');
      text = text.replace(/الإبالم/g, 'الإسلام');
      text = text.replace(/اإلبالم/g, 'الإسلام');
      text = text.replace(/بإبالم/g, 'بالإسلام');
      text = text.replace(/إبالم/g, 'إسلام');
      text = text.replace(/باإلسالم/g, 'بالإسلام');
      text = text.replace(/بالإسالم/g, 'بالإسلام');
      text = text.replace(/إسالم/g, 'إسلام');
      text = text.replace(/اإلسالم/g, 'الإسلام');
      text = text.replace(/إقام\s+الصالة/g, 'إقام الصلاة');
      text = text.replace(/إقام\s+الصلاة/g, 'إقام الصلاة');
      text = text.replace(/ومالئكته/g, 'وملائكته');
      text = text.replace(/بمالئكته/g, 'بملائكته');
      text = text.replace(/المالئكة/g, 'الملائكة');
      text = text.replace(/مالئكته/g, 'ملائكته');
      text = text.replace(/مالئكة/g, 'ملائكة');
      text = text.replace(/أعالها/g, 'أعلاها');
      text = text.replace(/أعاله/g, 'أعلاه');
      text = text.replace(/الصالة/g, 'الصلاة');
      text = text.replace(/فالصالة/g, 'فالصلاة');
      text = text.replace(/بالصالة/g, 'بالصلاة');
      text = text.replace(/للصالة/g, 'للصلاة');
      text = text.replace(/صالة/g, 'صلاة');
      text = text.replace(/صالته/g, 'صلاته');
      text = text.replace(/صالتك/g, 'صلاتك');
      text = text.replace(/صالتهم/g, 'صلاتهم');
      text = text.replace(/صالتنا/g, 'صلاتنا');
      text = text.replace(/صالتكم/g, 'صلاتكم');
      text = text.replace(/السالم/g, 'السلام');
      text = text.replace(/القرأن/g, 'القرآن');
      text = text.replace(/هؤالء/g, 'هؤلاء');
      text = text.replace(/غالمها/g, 'غلامها');
      text = text.replace(/الخالف/g, 'الخلاف');
      text = text.replace(/الخالفة/g, 'الخلافة');
      text = text.replace(/اختالف/g, 'اختلاف');
      text = text.replace(/اختاالف/g, 'اختلاف');
      text = text.replace(/الماليين/g, 'الملايين');
      text = text.replace(/ماليين/g, 'ملايين');
      text = text.replace(/احبل/g, 'حبلاً');
      text = text.replace(/ً\s*ا\s+حبل/g, 'حبلاً');
      text = text.replace(/ا\s+ل\s+يُ?نقض/g, 'لا يُنقض');
      text = text.replace(/ا\s+ل\s+يخاف/g, 'لا يخاف');
      text = text.replace(/(?:^|[\s(\[«])ا\s+ل(?=[\s)\.،؛!؟»\]]|$)/gu, ' لا ');
      text = text.replace(/(?:^|[\s(\[«])ا\s+ل\s+(?=[أ-ي])/gu, ' لا ');

      // Generic Word-initial double Alif 'االـ' -> 'الاـ' (Transposed Lam-Alef ligature at start of words)
      text = text.replace(/(?:^|[\s(\[«\-])اال(?=[أ-ي])/gu, (m) => m.replace('اال', 'الا'));
      text = text.replace(/(?:^|[\s(\[«\-])واال(?=[أ-ي])/gu, (m) => m.replace('واال', 'والا'));
      text = text.replace(/(?:^|[\s(\[«\-])فاال(?=[أ-ي])/gu, (m) => m.replace('فاال', 'فالا'));
      text = text.replace(/(?:^|[\s(\[«\-])باال(?=[أ-ي])/gu, (m) => m.replace('باال', 'بالا'));
      text = text.replace(/(?:^|[\s(\[«\-])كاال(?=[أ-ي])/gu, (m) => m.replace('كاال', 'كالا'));

      // Spaced-out / fragmented ligatures inside words (PDF font decomposition)
      text = text.replace(/الصَّ?\s*لا\s*ةَ?/gu, 'الصَّلَاةَ');
      text = text.replace(/(?:^|[\s«\("])الص\s*لا\s*ة(?=[\s»\)"،.؛!؟]|$)/gu, ' الصلاة ');
      text = text.replace(/إس\s*لا\s*م/gu, 'إسلام');
      text = text.replace(/إص\s*لا\s*ح/gu, 'إصلاح');
      text = text.replace(/خ\s*لا\s*ف/gu, 'خلاف');
      text = text.replace(/ع\s*لا\s*ق/gu, 'علاق');
      text = text.replace(/ت\s*لا\s*و/gu, 'تلاو');
      text = text.replace(/ك\s*لا\s*م/gu, 'كلام');

      // Missing preposition Lam before أوامره
      text = text.replace(/الامتثال\s+أوامره/gu, 'الامتثال لأوامره');
      text = text.replace(/المتثال\s+ألوامره/gu, 'الامتثال لأوامره');
      text = text.replace(/ألوامره/gu, 'لأوامره');
      text = text.replace(/المتثال/gu, 'الامتثال');

      // Inverted 'لا' into 'ال' (Transposed Lam-Alef OCR defect):
      // تالوة / التالوة -> تلاوة / التلاوة
      text = text.replace(/(^|[\s«\("])تالوة(?=[\s»\)"،.؛!؟]|$)/gu, '$1تلاوة');
      text = text.replace(/(^|[\s«\("])التالوة(?=[\s»\)"،.؛!؟]|$)/gu, '$1التلاوة');
      text = text.replace(/هجر\s+التالوة/gu, 'هجر التلاوة');
      text = text.replace(/هجر\s+تالوة/gu, 'هجر تلاوة');
      text = text.replace(/تالوة\s+الحروف/gu, 'تلاوة الحروف');

      // كالم -> كلام
      text = text.replace(/(^|[\s«\("])كالم\s+الله(?=[\s»\)"،.؛!؟]|$)/gu, '$1كلام الله');
      text = text.replace(/(^|[\s«\("])كالم(?=[\s»\)"،.؛!؟]|$)/gu, '$1كلام');
      text = text.replace(/(^|[\s«\("])الكالم(?=[\s»\)"،.؛!؟]|$)/gu, '$1الكلام');

      // عالج -> علاج
      text = text.replace(/في\s+عالج/gu, 'في علاج');
      text = text.replace(/عالج\s+علل/gu, 'علاج علل');
      text = text.replace(/عالج\s+الأمراض/gu, 'علاج الأمراض');
      text = text.replace(/عالج\s+المرض/gu, 'علاج المرض');
      text = text.replace(/عالج\s+النفوس/gu, 'علاج النفوس');

      // عالقة / عالقتهم / عالقتك / عالقتنا / عالقات -> علاقة / علاقتهم / علاقتك / علاقتنا / علاقات
      text = text.replace(/إصالح\s+عالقتهم/gu, 'إصلاح علاقتهم');
      text = text.replace(/(^|[\s«\("])إصالح(?=[\s»\)"،.؛!؟]|$)/gu, '$1إصلاح');
      text = text.replace(/(^|[\s«\("])عالقتهم(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقتهم');
      text = text.replace(/(^|[\s«\("])عالقتك(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقتك');
      text = text.replace(/(^|[\s«\("])عالقتنا(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقتنا');
      text = text.replace(/(^|[\s«\("])عالقة(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقة');
      text = text.replace(/(^|[\s«\("])عالقات(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقات');

      // حالله وحرامه -> حلاله وحرامه
      text = text.replace(/حالله\s+وحرامه/gu, 'حلاله وحرامه');
      text = text.replace(/(^|[\s«\("])حالله(?=[\s»\)"،.؛!؟]|$)/gu, '$1حلاله');

      // Words where 'باال' was reduced to 'بال' without Alef:
      text = text.replace(/بالستمرار/gu, 'بالاستمرار');
      text = text.replace(/بالنشغال/gu, 'بالانشغال');
      text = text.replace(/بالستسلام/gu, 'بالاستسلام');
      text = text.replace(/بالستشفاء/gu, 'بالاستشفاء');
      text = text.replace(/بالعتزاز/gu, 'بالاعتزاز');
      text = text.replace(/بالعتقاد/gu, 'بالاعتقاد');
      text = text.replace(/باللتزام/gu, 'بالالتزام');
      text = text.replace(/بالمتثال/gu, 'بالامتثال');
      text = text.replace(/بالنقياد/gu, 'بالانقياد');

      // Inverted quote and reversed phrases (Card 9)
      text = text.replace(/["“«]?\s*ينم[؟\?]?\s+الله\s+ديري\s+(?:اذاَم|اذاَم|اظام|إذاَم|اذا م)\s*["”»]?/gu, '"ماذا يريد الله مني؟"');
      text = text.replace(/["“«]?\s*ينم[؟\?]?\s+ديري\s+الله\s+(?:اذاَم|اذاَم|اظام|إذاَم|اذا م)\s*["”»]?/gu, '"ماذا يريد الله مني؟"');
      text = text.replace(/ربدتب\s+أرقا-?/gu, '-اقرأ بتدبر');
      text = text.replace(/أرقا\s+ربدتب-?/gu, '-اقرأ بتدبر');
      text = text.replace(/["“«]?ماذا يريد الله مني؟["”»]?\s*:\s*-اقرأ بتدبر/gu, '-اقرأ بتدبر: "ماذا يريد الله مني؟"');
      text = text.replace(/(?:-اقرأ بتدبر\s*:\s*)?["“«]?ماذا يريد الله مني؟["”»]?\s*:\s*-اقرأ بتدبر/gu, '-اقرأ بتدبر: "ماذا يريد الله مني؟"');

      // Isolated negative particles: ' ال ' is NEVER a valid standalone word in Arabic; it is 100% ' لا '!
      text = text.replace(/(?:^|[\s(\[«])ال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('ال', 'لا'));
      text = text.replace(/(?:^|[\s(\[«])وال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('وال', 'ولا'));
      text = text.replace(/(?:^|[\s(\[«])فال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('فال', 'فلا'));
      text = text.replace(/(?:^|[\s(\[«])بال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('بال', 'بلا'));

      // Alif-Lam Decomposed Ligatures
      text = text.replace(/اإل/g, 'الإ').replace(/اإ/g, 'الإ').replace(/األ/g, 'الأ').replace(/اأ/g, 'الأ').replace(/اآل/g, 'الآ').replace(/اآ/g, 'الآ');

      // Fix glued religious phrases & formulas
      text = text.replace(/(أعوذ)(بالله)/g, '$1 $2');
      text = text.replace(/(بالله)(من)/g, '$1 $2');
      text = text.replace(/(من)(الشيطان)/g, '$1 $2');
      text = text.replace(/(الشيطان)(الرجيم)/g, '$1 $2');
      text = text.replace(/(بسم)(الله)/g, '$1 $2');
      text = text.replace(/(الله)(الرحمن)/g, '$1 $2');
      text = text.replace(/(الرحمن)(الرحيم)/g, '$1 $2');
      text = text.replace(/(الحمد)(لله)/g, '$1 $2');
      text = text.replace(/(رب)(العالمين)/g, '$1 $2');
      text = text.replace(/(صلى)(الله)/g, '$1 $2');
      text = text.replace(/(الله)(عليه)/g, '$1 $2');
      text = text.replace(/(عليه)(وسلم)/g, '$1 $2');
      text = text.replace(/(رضي)(الله)/g, '$1 $2');
      text = text.replace(/(قال)(تعالى)/g, '$1 $2');
      text = text.replace(/(قوله)(تعالى)/g, '$1 $2');
      text = text.replace(/(قال)(رسول)/g, '$1 $2');
      text = text.replace(/(رسول)(الله)/g, '$1 $2');
      text = text.replace(/(ما)(ينفعنا)/g, '$1 $2');
      text = text.replace(/(وا)(نصرنا)/g, 'وانصرنا');

      // Separate prepositions glued to words starting with 'ال'
      text = text.replace(/((?:في|من|عن|إلى|على|مع|بين|كل|عند|دون|أهل|أثر|أصل|حكم|باب|فصل|كتاب|بيان|نحو|مثل|ضد|غير|قبل|بعد|فوق|تحت))(ال[\u0600-\u06FF]{2,})/gu, '$1 $2');

      // Separate double definite nouns glued together
      text = text.replace(/(ال[\u0600-\u06FF]{2,}?)(ال[\u0600-\u06FF]{2,})/gu, '$1 $2');

      // 7. Filter lines to discard Table of Contents remnants
      
      // Infallible Fixes for Shariah Terms, Ligatures, Scriptures and Prepositions:
      // 1. لألحكام -> للأحكام / ألحكام -> أحكام / االمتثال -> الامتثال
      text = text.replace(/لألحكام/gu, 'للأحكام');
      text = text.replace(/(?:^|[\s«\("])ألحكام(?=[\s»\)"،.؛!؟]|$)/gu, ' أحكام ');
      text = text.replace(/االمتثال/gu, 'الامتثال');
      text = text.replace(/الاامتثال/gu, 'الامتثال');
      text = text.replace(/والعتقاد/gu, 'والاعتقاد');
      text = text.replace(/االستشفاء/gu, 'الاستشفاء');
      text = text.replace(/االعتماد/gu, 'الاعتماد');
      text = text.replace(/حالله\s+وحرامه/gu, 'حلاله وحرامه');
      text = text.replace(/التالوة/gu, 'التلاوة');
      text = text.replace(/العمالء/gu, 'العلماء');

      // 2. إال -> إلا / آال -> إلا
      text = text.replace(/إال/gu, 'إلا');
      text = text.replace(/(?:^|[\s«\("])آال(?=[\s»\)"،.؛!؟]|$)/gu, ' إلا ');

      // 3. معصية هلل -> معصية لله / طاعة هلل -> طاعة لله / هيبة هلل -> هيبة لله / فاهلل -> فالله
      text = text.replace(/(معصية|طاعة|محض|خالص|مخلصين|شكراً|حمداً|استسلاماً|تذللاً|قربة|عبادة|دعاء|هيبة|خضوعاً|الحمد)\s+هلل/gu, '$1 لله');
      text = text.replace(/هلل\s+عز\s+وجل/gu, 'لله عز وجل');
      text = text.replace(/(?:^|[\s«\("])فاهلل(?=[\s»\)"،.؛!؟]|$)/gu, ' فالله ');
      text = text.replace(/(?:^|[\s«\("])باهلل(?=[\s»\)"،.؛!؟]|$)/gu, ' بالله ');
      text = text.replace(/(?:^|[\s«\("])هلل(?=[\s»\)"،.؛!؟]|$)/gu, ' لله ');

      // 4. { ِ َلِلَّه و ُ عَاقِبَة ِ ا ْلأ ُمُور :} -> ﴿وَلِلَّهِ عَاقِبَةُ الْأُمُورِ﴾:
      text = text.replace(/\{[^}]*?ع[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ا[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ق[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ب[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ة[\s\S]*?م[\u064B-\u065F\u0670\u06D6-\u06ED\s]*و[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ر[\s\S]*?\}:?/gu, '﴿وَلِلَّهِ عَاقِبَةُ الْأُمُورِ﴾:');
      text = text.replace(/(?:لله\s+و\s+عاقبة\s+(?:الامور|الأمور)|و\s*لله\s+عاقبة\s+(?:الامور|الأمور)|لله\s+وعاقبة\s+(?:الامور|الأمور))/gu, 'وَلِلَّهِ عَاقِبَةُ الْأُمُورِ');
      text = text.replace(/عاقبة\s+الامور/gu, 'عاقبة الأمور');

      // 5. Isolate stray Fiqh questions so they never leak into previous cards
      text = text.replace(/([^\n])\s*(س[\s\u064B-\u065F\u0670\u06D6-\u06ED]*ما[\s\u064B-\u065F\u0670\u06D6-\u06ED]*ح[\u064B-\u065F\u0670\u06D6-\u06ED]*ك[\u064B-\u065F\u0670\u06D6-\u06ED]*م|س[\s\u064B-\u065F\u0670\u06D6-\u06ED]*هل|كبسولة\s+فقهية)/gu, '$1\n\n$2');

      // 6. Clean stray outline numbers: 2ب. -> 2.
      text = text.replace(/(\d+)\s*[بب]\./gu, '$1. ');
      text = text.replace(/(?:^|\s)\d+\s*[أ-ي]\s*[\.\-\)]\s*/gu, ' ');

      // 7. Universal Normalization of أَقَامُوا الصَّلَاةَ / إِقَامَةُ الصَّلَاةِ
      text = text.replace(/أَقَامُوا\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ا?ل\s*ص\s*َّ?\s*َ?\s*(?:ل\s*ا|لا)\s*ة/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:ة\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*(?:ل\s*ا|لا)\s*ص\s*ل?ا|ص\s*(?:ل\s*ا|لا)\s*ل?ا\s*ة)\s*(?:أَقَامُوا|اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)\s*(?:اوُماَقَأ|أَقَامُوا|إقامة|اقامة)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:اوُماَقَأ|أَقَامُوا|إقامة|اقامة)\s*(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/ة\s+الَ?َّ?\s*صلاَ?\s+أَقَامُوا/gu, 'أَقَامُوا الصَّلَاةَ');
      text = text.replace(/(?:^|[\s«\("])(?:إقام|اقام)\s+الصلاة(?=[\s»\)"،.؛!؟]|$)/gu, ' إقامة الصلاة ');

      // 6. Fix common typos
      text = text.replace(/ثالثة\s+(?:األصول|الأصول)/gu, 'ثلاثة الأصول');
      text = text.replace(/ثالث\s+خصائص/gu, 'ثلاث خصائص');
      text = text.replace(/ثالث\s+مراتب/gu, 'ثلاث مراتب');
      text = text.replace(/النتظام/gu, 'الانتظام');
      text = text.replace(/الاستسلام\s+هلل/gu, 'الاستسلام لله');
      text = text.replace(/(?:^|[\s«\("])ادليل(?=[\s»\)"،.؛!؟]|$)/gu, ' دليلاً ');
      text = text.replace(/(?:^|[\s«\("])اليمكن(?=[\s»\)"،.؛!؟]|$)/gu, ' لا يمكن ');
      text = text.replace(/إلنسان/gu, 'للإنسان');
      text = text.replace(/ألنها/gu, 'لأنها');

      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const cleanLines = [];
      let insideTOC = false;

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (/^(?:الفهرس|المحتويات|فهرس الموضوعات|جدول المحتويات)/i.test(l)) {
          insideTOC = true;
          continue;
        }
        if (insideTOC) {
          if (/\.{2,}|_{2,}|\b\d+\s*$/.test(l) && l.length < 90) {
            continue;
          } else if (l.length > 90 || /^(?:المقدمة|تمهيد|مدخل|الباب|الفصل|المبحث|المحور)/i.test(l)) {
            insideTOC = false;
          }
        }
        if (/^\d+$/.test(l) || /^[\.\-\s]+$/.test(l)) continue;
        cleanLines.push(l);
      }

      let sanitized = cleanLines.join('\n');
      sanitized = sanitized.replace(/[ \t]+/g, ' ');
      sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

      return sanitized;
    }
