    // The program's header: one calm row. The brand, five places to go, one
    // primary action (start a class) and a settings menu for everything that
    // is set once: text size, interface font, language, the guide, security,
    // and updates.

    const APP_SECTIONS = [
      { id: 'dashboard', icon: '🏠', ar: 'الرئيسية', en: 'Home' },
      { id: 'classes', icon: '📅', ar: 'حصصي', en: 'My classes' },
      { id: 'hifz', icon: '🕋', ar: 'التحفيظ', en: 'Hifz' },
      { id: 'tajweed', icon: '📖', ar: 'التجويد', en: 'Tajweed' },
      { id: 'islamic', icon: '🕌', ar: 'المحاضرات', en: 'Lectures' }
    ];

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
      const label = (sec) => (s.isRtl ? sec.ar : sec.en);
      return (
        <header className="emerald-pattern text-white border-b-2 border-gold-400 shadow-md relative z-40">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => s.navigate('dashboard')} className="flex items-center gap-2 shrink-0" title={s.isRtl ? 'الرئيسية' : 'Home'}>
              <img src="icons/mishkah-app-icon.jpg" alt="" className="w-9 h-9 rounded-lg border border-gold-400" />
              <span className="font-amiri font-bold text-gold-200 text-2xl leading-none">{s.isRtl ? 'مِشكاة' : 'Mishkah'}</span>
            </button>

            <nav className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto scrollbar-none">
              {APP_SECTIONS.map((sec) => {
                const active = sec.id === 'classes' ? s.myClassesOpen : (s.activeTab === sec.id && !s.myClassesOpen);
                return (
                  <button key={sec.id} type="button" onClick={() => s.navigate(sec.id)}
                    className={'relative shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base transition flex items-center gap-1.5 ' +
                      (active ? 'bg-white/15 text-gold-200 shadow-[inset_0_-3px_0_0_#fbbf24]' : 'text-emerald-50 hover:bg-white/10')}>
                    <span className="hidden md:inline">{sec.icon}</span>
                    <span>{label(sec)}</span>
                    {sec.id === 'classes' && s.unplannedCount > 0 && (
                      <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-black flex items-center justify-center"
                        title={s.isRtl ? 'حصص قريبة لم تُجهَّز خطتها' : 'Upcoming classes without a plan'}>{s.unplannedCount}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button type="button" onClick={s.onStartClass}
              className="shrink-0 px-3 sm:px-4 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-emerald-950 font-black text-sm sm:text-base shadow">
              ▶ <span className="hidden sm:inline">{s.isRtl ? 'بدء الحصة' : 'Start class'}</span>
            </button>
            <div className="relative shrink-0">
              <button type="button" onClick={() => setSettingsOpen(!settingsOpen)} aria-label={s.isRtl ? 'الإعدادات' : 'Settings'}
                className={'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ' + (settingsOpen ? 'bg-white/20' : 'hover:bg-white/10')}>⚙️</button>
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
