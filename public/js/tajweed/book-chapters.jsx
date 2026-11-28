    // The chapters of «التجويد المصور» (Dr. Ayman Rushdi Suwayd), with the
    // printed page each starts on, from the book's own guide to its chapters
    // («دليل القارئ إلى أبواب الكتاب»). The PDF has a few unnumbered pages
    // before page 1, so PDF page = printed page + offset; the offset can be
    // corrected from the panel if a chapter opens on the wrong page.
    const TAJWEED_BOOK_CHAPTERS = [
      { title: 'القرآن الكريم', titleEn: 'The Noble Quran', page: 7 },
      { title: 'علم التجويد', titleEn: 'The Science of Tajweed', page: 35 },
      { title: 'التعوذ والبسملة', titleEn: "Isti'adhah and Basmalah", page: 53 },
      { title: 'الحروف العربية', titleEn: 'The Arabic Letters', page: 63 },
      { title: 'أعضاء النطق وكيفية حدوث الأصوات والحروف', titleEn: 'The Organs of Speech and How Sounds Are Made', page: 69 },
      { title: 'مخارج الحروف العربية', titleEn: 'The Points of Articulation (Makharij)', page: 93 },
      { title: 'صفات الحروف العربية', titleEn: 'The Qualities of the Letters (Sifat)', page: 125 },
      { title: 'أبرز الأخطاء عند نطق حروف الهجاء', titleEn: 'Common Mistakes in Pronouncing the Letters', page: 207 },
      { title: 'الحرفان المتلاقيان', titleEn: 'Two Letters Meeting', page: 229 },
      { title: 'أحكام الميم والنون', titleEn: 'Rules of Meem and Noon', page: 255 },
      { title: 'المدود', titleEn: 'Prolongation (Madd)', page: 311 },
      { title: 'إتمام الحركات', titleEn: 'Completing the Vowels', page: 377 },
      { title: 'الساكنان المتلاقيان في كلمة وفي كلمتين', titleEn: 'Two Sakin Letters Meeting', page: 389 },
      { title: 'أبحاث متفرقة', titleEn: 'Miscellaneous Topics', page: 395 },
      { title: 'النبر في تلاوة القرآن الكريم', titleEn: 'Stress (Nabr) in Recitation', page: 403 },
      { title: 'كلمات لها وضع خاص على رواية حفص', titleEn: 'Words with Special Readings in Hafs', page: 411 },
      { title: 'الوقف والابتداء', titleEn: 'Stopping and Starting', page: 421 },
      { title: 'الروم والإشمام', titleEn: 'Rawm and Ishmam', page: 475 },
      { title: 'الألفات السبع', titleEn: 'The Seven Alifs', page: 491 },
      { title: 'همزة الوصل', titleEn: 'Hamzat al-Wasl', page: 497 },
      { title: 'همزة القطع', titleEn: "Hamzat al-Qat'", page: 507 },
      { title: 'مراحل تطور كتابة وضبط المصحف الشريف', titleEn: "How the Mushaf's Writing and Marks Developed", page: 517 },
      { title: 'الفرق بين رسم المصحف والرسم الإملائي الحديث', titleEn: 'Mushaf Spelling and Modern Spelling', page: 551 },
      { title: 'حفظ القرآن الكريم', titleEn: 'Memorising the Quran', page: 567 }
    ];
    // The books a tajweed class can be taught from. The book's keys keep
    // their first names so a place saved before the atlas came stays.
    const TAJWEED_BOOKS = [
      { id: 'suwayd', label: '📘 التجويد المصور', title: 'التجويد المصور', author: 'د. أيمن رشدي سويد', storeKey: 'tajweed-suwayd', chapters: TAJWEED_BOOK_CHAPTERS,
        pageKey: 'mishkah_tajweed_book_page', offsetKey: 'mishkah_tajweed_book_offset', defaultOffset: 2 },
      // «أطلس التجويد — دروس نظرية مرئية»: each rule in one coloured chart,
      // for summing up and revising (its credits page: «المادة العلمية: الدكتور
      // أيمن رشدي سويد»). Its chapter pages are not listed yet.
      { id: 'atlas', label: '🎨 أطلس التجويد', title: 'أطلس التجويد', author: 'د. أيمن رشدي سويد', storeKey: 'tajweed-atlas', chapters: [],
        pageKey: 'mishkah_tajweed_atlas_page', offsetKey: 'mishkah_tajweed_atlas_offset', defaultOffset: 0 }
    ];
    const TAJWEED_BOOK_CHOICE_KEY = 'mishkah_tajweed_book_choice';

    function tajweedBookInfo(bookId) {
      return TAJWEED_BOOKS.find((b) => b.id === bookId) || TAJWEED_BOOKS[0];
    }

    function tajweedBookOffset(bookId) {
      const info = tajweedBookInfo(bookId);
      return readBookNumber(info.offsetKey, info.defaultOffset);
    }

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
    function tajweedBookChapterFor(bookId, printed) {
      let found = null;
      tajweedBookInfo(bookId).chapters.forEach((c) => { if (c.page <= printed) found = c; });
      return found;
    }

    // Where the class is in the book: the PDF page shown (remembered, so the
    // next class carries on), the focus, and the page offset.
    function useTajweedBookPlace(bookId) {
      const info = tajweedBookInfo(bookId);
      const [pdfPage, setPdfPageState] = useState(() => Math.max(1, readBookNumber(info.pageKey, 1)));
      // The book's page count, reported by the panel once the book is open.
      const [total, setTotal] = useState(0);
      const clamp = (p) => Math.max(1, total ? Math.min(total, p) : p);
      const page = clamp(pdfPage);
      const [offset, setOffsetState] = useState(() => readBookNumber(info.offsetKey, info.defaultOffset));
      const [focus, setFocus] = useState('full');
      const setPdfPage = (p) => {
        const next = clamp(p);
        if (next === page) return;
        setPdfPageState(next); writeBookNumber(info.pageKey, next); setFocus('full');
      };
      const setOffset = (o) => { setOffsetState(o); writeBookNumber(info.offsetKey, o); };
      return {
        bookId: info.id, pdfPage: page, total, setTotal, focus, offset, setFocus, setOffset, setPdfPage,
        printed: page - offset,
        openPrinted: (printed) => setPdfPage(Math.max(1, printed + offset)),
        stage: { kind: 'book', book: info.id, page, focus, offset }
      };
    }

    // Both books' places, and which one the class is on (remembered).
    function useTajweedBooks() {
      const places = { suwayd: useTajweedBookPlace('suwayd'), atlas: useTajweedBookPlace('atlas') };
      const [bookId, setBookIdState] = useState(() => { try { return localStorage.getItem(TAJWEED_BOOK_CHOICE_KEY) || 'suwayd'; } catch (e) { return 'suwayd'; } });
      const setBookId = (id) => { setBookIdState(id); try { localStorage.setItem(TAJWEED_BOOK_CHOICE_KEY, id); } catch (e) { console.warn('Mishkah: could not remember the tajweed book', e); } };
      return { bookId: places[bookId] ? bookId : 'suwayd', setBookId, place: places[bookId] || places.suwayd, places };
    }
