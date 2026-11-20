const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const markerStart = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10';
const markerEnd = '{/* Navigation Tabs Bar */}';

const idxStart = html.indexOf(markerStart);
const idxEnd = html.indexOf(markerEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  // Find opening '<div className="' before markerStart
  const divStart = html.lastIndexOf('<div', idxStart);
  
  const newHeaderBlock = `<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 relative z-10">
              {/* Row 1: Brand Logo & Title on Right + Actions on Left */}
              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                {/* Brand */}
                <div className="flex items-center gap-2.5 sm:gap-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-950 border-2 border-gold-400 p-0.5 shadow-md flex items-center justify-center transform hover:scale-105 transition overflow-hidden shrink-0">
                    <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Logo" className="w-full h-full object-cover rounded-lg sm:rounded-xl drop-shadow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black tracking-wide text-gold-200 font-amiri leading-none">
                        {isRtl ? 'مِشكاة' : 'Mishkah'}
                      </h1>
                      <span className="bg-gold-500/20 text-gold-300 border border-gold-400/40 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold">
                        v1.0 MVP
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-emerald-100/90 font-medium hidden sm:block mt-1">
                      {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : "Comprehensive OS for Da'wah & Islamic Educators"}
                    </p>
                  </div>
                </div>

                {/* Quick Actions (Security + Lang) */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsPinModalOpen(true)}
                    className="bg-emerald-800/90 hover:bg-emerald-700 border border-gold-400/50 text-gold-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
                    title={isRtl ? 'رمز أمان المعلم' : 'Teacher Security PIN'}
                  >
                    <span>🔒</span>
                    <span className="text-[11px] font-bold hidden xs:inline">{isRtl ? 'الأمان' : 'PIN'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  </button>

                  <button 
                    onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black text-xs px-2.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1"
                  >
                    <span>🌐</span>
                    <span className="text-[11px]">{lang === 'ar' ? 'EN' : 'عربي'}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Typography Toolbar (Font Selector & Font Sizes side by side) */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-800/50 flex-wrap sm:flex-nowrap">
                {/* Font Family */}
                <div className="flex items-center gap-1 bg-emerald-950/70 border border-gold-400/50 rounded-xl px-2 py-1 text-xs text-gold-200 shadow-xs flex-1 sm:flex-initial">
                  <span className="text-gold-300 text-xs">🔤</span>
                  <select 
                    value={appFont} 
                    onChange={(e) => {
                      const newF = e.target.value;
                      setAppFont(newF);
                      const fCfg = FONT_MAP[newF] || FONT_MAP.cairo;
                      showToast(isRtl ? 'تم تفعيل ' + fCfg.nameAr + ' ✨' : 'Font set to ' + fCfg.nameEn + ' ✨');
                    }}
                    className="bg-transparent text-gold-100 font-bold text-[11px] focus:outline-none cursor-pointer w-full sm:w-auto"
                    title={isRtl ? 'اختيار خط واجهة التطبيق' : 'Choose Interface Font'}
                  >
                    <option value="cairo" className="bg-emerald-950 text-gold-100">خط كايرو (Cairo)</option>
                    <option value="amiri" className="bg-emerald-950 text-gold-100">خط أميري (Amiri)</option>
                    <option value="tajawal" className="bg-emerald-950 text-gold-100">خط تجوال (Tajawal)</option>
                    <option value="almarai" className="bg-emerald-950 text-gold-100">خط المراعي (Almarai)</option>
                    <option value="naskh" className="bg-emerald-950 text-gold-100">خط النسخ (Noto Naskh)</option>
                  </select>
                </div>

                {/* Font Size Pills */}
                <div className="flex items-center gap-1 bg-emerald-950/70 border border-gold-400/50 rounded-xl px-1.5 py-1 text-xs text-gold-200 shadow-xs">
                  <span className="text-gold-300 text-[10px] font-bold hidden sm:inline">{isRtl ? 'الخط:' : 'Size:'}</span>
                  <div className="flex items-center bg-emerald-900/80 rounded-lg p-0.5 gap-0.5 border border-emerald-700/60">
                    {Object.entries(FONT_SIZE_LEVELS).map(([key, config]) => {
                      const isActive = fontSizeLevel === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setFontSizeLevel(key);
                            showToast(isRtl ? 'حجم الخط: ' + config.labelAr : 'Font size: ' + config.labelEn);
                          }}
                          className={'px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all ' + (
                            isActive 
                              ? 'bg-gold-500 text-emerald-950 shadow-xs font-black' 
                              : 'text-emerald-100 hover:text-gold-200'
                          )}
                        >
                          {isRtl ? config.labelAr : config.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            `;

  html = html.substring(0, divStart) + newHeaderBlock + html.substring(idxEnd);
  console.log('Successfully updated header for mobile!');
  fs.writeFileSync('public/index.html', html, 'utf8');
} else {
  console.error('Could not find header markers:', { idxStart, idxEnd });
  process.exit(1);
}
