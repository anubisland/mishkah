    // DashboardTab: the "dashboard" screen, moved out of App unchanged.
    // Every App value it reads arrives as a prop of the same name.
    function DashboardTab({ isRtl, setActiveTab, tajweedData }) {
      return (
        <div className="space-y-8 animate-fadeIn">
                
                {/* Welcome Hero Banner with Rich Islamic Tapestry */}
                <div className="islamic-hero-banner rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white relative overflow-hidden shadow-lg border-2 border-gold-400/30 mb-5">
                  {/* Islamic Corner Rosette Accents */}
                  <div className="absolute top-2 right-3 text-gold-300/30 text-base sm:text-lg font-amiri pointer-events-none select-none">۞</div>
                  <div className="absolute top-2 left-3 text-gold-300/30 text-base sm:text-lg font-amiri pointer-events-none select-none">۞</div>

                  {/* Top Row: Title & Badge + Small Side Emblem */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1.5 bg-gold-400/20 text-gold-200 border border-gold-400/40 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold mb-1">
                        <span>✨</span>
                        <span>{isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : "Comprehensive OS for Da'wah & Islamic Educators"}</span>
                      </div>
                      <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold font-amiri text-gold-200 leading-snug">
                        {isRtl ? 'منظومة متكاملة لحلقات القرآن، التجويد، والعلوم الشرعية' : 'Integrated OS for Quran, Tajweed, Islamic Studies & Ring Tracking'}
                      </h2>
                    </div>

                    {/* Official Emblem: Moved to top side, small and elegant on mobile! */}
                    <div className="shrink-0 w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-b from-gold-300 via-gold-500 to-emerald-950 shadow-md border-2 border-gold-300/80 transform hover:scale-105 transition flex items-center justify-center overflow-hidden">
                      <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Official App Icon" className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
                    </div>
                  </div>

                  {/* 3 Buttons in ONE single row on mobile (grid-cols-3) */}
                  <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:items-center sm:gap-3 pt-1">
                    <button 
                      onClick={() => setActiveTab('hifz')}
                      className="bg-gold-400 hover:bg-gold-300 text-emerald-950 font-black px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] sm:text-sm text-center"
                    >
                      <span className="text-sm sm:text-base">🕋</span>
                      <span className="leading-tight">{isRtl ? 'التحفيظ' : 'Hifz'}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('tajweed')}
                      className="bg-emerald-900/90 hover:bg-emerald-800 text-gold-200 border border-gold-400/60 font-bold px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] sm:text-sm text-center"
                    >
                      <span className="text-sm sm:text-base">📖</span>
                      <span className="leading-tight">{isRtl ? 'التجويد' : 'Tajweed'}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('islamic')}
                      className="bg-emerald-950/80 hover:bg-emerald-950 border border-gold-400/60 text-gold-200 font-bold px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] sm:text-sm text-center"
                    >
                      <span className="text-sm sm:text-base">🕌</span>
                      <span className="leading-tight">{isRtl ? 'العلوم الشرعية' : 'Islamic'}</span>
                    </button>
                  </div>
                </div>

                {/* Core Feature Highlights (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    {
                      titleAr: 'بطاقات شرح زوم التفاعلية',
                      titleEn: 'Zoom Teaching Cards',
                      descAr: 'عرض عالي التباين بخط عثماني وتلوين تلقائي لحكم التجويد ومخارج الحروف التشريحية.',
                      descEn: 'High-contrast presentation mode with color-coded Uthmani script and anatomical articulation notes.',
                      icon: '🖥️',
                      tag: 'Module A'
                    },
                    {
                      titleAr: 'أوراق عمل قابلة للطباعة (PDF)',
                      titleEn: 'Printable Worksheets',
                      descAr: 'جدول منظم: الكلمة القرآنية | الحكم | العلة والسبب، مع نموذج إجابة خاص بالمعلم.',
                      descEn: 'Clean structured tables with dual versions: student blank sheet and teacher answer key.',
                      icon: '🖨️',
                      tag: 'Print Ready'
                    },
                    {
                      titleAr: 'حقيبة الواتساب بنقرة واحدة',
                      titleEn: '1-Click WhatsApp Kit',
                      descAr: 'ملخص موجز من 10 أسطر منسق بالإيموجي والآيات جاهز للنسخ المباشر لمجموعات الدارسين والحلقة.',
                      descEn: '10-line emoji-formatted executive summary ready for instant broadcast to learner/student groups.',
                      icon: '📱',
                      tag: 'Module B'
                    },
                    {
                      titleAr: 'سياج التوثيق الشرعي الصارم',
                      titleEn: 'Authenticity Guardrails',
                      descAr: 'عزو صريح للأحاديث (الراوي + مصدر صحيح البخاري/مسلم + درجة الصحة) وعزو الآيات بالاسم والرقم.',
                      descEn: 'Strict verification badges: exact Surah/Ayah references, primary Hadith sources, and Sahih status.',
                      icon: '🛡️',
                      tag: 'Zero Weak Hadith'
                    }
                  ].map((card, idx) => {
                    const themeClass = [
                      'card-islamic-sage',
                      'card-islamic-amber',
                      'card-islamic-sky',
                      'card-islamic-lavender'
                    ][idx % 4];
                    return (
                      <div key={idx} className={`${themeClass} rounded-2xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">{card.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/85 text-emerald-900 border border-emerald-900/15 px-2.5 py-0.5 rounded-full shadow-xs">
                            {card.tag}
                          </span>
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mb-1.5 font-cairo">
                          {isRtl ? card.titleAr : card.titleEn}
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {isRtl ? card.descAr : card.descEn}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Inspection of Active Prepared Lesson */}
                {tajweedData && (
                  <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/10 shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                          {isRtl ? 'الدرس النشط حالياً في الذاكرة' : 'Currently Active Prepared Lesson'}
                        </span>
                        <h3 className="text-xl font-extrabold text-emerald-950 font-amiri mt-0.5">
                          {tajweedData.metadata.surah} ({tajweedData.metadata.ayahRange}) — {tajweedData.metadata.ruleNameAr}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveTab('tajweed')}
                          className="bg-emerald-700 text-white hover:bg-emerald-800 text-xs px-3.5 py-1.5 rounded-lg font-bold transition"
                        >
                          {isRtl ? 'فتح كتاب التجويد' : 'Open the tajweed book'}
                        </button>
                        <button 
                          onClick={() => setActiveTab('worksheet')}
                          className="bg-gold-50 text-gold-700 border border-gold-300 hover:bg-gold-100 text-xs px-3.5 py-1.5 rounded-lg font-bold transition"
                        >
                          {isRtl ? 'طباعة ورقة العمل' : 'Print Worksheet'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-emerald-800 font-bold block mb-1">
                          {isRtl ? 'المخرج الصوتي التشريحي:' : 'Anatomical Articulation:'}
                        </span>
                        <p className="text-slate-700 leading-relaxed font-amiri text-sm">
                          {isRtl ? tajweedData.ruleDefinition.anatomicalMakhrajAr : tajweedData.ruleDefinition.anatomicalMakhrajEn}
                        </p>
                      </div>
                      <div className="bg-gold-50/70 p-3.5 rounded-xl border border-gold-200">
                        <span className="text-gold-800 font-bold block mb-1">
                          {isRtl ? 'المقدار والزمن:' : 'Timing & Counts:'}
                        </span>
                        <p className="text-slate-700 font-bold text-sm">
                          {tajweedData.ruleDefinition.timingOrHarakat}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-bold block mb-1">
                          {isRtl ? 'المرجع المعتمد:' : 'Textbook Reference:'}
                        </span>
                        <p className="text-slate-600">
                          {tajweedData.metadata.textbookSource}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
      );
    }
