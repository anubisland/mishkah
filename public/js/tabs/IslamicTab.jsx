    // IslamicTab: the "islamic" screen, moved out of App unchanged.
    // Every App value it reads arrives as a prop of the same name.
    function IslamicTab({ setSlideStudioOpen, activeIslamicStage, broadcastSlideSync, extractEvidencesAndProofs, extractedEvidences, handleCondenseSlide, handleCopyWhatsApp, handleDeleteSavedLecture, handleExportIslamicPowerPoint, handleExportLibrary, handleImportLibrary, handleJumpToStage, handleLectureFileUpload, handleLoadDemoIslamic, handleLoadSavedLecture, handleOpenStudentPopout, handleProcessCustomLecture, handleResetIslamicForm, handleSaveIslamicLecture, handleScrollTeleprompter, handleStartLecturePresentation, handleTransferLectureToQuiz, handleTransferLectureToWorksheet, isCurrentLectureSaved, isExportingPptx, isExtractingFile, isGeneratingIslamic, isRtl, islamicData, islamicInputMode, islamicQuizAnswers, islamicQuizScore, islamicQuizSubmitted, islamicSubView, islamicViewMode, islamicWorksheetAnswers, islamicWorksheetViewMode, lessonDuration, lessonTopic, rawLectureText, sanitizeArabicExtractedText, sanitizeIslamicDataObject, savedIslamicLectures, setActiveIslamicStage, setExtractedEvidences, setIslamicData, setIslamicInputMode, setIslamicQuizAnswers, setIslamicQuizSubmitted, setIslamicSubView, setIslamicViewMode, setIslamicWorksheetAnswers, setIslamicWorksheetViewMode, setLessonDuration, setLessonTopic, setRawLectureText, setShowEvidenceBankModal, setShowExtractedTextPreview, setShowMasterGuide, setStage3ActiveSlide, setStage3ViewMode, setStructuredPhasesText, setSubjectCategory, setTeacherScriptFontSize, setTeacherTeleprompterMode, showExtractedTextPreview, showMasterGuide, showToast, stage3ActiveSlide, stage3ViewMode, structuredPhasesText, subjectCategory, teacherScriptFontSize, teacherTeleprompterMode, teacherTeleprompterScrollRef, uploadedFileInfo }) {
      return (
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            islamicSubView === 'workbench'
                              ? 'bg-emerald-800 text-gold-200 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>✍️</span>
                          <span>{isRtl ? 'تحضير ورفع محاضرة' : 'Author & Upload'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIslamicSubView('library')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            islamicSubView === 'library'
                              ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
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
                            title={isRtl ? "البدء بدرس جديد على نظافة" : "Start with a new blank lecture"}
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'درس جديد' : 'New Clean'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={handleLoadDemoIslamic}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                            title={isRtl ? "استيراد نموذج استرشادي تجريبي للتوضيح" : "Load demo illustrative lesson"}
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
                              title={isRtl ? "تصدير ملف احتياطي لمكتبتك" : "Export backup file"}
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
                                  <span>🖼️ {(lec.data.zoomCards || lec.data.zoomPresentation || []).length} شرائح زوم</span>
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

                      {/* Sequential 6-Stage Stepper Navigation Bar */}
                      <div className="sticky top-2 z-20 bg-emerald-950/95 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-2xl border-2 border-gold-400 shadow-xl no-print">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs flex-1">
                            {[
                              { id: 'stage-islamic-1', num: 1, labelAr: '1. إدخال المحاضرة', labelEn: '1. Lecture Input', icon: '📁', active: true },
                              { id: 'stage-islamic-2', num: 2, labelAr: '2. الخطة والأدلة', labelEn: '2. Plan & Evidence', icon: '⏱️', active: !!islamicData },
                              { id: 'stage-islamic-3', num: 3, labelAr: '3. العرض وبوربوينت', labelEn: '3. Slides & PPTX', icon: '📽️', active: !!islamicData },
                              { id: 'stage-islamic-4', num: 4, labelAr: '4. ورقة العمل', labelEn: '4. Worksheet', icon: '📝', active: !!islamicData },
                              { id: 'stage-islamic-5', num: 5, labelAr: '5. الاختبار الذاتي', labelEn: '5. Self-Quiz', icon: '🎯', active: !!islamicData },
                              { id: 'stage-islamic-6', num: 6, labelAr: '6. الواتساب والمكتبة', labelEn: '6. WhatsApp & Library', icon: '💬', active: !!islamicData }
                            ].map(st => {
                              const isCurrent = activeIslamicStage === st.num;
                              return (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => handleJumpToStage(st.num)}
                                  className={'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ' + (
                                    isCurrent
                                      ? 'bg-gold-500 text-emerald-950 border-2 border-gold-300 font-black shadow-lg ring-2 ring-gold-300 scale-105'
                                      : (st.active 
                                          ? 'bg-emerald-900/90 hover:bg-emerald-800 text-gold-200 border border-gold-400/40' 
                                          : 'bg-emerald-950/50 text-slate-400 border border-emerald-900/40 opacity-70 cursor-not-allowed')
                                  )}
                                  title={isRtl ? `انتقل إلى المرحلة (${st.num})` : `Jump to Stage ${st.num}`}
                                >
                                  <span className={'w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ' + (isCurrent ? 'bg-emerald-950 text-gold-300' : 'bg-gold-400 text-emerald-950')}>
                                    {st.num}
                                  </span>
                                  <span>{st.icon}</span>
                                  <span>{isRtl ? st.labelAr : st.labelEn}</span>
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

                      {/* Master Practical Field Guide Banner */}
                      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-gold-400 shadow-md">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setShowMasterGuide(!showMasterGuide)}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl sm:text-2xl">💡</span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-gold-300 font-cairo">
                                {isRtl ? 'دليل المعلم التطبيقي: كيف تستثمر مراحل المحاضرة الست في إعداد وإلقاء درسك وحلقتك؟' : 'Teacher Guide: How to use the 6 lecture stages in your class'}
                              </h4>
                              <p className="text-[11px] text-emerald-200 mt-0.5">
                                {isRtl ? 'خارطة طريق واضحة ومباشرة تجيبك عن كيفية الاستفادة الحقيقية من كل أداة ومخرج في الميدان' : 'Practical field roadmap explaining the exact purpose and workflow of each stage'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-gold-300 hover:text-gold-100 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 border border-gold-400/40"
                          >
                            {showMasterGuide ? (isRtl ? 'إخفاء الدليل ▲' : 'Hide ▲') : (isRtl ? 'عرض الدليل ▼' : 'Show Guide ▼')}
                          </button>
                        </div>

                        {showMasterGuide && (
                          <div className="mt-4 pt-4 border-t border-gold-400/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs animate-fadeIn">
                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>📁 1.</span>
                                <span>{isRtl ? 'إدخال ورفع المحاضرة' : '1. Input Lecture'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'ارفع ملف الدرس كـ Word أو PDF مباشرة دون الحاجة لنسخ ولصق؛ ليتولى المحرك تفكيك المحاضرة واستخراج المحاور والآيات بدقة.' : 'Upload Word or PDF files directly without tedious copy-pasting.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>⏱️ 2.</span>
                                <span>{isRtl ? 'الخطة والأدلة الشرعية' : '2. Blueprint & Evidence'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'تساعدك في ضبط توقيت الدرس بدقة (تمهيد 10د، تأصيل 25د، قصة وواقع 15د، خاتمة 10د) مع استحضار فوري للأحاديث المعتمدة والتأصيل.' : 'Time management and verified hadiths.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>📽️ 3.</span>
                                <span>{isRtl ? 'العرض الحي وبوربوينت' : '3. Live Deck & PPTX'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'اعرض الشرائح مباشرة ملء الشاشة على البروجكتور أو زوم مع نقاط التحدث والتوجيهات، أو حمّل ملف بوربوينت PPTX للعرض أوفلاين.' : 'Live presenter mode on Zoom/projector + PPTX export.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>📝 4.</span>
                                <span>{isRtl ? 'ورقة العمل والطباعة' : '4. Printable Worksheet'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'اطبع [نسخة الدارس] الفارغة ليحلها الطلاب في الحلقة ويكتبوا التطبيق السلوكي، واستعن بـ [نسخة المعلم] كدليل إجابة وتأصيل شرعي.' : 'Print student and teacher answer keys.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>🎯 5.</span>
                                <span>{isRtl ? 'الاختبار الذاتي الفوري' : '5. Interactive Quiz'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'فعّل وضع الطالب في ختام الدرس لتقييم استيعاب الدارسين فورياً والحصول على نسبة الإتقان مع تغذية راجعة وتصحيح فوري.' : 'Interactive end-of-class quiz.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>💬 6.</span>
                                <span>{isRtl ? 'الواتساب ومكتبتي الدائمة' : '6. WhatsApp & Library'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'انسخ ملخص التكليف المنزلي بنقرة زر وشاركه في جروب الواتساب مع أولياء الأمور أو الطلاب، واحفظ المحاضرة كاملة بمكتبتك.' : 'One-click WhatsApp homework broadcast and permanent library.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* --- STAGE 1: INPUT & UPLOAD SECTION --- */}
                      {(islamicViewMode === 'all' || activeIslamicStage === 1) && (
                      <div id="stage-islamic-1" className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-900/15 shadow-sm space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 1 من 6
                            </span>
                            <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base font-cairo">
                              {isRtl ? 'إدخال ورفع ملف المحاضرة (Word .docx / PDF / نص / لصق)' : 'Step 1: Input or Upload Lecture File'}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                            {isRtl ? 'اختر طريقة الإدخال الأنسب لك:' : 'Choose Input Mode:'}
                          </span>
                        </div>
                      
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
                              accept=".docx,.doc,.pdf,.pptx,.ppt,.txt,.md"
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
                                        ? `الحجم: ${uploadedFileInfo.sizeKb} كيلوبايت • عدد الكلمات: ${uploadedFileInfo.wordCount} كلمة • الأسطر: ${uploadedFileInfo.lineCount} سطراً`
                                        : `Size: ${uploadedFileInfo.sizeKb} KB • Words: ${uploadedFileInfo.wordCount} • Lines: ${uploadedFileInfo.lineCount}`}
                                    </div>
                                  </div>
                                </div>

                                {/* Primary Transformation Trigger */}
                                <button
                                  type="button"
                                  onClick={() => handleProcessCustomLecture()}
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

                              {/* Extracted Content Quality & Tools Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100/80 p-3 rounded-2xl border border-gold-400/60 text-xs shadow-xs">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-amber-950 flex items-center gap-1.5 font-cairo">
                                    <span>🛠️</span>
                                    <span>{isRtl ? 'أدوات معالجة واستخلاص الملف:' : 'File Processing Tools:'}</span>
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cleaned = sanitizeArabicExtractedText(rawLectureText);
                                      setRawLectureText(cleaned);
                                      const evs = extractEvidencesAndProofs(cleaned);
                                      setExtractedEvidences(evs);
                                      showToast(isRtl ? 'تم تنقية ومعالجة النص العربي واستخلاص الأدلة بنجاح ✨' : 'Sanitized text and extracted evidences ✨');
                                    }}
                                    className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'إزالة الشوائب الطباعية، والتشكيل الزائد، ووصل الحروف المتقطعة' : 'Clean OCR & typography'}
                                  >
                                    <span>🧹</span>
                                    <span>{isRtl ? 'تنقية ومعالجة النص' : 'Sanitize Text'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!rawLectureText) return;
                                      const bracketPairs = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '«': '»', '»': '«', '﴿': '﴾', '﴾': '﴿' };
                                      const inverted = rawLectureText.split(/\r?\n/).map(line => {
                                        return line.split('').reverse().join('').replace(/[()«»\[\]{}<>﴿﴾]/g, m => bracketPairs[m] || m);
                                      }).join('\n');
                                      setRawLectureText(inverted);
                                      showToast(isRtl ? 'تم عكس اتجاه النص والحروف المقلوبة 🔄' : 'Inverted text direction 🔄');
                                    }}
                                    className="bg-slate-800 hover:bg-slate-900 text-gold-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'عكس اتجاه الحروف إذا ظهر النص مقلوباً من اليسار لليمين' : 'Invert character direction'}
                                  >
                                    <span>🔄</span>
                                    <span>{isRtl ? 'عكس النص المقلوب' : 'Invert Reversed'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!rawLectureText) return;
                                      const fixed = sanitizeArabicExtractedText(rawLectureText);
                                      setRawLectureText(fixed);
                                      showToast(isRtl ? 'تم فك تشابك الكلمات وضبط المسافات ✂️' : 'Disentangled words ✂️');
                                    }}
                                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'فك الكلمات المتلاصقة وتصحيح العبارات' : 'Fix glued words'}
                                  >
                                    <span>✂️</span>
                                    <span>{isRtl ? 'فك تشابك الكلمات' : 'Disentangle Words'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setShowEvidenceBankModal(true)}
                                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'عرض الآيات القرآنية والأحاديث والأقوال العلمية المستخلصة من الملف' : 'Inspect extracted Quran & Hadith proofs'}
                                  >
                                    <span>📜</span>
                                    <span>{isRtl ? `بنك الأدلة والبراهين (${(extractedEvidences.quranicVerses || []).length + (extractedEvidences.hadiths || []).length + (extractedEvidences.scholarlyProofs || []).length})` : 'Evidence Bank'}</span>
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setShowExtractedTextPreview(!showExtractedTextPreview)}
                                  className="bg-white hover:bg-slate-50 text-amber-950 border border-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                                >
                                  <span>👁️</span>
                                  <span>{isRtl ? (showExtractedTextPreview ? 'إخفاء محرر النص' : 'معاينة وتعديل النص المستخلص') : 'Preview & Edit Text'}</span>
                                </button>
                              </div>

                              {/* Expandable Extracted Text Area */}
                              {showExtractedTextPreview && (
                                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-300 shadow-inner space-y-2 animate-fadeIn">
                                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold border-b border-slate-100 pb-1.5">
                                    <span className="flex items-center gap-1 text-emerald-950 font-black">
                                      <span>📝</span>
                                      <span>{isRtl ? 'محرر وتدقيق النص المستخلص (يمكنك التعديل أو الحذف أو الإضافة المباشرة):' : 'Extracted Text Editor:'}</span>
                                    </span>
                                    <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                      {rawLectureText.length} {isRtl ? 'حرفاً' : 'chars'} • {rawLectureText.trim().split(/\s+/).filter(Boolean).length} {isRtl ? 'كلمة' : 'words'}
                                    </span>
                                  </div>
                                  <textarea
                                    rows={8}
                                    value={rawLectureText}
                                    onChange={(e) => {
                                      setRawLectureText(e.target.value);
                                      const evs = extractEvidencesAndProofs(e.target.value);
                                      setExtractedEvidences(evs);
                                    }}
                                    className="w-full text-xs sm:text-sm font-amiri p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed text-slate-900 scrollbar-thin"
                                    placeholder={isRtl ? 'النص المستخلص من الملف...' : 'Extracted text...'}
                                  />
                                </div>
                              )}

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
                          {rawLectureText && rawLectureText.trim().length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100/80 p-3 rounded-2xl border border-gold-400/60 text-xs shadow-xs animate-fadeIn">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-amber-950 flex items-center gap-1.5 font-cairo">
                                  <span>🛠️</span>
                                  <span>{isRtl ? 'أدوات معالجة واستخلاص النص الملصوق:' : 'Pasted Text Tools:'}</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const cleaned = sanitizeArabicExtractedText(rawLectureText);
                                    setRawLectureText(cleaned);
                                    const evs = extractEvidencesAndProofs(cleaned);
                                    setExtractedEvidences(evs);
                                    showToast(isRtl ? 'تم تنقية ومعالجة النص العربي واستخلاص الأدلة بنجاح ✨' : 'Sanitized text and extracted evidences ✨');
                                  }}
                                  className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                  title={isRtl ? 'إزالة الشوائب الطباعية، والتشكيل الزائد، ووصل الحروف المتقطعة' : 'Clean typography'}
                                >
                                  <span>🧹</span>
                                  <span>{isRtl ? 'تنقية ومعالجة النص العربي' : 'Sanitize Text'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setShowEvidenceBankModal(true)}
                                  className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                  title={isRtl ? 'عرض الآيات القرآنية والأحاديث والأقوال العلمية المستخلصة من النص' : 'Inspect extracted Quran & Hadith proofs'}
                                >
                                  <span>📜</span>
                                  <span>{isRtl ? `بنك الأدلة والبراهين (${(extractedEvidences.quranicVerses || []).length + (extractedEvidences.hadiths || []).length + (extractedEvidences.scholarlyProofs || []).length})` : 'Evidence Bank'}</span>
                                </button>
                              </div>

                              <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                                {rawLectureText.length} {isRtl ? 'حرفاً' : 'chars'} • {rawLectureText.trim().split(/\s+/).filter(Boolean).length} {isRtl ? 'كلمة' : 'words'}
                              </span>
                            </div>
                          )}
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
                                onClick={() => handleProcessCustomLecture()}
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
                              onClick={() => handleProcessCustomLecture()}
                              className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2 rounded-xl text-xs shadow-md transition"
                            >
                              {isRtl ? '⚡ توليد الأدوات التدريسية' : 'Generate Assets'}
                            </button>
                          </div>
                        </div>
                      )}

                      </div>
                    )}

                      {/* --- UPCOMING STAGES ROADMAP GUIDE (WHEN NO ACTIVE LECTURE) --- */}
                      {!islamicData && (
                        <div id="stages-roadmap-preview" className="card-islamic-pearl rounded-3xl p-5 sm:p-7 border-2 border-dashed border-emerald-800/30 shadow-md space-y-5 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/10 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🗺️</span>
                                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? 'خريطة مراحل إعداد المحاضرة (المراحل 2 إلى 6):' : 'Upcoming Lecture Stages (2 through 6):'}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl 
                                  ? 'بمجرد رفع ملفك أو لصق النص بالخطوة 1 أعلاه؛ ستتولد المراحل الخمس التالية تلقائياً بالترتيب في هذه الشاشة دون أي تنقل:' 
                                  : 'Once you upload your file above, the following 5 stages generate automatically in this single view:'}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleLoadDemoIslamic}
                              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
                            >
                              <span>💡</span>
                              <span>{isRtl ? 'معاينة نموذج تجريبي بكافة المراحل' : 'Load Demo with All 6 Stages'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {[
                              { num: 2, title: isRtl ? '2. الخطة والأدلة' : '2. Plan & Hadith', desc: isRtl ? 'المخطط الزمني بالدقائق وتوثيق أحاديث الصحيحين' : 'Minute blueprint & Sahih Hadiths', icon: '⏱️' },
                              { num: 3, title: isRtl ? '3. العرض وبوربوينت' : '3. PPTX Slides', desc: isRtl ? 'عرض مباشر لزوم وتنزيل ملف بوربوينت PPTX' : 'Zoom Presenter & PPTX Download', icon: '📽️' },
                              { num: 4, title: isRtl ? '4. ورقة العمل والطباعة' : '4. Worksheet Table', desc: isRtl ? 'جدول المدارسة للدارسين مع الطباعة الفورية' : 'Study worksheet & instant print', icon: '📝' },
                              { num: 5, title: isRtl ? '5. الاختبار الذاتي التفاعلي' : '5. Interactive Quiz', desc: isRtl ? 'أسئلة الاختيار من متعدد وتصحيح فوري' : 'Multiple choice quiz & live scoring', icon: '🎯' },
                              { num: 6, title: isRtl ? '6. الواتساب والمكتبة' : '6. WhatsApp & Library', desc: isRtl ? 'ملخص رسائل الواتساب وحفظ دائم بمكتبتك' : 'WhatsApp summary & library save', icon: '💬' }
                            ].map(stg => (
                              <button
                                key={stg.num}
                                type="button"
                                onClick={() => handleJumpToStage(stg.num)}
                                className="bg-white/90 hover:bg-emerald-50/90 rounded-2xl p-4 border-2 border-emerald-900/10 hover:border-gold-500 shadow-xs hover:shadow-md transition flex flex-col justify-between text-right cursor-pointer group"
                                title={isRtl ? `انقر للانتقال الفوري إلى (${stg.title})` : `Click to jump to Stage ${stg.num}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-900 group-hover:bg-gold-500 text-gold-200 group-hover:text-emerald-950 text-xs font-black flex items-center justify-center shadow-xs transition">
                                      {stg.num}
                                    </span>
                                    <span className="text-xl group-hover:scale-110 transition">{stg.icon}</span>
                                  </div>
                                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-cairo mb-1 group-hover:text-emerald-800">
                                    {stg.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    {stg.desc}
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                                  <span>⚡ {isRtl ? 'انتقال فوري للمرحلة' : 'Jump Now'}</span>
                                  <span className="text-gold-600 group-hover:translate-x-[-3px] transition font-black">⬅️</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* ================= ACTIVE LECTURE SEQUENTIAL 6-STAGE ARTIFACTS VIEW ================= */}
                {islamicData && (
                  <div className="space-y-6">

                    {/* Top Action Bar for Generated Lesson */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-900/15 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🕌</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                              {islamicData.metadata.topic}
                            </h3>
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              مكتمل 6 مراحل ✓
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-bold">
                            {islamicData.metadata.category} • {islamicData.metadata.durationMinutes} دقيقة • {islamicData.metadata.audience}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveIslamicLecture}
                          className={'px-3.5 py-2 rounded-xl text-xs font-black shadow-sm border transition flex items-center gap-1.5 cursor-pointer ' + (
                            isCurrentLectureSaved
                              ? 'bg-emerald-800 text-gold-300 border-gold-400 ring-2 ring-gold-400/50'
                              : 'bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-gold-400'
                          )}
                        >
                          <span>💾</span>
                          <span>{isCurrentLectureSaved ? (isRtl ? '✓ محفوظة بمكتبتك' : 'Saved in Library') : (isRtl ? 'حفظ بمكتبتي' : 'Save to Library')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIslamicStage(4);
                            setTimeout(() => {
                              const el = document.getElementById('stage-islamic-4');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <span>📝</span>
                          <span>{isRtl ? 'الانتقال لورقة العمل' : 'Jump to Worksheet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIslamicStage(5);
                            setTimeout(() => {
                              const el = document.getElementById('stage-islamic-5');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'الانتقال للاختبار' : 'Jump to Quiz'}</span>
                        </button>
                      </div>
                    </div>

                    {/* ================= STAGE 2: TIME-BOXED BLUEPRINT & HADITH VERIFICATION ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 2) && (
                    <div id="stage-islamic-2" className="space-y-6">
                      
                      {/* Quick Active Lecture Sanitize & Force Clean Button */}
                      <div className="flex justify-end gap-2 no-print">
                        <button
                          type="button"
                          onClick={() => {
                            if (islamicData) {
                              const cleaned = sanitizeIslamicDataObject(islamicData);
                              setIslamicData(cleaned);
                              try { localStorage.setItem('mishkah_active_islamic_data', JSON.stringify(cleaned)); } catch(e) {}
                              showToast(isRtl ? 'تمت إعادة تدقيق وتطهير كافة نصوص المحاضرة الحالية بنجاح 🌿' : 'Lecture re-sanitized');
                            }
                          }}
                          className="bg-emerald-950/80 hover:bg-emerald-900 text-gold-300 border border-gold-400/40 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs"
                          title={isRtl ? 'تطهير نصوص المحاضرة الحالية فوراً من أي أخطاء طباعية قديمة' : 'Re-sanitize current lecture'}
                        >
                          <span>🧹</span>
                          <span>{isRtl ? 'إعادة تدقيق وتطهير نصوص الدرس فوراً' : 'Re-sanitize Texts'}</span>
                        </button>
                      </div>

                      {/* 2.1 Time-Boxed Lesson Blueprint */}
                      <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 sm:mb-6 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                المرحلة 2 من 6
                              </span>
                              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                {isRtl ? 'المخطط الزمني المنضبط بالدقائق' : 'Minute-by-Minute Time-Boxed Blueprint'}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-emerald-950 font-amiri mt-1">
                              {islamicData.metadata.topic} — ({islamicData.metadata.durationMinutes || islamicData.metadata.duration || lessonDuration || 45} {isRtl ? 'دقيقة' : 'Minutes'})
                            </h3>
                          </div>
                          <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full">
                            {islamicData.metadata.category}
                          </span>
                        </div>

                        {/* Dedicated Opening Du'aa & Supplication Banner if present in lecture */}
                        {islamicData.openingPreamble && (
                          <div className="card-islamic-amber rounded-2xl p-4 sm:p-5 border-2 border-amber-500/40 shadow-sm space-y-2 mb-4 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
                              <span className="flex items-center gap-2 font-black text-amber-950 text-xs sm:text-sm font-cairo">
                                <span className="text-base sm:text-lg">🤲</span>
                                <span>{isRtl ? 'افتتاحية المجلس والدعاء المأثور (مقدمة المحاضرة والاستفتاح):' : 'Opening Supplication & Lecture Preamble:'}</span>
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                {isRtl ? 'دعاء واستفتاح المجلس' : 'Opening Du\'aa'}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-amiri text-slate-800 leading-relaxed font-semibold">
                              {sanitizeArabicExtractedText(islamicData.openingPreamble.duaExcerpt || (islamicData.openingPreamble.lines && islamicData.openingPreamble.lines.join(' ')))}
                            </p>
                          </div>
                        )}

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
                                  {isRtl ? (sanitizeArabicExtractedText(phase.phaseNameAr) || phase.phaseNameAr).replace(/(?:(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)|(?:أَقَامُوا|اوُماَقَأ)\s+(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?|الصَّ?\s*لا\s*ةَ?|الصلاة)|(?:الصَّ?\s*لا\s*ةَ?|الصلاة)\s*(?:أَقَامُوا|اوُماَقَأ))/gu, 'أَقَامُوا الصَّلَاةَ') : phase.phaseNameEn}
                                </h4>
                                <p className="text-xs text-slate-600 font-amiri leading-relaxed mb-3">
                                  {isRtl ? sanitizeArabicExtractedText(phase.teacherFocusAr || phase.teacherGuidanceAr) : (phase.teacherFocusEn || phase.teacherGuidanceEn)}
                                </p>
                              </div>
                              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-emerald-900 font-bold">
                                🎯 {isRtl ? sanitizeArabicExtractedText(
                                  (phase.keyTakeawayAr || phase.practicalImpact || '')
                                    .replace(/\b(?:آال|اال|إال)\b/g, 'الصلاة والتوحيد')
                                    .replace(/(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ)?/gu, 'إِقَامَةُ الصَّلَاةِ')
                                    .replace(/2ب\./g, '')
                                ) : (phase.keyTakeawayEn || phase.practicalImpact)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2.2 Islamic Evidences & Scientific Proofs Bank */}
                      <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-gold-400 text-emerald-950 font-bold flex items-center justify-center text-lg shadow-xs">
                              📜
                            </span>
                            <div>
                              <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                {isRtl ? 'بنك الأدلة الشرعية والبراهين العلمية المستخلصة من المحاضرة:' : 'Extracted Evidences & Scholarly Proofs Bank:'}
                              </h3>
                              <p className="text-[11px] text-slate-600 font-medium">
                                {isRtl ? 'آيات قرآنية وأحاديث نبوية وأقوال أئمة الهدى وبراهين علمية مستخلصة بدقة وموثقة' : 'Authentic Quranic Verses, Hadiths & Proofs extracted from lecture'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowEvidenceBankModal(true)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 text-xs px-3.5 py-2 rounded-xl font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>🔍</span>
                            <span>{isRtl ? 'عرض كافة الأدلة في نافذة منفصلة' : 'View Full Evidence Bank'}</span>
                          </button>
                        </div>

                        {/* Top Extracted Evidence Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Top Quranic Verse */}
                          {extractedEvidences.quranicVerses && extractedEvidences.quranicVerses.length > 0 && (
                            <div className="bg-emerald-950 text-gold-200 p-4 rounded-2xl border-2 border-gold-400/50 shadow-md space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-gold-400/30">
                                  <span className="font-black text-gold-300 flex items-center gap-1">
                                    <span>📖</span>
                                    <span>{isRtl ? 'آية قرآنية مستخلصة' : 'Extracted Ayah'}</span>
                                  </span>
                                  <span className="bg-emerald-900 px-2 py-0.5 rounded-full text-[10px] text-gold-200 border border-gold-400/30">
                                    {extractedEvidences.quranicVerses[0].citation}
                                  </span>
                                </div>
                                <p className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed pt-2 text-center">
                                  {extractedEvidences.quranicVerses[0].arabicText}
                                </p>
                              </div>
                              <div className="text-[10px] text-gold-300/80 text-right pt-2 border-t border-gold-400/20">
                                ✓ {extractedEvidences.quranicVerses[0].grading}
                              </div>
                            </div>
                          )}

                          {/* Top Prophetic Hadith */}
                          {extractedEvidences.hadiths && extractedEvidences.hadiths.length > 0 && (
                            <div className="card-islamic-amber p-4 rounded-2xl border-2 border-gold-400 shadow-md space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-amber-900/15">
                                  <span className="font-black text-amber-950 flex items-center gap-1 font-cairo">
                                    <span>✨</span>
                                    <span>{isRtl ? 'حديث نبوي شريف' : 'Prophetic Hadith'}</span>
                                  </span>
                                  <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    {extractedEvidences.hadiths[0].source}
                                  </span>
                                </div>
                                <p className="font-amiri text-sm sm:text-base text-slate-800 font-bold leading-relaxed pt-2 text-right">
                                  {extractedEvidences.hadiths[0].arabicText}
                                </p>
                              </div>
                              <div className="text-[10px] text-amber-900 font-bold text-right pt-2 border-t border-amber-900/10 flex items-center justify-between">
                                <span>الراوي: {extractedEvidences.hadiths[0].narrator}</span>
                                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                                  {extractedEvidences.hadiths[0].grading}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Top Scholarly / Scientific Proof */}
                          {extractedEvidences.scholarlyProofs && extractedEvidences.scholarlyProofs.length > 0 && (
                            <div className="card-islamic-sky p-4 rounded-2xl border-2 border-sky-300 shadow-md space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-sky-900/15">
                                  <span className="font-black text-sky-950 flex items-center gap-1 font-cairo">
                                    <span>🎓</span>
                                    <span>{isRtl ? 'قول تأصيلي / برهان علمي' : 'Scholarly Proof'}</span>
                                  </span>
                                  <span className="bg-sky-200/80 text-sky-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    {extractedEvidences.scholarlyProofs[0].author}
                                  </span>
                                </div>
                                <p className="font-amiri text-xs sm:text-sm text-slate-800 font-bold leading-relaxed pt-2 text-right">
                                  « {extractedEvidences.scholarlyProofs[0].quote} »
                                </p>
                              </div>
                              <div className="text-[10px] text-sky-900 font-bold text-right pt-2 border-t border-sky-900/10">
                                السياق: {extractedEvidences.scholarlyProofs[0].context}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2.3 Authenticated Hadith Verification (Strict Sahih Bukhari & Muslim) */}
                      <div className="card-islamic-amber rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gold-400/40 shadow-md">
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
                          {(islamicData.hadithVerification || islamicData.evidences || []).map((hd, idx) => (
                            <div key={idx} className="bg-white/90 rounded-2xl p-4 border border-gold-300 shadow-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className="bg-emerald-900 text-gold-200 text-xs px-3 py-1 rounded-full font-bold">
                                  {hd.source || hd.citation || 'صحيح البخاري'}
                                </span>
                                <span className="text-xs font-bold text-slate-600">
                                  {isRtl ? 'الراوي / الشاهد:' : 'Narrator:'} {hd.narrator || 'الصحابي الجليل'}
                                </span>
                              </div>
                              <p className="font-amiri text-sm sm:text-base text-emerald-950 font-medium leading-relaxed my-2">
                                {formatScriptureDisplay(hd.text || hd.arabicText)}
                              </p>
                              <div className="text-xs text-slate-600 font-amiri pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span><strong>{isRtl ? 'التخريج والحكم:' : 'Grade:'}</strong> {hd.ruling || hd.grading || 'صحيح معتمد'}</span>
                                <span className="text-emerald-800 font-bold">✓ صحيح معتمد</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Navigation to Stage 3 */}
                        <div className="flex justify-end pt-3 mt-3 border-t border-gold-400/30">
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById('stage-islamic-3');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{isRtl ? 'الانتقال للمرحلة التالية: 3. منظومة العروض وبوربوينت' : 'Next: 3. Presentation & PowerPoint'}</span>
                            <span>◀</span>
                          </button>
                        </div>
                      </div>

                      {/* Stage 2 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(1)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (1) رفع وإدخال المحاضرة' : 'Prev: Stage 1 Input'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(3)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (3) العرض وبوربوينت PPTX' : 'Next: Stage 3 Presentation'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 3: INTERACTIVE LECTURE PRESENTATION & POWERPOINT SUITE ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 3) && (
                    <div id="stage-islamic-3" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 3 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                              <span>📽️</span>
                              <span>{isRtl ? 'منظومة العروض التقديمية وشرائح الشرح الحية' : 'Live Presentation & PowerPoint Suite'}</span>
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'مشغل شرائح تفاعلي حي + عرض ملء الشاشة لزوم + تصدير بوربوينت (.pptx)' : 'Interactive Live Slide Deck & PowerPoint (.pptx) Export'}
                          </h3>
                        </div>

                        {/* Top Action & Mode Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View Switch: Dual Zoom Studio vs Grid */}
                          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
                            <button
                              type="button"
                              onClick={() => setStage3ViewMode('player')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                stage3ViewMode === 'player'
                                  ? 'bg-emerald-900 text-gold-200 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-emerald-900'
                              )}
                            >
                              <span>🎙️</span>
                              <span>{isRtl ? 'كابينة زوم المزدوجة' : 'Zoom Studio'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setStage3ViewMode('grid')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                stage3ViewMode === 'grid'
                                  ? 'bg-emerald-900 text-gold-200 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-emerald-900'
                              )}
                            >
                              <span>🔲</span>
                              <span>{isRtl ? 'كافة الشرائح' : 'Grid'}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSlideStudioOpen(true)}
                            className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 border-2 border-gold-400 font-black px-4 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
                            title="عرض جديد بقوالب مزخرفة، تعدّلينه شريحةً شريحة"
                          >
                            <span>🎞️</span>
                            <span>استوديو الشرائح الجديد</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleOpenStudentPopout}
                            className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-gold-300 ring-2 ring-gold-400/30"
                            title={isRtl ? 'فتح نافذة مستقلة لشريحة الطلاب لمشاركتها مباشرة في زوم دون مشاركة الملاحظات' : 'Open Pop-out Student Window for Zoom'}
                          >
                            <span>🪟</span>
                            <span>{isRtl ? 'نافذة عرض مستقلة للطلاب' : 'Pop-out Student Window'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartLecturePresentation(stage3ActiveSlide)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <span>📺</span>
                            <span>{isRtl ? 'ملء الشاشة لزوم' : 'Zoom Fullscreen'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleExportIslamicPowerPoint}
                            disabled={isExportingPptx}
                            className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer border-2 border-gold-300 ring-2 ring-gold-400/40"
                            title={isRtl ? 'تنزيل ملف بوربوينت (.pptx) كامل التنسيق والشرائح للعرض أوفلاين' : 'Download PowerPoint (.pptx)'}
                          >
                            <span className="text-base">📥</span>
                            <span>{isExportingPptx ? (isRtl ? 'جاري تجهيز البوربوينت...' : 'Exporting...') : (isRtl ? 'تنزيل كملف بوربوينت (.pptx)' : 'Download PowerPoint (.pptx)')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Practical Guide Banner for Stage 3 */}
                      <div className="bg-amber-50/80 border border-gold-400/60 rounded-2xl p-3 sm:p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="text-xl shrink-0 mt-0.5">🎙️</span>
                          <div className="space-y-0.5">
                            <span className="font-black text-amber-900 block font-cairo">
                              {isRtl ? 'كابينة المعلم لحلقة زوم الأونلاين (شاشة مزدوجة متزامنة):' : 'Zoom Educator Dual-Pane Studio:'}
                            </span>
                            <p className="text-[11px] text-slate-700 leading-relaxed">
                              {isRtl 
                                ? 'الشاشة مقسمة لجزئين: الجانب الأيمن شريحة مرئية للدارس على زوم تركز بصره، والجانب الأيسر هو كابينة وتفريغ المحاضرة الخاص بك لتشرح وتفيض منه بطلاقة دون أن يراه الطلاب.'
                                : 'Dual synchronized panes: Right pane is the student visual anchor for Zoom, left pane is your private substantive lecture script.'}
                            </p>
                          </div>
                        </div>
                        <span className="bg-emerald-900 text-gold-200 px-2.5 py-1 rounded-xl text-[11px] font-black shrink-0">
                          {((islamicData.zoomCards || islamicData.zoomPresentation || []).length || 1)} {isRtl ? 'محاور جاهزة' : 'modules ready'}
                        </span>
                      </div>

                      {/* Slides List Computation */}
                      {(() => {
                        const slidesList = (islamicData.zoomCards && islamicData.zoomCards.length > 0)
                          ? islamicData.zoomCards
                          : (islamicData.blueprint || []);
                        const safeIdx = Math.max(0, Math.min(slidesList.length - 1, stage3ActiveSlide));
                        const currentSlide = slidesList[safeIdx] || slidesList[0] || {};
                        const currentSlideTitle = currentSlide.slideTitle || currentSlide.titleAr || currentSlide.phaseTitle || currentSlide.phaseNameAr || (`المحور ${safeIdx + 1}`);
                        const scriptureText = typeof distillSlideScripture === "function" ? distillSlideScripture(currentSlide.scriptureEvidence || currentSlide.scripture) : normalizeIslamicSacredTerms(currentSlide.scriptureEvidence || currentSlide.scripture);
                        const bodyText = currentSlide.talkingPoints || currentSlide.bodyAr || currentSlide.teacherFocusAr;
                        const pedagogicalTip = currentSlide.pedagogicalTip || currentSlide.practicalAction || 'التركيز على ربط المعنى بالسلوك العملي للدارس';
                        const teleprompterText = currentSlide.fullSectionText || currentSlide.lectureNotes || currentSlide.bodyAr || currentSlide.teacherGuidanceAr || bodyText;

                        if (stage3ViewMode === 'player') {
                          return (
                            <div className="space-y-4">
                              {/* DUAL SPLIT-SCREEN COCKPIT FOR ZOOM (Right: Student Slide, Left: Teacher Script) */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                                
                                {/* RIGHT PANE (7/12 cols): Zoom Student Presentation Slide */}
                                <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gold-400 shadow-xl relative overflow-y-auto min-h-[420px] max-h-[620px] h-full flex-1">
                                  
                                  {/* Slide Top Header */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-400/30 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-gold-500 text-emerald-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                                        {isRtl ? `شريحة ${safeIdx + 1} من ${slidesList.length}` : `Slide ${safeIdx + 1} of ${slidesList.length}`}
                                      </span>
                                      <span className="bg-emerald-900/80 text-gold-300 border border-gold-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-xl">
                                        {currentSlide.phaseTitle || (isRtl ? 'المحور المعروض للدارس في زوم' : 'Zoom Student View')}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleCondenseSlide(safeIdx)}
                                        className="bg-amber-600 hover:bg-amber-500 text-white border border-amber-300 text-[11px] font-black px-2.5 py-1 rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                        title={isRtl ? 'تلخيص وتكثيف الشريحة بذكاء لتكون أكثر إيجازاً وتركيزاً لزوم' : 'Condense slide points'}
                                      >
                                        <span>⚡</span>
                                        <span>{isRtl ? 'تلخيص ذكي مكثف' : 'Smart Distill'}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={handleOpenStudentPopout}
                                        className="bg-gold-500 hover:bg-gold-400 text-emerald-950 border border-gold-300 text-[11px] font-black px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                        title={isRtl ? 'فتح شريحة العرض في نافذة مستقلة لمشاركتها في زوم' : 'Pop-out student slide for Zoom'}
                                      >
                                        <span>🪟</span>
                                        <span>{isRtl ? 'نافذة مستقلة للطلاب' : 'Pop-out Window'}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleStartLecturePresentation(safeIdx)}
                                        className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/50 text-[11px] font-black px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                        title="عرض الشريحة ملء الشاشة لمشاركتها عبر زوم"
                                      >
                                        <span>📺</span>
                                        <span>{isRtl ? 'ملء الشاشة' : 'Fullscreen'}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Slide Content Area (Visual Anchor for Student) */}
                                  <div className="space-y-4 my-auto">
                                    <h4 className="font-amiri text-xl sm:text-2xl lg:text-3xl font-extrabold text-gold-300 leading-snug">
                                      {currentSlideTitle}
                                    </h4>

                                    {scriptureText && (
                                      <div className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed bg-emerald-900/70 p-4 rounded-2xl border-2 border-gold-400/40 shadow-inner">
                                        {formatScriptureDisplay(scriptureText)}
                                      </div>
                                    )}

                                    {/* Visual Talking Points */}
                                    <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-gold-400/20">
                                      <span className="text-[11px] font-bold text-gold-400 block mb-1.5">
                                        📌 {isRtl ? 'عناصر المحور المعروضة للدارس:' : 'Key Slide Points:'}
                                      </span>
                                      <div className="space-y-1 text-xs text-slate-100 font-amiri leading-relaxed">
                                        {(currentSlide.bulletPoints || (currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText])).map((pt, pIdx) => (
                                          <div key={pIdx} className="flex items-start gap-2 bg-emerald-900/50 p-2 sm:p-2.5 rounded-xl border border-gold-400/30">
                                            <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                              {pIdx + 1}
                                            </span>
                                            <span className="font-semibold text-slate-100">{pt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Slide Navigation Controller */}
                                  <div className="mt-6 pt-4 border-t border-gold-400/30 flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      disabled={safeIdx <= 0}
                                      onClick={() => { const target = Math.max(0, safeIdx - 1); setStage3ActiveSlide(target); broadcastSlideSync(target); }}
                                      className="bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 font-black px-3.5 py-1.5 rounded-xl text-xs border border-gold-400/40 transition flex items-center gap-1 shadow-xs cursor-pointer"
                                    >
                                      <span>▶</span>
                                      <span>{isRtl ? 'المحور السابق' : 'Previous'}</span>
                                    </button>

                                    {/* Dots indicator */}
                                    <div className="flex items-center gap-1 overflow-x-auto max-w-[220px] scrollbar-none py-1">
                                      {slidesList.map((_, dotIdx) => (
                                        <button
                                          key={dotIdx}
                                          type="button"
                                          onClick={() => { setStage3ActiveSlide(dotIdx); broadcastSlideSync(dotIdx); }}
                                          className={'w-2 h-2 rounded-full transition-all ' + (
                                            dotIdx === safeIdx ? 'bg-gold-400 w-5 shadow-xs' : 'bg-emerald-800 hover:bg-emerald-700'
                                          )}
                                          title={`محور ${dotIdx + 1}`}
                                        />
                                      ))}
                                    </div>

                                    <button
                                      type="button"
                                      disabled={safeIdx >= slidesList.length - 1}
                                      onClick={() => { const target = Math.min(slidesList.length - 1, safeIdx + 1); setStage3ActiveSlide(target); broadcastSlideSync(target); }}
                                      className="bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-emerald-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1 shadow-xs cursor-pointer"
                                    >
                                      <span>{isRtl ? 'المحور التالي' : 'Next'}</span>
                                      <span>◀</span>
                                    </button>
                                  </div>
                                </div>

                                {/* LEFT PANE (5/12 cols): Teacher's Full Cockpit & Complete Lecture Teleprompter */}
                                <div className="lg:col-span-5 flex flex-col justify-between card-islamic-amber rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-gold-500/70 shadow-lg min-h-[460px] max-h-[660px] overflow-hidden">
                                  <div className="flex flex-col h-full min-h-0">
                                    {/* Header & Controls Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-900/15 shrink-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xl">🎙️</span>
                                        <div>
                                          <h4 className="text-xs sm:text-sm font-black text-amber-950 font-cairo">
                                            {isRtl ? 'كابينة وتفريغ المعلم في زوم:' : "Teacher's Zoom Teleprompter:"}
                                          </h4>
                                          <span className="text-[10px] text-amber-800 font-bold">
                                            {isRtl ? 'خاص بالمعلم للشرح والاستفاضة — لا يراه الطالب' : 'Private lecture teleprompter'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {/* Script Font Resizer */}
                                        <div className="bg-amber-200/80 rounded-xl p-0.5 flex items-center gap-1 text-[11px] font-bold text-amber-950 border border-amber-300">
                                          <span className="px-1 text-[10px] text-amber-800">{isRtl ? 'الخط:' : 'Font:'}</span>
                                          <button
                                            type="button"
                                            onClick={() => setTeacherScriptFontSize('small')}
                                            className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${teacherScriptFontSize === 'small' ? 'bg-emerald-950 text-gold-300 font-black' : 'hover:bg-amber-300'}`}
                                          >
                                            {isRtl ? 'صغير' : 'S'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setTeacherScriptFontSize('medium')}
                                            className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${teacherScriptFontSize === 'medium' ? 'bg-emerald-950 text-gold-300 font-black' : 'hover:bg-amber-300'}`}
                                          >
                                            {isRtl ? 'متوسط' : 'M'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setTeacherScriptFontSize('large')}
                                            className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${teacherScriptFontSize === 'large' ? 'bg-emerald-950 text-gold-300 font-black' : 'hover:bg-amber-300'}`}
                                          >
                                            {isRtl ? 'كبير' : 'L'}
                                          </button>
                                        </div>

                                        {/* Up & Down Scroll Controls (صعود وهبوط) */}
                                        <div className="bg-amber-200/80 rounded-xl p-0.5 flex items-center gap-1 text-[11px] font-bold text-amber-950 border border-amber-300">
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('up')}
                                            className="px-2 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer flex items-center gap-0.5"
                                            title={isRtl ? 'صعود للأعلى في المحاضرة' : 'Scroll Up'}
                                          >
                                            <span>🔼</span>
                                            <span className="text-[10px]">{isRtl ? 'صعود' : 'Up'}</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('down')}
                                            className="px-2 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer flex items-center gap-0.5"
                                            title={isRtl ? 'هبوط للأسفل في المحاضرة' : 'Scroll Down'}
                                          >
                                            <span>🔽</span>
                                            <span className="text-[10px]">{isRtl ? 'هبوط' : 'Down'}</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('top')}
                                            className="px-1.5 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer text-[10px]"
                                            title={isRtl ? 'أول المحاضرة' : 'Top'}
                                          >
                                            ⏫
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('bottom')}
                                            className="px-1.5 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer text-[10px]"
                                            title={isRtl ? 'آخر المحاضرة' : 'Bottom'}
                                          >
                                            ⏬
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Mode Selector Tabs (Full Continuous Lecture vs Current Section) */}
                                    <div className="flex items-center gap-1.5 p-1 bg-amber-200/70 rounded-xl border border-amber-300 mb-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setTeacherTeleprompterMode('full')}
                                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                                          teacherTeleprompterMode === 'full'
                                            ? 'bg-emerald-950 text-gold-300 shadow-sm'
                                            : 'text-amber-950 hover:bg-amber-300/60'
                                        }`}
                                      >
                                        <span>📚</span>
                                        <span>{isRtl ? 'نص المحاضرة الكامل الشامل' : 'Full Complete Lecture'}</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTeacherTeleprompterMode('section')}
                                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                                          teacherTeleprompterMode === 'section'
                                            ? 'bg-emerald-950 text-gold-300 shadow-sm'
                                            : 'text-amber-950 hover:bg-amber-300/60'
                                        }`}
                                      >
                                        <span>📄</span>
                                        <span>{isRtl ? 'تفريغ المحور الحالي المتزامن' : 'Current Section View'}</span>
                                      </button>
                                    </div>

                                    {/* Quick Element Jump Chips */}
                                    <div className="mb-2 shrink-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-amber-900 block">
                                          📑 {isRtl ? 'المحاور والعناصر المستخلصة (انقر للانتقال المتزامن):' : 'Key Structural Elements:'}
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-900">
                                          {isRtl ? `${slidesList.length} محاور` : `${slidesList.length} sections`}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                        {slidesList.map((sl, sIdx) => {
                                          const isActive = sIdx === safeIdx;
                                          return (
                                            <button
                                              key={sIdx}
                                              type="button"
                                              onClick={() => {
                                                setStage3ActiveSlide(sIdx);
                                                broadcastSlideSync(sIdx);
                                                if (teacherTeleprompterMode === 'full') {
                                                  setTimeout(() => {
                                                    const targetEl = document.getElementById('teleprompter-sec-' + sIdx);
                                                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                  }, 50);
                                                }
                                              }}
                                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                                                isActive
                                                  ? 'bg-emerald-950 text-gold-300 border border-gold-400 font-black shadow-xs ring-2 ring-gold-400/40'
                                                  : 'bg-white/90 hover:bg-amber-100 text-amber-950 border border-amber-300/80'
                                              }`}
                                            >
                                              <span>{sIdx + 1}.</span>
                                              <span>{sl.slideTitle || `محور ${sIdx + 1}`}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Scrollable Teleprompter Content */}
                                    <div
                                      ref={teacherTeleprompterScrollRef}
                                      className="space-y-3.5 flex-1 min-h-[280px] max-h-[380px] overflow-y-auto pr-1 text-right scroll-smooth scrollbar-thin"
                                    >
                                      {teacherTeleprompterMode === 'full' ? (
                                        /* ================= COMPLETE FULL LECTURE UNABRIDGED MODE ================= */
                                        <div className="space-y-3.5">
                                          {/* Opening Du'a / Preamble if available */}
                                          {islamicData.openingPreamble && (
                                            <div className="bg-emerald-900/10 border-2 border-emerald-600/40 p-3.5 rounded-2xl space-y-1.5 shadow-xs">
                                              <div className="flex items-center justify-between border-b border-emerald-700/20 pb-1">
                                                <span className="text-[11px] font-black text-emerald-950 font-cairo flex items-center gap-1">
                                                  <span>🌱</span>
                                                  <span>{isRtl ? 'افتتاحية المجلس والدعاء المأثور:' : 'Opening Du\'a & Preamble:'}</span>
                                                </span>
                                                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                                  {isRtl ? 'استفتاح المجلس' : 'Opening'}
                                                </span>
                                              </div>
                                              <p className={`font-amiri text-slate-800 leading-relaxed whitespace-pre-line text-justify ${
                                                teacherScriptFontSize === 'small' ? 'text-xs' : (teacherScriptFontSize === 'large' ? 'text-base font-bold' : 'text-sm')
                                              }`}>
                                                {normalizeIslamicSacredTerms(
                                                  (islamicData.openingPreamble.lines && islamicData.openingPreamble.lines.length > 0)
                                                    ? islamicData.openingPreamble.lines.join('\n')
                                                    : (islamicData.openingPreamble.duaExcerpt || '')
                                                )}
                                              </p>
                                            </div>
                                          )}

                                          {/* All Lecture Sections Streamed In Order */}
                                          {slidesList.map((sec, sIdx) => {
                                            const isCurrent = sIdx === safeIdx;
                                            const secContent = sec.fullSectionText || (sec.lines && sec.lines.join('\n\n')) || sec.talkingPoints || sec.bodyAr || '';
                                            return (
                                              <div
                                                key={sIdx}
                                                id={'teleprompter-sec-' + sIdx}
                                                className={`p-3.5 rounded-2xl border transition-all duration-300 space-y-2 shadow-xs ${
                                                  isCurrent
                                                    ? 'bg-amber-50 border-2 border-gold-500 ring-2 ring-gold-400/50 shadow-md'
                                                    : 'bg-white/95 border-amber-300/80 hover:border-gold-400'
                                                }`}
                                              >
                                                {/* Section Header */}
                                                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-amber-200 pb-1.5">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                                      isCurrent ? 'bg-gold-500 text-emerald-950' : 'bg-amber-200 text-amber-950'
                                                    }`}>
                                                      {sIdx + 1}
                                                    </span>
                                                    <h5 className="font-cairo text-xs sm:text-sm font-black text-amber-950">
                                                      {sec.slideTitle || sec.titleAr || `المحور ${sIdx + 1}`}
                                                    </h5>
                                                  </div>

                                                  <div className="flex items-center gap-1">
                                                    {isCurrent ? (
                                                      <span className="bg-emerald-950 text-gold-300 border border-gold-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        <span>{isRtl ? 'معروض للطلاب الآن' : 'Live on Zoom'}</span>
                                                      </span>
                                                    ) : (
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setStage3ActiveSlide(sIdx);
                                                          broadcastSlideSync(sIdx);
                                                        }}
                                                        className="bg-amber-100 hover:bg-gold-500 text-amber-950 hover:text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer"
                                                        title={isRtl ? 'عرض هذه الشريحة مباشرة للطلاب في زوم' : 'Display this slide'}
                                                      >
                                                        👁️ {isRtl ? 'اعرض للطلاب' : 'Display'}
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Quranic Scripture Box if present */}
                                                {sec.scriptureEvidence && (
                                                  <div className="bg-emerald-900/10 p-2 rounded-xl border border-gold-400/40 text-center">
                                                    <p className="font-quran text-xs sm:text-sm text-emerald-950 leading-relaxed">
                                                      {formatScriptureDisplay(sec.scriptureEvidence)}
                                                    </p>
                                                  </div>
                                                )}

                                                {/* Full Unabridged Text of this Section */}
                                                <p className={`font-amiri text-slate-800 leading-relaxed whitespace-pre-line text-justify ${
                                                  teacherScriptFontSize === 'small' ? 'text-xs' : (teacherScriptFontSize === 'large' ? 'text-base font-bold' : 'text-sm')
                                                }`}>
                                                  {sanitizeArabicExtractedText(secContent)}
                                                </p>

                                                {/* Talking Points & Impact summary */}
                                                {sec.talkingPoints && (
                                                  <div className="bg-amber-100/60 p-2 rounded-xl text-[11px] text-amber-950 font-amiri font-bold">
                                                    🎯 {sec.talkingPoints}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        /* ================= CURRENT SECTION FOCUSED VIEW ================= */
                                        <div className="space-y-3">
                                          {/* Box 1: Full Unabridged Lecture Text from Source File */}
                                          <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-300 shadow-xs space-y-1.5">
                                            <div className="flex items-center justify-between border-b border-amber-200/70 pb-1">
                                              <span className="text-[11px] font-black text-emerald-950 font-cairo flex items-center gap-1">
                                                <span>📜</span>
                                                <span>{isRtl ? 'التفريغ العلمي الكامل والشرح التفصيلي لهذا المحور:' : 'Substantive Source Lecture Text:'}</span>
                                              </span>
                                              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                                                {isRtl ? 'النص الأصلي من الملف' : 'Source Text'}
                                              </span>
                                            </div>
                                            <p className={`font-amiri text-slate-800 leading-relaxed whitespace-pre-line text-justify ${
                                              teacherScriptFontSize === 'small' ? 'text-xs' : (teacherScriptFontSize === 'large' ? 'text-base font-bold' : 'text-sm')
                                            }`}>
                                              {sanitizeArabicExtractedText(currentSlide.fullSectionText || teleprompterText)}
                                            </p>
                                          </div>

                                          {/* Box 2: Teacher Talking Points & Scholarly Pointers */}
                                          {currentSlide.talkingPoints && (
                                            <div className="bg-amber-100/70 p-3 rounded-2xl border border-gold-400/40 text-xs shadow-xs space-y-1">
                                              <span className="font-black text-amber-950 flex items-center gap-1 font-cairo">
                                                <span>🎯</span>
                                                <span>{isRtl ? 'نقاط الشرح والاستفاضة للداعية والمحاضر:' : 'Teacher Talking Points:'}</span>
                                              </span>
                                              <p className="text-[11px] text-amber-950 font-amiri font-bold leading-relaxed whitespace-pre-line">
                                                {normalizeIslamicSacredTerms(currentSlide.talkingPoints)}
                                              </p>
                                            </div>
                                          )}

                                          {/* Box 3: Live Classroom Discussion Prompts for Zoom */}
                                          {currentSlide.discussionPrompts && currentSlide.discussionPrompts.length > 0 && (
                                            <div className="bg-emerald-950 text-gold-200 p-3 rounded-2xl border border-gold-400/40 text-xs shadow-xs space-y-1.5">
                                              <div className="flex items-center gap-1.5 font-bold text-gold-300">
                                                <span>❓</span>
                                                <span>{isRtl ? 'أسئلة إثارة النقاش والتفاعل مع الطلاب على زوم:' : 'Live Zoom Discussion Questions:'}</span>
                                              </div>
                                              <ul className="space-y-1 text-[11px] text-slate-100 font-amiri leading-relaxed pr-3 list-disc">
                                                {currentSlide.discussionPrompts.map((dp, dpIdx) => (
                                                  <li key={dpIdx}>{normalizeIslamicSacredTerms(dp)}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                          {/* Box 4: Pedagogical Engagement Guidance */}
                                          {pedagogicalTip && (
                                            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300 text-xs shadow-xs space-y-1">
                                              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                                <span>💡</span>
                                                <span>{isRtl ? 'توجيه إدارة الحلقة والأثر السلوكي:' : 'Pedagogical Guidance:'}</span>
                                              </div>
                                              <p className="text-[11px] text-slate-700 leading-relaxed font-amiri">
                                                {normalizeIslamicSacredTerms(pedagogicalTip)}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Teleprompter Footer with Section Step Controls */}
                                  <div className="mt-2.5 pt-2 border-t border-amber-900/15 flex items-center justify-between text-[11px] text-amber-900 font-bold shrink-0">
                                    <div className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                                      <span>{isRtl ? 'متزامن لحظياً مع شاشة العرض' : 'Live Synced with Slide'}</span>
                                    </div>

                                    {/* Direct Step Controls from Preacher Cockpit */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        disabled={safeIdx === 0}
                                        onClick={() => {
                                          const prev = Math.max(0, safeIdx - 1);
                                          setStage3ActiveSlide(prev);
                                          broadcastSlideSync(prev);
                                          if (teacherTeleprompterMode === 'full') {
                                            setTimeout(() => {
                                              const el = document.getElementById('teleprompter-sec-' + prev);
                                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }, 50);
                                          }
                                        }}
                                        className="bg-white hover:bg-amber-100 disabled:opacity-40 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer text-[10px]"
                                        title={isRtl ? 'صعود للمحور السابق' : 'Previous Section'}
                                      >
                                        ◀ {isRtl ? 'السابق' : 'Prev'}
                                      </button>

                                      <span className="text-emerald-950 font-black">
                                        {isRtl ? `المحور ${safeIdx + 1} من ${slidesList.length}` : `${safeIdx + 1}/${slidesList.length}`}
                                      </span>

                                      <button
                                        type="button"
                                        disabled={safeIdx >= slidesList.length - 1}
                                        onClick={() => {
                                          const next = Math.min(slidesList.length - 1, safeIdx + 1);
                                          setStage3ActiveSlide(next);
                                          broadcastSlideSync(next);
                                          if (teacherTeleprompterMode === 'full') {
                                            setTimeout(() => {
                                              const el = document.getElementById('teleprompter-sec-' + next);
                                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }, 50);
                                          }
                                        }}
                                        className="bg-white hover:bg-amber-100 disabled:opacity-40 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer text-[10px]"
                                        title={isRtl ? 'هبوط للمحور التالي' : 'Next Section'}
                                      >
                                        {isRtl ? 'التالي' : 'Next'} ▶
                                      </button>
                                    </div>
                                  </div>
                                </div>

                              </div>

                              {/* Thumbnail Filmstrip Selector */}
                              <div className="pt-2">
                                <span className="text-xs font-bold text-emerald-950 block mb-2">
                                  🎞️ {isRtl ? 'شريط الشرائح السريع (انقر للانتقال الفوري):' : 'Slide Filmstrip (Click to jump):'}
                                </span>
                                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                                  {slidesList.map((th, thIdx) => (
                                    <button
                                      key={thIdx}
                                      type="button"
                                      onClick={() => setStage3ActiveSlide(thIdx)}
                                      className={'shrink-0 w-36 sm:w-44 text-right p-2.5 rounded-xl border-2 transition text-xs flex flex-col justify-between cursor-pointer ' + (
                                        thIdx === safeIdx
                                          ? 'bg-emerald-900 text-gold-200 border-gold-400 shadow-md ring-2 ring-gold-400/40 font-bold'
                                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-700/40 hover:bg-emerald-50/50'
                                      )}
                                    >
                                      <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                                        <span>#{thIdx + 1}</span>
                                        <span className="truncate max-w-[80px]">{th.phaseTitle || ''}</span>
                                      </div>
                                      <p className="line-clamp-2 text-[11px] font-amiri font-bold leading-tight">
                                        {th.slideTitle || th.titleAr || th.phaseTitle || (`شريحة ${thIdx + 1}`)}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Grid View Mode
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {slidesList.map((slide, sIdx) => (
                              <div key={sIdx} className="bg-emerald-950 text-white rounded-2xl p-5 border-2 border-gold-400 shadow-md flex flex-col justify-between hover:border-gold-300 transition">
                                <div>
                                  <div className="flex items-center justify-between mb-3 text-gold-300 text-xs font-bold">
                                    <span>{isRtl ? `الشريحة ${slide.slideNumber || sIdx + 1}` : `Slide ${sIdx + 1}`}</span>
                                    <span className="bg-emerald-900 px-2.5 py-0.5 rounded-full border border-gold-400/40 text-[10px]">
                                      {slide.phaseTitle}
                                    </span>
                                  </div>
                                  <h4 className="font-amiri text-lg font-bold text-gold-200 mb-2 leading-snug">
                                    {slide.slideTitle || slide.titleAr}
                                  </h4>
                                  {(slide.scriptureEvidence) && (
                                    <p className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed my-3 bg-emerald-900/60 p-3 rounded-xl border border-gold-400/30">
                                      {normalizeIslamicSacredTerms(slide.scriptureEvidence)}
                                    </p>
                                  )}
                                  <p className="font-amiri text-xs text-slate-200 leading-relaxed">
                                    {slide.talkingPoints || slide.bodyAr}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-emerald-800/80 text-[11px] text-gold-300 font-bold flex items-center justify-between gap-2">
                                  <span className="truncate">💡 {slide.pedagogicalTip || slide.practicalAction}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setStage3ActiveSlide(sIdx);
                                        setStage3ViewMode('player');
                                      }}
                                      className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-2 py-1 rounded-lg text-[10px] border border-gold-400/40 transition cursor-pointer"
                                    >
                                      <span>📽️</span>
                                      <span>{isRtl ? 'في المشغل' : 'Play'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStartLecturePresentation(sIdx)}
                                      className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-2.5 py-1 rounded-lg text-[10px] shadow-xs flex items-center gap-1 transition cursor-pointer"
                                    >
                                      <span>📺</span>
                                      <span>{isRtl ? 'ملء الشاشة' : 'Present'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Navigation to Stage 4 */}
                      <div className="flex justify-end pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('stage-islamic-4');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isRtl ? 'الانتقال للمرحلة التالية: 4. ورقة العمل والطباعة' : 'Next: 4. Worksheet & Print'}</span>
                          <span>◀</span>
                        </button>
                      </div>
                      {/* Stage 3 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(2)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (2) الخطة والأدلة' : 'Prev: Stage 2'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(4)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (4) ورقة العمل والطباعة' : 'Next: Stage 4 Worksheet'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 4: EMBEDDED MODEL WORKSHEET & PRINTABLE TABLE ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 4) && (
                    <div id="stage-islamic-4" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 4 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              {isRtl ? 'ورقة العمل النموذجية للدارسين والطباعة الفورية' : 'Model Worksheet & Printable Student Sheet'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'جدول المدارسة والتأصيل الشرعي المستخلص من المحاضرة' : 'Islamic Studies Analytical Worksheet Table'}
                          </h3>
                        </div>

                        {/* View Mode & Print Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
                            <button
                              type="button"
                              onClick={() => setIslamicWorksheetViewMode('student')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                islamicWorksheetViewMode === 'student'
                                  ? 'bg-emerald-900 text-gold-200 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-slate-900'
                              )}
                            >
                              <span>✍️</span>
                              <span>{isRtl ? 'نسخة الطالب (فارغة)' : 'Student Version'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIslamicWorksheetViewMode('teacher')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                islamicWorksheetViewMode === 'teacher'
                                  ? 'bg-gold-500 text-emerald-950 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-slate-900'
                              )}
                            >
                              <span>📖</span>
                              <span>{isRtl ? 'نموذج المعلم (مع الإجابات)' : 'Teacher Key'}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-2 border-gold-400 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95 cursor-pointer"
                            title={isRtl ? 'طباعة الورقة أو حفظها كملف PDF من خيارات الطابعة' : 'Print or Save as PDF'}
                          >
                            <span>🖨️</span>
                            <span>{isRtl ? 'طباعة ورقة العمل / حفظ كـ PDF' : 'Print Worksheet / Save PDF'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Worksheet Items Table */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-right border-collapse text-xs">
                          <thead>
                            <tr className="bg-emerald-950 text-gold-300 font-cairo text-xs border-b border-gold-400/40">
                              <th className="p-3 w-12 text-center font-bold">#</th>
                              <th className="p-3 w-1/4 font-bold">{isRtl ? 'المسألة الشرعية / محور الدرس' : 'Topic / Issue'}</th>
                              <th className="p-3 font-bold">
                                {islamicWorksheetViewMode === 'teacher' 
                                  ? (isRtl ? 'سؤال الاختيار من متعدد مع مفتاح الحل المعتمد (دليل المعلم)' : 'Multiple Choice Question & Answer Key')
                                  : (isRtl ? 'سؤال الاختيار من متعدد وخيارات الإجابة (اختر الإجابة الصحيحة)' : 'Multiple Choice Question & Options')}
                              </th>
                              <th className="p-3 w-1/4 font-bold">{isRtl ? 'الأثر السلوكي والتربوي المستهدف' : 'Behavioral & Spiritual Impact'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(islamicData.worksheetItems && islamicData.worksheetItems.length > 0 
                              ? islamicData.worksheetItems 
                              : (islamicData.blueprint || []).map((b, idx) => ({
                                  num: idx + 1,
                                  topic: b.phaseNameAr || ('المحور ' + (idx + 1)),
                                  studentQuestion: b.studentQuestion || ('في ضوء محور: ' + (b.phaseNameAr || 'هذا المحور') + '؛ ما الحكم الشرعي والأثر العملي؟'),
                                  teacherAnswer: b.teacherFocusAr || b.teacherGuidanceAr || 'التأصيل المنضبط من المحاضرة.',
                                  practicalImpact: b.practicalImpact || b.keyTakeawayAr || 'التطبيق السلوكي في واقع المسلم.'
                                }))
                            ).map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                                <td className="p-3 text-center font-bold text-slate-500">{row.num || rIdx + 1}</td>
                                <td className="p-3 font-bold text-emerald-950 font-cairo">
                                  {row.topic}
                                  {row.scripture && (
                                    <div className="font-quran text-[11px] text-emerald-800 font-normal mt-1 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                                      {row.scripture}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 text-slate-700 font-amiri leading-relaxed">
                                  <div className="space-y-2">
                                    <div className="font-bold text-emerald-950 font-cairo text-xs sm:text-[13px] flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-gold-200 text-[10px] font-black flex items-center justify-center shrink-0">
                                        {rIdx + 1}
                                      </span>
                                      <span>{row.questionPrompt || row.studentQuestion}</span>
                                    </div>

                                    {islamicWorksheetViewMode === 'teacher' ? (
                                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-2">
                                        <div className="text-xs space-y-1.5">
                                          {(() => {
                                            const distractorPool = [
                                              'الخلط بين المفاهيم العقلية وبين الأصول الشرعية الثابتة',
                                              'تقديم الآراء الظنية المجردة على النصوص القطعية',
                                              'حصر الحكم في نطاق تاريخي دون إدراك أثره الممتد في واقعنا',
                                              'الاعتماد على القياس مع الفارق وإغفال مقاصد الشريعة',
                                              'فصل الالتزام السلوكي عن اليقين الاعتقادي القلبي',
                                              'الانقياد للظنون والاتباع بغير دليل وبرهان صحيح'
                                            ];
                                            const optionsList = (row.options && row.options.length > 0) ? row.options : [
                                              { id: 'a', label: 'أ', textAr: row.teacherAnswer || 'القول المعتمد المستند إلى الأدلة الشرعية والمنهج الرشيد' },
                                              { id: 'b', label: 'ب', textAr: distractorPool[(rIdx * 2) % distractorPool.length] },
                                              { id: 'c', label: 'ج', textAr: distractorPool[(rIdx * 2 + 1) % distractorPool.length] }
                                            ];
                                            return optionsList.map(opt => {
                                            const isCorrect = opt.id === (row.correctOptionId || 'a');
                                            return (
                                              <div 
                                                key={opt.id} 
                                                className={'p-2 rounded-lg text-xs flex items-center gap-2 border ' + (
                                                  isCorrect 
                                                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold shadow-xs' 
                                                    : 'bg-white/80 border-slate-200 text-slate-600 opacity-70'
                                                )}
                                              >
                                                <span className={'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ' + (
                                                  isCorrect ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                                                )}>
                                                  {opt.label || opt.id.toUpperCase()}
                                                </span>
                                                <span className="flex-1">{opt.textAr || opt.text}</span>
                                                {isCorrect && <span className="text-emerald-800 text-[11px] font-black">✓ الإجابة المعتمدة</span>}
                                              </div>
                                            );
                                          });
                                        })()}
                                        </div>
                                        <div className="text-slate-800 text-xs pt-1.5 border-t border-amber-200/60">
                                          <strong className="text-amber-950">التأصيل والتعليل العلمي: </strong> {row.teacherRationale || row.teacherAnswer}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        {(() => {
                                          const distractorPool = [
                                            'الخلط بين المفاهيم العقلية وبين الأصول الشرعية الثابتة',
                                            'تقديم الآراء الظنية المجردة على النصوص القطعية',
                                            'حصر الحكم في نطاق تاريخي دون إدراك أثره الممتد في واقعنا',
                                            'الاعتماد على القياس مع الفارق وإغفال مقاصد الشريعة',
                                            'فصل الالتزام السلوكي عن اليقين الاعتقادي القلبي',
                                            'الانقياد للظنون والاتباع بغير دليل وبرهان صحيح'
                                          ];
                                          const optionsList = (row.options && row.options.length > 0) ? row.options : [
                                            { id: 'a', label: 'أ', textAr: row.teacherAnswer || 'القول المعتمد المستند إلى الأدلة الشرعية والمنهج الرشيد' },
                                            { id: 'b', label: 'ب', textAr: distractorPool[(rIdx * 2) % distractorPool.length] },
                                            { id: 'c', label: 'ج', textAr: distractorPool[(rIdx * 2 + 1) % distractorPool.length] }
                                          ];
                                          return optionsList.map(opt => {
                                          const isSelected = (islamicWorksheetAnswers[row.num || rIdx + 1] === opt.id);
                                          return (
                                            <div
                                              key={opt.id}
                                              onClick={() => setIslamicWorksheetAnswers(prev => ({ ...prev, [row.num || rIdx + 1]: opt.id }))}
                                              className={'p-2 sm:p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition select-none ' + (
                                                isSelected
                                                  ? 'bg-emerald-900 text-gold-200 border-gold-400 font-bold shadow-xs'
                                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                                              )}
                                            >
                                              <span className={'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ' + (
                                                isSelected ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                                              )}>
                                                {opt.label || opt.id.toUpperCase()}
                                              </span>
                                              <span className="flex-1 font-amiri text-xs sm:text-[13px] leading-snug">{opt.textAr || opt.text}</span>
                                              <span className="no-print">
                                                {isSelected ? '✓' : '○'}
                                              </span>
                                              <span className="hidden print:inline-block font-mono text-sm ml-1">[ ]</span>
                                            </div>
                                          );
                                        });
                                      })()}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-slate-600 font-amiri leading-relaxed">
                                  <span className="text-emerald-900 font-bold">🎯 </span>
                                  {row.practicalImpact}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Stage Navigation Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-bold">
                          {isRtl ? 'جاهزة للطباعة والتوزيع على الدارسين' : 'Ready for printing and distribution'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('stage-islamic-5');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isRtl ? 'الانتقال للمرحلة التالية: 5. الاختبار الذاتي التفاعلي' : 'Next: 5. Interactive Quiz'}</span>
                          <span>◀</span>
                        </button>
                      </div>
                      {/* Stage 4 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(3)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (3) العرض وبوربوينت' : 'Prev: Stage 3'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(5)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (5) الاختبار الذاتي والتقييم' : 'Next: Stage 5 Quiz'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 5: INTERACTIVE QUIZ & SELF-GRADING BANK ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 5) && (
                    <div id="stage-islamic-5" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 5 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              {isRtl ? 'بنك الاختبار والتقييم الذاتي التفاعلي للدارسين' : 'Interactive Self-Grading Quiz'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'أسئلة تفاعلية فورية لقياس استيعاب مفاهيم المحاضرة' : 'Comprehension & Reflection Questions'}
                          </h3>
                        </div>

                        {/* Actions: Print Quiz + Score Banner */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border border-gold-400/50 text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title={isRtl ? 'طباعة نموذج الاختبار للطلاب أو حفظه كـ PDF' : 'Print Quiz Sheet'}
                          >
                            <span>🖨️</span>
                            <span>{isRtl ? 'طباعة نموذج الاختبار' : 'Print Quiz'}</span>
                          </button>

                          {islamicQuizSubmitted && (
                            <div className="bg-emerald-900 text-gold-200 px-4 py-2 rounded-xl border border-gold-400 font-black text-xs sm:text-sm shadow-md flex items-center gap-2">
                              <span>🏆</span>
                              <span>{isRtl ? `النتيجة: ${islamicQuizScore}%` : `Score: ${islamicQuizScore}%`}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quiz Question Cards */}
                      <div className="space-y-4">
                        {(islamicData.quizQuestions || []).map((q, qIdx) => {
                          const selected = islamicQuizAnswers[q.id];
                          const correct = q.correctOptionId || 'a';
                          const isCorrect = selected === correct;
                          return (
                            <div 
                              key={q.id || qIdx} 
                              className={'p-4 sm:p-5 rounded-2xl border transition ' + (
                                islamicQuizSubmitted
                                  ? isCorrect
                                    ? 'bg-emerald-50/80 border-emerald-300'
                                    : 'bg-rose-50/60 border-rose-300'
                                  : 'bg-white border-slate-200 hover:border-gold-400'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-cairo leading-relaxed flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                                    {qIdx + 1}
                                  </span>
                                  <span>{q.questionAr || q.qAr}</span>
                                </h4>
                                {islamicQuizSubmitted && (
                                  <span className={'text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 ' + (
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                  )}>
                                    {isCorrect ? (isRtl ? '✓ إجابة صحيحة' : 'Correct') : (isRtl ? '✗ غير صحيحة' : 'Incorrect')}
                                  </span>
                                )}
                              </div>

                              {/* Options */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                {(q.options || q.opts || []).map((opt) => {
                                  const optId = opt.id;
                                  const optText = opt.textAr || opt.text || opt.textEn;
                                  const isSelected = selected === optId;
                                  let optClasses = 'border text-xs rounded-xl p-2.5 flex items-center gap-2 text-right transition cursor-pointer ';
                                  if (islamicQuizSubmitted) {
                                    if (optId === correct) {
                                      optClasses += 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold';
                                    } else if (isSelected) {
                                      optClasses += 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                                    } else {
                                      optClasses += 'bg-white border-slate-200 text-slate-500 opacity-60';
                                    }
                                  } else {
                                    if (isSelected) {
                                      optClasses += 'bg-emerald-900 text-gold-200 border-gold-400 font-bold shadow-xs';
                                    } else {
                                      optClasses += 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800';
                                    }
                                  }

                                  return (
                                    <button
                                      key={optId}
                                      type="button"
                                      disabled={islamicQuizSubmitted}
                                      onClick={() => setIslamicQuizAnswers(prev => ({ ...prev, [q.id]: optId }))}
                                      className={optClasses}
                                    >
                                      <span className={'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ' + (
                                        isSelected ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                                      )}>
                                        {optId.toUpperCase()}
                                      </span>
                                      <span className="flex-1 font-amiri leading-snug">{optText}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation & Reflection when submitted */}
                              {islamicQuizSubmitted && (q.explanationAr || q.reflectionPrompt || q.exp) && (
                                <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-amiri text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-100">
                                  <strong className="text-emerald-900">{isRtl ? 'التوجيه العلمي والتأمل:' : 'Pedagogical Reflection:'}</strong> {q.explanationAr || q.reflectionPrompt || q.exp}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quiz Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIslamicQuizSubmitted(true)}
                            disabled={islamicQuizSubmitted || Object.keys(islamicQuizAnswers).length === 0}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                          >
                            <span>🎯</span>
                            <span>{isRtl ? 'تصحيح الإجابات وحساب النتيجة' : 'Check Answers & Grade'}</span>
                          </button>

                          {islamicQuizSubmitted && (
                            <button
                              type="button"
                              onClick={() => {
                                setIslamicQuizAnswers({});
                                setIslamicQuizSubmitted(false);
                              }}
                              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>🔄</span>
                              <span>{isRtl ? 'إعادة المحاولة' : 'Retry Quiz'}</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('stage-islamic-6');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isRtl ? 'الانتقال للمرحلة التالية: 6. النشر عبر الواتساب وحفظ المحاضرة' : 'Next: 6. WhatsApp & Library'}</span>
                          <span>◀</span>
                        </button>
                      </div>
                      {/* Stage 5 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(4)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (4) ورقة العمل والطباعة' : 'Prev: Stage 4'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(6)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (6) الواتساب ومكتبتي' : 'Next: Stage 6 Library'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 6: WHATSAPP BROADCAST KIT & SAVE TO LIBRARY ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 6) && (
                    <div id="stage-islamic-6" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 6 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              {isRtl ? 'النشر عبر الواتساب وحفظ المحاضرة في مكتبتي' : 'WhatsApp Broadcast & Save to Library'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'رسالة ملخصة وجذابة في 10 أسطر منسقة بالإيموجي لمجموعات الدارسين' : '10-Line Formatted Summary with Emojis'}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyWhatsApp}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>📋</span>
                            <span>{isRtl ? 'نسخ الرسالة بنقرة واحدة' : 'Copy Message'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveIslamicLecture}
                            className={'px-4 py-2 rounded-xl text-xs font-black transition shadow-md border flex items-center gap-1.5 cursor-pointer ' + (
                              isCurrentLectureSaved
                                ? 'bg-emerald-800 text-gold-300 border-gold-400 ring-2 ring-gold-400/50'
                                : 'bg-gold-500 hover:bg-gold-400 text-emerald-950 border-gold-400'
                            )}
                          >
                            <span>💾</span>
                            <span>{isCurrentLectureSaved ? (isRtl ? '✓ تم الحفظ بمكتبتك بنجاح' : 'Saved in Library') : (isRtl ? 'حفظ المحاضرة بمكتبتي' : 'Save to Library')}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-900 text-emerald-200 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
                        {islamicData?.whatsAppKit?.formattedText || (
                          `السلام عليكم ورحمة الله وبركاته يا أحبة 🌸\n\n📌 *موضوع حلقتنا اليوم:* ${islamicData?.metadata?.topic || 'مدارسة شرعية'}\n\n✨ *أهم الفوائد والمعالم المستفادة:*\n` +
                          (islamicData?.blueprint || []).slice(0, 4).map((b, i) => `${i + 1}️⃣ *${b.phaseNameAr}:* ${b.keyTakeawayAr || b.teacherGuidanceAr || ''}`).join('\n') +
                          `\n\n🎯 *الواجب والتطبيق السلوكي:* ${islamicData?.blueprint?.[0]?.practicalImpact || 'تطبيق ما تعلمناه في حياتنا اليومية.'}\n\n🔗 رابط الاختبار الذاتي في منصة مشكاة. حفظكم الله جميعاً! 🤍`
                        )}
                      </div>

                      {/* Success completion banner */}
                      <div className="card-islamic-sage rounded-2xl p-4 border border-emerald-300 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🎉</span>
                          <div>
                            <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-cairo">
                              {isRtl ? 'اكتملت كافة مراحل إعداد المحاضرة بنجاح!' : 'Lecture Preparation Complete!'}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-emerald-900/80 mt-0.5">
                              {isRtl 
                                ? 'يمكنك الآن شرحها عبر زوم أو عرض الشرائح، توزيع أوراق العمل، إجراء الاختبار، ومشاركة الملخص مع دارسيك.'
                                : 'You are all set to present, print worksheets, run the quiz, and broadcast the summary.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleJumpToStage(5)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border border-gold-400/60 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer ring-2 ring-gold-400/30"
                            title={isRtl ? 'الرجوع للمرحلة السابقة: (5) الاختبار الذاتي والتقييم' : 'Go back to Stage 5: Quiz'}
                          >
                            <span>➡️</span>
                            <span>{isRtl ? 'السابق: (5) الاختبار الذاتي' : 'Prev: Stage 5 Quiz'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIslamicSubView('library')}
                            className="bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>📚</span>
                            <span>{isRtl ? 'الانتقال إلى مكتبتي' : 'Go to Library'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleResetIslamicForm}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'تحضير درس جديد' : 'New Lesson'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Universal Quick Stage Jump Bar in Stage 6 */}
                      <div className="card-islamic-pearl rounded-2xl p-4 border border-emerald-800/15 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                          <span>🧭</span>
                          <span>{isRtl ? 'مراجعة أي مرحلة سابقة من مراحل الدرس:' : 'Review Any Prior Stage:'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { num: 1, label: isRtl ? '1. إدخال المحاضرة' : '1. Input', icon: '📁' },
                            { num: 2, label: isRtl ? '2. الخطة والأدلة' : '2. Plan', icon: '⏱️' },
                            { num: 3, label: isRtl ? '3. العرض وبوربوينت' : '3. Slides', icon: '📽️' },
                            { num: 4, label: isRtl ? '4. ورقة العمل' : '4. Worksheet', icon: '📝' },
                            { num: 5, label: isRtl ? '5. الاختبار الذاتي' : '5. Quiz', icon: '🎯' },
                            { num: 6, label: isRtl ? '6. الواتساب والمكتبة' : '6. Library', icon: '💬' }
                          ].map(st => (
                            <button
                              key={st.num}
                              type="button"
                              onClick={() => handleJumpToStage(st.num)}
                              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ' + (
                                activeIslamicStage === st.num
                                  ? 'bg-gold-500 text-emerald-950 font-black shadow-xs ring-2 ring-gold-400'
                                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200'
                              )}
                            >
                              <span>{st.icon}</span>
                              <span>{st.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    )}

                  </div>
                )}

              </div>
      );
    }
