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

html = replaceNormalized(html, headScriptTarget, headScriptReplacement);
console.log('Script tags inserted into <head>!');

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

html = replaceNormalized(html, stateTarget, stateReplacement);
console.log('States updated!');

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

html = replaceNormalized(html, handlersTarget, handlersReplacement);
console.log('Handlers inserted!');

// 4. Update Top Navigation to show My Lectures Library shortcut
const navTarget = `              {/* Branch Selector Tabs (Nav) */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'dashboard', icon: '📊', labelAr: 'لوحة المعلم', labelEn: 'Teacher Hub' },
                  { id: 'hifz', icon: '🕋', labelAr: 'أدوات التحفيظ (Branch 1)', labelEn: 'Hifz' },
                  { id: 'tajweed', icon: '📖', labelAr: 'أدوات التجويد (Branch 2)', labelEn: 'Tajweed' },
                  { id: 'islamic', icon: '🕌', labelAr: 'العلوم الشرعية (Branch 3)', labelEn: 'Islamic Studies' },
                  { id: 'worksheet', icon: '📝', labelAr: 'أوراق العمل والطباعة', labelEn: 'Worksheets' },
                  { id: 'quiz', icon: '🎯', labelAr: 'الاختبار الذاتي التفاعلي', labelEn: 'Student Quiz' }
                ].map(tab => (`;

const navReplacement = `              {/* Branch Selector Tabs (Nav) */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'dashboard', icon: '📊', labelAr: 'لوحة المعلم', labelEn: 'Teacher Hub' },
                  { id: 'hifz', icon: '🕋', labelAr: 'أدوات التحفيظ (Branch 1)', labelEn: 'Hifz' },
                  { id: 'tajweed', icon: '📖', labelAr: 'أدوات التجويد (Branch 2)', labelEn: 'Tajweed' },
                  { id: 'islamic', icon: '🕌', labelAr: 'العلوم الشرعية (Branch 3)', labelEn: 'Islamic Studies' },
                  { id: 'worksheet', icon: '📝', labelAr: 'أوراق العمل والطباعة', labelEn: 'Worksheets' },
                  { id: 'quiz', icon: '🎯', labelAr: 'الاختبار الذاتي التفاعلي', labelEn: 'Student Quiz' }
                ].map(tab => (` ;

// Let's also add the library shortcut in the top action row
const quickActionTarget = `                {/* Quick Actions (Security + Lang) */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsPinModalOpen(true)}
                    className="bg-emerald-900/80 hover:bg-emerald-800 text-gold-300 border border-gold-400/40 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <span>🔒</span>
                    <span className="hidden sm:inline">{isRtl ? 'أمان المعلم' : 'Security'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </button>`;

const quickActionReplacement = `                {/* Quick Actions (Library + Security + Lang) */}
                <div className="flex items-center gap-1.5">
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveTab('islamic');
                      setIslamicSubView('library');
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1.5"
                    title={isRtl ? 'فتح مكتبة محاضراتي المحفوظة' : 'My Lectures Library'}
                  >
                    <span>📚</span>
                    <span>{isRtl ? 'مكتبة محاضراتي' : 'My Library'}</span>
                    <span className="bg-emerald-950 text-gold-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {savedIslamicLectures.length}
                    </span>
                  </button>

                  <button 
                    onClick={() => setIsPinModalOpen(true)}
                    className="bg-emerald-900/80 hover:bg-emerald-800 text-gold-300 border border-gold-400/40 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <span>🔒</span>
                    <span className="hidden sm:inline">{isRtl ? 'أمان المعلم' : 'Security'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </button>`;

html = replaceNormalized(html, quickActionTarget, quickActionReplacement);
console.log('Top action bar updated with My Library shortcut!');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Checkpoint: scripts, states, handlers, and top button updated!');
