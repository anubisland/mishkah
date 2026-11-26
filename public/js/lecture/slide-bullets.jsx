    // Intelligent Islamic Lecture & Document Parsing Engine
    
    // Helper to clean book metadata & author names from slide titles (strictly 3-6 words, no paragraph spill)
    function cleanSlideTitle(rawTitle) {
      if (!rawTitle) return 'محور الدرس ومسائله';
      let t = sanitizeArabicExtractedText(rawTitle);
      t = t.replace(/(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)/gu, 'أَقَامُوا الصَّلَاةَ');
      t = t.replace(/(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)\s*(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
      t = t.replace(/(?:^|[\s«\("])وأخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' وأخلاقه ');
      t = t.replace(/(?:^|[\s«\("])أخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاقه ');
      t = t.replace(/(?:^|[\s«\("])أخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاق ');
      t = t.replace(/(?:^|[\s«\("])الأخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' الأخلاق ');
      t = t.replace(/ملسو\s+هيلع\s+هللا\s+ىلص/gu, 'صلى الله عليه وسلم');
      t = t.replace(/ىلص\s+هللا\s+هيلع\s+ملسو/gu, 'صلى الله عليه وسلم');
      t = t.replace(/(?:ة\s+الَّ?\s*صلا\s+اوُماَقَأ|اوُماَقَأ\s+صلا\s+الَّ?\s*ة|اوُماَقَأ\s+الصَّ?\s*لا\s*ةَ?|أَقَامُوا\s+الصَّ?\s*لا\s*ةَ?|ةَ?\s*ال\s*َّصلا\s*اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');

      // Diacritic-insensitive check for Card 10 and common prayer headings
      const noDiacriticsT = t.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').trim();
      if (/^(?:ة\s+ال\s+صلا\s+أقاموا|ة\s+ال\s+صلا\s+اقاموا|أقاموا\s+الصلاة|اقامة\s+الصلاة|إقامة\s+الصلاة|أقاموا\s+الص\s+لا\s+ة)$/i.test(noDiacriticsT)) {
        t = 'إِقَامَةُ الصَّلَاةِ';
      }
      if (/^(?:آال|اال|آل|أل|إال|إلا)$/u.test(t) || /^(?:آال|اال|آل|أل|إال|إلا)$/u.test(noDiacriticsT)) {
        t = 'شروط الشفاعة وضوابطها';
      }

      // Strip leading diacritics, numbers, symbols, and heading markers
      t = t.replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED\s#*\-•\d\.\)\:،=]+/, '').replace(/[*#]/g, '').trim();
      // Remove outline/bullet markers like '2ب.' or 'ب.' or 'أ.' or 'ج.' at start of titles
      t = t.replace(/^(?:\d+\s*[أ-ي]\s*[\.\-\)]|[أ-ي]\s*[\.\-\)]|\d+[\.\-\)])\s*/u, '').trim();
      t = t.replace(/^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|حادي عشر|ثاني عشر|المحور \d+|المبحث \d+|المطلب \d+|الفصل \d+|\d+[\-\.\)]|Theme \d+)[:\s–—.-]*/i, '').trim();

      // If title contains an inline delimiter like colon ':' or dash '–' or '—', extract strictly what is before it!
      const delimiterMatch = t.match(/^([^:\-\—–\n]{3,50})[:\-\—–]\s*(.+)$/);
      if (delimiterMatch) {
        t = delimiterMatch[1].trim();
      }

      // Clean out trailing explanatory clauses starting with common continuation phrases
      t = t.split(/(?:\s+(?:لماذا|كيف|يُ?ثبت\s+الوحي|يُ?ثبت\s+أن|بحيث|والحاصل|وفي هذا المحور|وهو\s+دين|وهذا\s+القسم)|\s*\(\s*سواء)/)[0].trim();

      // Clean publishing metadata if any leaked in
      t = t.replace(/(?:تأليف\s*[:：]|للمؤلف\s*[:：]|دار\s+(?:النشر|الوعي|الفكر)|تحقيق\s*[:：]|إعداد\s*[:：]|طبعة\s*[:：]|صفحة\s*\d+|ردمك|ISBN)[\s\S]*$/, '').trim();

      // Remove trailing punctuation or open brackets
      t = t.replace(/[\(（\[:\-\s،؛.]+$/, '').trim();
      const openP = (t.match(/[\(（]/g) || []).length;
      const closeP = (t.match(/[\)）]/g) || []).length;
      if (openP > closeP) t += ')';

      // Strip again if any stray leading diacritics remained
      t = t.replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED]+/, '').trim();

      // If title is just a bare ordinal, return standard title
      if (/^(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|أولا|ثانيا|ثالثا|رابعا)$/.test(t) || t.length < 4) {
        return 'محور الدرس ومسائله';
      }

      // Handle questions ending with ؟ (e.g., حكم صلاة الجمعة لمن صلى العيد؟)
      t = t.replace(/^سs*[ً-ٰٟۖ-ۭs]*ماs*حُ?كمs*/u, 'حكم ');
      t = t.replace(/^سs*[:：-]?s*/u, '');
      t = t.replace(/(?:^|[s«("])صَالة(?=[s»)"،.؛!؟]|$)/gu, ' صلاة ');
      t = t.replace(/صَالةs+الجُمُعة/gu, 'صلاة الجمعة');
      t = t.replace(/صَالةs+العِيد/gu, 'صلاة العيد');
      const noDiacriticsClean = t.replace(/[ً-ٰٟۖ-ۭ]/g, '').trim();
      if (t.includes('؟') && noDiacriticsClean.length <= 75) {
        return t.split('؟')[0].trim() + '؟';
      }

      // Cap length gracefully at 65 characters without cutting off words
      if (noDiacriticsClean.length > 65) {
        const sp = t.substring(0, 62).lastIndexOf(' ');
        t = (sp > 25 ? t.substring(0, sp) : t.substring(0, 58)).trim();
      }

      return t || rawTitle || 'محور الدرس ومسائله';
    }

    // Professional Pedagogical Slide Synthesizer: Distills lecture text into 2-3 dignified, golden bullet points (strictly uncluttered)
    function extractConciseSlideBullets(lines, secTitle) {
      const bullets = [];
      const isNoiseLine = (t) => /^(?:ملاحظة منهجية|هذا الملخص|نسخة ممسوحة|التعرف على نصوصها|أخطاء طباعية|دار النشر|دار الوعي|طبعة ورقية|ملحق تعقيبي|ردمك|ISBN|\(?\d+\s*صفحة\)?)/i.test(t);

      const cleanTitle = cleanSlideTitle(secTitle);
      const validLines = (lines || []).filter(l => l && !isNoiseLine(l));

      const polishBullet = (b) => {
        if (!b) return '';
        let s = b.replace(/^[#*\-•\s\d\.\)\:،=]+/, '').trim();
        s = s.replace(/\s{2,}/g, ' ');
        if (s.startsWith('ناسنإ')) s = s.replace(/^ناسنإ/, 'إنسان');

        // Strip dangling prepositions or truncated endings
        s = s.replace(/\s+(?:بوصفه|بحيث|من حيث|أل ن ها|ألنه|أل نها)\s*[\u064B-\u0652]?$/, '').trim();
        s = s.replace(/\s+(?:من|إلى|عن|على|في|مع|بين|أن|إن|بأن|حيث|كما|إذ|دون|و|أو|التي|الذي|الذين|ما|لا|كل|عند|قبل|بعد|نحو|ضد|مثل|غير|أثر|اول)\s*$/, '').trim();
        s = s.replace(/[:：,،؛\s]+$/, '').trim();

        // Preserve complete thoughts and grammatical integrity
        if (s.length > 300) {
          const dotPos = s.substring(0, 280).lastIndexOf('.');
          const qPos = s.substring(0, 280).lastIndexOf('؟');
          const stopPos = dotPos > 80 ? dotPos : (qPos > 80 ? qPos : -1);
          if (stopPos > 60) {
            s = s.substring(0, stopPos + 1).trim();
          }
        }
        return s;
      };

      // A. Extract discrete items from outline lines or bullet delimiters (•, -, *, numbers)
      for (const line of validLines) {
        const l = line.trim();
        if (l.includes('•')) {
          const parts = l.split('•').map(p => p.trim()).filter(Boolean);
          for (const p of parts) {
            const cleaned = polishBullet(p);
            if (cleaned.length >= 10 && !cleaned.startsWith('العناصر') && !bullets.includes(cleaned)) {
              bullets.push(cleaned);
            }
          }
        } else if (/^(?:[•\-\*]|\d+[\.\-\)]|[أ-ي][\.\-\)])\s+/.test(l)) {
          const cleaned = polishBullet(l);
          if (cleaned.length >= 12 && !bullets.includes(cleaned)) {
            bullets.push(cleaned);
          }
        }
        if (bullets.length >= 3) break;
      }

      // B. If fewer than 3 bullets, extract from sentence boundaries across all lines
      if (bullets.length < 3) {
        const joinedText = validLines.join(' ')
          .replace(/«\s*﴿[^﴾]*﴾\s*»/g, '')
          .replace(/﴿[^﴾]*﴾/g, '')
          .replace(/\[[^\]]+\]/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        const rawClauses = joinedText
          .split(/(?<=[.؛!؟])\s+|\s+(?:بل|حيث إن|إذ إن|وعليه فإن|والواجب أن|ويقرر النص أن)\s+/)
          .map(s => s.trim())
          .filter(s => s.length >= 20 && !isNoiseLine(s));

        for (let s of rawClauses) {
          let c = s.replace(/^[#*\-•\s\d\.\)\:،]+/, '').trim();
          c = c.replace(/^(?:قائلاً|القائل|وقوله|قوله|في قوله)\s*[:：]?\s*/u, '').trim();
          c = detectAndInvertReversedArabic(c);
          c = normalizeIslamicSacredTerms(c);
          if (c.includes('؟') || c.includes('?') || /^\(?\s*(?:س |هل |ماذا |كيف |لماذا )/i.test(c)) continue;
          if (/^(?:أولاً|ثانياً|ثالثاً|رابعاً|المحور|المبحث|الأصل|القاعدة)/.test(c)) continue;

          c = polishBullet(c);
          if (c.length >= 18 && !bullets.includes(c)) {
            bullets.push(c);
          }
          if (bullets.length >= 3) break;
        }
      }

      // C. If still fewer than 2 bullets, derive substantive statements directly from actual text words (NEVER generic canned strings!)
      if (bullets.length === 0) {
        const allWords = validLines.join(' ').split(/\s+/).filter(w => w.length > 2);
        if (allWords.length >= 10) {
          bullets.push(polishBullet(allWords.slice(0, 14).join(' ')));
          if (allWords.length >= 20) {
            bullets.push(polishBullet(allWords.slice(14, 28).join(' ')));
          }
        } else {
          bullets.push(`تأصيل وتحرير مسألة: (${cleanTitle})`);
          bullets.push(`بيان الأدلة الشرعية ومقتضيات العمل بموجب: (${cleanTitle})`);
        }
      }

      return bullets.slice(0, 3).map(b => sanitizeArabicExtractedText(b));
    }

    // Synthesize a substantive, complete pedagogical statement for a lecture section.
    // Restored from history: commit 440264e dropped the definition but kept its callers.
    const synthesizeSubstantiveStatement = (title, paragraph) => {
      const st = cleanSlideTitle(title);
      
      // Priority 1: Extract authentic proposition directly from paragraph text
      if (paragraph && paragraph.trim().length > 20) {
        const rawSentences = paragraph.split(/[.؛!؟\n]/).map(s => s.trim()).filter(Boolean);
        const valid = rawSentences.map(s => {
          let cleaned = s.replace(/^[#*\-•\s\d\.\)\:،]+/, '')
                         .replace(/^(?:فإذا|فإن|وحيث إن|ولما كان|كما أن|إذ إن|بل إن|والحاصل أن|فقد تبين أن)\s+/, '')
                         .trim();
          return cleaned;
        }).filter(s => {
          if (s.length < 25 || s.length > 130) return false;
          if (s.includes('؟') || s.includes('?') || /^\(?\s*(?:س |هل |ماذا |كيف |لماذا |أين |متى )/i.test(s)) return false;
          if (s.includes('﴿') || s.includes('﴾') || s.includes('»') || s.includes('«') || /\d+\s*[\]\)]/.test(s)) return false;
          if (/^(?:اعوذ|أعوذ|بسم|الحمد|صلى|اللهم|كأنك|ودليل|وجحدوا|عليه وسلم)/.test(s)) return false;
          if (/(?:من|في|أن|إلى|على|و|أو|أنه|وهو|وهي|التي|الذي|عن|مع|[:：])$/.test(s)) return false;
          return true;
        });

        if (valid.length > 0) {
          let s = valid[0];
          if (s.length > 110) {
            const sp = s.substring(0, 105).lastIndexOf(' ');
            s = (sp > 45 ? s.substring(0, sp) : s.substring(0, 100)).trim();
          }
          s = s.replace(/[:：,،؛\s]+(?:فال|فلا|بل|حيث|و|أو|أن|إن|من|على|إلى|عن|في)?$/, '').trim();
          s = s.replace(/[:：,،؛\s]+$/, '').trim();
          return s;
        }
      }

      // Priority 2: Pedagogical synthesis based on clean title
      return `تأصيل مسائل (${st}) وبيان مقتضاها المنهجي والتربوي في الشريعة`;
    };
