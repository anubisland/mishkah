    // The teacher's own copies of the tajweed books (PDFs chosen once; see
    // TAJWEED_BOOKS in book-chapters.jsx for which). Each is kept in this browser's IndexedDB, never uploaded: the teacher window
    // and the student window (same site, same browser) both read it from
    // there and draw pages with PDF.js.
    const TAJWEED_BOOK_DB = 'mishkah-books';
    const TAJWEED_BOOK_STORE = 'files';
    // Changed whenever the book is chosen or removed, so the other window
    // (teacher or student) reopens it through the storage event.
    const TAJWEED_BOOK_VERSION_KEY = 'mishkah_tajweed_book_version';

    function markTajweedBookChanged() {
      tajweedBookDocPromises = {};
      try { localStorage.setItem(TAJWEED_BOOK_VERSION_KEY, String(Date.now())); } catch (e) { console.warn('Mishkah: could not tell the other window about the book', e); }
    }

    function openBookDb() {
      return new Promise((resolve, reject) => {
        if (!window.indexedDB) { reject(new Error('no indexedDB')); return; }
        const req = indexedDB.open(TAJWEED_BOOK_DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(TAJWEED_BOOK_STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }

    function bookDbRequest(mode, run) {
      return openBookDb().then((db) => new Promise((resolve, reject) => {
        const tx = db.transaction(TAJWEED_BOOK_STORE, mode);
        const req = run(tx.objectStore(TAJWEED_BOOK_STORE));
        tx.oncomplete = () => { db.close(); resolve(req.result); };
        tx.onerror = tx.onabort = () => { db.close(); reject(tx.error || req.error); };
      }));
    }

    // Returns an Arabic error message, or null when kept.
    async function saveTajweedBookFile(bookId, file) {
      if (!file || !/\.pdf$/i.test(file.name || '')) return 'يلزم اختيار ملف الكتاب بصيغة PDF.';
      try {
        await bookDbRequest('readwrite', (s) => s.put({ name: file.name, size: file.size, blob: file }, tajweedBookInfo(bookId).storeKey));
        markTajweedBookChanged();
        return null;
      } catch (e) {
        console.warn('Mishkah: could not keep the tajweed book', e);
        return 'تعذّر حفظ الكتاب في المتصفح (قد تكون مساحة الجهاز ممتلئة، أو التصفح في وضع خاص).';
      }
    }

    function readTajweedBookRecord(bookId) {
      return bookDbRequest('readonly', (s) => s.get(tajweedBookInfo(bookId).storeKey));
    }

    function removeTajweedBookFile(bookId) {
      return bookDbRequest('readwrite', (s) => s.delete(tajweedBookInfo(bookId).storeKey)).then(markTajweedBookChanged);
    }

    // Each opened PDF, shared by every page drawn in this window, by book id.
    // Resolves to null when that book has not been chosen on this device.
    let tajweedBookDocPromises = {};
    function loadTajweedBookDoc(bookId) {
      if (!tajweedBookDocPromises[bookId]) {
        const promise = (async () => {
          if (!window.pdfjsLib) throw new Error('قارئ ملفات PDF لم يُحمَّل.');
          const record = await readTajweedBookRecord(bookId);
          if (!record || !record.blob) return null;
          const data = new Uint8Array(await record.blob.arrayBuffer());
          // isEvalSupported: false — see the PDF.js security note in lecture-actions.jsx.
          return window.pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
        })();
        tajweedBookDocPromises[bookId] = promise;
        // A missing book or a failure is not kept: the next look tries again.
        const forget = () => { if (tajweedBookDocPromises[bookId] === promise) delete tajweedBookDocPromises[bookId]; };
        promise.then((doc) => { if (!doc) forget(); }, forget);
      }
      return tajweedBookDocPromises[bookId];
    }

    // { status: 'loading' | 'missing' | 'ready' | 'error', doc, error }
    function useTajweedBookDoc(bookId, version) {
      const [state, setState] = useState({ status: 'loading' });
      const [changed, setChanged] = useState(0);
      useEffect(() => {
        const onStorage = (e) => {
          if (e.key !== TAJWEED_BOOK_VERSION_KEY) return;
          tajweedBookDocPromises = {};
          setChanged((n) => n + 1);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
      }, []);
      useEffect(() => {
        let alive = true;
        setState({ status: 'loading' });
        loadTajweedBookDoc(bookId).then(
          (doc) => { if (alive) setState(doc ? { status: 'ready', doc } : { status: 'missing' }); },
          (e) => {
            console.warn('Mishkah: could not open the tajweed book', e);
            if (alive) setState({ status: 'error', error: 'تعذّر فتح ملف الكتاب. يمكن اختياره مرة أخرى.' });
          }
        );
        return () => { alive = false; };
      }, [bookId, version, changed]);
      return state;
    }

    // Draws one page of the book to fit the given box. focus: 'full', or
    // 'right' / 'left' to show that half larger (the picture or the text).
    function BookPageCanvas({ doc, page, focus, maxWidth, maxHeight }) {
      const canvasRef = useRef(null);
      const [error, setError] = useState('');
      const [shape, setShape] = useState(null);
      useEffect(() => {
        let alive = true;
        let task = null;
        setError('');
        doc.getPage(page).then((p) => {
          if (!alive) return;
          const base = p.getViewport({ scale: 1 });
          const half = focus === 'right' || focus === 'left';
          const shownW = half ? base.width / 2 : base.width;
          const fit = Math.min(maxWidth / shownW, maxHeight / base.height);
          const ratio = Math.min(2, window.devicePixelRatio || 1);
          const viewport = p.getViewport({ scale: fit * ratio });
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = viewport.width; canvas.height = viewport.height;
          setShape({ w: base.width * fit, h: base.height * fit, shownW: shownW * fit, shift: focus === 'left' ? 0 : focus === 'right' ? -shownW * fit : 0 });
          task = p.render({ canvasContext: canvas.getContext('2d'), viewport });
          return task.promise;
        }).catch((e) => {
          if (!alive || (e && e.name === 'RenderingCancelledException')) return;
          console.warn('Mishkah: could not draw the book page', e);
          setError('تعذّر عرض هذه الصفحة.');
        });
        return () => { alive = false; if (task) task.cancel(); };
      }, [doc, page, focus, maxWidth, maxHeight]);
      // The canvas always stays mounted, so the next page can draw on it.
      return (
        <div dir="ltr" className="overflow-hidden bg-white shadow-2xl rounded-md" style={shape ? { width: shape.shownW, height: shape.h } : null}>
          <canvas ref={canvasRef} style={shape && !error ? { width: shape.w, height: shape.h, marginLeft: shape.shift, display: 'block' } : { display: 'none' }} />
          {error && <p className="p-4 text-rose-700 font-bold">{error}</p>}
        </div>
      );
    }
