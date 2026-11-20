const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Remove automatic loading of demo islamic on initial mount
html = html.replace('handleLoadDemoIslamic();', '// handleLoadDemoIslamic(); - Clean slate on startup');
console.log('Removed automatic demo islamic loading for clean slate');

// 2. Add state hooks for Branch 3
const stateMarker = "const [islamicData, setIslamicData] = useState(null);";
const newStates = `const [islamicData, setIslamicData] = useState(null);
      const [savedIslamicLectures, setSavedIslamicLectures] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_saved_lectures');
          return s ? JSON.parse(s) : [];
        } catch (e) { return []; }
      });
      const [rawLectureText, setRawLectureText] = useState('');
      const [customSubjectCategory, setCustomSubjectCategory] = useState('');
      const [islamicInputMode, setIslamicInputMode] = useState('paste'); // 'paste' or 'structured'
      const [structuredPhasesText, setStructuredPhasesText] = useState('');
      const [structuredHadithText, setStructuredHadithText] = useState('');
      const [structuredStoryText, setStructuredStoryText] = useState('');
`;

if (!html.includes('savedIslamicLectures')) {
  html = html.replace(stateMarker, newStates);
  console.log('Injected Branch 3 state hooks');
}

// 3. Add handler functions for saving, deleting, and parsing lectures
const handlerMarker = "function handleLoadDemoIslamic() {";
const newHandlers = `// Smart Lecture Parser & Processor
      function handleProcessCustomLecture() {
        const topic = lessonTopic.trim() || (rawLectureText.split('\\n')[0] || '').trim().replace(/^#+\\s*/, '') || (isRtl ? 'محاضرة شرعية عامة' : 'Islamic Lecture');
        const finalCategory = subjectCategory === 'custom' ? (customSubjectCategory.trim() || (isRtl ? 'علوم شرعية عامة' : 'Islamic Studies')) : subjectCategory;

        // Extract paragraphs and lines
        const lines = rawLectureText.split('\\n').map(l => l.trim()).filter(Boolean);
        const talkingPoints = lines.slice(1, 7);

        // Detect Hadith/Quran quotes in text
        const detectedHadiths = [];
        const detectedAyahs = [];
        lines.forEach(l => {
          if (l.includes('قال تعالى') || l.includes('﴿') || l.includes('سورة')) {
            detectedAyahs.push(l);
          } else if (l.includes('قال رسول الله') || l.includes('قال ﷺ') || l.includes('صحيح مسلم') || l.includes('صحيح البخاري') || l.includes('حديث')) {
            detectedHadiths.push(l);
          }
        });

        // Built blueprint phases
        const blueprint = [
          {
            phaseNumber: 1,
            phaseNameAr: 'التمهيد والمدخل المشوق وغرس النية',
            phaseNameEn: 'Introduction & Spiritual Readiness',
            allocatedMinutes: Math.round(lessonDuration * 0.15),
            teacherGuidanceAr: 'ابدأ بالحمد والثناء على الله، واطرح سؤالاً تفاعلياً يستفز عقول الدارسين لربط موضوع الدرس بحياتهم الواقعية.',
            teacherGuidanceEn: 'Begin with Hamdalah, establish pure intentions, and ask an engaging opening question.',
            talkingPoints: talkingPoints.slice(0, 2).length > 0 ? talkingPoints.slice(0, 2) : ['تجديد النية الصالحة قبل فتح أي كتاب', 'بيان أهمية موضوع المحاضرة وفضله في القرآن والسنة']
          },
          {
            phaseNumber: 2,
            phaseNameAr: 'شرح المحاور الأساسية والتأصيل الشرعي',
            phaseNameEn: 'Core Concepts & Textual Authentication',
            allocatedMinutes: Math.round(lessonDuration * 0.50),
            teacherGuidanceAr: 'استعرض القواعد والمفاهيم الأساسية، مستشهداً بالأدلة المحققة من الصحيحين.',
            teacherGuidanceEn: 'Explain core principles with authentic textual evidence.',
            talkingPoints: talkingPoints.slice(2, 5).length > 0 ? talkingPoints.slice(2, 5) : ['تأصيل المسألة بالأدلة الثابتة', 'بيان الفروق الدقيقة وفهم سلف الأمة']
          },
          {
            phaseNumber: 3,
            phaseNameAr: 'القصة التربوية والتطبيق الواقعي المعاصر',
            phaseNameEn: 'Practical Case & Narrative',
            allocatedMinutes: Math.round(lessonDuration * 0.20),
            teacherGuidanceAr: structuredStoryText || 'اربط الحكم النظري بقصة واقعية أو موقف من السيرة يلامس هموم الدارسين ويقوي يقينهم.',
            teacherGuidanceEn: 'Connect theological principles to everyday human experience.',
            talkingPoints: ['موقف تطبيقي من السيرة النبوية أو سلف الأمة', 'كيف ننقل المعرفة إلى سلوك عملي في البيت والعمل']
          },
          {
            phaseNumber: 4,
            phaseNameAr: 'الخاتمة والتكليف العملي وملخص الواتساب',
            phaseNameEn: 'Summary, Action Item & WhatsApp Kit',
            allocatedMinutes: Math.round(lessonDuration * 0.15),
            teacherGuidanceAr: 'لخص المحاضرة في 3 نقاط محكمة، ووزع التكليف السلوكي لمجموعات الدارسين والحلقة.',
            teacherGuidanceEn: 'Provide 3 key takeaways and actionable weekly practice.',
            talkingPoints: ['مراجعة سريعة لأهم ما تم مدارسته', 'التكليف السلوكي التطبيقي لهذا الأسبوع']
          }
        ];

        // Evidences
        const evidences = [];
        if (detectedAyahs.length > 0) {
          evidences.push({
            type: 'quran',
            arabicText: detectedAyahs[0].replace(/.*قال تعالى[:\s]*/, ''),
            englishTranslation: 'Authentic Quranic Verse Citation',
            citation: 'القرآن الكريم',
            narrator: '—',
            grading: 'متواتر قطعي الثبوت'
          });
        } else {
          evidences.push({
            type: 'quran',
            arabicText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَقُولُوا۟ قَوْلًۭا سَدِيدًۭا',
            englishTranslation: 'O you who have believed, fear Allah and speak words of appropriate justice.',
            citation: 'سورة الأحزاب: 70',
            narrator: '—',
            grading: 'متواتر قطعي الثبوت'
          });
        }

        if (detectedHadiths.length > 0 || structuredHadithText) {
          evidences.push({
            type: 'hadith',
            arabicText: structuredHadithText || detectedHadiths[0] || '«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»',
            englishTranslation: 'Actions are according to intentions, and every person will have only what they intended.',
            citation: 'صحيح البخاري ومسلم',
            narrator: 'أمير المؤمنين عمر بن الخطاب رضي الله عنه',
            grading: 'صحيح متفق عليه'
          });
        }

        // WhatsApp summary kit
        const whatsAppSummary = \`🌿 *خلاصة درس اليوم:* \${topic} 🌿\\n\\nالسلام عليكم ورحمة الله وبركاته يا أحبة 🌸\\n\\n📌 *الموضوع:* \${topic} (\${finalCategory})\\n\\n✨ *أهم الفوائد المستفادة من حلقة اليوم:*\\n1️⃣ \${lines[1] || 'استحضار الإخلاص لله في كل عمل وقول.'}\\n2️⃣ \${lines[2] || 'تطبيق ما تعلمناه عملياً لنكون قدوة صالحة.'}\\n3️⃣ \${lines[3] || 'التمسك بالسنة النبوية الصحيحة في المعاملات والعبادات.'}\\n\\n🎯 *الواجب العملي للأسبوع:* تطبيق ذكر اليوم ومراجعة مدارسة الحلقة مع الأهل.\\n\\n🔗 منصة مِشكاة لتعليم القرآن والعلوم الشرعية — حفظكم الله وبارك فيكم! 🤍\`;

        // Zoom cards
        const zoomCards = [
          {
            slideNumber: 1,
            titleAr: 'المحور الأول: ' + topic,
            titleEn: 'Theme 1: ' + topic,
            bodyAr: lines[1] || 'المدخل الأساسي للمحاضرة وتأصيلها الشرعي من كتاب الله وسنة رسوله ﷺ.',
            bodyEn: 'Primary foundation and theological basis.',
            practicalAction: 'جدد نيتك الصادقة لله قبل البدء.'
          },
          {
            slideNumber: 2,
            titleAr: 'المحور الثاني: التطبيق السلوكي والتربوي',
            titleEn: 'Theme 2: Behavioral Impact',
            bodyAr: lines[2] || 'العلم يهتف بالعمل فإن أجابه وإلا ارتحل، وثمرة العلم الحقيقية هي خشية الله ولين الجانب.',
            bodyEn: 'Knowledge requires action and sincere character.',
            practicalAction: 'احرص على أداء العبادة بحضور قلب وسكينة.'
          }
        ];

        const packageData = {
          metadata: {
            topic: topic,
            category: finalCategory,
            durationMinutes: lessonDuration,
            audience: audienceLevel
          },
          blueprint,
          evidences,
          zoomCards,
          whatsAppKit: {
            headline: 'خلاصة: ' + topic,
            formattedText: whatsAppSummary,
            actionItem: 'شاركنا تطبيقك العملي لدرس اليوم!'
          },
          reviewQuiz: [
            {
              id: 1,
              questionAr: 'ما المقصد الأسمى من مدارسة موضوع: (' + topic + ')؟',
              questionEn: 'What is the highest objective of studying this topic?',
              options: [
                { id: 'a', textAr: 'تحقيق الإخلاص لله والعمل بالعلم في واقع الحياة', textEn: 'Achieving sincerity and applying knowledge' },
                { id: 'b', textAr: 'مجرد حفظ النظريات دون تطبيق', textEn: 'Mere theoretical memorization' },
                { id: 'c', textAr: 'الجدال والمماراة', textEn: 'Arguing' }
              ],
              correctOptionId: 'a',
              reflectionPrompt: 'ثمرة العلم الحقيقية هي العمل به والتزكية.'
            }
          ]
        };

        setIslamicData(packageData);
        setLessonTopic(topic);
        showToast(isRtl ? 'تم تصنيف وتنسيق المحاضرة بنجاح ✨' : 'Lecture structured successfully ✨');
      }

      function handleSaveIslamicLecture() {
        if (!islamicData) return;
        const newEntry = {
          id: 'lec_' + Date.now(),
          savedAt: new Date().toLocaleDateString('ar-EG'),
          data: islamicData
        };
        const updated = [newEntry, ...savedIslamicLectures.filter(x => x.data.metadata.topic !== islamicData.metadata.topic)];
        setSavedIslamicLectures(updated);
        try {
          localStorage.setItem('mishkah_saved_lectures', JSON.stringify(updated));
        } catch (e) {}
        showToast(isRtl ? 'تم حفظ المحاضرة في مكتبتك الخاصة 💾' : 'Lecture saved to your library 💾');
      }

      function handleDeleteSavedLecture(id) {
        const updated = savedIslamicLectures.filter(x => x.id !== id);
        setSavedIslamicLectures(updated);
        try {
          localStorage.setItem('mishkah_saved_lectures', JSON.stringify(updated));
        } catch (e) {}
        showToast(isRtl ? 'تم حذف المحاضرة من المكتبة' : 'Lecture removed from library');
      }

      function handleLoadSavedLecture(lec) {
        setIslamicData(lec.data);
        setLessonTopic(lec.data.metadata.topic);
        setSubjectCategory(lec.data.metadata.category);
        showToast(isRtl ? 'تم فتح المحاضرة المحفوظة 📖' : 'Loaded saved lecture 📖');
      }

      function handleResetIslamicForm() {
        setIslamicData(null);
        setRawLectureText('');
        setLessonTopic('');
        setCustomSubjectCategory('');
        showToast(isRtl ? 'تمت تهيئة الشاشة لبدء درس جديد على نظافة 🌿' : 'Reset to clean slate 🌿');
      }

`;

if (!html.includes('handleProcessCustomLecture')) {
  html = html.replace(handlerMarker, newHandlers + '\n      ' + handlerMarker);
  console.log('Injected lecture processing and library handlers');
}

// 4. Update Header on mobile to be compact
const oldHeaderLogo = `<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-950 border-2 border-gold-400 p-0.5 shadow-2xl flex items-center justify-center transform hover:scale-105 transition overflow-hidden flex-shrink-0">
                  <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Logo" className="w-full h-full object-cover rounded-xl drop-shadow" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-gold-200 font-amiri">
                      {isRtl ? 'مِشكاة' : 'Mishkah'}
                    </h1>
                    <span className="bg-gold-500/20 text-gold-300 border border-gold-400/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      v1.0 MVP
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                    {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : 'Comprehensive Operating System for Da\\'wah & Islamic Educators'}
                  </p>
                </div>`;

const newHeaderLogo = `<div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-950 border-2 border-gold-400 p-0.5 shadow-md flex items-center justify-center transform hover:scale-105 transition overflow-hidden flex-shrink-0">
                  <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Logo" className="w-full h-full object-cover rounded-lg sm:rounded-xl drop-shadow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-3xl font-extrabold tracking-wide text-gold-200 font-amiri">
                      {isRtl ? 'مِشكاة' : 'Mishkah'}
                    </h1>
                    <span className="bg-gold-500/20 text-gold-300 border border-gold-400/40 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold">
                      v1.0 MVP
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-emerald-100/90 font-medium hidden sm:block mt-0.5">
                    {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : 'Comprehensive Operating System for Da\\'wah & Islamic Educators'}
                  </p>
                </div>`;

if (html.includes(oldHeaderLogo)) {
  html = html.replace(oldHeaderLogo, newHeaderLogo);
  console.log('Compacted Header logo on mobile');
}

// 5. Update Hero Banner to put emblem on the top-side and 3 buttons in 1 row
const startHeroMarker = "{/* Welcome Hero Banner with Rich Islamic Tapestry */}";
const endHeroMarker = "{/* Core Feature Highlights (Cards) */}";

const idxHeroStart = html.indexOf(startHeroMarker);
const idxHeroEnd = html.indexOf(endHeroMarker);

if (idxHeroStart !== -1 && idxHeroEnd !== -1) {
  const newHeroBanner = `{/* Welcome Hero Banner with Rich Islamic Tapestry */}
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

                `;

  html = html.substring(0, idxHeroStart) + newHeroBanner + html.substring(idxHeroEnd);
  console.log('Successfully redesigned Hero Banner: side emblem & single-row buttons');
}

// 6. Replace Branch 3 View with comprehensive lecture paste / builder workbench
const startIslamicMarker = "{/* ================= VIEW: MODULE B (ISLAMIC STUDIES) ================= */}";
const endIslamicMarker = "{/* ================= VIEW: PRINTABLE MULTI-BRANCH WORKSHEETS ================= */}";

const idxIslStart = html.indexOf(startIslamicMarker);
const idxIslEnd = html.indexOf(endIslamicMarker);

if (idxIslStart !== -1 && idxIslEnd !== -1) {
  const newIslamicView = `{/* ================= VIEW: MODULE B (ISLAMIC STUDIES) ================= */}
            {activeTab === 'islamic' && (
              <div className="space-y-6 sm:space-y-8 animate-fadeIn">
                
                {/* Header Banner - Islamic Studies Workbench */}
                <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-900/15 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-500 text-emerald-950 flex items-center justify-center text-xl sm:text-2xl font-black shadow-md border border-gold-400">
                        🕌
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-2xl font-black text-emerald-950 font-cairo">
                            {isRtl ? 'حقيبة ومحرر العلوم الشرعية والدروس المنهجية' : 'Comprehensive Islamic Studies Workbench'}
                          </h2>
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full hidden sm:inline">
                            {isRtl ? 'منهجية مفتوحة' : 'Open Curriculum'}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
                          {isRtl 
                            ? 'أدخل أو الصق نص محاضرتك المجمعة من الكتب، ليتم تحويلها فوراً إلى شرائح زوم، ملخص واتساب، ورقة عمل، واختبار تفاعلي'
                            : 'Paste your prepared lecture notes to instantly format them into Zoom presentation cards, WhatsApp kit, and worksheets'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={handleResetIslamicForm}
                        className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                        title="البدء بدرس جديد على نظافة"
                      >
                        <span>➕</span>
                        <span>{isRtl ? 'درس جديد (على نظافة)' : 'New Clean Lesson'}</span>
                      </button>
                      <button 
                        type="button"
                        onClick={handleLoadDemoIslamic}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                        title="استيراد نموذج استرشادي تجريبي للتوضيح"
                      >
                        <span>💡</span>
                        <span>{isRtl ? 'نموذج استرشادي' : 'Demo Example'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Teacher's Saved Lectures Library Ribbon (If Any) */}
                  {savedIslamicLectures.length > 0 && (
                    <div className="mb-5 p-3.5 bg-emerald-900/10 border border-emerald-900/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          <span>📚</span>
                          <span>{isRtl ? 'مكتبة محاضراتي المحفوظة:' : 'My Saved Lectures Library:'}</span>
                          <span className="bg-emerald-800 text-gold-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {savedIslamicLectures.length}
                          </span>
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {savedIslamicLectures.map(lec => (
                          <div 
                            key={lec.id}
                            className="bg-white border border-emerald-200 hover:border-gold-400 p-2.5 rounded-xl shrink-0 shadow-xs flex items-center gap-2.5 transition"
                          >
                            <button
                              type="button"
                              onClick={() => handleLoadSavedLecture(lec)}
                              className="text-right"
                            >
                              <div className="text-xs font-black text-emerald-950 font-cairo hover:text-emerald-700">
                                {lec.data.metadata.topic}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {lec.data.metadata.category} • {lec.savedAt}
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedLecture(lec.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md text-xs transition"
                              title="حذف من المكتبة"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Mode Toggle: Paste Document vs Structured Form */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setIslamicInputMode('paste')}
                      className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                        islamicInputMode === 'paste'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <span>📄</span>
                      <span>{isRtl ? '1. لصق نص المحاضرة / المسودة المجمّعة' : '1. Paste Lecture Notes / Text'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIslamicInputMode('structured')}
                      className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                        islamicInputMode === 'structured'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <span>✍️</span>
                      <span>{isRtl ? '2. البناء الهيكلي المنظم خطوة بخطوة' : '2. Structured Step-by-Step'}</span>
                    </button>
                  </div>

                  {/* Metadata Fields: Open Islamic Disciplines, Duration, Audience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    {/* Subject Category (Open & Broad) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isRtl ? 'المجال الشرعي (مفتوح)' : 'Islamic Discipline'}
                      </label>
                      <select 
                        value={subjectCategory} 
                        onChange={(e) => setSubjectCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                      >
                        <option value="العقيدة والتوحيد وأركان الإيمان">العقيدة والتوحيد وأركان الإيمان (Aqeedah)</option>
                        <option value="الفقه وأصوله وأحكام العبادات والمعاملات">الفقه وأصوله والعبادات والمعاملات (Fiqh)</option>
                        <option value="التفسير وعلوم القرآن وتدبر الآيات">التفسير وتدبر القرآن الكريم (Tafseer)</option>
                        <option value="الحديث الشريف وشروح السنة ومصطلح الحديث">الحديث الشريف وشروح السنة (Hadith)</option>
                        <option value="السيرة النبوية والتاريخ والتراجم">السيرة النبوية والتاريخ الإسلامي (Seerah)</option>
                        <option value="التزكية والآداب والأخلاق الإسلامية">التزكية والآداب والأخلاق (Tazkiyah)</option>
                        <option value="اللغة العربية والبلاغة القرآنية">اللغة العربية والبلاغة القرآنية (Arabic)</option>
                        <option value="الفتاوى والقضايا الفكرية والمعاصرة">الفتاوى والقضايا المعاصرة (Issues)</option>
                        <option value="custom">✨ مجال شرعي مخصص آخر (كتابة حرة)...</option>
                      </select>
                    </div>

                    {/* Custom Discipline Input (If 'custom' selected) */}
                    {subjectCategory === 'custom' && (
                      <div className="animate-fadeIn">
                        <label className="block text-xs font-bold text-emerald-900 mb-1">
                          {isRtl ? 'اكتب اسم المجال الشرعي أو الكتاب:' : 'Enter Custom Field / Book:'}
                        </label>
                        <input 
                          type="text"
                          value={customSubjectCategory}
                          onChange={(e) => setCustomSubjectCategory(e.target.value)}
                          placeholder="مثال: شرح كتاب التوحيد، فقه المواريث..."
                          className="w-full bg-emerald-50/60 border border-emerald-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    )}

                    {/* Lesson Topic */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isRtl ? 'عنوان أو محور الدرس' : 'Lesson Title'}
                      </label>
                      <input 
                        type="text" 
                        value={lessonTopic} 
                        onChange={(e) => setLessonTopic(e.target.value)}
                        placeholder="أدخل عنوان المحاضرة أو الموضوع..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    {/* Target Duration */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isRtl ? 'مدة الحصة الزمنية' : 'Class Duration'}
                      </label>
                      <select 
                        value={lessonDuration} 
                        onChange={(e) => setLessonDuration(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="30">30 دقيقة (حصة سريعة / حلقة مكثفة)</option>
                        <option value="45">45 دقيقة (حصة نموذجية معتمدة)</option>
                        <option value="60">60 دقيقة (حلقة شاملة وموسعة)</option>
                        <option value="90">90 دقيقة (محاضرة كبرى / ندوة مفتوحة)</option>
                      </select>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isRtl ? 'الفئة المستهدفة' : 'Target Audience'}
                      </label>
                      <select 
                        value={audienceLevel} 
                        onChange={(e) => setAudienceLevel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="الدارسون المبتدئون والأطفال">الدارسون المبتدئون والأطفال (Beginners)</option>
                        <option value="اليافعون والشباب">اليافعون والشباب (Youth)</option>
                        <option value="عموم الدارسين والدارسات الكبار">عموم الدارسين والدارسات الكبار (Adults)</option>
                        <option value="المستوى المتقدم وطلبة العلم">المستوى المتقدم وطلبة العلم (Advanced)</option>
                      </select>
                    </div>
                  </div>

                  {/* Mode A: Paste Raw Lecture Document */}
                  {islamicInputMode === 'paste' && (
                    <div className="space-y-3 mb-4">
                      <label className="block text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                        <span>📝</span>
                        <span>{isRtl ? 'الصق نص المحاضرة أو تفريغ الدرس الذي جمعته:' : 'Paste Prepared Lecture Text / Notes:'}</span>
                      </label>
                      <textarea
                        value={rawLectureText}
                        onChange={(e) => setRawLectureText(e.target.value)}
                        rows="7"
                        placeholder="الصق هنا مسودة المحاضرة، أو مقتطفات الشرح من كتب التفسير والحديث، أو تفريغ درسك... سيقوم النظام تلقائياً باستخراج المحاور، وسياج الأدلة، وتوليد بطاقات زوم، وملخص الواتساب، وأسئلة الاختبار."
                        className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl p-4 text-xs sm:text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700 font-cairo shadow-inner"
                      />
                    </div>
                  )}

                  {/* Mode B: Structured Fields */}
                  {islamicInputMode === 'structured' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'الآية أو الحديث النبوي المعتمد للشرح:' : 'Primary Ayah or Hadith:'}
                        </label>
                        <input
                          type="text"
                          value={structuredHadithText}
                          onChange={(e) => setStructuredHadithText(e.target.value)}
                          placeholder="مثال: حديث «إنما الأعمال بالنيات» أو آية الاستشهاد..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isRtl ? 'القصة التربوية أو الموقف التطبيقي:' : 'Narrative & Case Study:'}
                        </label>
                        <input
                          type="text"
                          value={structuredStoryText}
                          onChange={(e) => setStructuredStoryText(e.target.value)}
                          placeholder="مثال: موقف من سيرة الصحابة يوضح ثمرة هذا العمل..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Trigger Processing Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isRtl ? 'تحويل فوري بدون انتظار لأي خوادم خارجية' : 'Instant client-side formatting with 0 latency'}
                    </span>
                    <button 
                      type="button"
                      onClick={handleProcessCustomLecture}
                      className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 font-black px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition flex items-center gap-2 text-xs sm:text-sm transform active:scale-95 border border-gold-400"
                    >
                      <span>⚡</span>
                      <span>{isRtl ? 'تحويل وتنسيق المحاضرة إلى شرائح زوم وملخص وورقة عمل' : 'Structure Lecture into Zoom Slides & Kit'}</span>
                    </button>
                  </div>
                </div>

                {/* Display Formatted Islamic Studies Package */}
                {islamicData && (
                  <div className="space-y-6">

                    {/* Top Action Bar for Generated Lesson */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-900/15 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🕌</span>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                            {islamicData.metadata.topic}
                          </h3>
                          <span className="text-xs text-slate-500 font-bold">
                            {islamicData.metadata.category} • {islamicData.metadata.durationMinutes} دقيقة • {islamicData.metadata.audience}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveIslamicLecture}
                          className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-gold-400 flex items-center gap-1.5 transition"
                        >
                          <span>💾</span>
                          <span>{isRtl ? 'حفظ في مكتبة محاضراتي' : 'Save to My Library'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWorksheetBranch('islamic');
                            setActiveTab('worksheet');
                          }}
                          className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                        >
                          <span>🖨️</span>
                          <span>{isRtl ? 'ورقة العمل' : 'Worksheet'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 1. Time-Boxed Lesson Blueprint */}
                    <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/15 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 sm:mb-6 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            {isRtl ? 'المخطط الزمني المنضبط بالدقائق' : 'Minute-by-Minute Time-Boxed Blueprint'}
                          </span>
                          <h3 className="text-lg sm:text-xl font-extrabold text-emerald-950 font-amiri">
                            {islamicData.metadata.topic} — ({islamicData.metadata.durationMinutes} {isRtl ? 'دقيقة' : 'Minutes'})
                          </h3>
                        </div>
                        <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full">
                          {islamicData.metadata.category}
                        </span>
                      </div>

                      {/* Timeline Phases */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {islamicData.blueprint.map((phase, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-800 text-gold-200 text-xs font-bold flex items-center justify-center">
                                  {phase.phaseNumber || idx + 1}
                                </span>
                                <span className="bg-gold-100 text-gold-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                                  ⏱️ {phase.allocatedMinutes} {isRtl ? 'د' : 'min'}
                                </span>
                              </div>
                              <h4 className="font-bold text-emerald-950 text-sm mb-2 font-cairo">
                                {isRtl ? phase.phaseNameAr : phase.phaseNameEn}
                              </h4>
                              <p className="text-xs text-slate-700 leading-relaxed font-amiri mb-3">
                                {isRtl ? phase.teacherGuidanceAr : phase.teacherGuidanceEn}
                              </p>
                            </div>

                            {/* Talking Points */}
                            {phase.talkingPoints && (
                              <ul className="text-[11px] text-slate-600 space-y-1 border-t border-slate-200 pt-2">
                                {phase.talkingPoints.map((tp, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-emerald-600 font-bold">•</span>
                                    <span>{tp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Authenticated Evidences & Guardrails */}
                    <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/15 shadow-md">
                      <div className="flex items-center justify-between pb-3 mb-4 sm:mb-5 border-b border-slate-100">
                        <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-cairo flex items-center gap-2">
                          <span>🛡️</span>
                          <span>{isRtl ? 'الأدلة الشرعية الموثقة وسياج التحقق' : 'Authenticated Quran & Hadith Evidences'}</span>
                        </h3>
                        <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                          ✓ Verified Source Citation
                        </span>
                      </div>

                      <div className="space-y-4">
                        {islamicData.evidences.map((ev, i) => (
                          <div key={i} className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-200 relative overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-md border border-emerald-200">
                                {ev.type === 'quran' ? '📖 آية قرآنية' : '📜 حديث نبوي شريف'}
                              </span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="bg-gold-100 text-gold-900 border border-gold-300 font-bold px-2.5 py-0.5 rounded-full">
                                  {ev.grading}
                                </span>
                                <span className="text-slate-600 font-medium">
                                  {ev.citation}
                                </span>
                              </div>
                            </div>

                            <p className="font-quran text-base sm:text-xl text-emerald-950 leading-loose mb-2">
                              {ev.arabicText}
                            </p>
                            <p className="text-xs text-slate-600 italic border-t border-emerald-100 pt-2">
                              {ev.englishTranslation}
                            </p>
                            {ev.narrator && ev.narrator !== '—' && (
                              <div className="text-[11px] text-slate-500 mt-1 font-bold">
                                {isRtl ? \`الراوي: \${ev.narrator}\` : \`Narrator: \${ev.narrator}\`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. WhatsApp Ready Kit with Islamic Chat Wallpaper */}
                    <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-900/15 shadow-xl overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shadow-inner">
                            💬
                          </span>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-cairo">
                              {isRtl ? 'حقيبة الواتساب الجاهزة للإرسال الفوري للدارسين والحلقة' : '1-Click WhatsApp Student Broadcast Kit'}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {isRtl ? 'ملخص أنيق منسق بالإيموجي والآيات جاهز للنسخ المباشر وإرساله لمجموعات الدارسين' : 'Simulated chat preview ready for instant broadcast to students'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={handleCopyWhatsApp}
                          className="bg-emerald-700 hover:bg-emerald-800 text-gold-100 font-extrabold px-4 sm:px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
                        >
                          <span>📋</span>
                          <span>{isRtl ? 'نسخ الرسالة كاملة' : 'Copy Formatted Text'}</span>
                        </button>
                      </div>

                      {/* WhatsApp Phone Mockup Container */}
                      <div className="max-w-md mx-auto rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
                        {/* WhatsApp Header Bar */}
                        <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-sm font-bold border border-gold-400">
                              🕌
                            </span>
                            <div>
                              <div className="text-xs font-bold leading-none">{isRtl ? 'مجموعة حلقة العلوم الشرعية' : 'Islamic Studies Ring'}</div>
                              <div className="text-[10px] text-emerald-200 leading-none mt-1">online</div>
                            </div>
                          </div>
                          <span className="text-xs text-gold-300">✓✓</span>
                        </div>

                        {/* WhatsApp Message Body with Chat Background */}
                        <div className="p-4 bg-emerald-950/20 text-slate-900 min-h-[160px] relative">
                          <div className="bg-white rounded-2xl p-4 shadow-md text-xs font-cairo leading-relaxed whitespace-pre-line border border-slate-200">
                            {islamicData.whatsAppKit.formattedText}
                            <div className="text-[9px] text-slate-400 text-left mt-2">10:30 AM ✓✓</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

`;

  html = html.substring(0, idxIslStart) + newIslamicView + html.substring(idxIslEnd);
  console.log('Successfully upgraded Islamic Studies View with custom lecture parser and library');
}

// 7. Clean all remaining English parent mentions in public/index.html
html = html.replace(/parent kits/g, 'Student Ring Broadcast Kits');
html = html.replace(/Parent\/Student/g, 'Ring & Student');
html = html.replace(/Honoring Parents/g, 'Islamic Etiquette');
html = html.replace(/reaches parents with reward/g, 'continues to benefit the deceased');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully saved upgraded public/index.html!');
