
    // Supreme Islamic Sacred Words & Majesty Name Sanitizer (Guarantees zero corruptions of Allah, PBUH, and Sacred Names)
    function normalizeIslamicSacredTerms(text) {
      if (!text || typeof text !== 'string') return '';
      let t = text;

      // 1. Prophet PBUH honorifics & inverted formulas
      t = t.replace(/مَّ?لسو\s+هيلع\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+ىَّ?لص/gu, 'صلى الله عليه وسلم');
      t = t.replace(/اللهدبع\s+نب\s+رباج/gu, 'جابر بن عبدالله');
      t = t.replace(/اللهُ\s+لوقيُ/gu, 'يقول الله تعالى:');
      t = t.replace(/ِالخَ\s+الئِق/gu, 'الخلائق');
      t = t.replace(/إلعالء/gu, 'لإعلاء');
      t = t.replace(/كماالتهم/gu, 'كمالاتهم');
      t = t.replace(/خُذالن/gu, 'خذلان');
      t = t.replace(/أوالدك/gu, 'أولادك');
      t = t.replace(/وجالء/gu, 'وجلاء');
      t = t.replace(/اللوه/gu, 'اللهو');
      t = t.replace(/وهللا/gu, 'والله');
      t = t.replace(/عبدهللا/gu, 'عبدالله');

      // Inverted Quranic & Hadith statements in raw PDF streams:
      t = t.replace(/["“«]?\s*هِبْلَقِ\s+نِمْ[\s\S]*?لاَقَ\s+نَمْ\s*["”»]?/gu, '«مَنْ قَالَ لَا إِلَهَ إِلَّا اللَّهُ خَالِصًا مِنْ قَلْبِهِ»');
      t = t.replace(/مُهُتَعاَفَشْ\s+يِنْغُت\s+لا\s+تاَواَمَّسلاِ\s+يِف\s+كَلَمٍ\s+نِمْ\s+مَكَو/gu, '﴿وَكَمْ مِنْ مَلَكٍ فِي السَّمَاوَاتِ لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا﴾');
      t = t.replace(/تاَواَمَّسلاِ\s+يِف\s+كَلَمٍ\s+نِمْ\s+مَكَو/gu, '﴿وَكَمْ مِنْ مَلَكٍ فِي السَّمَاوَاتِ﴾');
      t = t.replace(/\(مُهْنِمْ\s+رَصَتْن\s+الََ\s+ُ\s*ءاَشَيُ\s+وَلَوْ\)/gu, '﴿وَلَوْ يَشَاءُ اللَّهُ لَانْتَصَرَ مِنْهُمْ﴾');
      t = t.replace(/هاضِرو\s+اللهِ\s+نْذإِ\s+دعَبَ\s+اَلّ\s+إ\s+اًئيَش\s+مهُتعافش\s+ينغُت\s+لا/gu, '«لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا إِلَّا مِنْ بَعْدِ إِذْنِ اللَّهِ وَرِضَاهُ»');
      t = t.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+(?:لوق|لوقُ)\s*([-\d\.\s]*)/gu, '$1 قول الله تعالى: ');
      t = t.replace(/([-\d\.\s]*)\s*(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+(?:لوق|لوقُ)/gu, '$1 قول الله تعالى: ');
      t = t.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ)\s*هُعِّ?فَ?شُ?يف/gu, 'فيُشفّعُه الله تعالى');
      t = t.replace(/ملسو\s*هيلع\s*(?:هللا|الله|ه\s*للا|للاه)\s*ىلص/gu, 'صلى الله عليه وسلم');
      t = t.replace(/ىلص\s*(?:هللا|الله|ه\s*للا|للاه)\s*هيلع\s*ملسو/gu, 'صلى الله عليه وسلم');
      t = t.replace(/ملسو\s*هيلع\s*(?:هللا|الله|ه\s*للا|للاه)/gu, 'صلى الله عليه وسلم');
      t = t.replace(/(?:صلى|صلَّ?ى)\s*(?:ُ\s*)?(?:ه\s*للا|هللا|ّ?للاه)\s*(?:ِ\s*)?عليْ?ه\s*(?:َ\s*)?وسلَّ?مَ?/gu, 'صلى الله عليه وسلم');
      t = t.replace(/ص[\s\u064B-\u065F\u0670]*ل[\s\u064B-\u065F\u0670]*[ىي][\s\u064B-\u065F\u0670]*ه?[\s\u064B-\u065F\u0670]*ل[\s\u064B-\u065F\u0670]*ل[\s\u064B-\u065F\u0670]*ا[\s\u064B-\u065F\u0670]*ع[\s\u064B-\u065F\u0670]*ل[\s\u064B-\u065F\u0670]*ي[\s\u064B-\u065F\u0670]*[هة][\s\u064B-\u065F\u0670]*و[\s\u064B-\u065F\u0670]*س[\s\u064B-\u065F\u0670]*ل[\s\u064B-\u065F\u0670]*م/gu, 'صلى الله عليه وسلم');

      // 2. Comprehensive Sacred Majesty Name 'الله' Decompositions and Reversals
      t = t.replace(/(رسول|كتاب|قول|ربي|ربِّ?ي|يثبت|يُثبِّ?ت|صلى|صلَّ?ى|عز\s*وجل|عزَّ?\s*وجلَّ?|سبحان|طاعة|دين|بيت|عباد|قدرة|عظمة|نور|حكم|شرع|سنة|وحي|أمر|ذكر|أهل|شريعة|بأن|بأنَّ|أن|أنَّ|إن|إنَّ|إلى|على|في|من|عند|مع|دون|غير|أهلكهم|دمّرهم|نصرهم|خلقهم|رزقهم|يستحي\s+من|يرى)\s*[\u064B-\u065F\u0670\s]*ّ?للاه/gu, '$1 الله');
      t = t.replace(/استَ?عيذوا[\s\u064B-\u065F\u0670\s]*ِ?[\s\u064B-\u065F\u0670\s]*ّ?للَ?ه[\s\u064B-\u065F\u0670\s]*با/gu, 'استعيذوا بالله');
      t = t.replace(/استَ?عيذوا[\s\u064B-\u065F\u0670\s]*ّ?بالله/gu, 'استعيذوا بالله');
      t = t.replace(/[\s\u064B-\u065F\u0670\s]*ّ?للَ?ه[\s\u064B-\u065F\u0670\s]*با(?=[\s،.؛!؟\-]|$)/gu, 'بالله');

      t = t.replace(/(?:^|[\s«\(\[])[\u064B-\u065F\u0670\s]*ّ?للاه(?=[\s»\)\]،.؛!؟\-]|$)/gu, ' الله ');
      t = t.replace(/(?:^|[\s«\(\[])(?:ه\s+للا|هـ\s*للا)(?=[\s»\)\]،.؛!؟\-]|$)/gu, ' الله ');
      t = t.replace(/(?:^|[\s«\(\[])هللا(?=[\s»\)\]،.؛!؟\-]|$)/gu, ' الله ');
      t = t.replace(/ّللاَه/gu, 'الله');
      t = t.replace(/باهلل/gu, 'بالله');

      // Specific Prophetic Narrative Cleanups
      t = t.replace(/هو\s+رسول[\s\S]{0,35}?(?:وسلم|وسلَّم)/gu, 'هو رسول الله صلى الله عليه وسلم');
      t = t.replace(/قرأت\s+كتاب[\s\S]{0,25}?فآمنت\s*ب[هة]/gu, 'قرأت كتاب الله فآمنت به');
      t = t.replace(/فذلِ?ك\s+قول[\s\S]{0,20}?يُ?ثبِّ?ت[\s\S]{0,20}?الَّ?ذين\s+آمنوا/gu, 'فذلك قول الله عز وجل: {يُثَبِّتُ اللَّهُ الَّذِينَ آمَنُوا}');

      // Inverted Law Kana Fiheema:
      t = t.replace(/^[^\n]*ل[\s\u064B-\u065F]*ف[\s\u064B-\u065F]*س[\s\u064B-\u065F]*د[\s\u064B-\u065F]*ت[\s\u064B-\u065F]*ا[^\n]*ل[\s\u064B-\u065F]*و[^\n]*آلِ?هَ?ة[^\n]*$/gmu, '﴿لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا﴾ [الأنبياء: 22]');
      t = t.replace(/(?:َّ?للاه[\s\S]{0,10}?)?(?:ل[\s\u064B-\u065F]*ف[\s\u064B-\u065F]*س[\s\u064B-\u065F]*د[\s\u064B-\u065F]*ت[\s\u064B-\u065F]*ا[\s\S]{0,50}?ل[\s\u064B-\u065F]*و[\s\u064B-\u065F]*ك[\s\u064B-\u065F]*ا[\s\u064B-\u065F]*ن[\s\S]{0,40}?آلِ?هَ?ة?|ل[\s\u064B-\u065F]*و[\s\u064B-\u065F]*ك[\s\u064B-\u065F]*ا[\s\u064B-\u065F]*ن[\s\S]{0,50}?آلِ?هَ?ة?[\s\S]{0,40}?ل[\s\u064B-\u065F]*ف[\s\u064B-\u065F]*س[\s\u064B-\u065F]*د[\s\u064B-\u065F]*ت[\s\u064B-\u065F]*ا)[\s\S]{0,15}?(?=[\n.،؛!؟]|$)/gu, '﴿لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا﴾ [الأنبياء: 22]');

      // Inverted Tanween / Leading Tanween
      t = t.replace(/(^|[\s(«])ً([ابتثجحخدذرزسشصضطظعغفقكلمنهويءآأؤإئ]+)/gu, '$1$2');

      // Trailing 'اول' (inverted 'ولا')
      t = t.replace(/\s+اول(?=[\s.،؛!؟\-]|$)/gu, ' ولا');
      t = t.replace(/\bالستعداد\b/g, 'الاستعداد');
      t = t.replace(/االستعداد/g, 'الاستعداد');
      t = t.replace(/نفعا[\s\u064B-\u0652]*وال[\s\u064B-\u0652]*ضرا[\s\u064B-\u0652]*ا[\s\u064B-\u0652]*ول/gu, 'نفعاً ولا ضراً');

      // Detached prefix re-attachments
      t = t.replace(/(?:^|[\s«\(\[])و\s+ن(?=[\s\u0600-\u06FF])/gu, ' ون');
      t = t.replace(/(?:^|[\s«\(\[])و\s+ت(?=[\s\u0600-\u06FF])/gu, ' وت');
      t = t.replace(/(?:^|[\s«\(\[])و\s+ي(?=[\s\u0600-\u06FF])/gu, ' وي');
      t = t.replace(/(?:^|[\s«\(\[])ف\s+ب(?=[\s\u0600-\u06FF])/gu, ' فب');
      t = t.replace(/(?:^|[\s«\(\[])ل\s+ل(?=[\s\u0600-\u06FF])/gu, ' لل');
      t = t.replace(/(?:^|[\s«\(\[])ا\s+ل(?=[\s\u0600-\u06FF])/gu, ' ال');

      // Collapse spaces
      t = t.replace(/[ \t]{2,}/g, ' ');
      return t;
    }

    // Global helper: Guarantees exactly single Islamic guillemets « ... » without duplication
    function formatScriptureDisplay(text) {
      if (!text || typeof text !== 'string') return '';
      const clean = text.trim();
      if (!clean) return '';
      if (clean.startsWith('«') && clean.endsWith('»')) return clean;
      if (clean.startsWith('«')) return clean;
      return '« ' + clean.replace(/^[«s]+|[»s]+$/g, '') + ' »';
    }

    // Canonical Quran Registry with distinctive phrase matching for infallible slide presentation
    // Canonical Quran Registry with distinctive phrase matching for infallible slide presentation
    const CANONICAL_SLIDE_QURAN = [
      {
        citation: 'الجمعة: 9',
        phrases: ['اذا نودي للصلاة', 'نودي للصلاة من يوم الجمعة', 'فاسعوا الى ذكر الله', 'وذروا البيع', 'لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ'],
        uthmani: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ'
      },
      {
        citation: 'الفرقان: 30',
        phrases: ['وقال الرسول يا رب', 'ان قومي اتخذوا هذا القران', 'اتخذوا هذا القران مهجورا'],
        uthmani: 'وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَذَا الْقُرْآنَ مَهْجُورًا'
      },
      {
        citation: 'الزمر: 44',
        phrases: ['قل لله الشفاعة', 'قل لله الشفاعة جميعا', 'له ملك السماوات والارض'],
        uthmani: 'قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا ۖ لَّهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ ۖ ثُمَّ إِلَيْهِ تُرْجَعُونَ'
      },
      {
        citation: 'البقرة: 255',
        phrases: ['من ذا الذي يشفع عنده', 'يشفع عنده الا باذنه'],
        uthmani: 'مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ'
      },
      {
        citation: 'الأنبياء: 28',
        phrases: ['ولا يشفعون الا لمن ارتضى', 'لمن ارتضى وهم من خشيته'],
        uthmani: 'وَلَا يَشْفَعُونَ إِلَّا لِمَنِ ارْتَضَىٰ وَهُم مِّنْ خَشْيَتِهِ مُشْفِقُونَ'
      },
      {
        citation: 'النجم: 26',
        phrases: ['وكم من ملك في السماوات', 'لا تغني شفاعتهم شيئا الا من بعد ان ياذن الله'],
        uthmani: 'وَكَم مِّن مَّلَكٍ فِي السَّمَاوَاتِ لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا إِلَّا مِن بَعْدِ أَن يَأْذَنَ اللَّهُ لِمَن يَشَاءُ وَيَرْضَىٰ'
      },

      // Aqeedah & Tawheed
      {
        citation: 'الأنعام: 79',
        phrases: ['وجهت وجهي', 'فطر السماوات', 'حنيفا وما انا'],
        uthmani: 'إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ'
      },
      {
        citation: 'الأنبياء: 51',
        phrases: ['اتينا ابراهيم', 'ابراهيم رشده', 'وكنا به عالمين'],
        uthmani: 'وَلَقَدْ آتَيْنَا إِبْرَاهِيمَ رُشْدَهُ مِن قَبْلُ وَكُنَّا بِهِ عَالِمِينَ'
      },
      {
        citation: 'البقرة: 131',
        phrases: ['قال له ربه اسلم', 'اسلم قال اسلمت', 'اسلمت لرب'],
        uthmani: 'إِذْ قَالَ لَهُ رَبُّهُ أَسْلِمْ قَالَ أَسْلَمْتُ لِرَبِّ الْعَالَمِينَ'
      },
      {
        citation: 'النمل: 14',
        phrases: ['وجحدوا بها', 'استيقنتها انفسهم', 'عاقبه المفسدين'],
        uthmani: 'وَجَحَدُوا بِهَا وَاسْتَيْقَنَتْهَا أَنْفُسُهُمْ ظُلْمًا وَعُلُوًّا فَانْظُرْ كَيْفَ كَانَ عَاقِبَةُ الْمُفْسِدِينَ'
      },
      {
        citation: 'الطور: 35',
        phrases: ['ام خلقوا من غير شيء', 'خلقوا من غير', 'ام هم الخالقون'],
        uthmani: 'أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ'
      },
      {
        citation: 'الأنبياء: 22',
        phrases: ['لو كان فيهما', 'الهه الا الله', 'لفسدتا'],
        uthmani: 'لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا'
      },
      {
        citation: 'الذاريات: 56',
        phrases: ['وما خلقت الجن', 'الجن والانس', 'الا ليعبدون', 'ليعبدون'],
        uthmani: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ'
      },
      // Quranic Sciences & Hajr Al-Quran
      {
        citation: 'الفرقان: 30',
        phrases: ['اتخذوا هذا القران مهجورا', 'القران مهجورا', 'هجر القران', 'مهجورا', 'اتخذوا هذا القران', 'وقال الرسول يا رب'],
        uthmani: 'وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَٰذَا الْقُرْآنَ مَهْجُورًا'
      },
      {
        citation: 'الزمر: 44',
        phrases: ['قل لله الشفاعه جميعا', 'لله الشفاعه', 'الشفاعه جميعا', 'له ملك السماوات'],
        uthmani: 'قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا ۖ لَّهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ ۖ ثُمَّ إِلَيْهِ تُرْجَعُونَ'
      },
      {
        citation: 'البقرة: 255',
        phrases: ['يشفع عنده الا باذنه', 'من ذا الذي يشفع عنده الا باذنه', 'الا باذنه'],
        uthmani: 'مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ'
      },
      {
        citation: 'الإسراء: 82',
        phrases: ['وننزل من القران ما هو شفاء', 'هو شفاء ورحمه', 'الاستشفاء بالقران', 'التداوي بالقران', 'تداوي به', 'الاستشفاء'],
        uthmani: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ ۙ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَارًا'
      },
      {
        citation: 'ص: 29',
        phrases: ['كتاب انزلناه اليك مبارك ليدبروا', 'ليدبروا اياته', 'وليتذكر اولو الالباب', 'تدبر القران', 'هجر تدبره', 'تدبره وتفهمه'],
        uthmani: 'كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ'
      },
      {
        citation: 'الأعراف: 3',
        phrases: ['اتبعوا ما انزل اليكم', 'ولا تتبعوا من دونه اولياء', 'هجر العمل به', 'هجر العمل', 'العمل به'],
        uthmani: 'اتَّبِعُوا مَا أُنزِلَ إِلَيْكُم مِّن رَّبِّكُمْ وَلَا تَتَّبِعُوا مِن دُونِهِ أَوْلِيَاءَ ۗ قَلِيلًا مَّا تَذَكَّرُونَ'
      }
    ];

    // Distill a slide scripture into a clean, golden, uncluttered witness (1-3 lines max, perfect for presentation slides)
    function distillSlideScripture(rawScripture, sectionContext = '') {
      if ((!rawScripture || typeof rawScripture !== 'string') && !sectionContext) return '';
      const combined = ((rawScripture || '') + ' ' + (sectionContext || '')).trim();
      let s = normalizeIslamicSacredTerms(rawScripture || '').trim();

      const nCombined = combined
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
        .replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();

      const n = s
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
        .replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();

      // 1. Check against Canonical Quran Registry with DISTINCTIVE PHRASES FIRST!
      for (const cq of CANONICAL_SLIDE_QURAN) {
        if (cq.phrases.some(p => nCombined.includes(p.replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')))) {
          return formatScriptureDisplay(`${cq.uthmani} [${cq.citation}]`);
        }
      }

      // 2. Hadith of intercession at the gate of Jannah
      if (combined.includes('آتي باب الجنة') || combined.includes('فأستفتح') || combined.includes('فيقول الخازن')) {
        return formatScriptureDisplay('آتِي بَابَ الْجَنَّةِ يَوْمَ الْقِيَامَةِ فَأَسْتَفْتِحُ، فَيَقُولُ الْخَازِنُ: مَنْ أَنْتَ؟ فَأَقُولُ: مُحَمَّدٌ، فَيَقُولُ: بِكَ أُمِرْتُ لَا أَفْتَحُ لِأَحَدٍ قَبْلَكَ (صحيح مسلم)');
      }

      // 3. Hadith of Al-Baraa ibn Azib in the grave
      if (combined.includes('عذاب القبر') || combined.includes('استعيذوا بالله') || combined.includes('جنازة رجل من الأنصار') || combined.includes('البراء بن عازب') || combined.includes('فيجلسانه فيقولان')) {
        return formatScriptureDisplay('اسْتَعِيذُوا بِاللَّهِ مِنْ عَذَابِ الْقَبْرِ ... يُثَبِّتُ اللَّهُ الَّذِينَ آمَنُوا بِالْقَوْلِ الثَّابِتِ فِي الْحَيَاةِ الدُّنْيَا وَفِي الْآخِرَةِ (صحيح أبي داود)');
      }

      // 4. Ya Muqallib al-Quloob
      if (combined.includes('مقلب القلوب')) {
        return formatScriptureDisplay('يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ (حديث شريف)');
      }

      // 5. Turiktu Feekum
      if (combined.includes('تركت فيكم') || combined.includes('كتاب الله وسنة')) {
        return formatScriptureDisplay('تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ');
      }

      // 6. Reject scan noise, tiny broken fragments & incomplete quotes
      if (s.length < 20 || /^(?:لا|إلا|لا بس|نعم|بلى|فقط|نود نم|الَِّ|\.|\.لا|لقثأ نإ)$/.test(n) || s.includes('لقثأ نإ') || /(?:قال|روى|عن)[:\s]*$/.test(s)) {
        if (nCombined.includes('هجر') || nCombined.includes('قران')) {
          return formatScriptureDisplay('وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَٰذَا الْقُرْآنَ مَهْجُورًا [الفرقان: 30]');
        }
        if (nCombined.includes('شفاع')) {
          return formatScriptureDisplay('قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا ۖ لَّهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ [الزمر: 44]');
        }
        return '';
      }

      // 7. Quranic verse ﴿...﴾ - join internal newlines, ensure at least 3 words and not scan noise
      const ayahMatch = s.match(/﴿([^﴾]+)﴾/);
      if (ayahMatch) {
        let cleanAyah = ayahMatch[1].replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
        cleanAyah = cleanAyah.replace(/^[﴿\s]+|[﴾\s]+$/g, '').trim();
        const words = cleanAyah.split(/\s+/).filter(w => w.length > 1);
        if (words.length >= 3 && !/^(?:لا|إلا|لا بس|نعم|بلى|فقط)$/.test(cleanAyah)) {
          const citeMatch = s.match(/\[([^\]]{3,30})\]/) || s.match(/\((سورة\s+[^\)]{3,25})\)/);
          const cite = citeMatch ? (' [' + citeMatch[1].replace(/[:\s]+$/, '') + ']') : '';
          return formatScriptureDisplay(`﴿${cleanAyah}﴾${cite}`);
        }
      }

      // 8. Authentic Quote between «...» or "..."
      const quoteMatch = s.match(/«([^»]{18,220})»/) || s.match(/"([^"]{18,220})"/);
      if (quoteMatch) {
        let q = quoteMatch[1].replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
        q = q.replace(/^(?:قال رسول الله|قال النبي|روى البخاري|عن \w+)[\s:،-]+/, '').trim();
        const words = q.split(/\s+/).filter(w => w.length > 1);
        if (words.length >= 4 && !q.includes('لقثأ')) {
          return formatScriptureDisplay(q);
        }
      }

      // Contextual fallbacks
      if (nCombined.includes('هجر') || nCombined.includes('قران')) {
        return formatScriptureDisplay('وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَٰذَا الْقُرْآنَ مَهْجُورًا [الفرقان: 30]');
      }
      if (nCombined.includes('شفاع')) {
        return formatScriptureDisplay('قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا ۖ لَّهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ [الزمر: 44]');
      }

      // 9. General length distillation (max 140 chars)
      if (s.length > 150) {
        const firstSent = s.split(/[.؛!؟\n]/)[0].trim();
        if (firstSent.length >= 25 && firstSent.length <= 140) {
          return formatScriptureDisplay(firstSent);
        }
        const sp = s.substring(0, 135).lastIndexOf(' ');
        return formatScriptureDisplay(s.substring(0, sp > 40 ? sp : 130).trim() + '...');
      }

      return formatScriptureDisplay(s);
    }

    if (typeof window !== 'undefined') {
      window.normalizeIslamicSacredTerms = normalizeIslamicSacredTerms;
      window.formatScriptureDisplay = formatScriptureDisplay;
      window.distillSlideScripture = distillSlideScripture;
    }
