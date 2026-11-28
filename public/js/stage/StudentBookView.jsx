    // The student window during a tajweed class: the page of «التجويد المصور»
    // the teacher is on, as large as the window allows. The book is read from
    // this browser (book-file.jsx), the same copy the teacher chose.
    function StudentBookView({ stage }) {
      const bookId = stage.book || 'suwayd';
      const info = tajweedBookInfo(bookId);
      const book = useTajweedBookDoc(bookId, 0);
      const [boxRef, size] = useElementSize();
      const printed = stage.page - (stage.offset != null ? stage.offset : tajweedBookOffset(bookId));
      const chapter = tajweedBookChapterFor(bookId, printed);
      // In an English class the teacher may show an English topic beside the page.
      const english = stage.lang === 'en' && stage.english ? stage.english : null;
      const englishEn = stage.lang === 'en';
      return (
        <StudentFrame title={chapter ? (stage.lang === 'en' && chapter.titleEn ? chapter.titleEn : chapter.title) : info.title} subtitle={info.title + (info.author ? ' — ' + info.author : '') + (printed >= 1 ? (englishEn ? ' • page ' : ' • صفحة ') + printed : '')}>
          <div className="w-full h-full self-stretch flex gap-3">
          {english && <div className="w-[42%] shrink-0 order-last"><StudentEnglishTopic english={english} /></div>}
          <div className="relative flex-1 h-full">
          {/* Absolutely placed, so the page drawn inside cannot grow the box it is measured from. */}
          <div ref={boxRef} className="absolute inset-0 flex items-center justify-center">
            {book.status === 'ready' && size.width > 0 && (
              <BookPageCanvas doc={book.doc} page={Math.max(1, Math.min(stage.page, book.doc.numPages))} focus={stage.focus || 'full'} maxWidth={size.width} maxHeight={size.height} />
            )}
            {book.status === 'loading' && <p className="text-gold-200 font-bold text-xl">جارٍ فتح الكتاب…</p>}
            {(book.status === 'missing' || book.status === 'error') && (
              <p className="text-gold-200 font-bold text-xl text-center">لم يُختر ملف الكتاب بعد على هذا الجهاز. يظهر هنا تلقائياً بعد اختياره من لوحة المعلم.</p>
            )}
          </div>
          </div>
          </div>
        </StudentFrame>
      );
    }

    // Width and height of an element, kept current as it resizes.
    function useElementSize() {
      const [size, setSize] = useState({ width: 0, height: 0 });
      const observer = useRef(null);
      const ref = React.useCallback((el) => {
        if (observer.current) observer.current.disconnect();
        if (!el) return;
        const measure = () => setSize({ width: Math.floor(el.clientWidth), height: Math.floor(el.clientHeight) });
        observer.current = new ResizeObserver(measure);
        observer.current.observe(el);
        measure();
      }, []);
      return [ref, size];
    }
