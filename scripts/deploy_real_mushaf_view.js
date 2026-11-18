const fs = require('fs');

const surahMap = JSON.parse(fs.readFileSync('scripts/surah_page_map.json', 'utf8'));

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add MUSHAF_SURAHS_PAGE_MAP constant
const mapConst = `
    // 114 Quran Surahs Page Mapping for Real Madinah Mushaf (King Fahd Complex)
    const MUSHAF_SURAHS_PAGE_MAP = ${JSON.stringify(surahMap)};
`;

if (!html.includes('const MUSHAF_SURAHS_PAGE_MAP =')) {
  html = html.replace('const ALL_QURAN_SURAHS =', mapConst + '\n    const ALL_QURAN_SURAHS =');
}

// 2. Add state for mushafPageNumber
const stateTarget = `const [selectedSurahNumber, setSelectedSurahNumber] = useState(67);`;
const newState = `const [mushafPageNumber, setMushafPageNumber] = useState(562); // Default: Surah Al-Mulk Page 562
      const [mushafCurrentSurahId, setMushafCurrentSurahId] = useState(67);
      const [selectedSurahNumber, setSelectedSurahNumber] = useState(67);`;

if (!html.includes('const [mushafPageNumber, setMushafPageNumber] = useState(562);')) {
  html = html.replace(stateTarget, newState);
}

// 3. Find boundaries of {activeTab === 'hifz' && (
const lines = html.split('\n');
const startLineIdx = lines.findIndex(l => l.includes("activeTab === 'hifz'"));
const endLineIdx = lines.findIndex(l => l.includes("activeTab === 'tajweed'"));

console.log('Replacing Hifz section between lines', startLineIdx + 1, 'and', endLineIdx + 1);

// Build new Real Mushaf View JSX
const newHifzSection = `            {activeTab === 'hifz' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Grand Emerald Header */}
                <div className="emerald-pattern rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border-2 border-gold-400 shadow-xl">
                  <div className="absolute top-2.5 right-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="absolute top-2.5 left-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-200 border border-gold-400/40 text-xs px-3 py-1 rounded-full mb-3 font-bold">
                      <span>🕋</span>
                      <span>{isRtl ? 'الفرع الأول: مصحف التحفيظ والمدارسة البصرية المباشرة' : 'Branch 1: Visual Quran Memorization Workbench'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-amiri text-gold-200 mb-2">
                      {isRtl ? 'مصحف المدينة النبوية الشريفة (الصفحة الكاملة 15 سطراً)' : 'Madinah Mushaf Page Viewer (15-Line Standard)'}
                    </h2>
                    <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-4">
                      {isRtl 
                        ? 'عرض وجه المصحف الورقي المطبوع كاملاً كما في يد الشيخ والطالب برسم مجمع الملك فهد لطباعة المصحف الشريف، لترسيخ الذاكرة البصرية التامة وضبط أوائل وأواخر الآيات.'
                        : 'Exact high-resolution page of King Fahd Complex Madinah Mushaf, identical to the physical Quran printed copy.'}
                    </p>

                    {/* Quick Navigation Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-800/80">
                      
                      {/* Surah Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gold-300">{isRtl ? 'السورة:' : 'Surah:'}</span>
                        <select
                          value={mushafCurrentSurahId}
                          onChange={(e) => {
                            const sid = parseInt(e.target.value);
                            setMushafCurrentSurahId(sid);
                            const surahItem = MUSHAF_SURAHS_PAGE_MAP.find(s => s.id === sid);
                            if (surahItem) {
                              setMushafPageNumber(surahItem.startPage);
                              showToast(isRtl ? 'انتقال إلى ' + surahItem.name + ' (صفحة ' + surahItem.startPage + ')' : 'Navigated to ' + surahItem.name);
                            }
                          }}
                          className="bg-emerald-900/90 border border-gold-400/50 rounded-xl px-3 py-1.5 text-xs text-gold-100 font-bold focus:outline-none focus:ring-2 focus:ring-gold-400"
                        >
                          {MUSHAF_SURAHS_PAGE_MAP.map(s => (
                            <option key={s.id} value={s.id} className="bg-emerald-950 text-white">
                              {s.id}. سورة {s.name} (صفحة {s.startPage})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Direct Page Input */}
                      <div className="flex items-center gap-1.5 bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-700">
                        <span className="text-xs font-bold text-gold-300">{isRtl ? 'الصفحة:' : 'Page:'}</span>
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
                          className="w-14 bg-emerald-950 text-gold-200 border border-gold-400/40 rounded-lg px-2 py-0.5 text-xs font-bold text-center focus:outline-none"
                        />
                        <span className="text-[11px] text-emerald-300">{isRtl ? 'من 604' : 'of 604'}</span>
                      </div>

                      {/* Prev / Next Page Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const p = Math.max(1, mushafPageNumber - 1);
                            setMushafPageNumber(p);
                            const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
                            if (sMatch) setMushafCurrentSurahId(sMatch.id);
                          }}
                          disabled={mushafPageNumber <= 1}
                          className="bg-emerald-900/90 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 border border-gold-400/40 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'الوجه السابق' : 'Prev Page'}</span>
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
                          className="bg-emerald-900/90 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 border border-gold-400/40 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>{isRtl ? 'الوجه التالي' : 'Next Page'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>

                      {/* Quick Landmarks Shortcuts */}
                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        <span className="text-gold-400 font-bold ml-1">{isRtl ? 'انتقال سريع:' : 'Quick:'}</span>
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
                            className={\`px-2 py-1 rounded-lg border transition font-bold \${
                              mushafPageNumber === lm.p
                                ? 'bg-gold-500 text-emerald-950 border-gold-300'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border-emerald-700/60'
                            }\`}
                          >
                            {lm.name} ({lm.p})
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>

                {/* THE AUTHENTIC PRINTED MADINAH MUSHAF PAGE (REAL PAPER VIEW) */}
                <div className="flex justify-center">
                  <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-emerald-950/20 max-w-4xl w-full relative">
                    
                    {/* Top Mushaf Header (Surah Name & Juz) */}
                    <div className="flex justify-between items-center pb-3 mb-4 border-b-2 border-gold-500/70 text-emerald-950 font-bold font-cairo text-sm sm:text-base">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <span>📖</span>
                        <span>
                          {isRtl 
                            ? 'سورة ' + ((MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك')
                            : 'Surah ' + ((MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'Al-Mulk')}
                        </span>
                      </div>

                      <div className="text-gold-700 font-extrabold">
                        {isRtl ? 'مصحف المدينة النبوية — مجمع الملك فهد' : 'King Fahd Complex Madinah Mushaf'}
                      </div>

                      <div className="text-emerald-900">
                        <span>{isRtl ? 'الجزء ' + Math.ceil(mushafPageNumber / 20) : 'Juz ' + Math.ceil(mushafPageNumber / 20)}</span>
                      </div>
                    </div>

                    {/* The Printed 15-Line Mushaf Page Image (High-Res 1260px) */}
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

                    {/* Bottom Mushaf Footer (Page Number & Navigation) */}
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

                {/* POST-RECITATION TEACHER TOOLBAR */}
                <div className="card-islamic-amber rounded-2xl p-4 sm:p-5 shadow-sm border border-gold-300/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎛️</span>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950 font-cairo">
                        {isRtl ? 'أدوات ما بعد التسميع الشفوي (للمحفظ والمعلم)' : 'Post-Recitation Teacher Tools'}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {isRtl ? 'بعد انتهاء الطالب من التسميع الشفوي، أرسل له وِرد الوجه أو قيّد المتشابهات لتثبيت حفظه' : 'Send WhatsApp broadcast or review Mutashabihat for this page'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const curSurah = (MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك';
                        const msg = '🕌 *حلقة القرآن الكريم — وِرد مدارسة ومراجعة الوجه*\n' +
                          '📖 *المقرر:* سورة ' + curSurah + ' (صفحة ' + mushafPageNumber + ' من مصحف المدينة)\n\n' +
                          '🔁 *توجيه الشيخ:* يُرجى تكرار هذا الوجه 5 مرات غيباً وتثبيت فواصل الآيات ومواضع المتشابهات قبل الحلقة القادمة.\n\n' +
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

                {/* MUTASHABIHAT CROSS-REFERENCE TOOL */}
                <div className="card-islamic-sage rounded-3xl p-6 shadow-sm border border-emerald-300/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-900/10">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <h3 className="text-lg font-bold text-emerald-950 font-cairo">
                          {isRtl ? 'كاشف المتشابهات اللفظية وتنبيهات الحفظ لهذا الوجه' : 'Mutashabihat Cross-Reference Analyzer'}
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
                      <span>{isRtl ? (isAddMutaOpen ? 'إغلاق نافذة الإضافة' : 'إضافة أو ربط متشابهة جديدة لهذا الوجه') : (isAddMutaOpen ? 'Close' : 'Link New Mutashabiha')}</span>
                    </button>
                  </div>

                  {/* Add Mutashabiha Drawer / Workbench */}
                  {isAddMutaOpen && (
                    <div className="mb-6 bg-white/95 border-2 border-emerald-700/40 rounded-2xl p-5 shadow-lg animate-fadeIn text-slate-800">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                          <span>🔗</span>
                          <span>{isRtl ? 'إدراج متشابهة لفظية خاصة بالوجه وتوجيه المعلم للدارس' : 'Add Custom Mutashabiha & Guidance Note'}</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                          {isRtl ? 'بالرسم العثماني المعتمد' : 'Verified Uthmani'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* 1. Search Query */}
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

                        {/* 2. Target Ayah Display */}
                        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                          <label className="block text-xs font-bold text-amber-900 mb-1.5">
                            {isRtl ? '2. الموضع المتشابه المختار بالرسم العثماني:' : '2. Selected similar ayah:'}
                          </label>
                          <div className="p-2.5 bg-white rounded-lg border border-amber-200/80 font-quran text-sm text-amber-950 leading-relaxed min-h-[60px]" dir="rtl">
                            {mutaTargetText || (isRtl ? 'ابحث عن الآية لتظهر هنا بالرسم العثماني المشكول...' : 'Search ayah...')}
                          </div>
                        </div>
                      </div>

                      {/* 3. Teacher Guidance Note */}
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

html = before + '\n' + newHifzSection + '\n' + after;

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully deployed Real Printed Madinah Mushaf View to public/index.html!');
