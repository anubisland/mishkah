    // The teacher's tajweed panel in class mode: choose the lesson, step
    // through its slides, and read the companion material for the slide the
    // students see (from Dr. Ayman Suwayd's curriculum data).
    // planItem: today's lessons; the picker lists only them, and "next" on a
    // lesson's last slide moves on to the next planned lesson.
    function TajweedClassPanel({ ctx, planItem }) {
      const lesson = ctx.currentSuwaydLesson;
      const slides = ctx.currentZoomSlides;
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
              <button type="button" className={classPill(false)} disabled={index === 0} onClick={() => go(index - 1)}>→ السابقة</button>
              <span className="flex-1 text-center font-black text-emerald-950 text-sm">الشريحة {index + 1} من {slides.length}</span>
              <button type="button" className={classPill(true)} disabled={index >= slides.length - 1 && !nextLesson} onClick={() => go(index + 1)}>
                {index >= slides.length - 1 && nextLesson ? 'الدرس التالي ←' : 'التالية ←'}
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
        </>
      );
    }

    function TeacherNote({ title, children, tone }) {
      if (!children) return null;
      return (
        <section className={'rounded-2xl p-4 border ' + (tone || 'bg-white border-emerald-900/10')}>
          <h4 className="font-black text-emerald-900 text-sm mb-1.5">{title}</h4>
          <div className="text-slate-800 leading-relaxed whitespace-pre-line">{children}</div>
        </section>
      );
    }

    function TajweedOverviewNotes({ lesson, ctx }) {
      const plates = getSuwaydPlatesForLesson(lesson.id);
      return (
        <>
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
                  <li key={i}><span className="font-quran text-xl text-emerald-950">{ex.word}</span> <span className="text-xs text-slate-500">({ex.surah}{ex.type ? ' — ' + ex.type : ''})</span></li>
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
          <TeacherNote title="❓ سؤال تطرحينه على الطالبات" tone="card-islamic-sky border-sky-200">{lesson.teacherPromptAr}</TeacherNote>
          <TeacherNote title="👂 أخطاء شائعة تنتبهين لها" tone="card-islamic-amber border-gold-300">{lesson.commonMistakesAr}</TeacherNote>
        </>
      );
    }
