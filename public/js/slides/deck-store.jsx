    // The studio's deck state: every change is saved on the device and can be
    // undone. Slides are edited by id so a reorder never edits the wrong one.
    const DECK_STORAGE_KEY = 'mishkah_lecture_deck';
    const DECK_UNDO_LIMIT = 40;

    function loadSavedDeck() {
      try {
        const saved = localStorage.getItem(DECK_STORAGE_KEY);
        return saved ? normalizeDeck(JSON.parse(saved)) : null;
      } catch (e) {
        console.warn('Mishkah: saved deck is unreadable, starting fresh', e);
        return null;
      }
    }

    function useDeckStore() {
      const [deck, setDeckState] = useState(() => loadSavedDeck() || normalizeDeck({ slides: [] }));
      const [history, setHistory] = useState([]);
      const [saveError, setSaveError] = useState(null);

      useEffect(() => {
        try {
          localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
          setSaveError(null);
        } catch (e) {
          console.warn('Mishkah: could not save the deck', e);
          setSaveError('تعذّر حفظ العرض على الجهاز (قد تكون الذاكرة ممتلئة).');
        }
      }, [deck]);

      const commit = (next) => {
        setHistory((h) => h.concat([deck]).slice(-DECK_UNDO_LIMIT));
        setDeckState(next);
      };

      const replaceSlides = (fn) => commit(Object.assign({}, deck, { slides: fn(deck.slides) }));

      return {
        deck,
        saveError,
        canUndo: history.length > 0,
        undo: () => {
          if (!history.length) return;
          setDeckState(history[history.length - 1]);
          setHistory((h) => h.slice(0, -1));
        },
        replaceDeck: (next) => commit(normalizeDeck(next)),
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
