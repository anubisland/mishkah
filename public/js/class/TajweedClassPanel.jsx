    // The teacher's tajweed panel in class mode: choose the lesson, step
    // through its slides, and read the companion material for the slide the
    // students see (from Dr. Ayman Suwayd's curriculum data).
    // planItem: today's lessons; the picker lists only them, and "next" on a
    // lesson's last slide moves on to the next planned lesson.
    // onReadFromPage(page): the students read from a mushaf page the teacher picks.
    function TajweedClassPanel({ ctx, planItem, onReadFromPage }) {
      // In an English class the lesson's teaching texts are in English.
      const lesson = localiseTajweedLesson(ctx.currentSuwaydLesson, ctx.classLanguage);
      const slides = useMemo(() => buildTajweedZoomSlides(lesson), [lesson.id, lesson.isEnglish]);
      const index = Math.min(ctx.suwaydZoomSlideIndex, Math.max(0, slides.length - 1));
      const slide = slides[index];
      const lessons = planItem ? SUWAYD_TAJWEED_CURRICULUM.filter((l) => planItem.lessonIds.includes(l.id)) : SUWAYD_TAJWEED_CURRICULUM;
      const lessonPos = lessons.findIndex((l) => l.id === lesson.id);
      const nextLesson = lessonPos >= 0 ? lessons[lessonPos + 1] : null;
      useEffect(() => {
        if (planItem && lessonPos === -1 && lessons[0]) {
          ctx.setSuwaydLessonId(lessons[0].id);
          ctx.setSuwaydZoomSlideIndex(0);
        }
      }, [planItem, lessonPos]);
      const go = (i) => {
        if (i > slides.length - 1 && nextLesson) {
          ctx.setSuwaydLessonId(nextLesson.id);
          ctx.setSuwaydZoomSlideIndex(0);
          return;
        }
        ctx.setSuwaydZoomSlideIndex(Math.max(0, Math.min(slides.length - 1, i)));
      };

      return (
        <>
          <section className="bg-white rounded-2xl p-3 border border-emerald-900/10 space-y-3">
            <select value={lesson.id} onChange={(e) => { ctx.setSuwaydLessonId(e.target.value); ctx.setSuwaydZoomSlideIndex(0); }}
              className="w-full border-2 border-emerald-900/15 rounded-xl px-2 py-2 font-bold">
              {lessons.map((l, i) => <option key={l.id} value={l.id}>{(i + 1) + '. ' + l.titleAr}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <button type="button" className={'order-last ' + classPill(false)} disabled={index === 0} onClick={() => go(index - 1)}>السابقة ←</button>
              <span className="flex-1 text-center font-black text-emerald-950 text-sm">الشريحة {index + 1} من {slides.length}</span>
              <button type="button" className={'order-first ' + classPill(true)} disabled={index >= slides.length - 1 && !nextLesson} onClick={() => go(index + 1)}>
                {index >= slides.length - 1 && nextLesson ? '→ الدرس التالي' : '→ التالية'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {slides.map((s, i) => (
                <button key={i} type="button" onClick={() => go(i)} title={s.titleAr}
                  className={'px-2 py-1 rounded-lg text-xs font-bold border ' + (i === index ? 'bg-gold-400 border-gold-500 text-emerald-950' : 'bg-white border-slate-200 text-slate-700')}>
                  {s.type === 'overview' ? 'المتن واللوحة' : s.type === 'breakdown' ? (s.item.letter || s.titleAr) : s.example.word}
                </button>
              ))}
            </div>
          </section>

          {slide && slide.type === 'overview' && <TajweedOverviewNotes lesson={lesson} ctx={ctx} />}
          {slide && slide.type === 'breakdown' && <TajweedBreakdownNotes item={slide.item} />}
          {slide && slide.type === 'example' && <TajweedExampleNotes example={slide.example} lesson={lesson} ctx={ctx} />}
          <TajweedTeachingNotes lesson={lesson} />
          {lesson.isEnglish && !SUWAYD_ENGLISH_REVIEWED && (
            <p className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-xl p-2">الشرح الإنجليزي ترجمة أولية تنتظر مراجعة المعلم قبل اعتمادها.</p>
          )}
          {onReadFromPage && <TajweedReadingPicker onRead={onReadFromPage} />}
        </>
      );
    }

    function TeacherNote({ title, children, tone }) {
      if (!children) return null;
      return (
        <section className={'rounded-2xl p-4 border ' + (tone || 'bg-white border-emerald-900/10')}>
          <h4 className="font-black text-emerald-900 text-sm mb-1.5">{title}</h4>
          <div dir="auto" className="text-slate-800 leading-relaxed whitespace-pre-line">{children}</div>
        </section>
      );
    }

    function TajweedOverviewNotes({ lesson, ctx }) {
      const plates = getSuwaydPlatesForLesson(lesson.id);
      return (
        <>
          <section className="bg-white rounded-2xl p-3 border border-emerald-900/10 flex flex-wrap items-center gap-2">
            <span className="font-black text-emerald-900 text-sm flex-1">🔍 لوحة المخرج عند الطلاب</span>
            <button type="button" className={classPill(ctx.tajweedPlateLarge)} onClick={() => ctx.setTajweedPlateLarge(!ctx.tajweedPlateLarge)}>
              {ctx.tajweedPlateLarge ? 'عرض المتن مع اللوحة' : 'تكبير اللوحة'}
            </button>
          </section>
          <TeacherNote title="💎 التعريف">{lesson.definitionAr}</TeacherNote>
          <TeacherNote title="👄 كيف يخرج الصوت">{lesson.mechanismAr}</TeacherNote>
          {lesson.timingLabelAr && <TeacherNote title="⏱️ الزمن">{lesson.timingLabelAr}</TeacherNote>}
          {plates.length > 1 && (
            <section className="bg-white rounded-2xl p-3 border border-emerald-900/10">
              <h4 className="font-black text-emerald-900 text-sm mb-2">🖼️ اللوحة المعروضة</h4>
              <div className="flex flex-wrap gap-1.5">
                {plates.map((p) => (
                  <button key={p.id} type="button" onClick={() => ctx.setActiveSuwaydPlateId(p.id)}
                    className={classPill((ctx.activeSuwaydPlateId || plates[0].id) === p.id)}>{p.titleAr || p.id}</button>
                ))}
              </div>
            </section>
          )}
        </>
      );
    }

    function TajweedBreakdownNotes({ item }) {
      return (
        <>
          <TeacherNote title={'🔤 ' + item.titleAr + (item.tagAr ? ' — ' + item.tagAr : '')}>{item.explanationAr}</TeacherNote>
          {item.warningAr && <TeacherNote title="⚠️ تنبيه الأداء" tone="bg-rose-50 border-rose-200">{item.warningAr}</TeacherNote>}
          {item.examples && item.examples.length > 0 && (
            <TeacherNote title="📖 أمثلة للتطبيق">
              <ul className="space-y-1">
                {item.examples.map((ex, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-2"><span className="font-quran text-xl text-emerald-950">{ex.word}</span> <span className="text-xs text-slate-500">({ex.surah}{ex.type ? ' — ' + ex.type : ''})</span> <ExampleAudioButton refText={ex.surah} /></li>
                ))}
              </ul>
            </TeacherNote>
          )}
        </>
      );
    }

    function TajweedExampleNotes({ example, lesson, ctx }) {
      const counts = lesson.timingCounts || 2;
      return (
        <>
          <TeacherNote title={'📖 ' + (example.surah || '')}>
            <p className="font-quran text-3xl text-emerald-950">{example.word}</p>
            {example.note && <p className="mt-1">💡 {example.note}</p>}
            <div className="mt-2"><ExampleAudioButton refText={example.surah} /></div>
          </TeacherNote>
          <section className="bg-white rounded-2xl p-3 border border-emerald-900/10 flex items-center gap-2">
            <span className="font-black text-emerald-900 text-sm flex-1">⏱️ ميزان الحركات ({counts})</span>
            <button type="button" className={classPill(ctx.metronomePlaying)} onClick={() => {
              if (ctx.metronomeCount !== counts) ctx.setMetronomeCount(counts);
              ctx.setMetronomePlaying(!ctx.metronomePlaying);
            }}>{ctx.metronomePlaying ? '⏸️ إيقاف' : '▶ تشغيل'}</button>
          </section>
        </>
      );
    }

    // Lesson-wide material: a question to ask and the mistakes to listen for.
    function TajweedTeachingNotes({ lesson }) {
      return (
        <>
          <TeacherNote title="🎯 توجيه للمعلم في هذا الدرس" tone="card-islamic-sky border-sky-200">{lesson.teacherPromptAr}</TeacherNote>
          <TeacherNote title="👂 أخطاء شائعة يُنتبه لها" tone="card-islamic-amber border-gold-300">{lesson.commonMistakesAr}</TeacherNote>
        </>
      );
    }

    // The reading practice after the lesson: the students read, one by one as
    // the teacher calls them, from a mushaf page she picks.
    function TajweedReadingPicker({ onRead }) {
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const [page, setPage] = useState(1);
      const clampPage = (v) => Math.max(1, Math.min(604, parseInt(v, 10) || 1));
      const select = 'border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold min-w-0 max-w-full';
      return (
        <section className="card-islamic-sage rounded-2xl p-3 border border-emerald-200 space-y-2">
          <h4 className="font-black text-emerald-900 text-sm">📖 التطبيق: القراءة من المصحف</h4>
          <div className="flex flex-wrap items-center gap-2">
            <select value="" onChange={(e) => { const s = surahs.find((x) => String(x.id) === e.target.value); if (s) setPage(s.startPage); }} className={select}>
              <option value="">السورة…</option>
              {surahs.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
            </select>
            <select value="" onChange={(e) => { if (e.target.value) setPage(JUZ_START_PAGES[parseInt(e.target.value, 10) - 1]); }} className={select}>
              <option value="">الجزء…</option>
              {JUZ_START_PAGES.map((_, j) => <option key={j} value={j + 1}>الجزء {j + 1}</option>)}
            </select>
            <span className="font-bold">صفحة</span>
            <input type="number" min="1" max="604" value={page} onChange={(e) => setPage(clampPage(e.target.value))} className="w-20 border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold" />
            <button type="button" className={classPill(true)} onClick={() => onRead(page)}>عرض الصفحة للطلاب</button>
          </div>
        </section>
      );
    }
