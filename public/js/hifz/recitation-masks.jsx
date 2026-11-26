    // Which ayahs and words of the recitation board are hidden from the student.
    // One set of rules for the teacher's board and the student screen, so both
    // always agree on what is hidden.
    //
    // masks: {
    //   isEndingsMasked, isStartersMasked, isDivineNamesMasked, isAlternatingMasked,
    //   isFullMasked, revealedAyahs: Set, customMaskedWords: Set ('key-word'),
    //   passageMaskedAyahs: Set, passageStatus
    // }
    // Every set holds ayah keys (see ayahKey), never bare ayah numbers.

    // A mushaf page can end one surah and start the next (page 440: Fatir 45,
    // then Ya-Sin 1), so an ayah is known by its surah and its number.
    function ayahKey(ayah) {
      return ayah.surahNumber ? ayah.surahNumber + ':' + ayah.num : String(ayah.num);
    }

    // The ayah number alone, for showing a key to the teacher.
    function ayahKeyNumber(key) {
      return String(key).split(':').pop();
    }

    // Common Quranic divine names and attributes that close ayahs.
    const DIVINE_ENDINGS_LIST = ['ٱلْعَزِيزُ', 'الْعَزِيزُ', 'ٱلْعَزِيزِ', 'ٱلْغَفُورُ', 'الْغَفُورُ', 'ٱلرَّحِيمُ', 'الرَّحِيمُ', 'ٱلسَّمِيعُ', 'السَّمِيعُ', 'ٱلْعَلِيمُ', 'الْعَلِيمُ', 'قَدِيرٌ', 'عَلِيمٌ', 'حَكِيمٌ', 'غَفُورٌ', 'رَّحِيمٌ', 'خَبِيرٌ', 'بَصِيرٌ', 'ٱلتَّوَّابُ', 'التَّوَّابُ', 'ٱلْحَمِيدُ'];

    function recitationAyahVisibility(ayahNum, masks) {
      const isPassageMasked = masks.passageMaskedAyahs.has(ayahNum);
      const isPassageHidden = isPassageMasked && (masks.passageStatus === 'reciting' || masks.passageStatus === 'error_retry');
      const isRevealed = (!masks.isFullMasked || masks.revealedAyahs.has(ayahNum)) && !isPassageHidden;
      return { isRevealed, isPassageHidden };
    }

    function isRecitationWordMasked(ayahNum, words, wIdx, masks) {
      const word = words[wIdx];
      const isEndingWord = masks.isEndingsMasked && (wIdx >= words.length - 2);
      const isStarterWord = masks.isStartersMasked && (wIdx < 2);
      const isDivineNameWord = masks.isDivineNamesMasked && (wIdx >= words.length - 3) && DIVINE_ENDINGS_LIST.some(d => word.includes(d) || d.includes(word));
      const isAlternatingWord = masks.isAlternatingMasked && (wIdx % 2 === 1);
      const isCustomMasked = masks.customMaskedWords.has(ayahNum + '-' + wIdx);
      return isEndingWord || isStarterWord || isDivineNameWord || isAlternatingWord || isCustomMasked;
    }

    // Sets do not survive BroadcastChannel/JSON, so the stage carries arrays.
    function recitationMasksToStage(masks) {
      return Object.assign({}, masks, {
        revealedAyahs: [...masks.revealedAyahs],
        customMaskedWords: [...masks.customMaskedWords],
        passageMaskedAyahs: [...masks.passageMaskedAyahs]
      });
    }

    function recitationMasksFromStage(stage) {
      const m = stage.masks || {};
      return Object.assign({}, m, {
        revealedAyahs: new Set(m.revealedAyahs || []),
        customMaskedWords: new Set(m.customMaskedWords || []),
        passageMaskedAyahs: new Set(m.passageMaskedAyahs || [])
      });
    }

    // The basmalah heads a surah's first ayah, except in At-Tawbah, and in
    // Al-Fatiha it is itself ayah 1 so it is not repeated above it.
    function shouldShowBasmalah(surahName, ayahs) {
      if (!ayahs || !ayahs.length || ayahs[0].num !== 1) return false;
      return !/التوبة|الفاتحة/.test(surahName || '');
    }

    // A surah that starts part-way down the page gets its own basmalah.
    function startsSurahMidList(ayah, index) {
      return index > 0 && ayah.num === 1 && !!ayah.surahNumber && ayah.surahNumber !== 1 && ayah.surahNumber !== 9;
    }
