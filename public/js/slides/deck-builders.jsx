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
    // A hadith pasted from Dorar comes as three lines: its text, «خلاصة حكم
    // المحدث : صحيح», and «الراوي : … | المحدث : …». They are joined into one
    // line «text» — الراوي: … | المحدث: … | صحيح, the words left as they are.
    const DORAR_HADITH = /^«[^»]{12,}»\s*—\s*الراوي:/;
    // Index of the quotation mark that opens the line's last quotation, or -1.
    // A plain " opens only when an even number of " come before it.
    function lastOpeningQuote(s) {
      for (let k = s.length - 1; k >= 0; k--) {
        const c = s[k];
        if (c === '«' || c === '“') return k;
        if (c === '"' && (s.slice(0, k).split('"').length - 1) % 2 === 0) return k;
      }
      return -1;
    }

    function joinDorarHadiths(lines) {
      const out = [];
      for (let i = 0; i < lines.length; i++) {
        const grade = lines[i].trim().match(/^خلاصة حكم المحدث\s*[:：]\s*(.+)$/);
        const narr = grade && (lines[i + 1] || '').trim().match(/^الراوي\s*[:：]\s*([^|]+?)\s*\|\s*المحدث\s*[:：]\s*([^|]+?)\s*(?:\||$)/);
        let p = out.length - 1;
        while (p >= 0 && !out[p].trim()) p--;
        if (!grade || !narr || p < 0) { out.push(lines[i]); continue; }
        // The hadith is the whole line before, unless that line is a paragraph
        // ending with a quotation opened after a lead-in («…قال:» or «…،»):
        // then only the quotation. Text that already holds «» is left as the
        // three lines it was, so its wording can never be cut.
        const prev = out[p].trim();
        let text = prev;
        let before = '';
        const open = lastOpeningQuote(prev);
        // A short frame before the quote («أن رجلاً قال: …») is part of the
        // hadith as Dorar gives it; only a long lead-in is the teacher's own.
        if (open > 80 && /[:،,]\s*$/.test(prev.slice(0, open))) {
          const quoted = prev.slice(open + 1).replace(/[»"”]\s*$/, '').trim();
          if (quoted.length >= 12) { text = quoted; before = prev.slice(0, open).trim(); }
        }
        if (/[«»]/.test(text)) { out.push(lines[i]); continue; }
        const hadith = '«' + text + '» — الراوي: ' + narr[1].trim() + ' | المحدث: ' + narr[2].trim() + ' | ' + grade[1].trim();
        out.splice(p, 1, ...(before ? [before, hadith] : [hadith]));
        i++; // the «الراوي» line is used
      }
      return out;
    }

    // A heading is either marked (أولاً، المحور، #، or ending with «:»), or a
    // short line of its own, numbered or not, with no closing punctuation and
    // longer text after it, as teachers usually type headings in Word. A run
    // of short numbered lines is a list, not headings.
    const NUMBERED_LINE = /^\s*(?:[0-9٠-٩]+|[أ-ي])\s*[-.)–:]\s*/;
    // «قال الله تعالى» or «قال رسول الله ﷺ» on its own line introduces the
    // ayah or hadith on the next line: it is joined to it, never a heading.
    const LEAD_IN = /^(?:و?قال|يقول|و?عن|روى|أخرج)\s/;
    function isHeadingLine(line, next) {
      const t = line.trim();
      if (!t || t.length > 80) return false;
      // A bulleted line (• * - –) is a point, never a heading.
      if (/^[•*\-–]/.test(t)) return false;
      if (HEADING_PATTERN.test(t) || (t.endsWith(':') && t.length < 60)) return true;
      if (t.length > 60 || t.split(/\s+/).length > 8) return false;
      if (/^[\s0-9٠-٩\-–—|/.]+$/.test(t) || LEAD_IN.test(t)) return false;
      if (AYAH_PATTERN.test(t) || /[«»]/.test(t) || /[.،؛!؟,]$/.test(t)) return false;
      const n = (next || '').trim();
      if (!n || n.length <= t.length) return false;
      return !(NUMBERED_LINE.test(t) && NUMBERED_LINE.test(n));
    }

    function cleanHeading(line) {
      return line.trim().replace(/^#+\s*/, '').replace(NUMBERED_LINE, '').replace(/[:：]\s*$/, '').trim();
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

    function splitSections(lines, markedOnly) {
      const sections = [];
      let current = { heading: '', lines: [] };
      // Join a short lead-in line to the ayah or hadith that follows it, and
      // drop lines that are only a page number (PDF headers and footers).
      lines = joinDorarHadiths(lines.filter((l) => !/^[\s0-9٠-٩\-–—|/.]+$/.test(l) || !l.trim())).reduce((out, l) => {
        const prev = out[out.length - 1];
        if (prev && prev.trim().length < 60 && LEAD_IN.test(prev.trim()) && /^\s*[﴿«]/.test(l)) out[out.length - 1] = prev.trim() + ' ' + l.trim();
        else out.push(l);
        return out;
      }, []);
      const nextText = (i) => lines.slice(i + 1).find((l) => l.trim()) || '';
      // «المحور الأول: …» is a main axis; the headings under it (أولاً، 1.)
      // carry its name above their slides instead of a new «المحور» number.
      let main = '';
      lines.forEach((line, i) => {
        if (isHeadingLine(line, markedOnly ? '' : nextText(i))) {
          if (current.heading || current.lines.length) sections.push(current);
          const heading = cleanHeading(line);
          if (/^المحور\s/.test(heading)) main = heading.split(/[:：]/)[0].trim();
          // An introduction, conclusion or chapter is not under the last axis.
          else if (/^(?:ال)?(?:مقدمة|خاتمة)|^(?:المبحث|الفصل|فوائد|الأسئلة|التطبيق)/.test(heading)) main = '';
          current = { heading, main, lines: [] };
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
            eyebrow: section.main || ('المحور ' + sectionNumber.toLocaleString('ar-EG')),
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
        } else if (HADITH_PATTERN.test(line) || DORAR_HADITH.test(line)) {
          flushPoints();
          // «text» becomes the quote; what follows it (e.g. متفق عليه) is the source.
          const quoted = line.match(/«[^»]+»/);
          const text = quoted ? quoted[0] : line;
          const source = quoted ? line.slice(line.indexOf(quoted[0]) + quoted[0].length).replace(/^[\s.،:—-]+/, '').trim() : '';
          const lead = quoted ? line.slice(0, line.indexOf(quoted[0])).replace(/[:\s]+$/, '').trim() : '';
          slides.push(normalizeSlide({ layout: 'hadith', eyebrow: section.heading, title: lead, quote: { text, source }, notes }));
        } else {
          points = points.concat(paragraphToPoints(line));
        }
      });
      flushPoints();
      if (!slides.length && section.heading) {
        slides.push(normalizeSlide({ layout: 'section', eyebrow: section.main || ('المحور ' + sectionNumber.toLocaleString('ar-EG')), title: section.heading, notes }));
      }
      return slides;
    }

    // markedOnly: only marked headings (a PDF wraps lines, so short lines mislead).
    function buildQuickDeck(lectureText, markedOnly) {
      const lines = (lectureText || '').split(/\r?\n/).map(cleanLectureLine);
      const firstLine = lines.find((l) => l.trim()) || 'محاضرة';
      const rest = lines.slice(lines.indexOf(firstLine) + 1);
      const sections = splitSections(rest, markedOnly);
      const slides = [normalizeSlide({ layout: 'cover', title: cleanHeading(firstLine), notes: 'افتتاح المحاضرة: ' + cleanHeading(firstLine) })];
      sections.forEach((sec, i) => { slides.push(...sectionToSlides(sec, i + 1)); });
      // Text taken from a PDF can carry broken Quranic words: each ayah slide
      // is flagged, on the slide itself, until the teacher checks it.
      if (markedOnly) {
        slides.forEach((s, i) => {
          if (s.layout === 'ayah') {
            slides[i] = normalizeSlide(Object.assign({}, s, {
              eyebrow: '⚠️ تُراجع الآية على المصحف',
              notes: '⚠️ نص هذه الآية منقول من ملف PDF وقد تكون حروفه مكسورة: يُراجع على المصحف ويُصحَّح، ثم يُحذف هذا التنبيه من أعلى الشريحة.\n' + (s.notes || '')
            }));
          }
        });
      }
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
