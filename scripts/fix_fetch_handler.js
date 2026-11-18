const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const startMarker = '// Helper function to load custom user entered text\n      function handleApplyCustomAyahs() {';
const endMarker = 'showToast(isRtl ? \'تم تطبيق آيات المعلم الخاصة في لوحة التسميع بنجاح 🕋\' : \'Custom Ayahs loaded successfully 🕋\');\n      }';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replaceBlock = `// Fetch verified Uthmani Ayahs from cache or API directly
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
      }`;

  html = html.substring(0, startIndex) + replaceBlock + html.substring(endIndex + endMarker.length);
  fs.writeFileSync('public/index.html', html, 'utf8');
  console.log('Successfully replaced handleApplyCustomAyahs with handleFetchQuranPassage!');
} else {
  console.error('Could not find start or end marker!', { startIndex, endIndex });
}
