const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Prepare curriculum data & SVG renderer
const curriculumData = fs.readFileSync('scripts/suwayd_curriculum_code.js', 'utf8');
const svgRenderer = fs.readFileSync('scripts/suwayd_svg_code.js', 'utf8');

const constantsToInject = `
${curriculumData}

${svgRenderer}
`;

// Insert before '    // Main Application Component'
if (!html.includes('SUWAYD_TAJWEED_CURRICULUM')) {
  const targetApp = '    // Main Application Component';
  html = html.replace(targetApp, constantsToInject + '\n' + targetApp);
  console.log('Injected SUWAYD_TAJWEED_CURRICULUM and renderSuwaydAnatomySvg');
}

// 2. Add state variables inside App()
const stateTarget = "const [tajweedSubTab, setTajweedSubTab] = useState('generator'); // 'generator', 'makhaarij', 'metronome'";
const statesToInject = `const [tajweedSubTab, setTajweedSubTab] = useState('generator'); // 'generator', 'makhaarij', 'metronome'
      const [suwaydLessonId, setSuwaydLessonId] = useState('ikhfaa_haqiqi');
      const [suwaydFilterCategory, setSuwaydFilterCategory] = useState('all');
      const [suwaydZoomModalOpen, setSuwaydZoomModalOpen] = useState(false);
      const [suwaydZoomSlideIndex, setSuwaydZoomSlideIndex] = useState(0);
      const [suwaydQuizModalOpen, setSuwaydQuizModalOpen] = useState(false);
      const [suwaydQuizAnswers, setSuwaydQuizAnswers] = useState({});
      const [suwaydQuizSubmitted, setSuwaydQuizSubmitted] = useState(false);

      const currentSuwaydLesson = useMemo(() => {
        return SUWAYD_TAJWEED_CURRICULUM.find(l => l.id === suwaydLessonId) || SUWAYD_TAJWEED_CURRICULUM[0];
      }, [suwaydLessonId]);
`;

if (!html.includes('suwaydLessonId')) {
  html = html.replace(stateTarget, statesToInject);
  console.log('Injected Suwayd state hooks');
}

// 3. Update activeQuizQuestions for tajweed
const oldTajweedQuiz = "return tajweedData?.quiz || [];";
const newTajweedQuiz = `// Grounded in Dr. Ayman Suwayd Illustrated Tajweed
          const suwaydQuestions = [];
          SUWAYD_TAJWEED_CURRICULUM.forEach(l => {
            l.quizQuestions.forEach((q, idx) => {
              suwaydQuestions.push({
                id: l.id + '_q' + idx,
                lessonTitle: l.titleAr,
                questionAr: '[' + l.titleAr + '] ' + q.qAr,
                questionEn: q.qAr,
                options: q.opts.map(o => ({ id: o.id, textAr: o.text, textEn: o.text })),
                correctOptionId: q.correct,
                explanationAr: q.exp,
                explanationEn: q.exp
              });
            });
          });
          return suwaydQuestions;`;

if (html.includes(oldTajweedQuiz)) {
  html = html.replace(oldTajweedQuiz, newTajweedQuiz);
  console.log('Updated activeQuizQuestions for tajweed');
}

// 4. Update Tab 1 button label
const oldTab1Btn = "<span>{isRtl ? '1. مُولّد الدروس وبطاقات زوم' : '1. Lesson & Slides'}</span>";
const newTab1Btn = "<span>{isRtl ? '1. حقيبة التجويد المصور (د. أيمن سويد)' : '1. Illustrated Tajweed (Dr. Suwayd)'}</span>";
if (html.includes(oldTab1Btn)) {
  html = html.replace(oldTab1Btn, newTab1Btn);
  console.log('Updated Tab 1 button label');
}

// 5. Replace {tajweedSubTab === 'generator' && ( ... )}
const startMarker = "{tajweedSubTab === 'generator' && (";
const endMarker = "{tajweedSubTab === 'makhaarij' && (";

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newSubTab1Content = `{tajweedSubTab === 'generator' && (
                  <div className="space-y-8 animate-fadeIn">
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
                                {isRtl ? 'حقيبة التجويد المصور — المرجع المعتمد: د. أيمن رشدي سويد' : 'Illustrated Tajweed Curriculum — Dr. Ayman Suwayd'}
                              </h2>
                              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                {isRtl ? 'تحضير جاهز وموثق 100%' : '100% Pre-loaded'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-1">
                              {isRtl
                                ? 'منهج تجويدي متكامل: نصوص المتون الموثقة، المقاطع التشريحية الدقيقة، الأمثلة بالرسم العثماني، وميزان الحركات المدمج'
                                : 'Complete pedagogical workbench: Matn citations, anatomical cross-sections, Uthmani script examples, and live rhythmic metronome'}
                            </p>
                          </div>
                        </div>

                        {/* Hafs badge */}
                        <div className="flex items-center gap-2">
                          <span className="bg-gold-500/15 text-emerald-950 border border-gold-400 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
                            رواية حفص عن عاصم من طريق الشاطبية
                          </span>
                        </div>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-slate-500 ml-1">
                          {isRtl ? 'أبواب التجويد:' : 'Chapters:'}
                        </span>
                        {[
                          { id: 'all', labelAr: 'كافة الأبواب (6)', count: 6 },
                          { id: 'noon_sakinah', labelAr: 'أحكام النون والتنوين (3)', count: 3 },
                          { id: 'meem_sakinah', labelAr: 'أحكام الميم الساكنة (1)', count: 1 },
                          { id: 'madd_rules', labelAr: 'أحكام المدود (1)', count: 1 },
                          { id: 'sifat_letters', labelAr: 'صفات الحروف والقلقلة (1)', count: 1 }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSuwaydFilterCategory(cat.id)}
                            className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                              suwaydFilterCategory === cat.id
                                ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            )}
                          >
                            <span>{cat.labelAr}</span>
                          </button>
                        ))}
                      </div>

                      {/* Lessons Horizontal Ribbon */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/80">
                        {SUWAYD_TAJWEED_CURRICULUM
                          .filter(l => suwaydFilterCategory === 'all' || l.categoryId === suwaydFilterCategory)
                          .map(lesson => {
                            const isSelected = suwaydLessonId === lesson.id;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  setSuwaydLessonId(lesson.id);
                                  setMetronomeCount(lesson.timingCounts);
                                  setMetronomePlaying(false);
                                  setMetronomeBeat(1);
                                }}
                                className={'p-3.5 rounded-2xl text-right transition border flex flex-col justify-between ' + (
                                  isSelected
                                    ? 'bg-emerald-900 text-white border-gold-400 shadow-md ring-2 ring-gold-400'
                                    : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-800'
                                )}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={'text-[10px] font-bold px-2 py-0.5 rounded-md ' + (
                                      isSelected ? 'bg-emerald-800 text-gold-300' : 'bg-slate-100 text-slate-600'
                                    )}>
                                      {lesson.categoryAr}
                                    </span>
                                    <span className={'text-[11px] font-bold ' + (isSelected ? 'text-gold-300' : 'text-emerald-700')}>
                                      ⏱️ {lesson.timingLabelAr}
                                    </span>
                                  </div>
                                  <h4 className={'text-sm font-black font-cairo leading-snug ' + (
                                    isSelected ? 'text-gold-200' : 'text-emerald-950'
                                  )}>
                                    {lesson.titleAr}
                                  </h4>
                                </div>
                                <div className={'text-[10px] mt-2 font-medium ' + (isSelected ? 'text-slate-300' : 'text-slate-500')}>
                                  {lesson.suwaydRef}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* ================= MASTER PRESENTATION CARD (ALL-IN-ONE) ================= */}
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/20 shadow-xl space-y-6">
                      {/* Card Title & Suwayd Citation Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-900/15">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-gold-500 text-xl font-bold">۞</span>
                            <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                              {currentSuwaydLesson.titleAr}
                            </h3>
                          </div>
                          <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
                            <span>📚</span>
                            <span>{currentSuwaydLesson.suwaydRef}</span>
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
                            onClick={() => {
                              setWorksheetBranch('tajweed');
                              setActiveTab('worksheets');
                            }}
                            className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                          >
                            <span>🖨️</span>
                            <span>{isRtl ? 'ورقة العمل' : 'Worksheet'}</span>
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
                              {currentSuwaydLesson.definitionAr}
                            </p>
                          </div>

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
                                        {ex.surah}
                                      </td>
                                      <td className="p-2.5 text-emerald-900 font-medium font-cairo text-xs leading-snug">
                                        {ex.note}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* ================= INTEGRATED HARAKAT METRONOME ================= */}
                          <div className="card-islamic-amber rounded-2xl p-5 border-2 border-amber-300 shadow-md">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-300/60">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-amber-500 text-emerald-950 flex items-center justify-center font-black text-lg shadow-xs">
                                  ⏱️
                                </span>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-black text-amber-950 font-cairo">
                                    {isRtl ? 'ميزان الحركات المدمج مع الدرس والتطبيق الصوتي' : 'Integrated Lesson Harakat Metronome'}
                                  </h4>
                                  <p className="text-[11px] text-amber-800 font-medium">
                                    {currentSuwaydLesson.timingDescription}
                                  </p>
                                </div>
                              </div>

                              {/* Speed selector */}
                              <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-amber-300">
                                {[
                                  { id: 'tahqeeq', label: 'تحقيق (بطيء)' },
                                  { id: 'tadweer', label: 'تدوير (معتدل)' },
                                  { id: 'hadr', label: 'حدر (سريع)' }
                                ].map(sp => (
                                  <button
                                    key={sp.id}
                                    type="button"
                                    onClick={() => setMetronomeSpeed(sp.id)}
                                    className={'px-2 py-1 rounded-lg text-[10px] font-bold transition ' + (
                                      metronomeSpeed === sp.id
                                        ? 'bg-amber-600 text-white font-black shadow-xs'
                                        : 'text-amber-900 hover:bg-amber-100'
                                    )}
                                  >
                                    {sp.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Metronome Pulse Grid & Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              {/* Rhythmic beat indicator circles */}
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
                                      <span className="text-[9px] font-medium leading-none mt-0.5">حركة</span>
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
                                  <span>{metronomePlaying ? 'إيقاف الميزان' : 'تشغيل النبض التجويدي'}</span>
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
                          <div className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                                <span>🗣️</span>
                                <span>{isRtl ? 'المقطع التشريحي التوضيحي:' : 'Anatomical Cross-Section:'}</span>
                              </h4>
                              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                                التجويد المصور
                              </span>
                            </div>

                            {/* Render Vector SVG */}
                            <div className="w-full flex items-center justify-center p-1 bg-slate-50/50 rounded-xl border border-slate-100">
                              {renderSuwaydAnatomySvg(currentSuwaydLesson.svgType)}
                            </div>
                            <p className="text-[10px] text-center text-slate-500 font-medium mt-2">
                              {isRtl ? 'مخطط بياني توضيحي مستوحى من كتاب التجويد المصور لفضيلة د. أيمن سويد' : 'Diagrammatic vector illustration inspired by Dr. Ayman Suwayd'}
                            </p>
                          </div>

                          {/* Anatomical Mechanism Card */}
                          <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs">
                            <h4 className="text-xs font-extrabold text-emerald-950 mb-2 flex items-center gap-1.5">
                              <span>⚙️</span>
                              <span>{isRtl ? 'الآلية التشريحية وحركة أعضاء النطق:' : 'Biomechanical Mechanism:'}</span>
                            </h4>
                            <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed font-cairo">
                              {currentSuwaydLesson.mechanismAr}
                            </p>
                          </div>

                          {/* Common Mistakes Card */}
                          <div className="bg-rose-50/60 rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs">
                            <h4 className="text-xs font-extrabold text-rose-950 mb-2 flex items-center gap-1.5">
                              <span>⚠️</span>
                              <span>{isRtl ? 'أبرز الأخطاء الشائعة وطرق تقويم اللسان:' : 'Common Mistakes & Fixes:'}</span>
                            </h4>
                            <p className="text-xs font-medium text-rose-950 leading-relaxed font-cairo whitespace-pre-line">
                              {currentSuwaydLesson.commonMistakesAr}
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
                                  {currentSuwaydLesson.teacherPromptAr}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ================= FULLSCREEN ZOOM PRESENTATION MODAL ================= */}
                    {suwaydZoomModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
                        <div className="bg-gradient-to-b from-emerald-950 to-slate-950 text-white rounded-3xl max-w-4xl w-full border-2 border-gold-400/80 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[92vh] overflow-y-auto">
                          {/* Modal Header */}
                          <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gold-400 font-bold">۞</span>
                                <h3 className="text-lg sm:text-xl font-black text-gold-200 font-cairo">
                                  {currentSuwaydLesson.titleAr}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5">
                                {currentSuwaydLesson.suwaydRef} — شريحة العرض لبرنامج Zoom
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSuwaydZoomModalOpen(false)}
                              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center transition border border-slate-700"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Modal Slide Body */}
                          <div className="py-6 flex-1 flex flex-col justify-center">
                            {suwaydZoomSlideIndex === 0 ? (
                              /* Slide 0: Matn and Anatomical Cross Section */
                              <div className="space-y-6">
                                <div className="bg-emerald-900/60 rounded-2xl p-5 border border-gold-500/40 text-center">
                                  <span className="text-xs font-bold text-gold-300 block mb-2">الشاهد المعتمد من المتن:</span>
                                  <div className="font-naskh text-lg sm:text-xl text-gold-100 font-bold leading-loose whitespace-pre-line">
                                    {currentSuwaydLesson.matnVerseAr}
                                  </div>
                                </div>

                                <div className="bg-white/95 rounded-2xl p-3 border border-emerald-400 max-w-md mx-auto">
                                  {renderSuwaydAnatomySvg(currentSuwaydLesson.svgType)}
                                </div>
                              </div>
                            ) : (
                              /* Slide 1+: Individual Quranic Word & Live Metronome */
                              (() => {
                                const example = currentSuwaydLesson.examples[suwaydZoomSlideIndex - 1];
                                if (!example) return null;
                                return (
                                  <div className="space-y-8 text-center">
                                    <div className="text-xs text-gold-300 font-bold uppercase tracking-widest">
                                      {example.surah}
                                    </div>

                                    {/* Big Quranic Word */}
                                    <div className="font-quran text-4xl sm:text-6xl text-gold-200 font-bold py-6 px-4 bg-emerald-900/40 rounded-3xl border border-gold-400/30 shadow-inner">
                                      {example.word}
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
                                        {metronomePlaying ? '⏸️ إيقاف النبض' : '▶️ تشغيل النبض الصوتي'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()
                            )}
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

                            <span className="text-xs font-bold text-gold-300">
                              {suwaydZoomSlideIndex + 1} / {currentSuwaydLesson.examples.length + 1}
                            </span>

                            <button
                              type="button"
                              disabled={suwaydZoomSlideIndex >= currentSuwaydLesson.examples.length}
                              onClick={() => setSuwaydZoomSlideIndex(prev => Math.min(currentSuwaydLesson.examples.length, prev + 1))}
                              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-emerald-950 font-black text-xs transition"
                            >
                              {isRtl ? 'الشريحة التالية ▶' : 'Next ▶'}
                            </button>
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
                                {currentSuwaydLesson.titleAr}
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
                                          <span>{opt.text}</span>
                                          {suwaydQuizSubmitted && opt.id === q.correct && <span className="font-bold">✓</span>}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {suwaydQuizSubmitted && (
                                    <div className={'mt-3 p-3 rounded-xl text-xs font-cairo leading-relaxed border ' + (
                                      isCorrect ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                                    )}>
                                      <strong>{isCorrect ? '✓ أحسنت بارك الله فيك:' : '✗ تصحيح د. أيمن سويد:'}</strong> {q.exp}
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

`;

  html = html.substring(0, startIndex) + newSubTab1Content + html.substring(endIndex);
  console.log('Successfully replaced Tajweed SubTab 1 with Dr. Ayman Suwayd workbench!');
} else {
  console.error('Could not find markers:', { startIndex, endIndex });
  process.exit(1);
}

// 6. Update worksheetBranch === 'tajweed' to use currentSuwaydLesson fallback
const oldWsTableCheck = "<span>{isRtl ? 'السورة والآيات:' : 'Surah:'} {tajweedData?.metadata?.surah} ({tajweedData?.metadata?.ayahRange})</span>";
const newWsTableCheck = "<span>{isRtl ? 'السورة والآيات:' : 'Surah:'} {tajweedData?.metadata?.surah || currentSuwaydLesson.titleAr}</span>";
if (html.includes(oldWsTableCheck)) {
  html = html.replace(oldWsTableCheck, newWsTableCheck);
  console.log('Updated worksheet surah header');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully saved public/index.html!');
