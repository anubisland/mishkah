    // The Madinah mushaf page image and the memorisation masks drawn over it.
    // Used by the teacher's Hifz screen and by the student screen, so both
    // always agree on what is hidden.
    const MUSHAF_LINE_HEIGHT_PERCENT = 6.55;

    function mushafPageImageUrl(pageNumber) {
      return 'https://android.quran.com/data/width_1260/page' + String(pageNumber).padStart(3, '0') + '.png';
    }

    // dimmed: the teacher still sees the hidden lines through a light veil,
    // while the student screen shows the masks fully opaque.
    function MushafMaskOverlay({ mushafOverlayMode, activeRulerLine, isRtl, dimmed }) {
      if (!mushafOverlayMode || mushafOverlayMode === 'none') return null;
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: dimmed ? 0.35 : 1, zIndex: 10 }}>
          {/* OVERLAY: Ruler Mode (masks everything below activeRulerLine) */}
          {mushafOverlayMode === 'ruler' && (
            <div
              className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-t-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ease-out select-none"
              style={{
                top: (activeRulerLine * MUSHAF_LINE_HEIGHT_PERCENT) + '%',
                zIndex: 10
              }}
            >
              <div className="text-center bg-white/95 backdrop-blur-xs border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-lg max-w-md mx-auto">
                <span className="text-2xl sm:text-3xl block mb-1">📜</span>
                <p className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                  {isRtl ? 'مسطرة التحفيظ: بقية الصفحة محجوبة' : 'Blind Ruler Active'}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium">
                  {isRtl ? 'اقرأ السطر المكشوف أعلاه، ثم اضغط [⬇️ كشف السطر التالي] لمتابعة التسميع' : 'Recite revealed line, then advance'}
                </p>
              </div>
            </div>
          )}

          {/* OVERLAY: Mask Bottom Half (Lines 8-15) */}
          {mushafOverlayMode === 'mask_bottom' && (
            <div 
              className="absolute left-0 right-0 bottom-0 top-[52%] bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-t-4 border-amber-700 shadow-2xl flex items-center justify-center p-4 select-none transition-all duration-300"
              style={{ zIndex: 10 }}
            >
              <div className="text-center bg-white/95 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl max-w-sm mx-auto">
                <span className="text-3xl block mb-1">🔒</span>
                <p className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                  {isRtl ? 'النصف الأسفل محجوب (الأسطر 8 - 15)' : 'Bottom Half Masked'}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isRtl ? 'اختبار استحضار بقية الوجه غيباً دون الاعتماد على الذاكرة البصرية' : 'Recite remaining lines from pure memory'}
                </p>
              </div>
            </div>
          )}

          {/* OVERLAY: Mask Top Half (Lines 1-7) */}
          {mushafOverlayMode === 'mask_top' && (
            <div 
              className="absolute left-0 right-0 top-0 bottom-[48%] bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-b-4 border-amber-700 shadow-2xl flex items-center justify-center p-4 select-none transition-all duration-300"
              style={{ zIndex: 10 }}
            >
              <div className="text-center bg-white/95 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl max-w-sm mx-auto">
                <span className="text-3xl block mb-1">🔒</span>
                <p className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                  {isRtl ? 'النصف الأعلى محجوب (الأسطر 1 - 7)' : 'Top Half Masked'}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isRtl ? 'اختبار البدء من منتصف الوجه الشريف وتمكن الحفظ دون السرد التلقائي' : 'Start recitation from middle of page'}
                </p>
              </div>
            </div>
          )}

          {/* OVERLAY: Spotlight Mode */}
          {mushafOverlayMode === 'spotlight' && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              <div 
                className="absolute left-0 right-0 top-0 bg-slate-900/65 backdrop-blur-[1px] transition-all duration-300"
                style={{ height: Math.max(0, (activeRulerLine - 1) * MUSHAF_LINE_HEIGHT_PERCENT) + '%' }}
              />
              <div 
                className="absolute left-0 right-0 border-y-2 border-gold-400 bg-amber-300/10 shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
                style={{
                  top: ((activeRulerLine - 1) * MUSHAF_LINE_HEIGHT_PERCENT) + '%',
                  height: MUSHAF_LINE_HEIGHT_PERCENT + '%'
                }}
              />
              <div 
                className="absolute left-0 right-0 bottom-0 bg-slate-900/65 backdrop-blur-[1px] transition-all duration-300"
                style={{ top: (activeRulerLine * MUSHAF_LINE_HEIGHT_PERCENT) + '%' }}
              />
            </div>
          )}
        </div>
      );
    }
