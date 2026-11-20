const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// Normalize CRLF to LF for matching, or match with regex
function replaceNormalized(source, searchPattern, replacement) {
  const normSource = source.replace(/\r\n/g, '\n');
  const normSearch = searchPattern.replace(/\r\n/g, '\n');
  const normRepl = replacement.replace(/\r\n/g, '\n');

  if (!normSource.includes(normSearch)) {
    throw new Error('Search target not found in source!');
  }
  const result = normSource.replace(normSearch, normRepl);
  return result.replace(/\n/g, '\r\n');
}

// 1. Target state block
const stateTarget = `      // Multi-Branch Worksheets & Quizzes Control States
      const [worksheetBranch, setWorksheetBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [worksheetIslamicCategory, setWorksheetIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'
      const [quizBranch, setQuizBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [quizIslamicCategory, setQuizIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'`;

const stateReplacement = `      // Multi-Branch Worksheets & Quizzes Control States
      const [worksheetBranch, setWorksheetBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [worksheetIslamicCategory, setWorksheetIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'
      const [quizBranch, setQuizBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [quizIslamicCategory, setQuizIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'

      // ================= TEACHER TOOLS: WORKSHEET BUILDER STATES =================
      const [worksheetMode, setWorksheetMode] = useState('preview'); // 'preview' or 'builder'
      const [customIslamicWorksheets, setCustomIslamicWorksheets] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_islamic_worksheets');
          return s ? JSON.parse(s) : JSON.parse(JSON.stringify(ISLAMIC_BRANCH_WORKSHEETS));
        } catch (e) {
          return JSON.parse(JSON.stringify(ISLAMIC_BRANCH_WORKSHEETS));
        }
      });
      const [customTajweedWorksheet, setCustomTajweedWorksheet] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_tajweed_worksheet');
          if (s) return JSON.parse(s);
        } catch (e) {}
        return {
          titleAr: 'ورقة مدارسة وتطبيق في أحكام التجويد',
          titleEn: 'Tajweed Student Worksheet',
          surah: 'سورة الملك: الآيات 1-12',
          items: [
            { itemNumber: 1, wordUthmani: 'شَىْءٍ قَدِيرٌ', ruleApplied: 'إخفاء حقيقي بغنة مفخمة', reasonAr: 'تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء المفخمة)', maxScore: 5 },
            { itemNumber: 2, wordUthmani: 'خَلَقَ ٱلْمَوْتَ', ruleApplied: 'قلقلة صغرى', reasonAr: 'حرف القاف ساكن في وسط الكلمة / سكون أصلي مخفف', maxScore: 5 },
            { itemNumber: 3, wordUthmani: 'مِّن تَفَٰوُتٍ', ruleApplied: 'إخفاء حقيقي بغنة مرققة', reasonAr: 'نون ساكنة بعدها حرف التاء (من حروف الاستفال)', maxScore: 5 },
            { itemNumber: 4, wordUthmani: 'هَلْ تَرَىٰ مِن فُطُورٍ', ruleApplied: 'إظهار لامي + إخفاء نون', reasonAr: 'لام الحرف مظهرة + نون ساكنة بعدها حرف الفاء', maxScore: 5 }
          ]
        };
      });

      const [isAddingWorksheetItem, setIsAddingWorksheetItem] = useState(false);
      const [editingWorksheetItemIdx, setEditingWorksheetItemIdx] = useState(null);
      const [worksheetItemForm, setWorksheetItemForm] = useState({
        topic: '',
        scripture: '',
        studentQuestion: '',
        teacherAnswer: '',
        practicalImpact: '',
        maxScore: 5
      });

      const [isAddingTajweedItem, setIsAddingTajweedItem] = useState(false);
      const [editingTajweedItemIdx, setEditingTajweedItemIdx] = useState(null);
      const [tajweedItemForm, setTajweedItemForm] = useState({
        wordUthmani: '',
        ruleApplied: '',
        reasonAr: '',
        maxScore: 5
      });

      // ================= TEACHER TOOLS: QUIZ BUILDER STATES =================
      const [quizMode, setQuizMode] = useState('student'); // 'student' or 'builder'
      const [customIslamicQuizzes, setCustomIslamicQuizzes] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_islamic_quizzes');
          return s ? JSON.parse(s) : JSON.parse(JSON.stringify(ISLAMIC_BRANCH_QUIZZES));
        } catch (e) {
          return JSON.parse(JSON.stringify(ISLAMIC_BRANCH_QUIZZES));
        }
      });
      const [customTajweedQuizzes, setCustomTajweedQuizzes] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_tajweed_quizzes');
          if (s) return JSON.parse(s);
        } catch (e) {}
        const list = [];
        SUWAYD_TAJWEED_CURRICULUM.forEach(l => {
          l.quizQuestions.forEach((q, idx) => {
            list.push({
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
        return list;
      });
      const [customHifzQuizzes, setCustomHifzQuizzes] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_hifz_quizzes');
          return s ? JSON.parse(s) : JSON.parse(JSON.stringify(HIFZ_BRANCH_QUIZ));
        } catch (e) {
          return JSON.parse(JSON.stringify(HIFZ_BRANCH_QUIZ));
        }
      });

      const [isAddingQuizQuestion, setIsAddingQuizQuestion] = useState(false);
      const [editingQuizQuestionId, setEditingQuizQuestionId] = useState(null);
      const [quizQuestionForm, setQuizQuestionForm] = useState({
        questionAr: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        correctOptionId: 'a',
        explanationAr: ''
      });

      // Auto-save custom worksheets & quizzes
      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_islamic_worksheets', JSON.stringify(customIslamicWorksheets));
        } catch (e) {}
      }, [customIslamicWorksheets]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_tajweed_worksheet', JSON.stringify(customTajweedWorksheet));
        } catch (e) {}
      }, [customTajweedWorksheet]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_islamic_quizzes', JSON.stringify(customIslamicQuizzes));
        } catch (e) {}
      }, [customIslamicQuizzes]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_tajweed_quizzes', JSON.stringify(customTajweedQuizzes));
        } catch (e) {}
      }, [customTajweedQuizzes]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_hifz_quizzes', JSON.stringify(customHifzQuizzes));
        } catch (e) {}
      }, [customHifzQuizzes]);

      // Handlers for Islamic Worksheets
      const handleSaveWorksheetItem = (e) => {
        if (e) e.preventDefault();
        if (!worksheetItemForm.topic.trim()) {
          showToast(isRtl ? 'يرجى كتابة المسألة الشرعية' : 'Please enter the topic');
          return;
        }
        setCustomIslamicWorksheets(prev => {
          const current = prev[worksheetIslamicCategory] || JSON.parse(JSON.stringify(ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah));
          const items = [...(current.items || [])];
          if (editingWorksheetItemIdx !== null && editingWorksheetItemIdx >= 0) {
            items[editingWorksheetItemIdx] = {
              num: editingWorksheetItemIdx + 1,
              ...worksheetItemForm
            };
          } else {
            items.push({
              num: items.length + 1,
              ...worksheetItemForm
            });
          }
          return {
            ...prev,
            [worksheetIslamicCategory]: {
              ...current,
              items
            }
          };
        });
        setIsAddingWorksheetItem(false);
        setEditingWorksheetItemIdx(null);
        setWorksheetItemForm({ topic: '', scripture: '', studentQuestion: '', teacherAnswer: '', practicalImpact: '', maxScore: 5 });
        showToast(isRtl ? 'تم حفظ البند في ورقة العمل بنجاح 💾' : 'Item saved to worksheet 💾');
      };

      const handleDeleteWorksheetItem = (idx) => {
        setCustomIslamicWorksheets(prev => {
          const current = prev[worksheetIslamicCategory] || prev.aqeedah;
          const items = (current.items || []).filter((_, i) => i !== idx).map((it, i) => ({ ...it, num: i + 1 }));
          return {
            ...prev,
            [worksheetIslamicCategory]: {
              ...current,
              items
            }
          };
        });
        showToast(isRtl ? 'تم حذف البند من ورقة العمل 🗑️' : 'Item deleted 🗑️');
      };

      const handleResetIslamicWorksheet = () => {
        const canonical = ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
        setCustomIslamicWorksheets(prev => ({
          ...prev,
          [worksheetIslamicCategory]: JSON.parse(JSON.stringify(canonical))
        }));
        showToast(isRtl ? 'تمت استعادة ورقة العمل النموذجية المعتمدة 🔄' : 'Restored canonical template 🔄');
      };

      const handleClearIslamicWorksheet = () => {
        setCustomIslamicWorksheets(prev => {
          const current = prev[worksheetIslamicCategory] || prev.aqeedah;
          return {
            ...prev,
            [worksheetIslamicCategory]: {
              ...current,
              items: []
            }
          };
        });
        showToast(isRtl ? 'تم تفريغ ورقة العمل — يمكنك البدء على نظافة 🧹' : 'Worksheet cleared 🧹');
      };

      // Handlers for Tajweed Worksheets
      const handleSaveTajweedItem = (e) => {
        if (e) e.preventDefault();
        if (!tajweedItemForm.wordUthmani.trim()) {
          showToast(isRtl ? 'يرجى إدخال الكلمة القرآنية' : 'Please enter the Quranic word');
          return;
        }
        setCustomTajweedWorksheet(prev => {
          const items = [...(prev.items || [])];
          if (editingTajweedItemIdx !== null && editingTajweedItemIdx >= 0) {
            items[editingTajweedItemIdx] = {
              itemNumber: editingTajweedItemIdx + 1,
              ...tajweedItemForm
            };
          } else {
            items.push({
              itemNumber: items.length + 1,
              ...tajweedItemForm
            });
          }
          return { ...prev, items };
        });
        setIsAddingTajweedItem(false);
        setEditingTajweedItemIdx(null);
        setTajweedItemForm({ wordUthmani: '', ruleApplied: '', reasonAr: '', maxScore: 5 });
        showToast(isRtl ? 'تمت إضافة الكلمة والحكم التجويدي بنجاح 💾' : 'Tajweed word saved 💾');
      };

      const handleDeleteTajweedItem = (idx) => {
        setCustomTajweedWorksheet(prev => ({
          ...prev,
          items: (prev.items || []).filter((_, i) => i !== idx).map((it, i) => ({ ...it, itemNumber: i + 1 }))
        }));
        showToast(isRtl ? 'تم حذف الكلمة من ورقة التجويد 🗑️' : 'Tajweed item deleted 🗑️');
      };

      const handleResetTajweedWorksheet = () => {
        setCustomTajweedWorksheet({
          titleAr: 'ورقة مدارسة وتطبيق في أحكام التجويد',
          titleEn: 'Tajweed Student Worksheet',
          surah: 'سورة الملك: الآيات 1-12',
          items: [
            { itemNumber: 1, wordUthmani: 'شَىْءٍ قَدِيرٌ', ruleApplied: 'إخفاء حقيقي بغنة مفخمة', reasonAr: 'تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء المفخمة)', maxScore: 5 },
            { itemNumber: 2, wordUthmani: 'خَلَقَ ٱلْمَوْتَ', ruleApplied: 'قلقلة صغرى', reasonAr: 'حرف القاف ساكن في وسط الكلمة / سكون أصلي مخفف', maxScore: 5 },
            { itemNumber: 3, wordUthmani: 'مِّن تَفَٰوُتٍ', ruleApplied: 'إخفاء حقيقي بغنة مرققة', reasonAr: 'نون ساكنة بعدها حرف التاء (من حروف الاستفال)', maxScore: 5 },
            { itemNumber: 4, wordUthmani: 'هَلْ تَرَىٰ مِن فُطُورٍ', ruleApplied: 'إظهار لامي + إخفاء نون', reasonAr: 'لام الحرف مظهرة + نون ساكنة بعدها حرف الفاء', maxScore: 5 }
          ]
        });
        showToast(isRtl ? 'تمت استعادة ورقة التجويد النموذجية 🔄' : 'Tajweed worksheet reset 🔄');
      };

      const handleClearTajweedWorksheet = () => {
        setCustomTajweedWorksheet(prev => ({ ...prev, items: [] }));
        showToast(isRtl ? 'تم تفريغ ورقة التجويد للبدء على نظافة 🧹' : 'Tajweed worksheet cleared 🧹');
      };

      // Import from Active Branch 3 Lecture to Worksheet
      const handleTransferLectureToWorksheet = () => {
        if (!islamicData) {
          showToast(isRtl ? 'لا توجد محاضرة نشطة حالياً في حقيبة العلوم الشرعية' : 'No active lecture to transfer');
          return;
        }
        const newItems = [];
        (islamicData.blueprint || []).forEach((b, idx) => {
          newItems.push({
            num: idx + 1,
            topic: b.phaseNameAr || ('المحور ' + (idx + 1)),
            scripture: (islamicData.hadithVerification && islamicData.hadithVerification[0]?.text) || 'الدليل الشرعي المعتمد من الصحيحين',
            studentQuestion: 'ما المستفاد العملي والتأصيلي من ' + (b.phaseNameAr || 'هذا المحور') + '؟ مع الاستدلال.',
            teacherAnswer: b.teacherFocusAr || 'التأصيل العلمي والتربوي المنضبط المستخلص من المحاضرة.',
            practicalImpact: 'التطبيق العملي والسلوكي في حياة المسلم والدارس.',
            maxScore: 5
          });
        });
        setCustomIslamicWorksheets(prev => ({
          ...prev,
          [worksheetIslamicCategory]: {
            id: worksheetIslamicCategory,
            categoryAr: islamicData.metadata.category || 'العلوم الشرعية',
            categoryEn: 'Islamic Studies',
            titleAr: 'ورقة عمل وتطبيق: ' + (islamicData.metadata.topic || 'المحاضرة الشرعية'),
            titleEn: 'Worksheet: ' + (islamicData.metadata.topic || 'Islamic Lecture'),
            targetAudience: islamicData.metadata.audience || 'الدارسين والحلقة',
            quranRef: 'مقتبس من محاور المحاضرة الشرعية المعتمدة',
            hadithRef: (islamicData.hadithVerification && islamicData.hadithVerification[0]?.text) || 'تخريج صحيح البخاري / مسلم',
            items: newItems
          }
        }));
        setWorksheetBranch('islamic');
        setWorksheetMode('preview');
        setActiveTab('worksheet');
        showToast(isRtl ? 'تم نقل محاور المحاضرة إلى ورقة العمل للطباعة بنجاح ⚡' : 'Lecture transferred to worksheet ⚡');
      };

      // Import from Active Branch 3 Lecture to Quiz
      const handleTransferLectureToQuiz = () => {
        if (!islamicData || !islamicData.quizQuestions || !islamicData.quizQuestions.length) {
          showToast(isRtl ? 'لا توجد أسئلة مولدة في المحاضرة النشطة' : 'No generated questions in active lecture');
          return;
        }
        const qs = islamicData.quizQuestions.map((q, idx) => ({
          id: 'custom_lec_' + idx + '_' + Date.now(),
          questionAr: q.questionAr,
          questionEn: q.questionAr,
          options: (q.options || []).map(opt => ({
            id: opt.id,
            textAr: opt.textAr || opt.text,
            textEn: opt.textAr || opt.text
          })),
          correctOptionId: q.correctOptionId || 'a',
          explanationAr: q.reflectionPrompt || 'توجيه شرعي مستفاد من المحاضرة',
          explanationEn: q.reflectionPrompt || 'Islamic reflection from lecture'
        }));
        setCustomIslamicQuizzes(prev => ({
          ...prev,
          [quizIslamicCategory]: qs
        }));
        setQuizBranch('islamic');
        setQuizMode('student');
        setQuizAnswers({});
        setQuizSubmitted(false);
        setActiveTab('quiz');
        showToast(isRtl ? 'تم نقل أسئلة المحاضرة إلى الاختبار الذاتي التفاعلي بنجاح ⚡' : 'Lecture questions transferred to quiz ⚡');
      };

      // Import from Active Tajweed Lesson to Worksheet
      const handleTransferTajweedToWorksheet = () => {
        if (!tajweedData || !tajweedData.worksheet || !tajweedData.worksheet.length) {
          showToast(isRtl ? 'لا توجد كلمات في درس التجويد الحالي' : 'No words in current Tajweed lesson');
          return;
        }
        const items = tajweedData.worksheet.map((w, idx) => ({
          itemNumber: idx + 1,
          wordUthmani: w.wordUthmani,
          ruleApplied: w.ruleApplied,
          reasonAr: w.reasonAr || 'بيان المخرج والصفة والعلة الصوتية',
          maxScore: 5
        }));
        setCustomTajweedWorksheet({
          titleAr: 'ورقة عمل في أحكام التجويد: ' + (currentSuwaydLesson?.titleAr || tajweedData.metadata?.titleAr || 'درس التجويد'),
          titleEn: 'Tajweed Worksheet',
          surah: tajweedData.metadata?.surah || currentSuwaydLesson?.titleAr || 'سورة الملك',
          items
        });
        setWorksheetBranch('tajweed');
        setWorksheetMode('preview');
        setActiveTab('worksheet');
        showToast(isRtl ? 'تم نقل كلمات درس التجويد إلى ورقة العمل ⚡' : 'Tajweed words transferred to worksheet ⚡');
      };

      // Handlers for Quiz Question Management
      const handleSaveQuizQuestion = (e) => {
        if (e) e.preventDefault();
        if (!quizQuestionForm.questionAr.trim() || !quizQuestionForm.optA.trim() || !quizQuestionForm.optB.trim()) {
          showToast(isRtl ? 'يرجى كتابة نص السؤال وخيارين على الأقل' : 'Please enter question and at least 2 options');
          return;
        }
        const newQ = {
          id: editingQuizQuestionId || ('custom_q_' + Date.now()),
          questionAr: quizQuestionForm.questionAr.trim(),
          questionEn: quizQuestionForm.questionAr.trim(),
          options: [
            { id: 'a', textAr: quizQuestionForm.optA.trim(), textEn: quizQuestionForm.optA.trim() },
            { id: 'b', textAr: quizQuestionForm.optB.trim(), textEn: quizQuestionForm.optB.trim() },
            { id: 'c', textAr: quizQuestionForm.optC.trim() || (isRtl ? 'خيار إضافي' : 'Option C'), textEn: quizQuestionForm.optC.trim() || 'Option C' },
            { id: 'd', textAr: quizQuestionForm.optD.trim() || (isRtl ? 'خيار إضافي' : 'Option D'), textEn: quizQuestionForm.optD.trim() || 'Option D' }
          ],
          correctOptionId: quizQuestionForm.correctOptionId || 'a',
          explanationAr: quizQuestionForm.explanationAr.trim() || (isRtl ? 'تأصيل وتوجيه السؤال' : 'Explanation'),
          explanationEn: quizQuestionForm.explanationAr.trim() || 'Explanation'
        };

        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => {
            const list = [...(prev[quizIslamicCategory] || prev.aqeedah || [])];
            if (editingQuizQuestionId) {
              const idx = list.findIndex(item => item.id === editingQuizQuestionId);
              if (idx >= 0) list[idx] = newQ;
              else list.push(newQ);
            } else {
              list.push(newQ);
            }
            return { ...prev, [quizIslamicCategory]: list };
          });
        } else if (quizBranch === 'tajweed') {
          setCustomTajweedQuizzes(prev => {
            const list = [...(prev || [])];
            if (editingQuizQuestionId) {
              const idx = list.findIndex(item => item.id === editingQuizQuestionId);
              if (idx >= 0) list[idx] = newQ;
              else list.push(newQ);
            } else {
              list.push(newQ);
            }
            return list;
          });
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes(prev => {
            const list = [...(prev || [])];
            if (editingQuizQuestionId) {
              const idx = list.findIndex(item => item.id === editingQuizQuestionId);
              if (idx >= 0) list[idx] = newQ;
              else list.push(newQ);
            } else {
              list.push(newQ);
            }
            return list;
          });
        }

        setIsAddingQuizQuestion(false);
        setEditingQuizQuestionId(null);
        setQuizQuestionForm({ questionAr: '', optA: '', optB: '', optC: '', optD: '', correctOptionId: 'a', explanationAr: '' });
        showToast(isRtl ? 'تم حفظ السؤال في بنك الاختبار بنجاح 💾' : 'Question saved to quiz bank 💾');
      };

      const handleDeleteQuizQuestion = (qId) => {
        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => ({
            ...prev,
            [quizIslamicCategory]: (prev[quizIslamicCategory] || []).filter(q => q.id !== qId)
          }));
        } else if (quizBranch === 'tajweed') {
          setCustomTajweedQuizzes(prev => (prev || []).filter(q => q.id !== qId));
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes(prev => (prev || []).filter(q => q.id !== qId));
        }
        showToast(isRtl ? 'تم حذف السؤال من بنك الاختبار 🗑️' : 'Question deleted 🗑️');
      };

      const handleResetQuizQuestions = () => {
        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => ({
            ...prev,
            [quizIslamicCategory]: JSON.parse(JSON.stringify(ISLAMIC_BRANCH_QUIZZES[quizIslamicCategory] || ISLAMIC_BRANCH_QUIZZES.aqeedah))
          }));
        } else if (quizBranch === 'tajweed') {
          const list = [];
          SUWAYD_TAJWEED_CURRICULUM.forEach(l => {
            l.quizQuestions.forEach((q, idx) => {
              list.push({
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
          setCustomTajweedQuizzes(list);
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes(JSON.parse(JSON.stringify(HIFZ_BRANCH_QUIZ)));
        }
        showToast(isRtl ? 'تمت استعادة الأسئلة النموذجية المعتمدة 🔄' : 'Restored canonical quiz questions 🔄');
      };

      const handleClearQuizQuestions = () => {
        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => ({ ...prev, [quizIslamicCategory]: [] }));
        } else if (quizBranch === 'tajweed') {
          setCustomTajweedQuizzes([]);
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes([]);
        }
        showToast(isRtl ? 'تم تفريغ أسئلة الاختبار للبدء على نظافة 🧹' : 'Quiz cleared 🧹');
      };`;

html = replaceNormalized(html, stateTarget, stateReplacement);
console.log('State replaced successfully!');

// 2. Replace activeQuizQuestions computation
const quizMemoTarget = `      // Dynamic Multi-Branch Quiz Selection
      const activeQuizQuestions = useMemo(() => {
        if (quizBranch === 'islamic') {
          return ISLAMIC_BRANCH_QUIZZES[quizIslamicCategory] || ISLAMIC_BRANCH_QUIZZES.aqeedah;
        } else if (quizBranch === 'tajweed') {
          // Grounded in Dr. Ayman Suwayd Illustrated Tajweed
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
          return suwaydQuestions;
        } else if (quizBranch === 'hifz') {
          return HIFZ_BRANCH_QUIZ;
        }
        return [];
      }, [quizBranch, quizIslamicCategory, tajweedData]);`;

const quizMemoReplacement = `      // Dynamic Multi-Branch Quiz Selection (Teacher Customizable Question Bank)
      const activeQuizQuestions = useMemo(() => {
        if (quizBranch === 'islamic') {
          return customIslamicQuizzes[quizIslamicCategory] || customIslamicQuizzes.aqeedah || [];
        } else if (quizBranch === 'tajweed') {
          return customTajweedQuizzes || [];
        } else if (quizBranch === 'hifz') {
          return customHifzQuizzes || [];
        }
        return [];
      }, [quizBranch, quizIslamicCategory, customIslamicQuizzes, customTajweedQuizzes, customHifzQuizzes]);`;

html = replaceNormalized(html, quizMemoTarget, quizMemoReplacement);
console.log('Quiz memo replaced successfully!');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Saved index.html checkpoint 1');
