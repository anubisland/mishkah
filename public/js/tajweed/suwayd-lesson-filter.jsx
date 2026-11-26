    const filterMatchesSuwaydLesson = (catId, lesson, search = '') => {
      if (!lesson) return false;
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const title = (lesson.titleAr || '').toLowerCase();
        const def = (lesson.definitionAr || '').toLowerCase();
        const cat = (lesson.categoryAr || '').toLowerCase();
        const ex = (lesson.examples || []).map(e => (e.word || '') + ' ' + (e.note || '')).join(' ').toLowerCase();
        if (!title.includes(q) && !def.includes(q) && !cat.includes(q) && !ex.includes(q)) {
          return false;
        }
      }
      if (!catId || catId === 'all') return true;
      if (catId === 'makharij') return lesson.categoryId === 'makharij';
      if (catId === 'sifat') return lesson.categoryId === 'sifat';
      if (catId === 'noon_meem' || catId === 'noon_and_meem') {
        return lesson.categoryId === 'noon_sakinah' || lesson.categoryId === 'meem_sakinah' || lesson.categoryId === 'noon_and_meem';
      }
      if (catId === 'lamat') {
        return lesson.categoryId === 'lamat' || lesson.categoryId === 'letter_relations';
      }
      if (catId === 'madd' || catId === 'madd_rules') {
        return lesson.categoryId === 'madd_rules' || lesson.categoryId === 'madd';
      }
      if (catId === 'tafkheem' || catId === 'tafkheem_rules') {
        return lesson.categoryId === 'tafkheem_rules' || lesson.categoryId === 'tafkheem';
      }
      if (catId === 'rasm_waqf' || catId === 'waqf_rasm') {
        return lesson.categoryId === 'waqf_rules' || lesson.categoryId === 'hamzah_rules' || lesson.categoryId === 'rasm_rules' || lesson.categoryId === 'rasm_waqf';
      }
      if (catId === 'intro_tajweed' || catId === 'intro') {
        return lesson.categoryId === 'intro_tajweed';
      }
      return lesson.categoryId === catId;
    };
