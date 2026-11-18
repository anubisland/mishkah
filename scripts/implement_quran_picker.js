const fs = require('fs');

const cleanSurahs = JSON.parse(fs.readFileSync('scripts/clean_surahs.json', 'utf8'));

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add ALL_QURAN_SURAHS constant right before PRELOADED_HIFZ_PASSAGES
const surahsConst = `
    // 114 Verified Quran Surahs with exact metadata
    const ALL_QURAN_SURAHS = ${JSON.stringify(cleanSurahs)};
`;

if (!html.includes('const ALL_QURAN_SURAHS =')) {
  html = html.replace('const PRELOADED_HIFZ_PASSAGES =', surahsConst + '\n    const PRELOADED_HIFZ_PASSAGES =');
}

// 2. Add React states for Quran picker in App component
const stateTarget = `const [customAyahInput, setCustomAyahInput] = useState('');
      const [showCustomInput, setShowCustomInput] = useState(false);`;

const newState = `const [selectedSurahNumber, setSelectedSurahNumber] = useState(67);
      const [selectedAyahFrom, setSelectedAyahFrom] = useState(1);
      const [selectedAyahTo, setSelectedAyahTo] = useState(5);
      const [isFetchingQuran, setIsFetchingQuran] = useState(false);
      const [showCustomInput, setShowCustomInput] = useState(false);`;

html = html.replace(stateTarget, newState);

// 3. Add handleFetchQuranPassage function
const oldHandlerTarget = `// Helper function to load custom user entered text
      function handleApplyCustomAyahs() {
        if (!customAyahInput.trim()) return;
        const lines = customAyahInput.split('\\n').filter(l => l.trim().length > 0);
        const parsedAyahs = lines.map((line, idx) => ({
          num: idx + 1,
          text: line.trim()
        }));
        setHifzAyahs(parsedAyahs);
        setHifzSurahName(isRtl ? 'مقطع خاص بالمعلم' : 'Custom Teacher Passage');
        setHifzAyahRange('1–' + parsedAyahs.length);
        setHifzMutashabihat([]);
        setHifzPassageId('custom');
        setShowCustomInput(false);
        setIsEndingsMasked(false);
        setIsFullMasked(false);
        setRevealedAyahSet(new Set([1]));
        setCustomMaskedWords(new Set());
        setRepeatCount(0);
        showToast(isRtl ? 'تم تطبيق الآيات الخاصة في لوحة التسميع بنجاح 🕋' : 'Custom Ayahs Applied to Board 🕋');
      }`;

const newHandler = `// Fetch verified Uthmani Ayahs from cache or API directly
      async function handleFetchQuranPassage() {
        const surah = ALL_QURAN_SURAHS.find(s => s.id === selectedSurahNumber) || ALL_QURAN_SURAHS[66];
        const from = Math.max(1, selectedAyahFrom);
        const to = Math.min(surah.ayahs, Math.max(from, selectedAyahTo));
        
        setIsFetchingQuran(true);
        try {
          const cacheKey = 'mishkah_quran_surah_' + surah.id;
          let allAyahs = null;
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try { allAyahs = JSON.parse(cached); } catch(e) {}
          }
          
          if (!allAyahs) {
            const res = await fetch('https://api.alquran.cloud/v1/surah/' + surah.id + '/quran-uthmani');
            if (!res.ok) throw new Error('Network error: ' + res.status);
            const data = await res.json();
            allAyahs = data.data?.ayahs || [];
            try { localStorage.setItem(cacheKey, JSON.stringify(allAyahs)); } catch(e) {}
          }

          if (!allAyahs || allAyahs.length === 0) throw new Error('No ayahs found');

          // Slice requested range
          const sliced = allAyahs.slice(from - 1, to);
          const basmalah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
          const mappedAyahs = sliced.map(a => {
            let t = a.text || '';
            // Strip basmalah prefix on ayah 1 if not Al-Fatihah and not At-Tawbah
            if (a.numberInSurah === 1 && surah.id !== 1 && surah.id !== 9 && t.startsWith(basmalah)) {
              t = t.substring(basmalah.length);
            }
            return {
              num: a.numberInSurah,
              text: t
            };
          });

          setHifzAyahs(mappedAyahs);
          setHifzSurahName('سورة ' + surah.name);
          setHifzAyahRange(from + '–' + to);
          setHifzMutashabihat([]);
          setHifzPassageId('custom_quran_' + surah.id);
          setShowCustomInput(false);
          setIsEndingsMasked(false);
          setIsFullMasked(false);
          setRevealedAyahSet(new Set([from]));
          setCustomMaskedWords(new Set());
          setRepeatCount(0);
          showToast(isRtl ? 'تم جلب آيات سورة ' + surah.name + ' (' + from + '–' + to + ') بالرسم العثماني المعتمد ۞' : 'Loaded Surah ' + surah.en + ' (' + from + '–' + to + ') in Uthmani Script ۞');
        } catch (err) {
          console.error('Quran fetch error:', err);
          showToast(isRtl ? 'تعذر جلب الآيات عبر الإنترنت، يُرجى التحقق من الاتصال ⚠️' : 'Could not fetch ayahs, check connection ⚠️');
        } finally {
          setIsFetchingQuran(false);
        }
      }`;

html = html.replace(oldHandlerTarget, newHandler);

// 4. Update the Button and Drawer in Hifz UI
const oldButtonTarget = `<button
                        type="button"
                        onClick={() => setShowCustomInput(!showCustomInput)}
                        className={\`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 \${
                          showCustomInput 
                            ? 'bg-gold-500 text-emerald-950 font-black' 
                            : 'bg-emerald-900/90 hover:bg-emerald-800 text-gold-300 border border-gold-400/40'
                        }\`}
                      >
                        <span>✏️</span>
                        <span>{isRtl ? 'إدخال آيات خاصة بك' : 'Enter Custom Ayahs'}</span>
                      </button>`;

const newButton = `<button
                        type="button"
                        onClick={() => setShowCustomInput(!showCustomInput)}
                        className={\`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 \${
                          showCustomInput 
                            ? 'bg-gold-500 text-emerald-950 font-black ring-2 ring-gold-300' 
                            : 'bg-emerald-900/90 hover:bg-emerald-800 text-gold-300 border border-gold-400/50'
                        }\`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'اختيار سورة وآيات من المصحف الشريف ۞' : 'Select Surah & Ayahs ۞'}</span>
                      </button>`;

html = html.replace(oldButtonTarget, newButton);

// 5. Replace Drawer
const oldDrawerStart = '{showCustomInput && (';
const drawerEndMarker = '{/* TEACHER LIVE CONTROL RIBBON */}';

const drawerStartIndex = html.indexOf(oldDrawerStart);
const drawerEndIndex = html.indexOf(drawerEndMarker);

if (drawerStartIndex !== -1 && drawerEndIndex !== -1) {
  const currentSelectedSurahDef = `const currentSelectedSurah = ALL_QURAN_SURAHS.find(s => s.id === selectedSurahNumber) || ALL_QURAN_SURAHS[66];`;
  
  const newDrawer = `{showCustomInput && (
                      <div className="mt-4 bg-emerald-950/95 border-2 border-gold-400/60 rounded-2xl p-5 shadow-2xl animate-fadeIn">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gold-400/30">
                          <div className="flex items-center gap-2 text-gold-200 font-bold text-sm">
                            <span className="text-lg">📖</span>
                            <span>{isRtl ? 'تحديد مقطع من المصحف الشريف بالرسم العثماني المعتمد' : 'Select Quranic Passage (Verified Uthmani Script)'}</span>
                          </div>
                          <span className="text-[11px] text-gold-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-gold-400/40 font-bold">
                            {isRtl ? '114 سورة كاملة موثقة' : '114 Verified Surahs'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          {/* 1. Surah Dropdown */}
                          <div className="sm:col-span-1">
                            <label className="block text-xs font-bold text-gold-200 mb-1.5">
                              {isRtl ? 'السورة المباركة:' : 'Surah:'}
                            </label>
                            <select
                              value={selectedSurahNumber}
                              onChange={(e) => {
                                const num = parseInt(e.target.value);
                                setSelectedSurahNumber(num);
                                setSelectedAyahFrom(1);
                                const found = ALL_QURAN_SURAHS.find(s => s.id === num);
                                if (found) {
                                  setSelectedAyahTo(Math.min(found.ayahs, 5));
                                }
                              }}
                              className="w-full bg-emerald-900 border border-gold-400/60 rounded-xl px-3 py-2 text-sm text-gold-100 font-bold focus:outline-none focus:ring-2 focus:ring-gold-400"
                            >
                              {ALL_QURAN_SURAHS.map(s => (
                                <option key={s.id} value={s.id} className="bg-emerald-950 text-white">
                                  {s.id}. سورة {s.name} ({s.ayahs} آية)
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 2. From Ayah */}
                          <div>
                            <label className="block text-xs font-bold text-gold-200 mb-1.5">
                              {isRtl ? 'من آية:' : 'From Ayah:'}
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={(() => { const s = ALL_QURAN_SURAHS.find(x => x.id === selectedSurahNumber); return s ? s.ayahs : 286; })()}
                              value={selectedAyahFrom}
                              onChange={(e) => setSelectedAyahFrom(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full bg-emerald-900 border border-gold-400/60 rounded-xl px-3 py-2 text-sm text-gold-100 font-bold focus:outline-none focus:ring-2 focus:ring-gold-400 text-center"
                            />
                          </div>

                          {/* 3. To Ayah */}
                          <div>
                            <label className="block text-xs font-bold text-gold-200 mb-1.5">
                              {isRtl ? 'إلى آية:' : 'To Ayah:'}
                            </label>
                            <input
                              type="number"
                              min={selectedAyahFrom}
                              max={(() => { const s = ALL_QURAN_SURAHS.find(x => x.id === selectedSurahNumber); return s ? s.ayahs : 286; })()}
                              value={selectedAyahTo}
                              onChange={(e) => {
                                const maxAyahs = (() => { const s = ALL_QURAN_SURAHS.find(x => x.id === selectedSurahNumber); return s ? s.ayahs : 286; })();
                                const val = parseInt(e.target.value) || selectedAyahFrom;
                                setSelectedAyahTo(Math.min(maxAyahs, Math.max(selectedAyahFrom, val)));
                              }}
                              className="w-full bg-emerald-900 border border-gold-400/60 rounded-xl px-3 py-2 text-sm text-gold-100 font-bold focus:outline-none focus:ring-2 focus:ring-gold-400 text-center"
                            />
                          </div>
                        </div>

                        {/* Quick Selection Buttons & Action */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-800">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-200">
                            <span className="text-gold-300 font-bold">{isRtl ? 'اختصارات سريعة:' : 'Quick:'}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const maxAyahs = (() => { const s = ALL_QURAN_SURAHS.find(x => x.id === selectedSurahNumber); return s ? s.ayahs : 286; })();
                                setSelectedAyahFrom(1);
                                setSelectedAyahTo(Math.min(maxAyahs, 5));
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-xs text-gold-200 border border-emerald-700"
                            >
                              {isRtl ? 'الآيات (1-5)' : 'Ayahs 1-5'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const maxAyahs = (() => { const s = ALL_QURAN_SURAHS.find(x => x.id === selectedSurahNumber); return s ? s.ayahs : 286; })();
                                setSelectedAyahFrom(1);
                                setSelectedAyahTo(Math.min(maxAyahs, 10));
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-xs text-gold-200 border border-emerald-700"
                            >
                              {isRtl ? 'الآيات (1-10)' : 'Ayahs 1-10'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const maxAyahs = (() => { const s = ALL_QURAN_SURAHS.find(x => x.id === selectedSurahNumber); return s ? s.ayahs : 286; })();
                                setSelectedAyahFrom(1);
                                setSelectedAyahTo(maxAyahs);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-xs text-gold-200 border border-emerald-700"
                            >
                              {isRtl ? 'كامل السورة' : 'Full Surah'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowCustomInput(false)}
                              className="text-xs px-3 py-2 rounded-xl text-emerald-300 hover:bg-emerald-800/60 font-bold"
                            >
                              {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={handleFetchQuranPassage}
                              disabled={isFetchingQuran}
                              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition transform active:scale-95 disabled:opacity-50"
                            >
                              <span>{isFetchingQuran ? '⏳' : '۞'}</span>
                              <span>
                                {isFetchingQuran 
                                  ? (isRtl ? 'جاري جلب الآيات بالرسم العثماني...' : 'Fetching Uthmani Script...') 
                                  : (isRtl ? 'جلب الآيات بالرسم العثماني المعتمد' : 'Load Sacred Uthmani Ayahs')}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Reverent Note */}
                        <div className="mt-3 text-[11px] text-emerald-200/90 flex items-center gap-2 bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800">
                          <span className="text-sm">🛡️</span>
                          <span>
                            {isRtl 
                              ? 'صيانة للنص القرآني: يتم جلب الآيات إلكترونياً بالرسم العثماني المعتمد والتشكيل الكامل من المصحف الشريف مباشرة دون أي حاجة للكتابة أو النسخ، حفظاً له من أي خطأ أو سهو.'
                              : 'Preserving Sacred Text: Verses are fetched directly in verified Uthmani script with full diacritics, eliminating any manual typing errors.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                `;

  html = html.substring(0, drawerStartIndex) + newDrawer + html.substring(drawerEndIndex);
}

// 6. Replace Tajweed raw text input with Surah Dropdown
const oldTajweedSurahTarget = `<input 
                        type="text" 
                        value={surahName} 
                        onChange={(e) => setSurahName(e.target.value)}
                        placeholder="سورة الملك / Al-Mulk"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />`;

const newTajweedSurahSelect = `<select 
                        value={surahName} 
                        onChange={(e) => setSurahName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        {ALL_QURAN_SURAHS.map(s => (
                          <option key={s.id} value={'سورة ' + s.name}>
                            {s.id}. سورة {s.name} ({s.ayahs} آية)
                          </option>
                        ))}
                      </select>`;

html = html.replace(oldTajweedSurahTarget, newTajweedSurahSelect);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully updated public/index.html with Quran Verse Picker!');
