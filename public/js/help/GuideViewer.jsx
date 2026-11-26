    // "دليل الاستخدام": the user guide inside the program. It reads the same
    // file published with the site (guide/dalil.md), so the guide in the app
    // and the guide on GitHub are one text. Topics are its "##" sections.
    //
    // The markdown is turned into React elements by a small renderer for the
    // subset the guide uses (headings, paragraphs, lists, quotes, tables,
    // bold): no HTML is ever injected.

    function renderInline(text, keyBase) {
      return String(text).split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        /^\*\*[^*]+\*\*$/.test(part) ? <strong key={keyBase + '-' + i}>{part.slice(2, -2)}</strong> : part
      );
    }

    // Splits the guide into topics: [{ title, lines }].
    function parseGuideTopics(markdown) {
      const topics = [];
      let current = null;
      markdown.split(/\r?\n/).forEach((line) => {
        const h2 = line.match(/^##\s+(.+)/);
        if (h2) {
          current = { title: h2[1].trim(), lines: [] };
          topics.push(current);
        } else if (current) {
          current.lines.push(line);
        }
      });
      return topics;
    }

    function renderGuideBlocks(lines) {
      const blocks = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (!line.trim() || /^---\s*$/.test(line)) { i++; continue; }
        const key = 'b' + i;
        const h3 = line.match(/^###\s+(.+)/);
        if (h3) {
          blocks.push(<h4 key={key} className="font-black text-emerald-900 text-lg mt-5 mb-2">{renderInline(h3[1], key)}</h4>);
          i++;
        } else if (/^\s*\|/.test(line)) {
          const rows = [];
          while (i < lines.length && /^\s*\|/.test(lines[i])) {
            if (!/^\s*\|\s*-/.test(lines[i])) rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
            i++;
          }
          const [head, ...body] = rows;
          blocks.push(
            <div key={key} className="overflow-x-auto my-3">
              <table className="w-full text-sm border border-emerald-900/15 rounded-xl overflow-hidden">
                <thead className="bg-emerald-900 text-gold-100"><tr>{head.map((c, k) => <th key={k} className="text-right p-2 font-bold">{renderInline(c, key + 'h' + k)}</th>)}</tr></thead>
                <tbody>{body.map((r, ri) => <tr key={ri} className={ri % 2 ? 'bg-white' : 'bg-emerald-50/40'}>{r.map((c, k) => <td key={k} className="p-2 align-top leading-relaxed">{renderInline(c, key + ri + k)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        } else if (/^>\s?/.test(line)) {
          const quote = [];
          while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, '')); i++; }
          blocks.push(<div key={key} className="my-3 rounded-xl bg-amber-50 border border-amber-300 p-3 leading-relaxed">{quote.map((q, k) => <p key={k}>{renderInline(q, key + k)}</p>)}</div>);
        } else if (/^\s*(?:[-*]|\d+\.)\s/.test(line)) {
          const items = [];
          while (i < lines.length && (/^\s*(?:[-*]|\d+\.)\s/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
            const m = lines[i].match(/^(\s*)(?:([-*])|(\d+)\.)\s+(.*)/);
            if (m) items.push({ depth: Math.floor(m[1].length / 2), number: m[3] ? m[3] + '.' : null, text: m[4] });
            else items[items.length - 1].text += ' ' + lines[i].trim();
            i++;
          }
          blocks.push(
            <div key={key} className="my-2 space-y-1">
              {items.map((it, k) => (
                <div key={k} className="flex gap-2 leading-relaxed" style={{ marginRight: (it.depth * 22) + 'px' }}>
                  <span className="text-gold-600 font-black shrink-0">{it.number || '◂'}</span>
                  <span>{renderInline(it.text, key + k)}</span>
                </div>
              ))}
            </div>
          );
        } else {
          blocks.push(<p key={key} className="my-2 leading-loose">{renderInline(line, key)}</p>);
          i++;
        }
      }
      return blocks;
    }

    function GuideViewer({ onClose, initialTopic }) {
      const [topics, setTopics] = useState(null);
      const [error, setError] = useState(null);
      const [active, setActive] = useState(0);
      const [query, setQuery] = useState('');

      useEffect(() => {
        fetch('guide/dalil.md')
          .then((res) => {
            if (!res.ok) throw new Error('guide ' + res.status);
            return res.text();
          })
          .then((text) => {
            const parsed = parseGuideTopics(text);
            setTopics(parsed);
            const start = initialTopic ? parsed.findIndex((t) => t.title.includes(initialTopic)) : -1;
            if (start >= 0) setActive(start);
          })
          .catch((e) => {
            console.warn('Mishkah: the guide could not be loaded', e);
            setError('تعذّر فتح الدليل. يلزم الاتصال بالإنترنت في أول مرة، ثم يعمل الدليل دونه.');
          });
      }, []);

      const q = query.trim();
      const visible = topics ? topics.map((t, i) => ({ t, i })).filter(({ t }) => !q || t.title.includes(q) || t.lines.join('\n').includes(q)) : [];
      const topic = topics && topics[active];

      // While searching, show the first matching topic.
      useEffect(() => {
        if (visible.length && !visible.some((v) => v.i === active)) setActive(visible[0].i);
      }, [q, topics]);

      return (
        <div className="fixed inset-0 z-[75] bg-black/50 flex items-center justify-center p-3" dir="rtl">
          <div className="bg-[#f8f6ef] rounded-3xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col border-2 border-gold-400 overflow-hidden">
            <div className="shrink-0 emerald-pattern px-4 py-3 flex items-center gap-3">
              <h3 className="text-gold-200 font-black text-xl ml-auto">❓ دليل الاستخدام</h3>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث في الدليل"
                className="w-48 sm:w-64 rounded-xl px-3 py-1.5 text-emerald-950 font-bold" />
              <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl border-2 border-gold-400/60 text-gold-200 font-bold">✕ إغلاق</button>
            </div>
            {error && <p className="m-4 text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}
            {!topics && !error && <p className="m-6 text-center text-slate-600">جارٍ فتح الدليل…</p>}
            {topics && (
              <div className="flex-1 min-h-0 flex flex-col md:flex-row">
                <nav className="md:w-60 shrink-0 border-b md:border-b-0 md:border-l border-emerald-900/10 bg-white/60 overflow-x-auto md:overflow-y-auto flex md:block gap-1 p-2">
                  {visible.length === 0 && <p className="text-sm text-slate-500 p-2">لا نتائج.</p>}
                  {visible.map(({ t, i }) => (
                    <button key={i} type="button" onClick={() => setActive(i)}
                      className={'shrink-0 md:w-full text-right px-3 py-2 rounded-xl text-sm font-bold ' + (i === active ? 'bg-emerald-900 text-gold-200' : 'text-emerald-950 hover:bg-emerald-50')}>
                      {t.title}
                    </button>
                  ))}
                </nav>
                <article className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 text-slate-800 text-[17px]">
                  {topic && (
                    <>
                      <h2 className="text-2xl font-black text-emerald-950 mb-3">{topic.title}</h2>
                      {renderGuideBlocks(topic.lines)}
                      <div className="flex justify-between mt-8 pt-4 border-t border-emerald-900/10">
                        <button type="button" disabled={active === 0} onClick={() => setActive(active - 1)} className="px-4 py-2 rounded-xl border-2 border-emerald-900/20 font-bold disabled:opacity-30">→ السابق</button>
                        <button type="button" disabled={active >= topics.length - 1} onClick={() => setActive(active + 1)} className="px-4 py-2 rounded-xl bg-emerald-900 text-gold-200 font-bold disabled:opacity-30">التالي ←</button>
                      </div>
                    </>
                  )}
                </article>
              </div>
            )}
          </div>
        </div>
      );
    }
