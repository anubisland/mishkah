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

    // Accepts anything shaped roughly like a slide (from the quick splitter,
    // from Claude, or from storage) and returns a complete, safe slide.
    function normalizeSlide(raw) {
      const s = raw || {};
      const layout = SLIDE_LAYOUTS.some((l) => l.id === s.layout) ? s.layout : 'points';
      const tone = SLIDE_TONES.some((t) => t.id === s.tone) ? s.tone : 'pearl';
      const size = SLIDE_SIZES.some((z) => z.id === s.size) ? s.size : 'medium';
      const items = Array.isArray(s.items) ? s.items.map((it) => (
        typeof it === 'string' ? { title: '', text: asText(it) } : { title: asText(it && it.title), text: asText(it && it.text) }
      )).filter((it) => it.title || it.text) : [];
      const quote = s.quote && (s.quote.text || s.quote.source)
        ? { text: asText(s.quote.text), source: asText(s.quote.source) }
        : null;
      return {
        id: s.id || newSlideId(),
        layout, tone, size,
        eyebrow: asText(s.eyebrow),
        title: asText(s.title),
        body: asText(s.body),
        items,
        quote,
        footer: asText(s.footer),
        notes: asText(s.notes)
      };
    }

    function normalizeDeck(raw) {
      const d = raw || {};
      const slides = (Array.isArray(d.slides) ? d.slides : []).map(normalizeSlide);
      return { title: asText(d.title), subtitle: asText(d.subtitle), series: asText(d.series), slides };
    }

    function blankSlide(layout) {
      return normalizeSlide({ layout: layout || 'points', title: 'عنوان الشريحة', items: [{ title: '', text: 'النقطة الأولى' }] });
    }
