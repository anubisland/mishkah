    // Where a deck comes from: the quick splitter (no AI) or the Claude bridge
    // (copy a ready request into Claude, paste the answer back).
    function DeckSourcePanel({ lectureText, onDeck, onClose }) {
      const [text, setText] = useState(lectureText || '');
      const [reading, setReading] = useState(false);
      const [fromPdf, setFromPdf] = useState(false);
      // A Word or PDF lecture fills the box with its text, to check before the deck is made.
      const readFile = async (file) => {
        setError(null);
        setReading(true);
        try {
          const t = await readLectureFile(file);
          if (!t.trim()) throw new Error('لم يُعثر على نص في الملف (قد يكون صوراً ممسوحة).');
          setText(t);
          setFromPdf(/\.pdf$/i.test(file.name || ''));
        } catch (e) {
          console.warn('Mishkah: could not read the lecture file', e);
          setError(e && /[؀-ۿ]/.test(e.message || '') ? e.message : 'تعذّر قراءة الملف.');
        } finally {
          setReading(false);
        }
      };
      const [reply, setReply] = useState('');
      const [copied, setCopied] = useState(false);
      const [error, setError] = useState(null);

      const copyPrompt = async () => {
        setError(null);
        try {
          await navigator.clipboard.writeText(buildClaudeDeckPrompt(text));
          setCopied(true);
        } catch (e) {
          setError('تعذّر النسخ تلقائياً. يمكن تحديد النص في المربع ونسخه يدوياً.');
        }
      };

      const useReply = () => {
        setError(null);
        try {
          const result = parseClaudeDeckReply(reply);
          onDeck(Object.assign({}, result.deck, { sourceText: text }), result.warnings);
        } catch (e) {
          setError(e.message);
        }
      };

      return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-5 border-2 border-gold-400">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-emerald-950">إنشاء العرض من المحاضرة</h3>
              <button type="button" onClick={onClose} className="px-3 py-1 rounded-xl border border-slate-300 font-bold">✕ إغلاق</button>
            </div>

            {(
              <div className="flex flex-wrap items-center gap-2 card-islamic-sky rounded-2xl p-3 border border-sky-200">
                <span className="font-black text-emerald-950">📄 ملف المحاضرة (وورد أو PDF):</span>
                <label className="px-4 py-1.5 rounded-xl bg-emerald-900 text-gold-200 font-black cursor-pointer">
                  {reading ? 'جارٍ قراءة الملف…' : 'اختيار الملف'}
                  <input type="file" accept=".docx,.pdf,.txt,.md" className="hidden" disabled={reading}
                    onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) readFile(f); e.target.value = ''; }} />
                </label>
                <span className="text-xs text-slate-600">يظهر نصه في المربع أدناه للمراجعة قبل إنشاء العرض.</span>
                {fromPdf && <span className="block w-full text-xs font-bold text-amber-900">ملفات PDF تُخرج النص العربي أحياناً بحروف مفصولة؛ فإن وُجد ملف الوورد الأصلي فهو أدق. وتُعتمد هنا العناوين المرقّمة أو المعلَّمة فقط.</span>}
              </div>
            )}
            <label className="block">
              <span className="font-bold text-emerald-900">نص المحاضرة</span>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7}
                className="mt-1 w-full border-2 border-emerald-900/20 rounded-xl p-3 text-sm leading-relaxed" placeholder="نص المحاضرة هنا" />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-islamic-sage rounded-2xl p-4 space-y-2 border border-emerald-300">
                <h4 className="font-black text-emerald-950">⚡ الطريقة السريعة (بدون ذكاء اصطناعي)</h4>
                <p className="text-sm text-slate-700">تقسّم المحاضرة حسب عناوينها وآياتها وأحاديثها. تحتاج محاضرة مرتبة بعناوين واضحة (أولاً، ثانياً، …).</p>
                <button type="button" disabled={!text.trim()} onClick={() => onDeck(Object.assign({}, buildQuickDeck(text, fromPdf), { sourceText: text }), [])}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-black disabled:opacity-40">إنشاء العرض الآن</button>
              </div>

              <div className="card-islamic-amber rounded-2xl p-4 space-y-2 border border-gold-300">
                <h4 className="font-black text-emerald-950">🤖 بمساعدة Claude (نتيجة أذكى)</h4>
                <ol className="text-sm text-slate-700 list-decimal pr-5 space-y-1">
                  <li>الضغط على الزر لنسخ الطلب.</li>
                  <li>فتح claude.ai ولصق الطلب وإرساله.</li>
                  <li>نسخ رد Claude كاملاً ولصقه في المربع بالأسفل.</li>
                </ol>
                <button type="button" disabled={!text.trim()} onClick={copyPrompt}
                  className="w-full py-2.5 rounded-xl bg-gold-500 text-emerald-950 font-black disabled:opacity-40">
                  {copied ? '✓ نُسخ الطلب، والخطوة التالية لصقه في Claude' : '١. نسخ الطلب لـ Claude'}
                </button>
              </div>
            </div>

            <label className="block">
              <span className="font-bold text-emerald-900">٢. لصق رد Claude هنا</span>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4}
                className="mt-1 w-full border-2 border-gold-400/50 rounded-xl p-3 text-sm font-mono" dir="ltr" />
            </label>
            <button type="button" disabled={!reply.trim()} onClick={useReply}
              className="w-full py-2.5 rounded-xl bg-emerald-950 text-gold-200 font-black disabled:opacity-40">٣. تحويل الرد إلى شرائح</button>

            {error && <p className="text-rose-700 font-bold text-sm bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}
          </div>
        </div>
      );
    }
