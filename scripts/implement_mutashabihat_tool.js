const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add States for Mutashabihat in App component
const stateHookTarget = `const [selectedSurahNumber, setSelectedSurahNumber] = useState(67);`;

const newMutaStates = `// Mutashabihat interactive linking workbench states
      const [isAddMutaOpen, setIsAddMutaOpen] = useState(false);
      const [mutaCurrentAyahNum, setMutaCurrentAyahNum] = useState(1);
      const [mutaTargetSurahId, setMutaTargetSurahId] = useState(35); // Default: Fatir
      const [mutaTargetAyahNum, setMutaTargetAyahNum] = useState(28);
      const [mutaTargetText, setMutaTargetText] = useState('');
      const [mutaSearchQuery, setMutaSearchQuery] = useState('');
      const [mutaSearchResults, setMutaSearchResults] = useState([]);
      const [isSearchingMuta, setIsSearchingMuta] = useState(false);
      const [mutaGuideNote, setMutaGuideNote] = useState('');
      const [selectedSurahNumber, setSelectedSurahNumber] = useState(67);`;

if (!html.includes('const [isAddMutaOpen, setIsAddMutaOpen] = useState(false);')) {
  html = html.replace(stateHookTarget, newMutaStates);
}

// 2. Add Mutashabihat Helper Functions
const handlerTarget = `// Fetch verified Uthmani Ayahs from cache or API directly`;

const mutaHandlers = `// Search Quran for similar verses without diacritics
      async function handleSearchMutaAyahs() {
        if (!mutaSearchQuery.trim()) return;
        setIsSearchingMuta(true);
        try {
          const res = await fetch('https://api.alquran.cloud/v1/search/' + encodeURIComponent(mutaSearchQuery.trim()) + '/all/quran-simple-clean');
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          const matches = data.data?.matches || [];
          setMutaSearchResults(matches.slice(0, 8)); // Top 8 matches
          if (matches.length === 0) {
            showToast(isRtl ? 'لم يتم العثور على مواضع مطابقة في القرآن' : 'No matching ayahs found');
          }
        } catch(e) {
          console.error('Muta search error:', e);
          showToast(isRtl ? 'تعذر البحث، يرجى التأكد من الاتصال' : 'Search failed, check connection');
        } finally {
          setIsSearchingMuta(false);
        }
      }

      // Select a search match and fetch its exact Uthmani text
      async function handleSelectMutaMatch(match) {
        setMutaTargetSurahId(match.surah.number);
        setMutaTargetAyahNum(match.numberInSurah);
        try {
          const res = await fetch('https://api.alquran.cloud/v1/ayah/' + match.number + '/quran-uthmani');
          const data = await res.json();
          setMutaTargetText(data.data?.text || match.text);
        } catch(e) {
          setMutaTargetText(match.text);
        }
        setMutaSearchResults([]);
      }

      // Fetch target ayah text when manual surah/ayah number changed
      async function handleFetchTargetMutaAyah(surahId, ayahNum) {
        try {
          const res = await fetch('https://api.alquran.cloud/v1/ayah/' + surahId + ':' + ayahNum + '/quran-uthmani');
          const data = await res.json();
          if (data.data?.text) {
            setMutaTargetText(data.data.text);
          }
        } catch(e) {
          console.error(e);
        }
      }

      // Save new Mutashabiha into current lesson
      function handleSaveNewMutashabiha() {
        const curAyah = hifzAyahs.find(a => a.num === mutaCurrentAyahNum) || hifzAyahs[0];
        const targetSurahObj = ALL_QURAN_SURAHS.find(s => s.id === mutaTargetSurahId) || ALL_QURAN_SURAHS[0];
        
        const currentText = (curAyah ? curAyah.text : '') + ' (' + hifzSurahName + ': ' + mutaCurrentAyahNum + ')';
        const targetText = (mutaTargetText || 'آية ' + mutaTargetAyahNum) + ' (سورة ' + targetSurahObj.name + ': ' + mutaTargetAyahNum + ')';
        const guide = mutaGuideNote.trim() || (isRtl ? 'انتبه للفارق اللفظي بين الموضعين لتثبيت الحفظ.' : 'Notice the verbal difference to secure memorization.');

        const newEntry = {
          ayah: currentText,
          similar: targetText,
          difference: guide
        };

        const updated = [...(hifzMutashabihat || []), newEntry];
        setHifzMutashabihat(updated);
        setIsAddMutaOpen(false);
        setMutaGuideNote('');
        setMutaTargetText('');
        setMutaSearchResults([]);
        showToast(isRtl ? 'تم حفظ المتشابهة وإدراجها في خطة المدارسة بنجاح ✨' : 'Mutashabiha added to lesson plan ✨');
      }

      // Delete Mutashabiha
      function handleDeleteMutashabiha(idx) {
        const updated = (hifzMutashabihat || []).filter((_, i) => i !== idx);
        setHifzMutashabihat(updated);
        showToast(isRtl ? 'تم حذف المتشابهة' : 'Mutashabiha removed');
      }

      // Fetch verified Uthmani Ayahs from cache or API directly`;

if (!html.includes('handleSearchMutaAyahs')) {
  html = html.replace(handlerTarget, mutaHandlers);
}

// 3. Update the Mutashabihat JSX Section
const oldMutaHeader = `<div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-900/10">
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
                  </div>`;

const newMutaHeader = `<div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-900/10">
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
                      <span>{isRtl ? (isAddMutaOpen ? 'إغلاق نافذة الإضافة' : 'إضافة أو ربط متشابهة جديدة لهذا المقطع') : (isAddMutaOpen ? 'Close' : 'Link New Mutashabiha')}</span>
                    </button>
                  </div>

                  {/* Add Mutashabiha Drawer / Workbench */}
                  {isAddMutaOpen && (
                    <div className="mb-6 bg-white/95 border-2 border-emerald-700/40 rounded-2xl p-5 shadow-lg animate-fadeIn text-slate-800">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                          <span>🔗</span>
                          <span>{isRtl ? 'إدراج متشابهة لفظية خاصة بالدرس وتوجيه المعلم للدارس' : 'Add Custom Mutashabiha & Guidance Note'}</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                          {isRtl ? 'بدون كتابة يدوية صيانةً للنص القرآني' : 'Verified Script Preserved'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* 1. Current Lesson Ayah */}
                        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                          <label className="block text-xs font-bold text-emerald-900 mb-1.5">
                            {isRtl ? '1. اختر الآية من مقطع درسك الحالي:' : '1. Ayah from current lesson:'}
                          </label>
                          <select
                            value={mutaCurrentAyahNum}
                            onChange={(e) => setMutaCurrentAyahNum(parseInt(e.target.value))}
                            className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-950 mb-2 focus:ring-2 focus:ring-emerald-600"
                          >
                            {(hifzAyahs || []).map(a => (
                              <option key={a.num} value={a.num}>
                                الآية {a.num}: {a.text ? a.text.substring(0, 45) + '...' : ''}
                              </option>
                            ))}
                          </select>
                          <div className="p-2 bg-white rounded-lg border border-emerald-200/80 font-quran text-sm text-emerald-950 leading-relaxed max-h-24 overflow-y-auto" dir="rtl">
                            {(() => {
                              const a = (hifzAyahs || []).find(x => x.num === mutaCurrentAyahNum);
                              return a ? a.text : '';
                            })()}
                          </div>
                        </div>

                        {/* 2. Target Similar Ayah from anywhere in Quran */}
                        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                          <label className="block text-xs font-bold text-amber-900 mb-1.5">
                            {isRtl ? '2. حدد الآية المتشابهة معها في القرآن:' : '2. Target similar ayah in Quran:'}
                          </label>

                          {/* Quick Keyword Search in Quran */}
                          <div className="flex gap-1.5 mb-2">
                            <input
                              type="text"
                              value={mutaSearchQuery}
                              onChange={(e) => setMutaSearchQuery(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchMutaAyahs(); }}
                              placeholder={isRtl ? 'ابحث بكلمة من الآية المتشابهة (مثال: عزيز غفور)...' : 'Search phrase in Quran...'}
                              className="flex-1 bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-amber-500"
                            />
                            <button
                              type="button"
                              onClick={handleSearchMutaAyahs}
                              disabled={isSearchingMuta}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <span>{isSearchingMuta ? '⏳' : '🔍'}</span>
                              <span>{isRtl ? 'بحث' : 'Search'}</span>
                            </button>
                          </div>

                          {/* Search Results Dropdown List */}
                          {mutaSearchResults.length > 0 && (
                            <div className="mb-2 bg-white border border-amber-300 rounded-lg max-h-36 overflow-y-auto divide-y divide-amber-100 shadow-sm">
                              {mutaSearchResults.map((m, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectMutaMatch(m)}
                                  className="w-full text-right p-2 hover:bg-amber-50 transition block text-[11px] leading-snug"
                                  dir="rtl"
                                >
                                  <span className="font-bold text-amber-900 block">
                                    📖 {m.surah.name} (آية {m.numberInSurah}):
                                  </span>
                                  <span className="text-slate-700 font-quran">{m.text}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Or Select by Surah and Ayah Number */}
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <select
                                value={mutaTargetSurahId}
                                onChange={(e) => {
                                  const sid = parseInt(e.target.value);
                                  setMutaTargetSurahId(sid);
                                  handleFetchTargetMutaAyah(sid, mutaTargetAyahNum);
                                }}
                                className="w-full bg-white border border-amber-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                              >
                                {ALL_QURAN_SURAHS.map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.id}. سورة {s.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-amber-900">{isRtl ? 'آية:' : 'Ayah:'}</span>
                              <input
                                type="number"
                                min={1}
                                max={(() => { const s = ALL_QURAN_SURAHS.find(x => x.id === mutaTargetSurahId); return s ? s.ayahs : 286; })()}
                                value={mutaTargetAyahNum}
                                onChange={(e) => {
                                  const num = parseInt(e.target.value) || 1;
                                  setMutaTargetAyahNum(num);
                                  handleFetchTargetMutaAyah(mutaTargetSurahId, num);
                                }}
                                className="w-16 bg-white border border-amber-300 rounded-lg px-2 py-1 text-xs font-bold text-center"
                              />
                            </div>
                          </div>

                          {/* Display target Ayah Uthmani preview */}
                          <div className="p-2 bg-white rounded-lg border border-amber-200/80 font-quran text-sm text-amber-950 leading-relaxed max-h-24 overflow-y-auto" dir="rtl">
                            {mutaTargetText || (isRtl ? 'اختر أو ابحث عن الآية المتشابهة لتظهر هنا بالرسم العثماني...' : 'Select ayah...')}
                          </div>
                        </div>
                      </div>

                      {/* 3. Teacher Guidance & Memorization Tip */}
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
                  )}`;

if (html.includes(oldMutaHeader)) {
  html = html.replace(oldMutaHeader, newMutaHeader);
}

// 4. Add delete button to each Mutashabiha card
const oldMutaCard = `<div className="bg-emerald-950/5 p-2.5 rounded-xl text-xs text-emerald-900 font-medium flex items-start gap-1.5">
                            <span className="text-gold-600 font-bold text-sm">💡</span>
                            <span><strong>{isRtl ? 'ضابط حفظ المتشابهة للمحفظ:' : 'Memorization Guide:'}</strong> {m.difference}</span>
                          </div>`;

const newMutaCard = `<div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-950/5 p-2.5 rounded-xl text-xs text-emerald-900 font-medium">
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
                          </div>`;

html = html.replace(oldMutaCard, newMutaCard);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully implemented Mutashabihat Interactive Linking Workbench!');
