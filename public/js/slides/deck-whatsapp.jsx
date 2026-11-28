    // The message the teacher sends to the class's WhatsApp group after the
    // lecture, as its record: built only from the slides (title, headings, and
    // the ayahs and hadiths exactly as quoted, with their sources), plus the
    // recording link. Nothing is added that the lecture did not say.

    function deckWhatsAppParts(deck) {
      const headings = [];
      const evidence = [];
      (deck.slides || []).forEach((s) => {
        // A section's heading is the title of its points, or the label above
        // its ayah or hadith (not the generic «المحور ١»).
        const raw = s.layout === 'points' || s.layout === 'section' ? s.title
          : s.layout === 'ayah' || s.layout === 'hadith' ? s.eyebrow : '';
        const heading = /^المحور\s/.test(raw || '') ? '' : (raw || '').replace(/\s*\(تابع\)$/, '');
        if (heading && !headings.includes(heading)) headings.push(heading);
        if ((s.layout === 'ayah' || s.layout === 'hadith') && s.quote && s.quote.text) {
          evidence.push({ text: s.quote.text, source: s.quote.source || '', lead: s.layout === 'hadith' ? (s.title || '') : '' });
        }
      });
      return { headings, evidence };
    }

    function buildDeckWhatsApp(deck, recordingUrl) {
      const { headings, evidence } = deckWhatsAppParts(deck);
      const lines = ['السلام عليكم ورحمة الله وبركاته', ''];
      if (deck.title) lines.push('📌 *' + deck.title + '*', '');
      if (headings.length) {
        lines.push('✨ *محاور المحاضرة:*');
        headings.forEach((h, i) => lines.push((i + 1) + '. ' + h));
        lines.push('');
      }
      if (evidence.length) {
        lines.push('📖 *من الأدلة الواردة في المحاضرة:*');
        evidence.forEach((e) => lines.push('▫️ ' + (e.lead ? e.lead + ': ' : '') + e.text + (e.source ? ' [' + e.source.replace(/[.،\s]+$/, '') + ']' : '')));
        lines.push('');
      }
      if (recordingUrl && recordingUrl.trim()) lines.push('🎥 *تسجيل المحاضرة:* ' + recordingUrl.trim(), '');
      lines.push('📎 ملف العرض مرفق (PDF).', '', 'جزاكم الله خيراً');
      return lines.join('\n');
    }

    function DeckWhatsAppPanel({ deck, onExportPdf, exporting, onClose }) {
      const [recordingUrl, setRecordingUrl] = useState('');
      const [text, setText] = useState(() => buildDeckWhatsApp(deck, ''));
      const [edited, setEdited] = useState(false);
      const [copied, setCopied] = useState(false);
      const [error, setError] = useState('');
      // The link fills its line, unless the teacher has already edited the text.
      useEffect(() => { if (!edited) setText(buildDeckWhatsApp(deck, recordingUrl)); }, [recordingUrl]);

      const copy = async () => {
        setError('');
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch (e) {
          console.warn('Mishkah: could not copy the WhatsApp message', e);
          setError('تعذّر النسخ تلقائياً. يمكن تحديد النص في المربع ونسخه يدوياً.');
        }
      };

      return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-2 sm:p-4" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 space-y-3 border-2 border-gold-400">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-emerald-950 flex-1">📱 رسالة الواتساب لمجموعة الحصة</h3>
              <button type="button" onClick={onClose} className="px-3 py-1 rounded-xl border border-slate-300 font-bold">✕ إغلاق</button>
            </div>
            <p className="text-sm text-slate-600">من الشرائح نفسها: العنوان والمحاور، والآيات والأحاديث بنصها ومصدرها كما في المحاضرة. ويمكن تعديلها قبل النسخ.</p>
            <label className="block">
              <span className="font-bold text-emerald-900">🎥 رابط تسجيل المحاضرة (اختياري)</span>
              <input value={recordingUrl} onChange={(e) => setRecordingUrl(e.target.value)} dir="ltr" placeholder="https://drive.google.com/…"
                className="mt-1 w-full border-2 border-emerald-900/20 rounded-xl px-3 py-2 text-sm" />
            </label>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setEdited(true); setCopied(false); }} rows={14}
              className="w-full border-2 border-emerald-900/20 rounded-xl p-3 text-sm leading-relaxed" />
            {error && <p className="text-rose-700 font-bold text-sm">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copy} className="px-4 py-2 rounded-xl bg-emerald-900 text-gold-200 font-black">{copied ? '✓ نُسخت الرسالة' : '📋 نسخ الرسالة'}</button>
              <button type="button" onClick={onExportPdf} disabled={!!exporting} className="px-4 py-2 rounded-xl border-2 border-emerald-900/20 font-black disabled:opacity-40">
                {exporting ? 'جارٍ تجهيز الملف…' : '⬇ ملف العرض PDF'}
              </button>
              {edited && <button type="button" onClick={() => { setEdited(false); setText(buildDeckWhatsApp(deck, recordingUrl)); }} className="px-3 py-2 rounded-xl text-sm font-bold text-slate-600">↻ إعادة الرسالة كما كانت</button>}
            </div>
          </div>
        </div>
      );
    }
