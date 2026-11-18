const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add state variables for mushaf overlays if not present
if (!html.includes('mushafOverlayMode')) {
  const target = 'const [isEndingsMasked, setIsEndingsMasked] = useState(false);';
  const addition = `const [isEndingsMasked, setIsEndingsMasked] = useState(false);
      const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15`;
  html = html.replace(target, addition);
  console.log('Added mushafOverlayMode states');
}

// 2. Locate the block
const p1 = html.indexOf('{/* The High-Resolution 15-Line Page Image */}');
const p2 = html.indexOf('{/* Bottom Mushaf Footer */}');

if (p1 !== -1 && p2 !== -1) {
  const newBlock = `{/* Interactive Testing Toolbar Directly on Printed Mushaf Page */}
                        <div className="mb-4 bg-emerald-950/5 border border-gold-400/50 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg">🛠️</span>
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-emerald-950 font-cairo block">
                                {isRtl ? 'أدوات اختبار الحفظ المباشرة على وجه المصحف:' : 'Mushaf Testing Tools:'}
                              </span>
                              <span className="text-[11px] text-slate-500 hidden sm:block">
                                {isRtl ? 'أقنعة ومساطر تفاعلية لتسميع الوجه سطراً بسطر أو حجب أجزاء منه' : 'Interactive masks and rulers directly on page'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {/* 1. Ruler mode */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'ruler' ? 'none' : 'ruler');
                                setActiveRulerLine(1);
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'ruler' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>📏</span>
                              <span>{isRtl ? 'المسطرة الكاشفة (سطراً بسطر)' : 'Line Ruler'}</span>
                            </button>

                            {/* 2. Mask bottom half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_bottom' ? 'none' : 'mask_bottom')}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_bottom' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔻</span>
                              <span>{isRtl ? 'حجب النصف الأسفل (8-15)' : 'Mask Bottom'}</span>
                            </button>

                            {/* 3. Mask top half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_top' ? 'none' : 'mask_top')}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_top' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔺</span>
                              <span>{isRtl ? 'حجب النصف الأعلى (1-7)' : 'Mask Top'}</span>
                            </button>

                            {/* 4. Spotlight */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'spotlight' ? 'none' : 'spotlight');
                                setActiveRulerLine(1);
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'spotlight' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>💡</span>
                              <span>{isRtl ? 'كشاف تركيز السطر' : 'Spotlight'}</span>
                            </button>

                            {/* Reset Button */}
                            {mushafOverlayMode !== 'none' && (
                              <button
                                type="button"
                                onClick={() => setMushafOverlayMode('none')}
                                className="px-2.5 py-1.5 rounded-xl font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>{isRtl ? 'عرض المصحف كاملاً' : 'Full Page'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Ruler Controls (When ruler or spotlight active) */}
                        {(mushafOverlayMode === 'ruler' || mushafOverlayMode === 'spotlight') && (
                          <div className="mb-3 bg-amber-50/90 border border-gold-400 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-900 font-bold text-xs sm:text-sm">
                                📌 {isRtl ? 'السطر النشط:' : 'Active Line:'}
                              </span>
                              <span className="bg-emerald-900 text-gold-200 px-3 py-1 rounded-xl text-xs sm:text-sm font-black shadow-xs">
                                {isRtl ? 'السطر ' + activeRulerLine + ' من 15' : 'Line ' + activeRulerLine + ' of 15'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={activeRulerLine >= 15}
                                onClick={() => setActiveRulerLine(Math.min(15, activeRulerLine + 1))}
                                className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬇️</span>
                                <span>{isRtl ? 'كشف السطر التالي' : 'Next Line'}</span>
                              </button>

                              <button
                                type="button"
                                disabled={activeRulerLine <= 1}
                                onClick={() => setActiveRulerLine(Math.max(1, activeRulerLine - 1))}
                                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬆️</span>
                                <span>{isRtl ? 'حجب السطر السابق' : 'Prev Line'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveRulerLine(1)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
                                title="إعادة من أول سطر"
                              >
                                🔁 {isRtl ? 'البداية' : 'Start'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* The High-Resolution 15-Line Page Image with Authentic Overlays */}
                        <div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center relative overflow-hidden select-none">
                          <div className="relative inline-block w-full max-w-3xl">
                            <img
                              key={mushafPageNumber}
                              src={'https://android.quran.com/data/width_1260/page' + String(mushafPageNumber).padStart(3, '0') + '.png'}
                              alt={'مصحف المدينة النبوية — صفحة ' + mushafPageNumber}
                              className="w-full h-auto block mx-auto bg-white filter contrast-110 drop-shadow-sm select-none"
                              loading="eager"
                              style={{ minHeight: '500px' }}
                            />

                            {/* OVERLAY: Ruler Mode (masks everything below activeRulerLine) */}
                            {mushafOverlayMode === 'ruler' && (
                              <div
                                className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-t-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ease-out select-none"
                                style={{
                                  top: (activeRulerLine * 6.55) + '%',
                                  zIndex: 10
                                }}
                              >
                                <div className="text-center bg-white/95 backdrop-blur-xs border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-lg max-w-md mx-auto">
                                  <span className="text-2xl sm:text-3xl block mb-1">📜</span>
                                  <p className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'مسطرة التحفيظ: بقية الصفحة محجوبة' : 'Blind Ruler Active'}
                                  </p>
                                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium">
                                    {isRtl ? 'اقرأ السطر المكشوف أعلاه، ثم اضغط [⬇️ كشف السطر التالي] لمتابعة التسميع' : 'Recite revealed line, then advance'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* OVERLAY: Mask Bottom Half (Lines 8-15) */}
                            {mushafOverlayMode === 'mask_bottom' && (
                              <div 
                                className="absolute left-0 right-0 bottom-0 top-[52%] bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-t-4 border-amber-700 shadow-2xl flex items-center justify-center p-4 select-none transition-all duration-300"
                                style={{ zIndex: 10 }}
                              >
                                <div className="text-center bg-white/95 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl max-w-sm mx-auto">
                                  <span className="text-3xl block mb-1">🔒</span>
                                  <p className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'النصف الأسفل محجوب (الأسطر 8 - 15)' : 'Bottom Half Masked'}
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {isRtl ? 'اختبار استحضار بقية الوجه غيباً دون الاعتماد على الذاكرة البصرية' : 'Recite remaining lines from pure memory'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* OVERLAY: Mask Top Half (Lines 1-7) */}
                            {mushafOverlayMode === 'mask_top' && (
                              <div 
                                className="absolute left-0 right-0 top-0 bottom-[48%] bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-b-4 border-amber-700 shadow-2xl flex items-center justify-center p-4 select-none transition-all duration-300"
                                style={{ zIndex: 10 }}
                              >
                                <div className="text-center bg-white/95 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl max-w-sm mx-auto">
                                  <span className="text-3xl block mb-1">🔒</span>
                                  <p className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'النصف الأعلى محجوب (الأسطر 1 - 7)' : 'Top Half Masked'}
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {isRtl ? 'اختبار البدء من منتصف الوجه الشريف وتمكن الحفظ دون السرد التلقائي' : 'Start recitation from middle of page'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* OVERLAY: Spotlight Mode */}
                            {mushafOverlayMode === 'spotlight' && (
                              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                                <div 
                                  className="absolute left-0 right-0 top-0 bg-slate-900/65 backdrop-blur-[1px] transition-all duration-300"
                                  style={{ height: Math.max(0, (activeRulerLine - 1) * 6.55) + '%' }}
                                />
                                <div 
                                  className="absolute left-0 right-0 border-y-2 border-gold-400 bg-amber-300/10 shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
                                  style={{
                                    top: ((activeRulerLine - 1) * 6.55) + '%',
                                    height: '6.55%'
                                  }}
                                />
                                <div 
                                  className="absolute left-0 right-0 bottom-0 bg-slate-900/65 backdrop-blur-[1px] transition-all duration-300"
                                  style={{ top: (activeRulerLine * 6.55) + '%' }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        `;
  html = html.slice(0, p1) + newBlock + html.slice(p2);
  console.log('Successfully replaced image block with Interactive Mushaf Overlay Suite!');
} else {
  console.error('Could not find markers p1 or p2');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved public/index.html');
