const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

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

// 1. Add script tags for Mammoth & PDF.js in <head>
const headScriptTarget = `  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`;

const headScriptReplacement = `  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Client-side Document Extractors for Word (.docx) and PDF Files -->
  <script src="libs/mammoth.browser.min.js"></script>
  <script src="libs/pdf.min.js"></script>
  <script>
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'libs/pdf.worker.min.js';
    }
  </script>`;

if (!html.includes('libs/mammoth.browser.min.js')) {
  html = replaceNormalized(html, headScriptTarget, headScriptReplacement);
  console.log('Script tags inserted into <head>!');
}

// 2. Add library & file upload states to App component
const stateTarget = `      // Module B: Islamic Studies State
      const [subjectCategory, setSubjectCategory] = useState('العقيدة (Aqeedah)');
      const [lessonTopic, setLessonTopic] = useState('أركان الإيمان الستة والسكينة النفسية');
      const [lessonDuration, setLessonDuration] = useState(45);
      const [audienceLevel, setAudienceLevel] = useState('اليافعين والمهتدين الجدد (Bilingual Youth)');
      const [islamicData, setIslamicData] = useState(null);
      const [savedIslamicLectures, setSavedIslamicLectures] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_saved_lectures');
          return s ? JSON.parse(s) : [];
        } catch (e) { return []; }
      });
      const [rawLectureText, setRawLectureText] = useState('');
      const [customSubjectCategory, setCustomSubjectCategory] = useState('');
      const [islamicInputMode, setIslamicInputMode] = useState('paste'); // 'paste' or 'structured'`;

const stateReplacement = `      // Module B: Islamic Studies State
      const [subjectCategory, setSubjectCategory] = useState('العقيدة (Aqeedah)');
      const [lessonTopic, setLessonTopic] = useState('أركان الإيمان الستة والسكينة النفسية');
      const [lessonDuration, setLessonDuration] = useState(45);
      const [audienceLevel, setAudienceLevel] = useState('اليافعين والمهتدين الجدد (Bilingual Youth)');
      const [islamicData, setIslamicData] = useState(null);
      const [savedIslamicLectures, setSavedIslamicLectures] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_saved_lectures');
          return s ? JSON.parse(s) : [];
        } catch (e) { return []; }
      });
      const [rawLectureText, setRawLectureText] = useState('');
      const [customSubjectCategory, setCustomSubjectCategory] = useState('');
      const [islamicInputMode, setIslamicInputMode] = useState('file'); // 'file', 'paste', or 'structured'
      
      // Teacher Library View & File Upload States
      const [islamicSubView, setIslamicSubView] = useState('workbench'); // 'workbench' or 'library'
      const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { name, sizeKb, wordCount, lineCount }
      const [isExtractingFile, setIsExtractingFile] = useState(false);
      const [librarySearchQuery, setLibrarySearchQuery] = useState('');
      const [libraryFilterDiscipline, setLibraryFilterDiscipline] = useState('all');`;

if (html.includes(stateTarget)) {
  html = replaceNormalized(html, stateTarget, stateReplacement);
  console.log('States updated!');
}

// 3. Add handleFileUpload and Library export/import handlers
const handlersTarget = `      function handleDeleteSavedLecture(id) {
        const updated = savedIslamicLectures.filter(x => x.id !== id);
        setSavedIslamicLectures(updated);
        try {
          localStorage.setItem('mishkah_saved_lectures', JSON.stringify(updated));
        } catch (e) {}
        showToast(isRtl ? 'تم حذف المحاضرة من المكتبة' : 'Lecture removed from library');
      }`;

const handlersReplacement = `      function handleDeleteSavedLecture(id) {
        const updated = savedIslamicLectures.filter(x => x.id !== id);
        setSavedIslamicLectures(updated);
        try {
          localStorage.setItem('mishkah_saved_lectures', JSON.stringify(updated));
        } catch (e) {}
        showToast(isRtl ? 'تم حذف المحاضرة من المكتبة' : 'Lecture removed from library');
      }

      // Universal Document Extractor for Word (.docx), PDF (.pdf), and Text (.txt, .md)
      async function handleLectureFileUpload(file) {
        if (!file) return;
        setIsExtractingFile(true);
        try {
          let extractedText = '';
          const fname = file.name;
          const ext = fname.substring(fname.lastIndexOf('.')).toLowerCase();

          if (ext === '.docx' || ext === '.doc') {
            const arrayBuffer = await file.arrayBuffer();
            if (window.mammoth) {
              const res = await window.mammoth.extractRawText({ arrayBuffer });
              extractedText = res.value || '';
            } else {
              throw new Error('Mammoth Word parser not loaded');
            }
          } else if (ext === '.pdf') {
            const arrayBuffer = await file.arrayBuffer();
            if (window.pdfjsLib) {
              const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
              const pdf = await loadingTask.promise;
              let pagesText = [];
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageStr = content.items.map(item => item.str).join(' ');
                pagesText.push(pageStr);
              }
              extractedText = pagesText.join('\\n\\n');
            } else {
              throw new Error('PDF.js parser not loaded');
            }
          } else {
            // Text or Markdown
            extractedText = await file.text();
          }

          if (!extractedText || !extractedText.trim()) {
            showToast(isRtl ? 'لم يتم العثور على نصوص مقروءة داخل الملف' : 'No readable text found in file');
            setIsExtractingFile(false);
            return;
          }

          setRawLectureText(extractedText);

          // Infer topic title
          const cleanName = fname.replace(/\\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const firstLine = extractedText.split('\\n').map(l => l.trim()).find(l => l.length > 5 && l.length < 100);
          const suggestedTopic = firstLine || cleanName;
          setLessonTopic(suggestedTopic);

          const words = extractedText.trim().split(/\\s+/).length;
          const sizeKb = Math.round(file.size / 1024);
          setUploadedFileInfo({
            name: fname,
            sizeKb,
            wordCount: words,
            lineCount: extractedText.split('\\n').length
          });

          showToast(isRtl ? ('تم استخراج نص الملف بنجاح (' + words + ' كلمة) 📄') : ('Extracted ' + words + ' words successfully 📄'));
        } catch (err) {
          console.error('File extraction error:', err);
          showToast(isRtl ? 'حدث خطأ أثناء قراءة الملف، يرجى التأكد من سلامته' : 'Error reading file');
        } finally {
          setIsExtractingFile(false);
        }
      }

      function handleExportLibrary() {
        if (!savedIslamicLectures.length) {
          showToast(isRtl ? 'مكتبتك فارغة حالياً للتصدير' : 'Library is empty');
          return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedIslamicLectures, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", 'mishkah_lectures_backup_' + new Date().toISOString().slice(0,10) + '.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast(isRtl ? 'تم تصدير نسخة احتياطية من مكتبتك بنجاح 📤' : 'Library exported successfully 📤');
      }

      function handleImportLibrary(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (Array.isArray(parsed)) {
              const merged = [...parsed, ...savedIslamicLectures.filter(x => !parsed.some(p => p.id === x.id))];
              setSavedIslamicLectures(merged);
              localStorage.setItem('mishkah_saved_lectures', JSON.stringify(merged));
              showToast(isRtl ? ('تم استيراد ' + parsed.length + ' محاضرة بنجاح 📥') : ('Imported ' + parsed.length + ' lectures 📥'));
            }
          } catch (err) {
            showToast(isRtl ? 'ملف الاستيراد غير صالح' : 'Invalid file format');
          }
        };
        reader.readAsText(file);
      }`;

if (html.includes(handlersTarget)) {
  html = replaceNormalized(html, handlersTarget, handlersReplacement);
  console.log('Handlers inserted!');
}

// 4. Update Header with My Lectures Library quick button
const quickActionTarget = `                {/* Quick Actions (Security + Lang) */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsPinModalOpen(true)}
                    className="bg-emerald-800/90 hover:bg-emerald-700 border border-gold-400/50 text-gold-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
                    title={isRtl ? 'رمز أمان المعلم' : 'Teacher Security PIN'}
                  >
                    <span>🔒</span>
                    <span className="text-[11px] font-bold hidden xs:inline">{isRtl ? 'الأمان' : 'PIN'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  </button>`;

const quickActionReplacement = `                {/* Quick Actions (Library + Security + Lang) */}
                <div className="flex items-center gap-1.5">
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveTab('islamic');
                      setIslamicSubView('library');
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black text-xs px-2.5 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5"
                    title={isRtl ? 'فتح مكتبة محاضراتي المحفوظة' : 'My Lectures Library'}
                  >
                    <span>📚</span>
                    <span className="text-[11px] font-black">{isRtl ? 'مكتبة محاضراتي' : 'My Library'}</span>
                    <span className="bg-emerald-950 text-gold-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {savedIslamicLectures.length}
                    </span>
                  </button>

                  <button 
                    onClick={() => setIsPinModalOpen(true)}
                    className="bg-emerald-800/90 hover:bg-emerald-700 border border-gold-400/50 text-gold-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
                    title={isRtl ? 'رمز أمان المعلم' : 'Teacher Security PIN'}
                  >
                    <span>🔒</span>
                    <span className="text-[11px] font-bold hidden xs:inline">{isRtl ? 'الأمان' : 'PIN'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  </button>`;

if (html.includes(quickActionTarget)) {
  html = replaceNormalized(html, quickActionTarget, quickActionReplacement);
  console.log('Top header updated with My Library button!');
}

// 5. Replace Islamic Studies View with Full File Uploader + Grand Library
const islamicViewStart = "{/* ================= VIEW: MODULE B (ISLAMIC STUDIES) ================= */}";
const islamicViewEnd = "{/* ================= VIEW: PRINTABLE MULTI-BRANCH WORKSHEETS & TEACHER BUILDER ================= */}";

const normHtml = html.replace(/\r\n/g, '\n');
const startIdx = normHtml.indexOf(islamicViewStart);
const endIdx = normHtml.indexOf(islamicViewEnd);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Islamic view markers not found!');
}

const islamicViewReplacement = `{/* ================= VIEW: ISLAMIC STUDIES & SERMON WORKBENCH (BRANCH 3) ================= */}
            {activeTab === 'islamic' && (
              <div className="space-y-6 sm:space-y-8 animate-fadeIn">
                
                {/* Header Banner & Sub-View Switcher (Workbench vs My Library) */}
                <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-900/15 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-500 text-emerald-950 flex items-center justify-center text-xl sm:text-2xl font-black shadow-md border border-gold-400">
                        🕌
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-2xl font-black text-emerald-950 font-cairo">
                            {isRtl ? 'حقيبة العلوم الشرعية ورافع المحاضرات والمكتبة' : 'Islamic Studies & Lectures Workbench'}
                          </h2>
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full hidden sm:inline">
                            {isRtl ? 'Word • PDF • نص' : 'Word • PDF • Text'}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
                          {isRtl 
                            ? 'ارفع ملف محاضرتك (وورد أو PDF أو نص) أو الصقها لتتحول فوراً إلى خطة منضبطة وبطاقات زوم وورقة عمل واختبار تفاعلي'
                            : 'Upload your Word/PDF lecture document or paste text to format into ready-to-teach assets'}
                        </p>
                      </div>
                    </div>

                    {/* SubView Tabs Switcher: Workbench vs My Library */}
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIslamicSubView('workbench')}
                          className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 \${
                            islamicSubView === 'workbench'
                              ? 'bg-emerald-800 text-gold-200 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }\`}
                        >
                          <span>✍️</span>
                          <span>{isRtl ? 'تحضير ورفع محاضرة' : 'Author & Upload'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIslamicSubView('library')}
                          className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 \${
                            islamicSubView === 'library'
                              ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }\`}
                        >
                          <span>📚</span>
                          <span>{isRtl ? 'مكتبة محاضراتي' : 'My Library'}</span>
                          <span className="bg-emerald-950 text-gold-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                            {savedIslamicLectures.length}
                          </span>
                        </button>
                      </div>

                      {islamicSubView === 'workbench' && (
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={handleResetIslamicForm}
                            className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                            title="البدء بدرس جديد على نظافة"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'درس جديد' : 'New Clean'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={handleLoadDemoIslamic}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                            title="استيراد نموذج استرشادي تجريبي للتوضيح"
                          >
                            <span>💡</span>
                            <span>{isRtl ? 'نموذج تجريبي' : 'Demo'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ================= SUBVIEW 1: MY LECTURES LIBRARY ================= */}
                  {islamicSubView === 'library' && (
                    <div className="space-y-6 pt-2">
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                        <div>
                          <h3 className="font-bold text-emerald-950 text-base font-cairo flex items-center gap-2">
                            <span>📚</span>
                            <span>{isRtl ? 'مكتبة المحاضرات الشرعية المحفوظة' : 'My Saved Lectures Library'}</span>
                            <span className="bg-emerald-800 text-gold-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                              {savedIslamicLectures.length} {isRtl ? 'محاضرة' : 'lectures'}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {isRtl 
                              ? 'محاضراتك المخزنة محلياً على جهازك؛ يمكنك الرجوع إليها للشرح على زوم، أو طباعة أوراق عملها، أو اختبار الدارسين دون إنترنت.'
                              : 'Lectures saved locally in your browser. Open anytime for Zoom presentation, printable worksheets, or quizzes.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIslamicSubView('workbench')}
                            className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'تحضير أو رفع محاضرة جديدة' : 'Add New Lecture'}</span>
                          </button>
                          {savedIslamicLectures.length > 0 && (
                            <button
                              type="button"
                              onClick={handleExportLibrary}
                              className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                              title="تصدير ملف احتياطي لمكتبتك"
                            >
                              <span>📤</span>
                              <span>{isRtl ? 'تصدير نسخة احتياطية' : 'Backup Library'}</span>
                            </button>
                          )}
                          <label className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <span>📥</span>
                            <span>{isRtl ? 'استيراد مكتبة' : 'Import'}</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportLibrary}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Empty State */}
                      {savedIslamicLectures.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-300 space-y-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 text-3xl flex items-center justify-center mx-auto">
                            📚
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-emerald-950 font-cairo">
                              {isRtl ? 'مكتبتك فارغة حالياً' : 'Your Library is Empty'}
                            </h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                              {isRtl 
                                ? 'لم تقم بحفظ أي محاضرة بعد. يمكنك رفع ملف وورد (.docx) أو PDF أو تحضير أي محاضرة، ثم الضغط على زر "حفظ بمكتبتي" لتظهر هنا بشكل دائم.'
                                : 'You have not saved any lectures yet. Upload a Word/PDF lecture or author one, then click Save to Library.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIslamicSubView('workbench')}
                            className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition inline-flex items-center gap-2"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'ابدأ برفع أو تحضير أول محاضرة الآن' : 'Upload or Author Your First Lecture'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {savedIslamicLectures.map(lec => (
                            <div key={lec.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-gold-400 shadow-xs flex flex-col justify-between transition space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    {lec.data.metadata.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    ⏱️ {lec.data.metadata.durationMinutes} د • {lec.savedAt}
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-emerald-950 text-sm font-cairo leading-snug">
                                  {lec.data.metadata.topic}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  {lec.data.metadata.audience}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                                  <span>🖼️ {(lec.data.zoomPresentation || []).length} شرائح زوم</span>
                                  <span>•</span>
                                  <span>❓ {(lec.data.quizQuestions || []).length} أسئلة اختبار</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => handleLoadSavedLecture(lec)}
                                  className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 font-bold px-3 py-1.5 rounded-lg text-xs transition flex-1 text-center"
                                >
                                  {isRtl ? '📖 فتح وعرض' : 'Open'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIslamicData(lec.data);
                                    handleTransferLectureToWorksheet();
                                  }}
                                  className="bg-gold-50 text-gold-800 border border-gold-300 hover:bg-gold-100 font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                                  title={isRtl ? 'ورقة العمل والطباعة' : 'Worksheet'}
                                >
                                  📝
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIslamicData(lec.data);
                                    handleTransferLectureToQuiz();
                                  }}
                                  className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                                  title={isRtl ? 'الاختبار التفاعلي' : 'Quiz'}
                                >
                                  🎯
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSavedLecture(lec.id)}
                                  className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs transition"
                                  title={isRtl ? 'حذف من المكتبة' : 'Delete'}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================= SUBVIEW 2: WORKBENCH & INPUT MODES ================= */}
                  {islamicSubView === 'workbench' && (
                    <div className="space-y-6 pt-2">
                      
                      {/* Input Mode Toggle: File vs Paste vs Structured */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setIslamicInputMode('file')}
                          className={'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                            islamicInputMode === 'file'
                              ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-md ring-2 ring-gold-400/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span>📁</span>
                          <span>{isRtl ? '1. رفع ملف المحاضرة (Word .docx / PDF / نص .txt)' : '1. Upload Lecture File (Word/PDF/Text)'}</span>
                          <span className="bg-gold-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                            {isRtl ? 'الموصى به' : 'Best'}
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIslamicInputMode('paste')}
                          className={'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                            islamicInputMode === 'paste'
                              ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span>📋</span>
                          <span>{isRtl ? '2. لصق نص المحاضرة يدوياً' : '2. Paste Lecture Text'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIslamicInputMode('structured')}
                          className={'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                            islamicInputMode === 'structured'
                              ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span>🏗️</span>
                          <span>{isRtl ? '3. البناء المنظم خطوة بخطوة' : '3. Structured Step-by-Step'}</span>
                        </button>
                      </div>

                      {/* --- MODE 1: FILE UPLOAD DROPZONE & EXTRACTOR --- */}
                      {islamicInputMode === 'file' && (
                        <div className="space-y-4">
                          
                          {/* Dropzone Card */}
                          <div 
                            onClick={() => document.getElementById('lectureDocFileInput')?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const f = e.dataTransfer.files && e.dataTransfer.files[0];
                              if (f) handleLectureFileUpload(f);
                            }}
                            className="bg-white hover:bg-emerald-50/40 border-2 border-dashed border-emerald-900/30 hover:border-gold-500 rounded-3xl p-6 sm:p-10 text-center cursor-pointer transition shadow-xs group"
                          >
                            <input
                              type="file"
                              id="lectureDocFileInput"
                              accept=".docx,.doc,.pdf,.txt,.md"
                              onChange={(e) => {
                                const f = e.target.files && e.target.files[0];
                                if (f) handleLectureFileUpload(f);
                              }}
                              className="hidden"
                            />

                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-900 group-hover:bg-gold-100 group-hover:text-gold-900 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-3 transition shadow-inner">
                              {isExtractingFile ? '⏳' : '📁'}
                            </div>

                            <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                              {isExtractingFile 
                                ? (isRtl ? 'جارٍ قراءة واستخراج نص المحاضرة من الملف...' : 'Extracting document text...')
                                : (isRtl ? 'اسحب ملف المحاضرة هنا أو اضغط لاختياره من جهازك' : 'Drag & drop lecture document here, or browse')}
                            </h3>

                            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
                              {isRtl 
                                ? 'يدعم مستندات وورد Word (.docx, .doc)، كتب وملفات PDF (.pdf)، والملفات النصية (.txt, .md). تتم القراءة بأمان تام داخل متصفحك دون إرسال ملفاتك لأي خوادم.'
                                : 'Supports Microsoft Word (.docx, .doc), Adobe PDF (.pdf), and Text files (.txt, .md). Extracted 100% locally on your machine.'}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                              <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                📘 Microsoft Word (.docx)
                              </span>
                              <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                📕 Adobe PDF (.pdf)
                              </span>
                              <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                📄 Plain Text (.txt, .md)
                              </span>
                            </div>
                          </div>

                          {/* Uploaded File Summary & Transformation Card */}
                          {uploadedFileInfo && (
                            <div className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-400/40 pb-3">
                                <div className="flex items-center gap-3">
                                  <span className="w-10 h-10 rounded-xl bg-gold-400 text-emerald-950 font-bold flex items-center justify-center text-xl shadow-xs">
                                    📄
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-extrabold text-emerald-950 text-sm font-cairo">
                                        {uploadedFileInfo.name}
                                      </h4>
                                      <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-300">
                                        ✓ {isRtl ? 'تم استخراج النص بنجاح' : 'Extracted'}
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-600 mt-0.5">
                                      {isRtl 
                                        ? \`الحجم: \${uploadedFileInfo.sizeKb} كيلوبايت • عدد الكلمات: \${uploadedFileInfo.wordCount} كلمة • الأسطر: \${uploadedFileInfo.lineCount} سطراً\`
                                        : \`Size: \${uploadedFileInfo.sizeKb} KB • Words: \${uploadedFileInfo.wordCount} • Lines: \${uploadedFileInfo.lineCount}\`}
                                    </div>
                                  </div>
                                </div>

                                {/* Primary Transformation Trigger */}
                                <button
                                  type="button"
                                  onClick={handleProcessCustomLecture}
                                  disabled={isGeneratingIslamic}
                                  className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                  <span>⚡</span>
                                  <span>
                                    {isGeneratingIslamic 
                                      ? (isRtl ? 'جارٍ التحويل والهيكلة...' : 'Processing...') 
                                      : (isRtl ? 'تحويل الملف إلى خطة وبطاقات زوم وورقة عمل' : 'Transform File into Lecture Blueprint')}
                                  </span>
                                </button>
                              </div>

                              {/* Target Metadata Selectors */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'عنوان المحاضرة (مستخرج تلقائياً):' : 'Lecture Topic Title:'}
                                  </label>
                                  <input
                                    type="text"
                                    value={lessonTopic}
                                    onChange={(e) => setLessonTopic(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'المجال الشرعي:' : 'Discipline:'}
                                  </label>
                                  <select
                                    value={subjectCategory}
                                    onChange={(e) => setSubjectCategory(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  >
                                    {[
                                      'العقيدة والتوحيد (Aqeedah)',
                                      'الفقه وأصوله (Fiqh & Usul)',
                                      'التفسير وتدبر القرآن (Tafseer)',
                                      'الحديث الشريف وعلومه (Hadith)',
                                      'السيرة النبوية والتاريخ (Seerah)',
                                      'التزكية والآداب والأخلاق (Tazkiyah)',
                                      'اللغة العربية وعلوم اللسان (Arabic)',
                                      'قضايا معاصرة وفكر إسلامي (Contemporary)',
                                      'custom'
                                    ].map(c => (
                                      <option key={c} value={c}>{c === 'custom' ? (isRtl ? '✨ مجال شرعي مخصص آخر...' : 'Custom Discipline...') : c}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'مدة المحاضرة المقررة:' : 'Allocated Duration:'}
                                  </label>
                                  <select
                                    value={lessonDuration}
                                    onChange={(e) => setLessonDuration(Number(e.target.value))}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  >
                                    <option value={30}>30 {isRtl ? 'دقيقة (موجزة)' : 'minutes'}</option>
                                    <option value={45}>45 {isRtl ? 'دقيقة (حلقة قياسية)' : 'minutes'}</option>
                                    <option value={60}>60 {isRtl ? 'دقيقة (درس منهجي موسع)' : 'minutes'}</option>
                                    <option value={90}>90 {isRtl ? 'دقيقة (ندوة علمية)' : 'minutes'}</option>
                                  </select>
                                </div>
                              </div>

                              {/* Collapsible Extracted Text Preview */}
                              <details className="text-xs">
                                <summary className="cursor-pointer text-slate-700 font-bold hover:text-emerald-900 transition select-none">
                                  👁️ {isRtl ? 'معاينة أو تعديل النص المستخرج من الملف قبل التحويل' : 'Preview / Edit Extracted Document Text'}
                                </summary>
                                <textarea
                                  rows={6}
                                  value={rawLectureText}
                                  onChange={(e) => setRawLectureText(e.target.value)}
                                  className="w-full mt-2 bg-white border border-slate-300 rounded-xl p-3 text-xs font-amiri text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                />
                              </details>
                            </div>
                          )}

                        </div>
                      )}

                      {/* --- MODE 2: PASTE LECTURE TEXT --- */}
                      {islamicInputMode === 'paste' && (
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                              {isRtl 
                                ? 'الصق نص محاضرتك أو مادتك العلمية المجمعة هنا:' 
                                : 'Paste your lecture text or researched draft here:'}
                            </label>
                            <textarea
                              rows={8}
                              value={rawLectureText}
                              onChange={(e) => setRawLectureText(e.target.value)}
                              placeholder={isRtl 
                                ? 'الصق هنا نص المحاضرة، محاورها، الأحاديث، أو أي ملخص جمعته من الكتب والإنترنت... سيقوم المحرك بتحليله وتقسيمه بالدقائق واستخراج بطاقات زوم وملخص الواتساب وأسئلة الاختبار تلقائياً.' 
                                : 'Paste entire lecture notes or summary here...'}
                              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs font-amiri text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                              <span className="text-[11px] text-slate-500 font-medium">
                                {isRtl ? 'المحرك يقبل أي طول للنص ويستخلص المحاور والأدلة تلقائياً' : 'Accepts any text length'}
                              </span>

                              <button
                                type="button"
                                onClick={handleProcessCustomLecture}
                                disabled={!rawLectureText.trim() || isGeneratingIslamic}
                                className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-40"
                              >
                                <span>⚡</span>
                                <span>
                                  {isGeneratingIslamic 
                                    ? (isRtl ? 'جارٍ المعالجة والهيكلة...' : 'Processing...') 
                                    : (isRtl ? 'هيكلة النص وتوليد الأدوات التدريسية' : 'Structure Notes into Teaching Assets')}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- MODE 3: STRUCTURED FORM --- */}
                      {islamicInputMode === 'structured' && (
                        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'عنوان الدرس والمحور الأساسي:' : 'Lesson Topic:'}
                              </label>
                              <input
                                type="text"
                                value={lessonTopic}
                                onChange={(e) => setLessonTopic(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'المجال الشرعي المستهدف:' : 'Islamic Discipline:'}
                              </label>
                              <select
                                value={subjectCategory}
                                onChange={(e) => setSubjectCategory(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              >
                                {[
                                  'العقيدة والتوحيد (Aqeedah)',
                                  'الفقه وأصوله (Fiqh & Usul)',
                                  'التفسير وتدبر القرآن (Tafseer)',
                                  'الحديث الشريف وعلومه (Hadith)',
                                  'السيرة النبوية والتاريخ (Seerah)',
                                  'التزكية والآداب والأخلاق (Tazkiyah)',
                                  'اللغة العربية وعلوم اللسان (Arabic)',
                                  'قضايا معاصرة وفكر إسلامي (Contemporary)'
                                ].map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'مدة الحصة (بالدقائق):' : 'Duration (minutes):'}
                              </label>
                              <select
                                value={lessonDuration}
                                onChange={(e) => setLessonDuration(Number(e.target.value))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              >
                                <option value={30}>30 دقيقة</option>
                                <option value={45}>45 دقيقة</option>
                                <option value={60}>60 دقيقة</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {isRtl ? 'محاور ونقاط الدرس المقررة:' : 'Lesson Phases & Points:'}
                            </label>
                            <textarea
                              rows={3}
                              value={structuredPhasesText}
                              onChange={(e) => setStructuredPhasesText(e.target.value)}
                              placeholder={isRtl ? 'اكتب المحاور أو عناصر الدرس...' : 'Enter lesson outline points...'}
                              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-amiri"
                            />
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={handleProcessCustomLecture}
                              className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2 rounded-xl text-xs shadow-md transition"
                            >
                              {isRtl ? '⚡ توليد الأدوات التدريسية' : 'Generate Assets'}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* ================= ACTIVE LECTURE ARTIFACTS VIEW ================= */}
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

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveIslamicLecture}
                          className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm border border-gold-400 flex items-center gap-1.5 transition"
                        >
                          <span>💾</span>
                          <span>{isRtl ? 'حفظ بمكتبتي' : 'Save to Library'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleTransferLectureToWorksheet}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                        >
                          <span>📝</span>
                          <span>{isRtl ? 'إرسال لورقة العمل والطباعة' : 'Send to Worksheet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleTransferLectureToQuiz}
                          className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'إرسال للاختبار التفاعلي' : 'Send to Quiz'}</span>
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
                              <p className="text-xs text-slate-600 font-amiri leading-relaxed mb-3">
                                {isRtl ? phase.teacherFocusAr : phase.teacherFocusEn}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-emerald-900 font-bold">
                              🎯 {isRtl ? phase.keyTakeawayAr : phase.keyTakeawayEn}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Authenticated Hadith Verification (Strict Sahih Bukhari & Muslim) */}
                    <div className="card-islamic-amber rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gold-400/40 shadow-md">
                      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gold-400/30">
                        <span className="text-xl">🛡️</span>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                            {isRtl ? 'سياج التوثيق الشرعي الصارم (أحاديث صحيحة فقط)' : 'Authentic Evidences Verification'}
                          </h3>
                          <span className="text-[11px] text-amber-900 font-bold">
                            {isRtl ? 'التزام تام بأحاديث الصحيحين مع بيان الراوي ورقم الباب ورقم الحديث' : 'Citing Sahih Al-Bukhari & Sahih Muslim only'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {islamicData.hadithVerification.map((hd, idx) => (
                          <div key={idx} className="bg-white/90 rounded-2xl p-4 border border-gold-300 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <span className="bg-emerald-900 text-gold-200 text-xs px-3 py-1 rounded-full font-bold">
                                {hd.source}
                              </span>
                              <span className="text-xs font-bold text-slate-600">
                                {isRtl ? 'راوي الحديث:' : 'Narrator:'} {hd.narrator}
                              </span>
                            </div>
                            <p className="font-amiri text-sm sm:text-base text-emerald-950 font-medium leading-relaxed my-2">
                              «{hd.text}»
                            </p>
                            <div className="text-xs text-slate-600 font-amiri pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span><strong>{isRtl ? 'التخريج والحكم:' : 'Grade:'}</strong> {hd.ruling}</span>
                              <span className="text-emerald-800 font-bold">✓ صحيح معتمد</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Zoom Slide Deck for Presentation */}
                    <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/15 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            {isRtl ? 'بطاقات الشرح التفاعلية لبرنامج زوم (Zoom Presentation Cards)' : 'Zoom Teaching Slides'}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                            {isRtl ? 'عرض بصري واضح للمحاور والأدلة أثناء البث' : 'High-Contrast Teaching Cards'}
                          </h3>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold">
                          {islamicData.zoomPresentation.length} {isRtl ? 'بطاقات' : 'Cards'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {islamicData.zoomPresentation.map((slide, sIdx) => (
                          <div key={sIdx} className="bg-emerald-950 text-white rounded-2xl p-5 border-2 border-gold-400 shadow-md flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3 text-gold-300 text-xs font-bold">
                                <span>{isRtl ? \`الشريحة \${slide.slideNumber || sIdx + 1}\` : \`Slide \${sIdx + 1}\`}</span>
                                <span className="bg-emerald-900 px-2.5 py-0.5 rounded-full border border-gold-400/40 text-[10px]">
                                  {slide.phaseTitle}
                                </span>
                              </div>
                              <h4 className="font-amiri text-lg font-bold text-gold-200 mb-2 leading-snug">
                                {slide.slideTitle}
                              </h4>
                              <p className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed my-3 bg-emerald-900/60 p-3 rounded-xl border border-gold-400/30">
                                {slide.scriptureEvidence}
                              </p>
                              <p className="font-amiri text-xs text-slate-200 leading-relaxed">
                                {slide.talkingPoints}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-emerald-800/80 text-[11px] text-gold-300 font-bold flex items-center justify-between">
                              <span>💡 {slide.pedagogicalTip}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. WhatsApp Ring Broadcast Kit */}
                    <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/15 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            {isRtl ? 'حقيبة الواتساب بنقرة واحدة (WhatsApp Ring Broadcast Kit)' : 'WhatsApp Ring Broadcast'}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                            {isRtl ? 'رسالة ملخصة وجذابة في 10 أسطر منسقة بالإيموجي لمجموعات الدارسين' : '10-Line Formatted Summary with Emojis'}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyWhatsApp}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow flex items-center gap-1.5"
                        >
                          <span>📋</span>
                          <span>{isRtl ? 'نسخ الرسالة بنقرة واحدة' : 'Copy Message'}</span>
                        </button>
                      </div>

                      <div className="bg-slate-900 text-emerald-200 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
                        {islamicData.whatsAppKit.formattedText}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            `;

const finalNorm = normHtml.substring(0, startIdx) + islamicViewReplacement + normHtml.substring(endIdx);
html = finalNorm.replace(/\n/g, '\r\n');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Public/index.html fully upgraded with File Uploader & Grand Library!');
