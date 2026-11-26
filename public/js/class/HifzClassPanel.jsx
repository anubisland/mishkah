    // The teacher's hifz panel in class mode: page controls, the hiding tools,
    // the full text she corrects from (hidden words highlighted, hidden ayahs
    // veiled), and the page's mutashabihat.

    const MUSHAF_MASK_OPTIONS = [
      { id: 'none', label: 'الصفحة كاملة' },
      { id: 'mask_top', label: 'إخفاء النصف الأعلى' },
      { id: 'mask_bottom', label: 'إخفاء النصف الأسفل' },
      { id: 'ruler', label: 'سطراً بسطر' },
      { id: 'spotlight', label: 'إضاءة سطر' }
    ];

    function classPill(active) {
      return 'px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition ' +
        (active ? 'bg-emerald-900 text-gold-200 border-emerald-900' : 'bg-white text-emerald-950 border-emerald-900/15 hover:border-gold-500');
    }

    // planItem: today's planned range; the page controls stay inside it.
    function HifzClassPanel({ ctx, planItem }) {
      const recitation = ctx.hifzViewMode === 'interactive_test';
      const page = ctx.mushafPageNumber;
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const currentSurah = surahs.filter((s) => s.startPage <= page).pop();

      return (
        <>
          <section className="bg-white rounded-2xl p-3 border border-emerald-900/10 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className={classPill(!recitation)} onClick={() => ctx.setHifzViewMode('mushaf_page')}>📖 وجه المصحف</button>
              <button type="button" className={classPill(recitation)} onClick={() => ctx.handleNavigateMushafPage(page, 'interactive_test')}>🎧 لوحة التسميع</button>
            </div>

            {planItem && (page < planItem.fromPage || page > planItem.toPage) && (
              <div className="flex flex-wrap items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl p-2 text-sm font-bold text-amber-950">
                <span className="flex-1">الصفحة المعروضة ({page}) خارج خطة اليوم.</span>
                <button type="button" className={classPill(true)} onClick={() => ctx.handleNavigateMushafPage(planItem.fromPage)}>العودة إلى صفحة {planItem.fromPage}</button>
              </div>
            )}
            {planItem ? (
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className={classPill(false)} disabled={page <= planItem.fromPage} onClick={() => ctx.handleNavigateMushafPage(page - 1)}>→ السابقة</button>
                <span className="flex-1 text-center font-black text-emerald-950 text-sm">
                  {planItem.surahName} {planItem.fromAyah}–{planItem.toAyah} • صفحة {page}
                  {planItem.toPage > planItem.fromPage && page >= planItem.fromPage && page <= planItem.toPage ? ' (' + (page - planItem.fromPage + 1) + ' من ' + (planItem.toPage - planItem.fromPage + 1) + ')' : ''}
                </span>
                <button type="button" className={classPill(true)} disabled={page >= planItem.toPage} onClick={() => ctx.handleNavigateMushafPage(page + 1)}>التالية ←</button>
              </div>
            ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={classPill(false)} onClick={() => ctx.handleNavigateMushafPage(page - 1)}>→ السابقة</button>
              <select value={currentSurah ? currentSurah.id : ''} onChange={(e) => {
                const s = surahs.find((x) => String(x.id) === e.target.value);
                if (s) ctx.handleNavigateMushafPage(s.startPage);
              }} className="flex-1 min-w-[140px] border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold">
                {surahs.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
              </select>
              <span className="font-black text-emerald-950 text-sm">صفحة {page}</span>
              <button type="button" className={classPill(false)} onClick={() => ctx.handleNavigateMushafPage(page + 1)}>التالية ←</button>
            </div>
            )}

            {recitation ? <RecitationControls ctx={ctx} /> : <MushafMaskControls ctx={ctx} />}
          </section>

          <HifzTeacherText ctx={ctx} />
          <MutashabihatNotes items={ctx.hifzMutashabihat} />
        </>
      );
    }

    function MushafMaskControls({ ctx }) {
      const lineMode = ctx.mushafOverlayMode === 'ruler' || ctx.mushafOverlayMode === 'spotlight';
      return (
        <div className="space-y-2">
          <h5 className="font-black text-emerald-900 text-sm">ما يُخفى عن الطلاب:</h5>
          <div className="flex flex-wrap gap-1.5">
            {MUSHAF_MASK_OPTIONS.map((m) => (
              <button key={m.id} type="button" className={classPill(ctx.mushafOverlayMode === m.id)}
                onClick={() => { ctx.setMushafOverlayMode(m.id); if (m.id === 'ruler' || m.id === 'spotlight') ctx.setActiveRulerLine(1); }}>
                {m.label}
              </button>
            ))}
          </div>
          {lineMode && (
            <div className="flex items-center gap-2">
              <button type="button" className={classPill(false)} onClick={() => ctx.setActiveRulerLine(Math.max(1, ctx.activeRulerLine - 1))}>▲ السطر السابق</button>
              <span className="font-black">السطر {ctx.activeRulerLine} من 15</span>
              <button type="button" className={classPill(true)} onClick={() => ctx.setActiveRulerLine(Math.min(15, ctx.activeRulerLine + 1))}>▼ كشف السطر التالي</button>
            </div>
          )}
        </div>
      );
    }

    function RecitationControls({ ctx }) {
      const toggles = [
        ['isEndingsMasked', 'setIsEndingsMasked', 'آخر كل آية'],
        ['isStartersMasked', 'setIsStartersMasked', 'أول كل آية'],
        ['isDivineNamesMasked', 'setIsDivineNamesMasked', 'أسماء الله في الخواتيم'],
        ['isAlternatingMasked', 'setIsAlternatingMasked', 'كلمة وكلمة'],
        ['isReverseOrder', 'setIsReverseOrder', 'من آخر الصفحة']
      ];
      const passageActive = ctx.passageMaskedAyahs.size > 0;
      // In full blind recitation, reveal the next hidden ayah once it is recited.
      const nextHidden = ctx.isFullMasked ? ctx.hifzAyahs.find((a) => !ctx.revealedAyahSet.has(a.num)) : null;
      return (
        <div className="space-y-2">
          <h5 className="font-black text-emerald-900 text-sm">ما يُخفى عن الطلاب:</h5>
          <div className="flex flex-wrap gap-1.5">
            {toggles.map(([value, setter, label]) => (
              <button key={value} type="button" className={classPill(ctx[value])} onClick={() => ctx[setter](!ctx[value])}>{label}</button>
            ))}
            <button type="button" className={classPill(ctx.isFullMasked)} onClick={() => ctx.setIsFullMasked(!ctx.isFullMasked)}>🔒 الصفحة كلها (غيباً)</button>
          </div>
          {nextHidden && (
            <button type="button" className="w-full py-2 rounded-xl bg-emerald-800 text-white font-black" onClick={() => ctx.toggleRevealAyah(nextHidden.num)}>
              👁️ قُرئت صحيحة: كشف الآية {nextHidden.num}
            </button>
          )}
          <h5 className="font-black text-emerald-900 text-sm pt-1">اختبار مقطع:</h5>
          <div className="flex flex-wrap gap-1.5">
            {[['start', 'بداية الصفحة'], ['middle', 'وسطها'], ['end', 'ختامها']].map(([id, label]) => (
              <button key={id} type="button" className={classPill(ctx.passageTestSection === id && passageActive)} onClick={() => ctx.handleActivatePassageTest(id)}>{label}</button>
            ))}
          </div>
          {passageActive && (
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-black" onClick={() => ctx.handlePassageVerdict('correct')}>✅ قالها صح</button>
              <button type="button" className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-black" onClick={() => ctx.handlePassageVerdict('error')}>⚠️ قالها غلط</button>
              <button type="button" className={classPill(false)} onClick={() => ctx.handlePassageVerdict('reset')}>إنهاء الاختبار</button>
            </div>
          )}
        </div>
      );
    }

    // The whole page for the teacher: what is hidden from the students is
    // highlighted in yellow, hidden ayahs are veiled, never removed.
    function HifzTeacherText({ ctx }) {
      const masks = {
        isEndingsMasked: ctx.isEndingsMasked, isStartersMasked: ctx.isStartersMasked, isDivineNamesMasked: ctx.isDivineNamesMasked,
        isAlternatingMasked: ctx.isAlternatingMasked, isFullMasked: ctx.isFullMasked, revealedAyahs: ctx.revealedAyahSet,
        customMaskedWords: ctx.customMaskedWords, passageMaskedAyahs: ctx.passageMaskedAyahs, passageStatus: ctx.passageStatus
      };
      const recitation = ctx.hifzViewMode === 'interactive_test';
      if (!ctx.hifzAyahs || !ctx.hifzAyahs.length) return null;
      return (
        <section className="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-gold-400/50">
          <h4 className="font-black text-emerald-900 text-sm mb-2">📜 النص الكامل للمعلم فقط{ctx.isFetchingQuran ? ' (جارٍ التحميل…)' : ''}</h4>
          <div className="font-quran text-2xl leading-[2.2] text-right text-black" dir="rtl">
            {ctx.hifzAyahs.map((ayah) => {
              const words = ayah.text.split(' ');
              const hiddenAyah = recitation && !recitationAyahVisibility(ayah.num, masks).isRevealed;
              return (
                <span key={ayah.num} className={'font-quran ' + (hiddenAyah ? 'opacity-40' : '')}>
                  {words.map((w, i) => {
                    const masked = recitation && isRecitationWordMasked(ayah.num, words, i, masks);
                    return <span key={i} className={'font-quran ' + (masked ? 'bg-amber-200 rounded px-0.5' : '')}>{w} </span>;
                  })}
                  <span className="font-quran text-gold-600">﴿{ayah.num}﴾ </span>
                </span>
              );
            })}
          </div>
          {recitation && <p className="text-xs text-slate-500 mt-2">الأصفر: مخفي عن الطلاب. الباهت: آية مقفلة عندهم.</p>}
        </section>
      );
    }

    function MutashabihatNotes({ items }) {
      if (!items || !items.length) return null;
      return (
        <section className="card-islamic-amber rounded-2xl p-4 border border-gold-300">
          <h4 className="font-black text-emerald-950 text-sm mb-2">⚠️ متشابهات هذه الصفحة: للتنبيه عليها</h4>
          <div className="space-y-3">
            {items.map((m, i) => (
              <div key={i} className="text-sm space-y-1">
                <p className="font-quran text-lg text-emerald-950">{m.ayah}</p>
                <p className="font-quran text-lg text-slate-700">↔ {m.similar}</p>
                {m.difference && <p className="text-slate-700">💡 {m.difference}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }
