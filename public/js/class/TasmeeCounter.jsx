    // Recitation from memory (تسميع) in class: the teacher counts the student's
    // mistakes on the page in front of her, and when the page ends the program
    // says whether it is passed or to be repeated, and keeps the record.

    // The session is shared by the counter bar and the teacher's text (where a
    // mistake can be marked on the word itself). Counting needs a chosen
    // student, so every counted mistake has a record to go to; and counted
    // mistakes are only cleared once they are saved.
    function useTasmeeSession(ctx) {
      const [active, setActive] = useState(false);
      const [students, setStudents] = useState(loadStudents);
      const [studentId, setStudentId] = useState(ctx.classStudentId || '');
      const student = students.find((s) => s.id === studentId) || null;
      const [limit, setLimit] = useState(student ? student.mistakeLimit : DEFAULT_MISTAKE_LIMIT);
      const [mistakes, setMistakes] = useState([]);
      const [message, setMessage] = useState(
        ctx.classStudentId && !student ? 'طالب هذه الحصة لم يعد في قائمة «طلابي»: يلزم اختياره أو إضافته.' : '');

      // The limit follows the chosen student; the teacher may change it for this page.
      useEffect(() => { if (student) setLimit(student.mistakeLimit); }, [studentId]);

      const total = mistakeTotal(mistakes);
      const saveRecord = (page, result) => {
        if (!student) return 'يلزم اختيار الطالب أولاً ليُحفظ في سجله.';
        const counts = { memo: 0, tash: 0, prompt: 0 };
        mistakes.forEach((m) => { counts[m.type] += 1; });
        return addTasmeeRecord({
          id: 'r' + Date.now().toString(36), studentId: student.id, at: new Date().toISOString(),
          page, surahName: ctx.hifzSurahName || '', memo: counts.memo, tash: counts.tash, prompt: counts.prompt,
          total, limit, result, words: mistakes.filter((m) => m.word).map((m) => ({ word: m.word, ayah: m.ayah, type: m.type }))
        });
      };

      // Moving to another page saves the mistakes counted on the previous one,
      // even with counting switched off meanwhile.
      const pageRef = useRef(ctx.mushafPageNumber);
      useEffect(() => {
        const previous = pageRef.current;
        pageRef.current = ctx.mushafPageNumber;
        if (previous === ctx.mushafPageNumber || !mistakes.length) return;
        const error = saveRecord(previous, total < limit ? 'passed' : 'repeat');
        if (error) {
          setMessage('لم تُحفظ أخطاء الصفحة ' + previous + ': ' + error + ' وهي باقية في العدّاد.');
          return;
        }
        setMistakes([]);
        setMessage('حُفظت أخطاء الصفحة ' + previous + ' في سجل ' + student.name + '.');
      }, [ctx.mushafPageNumber]);

      const commitStudents = (list, okMessage) => {
        const error = saveStudents(list);
        if (error) { setMessage(error); return false; }
        setStudents(list);
        if (okMessage) setMessage(okMessage);
        return true;
      };

      return {
        active, setActive, students, student, studentId, limit, setLimit, mistakes, total, message, setMessage,
        selectStudent: setStudentId,
        reloadStudents: () => setStudents(loadStudents()),
        addStudent: (name) => {
          if (!name || !name.trim()) return;
          const s = newStudent(name);
          if (commitStudents(loadStudents().concat([s]))) setStudentId(s.id);
        },
        saveLimitForStudent: () => {
          if (!student) return;
          const list = loadStudents().map((s) => (s.id === student.id ? Object.assign({}, s, { mistakeLimit: limit }) : s));
          commitStudents(list, 'صار حد الأخطاء الأساسي لـ' + student.name + ': ' + formatMistakes(limit) + '.');
        },
        add: (type, word, ayah, key) => {
          if (!student) { setMessage('يلزم اختيار الطالب أولاً ليُحفظ في سجله.'); return; }
          setMistakes((list) => list.concat([{ type, word: word || '', ayah: ayah || null, key: key || null }]));
        },
        undo: () => setMistakes((list) => list.slice(0, -1)),
        // Returns true when saved.
        finish: (result) => {
          const error = saveRecord(ctx.mushafPageNumber, result);
          if (error) { setMessage(error); return false; }
          setMistakes([]);
          setMessage(result === 'passed' ? '✓ حُفظ: ينتقل إلى الوجه التالي.' : '↻ حُفظ: يُعاد الوجه.');
          return true;
        }
      };
    }

    function TasmeeCounter({ session, ctx, onOpenStudents }) {
      const s = session;
      const over = s.total >= s.limit;
      const ready = !!s.student;
      const [alertNote, setAlertNote] = useState('');
      useAlertBlockedNotice((played) => setAlertNote(played
        ? 'صوت التنبيه خرج من جهاز المعلم، لأن نافذة الطالب لا تسمح بالصوت حتى يُضغط داخلها مرة واحدة.'
        : 'تعذّر تشغيل صوت التنبيه: يلزم الضغط مرة داخل نافذة الطالب.'));
      const btn = 'px-3 py-2 rounded-xl font-black text-sm border-2 disabled:opacity-40 ';

      return (
        <section className="bg-white rounded-2xl p-3 border-2 border-emerald-800/30 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-black text-emerald-900">📝 التسميع وتسجيل الأخطاء</h4>
            <select value={s.studentId} onChange={(e) => {
              if (e.target.value === '__new') s.addStudent(window.prompt('اسم الطالب:') || '');
              else s.selectStudent(e.target.value);
            }} className="border-2 border-emerald-900/15 rounded-xl px-2 py-1 font-bold min-w-0 max-w-full">
              <option value="">— اختيار الطالب —</option>
              {s.students.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}
              <option value="__new">➕ طالب جديد…</option>
            </select>
            <button type="button" onClick={onOpenStudents} className="text-sm font-bold text-emerald-800 underline">سجل الطلاب</button>
          </div>
          {!ready && <p className="text-sm font-bold text-amber-900">يبدأ العدّ بعد اختيار الطالب، ليُحفظ في سجله.</p>}

          <div className={'flex flex-wrap items-center gap-2 rounded-xl px-3 py-2 ' + (over ? 'bg-rose-50 border border-rose-300' : 'bg-emerald-50 border border-emerald-200')}>
            <span className={'text-xl font-black ' + (over ? 'text-rose-800' : 'text-emerald-900')}>
              الأخطاء: {formatMistakes(s.total)} من {formatMistakes(s.limit)}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold">
              <span>الحد:</span>
              <button type="button" className="w-7 h-7 rounded-lg border-2 border-emerald-900/20 font-black" onClick={() => s.setLimit(Math.max(0.5, s.limit - 0.5))}>−</button>
              <button type="button" className="w-7 h-7 rounded-lg border-2 border-emerald-900/20 font-black" onClick={() => s.setLimit(s.limit + 0.5)}>+</button>
              {s.student && s.limit !== s.student.mistakeLimit && (
                <button type="button" className="text-xs underline text-emerald-800" onClick={s.saveLimitForStudent}>حفظه حداً أساسياً للطالب</button>
              )}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button type="button" disabled={!ready} className={btn + 'bg-rose-600 text-white border-rose-600'} onClick={() => s.add('memo')}>خطأ حفظ +1</button>
            <button type="button" disabled={!ready} className={btn + 'bg-amber-400 text-emerald-950 border-amber-400'} onClick={() => s.add('tash')}>تشكيل/تجويد +½</button>
            <button type="button" disabled={!ready} className={btn + 'bg-white text-emerald-950 border-emerald-900/20'} onClick={() => s.add('prompt')}>تلقين +1</button>
            <button type="button" className={btn + 'bg-emerald-900 text-gold-200 border-emerald-900'} onClick={() => { setAlertNote(''); sendStudentAlert(ctx.studentScreenOpen, (played) => setAlertNote(played ? '' : 'تعذّر تشغيل صوت التنبيه على هذا الجهاز.')); }}>🔔 تنبيه</button>
            {s.mistakes.length > 0 && <button type="button" className={btn + 'bg-white text-slate-600 border-slate-200'} onClick={s.undo}>↶ تراجع</button>}
          </div>
          <p className="text-xs text-slate-600">للتسجيل على الكلمة نفسها: الضغط عليها في النص الكامل أدناه. وصوت التنبيه يصل إلى الطالب في زوم مع خيار «Share sound» عند المشاركة.</p>

          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
            <button type="button" disabled={!ready} className={btn + (over ? 'bg-white text-emerald-900 border-emerald-900/20' : 'bg-emerald-700 text-white border-emerald-700')} onClick={() => s.finish('passed')}>✓ انتهى الوجه: ينتقل</button>
            <button type="button" disabled={!ready} className={btn + (over ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-rose-700 border-rose-200')} onClick={() => s.finish('repeat')}>↻ يُعاد الوجه</button>
          </div>
          {over && <p className="text-sm font-black text-rose-800">بلغت الأخطاء الحد: يُعاد الوجه.</p>}
          {s.message && <p className="text-sm font-bold text-emerald-900">{s.message}</p>}
          {alertNote && <p className="text-xs font-bold text-amber-900">{alertNote}</p>}
        </section>
      );
    }

    // Shown over the teacher's text when a word is pressed during تسميع.
    function TasmeeWordChooser({ pick, onChoose, onCancel }) {
      return (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 bg-emerald-950 text-gold-100 rounded-xl px-3 py-2 mb-2">
          <span className="font-quran text-xl">{pick.word}</span>
          <span className="text-sm font-bold flex-1">: نوع الخطأ؟</span>
          <button type="button" className="px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-sm" onClick={() => onChoose('memo')}>حفظ +1</button>
          <button type="button" className="px-3 py-1 rounded-lg bg-amber-400 text-emerald-950 font-black text-sm" onClick={() => onChoose('tash')}>تشكيل/تجويد +½</button>
          <button type="button" className="px-3 py-1 rounded-lg bg-white text-emerald-950 font-black text-sm" onClick={() => onChoose('prompt')}>تلقين +1</button>
          <button type="button" className="px-2 py-1 rounded-lg text-gold-200 font-bold text-sm" onClick={onCancel}>إلغاء</button>
        </div>
      );
    }
