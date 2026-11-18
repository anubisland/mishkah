const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Fix Arrow Directions on Mushaf Navigation Buttons
// Top Bar
const oldTopNav = `<button
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

const newTopNav = `<button
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
                        </button>`;

html = html.replace(oldTopNav, newTopNav);

// Bottom Mushaf Page Footer
const oldBottomNav = `<button
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

const newBottomNav = `<button
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
                            <span>➡️</span>
                            <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
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
                            <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                            <span>⬅️</span>
                          </button>`;

html = html.replace(oldBottomNav, newBottomNav);

// 2. Add New Creative Testing States
const stateTarget = `const [isEndingsMasked, setIsEndingsMasked] = useState(false);`;
const newStates = `const [isEndingsMasked, setIsEndingsMasked] = useState(false);
      const [isStartersMasked, setIsStartersMasked] = useState(false);
      const [isDivineNamesMasked, setIsDivineNamesMasked] = useState(false);
      const [isAlternatingMasked, setIsAlternatingMasked] = useState(false);
      const [isReverseOrder, setIsReverseOrder] = useState(false);`;

if (!html.includes('isStartersMasked')) {
  html = html.replace(stateTarget, newStates);
}

// 3. Replace the Live Recitation Controls Ribbon with the Complete Creative Suite
const oldRibbon = `<div className="card-islamic-amber rounded-2xl p-4 sm:p-5 shadow-sm border border-gold-300/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎛️</span>
                        <div>
                          <h3 className="text-sm font-bold text-emerald-950 font-cairo">
                            {isRtl ? 'أدوات اختبار الإتقان المباشرة (طمس النهايات وإخفاء الكلمات)' : 'Mastery Recitation Controls'}
                          </h3>
                          <p className="text-[11px] text-slate-600">
                            {isRtl ? 'انقر على أي أداة لاختبار فواصل الآيات أو التسميع الغيبي أو انقر أي كلمة لإخفائها' : 'Toggle ayah mask, blind recitation, or word masking'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Toggle Mask Endings */}
                        <button
                          type="button"
                          onClick={() => setIsEndingsMasked(!isEndingsMasked)}
                          className={\`text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm \${
                            isEndingsMasked 
                              ? 'bg-amber-600 text-white font-black ring-2 ring-amber-400' 
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border border-amber-300'
                          }\`}
                          title={isRtl ? 'إخفاء آخر كلمتين من كل آية لاختبار حفظ الفواصل' : 'Hide last words of each ayah'}
                        >
                          <span>{isEndingsMasked ? '🙈' : '👁️'}</span>
                          <span>{isRtl ? (isEndingsMasked ? 'إلغاء طمس النهايات' : 'طمس أواخر الآيات') : 'Mask Endings'}</span>
                        </button>

                        {/* 2. Toggle Full Blind Recitation */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsFullMasked(!isFullMasked);
                            setRevealedAyahSet(new Set([1]));
                          }}
                          className={\`text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm \${
                            isFullMasked 
                              ? 'bg-emerald-800 text-gold-300 font-black ring-2 ring-emerald-500' 
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300'
                          }\`}
                          title={isRtl ? 'إخفاء كامل للآيات مع إمكانية كشف آية آية بنقرة زر' : 'Blind recitation mode'}
                        >
                          <span>{isFullMasked ? '📖' : '🔒'}</span>
                          <span>{isRtl ? (isFullMasked ? 'عرض كل الآيات' : 'تسميع غيبي كامل') : 'Blind Recitation'}</span>
                        </button>

                        {/* 3. Reset All Custom Masks */}
                        {customMaskedWords.size > 0 && (
                          <button
                            type="button"
                            onClick={() => setCustomMaskedWords(new Set())}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs px-3 py-2 rounded-xl font-bold transition flex items-center gap-1"
                          >
                            <span>🔄</span>
                            <span>{isRtl ? 'إظهار الكلمات المطموسة (' + customMaskedWords.size + ')' : 'Reset Masks'}</span>
                          </button>
                        )}

                        {/* Switch back to Mushaf page */}
                        <button
                          type="button"
                          onClick={() => setHifzViewMode('mushaf_page')}
                          className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 border border-gold-400/40 text-xs px-3 py-2 rounded-xl font-bold transition flex items-center gap-1"
                        >
                          <span>📖</span>
                          <span>{isRtl ? 'الرجوع للمصحف الورقي' : 'View Mushaf'}</span>
                        </button>
                      </div>
                    </div>`;

const newRibbon = `<div className="card-islamic-amber rounded-3xl p-5 shadow-sm border border-gold-400/60">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-900/10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎛️</span>
                          <div>
                            <h3 className="text-sm font-extrabold text-emerald-950 font-cairo">
                              {isRtl ? 'حقيبة اختبارات الإتقان المبتكرة للمحفظ (اختر نوع الاختبار التفاعلي):' : 'Creative Mastery Testing Suite:'}
                            </h3>
                            <p className="text-[11px] text-slate-600">
                              {isRtl ? 'طرق اختبار ذكية وغير مسبوقة لقياس قوة الحفظ، ترابط الآيات، وفواصل الأسماء الحسنى' : 'Unprecedented tests: endings, starters, divine attributes, cloze, and reverse order'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setHifzViewMode('mushaf_page')}
                          className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 border border-gold-400/40 text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <span>📖</span>
                          <span>{isRtl ? 'الرجوع للمصحف الورقي' : 'View Mushaf'}</span>
                        </button>
                      </div>

                      {/* Six Creative Testing Modes Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        
                        {/* 1. Mask Endings */}
                        <button
                          type="button"
                          onClick={() => setIsEndingsMasked(!isEndingsMasked)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isEndingsMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'طمس آخر كلمتين لاختبار حفظ فواصل الآيات' : 'Mask Endings'}
                        >
                          <span className="text-base">{isEndingsMasked ? '🙈' : '👁️'}</span>
                          <span>{isRtl ? (isEndingsMasked ? 'إلغاء طمس الفواصل' : 'طمس فواصل الآيات') : 'Mask Endings'}</span>
                        </button>

                        {/* 2. Mask Starters (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsStartersMasked(!isStartersMasked)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isStartersMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'طمس أول كلمتين لاختبار استحضار مطالع الآيات وترابطها' : 'Mask Starters'}
                        >
                          <span className="text-base">🔀</span>
                          <span>{isRtl ? (isStartersMasked ? 'إلغاء طمس المطالع' : 'طمس مطالع الآيات') : 'Mask Starters'}</span>
                        </button>

                        {/* 3. Mask Divine Attributes (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsDivineNamesMasked(!isDivineNamesMasked)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isDivineNamesMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'طمس أسماء الله وصفاته في الفواصل لمنع الخلط الشائع' : 'Mask Divine Attributes'}
                        >
                          <span className="text-base">👑</span>
                          <span>{isRtl ? (isDivineNamesMasked ? 'إلغاء طمس الصفات' : 'طمس الأسماء الحسنى') : 'Divine Names'}</span>
                        </button>

                        {/* 4. Alternating 50% Cloze (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsAlternatingMasked(!isAlternatingMasked)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isAlternatingMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'إخفاء كلمة وترك كلمة لتحفيز اليقظة العقلية الفائقة' : 'Alternating 50% Cloze'}
                        >
                          <span className="text-base">🏁</span>
                          <span>{isRtl ? (isAlternatingMasked ? 'إلغاء التظليل' : 'تظليل تبادلي 50%') : 'Cloze 50%'}</span>
                        </button>

                        {/* 5. Reverse Order Recitation (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsReverseOrder(!isReverseOrder)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isReverseOrder
                              ? 'bg-emerald-800 text-gold-300 border-emerald-900 ring-2 ring-emerald-500 font-black'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                          }\`}
                          title={isRtl ? 'عرض الآيات من الأسفل للأعلى لاختبار الحفظ الصارم' : 'Reverse Order Test'}
                        >
                          <span className="text-base">🔄</span>
                          <span>{isRtl ? (isReverseOrder ? 'الترتيب الأصلي' : 'تسميع عكسي صاعد') : 'Reverse Order'}</span>
                        </button>

                        {/* 6. Full Blind Recitation */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsFullMasked(!isFullMasked);
                            setRevealedAyahSet(new Set([1]));
                          }}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isFullMasked
                              ? 'bg-emerald-800 text-gold-300 border-emerald-900 ring-2 ring-emerald-500 font-black'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                          }\`}
                          title={isRtl ? 'إخفاء كامل للآيات مع النقر لكشف أي كلمة أو آية' : 'Full Blind Recitation'}
                        >
                          <span className="text-base">{isFullMasked ? '📖' : '🔒'}</span>
                          <span>{isRtl ? (isFullMasked ? 'كشف الكل' : 'تسميع غيبي كامل') : 'Blind Mode'}</span>
                        </button>

                      </div>

                      {/* Reset custom masks button if any active */}
                      {customMaskedWords.size > 0 && (
                        <div className="mt-3 pt-2 border-t border-amber-900/10 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCustomMaskedWords(new Set())}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                          >
                            <span>🔄</span>
                            <span>{isRtl ? 'إلغاء طمس الكلمات اليدوية (' + customMaskedWords.size + ')' : 'Reset Manual Masks'}</span>
                          </button>
                        </div>
                      )}
                    </div>`;

html = html.replace(oldRibbon, newRibbon);

// 4. Update the Ayah Mapping inside Testing Board to respect all innovative testing modes
const oldAyahMapBlock = `{hifzAyahs.map((ayah) => {
                          const words = ayah.text.split(' ');
                          const isRevealed = !isFullMasked || revealedAyahSet.has(ayah.num);

                          return (`;

const newAyahMapBlock = `{(isReverseOrder ? [...hifzAyahs].reverse() : hifzAyahs).map((ayah) => {
                          const words = ayah.text.split(' ');
                          const isRevealed = !isFullMasked || revealedAyahSet.has(ayah.num);

                          // Common Quranic divine names & attributes in endings
                          const divineEndingsList = ['ٱلْعَزِيزُ', 'الْعَزِيزُ', 'ٱلْعَزِيزِ', 'ٱلْغَفُورُ', 'الْغَفُورُ', 'ٱلرَّحِيمُ', 'الرَّحِيمُ', 'ٱلسَّمِيعُ', 'السَّمِيعُ', 'ٱلْعَلِيمُ', 'الْعَلِيمُ', 'قَدِيرٌ', 'عَلِيمٌ', 'حَكِيمٌ', 'غَفُورٌ', 'رَّحِيمٌ', 'خَبِيرٌ', 'بَصِيرٌ', 'ٱلتَّوَّابُ', 'التَّوَّابُ', 'ٱلْحَمِيدُ'];

                          return (`;

html = html.replace(oldAyahMapBlock, newAyahMapBlock);

// 5. Update word masking check
const oldWordMaskCheck = `const isEndingWord = isEndingsMasked && (wIdx >= words.length - 2);
                                    const isCustomMasked = customMaskedWords.has(ayah.num + '-' + wIdx);
                                    const isMasked = isEndingWord || isCustomMasked;`;

const newWordMaskCheck = `const isEndingWord = isEndingsMasked && (wIdx >= words.length - 2);
                                    const isStarterWord = isStartersMasked && (wIdx < 2);
                                    const isDivineNameWord = isDivineNamesMasked && (wIdx >= words.length - 3) && divineEndingsList.some(d => word.includes(d) || d.includes(word));
                                    const isAlternatingWord = isAlternatingMasked && (wIdx % 2 === 1);
                                    const isCustomMasked = customMaskedWords.has(ayah.num + '-' + wIdx);
                                    const isMasked = isEndingWord || isStarterWord || isDivineNameWord || isAlternatingWord || isCustomMasked;`;

html = html.replace(oldWordMaskCheck, newWordMaskCheck);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully implemented creative testing modes and fixed button arrows in public/index.html!');
