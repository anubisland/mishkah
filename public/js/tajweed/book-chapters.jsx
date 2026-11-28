    // The chapters of «التجويد المصور» (Dr. Ayman Rushdi Suwayd), with the
    // printed page each starts on, from the book's own guide to its chapters
    // («دليل القارئ إلى أبواب الكتاب»). The PDF has a few unnumbered pages
    // before page 1, so PDF page = printed page + offset; the offset can be
    // corrected from the panel if a chapter opens on the wrong page.
    const TAJWEED_BOOK_CHAPTERS = [
      { title: 'القرآن الكريم', page: 7 },
      { title: 'علم التجويد', page: 35 },
      { title: 'التعوذ والبسملة', page: 53 },
      { title: 'الحروف العربية', page: 63 },
      { title: 'أعضاء النطق وكيفية حدوث الأصوات والحروف', page: 69 },
      { title: 'مخارج الحروف العربية', page: 93 },
      { title: 'صفات الحروف العربية', page: 125 },
      { title: 'أبرز الأخطاء عند نطق حروف الهجاء', page: 207 },
      { title: 'الحرفان المتلاقيان', page: 229 },
      { title: 'أحكام الميم والنون', page: 255 },
      { title: 'المدود', page: 311 },
      { title: 'إتمام الحركات', page: 377 },
      { title: 'الساكنان المتلاقيان في كلمة وفي كلمتين', page: 389 },
      { title: 'أبحاث متفرقة', page: 395 },
      { title: 'النبر في تلاوة القرآن الكريم', page: 403 },
      { title: 'كلمات لها وضع خاص على رواية حفص', page: 411 },
      { title: 'الوقف والابتداء', page: 421 },
      { title: 'الروم والإشمام', page: 475 },
      { title: 'الألفات السبع', page: 491 },
      { title: 'همزة الوصل', page: 497 },
      { title: 'همزة القطع', page: 507 },
      { title: 'مراحل تطور كتابة وضبط المصحف الشريف', page: 517 },
      { title: 'الفرق بين رسم المصحف والرسم الإملائي الحديث', page: 551 },
      { title: 'حفظ القرآن الكريم', page: 567 }
    ];
    const TAJWEED_BOOK_PAGE_KEY = 'mishkah_tajweed_book_page';
    const TAJWEED_BOOK_OFFSET_KEY = 'mishkah_tajweed_book_offset';
    const TAJWEED_BOOK_DEFAULT_OFFSET = 2;

    function readBookNumber(key, fallback) {
      try {
        const n = parseInt(localStorage.getItem(key), 10);
        return Number.isFinite(n) ? n : fallback;
      } catch (e) { return fallback; }
    }

    function writeBookNumber(key, n) {
      try { localStorage.setItem(key, String(n)); } catch (e) { console.warn('Mishkah: could not remember the book page', e); }
    }

    // The chapter a printed page belongs to.
    function tajweedBookChapterFor(printed) {
      let found = null;
      TAJWEED_BOOK_CHAPTERS.forEach((c) => { if (c.page <= printed) found = c; });
      return found;
    }

    // Where the class is in the book: the PDF page shown (remembered, so the
    // next class carries on), the focus, and the page offset.
    function useTajweedBookPlace() {
      const [pdfPage, setPdfPageState] = useState(() => readBookNumber(TAJWEED_BOOK_PAGE_KEY, 1));
      const [offset, setOffsetState] = useState(() => readBookNumber(TAJWEED_BOOK_OFFSET_KEY, TAJWEED_BOOK_DEFAULT_OFFSET));
      const [focus, setFocus] = useState('full');
      const setPdfPage = (p) => { setPdfPageState(p); writeBookNumber(TAJWEED_BOOK_PAGE_KEY, p); setFocus('full'); };
      const setOffset = (o) => { setOffsetState(o); writeBookNumber(TAJWEED_BOOK_OFFSET_KEY, o); };
      return {
        pdfPage, focus, offset, setFocus, setOffset, setPdfPage,
        printed: pdfPage - offset,
        openPrinted: (printed) => setPdfPage(Math.max(1, printed + offset)),
        stage: { kind: 'book', page: pdfPage, focus }
      };
    }
