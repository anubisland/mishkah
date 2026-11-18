const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add handleNavigateMushafPage
const targetFn = 'function handleSelectHifzPassage(pId) {';
const newFn = `// Unified Synchronized Mushaf & Testing Board Navigator (All 604 Pages)
      async function handleNavigateMushafPage(targetPage, switchMode = null) {
        const p = Math.max(1, Math.min(604, parseInt(targetPage) || 1));
        setMushafPageNumber(p);
        const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
        if (sMatch) setMushafCurrentSurahId(sMatch.id);
        
        if (switchMode) setHifzViewMode(switchMode);

        // 1. Check if in preloaded passages
        const preloaded = PRELOADED_HIFZ_PASSAGES.find(item => item.pageNumber === p);
        if (preloaded) {
          setHifzPassageId(preloaded.id);
          setHifzAyahs(preloaded.ayahs);
          setHifzMutashabihat(preloaded.mutashabihat || []);
          setHifzSurahName(preloaded.surahAr);
          setHifzAyahRange(preloaded.ayahRange);
          setPassageTestSection('none');
          setPassageMaskedAyahs(new Set());
          setCustomMaskedWords(new Set());
          setRevealedAyahSet(new Set([preloaded.ayahs[0]?.num || 1]));
          showToast(isRtl ? 'عرض ' + preloaded.surahAr + ' (' + preloaded.ayahRange + ') ۞' : 'Loaded ' + preloaded.surahEn);
          return;
        }

        // 2. Check localStorage cache
        const cacheKey = 'mishkah_mushaf_page_' + p;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.ayahs && parsed.ayahs.length > 0) {
              setHifzAyahs(parsed.ayahs);
              setHifzSurahName(parsed.surahName);
              setHifzAyahRange(parsed.ayahRange);
              setHifzMutashabihat(parsed.mutashabihat || []);
              setHifzPassageId('page_' + p);
              setPassageTestSection('none');
              setPassageMaskedAyahs(new Set());
              setCustomMaskedWords(new Set());
              setRevealedAyahSet(new Set([parsed.ayahs[0]?.num || 1]));
              showToast(isRtl ? 'عرض ' + parsed.surahName + ' (' + parsed.ayahRange + ') ۞' : 'Loaded page ' + p);
              return;
            }
          } catch(e) {}
        }

        // 3. Fetch from verified Quran API
        setIsFetchingQuran(true);
        try {
          const res = await fetch('https://api.alquran.cloud/v1/page/' + p + '/quran-uthmani');
          if (!res.ok) throw new Error('API returned ' + res.status);
          const json = await res.json();
          const rawAyahs = json.data?.ayahs || [];
          if (rawAyahs.length === 0) throw new Error('No ayahs found');

          const basmalah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
          const mappedAyahs = rawAyahs.map(a => {
            let t = a.text || '';
            if (a.numberInSurah === 1 && a.surah.number !== 1 && a.surah.number !== 9 && t.startsWith(basmalah)) {
              t = t.substring(basmalah.length);
            }
            return {
              num: a.numberInSurah,
              text: t,
              surahName: a.surah.name,
              surahNumber: a.surah.number
            };
          });

          const primarySurah = rawAyahs[0]?.surah?.name || 'القرآن الكريم';
          const firstAyah = rawAyahs[0]?.numberInSurah || 1;
          const lastAyah = rawAyahs[rawAyahs.length - 1]?.numberInSurah || rawAyahs.length;
          const rangeStr = firstAyah + '–' + lastAyah + ' (صفحة ' + p + ')';

          const pageData = {
            ayahs: mappedAyahs,
            surahName: primarySurah.startsWith('سُورَةُ') ? primarySurah : 'سورة ' + primarySurah,
            ayahRange: rangeStr,
            mutashabihat: []
          };

          try { localStorage.setItem(cacheKey, JSON.stringify(pageData)); } catch(e) {}

          setHifzAyahs(mappedAyahs);
          setHifzSurahName(pageData.surahName);
          setHifzAyahRange(rangeStr);
          setHifzMutashabihat([]);
          setHifzPassageId('page_' + p);
          setPassageTestSection('none');
          setPassageMaskedAyahs(new Set());
          setCustomMaskedWords(new Set());
          setRevealedAyahSet(new Set([mappedAyahs[0]?.num || 1]));
          showToast(isRtl ? 'تم تحميل ' + pageData.surahName + ' (صفحة ' + p + ') بالرسم العثماني المعتمد ۞' : 'Loaded page ' + p + ' in Uthmani Script ۞');
        } catch(err) {
          console.warn('Could not fetch page ' + p + ':', err);
          showToast(isRtl ? 'تعذر جلب نص الصفحة، يُرجى التحقق من الاتصال' : 'Could not fetch page text');
        } finally {
          setIsFetchingQuran(false);
        }
      }

      function handleSelectHifzPassage(pId) {`;

html = html.replace(targetFn, newFn);

// 2. Mode Toggle switch in Branch 1 header
html = html.replace(
  `onClick={() => setHifzViewMode('interactive_test')}`,
  `onClick={() => handleNavigateMushafPage(mushafPageNumber, 'interactive_test')}`
);

// 3. Quick shortcuts in Branch 1 header
const oldHeaderQuick = `{/* Quick Shortcut Buttons in Header */}
                      {hifzViewMode === 'mushaf_page' && (
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="text-gold-300 font-bold ml-1">{isRtl ? 'انتقال سريع:' : 'Quick:'}</span>
                          {[
                            { name: 'الفاتحة', p: 1 },
                            { name: 'البقرة', p: 2 },
                            { name: 'الكهف', p: 293 },
                            { name: 'يس', p: 440 },
                            { name: 'الملك', p: 562 },
                            { name: 'جزء عم', p: 582 }
                          ].map(lm => (
                            <button
                              key={lm.p}
                              type="button"
                              onClick={() => {
                                setMushafPageNumber(lm.p);
                                const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => lm.p >= s.startPage && lm.p <= s.endPage);
                                if (sMatch) setMushafCurrentSurahId(sMatch.id);
                                showToast(isRtl ? 'انتقال إلى ' + lm.name + ' (صفحة ' + lm.p + ')' : 'Navigated to ' + lm.name);
                              }}
                              className={\`px-2.5 py-1 rounded-lg border text-xs font-bold transition \${
                                mushafPageNumber === lm.p
                                  ? 'bg-gold-500 text-emerald-950 border-gold-300'
                                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-gold-200 border-emerald-700'
                              }\`}
                            >
                              {lm.name} ({lm.p})
                            </button>
                          ))}
                        </div>
                      )}`;

const newHeaderQuick = `{/* Quick Shortcut Buttons in Header (Synchronized across both modes) */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-gold-300 font-bold ml-1">{isRtl ? 'انتقال سريع:' : 'Quick:'}</span>
                        {[
                          { name: 'الفاتحة', p: 1 },
                          { name: 'البقرة', p: 2 },
                          { name: 'الكهف', p: 293 },
                          { name: 'يس', p: 440 },
                          { name: 'الملك', p: 562 },
                          { name: 'جزء عم', p: 582 }
                        ].map(lm => (
                          <button
                            key={lm.p}
                            type="button"
                            onClick={() => handleNavigateMushafPage(lm.p)}
                            className={\`px-2.5 py-1 rounded-lg border text-xs font-bold transition \${
                              mushafPageNumber === lm.p
                                ? 'bg-gold-500 text-emerald-950 border-gold-300 font-black ring-1 ring-gold-400'
                                : 'bg-emerald-900/80 hover:bg-emerald-800 text-gold-200 border-emerald-700'
                            }\`}
                          >
                            {lm.name} ({lm.p})
                          </button>
                        ))}
                      </div>`;

html = html.replace(oldHeaderQuick, newHeaderQuick);

// 4. In Mode 1: Update navigation bar calls
const oldMode1Nav = `{/* Navigation Bar for Mushaf Page */}
                    <div className="card-islamic-pearl rounded-2xl p-4 shadow-sm border border-emerald-800/15 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Surah Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-950">{isRtl ? 'السورة المباركة:' : 'Surah:'}</span>
                          <select
                            value={mushafCurrentSurahId}
                            onChange={(e) => {
                              const sid = parseInt(e.target.value);
                              setMushafCurrentSurahId(sid);
                              const surahItem = MUSHAF_SURAHS_PAGE_MAP.find(s => s.id === sid);
                              if (surahItem) {
                                setMushafPageNumber(surahItem.startPage);
                                showToast(isRtl ? 'انتقال إلى سورة ' + surahItem.name + ' (صفحة ' + surahItem.startPage + ')' : 'Navigated to ' + surahItem.name);
                              }
                            }}
                            className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          >
                            {MUSHAF_SURAHS_PAGE_MAP.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.id}. سورة {s.name} (صفحة {s.startPage})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Direct Page Input */}
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
                          <span className="text-xs font-bold text-slate-700">{isRtl ? 'الصفحة:' : 'Page:'}</span>
                          <input
                            type="number"
                            min={1}
                            max={604}
                            value={mushafPageNumber}
                            onChange={(e) => {
                              const p = Math.max(1, Math.min(604, parseInt(e.target.value) || 1));
                              setMushafPageNumber(p);
                              const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                              if (sMatch) setMushafCurrentSurahId(sMatch.id);
                            }}
                            className="w-14 bg-white text-emerald-950 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-center focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500">{isRtl ? 'من 604' : 'of 604'}</span>
                        </div>
                      </div>

                      {/* Prev / Next & Action to Test */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const p = Math.min(604, mushafPageNumber + 1);
                            setMushafPageNumber(p);
                            const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                            if (sMatch) setMushafCurrentSurahId(sMatch.id);
                          }}
                          disabled={mushafPageNumber >= 604}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const p = Math.max(1, mushafPageNumber - 1);
                            setMushafPageNumber(p);
                            const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                            if (sMatch) setMushafCurrentSurahId(sMatch.id);
                          }}
                          disabled={mushafPageNumber <= 1}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                          <span>⬅️</span>
                        </button>

                        {/* Switch to Testing for this page */}
                        <button
                          type="button"
                          onClick={() => {
                            setHifzViewMode('interactive_test');
                            showToast(isRtl ? 'فتح لوحة اختبار الإتقان وتسميع الوجه 🎯' : 'Switched to Testing Board 🎯');
                          }}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-4 py-1.5 rounded-xl text-xs font-black shadow transition flex items-center gap-1.5"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'اختبار إتقان هذا الوجه ⬅' : 'Test This Page ⬅'}</span>
                        </button>
                      </div>
                    </div>`;

const newMode1Nav = `{/* Navigation Bar for Mushaf Page (Mode 1 - Fully Synchronized) */}
                    <div className="card-islamic-pearl rounded-2xl p-4 shadow-sm border border-emerald-800/15 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Surah Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-950">{isRtl ? 'السورة المباركة:' : 'Surah:'}</span>
                          <select
                            value={mushafCurrentSurahId}
                            onChange={(e) => {
                              const sid = parseInt(e.target.value);
                              const surahItem = MUSHAF_SURAHS_PAGE_MAP.find(s => s.id === sid);
                              if (surahItem) {
                                handleNavigateMushafPage(surahItem.startPage);
                              }
                            }}
                            className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          >
                            {MUSHAF_SURAHS_PAGE_MAP.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.id}. سورة {s.name} (صفحة {s.startPage})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Direct Page Input */}
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
                          <span className="text-xs font-bold text-slate-700">{isRtl ? 'الصفحة:' : 'Page:'}</span>
                          <input
                            type="number"
                            min={1}
                            max={604}
                            value={mushafPageNumber}
                            onChange={(e) => {
                              const p = Math.max(1, Math.min(604, parseInt(e.target.value) || 1));
                              handleNavigateMushafPage(p);
                            }}
                            className="w-14 bg-white text-emerald-950 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-center focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500">{isRtl ? 'من 604' : 'of 604'}</span>
                        </div>
                      </div>

                      {/* Prev / Next & Action to Test */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleNavigateMushafPage(mushafPageNumber + 1)}
                          disabled={mushafPageNumber >= 604}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateMushafPage(mushafPageNumber - 1)}
                          disabled={mushafPageNumber <= 1}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                          <span>⬅️</span>
                        </button>

                        {/* Switch to Testing for this page (Twin Sync) */}
                        <button
                          type="button"
                          onClick={() => handleNavigateMushafPage(mushafPageNumber, 'interactive_test')}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-4 py-1.5 rounded-xl text-xs font-black shadow transition flex items-center gap-1.5"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'اختبار إتقان هذا الوجه ⬅' : 'Test This Page ⬅'}</span>
                        </button>
                      </div>
                    </div>`;

html = html.replace(oldMode1Nav, newMode1Nav);

// 5. In Mode 2: Replace the top passage navigator and surah header with the complete synchronized suite
const oldMode2BlockStart = `{/* Mode 2 Page & Passage Navigator (الوجه التالي / السابق / أوجه السورة) */}
                      <div className="w-full bg-emerald-950/5 border border-gold-400/50 rounded-2xl p-3 mb-5 flex flex-wrap items-center justify-between gap-2.5">`;

const oldMode2BlockEnd = `<div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-emerald-900/10">
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-xl bg-emerald-900 text-gold-300 font-amiri font-bold flex items-center justify-center text-lg shadow-sm">
                            ۝
                          </span>
                          <div>
                            <h3 className="text-xl font-extrabold text-emerald-950 font-amiri">
                              {hifzSurahName} — {isRtl ? 'الآيات (' + hifzAyahRange + ')' : 'Ayahs (' + hifzAyahRange + ')'}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {isRtl ? '💡 نصيحة للمعلم: انقر على أي كلمة مباشرة لطمسها [ ... ] أو إظهارها أثناء التسميع' : 'Click any word to mask/unmask'}
                            </p>
                          </div>
                        </div>

                        `;

const startIdx = html.indexOf(oldMode2BlockStart);
const endIdx = html.indexOf(oldMode2BlockEnd);

if (startIdx === -1 || endIdx === -1) {
  console.error('Mode 2 target blocks not found!', startIdx, endIdx);
  process.exit(1);
}

const newMode2CompleteBlock = `{/* Mode 2 Synchronized Quran Page Navigator (Full 604-Page Freedom & Twin Sync) */}
                      <div className="w-full bg-emerald-950/5 border-2 border-gold-400/60 rounded-2xl p-3.5 mb-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Surah Dropdown in Mode 2 */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-950">{isRtl ? 'السورة المباركة:' : 'Surah:'}</span>
                              <select
                                value={mushafCurrentSurahId}
                                onChange={(e) => {
                                  const sid = parseInt(e.target.value);
                                  const surahItem = MUSHAF_SURAHS_PAGE_MAP.find(s => s.id === sid);
                                  if (surahItem) {
                                    handleNavigateMushafPage(surahItem.startPage);
                                  }
                                }}
                                className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              >
                                {MUSHAF_SURAHS_PAGE_MAP.map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.id}. سورة {s.name} (صفحة {s.startPage})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Direct Page Input in Mode 2 */}
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs">
                              <span className="text-xs font-bold text-slate-700">{isRtl ? 'الصفحة:' : 'Page:'}</span>
                              <input
                                type="number"
                                min={1}
                                max={604}
                                value={mushafPageNumber}
                                onChange={(e) => {
                                  const p = Math.max(1, Math.min(604, parseInt(e.target.value) || 1));
                                  handleNavigateMushafPage(p);
                                }}
                                className="w-14 bg-slate-50 text-emerald-950 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-center focus:outline-none"
                              />
                              <span className="text-[11px] text-slate-500">{isRtl ? 'من 604' : 'of 604'}</span>
                            </div>
                          </div>

                          {/* Navigation Buttons + Return to Mushaf Mode + Font Scale */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Next Page */}
                            <button
                              type="button"
                              onClick={() => handleNavigateMushafPage(mushafPageNumber + 1)}
                              disabled={mushafPageNumber >= 604}
                              className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <span>➡️</span>
                              <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                            </button>

                            {/* Prev Page */}
                            <button
                              type="button"
                              onClick={() => handleNavigateMushafPage(mushafPageNumber - 1)}
                              disabled={mushafPageNumber <= 1}
                              className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                              <span>⬅️</span>
                            </button>

                            {/* Button to toggle back to Printed Mushaf Page Mode */}
                            <button
                              type="button"
                              onClick={() => setHifzViewMode('mushaf_page')}
                              className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 border border-gold-400/50 px-3.5 py-1.5 rounded-xl text-xs font-black shadow transition flex items-center gap-1.5"
                            >
                              <span>📖</span>
                              <span>{isRtl ? 'عرض وجه المصحف الورقي' : 'View Mushaf Page'}</span>
                            </button>

                            {/* Font Size Toggle */}
                            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs shadow-xs">
                              <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'الخط:' : 'Font:'}</span>
                              {['small', 'medium', 'large'].map(sz => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setQuranFontSize(sz)}
                                  className={'px-2 py-0.5 rounded-lg text-xs font-bold transition ' + (
                                    quranFontSize === sz ? 'bg-emerald-900 text-gold-200 font-black' : 'text-slate-600 hover:text-emerald-950'
                                  )}
                                >
                                  {sz === 'small' ? (isRtl ? 'صغير' : 'S') : sz === 'medium' ? (isRtl ? 'متوسط' : 'M') : (isRtl ? 'كبير' : 'L')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Surah Title & Range Header Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-900/10">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-emerald-900 text-gold-300 font-amiri font-bold flex items-center justify-center text-sm shadow-sm">
                              ۞
                            </span>
                            <div>
                              <h3 className="text-base font-extrabold text-emerald-950 font-amiri">
                                {hifzSurahName} — {isRtl ? 'الآيات (' + hifzAyahRange + ')' : 'Ayahs (' + hifzAyahRange + ')'}
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                {isRtl ? 'لوحة التسميع متزامنة تماماً مع وجه المصحف الورقي (صفحة ' + mushafPageNumber + ')' : 'Recitation board synchronized with Mushaf page ' + mushafPageNumber}
                              </p>
                            </div>
                          </div>

                          {isFetchingQuran && (
                            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold animate-pulse">
                              ⏳ {isRtl ? 'جارٍ جلب الآيات بالرسم العثماني...' : 'Fetching Uthmani text...'}
                            </span>
                          )}
                        </div>
                      </div>
`;

html = html.substring(0, startIdx) + newMode2CompleteBlock + html.substring(endIdx + oldMode2BlockEnd.length);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Twin synchronization applied cleanly! New file length:', html.length);
