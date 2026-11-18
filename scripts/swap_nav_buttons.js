const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Swap in Top Navigation Bar
const oldTopButtons = `<button
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
                          <span>➡️</span>
                          <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                        </button>

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
                          <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                          <span>⬅️</span>
                        </button>`;

const newTopButtons = `<button
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
                          <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                          <span>⬅️</span>
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
                          <span>➡️</span>
                          <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                        </button>`;

html = html.replace(oldTopButtons, newTopButtons);

// 2. Swap in Bottom Mushaf Page Footer (Next on Right, Page Number Center, Prev on Left)
const oldBottomSection = `<button
                            type="button"
                            onClick={() => {
                              const p = Math.max(1, mushafPageNumber - 1);
                              setMushafPageNumber(p);
                              const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                              if (sMatch) setMushafCurrentSurahId(sMatch.id);
                            }}
                            disabled={mushafPageNumber <= 1}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold"
                          >
                            <span>➡️</span>
                            <span>{isRtl ? 'السابق' : 'Prev'}</span>
                          </button>

                          <div className="text-center">
                            <span className="text-base sm:text-xl font-extrabold text-gold-600 font-amiri block">
                              — {mushafPageNumber} —
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {isRtl ? 'الحزب ' + Math.ceil(mushafPageNumber / 10) : 'Hizb ' + Math.ceil(mushafPageNumber / 10)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const p = Math.min(604, mushafPageNumber + 1);
                              setMushafPageNumber(p);
                              const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                              if (sMatch) setMushafCurrentSurahId(sMatch.id);
                            }}
                            disabled={mushafPageNumber >= 604}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold"
                          >
                            <span>{isRtl ? 'التالي' : 'Next'}</span>
                            <span>⬅️</span>
                          </button>`;

const newBottomSection = `<button
                            type="button"
                            onClick={() => {
                              const p = Math.min(604, mushafPageNumber + 1);
                              setMushafPageNumber(p);
                              const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                              if (sMatch) setMushafCurrentSurahId(sMatch.id);
                            }}
                            disabled={mushafPageNumber >= 604}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold"
                          >
                            <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                            <span>⬅️</span>
                          </button>

                          <div className="text-center">
                            <span className="text-base sm:text-xl font-extrabold text-gold-600 font-amiri block">
                              — {mushafPageNumber} —
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {isRtl ? 'الحزب ' + Math.ceil(mushafPageNumber / 10) : 'Hizb ' + Math.ceil(mushafPageNumber / 10)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const p = Math.max(1, mushafPageNumber - 1);
                              setMushafPageNumber(p);
                              const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                              if (sMatch) setMushafCurrentSurahId(sMatch.id);
                            }}
                            disabled={mushafPageNumber <= 1}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold"
                          >
                            <span>➡️</span>
                            <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                          </button>`;

html = html.replace(oldBottomSection, newBottomSection);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully swapped Next to Right and Prev to Left in Mushaf view!');
