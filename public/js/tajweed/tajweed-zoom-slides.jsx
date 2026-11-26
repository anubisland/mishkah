    // The tajweed Zoom presentation for one lesson: the matn and plate first,
    // then each letter/case breakdown, then each Quranic practice word.
    function buildTajweedZoomSlides(lesson) {
      if (!lesson) return [];
      const slides = [];

      // Slide 0: Matn and Illustrated Anatomical Plate
      slides.push({
        type: 'overview',
        titleAr: 'الشاهد المعتمد من المتن واللوحة التعليمية المصورة',
        titleEn: 'Authentic Matn Verse & Illustrated Anatomical Plate'
      });

      // Systematic Letter & Case Breakdown Slides
      if (Array.isArray(lesson.ruleBreakdown) && lesson.ruleBreakdown.length > 0) {
        lesson.ruleBreakdown.forEach((item, bIdx) => {
          slides.push({
            type: 'breakdown',
            item: item,
            bIndex: bIdx,
            titleAr: item.titleAr,
            titleEn: item.titleAr
          });
        });
      }

      // Individual Quranic Practice Words with Live Metronome
      if (Array.isArray(lesson.examples) && lesson.examples.length > 0) {
        lesson.examples.forEach((ex, exIdx) => {
          slides.push({
            type: 'example',
            example: ex,
            exIndex: exIdx,
            titleAr: ex.word,
            titleEn: ex.word
          });
        });
      }

      return slides;
    }
