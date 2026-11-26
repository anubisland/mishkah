    // A class plan: the teacher says what a class covers and the program
    // prepares it. mode 'save' plans a scheduled class ahead of time
    // (onSave); mode 'start' plans and starts a class now (onStart).
    // initialPlan fills the form when she edits an existing plan.
    function ClassPlanner({ mode, title, initialPlan, onStart, onSave, onClose }) {
      const lastPlan = useMemo(() => (mode === 'start' && !initialPlan ? loadClassPlan() : null), []);
      const initial = (type) => (initialPlan && initialPlan.items.find((it) => it.type === type)) || null;
      const initHifz = initial('hifz');
      const initTajweed = initial('tajweed');
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const deck = useMemo(() => readSavedDeck(), []);

      const [useHifz, setUseHifz] = useState(initialPlan ? !!initHifz : true);
      const [surahId, setSurahId] = useState(initHifz ? initHifz.surahId : 67);
      const [fromAyah, setFromAyah] = useState(initHifz ? initHifz.fromAyah : 1);
      const [toAyah, setToAyah] = useState(initHifz ? initHifz.toAyah : 10);
      const [useTajweed, setUseTajweed] = useState(!!initTajweed);
      const [lessonIds, setLessonIds] = useState(initTajweed ? initTajweed.lessonIds : []);
      const [useLecture, setUseLecture] = useState(!!initial('lecture'));
      const [phase, setPhase] = useState('edit'); // edit | preparing | ready
      const [progress, setProgress] = useState({ done: 0, total: 0 });
      const [error, setError] = useState(null);
      const [plan, setPlan] = useState(null);
      const [failedCount, setFailedCount] = useState(0);

      const surah = surahs.find((s) => s.id === surahId) || surahs[0];
      const maxAyah = surah ? surah.totalAyahs : 286;
      const clampAyah = (v) => Math.max(1, Math.min(maxAyah, parseInt(v, 10) || 1));

      const prepare = async (chosen) => {
        setError(null);
        setPhase('preparing');
        try {
          const items = chosen || [];
          if (!chosen) {
            if (useHifz) {
              const a = Math.min(fromAyah, toAyah);
              const b = Math.max(fromAyah, toAyah);
              const pages = await resolveHifzPages(surah.id, a, b);
              items.push({ type: 'hifz', surahId: surah.id, surahName: 'سورة ' + surah.name, fromAyah: a, toAyah: b, fromPage: pages.fromPage, toPage: pages.toPage });
            }
            if (useTajweed && lessonIds.length) items.push({ type: 'tajweed', lessonIds: SUWAYD_TAJWEED_CURRICULUM.map((l) => l.id).filter((id) => lessonIds.includes(id)) });
            if (useLecture) items.push({ type: 'lecture', deckTitle: deck ? deck.title : '' });
          }
          if (!items.length) throw new Error('اختاري ما ستشرحينه اليوم أولاً.');
          const next = { createdAt: Date.now(), items };
          if (!saveClassPlan(next)) console.warn('Mishkah: the plan will not be remembered after closing');
          const result = await prepareClassPlan(next, (done, total) => setProgress({ done, total }));
          setFailedCount(result.failed.length);
          setPlan(next);
          setPhase('ready');
        } catch (e) {
          console.warn('Mishkah: class preparation failed', e);
          setError(e && e.message && /[؀-ۿ]/.test(e.message) ? e.message : 'تعذّر تجهيز الحصة. تأكدي من الاتصال بالإنترنت ثم حاولي مرة أخرى.');
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
                <p className="text-sm text-slate-600">ماذا ستشرحين في هذه الحصة؟ يجهّز البرنامج ما تختارينه فقط.</p>

                <div className={card(useHifz)}>
                  <label className="flex items-center gap-2 font-black text-emerald-950">
                    <input type="checkbox" checked={useHifz} onChange={(e) => setUseHifz(e.target.checked)} /> التحفيظ والتسميع
                  </label>
                  {useHifz && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={surahId} onChange={(e) => { setSurahId(parseInt(e.target.value, 10)); setFromAyah(1); setToAyah(1); }}
                        className="border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold min-w-[150px]">
                        {surahs.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
                      </select>
                      <span className="font-bold">من الآية</span>
                      <input type="number" min="1" max={maxAyah} value={fromAyah} onChange={(e) => setFromAyah(clampAyah(e.target.value))} className="w-20 border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold" />
                      <span className="font-bold">إلى</span>
                      <input type="number" min="1" max={maxAyah} value={toAyah} onChange={(e) => setToAyah(clampAyah(e.target.value))} className="w-20 border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold" />
                      <span className="text-xs text-slate-500">(السورة {maxAyah} آية)</span>
                    </div>
                  )}
                </div>

                <div className={card(useTajweed)}>
                  <label className="flex items-center gap-2 font-black text-emerald-950">
                    <input type="checkbox" checked={useTajweed} onChange={(e) => setUseTajweed(e.target.checked)} /> التجويد
                  </label>
                  {useTajweed && (
                    <div className="max-h-48 overflow-y-auto grid sm:grid-cols-2 gap-1">
                      {SUWAYD_TAJWEED_CURRICULUM.map((l, i) => (
                        <label key={l.id} className="flex items-start gap-2 text-sm py-0.5">
                          <input type="checkbox" checked={lessonIds.includes(l.id)}
                            onChange={(e) => setLessonIds(e.target.checked ? lessonIds.concat([l.id]) : lessonIds.filter((x) => x !== l.id))} />
                          <span>{(i + 1) + '. ' + l.titleAr}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={card(useLecture)}>
                  <label className="flex items-center gap-2 font-black text-emerald-950">
                    <input type="checkbox" checked={useLecture} onChange={(e) => setUseLecture(e.target.checked)} /> المحاضرة
                  </label>
                  {useLecture && (deck && deck.slides.length
                    ? <p className="text-sm">العرض الجاهز: <b>{deck.title || 'بلا عنوان'}</b> ({deck.slides.length} شريحة)</p>
                    : <p className="text-sm text-rose-700 font-bold">لا يوجد عرض جاهز. جهّزيه أولاً في استوديو الشرائح من قسم المحاضرات.</p>)}
                </div>

                {error && <p className="text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}
                <button type="button" onClick={() => prepare(null)}
                  disabled={!useHifz && !(useTajweed && lessonIds.length) && !useLecture}
                  className="w-full py-3 rounded-2xl bg-emerald-900 text-gold-200 font-black text-lg disabled:opacity-40">جهّزي الحصة</button>
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
                  <button type="button" onClick={() => onSave(plan)} className="w-full py-3 rounded-2xl bg-emerald-900 text-gold-200 font-black text-lg">✓ احفظي الخطة</button>
                ) : (
                  <button type="button" onClick={() => onStart(plan)} className="w-full py-3 rounded-2xl bg-gold-400 text-emerald-950 font-black text-lg">▶ ابدئي الحصة الآن</button>
                )}
                <button type="button" onClick={() => setPhase('edit')} className="w-full py-2 rounded-xl border-2 border-slate-300 font-bold">تعديل الخطة</button>
              </div>
            )}
          </div>
        </div>
      );
    }
