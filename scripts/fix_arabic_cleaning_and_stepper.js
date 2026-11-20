const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const swPath = path.join(__dirname, '..', 'public', 'sw.js');

let html = fs.readFileSync(indexPath, 'utf8');
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Add sanitizeArabicExtractedText function right before handleLectureFileUpload
const targetBeforeUpload = `      // Universal Document Extractor for Word (.docx), PDF (.pdf), and Text (.txt, .md)`;
if (!html.includes(targetBeforeUpload)) {
  console.error("Could not find targetBeforeUpload");
  process.exit(1);
}

const sanitizerCode = `      // Comprehensive Arabic Document Cleaner & Sanitizer
      // Cleans PDF.js and Word font encoding artifacts (repeated Dals used as tatweel/stretch bars, reversed ligatures, TOC dot leaders)
      function sanitizeArabicExtractedText(rawText) {
        if (!rawText) return '';
        let text = rawText;

        // 1. Strip all Tatweel/Kashida characters
        text = text.replace(/[\\u0640]+/g, '');

        // 2. Collapse repeated Dals (which Adobe InDesign / Word PDF fonts encode in place of elongation bars)
        text = text.replace(/د{2,}/g, '');
        text = text.replace(/\\bلق\\b/g, 'لقد');

        // 3. Collapse any Arabic letter repeated 3+ times to 1
        text = text.replace(/([^0-9\\s\\.\\-\\*#])\\1{2,}/g, '$1');

        // 4. Remove Table of Contents leader dots, underline streaks, and dashes
        text = text.replace(/\\.{3,}/g, ' ');
        text = text.replace(/_{3,}/g, ' ');
        text = text.replace(/[\\-]{4,}/g, ' ');

        // 5. Correct common Arabic PDF/OCR reversed or broken ligatures
        text = text.replace(/\\bامل(?=[أ-ي])/g, 'الم');
        text = text.replace(/\\bاحل(?=[أ-ي])/g, 'الح');
        text = text.replace(/\\bإبل\\b/g, 'إلى');
        text = text.replace(/\\bأمهية\\b/g, 'أهمية');
        text = text.replace(/\\bألوائل\\b/g, 'الأوائل');
        text = text.replace(/\\bاختاالف\\b/g, 'اختلاف');
        text = text.replace(/\\bاختا/g, 'اخت');
        text = text.replace(/\\bوهللا\\b/g, 'والله');
        text = text.replace(/\\bكالم\\b/g, 'كلام');
        text = text.replace(/\\bيف\\b/g, 'في');
        text = text.replace(/\\bمل\\b/g, 'لم');

        // 6. Filter lines to discard Table of Contents remnants
        const lines = text.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
        const cleanLines = [];
        let insideTOC = false;

        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          if (/^(?:الفهرس|المحتويات|فهرس الموضوعات|جدول المحتويات)/i.test(l)) {
            insideTOC = true;
            continue;
          }
          if (insideTOC) {
            if (/\\.{2,}|_{2,}|\\b\\d+\\s*$/.test(l) && l.length < 90) {
              continue; // skip TOC entry line
            } else if (l.length > 90 || /^(?:المقدمة|تمهيد|مدخل|الباب|الفصل|المبحث|المحور)/i.test(l)) {
              insideTOC = false;
            }
          }
          // Skip pure numbers or isolated dot lines
          if (/^\\d+$/.test(l) || /^[\\.\\-\\s]+$/.test(l)) continue;
          cleanLines.push(l);
        }

        return cleanLines.join('\\n');
      }
`;

if (!html.includes('function sanitizeArabicExtractedText')) {
  html = html.replace(targetBeforeUpload, sanitizerCode + '\n' + targetBeforeUpload);
}

// 2. In handleLectureFileUpload: sanitize extractedText
const oldSetRaw = `          setRawLectureText(extractedText);`;
const newSetRaw = `          const cleanExtracted = sanitizeArabicExtractedText(extractedText);
          setRawLectureText(cleanExtracted);`;

if (html.includes(oldSetRaw)) {
  html = html.replace(oldSetRaw, newSetRaw);
}

// 3. Add activeIslamicStage and islamicViewMode state declarations
const oldIslamicStates = `      const [islamicInputMode, setIslamicInputMode] = useState('file'); // 'file', 'paste' or 'structured'
      const [islamicSubView, setIslamicSubView] = useState('workbench'); // 'workbench' or 'library'
      const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { name, sizeKb, wordCount, lineCount }
      const [isExtractingFile, setIsExtractingFile] = useState(false);`;

const newIslamicStates = `      const [islamicInputMode, setIslamicInputMode] = useState('file'); // 'file', 'paste' or 'structured'
      const [islamicSubView, setIslamicSubView] = useState('workbench'); // 'workbench' or 'library'
      const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { name, sizeKb, wordCount, lineCount }
      const [isExtractingFile, setIsExtractingFile] = useState(false);
      const [activeIslamicStage, setActiveIslamicStage] = useState(1); // 1, 2, 3, 4, 5, 6
      const [islamicViewMode, setIslamicViewMode] = useState('stepper'); // 'stepper' (single stage focus) or 'all' (continuous)`;

if (html.includes(oldIslamicStates)) {
  html = html.replace(oldIslamicStates, newIslamicStates);
}

// 4. In handleProcessCustomLecture: sanitize rawClean and advance activeIslamicStage to 2
const oldCleanProcess = `        const rawClean = rawLectureText.trim();
        const rawLines = rawClean.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);`;

const newCleanProcess = `        const rawClean = sanitizeArabicExtractedText(rawLectureText).trim();
        const rawLines = rawClean.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);`;

if (html.includes(oldCleanProcess)) {
  html = html.replace(oldCleanProcess, newCleanProcess);
}

const oldEndProcess = `        setIslamicData(customData);
        setIsCurrentLectureSaved(false);
        showToast(isRtl ? 'تم تفكيك المحاضرة بنجاح وبناء خطة الـ 6 مراحل 🌿' : 'Custom Lecture Successfully Processed 🌿');
      }`;

const newEndProcess = `        setIslamicData(customData);
        setIsCurrentLectureSaved(false);
        setActiveIslamicStage(2); // Automatically advance to Stage 2
        window.scrollTo({ top: 320, behavior: 'smooth' });
        showToast(isRtl ? 'تم تفكيك المحاضرة بنجاح وبناء خطة الـ 6 مراحل 🌿' : 'Custom Lecture Successfully Processed 🌿');
      }`;

if (html.includes(oldEndProcess)) {
  html = html.replace(oldEndProcess, newEndProcess);
}

// 5. Update Stepper bar using index markers
const stepperStart = html.indexOf('{/* Sequential 6-Stage Stepper Navigation Bar */}');
const stepperEnd = html.indexOf('{/* Master Practical Field Guide Banner */}');

if (stepperStart === -1 || stepperEnd === -1) {
  console.error("Could not find stepper markers");
  process.exit(1);
}

const newStepperBar = `{/* Sequential 6-Stage Stepper Navigation Bar */}
                      <div className="sticky top-2 z-20 bg-emerald-950/95 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-2xl border-2 border-gold-400 shadow-xl no-print">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs flex-1">
                            {[
                              { id: 'stage-islamic-1', num: 1, labelAr: '1. إدخال المحاضرة', icon: '📁', active: true },
                              { id: 'stage-islamic-2', num: 2, labelAr: '2. الخطة والأدلة', icon: '⏱️', active: !!islamicData },
                              { id: 'stage-islamic-3', num: 3, labelAr: '3. العرض وبوربوينت', icon: '📽️', active: !!islamicData },
                              { id: 'stage-islamic-4', num: 4, labelAr: '4. ورقة العمل', icon: '📝', active: !!islamicData },
                              { id: 'stage-islamic-5', num: 5, labelAr: '5. الاختبار الذاتي', icon: '🎯', active: !!islamicData },
                              { id: 'stage-islamic-6', num: 6, labelAr: '6. الواتساب والمكتبة', icon: '💬', active: !!islamicData }
                            ].map(st => {
                              const isCurrent = activeIslamicStage === st.num;
                              return (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => {
                                    if (st.num > 1 && !islamicData) {
                                      showToast(isRtl ? 'يرجى إدخال المحاضرة ومعالجتها أولاً للانتقال لهذه المرحلة' : 'Please input and process lecture first');
                                      return;
                                    }
                                    setActiveIslamicStage(st.num);
                                    window.scrollTo({ top: 320, behavior: 'smooth' });
                                  }}
                                  className={'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ' + (
                                    isCurrent
                                      ? 'bg-gold-500 text-emerald-950 border-2 border-gold-300 font-black shadow-lg ring-2 ring-gold-300 scale-105'
                                      : (st.active 
                                          ? 'bg-emerald-900/90 hover:bg-emerald-800 text-gold-200 border border-gold-400/40' 
                                          : 'bg-emerald-950/50 text-slate-400 border border-emerald-900/40 opacity-70 cursor-not-allowed')
                                  )}
                                  title={isRtl ? \`انتقل إلى المرحلة (\${st.num})\` : \`Jump to Stage \${st.num}\`}
                                >
                                  <span className={'w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ' + (isCurrent ? 'bg-emerald-950 text-gold-300' : 'bg-gold-400 text-emerald-950')}>
                                    {st.num}
                                  </span>
                                  <span>{st.icon}</span>
                                  <span>{st.labelAr}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Toggle view mode */}
                          <button
                            type="button"
                            onClick={() => setIslamicViewMode(islamicViewMode === 'stepper' ? 'all' : 'stepper')}
                            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border border-gold-400/40 bg-emerald-900 hover:bg-emerald-800 text-gold-200 whitespace-nowrap transition"
                            title={isRtl ? 'تبديل نمط العرض بين مرحلة بمرحلة أو كل المراحل معاً' : 'Toggle view mode'}
                          >
                            <span>{islamicViewMode === 'stepper' ? '📜' : '📑'}</span>
                            <span>{islamicViewMode === 'stepper' ? (isRtl ? 'عرض الكل' : 'All') : (isRtl ? 'خطوة بخطوة' : 'Step')}</span>
                          </button>
                        </div>
                      </div>

                      `;

html = html.substring(0, stepperStart) + newStepperBar + html.substring(stepperEnd);

// 6. Update Stage 1 to 6 wrappers and navigation buttons
// Stage 1 open
html = html.replace(
  `{/* --- STAGE 1: INPUT & UPLOAD SECTION --- */}
                      <div id="stage-islamic-1" className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-900/15 shadow-sm space-y-4">`,
  `{/* --- STAGE 1: INPUT & UPLOAD SECTION --- */}
                      {(islamicViewMode === 'all' || activeIslamicStage === 1) && (
                      <div id="stage-islamic-1" className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-900/15 shadow-sm space-y-4 animate-fadeIn">`
);

// Stage 1 close and Stage 2 open
html = html.replace(
  `                      </div>

                    {/* ================= STAGE 2: TIME-BOXED BLUEPRINT & HADITH VERIFICATION ================= */}
                    <div id="stage-islamic-2" className="space-y-6">`,
  `                        {/* Stage 1 Bottom Action Button */}
                        {uploadedFileInfo && (
                          <div className="pt-4 border-t border-slate-200 flex justify-end">
                            <button
                              type="button"
                              onClick={handleProcessCustomLecture}
                              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                            >
                              <span>{isRtl ? 'الانتقال إلى المرحلة (2): الخطة والأدلة الشرعية' : 'Next: Stage 2 Blueprint'}</span>
                              <span>⬅️</span>
                            </button>
                          </div>
                        )}
                      </div>
                      )}

                    {/* ================= STAGE 2: TIME-BOXED BLUEPRINT & HADITH VERIFICATION ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 2) && (
                    <div id="stage-islamic-2" className="space-y-6 animate-fadeIn">`
);

// Stage 2 close and Stage 3 open
html = html.replace(
  `                    </div>

                    {/* ================= STAGE 3: INTERACTIVE LECTURE PRESENTATION & POWERPOINT SUITE ================= */}
                    <div id="stage-islamic-3" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md space-y-4">`,
  `                      {/* Stage 2 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(1); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (1) رفع وإدخال المحاضرة' : 'Prev: Stage 1 Input'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(3); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40"
                        >
                          <span>{isRtl ? 'التالي: (3) العرض وبوربوينت PPTX' : 'Next: Stage 3 Presentation'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 3: INTERACTIVE LECTURE PRESENTATION & POWERPOINT SUITE ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 3) && (
                    <div id="stage-islamic-3" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md space-y-4 animate-fadeIn">`
);

// Stage 3 close and Stage 4 open
html = html.replace(
  `                    </div>

                    {/* ================= STAGE 4: EMBEDDED MODEL WORKSHEET & PRINTABLE TABLE ================= */}
                    <div id="stage-islamic-4" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4">`,
  `                      {/* Stage 3 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(2); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (2) الخطة والأدلة' : 'Prev: Stage 2'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(4); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40"
                        >
                          <span>{isRtl ? 'التالي: (4) ورقة العمل والطباعة' : 'Next: Stage 4 Worksheet'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 4: EMBEDDED MODEL WORKSHEET & PRINTABLE TABLE ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 4) && (
                    <div id="stage-islamic-4" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">`
);

// Stage 4 close and Stage 5 open
html = html.replace(
  `                    </div>

                    {/* ================= STAGE 5: INTERACTIVE QUIZ & SELF-GRADING BANK ================= */}
                    <div id="stage-islamic-5" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4">`,
  `                      {/* Stage 4 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(3); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (3) العرض وبوربوينت' : 'Prev: Stage 3'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(5); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40"
                        >
                          <span>{isRtl ? 'التالي: (5) الاختبار الذاتي والتقييم' : 'Next: Stage 5 Quiz'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 5: INTERACTIVE QUIZ & SELF-GRADING BANK ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 5) && (
                    <div id="stage-islamic-5" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">`
);

// Stage 5 close and Stage 6 open
html = html.replace(
  `                    </div>

                    {/* ================= STAGE 6: WHATSAPP BROADCAST KIT & SAVE TO LIBRARY ================= */}
                    <div id="stage-islamic-6" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4">`,
  `                      {/* Stage 5 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(4); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (4) ورقة العمل والطباعة' : 'Prev: Stage 4'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(6); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40"
                        >
                          <span>{isRtl ? 'التالي: (6) الواتساب ومكتبتي' : 'Next: Stage 6 Library'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 6: WHATSAPP BROADCAST KIT & SAVE TO LIBRARY ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 6) && (
                    <div id="stage-islamic-6" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">`
);

// Stage 6 close
html = html.replace(
  `                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>`,
  `                      {/* Stage 6 Bottom Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => { setActiveIslamicStage(5); window.scrollTo({ top: 320, behavior: 'smooth' }); }}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (5) الاختبار الذاتي' : 'Prev: Stage 5'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveCurrentLectureToLibrary}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40"
                        >
                          <span>💾</span>
                          <span>{isRtl ? 'حفظ المحاضرة كاملة بمكتبتي الدائمة' : 'Save to Library'}</span>
                        </button>
                      </div>
                    </div>
                    )}
                    </div>
                  )}
                </div>
              )}
            </div>`
);

// 7. Bump Version to v47.0
html = html.replace(/v46\.0/g, 'v47.0');

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully updated index.html to v47.0 with Arabic PDF Sanitizer and Step-by-Step Flow!");

// 8. Update sw.js to mishkah-cache-v47
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/mishkah-cache-v46/g, 'mishkah-cache-v47');
fs.writeFileSync(swPath, sw, 'utf8');
console.log("Successfully updated sw.js to mishkah-cache-v47!");
