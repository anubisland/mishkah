const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let raw = fs.readFileSync(indexPath, 'utf8');

// Normalize line endings to \n for clean manipulation
let html = raw.replace(/\r\n/g, '\n');
let lines = html.split('\n');

console.log('Total lines:', lines.length);

// 1. Add handleNavigateMushafPage
const targetLineIdx = lines.findIndex(l => l.includes('function handleSelectHifzPassage(pId) {'));
console.log('targetLineIdx:', targetLineIdx);

const newFnCode = `      // Unified Synchronized Mushaf & Testing Board Navigator (All 604 Pages)
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
      }`;

lines.splice(targetLineIdx, 0, newFnCode);
console.log('Inserted newFnCode. New lines:', lines.length);

// 2. Mode 2 Switch button in Branch 1 header
const modeSwitchIdx = lines.findIndex(l => l.includes("onClick={() => setHifzViewMode('interactive_test')}"));
console.log('modeSwitchIdx:', modeSwitchIdx);
lines[modeSwitchIdx] = lines[modeSwitchIdx].replace("setHifzViewMode('interactive_test')", "handleNavigateMushafPage(mushafPageNumber, 'interactive_test')");

// 3. Quick buttons in header
const qkStart = lines.findIndex(l => l.includes("{/* Quick Shortcut Buttons in Header */}"));
const qkEnd = lines.findIndex((l, i) => i > qkStart && l.includes("))}")); // closes the .map
const qkEndDiv = lines.findIndex((l, i) => i > qkEnd && l.includes("</div>")); // closes the container

const newQkCode = `                      {/* Quick Shortcut Buttons in Header (Synchronized across both modes) */}
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

// Replace lines from qkStart to qkEndDiv + 1 (closes if block)
const qkClosingBrace = lines.findIndex((l, i) => i > qkEndDiv && l.includes(")}"));
lines.splice(qkStart, qkClosingBrace - qkStart + 1, newQkCode);
console.log('Replaced header quick shortcuts.');

// 4. Update Mode 1 Nav bar
const m1NavStart = lines.findIndex(l => l.includes("{/* Navigation Bar for Mushaf Page */}"));
const m1NavEnd = lines.findIndex((l, i) => i > m1NavStart && l.includes("{/* The Authentic 15-Line Printed Madinah Mushaf Page */}"));

const newM1NavCode = `                    {/* Navigation Bar for Mushaf Page (Mode 1 - Fully Synchronized) */}
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

lines.splice(m1NavStart, m1NavEnd - m1NavStart, newM1NavCode);
console.log('Replaced Mode 1 Nav bar.');

// 5. Update Mode 2 Navigator
const m2NavStart = lines.findIndex(l => l.includes("{/* Mode 2 Page & Passage Navigator (الوجه التالي / السابق / أوجه السورة) */}"));
const m2PanelStart = lines.findIndex((l, i) => i > m2NavStart && l.includes("{/* Active Passage Arbitration Panel */}"));

console.log('m2NavStart:', m2NavStart, 'm2PanelStart:', m2PanelStart);

const newM2ToolbarCode = `                      {/* Mode 2 Synchronized Quran Page Navigator (Full 604-Page Freedom & Twin Sync) */}
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
                      </div>`;

lines.splice(m2NavStart, m2PanelStart - m2NavStart, newM2ToolbarCode);
console.log('Replaced Mode 2 toolbar.');

const finalHtml = lines.join('\n');
fs.writeFileSync(indexPath, finalHtml, 'utf8');
console.log('Finished writing synchronized public/index.html! Total lines:', lines.length);
