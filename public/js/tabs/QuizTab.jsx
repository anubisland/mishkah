    // QuizTab: the "quiz" screen, moved out of App unchanged.
    // Every App value it reads arrives as a prop of the same name.
    function QuizTab({ activeQuizQuestions, editingQuizQuestionId, handleClearQuizQuestions, handleDeleteQuizQuestion, handleResetQuizQuestions, handleSaveQuizQuestion, handleSwitchQuizBranch, handleTransferLectureToQuiz, isAddingQuizQuestion, isRtl, islamicData, quizAnswers, quizBranch, quizIslamicCategory, quizMode, quizQuestionForm, quizScore, quizSubmitted, setEditingQuizQuestionId, setIsAddingQuizQuestion, setQuizAnswers, setQuizMode, setQuizQuestionForm, setQuizSubmitted }) {
      return (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md">
                  
                  {/* Quiz Branch Switcher & Header */}
                  <div className="pb-4 mb-6 border-b border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          {isRtl ? 'منظومة المراجعة الذاتية التفاعلية وبنك أسئلة المعلم' : 'Interactive Self-Grading Quiz & Teacher Question Bank'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold font-cairo text-emerald-950 mt-0.5">
                          {isRtl ? 'اختبر معلوماتكِ التفاعلية في علوم الشريعة والقرآن' : 'Test Your Knowledge Across All Disciplines'}
                        </h2>
                      </div>

                      {/* Mode Toggle & Score */}
                      <div className="flex items-center gap-2">
                        {quizSubmitted && quizMode === 'student' && (
                          <div className="bg-emerald-900 text-gold-300 px-4 py-2 rounded-2xl border border-gold-400 font-bold text-sm shadow">
                            {isRtl ? `النتيجة النهائية: ${quizScore}%` : `Score: ${quizScore}%`}
                          </div>
                        )}

                        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              setQuizMode('student');
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              quizMode === 'student'
                                ? 'bg-emerald-800 text-gold-200 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            🎯 {isRtl ? 'وضع اختبار الدارس' : 'Student Mode'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuizMode('builder')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              quizMode === 'builder'
                                ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            ✍️ {isRtl ? 'محرر وبنك الأسئلة' : 'Teacher Question Bank'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Branch Selector Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSwitchQuizBranch('islamic', 'aqeedah')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          quizBranch === 'islamic'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕌</span>
                        <span>{isRtl ? 'اختبار العلوم الشرعية (Branch 3)' : 'Islamic Studies Quiz'}</span>
                      </button>

                      <button
                        onClick={() => handleSwitchQuizBranch('tajweed')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          quizBranch === 'tajweed'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'اختبار أحكام التجويد (Branch 2)' : 'Tajweed Quiz'}</span>
                      </button>

                      <button
                        onClick={() => handleSwitchQuizBranch('hifz')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          quizBranch === 'hifz'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
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
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                              quizIslamicCategory === cat.id
                                ? 'bg-gold-400 text-emerald-950 font-extrabold shadow'
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

                  {/* ================= QUIZ MODE: BUILDER / QUESTION BANK ================= */}
                  {quizMode === 'builder' && (
                    <div className="space-y-6">
                      
                      {/* Guidance Banner */}
                      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-emerald-950 text-sm font-cairo">
                            🛠️ {isRtl ? 'أداة المعلم: تحرير وإدارة بنك أسئلة الاختبار' : 'Teacher Workbench: Manage Quiz Question Bank'}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {isRtl 
                              ? 'أضف أسئلتك الخاصة، حدد الخيارات الأربعة والإجابة الصحيحة، واكتب التوجيه والشرح الشرعي لترسيخ الفهم لدى الدارس.'
                              : 'Add custom questions with 4 options, specify correct answer, and provide authentic guidance for students.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {quizBranch === 'islamic' && islamicData && islamicData.quizQuestions && (
                            <button
                              type="button"
                              onClick={handleTransferLectureToQuiz}
                              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                            >
                              <span>⚡</span>
                              <span>{isRtl ? 'استيراد أسئلة المحاضرة النشطة' : 'Import from Active Lecture'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingQuizQuestionId(null);
                              setQuizQuestionForm({ questionAr: '', optA: '', optB: '', optC: '', optD: '', correctOptionId: 'a', explanationAr: '' });
                              setIsAddingQuizQuestion(true);
                            }}
                            className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'إضافة سؤال جديد' : 'Add Question'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClearQuizQuestions}
                            className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          >
                            🧹 {isRtl ? 'مسح الأسئلة' : 'Clear All'}
                          </button>
                          <button
                            type="button"
                            onClick={handleResetQuizQuestions}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          >
                            🔄 {isRtl ? 'استعادة النموذج المعتمد' : 'Restore Canonical'}
                          </button>
                        </div>
                      </div>

                      {/* Add / Edit Question Form */}
                      {isAddingQuizQuestion && (
                        <form onSubmit={handleSaveQuizQuestion} className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                          <div className="flex items-center justify-between border-b border-gold-400/40 pb-2">
                            <h4 className="font-black text-emerald-950 text-sm font-cairo">
                              {editingQuizQuestionId ? (isRtl ? '✏️ تعديل السؤال' : 'Edit Question') : (isRtl ? '➕ إضافة سؤال جديد لبنك الاختبار' : 'Add New Question')}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingQuizQuestion(false);
                                setEditingQuizQuestionId(null);
                              }}
                              className="text-slate-500 hover:text-slate-700 font-bold text-xs"
                            >
                              ✕ {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-950 mb-1">
                              {isRtl ? 'نص السؤال:' : 'Question Text:'}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={isRtl ? 'مثال: ما حكم النون الساكنة إذا جاء بعدها حرف القاف؟' : 'Enter question...'}
                              value={quizQuestionForm.questionAr}
                              onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, questionAr: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (أ):' : 'Option A:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'a'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'a' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                required
                                value={quizQuestionForm.optA}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optA: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (ب):' : 'Option B:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'b'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'b' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                required
                                value={quizQuestionForm.optB}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optB: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (ج):' : 'Option C:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'c'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'c' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                value={quizQuestionForm.optC}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optC: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (د):' : 'Option D:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'd'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'd' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                value={quizQuestionForm.optD}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optD: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-950 mb-1">
                              {isRtl ? 'التوجيه والشرح والتأصيل الشرعي (يظهر للدارس بعد الإجابة):' : 'Explanation & Authentic Reflection (shown after answer):'}
                            </label>
                            <textarea
                              rows={2}
                              placeholder={isRtl ? 'اكتب الشرح المعتمد لتوضيح وجه الصواب...' : 'Enter explanation...'}
                              value={quizQuestionForm.explanationAr}
                              onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, explanationAr: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingQuizQuestion(false);
                                setEditingQuizQuestionId(null);
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
                              <span>{isRtl ? 'حفظ السؤال في بنك الاختبار' : 'Save Question'}</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Question Bank Cards */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-emerald-950 font-cairo">
                            📋 {isRtl ? `الأسئلة الحالية في هذا البنك (${activeQuizQuestions.length} أسئلة):` : `Current Questions (${activeQuizQuestions.length}):`}
                          </span>
                        </div>

                        {activeQuizQuestions.length === 0 ? (
                          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
                            {isRtl ? 'بنك الأسئلة فارغ حالياً. اضغط "إضافة سؤال جديد" للبدء.' : 'No questions in this bank.'}
                          </div>
                        ) : (
                          activeQuizQuestions.map((q, idx) => (
                            <div key={q.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <h4 className="font-bold text-emerald-950 text-sm font-cairo leading-snug">
                                    {isRtl ? q.questionAr : q.questionEn}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingQuizQuestionId(q.id);
                                      const opts = q.options || [];
                                      setQuizQuestionForm({
                                        questionAr: q.questionAr || '',
                                        optA: opts[0]?.textAr || opts[0]?.text || '',
                                        optB: opts[1]?.textAr || opts[1]?.text || '',
                                        optC: opts[2]?.textAr || opts[2]?.text || '',
                                        optD: opts[3]?.textAr || opts[3]?.text || '',
                                        correctOptionId: q.correctOptionId || 'a',
                                        explanationAr: q.explanationAr || ''
                                      });
                                      setIsAddingQuizQuestion(true);
                                    }}
                                    className="bg-slate-100 hover:bg-gold-100 text-slate-700 hover:text-emerald-950 p-2 rounded-lg text-xs font-bold transition"
                                  >
                                    ✏️ {isRtl ? 'تعديل' : 'Edit'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuizQuestion(q.id)}
                                    className="bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {(q.options || []).map(opt => {
                                  const isCorrect = opt.id === q.correctOptionId;
                                  return (
                                    <div
                                      key={opt.id}
                                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                                        isCorrect
                                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                          : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span>{isRtl ? opt.textAr : opt.textEn}</span>
                                      {isCorrect && (
                                        <span className="text-emerald-700 font-extrabold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                                          ✓ {isRtl ? 'الإجابة الصحيحة' : 'Correct'}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {q.explanationAr && (
                                <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 font-amiri leading-relaxed">
                                  <strong>{isRtl ? 'التوجيه والشرح:' : 'Explanation:'}</strong> {q.explanationAr}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                  {/* ================= QUIZ MODE: STUDENT INTERACTIVE TEST ================= */}
                  {quizMode === 'student' && (
                    <div className="space-y-6">
                      
                      {activeQuizQuestions.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200">
                          {isRtl ? 'لا توجد أسئلة حالياً في هذا القسم. اضغط "محرر وبنك الأسئلة" لإضافة أسئلتك الخاصة أو استيرادها.' : 'No questions yet. Click Teacher Question Bank to add questions.'}
                        </div>
                      ) : (
                        activeQuizQuestions.map((q, qIndex) => {
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
                                      className={`p-3 rounded-xl border text-right text-xs transition flex items-center justify-between ${btnClass}`}
                                    >
                                      <span>{isRtl ? opt.textAr : opt.textEn}</span>
                                      {quizSubmitted && opt.id === q.correctOptionId && <span>✓</span>}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanations shown after submit */}
                              {quizSubmitted && (
                                <div className={`mt-3 p-3.5 rounded-xl text-xs font-amiri leading-relaxed ${
                                  isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                                }`}>
                                  <strong>{isCorrect ? '✓ إجابة صحيحة بارك الله فيكِ:' : '✗ توضيح الإجابة الصحيحة والتأصيل الشرعي:'}</strong> {isRtl ? q.explanationAr : q.explanationEn}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}

                      {/* Submit / Reset Actions */}
                      {activeQuizQuestions.length > 0 && (
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
                      )}

                    </div>
                  )}

                </div>
              </div>
      );
    }
