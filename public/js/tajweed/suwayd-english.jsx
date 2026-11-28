    // English for classes taught in English: a copy of a tajweed lesson with
    // its teaching texts in English, under the same field names, so the
    // screens need no change. The matn, Quranic words and letters stay Arabic.
    // The English is a draft translation awaiting the teacher's review
    // (SUWAYD_ENGLISH_REVIEWED says when it has been reviewed).
    const SUWAYD_ENGLISH_REVIEWED = false;

    function localiseTajweedLesson(lesson, lang) {
      const en = lang === 'en' && lesson && typeof SUWAYD_ENGLISH !== 'undefined' ? SUWAYD_ENGLISH[lesson.id] : null;
      if (!en) return lesson;
      const pick = (english, arabic) => (english && english.trim() ? english : arabic);
      // Examples with a note get it in English; examples with only a label
      // («في كلمة واحدة») get the label in English, without its brackets.
      const notes = (examples, englishNotes) => (examples || []).map((ex, i) => {
        const english = englishNotes && englishNotes[i];
        if (ex.note) return Object.assign({}, ex, { note: pick(english, ex.note) });
        return english ? Object.assign({}, ex, { type: english.replace(/^\(|\)$/g, '') }) : ex;
      });
      return Object.assign({}, lesson, {
        titleAr: lesson.titleEn || lesson.titleAr,
        timingLabelAr: pick(en.timingLabelEn, lesson.timingLabelAr),
        timingDescription: pick(en.timingDescriptionEn, lesson.timingDescription),
        definitionAr: pick(en.definitionEn, lesson.definitionAr),
        mechanismAr: pick(en.mechanismEn, lesson.mechanismAr),
        commonMistakesAr: pick(en.commonMistakesEn, lesson.commonMistakesAr),
        teacherPromptAr: pick(en.teacherPromptEn, lesson.teacherPromptAr),
        examples: notes(lesson.examples, en.exampleNotesEn),
        ruleBreakdown: (lesson.ruleBreakdown || []).map((item, i) => {
          const t = (en.breakdown || {})[String(i)] || {};
          return Object.assign({}, item, {
            titleAr: pick(t.titleEn, item.titleAr),
            tagAr: pick(t.tagEn, item.tagAr),
            explanationAr: pick(t.explanationEn, item.explanationAr),
            warningAr: pick(t.warningEn, item.warningAr),
            examples: notes(item.examples, t.exampleNotesEn)
          });
        }),
        isEnglish: true
      });
    }
