const fs = require('fs');

const curriculumCode = fs.readFileSync('scripts/suwayd_curriculum_code.js', 'utf8');

// SVG Generator function in React JSX
const svgComponentCode = `
    // Visual Anatomical Cross-Section Renderer inspired by Dr. Ayman Suwayd
    function renderSuwaydAnatomySvg(type) {
      if (type === 'ikhfaa') {
        return (
          <svg viewBox="0 0 400 260" className="w-full h-auto max-h-56 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200">
            {/* Title Badge */}
            <rect x="12" y="10" width="220" height="24" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
            <text x="22" y="26" fontSize="11" fontWeight="bold" fill="#065f46" fontFamily="Cairo">مقطع تشريحي: وضع الفم واللسان في الإخفاء</text>

            {/* Profile Outline (Nose, Lips, Chin, Throat) */}
            <path d="M 120 40 Q 110 50 100 80 Q 95 90 85 95 Q 105 100 105 110 Q 90 120 105 130 Q 95 150 110 180 Q 120 200 130 220" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            
            {/* Nasal Cavity (Khayshoom) with Active Glow */}
            <path d="M 115 80 Q 150 65 210 65 Q 260 70 280 110 L 260 110 Q 230 85 180 85 Q 140 85 115 95 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <text x="180" y="80" fontSize="10" fontWeight="bold" fill="#b45309" fontFamily="Cairo">التجويف الأنفي (الخيشوم)</text>

            {/* Golden Resonant Ghunnah Arrows Emitting from Nose */}
            <g className="animate-pulse">
              <path d="M 170 75 Q 130 75 95 88" fill="none" stroke="#d97706" strokeWidth="3.5" strokeDasharray="4 2" />
              <polygon points="90,89 100,84 98,94" fill="#d97706" />
              <text x="30" y="84" fontSize="10" fontWeight="bold" fill="#b45309" fontFamily="Cairo">صوت الغنة (100%)</text>
            </g>

            {/* Hard & Soft Palate */}
            <path d="M 130 112 Q 180 110 230 115 Q 265 125 270 145" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <text x="210" y="108" fontSize="9" fill="#475569" fontFamily="Cairo">الحنك الأعلى</text>

            {/* Upper Incisors (Teeth) */}
            <rect x="125" y="112" width="8" height="14" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />

            {/* Lower Incisors */}
            <rect x="125" y="145" width="8" height="14" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />

            {/* Tongue (Detached from Upper Gum with Clear Gap) */}
            <path d="M 145 132 Q 180 145 220 155 Q 260 170 270 200 L 240 210 Q 220 175 180 165 Q 150 155 135 155 Z" fill="#fca5a5" stroke="#e11d48" strokeWidth="2.5" />
            
            {/* The Critical Gap Callout (No Contact) */}
            <circle cx="136" cy="120" r="12" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="148" y1="120" x2="190" y2="135" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="190" y="125" width="180" height="20" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
            <text x="195" y="139" fontSize="9.5" fontWeight="bold" fill="#991b1b" fontFamily="Cairo">تجافي طرف اللسان عن اللثة (لا يلتصق)</text>

            {/* Pharynx & Airway */}
            <path d="M 270 145 Q 280 180 280 230" fill="none" stroke="#64748b" strokeWidth="3" />
          </svg>
        );
      }

      if (type === 'idgham') {
        return (
          <svg viewBox="0 0 400 260" className="w-full h-auto max-h-56 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200">
            <rect x="12" y="10" width="220" height="24" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
            <text x="22" y="26" fontSize="11" fontWeight="bold" fill="#92400e" fontFamily="Cairo">مقطع تشريحي: ميزان الـ 50% فم و 50% أنف</text>

            {/* Profile */}
            <path d="M 120 40 Q 110 50 100 80 Q 95 90 85 95 Q 105 100 105 110 Q 90 120 105 130 Q 95 150 110 180" fill="none" stroke="#64748b" strokeWidth="3" />
            
            {/* Nasal Stream (50% Ghunnah) */}
            <path d="M 120 80 Q 160 70 220 70 Q 260 75 270 110" fill="none" stroke="#d97706" strokeWidth="5" strokeDasharray="4 2" />
            <polygon points="95,88 108,82 105,92" fill="#d97706" />
            <rect x="25" y="75" width="90" height="20" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <text x="30" y="89" fontSize="10" fontWeight="bold" fill="#92400e" fontFamily="Cairo">50% غنة (خيشوم)</text>

            {/* Oral Stream (50% Waw/Yaa) */}
            <path d="M 250 160 Q 200 135 110 125" fill="none" stroke="#0284c7" strokeWidth="5" strokeDasharray="4 2" />
            <polygon points="95,125 108,120 106,130" fill="#0284c7" />
            <rect x="25" y="115" width="90" height="20" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
            <text x="30" y="129" fontSize="10" fontWeight="bold" fill="#0369a1" fontFamily="Cairo">50% صوت فموي</text>

            {/* Palate & Rounded Lips */}
            <path d="M 130 112 Q 180 110 230 115" fill="none" stroke="#94a3b8" strokeWidth="5" />
            <circle cx="103" cy="122" r="8" fill="none" stroke="#d97706" strokeWidth="2.5" />
            <text x="120" y="170" fontSize="10" fontWeight="bold" fill="#065f46" fontFamily="Cairo">استدارة الشفتين (و) أو تسفل الفك (ي)</text>

            {/* Tongue Body */}
            <path d="M 145 140 Q 190 130 240 165" fill="none" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      }

      if (type === 'izhar') {
        return (
          <svg viewBox="0 0 400 260" className="w-full h-auto max-h-56 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-teal-50/60 to-white border border-teal-200">
            <rect x="12" y="10" width="230" height="24" rx="8" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1" />
            <text x="22" y="26" fontSize="11" fontWeight="bold" fill="#115e59" fontFamily="Cairo">مقطع تشريحي: قرع طرف اللسان للثة في النون</text>

            <path d="M 120 40 Q 110 50 100 80 Q 95 90 85 95 Q 105 100 105 110 Q 90 120 105 130 Q 95 150 110 180" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 130 112 Q 180 110 240 115" fill="none" stroke="#94a3b8" strokeWidth="5" />
            
            {/* Firm Tongue Contact Point */}
            <rect x="126" y="112" width="7" height="14" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
            <path d="M 132 118 Q 160 135 220 150 L 210 170 Q 160 155 132 140 Z" fill="#fca5a5" stroke="#e11d48" strokeWidth="2" />
            <circle cx="132" cy="118" r="8" fill="#10b981" opacity="0.4" />
            <circle cx="132" cy="118" r="4" fill="#047857" />
            
            <rect x="160" y="80" width="180" height="22" rx="6" fill="#d1fae5" stroke="#059669" strokeWidth="1" />
            <text x="165" y="95" fontSize="10" fontWeight="bold" fill="#065f46" fontFamily="Cairo">قرع طرف اللسان للثة العليا (بينية النون)</text>

            {/* Throat Articulation Arrow below */}
            <path d="M 230 180 L 230 220" stroke="#0d9488" strokeWidth="3" markerEnd="url(#arrow)" />
            <rect x="170" y="200" width="160" height="20" rx="6" fill="#f0fdfa" stroke="#0d9488" strokeWidth="1" />
            <text x="175" y="214" fontSize="9.5" fontWeight="bold" fill="#0f766e" fontFamily="Cairo">ثم خروج حرف الحلق دون سكت</text>
          </svg>
        );
      }

      if (type === 'qalqalah') {
        return (
          <svg viewBox="0 0 400 260" className="w-full h-auto max-h-56 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border border-rose-200">
            <rect x="12" y="10" width="240" height="24" rx="8" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1" />
            <text x="22" y="26" fontSize="11" fontWeight="bold" fill="#9f1239" fontFamily="Cairo">مقطع تشريحي: التباعد الميكانيكي السريع للقلقلة</text>

            {/* Lock Phase vs Burst Rebound */}
            <g transform="translate(40, 50)">
              <rect x="10" y="10" width="140" height="150" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="25" y="32" fontSize="11" fontWeight="bold" fill="#475569" fontFamily="Cairo">1. مرحلة القفل (انحباس)</text>
              <circle cx="80" cy="85" r="22" fill="#ef4444" opacity="0.2" />
              <line x1="50" y1="85" x2="110" y2="85" stroke="#b91c1c" strokeWidth="6" strokeLinecap="round" />
              <text x="35" y="130" fontSize="9.5" fontWeight="bold" fill="#b91c1c" fontFamily="Cairo">انحباس الصوت والنفس معاً</text>
            </g>

            <g transform="translate(210, 50)">
              <rect x="10" y="10" width="140" height="150" rx="16" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2" />
              <text x="20" y="32" fontSize="11" fontWeight="bold" fill="#9f1239" fontFamily="Cairo">2. مرحلة التباعد (نبرة القلقلة)</text>
              {/* Explosive Wave */}
              <circle cx="80" cy="85" r="32" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="3 3" className="animate-ping" />
              <circle cx="80" cy="85" r="16" fill="#f43f5e" />
              <path d="M 60 70 L 45 55 M 100 70 L 115 55 M 60 100 L 45 115 M 100 100 L 115 115" stroke="#e11d48" strokeWidth="3" />
              <text x="25" y="130" fontSize="9.5" fontWeight="bold" fill="#881337" fontFamily="Cairo">تباعد مخرجي دون شائبة حركة</text>
            </g>
          </svg>
        );
      }

      if (type === 'madd') {
        return (
          <svg viewBox="0 0 400 260" className="w-full h-auto max-h-56 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-sky-50/60 to-white border border-sky-200">
            <rect x="12" y="10" width="240" height="24" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
            <text x="22" y="26" fontSize="11" fontWeight="bold" fill="#075985" fontFamily="Cairo">مقطع تشريحي: امتداد الصوت في خلاء الجوف</text>

            {/* Waveform timeline from 2 to 6 counts */}
            <g transform="translate(30, 60)">
              <rect x="0" y="0" width="340" height="120" rx="16" fill="#ffffff" stroke="#bae6fd" strokeWidth="2" />
              
              {/* Timeline ticks */}
              <line x1="30" y1="90" x2="310" y2="90" stroke="#94a3b8" strokeWidth="2" />
              
              <circle cx="60" cy="90" r="5" fill="#0284c7" />
              <text x="45" y="110" fontSize="10" fontWeight="bold" fill="#0369a1" fontFamily="Cairo">حركتان (قصر)</text>
              
              <circle cx="160" cy="90" r="6" fill="#d97706" />
              <text x="140" y="110" fontSize="10" fontWeight="bold" fill="#b45309" fontFamily="Cairo">4 حركات (توسط)</text>

              <circle cx="270" cy="90" r="7" fill="#dc2626" />
              <text x="245" y="110" fontSize="10" fontWeight="bold" fill="#991b1b" fontFamily="Cairo">6 حركات (لازم)</text>

              {/* Sine Wave */}
              <path d="M 20 50 Q 40 20 60 50 T 100 50 T 140 50 T 180 50 T 220 50 T 260 50 T 300 50" fill="none" stroke="#0284c7" strokeWidth="3" />
            </g>
            <text x="40" y="215" fontSize="10.5" fontWeight="bold" fill="#0369a1" fontFamily="Cairo">خلاء الفم والحلق يجري فيه الصوت دون عائق ولا ضغط</text>
          </svg>
        );
      }

      // Default: Shafatan (Lips)
      return (
        <svg viewBox="0 0 400 260" className="w-full h-auto max-h-56 drop-shadow-md select-none rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-200">
          <rect x="12" y="10" width="220" height="24" rx="8" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1" />
          <text x="22" y="26" fontSize="11" fontWeight="bold" fill="#6b21a8" fontFamily="Cairo">مقطع تشريحي: انطباق الشفتين في الميم والباء</text>

          <g transform="translate(60, 50)">
            <rect x="0" y="0" width="280" height="140" rx="16" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />
            
            {/* Upper Lip */}
            <path d="M 60 55 Q 140 45 220 55 Q 140 68 60 55 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
            
            {/* Lower Lip */}
            <path d="M 60 85 Q 140 95 220 85 Q 140 72 60 85 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
            
            {/* Soft seal line */}
            <line x1="65" y1="70" x2="215" y2="70" stroke="#be185d" strokeWidth="4" strokeLinecap="round" />
            
            <text x="65" y="125" fontSize="10.5" fontWeight="bold" fill="#831843" fontFamily="Cairo">انطباق لطيف للشفتين دون كز (الإخفاء الشفوي للميم)</text>
          </g>
        </svg>
      );
    }
`;

fs.writeFileSync('scripts/suwayd_svg_code.js', svgComponentCode, 'utf8');
console.log('Saved scripts/suwayd_svg_code.js');
