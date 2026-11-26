
    // Default Preloaded Curriculum & Books
    const MAKHAARIJ_GENERAL_DATA = [
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
      letters: ['ن', 'م'],
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

  const PRELOADED_TEXTBOOKS = [
      { id: 'czerepinski', nameAr: 'كتاب أحكام التجويد (كريمة كزارول چيربينسكي)', nameEn: 'Tajweed Rules of the Qur\'an (Czerepinski)', note: 'الأكثر اعتماداً لتدريس غير الناطقين بالعربية' },
      { id: 'suwayd', nameAr: 'التجويد المصور (د. أيمن رشدي سويد)', nameEn: 'Illustrated Tajweed (Dr. Ayman Suwayd)', note: 'توصيف دقيق للمخارج التشريحية وصفات الحروف' },
      { id: 'mulakhkhas', nameAr: 'الملخص المفيد في علم التجويد', nameEn: 'Al-Mulakhkhas Al-Mufeed', note: 'موجز مدرسي عملي' },
      { id: 'jazariyyah', nameAr: 'متن المنظومة الجزرية للإمام ابن الجزري', nameEn: 'Al-Jazariyyah Classical Matn', note: 'أبيات الاستدلال المعتمدة' }
    ];

    const TAJWEED_RULES = [
      { id: 'ikhfaa', nameAr: 'الإخفاء الحقيقي (15 حرفاً)', nameEn: 'Al-Ikhfaa Al-Haqiqi (True Concealment)' },
      { id: 'idgham_ghunnah', nameAr: 'الإدغام بغنة (يَنْمُو)', nameEn: 'Idgham with Ghunnah (YANMU)' },
      { id: 'idgham_bighunnah', nameAr: 'الإدغام بغير غنة (ل، ر)', nameEn: 'Idgham without Ghunnah (Lam, Raa)' },
      { id: 'izhar', nameAr: 'الإظهار الحلقي (حروف الحلق 6)', nameEn: 'Izhar Halqi (Throat Letters)' },
      { id: 'iqlab', nameAr: 'الإقلاب (قلب النون ميماً عند الباء)', nameEn: 'Iqlab (Conversion to Meem at Baa)' },
      { id: 'meem_sakinah', nameAr: 'أحكام الميم الساكنة (إخفاء، إدغام، إظهار شفوي)', nameEn: 'Rules of Meem Sakinah' },
      { id: 'qalqalah', nameAr: 'القلقلة (قُطْبُ جَدٍّ - كبرى وصغرى)', nameEn: 'Al-Qalqalah (Echoing/Rebound)' },
      { id: 'madd_farie', nameAr: 'أحكام المدود (المتصل، المنفصل، العارض، اللازم)', nameEn: 'Madd Rules (Connected, Detached, Compulsory)' },
      { id: 'makharij', nameAr: 'مخارج الحروف والصفات التشريحية', nameEn: 'Makharij & Phonetic Articulation Points' }
    ];

    
    // ================= BRANCH 1: HIFZ & RECITATION DATA & MUTASHABIHAT =================
    
    // 114 Verified Quran Surahs with exact metadata
    
    // Dynamic Multi-Layer Layout Engine for Madinah Mushaf Pages (15 Lines Grid Calibration)
    const getMushafPageLayout = (pageNumber) => {
      const page = parseInt(pageNumber) || 1;
      // Identify pages where a Surah begins (has decorative Surah header banner and Basmalah)
      const surahStarts = MUSHAF_SURAHS_PAGE_MAP.filter(s => s.startPage === page);
      const isSurahOpening = surahStarts.length > 0 && page !== 187; // Surah At-Tawbah (187) has no Basmalah

      if (isSurahOpening) {
        const lines = [];
        const surahName = surahStarts[0]?.name || '';
        // Line 1: Decorative Surah Title Banner Frame (Top 5.8% to 14.6%)
        lines.push({ id: 1, label: `إطار سورة ${surahName}`, top: 5.8, height: 8.8, isHeader: true, isVerse: false });
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
            label: `السطر ${lineNum}`,
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
          label: `السطر ${lineNum}`,
          top: textStartTop + i * lineH,
          height: 5.90,
          isVerse: true
        });
      }
      return { isSurahOpening: false, lines, verseLineIds };
    };

    // 114 Quran Surahs Page Mapping for Real Madinah Mushaf (King Fahd Complex)
    const MUSHAF_SURAHS_PAGE_MAP = [{"id":1,"name":"الفاتحة","startPage":1,"endPage":1,"totalAyahs":7},{"id":2,"name":"البقرة","startPage":2,"endPage":49,"totalAyahs":286},{"id":3,"name":"آل عمران","startPage":50,"endPage":76,"totalAyahs":200},{"id":4,"name":"النساء","startPage":77,"endPage":106,"totalAyahs":176},{"id":5,"name":"المائدة","startPage":106,"endPage":127,"totalAyahs":120},{"id":6,"name":"الأنعام","startPage":128,"endPage":150,"totalAyahs":165},{"id":7,"name":"الأعراف","startPage":151,"endPage":176,"totalAyahs":206},{"id":8,"name":"الأنفال","startPage":177,"endPage":186,"totalAyahs":75},{"id":9,"name":"التوبة","startPage":187,"endPage":207,"totalAyahs":129},{"id":10,"name":"يونس","startPage":208,"endPage":221,"totalAyahs":109},{"id":11,"name":"هود","startPage":221,"endPage":235,"totalAyahs":123},{"id":12,"name":"يوسف","startPage":235,"endPage":248,"totalAyahs":111},{"id":13,"name":"الرعد","startPage":249,"endPage":255,"totalAyahs":43},{"id":14,"name":"ابراهيم","startPage":255,"endPage":261,"totalAyahs":52},{"id":15,"name":"الحجر","startPage":262,"endPage":267,"totalAyahs":99},{"id":16,"name":"النحل","startPage":267,"endPage":281,"totalAyahs":128},{"id":17,"name":"الإسراء","startPage":282,"endPage":293,"totalAyahs":111},{"id":18,"name":"الكهف","startPage":293,"endPage":304,"totalAyahs":110},{"id":19,"name":"مريم","startPage":305,"endPage":312,"totalAyahs":98},{"id":20,"name":"طه","startPage":312,"endPage":321,"totalAyahs":135},{"id":21,"name":"الأنبياء","startPage":322,"endPage":331,"totalAyahs":112},{"id":22,"name":"الحج","startPage":332,"endPage":341,"totalAyahs":78},{"id":23,"name":"المؤمنون","startPage":342,"endPage":349,"totalAyahs":118},{"id":24,"name":"النور","startPage":350,"endPage":359,"totalAyahs":64},{"id":25,"name":"الفرقان","startPage":359,"endPage":366,"totalAyahs":77},{"id":26,"name":"الشعراء","startPage":367,"endPage":376,"totalAyahs":227},{"id":27,"name":"النمل","startPage":377,"endPage":385,"totalAyahs":93},{"id":28,"name":"القصص","startPage":385,"endPage":396,"totalAyahs":88},{"id":29,"name":"العنكبوت","startPage":396,"endPage":404,"totalAyahs":69},{"id":30,"name":"الروم","startPage":404,"endPage":410,"totalAyahs":60},{"id":31,"name":"لقمان","startPage":411,"endPage":414,"totalAyahs":34},{"id":32,"name":"السجدة","startPage":415,"endPage":417,"totalAyahs":30},{"id":33,"name":"الأحزاب","startPage":418,"endPage":427,"totalAyahs":73},{"id":34,"name":"سبإ","startPage":428,"endPage":434,"totalAyahs":54},{"id":35,"name":"فاطر","startPage":434,"endPage":440,"totalAyahs":45},{"id":36,"name":"يس","startPage":440,"endPage":445,"totalAyahs":83},{"id":37,"name":"الصافات","startPage":446,"endPage":452,"totalAyahs":182},{"id":38,"name":"ص","startPage":453,"endPage":458,"totalAyahs":88},{"id":39,"name":"الزمر","startPage":458,"endPage":467,"totalAyahs":75},{"id":40,"name":"غافر","startPage":467,"endPage":476,"totalAyahs":85},{"id":41,"name":"فصلت","startPage":477,"endPage":482,"totalAyahs":54},{"id":42,"name":"الشورى","startPage":483,"endPage":489,"totalAyahs":53},{"id":43,"name":"الزخرف","startPage":489,"endPage":495,"totalAyahs":89},{"id":44,"name":"الدخان","startPage":496,"endPage":498,"totalAyahs":59},{"id":45,"name":"الجاثية","startPage":499,"endPage":502,"totalAyahs":37},{"id":46,"name":"الأحقاف","startPage":502,"endPage":506,"totalAyahs":35},{"id":47,"name":"محمد","startPage":507,"endPage":510,"totalAyahs":38},{"id":48,"name":"الفتح","startPage":511,"endPage":515,"totalAyahs":29},{"id":49,"name":"الحجرات","startPage":515,"endPage":517,"totalAyahs":18},{"id":50,"name":"ق","startPage":518,"endPage":520,"totalAyahs":45},{"id":51,"name":"الذاريات","startPage":520,"endPage":523,"totalAyahs":60},{"id":52,"name":"الطور","startPage":523,"endPage":525,"totalAyahs":49},{"id":53,"name":"النجم","startPage":526,"endPage":528,"totalAyahs":62},{"id":54,"name":"القمر","startPage":528,"endPage":531,"totalAyahs":55},{"id":55,"name":"الرحمن","startPage":531,"endPage":534,"totalAyahs":78},{"id":56,"name":"الواقعة","startPage":534,"endPage":537,"totalAyahs":96},{"id":57,"name":"الحديد","startPage":537,"endPage":541,"totalAyahs":29},{"id":58,"name":"المجادلة","startPage":542,"endPage":545,"totalAyahs":22},{"id":59,"name":"الحشر","startPage":545,"endPage":548,"totalAyahs":24},{"id":60,"name":"الممتحنة","startPage":549,"endPage":551,"totalAyahs":13},{"id":61,"name":"الصف","startPage":551,"endPage":552,"totalAyahs":14},{"id":62,"name":"الجمعة","startPage":553,"endPage":554,"totalAyahs":11},{"id":63,"name":"المنافقون","startPage":554,"endPage":555,"totalAyahs":11},{"id":64,"name":"التغابن","startPage":556,"endPage":557,"totalAyahs":18},{"id":65,"name":"الطلاق","startPage":558,"endPage":559,"totalAyahs":12},{"id":66,"name":"التحريم","startPage":560,"endPage":561,"totalAyahs":12},{"id":67,"name":"الملك","startPage":562,"endPage":564,"totalAyahs":30},{"id":68,"name":"القلم","startPage":564,"endPage":566,"totalAyahs":52},{"id":69,"name":"الحاقة","startPage":566,"endPage":568,"totalAyahs":52},{"id":70,"name":"المعارج","startPage":568,"endPage":570,"totalAyahs":44},{"id":71,"name":"نوح","startPage":570,"endPage":571,"totalAyahs":28},{"id":72,"name":"الجن","startPage":572,"endPage":573,"totalAyahs":28},{"id":73,"name":"المزمل","startPage":574,"endPage":575,"totalAyahs":20},{"id":74,"name":"المدثر","startPage":575,"endPage":577,"totalAyahs":56},{"id":75,"name":"القيامة","startPage":577,"endPage":578,"totalAyahs":40},{"id":76,"name":"الانسان","startPage":578,"endPage":580,"totalAyahs":31},{"id":77,"name":"المرسلات","startPage":580,"endPage":581,"totalAyahs":50},{"id":78,"name":"النبإ","startPage":582,"endPage":583,"totalAyahs":40},{"id":79,"name":"النازعات","startPage":583,"endPage":584,"totalAyahs":46},{"id":80,"name":"عبس","startPage":585,"endPage":585,"totalAyahs":42},{"id":81,"name":"التكوير","startPage":586,"endPage":586,"totalAyahs":29},{"id":82,"name":"الإنفطار","startPage":587,"endPage":587,"totalAyahs":19},{"id":83,"name":"المطففين","startPage":587,"endPage":589,"totalAyahs":36},{"id":84,"name":"الإنشقاق","startPage":589,"endPage":589,"totalAyahs":25},{"id":85,"name":"البروج","startPage":590,"endPage":590,"totalAyahs":22},{"id":86,"name":"الطارق","startPage":591,"endPage":591,"totalAyahs":17},{"id":87,"name":"الأعلى","startPage":591,"endPage":592,"totalAyahs":19},{"id":88,"name":"الغاشية","startPage":592,"endPage":592,"totalAyahs":26},{"id":89,"name":"الفجر","startPage":593,"endPage":594,"totalAyahs":30},{"id":90,"name":"البلد","startPage":594,"endPage":594,"totalAyahs":20},{"id":91,"name":"الشمس","startPage":595,"endPage":595,"totalAyahs":15},{"id":92,"name":"الليل","startPage":595,"endPage":596,"totalAyahs":21},{"id":93,"name":"الضحى","startPage":596,"endPage":596,"totalAyahs":11},{"id":94,"name":"الشرح","startPage":596,"endPage":596,"totalAyahs":8},{"id":95,"name":"التين","startPage":597,"endPage":597,"totalAyahs":8},{"id":96,"name":"العلق","startPage":597,"endPage":597,"totalAyahs":19},{"id":97,"name":"القدر","startPage":598,"endPage":598,"totalAyahs":5},{"id":98,"name":"البينة","startPage":598,"endPage":599,"totalAyahs":8},{"id":99,"name":"الزلزلة","startPage":599,"endPage":599,"totalAyahs":8},{"id":100,"name":"العاديات","startPage":599,"endPage":600,"totalAyahs":11},{"id":101,"name":"القارعة","startPage":600,"endPage":600,"totalAyahs":11},{"id":102,"name":"التكاثر","startPage":600,"endPage":600,"totalAyahs":8},{"id":103,"name":"العصر","startPage":601,"endPage":601,"totalAyahs":3},{"id":104,"name":"الهمزة","startPage":601,"endPage":601,"totalAyahs":9},{"id":105,"name":"الفيل","startPage":601,"endPage":601,"totalAyahs":5},{"id":106,"name":"قريش","startPage":602,"endPage":602,"totalAyahs":4},{"id":107,"name":"الماعون","startPage":602,"endPage":602,"totalAyahs":7},{"id":108,"name":"الكوثر","startPage":602,"endPage":602,"totalAyahs":3},{"id":109,"name":"الكافرون","startPage":603,"endPage":603,"totalAyahs":6},{"id":110,"name":"النصر","startPage":603,"endPage":603,"totalAyahs":3},{"id":111,"name":"المسد","startPage":603,"endPage":603,"totalAyahs":5},{"id":112,"name":"الإخلاص","startPage":604,"endPage":604,"totalAyahs":4},{"id":113,"name":"الفلق","startPage":604,"endPage":604,"totalAyahs":5},{"id":114,"name":"الناس","startPage":604,"endPage":604,"totalAyahs":6}];

    const ALL_QURAN_SURAHS = [{"id":1,"name":"الفاتحة","en":"Al-Faatiha","ayahs":7},{"id":2,"name":"البقرة","en":"Al-Baqara","ayahs":286},{"id":3,"name":"ال عمران","en":"Aal-i-Imraan","ayahs":200},{"id":4,"name":"النساء","en":"An-Nisaa","ayahs":176},{"id":5,"name":"المائـدة","en":"Al-Maaida","ayahs":120},{"id":6,"name":"الأنعام","en":"Al-An'aam","ayahs":165},{"id":7,"name":"الأعراف","en":"Al-A'raaf","ayahs":206},{"id":8,"name":"الأنفال","en":"Al-Anfaal","ayahs":75},{"id":9,"name":"التوبة","en":"At-Tawba","ayahs":129},{"id":10,"name":"يونس","en":"Yunus","ayahs":109},{"id":11,"name":"هود","en":"Hud","ayahs":123},{"id":12,"name":"يوسف","en":"Yusuf","ayahs":111},{"id":13,"name":"الرعد","en":"Ar-Ra'd","ayahs":43},{"id":14,"name":"إبراهيم","en":"Ibrahim","ayahs":52},{"id":15,"name":"الحجر","en":"Al-Hijr","ayahs":99},{"id":16,"name":"النحل","en":"An-Nahl","ayahs":128},{"id":17,"name":"الإسراء","en":"Al-Israa","ayahs":111},{"id":18,"name":"الكهف","en":"Al-Kahf","ayahs":110},{"id":19,"name":"مريم","en":"Maryam","ayahs":98},{"id":20,"name":"طه","en":"Taa-Haa","ayahs":135},{"id":21,"name":"الأنبياء","en":"Al-Anbiyaa","ayahs":112},{"id":22,"name":"الحج","en":"Al-Hajj","ayahs":78},{"id":23,"name":"المؤمنون","en":"Al-Muminoon","ayahs":118},{"id":24,"name":"النور","en":"An-Noor","ayahs":64},{"id":25,"name":"الفرقان","en":"Al-Furqaan","ayahs":77},{"id":26,"name":"الشعراء","en":"Ash-Shu'araa","ayahs":227},{"id":27,"name":"النمل","en":"An-Naml","ayahs":93},{"id":28,"name":"القصص","en":"Al-Qasas","ayahs":88},{"id":29,"name":"العنكبوت","en":"Al-Ankaboot","ayahs":69},{"id":30,"name":"الروم","en":"Ar-Room","ayahs":60},{"id":31,"name":"لقمان","en":"Luqman","ayahs":34},{"id":32,"name":"السجدة","en":"As-Sajda","ayahs":30},{"id":33,"name":"الأحزاب","en":"Al-Ahzaab","ayahs":73},{"id":34,"name":"سبإ","en":"Saba","ayahs":54},{"id":35,"name":"فاطر","en":"Faatir","ayahs":45},{"id":36,"name":"يس","en":"Yaseen","ayahs":83},{"id":37,"name":"الصافات","en":"As-Saaffaat","ayahs":182},{"id":38,"name":"ص","en":"Saad","ayahs":88},{"id":39,"name":"الزمر","en":"Az-Zumar","ayahs":75},{"id":40,"name":"غافر","en":"Ghafir","ayahs":85},{"id":41,"name":"فصلت","en":"Fussilat","ayahs":54},{"id":42,"name":"الشورى","en":"Ash-Shura","ayahs":53},{"id":43,"name":"الزخرف","en":"Az-Zukhruf","ayahs":89},{"id":44,"name":"الدخان","en":"Ad-Dukhaan","ayahs":59},{"id":45,"name":"الجاثية","en":"Al-Jaathiya","ayahs":37},{"id":46,"name":"الأحقاف","en":"Al-Ahqaf","ayahs":35},{"id":47,"name":"محمد","en":"Muhammad","ayahs":38},{"id":48,"name":"الفتح","en":"Al-Fath","ayahs":29},{"id":49,"name":"الحجرات","en":"Al-Hujuraat","ayahs":18},{"id":50,"name":"ق","en":"Qaaf","ayahs":45},{"id":51,"name":"الذاريات","en":"Adh-Dhaariyat","ayahs":60},{"id":52,"name":"الطور","en":"At-Tur","ayahs":49},{"id":53,"name":"النجم","en":"An-Najm","ayahs":62},{"id":54,"name":"القمر","en":"Al-Qamar","ayahs":55},{"id":55,"name":"الرحمن","en":"Ar-Rahmaan","ayahs":78},{"id":56,"name":"الواقعة","en":"Al-Waaqia","ayahs":96},{"id":57,"name":"الحديد","en":"Al-Hadid","ayahs":29},{"id":58,"name":"المجادلة","en":"Al-Mujaadila","ayahs":22},{"id":59,"name":"الحشر","en":"Al-Hashr","ayahs":24},{"id":60,"name":"الممتحنة","en":"Al-Mumtahana","ayahs":13},{"id":61,"name":"الصف","en":"As-Saff","ayahs":14},{"id":62,"name":"الجمعة","en":"Al-Jumu'a","ayahs":11},{"id":63,"name":"المنافقون","en":"Al-Munaafiqoon","ayahs":11},{"id":64,"name":"التغابن","en":"At-Taghaabun","ayahs":18},{"id":65,"name":"الطلاق","en":"At-Talaaq","ayahs":12},{"id":66,"name":"التحريم","en":"At-Tahrim","ayahs":12},{"id":67,"name":"الملك","en":"Al-Mulk","ayahs":30},{"id":68,"name":"القلم","en":"Al-Qalam","ayahs":52},{"id":69,"name":"الحاقة","en":"Al-Haaqqa","ayahs":52},{"id":70,"name":"المعارج","en":"Al-Ma'aarij","ayahs":44},{"id":71,"name":"نوح","en":"Nooh","ayahs":28},{"id":72,"name":"الجن","en":"Al-Jinn","ayahs":28},{"id":73,"name":"المزمل","en":"Al-Muzzammil","ayahs":20},{"id":74,"name":"المدثر","en":"Al-Muddaththir","ayahs":56},{"id":75,"name":"القيامة","en":"Al-Qiyaama","ayahs":40},{"id":76,"name":"الإنسان","en":"Al-Insaan","ayahs":31},{"id":77,"name":"المرسلات","en":"Al-Mursalaat","ayahs":50},{"id":78,"name":"النبإ","en":"An-Naba","ayahs":40},{"id":79,"name":"النازعات","en":"An-Naazi'aat","ayahs":46},{"id":80,"name":"عبس","en":"Abasa","ayahs":42},{"id":81,"name":"التكوير","en":"At-Takwir","ayahs":29},{"id":82,"name":"الانفطار","en":"Al-Infitaar","ayahs":19},{"id":83,"name":"المطففين","en":"Al-Mutaffifin","ayahs":36},{"id":84,"name":"الانشقاق","en":"Al-Inshiqaaq","ayahs":25},{"id":85,"name":"البروج","en":"Al-Burooj","ayahs":22},{"id":86,"name":"الطارق","en":"At-Taariq","ayahs":17},{"id":87,"name":"الأعلى","en":"Al-A'laa","ayahs":19},{"id":88,"name":"الغاشية","en":"Al-Ghaashiya","ayahs":26},{"id":89,"name":"الفجر","en":"Al-Fajr","ayahs":30},{"id":90,"name":"البلد","en":"Al-Balad","ayahs":20},{"id":91,"name":"الشمس","en":"Ash-Shams","ayahs":15},{"id":92,"name":"الليل","en":"Al-Lail","ayahs":21},{"id":93,"name":"الضحى","en":"Ad-Dhuhaa","ayahs":11},{"id":94,"name":"الشرح","en":"Ash-Sharh","ayahs":8},{"id":95,"name":"التين","en":"At-Tin","ayahs":8},{"id":96,"name":"العلق","en":"Al-Alaq","ayahs":19},{"id":97,"name":"القدر","en":"Al-Qadr","ayahs":5},{"id":98,"name":"البينة","en":"Al-Bayyina","ayahs":8},{"id":99,"name":"الزلزلة","en":"Az-Zalzala","ayahs":8},{"id":100,"name":"العاديات","en":"Al-Aadiyaat","ayahs":11},{"id":101,"name":"القارعة","en":"Al-Qaari'a","ayahs":11},{"id":102,"name":"التكاثر","en":"At-Takaathur","ayahs":8},{"id":103,"name":"العصر","en":"Al-Asr","ayahs":3},{"id":104,"name":"الهمزة","en":"Al-Humaza","ayahs":9},{"id":105,"name":"الفيل","en":"Al-Fil","ayahs":5},{"id":106,"name":"قريش","en":"Quraish","ayahs":4},{"id":107,"name":"الماعون","en":"Al-Maa'un","ayahs":7},{"id":108,"name":"الكوثر","en":"Al-Kawthar","ayahs":3},{"id":109,"name":"الكافرون","en":"Al-Kaafiroon","ayahs":6},{"id":110,"name":"النصر","en":"An-Nasr","ayahs":3},{"id":111,"name":"المسد","en":"Al-Masad","ayahs":5},{"id":112,"name":"الإخلاص","en":"Al-Ikhlaas","ayahs":4},{"id":113,"name":"الفلق","en":"Al-Falaq","ayahs":5},{"id":114,"name":"الناس","en":"An-Naas","ayahs":6}];
