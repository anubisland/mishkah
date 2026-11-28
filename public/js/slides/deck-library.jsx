    // The teacher's library of lecture presentations, on this device. The
    // studio edits one deck at a time (deck-store.jsx); the library keeps the
    // others, and remembers which entry the open deck came from so saving it
    // again updates that entry instead of adding a copy.
    //
    // entry = { id, title, savedAt (ISO), slideCount, deck }
    //
    // Nothing here writes over data it could not read: an unreadable library
    // or open deck stops the action with a message instead.
    const DECK_LIBRARY_KEY = 'mishkah_deck_library';
    const DECK_LIBRARY_CURRENT_KEY = 'mishkah_deck_library_current';
    const DECK_LIBRARY_UNREADABLE = 'تعذّرت قراءة مكتبة المحاضرات، فاحتفظنا بنسخة منها على الجهاز ولم نكتب فوقها. يمكن تصدير العرض PDF أو باوربوينت للاحتفاظ به.';

    const isLibraryEntry = (e) => !!(e && e.id && e.deck);

    // Returns { list, error }. list keeps every stored item, even ones the page
    // cannot show, so a later save never drops them.
    function readDeckLibrary() {
      let saved = null;
      try {
        saved = localStorage.getItem(DECK_LIBRARY_KEY);
        const list = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(list)) throw new Error('not a list');
        return { list, error: null };
      } catch (e) {
        console.warn('Mishkah: the presentations library is unreadable', e);
        try {
          if (saved) localStorage.setItem(DECK_LIBRARY_KEY + '_unreadable_' + Date.now(), saved);
        } catch (backupError) {
          console.warn('Mishkah: could not keep a copy of the unreadable library', backupError);
        }
        return { list: [], error: DECK_LIBRARY_UNREADABLE };
      }
    }

    // The entries the page shows.
    function loadDeckLibrary() {
      return readDeckLibrary().list.filter(isLibraryEntry);
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

    // Returns an error or null. A pointer left on the wrong entry would make
    // the next save write one lecture over another, so callers must check it.
    function setCurrentLibraryId(id) {
      try {
        if (id) localStorage.setItem(DECK_LIBRARY_CURRENT_KEY, id);
        else localStorage.removeItem(DECK_LIBRARY_CURRENT_KEY);
        return null;
      } catch (e) {
        console.warn('Mishkah: could not remember the open presentation', e);
        return 'تعذّر تسجيل المحاضرة المفتوحة (قد تكون ذاكرة الجهاز ممتلئة).';
      }
    }

    // Saves the open deck into the library (updating its own entry).
    // Returns { error } — error is null when saved or when there is nothing to save.
    function saveOpenDeckToLibrary() {
      const open = loadSavedDeck();
      if (open.error) return { error: open.error };
      const deck = open.deck;
      if (!deck || !deck.slides.length) return { error: null };
      const { list, error: readError } = readDeckLibrary();
      if (readError) return { error: readError };
      const id = currentLibraryId() || ('d' + Date.now().toString(36));
      const entry = { id, title: deck.title || 'عرض بلا عنوان', savedAt: new Date().toISOString(), slideCount: deck.slides.length, deck };
      const next = list.some((e) => e && e.id === id) ? list.map((e) => (e && e.id === id ? entry : e)) : [entry].concat(list);
      const error = writeDeckLibrary(next) || setCurrentLibraryId(id);
      return { error };
    }

    // Makes a library entry (or a new empty deck when entryId is null) the one
    // the studio opens, after keeping the open deck in the library.
    // Returns an error or null.
    function openDeckFromLibrary(entryId) {
      const kept = saveOpenDeckToLibrary();
      if (kept.error) return kept.error;
      const entry = entryId ? loadDeckLibrary().find((e) => e.id === entryId) : null;
      if (entryId && !entry) return 'لم تعد هذه المحاضرة في المكتبة.';
      // Clear the pointer, write the deck, then point at its entry. If any
      // step fails, the worst result is a duplicate copy in the library on
      // the next save, never one lecture written over another.
      const cleared = setCurrentLibraryId('');
      if (cleared) return cleared;
      const deckError = saveDeck(entry ? entry.deck : normalizeDeck({ slides: [] }));
      if (deckError) return deckError;
      return entry ? setCurrentLibraryId(entry.id) : null;
    }

    // Deleting the open lecture also closes it, or the next save would bring
    // it back under a new id.
    function deleteFromDeckLibrary(entryId) {
      const { list, error: readError } = readDeckLibrary();
      if (readError) return readError;
      const error = writeDeckLibrary(list.filter((e) => !(e && e.id === entryId)));
      if (error || currentLibraryId() !== entryId) return error;
      return setCurrentLibraryId('') || saveDeck(normalizeDeck({ slides: [] }));
    }
