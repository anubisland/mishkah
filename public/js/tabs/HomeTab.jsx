    // Home: the teacher's day at a glance. The next class and its plan, the
    // classes that still need a plan, and shortcuts to the usual starting points.
    function HomeTab({ h }) {
      const schedule = useMemo(loadClassSchedule, [h.scheduleVersion]);
      const upcoming = upcomingClasses(schedule);
      const next = upcoming[0];
      const needPlan = classesNeedingPlan(schedule).filter((c) => !next || c.id !== next.id);
      const today = new Date();
      const hijri = (() => {
        try { return today.toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; }
      })();

      const shortcuts = [
        { icon: '➕', label: 'حصة جديدة', hint: 'إضافة حصة وتجهيز خطتها', run: h.openMyClasses },
        { icon: '🎞️', label: 'عرض محاضرة', hint: 'استوديو الشرائح', run: h.openStudio },
        { icon: '📖', label: 'المصحف والتسميع', hint: 'صفحات مصحف المدينة', run: () => h.navigate('hifz') },
        { icon: '🎙️', label: 'دروس التجويد', hint: 'منهج د. أيمن سويد', run: () => h.navigate('tajweed') },
        { icon: '❓', label: 'دليل الاستخدام', hint: 'كل خطوات البرنامج', run: h.openGuide }
      ];

      return (
        <div className="space-y-5" dir="rtl">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-emerald-950">السلام عليكم ورحمة الله</h2>
              <p className="text-slate-600 font-bold">{today.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}{hijri ? ' — ' + hijri : ''}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="card-islamic-pearl rounded-3xl p-5 border-2 border-gold-400/60">
              <h3 className="text-sm font-black text-gold-700 mb-2">الحصة القادمة</h3>
              {next ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-black text-emerald-950">{next.title}</p>
                    <p className="text-slate-700 font-bold">{formatClassTime(next.at)}</p>
                    {next.studentId && <div className="mt-1"><StudentBrief studentId={next.studentId} compact /></div>}
                  </div>
                  {next.plan ? (
                    <div className="rounded-2xl bg-white/80 border border-emerald-200 p-3">
                      <p className="text-sm font-black text-emerald-800 mb-1">✓ الخطة جاهزة</p>
                      <ol className="list-decimal pr-5 text-sm space-y-0.5">{next.plan.items.map((it, i) => <li key={i}>{classPlanItemLabel(it)}</li>)}</ol>
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-amber-50 border border-amber-300 p-3 text-sm font-bold text-amber-950">⚠️ لم تُجهَّز خطة هذه الحصة بعد.</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => h.startScheduledClass(next)} className="px-5 py-2.5 rounded-xl bg-gold-400 text-emerald-950 font-black">▶ بدء الحصة</button>
                    <button type="button" onClick={h.openMyClasses} className="px-4 py-2.5 rounded-xl bg-emerald-900 text-gold-200 font-bold">📋 {next.plan ? 'تعديل الخطة' : 'تجهيز الخطة'}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-700">لا توجد حصص قادمة في الجدول. إضافة الحصة القادمة الآن تسمح بتجهيز خطتها مبكراً.</p>
                  <button type="button" onClick={h.openMyClasses} className="px-5 py-2.5 rounded-xl bg-emerald-900 text-gold-200 font-black">➕ إضافة حصة</button>
                </div>
              )}
            </section>

            <section className="card-islamic-sage rounded-3xl p-5 border border-emerald-200">
              <h3 className="text-sm font-black text-emerald-800 mb-2">تحتاج إلى تجهيز</h3>
              {needPlan.length ? (
                <ul className="space-y-2">
                  {needPlan.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2 bg-white/80 rounded-xl px-3 py-2">
                      <span><b>{c.title}</b><span className="block text-xs text-slate-600">{formatClassTime(c.at)}</span></span>
                      <button type="button" onClick={h.openMyClasses} className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 font-bold text-sm">📋 تجهيز</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-700">✓ كل الحصص القريبة خططها جاهزة.</p>
              )}
            </section>
          </div>

          <section>
            <h3 className="text-sm font-black text-emerald-800 mb-2">نقاط البداية</h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {shortcuts.map((s) => (
                <button key={s.label} type="button" onClick={s.run}
                  className="text-right rounded-2xl bg-white border border-emerald-900/10 hover:border-gold-400 hover:shadow-md transition p-4">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <span className="block font-black text-emerald-950">{s.label}</span>
                  <span className="block text-xs text-slate-500">{s.hint}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      );
    }
