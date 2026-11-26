    // "My classes": the teacher's upcoming classes. She adds a class with its
    // day and time, prepares its plan ahead (the program then downloads what
    // the plan needs), adds it to her phone's calendar for a reminder, and
    // starts it from here when its time comes.
    function MyClasses({ onStartClass, onStartUnscheduled, onClose }) {
      const [list, setList] = useState(loadClassSchedule);
      const [saveError, setSaveError] = useState(null);
      const [planning, setPlanning] = useState(null); // the class whose plan is open
      const [title, setTitle] = useState('');
      const [day, setDay] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
      const [time, setTime] = useState('17:00');

      const commit = (next) => {
        setList(next);
        setSaveError(saveClassSchedule(next));
      };

      const addClass = () => {
        if (!title.trim() || !day || !time) return;
        const at = new Date(day + 'T' + time).toISOString();
        commit(list.concat([{ id: 'c' + Date.now().toString(36), title: title.trim(), at, plan: null, preparedAt: null }]));
        setTitle('');
      };

      const upcoming = upcomingClasses(list);
      const soon = (c) => new Date(c.at).getTime() - Date.now() < PLAN_REMINDER_DAYS * 86400000;

      return (
        <div className="fixed inset-0 z-[65] bg-black/50 flex items-center justify-center p-3" dir="rtl">
          <div className="bg-[#f8f6ef] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto p-5 space-y-4 border-2 border-gold-400">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-emerald-950">📅 حصصي</h3>
              <button type="button" onClick={onClose} className="px-3 py-1 rounded-xl border border-slate-300 font-bold">✕</button>
            </div>
            {saveError && <p className="text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-xl p-2">{saveError}</p>}

            <section className="bg-white rounded-2xl p-4 border border-emerald-900/10 space-y-2">
              <h4 className="font-black text-emerald-950">➕ إضافة حصة</h4>
              <div className="flex flex-wrap items-center gap-2">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اسم الحلقة أو الطالبة"
                  className="flex-1 min-w-[160px] border-2 border-emerald-900/15 rounded-xl px-3 py-1.5 font-bold" />
                <input type="date" value={day} onChange={(e) => setDay(e.target.value)} className="border-2 border-emerald-900/15 rounded-xl px-2 py-1.5" />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="border-2 border-emerald-900/15 rounded-xl px-2 py-1.5" />
                <button type="button" onClick={addClass} disabled={!title.trim()} className="px-4 py-1.5 rounded-xl bg-emerald-900 text-gold-200 font-black disabled:opacity-40">أضيفي</button>
              </div>
            </section>

            {upcoming.length === 0 && <p className="text-center text-slate-600 py-4">لا توجد حصص قادمة. أضيفي حصتكِ القادمة لتجهّزي خطتها من الآن.</p>}
            <div className="space-y-2">
              {upcoming.map((c) => (
                <div key={c.id} className={'rounded-2xl p-3 border-2 space-y-2 ' + (c.plan ? 'bg-white border-emerald-200' : (soon(c) ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'))}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-black text-emerald-950">{c.title}</p>
                      <p className="text-sm text-slate-600">{formatClassTime(c.at)}</p>
                    </div>
                    <span className={'text-sm font-bold px-2 py-0.5 rounded-lg ' + (c.plan ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-200 text-amber-950')}>
                      {c.plan ? '✓ الخطة جاهزة' : '⚠️ لم تُجهَّز الخطة'}
                    </span>
                  </div>
                  {c.plan && <p className="text-sm text-slate-700">{c.plan.items.map(classPlanItemLabel).join(' • ')}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" onClick={() => setPlanning(c)} className="px-3 py-1.5 rounded-xl bg-emerald-900 text-gold-200 font-bold text-sm">📋 {c.plan ? 'تعديل الخطة' : 'جهّزي الخطة'}</button>
                    <button type="button" onClick={() => downloadClassCalendarFile(c)} className="px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold text-sm" title="تضيف الحصة إلى تقويم هاتفكِ مع تذكير قبلها بيوم">📅 أضيفي إلى التقويم</button>
                    <button type="button" onClick={() => onStartClass(c)} className="px-3 py-1.5 rounded-xl bg-gold-400 text-emerald-950 font-black text-sm">▶ ابدئي</button>
                    <button type="button" onClick={() => { if (window.confirm('حذف حصة «' + c.title + '»؟')) commit(list.filter((x) => x.id !== c.id)); }} className="px-2 py-1.5 rounded-xl text-rose-700 font-bold text-sm mr-auto">🗑 حذف</button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={onStartUnscheduled} className="w-full py-2 rounded-xl border-2 border-dashed border-emerald-900/30 font-bold text-emerald-900">
              ▶ حصة الآن دون موعد مسبق
            </button>
          </div>

          {planning && (
            <ClassPlanner mode="save" title={planning.title} initialPlan={planning.plan}
              onSave={(plan) => {
                commit(list.map((x) => (x.id === planning.id ? Object.assign({}, x, { plan, preparedAt: Date.now() }) : x)));
                setPlanning(null);
              }}
              onClose={() => setPlanning(null)} />
          )}
        </div>
      );
    }
