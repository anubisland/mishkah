    // TajweedZoomSlideBody: one slide of the tajweed Zoom presentation. Shared by the
    // teacher's presentation modal and the student screen.
    function TajweedZoomSlideBody({ activeSuwaydPlateId, currentSuwaydLesson, currentZoomSlides, isRtl, metronomeBeat, metronomeCount, metronomePlaying, setActiveSuwaydPlateId, setMetronomeCount, setMetronomePlaying, suwaydZoomSlideIndex }) {
                              const curSlide = currentZoomSlides[suwaydZoomSlideIndex] || currentZoomSlides[0];
                              if (!curSlide) return null;

                              /* ---------------- Slide Type 1: Overview (Matn & Illustrated Plate) ---------------- */
                              if (curSlide.type === 'overview') {
                                const lessonPlates = getSuwaydPlatesForLesson(currentSuwaydLesson.id);
                                const currentPlate = lessonPlates.find(p => p.id === activeSuwaydPlateId) || lessonPlates[0] || SUWAYD_PLATES[0];

                                return (
                                  <div className="space-y-5 animate-fadeIn">
                                    {/* Matn Citation */}
                                    <div className="bg-emerald-900/60 rounded-2xl p-4 sm:p-5 border border-gold-500/40 text-center shadow-md">
                                      <span className="text-xs font-bold text-gold-300 block mb-2">{isRtl ? 'الشاهد المعتمد من المتن المنظوم:' : 'Authentic Matn Citation:'}</span>
                                      <div className="font-naskh text-lg sm:text-2xl text-gold-100 font-bold leading-loose whitespace-pre-line select-all">
                                        {currentSuwaydLesson.matnVerseAr}
                                      </div>
                                    </div>

                                    {/* Authentic Plate Display in Zoom Presentation */}
                                    <div className="bg-white text-slate-900 rounded-3xl p-4 sm:p-6 border-2 border-gold-400 shadow-2xl max-w-2xl mx-auto space-y-3">
                                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-900/10">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">🖼️</span>
                                          <div>
                                            <h4 className="text-sm sm:text-base font-black text-emerald-950 font-cairo">
                                              {isRtl ? currentPlate.titleAr : currentPlate.titleEn}
                                            </h4>
                                            <p className="text-[11px] text-emerald-800 font-medium">
                                              {isRtl ? `كتاب التجويد المصور — ص ${currentPlate.pageInBook} (د. أيمن رشدي سويد)` : `Illustrated Tajweed — p. ${currentPlate.pageInBook} (Dr. Ayman Suwayd)`}
                                            </p>
                                          </div>
                                        </div>

                                        <span className="text-xs font-black bg-emerald-900 text-gold-200 px-3 py-1 rounded-xl shadow-xs">
                                          {isRtl ? 'د. أيمن رشدي سويد' : 'Dr. Ayman Suwayd'}
                                        </span>
                                      </div>

                                      {/* Horizontal Letter / Plate Switcher if lesson has multiple plates */}
                                      {lessonPlates.length > 1 && (
                                        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1 pb-1">
                                          {lessonPlates.map(lp => {
                                            const isSel = lp.id === currentPlate.id;
                                            return (
                                              <button
                                                key={lp.id}
                                                type="button"
                                                onClick={() => setActiveSuwaydPlateId(lp.id)}
                                                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                                                  isSel
                                                    ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                                                }`}
                                              >
                                                {lp.letters && lp.letters.length > 0 && <span className="font-quran text-gold-600 font-bold">{lp.letters.join('، ')}</span>}
                                                <span>{isRtl ? lp.titleAr.replace(/^.*:\s*/, '') : lp.titleEn.replace(/^.*:\s*/, '')}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}

                                      {/* High-Resolution Color Plate Image */}
                                      <div className="w-full flex items-center justify-center p-2 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/40 rounded-2xl border border-slate-200 shadow-inner">
                                        <img
                                          src={`images/tajweed/${currentPlate.filename}`}
                                          onError={(e) => {
                                            e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${currentPlate.slideNum}-638.jpg`;
                                          }}
                                          alt={currentPlate.titleAr}
                                          className="max-h-72 sm:max-h-84 w-auto object-contain rounded-xl drop-shadow"
                                          loading="eager"
                                        />
                                      </div>

                                      {/* Acoustic guidance text */}
                                      <p className="text-xs sm:text-sm text-slate-700 font-cairo leading-relaxed text-center px-2 font-medium">
                                        {isRtl ? currentPlate.descAr : currentPlate.descEn}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }

                              /* ---------------- Slide Type 2: Rule Breakdown (Letter, Mechanism, 3 Quranic Boxes) ---------------- */
                              if (curSlide.type === 'breakdown') {
                                const item = curSlide.item;
                                return (
                                  <div className="space-y-6 animate-fadeIn">
                                    {/* Breakdown Title & Badge Card */}
                                    <div className="bg-gradient-to-r from-emerald-900/80 via-emerald-950 to-slate-900 rounded-3xl p-5 border-2 border-gold-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
                                      <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gold-400 text-emerald-950 flex items-center justify-center font-quran text-3xl sm:text-4xl font-black shadow-lg ring-4 ring-gold-200/50 shrink-0">
                                          {item.letter}
                                        </div>
                                        <div>
                                          <h4 className="text-lg sm:text-2xl font-black text-gold-200 font-cairo">
                                            {item.titleAr}
                                          </h4>
                                          <span className="inline-block mt-1 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-800 text-gold-200 border border-gold-400/30">
                                            {item.tagAr}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="text-xs text-slate-300 font-cairo bg-slate-900/60 px-4 py-2 rounded-xl border border-white/10 hidden sm:block">
                                        {isRtl ? 'كتاب التجويد المصور — د. أيمن سويد' : 'Dr. Ayman Suwayd'}
                                      </div>
                                    </div>

                                    {/* Precise Phonetic Mechanism Explanation */}
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-inner">
                                      <span className="text-xs font-bold text-gold-300 block mb-1.5">
                                        {isRtl ? 'الآلية المخرجية والصوتية الدقيقة للحرف والحكم:' : 'Phonetic Articulation Mechanism:'}
                                      </span>
                                      <p className="text-sm sm:text-base text-slate-100 font-cairo leading-relaxed">
                                        {item.explanationAr}
                                      </p>
                                    </div>

                                    {/* The Three Large Uthmani Quranic Boxes */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {item.examples.map((ex, exI) => (
                                        <div
                                          key={exI}
                                          className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-5 border-2 border-gold-400/60 shadow-xl text-center flex flex-col justify-between hover:border-gold-300 transition duration-300"
                                        >
                                          <div className="text-xs font-bold text-gold-300 uppercase tracking-wider pb-2 border-b border-gold-500/20 mb-3">
                                            {ex.type}
                                          </div>

                                          <div className="py-4 font-quran text-4xl sm:text-5xl text-gold-200 font-black select-all tracking-wide drop-shadow-md">
                                            {ex.word}
                                          </div>

                                          <div className="pt-2 text-xs text-slate-300 font-cairo border-t border-gold-500/20 mt-3 font-medium">
                                            {ex.surah}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Authentic Performance Alert */}
                                    {item.warningAr && (
                                      <div className="bg-amber-950/70 border-2 border-amber-500/50 rounded-2xl p-4 text-amber-200 text-xs sm:text-sm font-cairo flex items-start gap-3 shadow-md">
                                        <span className="text-xl text-amber-400 shrink-0">⚠️</span>
                                        <div>
                                          <strong className="text-gold-300 block mb-1">
                                            {isRtl ? 'تنبيه الأداء والإتقان للشيخ والمعلم:' : 'Authentic Performance Alert:'}
                                          </strong>
                                          <p className="leading-relaxed">
                                            {item.warningAr}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              /* ---------------- Slide Type 3: Individual Example & Metronome ---------------- */
                              if (curSlide.type === 'example') {
                                const example = curSlide.example;
                                return (
                                  <div className="space-y-8 text-center animate-fadeIn">
                                    <div className="text-xs text-gold-300 font-bold uppercase tracking-widest">
                                      {example.surah}
                                    </div>

                                    {/* Big Quranic Word */}
                                    <div className="zoom-quran-box py-8 px-6 bg-gradient-to-b from-emerald-950 to-slate-950 rounded-3xl border-2 border-gold-400/60 shadow-[0_0_40px_rgba(217,119,6,0.25)] my-4">
                                      <div className="font-quran zoom-quran-gold text-5xl sm:text-7xl font-black select-all tracking-wide">
                                        {example.word}
                                      </div>
                                    </div>

                                    {/* Note */}
                                    <div className="bg-white/10 rounded-2xl p-4 max-w-xl mx-auto border border-white/20 text-slate-200 text-sm font-cairo">
                                      {example.note}
                                    </div>

                                    {/* Live Metronome inside Zoom slide */}
                                    <div className="flex items-center justify-center gap-3 pt-2">
                                      {Array.from({ length: currentSuwaydLesson.timingCounts }).map((_, bIdx) => {
                                        const beatNum = bIdx + 1;
                                        const isCurrentBeat = metronomePlaying && metronomeBeat === beatNum;
                                        return (
                                          <div
                                            key={beatNum}
                                            className={'w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-all ' + (
                                              isCurrentBeat
                                                ? 'bg-gold-400 text-emerald-950 scale-110 shadow-lg ring-4 ring-gold-200 font-black'
                                                : 'bg-emerald-900/80 text-gold-200 border border-gold-500/30'
                                            )}
                                          >
                                            <span>{beatNum}</span>
                                          </div>
                                        );
                                      })}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (metronomeCount !== currentSuwaydLesson.timingCounts) {
                                            setMetronomeCount(currentSuwaydLesson.timingCounts);
                                          }
                                          setMetronomePlaying(!metronomePlaying);
                                        }}
                                        className={'px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition ' + (
                                          metronomePlaying ? 'bg-rose-700 text-white' : 'bg-gold-500 text-emerald-950 font-black'
                                        )}
                                      >
                                        {metronomePlaying ? (isRtl ? '⏸️ إيقاف النبض' : '⏸️ Stop Metronome') : (isRtl ? '▶️ تشغيل النبض الصوتي' : '▶️ Play Metronome')}
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return null;
                            }
