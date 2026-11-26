    // Draws one slide on the fixed 1600x900 canvas (see css/slides.css).
    // With onEdit, every text on the slide can be edited in place.

    // Any ﴿…﴾ inside ordinary slide text is a verse: it is always drawn in the
    // Uthmani font (project covenant), whatever kind of text surrounds it.
    function withQuranRuns(text) {
      if (!text || text.indexOf('﴿') < 0) return text;
      return text.split(/(﴿[^﴾]*﴾)/).map((part, i) => (
        /^﴿[^﴾]*﴾$/.test(part) ? <span key={i} className="mk-quran-run font-quran">{part}</span> : part
      ));
    }

    // Text that becomes editable in place when onCommit is given. The element
    // is keyed on its value so an edit, undo or slide switch always redraws it
    // from the deck instead of leaving the browser's edited text behind.
    function SlideText({ as, className, value, placeholder, onCommit }) {
      const Tag = as || 'div';
      if (!onCommit) {
        if (!value) return null;
        return <Tag className={className}>{withQuranRuns(value)}</Tag>;
      }
      return (
        <Tag
          key={value || ''}
          className={className + ' mk-editable'}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onBlur={(e) => {
            const next = e.currentTarget.innerText.trim();
            if (next !== (value || '')) onCommit(next);
          }}
        >
          {withQuranRuns(value)}
        </Tag>
      );
    }

    function SlideFrame() {
      return (
        <div className="mk-frame">
          <span className="mk-corner tl" /><span className="mk-corner tr" />
          <span className="mk-corner bl" /><span className="mk-corner br" />
        </div>
      );
    }

    // Shrinks the text of a slide whose content is longer than the canvas.
    function useFitScale(baseScale, deps) {
      const bodyRef = useRef(null);
      const [scale, setScale] = useState(baseScale);
      useEffect(() => { setScale(baseScale); }, [baseScale, ...deps]);
      useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;
        if (el.scrollHeight > el.clientHeight + 2 && scale > 0.6) {
          setScale(Math.max(0.6, scale * Math.max(0.85, el.clientHeight / el.scrollHeight)));
        }
      });
      return [bodyRef, scale];
    }

    function SlideView({ slide, deck, index, total, onEdit }) {
      const sizeScale = (SLIDE_SIZES.find((z) => z.id === slide.size) || SLIDE_SIZES[1]).scale;
      const [bodyRef, scale] = useFitScale(sizeScale, [slide]);
      const edit = (field) => (onEdit ? (value) => onEdit(field, value) : null);
      const editItem = (i, key) => (onEdit ? (value) => {
        const items = slide.items.map((it, k) => (k === i ? Object.assign({}, it, { [key]: value }) : it));
        onEdit('items', items);
      } : null);
      const editQuote = (key) => (onEdit ? (value) => onEdit('quote', Object.assign({ text: '', source: '' }, slide.quote, { [key]: value })) : null);

      const props = { slide, edit, editItem, editQuote };
      const Layout = SLIDE_LAYOUT_VIEWS[slide.layout] || PointsLayout;
      return (
        <div className={'mk-slide mk-tone-' + slide.tone} style={{ '--mk-scale': scale }}>
          <SlideFrame />
          <div className="mk-body" ref={bodyRef}>
            <Layout {...props} />
          </div>
          {deck && (
            <div className="mk-footer">
              <span>{deck.title}</span>
              {total > 0 && <span>{(index + 1) + ' / ' + total}</span>}
            </div>
          )}
        </div>
      );
    }

    function SlideHeading({ slide, edit }) {
      return (
        <>
          <SlideText className="mk-eyebrow" value={slide.eyebrow} placeholder="عنوان صغير (اختياري)" onCommit={edit('eyebrow')} />
          <SlideText as="h2" className="mk-title" value={slide.title} placeholder="عنوان الشريحة" onCommit={edit('title')} />
        </>
      );
    }

    function CoverLayout({ slide, edit }) {
      return (
        <div className="flex-1 flex flex-col mk-center">
          <SlideText className="mk-eyebrow" value={slide.eyebrow} placeholder="اسم السلسلة" onCommit={edit('eyebrow')} />
          <SlideText as="h1" className="mk-title" value={slide.title} placeholder="عنوان المحاضرة" onCommit={edit('title')} />
          <div className="mk-rule" />
          <SlideText className="mk-text" value={slide.body} placeholder="سطر تعريفي" onCommit={edit('body')} />
        </div>
      );
    }

    function SectionLayout({ slide, edit }) {
      return (
        <div className="flex-1 flex flex-col mk-center">
          <SlideText className="mk-eyebrow" value={slide.eyebrow} placeholder="المحور" onCommit={edit('eyebrow')} />
          <SlideText as="h2" className="mk-title" value={slide.title} placeholder="عنوان المحور" onCommit={edit('title')} />
          <div className="mk-rule" />
          <SlideText className="mk-text" value={slide.body} placeholder="سطر تمهيدي (اختياري)" onCommit={edit('body')} />
        </div>
      );
    }

    function PointsLayout({ slide, edit, editItem }) {
      return (
        <>
          <SlideHeading slide={slide} edit={edit} />
          <SlideText className="mk-text" value={slide.body} placeholder="فقرة تمهيدية (اختياري)" onCommit={edit('body')} />
          <div className="mk-points">
            {slide.items.map((it, i) => (
              <div className="mk-point" key={i}>
                <span className="mk-num">{(i + 1).toLocaleString('ar-EG')}</span>
                <div>
                  <SlideText className="mk-strong" value={it.title} placeholder="" onCommit={editItem(i, 'title')} />
                  <SlideText className="mk-text" value={it.text} placeholder="النص" onCommit={editItem(i, 'text')} />
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    function CardsLayout({ slide, edit, editItem }) {
      const n = slide.items.length;
      const cols = n === 3 ? 3 : (n === 1 ? 1 : 2);
      return (
        <>
          <SlideHeading slide={slide} edit={edit} />
          <SlideText className="mk-text" value={slide.body} placeholder="فقرة تمهيدية (اختياري)" onCommit={edit('body')} />
          <div className="mk-cards" style={{ gridTemplateColumns: 'repeat(' + cols + ', 1fr)' }}>
            {slide.items.map((it, i) => (
              <div className="mk-card" key={i}>
                <SlideText className="mk-strong" value={it.title} placeholder="عنوان البطاقة" onCommit={editItem(i, 'title')} />
                <SlideText className="mk-text" value={it.text} placeholder="" onCommit={editItem(i, 'text')} />
              </div>
            ))}
          </div>
          <SlideText className="mk-text" value={slide.footer} placeholder="" onCommit={edit('footer')} />
        </>
      );
    }

    function ScriptureLayout({ slide, edit, editQuote, isQuran }) {
      const q = slide.quote || { text: '', source: '' };
      return (
        <>
          <SlideHeading slide={slide} edit={edit} />
          <div className="flex-1 flex flex-col justify-center">
            <div className="mk-scripture">
              {isQuran ? (
                // Quran text keeps the Uthmani font, always.
                <SlideText className="mk-quran font-quran" value={q.text} placeholder="نص الآية" onCommit={editQuote('text')} />
              ) : (
                <SlideText className="mk-hadith" value={q.text} placeholder="نص الحديث أو الأثر" onCommit={editQuote('text')} />
              )}
              <SlideText className="mk-source" value={q.source} placeholder="المصدر" onCommit={editQuote('source')} />
            </div>
            <SlideText className="mk-text" value={slide.body} placeholder="تعليق (اختياري)" onCommit={edit('body')} />
          </div>
        </>
      );
    }

    function CompareLayout({ slide, edit, editItem }) {
      const sides = [slide.items[0] || { title: '', text: '' }, slide.items[1] || { title: '', text: '' }];
      return (
        <>
          <SlideHeading slide={slide} edit={edit} />
          <div className="mk-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {sides.map((it, i) => (
              <div className="mk-card" key={i}>
                <SlideText className="mk-strong" value={it.title} placeholder="العنوان" onCommit={editItem(i, 'title')} />
                <SlideText className="mk-text whitespace-pre-line" value={it.text} placeholder="سطر في كل نقطة" onCommit={editItem(i, 'text')} />
              </div>
            ))}
          </div>
          <SlideText className="mk-text" value={slide.footer} placeholder="" onCommit={edit('footer')} />
        </>
      );
    }

    function ClosingLayout({ slide, edit, editQuote }) {
      return (
        <div className="flex-1 flex flex-col mk-center">
          <SlideText as="h2" className="mk-title" value={slide.title} placeholder="الخاتمة" onCommit={edit('title')} />
          <div className="mk-rule" />
          <SlideText className="mk-text" value={slide.body} placeholder="خلاصة أو دعاء" onCommit={edit('body')} />
          {slide.quote && slide.quote.text && (
            <SlideText className="mk-hadith" value={slide.quote.text} placeholder="" onCommit={editQuote('text')} />
          )}
        </div>
      );
    }

    const SLIDE_LAYOUT_VIEWS = {
      cover: CoverLayout,
      section: SectionLayout,
      points: PointsLayout,
      cards: CardsLayout,
      ayah: (p) => <ScriptureLayout {...p} isQuran={true} />,
      hadith: (p) => <ScriptureLayout {...p} isQuran={false} />,
      compare: CompareLayout,
      closing: ClosingLayout
    };

    // A slide scaled to any width (thumbnails, studio, student screen).
    function ScaledSlide({ width, children }) {
      const scale = width / 1600;
      return (
        <div style={{ width: width + 'px', height: (900 * scale) + 'px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ transform: 'scale(' + scale + ')', transformOrigin: 'top right', position: 'absolute', top: 0, right: 0 }}>
            {children}
          </div>
        </div>
      );
    }
