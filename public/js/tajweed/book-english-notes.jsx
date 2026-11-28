    // English teaching notes for a class taught in English from the Arabic
    // book «التجويد المصور»: there is no English edition, so the teacher
    // reads, under the book page, the draft English explanation of the topics
    // in that chapter (from the earlier lessons' translation, which awaits
    // the teacher's review — SUWAYD_ENGLISH_REVIEWED), and can show a topic,
    // or one part of it, to the students beside the page.
    //
    // Chapter (its printed first page) -> the lesson ids covering its topics.
    const TAJWEED_BOOK_ENGLISH_TOPICS = {
      35: ['mabadi_tajweed'],
      93: ['makharij_jawf', 'makharij_halq', 'makharij_lisan', 'makharij_shafatayn_khayshoom'],
      125: ['sifat_mutadaddah', 'sifat_ghayr_mutadaddah', 'tafkheem_tarqeeq'],
      229: ['mislan_mutaqariban', 'lamat_sawakin'],
      255: ['izhar_halqi', 'idgham_ahkam', 'iqlab_hukm', 'ikhfaa_haqiqi', 'meem_sakinah_mushaddadatayn'],
      311: ['madd_asli_fari', 'madd_lazim_fawatih'],
      421: ['waqf_ibtida_sakt'],
      491: ['maqtoo_mawsool_taa'],
      497: ['hamzat_wasl_qat']
    };

    function tajweedTopicTitle(topic) {
      return String(topic.titleAr || '').replace(/^\d+\.\s*/, '');
    }

    // The English topic by its lesson id (also used by the student screen).
    function englishTopicById(id) {
      const lesson = SUWAYD_TAJWEED_CURRICULUM.find((l) => l.id === id);
      const en = lesson ? localiseTajweedLesson(lesson, 'en') : null;
      return en && en.isEnglish ? en : null;
    }

    function englishTopicsForChapter(chapter) {
      const ids = chapter ? TAJWEED_BOOK_ENGLISH_TOPICS[chapter.page] || [] : [];
      return ids.map(englishTopicById).filter(Boolean);
    }

    // shown / onShow: which topic ({ topic, item }; item -1 = the whole topic)
    // the students see beside the book page; null shows the page alone.
    function TajweedEnglishNotes({ chapter, shown, onShow }) {
      const topics = useMemo(() => englishTopicsForChapter(chapter), [chapter && chapter.page]);
      const isShown = (topic, item) => !!shown && shown.topic === topic && shown.item === item;
      const showBtn = (topic, item) => onShow && (
        <button type="button" dir="rtl" onClick={(e) => { e.preventDefault(); onShow(isShown(topic, item) ? null : { topic, item }); }}
          className={'shrink-0 px-2 py-0.5 rounded-lg text-xs font-black border-2 ' + (isShown(topic, item) ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-sky-800 border-sky-300')}>
          {isShown(topic, item) ? '✓ معروض للطلاب' : '📺 اعرضه للطلاب'}
        </button>
      );
      return (
        <section className="bg-white rounded-2xl p-4 border-2 border-sky-300 space-y-2" dir="ltr">
          <h4 className="font-black text-emerald-900">🇬🇧 English notes{chapter && chapter.titleEn ? ' — ' + chapter.titleEn : ''}</h4>
          {!SUWAYD_ENGLISH_REVIEWED && (
            <p className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg p-2" dir="rtl">ترجمة أولية لشرح موضوعات هذا الباب، تنتظر مراجعة المعلم، وليست من الكتاب نفسه. وزر «اعرضه للطلاب» يعرض الشرح بجانب صفحة الكتاب على شاشة الطالب.</p>
          )}
          {!topics.length && <p className="text-sm text-slate-600">No English notes for this chapter yet.</p>}
          {topics.map((t) => (
            <details key={t.id} className="rounded-xl border border-slate-200 px-3 py-2">
              <summary className="font-black text-emerald-950 cursor-pointer">
                <span className="inline-flex w-[calc(100%-1.5rem)] items-center gap-2"><span className="flex-1">{tajweedTopicTitle(t)}</span>{showBtn(t.id, -1)}</span>
              </summary>
              <div className="mt-2 space-y-2 text-slate-800 leading-relaxed">
                {t.definitionAr && <p><b>Definition: </b>{t.definitionAr}</p>}
                {t.mechanismAr && <p><b>How it works: </b>{t.mechanismAr}</p>}
                {(t.ruleBreakdown || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <p className="flex-1">
                      {item.letter && <span className="font-quran text-lg mr-1" dir="rtl">{item.letter} </span>}
                      <b>{item.titleAr}: </b>{item.explanationAr}
                    </p>
                    {showBtn(t.id, i)}
                  </div>
                ))}
                {t.commonMistakesAr && <p className="whitespace-pre-line"><b>Common mistakes: </b>{t.commonMistakesAr}</p>}
              </div>
            </details>
          ))}
        </section>
      );
    }

    // On the student screen, beside the book page: the topic (definition and
    // its parts) or one part of it, in large clear type.
    function StudentEnglishTopic({ english }) {
      const topic = englishTopicById(english.topic);
      if (!topic) return null;
      const item = english.item >= 0 ? (topic.ruleBreakdown || [])[english.item] : null;
      return (
        <div dir="ltr" className="h-full overflow-hidden bg-white/95 text-emerald-950 rounded-xl p-5 space-y-3 shadow-2xl">
          <h2 className="text-2xl font-black text-emerald-900">{tajweedTopicTitle(topic)}</h2>
          {item ? (
            <>
              <h3 className="text-xl font-black">
                {item.letter && <span className="font-quran text-3xl mr-2" dir="rtl">{item.letter}</span>}{item.titleAr}
              </h3>
              <p className="text-xl leading-relaxed">{item.explanationAr}</p>
            </>
          ) : (
            <>
              {/* The whole topic is its list of parts (each part is shown on
                  its own for detail); a topic without parts shows its definition. */}
              {!(topic.ruleBreakdown || []).length && topic.definitionAr && <p className="text-xl leading-relaxed">{topic.definitionAr}</p>}
              <ul className="space-y-2 text-xl">
                {(topic.ruleBreakdown || []).map((it, i) => (
                  <li key={i} className="leading-snug">
                    {it.letter && <span className="font-quran text-2xl mr-2" dir="rtl">{it.letter}</span>}<b>{it.titleAr}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
    }
