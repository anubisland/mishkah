const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add MAKHAARIJ_GENERAL_DATA if not present
if (!html.includes('MAKHAARIJ_GENERAL_DATA')) {
  const dataInsertMarker = 'const PRELOADED_TEXTBOOKS = [';
  const makhaarijDataCode = `const MAKHAARIJ_GENERAL_DATA = [
    {
      id: 'jawf',
      nameAr: 'الجوف',
      nameEn: 'Al-Jawf (Oral & Throat Cavity)',
      icon: '🌬️',
      organAr: 'الخلاء الممتد داخل الحلق والفم',
      organEn: 'The open internal airway of throat and mouth',
      letters: ['ا', 'و', 'ي'],
      lettersLabelAr: 'حروف المد الثلاثة (الألف الساكنة بعد فتح، الواو الساكنة بعد ضم، الياء الساكنة بعد كسر)',
      lettersLabelEn: '3 Madd letters (Alif preceded by Fathah, Waw by Dammah, Yaa by Kasrah)',
      mannerAr: 'تخرج بامتداد الصوت في الهواء دون انحباس أو احتكاك في أي نقطة من الفم، وتتبع ما قبلها تفخيماً وترقيقاً.',
      mannerEn: 'Sound extends freely through the oral cavity without obstruction, matching adjacent vowel weight.',
      commonMistakesAr: 'تسريب صوت الغنة من الأنف في حروف المد، أو تقصير زمن المد عن حركتين كاملتين.',
      commonMistakesEn: 'Nasal leakage (Ghunnah) into vowels, or rushing duration under 2 full counts.',
      badge: '3 حروف مدية',
      colorBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      activeColor: 'bg-emerald-700 text-white'
    },
    {
      id: 'halq',
      nameAr: 'الحلق',
      nameEn: 'Al-Halq (The Throat)',
      icon: '🧣',
      organAr: 'منطقة الحلق وتنقسم إلى 3 مخارج خاصة',
      organEn: 'Pharyngeal throat region, divided into 3 articulation zones',
      letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
      lettersLabelAr: 'أقصى الحلق (ء، هـ) | وسط الحلق (ع، ح) | أدنى الحلق (غ، خ)',
      lettersLabelEn: 'Deep throat (Hamzah, Haa) | Mid throat (Ayn, Haa) | Upper throat (Ghayn, Khaa)',
      mannerAr: 'تخرج حروف الإظهار الحلقي الستة بمرور الهواء في الحلق بدون غنة ولا تمطيط.',
      mannerEn: 'Pronounced with crisp Izhar (clarity) as airstream passes through the respective throat depths.',
      commonMistakesAr: 'نطق العين من الصدر بدل وسط الحلق، أو كتم صوت الغين والخاء، أو تفخيم الحاء.',
      commonMistakesEn: 'Emitting Ayn from the chest instead of epiglottis, or over-constricting Haa.',
      badge: '6 حروف إظهار حلقي',
      colorBg: 'bg-amber-50 border-amber-300 text-amber-950',
      activeColor: 'bg-amber-700 text-white'
    },
    {
      id: 'lisan',
      nameAr: 'اللسان',
      nameEn: 'Al-Lisaan (The Tongue)',
      icon: '👅',
      organAr: 'أعظم المخارج حجماً وفيه 10 مخارج خاصة لـ 18 حرفاً',
      organEn: 'Largest articulation organ with 10 specific zones for 18 letters',
      letters: ['ق', 'ك', 'ج', 'ش', 'ي', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'س', 'ز', 'ظ', 'ذ', 'ث'],
      lettersLabelAr: 'أقصى اللسان (ق، ك) | وسطه (ج، ش، ي) | حافتاه (ض، ل) | طرفه ورأسه (11 حرفاً)',
      lettersLabelEn: 'Back (Qaf, Kaf) | Middle (Jeem, Sheen, Yaa) | Edges (Dad, Lam) | Tip & Blade (11 letters)',
      mannerAr: 'يتحرك اللسان بملامسة الحنك العظمي واللحمي أو أصول الأسنان ولثتها بدقة هندسية بالغة.',
      mannerEn: 'Tongue interfaces against hard/soft palate, alveolar ridge, or teeth roots with micro-precision.',
      commonMistakesAr: 'خلط الضاد بالظاء، أو همس الجيم، أو تحويل القاف إلى همزة أو كاف عامية.',
      commonMistakesEn: 'Confusing Dad with Zaa, adding breath to Jeem, or softening Qaf to glottal stop.',
      badge: '18 حرفاً (10 مخارج)',
      colorBg: 'bg-teal-50 border-teal-300 text-teal-950',
      activeColor: 'bg-teal-700 text-white'
    },
    {
      id: 'shafatan',
      nameAr: 'الشفتان',
      nameEn: 'Ash-Shafataan (The Two Lips)',
      icon: '👄',
      organAr: 'مخرجان خاصان لأربعة أحرف',
      organEn: 'Two sub-points producing 4 distinct letters',
      letters: ['ف', 'ب', 'م', 'و'],
      lettersLabelAr: 'بطن الشفة السفلى مع الثنايا العليا (ف) | انطباق الشفتين (ب، م) | استدارة الشفتين وضمهما (و)',
      lettersLabelEn: 'Lower lip to upper teeth (Faa) | Lip closure (Baa, Meem) | Lip rounding (Waw)',
      mannerAr: 'الفاء باحتكاك خفيف، والباء بانطباق قوي يتبعه قلقلة إن سكنت، والميم بانطباق لطيف مع غنة، والواو باستدارة.',
      mannerEn: 'Faa by friction; Baa with firm closure; Meem with soft closure + Ghunnah; Waw by lip rounding.',
      commonMistakesAr: 'كز الشفتين وضغطهما بقوة مفرطة عند نطق الميم والواو، أو قلقلة الميم الساكنة.',
      commonMistakesEn: 'Over-tightening lips on Meem or Waw, or bouncing unvoweled Meem.',
      badge: '4 حروف شفوية',
      colorBg: 'bg-sky-50 border-sky-300 text-sky-950',
      activeColor: 'bg-sky-700 text-white'
    },
    {
      id: 'khayshoom',
      nameAr: 'الخيشوم',
      nameEn: 'Al-Khayshoom (Nasal Cavity)',
      icon: '👃',
      organAr: 'التجويف الأنفي الداخلي الممتد فوق سقف الحنك',
      organEn: 'The upper nasal chamber extending above the hard palate',
      letters: ['الغنة (ن، م)'],
      lettersLabelAr: 'مخرج صوت الغنة الرخيم المركب في جسم حرفي النون والميم في سائر أحوالهما',
      lettersLabelEn: 'The resonant Ghunnah sound inherent in Noon and Meem across all conditions',
      mannerAr: 'ينسحب تيار الهواء من الرئتين ماراً بالتجويف الأنفي ليعطي رنيناً صوتياً شجياً مقداره حركتان.',
      mannerEn: 'Air stream resonates smoothly through nasal airway producing a sweet 2-count nasalization.',
      commonMistakesAr: 'بتر زمن الغنة قبل استيفاء الحركتين، أو تسريب الغنة لحروف المد وحروف الهجاء الأخرى.',
      commonMistakesEn: 'Cutting Ghunnah short before 2 counts, or leaking nasality into adjacent vowels.',
      badge: 'صوت الغنة المركب',
      colorBg: 'bg-rose-50 border-rose-300 text-rose-950',
      activeColor: 'bg-rose-700 text-white'
    }
  ];

  `;
  html = html.replace(dataInsertMarker, makhaarijDataCode + dataInsertMarker);
  console.log('Added MAKHAARIJ_GENERAL_DATA');
}

// 2. Add state for Tajweed sub-view and active makhraj
if (!html.includes('tajweedSubTab')) {
  const tajweedStateMarker = `const [isGeneratingTajweed, setIsGeneratingTajweed] = useState(false);`;
  const tajweedStates = `const [isGeneratingTajweed, setIsGeneratingTajweed] = useState(false);
      const [tajweedSubTab, setTajweedSubTab] = useState('generator'); // 'generator', 'makhaarij', 'metronome'
      const [activeMakhrajId, setActiveMakhrajId] = useState('lisan');
      const [metronomeCount, setMetronomeCount] = useState(2); // 2, 4, 5, 6
      const [metronomePlaying, setMetronomePlaying] = useState(false);
      const [metronomeBeat, setMetronomeBeat] = useState(1);`;
  html = html.replace(tajweedStateMarker, tajweedStates);
  console.log('Added tajweed sub-view state variables');
}

// 3. Add metronome effect in App component
if (!html.includes('// Tajweed Metronome Pulse Effect')) {
  const effectMarker = `// Auto-hide toast after 4s`;
  const metronomeEffect = `// Tajweed Metronome Pulse Effect
      useEffect(() => {
        let interval = null;
        if (metronomePlaying) {
          interval = setInterval(() => {
            setMetronomeBeat(prev => (prev >= metronomeCount ? 1 : prev + 1));
          }, 600); // 100 BPM standard steady tajweed count tempo
        } else {
          setMetronomeBeat(1);
        }
        return () => { if (interval) clearInterval(interval); };
      }, [metronomePlaying, metronomeCount]);

      `;
  html = html.replace(effectMarker, metronomeEffect + effectMarker);
  console.log('Added metronome effect');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved index.html step 1');
