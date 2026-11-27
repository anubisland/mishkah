    // The hifz parts of a class plan. A class often has two: recitation of
    // earlier pages from memory (تسميع), then new memorisation (تحفيظ).
    // A teacher names a place either by surah and ayahs or by pages / juz.
    //
    // part = { hifzMode: 'tasmee' | 'tahfeez', byPage: bool,
    //          surahId, fromAyah, toAyah }  (by ayahs)
    //        | { ..., fromPage, toPage }     (by pages)
    const HIFZ_MODES = [
      { id: 'tasmee', label: '🎧 تسميع ما سبق' },
      { id: 'tahfeez', label: '📖 تحفيظ جديد' }
    ];

    // First page of each juz in the Madinah mushaf (604 pages).
    const JUZ_START_PAGES = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];

    function juzPages(juz) {
      return { fromPage: JUZ_START_PAGES[juz - 1], toPage: juz < 30 ? JUZ_START_PAGES[juz] - 1 : 604 };
    }

    function newHifzPart(hifzMode, surahId) {
      return { hifzMode, byPage: false, surahId: surahId || 67, fromAyah: 1, toAyah: 10, fromPage: 562, toPage: 562 };
    }

    // The plan item for a part; by ayahs it asks the internet for their pages.
    async function hifzPartToItem(part, surahs) {
      if (part.byPage) {
        const fromPage = Math.min(part.fromPage, part.toPage);
        const toPage = Math.max(part.fromPage, part.toPage);
        const surah = surahs.filter((s) => s.startPage <= fromPage).pop() || surahs[0];
        return { type: 'hifz', hifzMode: part.hifzMode, surahId: surah.id, surahName: 'سورة ' + surah.name, fromAyah: null, toAyah: null, fromPage, toPage };
      }
      const surah = surahs.find((s) => s.id === part.surahId) || surahs[0];
      const a = Math.min(part.fromAyah, part.toAyah);
      const b = Math.max(part.fromAyah, part.toAyah);
      const pages = await resolveHifzPages(surah.id, a, b);
      return { type: 'hifz', hifzMode: part.hifzMode, surahId: surah.id, surahName: 'سورة ' + surah.name, fromAyah: a, toAyah: b, fromPage: pages.fromPage, toPage: pages.toPage };
    }

    // The editor's part from a saved plan item.
    function hifzItemToPart(it) {
      const byPage = it.fromAyah == null;
      return { hifzMode: it.hifzMode || 'tasmee', byPage, surahId: it.surahId, fromAyah: it.fromAyah || 1, toAyah: it.toAyah || 1, fromPage: it.fromPage, toPage: it.toPage };
    }

    // single: one part only (adding a part during class).
    function HifzPlanParts({ parts, setParts, surahs, single }) {
      const update = (i, change) => setParts(parts.map((p, j) => (j === i ? Object.assign({}, p, change) : p)));
      const add = (hifzMode) => setParts(parts.concat([newHifzPart(hifzMode, parts.length ? parts[parts.length - 1].surahId : 67)]));
      const input = 'w-20 border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold';
      const select = 'border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold min-w-0 max-w-full';
      const clampPage = (v) => Math.max(1, Math.min(604, parseInt(v, 10) || 1));

      return (
        <div className="space-y-2">
          {parts.map((p, i) => {
            const surah = surahs.find((s) => s.id === p.surahId) || surahs[0];
            const maxAyah = surah ? surah.totalAyahs : 286;
            const clamp = (v) => Math.max(1, Math.min(maxAyah, parseInt(v, 10) || 1));
            return (
              <div key={i} className="flex flex-wrap items-center gap-2 bg-white rounded-xl p-2 border border-emerald-900/10">
                <span className="font-black text-emerald-900">{i + 1}.</span>
                <select value={p.hifzMode} onChange={(e) => update(i, { hifzMode: e.target.value })} className={select + ' font-black'}>
                  {HIFZ_MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
                <select value={p.byPage ? 'page' : 'ayah'} onChange={(e) => update(i, { byPage: e.target.value === 'page' })} className={select}>
                  <option value="ayah">بالسورة والآيات</option>
                  <option value="page">بالصفحات أو الجزء</option>
                </select>
                {p.byPage ? (
                  <>
                    <select value="" onChange={(e) => { if (e.target.value) update(i, juzPages(parseInt(e.target.value, 10))); }} className={select}>
                      <option value="">الجزء…</option>
                      {JUZ_START_PAGES.map((_, j) => <option key={j} value={j + 1}>الجزء {j + 1}</option>)}
                    </select>
                    <span className="font-bold">من صفحة</span>
                    <input type="number" min="1" max="604" value={p.fromPage} onChange={(e) => update(i, { fromPage: clampPage(e.target.value) })} className={input} />
                    <span className="font-bold">إلى</span>
                    <input type="number" min="1" max="604" value={p.toPage} onChange={(e) => update(i, { toPage: clampPage(e.target.value) })} className={input} />
                  </>
                ) : (
                  <>
                    <select value={p.surahId} onChange={(e) => update(i, { surahId: parseInt(e.target.value, 10), fromAyah: 1, toAyah: 1 })} className={select}>
                      {surahs.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
                    </select>
                    <span className="font-bold">من الآية</span>
                    <input type="number" min="1" max={maxAyah} value={p.fromAyah} onChange={(e) => update(i, { fromAyah: clamp(e.target.value) })} className={input} />
                    <span className="font-bold">إلى</span>
                    <input type="number" min="1" max={maxAyah} value={p.toAyah} onChange={(e) => update(i, { toAyah: clamp(e.target.value) })} className={input} />
                    <span className="text-xs text-slate-500">(السورة {maxAyah} آية)</span>
                  </>
                )}
                {parts.length > 1 && (
                  <button type="button" onClick={() => setParts(parts.filter((_, j) => j !== i))} className="mr-auto px-2 py-1 rounded-lg text-rose-700 font-bold text-sm">✕ حذف</button>
                )}
              </div>
            );
          })}
          {!single && <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => add('tasmee')} className="px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold text-sm">➕ تسميع</button>
            <button type="button" onClick={() => add('tahfeez')} className="px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold text-sm">➕ تحفيظ جديد</button>
          </div>}
        </div>
      );
    }
