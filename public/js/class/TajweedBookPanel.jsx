    // The teacher's tajweed panel in class mode: the lesson is taught straight
    // from the book — «التجويد المصور» page by page in its own order, each
    // picture beside its text, or the charts of «أطلس التجويد» to sum up.
    // books: useTajweedBooks() (ClassMode owns it so the student window
    // follows). onReadFromPage(page): reading practice from a mushaf page.
    function TajweedBookPanel({ books, onReadFromPage }) {
      return (
        <>
          <div className="flex gap-2">
            {TAJWEED_BOOKS.map((b) => (
              <button key={b.id} type="button" className={'flex-1 ' + classPill(books.bookId === b.id)} onClick={() => books.setBookId(b.id)}>{b.label}</button>
            ))}
          </div>
          <TajweedBookPanelBody place={books.place} info={tajweedBookInfo(books.bookId)} onReadFromPage={onReadFromPage} />
        </>
      );
    }

    function TajweedBookPanelBody({ place, info, onReadFromPage }) {
      const [version, setVersion] = useState(0);
      const book = useTajweedBookDoc(info.id, version);
      const [error, setError] = useState('');
      const [busy, setBusy] = useState(false);
      const [boxRef, boxWidth] = useElementWidth();
      // The place needs the page count to keep the page inside the book.
      useEffect(() => { if (book.status === 'ready') place.setTotal(book.doc.numPages); }, [book.status, book.doc]);

      const choose = async (file) => {
        if (!file) return;
        setBusy(true);
        const err = await saveTajweedBookFile(info.id, file);
        setBusy(false);
        setError(err || '');
        if (!err) setVersion((v) => v + 1);
      };

      if (book.status === 'loading') return <section className="bg-white rounded-2xl p-4 font-bold text-emerald-900">جارٍ فتح الكتاب…</section>;
      if (book.status !== 'ready') {
        return (
          <>
            <section className="card-islamic-pearl rounded-2xl p-4 border-2 border-gold-300 space-y-3">
              <h3 className="text-lg font-black text-emerald-950">{info.label}</h3>
              <p className="text-sm text-slate-700">يُختار ملف الكتاب (PDF) مرة واحدة على هذا الجهاز، فيبقى محفوظاً في المتصفح ولا يُرفع إلى أي مكان. ثم تُعرض صفحاته للطلاب بترتيب الكتاب.</p>
              <label className="inline-block px-4 py-2 rounded-xl bg-emerald-900 text-gold-200 font-black cursor-pointer">
                {busy ? 'جارٍ الحفظ…' : '📂 اختيار ملف الكتاب'}
                <input type="file" accept="application/pdf,.pdf" className="hidden" disabled={busy} onChange={(e) => choose(e.target.files[0])} />
              </label>
              {(error || book.error) && <p className="text-rose-700 font-bold text-sm">{error || book.error}</p>}
            </section>
            {onReadFromPage && <TajweedReadingPicker onRead={onReadFromPage} />}
          </>
        );
      }

      const total = book.doc.numPages;
      const page = Math.min(Math.max(1, place.pdfPage), total);
      const chapter = tajweedBookChapterFor(info.id, page - place.offset);
      const go = (p) => place.setPdfPage(Math.min(total, Math.max(1, p)));
      const focusPill = (id, label) => (
        <button type="button" className={classPill(place.focus === id)} onClick={() => place.setFocus(id)}>{label}</button>
      );

      return (
        <>
          <section className="bg-white rounded-2xl p-3 border border-emerald-900/10 space-y-3">
            {info.chapters.length > 0 && (
              <select value={chapter ? chapter.page : ''} onChange={(e) => place.openPrinted(parseInt(e.target.value, 10))}
                className="w-full border-2 border-emerald-900/15 rounded-xl px-2 py-2 font-bold">
                {!chapter && <option value="">مقدمة الكتاب</option>}
                {info.chapters.map((c, i) => <option key={c.page} value={c.page}>{(i + 1) + '. ' + c.title + ' (ص ' + c.page + ')'}</option>)}
              </select>
            )}
            <div className="flex items-center gap-2">
              <button type="button" className={'order-last ' + classPill(false)} disabled={page <= 1} onClick={() => go(page - 1)}>السابقة ←</button>
              <span className="flex-1 text-center font-black text-emerald-950 text-sm">
                {page - place.offset >= 1 ? 'صفحة ' + (page - place.offset) + ' من الكتاب' : 'من أول الكتاب'}
              </span>
              <button type="button" className={'order-first ' + classPill(true)} disabled={page >= total} onClick={() => go(page + 1)}>→ التالية</button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-bold text-slate-600">يرى الطلاب:</span>
              {focusPill('full', 'الصفحة كاملة')}
              {focusPill('right', 'النصف الأيمن مكبَّراً')}
              {focusPill('left', 'النصف الأيسر مكبَّراً')}
            </div>
            <div ref={boxRef} className="flex justify-center bg-slate-100 rounded-xl p-2">
              {boxWidth > 0 && <BookPageCanvas doc={book.doc} page={page} focus="full" maxWidth={boxWidth - 16} maxHeight={420} />}
            </div>
            <BookPageJump total={total} offset={place.offset} onOpen={place.openPrinted} />
          </section>
          {onReadFromPage && <TajweedReadingPicker onRead={onReadFromPage} />}
          <BookSettings place={place} onChooseAgain={choose} busy={busy} error={error} />
        </>
      );
    }

    function BookPageJump({ total, offset, onOpen }) {
      const [value, setValue] = useState('');
      const open = () => {
        const n = parseInt(value, 10);
        if (n >= 1 && n + offset <= total) { onOpen(n); setValue(''); }
      };
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-600">الذهاب إلى صفحة:</span>
          <input type="number" min="1" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') open(); }}
            className="w-24 border-2 border-emerald-900/15 rounded-xl px-2 py-1 font-bold" />
          <button type="button" className={classPill(false)} onClick={open}>فتح</button>
        </div>
      );
    }

    // Set once: correcting the chapter pages, or choosing the file again.
    function BookSettings({ place, onChooseAgain, busy, error }) {
      return (
        <details className="bg-white/80 rounded-2xl p-3 border border-emerald-900/10 text-sm">
          <summary className="font-bold text-emerald-900 cursor-pointer">⚙️ ضبط الكتاب</summary>
          <div className="mt-2 space-y-2">
            <p className="text-slate-700">إذا فتح الفهرس الباب قبل صفحته أو بعدها، يُضبط هنا حتى يطابق رقمُ الصفحة المكتوب أسفلها الرقمَ الظاهر في اللوحة:</p>
            <div className="flex items-center gap-2">
              <button type="button" className={classPill(false)} onClick={() => place.setOffset(place.offset - 1)}>الرقم المكتوب أكبر بصفحة</button>
              <button type="button" className={classPill(false)} onClick={() => place.setOffset(place.offset + 1)}>الرقم المكتوب أصغر بصفحة</button>
            </div>
            <label className="inline-block px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold cursor-pointer">
              {busy ? 'جارٍ الحفظ…' : '📂 اختيار ملف الكتاب من جديد'}
              <input type="file" accept="application/pdf,.pdf" className="hidden" disabled={busy} onChange={(e) => onChooseAgain(e.target.files[0])} />
            </label>
            {error && <p className="text-rose-700 font-bold">{error}</p>}
          </div>
        </details>
      );
    }
