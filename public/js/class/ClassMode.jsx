    // Class mode: once the class starts, the teacher's window becomes one panel
    // that drives the student window. It shows a small copy of what the
    // students see, her companion material for exactly that page or slide, the
    // controls she needs, and everything shown so far so she can go back to it
    // when a student asks about something earlier.
    //
    // ctx carries the App state and handlers the panels use (see App.jsx).

    const CLASS_SECTIONS = [
      { id: 'hifz', label: 'التحفيظ والتسميع' },
      { id: 'tajweed', label: 'التجويد' },
      { id: 'islamic', label: 'المحاضرة' }
    ];

    // One entry per distinct thing shown (masks and verdicts are not new entries).
    function classStageKey(stage) {
      if (!stage) return null;
      if (stage.kind === 'mushaf' || stage.kind === 'recitation') return stage.kind + ':' + stage.page;
      if (stage.kind === 'tajweed') return 'tajweed:' + stage.lessonId + ':' + (stage.slideIndex || 0);
      if (stage.kind === 'deck') return 'deck:' + stage.index;
      return null;
    }

    function classStageLabel(stage) {
      if (stage.kind === 'mushaf') return '📖 ' + surahNameForPage(stage.page) + ' — صفحة ' + stage.page;
      if (stage.kind === 'recitation') return '🎧 تسميع ' + (stage.surahName || surahNameForPage(stage.page)) + ' — صفحة ' + stage.page;
      if (stage.kind === 'tajweed') {
        const lesson = SUWAYD_TAJWEED_CURRICULUM.find((l) => l.id === stage.lessonId);
        const slide = lesson ? buildTajweedZoomSlides(lesson)[stage.slideIndex || 0] : null;
        return '🎙️ ' + (lesson ? lesson.titleAr : 'درس تجويد') + (slide ? ' — ' + slide.titleAr : '');
      }
      if (stage.kind === 'deck') {
        const deck = readSavedDeck();
        const slide = deck && deck.slides[stage.index];
        return '🎞️ شريحة ' + (stage.index + 1) + (slide && (slide.title || slide.eyebrow) ? ' — ' + (slide.title || slide.eyebrow) : '');
      }
      return '';
    }

    const PLAN_SECTION = { hifz: 'hifz', tajweed: 'tajweed', lecture: 'islamic' };

    // Moves the teacher (and the student window) to the start of a plan item.
    function openPlanItem(ctx, item, setLectureIndex) {
      if (item.type === 'hifz') {
        ctx.setActiveTab('hifz');
        ctx.handleNavigateMushafPage(item.fromPage);
      } else if (item.type === 'tajweed') {
        ctx.setActiveTab('tajweed');
        ctx.setSuwaydLessonId(item.lessonIds[0]);
        ctx.setSuwaydZoomSlideIndex(0);
      } else if (item.type === 'lecture') {
        ctx.setActiveTab('islamic');
        setLectureIndex(0);
      }
    }

    function ClassMode({ ctx, plan, onEnd }) {
      const section = CLASS_SECTIONS.some((s) => s.id === ctx.activeTab) ? ctx.activeTab : 'hifz';
      const planItems = (plan && plan.items) || [];
      const planItem = planItems.find((it) => PLAN_SECTION[it.type] === section) || null;
      const [lectureIndex, setLectureIndex] = useState(0);
      const [history, setHistory] = useState([]);
      const [minimized, setMinimized] = useState(false);
      const [syncProblem, setSyncProblem] = useState(false);
      const [previewRef, previewWidth] = useElementWidth();

      // The class starts on the plan's first item.
      useEffect(() => {
        if (planItems[0]) openPlanItem(ctx, planItems[0], setLectureIndex);
      }, []);

      const stage = section === 'islamic' ? { kind: 'deck', index: lectureIndex } : ctx.sectionStage;

      // Class mode publishes while its panel is open. While minimized, the
      // slide studio may drive the student window, so on returning to the
      // panel the panel's stage is sent again and both screens agree.
      useEffect(() => {
        if (!stage || minimized) return;
        const result = publishStage(stage);
        setSyncProblem(!result.stored || !result.sent);
      }, [JSON.stringify(stage), minimized]);

      // Remember each new thing shown, newest last.
      useEffect(() => {
        const key = classStageKey(stage);
        if (!key) return;
        setHistory((h) => (h.length && h[h.length - 1].key === key ? h : h.concat([{ key, label: classStageLabel(stage), stage, at: new Date() }])));
      }, [classStageKey(stage)]);

      const restore = (entry) => {
        const st = entry.stage;
        if (st.kind === 'mushaf' || st.kind === 'recitation') {
          ctx.setActiveTab('hifz');
          ctx.handleNavigateMushafPage(st.page, st.kind === 'recitation' ? 'interactive_test' : 'mushaf_page');
        } else if (st.kind === 'tajweed') {
          ctx.setActiveTab('tajweed');
          ctx.setSuwaydLessonId(st.lessonId);
          ctx.setSuwaydZoomSlideIndex(st.slideIndex || 0);
        } else if (st.kind === 'deck') {
          ctx.setActiveTab('islamic');
          setLectureIndex(st.index);
        }
      };

      // The arrow keys step through pages or slides, as on a clicker.
      const step = (delta) => {
        if (section === 'hifz') {
          let next = ctx.mushafPageNumber + delta;
          if (planItem) next = Math.max(planItem.fromPage, Math.min(planItem.toPage, next));
          if (next !== ctx.mushafPageNumber) ctx.handleNavigateMushafPage(next);
        }
        else if (section === 'tajweed') ctx.setSuwaydZoomSlideIndex(Math.max(0, Math.min(ctx.currentZoomSlides.length - 1, ctx.suwaydZoomSlideIndex + delta)));
        else setLectureIndex((i) => Math.max(0, i + delta));
      };
      useEffect(() => {
        if (minimized) return;
        const onKey = (e) => {
          if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
          if (e.key === 'ArrowLeft' || e.key === 'PageDown') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowRight' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      });

      if (minimized) {
        return (
          <button type="button" onClick={() => setMinimized(false)} dir="rtl"
            className="fixed bottom-5 right-5 z-[65] px-5 py-3 rounded-2xl bg-emerald-900 text-gold-200 font-black shadow-2xl border-2 border-gold-400">
            ↩ الرجوع إلى لوحة الحصة
          </button>
        );
      }

      return (
        <div className="fixed inset-0 z-50 bg-[#f3f1ea] flex flex-col" dir="rtl">
          <div className="shrink-0 emerald-pattern px-3 py-2 flex flex-wrap items-center gap-2">
            <span className="text-gold-200 font-black ml-auto flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> الحصة جارية
            </span>
            {!planItems.length && CLASS_SECTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => ctx.setActiveTab(s.id)}
                className={'px-3 py-1.5 rounded-xl text-sm font-black border-2 ' + (section === s.id ? 'bg-gold-400 text-emerald-950 border-gold-200' : 'bg-emerald-900/70 text-emerald-50 border-emerald-700')}>
                {s.label}
              </button>
            ))}
            <button type="button" onClick={() => setMinimized(true)} className="px-3 py-1.5 rounded-xl text-sm font-bold bg-white/90 text-emerald-950 border-2 border-white" title="البرنامج الكامل، والحصة مستمرة">⚙️ كل الأدوات</button>
            {!ctx.studentScreenOpen && (
              <button type="button" onClick={ctx.handleOpenStudentPopout} className="px-3 py-1.5 rounded-xl text-sm font-black bg-rose-600 text-white">🖥️ فتح شاشة الطالب</button>
            )}
            <button type="button" onClick={onEnd} className="px-3 py-1.5 rounded-xl text-sm font-bold text-gold-200 border-2 border-gold-400/60">■ إنهاء الحصة</button>
          </div>
          {planItems.length > 0 && (
            <div className="shrink-0 bg-emerald-950 px-3 py-2 flex gap-2 overflow-x-auto">
              <span className="text-gold-300 font-black text-sm self-center shrink-0">📋 جدول الحصة:</span>
              {planItems.map((it, i) => (
                <button key={i} type="button" onClick={() => openPlanItem(ctx, it, setLectureIndex)}
                  className={'shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold border-2 ' + (it === planItem ? 'bg-gold-400 text-emerald-950 border-gold-200' : 'bg-emerald-900 text-emerald-50 border-emerald-700')}>
                  {(i + 1) + '. ' + classPlanItemLabel(it)}
                </button>
              ))}
            </div>
          )}
          {syncProblem && <p className="bg-rose-600 text-white text-center font-bold py-1 text-sm">⚠️ قد لا تتابع شاشة الطالب. الحل: إغلاقها ثم فتحها من جديد.</p>}

          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
            <section ref={previewRef} className="bg-white rounded-2xl p-3 border border-emerald-900/10">
              <h4 className="font-black text-emerald-900 text-sm mb-2">👁️ ما يراه الطلاب الآن</h4>
              <div className="flex justify-center">
                <StudentPreview stage={stage} width={Math.min(520, Math.max(200, previewWidth - 24))} />
              </div>
            </section>

            {section === 'hifz' && <HifzClassPanel ctx={ctx} planItem={planItem} />}
            {section === 'tajweed' && <TajweedClassPanel ctx={ctx} planItem={planItem} />}
            {section === 'islamic' && <LectureClassPanel ctx={ctx} index={lectureIndex} setIndex={setLectureIndex} onOpenStudio={() => { setMinimized(true); ctx.setSlideStudioOpen(true); }} />}

            <ClassHistory history={history} currentKey={classStageKey(stage)} onRestore={restore} />
          </div>
        </div>
      );
    }

    // Everything shown in this class, so the teacher can answer a question
    // about something earlier: one press brings it back on both screens.
    function ClassHistory({ history, currentKey, onRestore }) {
      if (history.length < 2) return null;
      return (
        <section className="bg-white rounded-2xl p-3 border border-emerald-900/10">
          <h4 className="font-black text-emerald-900 text-sm mb-2">🕘 ما عُرض في الحصة (بالضغط يعود على الشاشتين)</h4>
          <div className="space-y-1 max-h-56 overflow-y-auto">
            {history.slice().reverse().map((entry, i) => (
              <button key={entry.key + i} type="button" onClick={() => onRestore(entry)}
                className={'w-full text-right px-3 py-1.5 rounded-lg text-sm flex justify-between gap-2 ' + (entry.key === currentKey ? 'bg-gold-100 font-black' : 'hover:bg-slate-50')}>
                <span className="truncate">{entry.label}</span>
                <span className="text-xs text-slate-500 shrink-0">{entry.at.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
              </button>
            ))}
          </div>
        </section>
      );
    }
