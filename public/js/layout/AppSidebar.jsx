    // The sections, in a side menu (on the right in Arabic). It narrows to icons
    // on half a laptop screen, or when the teacher chooses, so the content keeps
    // the room. The guide sits at the bottom, always within reach.

    const APP_SECTIONS = [
      { id: 'dashboard', icon: '🏠', ar: 'الرئيسية', en: 'Home' },
      { id: 'classes', icon: '📅', ar: 'حصصي', en: 'My classes' },
      { id: 'hifz', icon: '🕋', ar: 'التحفيظ', en: 'Hifz' },
      { id: 'tajweed', icon: '📖', ar: 'التجويد', en: 'Tajweed' },
      { id: 'islamic', icon: '🕌', ar: 'المحاضرات', en: 'Lectures' }
    ];
    const SIDEBAR_COLLAPSED_KEY = 'mishkah_sidebar_collapsed';
    const SIDEBAR_AUTO_NARROW_PX = 1000;

    // Narrow below SIDEBAR_AUTO_NARROW_PX unless the teacher chose otherwise.
    function useSidebarCollapsed() {
      const [choice, setChoice] = useState(() => {
        try { return localStorage.getItem(SIDEBAR_COLLAPSED_KEY); } catch (e) { return null; }
      });
      const [narrowWindow, setNarrowWindow] = useState(() => window.innerWidth < SIDEBAR_AUTO_NARROW_PX);
      useEffect(() => {
        const onResize = () => setNarrowWindow(window.innerWidth < SIDEBAR_AUTO_NARROW_PX);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);
      const collapsed = choice === null ? narrowWindow : choice === '1';
      const toggle = () => {
        const next = collapsed ? '0' : '1';
        setChoice(next);
        try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next); } catch (e) { console.warn('Mishkah: could not save the menu setting', e); }
      };
      return [collapsed, toggle];
    }

    function AppSidebar({ s }) {
      const [collapsed, toggle] = useSidebarCollapsed();
      const item = (active) => 'relative w-full flex items-center gap-3 rounded-xl font-bold transition ' +
        (collapsed ? 'justify-center px-0 py-3 text-2xl' : 'px-3 py-2.5 text-base') + ' ' +
        (active ? 'bg-emerald-900 text-gold-200 shadow' : 'text-emerald-950 hover:bg-emerald-900/10');
      return (
        <aside className={'no-print shrink-0 border-l-2 border-gold-400/40 bg-white/45 sticky top-0 self-start h-screen flex flex-col p-2 gap-1 transition-all ' + (collapsed ? 'w-16' : 'w-52')}>
          {APP_SECTIONS.map((sec) => {
            const active = sec.id === 'classes' ? s.myClassesOpen : (s.activeTab === sec.id && !s.myClassesOpen);
            return (
              <button key={sec.id} type="button" onClick={() => s.navigate(sec.id)} className={item(active)} title={collapsed ? (s.isRtl ? sec.ar : sec.en) : undefined}>
                <span className={collapsed ? '' : 'text-xl'}>{sec.icon}</span>
                {!collapsed && <span>{s.isRtl ? sec.ar : sec.en}</span>}
                {sec.id === 'classes' && s.unplannedCount > 0 && (
                  <span className={'min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black flex items-center justify-center ' + (collapsed ? 'absolute top-1 left-1' : 'mr-auto')}
                    title={s.isRtl ? 'حصص قريبة لم تُجهَّز خطتها' : 'Upcoming classes without a plan'}>{s.unplannedCount}</span>
                )}
              </button>
            );
          })}
          <span className="flex-1" />
          <button type="button" onClick={s.onOpenGuide} className={item(false)} title={collapsed ? (s.isRtl ? 'دليل الاستخدام' : 'User guide') : undefined}>
            <span className={collapsed ? '' : 'text-xl'}>❓</span>
            {!collapsed && <span>{s.isRtl ? 'دليل الاستخدام' : 'User guide'}</span>}
          </button>
          <button type="button" onClick={toggle} className="w-full py-2 rounded-xl text-slate-500 hover:bg-emerald-900/10 text-sm font-bold"
            title={collapsed ? (s.isRtl ? 'إظهار أسماء الأقسام' : 'Show section names') : (s.isRtl ? 'تصغير القائمة' : 'Narrow the menu')}>
            {collapsed ? '«' : (s.isRtl ? '» تصغير' : '» Narrow')}
          </button>
        </aside>
      );
    }
