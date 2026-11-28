    // The reciter's voice for a tajweed example: the whole ayah it comes from,
    // recited by Sheikh Mahmoud Khalil Al-Husary (murattal), the recitation
    // used for teaching. Examples cite their place as «السورة رقم», e.g.
    // «البقرة 25». Played on the teacher's computer: Zoom carries it to the
    // students with "Share sound".
    const EXAMPLE_RECITER = 'ar.husary';

    function normaliseSurahName(name) {
      return String(name || '')
        .replace(/[ً-ٰٟـ]/g, '')
        .replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
        .replace(/^سوره\s*/, '').replace(/\s+/g, '');
    }

    // «البقرة 25» → { surahId: 2, ayah: 25 }, or null when it cannot be read.
    function parseExampleRef(ref) {
      // «البقرة 25 (تنبيه)», «البقرة 50 / الفلق 2», «قريش 3-4»: the first place.
      const first = String(ref || '').split('(')[0].split('/')[0].trim();
      const m = first.match(/^(.+?)\s*[:：]?\s*(\d+)(?:\s*[-–]\s*\d+)?$/);
      if (!m) return null;
      const target = normaliseSurahName(m[1]);
      const lists = [typeof ALL_QURAN_SURAHS !== 'undefined' ? ALL_QURAN_SURAHS : [], typeof MUSHAF_SURAHS_PAGE_MAP !== 'undefined' ? MUSHAF_SURAHS_PAGE_MAP : []];
      for (const list of lists) {
        const s = list.find((x) => normaliseSurahName(x.name) === target);
        if (s) return { surahId: s.id, ayah: parseInt(m[2], 10) };
      }
      return null;
    }

    // The ayah's number counted from the start of the mushaf, which the audio
    // library uses to name its files.
    function globalAyahNumber(surahId, ayah) {
      const list = typeof ALL_QURAN_SURAHS !== 'undefined' ? ALL_QURAN_SURAHS : [];
      let n = 0;
      for (const s of list) {
        if (s.id === surahId) return ayah >= 1 && ayah <= s.ayahs ? n + ayah : null;
        n += s.ayahs;
      }
      return null;
    }

    function exampleAudioUrl(ref) {
      const p = parseExampleRef(ref);
      const n = p && globalAyahNumber(p.surahId, p.ayah);
      return n ? 'https://cdn.islamic.network/quran/audio/128/' + EXAMPLE_RECITER + '/' + n + '.mp3' : null;
    }

    // A play/stop button; says so plainly when the ayah cannot be played.
    function ExampleAudioButton({ refText }) {
      const url = exampleAudioUrl(refText);
      const audioRef = useRef(null);
      const [state, setState] = useState('idle'); // idle | playing | error
      useEffect(() => () => { if (audioRef.current) audioRef.current.pause(); }, []);
      useEffect(() => { if (audioRef.current) audioRef.current.pause(); setState('idle'); }, [refText]);
      if (!url) return null;
      const toggle = () => {
        if (state === 'playing') { audioRef.current.pause(); setState('idle'); return; }
        if (!audioRef.current || audioRef.current.src !== url) audioRef.current = new Audio(url);
        const a = audioRef.current;
        a.onended = () => setState('idle');
        a.currentTime = 0;
        a.play().then(() => setState('playing')).catch((e) => { console.warn('Mishkah: the recitation could not play', e); setState('error'); });
      };
      return (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={toggle} className="px-3 py-1.5 rounded-xl font-black text-sm bg-emerald-900 text-gold-200">
            {state === 'playing' ? '⏸️ إيقاف التلاوة' : '🔊 تلاوة الآية (الحصري)'}
          </button>
          {state === 'error' && <span className="text-xs font-bold text-rose-700">تعذّر تشغيل التلاوة: يلزم الاتصال بالإنترنت.</span>}
        </div>
      );
    }
