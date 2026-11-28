    // English translation of the meanings (Sahih International), for classes
    // taught in English. Fetched per mushaf page and kept on the device, so a
    // page needs the internet only the first time.
    const MEANING_EDITION = 'en.sahih';
    const MEANING_SOURCE_NOTE = 'Translation of the meanings: Sahih International';

    // { 'surah:ayah': text } for one page, or null when it cannot be fetched.
    async function fetchPageMeanings(page) {
      const key = 'mishkah_meanings_' + MEANING_EDITION + '_' + page;
      try {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Mishkah: saved translation is unreadable', e);
      }
      try {
        const res = await fetch('https://api.alquran.cloud/v1/page/' + page + '/' + MEANING_EDITION);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        const map = {};
        (json.data && json.data.ayahs || []).forEach((a) => { map[a.surah.number + ':' + a.numberInSurah] = a.text; });
        try { localStorage.setItem(key, JSON.stringify(map)); } catch (e) { console.warn('Mishkah: could not keep the translation', e); }
        return map;
      } catch (e) {
        console.warn('Mishkah: could not fetch the translation of page ' + page, e);
        return null;
      }
    }

    // The English name of a surah, «Surah Al-Mulk».
    function surahEnglishName(surahId) {
      const s = (typeof ALL_QURAN_SURAHS !== 'undefined' ? ALL_QURAN_SURAHS : []).find((x) => x.id === surahId);
      return s ? 'Surah ' + s.en : '';
    }

    // Translation is shown for an ayah only when the student can read the
    // whole ayah: a hidden ayah or hidden words must not leak through it.
    function meaningVisible(ayahKeyValue, words, masks) {
      if (!recitationAyahVisibility(ayahKeyValue, masks).isRevealed) return false;
      return !words.some((w, i) => isRecitationWordMasked(ayahKeyValue, words, i, masks));
    }
