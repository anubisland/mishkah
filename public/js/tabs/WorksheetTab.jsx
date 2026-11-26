    // WorksheetTab: the "worksheet" screen, moved out of App unchanged.
    // Every App value it reads arrives as a prop of the same name.
    function WorksheetTab({ customIslamicWorksheets, customTajweedWorksheet, editingTajweedItemIdx, editingWorksheetItemIdx, handleClearIslamicWorksheet, handleClearTajweedWorksheet, handleDeleteTajweedItem, handleDeleteWorksheetItem, handleResetIslamicWorksheet, handleResetTajweedWorksheet, handleSaveTajweedItem, handleSaveWorksheetItem, handleTransferLectureToWorksheet, handleTransferTajweedToWorksheet, hifzAyahRange, hifzSurahName, isAddingTajweedItem, isAddingWorksheetItem, isRtl, islamicData, setCustomIslamicWorksheets, setCustomTajweedWorksheet, setEditingTajweedItemIdx, setEditingWorksheetItemIdx, setIsAddingTajweedItem, setIsAddingWorksheetItem, setTajweedItemForm, setWorksheetBranch, setWorksheetIslamicCategory, setWorksheetItemForm, setWorksheetMode, tajweedData, tajweedItemForm, worksheetBranch, worksheetIslamicCategory, worksheetItemForm, worksheetMode }) {
      return (
        <div className="space-y-6 animate-fadeIn">
                
                {/* Print Control Toolbar & Branch Switcher */}
                <div className="card-islamic-pearl rounded-2xl p-4 sm:p-5 border border-emerald-800/15 shadow-sm no-print">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {isRtl ? 'منظومة أوراق العمل وأدوات المعلم للطباعة (Worksheets System)' : 'Printable Worksheets & Teacher Authoring'}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 font-cairo">
                        {isRtl ? 'اختر مجال ورقة العمل المطلوبة:' : 'Select Worksheet Branch:'}
                      </h3>
                    </div>

                    {/* Branch Switcher Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setWorksheetBranch('islamic')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          worksheetBranch === 'islamic'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕌</span>
                        <span>{isRtl ? 'أوراق عمل العلوم الشرعية (Branch 3)' : 'Islamic Studies Worksheets'}</span>
                      </button>

                      <button
                        onClick={() => setWorksheetBranch('tajweed')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          worksheetBranch === 'tajweed'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'ورقة عمل أحكام التجويد (Branch 2)' : 'Tajweed Worksheet'}</span>
                      </button>

                      <button
                        onClick={() => setWorksheetBranch('hifz')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          worksheetBranch === 'hifz'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕋</span>
                        <span>{isRtl ? 'سجل متابعة التحفيظ (Branch 1)' : 'Hifz Evaluation Sheet'}</span>
                      </button>
                    </div>

                    {/* Mode Toggle (Preview / Print vs Builder) & Print Button */}
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setWorksheetMode('preview')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            worksheetMode === 'preview'
                              ? 'bg-emerald-800 text-gold-200 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          📄 {isRtl ? 'معاينة وطباعة PDF' : 'Preview & Print'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWorksheetMode('builder')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            worksheetMode === 'builder'
                              ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ✍️ {isRtl ? 'محرر وتخصيص البنود' : 'Worksheet Builder'}
                        </button>
                      </div>

                      {worksheetMode === 'preview' && (
                        <button 
                          onClick={() => window.print()}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-extrabold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-2"
                        >
                          <span>🖨️</span>
                          <span>{isRtl ? 'طباعة / تصدير PDF' : 'Print / Export to PDF'}</span>
                        </button>
                      )}
                    </div>
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
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            worksheetIslamicCategory === cat.id
                              ? 'bg-gold-400 text-emerald-950 shadow font-extrabold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ================= MODE: TEACHER WORKSHEET BUILDER / EDITOR ================= */}
                {worksheetMode === 'builder' && (
                  <div className="space-y-6">

                    {/* Islamic Studies Builder */}
                    {worksheetBranch === 'islamic' && (() => {
                      const current = customIslamicWorksheets[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
                      return (
                        <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md space-y-6">
                          
                          {/* Banner & Guidance */}
                          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-emerald-950 text-sm font-cairo">
                                🛠️ {isRtl ? 'أداة المعلم: تخصيص وبناء ورقة عمل العلوم الشرعية' : 'Teacher Workbench: Build Islamic Studies Worksheet'}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl 
                                  ? 'يمكنك إضافة مسائلك وأسئلتك الخاصة، تحديد نموذج الإجابة، أو استيراد محاور ورقة العمل بضغطة زر من محاضرتك النشطة.'
                                  : 'Add custom topics, questions, teacher answer keys, or import directly from your active lecture.'}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {islamicData && (
                                <button
                                  type="button"
                                  onClick={handleTransferLectureToWorksheet}
                                  className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                                >
                                  <span>⚡</span>
                                  <span>{isRtl ? 'استيراد من محاضرتي النشطة' : 'Import from Active Lecture'}</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingWorksheetItemIdx(null);
                                  setWorksheetItemForm({ topic: '', scripture: '', studentQuestion: '', teacherAnswer: '', practicalImpact: '', maxScore: 5 });
                                  setIsAddingWorksheetItem(true);
                                }}
                                className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                              >
                                <span>➕</span>
                                <span>{isRtl ? 'إضافة مسألة / سؤال جديد' : 'Add New Question'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleClearIslamicWorksheet}
                                className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                              >
                                🧹 {isRtl ? 'تفريغ الورقة' : 'Clear Sheet'}
                              </button>
                              <button
                                type="button"
                                onClick={handleResetIslamicWorksheet}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                              >
                                🔄 {isRtl ? 'استعادة النموذج المعتمد' : 'Restore Canonical'}
                              </button>
                            </div>
                          </div>

                          {/* Editable Header Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'عنوان ورقة العمل الرئيسية:' : 'Worksheet Main Title:'}
                              </label>
                              <input
                                type="text"
                                value={current.titleAr || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomIslamicWorksheets(prev => ({
                                    ...prev,
                                    [worksheetIslamicCategory]: { ...(prev[worksheetIslamicCategory] || current), titleAr: val }
                                  }));
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'الفئة المستهدفة / المستوى:' : 'Target Audience:'}
                              </label>
                              <input
                                type="text"
                                value={current.targetAudience || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomIslamicWorksheets(prev => ({
                                    ...prev,
                                    [worksheetIslamicCategory]: { ...(prev[worksheetIslamicCategory] || current), targetAudience: val }
                                  }));
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>
                          </div>

                          {/* Add / Edit Form Modal / Inline Box */}
                          {isAddingWorksheetItem && (
                            <form onSubmit={handleSaveWorksheetItem} className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                              <div className="flex items-center justify-between border-b border-gold-400/40 pb-2">
                                <h4 className="font-black text-emerald-950 text-sm font-cairo">
                                  {editingWorksheetItemIdx !== null ? (isRtl ? '✏️ تعديل المسألة الشرعية' : 'Edit Question Item') : (isRtl ? '➕ إضافة مسألة وسؤال جديد لورقة العمل' : 'Add New Question Item')}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingWorksheetItem(false);
                                    setEditingWorksheetItemIdx(null);
                                  }}
                                  className="text-slate-500 hover:text-slate-700 font-bold text-xs"
                                >
                                  ✕ {isRtl ? 'إلغاء' : 'Cancel'}
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'المسألة الشرعية / عنوان المحور:' : 'Topic / Core Subject:'}
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder={isRtl ? 'مثال: الإيمان بالقضاء والقدر وعلاج الجزع' : 'e.g. Belief in Divine Decree'}
                                    value={worksheetItemForm.topic}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, topic: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'الشاهد والدليل والتخريج:' : 'Scriptural Evidence / Citation:'}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder={isRtl ? 'مثال: حديث مسلم #2664 أو آية القمر 49' : 'e.g. Sahih Muslim #2664'}
                                    value={worksheetItemForm.scripture}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, scripture: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-emerald-950 mb-1">
                                  {isRtl ? 'سؤال الطالب والتطبيق المطلوب منه الإجابة عليه في الورقة:' : 'Student Question & Prompt for the Worksheet:'}
                                </label>
                                <textarea
                                  rows={2}
                                  required
                                  placeholder={isRtl ? 'اكتب صيغة السؤال الموجه للدارس...' : 'Enter prompt for the student to answer...'}
                                  value={worksheetItemForm.studentQuestion}
                                  onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, studentQuestion: e.target.value })}
                                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'نموذج إجابة المعلم المعتمد والتأصيل (يظهر في نسخة المعلم فقط):' : 'Teacher Answer Key (Teacher Copy Only):'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder={isRtl ? 'اكتب التأصيل والجواب النموذجي للتصحيح...' : 'Enter official answer for grading...'}
                                    value={worksheetItemForm.teacherAnswer}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, teacherAnswer: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'الأثر السلوكي والتربوي المستهدف:' : 'Target Behavioral & Spiritual Impact:'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder={isRtl ? 'مثال: السكينة النفسية والتسليم لحكمة الله...' : 'e.g. Psychological peace...'}
                                    value={worksheetItemForm.practicalImpact}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, practicalImpact: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingWorksheetItem(false);
                                    setEditingWorksheetItemIdx(null);
                                  }}
                                  className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300"
                                >
                                  {isRtl ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                  type="submit"
                                  className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                                >
                                  <span>💾</span>
                                  <span>{isRtl ? 'حفظ البند في ورقة العمل' : 'Save Item to Worksheet'}</span>
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Current Items Table / Management List */}
                          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-950 font-cairo">
                                📋 {isRtl ? `بنود ورقة العمل الحالية (${(current.items || []).length} مسائل):` : `Current Items (${(current.items || []).length}):`}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {isRtl ? 'يمكنك التعديل أو الحذف، ثم الضغط على "معاينة وطباعة" بالترويسة' : 'Edit or delete items, then click Preview & Print'}
                              </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                              {(current.items || []).length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs">
                                  {isRtl ? 'ورقة العمل فارغة حالياً. اضغط "إضافة مسألة جديدة" أو "استيراد من المحاضرة النشطة" للبدء.' : 'No items yet. Click Add Question or Import to begin.'}
                                </div>
                              ) : (
                                (current.items || []).map((it, idx) => (
                                  <div key={idx} className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                      <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                        {it.num || idx + 1}
                                      </span>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-bold text-emerald-950 text-sm font-cairo">{it.topic}</h5>
                                          {it.scripture && (
                                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                              {it.scripture}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-700 font-amiri mt-1 leading-snug">
                                          <strong>{isRtl ? 'السؤال:' : 'Question:'}</strong> {it.studentQuestion}
                                        </p>
                                        {it.teacherAnswer && (
                                          <p className="text-[11px] text-slate-500 font-amiri mt-0.5 line-clamp-1">
                                            <strong>{isRtl ? 'نموذج الإجابة:' : 'Model Answer:'}</strong> {it.teacherAnswer}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setWorksheetItemForm({
                                            topic: it.topic || '',
                                            scripture: it.scripture || '',
                                            studentQuestion: it.studentQuestion || '',
                                            teacherAnswer: it.teacherAnswer || '',
                                            practicalImpact: it.practicalImpact || '',
                                            maxScore: it.maxScore || 5
                                          });
                                          setEditingWorksheetItemIdx(idx);
                                          setIsAddingWorksheetItem(true);
                                        }}
                                        className="bg-slate-100 hover:bg-gold-100 text-slate-700 hover:text-emerald-950 p-2 rounded-lg text-xs font-bold transition"
                                        title={isRtl ? 'تعديل البند' : 'Edit'}
                                      >
                                        ✏️ {isRtl ? 'تعديل' : 'Edit'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteWorksheetItem(idx)}
                                        className="bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition"
                                        title={isRtl ? 'حذف البند' : 'Delete'}
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })()}

                    {/* Tajweed Worksheet Builder */}
                    {worksheetBranch === 'tajweed' && (
                      <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md space-y-6">
                        
                        {/* Banner & Guidance */}
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-emerald-950 text-sm font-cairo">
                              🛠️ {isRtl ? 'أداة المعلم: تخصيص ورقة عمل أحكام التجويد' : 'Teacher Workbench: Build Tajweed Worksheet'}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1">
                              {isRtl 
                                ? 'أدخل الكلمات القرآنية بالرسم العثماني، حدد الحكم التجويدي المطبق والعلة الصوتية، أو استورد الكلمات من درس التجويد النشط.'
                                : 'Add Quranic words, specify rules and phonetic reasons, or import directly from current Tajweed lesson.'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {tajweedData && (
                              <button
                                type="button"
                                onClick={handleTransferTajweedToWorksheet}
                                className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                              >
                                <span>⚡</span>
                                <span>{isRtl ? 'استيراد الكلمات من درس التجويد' : 'Import from Tajweed Lesson'}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTajweedItemIdx(null);
                                setTajweedItemForm({ wordUthmani: '', ruleApplied: '', reasonAr: '', maxScore: 5 });
                                setIsAddingTajweedItem(true);
                              }}
                              className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                            >
                              <span>➕</span>
                              <span>{isRtl ? 'إضافة كلمة وحكم جديد' : 'Add Quranic Word'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleClearTajweedWorksheet}
                              className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                            >
                              🧹 {isRtl ? 'تفريغ الورقة' : 'Clear Sheet'}
                            </button>
                            <button
                              type="button"
                              onClick={handleResetTajweedWorksheet}
                              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                            >
                              🔄 {isRtl ? 'استعادة النموذج المعتمد' : 'Restore Canonical'}
                            </button>
                          </div>
                        </div>

                        {/* Editable Tajweed Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {isRtl ? 'عنوان ورقة التجويد:' : 'Tajweed Worksheet Title:'}
                            </label>
                            <input
                              type="text"
                              value={customTajweedWorksheet.titleAr || ''}
                              onChange={(e) => setCustomTajweedWorksheet({ ...customTajweedWorksheet, titleAr: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {isRtl ? 'السورة والآيات المقررة:' : 'Surah / Passage:'}
                            </label>
                            <input
                              type="text"
                              value={customTajweedWorksheet.surah || ''}
                              onChange={(e) => setCustomTajweedWorksheet({ ...customTajweedWorksheet, surah: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>
                        </div>

                        {/* Add/Edit Tajweed Word Form */}
                        {isAddingTajweedItem && (
                          <form onSubmit={handleSaveTajweedItem} className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                            <div className="flex items-center justify-between border-b border-gold-400/40 pb-2">
                              <h4 className="font-black text-emerald-950 text-sm font-cairo">
                                {editingTajweedItemIdx !== null ? (isRtl ? '✏️ تعديل الكلمة والحكم التجويدي' : 'Edit Tajweed Word') : (isRtl ? '➕ إضافة كلمة وحكم تجويدي جديد' : 'Add New Tajweed Word')}
                              </h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingTajweedItem(false);
                                  setEditingTajweedItemIdx(null);
                                }}
                                className="text-slate-500 hover:text-slate-700 font-bold text-xs"
                              >
                                ✕ {isRtl ? 'إلغاء' : 'Cancel'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-emerald-950 mb-1">
                                  {isRtl ? 'الكلمة أو التركيب بالرسم العثماني المطهّر:' : 'Quranic Word (Uthmani Script):'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder={isRtl ? 'مثال: مِن بَعْدِ أو شَىْءٍ قَدِيرٌ' : 'e.g. مِن بَعْدِ'}
                                  value={tajweedItemForm.wordUthmani}
                                  onChange={(e) => setTajweedItemForm({ ...tajweedItemForm, wordUthmani: e.target.value })}
                                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-base font-quran text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-emerald-950 mb-1">
                                  {isRtl ? 'الحكم التجويدي المطبق:' : 'Applied Tajweed Rule:'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder={isRtl ? 'مثال: إقلاب / إخفاء حقيقي بغنة مفخمة' : 'e.g. Iqlab'}
                                  value={tajweedItemForm.ruleApplied}
                                  onChange={(e) => setTajweedItemForm({ ...tajweedItemForm, ruleApplied: e.target.value })}
                                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-950 mb-1">
                                {isRtl ? 'التوجيه والعلة الصوتية والمخرج (نموذج الإجابة للتصحيح):' : 'Phonetic Reason / Makhraj (Teacher Answer Key):'}
                              </label>
                              <textarea
                                rows={2}
                                placeholder={isRtl ? 'مثال: لوقوع حرف الباء بعد النون الساكنة فتقلب ميماً مخفاة بغنة...' : 'Explain articulation point and rule...'}
                                value={tajweedItemForm.reasonAr}
                                onChange={(e) => setTajweedItemForm({ ...tajweedItemForm, reasonAr: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingTajweedItem(false);
                                  setEditingTajweedItemIdx(null);
                                }}
                                className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300"
                              >
                                {isRtl ? 'إلغاء' : 'Cancel'}
                              </button>
                              <button
                                type="submit"
                                className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                              >
                                <span>💾</span>
                                <span>{isRtl ? 'حفظ الكلمة في الورقة' : 'Save Tajweed Word'}</span>
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Words Management List */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-950 font-cairo">
                              📋 {isRtl ? `الكلمات القرآنية المجدولة (${(customTajweedWorksheet.items || []).length} كلمات):` : `Scheduled Words (${(customTajweedWorksheet.items || []).length}):`}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {isRtl ? 'تظهر الكلمات في جدول ورقة العمل للدارس ليكتب الحكم والعلة' : 'Words appear in student table to fill rules'}
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100">
                            {(customTajweedWorksheet.items || []).length === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-xs">
                                {isRtl ? 'لا توجد كلمات حالياً. اضغط "إضافة كلمة وحكم جديد" للبدء.' : 'No words scheduled yet.'}
                              </div>
                            ) : (
                              (customTajweedWorksheet.items || []).map((it, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                      {it.itemNumber || idx + 1}
                                    </span>
                                    <div>
                                      <div className="flex items-center gap-3">
                                        <span className="font-quran text-xl text-emerald-950 font-bold">{it.wordUthmani}</span>
                                        <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                                          {it.ruleApplied}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600 font-amiri mt-1">
                                        {it.reasonAr}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTajweedItemForm({
                                          wordUthmani: it.wordUthmani || '',
                                          ruleApplied: it.ruleApplied || '',
                                          reasonAr: it.reasonAr || '',
                                          maxScore: it.maxScore || 5
                                        });
                                        setEditingTajweedItemIdx(idx);
                                        setIsAddingTajweedItem(true);
                                      }}
                                      className="bg-slate-100 hover:bg-gold-100 text-slate-700 hover:text-emerald-950 p-2 rounded-lg text-xs font-bold transition"
                                      title={isRtl ? 'تعديل' : 'Edit'}
                                    >
                                      ✏️ {isRtl ? 'تعديل' : 'Edit'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTajweedItem(idx)}
                                      className="bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition"
                                      title={isRtl ? 'حذف' : 'Delete'}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* ================= MODE: PRINTABLE WORKSHEET PREVIEW (DUAL SHEETS) ================= */}
                {worksheetMode === 'preview' && (
                  <div className="space-y-8">
                    
                    {/* --- BRANCH 3: ISLAMIC STUDIES WORKSHEET DUAL FORMAT --- */}
                    {worksheetBranch === 'islamic' && (() => {
                      const ws = customIslamicWorksheets[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
                      return (
                        <div className="space-y-8">
                          {/* Printable Sheet 1: Student Version */}
                          <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
                            <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
                              <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                                {isRtl ? 'منصة مِشكاة — نظام التشغيل الشامل للداعية والمعلم الشرعي | AnubisLand' : 'Mishkah Platform — AnubisLand'}
                              </div>
                              <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                                {isRtl ? ws.titleAr : ws.titleEn}
                              </h2>
                              <div className="inline-block bg-emerald-50 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200 mt-1">
                                {isRtl ? 'نسخة الطالب للمدارسة والتطبيق' : 'Student Study & Application Copy'}
                              </div>
                              <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 mt-4 px-2">
                                <span>{isRtl ? 'اسم الطالب / الدارس:' : 'Student Name:'} ____________________</span>
                                <span>{isRtl ? 'المجال الشرعي:' : 'Discipline:'} {isRtl ? (ws.categoryAr || 'العلوم الشرعية') : (ws.categoryEn || 'Islamic Studies')}</span>
                                <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                              </div>
                            </div>

                            {/* Core Scriptural Reference Box */}
                            {(ws.quranRef || ws.hadithRef) && (
                              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 mb-6 text-xs">
                                <div className="font-bold text-emerald-900 mb-1">{isRtl ? '📖 الشاهد المعتمد من الكتاب والسنة:' : 'Core Scriptural Evidence:'}</div>
                                {ws.quranRef && <div className="font-quran text-base text-emerald-950 leading-relaxed mb-1">{ws.quranRef}</div>}
                                {ws.hadithRef && <div className="font-amiri text-xs text-slate-700">{ws.hadithRef}</div>}
                              </div>
                            )}

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
                                  {(ws.items || []).map((it, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                      <td className="p-3 text-center font-bold text-slate-500">{it.num || idx + 1}</td>
                                      <td className="p-3 font-bold text-emerald-950 font-cairo">{it.topic}</td>
                                      <td className="p-3 text-slate-600 font-amiri text-xs leading-relaxed">{it.scripture || '—'}</td>
                                      <td className="p-3 space-y-2">
                                        <div className="font-bold text-slate-800 font-amiri text-xs">{it.studentQuestion}</div>
                                        <div className="text-slate-400 italic pt-1 border-b border-dashed border-slate-200">الإجابة: ____________________________________________________________________</div>
                                        <div className="text-slate-400 italic border-b border-dashed border-slate-200">التطبيق العملي: ___________________________________________________________</div>
                                      </td>
                                      <td className="p-3 text-center text-slate-400">/ {it.maxScore || 5}</td>
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
                                  {(ws.items || []).map((it, idx) => (
                                    <tr key={idx} className="hover:bg-gold-50/40">
                                      <td className="p-3 text-center font-bold text-slate-500">{it.num || idx + 1}</td>
                                      <td className="p-3 font-bold text-emerald-950 font-cairo">{it.topic}</td>
                                      <td className="p-3 font-amiri text-xs text-slate-800 leading-relaxed">
                                        <div className="font-bold text-emerald-900 mb-1">السؤال: {it.studentQuestion}</div>
                                        <div className="text-emerald-950 font-medium bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">{it.teacherAnswer || '—'}</div>
                                      </td>
                                      <td className="p-3 text-slate-700 text-xs font-amiri leading-relaxed bg-amber-50/30">
                                        {it.practicalImpact || '—'}
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
                              {isRtl ? customTajweedWorksheet.titleAr : customTajweedWorksheet.titleEn}
                            </h2>
                            <div className="flex justify-between items-center text-xs text-slate-600 mt-4 px-2">
                              <span>{isRtl ? 'اسم الطالب / الدارس:' : 'Student Name:'} ____________________</span>
                              <span>{isRtl ? 'السورة والآيات:' : 'Surah:'} {customTajweedWorksheet.surah}</span>
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
                                {(customTajweedWorksheet.items || []).map((row, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-3 text-center font-bold text-slate-500">{row.itemNumber || i + 1}</td>
                                    <td className="p-3 font-quran text-xl text-emerald-950 font-bold">{row.wordUthmani}</td>
                                    <td className="p-3 text-slate-400 italic">____________________</td>
                                    <td className="p-3 text-slate-400 italic">________________________________________</td>
                                    <td className="p-3 text-center text-slate-400">/ {row.maxScore || 5}</td>
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
                                {(customTajweedWorksheet.items || []).map((row, i) => (
                                  <tr key={i} className="hover:bg-gold-50/40">
                                    <td className="p-3 text-center font-bold text-slate-500">{row.itemNumber || i + 1}</td>
                                    <td className="p-3 font-quran text-xl text-emerald-950 font-bold">{row.wordUthmani}</td>
                                    <td className="p-3 font-bold text-emerald-800">{row.ruleApplied}</td>
                                    <td className="p-3 text-slate-700 text-xs leading-relaxed font-amiri">
                                      {row.reasonAr}
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

              </div>
      );
    }
