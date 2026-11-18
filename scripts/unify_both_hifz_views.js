const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add state for hifzViewMode
if (!html.includes('hifzViewMode')) {
  html = html.replace(
    'const [mushafPageNumber, setMushafPageNumber] = useState(562);',
    'const [hifzViewMode, setHifzViewMode] = useState(\'mushaf_page\'); // \'mushaf_page\' | \'interactive_test\'\n      const [mushafPageNumber, setMushafPageNumber] = useState(562);'
  );
}

// 2. Build the unified Hifz view containing BOTH:
// Mode A: Real Printed Madinah Mushaf Page
// Mode B: Interactive Recitation Test Board (Mask Endings, Blind Recitation, Click-to-hide words, Repeat loop, Mutashabihat)
const lines = html.split('\n');
const startLineIdx = lines.findIndex(l => l.includes("activeTab === 'hifz'"));
const endLineIdx = lines.findIndex(l => l.includes("activeTab === 'tajweed'"));

const unifiedHifzJSX = `            {activeTab === 'hifz' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header Banner */}
                <div className="emerald-pattern rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border-2 border-gold-400 shadow-xl">
                  <div className="absolute top-2.5 right-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="absolute top-2.5 left-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-200 border border-gold-400/40 text-xs px-3 py-1 rounded-full mb-3 font-bold">
                      <span>🕋</span>
                      <span>{isRtl ? 'الفرع الأول: منظومة التحفيظ المتكاملة (المصحف الورقي + اختبار الإتقان)' : 'Branch 1: Complete Quran Memorization System'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-amiri text-gold-200 mb-2">
                      {isRtl ? 'مدارسة مصحف المدينة واختبارات الإتقان التفاعلية' : 'Madinah Mushaf Visuals & Interactive Testing'}
                    </h2>
                    <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-4">
                      {isRtl 
                        ? 'يجمع بين صفحة المصحف الورقي المطبوع الحقيقي (15 سطراً) لترسيخ الذاكرة البصرية، وبين أدوات اختبار الإتقان الفورية (طمس فواصل الآيات، التسميع الغيبي، إخفاء الكلمات، وكاشف المتشابهات).'
                        : 'Combines authentic 15-line Madinah Mushaf visual page with live mastery testing tools: mask endings, blind recitation, word-masking, and mutashabihat.'}
                    </p>

                    {/* Mode Toggle Switch (Mushaf Page vs Interactive Testing) */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-800/80">
                      <div className="inline-flex bg-emerald-950/90 p-1.5 rounded-2xl border border-gold-400/60 shadow-md">
                        <button
                          type="button"
                          onClick={() => setHifzViewMode('mushaf_page')}
                          className={\`px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition \${
                            hifzViewMode === 'mushaf_page'
                              ? 'bg-gold-500 text-emerald-950 font-black shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:text-white'
                          }\`}
                        >
                          <span>📖</span>
                          <span>{isRtl ? '1. وجه المصحف الورقي (15 سطراً)' : '1. Real Mushaf Page'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHifzViewMode('interactive_test')}
                          className={\`px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition \${
                            hifzViewMode === 'interactive_test'
                              ? 'bg-gold-500 text-emerald-950 font-black shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:text-white'
                          }\`}
                        >
                          <span>🎯</span>
                          <span>{isRtl ? '2. لوحة التسميع واختبار الإتقان' : '2. Recitation & Testing Board'}</span>
                        </button>
                      </div>

                      {/* Quick Shortcut Buttons in Header */}
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
                      )}
                    </div>
                  </div>
                </div>

                {/* ================= MODE A: THE REAL PRINTED MADINAH MUSHAF PAGE ================= */}
                {hifzViewMode === 'mushaf_page' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Navigation Bar for Mushaf Page */}
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
                    </div>

                    {/* The Authentic 15-Line Printed Madinah Mushaf Page */}
                    <div className="flex justify-center">
                      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-emerald-950/20 max-w-4xl w-full relative">
                        {/* Top Mushaf Header */}
                        <div className="flex justify-between items-center pb-3 mb-4 border-b-2 border-gold-500/70 text-emerald-950 font-bold font-cairo text-sm sm:text-base">
                          <div className="flex items-center gap-2 text-emerald-900">
                            <span>📖</span>
                            <span>
                              {isRtl 
                                ? 'سورة ' + ((MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك')
                                : 'Surah ' + ((MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'Al-Mulk')}
                            </span>
                          </div>

                          <div className="text-gold-700 font-extrabold text-xs sm:text-sm">
                            {isRtl ? 'مصحف المدينة النبوية — مجمع الملك فهد لطباعة المصحف الشريف' : 'King Fahd Complex Madinah Mushaf'}
                          </div>

                          <div className="text-emerald-900">
                            <span>{isRtl ? 'الجزء ' + Math.ceil(mushafPageNumber / 20) : 'Juz ' + Math.ceil(mushafPageNumber / 20)}</span>
                          </div>
                        </div>

                        {/* The High-Resolution 15-Line Page Image */}
                        <div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center">
                          <img
                            key={mushafPageNumber}
                            src={'https://android.quran.com/data/width_1260/page' + String(mushafPageNumber).padStart(3, '0') + '.png'}
                            alt={'مصحف المدينة النبوية — صفحة ' + mushafPageNumber}
                            className="w-full max-w-3xl h-auto block mx-auto bg-white filter contrast-110 drop-shadow-sm select-none"
                            loading="eager"
                            style={{ minHeight: '500px' }}
                          />
                        </div>

                        {/* Bottom Mushaf Footer */}
                        <div className="flex justify-between items-center pt-3 mt-4 border-t-2 border-gold-500/70 text-xs sm:text-sm font-bold text-emerald-950">
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
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= MODE B: INTERACTIVE RECITATION & MASTERY TESTING ================= */}
                {hifzViewMode === 'interactive_test' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Live Recitation Controls Ribbon */}
                    <div className="card-islamic-amber rounded-2xl p-4 sm:p-5 shadow-sm border border-gold-300/80 flex flex-wrap items-center justify-between gap-3">
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
                    </div>

                    {/* Quranic Ayahs Board with Clickable Words */}
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-900/20 relative">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-emerald-900/10">
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

                        {/* Repetition Loop Counter */}
                        <div className="flex items-center gap-2 bg-emerald-950 text-gold-200 rounded-xl px-3 py-1.5 border border-gold-400/40 text-xs shadow-sm">
                          <span>🔁 {isRtl ? 'عداد التكرار:' : 'Loop:'}</span>
                          <div className="flex items-center gap-1">
                            {[3, 5, 7].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => { setRepeatTarget(num); setRepeatCount(0); }}
                                className={\`px-2 py-0.5 rounded text-[11px] font-bold \${
                                  repeatTarget === num ? 'bg-gold-500 text-emerald-950 font-black' : 'text-emerald-300 hover:text-white'
                                }\`}
                              >
                                {num}x
                              </button>
                            ))}
                          </div>
                          <span className="text-gold-400 font-bold px-1">({repeatCount}/{repeatTarget})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = repeatCount + 1;
                              setRepeatCount(next > repeatTarget ? 1 : next);
                              if (next === repeatTarget) {
                                showToast(isRtl ? '🎉 ما شاء الله! اكتمل نصاب التكرار المطلوب' : 'Target reached! 🎉');
                              }
                            }}
                            className="bg-gold-400 hover:bg-gold-300 text-emerald-950 font-black px-2.5 py-0.5 rounded shadow text-xs transition"
                          >
                            +1
                          </button>
                        </div>
                      </div>

                      {/* Basmalah */}
                      <div className="text-center font-quran text-2xl text-emerald-900 mb-8 py-2 select-none border-b border-gold-400/20 max-w-md mx-auto">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>

                      {/* Ayahs List */}
                      <div className="space-y-6">
                        {hifzAyahs.map((ayah) => {
                          const words = ayah.text.split(' ');
                          const isRevealed = !isFullMasked || revealedAyahSet.has(ayah.num);

                          return (
                            <div 
                              key={ayah.num}
                              className={\`p-5 rounded-2xl transition-all duration-200 bg-white border-2 border-emerald-900/15 shadow-sm hover:border-gold-500/50 \${
                                activeRepeatAyah === ayah.num 
                                  ? 'ring-2 ring-gold-400' 
                                  : ''
                              }\`}
                            >
                              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-gold-300 font-bold flex items-center justify-center text-xs">
                                    {ayah.num}
                                  </span>
                                  <span className="text-slate-600 font-bold">
                                    {isRtl ? 'الآية رقم ' + ayah.num : 'Ayah ' + ayah.num}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => { setActiveRepeatAyah(ayah.num); setRepeatCount(0); }}
                                    className={\`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 \${
                                      activeRepeatAyah === ayah.num 
                                        ? 'bg-gold-500 text-emerald-950 font-black' 
                                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }\`}
                                  >
                                    <span>🔁</span>
                                    <span>{isRtl ? 'تركيز التكرار' : 'Focus'}</span>
                                  </button>

                                  {isFullMasked && (
                                    <button
                                      type="button"
                                      onClick={() => toggleRevealAyah(ayah.num)}
                                      className={\`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 \${
                                        isRevealed 
                                          ? 'bg-emerald-100 text-emerald-900' 
                                          : 'bg-emerald-900 text-gold-300 font-black shadow'
                                      }\`}
                                    >
                                      <span>{isRevealed ? '🙈 إخفاء' : '👁️ كشف للطالب'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {!isRevealed ? (
                                <div className="py-6 text-center text-slate-400 font-amiri text-lg border-2 border-dashed border-emerald-900/20 rounded-xl bg-emerald-950/5 select-none">
                                  🔒 {isRtl ? 'الآية مخفية للتسميع الغيبي — اضغط "كشف للطالب" عند إتمام القراءة' : 'Ayah hidden for blind recitation'}
                                </div>
                              ) : (
                                <div className="font-quran text-3xl sm:text-4xl font-bold leading-[2.6] text-black text-right flex flex-wrap gap-x-2.5 gap-y-3.5 items-baseline select-none">
                                  {words.map((word, wIdx) => {
                                    const isEndingWord = isEndingsMasked && (wIdx >= words.length - 2);
                                    const isCustomMasked = customMaskedWords.has(ayah.num + '-' + wIdx);
                                    const isMasked = isEndingWord || isCustomMasked;

                                    return (
                                      <span
                                        key={wIdx}
                                        onClick={() => toggleWordMask(ayah.num, wIdx)}
                                        className={\`px-1.5 py-0.5 rounded-lg cursor-pointer transition-all \${
                                          isMasked 
                                            ? 'bg-amber-200 text-amber-950 border-b-2 border-dashed border-amber-600 px-3 font-sans text-base select-none shadow-xs font-bold' 
                                            : 'hover:bg-gold-200 hover:text-emerald-950'
                                        }\`}
                                        title={isMasked ? (isRtl ? 'انقر لكشف الكلمة' : 'Click to reveal') : (isRtl ? 'انقر لطمس الكلمة' : 'Click to mask')}
                                      >
                                        {isMasked ? '[ ... ]' : word}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* POST-RECITATION WHATSAPP BROADCAST TOOL */}
                <div className="card-islamic-amber rounded-2xl p-4 sm:p-5 shadow-sm border border-gold-300/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎛️</span>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950 font-cairo">
                        {isRtl ? 'وِرد المدارسة والتذكرة بعد الحلقة' : 'Post-Session Student Broadcast'}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {isRtl ? 'أرسل لطلابك وِرد الوجه ومتشابهاته وتوجيهاتك بضغطة واحدة عبر الواتساب' : 'Send WhatsApp broadcast to students'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const curSurah = (MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك';
                        const msg = '🕌 *حلقة القرآن الكريم — وِرد مدارسة ومراجعة الوجه*\\n' +
                          '📖 *المقرر:* سورة ' + curSurah + ' (صفحة ' + mushafPageNumber + ' من مصحف المدينة)\\n\\n' +
                          '🔁 *توجيه الشيخ:* يُرجى تكرار هذا الوجه 5 مرات غيباً وتثبيت فواصل الآيات ومواضع المتشابهات قبل الحلقة القادمة.\\n\\n' +
                          '✨ *منظومة مِشكاة — AnubisLand*';
                        navigator.clipboard.writeText(msg);
                        showToast(isRtl ? 'تم نسخ رسالة وِرد الوجه للواتساب بنجاح 📋' : 'WhatsApp broadcast copied to clipboard 📋');
                      }}
                      className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 text-xs font-black px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <span>📱</span>
                      <span>{isRtl ? 'نسخ وِرد الوجه للدارسين (واتساب)' : 'Copy WhatsApp Broadcast'}</span>
                    </button>
                  </div>
                </div>

                {/* MUTASHABIHAT CROSS-REFERENCE ANALYZER */}
                <div className="card-islamic-sage rounded-3xl p-6 shadow-sm border border-emerald-300/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-900/10">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <h3 className="text-lg font-bold text-emerald-950 font-cairo">
                          {isRtl ? 'كاشف المتشابهات اللفظية وتنبيهات الحفظ' : 'Mutashabihat Cross-Reference Analyzer'}
                        </h3>
                        <p className="text-xs text-emerald-900/80">
                          {isRtl ? 'تنبيهات فورية للمحفظ بمواضع التشابه مع سور أخرى لتجنيب الدارسين الخطأ في التسميع' : 'Cross-references to alert students against common confusion'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddMutaOpen(!isAddMutaOpen);
                        if (!mutaTargetText) {
                          handleFetchTargetMutaAyah(mutaTargetSurahId, mutaTargetAyahNum);
                        }
                      }}
                      className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition border border-gold-400/40"
                    >
                      <span>{isAddMutaOpen ? '✕' : '➕'}</span>
                      <span>{isRtl ? (isAddMutaOpen ? 'إغلاق نافذة الإضافة' : 'إضافة أو ربط متشابهة جديدة') : (isAddMutaOpen ? 'Close' : 'Link New Mutashabiha')}</span>
                    </button>
                  </div>

                  {/* Add Mutashabiha Drawer */}
                  {isAddMutaOpen && (
                    <div className="mb-6 bg-white/95 border-2 border-emerald-700/40 rounded-2xl p-5 shadow-lg animate-fadeIn text-slate-800">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                          <span>🔗</span>
                          <span>{isRtl ? 'إدراج متشابهة لفظية خاصة وتوجيه المعلم للدارس' : 'Add Custom Mutashabiha & Guidance Note'}</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                          {isRtl ? 'بالرسم العثماني المعتمد' : 'Verified Uthmani'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Search Query */}
                        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                          <label className="block text-xs font-bold text-emerald-900 mb-1.5">
                            {isRtl ? '1. ابحث بكلمة من الآية المتشابهة في القرآن:' : '1. Search phrase in Quran:'}
                          </label>
                          <div className="flex gap-1.5 mb-2">
                            <input
                              type="text"
                              value={mutaSearchQuery}
                              onChange={(e) => setMutaSearchQuery(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchMutaAyahs(); }}
                              placeholder={isRtl ? 'ابحث بكلمة (مثال: عزيز غفور)...' : 'Search phrase...'}
                              className="flex-1 bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={handleSearchMutaAyahs}
                              disabled={isSearchingMuta}
                              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <span>{isSearchingMuta ? '⏳' : '🔍'}</span>
                              <span>{isRtl ? 'بحث' : 'Search'}</span>
                            </button>
                          </div>

                          {mutaSearchResults.length > 0 && (
                            <div className="mb-2 bg-white border border-emerald-300 rounded-lg max-h-36 overflow-y-auto divide-y divide-emerald-100 shadow-sm">
                              {mutaSearchResults.map((m, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectMutaMatch(m)}
                                  className="w-full text-right p-2 hover:bg-emerald-50 transition block text-[11px] leading-snug"
                                  dir="rtl"
                                >
                                  <span className="font-bold text-emerald-900 block">
                                    📖 {m.surah.name} (آية {m.numberInSurah}):
                                  </span>
                                  <span className="text-slate-700 font-quran">{m.text}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Target Ayah Display */}
                        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                          <label className="block text-xs font-bold text-amber-900 mb-1.5">
                            {isRtl ? '2. الموضع المتشابه المختار بالرسم العثماني:' : '2. Selected similar ayah:'}
                          </label>
                          <div className="p-2.5 bg-white rounded-lg border border-amber-200/80 font-quran text-sm text-amber-950 leading-relaxed min-h-[60px]" dir="rtl">
                            {mutaTargetText || (isRtl ? 'ابحث عن الآية لتظهر هنا بالرسم العثماني المشكول...' : 'Search ayah...')}
                          </div>
                        </div>
                      </div>

                      {/* Teacher Guidance Note */}
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {isRtl ? '3. توجيه الشيخ والمعلم / ضابط الفارق اللفظي لتثبيت الحفظ:' : '3. Memorization Tip & Distinguishing Rule:'}
                        </label>
                        <input
                          type="text"
                          value={mutaGuideNote}
                          onChange={(e) => setMutaGuideNote(e.target.value)}
                          placeholder={isRtl ? 'مثال: في سورة فاطر جاءت بغير لام التعريف (عَزِيزٌ غَفُورٌ)، بينما في الملك معرّفة (ٱلْعَزِيزُ ٱلْغَفُورُ).' : 'E.g., Notice indefinite form vs definite form.'}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsAddMutaOpen(false)}
                          className="text-xs px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveNewMutashabiha}
                          className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 text-xs font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                        >
                          <span>💾</span>
                          <span>{isRtl ? 'حفظ المتشابهة وإدراجها في خطة الدرس والواتساب' : 'Save Mutashabiha to Lesson & WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mutashabihat Cards List */}
                  {hifzMutashabihat && hifzMutashabihat.length > 0 ? (
                    <div className="space-y-4">
                      {hifzMutashabihat.map((m, mIdx) => (
                        <div key={mIdx} className="bg-white/90 rounded-2xl p-4 border border-emerald-200/80 shadow-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2.5">
                            <div className="bg-emerald-900/5 p-3 rounded-xl border-r-4 border-emerald-700">
                              <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                                {isRtl ? 'الموضع في هذا الوجه المقرر:' : 'In Current Page:'}
                              </span>
                              <p className="font-quran text-lg text-emerald-950 leading-relaxed" dir="rtl">
                                {m.ayah}
                              </p>
                            </div>

                            <div className="bg-amber-900/5 p-3 rounded-xl border-r-4 border-amber-500">
                              <span className="text-[11px] font-bold text-amber-800 block mb-1">
                                {isRtl ? 'الموضع المتشابه في سورة أخرى:' : 'Similar Passage Elsewhere:'}
                              </span>
                              <p className="font-quran text-lg text-amber-950 leading-relaxed" dir="rtl">
                                {m.similar}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-950/5 p-2.5 rounded-xl text-xs text-emerald-900 font-medium">
                            <div className="flex items-start gap-1.5 flex-1">
                              <span className="text-gold-600 font-bold text-sm">💡</span>
                              <span><strong>{isRtl ? 'ضابط حفظ المتشابهة للمحفظ:' : 'Memorization Guide:'}</strong> {m.difference}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteMutashabiha(mIdx)}
                              className="text-slate-400 hover:text-red-600 text-[11px] px-2 py-0.5 rounded hover:bg-red-50 transition"
                              title={isRtl ? 'حذف هذه المتشابهة' : 'Delete'}
                            >
                              🗑️ {isRtl ? 'حذف' : 'Remove'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      {isRtl ? 'لا توجد متشابهات مسجلة لهذا الوجه بعد. اضغط "إضافة أو ربط متشابهة جديدة" لإدراج تنبيهات الحفظ.' : 'No cross-references registered yet.'}
                    </div>
                  )}
                </div>

              </div>
            )}`;

const before = lines.slice(0, startLineIdx).join('\n');
const after = lines.slice(endLineIdx).join('\n');

html = before + '\n' + unifiedHifzJSX + '\n' + after;

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully unified BOTH Hifz views (Real Mushaf Page + Interactive Testing)!');
