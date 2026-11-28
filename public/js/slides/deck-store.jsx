    // The studio's deck state: every change is saved on the device at once and
    // can be undone. Slides are edited by id so a reorder never edits the wrong one.
    const DECK_STORAGE_KEY = 'mishkah_lecture_deck';
    const DECK_UNDO_LIMIT = 40;

    // A saved deck that cannot be read is kept aside, never overwritten, so the
    // teacher's work can still be recovered.
    function loadSavedDeck() {
      let saved = null;
      try {
        saved = localStorage.getItem(DECK_STORAGE_KEY);
        return { deck: saved ? normalizeDeck(JSON.parse(saved)) : null, error: null };
      } catch (e) {
        console.warn('Mishkah: saved deck is unreadable', e);
        try {
          // One copy only: the deck is read on many renders.
          if (saved && localStorage.getItem(DECK_STORAGE_KEY + '_unreadable') === null) localStorage.setItem(DECK_STORAGE_KEY + '_unreadable', saved);
        } catch (backupError) {
          console.warn('Mishkah: could not keep a copy of the unreadable deck', backupError);
        }
        return { deck: null, error: 'تعذّرت قراءة العرض المحفوظ سابقاً، فاحتفظنا بنسخة منه على الجهاز ولم نحذفه.' };
      }
    }

    // Reads the deck the studio saved; the student window uses it too.
    function readSavedDeck() {
      return loadSavedDeck().deck;
    }

    function saveDeck(deck) {
      try {
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
        return null;
      } catch (e) {
        console.warn('Mishkah: could not save the deck', e);
        return 'تعذّر حفظ العرض على الجهاز (قد تكون الذاكرة ممتلئة). يُنصح بتصدير العرض قبل إغلاق الاستوديو.';
      }
    }

    function useDeckStore() {
      const [initial] = useState(loadSavedDeck);
      const [deck, setDeckState] = useState(() => initial.deck || normalizeDeck({ slides: [] }));
      const [history, setHistory] = useState([]);
      const [saveError, setSaveError] = useState(null);
      const [loadError, setLoadError] = useState(initial.error);

      // Saving happens with the change itself, not in an effect, so an edit
      // made just before the studio closes is never lost.
      const apply = (next) => {
        setDeckState(next);
        setSaveError(saveDeck(next));
        setLoadError(null);
      };

      const commit = (next) => {
        setHistory((h) => h.concat([deck]).slice(-DECK_UNDO_LIMIT));
        apply(next);
      };

      const replaceSlides = (fn) => commit(Object.assign({}, deck, { slides: fn(deck.slides) }));

      return {
        deck,
        saveError,
        loadError,
        canUndo: history.length > 0,
        undo: () => {
          if (!history.length) return;
          apply(history[history.length - 1]);
          setHistory((h) => h.slice(0, -1));
        },
        replaceDeck: (next) => commit(normalizeDeck(next)),
        setFrame: (frame) => commit(Object.assign({}, deck, { frame })),
        updateSlide: (id, field, value) => replaceSlides((slides) => slides.map((s) => (s.id === id ? Object.assign({}, s, { [field]: value }) : s))),
        moveSlide: (id, delta) => replaceSlides((slides) => {
          const i = slides.findIndex((s) => s.id === id);
          const j = i + delta;
          if (i < 0 || j < 0 || j >= slides.length) return slides;
          const copy = slides.slice();
          [copy[i], copy[j]] = [copy[j], copy[i]];
          return copy;
        }),
        removeSlide: (id) => replaceSlides((slides) => slides.filter((s) => s.id !== id)),
        insertSlideAfter: (id, slide) => replaceSlides((slides) => {
          const i = slides.findIndex((s) => s.id === id);
          const copy = slides.slice();
          copy.splice(i + 1, 0, slide);
          return copy;
        })
      };
    }
