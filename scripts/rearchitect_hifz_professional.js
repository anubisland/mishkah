const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const swPath = path.join(__dirname, '..', 'public', 'sw.js');

let html = fs.readFileSync(indexPath, 'utf8');
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Default hifzViewMode to 'interactive_test' (The Digital Lines Recitation Board)
html = html.replace(
  `const [hifzViewMode, setHifzViewMode] = useState('mushaf_page'); // 'mushaf_page' | 'interactive_test'`,
  `const [hifzViewMode, setHifzViewMode] = useState('interactive_test'); // 'interactive_test' (Digital Lines Board) | 'mushaf_page' (Printed Image)`
);

// In navigate page: preserve hifzViewMode instead of forcing mushaf_page
html = html.replace(
  `        setHifzViewMode('mushaf_page');\n\n        // 1. Check if in preloaded passages`,
  `        // Preserve user selected view mode (digital lines or mushaf page)\n        // 1. Check if in preloaded passages`
);

// 2. Default activeIslamicStage to 2 if islamicData exists
html = html.replace(
  `const [activeIslamicStage, setActiveIslamicStage] = useState(1); // 1, 2, 3, 4, 5, 6`,
  `const [activeIslamicStage, setActiveIslamicStage] = useState(() => (localStorage.getItem('mishkah_active_islamic_data') ? 2 : 1)); // 1 to 6`
);

// 3. Remove the floating 15-boxes overlay and sub-bar from the Mushaf page image mode entirely
// Let's find where mushafOverlayMode === 'interactive_lines' is rendered on the page image
const oldInteractiveLinesOverlay = `                            {/* OVERLAY: Multi-Layer Architecture: Calibrated Line Masking Layers (Tap-to-Mask / Tap-to-Reveal) */}
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

if (html.includes(oldInteractiveLinesOverlay)) {
  html = html.replace(oldInteractiveLinesOverlay, '');
}

// 4. In the Mushaf Page image toolbar, remove the interactive lines button & subbar, and keep only Ruler, Bottom Half, Top Half, Spotlight
const subbarStart = html.indexOf('{/* Interactive Line Masking Sub-bar (Multi-Layer Calibrated Engine) */}');
const subbarEnd = html.indexOf('{/* Interactive Ruler Controls (When ruler or spotlight active) */}');

if (subbarStart !== -1 && subbarEnd !== -1) {
  html = html.substring(0, subbarStart) + html.substring(subbarEnd);
}

// Remove the tap-to-mask button from the page toolbar
const oldTapButton = `                            {/* 5. Interactive Click-to-Mask Lines & Sections (100% Solid Opaque Multi-Layer Architecture) */}
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
                            </button>`;

if (html.includes(oldTapButton)) {
  html = html.replace(oldTapButton, '');
}

// 5. Add the Top View Switcher right after Hifz Header Banner so user can toggle between:
// [ 📜 لوحة التسميع بالأسطر والآيات الرقمية ] and [ 📖 عرض وجه المصحف الورقي الشريف ]
const oldHifzHeaderEnd = `                    {/* Authentic Mushaf Page Header Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-800/80">
                      <div className="inline-flex items-center gap-2 bg-emerald-950/90 text-gold-300 px-4 py-2 rounded-2xl border border-gold-400/60 shadow-md text-xs sm:text-sm font-black">
                        <span>📖</span>
                        <span>{isRtl ? 'لوحة التسميع المباشرة على صفحة مصحف المدينة الورقي الشريف (15 سطراً)' : 'Authentic 15-Line Madinah Mushaf Page'}</span>
                      </div>`;

const newHifzHeaderEnd = `                    {/* Authentic Mode Switcher Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-800/80">
                      <div className="bg-emerald-950 p-1.5 rounded-2xl border-2 border-gold-400 flex items-center gap-2 shadow-lg">
                        <button
                          type="button"
                          onClick={() => setHifzViewMode('interactive_test')}
                          className={'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ' + (
                            hifzViewMode === 'interactive_test'
                              ? 'bg-gold-500 text-emerald-950 shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:bg-emerald-900/60'
                          )}
                        >
                          <span>📜</span>
                          <span>{isRtl ? 'لوحة التسميع بالأسطر والآيات (الأسطر المتقنة)' : 'Digital Line Recitation Board'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHifzViewMode('mushaf_page')}
                          className={'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ' + (
                            hifzViewMode === 'mushaf_page'
                              ? 'bg-gold-500 text-emerald-950 shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:bg-emerald-900/60'
                          )}
                        >
                          <span>📖</span>
                          <span>{isRtl ? 'عرض وجه المصحف الورقي المصور' : 'Printed Mushaf Page Image'}</span>
                        </button>
                      </div>`;

if (html.includes(oldHifzHeaderEnd)) {
  html = html.replace(oldHifzHeaderEnd, newHifzHeaderEnd);
}

// 6. Make Mushaf Page image render ONLY when hifzViewMode === 'mushaf_page'
html = html.replace(
  `{/* ================= AUTHENTIC PRINTED MADINAH MUSHAF PAGE ================= */}\n                {(true) && (`,
  `{/* ================= AUTHENTIC PRINTED MADINAH MUSHAF PAGE ================= */}\n                {hifzViewMode === 'mushaf_page' && (`
);

// 7. Make Digital Recitation Board render when hifzViewMode === 'interactive_test'
html = html.replace(
  `{/* ================= MODULE B: INTERACTIVE HIFZ TEST ENGINE ================= */}\n                {(false) && (`,
  `{/* ================= MODULE B: INTERACTIVE HIFZ TEST ENGINE ================= */}\n                {hifzViewMode === 'interactive_test' && (`
);

// Also check if it's already there
if (html.includes(`{/* ================= MODULE B: INTERACTIVE HIFZ TEST ENGINE ================= */}`)) {
  html = html.replace(
    /\{\/\* ================= MODULE B: INTERACTIVE HIFZ TEST ENGINE ================= \*\/\}\s*\{(\(false\)|false)\s*&&\s*\(/g,
    `{/* ================= MODULE B: INTERACTIVE HIFZ TEST ENGINE ================= */}\n                {hifzViewMode === 'interactive_test' && (`
  );
}

// 8. In the Digital Recitation Board, add "حجب تبادلي (سطر وسطر)" button to the testing buttons
const oldAltClozeButton = `                        {/* 4. Alternating 50% Cloze (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsAlternatingMasked(!isAlternatingMasked)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isAlternatingMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'إخفاء كلمة وترك كلمة لتحفيز اليقظة العقلية الفائقة' : 'Alternating 50% Cloze'}
                        >
                          <span className="text-base">🏁</span>
                          <span>{isRtl ? (isAlternatingMasked ? 'إلغاء التظليل' : 'تظليل تبادلي 50%') : 'Cloze 50%'}</span>
                        </button>`;

const newAltLineAndCloze = `                        {/* 4. Alternating Lines (Line by Line) */}
                        <button
                          type="button"
                          onClick={() => {
                            if (passageMaskedAyahs.size > 0 && passageTestSection === 'alternate_lines') {
                              setPassageTestSection('none');
                              setPassageMaskedAyahs(new Set());
                            } else {
                              const altNums = hifzAyahs.filter((_, idx) => idx % 2 === 1).map(a => a.num);
                              setPassageTestSection('alternate_lines');
                              setPassageMaskedAyahs(new Set(altNums));
                            }
                          }}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            passageTestSection === 'alternate_lines'
                              ? 'bg-gold-500 text-emerald-950 border-gold-600 ring-2 ring-gold-400 font-black shadow-md'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'حجب سطر وسطر بدقة 100% دون أي تقطيع في الحروف' : 'Alternate Lines'}
                        >
                          <span className="text-base">🌓</span>
                          <span>{isRtl ? (passageTestSection === 'alternate_lines' ? 'إلغاء سطر وسطر' : 'حجب سطر وسطر') : 'Alternate Lines'}</span>
                        </button>

                        {/* 4b. Alternating 50% Cloze */}
                        <button
                          type="button"
                          onClick={() => setIsAlternatingMasked(!isAlternatingMasked)}
                          className={\`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs \${
                            isAlternatingMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }\`}
                          title={isRtl ? 'إخفاء كلمة وترك كلمة لتحفيز اليقظة العقلية الفائقة' : 'Alternating 50% Cloze'}
                        >
                          <span className="text-base">🏁</span>
                          <span>{isRtl ? (isAlternatingMasked ? 'إلغاء التظليل' : 'تظليل تبادلي 50%') : 'Cloze 50%'}</span>
                        </button>`;

if (html.includes(oldAltClozeButton)) {
  html = html.replace(oldAltClozeButton, newAltLineAndCloze);
}

// 9. Bump version to v48.0
html = html.replace(/v47\.0/g, 'v48.0');

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully updated index.html to v48.0 with Professional Rearchitected Hifz Board!");

// 10. Update sw.js to mishkah-cache-v48
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/mishkah-cache-v47/g, 'mishkah-cache-v48');
fs.writeFileSync(swPath, sw, 'utf8');
console.log("Successfully updated sw.js to mishkah-cache-v48!");
