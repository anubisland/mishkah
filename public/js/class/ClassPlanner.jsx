    // A class plan: the teacher says what a class covers and the program
    // prepares it. mode 'save' plans a scheduled class ahead of time
    // (onSave); mode 'start' plans and starts a class now (onStart).
    // initialPlan fills the form when she edits an existing plan.
    function ClassPlanner({ mode, title, initialPlan, onStart, onSave, onClose }) {
      const lastPlan = useMemo(() => (mode === 'start' && !initialPlan ? loadClassPlan() : null), []);
      const initial = (type) => (initialPlan && initialPlan.items.find((it) => it.type === type)) || null;
      const initHifzParts = initialPlan ? initialPlan.items.filter((it) => it.type === 'hifz') : [];
      const initTajweed = initial('tajweed');
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const deck = useMemo(() => readSavedDeck(), []);
      const deckReady = !!(deck && deck.slides.length);

      // The language the class is taught in: the student screen and the
      // teacher's notes follow it, whatever the program's own language.
      const [language, setLanguage] = useState(((initialPlan || lastPlan || {}).language) || 'ar');
      const [useHifz, setUseHifz] = useState(initialPlan ? initHifzParts.length > 0 : true);
      // Recitation of earlier pages usually opens the class.
      const [hifzParts, setHifzParts] = useState(initHifzParts.length
        ? initHifzParts.map(hifzItemToPart)
        : [newHifzPart('tasmee')]);
      const [useTajweed, setUseTajweed] = useState(!!initTajweed);
      const [useLecture, setUseLecture] = useState(!!initial('lecture'));
      const [phase, setPhase] = useState('edit'); // edit | preparing | ready
      const [progress, setProgress] = useState({ done: 0, total: 0 });
      const [error, setError] = useState(null);
      const [plan, setPlan] = useState(null);
      const [failedCount, setFailedCount] = useState(0);

      const prepare = async (chosen) => {
        setError(null);
        setPhase('preparing');
        try {
          const items = chosen || [];
          if (!chosen) {
            if (useHifz) {
              for (const part of hifzParts) items.push(await hifzPartToItem(part, surahs));
            }
            if (useTajweed) items.push({ type: 'tajweed', lessonIds: [] });
            if (useLecture) {
              if (!deckReady) throw new Error('لا يوجد عرض جاهز للمحاضرة. يُجهَّز أولاً في استوديو الشرائح، أو يُلغى اختيار المحاضرة.');
              items.push({ type: 'lecture', deckTitle: deck.title });
            }
          }
          if (!items.length) throw new Error('لم يُحدَّد بعدُ ما سيُشرح في هذه الحصة.');
          const next = { createdAt: Date.now(), items, language };
          const result = await prepareClassPlan(next, (done, total) => setProgress({ done, total }));
          setFailedCount(result.failed.length);
          setPlan(next);
          setPhase('ready');
        } catch (e) {
          console.warn('Mishkah: class preparation failed', e);
          setError(e && e.message && /[؀-ۿ]/.test(e.message) ? e.message : 'تعذّر تجهيز الحصة. يلزم الاتصال بالإنترنت، ثم المحاولة مرة أخرى.');
          setPhase('edit');
        }
      };

      const card = (on) => 'rounded-2xl p-4 border-2 space-y-2 ' + (on ? 'border-gold-400 bg-gold-50/40' : 'border-slate-200 bg-white');

      return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-3" dir="rtl">
          <div className="bg-[#f8f6ef] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto p-5 space-y-4 border-2 border-gold-400">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-emerald-950">📋 {title ? 'خطة حصة: ' + title : 'خطة حصة اليوم'}</h3>
              <button type="button" onClick={onClose} className="px-3 py-1 rounded-xl border border-slate-300 font-bold">✕</button>
            </div>

            {phase === 'edit' && (
              <>
                {lastPlan && (
                  <button type="button" onClick={() => prepare(lastPlan.items)}
                    className="w-full text-right rounded-2xl p-3 border-2 border-emerald-800 bg-emerald-50 hover:bg-emerald-100">
                    <span className="block font-black text-emerald-950">↻ متابعة خطة آخر حصة</span>
                    <span className="block text-sm text-slate-700">{lastPlan.items.map(classPlanItemLabel).join(' • ')}</span>
                  </button>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-emerald-950">لغة الحصة:</span>
                  {[['ar', 'عربي'], ['en', 'English']].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setLanguage(id)}
                      className={'px-4 py-1.5 rounded-xl font-black border-2 ' + (language === id ? 'bg-emerald-900 text-gold-200 border-emerald-900' : 'bg-white text-emerald-950 border-emerald-900/15')}>{label}</button>
                  ))}
                  {language === 'en' && <span className="text-xs text-slate-600">شاشة الطالب بالإنجليزية، مع ترجمة معاني الآيات.</span>}
                </div>
                <p className="text-sm text-slate-600">ماذا سيُشرح في هذه الحصة؟ يجهّز البرنامج المختار فقط.</p>

                <div className={card(useHifz)}>
                  <label className="flex items-center gap-2 font-black text-emerald-950">
                    <input type="checkbox" checked={useHifz} onChange={(e) => setUseHifz(e.target.checked)} /> التحفيظ والتسميع
                  </label>
                  {useHifz && <HifzPlanParts parts={hifzParts} setParts={setHifzParts} surahs={surahs} />}
                </div>

                <div className={card(useTajweed)}>
                  <label className="flex items-center gap-2 font-black text-emerald-950">
                    <input type="checkbox" checked={useTajweed} onChange={(e) => setUseTajweed(e.target.checked)} /> التجويد
                  </label>
                  {useTajweed && <p className="text-sm text-slate-700">من كتاب «التجويد المصور»، من الصفحة التي وقف عندها الدرس السابق.</p>}
                </div>

                <div className={card(useLecture)}>
                  <label className="flex items-center gap-2 font-black text-emerald-950">
                    <input type="checkbox" checked={useLecture} onChange={(e) => setUseLecture(e.target.checked)} /> المحاضرة
                  </label>
                  {useLecture && (deck && deck.slides.length
                    ? <p className="text-sm">العرض الجاهز: <b>{deck.title || 'بلا عنوان'}</b> ({deck.slides.length} شريحة)</p>
                    : <p className="text-sm text-rose-700 font-bold">لا يوجد عرض جاهز. يُجهَّز أولاً في استوديو الشرائح من قسم المحاضرات.</p>)}
                </div>

                {error && <p className="text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}
                <button type="button" onClick={() => prepare(null)}
                  disabled={!useHifz && !useTajweed && !(useLecture && deckReady)}
                  className="w-full py-3 rounded-2xl bg-emerald-900 text-gold-200 font-black text-lg disabled:opacity-40">تجهيز الحصة</button>
              </>
            )}

            {phase === 'preparing' && (
              <div className="py-8 text-center space-y-3">
                <p className="font-black text-emerald-950 text-lg">⏳ جارٍ تجهيز الحصة…</p>
                {progress.total > 0 && <p className="text-slate-600">تحميل صفحات المصحف وآياتها: {progress.done} من {progress.total}</p>}
              </div>
            )}

            {phase === 'ready' && plan && (
              <div className="space-y-3">
                <p className="font-black text-emerald-800 text-lg">✓ الحصة جاهزة</p>
                <ol className="list-decimal pr-6 space-y-1 font-bold text-emerald-950">
                  {plan.items.map((it, i) => <li key={i}>{classPlanItemLabel(it)}</li>)}
                </ol>
                {failedCount > 0 && (
                  <p className="text-amber-900 bg-amber-50 border border-amber-300 rounded-xl p-2 text-sm">
                    تعذّر حفظ {failedCount} من ملفات المصحف على الجهاز، فستُحمَّل أثناء الحصة إن كان الإنترنت متاحاً.
                  </p>
                )}
                {mode === 'save' ? (
                  <button type="button" onClick={() => onSave(plan)} className="w-full py-3 rounded-2xl bg-emerald-900 text-gold-200 font-black text-lg">✓ حفظ الخطة</button>
                ) : (
                  <button type="button" onClick={() => onStart(plan)} className="w-full py-3 rounded-2xl bg-gold-400 text-emerald-950 font-black text-lg">▶ بدء الحصة الآن</button>
                )}
                <button type="button" onClick={() => setPhase('edit')} className="w-full py-2 rounded-xl border-2 border-slate-300 font-bold">تعديل الخطة</button>
              </div>
            )}
          </div>
        </div>
      );
    }
