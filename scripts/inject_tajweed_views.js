const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const tajweedStartMarker = `{activeTab === 'tajweed' && (
              <div className="space-y-8 animate-fadeIn">`;

const tajweedEndMarker = `{/* ================= VIEW: HIFZ & RECITATION WORKBENCH (BRANCH 1) ================= */}`;

const p1 = html.indexOf(tajweedStartMarker);
const p2 = html.indexOf(tajweedEndMarker);

if (p1 !== -1 && p2 !== -1) {
  // Let's inspect what is between p1 and p2
  const currentTajweedBody = html.slice(p1 + tajweedStartMarker.length, p2).trim();
  // Strip trailing `</div>\n            )}`
  const lastDivIdx = currentTajweedBody.lastIndexOf('</div>');
  const generatorContent = currentTajweedBody.slice(0, lastDivIdx).trim();

  const newTajweedSection = `{activeTab === 'tajweed' && (
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
                    {/* Tab 1: Lesson & Slides Generator */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('generator')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border ' + (
                        tajweedSubTab === 'generator'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>📑</span>
                      <span>{isRtl ? '1. مُولّد الدروس وبطاقات زوم' : '1. Lesson & Slides'}</span>
                    </button>

                    {/* Tab 2: Interactive Makhaarij Atlas */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('makhaarij')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border ' + (
                        tajweedSubTab === 'makhaarij'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>🗣️</span>
                      <span>{isRtl ? '2. أطلس مخارج الحروف الخمسة' : '2. Articulation Atlas'}</span>
                    </button>

                    {/* Tab 3: Visual Timing Metronome */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('metronome')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border ' + (
                        tajweedSubTab === 'metronome'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>⏱️</span>
                      <span>{isRtl ? '3. ميزان الأزمنة والحركات الإيقاعي' : '3. Timing Metronome'}</span>
                    </button>
                  </div>
                </div>

                {/* ================= SUB-TAB 1: LESSON & SLIDES GENERATOR ================= */}
                {tajweedSubTab === 'generator' && (
                  <div className="space-y-8 animate-fadeIn">
                    ${generatorContent}
                  </div>
                )}

                {/* ================= SUB-TAB 2: INTERACTIVE ARTICULATION ATLAS ================= */}
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
                          <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-emerald-900/20 rounded-3xl p-6 sm:p-8 shadow-md animate-fadeIn">
                            {/* Card Title & Organ Anatomy */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
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

                              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-3 py-1 rounded-xl text-xs">
                                {makhraj.badge}
                              </span>
                            </div>

                            {/* Letters Array Display in Uthmani Boxes */}
                            <div className="mb-6 bg-emerald-950 text-white rounded-2xl p-5 shadow-inner border border-gold-500/40">
                              <div className="text-xs font-bold text-gold-300 mb-3 flex items-center justify-between">
                                <span>{isRtl ? 'حروف هذا المخرج بالرسم العثماني:' : 'Letters produced from this organ:'}</span>
                                <span className="text-[11px] text-slate-300">{isRtl ? makhraj.lettersLabelAr : makhraj.lettersLabelEn}</span>
                              </div>

                              <div className="flex flex-wrap gap-2.5 items-center justify-center sm:justify-start">
                                {makhraj.letters.map((lettr, lIdx) => (
                                  <div 
                                    key={lIdx}
                                    className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-gold-400/60 hover:bg-gold-500 hover:text-emerald-950 text-gold-300 flex items-center justify-center font-quran text-2xl font-bold shadow transition cursor-default"
                                    title={'حرف ' + lettr}
                                  >
                                    {lettr}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Two-Column Deep-Dive: Sound Generation vs Common Mistakes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Left: How sound is produced */}
                              <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2 font-bold text-emerald-900 text-sm">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'آلية توليد الحرف وخروج الصوت:' : 'Biomechanical Articulation:'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-cairo">
                                  {isRtl ? makhraj.mannerAr : makhraj.mannerEn}
                                </p>
                              </div>

                              {/* Right: Common Mistakes & Correction */}
                              <div className="bg-rose-50/80 border border-rose-300 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2 font-bold text-rose-900 text-sm">
                                  <span>⚠️</span>
                                  <span>{isRtl ? 'أبرز الأخطاء الشائعة وطرق تقويم اللسان:' : 'Common Mistakes & Corrections:'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-cairo">
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
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/15 shadow-sm text-center">
                      <div className="max-w-xl mx-auto">
                        <span className="text-4xl block mb-2">⏱️</span>
                        <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                          {isRtl ? 'ميزان ضبط الأزمنة والحركات الإيقاعي' : 'Quranic Timing & Harakat Metronome'}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 mb-6 font-medium">
                          {isRtl ? 'أداة تدريب بصرية إيقاعية لضبط أزمنة المدود والغُنَن بدقة تامة ومنع السرعة أو التمطيط' : 'Visual metronome to calibrate exact durations of Madd and Ghunnah'}
                        </p>

                        {/* Harakat Target Selector */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                          {[
                            { count: 2, labelAr: 'حركتان (2)', subAr: 'طبيعي / غنة / بدل', color: 'border-emerald-400' },
                            { count: 4, labelAr: '4 حركات', subAr: 'منفصل / متصل وسط', color: 'border-amber-400' },
                            { count: 5, labelAr: '5 حركات', subAr: 'متصل / منفصل أقصى', color: 'border-orange-400' },
                            { count: 6, labelAr: '6 حركات', subAr: 'مد لازم كلمي وحرفي', color: 'border-rose-400' }
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
                              <span className="text-[10px] text-gold-300 block mt-0.5 opacity-90">{item.subAr}</span>
                            </button>
                          ))}
                        </div>

                        {/* Interactive Visual Pulse Rings */}
                        <div className="bg-emerald-950 text-white rounded-3xl p-8 mb-6 border-2 border-gold-400/50 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                          {/* Animated Pulse Beat Circles */}
                          <div className="flex items-center justify-center gap-3 mb-6">
                            {Array.from({ length: metronomeCount }).map((_, idx) => {
                              const step = idx + 1;
                              const isCurrentBeat = metronomePlaying && metronomeBeat === step;
                              return (
                                <div
                                  key={step}
                                  className={'w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-black transition-all duration-200 border-2 ' + (
                                    isCurrentBeat
                                      ? 'bg-gold-500 text-emerald-950 border-white scale-125 shadow-[0_0_25px_rgba(234,179,8,0.8)]'
                                      : 'bg-white/10 text-gold-300 border-gold-400/40'
                                  )}
                                >
                                  {step}
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-gold-300 font-bold text-sm mb-4 font-cairo">
                            {metronomePlaying 
                              ? (isRtl ? 'الحركة النشطة الآن: ' + metronomeBeat + ' من ' + metronomeCount : 'Active Beat: ' + metronomeBeat + ' of ' + metronomeCount)
                              : (isRtl ? 'الميزان متوقف — اضغط "بدء النبض الإيقاعي"' : 'Metronome stopped')}
                          </div>

                          {/* Play / Stop Button */}
                          <button
                            type="button"
                            onClick={() => setMetronomePlaying(!metronomePlaying)}
                            className={'px-8 py-3 rounded-2xl font-black text-sm transition flex items-center gap-2 shadow-lg ' + (
                              metronomePlaying
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-gold-500 hover:bg-gold-400 text-emerald-950'
                            )}
                          >
                            <span>{metronomePlaying ? '⏹️' : '▶️'}</span>
                            <span>{isRtl ? (metronomePlaying ? 'إيقاف الميزان' : 'بدء النبض الإيقاعي البصري') : (metronomePlaying ? 'Stop' : 'Start Metronome')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
`;

  html = html.slice(0, p1) + newTajweedSection + '\n            ' + html.slice(p2);
  console.log('Successfully injected Tajweed sub-navigation and Makhaarij + Metronome views!');
} else {
  console.error('Could not find p1 or p2 markers');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved public/index.html');
