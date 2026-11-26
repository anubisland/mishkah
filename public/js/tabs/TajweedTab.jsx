    // TajweedTab: the "tajweed" screen, moved out of App unchanged.
    // Every App value it reads arrives as a prop of the same name.
    function TajweedTab({ activeMakhrajId, activeSuwaydPlateId, atlasCategory, atlasSearch, currentSuwaydLesson, currentZoomSlides, filterMatchesSuwaydLesson, isRtl, metronomeBeat, metronomeCount, metronomePlaying, metronomeSound, metronomeSpeed, plateZoomLevel, playMetronomeTick, setActiveMakhrajId, setActiveSuwaydPlateId, setAtlasCategory, setAtlasSearch, setMetronomeBeat, setMetronomeCount, setMetronomePlaying, setMetronomeSound, setMetronomeSpeed, setPlateZoomLevel, setSuwaydCatalogSubTab, setSuwaydFilterCategory, setSuwaydLessonId, setSuwaydPlateZoomModal, setSuwaydQuizAnswers, setSuwaydQuizModalOpen, setSuwaydQuizSubmitted, setSuwaydSearchQuery, setSuwaydViewMode, setSuwaydWorksheetModalOpen, setSuwaydZoomModalOpen, setSuwaydZoomSlideIndex, setTajweedSubTab, suwaydCatalogSubTab, suwaydFilterCategory, suwaydLessonId, suwaydPlateZoomModal, suwaydQuizAnswers, suwaydQuizModalOpen, suwaydQuizSubmitted, suwaydSearchQuery, suwaydViewMode, suwaydWorksheetModalOpen, suwaydZoomModalOpen, suwaydZoomSlideIndex, tajweedSubTab }) {
      return (
        <div className="space-y-8 animate-fadeIn">

                {/* Branch 2 Sub-Navigation Bar */}
                <div className="card-islamic-amber rounded-2xl p-2.5 sm:p-3 border border-gold-400/60 shadow-sm flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-900 text-gold-300 flex items-center justify-center text-base font-bold shadow-xs">
                      📖
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-emerald-950 font-cairo">
                        {isRtl ? 'حقيبة أدوات التجويد والتحليل الصوتي (Branch 2):' : 'Tajweed & Phonetics Workbench:'}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* SubTab 1: Lessons Catalog */}
                    <button
                      type="button"
                      onClick={() => {
                        setTajweedSubTab('generator');
                        setSuwaydCatalogSubTab('lessons');
                        setSuwaydViewMode('catalog');
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'generator' && suwaydCatalogSubTab === 'lessons'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>📖</span>
                      <span>{isRtl ? '1. فهرس دروس التجويد (' + SUWAYD_TAJWEED_CURRICULUM.length + ' درساً)' : '1. Tajweed Lessons (' + SUWAYD_TAJWEED_CURRICULUM.length + ')'}</span>
                    </button>

                    {/* SubTab 2: 42 Plates Illustrated Atlas */}
                    <button
                      type="button"
                      onClick={() => {
                        setTajweedSubTab('generator');
                        setSuwaydCatalogSubTab('atlas');
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'generator' && suwaydCatalogSubTab === 'atlas'
                          ? 'bg-gold-500 text-emerald-950 border-gold-600 ring-2 ring-gold-300 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>🏛️</span>
                      <span>{isRtl ? `2. أطلس التجويد المصور (${SUWAYD_PLATES.length} لوحة)` : `2. Illustrated Atlas (${SUWAYD_PLATES.length} Plates)`}</span>
                    </button>

                    {/* SubTab 3: Interactive Makhaarij Atlas */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('makhaarij')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'makhaarij'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>🗣️</span>
                      <span>{isRtl ? '3. مخارج الحروف الخمسة' : '3. 5 General Makharij'}</span>
                    </button>

                    {/* SubTab 4: Visual Timing Metronome */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('metronome')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'metronome'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>⏱️</span>
                      <span>{isRtl ? '4. ميزان الأزمنة والحركات' : '4. Timing Metronome'}</span>
                    </button>
                  </div>
                </div>

                {/* ================= SUB-TAB 1: LESSON & SLIDES GENERATOR ================= */}
                {tajweedSubTab === 'generator' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* VIEW 1: LESSONS CATALOG (INDEX) */}
                    {suwaydCatalogSubTab === 'lessons' && suwaydViewMode === 'catalog' && (
                      <div className="space-y-6">
                        {/* Header Banner - Dr. Ayman Suwayd Certified Workbench */}
                        <div className="card-islamic-pearl rounded-3xl p-6 border-2 border-emerald-900/15 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-emerald-900/10">
                            <div className="flex items-center gap-3">
                              <span className="w-12 h-12 rounded-2xl bg-emerald-900 text-gold-300 flex items-center justify-center text-2xl font-black shadow-md border border-gold-400">
                                📖
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'حقيبة التجويد المصور — فهرس الدروس المعتمدة (د. أيمن رشدي سويد)' : 'Illustrated Tajweed Curriculum — Lessons Catalog'}
                                  </h2>
                                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                    {isRtl ? `${SUWAYD_TAJWEED_CURRICULUM.length} درساً موثقاً 100%` : `${SUWAYD_TAJWEED_CURRICULUM.length} Lessons`}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 font-medium mt-1">
                                  {isRtl
                                    ? 'اختر أي درس من الفهرس ليفتح لك في شاشة دراسية مستقلة وكاملة بالشرح المصور، والمتون، والأمثلة العثمانية، والميزان الإيقاعي'
                                    : 'Select any lesson from the catalog to open a dedicated, distraction-free study screen with illustrated anatomy and metronome.'}
                                </p>
                              </div>
                            </div>

                            {/* Hafs badge */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-gold-500/15 text-emerald-950 border border-gold-400 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
                                {isRtl ? 'رواية حفص عن عاصم من طريق الشاطبية' : 'Hafs from Asim via Shatibiyyah'}
                              </span>
                              {/* SubTab Switcher: Lessons Catalog vs Illustrated Atlas */}
                              <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-300 flex items-center text-xs font-bold">
                                <button
                                  type="button"
                                  onClick={() => setSuwaydCatalogSubTab('lessons')}
                                  className={'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ' + (
                                    suwaydCatalogSubTab === 'lessons'
                                      ? 'bg-emerald-900 text-gold-200 font-black shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  )}
                                >
                                  <span>📖</span>
                                  <span>{isRtl ? `فهرس الدروس (${SUWAYD_TAJWEED_CURRICULUM.length})` : `Lessons (${SUWAYD_TAJWEED_CURRICULUM.length})`}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSuwaydCatalogSubTab('atlas')}
                                  className={'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ' + (
                                    suwaydCatalogSubTab === 'atlas'
                                      ? 'bg-gold-500 text-emerald-950 font-black shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  )}
                                >
                                  <span>🏛️</span>
                                  <span>{isRtl ? `أطلس التجويد المصور (${SUWAYD_PLATES.length} لوحة)` : `Illustrated Atlas (${SUWAYD_PLATES.length} Plates)`}</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Category Filter Pills and Instant Search (Shown in Lessons mode) */}
                          {suwaydCatalogSubTab === 'lessons' && (
                            <div className="space-y-3 pt-1">
                              {/* Search Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="relative flex-1 min-w-[240px] max-w-md">
                                  <input
                                    type="text"
                                    value={suwaydSearchQuery}
                                    onChange={(e) => setSuwaydSearchQuery(e.target.value)}
                                    placeholder={isRtl ? '🔍 ابحث في دروس التجويد (مثال: إدغام، مد، قلقلة، إخفاء، راءات)...' : '🔍 Search Tajweed lessons (e.g. Idgham, Madd, Qalqalah)...'}
                                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 shadow-xs"
                                  />
                                  {suwaydSearchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => setSuwaydSearchQuery('')}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                                {suwaydSearchQuery && (
                                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                    {isRtl ? `نتائج البحث: ${SUWAYD_TAJWEED_CURRICULUM.filter(l => filterMatchesSuwaydLesson(suwaydFilterCategory, l, suwaydSearchQuery)).length} درس` : `Results: ${SUWAYD_TAJWEED_CURRICULUM.filter(l => filterMatchesSuwaydLesson(suwaydFilterCategory, l, suwaydSearchQuery)).length}`}
                                  </span>
                                )}
                              </div>

                              {/* Category Filter Pills with Dynamic Counts */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 ml-1">
                                  {isRtl ? 'أبواب التجويد:' : 'Chapters:'}
                                </span>
                                {[
                                  { id: 'all', labelAr: 'كافة أبواب الكتاب', labelEn: 'All Chapters' },
                                  { id: 'makharij', labelAr: 'مخارج الحروف', labelEn: 'Articulation' },
                                  { id: 'sifat', labelAr: 'صفات الحروف والقلقلة', labelEn: 'Sifat & Qalqalah' },
                                  { id: 'noon_meem', labelAr: 'أحكام النون والميم والغنن', labelEn: 'Noon & Meem' },
                                  { id: 'lamat', labelAr: 'اللامات وعلاقات الحروف', labelEn: 'Lamat & Relations' },
                                  { id: 'madd', labelAr: 'أحكام المد والقصر', labelEn: 'Madd Rules' },
                                  { id: 'tafkheem', labelAr: 'التفخيم والترقيق والراءات', labelEn: 'Tafkheem & Tarqeeq' },
                                  { id: 'rasm_waqf', labelAr: 'الوقف والابتداء والهمزات والرسم', labelEn: 'Stop & Waqf & Rasm' },
                                  { id: 'intro_tajweed', labelAr: 'المقدمات واللحن', labelEn: 'Foundations & Lahn' }
                                ].map(cat => {
                                  const count = SUWAYD_TAJWEED_CURRICULUM.filter(l => filterMatchesSuwaydLesson(cat.id, l, suwaydSearchQuery)).length;
                                  return (
                                    <button
                                      key={cat.id}
                                      onClick={() => setSuwaydFilterCategory(cat.id)}
                                      className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ' + (
                                        suwaydFilterCategory === cat.id
                                          ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                      )}
                                    >
                                      <span>{isRtl ? `${cat.labelAr} (${count})` : `${cat.labelEn} (${count})`}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Lessons Grid: Rich, Inviting Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-200/80">
                            {SUWAYD_TAJWEED_CURRICULUM
                              .filter(l => filterMatchesSuwaydLesson(suwaydFilterCategory, l, suwaydSearchQuery))
                              .map(lesson => {
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => {
                                      setSuwaydLessonId(lesson.id);
                                      setSuwaydViewMode('details');
                                      setMetronomeCount(lesson.timingCounts);
                                      setMetronomePlaying(false);
                                      setMetronomeBeat(1);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-gold-400 text-slate-800 transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-900/10 text-emerald-900 border border-emerald-800/20">
                                          {isRtl ? lesson.categoryAr : lesson.categoryEn}
                                        </span>
                                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                          ⏱️ {isRtl ? lesson.timingLabelAr : (lesson.timingLabelEn || lesson.timingLabelAr)}
                                        </span>
                                      </div>
                                      <h4 className="text-base font-black font-cairo leading-snug text-emerald-950 group-hover:text-gold-600 transition">
                                        {isRtl ? lesson.titleAr : lesson.titleEn}
                                      </h4>
                                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-cairo">
                                        {isRtl ? lesson.definitionAr : (lesson.definitionEn || lesson.definitionAr)}
                                      </p>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {lesson.examples?.length || 3} {isRtl ? 'أمثلة عثمانية' : 'Uthmani Examples'}
                                      </span>
                                      <span className="bg-emerald-900 text-gold-200 text-xs font-black px-3 py-1 rounded-xl shadow-xs group-hover:bg-gold-500 group-hover:text-emerald-950 transition flex items-center gap-1">
                                        <span>{isRtl ? 'فتح الدرس' : 'Open Lesson'}</span>
                                        <span>⬅️</span>
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}

                    
                    {/* VIEW 3: FULL ILLUSTRATED TAJWEED ATLAS */}
                    {suwaydCatalogSubTab === 'atlas' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Atlas Header & Search */}
                        <div className="card-islamic-pearl rounded-3xl p-6 border-2 border-gold-400 shadow-md">
                          
                          {/* Navigation Bar inside Atlas: Quick Return to Lessons Catalog */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-gold-400/40 bg-gold-50/60 p-3 rounded-2xl">
                            <button
                              type="button"
                              onClick={() => {
                                setSuwaydCatalogSubTab('lessons');
                                setSuwaydViewMode('catalog');
                                window.scrollTo({ top: 150, behavior: 'smooth' });
                              }}
                              className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 border-2 border-gold-400 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                            >
                              <span>⬅️</span>
                              <span>{isRtl ? `العودة لفهرس دروس التجويد (${SUWAYD_TAJWEED_CURRICULUM.length} درساً)` : `Back to Lessons Catalog (${SUWAYD_TAJWEED_CURRICULUM.length} Lessons)`}</span>
                            </button>

                            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-300 flex items-center text-xs font-bold">
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydCatalogSubTab('lessons');
                                  setSuwaydViewMode('catalog');
                                }}
                                className="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 text-slate-700 hover:text-slate-900 cursor-pointer"
                              >
                                <span>📖</span>
                                <span>{isRtl ? `فهرس الدروس (${SUWAYD_TAJWEED_CURRICULUM.length})` : `Lessons (${SUWAYD_TAJWEED_CURRICULUM.length})`}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSuwaydCatalogSubTab('atlas')}
                                className="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 bg-gold-500 text-emerald-950 font-black shadow-xs cursor-pointer"
                              >
                                <span>🏛️</span>
                                <span>{isRtl ? `أطلس التجويد المصور (${SUWAYD_PLATES.length} لوحة)` : `Illustrated Atlas (${SUWAYD_PLATES.length} Plates)`}</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
                            <div>
                              <h3 className="text-xl font-black text-emerald-950 font-cairo flex items-center gap-2">
                                <span>🏛️</span>
                                <span>{isRtl ? 'أطلس التجويد المصور — لوحات د. أيمن رشدي سويد الكاملة' : 'Illustrated Tajweed Atlas — Dr. Ayman Suwayd'}</span>
                              </h3>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl 
                                  ? `المجموعة المعتمدة تشريحياً لمخارج وصفات الحروف العربية (${SUWAYD_PLATES.length} لوحة ملونة عالية الدقة مجهزة للشرح والمقارنة مع عزو أرقام الصفحات من المجلد الأول)` 
                                  : `Complete ${SUWAYD_PLATES.length} certified pedagogical plates of Arabic letter articulation & phonetic qualities (Vol. 1).`}
                              </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                              <input
                                type="text"
                                value={atlasSearch}
                                onChange={(e) => setAtlasSearch(e.target.value)}
                                placeholder={isRtl ? 'ابحث باسم الحرف أو المخرج...' : 'Search by letter or organ...'}
                                className="bg-white border-2 border-emerald-700/30 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-gold-400 w-64 shadow-xs"
                              />
                              {atlasSearch && (
                                <button
                                  type="button"
                                  onClick={() => setAtlasSearch('')}
                                  className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Category Filter Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { id: 'all', labelAr: `جميع اللوحات (${SUWAYD_PLATES.length})`, labelEn: `All Plates (${SUWAYD_PLATES.length})` },
                              { id: 'anatomy', labelAr: `أعضاء النطق العامة (${SUWAYD_PLATES.filter(p => p.category === 'anatomy').length})`, labelEn: `Vocal Tract Anatomy (${SUWAYD_PLATES.filter(p => p.category === 'anatomy').length})` },
                              { id: 'makharij', labelAr: `مخارج الحروف الخاصة (${SUWAYD_PLATES.filter(p => p.category === 'makharij').length})`, labelEn: `Letter Articulation (${SUWAYD_PLATES.filter(p => p.category === 'makharij').length})` },
                              { id: 'comparison', labelAr: `مقارنات الحروف (${SUWAYD_PLATES.filter(p => p.category === 'comparison').length})`, labelEn: `Letter Comparisons (${SUWAYD_PLATES.filter(p => p.category === 'comparison').length})` },
                              { id: 'sifat', labelAr: `صفات الحروف وميكانيكا النطق (${SUWAYD_PLATES.filter(p => p.category === 'sifat').length})`, labelEn: `Phonetic Sifat & Acoustics (${SUWAYD_PLATES.filter(p => p.category === 'sifat').length})` },
                              { id: 'ahkam', labelAr: `أحكام الرسم والوقف والهمزات (${SUWAYD_PLATES.filter(p => p.category === 'ahkam').length})`, labelEn: `Rules, Waqf & Hamzat (${SUWAYD_PLATES.filter(p => p.category === 'ahkam').length})` }
                            ].map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setAtlasCategory(cat.id)}
                                className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                                  atlasCategory === cat.id
                                    ? 'bg-gold-500 text-emerald-950 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                )}
                              >
                                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Plates Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {SUWAYD_PLATES
                            .filter(plate => atlasCategory === 'all' || plate.category === atlasCategory)
                            .filter(plate => {
                              if (!atlasSearch.trim()) return true;
                              const q = atlasSearch.trim().toLowerCase();
                              return (
                                plate.titleAr.toLowerCase().includes(q) ||
                                plate.titleEn.toLowerCase().includes(q) ||
                                plate.descAr.toLowerCase().includes(q) ||
                                plate.descEn.toLowerCase().includes(q) ||
                                (plate.letters && plate.letters.some(l => l.includes(q)))
                              );
                            })
                            .map(plate => (
                              <div
                                key={plate.id}
                                className="bg-white rounded-2xl p-3 border-2 border-slate-200 hover:border-gold-400 transition shadow-xs hover:shadow-lg flex flex-col justify-between group cursor-pointer"
                                onClick={() => {
                                  setPlateZoomLevel(1);
                                  setSuwaydPlateZoomModal(plate);
                                }}
                              >
                                <div>
                                  {/* Thumbnail */}
                                  <div className="w-full bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50/40 transition">
                                    <img
                                      src={`images/tajweed/${plate.filename}`}
                                      onError={(e) => {
                                        e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${plate.slideNum}-638.jpg`;
                                      }}
                                      alt={plate.titleAr}
                                      className="w-full h-40 object-contain rounded-lg transition duration-200 group-hover:scale-105"
                                      loading="lazy"
                                    />
                                    <span className="absolute top-2 right-2 bg-emerald-950/80 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                                      {isRtl ? `ص ${plate.pageInBook}` : `p. ${plate.pageInBook}`}
                                    </span>
                                    {plate.letters && plate.letters.length > 0 && (
                                      <span className="absolute bottom-2 left-2 bg-gold-400 text-emerald-950 text-xs font-quran font-bold px-2 py-0.5 rounded-md shadow-xs">
                                        {plate.letters.join(' ')}
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-3">
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      {isRtl ? plate.organAr : plate.organEn}
                                    </span>
                                    <h4 className="font-bold text-emerald-950 text-xs mt-1.5 leading-snug line-clamp-2 font-cairo group-hover:text-gold-600 transition">
                                      {isRtl ? plate.titleAr : plate.titleEn}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                      {isRtl ? plate.descAr : plate.descEn}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-gold-600 group-hover:text-gold-700 flex items-center gap-1">
                                    <span>🔍</span>
                                    <span>{isRtl ? 'عرض وتكبير' : 'Enlarge'}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {isRtl ? 'د. أيمن سويد' : 'Dr. Suwayd'}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* VIEW 2: DEDICATED FULLSCREEN LESSON DETAILS SCREEN */}
                    {suwaydViewMode === 'details' && (
                      <div className="space-y-6">
                        {/* Sticky / Floating Top Action Bar: Back to Catalog + Switcher + Prev/Next */}
                        <div className="card-islamic-amber rounded-2xl p-3 sm:p-4 border-2 border-gold-400 shadow-md flex flex-wrap items-center justify-between gap-3">
                          {/* Back Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSuwaydViewMode('catalog');
                              window.scrollTo({ top: 150, behavior: 'smooth' });
                            }}
                            className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 border-2 border-gold-400 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                          >
                            <span>⬅️</span>
                            <span>{isRtl ? 'العودة لفهرس الدروس (اختر درساً آخر)' : 'Back to Lessons Catalog'}</span>
                          </button>

                          {/* Quick Lesson Switcher Dropdown & Sequential Navigation */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-emerald-950 hidden md:inline">
                              {isRtl ? 'الانتقال المباشر:' : 'Switch Lesson:'}
                            </span>
                            <select
                              value={suwaydLessonId}
                              onChange={(e) => {
                                const newId = e.target.value;
                                setSuwaydLessonId(newId);
                                const l = SUWAYD_TAJWEED_CURRICULUM.find(x => x.id === newId);
                                if (l) {
                                  setMetronomeCount(l.timingCounts);
                                  setMetronomePlaying(false);
                                  setMetronomeBeat(1);
                                }
                              }}
                              className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none cursor-pointer"
                            >
                              {SUWAYD_TAJWEED_CURRICULUM.map(l => (
                                <option key={l.id} value={l.id}>{isRtl ? l.titleAr : l.titleEn}</option>
                              ))}
                            </select>

                            {/* Prev & Next Lesson Buttons */}
                            {(() => {
                              const curIdx = SUWAYD_TAJWEED_CURRICULUM.findIndex(l => l.id === suwaydLessonId);
                              return (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={curIdx <= 0}
                                    onClick={() => {
                                      if (curIdx > 0) {
                                        const prevL = SUWAYD_TAJWEED_CURRICULUM[curIdx - 1];
                                        setSuwaydLessonId(prevL.id);
                                        setMetronomeCount(prevL.timingCounts);
                                        setMetronomePlaying(false);
                                        setMetronomeBeat(1);
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-emerald-950 disabled:opacity-40 text-xs font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
                                    title={isRtl ? 'الدرس السابق' : 'Prev Lesson'}
                                  >
                                    <span>⬅️</span>
                                    <span className="hidden sm:inline mr-1">{isRtl ? 'السابق' : 'Prev'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={curIdx >= SUWAYD_TAJWEED_CURRICULUM.length - 1}
                                    onClick={() => {
                                      if (curIdx < SUWAYD_TAJWEED_CURRICULUM.length - 1) {
                                        const nextL = SUWAYD_TAJWEED_CURRICULUM[curIdx + 1];
                                        setSuwaydLessonId(nextL.id);
                                        setMetronomeCount(nextL.timingCounts);
                                        setMetronomePlaying(false);
                                        setMetronomeBeat(1);
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-emerald-950 disabled:opacity-40 text-xs font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
                                    title={isRtl ? 'الدرس التالي' : 'Next Lesson'}
                                  >
                                    <span className="hidden sm:inline ml-1">{isRtl ? 'التالي' : 'Next'}</span>
                                    <span>➡️</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Master Presentation Card (All-in-one Dedicated Screen) */}
                        <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/20 shadow-xl space-y-6">
                          {/* Card Title & Suwayd Citation Header */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-900/15">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gold-500 text-xl font-bold">۞</span>
                                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                                  {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                                </h3>
                              </div>
                              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
                                <span>📚</span>
                                <span>{isRtl ? currentSuwaydLesson.suwaydRef : (currentSuwaydLesson.suwaydRefEn || currentSuwaydLesson.suwaydRef)}</span>
                              </p>
                            </div>

                            {/* Top Action Pills */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydZoomSlideIndex(0);
                                  setSuwaydZoomModalOpen(true);
                                }}
                                className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 px-4 py-2 rounded-xl text-xs font-black shadow-md border border-gold-500/50 flex items-center gap-2 transition transform active:scale-95"
                              >
                                <span>📺</span>
                                <span>{isRtl ? 'عرض زوم للشاشة الكاملة' : 'Full Zoom Share'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydQuizAnswers({});
                                  setSuwaydQuizSubmitted(false);
                                  setSuwaydQuizModalOpen(true);
                                }}
                                className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95"
                              >
                                <span>🎯</span>
                                <span>{isRtl ? 'اختبار الدرس' : 'Lesson Quiz'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSuwaydWorksheetModalOpen(true)}
                                className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                                title={isRtl ? 'فتح ورقة العمل المخصصة لهذا الدرس للطباعة وتصدير PDF' : 'Open dedicated printable worksheet for this lesson'}
                              >
                                <span>📝</span>
                                <span>{isRtl ? 'ورقة عمل الدرس (جاهزة للطباعة)' : 'Lesson Worksheet (Print PDF)'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Poetic Matn Box */}
                          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-gold-200 rounded-2xl p-4 sm:p-5 border border-gold-500/40 shadow-inner">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gold-500/20 text-xs">
                              <span className="font-bold text-gold-300 flex items-center gap-1.5">
                                <span>📜</span>
                                <span>{isRtl ? 'الشاهد المعتمد من المتن (تحفة الأطفال / الجزرية):' : 'Authentic Matn Citation:'}</span>
                              </span>
                              <span className="text-[11px] text-slate-300 font-naskh">ضبط تام بالشكل</span>
                            </div>
                            <div className="font-naskh text-sm sm:text-base leading-loose whitespace-pre-line text-center text-gold-100 font-bold select-all">
                              {currentSuwaydLesson.matnVerseAr}
                            </div>
                          </div>

                          {/* Core Two-Column Workbench Layout */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Right Column: Definition, Examples, and Integrated Metronome (7 cols) */}
                            <div className="lg:col-span-7 space-y-5">
                              {/* Definition Card */}
                              <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-xs">
                                <h4 className="text-xs font-extrabold text-emerald-900 mb-2 flex items-center gap-1.5">
                                  <span>💎</span>
                                  <span>{isRtl ? 'التعريف المعتمد لغةً واصطلاحاً:' : 'Canonical Definition:'}</span>
                                </h4>
                                <p className="text-sm font-medium text-slate-800 leading-relaxed font-cairo">
                                  {isRtl ? currentSuwaydLesson.definitionAr : (currentSuwaydLesson.definitionEn || currentSuwaydLesson.definitionAr)}
                                </p>
                              </div>

                              {/* Detailed Letter-by-Letter Pedagogical Explorer (from Dr. Ayman Suwayd's Illustrated Tajweed) */}
                              {currentSuwaydLesson.ruleBreakdown && currentSuwaydLesson.ruleBreakdown.length > 0 && (
                                <div className="card-islamic-sage rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-sm space-y-4">
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-200">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">💎</span>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                                          {isRtl ? 'التفصيل المنهجي لكل حرف وحكم (من كتاب التجويد المصور):' : 'Systematic Breakdown by Letter & Rule:'}
                                        </h4>
                                        <p className="text-[11px] text-emerald-800 font-medium">
                                          {isRtl ? 'بيان مخرج كل حرف، آلية النطق التجويدية، وأمثلته القرآنية في (كلمة، كلمتين، ومع التنوين):' : 'Articulation point, phonetic mechanism, and verified Quranic examples:'}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-black bg-emerald-900 text-gold-200 px-2.5 py-1 rounded-full">
                                      {currentSuwaydLesson.ruleBreakdown.length} {isRtl ? 'حروف / فروع مفصلة' : 'Detailed Items'}
                                    </span>
                                  </div>

                                  {/* Letter Cards Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {currentSuwaydLesson.ruleBreakdown.map((rb, rIdx) => (
                                      <div key={rIdx} className="bg-white/95 rounded-xl p-3.5 border border-emerald-200/80 shadow-xs space-y-2 hover:border-gold-400 transition">
                                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                                          <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 rounded-lg bg-emerald-900 text-gold-300 font-quran font-bold flex items-center justify-center text-base shrink-0">
                                              {rb.letter || (rIdx + 1)}
                                            </span>
                                            <span className="font-bold text-xs text-emerald-950 font-cairo">
                                              {rb.titleAr}
                                            </span>
                                          </div>
                                          {rb.tagAr && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                              rb.tagType === 'tafkheem' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                              rb.tagType === 'tarqeeq' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                                              'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                            }`}>
                                              {rb.tagAr}
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-[11px] text-slate-700 leading-relaxed font-cairo">
                                          <strong className="text-emerald-950">{isRtl ? 'آلية النطق والمخرج: ' : 'Mechanism: '}</strong>
                                          {rb.explanationAr}
                                        </p>

                                        {rb.examples && rb.examples.length > 0 && (
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                                            {rb.examples.map((exItem, eIdx) => (
                                              <div key={eIdx} className="bg-amber-50/80 rounded-lg p-1.5 text-center border border-amber-200/60">
                                                <span className="block text-[9px] text-slate-500 font-bold mb-0.5">{exItem.type}</span>
                                                <span className="font-quran text-base text-emerald-950 font-bold block leading-snug">{exItem.word}</span>
                                                <span className="block text-[9px] text-amber-900 font-medium">{exItem.surah}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {rb.warningAr && (
                                          <div className="text-[10px] text-rose-800 bg-rose-50/80 rounded-lg p-1.5 border border-rose-200 flex items-start gap-1">
                                            <span className="shrink-0">⚠️</span>
                                            <span><strong>{isRtl ? 'تنبيه المعلم: ' : 'Warning: '}</strong>{rb.warningAr}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quranic Examples in Uthmani Script */}
                              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-xs">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                  <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                                    <span>📖</span>
                                    <span>{isRtl ? 'الأمثلة التطبيقية بالرسم العثماني المصحفي:' : 'Verified Uthmani Script Examples:'}</span>
                                  </h4>
                                  <span className="text-[11px] text-slate-500 font-medium">
                                    {currentSuwaydLesson.examples.length} {isRtl ? 'أمثلة منتقاة' : 'Examples'}
                                  </span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-right border-collapse">
                                    <thead>
                                      <tr className="bg-emerald-50/70 text-emerald-950 text-xs border-b border-emerald-100">
                                        <th className="p-2.5 w-10 text-center font-bold">#</th>
                                        <th className="p-2.5 font-bold font-cairo">{isRtl ? 'الكلمة القرآنية' : 'Quranic Word'}</th>
                                        <th className="p-2.5 font-bold font-cairo w-28">{isRtl ? 'الموضع' : 'Surah'}</th>
                                        <th className="p-2.5 font-bold font-cairo">{isRtl ? 'التوجيه الصوتي والعلة' : 'Phonetic Rationale'}</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                      {currentSuwaydLesson.examples.map((ex, idx) => (
                                        <tr key={idx} className="hover:bg-amber-50/40 transition">
                                          <td className="p-2.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                                          <td className="p-2.5 font-quran text-lg text-emerald-950 font-bold leading-none select-all">
                                            <span className="bg-amber-100/80 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300/60 inline-block">
                                              {ex.word}
                                            </span>
                                          </td>
                                          <td className="p-2.5 text-slate-600 font-medium font-cairo text-[11px]">
                                            {isRtl ? ex.surah : (ex.surahEn || ex.surah)}
                                          </td>
                                          <td className="p-2.5 text-emerald-900 font-medium font-cairo text-xs leading-snug">
                                            {isRtl ? ex.note : (ex.noteEn || ex.note)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Integrated Harakat Metronome */}
                              <div className="card-islamic-amber rounded-2xl p-5 border-2 border-amber-300 shadow-md">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-300/60">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">⏱️</span>
                                    <div>
                                      <h4 className="text-xs font-black text-amber-950 font-cairo">
                                        {isRtl ? 'ميزان الأزمنة والحركات المدمج للدرس:' : 'Integrated Harakat Metronome:'}
                                      </h4>
                                      <p className="text-[11px] text-amber-900 font-bold">
                                        {isRtl ? `${currentSuwaydLesson.timingLabelAr} (${currentSuwaydLesson.timingCounts} حركات)` : `${currentSuwaydLesson.timingLabelEn || currentSuwaydLesson.timingLabelAr} (${currentSuwaydLesson.timingCounts} ${currentSuwaydLesson.timingCounts === 1 ? 'Count' : 'Counts'})`}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Speed Selector */}
                                  <div className="flex items-center gap-1 bg-white/80 rounded-xl p-1 border border-amber-300">
                                    {[
                                      { id: 'tahqeeq', labelAr: 'تحقيق (بطيء)', labelEn: 'Tahqeeq (Slow)' },
                                      { id: 'tadweer', labelAr: 'تدوير (معتدل)', labelEn: 'Tadweer (Medium)' },
                                      { id: 'hadr', labelAr: 'حدر (سريع)', labelEn: 'Hadr (Fast)' }
                                    ].map(sp => (
                                      <button
                                        key={sp.id}
                                        type="button"
                                        onClick={() => setMetronomeSpeed(sp.id)}
                                        className={'px-2.5 py-1 rounded-lg text-[10px] font-bold transition ' + (
                                          metronomeSpeed === sp.id
                                            ? 'bg-amber-500 text-emerald-950 font-black shadow-xs'
                                            : 'text-amber-900 hover:bg-amber-100/60'
                                        )}
                                      >
                                        {isRtl ? sp.labelAr : sp.labelEn}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Metronome Visual Beats */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    {Array.from({ length: currentSuwaydLesson.timingCounts }).map((_, bIdx) => {
                                      const beatNum = bIdx + 1;
                                      const isCurrentBeat = metronomePlaying && metronomeBeat === beatNum;
                                      return (
                                        <div
                                          key={beatNum}
                                          className={'w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-base transition-all duration-150 shadow-sm border ' + (
                                            isCurrentBeat
                                              ? 'bg-amber-500 text-emerald-950 border-amber-600 scale-110 shadow-lg ring-4 ring-amber-300 font-black animate-pulse'
                                              : 'bg-white/90 text-amber-950 border-amber-200'
                                          )}
                                        >
                                          <span className="leading-none">{beatNum}</span>
                                          <span className="text-[9px] font-medium leading-none mt-0.5">{isRtl ? "حركة" : "Beats"}</span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Play / Stop Button */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (metronomeCount !== currentSuwaydLesson.timingCounts) {
                                          setMetronomeCount(currentSuwaydLesson.timingCounts);
                                        }
                                        setMetronomePlaying(!metronomePlaying);
                                      }}
                                      className={'px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition flex items-center gap-2 transform active:scale-95 ' + (
                                        metronomePlaying
                                          ? 'bg-rose-700 hover:bg-rose-800 text-white ring-2 ring-rose-400'
                                          : 'bg-emerald-900 hover:bg-emerald-950 text-gold-200 border border-gold-400'
                                      )}
                                    >
                                      <span>{metronomePlaying ? '⏸️' : '▶️'}</span>
                                      <span>{metronomePlaying ? (isRtl ? 'إيقاف الميزان' : 'Stop Metronome') : (isRtl ? 'تشغيل النبض التجويدي' : 'Play Metronome')}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setMetronomeSound(!metronomeSound)}
                                      className={'p-2.5 rounded-xl text-xs font-bold border ' + (
                                        metronomeSound ? 'bg-white text-emerald-950 border-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200'
                                      )}
                                      title="كتم / تشغيل صوت النبض الخشبي"
                                    >
                                      {metronomeSound ? '🔔' : '🔕'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Left Column: Anatomical Cross-Section & Articulation Mechanism (5 cols) */}
                            <div className="lg:col-span-5 space-y-5">
                              {/* SVG Anatomical Diagram Card */}
                              {/* Authentic Dr. Ayman Suwayd Illustrated Plate & Interactive Letter Viewer */}
                              {(() => {
                                const lessonPlates = getSuwaydPlatesForLesson(currentSuwaydLesson.id);
                                const currentPlate = lessonPlates.find(p => p.id === activeSuwaydPlateId) || lessonPlates[0] || SUWAYD_PLATES[0];

                                return (
                                  <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-gold-400/60 shadow-md space-y-4">
                                    {/* Plate Header with Title, Book Page, and Mode Switcher */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-900/10">
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-base">🖼️</span>
                                          <h4 className="text-sm font-black text-emerald-950 font-cairo">
                                            {isRtl ? 'اللوحة التعليمية المعتمدة (د. أيمن سويد)' : 'Official Plate (Dr. Ayman Suwayd)'}
                                          </h4>
                                        </div>
                                        <p className="text-[11px] font-bold text-gold-700 mt-0.5">
                                          {isRtl ? currentPlate.titleAr : currentPlate.titleEn}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] bg-emerald-50 text-emerald-900 font-black px-2.5 py-1 rounded-lg border border-emerald-300">
                                          {isRtl ? `ص ${currentPlate.pageInBook} • مجلد 1` : `p. ${currentPlate.pageInBook} • Vol. 1`}
                                        </span>
                                        {/* Fullscreen Zoom Lightbox Button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPlateZoomLevel(1);
                                            setSuwaydPlateZoomModal(currentPlate);
                                          }}
                                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                                          title={isRtl ? 'تكبير اللوحة ملء الشاشة للشرح على زوم' : 'Zoom Fullscreen for Zoom Teaching'}
                                        >
                                          <span>🔍</span>
                                          <span>{isRtl ? 'تكبير اللوحة ملء الشاشة' : 'Fullscreen Zoom'}</span>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Horizontal Letter / Plate Selector Tabs if Multiple Plates in this Lesson */}
                                    {lessonPlates.length > 1 && (
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                          {isRtl ? 'اختر الحرف / اللوحة:' : 'Select Plate:'}
                                        </span>
                                        {lessonPlates.map(lp => {
                                          const isSelected = lp.id === currentPlate.id;
                                          const letterLabel = lp.letters && lp.letters.length > 0 ? lp.letters.join('، ') : '';
                                          return (
                                            <button
                                              key={lp.id}
                                              type="button"
                                              onClick={() => setActiveSuwaydPlateId(lp.id)}
                                              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${
                                                isSelected
                                                  ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs ring-1 ring-gold-400 scale-102'
                                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                              }`}
                                            >
                                              {letterLabel && <span className="font-quran text-gold-400 text-sm">{letterLabel}</span>}
                                              <span>{isRtl ? lp.titleAr.replace(/^.*:\s*/, '') : lp.titleEn.replace(/^.*:\s*/, '')}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {/* Main Display: Authentic Dr. Ayman Suwayd Illustrated Plate */}
                                    <div className="space-y-3">
                                      <div 
                                        className="w-full flex items-center justify-center p-2 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/50 rounded-2xl border-2 border-gold-300 shadow-inner group relative cursor-zoom-in overflow-hidden"
                                        onClick={() => {
                                          setPlateZoomLevel(1);
                                          setSuwaydPlateZoomModal(currentPlate);
                                        }}
                                        title={isRtl ? 'انقر لتكبير اللوحة بحجم هائل للشرح على زوم' : 'Click to zoom high-resolution for Zoom sharing'}
                                      >
                                        <img
                                          src={`images/tajweed/${currentPlate.filename}`}
                                          onError={(e) => {
                                            e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${currentPlate.slideNum}-638.jpg`;
                                          }}
                                          alt={currentPlate.titleAr}
                                          className="w-full max-h-80 sm:max-h-96 object-contain rounded-xl drop-shadow-md transition duration-200 group-hover:scale-[1.02]"
                                          loading="lazy"
                                        />
                                        <div className="absolute bottom-3 right-3 bg-emerald-950/80 text-gold-300 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition backdrop-blur-xs flex items-center gap-1">
                                          <span>🔍</span>
                                          <span>{isRtl ? 'انقر للتكبير والشرح' : 'Click to enlarge'}</span>
                                        </div>
                                      </div>

                                      {/* Description & Pedagogical Notes */}
                                      <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200 text-xs text-amber-950 leading-relaxed font-cairo">
                                        <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-900">
                                          <span>📌</span>
                                          <span>{isRtl ? currentPlate.titleAr : currentPlate.titleEn}</span>
                                        </div>
                                        <p className="font-medium text-slate-800">
                                          {isRtl ? currentPlate.descAr : currentPlate.descEn}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Anatomical Mechanism Card */}
                              <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs">
                                <h4 className="text-xs font-extrabold text-emerald-950 mb-2 flex items-center gap-1.5">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'الآلية التشريحية وحركة أعضاء النطق:' : 'Biomechanical Mechanism:'}</span>
                                </h4>
                                <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed font-cairo">
                                  {isRtl ? currentSuwaydLesson.mechanismAr : (currentSuwaydLesson.mechanismEn || currentSuwaydLesson.mechanismAr)}
                                </p>
                              </div>

                              {/* Common Mistakes Card */}
                              <div className="bg-rose-50/60 rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs">
                                <h4 className="text-xs font-extrabold text-rose-950 mb-2 flex items-center gap-1.5">
                                  <span>⚠️</span>
                                  <span>{isRtl ? 'أبرز الأخطاء الشائعة وطرق تقويم اللسان:' : 'Common Mistakes & Fixes:'}</span>
                                </h4>
                                <p className="text-xs font-medium text-rose-950 leading-relaxed font-cairo whitespace-pre-line">
                                  {isRtl ? currentSuwaydLesson.commonMistakesAr : (currentSuwaydLesson.commonMistakesEn || currentSuwaydLesson.commonMistakesAr)}
                                </p>
                              </div>

                              {/* Teacher Guidance Card */}
                              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300 shadow-xs">
                                <div className="flex items-start gap-2">
                                  <span className="text-base">💡</span>
                                  <div>
                                    <h4 className="text-xs font-bold text-amber-950 font-cairo">
                                      {isRtl ? 'إرشاد وتوجيه المعلم للدارسين والحلقة:' : 'Teacher Prompt for the Ring:'}
                                    </h4>
                                    <p className="text-xs text-amber-900 font-medium mt-1 leading-snug">
                                      {isRtl ? currentSuwaydLesson.teacherPromptAr : (currentSuwaydLesson.teacherPromptEn || currentSuwaydLesson.teacherPromptAr)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Return Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t-2 border-emerald-900/10">
                            <button
                              type="button"
                              onClick={() => {
                                setSuwaydViewMode('catalog');
                                window.scrollTo({ top: 150, behavior: 'smooth' });
                              }}
                              className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 border-2 border-gold-400 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                            >
                              <span>⬅️</span>
                              <span>{isRtl ? 'العودة لفهرس دروس التجويد (اختيار درس آخر)' : 'Back to Lessons Catalog'}</span>
                            </button>

                            {(() => {
                              const curIdx = SUWAYD_TAJWEED_CURRICULUM.findIndex(l => l.id === suwaydLessonId);
                              if (curIdx < SUWAYD_TAJWEED_CURRICULUM.length - 1) {
                                const nextL = SUWAYD_TAJWEED_CURRICULUM[curIdx + 1];
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSuwaydLessonId(nextL.id);
                                      setMetronomeCount(nextL.timingCounts);
                                      setMetronomePlaying(false);
                                      setMetronomeBeat(1);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition cursor-pointer"
                                  >
                                    <span>{isRtl ? 'الدرس التالي ➡️' : 'Next Lesson ➡️'}</span>
                                  </button>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= FULLSCREEN PLATE ZOOM LIGHTBOX MODAL ================= */}
                    {suwaydPlateZoomModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
                        <div className="bg-slate-950 text-white rounded-3xl max-w-5xl w-full border-2 border-gold-400/80 shadow-2xl p-4 sm:p-6 flex flex-col max-h-[95vh] overflow-hidden">
                          {/* Lightbox Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gold-500/30">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🖼️</span>
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-gold-200 font-cairo">
                                  {isRtl ? suwaydPlateZoomModal.titleAr : suwaydPlateZoomModal.titleEn}
                                </h3>
                                <p className="text-xs text-slate-300">
                                  {isRtl ? `كتاب التجويد المصور — ص ${suwaydPlateZoomModal.pageInBook} (مجلد 1) • د. أيمن رشدي سويد` : `Illustrated Tajweed — p. ${suwaydPlateZoomModal.pageInBook} (Vol. 1) • Dr. Ayman Suwayd`}
                                </p>
                              </div>
                            </div>

                            {/* Controls: Zoom Levels + Close */}
                            <div className="flex items-center gap-2">
                              <div className="bg-slate-900 border border-slate-700 rounded-xl p-1 flex items-center gap-1 text-xs font-bold text-slate-300">
                                <span className="text-[10px] text-slate-400 px-1">{isRtl ? 'التكبير:' : 'Zoom:'}</span>
                                {[1, 1.5, 2].map(lvl => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setPlateZoomLevel(lvl)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                      plateZoomLevel === lvl ? 'bg-gold-500 text-emerald-950 font-black' : 'hover:bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {lvl * 100}%
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => setSuwaydPlateZoomModal(null)}
                                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center transition border border-slate-700 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Lightbox Body with Zoom Container */}
                          <div className="py-4 flex-1 overflow-auto flex items-center justify-center bg-slate-900/50 rounded-2xl my-3 p-2">
                            <img
                              src={`images/tajweed/${suwaydPlateZoomModal.filename}`}
                              onError={(e) => {
                                e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${suwaydPlateZoomModal.slideNum}-638.jpg`;
                              }}
                              alt={suwaydPlateZoomModal.titleAr}
                              style={{ transform: `scale(${plateZoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-in-out' }}
                              className="max-h-[70vh] w-auto object-contain rounded-xl drop-shadow-2xl"
                            />
                          </div>

                          {/* Lightbox Footer Guidance */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold-500/30 text-xs">
                            <p className="text-slate-300 font-cairo flex-1">
                              <strong>{isRtl ? 'التوجيه الصوتي والتشريحي:' : 'Phonetic Guidance:'}</strong> {isRtl ? suwaydPlateZoomModal.descAr : suwaydPlateZoomModal.descEn}
                            </p>

                            {suwaydPlateZoomModal.letters && suwaydPlateZoomModal.letters.length > 0 && (
                              <span className="font-quran text-gold-300 text-base font-bold bg-emerald-950 px-3 py-1 rounded-xl border border-gold-500/40">
                                {suwaydPlateZoomModal.letters.join(' ، ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= FULLSCREEN ZOOM PRESENTATION MODAL ================= */}
                    {suwaydZoomModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
                        <div className="bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white rounded-3xl max-w-5xl w-full border-2 border-gold-400/80 shadow-2xl p-5 sm:p-8 flex flex-col max-h-[94vh] overflow-y-auto">
                          
                          {/* Modal Header */}
                          <div className="flex items-center justify-between pb-4 border-b border-gold-500/30 gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-gold-400 font-bold text-lg">۞</span>
                                <h3 className="text-base sm:text-xl font-black text-gold-200 font-cairo truncate">
                                  {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                                </h3>
                                {(() => {
                                  const curSlide = currentZoomSlides[suwaydZoomSlideIndex];
                                  if (curSlide && curSlide.type === 'breakdown') {
                                    return (
                                      <span className="text-[11px] font-black bg-gold-500/20 text-gold-300 border border-gold-400/50 px-2.5 py-0.5 rounded-full">
                                        {curSlide.item.tagAr}
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                                <span>{isRtl ? currentSuwaydLesson.suwaydRef : (currentSuwaydLesson.suwaydRefEn || currentSuwaydLesson.suwaydRef)}</span>
                                <span className="text-gold-400">•</span>
                                <span className="text-gold-300 font-bold">
                                  {(() => {
                                    const curSlide = currentZoomSlides[suwaydZoomSlideIndex];
                                    if (!curSlide) return '';
                                    if (curSlide.type === 'overview') return isRtl ? 'الشاهد من المتن واللوحة التعليمية' : 'Authentic Plate & Matn';
                                    if (curSlide.type === 'breakdown') return isRtl ? `عرض تفصيلي: ${curSlide.item.titleAr}` : `Breakdown: ${curSlide.item.titleAr}`;
                                    return isRtl ? `تطبيق إفرادي وضبط المترونوم (${curSlide.example.word})` : `Word Practice (${curSlide.example.word})`;
                                  })()}
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setMetronomePlaying(false);
                                setSuwaydZoomModalOpen(false);
                              }}
                              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center transition border border-slate-700 shrink-0"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Quick Jump Navigation Pills Bar */}
                          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-3.5 border-b border-gold-500/20 no-scrollbar min-h-[50px] select-none">
                            <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">
                              {isRtl ? 'الانتقال المباشر:' : 'Jump to:'}
                            </span>
                            {currentZoomSlides.map((s, idx) => {
                              const isCurrent = suwaydZoomSlideIndex === idx;
                              let label = `${idx + 1}`;
                              let icon = '🎯';
                              if (s.type === 'overview') {
                                icon = '🖼️';
                                label = isRtl ? 'المتن واللوحة' : 'Plate';
                              } else if (s.type === 'breakdown') {
                                icon = '🔤';
                                label = s.item.letter || s.item.titleAr.replace(/^.*:\s*/, '');
                              } else if (s.type === 'example') {
                                icon = '⏱️';
                                label = s.example.word;
                              }
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSuwaydZoomSlideIndex(idx)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 my-0.5 ${
                                    isCurrent
                                      ? 'bg-gold-500 text-emerald-950 font-black shadow-md ring-2 ring-gold-300'
                                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-slate-300 border border-gold-500/30'
                                  }`}
                                  title={s.titleAr}
                                >
                                  <span>{icon}</span>
                                  <span className="truncate max-w-[120px]">{label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Modal Slide Body */}
                          <div className="py-6 flex-1 flex flex-col justify-center">
                            <TajweedZoomSlideBody {...{ activeSuwaydPlateId, currentSuwaydLesson, currentZoomSlides, isRtl, metronomeBeat, metronomeCount, metronomePlaying, setActiveSuwaydPlateId, setMetronomeCount, setMetronomePlaying, suwaydZoomSlideIndex }} />
                          </div>

                          {/* Modal Footer Controls */}
                          <div className="flex items-center justify-between pt-4 border-t border-gold-500/30">
                            <button
                              type="button"
                              disabled={suwaydZoomSlideIndex === 0}
                              onClick={() => setSuwaydZoomSlideIndex(prev => Math.max(0, prev - 1))}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs transition"
                            >
                              {isRtl ? '◀ الشريحة السابقة' : '◀ Previous'}
                            </button>

                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-gold-300">
                                {isRtl ? 'شريحة' : 'Slide'} {suwaydZoomSlideIndex + 1} / {currentZoomSlides.length}
                              </span>
                            </div>

                            <button
                              type="button"
                              disabled={suwaydZoomSlideIndex >= currentZoomSlides.length - 1}
                              onClick={() => setSuwaydZoomSlideIndex(prev => Math.min(currentZoomSlides.length - 1, prev + 1))}
                              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-emerald-950 font-black text-xs transition"
                            >
                              {isRtl ? 'الشريحة التالية ▶' : 'Next ▶'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= DEDICATED TAJWEED LESSON PRINTABLE WORKSHEET MODAL ================= */}
                    {suwaydWorksheetModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
                        <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full border-4 border-gold-400 shadow-2xl p-4 sm:p-8 my-auto relative max-h-[95vh] overflow-y-auto">
                          
                          {/* Top Controls Toolbar (Hidden in Print) */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-emerald-900/15 no-print">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📝</span>
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? 'ورقة عمل وتطبيق عملي مخصصة للدرس (جاهزة للطباعة وتصدير PDF)' : 'Dedicated Printable Lesson Worksheet'}
                                </h3>
                                <p className="text-xs text-slate-600 font-medium">
                                  {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
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
                                <span>{isRtl ? 'طباعة ورقة العمل / PDF' : 'Print Worksheet / PDF'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSuwaydWorksheetModalOpen(false)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition border border-slate-300 cursor-pointer"
                                title={isRtl ? 'إغلاق والعودة للدرس' : 'Close and return to lesson'}
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* ================= PRINTABLE WORKSHEET DOCUMENT BODY ================= */}
                          <div id="tajweed-lesson-printable-worksheet" className="space-y-6 text-right font-cairo">
                            
                            {/* Institutional Header */}
                            <div className="border-b-2 border-emerald-900 pb-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="text-right">
                                  <div className="font-amiri text-2xl font-black text-emerald-950 leading-none">
                                    {isRtl ? 'منصة مِشكاة لتعليم القرآن الكريم والتجويد' : 'Mishkah Platform for Quran & Tajweed'}
                                  </div>
                                  <div className="text-xs font-bold text-gold-800 mt-1">
                                    {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي • AnubisLand' : "Comprehensive OS for Da'wah & Islamic Educators • AnubisLand"}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    {isRtl ? 'رواية حفص عن عاصم من طريق الشاطبية' : 'Hafs from Asim via Shatibiyyah'}
                                  </div>
                                </div>

                                <div className="text-center p-2 rounded-2xl border-2 border-gold-400 bg-emerald-950 text-gold-200">
                                  <div className="font-amiri text-lg font-bold">ورقة تطبيق مدرسي</div>
                                  <div className="text-[10px] font-bold">نموذج معتمد ۞</div>
                                </div>

                                <div className="text-left text-xs font-bold text-slate-600">
                                  <div>كتاب التجويد المصور</div>
                                  <div>د. أيمن رشدي سويد</div>
                                  <div className="text-[11px] text-emerald-800 font-bold">{isRtl ? currentSuwaydLesson.suwaydRef : (currentSuwaydLesson.suwaydRefEn || currentSuwaydLesson.suwaydRef)}</div>
                                </div>
                              </div>

                              <div className="mt-3 text-center bg-emerald-50 py-2 px-4 rounded-xl border border-emerald-200">
                                <h2 className="text-lg sm:text-xl font-black text-emerald-950 font-amiri">
                                  {isRtl ? 'ورقة عمل وتطبيق: ' + currentSuwaydLesson.titleAr : 'Worksheet: ' + currentSuwaydLesson.titleEn}
                                </h2>
                                <span className="text-xs font-bold text-emerald-900">
                                  {isRtl ? currentSuwaydLesson.categoryAr : currentSuwaydLesson.categoryEn} • ⏱️ {isRtl ? currentSuwaydLesson.timingLabelAr : (currentSuwaydLesson.timingLabelEn || currentSuwaydLesson.timingLabelAr)}
                                </span>
                              </div>
                            </div>

                            {/* Student & Ring Evaluation Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-300 text-xs font-bold">
                              <div>
                                <span className="text-slate-500 block mb-0.5">اسم الدارس/الطالب:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6"></div>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">الحلقة / المجموعة:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6"></div>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">تاريخ المدارسة:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6">____ / ____ / 2026م</div>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">الدرجة والتقييم:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6 text-emerald-950 font-black">
                                  [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 100]
                                </div>
                              </div>
                            </div>

                            {/* Section 1: Matn Evidence Box */}
                            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-300">
                              <div className="text-xs font-bold text-amber-950 mb-1.5 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-black">
                                  <span>📜</span>
                                  <span>{isRtl ? 'الشاهد المعتمد من المتن (تحفة الأطفال / الجزرية):' : 'Authentic Matn Citation:'}</span>
                                </span>
                                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold">ضبط تام بالشكل</span>
                              </div>
                              <div className="font-naskh text-sm sm:text-base text-emerald-950 font-bold leading-relaxed text-center whitespace-pre-line">
                                {currentSuwaydLesson.matnVerseAr}
                              </div>
                            </div>

                            {/* Section 2: Canonical Definition & Biomechanical Mechanism */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                                <div className="text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                                  <span>💎</span>
                                  <span>{isRtl ? 'التعريف العلمي المعتمد:' : 'Canonical Definition:'}</span>
                                </div>
                                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                  {isRtl ? currentSuwaydLesson.definitionAr : (currentSuwaydLesson.definitionEn || currentSuwaydLesson.definitionAr)}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                                <div className="text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'آلية النطق وميكانيكية العضو:' : 'Biomechanical Mechanism:'}</span>
                                </div>
                                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                  {isRtl ? currentSuwaydLesson.mechanismAr : (currentSuwaydLesson.mechanismEn || currentSuwaydLesson.mechanismAr)}
                                </p>
                              </div>
                            </div>

                            {/* Section 3: Authentic Illustrated Plate Reference */}
                            {(() => {
                              const lessonPlates = getSuwaydPlatesForLesson(currentSuwaydLesson.id);
                              const currentPlate = lessonPlates.find(p => p.id === activeSuwaydPlateId) || lessonPlates[0] || SUWAYD_PLATES[0];
                              return (
                                <div className="p-3.5 rounded-2xl border-2 border-gold-300 bg-white">
                                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200 text-xs">
                                    <span className="font-black text-emerald-950 flex items-center gap-1.5">
                                      <span>🖼️</span>
                                      <span>{isRtl ? 'اللوحة التعليمية والتشريحية المعتمدة (د. أيمن رشدي سويد):' : 'Official Illustrated Anatomical Plate:'}</span>
                                      <span className="text-gold-700 font-bold">({isRtl ? currentPlate.titleAr : currentPlate.titleEn})</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-600">
                                      {isRtl ? `ص ${currentPlate.pageInBook} • مجلد 1` : `p. ${currentPlate.pageInBook} • Vol. 1`}
                                    </span>
                                  </div>

                                  <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-full sm:w-48 h-40 flex items-center justify-center p-1 bg-slate-50 rounded-xl border border-slate-200 shrink-0 overflow-hidden">
                                      <img
                                        src={`images/tajweed/${currentPlate.filename}`}
                                        onError={(e) => {
                                          e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${currentPlate.slideNum}-638.jpg`;
                                        }}
                                        alt={currentPlate.titleAr}
                                        className="max-h-full max-w-full object-contain rounded"
                                      />
                                    </div>
                                    <div className="text-xs space-y-2 text-slate-800 leading-relaxed">
                                      <p className="font-medium">
                                        <strong>التوجيه الصوتي للوحة:</strong> {isRtl ? currentPlate.descAr : currentPlate.descEn}
                                      </p>
                                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 font-bold">
                                        📌 <strong>واجب الدارس العملي:</strong> تأمل الموضع الدقيق لتصادم أو تباعد العضو أثناء النطق، واضبط المخرج دون زيادة أو نقصان.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Section 4: Quranic Verification & Practical Exercises Table */}
                            <div className="border border-emerald-900/30 rounded-2xl overflow-hidden">
                              <div className="bg-emerald-950 text-gold-200 px-4 py-2 font-bold text-xs flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-black">
                                  <span>📖</span>
                                  <span>جدول التطبيق واستخراج الأحكام بالرسم العثماني المصحفي:</span>
                                </span>
                                <span className="text-[11px] text-emerald-200 font-medium">
                                  {currentSuwaydLesson.examples.length} مواضع قرآنية معتمدة
                                </span>
                              </div>

                              <table className="w-full text-right border-collapse text-xs">
                                <thead>
                                  <tr className="bg-emerald-50 text-emerald-950 border-b border-emerald-200">
                                    <th className="p-2.5 w-10 text-center font-bold">#</th>
                                    <th className="p-2.5 font-bold font-cairo">الكلمة القرآنية</th>
                                    <th className="p-2.5 font-bold font-cairo w-28">الموضع</th>
                                    <th className="p-2.5 font-bold font-cairo">الحكم التجويدي والتوجيه الصوتي المعتمد</th>
                                    <th className="p-2.5 font-bold font-cairo w-36 text-center">تطبيق الطالب / الدرجة</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {currentSuwaydLesson.examples.map((ex, idx) => (
                                    <tr key={idx} className="hover:bg-amber-50/30 transition">
                                      <td className="p-2.5 text-center text-slate-500 font-bold">{idx + 1}</td>
                                      <td className="p-2.5 font-quran text-xl text-emerald-950 font-bold leading-none select-all">
                                        <span className="bg-amber-100/90 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300 inline-block">
                                          {ex.word}
                                        </span>
                                      </td>
                                      <td className="p-2.5 text-slate-700 font-bold font-cairo text-[11px]">
                                        {isRtl ? ex.surah : (ex.surahEn || ex.surah)}
                                      </td>
                                      <td className="p-2.5 text-emerald-900 font-medium font-cairo text-xs leading-snug">
                                        {isRtl ? ex.note : (ex.noteEn || ex.note)}
                                      </td>
                                      <td className="p-2.5 text-center border-r border-slate-200">
                                        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-bold">
                                          <span>[&nbsp;&nbsp;&nbsp;&nbsp; / 5]</span>
                                          <span className="text-emerald-700">✓</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Section 5: Common Mistakes & Quiz Question for Ring Discussion */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3.5 rounded-2xl border border-rose-300 bg-rose-50/60 text-xs">
                                <div className="font-black text-rose-950 mb-1 flex items-center gap-1.5">
                                  <span>⚠️</span>
                                  <span>تنبيهات وأخطاء شائعة يجب تجنبها:</span>
                                </div>
                                <p className="text-rose-950 font-medium leading-relaxed whitespace-pre-line">
                                  {isRtl ? currentSuwaydLesson.commonMistakesAr : (currentSuwaydLesson.commonMistakesEn || currentSuwaydLesson.commonMistakesAr)}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/60 text-xs">
                                <div className="font-black text-amber-950 mb-1 flex items-center gap-1.5">
                                  <span>🎯</span>
                                  <span>سؤال تقييمي للمناقشة واختبار الفهم:</span>
                                </div>
                                <p className="text-slate-900 font-bold leading-relaxed mb-2">
                                  {isRtl ? currentSuwaydLesson.quizQuestions[0]?.qAr : (currentSuwaydLesson.quizQuestions[0]?.qEn || currentSuwaydLesson.quizQuestions[0]?.qAr)}
                                </p>
                                <div className="border-b border-dotted border-slate-400 pt-3">
                                  <span className="text-[10px] text-slate-400 font-bold">إجابة الدارس: __________________________________________________</span>
                                </div>
                              </div>
                            </div>

                            {/* Section 6: Teacher Notes & Official Seal / Signature */}
                            <div className="border-t-2 border-emerald-900 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-700">
                              <div className="flex-1 min-w-[240px]">
                                <span className="block mb-1 text-emerald-950 font-black">ملاحظات وتوجيهات المعلم للدارس:</span>
                                <div className="border-b-2 border-dotted border-slate-300 h-6"></div>
                                <div className="border-b-2 border-dotted border-slate-300 h-6 mt-1"></div>
                              </div>

                              <div className="flex items-center gap-8">
                                <div className="text-center">
                                  <span className="block text-slate-500 mb-2">توقيع المعلم المشرف:</span>
                                  <div className="border-b-2 border-slate-800 w-32 h-6"></div>
                                </div>

                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gold-600 flex flex-col items-center justify-center text-center text-[10px] font-black text-emerald-950 p-1 bg-amber-50/50">
                                  <span>خاتم الإجازة</span>
                                  <span className="text-gold-600 text-base leading-none">۞</span>
                                  <span>والإتقان</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= SELF-EVALUATION QUIZ MODAL ================= */}
                    {suwaydQuizModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                        <div className="card-islamic-pearl rounded-3xl max-w-2xl w-full border-2 border-gold-500 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between pb-4 mb-5 border-b border-emerald-900/15">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🎯</span>
                                <h3 className="text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? 'الاختبار الذاتي التقييمي — د. أيمن سويد' : 'Evaluative Quiz — Dr. Suwayd Standard'}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSuwaydQuizModalOpen(false)}
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Questions */}
                          <div className="space-y-6">
                            {currentSuwaydLesson.quizQuestions.map((q, qIdx) => {
                              const qKey = currentSuwaydLesson.id + '_' + qIdx;
                              const selected = suwaydQuizAnswers[qKey];
                              const isCorrect = selected === q.correct;
                              return (
                                <div key={qIdx} className="bg-white rounded-2xl p-4 border border-slate-200">
                                  <div className="flex items-start gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-900 text-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                                      {qIdx + 1}
                                    </span>
                                    <h4 className="font-bold text-emerald-950 text-sm font-cairo leading-snug">
                                      {q.qAr}
                                    </h4>
                                  </div>

                                  <div className="space-y-2">
                                    {q.opts.map(opt => {
                                      const isThis = selected === opt.id;
                                      let optClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300';
                                      if (suwaydQuizSubmitted) {
                                        if (opt.id === q.correct) {
                                          optClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                                        } else if (isThis && !isCorrect) {
                                          optClass = 'bg-rose-100 border-rose-400 text-rose-900';
                                        }
                                      } else if (isThis) {
                                        optClass = 'bg-emerald-900 text-gold-200 font-bold border-emerald-950 shadow-sm';
                                      }

                                      return (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          disabled={suwaydQuizSubmitted}
                                          onClick={() => setSuwaydQuizAnswers(prev => ({ ...prev, [qKey]: opt.id }))}
                                          className={'w-full p-3 rounded-xl border text-right text-xs transition flex items-center justify-between ' + optClass}
                                        >
                                          <span>{isRtl ? opt.text : (opt.textEn || opt.text)}</span>
                                          {suwaydQuizSubmitted && opt.id === q.correct && <span className="font-bold">✓</span>}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {suwaydQuizSubmitted && (
                                    <div className={'mt-3 p-3 rounded-xl text-xs font-cairo leading-relaxed border ' + (
                                      isCorrect ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                                    )}>
                                      <strong>{isCorrect ? (isRtl ? '✓ أحسنت بارك الله فيك:' : '✓ Excellent, Well Done:') : (isRtl ? '✗ تصحيح د. أيمن سويد:' : '✗ Dr. Suwayd Correction:')}</strong> {isRtl ? q.exp : (q.expEn || q.exp)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Submit / Reset Actions */}
                          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 mt-6">
                            {suwaydQuizSubmitted ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydQuizAnswers({});
                                  setSuwaydQuizSubmitted(false);
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
                              >
                                إعادة الاختبار
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={Object.keys(suwaydQuizAnswers).length === 0}
                                onClick={() => setSuwaydQuizSubmitted(true)}
                                className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-40"
                              >
                                تسليم الإجابات والتقييم الفوري
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

{tajweedSubTab === 'makhaarij' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header Banner */}
                    <div className="card-islamic-pearl rounded-3xl p-6 border-2 border-emerald-900/15 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-emerald-900/10">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🗣️</span>
                          <div>
                            <h3 className="text-lg font-black text-emerald-950 font-cairo">
                              {isRtl ? 'أطلس مخارج الحروف العامة والخاصة (Anatomical Phonetics Atlas)' : 'Comprehensive Makhaarij Articulation Atlas'}
                            </h3>
                            <p className="text-xs text-slate-600 font-medium">
                              {isRtl ? 'دراسة تشريحية بصرية تفاعلية للأعضاء الخمسة الرئيسة، حروفها، وآلية توليد الصوت ومواضع الأخطاء الشائعة' : 'Interactive visual study of the 5 general articulation organs and letters'}
                            </p>
                          </div>
                        </div>

                        <span className="bg-emerald-900 text-gold-300 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
                          {isRtl ? 'منظومة الجزرية — 17 مخرجاً خاصاً' : 'Al-Jazariyyah: 17 Sub-Points'}
                        </span>
                      </div>

                      {/* The 5 General Makhaarij Selector Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
                        {MAKHAARIJ_GENERAL_DATA.map((org) => {
                          const isActive = activeMakhrajId === org.id;
                          return (
                            <button
                              key={org.id}
                              type="button"
                              onClick={() => setActiveMakhrajId(org.id)}
                              className={'p-3 rounded-2xl border transition text-center flex flex-col items-center justify-center gap-1.5 ' + (
                                isActive
                                  ? 'bg-emerald-900 text-white border-gold-400 ring-2 ring-gold-400 shadow-md font-black'
                                  : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                              )}
                            >
                              <span className="text-2xl">{org.icon}</span>
                              <span className="text-xs font-bold font-cairo">{isRtl ? org.nameAr : org.nameEn}</span>
                              <span className={'text-[10px] px-2 py-0.5 rounded-full font-bold ' + (isActive ? 'bg-gold-500 text-emerald-950 font-black' : 'bg-slate-100 text-slate-600')}>
                                {org.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Makhraj Comprehensive Card */}
                      {(() => {
                        const makhraj = MAKHAARIJ_GENERAL_DATA.find(m => m.id === activeMakhrajId) || MAKHAARIJ_GENERAL_DATA[2];
                        return (
                          <div className="card-islamic-pearl border-2 border-emerald-900/20 rounded-3xl p-6 sm:p-8 shadow-md animate-fadeIn">
                            {/* Card Title & Organ Anatomy */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-emerald-900/10">
                              <div className="flex items-center gap-3">
                                <span className="text-4xl">{makhraj.icon}</span>
                                <div>
                                  <h4 className="text-xl sm:text-2xl font-black text-emerald-950 font-amiri">
                                    {isRtl ? 'المخرج العام: ' + makhraj.nameAr : makhraj.nameEn}
                                  </h4>
                                  <p className="text-xs sm:text-sm font-bold text-gold-700 mt-0.5">
                                    {isRtl ? makhraj.organAr : makhraj.organEn}
                                  </p>
                                </div>
                              </div>

                              <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold px-3 py-1 rounded-xl text-xs">
                                {makhraj.badge}
                              </span>
                            </div>

                            {/* Letters Array Display in High-Contrast Islamic Ivory Tiles (NO pitch black!) */}
                            <div className="mb-6 card-islamic-sage text-emerald-950 rounded-2xl p-5 shadow-sm border-2 border-emerald-700/25">
                              <div className="text-xs font-bold text-emerald-950 mb-3 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-800/15">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-gold-300 flex items-center justify-center text-xs font-bold shadow-xs">🔤</span>
                                  <span className="text-sm font-black font-cairo">{isRtl ? 'حروف هذا المخرج بالرسم العثماني المطهّر:' : 'Letters produced from this organ:'}</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-lg border border-emerald-300 font-cairo">
                                  {isRtl ? makhraj.lettersLabelAr : makhraj.lettersLabelEn}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start pt-2">
                                {makhraj.letters.map((lettr, lIdx) => (
                                  <div 
                                    key={lIdx}
                                    className="w-14 h-14 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 border-2 border-emerald-700/35 hover:border-gold-500 shadow-sm hover:shadow-md hover:scale-110 transition-all flex items-center justify-center cursor-pointer select-none"
                                    title={'حرف ' + lettr}
                                  >
                                    <span className="font-cairo font-black text-2xl leading-none text-center flex items-center justify-center w-full h-full select-none">
                                      {lettr}
                                    </span>
                                  </div>
                                ))}

                                {makhraj.id === 'khayshoom' && (
                                  <div className="bg-amber-100/90 text-emerald-950 border-2 border-gold-500 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-xs">
                                    <span className="text-2xl">👃</span>
                                    <div>
                                      <div className="text-xs font-black font-cairo">{isRtl ? 'صوت الغنة التجويدي الرخيم' : 'Ghunnah Resonant Sound'}</div>
                                      <div className="text-[11px] text-emerald-900 font-bold">{isRtl ? 'يخرج من الخيشوم بمقدار حركتين ويلازم (النون والميم)' : 'Resonates from nasal cavity for 2 counts in (N & M)'}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Two-Column Deep-Dive: Sound Generation vs Common Mistakes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Left: How sound is produced */}
                              <div className="card-islamic-pearl border border-emerald-300/80 rounded-2xl p-5 shadow-xs">
                                <div className="flex items-center gap-2 mb-2 font-bold text-emerald-900 text-sm">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'آلية توليد الحرف وخروج الصوت:' : 'Biomechanical Articulation:'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-cairo font-medium">
                                  {isRtl ? makhraj.mannerAr : makhraj.mannerEn}
                                </p>
                              </div>

                              {/* Right: Common Mistakes & Correction */}
                              <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-5 shadow-xs">
                                <div className="flex items-center gap-2 mb-2 font-bold text-rose-950 text-sm">
                                  <span>⚠️</span>
                                  <span>{isRtl ? 'أبرز الأخطاء الشائعة وطرق تقويم اللسان:' : 'Common Mistakes & Corrections:'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-cairo font-medium">
                                  {isRtl ? makhraj.commonMistakesAr : makhraj.commonMistakesEn}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ================= SUB-TAB 3: TIMING & HARAKAT METRONOME ================= */}
                {tajweedSubTab === 'metronome' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Pedagogical Explanation Guide Banner */}
                    <div className="card-islamic-amber rounded-3xl p-5 sm:p-6 border-2 border-gold-500/30 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl mt-0.5">💡</span>
                        <div className="space-y-1.5">
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                            {isRtl ? 'دليل المعلم: ما هي "الحركة" في ميزان التجويد الصوتي؟' : 'Teacher Guide: What is a "Harakah" in Tajweed Timing?'}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-cairo">
                            {isRtl 
                              ? 'الحركة هي وحدة قياس الزمن الصوتي للمدود والغُنن. وهي زمن مرن يتناسب طردياً مع سرعة تلاوة القارئ (تحقيقاً أو تدويراً أو حدراً). وتُقدّر تقليدياً بزمن قبض الإصبع أو بسطه بحركة متوسطة، وصوتياً بزمن النطق بحرف متحرّك (مثل: بَ، أو بُ، أو بِ)، فحركتان هما زمن نطق حرفين متحركين مثل (قَالَ).'
                              : 'A Harakah is the phonetic time unit for Madd and Ghunnah. It adapts proportionally to reading speed (Tahqeeq, Tadweer, Hadr). Traditionally estimated as folding or unfolding a finger at a moderate pace, or phonetically as the time to pronounce a single voweled letter.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Visual & Auditory Metronome Card */}
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/15 shadow-sm">
                      <div className="max-w-2xl mx-auto text-center">
                        <span className="text-4xl block mb-2">⏱️</span>
                        <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                          {isRtl ? 'ميزان ضبط الأزمنة والحركات الإيقاعي والصوتي' : 'Quranic Timing & Harakat Metronome'}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 mb-6 font-medium">
                          {isRtl ? 'أداة تدريب بصرية وصوتية إيقاعية لضبط أزمنة المدود والغُنَن بدقة تامة ومنع السرعة أو التمطيط' : 'Visual & auditory rhythmic tool to calibrate exact durations of Madd and Ghunnah'}
                        </p>

                        {/* 1. Harakat Target Count Selector */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {[
                            { count: 2, labelAr: 'حركتان (2)', subAr: 'طبيعي / غنة / بدل', color: 'border-emerald-500' },
                            { count: 4, labelAr: '4 حركات', subAr: 'منفصل / متصل وسط', color: 'border-amber-500' },
                            { count: 5, labelAr: '5 حركات', subAr: 'متصل / منفصل أقصى', color: 'border-orange-500' },
                            { count: 6, labelAr: '6 حركات', subAr: 'مد لازم كلمي وحرفي', color: 'border-rose-500' }
                          ].map(item => (
                            <button
                              key={item.count}
                              type="button"
                              onClick={() => {
                                setMetronomeCount(item.count);
                                setMetronomeBeat(1);
                              }}
                              className={'p-3 rounded-2xl border-2 transition ' + (
                                metronomeCount === item.count
                                  ? 'bg-emerald-900 text-white border-gold-400 ring-2 ring-gold-400 shadow-md font-black'
                                  : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                              )}
                            >
                              <span className="text-sm font-extrabold block font-cairo">{item.labelAr}</span>
                              <span className="text-[11px] block mt-0.5 opacity-90 font-medium">{item.subAr}</span>
                            </button>
                          ))}
                        </div>

                        {/* 2. Speed and Audio Options */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 mb-6 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-950 font-cairo">{isRtl ? 'سرعة التلاوة:' : 'Pace:'}</span>
                            {[
                              { id: 'tahqeeq', labelAr: 'تحقيق (بطيء)' },
                              { id: 'tadweer', labelAr: 'تدوير (معتدل)' },
                              { id: 'hadr', labelAr: 'حدر (سريع)' }
                            ].map(speed => (
                              <button
                                key={speed.id}
                                type="button"
                                onClick={() => setMetronomeSpeed(speed.id)}
                                className={'px-2.5 py-1 rounded-lg font-bold transition ' + (
                                  metronomeSpeed === speed.id
                                    ? 'bg-emerald-800 text-white shadow-xs'
                                    : 'bg-white text-emerald-950 border border-slate-300 hover:bg-slate-50'
                                )}
                              >
                                {speed.labelAr}
                              </button>
                            ))}
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950">
                            <input
                              type="checkbox"
                              checked={metronomeSound}
                              onChange={(e) => setMetronomeSound(e.target.checked)}
                              className="accent-emerald-700 w-4 h-4 rounded"
                            />
                            <span>{isRtl ? '🔊 صوت التكة الخشبية' : 'Sound tick'}</span>
                          </label>
                        </div>

                        {/* 3. Interactive Visual Pulse Metronome Card (Warm Emerald & Gold, NO pitch black!) */}
                        <div className="card-islamic-sage rounded-3xl p-6 sm:p-8 mb-6 border-2 border-emerald-800/30 shadow-md relative overflow-hidden flex flex-col items-center justify-center">
                          {/* Animated Pulse Beat Circles */}
                          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                            {Array.from({ length: metronomeCount }).map((_, idx) => {
                              const step = idx + 1;
                              const isCurrentBeat = metronomePlaying && metronomeBeat === step;
                              return (
                                <div
                                  key={step}
                                  className={'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-150 border-2 ' + (
                                    isCurrentBeat
                                      ? 'bg-gold-500 text-emerald-950 border-emerald-950 scale-125 shadow-[0_0_25px_rgba(234,179,8,0.9)] ring-4 ring-gold-300'
                                      : 'bg-white/90 text-emerald-900 border-emerald-700/30 shadow-xs'
                                  )}
                                >
                                  <span className="text-xl sm:text-2xl font-black leading-none font-cairo">{step}</span>
                                  <span className="text-[10px] font-bold leading-none mt-1 opacity-90">{isRtl ? 'حركة' : 'Beat'}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-emerald-950 font-bold text-sm mb-5 font-cairo">
                            {metronomePlaying 
                              ? (isRtl ? 'الحركة النشطة الآن: [ ' + metronomeBeat + ' من ' + metronomeCount + ' ]' : 'Active Beat: ' + metronomeBeat + ' of ' + metronomeCount)
                              : (isRtl ? 'الميزان متوقف — اضغط "بدء النبض الإيقاعي والصوتي"' : 'Metronome stopped')}
                          </div>

                          {/* Play / Stop Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!metronomePlaying && metronomeSound) {
                                playMetronomeTick(true);
                              }
                              setMetronomePlaying(!metronomePlaying);
                            }}
                            className={'px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base transition flex items-center gap-2 shadow-lg ' + (
                              metronomePlaying
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-gold-200 ring-2 ring-gold-400'
                            )}
                          >
                            <span className="text-lg">{metronomePlaying ? '⏹️' : '▶️'}</span>
                            <span>{isRtl ? (metronomePlaying ? 'إيقاف الميزان' : 'بدء النبض الإيقاعي والصوتي') : (metronomePlaying ? 'Stop' : 'Start Metronome')}</span>
                          </button>
                        </div>

                        {/* 4. Live Quranic Practice Examples for Selected Harakat */}
                        <div className="card-islamic-pearl border-2 border-emerald-800/20 rounded-2xl p-5 text-right shadow-xs">
                          <h4 className="text-xs font-bold text-emerald-950 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-900/10">
                            <span>📖</span>
                            <span>{isRtl ? 'أمثلة قرآنية تطبيقية لوزن ' + metronomeCount + ' حركات:' : 'Quranic Practice Examples for ' + metronomeCount + ' counts:'}</span>
                          </h4>

                          {metronomeCount === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                                <span className="font-bold text-emerald-900 block mb-1">المد الطبيعي (حركتان):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿قَالَ﴾ ﴿يَقُولُ﴾ ﴿قِيلَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">زمن نطق الألف أو الواو أو الياء دون زيادة.</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                                <span className="font-bold text-emerald-900 block mb-1">غنة النون والميم والإخفاء:</span>
                                <p className="font-quran text-lg text-emerald-950">﴿إِنَّ ٱللَّهَ﴾ ﴿عَمَّ يَتَسَآءَلُونَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">غنة متمكنة تخرج من الخيشوم بمقدار حركتين.</span>
                              </div>
                            </div>
                          )}

                          {metronomeCount === 4 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-amber-200">
                                <span className="font-bold text-amber-900 block mb-1">المد المنفصل (جائز 4 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿بِمَآ أُنزِلَ إِلَيْكَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">حرف المد في آخر كلمة وهمزة القطع في أول الكلمة التالية.</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-amber-200">
                                <span className="font-bold text-amber-900 block mb-1">المد المتصل (واجب 4 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿إِذَا جَآءَ نَصْرُ ٱللَّهِ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">حرف المد والهمزة مجتمعان في كلمة واحدة.</span>
                              </div>
                            </div>
                          )}

                          {metronomeCount === 5 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-orange-200">
                                <span className="font-bold text-orange-900 block mb-1">المد المتصل (فويق التوسط - 5 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿وَسِيٓءَتْ وُجُوهُ ٱلَّذِينَ كَفَرُواْ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">مرتبة فويق التوسط لحفص عن عاصم من طريق الشاطبية.</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-orange-200">
                                <span className="font-bold text-orange-900 block mb-1">المد المنفصل (فويق التوسط - 5 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿قُوٓاْ أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">يجوز مده 5 حركات توازياً مع مد المتصل.</span>
                              </div>
                            </div>
                          )}

                          {metronomeCount === 6 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-rose-200">
                                <span className="font-bold text-rose-900 block mb-1">المد اللازم الكلمي المثقل (6 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">حرف مد بعده حرف مشدد في كلمة واحدة (إشباع 6 حركات حتماً).</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-rose-200">
                                <span className="font-bold text-rose-900 block mb-1">المد اللازم الحرفي المثقل والمخفف:</span>
                                <p className="font-quran text-lg text-emerald-950">﴿الٓمٓ﴾ ﴿قٓ ۚ وَٱلْقُرْءَانِ ٱلْمَجِيدِ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">فواتح السور (نقص عسلكم) تُمد 6 حركات كاملة بالإجماع.</span>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>
      );
    }
