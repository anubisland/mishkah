
    function App() {
      // Check if this window was opened as a dedicated Student Projector Screen for Zoom
      const isStudentDisplayMode = window.location.search.includes('mode=student-display');
      if (isStudentDisplayMode) {
        return <StudentStage />;
      }

      // Language & Direction state
      const [lang, setLang] = useState('ar');
      const isRtl = lang === 'ar';
      
      // 3-Level Simple Ergonomic Font Scale: صغير (14px) | متوسط (16px - الافتراضي) | كبير (18px - مريح لكبار السن)
      const FONT_SIZE_LEVELS = {
        small: { px: 14, labelAr: 'صغير', labelEn: 'Small', tipAr: 'خط صغير مدمج', tipEn: 'Compact font (14px)' },
        medium: { px: 16, labelAr: 'متوسط', labelEn: 'Medium', tipAr: 'خط متوسط متزن (الافتراضي)', tipEn: 'Balanced font (Default 16px)' },
        large: { px: 18, labelAr: 'كبير', labelEn: 'Large', tipAr: 'خط كبير ومريح للعين وكبار السن بدون الإخلال بتوازن الصفحة', tipEn: 'Comfortable large font for seniors (18px)' }
      };
      const [fontSizeLevel, setFontSizeLevel] = useState(localStorage.getItem('mishkah_font_level') || 'medium');
      
      // Font Family Switcher (Cairo, Amiri, Tajawal, Almarai, Noto Naskh)
      const [appFont, setAppFont] = useState(localStorage.getItem('mishkah_font') || 'cairo');

      const FONT_MAP = {
        cairo: { nameAr: 'خط كايرو', nameEn: 'Cairo', css: "'Cairo', sans-serif" },
        amiri: { nameAr: 'خط أميري', nameEn: 'Amiri', css: "'Amiri', serif" },
        tajawal: { nameAr: 'خط تجوال', nameEn: 'Tajawal', css: "'Tajawal', sans-serif" },
        almarai: { nameAr: 'خط المراعي', nameEn: 'Almarai', css: "'Almarai', sans-serif" },
        naskh: { nameAr: 'خط النسخ', nameEn: 'Noto Naskh', css: "'Noto Naskh Arabic', serif" }
      };

      useEffect(() => {
        const currentLevel = FONT_SIZE_LEVELS[fontSizeLevel] || FONT_SIZE_LEVELS.medium;
        document.documentElement.style.setProperty('--lesson-content-font-size', `${currentLevel.px}px`);
        document.documentElement.style.fontSize = '16px';
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        document.title = isRtl ? 'منصة مشكاة | نظام التشغيل الشامل للداعية والمعلم الشرعي' : "Mishkah Platform | Comprehensive OS for Da'wah & Islamic Educators";
        const fontConfig = FONT_MAP[appFont] || FONT_MAP.cairo;
        document.documentElement.style.setProperty('--active-app-font', fontConfig.css);
        document.body.style.fontFamily = fontConfig.css;
        localStorage.setItem('mishkah_font', appFont);
        localStorage.setItem('mishkah_font_level', fontSizeLevel);
      }, [fontSizeLevel, isRtl, lang, appFont]);

      // Active View (Default directly to Branch 1: Authentic Mushaf & Recitation)
      const [activeTab, setActiveTab] = useState('hifz');

      // ================= BRANCH 1: HIFZ & RECITATION STATE =================
      const [hifzPassageId, setHifzPassageId] = useState('mulk_page_562');
      const [hifzAyahs, setHifzAyahs] = useState(PRELOADED_HIFZ_PASSAGES[0].ayahs);
      const [hifzMutashabihat, setHifzMutashabihat] = useState(PRELOADED_HIFZ_PASSAGES[0].mutashabihat);
      const [hifzSurahName, setHifzSurahName] = useState(PRELOADED_HIFZ_PASSAGES[0].surahAr);
      const [hifzAyahRange, setHifzAyahRange] = useState(PRELOADED_HIFZ_PASSAGES[0].ayahRange);
      
      // Teacher Live Masking Controls
      const [quranFontSize, setQuranFontSize] = useState('medium'); // 'small', 'medium', 'large'
      const [isEndingsMasked, setIsEndingsMasked] = useState(false);
      const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight', 'interactive_lines'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      const [maskedMushafLines, setMaskedMushafLines] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])); // Lines 1..15
      const currentMushafLayout = getMushafPageLayout(mushafPageNumber);
      
      // Passage-Based Testing System (Start, Middle, End, Custom)
      const [passageTestSection, setPassageTestSection] = useState('none'); // 'none', 'start', 'middle', 'end', 'custom'
      const [passageMaskedAyahs, setPassageMaskedAyahs] = useState(new Set());
      const [passageStatus, setPassageStatus] = useState('reciting'); // 'reciting', 'correct', 'error_retry', 'revealed_for_review'
      const [passageRetryCount, setPassageRetryCount] = useState(0);
      const [isStartersMasked, setIsStartersMasked] = useState(false);
      const [isDivineNamesMasked, setIsDivineNamesMasked] = useState(false);
      const [isAlternatingMasked, setIsAlternatingMasked] = useState(false);
      const [isReverseOrder, setIsReverseOrder] = useState(false);
      const [isFullMasked, setIsFullMasked] = useState(false);
      const [revealedAyahSet, setRevealedAyahSet] = useState(new Set([1]));
      const [customMaskedWords, setCustomMaskedWords] = useState(new Set());
      
      // Repetition Loop State
      const [repeatTarget, setRepeatTarget] = useState(3);
      const [repeatCount, setRepeatCount] = useState(0);
      const [activeRepeatAyah, setActiveRepeatAyah] = useState(1);
      
      // Mutashabihat live search
      const [mutashabihSearch, setMutashabihSearch] = useState('');
      
      // Custom Text Input Box
      // Mutashabihat interactive linking workbench states
      const [isAddMutaOpen, setIsAddMutaOpen] = useState(false);
      const [mutaCurrentAyahNum, setMutaCurrentAyahNum] = useState(1);
      const [mutaTargetSurahId, setMutaTargetSurahId] = useState(35); // Default: Fatir
      const [mutaTargetAyahNum, setMutaTargetAyahNum] = useState(28);
      const [mutaTargetText, setMutaTargetText] = useState('');
      const [mutaSearchQuery, setMutaSearchQuery] = useState('');
      const [mutaSearchResults, setMutaSearchResults] = useState([]);
      const [isSearchingMuta, setIsSearchingMuta] = useState(false);
      const [mutaGuideNote, setMutaGuideNote] = useState('');
      const [hifzViewMode, setHifzViewMode] = useState('mushaf_page'); // 'mushaf_page' (Printed Image - Primary) | 'interactive_test' (Digital Lines Board)
      const [mushafPageNumber, setMushafPageNumber] = useState(562); // Default: Surah Al-Mulk Page 562
      const [mushafCurrentSurahId, setMushafCurrentSurahId] = useState(67);
      const [selectedSurahNumber, setSelectedSurahNumber] = useState(67);
      const [selectedAyahFrom, setSelectedAyahFrom] = useState(1);
      const [selectedAyahTo, setSelectedAyahTo] = useState(5);
      const [isFetchingQuran, setIsFetchingQuran] = useState(false);
      const [showCustomInput, setShowCustomInput] = useState(false);

      // Helper function to switch passages
      // Unified Synchronized Mushaf & Testing Board Navigator (All 604 Pages)
      async function handleNavigateMushafPage(targetPage, switchMode = null) {
        const p = Math.max(1, Math.min(604, parseInt(targetPage) || 1));
        setMushafPageNumber(p);
        if (switchMode) setHifzViewMode(switchMode);
        const sMatch = MUSHAF_SURAHS_PAGE_MAP.find(s => p >= s.startPage && p <= s.endPage);
        if (sMatch) setMushafCurrentSurahId(sMatch.id);
        
        // Preserve user selected view mode (digital lines or mushaf page)
        // 1. Check if in preloaded passages
        const preloaded = PRELOADED_HIFZ_PASSAGES.find(item => item.pageNumber === p);
        if (preloaded) {
          setHifzPassageId(preloaded.id);
          setHifzAyahs(preloaded.ayahs);
          setHifzMutashabihat(getMutashabihatForPageNumber(p, sMatch?.id));
          setHifzSurahName(preloaded.surahAr);
          setHifzAyahRange(preloaded.ayahRange);
          setPassageTestSection('none');
          setPassageMaskedAyahs(new Set());
          setCustomMaskedWords(new Set());
          setRevealedAyahSet(new Set([preloaded.ayahs[0]?.num || 1]));
          showToast(isRtl ? 'عرض ' + preloaded.surahAr + ' (' + preloaded.ayahRange + ') ۞' : 'Loaded ' + preloaded.surahEn);
          return;
        }

        // 2. Check localStorage cache
        const cacheKey = 'mishkah_mushaf_page_' + p;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.ayahs && parsed.ayahs.length > 0) {
              setHifzAyahs(parsed.ayahs);
              setHifzSurahName(parsed.surahName);
              setHifzAyahRange(parsed.ayahRange);
              setHifzMutashabihat(getMutashabihatForPageNumber(p, sMatch?.id));
              setHifzPassageId('page_' + p);
              setPassageTestSection('none');
              setPassageMaskedAyahs(new Set());
              setCustomMaskedWords(new Set());
              setRevealedAyahSet(new Set([parsed.ayahs[0]?.num || 1]));
              showToast(isRtl ? 'عرض ' + parsed.surahName + ' (' + parsed.ayahRange + ') ۞' : 'Loaded page ' + p);
              return;
            }
          } catch(e) {}
        }

        // 3. Fetch from verified Quran API
        setIsFetchingQuran(true);
        try {
          const res = await fetch('https://api.alquran.cloud/v1/page/' + p + '/quran-uthmani');
          if (!res.ok) throw new Error('API returned ' + res.status);
          const json = await res.json();
          const rawAyahs = json.data?.ayahs || [];
          if (rawAyahs.length === 0) throw new Error('No ayahs found');

          const basmalah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
          const mappedAyahs = rawAyahs.map(a => {
            let t = a.text || '';
            if (a.numberInSurah === 1 && a.surah.number !== 1 && a.surah.number !== 9 && t.startsWith(basmalah)) {
              t = t.substring(basmalah.length);
            }
            return {
              num: a.numberInSurah,
              text: t,
              surahName: a.surah.name,
              surahNumber: a.surah.number
            };
          });

          const primarySurah = rawAyahs[0]?.surah?.name || 'القرآن الكريم';
          const firstAyah = rawAyahs[0]?.numberInSurah || 1;
          const lastAyah = rawAyahs[rawAyahs.length - 1]?.numberInSurah || rawAyahs.length;
          const rangeStr = firstAyah + '–' + lastAyah + ' (صفحة ' + p + ')';

          const pageMutashabihat = getMutashabihatForPageNumber(p, sMatch?.id);
          const pageData = {
            ayahs: mappedAyahs,
            surahName: primarySurah.startsWith('سُورَةُ') ? primarySurah : 'سورة ' + primarySurah,
            ayahRange: rangeStr,
            mutashabihat: pageMutashabihat
          };

          try { localStorage.setItem(cacheKey, JSON.stringify(pageData)); } catch(e) {}

          setHifzAyahs(mappedAyahs);
          setHifzSurahName(pageData.surahName);
          setHifzAyahRange(rangeStr);
          setHifzMutashabihat(pageMutashabihat);
          setHifzPassageId('page_' + p);
          setPassageTestSection('none');
          setPassageMaskedAyahs(new Set());
          setCustomMaskedWords(new Set());
          setRevealedAyahSet(new Set([mappedAyahs[0]?.num || 1]));
          showToast(isRtl ? 'تم تحميل ' + pageData.surahName + ' (صفحة ' + p + ') بالرسم العثماني المعتمد ۞' : 'Loaded page ' + p + ' in Uthmani Script ۞');
        } catch(err) {
          console.warn('Could not fetch page ' + p + ':', err);
          showToast(isRtl ? 'تعذر جلب نص الصفحة، يُرجى التحقق من الاتصال' : 'Could not fetch page text');
        } finally {
          setIsFetchingQuran(false);
        }
      }
      function handleSelectHifzPassage(pId) {
        const p = PRELOADED_HIFZ_PASSAGES.find(item => item.id === pId);
        if (p) {
          setHifzPassageId(p.id);
          setHifzAyahs(p.ayahs);
          setHifzMutashabihat(p.mutashabihat);
          setHifzSurahName(p.surahAr);
          setHifzAyahRange(p.ayahRange);
          setIsEndingsMasked(false);
          setIsFullMasked(false);
          setRevealedAyahSet(new Set([1]));
          setCustomMaskedWords(new Set());
          setRepeatCount(0);
          setActiveRepeatAyah(1);
          showToast(isRtl ? 'تم تحميل ' + p.surahAr + ' (' + p.ayahRange + ') في لوحة التحفيظ ✨' : 'Loaded ' + p.surahEn + ' in Hifz Board ✨');
        }
      }

      // Search Quran for similar verses without diacritics
      async function handleSearchMutaAyahs() {
        if (!mutaSearchQuery.trim()) return;
        setIsSearchingMuta(true);
        try {
          const res = await fetch('https://api.alquran.cloud/v1/search/' + encodeURIComponent(mutaSearchQuery.trim()) + '/all/quran-simple-clean');
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          const matches = data.data?.matches || [];
          setMutaSearchResults(matches.slice(0, 8)); // Top 8 matches
          if (matches.length === 0) {
            showToast(isRtl ? 'لم يتم العثور على مواضع مطابقة في القرآن' : 'No matching ayahs found');
          }
        } catch(e) {
          console.error('Muta search error:', e);
          showToast(isRtl ? 'تعذر البحث، يرجى التأكد من الاتصال' : 'Search failed, check connection');
        } finally {
          setIsSearchingMuta(false);
        }
      }

      // Select a search match and fetch its exact Uthmani text
      async function handleSelectMutaMatch(match) {
        setMutaTargetSurahId(match.surah.number);
        setMutaTargetAyahNum(match.numberInSurah);
        try {
          const res = await fetch('https://api.alquran.cloud/v1/ayah/' + match.number + '/quran-uthmani');
          const data = await res.json();
          setMutaTargetText(data.data?.text || match.text);
        } catch(e) {
          setMutaTargetText(match.text);
        }
        setMutaSearchResults([]);
      }

      // Fetch target ayah text when manual surah/ayah number changed
      async function handleFetchTargetMutaAyah(surahId, ayahNum) {
        try {
          const res = await fetch('https://api.alquran.cloud/v1/ayah/' + surahId + ':' + ayahNum + '/quran-uthmani');
          const data = await res.json();
          if (data.data?.text) {
            setMutaTargetText(data.data.text);
          }
        } catch(e) {
          console.error(e);
        }
      }

      // Save new Mutashabiha into current lesson
      function handleSaveNewMutashabiha() {
        const curAyah = hifzAyahs.find(a => a.num === mutaCurrentAyahNum) || hifzAyahs[0];
        const targetSurahObj = ALL_QURAN_SURAHS.find(s => s.id === mutaTargetSurahId) || ALL_QURAN_SURAHS[0];
        
        const currentText = (curAyah ? curAyah.text : '') + ' (' + hifzSurahName + ': ' + mutaCurrentAyahNum + ')';
        const targetText = (mutaTargetText || 'آية ' + mutaTargetAyahNum) + ' (سورة ' + targetSurahObj.name + ': ' + mutaTargetAyahNum + ')';
        const guide = mutaGuideNote.trim() || (isRtl ? 'انتبه للفارق اللفظي بين الموضعين لتثبيت الحفظ.' : 'Notice the verbal difference to secure memorization.');

        const newEntry = {
          ayah: currentText,
          similar: targetText,
          difference: guide
        };

        const updated = [...(hifzMutashabihat || []), newEntry];
        setHifzMutashabihat(updated);
        setIsAddMutaOpen(false);
        setMutaGuideNote('');
        setMutaTargetText('');
        setMutaSearchResults([]);
        showToast(isRtl ? 'تم حفظ المتشابهة وإدراجها في خطة المدارسة بنجاح ✨' : 'Mutashabiha added to lesson plan ✨');
      }

      // Delete Mutashabiha
      function handleDeleteMutashabiha(idx) {
        const updated = (hifzMutashabihat || []).filter((_, i) => i !== idx);
        setHifzMutashabihat(updated);
        showToast(isRtl ? 'تم حذف المتشابهة' : 'Mutashabiha removed');
      }

      // Fetch verified Uthmani Ayahs from cache or API directly
      async function handleFetchQuranPassage() {
        const surah = ALL_QURAN_SURAHS.find(s => s.id === selectedSurahNumber) || ALL_QURAN_SURAHS[66];
        const from = Math.max(1, selectedAyahFrom);
        const to = Math.min(surah.ayahs, Math.max(from, selectedAyahTo));
        
        setIsFetchingQuran(true);
        try {
          const cacheKey = 'mishkah_quran_surah_' + surah.id;
          let allAyahs = null;
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try { allAyahs = JSON.parse(cached); } catch(e) {}
          }
          
          if (!allAyahs) {
            const res = await fetch('https://api.alquran.cloud/v1/surah/' + surah.id + '/quran-uthmani');
            if (!res.ok) throw new Error('Network error: ' + res.status);
            const data = await res.json();
            allAyahs = data.data?.ayahs || [];
            try { localStorage.setItem(cacheKey, JSON.stringify(allAyahs)); } catch(e) {}
          }

          if (!allAyahs || allAyahs.length === 0) throw new Error('No ayahs found');

          // Slice requested range
          const sliced = allAyahs.slice(from - 1, to);
          const basmalah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
          const mappedAyahs = sliced.map(a => {
            let t = a.text || '';
            // Strip basmalah prefix on ayah 1 if not Al-Fatihah and not At-Tawbah
            if (a.numberInSurah === 1 && surah.id !== 1 && surah.id !== 9 && t.startsWith(basmalah)) {
              t = t.substring(basmalah.length);
            }
            return {
              num: a.numberInSurah,
              text: t
            };
          });

          setHifzAyahs(mappedAyahs);
          setHifzSurahName('سورة ' + surah.name);
          setHifzAyahRange(from + '–' + to);
          setHifzMutashabihat([]);
          setHifzPassageId('custom_quran_' + surah.id);
          setShowCustomInput(false);
          setIsEndingsMasked(false);
          setIsFullMasked(false);
          setRevealedAyahSet(new Set([from]));
          setCustomMaskedWords(new Set());
          setRepeatCount(0);
          showToast(isRtl ? 'تم جلب آيات سورة ' + surah.name + ' (' + from + '–' + to + ') بالرسم العثماني المعتمد ۞' : 'Loaded Surah ' + surah.en + ' (' + from + '–' + to + ') in Uthmani Script ۞');
        } catch (err) {
          console.error('Quran fetch error:', err);
          showToast(isRtl ? 'تعذر جلب الآيات عبر الإنترنت، يُرجى التحقق من الاتصال ⚠️' : 'Could not fetch ayahs, check connection ⚠️');
        } finally {
          setIsFetchingQuran(false);
        }
      }

      // Word click to mask/unmask
      function toggleWordMask(ayahNum, wordIdx) {
        const key = ayahNum + '-' + wordIdx;
        setCustomMaskedWords(prev => {
          const next = new Set(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        });
      }

      // Reveal specific ayah in blind recitation mode
      function toggleRevealAyah(num) {
        setRevealedAyahSet(prev => {
          const next = new Set(prev);
          if (next.has(num)) {
            next.delete(num);
          } else {
            next.add(num);
          }
          return next;
        });
      }

      // Copy WhatsApp Hifz Broadcast
      function handleCopyHifzWhatsApp() {
        const ayahsText = hifzAyahs.map(a => '﴿' + a.num + '﴾ ' + a.text).join(' ');
        const mutaText = hifzMutashabihat.length > 0 
          ? '\n\n🔍 *تنبيه المتشابهات للحفظ:*\n' + hifzMutashabihat.map(m => '• ' + m.ayah + '\n  فارق الحفظ: ' + m.difference).join('\n')
          : '';
        const msg = '🕌 *حلقة القرآن الكريم — وِرد التحفيظ والمراجعة*\n' +
          '📖 *المقطع المقرر:* ' + hifzSurahName + ' (الآيات ' + hifzAyahRange + ')\n\n' +
          ayahsText +
          mutaText + '\n\n' +
          '🔁 *توجيه المحفظ:* يُرجى تكرار المقطع 5 مرات غيباً قبل الحلقة القادمة.\n' +
          '✨ *منظومة مِشكاة — AnubisLand*';
        navigator.clipboard.writeText(msg);
        showToast(isRtl ? 'تم نسخ رسالة وِرد التحفيظ للواتساب بنجاح 📋' : 'Hifz Broadcast Copied to Clipboard 📋');
      }

      // Passage-Based Testing Handlers (Start, Middle, End, Custom)
      function handleActivatePassageTest(sectionType) {
        if (!hifzAyahs || hifzAyahs.length === 0) return;
        const total = hifzAyahs.length;
        let selectedAyahs = [];
        
        if (sectionType === 'start') {
          const count = Math.max(1, Math.ceil(total / 3));
          selectedAyahs = hifzAyahs.slice(0, count).map(a => a.num);
        } else if (sectionType === 'middle') {
          const startIdx = Math.max(0, Math.floor(total / 3));
          const endIdx = Math.max(startIdx + 1, Math.ceil((2 * total) / 3));
          selectedAyahs = hifzAyahs.slice(startIdx, endIdx).map(a => a.num);
        } else if (sectionType === 'end') {
          const startIdx = Math.max(0, Math.floor((2 * total) / 3));
          selectedAyahs = hifzAyahs.slice(startIdx).map(a => a.num);
        }

        setPassageTestSection(sectionType);
        setPassageMaskedAyahs(new Set(selectedAyahs));
        setPassageStatus('reciting');
        setPassageRetryCount(0);
        showToast(isRtl ? 'تم تفعيل اختبار المقطع — استمع لتسميع الطالب 🎧' : 'Passage test activated 🎧');
      }

      function handlePassageVerdict(verdict) {
        if (verdict === 'correct') {
          setPassageStatus('correct');
          showToast(isRtl ? '✨ أحسنت! تم إظهار المقطع بعد الإتقان' : 'Correct! Passage revealed');
        } else if (verdict === 'error') {
          const nextRetries = passageRetryCount + 1;
          setPassageRetryCount(nextRetries);
          setPassageStatus('error_retry');
          showToast(isRtl ? '⚠️ تم رصد خطأ (محاولة ' + nextRetries + ') — أعد التسميع مرة أخرى' : 'Mistake detected — retry');
        } else if (verdict === 'reveal_review') {
          setPassageStatus('revealed_for_review');
          showToast(isRtl ? '📖 تم إظهار المقطع للتصحيح والمراجعة' : 'Passage revealed for review');
        } else if (verdict === 'reset') {
          setPassageTestSection('none');
          setPassageMaskedAyahs(new Set());
          setPassageStatus('reciting');
          setPassageRetryCount(0);
        }
      }
 // 'dashboard' | 'tajweed' | 'islamic' | 'worksheet' | 'quiz'
      
      // Teacher Security Passcode PIN Gate
      const [teacherPin, setTeacherPin] = useState(localStorage.getItem('mishkah_pin') || 'MISHKAH2026');
      const [isPinModalOpen, setIsPinModalOpen] = useState(false);
      const [tempPin, setTempPin] = useState(teacherPin);
      const [pinStatus, setPinStatus] = useState('verified'); // 'idle' | 'verifying' | 'verified' | 'error'

      // Module A: Tajweed Generator State
      const [surahName, setSurahName] = useState('سورة الملك');
      const [ayahRange, setAyahRange] = useState('1–10');
      const [selectedRule, setSelectedRule] = useState('ikhfaa');
      const [tajweedMode, setTajweedMode] = useState('bilingual');
      const [selectedTextbook, setSelectedTextbook] = useState('czerepinski');
      const [customContext, setCustomContext] = useState('');
      const [tajweedData, setTajweedData] = useState(null);
      const [isGeneratingTajweed, setIsGeneratingTajweed] = useState(false);
      const [tajweedSubTab, setTajweedSubTab] = useState('generator'); // 'generator', 'makhaarij', 'metronome'
      const [suwaydLessonId, setSuwaydLessonId] = useState('ikhfaa_haqiqi');
      const [suwaydFilterCategory, setSuwaydFilterCategory] = useState('all');
      const [suwaydSearchQuery, setSuwaydSearchQuery] = useState('');

      // Dr. Ayman Suwayd Authentic Illustrated Plates State
      const [activeSuwaydPlateId, setActiveSuwaydPlateId] = useState(null);
      const [suwaydPlateZoomModal, setSuwaydPlateZoomModal] = useState(null);
      const [suwaydAnatomyMode, setSuwaydAnatomyMode] = useState('plate'); // 'plate' or 'svg'
      const [suwaydCatalogSubTab, setSuwaydCatalogSubTab] = useState('lessons'); // 'lessons' or 'atlas'
      const [atlasCategory, setAtlasCategory] = useState('all');
      const [atlasSearch, setAtlasSearch] = useState('');
      const [plateZoomLevel, setPlateZoomLevel] = useState(1);

      const [suwaydViewMode, setSuwaydViewMode] = useState('catalog'); // 'catalog' (Lesson Grid) | 'details' (Dedicated Fullscreen Lesson Screen)
      const [suwaydZoomModalOpen, setSuwaydZoomModalOpen] = useState(false);
      const [suwaydZoomSlideIndex, setSuwaydZoomSlideIndex] = useState(0);
      const [suwaydQuizModalOpen, setSuwaydQuizModalOpen] = useState(false);
      const [suwaydWorksheetModalOpen, setSuwaydWorksheetModalOpen] = useState(false);
      const [hifzWorksheetModalOpen, setHifzWorksheetModalOpen] = useState(false);
      const [suwaydQuizAnswers, setSuwaydQuizAnswers] = useState({});
      const [suwaydQuizSubmitted, setSuwaydQuizSubmitted] = useState(false);

      const currentSuwaydLesson = useMemo(() => {
        return SUWAYD_TAJWEED_CURRICULUM.find(l => l.id === suwaydLessonId) || SUWAYD_TAJWEED_CURRICULUM[0];
      }, [suwaydLessonId]);

      // Dynamic sequence of fullscreen Zoom Presentation slides (Matn/Plate -> Letter Breakdown -> Quranic Metronome Drills)
      const currentZoomSlides = useMemo(() => buildTajweedZoomSlides(currentSuwaydLesson), [currentSuwaydLesson]);

      const [activeMakhrajId, setActiveMakhrajId] = useState('lisan');
      const [metronomeCount, setMetronomeCount] = useState(2); // 2, 4, 5, 6
      const [metronomePlaying, setMetronomePlaying] = useState(false);
      const [metronomeBeat, setMetronomeBeat] = useState(1);
      const [metronomeSpeed, setMetronomeSpeed] = useState('tadweer'); // 'tahqeeq', 'tadweer', 'hadr'
      const [metronomeSound, setMetronomeSound] = useState(true);


      useEffect(() => {
        if (!metronomePlaying) return;
        const intervalMs = metronomeSpeed === 'tahqeeq' ? 650 : metronomeSpeed === 'hadr' ? 380 : 500;
        const timer = setInterval(() => {
          setMetronomeBeat(prev => {
            const nextBeat = (prev % metronomeCount) + 1;
            if (metronomeSound) {
              playMetronomeTick(nextBeat === 1);
            }
            return nextBeat;
          });
        }, intervalMs);
        return () => clearInterval(timer);
      }, [metronomePlaying, metronomeCount, metronomeSpeed, metronomeSound]);
      
      // Multi-Branch Worksheets & Quizzes Control States
      const [worksheetBranch, setWorksheetBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [worksheetIslamicCategory, setWorksheetIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'
      const [quizBranch, setQuizBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [quizIslamicCategory, setQuizIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'

      // ================= TEACHER TOOLS: WORKSHEET BUILDER STATES =================
      const [worksheetMode, setWorksheetMode] = useState('preview'); // 'preview' or 'builder'
      const [customIslamicWorksheets, setCustomIslamicWorksheets] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_islamic_worksheets');
          return s ? JSON.parse(s) : JSON.parse(JSON.stringify(ISLAMIC_BRANCH_WORKSHEETS));
        } catch (e) {
          return JSON.parse(JSON.stringify(ISLAMIC_BRANCH_WORKSHEETS));
        }
      });
      const [customTajweedWorksheet, setCustomTajweedWorksheet] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_tajweed_worksheet');
          if (s) return JSON.parse(s);
        } catch (e) {}
        return {
          titleAr: 'ورقة مدارسة وتطبيق في أحكام التجويد',
          titleEn: 'Tajweed Student Worksheet',
          surah: 'سورة الملك: الآيات 1-12',
          items: [
            { itemNumber: 1, wordUthmani: 'شَىْءٍ قَدِيرٌ', ruleApplied: 'إخفاء حقيقي بغنة مفخمة', reasonAr: 'تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء المفخمة)', maxScore: 5 },
            { itemNumber: 2, wordUthmani: 'خَلَقَ ٱلْمَوْتَ', ruleApplied: 'قلقلة صغرى', reasonAr: 'حرف القاف ساكن في وسط الكلمة / سكون أصلي مخفف', maxScore: 5 },
            { itemNumber: 3, wordUthmani: 'مِّن تَفَٰوُتٍ', ruleApplied: 'إخفاء حقيقي بغنة مرققة', reasonAr: 'نون ساكنة بعدها حرف التاء (من حروف الاستفال)', maxScore: 5 },
            { itemNumber: 4, wordUthmani: 'هَلْ تَرَىٰ مِن فُطُورٍ', ruleApplied: 'إظهار لامي + إخفاء نون', reasonAr: 'لام الحرف مظهرة + نون ساكنة بعدها حرف الفاء', maxScore: 5 }
          ]
        };
      });

      const [isAddingWorksheetItem, setIsAddingWorksheetItem] = useState(false);
      const [editingWorksheetItemIdx, setEditingWorksheetItemIdx] = useState(null);
      const [worksheetItemForm, setWorksheetItemForm] = useState({
        topic: '',
        scripture: '',
        studentQuestion: '',
        teacherAnswer: '',
        practicalImpact: '',
        maxScore: 5
      });

      const [isAddingTajweedItem, setIsAddingTajweedItem] = useState(false);
      const [editingTajweedItemIdx, setEditingTajweedItemIdx] = useState(null);
      const [tajweedItemForm, setTajweedItemForm] = useState({
        wordUthmani: '',
        ruleApplied: '',
        reasonAr: '',
        maxScore: 5
      });

      // ================= TEACHER TOOLS: QUIZ BUILDER STATES =================
      const [quizMode, setQuizMode] = useState('student'); // 'student' or 'builder'
      const [customIslamicQuizzes, setCustomIslamicQuizzes] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_islamic_quizzes');
          return s ? JSON.parse(s) : JSON.parse(JSON.stringify(ISLAMIC_BRANCH_QUIZZES));
        } catch (e) {
          return JSON.parse(JSON.stringify(ISLAMIC_BRANCH_QUIZZES));
        }
      });
      const [customTajweedQuizzes, setCustomTajweedQuizzes] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_tajweed_quizzes');
          if (s) return JSON.parse(s);
        } catch (e) {}
        const list = [];
        SUWAYD_TAJWEED_CURRICULUM.forEach(l => {
          l.quizQuestions.forEach((q, idx) => {
            list.push({
              id: l.id + '_q' + idx,
              lessonTitle: l.titleAr,
              questionAr: '[' + l.titleAr + '] ' + q.qAr,
              questionEn: q.qAr,
              options: q.opts.map(o => ({ id: o.id, textAr: o.text, textEn: o.text })),
              correctOptionId: q.correct,
              explanationAr: q.exp,
              explanationEn: q.exp
            });
          });
        });
        return list;
      });
      const [customHifzQuizzes, setCustomHifzQuizzes] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_custom_hifz_quizzes');
          return s ? JSON.parse(s) : JSON.parse(JSON.stringify(HIFZ_BRANCH_QUIZ));
        } catch (e) {
          return JSON.parse(JSON.stringify(HIFZ_BRANCH_QUIZ));
        }
      });

      const [isAddingQuizQuestion, setIsAddingQuizQuestion] = useState(false);
      const [editingQuizQuestionId, setEditingQuizQuestionId] = useState(null);
      const [quizQuestionForm, setQuizQuestionForm] = useState({
        questionAr: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        correctOptionId: 'a',
        explanationAr: ''
      });

      // Auto-save custom worksheets & quizzes
      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_islamic_worksheets', JSON.stringify(customIslamicWorksheets));
        } catch (e) {}
      }, [customIslamicWorksheets]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_tajweed_worksheet', JSON.stringify(customTajweedWorksheet));
        } catch (e) {}
      }, [customTajweedWorksheet]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_islamic_quizzes', JSON.stringify(customIslamicQuizzes));
        } catch (e) {}
      }, [customIslamicQuizzes]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_tajweed_quizzes', JSON.stringify(customTajweedQuizzes));
        } catch (e) {}
      }, [customTajweedQuizzes]);

      useEffect(() => {
        try {
          localStorage.setItem('mishkah_custom_hifz_quizzes', JSON.stringify(customHifzQuizzes));
        } catch (e) {}
      }, [customHifzQuizzes]);

      // Handlers for Islamic Worksheets
      const handleSaveWorksheetItem = (e) => {
        if (e) e.preventDefault();
        if (!worksheetItemForm.topic.trim()) {
          showToast(isRtl ? 'يرجى كتابة المسألة الشرعية' : 'Please enter the topic');
          return;
        }
        setCustomIslamicWorksheets(prev => {
          const current = prev[worksheetIslamicCategory] || JSON.parse(JSON.stringify(ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah));
          const items = [...(current.items || [])];
          if (editingWorksheetItemIdx !== null && editingWorksheetItemIdx >= 0) {
            items[editingWorksheetItemIdx] = {
              num: editingWorksheetItemIdx + 1,
              ...worksheetItemForm
            };
          } else {
            items.push({
              num: items.length + 1,
              ...worksheetItemForm
            });
          }
          return {
            ...prev,
            [worksheetIslamicCategory]: {
              ...current,
              items
            }
          };
        });
        setIsAddingWorksheetItem(false);
        setEditingWorksheetItemIdx(null);
        setWorksheetItemForm({ topic: '', scripture: '', studentQuestion: '', teacherAnswer: '', practicalImpact: '', maxScore: 5 });
        showToast(isRtl ? 'تم حفظ البند في ورقة العمل بنجاح 💾' : 'Item saved to worksheet 💾');
      };

      const handleDeleteWorksheetItem = (idx) => {
        setCustomIslamicWorksheets(prev => {
          const current = prev[worksheetIslamicCategory] || prev.aqeedah;
          const items = (current.items || []).filter((_, i) => i !== idx).map((it, i) => ({ ...it, num: i + 1 }));
          return {
            ...prev,
            [worksheetIslamicCategory]: {
              ...current,
              items
            }
          };
        });
        showToast(isRtl ? 'تم حذف البند من ورقة العمل 🗑️' : 'Item deleted 🗑️');
      };

      const handleResetIslamicWorksheet = () => {
        const canonical = ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
        setCustomIslamicWorksheets(prev => ({
          ...prev,
          [worksheetIslamicCategory]: JSON.parse(JSON.stringify(canonical))
        }));
        showToast(isRtl ? 'تمت استعادة ورقة العمل النموذجية المعتمدة 🔄' : 'Restored canonical template 🔄');
      };

      const handleClearIslamicWorksheet = () => {
        setCustomIslamicWorksheets(prev => {
          const current = prev[worksheetIslamicCategory] || prev.aqeedah;
          return {
            ...prev,
            [worksheetIslamicCategory]: {
              ...current,
              items: []
            }
          };
        });
        showToast(isRtl ? 'تم تفريغ ورقة العمل — يمكنك البدء على نظافة 🧹' : 'Worksheet cleared 🧹');
      };

      // Handlers for Tajweed Worksheets
      const handleSaveTajweedItem = (e) => {
        if (e) e.preventDefault();
        if (!tajweedItemForm.wordUthmani.trim()) {
          showToast(isRtl ? 'يرجى إدخال الكلمة القرآنية' : 'Please enter the Quranic word');
          return;
        }
        setCustomTajweedWorksheet(prev => {
          const items = [...(prev.items || [])];
          if (editingTajweedItemIdx !== null && editingTajweedItemIdx >= 0) {
            items[editingTajweedItemIdx] = {
              itemNumber: editingTajweedItemIdx + 1,
              ...tajweedItemForm
            };
          } else {
            items.push({
              itemNumber: items.length + 1,
              ...tajweedItemForm
            });
          }
          return { ...prev, items };
        });
        setIsAddingTajweedItem(false);
        setEditingTajweedItemIdx(null);
        setTajweedItemForm({ wordUthmani: '', ruleApplied: '', reasonAr: '', maxScore: 5 });
        showToast(isRtl ? 'تمت إضافة الكلمة والحكم التجويدي بنجاح 💾' : 'Tajweed word saved 💾');
      };

      const handleDeleteTajweedItem = (idx) => {
        setCustomTajweedWorksheet(prev => ({
          ...prev,
          items: (prev.items || []).filter((_, i) => i !== idx).map((it, i) => ({ ...it, itemNumber: i + 1 }))
        }));
        showToast(isRtl ? 'تم حذف الكلمة من ورقة التجويد 🗑️' : 'Tajweed item deleted 🗑️');
      };

      const handleResetTajweedWorksheet = () => {
        setCustomTajweedWorksheet({
          titleAr: 'ورقة مدارسة وتطبيق في أحكام التجويد',
          titleEn: 'Tajweed Student Worksheet',
          surah: 'سورة الملك: الآيات 1-12',
          items: [
            { itemNumber: 1, wordUthmani: 'شَىْءٍ قَدِيرٌ', ruleApplied: 'إخفاء حقيقي بغنة مفخمة', reasonAr: 'تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء المفخمة)', maxScore: 5 },
            { itemNumber: 2, wordUthmani: 'خَلَقَ ٱلْمَوْتَ', ruleApplied: 'قلقلة صغرى', reasonAr: 'حرف القاف ساكن في وسط الكلمة / سكون أصلي مخفف', maxScore: 5 },
            { itemNumber: 3, wordUthmani: 'مِّن تَفَٰوُتٍ', ruleApplied: 'إخفاء حقيقي بغنة مرققة', reasonAr: 'نون ساكنة بعدها حرف التاء (من حروف الاستفال)', maxScore: 5 },
            { itemNumber: 4, wordUthmani: 'هَلْ تَرَىٰ مِن فُطُورٍ', ruleApplied: 'إظهار لامي + إخفاء نون', reasonAr: 'لام الحرف مظهرة + نون ساكنة بعدها حرف الفاء', maxScore: 5 }
          ]
        });
        showToast(isRtl ? 'تمت استعادة ورقة التجويد النموذجية 🔄' : 'Tajweed worksheet reset 🔄');
      };

      const handleClearTajweedWorksheet = () => {
        setCustomTajweedWorksheet(prev => ({ ...prev, items: [] }));
        showToast(isRtl ? 'تم تفريغ ورقة التجويد للبدء على نظافة 🧹' : 'Tajweed worksheet cleared 🧹');
      };

      // Import from Active Branch 3 Lecture to Worksheet
      const handleTransferLectureToWorksheet = () => {
        if (!islamicData) {
          showToast(isRtl ? 'لا توجد محاضرة نشطة حالياً في حقيبة العلوم الشرعية' : 'No active lecture to transfer');
          return;
        }
        const newItems = (islamicData.worksheetItems && islamicData.worksheetItems.length > 0)
          ? islamicData.worksheetItems
          : (islamicData.blueprint || []).map((b, idx) => ({
            num: idx + 1,
            topic: b.phaseNameAr || ('المحور ' + (idx + 1)),
            scripture: b.scripture || (islamicData.hadithVerification && islamicData.hadithVerification[0]?.text) || (islamicData.evidences && islamicData.evidences[0]?.arabicText) || 'الدليل الشرعي المعتمد',
            studentQuestion: b.studentQuestion || ('ما المستفاد العملي والتأصيلي من محور: ' + (b.phaseNameAr || 'هذا المحور') + '؟ مع الاستدلال.'),
            teacherAnswer: b.teacherFocusAr || b.teacherGuidanceAr || 'التأصيل العلمي والتربوي المنضبط المستخلص من المحاضرة.',
            practicalImpact: b.practicalImpact || b.keyTakeawayAr || 'التطبيق العملي والسلوكي في حياة المسلم والدارس.',
            maxScore: 5
          }));

        setCustomIslamicWorksheets(prev => ({
          ...prev,
          [worksheetIslamicCategory]: {
            id: worksheetIslamicCategory,
            categoryAr: (islamicData.metadata && islamicData.metadata.category) || 'العلوم الشرعية',
            categoryEn: 'Islamic Studies',
            titleAr: 'ورقة عمل وتطبيق: ' + ((islamicData.metadata && islamicData.metadata.topic) || 'المحاضرة الشرعية'),
            titleEn: 'Worksheet: ' + ((islamicData.metadata && islamicData.metadata.topic) || 'Islamic Lecture'),
            targetAudience: (islamicData.metadata && islamicData.metadata.audience) || 'الدارسين والحلقة',
            quranRef: 'مقتبس من محاور المحاضرة الشرعية المعتمدة',
            hadithRef: (islamicData.hadithVerification && islamicData.hadithVerification[0]?.text) || (islamicData.evidences && islamicData.evidences[0]?.arabicText) || 'تخريج صحيح البخاري / مسلم',
            items: newItems
          }
        }));
        setWorksheetBranch('islamic');
        setWorksheetMode('preview');
        setActiveTab('worksheet');
        showToast(isRtl ? `تم نقل ${newItems.length} محاور مفصلة إلى ورقة العمل للطباعة بنجاح ⚡` : 'Lecture transferred to worksheet ⚡');
      };

      // Import from Active Branch 3 Lecture to Quiz
      const handleTransferLectureToQuiz = () => {
        const availableQuestions = (islamicData && (islamicData.quizQuestions || islamicData.reviewQuiz)) || [];
        if (!islamicData || !availableQuestions.length) {
          showToast(isRtl ? 'لا توجد أسئلة مولدة في المحاضرة النشطة' : 'No generated questions in active lecture');
          return;
        }
        const qs = availableQuestions.map((q, idx) => ({
          id: 'custom_lec_' + idx + '_' + Date.now(),
          questionAr: q.questionAr || q.question || 'سؤال في مدارسة المحاضرة',
          questionEn: q.questionEn || q.questionAr || 'Lecture Quiz Question',
          options: (q.options || []).map(opt => ({
            id: opt.id || 'opt_' + Math.random(),
            textAr: opt.textAr || opt.text || opt.title || 'خيار الإجابة',
            textEn: opt.textEn || opt.textAr || opt.text || 'Answer option'
          })),
          correctOptionId: q.correctOptionId || 'a',
          explanationAr: q.explanationAr || q.reflectionPrompt || 'توجيه شرعي مستفاد من المحاضرة',
          explanationEn: q.explanationEn || q.reflectionPrompt || 'Islamic reflection from lecture'
        }));
        setCustomIslamicQuizzes(prev => ({
          ...prev,
          [quizIslamicCategory]: qs
        }));
        setQuizBranch('islamic');
        setQuizMode('student');
        setQuizAnswers({});
        setQuizSubmitted(false);
        setActiveTab('quiz');
        showToast(isRtl ? `تم نقل ${qs.length} أسئلة مستخلصة إلى الاختبار الذاتي التفاعلي بنجاح ⚡` : 'Lecture questions transferred to quiz ⚡');
      };

      // Import from Active Tajweed Lesson to Worksheet
      const handleTransferTajweedToWorksheet = () => {
        if (!tajweedData || !tajweedData.worksheet || !tajweedData.worksheet.length) {
          showToast(isRtl ? 'لا توجد كلمات في درس التجويد الحالي' : 'No words in current Tajweed lesson');
          return;
        }
        const items = tajweedData.worksheet.map((w, idx) => ({
          itemNumber: idx + 1,
          wordUthmani: w.wordUthmani,
          ruleApplied: w.ruleApplied,
          reasonAr: w.reasonAr || 'بيان المخرج والصفة والعلة الصوتية',
          maxScore: 5
        }));
        setCustomTajweedWorksheet({
          titleAr: 'ورقة عمل في أحكام التجويد: ' + (currentSuwaydLesson?.titleAr || tajweedData.metadata?.titleAr || 'درس التجويد'),
          titleEn: 'Tajweed Worksheet',
          surah: tajweedData.metadata?.surah || currentSuwaydLesson?.titleAr || 'سورة الملك',
          items
        });
        setWorksheetBranch('tajweed');
        setWorksheetMode('preview');
        setActiveTab('worksheet');
        showToast(isRtl ? 'تم نقل كلمات درس التجويد إلى ورقة العمل ⚡' : 'Tajweed words transferred to worksheet ⚡');
      };

      // Handlers for Quiz Question Management
      const handleSaveQuizQuestion = (e) => {
        if (e) e.preventDefault();
        if (!quizQuestionForm.questionAr.trim() || !quizQuestionForm.optA.trim() || !quizQuestionForm.optB.trim()) {
          showToast(isRtl ? 'يرجى كتابة نص السؤال وخيارين على الأقل' : 'Please enter question and at least 2 options');
          return;
        }
        const newQ = {
          id: editingQuizQuestionId || ('custom_q_' + Date.now()),
          questionAr: quizQuestionForm.questionAr.trim(),
          questionEn: quizQuestionForm.questionAr.trim(),
          options: [
            { id: 'a', textAr: quizQuestionForm.optA.trim(), textEn: quizQuestionForm.optA.trim() },
            { id: 'b', textAr: quizQuestionForm.optB.trim(), textEn: quizQuestionForm.optB.trim() },
            { id: 'c', textAr: quizQuestionForm.optC.trim() || (isRtl ? 'خيار إضافي' : 'Option C'), textEn: quizQuestionForm.optC.trim() || 'Option C' },
            { id: 'd', textAr: quizQuestionForm.optD.trim() || (isRtl ? 'خيار إضافي' : 'Option D'), textEn: quizQuestionForm.optD.trim() || 'Option D' }
          ],
          correctOptionId: quizQuestionForm.correctOptionId || 'a',
          explanationAr: quizQuestionForm.explanationAr.trim() || (isRtl ? 'تأصيل وتوجيه السؤال' : 'Explanation'),
          explanationEn: quizQuestionForm.explanationAr.trim() || 'Explanation'
        };

        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => {
            const list = [...(prev[quizIslamicCategory] || prev.aqeedah || [])];
            if (editingQuizQuestionId) {
              const idx = list.findIndex(item => item.id === editingQuizQuestionId);
              if (idx >= 0) list[idx] = newQ;
              else list.push(newQ);
            } else {
              list.push(newQ);
            }
            return { ...prev, [quizIslamicCategory]: list };
          });
        } else if (quizBranch === 'tajweed') {
          setCustomTajweedQuizzes(prev => {
            const list = [...(prev || [])];
            if (editingQuizQuestionId) {
              const idx = list.findIndex(item => item.id === editingQuizQuestionId);
              if (idx >= 0) list[idx] = newQ;
              else list.push(newQ);
            } else {
              list.push(newQ);
            }
            return list;
          });
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes(prev => {
            const list = [...(prev || [])];
            if (editingQuizQuestionId) {
              const idx = list.findIndex(item => item.id === editingQuizQuestionId);
              if (idx >= 0) list[idx] = newQ;
              else list.push(newQ);
            } else {
              list.push(newQ);
            }
            return list;
          });
        }

        setIsAddingQuizQuestion(false);
        setEditingQuizQuestionId(null);
        setQuizQuestionForm({ questionAr: '', optA: '', optB: '', optC: '', optD: '', correctOptionId: 'a', explanationAr: '' });
        showToast(isRtl ? 'تم حفظ السؤال في بنك الاختبار بنجاح 💾' : 'Question saved to quiz bank 💾');
      };

      const handleDeleteQuizQuestion = (qId) => {
        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => ({
            ...prev,
            [quizIslamicCategory]: (prev[quizIslamicCategory] || []).filter(q => q.id !== qId)
          }));
        } else if (quizBranch === 'tajweed') {
          setCustomTajweedQuizzes(prev => (prev || []).filter(q => q.id !== qId));
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes(prev => (prev || []).filter(q => q.id !== qId));
        }
        showToast(isRtl ? 'تم حذف السؤال من بنك الاختبار 🗑️' : 'Question deleted 🗑️');
      };

      const handleResetQuizQuestions = () => {
        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => ({
            ...prev,
            [quizIslamicCategory]: JSON.parse(JSON.stringify(ISLAMIC_BRANCH_QUIZZES[quizIslamicCategory] || ISLAMIC_BRANCH_QUIZZES.aqeedah))
          }));
        } else if (quizBranch === 'tajweed') {
          const list = [];
          SUWAYD_TAJWEED_CURRICULUM.forEach(l => {
            l.quizQuestions.forEach((q, idx) => {
              list.push({
                id: l.id + '_q' + idx,
                lessonTitle: l.titleAr,
                questionAr: '[' + l.titleAr + '] ' + q.qAr,
                questionEn: q.qAr,
                options: q.opts.map(o => ({ id: o.id, textAr: o.text, textEn: o.text })),
                correctOptionId: q.correct,
                explanationAr: q.exp,
                explanationEn: q.exp
              });
            });
          });
          setCustomTajweedQuizzes(list);
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes(JSON.parse(JSON.stringify(HIFZ_BRANCH_QUIZ)));
        }
        showToast(isRtl ? 'تمت استعادة الأسئلة النموذجية المعتمدة 🔄' : 'Restored canonical quiz questions 🔄');
      };

      const handleClearQuizQuestions = () => {
        if (quizBranch === 'islamic') {
          setCustomIslamicQuizzes(prev => ({ ...prev, [quizIslamicCategory]: [] }));
        } else if (quizBranch === 'tajweed') {
          setCustomTajweedQuizzes([]);
        } else if (quizBranch === 'hifz') {
          setCustomHifzQuizzes([]);
        }
        showToast(isRtl ? 'تم تفريغ أسئلة الاختبار للبدء على نظافة 🧹' : 'Quiz cleared 🧹');
      };

      // Module B: Islamic Studies State
      const [subjectCategory, setSubjectCategory] = useState('العقيدة (Aqeedah)');
      const [lessonTopic, setLessonTopic] = useState('أركان الإيمان الستة والسكينة النفسية');
      const [lessonDuration, setLessonDuration] = useState(45);
      const [audienceLevel, setAudienceLevel] = useState('اليافعين والمهتدين الجدد (Bilingual Youth)');
      const [islamicData, setIslamicData] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_active_islamic_data');
          return s ? sanitizeIslamicDataObject(JSON.parse(s)) : null;
        } catch (e) { return null; }
      });
      const [isCurrentLectureSaved, setIsCurrentLectureSaved] = useState(false);

      // Auto-persist active lecture so progress is NEVER lost across refreshes
      useEffect(() => {
        if (islamicData) {
          try {
            localStorage.setItem('mishkah_active_islamic_data', JSON.stringify(islamicData));
          } catch (e) {}
        }
      }, [islamicData]);
      const [savedIslamicLectures, setSavedIslamicLectures] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_saved_lectures');
          if (!s) return [];
          const list = JSON.parse(s);
          if (!Array.isArray(list)) return [];
          return list.map(item => ({
            ...item,
            data: sanitizeIslamicDataObject(item.data)
          }));
        } catch (e) { return []; }
      });
      const [rawLectureText, setRawLectureText] = useState('');
      const [customSubjectCategory, setCustomSubjectCategory] = useState('');
      const [islamicInputMode, setIslamicInputMode] = useState('file'); // 'file', 'paste' or 'structured'
      const [islamicSubView, setIslamicSubView] = useState('workbench'); // 'workbench' or 'library'
      const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { name, sizeKb, wordCount, lineCount }
      const [isExtractingFile, setIsExtractingFile] = useState(false);
      const [activeIslamicStage, setActiveIslamicStage] = useState(() => (localStorage.getItem('mishkah_active_islamic_data') ? 2 : 1)); // 1 to 6
      const [slideCondensedMode, setSlideCondensedMode] = useState(false);
      const studentWindowRef = useRef(null);
      // True while the student window is open, so the teacher's own view can
      // show hidden lines through a light veil instead of hiding them from her.
      const [studentScreenOpen, setStudentScreenOpen] = useState(false);
      useEffect(() => {
        const timer = setInterval(() => {
          const win = studentWindowRef.current;
          setStudentScreenOpen(!!(win && !win.closed));
        }, 1000);
        return () => clearInterval(timer);
      }, []);
      const syncChannelRef = useRef(null);

      // Universal Smooth Stage Switcher: Guarantees fluid navigation across all 6 stages
      const handleJumpToStage = (targetNum) => {
        if (targetNum > 1 && !islamicData) {
          showToast(isRtl ? 'يرجى إدخال ومعالجة المحاضرة أولاً للانتقال لهذه المرحلة' : 'Please input and process lecture first');
          return;
        }
        setActiveIslamicStage(targetNum);
        // Scroll immediately near top so that view switches from taller stages (like stage 6) never leave viewport past the bottom
        window.scrollTo({ top: 120, behavior: 'smooth' });
        setTimeout(() => {
          const el = document.getElementById('stage-islamic-' + targetNum);
          if (el) {
            const headerOffset = 95;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            });
          }
        }, 100);
      };

      // Intelligent Slide Condenser Tool: Condenses any slide into ultra-crisp golden bullet points
      const handleCondenseSlide = (slideIdx) => {
        if (!islamicData || !islamicData.zoomCards || !islamicData.zoomCards[slideIdx]) return;
        const currentBullets = islamicData.zoomCards[slideIdx].bulletPoints || [];
        const secTitle = islamicData.zoomCards[slideIdx].slideTitle || '';
        const condensed = currentBullets.slice(0, 2).map(b => {
          let s = b.replace(/^[•\s\d\.\)\-]+/, '').trim();
          if (s.length > 60) {
            const sp = s.substring(0, 56).lastIndexOf(' ');
            s = (sp > 20 ? s.substring(0, sp) : s.substring(0, 54)).trim();
          }
          return s;
        });
        const updatedCards = [...islamicData.zoomCards];
        updatedCards[slideIdx] = {
          ...updatedCards[slideIdx],
          bulletPoints: condensed.length > 0 ? condensed : [`تأصيل: ${secTitle}`, 'الثمرة السلوكية والمنهجية']
        };
        const updatedData = { ...islamicData, zoomCards: updatedCards };
        setIslamicData(updatedData);
        try {
          localStorage.setItem('mishkah_active_islamic_data', JSON.stringify(updatedData));
        } catch (e) {}
        showToast(isRtl ? 'تم التلخيص الذكي وتكثيف الشريحة لشاشة زوم بنجاح ✨' : 'Slide distilled for Zoom ✨');
      };

      useEffect(() => {
        try {
          syncChannelRef.current = new BroadcastChannel('mishkah_presentation_sync');
        } catch(e) {}
        return () => {
          if (syncChannelRef.current) syncChannelRef.current.close();
        };
      }, []);

      const broadcastSlideSync = (slideIndex, dataToSync) => {
        try {
          localStorage.setItem('mishkah_active_slide_idx', String(slideIndex));
          if (syncChannelRef.current) {
            syncChannelRef.current.postMessage({
              type: 'SYNC_SLIDE',
              slideIndex: slideIndex,
              data: dataToSync || islamicData
            });
          }
        } catch(e) {}
      };

      const handleOpenStudentPopout = () => {
        const url = window.location.origin + window.location.pathname + '?mode=student-display&v=68';
        const win = window.open(
          url,
          'MishkahStudentDisplay',
          'width=1120,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
        );
        if (win) {
          studentWindowRef.current = win;
          win.focus();
          showToast(isRtl ? 'تم فتح نافذة شاشة الطلاب بنجاح! شارك هذه النافذة في زوم (Share Window) 🪟' : 'Student display opened! Share this window in Zoom 🪟');
          setTimeout(() => {
            broadcastSlideSync(stage3ActiveSlide, islamicData);
          }, 400);
        } else {
          showToast(isRtl ? 'يرجى السماح بالنوافذ المنبثقة لفتح نافذة الطلاب' : 'Please allow popups in your browser');
        }
      };
      const [islamicViewMode, setIslamicViewMode] = useState('stepper'); // 'stepper' (single stage focus) or 'all' (continuous)
      const [librarySearchQuery, setLibrarySearchQuery] = useState('');
      const [libraryFilterDiscipline, setLibraryFilterDiscipline] = useState('all');
      const [structuredPhasesText, setStructuredPhasesText] = useState('');
      const [structuredHadithText, setStructuredHadithText] = useState('');
      const [structuredStoryText, setStructuredStoryText] = useState('');

      const [isGeneratingIslamic, setIsGeneratingIslamic] = useState(false);

      // Presentation & Slide State
      const [activeSlideIndex, setActiveSlideIndex] = useState(0);
      const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
      const [presentationTarget, setPresentationTarget] = useState('islamic'); // 'islamic' or 'tajweed'
      const [presentationFontSize, setPresentationFontSize] = useState('large'); // 'normal', 'large', 'xl'
      const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
      const [isExportingPptx, setIsExportingPptx] = useState(false);
      const [stage3ActiveSlide, setStage3ActiveSlide] = useState(0);
      const [stage3ViewMode, setStage3ViewMode] = useState('player'); // 'player' (Live Deck Carousel) or 'grid' (All Cards)
      const [showMasterGuide, setShowMasterGuide] = useState(true);

      // Interactive Student Quiz State
      const [quizAnswers, setQuizAnswers] = useState({});
      const [quizSubmitted, setQuizSubmitted] = useState(false);
      const [islamicQuizAnswers, setIslamicQuizAnswers] = useState({});
      const [islamicQuizSubmitted, setIslamicQuizSubmitted] = useState(false);
      const [islamicWorksheetViewMode, setIslamicWorksheetViewMode] = useState('student'); // 'student' or 'teacher'
      const [islamicWorksheetAnswers, setIslamicWorksheetAnswers] = useState({});
      const [extractedEvidences, setExtractedEvidences] = useState(() => {
        try {
          const s = localStorage.getItem('mishkah_active_islamic_evidences');
          return s ? JSON.parse(s) : { quranicVerses: [], hadiths: [], scholarlyProofs: [] };
        } catch (e) { return { quranicVerses: [], hadiths: [], scholarlyProofs: [] }; }
      });
      const [showExtractedTextPreview, setShowExtractedTextPreview] = useState(false);
      const [showEvidenceBankModal, setShowEvidenceBankModal] = useState(false);
      const [evidenceBankFilter, setEvidenceBankFilter] = useState('all'); // 'all', 'quran', 'hadith', 'scholarly'
      const [teacherScriptFontSize, setTeacherScriptFontSize] = useState('medium'); // 'small', 'medium', 'large'
      const [teacherTeleprompterMode, setTeacherTeleprompterMode] = useState('full'); // 'full' (Complete Lecture) or 'section' (Current Slide)
      const teacherTeleprompterScrollRef = useRef(null);

      const handleScrollTeleprompter = (action) => {
        const el = teacherTeleprompterScrollRef.current;
        if (!el) return;
        if (action === 'up') {
          el.scrollBy({ top: -240, behavior: 'smooth' });
        } else if (action === 'down') {
          el.scrollBy({ top: 240, behavior: 'smooth' });
        } else if (action === 'top') {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'bottom') {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }
      };

      useEffect(() => {
        if (extractedEvidences) {
          try {
            localStorage.setItem('mishkah_active_islamic_evidences', JSON.stringify(extractedEvidences));
          } catch (e) {}
        }
      }, [extractedEvidences]);

      // Dynamic Islamic Quiz Score Calculation
      const islamicQuizScore = useMemo(() => {
        if (!islamicData || !islamicData.quizQuestions || !islamicData.quizQuestions.length) return 0;
        let correct = 0;
        islamicData.quizQuestions.forEach(q => {
          if (islamicQuizAnswers[q.id] === (q.correctOptionId || 'a')) correct++;
        });
        return Math.round((correct / islamicData.quizQuestions.length) * 100);
      }, [islamicData, islamicQuizAnswers]);

      // Toast notification
      const [toast, setToast] = useState(null);
      const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
      };

      // Load initial pre-loaded demo lessons
      useEffect(() => {
        handleLoadDemoTajweed();
        // // // handleLoadDemoIslamic(); - Clean slate on startup - Clean slate on startup - Clean slate on startup
      }, []);

      // Handlers to load Pre-loaded Demo Lessons instantly
      function handleLoadDemoTajweed() {
        setTajweedData(getFallbackTajweed());
        setQuizAnswers({});
        setQuizSubmitted(false);
        showToast(isRtl ? 'تم تحميل درس التجويد التجريبي الجاهز (سورة الملك) ⚡' : 'Pre-loaded Tajweed Demo Lesson Loaded (Al-Mulk) ⚡');
      }




      function handleSaveIslamicLecture() {
        if (!islamicData) return;
        try {
          const currentTopic = islamicData?.metadata?.topic || 'محاضرة شرعية';
          const newEntry = {
            id: 'lec_' + Date.now(),
            savedAt: new Date().toLocaleDateString('ar-EG'),
            data: islamicData
          };
          const existing = Array.isArray(savedIslamicLectures) ? savedIslamicLectures : [];
          const updated = [newEntry, ...existing.filter(x => (x?.data?.metadata?.topic || '') !== currentTopic)];
          setSavedIslamicLectures(updated);
          try {
            localStorage.setItem('mishkah_saved_lectures', JSON.stringify(updated));
            localStorage.setItem('mishkah_active_islamic_data', JSON.stringify(islamicData));
          } catch (storageErr) {
            console.warn('LocalStorage save warning:', storageErr);
          }
          setIsCurrentLectureSaved(true);
          showToast(isRtl ? 'تم حفظ المحاضرة في مكتبتك الخاصة بنجاح 💾' : 'Lecture saved to your library 💾');
        } catch (err) {
          console.error('Error saving lecture:', err);
          setIsCurrentLectureSaved(true);
          showToast(isRtl ? 'تم حفظ المحاضرة محلياً 💾' : 'Lecture saved locally 💾');
        }
      }

      function handleDeleteSavedLecture(id) {
        const updated = savedIslamicLectures.filter(x => x.id !== id);
        setSavedIslamicLectures(updated);
        try {
          localStorage.setItem('mishkah_saved_lectures', JSON.stringify(updated));
        } catch (e) {}
        showToast(isRtl ? 'تم حذف المحاضرة من المكتبة' : 'Lecture removed from library');
      }

      function handleLoadSavedLecture(lec) {
        const cleanData = sanitizeIslamicDataObject(lec.data);
        setIslamicData(cleanData);
        setLessonTopic(lec.data.metadata.topic);
        setSubjectCategory(lec.data.metadata.category);
        setIslamicSubView('workbench');
        showToast(isRtl ? 'تم فتح المحاضرة المحفوظة 📖' : 'Loaded saved lecture 📖');
      }

      // Start Fullscreen Presentation for Lecture
      const handleStartLecturePresentation = (slideIndex = 0) => {
        setPresentationTarget('islamic');
        setActiveSlideIndex(slideIndex);
        setIsFullscreenZoom(true);
      };

      // Start Fullscreen Presentation for Tajweed
      const handleStartTajweedPresentation = (slideIndex = 0) => {
        setPresentationTarget('tajweed');
        setActiveSlideIndex(slideIndex);
        setIsFullscreenZoom(true);
      };

      // Keyboard navigation for presentation mode
      useEffect(() => {
        if (!isFullscreenZoom) return;
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            setIsFullscreenZoom(false);
          } else if (e.key === 'ArrowLeft') {
            setActiveSlideIndex(prev => {
              const max = presentationTarget === 'islamic'
                ? (((islamicData && (islamicData.zoomCards || islamicData.blueprint || [])).length || 1) - 1)
                : (((tajweedData && (tajweedData.presentationCards || [])).length || 1) - 1);
              return Math.min(max, prev + 1);
            });
          } else if (e.key === 'ArrowRight') {
            setActiveSlideIndex(prev => Math.max(0, prev - 1));
          } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            setActiveSlideIndex(prev => {
              const max = presentationTarget === 'islamic'
                ? (((islamicData && (islamicData.zoomCards || islamicData.blueprint || [])).length || 1) - 1)
                : (((tajweedData && (tajweedData.presentationCards || [])).length || 1) - 1);
              return Math.min(max, prev + 1);
            });
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [isFullscreenZoom, presentationTarget, islamicData, tajweedData]);






      


      function handleExportLibrary() {
        if (!savedIslamicLectures.length) {
          showToast(isRtl ? 'مكتبتك فارغة حالياً للتصدير' : 'Library is empty');
          return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedIslamicLectures, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", 'mishkah_lectures_backup_' + new Date().toISOString().slice(0,10) + '.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast(isRtl ? 'تم تصدير نسخة احتياطية من مكتبتك بنجاح 📤' : 'Library exported successfully 📤');
      }

      function handleImportLibrary(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (Array.isArray(parsed)) {
              const merged = [...parsed, ...savedIslamicLectures.filter(x => !parsed.some(p => p.id === x.id))];
              setSavedIslamicLectures(merged);
              localStorage.setItem('mishkah_saved_lectures', JSON.stringify(merged));
              showToast(isRtl ? ('تم استيراد ' + parsed.length + ' محاضرة بنجاح 📥') : ('Imported ' + parsed.length + ' lectures 📥'));
            }
          } catch (err) {
            showToast(isRtl ? 'ملف الاستيراد غير صالح' : 'Invalid file format');
          }
        };
        reader.readAsText(file);
      }

      function handleResetIslamicForm() {
        setIslamicData(null);
        setIsCurrentLectureSaved(false);
        setRawLectureText('');
        setLessonTopic('');
        setCustomSubjectCategory('');
        setUploadedFileInfo(null);
        setIslamicQuizAnswers({});
        setIslamicQuizSubmitted(false);
        setIslamicWorksheetAnswers({});
        setActiveIslamicStage(1);
        try {
          localStorage.removeItem('mishkah_active_islamic_data');
        } catch (e) {}
        showToast(isRtl ? 'تمت تهيئة الشاشة لبدء درس جديد على نظافة 🌿' : 'Reset to clean slate 🌿');
      }


      function handleLoadDemoIslamic() {
        setIslamicData(sanitizeIslamicDataObject(EXEMPLAR_TAWHEED_LECTURE.data));
        setLessonTopic('من هو الله؟ — تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين');
        setSubjectCategory('العقيدة والتوحيد (Aqeedah)');
        setActiveIslamicStage(2);
        showToast(isRtl ? 'تم تحميل المحاضرة التأصيلية النموذجية الكاملة (30 شريحة متكاملة الأنماط) بنجاح ✨' : '30-Slide Master Multi-Archetype Presentation Loaded ✨');
      }


      async function handleGenerateIslamic(isInitial = false) {
        setIsGeneratingIslamic(true);
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-mishkah-pin': teacherPin
            },
            body: JSON.stringify({
              type: 'islamic',
              category: subjectCategory,
              topic: lessonTopic,
              duration: lessonDuration,
              audienceLevel: audienceLevel,
              languageMode: 'bilingual',
              isDemo: isInitial
            })
          });

          if (res.ok) {
            const json = await res.json();
            setIslamicData(json.data);
            if (!isInitial) showToast(isRtl ? 'تم توليد مخطط الحلقة والملخص المعتمد بنجاح 🌿' : 'Islamic Studies Blueprint Generated 🌿');
          } else {
            throw new Error('Server returned ' + res.status);
          }
        } catch (err) {
          console.warn('Using client fallback:', err.message);
          setIslamicData(getFallbackIslamic());
        } finally {
          setIsGeneratingIslamic(false);
        }
      }


      


      // Dynamic Multi-Branch Quiz Selection (Teacher Customizable Question Bank)
      const activeQuizQuestions = useMemo(() => {
        if (quizBranch === 'islamic') {
          return customIslamicQuizzes[quizIslamicCategory] || customIslamicQuizzes.aqeedah || [];
        } else if (quizBranch === 'tajweed') {
          return customTajweedQuizzes || [];
        } else if (quizBranch === 'hifz') {
          return customHifzQuizzes || [];
        }
        return [];
      }, [quizBranch, quizIslamicCategory, customIslamicQuizzes, customTajweedQuizzes, customHifzQuizzes]);

      // Dynamic Quiz Score Calculation
      const quizScore = useMemo(() => {
        if (!activeQuizQuestions.length) return 0;
        let correct = 0;
        activeQuizQuestions.forEach(q => {
          if (quizAnswers[q.id] === q.correctOptionId) correct++;
        });
        return Math.round((correct / activeQuizQuestions.length) * 100);
      }, [quizAnswers, activeQuizQuestions]);

      // Switch quiz branch and clear previous answers for clean test
      const handleSwitchQuizBranch = (branch, category = null) => {
        setQuizBranch(branch);
        if (category) setQuizIslamicCategory(category);
        setQuizAnswers({});
        setQuizSubmitted(false);
      };

      // Copy WhatsApp text to clipboard
      const handleCopyWhatsApp = () => {
        if (islamicData?.whatsAppKit?.formattedText) {
          navigator.clipboard.writeText(islamicData.whatsAppKit.formattedText);
          showToast(isRtl ? 'تم نسخ ملخص الواتساب بنجاح 📋' : 'WhatsApp Summary Copied to Clipboard 📋');
        }
      };

      const { handleProcessCustomLecture, handleLectureFileUpload, getFallbackIslamic } = createLectureActions({ audienceLevel, customSubjectCategory, extractedEvidences, isRtl, lessonDuration, lessonTopic, rawLectureText, setActiveIslamicStage, setExtractedEvidences, setIsExtractingFile, setIslamicData, setIslamicQuizAnswers, setIslamicQuizSubmitted, setIslamicWorksheetAnswers, setLessonTopic, setRawLectureText, setStage3ActiveSlide, setUploadedFileInfo, showToast, subjectCategory });

      const { handleExportIslamicPowerPoint } = createPowerPointExport({ isRtl, islamicData, setIsExportingPptx, showToast });

      const { handleGenerateTajweed, getFallbackTajweed } = createTajweedActions({ ayahRange, customContext, isRtl, selectedRule, selectedTextbook, setIsGeneratingTajweed, setQuizAnswers, setQuizSubmitted, setTajweedData, showToast, surahName, tajweedMode, teacherPin });


      useEffect(() => {
        if (activeTab === 'hifz') {
          publishStage({ kind: 'mushaf', page: mushafPageNumber, overlayMode: mushafOverlayMode, rulerLine: activeRulerLine });
        } else if (activeTab === 'tajweed') {
          publishStage({
            kind: 'tajweed',
            lessonId: currentSuwaydLesson && currentSuwaydLesson.id,
            slideIndex: suwaydZoomModalOpen ? suwaydZoomSlideIndex : 0,
            plateId: activeSuwaydPlateId,
            metronome: { count: metronomeCount, playing: metronomePlaying, beat: metronomeBeat }
          });
        } else if (activeTab === 'islamic') {
          publishStage({ kind: 'slides' });
        }
      }, [activeTab, mushafPageNumber, mushafOverlayMode, activeRulerLine, currentSuwaydLesson, suwaydZoomModalOpen,
          suwaydZoomSlideIndex, activeSuwaydPlateId, metronomeCount, metronomePlaying, metronomeBeat]);

      return (
        <div className="min-h-screen flex flex-col islamic-screen-pattern">
          
          {/* TOAST ALERT: Floating Bottom Snackbar so it never blocks header controls */}
          {toast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 border-2 border-gold-400 text-gold-200 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm backdrop-blur-md transition-all">
              <span>✨</span>
              <span>{toast}</span>
            </div>
          )}

          {/* TOP GRAND EMERALD HEADER */}
          <header className="emerald-pattern text-white relative border-b-4 border-gold-400 shadow-xl overflow-hidden rounded-b-3xl sm:rounded-b-[36px] no-print">
            {/* Islamic Corner Rosette Accents */}
            <div className="absolute top-2 right-4 text-gold-300/40 text-lg font-amiri pointer-events-none select-none">۞</div>
            <div className="absolute top-2 left-4 text-gold-300/40 text-lg font-amiri pointer-events-none select-none">۞</div>
            {/* 8-pointed star watermark background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
              <svg className="w-[600px] h-[600px] text-gold-300" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="50,0 64,28 95,21 80,50 95,79 64,72 50,100 36,72 5,79 20,50 5,21 36,28" />
              </svg>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 relative z-10">
              {/* Row 1: Brand Logo & Title on Right + Actions on Left */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                {/* Brand */}
                <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-950 border-2 border-gold-400 p-0.5 shadow-lg flex items-center justify-center transform hover:scale-105 transition overflow-hidden shrink-0">
                    <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Logo" className="w-full h-full object-cover rounded-xl drop-shadow" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-normal text-gold-300 font-amiri drop-shadow-lg leading-none" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)' }}>
                      {isRtl ? 'منصة مِشكاة' : 'Mishkah Platform'}
                    </h1>
                    <p className="text-xs text-emerald-100/90 font-medium hidden md:block mt-0.5 font-cairo">
                      {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : "Comprehensive OS for Da'wah & Islamic Educators"}
                    </p>
                  </div>
                </div>

                {/* Quick Actions (Library + Security + Lang) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handleOpenStudentPopout}
                    className={'font-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 border-2 ' +
                      (studentScreenOpen ? 'bg-emerald-600 text-white border-emerald-300' : 'bg-white text-emerald-950 border-gold-400 hover:bg-gold-50')}
                    title={isRtl ? 'نافذة نظيفة للطلاب — شاركيها وحدها في زوم' : 'Clean window for students — share only this window in Zoom'}
                  >
                    <span>🖥️</span>
                    <span>{studentScreenOpen ? (isRtl ? 'شاشة الطالب مفتوحة' : 'Student screen open') : (isRtl ? 'افتحي شاشة الطالب' : 'Open student screen')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('islamic');
                      setIslamicSubView('library');
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
                    title={isRtl ? 'مكتبة محاضراتي المحفوظة' : 'My Lectures Library'}
                  >
                    <span>📚</span>
                    <span className="text-[11px] sm:text-xs font-black">{isRtl ? 'مكتبة محاضراتي' : 'My Library'}</span>
                    <span className="bg-emerald-950 text-gold-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {savedIslamicLectures.length}
                    </span>
                  </button>

                  <button 
                    onClick={() => setIsPinModalOpen(true)}
                    className="bg-emerald-800/90 hover:bg-emerald-700 border border-gold-400/50 text-gold-200 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition shadow-xs"
                    title={isRtl ? 'رمز أمان المعلم' : 'Teacher Security PIN'}
                  >
                    <span>🔒</span>
                    <span className="text-[11px] font-bold hidden xs:inline">{isRtl ? 'الأمان' : 'PIN'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  </button>

                  <button 
                    onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black text-xs px-2.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                  >
                    <span>🌐</span>
                    <span className="text-[11px] font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Typography Group on Right + Version Badge on Left */}
              <div className="flex items-center justify-between gap-3 pt-2 pb-1 border-t border-emerald-800/60 flex-wrap sm:flex-nowrap">
                {/* Group: Font Family Dropdown + Font Size Pills Side by Side */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Font Family */}
                  <div className="flex items-center gap-1 bg-emerald-950/80 border border-gold-400/50 rounded-xl px-2.5 py-1 text-xs text-gold-200 shadow-xs">
                    <span className="text-gold-300 text-xs">🔤</span>
                    <select 
                      value={appFont} 
                      onChange={(e) => {
                        const newF = e.target.value;
                        setAppFont(newF);
                        const fCfg = FONT_MAP[newF] || FONT_MAP.cairo;
                        showToast(isRtl ? 'تم تفعيل ' + fCfg.nameAr + ' ✨' : 'Font set to ' + fCfg.nameEn + ' ✨');
                      }}
                      className="bg-transparent text-gold-100 font-bold text-[11px] focus:outline-none cursor-pointer"
                      title={isRtl ? 'اختيار خط واجهة التطبيق' : 'Choose Interface Font'}
                    >
                      <option value="cairo" className="bg-emerald-950 text-gold-100">{isRtl ? "خط كايرو (Cairo)" : "Cairo Font"}</option>
                      <option value="amiri" className="bg-emerald-950 text-gold-100">{isRtl ? "خط أميري (Amiri)" : "Amiri Font"}</option>
                      <option value="tajawal" className="bg-emerald-950 text-gold-100">{isRtl ? "خط تجوال (Tajawal)" : "Tajawal Font"}</option>
                      <option value="almarai" className="bg-emerald-950 text-gold-100">{isRtl ? "خط المراعي (Almarai)" : "Almarai Font"}</option>
                      <option value="naskh" className="bg-emerald-950 text-gold-100">{isRtl ? "خط النسخ (Noto Naskh)" : "Noto Naskh Font"}</option>
                    </select>
                  </div>

                  {/* Font Size Pills (Directly Beside Font Family!) */}
                  <div className="flex items-center gap-1 bg-emerald-950/80 border border-gold-400/50 rounded-xl px-2 py-1 text-xs text-gold-200 shadow-xs">
                    <span className="text-gold-300 text-[10px] font-bold">{isRtl ? 'حجم الخط:' : 'Size:'}</span>
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

                {/* System Version Badge positioned at the end of Row 2 */}
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if ('caches' in window) {
                        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
                      }
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(regs => {
                          for (let r of regs) r.unregister();
                        });
                      }
                    } catch (e) {}
                    const cleanPath = window.location.origin + window.location.pathname;
                    window.location.replace(cleanPath + '?v=81.1&t=' + Date.now());
                  }}
                  className="bg-gold-400/90 hover:bg-gold-300 text-emerald-950 border border-gold-300 text-[10px] sm:text-xs px-3 py-1 rounded-full font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition shrink-0"
                  title={isRtl ? 'الإصدار المعتمد v81.3 — انقر للتحديث الفوري وإفراغ الذاكرة المؤقتة' : 'v81.3 — Click to force reload'}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
                  <span>{isRtl ? 'الإصدار v81.3' : 'v81.3'}</span>
                  <span className="text-[9px] bg-emerald-950 text-gold-300 px-1.5 py-0.2 rounded-full font-bold hidden sm:inline">
                    {isRtl ? 'أحدث تحديث' : 'Latest'}
                  </span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar — 3 Core Foundation Branches (Substantially Enlarged & Dignified Typography) */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-t-2 border-emerald-800/90 flex flex-wrap py-2 gap-2 sm:gap-4 justify-center items-center">
              {[
                { id: 'hifz', icon: '🕋', labelAr: '1. التحفيظ والتسميع', labelEn: '1. Quran & Mushaf' },
                { id: 'tajweed', icon: '📖', labelAr: '2. التجويد', labelEn: '2. Tajweed Rules' },
                { id: 'islamic', icon: '🕌', labelAr: '3. المحاضرات الشرعية', labelEn: '3. Islamic Lectures' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'tajweed') {
                      setTajweedSubTab('generator');
                      setSuwaydCatalogSubTab('lessons');
                      setSuwaydViewMode('catalog');
                    }
                  }}
                  className={`branch-tab-btn flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl font-extrabold font-cairo whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-gold-400 via-amber-300 to-gold-400 text-emerald-950 shadow-xl border-3 border-gold-200 ring-2 ring-gold-400/50' 
                      : 'bg-emerald-900/85 hover:bg-emerald-800 text-emerald-100 hover:text-white border-2 border-emerald-700/80 shadow-md hover:border-gold-400/60'
                  }`}
                >
                  <span className="text-xl sm:text-2xl drop-shadow leading-none shrink-0">{tab.icon}</span>
                  <span className="branch-tab-label font-black font-cairo leading-none drop-shadow-xs">{isRtl ? tab.labelAr : tab.labelEn}</span>
                </button>
              ))}
            </div>
          </header>

          {/* MAIN WORKSPACE BODY */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

            {/* ================= VIEW: DASHBOARD ================= */}
            {activeTab === 'dashboard' && <DashboardTab {...{ isRtl, setActiveTab, tajweedData }} />}

            {/* ================= VIEW: MODULE A (TAJWEED COPILOT) ================= */}
                        {/* ================= VIEW: HIFZ & RECITATION WORKBENCH (BRANCH 1) ================= */}
            {activeTab === 'hifz' && <HifzTab {...{ studentScreenOpen, activeRepeatAyah, activeRulerLine, customMaskedWords, handleActivatePassageTest, handleDeleteMutashabiha, handleFetchTargetMutaAyah, handleNavigateMushafPage, handlePassageVerdict, handleSaveNewMutashabiha, handleSearchMutaAyahs, handleSelectMutaMatch, hifzAyahRange, hifzAyahs, hifzMutashabihat, hifzSurahName, hifzViewMode, hifzWorksheetModalOpen, isAddMutaOpen, isAlternatingMasked, isDivineNamesMasked, isEndingsMasked, isFetchingQuran, isFullMasked, isReverseOrder, isRtl, isSearchingMuta, isStartersMasked, mushafCurrentSurahId, mushafOverlayMode, mushafPageNumber, mutaGuideNote, mutaSearchQuery, mutaSearchResults, mutaTargetAyahNum, mutaTargetSurahId, mutaTargetText, passageMaskedAyahs, passageRetryCount, passageStatus, passageTestSection, quranFontSize, repeatCount, repeatTarget, revealedAyahSet, setActiveRepeatAyah, setActiveRulerLine, setCustomMaskedWords, setHifzViewMode, setHifzWorksheetModalOpen, setIsAddMutaOpen, setIsAlternatingMasked, setIsDivineNamesMasked, setIsEndingsMasked, setIsFullMasked, setIsReverseOrder, setIsStartersMasked, setMaskedMushafLines, setMushafOverlayMode, setMutaGuideNote, setMutaSearchQuery, setPassageMaskedAyahs, setPassageTestSection, setQuranFontSize, setRepeatCount, setRepeatTarget, setRevealedAyahSet, showToast, toggleRevealAyah, toggleWordMask }} />}
            {activeTab === 'tajweed' && <TajweedTab {...{ activeMakhrajId, activeSuwaydPlateId, atlasCategory, atlasSearch, currentSuwaydLesson, currentZoomSlides, filterMatchesSuwaydLesson, isRtl, metronomeBeat, metronomeCount, metronomePlaying, metronomeSound, metronomeSpeed, plateZoomLevel, playMetronomeTick, setActiveMakhrajId, setActiveSuwaydPlateId, setAtlasCategory, setAtlasSearch, setMetronomeBeat, setMetronomeCount, setMetronomePlaying, setMetronomeSound, setMetronomeSpeed, setPlateZoomLevel, setSuwaydCatalogSubTab, setSuwaydFilterCategory, setSuwaydLessonId, setSuwaydPlateZoomModal, setSuwaydQuizAnswers, setSuwaydQuizModalOpen, setSuwaydQuizSubmitted, setSuwaydSearchQuery, setSuwaydViewMode, setSuwaydWorksheetModalOpen, setSuwaydZoomModalOpen, setSuwaydZoomSlideIndex, setTajweedSubTab, suwaydCatalogSubTab, suwaydFilterCategory, suwaydLessonId, suwaydPlateZoomModal, suwaydQuizAnswers, suwaydQuizModalOpen, suwaydQuizSubmitted, suwaydSearchQuery, suwaydViewMode, suwaydWorksheetModalOpen, suwaydZoomModalOpen, suwaydZoomSlideIndex, tajweedSubTab }} />}

            {/* ================= VIEW: ISLAMIC STUDIES & SERMON WORKBENCH (BRANCH 3) ================= */}
            {activeTab === 'islamic' && <IslamicTab {...{ activeIslamicStage, broadcastSlideSync, extractEvidencesAndProofs, extractedEvidences, handleCondenseSlide, handleCopyWhatsApp, handleDeleteSavedLecture, handleExportIslamicPowerPoint, handleExportLibrary, handleImportLibrary, handleJumpToStage, handleLectureFileUpload, handleLoadDemoIslamic, handleLoadSavedLecture, handleOpenStudentPopout, handleProcessCustomLecture, handleResetIslamicForm, handleSaveIslamicLecture, handleScrollTeleprompter, handleStartLecturePresentation, handleTransferLectureToQuiz, handleTransferLectureToWorksheet, isCurrentLectureSaved, isExportingPptx, isExtractingFile, isGeneratingIslamic, isRtl, islamicData, islamicInputMode, islamicQuizAnswers, islamicQuizScore, islamicQuizSubmitted, islamicSubView, islamicViewMode, islamicWorksheetAnswers, islamicWorksheetViewMode, lessonDuration, lessonTopic, rawLectureText, sanitizeArabicExtractedText, sanitizeIslamicDataObject, savedIslamicLectures, setActiveIslamicStage, setExtractedEvidences, setIslamicData, setIslamicInputMode, setIslamicQuizAnswers, setIslamicQuizSubmitted, setIslamicSubView, setIslamicViewMode, setIslamicWorksheetAnswers, setIslamicWorksheetViewMode, setLessonDuration, setLessonTopic, setRawLectureText, setShowEvidenceBankModal, setShowExtractedTextPreview, setShowMasterGuide, setStage3ActiveSlide, setStage3ViewMode, setStructuredPhasesText, setSubjectCategory, setTeacherScriptFontSize, setTeacherTeleprompterMode, showExtractedTextPreview, showMasterGuide, showToast, stage3ActiveSlide, stage3ViewMode, structuredPhasesText, subjectCategory, teacherScriptFontSize, teacherTeleprompterMode, teacherTeleprompterScrollRef, uploadedFileInfo }} />}

            {/* Dedicated Islamic Evidences & Scientific Proofs Modal */}
            {showEvidenceBankModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border-2 border-emerald-900/20 shadow-2xl">
                  {/* Modal Header */}
                  <div className="bg-emerald-950 text-gold-200 p-4 sm:p-6 flex items-center justify-between border-b-2 border-gold-400">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-gold-500 text-emerald-950 font-black flex items-center justify-center text-xl shadow-md">
                        📜
                      </span>
                      <div>
                        <h3 className="text-base sm:text-xl font-black font-cairo text-gold-200">
                          {isRtl ? 'بنك الأدلة الشرعية والبراهين العلمية المستخلصة' : 'Extracted Islamic Evidences Bank'}
                        </h3>
                        <p className="text-xs text-gold-300/80">
                          {isRtl ? 'الآيات القرآنية والأحاديث النبوية وأقوال أئمة الهدى والبراهين الموثقة في ملف المحاضرة' : 'Quranic Verses, Hadiths & Proofs from Lecture Document'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowEvidenceBankModal(false)}
                      className="w-9 h-9 rounded-full bg-emerald-900 hover:bg-emerald-800 text-gold-200 flex items-center justify-center font-bold text-lg transition cursor-pointer border border-gold-400/40"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Filter Tabs */}
                  <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap items-center gap-2">
                    {[
                      { id: 'all', labelAr: `كافة الأدلة (${(extractedEvidences.quranicVerses || []).length + (extractedEvidences.hadiths || []).length + (extractedEvidences.scholarlyProofs || []).length})`, labelEn: 'All' },
                      { id: 'quran', labelAr: `الآيات القرآنية (${(extractedEvidences.quranicVerses || []).length})`, labelEn: 'Quran' },
                      { id: 'hadith', labelAr: `الأحاديث النبوية (${(extractedEvidences.hadiths || []).length})`, labelEn: 'Hadith' },
                      { id: 'scholarly', labelAr: `أقوال العلماء والبراهين (${(extractedEvidences.scholarlyProofs || []).length})`, labelEn: 'Scholarly & Proofs' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setEvidenceBankFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          evidenceBankFilter === f.id
                            ? 'bg-emerald-900 text-gold-200 font-black shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isRtl ? f.labelAr : f.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Evidence List */}
                  <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
                    {/* Quranic Verses */}
                    {(evidenceBankFilter === 'all' || evidenceBankFilter === 'quran') && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-950 font-cairo flex items-center gap-1.5 pb-1 border-b border-emerald-900/10">
                          <span>📖</span>
                          <span>{isRtl ? 'الآيات القرآنية الكريمة:' : 'Quranic Verses:'}</span>
                        </h4>
                        {(extractedEvidences.quranicVerses || []).map((q, idx) => (
                          <div key={idx} className="bg-emerald-950 text-gold-200 p-4 rounded-2xl border border-gold-400/40 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-xs pb-1 border-b border-gold-400/20">
                              <span className="font-black text-gold-300">{q.citation || 'القرآن الكريم'}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(q.arabicText);
                                  showToast(isRtl ? 'تم نسخ الآية الكريمة بنجاح 📋' : 'Copied verse 📋');
                                }}
                                className="text-[10px] bg-emerald-900 hover:bg-emerald-800 text-gold-200 px-2 py-0.5 rounded-lg border border-gold-400/30 font-bold transition cursor-pointer"
                              >
                                📋 {isRtl ? 'نسخ الآية' : 'Copy'}
                              </button>
                            </div>
                            <p className="font-quran text-lg sm:text-xl text-amber-100 leading-relaxed text-center py-1">
                              {q.arabicText}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Prophetic Hadiths */}
                    {(evidenceBankFilter === 'all' || evidenceBankFilter === 'hadith') && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-black text-emerald-950 font-cairo flex items-center gap-1.5 pb-1 border-b border-emerald-900/10">
                          <span>✨</span>
                          <span>{isRtl ? 'الأحاديث النبوية الشريفة:' : 'Prophetic Hadiths:'}</span>
                        </h4>
                        {(extractedEvidences.hadiths || []).map((h, idx) => (
                          <div key={idx} className="card-islamic-amber p-4 rounded-2xl border border-gold-400/60 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-xs pb-1 border-b border-amber-900/15">
                              <span className="font-bold text-amber-900">{h.source || 'السنة النبوية'} • {h.narrator || 'صحابي جليل'}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(h.arabicText);
                                  showToast(isRtl ? 'تم نسخ الحديث الشريف بنجاح 📋' : 'Copied hadith 📋');
                                }}
                                className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-400 font-bold transition cursor-pointer"
                              >
                                📋 {isRtl ? 'نسخ الحديث' : 'Copy'}
                              </button>
                            </div>
                            <p className="font-amiri text-sm sm:text-base text-slate-800 font-bold leading-relaxed text-right py-1">
                              {h.arabicText}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Scholarly Proofs */}
                    {(evidenceBankFilter === 'all' || evidenceBankFilter === 'scholarly') && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-black text-emerald-950 font-cairo flex items-center gap-1.5 pb-1 border-b border-emerald-900/10">
                          <span>🎓</span>
                          <span>{isRtl ? 'أقوال العلماء والبراهين العلمية والتاريخية:' : 'Scholarly Sayings & Proofs:'}</span>
                        </h4>
                        {(extractedEvidences.scholarlyProofs || []).map((s, idx) => (
                          <div key={idx} className="card-islamic-sky p-4 rounded-2xl border border-sky-300 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-xs pb-1 border-b border-sky-900/15">
                              <span className="font-bold text-sky-950">{s.author}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(s.quote);
                                  showToast(isRtl ? 'تم نسخ القول بنجاح 📋' : 'Copied proof 📋');
                                }}
                                className="text-[10px] bg-sky-200 hover:bg-sky-300 text-sky-950 px-2 py-0.5 rounded-lg border border-sky-400 font-bold transition cursor-pointer"
                              >
                                📋 {isRtl ? 'نسخ القول' : 'Copy'}
                              </button>
                            </div>
                            <p className="font-amiri text-xs sm:text-sm text-slate-800 font-bold leading-relaxed text-right py-1">
                              « {s.quote} »
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-slate-100 p-3.5 border-t border-slate-200 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEvidenceBankModal(false)}
                      className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
                    >
                      {isRtl ? 'إغلاق نافذة الأدلة' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= VIEW: PRINTABLE MULTI-BRANCH WORKSHEETS & TEACHER BUILDER ================= */}
            {activeTab === 'worksheet' && <WorksheetTab {...{ customIslamicWorksheets, customTajweedWorksheet, editingTajweedItemIdx, editingWorksheetItemIdx, handleClearIslamicWorksheet, handleClearTajweedWorksheet, handleDeleteTajweedItem, handleDeleteWorksheetItem, handleResetIslamicWorksheet, handleResetTajweedWorksheet, handleSaveTajweedItem, handleSaveWorksheetItem, handleTransferLectureToWorksheet, handleTransferTajweedToWorksheet, hifzAyahRange, hifzSurahName, isAddingTajweedItem, isAddingWorksheetItem, isRtl, islamicData, setCustomIslamicWorksheets, setCustomTajweedWorksheet, setEditingTajweedItemIdx, setEditingWorksheetItemIdx, setIsAddingTajweedItem, setIsAddingWorksheetItem, setTajweedItemForm, setWorksheetBranch, setWorksheetIslamicCategory, setWorksheetItemForm, setWorksheetMode, tajweedData, tajweedItemForm, worksheetBranch, worksheetIslamicCategory, worksheetItemForm, worksheetMode }} />}

            {/* ================= VIEW: INTERACTIVE SELF-GRADING QUIZ & TEACHER QUESTION BANK ================= */}
            {activeTab === 'quiz' && <QuizTab {...{ activeQuizQuestions, editingQuizQuestionId, handleClearQuizQuestions, handleDeleteQuizQuestion, handleResetQuizQuestions, handleSaveQuizQuestion, handleSwitchQuizBranch, handleTransferLectureToQuiz, isAddingQuizQuestion, isRtl, islamicData, quizAnswers, quizBranch, quizIslamicCategory, quizMode, quizQuestionForm, quizScore, quizSubmitted, setEditingQuizQuestionId, setIsAddingQuizQuestion, setQuizAnswers, setQuizMode, setQuizQuestionForm, setQuizSubmitted }} />}
          </main>

          {/* ================= FULLSCREEN PRESENTATION OVERLAY (Strict Viewport-Fit 16:9, Zero Cropping) ================= */}
          {isFullscreenZoom && (presentationTarget === 'islamic' ? islamicData : tajweedData) && (
            <div className="zoom-slide-fullscreen select-none">
              {/* Top Control Bar */}
              <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 z-50 py-1.5 px-2 shrink-0 border-b border-gold-400/20">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreenZoom(false)}
                    className="bg-red-600/90 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✕</span>
                    <span>{isRtl ? 'إنهاء العرض' : 'Exit'}</span>
                  </button>

                  {/* Font Size Adjuster */}
                  <div className="bg-emerald-950/90 border border-gold-400/40 rounded-xl p-0.5 flex items-center gap-1 text-xs text-gold-300">
                    <span className="px-1 text-[10px] text-slate-400">{isRtl ? 'الخط:' : 'Font:'}</span>
                    <button 
                      onClick={() => setPresentationFontSize('normal')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer text-xs ${presentationFontSize === 'normal' ? 'bg-gold-500 text-emerald-950' : 'hover:bg-emerald-800'}`}
                    >
                      {isRtl ? 'صغير' : 'Sm'}
                    </button>
                    <button 
                      onClick={() => setPresentationFontSize('large')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer text-xs ${presentationFontSize === 'large' ? 'bg-gold-500 text-emerald-950' : 'hover:bg-emerald-800'}`}
                    >
                      {isRtl ? 'متوسط' : 'Md'}
                    </button>
                    <button 
                      onClick={() => setPresentationFontSize('xl')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer text-xs ${presentationFontSize === 'xl' ? 'bg-gold-500 text-emerald-950' : 'hover:bg-emerald-800'}`}
                    >
                      {isRtl ? 'كبير' : 'Lg'}
                    </button>
                  </div>

                  {/* Presenter Notes Toggle */}
                  {presentationTarget === 'islamic' && (
                    <button
                      onClick={() => setShowSpeakerNotes(prev => !prev)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition border flex items-center gap-1 shadow-md cursor-pointer ${
                        showSpeakerNotes 
                          ? 'bg-gold-500 text-emerald-950 border-gold-300' 
                          : 'bg-emerald-950/80 text-gold-300 border-gold-400/30 hover:bg-emerald-900'
                      }`}
                    >
                      <span>📝</span>
                      <span>{isRtl ? (showSpeakerNotes ? 'إخفاء ملاحظات الشرح' : 'ملاحظات المحاضر') : 'Notes'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Download PowerPoint Button directly from Presenter View */}
                  {presentationTarget === 'islamic' && (
                    <button
                      onClick={handleExportIslamicPowerPoint}
                      disabled={isExportingPptx}
                      className="bg-gold-500 hover:bg-gold-400 text-emerald-950 text-xs px-3 py-1.5 rounded-xl font-black transition shadow-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <span>📥</span>
                      <span>{isExportingPptx ? (isRtl ? 'جاري التحميل...' : 'Exporting...') : (isRtl ? 'تحميل كبوربوينت (.pptx)' : 'PowerPoint (.pptx)')}</span>
                    </button>
                  )}

                  {/* Native Fullscreen Toggle */}
                  <button
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                      } else {
                        document.exitFullscreen().catch(() => {});
                      }
                    }}
                    className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 text-xs px-2.5 py-1.5 rounded-xl font-bold transition border border-gold-400/30 shadow-md cursor-pointer"
                  >
                    ⛶ {isRtl ? 'شاشة كاملة' : 'Fullscreen'}
                  </button>
                </div>
              </div>

              {/* Slide Content Rendering */}
              {presentationTarget === 'islamic' ? (() => {
                const slidesList = (islamicData.zoomCards && islamicData.zoomCards.length > 0)
                  ? islamicData.zoomCards
                  : (islamicData.blueprint || []);
                const currentSlide = slidesList[activeSlideIndex] || slidesList[0] || {};
                const slideTitleText = currentSlide.slideTitle || currentSlide.phaseTitle || currentSlide.phaseNameAr || (`المحور ${activeSlideIndex + 1}`);
                const scriptureText = typeof distillSlideScripture === "function" ? distillSlideScripture(currentSlide.scriptureEvidence || currentSlide.scripture) : normalizeIslamicSacredTerms(currentSlide.scriptureEvidence || currentSlide.scripture);
                const bodyText = currentSlide.bodyAr || currentSlide.talkingPoints || currentSlide.teacherFocusAr || currentSlide.teacherGuidanceAr;
                const impactText = currentSlide.pedagogicalTip || currentSlide.practicalAction || currentSlide.keyTakeawayAr || currentSlide.practicalImpact;

                return (
                  <div className="w-full max-w-5xl flex flex-col justify-between items-center text-white px-2 sm:px-4 my-auto flex-1 min-h-0 py-1.5 sm:py-2">
                    {/* Slide Container (Viewport-bounded, never cut from top or bottom) */}
                    <div className="w-full max-h-[calc(100vh-6.5rem)] flex flex-col justify-between overflow-y-auto bg-emerald-950/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border-2 border-gold-400 shadow-2xl relative backdrop-blur-md space-y-2.5 sm:space-y-3">
                      
                      {/* Top Meta Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-1 border-b border-gold-400/30 shrink-0">
                        <div className="flex items-center gap-2 text-gold-300 font-bold text-xs sm:text-sm">
                          <span className="w-6 h-6 rounded-full bg-gold-500 text-emerald-950 font-black flex items-center justify-center text-xs">
                            {activeSlideIndex + 1}
                          </span>
                          <span>{islamicData.metadata.topic}</span>
                        </div>
                        <span className="bg-emerald-900 px-2.5 py-0.5 rounded-full text-gold-300 text-xs font-bold border border-gold-400/30">
                          {islamicData.metadata.category}
                        </span>
                      </div>

                      {/* Section Heading */}
                      <h3 className="font-amiri text-lg sm:text-2xl lg:text-3xl font-extrabold text-gold-200 mb-1 leading-snug text-right shrink-0">
                        {slideTitleText}
                      </h3>

                      {/* Scripture Box */}
                      {scriptureText && (
                        <div className="my-1.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-900/70 border border-gold-400/50 shadow-inner text-center shrink-0">
                          <p className="font-quran text-base sm:text-xl lg:text-2xl text-amber-100 leading-relaxed drop-shadow-sm">
                            {formatScriptureDisplay(scriptureText)}
                          </p>
                        </div>
                      )}

                      {/* Body Content - 3 Focus Cards */}
                      <div className="my-1.5 space-y-2 sm:space-y-2.5 w-full">
                        {(currentSlide.bulletPoints || (currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText])).map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-3 bg-emerald-900/60 p-2 sm:p-3 rounded-xl border border-gold-400/30 shadow-sm text-right">
                            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold-500 text-emerald-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                              {pIdx + 1}
                            </span>
                            <p className="font-amiri text-xs sm:text-base lg:text-lg text-slate-100 font-bold leading-relaxed">
                              {sanitizeArabicExtractedText(pt)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Behavioral Impact Footer */}
                      {impactText && (
                        <div className="mt-2 pt-2 border-t border-gold-400/30 flex items-center gap-2 text-[11px] sm:text-xs text-gold-300 font-bold bg-emerald-900/40 p-2 sm:p-2.5 rounded-lg text-right shrink-0">
                          <span>💡</span>
                          <span>{isRtl ? 'الأثر السلوكي والتطبيقي:' : 'Practical Impact:'} {impactText}</span>
                        </div>
                      )}

                      {/* Speaker Notes Drawer (Toggled by Presenter) */}
                      {showSpeakerNotes && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-950/80 border border-gold-400/60 text-right animate-fadeIn shrink-0">
                          <span className="block text-gold-300 font-bold text-xs mb-1">
                            📝 {isRtl ? 'ملاحظات وتوجيهات الشرح للمحاضر (خاص بالمعلم):' : 'Presenter Notes:'}
                          </span>
                          <p className="font-amiri text-xs sm:text-sm text-amber-100 leading-relaxed">
                            {sanitizeArabicExtractedText(currentSlide.pedagogicalTip || currentSlide.teacherFocusAr || currentSlide.teacherGuidanceAr || 'استعرض المحور مع إشراك الدارسين في استنباط الثمرات.')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Navigation Toolbar */}
                    <div className="flex items-center gap-3 pt-2 pb-1 shrink-0">
                      <button 
                        disabled={activeSlideIndex === 0}
                        onClick={() => setActiveSlideIndex(prev => prev - 1)}
                        className="bg-emerald-800 disabled:opacity-25 hover:bg-emerald-700 text-gold-200 font-bold px-4 py-1.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>◀</span>
                        <span>{isRtl ? 'السابق' : 'Previous'}</span>
                      </button>

                      {/* Slide Indicator Dots / Count */}
                      <div className="flex items-center gap-2 px-3">
                        <span className="text-gold-300 font-bold text-xs sm:text-sm">
                          {activeSlideIndex + 1} / {slidesList.length}
                        </span>
                      </div>

                      <button 
                        disabled={activeSlideIndex === slidesList.length - 1}
                        onClick={() => setActiveSlideIndex(prev => prev + 1)}
                        className="bg-emerald-800 disabled:opacity-25 hover:bg-emerald-700 text-gold-200 font-bold px-4 py-1.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{isRtl ? 'التالي' : 'Next'}</span>
                        <span>▶</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-0.5 font-mono shrink-0">
                      {isRtl ? 'يمكنك التنقل بالأسهم ◄ ► أو المسافة (Space)، والخروج بزر Esc' : 'Use arrow keys or space to navigate, Esc to exit'}
                    </div>
                  </div>
                );
              })() : (() => {
                // Tajweed presentation code (Responsive Viewport Containment)
                const cardsList = tajweedData.presentationCards || [];
                const card = cardsList[activeSlideIndex] || cardsList[0] || {};
                return (
                  <div className="w-full max-w-5xl flex flex-col justify-between items-center text-center text-white my-auto flex-1 min-h-0 py-2 space-y-3">
                    <div className="text-gold-300 text-xs sm:text-sm font-bold tracking-widest uppercase shrink-0">
                      {isRtl ? card.titleAr : card.titleEn}
                    </div>

                    <div className="my-2 sm:my-4 px-4 shrink-0">
                      <p className="font-quran text-2xl sm:text-4xl lg:text-5xl text-amber-100 leading-relaxed drop-shadow-md">
                        {(() => {
                          const text = card.ayahTextUthmani || '';
                          const target = card.highlightedPortion || '';
                          if (!target || !text.includes(target)) {
                            return <span>{text}</span>;
                          }
                          return text.split(target).map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="bg-emerald-600/80 text-gold-200 font-bold border-b-4 sm:border-b-8 border-gold-400 px-3 sm:px-4 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl shadow-xl">
                                  {target}
                                </span>
                              )}
                            </React.Fragment>
                          ));
                        })()}
                      </p>
                    </div>

                    <div className="bg-emerald-950/90 rounded-2xl p-4 sm:p-5 border border-gold-400/50 max-w-3xl text-right font-amiri text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed shadow-xl max-h-[35vh] overflow-y-auto">
                      <p>{isRtl ? card.explanationAr : card.explanationEn}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 shrink-0">
                      <button 
                        disabled={activeSlideIndex === 0}
                        onClick={() => setActiveSlideIndex(prev => prev - 1)}
                        className="bg-emerald-800 disabled:opacity-20 hover:bg-emerald-700 text-gold-200 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm cursor-pointer"
                      >
                        {isRtl ? 'السابق' : 'Previous'}
                      </button>
                      <span className="text-gold-300 font-bold text-xs sm:text-sm px-3">
                        {activeSlideIndex + 1} / {cardsList.length}
                      </span>
                      <button 
                        disabled={activeSlideIndex === cardsList.length - 1}
                        onClick={() => setActiveSlideIndex(prev => prev + 1)}
                        className="bg-emerald-800 disabled:opacity-20 hover:bg-emerald-700 text-gold-200 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm cursor-pointer"
                      >
                        {isRtl ? 'التالي' : 'Next'}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================= SECURITY PIN GATE MODAL ================= */}
          {isPinModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-emerald-900 shadow-2xl text-right">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🔒</span>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950 font-cairo">
                      {isRtl ? 'بوابة أمان المعلم (Teacher PIN Access)' : 'Teacher Security Gate'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isRtl ? 'حماية مفاتيح الذكاء الاصطناعي على الخادم ومنع الاستخدام غير المصرح به' : 'Serverless proxy security gate preventing unauthorized AI calls'}
                    </p>
                  </div>
                </div>

                <div className="my-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRtl ? 'رمز المرور المعتمد (PIN):' : 'Enter Teacher Passcode / PIN:'}
                  </label>
                  <input 
                    type="password" 
                    value={tempPin} 
                    onChange={(e) => setTempPin(e.target.value)}
                    placeholder="MISHKAH2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-center font-mono text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    {isRtl ? 'الرمز الافتراضي المعتمد للنسخة: MISHKAH2026' : 'Default sandbox PIN: MISHKAH2026'}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setIsPinModalOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    onClick={() => {
                      setTeacherPin(tempPin);
                      localStorage.setItem('mishkah_pin', tempPin);
                      setIsPinModalOpen(false);
                      showToast(isRtl ? 'تم تحديث وحفظ رمز المعلم بنجاح 🔒' : 'Teacher PIN Saved Successfully 🔒');
                    }}
                    className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-5 py-2 rounded-xl text-xs shadow"
                  >
                    {isRtl ? 'حفظ وتأكيد' : 'Confirm PIN'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATION FOOTER */}
          <footer className="bg-emerald-950 text-emerald-200/80 border-t border-emerald-900 py-6 text-center text-xs no-print">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold-300 font-amiri text-base">مِشكاة | Mishkah</span>
                <span>—</span>
                <span>{isRtl ? 'منصة الداعية والمعلم الأولى لتعليم القرآن والعلوم الشرعية' : 'Empowering Quran & Islamic Studies Educators'}</span>
              </div>
              <div className="text-[11px] text-emerald-400/80">
                <span>Designed with ADR-0006 Grand Emerald & Soft Gold Motif • Gemini Flash Architecture</span>
              </div>
            </div>
          </footer>
        </div>
      );
    }
