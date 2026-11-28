    // A lecture deck is plain data, so every slide stays editable and the same
    // data drives the studio, the student screen and exported images.
    //
    // deck  = { title, subtitle, series, slides: [slide] }
    // slide = {
    //   id, layout, tone, size,         // layout: see SLIDE_LAYOUTS; tone: SLIDE_TONES; size: small|medium|large
    //   eyebrow, title, body,           // short label above the title, the title, a paragraph
    //   items: [{ title, text }],       // cards / points / the two sides of a comparison
    //   quote: { text, source },        // the verse or hadith of an ayah/hadith slide
    //   footer,                         // one closing line under cards
    //   notes                           // what the teacher says: shown to her only
    // }

    const SLIDE_LAYOUTS = [
      { id: 'cover', label: 'غلاف' },
      { id: 'section', label: 'عنوان محور' },
      { id: 'points', label: 'نقاط مرقّمة' },
      { id: 'cards', label: 'بطاقات' },
      { id: 'ayah', label: 'آية' },
      { id: 'hadith', label: 'حديث أو أثر' },
      { id: 'compare', label: 'مقارنة' },
      { id: 'closing', label: 'خاتمة' }
    ];

    const SLIDE_TONES = [
      { id: 'pearl', label: 'عاجي', swatch: '#F4EEDF' },
      { id: 'sage', label: 'مريمية', swatch: '#E6EFE6' },
      { id: 'amber', label: 'عنبري', swatch: '#F6E8CF' },
      { id: 'sky', label: 'سماوي', swatch: '#E3EEF3' },
      { id: 'lavender', label: 'لافندر', swatch: '#ECE7F1' }
    ];

    const SLIDE_SIZES = [
      { id: 'small', label: 'صغير', scale: 0.88 },
      { id: 'medium', label: 'متوسط', scale: 1 },
      { id: 'large', label: 'كبير', scale: 1.14 }
    ];

    let slideIdCounter = 0;
    function newSlideId() {
      slideIdCounter += 1;
      return 's' + Date.now().toString(36) + slideIdCounter;
    }

    const asText = (v) => (typeof v === 'string' ? v.trim() : (v == null ? '' : String(v).trim()));

    // Names Claude may use for a layout instead of ours.
    const LAYOUT_ALIASES = {
      title: 'cover', intro: 'cover', quote: 'hadith', athar: 'hadith', verse: 'ayah', quran: 'ayah',
      list: 'points', bullets: 'points', grid: 'cards', comparison: 'compare', conclusion: 'closing', summary: 'closing'
    };

    // Common alternative field names (e.g. from Claude) for an item's parts.
    const firstText = (obj, keys) => {
      for (const k of keys) { const v = asText(obj[k]); if (v) return v; }
      return '';
    };
    function normalizeItem(it) {
      if (typeof it === 'string') return { title: '', text: asText(it) };
      if (!it || typeof it !== 'object') return { title: '', text: '' };
      return {
        title: firstText(it, ['title', 'heading', 'name', 'label']),
        text: firstText(it, ['text', 'desc', 'description', 'body', 'content', 'point', 'details'])
      };
    }

    // Accepts anything shaped roughly like a slide (from the quick splitter,
    // from Claude, or from storage) and returns a complete, safe slide.
    // warn(message) is told about anything that had to be changed or dropped.
    function normalizeSlide(raw, warn) {
      const s = raw || {};
      const say = warn || (() => {});
      const wanted = LAYOUT_ALIASES[s.layout] || s.layout;
      const layout = SLIDE_LAYOUTS.some((l) => l.id === wanted) ? wanted : 'points';
      if (s.layout && layout !== wanted) say('النوع «' + s.layout + '» غير معروف، فصارت «نقاط مرقّمة»');
      const tone = SLIDE_TONES.some((t) => t.id === s.tone) ? s.tone : 'pearl';
      const size = SLIDE_SIZES.some((z) => z.id === s.size) ? s.size : 'medium';
      // '' = the deck's frame; otherwise this slide's own frame.
      const frame = DECK_FRAME_IDS.includes(s.frame) ? s.frame : '';
      const rawItems = Array.isArray(s.items) ? s.items : [];
      const items = rawItems.map(normalizeItem).filter((it) => it.title || it.text);
      if (items.length < rawItems.length) say('سقطت ' + (rawItems.length - items.length) + ' من نقاطها لأنها فارغة أو بصيغة غير مفهومة');
      const q = typeof s.quote === 'string' ? { text: s.quote } : s.quote;
      const quote = q && typeof q === 'object' && (q.text || q.source)
        ? { text: asText(q.text), source: asText(q.source) }
        : null;
      if (quote && !['ayah', 'hadith', 'closing'].includes(layout)) {
        say('فيها نص آية أو حديث لا يظهر في نوع «' + SLIDE_LAYOUTS.find((l) => l.id === layout).label + '». يظهر بتغيير نوعها إلى «آية» أو «حديث»');
      }
      return {
        id: typeof s.id === 'string' && s.id ? s.id : newSlideId(),
        layout, tone, size, frame,
        eyebrow: asText(s.eyebrow),
        title: asText(s.title),
        body: asText(s.body),
        items,
        quote,
        footer: asText(s.footer),
        notes: asText(s.notes)
      };
    }

    // warnings (optional array) collects, per slide number, what was changed.
    function normalizeDeck(raw, warnings) {
      const d = raw || {};
      const seen = new Set();
      const slides = (Array.isArray(d.slides) ? d.slides : []).map((s, i) => {
        const slide = normalizeSlide(s, warnings ? (m) => warnings.push('الشريحة ' + (i + 1) + ': ' + m) : null);
        // Every edit, move and delete finds slides by id, so ids must be unique.
        if (seen.has(slide.id)) slide.id = newSlideId();
        seen.add(slide.id);
        return slide;
      });
      const frame = DECK_FRAME_IDS.includes(d.frame) ? d.frame : 'classic';
      // sourceText: the whole lecture, shown to the teacher beside the slides.
      return { title: asText(d.title), subtitle: asText(d.subtitle), series: asText(d.series), frame, sourceText: asText(d.sourceText), slides };
    }

    function blankSlide(layout) {
      return normalizeSlide({ layout: layout || 'points', title: 'عنوان الشريحة', items: [{ title: '', text: 'النقطة الأولى' }] });
    }
