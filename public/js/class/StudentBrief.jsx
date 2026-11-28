    // Where a student stands, at a glance: their last recited pages, the words
    // to review, and their usual mistake limit. Shown on the Home card of a
    // class linked to a student and at the start of that class.
    // compact: one line for the Home card.
    function StudentBrief({ studentId, compact, onClose }) {
      const student = loadStudents().find((s) => s.id === studentId);
      if (!student) return null;
      const records = recordsForStudent(studentId);
      const recent = records.slice(0, 3);
      // Words to review: from the last three pages, without repeats.
      const words = [];
      recent.forEach((r) => (r.words || []).forEach((w) => { if (!words.some((x) => x.word === w.word)) words.push(w); }));
      const line = (r) => (r.result === 'passed' ? '✓ انتقل' : '↻ أُعيد') + ' — ' + r.surahName + ' ص ' + r.page + ' (' + formatMistakes(r.total) + ' من ' + formatMistakes(r.limit) + ')';

      if (compact) {
        return (
          <div className="text-sm bg-white/70 rounded-xl px-3 py-2 border border-emerald-900/10">
            <span className="font-black text-emerald-900">👤 {student.name}: </span>
            {recent.length ? <span>آخر تسميع {line(recent[0])}</span> : <span className="text-slate-600">لم يُسجَّل تسميع بعد.</span>}
            {words.length > 0 && <span> • <b>للمراجعة:</b> {words.slice(0, 4).map((w, i) => <span key={i} className="font-quran text-base mx-1">{w.word}</span>)}</span>}
          </div>
        );
      }

      return (
        <section className="card-islamic-sky rounded-2xl p-3 border border-sky-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-emerald-950 flex-1">👤 {student.name} <span className="text-sm font-bold text-slate-600">• حد الأخطاء {formatMistakes(student.mistakeLimit)}</span></h4>
            {onClose && <button type="button" onClick={onClose} className="px-2 py-0.5 rounded-lg text-sm font-bold text-slate-600" title="إخفاء">✕</button>}
          </div>
          {recent.length ? (
            <ul className="text-sm space-y-0.5">
              {recent.map((r) => (
                <li key={r.id}>
                  <span className={'font-black ' + (r.result === 'passed' ? 'text-emerald-800' : 'text-rose-700')}>{line(r)}</span>
                  <span className="text-xs text-slate-500"> • {new Date(r.at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-600">لم يُسجَّل له تسميع بعد.</p>}
          {words.length > 0 && (
            <p className="text-sm"><b>للمراجعة:</b> {words.map((w, i) => <span key={i} className="font-quran text-lg mx-1">{w.word}</span>)}</p>
          )}
        </section>
      );
    }
