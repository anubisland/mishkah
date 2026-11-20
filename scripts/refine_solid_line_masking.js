const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const swPath = path.join(__dirname, '..', 'public', 'sw.js');

let html = fs.readFileSync(indexPath, 'utf8');
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Update State Declarations
const oldState = `      const [isEndingsMasked, setIsEndingsMasked] = useState(false);
      const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight', 'interactive_lines'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      const [mushafMaskGranularity, setMushafMaskGranularity] = useState('words'); // 'words' (3 segments per line = 45 segments) or 'lines' (15 lines)
      const [maskedMushafSegments, setMaskedMushafSegments] = useState(new Set()); // Segment keys like '0-0', '0-1', '0-2' for Line 0..14 and Segment 0..2
      const [maskedMushafLines, setMaskedMushafLines] = useState(new Set()); // Backward compatibility`;

const newState = `      const [isEndingsMasked, setIsEndingsMasked] = useState(false);
      const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight', 'interactive_lines'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      const [maskedMushafLines, setMaskedMushafLines] = useState(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])); // Lines 0..14`;

if (!html.includes(oldState)) {
  console.error("Could not find oldState in index.html");
  process.exit(1);
}
html = html.replace(oldState, newState);

// 2. Update Version in Header
html = html.replace(/v44\.0/g, 'v45.0');

// 3. Update the Toolbar Button for Interactive Masking and the entire Sub-bar
const oldToolbarAndSubbar = `                            {/* 5. Interactive Click-to-Mask Words & Lines (Requested by user for iPhone & mobile perfection) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (mushafOverlayMode === 'interactive_lines') {
                                  setMushafOverlayMode('none');
                                  setMaskedMushafSegments(new Set());
                                } else {
                                  setMushafOverlayMode('interactive_lines');
                                  const s = new Set();
                                  for (let l = 0; l < 15; l++) {
                                    s.add(\`\${l}-0\`); s.add(\`\${l}-1\`); s.add(\`\${l}-2\`);
                                  }
                                  setMaskedMushafSegments(s);
                                }
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'interactive_lines' ? 'bg-gold-500 text-emerald-950 border-gold-600 font-black shadow-md ring-2 ring-gold-300' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🎭</span>
                              <span>{isRtl ? 'حجب وتسميع الكلمات والأسطر تفاعلياً' : 'Tap-to-Mask Words & Lines'}</span>
                            </button>

                            {/* Reset Button */}
                            {mushafOverlayMode !== 'none' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMushafOverlayMode('none');
                                  setMaskedMushafSegments(new Set());
                                }}
                                className="px-2.5 py-1.5 rounded-xl font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>{isRtl ? 'عرض المصحف كاملاً' : 'Full Page'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Word & Line Masking Sub-bar */}
                        {mushafOverlayMode === 'interactive_lines' && (
                          <div className="mb-3 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white border-2 border-gold-400 rounded-2xl p-3 sm:p-4 shadow-md space-y-3 animate-fadeIn">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-400/30 pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gold-300 font-black text-xs sm:text-sm">
                                    🎭 {isRtl ? 'وضع التسميع التفاعلي بحجب الكلمات والأسطر على صفحة المصحف:' : 'Interactive Word & Line Recall:'}
                                  </span>
                                  <span className="bg-gold-400 text-emerald-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                    {isRtl ? \`\${maskedMushafSegments.size} من 45 مقطع محجوب\` : \`\${maskedMushafSegments.size} / 45 masked\`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-emerald-200 mt-0.5">
                                  {isRtl 
                                    ? 'انقر مباشرة على أي كلمة أو سطر لحجبه أو كشفه. يعمل بنقاء 100% على الآيفون والموبايل من صفحة مصحف المدينة دون أي تقطيع في الخطوط.' 
                                    : 'Tap any word segment or line to reveal or mask. 100% authentic typography with zero mobile font rendering issues.'}
                                </p>
                              </div>

                              {/* Granularity Switch */}
                              <div className="bg-emerald-900/80 p-1 rounded-xl flex items-center border border-gold-400/40 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setMushafMaskGranularity('words')}
                                  className={'px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ' + (mushafMaskGranularity === 'words' ? 'bg-gold-500 text-emerald-950 font-black shadow-xs' : 'text-slate-300 hover:text-white')}
                                >
                                  <span>🔲</span>
                                  <span>{isRtl ? 'وحدات الكلمات (45 مقطع)' : 'Words (45 Segments)'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMushafMaskGranularity('lines')}
                                  className={'px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ' + (mushafMaskGranularity === 'lines' ? 'bg-gold-500 text-emerald-950 font-black shadow-xs' : 'text-slate-300 hover:text-white')}
                                >
                                  <span>📄</span>
                                  <span>{isRtl ? 'أسطر كاملة (15 سطر)' : 'Full Lines (15)'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Preset Masking Modes */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="text-[11px] text-gold-300 font-bold ml-1">{isRtl ? 'أنماط التركيز:' : 'Focus:'}</span>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const s = new Set();
                                  for (let l = 0; l < 15; l++) s.add(\`\${l}-2\`);
                                  setMaskedMushafSegments(s);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                                title="حجب أواخر الأسطر وفواصل الآيات لاختبار إتقان رؤوس الآيات"
                              >
                                <span>🎯</span>
                                <span>{isRtl ? 'فواصل ونهايات الآيات' : 'Ayah Endings'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const s = new Set();
                                  for (let l = 0; l < 15; l++) s.add(\`\${l}-0\`);
                                  setMaskedMushafSegments(s);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                                title="حجب بدايات الأسطر ومطالع الآيات لاختبار مفاتيح الحفظ"
                              >
                                <span>🚀</span>
                                <span>{isRtl ? 'أوائل الآيات' : 'Starters'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const s = new Set();
                                  for (let l = 0; l < 7; l++) {
                                    s.add(\`\${l}-0\`); s.add(\`\${l}-1\`); s.add(\`\${l}-2\`);
                                  }
                                  setMaskedMushafSegments(s);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔺</span>
                                <span>{isRtl ? 'النصف الأعلى (1-7)' : 'Top Half'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const s = new Set();
                                  for (let l = 7; l < 15; l++) {
                                    s.add(\`\${l}-0\`); s.add(\`\${l}-1\`); s.add(\`\${l}-2\`);
                                  }
                                  setMaskedMushafSegments(s);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔻</span>
                                <span>{isRtl ? 'النصف الأسفل (8-15)' : 'Bottom Half'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const s = new Set();
                                  for (let l = 5; l < 10; l++) {
                                    s.add(\`\${l}-0\`); s.add(\`\${l}-1\`); s.add(\`\${l}-2\`);
                                  }
                                  setMaskedMushafSegments(s);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                                title="حجب الثلث الأوسط (الأسطر 6 إلى 10)"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث الأوسط' : 'Middle Third'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const allKeys = [];
                                  for (let l = 0; l < 15; l++) {
                                    for (let seg = 0; seg < 3; seg++) allKeys.push(\`\${l}-\${seg}\`);
                                  }
                                  const rand = allKeys.sort(() => 0.5 - Math.random()).slice(0, 18);
                                  setMaskedMushafSegments(new Set(rand));
                                }}
                                className="px-2.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black rounded-xl transition flex items-center gap-1"
                              >
                                <span>🎲</span>
                                <span>{isRtl ? 'حجب عشوائي للمقاطع' : 'Random Mask'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const s = new Set();
                                  for (let l = 0; l < 15; l++) {
                                    s.add(\`\${l}-0\`); s.add(\`\${l}-1\`); s.add(\`\${l}-2\`);
                                  }
                                  setMaskedMushafSegments(s);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔒</span>
                                <span>{isRtl ? 'حجب كامل الوجه' : 'Mask All'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafSegments(new Set())}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-emerald-950 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>👁️</span>
                                <span>{isRtl ? 'كشف كامل الوجه' : 'Reveal All'}</span>
                              </button>
                            </div>
                          </div>
                        )}`;

const newToolbarAndSubbar = `                            {/* 5. Interactive Click-to-Mask Lines & Sections (100% Solid Opaque Layers) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (mushafOverlayMode === 'interactive_lines') {
                                  setMushafOverlayMode('none');
                                } else {
                                  setMushafOverlayMode('interactive_lines');
                                  setMaskedMushafLines(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]));
                                }
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'interactive_lines' ? 'bg-gold-500 text-emerald-950 border-gold-600 font-black shadow-md ring-2 ring-gold-300' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🎭</span>
                              <span>{isRtl ? 'حجب وتسميع الأسطر تفاعلياً' : 'Tap-to-Mask Lines'}</span>
                            </button>

                            {/* Reset Button */}
                            {mushafOverlayMode !== 'none' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMushafOverlayMode('none');
                                  setMaskedMushafLines(new Set());
                                }}
                                className="px-2.5 py-1.5 rounded-xl font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>{isRtl ? 'عرض المصحف كاملاً' : 'Full Page'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Line Masking Sub-bar (Solid Opaque Layers) */}
                        {mushafOverlayMode === 'interactive_lines' && (
                          <div className="mb-3 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white border-2 border-gold-400 rounded-2xl p-3 sm:p-4 shadow-md space-y-3 animate-fadeIn">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-400/30 pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gold-300 font-black text-xs sm:text-sm">
                                    🎭 {isRtl ? 'وضع التسميع بالأسطر والكتل المصمتة (حجب 100% دون تسريب):' : 'Solid Opaque Line Recall Layers:'}
                                  </span>
                                  <span className="bg-gold-400 text-emerald-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                    {isRtl ? \`\${maskedMushafLines.size} من 15 سطراً محجوباً\` : \`\${maskedMushafLines.size} / 15 lines masked\`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-emerald-200 mt-0.5">
                                  {isRtl 
                                    ? 'انقر مباشرة على أي سطر في المصحف لحجبه بطبقة مصمتة 100% أو كشفه فوراً، أو استخدم الخيارات السريعة أدناه:' 
                                    : 'Tap any line on the page to mask with 100% solid layer or reveal, or select a preset below:'}
                                </p>
                              </div>
                            </div>

                            {/* Preset Masking Modes */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="text-[11px] text-gold-300 font-bold ml-1">{isRtl ? 'أنماط التركيز:' : 'Presets:'}</span>
                              
                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                                title="حجب كافة الأسطر الـ 15 للتسميع الكامل سطراً بسطر"
                              >
                                <span>🔒</span>
                                <span>{isRtl ? 'حجب الوجه كاملاً (15 سطر)' : 'Mask All (15)'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([0, 1, 2, 3, 4, 5, 6]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔺</span>
                                <span>{isRtl ? 'حجب النصف الأعلى (1-7)' : 'Top Half (1-7)'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([7, 8, 9, 10, 11, 12, 13, 14]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔻</span>
                                <span>{isRtl ? 'حجب النصف الأسفل (8-15)' : 'Bottom Half (8-15)'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([0, 1, 2, 3, 4]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث 1 (1-5)' : '1st Third (1-5)'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([5, 6, 7, 8, 9]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث 2 (6-10)' : '2nd Third (6-10)'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([10, 11, 12, 13, 14]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث 3 (11-15)' : '3rd Third (11-15)'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set([1, 3, 5, 7, 9, 11, 13]))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                                title="حجب سطر وسطر لاختبار ربط بدايات ونهايات الأسطر"
                              >
                                <span>🌓</span>
                                <span>{isRtl ? 'حجب تبادلي (سطر وسطر)' : 'Alternate Lines'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const all = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].sort(() => 0.5 - Math.random()).slice(0, 7);
                                  setMaskedMushafLines(new Set(all));
                                }}
                                className="px-2.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black rounded-xl transition flex items-center gap-1"
                              >
                                <span>🎲</span>
                                <span>{isRtl ? 'حجب عشوائي (تسميع مفاجئ)' : 'Random 7 Lines'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set())}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-emerald-950 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>👁️</span>
                                <span>{isRtl ? 'كشف كامل الوجه' : 'Reveal All'}</span>
                              </button>
                            </div>
                          </div>
                        )}`;

if (!html.includes(oldToolbarAndSubbar)) {
  console.error("Could not find oldToolbarAndSubbar in index.html");
  process.exit(1);
}
html = html.replace(oldToolbarAndSubbar, newToolbarAndSubbar);

// 4. Update the Overlays Rendering on Mushaf Page (100% Solid Opaque Full-Line Layers)
const oldOverlays = `                            {/* OVERLAY: Interactive Word-by-Word & Line Masking (Tap-to-Mask / Tap-to-Reveal) */}
                            {mushafOverlayMode === 'interactive_lines' && (
                              <div className="absolute inset-0 select-none pointer-events-auto" style={{ zIndex: 12 }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(lineIdx => {
                                  if (mushafMaskGranularity === 'lines') {
                                    const isLineMasked = maskedMushafSegments.has(\`\${lineIdx}-0\`) || maskedMushafSegments.has(\`\${lineIdx}-1\`) || maskedMushafSegments.has(\`\${lineIdx}-2\`);
                                    return (
                                      <div
                                        key={\`line-\${lineIdx}\`}
                                        onClick={() => {
                                          setMaskedMushafSegments(prev => {
                                            const next = new Set(prev);
                                            if (isLineMasked) {
                                              next.delete(\`\${lineIdx}-0\`);
                                              next.delete(\`\${lineIdx}-1\`);
                                              next.delete(\`\${lineIdx}-2\`);
                                            } else {
                                              next.add(\`\${lineIdx}-0\`);
                                              next.add(\`\${lineIdx}-1\`);
                                              next.add(\`\${lineIdx}-2\`);
                                            }
                                            return next;
                                          });
                                        }}
                                        className={'absolute left-[2.5%] right-[2.5%] rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center ' + (
                                          isLineMasked
                                            ? 'shadow-md border border-gold-500/80 hover:border-gold-300'
                                            : 'hover:bg-amber-400/20 border border-transparent hover:border-gold-400/40'
                                        )}
                                        style={{
                                          top: (6.2 + lineIdx * 5.85) + '%',
                                          height: '5.6%',
                                          background: isLineMasked ? 'linear-gradient(135deg, #FAF7EE 0%, #F5ECE0 100%)' : 'transparent',
                                          zIndex: isLineMasked ? 15 : 13
                                        }}
                                        title={isLineMasked ? (isRtl ? \`السطر \${lineIdx + 1} محجوب للتسميع — انقر للكشف\` : 'Line masked — tap to reveal') : (isRtl ? \`السطر \${lineIdx + 1} مكشوف — انقر للحجب\` : 'Line revealed — tap to mask')}
                                      >
                                        {isLineMasked && (
                                          <span className="text-[10px] sm:text-xs font-black text-emerald-950 font-cairo flex items-center gap-1.5 opacity-90 hover:opacity-100 select-none">
                                            <span>🔒</span>
                                            <span>{isRtl ? \`السطر \${lineIdx + 1} (انقر للكشف)\` : \`Line \${lineIdx + 1} (tap to reveal)\`}</span>
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }

                                  // Word segments mode: 3 segments per line (Right: Starters, Center: Middle words, Left: Endings/Ayah Rhymes)
                                  return (
                                    <React.Fragment key={\`line-segs-\${lineIdx}\`}>
                                      {[0, 1, 2].map(segIdx => {
                                        const segKey = \`\${lineIdx}-\${segIdx}\`;
                                        const isMasked = maskedMushafSegments.has(segKey);
                                        const rightPos = segIdx === 0 ? '2.5%' : (segIdx === 1 ? '34%' : 'auto');
                                        const leftPos = segIdx === 2 ? '2.5%' : 'auto';
                                        const widthVal = segIdx === 1 ? '32%' : '30.5%';
                                        const segLabel = segIdx === 0 ? (isRtl ? 'بداية السطر' : 'Start') : (segIdx === 1 ? (isRtl ? 'وسط' : 'Mid') : (isRtl ? 'فاصلة / نهاية' : 'End'));

                                        return (
                                          <div
                                            key={segKey}
                                            onClick={() => {
                                              setMaskedMushafSegments(prev => {
                                                const next = new Set(prev);
                                                if (next.has(segKey)) next.delete(segKey);
                                                else next.add(segKey);
                                                return next;
                                              });
                                            }}
                                            className={'absolute rounded-md cursor-pointer transition-all duration-150 flex items-center justify-center ' + (
                                              isMasked
                                                ? 'shadow-xs border border-gold-500/85 hover:border-gold-300'
                                                : 'hover:bg-amber-400/20 border border-transparent hover:border-gold-400/30'
                                            )}
                                            style={{
                                              top: (6.2 + lineIdx * 5.85) + '%',
                                              height: '5.6%',
                                              right: rightPos,
                                              left: leftPos,
                                              width: widthVal,
                                              background: isMasked ? 'linear-gradient(135deg, #FAF7EE 0%, #F5ECE0 100%)' : 'transparent',
                                              zIndex: isMasked ? 16 : 13
                                            }}
                                            title={isMasked ? (isRtl ? \`مقطع \${segLabel} (السطر \${lineIdx + 1}) محجوب — انقر للكشف\` : \`Segment masked — tap to reveal\`) : (isRtl ? \`مقطع \${segLabel} (السطر \${lineIdx + 1}) مكشوف — انقر للحجب\` : \`Segment revealed — tap to mask\`)}
                                          >
                                            {isMasked && (
                                              <span className="text-[9px] sm:text-[10px] font-black text-emerald-950 font-cairo flex items-center gap-1 opacity-90 select-none">
                                                <span>🔒</span>
                                                <span className="hidden sm:inline">{segLabel}</span>
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            )}`;

const newOverlays = `                            {/* OVERLAY: 100% Solid Opaque Line Masking Layers (Tap-to-Mask / Tap-to-Reveal) */}
                            {mushafOverlayMode === 'interactive_lines' && (
                              <div className="absolute inset-0 select-none pointer-events-auto" style={{ zIndex: 12 }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(lineIdx => {
                                  const isLineMasked = maskedMushafLines.has(lineIdx);
                                  return (
                                    <div
                                      key={\`mushaf-solid-line-\${lineIdx}\`}
                                      onClick={() => {
                                        setMaskedMushafLines(prev => {
                                          const next = new Set(prev);
                                          if (next.has(lineIdx)) next.delete(lineIdx);
                                          else next.add(lineIdx);
                                          return next;
                                        });
                                      }}
                                      className={'absolute rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between px-3 sm:px-4 ' + (
                                        isLineMasked
                                          ? 'shadow-xs border-y-2 border-amber-600/70 hover:border-amber-500'
                                          : 'hover:bg-amber-400/20 border border-transparent hover:border-gold-400/40'
                                      )}
                                      style={{
                                        top: (6.1 + lineIdx * 5.86) + '%',
                                        height: '5.85%',
                                        left: '2%',
                                        right: '2%',
                                        backgroundColor: isLineMasked ? '#FAF7EE' : 'transparent',
                                        opacity: 1,
                                        zIndex: isLineMasked ? 16 : 13
                                      }}
                                      title={isLineMasked ? (isRtl ? \`السطر \${lineIdx + 1} محجوب بالكامل — انقر للكشف\` : \`Line \${lineIdx + 1} masked — tap to reveal\`) : (isRtl ? \`السطر \${lineIdx + 1} مكشوف — انقر للحجب\` : \`Line \${lineIdx + 1} revealed — tap to mask\`)}
                                    >
                                      {isLineMasked && (
                                        <>
                                          <span className="text-[10px] sm:text-xs font-black text-emerald-950 font-cairo flex items-center gap-1.5 opacity-90 select-none">
                                            <span>🔒</span>
                                            <span>{isRtl ? \`السطر \${lineIdx + 1}\` : \`Line \${lineIdx + 1}\`}</span>
                                          </span>
                                          <span className="text-[9px] sm:text-[11px] font-bold text-amber-900/80 hidden sm:inline select-none">
                                            {isRtl ? 'انقر لكشف السطر' : 'tap to reveal'}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}`;

if (!html.includes(oldOverlays)) {
  console.error("Could not find oldOverlays in index.html");
  process.exit(1);
}
html = html.replace(oldOverlays, newOverlays);

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully updated index.html to v45.0 with 100% Solid Line Masking Layers!");

// 5. Update sw.js to mishkah-cache-v45
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/mishkah-cache-v44/g, 'mishkah-cache-v45');
fs.writeFileSync(swPath, sw, 'utf8');
console.log("Successfully updated sw.js to mishkah-cache-v45!");
