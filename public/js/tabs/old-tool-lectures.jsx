    // Lectures saved by the earlier six-stage tool (no longer shown). They are
    // kept on the device untouched; this card says they exist and lets the
    // teacher keep a copy in a file. Their generated format cannot be turned
    // into slides reliably, so they are not converted.
    const OLD_TOOL_LECTURES_KEY = 'mishkah_saved_lectures';

    function readOldToolLectures() {
      try {
        const saved = localStorage.getItem(OLD_TOOL_LECTURES_KEY);
        return { raw: saved || '', list: saved ? JSON.parse(saved) : [] };
      } catch (e) {
        console.warn('Mishkah: the earlier saved lectures are unreadable', e);
        return { raw: '', list: [], error: true };
      }
    }

    function OldToolLectures() {
      const { raw, list, error } = useMemo(readOldToolLectures, []);
      if (!error && (!Array.isArray(list) || !list.length)) return null;
      const titles = Array.isArray(list) ? list.map((l) => (l && l.data && l.data.metadata && l.data.metadata.topic) || 'محاضرة').slice(0, 8) : [];
      const download = () => {
        const url = URL.createObjectURL(new Blob([raw || localStorage.getItem(OLD_TOOL_LECTURES_KEY) || ''], { type: 'application/json' }));
        const a = document.createElement('a');
        a.href = url; a.download = 'mishkah-old-lectures.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      return (
        <section className="card-islamic-sage rounded-2xl p-4 border border-emerald-900/10 space-y-2">
          <h3 className="font-black text-emerald-950">🗂 محاضرات محفوظة من الأداة السابقة ({Array.isArray(list) ? list.length : '؟'})</h3>
          <p className="text-sm text-slate-700">ما زالت محفوظة على هذا الجهاز ولم يُحذف منها شيء. لعرضها شرائح: فتح ملف الوورد الأصلي من «محاضرة جديدة من ملف».</p>
          {titles.length > 0 && <p className="text-sm text-slate-600">{titles.join(' • ')}</p>}
          <button type="button" onClick={download} className="px-4 py-2 rounded-xl font-black text-sm border-2 bg-white text-emerald-950 border-emerald-900/20">⬇ حفظ نسخة منها في ملف</button>
        </section>
      );
    }
