const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const swPath = path.join(__dirname, '..', 'public', 'sw.js');

let html = fs.readFileSync(indexPath, 'utf8');
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Add getMushafPageLayout after MUSHAF_SURAHS_PAGE_MAP
const targetAfterMap = `    // 114 Quran Surahs Page Mapping for Real Madinah Mushaf (King Fahd Complex)`;
if (!html.includes(targetAfterMap)) {
  console.error("Could not find targetAfterMap");
  process.exit(1);
}

const layoutEngineCode = `    // Dynamic Multi-Layer Layout Engine for Madinah Mushaf Pages (15 Lines Grid Calibration)
    const getMushafPageLayout = (pageNumber) => {
      const page = parseInt(pageNumber) || 1;
      // Identify pages where a Surah begins (has decorative Surah header banner and Basmalah)
      const surahStarts = MUSHAF_SURAHS_PAGE_MAP.filter(s => s.startPage === page);
      const isSurahOpening = surahStarts.length > 0 && page !== 187; // Surah At-Tawbah (187) has no Basmalah

      if (isSurahOpening) {
        const lines = [];
        const surahName = surahStarts[0]?.name || '';
        // Line 1: Decorative Surah Title Banner Frame (Top 5.8% to 14.6%)
        lines.push({ id: 1, label: \`إطار سورة \${surahName}\`, top: 5.8, height: 8.8, isHeader: true, isVerse: false });
        // Line 2: Basmalah Frame (14.6% to 22.4%)
        lines.push({ id: 2, label: 'البسملة الشريفة', top: 14.6, height: 7.8, isBasmalah: true, isVerse: false });
        // Lines 3 to 15: Exactly 13 Lines of Quranic Verses (22.4% to 95.2%)
        const textStartTop = 22.4;
        const lineH = 5.60;
        const verseLineIds = [];
        for (let i = 0; i < 13; i++) {
          const lineNum = i + 3;
          verseLineIds.push(lineNum);
          lines.push({
            id: lineNum,
            label: \`السطر \${lineNum}\`,
            top: textStartTop + i * lineH,
            height: i === 12 ? 5.80 : lineH,
            isVerse: true
          });
        }
        return { isSurahOpening: true, lines, verseLineIds };
      }

      // Standard 15-line page (e.g. Page 563)
      const lines = [];
      const textStartTop = 5.8;
      const lineH = 5.96;
      const verseLineIds = [];
      for (let i = 0; i < 15; i++) {
        const lineNum = i + 1;
        verseLineIds.push(lineNum);
        lines.push({
          id: lineNum,
          label: \`السطر \${lineNum}\`,
          top: textStartTop + i * lineH,
          height: 5.90,
          isVerse: true
        });
      }
      return { isSurahOpening: false, lines, verseLineIds };
    };
`;

if (!html.includes('const getMushafPageLayout =')) {
  html = html.replace(targetAfterMap, layoutEngineCode + '\n' + targetAfterMap);
}

// 2. In component, declare currentMushafLayout
const oldStateMushaf = `      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      const [maskedMushafLines, setMaskedMushafLines] = useState(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])); // Lines 0..14`;

const newStateMushaf = `      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      const [maskedMushafLines, setMaskedMushafLines] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])); // Lines 1..15
      const currentMushafLayout = getMushafPageLayout(mushafPageNumber);`;

if (!html.includes(oldStateMushaf)) {
  console.error("Could not find oldStateMushaf in index.html");
  process.exit(1);
}
html = html.replace(oldStateMushaf, newStateMushaf);

// 3. Update Toolbar button and Subbar presets to use currentMushafLayout
const oldToolbarAndSubbar = `                            {/* 5. Interactive Click-to-Mask Lines & Sections (100% Solid Opaque Layers) */}
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

const newToolbarAndSubbar = `                            {/* 5. Interactive Click-to-Mask Lines & Sections (100% Solid Opaque Multi-Layer Architecture) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (mushafOverlayMode === 'interactive_lines') {
                                  setMushafOverlayMode('none');
                                } else {
                                  setMushafOverlayMode('interactive_lines');
                                  setMaskedMushafLines(new Set(currentMushafLayout.lines.map(l => l.id)));
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

                        {/* Interactive Line Masking Sub-bar (Multi-Layer Calibrated Engine) */}
                        {mushafOverlayMode === 'interactive_lines' && (
                          <div className="mb-3 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white border-2 border-gold-400 rounded-2xl p-3 sm:p-4 shadow-md space-y-3 animate-fadeIn">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-400/30 pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gold-300 font-black text-xs sm:text-sm">
                                    🎭 {isRtl ? 'نظام الطبقات المتعددة: طبقة الحجب المصمتة المعايرة هندسياً (حجب كامل دون تسريب):' : 'Multi-Layer Opaque Recall Engine:'}
                                  </span>
                                  <span className="bg-gold-400 text-emerald-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                    {isRtl ? \`\${maskedMushafLines.size} من \${currentMushafLayout.lines.length} سطراً محجوباً\` : \`\${maskedMushafLines.size} / \${currentMushafLayout.lines.length} masked\`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-emerald-200 mt-0.5">
                                  {isRtl 
                                    ? 'كل سطر محجوب بطبقة مصمتة 100% بلون ورق المصحف الأصيل دون قص للكلمات. انقر على أي سطر لكشفه، أو استخدم الأنماط التلقائية أدناه:' 
                                    : 'Calibrated line layers match printed lines with zero text clipping. Tap any line to reveal/mask, or use presets below:'}
                                </p>
                              </div>
                            </div>

                            {/* Preset Masking Modes */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="text-[11px] text-gold-300 font-bold ml-1">{isRtl ? 'أنماط التركيز:' : 'Presets:'}</span>
                              
                              <button
                                type="button"
                                onClick={() => setMaskedMushafLines(new Set(currentMushafLayout.lines.map(l => l.id)))}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                                title="حجب الوجه كاملاً من أول سطر لآخر سطر للتسميع المتدرج"
                              >
                                <span>🔒</span>
                                <span>{isRtl ? \`حجب الوجه كاملاً (\${currentMushafLayout.lines.length} سطر)\` : \`Mask All (\${currentMushafLayout.lines.length})\`}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  // Calibrated alternate lines strictly on Quran verse lines
                                  const altIds = currentMushafLayout.verseLineIds.filter((_, idx) => idx % 2 === 0);
                                  setMaskedMushafLines(new Set(altIds));
                                }}
                                className="px-2.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black rounded-xl transition flex items-center gap-1 shadow-xs"
                                title="حجب سطر وسطر بالضبط على أسطر الآيات لاختبار ربط بدايات ونهايات الأسطر دون قطع الحروف"
                              >
                                <span>🌓</span>
                                <span>{isRtl ? 'حجب تبادلي (سطر وسطر)' : 'Alternate Lines'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const halfLen = Math.ceil(currentMushafLayout.verseLineIds.length / 2);
                                  setMaskedMushafLines(new Set(currentMushafLayout.verseLineIds.slice(0, halfLen)));
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔺</span>
                                <span>{isRtl ? 'حجب النصف الأعلى' : 'Top Half'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const halfLen = Math.floor(currentMushafLayout.verseLineIds.length / 2);
                                  setMaskedMushafLines(new Set(currentMushafLayout.verseLineIds.slice(halfLen)));
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🔻</span>
                                <span>{isRtl ? 'حجب النصف الأسفل' : 'Bottom Half'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const thirdLen = Math.ceil(currentMushafLayout.verseLineIds.length / 3);
                                  setMaskedMushafLines(new Set(currentMushafLayout.verseLineIds.slice(0, thirdLen)));
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث 1' : '1st Third'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const t1 = Math.ceil(currentMushafLayout.verseLineIds.length / 3);
                                  const t2 = Math.ceil(currentMushafLayout.verseLineIds.length * 2 / 3);
                                  setMaskedMushafLines(new Set(currentMushafLayout.verseLineIds.slice(t1, t2)));
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث 2' : '2nd Third'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const t2 = Math.ceil(currentMushafLayout.verseLineIds.length * 2 / 3);
                                  setMaskedMushafLines(new Set(currentMushafLayout.verseLineIds.slice(t2)));
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>📊</span>
                                <span>{isRtl ? 'الثلث 3' : '3rd Third'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...currentMushafLayout.verseLineIds].sort(() => 0.5 - Math.random());
                                  setMaskedMushafLines(new Set(copy.slice(0, Math.min(7, copy.length))));
                                }}
                                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/40 rounded-xl font-bold transition flex items-center gap-1"
                              >
                                <span>🎲</span>
                                <span>{isRtl ? 'حجب عشوائي' : 'Random Lines'}</span>
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

// 4. Update the Overlays rendering to map over currentMushafLayout.lines
const oldOverlays = `                            {/* OVERLAY: 100% Solid Opaque Line Masking Layers (Tap-to-Mask / Tap-to-Reveal) */}
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

const newOverlays = `                            {/* OVERLAY: Multi-Layer Architecture: Calibrated Line Masking Layers (Tap-to-Mask / Tap-to-Reveal) */}
                            {mushafOverlayMode === 'interactive_lines' && (
                              <div className="absolute inset-0 select-none pointer-events-auto" style={{ zIndex: 12 }}>
                                {currentMushafLayout.lines.map(lineItem => {
                                  const isLineMasked = maskedMushafLines.has(lineItem.id);
                                  return (
                                    <div
                                      key={\`mushaf-layer-line-\${lineItem.id}\`}
                                      onClick={() => {
                                        setMaskedMushafLines(prev => {
                                          const next = new Set(prev);
                                          if (next.has(lineItem.id)) next.delete(lineItem.id);
                                          else next.add(lineItem.id);
                                          return next;
                                        });
                                      }}
                                      className={'absolute rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between px-3 sm:px-4 ' + (
                                        isLineMasked
                                          ? 'shadow-xs border-y-2 border-amber-600/70 hover:border-amber-500'
                                          : 'hover:bg-amber-400/20 border border-transparent hover:border-gold-400/40'
                                      )}
                                      style={{
                                        top: lineItem.top + '%',
                                        height: lineItem.height + '%',
                                        left: '2%',
                                        right: '2%',
                                        backgroundColor: isLineMasked ? '#FAF7EE' : 'transparent',
                                        opacity: 1,
                                        zIndex: isLineMasked ? 16 : 13
                                      }}
                                      title={isLineMasked ? (isRtl ? \`\${lineItem.label} محجوب بالكامل — انقر للكشف\` : \`\${lineItem.label} masked — tap to reveal\`) : (isRtl ? \`\${lineItem.label} مكشوف — انقر للحجب\` : \`\${lineItem.label} revealed — tap to mask\`)}
                                    >
                                      {isLineMasked && (
                                        <>
                                          <span className="text-[10px] sm:text-xs font-black text-emerald-950 font-cairo flex items-center gap-1.5 opacity-90 select-none">
                                            <span>🔒</span>
                                            <span>{lineItem.label}</span>
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

// 5. Update Version in Header to v46.0
html = html.replace(/v45\.0/g, 'v46.0');

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully updated index.html to v46.0 with Calibrated Multi-Layer Engine!");

// 6. Update sw.js to mishkah-cache-v46
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/mishkah-cache-v45/g, 'mishkah-cache-v46');
fs.writeFileSync(swPath, sw, 'utf8');
console.log("Successfully updated sw.js to mishkah-cache-v46!");
