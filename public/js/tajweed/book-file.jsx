    // The teacher's own copy of «التجويد المصور» (a PDF she chooses once). It
    // is kept in this browser's IndexedDB, never uploaded: the teacher window
    // and the student window (same site, same browser) both read it from
    // there and draw pages with PDF.js.
    const TAJWEED_BOOK_DB = 'mishkah-books';
    const TAJWEED_BOOK_STORE = 'files';
    const TAJWEED_BOOK_KEY = 'tajweed-suwayd';

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
    async function saveTajweedBookFile(file) {
      if (!file || !/\.pdf$/i.test(file.name || '')) return 'يلزم اختيار ملف الكتاب بصيغة PDF.';
      try {
        await bookDbRequest('readwrite', (s) => s.put({ name: file.name, size: file.size, blob: file }, TAJWEED_BOOK_KEY));
        tajweedBookDocPromise = null;
        return null;
      } catch (e) {
        console.warn('Mishkah: could not keep the tajweed book', e);
        return 'تعذّر حفظ الكتاب في المتصفح (قد تكون مساحة الجهاز ممتلئة، أو التصفح في وضع خاص).';
      }
    }

    function readTajweedBookRecord() {
      return bookDbRequest('readonly', (s) => s.get(TAJWEED_BOOK_KEY));
    }

    function removeTajweedBookFile() {
      tajweedBookDocPromise = null;
      return bookDbRequest('readwrite', (s) => s.delete(TAJWEED_BOOK_KEY));
    }

    // The opened PDF, shared by every page drawn in this window.
    // Resolves to null when no book has been chosen on this device.
    let tajweedBookDocPromise = null;
    function loadTajweedBookDoc() {
      if (!tajweedBookDocPromise) {
        tajweedBookDocPromise = (async () => {
          if (!window.pdfjsLib) throw new Error('قارئ ملفات PDF لم يُحمَّل.');
          const record = await readTajweedBookRecord();
          if (!record || !record.blob) return null;
          const data = new Uint8Array(await record.blob.arrayBuffer());
          // isEvalSupported: false — see the PDF.js security note in lecture-actions.jsx.
          return window.pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
        })();
        tajweedBookDocPromise.catch(() => { tajweedBookDocPromise = null; });
      }
      return tajweedBookDocPromise;
    }

    // { status: 'loading' | 'missing' | 'ready' | 'error', doc, error }
    function useTajweedBookDoc(version) {
      const [state, setState] = useState({ status: 'loading' });
      useEffect(() => {
        let alive = true;
        setState({ status: 'loading' });
        loadTajweedBookDoc().then(
          (doc) => { if (alive) setState(doc ? { status: 'ready', doc } : { status: 'missing' }); },
          (e) => {
            console.warn('Mishkah: could not open the tajweed book', e);
            if (alive) setState({ status: 'error', error: 'تعذّر فتح ملف الكتاب. يمكن اختياره مرة أخرى.' });
          }
        );
        return () => { alive = false; };
      }, [version]);
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
      if (error) return <p className="text-rose-200 font-bold">{error}</p>;
      return (
        <div dir="ltr" className="overflow-hidden bg-white shadow-2xl rounded-md" style={shape ? { width: shape.shownW, height: shape.h } : null}>
          <canvas ref={canvasRef} style={shape ? { width: shape.w, height: shape.h, marginLeft: shape.shift, display: 'block' } : { display: 'block' }} />
        </div>
      );
    }
