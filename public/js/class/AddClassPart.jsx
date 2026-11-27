    // Adding a hifz part while the class runs: recitation went well, so new
    // memorisation starts from where it ended (or the other way round).
    // It suggests the next ayahs after the last hifz part.
    function AddClassPart({ planItems, onAdd, onClose }) {
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const lastHifz = planItems.filter((it) => it.type === 'hifz').pop();
      const suggest = () => {
        if (!lastHifz) return newHifzPart('tahfeez');
        const surah = surahs.find((s) => s.id === lastHifz.surahId);
        const next = lastHifz.toAyah + 1;
        if (surah && next <= surah.totalAyahs) {
          return { hifzMode: 'tahfeez', surahId: surah.id, fromAyah: next, toAyah: surah.totalAyahs };
        }
        return newHifzPart('tahfeez', lastHifz.surahId);
      };
      const [parts, setParts] = useState(() => [suggest()]);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState('');

      const add = async () => {
        setBusy(true);
        setError('');
        try {
          const part = parts[0];
          const surah = surahs.find((s) => s.id === part.surahId) || surahs[0];
          const a = Math.min(part.fromAyah, part.toAyah);
          const b = Math.max(part.fromAyah, part.toAyah);
          const pages = await resolveHifzPages(surah.id, a, b);
          onAdd({ type: 'hifz', hifzMode: part.hifzMode, surahId: surah.id, surahName: 'سورة ' + surah.name, fromAyah: a, toAyah: b, fromPage: pages.fromPage, toPage: pages.toPage });
        } catch (e) {
          console.warn('Mishkah: could not add the class part', e);
          setError('تعذّر تحديد صفحات هذه الآيات. يلزم الاتصال بالإنترنت، ثم المحاولة مرة أخرى.');
          setBusy(false);
        }
      };

      return (
        <div className="shrink-0 bg-gold-50 border-b-2 border-gold-400 px-3 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-emerald-950 flex-1">➕ جزء جديد في هذه الحصة</h4>
            <button type="button" onClick={onClose} disabled={busy} className="px-2 py-1 rounded-lg border border-slate-300 font-bold text-sm disabled:opacity-40">إلغاء</button>
          </div>
          <HifzPlanParts parts={parts} setParts={setParts} surahs={surahs} single />
          {error && <p className="text-rose-700 font-bold text-sm">{error}</p>}
          <button type="button" onClick={add} disabled={busy} className="w-full py-2 rounded-xl bg-emerald-900 text-gold-200 font-black disabled:opacity-50">
            {busy ? 'جارٍ التجهيز…' : 'إضافة وبدؤه الآن'}
          </button>
        </div>
      );
    }
