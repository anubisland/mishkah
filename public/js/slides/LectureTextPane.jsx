    // The whole lecture as the teacher wrote it, shown to the teacher (never to
    // the students) under the current slide. The paragraph the current slide
    // came from is highlighted and brought into view when the slide changes;
    // the teacher can still scroll freely, and tapping a paragraph shows its
    // slide.

    // Arabic text reduced for matching: no diacritics, tatweel, punctuation
    // or brackets, and one form of alef, yaa and taa marbuta.
    function normalizeForMatch(text) {
      return String(text || '')
        .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
        .replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
        .replace(/[^ء-ي0-9a-zA-Z]+/g, ' ')
        .trim();
    }

    // What on a slide can be found in the lecture text, most telling first.
    function slideMatchKeys(slide) {
      const parts = [slide.quote && slide.quote.text, slide.title, slide.body]
        .concat((slide.items || []).map((it) => it.text || it.title));
      return parts.map(normalizeForMatch).filter((k) => k.length >= 8).map((k) => k.slice(0, 40));
    }

    // For each slide, the index of the paragraph it came from, searching in
    // order (a slide is looked for at or after the previous slide's place).
    function matchSlidesToParagraphs(slides, paragraphs) {
      const norm = paragraphs.map(normalizeForMatch);
      let from = 0;
      return slides.map((slide) => {
        const keys = slideMatchKeys(slide);
        for (const key of keys) {
          const at = norm.findIndex((p, i) => i >= from && p.includes(key));
          if (at >= 0) { from = at; return at; }
        }
        return keys.length ? null : from;
      }).map((at, i, all) => {
        if (at != null) return at;
        for (let k = i - 1; k >= 0; k--) if (all[k] != null) return all[k];
        return 0;
      });
    }

    // topGap: space kept above the highlighted paragraph (room for a fixed
    // box over the text, like the class panel's slide box).
    function LectureTextPane({ deck, index, onPick, topGap }) {
      const paragraphs = useMemo(() => String(deck.sourceText || '').split(/\n+/).map((p) => p.trim()).filter(Boolean), [deck.sourceText]);
      const matches = useMemo(() => matchSlidesToParagraphs(deck.slides, paragraphs), [deck.slides, paragraphs]);
      const current = matches[index];
      const refs = useRef([]);
      useEffect(() => {
        const el = refs.current[current];
        if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, [current]);

      if (!paragraphs.length) {
        return (
          <section className="bg-white rounded-2xl p-4 border border-emerald-900/10 text-sm text-slate-600">
            📜 نص المحاضرة الكامل يظهر هنا للعروض التي تُنشأ من ملف المحاضرة أو نصها في الاستوديو.
          </section>
        );
      }
      return (
        <section className="bg-white rounded-2xl p-4 border-2 border-emerald-900/10" dir="rtl">
          <h4 className="font-black text-emerald-900 text-sm mb-2">📜 نص المحاضرة كاملاً <span className="font-bold text-slate-500">(للمعلم فقط؛ المظلَّل موضع الشريحة الحالية، والضغط على فقرة يعرض شريحتها)</span></h4>
          <div className="space-y-2">
            {paragraphs.map((p, i) => (
              <p key={i} ref={(el) => { refs.current[i] = el; }} dir="auto" style={{ scrollMarginTop: topGap || '1rem' }}
                onClick={() => { const s = matches.indexOf(i); if (s >= 0) onPick(s); }}
                className={'leading-loose text-lg font-amiri rounded-lg px-2 py-1 ' + (i === current ? 'bg-gold-100 border-r-4 border-gold-500 text-emerald-950' : 'text-slate-800') + (matches.includes(i) ? ' cursor-pointer hover:bg-gold-50' : '')}>
                {withQuranRuns(p)}
              </p>
            ))}
          </div>
        </section>
      );
    }
