    // The student window during a tajweed class: the page of «التجويد المصور»
    // the teacher is on, as large as the window allows. The book is read from
    // this browser (book-file.jsx), the same copy the teacher chose.
    function StudentBookView({ stage }) {
      const book = useTajweedBookDoc(0);
      const [boxRef, size] = useElementSize();
      const printed = stage.page - readBookNumber(TAJWEED_BOOK_OFFSET_KEY, TAJWEED_BOOK_DEFAULT_OFFSET);
      const chapter = tajweedBookChapterFor(printed);
      return (
        <StudentFrame title={chapter ? chapter.title : 'التجويد المصور'} subtitle={'التجويد المصور — د. أيمن رشدي سويد' + (printed >= 1 ? ' • صفحة ' + printed : '')}>
          <div className="relative w-full h-full self-stretch">
          {/* Absolutely placed, so the page drawn inside cannot grow the box it is measured from. */}
          <div ref={boxRef} className="absolute inset-0 flex items-center justify-center">
            {book.status === 'ready' && size.width > 0 && (
              <BookPageCanvas doc={book.doc} page={Math.min(stage.page, book.doc.numPages)} focus={stage.focus || 'full'} maxWidth={size.width} maxHeight={size.height} />
            )}
            {book.status === 'loading' && <p className="text-gold-200 font-bold text-xl">جارٍ فتح الكتاب…</p>}
            {(book.status === 'missing' || book.status === 'error') && (
              <p className="text-gold-200 font-bold text-xl text-center">لم يُفتح الكتاب في هذه الشاشة. تُفتح شاشة الطالب من البرنامج نفسه على الجهاز الذي اختير عليه ملف الكتاب.</p>
            )}
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
