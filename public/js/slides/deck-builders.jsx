    // Two ways to turn a lecture's text into a deck:
    // 1. buildQuickDeck: no AI. Splits by headings, verses and hadiths.
    // 2. The Claude bridge: buildClaudeDeckPrompt gives the teacher a ready
    //    request to paste into Claude (her own account, no cost to the app);
    //    parseClaudeDeckReply turns Claude's answer back into a deck.

    const HEADING_PATTERN = /^(?:#+\s*|(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|المحور|المبحث|المطلب|الفصل|المسألة|الخاتمة|المقدمة|خاتمة|مقدمة)(?=\s|[:：]|$))/;
    const AYAH_PATTERN = /﴿[^﴾]+﴾/;
    // A hadith is quoted text explicitly attributed to the Prophet ﷺ; «» alone
    // is also used for book titles, so it is not enough.
    const HADITH_PATTERN = /(?:قال رسول الله|قال النبي|عن النبي|ﷺ)[^«]*«[^»]{12,}»/;

    function isHeadingLine(line) {
      const t = line.trim();
      if (!t || t.length > 80) return false;
      return HEADING_PATTERN.test(t) || (t.endsWith(':') && t.length < 60);
    }

    function cleanHeading(line) {
      return line.trim().replace(/^#+\s*/, '').replace(/[:：]\s*$/, '').trim();
    }

    // A bullet line is already a point. A paragraph gives one point: its first
    // sentence, kept short; the whole paragraph stays in the teacher's notes.
    const BULLET_PATTERN = /^\s*(?:[•*\-–]|[0-9٠-٩]+[.)])\s*/;
    function paragraphToPoints(text) {
      if (BULLET_PATTERN.test(text)) return [text.replace(BULLET_PATTERN, '').trim()];
      const first = (text.split(/(?<=[.؛!؟])\s+/)[0] || text).trim();
      if (first.length <= 170) return [first];
      const cut = first.slice(0, 165);
      return [cut.slice(0, Math.max(cut.lastIndexOf(' '), 120)) + '…'];
    }

    // Word-processor leftovers: **bold** marks, and verses typed in {braces}.
    function cleanLectureLine(line) {
      return line.replace(/\*\*/g, '').replace(/\{([^}]+)\}/g, '﴿$1﴾').trim();
    }

    function splitSections(lines) {
      const sections = [];
      let current = { heading: '', lines: [] };
      lines.forEach((line) => {
        if (isHeadingLine(line)) {
          if (current.heading || current.lines.length) sections.push(current);
          current = { heading: cleanHeading(line), lines: [] };
        } else if (line.trim()) {
          current.lines.push(line.trim());
        }
      });
      if (current.heading || current.lines.length) sections.push(current);
      return sections;
    }

    function sectionToSlides(section, sectionNumber) {
      const slides = [];
      const notes = [section.heading].concat(section.lines).join('\n');
      if (/^(?:ال)?خاتمة/.test(section.heading)) {
        return [normalizeSlide({ layout: 'closing', title: section.heading, body: section.lines.join(' '), notes })];
      }
      let points = [];
      // At most two slides of points per heading; the rest of the section is
      // still in the teacher's notes.
      const flushPoints = () => {
        points = points.slice(0, 8);
        for (let i = 0; i < points.length; i += 4) {
          slides.push(normalizeSlide({
            layout: 'points',
            eyebrow: 'المحور ' + sectionNumber.toLocaleString('ar-EG'),
            title: section.heading + (i > 0 ? ' (تابع)' : ''),
            items: points.slice(i, i + 4).map((t) => ({ title: '', text: t })),
            notes
          }));
        }
        points = [];
      };
      section.lines.forEach((line) => {
        const ayah = line.match(AYAH_PATTERN);
        if (ayah) {
          flushPoints();
          const source = (line.replace(ayah[0], '').match(/[\[(]([^\])]+)[\])]/) || [])[1] || '';
          slides.push(normalizeSlide({ layout: 'ayah', eyebrow: section.heading, quote: { text: ayah[0], source }, notes }));
        } else if (HADITH_PATTERN.test(line)) {
          flushPoints();
          // «text» becomes the quote; what follows it (e.g. متفق عليه) is the source.
          const quoted = line.match(/«[^»]+»/);
          const text = quoted ? quoted[0] : line;
          const source = quoted ? line.slice(line.indexOf(quoted[0]) + quoted[0].length).replace(/^[\s.،:-]+/, '').trim() : '';
          const lead = quoted ? line.slice(0, line.indexOf(quoted[0])).replace(/[:\s]+$/, '').trim() : '';
          slides.push(normalizeSlide({ layout: 'hadith', eyebrow: section.heading, title: lead, quote: { text, source }, notes }));
        } else {
          points = points.concat(paragraphToPoints(line));
        }
      });
      flushPoints();
      if (!slides.length && section.heading) {
        slides.push(normalizeSlide({ layout: 'section', eyebrow: 'المحور ' + sectionNumber.toLocaleString('ar-EG'), title: section.heading, notes }));
      }
      return slides;
    }

    function buildQuickDeck(lectureText) {
      const lines = (lectureText || '').split(/\r?\n/).map(cleanLectureLine);
      const firstLine = lines.find((l) => l.trim()) || 'محاضرة';
      const rest = lines.slice(lines.indexOf(firstLine) + 1);
      const sections = splitSections(rest);
      const slides = [normalizeSlide({ layout: 'cover', title: cleanHeading(firstLine), notes: 'افتتاح المحاضرة: ' + cleanHeading(firstLine) })];
      sections.forEach((sec, i) => { slides.push(...sectionToSlides(sec, i + 1)); });
      return normalizeDeck({ title: cleanHeading(firstLine), slides });
    }

    function buildClaudeDeckPrompt(lectureText) {
      return [
        'أنت تساعد معلّماً (أو معلّمة) للعلوم الشرعية في تحويل محاضرته إلى عرض شرائح يعرضه على طلابه في زوم.',
        'اقرأ المحاضرة أدناه، وافهم محاورها الأساسية، ثم وزّعها على شرائح واضحة.',
        '',
        'قواعد ملزمة:',
        '- لا تضف أي آية أو حديث أو قول عالم غير موجود في نص المحاضرة. انقل الآيات والأحاديث حرفياً كما وردت.',
        '- الآية توضع بين ﴿ ﴾ في layout "ayah"، والحديث أو الأثر في layout "hadith"، مع المصدر إن ذُكر.',
        '- الشريحة لا تحمل أكثر من 4 نقاط، وكل نقطة جملة قصيرة واضحة.',
        '- في "notes" اكتب ما سيقوله المعلم عند هذه الشريحة، مأخوذاً من نص المحاضرة نفسها.',
        '- عدد الشرائح بين 12 و30 حسب طول المحاضرة. ابدأ بشريحة "cover" واختم بشريحة "closing".',
        '- نوّع الألوان (tone) بين المحاور.',
        '',
        'أنواع الشرائح (layout): cover غلاف، section عنوان محور، points نقاط مرقمة، cards بطاقات (2-4)، ayah آية، hadith حديث، compare مقارنة بين أمرين (عنصران في items)، closing خاتمة.',
        'الألوان (tone): pearl، sage، amber، sky، lavender.',
        '',
        'أعد النتيجة JSON فقط، داخل ```json ... ```، بهذا الشكل بالضبط:',
        '```json',
        JSON.stringify({
          title: 'عنوان المحاضرة', series: 'اسم السلسلة (اختياري)',
          slides: [
            { layout: 'cover', tone: 'pearl', eyebrow: 'اسم السلسلة', title: 'عنوان المحاضرة', body: 'سطر تعريفي', notes: 'ما يقوله المعلم' },
            { layout: 'cards', tone: 'sage', eyebrow: 'المحور الأول', title: 'عنوان', body: 'تمهيد قصير', items: [{ title: 'عنوان البطاقة', text: 'شرح قصير' }], footer: 'سطر ختامي (اختياري)', notes: '...' },
            { layout: 'ayah', tone: 'amber', eyebrow: 'الدليل', title: '', quote: { text: '﴿...﴾', source: 'سورة ... الآية ...' }, body: 'وجه الدلالة', notes: '...' }
          ]
        }, null, 2),
        '```',
        '',
        '=== نص المحاضرة ===',
        lectureText || ''
      ].join('\n');
    }

    // Claude's reply may wrap the JSON in prose or code fences, and may hold
    // more than one block: the block that parses with the most slides wins.
    // Returns { deck, warnings } where warnings lists anything changed or dropped.
    function parseClaudeDeckReply(reply) {
      const text = (reply || '').trim();
      const candidates = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1]);
      if (text.includes('{')) candidates.push(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
      if (!candidates.some((c) => c.trim())) throw new Error('لا يوجد في الرد عرض بصيغة JSON. المطلوب نسخ رد Claude كاملاً.');
      let best = null;
      candidates.forEach((c) => {
        try {
          const parsed = JSON.parse(c);
          const count = parsed && Array.isArray(parsed.slides) ? parsed.slides.length : 0;
          if (!best || count > best.count) best = { parsed, count };
        } catch (e) { /* not this block; another may be the deck */ }
      });
      if (!best) throw new Error('رد Claude غير مكتمل أو فيه خطأ في الصيغة. الحل: طلب إعادة إرسال JSON كاملاً منه.');
      const warnings = [];
      const deck = normalizeDeck(best.parsed, warnings);
      if (!deck.slides.length) throw new Error('الرد لا يحتوي على أي شريحة.');
      return { deck, warnings };
    }
