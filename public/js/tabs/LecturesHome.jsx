    // «المحاضرات»: one way to prepare and give a lecture, through the slide
    // studio. The lecture open now, a new one from a Word or PDF file, and the
    // library of earlier lectures.
    function LecturesHome({ onOpenStudio, studioOpen }) {
      const [version, setVersion] = useState(0);
      const [error, setError] = useState('');
      // Read again whenever the studio closes, so the page shows its latest work.
      const deck = useMemo(() => readSavedDeck(), [studioOpen, version]);
      const library = useMemo(() => loadDeckLibrary(), [studioOpen, version]);
      const openId = currentLibraryId();
      const refresh = () => setVersion((v) => v + 1);

      const act = (error) => { setError(error || ''); refresh(); return !error; };
      const startNew = () => { if (act(openDeckFromLibrary(null))) onOpenStudio(); };
      const open = (id) => { if (act(openDeckFromLibrary(id))) onOpenStudio(); };
      const save = () => act(saveOpenDeckToLibrary().error);
      const remove = (e) => {
        if (!window.confirm('حذف «' + e.title + '» من المكتبة؟ لا يمكن التراجع عن ذلك.')) return;
        act(deleteFromDeckLibrary(e.id));
      };
      const date = (iso) => new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
      const btn = 'px-4 py-2 rounded-xl font-black text-sm border-2';

      return (
        <div className="space-y-4" dir="rtl">
          <section className="card-islamic-pearl rounded-2xl p-4 sm:p-5 border-2 border-emerald-900/10 space-y-3">
            <h2 className="text-2xl font-black text-emerald-950">🕌 المحاضرات</h2>
            <ol className="list-decimal pr-6 text-slate-700 space-y-0.5 text-sm">
              <li>محاضرة جديدة: اختيار ملف الوورد أو PDF، فتظهر شرائحها بالعناوين والآيات والأحاديث.</li>
              <li>مراجعة الشرائح وتعديلها في الاستوديو.</li>
              <li>في الحصة: «▶ بدء العرض» أو من لوحة الحصة.</li>
              <li>بعد الحصة: «📱 رسالة الواتساب» وملف العرض PDF للمجموعة.</li>
            </ol>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={startNew} className={btn + ' bg-emerald-900 text-gold-200 border-emerald-900'}>➕ محاضرة جديدة من ملف</button>
            </div>
            {error && <p className="text-rose-700 font-bold text-sm">{error}</p>}
          </section>

          {deck && deck.slides.length > 0 && (
            <section className="card-islamic-amber rounded-2xl p-4 border border-gold-300 space-y-2">
              <h3 className="text-sm font-black text-gold-700">المحاضرة المفتوحة الآن</h3>
              <p className="text-xl font-black text-emerald-950">{deck.title || 'عرض بلا عنوان'}</p>
              <p className="text-sm text-slate-700">{deck.slides.length} شريحة</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={onOpenStudio} className={btn + ' bg-gold-400 text-emerald-950 border-gold-400'}>✏️ فتح في الاستوديو</button>
                <button type="button" onClick={save} className={btn + ' bg-white text-emerald-950 border-emerald-900/20'}>💾 حفظ في المكتبة</button>
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl p-4 border border-emerald-900/10 space-y-2">
            <h3 className="font-black text-emerald-950">📚 مكتبة المحاضرات ({library.length})</h3>
            {!library.length && <p className="text-sm text-slate-600">لا محاضرات محفوظة بعد. تُحفظ المحاضرة المفتوحة تلقائياً عند بدء محاضرة أخرى.</p>}
            {library.map((e) => (
              <div key={e.id} className={'flex flex-wrap items-center gap-2 rounded-xl px-3 py-2 border ' + (e.id === openId ? 'border-gold-400 bg-gold-50' : 'border-slate-200')}>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-emerald-950 truncate">{e.title}{e.id === openId ? ' (مفتوحة الآن)' : ''}</p>
                  <p className="text-xs text-slate-500">{e.slideCount} شريحة • {date(e.savedAt)}</p>
                </div>
                {e.id !== openId && <button type="button" onClick={() => open(e.id)} className={btn + ' bg-white text-emerald-950 border-emerald-900/20'}>فتح</button>}
                <button type="button" onClick={() => remove(e)} className="px-2 py-1 rounded-lg text-rose-700 font-bold text-sm">🗑 حذف</button>
              </div>
            ))}
          </section>
        </div>
      );
    }
