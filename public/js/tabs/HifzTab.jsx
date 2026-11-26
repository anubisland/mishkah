    // HifzTab: the "hifz" screen, moved out of App unchanged.
    // Every App value it reads arrives as a prop of the same name.
    function HifzTab({ studentScreenOpen, activeRepeatAyah, activeRulerLine, customMaskedWords, handleActivatePassageTest, handleDeleteMutashabiha, handleFetchTargetMutaAyah, handleNavigateMushafPage, handlePassageVerdict, handleSaveNewMutashabiha, handleSearchMutaAyahs, handleSelectMutaMatch, hifzAyahRange, hifzAyahs, hifzMutashabihat, hifzSurahName, hifzViewMode, hifzWorksheetModalOpen, isAddMutaOpen, isAlternatingMasked, isDivineNamesMasked, isEndingsMasked, isFetchingQuran, isFullMasked, isReverseOrder, isRtl, isSearchingMuta, isStartersMasked, mushafCurrentSurahId, mushafOverlayMode, mushafPageNumber, mutaGuideNote, mutaSearchQuery, mutaSearchResults, mutaTargetAyahNum, mutaTargetSurahId, mutaTargetText, passageMaskedAyahs, passageRetryCount, passageStatus, passageTestSection, quranFontSize, repeatCount, repeatTarget, revealedAyahSet, setActiveRepeatAyah, setActiveRulerLine, setCustomMaskedWords, setHifzViewMode, setHifzWorksheetModalOpen, setIsAddMutaOpen, setIsAlternatingMasked, setIsDivineNamesMasked, setIsEndingsMasked, setIsFullMasked, setIsReverseOrder, setIsStartersMasked, setMaskedMushafLines, setMushafOverlayMode, setMutaGuideNote, setMutaSearchQuery, setPassageMaskedAyahs, setPassageTestSection, setQuranFontSize, setRepeatCount, setRepeatTarget, setRevealedAyahSet, showToast, toggleRevealAyah, toggleWordMask }) {
      const recitationMasks = {
        isEndingsMasked, isStartersMasked, isDivineNamesMasked, isAlternatingMasked, isFullMasked,
        revealedAyahs: revealedAyahSet, customMaskedWords, passageMaskedAyahs, passageStatus
      };

      return (
        <div className="space-y-6 animate-fadeIn">
                
                {/* Header Banner */}
                <div className="emerald-pattern rounded-3xl p-3 sm:p-4 text-white relative overflow-hidden border-2 border-gold-400 shadow-xl">
                  <div className="absolute top-2.5 right-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="absolute top-2.5 left-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="relative z-10 max-w-4xl">
                    <h2 className="text-lg sm:text-xl font-bold font-cairo text-gold-200 mb-1.5">
                      {isRtl ? 'مدارسة مصحف المدينة واختبارات الإتقان التفاعلية' : 'Madinah Mushaf Visuals & Interactive Testing'}
                    </h2>

                    {/* Authentic Mode Switcher Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-800/80">
                      <div className="bg-emerald-950 p-1.5 rounded-2xl border-2 border-gold-400 flex items-center gap-2 shadow-lg">
                        {/* 1. Printed Mushaf Page (Primary Default) */}
                        <button
                          type="button"
                          onClick={() => {
                            setHifzViewMode('mushaf_page');
                            handleNavigateMushafPage(mushafPageNumber);
                          }}
                          className={'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ' + (
                            hifzViewMode === 'mushaf_page'
                              ? 'bg-gold-500 text-emerald-950 shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:bg-emerald-900/60'
                          )}
                        >
                          <span>📖</span>
                          <span>{isRtl ? 'عرض وجه المصحف الورقي المصور' : 'Printed Mushaf Page Image'}</span>
                        </button>

                        {/* 2. Digital Recitation Board */}
                        <button
                          type="button"
                          onClick={() => {
                            setHifzViewMode('interactive_test');
                            handleNavigateMushafPage(mushafPageNumber);
                          }}
                          className={'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ' + (
                            hifzViewMode === 'interactive_test'
                              ? 'bg-gold-500 text-emerald-950 shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:bg-emerald-900/60'
                          )}
                        >
                          <span>📜</span>
                          <span>{isRtl ? 'لوحة التسميع بالأسطر والآيات (الأسطر المتقنة)' : 'Digital Line Recitation Board'}</span>
                        </button>
                      </div>

                      {/* Quick Shortcut Buttons in Header (Synchronized across both modes) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setHifzWorksheetModalOpen(true)}
                          className="bg-emerald-900 hover:bg-emerald-850 text-gold-200 border border-gold-400/70 px-3 py-1.5 rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                          title={isRtl ? 'عرض وطباعة سجل المتابعة والتقييم الأسبوعي لحلقة التحفيظ' : 'View and print weekly Hifz evaluation sheet'}
                        >
                          <span>📝</span>
                          <span>{isRtl ? 'سجل متابعة التحفيظ (PDF)' : 'Hifz Evaluation Sheet (PDF)'}</span>
                        </button>
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
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                              mushafPageNumber === lm.p
                                ? 'bg-gold-500 text-emerald-950 border-gold-300 font-black ring-1 ring-gold-400'
                                : 'bg-emerald-900/80 hover:bg-emerald-800 text-gold-200 border-emerald-700'
                            }`}
                          >
                            {lm.name} ({lm.p})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= AUTHENTIC PRINTED MADINAH MUSHAF PAGE ================= */}
                {hifzViewMode === 'mushaf_page' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Navigation Bar for Mushaf Page (Mode 1 - Fully Synchronized) */}
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
                                {s.id}. {isRtl ? 'سورة ' + s.name : 'Surah ' + (s.englishName || s.name)} ({isRtl ? 'صفحة ' : 'Page '} {s.startPage})
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

                        {/* Interactive Testing Toolbar Directly on Printed Mushaf Page */}
                        <div className="mb-4 bg-emerald-950/5 border border-gold-400/50 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg">🛠️</span>
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-emerald-950 font-cairo block">
                                {isRtl ? 'أدوات اختبار الحفظ المباشرة على وجه المصحف:' : 'Mushaf Testing Tools:'}
                              </span>
                              <span className="text-[11px] text-slate-500 hidden sm:block">
                                {isRtl ? 'أقنعة ومساطر تفاعلية لتسميع الوجه سطراً بسطر أو حجب أجزاء منه' : 'Interactive masks and rulers directly on page'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {/* 1. Ruler mode */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'ruler' ? 'none' : 'ruler');
                                setActiveRulerLine(1);
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'ruler' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>📏</span>
                              <span>{isRtl ? 'المسطرة الكاشفة (سطراً بسطر)' : 'Line Ruler'}</span>
                            </button>

                            {/* 2. Mask bottom half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_bottom' ? 'none' : 'mask_bottom')}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_bottom' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔻</span>
                              <span>{isRtl ? 'حجب النصف الأسفل (8-15)' : 'Mask Bottom'}</span>
                            </button>

                            {/* 3. Mask top half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_top' ? 'none' : 'mask_top')}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_top' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔺</span>
                              <span>{isRtl ? 'حجب النصف الأعلى (1-7)' : 'Mask Top'}</span>
                            </button>

                            {/* 4. Spotlight */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'spotlight' ? 'none' : 'spotlight');
                                setActiveRulerLine(1);
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'spotlight' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>💡</span>
                              <span>{isRtl ? 'كشاف تركيز السطر' : 'Spotlight'}</span>
                            </button>



                            {/* Reset Button */}
                            {mushafOverlayMode !== 'none' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMushafOverlayMode('none');
                                  setMaskedMushafLines(new Set());
                                }}
                                className="px-2.5 py-1.5 rounded-xl font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>{isRtl ? 'عرض المصحف كاملاً' : 'Full Page'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Ruler Controls (When ruler or spotlight active) */}
                        {(mushafOverlayMode === 'ruler' || mushafOverlayMode === 'spotlight') && (
                          <div className="mb-3 bg-amber-50/90 border border-gold-400 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-900 font-bold text-xs sm:text-sm">
                                📌 {isRtl ? 'السطر النشط:' : 'Active Line:'}
                              </span>
                              <span className="bg-emerald-900 text-gold-200 px-3 py-1 rounded-xl text-xs sm:text-sm font-black shadow-xs">
                                {isRtl ? 'السطر ' + activeRulerLine + ' من 15' : 'Line ' + activeRulerLine + ' of 15'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={activeRulerLine >= 15}
                                onClick={() => setActiveRulerLine(Math.min(15, activeRulerLine + 1))}
                                className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬇️</span>
                                <span>{isRtl ? 'كشف السطر التالي' : 'Next Line'}</span>
                              </button>

                              <button
                                type="button"
                                disabled={activeRulerLine <= 1}
                                onClick={() => setActiveRulerLine(Math.max(1, activeRulerLine - 1))}
                                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬆️</span>
                                <span>{isRtl ? 'حجب السطر السابق' : 'Prev Line'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveRulerLine(1)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
                                title="إعادة من أول سطر"
                              >
                                🔁 {isRtl ? 'البداية' : 'Start'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* The High-Resolution 15-Line Page Image with Authentic Overlays */}
                        <div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center relative overflow-hidden select-none">
                          <div className="relative inline-block w-full max-w-3xl">
                            <img
                              key={mushafPageNumber}
                              src={mushafPageImageUrl(mushafPageNumber)}
                              alt={'مصحف المدينة النبوية — صفحة ' + mushafPageNumber}
                              className="w-full h-auto block mx-auto bg-white filter contrast-110 drop-shadow-sm select-none"
                              loading="eager"
                              style={{ minHeight: '500px' }}
                            />

                            <MushafMaskOverlay mushafOverlayMode={mushafOverlayMode} activeRulerLine={activeRulerLine} isRtl={isRtl} dimmed={studentScreenOpen} />


                          </div>
                        </div>

                        {/* Bottom Mushaf Footer (Twin Synchronized with Recitation Board) */}
                        <div className="flex justify-between items-center pt-3 mt-4 border-t-2 border-gold-500/70 text-xs sm:text-sm font-bold text-emerald-950">
                          <button
                            type="button"
                            onClick={() => {
                              const p = Math.min(604, mushafPageNumber + 1);
                              handleNavigateMushafPage(p);
                            }}
                            disabled={mushafPageNumber >= 604}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold shadow-xs cursor-pointer"
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
                              handleNavigateMushafPage(p);
                            }}
                            disabled={mushafPageNumber <= 1}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold shadow-xs cursor-pointer"
                          >
                            <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                            <span>⬅️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= MODE B: DEPRECATED LEGACY DIGITAL TEXT (DISABLED) ================= */}
                {hifzViewMode === 'interactive_test' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Live Recitation Controls Ribbon */}
                    <div className="card-islamic-amber rounded-3xl p-5 shadow-sm border border-gold-400/60">
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
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isEndingsMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'طمس آخر كلمتين لاختبار حفظ فواصل الآيات' : 'Mask Endings'}
                        >
                          <span className="text-base">{isEndingsMasked ? '🙈' : '👁️'}</span>
                          <span>{isRtl ? (isEndingsMasked ? 'إظهار آخر الآيات' : 'إخفاء آخر كل آية') : 'Mask Endings'}</span>
                        </button>

                        {/* 2. Mask Starters (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsStartersMasked(!isStartersMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isStartersMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'طمس أول كلمتين لاختبار استحضار مطالع الآيات وترابطها' : 'Mask Starters'}
                        >
                          <span className="text-base">🔀</span>
                          <span>{isRtl ? (isStartersMasked ? 'إظهار أول الآيات' : 'إخفاء أول كل آية') : 'Mask Starters'}</span>
                        </button>

                        {/* 3. Mask Divine Attributes (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsDivineNamesMasked(!isDivineNamesMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isDivineNamesMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'طمس أسماء الله وصفاته في الفواصل لمنع الخلط الشائع' : 'Mask Divine Attributes'}
                        >
                          <span className="text-base">👑</span>
                          <span>{isRtl ? (isDivineNamesMasked ? 'إظهار أسماء الله' : 'إخفاء أسماء الله في خواتيم الآيات') : 'Divine Names'}</span>
                        </button>

                        {/* 4. Alternating Lines (Line by Line) */}
                        <button
                          type="button"
                          onClick={() => {
                            if (passageMaskedAyahs.size > 0 && passageTestSection === 'alternate_lines') {
                              setPassageTestSection('none');
                              setPassageMaskedAyahs(new Set());
                            } else {
                              const altNums = hifzAyahs.filter((_, idx) => idx % 2 === 1).map(a => a.num);
                              setPassageTestSection('alternate_lines');
                              setPassageMaskedAyahs(new Set(altNums));
                            }
                          }}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            passageTestSection === 'alternate_lines'
                              ? 'bg-gold-500 text-emerald-950 border-gold-600 ring-2 ring-gold-400 font-black shadow-md'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'حجب سطر وسطر بدقة 100% دون أي تقطيع في الحروف' : 'Alternate Lines'}
                        >
                          <span className="text-base">🌓</span>
                          <span>{isRtl ? (passageTestSection === 'alternate_lines' ? 'إظهار كل الآيات' : 'إخفاء آية وترك آية') : 'Alternate Lines'}</span>
                        </button>

                        {/* 4b. Alternating 50% Cloze */}
                        <button
                          type="button"
                          onClick={() => setIsAlternatingMasked(!isAlternatingMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isAlternatingMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'إخفاء كلمة وترك كلمة لتحفيز اليقظة العقلية الفائقة' : 'Alternating 50% Cloze'}
                        >
                          <span className="text-base">🏁</span>
                          <span>{isRtl ? (isAlternatingMasked ? 'إظهار كل الكلمات' : 'إخفاء كلمة وترك كلمة') : 'Cloze 50%'}</span>
                        </button>

                        {/* 5. Reverse Order Recitation (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsReverseOrder(!isReverseOrder)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isReverseOrder
                              ? 'bg-emerald-800 text-gold-300 border-emerald-900 ring-2 ring-emerald-500 font-black'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                          }`}
                          title={isRtl ? 'عرض الآيات من الأسفل للأعلى لاختبار الحفظ الصارم' : 'Reverse Order Test'}
                        >
                          <span className="text-base">🔄</span>
                          <span>{isRtl ? (isReverseOrder ? 'الترتيب الأصلي' : 'التسميع من آخر الصفحة') : 'Reverse Order'}</span>
                        </button>

                        {/* 6. Full Blind Recitation */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsFullMasked(!isFullMasked);
                            setRevealedAyahSet(new Set([1]));
                          }}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isFullMasked
                              ? 'bg-emerald-800 text-gold-300 border-emerald-900 ring-2 ring-emerald-500 font-black'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                          }`}
                          title={isRtl ? 'إخفاء كامل للآيات مع النقر لكشف أي كلمة أو آية' : 'Full Blind Recitation'}
                        >
                          <span className="text-base">{isFullMasked ? '📖' : '🔒'}</span>
                          <span>{isRtl ? (isFullMasked ? 'إظهار الصفحة كلها' : 'إخفاء الصفحة كلها (تسميع غيبي)') : 'Blind Mode'}</span>
                        </button>

                      </div>

                      
                      {/* Passage-Based Testing Ribbon (Start, Middle, End) */}
                      <div className="mt-4 pt-3.5 border-t border-amber-900/15">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                            <span className="text-base">📑</span>
                            <span>{isRtl ? 'اختبار المقاطع القرآنية بالصفحة (حجب مقطع وتسميعه مع تحكيم المعلم):' : 'Passage-Based Recitation Tests:'}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            {isRtl ? 'يتم حجب المقطع، فإن أتقنه تنقر [✅ قالها صح] ليظهر، وإن أخطأ تنقر [⚠️ قالها غلط] ليعيده' : 'Hide passage, verify, and reveal'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {/* 1. Start Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('start')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'start'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🟢</span>
                            <span>{isRtl ? 'مقطع بداية الصفحة' : 'Start Passage'}</span>
                          </button>

                          {/* 2. Middle Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('middle')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'middle'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🟡</span>
                            <span>{isRtl ? 'مقطع وسط الصفحة' : 'Middle Passage'}</span>
                          </button>

                          {/* 3. End Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('end')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'end'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🔴</span>
                            <span>{isRtl ? 'مقطع ختام الصفحة' : 'End Passage'}</span>
                          </button>

                          {/* Reset / Status */}
                          {passageTestSection !== 'none' ? (
                            <button
                              type="button"
                              onClick={() => handlePassageVerdict('reset')}
                              className="p-2.5 rounded-xl font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 transition flex items-center justify-center gap-1"
                            >
                              <span>✕</span>
                              <span>{isRtl ? 'إلغاء اختبار المقاطع' : 'Cancel Test'}</span>
                            </button>
                          ) : (
                            <div className="text-[11px] text-slate-500 flex items-center justify-center text-center p-1 font-medium bg-amber-50/50 rounded-xl border border-dashed border-amber-300">
                              {isRtl ? '💡 اختر مقطعاً لبدء التسميع' : 'Select a passage to test'}
                            </div>
                          )}
                        </div>
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
                    </div>

                    {/* Quranic Ayahs Board with Clickable Words */}
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-900/20 relative">
                      
                      {/* Mode 2 Synchronized Quran Page Navigator (Full 604-Page Freedom & Twin Sync) */}
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
                              onClick={() => {
                                setHifzViewMode('mushaf_page');
                                handleNavigateMushafPage(mushafPageNumber);
                              }}
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
                      {/* Active Passage Arbitration Panel */}
                      {passageTestSection !== 'none' && (
                        <div className="w-full mb-6 p-4 sm:p-5 rounded-2xl border-2 shadow-md bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border-gold-400/80 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-900/15">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl sm:text-3xl">🎙️</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-cairo font-black text-sm sm:text-base text-emerald-950">
                                    {isRtl ? 'مقطع التسميع النشط: ' : 'Active Passage: '}
                                    {passageTestSection === 'start' && (isRtl ? 'بداية الصفحة' : 'Start of Page')}
                                    {passageTestSection === 'middle' && (isRtl ? 'وسط الصفحة' : 'Middle of Page')}
                                    {passageTestSection === 'end' && (isRtl ? 'ختام الصفحة' : 'End of Page')}
                                  </span>
                                  <span className="bg-emerald-900 text-gold-300 text-xs font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    {isRtl ? 'الآيات (' + Array.from(passageMaskedAyahs).join(', ') + ')' : 'Ayahs (' + Array.from(passageMaskedAyahs).join(', ') + ')'}
                                  </span>
                                </div>
                                
                                {/* Dynamic Status Text */}
                                <div className="text-xs mt-1 font-bold">
                                  {passageStatus === 'reciting' && (
                                    <span className="text-amber-800 animate-pulse flex items-center gap-1">
                                      <span>🎧</span>
                                      <span>{isRtl ? 'الشيخ يستمع لتسميع الطالب... اضغط [قالها صح] لإظهارها أو [قالها غلط] لإعادتها' : 'Listening to student...'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'correct' && (
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <span>✨</span>
                                      <span>{isRtl ? 'ما شاء الله! قراءة صحيحة ومتقنة — تم إظهار المقطع بنجاح' : 'Mastered! Revealed'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'error_retry' && (
                                    <span className="text-rose-800 flex items-center gap-1">
                                      <span>⚠️</span>
                                      <span>{isRtl ? 'وقع خطأ أثناء التسميع (المحاولة ' + passageRetryCount + ') — على الطالب إعادة المقطع مرة أخرى لتثبيته!' : 'Mistake! Student must retry'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'revealed_for_review' && (
                                    <span className="text-blue-800 flex items-center gap-1">
                                      <span>📖</span>
                                      <span>{isRtl ? 'تم إظهار المقطع لتصحيح الخطأ والمراجعة في المصحف' : 'Revealed for review'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div className="flex items-center gap-1.5 text-xs">
                              {passageStatus === 'reciting' && (
                                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-bold shadow-xs">
                                  🔒 {isRtl ? 'محجوب للتسميع' : 'Masked'}
                                </span>
                              )}
                              {passageStatus === 'correct' && (
                                <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black shadow-xs flex items-center gap-1">
                                  ✅ {isRtl ? 'متقن ومُظهر' : 'Mastered'}
                                </span>
                              )}
                              {passageStatus === 'error_retry' && (
                                <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-900 font-black shadow-xs flex items-center gap-1 animate-bounce">
                                  ⚠️ {isRtl ? 'مطلوب الإعادة' : 'Retry'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Teacher Live Verdict Buttons (Exact User Feature) */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* 1. Said Correctly Button */}
                              <button
                                type="button"
                                onClick={() => handlePassageVerdict('correct')}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 border border-emerald-800 cursor-pointer"
                              >
                                <span>✅</span>
                                <span>{isRtl ? 'قالها صح (إظهار المقطع)' : 'Correct (Reveal)'}</span>
                              </button>

                              {/* 2. Said with Mistake Button */}
                              <button
                                type="button"
                                onClick={() => handlePassageVerdict('error')}
                                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 border border-rose-800 cursor-pointer"
                              >
                                <span>⚠️</span>
                                <span>{isRtl ? 'قالها غلط (إعادة المقطع)' : 'Mistake (Retry)'}</span>
                              </button>

                              {/* 3. If in Retry mode: reveal for review or confirm correct after retry */}
                              {passageStatus === 'error_retry' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handlePassageVerdict('correct')}
                                    className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>🔁</span>
                                    <span>{isRtl ? 'أتقن بعد الإعادة (إظهار)' : 'Mastered after Retry'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handlePassageVerdict('reveal_review')}
                                    className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>👁️</span>
                                    <span>{isRtl ? 'إظهار للتصحيح والمراجعة' : 'Reveal for Review'}</span>
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Reset Button */}
                            <button
                              type="button"
                              onClick={() => handlePassageVerdict('reset')}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              ✕ {isRtl ? 'إنهاء اختبار المقطع' : 'Close'}
                            </button>
                          </div>
                        </div>
                      )}

{/* Repetition Loop Counter */}
                        <div className="flex items-center gap-2 bg-emerald-950 text-gold-200 rounded-xl px-3 py-1.5 border border-gold-400/40 text-xs shadow-sm">
                          <span>🔁 {isRtl ? 'عدد مرات التكرار:' : 'Loop:'}</span>
                          <div className="flex items-center gap-1">
                            {[3, 5, 7].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => { setRepeatTarget(num); setRepeatCount(0); }}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  repeatTarget === num ? 'bg-gold-500 text-emerald-950 font-black' : 'text-emerald-300 hover:text-white'
                                }`}
                              >
                                {num} مرات
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
                            {isRtl ? '✓ قراءة واحدة' : '+1'}
                          </button>
                        </div>
                      </div>

                      {/* Basmalah */}
                      {shouldShowBasmalah(hifzSurahName, hifzAyahs) && (
                      <div className="text-center font-quran text-2xl text-emerald-900 mb-8 py-2 select-none border-b border-gold-400/20 max-w-md mx-auto">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      )}

                      {/* Ayahs List */}
                      <div className="space-y-3 sm:space-y-4">
                        {(isReverseOrder ? [...hifzAyahs].reverse() : hifzAyahs).map((ayah) => {
                          const words = ayah.text.split(' ');
                          const { isRevealed, isPassageHidden } = recitationAyahVisibility(ayah.num, recitationMasks);
                          // With the student screen open, the teacher keeps reading hidden ayahs under a veil.
                          const teacherSeesHidden = !isRevealed && studentScreenOpen;

                          return (
                            <div 
                              key={ayah.num}
                              className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 bg-white border-2 border-emerald-900/15 shadow-sm hover:border-gold-500/50 ${
                                activeRepeatAyah === ayah.num 
                                  ? 'ring-2 ring-gold-400' 
                                  : ''
                              }`}
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
                                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                                      activeRepeatAyah === ayah.num 
                                        ? 'bg-gold-500 text-emerald-950 font-black' 
                                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                  >
                                    <span>🔁</span>
                                    <span>{isRtl ? 'تركيز التكرار' : 'Focus'}</span>
                                  </button>

                                  {isFullMasked && (
                                    <button
                                      type="button"
                                      onClick={() => toggleRevealAyah(ayah.num)}
                                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                                        isRevealed 
                                          ? 'bg-emerald-100 text-emerald-900' 
                                          : 'bg-emerald-900 text-gold-300 font-black shadow'
                                      }`}
                                    >
                                      <span>{isRevealed ? '🙈 إخفاء' : '👁️ كشف للطالب'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {!isRevealed && !teacherSeesHidden ? (
                                isPassageHidden ? (
                                  <div className={'p-6 sm:p-8 rounded-2xl text-center border-2 transition-all select-none ' + (
                                    passageStatus === 'error_retry'
                                      ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-md ring-2 ring-rose-300'
                                      : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-inner'
                                  )}>
                                    <span className="text-3xl sm:text-4xl block mb-2">
                                      {passageStatus === 'error_retry' ? '⚠️' : '🔒'}
                                    </span>
                                    <div className="font-cairo font-black text-sm sm:text-base">
                                      {passageStatus === 'error_retry'
                                        ? (isRtl ? 'وقع خطأ في الآية (' + ayah.num + ') — أعد قراءتها الآن مرة أخرى!' : 'Mistake in Ayah (' + ayah.num + ') — Recite again!')
                                        : (isRtl ? 'الآية (' + ayah.num + ') محجوبة ضمن مقطع التسميع والاختبار' : 'Ayah (' + ayah.num + ') Masked in Passage')}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1 font-medium">
                                      {passageStatus === 'error_retry'
                                        ? (isRtl ? 'لا يتم إظهار الآية حتى يعيد الطالب تلاوتها وتصحيح الخطأ' : 'Student must re-recite before reveal')
                                        : (isRtl ? 'يقرأها الطالب غيباً — انقر زر [✅ قالها صح] بالأعلى لإظهارها أو [⚠️ قالها غلط] لإعادتها' : 'Recited from memory')}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="py-6 text-center text-slate-400 font-amiri text-lg border-2 border-dashed border-emerald-900/20 rounded-xl bg-emerald-950/5 select-none">
                                    🔒 {isRtl ? 'الآية مخفية للتسميع الغيبي — اضغط "كشف للطالب" عند إتمام القراءة' : 'Ayah hidden for blind recitation'}
                                  </div>
                                )
                              ) : (
                                <div className={'font-quran font-bold text-black text-right flex flex-wrap gap-x-2 gap-y-2 items-baseline select-none ' + (teacherSeesHidden ? 'opacity-40 border-2 border-dashed border-amber-500 rounded-xl p-2 ' : '') + (
                                  quranFontSize === 'small' 
                                    ? 'text-lg sm:text-xl leading-[2.0]' 
                                    : quranFontSize === 'large' 
                                      ? 'text-2xl sm:text-3xl leading-[2.4]' 
                                      : 'text-xl sm:text-2xl leading-[2.2]'
                                )}>
                                  {words.map((word, wIdx) => {
                                    const isMasked = isRecitationWordMasked(ayah.num, words, wIdx, recitationMasks);

                                    return (
                                      <span
                                        key={wIdx}
                                        onClick={() => toggleWordMask(ayah.num, wIdx)}
                                        className={`px-1.5 py-0.5 rounded-lg cursor-pointer transition-all ${
                                          isMasked && studentScreenOpen
                                            ? 'bg-amber-200/80 text-amber-950 border-b-2 border-dashed border-amber-600'
                                          : isMasked
                                            ? 'bg-amber-200 text-amber-950 border-b-2 border-dashed border-amber-600 px-3 font-sans text-base select-none shadow-xs font-bold' 
                                            : 'hover:bg-gold-200 hover:text-emerald-950'
                                        }`}
                                        title={isMasked ? (isRtl ? 'انقر لكشف الكلمة' : 'Click to reveal') : (isRtl ? 'انقر لطمس الكلمة' : 'Click to mask')}
                                      >
                                        {isMasked && !studentScreenOpen ? '[ ... ]' : word}
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
                )}

                {hifzViewMode === 'interactive_test' && (
                  <>
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
                  </>
                )}

                {/* ================= HIFZ BRANCH PRINTABLE EVALUATION WORKSHEET MODAL ================= */}
                    {hifzWorksheetModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
                        <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full border-4 border-gold-400 shadow-2xl p-4 sm:p-8 my-auto relative max-h-[95vh] overflow-y-auto">
                          
                          {/* Top Controls Toolbar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-emerald-900/15 no-print">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🕋</span>
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? HIFZ_BRANCH_WORKSHEET.titleAr : HIFZ_BRANCH_WORKSHEET.titleEn}
                                </h3>
                                <p className="text-xs text-slate-600 font-medium">
                                  {isRtl ? 'سجل تقييم ومتابعة أسبوعي معتمد لحلقات القرآن الكريم وضبط المتشابهات' : 'Official Weekly Quran Memorization & Mutashabihat Evaluation Sheet'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-2 border-gold-400 px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                              >
                                <span>🖨️</span>
                                <span>{isRtl ? 'طباعة السجل / PDF' : 'Print Sheet / PDF'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHifzWorksheetModalOpen(false)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition border border-slate-300 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Worksheet Body */}
                          <div className="space-y-6 text-right font-cairo">
                            <div className="border-b-2 border-emerald-900 pb-4 flex items-center justify-between">
                              <div>
                                <div className="font-amiri text-2xl font-black text-emerald-950">منصة مِشكاة — سجل متابعة وتقييم التحفيظ القرآني</div>
                                <div className="text-xs font-bold text-gold-800">الفرع الأول: التحفيظ ومصحف المدينة النبوية • AnubisLand</div>
                              </div>
                              <div className="text-center p-2 rounded-2xl border-2 border-gold-400 bg-emerald-950 text-gold-200 text-xs font-bold">
                                <div>سجل رسمي أسبوعي</div>
                                <div>حلقات الإتقان ۞</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-300 text-xs font-bold">
                              <div>اسم الحافظ: <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div></div>
                              <div>الحلقة / المسجد: <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div></div>
                              <div>المقدار (السورة/الصفحة): <div className="border-b border-dotted border-slate-400 h-5 mt-1">صفحة {mushafPageNumber}</div></div>
                              <div>التاريخ: <div className="border-b border-dotted border-slate-400 h-5 mt-1">____ / ____ / 2026م</div></div>
                            </div>

                            <div className="border border-slate-300 rounded-2xl overflow-hidden text-xs">
                              <table className="w-full text-right border-collapse">
                                <thead>
                                  <tr className="bg-emerald-950 text-gold-200">
                                    <th className="p-3 font-bold w-12 text-center">#</th>
                                    <th className="p-3 font-bold font-cairo">المحور ومعيار الإتقان</th>
                                    <th className="p-3 font-bold font-cairo w-28 text-center">الدرجة العظمى</th>
                                    <th className="p-3 font-bold font-cairo w-28 text-center">درجة الطالب</th>
                                    <th className="p-3 font-bold font-cairo">ملاحظات الشيخ والمعلم</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {HIFZ_BRANCH_WORKSHEET.criteria.map((cr, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                      <td className="p-3 text-emerald-950">
                                        <div className="font-bold text-xs sm:text-sm">{cr.domain}</div>
                                        <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{cr.description}</div>
                                      </td>
                                      <td className="p-3 text-center font-black text-slate-800 text-sm">{cr.maxScore}</td>
                                      <td className="p-3 text-center font-black text-emerald-900 border-x border-slate-200">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
                                      <td className="p-3 text-slate-500 font-medium border-b border-dotted border-slate-200"></td>
                                    </tr>
                                  ))}
                                  <tr className="bg-emerald-50 font-black text-emerald-950">
                                    <td colSpan="2" className="p-3 text-right">المجموع الكلي النهائي:</td>
                                    <td className="p-3 text-center">100</td>
                                    <td className="p-3 text-center border-x border-emerald-300 text-sm font-black">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
                                    <td className="p-3 text-center text-xs text-gold-800">ختم إجازة الورد الأسبوعي ۞</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="border-t-2 border-emerald-900 pt-4 flex items-center justify-between text-xs font-bold">
                              <div>توقيع المعلم المشرف: _______________________</div>
                              <div>التقدير النهائي: [ ممتاز • جيد جداً • جيد • إعادة تسميع ]</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

              </div>
      );
    }
