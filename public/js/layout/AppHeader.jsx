    // The program's identity bar: the name, large, with one line saying what
    // the program is; and on the other side the two actions that never change
    // with the page: start a class, and settings. Moving between sections is
    // the sidebar's job (AppSidebar.jsx).

    const APP_TAGLINE_AR = 'منصة المعلّم لتحفيظ القرآن الكريم وتجويده وتدريس العلوم الشرعية';
    const APP_TAGLINE_EN = 'The teacher\'s platform for Quran memorisation, tajweed and Islamic studies';

    // Empties the app's own caches (the saved Quran pages are kept) and reloads.
    function forceRefreshApp() {
      try {
        if ('caches' in window) {
          caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== 'mishkah-quran-v1').map((k) => caches.delete(k))));
        }
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
        }
      } catch (e) {
        console.warn('Mishkah: could not clear the app cache', e);
      }
      window.location.replace(window.location.origin + window.location.pathname + '?t=' + Date.now());
    }

    function AppHeader({ s }) {
      const [settingsOpen, setSettingsOpen] = useState(false);
      return (
        <header className="emerald-pattern text-white border-b-2 border-gold-400 shadow-md relative z-40">
          <div className="px-3 sm:px-6 py-3 flex items-center gap-3 sm:gap-4">
            <button type="button" onClick={() => s.navigate('dashboard')} className="flex items-center gap-3 min-w-0 text-right" title={s.isRtl ? 'الرئيسية' : 'Home'}>
              <img src="icons/mishkah-app-icon.jpg" alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-gold-400 shrink-0" />
              <span className="min-w-0">
                <span className="block font-amiri font-bold text-gold-200 leading-none text-[2rem] sm:text-[2.6rem]">{s.isRtl ? 'مِشكاة' : 'Mishkah'}</span>
                <span className="block text-emerald-100/90 text-xs sm:text-sm font-bold mt-1 truncate">{s.isRtl ? APP_TAGLINE_AR : APP_TAGLINE_EN}</span>
              </span>
            </button>
            <span className="flex-1" />
            <button type="button" onClick={s.onStartClass}
              className="shrink-0 px-3 sm:px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-emerald-950 font-black text-sm sm:text-base shadow">
              ▶ <span className="hidden sm:inline">{s.isRtl ? 'بدء الحصة' : 'Start class'}</span>
            </button>
            <div className="relative shrink-0">
              <button type="button" onClick={() => setSettingsOpen(!settingsOpen)} aria-label={s.isRtl ? 'الإعدادات' : 'Settings'}
                className={'w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition ' + (settingsOpen ? 'bg-white/20' : 'hover:bg-white/10')}>⚙️</button>
              {settingsOpen && <SettingsMenu s={s} onClose={() => setSettingsOpen(false)} />}
            </div>
          </div>
        </header>
      );
    }

    function SettingsMenu({ s, onClose }) {
      const pill = (active) => 'flex-1 px-2 py-1.5 rounded-lg text-sm font-bold border transition ' +
        (active ? 'bg-emerald-900 text-gold-200 border-emerald-900' : 'bg-white text-emerald-950 border-emerald-900/15 hover:border-gold-500');
      const row = 'w-full text-right px-3 py-2.5 rounded-xl hover:bg-emerald-50 font-bold text-emerald-950 flex items-center gap-2';
      return (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute top-12 left-0 z-50 w-80 max-w-[92vw] bg-white text-emerald-950 rounded-2xl shadow-2xl border-2 border-gold-400 p-3 space-y-3" dir={s.isRtl ? 'rtl' : 'ltr'}>
            <section>
              <h4 className="font-black text-sm mb-1.5">{s.isRtl ? 'حجم الخط في البرنامج كله' : 'Text size (whole program)'}</h4>
              <div className="flex gap-1">
                {Object.entries(s.FONT_SIZE_LEVELS).map(([key, cfg]) => (
                  <button key={key} type="button" className={pill(s.fontSizeLevel === key)} onClick={() => s.setFontSizeLevel(key)}>
                    {s.isRtl ? cfg.labelAr : cfg.labelEn}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h4 className="font-black text-sm mb-1.5">{s.isRtl ? 'الإضاءة' : 'Appearance'}</h4>
              <div className="flex gap-1">
                {[['light', '☀️ فاتح', '☀️ Light'], ['dark', '🌙 داكن', '🌙 Dark'], ['auto', '🔄 تلقائي', '🔄 Auto']].map(([key, ar, en]) => (
                  <button key={key} type="button" className={pill(s.theme === key)} onClick={() => s.setTheme(key)}
                    title={key === 'auto' ? (s.isRtl ? 'يتبع إعداد الجهاز: فاتح نهاراً وداكن ليلاً' : 'Follows the device setting') : undefined}>
                    {s.isRtl ? ar : en}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h4 className="font-black text-sm mb-1.5">{s.isRtl ? 'خط الواجهة' : 'Interface font'}</h4>
              <select value={s.appFont} onChange={(e) => s.setAppFont(e.target.value)}
                className="w-full border-2 border-emerald-900/15 rounded-xl px-2 py-1.5 font-bold">
                {Object.entries(s.FONT_MAP).map(([key, f]) => <option key={key} value={key}>{s.isRtl ? f.nameAr : f.nameEn}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-1">{s.isRtl ? 'المصحف يبقى دائماً بالرسم العثماني.' : 'The Quran always stays in Uthmani script.'}</p>
            </section>
            <section className="border-t border-emerald-900/10 pt-2 space-y-0.5">
              <button type="button" className={row} onClick={() => { onClose(); s.onOpenGuide(); }}>❓ {s.isRtl ? 'دليل الاستخدام' : 'User guide'}</button>
              <button type="button" className={row} onClick={() => { onClose(); s.handleOpenStudentPopout(); }}>
                🖥️ {s.studentScreenOpen ? (s.isRtl ? 'شاشة الطالب مفتوحة' : 'Student screen open') : (s.isRtl ? 'فتح شاشة الطالب وحدها' : 'Open the student screen only')}
              </button>
              <button type="button" className={row} onClick={() => s.setLang(s.lang === 'ar' ? 'en' : 'ar')}>🌐 {s.lang === 'ar' ? 'English' : 'العربية'}</button>
              <button type="button" className={row} onClick={() => { onClose(); s.setIsPinModalOpen(true); }}>🔒 {s.isRtl ? 'الأمان' : 'Security'}</button>
            </section>
            <section className="border-t border-emerald-900/10 pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{s.isRtl ? 'الإصدار' : 'Version'} {s.version}</span>
              <button type="button" onClick={forceRefreshApp} className="px-2 py-1 rounded-lg border border-slate-300 font-bold text-slate-700">{s.isRtl ? 'تحديث البرنامج' : 'Update now'}</button>
            </section>
          </div>
        </>
      );
    }
