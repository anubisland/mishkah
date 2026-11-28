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
    // A hifz part opens ready for its kind: recitation hides the page from the
    // student and starts counting mistakes; new memorisation shows the whole
    // mushaf page (the teacher points with the mouse) and stops counting.
    function openPlanItem(ctx, item, setLectureIndex, tasmee) {
      if (item.type === 'hifz') {
        ctx.setActiveTab('hifz');
        if (item.hifzMode === 'tasmee') {
          ctx.handleNavigateMushafPage(item.fromPage, 'interactive_test');
          ctx.setIsFullMasked(true);
          if (tasmee) tasmee.setActive(true);
        } else if (item.hifzMode === 'tahfeez') {
          ctx.handleNavigateMushafPage(item.fromPage, 'mushaf_page');
          ctx.setMushafOverlayMode('none');
          ctx.setIsFullMasked(false);
          if (tasmee) tasmee.setActive(false);
        } else {
          ctx.handleNavigateMushafPage(item.fromPage);
        }
      } else if (item.type === 'tajweed') {
        ctx.setActiveTab('tajweed');
        ctx.setSuwaydLessonId(item.lessonIds[0]);
        ctx.setSuwaydZoomSlideIndex(0);
      } else if (item.type === 'lecture') {
        ctx.setActiveTab('islamic');
        setLectureIndex(0);
      }
    }

    function ClassMode({ ctx, plan, onEnd, onAddPlanItem }) {
      const section = CLASS_SECTIONS.some((s) => s.id === ctx.activeTab) ? ctx.activeTab : 'hifz';
      const planItems = (plan && plan.items) || [];
      // The part opened last; a class may have several hifz parts.
      const [itemIndex, setItemIndex] = useState(0);
      const [addingPart, setAddingPart] = useState(false);
      const [briefHidden, setBriefHidden] = useState(false);
      // Tajweed reading practice moved the class to a mushaf page.
      const [fromTajweed, setFromTajweed] = useState(false);
      // Only «عرض الصفحة للطلاب» keeps it: any other way out of hifz clears it.
      useEffect(() => { if (section !== 'hifz') setFromTajweed(false); }, [section]);
      const readFromPage = (page) => {
        tasmee.setActive(false);
        ctx.setActiveTab('hifz');
        ctx.handleNavigateMushafPage(page, 'mushaf_page');
        ctx.setMushafOverlayMode('none');
        ctx.setIsFullMasked(false);
        setFromTajweed(true);
      };
      const openedItem = planItems[itemIndex];
      // Back in a section from elsewhere: the hifz part holding the open page.
      const sectionItems = planItems.filter((it) => PLAN_SECTION[it.type] === section);
      const planItem = (openedItem && PLAN_SECTION[openedItem.type] === section ? openedItem
        : sectionItems.find((it) => it.type === 'hifz' && ctx.mushafPageNumber >= it.fromPage && ctx.mushafPageNumber <= it.toPage) || sectionItems[0]) || null;
      const [lectureIndex, setLectureIndex] = useState(0);
      const [history, setHistory] = useState([]);
      const [minimized, setMinimized] = useState(false);
      const [syncProblem, setSyncProblem] = useState(false);
      const [bodyRef, bodyWidth] = useElementWidth();
      // A wide window shows the controls and the student screen side by side
      // (student screen on the left, as on the split screen), so nothing sits
      // below the fold.
      const wide = bodyWidth >= 900;
      const previewWidth = wide ? Math.floor(bodyWidth * 0.5) : bodyWidth;
      const [fullWidthHintHidden, setFullWidthHintHidden] = useState(false);
      // Two ways to teach: the teacher window beside the student window (the
      // student window is already on screen, so no preview here), or the
      // teacher window filling the screen with the student window behind it
      // (Zoom still shares it while it is not minimised; the preview shows it).
      const teacherFillsScreen = !!window.screen && window.outerWidth > (window.screen.availWidth || 0) * 0.7;
      const studentBeside = ctx.studentScreenOpen && !teacherFillsScreen;
      const fillsScreen = ctx.studentScreenOpen && teacherFillsScreen && !fullWidthHintHidden;
      const [previewAnyway, setPreviewAnyway] = useState(false);
      // Mistakes counted in تسميع stay while the teacher steps out to the full
      // program or another section.
      const tasmee = useTasmeeSession(ctx);
      // Mistakes counted on the open page are offered for saving before the
      // class ends, rather than lost.
      const endClass = () => {
        if (tasmee.mistakes.length) {
          const who = tasmee.student ? tasmee.student.name : null;
          if (who && window.confirm('في العدّاد أخطاء لم تُحفظ لهذه الصفحة. حفظها في سجل ' + who + ' قبل إنهاء الحصة؟')) {
            const error = tasmee.finish(tasmee.total < tasmee.limit ? 'passed' : 'repeat');
            if (error) { window.alert('لم تُحفظ الأخطاء، والحصة باقية: ' + error); return; }
          } else if (!window.confirm('إنهاء الحصة دون حفظ أخطاء هذه الصفحة؟ (إلغاء: البقاء في الحصة)')) {
            return;
          }
        }
        onEnd();
      };

      // The class starts on the plan's first item.
      useEffect(() => {
        if (planItems[0]) openPlanItem(ctx, planItems[0], setLectureIndex, tasmee);
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

      const preview = (
        <section className="bg-white rounded-2xl p-3 border border-emerald-900/10">
          <h4 className="font-black text-emerald-900 text-sm mb-2">👁️ ما يراه الطلاب الآن</h4>
          <div className="flex justify-center">
            <StudentPreview stage={stage} width={Math.max(200, Math.min(wide ? 1400 : 440, previewWidth - 24))} />
          </div>
        </section>
      );
      const panels = (
        <>
          {section === 'hifz' && ctx.classStudentId && !briefHidden && <StudentBrief studentId={ctx.classStudentId} onClose={() => setBriefHidden(true)} />}
          {section === 'hifz' && <HifzClassPanel ctx={ctx} planItem={fromTajweed ? null : planItem} tasmee={tasmee} onBackToTajweed={fromTajweed ? () => { setFromTajweed(false); ctx.setActiveTab('tajweed'); } : null} />}
          {section === 'tajweed' && <TajweedClassPanel ctx={ctx} planItem={planItem} onReadFromPage={readFromPage} />}
          {section === 'islamic' && <LectureClassPanel ctx={ctx} index={lectureIndex} setIndex={setLectureIndex} onOpenStudio={() => { setMinimized(true); ctx.setSlideStudioOpen(true); }} />}
          <ClassHistory history={history} currentKey={classStageKey(stage)} onRestore={restore} />
        </>
      );

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
            {!planItems.length && <button type="button" onClick={() => setAddingPart(true)} className="px-3 py-1.5 rounded-xl text-sm font-bold border-2 border-dashed border-gold-400/70 text-gold-200">➕ جزء جديد</button>}
            <button type="button" onClick={() => setMinimized(true)} className="px-3 py-1.5 rounded-xl text-sm font-bold bg-white/90 text-emerald-950 border-2 border-white" title="البرنامج الكامل، والحصة مستمرة">⚙️ كل الأدوات</button>
            {ctx.studentScreenOpen && (
              <button type="button" onClick={ctx.handleArrangeStudentWindow} className="px-3 py-1.5 rounded-xl text-sm font-bold bg-emerald-900/70 text-emerald-50 border-2 border-emerald-700" title="يعيد شاشة الطالب إلى النصف الأيسر وفوق النوافذ الأخرى">🖥️ إظهار شاشة الطالب</button>
            )}
            {!ctx.studentScreenOpen && (
              <button type="button" onClick={ctx.handleOpenStudentPopout} className="px-3 py-1.5 rounded-xl text-sm font-black bg-rose-600 text-white">🖥️ فتح شاشة الطالب</button>
            )}
            <button type="button" onClick={endClass} className="px-3 py-1.5 rounded-xl text-sm font-bold text-gold-200 border-2 border-gold-400/60">■ إنهاء الحصة</button>
          </div>
          {planItems.length > 0 && (
            <div className="shrink-0 bg-emerald-950 px-3 py-2 flex gap-2 overflow-x-auto">
              <span className="text-gold-300 font-black text-sm self-center shrink-0">📋 جدول الحصة:</span>
              <button type="button" onClick={() => setAddingPart(true)} className="shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold border-2 border-dashed border-gold-400/70 text-gold-200">➕ جزء جديد</button>
              {planItems.map((it, i) => (
                <button key={i} type="button" onClick={() => { setItemIndex(i); setFromTajweed(false); openPlanItem(ctx, it, setLectureIndex, tasmee); }}
                  className={'shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold border-2 ' + (it === planItem ? 'bg-gold-400 text-emerald-950 border-gold-200' : 'bg-emerald-900 text-emerald-50 border-emerald-700')}>
                  {(i + 1) + '. ' + classPlanItemLabel(it)}
                </button>
              ))}
            </div>
          )}
          {addingPart && (
            <AddClassPart planItems={planItems} onClose={() => setAddingPart(false)} onAdd={(item) => {
              onAddPlanItem(item);
              setAddingPart(false);
              setFromTajweed(false);
              setItemIndex(planItems.length);
              openPlanItem(ctx, item, setLectureIndex, tasmee);
            }} />
          )}
          {fillsScreen && (
            <div className="shrink-0 bg-gold-100 text-emerald-950 px-3 py-2 flex flex-wrap items-center gap-2 text-sm font-bold border-b-2 border-gold-400">
              <span className="flex-1">🖥️ شاشة الطالب خلف هذه النافذة، والطلاب في زوم يرونها ما دامت غير مصغّرة. وما يرونه ظاهر هنا في «ما يراه الطلاب الآن».</span>
              <button type="button" onClick={() => setFullWidthHintHidden(true)} className="px-3 py-1 rounded-lg bg-emerald-900 text-gold-200 font-black">إخفاء</button>
            </div>
          )}
          {syncProblem && <p className="bg-rose-600 text-white text-center font-bold py-1 text-sm">⚠️ قد لا تتابع شاشة الطالب. الحل: إغلاقها ثم فتحها من جديد.</p>}

          <div ref={bodyRef} className={'flex-1 min-h-0 p-3 ' + (wide ? 'flex gap-3' : 'overflow-y-auto space-y-3')}>
            {wide ? (
              <>
                <div className="flex-1 min-w-0 overflow-y-auto space-y-3">{panels}</div>
                <div className="shrink-0 overflow-y-auto" style={{ width: previewWidth }}>{preview}</div>
              </>
            ) : (
              <>
                {studentBeside && !previewAnyway ? (
                  <div className="bg-white rounded-2xl px-3 py-2 border border-emerald-900/10 flex flex-wrap items-center gap-2 text-sm">
                    <span className="flex-1 font-bold text-emerald-900">👁️ ما يراه الطلاب ظاهر في نافذة شاشة الطالب بجوار هذه النافذة.</span>
                    <button type="button" onClick={() => setPreviewAnyway(true)} className="px-3 py-1 rounded-lg border-2 border-emerald-900/20 font-bold text-emerald-900">عرضه هنا أيضاً</button>
                  </div>
                ) : preview}
                {panels}
              </>
            )}
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
