    // The student window shared on Zoom. It has no controls: it shows whatever
    // the teacher's window last published (see stage-channel.jsx).
    function StudentStage() {
      const stage = useLiveStage();

      useEffect(() => {
        document.title = 'مِشكاة | شاشة الطالب';
      }, []);

      if (!stage) return <StudentWaitingScreen />;
      if (stage.kind === 'mushaf') return <StudentMushafView stage={stage} />;
      if (stage.kind === 'tajweed') return <StudentTajweedView stage={stage} />;
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
