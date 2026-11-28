    // English teaching notes for a class taught in English from the Arabic
    // book «التجويد المصور»: there is no English edition, so the teacher
    // reads, under the book page, the draft English explanation of the topics
    // in that chapter (from the earlier lessons' translation, which awaits
    // the teacher's review — SUWAYD_ENGLISH_REVIEWED).
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

    function englishTopicsForChapter(chapter) {
      const ids = chapter ? TAJWEED_BOOK_ENGLISH_TOPICS[chapter.page] || [] : [];
      return ids.map((id) => SUWAYD_TAJWEED_CURRICULUM.find((l) => l.id === id))
        .filter(Boolean).map((l) => localiseTajweedLesson(l, 'en')).filter((l) => l.isEnglish);
    }

    function TajweedEnglishNotes({ chapter }) {
      const topics = useMemo(() => englishTopicsForChapter(chapter), [chapter && chapter.page]);
      return (
        <section className="bg-white rounded-2xl p-4 border-2 border-sky-300 space-y-2" dir="ltr">
          <h4 className="font-black text-emerald-900">🇬🇧 English notes{chapter && chapter.titleEn ? ' — ' + chapter.titleEn : ''}</h4>
          {!SUWAYD_ENGLISH_REVIEWED && (
            <p className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg p-2" dir="rtl">ترجمة أولية لشرح موضوعات هذا الباب، تنتظر مراجعة المعلم، وليست من الكتاب نفسه.</p>
          )}
          {!topics.length && <p className="text-sm text-slate-600">No English notes for this chapter yet.</p>}
          {topics.map((t) => (
            <details key={t.id} className="rounded-xl border border-slate-200 px-3 py-2">
              <summary className="font-black text-emerald-950 cursor-pointer">{String(t.titleAr).replace(/^\d+\.\s*/, '')}</summary>
              <div className="mt-2 space-y-2 text-slate-800 leading-relaxed">
                {t.definitionAr && <p><b>Definition: </b>{t.definitionAr}</p>}
                {t.mechanismAr && <p><b>How it works: </b>{t.mechanismAr}</p>}
                {(t.ruleBreakdown || []).map((item, i) => (
                  <p key={i}>
                    {item.letter && <span className="font-quran text-lg ml-1" dir="rtl">{item.letter} </span>}
                    <b>{item.titleAr}: </b>{item.explanationAr}
                  </p>
                ))}
                {t.commonMistakesAr && <p className="whitespace-pre-line"><b>Common mistakes: </b>{t.commonMistakesAr}</p>}
              </div>
            </details>
          ))}
        </section>
      );
    }
