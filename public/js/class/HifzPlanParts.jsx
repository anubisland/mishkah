    // The hifz parts of a class plan. A class often has two: recitation of
    // earlier pages from memory (تسميع), then new memorisation (تحفيظ).
    //
    // part = { hifzMode: 'tasmee' | 'tahfeez', surahId, fromAyah, toAyah }
    const HIFZ_MODES = [
      { id: 'tasmee', label: '🎧 تسميع ما سبق' },
      { id: 'tahfeez', label: '📖 تحفيظ جديد' }
    ];

    function newHifzPart(hifzMode, surahId) {
      return { hifzMode, surahId: surahId || 67, fromAyah: 1, toAyah: 10 };
    }

    function HifzPlanParts({ parts, setParts, surahs }) {
      const update = (i, change) => setParts(parts.map((p, j) => (j === i ? Object.assign({}, p, change) : p)));
      const add = (hifzMode) => setParts(parts.concat([newHifzPart(hifzMode, parts.length ? parts[parts.length - 1].surahId : 67)]));

      return (
        <div className="space-y-2">
          {parts.map((p, i) => {
            const surah = surahs.find((s) => s.id === p.surahId) || surahs[0];
            const maxAyah = surah ? surah.totalAyahs : 286;
            const clamp = (v) => Math.max(1, Math.min(maxAyah, parseInt(v, 10) || 1));
            return (
              <div key={i} className="flex flex-wrap items-center gap-2 bg-white rounded-xl p-2 border border-emerald-900/10">
                <span className="font-black text-emerald-900">{i + 1}.</span>
                <select value={p.hifzMode} onChange={(e) => update(i, { hifzMode: e.target.value })}
                  className="border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-black min-w-0 max-w-full">
                  {HIFZ_MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
                <select value={p.surahId} onChange={(e) => update(i, { surahId: parseInt(e.target.value, 10), fromAyah: 1, toAyah: 1 })}
                  className="border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold min-w-0 max-w-full">
                  {surahs.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
                </select>
                <span className="font-bold">من الآية</span>
                <input type="number" min="1" max={maxAyah} value={p.fromAyah} onChange={(e) => update(i, { fromAyah: clamp(e.target.value) })} className="w-20 border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold" />
                <span className="font-bold">إلى</span>
                <input type="number" min="1" max={maxAyah} value={p.toAyah} onChange={(e) => update(i, { toAyah: clamp(e.target.value) })} className="w-20 border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold" />
                <span className="text-xs text-slate-500">(السورة {maxAyah} آية)</span>
                {parts.length > 1 && (
                  <button type="button" onClick={() => setParts(parts.filter((_, j) => j !== i))} className="mr-auto px-2 py-1 rounded-lg text-rose-700 font-bold text-sm">✕ حذف</button>
                )}
              </div>
            );
          })}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => add('tasmee')} className="px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold text-sm">➕ تسميع</button>
            <button type="button" onClick={() => add('tahfeez')} className="px-3 py-1.5 rounded-xl border-2 border-emerald-900/20 font-bold text-sm">➕ تحفيظ جديد</button>
          </div>
        </div>
      );
    }
