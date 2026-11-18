const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Fix CSS for .font-quran in Zoom modal
const oldFontQuranCss = `.font-quran, .font-quran * {
      font-family: 'Amiri Quran', 'Amiri', 'Traditional Arabic', serif !important;
      font-weight: 700 !important;
      color: #021a12 !important;
      line-height: 2.5 !important;
      letter-spacing: 0.03em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }`;

const newFontQuranCss = `.font-quran, .font-quran * {
      font-family: 'Amiri Quran', 'Amiri', 'Traditional Arabic', serif !important;
      font-weight: 700 !important;
      line-height: 2.5 !important;
      letter-spacing: 0.03em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    /* Default dark ink for Quranic text in light paper pages */
    :not(.zoom-quran-box):not(.zoom-quran-gold) > .font-quran,
    :not(.zoom-quran-box):not(.zoom-quran-gold).font-quran {
      color: #021a12;
    }
    .zoom-quran-gold, .zoom-quran-gold * {
      color: #fde68a !important;
      text-shadow: 0 0 25px rgba(245, 158, 11, 0.5);
    }`;

if (html.includes(oldFontQuranCss)) {
  html = html.replace(oldFontQuranCss, newFontQuranCss);
  console.log('Fixed font-quran CSS for Zoom modal contrast');
}

// 2. Remove all '(صحيح)' from option text in SUWAYD_TAJWEED_CURRICULUM
html = html.replace(/ \(صحيح\)/g, '');
console.log('Removed all (صحيح) from quiz options');

// 3. Update Zoom modal word rendering to use zoom-quran-gold class and high-contrast styling
const oldZoomWordRender = `<div className="font-quran text-4xl sm:text-6xl text-gold-200 font-bold py-6 px-4 bg-emerald-900/40 rounded-3xl border border-gold-400/30 shadow-inner">
                                      {example.word}
                                    </div>`;

const newZoomWordRender = `<div className="zoom-quran-box py-8 px-6 bg-gradient-to-b from-emerald-950 to-slate-950 rounded-3xl border-2 border-gold-400/60 shadow-[0_0_40px_rgba(217,119,6,0.25)] my-4">
                                      <div className="font-quran zoom-quran-gold text-5xl sm:text-7xl font-black select-all tracking-wide">
                                        {example.word}
                                      </div>
                                    </div>`;

if (html.includes(oldZoomWordRender)) {
  html = html.replace(oldZoomWordRender, newZoomWordRender);
  console.log('Updated Zoom modal word rendering with golden radiant glow');
}

// 4. Build refined, high-fidelity SVGs for renderSuwaydAnatomySvg
const refinedSvgCode = `
    // Visual Anatomical Cross-Section Renderer inspired by Dr. Ayman Suwayd
    function renderSuwaydAnatomySvg(type) {
      if (type === 'ikhfaa') {
        return (
          <svg viewBox="0 0 420 280" className="w-full h-auto max-h-64 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/40 border border-emerald-300">
            {/* Header Badge */}
            <rect x="20" y="12" width="380" height="28" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
            <text x="210" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#065f46" fontFamily="Cairo">
              مقطع تشريحي: مخرج النون المخفاة — د. أيمن رشدي سويد
            </text>

            {/* Profile Outline (Forehead, Nose, Lips, Chin, Throat) */}
            <path d="M 90 50 Q 80 65 70 95 Q 65 105 50 110 Q 75 115 75 125 Q 60 135 75 145 Q 65 165 80 195 Q 90 220 100 240" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            
            {/* Nasal Cavity (Khayshoom) with Active Amber Glow */}
            <path d="M 85 95 Q 130 80 190 80 Q 240 85 260 120 L 240 120 Q 210 95 165 95 Q 120 95 85 105 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <rect x="145" y="70" width="135" height="20" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <text x="212" y="84" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309" fontFamily="Cairo">
              التجويف الأنفي (الخيشوم)
            </text>

            {/* Golden Resonant Ghunnah Flow from Nose */}
            <g className="animate-pulse">
              <path d="M 160 88 Q 110 88 65 102" fill="none" stroke="#d97706" strokeWidth="4" strokeDasharray="5 3" />
              <polygon points="55,104 68,98 66,108" fill="#d97706" />
              <rect x="15" y="75" width="100" height="22" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
              <text x="65" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309" fontFamily="Cairo">
                صوت الغنة (100%)
              </text>
            </g>

            {/* Hard Palate & Soft Palate */}
            <path d="M 100 125 Q 150 122 200 128 Q 235 138 245 155" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
            <text x="180" y="120" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#334155" fontFamily="Cairo">الحنك الأعلى</text>

            {/* Upper Teeth (Incisors) */}
            <rect x="94" y="125" width="9" height="15" rx="2" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />

            {/* Lower Teeth */}
            <rect x="94" y="160" width="9" height="15" rx="2" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />

            {/* Tongue Body (Clearly Detached from Upper Gum) */}
            <path d="M 116 148 Q 150 160 190 170 Q 230 185 240 215 L 210 225 Q 190 190 150 180 Q 120 170 108 170 Z" fill="#fca5a5" stroke="#e11d48" strokeWidth="2.5" />
            
            {/* The Gap Highlight (No Contact Point) */}
            <circle cx="108" cy="135" r="14" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="122" y1="135" x2="165" y2="148" stroke="#ef4444" strokeWidth="2" />
            <rect x="165" y="140" width="235" height="24" rx="7" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
            <text x="282" y="156" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#991b1b" fontFamily="Cairo">
              تجافي طرف اللسان عن اللثة (عدم التصادم)
            </text>

            {/* Pharynx Airway */}
            <path d="M 245 155 Q 255 190 255 240" fill="none" stroke="#64748b" strokeWidth="3" />
            <rect x="265" y="210" width="135" height="22" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
            <text x="332" y="225" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46" fontFamily="Cairo">
              الفم مهيأ لمخرج التالي
            </text>
          </svg>
        );
      }

      if (type === 'idgham') {
        return (
          <svg viewBox="0 0 420 280" className="w-full h-auto max-h-64 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 border border-amber-300">
            <rect x="20" y="12" width="380" height="28" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="210" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400e" fontFamily="Cairo">
              مقطع تشريحي: ميزان الـ 50% فم و 50% خيشوم — د. أيمن سويد
            </text>

            {/* Profile */}
            <path d="M 90 50 Q 80 65 70 95 Q 65 105 50 110 Q 75 115 75 125 Q 60 135 75 145 Q 65 165 80 195" fill="none" stroke="#64748b" strokeWidth="3" />
            
            {/* Nasal Stream (50% Ghunnah) */}
            <path d="M 90 95 Q 140 82 200 82 Q 240 88 250 120" fill="none" stroke="#d97706" strokeWidth="5" strokeDasharray="5 3" />
            <polygon points="65,102 78,96 76,106" fill="#d97706" />
            <rect x="15" y="80" width="125" height="24" rx="7" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
            <text x="77" y="96" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#92400e" fontFamily="Cairo">
              50% غنة (خيشوم)
            </text>

            {/* Oral Stream (50% Mouth) */}
            <path d="M 230 170 Q 180 145 90 135" fill="none" stroke="#0284c7" strokeWidth="5" strokeDasharray="5 3" />
            <polygon points="65,135 78,130 76,140" fill="#0284c7" />
            <rect x="15" y="125" width="125" height="24" rx="7" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
            <text x="77" y="141" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0369a1" fontFamily="Cairo">
              50% صوت فموي (ي، و)
            </text>

            {/* Palate & Lips */}
            <path d="M 100 125 Q 150 122 200 128" fill="none" stroke="#475569" strokeWidth="5" />
            <circle cx="76" cy="132" r="9" fill="none" stroke="#d97706" strokeWidth="2.5" />
            <rect x="160" y="180" width="240" height="24" rx="7" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
            <text x="280" y="196" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#065f46" fontFamily="Cairo">
              استدارة الشفتين (و) أو تسفل الفك (ي)
            </text>

            {/* Tongue Body */}
            <path d="M 120 150 Q 165 140 215 175" fill="none" stroke="#f43f5e" strokeWidth="9" strokeLinecap="round" />
          </svg>
        );
      }

      if (type === 'izhar') {
        return (
          <svg viewBox="0 0 420 280" className="w-full h-auto max-h-64 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-teal-50/70 via-white to-teal-50/40 border border-teal-300">
            <rect x="20" y="12" width="380" height="28" rx="8" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.2" />
            <text x="210" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#115e59" fontFamily="Cairo">
              مقطع تشريحي: قرع طرف اللسان للثة في الإظهار — د. أيمن سويد
            </text>

            <path d="M 90 50 Q 80 65 70 95 Q 65 105 50 110 Q 75 115 75 125 Q 60 135 75 145 Q 65 165 80 195" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 100 125 Q 150 122 210 128" fill="none" stroke="#475569" strokeWidth="5" />
            
            {/* Firm Tongue Contact Point at Gum */}
            <rect x="96" y="125" width="8" height="15" rx="2" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
            <path d="M 104 130 Q 135 145 195 160 L 185 180 Q 135 165 104 150 Z" fill="#fca5a5" stroke="#e11d48" strokeWidth="2.5" />
            <circle cx="104" cy="130" r="10" fill="#10b981" opacity="0.4" />
            <circle cx="104" cy="130" r="5" fill="#047857" />
            
            <rect x="140" y="80" width="260" height="26" rx="7" fill="#d1fae5" stroke="#059669" strokeWidth="1.2" />
            <text x="270" y="97" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#065f46" fontFamily="Cairo">
              قرع طرف اللسان للثة العليا بثبات (بينية النون)
            </text>

            {/* Throat Articulation Arrow below */}
            <g transform="translate(160, 160)">
              <rect x="0" y="0" width="240" height="48" rx="8" fill="#f0fdfa" stroke="#0d9488" strokeWidth="1.2" />
              <text x="120" y="20" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0f766e" fontFamily="Cairo">
                خروج حرف الحلق بعد النون مباشرة
              </text>
              <text x="120" y="38" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#115e59" fontFamily="Cairo">
                (همز، هاء، عين، حاء، غين، خاء) دون سكت
              </text>
            </g>
          </svg>
        );
      }

      if (type === 'qalqalah') {
        return (
          <svg viewBox="0 0 420 280" className="w-full h-auto max-h-64 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-rose-50/70 via-white to-rose-50/40 border border-rose-300">
            <rect x="20" y="12" width="380" height="28" rx="8" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.2" />
            <text x="210" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9f1239" fontFamily="Cairo">
              مقطع تشريحي: التباعد الميكانيكي السريع للقلقلة — د. أيمن سويد
            </text>

            {/* Lock Phase vs Burst Rebound */}
            <g transform="translate(20, 55)">
              <rect x="0" y="0" width="180" height="190" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="90" y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569" fontFamily="Cairo">
                1. مرحلة القفل (الانحباس)
              </text>
              <circle cx="90" cy="90" r="28" fill="#ef4444" opacity="0.15" />
              <line x1="50" y1="90" x2="130" y2="90" stroke="#b91c1c" strokeWidth="8" strokeLinecap="round" />
              <text x="90" y="145" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#b91c1c" fontFamily="Cairo">
                انحباس الصوت (الشدة)
              </text>
              <text x="90" y="165" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#b91c1c" fontFamily="Cairo">
                وانحباس النفس (الجهر)
              </text>
            </g>

            <g transform="translate(220, 55)">
              <rect x="0" y="0" width="180" height="190" rx="16" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2" />
              <text x="90" y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9f1239" fontFamily="Cairo">
                2. مرحلة التباعد (النبرة)
              </text>
              {/* Explosive Wave */}
              <circle cx="90" cy="90" r="36" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="90" cy="90" r="18" fill="#f43f5e" />
              <path d="M 65 72 L 48 55 M 115 72 L 132 55 M 65 108 L 48 125 M 115 108 L 132 125" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
              <text x="90" y="145" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#881337" fontFamily="Cairo">
                تباعد مخرجي ارتدادي
              </text>
              <text x="90" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#be123c" fontFamily="Cairo">
                (دون شائبة حركة فتح/ضم/كسر)
              </text>
            </g>
          </svg>
        );
      }

      if (type === 'madd') {
        return (
          <svg viewBox="0 0 420 280" className="w-full h-auto max-h-64 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-sky-50/70 via-white to-sky-50/40 border border-sky-300">
            <rect x="20" y="12" width="380" height="28" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
            <text x="210" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#075985" fontFamily="Cairo">
              مقطع تشريحي: امتداد الصوت في خلاء الجوف — د. أيمن سويد
            </text>

            {/* Waveform timeline from 2 to 6 counts */}
            <g transform="translate(20, 60)">
              <rect x="0" y="0" width="380" height="135" rx="16" fill="#ffffff" stroke="#bae6fd" strokeWidth="2" />
              
              {/* Timeline ticks */}
              <line x1="30" y1="95" x2="350" y2="95" stroke="#94a3b8" strokeWidth="2.5" />
              
              <circle cx="65" cy="95" r="7" fill="#0284c7" />
              <text x="65" y="120" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0369a1" fontFamily="Cairo">حركتان (قصر)</text>
              
              <circle cx="190" cy="95" r="8" fill="#d97706" />
              <text x="190" y="120" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#b45309" fontFamily="Cairo">4 حركات (توسط)</text>

              <circle cx="315" cy="95" r="9" fill="#dc2626" />
              <text x="315" y="120" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#991b1b" fontFamily="Cairo">6 حركات (لازم)</text>

              {/* Sine Wave */}
              <path d="M 25 50 Q 55 15 85 50 T 145 50 T 205 50 T 265 50 T 325 50 T 365 50" fill="none" stroke="#0284c7" strokeWidth="3.5" />
            </g>
            <rect x="30" y="215" width="360" height="26" rx="7" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
            <text x="210" y="232" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#0369a1" fontFamily="Cairo">
              خلاء الفم والحلق يجري فيه الصوت مرناً دون عائق ولا ضغط
            </text>
          </svg>
        );
      }

      // Default: Shafatan (Lips)
      return (
        <svg viewBox="0 0 420 280" className="w-full h-auto max-h-64 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-purple-50/70 via-white to-purple-50/40 border border-purple-300">
          <rect x="20" y="12" width="380" height="28" rx="8" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1.2" />
          <text x="210" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6b21a8" fontFamily="Cairo">
            مقطع تشريحي: انطباق الشفتين في الميم والباء — د. أيمن سويد
          </text>

          <g transform="translate(30, 55)">
            <rect x="0" y="0" width="360" height="150" rx="16" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
            
            {/* Upper Lip */}
            <path d="M 90 55 Q 180 42 270 55 Q 180 68 90 55 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2.5" />
            
            {/* Lower Lip */}
            <path d="M 90 95 Q 180 108 270 95 Q 180 82 90 95 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2.5" />
            
            {/* Soft seal line */}
            <line x1="95" y1="75" x2="265" y2="75" stroke="#be185d" strokeWidth="5" strokeLinecap="round" />
            
            <text x="180" y="132" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#831843" fontFamily="Cairo">
              انطباق لطيف للشفتين دون كز (الإخفاء الشفوي للميم)
            </text>
          </g>
          <rect x="50" y="222" width="320" height="24" rx="7" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1" />
          <text x="210" y="238" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#6b21a8" fontFamily="Cairo">
            جريان الغنة الرخيمة بالتوازي من الخيشوم
          </text>
        </svg>
      );
    }
`;

// Replace renderSuwaydAnatomySvg in index.html
const startSvg = "    // Visual Anatomical Cross-Section Renderer inspired by Dr. Ayman Suwayd";
const endSvg = "    // Main Application Component";
const idxStart = html.indexOf(startSvg);
const idxEnd = html.indexOf(endSvg);

if (idxStart !== -1 && idxEnd !== -1) {
  html = html.substring(0, idxStart) + refinedSvgCode.trim() + '\n\n' + html.substring(idxEnd);
  console.log('Replaced renderSuwaydAnatomySvg with high-fidelity vector diagrams');
} else {
  console.error('Could not locate renderSuwaydAnatomySvg', { idxStart, idxEnd });
  process.exit(1);
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully refined visuals in public/index.html!');
