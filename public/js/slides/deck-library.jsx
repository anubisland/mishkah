    // The teacher's library of lecture presentations, on this device. The
    // studio edits one deck at a time (deck-store.jsx); the library keeps the
    // others, and remembers which entry the open deck came from so saving it
    // again updates that entry instead of adding a copy.
    //
    // entry = { id, title, savedAt (ISO), slideCount, deck }
    const DECK_LIBRARY_KEY = 'mishkah_deck_library';
    const DECK_LIBRARY_CURRENT_KEY = 'mishkah_deck_library_current';

    function loadDeckLibrary() {
      try {
        const saved = localStorage.getItem(DECK_LIBRARY_KEY);
        const list = saved ? JSON.parse(saved) : [];
        return Array.isArray(list) ? list.filter((e) => e && e.id && e.deck) : [];
      } catch (e) {
        console.warn('Mishkah: the presentations library is unreadable', e);
        return [];
      }
    }

    // Returns an Arabic error message, or null when saved.
    function writeDeckLibrary(list) {
      try {
        localStorage.setItem(DECK_LIBRARY_KEY, JSON.stringify(list));
        return null;
      } catch (e) {
        console.warn('Mishkah: could not save the presentations library', e);
        return 'تعذّر الحفظ في المكتبة (قد تكون ذاكرة الجهاز ممتلئة). يمكن تصدير العرض PDF أو باوربوينت للاحتفاظ به.';
      }
    }

    function currentLibraryId() {
      try { return localStorage.getItem(DECK_LIBRARY_CURRENT_KEY) || ''; } catch (e) { return ''; }
    }

    function setCurrentLibraryId(id) {
      try {
        if (id) localStorage.setItem(DECK_LIBRARY_CURRENT_KEY, id);
        else localStorage.removeItem(DECK_LIBRARY_CURRENT_KEY);
      } catch (e) {
        console.warn('Mishkah: could not remember the open presentation', e);
      }
    }

    // Saves the open deck into the library (updating its own entry).
    // Returns { error } — error is null when saved or when there is nothing to save.
    function saveOpenDeckToLibrary() {
      const deck = readSavedDeck();
      if (!deck || !deck.slides.length) return { error: null };
      const list = loadDeckLibrary();
      const id = currentLibraryId() || ('d' + Date.now().toString(36));
      const entry = { id, title: deck.title || 'عرض بلا عنوان', savedAt: new Date().toISOString(), slideCount: deck.slides.length, deck };
      const next = list.some((e) => e.id === id) ? list.map((e) => (e.id === id ? entry : e)) : [entry].concat(list);
      const error = writeDeckLibrary(next);
      if (!error) setCurrentLibraryId(id);
      return { error };
    }

    // Makes a library entry (or a new empty deck) the one the studio opens,
    // after keeping the open deck in the library. Returns an error or null.
    function openDeckFromLibrary(entryId) {
      const kept = saveOpenDeckToLibrary();
      if (kept.error) return kept.error;
      const entry = entryId ? loadDeckLibrary().find((e) => e.id === entryId) : null;
      const error = saveDeck(entry ? entry.deck : normalizeDeck({ slides: [] }));
      if (error) return error;
      setCurrentLibraryId(entry ? entry.id : '');
      return null;
    }

    function deleteFromDeckLibrary(entryId) {
      const error = writeDeckLibrary(loadDeckLibrary().filter((e) => e.id !== entryId));
      if (!error && currentLibraryId() === entryId) setCurrentLibraryId('');
      return error;
    }
