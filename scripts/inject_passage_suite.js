const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Inject Passage Test Buttons inside the Testing Controls ribbon
const ribbonEndMarker = `{/* Reset custom masks button if any active */}`;
if (html.includes(ribbonEndMarker) && !html.includes('handleActivatePassageTest')) {
  console.log('Error: handlers not found');
}

if (!html.includes('اختبار المقاطع القرآنية بالصفحة')) {
  const passageToolbar = `
                      {/* Passage-Based Testing Ribbon (Start, Middle, End) */}
                      <div className="mt-4 pt-3.5 border-t border-amber-900/15">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                            <span className="text-base">📑</span>
                            <span>{isRtl ? 'اختبار المقاطع القرآنية بالصفحة (حجب مقطع وتسميعه مع تحكيم المعلم):' : 'Passage-Based Recitation Tests:'}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            {isRtl ? 'يتم حجب المقطع، فإن أتقنه تنقر [✅ قالها صح] ليظهر، وإن أخطأ تنقر [⚠️ قالها غلط] ليعيده' : 'Hide passage, verify, and reveal'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {/* 1. Start Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('start')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'start'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🟢</span>
                            <span>{isRtl ? 'مقطع بداية الصفحة' : 'Start Passage'}</span>
                          </button>

                          {/* 2. Middle Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('middle')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'middle'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🟡</span>
                            <span>{isRtl ? 'مقطع وسط الصفحة' : 'Middle Passage'}</span>
                          </button>

                          {/* 3. End Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('end')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'end'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🔴</span>
                            <span>{isRtl ? 'مقطع ختام الصفحة' : 'End Passage'}</span>
                          </button>

                          {/* Reset / Status */}
                          {passageTestSection !== 'none' ? (
                            <button
                              type="button"
                              onClick={() => handlePassageVerdict('reset')}
                              className="p-2.5 rounded-xl font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 transition flex items-center justify-center gap-1"
                            >
                              <span>✕</span>
                              <span>{isRtl ? 'إلغاء اختبار المقاطع' : 'Cancel Test'}</span>
                            </button>
                          ) : (
                            <div className="text-[11px] text-slate-500 flex items-center justify-center text-center p-1 font-medium bg-amber-50/50 rounded-xl border border-dashed border-amber-300">
                              {isRtl ? '💡 اختر مقطعاً لبدء التسميع' : 'Select a passage to test'}
                            </div>
                          )}
                        </div>
                      </div>
`;
  html = html.replace(ribbonEndMarker, passageToolbar + '\n' + ribbonEndMarker);
  console.log('Injected passage toolbar into controls ribbon');
}

// 2. Inject Active Passage Arbitration Panel inside the Quranic Ayahs Board
const boardStartMarker = `{/* Repetition Loop Counter */}`;
if (html.includes(boardStartMarker) && !html.includes('منصة تحكيم وتسميع المقطع النشط للمعلم')) {
  // Let's insert before boardStartMarker
  const arbitrationPanel = `
                      {/* Active Passage Arbitration Panel */}
                      {passageTestSection !== 'none' && (
                        <div className="w-full mb-6 p-4 sm:p-5 rounded-2xl border-2 shadow-md bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border-gold-400/80 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-900/15">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl sm:text-3xl">🎙️</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-cairo font-black text-sm sm:text-base text-emerald-950">
                                    {isRtl ? 'مقطع التسميع النشط: ' : 'Active Passage: '}
                                    {passageTestSection === 'start' && (isRtl ? 'بداية الصفحة' : 'Start of Page')}
                                    {passageTestSection === 'middle' && (isRtl ? 'وسط الصفحة' : 'Middle of Page')}
                                    {passageTestSection === 'end' && (isRtl ? 'ختام الصفحة' : 'End of Page')}
                                  </span>
                                  <span className="bg-emerald-900 text-gold-300 text-xs font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    {isRtl ? 'الآيات (' + Array.from(passageMaskedAyahs).join(', ') + ')' : 'Ayahs (' + Array.from(passageMaskedAyahs).join(', ') + ')'}
                                  </span>
                                </div>
                                
                                {/* Dynamic Status Text */}
                                <div className="text-xs mt-1 font-bold">
                                  {passageStatus === 'reciting' && (
                                    <span className="text-amber-800 animate-pulse flex items-center gap-1">
                                      <span>🎧</span>
                                      <span>{isRtl ? 'الشيخ يستمع لتسميع الطالب... اضغط [قالها صح] لإظهارها أو [قالها غلط] لإعادتها' : 'Listening to student...'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'correct' && (
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <span>✨</span>
                                      <span>{isRtl ? 'ما شاء الله! قراءة صحيحة ومتقنة — تم إظهار المقطع بنجاح' : 'Mastered! Revealed'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'error_retry' && (
                                    <span className="text-rose-800 flex items-center gap-1">
                                      <span>⚠️</span>
                                      <span>{isRtl ? 'وقع خطأ أثناء التسميع (المحاولة ' + passageRetryCount + ') — على الطالب إعادة المقطع مرة أخرى لتثبيته!' : 'Mistake! Student must retry'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'revealed_for_review' && (
                                    <span className="text-blue-800 flex items-center gap-1">
                                      <span>📖</span>
                                      <span>{isRtl ? 'تم إظهار المقطع لتصحيح الخطأ والمراجعة في المصحف' : 'Revealed for review'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div className="flex items-center gap-1.5 text-xs">
                              {passageStatus === 'reciting' && (
                                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-bold shadow-xs">
                                  🔒 {isRtl ? 'محجوب للتسميع' : 'Masked'}
                                </span>
                              )}
                              {passageStatus === 'correct' && (
                                <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black shadow-xs flex items-center gap-1">
                                  ✅ {isRtl ? 'متقن ومُظهر' : 'Mastered'}
                                </span>
                              )}
                              {passageStatus === 'error_retry' && (
                                <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-900 font-black shadow-xs flex items-center gap-1 animate-bounce">
                                  ⚠️ {isRtl ? 'مطلوب الإعادة' : 'Retry'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Teacher Live Verdict Buttons (Exact User Feature) */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* 1. Said Correctly Button */}
                              <button
                                type="button"
                                onClick={() => handlePassageVerdict('correct')}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 border border-emerald-800 cursor-pointer"
                              >
                                <span>✅</span>
                                <span>{isRtl ? 'قالها صح (إظهار المقطع)' : 'Correct (Reveal)'}</span>
                              </button>

                              {/* 2. Said with Mistake Button */}
                              <button
                                type="button"
                                onClick={() => handlePassageVerdict('error')}
                                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 border border-rose-800 cursor-pointer"
                              >
                                <span>⚠️</span>
                                <span>{isRtl ? 'قالها غلط (إعادة المقطع)' : 'Mistake (Retry)'}</span>
                              </button>

                              {/* 3. If in Retry mode: reveal for review or confirm correct after retry */}
                              {passageStatus === 'error_retry' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handlePassageVerdict('correct')}
                                    className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>🔁</span>
                                    <span>{isRtl ? 'أتقن بعد الإعادة (إظهار)' : 'Mastered after Retry'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handlePassageVerdict('reveal_review')}
                                    className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>👁️</span>
                                    <span>{isRtl ? 'إظهار للتصحيح والمراجعة' : 'Reveal for Review'}</span>
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Reset Button */}
                            <button
                              type="button"
                              onClick={() => handlePassageVerdict('reset')}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              ✕ {isRtl ? 'إنهاء اختبار المقطع' : 'Close'}
                            </button>
                          </div>
                        </div>
                      )}
`;
  html = html.replace(boardStartMarker, arbitrationPanel + '\n' + boardStartMarker);
  console.log('Injected arbitration panel before repetition counter');
}

// 3. Inject Passage masking logic inside the Ayah card rendering
const ayahCardMarker = `const words = ayah.text.split(' ');
                          const isRevealed = !isFullMasked || revealedAyahSet.has(ayah.num);`;

if (html.includes(ayahCardMarker)) {
  const newAyahVars = `const words = ayah.text.split(' ');
                          const isPassageMasked = passageMaskedAyahs.has(ayah.num);
                          const isPassageHidden = isPassageMasked && (passageStatus === 'reciting' || passageStatus === 'error_retry');
                          const isRevealed = (!isFullMasked || revealedAyahSet.has(ayah.num)) && !isPassageHidden;`;

  html = html.replace(ayahCardMarker, newAyahVars);
  console.log('Updated isRevealed with passage masking check');
}

// 4. Update the masked rendering block inside Ayah card
const oldMaskBlock = `!isRevealed ? (
                                <div className="py-6 text-center text-slate-400 font-amiri text-lg border-2 border-dashed border-emerald-900/20 rounded-xl bg-emerald-950/5 select-none">
                                  🔒 {isRtl ? 'الآية مخفية للتسميع الغيبي — اضغط "كشف للطالب" عند إتمام القراءة' : 'Ayah hidden for blind recitation'}
                                </div>
                              )`;

const newMaskBlock = `!isRevealed ? (
                                isPassageHidden ? (
                                  <div className={'p-6 sm:p-8 rounded-2xl text-center border-2 transition-all select-none ' + (
                                    passageStatus === 'error_retry'
                                      ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-md ring-2 ring-rose-300'
                                      : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-inner'
                                  )}>
                                    <span className="text-3xl sm:text-4xl block mb-2">
                                      {passageStatus === 'error_retry' ? '⚠️' : '🔒'}
                                    </span>
                                    <div className="font-cairo font-black text-sm sm:text-base">
                                      {passageStatus === 'error_retry'
                                        ? (isRtl ? 'وقع خطأ في الآية (' + ayah.num + ') — أعد قراءتها الآن مرة أخرى!' : 'Mistake in Ayah (' + ayah.num + ') — Recite again!')
                                        : (isRtl ? 'الآية (' + ayah.num + ') محجوبة ضمن مقطع التسميع والاختبار' : 'Ayah (' + ayah.num + ') Masked in Passage')}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1 font-medium">
                                      {passageStatus === 'error_retry'
                                        ? (isRtl ? 'لا يتم إظهار الآية حتى يعيد الطالب تلاوتها وتصحيح الخطأ' : 'Student must re-recite before reveal')
                                        : (isRtl ? 'يقرأها الطالب غيباً — انقر زر [✅ قالها صح] بالأعلى لإظهارها أو [⚠️ قالها غلط] لإعادتها' : 'Recited from memory')}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="py-6 text-center text-slate-400 font-amiri text-lg border-2 border-dashed border-emerald-900/20 rounded-xl bg-emerald-950/5 select-none">
                                    🔒 {isRtl ? 'الآية مخفية للتسميع الغيبي — اضغط "كشف للطالب" عند إتمام القراءة' : 'Ayah hidden for blind recitation'}
                                  </div>
                                )
                              )`;

if (html.includes(oldMaskBlock)) {
  html = html.replace(oldMaskBlock, newMaskBlock);
  console.log('Replaced mask block with passage-aware mask UI');
} else {
  console.log('Warning: oldMaskBlock not found, checking with regex');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved public/index.html with passage testing suite');
