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

            // Archetype Classifier
            if (!arch || arch === 'standard') {
              if (idx === 0) arch = 'cover';
              else if ((s.hasTable && Array.isArray(s.tableData) && s.tableData.length > 0) || (Array.isArray(s.tableData) && s.tableData.length > 0) || tLower.includes('أوجه التفريق') || tLower.includes('مصفوفة')) arch = 'table';
              else if (tLower.includes('المصادر') || tLower.includes('المراجع') || tLower.includes('الكتب')) arch = 'sources';
              else if (tLower.includes('تخيل') || tLower.includes('السؤال الأول') || tLower.includes('قطار') || tLower.includes('قصة')) arch = 'story';
              else if (tLower.includes('الدواء النبوي') || tLower.includes('دعاء')) arch = 'mihrab';
              else if (tLower.includes('لماذا لا يكفي') || tLower.includes('التفرد بالأمر') || tLower.includes('الفرق بين') || tLower.includes('جناحا')) arch = 'contrast_2col';
              else if (tLower.includes('ركائز') || tLower.includes('أركان') || tLower.includes('شمولية') || tLower.includes('أمثلة') || tLower.includes('حصون') || tLower.includes('الخاتمة') || bullets.length >= 3) arch = 'pillars';
              else if (tLower.startsWith('المحور') && bullets.length <= 2) arch = 'divider';
              else arch = (idx % 2 === 0) ? 'contrast_2col' : 'concept_breakdown';
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
              fontSize: 10, fontFace: 'Cairo', color: (arch === 'cover' || idx === slidesData.length - 1) ? 'FDE68A' : '64748B', align: 'right', rtlMode: true
            });

            // ================= 1. COVER SLIDE =================
            if (arch === 'cover') {
              slide.addText('العقيدة الإسلامية — تأصيل اليقين • مِشكاة', {
                x: 1.0, y: 1.8, w: 11.333, h: 0.6,
                fontSize: 20, fontFace: 'Cairo', color: 'C69214', bold: true, align: 'center', rtlMode: true
              });
              slide.addText(slideTitleText, {
                x: 1.0, y: 2.5, w: 11.333, h: 1.5,
                fontSize: 44, fontFace: 'Cairo', color: 'FFFFFF', bold: true, align: 'center', rtlMode: true
              });
              const subCover = bullets[0] || 'تأصيل توحيد الربوبية وتوحيد الألوهية وبناء اليقين';
              slide.addText(subCover, {
                x: 1.0, y: 4.1, w: 11.333, h: 0.8,
                fontSize: 22, fontFace: 'Cairo', color: 'FDE68A', align: 'center', rtlMode: true
              });
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 1.5, y: 5.1, w: 10.333, h: 1.2,
                fill: { color: '123329' }, line: { color: 'C69214', width: 1.5 }
              });
              const outlineBullets = bullets.slice(1).join(' • ') || 'معرفة العبد ربه • أدلة الربوبية • حقيقة الألوهية • ثمار التوحيد في الدارين';
              slide.addText(outlineBullets, {
                x: 1.6, y: 5.2, w: 10.133, h: 1.0,
                fontSize: 16, fontFace: 'Cairo', color: 'FFFFFF', align: 'center', rtlMode: true
              });

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

              const srcList = [
                { badge: 'المصدر الأول', title: '«ثلاثة الأصول وأدلتها»', author: 'للإمام محمد بن عبد الوهاب رحمه الله', focus: 'باب: معرفة العبد ربه بالأدلة والبراهين الصريحة من الكتاب والسنة وفطرة الإنسان.', thm: THEME_HONEY },
                { badge: 'المصدر الثاني', title: '«نبذة في العقيدة الإسلامية»', author: 'للشيخ محمد بن صالح العثيمين رحمه الله', focus: 'باب: الإيمان بالله — تفصيل ركائز الربوبية وإفراد الألوهية ومقتضى التوحيد.', thm: THEME_SAGE },
                { badge: 'المصدر الثالث', title: 'منهج العقيدة — أكاديمية زاد', author: 'المنهج التأسيسي للشيخ محمد صالح المنجد', focus: 'مقرر «العقيدة الإسلامية» — بناء اليقين العقدي والتصور الشامل للوجود والتحرر من الشرك.', thm: THEME_SKY }
              ];

              const cardW = 3.65;
              const gap = 0.39;
              [0, 1, 2].forEach(i => {
                const posX = 0.8 + ((2 - i) * (cardW + gap));
                const item = srcList[i];
                slide.addShape(pptx.ShapeType.roundRect, {
                  x: posX, y: 1.95, w: cardW, h: 4.8,
                  fill: { color: item.thm.bg }, line: { color: item.thm.border, width: 1.5 }
                });
                slide.addText(item.badge, {
                  x: posX + 0.3, y: 2.2, w: cardW - 0.6, h: 0.35,
                  fontSize: 14, fontFace: 'Cairo', color: item.thm.badge, bold: true, align: 'right', rtlMode: true
                });
                slide.addText(item.title, {
                  x: posX + 0.3, y: 2.65, w: cardW - 0.6, h: 0.5,
                  fontSize: 21, fontFace: 'Cairo', color: item.thm.title, bold: true, align: 'right', rtlMode: true
                });
                slide.addText(item.author, {
                  x: posX + 0.3, y: 3.25, w: cardW - 0.6, h: 0.45,
                  fontSize: 15, fontFace: 'Cairo', color: '047857', bold: true, align: 'right', rtlMode: true
                });
                slide.addText(item.focus, {
                  x: posX + 0.3, y: 3.8, w: cardW - 0.6, h: 2.5,
                  fontSize: 16, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
                });
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

              let titleA = 'الوجه الأول';
              let bodyA = bullets[0] || 'تحرير الركيزة الأولى ومقتضياتها المنهجية بدقة علمية.';
              let titleB = 'الوجه المقابل';
              let bodyB = bullets[1] || 'بيان الوجه المقابل والضوابط الشرعية المفرقة بدقة علمية.';

              if (bullets[0] && (bullets[0].includes(':') || bullets[0].includes('—'))) {
                const sep = bullets[0].includes(':') ? ':' : '—';
                const pts = bullets[0].split(sep);
                titleA = pts[0].trim();
                bodyA = pts.slice(1).join(sep).trim();
              }
              if (bullets[1] && (bullets[1].includes(':') || bullets[1].includes('—'))) {
                const sep = bullets[1].includes(':') ? ':' : '—';
                const pts = bullets[1].split(sep);
                titleB = pts[0].trim();
                bodyB = pts.slice(1).join(sep).trim();
              }

              const colW = 5.6;
              const gap = 0.53;

              // Card 1 (Right): Sage Green
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8 + colW + gap, y: 1.85, w: colW, h: 4.8,
                fill: { color: THEME_SAGE.bg }, line: { color: THEME_SAGE.border, width: 1.5 }
              });
              slide.addText('الأصل الأول', {
                x: 0.8 + colW + gap + 0.4, y: 2.1, w: colW - 0.8, h: 0.35,
                fontSize: 14, fontFace: 'Cairo', color: THEME_SAGE.badge, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(titleA, {
                x: 0.8 + colW + gap + 0.4, y: 2.5, w: colW - 0.8, h: 0.6,
                fontSize: 22, fontFace: 'Cairo', color: THEME_SAGE.title, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(bodyA, {
                x: 0.8 + colW + gap + 0.4, y: 3.2, w: colW - 0.8, h: 3.2,
                fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
              });

              // Card 2 (Left): Warm Honey
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 1.85, w: colW, h: 4.8,
                fill: { color: THEME_HONEY.bg }, line: { color: THEME_HONEY.border, width: 1.5 }
              });
              slide.addText('الأصل المقابل', {
                x: 1.2, y: 2.1, w: colW - 0.8, h: 0.35,
                fontSize: 14, fontFace: 'Cairo', color: THEME_HONEY.badge, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(titleB, {
                x: 1.2, y: 2.5, w: colW - 0.8, h: 0.6,
                fontSize: 22, fontFace: 'Cairo', color: THEME_HONEY.title, bold: true, align: 'right', rtlMode: true
              });
              slide.addText(bodyB, {
                x: 1.2, y: 3.2, w: colW - 0.8, h: 3.2,
                fontSize: 17, fontFace: 'Traditional Arabic', color: '1E293B', align: 'right', rtlMode: true
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
                  slide.addText(colTitle, {
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
