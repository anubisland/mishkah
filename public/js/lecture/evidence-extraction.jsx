    function extractEvidencesAndProofs(rawText) {
      if (!rawText) return { quranicVerses: [], hadiths: [], scholarlyProofs: [] };
      var text = sanitizeArabicExtractedText(rawText);
      
      var quranicVerses = [];
      var hadiths = [];
      var scholarlyProofs = [];

      function stripTashkeelHelper(t) {
        return (t || '').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '').replace(/\s+/g, ' ');
      }

      const normalizedFull = stripTashkeelHelper(rawText);

      // Infallible Canonical Quranic Registry for Classical Curriculum & Tawheed Lectures
      const CANONICAL_QURAN_REGISTRY = [
        {
          pattern: /نودي[sS]{0,30}?الجمعة[sS]{0,30}?فاسعوا/,
          uthmani: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ',
          surah: 'الجمعة',
          ayah: 9
        },
        {
          pattern: /اتخذوا[sS]{0,20}?القر[آا]ن[sS]{0,20}?مهجورا/,
          uthmani: 'وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَذَا الْقُرْآنَ مَهْجُورًا',
          surah: 'الفرقان',
          ayah: 30
        },
        {
          pattern: /قل[sS]{0,15}?لله[sS]{0,15}?الشفاعة[sS]{0,15}?جميعا/,
          uthmani: 'قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا ۖ لَّهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ',
          surah: 'الزمر',
          ayah: 44
        },

        {
          pattern: /[إأاآ]ني[\s\S]{0,20}?وجهت[\s\S]{0,60}?المشركين/,
          uthmani: 'إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ',
          surah: 'الأنعام',
          ayah: 79
        },
        {
          pattern: /ولقد[\s\S]{0,20}?[إأاآ]تينا[\s\S]{0,40}?عالمين/,
          uthmani: 'وَلَقَدْ آتَيْنَا إِبْرَاهِيمَ رُشْدَهُ مِن قَبْلُ وَكُنَّا بِهِ عَالِمِينَ',
          surah: 'الأنبياء',
          ayah: 51
        },
        {
          pattern: /[إأاآ]ذ[\s\S]{0,20}?قال[\s\S]{0,20}?ربه[\s\S]{0,20}?[أإا]سلم[\s\S]{0,40}?العالمين/,
          uthmani: 'إِذْ قَالَ لَهُ رَبُّهُ أَسْلِمْ قَالَ أَسْلَمْتُ لِرَبِّ الْعَالَمِينَ',
          surah: 'البقرة',
          ayah: 131
        },
        {
          pattern: /وجحدوا[\s\S]{0,25}?واستيقنتها[\s\S]{0,50}?المفسدين/,
          uthmani: 'وَجَحَدُوا بِهَا وَاسْتَيْقَنَتْهَا أَنْفُسُهُمْ ظُلْمًا وَعُلُوًّا فَانْظُرْ كَيْفَ كَانَ عَاقِبَةُ الْمُفْسِدِينَ',
          surah: 'النمل',
          ayah: 14
        },
        {
          pattern: /[أإا]م[\s\S]{0,20}?خلقوا[\s\S]{0,30}?الخالقون/,
          uthmani: 'أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ',
          surah: 'الطور',
          ayah: 35
        },
        {
          pattern: /لو[\s\S]{0,20}?كان[\s\S]{0,30}?[آأإا]لهة[\s\S]{0,30}?لفسدتا|لفسدتا[\s\S]{0,35}?[آأإا]لهة/,
          uthmani: 'لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا',
          surah: 'الأنبياء',
          ayah: 22
        },
        {
          pattern: /وما[\s\S]{0,20}?خلقت[\s\S]{0,30}?الجن[\s\S]{0,30}?ليعبدون/,
          uthmani: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
          surah: 'الذاريات',
          ayah: 56
        }
      ];

      CANONICAL_QURAN_REGISTRY.forEach(function(cq) {
        if (cq.pattern.test(normalizedFull)) {
          quranicVerses.push({
            id: 'q_' + cq.surah + '_' + cq.ayah,
            type: 'quran',
            arabicText: '« ' + cq.uthmani + ' »',
            plainText: cq.uthmani,
            citation: cq.surah + ': ' + cq.ayah,
            grading: 'متواتر قطعي الثبوت'
          });
        }
      });

      // Dynamic Bracket Extractor for other general verses (strictly sanitizing out merged lecture text)
      var bracketMatches = text.match(/﴿[^﴾]{15,250}﴾/g) || [];
      bracketMatches.forEach(function(m, idx) {
        var clean = m.replace(/[﴿﴾]/g, '').trim();
        if (/(?:[\d]+[\s\.\-\)]|أدلة|المحور|المبحث|فالعقل|التأمل|ليطمئن|قال تعالى|سواء أكان|مخلوق عاجز|امنص|ابكوك)/.test(clean)) return;
        var wordsCount = clean.split(/\s+/).filter(function(w) { return /[\u0600-\u06FF]{2,}/.test(w); }).length;
        if (clean && wordsCount >= 4 && clean.length >= 18 && !clean.includes('صفحة')) {
          var alreadyIn = quranicVerses.some(function(q) {
            return q.plainText === clean || q.plainText.includes(clean.slice(0, 15)) || clean.includes(q.plainText.slice(0, 15));
          });
          if (!alreadyIn) {
            quranicVerses.push({
              id: 'q_dyn_' + idx,
              type: 'quran',
              arabicText: '« ' + clean + ' »',
              plainText: clean,
              citation: 'القرآن الكريم',
              grading: 'متواتر قطعي الثبوت'
            });
          }
        }
      });

      // Authentic Hadith Extractor
      if (/باب الجنة|فأستفتح|فيقول الخازن|بك أمرت|ألا أفتح لأحد قبلك/.test(text)) {
        hadiths.push({
          id: 'h_shafaa_bab',
          type: 'hadith',
          arabicText: '« آتِي بَابَ الْجَنَّةِ يَوْمَ الْقِيَامَةِ فَأَسْتَفْتِحُ، فَيَقُولُ الْخَازِنُ: مَنْ أَنْتَ؟ فَأَقُولُ: مُحَمَّدٌ، فَيَقُولُ: بِكَ أُمِرْتُ لَا أَفْتَحُ لِأَحَدٍ قَبْلَكَ »',
          englishTranslation: 'I will come to the gate of Paradise on the Day of Resurrection and ask for it to be opened...',
          source: 'صحيح مسلم (197)',
          narrator: 'أنس بن مالك رضي الله عنه',
          grading: 'صحيح'
        });
      }

      if (/أعمى سأله|هل تسمع النداء|فأجب|من سمع النداء/.test(text)) {
        hadiths.push({
          id: 'h_aama_jamaah',
          type: 'hadith',
          arabicText: '« أَتَى النَّبِيَّ ﷺ رَجُلٌ أَعْمَى، فَقَالَ: يَا رَسُولَ اللَّهِ، إِنَّهُ لَيْسَ لِي قَائِدٌ يَقُودُنِي إِلَى الْمَسْجِدِ، فَهَلْ لِي مِنْ رُخْصَةٍ أَنْ أُصَلِّيَ فِي بَيْتِي؟ فَقَالَ: هَلْ تَسْمَعُ النِّدَاءَ بِالصَّلَاةِ؟ قَالَ: نَعَمْ، قَالَ: فَأَجِبْ »',
          englishTranslation: 'A blind man came to the Prophet and asked for permission to pray at home...',
          source: 'صحيح مسلم (653)',
          narrator: 'أبو هريرة رضي الله عنه',
          grading: 'صحيح'
        });
      }

      if (/تفضل صلاة الفذ|بسبع وعشرين درجة/.test(text)) {
        hadiths.push({
          id: 'h_fadl_jamaah',
          type: 'hadith',
          arabicText: '« صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً »',
          englishTranslation: 'Prayer in congregation is twenty-seven degrees superior to prayer performed individually',
          source: 'صحيح البخاري ومسلم',
          narrator: 'عبدالله بن عمر رضي الله عنهما',
          grading: 'متفق عليه'
        });
      }

      if (/من أدرك ركعة من الصلاة/.test(text)) {
        hadiths.push({
          id: 'h_idrak_rakah',
          type: 'hadith',
          arabicText: '« مَنْ أَدْرَكَ رَكْعَةً مِنَ الصَّلَاةِ، فَقَدْ أَدْرَكَ الصَّلَاةَ »',
          englishTranslation: 'Whoever catches up with one rakah of the prayer has caught up with the prayer',
          source: 'صحيح البخاري ومسلم',
          narrator: 'أبو هريرة رضي الله عنه',
          grading: 'متفق عليه'
        });
      }

      if (/أثقل صلاة على المنافقين/.test(text)) {
        hadiths.push({
          id: 'h_athqal_salah',
          type: 'hadith',
          arabicText: '« إِنَّ أَثْقَلَ صَلَاةٍ عَلَى الْمُنَافِقِينَ صَلَاةُ الْعِشَاءِ وَصَلَاةُ الْفَجْرِ، وَلَوْ يَعْلَمُونَ مَا فِيهِمَا لَأَتَوْهُمَا وَلَوْ حَبْوًا »',
          englishTranslation: 'The most burdensome prayers for the hypocrites are Isha and Fajr...',
          source: 'صحيح البخاري ومسلم',
          narrator: 'أبو هريرة رضي الله عنه',
          grading: 'متفق عليه'
        });
      }

      if (/عذاب القبر|استعيذوا بالله|البراء بن عازب|جنازة رجل من الأنصار/.test(text)) {
        hadiths.push({
          id: 'h_baraa',
          type: 'hadith',
          arabicText: '« اسْتَعِيذُوا بِاللَّهِ مِنْ عَذَابِ الْقَبْرِ ... يُثَبِّتُ اللَّهُ الَّذِينَ آمَنُوا بِالْقَوْلِ الثَّابِتِ فِي الْحَيَاةِ الدُّنْيَا وَفِي الْآخِرَةِ »',
          englishTranslation: 'Seek refuge with Allah from the punishment of the grave',
          source: 'صحيح أبي داود',
          narrator: 'البراء بن عازب رضي الله عنه',
          grading: 'صحيح'
        });
      }

      if (/مقلب القلوب/.test(text)) {
        hadiths.push({
          id: 'h_quloob',
          type: 'hadith',
          arabicText: '« يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ »',
          englishTranslation: 'O Turner of hearts, keep my heart firm upon Your religion',
          source: 'جامع الترمذي ومسند أحمد',
          narrator: 'أم سلمة / أنس بن مالك رضي الله عنهما',
          grading: 'صحيح'
        });
      }

      if (/تركت فيكم|كتاب الله وسنة/.test(text)) {
        hadiths.push({
          id: 'h_turiktu',
          type: 'hadith',
          arabicText: '« تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ »',
          englishTranslation: 'I have left among you two things...',
          source: 'الموطأ ومستدرك الحاكم',
          narrator: 'مالك بن أنس مرسلاً / ابن عباس',
          grading: 'صحيح لغيره'
        });
      }

      return {
        quranicVerses: quranicVerses,
        hadiths: hadiths,
        scholarlyProofs: scholarlyProofs
      };
    }
