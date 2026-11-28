    // The student window shared on Zoom. It has no controls: it shows whatever
    // the teacher's window last published (see stage-channel.jsx).
    // previewStage: set when the teacher's class panel shows a small copy of
    // the student window; the same views draw both, so they always match.
    const StudentViewportContext = React.createContext(null);

    function StudentStage({ previewStage }) {
      const liveStage = useLiveStage();
      const isPreview = previewStage !== undefined;
      useStudentAlertListener(!isPreview);
      const stage = isPreview ? previewStage : liveStage;

      useEffect(() => {
        if (!isPreview) document.title = 'مِشكاة | شاشة الطالب';
      }, [isPreview]);

      if (!stage) return <StudentWaitingScreen />;
      if (stage.kind === 'mushaf') return <StudentMushafView stage={stage} />;
      if (stage.kind === 'recitation') return <StudentRecitationView stage={stage} />;
      if (stage.kind === 'tajweed') return <StudentTajweedView stage={stage} />;
      if (stage.kind === 'deck') return <StudentDeckView stage={stage} />;
      if (stage.kind === 'slides') return <StudentProjectorScreen />;
      return <StudentWaitingScreen />;
    }

    // Shared frame: a slim title band over the content, on the Islamic pattern.
    function StudentFrame({ title, subtitle, children }) {
      return (
        <div className="h-screen max-h-screen flex flex-col text-white overflow-hidden select-none emerald-pattern" dir="rtl">
          <div className="shrink-0 flex items-center justify-between px-5 py-2 border-b border-gold-400/30">
            <div>
              <h1 dir="auto" className="text-xl sm:text-2xl font-bold font-naskh text-gold-200 leading-snug">{title}</h1>
              {subtitle && <span dir="auto" className="text-xs sm:text-sm text-gold-300/80 font-bold">{subtitle}</span>}
            </div>
            <span className="text-xs font-bold text-gold-300/70 font-cairo">مِشكاة</span>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center p-3">{children}</div>
        </div>
      );
    }

    // True when the student window is tall and narrow (a half screen).
    function useTallWindow() {
      const check = () => window.innerHeight > window.innerWidth * 0.85;
      const [tall, setTall] = useState(check);
      useEffect(() => {
        const onResize = () => setTall(check());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);
      return tall;
    }

    // Scales its content to fill the student window (shrinking, or growing up
    // to twice its size), whatever size the teacher gives that window.
    function FitToScreen({ children }) {
      const boxRef = useRef(null);
      const contentRef = useRef(null);
      const [scale, setScale] = useState(1);
      useEffect(() => {
        const fit = () => {
          const box = boxRef.current;
          const content = contentRef.current;
          if (!box || !content) return;
          // Grows to fill a large window too (up to twice its size), so students
          // on Zoom see it as big as the window allows.
          const next = Math.min(2, box.clientWidth / content.scrollWidth, box.clientHeight / content.scrollHeight);
          setScale(next > 0 ? next : 1);
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(boxRef.current);
        observer.observe(contentRef.current);
        return () => observer.disconnect();
      }, []);
      return (
        <div ref={boxRef} className="w-full h-full flex items-center justify-center overflow-hidden">
          <div ref={contentRef} style={{ transform: 'scale(' + scale + ')', transformOrigin: 'center center' }}>
            {children}
          </div>
        </div>
      );
    }

    function StudentWaitingScreen() {
      return (
        <StudentFrame title="مِشكاة" subtitle="شاشة الطالب">
          <div className="text-center">
            <p className="text-4xl sm:text-5xl text-gold-200 font-amiri mb-4">بسم الله الرحمن الرحيم</p>
            <p className="text-base sm:text-lg text-gold-100/80 font-cairo">سيظهر هنا ما يعرضه المعلم</p>
          </div>
        </StudentFrame>
      );
    }

    function surahIdForPage(page) {
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const hit = surahs.find((s) => s.startPage <= page && s.endPage >= page);
      return hit ? hit.id : 0;
    }

    function surahNameForPage(page) {
      const surahs = typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : [];
      const hit = surahs.filter((s) => s.startPage <= page).pop();
      return hit ? 'سورة ' + hit.name : '';
    }

    // The whole mushaf page, fitted to the window height, with the teacher's
    // chosen mask drawn fully opaque.
    function StudentMushafView({ stage }) {
      const page = parseInt(stage.page, 10) || 1;
      return (
        <StudentFrame title={stage.lang === 'en' ? surahEnglishName(surahIdForPage(page)) : surahNameForPage(page)} subtitle={stage.lang === 'en' ? 'Page ' + page : 'الصفحة ' + page}>
          <div className="relative h-full bg-[#FFFDF9] rounded-xl shadow-2xl border-4 border-gold-500/70 p-2">
            <div className="relative h-full">
              <img
                key={page}
                src={mushafPageImageUrl(page)}
                alt={'مصحف المدينة النبوية — صفحة ' + page}
                className="h-full w-auto block mx-auto"
              />
              <MushafMaskOverlay
                mushafOverlayMode={stage.overlayMode}
                activeRulerLine={stage.rulerLine || 1}
                isRtl={true}
                dimmed={false}
              />
            </div>
          </div>
        </StudentFrame>
      );
    }

    // The recitation board: the page's ayahs in Uthmani script, with every word
    // and ayah the teacher hid replaced by a blank the student must fill aloud.
    function StudentRecitationView({ stage }) {
      const masks = recitationMasksFromStage(stage);
      const ayahs = stage.isReverseOrder ? [...(stage.ayahs || [])].reverse() : (stage.ayahs || []);
      const en = stage.lang === 'en';
      return (
        <StudentFrame title={en ? surahEnglishName((stage.ayahs && stage.ayahs[0] && stage.ayahs[0].surahNumber) || surahIdForPage(stage.page)) || 'Recitation' : stage.surahName}
          subtitle={en ? 'Page ' + stage.page : 'الآيات ' + stage.ayahRange + ' — الصفحة ' + stage.page}>
          <FitToScreen>
            <div className="bg-[#FFFDF9] text-black rounded-3xl border-4 border-gold-500/70 shadow-2xl px-10 py-6" style={{ width: '1100px' }}>
              {shouldShowBasmalah(stage.surahName, stage.ayahs) && (
              <div className="text-center font-quran text-3xl text-emerald-900 mb-5 pb-3 border-b border-gold-400/40">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              )}
              {/* Not a font-quran container in English: the meanings between the
                  ayahs must not take the Quran font. */}
              <div className={(en ? '' : 'font-quran ') + 'text-4xl leading-[2.3] text-right'} dir="rtl">
                {ayahs.map((ayah, ayahIdx) => {
                  const { isRevealed } = recitationAyahVisibility(ayahKey(ayah), masks);
                  const words = ayah.text.split(' ');
                  const meaning = ayah.meaning && meaningVisible(ayahKey(ayah), words, masks) ? ayah.meaning : '';
                  return (
                    <React.Fragment key={ayahKey(ayah)}>
                    <span className="font-quran">
                      {!stage.isReverseOrder && startsSurahMidList(ayah, ayahIdx) && (
                        <span className="block text-center text-3xl text-emerald-900 my-3 py-2 border-y border-gold-400/40">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                      )}
                      {isRevealed ? words.map((word, wIdx) => (
                        isRecitationWordMasked(ayahKey(ayah), words, wIdx, masks)
                          ? <span key={wIdx} className="font-quran inline-block mx-1 px-6 rounded-lg bg-amber-100 border-b-4 border-dashed border-amber-500 text-transparent select-none">ـــــ</span>
                          : <span key={wIdx} className="font-quran">{word} </span>
                      )) : (
                        <span className="inline-block mx-1 px-10 rounded-xl bg-emerald-900/10 border-2 border-dashed border-emerald-800/40 text-emerald-900/50 text-2xl font-cairo align-middle">🔒</span>
                      )}
                      <span className="font-quran text-gold-600 mx-1">﴿{ayah.num}﴾</span>{' '}
                    </span>
                    {meaning && <span className="block text-left text-2xl leading-relaxed text-slate-700 font-sans my-2" dir="ltr">({ayah.num}) {meaning}</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </FitToScreen>
        </StudentFrame>
      );
    }

    // The tajweed lesson slide the teacher is presenting. The student window
    // only displays it, so every setter it is given does nothing.
    function StudentTajweedView({ stage }) {
      const lesson = SUWAYD_TAJWEED_CURRICULUM.find((l) => l.id === stage.lessonId) || SUWAYD_TAJWEED_CURRICULUM[0];
      const slides = buildTajweedZoomSlides(lesson);
      const metronome = stage.metronome || {};
      const ignore = () => {};
      // A half-screen window is tall and narrow: a narrower slide stacks taller
      // and then grows to fill it, instead of leaving space above and below.
      const tall = useTallWindow();
      return (
        <StudentFrame title={stage.lang === 'en' ? (lesson.titleEn || lesson.titleAr) : lesson.titleAr} subtitle={lesson.suwaydRef}>
          <FitToScreen>
            <div className="bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white rounded-3xl border-2 border-gold-400/80 shadow-2xl p-6 sm:p-8" style={{ width: tall ? '720px' : '1024px' }}>
            <TajweedZoomSlideBody
              activeSuwaydPlateId={stage.plateId}
              currentSuwaydLesson={lesson}
              currentZoomSlides={slides}
              isRtl={stage.lang !== 'en'}
              metronomeBeat={metronome.beat || 1}
              metronomeCount={metronome.count || lesson.timingCounts || 2}
              metronomePlaying={!!metronome.playing}
              setActiveSuwaydPlateId={ignore}
              setMetronomeCount={ignore}
              setMetronomePlaying={ignore}
              suwaydZoomSlideIndex={stage.slideIndex || 0}
              readOnly
              plateLarge={!!stage.plateLarge}
            />
            </div>
          </FitToScreen>
        </StudentFrame>
      );
    }

    // A lecture-deck slide filling the window at 16:9, on a dark surround.
    function StudentDeckView({ stage }) {
      const previewSize = React.useContext(StudentViewportContext);
      const [windowSize, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
      const size = previewSize || windowSize;
      useEffect(() => {
        const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);
      // The deck lives in the studio's saved copy; re-read it on every stage
      // message and whenever the studio saves.
      const [deckVersion, setDeckVersion] = useState(0);
      useEffect(() => {
        const onStorage = (e) => { if (e.key === DECK_STORAGE_KEY) setDeckVersion((v) => v + 1); };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
      }, []);
      const deck = useMemo(() => readSavedDeck() || normalizeDeck({ slides: [] }), [stage.sentAt, deckVersion]);
      const index = Math.min(Math.max(0, stage.index || 0), Math.max(0, deck.slides.length - 1));
      const slide = deck.slides[index];
      if (!slide) return <StudentWaitingScreen />;
      const width = Math.floor(Math.min(size.w, size.h * 16 / 9));
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#0b1f18] overflow-hidden">
          <ScaledSlide width={width}>
            <SlideView slide={slide} deck={deck} index={index} total={deck.slides.length} />
          </ScaledSlide>
        </div>
      );
    }

    // A scaled-down copy of the student window for the teacher's class panel.
    const STUDENT_PREVIEW_SIZE = { w: 1280, h: 720 };
    function StudentPreview({ stage, width }) {
      const scale = width / STUDENT_PREVIEW_SIZE.w;
      return (
        <div className="mk-student-preview rounded-lg overflow-hidden border-2 border-emerald-900/30 shadow"
          style={{ width: width + 'px', height: (STUDENT_PREVIEW_SIZE.h * scale) + 'px', position: 'relative' }}>
          <div style={{ width: STUDENT_PREVIEW_SIZE.w + 'px', height: STUDENT_PREVIEW_SIZE.h + 'px', transform: 'scale(' + scale + ')', transformOrigin: 'top right', position: 'absolute', top: 0, right: 0 }}>
            <StudentViewportContext.Provider value={STUDENT_PREVIEW_SIZE}>
              <StudentStage previewStage={stage || null} />
            </StudentViewportContext.Provider>
          </div>
        </div>
      );
    }
