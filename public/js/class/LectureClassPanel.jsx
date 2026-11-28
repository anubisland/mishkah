    // The teacher's lecture panel in class mode: the deck prepared in the slide
    // studio, her notes for the slide the students see, and a list of all the
    // slides to jump back to any of them.
    function LectureClassPanel({ index, setIndex, onOpenStudio }) {
      const [deckVersion, setDeckVersion] = useState(0);
      useEffect(() => {
        const onStorage = (e) => { if (e.key === DECK_STORAGE_KEY) setDeckVersion((v) => v + 1); };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
      }, []);
      const deck = useMemo(() => readSavedDeck() || normalizeDeck({ slides: [] }), [deckVersion]);
      const total = deck.slides.length;
      // The slide box's height, so the highlighted text lands just below it.
      const [stickyHeight, setStickyHeight] = useState(0);
      const stickyRef = useRef(null);
      useEffect(() => { if (stickyRef.current) setStickyHeight(stickyRef.current.offsetHeight); });

      // Keep the index inside the deck (the arrow keys only know "next").
      useEffect(() => {
        if (total && index > total - 1) setIndex(total - 1);
      }, [index, total]);

      if (!total) {
        return (
          <section className="bg-white rounded-2xl p-5 border-2 border-dashed border-gold-400 text-center space-y-3">
            <p className="font-bold text-emerald-950">لا يوجد عرض جاهز لهذه المحاضرة بعد.</p>
            <button type="button" onClick={onOpenStudio} className="px-5 py-2 rounded-xl bg-emerald-900 text-gold-200 font-black">🎞️ تجهيز العرض في استوديو الشرائح</button>
          </section>
        );
      }

      const i = Math.min(index, total - 1);
      const slide = deck.slides[i];
      const next = deck.slides[i + 1];
      return (
        <>
          {/* Stays in view while the lecture text below scrolls. */}
          <section ref={stickyRef} className="sticky top-0 z-10 bg-white rounded-2xl p-3 border border-emerald-900/10 space-y-2 shadow-md">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-[200px] rounded-md overflow-hidden border border-slate-200"><ScaledSlide width={200}><SlideView slide={slide} deck={deck} /></ScaledSlide></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <button type="button" className={'order-last ' + classPill(false)} disabled={i === 0} onClick={() => setIndex(i - 1)}>السابقة ←</button>
                  <span className="flex-1 text-center font-black text-emerald-950 text-sm">الشريحة {i + 1} من {total}</span>
                  <button type="button" className={'order-first ' + classPill(true)} disabled={!next} onClick={() => setIndex(i + 1)}>→ التالية</button>
                </div>
                <select value={i} onChange={(e) => setIndex(parseInt(e.target.value, 10))} className="w-full border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold text-sm">
                  {deck.slides.map((s, k) => <option key={s.id} value={k}>{(k + 1) + '. ' + (s.title || s.eyebrow || (s.quote && s.quote.text) || 'شريحة')}</option>)}
                </select>
              </div>
            </div>
            {slide.notes && <p className="whitespace-pre-line leading-relaxed text-base text-slate-800 font-amiri bg-gold-50 rounded-lg px-2 py-1 max-h-24 overflow-y-auto">📝 {slide.notes}</p>}
          </section>

          <LectureTextPane deck={deck} index={i} onPick={setIndex} topGap={stickyHeight + 12 + 'px'}
            onAttachText={(text) => { const err = saveDeck(Object.assign({}, deck, { sourceText: text })); if (err) window.alert(err); setDeckVersion((v) => v + 1); }} />

          <button type="button" onClick={onOpenStudio} className="w-full py-2 rounded-xl border-2 border-emerald-900/20 font-bold text-emerald-900 bg-white">✎ تعديل العرض في الاستوديو</button>
        </>
      );
    }
