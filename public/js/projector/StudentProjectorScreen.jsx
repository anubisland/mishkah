
    // Dedicated Distraction-Free Student Projector Screen (For Zoom Window Sharing)
    function StudentProjectorScreen() {
      const [data, setData] = React.useState(() => {
        try {
          const s = localStorage.getItem('mishkah_active_islamic_data');
          return s ? JSON.parse(s) : null;
        } catch(e) { return null; }
      });
      const [slideIdx, setSlideIdx] = React.useState(() => {
        try {
          const s = localStorage.getItem('mishkah_active_slide_idx');
          return s ? parseInt(s, 10) : 0;
        } catch(e) { return 0; }
      });

      React.useEffect(() => {
        document.title = 'منصة مشكاة | شاشة العرض المباشرة للطلاب (زوم)';
        let bc;
        try {
          bc = new BroadcastChannel('mishkah_presentation_sync');
          bc.onmessage = (ev) => {
            if (ev.data && ev.data.type === 'SYNC_SLIDE') {
              if (typeof ev.data.slideIndex === 'number') setSlideIdx(ev.data.slideIndex);
              if (ev.data.data) setData(ev.data.data);
            }
          };
        } catch(e) {}

        const onStorage = (e) => {
          if (e.key === 'mishkah_active_slide_idx') {
            const val = parseInt(e.newValue, 10);
            if (!isNaN(val)) setSlideIdx(val);
          }
          if (e.key === 'mishkah_active_islamic_data') {
            try {
              setData(JSON.parse(e.newValue));
            } catch(err) {}
          }
        };
        window.addEventListener('storage', onStorage);

        return () => {
          if (bc) bc.close();
          window.removeEventListener('storage', onStorage);
        };
      }, []);

      const slides = (data && ((data.zoomCards && data.zoomCards.length > 0) ? data.zoomCards : data.blueprint)) || [];
      const safeIdx = Math.max(0, Math.min(slides.length - 1, slideIdx));
      const currentSlide = slides[safeIdx] || slides[0] || {};
      const currentSlideTitle = currentSlide.slideTitle || currentSlide.titleAr || currentSlide.phaseTitle || currentSlide.phaseNameAr || (`المحور ${safeIdx + 1}`);
      const scriptureText = typeof distillSlideScripture === "function" ? distillSlideScripture(currentSlide.scriptureEvidence || currentSlide.scripture) : normalizeIslamicSacredTerms(currentSlide.scriptureEvidence || currentSlide.scripture);
      const bodyText = currentSlide.talkingPoints || currentSlide.bodyAr || currentSlide.teacherFocusAr;
      const practicalImpact = currentSlide.pedagogicalTip || currentSlide.practicalAction || 'التركيز على ربط المعنى بالسلوك العملي للدارس';
      const bullets = currentSlide.bulletPoints || (currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText]);

      return (
        <div className="h-screen max-h-screen bg-[#021f17] text-white flex flex-col justify-between p-3 sm:p-5 select-none relative overflow-hidden box-border" dir="rtl">
          {/* Top Bar for Student Display */}
          <div className="flex items-center justify-between border-b border-gold-400/30 pb-2 mb-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-gold-500 text-emerald-950 font-black flex items-center justify-center text-xs shadow-md">
                {safeIdx + 1}
              </span>
              <div>
                <h1 className="text-sm sm:text-lg font-black font-cairo text-gold-200 leading-tight">
                  {data ? (data.metadata?.topic || 'محاضرة شرعية وتأصيل علمي') : 'منصة مشكاة | شاشة العرض للطلاب'}
                </h1>
                <span className="text-[10px] sm:text-xs text-gold-300/80 font-bold">
                  {currentSlide.phaseTitle || `المحور ${safeIdx + 1} من ${slides.length || 1}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-900/90 text-gold-300 border border-gold-400/40 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>بث مباشر متزامن 🔴</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
                  else document.exitFullscreen().catch(() => {});
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 text-xs px-2.5 py-1 rounded-xl border border-gold-400/30 transition cursor-pointer"
                title="شاشة كاملة"
              >
                ⛶
              </button>
            </div>
          </div>

          {/* Main Slide Card (Responsive Fit: strictly contained within viewport, zero top/bottom cropping) */}
          <div className="my-auto max-w-5xl mx-auto w-full max-h-[calc(100vh-5.5rem)] flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 border-2 border-gold-400 shadow-2xl relative space-y-2 sm:space-y-3 shrink-0 box-border">
            {/* Title */}
            <h2 className="font-amiri text-lg sm:text-2xl lg:text-3xl font-black text-gold-200 leading-snug text-center">
              {currentSlideTitle}
            </h2>

            {/* Golden Scripture Frame */}
            {scriptureText && (
              <div className="font-quran text-base sm:text-lg lg:text-xl text-amber-100 leading-relaxed bg-emerald-900/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gold-400/50 shadow-inner text-center">
                {formatScriptureDisplay(scriptureText)}
              </div>
            )}

            {/* 2 to 3 Distilled Golden Bullets */}
            <div className="space-y-2 sm:space-y-2.5 pt-1">
              {bullets.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-center gap-3 bg-emerald-900/60 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gold-400/30 shadow-md">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold-500 text-emerald-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                    {pIdx + 1}
                  </span>
                  <p className="font-amiri text-xs sm:text-base lg:text-lg text-slate-100 font-bold leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>

            {/* Behavioral Impact Footer */}
            {practicalImpact && (
              <div className="mt-2 pt-2 border-t border-gold-400/30 flex items-center gap-2 text-[11px] sm:text-xs text-gold-300 font-bold bg-emerald-900/40 p-2 sm:p-2.5 rounded-lg">
                <span>💡</span>
                <span>الأثر السلوكي والعملي: {practicalImpact}</span>
              </div>
            )}
          </div>

          {/* Watermark & Slide Dots */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-gold-300/60 pt-2 shrink-0 border-t border-gold-400/20">
            <span>منصة مشكاة | نظام التشغيل الشامل للداعية والمعلم الشرعي — AnubisLand</span>
            <div className="flex items-center gap-1.5">
              {slides.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    dotIdx === safeIdx ? 'bg-gold-400 w-5' : 'bg-emerald-800'
                  }`}
                />
              ))}
            </div>
            <span>شريحة {safeIdx + 1} من {slides.length || 1}</span>
          </div>
        </div>
      );
    }
