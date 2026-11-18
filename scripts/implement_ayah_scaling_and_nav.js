const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Inject Page Navigation & Font Size Toolbar inside the Quranic Ayahs Board header
const boardHeaderStart = `<div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-emerald-900/10">`;

const pageNavToolbar = `
                      {/* Mode 2 Page & Passage Navigator (الوجه التالي / السابق / أوجه السورة) */}
                      <div className="w-full bg-emerald-950/5 border border-gold-400/50 rounded-2xl p-3 mb-5 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                            <span>📑</span>
                            <span>{isRtl ? 'أوجه السورة المقررة:' : 'Surah Pages:'}</span>
                          </span>

                          {/* Quick Page Jump Buttons for Surat Al-Mulk / Selected Surah */}
                          {PRELOADED_HIFZ_PASSAGES.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setHifzPassageId(p.id);
                                setHifzAyahs(p.ayahs);
                                setHifzMutashabihat(p.mutashabihat || []);
                                setHifzSurahName(p.surahAr);
                                setHifzAyahRange(p.ayahRange);
                                if (p.pageNumber) setMushafPageNumber(p.pageNumber);
                                setCustomMaskedWords(new Set());
                                setRevealedAyahSet(new Set([p.ayahs[0]?.num || 1]));
                                setPassageTestSection('none');
                                setPassageMaskedAyahs(new Set());
                                showToast(isRtl ? 'عرض ' + p.ayahRange : 'Loaded ' + p.ayahRange);
                              }}
                              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border shadow-xs ' + (
                                hifzPassageId === p.id
                                  ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black ring-2 ring-gold-400'
                                  : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                              )}
                            >
                              <span>📖</span>
                              <span>{p.ayahRange.includes('(') ? p.ayahRange.split('(')[0].trim() : p.ayahRange}</span>
                            </button>
                          ))}

                          {/* Button to open custom 114 Surah picker */}
                          <button
                            type="button"
                            onClick={() => setShowCustomInput(true)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-400 text-emerald-950 transition flex items-center gap-1 shadow-xs font-cairo"
                          >
                            <span>🔍</span>
                            <span>{isRtl ? 'اختيار سورة وآيات أخرى...' : 'Select Another Surah...'}</span>
                          </button>
                        </div>

                        {/* Prev / Next Page and Font Size in Recitation Board */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Next Page (➡️) on right */}
                          <button
                            type="button"
                            onClick={() => {
                              const curIdx = PRELOADED_HIFZ_PASSAGES.findIndex(p => p.id === hifzPassageId);
                              if (curIdx < PRELOADED_HIFZ_PASSAGES.length - 1) {
                                const nextP = PRELOADED_HIFZ_PASSAGES[curIdx + 1];
                                setHifzPassageId(nextP.id);
                                setHifzAyahs(nextP.ayahs);
                                setHifzMutashabihat(nextP.mutashabihat || []);
                                setHifzSurahName(nextP.surahAr);
                                setHifzAyahRange(nextP.ayahRange);
                                if (nextP.pageNumber) setMushafPageNumber(nextP.pageNumber);
                                setCustomMaskedWords(new Set());
                                setRevealedAyahSet(new Set([nextP.ayahs[0]?.num || 1]));
                                setPassageTestSection('none');
                                setPassageMaskedAyahs(new Set());
                                showToast(isRtl ? 'الانتقال إلى ' + nextP.ayahRange : 'Next section');
                              } else {
                                showToast(isRtl ? 'وصلت لآخر وجه مقرر في السورة' : 'End of surah');
                              }
                            }}
                            disabled={PRELOADED_HIFZ_PASSAGES.findIndex(p => p.id === hifzPassageId) >= PRELOADED_HIFZ_PASSAGES.length - 1}
                            className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                          >
                            <span>➡️</span>
                            <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                          </button>

                          {/* Prev Page (⬅️) on left */}
                          <button
                            type="button"
                            onClick={() => {
                              const curIdx = PRELOADED_HIFZ_PASSAGES.findIndex(p => p.id === hifzPassageId);
                              if (curIdx > 0) {
                                const prevP = PRELOADED_HIFZ_PASSAGES[curIdx - 1];
                                setHifzPassageId(prevP.id);
                                setHifzAyahs(prevP.ayahs);
                                setHifzMutashabihat(prevP.mutashabihat || []);
                                setHifzSurahName(prevP.surahAr);
                                setHifzAyahRange(prevP.ayahRange);
                                if (prevP.pageNumber) setMushafPageNumber(prevP.pageNumber);
                                setCustomMaskedWords(new Set());
                                setRevealedAyahSet(new Set([prevP.ayahs[0]?.num || 1]));
                                setPassageTestSection('none');
                                setPassageMaskedAyahs(new Set());
                                showToast(isRtl ? 'الرجوع إلى ' + prevP.ayahRange : 'Prev section');
                              }
                            }}
                            disabled={PRELOADED_HIFZ_PASSAGES.findIndex(p => p.id === hifzPassageId) <= 0}
                            className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                          >
                            <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                            <span>⬅️</span>
                          </button>

                          {/* Font Size Selector directly in the bar */}
                          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs">
                            <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'حجم الخط:' : 'Font:'}</span>
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
`;

if (html.includes(boardHeaderStart) && !html.includes('Mode 2 Page & Passage Navigator')) {
  html = html.replace(boardHeaderStart, pageNavToolbar + boardHeaderStart);
  console.log('Injected pageNavToolbar before boardHeaderStart');
}

// 2. Adjust Card Padding and Font Scaling in Ayahs Map
const oldAyahCardClass = 'className={`p-5 rounded-2xl transition-all duration-200 bg-white border-2 border-emerald-900/15 shadow-sm hover:border-gold-500/50 ${';
const newAyahCardClass = 'className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 bg-white border-2 border-emerald-900/15 shadow-sm hover:border-gold-500/50 ${';

if (html.includes(oldAyahCardClass)) {
  html = html.replace(oldAyahCardClass, newAyahCardClass);
  console.log('Adjusted Ayah Card padding to compact p-3.5 sm:p-4');
}

// 3. Replace the gigantic font size class with proportional font scaling
const oldFontClass = '<div className="font-quran text-3xl sm:text-4xl font-bold leading-[2.6] text-black text-right flex flex-wrap gap-x-2.5 gap-y-3.5 items-baseline select-none">';
const newFontClass = `<div className={'font-quran font-bold text-black text-right flex flex-wrap gap-x-2 gap-y-2 items-baseline select-none ' + (
                                  quranFontSize === 'small' 
                                    ? 'text-lg sm:text-xl leading-[2.0]' 
                                    : quranFontSize === 'large' 
                                      ? 'text-2xl sm:text-3xl leading-[2.4]' 
                                      : 'text-xl sm:text-2xl leading-[2.2]'
                                )}>`;

if (html.includes(oldFontClass)) {
  html = html.replace(oldFontClass, newFontClass);
  console.log('Replaced gigantic font with dynamic proportional font scaling');
}

// 4. Reduce spacing between ayah cards from space-y-6 to space-y-3 sm:space-y-4
const oldSpaceClass = '{/* Ayahs List */}\n                      <div className="space-y-6">';
const newSpaceClass = '{/* Ayahs List */}\n                      <div className="space-y-3 sm:space-y-4">';

if (html.includes(oldSpaceClass)) {
  html = html.replace(oldSpaceClass, newSpaceClass);
  console.log('Reduced space between ayah cards to space-y-3 sm:space-y-4');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved public/index.html with ayah scaling and navigation toolbar!');
