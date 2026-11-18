const fs = require('fs');
const htmlPath = 'public/index.html';

const mulkData = JSON.parse(fs.readFileSync('scripts/mulk_pages.json', 'utf8'));
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Remove the entire duplicate block (Set 2) from p2_start to p2_end
const p2_start = html.indexOf('{/* ================= VIEW: HIFZ & RECITATION WORKBENCH (BRANCH 1) ================= */}', 150000);
const p2_end = html.indexOf('{/* ================= VIEW: MODULE B (ISLAMIC STUDIES) ================= */}');

if (p2_start !== -1 && p2_end !== -1) {
  html = html.slice(0, p2_start) + html.slice(p2_end);
  console.log('Successfully deleted the duplicate Hifz & Tajweed block (Set 2)!');
} else {
  console.error('Could not find duplicate block boundaries:', p2_start, p2_end);
}

// 2. Update PRELOADED_HIFZ_PASSAGES to have complete pages (1-12, 13-26, 27-30)
const preloadedMarker = 'const PRELOADED_HIFZ_PASSAGES = [';
const preloadedEndMarker = 'const [hifzPassageId, setHifzPassageId] = useState';

const pIdx1 = html.indexOf(preloadedMarker);
const pIdx2 = html.indexOf(preloadedEndMarker);

if (pIdx1 !== -1 && pIdx2 !== -1) {
  const newPreloadedPassages = `const PRELOADED_HIFZ_PASSAGES = [
      {
        id: 'mulk_page_562',
        surahAr: 'سورة الملك',
        surahEn: 'Surah Al-Mulk',
        pageNumber: 562,
        ayahRange: '1–12 (الوجه الأول كاملاً)',
        ayahs: ${JSON.stringify(mulkData.p562, null, 10)},
        mutashabihat: [
          {
            ayah: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ ... وَهُوَ الْعَزِيزُ الْغَفُورُ (الملك: 2)',
            similar: '... إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ إِنَّ اللَّهَ عَزِيزٌ غَفُورٌ (فاطر: 28)',
            difference: 'في الملك معرّفة باللام (الْعَزِيزُ الْغَفُورُ)، وفي فاطر منكرة (عَزِيزٌ غَفُورٌ).'
          },
          {
            ayah: 'وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ (الملك: 5)',
            similar: '... وَأَعْتَدْنَا لِمَن كَذَّبَ بِالسَّاعَةِ سَعِيرًا (الفرقان: 11)',
            difference: 'في الملك أضيفت كلمة (عذاب) قبل (السعير) لبيان العقوبة المعدة للشياطين.'
          }
        ]
      },
      {
        id: 'mulk_page_563',
        surahAr: 'سورة الملك',
        surahEn: 'Surah Al-Mulk',
        pageNumber: 563,
        ayahRange: '13–26 (الوجه الثاني كاملاً)',
        ayahs: ${JSON.stringify(mulkData.p563, null, 10)},
        mutashabihat: [
          {
            ayah: 'وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ (الملك: 13)',
            similar: 'وَإِن تَجْهَرْ بِالْقَوْلِ فَإِنَّهُ يَعْلَمُ السِّرَّ وَأَخْفَى (طه: 7)',
            difference: 'في الملك تقديم الإسرار على الجهر، وفي طه ذكر الجهر أولاً.'
          }
        ]
      },
      {
        id: 'mulk_page_564',
        surahAr: 'سورة الملك',
        surahEn: 'Surah Al-Mulk',
        pageNumber: 564,
        ayahRange: '27–30 (الوجه الثالث ختام السورة)',
        ayahs: ${JSON.stringify(mulkData.p564, null, 10)},
        mutashabihat: []
      }
    ];

    `;

  html = html.slice(0, pIdx1) + newPreloadedPassages + html.slice(pIdx2);
  console.log('Successfully updated PRELOADED_HIFZ_PASSAGES with all 3 pages of Al-Mulk!');
}

// 3. Add quranFontSize state if not present
if (!html.includes('quranFontSize')) {
  const stateMarker = `const [isEndingsMasked, setIsEndingsMasked] = useState(false);`;
  const fontState = `const [quranFontSize, setQuranFontSize] = useState('medium'); // 'small', 'medium', 'large'
      const [isEndingsMasked, setIsEndingsMasked] = useState(false);`;
  html = html.replace(stateMarker, fontState);
  console.log('Added quranFontSize state');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved index.html part 1');
