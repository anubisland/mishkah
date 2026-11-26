    // The student window shared on Zoom. It has no controls: it shows whatever
    // the teacher's window last published (see stage-channel.jsx).
    function StudentStage() {
      const stage = useLiveStage();

      useEffect(() => {
        document.title = 'مِشكاة | شاشة الطالب';
      }, []);

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
              <h1 className="text-lg sm:text-xl font-black font-cairo text-gold-200 leading-tight">{title}</h1>
              {subtitle && <span className="text-xs sm:text-sm text-gold-300/80 font-bold">{subtitle}</span>}
            </div>
            <span className="text-xs font-bold text-gold-300/70 font-cairo">مِشكاة</span>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center p-3">{children}</div>
        </div>
      );
    }

    // Shrinks its content (never enlarges it) so a whole slide always fits the
    // student window, whatever size the teacher gives that window.
    function FitToScreen({ children }) {
      const boxRef = useRef(null);
      const contentRef = useRef(null);
      const [scale, setScale] = useState(1);
      useEffect(() => {
        const fit = () => {
          const box = boxRef.current;
          const content = contentRef.current;
          if (!box || !content) return;
          const next = Math.min(1, box.clientWidth / content.scrollWidth, box.clientHeight / content.scrollHeight);
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
            <p className="text-base sm:text-lg text-gold-100/80 font-cairo">سيظهر هنا ما تعرضه المعلمة</p>
          </div>
        </StudentFrame>
      );
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
        <StudentFrame title={surahNameForPage(page)} subtitle={'الصفحة ' + page}>
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
      return (
        <StudentFrame title={stage.surahName} subtitle={'الآيات ' + stage.ayahRange + ' — الصفحة ' + stage.page}>
          <FitToScreen>
            <div className="bg-[#FFFDF9] text-black rounded-3xl border-4 border-gold-500/70 shadow-2xl px-10 py-6" style={{ width: '1100px' }}>
              {shouldShowBasmalah(stage.surahName, stage.ayahs) && (
              <div className="text-center font-quran text-3xl text-emerald-900 mb-5 pb-3 border-b border-gold-400/40">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              )}
              <div className="font-quran text-4xl leading-[2.3] text-right" dir="rtl">
                {ayahs.map((ayah) => {
                  const { isRevealed } = recitationAyahVisibility(ayah.num, masks);
                  const words = ayah.text.split(' ');
                  return (
                    <span key={ayah.num} className="font-quran">
                      {isRevealed ? words.map((word, wIdx) => (
                        isRecitationWordMasked(ayah.num, words, wIdx, masks)
                          ? <span key={wIdx} className="font-quran inline-block mx-1 px-6 rounded-lg bg-amber-100 border-b-4 border-dashed border-amber-500 text-transparent select-none">ـــــ</span>
                          : <span key={wIdx} className="font-quran">{word} </span>
                      )) : (
                        <span className="inline-block mx-1 px-10 rounded-xl bg-emerald-900/10 border-2 border-dashed border-emerald-800/40 text-emerald-900/50 text-2xl font-cairo align-middle">🔒</span>
                      )}
                      <span className="font-quran text-gold-600 mx-1">﴿{ayah.num}﴾</span>{' '}
                    </span>
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
      return (
        <StudentFrame title={lesson.titleAr} subtitle={lesson.suwaydRef}>
          <FitToScreen>
            <div className="bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white rounded-3xl border-2 border-gold-400/80 shadow-2xl p-6 sm:p-8" style={{ width: '1024px' }}>
            <TajweedZoomSlideBody
              activeSuwaydPlateId={stage.plateId}
              currentSuwaydLesson={lesson}
              currentZoomSlides={slides}
              isRtl={true}
              metronomeBeat={metronome.beat || 1}
              metronomeCount={metronome.count || lesson.timingCounts || 2}
              metronomePlaying={!!metronome.playing}
              setActiveSuwaydPlateId={ignore}
              setMetronomeCount={ignore}
              setMetronomePlaying={ignore}
              suwaydZoomSlideIndex={stage.slideIndex || 0}
            />
            </div>
          </FitToScreen>
        </StudentFrame>
      );
    }

    // A lecture-deck slide filling the window at 16:9, on a dark surround.
    function StudentDeckView({ stage }) {
      const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
      useEffect(() => {
        const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);
      const deck = normalizeDeck(stage.deck);
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
