    // The slide studio: build a deck from the lecture, review and edit every
    // slide, then present it. While presenting, the student window shows the
    // slide and the teacher sees the slide with the notes.

    // A callback ref, so an element that unmounts and mounts again (a panel
    // minimised and restored) is measured afresh.
    function useElementWidth() {
      const [el, setEl] = useState(null);
      const [width, setWidth] = useState(800);
      useEffect(() => {
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        observer.observe(el);
        return () => observer.disconnect();
      }, [el]);
      return [setEl, width];
    }

    function DeckStudio({ lectureText, onClose, studentScreenOpen, onOpenStudentScreen }) {
      const store = useDeckStore();
      const { deck } = store;
      const [selectedId, setSelectedId] = useState(deck.slides[0] ? deck.slides[0].id : null);
      const [mode, setMode] = useState('edit');
      const [sourceOpen, setSourceOpen] = useState(deck.slides.length === 0);
      const [whatsAppOpen, setWhatsAppOpen] = useState(false);
      const [importWarnings, setImportWarnings] = useState([]);
      const [syncProblem, setSyncProblem] = useState(false);
      const [exporting, setExporting] = useState(null); // { label, done, total }
      const [exportError, setExportError] = useState(null);

      const runExport = async (option) => {
        if (exporting) return;
        if (document.activeElement) document.activeElement.blur(); // keep an edit in progress
        setExportError(null);
        setExporting({ label: option.label, done: 0, total: deck.slides.length });
        try {
          await option.run(deck, (done, total) => setExporting({ label: option.label, done, total }));
        } catch (e) {
          console.error('Mishkah: export failed', e);
          // Our own messages are in Arabic; anything else is a technical error.
          setExportError(e && e.message && /[؀-ۿ]/.test(e.message)
            ? e.message
            : 'تعذّر تصدير العرض. يمكن إعادة المحاولة، وإن تكرر الخطأ فيُرجى إبلاغ الدعم الفني.');
        } finally {
          setExporting(null);
        }
      };

      const index = Math.max(0, deck.slides.findIndex((s) => s.id === selectedId));
      const slide = deck.slides[index];
      const go = (delta) => {
        const next = deck.slides[Math.min(deck.slides.length - 1, Math.max(0, index + delta))];
        if (next) setSelectedId(next.id);
      };

      // The student window follows the presented slide. The deck itself is read
      // from the studio's saved copy, so each slide change is a tiny message.
      useEffect(() => {
        if (mode !== 'present') return;
        const result = publishStage({ kind: 'deck', index, deckSaved: !store.saveError });
        setSyncProblem(!result.stored || !result.sent || !!store.saveError);
      }, [mode, deck, index, store.saveError]);

      useEffect(() => {
        if (mode !== 'present') return;
        const onKey = (e) => {
          if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
          if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
          if (e.key === 'Escape') setMode('edit');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      });

      const onNewDeck = (newDeck, warnings) => {
        setImportWarnings(warnings || []);
        store.replaceDeck(newDeck);
        setSelectedId(newDeck.slides[0] && newDeck.slides[0].id);
        setSourceOpen(false);
      };

      const startPresenting = () => {
        if (!studentScreenOpen) onOpenStudentScreen();
        setMode('present');
      };

      return (
        <div className="fixed inset-0 z-50 bg-[#f3f1ea] flex flex-col" dir="rtl">
          <DeckStudioBar
            deck={deck} mode={mode} store={store} slide={slide}
            studentScreenOpen={studentScreenOpen}
            onSource={() => setSourceOpen(true)} onPresent={startPresenting}
            onExport={runExport} exporting={exporting} onWhatsApp={() => setWhatsAppOpen(true)}
            onEdit={() => setMode('edit')}
            onClose={() => { if (document.activeElement) document.activeElement.blur(); onClose(); }}
          />
          {store.saveError && <p className="bg-rose-100 text-rose-800 font-bold text-center py-1">{store.saveError}</p>}
          {exporting && (
            <p className="bg-emerald-100 text-emerald-950 font-bold text-center py-1">
              ⏳ جارٍ تجهيز {exporting.label}: الشريحة {Math.min(exporting.done + 1, exporting.total)} من {exporting.total}…
            </p>
          )}
          {exportError && (
            <p className="bg-rose-100 text-rose-800 font-bold text-center py-1">
              {exportError} <button type="button" className="underline mr-2" onClick={() => setExportError(null)}>إخفاء</button>
            </p>
          )}
          {store.loadError && <p className="bg-amber-100 text-amber-900 font-bold text-center py-1">{store.loadError}</p>}
          {mode === 'present' && syncProblem && (
            <p className="bg-rose-600 text-white font-bold text-center py-1">⚠️ قد لا تتابع شاشة الطالب العرض. الحل: إغلاقها ثم فتحها من جديد، مع التأكد أن ذاكرة المتصفح غير ممتلئة.</p>
          )}
          {importWarnings.length > 0 && (
            <div className="bg-amber-50 border-b-2 border-amber-300 px-4 py-2 text-sm text-amber-950">
              <div className="flex items-center justify-between">
                <b>تنبيه: أُنشئ العرض، لكن غُيّرت بعض الأجزاء، وتحتاج إلى مراجعة:</b>
                <button type="button" className="font-bold px-2" onClick={() => setImportWarnings([])}>✕</button>
              </div>
              <ul className="list-disc pr-5">{importWarnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}</ul>
              {importWarnings.length > 8 && <p>و{importWarnings.length - 8} ملاحظات أخرى.</p>}
            </div>
          )}

          {!slide ? (
            <div className="flex-1 flex items-center justify-center text-emerald-900 font-bold text-lg">
              لا توجد شرائح بعد. البداية من زر «إنشاء من المحاضرة».
            </div>
          ) : mode === 'present' ? (
            <DeckPresenter deck={deck} slide={slide} index={index} go={go} />
          ) : (
            <DeckEditor deck={deck} slide={slide} index={index} store={store} selectedId={selectedId} setSelectedId={setSelectedId} />
          )}

          {whatsAppOpen && <DeckWhatsAppPanel deck={deck} exporting={exporting} onExportPdf={() => runExport(DECK_EXPORTS.find((o) => o.id === 'pdf'))} onClose={() => setWhatsAppOpen(false)} />}
          {sourceOpen && <DeckSourcePanel lectureText={lectureText} onDeck={onNewDeck} onClose={() => setSourceOpen(false)} />}
        </div>
      );
    }

    function DeckStudioBar({ deck, mode, store, slide, studentScreenOpen, onSource, onPresent, onEdit, onClose, onExport, exporting, onWhatsApp }) {
      const btn = 'px-3 py-1.5 rounded-xl font-black text-sm border-2 transition disabled:opacity-40';
      const [exportMenuOpen, setExportMenuOpen] = useState(false);
      return (
        <div className="shrink-0 emerald-pattern flex flex-wrap items-center gap-2 px-4 py-2">
          <h2 className="text-gold-200 font-black text-lg ml-auto">🎞️ استوديو الشرائح{deck.title ? ' — ' + deck.title : ''}</h2>
          {mode === 'edit' ? (
            <>
              <button type="button" className={btn + ' bg-white text-emerald-950 border-gold-400'} onClick={onSource}>✨ إنشاء من المحاضرة</button>
              <button type="button" className={btn + ' bg-white/90 text-emerald-950 border-white'} disabled={!store.canUndo} onClick={store.undo}>↶ تراجع</button>
              <div className="relative">
                <button type="button" className={btn + ' bg-white/90 text-emerald-950 border-white'} disabled={!slide || !!exporting}
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}>⬇ تصدير</button>
                {exportMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 z-10 bg-white rounded-xl shadow-2xl border-2 border-gold-400 w-60 overflow-hidden">
                    {DECK_EXPORTS.map((opt) => (
                      <button key={opt.id} type="button" className="block w-full text-right px-3 py-2 hover:bg-gold-50 border-b border-slate-100"
                        onClick={() => { setExportMenuOpen(false); onExport(opt); }}>
                        <span className="block font-black text-emerald-950">{opt.label}</span>
                        <span className="block text-xs text-slate-500">{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className={btn + ' bg-white/90 text-emerald-950 border-white'} disabled={!slide} onClick={onWhatsApp}>📱 رسالة الواتساب</button>
              <button type="button" className={btn + ' bg-gold-500 text-emerald-950 border-gold-300'} disabled={!slide} onClick={onPresent}>▶ بدء العرض</button>
            </>
          ) : (
            <>
              <span className={'text-sm font-bold px-2 py-1 rounded-lg ' + (studentScreenOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')}>
                {studentScreenOpen ? '🖥️ شاشة الطالب تعرض الشريحة' : 'شاشة الطالب مغلقة'}
              </span>
              <button type="button" className={btn + ' bg-white text-emerald-950 border-gold-400'} onClick={onEdit}>✎ رجوع للتعديل</button>
            </>
          )}
          <button type="button" className={btn + ' bg-transparent text-gold-200 border-gold-400/50'} onClick={onClose}>✕ إغلاق</button>
        </div>
      );
    }

    function DeckEditor({ deck, slide, index, store, selectedId, setSelectedId }) {
      const [canvasRef, canvasWidth] = useElementWidth();
      return (
        <div className="flex-1 min-h-0 overflow-y-auto xl:overflow-hidden grid grid-cols-1 xl:grid-cols-[220px_1fr_300px] content-start xl:content-stretch gap-3 p-3">
          <div className="flex gap-2 overflow-x-auto pb-1 xl:block xl:overflow-x-visible xl:overflow-y-auto xl:space-y-2 xl:pb-0 pl-1">
            {deck.slides.map((s, i) => (
              <div key={s.id} onClick={() => setSelectedId(s.id)}
                className={'shrink-0 w-[204px] xl:w-auto rounded-lg cursor-pointer border-4 ' + (s.id === selectedId ? 'border-gold-500' : 'border-transparent hover:border-gold-300')}>
                <ScaledSlide width={196}><SlideView slide={s} /></ScaledSlide>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 px-1">
                  <span>{i + 1}</span>
                  <span className="flex gap-1">
                    <button type="button" title="لأعلى" onClick={(e) => { e.stopPropagation(); store.moveSlide(s.id, -1); }}>▲</button>
                    <button type="button" title="لأسفل" onClick={(e) => { e.stopPropagation(); store.moveSlide(s.id, 1); }}>▼</button>
                    <button type="button" title="حذف" className="text-rose-700" onClick={(e) => { e.stopPropagation(); store.removeSlide(s.id); }}>✕</button>
                  </span>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => { const s = blankSlide('points'); store.insertSlideAfter(selectedId, s); setSelectedId(s.id); }}
              className="shrink-0 w-[160px] xl:w-full py-2 rounded-xl border-2 border-dashed border-emerald-900/30 font-bold text-emerald-900">+ شريحة جديدة</button>
          </div>

          <div ref={canvasRef} className="min-w-0 order-first xl:order-none flex flex-col items-center justify-center">
            <div className="shadow-2xl rounded-md overflow-hidden">
              <ScaledSlide width={Math.max(320, canvasWidth)}>
                <SlideView key={slide.id} slide={slide} deck={deck} index={index} total={deck.slides.length}
                  onEdit={(field, value) => store.updateSlide(slide.id, field, value)} />
              </ScaledSlide>
            </div>
            <p className="text-sm text-slate-600 mt-2">بالضغط على أي نص في الشريحة يمكن تعديله.</p>
          </div>

          <div className="xl:overflow-y-auto bg-white rounded-2xl p-4 border border-emerald-900/10">
            <DeckInspector slide={slide} onChange={(field, value) => store.updateSlide(slide.id, field, value)} />
          </div>
        </div>
      );
    }

    function DeckPresenter({ deck, slide, index, go }) {
      const [canvasRef, canvasWidth] = useElementWidth();
      const next = deck.slides[index + 1];
      return (
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_380px] content-start lg:content-stretch gap-4 p-3 lg:p-4">
          <div ref={canvasRef} className="min-w-0 flex flex-col items-center justify-center gap-3">
            <div className="shadow-2xl rounded-md overflow-hidden">
              <ScaledSlide width={Math.max(320, canvasWidth)}>
                <SlideView slide={slide} deck={deck} index={index} total={deck.slides.length} />
              </ScaledSlide>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => go(-1)} disabled={index === 0} className="order-last px-6 py-2 rounded-xl bg-white border-2 border-emerald-900/20 font-black disabled:opacity-40">السابقة ←</button>
              <span className="font-black text-emerald-950">{index + 1} / {deck.slides.length}</span>
              <button type="button" onClick={() => go(1)} disabled={!next} className="order-first px-6 py-2 rounded-xl bg-emerald-900 text-gold-200 font-black disabled:opacity-40">→ التالية</button>
            </div>
          </div>
          <div className="min-h-0 flex flex-col gap-3">
            <div className="flex-1 min-h-[180px] overflow-y-auto bg-white rounded-2xl p-5 border-2 border-gold-400/60">
              <h4 className="font-black text-emerald-900 mb-2">📝 ملاحظات المعلم (لا يراها الطلاب)</h4>
              <p className="whitespace-pre-line leading-loose text-lg text-slate-800 font-amiri">{slide.notes || '—'}</p>
            </div>
            {next && (
              <div className="bg-white/70 rounded-2xl p-2 border border-emerald-900/10">
                <p className="text-xs font-bold text-slate-500 mb-1 px-1">الشريحة التالية</p>
                <ScaledSlide width={360}><SlideView slide={next} /></ScaledSlide>
              </div>
            )}
          </div>
        </div>
      );
    }
