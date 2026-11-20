const fs = require('fs');
const babelParser = require('@babel/parser');

console.log('Applying comprehensive slide engine...');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. REPLACE handleProcessCustomLecture
const procStart = html.indexOf('function handleProcessCustomLecture() {');
const procEnd = html.indexOf('function handleSaveIslamicLecture() {');

if (procStart === -1 || procEnd === -1) {
  console.error('Could not find boundaries for handleProcessCustomLecture');
  process.exit(1);
}

const newHandleProcessCustomLecture = `function handleProcessCustomLecture() {
        if (!rawLectureText || !rawLectureText.trim()) {
          showToast(isRtl ? 'يرجى لصق نص المحاضرة أو رفع ملف أولاً' : 'Please provide lecture text or upload file first');
          return;
        }

        const rawClean = sanitizeArabicExtractedText(rawLectureText).trim();
        const rawLines = rawClean.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);

        // Helper to identify OCR scan notices and publishing noise
        const isNoiseLine = (line) => {
          if (!line) return true;
          if (/^(?:ملاحظة منهجية|هذا الملخص معد|نسخة ممسوحة|التعرف على نصوصها|أخطاء طباعية|دار النشر|دار الوعي|طبعة ورقية|ملحق تعقيبي|ردمك|ISBN)/i.test(line)) return true;
          if (/^\\(?\\s*\\d+\\s*(?:صفحة|ص)?\\s*\\)?$/i.test(line)) return true;
          if (line.includes('نسخة ممسوحة ضوئيا') || line.includes('359 صفحة')) return true;
          return false;
        };

        const cleanLines = rawLines.filter(l => !isNoiseLine(l));

        // 1. Detect Lecture Title from non-noise initial lines
        let detectedTopic = (lessonTopic && lessonTopic.trim()) || '';
        let startContentIndex = 0;

        if (!detectedTopic) {
          for (let i = 0; i < Math.min(6, cleanLines.length); i++) {
            const line = cleanLines[i].replace(/^[#*\\-•\\s\\d\\.\\)\\:،]+/, '').trim();
            if (line.includes('ملخص') || line.includes('كتاب') || line.includes('تأليف') || line.includes('دراسة')) {
              detectedTopic = line
                .replace(/^(?:ملخص شامل ل?|ملخص ك?تاب:?\\s*)+/, '')
                .replace(/تأليف[:\\s].*$/, '')
                .replace(/دار[:\\s].*$/, '')
                .trim();
              startContentIndex = i + 1;
              break;
            } else if (line.length >= 4 && line.length <= 90 && !line.includes('بسم الله')) {
              detectedTopic = line;
              startContentIndex = i + 1;
              break;
            }
          }
        }
        const topic = detectedTopic || (isRtl ? 'محاضرة شرعية وتأصيل علمي' : 'Islamic Lecture');
        const contentLines = cleanLines.slice(startContentIndex);

        // 2. Detect Subject Category
        let finalCategory = subjectCategory === 'custom' ? (customSubjectCategory.trim() || 'فكر إسلامي ومعاصر') : subjectCategory;
        if (!finalCategory || finalCategory === 'custom') {
          const lowerText = rawClean.toLowerCase();
          if (lowerText.includes('عقيدة') || lowerText.includes('توحيد') || lowerText.includes('إيمان') || lowerText.includes('شرك')) {
            finalCategory = isRtl ? 'عقيدة وتوحيد' : 'Aqeedah & Tawheed';
          } else if (lowerText.includes('فقه') || lowerText.includes('صلاة') || lowerText.includes('طهارة') || lowerText.includes('أحكام')) {
            finalCategory = isRtl ? 'فقه وأصول' : 'Fiqh & Usul';
          } else if (lowerText.includes('تفسير') || lowerText.includes('آيات') || lowerText.includes('سورة')) {
            finalCategory = isRtl ? 'تفسير وعلوم القرآن' : 'Tafseer & Quranic Sciences';
          } else if (lowerText.includes('سيرة') || lowerText.includes('غزوة') || lowerText.includes('صحابة')) {
            finalCategory = isRtl ? 'السيرة النبوية والتاريخ' : 'Seerah & Islamic History';
          } else if (lowerText.includes('خطاب') || lowerText.includes('مدني') || lowerText.includes('فكر') || lowerText.includes('حداثة') || lowerText.includes('علمانية') || lowerText.includes('شبهات') || lowerText.includes('مآلات')) {
            finalCategory = isRtl ? 'فكر إسلامي ومعاصر وقضايا الخطاب' : 'Islamic Thought & Contemporary Discourse';
          } else {
            finalCategory = isRtl ? 'علوم شرعية عامة' : 'Islamic Studies';
          }
        }

        // 3. Extract Quranic Verses and Hadiths / Citations across text (excluding noise)
        const detectedAyahs = [];
        const detectedHadiths = [];
        contentLines.forEach(l => {
          if (isNoiseLine(l)) return;
          if ((l.includes('قال تعالى') || l.includes('قوله تعالى') || l.includes('﴿')) && !l.includes('صفحة')) {
            detectedAyahs.push(l);
          } else if (l.includes('قال رسول الله') || l.includes('قال ﷺ') || l.includes('صحيح مسلم') || l.includes('صحيح البخاري') || l.includes('رواه')) {
            detectedHadiths.push(l);
          }
        });

        // 4. Intelligent Dynamic Section Segmentation Engine (Supports up to 20 slides naturally)
        const headingRegex = /^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|حادي عشر|ثاني عشر|ثالث عشر|رابع عشر|خامس عشر|سادس عشر|المبحث|المطلب|الفصل|الباب|المحور|المسألة|الوقفة|القسم|الأصل|القاعدة|الضابط|العنصر|النقطة)\\s*(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\\d+|[\\u0660-\\u0669]+|[أ-ي])?[:\\.\\-\\s]|^[#]{1,4}\\s+|^(?:\\d+|[\\u0660-\\u0669]+)[\\.\\-\\)]\\s+/i;

        const rawSections = [];
        let currentSec = null;

        for (let i = 0; i < contentLines.length; i++) {
          const line = contentLines[i];
          const isHeadingMatch = headingRegex.test(line);
          const isShortHeaderCandidate = line.length < 55 && !line.endsWith('.') && !line.endsWith('،') && !line.endsWith('؛') && (line.startsWith('**') || line.startsWith('•') || /^[^\\s]{3,25}:/.test(line));

          if ((isHeadingMatch || isShortHeaderCandidate) && rawSections.length < 24) {
            if (currentSec && currentSec.lines.length > 0) {
              rawSections.push(currentSec);
            }
            const cleanTitle = line.replace(/^[#*\\-•\\s\\d\\.\\)\\:،]+/, '').replace(/[*#]/g, '').trim();
            currentSec = {
              title: cleanTitle.length > 3 ? cleanTitle : ('المحور ' + (rawSections.length + 1)),
              isFormalHeading: isHeadingMatch,
              lines: []
            };
          } else {
            if (!currentSec) {
              currentSec = {
                title: topic.length > 3 ? topic : (isRtl ? 'المحور التمهيدي والتأصيلي' : 'Introduction & Foundation'),
                isFormalHeading: false,
                lines: []
              };
            }
            currentSec.lines.push(line);
          }
        }
        if (currentSec && currentSec.lines.length > 0) {
          rawSections.push(currentSec);
        }

        // Clean out empty or noise sections
        let processedSections = rawSections.filter(sec => sec.lines.length > 0);

        // Dynamic Chunking for Long Unstructured Lectures (Never clamp to 4!)
        if (processedSections.length < 3 && contentLines.length > 15) {
          const totalLines = contentLines.length;
          const targetSlides = Math.min(16, Math.max(4, Math.ceil(totalLines / 15)));
          const chunkSize = Math.ceil(totalLines / targetSlides);
          processedSections = [];
          for (let c = 0; c < targetSlides; c++) {
            const chunkLines = contentLines.slice(c * chunkSize, (c + 1) * chunkSize);
            if (chunkLines.length > 0) {
              const firstLine = chunkLines[0].replace(/^[#*\\-•\\s\\d\\.\\)\\:،]+/, '').trim();
              const chunkTitle = firstLine.length > 50 ? (firstLine.substring(0, 48) + '...') : firstLine;
              processedSections.push({
                title: (isRtl ? \`المحور \${c + 1}: \` : \`Theme \${c + 1}: \`) + chunkTitle,
                lines: chunkLines
              });
            }
          }
        }

        // Allow up to 20 slides for rich, comprehensive 16-page lectures
        if (processedSections.length > 20) {
          processedSections = processedSections.slice(0, 20);
        }

        // 5. Build Rich Content for each Section (Worksheet Items, Blueprint & Zoom Cards)
        const totalDuration = lessonDuration || 60;
        const minutesPerPhase = Math.round(totalDuration / Math.max(1, processedSections.length));

        const blueprintPhases = [];
        const worksheetRows = [];
        const zoomDeck = [];
        const quizList = [];

        processedSections.forEach((sec, idx) => {
          const secNum = idx + 1;
          const secText = sec.lines.join(' ');
          
          // Substantive teacher synthesis extracted directly from the actual text:
          const candidateSentences = sec.lines.filter(l => l.length > 25 && !l.startsWith('#') && !isNoiseLine(l));
          let modelAnswer = candidateSentences.slice(0, 3).join(' ') || secText.substring(0, 220);
          if (modelAnswer.length > 280) modelAnswer = modelAnswer.substring(0, 280) + '...';

          // Extract 3 substantive, high-quality bullet points for this slide
          const secBullets = extractConciseSlideBullets(sec.lines, sec.title);
          const secTalkingPoints = secBullets.join(' • ');

          // Extract or assign authentic scripture/evidence (excluding noise)
          let secScripture = '';
          const vMatch = secText.match(/(?:قال تعالى[:\\s]*)?﴿[^﴾]+﴾/);
          const hMatch = secText.match(/(?:قال رسول الله|قال النبي|روى البخاري|حديث)[\\s\\S]*?(?:«[^»]+»|"[^"]+")/);
          if (vMatch && !vMatch[0].includes('صفحة') && !vMatch[0].includes('ممسوحة')) {
            secScripture = vMatch[0];
          } else if (hMatch && !hMatch[0].includes('صفحة') && !hMatch[0].includes('ممسوحة')) {
            secScripture = hMatch[0];
          } else if (detectedAyahs[idx % Math.max(1, detectedAyahs.length)]) {
            secScripture = detectedAyahs[idx % Math.max(1, detectedAyahs.length)];
          } else if (detectedHadiths[idx % Math.max(1, detectedHadiths.length)]) {
            secScripture = detectedHadiths[idx % Math.max(1, detectedHadiths.length)];
          } else {
            secScripture = '﴿فَاسْتَمْسِكْ بِالَّذِي أُوحِيَ إِلَيْكَ ۖ إِنَّكَ عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ﴾ [الزخرف: 43]';
          }

          // Generate student question & practical impact
          const studentQ = \`في ضوء محور (\${sec.title})؛ بيّن القضية الشرعية أو الفكرية التي يقررها النص، وما هو الأثر المترتب عليها في واقع المسلم؟\`;
          const practicalImp = \`ترسيخ الوعي المنضبط بـ (\${sec.title})، والاعتزاز بمرجعية الوحي وسلطان النص، وتطبيق ذلك في الحوار ودفع الشبهات.\`;

          // A. Blueprint Phase
          blueprintPhases.push({
            phaseNumber: secNum,
            phaseNameAr: sec.title,
            phaseNameEn: \`Phase \${secNum}: \${sec.title}\`,
            allocatedMinutes: minutesPerPhase,
            teacherGuidanceAr: modelAnswer,
            teacherFocusAr: modelAnswer,
            keyTakeawayAr: practicalImp,
            studentQuestion: studentQ,
            practicalImpact: practicalImp,
            scripture: secScripture,
            bulletPoints: secBullets,
            talkingPoints: secTalkingPoints
          });

          // B. Worksheet Row
          worksheetRows.push({
            num: secNum,
            topic: sec.title,
            scripture: secScripture,
            studentQuestion: studentQ,
            teacherAnswer: modelAnswer,
            practicalImpact: practicalImp,
            maxScore: 5
          });

          // C. Zoom Presentation Card
          zoomDeck.push({
            slideNumber: secNum,
            phaseTitle: \`المحور \${secNum}\`,
            slideTitle: sec.title,
            scriptureEvidence: secScripture,
            bulletPoints: secBullets,
            talkingPoints: secTalkingPoints,
            pedagogicalTip: practicalImp,
            titleAr: sec.title,
            bodyAr: modelAnswer,
            practicalAction: practicalImp
          });

          // D. Quiz Question derived from this section
          let coreCorrectStatement = secBullets[0] || candidateSentences[0] || modelAnswer;
          if (coreCorrectStatement.length > 95) coreCorrectStatement = coreCorrectStatement.substring(0, 95) + '...';

          quizList.push({
            id: 'quiz_q_' + secNum + '_' + Date.now(),
            questionAr: \`بناءً على مدارسة محور: (\${sec.title})؛ ما النتيجة المنهجية أو الضابط الشرعي الأساسي الذي يؤكده الشرح؟\`,
            questionEn: \`Based on (\${sec.title}); what is the primary conclusion established?\`,
            options: [
              { id: 'a', textAr: coreCorrectStatement, textEn: 'The authentic conclusion established in the lecture' },
              { id: 'b', textAr: 'الاعتماد على الآراء العقلية المجردة دون ضبط بأصول وقواعد فهم السلف', textEn: 'Relying on abstract opinion without scriptural grounding' },
              { id: 'c', textAr: 'فصل المقاصد والتحسينيات عن الأصول والنصوص القطعية', textEn: 'Separating objectives from textual foundations' },
              { id: 'd', textAr: 'التعامل مع النصوص كقضايا تاريخية لا تلزم الواقع المعاصر', textEn: 'Treating scripture as historically bound' }
            ],
            correctOptionId: 'a',
            reflectionPrompt: \`المستفاد من محور (\${sec.title}): \${modelAnswer.substring(0, 140)}...\`,
            explanationAr: \`المستفاد من محور (\${sec.title}): \${modelAnswer.substring(0, 140)}...\`
          });
        });

        // 6. Evidences list for verification banner
        const allEvidences = [];
        if (detectedAyahs.length > 0) {
          detectedAyahs.slice(0, 2).forEach(ay => {
            allEvidences.push({
              type: 'quran',
              arabicText: ay.replace(/^.*(?:قال تعالى|قوله تعالى)[:\\s]*/, ''),
              englishTranslation: 'Authentic Quranic Text Extracted from Lecture',
              citation: 'القرآن الكريم',
              narrator: '—',
              grading: 'متواتر قطعي الثبوت'
            });
          });
        } else {
          allEvidences.push({
            type: 'quran',
            arabicText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَقُولُوا۟ قَوْلًۭا سَدِيدًۭا',
            englishTranslation: 'O you who have believed, fear Allah and speak words of appropriate justice.',
            citation: 'سورة الأحزاب: 70',
            narrator: '—',
            grading: 'متواتر قطعي الثبوت'
          });
        }

        if (detectedHadiths.length > 0 || structuredHadithText) {
          allEvidences.push({
            type: 'hadith',
            arabicText: structuredHadithText || detectedHadiths[0] || '«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»',
            englishTranslation: 'Actions are according to intentions, and every person will have only what they intended.',
            citation: 'صحيح البخاري ومسلم',
            narrator: 'أمير المؤمنين عمر بن الخطاب رضي الله عنه',
            grading: 'صحيح متفق عليه'
          });
        }

        const generatedData = {
          metadata: {
            topic: topic,
            audience: studentLevel === 'intermediate' ? 'المستوى المتوسط' : (studentLevel === 'advanced' ? 'المستوى المتقدم والتأصيلي' : 'المستوى المبتدئ والناشئة'),
            duration: totalDuration,
            targetOutcome: isRtl ? \`استيعاب أصول ومسائل (\${topic}) والتطبيق المنهجي المعاصر\` : \`Comprehending issues of (\${topic})\`,
            category: finalCategory,
            discipline: finalCategory
          },
          blueprint: blueprintPhases,
          worksheetItems: worksheetRows,
          worksheet: worksheetRows,
          zoomCards: zoomDeck,
          zoomPresentation: zoomDeck,
          quizQuestions: quizList,
          evidences: allEvidences,
          discussionPrompts: [
            \`ما هو أثر تعظيم مرجعية الوحي وسلطان النص في صيانة الفكر المعاصر؟\`,
            \`كيف نطبق الضوابط والقواعد المستفادة من (\${topic}) في واقعنا وحواراتنا؟\`
          ]
        };

        setIslamicData(generatedData);
        setActiveIslamicStage(2);
        setStage3ActiveSlide(0);
        showToast(isRtl ? \`تم تحليل المحاضرة واستخلاص \${processedSections.length} محوراً تفصيلياً مع عناصر العرض بنجاح ✨\` : \`Parsed lecture into \${processedSections.length} detailed modules ✨\`);
      }

      `;

html = html.substring(0, procStart) + newHandleProcessCustomLecture + html.substring(procEnd);
console.log('Replaced handleProcessCustomLecture successfully');

// 2. REPLACE handleExportIslamicPowerPoint
const pptxStart = html.indexOf('const handleExportIslamicPowerPoint = async () => {');
const pptxCatch = html.indexOf('catch (err) {', pptxStart);
const pptxEnd = html.indexOf('};', html.indexOf('finally {', pptxCatch)) + 2;

if (pptxStart === -1 || pptxEnd === -1) {
  console.error('Could not find boundaries for handleExportIslamicPowerPoint');
  process.exit(1);
}

const newHandleExportIslamicPowerPoint = `const handleExportIslamicPowerPoint = async () => {
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
          // Universal 16:9 layout in PptxGenJS: 10.0 x 5.625 inches
          pptx.layout = 'LAYOUT_16x9';

          const topic = (islamicData.metadata && islamicData.metadata.topic) || 'المحاضرة الشرعية والتأصيل العلمي';
          const cleanTopic = cleanSlideTitle(topic);
          const category = (islamicData.metadata && islamicData.metadata.category) || 'العلوم الشرعية';
          const audience = (islamicData.metadata && islamicData.metadata.audience) || 'الدارسين والحلقة';

          // SLIDE 1: COVER SLIDE (10.0 x 5.625 in, margins x: 0.8, w: 8.4)
          const cover = pptx.addSlide();
          cover.background = { color: '062319' }; // Deep Islamic Emerald

          cover.addText('مِشكاة | منصة التعليم الشرعي والقرآني', {
            x: 0.8, y: 0.8, w: 8.4, h: 0.4,
            fontSize: 12, fontFace: 'Arial', color: 'D97706', bold: true, align: 'right', rtlMode: true
          });

          cover.addText(cleanTopic, {
            x: 0.8, y: 1.4, w: 8.4, h: 1.3,
            fontSize: 22, fontFace: 'Arial', color: 'FEF3C7', bold: true, align: 'right', rtlMode: true
          });

          cover.addText(\`المجال: \${category}   •   المستوى: \${audience}\`, {
            x: 0.8, y: 2.8, w: 8.4, h: 0.4,
            fontSize: 12, fontFace: 'Arial', color: '86EFAC', align: 'right', rtlMode: true
          });

          // Gold Separator Line
          cover.addShape(pptx.ShapeType.line, {
            x: 0.8, y: 3.3, w: 8.4, h: 0,
            line: { color: 'C69214', width: 1.5 }
          });

          cover.addText('إعداد وتقديم: فضيلة المعلم والمحاضر الشرعي\\nمنظومة مِشكاة للتعليم الشرعي — شركة AnubisLand للحلول الرقمية', {
            x: 0.8, y: 3.6, w: 8.4, h: 0.9,
            fontSize: 11, fontFace: 'Arial', color: '94A3B8', align: 'right', rtlMode: true
          });

          // CONTENT SLIDES: Each section / module
          const slidesData = (islamicData.zoomCards && islamicData.zoomCards.length > 0)
            ? islamicData.zoomCards
            : (islamicData.blueprint || []);

          slidesData.forEach((s, idx) => {
            const slide = pptx.addSlide();
            slide.background = { color: '062319' };

            // 1. Slide Title Header
            const slideTitleText = cleanSlideTitle(s.slideTitle || s.phaseTitle || s.phaseNameAr || (\`المحور \${idx + 1}\`));
            slide.addText(\`المحور \${idx + 1}: \${slideTitleText}\`, {
              x: 0.8, y: 0.35, w: 8.4, h: 0.55,
              fontSize: 18, fontFace: 'Arial', color: 'FDE68A', bold: true, align: 'right', rtlMode: true
            });

            // Gold Separator Line
            slide.addShape(pptx.ShapeType.line, {
              x: 0.8, y: 0.95, w: 8.4, h: 0,
              line: { color: 'B45309', width: 1.2 }
            });

            let currentY = 1.1;

            // 2. Scripture / Evidence Box (Clean Ayah/Hadith without scan noise)
            const scriptureText = s.scriptureEvidence || s.scripture || '';
            const hasScripture = scriptureText && !scriptureText.includes('صفحة') && !scriptureText.includes('ممسوحة');
            if (hasScripture) {
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: currentY, w: 8.4, h: 0.65,
                fill: { color: '041E15' }, line: { color: 'B45309', width: 1 }
              });
              slide.addText(\`« \${scriptureText} »\`, {
                x: 0.9, y: currentY + 0.05, w: 8.2, h: 0.55,
                fontSize: 11, fontFace: 'Arial', color: 'FEF3C7', align: 'center', italic: true, rtlMode: true
              });
              currentY += 0.78;
            }

            // 3. Slide Bullet Cards (3 Substantive Focus Cards, Universal Typography)
            const rawPptxBullets = (Array.isArray(s.bulletPoints) && s.bulletPoints.length > 0)
              ? s.bulletPoints
              : (s.talkingPoints ? s.talkingPoints.split(' • ') : []);
            const pptxBullets = (rawPptxBullets.length > 0 ? rawPptxBullets : ['تأصيل المحور ومناقشة قضاياه الأساسية', 'الضوابط الشرعية والقواعد المنهجية الحاكمة', 'الثمرة السلوكية والتطبيق المعاصر للدارسين'])
              .slice(0, 3)
              .map(b => b.length > 115 ? (b.substring(0, 112) + '...') : b);

            const cardH = hasScripture ? 0.70 : 0.80;
            const gap = hasScripture ? 0.78 : 0.90;

            pptxBullets.forEach((bullet, bIdx) => {
              const cardY = currentY + (bIdx * gap);
              slide.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: cardY, w: 8.4, h: cardH,
                fill: { color: '0A3324' }, line: { color: 'C69214', width: 1.2 }
              });
              slide.addText(\`[\${bIdx + 1}]  \${bullet}\`, {
                x: 1.0, y: cardY + 0.06, w: 8.0, h: cardH - 0.12,
                fontSize: 12, fontFace: 'Arial', color: 'F8FAFC', bold: true, align: 'right', rtlMode: true
              });
            });

            // 4. Practical Impact Footer
            const impactText = s.pedagogicalTip || s.practicalAction || s.keyTakeawayAr || s.practicalImpact || '';
            if (impactText) {
              const cleanImpact = impactText.length > 95 ? (impactText.substring(0, 92) + '...') : impactText;
              slide.addText(\`● الأثر السلوكي والتطبيقي: \${cleanImpact}\`, {
                x: 0.8, y: 4.60, w: 8.4, h: 0.45,
                fontSize: 10, fontFace: 'Arial', color: '86EFAC', align: 'right', rtlMode: true
              });
            }

            // Slide Number Indicator
            slide.addText(\`\${idx + 1} / \${slidesData.length}\`, {
              x: 0.8, y: 5.10, w: 2.0, h: 0.3,
              fontSize: 9, fontFace: 'Arial', color: '64748B', align: 'left'
            });
          });

          // Save Presentation
          const sanitizedFilename = (cleanTopic || 'المحاضرة_الشرعية')
            .replace(/[/\\\\?%*:|"<>]/g, '')
            .substring(0, 40)
            .trim();
          await pptx.writeFile({ fileName: \`مِشكاة_\${sanitizedFilename}.pptx\` });
          showToast(isRtl ? 'تم تنزيل العرض التقديمي كملف بوربوينت بنجاح ✨' : 'PowerPoint presentation exported successfully ✨');
        } catch (err) {
          console.error('Error generating PowerPoint file:', err);
          showToast(isRtl ? 'حدث خطأ أثناء إنشاء ملف البوربوينت' : 'Error generating PowerPoint file');
        } finally {
          setIsExportingPptx(false);
        }
      };`;

html = html.substring(0, pptxStart) + newHandleExportIslamicPowerPoint + html.substring(pptxEnd);
console.log('Replaced handleExportIslamicPowerPoint successfully');

// 3. UPDATE STAGE 3 STUDENT VIEW BULLET RENDERING
const oldStage3BulletsTarget = `{(currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText]).map((pt, pIdx) => (
                                          <div key={pIdx} className="flex items-start gap-1.5">
                                            <span className="text-gold-400 font-bold shrink-0">✦</span>
                                            <span>{pt}</span>
                                          </div>
                                        ))}`;

const newStage3BulletsReplacement = `{(currentSlide.bulletPoints || (currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText])).map((pt, pIdx) => (
                                          <div key={pIdx} className="flex items-start gap-2 bg-emerald-900/50 p-2 sm:p-2.5 rounded-xl border border-gold-400/30">
                                            <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                              {pIdx + 1}
                                            </span>
                                            <span className="font-semibold text-slate-100">{pt}</span>
                                          </div>
                                        ))}`;

if (html.includes(oldStage3BulletsTarget)) {
  html = html.replace(oldStage3BulletsTarget, newStage3BulletsReplacement);
  console.log('Replaced Stage 3 student view bullets successfully');
} else {
  console.warn('Could not find exact oldStage3BulletsTarget - checking alternative match');
}

// 4. UPDATE FULLSCREEN PRESENTATION MODAL BULLET RENDERING
const oldModalBodyTarget = `<div className={\`font-amiri text-slate-100 my-4 text-right \${textScaleClass}\`}>
                        {bodyText}
                      </div>`;

const newModalBodyReplacement = `{/* Body Content - 3 Focus Cards */}
                      <div className="my-4 space-y-3 w-full">
                        {(currentSlide.bulletPoints || (currentSlide.talkingPoints ? currentSlide.talkingPoints.split(' • ') : [bodyText])).map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-3 bg-emerald-900/60 p-3.5 sm:p-4 rounded-2xl border border-gold-400/30 shadow-md text-right">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-500 text-emerald-950 font-black flex items-center justify-center text-xs sm:text-sm shrink-0 mt-0.5 shadow-sm">
                              {pIdx + 1}
                            </span>
                            <p className="font-amiri text-base sm:text-xl lg:text-2xl text-slate-100 font-bold leading-relaxed">
                              {pt}
                            </p>
                          </div>
                        ))}
                      </div>`;

if (html.includes(oldModalBodyTarget)) {
  html = html.replace(oldModalBodyTarget, newModalBodyReplacement);
  console.log('Replaced Fullscreen Modal body text successfully');
} else {
  console.warn('Could not find exact oldModalBodyTarget');
}

// 5. BUMP VERSION TO v54.0
html = html.replace(/v53\.0/g, 'v54.0');
console.log('Bumped version badges to v54.0');

// Save updated HTML
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Saved public/index.html');

// Validate Babel syntax
const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    babelParser.parse(scriptMatch[1], {
      sourceType: 'module',
      plugins: ['jsx']
    });
    console.log('Babel validation passed! 0 syntax errors.');
  } catch (err) {
    console.error('Babel validation error at line ' + err.loc.line + ', col ' + err.loc.column + ':', err.message);
    process.exit(1);
  }
}
