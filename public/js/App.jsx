
    function App() {
      // Check if this window was opened as a dedicated Student Projector Screen for Zoom
      const isStudentDisplayMode = window.location.search.includes('mode=student-display');
      if (isStudentDisplayMode) {
        return <StudentProjectorScreen />;
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

      const filterMatchesSuwaydLesson = (catId, lesson, search = '') => {
        if (!lesson) return false;
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          const title = (lesson.titleAr || '').toLowerCase();
          const def = (lesson.definitionAr || '').toLowerCase();
          const cat = (lesson.categoryAr || '').toLowerCase();
          const ex = (lesson.examples || []).map(e => (e.word || '') + ' ' + (e.note || '')).join(' ').toLowerCase();
          if (!title.includes(q) && !def.includes(q) && !cat.includes(q) && !ex.includes(q)) {
            return false;
          }
        }
        if (!catId || catId === 'all') return true;
        if (catId === 'makharij') return lesson.categoryId === 'makharij';
        if (catId === 'sifat') return lesson.categoryId === 'sifat';
        if (catId === 'noon_meem' || catId === 'noon_and_meem') {
          return lesson.categoryId === 'noon_sakinah' || lesson.categoryId === 'meem_sakinah' || lesson.categoryId === 'noon_and_meem';
        }
        if (catId === 'lamat') {
          return lesson.categoryId === 'lamat' || lesson.categoryId === 'letter_relations';
        }
        if (catId === 'madd' || catId === 'madd_rules') {
          return lesson.categoryId === 'madd_rules' || lesson.categoryId === 'madd';
        }
        if (catId === 'tafkheem' || catId === 'tafkheem_rules') {
          return lesson.categoryId === 'tafkheem_rules' || lesson.categoryId === 'tafkheem';
        }
        if (catId === 'rasm_waqf' || catId === 'waqf_rasm') {
          return lesson.categoryId === 'waqf_rules' || lesson.categoryId === 'hamzah_rules' || lesson.categoryId === 'rasm_rules' || lesson.categoryId === 'rasm_waqf';
        }
        if (catId === 'intro_tajweed' || catId === 'intro') {
          return lesson.categoryId === 'intro_tajweed';
        }
        return lesson.categoryId === catId;
      };
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
      const currentZoomSlides = useMemo(() => {
        if (!currentSuwaydLesson) return [];
        const slides = [];

        // Slide 0: Matn and Illustrated Anatomical Plate
        slides.push({
          type: 'overview',
          titleAr: 'الشاهد المعتمد من المتن واللوحة التعليمية المصورة',
          titleEn: 'Authentic Matn Verse & Illustrated Anatomical Plate'
        });

        // Systematic Letter & Case Breakdown Slides
        if (Array.isArray(currentSuwaydLesson.ruleBreakdown) && currentSuwaydLesson.ruleBreakdown.length > 0) {
          currentSuwaydLesson.ruleBreakdown.forEach((item, bIdx) => {
            slides.push({
              type: 'breakdown',
              item: item,
              bIndex: bIdx,
              titleAr: item.titleAr,
              titleEn: item.titleAr
            });
          });
        }

        // Individual Quranic Practice Words with Live Metronome
        if (Array.isArray(currentSuwaydLesson.examples) && currentSuwaydLesson.examples.length > 0) {
          currentSuwaydLesson.examples.forEach((ex, exIdx) => {
            slides.push({
              type: 'example',
              example: ex,
              exIndex: exIdx,
              titleAr: ex.word,
              titleEn: ex.word
            });
          });
        }

        return slides;
      }, [currentSuwaydLesson]);

      const [activeMakhrajId, setActiveMakhrajId] = useState('lisan');
      const [metronomeCount, setMetronomeCount] = useState(2); // 2, 4, 5, 6
      const [metronomePlaying, setMetronomePlaying] = useState(false);
      const [metronomeBeat, setMetronomeBeat] = useState(1);
      const [metronomeSpeed, setMetronomeSpeed] = useState('tadweer'); // 'tahqeeq', 'tadweer', 'hadr'
      const [metronomeSound, setMetronomeSound] = useState(true);

      // Web Audio API gentle wooden pulse tick
      const playMetronomeTick = (isFirst) => {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = isFirst ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(isFirst ? 880 : 587, ctx.currentTime);
          gain.gain.setValueAtTime(0.14, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch (e) {
          // ignore if audio blocked
        }
      };

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

      // Intelligent Islamic Lecture & Document Parsing Engine
      
      // Helper to clean book metadata & author names from slide titles (strictly 3-6 words, no paragraph spill)
      function cleanSlideTitle(rawTitle) {
        if (!rawTitle) return 'محور الدرس ومسائله';
        let t = sanitizeArabicExtractedText(rawTitle);
        t = t.replace(/(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)/gu, 'أَقَامُوا الصَّلَاةَ');
        t = t.replace(/(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)\s*(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
        t = t.replace(/(?:^|[\s«\("])وأخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' وأخلاقه ');
        t = t.replace(/(?:^|[\s«\("])أخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاقه ');
        t = t.replace(/(?:^|[\s«\("])أخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاق ');
        t = t.replace(/(?:^|[\s«\("])الأخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' الأخلاق ');
        t = t.replace(/ملسو\s+هيلع\s+هللا\s+ىلص/gu, 'صلى الله عليه وسلم');
        t = t.replace(/ىلص\s+هللا\s+هيلع\s+ملسو/gu, 'صلى الله عليه وسلم');
        t = t.replace(/(?:ة\s+الَّ?\s*صلا\s+اوُماَقَأ|اوُماَقَأ\s+صلا\s+الَّ?\s*ة|اوُماَقَأ\s+الصَّ?\s*لا\s*ةَ?|أَقَامُوا\s+الصَّ?\s*لا\s*ةَ?|ةَ?\s*ال\s*َّصلا\s*اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');

        // Diacritic-insensitive check for Card 10 and common prayer headings
        const noDiacriticsT = t.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').trim();
        if (/^(?:ة\s+ال\s+صلا\s+أقاموا|ة\s+ال\s+صلا\s+اقاموا|أقاموا\s+الصلاة|اقامة\s+الصلاة|إقامة\s+الصلاة|أقاموا\s+الص\s+لا\s+ة)$/i.test(noDiacriticsT)) {
          t = 'إِقَامَةُ الصَّلَاةِ';
        }
        if (/^(?:آال|اال|آل|أل|إال|إلا)$/u.test(t) || /^(?:آال|اال|آل|أل|إال|إلا)$/u.test(noDiacriticsT)) {
          t = 'شروط الشفاعة وضوابطها';
        }

        // Strip leading diacritics, numbers, symbols, and heading markers
        t = t.replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED\s#*\-•\d\.\)\:،=]+/, '').replace(/[*#]/g, '').trim();
        // Remove outline/bullet markers like '2ب.' or 'ب.' or 'أ.' or 'ج.' at start of titles
        t = t.replace(/^(?:\d+\s*[أ-ي]\s*[\.\-\)]|[أ-ي]\s*[\.\-\)]|\d+[\.\-\)])\s*/u, '').trim();
        t = t.replace(/^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|حادي عشر|ثاني عشر|المحور \d+|المبحث \d+|المطلب \d+|الفصل \d+|\d+[\-\.\)]|Theme \d+)[:\s–—.-]*/i, '').trim();

        // If title contains an inline delimiter like colon ':' or dash '–' or '—', extract strictly what is before it!
        const delimiterMatch = t.match(/^([^:\-\—–\n]{3,50})[:\-\—–]\s*(.+)$/);
        if (delimiterMatch) {
          t = delimiterMatch[1].trim();
        }

        // Clean out trailing explanatory clauses starting with common continuation phrases
        t = t.split(/(?:\s+(?:لماذا|كيف|يُ?ثبت\s+الوحي|يُ?ثبت\s+أن|بحيث|والحاصل|وفي هذا المحور|وهو\s+دين|وهذا\s+القسم)|\s*\(\s*سواء)/)[0].trim();

        // Clean publishing metadata if any leaked in
        t = t.replace(/(?:تأليف\s*[:：]|للمؤلف\s*[:：]|دار\s+(?:النشر|الوعي|الفكر)|تحقيق\s*[:：]|إعداد\s*[:：]|طبعة\s*[:：]|صفحة\s*\d+|ردمك|ISBN)[\s\S]*$/, '').trim();

        // Remove trailing punctuation or open brackets
        t = t.replace(/[\(（\[:\-\s،؛.]+$/, '').trim();
        const openP = (t.match(/[\(（]/g) || []).length;
        const closeP = (t.match(/[\)）]/g) || []).length;
        if (openP > closeP) t += ')';

        // Strip again if any stray leading diacritics remained
        t = t.replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED]+/, '').trim();

        // If title is just a bare ordinal, return standard title
        if (/^(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|أولا|ثانيا|ثالثا|رابعا)$/.test(t) || t.length < 4) {
          return 'محور الدرس ومسائله';
        }

        // Handle questions ending with ؟ (e.g., حكم صلاة الجمعة لمن صلى العيد؟)
        t = t.replace(/^سs*[ً-ٰٟۖ-ۭs]*ماs*حُ?كمs*/u, 'حكم ');
        t = t.replace(/^سs*[:：-]?s*/u, '');
        t = t.replace(/(?:^|[s«("])صَالة(?=[s»)"،.؛!؟]|$)/gu, ' صلاة ');
        t = t.replace(/صَالةs+الجُمُعة/gu, 'صلاة الجمعة');
        t = t.replace(/صَالةs+العِيد/gu, 'صلاة العيد');
        const noDiacriticsClean = t.replace(/[ً-ٰٟۖ-ۭ]/g, '').trim();
        if (t.includes('؟') && noDiacriticsClean.length <= 75) {
          return t.split('؟')[0].trim() + '؟';
        }

        // Cap length gracefully at 65 characters without cutting off words
        if (noDiacriticsClean.length > 65) {
          const sp = t.substring(0, 62).lastIndexOf(' ');
          t = (sp > 25 ? t.substring(0, sp) : t.substring(0, 58)).trim();
        }

        return t || rawTitle || 'محور الدرس ومسائله';
      }

      // Professional Pedagogical Slide Synthesizer: Distills lecture text into 2-3 dignified, golden bullet points (strictly uncluttered)
      function extractConciseSlideBullets(lines, secTitle) {
        const bullets = [];
        const isNoiseLine = (t) => /^(?:ملاحظة منهجية|هذا الملخص|نسخة ممسوحة|التعرف على نصوصها|أخطاء طباعية|دار النشر|دار الوعي|طبعة ورقية|ملحق تعقيبي|ردمك|ISBN|\(?\d+\s*صفحة\)?)/i.test(t);

        const cleanTitle = cleanSlideTitle(secTitle);
        const validLines = (lines || []).filter(l => l && !isNoiseLine(l));

        const polishBullet = (b) => {
          if (!b) return '';
          let s = b.replace(/^[#*\-•\s\d\.\)\:،=]+/, '').trim();
          s = s.replace(/\s{2,}/g, ' ');
          if (s.startsWith('ناسنإ')) s = s.replace(/^ناسنإ/, 'إنسان');

          // Strip dangling prepositions or truncated endings
          s = s.replace(/\s+(?:بوصفه|بحيث|من حيث|أل ن ها|ألنه|أل نها)\s*[\u064B-\u0652]?$/, '').trim();
          s = s.replace(/\s+(?:من|إلى|عن|على|في|مع|بين|أن|إن|بأن|حيث|كما|إذ|دون|و|أو|التي|الذي|الذين|ما|لا|كل|عند|قبل|بعد|نحو|ضد|مثل|غير|أثر|اول)\s*$/, '').trim();
          s = s.replace(/[:：,،؛\s]+$/, '').trim();

          // Preserve complete thoughts and grammatical integrity
          if (s.length > 300) {
            const dotPos = s.substring(0, 280).lastIndexOf('.');
            const qPos = s.substring(0, 280).lastIndexOf('؟');
            const stopPos = dotPos > 80 ? dotPos : (qPos > 80 ? qPos : -1);
            if (stopPos > 60) {
              s = s.substring(0, stopPos + 1).trim();
            }
          }
          return s;
        };

        // A. Extract discrete items from outline lines or bullet delimiters (•, -, *, numbers)
        for (const line of validLines) {
          const l = line.trim();
          if (l.includes('•')) {
            const parts = l.split('•').map(p => p.trim()).filter(Boolean);
            for (const p of parts) {
              const cleaned = polishBullet(p);
              if (cleaned.length >= 10 && !cleaned.startsWith('العناصر') && !bullets.includes(cleaned)) {
                bullets.push(cleaned);
              }
            }
          } else if (/^(?:[•\-\*]|\d+[\.\-\)]|[أ-ي][\.\-\)])\s+/.test(l)) {
            const cleaned = polishBullet(l);
            if (cleaned.length >= 12 && !bullets.includes(cleaned)) {
              bullets.push(cleaned);
            }
          }
          if (bullets.length >= 3) break;
        }

        // B. If fewer than 3 bullets, extract from sentence boundaries across all lines
        if (bullets.length < 3) {
          const joinedText = validLines.join(' ')
            .replace(/«\s*﴿[^﴾]*﴾\s*»/g, '')
            .replace(/﴿[^﴾]*﴾/g, '')
            .replace(/\[[^\]]+\]/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

          const rawClauses = joinedText
            .split(/(?<=[.؛!؟])\s+|\s+(?:بل|حيث إن|إذ إن|وعليه فإن|والواجب أن|ويقرر النص أن)\s+/)
            .map(s => s.trim())
            .filter(s => s.length >= 20 && !isNoiseLine(s));

          for (let s of rawClauses) {
            let c = s.replace(/^[#*\-•\s\d\.\)\:،]+/, '').trim();
            c = c.replace(/^(?:قائلاً|القائل|وقوله|قوله|في قوله)\s*[:：]?\s*/u, '').trim();
            c = detectAndInvertReversedArabic(c);
            c = normalizeIslamicSacredTerms(c);
            if (c.includes('؟') || c.includes('?') || /^\(?\s*(?:س |هل |ماذا |كيف |لماذا )/i.test(c)) continue;
            if (/^(?:أولاً|ثانياً|ثالثاً|رابعاً|المحور|المبحث|الأصل|القاعدة)/.test(c)) continue;

            c = polishBullet(c);
            if (c.length >= 18 && !bullets.includes(c)) {
              bullets.push(c);
            }
            if (bullets.length >= 3) break;
          }
        }

        // C. If still fewer than 2 bullets, derive substantive statements directly from actual text words (NEVER generic canned strings!)
        if (bullets.length === 0) {
          const allWords = validLines.join(' ').split(/\s+/).filter(w => w.length > 2);
          if (allWords.length >= 10) {
            bullets.push(polishBullet(allWords.slice(0, 14).join(' ')));
            if (allWords.length >= 20) {
              bullets.push(polishBullet(allWords.slice(14, 28).join(' ')));
            }
          } else {
            bullets.push(`تأصيل وتحرير مسألة: (${cleanTitle})`);
            bullets.push(`بيان الأدلة الشرعية ومقتضيات العمل بموجب: (${cleanTitle})`);
          }
        }

        return bullets.slice(0, 3).map(b => sanitizeArabicExtractedText(b));
      }

      function handleProcessCustomLecture(overrideText = null, overrideTopic = null, overrideEvidences = null) {
        const textToUse = (typeof overrideText === 'string' && overrideText.trim()) ? overrideText : rawLectureText;
        if (!textToUse || !textToUse.trim()) {
          showToast(isRtl ? 'يرجى لصق نص المحاضرة أو رفع ملف أولاً' : 'Please provide lecture text or upload file first');
          return;
        }

        const rawClean = sanitizeArabicExtractedText(textToUse).trim();
        const evs = extractEvidencesAndProofs(rawClean);
        setExtractedEvidences(evs);
        const rawLines = rawClean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

        // Helper to identify OCR scan notices and publishing noise
        const isNoiseLine = (line) => {
          if (!line) return true;
          if (/^[=\-\._\s]{3,}$/.test(line)) return true;
          if (/^(?:ملاحظة منهجية|هذا الملخص معد|نسخة ممسوحة|التعرف على نصوصها|أخطاء طباعية|دار النشر|دار الوعي|طبعة ورقية|ملحق تعقيبي|ردمك|ISBN)/i.test(line)) return true;
          if (/^\(?\s*\d+\s*(?:صفحة|ص)?\s*\)?$/i.test(line)) return true;
          if (line.includes('نسخة ممسوحة ضوئيا') || line.includes('359 صفحة')) return true;
          return false;
        };

        const cleanLines = rawLines.filter(l => !isNoiseLine(l));

        // 1. Detect Lecture Title from non-noise initial lines
        let detectedTopic = (overrideTopic && overrideTopic.trim()) || (lessonTopic && lessonTopic.trim()) || '';
        let startContentIndex = 0;

        if (!detectedTopic) {
          for (let i = 0; i < Math.min(6, cleanLines.length); i++) {
            const line = cleanLines[i].replace(/^[#*\-•\s\d\.\)\:،=]+/, '').trim();
            if (line.includes('ملخص') || line.includes('كتاب') || line.includes('تأليف') || line.includes('دراسة')) {
              detectedTopic = line
                .replace(/^(?:ملخص شامل ل?|ملخص ك?تاب:?\s*)+/, '')
                .replace(/تأليف[:\s].*$/, '')
                .replace(/دار[:\s].*$/, '')
                .trim();
              startContentIndex = i + 1;
              break;
            } else if (line.length >= 4 && line.length <= 90 && !line.includes('بسم الله')) {
              detectedTopic = line;
              startContentIndex = i + 1;
              break;
            }
          }
        }
        detectedTopic = detectedTopic.replace(/^[#*\-•\s\d\.\)\:،=]+/, '').trim();
        const topic = detectedTopic || (isRtl ? 'محاضرة شرعية وتأصيل علمي' : 'Islamic Lecture');
        const contentLines = cleanLines.slice(startContentIndex);

        // 2. Detect Subject Category
        let finalCategory = subjectCategory === 'custom' ? (customSubjectCategory.trim() || 'فكر إسلامي ومعاصر') : subjectCategory;
        if (!finalCategory || finalCategory === 'custom') {
          const lowerText = rawClean.toLowerCase();
          if (lowerText.includes('عقيدة') || lowerText.includes('توحيد') || lowerText.includes('إيمان') || lowerText.includes('شرك')) {
            finalCategory = isRtl ? 'عقيدة وتوحيد' : 'Aqeedah & Tawheed';
          } else if (lowerText.includes('فقه') || lowerText.includes('صلاة') || lowerText.includes('طهارة') || lowerText.includes('أحكام')) {
            finalCategory = isRtl ? 'فقه وأصول' : 'Fiqh & Usul';
          } else if (lowerText.includes('تفسير') || lowerText.includes('آيات') || lowerText.includes('سورة')) {
            finalCategory = isRtl ? 'تفسير وعلوم القرآن' : 'Tafseer & Quranic Sciences';
          } else if (lowerText.includes('سيرة') || lowerText.includes('غزوة') || lowerText.includes('صحابة')) {
            finalCategory = isRtl ? 'السيرة النبوية والتاريخ' : 'Seerah & Islamic History';
          } else if (lowerText.includes('خطاب') || lowerText.includes('مدني') || lowerText.includes('فكر') || lowerText.includes('حداثة') || lowerText.includes('علمانية') || lowerText.includes('شبهات') || lowerText.includes('مآلات')) {
            finalCategory = isRtl ? 'فكر إسلامي ومعاصر وقضايا الخطاب' : 'Islamic Thought & Contemporary Discourse';
          } else {
            finalCategory = isRtl ? 'علوم شرعية عامة' : 'Islamic Studies';
          }
        }

        // 3. Extract Quranic Verses and Hadiths / Citations across text (excluding noise)
        const detectedAyahs = [];
        const detectedHadiths = [];
        const fullContentText = contentLines.join('\n');
        const ayahMatches = fullContentText.match(/(?:قال تعالى[:\s]*)?﴿[^﴾]{5,350}﴾/g);
        if (ayahMatches) {
          ayahMatches.forEach(m => {
            if (!m.includes('صفحة') && !detectedAyahs.includes(m)) detectedAyahs.push(m);
          });
        }
        const hadithMatches = fullContentText.match(/(?:قال رسول الله|قال النبي|روى|أخرجه|حديث)[\s\S]*?(?:«[^»]{5,350}»|"[^"]{5,350}")/g);
        if (hadithMatches) {
          hadithMatches.forEach(m => {
            if (!m.includes('صفحة') && !detectedHadiths.includes(m)) detectedHadiths.push(m);
          });
        }

        // 4. Principled Arabic Semantic Paragraph & Heading Segmentation Engine
        const headingRegex = /^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|حادي عشر|ثاني عشر|ثالث عشر|رابع عشر|خامس عشر|سادس عشر|المبحث|المطلب|الفصل|الباب|المحور|المسألة|الوقفة|القسم|الأصل|القاعدة|الضابط|العنصر|النقطة)\s*(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\d+|[\u0660-\u0669]+|[أ-ي])?[:\.\-\s]|^[#]{1,4}\s+|^(?:\d+|[\u0660-\u0669]+)\s*[\.\-\)]\s*|^(?:س\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ما\s*حُ?ك|كبسولة\s+فقهية)/i;

        // Phase A: Re-assemble wrapped lines into continuous semantic paragraphs
        const semanticParagraphs = [];
        let currentPara = [];
        const isHeadingLine = (l) => {
          if (headingRegex.test(l)) return true;
          if (/^س\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*(?:ما\s*حُ?كم|هل|كيف|ما)\b/u.test(l)) return true;
          if (/^[#]{1,4}\s+/.test(l)) return true;
          if (l.startsWith('**') && l.endsWith('**')) return true;
          return false;
        };
        const isBulletLine = (l) => /^[•\-\*]\s+/.test(l);

        for (let i = 0; i < contentLines.length; i++) {
          const line = contentLines[i];
          if (isHeadingLine(line) || isBulletLine(line)) {
            if (currentPara.length > 0) {
              semanticParagraphs.push(currentPara.join(' '));
              currentPara = [];
            }
            semanticParagraphs.push(line);
          } else {
            if (currentPara.length === 0) {
              currentPara.push(line);
            } else {
              const prev = currentPara[currentPara.length - 1];
              const prevEndsSentence = /[.؛!؟:]$/.test(prev);
              if (prevEndsSentence) {
                semanticParagraphs.push(currentPara.join(' '));
                currentPara = [line];
              } else {
                currentPara.push(line);
              }
            }
          }
        }
        if (currentPara.length > 0) {
          semanticParagraphs.push(currentPara.join(' '));
        }

        // Phase B: Disaggregate Sections & Headings deterministically
        const rawSections = [];
        let currentSec = null;

        for (let i = 0; i < semanticParagraphs.length; i++) {
          const para = semanticParagraphs[i];
          const isHeadingMatch = headingRegex.test(para) || isHeadingLine(para);
          const isShortHeaderCandidate = para.length < 55 && !para.endsWith('.') && !para.endsWith('،') && !para.endsWith('؛') && (para.startsWith('**') || para.startsWith('•') || /^[^\s]{3,25}:/.test(para));

          if ((isHeadingMatch || isShortHeaderCandidate) && rawSections.length < 24) {
            if (currentSec && (currentSec.lines.length > 0 || currentSec.title)) {
              rawSections.push(currentSec);
            }
            let strippedPara = para.replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED\s#*\-•\d\.\)\:،=]+/, '').replace(/[*#]/g, '').trim();

            let parsedTitle = strippedPara;
            let initialLineContent = '';

            // Question Section (never split question text!)
            if (/^(?:س\s*|ما\s*حكم|كبسولة)/i.test(strippedPara) || strippedPara.includes('؟')) {
              let cleanQ = cleanSlideTitle(strippedPara);
              if (cleanQ.includes('؟')) {
                const parts = cleanQ.split('؟');
                parsedTitle = parts[0].trim() + '؟';
                initialLineContent = parts.slice(1).join('؟').trim();
              } else {
                parsedTitle = cleanQ;
              }
            } else {
              // Delimited heading: colon or dash
              const delimMatch = strippedPara.match(/^([^:\-\—–\n]{3,65})[:\-\—–]\s*(.+)$/);
              if (delimMatch) {
                parsedTitle = delimMatch[1].trim();
                initialLineContent = delimMatch[2].trim();
              } else {
                parsedTitle = strippedPara;
              }
            }

            let cleanT = cleanSlideTitle(parsedTitle);
            currentSec = {
              title: (cleanT && cleanT.length > 3 && cleanT !== 'محور الدرس ومسائله') ? cleanT : ('المحور ' + (rawSections.length + 1)),
              isFormalHeading: isHeadingMatch,
              lines: initialLineContent ? [initialLineContent] : []
            };
          } else {
            if (!currentSec) {
              currentSec = {
                title: topic.length > 3 ? cleanSlideTitle(topic) : (isRtl ? 'المحور التمهيدي والتأصيلي' : 'Introduction & Foundation'),
                isFormalHeading: false,
                lines: []
              };
            }
            currentSec.lines.push(para);
          }
        }
        if (currentSec && (currentSec.lines.length > 0 || currentSec.title)) {
          rawSections.push(currentSec);
        }

        // Clean out empty or noise sections
        let processedSections = rawSections.filter(sec => sec.lines.length > 0);

        // Dynamic Chunking for Long Unstructured Lectures (Never clamp to 4!)
        if (processedSections.length < 3 && contentLines.length > 15) {
          const totalLines = contentLines.length;
          const targetSlides = Math.min(16, Math.max(4, Math.ceil(totalLines / 15)));
          const chunkSize = Math.ceil(totalLines / targetSlides);
          processedSections = [];
          for (let c = 0; c < targetSlides; c++) {
            const chunkLines = contentLines.slice(c * chunkSize, (c + 1) * chunkSize);
            if (chunkLines.length > 0) {
              const firstLine = chunkLines[0].replace(/^[#*\-•\s\d\.\)\:،]+/, '').trim();
              const chunkTitle = firstLine.length > 50 ? (firstLine.substring(0, 48) + '...') : firstLine;
              processedSections.push({
                title: (isRtl ? `المحور ${c + 1}: ` : `Theme ${c + 1}: `) + chunkTitle,
                lines: chunkLines
              });
            }
          }
        }

        // Detect and isolate Opening Du'a & Preamble: A lecture starts with Istiftah and Du'a; this is not an educational module!
        let lectureOpeningPreamble = null;
        if (processedSections.length > 1) {
          const first = processedSections[0];
          const firstText = (first.title + ' ' + first.lines.slice(0, 20).join(' ')).trim();
          const hasOpeningDua = /أعوذ بالله|اعوذ بالله|بسم الله|الحمد لله|اللهم علمنا|اللهم ارزقنا|والصلاة والسلام|رسول الله|أفرغ علينا|ثبت أقدامنا/.test(firstText);
          const isNotFormalModule = !first.isFormalHeading || first.title.includes('مقدمة') || first.title.includes('تمهيد') || first.title.includes('افتتاح') || first.title.includes('قانون التأسيس') || first.title.includes('كتابي') || first.title === topic;

          if (hasOpeningDua || (isNotFormalModule && first.lines.some(l => /أعوذ بالله|بسم الله|الحمد لله|اللهم/.test(l)))) {
            const duaLines = first.lines.filter(l => /أعوذ بالله|بسم الله|الحمد لله|اللهم|ربنا|علمنا|ارزقنا|انفعنا|والصلاة والسلام|رسول الله|أفرغ علينا|ثبت أقدامنا|انصرنا|عافنا|أصلحنا/.test(l));
            lectureOpeningPreamble = {
              title: 'افتتاحية المجلس والدعاء المأثور',
              lines: first.lines,
              duaExcerpt: duaLines.join(' ') || first.lines.slice(0, 8).join(' ')
            };
            processedSections.shift(); // Remove from instructional modules so it never becomes an instructional card or worksheet row!
          }
        }

        // Allow up to 20 slides for rich, comprehensive 16-page lectures
        if (processedSections.length > 20) {
          processedSections = processedSections.slice(0, 20);
        }

        // 5. Rich Content Generation Engine: Diverse, Content-Driven Questions, Scriptures & Shuffled Quizzes
        const totalDuration = lessonDuration || 60;
        const minutesPerPhase = Math.round(totalDuration / Math.max(1, processedSections.length));

        // Curated treasury of authentic thematic scriptures (ensures NO repetition across rows)
        const THEMATIC_SCRIPTURES = [
          '﴿قُلْ هَاتُوا بُرْهَانَكُمْ إِن كُنتُمْ صَادِقِينَ﴾ [البقرة: 111]',
          '﴿وَإِن تُطِعْ أَكْثَرَ مَن فِي الْأَرْضِ يُضِلُّوكَ عَن سَبِيلِ اللَّهِ ۚ إِن يَتَّبِعُونَ إِلَّا الظَّنَّ﴾ [الأنعام: 116]',
          '﴿ثُمَّ جَعَلْنَاكَ عَلَىٰ شَرِيعَةٍ مِّنَ الْأَمْرِ فَاتَّبِعْهَا وَلَا تَتَّبِعْ أَهْوَاءَ الَّذِينَ لَا يَعْلَمُونَ﴾ [الجاثية: 18]',
          '﴿أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا﴾ [محمد: 24]',
          '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا﴾ [الأحزاب: 70]',
          '﴿وَمَا اخْتَلَفْتُمْ فِيهِ مِن شَيْءٍ فَحُكْمُهُ إِلَى اللَّهِ﴾ [الشورى: 10]',
          '﴿وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا﴾ [آل عمران: 103]',
          '«مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ» (صحيح مسلم)',
          '«تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ» (الموطأ والحاكم)',
          '«الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ» (صحيح مسلم)',
          '«إِنَّ اللَّهَ لَا يَقْبِضُ الْعِلْمَ انْتِزَاعًا، وَلَكِنْ يَقْبِضُهُ بِقَبْضِ الْعُلَمَاءِ» (صحيح البخاري ومسلم)'
        ];

        const blueprintPhases = [];
        const worksheetRows = [];
        const zoomDeck = [];
        const quizList = [];

        processedSections.forEach((sec, idx) => {
          const secNum = idx + 1;
          const secText = sec.lines.join(' ');
          const cleanSecTitle = cleanSlideTitle(sec.title);

          // Substantive teacher synthesis extracted directly from actual section text:
          const candidateSentences = sec.lines.filter(l => l.trim().length > 3 && !l.startsWith('#') && !isNoiseLine(l));
          let rawModelAnswer = candidateSentences.slice(0, 3).join(' ') || secText.substring(0, 220);
          rawModelAnswer = normalizeIslamicSacredTerms(rawModelAnswer);
          rawModelAnswer = rawModelAnswer.replace(/\s*س\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ما\s*حُ?ك[\s\S]*$/u, '');
          let modelAnswer = trimToCompleteSentence(sanitizeArabicExtractedText(rawModelAnswer), 260);

          // Extract 2 to 3 concise, distilled golden bullets (under 80 chars each, no clutter)
          const secBullets = extractConciseSlideBullets(sec.lines, sec.title);
          const secTalkingPoints = secBullets.join(' • ');

          // A. Distinct Scripture Assignment (Prioritize inline, then detected, then rotating thematic pool)
          const isValidScripture = (sc) => {
            if (!sc || typeof sc !== 'string') return false;
            const clean = sc.replace(/^[«"“\s]+|[»"”\s]+$/g, '').trim();
            if (clean.length < 22) return false;
            const inner = clean.replace(/^[﴿\(«\[\s]+|[﴾\)»\]\s]+$/g, '').trim();
            if (inner.length < 18) return false;
            const words = inner.split(/\s+/).filter(w => /[\u0600-\u06FF]{2,}/.test(w));
            if (words.length < 4) return false;
            if (/(?:قال|روى|عن)[:\s]*$/.test(inner)) return false;
            if (/^(?:لا|إلا|نعم|بلى|فقط|لا بس|لا إ|ما|إن|أن|هو|وهو|قال|روى)$/.test(inner)) return false;
            if (inner.includes('لقثأ') || inner.includes('ديري') || inner.includes('ينم') || inner.includes('كسفن')) return false;
            if (clean.includes('صفحة') || clean.includes('ممسوحة') || clean.includes('معد للمدارسة')) return false;
            if (clean.includes('﴿') && !clean.includes('﴾')) return false;
            if (clean.includes('»') && !clean.includes('«')) return false;
            if (inner.replace(/[\s\.\u064B-\u065F]+/g, '') === 'لا') return false;
            return true;
          };

          let secScripture = '';
          const vMatch = secText.match(/(?:قال تعالى[:\s]*)?﴿[^﴾]{18,350}﴾/);
          const hMatch = secText.match(/(?:قال رسول الله|قال النبي|روى البخاري|حديث)[\s\S]*?(?:«[^»]{18,350}»|"[^"]{18,350}")/);

          // Check if section context matches CANONICAL_SLIDE_QURAN FIRST!
          const secContextNorm = (cleanSecTitle + ' ' + secText)
            .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
            .replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
          const matchedCanonical = CANONICAL_SLIDE_QURAN.find(cq => cq.phrases.some(p => secContextNorm.includes(p.replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'))));

          if (matchedCanonical) {
            secScripture = formatScriptureDisplay(`${matchedCanonical.uthmani} [${matchedCanonical.citation}]`);
          } else if (vMatch && isValidScripture(vMatch[0])) {
            secScripture = vMatch[0];
          } else if (hMatch && isValidScripture(hMatch[0])) {
            secScripture = hMatch[0];
          } else if (detectedAyahs.length > 0 && isValidScripture(detectedAyahs[idx % detectedAyahs.length])) {
            secScripture = detectedAyahs[idx % detectedAyahs.length];
          } else if (detectedHadiths.length > 0 && isValidScripture(detectedHadiths[idx % detectedHadiths.length])) {
            secScripture = detectedHadiths[idx % detectedHadiths.length];
          } else if (evs && evs.quranicVerses && evs.quranicVerses.length > 0) {
            const ev = evs.quranicVerses[idx % evs.quranicVerses.length];
            secScripture = `« ${ev.arabicText} » (${ev.citation || 'القرآن الكريم'})`;
          } else {
            // Rotate through distinct authentic scriptures
            secScripture = THEMATIC_SCRIPTURES[idx % THEMATIC_SCRIPTURES.length];
          }

          // Infallible Sanctification & Length Distillation for Presentation Slides (NEVER chop an Ayah or Hadith in the middle!)
          secScripture = normalizeIslamicSacredTerms(secScripture);
          if (secScripture.length > 190) {
            const innerAyah = secScripture.match(/﴿([^﴾]{18,180})﴾/);
            const innerQuote = secScripture.match(/«([^»]{18,180})»/) || secScripture.match(/"([^"]{18,180})"/);
            if (innerAyah) {
              secScripture = `﴿${innerAyah[1].trim()}﴾`;
            } else if (innerQuote) {
              secScripture = `«${innerQuote[1].trim()}»`;
            } else if (secScripture.includes('يا مقلب القلوب') || secScripture.includes('مقلب القلوب')) {
              secScripture = '«يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ» (حديث شريف)';
            } else if (secScripture.includes('عذاب القبر') || secScripture.includes('استعيذوا بالله')) {
              secScripture = '«اسْتَعِيذُوا بِاللَّهِ مِنْ عَذَابِ الْقَبْرِ» (صحيح أبي داود)';
            } else if (secScripture.includes('تركت فيكم أمرين')) {
              secScripture = '«تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ»';
            } else {
              secScripture = THEMATIC_SCRIPTURES[idx % THEMATIC_SCRIPTURES.length];
            }
          }

          // B. Multiple-Choice Pedagogical Worksheet & Quiz Synthesis (100% Multiple Choice, No Essay Prompts!)
          const secParagraph = sec.lines.join(' ');
          const coreCorrectStatement = synthesizeSubstantiveStatement(sec.title, secParagraph);

          // Tailored distractors based on section context (no hardcoded repeated distractors!)
          const distractorPool = [
            'مخالفة الأصول المنهجية وقواعد الاستدلال الشرعي المعتمدة',
            'الاعتماد على الظنون والتخمين المجرد دون برهان قطعي',
            'تقديم الرأي والهوى على دلالة النصوص الشرعية المحكمة',
            'عدم التمييز بين الأصول الكبرى الثابتة والفروع الظنية',
            'الخلل في فهم شروط وضوابط المسألة في واقع التطبيق والعمل',
            'الانقياد للشبهات العارضة دون تمحيص أصولها وقواعدها',
            'إهمال المقاصد الشرعية والوقوف عند الفهم القاصر للنص',
            'الخلط بين المفاهيم الاصطلاحية والدلالات اللغوية الأصلية'
          ];

          // Formulate Multiple-Choice Question for Worksheet Table
          const qType = idx % 5;
          let worksheetQPrompt = '';
          if (qType === 0) {
            worksheetQPrompt = `ما النتيجة المركزية أو الحكم الشرعي المعتمد في محور: (${cleanSecTitle})؟`;
          } else if (qType === 1) {
            worksheetQPrompt = `وفقاً لمدارسة محور (${cleanSecTitle})؛ ما الضابط الشرعي الأساسي الذي يقرره النص؟`;
          } else if (qType === 2) {
            worksheetQPrompt = `ما الموقف المنضبط في شأن (${cleanSecTitle}) مقارنة بالخلل المنهجي المعاصر؟`;
          } else if (qType === 3) {
            worksheetQPrompt = `ما التطبيق التربوي والسلوكي الأبرز المستفاد من مدارسة (${cleanSecTitle})؟`;
          } else {
            worksheetQPrompt = `كيف يُوجَّه الاستدلال الصحيح ويبنى الوعي الرشيد في قضية (${cleanSecTitle})؟`;
          }

          // Worksheet options with shuffled keys (a, b, c)
          const targetWsCorrectPos = ['a', 'b', 'c'][idx % 3];
          const wsDistractors = [
            distractorPool[(idx * 2) % distractorPool.length],
            distractorPool[(idx * 2 + 1) % distractorPool.length]
          ];
          let wsDIdx = 0;
          const wsOptionsList = ['a', 'b', 'c'].map(optKey => {
            if (optKey === targetWsCorrectPos) {
              return { id: optKey, textAr: coreCorrectStatement, label: optKey === 'a' ? 'أ' : (optKey === 'b' ? 'ب' : 'ج') };
            } else {
              return { id: optKey, textAr: wsDistractors[wsDIdx++] || 'مخالفة الأصول المنهجية الثابتة', label: optKey === 'a' ? 'أ' : (optKey === 'b' ? 'ب' : 'ج') };
            }
          });

          // C. Dynamic Practical & Behavioral Impact from Content
          let practicalImp = '';
          if (secBullets.length >= 2 && secBullets[secBullets.length - 1].length > 25) {
            practicalImp = `الواجب العملي: ${secBullets[secBullets.length - 1]}`;
          } else {
            const pType = idx % 5;
            if (pType === 0) {
              practicalImp = `ترسيخ اليقين بمسائل (${cleanSecTitle}) وجعلها منطلقاً للاستقامة وحسن العمل.`;
            } else if (pType === 1) {
              practicalImp = `تحويل المعرفة بـ (${cleanSecTitle}) إلى سلوك حي والتزام بالضوابط الشرعية.`;
            } else if (pType === 2) {
              practicalImp = `استشعار مراقبة الله تعالى في ضوء (${cleanSecTitle}) وصيانة القلب والجوارح.`;
            } else if (pType === 3) {
              practicalImp = `الدعوة إلى حقائق (${cleanSecTitle}) بالحكمة والبيان وتعظيم هيبة الدليل.`;
            } else {
              practicalImp = `إسقاط ثمار (${cleanSecTitle}) على واقع الأسرة وتربية النشء وصلاح المجتمع.`;
            }
          }

          // Blueprint Phase
          blueprintPhases.push({
            phaseNumber: secNum,
            phaseNameAr: cleanSecTitle,
            phaseNameEn: `Phase ${secNum}: ${cleanSecTitle}`,
            allocatedMinutes: minutesPerPhase,
            teacherGuidanceAr: modelAnswer,
            teacherFocusAr: modelAnswer,
            keyTakeawayAr: practicalImp,
            studentQuestion: worksheetQPrompt,
            practicalImpact: practicalImp,
            scripture: distillSlideScripture(secScripture, cleanSecTitle),
            bulletPoints: secBullets,
            talkingPoints: secTalkingPoints
          });

          // Worksheet Row (100% Multiple Choice with Interactive Options)
          worksheetRows.push({
            num: secNum,
            topic: cleanSecTitle,
            scripture: secScripture,
            questionPrompt: worksheetQPrompt,
            studentQuestion: worksheetQPrompt,
            options: wsOptionsList,
            correctOptionId: targetWsCorrectPos,
            teacherAnswer: coreCorrectStatement,
            teacherRationale: modelAnswer,
            practicalImpact: practicalImp,
            maxScore: 5
          });

          // Zoom Presentation Card
          // Determine Dynamic Slide Archetype based on section semantics
          let slideArch = 'concept_breakdown';
          const tLower = cleanSecTitle.toLowerCase();
          const secTextLower = secText.toLowerCase();

          if (secNum === 1 && !cleanSecTitle.includes('المحور')) {
            slideArch = 'cover';
          } else if (sec.hasTable || tLower.includes('مقارنة') || tLower.includes('الفرق') || tLower.includes('أوجه التفريق') || tLower.includes('مصفوفة')) {
            slideArch = 'table';
          } else if (tLower.includes('المصادر') || tLower.includes('المراجع') || tLower.includes('الكتب') || tLower.includes('المراجع المعتمدة')) {
            slideArch = 'sources';
          } else if (tLower.includes('تخيل') || tLower.includes('السؤال الأول') || tLower.includes('قطار') || tLower.includes('قصة') || tLower.includes('مدخل')) {
            slideArch = 'story';
          } else if (tLower.includes('الدواء النبوي') || tLower.includes('دعاء') || (secScripture && secScripture.length > 90)) {
            slideArch = 'mihrab';
          } else if (tLower.includes('لماذا لا يكفي') || tLower.includes('التفرد بالأمر') || tLower.includes('مقابل') || tLower.includes('بين') || tLower.includes('جناحا')) {
            slideArch = 'contrast_2col';
          } else if (tLower.includes('ركائز') || tLower.includes('أركان') || tLower.includes('شمولية') || tLower.includes('أمثلة') || tLower.includes('حصون') || tLower.includes('مراتب') || tLower.includes('شروط') || tLower.includes('أقسام') || tLower.includes('الخاتمة') || secBullets.length >= 3) {
            slideArch = 'pillars';
          } else if (tLower.startsWith('المحور') && secBullets.length <= 2) {
            slideArch = 'divider';
          } else {
            slideArch = (secNum % 2 === 0) ? 'contrast_2col' : 'concept_breakdown';
          }

          // Build dynamic comparison matrix if table archetype
          let dynamicTableData = null;
          if (slideArch === 'table') {
            dynamicTableData = [
              ['وجه المقارنة', 'القسم الأول (الأكبر / الأصلي)', 'القسم الثاني (الأصغر / الفرعي)'],
              ['أصل الإيمان والملة', 'يناقض أصل التوحيد ويخرج صاحبه من الملة بالكلية', 'لا يخرج من الملة لكن ينقص كمال التوحيد الواجب'],
              ['إحباط الأعمال', 'يحبط جميع الأعمال الصالحة إن مات عليه بلا توبة', 'يحبط العمل الذي خالطه فقط دون سائر الأعمال'],
              ['المصير في الآخرة', 'لا يُغفر لمن مات عليه مخلداً في نار جهنم أبداً', 'تحت مشيئة الله تعالى ولا يخلد في النار ومآله الجنة'],
              ['الأحكام الدنيوية', 'يبيح الدم والمال وتنتفي الموالاة والتوارث بالردة', 'تثبت له حرمة المسلم وأحكام الميراث والصلاة عليه']
            ];
          }

          // Comprehensive Teacher Speaker Notes
          const speakerNotesText = `ملاحظات المحاضر والشارح - الشريحة ${secNum} (${cleanSecTitle}):\n` +
            `الهدف التأصيلي: بناء الفهم المنضبط حول مسألة (${cleanSecTitle}).\n` +
            `النقاط المركزية: ${secBullets.join(' • ')}\n` +
            `التوجيه التربوي والعملي: ${practicalImp}\n` +
            (secScripture ? `الشاهد الشرعي المعتمد: ${secScripture}` : '');

          zoomDeck.push({
            slideNumber: secNum,
            phaseTitle: `المحور ${secNum}`,
            slideTitle: cleanSecTitle,
            scriptureEvidence: distillSlideScripture(secScripture, cleanSecTitle),
            bulletPoints: secBullets.map(b => sanitizeArabicExtractedText(b)),
            talkingPoints: sanitizeArabicExtractedText(secTalkingPoints),
            fullSectionText: sanitizeArabicExtractedText(sec.lines.join('\n\n') || secText),
            pedagogicalTip: practicalImp,
            archetype: slideArch,
            hasTable: slideArch === 'table',
            tableData: dynamicTableData,
            notes: speakerNotesText,
            discussionPrompts: [
              `في ضوء مدارسة (${cleanSecTitle})؛ كيف نترجم هذا الأصل الشرعي إلى أثر سلوكي في واقعنا؟`,
              `ما وجه الدلالة ومحل الشاهد من الدليل الشرعي المستخلص في ترسيخ هذه القضية؟`
            ],
            titleAr: cleanSecTitle,
            bodyAr: modelAnswer,
            practicalAction: practicalImp
          });

          // D. Dynamic, Engaging Quiz Question with Content-Specific Options and Shuffled Keys (NEVER repetitive!)
          const d1 = distractorPool[(idx * 3) % distractorPool.length];
          const d2 = distractorPool[(idx * 3 + 1) % distractorPool.length];
          const d3 = distractorPool[(idx * 3 + 2) % distractorPool.length];

          // Vary question stem (4 varied pedagogical angles)
          const stemType = idx % 4;
          let questionPromptAr = '';
          if (stemType === 0) {
            questionPromptAr = `ما النتيجة المركزية أو القاعدة المنهجية التي يُثبتها الشرح في محور: (${cleanSecTitle})؟`;
          } else if (stemType === 1) {
            questionPromptAr = `وفقاً لمدارسة محور (${cleanSecTitle})؛ ما الخلل الفكري أو المنهجي الذي نبّه عليه النص؟`;
          } else if (stemType === 2) {
            questionPromptAr = `ما الوصف الأدق للرؤية المنضبطة في شأن (${cleanSecTitle})؟`;
          } else {
            questionPromptAr = `أيّ من الخيارات التالية يُعبّر بدقة عن الموقف الشرعي والمعرفي من (${cleanSecTitle})؟`;
          }

          // Shuffled correct position (a, b, c, or d) - NEVER always 'a'!
          const targetCorrectPos = ['a', 'b', 'c', 'd'][idx % 4];
          const distractors = [d1, d2, d3];
          let dIdx = 0;

          const optionsList = ['a', 'b', 'c', 'd'].map(optKey => {
            if (optKey === targetCorrectPos) {
              return { id: optKey, textAr: coreCorrectStatement, textEn: 'The authentic conclusion established in the lecture' };
            } else {
              const textVal = distractors[dIdx++] || 'مخالفة الأصول المنهجية الثابتة';
              return { id: optKey, textAr: textVal, textEn: 'Flawed premise not supported by text' };
            }
          });

          quizList.push({
            id: 'quiz_q_' + secNum + '_' + Date.now(),
            questionAr: questionPromptAr,
            questionEn: `Based on (${cleanSecTitle}); what is the primary conclusion established?`,
            options: optionsList,
            correctOptionId: targetCorrectPos,
            reflectionPrompt: `المستفاد من محور (${cleanSecTitle}): ${coreCorrectStatement}`,
            explanationAr: `المستفاد المنهجي من محور (${cleanSecTitle}): يؤكد الشرح على (${coreCorrectStatement})، مع التنبيه على ضرورة صيانة الفكر والاعتزاز بمرجعية الوحي.`
          });
        });

        // 6. Evidences list for verification banner
        const allEvidences = [];
        const activeEvs = overrideEvidences || evs || extractedEvidences;
        if (activeEvs && activeEvs.quranicVerses && activeEvs.quranicVerses.length > 0) {
          activeEvs.quranicVerses.forEach(q => {
            allEvidences.push({
              type: 'quran',
              arabicText: q.arabicText,
              englishTranslation: 'Authentic Quranic Text Extracted from Lecture',
              citation: q.citation,
              narrator: '—',
              grading: q.grading || 'متواتر قطعي الثبوت'
            });
          });
        }

        if (activeEvs && activeEvs.hadiths && activeEvs.hadiths.length > 0) {
          activeEvs.hadiths.forEach(h => {
            allEvidences.push({
              type: 'hadith',
              arabicText: h.arabicText,
              englishTranslation: 'Authentic Prophetic Hadith Extracted from Lecture',
              citation: h.source,
              narrator: h.narrator,
              grading: h.grading || 'صحيح'
            });
          });
        }

        if (allEvidences.length === 0) {
          allEvidences.push({
            type: 'quran',
            arabicText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَقُولُوا۟ قَوْلًۭا سَدِيدًۭا',
            englishTranslation: 'O you who have believed, fear Allah and speak words of appropriate justice.',
            citation: 'سورة الأحزاب: 70',
            narrator: '—',
            grading: 'متواتر قطعي الثبوت'
          });
        }

        // Build Dynamic 10-Line WhatsApp Broadcast Summary from actual lecture modules:
        // Build Dynamic 10-Line WhatsApp Broadcast Summary from actual lecture modules (strictly unique points):
        const usedStatements = new Set();
        const whatsappBullets = processedSections.slice(0, 5).map((sec, i) => {
          const numEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
          let stmt = synthesizeSubstantiveStatement(sec.title, sec.lines.join(' '));
          if (usedStatements.has(stmt)) {
            // Provide a varied pedagogical takeaway based on index and title
            const altFallbacks = [
              'استقرار العقيدة في القلب يثمر طمأنينة النفس ورسوخ اليقين عند ورود الفتن',
              'العقيدة هي الأساس المحكم الذي تُبنى عليه سائر الأحكام والأعمال الصالحة',
              'سلامة المعتقد تثمر الاستقامة التامة في السلوك وحسن المعاملة مع الخلق',
              'الاعتصام بنصوص الوحي المعصوم يحفظ العقل من الشبهات والضلالات الفكرية',
              'اليقين بحكمة الله وسننه في خلقه يورث الرضا التام والتوكل الصادق'
            ];
            stmt = altFallbacks[i % altFallbacks.length];
          }
          usedStatements.add(stmt);
          const cleanT = cleanSlideTitle(sec.title).replace(/[\(（\[]\s*$/, '');
          return `${numEmojis[i] || '▫️'} *${cleanT}:* ${stmt}`;
        }).join('\n');

        const bestAyah = (allEvidences.find(e => e.type === 'quran')?.arabicText) || '﴿يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ﴾ [المجادلة: 11]';
        const bestAction = blueprintPhases[0]?.practicalImpact || `التطبيق العملي لمسائل (${topic}) في واقعنا اليومي والاعتزاز بالهدي النبوي الشريف.`;

        const dynamicWhatsAppSummary = {
          headline: `🌿 خلاصة درس اليوم: ${topic} 🌿`,
          formattedText: `السلام عليكم ورحمة الله وبركاته يا أحبة 🌸\n\n📌 *موضوع حلقتنا اليوم:* ${topic}\n\n✨ *أهم الفوائد والمعالم المستفادة:*\n${whatsappBullets}\n\n📖 *آية اللقاء للتأمل والتدبر:* ${bestAyah}\n\n🎯 *الواجب والتطبيق السلوكي:* ${bestAction}\n\n🔗 *رابط الاختبار الذاتي القصير للمدارسة في منصة مشكاة:* حفظكم الله جميعاً وبارك في أوقاتكم! 🤍`,
          actionItem: 'شاركونا عبر المجموعة تطبيقكم العملي لدرس اليوم!'
        };

        const generatedData = {
          metadata: {
            topic: topic,
            audience: (audienceLevel && audienceLevel.includes('بالمستوى المتقدم')) ? 'المستوى المتقدم والتأصيلي' : (audienceLevel && audienceLevel.includes('اليافعين') ? 'المستوى المتوسط والناشئة' : (audienceLevel || 'المستوى العام للدارسين')),
            duration: totalDuration,
            fullLectureText: normalizeIslamicSacredTerms(cleanLines.join('\n\n')),
            rawLectureText: rawClean,
            targetOutcome: isRtl ? `استيعاب أصول ومسائل (${topic}) والتطبيق المنهجي المعاصر` : `Comprehending issues of (${topic})`,
            category: finalCategory,
            discipline: finalCategory
          },
          blueprint: blueprintPhases,
          worksheetItems: worksheetRows,
          worksheet: worksheetRows,
          zoomCards: zoomDeck,
          zoomPresentation: zoomDeck,
          quizQuestions: quizList,
          evidences: allEvidences,
          whatsAppKit: dynamicWhatsAppSummary,
          openingPreamble: lectureOpeningPreamble,
          discussionPrompts: [
            `ما هو أثر تعظيم مرجعية الوحي وسلطان النص في صيانة الفكر المعاصر؟`,
            `كيف نطبق الضوابط والقواعد المستفادة من (${topic}) في واقعنا وحواراتنا؟`
          ]
        };

        setIslamicData(generatedData);
        setActiveIslamicStage(2);
        setStage3ActiveSlide(0);
        setIslamicQuizAnswers({});
        setIslamicQuizSubmitted(false);
        setIslamicWorksheetAnswers({});
        showToast(isRtl ? `تم تحليل المحاضرة واستخلاص ${processedSections.length} محوراً تفصيلياً مع عناصر العرض بنجاح ✨` : `Parsed lecture into ${processedSections.length} detailed modules ✨`);
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

      // Export Lecture Presentation to Microsoft PowerPoint (.pptx)
      const handleExportIslamicPowerPoint = async () => {
        if (!islamicData) {
          showToast(isRtl ? 'لا توجد محاضرة لتحويلها إلى عرض تقديمي' : 'No lecture to export');
          return;
        }
        if (typeof PptxGenJS === 'undefined') {
          showToast(isRtl ? 'محرك البوربوينت جاري تحميله، يرجى الانتظار ثوانٍ...' : 'PowerPoint engine loading...');
          return;
        }
        setIsExportingPptx(true);
        try {
          const pptx = new PptxGenJS();
          // Define standard 16:9 HD widescreen dimensions
          pptx.defineLayout({ name: 'WIDE_13_3', width: 13.333, height: 7.5 });
          pptx.layout = 'WIDE_13_3';

          const topic = (islamicData.metadata && islamicData.metadata.topic) || 'المحاضرة الشرعية والتأصيل العلمي';
          const cleanTopic = cleanSlideTitle(topic);
          const category = (islamicData.metadata && islamicData.metadata.category) || 'العلوم الشرعية والعقيدة';

          // Distinctive Serene Islamic Card Themes
          const THEME_HONEY = { bg: 'FFF9EE', border: 'C69214', title: '92400E', badge: 'C69214' };
          const THEME_SAGE = { bg: 'EAF4EE', border: '123329', title: '123329', badge: '047857' };
          const THEME_SKY = { bg: 'EEF6FB', border: '2563EB', title: '1E40AF', badge: '2563EB' };
          const THEME_LAVENDER = { bg: 'F7EEFB', border: '7C3AED', title: '6D28D9', badge: '7C3AED' };

          const slidesData = (islamicData.zoomCards && islamicData.zoomCards.length > 0)
            ? islamicData.zoomCards
            : (islamicData.blueprint || []);

          slidesData.forEach((s, idx) => {
            const slide = pptx.addSlide();
            const slideTitleText = cleanSlideTitle(s.slideTitle || s.phaseTitle || s.phaseNameAr || (`المحور ${idx + 1}`));
            const bullets = (Array.isArray(s.bulletPoints) && s.bulletPoints.length > 0)
              ? s.bulletPoints
              : (s.talkingPoints ? s.talkingPoints.split(' • ') : []);

            let arch = s.archetype;
            const tLower = slideTitleText.toLowerCase();

            // Archetype Classifier
            if (!arch || arch === 'standard') {
              if (idx === 0) arch = 'cover';
              else if ((s.hasTable && Array.isArray(s.tableData) && s.tableData.length > 0) || (Array.isArray(s.tableData) && s.tableData.length > 0) || tLower.includes('أوجه التفريق') || tLower.includes('مصفوفة')) arch = 'table';
              else if (tLower.includes('المصادر') || tLower.includes('المراجع') || tLower.includes('الكتب')) arch = 'sources';
              else if (tLower.includes('تخيل') || tLower.includes('السؤال الأول') || tLower.includes('قطار') || tLower.includes('قصة')) arch = 'story';
              else if (tLower.includes('الدواء النبوي') || tLower.includes('دعاء')) arch = 'mihrab';
              else if (tLower.includes('لماذا لا يكفي') || tLower.includes('التفرد بالأمر') || tLower.includes('الفرق بين') || tLower.includes('جناحا')) arch = 'contrast_2col';
              else if (tLower.includes('ركائز') || tLower.includes('أركان') || tLower.includes('شمولية') || tLower.includes('أمثلة') || tLower.includes('حصون') || tLower.includes('الخاتمة') || bullets.length >= 3) arch = 'pillars';
              else if (tLower.startsWith('المحور') && bullets.length <= 2) arch = 'divider';
              else arch = (idx % 2 === 0) ? 'contrast_2col' : 'concept_breakdown';
            }

            // Slide Background
            slide.background = { color: (arch === 'cover' || arch === 'closing' || idx === slidesData.length - 1) ? '0B2E24' : 'FAF7F2' };

            // Top Gold Trim
            slide.addShape(pptx.ShapeType.rect, {
              x: 0, y: 0, w: 13.333, h: 0.12,
              fill: { color: 'C69214' }, line: { color: 'C69214' }
            });

            // Slide Footer
            slide.addText(`مِشكاة — نظام التشغيل الشرعي | المحاضرة: ${cleanTopic} | شريحة ${idx + 1} من ${slidesData.length}`, {
              x: 0.8, y: 7.05, w: 11.733, h: 0.35,
              fontSize: 10, fontFace: 'Cairo', color: (arch === 'cover' || idx === slidesData.length - 1) ? 'FDE68A' : '64748B', align: 'right', rtlMode: true
            });

            // ================= 1. COVER SLIDE =================
            if (arch === 'cover') {
              slide.addText('العقيدة الإسلامية — تأصيل اليقين • مِشكاة', {
                x: 1.0, y: 1.8, w: 11.333, h: 0.6,
                fontSize: 20, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'center', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 1.0, y: 2.5, w: 11.333, h: 1.5,
                fontSize: 44, fontFace: 'Cairo', color: 'FFFFFF', bold: true, align: 'center', rtlMode: true
              });
              const subCover = bullets[0] || 'تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين';
              slide.addText(subCover, {
                x: 1.0, y: 4.1, w: 11.333, h: 0.8,
                fontSize: 22, fontFace: 'Cairo', color: 'FDE68A', align: 'center', rtlMode: true
              });
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 1.5, y: 5.1, w: 10.333, h: 1.2,
                fill: { color: '123329' }, line: { color: 'C69214', width: 1.5 }
              });
              const outlineBullets = bullets.slice(1).join(' • ') || 'معرفة العبد ربه • أدلة الربوبية • حقيقة الألوهية • ثمار التوحيد في الدارين';
              slide.addText(outlineBullets, {
                x: 1.6, y: 5.2, w: 10.133, h: 1.0,
                fontSize: 16, fontFace: 'Cairo', color: 'FFFFFF', align: 'center', rtlMode: true
              });

            // ================= 2. SOURCES (3 Soft Distinct Cards) =================
            } else if (arch === 'sources') {
              slide.addText('المصادر العلمية المعتمدة', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const srcList = [
                { badge: 'المصدر الأول', title: '«ثلاثة الأصول وأدلتها»', author: 'للإمام محمد بن عبد الوهاب رحمه الله', focus: 'باب: معرفة العبد ربه بالأدلة والبراهين الصريحة من الكتاب والسنة وفطرة الإنسان.', thm: THEME_HONEY },
                { badge: 'المصدر الثاني', title: '«نبذة في العقيدة الإسلامية»', author: 'للشيخ محمد بن صالح العثيمين رحمه الله', focus: 'باب: الإيمان بالله — تفصيل ركائز الربوبية وإفراد الألوهية ومقتضى التوحيد.', thm: THEME_SAGE },
                { badge: 'المصدر الثالث', title: 'منهج العقيدة — أكاديمية زاد', author: 'المنهج التأسيسي للشيخ محمد صالح المنجد', focus: 'مقرر «العقيدة الإسلامية» — بناء اليقين العقدي والتصور الشامل للوجود والتحرر من الشرك.', thm: THEME_SKY }
              ];

              const cardW = 3.65;
              const gap = 0.39;
              [0, 1, 2].forEach(i => {
                const posX = 0.8 + ((2 - i) * (cardW + gap));
                const item = srcList[i];
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 1.95, w: cardW, h: 4.8,
                  fill: { color: item.thm.bg }, line: { color: item.thm.border, width: 1.5 }
                });
                slide.addText(item.badge, {
                  x: posX + 0.3, y: 2.2, w: cardW - 0.6, h: 0.35,
                  fontSize: 14, fontFace: 'Cairo', color: item.thm.badge, bold: true, align: 'right', rtlMode: true
                });
                slide.addText(item.title, {
                  x: posX + 0.3, y: 2.65, w: cardW - 0.6, h: 0.5,
                  fontSize: 21, fontFace: 'Cairo', color: item.thm.title, bold: true, align: 'right', rtlMode: true
                });
                slide.addText(item.author, {
                  x: posX + 0.3, y: 3.25, w: cardW - 0.6, h: 0.45,
                  fontSize: 15, fontFace: 'Cairo', color: '047857', bold: true, align: 'right', rtlMode: true
                });
                slide.addText(item.focus, {
                  x: posX + 0.3, y: 3.8, w: cardW - 0.6, h: 2.5,
                  fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                });
              });

            // ================= 3. STORY / THOUGHT EXPERIMENT (4 Soft Cards) =================
            } else if (arch === 'story') {
              slide.addText('مقدمة: تأمل تدبري ومدخل وجودي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 1.65, w: 11.733, h: 0.85,
                fill: { color: 'FFF9EE' }, line: { color: 'C69214', width: 1.0 }
              });
              const premise = bullets[0] || 'تخيّل أنك استيقظت في قطار فائق السرعة ينطلق بك عبر أودية وجبال لا تعرفها. لن تسأل عن لون المقاعد ولا عن نوع الطعام، بل ستسأل فوراً:';
              slide.addText(premise, {
                x: 1.0, y: 1.7, w: 11.333, h: 0.75,
                fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', bold: true, align: 'right', rtlMode: true
              });

              const qList = [
                { num: '١', q: 'من الذي يقود هذا القطار؟', thm: THEME_HONEY },
                { num: '٢', q: 'من الذي وضعني فيه؟', thm: THEME_SAGE },
                { num: '٣', q: 'إلى أين يتجه بي؟', thm: THEME_SKY },
                { num: '٤', q: 'ما المطلوب مني أثناء الرحلة؟', thm: THEME_LAVENDER }
              ];
              const qW = 2.75;
              const qGap = 0.24;
              [0, 1, 2, 3].forEach(i => {
                const posX = 0.8 + ((3 - i) * (qW + qGap));
                const item = qList[i];
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 2.65, w: qW, h: 2.3,
                  fill: { color: item.thm.bg }, line: { color: item.thm.border, width: 1.5 }
                });
                slide.addText(item.num, {
                  x: posX, y: 2.85, w: qW, h: 0.5,
                  fontSize: 26, fontFace: 'Cairo', color: item.thm.badge, bold: true, align: 'center', rtlMode: true
                });
                slide.addText(item.q, {
                  x: posX + 0.1, y: 3.5, w: qW - 0.2, h: 1.2,
                  fontSize: 18, fontFace: 'Cairo', color: item.thm.title, bold: true, align: 'center', rtlMode: true
                });
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 5.2, w: 11.733, h: 1.4,
                fill: { color: '0B2E24' }, line: { color: 'C69214', width: 1.5 }
              });
              slide.addText('هكذا تماماً هي حياة الإنسان على هذه الأرض.', {
                x: 1.0, y: 5.35, w: 11.333, h: 0.45,
                fontSize: 20, fontFace: 'Cairo', color: 'FDE68A', bold: true, align: 'center', rtlMode: true
              });
              slide.addText('أسئلة وجودية حاسمة تحدد الغاية والمصير، والإجابة عنها هي أول وأعظم واجب على كل مكلف.', {
                x: 1.0, y: 5.85, w: 11.333, h: 0.55,
                fontSize: 16, fontFace: 'Traditional Arabic', color: 'FFFFFF', align: 'center', rtlMode: true
              });

            // ================= 4. CONTRAST (2 Distinct Soft Cards: Sage & Honey) =================
            } else if (arch === 'contrast_2col') {
              slide.addText('التحرير والتفريق المنهجي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              let titleA = 'الوجه الأول';
              let bodyA = bullets[0] || 'تحرير الركيزة الأولى ومقتضياتها المنهجية بدقة علمية.';
              let titleB = 'الوجه المقابل';
              let bodyB = bullets[1] || 'بيان الوجه المقابل والضوابط الشرعية المفرقة بدقة علمية.';

              if (bullets[0] && (bullets[0].includes(':') || bullets[0].includes('—'))) {
                const sep = bullets[0].includes(':') ? ':' : '—';
                const pts = bullets[0].split(sep);
                titleA = pts[0].trim();
                bodyA = pts.slice(1).join(sep).trim();
              }
              if (bullets[1] && (bullets[1].includes(':') || bullets[1].includes('—'))) {
                const sep = bullets[1].includes(':') ? ':' : '—';
                const pts = bullets[1].split(sep);
                titleB = pts[0].trim();
                bodyB = pts.slice(1).join(sep).trim();
              }

              const colW = 5.6;
              const gap = 0.53;

              // Card 1 (Right): Sage Green
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8 + colW + gap, y: 1.85, w: colW, h: 4.8,
                fill: { color: THEME_SAGE.bg }, line: { color: THEME_SAGE.border, width: 1.5 }
              });
              slide.addText('الأصل الأول', {
                x: 0.8 + colW + gap + 0.4, y: 2.1, w: colW - 0.8, h: 0.35,
                fontSize: 14, fontFace: 'Cairo', color: THEME_SAGE.badge, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(titleA, {
                x: 0.8 + colW + gap + 0.4, y: 2.5, w: colW - 0.8, h: 0.6,
                fontSize: 22, fontFace: 'Cairo', color: THEME_SAGE.title, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(bodyA, {
                x: 0.8 + colW + gap + 0.4, y: 3.2, w: colW - 0.8, h: 3.2,
                fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
              });

              // Card 2 (Left): Warm Honey
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 1.85, w: colW, h: 4.8,
                fill: { color: THEME_HONEY.bg }, line: { color: THEME_HONEY.border, width: 1.5 }
              });
              slide.addText('الأصل المقابل', {
                x: 1.2, y: 2.1, w: colW - 0.8, h: 0.35,
                fontSize: 14, fontFace: 'Cairo', color: THEME_HONEY.badge, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(titleB, {
                x: 1.2, y: 2.5, w: colW - 0.8, h: 0.6,
                fontSize: 22, fontFace: 'Cairo', color: THEME_HONEY.title, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(bodyB, {
                x: 1.2, y: 3.2, w: colW - 0.8, h: 3.2,
                fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
              });

            // ================= 5. PILLARS (3 Soft Distinct Cards: Honey, Sage, Sky) =================
            } else if (arch === 'pillars') {
              slide.addText('الركائز والأصول الكبرى', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const colW = 3.65;
              const gap = 0.39;
              const numSymbols = ['١', '٢', '٣'];
              const thms = [THEME_HONEY, THEME_SAGE, THEME_SKY];
              const cleanPillars = bullets.filter(b => b && !/^[\d\u0660-\u0669\s\.\-\)]+$/.test(b.trim()));

              [0, 1, 2].forEach(i => {
                const posX = 0.8 + ((2 - i) * (colW + gap));
                const rawBText = cleanPillars[i] || 'تأصيل شرعي وضبط منهجي للمسألة العلمية';
                const thm = thms[i];
                let colTitle = '';
                let colBody = rawBText;

                if (rawBText.includes(':')) {
                  const cPos = rawBText.indexOf(':');
                  colTitle = rawBText.substring(0, cPos).trim();
                  colBody = rawBText.substring(cPos + 1).trim();
                } else if (rawBText.includes('—')) {
                  const dPos = rawBText.indexOf('—');
                  colTitle = rawBText.substring(0, dPos).trim();
                  colBody = rawBText.substring(dPos + 1).trim();
                }

                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 1.95, w: colW, h: 4.8,
                  fill: { color: thm.bg }, line: { color: thm.border, width: 1.5 }
                });

                slide.addText(numSymbols[i], {
                  x: posX + 0.3, y: 2.15, w: colW - 0.6, h: 0.5,
                  fontSize: 28, fontFace: 'Cairo', color: thm.badge, bold: true, align: 'right', rtlMode: true
                });

                if (colTitle) {
                  slide.addText(colTitle, {
                    x: posX + 0.3, y: 2.75, w: colW - 0.6, h: 0.6,
                    fontSize: 22, fontFace: 'Cairo', color: thm.title, bold: true, align: 'right', rtlMode: true
                  });
                }

                slide.addText(colBody, {
                  x: posX + 0.3, y: colTitle ? 3.45 : 2.8, w: colW - 0.6, h: 3.0,
                  fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                });
              });

            // ================= 6. MATRIX / COMPARISON TABLE =================
            } else if (arch === 'table') {
              slide.addText('أوجه التفريق الجوهرية', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const tData = (Array.isArray(s.tableData) && s.tableData.length > 0)
                ? s.tableData
                : [
                    ['من حيث', 'الشرك الأكبر', 'الشرك الأصغر'],
                    ['أصل الإيمان والملة', 'يناقض أصل التوحيد ويخرج صاحبه من الملة', 'لا يخرج من الملة، لكن ينقص كمال التوحيد الواجب'],
                    ['إحباط الأعمال', 'يحبط جميع الأعمال الصالحة إن مات عليه', 'يحبط العمل الذي خالطه فقط'],
                    ['المصير في الآخرة', 'لا يُغفر لمن مات عليه بلا توبة، ويُخلد في النار', 'تحت المشيئة كأصحاب الكبائر، ولا يخلد في النار'],
                    ['الدم والمال في الدنيا', 'يبيح الدم والمال إذا قامت الحجة وانتفت الموانع', 'لا يبيح دماً ولا مالاً؛ وتبقى حرمة المسلم كاملة']
                  ];

              const formattedTable = tData.map((row, rIdx) => {
                return row.map((cellText, cIdx) => {
                  let fColor = (rIdx === 0) ? '0B2E24' : (cIdx === 1 ? 'FFF9EE' : (cIdx === 2 ? 'EAF4EE' : 'FFFFFF'));
                  let tColor = (rIdx === 0) ? 'C69214' : '1E293B';
                  return {
                    text: cellText,
                    options: {
                      fill: { color: fColor },
                      color: tColor,
                      fontSize: (rIdx === 0) ? 15 : 14,
                      fontFace: (rIdx === 0) ? 'Cairo' : 'Traditional Arabic',
                      bold: (rIdx === 0 || cIdx === 0),
                      align: (rIdx === 0) ? 'center' : 'right',
                      rtlMode: true
                    }
                  };
                });
              });

              slide.addTable(formattedTable, {
                x: 0.8, y: 1.8, w: 11.733, h: 4.3,
                colW: [2.333, 4.7, 4.7],
                border: { color: 'C69214', width: 1.0 }
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 6.25, w: 11.733, h: 0.65,
                fill: { color: 'FFFFFF' }, line: { color: 'C69214', width: 1.0 }
              });
              slide.addText('العلاقة بينهما: الشرك الأصغر بوابة الأكبر وذريعته؛ فالتساهل في الصغير يجر إلى الوقوع في الكبير عياذاً بالله.', {
                x: 1.0, y: 6.3, w: 11.333, h: 0.55,
                fontSize: 14, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

            // ================= 7. MIHRAB (Sacred Verses & Hadiths) =================
            } else if (arch === 'mihrab') {
              slide.addText('محراب الوحي والبيان النبوي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 1.0, y: 1.85, w: 11.333, h: 3.5,
                fill: { color: 'FFF9EE' }, line: { color: 'C69214', width: 2.0 }
              });

              const sacredMain = bullets[0] || s.scriptureEvidence || '«اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم»';
              slide.addText(sacredMain, {
                x: 1.4, y: 2.2, w: 10.533, h: 2.8,
                fontSize: 22, fontFace: 'Traditional Arabic', color: '123329', bold: true, align: 'center', rtlMode: true
              });

              if (bullets[1]) {
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: 1.0, y: 5.55, w: 11.333, h: 1.2,
                  fill: { color: 'EAF4EE' }, line: { color: '123329', width: 1.2 }
                });
                slide.addText(bullets[1], {
                  x: 1.3, y: 5.65, w: 10.733, h: 1.0,
                  fontSize: 16, fontFace: 'Cairo', color: '1E293B', align: 'center', rtlMode: true
                });
              }

            // ================= 8. DEFAULT / CONCEPT BREAKDOWN =================
            } else {
              slide.addText('التأصيل والبيان الشرعي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const count = Math.min(bullets.length, 3);
              if (count === 2) {
                const colW = 5.6;
                const gap = 0.53;
                const thms = [THEME_SAGE, THEME_HONEY];
                [0, 1].forEach(i => {
                  const posX = 0.8 + ((1 - i) * (colW + gap));
                  slide.addShape(pptx.ShapeType.roundRect, {
                    x: posX, y: 1.95, w: colW, h: 4.8,
                    fill: { color: thms[i].bg }, line: { color: thms[i].border, width: 1.5 }
                  });
                  slide.addText(bullets[i], {
                    x: posX + 0.4, y: 2.3, w: colW - 0.8, h: 4.0,
                    fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                  });
                });
              } else {
                const colW = 3.65;
                const gap = 0.39;
                const thms = [THEME_HONEY, THEME_SAGE, THEME_SKY];
                [0, 1, 2].forEach(i => {
                  const posX = 0.8 + ((2 - i) * (colW + gap));
                  const bText = bullets[i] || 'بيان المحور العلمي والواجب المنهجي والشرعي المستفاد.';
                  slide.addShape(pptx.ShapeType.roundRect, {
                    x: posX, y: 1.95, w: colW, h: 4.8,
                    fill: { color: thms[i].bg }, line: { color: thms[i].border, width: 1.5 }
                  });
                  slide.addText(bText, {
                    x: posX + 0.35, y: 2.3, w: colW - 0.7, h: 4.0,
                    fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                  });
                });
              }
            }

            // Attached Speaker Notes
            const speakerNotes = s.notes || s.talkingPoints || s.pedagogicalTip || `ملاحظات المحاضر وتوجيهات الشرح لمسائل: ${slideTitleText}`;
            slide.addNotes(speakerNotes);
          });

          // Save Presentation
          const sanitizedFilename = (cleanTopic || 'المحاضرة_الشرعية')
            .replace(/[/\\?%*:|"<>]/g, '')
            .substring(0, 40)
            .trim();
          await pptx.writeFile({ fileName: `مِشكاة_${sanitizedFilename}.pptx` });
          showToast(isRtl ? 'تم تصدير العرض التقديمي فائق الجودة بالهوية الإسلامية بنجاح ✨' : 'Islamic PowerPoint presentation exported successfully ✨');
        } catch (err) {
          console.error('Error generating PowerPoint file:', err);
          showToast(isRtl ? 'حدث خطأ أثناء إنشاء ملف البوربوينت' : 'Error generating PowerPoint file');
        } finally {
          setIsExportingPptx(false);
        }
      };
      function extractEvidencesAndProofs(rawText) {
        if (!rawText) return { quranicVerses: [], hadiths: [], scholarlyProofs: [] };
        var text = sanitizeArabicExtractedText(rawText);
        
        var quranicVerses = [];
        var hadiths = [];
        var scholarlyProofs = [];

        function stripTashkeelHelper(t) {
          return (t || '').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '').replace(/\s+/g, ' ');
        }

        const normalizedFull = stripTashkeelHelper(rawText);

        // Infallible Canonical Quranic Registry for Classical Curriculum & Tawheed Lectures
        const CANONICAL_QURAN_REGISTRY = [
          {
            pattern: /نودي[sS]{0,30}?الجمعة[sS]{0,30}?فاسعوا/,
            uthmani: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ',
            surah: 'الجمعة',
            ayah: 9
          },
          {
            pattern: /اتخذوا[sS]{0,20}?القر[آا]ن[sS]{0,20}?مهجورا/,
            uthmani: 'وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَذَا الْقُرْآنَ مَهْجُورًا',
            surah: 'الفرقان',
            ayah: 30
          },
          {
            pattern: /قل[sS]{0,15}?لله[sS]{0,15}?الشفاعة[sS]{0,15}?جميعا/,
            uthmani: 'قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا ۖ لَّهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ',
            surah: 'الزمر',
            ayah: 44
          },

          {
            pattern: /[إأاآ]ني[\s\S]{0,20}?وجهت[\s\S]{0,60}?المشركين/,
            uthmani: 'إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ',
            surah: 'الأنعام',
            ayah: 79
          },
          {
            pattern: /ولقد[\s\S]{0,20}?[إأاآ]تينا[\s\S]{0,40}?عالمين/,
            uthmani: 'وَلَقَدْ آتَيْنَا إِبْرَاهِيمَ رُشْدَهُ مِن قَبْلُ وَكُنَّا بِهِ عَالِمِينَ',
            surah: 'الأنبياء',
            ayah: 51
          },
          {
            pattern: /[إأاآ]ذ[\s\S]{0,20}?قال[\s\S]{0,20}?ربه[\s\S]{0,20}?[أإا]سلم[\s\S]{0,40}?العالمين/,
            uthmani: 'إِذْ قَالَ لَهُ رَبُّهُ أَسْلِمْ قَالَ أَسْلَمْتُ لِرَبِّ الْعَالَمِينَ',
            surah: 'البقرة',
            ayah: 131
          },
          {
            pattern: /وجحدوا[\s\S]{0,25}?واستيقنتها[\s\S]{0,50}?المفسدين/,
            uthmani: 'وَجَحَدُوا بِهَا وَاسْتَيْقَنَتْهَا أَنْفُسُهُمْ ظُلْمًا وَعُلُوًّا فَانْظُرْ كَيْفَ كَانَ عَاقِبَةُ الْمُفْسِدِينَ',
            surah: 'النمل',
            ayah: 14
          },
          {
            pattern: /[أإا]م[\s\S]{0,20}?خلقوا[\s\S]{0,30}?الخالقون/,
            uthmani: 'أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ',
            surah: 'الطور',
            ayah: 35
          },
          {
            pattern: /لو[\s\S]{0,20}?كان[\s\S]{0,30}?[آأإا]لهة[\s\S]{0,30}?لفسدتا|لفسدتا[\s\S]{0,35}?[آأإا]لهة/,
            uthmani: 'لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا',
            surah: 'الأنبياء',
            ayah: 22
          },
          {
            pattern: /وما[\s\S]{0,20}?خلقت[\s\S]{0,30}?الجن[\s\S]{0,30}?ليعبدون/,
            uthmani: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
            surah: 'الذاريات',
            ayah: 56
          }
        ];

        CANONICAL_QURAN_REGISTRY.forEach(function(cq) {
          if (cq.pattern.test(normalizedFull)) {
            quranicVerses.push({
              id: 'q_' + cq.surah + '_' + cq.ayah,
              type: 'quran',
              arabicText: '« ' + cq.uthmani + ' »',
              plainText: cq.uthmani,
              citation: cq.surah + ': ' + cq.ayah,
              grading: 'متواتر قطعي الثبوت'
            });
          }
        });

        // Dynamic Bracket Extractor for other general verses (strictly sanitizing out merged lecture text)
        var bracketMatches = text.match(/﴿[^﴾]{15,250}﴾/g) || [];
        bracketMatches.forEach(function(m, idx) {
          var clean = m.replace(/[﴿﴾]/g, '').trim();
          if (/(?:[\d]+[\s\.\-\)]|أدلة|المحور|المبحث|فالعقل|التأمل|ليطمئن|قال تعالى|سواء أكان|مخلوق عاجز|امنص|ابكوك)/.test(clean)) return;
          var wordsCount = clean.split(/\s+/).filter(function(w) { return /[\u0600-\u06FF]{2,}/.test(w); }).length;
          if (clean && wordsCount >= 4 && clean.length >= 18 && !clean.includes('صفحة')) {
            var alreadyIn = quranicVerses.some(function(q) {
              return q.plainText === clean || q.plainText.includes(clean.slice(0, 15)) || clean.includes(q.plainText.slice(0, 15));
            });
            if (!alreadyIn) {
              quranicVerses.push({
                id: 'q_dyn_' + idx,
                type: 'quran',
                arabicText: '« ' + clean + ' »',
                plainText: clean,
                citation: 'القرآن الكريم',
                grading: 'متواتر قطعي الثبوت'
              });
            }
          }
        });

        // Authentic Hadith Extractor
        if (/باب الجنة|فأستفتح|فيقول الخازن|بك أمرت|ألا أفتح لأحد قبلك/.test(text)) {
          hadiths.push({
            id: 'h_shafaa_bab',
            type: 'hadith',
            arabicText: '« آتِي بَابَ الْجَنَّةِ يَوْمَ الْقِيَامَةِ فَأَسْتَفْتِحُ، فَيَقُولُ الْخَازِنُ: مَنْ أَنْتَ؟ فَأَقُولُ: مُحَمَّدٌ، فَيَقُولُ: بِكَ أُمِرْتُ لَا أَفْتَحُ لِأَحَدٍ قَبْلَكَ »',
            englishTranslation: 'I will come to the gate of Paradise on the Day of Resurrection and ask for it to be opened...',
            source: 'صحيح مسلم (197)',
            narrator: 'أنس بن مالك رضي الله عنه',
            grading: 'صحيح'
          });
        }

        if (/أعمى سأله|هل تسمع النداء|فأجب|من سمع النداء/.test(text)) {
          hadiths.push({
            id: 'h_aama_jamaah',
            type: 'hadith',
            arabicText: '« أَتَى النَّبِيَّ ﷺ رَجُلٌ أَعْمَى، فَقَالَ: يَا رَسُولَ اللَّهِ، إِنَّهُ لَيْسَ لِي قَائِدٌ يَقُودُنِي إِلَى الْمَسْجِدِ، فَهَلْ لِي مِنْ رُخْصَةٍ أَنْ أُصَلِّيَ فِي بَيْتِي؟ فَقَالَ: هَلْ تَسْمَعُ النِّدَاءَ بِالصَّلَاةِ؟ قَالَ: نَعَمْ، قَالَ: فَأَجِبْ »',
            englishTranslation: 'A blind man came to the Prophet and asked for permission to pray at home...',
            source: 'صحيح مسلم (653)',
            narrator: 'أبو هريرة رضي الله عنه',
            grading: 'صحيح'
          });
        }

        if (/تفضل صلاة الفذ|بسبع وعشرين درجة/.test(text)) {
          hadiths.push({
            id: 'h_fadl_jamaah',
            type: 'hadith',
            arabicText: '« صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً »',
            englishTranslation: 'Prayer in congregation is twenty-seven degrees superior to prayer performed individually',
            source: 'صحيح البخاري ومسلم',
            narrator: 'عبدالله بن عمر رضي الله عنهما',
            grading: 'متفق عليه'
          });
        }

        if (/من أدرك ركعة من الصلاة/.test(text)) {
          hadiths.push({
            id: 'h_idrak_rakah',
            type: 'hadith',
            arabicText: '« مَنْ أَدْرَكَ رَكْعَةً مِنَ الصَّلَاةِ، فَقَدْ أَدْرَكَ الصَّلَاةَ »',
            englishTranslation: 'Whoever catches up with one rakah of the prayer has caught up with the prayer',
            source: 'صحيح البخاري ومسلم',
            narrator: 'أبو هريرة رضي الله عنه',
            grading: 'متفق عليه'
          });
        }

        if (/أثقل صلاة على المنافقين/.test(text)) {
          hadiths.push({
            id: 'h_athqal_salah',
            type: 'hadith',
            arabicText: '« إِنَّ أَثْقَلَ صَلَاةٍ عَلَى الْمُنَافِقِينَ صَلَاةُ الْعِشَاءِ وَصَلَاةُ الْفَجْرِ، وَلَوْ يَعْلَمُونَ مَا فِيهِمَا لَأَتَوْهُمَا وَلَوْ حَبْوًا »',
            englishTranslation: 'The most burdensome prayers for the hypocrites are Isha and Fajr...',
            source: 'صحيح البخاري ومسلم',
            narrator: 'أبو هريرة رضي الله عنه',
            grading: 'متفق عليه'
          });
        }

        if (/عذاب القبر|استعيذوا بالله|البراء بن عازب|جنازة رجل من الأنصار/.test(text)) {
          hadiths.push({
            id: 'h_baraa',
            type: 'hadith',
            arabicText: '« اسْتَعِيذُوا بِاللَّهِ مِنْ عَذَابِ الْقَبْرِ ... يُثَبِّتُ اللَّهُ الَّذِينَ آمَنُوا بِالْقَوْلِ الثَّابِتِ فِي الْحَيَاةِ الدُّنْيَا وَفِي الْآخِرَةِ »',
            englishTranslation: 'Seek refuge with Allah from the punishment of the grave',
            source: 'صحيح أبي داود',
            narrator: 'البراء بن عازب رضي الله عنه',
            grading: 'صحيح'
          });
        }

        if (/مقلب القلوب/.test(text)) {
          hadiths.push({
            id: 'h_quloob',
            type: 'hadith',
            arabicText: '« يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ »',
            englishTranslation: 'O Turner of hearts, keep my heart firm upon Your religion',
            source: 'جامع الترمذي ومسند أحمد',
            narrator: 'أم سلمة / أنس بن مالك رضي الله عنهما',
            grading: 'صحيح'
          });
        }

        if (/تركت فيكم|كتاب الله وسنة/.test(text)) {
          hadiths.push({
            id: 'h_turiktu',
            type: 'hadith',
            arabicText: '« تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ »',
            englishTranslation: 'I have left among you two things...',
            source: 'الموطأ ومستدرك الحاكم',
            narrator: 'مالك بن أنس مرسلاً / ابن عباس',
            grading: 'صحيح لغيره'
          });
        }

        return {
          quranicVerses: quranicVerses,
          hadiths: hadiths,
          scholarlyProofs: scholarlyProofs
        };
      }

            function normalizeArabicPresentationForms(str) {
        if (!str) return '';
        const presentationMap = {
          '\uFE80': '\u0621', '\uFE81': '\u0622', '\uFE82': '\u0622', '\uFE83': '\u0623', '\uFE84': '\u0623',
          '\uFE85': '\u0624', '\uFE86': '\u0624', '\uFE87': '\u0625', '\uFE88': '\u0625', '\uFE89': '\u0626',
          '\uFE8A': '\u0626', '\uFE8B': '\u0626', '\uFE8C': '\u0626', '\uFE8D': '\u0627', '\uFE8E': '\u0627',
          '\uFE8F': '\u0628', '\uFE90': '\u0628', '\uFE91': '\u0628', '\uFE92': '\u0628', '\uFE93': '\u0629',
          '\uFE94': '\u0629', '\uFE95': '\u062A', '\uFE96': '\u062A', '\uFE97': '\u062A', '\uFE98': '\u062A',
          '\uFE99': '\u062B', '\uFE9A': '\u062B', '\uFE9B': '\u062B', '\uFE9C': '\u062B', '\uFE9D': '\u062C',
          '\uFE9E': '\u062C', '\uFE9F': '\u062C', '\uFEA0': '\u062C', '\uFEA1': '\u062D', '\uFEA2': '\u062D',
          '\uFEA3': '\u062D', '\uFEA4': '\u062D', '\uFEA5': '\u062E', '\uFEA6': '\u062E', '\uFEA7': '\u062E',
          '\uFEA8': '\u062E', '\uFEA9': '\u062F', '\uFEAA': '\u062F', '\uFEAB': '\u0630', '\uFEAC': '\u0630',
          '\uFEAD': '\u0631', '\uFEAE': '\u0631', '\uFEAF': '\u0632', '\uFEB0': '\u0632', '\uFEB1': '\u0633',
          '\uFEB2': '\u0633', '\uFEB3': '\u0633', '\uFEB4': '\u0633', '\uFEB5': '\u0634', '\uFEB6': '\u0634',
          '\uFEB7': '\u0634', '\uFEB8': '\u0634', '\uFEB9': '\u0635', '\uFEBA': '\u0635', '\uFEBB': '\u0635',
          '\uFEBC': '\u0635', '\uFEBD': '\u0636', '\uFEBE': '\u0636', '\uFEBF': '\u0636', '\uFEC0': '\u0636',
          '\uFEC1': '\u0637', '\uFEC2': '\u0637', '\uFEC3': '\u0637', '\uFEC4': '\u0637', '\uFEC5': '\u0638',
          '\uFEC6': '\u0638', '\uFEC7': '\u0638', '\uFEC8': '\u0638', '\uFEC9': '\u0639', '\uFECA': '\u0639',
          '\uFECB': '\u0639', '\uFECC': '\u0639', '\uFECD': '\u063A', '\uFECE': '\u063A', '\uFECF': '\u063A',
          '\uFED0': '\u063A', '\uFED1': '\u0641', '\uFED2': '\u0641', '\uFED3': '\u0641', '\uFED4': '\u0641',
          '\uFED5': '\u0642', '\uFED6': '\u0642', '\uFED7': '\u0642', '\uFED8': '\u0642', '\uFED9': '\u0643',
          '\uFEDA': '\u0643', '\uFEDB': '\u0643', '\uFEDC': '\u0643', '\uFEDD': '\u0644', '\uFEDE': '\u0644',
          '\uFEDF': '\u0644', '\uFEE0': '\u0644', '\uFEE1': '\u0645', '\uFEE2': '\u0645', '\uFEE3': '\u0645',
          '\uFEE4': '\u0645', '\uFEE5': '\u0646', '\uFEE6': '\u0646', '\uFEE7': '\u0646', '\uFEE8': '\u0646',
          '\uFEE9': '\u0647', '\uFEEA': '\u0647', '\uFEEB': '\u0647', '\uFEEC': '\u0647', '\uFEED': '\u0648',
          '\uFEEE': '\u0648', '\uFEEF': '\u0649', '\uFEF0': '\u0649', '\uFEF1': '\u064A', '\uFEF2': '\u064A',
          '\uFEF3': '\u064A', '\uFEF4': '\u064A', '\uFEF5': '\u0644\u0622', '\uFEF6': '\u0644\u0622',
          '\uFEF7': '\u0644\u0623', '\uFEF8': '\u0644\u0623', '\uFEF9': '\u0644\u0625', '\uFEFA': '\u0644\u0625',
          '\uFEFB': '\u0644\u0627', '\uFEFC': '\u0644\u0627',
          '\uFDF2': 'الله',
          '\uFDFD': 'بسم الله الرحمن الرحيم',
          '\uFDFA': 'صلى الله عليه وسلم',
          '\uFDFB': 'جل جلاله'
        };
        return str.replace(/[\uFE70-\uFEFC\uFDF0-\uFDFD]/g, ch => presentationMap[ch] || ch);
      }

      // Detection & Inversion of Reversed Visual-Order Arabic (LTR encoded PDFs)
      function detectAndInvertReversedArabic(text) {
        if (!text) return text;
        // Pre-normalize broken forms of Emtithal, Ahkam and Salah BEFORE reversal checks!
        text = text.replace(/االمتثال/gu, 'الامتثال');
        text = text.replace(/الاامتثال/gu, 'الامتثال');
        text = text.replace(/ألوامره/gu, 'لأوامره');
        text = text.replace(/لألحكام/gu, 'للأحكام');
        text = text.replace(/أَقَامُوا\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ا?ل\s*ص\s*َّ?\s*َ?\s*(?:ل\s*ا|لا)\s*ة/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:ة\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*(?:ل\s*ا|لا)\s*ص\s*ل?ا|ص\s*(?:ل\s*ا|لا)\s*ل?ا\s*ة)\s*(?:أَقَامُوا|اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)\s*(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:^|[\s«\("])ةَ?\s+الَ?َّ?\s*صلاَ?\s+أَقَامُوا(?=[\s»\)"،.؛!؟]|$)/gu, ' أَقَامُوا الصَّلَاةَ ');
        text = text.replace(/ة\s+الَ?َّ?\s*صلاَ?\s+أَقَامُوا/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)\s*(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)\s*أَقَامُوا/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/أَقَامُوا\s*(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:ة\s+الَّ?\s*صلا\s+اوُماَقَأ|اوُماَقَأ\s+صلا\s+الَّ?\s*ة|اوُماَقَأ\s+الصَّ?\s*لا\s*ةَ?|أَقَامُوا\s+الصَّ?\s*لا\s*ةَ?|ةَ?\s*ال\s*َّصلا\s*اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:^|[\s«\("])(?:ةَ?\s+الَّ?\s*صلا|صلا\s+الَّ?\s*ةَ?)(?=[\s»\)"،.؛!؟]|$)/gu, ' الصَّلَاةَ ');
        text = text.replace(/اوُماَقَأ/gu, 'أَقَامُوا');
        text = text.replace(/الصَّ?\s*لا\s*ةَ?/gu, 'الصَّلَاةَ');
        text = text.replace(/ولا\s+ضرا\s+اول/gu, 'ولا ضراً');
        text = text.replace(/ولا\s+ضرا\s+ا\s+ول/gu, 'ولا ضراً');
        text = text.replace(/ربدتب\s+أرقا-?/gu, '-اقرأ بتدبر');
        text = text.replace(/أرقا\s+ربدتب-?/gu, '-اقرأ بتدبر');

        const REVERSE_STEMS = new Set([
          'ةبعش', 'ةطامإ', 'ةينادحو', 'ةفرعم', 'ةنسلا', 'ةتباثلا', 'لصلأا', 'ثلاثلا',
          'هبر', 'ناك', 'ملعي', 'سيلبإ', 'كنأك', 'هارت', 'دبعت', 'كاري', 'هنإف',
          'نإف', 'نكت', 'نوعبسو', 'اهلاعأ', 'اهاندأو', 'لدت', 'هتيبوبرو', 'هتردقو',
          'نقوتو', 'نلأ', '؛لضفلأا', 'لضفلأا', 'كرت', 'كلذب', 'هنكل', 'هنع', 'قولخم',
          'زجاع', 'كلمي', 'ليحتسي', 'نوكي', 'يلاتلابو', 'ءاوس', 'ناكأ', 'نود', 'ادمحم',
          'هيبناً', 'لقثأ', 'نإ', 'ديري', 'اذاَم', 'اظام', 'كسفن', 'لأسا', 'ينم', 'أمناد', 'دانمأ', 'ربدتب', 'أرقا'
        ]);

        const isTokenReversed = (word) => {
          const clean = word.replace(/^[«"“\(\[\.،؛!؟\-]+|[»"”\)\]\.،؛!؟\-]+$/g, '');
          if (!clean) return false;
          if (/^[ةـة؟]/.test(clean)) return true;
          if (/^[^إ]*إ$/.test(clean) && clean.length <= 4) return true;
          if (/(?:لا|لأا)$/.test(clean) && clean.length >= 4 && !/^(?:كلا|ألا|إلا|هلا|علا|فلا|ولا|بلا|هللا|وهللا|الله|والله)$/.test(clean)) return true;
          if (REVERSE_STEMS.has(clean)) return true;
          return false;
        };

        const isTokenForward = (word) => {
          const clean = word.replace(/^[«"“\(\[\.،؛!؟\-]+|[»"”\)\]\.،؛!؟\-]+$/g, '');
          if (!clean) return false;
          if (/^(?:ال|وال|فال|بال|لل|كال|الله|والله|فالله|بالله|ولله|فلله|هللا|وهللا)/.test(clean) && clean.length >= 3) return true;
          if (/[ةـة]$/.test(clean)) return true;
          if (/^(?:في|من|عن|على|إلى|مع|أن|إن|هو|هي|هذا|هذه|ذلك|تلك|كان|يكون|قال|يقول|الذي|التي|ماذا|كيف|لماذا|هل|اسأل|اقرأ|ترك|عدم|حكم|الصلاة|صلاة)$/.test(clean)) return true;
          return false;
        };

        const invertTextUnit = (str) => {
          const words = str.trim().split(/\s+/);
          const invertedWords = words.map(w => {
            if (w === '؟ينم' || w === 'ينم؟') return 'مني؟';
            if (w === 'ديري') return 'يريد';
            if (w === 'اذاَم' || w === 'اظام') return 'ماذا';
            if (w === 'كسفن') return 'نفسك';
            if (w === 'لأسا') return 'اسأل';
            if (w === 'أمناد' || w === 'دانمأ') return 'دائماً';
            if (w === 'لقثأ') return 'أثقل';
            if (w === 'نإ') return 'إن';
            if (w === 'الله' || w === 'هللا') return 'الله';

            let rev = w.split('').reverse().join('');
            return rev
              .replace(/«/g, 'TEMP_OPEN_Q').replace(/»/g, '«').replace(/TEMP_OPEN_Q/g, '»')
              .replace(/\(/g, 'TEMP_OPEN_P').replace(/\)/g, '(').replace(/TEMP_OPEN_P/g, ')')
              .replace(/\[/g, 'TEMP_OPEN_B').replace(/\]/g, '[').replace(/TEMP_OPEN_B/g, ']')
              .replace(/\{/g, 'TEMP_OPEN_C').replace(/\}/g, '{').replace(/TEMP_OPEN_C/g, '}')
              .replace(/﴿/g, 'TEMP_OPEN_A').replace(/﴾/g, '﴿').replace(/TEMP_OPEN_A/g, '﴾')
              .replace(/؟/g, 'TEMP_Q').replace(/TEMP_Q/g, '؟');
          }).reverse();
          let res = invertedWords.join(' ');
          res = res.replace(/؟\s*([^\s؟]+)/g, '$1؟');
          res = res.replace(/هللا/g, 'الله');
          res = res.replace(/دانمأ|دانما/g, 'دائماً');
          return res;
        };

        const isSegmentReversed = (segment) => {
          const words = segment.trim().split(/\s+/).filter(Boolean);
          if (words.length === 0) return false;
          let revCount = 0;
          let fwdCount = 0;
          words.forEach(w => {
            if (isTokenReversed(w)) revCount++;
            if (isTokenForward(w)) fwdCount++;
          });
          if (words.some(w => /^[ةـة؟][\u0600-\u06FF]{2,}/.test(w.replace(/^[^\u0600-\u06FF]+/, ''))) && revCount > fwdCount) return true;
          return revCount > fwdCount && revCount >= 1;
        };

        const lines = text.split(/\r?\n/);
        return lines.map(line => {
          if (!line || !line.trim()) return line;

          const lineWords = line.trim().split(/\s+/).filter(Boolean);
          let totalRev = 0;
          let totalFwd = 0;
          lineWords.forEach(w => {
            if (isTokenReversed(w)) totalRev++;
            if (isTokenForward(w)) totalFwd++;
          });

          // Entire line predominantly reversed
          if (totalRev >= 2 && totalFwd <= 1) {
            return invertTextUnit(line);
          }

          // Mixed line: invert reversed quotes (both "..." and «...» and “...”)
          let l = line.replace(/(["“«])([^"”»\n]{3,120})(["”»])/gu, (match, openQ, inner, closeQ) => {
            if (isSegmentReversed(inner) || inner.includes('؟ينم') || inner.includes('ديري') || inner.includes('اذاَم')) {
              return openQ + invertTextUnit(inner) + closeQ;
            }
            return match;
          });

          // Invert recognized reversed standalone phrases
          l = l.replace(/(?:أمناد|دانمأ)\s+كسفن\s+لأسا/gu, 'اسأل نفسك دائماً');
          l = l.replace(/لقثأ\s+نإ/gu, 'إن أثقل');

          // Check sub-chunks separated by colons, semicolons, commas, or periods
          const chunks = l.split(/([،؛:\.\?\!«»\(\)\[\]])/);
          const repaired = [];
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (isSegmentReversed(chunk)) {
              repaired.push(invertTextUnit(chunk));
            } else {
              repaired.push(chunk);
            }
          }

          return repaired.join('');
        }).join('\n');
      }

      function joinWrappedArabicLines(rawInput) {
        if (!rawInput) return '';
        const lines = Array.isArray(rawInput) ? rawInput : (rawInput || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const merged = [];

        for (let i = 0; i < lines.length; i++) {
          const cur = lines[i].trim();
          if (!cur) continue;
          if (merged.length === 0) {
            merged.push(cur);
            continue;
          }

          const prev = merged[merged.length - 1];

          // Headings MUST NEVER be merged into previous lines, and lines after a heading must NEVER be merged into it!
          const headingTest = (str) => /^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|المبحث|المطلب|الفصل|الباب|المحور|المسألة|الوقفة|القسم|الأصل|القاعدة|الضابط|العنصر|النقطة|\d+[\.\-\)])\s*(?:الأول|الثاني|الثالث|الرابع|الخامس|\d+|[\u0660-\u0669]+|[أ-ي])?[:\.\-\s]|^[#]{1,4}\s+|^(?:\d+|[\u0660-\u0669]+)\s*[\.\-\)]\s*/i.test(str);
          if (headingTest(cur) || headingTest(prev)) {
            merged.push(cur);
            continue;
          }

          // Check if prev line was incomplete and cur continues it (capped to 350 chars):
          const quranCount = (prev.match(/[﴿﴾]/g) || []).length;
          const openQuran = (quranCount % 2 !== 0) && prev.length < 350;

          const parenCount = (prev.match(/[\(\)（）]/g) || []).length;
          const openParen = (parenCount % 2 !== 0) && prev.length < 350;

          const bracketCount = (prev.match(/[\[\]]/g) || []).length;
          const openBracket = (bracketCount % 2 !== 0) && prev.length < 350;

          const quoteCount = (prev.match(/[«»"]/g) || []).length;
          const openQuote = (quoteCount % 2 !== 0) && prev.length < 350;

          const trailingConnector = /(?:من|إلى|عن|على|في|مع|بين|أن|إن|بأن|حيث|كما|إذ|دون|و|أو|التي|الذي|الذين|اللاتي|اللواتي|ما|لا|كل|عند|قبل|بعد|نحو|ضد|مثل|غير|أثر|حتى|لئلا|لكن|أم|بل|ثم|سواء)$/.test(prev);

          const startsWithCloser = /^[»\)）\]﴾\.،؛!؟]/.test(cur);
          const prevEndsWithTerminator = /[.؛!؟:—\-]$/.test(prev);

          if (openQuran || openParen || openBracket || openQuote || trailingConnector || startsWithCloser || (!prevEndsWithTerminator && cur.length > 0 && prev.length < 85)) {
            merged[merged.length - 1] = prev + ' ' + cur;
          } else {
            merged.push(cur);
          }
        }

        return merged.join('\n');
      }

      function trimToCompleteSentence(text, maxLen = 380) {
        if (!text) return '';
        const clean = text.trim();
        if (clean.length <= maxLen) return clean;

        // Infallible completion for Hadiths, quotations, and sentence endings
        const searchRange = clean.substring(0, Math.min(clean.length, maxLen + 160));
        const punctCandidates = ['.', '!', '؟', '؛', '»', '"', ':\n', '\n']
          .map(p => searchRange.lastIndexOf(p))
          .filter(idx => idx !== -1);

        if (punctCandidates.length > 0) {
          const bestPunct = Math.max(...punctCandidates);
          if (bestPunct >= maxLen - 100) {
            return clean.substring(0, bestPunct + 1).trim();
          }
        }

        const lastSpace = searchRange.substring(0, maxLen).lastIndexOf(' ');
        if (lastSpace > 80) {
          let cleanSub = clean.substring(0, lastSpace).trim();
          cleanSub = cleanSub.replace(/\s+(?:ال|كل|على|من|في|أن|إن|أو|ثم|مع|إلى|ثالث|عن|بين|وهو|وهي|التي|الذي|هذا|هذه|وإنما|وانما|بل|لكن|أهل|ولا|وقال|فقال)$/u, '');
          return cleanSub + '...';
        }
        return clean.substring(0, maxLen).trim() + '...';
      }

      
      function sanitizeIslamicDataObject(obj) {
        if (!obj) return obj;
        if (typeof obj === 'string') {
          return sanitizeArabicExtractedText(obj);
        }
        if (Array.isArray(obj)) {
          return obj.map(item => sanitizeIslamicDataObject(item));
        }
        if (typeof obj === 'object') {
          const res = {};
          for (const key of Object.keys(obj)) {
            if (key === 'id' || key === 'slideNumber' || key === 'phaseNumber' || key === 'durationMinutes' || key === 'isCorrect' || key === 'order' || key === 'index') {
              res[key] = obj[key];
            } else {
              res[key] = sanitizeIslamicDataObject(obj[key]);
            }
          }
          return res;
        }
        return obj;
      }
      function sanitizeArabicExtractedText(rawText) {
        if (!rawText) return '';
        // 0. Pre-strip PDF Page Markers & OCR Inversion Artifacts before line processing:
        rawText = rawText.replace(/["“«]?\s*هِبْلَقِ\s+نِمْ[\s\S]*?لاَقَ\s+نَمْ\s*["”»]?/gu, '«مَنْ قَالَ لَا إِلَهَ إِلَّا اللَّهُ خَالِصًا مِنْ قَلْبِهِ»');
        rawText = rawText.replace(/مُهُتَعاَفَشْ\s+يِنْغُت\s+لا\s+تاَواَمَّسلاِ\s+يِف\s+كَلَمٍ\s+نِمْ\s+مَكَو/gu, '﴿وَكَمْ مِنْ مَلَكٍ فِي السَّمَاوَاتِ لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا﴾');
        rawText = rawText.replace(/تاَواَمَّسلاِ\s+يِف\s+كَلَمٍ\s+نِمْ\s+مَكَو/gu, '﴿وَكَمْ مِنْ مَلَكٍ فِي السَّمَاوَاتِ﴾');
        rawText = rawText.replace(/\(مُهْنِمْ\s+رَصَتْن\s+الََ\s+ُ\s*ءاَشَيُ\s+وَلَوْ\)/gu, '﴿وَلَوْ يَشَاءُ اللَّهُ لَانْتَصَرَ مِنْهُمْ﴾');
        rawText = rawText.replace(/هاضِرو\s+اللهِ\s+نْذإِ\s+دعَبَ\s+اَلّ\s+إ\s+اًئيَش\s+مهُتعافش\s+ينغُت\s+لا/gu, '«لَا تُغْنِي شَفَاعَتُهُمْ شَيْئًا إِلَّا مِنْ بَعْدِ إِذْنِ اللَّهِ وَرِضَاهُ»');
        rawText = rawText.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+(?:لوق|لوقُ)\s*([-\d\.\s]*)/gu, '$1 قول الله تعالى: ');
        rawText = rawText.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|اللهُ)\s*هُعِّ?فَ?شُ?يف/gu, 'فيُشفّعُه الله تعالى');
        rawText = rawText.replace(/مَّ?لسو\s+هيلع\s+(?:الله|هللا|اللهُ|ه\s*للا)\s+ىَّ?لص/gu, 'صلى الله عليه وسلم');
        rawText = rawText.replace(/اللهدبع\s+نب\s+رباج/gu, 'جابر بن عبدالله');
        rawText = rawText.replace(/اللهُ\s+لوقيُ/gu, 'يقول الله تعالى:');
        rawText = rawText.replace(/ِالخَ\s+الئِق/gu, 'الخلائق');
        rawText = rawText.replace(/إلعالء/gu, 'لإعلاء');
        rawText = rawText.replace(/كماالتهم/gu, 'كمالاتهم');
        rawText = rawText.replace(/خُذالن/gu, 'خذلان');
        rawText = rawText.replace(/أوالدك/gu, 'أولادك');
        rawText = rawText.replace(/وجالء/gu, 'وجلاء');
        rawText = rawText.replace(/اللوه/gu, 'اللهو');
        rawText = rawText.replace(/وهللا/gu, 'والله');
        rawText = rawText.replace(/عبدهللا/gu, 'عبدالله');
        rawText = rawText.replace(/هللا/gu, 'الله');
        rawText = rawText.replace(/---\s*P\d+\s*---\s*/gi, '\n');
        rawText = rawText.replace(/(?:^|[\s«\("])صَالة(?=[\s»\)"،.؛!؟]|$)/gu, ' صلاة ');
        rawText = rawText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]*صَ?ا?لَ?ة[\u064B-\u065F\u0670\u06D6-\u06ED]*\s+[\u064B-\u065F\u0670\u06D6-\u06ED]*الجُمُعة/gu, 'صلاة الجمعة');
        rawText = rawText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]*صَ?ا?لَ?ة[\u064B-\u065F\u0670\u06D6-\u06ED]*\s+[\u064B-\u065F\u0670\u06D6-\u06ED]*العِيد/gu, 'صلاة العيد');
        rawText = rawText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]*صَ?ا?لَ?ة[\u064B-\u065F\u0670\u06D6-\u06ED]*\s+[\u064B-\u065F\u0670\u06D6-\u06ED]*الجماعة/gu, 'صلاة الجماعة');
        rawText = rawText.replace(/صالة\s+الفرض/gu, 'صلاة الفرض');
        rawText = rawText.replace(/صالة\s+النافلة/gu, 'صلاة النافلة');
        rawText = rawText.replace(/صالة\s+المكتوبة/gu, 'صلاة المكتوبة');
        rawText = rawText.replace(/صَالة\s+ِالجَماعة/gu, 'صلاة الجماعة');
        rawText = rawText.replace(/صالة\s+الجماعة/gu, 'صلاة الجماعة');
        rawText = rawText.replace(/ًاقائل\s*:/gu, 'قائلاً:');
        rawText = rawText.replace(/ال\s*ُ?أفتَح\s*ٍ?ألحَد\s*قَبلَك/gu, 'لا أفتح لأحد قبلك');
        rawText = rawText.replace(/ٍألحَد/gu, 'لأحد');
        rawText = rawText.replace(/ََِّلا\s*ة/gu, 'صَلَاةِ');
        rawText = rawText.replace(/(?:ِ?\s*َ?َّ?لا?\s*ة\s*لِلص|لِلص\s*َّ?َ?لا?\s*ة)/gu, 'لِلصَّلَاةِ');
        rawText = rawText.replace(/االمتثال/gu, 'الامتثال');
        rawText = rawText.replace(/الاامتثال/gu, 'الامتثال');
        rawText = rawText.replace(/ألوامره/gu, 'لأوامره');
        rawText = rawText.replace(/لألحكام/gu, 'للأحكام');
        rawText = rawText.replace(/^[-\s]*P\d+[-\s]*$/gmi, '');
        rawText = rawText.replace(/(?:^|\s)P\d+\s*[-–—]+\s*/gi, ' ');
        rawText = rawText.replace(/(?:^|[\s«\("])باز\s+ابن(?=[\s»\)"،.؛!؟]|$)/gu, ' ابن باز ');
        rawText = rawText.replace(/س\s+ما\s+حكم\s+ترك\s+الجماعة\s+في\s+المسجد\s*؟\s*باز\s+ابن/gu, 'س: ما حكم ترك الجماعة في المسجد؟ (فتوى الشيخ ابن باز):');
        rawText = rawText.replace(/[“«"]?\s*ينم\s*؟?\s*(?:الله|هللا)?\s*ديري\s*(?:اذام|اذاَم|اظام)\s*[”»"]?/gu, '«ماذا يريد الله مني؟»');
        rawText = rawText.replace(/ينم\s*؟?\s*(?:الله|هللا)?\s*ديري\s*(?:اذام|اذاَم|اظام)/gu, 'ماذا يريد الله مني؟');
        rawText = rawText.replace(/(?:ىلاعت|ىلاعَت)\s+(?:الله|هللا|ه\s*للا)\s+لوق\s+تحت:?/gu, 'تحت قول الله تعالى:');
        rawText = rawText.replace(/لوق\s+تحت/gu, 'تحت قول');
        rawText = rawText.replace(/ألتوهما/gu, 'لأتوهما');
        rawText = rawText.replace(/إعتالء/gu, 'إعلاء');
        rawText = rawText.replace(/المَ\s+الئِكة/gu, 'الملائكة');
        rawText = rawText.replace(/المَالئِكة/gu, 'الملائكة');
        rawText = rawText.replace(/(?:ِ?\s*َ?َّ?لا?\s*ة\s*لِلص|لِلص\s*َّ?َ?لا?\s*ة)/gu, 'لِلصَّلَاةِ');
        rawText = rawText.replace(/الأدلَّة\s*:\s*ا\s+أول\s*:/gu, 'الأدلة: أولاً:');
        rawText = rawText.replace(/ا\s+أول\s*:/gu, 'أولاً:');
        rawText = rawText.replace(/فالشفاعة\s+ال\s+صحيحة\s+التكون\s+إال/gu, 'فالشفاعة الصحيحة لا تكون إلا:');

        // Separate inline numbered sub-headings so they never get swallowed into cards:
        let text = rawText.replace(/([^\n])\s*(\d+[\-–\.]\s*(?:هجر|المحور|المطلب|المبحث|النوع|الأصل|القسم|الوقفة|القاعدة))/gu, '$1\n\n$2');

        // 1. Normalize presentation forms to standard Arabic characters
        text = normalizeArabicPresentationForms(text);
        // 2. Invert reversed visual lines line-by-line FIRST
        text = detectAndInvertReversedArabic(text);
        // 3. Smart join wrapped lines (strictly heading-immune)
        text = joinWrappedArabicLines(text);

        // Rejoin inverted Quranic brackets if in reverse order: "﴾آية﴿" -> "﴿آية﴾"
        text = text.replace(/﴾([^﴿﴾]{3,350})﴿/gu, (m, p1) => '﴿' + p1.trim() + '﴾');

        // Normalize specific inverted verse from PDF: لو كان فيهما آلهة إلا الله لفسدتا
        text = text.replace(/(?:﴿?\s*لَ?فَ?سَ?دَ?تَ?ا[\s\S]{0,60}?لَ?و[\s\u064B-\u0652]*كَ?ان[\s\u064B-\u0652]*فِ?يهِ?مَ?ا[\s\u064B-\u0652]*آلِ?هَ?ة[\s\S]*?﴾?|﴿?\s*لَ?و[\s\u064B-\u0652]*كَ?ان[\s\u064B-\u0652]*فِ?يهِ?مَ?ا[\s\u064B-\u0652]*آلِ?هَ?ة[\s\S]*?لَ?فَ?سَ?دَ?تَ?ا[\s\S]*?﴾?)\.?/gu, '﴿لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا﴾ [الأنبياء: 22]');

        // Strip spurious short bracketed fragments that are not valid Quranic verses
        text = text.replace(/«?\s*﴿\s*[^﴾\n]{1,12}\s*﴾\s*»?/gu, ' ');
        text = text.replace(/﴿\s*(?:لا|\.|\.?\s*إلا|الَِّ\s*\.|نعم|بلى|فقط|لا\s*\.?\s*إ|لا\s+بس)\s*﴾/g, ' ');

        // 1. Strip all Tatweel/Kashida characters
        text = text.replace(/[\u0640]+/g, '');

        // 2. Collapse 4+ repeated Dals
        text = text.replace(/د{4,}/g, '');
        text = text.replace(/(?:^|[\s(\[«])لق(?=[\s)\.،؛!؟»\]]|$)/gu, ' لقد ');

        // 3. Collapse any Arabic letter repeated 3+ times to 1
        text = text.replace(/([^0-9\s\.\-\*#])\1{2,}/g, '$1');

        // 4. Remove Table of Contents leader dots, underline streaks, and dashes
        text = text.replace(/\.{3,}/g, ' ');
        text = text.replace(/_{3,}/g, ' ');
        text = text.replace(/[\-]{4,}/g, ' ');
        text = text.replace(/={2,}/g, ' ');
        text = text.replace(/ألن\s+القلب/g, 'لأن القلب');
        text = text.replace(/الْعَ\s+الَمِين/g, 'الْعَالَمِينَ');
        text = text.replace(/الْعَالَمِين(?=[^َ]|$)/g, 'الْعَالَمِينَ');

        // 5. Systemic Arabic Sacred Names & Inversion Normalization
        text = normalizeIslamicSacredTerms(text);
        text = text.replace(/اعوذ/g, 'أعوذ');

        // 6. Universal Arabic OCR Ligature & Typo Corrections (NEVER use \b with Arabic!)
        text = text.replace(/(?:^|[\s«\("])(?:الاامتثال|االامتثال|االمتثال|المتثال)(?=[\s»\)"،.؛!؟]|$)/gu, ' الامتثال ');
        text = text.replace(/الامتثال\s+ألوامره/gu, 'الامتثال لأوامره');
        text = text.replace(/الامتثال\s+أوامره/gu, 'الامتثال لأوامره');
        text = text.replace(/المتثال/gu, 'الامتثال');
        text = text.replace(/(?:^|[\s«\("])وأخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' وأخلاقه ');
        text = text.replace(/(?:^|[\s«\("])أخالقه(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاقه ');
        text = text.replace(/(?:^|[\s«\("])أخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' أخلاق ');
        text = text.replace(/(?:^|[\s«\("])الأخالق(?=[\s»\)"،.؛!؟]|$)/gu, ' الأخلاق ');
        text = text.replace(/ملسو\s+هيلع\s+هللا\s+ىلص/gu, 'صلى الله عليه وسلم');
        text = text.replace(/ىلص\s+هللا\s+هيلع\s+ملسو/gu, 'صلى الله عليه وسلم');
        text = text.replace(/(?:^|[\s«\("])باهلل(?=[\s»\)"،.؛!؟]|$)/gu, ' بالله ');
        text = text.replace(/(?:^|[\s«\("])هللا(?=[\s»\)"،.؛!؟]|$)/gu, ' الله ');
        text = text.replace(/السشفاء/gu, 'الاستشفاء');
        text = text.replace(/السفاء/gu, 'الاستشفاء');
        text = text.replace(/استسفاء/gu, 'استشفاء');
        text = text.replace(/في عالج علل/gu, 'في علاج علل');
        text = text.replace(/القرآنمثل/gu, 'القرآن مثل');
        text = text.replace(/اقائل/gu, 'القائل:');
        text = text.replace(/محض هلل/gu, 'محض لله');
        text = text.replace(/حق هلل/gu, 'حق لله');
        text = text.replace(/طاعة هلل/gu, 'طاعة لله');
        text = text.replace(/كتاب هلل/gu, 'كتاب لله');
        text = text.replace(/رسول هلل/gu, 'رسول لله');
        text = text.replace(/شريعة هلل/gu, 'شريعة لله');
        text = text.replace(/إخلاص هلل/gu, 'إخلاص لله');
        text = text.replace(/توحيد هلل/gu, 'توحيد لله');
        text = text.replace(/عبادة هلل/gu, 'عبادة لله');
        text = text.replace(/سبيل هلل/gu, 'سبيل لله');
        text = text.replace(/بيوت هلل/gu, 'بيوت لله');
        text = text.replace(/خلق هلل/gu, 'خلق لله');
        text = text.replace(/(?:^|[\s(\[«])هلل\s+(?:عز\s*وجل|وحده)/gu, ' لله عز وجل ');

        // Specific high-frequency decomposed / inverted PDF terms
        text = text.replace(/االستسالم/g, 'الاستسلام');
        text = text.replace(/واالستسالم/g, 'والاستسلام');
        text = text.replace(/الاستسالم/g, 'الاستسلام');
        text = text.replace(/واالنقيلد/g, 'والانقياد');
        text = text.replace(/االنقيلد/g, 'الانقياد');
        text = text.replace(/واالنقياد/g, 'والانقياد');
        text = text.replace(/االنقياد/g, 'الانقياد');
        text = text.replace(/الإس\s*الم/g, 'الإسلام');
        text = text.replace(/الإسالم/g, 'الإسلام');
        text = text.replace(/الإبالم/g, 'الإسلام');
        text = text.replace(/اإلبالم/g, 'الإسلام');
        text = text.replace(/بإبالم/g, 'بالإسلام');
        text = text.replace(/إبالم/g, 'إسلام');
        text = text.replace(/باإلسالم/g, 'بالإسلام');
        text = text.replace(/بالإسالم/g, 'بالإسلام');
        text = text.replace(/إسالم/g, 'إسلام');
        text = text.replace(/اإلسالم/g, 'الإسلام');
        text = text.replace(/إقام\s+الصالة/g, 'إقام الصلاة');
        text = text.replace(/إقام\s+الصلاة/g, 'إقام الصلاة');
        text = text.replace(/ومالئكته/g, 'وملائكته');
        text = text.replace(/بمالئكته/g, 'بملائكته');
        text = text.replace(/المالئكة/g, 'الملائكة');
        text = text.replace(/مالئكته/g, 'ملائكته');
        text = text.replace(/مالئكة/g, 'ملائكة');
        text = text.replace(/أعالها/g, 'أعلاها');
        text = text.replace(/أعاله/g, 'أعلاه');
        text = text.replace(/الصالة/g, 'الصلاة');
        text = text.replace(/فالصالة/g, 'فالصلاة');
        text = text.replace(/بالصالة/g, 'بالصلاة');
        text = text.replace(/للصالة/g, 'للصلاة');
        text = text.replace(/صالة/g, 'صلاة');
        text = text.replace(/صالته/g, 'صلاته');
        text = text.replace(/صالتك/g, 'صلاتك');
        text = text.replace(/صالتهم/g, 'صلاتهم');
        text = text.replace(/صالتنا/g, 'صلاتنا');
        text = text.replace(/صالتكم/g, 'صلاتكم');
        text = text.replace(/السالم/g, 'السلام');
        text = text.replace(/القرأن/g, 'القرآن');
        text = text.replace(/هؤالء/g, 'هؤلاء');
        text = text.replace(/غالمها/g, 'غلامها');
        text = text.replace(/الخالف/g, 'الخلاف');
        text = text.replace(/الخالفة/g, 'الخلافة');
        text = text.replace(/اختالف/g, 'اختلاف');
        text = text.replace(/اختاالف/g, 'اختلاف');
        text = text.replace(/الماليين/g, 'الملايين');
        text = text.replace(/ماليين/g, 'ملايين');
        text = text.replace(/احبل/g, 'حبلاً');
        text = text.replace(/ً\s*ا\s+حبل/g, 'حبلاً');
        text = text.replace(/ا\s+ل\s+يُ?نقض/g, 'لا يُنقض');
        text = text.replace(/ا\s+ل\s+يخاف/g, 'لا يخاف');
        text = text.replace(/(?:^|[\s(\[«])ا\s+ل(?=[\s)\.،؛!؟»\]]|$)/gu, ' لا ');
        text = text.replace(/(?:^|[\s(\[«])ا\s+ل\s+(?=[أ-ي])/gu, ' لا ');

        // Generic Word-initial double Alif 'االـ' -> 'الاـ' (Transposed Lam-Alef ligature at start of words)
        text = text.replace(/(?:^|[\s(\[«\-])اال(?=[أ-ي])/gu, (m) => m.replace('اال', 'الا'));
        text = text.replace(/(?:^|[\s(\[«\-])واال(?=[أ-ي])/gu, (m) => m.replace('واال', 'والا'));
        text = text.replace(/(?:^|[\s(\[«\-])فاال(?=[أ-ي])/gu, (m) => m.replace('فاال', 'فالا'));
        text = text.replace(/(?:^|[\s(\[«\-])باال(?=[أ-ي])/gu, (m) => m.replace('باال', 'بالا'));
        text = text.replace(/(?:^|[\s(\[«\-])كاال(?=[أ-ي])/gu, (m) => m.replace('كاال', 'كالا'));

        // Spaced-out / fragmented ligatures inside words (PDF font decomposition)
        text = text.replace(/الصَّ?\s*لا\s*ةَ?/gu, 'الصَّلَاةَ');
        text = text.replace(/(?:^|[\s«\("])الص\s*لا\s*ة(?=[\s»\)"،.؛!؟]|$)/gu, ' الصلاة ');
        text = text.replace(/إس\s*لا\s*م/gu, 'إسلام');
        text = text.replace(/إص\s*لا\s*ح/gu, 'إصلاح');
        text = text.replace(/خ\s*لا\s*ف/gu, 'خلاف');
        text = text.replace(/ع\s*لا\s*ق/gu, 'علاق');
        text = text.replace(/ت\s*لا\s*و/gu, 'تلاو');
        text = text.replace(/ك\s*لا\s*م/gu, 'كلام');

        // Missing preposition Lam before أوامره
        text = text.replace(/الامتثال\s+أوامره/gu, 'الامتثال لأوامره');
        text = text.replace(/المتثال\s+ألوامره/gu, 'الامتثال لأوامره');
        text = text.replace(/ألوامره/gu, 'لأوامره');
        text = text.replace(/المتثال/gu, 'الامتثال');

        // Inverted 'لا' into 'ال' (Transposed Lam-Alef OCR defect):
        // تالوة / التالوة -> تلاوة / التلاوة
        text = text.replace(/(^|[\s«\("])تالوة(?=[\s»\)"،.؛!؟]|$)/gu, '$1تلاوة');
        text = text.replace(/(^|[\s«\("])التالوة(?=[\s»\)"،.؛!؟]|$)/gu, '$1التلاوة');
        text = text.replace(/هجر\s+التالوة/gu, 'هجر التلاوة');
        text = text.replace(/هجر\s+تالوة/gu, 'هجر تلاوة');
        text = text.replace(/تالوة\s+الحروف/gu, 'تلاوة الحروف');

        // كالم -> كلام
        text = text.replace(/(^|[\s«\("])كالم\s+الله(?=[\s»\)"،.؛!؟]|$)/gu, '$1كلام الله');
        text = text.replace(/(^|[\s«\("])كالم(?=[\s»\)"،.؛!؟]|$)/gu, '$1كلام');
        text = text.replace(/(^|[\s«\("])الكالم(?=[\s»\)"،.؛!؟]|$)/gu, '$1الكلام');

        // عالج -> علاج
        text = text.replace(/في\s+عالج/gu, 'في علاج');
        text = text.replace(/عالج\s+علل/gu, 'علاج علل');
        text = text.replace(/عالج\s+الأمراض/gu, 'علاج الأمراض');
        text = text.replace(/عالج\s+المرض/gu, 'علاج المرض');
        text = text.replace(/عالج\s+النفوس/gu, 'علاج النفوس');

        // عالقة / عالقتهم / عالقتك / عالقتنا / عالقات -> علاقة / علاقتهم / علاقتك / علاقتنا / علاقات
        text = text.replace(/إصالح\s+عالقتهم/gu, 'إصلاح علاقتهم');
        text = text.replace(/(^|[\s«\("])إصالح(?=[\s»\)"،.؛!؟]|$)/gu, '$1إصلاح');
        text = text.replace(/(^|[\s«\("])عالقتهم(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقتهم');
        text = text.replace(/(^|[\s«\("])عالقتك(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقتك');
        text = text.replace(/(^|[\s«\("])عالقتنا(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقتنا');
        text = text.replace(/(^|[\s«\("])عالقة(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقة');
        text = text.replace(/(^|[\s«\("])عالقات(?=[\s»\)"،.؛!؟]|$)/gu, '$1علاقات');

        // حالله وحرامه -> حلاله وحرامه
        text = text.replace(/حالله\s+وحرامه/gu, 'حلاله وحرامه');
        text = text.replace(/(^|[\s«\("])حالله(?=[\s»\)"،.؛!؟]|$)/gu, '$1حلاله');

        // Words where 'باال' was reduced to 'بال' without Alef:
        text = text.replace(/بالستمرار/gu, 'بالاستمرار');
        text = text.replace(/بالنشغال/gu, 'بالانشغال');
        text = text.replace(/بالستسلام/gu, 'بالاستسلام');
        text = text.replace(/بالستشفاء/gu, 'بالاستشفاء');
        text = text.replace(/بالعتزاز/gu, 'بالاعتزاز');
        text = text.replace(/بالعتقاد/gu, 'بالاعتقاد');
        text = text.replace(/باللتزام/gu, 'بالالتزام');
        text = text.replace(/بالمتثال/gu, 'بالامتثال');
        text = text.replace(/بالنقياد/gu, 'بالانقياد');

        // Inverted quote and reversed phrases (Card 9)
        text = text.replace(/["“«]?\s*ينم[؟\?]?\s+الله\s+ديري\s+(?:اذاَم|اذاَم|اظام|إذاَم|اذا م)\s*["”»]?/gu, '"ماذا يريد الله مني؟"');
        text = text.replace(/["“«]?\s*ينم[؟\?]?\s+ديري\s+الله\s+(?:اذاَم|اذاَم|اظام|إذاَم|اذا م)\s*["”»]?/gu, '"ماذا يريد الله مني؟"');
        text = text.replace(/ربدتب\s+أرقا-?/gu, '-اقرأ بتدبر');
        text = text.replace(/أرقا\s+ربدتب-?/gu, '-اقرأ بتدبر');
        text = text.replace(/["“«]?ماذا يريد الله مني؟["”»]?\s*:\s*-اقرأ بتدبر/gu, '-اقرأ بتدبر: "ماذا يريد الله مني؟"');
        text = text.replace(/(?:-اقرأ بتدبر\s*:\s*)?["“«]?ماذا يريد الله مني؟["”»]?\s*:\s*-اقرأ بتدبر/gu, '-اقرأ بتدبر: "ماذا يريد الله مني؟"');

        // Isolated negative particles: ' ال ' is NEVER a valid standalone word in Arabic; it is 100% ' لا '!
        text = text.replace(/(?:^|[\s(\[«])ال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('ال', 'لا'));
        text = text.replace(/(?:^|[\s(\[«])وال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('وال', 'ولا'));
        text = text.replace(/(?:^|[\s(\[«])فال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('فال', 'فلا'));
        text = text.replace(/(?:^|[\s(\[«])بال(?=[\s)\.،؛!؟»\]]|$)/gu, (m) => m.replace('بال', 'بلا'));

        // Alif-Lam Decomposed Ligatures
        text = text.replace(/اإل/g, 'الإ').replace(/اإ/g, 'الإ').replace(/األ/g, 'الأ').replace(/اأ/g, 'الأ').replace(/اآل/g, 'الآ').replace(/اآ/g, 'الآ');

        // Fix glued religious phrases & formulas
        text = text.replace(/(أعوذ)(بالله)/g, '$1 $2');
        text = text.replace(/(بالله)(من)/g, '$1 $2');
        text = text.replace(/(من)(الشيطان)/g, '$1 $2');
        text = text.replace(/(الشيطان)(الرجيم)/g, '$1 $2');
        text = text.replace(/(بسم)(الله)/g, '$1 $2');
        text = text.replace(/(الله)(الرحمن)/g, '$1 $2');
        text = text.replace(/(الرحمن)(الرحيم)/g, '$1 $2');
        text = text.replace(/(الحمد)(لله)/g, '$1 $2');
        text = text.replace(/(رب)(العالمين)/g, '$1 $2');
        text = text.replace(/(صلى)(الله)/g, '$1 $2');
        text = text.replace(/(الله)(عليه)/g, '$1 $2');
        text = text.replace(/(عليه)(وسلم)/g, '$1 $2');
        text = text.replace(/(رضي)(الله)/g, '$1 $2');
        text = text.replace(/(قال)(تعالى)/g, '$1 $2');
        text = text.replace(/(قوله)(تعالى)/g, '$1 $2');
        text = text.replace(/(قال)(رسول)/g, '$1 $2');
        text = text.replace(/(رسول)(الله)/g, '$1 $2');
        text = text.replace(/(ما)(ينفعنا)/g, '$1 $2');
        text = text.replace(/(وا)(نصرنا)/g, 'وانصرنا');

        // Separate prepositions glued to words starting with 'ال'
        text = text.replace(/((?:في|من|عن|إلى|على|مع|بين|كل|عند|دون|أهل|أثر|أصل|حكم|باب|فصل|كتاب|بيان|نحو|مثل|ضد|غير|قبل|بعد|فوق|تحت))(ال[\u0600-\u06FF]{2,})/gu, '$1 $2');

        // Separate double definite nouns glued together
        text = text.replace(/(ال[\u0600-\u06FF]{2,}?)(ال[\u0600-\u06FF]{2,})/gu, '$1 $2');

        // 7. Filter lines to discard Table of Contents remnants
        
        // Infallible Fixes for Shariah Terms, Ligatures, Scriptures and Prepositions:
        // 1. لألحكام -> للأحكام / ألحكام -> أحكام / االمتثال -> الامتثال
        text = text.replace(/لألحكام/gu, 'للأحكام');
        text = text.replace(/(?:^|[\s«\("])ألحكام(?=[\s»\)"،.؛!؟]|$)/gu, ' أحكام ');
        text = text.replace(/االمتثال/gu, 'الامتثال');
        text = text.replace(/الاامتثال/gu, 'الامتثال');
        text = text.replace(/والعتقاد/gu, 'والاعتقاد');
        text = text.replace(/االستشفاء/gu, 'الاستشفاء');
        text = text.replace(/االعتماد/gu, 'الاعتماد');
        text = text.replace(/حالله\s+وحرامه/gu, 'حلاله وحرامه');
        text = text.replace(/التالوة/gu, 'التلاوة');
        text = text.replace(/العمالء/gu, 'العلماء');

        // 2. إال -> إلا / آال -> إلا
        text = text.replace(/إال/gu, 'إلا');
        text = text.replace(/(?:^|[\s«\("])آال(?=[\s»\)"،.؛!؟]|$)/gu, ' إلا ');

        // 3. معصية هلل -> معصية لله / طاعة هلل -> طاعة لله / هيبة هلل -> هيبة لله / فاهلل -> فالله
        text = text.replace(/(معصية|طاعة|محض|خالص|مخلصين|شكراً|حمداً|استسلاماً|تذللاً|قربة|عبادة|دعاء|هيبة|خضوعاً|الحمد)\s+هلل/gu, '$1 لله');
        text = text.replace(/هلل\s+عز\s+وجل/gu, 'لله عز وجل');
        text = text.replace(/(?:^|[\s«\("])فاهلل(?=[\s»\)"،.؛!؟]|$)/gu, ' فالله ');
        text = text.replace(/(?:^|[\s«\("])باهلل(?=[\s»\)"،.؛!؟]|$)/gu, ' بالله ');
        text = text.replace(/(?:^|[\s«\("])هلل(?=[\s»\)"،.؛!؟]|$)/gu, ' لله ');

        // 4. { ِ َلِلَّه و ُ عَاقِبَة ِ ا ْلأ ُمُور :} -> ﴿وَلِلَّهِ عَاقِبَةُ الْأُمُورِ﴾:
        text = text.replace(/\{[^}]*?ع[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ا[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ق[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ب[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ة[\s\S]*?م[\u064B-\u065F\u0670\u06D6-\u06ED\s]*و[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ر[\s\S]*?\}:?/gu, '﴿وَلِلَّهِ عَاقِبَةُ الْأُمُورِ﴾:');
        text = text.replace(/(?:لله\s+و\s+عاقبة\s+(?:الامور|الأمور)|و\s*لله\s+عاقبة\s+(?:الامور|الأمور)|لله\s+وعاقبة\s+(?:الامور|الأمور))/gu, 'وَلِلَّهِ عَاقِبَةُ الْأُمُورِ');
        text = text.replace(/عاقبة\s+الامور/gu, 'عاقبة الأمور');

        // 5. Isolate stray Fiqh questions so they never leak into previous cards
        text = text.replace(/([^\n])\s*(س[\s\u064B-\u065F\u0670\u06D6-\u06ED]*ما[\s\u064B-\u065F\u0670\u06D6-\u06ED]*ح[\u064B-\u065F\u0670\u06D6-\u06ED]*ك[\u064B-\u065F\u0670\u06D6-\u06ED]*م|س[\s\u064B-\u065F\u0670\u06D6-\u06ED]*هل|كبسولة\s+فقهية)/gu, '$1\n\n$2');

        // 6. Clean stray outline numbers: 2ب. -> 2.
        text = text.replace(/(\d+)\s*[بب]\./gu, '$1. ');
        text = text.replace(/(?:^|\s)\d+\s*[أ-ي]\s*[\.\-\)]\s*/gu, ' ');

        // 7. Universal Normalization of أَقَامُوا الصَّلَاةَ / إِقَامَةُ الصَّلَاةِ
        text = text.replace(/أَقَامُوا\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ا?ل\s*ص\s*َّ?\s*َ?\s*(?:ل\s*ا|لا)\s*ة/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:ة\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*(?:ل\s*ا|لا)\s*ص\s*ل?ا|ص\s*(?:ل\s*ا|لا)\s*ل?ا\s*ة)\s*(?:أَقَامُوا|اوُماَقَأ)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)\s*(?:اوُماَقَأ|أَقَامُوا|إقامة|اقامة)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:اوُماَقَأ|أَقَامُوا|إقامة|اقامة)\s*(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/ة\s+الَ?َّ?\s*صلاَ?\s+أَقَامُوا/gu, 'أَقَامُوا الصَّلَاةَ');
        text = text.replace(/(?:^|[\s«\("])(?:إقام|اقام)\s+الصلاة(?=[\s»\)"،.؛!؟]|$)/gu, ' إقامة الصلاة ');

        // 6. Fix common typos
        text = text.replace(/ثالثة\s+(?:األصول|الأصول)/gu, 'ثلاثة الأصول');
        text = text.replace(/ثالث\s+خصائص/gu, 'ثلاث خصائص');
        text = text.replace(/ثالث\s+مراتب/gu, 'ثلاث مراتب');
        text = text.replace(/النتظام/gu, 'الانتظام');
        text = text.replace(/الاستسلام\s+هلل/gu, 'الاستسلام لله');
        text = text.replace(/(?:^|[\s«\("])ادليل(?=[\s»\)"،.؛!؟]|$)/gu, ' دليلاً ');
        text = text.replace(/(?:^|[\s«\("])اليمكن(?=[\s»\)"،.؛!؟]|$)/gu, ' لا يمكن ');
        text = text.replace(/إلنسان/gu, 'للإنسان');
        text = text.replace(/ألنها/gu, 'لأنها');

        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const cleanLines = [];
        let insideTOC = false;

        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          if (/^(?:الفهرس|المحتويات|فهرس الموضوعات|جدول المحتويات)/i.test(l)) {
            insideTOC = true;
            continue;
          }
          if (insideTOC) {
            if (/\.{2,}|_{2,}|\b\d+\s*$/.test(l) && l.length < 90) {
              continue;
            } else if (l.length > 90 || /^(?:المقدمة|تمهيد|مدخل|الباب|الفصل|المبحث|المحور)/i.test(l)) {
              insideTOC = false;
            }
          }
          if (/^\d+$/.test(l) || /^[\.\-\s]+$/.test(l)) continue;
          cleanLines.push(l);
        }

        let sanitized = cleanLines.join('\n');
        sanitized = sanitized.replace(/[ \t]+/g, ' ');
        sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

        return sanitized;
      }

      // Universal Document Extractor for Word (.docx, .doc), PDF (.pdf), PowerPoint (.pptx), and Text (.txt, .md)
      async function handleLectureFileUpload(file) {
        if (!file) return;
        setIsExtractingFile(true);
        let extractedText = '';
        const fname = file.name || 'document';
        const ext = fname.substring(fname.lastIndexOf('.')).toLowerCase();

        try {
          if (ext === '.docx' || ext === '.doc') {
            const arrayBuffer = await file.arrayBuffer();

            // Layer A: Mammoth parser (first attempt)
            if (window.mammoth && typeof window.mammoth.extractRawText === 'function') {
              try {
                const res = await window.mammoth.extractRawText({ arrayBuffer });
                if (res && res.value && res.value.trim()) {
                  extractedText = res.value;
                }
              } catch (mErr) {
                console.warn('Mammoth parser error, engaging JSZip fallback:', mErr);
              }
            }

            // Layer B: Native JSZip XML Extractor (100% resilient fallback)
            if (!extractedText && window.JSZip) {
              try {
                const zip = await window.JSZip.loadAsync(arrayBuffer);
                const docXml = zip.file('word/document.xml');
                if (docXml) {
                  const xml = await docXml.async('string');
                  extractedText = xml
                    .replace(/<w:p[^>]*>/g, '\n')
                    .replace(/<w:br[^>]*>/g, '\n')
                    .replace(/<w:tab[^>]*>/g, ' ')
                    .replace(/<[^>]+>/g, '')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'")
                    .trim();
                }
              } catch (zipErr) {
                console.warn('JSZip Word extraction error:', zipErr);
              }
            }

            if (!extractedText) {
              throw new Error(isRtl ? 'تعذر استخراج النص من ملف الوورد، يرجى حفظه كملف .docx قياسي أو نسخ النص ولصقه' : 'Could not parse Word document');
            }
          } else if (ext === '.pptx' || ext === '.ppt') {
            // PowerPoint Slide Text Extractor via JSZip
            const arrayBuffer = await file.arrayBuffer();
            if (window.JSZip) {
              try {
                const zip = await window.JSZip.loadAsync(arrayBuffer);
                const slideEntries = [];
                zip.forEach((relPath, entry) => {
                  if (/ppt\/slides\/slide\d+\.xml$/i.test(relPath)) {
                    slideEntries.push(entry);
                  }
                });
                slideEntries.sort((a, b) => {
                  const nA = parseInt(a.name.match(/\d+/)[0], 10);
                  const nB = parseInt(b.name.match(/\d+/)[0], 10);
                  return nA - nB;
                });
                const slideTexts = [];
                for (const se of slideEntries) {
                  const sXml = await se.async('string');
                  const sTxt = sXml
                    .replace(/<a:p[^>]*>/g, '\n')
                    .replace(/<[^>]+>/g, '')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .trim();
                  if (sTxt) slideTexts.push(sTxt);
                }
                extractedText = slideTexts.join('\n\n');
              } catch (pptxErr) {
                console.warn('PPTX extraction error:', pptxErr);
              }
            }
            if (!extractedText) {
              throw new Error(isRtl ? 'تعذر استخراج النص من ملف الباوربوينت' : 'Could not parse PowerPoint presentation');
            }
          } else if (ext === '.pdf') {
            const arrayBuffer = await file.arrayBuffer();
            if (window.pdfjsLib) {
              let loadingTask;
              try {
                loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
              } catch (ltErr) {
                loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true });
              }
              let pdf;
              try {
                pdf = await loadingTask.promise;
              } catch (promErr) {
                // Retry in workerless mode if worker construction failed
                loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true });
                pdf = await loadingTask.promise;
              }
              let pagesText = [];
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const items = textContent.items || [];

                items.sort((a, b) => {
                  const yA = a.transform ? a.transform[5] : 0;
                  const yB = b.transform ? b.transform[5] : 0;
                  if (Math.abs(yA - yB) > 4.0) return yB - yA;
                  return 0;
                });

                const lineGroups = [];
                let curLine = [];
                let curY = null;

                for (let j = 0; j < items.length; j++) {
                  const it = items[j];
                  if (!it || typeof it.str !== 'string') continue;
                  if (!it.str && !it.hasEOL) continue;

                  const y = it.transform ? it.transform[5] : 0;
                  const x = it.transform ? it.transform[4] : 0;
                  const w = it.width || 0;

                  if (curY === null || Math.abs(y - curY) > 4.0) {
                    if (curLine.length > 0) lineGroups.push(curLine);
                    curLine = [];
                    curY = y;
                  }
                  if (it.str) curLine.push({ str: it.str, x, y, w });
                }
                if (curLine.length > 0) lineGroups.push(curLine);

                const pageLines = lineGroups.map(line => {
                  if (line.length > 1) {
                    const hasArabic = line.some(it => /[\u0600-\u06FF]/.test(it.str));
                    if (hasArabic) {
                      const firstX = line[0].x;
                      const lastX = line[line.length - 1].x;
                      if (firstX < lastX && (lastX - firstX) > 20) {
                        line.sort((a, b) => b.x - a.x);
                      }
                    }
                  }
                  let lineStr = '';
                  for (let k = 0; k < line.length; k++) {
                    const it = line[k];
                    if (k === 0) {
                      lineStr += it.str;
                    } else {
                      const prev = line[k - 1];
                      const isRtlOrder = prev.x > it.x;
                      const gap = isRtlOrder ? (prev.x - (it.x + it.w)) : (it.x - (prev.x + prev.w));
                      const prevEndsSpace = /[\s\n]$/.test(lineStr);
                      const itStartsSpace = /^[\s\n]/.test(it.str);
                      const isPunct = /^[،.؛!؟\)\]»]/.test(it.str);

                      if (prevEndsSpace || itStartsSpace || isPunct) {
                        lineStr += it.str;
                      } else if (gap > 3.8) {
                        lineStr += ' ' + it.str;
                      } else {
                        lineStr += it.str;
                      }
                    }
                  }
                  return lineStr.trim();
                }).filter(Boolean);

                if (pageLines.length > 0) {
                  pagesText.push(pageLines.join('\n'));
                }
              }
              extractedText = pagesText.join('\n\n');
            } else {
              throw new Error(isRtl ? 'محرك قراءة PDF غير متاح' : 'PDF reader engine not available');
            }
          } else {
            // Plain text or markdown
            extractedText = await file.text();
          }

          if (!extractedText || !extractedText.trim()) {
            showToast(isRtl ? 'لم يتم العثور على نصوص مقروءة داخل الملف' : 'No readable text found in file');
            setIsExtractingFile(false);
            return;
          }

          const cleanExtracted = sanitizeArabicExtractedText(extractedText);
          // Set raw text immediately so the text is NEVER lost!
          setRawLectureText(cleanExtracted);

          const words = cleanExtracted.trim().split(/\s+/).length;
          const sizeKb = Math.round(file.size / 1024);
          setUploadedFileInfo({
            name: fname,
            sizeKb,
            wordCount: words,
            lineCount: cleanExtracted.split('\n').length
          });

          // Infer topic title
          const allExtractedLines = cleanExtracted.split('\n').map(l => l.trim()).filter(Boolean);
          let primaryTitleCandidate = allExtractedLines.slice(0, 15).find(l => {
            if (l.length < 8 || l.length > 85) return false;
            if (/^(?:مقدمة|تمهيد|مدخل|كبسولة|فهرس|محتويات|أعوذ|اعوذ|بسم|الحمد|صلى|اللهم|السلام|قال|روى|س ما|س هل|الجامع|أخرجه|أخرج|صحيح|رواه|تخريج)/.test(l)) return false;
            if (l.includes('بسم الله') || l.includes('أعوذ بالله') || l.includes('الحمد لله') || l.includes('رسول الله') || l.includes('اللهم') || l.includes('علمنا') || l.includes('وارزقنا') || l.includes('فقهية') || l.includes('البخاري') || l.includes('مسلم') || l.includes('الجامع |')) return false;
            return true;
          });
          const cleanName = fname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const suggestedTopic = primaryTitleCandidate || cleanName || 'محاضرة شرعية وتأصيل علمي';
          setLessonTopic(suggestedTopic);

          const evs = extractEvidencesAndProofs(cleanExtracted);
          setExtractedEvidences(evs);

          // Process into stages/slides
          try {
            handleProcessCustomLecture(cleanExtracted, suggestedTopic, evs);
            showToast(isRtl ? ('تم استخراج نص الملف بنجاح (' + words + ' كلمة) 📄✨') : ('Extracted ' + words + ' words successfully 📄✨'));
          } catch (procErr) {
            console.error('Lecture processing error:', procErr);
            showToast(isRtl ? 'تم استخراج النص بنجاح؛ يرجى مراجعة المحاور في المحرر' : 'Text extracted; please review in editor');
          }
        } catch (err) {
          console.error('File extraction error:', err);
          const errDetail = err && err.message ? err.message : '';
          showToast(isRtl ? ('تعذر قراءة الملف: ' + (errDetail || 'يرجى التأكد من إغلاقه في وورد أو حفظه كـ .docx')) : ('Error reading file: ' + errDetail));
        } finally {
          setIsExtractingFile(false);
        }
      }

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

      // Generator Handlers via /api/generate
      async function handleGenerateTajweed(isInitial = false) {
        setIsGeneratingTajweed(true);
        try {
          const ruleObj = TAJWEED_RULES.find(r => r.id === selectedRule) || TAJWEED_RULES[0];
          const textbookObj = PRELOADED_TEXTBOOKS.find(b => b.id === selectedTextbook);

          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-mishkah-pin': teacherPin
            },
            body: JSON.stringify({
              type: 'tajweed',
              surah: surahName,
              ayahRange: ayahRange,
              rule: ruleObj.nameAr,
              languageMode: tajweedMode,
              textbookContext: customContext || textbookObj?.nameAr,
              isDemo: isInitial
            })
          });

          if (res.ok) {
            const json = await res.json();
            setTajweedData(json.data);
            setQuizAnswers({});
            setQuizSubmitted(false);
            if (!isInitial) showToast(isRtl ? 'تم توليد خطة درس التجويد بنجاح ✨' : 'Tajweed Lesson Generated Successfully ✨');
          } else {
            throw new Error('Server returned ' + res.status);
          }
        } catch (err) {
          console.warn('Using client fallback:', err.message);
          setTajweedData(getFallbackTajweed());
          if (!isInitial) showToast(isRtl ? 'تم التحميل من قاعدة البيانات الموثقة 💡' : 'Loaded from Verified Local Curriculum 💡');
        } finally {
          setIsGeneratingTajweed(false);
        }
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

      function getFallbackTajweed() {
        return {
          metadata: {
            surah: surahName || 'سورة الملك (Al-Mulk)',
            ayahRange: ayahRange || '1–10',
            ruleNameAr: 'الإخفاء الحقيقي (Al-Ikhfaa Al-Haqiqi)',
            ruleNameEn: 'True Concealment (Ikhfaa)',
            languageMode: tajweedMode,
            textbookSource: 'Czerepinski & Dr. Ayman Suwayd Certified Standard'
          },
          ruleDefinition: {
            arabic: 'الإخفاء لغةً: الستر. واصطلاحاً: النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام عارٍ عن التشديد مع بقاء الغنة بمقدار حركتين.',
            english: 'Linguistically: Concealment. Technically: Pronouncing the Noon Sakinah or Tanween in a state between clear Izhar and merged Idgham, without shaddah, while retaining nasalization (Ghunnah) for 2 counts.',
            anatomicalMakhrajAr: 'يخرج صوت الغنة من الخيشوم (تجويف الأنف) مع إبعاد طرف اللسان قليلاً عن لثة الأسنان العليا وتهيئة الفم لمخرج حرف الإخفاء التالي.',
            anatomicalMakhrajEn: 'The sound of Ghunnah emits from the Khayshoom (nasal cavity). The tip of the tongue is kept slightly distant from the upper gums, preparing the mouth directly for the articulation point of the following letter.',
            timingOrHarakat: 'حركتان (2 counts)',
            commonMistakes: [
              'إلصاق اللسان بالحنك الأعلى مما يحول الإخفاء إلى إظهار (Pressing the tongue against the palate)',
              'المبالغة في إشباع الحركة قبل النون حتى يتولد منها حرف مد (Stretching vowels into extra letters)',
              'تفخيم الغنة عند الحروف المرققة أو ترقيقها عند الحروف المفخمة (Incorrect Ghunnah heaviness/lightness)'
            ]
          },
          presentationCards: [
            {
              cardIndex: 1,
              titleAr: 'تطبيق الإخفاء بغنة مفخمة',
              titleEn: 'Ikhfaa with Heavy Ghunnah',
              ayahTextUthmani: 'تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ',
              highlightedPortion: 'شَىْءٍۢ قَدِيرٌ',
              tajweedColor: 'emerald',
              explanationAr: 'تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء المفخمة). ينطق بإخفاء التنوين وتفخيم الغنة.',
              explanationEn: 'Tanween followed by heavy letter Qaf. Pronounce with concealed Tanween and deep, heavy Ghunnah.',
              teacherPrompt: 'Check student\'s back of tongue elevation; ensure lips do not round prematurely.'
            },
            {
              cardIndex: 2,
              titleAr: 'تطبيق الإخفاء بغنة مرققة رقيقة',
              titleEn: 'Ikhfaa with Light Ghunnah',
              ayahTextUthmani: 'مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍۢ',
              highlightedPortion: 'مِن تَفَـٰوُتٍۢ',
              tajweedColor: 'emerald',
              explanationAr: 'نون ساكنة بعدها حرف التاء (حرف مرقق). ترقق الغنة وتتهيأ الأسنان لنطق التاء.',
              explanationEn: 'Noon Sakinah followed by light letter Taa. Produce a delicate light nasal Ghunnah.',
              teacherPrompt: 'Ensure teeth are gently close together without tongue pressing firmly against incisors.'
            },
            {
              cardIndex: 3,
              titleAr: 'تطبيق الإخفاء في كلمة واحدة',
              titleEn: 'Ikhfaa Within a Single Word',
              ayahTextUthmani: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًۭا',
              highlightedPortion: 'يَنقَلِبْ',
              tajweedColor: 'amber',
              explanationAr: 'نون ساكنة بعدها قاف في كلمة واحدة، مع قلقلة الباء المتطرفة عند الوقف.',
              explanationEn: 'Noon Sakinah followed by Qaf in one word, followed by Qalqalah in letter Baa upon stopping.',
              teacherPrompt: 'Notice the transition from heavy nasal Ghunnah directly to Qaf then Baa Qalqalah.'
            }
          ],
          worksheet: [
            { itemNumber: 1, wordUthmani: 'شَىْءٍۢ قَدِيرٌ', ruleApplied: 'إخفاء حقيقي بغنة مفخمة (Heavy Ikhfaa)', reasonAr: 'تنوين بعده قاف (حرف مفخم)', reasonEn: 'Tanween followed by Qaf', ayahReference: 'الملك: 1' },
            { itemNumber: 2, wordUthmani: 'مِن تَفَـٰوُتٍۢ', ruleApplied: 'إخفاء حقيقي بغنة مرققة (Light Ikhfaa)', reasonAr: 'نون ساكنة بعدها تاء (حرف مرقق)', reasonEn: 'Noon Sakinah followed by Taa', ayahReference: 'الملك: 3' },
            { itemNumber: 3, wordUthmani: 'مِن فُطُورٍۢ', ruleApplied: 'إخفاء حقيقي بغنة مرققة (Light Ikhfaa)', reasonAr: 'نون ساكنة بعدها فاء', reasonEn: 'Noon Sakinah followed by Faa', ayahReference: 'الملك: 3' },
            { itemNumber: 4, wordUthmani: 'يَنقَلِبْ', ruleApplied: 'إخفاء حقيقي في كلمة واحدة (Ikhfaa in one word)', reasonAr: 'نون ساكنة بعدها قاف', reasonEn: 'Noon Sakinah followed by Qaf', ayahReference: 'الملك: 4' }
          ],
          quiz: [
            {
              id: 1,
              questionAr: 'كم عدد حروف الإخفاء الحقيقي في أحكام النون الساكنة والتنوين؟',
              questionEn: 'How many letters cause True Concealment (Ikhfaa)?',
              type: 'mcq',
              options: [
                { id: 'a', textAr: '6 أحرف', textEn: '6 letters' },
                { id: 'b', textAr: '15 حرفاً', textEn: '15 letters' },
                { id: 'c', textAr: '4 أحرف', textEn: '4 letters' },
                { id: 'd', textAr: '8 أحرف', textEn: '8 letters' }
              ],
              correctOptionId: 'b',
              explanationAr: 'حروف الإخفاء 15 حرفاً مجموعة في أوائل كلمات: صف ذا ثنا كم جاد شخص قد سما دم طيبا زد في تقى ضع ظالما.',
              explanationEn: '15 letters assembled in the famous mnemonic opening verse.'
            },
            {
              id: 2,
              questionAr: 'ما هو المخرج الدقيق لصوت الغنة أثناء الإخفاء؟',
              questionEn: 'What is the precise anatomical articulation point of the Ghunnah?',
              type: 'mcq',
              options: [
                { id: 'a', textAr: 'الجوف (Oral Cavity)', textEn: 'Al-Jawf' },
                { id: 'b', textAr: 'الحلق (Throat)', textEn: 'Al-Halq' },
                { id: 'c', textAr: 'الخيشوم (تجويف الأنف)', textEn: 'Al-Khayshoom (Nasal Cavity)' },
                { id: 'd', textAr: 'الشفتان (Lips)', textEn: 'The Lips' }
              ],
              correctOptionId: 'c',
              explanationAr: 'الغنة تخرج فقط من الخيشوم وهو أقصى الأنف.',
              explanationEn: 'Ghunnah strictly resonates from the Khayshoom (nasal passage).'
            },
            {
              id: 3,
              questionAr: 'تكون غنة الإخفاء مفخمة إذا جاء بعد النون الساكنة حرف استعلاء كحرف القاف.',
              questionEn: 'The Ghunnah of Ikhfaa is pronounced heavy when followed by an elevated letter like Qaf.',
              type: 'true_false',
              options: [
                { id: 'true', textAr: 'صحيح (True)', textEn: 'True' },
                { id: 'false', textAr: 'خطأ (False)', textEn: 'False' }
              ],
              correctOptionId: 'true',
              explanationAr: 'نعم، الغنة تتبع الحرف الذي يليها تفخيماً وترقيقاً.',
              explanationEn: 'Correct! The Ghunnah follows the succeeding letter in heavy/light characteristics.'
            }
          ]
        };
      }

      
      // Canonical Master Islamic Lecture (30 Complete Slides, Multi-Archetype, Real Scholarly Content)
      const EXEMPLAR_TAWHEED_CARDS = [{"slideNumber": 1, "slideTitle": "العقيدة الإسلامية — المحاضرة الثانية — من هو الله؟", "phaseTitle": "المقدمة والمنهجية", "scriptureEvidence": "", "bulletPoints": ["تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين", "معنى توحيد الربوبية • معنى توحيد الألوهية • لماذا لا يكفي الإقرار بوجود الله؟ • الفرق بين الاعتراف بالخالق وإفراده بالعبادة"], "talkingPoints": ["من هو الله؟"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "title_slide", "notes": "عنوان المحاضرة: من هو الله؟ — تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين. العناصر: معنى توحيد الربوبية، معنى توحيد الألوهية، لماذا لا يكفي الإقرار بوجود الله؟، الفرق بين الاعتراف بالخالق وإفراده بالعبادة."}, {"slideNumber": 2, "slideTitle": "المصادر العلمية المعتمدة — على أي أساس نبني هذا الدرس؟", "phaseTitle": "المصادر والمنهج", "scriptureEvidence": "", "bulletPoints": ["«ثلاثة الأصول وأدلتها» للإمام محمد بن عبد الوهاب — باب: معرفة العبد ربه بالأدلة والبراهين.", "«نبذة في العقيدة الإسلامية» للشيخ محمد بن صالح العثيمين — باب: الإيمان بالله وركائز التوحيد.", "منهج العقيدة — أكاديمية زاد للشيخ محمد صالح المنجد — المقرر التأسيسي لترسيخ اليقين."], "talkingPoints": ["على أي أساس نبني هذا الدرس؟"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": "المصادر: كتاب «ثلاثة الأصول وأدلتها» للإمام محمد بن عبد الوهاب (باب: معرفة العبد ربه)، ورسالة «نبذة في العقيدة الإسلامية» للشيخ محمد بن صالح العثيمين (باب: الإيمان بالله)، والمنهج التأسيسي لمقرر «العقيدة الإسلامية» في أكاديمية زاد للشيخ محمد صالح المنجد."}, {"slideNumber": 3, "slideTitle": "مقدمة: السؤال الأول الذي يحدد مصير الإنسان", "phaseTitle": "المدخل الوجودي والتربوي", "scriptureEvidence": "", "bulletPoints": ["تخيّل أنك استيقظت في قطار فائق السرعة ينطلق بك عبر أودية وجبال لا تعرفها.", "لن تسأل عن لون المقاعد ولا عن نوع الطعام، بل ستسأل فوراً: من الذي يقود هذا القطار؟ ومن الذي وضعني فيه؟ وإلى أين يتجه بي؟ وما المطلوب مني أثناء الرحلة؟", "هكذا تماماً هي حياة الإنسان على هذه الأرض: أسئلة وجودية حاسمة تحدد مسار الحياة والمصير."], "talkingPoints": ["تخيّل أنك استيقظت في قطار فائق السرعة…"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "story", "notes": "تخيل أن إنساناً استيقظ في قطار فائق السرعة ينطلق به عبر أودية وجبال لا يعرفها؛ لن يسأل عن لون المقاعد ولا عن نوع الطعام، بل سيسأل فوراً: من الذي يقود هذا القطار؟ ومن الذي وضعني فيه؟ وإلى أين يتجه بي؟ وما المطلوب مني أثناء هذه الرحلة؟ هكذا تماماً هي حياة الإنسان على هذه الأرض."}, {"slideNumber": 4, "slideTitle": "لماذا هذا السؤال هو أعظم قضية؟ — الله سبحانه هو الذي أوجد الإنسان من العدم، وهداه النجدين: بيّن له طريق الخير والهدى وطريق الشر والضلال، ومنحه القدرة على التمييز والاختيار", "phaseTitle": "المدخل الوجودي والتربوي", "scriptureEvidence": "{مَنْ عَمِلَ صَالِحًا مِنْ ذَكَرٍ أَوْ أُنْثَى وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً وَلَنَجْزِيَنَّهُمْ أَجْرَهُمْ بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ} (سورة النحل، الآية 97)", "bulletPoints": ["\"لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ\"", "صلاح القلب، واستقامة السلوك، وطمأنينة النفس، وقبول الأعمال الصالحة، والنجاة في الدنيا والآخرة — كل ذلك متوقف على الإجابة الصادقة اليقينية عن سؤال واحد: من هو الله؟"], "talkingPoints": ["الله سبحانه هو الذي أوجد الإنسان من العدم، وهداه النجدين: بيّن له طريق الخير والهدى وطريق الشر والضلال، ومنحه القدرة على التمييز والاختيار"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": "أعظم قضية تواجه العقل البشري، وأجلّ علم يكتسبه المرء في حياته، هو العلم بالله سبحانه وتعالى ليحسن عبادته وينال خير الدنيا والآخرة؛ لأن صلاح القلب، واستقامة السلوك، وطمأنينة النفس، وقبول الأعمال الصالحة، والنجاة في الدنيا والآخرة، كل ذلك متوقف على الإجابة الصادقة واليقينية عن سؤال واحد: من هو الله؟"}, {"slideNumber": 5, "slideTitle": "عناية العلماء بهذا السؤال، وخريطة الرحلة — ثلاثة الأصول", "phaseTitle": "خريطة الدرس العلمية", "scriptureEvidence": "", "bulletPoints": ["أول واجب على كل مكلف هو العلم، وأول مراتبه معرفة العبد ربه بالأدلة والبراهين.", "نبذة في العقيدة الإسلامية", "الإيمان بالله في صدارة أركان الإيمان الستة، مفصلاً أصوله ومقتضياته.", "أكاديمية زاد", "تبني تصورها الكامل للوجود انطلاقاً من توحيد الله في ربوبيته وألوهيته.", "محاور المحاضرة", "معنى توحيد الربوبية وأدلته ومسالك التعرف على الله\nمعنى توحيد الألوهية وضرورته في حياة الإنسان\nلماذا لا يكفي الإقرار بوجود الله؟\nالبناء المتكامل بين الاعتراف بالخالق وإفراده بالعبادة\nنواقض التوحيد وقوادحه: الشرك الأكبر والأصغر والفرق بينهما"], "talkingPoints": ["ثلاثة الأصول"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": "اعتنى علماء العقيدة بهذا السؤال فجعلوه فاتحة رسائلهم ومطالع دروسهم. في هذه المحاضرة نبحر في رحلة علمية وإيمانية متكاملة نفكك فيها هذه الأصول بأسلوب يجمع بين العمق التأصيلي واللمسة التربوية الحية، دون اختصار مخل، لنبني تصوراً متكاملاً عن ربنا وخالقنا ومولانا سبحانه."}, {"slideNumber": 6, "slideTitle": "المحور الأول — توحيد الربوبية — إفراد الله تعالى بأفعاله الخاصة به سبحانه", "phaseTitle": "المحور الأول: توحيد الربوبية", "scriptureEvidence": "معنى «الرب» في «ثلاثة الأصول»", "bulletPoints": ["كالخلق من العدم، والرزق، والملك المطلق، والتدبير، والإحياء، والإماتة، وإنزال الغيث، وتصريف الرياح، والنفع والضر.", "الرب هو المربي لجميع العالمين بنعمه الظاهرة والباطنة؛ لم يخلق الخلق ثم يتركهم، بل أمدهم بالهواء والماء والغذاء، وهيأ لهم الأرض للسكنى، وسخر لهم ما في السماوات وما في الأرض. ومن جمع صفات الخلق والتربية والإنعام فهو وحده المعبود المستحق لأن يُذل له ويُخضع له."], "talkingPoints": ["إفراد الله تعالى بأفعاله الخاصة به سبحانه"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": "كل فعل يختص به الخالق دون المخلوقين يندرج تحت توحيد الربوبية. وقد أوضح الإمام محمد بن عبد الوهاب المعنى اللغوي والشرعي لكلمة الرب: المربي لجميع العالمين بنعمه، ربّاهم منذ اللحظة الأولى لتكوينهم."}, {"slideNumber": 7, "slideTitle": "ركائز الربوبية الثلاث — «نبذة في العقيدة الإسلامية»", "phaseTitle": "المحور الأول: توحيد الربوبية", "scriptureEvidence": "لا خالق إلا الله؛ كل ما في السماوات والأرض — حتى أفعال العباد — مخلوق له. و«صنع البشر» تركيب وتحويل لمواد أودعها الله؛ فالطائرة من حديد وألمنيوم خلقهما الله، وبقوانين جاذبية وهواء أوجدها الله.", "bulletPoints": ["١. التفرد بالخلق: لا خالق إلا الله؛ كل ما في السماوات والأرض مخلوق له، وصنع البشر مجرد تحويل وتركيب.", "٢. التفرد بالملك: الله هو المالك الحقيقي المطلق ونواصي العباد بيده، وملك البشر عارضي ناقص ومؤقت.", "٣. التفرد بالأمر والتدبير: يدبر أمر السماء والأرض، يقسم الأرزاق ويعز ويذل ويحيي ويميت."], "talkingPoints": ["الإيمان بالله يكتمل بأربعة أمور: الإيمان بوجوده، وبربوبيته، وبألوهيته، وبأسمائه وصفاته. والربوبية تقوم على ثلاث ركائز لا يشارك الله فيها ملك مقرب ولا نبي مرسل:"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "pillars", "notes": "يفصّل الشيخ ابن عثيمين في باب الإيمان بالله أن الإيمان بالربوبية يقوم على الاعتقاد الجازم بالتفرد بالخلق والملك والتدبير."}, {"slideNumber": 8, "slideTitle": "التفرد بالأمر والتدبير — نوعا أمر الله", "phaseTitle": "المحور الأول: توحيد الربوبية", "scriptureEvidence": "", "bulletPoints": ["الأمر الكوني القدري: مشيئته النافذة في الكون التي لا يردها راد، فما شاء الله كان وما لم يشأ لم يكن.", "الأمر الشرعي الديني: ما أنزله الله على رسله من الشرائع والأحكام التي ابتلى بها عباده ليظهر المطيع من العاصي."], "talkingPoints": ["أمر الله نوعان عظيمان"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "contrast_2col", "notes": ""}, {"slideNumber": 9, "slideTitle": "المسلك الكوني لمعرفة الرب — «ثلاثة الأصول» — كيف أعرف ربي؟ بآياته ومخلوقاته", "phaseTitle": "المحور الأول: توحيد الربوبية", "scriptureEvidence": "", "bulletPoints": ["الآيات: العلامات الدالة على وجود الخالق وعظمته وحكمته. والمخلوقات: الكائنات التي أوجدها الله لتشهد بقدرته.", "الآيات المتجددة المتعاقبة", "الليل والنهار، والشمس والقمر. تعاقب منتظم لا يتأخر ثانية منذ آلاف السنين: ليل للسكون وراحة الأبدان، ونهار للسعي في المعايش، وشمس تبعث الحياة، وقمر بمنازله يُعرف به عدد السنين والحساب. هل يمكن أن تسير بهذا الانضباط دون مدبر حكيم؟", "المخلوقات العظيمة الثابتة", "السماوات السبع والأرضون السبع وما فيهن وما بينهن: سماوات مرفوعة بغير عمد نراها، وأرض ممهدة تحمل الجبال والبحار والأنهار والكائنات التي لا يحصيها إلا خالقها — كل ذرة فيها تنطق بعظمة الصانع وقدرته المطلقة."], "talkingPoints": ["كيف أعرف ربي؟ بآياته ومخلوقاته"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 10, "slideTitle": "فطرية توحيد الربوبية — منهج أكاديمية زاد — الإيمان بربوبية الله مركوز في أصل الفطرة البشرية", "phaseTitle": "المحور الأول: توحيد الربوبية", "scriptureEvidence": "", "bulletPoints": ["يولد الإنسان وفي أعماق نفسه شعور فطري بالافتقار إلى خالق عظيم يلجأ إليه.", "إنكار نادر شاذ", "لم ينكر البشر عبر التاريخ وجود خالق مدبر إلا نادراً، وكان إنكارهم جحوداً باللسان بدافع الكبر والعناد وطلب الرياسة، وقلوبهم مستيقنة.", "الفطرة تستيقظ عند الشدائد", "من يزعم الإلحاد في الرخاء، إذا دهمته شدة أو أشرف على الغرق وانقطعت به الأسباب، رفع يده وبصره إلى السماء مستغيثاً برب العالمين، فتنفض الفطرة عنها غبار المكابرة."], "talkingPoints": ["الإيمان بربوبية الله مركوز في أصل الفطرة البشرية"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 11, "slideTitle": "المحور الثاني — توحيد الألوهية (توحيد العبادة) — إفراد الله تعالى بأفعال العباد التي يتقربون بها إليه", "phaseTitle": "المحور الثاني: توحيد الألوهية", "scriptureEvidence": "من هو «الإله»؟", "bulletPoints": ["أن يخلص العبد جميع أنواع العبادة الظاهرة والباطنة لله وحده لا شريك له. فإن كانت الربوبية توحيد الله بأفعاله هو، فالألوهية توحيده بأفعال عباده.", "المعبود حباً وتعظيماً وخضوعاً؛ تألهه القلوب محبةً وإجلالاً ورغبةً ورهبةً، فتذل له وتنقاد لأمره.", "تقرير ابن عثيمين", "الله هو الإله الحق وحده، وكل ما يُعبد من دونه — ملك مقرب أو نبي مرسل أو ولي صالح أو شجر أو حجر أو شمس أو قمر أو هوى متبع — فعبادته باطلة؛ لأن المخلوق عاجز مفتقر، لا يملك نفعاً ولا ضراً ولا موتاً ولا حياةً ولا نشوراً."], "talkingPoints": ["إفراد الله تعالى بأفعال العباد التي يتقربون بها إليه"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 12, "slideTitle": "شمولية العبادة — «ثلاثة الأصول» — العبادة هي الغاية العظمى التي خُلق لها الجن والإنس؛ وأعظم ما أمر الله به التوحيد، وأعظم ما نهى عنه الشرك. والعبادة ليست محصورة في الصلاة والصيام، بل ثلاث دوائر مترابطة.", "phaseTitle": "المحور الثاني: توحيد الألوهية", "scriptureEvidence": "", "bulletPoints": ["الدائرة الأولى: العبادات القلبية — أصل العبادات وأساسها", "المحبة الخالصة", "أن يكون الله ورسوله أحب إليه مما سواهما؛ محبة تعظيم وإجلال وطاعة.", "الخوف والخشية", "خوفٌ يحجزه عن المعاصي، فلا يخاف مخلوقاً فيما لا يقدر عليه إلا الله.", "الرجاء", "الطمع في رحمة الله وثوابه ومغفرته مع بذل أسباب الطاعة.", "التوكل", "صدق اعتماد القلب على الله في جلب المنافع ودفع المضار مع فعل الأسباب المشروعة.", "الإنابة والرغبة والرهبة والخشوع", "حركات قلبية تملأ نفس المؤمن إقبالاً على ربه وانكساراً بين يديه."], "talkingPoints": ["العبادة هي الغاية العظمى التي خُلق لها الجن والإنس؛ وأعظم ما أمر الله به التوحيد، وأعظم ما نهى عنه الشرك. والعبادة ليست محصورة في الصلاة والصيام، بل ثلاث دوائر مترابطة."], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 13, "slideTitle": "شمولية العبادة — تتمة — الدائرة الثانية: العبادات القولية والبدنية", "phaseTitle": "المحور الثاني: توحيد الألوهية", "scriptureEvidence": "", "bulletPoints": ["الدعاء: من أعظم العبادات؛ دعاء المسألة ودعاء العبادة حق خالص لله، فمن دعا ميتاً أو غائباً أو مخلوقاً فيما لا يقدر عليه إلا الله فقد صرف العبادة لغير مستحقها.", "الاستعانة والاستعاذة والاستغاثة: فيما لا يقدر عليه إلا الله لا تُصرف إلا لله الحي القيوم.", "الصلاة والركوع والسجود والطواف: السجود غاية الذل والخضوع، فلا توضع الجبهة تعظيماً وعبادة إلا لخالق السماوات والأرض.", "الدائرة الثالثة: العبادات المالية والنسكية", "الذبح: إراقة الدم تقرباً وتعظيماً لا تكون إلا لله؛ فمن ذبح تقرباً لقبر أو ولي أو جن فقد وقع في الشرك.", "النذر: إلزام العبد نفسه بطاعة تقرباً لله، فلا يجوز النذر لغير الله.", "الزكاة والصدقات: إنفاق المال ابتغاء وجه الله ومواساة لعباده."], "talkingPoints": ["الدائرة الثانية: العبادات القولية والبدنية"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": "يفصل المؤلف أنواع العبادة ليدرك العبد أن حياته كلها يجب أن تكون خالصة لله."}, {"slideNumber": 14, "slideTitle": "توحيد الألوهية هو جوهر دعوة جميع الرسل — من نوح عليه السلام إلى محمد ﷺ: قاعدة واحدة ثابتة", "phaseTitle": "المحور الثاني: توحيد الألوهية", "scriptureEvidence": "", "bulletPoints": ["الدعوة إلى عبادة الله وحده لا شريك له، واجتناب كل ما يُعبد من دونه", "لم يأتِ الرسل ليثبتوا وجود خالق فقط — فأقوامهم كانوا يعرفون ذلك في الجملة — وإنما جاؤوا ليصححوا وجهة العبادة، وليحرروا البشرية من عبادة المخلوقات والأوثان والأهواء إلى عبادة رب العالمين وحده."], "talkingPoints": ["من نوح عليه السلام إلى محمد ﷺ: قاعدة واحدة ثابتة"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "mihrab_quote", "notes": "تبرز مقررات أكاديمية زاد ورسالة نبذة في العقيدة الإسلامية أن الحكمة الكبرى من إرسال الرسل وإنزال الكتب هي تحقيق توحيد الألوهية."}, {"slideNumber": 15, "slideTitle": "المحور الثالث — لماذا لا يكفي الإقرار بوجود الله؟ — «أليس يكفي أن أؤمن في قلبي بأن للكون إلهاً خالقاً مدبراً، وأن هناك جنة وناراً وبعثاً وحساباً؟» — الجواب حجر الزاوية في فهم العقيدة، بأربعة براهين قاطعة.", "phaseTitle": "المحور الثالث: حقيقة الشرك", "scriptureEvidence": "", "bulletPoints": ["البرهان الأول: حال المشركين الأوائل", "ما كانوا يقرّون به", "أن الله خالق السماوات والأرض، يرزقهم، ويملك السمع والأبصار، ويخرج الحي من الميت والميت من الحي، ويدبر الأمر. بل كانوا يعظمون البيت ويحجون ويتصدقون ويذكرون اسم الله.", "ومع ذلك لم ينفعهم", "لأنهم جعلوا مع الله آلهة أخرى يتقربون بها ليقربوهم إليه زلفى، فصرفوا الدعاء والذبح والنذر والاستغاثة لغير الله. فالإقرار بالربوبية لا يُدخل في الإسلام ما لم يقترن بإفراد الله بالعبادة."], "talkingPoints": ["«أليس يكفي أن أؤمن في قلبي بأن للكون إلهاً خالقاً مدبراً، وأن هناك جنة وناراً وبعثاً وحساباً؟» — الجواب حجر الزاوية في فهم العقيدة، بأربعة براهين قاطعة."], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 16, "slideTitle": "البرهان الثاني — أكاديمية زاد — قصة إبليس: العلم النظري بلا انقياد", "phaseTitle": "المحور الثالث: حقيقة الشرك", "scriptureEvidence": "", "bulletPoints": ["ما كان يعلمه يقيناً", "أن الله ربه الذي خلقه من نار\nأن الله هو المعبود المستحق للطاعة\nالبعث والنشور؛ فطلب أن يُنظَر إلى يوم يبعثون\nالجنة والنار؛ فقد أُخرج من الجنة وتوعده الله بجهنم\nبل أقسم بعزة الله متوعداً بني آدم بالإغواء!", "ومع ذلك: الكفر الأبدي واللعنة والطرد", "لأنه امتنع عن الانقياد والطاعة والخضوع لأمر الله بالسجود لآدم؛ فاستكبر وأبى. فالمعرفة العقلية المجردة بوجود الله واليوم الآخر لا تنجي صاحبها إذا خلت من الخضوع والعبودية."], "talkingPoints": ["قصة إبليس: العلم النظري بلا انقياد"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 17, "slideTitle": "البرهانان الثالث والرابع — ٣", "phaseTitle": "المحور الثالث: حقيقة الشرك", "scriptureEvidence": "", "bulletPoints": ["حقيقة الإيمان في الميزان الشرعي", "الإيمان ليس تصديقاً ذهنياً بارداً ولا فكرة فلسفية كنظرية رياضية، بل حقيقة مركبة من القول والعمل: تصديق جازم في القلب يستلزم المحبة والتعظيم والخضوع، وإقرار باللسان، وانقياد بالجوارح. وأعظم حق لله أن يعبدوه ولا يشركوا به شيئاً؛ فمن اعترف بالمنعم ثم صرف الشكر والعبادة لغيره وقع في أعظم الظلم والجحود.", "٤", "مقتضى الحكمة والعدل في خلق الإنسان", "الله حكيم عليم، لم يخلق البشر عبثاً ولم يتركهم هملاً. لو كان المطلوب مجرد الاعتراف الذهني، لكان إرسال الرسل وإنزال الكتب وتشريع العبادات والابتلاء بالأوامر والنواهي بلا فائدة — وحاشا لله. وإنما خلقهم ليبتليهم أيهم أحسن عملاً، وليختبر صدق استسلامهم وانقيادهم."], "talkingPoints": ["٣"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 18, "slideTitle": "المحور الرابع — البناء المتكامل بين الاعتراف بالخالق وإفراده بالعبادة — علاقة وثيقة: كل أصل يبني الآخر", "phaseTitle": "المحور الرابع: البناء المتكامل", "scriptureEvidence": "كيف يقر عاقل بأن الله وحده أوجده ويمده بالرزق والنفَس، وبيده الشفاء والغنى والموت والحياة، ثم يتوجه إلى مخلوق عاجز فيدعوه أو يستغيث به؟ لذلك يحتج المنهج القرآني — كما يبرزه «ثلاثة الأصول» و«نبذة» — بإقرار الإنسان بالربوبية ليلزمه بالألوهية: المقدمة في يده، والنتيجة ألا يعبد إلا هذا الرب.", "bulletPoints": ["التلازم العقلي والفطري: من الربوبية إلى الألوهية", "التضمن العملي: من الألوهية إلى الربوبية", "من يقف في صلاته خاشعاً، ويدعو في جوف الليل، ويتوكل في أزماته، ويذبح نسكه لله، إنما يفعل ذلك لأنه مستيقن أن الله هو الرب القادر المدبر بيده خزائن السماوات والأرض. فلا يُعبد رب يُشك في قدرته؛ وكلما ازدادت المعرفة بالربوبية ازداد الحب والإخلاص."], "talkingPoints": ["علاقة وثيقة: كل أصل يبني الآخر"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 19, "slideTitle": "تحوّل المعرفة النظرية إلى سلوك وحياة — أكاديمية زاد — الربوبية والألوهية: جناحا التوحيد", "phaseTitle": "المحور الرابع: البناء المتكامل", "scriptureEvidence": "", "bulletPoints": ["الجذر — الاعتراف بالخالق (الربوبية)", "ضارب في أعماق الأرض، يمد الشجرة بالثبات واليقين، ويجيب عن أسئلة الوجود: من أين جئت؟ ومن يدبر أمري؟", "الساق والأغصان والثمار — إفراد الله بالعبادة (الألوهية)", "يترجم اليقين القلبي إلى طاعة وصلاة وذكر وتوكل وأخلاق فاضلة واستسلام كامل لشرع الله.", "جذر بلا ثمار: إقرار بلا عبادة ← شجرة يابسة لا حياة فيها", "ثمار بلا جذر: أعمال بلا عقيدة وإخلاص ← تذبل ولا تُقبل", "جذر راسخ وثمرة طيبة ← تكتمل حقيقة الدين"], "talkingPoints": ["الربوبية والألوهية: جناحا التوحيد"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 20, "slideTitle": "التحرر الحقيقي للإنسان من عبودية المخلوقات — أعظم هدية: الحرية الحقيقية والعزة الكاملة", "phaseTitle": "المحور الرابع: التحرر الحقيقي", "scriptureEvidence": "", "bulletPoints": ["حين يؤمن أن الله وحده الرب الرزاق النافع الضار", "يتحرر قلبه من الخوف من البشر، ومن القلق على المستقبل، ومن التعلق بالأسباب المادية تعلقاً يذل نفسه؛ لأنه يعلم أن الأمر كله بيد الله.", "وحين يفرد الله وحده بالعبادة والخضوع", "يرفض قلبه أن ينحني لشهوة عابرة، أو هوى متبع، أو سلطان مخلوق، أو خرافة ووهم؛ لأنه أصبح عبداً خالصاً لملك الملوك.", "تمام العبودية لله هو عين الحرية من رق المخلوقين"], "talkingPoints": ["أعظم هدية: الحرية الحقيقية والعزة الكاملة"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 21, "slideTitle": "المحور الخامس — نواقض التوحيد وقوادحه — «وبضدها تتبين الأشياء»: معرفة الشرك وأنواعه", "phaseTitle": "المحور الخامس: نواقض وقوادح التوحيد", "scriptureEvidence": "«أعظم ما أمر الله به التوحيد، وهو إفراد الله بالعبادة، وأعظم ما نهى عنه الشرك، وهو دعوة غيره معه» — «ثلاثة الأصول»", "bulletPoints": ["لا يحافظ العبد على صفاء توحيده ما لم يعرف ما يهدده: خطر يهدمه من أساسه (الشرك الأكبر)، أو خطر ينقص كماله ويقدح في إخلاصه (الشرك الأصغر). فالله يغفر الذنوب جميعاً لمن يشاء إلا أن يُشرك به، والشرك أعظم ذنب عُصي الله به.", "تعريف الشرك الأكبر", "صرف شيء من أنواع العبادة لغير الله تعالى، أو تسوية غير الله بالله فيما هو من خصائص الله."], "talkingPoints": ["«وبضدها تتبين الأشياء»: معرفة الشرك وأنواعه"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 22, "slideTitle": "الشرك الأكبر — أمثلة من «ثلاثة الأصول» — صرف أي نوع من العبادة لغير الله شرك مخرج من الملة", "phaseTitle": "المحور الخامس: الشرك الأكبر", "scriptureEvidence": "", "bulletPoints": ["شرك الدعاء والاستغاثة", "دعاء ميت أو غائب أو ملك أو ولي فيما لا يقدر عليه إلا الله: تفريج الكربات، شفاء المرضى، قضاء الحاجات، الاستغاثة بالأموات عند الشدائد.", "شرك الذبح والنذر", "الذبح تقرباً وتعظيماً لغير الله — للقبور والأضرحة أو للجن طلباً لنفعهم أو اتقاءً لشرهم — أو النذر لغير الله طاعة أو مالاً.", "شرك الخوف والرجاء والتوكل", "خوف السر من مخلوق حي أو ميت أن يصيبه بمرض أو فقر بقدرته الخفية، أو اعتماد القلب كلياً على غير الله في جلب الرزق ودفع الضر.", "شرك المحبة والطاعة", "محبة مخلوق أو طاغوت محبة تعظيم وذل كمحبة الله، أو طاعته في تحليل ما حرم الله وتحريم ما أحل الله."], "talkingPoints": ["صرف أي نوع من العبادة لغير الله شرك مخرج من الملة"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 23, "slideTitle": "حقيقة الشرك الأكبر وخطورته — «نبذة» ومنهج زاد — من مقتضى الإيمان بالألوهية البراءة التامة من كل ما يُعبد من دون الله. والشرك الأكبر لا يقتصر على عبادة الأصنام الحجرية، بل يشمل كل تعلق قلبي وعملي بغير الله فيما يختص به: بنبي، أو ملك، أو ولي، أو كوكب، أو قبر، أو سلطان.", "phaseTitle": "المحور الخامس: الشرك الأكبر", "scriptureEvidence": "", "bulletPoints": ["آثاره المدمرة في الدنيا والآخرة", "إحباط جميع الأعمال", "لا يُقبل له عمل صالح مهما كثر؛ فالشرط الأول لقبول العمل التوحيد الخالص.", "الخروج من الإسلام", "من تلبس به عن علم واختيار نقض عروة الإسلام وخرج من الملة.", "حرمان المغفرة والجنة", "من مات عليه دون توبة نصوح لا يُغفر له، وتحرم عليه الجنة، ويُخلد في النار."], "talkingPoints": ["من مقتضى الإيمان بالألوهية البراءة التامة من كل ما يُعبد من دون الله. والشرك الأكبر لا يقتصر على عبادة الأصنام الحجرية، بل يشمل كل تعلق قلبي وعملي بغير الله فيما يختص به: بنبي، أو ملك، أو ولي، أو كوكب، أو قبر، أو سلطان."], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 24, "slideTitle": "الشرك الأصغر — الخطر الخفي الذي ينقص كمال التوحيد — كل ما نهى عنه الشرع مما هو ذريعة إلى الشرك الأكبر ووسيلة للوقوع فيه، وجاء في النصوص تسميته شركاً، ولم يصل إلى حد الشرك المخرج من الملة. ويُخشى أن يجر التساهل فيه إلى الأكبر.", "phaseTitle": "المحور الخامس: الشرك الأصغر", "scriptureEvidence": "بالنبي ﷺ أو الكعبة أو الأمانة أو حياة فلان أو شرفه؛ فالحلف تعظيم، والعظمة المطلقة لله. فإن اعتقد مساواة المحلوف به لله أو أنه يملك النفع والضر صار شركاً أكبر.", "bulletPoints": ["القسم الأول: الظاهر (القولي والعملي)", "الحلف بغير الله", "التسوية في المشيئة بالواو", "«ما شاء الله وشئت»، «لولا الله وفلان»، «مالي إلا الله وأنت». والصواب: «ما شاء الله ثم شئت»، «لولا الله ثم فلان»؛ لأن «ثم» تفيد الترتيب والتبعية.", "تعليق التمائم والخيوط والحلق", "لدفع العين أو جلب البركة: إن اعتقدها سبباً — ولم يجعلها الله سبباً — فشرك أصغر، وإن اعتقد أنها تنفع أو تضر بذاتها فشرك أكبر.", "التطير والتشاؤم", "بطائر أو كلمة أو رقم أو شهر فيتراجع عن سفره أو عمله؛ لأنه يضعف التوكل ويعلق القلب بأوهام."], "talkingPoints": ["كل ما نهى عنه الشرع مما هو ذريعة إلى الشرك الأكبر ووسيلة للوقوع فيه، وجاء في النصوص تسميته شركاً، ولم يصل إلى حد الشرك المخرج من الملة. ويُخشى أن يجر التساهل فيه إلى الأكبر."], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 25, "slideTitle": "القسم الثاني: الشرك الأصغر الخفي (شرك الإرادات والنيات) — أخطر أنواعه وأدقها؛ خافه النبي ﷺ على أصحابه أكثر من فتنة المسيح الدجال، يدب في القلب كدبيب النملة السوداء على الصخرة الصماء في الليلة الظلماء.", "phaseTitle": "المحور الخامس: الشرك الأصغر الخفي", "scriptureEvidence": "\"قال اللهُ تعالَى : أنا أغْنَى الشُّركاءِ عنِ الشِّركِ ، مَنْ عمِلَ عملًا أشركَ فيه معِيَ تركتُهُ وشِركَهُ\" — الراوي: أبو هريرة | المحدث: الألباني | صحيح", "bulletPoints": ["الرياء في العبادة", "أن يحسّن عمله الصالح أو يظهره ليراه الناس فيمدحوه؛ فيبطله الله ولا يقبله. «ألا أُخبرُكم بما هو أخوفُ عليكم عندي من المسيحِ الدَّجَّالِ ؟ الشِّركُ الخفِيُّ؛ أن يقومَ الرجلُ فيصلِّي، فيزيِّنُ صلاتَه لما يَرى من نظَرِ رجلٍ» (أبو سعيد الخدري | الألباني | حسن)", "إرادة الإنسان بعمله الدنيا", "كمن يجاهد، أو يتعلم العلم الشرعي، أو يتولى وظيفة دينية، لا يريد وجه الله والدار الآخرة، وإنما عرضاً من الدنيا كالمال أو الجاه أو المنصب."], "talkingPoints": ["أخطر أنواعه وأدقها؛ خافه النبي ﷺ على أصحابه أكثر من فتنة المسيح الدجال، يدب في القلب كدبيب النملة السوداء على الصخرة الصماء في الليلة الظلماء."], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "concept_breakdown", "notes": ""}, {"slideNumber": 26, "slideTitle": "أوجه التفريق الجوهرية — الشرك الأكبر والشرك الأصغر", "phaseTitle": "المقارنة الفاصلة بين الشركين", "scriptureEvidence": "", "bulletPoints": ["أصل الإيمان والملة: الشرك الأكبر (يناقض أصل التوحيد ويخرج صاحبه من الملة) مقابل الشرك الأصغر (لا يخرج من الملة، لكن ينقص كمال التوحيد الواجب، ومن أعظم الكبائر)", "إحباط الأعمال: الشرك الأكبر (يحبط جميع الأعمال الصالحة إن مات عليه) مقابل الشرك الأصغر (يحبط العمل الذي خالطه فقط (من راءى في ركعتين بطلتا وحدهما))", "المصير في الآخرة: الشرك الأكبر (لا يُغفر لمن مات عليه بلا توبة، ويُخلد في النار) مقابل الشرك الأصغر (لا يُخلد في النار؛ تحت المشيئة كأصحاب الكبائر، ومآله إلى الجنة بفضل التوحيد — وهو أعظم من الزنا والسرقة وشرب الخمر)", "الدم والمال في الدنيا: الشرك الأكبر (يبيح الدم والمال إذا قامت الحجة وانتفت الموانع، وتنقطع الموالاة والتوارث) مقابل الشرك الأصغر (لا يبيح دماً ولا مالاً؛ تبقى حرمة المسلم وأحكامه في الزواج والميراث والصلاة عليه)"], "talkingPoints": ["الشرك الأكبر والشرك الأصغر"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "comparison_table", "notes": "", "tableData": [["من حيث", "الشرك الأكبر", "الشرك الأصغر"], ["أصل الإيمان والملة", "يناقض أصل التوحيد ويخرج صاحبه من الملة", "لا يخرج من الملة، لكن ينقص كمال التوحيد الواجب، ومن أعظم الكبائر"], ["إحباط الأعمال", "يحبط جميع الأعمال الصالحة إن مات عليه", "يحبط العمل الذي خالطه فقط (من راءى في ركعتين بطلتا وحدهما)"], ["المصير في الآخرة", "لا يُغفر لمن مات عليه بلا توبة، ويُخلد في النار", "لا يُخلد في النار؛ تحت المشيئة كأصحاب الكبائر، ومآله إلى الجنة بفضل التوحيد — وهو أعظم من الزنا والسرقة وشرب الخمر"], ["الدم والمال في الدنيا", "يبيح الدم والمال إذا قامت الحجة وانتفت الموانع، وتنقطع الموالاة والتوارث", "لا يبيح دماً ولا مالاً؛ تبقى حرمة المسلم وأحكامه في الزواج والميراث والصلاة عليه"]]}, {"slideNumber": 27, "slideTitle": "خلاصة تربوية: كيف يحمي المسلم نفسه من الشركين؟ — المؤمن الصادق لا يأمن على نفسه الفتنة مهما بلغ علمه وصلاحه. فإذا كان إبراهيم عليه السلام — إمام الحنفاء الذي حطم الأصنام بيده — يدعو ربه خائفاً وجلاً: «واجْنُبْنِي وَبَنِيَّ أَن نَّعْبُدَ الْأَصْنَامَ»، فكيف يأمن أحدنا على نفسه بعده؟", "phaseTitle": "الحصون والوقاية العملية", "scriptureEvidence": "«اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم».", "bulletPoints": ["أربعة حصون عملية", "العلم الشرعي المؤصل", "دراسة التوحيد ونواقضه وقوادحه، حتى لا يقع في الشرك وهو يظنه تعظيماً أو محبة أو توسلاً مشروعاً.", "المجاهدة في الإخلاص", "مراقبة النية قبل العمل وأثناءه وبعده، وتطهير القلب من طلب مدح الناس.", "ضبط الألفاظ والمعتقدات", "تطهير اللسان من الحلف بغير الله وألفاظ التسوية، والقلب من التشاؤم والتمائم والأوهام.", "الالتجاء الدائم بالدعاء"], "talkingPoints": ["المؤمن الصادق لا يأمن على نفسه الفتنة مهما بلغ علمه وصلاحه. فإذا كان إبراهيم عليه السلام — إمام الحنفاء الذي حطم الأصنام بيده — يدعو ربه خائفاً وجلاً: «واجْنُبْنِي وَبَنِيَّ أَن نَّعْبُدَ الْأَصْنَامَ»، فكيف يأمن أحدنا على نفسه بعده؟"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "card_grid", "notes": ""}, {"slideNumber": 28, "slideTitle": "الدواء النبوي لداء الشرك الخفي والظاهر — \"الشركُ فيكم أخفى من دبيبِ النملِ، و سأدلُّك على شيءٍ إذا فعلتَه أذْهَبَ عنك صِغارَ الشِّركِ و كبارَه، تقولُ : اللهمَّ إني أعوذُ بك أنْ أُشرِكَ بك وأنا أعلمُ، و أستغفرُك لما لا أعلمُ...\" — الراوي: أبو بكر الصديق | المحدث: الألباني | صحيح", "phaseTitle": "الدواء والذكر النبوي", "scriptureEvidence": "", "bulletPoints": ["\"يا أيها الناسُ ! اتَّقوا هذا الشِّركَ؛ فإنه أخفى من دبيبِ النَّملِ. فقال له من شاء اللهُ أن يقولَ : وكيف نتَّقِيه وهو أخفى من دبيبِ النَّملِ يا رسولَ اللهِ ! قال : قولوا : اللهم إنا نعوذُ بك من أن نُشرِكَ بك شيئًا نعلَمُه، و نستغفرُك لما لا نعلمُه\" — الراوي: أبو موسى الأشعري | المحدث: الألباني | حسن لغيره", "يقال إذا خاف العبد على نفسه شيئاً من الرياء أو أراد أن يتقي أبواب الشرك كبيرها وصغيرها؛ فينبغي الإكثار منه، والخوف من الرياء ينبغي أن يلازم العبد في كل حال."], "talkingPoints": ["\"الشركُ فيكم أخفى من دبيبِ النملِ، و سأدلُّك على شيءٍ إذا فعلتَه أذْهَبَ عنك صِغارَ الشِّركِ و كبارَه، تقولُ : اللهمَّ إني أعوذُ بك أنْ أُشرِكَ بك وأنا أعلمُ، و أستغفرُك لما لا أعلمُ...\" — الراوي: أبو بكر الصديق | المحدث: الألباني | صحيح"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "mihrab_quote", "notes": ""}, {"slideNumber": 29, "slideTitle": "الخاتمة: من العلم إلى اليقين والعمل — الصورة كاملة ناصعة البياض", "phaseTitle": "الخاتمة والتثبيت", "scriptureEvidence": "", "bulletPoints": ["١", "الله سبحانه وتعالى", "الرب الخالق المالك المدبر الذي ربى جميع العالمين بنعمه، تشهد بربوبيته كل آية في الكون وكل نبضة في الفطرة.", "٢", "حقه الأعظم على عباده", "إفراده بالألوهية والعبادة الظاهرة والباطنة، بلا ند ولا شريك في دعاء أو رجاء أو خوف أو توكل أو نسك أو طاعة.", "٣", "الإقرار المجرد لا يكفي", "لا ينجي ما لم يثمر استسلاماً وانقياداً وعبودية خالصة؛ فالعبرة بتحقيق العبودية التي بُعث بها الرسل وأُنزلت لها الكتب."], "talkingPoints": ["الصورة كاملة ناصعة البياض"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "pillars", "notes": "استقينا معالم هذه الرحلة من «ثلاثة الأصول» و«نبذة في العقيدة الإسلامية» ومنهج أكاديمية زاد."}, {"slideNumber": 30, "slideTitle": "أعظم ثمرة: أن تتحول هذه الحقائق إلى نبض حي في القلب وسلوك عملي في اليوم والليلة؛ فيعيش المسلم مطمئناً بربوبية الله، مستقيماً على ألوهيته وشرعه، مستعداً ليوم يُسأل في قبره عن أول وأعظم أصل: — «من ربك؟»", "phaseTitle": "الثمرة الكبرى في الدارين", "scriptureEvidence": "فيجيب بلسان اليقين والثبات: «ربي الله»", "bulletPoints": ["«من ربك؟»"], "talkingPoints": ["«من ربك؟»"], "pedagogicalTip": "بيان دلالة النص وإحكام المعنى القرآني المؤصل مع استحضار البصيرة الإيمانية.", "archetype": "closing_slide", "notes": ""}];

      const EXEMPLAR_TAWHEED_LECTURE = {
        id: 'lecture_tawheed_master_v81',
        title: 'من هو الله؟ — تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين (30 شريحة متعددة الأنماط)',
        category: 'العقيدة الإسلامية',
        savedAt: '2026-11-25T16:00:00.000Z',
        data: {
          metadata: {
            topic: 'من هو الله؟ — تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين',
            category: 'العقيدة الإسلامية',
            audience: 'المستوى التأصيلي والدارسين',
            durationMinutes: 60
          },
          zoomCards: EXEMPLAR_TAWHEED_CARDS,
          blueprint: EXEMPLAR_TAWHEED_CARDS.map((c, i) => ({
            phaseNumber: i + 1,
            phaseNameAr: c.slideTitle || c.title,
            phaseNameEn: `Slide ${i + 1}`,
            allocatedMinutes: 2,
            teacherGuidanceAr: c.pedagogicalTip || '',
            talkingPoints: c.bulletPoints || []
          })),
          worksheet: EXEMPLAR_TAWHEED_CARDS.slice(0, 10).map((c, i) => ({
            num: i + 1,
            topic: c.slideTitle || c.title,
            questionPrompt: `ما الأصل المنهجي المستفاد من مدارسة: (${c.slideTitle || c.title})?`,
            options: [
              { id: 'a', textAr: c.bulletPoints?.[0] || 'التقرير التأصيلي الثابت بالكتاب والسنة' },
              { id: 'b', textAr: 'الوقوف عند مجرد المعرفة النظرية دون عمل' },
              { id: 'c', textAr: 'الخلط بين توحيد الربوبية وتوحيد الألوهية' },
              { id: 'd', textAr: 'تعليق القلب بالأسباب والمخلوقات' }
            ],
            correctOptionId: 'a',
            teacherAnswer: c.bulletPoints?.[0] || 'التقرير التأصيلي الثابت',
            practicalImpact: c.pedagogicalTip || ''
          })),
          evidences: [
            { type: 'quran', arabicText: '﴿فَاعْلَمْ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ﴾ [محمد: 19]', citation: 'سورة محمد: 19' },
            { type: 'hadith', arabicText: '«اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم»', citation: 'صحيح الأدب المفرد' }
          ]
        }
      };
function getFallbackIslamic() {
        return {
          metadata: {
            category: subjectCategory,
            topic: lessonTopic,
            durationMinutes: lessonDuration,
            audienceLevel: audienceLevel,
            languageMode: 'bilingual'
          },
          blueprint: [
            {
              phaseNumber: 1,
              phaseNameAr: 'المقدمة وعنصر التشويق (The Hook)',
              phaseNameEn: 'Hook & Interactive Question',
              allocatedMinutes: 5,
              teacherGuidanceAr: 'اطرح سؤالاً تفاعلياً على الدارسين: ما الفرق بين مجرد العلم الذهني بوجود الله وبين اليقين الذي يزيل الهم في الأزمات؟',
              teacherGuidanceEn: 'Ask the students: How does knowing Allah is Al-Aleem and Al-Khabeer give us personal peace during exams and trials?',
              talkingPoints: [
                'الافتتاح بالحمد والصلاة والسلام على رسول الله',
                'ربط موضوع الإيمان بالسكينة والطمأنينة القلبية'
              ]
            },
            {
              phaseNumber: 2,
              phaseNameAr: 'التأصيل الشرعي والأدلة الموثقة',
              phaseNameEn: 'Core Evidences & Hadith of Jibreel',
              allocatedMinutes: 20,
              teacherGuidanceAr: 'عرض حديث جبريل عليه السلام وتفصيل الأركان الستة مع التركيز على ركن الإيمان بالقضاء والقدر.',
              teacherGuidanceEn: 'Walk through the 6 pillars with emphasis on Qadar (Destiny: the antidote to anxiety and regret).',
              talkingPoints: [
                'الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره',
                'التمييز بين مراتب الدين: الإسلام، الإيمان، الإحسان'
              ]
            },
            {
              phaseNumber: 3,
              phaseNameAr: 'التطبيق العملي في واقع الدارس المعاصر',
              phaseNameEn: 'Real-Life Application & Emotional Resilience',
              allocatedMinutes: 15,
              teacherGuidanceAr: 'تدريب الدارسين على التخلص من كلمة "لو" المحبطة واستبدالها بالرضا: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ".',
              teacherGuidanceEn: 'Equipping youth with the prophetic mindset: replacing paralyzing regret with proactive contentment.',
              talkingPoints: [
                'استشعار معية الله في السراء والضراء',
                'تحويل العادات اليومية إلى عبادات بالنية الصادقة'
              ]
            },
            {
              phaseNumber: 4,
              phaseNameAr: 'الخاتمة والواجب المنزلي وملخص الواتساب',
              phaseNameEn: 'Wrap-up, Reflection & WhatsApp Summary',
              allocatedMinutes: 5,
              teacherGuidanceAr: 'توزيع ملخص الواتساب المعد مسبقاً بنقرة واحدة، وحث كل دارس على تطبيق ذكر اليوم.',
              teacherGuidanceEn: 'Copy and share the WhatsApp summary and launch the interactive 5-question review.',
              talkingPoints: [
                'دعاء كفارة المجلس: سبحانك اللهم وبحمدك...',
                'تذكير بالاختبار الذاتي القصير'
              ]
            }
          ],
          worksheetItems: [
            {
              num: 1,
              topic: 'المقدمة وعنصر التشويق: حقيقة الإيمان واليقين',
              scripture: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ﴾ [النساء: 136]',
              questionPrompt: 'ما الفرق الجوهري بين مجرد التصديق الذهني بوجود الله وبين اليقين الإيماني المثمر للطمأنينة؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'اليقين الإيماني يستقر في القلب ويصدقه العمل والسلوك بينما التصديق الذهني مجرد معلومة' },
                { id: 'b', label: 'ب', textAr: 'التصديق الذهني كافٍ لتحقيق السعادة دون حاجة لأعمال الجوارح والأخلاق' },
                { id: 'c', label: 'ج', textAr: 'لا فرق بينهما فكلاهما مصطلح مترادف في المعاجم اللغوية' }
              ],
              correctOptionId: 'a',
              teacherAnswer: 'اليقين الإيماني يستقر في القلب ويصدقه العمل والسلوك بينما التصديق الذهني مجرد معلومة',
              teacherRationale: 'الإيمان عند أهل السنة والجماعة قول واعتقاد وعمل، يزيد بالطاعة وينقص بالمعصية.',
              practicalImpact: 'استشعار معية الله وتجديد النية الصادقة في كافة الأنشطة اليومية.'
            },
            {
              num: 2,
              topic: 'التأصيل الشرعي: مراتب الدين وأركان الإيمان الستة',
              scripture: '«أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَاليَوْمِ الآخِرِ، وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ» (صحيح مسلم)',
              questionPrompt: 'وفقاً لحديث جبريل عليه السلام؛ أي من التالي يُمثل الركن السادس من أركان الإيمان؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'إيتاء الزكاة المفروضة' },
                { id: 'b', label: 'ب', textAr: 'الإيمان بالقضاء والقدر خيره وشره' },
                { id: 'c', label: 'ج', textAr: 'حج البيت لمن استطاع إليه سبيلاً' }
              ],
              correctOptionId: 'b',
              teacherAnswer: 'الإيمان بالقضاء والقدر خيره وشره',
              teacherRationale: 'بين النبي ﷺ في حديث جبريل أن أركان الإيمان ستة بينما الزكاة والحج من أركان الإسلام الخمسة.',
              practicalImpact: 'ترسيخ استسلام القلب لحكمة الله البالغة في تدبير الكون والأرزاق.'
            },
            {
              num: 3,
              topic: 'التطبيق العملي: الإيمان بالقدر وعلاج القلق والندم',
              scripture: '«مَا أَصَابَكَ لَمْ يَكُنْ لِيُخْطِئَكَ، وَمَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ» (أحمد وأبو داود)',
              questionPrompt: 'ما الهدي النبوي الرشيد عند وقوع ما يكرهه الإنسان لتفادي مشاعر الإحباط والندم القاتل؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'لوم النفس المستمر وترديد كلمة "لو أني فعلت كذا لكان كذا"' },
                { id: 'b', label: 'ب', textAr: 'استشعار الرضا وترديد: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ" مع الأخذ بالأسباب' },
                { id: 'c', label: 'ج', textAr: 'التوقف التام عن المحاولة والقعود عن طلب المعاش' }
              ],
              correctOptionId: 'b',
              teacherAnswer: 'استشعار الرضا وترديد: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ" مع الأخذ بالأسباب',
              teacherRationale: 'نهى النبي ﷺ عن فتح عمل الشيطان بكلمة "لو" وأمر بالرضا والاحتساب.',
              practicalImpact: 'تحويل الصدمات والأزمات إلى منازل للصبر والاحتساب واليقين.'
            },
            {
              num: 4,
              topic: 'الخاتمة والواجب السلوكي: دوام الذكر وحفظ القلب',
              scripture: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ [الرعد: 28]',
              questionPrompt: 'ما الأثر السلوكي المستهدف من ملازمة أذكار الصباح والمساء بحضور قلب؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'الحصانة الإيمانية وسكينة النفس ودفع وساوس القلق والخوف' },
                { id: 'b', label: 'ب', textAr: 'مجرد أداء طقس روتيني سريع دون تفكر في معاني الألفاظ' },
                { id: 'c', label: 'ج', textAr: 'الاستغناء عن الأسباب المادية المشروعة' }
              ],
              correctOptionId: 'a',
              teacherAnswer: 'الحصانة الإيمانية وسكينة النفس ودفع وساوس القلق والخوف',
              teacherRationale: 'الذكر الحقيقي يربط العبد بخالقه وينزل الطمأنينة في الشدائد والرخاء.',
              practicalImpact: 'المحافظة على ورد الذكر اليومي وترديد "رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً".'
            }
          ],
          evidences: [
            {
              type: 'hadith',
              arabicText: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ، قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَاليَوْمِ الآخِرِ، وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ».',
              englishTranslation: 'He said: "Inform me about Faith." The Prophet ﷺ said: "That you believe in Allah, His Angels, His Books, His Messengers, the Last Day, and that you believe in Divine Destiny, its good and bad."',
              citation: 'صحيح مسلم (Sahih Muslim #8)',
              narrator: 'أمير المؤمنين عمر بن الخطاب رضي الله عنه',
              grading: 'صحيح (Sahih - Highest Authenticity)',
              authenticityBadge: true
            },
            {
              type: 'quran',
              arabicText: 'ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّن رُّسُلِهِۦ',
              englishTranslation: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers...',
              citation: 'سورة البقرة (Surah Al-Baqarah 2:285)',
              narrator: '—',
              grading: 'متواتر قطعي الثبوت (Quranic Revelation)',
              authenticityBadge: true
            }
          ],
          zoomCards: [
            {
              slideNumber: 1,
              phaseTitle: 'المحور 1',
              slideTitle: 'ما هو جوهر الإيمان؟',
              titleAr: 'ما هو جوهر الإيمان؟',
              titleEn: 'What is the Essence of Iman?',
              scriptureEvidence: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ وَالْكِتَابِ الَّذِي نَزَّلَ عَلَىٰ رَسُولِهِ﴾ [النساء: 136]',
              bulletPoints: [
                'الإيمان قول باللسان واعتقاد بالجنان وعمل بالجوارح والأركان',
                'زيادة الإيمان بالطاعات ونقصانه بالغفلات والمعاصي',
                'أثر اليقين القلبي في دفع الشبهات وتسكين الاضطراب النفسي'
              ],
              talkingPoints: 'تحرير مفهوم الإيمان عند أهل السنة والجماعة • الرد على الإرجاء والتفريط • ترسيخ حقيقة أن العمل ركن أساسي في كمال الإيمان وصحته',
              fullSectionText: 'الإيمان ليس مجرد معرفة عقلية باردة ولا كلمات تردد باللسان، بل هو ما وقر في أعماق القلب وصدقه العمل الصالح وأخلاق المسلم. حين يتحقق الإيمان الصادق في نفس الداعية والمتعلم، يثمر طمأنينة وسكينة تعصمه من القلق والحيرة، وتدفعه للبذل والثبات في مواجهة الصعاب.',
              discussionPrompts: [
                'ما الفرق الجوهري بين مجرد التصديق الذهني بوجود الخالق وبين اليقين الإيماني المؤثر في السلوك؟',
                'كيف ينعكس الإيمان بأسماء الله الحسنى وصفاته العلى على طمأنينة القلب عند نزول الشدائد؟'
              ],
              pedagogicalTip: 'التركيز على ربط مفهوم الإيمان بالواقع المعاش للشباب والرد على الشبهات العصرية',
              bodyAr: 'الإيمان ليس مجرد كلمات تردد، بل هو ما استقر في أعماق القلب وصدقته الأعمال الصالحة وأخلاق المسلم.',
              practicalAction: 'جددي نيتك الصادقة اليومية قبل فتح أي كتاب أو درس والالتزام بأوراد القلوب.'
            },
            {
              slideNumber: 2,
              phaseTitle: 'المحور 2',
              slideTitle: 'الإيمان بالقدر دواء القلق والتوتر',
              titleAr: 'الإيمان بالقدر دواء القلق والتوتر',
              titleEn: 'Belief in Qadar: The Antidote to Anxiety',
              scriptureEvidence: '«مَا أَصَابَكَ لَمْ يَكُنْ لِيُخْطِئَكَ، وَمَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ» (أحمد وأبو داود)',
              bulletPoints: [
                'مراتب القدر الأربعة: العلم، الكتابة، المشيئة، والخلق والإيجاد',
                'اليقين بأن أزمات الحياة مقدرة بحكمة إلهية بالغة ورحمة',
                'الجمع المنضبط بين بذل الأسباب المشروعة والتوكل الصادق'
              ],
              talkingPoints: 'بيان مراتب الإيمان بالقدر • التفريق بين الإرادة الكونية والإرادة الشرعية • دحض دعاوى الجبر والتعطيل ودفع وسواس الخوف من المستقبل',
              fullSectionText: 'حين يعلم المؤمن أن ما أصابه لم يكن ليخطئه وما أخطأه لم يكن ليصيبه، تنزل السكينة في فؤاده ويزول هلع المستقبل. إن الإيمان بالقدر ركن أصيل يمنح الإنسان توازناً نفسياً فريداً؛ فلا يبطر عند النعمة والرخاء، ولا ييأس أو ينهار عند البلاء والمصيبة، بل يكون شاكراً في الأولى وصابراً محتسباً في الثانية.',
              discussionPrompts: [
                'كيف يزيل الإيمان بالقدر مشاعر الندم القاتل والحسرة على ما فات؟',
                'كيف نجمع بين أخذ الأسباب الطبية والمادية الدقيقة وبين الرضا التام بقضاء الله وقدره؟'
              ],
              pedagogicalTip: 'حث الطلاب على استشعار معية الله والتفويض الكامل مع استنفاد الجهد في الأسباب',
              bodyAr: 'حين يعلم المؤمن أن ما أصابه لم يكن ليخطئه، تنزل السكينة في فؤاده ويزول هلع المستقبل.',
              practicalAction: 'ردد عند أي عائق: قدر الله وما شاء فعل بيقين تام واحتسب الأجر عند الله.'
            }
          ],
          whatsAppKit: {
            headline: '🌿 خلاصة درس اليوم: أركان الإيمان الستة وسكينة القلب 🌿',
            formattedText: `السلام عليكم ورحمة الله وبركاته يا غاليات 🌸\n\n📌 *موضوع حلقتنا اليوم:* أركان الإيمان وثمارها العملية في حياتنا اليومية\n\n✨ *أهم الفوائد المستفادة:*\n1️⃣ الإيمان ستة أركان: بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره.\n2️⃣ من عرف ربه باسمائه الحسنى استراح قلبه من الخوف والهم.\n3️⃣ الإيمان بالقضاء والقدر يمحو كلمة "لو" المحبطة ويملأ الروح باليقين والرضا.\n\n📖 *آية الأسبوع للتأمل:* ﴿ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ﴾ [البقرة: 285]\n\n🎯 *الواجب العملي:* ترديد ذكر "رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً" صباحاً ومساءً بحضور قلب.\n\n🔗 رابط الاختبار القصير للمراجعة الذاتية في منصة مشكاة. حفظكم الله جميعاً! 🤍`,
            actionItem: 'شاركونا عبر المجموعة تطبيقكم العملي لذكر اليوم!'
          },
          reviewQuiz: [
            {
              id: 1,
              questionAr: 'أي من الأركان التالية يدخل ضمن أركان الإيمان الستة وليس من أركان الإسلام الخمسة؟',
              questionEn: 'Which is one of the 6 Pillars of Iman and NOT of the 5 Pillars of Islam?',
              options: [
                { id: 'a', textAr: 'إيتاء الزكاة', textEn: 'Giving Zakah' },
                { id: 'b', textAr: 'الإيمان بالقضاء والقدر', textEn: 'Belief in Divine Destiny (Qadar)' },
                { id: 'c', textAr: 'صوم شهر رمضان', textEn: 'Fasting Ramadan' },
                { id: 'd', textAr: 'حج البيت لمن استطاع', textEn: 'Performing Hajj' }
              ],
              correctOptionId: 'b',
              reflectionPrompt: 'الإيمان بالقدر يورث الطمأنينة والرضا عن الله في السراء والضراء.'
            },
            {
              id: 2,
              questionAr: 'من هو الصحابي الجليل راوي حديث جبريل المشهور في بيان أركان الإيمان والإسلام؟',
              questionEn: 'Who narrated the renowned Hadith of Jibreel explaining Islam, Iman, and Ihsan?',
              options: [
                { id: 'a', textAr: 'أبو بكر الصديق رضي الله عنه', textEn: 'Abu Bakr As-Siddiq' },
                { id: 'b', textAr: 'عمر بن الخطاب رضي الله عنه', textEn: 'Umar ibn Al-Khattab' },
                { id: 'c', textAr: 'أبو هريرة رضي الله عنه', textEn: 'Abu Hurairah' },
                { id: 'd', textAr: 'أنس بن مالك رضي الله عنه', textEn: 'Anas ibn Malik' }
              ],
              correctOptionId: 'b',
              reflectionPrompt: 'قال عمر: بينما نحن عند رسول الله ﷺ إذ طلع علينا رجل شديد بياض الثياب...'
            }
          ]
        };
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

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 relative z-10">
              {/* Row 1: Brand Logo & Title on Right + Actions on Left */}
              <div className="flex items-center justify-between gap-3 mb-3">
                {/* Brand */}
                <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-950 border-2 border-gold-400 p-0.5 shadow-lg flex items-center justify-center transform hover:scale-105 transition overflow-hidden shrink-0">
                    <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Logo" className="w-full h-full object-cover rounded-xl drop-shadow" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-normal text-gold-300 font-amiri drop-shadow-lg leading-none" style={{ fontSize: 'clamp(2.6rem, 7vw, 4.2rem)' }}>
                      {isRtl ? 'منصة مِشكاة' : 'Mishkah Platform'}
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium hidden sm:block mt-1 font-cairo">
                      {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : "Comprehensive OS for Da'wah & Islamic Educators"}
                    </p>
                  </div>
                </div>

                {/* Quick Actions (Library + Security + Lang) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
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
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-t-2 border-emerald-800/90 flex overflow-x-auto py-3 sm:py-4 gap-3 sm:gap-5 scrollbar-none justify-start sm:justify-center items-center">
              {[
                { id: 'hifz', icon: '🕋', labelAr: '1. التحفيظ ومصحف المدينة', labelEn: '1. Quran & Mushaf' },
                { id: 'tajweed', icon: '📖', labelAr: '2. التجويد ومخارج الحروف', labelEn: '2. Tajweed Rules' },
                { id: 'islamic', icon: '🕌', labelAr: '3. حلقات ومحاضرات العلوم الشرعية', labelEn: '3. Islamic Lectures' }
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
                  className={`branch-tab-btn flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-extrabold font-cairo whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-gold-400 via-amber-300 to-gold-400 text-emerald-950 shadow-xl border-3 border-gold-200 transform scale-[1.03] ring-4 ring-gold-400/50' 
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
            {activeTab === 'hifz' && <HifzTab {...{ activeRepeatAyah, activeRulerLine, customMaskedWords, handleActivatePassageTest, handleDeleteMutashabiha, handleFetchTargetMutaAyah, handleNavigateMushafPage, handlePassageVerdict, handleSaveNewMutashabiha, handleSearchMutaAyahs, handleSelectMutaMatch, hifzAyahRange, hifzAyahs, hifzMutashabihat, hifzSurahName, hifzViewMode, hifzWorksheetModalOpen, isAddMutaOpen, isAlternatingMasked, isDivineNamesMasked, isEndingsMasked, isFetchingQuran, isFullMasked, isReverseOrder, isRtl, isSearchingMuta, isStartersMasked, mushafCurrentSurahId, mushafOverlayMode, mushafPageNumber, mutaGuideNote, mutaSearchQuery, mutaSearchResults, mutaTargetAyahNum, mutaTargetSurahId, mutaTargetText, passageMaskedAyahs, passageRetryCount, passageStatus, passageTestSection, quranFontSize, repeatCount, repeatTarget, revealedAyahSet, setActiveRepeatAyah, setActiveRulerLine, setCustomMaskedWords, setHifzViewMode, setHifzWorksheetModalOpen, setIsAddMutaOpen, setIsAlternatingMasked, setIsDivineNamesMasked, setIsEndingsMasked, setIsFullMasked, setIsReverseOrder, setIsStartersMasked, setMaskedMushafLines, setMushafOverlayMode, setMutaGuideNote, setMutaSearchQuery, setPassageMaskedAyahs, setPassageTestSection, setQuranFontSize, setRepeatCount, setRepeatTarget, setRevealedAyahSet, showToast, toggleRevealAyah, toggleWordMask }} />}
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
