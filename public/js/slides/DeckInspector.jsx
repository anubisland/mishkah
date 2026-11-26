    // The selected slide's settings, in the teacher's words: what kind of slide,
    // which colour, how big the text, which points, and her own notes.
    function DeckInspector({ slide, onChange }) {
      const pill = (active) => 'px-3 py-1.5 rounded-xl text-sm font-bold border transition ' +
        (active ? 'bg-emerald-900 text-gold-200 border-emerald-900' : 'bg-white text-emerald-950 border-emerald-900/20 hover:border-gold-500');
      const items = slide.items || [];
      const usesItems = ['points', 'cards', 'compare'].includes(slide.layout);
      const usesQuote = ['ayah', 'hadith'].includes(slide.layout);

      return (
        <div className="space-y-5" dir="rtl">
          <section>
            <h4 className="font-black text-emerald-950 mb-2">نوع الشريحة</h4>
            <div className="flex flex-wrap gap-1.5">
              {SLIDE_LAYOUTS.map((l) => (
                <button key={l.id} type="button" className={pill(slide.layout === l.id)} onClick={() => onChange('layout', l.id)}>{l.label}</button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="font-black text-emerald-950 mb-2">اللون</h4>
            <div className="flex flex-wrap gap-2">
              {SLIDE_TONES.map((t) => (
                <button key={t.id} type="button" onClick={() => onChange('tone', t.id)} title={t.label}
                  className={'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-sm font-bold ' + (slide.tone === t.id ? 'border-emerald-900 ring-2 ring-gold-400' : 'border-slate-300')}>
                  <span className="w-5 h-5 rounded-full border border-slate-400" style={{ background: t.swatch }} />
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="font-black text-emerald-950 mb-2">حجم الخط</h4>
            <div className="flex gap-1.5">
              {SLIDE_SIZES.map((z) => (
                <button key={z.id} type="button" className={pill(slide.size === z.id)} onClick={() => onChange('size', z.id)}>{z.label}</button>
              ))}
            </div>
          </section>

          {usesItems && (
            <section>
              <h4 className="font-black text-emerald-950 mb-2">{slide.layout === 'compare' ? 'الطرفان' : 'النقاط'}</h4>
              <p className="text-xs text-slate-500 mb-2">تعديل النص يكون بالضغط عليه في الشريحة مباشرة.</p>
              <div className="space-y-1.5">
                {items.map((it, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 rounded-lg px-2 py-1">
                    <span className="flex-1 truncate">{it.title || it.text || '(فارغة)'}</span>
                    <button type="button" className="text-rose-700 font-bold px-1" title="حذف"
                      onClick={() => onChange('items', items.filter((_, k) => k !== i))}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-2 w-full py-1.5 rounded-xl border-2 border-dashed border-emerald-900/30 font-bold text-emerald-900"
                onClick={() => onChange('items', items.concat([{ title: '', text: 'نقطة جديدة' }]))}>+ أضيفي نقطة</button>
            </section>
          )}

          {usesQuote && !slide.quote && (
            <button type="button" className="w-full py-1.5 rounded-xl border-2 border-dashed border-gold-500 font-bold"
              onClick={() => onChange('quote', { text: slide.layout === 'ayah' ? '﴿ ﴾' : '« »', source: '' })}>
              + أضيفي {slide.layout === 'ayah' ? 'الآية' : 'الحديث'}
            </button>
          )}

          <section>
            <h4 className="font-black text-emerald-950 mb-1">ملاحظاتكِ لهذه الشريحة</h4>
            <p className="text-xs text-slate-500 mb-2">تظهر لكِ وحدكِ وقت العرض، ولا تراها الطالبات.</p>
            <textarea key={slide.id + '|' + slide.notes} defaultValue={slide.notes} rows={6}
              onBlur={(e) => { if (e.target.value !== slide.notes) onChange('notes', e.target.value); }}
              className="w-full border-2 border-emerald-900/20 rounded-xl p-2 text-sm leading-relaxed" />
          </section>
        </div>
      );
    }
