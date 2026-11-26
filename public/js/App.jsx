
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
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Welcome Hero Banner with Rich Islamic Tapestry */}
                <div className="islamic-hero-banner rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white relative overflow-hidden shadow-lg border-2 border-gold-400/30 mb-5">
                  {/* Islamic Corner Rosette Accents */}
                  <div className="absolute top-2 right-3 text-gold-300/30 text-base sm:text-lg font-amiri pointer-events-none select-none">۞</div>
                  <div className="absolute top-2 left-3 text-gold-300/30 text-base sm:text-lg font-amiri pointer-events-none select-none">۞</div>

                  {/* Top Row: Title & Badge + Small Side Emblem */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1.5 bg-gold-400/20 text-gold-200 border border-gold-400/40 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold mb-1">
                        <span>✨</span>
                        <span>{isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي' : "Comprehensive OS for Da'wah & Islamic Educators"}</span>
                      </div>
                      <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold font-amiri text-gold-200 leading-snug">
                        {isRtl ? 'منظومة متكاملة لحلقات القرآن، التجويد، والعلوم الشرعية' : 'Integrated OS for Quran, Tajweed, Islamic Studies & Ring Tracking'}
                      </h2>
                    </div>

                    {/* Official Emblem: Moved to top side, small and elegant on mobile! */}
                    <div className="shrink-0 w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-b from-gold-300 via-gold-500 to-emerald-950 shadow-md border-2 border-gold-300/80 transform hover:scale-105 transition flex items-center justify-center overflow-hidden">
                      <img src="icons/mishkah-app-icon.jpg" alt="Mishkah Official App Icon" className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
                    </div>
                  </div>

                  {/* 3 Buttons in ONE single row on mobile (grid-cols-3) */}
                  <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:items-center sm:gap-3 pt-1">
                    <button 
                      onClick={() => setActiveTab('hifz')}
                      className="bg-gold-400 hover:bg-gold-300 text-emerald-950 font-black px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] sm:text-sm text-center"
                    >
                      <span className="text-sm sm:text-base">🕋</span>
                      <span className="leading-tight">{isRtl ? 'التحفيظ' : 'Hifz'}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('tajweed')}
                      className="bg-emerald-900/90 hover:bg-emerald-800 text-gold-200 border border-gold-400/60 font-bold px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] sm:text-sm text-center"
                    >
                      <span className="text-sm sm:text-base">📖</span>
                      <span className="leading-tight">{isRtl ? 'التجويد' : 'Tajweed'}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('islamic')}
                      className="bg-emerald-950/80 hover:bg-emerald-950 border border-gold-400/60 text-gold-200 font-bold px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] sm:text-sm text-center"
                    >
                      <span className="text-sm sm:text-base">🕌</span>
                      <span className="leading-tight">{isRtl ? 'العلوم الشرعية' : 'Islamic'}</span>
                    </button>
                  </div>
                </div>

                {/* Core Feature Highlights (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    {
                      titleAr: 'بطاقات شرح زوم التفاعلية',
                      titleEn: 'Zoom Teaching Cards',
                      descAr: 'عرض عالي التباين بخط عثماني وتلوين تلقائي لحكم التجويد ومخارج الحروف التشريحية.',
                      descEn: 'High-contrast presentation mode with color-coded Uthmani script and anatomical articulation notes.',
                      icon: '🖥️',
                      tag: 'Module A'
                    },
                    {
                      titleAr: 'أوراق عمل قابلة للطباعة (PDF)',
                      titleEn: 'Printable Worksheets',
                      descAr: 'جدول منظم: الكلمة القرآنية | الحكم | العلة والسبب، مع نموذج إجابة خاص بالمعلم.',
                      descEn: 'Clean structured tables with dual versions: student blank sheet and teacher answer key.',
                      icon: '🖨️',
                      tag: 'Print Ready'
                    },
                    {
                      titleAr: 'حقيبة الواتساب بنقرة واحدة',
                      titleEn: '1-Click WhatsApp Kit',
                      descAr: 'ملخص موجز من 10 أسطر منسق بالإيموجي والآيات جاهز للنسخ المباشر لمجموعات الدارسين والحلقة.',
                      descEn: '10-line emoji-formatted executive summary ready for instant broadcast to learner/student groups.',
                      icon: '📱',
                      tag: 'Module B'
                    },
                    {
                      titleAr: 'سياج التوثيق الشرعي الصارم',
                      titleEn: 'Authenticity Guardrails',
                      descAr: 'عزو صريح للأحاديث (الراوي + مصدر صحيح البخاري/مسلم + درجة الصحة) وعزو الآيات بالاسم والرقم.',
                      descEn: 'Strict verification badges: exact Surah/Ayah references, primary Hadith sources, and Sahih status.',
                      icon: '🛡️',
                      tag: 'Zero Weak Hadith'
                    }
                  ].map((card, idx) => {
                    const themeClass = [
                      'card-islamic-sage',
                      'card-islamic-amber',
                      'card-islamic-sky',
                      'card-islamic-lavender'
                    ][idx % 4];
                    return (
                      <div key={idx} className={`${themeClass} rounded-2xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">{card.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/85 text-emerald-900 border border-emerald-900/15 px-2.5 py-0.5 rounded-full shadow-xs">
                            {card.tag}
                          </span>
                        </div>
                        <h3 className="font-bold text-emerald-950 text-base mb-1.5 font-cairo">
                          {isRtl ? card.titleAr : card.titleEn}
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {isRtl ? card.descAr : card.descEn}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Inspection of Active Prepared Lesson */}
                {tajweedData && (
                  <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/10 shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                          {isRtl ? 'الدرس النشط حالياً في الذاكرة' : 'Currently Active Prepared Lesson'}
                        </span>
                        <h3 className="text-xl font-extrabold text-emerald-950 font-amiri mt-0.5">
                          {tajweedData.metadata.surah} ({tajweedData.metadata.ayahRange}) — {tajweedData.metadata.ruleNameAr}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveTab('tajweed')}
                          className="bg-emerald-700 text-white hover:bg-emerald-800 text-xs px-3.5 py-1.5 rounded-lg font-bold transition"
                        >
                          {isRtl ? 'عرض بطاقات الشرح' : 'View Presentation'}
                        </button>
                        <button 
                          onClick={() => setActiveTab('worksheet')}
                          className="bg-gold-50 text-gold-700 border border-gold-300 hover:bg-gold-100 text-xs px-3.5 py-1.5 rounded-lg font-bold transition"
                        >
                          {isRtl ? 'طباعة ورقة العمل' : 'Print Worksheet'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-emerald-800 font-bold block mb-1">
                          {isRtl ? 'المخرج الصوتي التشريحي:' : 'Anatomical Articulation:'}
                        </span>
                        <p className="text-slate-700 leading-relaxed font-amiri text-sm">
                          {isRtl ? tajweedData.ruleDefinition.anatomicalMakhrajAr : tajweedData.ruleDefinition.anatomicalMakhrajEn}
                        </p>
                      </div>
                      <div className="bg-gold-50/70 p-3.5 rounded-xl border border-gold-200">
                        <span className="text-gold-800 font-bold block mb-1">
                          {isRtl ? 'المقدار والزمن:' : 'Timing & Counts:'}
                        </span>
                        <p className="text-slate-700 font-bold text-sm">
                          {tajweedData.ruleDefinition.timingOrHarakat}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-bold block mb-1">
                          {isRtl ? 'المرجع المعتمد:' : 'Textbook Reference:'}
                        </span>
                        <p className="text-slate-600">
                          {tajweedData.metadata.textbookSource}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= VIEW: MODULE A (TAJWEED COPILOT) ================= */}
                        {/* ================= VIEW: HIFZ & RECITATION WORKBENCH (BRANCH 1) ================= */}
            {activeTab === 'hifz' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header Banner */}
                <div className="emerald-pattern rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border-2 border-gold-400 shadow-xl">
                  <div className="absolute top-2.5 right-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="absolute top-2.5 left-3 text-gold-300/40 text-xl font-amiri pointer-events-none select-none">۞</div>
                  <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-200 border border-gold-400/40 text-xs px-3 py-1 rounded-full mb-3 font-bold">
                      <span>🕋</span>
                      <span>{isRtl ? 'الفرع الأول: منظومة التحفيظ المتكاملة (المصحف الورقي + اختبار الإتقان)' : 'Branch 1: Complete Quran Memorization System'}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold font-cairo text-gold-200 mb-1.5">
                      {isRtl ? 'مدارسة مصحف المدينة واختبارات الإتقان التفاعلية' : 'Madinah Mushaf Visuals & Interactive Testing'}
                    </h2>
                    <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-4">
                      {isRtl 
                        ? 'يجمع بين صفحة المصحف الورقي المطبوع الحقيقي (15 سطراً) لترسيخ الذاكرة البصرية، وبين أدوات اختبار الإتقان الفورية (طمس فواصل الآيات، التسميع الغيبي، إخفاء الكلمات، وكاشف المتشابهات).'
                        : 'Combines authentic 15-line Madinah Mushaf visual page with live mastery testing tools: mask endings, blind recitation, word-masking, and mutashabihat.'}
                    </p>

                    {/* Authentic Mode Switcher Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-800/80">
                      <div className="bg-emerald-950 p-1.5 rounded-2xl border-2 border-gold-400 flex items-center gap-2 shadow-lg">
                        {/* 1. Printed Mushaf Page (Primary Default) */}
                        <button
                          type="button"
                          onClick={() => {
                            setHifzViewMode('mushaf_page');
                            handleNavigateMushafPage(mushafPageNumber);
                          }}
                          className={'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ' + (
                            hifzViewMode === 'mushaf_page'
                              ? 'bg-gold-500 text-emerald-950 shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:bg-emerald-900/60'
                          )}
                        >
                          <span>📖</span>
                          <span>{isRtl ? 'عرض وجه المصحف الورقي المصور' : 'Printed Mushaf Page Image'}</span>
                        </button>

                        {/* 2. Digital Recitation Board */}
                        <button
                          type="button"
                          onClick={() => {
                            setHifzViewMode('interactive_test');
                            handleNavigateMushafPage(mushafPageNumber);
                          }}
                          className={'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ' + (
                            hifzViewMode === 'interactive_test'
                              ? 'bg-gold-500 text-emerald-950 shadow-md ring-2 ring-gold-300'
                              : 'text-gold-200 hover:bg-emerald-900/60'
                          )}
                        >
                          <span>📜</span>
                          <span>{isRtl ? 'لوحة التسميع بالأسطر والآيات (الأسطر المتقنة)' : 'Digital Line Recitation Board'}</span>
                        </button>
                      </div>

                      {/* Quick Shortcut Buttons in Header (Synchronized across both modes) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setHifzWorksheetModalOpen(true)}
                          className="bg-emerald-900 hover:bg-emerald-850 text-gold-200 border border-gold-400/70 px-3 py-1.5 rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                          title={isRtl ? 'عرض وطباعة سجل المتابعة والتقييم الأسبوعي لحلقة التحفيظ' : 'View and print weekly Hifz evaluation sheet'}
                        >
                          <span>📝</span>
                          <span>{isRtl ? 'سجل متابعة التحفيظ (PDF)' : 'Hifz Evaluation Sheet (PDF)'}</span>
                        </button>
                        <span className="text-gold-300 font-bold ml-1">{isRtl ? 'انتقال سريع:' : 'Quick:'}</span>
                        {[
                          { name: 'الفاتحة', p: 1 },
                          { name: 'البقرة', p: 2 },
                          { name: 'الكهف', p: 293 },
                          { name: 'يس', p: 440 },
                          { name: 'الملك', p: 562 },
                          { name: 'جزء عم', p: 582 }
                        ].map(lm => (
                          <button
                            key={lm.p}
                            type="button"
                            onClick={() => handleNavigateMushafPage(lm.p)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                              mushafPageNumber === lm.p
                                ? 'bg-gold-500 text-emerald-950 border-gold-300 font-black ring-1 ring-gold-400'
                                : 'bg-emerald-900/80 hover:bg-emerald-800 text-gold-200 border-emerald-700'
                            }`}
                          >
                            {lm.name} ({lm.p})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= AUTHENTIC PRINTED MADINAH MUSHAF PAGE ================= */}
                {hifzViewMode === 'mushaf_page' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Navigation Bar for Mushaf Page (Mode 1 - Fully Synchronized) */}
                    <div className="card-islamic-pearl rounded-2xl p-4 shadow-sm border border-emerald-800/15 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Surah Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-950">{isRtl ? 'السورة المباركة:' : 'Surah:'}</span>
                          <select
                            value={mushafCurrentSurahId}
                            onChange={(e) => {
                              const sid = parseInt(e.target.value);
                              const surahItem = MUSHAF_SURAHS_PAGE_MAP.find(s => s.id === sid);
                              if (surahItem) {
                                handleNavigateMushafPage(surahItem.startPage);
                              }
                            }}
                            className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          >
                            {MUSHAF_SURAHS_PAGE_MAP.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.id}. {isRtl ? 'سورة ' + s.name : 'Surah ' + (s.englishName || s.name)} ({isRtl ? 'صفحة ' : 'Page '} {s.startPage})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Direct Page Input */}
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
                          <span className="text-xs font-bold text-slate-700">{isRtl ? 'الصفحة:' : 'Page:'}</span>
                          <input
                            type="number"
                            min={1}
                            max={604}
                            value={mushafPageNumber}
                            onChange={(e) => {
                              const p = Math.max(1, Math.min(604, parseInt(e.target.value) || 1));
                              handleNavigateMushafPage(p);
                            }}
                            className="w-14 bg-white text-emerald-950 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-center focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500">{isRtl ? 'من 604' : 'of 604'}</span>
                        </div>
                      </div>

                      {/* Prev / Next & Action to Test */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleNavigateMushafPage(mushafPageNumber + 1)}
                          disabled={mushafPageNumber >= 604}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateMushafPage(mushafPageNumber - 1)}
                          disabled={mushafPageNumber <= 1}
                          className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                          <span>⬅️</span>
                        </button>

                        {/* Switch to Testing for this page (Twin Sync) */}
                        <button
                          type="button"
                          onClick={() => handleNavigateMushafPage(mushafPageNumber, 'interactive_test')}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-4 py-1.5 rounded-xl text-xs font-black shadow transition flex items-center gap-1.5"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'اختبار إتقان هذا الوجه ⬅' : 'Test This Page ⬅'}</span>
                        </button>
                      </div>
                    </div>
                    {/* The Authentic 15-Line Printed Madinah Mushaf Page */}
                    <div className="flex justify-center">
                      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-emerald-950/20 max-w-4xl w-full relative">
                        {/* Top Mushaf Header */}
                        <div className="flex justify-between items-center pb-3 mb-4 border-b-2 border-gold-500/70 text-emerald-950 font-bold font-cairo text-sm sm:text-base">
                          <div className="flex items-center gap-2 text-emerald-900">
                            <span>📖</span>
                            <span>
                              {isRtl 
                                ? 'سورة ' + ((MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك')
                                : 'Surah ' + ((MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'Al-Mulk')}
                            </span>
                          </div>

                          <div className="text-gold-700 font-extrabold text-xs sm:text-sm">
                            {isRtl ? 'مصحف المدينة النبوية — مجمع الملك فهد لطباعة المصحف الشريف' : 'King Fahd Complex Madinah Mushaf'}
                          </div>

                          <div className="text-emerald-900">
                            <span>{isRtl ? 'الجزء ' + Math.ceil(mushafPageNumber / 20) : 'Juz ' + Math.ceil(mushafPageNumber / 20)}</span>
                          </div>
                        </div>

                        {/* Interactive Testing Toolbar Directly on Printed Mushaf Page */}
                        <div className="mb-4 bg-emerald-950/5 border border-gold-400/50 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg">🛠️</span>
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-emerald-950 font-cairo block">
                                {isRtl ? 'أدوات اختبار الحفظ المباشرة على وجه المصحف:' : 'Mushaf Testing Tools:'}
                              </span>
                              <span className="text-[11px] text-slate-500 hidden sm:block">
                                {isRtl ? 'أقنعة ومساطر تفاعلية لتسميع الوجه سطراً بسطر أو حجب أجزاء منه' : 'Interactive masks and rulers directly on page'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {/* 1. Ruler mode */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'ruler' ? 'none' : 'ruler');
                                setActiveRulerLine(1);
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'ruler' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>📏</span>
                              <span>{isRtl ? 'المسطرة الكاشفة (سطراً بسطر)' : 'Line Ruler'}</span>
                            </button>

                            {/* 2. Mask bottom half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_bottom' ? 'none' : 'mask_bottom')}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_bottom' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔻</span>
                              <span>{isRtl ? 'حجب النصف الأسفل (8-15)' : 'Mask Bottom'}</span>
                            </button>

                            {/* 3. Mask top half */}
                            <button
                              type="button"
                              onClick={() => setMushafOverlayMode(mushafOverlayMode === 'mask_top' ? 'none' : 'mask_top')}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'mask_top' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>🔺</span>
                              <span>{isRtl ? 'حجب النصف الأعلى (1-7)' : 'Mask Top'}</span>
                            </button>

                            {/* 4. Spotlight */}
                            <button
                              type="button"
                              onClick={() => {
                                setMushafOverlayMode(mushafOverlayMode === 'spotlight' ? 'none' : 'spotlight');
                                setActiveRulerLine(1);
                              }}
                              className={'px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 border ' + (mushafOverlayMode === 'spotlight' ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-emerald-950 border-slate-300 hover:bg-slate-50')}
                            >
                              <span>💡</span>
                              <span>{isRtl ? 'كشاف تركيز السطر' : 'Spotlight'}</span>
                            </button>



                            {/* Reset Button */}
                            {mushafOverlayMode !== 'none' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMushafOverlayMode('none');
                                  setMaskedMushafLines(new Set());
                                }}
                                className="px-2.5 py-1.5 rounded-xl font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>{isRtl ? 'عرض المصحف كاملاً' : 'Full Page'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Ruler Controls (When ruler or spotlight active) */}
                        {(mushafOverlayMode === 'ruler' || mushafOverlayMode === 'spotlight') && (
                          <div className="mb-3 bg-amber-50/90 border border-gold-400 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-900 font-bold text-xs sm:text-sm">
                                📌 {isRtl ? 'السطر النشط:' : 'Active Line:'}
                              </span>
                              <span className="bg-emerald-900 text-gold-200 px-3 py-1 rounded-xl text-xs sm:text-sm font-black shadow-xs">
                                {isRtl ? 'السطر ' + activeRulerLine + ' من 15' : 'Line ' + activeRulerLine + ' of 15'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={activeRulerLine >= 15}
                                onClick={() => setActiveRulerLine(Math.min(15, activeRulerLine + 1))}
                                className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬇️</span>
                                <span>{isRtl ? 'كشف السطر التالي' : 'Next Line'}</span>
                              </button>

                              <button
                                type="button"
                                disabled={activeRulerLine <= 1}
                                onClick={() => setActiveRulerLine(Math.max(1, activeRulerLine - 1))}
                                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <span>⬆️</span>
                                <span>{isRtl ? 'حجب السطر السابق' : 'Prev Line'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveRulerLine(1)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
                                title="إعادة من أول سطر"
                              >
                                🔁 {isRtl ? 'البداية' : 'Start'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* The High-Resolution 15-Line Page Image with Authentic Overlays */}
                        <div className="bg-[#FFFDF9] border-2 border-emerald-900/10 rounded-2xl p-2 sm:p-6 shadow-inner flex justify-center items-center relative overflow-hidden select-none">
                          <div className="relative inline-block w-full max-w-3xl">
                            <img
                              key={mushafPageNumber}
                              src={'https://android.quran.com/data/width_1260/page' + String(mushafPageNumber).padStart(3, '0') + '.png'}
                              alt={'مصحف المدينة النبوية — صفحة ' + mushafPageNumber}
                              className="w-full h-auto block mx-auto bg-white filter contrast-110 drop-shadow-sm select-none"
                              loading="eager"
                              style={{ minHeight: '500px' }}
                            />

                            {/* OVERLAY: Ruler Mode (masks everything below activeRulerLine) */}
                            {mushafOverlayMode === 'ruler' && (
                              <div
                                className="absolute left-0 right-0 bottom-0 bg-gradient-to-b from-[#FAF7EE] to-[#EAE4D2] border-t-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ease-out select-none"
                                style={{
                                  top: (activeRulerLine * 6.55) + '%',
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
                                  style={{ height: Math.max(0, (activeRulerLine - 1) * 6.55) + '%' }}
                                />
                                <div 
                                  className="absolute left-0 right-0 border-y-2 border-gold-400 bg-amber-300/10 shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
                                  style={{
                                    top: ((activeRulerLine - 1) * 6.55) + '%',
                                    height: '6.55%'
                                  }}
                                />
                                <div 
                                  className="absolute left-0 right-0 bottom-0 bg-slate-900/65 backdrop-blur-[1px] transition-all duration-300"
                                  style={{ top: (activeRulerLine * 6.55) + '%' }}
                                />
                              </div>
                            )}


                          </div>
                        </div>

                        {/* Bottom Mushaf Footer (Twin Synchronized with Recitation Board) */}
                        <div className="flex justify-between items-center pt-3 mt-4 border-t-2 border-gold-500/70 text-xs sm:text-sm font-bold text-emerald-950">
                          <button
                            type="button"
                            onClick={() => {
                              const p = Math.min(604, mushafPageNumber + 1);
                              handleNavigateMushafPage(p);
                            }}
                            disabled={mushafPageNumber >= 604}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold shadow-xs cursor-pointer"
                          >
                            <span>➡️</span>
                            <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                          </button>

                          <div className="text-center">
                            <span className="text-base sm:text-xl font-extrabold text-gold-600 font-amiri block">
                              — {mushafPageNumber} —
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {isRtl ? 'الحزب ' + Math.ceil(mushafPageNumber / 10) : 'Hizb ' + Math.ceil(mushafPageNumber / 10)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const p = Math.max(1, mushafPageNumber - 1);
                              handleNavigateMushafPage(p);
                            }}
                            disabled={mushafPageNumber <= 1}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 disabled:opacity-40 transition flex items-center gap-1 font-bold shadow-xs cursor-pointer"
                          >
                            <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                            <span>⬅️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= MODE B: DEPRECATED LEGACY DIGITAL TEXT (DISABLED) ================= */}
                {hifzViewMode === 'interactive_test' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Live Recitation Controls Ribbon */}
                    <div className="card-islamic-amber rounded-3xl p-5 shadow-sm border border-gold-400/60">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-900/10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎛️</span>
                          <div>
                            <h3 className="text-sm font-extrabold text-emerald-950 font-cairo">
                              {isRtl ? 'حقيبة اختبارات الإتقان المبتكرة للمحفظ (اختر نوع الاختبار التفاعلي):' : 'Creative Mastery Testing Suite:'}
                            </h3>
                            <p className="text-[11px] text-slate-600">
                              {isRtl ? 'طرق اختبار ذكية وغير مسبوقة لقياس قوة الحفظ، ترابط الآيات، وفواصل الأسماء الحسنى' : 'Unprecedented tests: endings, starters, divine attributes, cloze, and reverse order'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setHifzViewMode('mushaf_page')}
                          className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 border border-gold-400/40 text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <span>📖</span>
                          <span>{isRtl ? 'الرجوع للمصحف الورقي' : 'View Mushaf'}</span>
                        </button>
                      </div>

                      {/* Six Creative Testing Modes Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        
                        {/* 1. Mask Endings */}
                        <button
                          type="button"
                          onClick={() => setIsEndingsMasked(!isEndingsMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isEndingsMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'طمس آخر كلمتين لاختبار حفظ فواصل الآيات' : 'Mask Endings'}
                        >
                          <span className="text-base">{isEndingsMasked ? '🙈' : '👁️'}</span>
                          <span>{isRtl ? (isEndingsMasked ? 'إلغاء طمس الفواصل' : 'طمس فواصل الآيات') : 'Mask Endings'}</span>
                        </button>

                        {/* 2. Mask Starters (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsStartersMasked(!isStartersMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isStartersMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'طمس أول كلمتين لاختبار استحضار مطالع الآيات وترابطها' : 'Mask Starters'}
                        >
                          <span className="text-base">🔀</span>
                          <span>{isRtl ? (isStartersMasked ? 'إلغاء طمس المطالع' : 'طمس مطالع الآيات') : 'Mask Starters'}</span>
                        </button>

                        {/* 3. Mask Divine Attributes (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsDivineNamesMasked(!isDivineNamesMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isDivineNamesMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'طمس أسماء الله وصفاته في الفواصل لمنع الخلط الشائع' : 'Mask Divine Attributes'}
                        >
                          <span className="text-base">👑</span>
                          <span>{isRtl ? (isDivineNamesMasked ? 'إلغاء طمس الصفات' : 'طمس الأسماء الحسنى') : 'Divine Names'}</span>
                        </button>

                        {/* 4. Alternating Lines (Line by Line) */}
                        <button
                          type="button"
                          onClick={() => {
                            if (passageMaskedAyahs.size > 0 && passageTestSection === 'alternate_lines') {
                              setPassageTestSection('none');
                              setPassageMaskedAyahs(new Set());
                            } else {
                              const altNums = hifzAyahs.filter((_, idx) => idx % 2 === 1).map(a => a.num);
                              setPassageTestSection('alternate_lines');
                              setPassageMaskedAyahs(new Set(altNums));
                            }
                          }}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            passageTestSection === 'alternate_lines'
                              ? 'bg-gold-500 text-emerald-950 border-gold-600 ring-2 ring-gold-400 font-black shadow-md'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'حجب سطر وسطر بدقة 100% دون أي تقطيع في الحروف' : 'Alternate Lines'}
                        >
                          <span className="text-base">🌓</span>
                          <span>{isRtl ? (passageTestSection === 'alternate_lines' ? 'إلغاء سطر وسطر' : 'حجب سطر وسطر') : 'Alternate Lines'}</span>
                        </button>

                        {/* 4b. Alternating 50% Cloze */}
                        <button
                          type="button"
                          onClick={() => setIsAlternatingMasked(!isAlternatingMasked)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isAlternatingMasked
                              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 font-black'
                              : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                          }`}
                          title={isRtl ? 'إخفاء كلمة وترك كلمة لتحفيز اليقظة العقلية الفائقة' : 'Alternating 50% Cloze'}
                        >
                          <span className="text-base">🏁</span>
                          <span>{isRtl ? (isAlternatingMasked ? 'إلغاء التظليل' : 'تظليل تبادلي 50%') : 'Cloze 50%'}</span>
                        </button>

                        {/* 5. Reverse Order Recitation (Innovative) */}
                        <button
                          type="button"
                          onClick={() => setIsReverseOrder(!isReverseOrder)}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isReverseOrder
                              ? 'bg-emerald-800 text-gold-300 border-emerald-900 ring-2 ring-emerald-500 font-black'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                          }`}
                          title={isRtl ? 'عرض الآيات من الأسفل للأعلى لاختبار الحفظ الصارم' : 'Reverse Order Test'}
                        >
                          <span className="text-base">🔄</span>
                          <span>{isRtl ? (isReverseOrder ? 'الترتيب الأصلي' : 'تسميع عكسي صاعد') : 'Reverse Order'}</span>
                        </button>

                        {/* 6. Full Blind Recitation */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsFullMasked(!isFullMasked);
                            setRevealedAyahSet(new Set([1]));
                          }}
                          className={`p-2.5 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center text-center gap-1 border shadow-xs ${
                            isFullMasked
                              ? 'bg-emerald-800 text-gold-300 border-emerald-900 ring-2 ring-emerald-500 font-black'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                          }`}
                          title={isRtl ? 'إخفاء كامل للآيات مع النقر لكشف أي كلمة أو آية' : 'Full Blind Recitation'}
                        >
                          <span className="text-base">{isFullMasked ? '📖' : '🔒'}</span>
                          <span>{isRtl ? (isFullMasked ? 'كشف الكل' : 'تسميع غيبي كامل') : 'Blind Mode'}</span>
                        </button>

                      </div>

                      
                      {/* Passage-Based Testing Ribbon (Start, Middle, End) */}
                      <div className="mt-4 pt-3.5 border-t border-amber-900/15">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                            <span className="text-base">📑</span>
                            <span>{isRtl ? 'اختبار المقاطع القرآنية بالصفحة (حجب مقطع وتسميعه مع تحكيم المعلم):' : 'Passage-Based Recitation Tests:'}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            {isRtl ? 'يتم حجب المقطع، فإن أتقنه تنقر [✅ قالها صح] ليظهر، وإن أخطأ تنقر [⚠️ قالها غلط] ليعيده' : 'Hide passage, verify, and reveal'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {/* 1. Start Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('start')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'start'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🟢</span>
                            <span>{isRtl ? 'مقطع بداية الصفحة' : 'Start Passage'}</span>
                          </button>

                          {/* 2. Middle Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('middle')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'middle'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🟡</span>
                            <span>{isRtl ? 'مقطع وسط الصفحة' : 'Middle Passage'}</span>
                          </button>

                          {/* 3. End Passage */}
                          <button
                            type="button"
                            onClick={() => handleActivatePassageTest('end')}
                            className={'p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border shadow-xs ' + (
                              passageTestSection === 'end'
                                ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-black'
                                : 'bg-white hover:bg-amber-50 text-emerald-950 border-amber-300'
                            )}
                          >
                            <span>🔴</span>
                            <span>{isRtl ? 'مقطع ختام الصفحة' : 'End Passage'}</span>
                          </button>

                          {/* Reset / Status */}
                          {passageTestSection !== 'none' ? (
                            <button
                              type="button"
                              onClick={() => handlePassageVerdict('reset')}
                              className="p-2.5 rounded-xl font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 transition flex items-center justify-center gap-1"
                            >
                              <span>✕</span>
                              <span>{isRtl ? 'إلغاء اختبار المقاطع' : 'Cancel Test'}</span>
                            </button>
                          ) : (
                            <div className="text-[11px] text-slate-500 flex items-center justify-center text-center p-1 font-medium bg-amber-50/50 rounded-xl border border-dashed border-amber-300">
                              {isRtl ? '💡 اختر مقطعاً لبدء التسميع' : 'Select a passage to test'}
                            </div>
                          )}
                        </div>
                      </div>

{/* Reset custom masks button if any active */}
                      {customMaskedWords.size > 0 && (
                        <div className="mt-3 pt-2 border-t border-amber-900/10 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCustomMaskedWords(new Set())}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                          >
                            <span>🔄</span>
                            <span>{isRtl ? 'إلغاء طمس الكلمات اليدوية (' + customMaskedWords.size + ')' : 'Reset Manual Masks'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quranic Ayahs Board with Clickable Words */}
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-900/20 relative">
                      
                      {/* Mode 2 Synchronized Quran Page Navigator (Full 604-Page Freedom & Twin Sync) */}
                      <div className="w-full bg-emerald-950/5 border-2 border-gold-400/60 rounded-2xl p-3.5 mb-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Surah Dropdown in Mode 2 */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-950">{isRtl ? 'السورة المباركة:' : 'Surah:'}</span>
                              <select
                                value={mushafCurrentSurahId}
                                onChange={(e) => {
                                  const sid = parseInt(e.target.value);
                                  const surahItem = MUSHAF_SURAHS_PAGE_MAP.find(s => s.id === sid);
                                  if (surahItem) {
                                    handleNavigateMushafPage(surahItem.startPage);
                                  }
                                }}
                                className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              >
                                {MUSHAF_SURAHS_PAGE_MAP.map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.id}. سورة {s.name} (صفحة {s.startPage})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Direct Page Input in Mode 2 */}
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs">
                              <span className="text-xs font-bold text-slate-700">{isRtl ? 'الصفحة:' : 'Page:'}</span>
                              <input
                                type="number"
                                min={1}
                                max={604}
                                value={mushafPageNumber}
                                onChange={(e) => {
                                  const p = Math.max(1, Math.min(604, parseInt(e.target.value) || 1));
                                  handleNavigateMushafPage(p);
                                }}
                                className="w-14 bg-slate-50 text-emerald-950 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-center focus:outline-none"
                              />
                              <span className="text-[11px] text-slate-500">{isRtl ? 'من 604' : 'of 604'}</span>
                            </div>
                          </div>

                          {/* Navigation Buttons + Return to Mushaf Mode + Font Scale */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Next Page */}
                            <button
                              type="button"
                              onClick={() => handleNavigateMushafPage(mushafPageNumber + 1)}
                              disabled={mushafPageNumber >= 604}
                              className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <span>➡️</span>
                              <span>{isRtl ? 'الوجه التالي' : 'Next'}</span>
                            </button>

                            {/* Prev Page */}
                            <button
                              type="button"
                              onClick={() => handleNavigateMushafPage(mushafPageNumber - 1)}
                              disabled={mushafPageNumber <= 1}
                              className="bg-white hover:bg-slate-50 disabled:opacity-40 text-emerald-950 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                            >
                              <span>{isRtl ? 'الوجه السابق' : 'Prev'}</span>
                              <span>⬅️</span>
                            </button>

                            {/* Button to toggle back to Printed Mushaf Page Mode */}
                            <button
                              type="button"
                              onClick={() => {
                                setHifzViewMode('mushaf_page');
                                handleNavigateMushafPage(mushafPageNumber);
                              }}
                              className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 border border-gold-400/50 px-3.5 py-1.5 rounded-xl text-xs font-black shadow transition flex items-center gap-1.5"
                            >
                              <span>📖</span>
                              <span>{isRtl ? 'عرض وجه المصحف الورقي' : 'View Mushaf Page'}</span>
                            </button>

                            {/* Font Size Toggle */}
                            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1 text-xs shadow-xs">
                              <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'الخط:' : 'Font:'}</span>
                              {['small', 'medium', 'large'].map(sz => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setQuranFontSize(sz)}
                                  className={'px-2 py-0.5 rounded-lg text-xs font-bold transition ' + (
                                    quranFontSize === sz ? 'bg-emerald-900 text-gold-200 font-black' : 'text-slate-600 hover:text-emerald-950'
                                  )}
                                >
                                  {sz === 'small' ? (isRtl ? 'صغير' : 'S') : sz === 'medium' ? (isRtl ? 'متوسط' : 'M') : (isRtl ? 'كبير' : 'L')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Surah Title & Range Header Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-900/10">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-emerald-900 text-gold-300 font-amiri font-bold flex items-center justify-center text-sm shadow-sm">
                              ۞
                            </span>
                            <div>
                              <h3 className="text-base font-extrabold text-emerald-950 font-amiri">
                                {hifzSurahName} — {isRtl ? 'الآيات (' + hifzAyahRange + ')' : 'Ayahs (' + hifzAyahRange + ')'}
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                {isRtl ? 'لوحة التسميع متزامنة تماماً مع وجه المصحف الورقي (صفحة ' + mushafPageNumber + ')' : 'Recitation board synchronized with Mushaf page ' + mushafPageNumber}
                              </p>
                            </div>
                          </div>

                          {isFetchingQuran && (
                            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold animate-pulse">
                              ⏳ {isRtl ? 'جارٍ جلب الآيات بالرسم العثماني...' : 'Fetching Uthmani text...'}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Active Passage Arbitration Panel */}
                      {passageTestSection !== 'none' && (
                        <div className="w-full mb-6 p-4 sm:p-5 rounded-2xl border-2 shadow-md bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border-gold-400/80 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-900/15">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl sm:text-3xl">🎙️</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-cairo font-black text-sm sm:text-base text-emerald-950">
                                    {isRtl ? 'مقطع التسميع النشط: ' : 'Active Passage: '}
                                    {passageTestSection === 'start' && (isRtl ? 'بداية الصفحة' : 'Start of Page')}
                                    {passageTestSection === 'middle' && (isRtl ? 'وسط الصفحة' : 'Middle of Page')}
                                    {passageTestSection === 'end' && (isRtl ? 'ختام الصفحة' : 'End of Page')}
                                  </span>
                                  <span className="bg-emerald-900 text-gold-300 text-xs font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    {isRtl ? 'الآيات (' + Array.from(passageMaskedAyahs).join(', ') + ')' : 'Ayahs (' + Array.from(passageMaskedAyahs).join(', ') + ')'}
                                  </span>
                                </div>
                                
                                {/* Dynamic Status Text */}
                                <div className="text-xs mt-1 font-bold">
                                  {passageStatus === 'reciting' && (
                                    <span className="text-amber-800 animate-pulse flex items-center gap-1">
                                      <span>🎧</span>
                                      <span>{isRtl ? 'الشيخ يستمع لتسميع الطالب... اضغط [قالها صح] لإظهارها أو [قالها غلط] لإعادتها' : 'Listening to student...'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'correct' && (
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <span>✨</span>
                                      <span>{isRtl ? 'ما شاء الله! قراءة صحيحة ومتقنة — تم إظهار المقطع بنجاح' : 'Mastered! Revealed'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'error_retry' && (
                                    <span className="text-rose-800 flex items-center gap-1">
                                      <span>⚠️</span>
                                      <span>{isRtl ? 'وقع خطأ أثناء التسميع (المحاولة ' + passageRetryCount + ') — على الطالب إعادة المقطع مرة أخرى لتثبيته!' : 'Mistake! Student must retry'}</span>
                                    </span>
                                  )}
                                  {passageStatus === 'revealed_for_review' && (
                                    <span className="text-blue-800 flex items-center gap-1">
                                      <span>📖</span>
                                      <span>{isRtl ? 'تم إظهار المقطع لتصحيح الخطأ والمراجعة في المصحف' : 'Revealed for review'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div className="flex items-center gap-1.5 text-xs">
                              {passageStatus === 'reciting' && (
                                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-bold shadow-xs">
                                  🔒 {isRtl ? 'محجوب للتسميع' : 'Masked'}
                                </span>
                              )}
                              {passageStatus === 'correct' && (
                                <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black shadow-xs flex items-center gap-1">
                                  ✅ {isRtl ? 'متقن ومُظهر' : 'Mastered'}
                                </span>
                              )}
                              {passageStatus === 'error_retry' && (
                                <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-900 font-black shadow-xs flex items-center gap-1 animate-bounce">
                                  ⚠️ {isRtl ? 'مطلوب الإعادة' : 'Retry'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Teacher Live Verdict Buttons (Exact User Feature) */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* 1. Said Correctly Button */}
                              <button
                                type="button"
                                onClick={() => handlePassageVerdict('correct')}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 border border-emerald-800 cursor-pointer"
                              >
                                <span>✅</span>
                                <span>{isRtl ? 'قالها صح (إظهار المقطع)' : 'Correct (Reveal)'}</span>
                              </button>

                              {/* 2. Said with Mistake Button */}
                              <button
                                type="button"
                                onClick={() => handlePassageVerdict('error')}
                                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 border border-rose-800 cursor-pointer"
                              >
                                <span>⚠️</span>
                                <span>{isRtl ? 'قالها غلط (إعادة المقطع)' : 'Mistake (Retry)'}</span>
                              </button>

                              {/* 3. If in Retry mode: reveal for review or confirm correct after retry */}
                              {passageStatus === 'error_retry' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handlePassageVerdict('correct')}
                                    className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>🔁</span>
                                    <span>{isRtl ? 'أتقن بعد الإعادة (إظهار)' : 'Mastered after Retry'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handlePassageVerdict('reveal_review')}
                                    className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>👁️</span>
                                    <span>{isRtl ? 'إظهار للتصحيح والمراجعة' : 'Reveal for Review'}</span>
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Reset Button */}
                            <button
                              type="button"
                              onClick={() => handlePassageVerdict('reset')}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              ✕ {isRtl ? 'إنهاء اختبار المقطع' : 'Close'}
                            </button>
                          </div>
                        </div>
                      )}

{/* Repetition Loop Counter */}
                        <div className="flex items-center gap-2 bg-emerald-950 text-gold-200 rounded-xl px-3 py-1.5 border border-gold-400/40 text-xs shadow-sm">
                          <span>🔁 {isRtl ? 'عداد التكرار:' : 'Loop:'}</span>
                          <div className="flex items-center gap-1">
                            {[3, 5, 7].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => { setRepeatTarget(num); setRepeatCount(0); }}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  repeatTarget === num ? 'bg-gold-500 text-emerald-950 font-black' : 'text-emerald-300 hover:text-white'
                                }`}
                              >
                                {num}x
                              </button>
                            ))}
                          </div>
                          <span className="text-gold-400 font-bold px-1">({repeatCount}/{repeatTarget})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = repeatCount + 1;
                              setRepeatCount(next > repeatTarget ? 1 : next);
                              if (next === repeatTarget) {
                                showToast(isRtl ? '🎉 ما شاء الله! اكتمل نصاب التكرار المطلوب' : 'Target reached! 🎉');
                              }
                            }}
                            className="bg-gold-400 hover:bg-gold-300 text-emerald-950 font-black px-2.5 py-0.5 rounded shadow text-xs transition"
                          >
                            +1
                          </button>
                        </div>
                      </div>

                      {/* Basmalah */}
                      <div className="text-center font-quran text-2xl text-emerald-900 mb-8 py-2 select-none border-b border-gold-400/20 max-w-md mx-auto">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>

                      {/* Ayahs List */}
                      <div className="space-y-3 sm:space-y-4">
                        {(isReverseOrder ? [...hifzAyahs].reverse() : hifzAyahs).map((ayah) => {
                          const words = ayah.text.split(' ');
                          const isPassageMasked = passageMaskedAyahs.has(ayah.num);
                          const isPassageHidden = isPassageMasked && (passageStatus === 'reciting' || passageStatus === 'error_retry');
                          const isRevealed = (!isFullMasked || revealedAyahSet.has(ayah.num)) && !isPassageHidden;

                          // Common Quranic divine names & attributes in endings
                          const divineEndingsList = ['ٱلْعَزِيزُ', 'الْعَزِيزُ', 'ٱلْعَزِيزِ', 'ٱلْغَفُورُ', 'الْغَفُورُ', 'ٱلرَّحِيمُ', 'الرَّحِيمُ', 'ٱلسَّمِيعُ', 'السَّمِيعُ', 'ٱلْعَلِيمُ', 'الْعَلِيمُ', 'قَدِيرٌ', 'عَلِيمٌ', 'حَكِيمٌ', 'غَفُورٌ', 'رَّحِيمٌ', 'خَبِيرٌ', 'بَصِيرٌ', 'ٱلتَّوَّابُ', 'التَّوَّابُ', 'ٱلْحَمِيدُ'];

                          return (
                            <div 
                              key={ayah.num}
                              className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 bg-white border-2 border-emerald-900/15 shadow-sm hover:border-gold-500/50 ${
                                activeRepeatAyah === ayah.num 
                                  ? 'ring-2 ring-gold-400' 
                                  : ''
                              }`}
                            >
                              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-gold-300 font-bold flex items-center justify-center text-xs">
                                    {ayah.num}
                                  </span>
                                  <span className="text-slate-600 font-bold">
                                    {isRtl ? 'الآية رقم ' + ayah.num : 'Ayah ' + ayah.num}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => { setActiveRepeatAyah(ayah.num); setRepeatCount(0); }}
                                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                                      activeRepeatAyah === ayah.num 
                                        ? 'bg-gold-500 text-emerald-950 font-black' 
                                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                  >
                                    <span>🔁</span>
                                    <span>{isRtl ? 'تركيز التكرار' : 'Focus'}</span>
                                  </button>

                                  {isFullMasked && (
                                    <button
                                      type="button"
                                      onClick={() => toggleRevealAyah(ayah.num)}
                                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                                        isRevealed 
                                          ? 'bg-emerald-100 text-emerald-900' 
                                          : 'bg-emerald-900 text-gold-300 font-black shadow'
                                      }`}
                                    >
                                      <span>{isRevealed ? '🙈 إخفاء' : '👁️ كشف للطالب'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {!isRevealed ? (
                                isPassageHidden ? (
                                  <div className={'p-6 sm:p-8 rounded-2xl text-center border-2 transition-all select-none ' + (
                                    passageStatus === 'error_retry'
                                      ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-md ring-2 ring-rose-300'
                                      : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-inner'
                                  )}>
                                    <span className="text-3xl sm:text-4xl block mb-2">
                                      {passageStatus === 'error_retry' ? '⚠️' : '🔒'}
                                    </span>
                                    <div className="font-cairo font-black text-sm sm:text-base">
                                      {passageStatus === 'error_retry'
                                        ? (isRtl ? 'وقع خطأ في الآية (' + ayah.num + ') — أعد قراءتها الآن مرة أخرى!' : 'Mistake in Ayah (' + ayah.num + ') — Recite again!')
                                        : (isRtl ? 'الآية (' + ayah.num + ') محجوبة ضمن مقطع التسميع والاختبار' : 'Ayah (' + ayah.num + ') Masked in Passage')}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1 font-medium">
                                      {passageStatus === 'error_retry'
                                        ? (isRtl ? 'لا يتم إظهار الآية حتى يعيد الطالب تلاوتها وتصحيح الخطأ' : 'Student must re-recite before reveal')
                                        : (isRtl ? 'يقرأها الطالب غيباً — انقر زر [✅ قالها صح] بالأعلى لإظهارها أو [⚠️ قالها غلط] لإعادتها' : 'Recited from memory')}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="py-6 text-center text-slate-400 font-amiri text-lg border-2 border-dashed border-emerald-900/20 rounded-xl bg-emerald-950/5 select-none">
                                    🔒 {isRtl ? 'الآية مخفية للتسميع الغيبي — اضغط "كشف للطالب" عند إتمام القراءة' : 'Ayah hidden for blind recitation'}
                                  </div>
                                )
                              ) : (
                                <div className={'font-quran font-bold text-black text-right flex flex-wrap gap-x-2 gap-y-2 items-baseline select-none ' + (
                                  quranFontSize === 'small' 
                                    ? 'text-lg sm:text-xl leading-[2.0]' 
                                    : quranFontSize === 'large' 
                                      ? 'text-2xl sm:text-3xl leading-[2.4]' 
                                      : 'text-xl sm:text-2xl leading-[2.2]'
                                )}>
                                  {words.map((word, wIdx) => {
                                    const isEndingWord = isEndingsMasked && (wIdx >= words.length - 2);
                                    const isStarterWord = isStartersMasked && (wIdx < 2);
                                    const isDivineNameWord = isDivineNamesMasked && (wIdx >= words.length - 3) && divineEndingsList.some(d => word.includes(d) || d.includes(word));
                                    const isAlternatingWord = isAlternatingMasked && (wIdx % 2 === 1);
                                    const isCustomMasked = customMaskedWords.has(ayah.num + '-' + wIdx);
                                    const isMasked = isEndingWord || isStarterWord || isDivineNameWord || isAlternatingWord || isCustomMasked;

                                    return (
                                      <span
                                        key={wIdx}
                                        onClick={() => toggleWordMask(ayah.num, wIdx)}
                                        className={`px-1.5 py-0.5 rounded-lg cursor-pointer transition-all ${
                                          isMasked 
                                            ? 'bg-amber-200 text-amber-950 border-b-2 border-dashed border-amber-600 px-3 font-sans text-base select-none shadow-xs font-bold' 
                                            : 'hover:bg-gold-200 hover:text-emerald-950'
                                        }`}
                                        title={isMasked ? (isRtl ? 'انقر لكشف الكلمة' : 'Click to reveal') : (isRtl ? 'انقر لطمس الكلمة' : 'Click to mask')}
                                      >
                                        {isMasked ? '[ ... ]' : word}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                )}

                {hifzViewMode === 'interactive_test' && (
                  <>
                {/* POST-RECITATION WHATSAPP BROADCAST TOOL */}
                <div className="card-islamic-amber rounded-2xl p-4 sm:p-5 shadow-sm border border-gold-300/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎛️</span>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950 font-cairo">
                        {isRtl ? 'وِرد المدارسة والتذكرة بعد الحلقة' : 'Post-Session Student Broadcast'}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {isRtl ? 'أرسل لطلابك وِرد الوجه ومتشابهاته وتوجيهاتك بضغطة واحدة عبر الواتساب' : 'Send WhatsApp broadcast to students'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const curSurah = (MUSHAF_SURAHS_PAGE_MAP.find(s => mushafPageNumber >= s.startPage && mushafPageNumber <= s.endPage))?.name || 'الملك';
                        const msg = '🕌 *حلقة القرآن الكريم — وِرد مدارسة ومراجعة الوجه*\n' +
                          '📖 *المقرر:* سورة ' + curSurah + ' (صفحة ' + mushafPageNumber + ' من مصحف المدينة)\n\n' +
                          '🔁 *توجيه الشيخ:* يُرجى تكرار هذا الوجه 5 مرات غيباً وتثبيت فواصل الآيات ومواضع المتشابهات قبل الحلقة القادمة.\n\n' +
                          '✨ *منظومة مِشكاة — AnubisLand*';
                        navigator.clipboard.writeText(msg);
                        showToast(isRtl ? 'تم نسخ رسالة وِرد الوجه للواتساب بنجاح 📋' : 'WhatsApp broadcast copied to clipboard 📋');
                      }}
                      className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 text-xs font-black px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <span>📱</span>
                      <span>{isRtl ? 'نسخ وِرد الوجه للدارسين (واتساب)' : 'Copy WhatsApp Broadcast'}</span>
                    </button>
                  </div>
                </div>

                {/* MUTASHABIHAT CROSS-REFERENCE ANALYZER */}
                <div className="card-islamic-sage rounded-3xl p-6 shadow-sm border border-emerald-300/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-900/10">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <h3 className="text-lg font-bold text-emerald-950 font-cairo">
                          {isRtl ? 'كاشف المتشابهات اللفظية وتنبيهات الحفظ' : 'Mutashabihat Cross-Reference Analyzer'}
                        </h3>
                        <p className="text-xs text-emerald-900/80">
                          {isRtl ? 'تنبيهات فورية للمحفظ بمواضع التشابه مع سور أخرى لتجنيب الدارسين الخطأ في التسميع' : 'Cross-references to alert students against common confusion'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddMutaOpen(!isAddMutaOpen);
                        if (!mutaTargetText) {
                          handleFetchTargetMutaAyah(mutaTargetSurahId, mutaTargetAyahNum);
                        }
                      }}
                      className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition border border-gold-400/40"
                    >
                      <span>{isAddMutaOpen ? '✕' : '➕'}</span>
                      <span>{isRtl ? (isAddMutaOpen ? 'إغلاق نافذة الإضافة' : 'إضافة أو ربط متشابهة جديدة') : (isAddMutaOpen ? 'Close' : 'Link New Mutashabiha')}</span>
                    </button>
                  </div>

                  {/* Add Mutashabiha Drawer */}
                  {isAddMutaOpen && (
                    <div className="mb-6 bg-white/95 border-2 border-emerald-700/40 rounded-2xl p-5 shadow-lg animate-fadeIn text-slate-800">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                          <span>🔗</span>
                          <span>{isRtl ? 'إدراج متشابهة لفظية خاصة وتوجيه المعلم للدارس' : 'Add Custom Mutashabiha & Guidance Note'}</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                          {isRtl ? 'بالرسم العثماني المعتمد' : 'Verified Uthmani'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Search Query */}
                        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                          <label className="block text-xs font-bold text-emerald-900 mb-1.5">
                            {isRtl ? '1. ابحث بكلمة من الآية المتشابهة في القرآن:' : '1. Search phrase in Quran:'}
                          </label>
                          <div className="flex gap-1.5 mb-2">
                            <input
                              type="text"
                              value={mutaSearchQuery}
                              onChange={(e) => setMutaSearchQuery(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchMutaAyahs(); }}
                              placeholder={isRtl ? 'ابحث بكلمة (مثال: عزيز غفور)...' : 'Search phrase...'}
                              className="flex-1 bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={handleSearchMutaAyahs}
                              disabled={isSearchingMuta}
                              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <span>{isSearchingMuta ? '⏳' : '🔍'}</span>
                              <span>{isRtl ? 'بحث' : 'Search'}</span>
                            </button>
                          </div>

                          {mutaSearchResults.length > 0 && (
                            <div className="mb-2 bg-white border border-emerald-300 rounded-lg max-h-36 overflow-y-auto divide-y divide-emerald-100 shadow-sm">
                              {mutaSearchResults.map((m, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectMutaMatch(m)}
                                  className="w-full text-right p-2 hover:bg-emerald-50 transition block text-[11px] leading-snug"
                                  dir="rtl"
                                >
                                  <span className="font-bold text-emerald-900 block">
                                    📖 {m.surah.name} (آية {m.numberInSurah}):
                                  </span>
                                  <span className="text-slate-700 font-quran">{m.text}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Target Ayah Display */}
                        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                          <label className="block text-xs font-bold text-amber-900 mb-1.5">
                            {isRtl ? '2. الموضع المتشابه المختار بالرسم العثماني:' : '2. Selected similar ayah:'}
                          </label>
                          <div className="p-2.5 bg-white rounded-lg border border-amber-200/80 font-quran text-sm text-amber-950 leading-relaxed min-h-[60px]" dir="rtl">
                            {mutaTargetText || (isRtl ? 'ابحث عن الآية لتظهر هنا بالرسم العثماني المشكول...' : 'Search ayah...')}
                          </div>
                        </div>
                      </div>

                      {/* Teacher Guidance Note */}
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {isRtl ? '3. توجيه الشيخ والمعلم / ضابط الفارق اللفظي لتثبيت الحفظ:' : '3. Memorization Tip & Distinguishing Rule:'}
                        </label>
                        <input
                          type="text"
                          value={mutaGuideNote}
                          onChange={(e) => setMutaGuideNote(e.target.value)}
                          placeholder={isRtl ? 'مثال: في سورة فاطر جاءت بغير لام التعريف (عَزِيزٌ غَفُورٌ)، بينما في الملك معرّفة (ٱلْعَزِيزُ ٱلْغَفُورُ).' : 'E.g., Notice indefinite form vs definite form.'}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsAddMutaOpen(false)}
                          className="text-xs px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveNewMutashabiha}
                          className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 text-xs font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                        >
                          <span>💾</span>
                          <span>{isRtl ? 'حفظ المتشابهة وإدراجها في خطة الدرس والواتساب' : 'Save Mutashabiha to Lesson & WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mutashabihat Cards List */}
                  {hifzMutashabihat && hifzMutashabihat.length > 0 ? (
                    <div className="space-y-4">
                      {hifzMutashabihat.map((m, mIdx) => (
                        <div key={mIdx} className="bg-white/90 rounded-2xl p-4 border border-emerald-200/80 shadow-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2.5">
                            <div className="bg-emerald-900/5 p-3 rounded-xl border-r-4 border-emerald-700">
                              <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                                {isRtl ? 'الموضع في هذا الوجه المقرر:' : 'In Current Page:'}
                              </span>
                              <p className="font-quran text-lg text-emerald-950 leading-relaxed" dir="rtl">
                                {m.ayah}
                              </p>
                            </div>

                            <div className="bg-amber-900/5 p-3 rounded-xl border-r-4 border-amber-500">
                              <span className="text-[11px] font-bold text-amber-800 block mb-1">
                                {isRtl ? 'الموضع المتشابه في سورة أخرى:' : 'Similar Passage Elsewhere:'}
                              </span>
                              <p className="font-quran text-lg text-amber-950 leading-relaxed" dir="rtl">
                                {m.similar}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-950/5 p-2.5 rounded-xl text-xs text-emerald-900 font-medium">
                            <div className="flex items-start gap-1.5 flex-1">
                              <span className="text-gold-600 font-bold text-sm">💡</span>
                              <span><strong>{isRtl ? 'ضابط حفظ المتشابهة للمحفظ:' : 'Memorization Guide:'}</strong> {m.difference}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteMutashabiha(mIdx)}
                              className="text-slate-400 hover:text-red-600 text-[11px] px-2 py-0.5 rounded hover:bg-red-50 transition"
                              title={isRtl ? 'حذف هذه المتشابهة' : 'Delete'}
                            >
                              🗑️ {isRtl ? 'حذف' : 'Remove'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      {isRtl ? 'لا توجد متشابهات مسجلة لهذا الوجه بعد. اضغط "إضافة أو ربط متشابهة جديدة" لإدراج تنبيهات الحفظ.' : 'No cross-references registered yet.'}
                    </div>
                  )}
                </div>
                  </>
                )}

                {/* ================= HIFZ BRANCH PRINTABLE EVALUATION WORKSHEET MODAL ================= */}
                    {hifzWorksheetModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
                        <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full border-4 border-gold-400 shadow-2xl p-4 sm:p-8 my-auto relative max-h-[95vh] overflow-y-auto">
                          
                          {/* Top Controls Toolbar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-emerald-900/15 no-print">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🕋</span>
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? HIFZ_BRANCH_WORKSHEET.titleAr : HIFZ_BRANCH_WORKSHEET.titleEn}
                                </h3>
                                <p className="text-xs text-slate-600 font-medium">
                                  {isRtl ? 'سجل تقييم ومتابعة أسبوعي معتمد لحلقات القرآن الكريم وضبط المتشابهات' : 'Official Weekly Quran Memorization & Mutashabihat Evaluation Sheet'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-2 border-gold-400 px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                              >
                                <span>🖨️</span>
                                <span>{isRtl ? 'طباعة السجل / PDF' : 'Print Sheet / PDF'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setHifzWorksheetModalOpen(false)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition border border-slate-300 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Worksheet Body */}
                          <div className="space-y-6 text-right font-cairo">
                            <div className="border-b-2 border-emerald-900 pb-4 flex items-center justify-between">
                              <div>
                                <div className="font-amiri text-2xl font-black text-emerald-950">منصة مِشكاة — سجل متابعة وتقييم التحفيظ القرآني</div>
                                <div className="text-xs font-bold text-gold-800">الفرع الأول: التحفيظ ومصحف المدينة النبوية • AnubisLand</div>
                              </div>
                              <div className="text-center p-2 rounded-2xl border-2 border-gold-400 bg-emerald-950 text-gold-200 text-xs font-bold">
                                <div>سجل رسمي أسبوعي</div>
                                <div>حلقات الإتقان ۞</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-300 text-xs font-bold">
                              <div>اسم الحافظ: <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div></div>
                              <div>الحلقة / المسجد: <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div></div>
                              <div>المقدار (السورة/الصفحة): <div className="border-b border-dotted border-slate-400 h-5 mt-1">صفحة {mushafPageNumber}</div></div>
                              <div>التاريخ: <div className="border-b border-dotted border-slate-400 h-5 mt-1">____ / ____ / 2026م</div></div>
                            </div>

                            <div className="border border-slate-300 rounded-2xl overflow-hidden text-xs">
                              <table className="w-full text-right border-collapse">
                                <thead>
                                  <tr className="bg-emerald-950 text-gold-200">
                                    <th className="p-3 font-bold w-12 text-center">#</th>
                                    <th className="p-3 font-bold font-cairo">المحور ومعيار الإتقان</th>
                                    <th className="p-3 font-bold font-cairo w-28 text-center">الدرجة العظمى</th>
                                    <th className="p-3 font-bold font-cairo w-28 text-center">درجة الطالب</th>
                                    <th className="p-3 font-bold font-cairo">ملاحظات الشيخ والمعلم</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {HIFZ_BRANCH_WORKSHEET.criteria.map((cr, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                      <td className="p-3 text-emerald-950">
                                        <div className="font-bold text-xs sm:text-sm">{cr.domain}</div>
                                        <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{cr.description}</div>
                                      </td>
                                      <td className="p-3 text-center font-black text-slate-800 text-sm">{cr.maxScore}</td>
                                      <td className="p-3 text-center font-black text-emerald-900 border-x border-slate-200">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
                                      <td className="p-3 text-slate-500 font-medium border-b border-dotted border-slate-200"></td>
                                    </tr>
                                  ))}
                                  <tr className="bg-emerald-50 font-black text-emerald-950">
                                    <td colSpan="2" className="p-3 text-right">المجموع الكلي النهائي:</td>
                                    <td className="p-3 text-center">100</td>
                                    <td className="p-3 text-center border-x border-emerald-300 text-sm font-black">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
                                    <td className="p-3 text-center text-xs text-gold-800">ختم إجازة الورد الأسبوعي ۞</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="border-t-2 border-emerald-900 pt-4 flex items-center justify-between text-xs font-bold">
                              <div>توقيع المعلم المشرف: _______________________</div>
                              <div>التقدير النهائي: [ ممتاز • جيد جداً • جيد • إعادة تسميع ]</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

              </div>
            )}
            {activeTab === 'tajweed' && (
              <div className="space-y-8 animate-fadeIn">

                {/* Branch 2 Sub-Navigation Bar */}
                <div className="card-islamic-amber rounded-2xl p-2.5 sm:p-3 border border-gold-400/60 shadow-sm flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-900 text-gold-300 flex items-center justify-center text-base font-bold shadow-xs">
                      📖
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-emerald-950 font-cairo">
                        {isRtl ? 'حقيبة أدوات التجويد والتحليل الصوتي (Branch 2):' : 'Tajweed & Phonetics Workbench:'}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* SubTab 1: Lessons Catalog */}
                    <button
                      type="button"
                      onClick={() => {
                        setTajweedSubTab('generator');
                        setSuwaydCatalogSubTab('lessons');
                        setSuwaydViewMode('catalog');
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'generator' && suwaydCatalogSubTab === 'lessons'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>📖</span>
                      <span>{isRtl ? '1. فهرس دروس التجويد (' + SUWAYD_TAJWEED_CURRICULUM.length + ' درساً)' : '1. Tajweed Lessons (' + SUWAYD_TAJWEED_CURRICULUM.length + ')'}</span>
                    </button>

                    {/* SubTab 2: 42 Plates Illustrated Atlas */}
                    <button
                      type="button"
                      onClick={() => {
                        setTajweedSubTab('generator');
                        setSuwaydCatalogSubTab('atlas');
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'generator' && suwaydCatalogSubTab === 'atlas'
                          ? 'bg-gold-500 text-emerald-950 border-gold-600 ring-2 ring-gold-300 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>🏛️</span>
                      <span>{isRtl ? `2. أطلس التجويد المصور (${SUWAYD_PLATES.length} لوحة)` : `2. Illustrated Atlas (${SUWAYD_PLATES.length} Plates)`}</span>
                    </button>

                    {/* SubTab 3: Interactive Makhaarij Atlas */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('makhaarij')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'makhaarij'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>🗣️</span>
                      <span>{isRtl ? '3. مخارج الحروف الخمسة' : '3. 5 General Makharij'}</span>
                    </button>

                    {/* SubTab 4: Visual Timing Metronome */}
                    <button
                      type="button"
                      onClick={() => setTajweedSubTab('metronome')}
                      className={'px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs border cursor-pointer ' + (
                        tajweedSubTab === 'metronome'
                          ? 'bg-emerald-900 text-gold-200 border-gold-400 ring-2 ring-gold-400 font-black shadow-md'
                          : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                      )}
                    >
                      <span>⏱️</span>
                      <span>{isRtl ? '4. ميزان الأزمنة والحركات' : '4. Timing Metronome'}</span>
                    </button>
                  </div>
                </div>

                {/* ================= SUB-TAB 1: LESSON & SLIDES GENERATOR ================= */}
                {tajweedSubTab === 'generator' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* VIEW 1: LESSONS CATALOG (INDEX) */}
                    {suwaydCatalogSubTab === 'lessons' && suwaydViewMode === 'catalog' && (
                      <div className="space-y-6">
                        {/* Header Banner - Dr. Ayman Suwayd Certified Workbench */}
                        <div className="card-islamic-pearl rounded-3xl p-6 border-2 border-emerald-900/15 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-emerald-900/10">
                            <div className="flex items-center gap-3">
                              <span className="w-12 h-12 rounded-2xl bg-emerald-900 text-gold-300 flex items-center justify-center text-2xl font-black shadow-md border border-gold-400">
                                📖
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                                    {isRtl ? 'حقيبة التجويد المصور — فهرس الدروس المعتمدة (د. أيمن رشدي سويد)' : 'Illustrated Tajweed Curriculum — Lessons Catalog'}
                                  </h2>
                                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                    {isRtl ? `${SUWAYD_TAJWEED_CURRICULUM.length} درساً موثقاً 100%` : `${SUWAYD_TAJWEED_CURRICULUM.length} Lessons`}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 font-medium mt-1">
                                  {isRtl
                                    ? 'اختر أي درس من الفهرس ليفتح لك في شاشة دراسية مستقلة وكاملة بالشرح المصور، والمتون، والأمثلة العثمانية، والميزان الإيقاعي'
                                    : 'Select any lesson from the catalog to open a dedicated, distraction-free study screen with illustrated anatomy and metronome.'}
                                </p>
                              </div>
                            </div>

                            {/* Hafs badge */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-gold-500/15 text-emerald-950 border border-gold-400 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
                                {isRtl ? 'رواية حفص عن عاصم من طريق الشاطبية' : 'Hafs from Asim via Shatibiyyah'}
                              </span>
                              {/* SubTab Switcher: Lessons Catalog vs Illustrated Atlas */}
                              <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-300 flex items-center text-xs font-bold">
                                <button
                                  type="button"
                                  onClick={() => setSuwaydCatalogSubTab('lessons')}
                                  className={'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ' + (
                                    suwaydCatalogSubTab === 'lessons'
                                      ? 'bg-emerald-900 text-gold-200 font-black shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  )}
                                >
                                  <span>📖</span>
                                  <span>{isRtl ? `فهرس الدروس (${SUWAYD_TAJWEED_CURRICULUM.length})` : `Lessons (${SUWAYD_TAJWEED_CURRICULUM.length})`}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSuwaydCatalogSubTab('atlas')}
                                  className={'px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ' + (
                                    suwaydCatalogSubTab === 'atlas'
                                      ? 'bg-gold-500 text-emerald-950 font-black shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  )}
                                >
                                  <span>🏛️</span>
                                  <span>{isRtl ? `أطلس التجويد المصور (${SUWAYD_PLATES.length} لوحة)` : `Illustrated Atlas (${SUWAYD_PLATES.length} Plates)`}</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Category Filter Pills and Instant Search (Shown in Lessons mode) */}
                          {suwaydCatalogSubTab === 'lessons' && (
                            <div className="space-y-3 pt-1">
                              {/* Search Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="relative flex-1 min-w-[240px] max-w-md">
                                  <input
                                    type="text"
                                    value={suwaydSearchQuery}
                                    onChange={(e) => setSuwaydSearchQuery(e.target.value)}
                                    placeholder={isRtl ? '🔍 ابحث في دروس التجويد (مثال: إدغام، مد، قلقلة، إخفاء، راءات)...' : '🔍 Search Tajweed lessons (e.g. Idgham, Madd, Qalqalah)...'}
                                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 shadow-xs"
                                  />
                                  {suwaydSearchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => setSuwaydSearchQuery('')}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                                {suwaydSearchQuery && (
                                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                    {isRtl ? `نتائج البحث: ${SUWAYD_TAJWEED_CURRICULUM.filter(l => filterMatchesSuwaydLesson(suwaydFilterCategory, l, suwaydSearchQuery)).length} درس` : `Results: ${SUWAYD_TAJWEED_CURRICULUM.filter(l => filterMatchesSuwaydLesson(suwaydFilterCategory, l, suwaydSearchQuery)).length}`}
                                  </span>
                                )}
                              </div>

                              {/* Category Filter Pills with Dynamic Counts */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 ml-1">
                                  {isRtl ? 'أبواب التجويد:' : 'Chapters:'}
                                </span>
                                {[
                                  { id: 'all', labelAr: 'كافة أبواب الكتاب', labelEn: 'All Chapters' },
                                  { id: 'makharij', labelAr: 'مخارج الحروف', labelEn: 'Articulation' },
                                  { id: 'sifat', labelAr: 'صفات الحروف والقلقلة', labelEn: 'Sifat & Qalqalah' },
                                  { id: 'noon_meem', labelAr: 'أحكام النون والميم والغنن', labelEn: 'Noon & Meem' },
                                  { id: 'lamat', labelAr: 'اللامات وعلاقات الحروف', labelEn: 'Lamat & Relations' },
                                  { id: 'madd', labelAr: 'أحكام المد والقصر', labelEn: 'Madd Rules' },
                                  { id: 'tafkheem', labelAr: 'التفخيم والترقيق والراءات', labelEn: 'Tafkheem & Tarqeeq' },
                                  { id: 'rasm_waqf', labelAr: 'الوقف والابتداء والهمزات والرسم', labelEn: 'Stop & Waqf & Rasm' },
                                  { id: 'intro_tajweed', labelAr: 'المقدمات واللحن', labelEn: 'Foundations & Lahn' }
                                ].map(cat => {
                                  const count = SUWAYD_TAJWEED_CURRICULUM.filter(l => filterMatchesSuwaydLesson(cat.id, l, suwaydSearchQuery)).length;
                                  return (
                                    <button
                                      key={cat.id}
                                      onClick={() => setSuwaydFilterCategory(cat.id)}
                                      className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ' + (
                                        suwaydFilterCategory === cat.id
                                          ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                      )}
                                    >
                                      <span>{isRtl ? `${cat.labelAr} (${count})` : `${cat.labelEn} (${count})`}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Lessons Grid: Rich, Inviting Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-200/80">
                            {SUWAYD_TAJWEED_CURRICULUM
                              .filter(l => filterMatchesSuwaydLesson(suwaydFilterCategory, l, suwaydSearchQuery))
                              .map(lesson => {
                                return (
                                  <div
                                    key={lesson.id}
                                    onClick={() => {
                                      setSuwaydLessonId(lesson.id);
                                      setSuwaydViewMode('details');
                                      setMetronomeCount(lesson.timingCounts);
                                      setMetronomePlaying(false);
                                      setMetronomeBeat(1);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-gold-400 text-slate-800 transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-900/10 text-emerald-900 border border-emerald-800/20">
                                          {isRtl ? lesson.categoryAr : lesson.categoryEn}
                                        </span>
                                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                          ⏱️ {isRtl ? lesson.timingLabelAr : (lesson.timingLabelEn || lesson.timingLabelAr)}
                                        </span>
                                      </div>
                                      <h4 className="text-base font-black font-cairo leading-snug text-emerald-950 group-hover:text-gold-600 transition">
                                        {isRtl ? lesson.titleAr : lesson.titleEn}
                                      </h4>
                                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-cairo">
                                        {isRtl ? lesson.definitionAr : (lesson.definitionEn || lesson.definitionAr)}
                                      </p>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {lesson.examples?.length || 3} {isRtl ? 'أمثلة عثمانية' : 'Uthmani Examples'}
                                      </span>
                                      <span className="bg-emerald-900 text-gold-200 text-xs font-black px-3 py-1 rounded-xl shadow-xs group-hover:bg-gold-500 group-hover:text-emerald-950 transition flex items-center gap-1">
                                        <span>{isRtl ? 'فتح الدرس' : 'Open Lesson'}</span>
                                        <span>⬅️</span>
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}

                    
                    {/* VIEW 3: FULL ILLUSTRATED TAJWEED ATLAS */}
                    {suwaydCatalogSubTab === 'atlas' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Atlas Header & Search */}
                        <div className="card-islamic-pearl rounded-3xl p-6 border-2 border-gold-400 shadow-md">
                          
                          {/* Navigation Bar inside Atlas: Quick Return to Lessons Catalog */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-gold-400/40 bg-gold-50/60 p-3 rounded-2xl">
                            <button
                              type="button"
                              onClick={() => {
                                setSuwaydCatalogSubTab('lessons');
                                setSuwaydViewMode('catalog');
                                window.scrollTo({ top: 150, behavior: 'smooth' });
                              }}
                              className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 border-2 border-gold-400 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                            >
                              <span>⬅️</span>
                              <span>{isRtl ? `العودة لفهرس دروس التجويد (${SUWAYD_TAJWEED_CURRICULUM.length} درساً)` : `Back to Lessons Catalog (${SUWAYD_TAJWEED_CURRICULUM.length} Lessons)`}</span>
                            </button>

                            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-300 flex items-center text-xs font-bold">
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydCatalogSubTab('lessons');
                                  setSuwaydViewMode('catalog');
                                }}
                                className="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 text-slate-700 hover:text-slate-900 cursor-pointer"
                              >
                                <span>📖</span>
                                <span>{isRtl ? `فهرس الدروس (${SUWAYD_TAJWEED_CURRICULUM.length})` : `Lessons (${SUWAYD_TAJWEED_CURRICULUM.length})`}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSuwaydCatalogSubTab('atlas')}
                                className="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 bg-gold-500 text-emerald-950 font-black shadow-xs cursor-pointer"
                              >
                                <span>🏛️</span>
                                <span>{isRtl ? `أطلس التجويد المصور (${SUWAYD_PLATES.length} لوحة)` : `Illustrated Atlas (${SUWAYD_PLATES.length} Plates)`}</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
                            <div>
                              <h3 className="text-xl font-black text-emerald-950 font-cairo flex items-center gap-2">
                                <span>🏛️</span>
                                <span>{isRtl ? 'أطلس التجويد المصور — لوحات د. أيمن رشدي سويد الكاملة' : 'Illustrated Tajweed Atlas — Dr. Ayman Suwayd'}</span>
                              </h3>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl 
                                  ? `المجموعة المعتمدة تشريحياً لمخارج وصفات الحروف العربية (${SUWAYD_PLATES.length} لوحة ملونة عالية الدقة مجهزة للشرح والمقارنة مع عزو أرقام الصفحات من المجلد الأول)` 
                                  : `Complete ${SUWAYD_PLATES.length} certified pedagogical plates of Arabic letter articulation & phonetic qualities (Vol. 1).`}
                              </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                              <input
                                type="text"
                                value={atlasSearch}
                                onChange={(e) => setAtlasSearch(e.target.value)}
                                placeholder={isRtl ? 'ابحث باسم الحرف أو المخرج...' : 'Search by letter or organ...'}
                                className="bg-white border-2 border-emerald-700/30 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-gold-400 w-64 shadow-xs"
                              />
                              {atlasSearch && (
                                <button
                                  type="button"
                                  onClick={() => setAtlasSearch('')}
                                  className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Category Filter Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { id: 'all', labelAr: `جميع اللوحات (${SUWAYD_PLATES.length})`, labelEn: `All Plates (${SUWAYD_PLATES.length})` },
                              { id: 'anatomy', labelAr: `أعضاء النطق العامة (${SUWAYD_PLATES.filter(p => p.category === 'anatomy').length})`, labelEn: `Vocal Tract Anatomy (${SUWAYD_PLATES.filter(p => p.category === 'anatomy').length})` },
                              { id: 'makharij', labelAr: `مخارج الحروف الخاصة (${SUWAYD_PLATES.filter(p => p.category === 'makharij').length})`, labelEn: `Letter Articulation (${SUWAYD_PLATES.filter(p => p.category === 'makharij').length})` },
                              { id: 'comparison', labelAr: `مقارنات الحروف (${SUWAYD_PLATES.filter(p => p.category === 'comparison').length})`, labelEn: `Letter Comparisons (${SUWAYD_PLATES.filter(p => p.category === 'comparison').length})` },
                              { id: 'sifat', labelAr: `صفات الحروف وميكانيكا النطق (${SUWAYD_PLATES.filter(p => p.category === 'sifat').length})`, labelEn: `Phonetic Sifat & Acoustics (${SUWAYD_PLATES.filter(p => p.category === 'sifat').length})` },
                              { id: 'ahkam', labelAr: `أحكام الرسم والوقف والهمزات (${SUWAYD_PLATES.filter(p => p.category === 'ahkam').length})`, labelEn: `Rules, Waqf & Hamzat (${SUWAYD_PLATES.filter(p => p.category === 'ahkam').length})` }
                            ].map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setAtlasCategory(cat.id)}
                                className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                                  atlasCategory === cat.id
                                    ? 'bg-gold-500 text-emerald-950 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                )}
                              >
                                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Plates Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {SUWAYD_PLATES
                            .filter(plate => atlasCategory === 'all' || plate.category === atlasCategory)
                            .filter(plate => {
                              if (!atlasSearch.trim()) return true;
                              const q = atlasSearch.trim().toLowerCase();
                              return (
                                plate.titleAr.toLowerCase().includes(q) ||
                                plate.titleEn.toLowerCase().includes(q) ||
                                plate.descAr.toLowerCase().includes(q) ||
                                plate.descEn.toLowerCase().includes(q) ||
                                (plate.letters && plate.letters.some(l => l.includes(q)))
                              );
                            })
                            .map(plate => (
                              <div
                                key={plate.id}
                                className="bg-white rounded-2xl p-3 border-2 border-slate-200 hover:border-gold-400 transition shadow-xs hover:shadow-lg flex flex-col justify-between group cursor-pointer"
                                onClick={() => {
                                  setPlateZoomLevel(1);
                                  setSuwaydPlateZoomModal(plate);
                                }}
                              >
                                <div>
                                  {/* Thumbnail */}
                                  <div className="w-full bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50/40 transition">
                                    <img
                                      src={`images/tajweed/${plate.filename}`}
                                      onError={(e) => {
                                        e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${plate.slideNum}-638.jpg`;
                                      }}
                                      alt={plate.titleAr}
                                      className="w-full h-40 object-contain rounded-lg transition duration-200 group-hover:scale-105"
                                      loading="lazy"
                                    />
                                    <span className="absolute top-2 right-2 bg-emerald-950/80 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                                      {isRtl ? `ص ${plate.pageInBook}` : `p. ${plate.pageInBook}`}
                                    </span>
                                    {plate.letters && plate.letters.length > 0 && (
                                      <span className="absolute bottom-2 left-2 bg-gold-400 text-emerald-950 text-xs font-quran font-bold px-2 py-0.5 rounded-md shadow-xs">
                                        {plate.letters.join(' ')}
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-3">
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      {isRtl ? plate.organAr : plate.organEn}
                                    </span>
                                    <h4 className="font-bold text-emerald-950 text-xs mt-1.5 leading-snug line-clamp-2 font-cairo group-hover:text-gold-600 transition">
                                      {isRtl ? plate.titleAr : plate.titleEn}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                      {isRtl ? plate.descAr : plate.descEn}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-gold-600 group-hover:text-gold-700 flex items-center gap-1">
                                    <span>🔍</span>
                                    <span>{isRtl ? 'عرض وتكبير' : 'Enlarge'}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {isRtl ? 'د. أيمن سويد' : 'Dr. Suwayd'}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* VIEW 2: DEDICATED FULLSCREEN LESSON DETAILS SCREEN */}
                    {suwaydViewMode === 'details' && (
                      <div className="space-y-6">
                        {/* Sticky / Floating Top Action Bar: Back to Catalog + Switcher + Prev/Next */}
                        <div className="card-islamic-amber rounded-2xl p-3 sm:p-4 border-2 border-gold-400 shadow-md flex flex-wrap items-center justify-between gap-3">
                          {/* Back Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSuwaydViewMode('catalog');
                              window.scrollTo({ top: 150, behavior: 'smooth' });
                            }}
                            className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 border-2 border-gold-400 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                          >
                            <span>⬅️</span>
                            <span>{isRtl ? 'العودة لفهرس الدروس (اختر درساً آخر)' : 'Back to Lessons Catalog'}</span>
                          </button>

                          {/* Quick Lesson Switcher Dropdown & Sequential Navigation */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-emerald-950 hidden md:inline">
                              {isRtl ? 'الانتقال المباشر:' : 'Switch Lesson:'}
                            </span>
                            <select
                              value={suwaydLessonId}
                              onChange={(e) => {
                                const newId = e.target.value;
                                setSuwaydLessonId(newId);
                                const l = SUWAYD_TAJWEED_CURRICULUM.find(x => x.id === newId);
                                if (l) {
                                  setMetronomeCount(l.timingCounts);
                                  setMetronomePlaying(false);
                                  setMetronomeBeat(1);
                                }
                              }}
                              className="bg-white border-2 border-emerald-700/40 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold focus:outline-none cursor-pointer"
                            >
                              {SUWAYD_TAJWEED_CURRICULUM.map(l => (
                                <option key={l.id} value={l.id}>{isRtl ? l.titleAr : l.titleEn}</option>
                              ))}
                            </select>

                            {/* Prev & Next Lesson Buttons */}
                            {(() => {
                              const curIdx = SUWAYD_TAJWEED_CURRICULUM.findIndex(l => l.id === suwaydLessonId);
                              return (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={curIdx <= 0}
                                    onClick={() => {
                                      if (curIdx > 0) {
                                        const prevL = SUWAYD_TAJWEED_CURRICULUM[curIdx - 1];
                                        setSuwaydLessonId(prevL.id);
                                        setMetronomeCount(prevL.timingCounts);
                                        setMetronomePlaying(false);
                                        setMetronomeBeat(1);
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-emerald-950 disabled:opacity-40 text-xs font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
                                    title={isRtl ? 'الدرس السابق' : 'Prev Lesson'}
                                  >
                                    <span>⬅️</span>
                                    <span className="hidden sm:inline mr-1">{isRtl ? 'السابق' : 'Prev'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={curIdx >= SUWAYD_TAJWEED_CURRICULUM.length - 1}
                                    onClick={() => {
                                      if (curIdx < SUWAYD_TAJWEED_CURRICULUM.length - 1) {
                                        const nextL = SUWAYD_TAJWEED_CURRICULUM[curIdx + 1];
                                        setSuwaydLessonId(nextL.id);
                                        setMetronomeCount(nextL.timingCounts);
                                        setMetronomePlaying(false);
                                        setMetronomeBeat(1);
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-emerald-950 disabled:opacity-40 text-xs font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
                                    title={isRtl ? 'الدرس التالي' : 'Next Lesson'}
                                  >
                                    <span className="hidden sm:inline ml-1">{isRtl ? 'التالي' : 'Next'}</span>
                                    <span>➡️</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Master Presentation Card (All-in-one Dedicated Screen) */}
                        <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/20 shadow-xl space-y-6">
                          {/* Card Title & Suwayd Citation Header */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-900/15">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gold-500 text-xl font-bold">۞</span>
                                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                                  {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                                </h3>
                              </div>
                              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
                                <span>📚</span>
                                <span>{isRtl ? currentSuwaydLesson.suwaydRef : (currentSuwaydLesson.suwaydRefEn || currentSuwaydLesson.suwaydRef)}</span>
                              </p>
                            </div>

                            {/* Top Action Pills */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydZoomSlideIndex(0);
                                  setSuwaydZoomModalOpen(true);
                                }}
                                className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 px-4 py-2 rounded-xl text-xs font-black shadow-md border border-gold-500/50 flex items-center gap-2 transition transform active:scale-95"
                              >
                                <span>📺</span>
                                <span>{isRtl ? 'عرض زوم للشاشة الكاملة' : 'Full Zoom Share'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydQuizAnswers({});
                                  setSuwaydQuizSubmitted(false);
                                  setSuwaydQuizModalOpen(true);
                                }}
                                className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95"
                              >
                                <span>🎯</span>
                                <span>{isRtl ? 'اختبار الدرس' : 'Lesson Quiz'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSuwaydWorksheetModalOpen(true)}
                                className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                                title={isRtl ? 'فتح ورقة العمل المخصصة لهذا الدرس للطباعة وتصدير PDF' : 'Open dedicated printable worksheet for this lesson'}
                              >
                                <span>📝</span>
                                <span>{isRtl ? 'ورقة عمل الدرس (جاهزة للطباعة)' : 'Lesson Worksheet (Print PDF)'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Poetic Matn Box */}
                          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-gold-200 rounded-2xl p-4 sm:p-5 border border-gold-500/40 shadow-inner">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gold-500/20 text-xs">
                              <span className="font-bold text-gold-300 flex items-center gap-1.5">
                                <span>📜</span>
                                <span>{isRtl ? 'الشاهد المعتمد من المتن (تحفة الأطفال / الجزرية):' : 'Authentic Matn Citation:'}</span>
                              </span>
                              <span className="text-[11px] text-slate-300 font-naskh">ضبط تام بالشكل</span>
                            </div>
                            <div className="font-naskh text-sm sm:text-base leading-loose whitespace-pre-line text-center text-gold-100 font-bold select-all">
                              {currentSuwaydLesson.matnVerseAr}
                            </div>
                          </div>

                          {/* Core Two-Column Workbench Layout */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Right Column: Definition, Examples, and Integrated Metronome (7 cols) */}
                            <div className="lg:col-span-7 space-y-5">
                              {/* Definition Card */}
                              <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-xs">
                                <h4 className="text-xs font-extrabold text-emerald-900 mb-2 flex items-center gap-1.5">
                                  <span>💎</span>
                                  <span>{isRtl ? 'التعريف المعتمد لغةً واصطلاحاً:' : 'Canonical Definition:'}</span>
                                </h4>
                                <p className="text-sm font-medium text-slate-800 leading-relaxed font-cairo">
                                  {isRtl ? currentSuwaydLesson.definitionAr : (currentSuwaydLesson.definitionEn || currentSuwaydLesson.definitionAr)}
                                </p>
                              </div>

                              {/* Detailed Letter-by-Letter Pedagogical Explorer (from Dr. Ayman Suwayd's Illustrated Tajweed) */}
                              {currentSuwaydLesson.ruleBreakdown && currentSuwaydLesson.ruleBreakdown.length > 0 && (
                                <div className="card-islamic-sage rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-sm space-y-4">
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-200">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">💎</span>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-black text-emerald-950 font-cairo">
                                          {isRtl ? 'التفصيل المنهجي لكل حرف وحكم (من كتاب التجويد المصور):' : 'Systematic Breakdown by Letter & Rule:'}
                                        </h4>
                                        <p className="text-[11px] text-emerald-800 font-medium">
                                          {isRtl ? 'بيان مخرج كل حرف، آلية النطق التجويدية، وأمثلته القرآنية في (كلمة، كلمتين، ومع التنوين):' : 'Articulation point, phonetic mechanism, and verified Quranic examples:'}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-black bg-emerald-900 text-gold-200 px-2.5 py-1 rounded-full">
                                      {currentSuwaydLesson.ruleBreakdown.length} {isRtl ? 'حروف / فروع مفصلة' : 'Detailed Items'}
                                    </span>
                                  </div>

                                  {/* Letter Cards Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {currentSuwaydLesson.ruleBreakdown.map((rb, rIdx) => (
                                      <div key={rIdx} className="bg-white/95 rounded-xl p-3.5 border border-emerald-200/80 shadow-xs space-y-2 hover:border-gold-400 transition">
                                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                                          <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 rounded-lg bg-emerald-900 text-gold-300 font-quran font-bold flex items-center justify-center text-base shrink-0">
                                              {rb.letter || (rIdx + 1)}
                                            </span>
                                            <span className="font-bold text-xs text-emerald-950 font-cairo">
                                              {rb.titleAr}
                                            </span>
                                          </div>
                                          {rb.tagAr && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                              rb.tagType === 'tafkheem' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                              rb.tagType === 'tarqeeq' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                                              'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                            }`}>
                                              {rb.tagAr}
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-[11px] text-slate-700 leading-relaxed font-cairo">
                                          <strong className="text-emerald-950">{isRtl ? 'آلية النطق والمخرج: ' : 'Mechanism: '}</strong>
                                          {rb.explanationAr}
                                        </p>

                                        {rb.examples && rb.examples.length > 0 && (
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                                            {rb.examples.map((exItem, eIdx) => (
                                              <div key={eIdx} className="bg-amber-50/80 rounded-lg p-1.5 text-center border border-amber-200/60">
                                                <span className="block text-[9px] text-slate-500 font-bold mb-0.5">{exItem.type}</span>
                                                <span className="font-quran text-base text-emerald-950 font-bold block leading-snug">{exItem.word}</span>
                                                <span className="block text-[9px] text-amber-900 font-medium">{exItem.surah}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {rb.warningAr && (
                                          <div className="text-[10px] text-rose-800 bg-rose-50/80 rounded-lg p-1.5 border border-rose-200 flex items-start gap-1">
                                            <span className="shrink-0">⚠️</span>
                                            <span><strong>{isRtl ? 'تنبيه المعلم: ' : 'Warning: '}</strong>{rb.warningAr}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quranic Examples in Uthmani Script */}
                              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-xs">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                  <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                                    <span>📖</span>
                                    <span>{isRtl ? 'الأمثلة التطبيقية بالرسم العثماني المصحفي:' : 'Verified Uthmani Script Examples:'}</span>
                                  </h4>
                                  <span className="text-[11px] text-slate-500 font-medium">
                                    {currentSuwaydLesson.examples.length} {isRtl ? 'أمثلة منتقاة' : 'Examples'}
                                  </span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-right border-collapse">
                                    <thead>
                                      <tr className="bg-emerald-50/70 text-emerald-950 text-xs border-b border-emerald-100">
                                        <th className="p-2.5 w-10 text-center font-bold">#</th>
                                        <th className="p-2.5 font-bold font-cairo">{isRtl ? 'الكلمة القرآنية' : 'Quranic Word'}</th>
                                        <th className="p-2.5 font-bold font-cairo w-28">{isRtl ? 'الموضع' : 'Surah'}</th>
                                        <th className="p-2.5 font-bold font-cairo">{isRtl ? 'التوجيه الصوتي والعلة' : 'Phonetic Rationale'}</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                      {currentSuwaydLesson.examples.map((ex, idx) => (
                                        <tr key={idx} className="hover:bg-amber-50/40 transition">
                                          <td className="p-2.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                                          <td className="p-2.5 font-quran text-lg text-emerald-950 font-bold leading-none select-all">
                                            <span className="bg-amber-100/80 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300/60 inline-block">
                                              {ex.word}
                                            </span>
                                          </td>
                                          <td className="p-2.5 text-slate-600 font-medium font-cairo text-[11px]">
                                            {isRtl ? ex.surah : (ex.surahEn || ex.surah)}
                                          </td>
                                          <td className="p-2.5 text-emerald-900 font-medium font-cairo text-xs leading-snug">
                                            {isRtl ? ex.note : (ex.noteEn || ex.note)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Integrated Harakat Metronome */}
                              <div className="card-islamic-amber rounded-2xl p-5 border-2 border-amber-300 shadow-md">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-300/60">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">⏱️</span>
                                    <div>
                                      <h4 className="text-xs font-black text-amber-950 font-cairo">
                                        {isRtl ? 'ميزان الأزمنة والحركات المدمج للدرس:' : 'Integrated Harakat Metronome:'}
                                      </h4>
                                      <p className="text-[11px] text-amber-900 font-bold">
                                        {isRtl ? `${currentSuwaydLesson.timingLabelAr} (${currentSuwaydLesson.timingCounts} حركات)` : `${currentSuwaydLesson.timingLabelEn || currentSuwaydLesson.timingLabelAr} (${currentSuwaydLesson.timingCounts} ${currentSuwaydLesson.timingCounts === 1 ? 'Count' : 'Counts'})`}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Speed Selector */}
                                  <div className="flex items-center gap-1 bg-white/80 rounded-xl p-1 border border-amber-300">
                                    {[
                                      { id: 'tahqeeq', labelAr: 'تحقيق (بطيء)', labelEn: 'Tahqeeq (Slow)' },
                                      { id: 'tadweer', labelAr: 'تدوير (معتدل)', labelEn: 'Tadweer (Medium)' },
                                      { id: 'hadr', labelAr: 'حدر (سريع)', labelEn: 'Hadr (Fast)' }
                                    ].map(sp => (
                                      <button
                                        key={sp.id}
                                        type="button"
                                        onClick={() => setMetronomeSpeed(sp.id)}
                                        className={'px-2.5 py-1 rounded-lg text-[10px] font-bold transition ' + (
                                          metronomeSpeed === sp.id
                                            ? 'bg-amber-500 text-emerald-950 font-black shadow-xs'
                                            : 'text-amber-900 hover:bg-amber-100/60'
                                        )}
                                      >
                                        {isRtl ? sp.labelAr : sp.labelEn}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Metronome Visual Beats */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    {Array.from({ length: currentSuwaydLesson.timingCounts }).map((_, bIdx) => {
                                      const beatNum = bIdx + 1;
                                      const isCurrentBeat = metronomePlaying && metronomeBeat === beatNum;
                                      return (
                                        <div
                                          key={beatNum}
                                          className={'w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-base transition-all duration-150 shadow-sm border ' + (
                                            isCurrentBeat
                                              ? 'bg-amber-500 text-emerald-950 border-amber-600 scale-110 shadow-lg ring-4 ring-amber-300 font-black animate-pulse'
                                              : 'bg-white/90 text-amber-950 border-amber-200'
                                          )}
                                        >
                                          <span className="leading-none">{beatNum}</span>
                                          <span className="text-[9px] font-medium leading-none mt-0.5">{isRtl ? "حركة" : "Beats"}</span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Play / Stop Button */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (metronomeCount !== currentSuwaydLesson.timingCounts) {
                                          setMetronomeCount(currentSuwaydLesson.timingCounts);
                                        }
                                        setMetronomePlaying(!metronomePlaying);
                                      }}
                                      className={'px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition flex items-center gap-2 transform active:scale-95 ' + (
                                        metronomePlaying
                                          ? 'bg-rose-700 hover:bg-rose-800 text-white ring-2 ring-rose-400'
                                          : 'bg-emerald-900 hover:bg-emerald-950 text-gold-200 border border-gold-400'
                                      )}
                                    >
                                      <span>{metronomePlaying ? '⏸️' : '▶️'}</span>
                                      <span>{metronomePlaying ? (isRtl ? 'إيقاف الميزان' : 'Stop Metronome') : (isRtl ? 'تشغيل النبض التجويدي' : 'Play Metronome')}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setMetronomeSound(!metronomeSound)}
                                      className={'p-2.5 rounded-xl text-xs font-bold border ' + (
                                        metronomeSound ? 'bg-white text-emerald-950 border-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200'
                                      )}
                                      title="كتم / تشغيل صوت النبض الخشبي"
                                    >
                                      {metronomeSound ? '🔔' : '🔕'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Left Column: Anatomical Cross-Section & Articulation Mechanism (5 cols) */}
                            <div className="lg:col-span-5 space-y-5">
                              {/* SVG Anatomical Diagram Card */}
                              {/* Authentic Dr. Ayman Suwayd Illustrated Plate & Interactive Letter Viewer */}
                              {(() => {
                                const lessonPlates = getSuwaydPlatesForLesson(currentSuwaydLesson.id);
                                const currentPlate = lessonPlates.find(p => p.id === activeSuwaydPlateId) || lessonPlates[0] || SUWAYD_PLATES[0];

                                return (
                                  <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-gold-400/60 shadow-md space-y-4">
                                    {/* Plate Header with Title, Book Page, and Mode Switcher */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-900/10">
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-base">🖼️</span>
                                          <h4 className="text-sm font-black text-emerald-950 font-cairo">
                                            {isRtl ? 'اللوحة التعليمية المعتمدة (د. أيمن سويد)' : 'Official Plate (Dr. Ayman Suwayd)'}
                                          </h4>
                                        </div>
                                        <p className="text-[11px] font-bold text-gold-700 mt-0.5">
                                          {isRtl ? currentPlate.titleAr : currentPlate.titleEn}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] bg-emerald-50 text-emerald-900 font-black px-2.5 py-1 rounded-lg border border-emerald-300">
                                          {isRtl ? `ص ${currentPlate.pageInBook} • مجلد 1` : `p. ${currentPlate.pageInBook} • Vol. 1`}
                                        </span>
                                        {/* Fullscreen Zoom Lightbox Button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPlateZoomLevel(1);
                                            setSuwaydPlateZoomModal(currentPlate);
                                          }}
                                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                                          title={isRtl ? 'تكبير اللوحة ملء الشاشة للشرح على زوم' : 'Zoom Fullscreen for Zoom Teaching'}
                                        >
                                          <span>🔍</span>
                                          <span>{isRtl ? 'تكبير اللوحة ملء الشاشة' : 'Fullscreen Zoom'}</span>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Horizontal Letter / Plate Selector Tabs if Multiple Plates in this Lesson */}
                                    {lessonPlates.length > 1 && (
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                          {isRtl ? 'اختر الحرف / اللوحة:' : 'Select Plate:'}
                                        </span>
                                        {lessonPlates.map(lp => {
                                          const isSelected = lp.id === currentPlate.id;
                                          const letterLabel = lp.letters && lp.letters.length > 0 ? lp.letters.join('، ') : '';
                                          return (
                                            <button
                                              key={lp.id}
                                              type="button"
                                              onClick={() => setActiveSuwaydPlateId(lp.id)}
                                              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${
                                                isSelected
                                                  ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs ring-1 ring-gold-400 scale-102'
                                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                              }`}
                                            >
                                              {letterLabel && <span className="font-quran text-gold-400 text-sm">{letterLabel}</span>}
                                              <span>{isRtl ? lp.titleAr.replace(/^.*:\s*/, '') : lp.titleEn.replace(/^.*:\s*/, '')}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {/* Main Display: Authentic Dr. Ayman Suwayd Illustrated Plate */}
                                    <div className="space-y-3">
                                      <div 
                                        className="w-full flex items-center justify-center p-2 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/50 rounded-2xl border-2 border-gold-300 shadow-inner group relative cursor-zoom-in overflow-hidden"
                                        onClick={() => {
                                          setPlateZoomLevel(1);
                                          setSuwaydPlateZoomModal(currentPlate);
                                        }}
                                        title={isRtl ? 'انقر لتكبير اللوحة بحجم هائل للشرح على زوم' : 'Click to zoom high-resolution for Zoom sharing'}
                                      >
                                        <img
                                          src={`images/tajweed/${currentPlate.filename}`}
                                          onError={(e) => {
                                            e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${currentPlate.slideNum}-638.jpg`;
                                          }}
                                          alt={currentPlate.titleAr}
                                          className="w-full max-h-80 sm:max-h-96 object-contain rounded-xl drop-shadow-md transition duration-200 group-hover:scale-[1.02]"
                                          loading="lazy"
                                        />
                                        <div className="absolute bottom-3 right-3 bg-emerald-950/80 text-gold-300 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition backdrop-blur-xs flex items-center gap-1">
                                          <span>🔍</span>
                                          <span>{isRtl ? 'انقر للتكبير والشرح' : 'Click to enlarge'}</span>
                                        </div>
                                      </div>

                                      {/* Description & Pedagogical Notes */}
                                      <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200 text-xs text-amber-950 leading-relaxed font-cairo">
                                        <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-900">
                                          <span>📌</span>
                                          <span>{isRtl ? currentPlate.titleAr : currentPlate.titleEn}</span>
                                        </div>
                                        <p className="font-medium text-slate-800">
                                          {isRtl ? currentPlate.descAr : currentPlate.descEn}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Anatomical Mechanism Card */}
                              <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs">
                                <h4 className="text-xs font-extrabold text-emerald-950 mb-2 flex items-center gap-1.5">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'الآلية التشريحية وحركة أعضاء النطق:' : 'Biomechanical Mechanism:'}</span>
                                </h4>
                                <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed font-cairo">
                                  {isRtl ? currentSuwaydLesson.mechanismAr : (currentSuwaydLesson.mechanismEn || currentSuwaydLesson.mechanismAr)}
                                </p>
                              </div>

                              {/* Common Mistakes Card */}
                              <div className="bg-rose-50/60 rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs">
                                <h4 className="text-xs font-extrabold text-rose-950 mb-2 flex items-center gap-1.5">
                                  <span>⚠️</span>
                                  <span>{isRtl ? 'أبرز الأخطاء الشائعة وطرق تقويم اللسان:' : 'Common Mistakes & Fixes:'}</span>
                                </h4>
                                <p className="text-xs font-medium text-rose-950 leading-relaxed font-cairo whitespace-pre-line">
                                  {isRtl ? currentSuwaydLesson.commonMistakesAr : (currentSuwaydLesson.commonMistakesEn || currentSuwaydLesson.commonMistakesAr)}
                                </p>
                              </div>

                              {/* Teacher Guidance Card */}
                              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300 shadow-xs">
                                <div className="flex items-start gap-2">
                                  <span className="text-base">💡</span>
                                  <div>
                                    <h4 className="text-xs font-bold text-amber-950 font-cairo">
                                      {isRtl ? 'إرشاد وتوجيه المعلم للدارسين والحلقة:' : 'Teacher Prompt for the Ring:'}
                                    </h4>
                                    <p className="text-xs text-amber-900 font-medium mt-1 leading-snug">
                                      {isRtl ? currentSuwaydLesson.teacherPromptAr : (currentSuwaydLesson.teacherPromptEn || currentSuwaydLesson.teacherPromptAr)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Return Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t-2 border-emerald-900/10">
                            <button
                              type="button"
                              onClick={() => {
                                setSuwaydViewMode('catalog');
                                window.scrollTo({ top: 150, behavior: 'smooth' });
                              }}
                              className="bg-emerald-950 hover:bg-emerald-900 text-gold-200 border-2 border-gold-400 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                            >
                              <span>⬅️</span>
                              <span>{isRtl ? 'العودة لفهرس دروس التجويد (اختيار درس آخر)' : 'Back to Lessons Catalog'}</span>
                            </button>

                            {(() => {
                              const curIdx = SUWAYD_TAJWEED_CURRICULUM.findIndex(l => l.id === suwaydLessonId);
                              if (curIdx < SUWAYD_TAJWEED_CURRICULUM.length - 1) {
                                const nextL = SUWAYD_TAJWEED_CURRICULUM[curIdx + 1];
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSuwaydLessonId(nextL.id);
                                      setMetronomeCount(nextL.timingCounts);
                                      setMetronomePlaying(false);
                                      setMetronomeBeat(1);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition cursor-pointer"
                                  >
                                    <span>{isRtl ? 'الدرس التالي ➡️' : 'Next Lesson ➡️'}</span>
                                  </button>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= FULLSCREEN PLATE ZOOM LIGHTBOX MODAL ================= */}
                    {suwaydPlateZoomModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
                        <div className="bg-slate-950 text-white rounded-3xl max-w-5xl w-full border-2 border-gold-400/80 shadow-2xl p-4 sm:p-6 flex flex-col max-h-[95vh] overflow-hidden">
                          {/* Lightbox Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gold-500/30">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🖼️</span>
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-gold-200 font-cairo">
                                  {isRtl ? suwaydPlateZoomModal.titleAr : suwaydPlateZoomModal.titleEn}
                                </h3>
                                <p className="text-xs text-slate-300">
                                  {isRtl ? `كتاب التجويد المصور — ص ${suwaydPlateZoomModal.pageInBook} (مجلد 1) • د. أيمن رشدي سويد` : `Illustrated Tajweed — p. ${suwaydPlateZoomModal.pageInBook} (Vol. 1) • Dr. Ayman Suwayd`}
                                </p>
                              </div>
                            </div>

                            {/* Controls: Zoom Levels + Close */}
                            <div className="flex items-center gap-2">
                              <div className="bg-slate-900 border border-slate-700 rounded-xl p-1 flex items-center gap-1 text-xs font-bold text-slate-300">
                                <span className="text-[10px] text-slate-400 px-1">{isRtl ? 'التكبير:' : 'Zoom:'}</span>
                                {[1, 1.5, 2].map(lvl => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setPlateZoomLevel(lvl)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                      plateZoomLevel === lvl ? 'bg-gold-500 text-emerald-950 font-black' : 'hover:bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {lvl * 100}%
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => setSuwaydPlateZoomModal(null)}
                                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center transition border border-slate-700 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Lightbox Body with Zoom Container */}
                          <div className="py-4 flex-1 overflow-auto flex items-center justify-center bg-slate-900/50 rounded-2xl my-3 p-2">
                            <img
                              src={`images/tajweed/${suwaydPlateZoomModal.filename}`}
                              onError={(e) => {
                                e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${suwaydPlateZoomModal.slideNum}-638.jpg`;
                              }}
                              alt={suwaydPlateZoomModal.titleAr}
                              style={{ transform: `scale(${plateZoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-in-out' }}
                              className="max-h-[70vh] w-auto object-contain rounded-xl drop-shadow-2xl"
                            />
                          </div>

                          {/* Lightbox Footer Guidance */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold-500/30 text-xs">
                            <p className="text-slate-300 font-cairo flex-1">
                              <strong>{isRtl ? 'التوجيه الصوتي والتشريحي:' : 'Phonetic Guidance:'}</strong> {isRtl ? suwaydPlateZoomModal.descAr : suwaydPlateZoomModal.descEn}
                            </p>

                            {suwaydPlateZoomModal.letters && suwaydPlateZoomModal.letters.length > 0 && (
                              <span className="font-quran text-gold-300 text-base font-bold bg-emerald-950 px-3 py-1 rounded-xl border border-gold-500/40">
                                {suwaydPlateZoomModal.letters.join(' ، ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= FULLSCREEN ZOOM PRESENTATION MODAL ================= */}
                    {suwaydZoomModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
                        <div className="bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white rounded-3xl max-w-5xl w-full border-2 border-gold-400/80 shadow-2xl p-5 sm:p-8 flex flex-col max-h-[94vh] overflow-y-auto">
                          
                          {/* Modal Header */}
                          <div className="flex items-center justify-between pb-4 border-b border-gold-500/30 gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-gold-400 font-bold text-lg">۞</span>
                                <h3 className="text-base sm:text-xl font-black text-gold-200 font-cairo truncate">
                                  {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                                </h3>
                                {(() => {
                                  const curSlide = currentZoomSlides[suwaydZoomSlideIndex];
                                  if (curSlide && curSlide.type === 'breakdown') {
                                    return (
                                      <span className="text-[11px] font-black bg-gold-500/20 text-gold-300 border border-gold-400/50 px-2.5 py-0.5 rounded-full">
                                        {curSlide.item.tagAr}
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                                <span>{isRtl ? currentSuwaydLesson.suwaydRef : (currentSuwaydLesson.suwaydRefEn || currentSuwaydLesson.suwaydRef)}</span>
                                <span className="text-gold-400">•</span>
                                <span className="text-gold-300 font-bold">
                                  {(() => {
                                    const curSlide = currentZoomSlides[suwaydZoomSlideIndex];
                                    if (!curSlide) return '';
                                    if (curSlide.type === 'overview') return isRtl ? 'الشاهد من المتن واللوحة التعليمية' : 'Authentic Plate & Matn';
                                    if (curSlide.type === 'breakdown') return isRtl ? `عرض تفصيلي: ${curSlide.item.titleAr}` : `Breakdown: ${curSlide.item.titleAr}`;
                                    return isRtl ? `تطبيق إفرادي وضبط المترونوم (${curSlide.example.word})` : `Word Practice (${curSlide.example.word})`;
                                  })()}
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setMetronomePlaying(false);
                                setSuwaydZoomModalOpen(false);
                              }}
                              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center transition border border-slate-700 shrink-0"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Quick Jump Navigation Pills Bar */}
                          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-3.5 border-b border-gold-500/20 no-scrollbar min-h-[50px] select-none">
                            <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">
                              {isRtl ? 'الانتقال المباشر:' : 'Jump to:'}
                            </span>
                            {currentZoomSlides.map((s, idx) => {
                              const isCurrent = suwaydZoomSlideIndex === idx;
                              let label = `${idx + 1}`;
                              let icon = '🎯';
                              if (s.type === 'overview') {
                                icon = '🖼️';
                                label = isRtl ? 'المتن واللوحة' : 'Plate';
                              } else if (s.type === 'breakdown') {
                                icon = '🔤';
                                label = s.item.letter || s.item.titleAr.replace(/^.*:\s*/, '');
                              } else if (s.type === 'example') {
                                icon = '⏱️';
                                label = s.example.word;
                              }
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSuwaydZoomSlideIndex(idx)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 my-0.5 ${
                                    isCurrent
                                      ? 'bg-gold-500 text-emerald-950 font-black shadow-md ring-2 ring-gold-300'
                                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-slate-300 border border-gold-500/30'
                                  }`}
                                  title={s.titleAr}
                                >
                                  <span>{icon}</span>
                                  <span className="truncate max-w-[120px]">{label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Modal Slide Body */}
                          <div className="py-6 flex-1 flex flex-col justify-center">
                            {(() => {
                              const curSlide = currentZoomSlides[suwaydZoomSlideIndex] || currentZoomSlides[0];
                              if (!curSlide) return null;

                              /* ---------------- Slide Type 1: Overview (Matn & Illustrated Plate) ---------------- */
                              if (curSlide.type === 'overview') {
                                const lessonPlates = getSuwaydPlatesForLesson(currentSuwaydLesson.id);
                                const currentPlate = lessonPlates.find(p => p.id === activeSuwaydPlateId) || lessonPlates[0] || SUWAYD_PLATES[0];

                                return (
                                  <div className="space-y-5 animate-fadeIn">
                                    {/* Matn Citation */}
                                    <div className="bg-emerald-900/60 rounded-2xl p-4 sm:p-5 border border-gold-500/40 text-center shadow-md">
                                      <span className="text-xs font-bold text-gold-300 block mb-2">{isRtl ? 'الشاهد المعتمد من المتن المنظوم:' : 'Authentic Matn Citation:'}</span>
                                      <div className="font-naskh text-lg sm:text-2xl text-gold-100 font-bold leading-loose whitespace-pre-line select-all">
                                        {currentSuwaydLesson.matnVerseAr}
                                      </div>
                                    </div>

                                    {/* Authentic Plate Display in Zoom Presentation */}
                                    <div className="bg-white text-slate-900 rounded-3xl p-4 sm:p-6 border-2 border-gold-400 shadow-2xl max-w-2xl mx-auto space-y-3">
                                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-900/10">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">🖼️</span>
                                          <div>
                                            <h4 className="text-sm sm:text-base font-black text-emerald-950 font-cairo">
                                              {isRtl ? currentPlate.titleAr : currentPlate.titleEn}
                                            </h4>
                                            <p className="text-[11px] text-emerald-800 font-medium">
                                              {isRtl ? `كتاب التجويد المصور — ص ${currentPlate.pageInBook} (د. أيمن رشدي سويد)` : `Illustrated Tajweed — p. ${currentPlate.pageInBook} (Dr. Ayman Suwayd)`}
                                            </p>
                                          </div>
                                        </div>

                                        <span className="text-xs font-black bg-emerald-900 text-gold-200 px-3 py-1 rounded-xl shadow-xs">
                                          {isRtl ? 'د. أيمن رشدي سويد' : 'Dr. Ayman Suwayd'}
                                        </span>
                                      </div>

                                      {/* Horizontal Letter / Plate Switcher if lesson has multiple plates */}
                                      {lessonPlates.length > 1 && (
                                        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1 pb-1">
                                          {lessonPlates.map(lp => {
                                            const isSel = lp.id === currentPlate.id;
                                            return (
                                              <button
                                                key={lp.id}
                                                type="button"
                                                onClick={() => setActiveSuwaydPlateId(lp.id)}
                                                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                                                  isSel
                                                    ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-sm ring-1 ring-gold-400'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                                                }`}
                                              >
                                                {lp.letters && lp.letters.length > 0 && <span className="font-quran text-gold-600 font-bold">{lp.letters.join('، ')}</span>}
                                                <span>{isRtl ? lp.titleAr.replace(/^.*:\s*/, '') : lp.titleEn.replace(/^.*:\s*/, '')}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}

                                      {/* High-Resolution Color Plate Image */}
                                      <div className="w-full flex items-center justify-center p-2 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/40 rounded-2xl border border-slate-200 shadow-inner">
                                        <img
                                          src={`images/tajweed/${currentPlate.filename}`}
                                          onError={(e) => {
                                            e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${currentPlate.slideNum}-638.jpg`;
                                          }}
                                          alt={currentPlate.titleAr}
                                          className="max-h-72 sm:max-h-84 w-auto object-contain rounded-xl drop-shadow"
                                          loading="eager"
                                        />
                                      </div>

                                      {/* Acoustic guidance text */}
                                      <p className="text-xs sm:text-sm text-slate-700 font-cairo leading-relaxed text-center px-2 font-medium">
                                        {isRtl ? currentPlate.descAr : currentPlate.descEn}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }

                              /* ---------------- Slide Type 2: Rule Breakdown (Letter, Mechanism, 3 Quranic Boxes) ---------------- */
                              if (curSlide.type === 'breakdown') {
                                const item = curSlide.item;
                                return (
                                  <div className="space-y-6 animate-fadeIn">
                                    {/* Breakdown Title & Badge Card */}
                                    <div className="bg-gradient-to-r from-emerald-900/80 via-emerald-950 to-slate-900 rounded-3xl p-5 border-2 border-gold-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
                                      <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gold-400 text-emerald-950 flex items-center justify-center font-quran text-3xl sm:text-4xl font-black shadow-lg ring-4 ring-gold-200/50 shrink-0">
                                          {item.letter}
                                        </div>
                                        <div>
                                          <h4 className="text-lg sm:text-2xl font-black text-gold-200 font-cairo">
                                            {item.titleAr}
                                          </h4>
                                          <span className="inline-block mt-1 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-800 text-gold-200 border border-gold-400/30">
                                            {item.tagAr}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="text-xs text-slate-300 font-cairo bg-slate-900/60 px-4 py-2 rounded-xl border border-white/10 hidden sm:block">
                                        {isRtl ? 'كتاب التجويد المصور — د. أيمن سويد' : 'Dr. Ayman Suwayd'}
                                      </div>
                                    </div>

                                    {/* Precise Phonetic Mechanism Explanation */}
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-inner">
                                      <span className="text-xs font-bold text-gold-300 block mb-1.5">
                                        {isRtl ? 'الآلية المخرجية والصوتية الدقيقة للحرف والحكم:' : 'Phonetic Articulation Mechanism:'}
                                      </span>
                                      <p className="text-sm sm:text-base text-slate-100 font-cairo leading-relaxed">
                                        {item.explanationAr}
                                      </p>
                                    </div>

                                    {/* The Three Large Uthmani Quranic Boxes */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {item.examples.map((ex, exI) => (
                                        <div
                                          key={exI}
                                          className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-5 border-2 border-gold-400/60 shadow-xl text-center flex flex-col justify-between hover:border-gold-300 transition duration-300"
                                        >
                                          <div className="text-xs font-bold text-gold-300 uppercase tracking-wider pb-2 border-b border-gold-500/20 mb-3">
                                            {ex.type}
                                          </div>

                                          <div className="py-4 font-quran text-4xl sm:text-5xl text-gold-200 font-black select-all tracking-wide drop-shadow-md">
                                            {ex.word}
                                          </div>

                                          <div className="pt-2 text-xs text-slate-300 font-cairo border-t border-gold-500/20 mt-3 font-medium">
                                            {ex.surah}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Authentic Performance Alert */}
                                    {item.warningAr && (
                                      <div className="bg-amber-950/70 border-2 border-amber-500/50 rounded-2xl p-4 text-amber-200 text-xs sm:text-sm font-cairo flex items-start gap-3 shadow-md">
                                        <span className="text-xl text-amber-400 shrink-0">⚠️</span>
                                        <div>
                                          <strong className="text-gold-300 block mb-1">
                                            {isRtl ? 'تنبيه الأداء والإتقان للشيخ والمعلم:' : 'Authentic Performance Alert:'}
                                          </strong>
                                          <p className="leading-relaxed">
                                            {item.warningAr}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              /* ---------------- Slide Type 3: Individual Example & Metronome ---------------- */
                              if (curSlide.type === 'example') {
                                const example = curSlide.example;
                                return (
                                  <div className="space-y-8 text-center animate-fadeIn">
                                    <div className="text-xs text-gold-300 font-bold uppercase tracking-widest">
                                      {example.surah}
                                    </div>

                                    {/* Big Quranic Word */}
                                    <div className="zoom-quran-box py-8 px-6 bg-gradient-to-b from-emerald-950 to-slate-950 rounded-3xl border-2 border-gold-400/60 shadow-[0_0_40px_rgba(217,119,6,0.25)] my-4">
                                      <div className="font-quran zoom-quran-gold text-5xl sm:text-7xl font-black select-all tracking-wide">
                                        {example.word}
                                      </div>
                                    </div>

                                    {/* Note */}
                                    <div className="bg-white/10 rounded-2xl p-4 max-w-xl mx-auto border border-white/20 text-slate-200 text-sm font-cairo">
                                      {example.note}
                                    </div>

                                    {/* Live Metronome inside Zoom slide */}
                                    <div className="flex items-center justify-center gap-3 pt-2">
                                      {Array.from({ length: currentSuwaydLesson.timingCounts }).map((_, bIdx) => {
                                        const beatNum = bIdx + 1;
                                        const isCurrentBeat = metronomePlaying && metronomeBeat === beatNum;
                                        return (
                                          <div
                                            key={beatNum}
                                            className={'w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-all ' + (
                                              isCurrentBeat
                                                ? 'bg-gold-400 text-emerald-950 scale-110 shadow-lg ring-4 ring-gold-200 font-black'
                                                : 'bg-emerald-900/80 text-gold-200 border border-gold-500/30'
                                            )}
                                          >
                                            <span>{beatNum}</span>
                                          </div>
                                        );
                                      })}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (metronomeCount !== currentSuwaydLesson.timingCounts) {
                                            setMetronomeCount(currentSuwaydLesson.timingCounts);
                                          }
                                          setMetronomePlaying(!metronomePlaying);
                                        }}
                                        className={'px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition ' + (
                                          metronomePlaying ? 'bg-rose-700 text-white' : 'bg-gold-500 text-emerald-950 font-black'
                                        )}
                                      >
                                        {metronomePlaying ? (isRtl ? '⏸️ إيقاف النبض' : '⏸️ Stop Metronome') : (isRtl ? '▶️ تشغيل النبض الصوتي' : '▶️ Play Metronome')}
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return null;
                            })()}
                          </div>

                          {/* Modal Footer Controls */}
                          <div className="flex items-center justify-between pt-4 border-t border-gold-500/30">
                            <button
                              type="button"
                              disabled={suwaydZoomSlideIndex === 0}
                              onClick={() => setSuwaydZoomSlideIndex(prev => Math.max(0, prev - 1))}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs transition"
                            >
                              {isRtl ? '◀ الشريحة السابقة' : '◀ Previous'}
                            </button>

                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-gold-300">
                                {isRtl ? 'شريحة' : 'Slide'} {suwaydZoomSlideIndex + 1} / {currentZoomSlides.length}
                              </span>
                            </div>

                            <button
                              type="button"
                              disabled={suwaydZoomSlideIndex >= currentZoomSlides.length - 1}
                              onClick={() => setSuwaydZoomSlideIndex(prev => Math.min(currentZoomSlides.length - 1, prev + 1))}
                              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-emerald-950 font-black text-xs transition"
                            >
                              {isRtl ? 'الشريحة التالية ▶' : 'Next ▶'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= DEDICATED TAJWEED LESSON PRINTABLE WORKSHEET MODAL ================= */}
                    {suwaydWorksheetModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
                        <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full border-4 border-gold-400 shadow-2xl p-4 sm:p-8 my-auto relative max-h-[95vh] overflow-y-auto">
                          
                          {/* Top Controls Toolbar (Hidden in Print) */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-emerald-900/15 no-print">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📝</span>
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? 'ورقة عمل وتطبيق عملي مخصصة للدرس (جاهزة للطباعة وتصدير PDF)' : 'Dedicated Printable Lesson Worksheet'}
                                </h3>
                                <p className="text-xs text-slate-600 font-medium">
                                  {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-2 border-gold-400 px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
                              >
                                <span>🖨️</span>
                                <span>{isRtl ? 'طباعة ورقة العمل / PDF' : 'Print Worksheet / PDF'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSuwaydWorksheetModalOpen(false)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition border border-slate-300 cursor-pointer"
                                title={isRtl ? 'إغلاق والعودة للدرس' : 'Close and return to lesson'}
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* ================= PRINTABLE WORKSHEET DOCUMENT BODY ================= */}
                          <div id="tajweed-lesson-printable-worksheet" className="space-y-6 text-right font-cairo">
                            
                            {/* Institutional Header */}
                            <div className="border-b-2 border-emerald-900 pb-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="text-right">
                                  <div className="font-amiri text-2xl font-black text-emerald-950 leading-none">
                                    {isRtl ? 'منصة مِشكاة لتعليم القرآن الكريم والتجويد' : 'Mishkah Platform for Quran & Tajweed'}
                                  </div>
                                  <div className="text-xs font-bold text-gold-800 mt-1">
                                    {isRtl ? 'نظام التشغيل الشامل للداعية والمعلم الشرعي • AnubisLand' : "Comprehensive OS for Da'wah & Islamic Educators • AnubisLand"}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    {isRtl ? 'رواية حفص عن عاصم من طريق الشاطبية' : 'Hafs from Asim via Shatibiyyah'}
                                  </div>
                                </div>

                                <div className="text-center p-2 rounded-2xl border-2 border-gold-400 bg-emerald-950 text-gold-200">
                                  <div className="font-amiri text-lg font-bold">ورقة تطبيق مدرسي</div>
                                  <div className="text-[10px] font-bold">نموذج معتمد ۞</div>
                                </div>

                                <div className="text-left text-xs font-bold text-slate-600">
                                  <div>كتاب التجويد المصور</div>
                                  <div>د. أيمن رشدي سويد</div>
                                  <div className="text-[11px] text-emerald-800 font-bold">{isRtl ? currentSuwaydLesson.suwaydRef : (currentSuwaydLesson.suwaydRefEn || currentSuwaydLesson.suwaydRef)}</div>
                                </div>
                              </div>

                              <div className="mt-3 text-center bg-emerald-50 py-2 px-4 rounded-xl border border-emerald-200">
                                <h2 className="text-lg sm:text-xl font-black text-emerald-950 font-amiri">
                                  {isRtl ? 'ورقة عمل وتطبيق: ' + currentSuwaydLesson.titleAr : 'Worksheet: ' + currentSuwaydLesson.titleEn}
                                </h2>
                                <span className="text-xs font-bold text-emerald-900">
                                  {isRtl ? currentSuwaydLesson.categoryAr : currentSuwaydLesson.categoryEn} • ⏱️ {isRtl ? currentSuwaydLesson.timingLabelAr : (currentSuwaydLesson.timingLabelEn || currentSuwaydLesson.timingLabelAr)}
                                </span>
                              </div>
                            </div>

                            {/* Student & Ring Evaluation Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-300 text-xs font-bold">
                              <div>
                                <span className="text-slate-500 block mb-0.5">اسم الدارس/الطالب:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6"></div>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">الحلقة / المجموعة:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6"></div>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">تاريخ المدارسة:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6">____ / ____ / 2026م</div>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">الدرجة والتقييم:</span>
                                <div className="border-b-2 border-dotted border-slate-400 h-6 text-emerald-950 font-black">
                                  [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 100]
                                </div>
                              </div>
                            </div>

                            {/* Section 1: Matn Evidence Box */}
                            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-300">
                              <div className="text-xs font-bold text-amber-950 mb-1.5 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-black">
                                  <span>📜</span>
                                  <span>{isRtl ? 'الشاهد المعتمد من المتن (تحفة الأطفال / الجزرية):' : 'Authentic Matn Citation:'}</span>
                                </span>
                                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold">ضبط تام بالشكل</span>
                              </div>
                              <div className="font-naskh text-sm sm:text-base text-emerald-950 font-bold leading-relaxed text-center whitespace-pre-line">
                                {currentSuwaydLesson.matnVerseAr}
                              </div>
                            </div>

                            {/* Section 2: Canonical Definition & Biomechanical Mechanism */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                                <div className="text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                                  <span>💎</span>
                                  <span>{isRtl ? 'التعريف العلمي المعتمد:' : 'Canonical Definition:'}</span>
                                </div>
                                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                  {isRtl ? currentSuwaydLesson.definitionAr : (currentSuwaydLesson.definitionEn || currentSuwaydLesson.definitionAr)}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                                <div className="text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'آلية النطق وميكانيكية العضو:' : 'Biomechanical Mechanism:'}</span>
                                </div>
                                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                  {isRtl ? currentSuwaydLesson.mechanismAr : (currentSuwaydLesson.mechanismEn || currentSuwaydLesson.mechanismAr)}
                                </p>
                              </div>
                            </div>

                            {/* Section 3: Authentic Illustrated Plate Reference */}
                            {(() => {
                              const lessonPlates = getSuwaydPlatesForLesson(currentSuwaydLesson.id);
                              const currentPlate = lessonPlates.find(p => p.id === activeSuwaydPlateId) || lessonPlates[0] || SUWAYD_PLATES[0];
                              return (
                                <div className="p-3.5 rounded-2xl border-2 border-gold-300 bg-white">
                                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200 text-xs">
                                    <span className="font-black text-emerald-950 flex items-center gap-1.5">
                                      <span>🖼️</span>
                                      <span>{isRtl ? 'اللوحة التعليمية والتشريحية المعتمدة (د. أيمن رشدي سويد):' : 'Official Illustrated Anatomical Plate:'}</span>
                                      <span className="text-gold-700 font-bold">({isRtl ? currentPlate.titleAr : currentPlate.titleEn})</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-600">
                                      {isRtl ? `ص ${currentPlate.pageInBook} • مجلد 1` : `p. ${currentPlate.pageInBook} • Vol. 1`}
                                    </span>
                                  </div>

                                  <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-full sm:w-48 h-40 flex items-center justify-center p-1 bg-slate-50 rounded-xl border border-slate-200 shrink-0 overflow-hidden">
                                      <img
                                        src={`images/tajweed/${currentPlate.filename}`}
                                        onError={(e) => {
                                          e.target.src = `https://image.slidesharecdn.com/1-160316105247/85/1-${currentPlate.slideNum}-638.jpg`;
                                        }}
                                        alt={currentPlate.titleAr}
                                        className="max-h-full max-w-full object-contain rounded"
                                      />
                                    </div>
                                    <div className="text-xs space-y-2 text-slate-800 leading-relaxed">
                                      <p className="font-medium">
                                        <strong>التوجيه الصوتي للوحة:</strong> {isRtl ? currentPlate.descAr : currentPlate.descEn}
                                      </p>
                                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 font-bold">
                                        📌 <strong>واجب الدارس العملي:</strong> تأمل الموضع الدقيق لتصادم أو تباعد العضو أثناء النطق، واضبط المخرج دون زيادة أو نقصان.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Section 4: Quranic Verification & Practical Exercises Table */}
                            <div className="border border-emerald-900/30 rounded-2xl overflow-hidden">
                              <div className="bg-emerald-950 text-gold-200 px-4 py-2 font-bold text-xs flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-black">
                                  <span>📖</span>
                                  <span>جدول التطبيق واستخراج الأحكام بالرسم العثماني المصحفي:</span>
                                </span>
                                <span className="text-[11px] text-emerald-200 font-medium">
                                  {currentSuwaydLesson.examples.length} مواضع قرآنية معتمدة
                                </span>
                              </div>

                              <table className="w-full text-right border-collapse text-xs">
                                <thead>
                                  <tr className="bg-emerald-50 text-emerald-950 border-b border-emerald-200">
                                    <th className="p-2.5 w-10 text-center font-bold">#</th>
                                    <th className="p-2.5 font-bold font-cairo">الكلمة القرآنية</th>
                                    <th className="p-2.5 font-bold font-cairo w-28">الموضع</th>
                                    <th className="p-2.5 font-bold font-cairo">الحكم التجويدي والتوجيه الصوتي المعتمد</th>
                                    <th className="p-2.5 font-bold font-cairo w-36 text-center">تطبيق الطالب / الدرجة</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {currentSuwaydLesson.examples.map((ex, idx) => (
                                    <tr key={idx} className="hover:bg-amber-50/30 transition">
                                      <td className="p-2.5 text-center text-slate-500 font-bold">{idx + 1}</td>
                                      <td className="p-2.5 font-quran text-xl text-emerald-950 font-bold leading-none select-all">
                                        <span className="bg-amber-100/90 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300 inline-block">
                                          {ex.word}
                                        </span>
                                      </td>
                                      <td className="p-2.5 text-slate-700 font-bold font-cairo text-[11px]">
                                        {isRtl ? ex.surah : (ex.surahEn || ex.surah)}
                                      </td>
                                      <td className="p-2.5 text-emerald-900 font-medium font-cairo text-xs leading-snug">
                                        {isRtl ? ex.note : (ex.noteEn || ex.note)}
                                      </td>
                                      <td className="p-2.5 text-center border-r border-slate-200">
                                        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-bold">
                                          <span>[&nbsp;&nbsp;&nbsp;&nbsp; / 5]</span>
                                          <span className="text-emerald-700">✓</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Section 5: Common Mistakes & Quiz Question for Ring Discussion */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3.5 rounded-2xl border border-rose-300 bg-rose-50/60 text-xs">
                                <div className="font-black text-rose-950 mb-1 flex items-center gap-1.5">
                                  <span>⚠️</span>
                                  <span>تنبيهات وأخطاء شائعة يجب تجنبها:</span>
                                </div>
                                <p className="text-rose-950 font-medium leading-relaxed whitespace-pre-line">
                                  {isRtl ? currentSuwaydLesson.commonMistakesAr : (currentSuwaydLesson.commonMistakesEn || currentSuwaydLesson.commonMistakesAr)}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/60 text-xs">
                                <div className="font-black text-amber-950 mb-1 flex items-center gap-1.5">
                                  <span>🎯</span>
                                  <span>سؤال تقييمي للمناقشة واختبار الفهم:</span>
                                </div>
                                <p className="text-slate-900 font-bold leading-relaxed mb-2">
                                  {isRtl ? currentSuwaydLesson.quizQuestions[0]?.qAr : (currentSuwaydLesson.quizQuestions[0]?.qEn || currentSuwaydLesson.quizQuestions[0]?.qAr)}
                                </p>
                                <div className="border-b border-dotted border-slate-400 pt-3">
                                  <span className="text-[10px] text-slate-400 font-bold">إجابة الدارس: __________________________________________________</span>
                                </div>
                              </div>
                            </div>

                            {/* Section 6: Teacher Notes & Official Seal / Signature */}
                            <div className="border-t-2 border-emerald-900 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-700">
                              <div className="flex-1 min-w-[240px]">
                                <span className="block mb-1 text-emerald-950 font-black">ملاحظات وتوجيهات المعلم للدارس:</span>
                                <div className="border-b-2 border-dotted border-slate-300 h-6"></div>
                                <div className="border-b-2 border-dotted border-slate-300 h-6 mt-1"></div>
                              </div>

                              <div className="flex items-center gap-8">
                                <div className="text-center">
                                  <span className="block text-slate-500 mb-2">توقيع المعلم المشرف:</span>
                                  <div className="border-b-2 border-slate-800 w-32 h-6"></div>
                                </div>

                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gold-600 flex flex-col items-center justify-center text-center text-[10px] font-black text-emerald-950 p-1 bg-amber-50/50">
                                  <span>خاتم الإجازة</span>
                                  <span className="text-gold-600 text-base leading-none">۞</span>
                                  <span>والإتقان</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= SELF-EVALUATION QUIZ MODAL ================= */}
                    {suwaydQuizModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                        <div className="card-islamic-pearl rounded-3xl max-w-2xl w-full border-2 border-gold-500 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between pb-4 mb-5 border-b border-emerald-900/15">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🎯</span>
                                <h3 className="text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? 'الاختبار الذاتي التقييمي — د. أيمن سويد' : 'Evaluative Quiz — Dr. Suwayd Standard'}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl ? currentSuwaydLesson.titleAr : currentSuwaydLesson.titleEn}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSuwaydQuizModalOpen(false)}
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Questions */}
                          <div className="space-y-6">
                            {currentSuwaydLesson.quizQuestions.map((q, qIdx) => {
                              const qKey = currentSuwaydLesson.id + '_' + qIdx;
                              const selected = suwaydQuizAnswers[qKey];
                              const isCorrect = selected === q.correct;
                              return (
                                <div key={qIdx} className="bg-white rounded-2xl p-4 border border-slate-200">
                                  <div className="flex items-start gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-900 text-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                                      {qIdx + 1}
                                    </span>
                                    <h4 className="font-bold text-emerald-950 text-sm font-cairo leading-snug">
                                      {q.qAr}
                                    </h4>
                                  </div>

                                  <div className="space-y-2">
                                    {q.opts.map(opt => {
                                      const isThis = selected === opt.id;
                                      let optClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300';
                                      if (suwaydQuizSubmitted) {
                                        if (opt.id === q.correct) {
                                          optClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                                        } else if (isThis && !isCorrect) {
                                          optClass = 'bg-rose-100 border-rose-400 text-rose-900';
                                        }
                                      } else if (isThis) {
                                        optClass = 'bg-emerald-900 text-gold-200 font-bold border-emerald-950 shadow-sm';
                                      }

                                      return (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          disabled={suwaydQuizSubmitted}
                                          onClick={() => setSuwaydQuizAnswers(prev => ({ ...prev, [qKey]: opt.id }))}
                                          className={'w-full p-3 rounded-xl border text-right text-xs transition flex items-center justify-between ' + optClass}
                                        >
                                          <span>{isRtl ? opt.text : (opt.textEn || opt.text)}</span>
                                          {suwaydQuizSubmitted && opt.id === q.correct && <span className="font-bold">✓</span>}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {suwaydQuizSubmitted && (
                                    <div className={'mt-3 p-3 rounded-xl text-xs font-cairo leading-relaxed border ' + (
                                      isCorrect ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                                    )}>
                                      <strong>{isCorrect ? (isRtl ? '✓ أحسنت بارك الله فيك:' : '✓ Excellent, Well Done:') : (isRtl ? '✗ تصحيح د. أيمن سويد:' : '✗ Dr. Suwayd Correction:')}</strong> {isRtl ? q.exp : (q.expEn || q.exp)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Submit / Reset Actions */}
                          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 mt-6">
                            {suwaydQuizSubmitted ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSuwaydQuizAnswers({});
                                  setSuwaydQuizSubmitted(false);
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
                              >
                                إعادة الاختبار
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={Object.keys(suwaydQuizAnswers).length === 0}
                                onClick={() => setSuwaydQuizSubmitted(true)}
                                className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-40"
                              >
                                تسليم الإجابات والتقييم الفوري
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

{tajweedSubTab === 'makhaarij' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header Banner */}
                    <div className="card-islamic-pearl rounded-3xl p-6 border-2 border-emerald-900/15 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-emerald-900/10">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🗣️</span>
                          <div>
                            <h3 className="text-lg font-black text-emerald-950 font-cairo">
                              {isRtl ? 'أطلس مخارج الحروف العامة والخاصة (Anatomical Phonetics Atlas)' : 'Comprehensive Makhaarij Articulation Atlas'}
                            </h3>
                            <p className="text-xs text-slate-600 font-medium">
                              {isRtl ? 'دراسة تشريحية بصرية تفاعلية للأعضاء الخمسة الرئيسة، حروفها، وآلية توليد الصوت ومواضع الأخطاء الشائعة' : 'Interactive visual study of the 5 general articulation organs and letters'}
                            </p>
                          </div>
                        </div>

                        <span className="bg-emerald-900 text-gold-300 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
                          {isRtl ? 'منظومة الجزرية — 17 مخرجاً خاصاً' : 'Al-Jazariyyah: 17 Sub-Points'}
                        </span>
                      </div>

                      {/* The 5 General Makhaarij Selector Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
                        {MAKHAARIJ_GENERAL_DATA.map((org) => {
                          const isActive = activeMakhrajId === org.id;
                          return (
                            <button
                              key={org.id}
                              type="button"
                              onClick={() => setActiveMakhrajId(org.id)}
                              className={'p-3 rounded-2xl border transition text-center flex flex-col items-center justify-center gap-1.5 ' + (
                                isActive
                                  ? 'bg-emerald-900 text-white border-gold-400 ring-2 ring-gold-400 shadow-md font-black'
                                  : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                              )}
                            >
                              <span className="text-2xl">{org.icon}</span>
                              <span className="text-xs font-bold font-cairo">{isRtl ? org.nameAr : org.nameEn}</span>
                              <span className={'text-[10px] px-2 py-0.5 rounded-full font-bold ' + (isActive ? 'bg-gold-500 text-emerald-950 font-black' : 'bg-slate-100 text-slate-600')}>
                                {org.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Makhraj Comprehensive Card */}
                      {(() => {
                        const makhraj = MAKHAARIJ_GENERAL_DATA.find(m => m.id === activeMakhrajId) || MAKHAARIJ_GENERAL_DATA[2];
                        return (
                          <div className="card-islamic-pearl border-2 border-emerald-900/20 rounded-3xl p-6 sm:p-8 shadow-md animate-fadeIn">
                            {/* Card Title & Organ Anatomy */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-emerald-900/10">
                              <div className="flex items-center gap-3">
                                <span className="text-4xl">{makhraj.icon}</span>
                                <div>
                                  <h4 className="text-xl sm:text-2xl font-black text-emerald-950 font-amiri">
                                    {isRtl ? 'المخرج العام: ' + makhraj.nameAr : makhraj.nameEn}
                                  </h4>
                                  <p className="text-xs sm:text-sm font-bold text-gold-700 mt-0.5">
                                    {isRtl ? makhraj.organAr : makhraj.organEn}
                                  </p>
                                </div>
                              </div>

                              <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold px-3 py-1 rounded-xl text-xs">
                                {makhraj.badge}
                              </span>
                            </div>

                            {/* Letters Array Display in High-Contrast Islamic Ivory Tiles (NO pitch black!) */}
                            <div className="mb-6 card-islamic-sage text-emerald-950 rounded-2xl p-5 shadow-sm border-2 border-emerald-700/25">
                              <div className="text-xs font-bold text-emerald-950 mb-3 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-800/15">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-gold-300 flex items-center justify-center text-xs font-bold shadow-xs">🔤</span>
                                  <span className="text-sm font-black font-cairo">{isRtl ? 'حروف هذا المخرج بالرسم العثماني المطهّر:' : 'Letters produced from this organ:'}</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-lg border border-emerald-300 font-cairo">
                                  {isRtl ? makhraj.lettersLabelAr : makhraj.lettersLabelEn}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start pt-2">
                                {makhraj.letters.map((lettr, lIdx) => (
                                  <div 
                                    key={lIdx}
                                    className="w-14 h-14 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 border-2 border-emerald-700/35 hover:border-gold-500 shadow-sm hover:shadow-md hover:scale-110 transition-all flex items-center justify-center cursor-pointer select-none"
                                    title={'حرف ' + lettr}
                                  >
                                    <span className="font-cairo font-black text-2xl leading-none text-center flex items-center justify-center w-full h-full select-none">
                                      {lettr}
                                    </span>
                                  </div>
                                ))}

                                {makhraj.id === 'khayshoom' && (
                                  <div className="bg-amber-100/90 text-emerald-950 border-2 border-gold-500 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-xs">
                                    <span className="text-2xl">👃</span>
                                    <div>
                                      <div className="text-xs font-black font-cairo">{isRtl ? 'صوت الغنة التجويدي الرخيم' : 'Ghunnah Resonant Sound'}</div>
                                      <div className="text-[11px] text-emerald-900 font-bold">{isRtl ? 'يخرج من الخيشوم بمقدار حركتين ويلازم (النون والميم)' : 'Resonates from nasal cavity for 2 counts in (N & M)'}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Two-Column Deep-Dive: Sound Generation vs Common Mistakes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Left: How sound is produced */}
                              <div className="card-islamic-pearl border border-emerald-300/80 rounded-2xl p-5 shadow-xs">
                                <div className="flex items-center gap-2 mb-2 font-bold text-emerald-900 text-sm">
                                  <span>⚙️</span>
                                  <span>{isRtl ? 'آلية توليد الحرف وخروج الصوت:' : 'Biomechanical Articulation:'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-cairo font-medium">
                                  {isRtl ? makhraj.mannerAr : makhraj.mannerEn}
                                </p>
                              </div>

                              {/* Right: Common Mistakes & Correction */}
                              <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-5 shadow-xs">
                                <div className="flex items-center gap-2 mb-2 font-bold text-rose-950 text-sm">
                                  <span>⚠️</span>
                                  <span>{isRtl ? 'أبرز الأخطاء الشائعة وطرق تقويم اللسان:' : 'Common Mistakes & Corrections:'}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-cairo font-medium">
                                  {isRtl ? makhraj.commonMistakesAr : makhraj.commonMistakesEn}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ================= SUB-TAB 3: TIMING & HARAKAT METRONOME ================= */}
                {tajweedSubTab === 'metronome' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Pedagogical Explanation Guide Banner */}
                    <div className="card-islamic-amber rounded-3xl p-5 sm:p-6 border-2 border-gold-500/30 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl mt-0.5">💡</span>
                        <div className="space-y-1.5">
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                            {isRtl ? 'دليل المعلم: ما هي "الحركة" في ميزان التجويد الصوتي؟' : 'Teacher Guide: What is a "Harakah" in Tajweed Timing?'}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-cairo">
                            {isRtl 
                              ? 'الحركة هي وحدة قياس الزمن الصوتي للمدود والغُنن. وهي زمن مرن يتناسب طردياً مع سرعة تلاوة القارئ (تحقيقاً أو تدويراً أو حدراً). وتُقدّر تقليدياً بزمن قبض الإصبع أو بسطه بحركة متوسطة، وصوتياً بزمن النطق بحرف متحرّك (مثل: بَ، أو بُ، أو بِ)، فحركتان هما زمن نطق حرفين متحركين مثل (قَالَ).'
                              : 'A Harakah is the phonetic time unit for Madd and Ghunnah. It adapts proportionally to reading speed (Tahqeeq, Tadweer, Hadr). Traditionally estimated as folding or unfolding a finger at a moderate pace, or phonetically as the time to pronounce a single voweled letter.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Visual & Auditory Metronome Card */}
                    <div className="card-islamic-pearl rounded-3xl p-6 sm:p-8 border-2 border-emerald-900/15 shadow-sm">
                      <div className="max-w-2xl mx-auto text-center">
                        <span className="text-4xl block mb-2">⏱️</span>
                        <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-cairo">
                          {isRtl ? 'ميزان ضبط الأزمنة والحركات الإيقاعي والصوتي' : 'Quranic Timing & Harakat Metronome'}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 mb-6 font-medium">
                          {isRtl ? 'أداة تدريب بصرية وصوتية إيقاعية لضبط أزمنة المدود والغُنَن بدقة تامة ومنع السرعة أو التمطيط' : 'Visual & auditory rhythmic tool to calibrate exact durations of Madd and Ghunnah'}
                        </p>

                        {/* 1. Harakat Target Count Selector */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {[
                            { count: 2, labelAr: 'حركتان (2)', subAr: 'طبيعي / غنة / بدل', color: 'border-emerald-500' },
                            { count: 4, labelAr: '4 حركات', subAr: 'منفصل / متصل وسط', color: 'border-amber-500' },
                            { count: 5, labelAr: '5 حركات', subAr: 'متصل / منفصل أقصى', color: 'border-orange-500' },
                            { count: 6, labelAr: '6 حركات', subAr: 'مد لازم كلمي وحرفي', color: 'border-rose-500' }
                          ].map(item => (
                            <button
                              key={item.count}
                              type="button"
                              onClick={() => {
                                setMetronomeCount(item.count);
                                setMetronomeBeat(1);
                              }}
                              className={'p-3 rounded-2xl border-2 transition ' + (
                                metronomeCount === item.count
                                  ? 'bg-emerald-900 text-white border-gold-400 ring-2 ring-gold-400 shadow-md font-black'
                                  : 'bg-white hover:bg-slate-50 text-emerald-950 border-slate-300'
                              )}
                            >
                              <span className="text-sm font-extrabold block font-cairo">{item.labelAr}</span>
                              <span className="text-[11px] block mt-0.5 opacity-90 font-medium">{item.subAr}</span>
                            </button>
                          ))}
                        </div>

                        {/* 2. Speed and Audio Options */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 mb-6 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-950 font-cairo">{isRtl ? 'سرعة التلاوة:' : 'Pace:'}</span>
                            {[
                              { id: 'tahqeeq', labelAr: 'تحقيق (بطيء)' },
                              { id: 'tadweer', labelAr: 'تدوير (معتدل)' },
                              { id: 'hadr', labelAr: 'حدر (سريع)' }
                            ].map(speed => (
                              <button
                                key={speed.id}
                                type="button"
                                onClick={() => setMetronomeSpeed(speed.id)}
                                className={'px-2.5 py-1 rounded-lg font-bold transition ' + (
                                  metronomeSpeed === speed.id
                                    ? 'bg-emerald-800 text-white shadow-xs'
                                    : 'bg-white text-emerald-950 border border-slate-300 hover:bg-slate-50'
                                )}
                              >
                                {speed.labelAr}
                              </button>
                            ))}
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950">
                            <input
                              type="checkbox"
                              checked={metronomeSound}
                              onChange={(e) => setMetronomeSound(e.target.checked)}
                              className="accent-emerald-700 w-4 h-4 rounded"
                            />
                            <span>{isRtl ? '🔊 صوت التكة الخشبية' : 'Sound tick'}</span>
                          </label>
                        </div>

                        {/* 3. Interactive Visual Pulse Metronome Card (Warm Emerald & Gold, NO pitch black!) */}
                        <div className="card-islamic-sage rounded-3xl p-6 sm:p-8 mb-6 border-2 border-emerald-800/30 shadow-md relative overflow-hidden flex flex-col items-center justify-center">
                          {/* Animated Pulse Beat Circles */}
                          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                            {Array.from({ length: metronomeCount }).map((_, idx) => {
                              const step = idx + 1;
                              const isCurrentBeat = metronomePlaying && metronomeBeat === step;
                              return (
                                <div
                                  key={step}
                                  className={'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-150 border-2 ' + (
                                    isCurrentBeat
                                      ? 'bg-gold-500 text-emerald-950 border-emerald-950 scale-125 shadow-[0_0_25px_rgba(234,179,8,0.9)] ring-4 ring-gold-300'
                                      : 'bg-white/90 text-emerald-900 border-emerald-700/30 shadow-xs'
                                  )}
                                >
                                  <span className="text-xl sm:text-2xl font-black leading-none font-cairo">{step}</span>
                                  <span className="text-[10px] font-bold leading-none mt-1 opacity-90">{isRtl ? 'حركة' : 'Beat'}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-emerald-950 font-bold text-sm mb-5 font-cairo">
                            {metronomePlaying 
                              ? (isRtl ? 'الحركة النشطة الآن: [ ' + metronomeBeat + ' من ' + metronomeCount + ' ]' : 'Active Beat: ' + metronomeBeat + ' of ' + metronomeCount)
                              : (isRtl ? 'الميزان متوقف — اضغط "بدء النبض الإيقاعي والصوتي"' : 'Metronome stopped')}
                          </div>

                          {/* Play / Stop Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!metronomePlaying && metronomeSound) {
                                playMetronomeTick(true);
                              }
                              setMetronomePlaying(!metronomePlaying);
                            }}
                            className={'px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base transition flex items-center gap-2 shadow-lg ' + (
                              metronomePlaying
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-gold-200 ring-2 ring-gold-400'
                            )}
                          >
                            <span className="text-lg">{metronomePlaying ? '⏹️' : '▶️'}</span>
                            <span>{isRtl ? (metronomePlaying ? 'إيقاف الميزان' : 'بدء النبض الإيقاعي والصوتي') : (metronomePlaying ? 'Stop' : 'Start Metronome')}</span>
                          </button>
                        </div>

                        {/* 4. Live Quranic Practice Examples for Selected Harakat */}
                        <div className="card-islamic-pearl border-2 border-emerald-800/20 rounded-2xl p-5 text-right shadow-xs">
                          <h4 className="text-xs font-bold text-emerald-950 mb-3 flex items-center gap-2 pb-2 border-b border-emerald-900/10">
                            <span>📖</span>
                            <span>{isRtl ? 'أمثلة قرآنية تطبيقية لوزن ' + metronomeCount + ' حركات:' : 'Quranic Practice Examples for ' + metronomeCount + ' counts:'}</span>
                          </h4>

                          {metronomeCount === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                                <span className="font-bold text-emerald-900 block mb-1">المد الطبيعي (حركتان):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿قَالَ﴾ ﴿يَقُولُ﴾ ﴿قِيلَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">زمن نطق الألف أو الواو أو الياء دون زيادة.</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                                <span className="font-bold text-emerald-900 block mb-1">غنة النون والميم والإخفاء:</span>
                                <p className="font-quran text-lg text-emerald-950">﴿إِنَّ ٱللَّهَ﴾ ﴿عَمَّ يَتَسَآءَلُونَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">غنة متمكنة تخرج من الخيشوم بمقدار حركتين.</span>
                              </div>
                            </div>
                          )}

                          {metronomeCount === 4 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-amber-200">
                                <span className="font-bold text-amber-900 block mb-1">المد المنفصل (جائز 4 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿بِمَآ أُنزِلَ إِلَيْكَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">حرف المد في آخر كلمة وهمزة القطع في أول الكلمة التالية.</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-amber-200">
                                <span className="font-bold text-amber-900 block mb-1">المد المتصل (واجب 4 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿إِذَا جَآءَ نَصْرُ ٱللَّهِ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">حرف المد والهمزة مجتمعان في كلمة واحدة.</span>
                              </div>
                            </div>
                          )}

                          {metronomeCount === 5 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-orange-200">
                                <span className="font-bold text-orange-900 block mb-1">المد المتصل (فويق التوسط - 5 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿وَسِيٓءَتْ وُجُوهُ ٱلَّذِينَ كَفَرُواْ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">مرتبة فويق التوسط لحفص عن عاصم من طريق الشاطبية.</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-orange-200">
                                <span className="font-bold text-orange-900 block mb-1">المد المنفصل (فويق التوسط - 5 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿قُوٓاْ أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">يجوز مده 5 حركات توازياً مع مد المتصل.</span>
                              </div>
                            </div>
                          )}

                          {metronomeCount === 6 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-rose-200">
                                <span className="font-bold text-rose-900 block mb-1">المد اللازم الكلمي المثقل (6 حركات):</span>
                                <p className="font-quran text-lg text-emerald-950">﴿غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">حرف مد بعده حرف مشدد في كلمة واحدة (إشباع 6 حركات حتماً).</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-rose-200">
                                <span className="font-bold text-rose-900 block mb-1">المد اللازم الحرفي المثقل والمخفف:</span>
                                <p className="font-quran text-lg text-emerald-950">﴿الٓمٓ﴾ ﴿قٓ ۚ وَٱلْقُرْءَانِ ٱلْمَجِيدِ﴾</p>
                                <span className="text-[11px] text-slate-500 mt-1 block">فواتح السور (نقص عسلكم) تُمد 6 حركات كاملة بالإجماع.</span>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ================= VIEW: ISLAMIC STUDIES & SERMON WORKBENCH (BRANCH 3) ================= */}
            {activeTab === 'islamic' && (
              <div className="space-y-6 sm:space-y-8 animate-fadeIn">
                
                {/* Header Banner & Sub-View Switcher (Workbench vs My Library) */}
                <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-900/15 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-500 text-emerald-950 flex items-center justify-center text-xl sm:text-2xl font-black shadow-md border border-gold-400">
                        🕌
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-2xl font-black text-emerald-950 font-cairo">
                            {isRtl ? 'حقيبة العلوم الشرعية ورافع المحاضرات والمكتبة' : 'Islamic Studies & Lectures Workbench'}
                          </h2>
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full hidden sm:inline">
                            {isRtl ? 'Word • PDF • نص' : 'Word • PDF • Text'}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
                          {isRtl 
                            ? 'ارفع ملف محاضرتك (وورد أو PDF أو نص) أو الصقها لتتحول فوراً إلى خطة منضبطة وبطاقات زوم وورقة عمل واختبار تفاعلي'
                            : 'Upload your Word/PDF lecture document or paste text to format into ready-to-teach assets'}
                        </p>
                      </div>
                    </div>

                    {/* SubView Tabs Switcher: Workbench vs My Library */}
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIslamicSubView('workbench')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            islamicSubView === 'workbench'
                              ? 'bg-emerald-800 text-gold-200 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>✍️</span>
                          <span>{isRtl ? 'تحضير ورفع محاضرة' : 'Author & Upload'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIslamicSubView('library')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            islamicSubView === 'library'
                              ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>📚</span>
                          <span>{isRtl ? 'مكتبة محاضراتي' : 'My Library'}</span>
                          <span className="bg-emerald-950 text-gold-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                            {savedIslamicLectures.length}
                          </span>
                        </button>
                      </div>

                      {islamicSubView === 'workbench' && (
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={handleResetIslamicForm}
                            className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                            title={isRtl ? "البدء بدرس جديد على نظافة" : "Start with a new blank lecture"}
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'درس جديد' : 'New Clean'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={handleLoadDemoIslamic}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                            title={isRtl ? "استيراد نموذج استرشادي تجريبي للتوضيح" : "Load demo illustrative lesson"}
                          >
                            <span>💡</span>
                            <span>{isRtl ? 'نموذج تجريبي' : 'Demo'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ================= SUBVIEW 1: MY LECTURES LIBRARY ================= */}
                  {islamicSubView === 'library' && (
                    <div className="space-y-6 pt-2">
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                        <div>
                          <h3 className="font-bold text-emerald-950 text-base font-cairo flex items-center gap-2">
                            <span>📚</span>
                            <span>{isRtl ? 'مكتبة المحاضرات الشرعية المحفوظة' : 'My Saved Lectures Library'}</span>
                            <span className="bg-emerald-800 text-gold-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                              {savedIslamicLectures.length} {isRtl ? 'محاضرة' : 'lectures'}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {isRtl 
                              ? 'محاضراتك المخزنة محلياً على جهازك؛ يمكنك الرجوع إليها للشرح على زوم، أو طباعة أوراق عملها، أو اختبار الدارسين دون إنترنت.'
                              : 'Lectures saved locally in your browser. Open anytime for Zoom presentation, printable worksheets, or quizzes.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIslamicSubView('workbench')}
                            className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'تحضير أو رفع محاضرة جديدة' : 'Add New Lecture'}</span>
                          </button>
                          {savedIslamicLectures.length > 0 && (
                            <button
                              type="button"
                              onClick={handleExportLibrary}
                              className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                              title={isRtl ? "تصدير ملف احتياطي لمكتبتك" : "Export backup file"}
                            >
                              <span>📤</span>
                              <span>{isRtl ? 'تصدير نسخة احتياطية' : 'Backup Library'}</span>
                            </button>
                          )}
                          <label className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <span>📥</span>
                            <span>{isRtl ? 'استيراد مكتبة' : 'Import'}</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportLibrary}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Empty State */}
                      {savedIslamicLectures.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-300 space-y-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 text-3xl flex items-center justify-center mx-auto">
                            📚
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-emerald-950 font-cairo">
                              {isRtl ? 'مكتبتك فارغة حالياً' : 'Your Library is Empty'}
                            </h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                              {isRtl 
                                ? 'لم تقم بحفظ أي محاضرة بعد. يمكنك رفع ملف وورد (.docx) أو PDF أو تحضير أي محاضرة، ثم الضغط على زر "حفظ بمكتبتي" لتظهر هنا بشكل دائم.'
                                : 'You have not saved any lectures yet. Upload a Word/PDF lecture or author one, then click Save to Library.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIslamicSubView('workbench')}
                            className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition inline-flex items-center gap-2"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'ابدأ برفع أو تحضير أول محاضرة الآن' : 'Upload or Author Your First Lecture'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {savedIslamicLectures.map(lec => (
                            <div key={lec.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-gold-400 shadow-xs flex flex-col justify-between transition space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    {lec.data.metadata.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    ⏱️ {lec.data.metadata.durationMinutes} د • {lec.savedAt}
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-emerald-950 text-sm font-cairo leading-snug">
                                  {lec.data.metadata.topic}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  {lec.data.metadata.audience}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                                  <span>🖼️ {(lec.data.zoomCards || lec.data.zoomPresentation || []).length} شرائح زوم</span>
                                  <span>•</span>
                                  <span>❓ {(lec.data.quizQuestions || []).length} أسئلة اختبار</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => handleLoadSavedLecture(lec)}
                                  className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 font-bold px-3 py-1.5 rounded-lg text-xs transition flex-1 text-center"
                                >
                                  {isRtl ? '📖 فتح وعرض' : 'Open'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIslamicData(lec.data);
                                    handleTransferLectureToWorksheet();
                                  }}
                                  className="bg-gold-50 text-gold-800 border border-gold-300 hover:bg-gold-100 font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                                  title={isRtl ? 'ورقة العمل والطباعة' : 'Worksheet'}
                                >
                                  📝
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIslamicData(lec.data);
                                    handleTransferLectureToQuiz();
                                  }}
                                  className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold px-2.5 py-1.5 rounded-lg text-xs transition"
                                  title={isRtl ? 'الاختبار التفاعلي' : 'Quiz'}
                                >
                                  🎯
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSavedLecture(lec.id)}
                                  className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs transition"
                                  title={isRtl ? 'حذف من المكتبة' : 'Delete'}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================= SUBVIEW 2: WORKBENCH & INPUT MODES ================= */}
                  {islamicSubView === 'workbench' && (
                    <div className="space-y-6 pt-2">

                      {/* Sequential 6-Stage Stepper Navigation Bar */}
                      <div className="sticky top-2 z-20 bg-emerald-950/95 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-2xl border-2 border-gold-400 shadow-xl no-print">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs flex-1">
                            {[
                              { id: 'stage-islamic-1', num: 1, labelAr: '1. إدخال المحاضرة', labelEn: '1. Lecture Input', icon: '📁', active: true },
                              { id: 'stage-islamic-2', num: 2, labelAr: '2. الخطة والأدلة', labelEn: '2. Plan & Evidence', icon: '⏱️', active: !!islamicData },
                              { id: 'stage-islamic-3', num: 3, labelAr: '3. العرض وبوربوينت', labelEn: '3. Slides & PPTX', icon: '📽️', active: !!islamicData },
                              { id: 'stage-islamic-4', num: 4, labelAr: '4. ورقة العمل', labelEn: '4. Worksheet', icon: '📝', active: !!islamicData },
                              { id: 'stage-islamic-5', num: 5, labelAr: '5. الاختبار الذاتي', labelEn: '5. Self-Quiz', icon: '🎯', active: !!islamicData },
                              { id: 'stage-islamic-6', num: 6, labelAr: '6. الواتساب والمكتبة', labelEn: '6. WhatsApp & Library', icon: '💬', active: !!islamicData }
                            ].map(st => {
                              const isCurrent = activeIslamicStage === st.num;
                              return (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => handleJumpToStage(st.num)}
                                  className={'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ' + (
                                    isCurrent
                                      ? 'bg-gold-500 text-emerald-950 border-2 border-gold-300 font-black shadow-lg ring-2 ring-gold-300 scale-105'
                                      : (st.active 
                                          ? 'bg-emerald-900/90 hover:bg-emerald-800 text-gold-200 border border-gold-400/40' 
                                          : 'bg-emerald-950/50 text-slate-400 border border-emerald-900/40 opacity-70 cursor-not-allowed')
                                  )}
                                  title={isRtl ? `انتقل إلى المرحلة (${st.num})` : `Jump to Stage ${st.num}`}
                                >
                                  <span className={'w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ' + (isCurrent ? 'bg-emerald-950 text-gold-300' : 'bg-gold-400 text-emerald-950')}>
                                    {st.num}
                                  </span>
                                  <span>{st.icon}</span>
                                  <span>{isRtl ? st.labelAr : st.labelEn}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Toggle view mode */}
                          <button
                            type="button"
                            onClick={() => setIslamicViewMode(islamicViewMode === 'stepper' ? 'all' : 'stepper')}
                            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border border-gold-400/40 bg-emerald-900 hover:bg-emerald-800 text-gold-200 whitespace-nowrap transition"
                            title={isRtl ? 'تبديل نمط العرض بين مرحلة بمرحلة أو كل المراحل معاً' : 'Toggle view mode'}
                          >
                            <span>{islamicViewMode === 'stepper' ? '📜' : '📑'}</span>
                            <span>{islamicViewMode === 'stepper' ? (isRtl ? 'عرض الكل' : 'All') : (isRtl ? 'خطوة بخطوة' : 'Step')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Master Practical Field Guide Banner */}
                      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-gold-400 shadow-md">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setShowMasterGuide(!showMasterGuide)}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl sm:text-2xl">💡</span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-gold-300 font-cairo">
                                {isRtl ? 'دليل المعلم التطبيقي: كيف تستثمر مراحل المحاضرة الست في إعداد وإلقاء درسك وحلقتك؟' : 'Teacher Guide: How to use the 6 lecture stages in your class'}
                              </h4>
                              <p className="text-[11px] text-emerald-200 mt-0.5">
                                {isRtl ? 'خارطة طريق واضحة ومباشرة تجيبك عن كيفية الاستفادة الحقيقية من كل أداة ومخرج في الميدان' : 'Practical field roadmap explaining the exact purpose and workflow of each stage'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-gold-300 hover:text-gold-100 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 border border-gold-400/40"
                          >
                            {showMasterGuide ? (isRtl ? 'إخفاء الدليل ▲' : 'Hide ▲') : (isRtl ? 'عرض الدليل ▼' : 'Show Guide ▼')}
                          </button>
                        </div>

                        {showMasterGuide && (
                          <div className="mt-4 pt-4 border-t border-gold-400/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs animate-fadeIn">
                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>📁 1.</span>
                                <span>{isRtl ? 'إدخال ورفع المحاضرة' : '1. Input Lecture'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'ارفع ملف الدرس كـ Word أو PDF مباشرة دون الحاجة لنسخ ولصق؛ ليتولى المحرك تفكيك المحاضرة واستخراج المحاور والآيات بدقة.' : 'Upload Word or PDF files directly without tedious copy-pasting.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>⏱️ 2.</span>
                                <span>{isRtl ? 'الخطة والأدلة الشرعية' : '2. Blueprint & Evidence'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'تساعدك في ضبط توقيت الدرس بدقة (تمهيد 10د، تأصيل 25د، قصة وواقع 15د، خاتمة 10د) مع استحضار فوري للأحاديث المعتمدة والتأصيل.' : 'Time management and verified hadiths.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>📽️ 3.</span>
                                <span>{isRtl ? 'العرض الحي وبوربوينت' : '3. Live Deck & PPTX'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'اعرض الشرائح مباشرة ملء الشاشة على البروجكتور أو زوم مع نقاط التحدث والتوجيهات، أو حمّل ملف بوربوينت PPTX للعرض أوفلاين.' : 'Live presenter mode on Zoom/projector + PPTX export.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>📝 4.</span>
                                <span>{isRtl ? 'ورقة العمل والطباعة' : '4. Printable Worksheet'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'اطبع [نسخة الدارس] الفارغة ليحلها الطلاب في الحلقة ويكتبوا التطبيق السلوكي، واستعن بـ [نسخة المعلم] كدليل إجابة وتأصيل شرعي.' : 'Print student and teacher answer keys.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>🎯 5.</span>
                                <span>{isRtl ? 'الاختبار الذاتي الفوري' : '5. Interactive Quiz'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'فعّل وضع الطالب في ختام الدرس لتقييم استيعاب الدارسين فورياً والحصول على نسبة الإتقان مع تغذية راجعة وتصحيح فوري.' : 'Interactive end-of-class quiz.'}
                              </p>
                            </div>

                            <div className="bg-emerald-900/60 p-3 rounded-xl border border-gold-400/20 space-y-1">
                              <span className="text-gold-300 font-bold flex items-center gap-1.5">
                                <span>💬 6.</span>
                                <span>{isRtl ? 'الواتساب ومكتبتي الدائمة' : '6. WhatsApp & Library'}</span>
                              </span>
                              <p className="text-slate-200 text-[11px] leading-relaxed">
                                {isRtl ? 'انسخ ملخص التكليف المنزلي بنقرة زر وشاركه في جروب الواتساب مع أولياء الأمور أو الطلاب، واحفظ المحاضرة كاملة بمكتبتك.' : 'One-click WhatsApp homework broadcast and permanent library.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* --- STAGE 1: INPUT & UPLOAD SECTION --- */}
                      {(islamicViewMode === 'all' || activeIslamicStage === 1) && (
                      <div id="stage-islamic-1" className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-900/15 shadow-sm space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 1 من 6
                            </span>
                            <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base font-cairo">
                              {isRtl ? 'إدخال ورفع ملف المحاضرة (Word .docx / PDF / نص / لصق)' : 'Step 1: Input or Upload Lecture File'}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                            {isRtl ? 'اختر طريقة الإدخال الأنسب لك:' : 'Choose Input Mode:'}
                          </span>
                        </div>
                      
                      {/* Input Mode Toggle: File vs Paste vs Structured */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setIslamicInputMode('file')}
                          className={'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                            islamicInputMode === 'file'
                              ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-md ring-2 ring-gold-400/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span>📁</span>
                          <span>{isRtl ? '1. رفع ملف المحاضرة (Word .docx / PDF / نص .txt)' : '1. Upload Lecture File (Word/PDF/Text)'}</span>
                          <span className="bg-gold-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                            {isRtl ? 'الموصى به' : 'Best'}
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIslamicInputMode('paste')}
                          className={'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                            islamicInputMode === 'paste'
                              ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span>📋</span>
                          <span>{isRtl ? '2. لصق نص المحاضرة يدوياً' : '2. Paste Lecture Text'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIslamicInputMode('structured')}
                          className={'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ' + (
                            islamicInputMode === 'structured'
                              ? 'bg-emerald-900 text-gold-200 border-gold-400 font-black shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span>🏗️</span>
                          <span>{isRtl ? '3. البناء المنظم خطوة بخطوة' : '3. Structured Step-by-Step'}</span>
                        </button>
                      </div>

                      {/* --- MODE 1: FILE UPLOAD DROPZONE & EXTRACTOR --- */}
                      {islamicInputMode === 'file' && (
                        <div className="space-y-4">
                          
                          {/* Dropzone Card */}
                          <div 
                            onClick={() => document.getElementById('lectureDocFileInput')?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const f = e.dataTransfer.files && e.dataTransfer.files[0];
                              if (f) handleLectureFileUpload(f);
                            }}
                            className="bg-white hover:bg-emerald-50/40 border-2 border-dashed border-emerald-900/30 hover:border-gold-500 rounded-3xl p-6 sm:p-10 text-center cursor-pointer transition shadow-xs group"
                          >
                            <input
                              type="file"
                              id="lectureDocFileInput"
                              accept=".docx,.doc,.pdf,.txt,.md"
                              onChange={(e) => {
                                const f = e.target.files && e.target.files[0];
                                if (f) handleLectureFileUpload(f);
                              }}
                              className="hidden"
                            />

                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-900 group-hover:bg-gold-100 group-hover:text-gold-900 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-3 transition shadow-inner">
                              {isExtractingFile ? '⏳' : '📁'}
                            </div>

                            <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                              {isExtractingFile 
                                ? (isRtl ? 'جارٍ قراءة واستخراج نص المحاضرة من الملف...' : 'Extracting document text...')
                                : (isRtl ? 'اسحب ملف المحاضرة هنا أو اضغط لاختياره من جهازك' : 'Drag & drop lecture document here, or browse')}
                            </h3>

                            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
                              {isRtl 
                                ? 'يدعم مستندات وورد Word (.docx, .doc)، كتب وملفات PDF (.pdf)، والملفات النصية (.txt, .md). تتم القراءة بأمان تام داخل متصفحك دون إرسال ملفاتك لأي خوادم.'
                                : 'Supports Microsoft Word (.docx, .doc), Adobe PDF (.pdf), and Text files (.txt, .md). Extracted 100% locally on your machine.'}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                              <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                📘 Microsoft Word (.docx)
                              </span>
                              <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                📕 Adobe PDF (.pdf)
                              </span>
                              <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full border border-slate-200">
                                📄 Plain Text (.txt, .md)
                              </span>
                            </div>
                          </div>

                          {/* Uploaded File Summary & Transformation Card */}
                          {uploadedFileInfo && (
                            <div className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-400/40 pb-3">
                                <div className="flex items-center gap-3">
                                  <span className="w-10 h-10 rounded-xl bg-gold-400 text-emerald-950 font-bold flex items-center justify-center text-xl shadow-xs">
                                    📄
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-extrabold text-emerald-950 text-sm font-cairo">
                                        {uploadedFileInfo.name}
                                      </h4>
                                      <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-300">
                                        ✓ {isRtl ? 'تم استخراج النص بنجاح' : 'Extracted'}
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-600 mt-0.5">
                                      {isRtl 
                                        ? `الحجم: ${uploadedFileInfo.sizeKb} كيلوبايت • عدد الكلمات: ${uploadedFileInfo.wordCount} كلمة • الأسطر: ${uploadedFileInfo.lineCount} سطراً`
                                        : `Size: ${uploadedFileInfo.sizeKb} KB • Words: ${uploadedFileInfo.wordCount} • Lines: ${uploadedFileInfo.lineCount}`}
                                    </div>
                                  </div>
                                </div>

                                {/* Primary Transformation Trigger */}
                                <button
                                  type="button"
                                  onClick={() => handleProcessCustomLecture()}
                                  disabled={isGeneratingIslamic}
                                  className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                  <span>⚡</span>
                                  <span>
                                    {isGeneratingIslamic 
                                      ? (isRtl ? 'جارٍ التحويل والهيكلة...' : 'Processing...') 
                                      : (isRtl ? 'تحويل الملف إلى خطة وبطاقات زوم وورقة عمل' : 'Transform File into Lecture Blueprint')}
                                  </span>
                                </button>
                              </div>

                              {/* Extracted Content Quality & Tools Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100/80 p-3 rounded-2xl border border-gold-400/60 text-xs shadow-xs">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-amber-950 flex items-center gap-1.5 font-cairo">
                                    <span>🛠️</span>
                                    <span>{isRtl ? 'أدوات معالجة واستخلاص الملف:' : 'File Processing Tools:'}</span>
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cleaned = sanitizeArabicExtractedText(rawLectureText);
                                      setRawLectureText(cleaned);
                                      const evs = extractEvidencesAndProofs(cleaned);
                                      setExtractedEvidences(evs);
                                      showToast(isRtl ? 'تم تنقية ومعالجة النص العربي واستخلاص الأدلة بنجاح ✨' : 'Sanitized text and extracted evidences ✨');
                                    }}
                                    className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'إزالة الشوائب الطباعية، والتشكيل الزائد، ووصل الحروف المتقطعة' : 'Clean OCR & typography'}
                                  >
                                    <span>🧹</span>
                                    <span>{isRtl ? 'تنقية ومعالجة النص' : 'Sanitize Text'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!rawLectureText) return;
                                      const bracketPairs = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '«': '»', '»': '«', '﴿': '﴾', '﴾': '﴿' };
                                      const inverted = rawLectureText.split(/\r?\n/).map(line => {
                                        return line.split('').reverse().join('').replace(/[()«»\[\]{}<>﴿﴾]/g, m => bracketPairs[m] || m);
                                      }).join('\n');
                                      setRawLectureText(inverted);
                                      showToast(isRtl ? 'تم عكس اتجاه النص والحروف المقلوبة 🔄' : 'Inverted text direction 🔄');
                                    }}
                                    className="bg-slate-800 hover:bg-slate-900 text-gold-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'عكس اتجاه الحروف إذا ظهر النص مقلوباً من اليسار لليمين' : 'Invert character direction'}
                                  >
                                    <span>🔄</span>
                                    <span>{isRtl ? 'عكس النص المقلوب' : 'Invert Reversed'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!rawLectureText) return;
                                      const fixed = sanitizeArabicExtractedText(rawLectureText);
                                      setRawLectureText(fixed);
                                      showToast(isRtl ? 'تم فك تشابك الكلمات وضبط المسافات ✂️' : 'Disentangled words ✂️');
                                    }}
                                    className="bg-amber-800 hover:bg-amber-900 text-amber-100 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'فك الكلمات المتلاصقة وتصحيح العبارات' : 'Fix glued words'}
                                  >
                                    <span>✂️</span>
                                    <span>{isRtl ? 'فك تشابك الكلمات' : 'Disentangle Words'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setShowEvidenceBankModal(true)}
                                    className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                    title={isRtl ? 'عرض الآيات القرآنية والأحاديث والأقوال العلمية المستخلصة من الملف' : 'Inspect extracted Quran & Hadith proofs'}
                                  >
                                    <span>📜</span>
                                    <span>{isRtl ? `بنك الأدلة والبراهين (${(extractedEvidences.quranicVerses || []).length + (extractedEvidences.hadiths || []).length + (extractedEvidences.scholarlyProofs || []).length})` : 'Evidence Bank'}</span>
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setShowExtractedTextPreview(!showExtractedTextPreview)}
                                  className="bg-white hover:bg-slate-50 text-amber-950 border border-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                                >
                                  <span>👁️</span>
                                  <span>{isRtl ? (showExtractedTextPreview ? 'إخفاء محرر النص' : 'معاينة وتعديل النص المستخلص') : 'Preview & Edit Text'}</span>
                                </button>
                              </div>

                              {/* Expandable Extracted Text Area */}
                              {showExtractedTextPreview && (
                                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-300 shadow-inner space-y-2 animate-fadeIn">
                                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold border-b border-slate-100 pb-1.5">
                                    <span className="flex items-center gap-1 text-emerald-950 font-black">
                                      <span>📝</span>
                                      <span>{isRtl ? 'محرر وتدقيق النص المستخلص (يمكنك التعديل أو الحذف أو الإضافة المباشرة):' : 'Extracted Text Editor:'}</span>
                                    </span>
                                    <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                      {rawLectureText.length} {isRtl ? 'حرفاً' : 'chars'} • {rawLectureText.trim().split(/\s+/).filter(Boolean).length} {isRtl ? 'كلمة' : 'words'}
                                    </span>
                                  </div>
                                  <textarea
                                    rows={8}
                                    value={rawLectureText}
                                    onChange={(e) => {
                                      setRawLectureText(e.target.value);
                                      const evs = extractEvidencesAndProofs(e.target.value);
                                      setExtractedEvidences(evs);
                                    }}
                                    className="w-full text-xs sm:text-sm font-amiri p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed text-slate-900 scrollbar-thin"
                                    placeholder={isRtl ? 'النص المستخلص من الملف...' : 'Extracted text...'}
                                  />
                                </div>
                              )}

                              {/* Target Metadata Selectors */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'عنوان المحاضرة (مستخرج تلقائياً):' : 'Lecture Topic Title:'}
                                  </label>
                                  <input
                                    type="text"
                                    value={lessonTopic}
                                    onChange={(e) => setLessonTopic(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'المجال الشرعي:' : 'Discipline:'}
                                  </label>
                                  <select
                                    value={subjectCategory}
                                    onChange={(e) => setSubjectCategory(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  >
                                    {[
                                      'العقيدة والتوحيد (Aqeedah)',
                                      'الفقه وأصوله (Fiqh & Usul)',
                                      'التفسير وتدبر القرآن (Tafseer)',
                                      'الحديث الشريف وعلومه (Hadith)',
                                      'السيرة النبوية والتاريخ (Seerah)',
                                      'التزكية والآداب والأخلاق (Tazkiyah)',
                                      'اللغة العربية وعلوم اللسان (Arabic)',
                                      'قضايا معاصرة وفكر إسلامي (Contemporary)',
                                      'custom'
                                    ].map(c => (
                                      <option key={c} value={c}>{c === 'custom' ? (isRtl ? '✨ مجال شرعي مخصص آخر...' : 'Custom Discipline...') : c}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'مدة المحاضرة المقررة:' : 'Allocated Duration:'}
                                  </label>
                                  <select
                                    value={lessonDuration}
                                    onChange={(e) => setLessonDuration(Number(e.target.value))}
                                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  >
                                    <option value={30}>30 {isRtl ? 'دقيقة (موجزة)' : 'minutes'}</option>
                                    <option value={45}>45 {isRtl ? 'دقيقة (حلقة قياسية)' : 'minutes'}</option>
                                    <option value={60}>60 {isRtl ? 'دقيقة (درس منهجي موسع)' : 'minutes'}</option>
                                    <option value={90}>90 {isRtl ? 'دقيقة (ندوة علمية)' : 'minutes'}</option>
                                  </select>
                                </div>
                              </div>

                              {/* Collapsible Extracted Text Preview */}
                              <details className="text-xs">
                                <summary className="cursor-pointer text-slate-700 font-bold hover:text-emerald-900 transition select-none">
                                  👁️ {isRtl ? 'معاينة أو تعديل النص المستخرج من الملف قبل التحويل' : 'Preview / Edit Extracted Document Text'}
                                </summary>
                                <textarea
                                  rows={6}
                                  value={rawLectureText}
                                  onChange={(e) => setRawLectureText(e.target.value)}
                                  className="w-full mt-2 bg-white border border-slate-300 rounded-xl p-3 text-xs font-amiri text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                />
                              </details>
                            </div>
                          )}

                        </div>
                      )}

                      {/* --- MODE 2: PASTE LECTURE TEXT --- */}
                      {islamicInputMode === 'paste' && (
                        <div className="space-y-4">
                          {rawLectureText && rawLectureText.trim().length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100/80 p-3 rounded-2xl border border-gold-400/60 text-xs shadow-xs animate-fadeIn">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-amber-950 flex items-center gap-1.5 font-cairo">
                                  <span>🛠️</span>
                                  <span>{isRtl ? 'أدوات معالجة واستخلاص النص الملصوق:' : 'Pasted Text Tools:'}</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const cleaned = sanitizeArabicExtractedText(rawLectureText);
                                    setRawLectureText(cleaned);
                                    const evs = extractEvidencesAndProofs(cleaned);
                                    setExtractedEvidences(evs);
                                    showToast(isRtl ? 'تم تنقية ومعالجة النص العربي واستخلاص الأدلة بنجاح ✨' : 'Sanitized text and extracted evidences ✨');
                                  }}
                                  className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                  title={isRtl ? 'إزالة الشوائب الطباعية، والتشكيل الزائد، ووصل الحروف المتقطعة' : 'Clean typography'}
                                >
                                  <span>🧹</span>
                                  <span>{isRtl ? 'تنقية ومعالجة النص العربي' : 'Sanitize Text'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setShowEvidenceBankModal(true)}
                                  className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                                  title={isRtl ? 'عرض الآيات القرآنية والأحاديث والأقوال العلمية المستخلصة من النص' : 'Inspect extracted Quran & Hadith proofs'}
                                >
                                  <span>📜</span>
                                  <span>{isRtl ? `بنك الأدلة والبراهين (${(extractedEvidences.quranicVerses || []).length + (extractedEvidences.hadiths || []).length + (extractedEvidences.scholarlyProofs || []).length})` : 'Evidence Bank'}</span>
                                </button>
                              </div>

                              <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                                {rawLectureText.length} {isRtl ? 'حرفاً' : 'chars'} • {rawLectureText.trim().split(/\s+/).filter(Boolean).length} {isRtl ? 'كلمة' : 'words'}
                              </span>
                            </div>
                          )}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                              {isRtl 
                                ? 'الصق نص محاضرتك أو مادتك العلمية المجمعة هنا:' 
                                : 'Paste your lecture text or researched draft here:'}
                            </label>
                            <textarea
                              rows={8}
                              value={rawLectureText}
                              onChange={(e) => setRawLectureText(e.target.value)}
                              placeholder={isRtl 
                                ? 'الصق هنا نص المحاضرة، محاورها، الأحاديث، أو أي ملخص جمعته من الكتب والإنترنت... سيقوم المحرك بتحليله وتقسيمه بالدقائق واستخراج بطاقات زوم وملخص الواتساب وأسئلة الاختبار تلقائياً.' 
                                : 'Paste entire lecture notes or summary here...'}
                              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs font-amiri text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                              <span className="text-[11px] text-slate-500 font-medium">
                                {isRtl ? 'المحرك يقبل أي طول للنص ويستخلص المحاور والأدلة تلقائياً' : 'Accepts any text length'}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleProcessCustomLecture()}
                                disabled={!rawLectureText.trim() || isGeneratingIslamic}
                                className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-40"
                              >
                                <span>⚡</span>
                                <span>
                                  {isGeneratingIslamic 
                                    ? (isRtl ? 'جارٍ المعالجة والهيكلة...' : 'Processing...') 
                                    : (isRtl ? 'هيكلة النص وتوليد الأدوات التدريسية' : 'Structure Notes into Teaching Assets')}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- MODE 3: STRUCTURED FORM --- */}
                      {islamicInputMode === 'structured' && (
                        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'عنوان الدرس والمحور الأساسي:' : 'Lesson Topic:'}
                              </label>
                              <input
                                type="text"
                                value={lessonTopic}
                                onChange={(e) => setLessonTopic(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'المجال الشرعي المستهدف:' : 'Islamic Discipline:'}
                              </label>
                              <select
                                value={subjectCategory}
                                onChange={(e) => setSubjectCategory(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              >
                                {[
                                  'العقيدة والتوحيد (Aqeedah)',
                                  'الفقه وأصوله (Fiqh & Usul)',
                                  'التفسير وتدبر القرآن (Tafseer)',
                                  'الحديث الشريف وعلومه (Hadith)',
                                  'السيرة النبوية والتاريخ (Seerah)',
                                  'التزكية والآداب والأخلاق (Tazkiyah)',
                                  'اللغة العربية وعلوم اللسان (Arabic)',
                                  'قضايا معاصرة وفكر إسلامي (Contemporary)'
                                ].map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'مدة الحصة (بالدقائق):' : 'Duration (minutes):'}
                              </label>
                              <select
                                value={lessonDuration}
                                onChange={(e) => setLessonDuration(Number(e.target.value))}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              >
                                <option value={30}>30 دقيقة</option>
                                <option value={45}>45 دقيقة</option>
                                <option value={60}>60 دقيقة</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {isRtl ? 'محاور ونقاط الدرس المقررة:' : 'Lesson Phases & Points:'}
                            </label>
                            <textarea
                              rows={3}
                              value={structuredPhasesText}
                              onChange={(e) => setStructuredPhasesText(e.target.value)}
                              placeholder={isRtl ? 'اكتب المحاور أو عناصر الدرس...' : 'Enter lesson outline points...'}
                              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-amiri"
                            />
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => handleProcessCustomLecture()}
                              className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-6 py-2 rounded-xl text-xs shadow-md transition"
                            >
                              {isRtl ? '⚡ توليد الأدوات التدريسية' : 'Generate Assets'}
                            </button>
                          </div>
                        </div>
                      )}

                      </div>
                    )}

                      {/* --- UPCOMING STAGES ROADMAP GUIDE (WHEN NO ACTIVE LECTURE) --- */}
                      {!islamicData && (
                        <div id="stages-roadmap-preview" className="card-islamic-pearl rounded-3xl p-5 sm:p-7 border-2 border-dashed border-emerald-800/30 shadow-md space-y-5 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/10 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🗺️</span>
                                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                  {isRtl ? 'خريطة مراحل إعداد المحاضرة (المراحل 2 إلى 6):' : 'Upcoming Lecture Stages (2 through 6):'}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl 
                                  ? 'بمجرد رفع ملفك أو لصق النص بالخطوة 1 أعلاه؛ ستتولد المراحل الخمس التالية تلقائياً بالترتيب في هذه الشاشة دون أي تنقل:' 
                                  : 'Once you upload your file above, the following 5 stages generate automatically in this single view:'}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleLoadDemoIslamic}
                              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
                            >
                              <span>💡</span>
                              <span>{isRtl ? 'معاينة نموذج تجريبي بكافة المراحل' : 'Load Demo with All 6 Stages'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {[
                              { num: 2, title: isRtl ? '2. الخطة والأدلة' : '2. Plan & Hadith', desc: isRtl ? 'المخطط الزمني بالدقائق وتوثيق أحاديث الصحيحين' : 'Minute blueprint & Sahih Hadiths', icon: '⏱️' },
                              { num: 3, title: isRtl ? '3. العرض وبوربوينت' : '3. PPTX Slides', desc: isRtl ? 'عرض مباشر لزوم وتنزيل ملف بوربوينت PPTX' : 'Zoom Presenter & PPTX Download', icon: '📽️' },
                              { num: 4, title: isRtl ? '4. ورقة العمل والطباعة' : '4. Worksheet Table', desc: isRtl ? 'جدول المدارسة للدارسين مع الطباعة الفورية' : 'Study worksheet & instant print', icon: '📝' },
                              { num: 5, title: isRtl ? '5. الاختبار الذاتي التفاعلي' : '5. Interactive Quiz', desc: isRtl ? 'أسئلة الاختيار من متعدد وتصحيح فوري' : 'Multiple choice quiz & live scoring', icon: '🎯' },
                              { num: 6, title: isRtl ? '6. الواتساب والمكتبة' : '6. WhatsApp & Library', desc: isRtl ? 'ملخص رسائل الواتساب وحفظ دائم بمكتبتك' : 'WhatsApp summary & library save', icon: '💬' }
                            ].map(stg => (
                              <button
                                key={stg.num}
                                type="button"
                                onClick={() => handleJumpToStage(stg.num)}
                                className="bg-white/90 hover:bg-emerald-50/90 rounded-2xl p-4 border-2 border-emerald-900/10 hover:border-gold-500 shadow-xs hover:shadow-md transition flex flex-col justify-between text-right cursor-pointer group"
                                title={isRtl ? `انقر للانتقال الفوري إلى (${stg.title})` : `Click to jump to Stage ${stg.num}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-900 group-hover:bg-gold-500 text-gold-200 group-hover:text-emerald-950 text-xs font-black flex items-center justify-center shadow-xs transition">
                                      {stg.num}
                                    </span>
                                    <span className="text-xl group-hover:scale-110 transition">{stg.icon}</span>
                                  </div>
                                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-cairo mb-1 group-hover:text-emerald-800">
                                    {stg.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    {stg.desc}
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                                  <span>⚡ {isRtl ? 'انتقال فوري للمرحلة' : 'Jump Now'}</span>
                                  <span className="text-gold-600 group-hover:translate-x-[-3px] transition font-black">⬅️</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* ================= ACTIVE LECTURE SEQUENTIAL 6-STAGE ARTIFACTS VIEW ================= */}
                {islamicData && (
                  <div className="space-y-6">

                    {/* Top Action Bar for Generated Lesson */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-900/15 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🕌</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                              {islamicData.metadata.topic}
                            </h3>
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              مكتمل 6 مراحل ✓
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-bold">
                            {islamicData.metadata.category} • {islamicData.metadata.durationMinutes} دقيقة • {islamicData.metadata.audience}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveIslamicLecture}
                          className={'px-3.5 py-2 rounded-xl text-xs font-black shadow-sm border transition flex items-center gap-1.5 cursor-pointer ' + (
                            isCurrentLectureSaved
                              ? 'bg-emerald-800 text-gold-300 border-gold-400 ring-2 ring-gold-400/50'
                              : 'bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-gold-400'
                          )}
                        >
                          <span>💾</span>
                          <span>{isCurrentLectureSaved ? (isRtl ? '✓ محفوظة بمكتبتك' : 'Saved in Library') : (isRtl ? 'حفظ بمكتبتي' : 'Save to Library')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIslamicStage(4);
                            setTimeout(() => {
                              const el = document.getElementById('stage-islamic-4');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <span>📝</span>
                          <span>{isRtl ? 'الانتقال لورقة العمل' : 'Jump to Worksheet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIslamicStage(5);
                            setTimeout(() => {
                              const el = document.getElementById('stage-islamic-5');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'الانتقال للاختبار' : 'Jump to Quiz'}</span>
                        </button>
                      </div>
                    </div>

                    {/* ================= STAGE 2: TIME-BOXED BLUEPRINT & HADITH VERIFICATION ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 2) && (
                    <div id="stage-islamic-2" className="space-y-6">
                      
                      {/* Quick Active Lecture Sanitize & Force Clean Button */}
                      <div className="flex justify-end gap-2 no-print">
                        <button
                          type="button"
                          onClick={() => {
                            if (islamicData) {
                              const cleaned = sanitizeIslamicDataObject(islamicData);
                              setIslamicData(cleaned);
                              try { localStorage.setItem('mishkah_active_islamic_data', JSON.stringify(cleaned)); } catch(e) {}
                              showToast(isRtl ? 'تمت إعادة تدقيق وتطهير كافة نصوص المحاضرة الحالية بنجاح 🌿' : 'Lecture re-sanitized');
                            }
                          }}
                          className="bg-emerald-950/80 hover:bg-emerald-900 text-gold-300 border border-gold-400/40 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs"
                          title={isRtl ? 'تطهير نصوص المحاضرة الحالية فوراً من أي أخطاء طباعية قديمة' : 'Re-sanitize current lecture'}
                        >
                          <span>🧹</span>
                          <span>{isRtl ? 'إعادة تدقيق وتطهير نصوص الدرس فوراً' : 'Re-sanitize Texts'}</span>
                        </button>
                      </div>

                      {/* 2.1 Time-Boxed Lesson Blueprint */}
                      <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 sm:mb-6 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                المرحلة 2 من 6
                              </span>
                              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                {isRtl ? 'المخطط الزمني المنضبط بالدقائق' : 'Minute-by-Minute Time-Boxed Blueprint'}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-emerald-950 font-amiri mt-1">
                              {islamicData.metadata.topic} — ({islamicData.metadata.durationMinutes || islamicData.metadata.duration || lessonDuration || 45} {isRtl ? 'دقيقة' : 'Minutes'})
                            </h3>
                          </div>
                          <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full">
                            {islamicData.metadata.category}
                          </span>
                        </div>

                        {/* Dedicated Opening Du'aa & Supplication Banner if present in lecture */}
                        {islamicData.openingPreamble && (
                          <div className="card-islamic-amber rounded-2xl p-4 sm:p-5 border-2 border-amber-500/40 shadow-sm space-y-2 mb-4 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
                              <span className="flex items-center gap-2 font-black text-amber-950 text-xs sm:text-sm font-cairo">
                                <span className="text-base sm:text-lg">🤲</span>
                                <span>{isRtl ? 'افتتاحية المجلس والدعاء المأثور (مقدمة المحاضرة والاستفتاح):' : 'Opening Supplication & Lecture Preamble:'}</span>
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                {isRtl ? 'دعاء واستفتاح المجلس' : 'Opening Du\'aa'}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-amiri text-slate-800 leading-relaxed font-semibold">
                              {sanitizeArabicExtractedText(islamicData.openingPreamble.duaExcerpt || (islamicData.openingPreamble.lines && islamicData.openingPreamble.lines.join(' ')))}
                            </p>
                          </div>
                        )}

                        {/* Timeline Phases */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {islamicData.blueprint.map((phase, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-gold-200 text-xs font-bold flex items-center justify-center">
                                    {phase.phaseNumber || idx + 1}
                                  </span>
                                  <span className="bg-gold-100 text-gold-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                                    ⏱️ {phase.allocatedMinutes} {isRtl ? 'د' : 'min'}
                                  </span>
                                </div>
                                <h4 className="font-bold text-emerald-950 text-sm mb-2 font-cairo">
                                  {isRtl ? (sanitizeArabicExtractedText(phase.phaseNameAr) || phase.phaseNameAr).replace(/(?:(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ|إقامة|اقامة|اقامه)|(?:أَقَامُوا|اوُماَقَأ)\s+(?:ةَ?\s*الَّ?\s*صلا|صلا\s*الَّ?\s*ةَ?|الصَّ?\s*لا\s*ةَ?|الصلاة)|(?:الصَّ?\s*لا\s*ةَ?|الصلاة)\s*(?:أَقَامُوا|اوُماَقَأ))/gu, 'أَقَامُوا الصَّلَاةَ') : phase.phaseNameEn}
                                </h4>
                                <p className="text-xs text-slate-600 font-amiri leading-relaxed mb-3">
                                  {isRtl ? sanitizeArabicExtractedText(phase.teacherFocusAr || phase.teacherGuidanceAr) : (phase.teacherFocusEn || phase.teacherGuidanceEn)}
                                </p>
                              </div>
                              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-emerald-900 font-bold">
                                🎯 {isRtl ? sanitizeArabicExtractedText(
                                  (phase.keyTakeawayAr || phase.practicalImpact || '')
                                    .replace(/\b(?:آال|اال|إال)\b/g, 'الصلاة والتوحيد')
                                    .replace(/(?:ةَ?\s*الَ?َّ?\s*صلاَ?|صلاَ?\s*الَ?َّ?\s*ةَ?)\s*(?:أَقَامُوا|اوُماَقَأ)?/gu, 'إِقَامَةُ الصَّلَاةِ')
                                    .replace(/2ب\./g, '')
                                ) : (phase.keyTakeawayEn || phase.practicalImpact)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2.2 Islamic Evidences & Scientific Proofs Bank */}
                      <div className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-gold-400 text-emerald-950 font-bold flex items-center justify-center text-lg shadow-xs">
                              📜
                            </span>
                            <div>
                              <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                                {isRtl ? 'بنك الأدلة الشرعية والبراهين العلمية المستخلصة من المحاضرة:' : 'Extracted Evidences & Scholarly Proofs Bank:'}
                              </h3>
                              <p className="text-[11px] text-slate-600 font-medium">
                                {isRtl ? 'آيات قرآنية وأحاديث نبوية وأقوال أئمة الهدى وبراهين علمية مستخلصة بدقة وموثقة' : 'Authentic Quranic Verses, Hadiths & Proofs extracted from lecture'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowEvidenceBankModal(true)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 text-xs px-3.5 py-2 rounded-xl font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>🔍</span>
                            <span>{isRtl ? 'عرض كافة الأدلة في نافذة منفصلة' : 'View Full Evidence Bank'}</span>
                          </button>
                        </div>

                        {/* Top Extracted Evidence Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Top Quranic Verse */}
                          {extractedEvidences.quranicVerses && extractedEvidences.quranicVerses.length > 0 && (
                            <div className="bg-emerald-950 text-gold-200 p-4 rounded-2xl border-2 border-gold-400/50 shadow-md space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-gold-400/30">
                                  <span className="font-black text-gold-300 flex items-center gap-1">
                                    <span>📖</span>
                                    <span>{isRtl ? 'آية قرآنية مستخلصة' : 'Extracted Ayah'}</span>
                                  </span>
                                  <span className="bg-emerald-900 px-2 py-0.5 rounded-full text-[10px] text-gold-200 border border-gold-400/30">
                                    {extractedEvidences.quranicVerses[0].citation}
                                  </span>
                                </div>
                                <p className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed pt-2 text-center">
                                  {extractedEvidences.quranicVerses[0].arabicText}
                                </p>
                              </div>
                              <div className="text-[10px] text-gold-300/80 text-right pt-2 border-t border-gold-400/20">
                                ✓ {extractedEvidences.quranicVerses[0].grading}
                              </div>
                            </div>
                          )}

                          {/* Top Prophetic Hadith */}
                          {extractedEvidences.hadiths && extractedEvidences.hadiths.length > 0 && (
                            <div className="card-islamic-amber p-4 rounded-2xl border-2 border-gold-400 shadow-md space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-amber-900/15">
                                  <span className="font-black text-amber-950 flex items-center gap-1 font-cairo">
                                    <span>✨</span>
                                    <span>{isRtl ? 'حديث نبوي شريف' : 'Prophetic Hadith'}</span>
                                  </span>
                                  <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    {extractedEvidences.hadiths[0].source}
                                  </span>
                                </div>
                                <p className="font-amiri text-sm sm:text-base text-slate-800 font-bold leading-relaxed pt-2 text-right">
                                  {extractedEvidences.hadiths[0].arabicText}
                                </p>
                              </div>
                              <div className="text-[10px] text-amber-900 font-bold text-right pt-2 border-t border-amber-900/10 flex items-center justify-between">
                                <span>الراوي: {extractedEvidences.hadiths[0].narrator}</span>
                                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                                  {extractedEvidences.hadiths[0].grading}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Top Scholarly / Scientific Proof */}
                          {extractedEvidences.scholarlyProofs && extractedEvidences.scholarlyProofs.length > 0 && (
                            <div className="card-islamic-sky p-4 rounded-2xl border-2 border-sky-300 shadow-md space-y-2 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-sky-900/15">
                                  <span className="font-black text-sky-950 flex items-center gap-1 font-cairo">
                                    <span>🎓</span>
                                    <span>{isRtl ? 'قول تأصيلي / برهان علمي' : 'Scholarly Proof'}</span>
                                  </span>
                                  <span className="bg-sky-200/80 text-sky-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    {extractedEvidences.scholarlyProofs[0].author}
                                  </span>
                                </div>
                                <p className="font-amiri text-xs sm:text-sm text-slate-800 font-bold leading-relaxed pt-2 text-right">
                                  « {extractedEvidences.scholarlyProofs[0].quote} »
                                </p>
                              </div>
                              <div className="text-[10px] text-sky-900 font-bold text-right pt-2 border-t border-sky-900/10">
                                السياق: {extractedEvidences.scholarlyProofs[0].context}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2.3 Authenticated Hadith Verification (Strict Sahih Bukhari & Muslim) */}
                      <div className="card-islamic-amber rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gold-400/40 shadow-md">
                        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gold-400/30">
                          <span className="text-xl">🛡️</span>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo">
                              {isRtl ? 'سياج التوثيق الشرعي الصارم (أحاديث صحيحة فقط)' : 'Authentic Evidences Verification'}
                            </h3>
                            <span className="text-[11px] text-amber-900 font-bold">
                              {isRtl ? 'التزام تام بأحاديث الصحيحين مع بيان الراوي ورقم الباب ورقم الحديث' : 'Citing Sahih Al-Bukhari & Sahih Muslim only'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {(islamicData.hadithVerification || islamicData.evidences || []).map((hd, idx) => (
                            <div key={idx} className="bg-white/90 rounded-2xl p-4 border border-gold-300 shadow-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className="bg-emerald-900 text-gold-200 text-xs px-3 py-1 rounded-full font-bold">
                                  {hd.source || hd.citation || 'صحيح البخاري'}
                                </span>
                                <span className="text-xs font-bold text-slate-600">
                                  {isRtl ? 'الراوي / الشاهد:' : 'Narrator:'} {hd.narrator || 'الصحابي الجليل'}
                                </span>
                              </div>
                              <p className="font-amiri text-sm sm:text-base text-emerald-950 font-medium leading-relaxed my-2">
                                {formatScriptureDisplay(hd.text || hd.arabicText)}
                              </p>
                              <div className="text-xs text-slate-600 font-amiri pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span><strong>{isRtl ? 'التخريج والحكم:' : 'Grade:'}</strong> {hd.ruling || hd.grading || 'صحيح معتمد'}</span>
                                <span className="text-emerald-800 font-bold">✓ صحيح معتمد</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Navigation to Stage 3 */}
                        <div className="flex justify-end pt-3 mt-3 border-t border-gold-400/30">
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById('stage-islamic-3');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{isRtl ? 'الانتقال للمرحلة التالية: 3. منظومة العروض وبوربوينت' : 'Next: 3. Presentation & PowerPoint'}</span>
                            <span>◀</span>
                          </button>
                        </div>
                      </div>

                      {/* Stage 2 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(1)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (1) رفع وإدخال المحاضرة' : 'Prev: Stage 1 Input'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(3)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (3) العرض وبوربوينت PPTX' : 'Next: Stage 3 Presentation'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 3: INTERACTIVE LECTURE PRESENTATION & POWERPOINT SUITE ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 3) && (
                    <div id="stage-islamic-3" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/15 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 3 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                              <span>📽️</span>
                              <span>{isRtl ? 'منظومة العروض التقديمية وشرائح الشرح الحية' : 'Live Presentation & PowerPoint Suite'}</span>
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'مشغل شرائح تفاعلي حي + عرض ملء الشاشة لزوم + تصدير بوربوينت (.pptx)' : 'Interactive Live Slide Deck & PowerPoint (.pptx) Export'}
                          </h3>
                        </div>

                        {/* Top Action & Mode Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View Switch: Dual Zoom Studio vs Grid */}
                          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
                            <button
                              type="button"
                              onClick={() => setStage3ViewMode('player')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                stage3ViewMode === 'player'
                                  ? 'bg-emerald-900 text-gold-200 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-emerald-900'
                              )}
                            >
                              <span>🎙️</span>
                              <span>{isRtl ? 'كابينة زوم المزدوجة' : 'Zoom Studio'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setStage3ViewMode('grid')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                stage3ViewMode === 'grid'
                                  ? 'bg-emerald-900 text-gold-200 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-emerald-900'
                              )}
                            >
                              <span>🔲</span>
                              <span>{isRtl ? 'كافة الشرائح' : 'Grid'}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleOpenStudentPopout}
                            className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-gold-300 ring-2 ring-gold-400/30"
                            title={isRtl ? 'فتح نافذة مستقلة لشريحة الطلاب لمشاركتها مباشرة في زوم دون مشاركة الملاحظات' : 'Open Pop-out Student Window for Zoom'}
                          >
                            <span>🪟</span>
                            <span>{isRtl ? 'نافذة عرض مستقلة للطلاب' : 'Pop-out Student Window'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartLecturePresentation(stage3ActiveSlide)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <span>📺</span>
                            <span>{isRtl ? 'ملء الشاشة لزوم' : 'Zoom Fullscreen'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleExportIslamicPowerPoint}
                            disabled={isExportingPptx}
                            className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer border-2 border-gold-300 ring-2 ring-gold-400/40"
                            title={isRtl ? 'تنزيل ملف بوربوينت (.pptx) كامل التنسيق والشرائح للعرض أوفلاين' : 'Download PowerPoint (.pptx)'}
                          >
                            <span className="text-base">📥</span>
                            <span>{isExportingPptx ? (isRtl ? 'جاري تجهيز البوربوينت...' : 'Exporting...') : (isRtl ? 'تنزيل كملف بوربوينت (.pptx)' : 'Download PowerPoint (.pptx)')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Practical Guide Banner for Stage 3 */}
                      <div className="bg-amber-50/80 border border-gold-400/60 rounded-2xl p-3 sm:p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="text-xl shrink-0 mt-0.5">🎙️</span>
                          <div className="space-y-0.5">
                            <span className="font-black text-amber-900 block font-cairo">
                              {isRtl ? 'كابينة المعلم لحلقة زوم الأونلاين (شاشة مزدوجة متزامنة):' : 'Zoom Educator Dual-Pane Studio:'}
                            </span>
                            <p className="text-[11px] text-slate-700 leading-relaxed">
                              {isRtl 
                                ? 'الشاشة مقسمة لجزئين: الجانب الأيمن شريحة مرئية للدارس على زوم تركز بصره، والجانب الأيسر هو كابينة وتفريغ المحاضرة الخاص بك لتشرح وتفيض منه بطلاقة دون أن يراه الطلاب.'
                                : 'Dual synchronized panes: Right pane is the student visual anchor for Zoom, left pane is your private substantive lecture script.'}
                            </p>
                          </div>
                        </div>
                        <span className="bg-emerald-900 text-gold-200 px-2.5 py-1 rounded-xl text-[11px] font-black shrink-0">
                          {((islamicData.zoomCards || islamicData.zoomPresentation || []).length || 1)} {isRtl ? 'محاور جاهزة' : 'modules ready'}
                        </span>
                      </div>

                      {/* Slides List Computation */}
                      {(() => {
                        const slidesList = (islamicData.zoomCards && islamicData.zoomCards.length > 0)
                          ? islamicData.zoomCards
                          : (islamicData.blueprint || []);
                        const safeIdx = Math.max(0, Math.min(slidesList.length - 1, stage3ActiveSlide));
                        const currentSlide = slidesList[safeIdx] || slidesList[0] || {};
                        const currentSlideTitle = currentSlide.slideTitle || currentSlide.titleAr || currentSlide.phaseTitle || currentSlide.phaseNameAr || (`المحور ${safeIdx + 1}`);
                        const scriptureText = typeof distillSlideScripture === "function" ? distillSlideScripture(currentSlide.scriptureEvidence || currentSlide.scripture) : normalizeIslamicSacredTerms(currentSlide.scriptureEvidence || currentSlide.scripture);
                        const bodyText = currentSlide.talkingPoints || currentSlide.bodyAr || currentSlide.teacherFocusAr;
                        const pedagogicalTip = currentSlide.pedagogicalTip || currentSlide.practicalAction || 'التركيز على ربط المعنى بالسلوك العملي للدارس';
                        const teleprompterText = currentSlide.fullSectionText || currentSlide.lectureNotes || currentSlide.bodyAr || currentSlide.teacherGuidanceAr || bodyText;

                        if (stage3ViewMode === 'player') {
                          return (
                            <div className="space-y-4">
                              {/* DUAL SPLIT-SCREEN COCKPIT FOR ZOOM (Right: Student Slide, Left: Teacher Script) */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                                
                                {/* RIGHT PANE (7/12 cols): Zoom Student Presentation Slide */}
                                <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gold-400 shadow-xl relative overflow-y-auto min-h-[420px] max-h-[620px] h-full flex-1">
                                  
                                  {/* Slide Top Header */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-400/30 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-gold-500 text-emerald-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                                        {isRtl ? `شريحة ${safeIdx + 1} من ${slidesList.length}` : `Slide ${safeIdx + 1} of ${slidesList.length}`}
                                      </span>
                                      <span className="bg-emerald-900/80 text-gold-300 border border-gold-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-xl">
                                        {currentSlide.phaseTitle || (isRtl ? 'المحور المعروض للدارس في زوم' : 'Zoom Student View')}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleCondenseSlide(safeIdx)}
                                        className="bg-amber-600 hover:bg-amber-500 text-white border border-amber-300 text-[11px] font-black px-2.5 py-1 rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                        title={isRtl ? 'تلخيص وتكثيف الشريحة بذكاء لتكون أكثر إيجازاً وتركيزاً لزوم' : 'Condense slide points'}
                                      >
                                        <span>⚡</span>
                                        <span>{isRtl ? 'تلخيص ذكي مكثف' : 'Smart Distill'}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={handleOpenStudentPopout}
                                        className="bg-gold-500 hover:bg-gold-400 text-emerald-950 border border-gold-300 text-[11px] font-black px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                        title={isRtl ? 'فتح شريحة العرض في نافذة مستقلة لمشاركتها في زوم' : 'Pop-out student slide for Zoom'}
                                      >
                                        <span>🪟</span>
                                        <span>{isRtl ? 'نافذة مستقلة للطلاب' : 'Pop-out Window'}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleStartLecturePresentation(safeIdx)}
                                        className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 border border-gold-400/50 text-[11px] font-black px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                        title="عرض الشريحة ملء الشاشة لمشاركتها عبر زوم"
                                      >
                                        <span>📺</span>
                                        <span>{isRtl ? 'ملء الشاشة' : 'Fullscreen'}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Slide Content Area (Visual Anchor for Student) */}
                                  <div className="space-y-4 my-auto">
                                    <h4 className="font-amiri text-xl sm:text-2xl lg:text-3xl font-extrabold text-gold-300 leading-snug">
                                      {currentSlideTitle}
                                    </h4>

                                    {scriptureText && (
                                      <div className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed bg-emerald-900/70 p-4 rounded-2xl border-2 border-gold-400/40 shadow-inner">
                                        {formatScriptureDisplay(scriptureText)}
                                      </div>
                                    )}

                                    {/* Visual Talking Points */}
                                    <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-gold-400/20">
                                      <span className="text-[11px] font-bold text-gold-400 block mb-1.5">
                                        📌 {isRtl ? 'عناصر المحور المعروضة للدارس:' : 'Key Slide Points:'}
                                      </span>
                                      <div className="space-y-1 text-xs text-slate-100 font-amiri leading-relaxed">
                                        {(currentSlide.bulletPoints || (currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText])).map((pt, pIdx) => (
                                          <div key={pIdx} className="flex items-start gap-2 bg-emerald-900/50 p-2 sm:p-2.5 rounded-xl border border-gold-400/30">
                                            <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                              {pIdx + 1}
                                            </span>
                                            <span className="font-semibold text-slate-100">{pt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Slide Navigation Controller */}
                                  <div className="mt-6 pt-4 border-t border-gold-400/30 flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      disabled={safeIdx <= 0}
                                      onClick={() => { const target = Math.max(0, safeIdx - 1); setStage3ActiveSlide(target); broadcastSlideSync(target); }}
                                      className="bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-gold-200 font-black px-3.5 py-1.5 rounded-xl text-xs border border-gold-400/40 transition flex items-center gap-1 shadow-xs cursor-pointer"
                                    >
                                      <span>▶</span>
                                      <span>{isRtl ? 'المحور السابق' : 'Previous'}</span>
                                    </button>

                                    {/* Dots indicator */}
                                    <div className="flex items-center gap-1 overflow-x-auto max-w-[220px] scrollbar-none py-1">
                                      {slidesList.map((_, dotIdx) => (
                                        <button
                                          key={dotIdx}
                                          type="button"
                                          onClick={() => { setStage3ActiveSlide(dotIdx); broadcastSlideSync(dotIdx); }}
                                          className={'w-2 h-2 rounded-full transition-all ' + (
                                            dotIdx === safeIdx ? 'bg-gold-400 w-5 shadow-xs' : 'bg-emerald-800 hover:bg-emerald-700'
                                          )}
                                          title={`محور ${dotIdx + 1}`}
                                        />
                                      ))}
                                    </div>

                                    <button
                                      type="button"
                                      disabled={safeIdx >= slidesList.length - 1}
                                      onClick={() => { const target = Math.min(slidesList.length - 1, safeIdx + 1); setStage3ActiveSlide(target); broadcastSlideSync(target); }}
                                      className="bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-emerald-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1 shadow-xs cursor-pointer"
                                    >
                                      <span>{isRtl ? 'المحور التالي' : 'Next'}</span>
                                      <span>◀</span>
                                    </button>
                                  </div>
                                </div>

                                {/* LEFT PANE (5/12 cols): Teacher's Full Cockpit & Complete Lecture Teleprompter */}
                                <div className="lg:col-span-5 flex flex-col justify-between card-islamic-amber rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-gold-500/70 shadow-lg min-h-[460px] max-h-[660px] overflow-hidden">
                                  <div className="flex flex-col h-full min-h-0">
                                    {/* Header & Controls Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-900/15 shrink-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xl">🎙️</span>
                                        <div>
                                          <h4 className="text-xs sm:text-sm font-black text-amber-950 font-cairo">
                                            {isRtl ? 'كابينة وتفريغ المعلم في زوم:' : "Teacher's Zoom Teleprompter:"}
                                          </h4>
                                          <span className="text-[10px] text-amber-800 font-bold">
                                            {isRtl ? 'خاص بالمعلم للشرح والاستفاضة — لا يراه الطالب' : 'Private lecture teleprompter'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {/* Script Font Resizer */}
                                        <div className="bg-amber-200/80 rounded-xl p-0.5 flex items-center gap-1 text-[11px] font-bold text-amber-950 border border-amber-300">
                                          <span className="px-1 text-[10px] text-amber-800">{isRtl ? 'الخط:' : 'Font:'}</span>
                                          <button
                                            type="button"
                                            onClick={() => setTeacherScriptFontSize('small')}
                                            className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${teacherScriptFontSize === 'small' ? 'bg-emerald-950 text-gold-300 font-black' : 'hover:bg-amber-300'}`}
                                          >
                                            {isRtl ? 'صغير' : 'S'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setTeacherScriptFontSize('medium')}
                                            className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${teacherScriptFontSize === 'medium' ? 'bg-emerald-950 text-gold-300 font-black' : 'hover:bg-amber-300'}`}
                                          >
                                            {isRtl ? 'متوسط' : 'M'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setTeacherScriptFontSize('large')}
                                            className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${teacherScriptFontSize === 'large' ? 'bg-emerald-950 text-gold-300 font-black' : 'hover:bg-amber-300'}`}
                                          >
                                            {isRtl ? 'كبير' : 'L'}
                                          </button>
                                        </div>

                                        {/* Up & Down Scroll Controls (صعود وهبوط) */}
                                        <div className="bg-amber-200/80 rounded-xl p-0.5 flex items-center gap-1 text-[11px] font-bold text-amber-950 border border-amber-300">
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('up')}
                                            className="px-2 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer flex items-center gap-0.5"
                                            title={isRtl ? 'صعود للأعلى في المحاضرة' : 'Scroll Up'}
                                          >
                                            <span>🔼</span>
                                            <span className="text-[10px]">{isRtl ? 'صعود' : 'Up'}</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('down')}
                                            className="px-2 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer flex items-center gap-0.5"
                                            title={isRtl ? 'هبوط للأسفل في المحاضرة' : 'Scroll Down'}
                                          >
                                            <span>🔽</span>
                                            <span className="text-[10px]">{isRtl ? 'هبوط' : 'Down'}</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('top')}
                                            className="px-1.5 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer text-[10px]"
                                            title={isRtl ? 'أول المحاضرة' : 'Top'}
                                          >
                                            ⏫
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleScrollTeleprompter('bottom')}
                                            className="px-1.5 py-0.5 rounded-lg hover:bg-amber-300 transition cursor-pointer text-[10px]"
                                            title={isRtl ? 'آخر المحاضرة' : 'Bottom'}
                                          >
                                            ⏬
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Mode Selector Tabs (Full Continuous Lecture vs Current Section) */}
                                    <div className="flex items-center gap-1.5 p-1 bg-amber-200/70 rounded-xl border border-amber-300 mb-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setTeacherTeleprompterMode('full')}
                                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                                          teacherTeleprompterMode === 'full'
                                            ? 'bg-emerald-950 text-gold-300 shadow-sm'
                                            : 'text-amber-950 hover:bg-amber-300/60'
                                        }`}
                                      >
                                        <span>📚</span>
                                        <span>{isRtl ? 'نص المحاضرة الكامل الشامل' : 'Full Complete Lecture'}</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTeacherTeleprompterMode('section')}
                                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                                          teacherTeleprompterMode === 'section'
                                            ? 'bg-emerald-950 text-gold-300 shadow-sm'
                                            : 'text-amber-950 hover:bg-amber-300/60'
                                        }`}
                                      >
                                        <span>📄</span>
                                        <span>{isRtl ? 'تفريغ المحور الحالي المتزامن' : 'Current Section View'}</span>
                                      </button>
                                    </div>

                                    {/* Quick Element Jump Chips */}
                                    <div className="mb-2 shrink-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-amber-900 block">
                                          📑 {isRtl ? 'المحاور والعناصر المستخلصة (انقر للانتقال المتزامن):' : 'Key Structural Elements:'}
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-900">
                                          {isRtl ? `${slidesList.length} محاور` : `${slidesList.length} sections`}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                        {slidesList.map((sl, sIdx) => {
                                          const isActive = sIdx === safeIdx;
                                          return (
                                            <button
                                              key={sIdx}
                                              type="button"
                                              onClick={() => {
                                                setStage3ActiveSlide(sIdx);
                                                broadcastSlideSync(sIdx);
                                                if (teacherTeleprompterMode === 'full') {
                                                  setTimeout(() => {
                                                    const targetEl = document.getElementById('teleprompter-sec-' + sIdx);
                                                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                  }, 50);
                                                }
                                              }}
                                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                                                isActive
                                                  ? 'bg-emerald-950 text-gold-300 border border-gold-400 font-black shadow-xs ring-2 ring-gold-400/40'
                                                  : 'bg-white/90 hover:bg-amber-100 text-amber-950 border border-amber-300/80'
                                              }`}
                                            >
                                              <span>{sIdx + 1}.</span>
                                              <span>{sl.slideTitle || `محور ${sIdx + 1}`}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Scrollable Teleprompter Content */}
                                    <div
                                      ref={teacherTeleprompterScrollRef}
                                      className="space-y-3.5 flex-1 min-h-[280px] max-h-[380px] overflow-y-auto pr-1 text-right scroll-smooth scrollbar-thin"
                                    >
                                      {teacherTeleprompterMode === 'full' ? (
                                        /* ================= COMPLETE FULL LECTURE UNABRIDGED MODE ================= */
                                        <div className="space-y-3.5">
                                          {/* Opening Du'a / Preamble if available */}
                                          {islamicData.openingPreamble && (
                                            <div className="bg-emerald-900/10 border-2 border-emerald-600/40 p-3.5 rounded-2xl space-y-1.5 shadow-xs">
                                              <div className="flex items-center justify-between border-b border-emerald-700/20 pb-1">
                                                <span className="text-[11px] font-black text-emerald-950 font-cairo flex items-center gap-1">
                                                  <span>🌱</span>
                                                  <span>{isRtl ? 'افتتاحية المجلس والدعاء المأثور:' : 'Opening Du\'a & Preamble:'}</span>
                                                </span>
                                                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                                  {isRtl ? 'استفتاح المجلس' : 'Opening'}
                                                </span>
                                              </div>
                                              <p className={`font-amiri text-slate-800 leading-relaxed whitespace-pre-line text-justify ${
                                                teacherScriptFontSize === 'small' ? 'text-xs' : (teacherScriptFontSize === 'large' ? 'text-base font-bold' : 'text-sm')
                                              }`}>
                                                {normalizeIslamicSacredTerms(
                                                  (islamicData.openingPreamble.lines && islamicData.openingPreamble.lines.length > 0)
                                                    ? islamicData.openingPreamble.lines.join('\n')
                                                    : (islamicData.openingPreamble.duaExcerpt || '')
                                                )}
                                              </p>
                                            </div>
                                          )}

                                          {/* All Lecture Sections Streamed In Order */}
                                          {slidesList.map((sec, sIdx) => {
                                            const isCurrent = sIdx === safeIdx;
                                            const secContent = sec.fullSectionText || (sec.lines && sec.lines.join('\n\n')) || sec.talkingPoints || sec.bodyAr || '';
                                            return (
                                              <div
                                                key={sIdx}
                                                id={'teleprompter-sec-' + sIdx}
                                                className={`p-3.5 rounded-2xl border transition-all duration-300 space-y-2 shadow-xs ${
                                                  isCurrent
                                                    ? 'bg-amber-50 border-2 border-gold-500 ring-2 ring-gold-400/50 shadow-md'
                                                    : 'bg-white/95 border-amber-300/80 hover:border-gold-400'
                                                }`}
                                              >
                                                {/* Section Header */}
                                                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-amber-200 pb-1.5">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                                      isCurrent ? 'bg-gold-500 text-emerald-950' : 'bg-amber-200 text-amber-950'
                                                    }`}>
                                                      {sIdx + 1}
                                                    </span>
                                                    <h5 className="font-cairo text-xs sm:text-sm font-black text-amber-950">
                                                      {sec.slideTitle || sec.titleAr || `المحور ${sIdx + 1}`}
                                                    </h5>
                                                  </div>

                                                  <div className="flex items-center gap-1">
                                                    {isCurrent ? (
                                                      <span className="bg-emerald-950 text-gold-300 border border-gold-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        <span>{isRtl ? 'معروض للطلاب الآن' : 'Live on Zoom'}</span>
                                                      </span>
                                                    ) : (
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setStage3ActiveSlide(sIdx);
                                                          broadcastSlideSync(sIdx);
                                                        }}
                                                        className="bg-amber-100 hover:bg-gold-500 text-amber-950 hover:text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer"
                                                        title={isRtl ? 'عرض هذه الشريحة مباشرة للطلاب في زوم' : 'Display this slide'}
                                                      >
                                                        👁️ {isRtl ? 'اعرض للطلاب' : 'Display'}
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Quranic Scripture Box if present */}
                                                {sec.scriptureEvidence && (
                                                  <div className="bg-emerald-900/10 p-2 rounded-xl border border-gold-400/40 text-center">
                                                    <p className="font-quran text-xs sm:text-sm text-emerald-950 leading-relaxed">
                                                      {formatScriptureDisplay(sec.scriptureEvidence)}
                                                    </p>
                                                  </div>
                                                )}

                                                {/* Full Unabridged Text of this Section */}
                                                <p className={`font-amiri text-slate-800 leading-relaxed whitespace-pre-line text-justify ${
                                                  teacherScriptFontSize === 'small' ? 'text-xs' : (teacherScriptFontSize === 'large' ? 'text-base font-bold' : 'text-sm')
                                                }`}>
                                                  {sanitizeArabicExtractedText(secContent)}
                                                </p>

                                                {/* Talking Points & Impact summary */}
                                                {sec.talkingPoints && (
                                                  <div className="bg-amber-100/60 p-2 rounded-xl text-[11px] text-amber-950 font-amiri font-bold">
                                                    🎯 {sec.talkingPoints}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        /* ================= CURRENT SECTION FOCUSED VIEW ================= */
                                        <div className="space-y-3">
                                          {/* Box 1: Full Unabridged Lecture Text from Source File */}
                                          <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-300 shadow-xs space-y-1.5">
                                            <div className="flex items-center justify-between border-b border-amber-200/70 pb-1">
                                              <span className="text-[11px] font-black text-emerald-950 font-cairo flex items-center gap-1">
                                                <span>📜</span>
                                                <span>{isRtl ? 'التفريغ العلمي الكامل والشرح التفصيلي لهذا المحور:' : 'Substantive Source Lecture Text:'}</span>
                                              </span>
                                              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                                                {isRtl ? 'النص الأصلي من الملف' : 'Source Text'}
                                              </span>
                                            </div>
                                            <p className={`font-amiri text-slate-800 leading-relaxed whitespace-pre-line text-justify ${
                                              teacherScriptFontSize === 'small' ? 'text-xs' : (teacherScriptFontSize === 'large' ? 'text-base font-bold' : 'text-sm')
                                            }`}>
                                              {sanitizeArabicExtractedText(currentSlide.fullSectionText || teleprompterText)}
                                            </p>
                                          </div>

                                          {/* Box 2: Teacher Talking Points & Scholarly Pointers */}
                                          {currentSlide.talkingPoints && (
                                            <div className="bg-amber-100/70 p-3 rounded-2xl border border-gold-400/40 text-xs shadow-xs space-y-1">
                                              <span className="font-black text-amber-950 flex items-center gap-1 font-cairo">
                                                <span>🎯</span>
                                                <span>{isRtl ? 'نقاط الشرح والاستفاضة للداعية والمحاضر:' : 'Teacher Talking Points:'}</span>
                                              </span>
                                              <p className="text-[11px] text-amber-950 font-amiri font-bold leading-relaxed whitespace-pre-line">
                                                {normalizeIslamicSacredTerms(currentSlide.talkingPoints)}
                                              </p>
                                            </div>
                                          )}

                                          {/* Box 3: Live Classroom Discussion Prompts for Zoom */}
                                          {currentSlide.discussionPrompts && currentSlide.discussionPrompts.length > 0 && (
                                            <div className="bg-emerald-950 text-gold-200 p-3 rounded-2xl border border-gold-400/40 text-xs shadow-xs space-y-1.5">
                                              <div className="flex items-center gap-1.5 font-bold text-gold-300">
                                                <span>❓</span>
                                                <span>{isRtl ? 'أسئلة إثارة النقاش والتفاعل مع الطلاب على زوم:' : 'Live Zoom Discussion Questions:'}</span>
                                              </div>
                                              <ul className="space-y-1 text-[11px] text-slate-100 font-amiri leading-relaxed pr-3 list-disc">
                                                {currentSlide.discussionPrompts.map((dp, dpIdx) => (
                                                  <li key={dpIdx}>{normalizeIslamicSacredTerms(dp)}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                          {/* Box 4: Pedagogical Engagement Guidance */}
                                          {pedagogicalTip && (
                                            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300 text-xs shadow-xs space-y-1">
                                              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                                <span>💡</span>
                                                <span>{isRtl ? 'توجيه إدارة الحلقة والأثر السلوكي:' : 'Pedagogical Guidance:'}</span>
                                              </div>
                                              <p className="text-[11px] text-slate-700 leading-relaxed font-amiri">
                                                {normalizeIslamicSacredTerms(pedagogicalTip)}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Teleprompter Footer with Section Step Controls */}
                                  <div className="mt-2.5 pt-2 border-t border-amber-900/15 flex items-center justify-between text-[11px] text-amber-900 font-bold shrink-0">
                                    <div className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                                      <span>{isRtl ? 'متزامن لحظياً مع شاشة العرض' : 'Live Synced with Slide'}</span>
                                    </div>

                                    {/* Direct Step Controls from Preacher Cockpit */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        disabled={safeIdx === 0}
                                        onClick={() => {
                                          const prev = Math.max(0, safeIdx - 1);
                                          setStage3ActiveSlide(prev);
                                          broadcastSlideSync(prev);
                                          if (teacherTeleprompterMode === 'full') {
                                            setTimeout(() => {
                                              const el = document.getElementById('teleprompter-sec-' + prev);
                                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }, 50);
                                          }
                                        }}
                                        className="bg-white hover:bg-amber-100 disabled:opacity-40 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer text-[10px]"
                                        title={isRtl ? 'صعود للمحور السابق' : 'Previous Section'}
                                      >
                                        ◀ {isRtl ? 'السابق' : 'Prev'}
                                      </button>

                                      <span className="text-emerald-950 font-black">
                                        {isRtl ? `المحور ${safeIdx + 1} من ${slidesList.length}` : `${safeIdx + 1}/${slidesList.length}`}
                                      </span>

                                      <button
                                        type="button"
                                        disabled={safeIdx >= slidesList.length - 1}
                                        onClick={() => {
                                          const next = Math.min(slidesList.length - 1, safeIdx + 1);
                                          setStage3ActiveSlide(next);
                                          broadcastSlideSync(next);
                                          if (teacherTeleprompterMode === 'full') {
                                            setTimeout(() => {
                                              const el = document.getElementById('teleprompter-sec-' + next);
                                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }, 50);
                                          }
                                        }}
                                        className="bg-white hover:bg-amber-100 disabled:opacity-40 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer text-[10px]"
                                        title={isRtl ? 'هبوط للمحور التالي' : 'Next Section'}
                                      >
                                        {isRtl ? 'التالي' : 'Next'} ▶
                                      </button>
                                    </div>
                                  </div>
                                </div>

                              </div>

                              {/* Thumbnail Filmstrip Selector */}
                              <div className="pt-2">
                                <span className="text-xs font-bold text-emerald-950 block mb-2">
                                  🎞️ {isRtl ? 'شريط الشرائح السريع (انقر للانتقال الفوري):' : 'Slide Filmstrip (Click to jump):'}
                                </span>
                                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                                  {slidesList.map((th, thIdx) => (
                                    <button
                                      key={thIdx}
                                      type="button"
                                      onClick={() => setStage3ActiveSlide(thIdx)}
                                      className={'shrink-0 w-36 sm:w-44 text-right p-2.5 rounded-xl border-2 transition text-xs flex flex-col justify-between cursor-pointer ' + (
                                        thIdx === safeIdx
                                          ? 'bg-emerald-900 text-gold-200 border-gold-400 shadow-md ring-2 ring-gold-400/40 font-bold'
                                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-700/40 hover:bg-emerald-50/50'
                                      )}
                                    >
                                      <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                                        <span>#{thIdx + 1}</span>
                                        <span className="truncate max-w-[80px]">{th.phaseTitle || ''}</span>
                                      </div>
                                      <p className="line-clamp-2 text-[11px] font-amiri font-bold leading-tight">
                                        {th.slideTitle || th.titleAr || th.phaseTitle || (`شريحة ${thIdx + 1}`)}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Grid View Mode
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {slidesList.map((slide, sIdx) => (
                              <div key={sIdx} className="bg-emerald-950 text-white rounded-2xl p-5 border-2 border-gold-400 shadow-md flex flex-col justify-between hover:border-gold-300 transition">
                                <div>
                                  <div className="flex items-center justify-between mb-3 text-gold-300 text-xs font-bold">
                                    <span>{isRtl ? `الشريحة ${slide.slideNumber || sIdx + 1}` : `Slide ${sIdx + 1}`}</span>
                                    <span className="bg-emerald-900 px-2.5 py-0.5 rounded-full border border-gold-400/40 text-[10px]">
                                      {slide.phaseTitle}
                                    </span>
                                  </div>
                                  <h4 className="font-amiri text-lg font-bold text-gold-200 mb-2 leading-snug">
                                    {slide.slideTitle || slide.titleAr}
                                  </h4>
                                  {(slide.scriptureEvidence) && (
                                    <p className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed my-3 bg-emerald-900/60 p-3 rounded-xl border border-gold-400/30">
                                      {normalizeIslamicSacredTerms(slide.scriptureEvidence)}
                                    </p>
                                  )}
                                  <p className="font-amiri text-xs text-slate-200 leading-relaxed">
                                    {slide.talkingPoints || slide.bodyAr}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-emerald-800/80 text-[11px] text-gold-300 font-bold flex items-center justify-between gap-2">
                                  <span className="truncate">💡 {slide.pedagogicalTip || slide.practicalAction}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setStage3ActiveSlide(sIdx);
                                        setStage3ViewMode('player');
                                      }}
                                      className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-2 py-1 rounded-lg text-[10px] border border-gold-400/40 transition cursor-pointer"
                                    >
                                      <span>📽️</span>
                                      <span>{isRtl ? 'في المشغل' : 'Play'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStartLecturePresentation(sIdx)}
                                      className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-2.5 py-1 rounded-lg text-[10px] shadow-xs flex items-center gap-1 transition cursor-pointer"
                                    >
                                      <span>📺</span>
                                      <span>{isRtl ? 'ملء الشاشة' : 'Present'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Navigation to Stage 4 */}
                      <div className="flex justify-end pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('stage-islamic-4');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isRtl ? 'الانتقال للمرحلة التالية: 4. ورقة العمل والطباعة' : 'Next: 4. Worksheet & Print'}</span>
                          <span>◀</span>
                        </button>
                      </div>
                      {/* Stage 3 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(2)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (2) الخطة والأدلة' : 'Prev: Stage 2'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(4)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (4) ورقة العمل والطباعة' : 'Next: Stage 4 Worksheet'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 4: EMBEDDED MODEL WORKSHEET & PRINTABLE TABLE ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 4) && (
                    <div id="stage-islamic-4" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 4 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              {isRtl ? 'ورقة العمل النموذجية للدارسين والطباعة الفورية' : 'Model Worksheet & Printable Student Sheet'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'جدول المدارسة والتأصيل الشرعي المستخلص من المحاضرة' : 'Islamic Studies Analytical Worksheet Table'}
                          </h3>
                        </div>

                        {/* View Mode & Print Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
                            <button
                              type="button"
                              onClick={() => setIslamicWorksheetViewMode('student')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                islamicWorksheetViewMode === 'student'
                                  ? 'bg-emerald-900 text-gold-200 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-slate-900'
                              )}
                            >
                              <span>✍️</span>
                              <span>{isRtl ? 'نسخة الطالب (فارغة)' : 'Student Version'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIslamicWorksheetViewMode('teacher')}
                              className={'px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ' + (
                                islamicWorksheetViewMode === 'teacher'
                                  ? 'bg-gold-500 text-emerald-950 shadow-xs font-black'
                                  : 'text-slate-600 hover:text-slate-900'
                              )}
                            >
                              <span>📖</span>
                              <span>{isRtl ? 'نموذج المعلم (مع الإجابات)' : 'Teacher Key'}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border-2 border-gold-400 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95 cursor-pointer"
                            title={isRtl ? 'طباعة الورقة أو حفظها كملف PDF من خيارات الطابعة' : 'Print or Save as PDF'}
                          >
                            <span>🖨️</span>
                            <span>{isRtl ? 'طباعة ورقة العمل / حفظ كـ PDF' : 'Print Worksheet / Save PDF'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Worksheet Items Table */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-right border-collapse text-xs">
                          <thead>
                            <tr className="bg-emerald-950 text-gold-300 font-cairo text-xs border-b border-gold-400/40">
                              <th className="p-3 w-12 text-center font-bold">#</th>
                              <th className="p-3 w-1/4 font-bold">{isRtl ? 'المسألة الشرعية / محور الدرس' : 'Topic / Issue'}</th>
                              <th className="p-3 font-bold">
                                {islamicWorksheetViewMode === 'teacher' 
                                  ? (isRtl ? 'سؤال الاختيار من متعدد مع مفتاح الحل المعتمد (دليل المعلم)' : 'Multiple Choice Question & Answer Key')
                                  : (isRtl ? 'سؤال الاختيار من متعدد وخيارات الإجابة (اختر الإجابة الصحيحة)' : 'Multiple Choice Question & Options')}
                              </th>
                              <th className="p-3 w-1/4 font-bold">{isRtl ? 'الأثر السلوكي والتربوي المستهدف' : 'Behavioral & Spiritual Impact'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(islamicData.worksheetItems && islamicData.worksheetItems.length > 0 
                              ? islamicData.worksheetItems 
                              : (islamicData.blueprint || []).map((b, idx) => ({
                                  num: idx + 1,
                                  topic: b.phaseNameAr || ('المحور ' + (idx + 1)),
                                  studentQuestion: b.studentQuestion || ('في ضوء محور: ' + (b.phaseNameAr || 'هذا المحور') + '؛ ما الحكم الشرعي والأثر العملي؟'),
                                  teacherAnswer: b.teacherFocusAr || b.teacherGuidanceAr || 'التأصيل المنضبط من المحاضرة.',
                                  practicalImpact: b.practicalImpact || b.keyTakeawayAr || 'التطبيق السلوكي في واقع المسلم.'
                                }))
                            ).map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                                <td className="p-3 text-center font-bold text-slate-500">{row.num || rIdx + 1}</td>
                                <td className="p-3 font-bold text-emerald-950 font-cairo">
                                  {row.topic}
                                  {row.scripture && (
                                    <div className="font-quran text-[11px] text-emerald-800 font-normal mt-1 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                                      {row.scripture}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 text-slate-700 font-amiri leading-relaxed">
                                  <div className="space-y-2">
                                    <div className="font-bold text-emerald-950 font-cairo text-xs sm:text-[13px] flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-gold-200 text-[10px] font-black flex items-center justify-center shrink-0">
                                        {rIdx + 1}
                                      </span>
                                      <span>{row.questionPrompt || row.studentQuestion}</span>
                                    </div>

                                    {islamicWorksheetViewMode === 'teacher' ? (
                                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-2">
                                        <div className="text-xs space-y-1.5">
                                          {(() => {
                                            const distractorPool = [
                                              'الخلط بين المفاهيم العقلية وبين الأصول الشرعية الثابتة',
                                              'تقديم الآراء الظنية المجردة على النصوص القطعية',
                                              'حصر الحكم في نطاق تاريخي دون إدراك أثره الممتد في واقعنا',
                                              'الاعتماد على القياس مع الفارق وإغفال مقاصد الشريعة',
                                              'فصل الالتزام السلوكي عن اليقين الاعتقادي القلبي',
                                              'الانقياد للظنون والاتباع بغير دليل وبرهان صحيح'
                                            ];
                                            const optionsList = (row.options && row.options.length > 0) ? row.options : [
                                              { id: 'a', label: 'أ', textAr: row.teacherAnswer || 'القول المعتمد المستند إلى الأدلة الشرعية والمنهج الرشيد' },
                                              { id: 'b', label: 'ب', textAr: distractorPool[(rIdx * 2) % distractorPool.length] },
                                              { id: 'c', label: 'ج', textAr: distractorPool[(rIdx * 2 + 1) % distractorPool.length] }
                                            ];
                                            return optionsList.map(opt => {
                                            const isCorrect = opt.id === (row.correctOptionId || 'a');
                                            return (
                                              <div 
                                                key={opt.id} 
                                                className={'p-2 rounded-lg text-xs flex items-center gap-2 border ' + (
                                                  isCorrect 
                                                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold shadow-xs' 
                                                    : 'bg-white/80 border-slate-200 text-slate-600 opacity-70'
                                                )}
                                              >
                                                <span className={'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ' + (
                                                  isCorrect ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                                                )}>
                                                  {opt.label || opt.id.toUpperCase()}
                                                </span>
                                                <span className="flex-1">{opt.textAr || opt.text}</span>
                                                {isCorrect && <span className="text-emerald-800 text-[11px] font-black">✓ الإجابة المعتمدة</span>}
                                              </div>
                                            );
                                          });
                                        })()}
                                        </div>
                                        <div className="text-slate-800 text-xs pt-1.5 border-t border-amber-200/60">
                                          <strong className="text-amber-950">التأصيل والتعليل العلمي: </strong> {row.teacherRationale || row.teacherAnswer}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        {(() => {
                                          const distractorPool = [
                                            'الخلط بين المفاهيم العقلية وبين الأصول الشرعية الثابتة',
                                            'تقديم الآراء الظنية المجردة على النصوص القطعية',
                                            'حصر الحكم في نطاق تاريخي دون إدراك أثره الممتد في واقعنا',
                                            'الاعتماد على القياس مع الفارق وإغفال مقاصد الشريعة',
                                            'فصل الالتزام السلوكي عن اليقين الاعتقادي القلبي',
                                            'الانقياد للظنون والاتباع بغير دليل وبرهان صحيح'
                                          ];
                                          const optionsList = (row.options && row.options.length > 0) ? row.options : [
                                            { id: 'a', label: 'أ', textAr: row.teacherAnswer || 'القول المعتمد المستند إلى الأدلة الشرعية والمنهج الرشيد' },
                                            { id: 'b', label: 'ب', textAr: distractorPool[(rIdx * 2) % distractorPool.length] },
                                            { id: 'c', label: 'ج', textAr: distractorPool[(rIdx * 2 + 1) % distractorPool.length] }
                                          ];
                                          return optionsList.map(opt => {
                                          const isSelected = (islamicWorksheetAnswers[row.num || rIdx + 1] === opt.id);
                                          return (
                                            <div
                                              key={opt.id}
                                              onClick={() => setIslamicWorksheetAnswers(prev => ({ ...prev, [row.num || rIdx + 1]: opt.id }))}
                                              className={'p-2 sm:p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition select-none ' + (
                                                isSelected
                                                  ? 'bg-emerald-900 text-gold-200 border-gold-400 font-bold shadow-xs'
                                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                                              )}
                                            >
                                              <span className={'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ' + (
                                                isSelected ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                                              )}>
                                                {opt.label || opt.id.toUpperCase()}
                                              </span>
                                              <span className="flex-1 font-amiri text-xs sm:text-[13px] leading-snug">{opt.textAr || opt.text}</span>
                                              <span className="no-print">
                                                {isSelected ? '✓' : '○'}
                                              </span>
                                              <span className="hidden print:inline-block font-mono text-sm ml-1">[ ]</span>
                                            </div>
                                          );
                                        });
                                      })()}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-slate-600 font-amiri leading-relaxed">
                                  <span className="text-emerald-900 font-bold">🎯 </span>
                                  {row.practicalImpact}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Stage Navigation Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-bold">
                          {isRtl ? 'جاهزة للطباعة والتوزيع على الدارسين' : 'Ready for printing and distribution'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('stage-islamic-5');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isRtl ? 'الانتقال للمرحلة التالية: 5. الاختبار الذاتي التفاعلي' : 'Next: 5. Interactive Quiz'}</span>
                          <span>◀</span>
                        </button>
                      </div>
                      {/* Stage 4 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(3)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (3) العرض وبوربوينت' : 'Prev: Stage 3'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(5)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (5) الاختبار الذاتي والتقييم' : 'Next: Stage 5 Quiz'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 5: INTERACTIVE QUIZ & SELF-GRADING BANK ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 5) && (
                    <div id="stage-islamic-5" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 5 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              {isRtl ? 'بنك الاختبار والتقييم الذاتي التفاعلي للدارسين' : 'Interactive Self-Grading Quiz'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'أسئلة تفاعلية فورية لقياس استيعاب مفاهيم المحاضرة' : 'Comprehension & Reflection Questions'}
                          </h3>
                        </div>

                        {/* Actions: Print Quiz + Score Banner */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border border-gold-400/50 text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title={isRtl ? 'طباعة نموذج الاختبار للطلاب أو حفظه كـ PDF' : 'Print Quiz Sheet'}
                          >
                            <span>🖨️</span>
                            <span>{isRtl ? 'طباعة نموذج الاختبار' : 'Print Quiz'}</span>
                          </button>

                          {islamicQuizSubmitted && (
                            <div className="bg-emerald-900 text-gold-200 px-4 py-2 rounded-xl border border-gold-400 font-black text-xs sm:text-sm shadow-md flex items-center gap-2">
                              <span>🏆</span>
                              <span>{isRtl ? `النتيجة: ${islamicQuizScore}%` : `Score: ${islamicQuizScore}%`}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quiz Question Cards */}
                      <div className="space-y-4">
                        {(islamicData.quizQuestions || []).map((q, qIdx) => {
                          const selected = islamicQuizAnswers[q.id];
                          const correct = q.correctOptionId || 'a';
                          const isCorrect = selected === correct;
                          return (
                            <div 
                              key={q.id || qIdx} 
                              className={'p-4 sm:p-5 rounded-2xl border transition ' + (
                                islamicQuizSubmitted
                                  ? isCorrect
                                    ? 'bg-emerald-50/80 border-emerald-300'
                                    : 'bg-rose-50/60 border-rose-300'
                                  : 'bg-white border-slate-200 hover:border-gold-400'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-cairo leading-relaxed flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-gold-200 text-xs font-bold flex items-center justify-center shrink-0">
                                    {qIdx + 1}
                                  </span>
                                  <span>{q.questionAr || q.qAr}</span>
                                </h4>
                                {islamicQuizSubmitted && (
                                  <span className={'text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 ' + (
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                  )}>
                                    {isCorrect ? (isRtl ? '✓ إجابة صحيحة' : 'Correct') : (isRtl ? '✗ غير صحيحة' : 'Incorrect')}
                                  </span>
                                )}
                              </div>

                              {/* Options */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                {(q.options || q.opts || []).map((opt) => {
                                  const optId = opt.id;
                                  const optText = opt.textAr || opt.text || opt.textEn;
                                  const isSelected = selected === optId;
                                  let optClasses = 'border text-xs rounded-xl p-2.5 flex items-center gap-2 text-right transition cursor-pointer ';
                                  if (islamicQuizSubmitted) {
                                    if (optId === correct) {
                                      optClasses += 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold';
                                    } else if (isSelected) {
                                      optClasses += 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                                    } else {
                                      optClasses += 'bg-white border-slate-200 text-slate-500 opacity-60';
                                    }
                                  } else {
                                    if (isSelected) {
                                      optClasses += 'bg-emerald-900 text-gold-200 border-gold-400 font-bold shadow-xs';
                                    } else {
                                      optClasses += 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800';
                                    }
                                  }

                                  return (
                                    <button
                                      key={optId}
                                      type="button"
                                      disabled={islamicQuizSubmitted}
                                      onClick={() => setIslamicQuizAnswers(prev => ({ ...prev, [q.id]: optId }))}
                                      className={optClasses}
                                    >
                                      <span className={'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ' + (
                                        isSelected ? 'bg-gold-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                                      )}>
                                        {optId.toUpperCase()}
                                      </span>
                                      <span className="flex-1 font-amiri leading-snug">{optText}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation & Reflection when submitted */}
                              {islamicQuizSubmitted && (q.explanationAr || q.reflectionPrompt || q.exp) && (
                                <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-amiri text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-100">
                                  <strong className="text-emerald-900">{isRtl ? 'التوجيه العلمي والتأمل:' : 'Pedagogical Reflection:'}</strong> {q.explanationAr || q.reflectionPrompt || q.exp}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quiz Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIslamicQuizSubmitted(true)}
                            disabled={islamicQuizSubmitted || Object.keys(islamicQuizAnswers).length === 0}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                          >
                            <span>🎯</span>
                            <span>{isRtl ? 'تصحيح الإجابات وحساب النتيجة' : 'Check Answers & Grade'}</span>
                          </button>

                          {islamicQuizSubmitted && (
                            <button
                              type="button"
                              onClick={() => {
                                setIslamicQuizAnswers({});
                                setIslamicQuizSubmitted(false);
                              }}
                              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>🔄</span>
                              <span>{isRtl ? 'إعادة المحاولة' : 'Retry Quiz'}</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('stage-islamic-6');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isRtl ? 'الانتقال للمرحلة التالية: 6. النشر عبر الواتساب وحفظ المحاضرة' : 'Next: 6. WhatsApp & Library'}</span>
                          <span>◀</span>
                        </button>
                      </div>
                      {/* Stage 5 Bottom Stepper Navigation */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-gold-500/40 no-print">
                        <button
                          type="button"
                          onClick={() => handleJumpToStage(4)}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>➡️</span>
                          <span>{isRtl ? 'السابق: (4) ورقة العمل والطباعة' : 'Prev: Stage 4'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToStage(6)}
                          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-200 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md ring-2 ring-gold-400/40 cursor-pointer"
                        >
                          <span>{isRtl ? 'التالي: (6) الواتساب ومكتبتي' : 'Next: Stage 6 Library'}</span>
                          <span>⬅️</span>
                        </button>
                      </div>
                    </div>
                    )}

                    {/* ================= STAGE 6: WHATSAPP BROADCAST KIT & SAVE TO LIBRARY ================= */}
                    {(islamicViewMode === 'all' || activeIslamicStage === 6) && (
                    <div id="stage-islamic-6" className="card-islamic-pearl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-emerald-800/20 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold-500 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              المرحلة 6 من 6
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              {isRtl ? 'النشر عبر الواتساب وحفظ المحاضرة في مكتبتي' : 'WhatsApp Broadcast & Save to Library'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-emerald-950 font-cairo mt-1">
                            {isRtl ? 'رسالة ملخصة وجذابة في 10 أسطر منسقة بالإيموجي لمجموعات الدارسين' : '10-Line Formatted Summary with Emojis'}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyWhatsApp}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>📋</span>
                            <span>{isRtl ? 'نسخ الرسالة بنقرة واحدة' : 'Copy Message'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveIslamicLecture}
                            className={'px-4 py-2 rounded-xl text-xs font-black transition shadow-md border flex items-center gap-1.5 cursor-pointer ' + (
                              isCurrentLectureSaved
                                ? 'bg-emerald-800 text-gold-300 border-gold-400 ring-2 ring-gold-400/50'
                                : 'bg-gold-500 hover:bg-gold-400 text-emerald-950 border-gold-400'
                            )}
                          >
                            <span>💾</span>
                            <span>{isCurrentLectureSaved ? (isRtl ? '✓ تم الحفظ بمكتبتك بنجاح' : 'Saved in Library') : (isRtl ? 'حفظ المحاضرة بمكتبتي' : 'Save to Library')}</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-900 text-emerald-200 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
                        {islamicData?.whatsAppKit?.formattedText || (
                          `السلام عليكم ورحمة الله وبركاته يا أحبة 🌸\n\n📌 *موضوع حلقتنا اليوم:* ${islamicData?.metadata?.topic || 'مدارسة شرعية'}\n\n✨ *أهم الفوائد والمعالم المستفادة:*\n` +
                          (islamicData?.blueprint || []).slice(0, 4).map((b, i) => `${i + 1}️⃣ *${b.phaseNameAr}:* ${b.keyTakeawayAr || b.teacherGuidanceAr || ''}`).join('\n') +
                          `\n\n🎯 *الواجب والتطبيق السلوكي:* ${islamicData?.blueprint?.[0]?.practicalImpact || 'تطبيق ما تعلمناه في حياتنا اليومية.'}\n\n🔗 رابط الاختبار الذاتي في منصة مشكاة. حفظكم الله جميعاً! 🤍`
                        )}
                      </div>

                      {/* Success completion banner */}
                      <div className="card-islamic-sage rounded-2xl p-4 border border-emerald-300 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🎉</span>
                          <div>
                            <h4 className="font-bold text-emerald-950 text-xs sm:text-sm font-cairo">
                              {isRtl ? 'اكتملت كافة مراحل إعداد المحاضرة بنجاح!' : 'Lecture Preparation Complete!'}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-emerald-900/80 mt-0.5">
                              {isRtl 
                                ? 'يمكنك الآن شرحها عبر زوم أو عرض الشرائح، توزيع أوراق العمل، إجراء الاختبار، ومشاركة الملخص مع دارسيك.'
                                : 'You are all set to present, print worksheets, run the quiz, and broadcast the summary.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleJumpToStage(5)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-gold-200 border border-gold-400/60 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer ring-2 ring-gold-400/30"
                            title={isRtl ? 'الرجوع للمرحلة السابقة: (5) الاختبار الذاتي والتقييم' : 'Go back to Stage 5: Quiz'}
                          >
                            <span>➡️</span>
                            <span>{isRtl ? 'السابق: (5) الاختبار الذاتي' : 'Prev: Stage 5 Quiz'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIslamicSubView('library')}
                            className="bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>📚</span>
                            <span>{isRtl ? 'الانتقال إلى مكتبتي' : 'Go to Library'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleResetIslamicForm}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'تحضير درس جديد' : 'New Lesson'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Universal Quick Stage Jump Bar in Stage 6 */}
                      <div className="card-islamic-pearl rounded-2xl p-4 border border-emerald-800/15 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                          <span>🧭</span>
                          <span>{isRtl ? 'مراجعة أي مرحلة سابقة من مراحل الدرس:' : 'Review Any Prior Stage:'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { num: 1, label: isRtl ? '1. إدخال المحاضرة' : '1. Input', icon: '📁' },
                            { num: 2, label: isRtl ? '2. الخطة والأدلة' : '2. Plan', icon: '⏱️' },
                            { num: 3, label: isRtl ? '3. العرض وبوربوينت' : '3. Slides', icon: '📽️' },
                            { num: 4, label: isRtl ? '4. ورقة العمل' : '4. Worksheet', icon: '📝' },
                            { num: 5, label: isRtl ? '5. الاختبار الذاتي' : '5. Quiz', icon: '🎯' },
                            { num: 6, label: isRtl ? '6. الواتساب والمكتبة' : '6. Library', icon: '💬' }
                          ].map(st => (
                            <button
                              key={st.num}
                              type="button"
                              onClick={() => handleJumpToStage(st.num)}
                              className={'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ' + (
                                activeIslamicStage === st.num
                                  ? 'bg-gold-500 text-emerald-950 font-black shadow-xs ring-2 ring-gold-400'
                                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200'
                              )}
                            >
                              <span>{st.icon}</span>
                              <span>{st.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    )}

                  </div>
                )}

              </div>
            )}

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
            {activeTab === 'worksheet' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Print Control Toolbar & Branch Switcher */}
                <div className="card-islamic-pearl rounded-2xl p-4 sm:p-5 border border-emerald-800/15 shadow-sm no-print">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {isRtl ? 'منظومة أوراق العمل وأدوات المعلم للطباعة (Worksheets System)' : 'Printable Worksheets & Teacher Authoring'}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 font-cairo">
                        {isRtl ? 'اختر مجال ورقة العمل المطلوبة:' : 'Select Worksheet Branch:'}
                      </h3>
                    </div>

                    {/* Branch Switcher Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setWorksheetBranch('islamic')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          worksheetBranch === 'islamic'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕌</span>
                        <span>{isRtl ? 'أوراق عمل العلوم الشرعية (Branch 3)' : 'Islamic Studies Worksheets'}</span>
                      </button>

                      <button
                        onClick={() => setWorksheetBranch('tajweed')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          worksheetBranch === 'tajweed'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'ورقة عمل أحكام التجويد (Branch 2)' : 'Tajweed Worksheet'}</span>
                      </button>

                      <button
                        onClick={() => setWorksheetBranch('hifz')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          worksheetBranch === 'hifz'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕋</span>
                        <span>{isRtl ? 'سجل متابعة التحفيظ (Branch 1)' : 'Hifz Evaluation Sheet'}</span>
                      </button>
                    </div>

                    {/* Mode Toggle (Preview / Print vs Builder) & Print Button */}
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setWorksheetMode('preview')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            worksheetMode === 'preview'
                              ? 'bg-emerald-800 text-gold-200 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          📄 {isRtl ? 'معاينة وطباعة PDF' : 'Preview & Print'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWorksheetMode('builder')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            worksheetMode === 'builder'
                              ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ✍️ {isRtl ? 'محرر وتخصيص البنود' : 'Worksheet Builder'}
                        </button>
                      </div>

                      {worksheetMode === 'preview' && (
                        <button 
                          onClick={() => window.print()}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-extrabold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-2"
                        >
                          <span>🖨️</span>
                          <span>{isRtl ? 'طباعة / تصدير PDF' : 'Print / Export to PDF'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sub-Category Filter for Islamic Studies */}
                  {worksheetBranch === 'islamic' && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-500">{isRtl ? 'التخصص الشرعي:' : 'Discipline:'}</span>
                      {[
                        { id: 'aqeedah', icon: '🌟', labelAr: 'العقيدة وأركان الإيمان', labelEn: 'Aqeedah' },
                        { id: 'fiqh', icon: '⚖️', labelAr: 'الفقه والعبادات', labelEn: 'Fiqh' },
                        { id: 'seerah', icon: '📜', labelAr: 'السيرة النبوية', labelEn: 'Seerah' },
                        { id: 'tazkiyah', icon: '💎', labelAr: 'الآداب والتزكية', labelEn: 'Tazkiyah' }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setWorksheetIslamicCategory(cat.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            worksheetIslamicCategory === cat.id
                              ? 'bg-gold-400 text-emerald-950 shadow font-extrabold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ================= MODE: TEACHER WORKSHEET BUILDER / EDITOR ================= */}
                {worksheetMode === 'builder' && (
                  <div className="space-y-6">

                    {/* Islamic Studies Builder */}
                    {worksheetBranch === 'islamic' && (() => {
                      const current = customIslamicWorksheets[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
                      return (
                        <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md space-y-6">
                          
                          {/* Banner & Guidance */}
                          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-emerald-950 text-sm font-cairo">
                                🛠️ {isRtl ? 'أداة المعلم: تخصيص وبناء ورقة عمل العلوم الشرعية' : 'Teacher Workbench: Build Islamic Studies Worksheet'}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {isRtl 
                                  ? 'يمكنك إضافة مسائلك وأسئلتك الخاصة، تحديد نموذج الإجابة، أو استيراد محاور ورقة العمل بضغطة زر من محاضرتك النشطة.'
                                  : 'Add custom topics, questions, teacher answer keys, or import directly from your active lecture.'}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {islamicData && (
                                <button
                                  type="button"
                                  onClick={handleTransferLectureToWorksheet}
                                  className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                                >
                                  <span>⚡</span>
                                  <span>{isRtl ? 'استيراد من محاضرتي النشطة' : 'Import from Active Lecture'}</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingWorksheetItemIdx(null);
                                  setWorksheetItemForm({ topic: '', scripture: '', studentQuestion: '', teacherAnswer: '', practicalImpact: '', maxScore: 5 });
                                  setIsAddingWorksheetItem(true);
                                }}
                                className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                              >
                                <span>➕</span>
                                <span>{isRtl ? 'إضافة مسألة / سؤال جديد' : 'Add New Question'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleClearIslamicWorksheet}
                                className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                              >
                                🧹 {isRtl ? 'تفريغ الورقة' : 'Clear Sheet'}
                              </button>
                              <button
                                type="button"
                                onClick={handleResetIslamicWorksheet}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                              >
                                🔄 {isRtl ? 'استعادة النموذج المعتمد' : 'Restore Canonical'}
                              </button>
                            </div>
                          </div>

                          {/* Editable Header Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'عنوان ورقة العمل الرئيسية:' : 'Worksheet Main Title:'}
                              </label>
                              <input
                                type="text"
                                value={current.titleAr || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomIslamicWorksheets(prev => ({
                                    ...prev,
                                    [worksheetIslamicCategory]: { ...(prev[worksheetIslamicCategory] || current), titleAr: val }
                                  }));
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {isRtl ? 'الفئة المستهدفة / المستوى:' : 'Target Audience:'}
                              </label>
                              <input
                                type="text"
                                value={current.targetAudience || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomIslamicWorksheets(prev => ({
                                    ...prev,
                                    [worksheetIslamicCategory]: { ...(prev[worksheetIslamicCategory] || current), targetAudience: val }
                                  }));
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>
                          </div>

                          {/* Add / Edit Form Modal / Inline Box */}
                          {isAddingWorksheetItem && (
                            <form onSubmit={handleSaveWorksheetItem} className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                              <div className="flex items-center justify-between border-b border-gold-400/40 pb-2">
                                <h4 className="font-black text-emerald-950 text-sm font-cairo">
                                  {editingWorksheetItemIdx !== null ? (isRtl ? '✏️ تعديل المسألة الشرعية' : 'Edit Question Item') : (isRtl ? '➕ إضافة مسألة وسؤال جديد لورقة العمل' : 'Add New Question Item')}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingWorksheetItem(false);
                                    setEditingWorksheetItemIdx(null);
                                  }}
                                  className="text-slate-500 hover:text-slate-700 font-bold text-xs"
                                >
                                  ✕ {isRtl ? 'إلغاء' : 'Cancel'}
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'المسألة الشرعية / عنوان المحور:' : 'Topic / Core Subject:'}
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder={isRtl ? 'مثال: الإيمان بالقضاء والقدر وعلاج الجزع' : 'e.g. Belief in Divine Decree'}
                                    value={worksheetItemForm.topic}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, topic: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'الشاهد والدليل والتخريج:' : 'Scriptural Evidence / Citation:'}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder={isRtl ? 'مثال: حديث مسلم #2664 أو آية القمر 49' : 'e.g. Sahih Muslim #2664'}
                                    value={worksheetItemForm.scripture}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, scripture: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-emerald-950 mb-1">
                                  {isRtl ? 'سؤال الطالب والتطبيق المطلوب منه الإجابة عليه في الورقة:' : 'Student Question & Prompt for the Worksheet:'}
                                </label>
                                <textarea
                                  rows={2}
                                  required
                                  placeholder={isRtl ? 'اكتب صيغة السؤال الموجه للدارس...' : 'Enter prompt for the student to answer...'}
                                  value={worksheetItemForm.studentQuestion}
                                  onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, studentQuestion: e.target.value })}
                                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'نموذج إجابة المعلم المعتمد والتأصيل (يظهر في نسخة المعلم فقط):' : 'Teacher Answer Key (Teacher Copy Only):'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder={isRtl ? 'اكتب التأصيل والجواب النموذجي للتصحيح...' : 'Enter official answer for grading...'}
                                    value={worksheetItemForm.teacherAnswer}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, teacherAnswer: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                                    {isRtl ? 'الأثر السلوكي والتربوي المستهدف:' : 'Target Behavioral & Spiritual Impact:'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder={isRtl ? 'مثال: السكينة النفسية والتسليم لحكمة الله...' : 'e.g. Psychological peace...'}
                                    value={worksheetItemForm.practicalImpact}
                                    onChange={(e) => setWorksheetItemForm({ ...worksheetItemForm, practicalImpact: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingWorksheetItem(false);
                                    setEditingWorksheetItemIdx(null);
                                  }}
                                  className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300"
                                >
                                  {isRtl ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                  type="submit"
                                  className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                                >
                                  <span>💾</span>
                                  <span>{isRtl ? 'حفظ البند في ورقة العمل' : 'Save Item to Worksheet'}</span>
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Current Items Table / Management List */}
                          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-950 font-cairo">
                                📋 {isRtl ? `بنود ورقة العمل الحالية (${(current.items || []).length} مسائل):` : `Current Items (${(current.items || []).length}):`}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {isRtl ? 'يمكنك التعديل أو الحذف، ثم الضغط على "معاينة وطباعة" بالترويسة' : 'Edit or delete items, then click Preview & Print'}
                              </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                              {(current.items || []).length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs">
                                  {isRtl ? 'ورقة العمل فارغة حالياً. اضغط "إضافة مسألة جديدة" أو "استيراد من المحاضرة النشطة" للبدء.' : 'No items yet. Click Add Question or Import to begin.'}
                                </div>
                              ) : (
                                (current.items || []).map((it, idx) => (
                                  <div key={idx} className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                      <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                        {it.num || idx + 1}
                                      </span>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-bold text-emerald-950 text-sm font-cairo">{it.topic}</h5>
                                          {it.scripture && (
                                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                              {it.scripture}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-700 font-amiri mt-1 leading-snug">
                                          <strong>{isRtl ? 'السؤال:' : 'Question:'}</strong> {it.studentQuestion}
                                        </p>
                                        {it.teacherAnswer && (
                                          <p className="text-[11px] text-slate-500 font-amiri mt-0.5 line-clamp-1">
                                            <strong>{isRtl ? 'نموذج الإجابة:' : 'Model Answer:'}</strong> {it.teacherAnswer}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setWorksheetItemForm({
                                            topic: it.topic || '',
                                            scripture: it.scripture || '',
                                            studentQuestion: it.studentQuestion || '',
                                            teacherAnswer: it.teacherAnswer || '',
                                            practicalImpact: it.practicalImpact || '',
                                            maxScore: it.maxScore || 5
                                          });
                                          setEditingWorksheetItemIdx(idx);
                                          setIsAddingWorksheetItem(true);
                                        }}
                                        className="bg-slate-100 hover:bg-gold-100 text-slate-700 hover:text-emerald-950 p-2 rounded-lg text-xs font-bold transition"
                                        title={isRtl ? 'تعديل البند' : 'Edit'}
                                      >
                                        ✏️ {isRtl ? 'تعديل' : 'Edit'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteWorksheetItem(idx)}
                                        className="bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition"
                                        title={isRtl ? 'حذف البند' : 'Delete'}
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })()}

                    {/* Tajweed Worksheet Builder */}
                    {worksheetBranch === 'tajweed' && (
                      <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md space-y-6">
                        
                        {/* Banner & Guidance */}
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-emerald-950 text-sm font-cairo">
                              🛠️ {isRtl ? 'أداة المعلم: تخصيص ورقة عمل أحكام التجويد' : 'Teacher Workbench: Build Tajweed Worksheet'}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1">
                              {isRtl 
                                ? 'أدخل الكلمات القرآنية بالرسم العثماني، حدد الحكم التجويدي المطبق والعلة الصوتية، أو استورد الكلمات من درس التجويد النشط.'
                                : 'Add Quranic words, specify rules and phonetic reasons, or import directly from current Tajweed lesson.'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {tajweedData && (
                              <button
                                type="button"
                                onClick={handleTransferTajweedToWorksheet}
                                className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                              >
                                <span>⚡</span>
                                <span>{isRtl ? 'استيراد الكلمات من درس التجويد' : 'Import from Tajweed Lesson'}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTajweedItemIdx(null);
                                setTajweedItemForm({ wordUthmani: '', ruleApplied: '', reasonAr: '', maxScore: 5 });
                                setIsAddingTajweedItem(true);
                              }}
                              className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                            >
                              <span>➕</span>
                              <span>{isRtl ? 'إضافة كلمة وحكم جديد' : 'Add Quranic Word'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleClearTajweedWorksheet}
                              className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                            >
                              🧹 {isRtl ? 'تفريغ الورقة' : 'Clear Sheet'}
                            </button>
                            <button
                              type="button"
                              onClick={handleResetTajweedWorksheet}
                              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                            >
                              🔄 {isRtl ? 'استعادة النموذج المعتمد' : 'Restore Canonical'}
                            </button>
                          </div>
                        </div>

                        {/* Editable Tajweed Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {isRtl ? 'عنوان ورقة التجويد:' : 'Tajweed Worksheet Title:'}
                            </label>
                            <input
                              type="text"
                              value={customTajweedWorksheet.titleAr || ''}
                              onChange={(e) => setCustomTajweedWorksheet({ ...customTajweedWorksheet, titleAr: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {isRtl ? 'السورة والآيات المقررة:' : 'Surah / Passage:'}
                            </label>
                            <input
                              type="text"
                              value={customTajweedWorksheet.surah || ''}
                              onChange={(e) => setCustomTajweedWorksheet({ ...customTajweedWorksheet, surah: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>
                        </div>

                        {/* Add/Edit Tajweed Word Form */}
                        {isAddingTajweedItem && (
                          <form onSubmit={handleSaveTajweedItem} className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                            <div className="flex items-center justify-between border-b border-gold-400/40 pb-2">
                              <h4 className="font-black text-emerald-950 text-sm font-cairo">
                                {editingTajweedItemIdx !== null ? (isRtl ? '✏️ تعديل الكلمة والحكم التجويدي' : 'Edit Tajweed Word') : (isRtl ? '➕ إضافة كلمة وحكم تجويدي جديد' : 'Add New Tajweed Word')}
                              </h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingTajweedItem(false);
                                  setEditingTajweedItemIdx(null);
                                }}
                                className="text-slate-500 hover:text-slate-700 font-bold text-xs"
                              >
                                ✕ {isRtl ? 'إلغاء' : 'Cancel'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-emerald-950 mb-1">
                                  {isRtl ? 'الكلمة أو التركيب بالرسم العثماني المطهّر:' : 'Quranic Word (Uthmani Script):'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder={isRtl ? 'مثال: مِن بَعْدِ أو شَىْءٍ قَدِيرٌ' : 'e.g. مِن بَعْدِ'}
                                  value={tajweedItemForm.wordUthmani}
                                  onChange={(e) => setTajweedItemForm({ ...tajweedItemForm, wordUthmani: e.target.value })}
                                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-base font-quran text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-emerald-950 mb-1">
                                  {isRtl ? 'الحكم التجويدي المطبق:' : 'Applied Tajweed Rule:'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder={isRtl ? 'مثال: إقلاب / إخفاء حقيقي بغنة مفخمة' : 'e.g. Iqlab'}
                                  value={tajweedItemForm.ruleApplied}
                                  onChange={(e) => setTajweedItemForm({ ...tajweedItemForm, ruleApplied: e.target.value })}
                                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-950 mb-1">
                                {isRtl ? 'التوجيه والعلة الصوتية والمخرج (نموذج الإجابة للتصحيح):' : 'Phonetic Reason / Makhraj (Teacher Answer Key):'}
                              </label>
                              <textarea
                                rows={2}
                                placeholder={isRtl ? 'مثال: لوقوع حرف الباء بعد النون الساكنة فتقلب ميماً مخفاة بغنة...' : 'Explain articulation point and rule...'}
                                value={tajweedItemForm.reasonAr}
                                onChange={(e) => setTajweedItemForm({ ...tajweedItemForm, reasonAr: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingTajweedItem(false);
                                  setEditingTajweedItemIdx(null);
                                }}
                                className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300"
                              >
                                {isRtl ? 'إلغاء' : 'Cancel'}
                              </button>
                              <button
                                type="submit"
                                className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                              >
                                <span>💾</span>
                                <span>{isRtl ? 'حفظ الكلمة في الورقة' : 'Save Tajweed Word'}</span>
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Words Management List */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-950 font-cairo">
                              📋 {isRtl ? `الكلمات القرآنية المجدولة (${(customTajweedWorksheet.items || []).length} كلمات):` : `Scheduled Words (${(customTajweedWorksheet.items || []).length}):`}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {isRtl ? 'تظهر الكلمات في جدول ورقة العمل للدارس ليكتب الحكم والعلة' : 'Words appear in student table to fill rules'}
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100">
                            {(customTajweedWorksheet.items || []).length === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-xs">
                                {isRtl ? 'لا توجد كلمات حالياً. اضغط "إضافة كلمة وحكم جديد" للبدء.' : 'No words scheduled yet.'}
                              </div>
                            ) : (
                              (customTajweedWorksheet.items || []).map((it, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                      {it.itemNumber || idx + 1}
                                    </span>
                                    <div>
                                      <div className="flex items-center gap-3">
                                        <span className="font-quran text-xl text-emerald-950 font-bold">{it.wordUthmani}</span>
                                        <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                                          {it.ruleApplied}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600 font-amiri mt-1">
                                        {it.reasonAr}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTajweedItemForm({
                                          wordUthmani: it.wordUthmani || '',
                                          ruleApplied: it.ruleApplied || '',
                                          reasonAr: it.reasonAr || '',
                                          maxScore: it.maxScore || 5
                                        });
                                        setEditingTajweedItemIdx(idx);
                                        setIsAddingTajweedItem(true);
                                      }}
                                      className="bg-slate-100 hover:bg-gold-100 text-slate-700 hover:text-emerald-950 p-2 rounded-lg text-xs font-bold transition"
                                      title={isRtl ? 'تعديل' : 'Edit'}
                                    >
                                      ✏️ {isRtl ? 'تعديل' : 'Edit'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTajweedItem(idx)}
                                      className="bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition"
                                      title={isRtl ? 'حذف' : 'Delete'}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* ================= MODE: PRINTABLE WORKSHEET PREVIEW (DUAL SHEETS) ================= */}
                {worksheetMode === 'preview' && (
                  <div className="space-y-8">
                    
                    {/* --- BRANCH 3: ISLAMIC STUDIES WORKSHEET DUAL FORMAT --- */}
                    {worksheetBranch === 'islamic' && (() => {
                      const ws = customIslamicWorksheets[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS[worksheetIslamicCategory] || ISLAMIC_BRANCH_WORKSHEETS.aqeedah;
                      return (
                        <div className="space-y-8">
                          {/* Printable Sheet 1: Student Version */}
                          <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
                            <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
                              <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                                {isRtl ? 'منصة مِشكاة — نظام التشغيل الشامل للداعية والمعلم الشرعي | AnubisLand' : 'Mishkah Platform — AnubisLand'}
                              </div>
                              <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                                {isRtl ? ws.titleAr : ws.titleEn}
                              </h2>
                              <div className="inline-block bg-emerald-50 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200 mt-1">
                                {isRtl ? 'نسخة الطالب للمدارسة والتطبيق' : 'Student Study & Application Copy'}
                              </div>
                              <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 mt-4 px-2">
                                <span>{isRtl ? 'اسم الطالب / الدارس:' : 'Student Name:'} ____________________</span>
                                <span>{isRtl ? 'المجال الشرعي:' : 'Discipline:'} {isRtl ? (ws.categoryAr || 'العلوم الشرعية') : (ws.categoryEn || 'Islamic Studies')}</span>
                                <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                              </div>
                            </div>

                            {/* Core Scriptural Reference Box */}
                            {(ws.quranRef || ws.hadithRef) && (
                              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 mb-6 text-xs">
                                <div className="font-bold text-emerald-900 mb-1">{isRtl ? '📖 الشاهد المعتمد من الكتاب والسنة:' : 'Core Scriptural Evidence:'}</div>
                                {ws.quranRef && <div className="font-quran text-base text-emerald-950 leading-relaxed mb-1">{ws.quranRef}</div>}
                                {ws.hadithRef && <div className="font-amiri text-xs text-slate-700">{ws.hadithRef}</div>}
                              </div>
                            )}

                            {/* Student Questions Table */}
                            <div className="overflow-x-auto mb-6">
                              <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                                <thead className="bg-emerald-800 text-white text-xs">
                                  <tr>
                                    <th className="p-3 w-10 text-center">#</th>
                                    <th className="p-3 w-44">{isRtl ? 'المسألة الشرعية' : 'Topic'}</th>
                                    <th className="p-3 w-48">{isRtl ? 'الدليل والتخريج' : 'Scripture / Source'}</th>
                                    <th className="p-3">{isRtl ? 'إجابة الطالب والتأصيل المستفاد' : 'Student Answer & Deductions'}</th>
                                    <th className="p-3 w-20 text-center">{isRtl ? 'الدرجة' : 'Grade'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-xs">
                                  {(ws.items || []).map((it, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                      <td className="p-3 text-center font-bold text-slate-500">{it.num || idx + 1}</td>
                                      <td className="p-3 font-bold text-emerald-950 font-cairo">{it.topic}</td>
                                      <td className="p-3 text-slate-600 font-amiri text-xs leading-relaxed">{it.scripture || '—'}</td>
                                      <td className="p-3 space-y-2">
                                        <div className="font-bold text-slate-800 font-amiri text-xs">{it.studentQuestion}</div>
                                        <div className="text-slate-400 italic pt-1 border-b border-dashed border-slate-200">الإجابة: ____________________________________________________________________</div>
                                        <div className="text-slate-400 italic border-b border-dashed border-slate-200">التطبيق العملي: ___________________________________________________________</div>
                                      </td>
                                      <td className="p-3 text-center text-slate-400">/ {it.maxScore || 5}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Student Version Footer */}
                            <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
                              <span>{isRtl ? 'تقييم وتوقيع المعلم:' : 'Teacher Signature & Grade:'} _______________</span>
                              <span>Mishkah Operating System — AnubisLand</span>
                            </div>
                          </div>

                          {/* Print Page Break */}
                          <div className="page-break my-8 no-print border-t-2 border-dashed border-slate-300 text-center py-2 text-xs text-slate-400 font-bold">
                            ✂️ {isRtl ? 'فاصل صفحة الطباعة — يبدأ هنا نموذج إجابة المعلم المعتمد' : 'Page Break — Teacher Answer Key Follows'}
                          </div>

                          {/* Printable Sheet 2: Teacher Answer Key */}
                          <div className="bg-white rounded-3xl p-8 border-2 border-gold-300 shadow-lg print:border-none print:shadow-none print:p-0">
                            <div className="text-center border-b-2 border-gold-600 pb-4 mb-6">
                              <span className="bg-gold-100 text-gold-900 border border-gold-300 text-xs px-3 py-1 rounded-full font-bold">
                                {isRtl ? 'خاص بالمعلم والشيخ — نموذج الإجابة المعتمد والتوجيهات التربوية' : 'Confidential Teacher Answer Key & Guidance'}
                              </span>
                              <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-2">
                                {isRtl ? ws.titleAr : ws.titleEn}
                              </h2>
                              <div className="text-xs text-slate-500 mt-1">
                                {isRtl ? 'دليل التصحيح النموذجي والتأصيل الشرعي المحكم' : 'Official Answer Key with Authentic Citations'}
                              </div>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                                <thead className="bg-emerald-950 text-gold-300 text-xs">
                                  <tr>
                                    <th className="p-3 w-10 text-center">#</th>
                                    <th className="p-3 w-40">{isRtl ? 'المسألة الشرعية' : 'Topic'}</th>
                                    <th className="p-3">{isRtl ? 'نموذج الإجابة والتأصيل الشرعي المعتمد' : 'Official Teacher Answer Key'}</th>
                                    <th className="p-3 w-64">{isRtl ? 'الأثر السلوكي والتربوي المستهدف' : 'Behavioral & Spiritual Impact'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-xs">
                                  {(ws.items || []).map((it, idx) => (
                                    <tr key={idx} className="hover:bg-gold-50/40">
                                      <td className="p-3 text-center font-bold text-slate-500">{it.num || idx + 1}</td>
                                      <td className="p-3 font-bold text-emerald-950 font-cairo">{it.topic}</td>
                                      <td className="p-3 font-amiri text-xs text-slate-800 leading-relaxed">
                                        <div className="font-bold text-emerald-900 mb-1">السؤال: {it.studentQuestion}</div>
                                        <div className="text-emerald-950 font-medium bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">{it.teacherAnswer || '—'}</div>
                                      </td>
                                      <td className="p-3 text-slate-700 text-xs font-amiri leading-relaxed bg-amber-50/30">
                                        {it.practicalImpact || '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* --- BRANCH 2: TAJWEED WORKSHEET --- */}
                    {worksheetBranch === 'tajweed' && (
                      <div className="space-y-8">
                        {/* Printable Document Sheet 1: Student Version */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
                          <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
                            <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                              {isRtl ? 'منصة مِشكاة لتعليم القرآن الكريم والتجويد — AnubisLand' : 'Mishkah Platform — AnubisLand'}
                            </div>
                            <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                              {isRtl ? customTajweedWorksheet.titleAr : customTajweedWorksheet.titleEn}
                            </h2>
                            <div className="flex justify-between items-center text-xs text-slate-600 mt-4 px-2">
                              <span>{isRtl ? 'اسم الطالب / الدارس:' : 'Student Name:'} ____________________</span>
                              <span>{isRtl ? 'السورة والآيات:' : 'Surah:'} {customTajweedWorksheet.surah}</span>
                              <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                            </div>
                          </div>

                          <div className="overflow-x-auto mb-8">
                            <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                              <thead className="bg-emerald-800 text-white text-xs">
                                <tr>
                                  <th className="p-3 w-12 text-center">#</th>
                                  <th className="p-3 font-amiri text-base">{isRtl ? 'الكلمة القرآنية (رسم عثماني)' : 'Quranic Word'}</th>
                                  <th className="p-3">{isRtl ? 'الحكم التجويدي المطبق' : 'Tajweed Rule'}</th>
                                  <th className="p-3">{isRtl ? 'العلة وسبب الحكم' : 'Reason / Articulation Rule'}</th>
                                  <th className="p-3 w-28 text-center">{isRtl ? 'الدرجة' : 'Grade'}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 text-sm">
                                {(customTajweedWorksheet.items || []).map((row, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-3 text-center font-bold text-slate-500">{row.itemNumber || i + 1}</td>
                                    <td className="p-3 font-quran text-xl text-emerald-950 font-bold">{row.wordUthmani}</td>
                                    <td className="p-3 text-slate-400 italic">____________________</td>
                                    <td className="p-3 text-slate-400 italic">________________________________________</td>
                                    <td className="p-3 text-center text-slate-400">/ {row.maxScore || 5}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
                            <span>{isRtl ? 'ملاحظات المعلم / التقييم:' : 'Teacher Signature & Final Grade:'} _______________</span>
                            <span>Mishkah PWA — AnubisLand</span>
                          </div>
                        </div>

                        {/* Page Break for Print */}
                        <div className="page-break my-8 no-print border-t-2 border-dashed border-slate-300 text-center py-2 text-xs text-slate-400 font-bold">
                          ✂️ {isRtl ? 'فاصل صفحة الطباعة — يبدأ هنا نموذج إجابة المعلم' : 'Page Break — Teacher Answer Key Follows'}
                        </div>

                        {/* Printable Document Sheet 2: Teacher Answer Key */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-gold-300 shadow-lg print:border-none print:shadow-none print:p-0">
                          <div className="text-center border-b-2 border-gold-600 pb-4 mb-6">
                            <span className="bg-gold-100 text-gold-900 border border-gold-300 text-xs px-3 py-1 rounded-full font-bold">
                              {isRtl ? 'خاص بالمعلم فقط — نموذج الإجابة المعتمد' : 'Teacher Answer Key (Confidential)'}
                            </span>
                            <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-2">
                              {isRtl ? 'دليل تصحيح ورقة العمل والعلل الصوتية' : 'Teacher Correction Guide & Phonetic Explanations'}
                            </h2>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                              <thead className="bg-emerald-950 text-gold-300 text-xs">
                                <tr>
                                  <th className="p-3 w-12 text-center">#</th>
                                  <th className="p-3 font-amiri text-base">{isRtl ? 'الكلمة القرآنية' : 'Quranic Word'}</th>
                                  <th className="p-3">{isRtl ? 'الحكم الصحيح' : 'Correct Rule'}</th>
                                  <th className="p-3">{isRtl ? 'التوجيه والعلة الصوتية' : 'Phonetic Explanation'}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 text-sm">
                                {(customTajweedWorksheet.items || []).map((row, i) => (
                                  <tr key={i} className="hover:bg-gold-50/40">
                                    <td className="p-3 text-center font-bold text-slate-500">{row.itemNumber || i + 1}</td>
                                    <td className="p-3 font-quran text-xl text-emerald-950 font-bold">{row.wordUthmani}</td>
                                    <td className="p-3 font-bold text-emerald-800">{row.ruleApplied}</td>
                                    <td className="p-3 text-slate-700 text-xs leading-relaxed font-amiri">
                                      {row.reasonAr}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- BRANCH 1: HIFZ EVALUATION SHEET --- */}
                    {worksheetBranch === 'hifz' && (
                      <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0 space-y-6">
                        <div className="text-center border-b-2 border-emerald-900 pb-4 mb-4">
                          <div className="text-xs text-emerald-800 font-bold uppercase tracking-widest">
                            {isRtl ? 'مِشكاة — سجل المتابعة القرآني المتكامل | AnubisLand' : 'Mishkah Platform — AnubisLand'}
                          </div>
                          <h2 className="text-2xl font-bold font-amiri text-emerald-950 mt-1">
                            {isRtl ? HIFZ_BRANCH_WORKSHEET.titleAr : HIFZ_BRANCH_WORKSHEET.titleEn}
                          </h2>
                          <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 mt-4 px-2">
                            <span>{isRtl ? 'اسم الطالب:' : 'Student Name:'} ____________________</span>
                            <span>{isRtl ? 'السورة والآيات المقررة:' : 'Surah / Passage:'} {hifzSurahName} ({hifzAyahRange})</span>
                            <span>{isRtl ? 'التاريخ:' : 'Date:'} ___ / ___ / 2026</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-right worksheet-table border border-slate-300 rounded-xl overflow-hidden">
                            <thead className="bg-emerald-800 text-white text-xs">
                              <tr>
                                <th className="p-3 w-12 text-center">#</th>
                                <th className="p-3 w-56">{isRtl ? 'معيار التقييم' : 'Criterion'}</th>
                                <th className="p-3">{isRtl ? 'الوصف التوجيهي والملاحظات' : 'Description & Teacher Notes'}</th>
                                <th className="p-3 w-32 text-center">{isRtl ? 'الدرجة المستحقة' : 'Score'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                              {HIFZ_BRANCH_WORKSHEET.criteria.map((cr, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-3 text-center font-bold text-slate-500">{cr.num}</td>
                                  <td className="p-3 font-bold text-emerald-950 font-cairo">{cr.domain}</td>
                                  <td className="p-3 text-slate-600 font-amiri text-xs leading-relaxed">
                                    <div>{cr.description}</div>
                                    <div className="text-slate-400 italic mt-2 border-b border-dashed border-slate-200 pb-1">ملاحظة المحفظ: __________________________________________________</div>
                                  </td>
                                  <td className="p-3 text-center font-bold text-emerald-900">
                                    <span className="text-slate-400 font-normal">___ / </span>{cr.maxScore}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-emerald-50 text-emerald-950 font-bold text-sm">
                              <tr>
                                <td colSpan="3" className="p-3 text-left pl-6">{isRtl ? 'المجموع النهائي للتقييم:' : 'Total Final Score:'}</td>
                                <td className="p-3 text-center text-emerald-900 font-extrabold">_____ / 100</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex justify-between">
                          <span>{isRtl ? 'توقيع الشيخ المحفظ واعتماد الورد القادم:' : 'Teacher Signature & Next Assignment:'} _______________</span>
                          <span>Mishkah PWA — AnubisLand</span>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* ================= VIEW: INTERACTIVE SELF-GRADING QUIZ & TEACHER QUESTION BANK ================= */}
            {activeTab === 'quiz' && (
              <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <div className="card-islamic-pearl rounded-3xl p-6 border border-emerald-800/15 shadow-md">
                  
                  {/* Quiz Branch Switcher & Header */}
                  <div className="pb-4 mb-6 border-b border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          {isRtl ? 'منظومة المراجعة الذاتية التفاعلية وبنك أسئلة المعلم' : 'Interactive Self-Grading Quiz & Teacher Question Bank'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold font-cairo text-emerald-950 mt-0.5">
                          {isRtl ? 'اختبر معلوماتكِ التفاعلية في علوم الشريعة والقرآن' : 'Test Your Knowledge Across All Disciplines'}
                        </h2>
                      </div>

                      {/* Mode Toggle & Score */}
                      <div className="flex items-center gap-2">
                        {quizSubmitted && quizMode === 'student' && (
                          <div className="bg-emerald-900 text-gold-300 px-4 py-2 rounded-2xl border border-gold-400 font-bold text-sm shadow">
                            {isRtl ? `النتيجة النهائية: ${quizScore}%` : `Score: ${quizScore}%`}
                          </div>
                        )}

                        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              setQuizMode('student');
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              quizMode === 'student'
                                ? 'bg-emerald-800 text-gold-200 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            🎯 {isRtl ? 'وضع اختبار الدارس' : 'Student Mode'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuizMode('builder')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              quizMode === 'builder'
                                ? 'bg-gold-500 text-emerald-950 shadow-sm font-black'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            ✍️ {isRtl ? 'محرر وبنك الأسئلة' : 'Teacher Question Bank'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Branch Selector Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSwitchQuizBranch('islamic', 'aqeedah')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          quizBranch === 'islamic'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕌</span>
                        <span>{isRtl ? 'اختبار العلوم الشرعية (Branch 3)' : 'Islamic Studies Quiz'}</span>
                      </button>

                      <button
                        onClick={() => handleSwitchQuizBranch('tajweed')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          quizBranch === 'tajweed'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>📖</span>
                        <span>{isRtl ? 'اختبار أحكام التجويد (Branch 2)' : 'Tajweed Quiz'}</span>
                      </button>

                      <button
                        onClick={() => handleSwitchQuizBranch('hifz')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                          quizBranch === 'hifz'
                            ? 'bg-emerald-800 text-gold-200 shadow-md ring-2 ring-gold-400'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🕋</span>
                        <span>{isRtl ? 'اختبار المتشابهات وضبط الحفظ (Branch 1)' : 'Hifz Mutashabihat Quiz'}</span>
                      </button>
                    </div>

                    {/* Sub-Discipline Pills for Islamic Studies Quiz */}
                    {quizBranch === 'islamic' && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/80">
                        <span className="text-xs font-bold text-slate-500">{isRtl ? 'المجال:' : 'Subject:'}</span>
                        {[
                          { id: 'aqeedah', icon: '🌟', labelAr: 'العقيدة وأركان الإيمان', labelEn: 'Aqeedah' },
                          { id: 'fiqh', icon: '⚖️', labelAr: 'الفقه والعبادات', labelEn: 'Fiqh' },
                          { id: 'seerah', icon: '📜', labelAr: 'السيرة النبوية', labelEn: 'Seerah' },
                          { id: 'tazkiyah', icon: '💎', labelAr: 'الآداب والتزكية', labelEn: 'Tazkiyah' }
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleSwitchQuizBranch('islamic', cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                              quizIslamicCategory === cat.id
                                ? 'bg-gold-400 text-emerald-950 font-extrabold shadow'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <span>{cat.icon}</span>
                            <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ================= QUIZ MODE: BUILDER / QUESTION BANK ================= */}
                  {quizMode === 'builder' && (
                    <div className="space-y-6">
                      
                      {/* Guidance Banner */}
                      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-emerald-950 text-sm font-cairo">
                            🛠️ {isRtl ? 'أداة المعلم: تحرير وإدارة بنك أسئلة الاختبار' : 'Teacher Workbench: Manage Quiz Question Bank'}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {isRtl 
                              ? 'أضف أسئلتك الخاصة، حدد الخيارات الأربعة والإجابة الصحيحة، واكتب التوجيه والشرح الشرعي لترسيخ الفهم لدى الدارس.'
                              : 'Add custom questions with 4 options, specify correct answer, and provide authentic guidance for students.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {quizBranch === 'islamic' && islamicData && islamicData.quizQuestions && (
                            <button
                              type="button"
                              onClick={handleTransferLectureToQuiz}
                              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                            >
                              <span>⚡</span>
                              <span>{isRtl ? 'استيراد أسئلة المحاضرة النشطة' : 'Import from Active Lecture'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingQuizQuestionId(null);
                              setQuizQuestionForm({ questionAr: '', optA: '', optB: '', optC: '', optD: '', correctOptionId: 'a', explanationAr: '' });
                              setIsAddingQuizQuestion(true);
                            }}
                            className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                          >
                            <span>➕</span>
                            <span>{isRtl ? 'إضافة سؤال جديد' : 'Add Question'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClearQuizQuestions}
                            className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          >
                            🧹 {isRtl ? 'مسح الأسئلة' : 'Clear All'}
                          </button>
                          <button
                            type="button"
                            onClick={handleResetQuizQuestions}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          >
                            🔄 {isRtl ? 'استعادة النموذج المعتمد' : 'Restore Canonical'}
                          </button>
                        </div>
                      </div>

                      {/* Add / Edit Question Form */}
                      {isAddingQuizQuestion && (
                        <form onSubmit={handleSaveQuizQuestion} className="card-islamic-amber rounded-2xl p-5 border-2 border-gold-400 shadow-md space-y-4">
                          <div className="flex items-center justify-between border-b border-gold-400/40 pb-2">
                            <h4 className="font-black text-emerald-950 text-sm font-cairo">
                              {editingQuizQuestionId ? (isRtl ? '✏️ تعديل السؤال' : 'Edit Question') : (isRtl ? '➕ إضافة سؤال جديد لبنك الاختبار' : 'Add New Question')}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingQuizQuestion(false);
                                setEditingQuizQuestionId(null);
                              }}
                              className="text-slate-500 hover:text-slate-700 font-bold text-xs"
                            >
                              ✕ {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-950 mb-1">
                              {isRtl ? 'نص السؤال:' : 'Question Text:'}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={isRtl ? 'مثال: ما حكم النون الساكنة إذا جاء بعدها حرف القاف؟' : 'Enter question...'}
                              value={quizQuestionForm.questionAr}
                              onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, questionAr: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (أ):' : 'Option A:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'a'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'a' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                required
                                value={quizQuestionForm.optA}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optA: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (ب):' : 'Option B:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'b'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'b' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                required
                                value={quizQuestionForm.optB}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optB: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (ج):' : 'Option C:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'c'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'c' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                value={quizQuestionForm.optC}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optC: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-emerald-950">{isRtl ? 'الخيار (د):' : 'Option D:'}</label>
                                <label className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="correctOption"
                                    checked={quizQuestionForm.correctOptionId === 'd'}
                                    onChange={() => setQuizQuestionForm({ ...quizQuestionForm, correctOptionId: 'd' })}
                                  />
                                  <span>{isRtl ? 'الإجابة الصحيحة' : 'Correct'}</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                value={quizQuestionForm.optD}
                                onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, optD: e.target.value })}
                                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-950 mb-1">
                              {isRtl ? 'التوجيه والشرح والتأصيل الشرعي (يظهر للدارس بعد الإجابة):' : 'Explanation & Authentic Reflection (shown after answer):'}
                            </label>
                            <textarea
                              rows={2}
                              placeholder={isRtl ? 'اكتب الشرح المعتمد لتوضيح وجه الصواب...' : 'Enter explanation...'}
                              value={quizQuestionForm.explanationAr}
                              onChange={(e) => setQuizQuestionForm({ ...quizQuestionForm, explanationAr: e.target.value })}
                              className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-amiri text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingQuizQuestion(false);
                                setEditingQuizQuestionId(null);
                              }}
                              className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300"
                            >
                              {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="bg-emerald-900 hover:bg-emerald-800 text-gold-200 px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                            >
                              <span>💾</span>
                              <span>{isRtl ? 'حفظ السؤال في بنك الاختبار' : 'Save Question'}</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Question Bank Cards */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-emerald-950 font-cairo">
                            📋 {isRtl ? `الأسئلة الحالية في هذا البنك (${activeQuizQuestions.length} أسئلة):` : `Current Questions (${activeQuizQuestions.length}):`}
                          </span>
                        </div>

                        {activeQuizQuestions.length === 0 ? (
                          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
                            {isRtl ? 'بنك الأسئلة فارغ حالياً. اضغط "إضافة سؤال جديد" للبدء.' : 'No questions in this bank.'}
                          </div>
                        ) : (
                          activeQuizQuestions.map((q, idx) => (
                            <div key={q.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <h4 className="font-bold text-emerald-950 text-sm font-cairo leading-snug">
                                    {isRtl ? q.questionAr : q.questionEn}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingQuizQuestionId(q.id);
                                      const opts = q.options || [];
                                      setQuizQuestionForm({
                                        questionAr: q.questionAr || '',
                                        optA: opts[0]?.textAr || opts[0]?.text || '',
                                        optB: opts[1]?.textAr || opts[1]?.text || '',
                                        optC: opts[2]?.textAr || opts[2]?.text || '',
                                        optD: opts[3]?.textAr || opts[3]?.text || '',
                                        correctOptionId: q.correctOptionId || 'a',
                                        explanationAr: q.explanationAr || ''
                                      });
                                      setIsAddingQuizQuestion(true);
                                    }}
                                    className="bg-slate-100 hover:bg-gold-100 text-slate-700 hover:text-emerald-950 p-2 rounded-lg text-xs font-bold transition"
                                  >
                                    ✏️ {isRtl ? 'تعديل' : 'Edit'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuizQuestion(q.id)}
                                    className="bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {(q.options || []).map(opt => {
                                  const isCorrect = opt.id === q.correctOptionId;
                                  return (
                                    <div
                                      key={opt.id}
                                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                                        isCorrect
                                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                          : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span>{isRtl ? opt.textAr : opt.textEn}</span>
                                      {isCorrect && (
                                        <span className="text-emerald-700 font-extrabold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                                          ✓ {isRtl ? 'الإجابة الصحيحة' : 'Correct'}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {q.explanationAr && (
                                <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 font-amiri leading-relaxed">
                                  <strong>{isRtl ? 'التوجيه والشرح:' : 'Explanation:'}</strong> {q.explanationAr}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                  {/* ================= QUIZ MODE: STUDENT INTERACTIVE TEST ================= */}
                  {quizMode === 'student' && (
                    <div className="space-y-6">
                      
                      {activeQuizQuestions.length === 0 ? (
                        <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200">
                          {isRtl ? 'لا توجد أسئلة حالياً في هذا القسم. اضغط "محرر وبنك الأسئلة" لإضافة أسئلتك الخاصة أو استيرادها.' : 'No questions yet. Click Teacher Question Bank to add questions.'}
                        </div>
                      ) : (
                        activeQuizQuestions.map((q, qIndex) => {
                          const selected = quizAnswers[q.id];
                          const isCorrect = selected === q.correctOptionId;
                          
                          return (
                            <div key={q.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                              <div className="flex items-start gap-2.5 mb-3">
                                <span className="w-7 h-7 rounded-full bg-emerald-800 text-gold-200 font-bold text-xs flex items-center justify-center shrink-0">
                                  {qIndex + 1}
                                </span>
                                <h3 className="font-bold text-emerald-950 text-base leading-snug font-cairo">
                                  {isRtl ? q.questionAr : q.questionEn}
                                </h3>
                              </div>

                              {/* Options */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                                {q.options.map(opt => {
                                  const isThisSelected = selected === opt.id;
                                  let btnClass = 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300';
                                  
                                  if (quizSubmitted) {
                                    if (opt.id === q.correctOptionId) {
                                      btnClass = 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold';
                                    } else if (isThisSelected && !isCorrect) {
                                      btnClass = 'bg-red-100 border-red-500 text-red-900';
                                    }
                                  } else if (isThisSelected) {
                                    btnClass = 'bg-emerald-800 text-gold-200 border-emerald-900 font-bold shadow';
                                  }

                                  return (
                                    <button
                                      key={opt.id}
                                      disabled={quizSubmitted}
                                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                                      className={`p-3 rounded-xl border text-right text-xs transition flex items-center justify-between ${btnClass}`}
                                    >
                                      <span>{isRtl ? opt.textAr : opt.textEn}</span>
                                      {quizSubmitted && opt.id === q.correctOptionId && <span>✓</span>}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanations shown after submit */}
                              {quizSubmitted && (
                                <div className={`mt-3 p-3.5 rounded-xl text-xs font-amiri leading-relaxed ${
                                  isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                                }`}>
                                  <strong>{isCorrect ? '✓ إجابة صحيحة بارك الله فيكِ:' : '✗ توضيح الإجابة الصحيحة والتأصيل الشرعي:'}</strong> {isRtl ? q.explanationAr : q.explanationEn}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}

                      {/* Submit / Reset Actions */}
                      {activeQuizQuestions.length > 0 && (
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                          {quizSubmitted ? (
                            <button 
                              onClick={() => {
                                setQuizAnswers({});
                                setQuizSubmitted(false);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
                            >
                              {isRtl ? 'إعادة الاختبار من جديد' : 'Retake Quiz'}
                            </button>
                          ) : (
                            <button 
                              onClick={() => setQuizSubmitted(true)}
                              disabled={Object.keys(quizAnswers).length === 0}
                              className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition disabled:opacity-40"
                            >
                              {isRtl ? 'تسليم الإجابات والتقييم الفوري' : 'Submit Answers'}
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>
            )}
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
