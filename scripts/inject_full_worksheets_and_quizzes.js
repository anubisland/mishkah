const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const wsMarker = '{/* ================= VIEW: PRINTABLE WORKSHEET ================= */}';
const wsStart = html.indexOf(wsMarker);
const mainEndMarker = '</main>';
const mainEnd = html.indexOf(mainEndMarker, wsStart);

if (wsStart === -1 || mainEnd === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

console.log('Replacing from wsStart to mainEnd. Block size to replace:', mainEnd - wsStart);

const NEW_JSX = `{/* ================= VIEW: PRINTABLE MULTI-BRANCH WORKSHEETS ================= */}
            {activeTab === 'worksheet' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Print Control Toolbar & Branch Switcher */}
                <div className="card-islamic-pearl rounded-2xl p-4 sm:p-5 border border-emerald-800/15 shadow-sm no-print">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {isRtl ? 'منظومة أوراق العمل والتقييم للطباعة (Printable PDF)' : 'Printable Worksheets & Evaluation System'}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 font-cairo">
                        {isRtl ? 'اختر مجال ورقة العمل المطلوبة:' : 'Select Worksheet Branch:'}
                      </h3>
                    </div>

                    {/* Branch Switcher Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setWorksheetBranch('islamic')}
                        className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                          worksheetBranch === 'islamic'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }\`}
                      >
                        <span>🕌</span>
                        <span>{isRtl ? 'أوراق عمل العلوم الشرعية (Branch 3)' : 'Islamic Studies Worksheets'}</span>
                      </button>

                      <button
                        onClick={() => setWorksheetBranch('tajweed')}
                        className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                          worksheetBranch === 'tajweed'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }\`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'ورقة عمل أحكام التجويد (Branch 2)' : 'Tajweed Worksheet'}</span>
                      </button>

                      <button
                        onClick={() => setWorksheetBranch('hifz')}
                        className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                          worksheetBranch === 'hifz'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }\`}
                      >
                        <span>🕋</span>
                        <span>{isRtl ? 'سجل متابعة التحفيظ (Branch 1)' : 'Hifz Evaluation Sheet'}</span>
                      </button>
                    </div>

                    {/* Print Button */}
                    <button 
                      onClick={() => window.print()}
                      className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition flex items-center gap-2 ml-auto"
                    >
                      <span>🖨️</span>
                      <span>{isRtl ? 'طباعة / تصدير PDF' : 'Print / Export to PDF'}</span>
                    </button>
                  </div>

                  {/* Sub-Category Filter for Islamic Studies */}
                  {worksheetBranch === 'islamic' && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-500">{isRtl ? 'التخصص الشرعي:' : 'Discipline:'}</span>
                      {[
                        { id: 'aqeedah', icon: '🌟', labelAr: 'العقيدة وأركان الإيمان', labelEn: 'Aqeedah' },
                        { id: 'fiqh', icon: '⚖️', labelAr: 'الفقه والعبادات', labelEn: 'Fiqh' },
                        { id: 'seerah', icon: '📜', labelAr: 'السيرة النبوية', labelEn: 'Seerah' },
                        { id: 'tazkiyah', icon: '💎', labelAr: 'الآداب والتزكية', labelEn: 'Tazkiyah' }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setWorksheetIslamicCategory(cat.id)}
                          className={\`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 \${
                            worksheetIslamicCategory === cat.id
                              ? 'bg-gold-400 text-emerald-950 shadow font-extrabold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }\`}
                        >
                          <span>{cat.icon}</span>
                          <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- BRANCH 3: ISLAMIC STUDIES WORKSHEET DUAL FORMAT --- */}
                {worksheetBranch === 'islamic' && (() => {
                  const ws = ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
                  return (
                    <div className="space-y-8">
                      {/* Printable Sheet 1: Student Version */}
                      <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
                        <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
                          <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                            {isRtl ? 'مِشكاة — نظام التشغيل الشامل للداعية والمعلم الشرعي | AnubisLand' : 'Mishkah Platform — AnubisLand'}
                          </div>
                          <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                            {isRtl ? ws.titleAr : ws.titleEn}
                          </h2>
                          <div className="inline-block bg-emerald-50 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200 mt-1">
                            {isRtl ? 'نسخة الطالب للمدارسة والتطبيق' : 'Student Study & Application Copy'}
                          </div>
                          <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 mt-4 px-2">
                            <span>{isRtl ? 'اسم الطالب / الدارس:' : 'Student Name:'} ____________________</span>
                            <span>{isRtl ? 'المجال الشرعي:' : 'Discipline:'} {isRtl ? ws.categoryAr : ws.categoryEn}</span>
                            <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                          </div>
                        </div>

                        {/* Core Scriptural Reference Box */}
                        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 mb-6 text-xs">
                          <div className="font-bold text-emerald-900 mb-1">{isRtl ? '📖 الشاهد المعتمد من الكتاب والسنة:' : 'Core Scriptural Evidence:'}</div>
                          <div className="font-quran text-base text-emerald-950 leading-relaxed mb-1">{ws.quranRef}</div>
                          <div className="font-amiri text-xs text-slate-700">{ws.hadithRef}</div>
                        </div>

                        {/* Student Questions Table */}
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                            <thead className="bg-emerald-800 text-white text-xs">
                              <tr>
                                <th className="p-3 w-10 text-center">#</th>
                                <th className="p-3 w-44">{isRtl ? 'المسألة الشرعية' : 'Topic'}</th>
                                <th className="p-3 w-48">{isRtl ? 'الدليل والتخريج' : 'Scripture / Source'}</th>
                                <th className="p-3">{isRtl ? 'إجابة الطالب والتأصيل المستفاد' : 'Student Answer & Deductions'}</th>
                                <th className="p-3 w-20 text-center">{isRtl ? 'الدرجة' : 'Grade'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-xs">
                              {ws.items.map((it, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-3 text-center font-bold text-slate-500">{it.num}</td>
                                  <td className="p-3 font-bold text-emerald-950 font-cairo">{it.topic}</td>
                                  <td className="p-3 text-slate-600 font-amiri text-xs leading-relaxed">{it.scripture}</td>
                                  <td className="p-3 space-y-2">
                                    <div className="font-bold text-slate-800 font-amiri text-xs">{it.studentQuestion}</div>
                                    <div className="text-slate-400 italic pt-1 border-b border-dashed border-slate-200">الإجابة: ____________________________________________________________________</div>
                                    <div className="text-slate-400 italic border-b border-dashed border-slate-200">التطبيق العملي: ___________________________________________________________</div>
                                  </td>
                                  <td className="p-3 text-center text-slate-400">/ 5</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Student Version Footer */}
                        <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
                          <span>{isRtl ? 'تقييم وتوقيع المعلم:' : 'Teacher Signature & Grade:'} _______________</span>
                          <span>Mishkah Operating System — AnubisLand</span>
                        </div>
                      </div>

                      {/* Print Page Break */}
                      <div className="page-break my-8 no-print border-t-2 border-dashed border-slate-300 text-center py-2 text-xs text-slate-400 font-bold">
                        ✂️ {isRtl ? 'فاصل صفحة الطباعة — يبدأ هنا نموذج إجابة المعلم المعتمد' : 'Page Break — Teacher Answer Key Follows'}
                      </div>

                      {/* Printable Sheet 2: Teacher Answer Key */}
                      <div className="bg-white rounded-3xl p-8 border-2 border-gold-300 shadow-lg print:border-none print:shadow-none print:p-0">
                        <div className="text-center border-b-2 border-gold-600 pb-4 mb-6">
                          <span className="bg-gold-100 text-gold-900 border border-gold-300 text-xs px-3 py-1 rounded-full font-bold">
                            {isRtl ? 'خاص بالمعلم والشيخ — نموذج الإجابة المعتمد والتوجيهات التربوية' : 'Confidential Teacher Answer Key & Guidance'}
                          </span>
                          <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-2">
                            {isRtl ? ws.titleAr : ws.titleEn}
                          </h2>
                          <div className="text-xs text-slate-500 mt-1">
                            {isRtl ? 'دليل التصحيح النموذجي والتأصيل الشرعي المحكم' : 'Official Answer Key with Authentic Citations'}
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                            <thead className="bg-emerald-950 text-gold-300 text-xs">
                              <tr>
                                <th className="p-3 w-10 text-center">#</th>
                                <th className="p-3 w-40">{isRtl ? 'المسألة الشرعية' : 'Topic'}</th>
                                <th className="p-3">{isRtl ? 'نموذج الإجابة والتأصيل الشرعي المعتمد' : 'Official Teacher Answer Key'}</th>
                                <th className="p-3 w-64">{isRtl ? 'الأثر السلوكي والتربوي المستهدف' : 'Behavioral & Spiritual Impact'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-xs">
                              {ws.items.map((it, idx) => (
                                <tr key={idx} className="hover:bg-gold-50/40">
                                  <td className="p-3 text-center font-bold text-slate-500">{it.num}</td>
                                  <td className="p-3 font-bold text-emerald-950 font-cairo">{it.topic}</td>
                                  <td className="p-3 font-amiri text-xs text-slate-800 leading-relaxed">
                                    <div className="font-bold text-emerald-900 mb-1">السؤال: {it.studentQuestion}</div>
                                    <div className="text-emerald-950 font-medium bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">{it.teacherAnswer}</div>
                                  </td>
                                  <td className="p-3 text-slate-700 text-xs font-amiri leading-relaxed bg-amber-50/30">
                                    {it.practicalImpact}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* --- BRANCH 2: TAJWEED WORKSHEET --- */}
                {worksheetBranch === 'tajweed' && (
                  <div className="space-y-8">
                    {/* Printable Document Sheet 1: Student Version */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
                      <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
                        <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                          {isRtl ? 'منصة مِشكاة لتعليم القرآن الكريم والتجويد — AnubisLand' : 'Mishkah Platform — AnubisLand'}
                        </div>
                        <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                          {isRtl ? 'ورقة مدارسة وتطبيق في أحكام التجويد (نسخة الطالب)' : 'Tajweed Student Worksheet'}
                        </h2>
                        <div className="flex justify-between items-center text-xs text-slate-600 mt-4 px-2">
                          <span>{isRtl ? 'اسم الطالب / الدارس:' : 'Student Name:'} ____________________</span>
                          <span>{isRtl ? 'السورة والآيات:' : 'Surah:'} {tajweedData?.metadata?.surah} ({tajweedData?.metadata?.ayahRange})</span>
                          <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto mb-8">
                        <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                          <thead className="bg-emerald-800 text-white text-xs">
                            <tr>
                              <th className="p-3 w-12 text-center">#</th>
                              <th className="p-3 font-amiri text-base">{isRtl ? 'الكلمة القرآنية (رسم عثماني)' : 'Quranic Word'}</th>
                              <th className="p-3">{isRtl ? 'الحكم التجويدي المطبق' : 'Tajweed Rule'}</th>
                              <th className="p-3">{isRtl ? 'العلة وسبب الحكم' : 'Reason / Articulation Rule'}</th>
                              <th className="p-3 w-28 text-center">{isRtl ? 'الدرجة' : 'Grade'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-sm">
                            {(tajweedData?.worksheet || []).map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="p-3 text-center font-bold text-slate-500">{row.itemNumber || i + 1}</td>
                                <td className="p-3 font-quran text-xl text-emerald-950 font-bold">{row.wordUthmani}</td>
                                <td className="p-3 text-slate-400 italic">____________________</td>
                                <td className="p-3 text-slate-400 italic">________________________________________</td>
                                <td className="p-3 text-center text-slate-400">/ 5</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
                        <span>{isRtl ? 'ملاحظات المعلم / التقييم:' : 'Teacher Signature & Final Grade:'} _______________</span>
                        <span>Mishkah PWA — AnubisLand</span>
                      </div>
                    </div>

                    {/* Page Break for Print */}
                    <div className="page-break my-8 no-print border-t-2 border-dashed border-slate-300 text-center py-2 text-xs text-slate-400 font-bold">
                      ✂️ {isRtl ? 'فاصل صفحة الطباعة — يبدأ هنا نموذج إجابة المعلم' : 'Page Break — Teacher Answer Key Follows'}
                    </div>

                    {/* Printable Document Sheet 2: Teacher Answer Key */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-gold-300 shadow-lg print:border-none print:shadow-none print:p-0">
                      <div className="text-center border-b-2 border-gold-600 pb-4 mb-6">
                        <span className="bg-gold-100 text-gold-900 border border-gold-300 text-xs px-3 py-1 rounded-full font-bold">
                          {isRtl ? 'خاص بالمعلم فقط — نموذج الإجابة المعتمد' : 'Teacher Answer Key (Confidential)'}
                        </span>
                        <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-2">
                          {isRtl ? 'دليل تصحيح ورقة العمل والعلل الصوتية' : 'Teacher Correction Guide & Phonetic Explanations'}
                        </h2>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                          <thead className="bg-emerald-950 text-gold-300 text-xs">
                            <tr>
                              <th className="p-3 w-12 text-center">#</th>
                              <th className="p-3 font-amiri text-base">{isRtl ? 'الكلمة القرآنية' : 'Quranic Word'}</th>
                              <th className="p-3">{isRtl ? 'الحكم الصحيح' : 'Correct Rule'}</th>
                              <th className="p-3">{isRtl ? 'التوجيه والعلة الصوتية' : 'Phonetic Explanation'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-sm">
                            {(tajweedData?.worksheet || []).map((row, i) => (
                              <tr key={i} className="hover:bg-gold-50/40">
                                <td className="p-3 text-center font-bold text-slate-500">{row.itemNumber || i + 1}</td>
                                <td className="p-3 font-quran text-xl text-emerald-950 font-bold">{row.wordUthmani}</td>
                                <td className="p-3 font-bold text-emerald-800">{row.ruleApplied}</td>
                                <td className="p-3 text-slate-700 text-xs leading-relaxed font-amiri">
                                  {isRtl ? row.reasonAr : row.reasonEn}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- BRANCH 1: HIFZ EVALUATION SHEET --- */}
                {worksheetBranch === 'hifz' && (
                  <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0 space-y-6">
                    <div className="text-center border-b-2 border-emerald-900 pb-4 mb-4">
                      <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                        {isRtl ? 'مِشكاة — سجل المتابعة القرآني المتكامل | AnubisLand' : 'Mishkah Platform — AnubisLand'}
                      </div>
                      <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                        {isRtl ? HIFZ_BRANCH_WORKSHEET.titleAr : HIFZ_BRANCH_WORKSHEET.titleEn}
                      </h2>
                      <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 mt-4 px-2">
                        <span>{isRtl ? 'اسم الطالب:' : 'Student Name:'} ____________________</span>
                        <span>{isRtl ? 'السورة والآيات المقررة:' : 'Surah / Passage:'} {hifzSurahName} ({hifzAyahRange})</span>
                        <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                        <thead className="bg-emerald-800 text-white text-xs">
                          <tr>
                            <th className="p-3 w-12 text-center">#</th>
                            <th className="p-3 w-56">{isRtl ? 'معيار التقييم' : 'Criterion'}</th>
                            <th className="p-3">{isRtl ? 'الوصف التوجيهي والملاحظات' : 'Description & Teacher Notes'}</th>
                            <th className="p-3 w-32 text-center">{isRtl ? 'الدرجة المستحقة' : 'Score'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm">
                          {HIFZ_BRANCH_WORKSHEET.criteria.map((cr, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 text-center font-bold text-slate-500">{cr.num}</td>
                              <td className="p-3 font-bold text-emerald-950 font-cairo">{cr.domain}</td>
                              <td className="p-3 text-slate-600 font-amiri text-xs leading-relaxed">
                                <div>{cr.description}</div>
                                <div className="text-slate-400 italic mt-2 border-b border-dashed border-slate-200 pb-1">ملاحظة المحفظ: __________________________________________________</div>
                              </td>
                              <td className="p-3 text-center font-bold text-emerald-900">
                                <span className="text-slate-400 font-normal">___ / </span>{cr.maxScore}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-emerald-50 text-emerald-950 font-bold text-sm">
                          <tr>
                            <td colSpan="3" className="p-3 text-left pl-6">{isRtl ? 'المجموع النهائي للتقييم:' : 'Total Final Score:'}</td>
                            <td className="p-3 text-center text-emerald-900 font-extrabold">_____ / 100</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
                      <span>{isRtl ? 'توقيع الشيخ المحفظ واعتماد الورد القادم:' : 'Teacher Signature & Next Assignment:'} _______________</span>
                      <span>Mishkah PWA — AnubisLand</span>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================= VIEW: INTERACTIVE SELF-GRADING QUIZ (MULTI-BRANCH) ================= */}
            {activeTab === 'quiz' && (
              <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md">
                  
                  {/* Quiz Branch Switcher & Header */}
                  <div className="pb-4 mb-6 border-b border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          {isRtl ? 'منظومة المراجعة الذاتية التفاعلية للدارسين' : 'Interactive Self-Grading Student Quizzes'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold font-cairo text-emerald-950 mt-0.5">
                          {isRtl ? 'اختبر معلوماتكِ التفاعلية في علوم الشريعة والقرآن' : 'Test Your Knowledge Across All Disciplines'}
                        </h2>
                      </div>
                      {quizSubmitted && (
                        <div className="bg-emerald-900 text-gold-300 px-4 py-2 rounded-2xl border border-gold-400 font-bold text-sm shadow">
                          {isRtl ? \`النتيجة النهائية: \${quizScore}%\` : \`Score: \${quizScore}%\`}
                        </div>
                      )}
                    </div>

                    {/* Quiz Branch Selector Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSwitchQuizBranch('islamic', 'aqeedah')}
                        className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                          quizBranch === 'islamic'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }\`}
                      >
                        <span>🕌</span>
                        <span>{isRtl ? 'اختبار العلوم الشرعية (Branch 3)' : 'Islamic Studies Quiz'}</span>
                      </button>

                      <button
                        onClick={() => handleSwitchQuizBranch('tajweed')}
                        className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                          quizBranch === 'tajweed'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }\`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'اختبار أحكام التجويد (Branch 2)' : 'Tajweed Quiz'}</span>
                      </button>

                      <button
                        onClick={() => handleSwitchQuizBranch('hifz')}
                        className={\`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 \${
                          quizBranch === 'hifz'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }\`}
                      >
                        <span>🕋</span>
                        <span>{isRtl ? 'اختبار المتشابهات وضبط الحفظ (Branch 1)' : 'Hifz Mutashabihat Quiz'}</span>
                      </button>
                    </div>

                    {/* Sub-Discipline Pills for Islamic Studies Quiz */}
                    {quizBranch === 'islamic' && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/80">
                        <span className="text-xs font-bold text-slate-500">{isRtl ? 'المجال:' : 'Subject:'}</span>
                        {[
                          { id: 'aqeedah', icon: '🌟', labelAr: 'العقيدة وأركان الإيمان', labelEn: 'Aqeedah' },
                          { id: 'fiqh', icon: '⚖️', labelAr: 'الفقه والعبادات', labelEn: 'Fiqh' },
                          { id: 'seerah', icon: '📜', labelAr: 'السيرة النبوية', labelEn: 'Seerah' },
                          { id: 'tazkiyah', icon: '💎', labelAr: 'الآداب والتزكية', labelEn: 'Tazkiyah' }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleSwitchQuizBranch('islamic', cat.id)}
                            className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 \${
                              quizIslamicCategory === cat.id
                                ? 'bg-gold-400 text-emerald-950 font-extrabold shadow'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }\`}
                          >
                            <span>{cat.icon}</span>
                            <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6">
                    {activeQuizQuestions.map((q, qIndex) => {
                      const selected = quizAnswers[q.id];
                      const isCorrect = selected === q.correctOptionId;
                      
                      return (
                        <div key={q.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                          <div className="flex items-start gap-2.5 mb-3">
                            <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                              {qIndex + 1}
                            </span>
                            <h3 className="font-bold text-emerald-950 text-base leading-snug font-cairo">
                              {isRtl ? q.questionAr : q.questionEn}
                            </h3>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                            {q.options.map(opt => {
                              const isThisSelected = selected === opt.id;
                              let btnClass = 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300';
                              
                              if (quizSubmitted) {
                                if (opt.id === q.correctOptionId) {
                                  btnClass = 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold';
                                } else if (isThisSelected && !isCorrect) {
                                  btnClass = 'bg-red-100 border-red-500 text-red-900';
                                }
                              } else if (isThisSelected) {
                                btnClass = 'bg-emerald-800 text-gold-200 border-emerald-900 font-bold shadow';
                              }

                              return (
                                <button
                                  key={opt.id}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                                  className={\`p-3 rounded-xl border text-right text-xs transition flex items-center justify-between \${btnClass}\`}
                                >
                                  <span>{isRtl ? opt.textAr : opt.textEn}</span>
                                  {quizSubmitted && opt.id === q.correctOptionId && <span>✓</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanations shown after submit */}
                          {quizSubmitted && (
                            <div className={\`mt-3 p-3.5 rounded-xl text-xs font-amiri leading-relaxed \${
                              isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                            }\`}>
                              <strong>{isCorrect ? '✓ إجابة صحيحة بارك الله فيكِ:' : '✗ توضيح الإجابة الصحيحة والتأصيل الشرعي:'}</strong> {isRtl ? q.explanationAr : q.explanationEn}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Reset Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                    {quizSubmitted ? (
                      <button 
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
                      >
                        {isRtl ? 'إعادة الاختبار من جديد' : 'Retake Quiz'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(quizAnswers).length === 0}
                        className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition disabled:opacity-40"
                      >
                        {isRtl ? 'تسليم الإجابات والتقييم الفوري' : 'Submit Answers'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          `;

html = html.substring(0, wsStart) + NEW_JSX + html.substring(mainEnd);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated worksheet and quiz sections! New length:', html.length);
