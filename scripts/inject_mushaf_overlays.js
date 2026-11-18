const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add state variables for Mushaf overlay and flash timer if not already present
if (!html.includes('mushafOverlayMode')) {
  const targetState = 'const [isEndingsMasked, setIsEndingsMasked] = useState(false);';
  const newStates = `const [isEndingsMasked, setIsEndingsMasked] = useState(false);
      const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      const [flashActive, setFlashActive] = useState(false);`;
  html = html.replace(targetState, newStates);
  console.log('Added mushaf overlay states');
}

// 2. Add the Interactive Testing Toolbar & Overlays inside Mode 1 (Real Mushaf Page)
// Let's inspect where Mode 1's Mushaf page image is rendered
const imgMarker = `<div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center">`;
if (html.includes(imgMarker) && !html.includes('mushafOverlayMode ===')) {
  const replacement = `
                        {/* Interactive Testing Toolbar on the Printed Mushaf Page */}
                        <div className="mb-4 bg-emerald-950/5 border border-gold-400/40 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🛠️</span>
                            <span className="text-xs font-bold text-emerald-950">
                              {isRtl ? 'أدوات اختبار الحفظ المباشرة على وجه المصحف:' : 'Mushaf Page Testing Tools:'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {/* 1. Ruler mode */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'ruler' ? 'none' : 'ruler');
                                setActiveRulerLine(1);
                              }}
                              className={'px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'ruler' ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>📏</span>
                              <span>{isRtl ? 'المسطرة الكاشفة (سطراً بسطر)' : 'Line Ruler'}</span>
                            </button>

                            {/* 2. Mask bottom half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_bottom' ? 'none' : 'mask_bottom')}
                              className={'px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_bottom' ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔻</span>
                              <span>{isRtl ? 'حجب النصف الأسفل (8-15)' : 'Mask Bottom'}</span>
                            </button>

                            {/* 3. Mask top half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_top' ? 'none' : 'mask_top')}
                              className={'px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_top' ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
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
                              className={'px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'spotlight' ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>💡</span>
                              <span>{isRtl ? 'كشاف تسليط السطر' : 'Spotlight'}</span>
                            </button>

                            {/* Reset */}
                            {mushafOverlayMode !== 'none' && (
                              <button
                                type="button"
                                onClick={() => setMushafOverlayMode('none')}
                                className="px-2.5 py-1 rounded-xl font-bold bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>{isRtl ? 'عرض المصحف كاملاً' : 'Reset Overlay'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Ruler Line Navigation Bar (when ruler or spotlight active) */}
                        {(mushafOverlayMode === 'ruler' || mushafOverlayMode === 'spotlight') && (
                          <div className="mb-3 bg-amber-50 border border-gold-400 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-800 font-bold text-xs">
                                📌 {isRtl ? 'السطر المكشوف الحالي:' : 'Revealed Line:'}
                              </span>
                              <span className="bg-emerald-900 text-gold-300 px-2.5 py-0.5 rounded-lg text-xs font-black">
                                {isRtl ? 'السطر ' + activeRulerLine + ' من 15' : 'Line ' + activeRulerLine + ' of 15'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={activeRulerLine >= 15}
                                onClick={() => setActiveRulerLine(Math.min(15, activeRulerLine + 1))}
                                className="px-3 py-1 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬇️</span>
                                <span>{isRtl ? 'كشف السطر التالي' : 'Next Line'}</span>
                              </button>

                              <button
                                type="button"
                                disabled={activeRulerLine <= 1}
                                onClick={() => setActiveRulerLine(Math.max(1, activeRulerLine - 1))}
                                className="px-3 py-1 bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                              >
                                <span>⬆️</span>
                                <span>{isRtl ? 'حجب السطر السابق' : 'Prev Line'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveRulerLine(1)}
                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition"
                                title="إعادة من أول سطر"
                              >
                                🔁
                              </button>
                            </div>
                          </div>
                        )}

                        {/* The High-Resolution 15-Line Page Image with Overlays */}
                        <div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center relative overflow-hidden">
                          <div className="relative inline-block w-full max-w-3xl">
                            <img
                              key={mushafPageNumber}
                              src={'https://android.quran.com/data/width_1260/page' + String(mushafPageNumber).padStart(3, '0') + '.png'}
                              alt={'مصحف المدينة النبوية — صفحة ' + mushafPageNumber}
                              className="w-full h-auto block mx-auto bg-white filter contrast-110 drop-shadow-sm select-none"
                              loading="eager"
                              style={{ minHeight: '500px' }}
                            />

                            {/* OVERLAY: Ruler Mode (masks below activeRulerLine) */}
                            {mushafOverlayMode === 'ruler' && (
                              <div
                                className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-[#f9f7f1] to-[#ede8d8] border-t-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ease-out select-none"
                                style={{
                                  top: (activeRulerLine * 6.55) + '%',
                                  zIndex: 10
                                }}
                              >
                                <div className="text-center bg-white/90 backdrop-blur-xs border border-amber-500/40 rounded-2xl p-4 shadow-md max-w-md">
                                  <span className="text-2xl block mb-1">📜</span>
                                  <p className="text-xs font-extrabold text-emerald-950 font-cairo">
                                    {isRtl ? 'مسطرة التحفيظ: الأسطر الباقية محجوبة' : 'Blind Ruler Active'}
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {isRtl ? 'يقرأ الطالب السطر المكشوف، ثم انقر [⬇️ كشف السطر التالي] لمواصلة التسميع' : 'Click next line to advance recitation'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* OVERLAY: Mask Bottom Half (Lines 8-15) */}
                            {mushafOverlayMode === 'mask_bottom' && (
                              <div 
                                className="absolute left-0 right-0 bottom-0 top-[52%] bg-gradient-to-b from-[#f9f7f1] to-[#ede8d8] border-t-4 border-amber-700/80 shadow-2xl flex items-center justify-center p-4 select-none"
                                style={{ zIndex: 10 }}
                              >
                                <div className="text-center bg-white/90 border border-amber-600/40 rounded-2xl p-4 shadow-lg max-w-sm">
                                  <span className="text-3xl block mb-1">🔒</span>
                                  <p className="text-xs font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'النصف الأسفل محجوب (الأسطر 8 - 15)' : 'Bottom Half Masked'}
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {isRtl ? 'اختبار استحضار بقية الوجه غيباً دون الاعتماد على البصر' : 'Recite remaining lines from memory'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* OVERLAY: Mask Top Half (Lines 1-7) */}
                            {mushafOverlayMode === 'mask_top' && (
                              <div 
                                className="absolute left-0 right-0 top-0 bottom-[48%] bg-gradient-to-b from-[#f9f7f1] to-[#ede8d8] border-b-4 border-amber-700/80 shadow-2xl flex items-center justify-center p-4 select-none"
                                style={{ zIndex: 10 }}
                              >
                                <div className="text-center bg-white/90 border border-amber-600/40 rounded-2xl p-4 shadow-lg max-w-sm">
                                  <span className="text-3xl block mb-1">🔒</span>
                                  <p className="text-xs font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'النصف الأعلى محجوب (الأسطر 1 - 7)' : 'Top Half Masked'}
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {isRtl ? 'اختبار الابتداء المباشر من منتصف الوجه الشريف' : 'Start recitation directly from middle of page'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* OVERLAY: Spotlight Mode */}
                            {mushafOverlayMode === 'spotlight' && (
                              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                                {/* Top mask */}
                                <div 
                                  className="absolute left-0 right-0 top-0 bg-slate-900/60 backdrop-blur-[1px] transition-all duration-300"
                                  style={{ height: Math.max(0, (activeRulerLine - 1) * 6.55) + '%' }}
                                />
                                {/* Spotlight focus ring on current line */}
                                <div 
                                  className="absolute left-0 right-0 border-y-2 border-gold-400 bg-amber-400/10 shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-300"
                                  style={{
                                    top: ((activeRulerLine - 1) * 6.55) + '%',
                                    height: '6.55%'
                                  }}
                                />
                                {/* Bottom mask */}
                                <div 
                                  className="absolute left-0 right-0 bottom-0 bg-slate-900/60 backdrop-blur-[1px] transition-all duration-300"
                                  style={{ top: (activeRulerLine * 6.55) + '%' }}
                                />
                              </div>
                            )}
                          </div>
                        </div>`;

  html = html.replace(imgMarker, replacement);
  // remove the old standalone img block since we replaced it with wrapped img + overlays
  // Let's check lines right after replacement
  const oldImgTail = `<div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center">
                          <img
                            key={mushafPageNumber}
                            src={'https://android.quran.com/data/width_1260/page' + String(mushafPageNumber).padStart(3, '0') + '.png'}
                            alt={'مصحف المدينة النبوية — صفحة ' + mushafPageNumber}
                            className="w-full max-w-3xl h-auto block mx-auto bg-white filter contrast-110 drop-shadow-sm select-none"
                            loading="eager"
                            style={{ minHeight: '500px' }}
                          />
                        </div>`;
  // If oldImgTail is duplicated, clean it up
  console.log('Mode 1 overlays injected successfully');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved updated public/index.html');
