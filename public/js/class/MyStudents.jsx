    // «طلابي»: the teacher's students, each with a usual mistake limit and the
    // record of pages recited from memory, so progress shows from class to class.
    function MyStudents({ onClose }) {
      const [students, setStudents] = useState(loadStudents);
      const [name, setName] = useState('');
      const [openId, setOpenId] = useState(null);
      const [error, setError] = useState('');

      const commit = (list) => {
        const err = saveStudents(list);
        setError(err || '');
        if (!err) setStudents(list);
      };
      const add = () => {
        if (!name.trim()) return;
        commit(students.concat([newStudent(name)]));
        setName('');
      };
      const setLimit = (id, limit) => commit(students.map((s) => (s.id === id ? Object.assign({}, s, { mistakeLimit: Math.max(0.5, limit) }) : s)));

      return (
        <div className="fixed inset-0 z-[75] bg-black/50 flex items-center justify-center p-2 sm:p-4" dir="rtl">
          <div className="bg-[#FFFDF9] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col border-2 border-gold-400 overflow-hidden">
            <div className="shrink-0 emerald-pattern px-4 py-3 flex flex-wrap items-center gap-2">
              <h3 className="text-gold-200 font-black text-xl ml-auto">👥 طلابي</h3>
              <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl border-2 border-gold-400/60 text-gold-200 font-bold">✕ إغلاق</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
                  placeholder="اسم الطالب" className="flex-1 min-w-0 border-2 border-emerald-900/15 rounded-xl px-3 py-1.5 font-bold" />
                <button type="button" onClick={add} disabled={!name.trim()} className="px-4 py-1.5 rounded-xl bg-emerald-900 text-gold-200 font-black disabled:opacity-40">إضافة</button>
              </div>
              {error && <p className="text-rose-700 font-bold text-sm">{error}</p>}
              {!students.length && <p className="text-center text-slate-600 py-6">لا طلاب بعد. يُضاف الطالب هنا أو من لوحة الحصة عند التسميع.</p>}
              {students.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-emerald-900/10 p-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-emerald-950 text-lg ml-auto">{s.name}</p>
                    <span className="text-sm font-bold flex items-center gap-1">
                      حد الأخطاء:
                      <button type="button" className="w-7 h-7 rounded-lg border-2 border-emerald-900/20 font-black" onClick={() => setLimit(s.id, s.mistakeLimit - 0.5)}>−</button>
                      <span className="w-8 text-center font-black">{formatMistakes(s.mistakeLimit)}</span>
                      <button type="button" className="w-7 h-7 rounded-lg border-2 border-emerald-900/20 font-black" onClick={() => setLimit(s.id, s.mistakeLimit + 0.5)}>+</button>
                    </span>
                    <button type="button" onClick={() => setOpenId(openId === s.id ? null : s.id)} className="px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold text-sm">
                      {openId === s.id ? 'إخفاء السجل' : '📈 السجل'}
                    </button>
                    <button type="button" onClick={() => { if (window.confirm('حذف «' + s.name + '» وسجل تسميعه كله؟ لا يمكن التراجع عن ذلك.')) { const err = deleteStudentRecords(s.id); if (err) setError(err); else commit(students.filter((x) => x.id !== s.id)); } }}
                      className="px-2 py-1.5 rounded-xl text-rose-700 font-bold text-sm">🗑 حذف</button>
                  </div>
                  {openId === s.id && <StudentRecord studentId={s.id} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    function StudentRecord({ studentId }) {
      const records = recordsForStudent(studentId);
      if (!records.length) return <p className="text-sm text-slate-600">لم يُسجَّل تسميع بعد.</p>;
      const recent = records.slice(0, 10);
      const passed = recent.filter((r) => r.result === 'passed').length;
      return (
        <div className="space-y-2">
          <p className="text-sm font-black text-emerald-900">آخر {recent.length} أوجه: {passed} انتقل، و{recent.length - passed} أُعيد.</p>
          <div className="space-y-1">
            {records.slice(0, 30).map((r) => (
              <div key={r.id} className={'rounded-xl px-3 py-2 text-sm ' + (r.result === 'passed' ? 'bg-emerald-50' : 'bg-rose-50')}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-black">{r.result === 'passed' ? '✓ انتقل' : '↻ أُعيد'}</span>
                  <span>{r.surahName} • صفحة {r.page}</span>
                  <span>الأخطاء {formatMistakes(r.total)} من {formatMistakes(r.limit)}</span>
                  <span className="text-slate-600">(حفظ {r.memo}، تشكيل {r.tash}، تلقين {r.prompt})</span>
                  <span className="text-xs text-slate-500 mr-auto">{new Date(r.at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</span>
                </div>
                {r.words && r.words.length > 0 && (
                  <p className="mt-1 text-slate-700">
                    <span className="font-bold">للمراجعة: </span>
                    {r.words.map((w, i) => <span key={i} className="font-quran text-lg ml-2">{w.word}<span className="font-sans text-xs text-slate-500"> ({MISTAKE_LABELS[w.type]})</span></span>)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
