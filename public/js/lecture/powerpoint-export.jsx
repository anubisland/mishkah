    // createPowerPointExport: handlers moved out of App unchanged. App calls this once
    // per render and passes the state and setters the handlers read.
    function createPowerPointExport({ isRtl, islamicData, setIsExportingPptx, showToast }) {
      // Export Lecture Presentation to Microsoft PowerPoint (.pptx)
      const handleExportIslamicPowerPoint = async () => {
        if (!islamicData) {
          showToast(isRtl ? 'لا توجد محاضرة لتحويلها إلى عرض تقديمي' : 'No lecture to export');
          return;
        }
        if (typeof PptxGenJS === 'undefined') {
          showToast(isRtl ? 'محرك البوربوينت جاري تحميله، يرجى الانتظار ثوانٍ...' : 'PowerPoint engine loading...');
          return;
        }
        setIsExportingPptx(true);
        try {
          const pptx = new PptxGenJS();
          // Define standard 16:9 HD widescreen dimensions
          pptx.defineLayout({ name: 'WIDE_13_3', width: 13.333, height: 7.5 });
          pptx.layout = 'WIDE_13_3';

          const topic = (islamicData.metadata && islamicData.metadata.topic) || 'المحاضرة الشرعية والتأصيل العلمي';
          const cleanTopic = cleanSlideTitle(topic);
          const category = (islamicData.metadata && islamicData.metadata.category) || 'العلوم الشرعية والعقيدة';

          // Distinctive Serene Islamic Card Themes
          const THEME_HONEY = { bg: 'FFF9EE', border: 'C69214', title: '92400E', badge: 'C69214' };
          const THEME_SAGE = { bg: 'EAF4EE', border: '123329', title: '123329', badge: '047857' };
          const THEME_SKY = { bg: 'EEF6FB', border: '2563EB', title: '1E40AF', badge: '2563EB' };
          const THEME_LAVENDER = { bg: 'F7EEFB', border: '7C3AED', title: '6D28D9', badge: '7C3AED' };

          const slidesData = (islamicData.zoomCards && islamicData.zoomCards.length > 0)
            ? islamicData.zoomCards
            : (islamicData.blueprint || []);

          slidesData.forEach((s, idx) => {
            const slide = pptx.addSlide();
            const slideTitleText = cleanSlideTitle(s.slideTitle || s.phaseTitle || s.phaseNameAr || (`المحور ${idx + 1}`));
            const bullets = (Array.isArray(s.bulletPoints) && s.bulletPoints.length > 0)
              ? s.bulletPoints
              : (s.talkingPoints ? s.talkingPoints.split(' • ') : []);

            let arch = s.archetype;
            const tLower = slideTitleText.toLowerCase();

            // 1. Normalize archetype aliases
            if (arch === 'title_slide') arch = 'cover';
            if (arch === 'closing_slide') arch = 'closing';
            if (arch === 'comparison_table') arch = 'table';
            if (arch === 'mihrab_quote') arch = 'mihrab';
            if (arch === 'card_grid') arch = 'sources';

            // 2. High-precision semantic classifier overrides
            if ((s.hasTable && Array.isArray(s.tableData) && s.tableData.length > 0) || (Array.isArray(s.tableData) && s.tableData.length > 0) || tLower.includes('أوجه التفريق') || tLower.includes('مصفوفة') || tLower.includes('جدول')) {
              arch = 'table';
            } else if (tLower.includes('الدواء النبوي') || tLower.includes('دعاء') || tLower.includes('ذكر') || tLower.includes('محراب') || s.archetype === 'mihrab_quote') {
              arch = 'mihrab';
            } else if (tLower.includes('المصادر') || tLower.includes('المراجع') || tLower.includes('الكتب')) {
              arch = 'sources';
            } else if (tLower.includes('تخيل') || tLower.includes('السؤال الأول') || tLower.includes('قطار') || tLower.includes('قصة')) {
              arch = 'story';
            } else if (tLower.includes('ركائز') || tLower.includes('أركان') || tLower.includes('شمولية') || tLower.includes('أمثلة') || tLower.includes('حصون') || tLower.includes('الخاتمة')) {
              arch = 'pillars';
            } else if (tLower.includes('لماذا لا يكفي') || tLower.includes('الفرق بين') || tLower.includes('التفرد بالأمر') || tLower.includes('جناحا') || (bullets.length === 5 && (bullets[0].includes('البرهان') || bullets[0].includes('حال')))) {
              arch = 'contrast_2col';
            } else if (!arch || arch === 'standard' || arch === 'concept_breakdown') {
              if (idx === 0) arch = 'cover';
              else if (idx === slidesData.length - 1) arch = 'closing';
              else if (bullets.length === 2 || bullets.length === 4) arch = 'contrast_2col';
              else if (bullets.length >= 3) arch = 'pillars';
              else arch = 'contrast_2col';
            }

            // Slide Background
            slide.background = { color: (arch === 'cover' || arch === 'closing' || idx === slidesData.length - 1) ? '0B2E24' : 'FAF7F2' };

            // Top Gold Trim
            slide.addShape(pptx.ShapeType.rect, {
              x: 0, y: 0, w: 13.333, h: 0.12,
              fill: { color: 'C69214' }, line: { color: 'C69214' }
            });

            // Slide Footer
            slide.addText(`مِشكاة — نظام التشغيل الشرعي | المحاضرة: ${cleanTopic} | شريحة ${idx + 1} من ${slidesData.length}`, {
              x: 0.8, y: 7.05, w: 11.733, h: 0.35,
              fontSize: 10, fontFace: 'Cairo', color: (arch === 'cover' || arch === 'closing' || idx === slidesData.length - 1) ? 'FDE68A' : '64748B', align: 'right', rtlMode: true
            });

            // ================= 1. COVER & CLOSING SLIDE =================
            if (arch === 'cover' || arch === 'closing' || idx === slidesData.length - 1) {
              const isClosing = (arch === 'closing' || idx === slidesData.length - 1);
              slide.addText(isClosing ? 'الخاتمة وثمرة الدرس في الدارين • مِشكاة' : 'العقيدة الإسلامية — تأصيل اليقين • مِشكاة', {
                x: 1.0, y: 1.8, w: 11.333, h: 0.6,
                fontSize: 20, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'center', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 1.0, y: 2.5, w: 11.333, h: 1.5,
                fontSize: 34, fontFace: 'Cairo', color: 'FFFFFF', bold: true, align: 'center', rtlMode: true
              });
              const subCover = bullets[0] || (isClosing ? 'تحقيق العبودية لله وحده والاستقامة على أمره' : 'تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين');
              slide.addText(subCover, {
                x: 1.0, y: 4.1, w: 11.333, h: 0.8,
                fontSize: 20, fontFace: 'Cairo', color: 'FDE68A', align: 'center', rtlMode: true
              });
              if (s.scriptureEvidence) {
                slide.addText(s.scriptureEvidence, {
                  x: 1.5, y: 5.1, w: 10.333, h: 1.0,
                  fontSize: 20, fontFace: 'Amiri Quran', color: 'FDE68A', align: 'center', rtlMode: true
                });
              } else if (bullets.length > 1) {
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: 1.5, y: 5.1, w: 10.333, h: 1.2,
                  fill: { color: '123329' }, line: { color: 'C69214', width: 1.5 }
                });
                const outlineBullets = bullets.slice(1).join(' • ');
                slide.addText(outlineBullets, {
                  x: 1.6, y: 5.2, w: 10.133, h: 1.0,
                  fontSize: 16, fontFace: 'Cairo', color: 'FFFFFF', align: 'center', rtlMode: true
                });
              }

            // ================= 2. SOURCES (3 Soft Distinct Cards) =================
            } else if (arch === 'sources') {
              slide.addText('المصادر العلمية المعتمدة', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const cardW = 3.65;
              const gap = 0.39;
              const thms = [THEME_HONEY, THEME_SAGE, THEME_SKY];

              const srcCards = (bullets.length > 0 ? bullets : [
                '«ثلاثة الأصول وأدلتها» للإمام محمد بن عبد الوهاب — باب: معرفة العبد ربه بالأدلة والبراهين.',
                '«نبذة في العقيدة الإسلامية» للشيخ محمد بن صالح العثيمين — باب: الإيمان بالله وركائز التوحيد.',
                'منهج العقيدة — أكاديمية زاد للشيخ محمد صالح المنجد — المقرر التأسيسي لترسيخ اليقين.'
              ]).slice(0, 3).map((b, i) => {
                let badge = `المصدر ${['الأول', 'الثاني', 'الثالث'][i]}`;
                let title = '';
                let author = '';
                let focus = b;

                const qMatch = b.match(/«([^»]+)»/);
                if (qMatch) {
                  title = `«${qMatch[1]}»`;
                  let rest = b.replace(qMatch[0], '').trim();
                  const aMatch = rest.match(/((?:للإمام|للشيخ|للعلامة|تأليف|للدكتور)[^—–\n]+)/);
                  if (aMatch) {
                    author = aMatch[1].trim();
                    rest = rest.replace(aMatch[0], '').trim();
                  }
                  focus = rest.replace(/^[\s—–:-]+/, '').trim();
                } else if (b.includes('—') || b.includes(':')) {
                  const sep = b.includes('—') ? '—' : ':';
                  const pts = b.split(sep);
                  title = pts[0].trim();
                  focus = pts.slice(1).join(' — ').trim();
                } else {
                  title = b;
                  focus = '';
                }
                return { badge, title, author, focus, thm: thms[i] };
              });

              srcCards.forEach((item, i) => {
                const posX = 0.8 + ((srcCards.length - 1 - i) * (cardW + gap));
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 1.95, w: cardW, h: 4.8,
                  fill: { color: item.thm.bg }, line: { color: item.thm.border, width: 1.5 }
                });
                slide.addText(item.badge, {
                  x: posX + 0.3, y: 2.2, w: cardW - 0.6, h: 0.35,
                  fontSize: 14, fontFace: 'Cairo', color: item.thm.badge, bold: true, align: 'right', rtlMode: true
                });
                if (item.title) {
                  slide.addText(item.title, {
                    x: posX + 0.3, y: 2.65, w: cardW - 0.6, h: 0.55,
                    fontSize: 20, fontFace: 'Cairo', color: item.thm.title, bold: true, align: 'right', rtlMode: true
                  });
                }
                if (item.author) {
                  slide.addText(item.author, {
                    x: posX + 0.3, y: 3.25, w: cardW - 0.6, h: 0.45,
                    fontSize: 15, fontFace: 'Cairo', color: '047857', bold: true, align: 'right', rtlMode: true
                  });
                }
                if (item.focus) {
                  slide.addText(item.focus, {
                    x: posX + 0.3, y: item.author ? 3.8 : 3.3, w: cardW - 0.6, h: 2.6,
                    fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                  });
                }
              });

            // ================= 3. STORY / THOUGHT EXPERIMENT (4 Soft Cards) =================
            } else if (arch === 'story') {
              slide.addText('مقدمة: تأمل تدبري ومدخل وجودي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 1.65, w: 11.733, h: 0.85,
                fill: { color: 'FFF9EE' }, line: { color: 'C69214', width: 1.0 }
              });
              const premise = bullets[0] || 'تخيّل أنك استيقظت في قطار فائق السرعة ينطلق بك عبر أودية وجبال لا تعرفها. لن تسأل عن لون المقاعد ولا عن نوع الطعام، بل ستسأل فوراً:';
              slide.addText(premise, {
                x: 1.0, y: 1.7, w: 11.333, h: 0.75,
                fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', bold: true, align: 'right', rtlMode: true
              });

              const qList = [
                { num: '١', q: 'من الذي يقود هذا القطار؟', thm: THEME_HONEY },
                { num: '٢', q: 'من الذي وضعني فيه؟', thm: THEME_SAGE },
                { num: '٣', q: 'إلى أين يتجه بي؟', thm: THEME_SKY },
                { num: '٤', q: 'ما المطلوب مني أثناء الرحلة؟', thm: THEME_LAVENDER }
              ];
              const qW = 2.75;
              const qGap = 0.24;
              [0, 1, 2, 3].forEach(i => {
                const posX = 0.8 + ((3 - i) * (qW + qGap));
                const item = qList[i];
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 2.65, w: qW, h: 2.3,
                  fill: { color: item.thm.bg }, line: { color: item.thm.border, width: 1.5 }
                });
                slide.addText(item.num, {
                  x: posX, y: 2.85, w: qW, h: 0.5,
                  fontSize: 26, fontFace: 'Cairo', color: item.thm.badge, bold: true, align: 'center', rtlMode: true
                });
                slide.addText(item.q, {
                  x: posX + 0.1, y: 3.5, w: qW - 0.2, h: 1.2,
                  fontSize: 18, fontFace: 'Cairo', color: item.thm.title, bold: true, align: 'center', rtlMode: true
                });
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 5.2, w: 11.733, h: 1.4,
                fill: { color: '0B2E24' }, line: { color: 'C69214', width: 1.5 }
              });
              slide.addText('هكذا تماماً هي حياة الإنسان على هذه الأرض.', {
                x: 1.0, y: 5.35, w: 11.333, h: 0.45,
                fontSize: 20, fontFace: 'Cairo', color: 'FDE68A', bold: true, align: 'center', rtlMode: true
              });
              slide.addText('أسئلة وجودية حاسمة تحدد الغاية والمصير، والإجابة عنها هي أول وأعظم واجب على كل مكلف.', {
                x: 1.0, y: 5.85, w: 11.333, h: 0.55,
                fontSize: 16, fontFace: 'Traditional Arabic', color: 'FFFFFF', align: 'center', rtlMode: true
              });

            // ================= 4. CONTRAST (2 Distinct Soft Cards: Sage & Honey) =================
            } else if (arch === 'contrast_2col') {
              slide.addText('التحرير والتفريق المنهجي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              let header = '';
              let titleA = 'الوجه الأول';
              let bodyA = '';
              let titleB = 'الوجه المقابل';
              let bodyB = '';

              if (bullets.length === 5) {
                header = bullets[0];
                titleA = bullets[1];
                bodyA = bullets[2];
                titleB = bullets[3];
                bodyB = bullets[4];
              } else if (bullets.length === 4) {
                titleA = bullets[0];
                bodyA = bullets[1];
                titleB = bullets[2];
                bodyB = bullets[3];
              } else if (bullets.length === 2) {
                [0, 1].forEach((idx, i) => {
                  const b = bullets[idx];
                  const sep = b.includes(':') ? ':' : (b.includes('—') ? '—' : null);
                  if (sep) {
                    const pts = b.split(sep);
                    if (i === 0) { titleA = pts[0].trim(); bodyA = pts.slice(1).join(sep).trim(); }
                    else { titleB = pts[0].trim(); bodyB = pts.slice(1).join(sep).trim(); }
                  } else {
                    if (i === 0) bodyA = b; else bodyB = b;
                  }
                });
              } else if (bullets.length > 0) {
                bodyA = bullets[0];
                bodyB = bullets.slice(1).join('\n');
              }

              const colW = 5.6;
              const gap = 0.53;
              let startY = 1.85;
              let cardH = 4.8;

              // If header banner exists (like 'البرهان الأول: حال المشركين الأوائل')
              if (header) {
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: 0.8, y: 1.75, w: 11.733, h: 0.55,
                  fill: { color: '0B2E24' }, line: { color: 'C69214', width: 1.0 }
                });
                slide.addText(header, {
                  x: 1.0, y: 1.8, w: 11.333, h: 0.45,
                  fontSize: 16, fontFace: 'Cairo', color: 'FDE68A', bold: true, align: 'center', rtlMode: true
                });
                startY = 2.45;
                cardH = 4.3;
              }

              // Card 1 (Right): Sage Green
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8 + colW + gap, y: startY, w: colW, h: cardH,
                fill: { color: THEME_SAGE.bg }, line: { color: THEME_SAGE.border, width: 1.5 }
              });
              slide.addText(titleA, {
                x: 0.8 + colW + gap + 0.4, y: startY + 0.3, w: colW - 0.8, h: 0.55,
                fontSize: 20, fontFace: 'Cairo', color: THEME_SAGE.title, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(bodyA, {
                x: 0.8 + colW + gap + 0.4, y: startY + 0.95, w: colW - 0.8, h: cardH - 1.2,
                fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
              });

              // Card 2 (Left): Warm Honey
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: startY, w: colW, h: cardH,
                fill: { color: THEME_HONEY.bg }, line: { color: THEME_HONEY.border, width: 1.5 }
              });
              slide.addText(titleB, {
                x: 1.2, y: startY + 0.3, w: colW - 0.8, h: 0.55,
                fontSize: 20, fontFace: 'Cairo', color: THEME_HONEY.title, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(bodyB, {
                x: 1.2, y: startY + 0.95, w: colW - 0.8, h: cardH - 1.2,
                fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
              });

            // ================= 5. PILLARS (3 Soft Distinct Cards: Honey, Sage, Sky) =================
            } else if (arch === 'pillars') {
              slide.addText('الركائز والأصول الكبرى', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const colW = 3.65;
              const gap = 0.39;
              const numSymbols = ['١', '٢', '٣'];
              const thms = [THEME_HONEY, THEME_SAGE, THEME_SKY];
              const cleanPillars = bullets.filter(b => b && !/^[\d\u0660-\u0669\s\.\-\)]+$/.test(b.trim()));

              [0, 1, 2].forEach(i => {
                const posX = 0.8 + ((2 - i) * (colW + gap));
                const rawBText = cleanPillars[i] || 'تأصيل شرعي وضبط منهجي للمسألة العلمية';
                const thm = thms[i];
                let colTitle = '';
                let colBody = rawBText;

                if (rawBText.includes(':')) {
                  const cPos = rawBText.indexOf(':');
                  colTitle = rawBText.substring(0, cPos).trim();
                  colBody = rawBText.substring(cPos + 1).trim();
                } else if (rawBText.includes('—')) {
                  const dPos = rawBText.indexOf('—');
                  colTitle = rawBText.substring(0, dPos).trim();
                  colBody = rawBText.substring(dPos + 1).trim();
                }

                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 1.95, w: colW, h: 4.8,
                  fill: { color: thm.bg }, line: { color: thm.border, width: 1.5 }
                });

                slide.addText(numSymbols[i], {
                  x: posX + 0.3, y: 2.15, w: colW - 0.6, h: 0.5,
                  fontSize: 28, fontFace: 'Cairo', color: thm.badge, bold: true, align: 'right', rtlMode: true
                });

                if (colTitle) {
                  const displayTitle = colTitle.replace(/^[\d\u0660-\u0669\.\-\s]+/, '').trim();
                  slide.addText(displayTitle, {
                    x: posX + 0.3, y: 2.75, w: colW - 0.6, h: 0.6,
                    fontSize: 22, fontFace: 'Cairo', color: thm.title, bold: true, align: 'right', rtlMode: true
                  });
                }

                slide.addText(colBody, {
                  x: posX + 0.3, y: colTitle ? 3.45 : 2.8, w: colW - 0.6, h: 3.0,
                  fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                });
              });

            // ================= 6. MATRIX / COMPARISON TABLE =================
            } else if (arch === 'table') {
              slide.addText('أوجه التفريق الجوهرية', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const tData = (Array.isArray(s.tableData) && s.tableData.length > 0)
                ? s.tableData
                : [
                    ['من حيث', 'الشرك الأكبر', 'الشرك الأصغر'],
                    ['أصل الإيمان والملة', 'يناقض أصل التوحيد ويخرج صاحبه من الملة', 'لا يخرج من الملة، لكن ينقص كمال التوحيد الواجب'],
                    ['إحباط الأعمال', 'يحبط جميع الأعمال الصالحة إن مات عليه', 'يحبط العمل الذي خالطه فقط'],
                    ['المصير في الآخرة', 'لا يُغفر لمن مات عليه بلا توبة، ويُخلد في النار', 'تحت المشيئة كأصحاب الكبائر، ولا يخلد في النار'],
                    ['الدم والمال في الدنيا', 'يبيح الدم والمال إذا قامت الحجة وانتفت الموانع', 'لا يبيح دماً ولا مالاً؛ وتبقى حرمة المسلم كاملة']
                  ];

              const formattedTable = tData.map((row, rIdx) => {
                return row.map((cellText, cIdx) => {
                  let fColor = (rIdx === 0) ? '0B2E24' : (cIdx === 1 ? 'FFF9EE' : (cIdx === 2 ? 'EAF4EE' : 'FFFFFF'));
                  let tColor = (rIdx === 0) ? 'C69214' : '1E293B';
                  return {
                    text: cellText,
                    options: {
                      fill: { color: fColor },
                      color: tColor,
                      fontSize: (rIdx === 0) ? 15 : 14,
                      fontFace: (rIdx === 0) ? 'Cairo' : 'Traditional Arabic',
                      bold: (rIdx === 0 || cIdx === 0),
                      align: (rIdx === 0) ? 'center' : 'right',
                      rtlMode: true
                    }
                  };
                });
              });

              slide.addTable(formattedTable, {
                x: 0.8, y: 1.8, w: 11.733, h: 4.3,
                colW: [2.333, 4.7, 4.7],
                border: { color: 'C69214', width: 1.0 }
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 6.25, w: 11.733, h: 0.65,
                fill: { color: 'FFFFFF' }, line: { color: 'C69214', width: 1.0 }
              });
              slide.addText('العلاقة بينهما: الشرك الأصغر بوابة الأكبر وذريعته؛ فالتساهل في الصغير يجر إلى الوقوع في الكبير عياذاً بالله.', {
                x: 1.0, y: 6.3, w: 11.333, h: 0.55,
                fontSize: 14, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

            // ================= 7. MIHRAB (Sacred Verses & Hadiths) =================
            } else if (arch === 'mihrab') {
              slide.addText('محراب الوحي والبيان النبوي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              slide.addShape(pptx.ShapeType.roundRect, {
                x: 1.0, y: 1.85, w: 11.333, h: 3.5,
                fill: { color: 'FFF9EE' }, line: { color: 'C69214', width: 2.0 }
              });

              const sacredMain = bullets[0] || s.scriptureEvidence || '«اللهم إني أعوذ بك أن أشرك بك وأنا أعلم، وأستغفرك لما لا أعلم»';
              slide.addText(sacredMain, {
                x: 1.4, y: 2.2, w: 10.533, h: 2.8,
                fontSize: 22, fontFace: 'Traditional Arabic', color: '123329', bold: true, align: 'center', rtlMode: true
              });

              if (bullets[1]) {
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: 1.0, y: 5.55, w: 11.333, h: 1.2,
                  fill: { color: 'EAF4EE' }, line: { color: '123329', width: 1.2 }
                });
                slide.addText(bullets[1], {
                  x: 1.3, y: 5.65, w: 10.733, h: 1.0,
                  fontSize: 16, fontFace: 'Cairo', color: '1E293B', align: 'center', rtlMode: true
                });
              }

            // ================= 8. DEFAULT / CONCEPT BREAKDOWN =================
            } else {
              slide.addText('التأصيل والبيان الشرعي', {
                x: 0.8, y: 0.45, w: 11.733, h: 0.4,
                fontSize: 14, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'right', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 0.8, y: 0.9, w: 11.733, h: 0.75,
                fontSize: 24, fontFace: 'Cairo', color: '123329', bold: true, align: 'right', rtlMode: true
              });

              const count = Math.min(bullets.length, 3);
              if (count === 2) {
                const colW = 5.6;
                const gap = 0.53;
                const thms = [THEME_SAGE, THEME_HONEY];
                [0, 1].forEach(i => {
                  const posX = 0.8 + ((1 - i) * (colW + gap));
                  slide.addShape(pptx.ShapeType.roundRect, {
                    x: posX, y: 1.95, w: colW, h: 4.8,
                    fill: { color: thms[i].bg }, line: { color: thms[i].border, width: 1.5 }
                  });
                  slide.addText(bullets[i], {
                    x: posX + 0.4, y: 2.3, w: colW - 0.8, h: 4.0,
                    fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                  });
                });
              } else {
                const colW = 3.65;
                const gap = 0.39;
                const thms = [THEME_HONEY, THEME_SAGE, THEME_SKY];
                [0, 1, 2].forEach(i => {
                  const posX = 0.8 + ((2 - i) * (colW + gap));
                  const bText = bullets[i] || 'بيان المحور العلمي والواجب المنهجي والشرعي المستفاد.';
                  slide.addShape(pptx.ShapeType.roundRect, {
                    x: posX, y: 1.95, w: colW, h: 4.8,
                    fill: { color: thms[i].bg }, line: { color: thms[i].border, width: 1.5 }
                  });
                  slide.addText(bText, {
                    x: posX + 0.35, y: 2.3, w: colW - 0.7, h: 4.0,
                    fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                  });
                });
              }
            }

            // Attached Speaker Notes
            const speakerNotes = s.notes || s.talkingPoints || s.pedagogicalTip || `ملاحظات المحاضر وتوجيهات الشرح لمسائل: ${slideTitleText}`;
            slide.addNotes(speakerNotes);
          });

          // Save Presentation
          const sanitizedFilename = (cleanTopic || 'المحاضرة_الشرعية')
            .replace(/[/\\?%*:|"<>]/g, '')
            .substring(0, 40)
            .trim();
          await pptx.writeFile({ fileName: `مِشكاة_${sanitizedFilename}.pptx` });
          showToast(isRtl ? 'تم تصدير العرض التقديمي فائق الجودة بالهوية الإسلامية بنجاح ✨' : 'Islamic PowerPoint presentation exported successfully ✨');
        } catch (err) {
          console.error('Error generating PowerPoint file:', err);
          showToast(isRtl ? 'حدث خطأ أثناء إنشاء ملف البوربوينت' : 'Error generating PowerPoint file');
        } finally {
          setIsExportingPptx(false);
        }
      };

      return { handleExportIslamicPowerPoint };
    }
