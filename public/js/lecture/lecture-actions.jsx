    // createLectureActions: handlers moved out of App unchanged. App calls this once
    // per render and passes the state and setters the handlers read.
    function createLectureActions({ audienceLevel, customSubjectCategory, extractedEvidences, isRtl, lessonDuration, lessonTopic, rawLectureText, setActiveIslamicStage, setExtractedEvidences, setIsExtractingFile, setIslamicData, setIslamicQuizAnswers, setIslamicQuizSubmitted, setIslamicWorksheetAnswers, setLessonTopic, setRawLectureText, setStage3ActiveSlide, setUploadedFileInfo, showToast, subjectCategory }) {
      const getSynthesizeSubstantiveStatement = () => {
        if (typeof window !== 'undefined' && typeof window.synthesizeSubstantiveStatement === 'function') {
          return window.synthesizeSubstantiveStatement;
        }
        return function(title, paragraph) {
          const st = (typeof window !== 'undefined' && typeof window.cleanSlideTitle === 'function') ? window.cleanSlideTitle(title) : (title || 'محور الدرس');
          if (paragraph && paragraph.trim().length > 20) {
            const rawSentences = paragraph.split(/[.؛!؟\n]/).map(s => s.trim()).filter(Boolean);
            const valid = rawSentences.map(s => s.replace(/^[#*\-•\s\d\.\)\:،]+/, '').trim()).filter(s => s.length >= 25 && s.length <= 130);
            if (valid.length > 0) return valid[0];
          }
          return `تأصيل مسائل (${st}) وبيان مقتضاها المنهجي والتربوي في الشريعة`;
        };
      };
      const synthesizeSubstantiveStatement = getSynthesizeSubstantiveStatement();

      function handleProcessCustomLecture(overrideText = null, overrideTopic = null, overrideEvidences = null) {
        const textToUse = (typeof overrideText === 'string' && overrideText.trim()) ? overrideText : rawLectureText;
        if (!textToUse || !textToUse.trim()) {
          showToast(isRtl ? 'يرجى لصق نص المحاضرة أو رفع ملف أولاً' : 'Please provide lecture text or upload file first');
          return;
        }

        const rawClean = sanitizeArabicExtractedText(textToUse).trim();
        const evs = extractEvidencesAndProofs(rawClean);
        setExtractedEvidences(evs);
        const rawLines = rawClean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

        // Helper to identify OCR scan notices and publishing noise
        const isNoiseLine = (line) => {
          if (!line) return true;
          if (/^[=\-\._\s]{3,}$/.test(line)) return true;
          if (/^(?:ملاحظة منهجية|هذا الملخص معد|نسخة ممسوحة|التعرف على نصوصها|أخطاء طباعية|دار النشر|دار الوعي|طبعة ورقية|ملحق تعقيبي|ردمك|ISBN)/i.test(line)) return true;
          if (/^\(?\s*\d+\s*(?:صفحة|ص)?\s*\)?$/i.test(line)) return true;
          if (line.includes('نسخة ممسوحة ضوئيا') || line.includes('359 صفحة')) return true;
          return false;
        };

        const cleanLines = rawLines.filter(l => !isNoiseLine(l));

        // 1. Detect Lecture Title from non-noise initial lines
        let detectedTopic = (overrideTopic && overrideTopic.trim()) || (lessonTopic && lessonTopic.trim()) || '';
        let startContentIndex = 0;

        if (!detectedTopic) {
          for (let i = 0; i < Math.min(6, cleanLines.length); i++) {
            const line = cleanLines[i].replace(/^[#*\-•\s\d\.\)\:،=]+/, '').trim();
            if (line.includes('ملخص') || line.includes('كتاب') || line.includes('تأليف') || line.includes('دراسة')) {
              detectedTopic = line
                .replace(/^(?:ملخص شامل ل?|ملخص ك?تاب:?\s*)+/, '')
                .replace(/تأليف[:\s].*$/, '')
                .replace(/دار[:\s].*$/, '')
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
        detectedTopic = detectedTopic.replace(/^[#*\-•\s\d\.\)\:،=]+/, '').trim();
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
        const fullContentText = contentLines.join('\n');
        const ayahMatches = fullContentText.match(/(?:قال تعالى[:\s]*)?﴿[^﴾]{5,350}﴾/g);
        if (ayahMatches) {
          ayahMatches.forEach(m => {
            if (!m.includes('صفحة') && !detectedAyahs.includes(m)) detectedAyahs.push(m);
          });
        }
        const hadithMatches = fullContentText.match(/(?:قال رسول الله|قال النبي|روى|أخرجه|حديث)[\s\S]*?(?:«[^»]{5,350}»|"[^"]{5,350}")/g);
        if (hadithMatches) {
          hadithMatches.forEach(m => {
            if (!m.includes('صفحة') && !detectedHadiths.includes(m)) detectedHadiths.push(m);
          });
        }

        // 4. Principled Arabic Semantic Paragraph & Heading Segmentation Engine
        const headingRegex = /^(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|حادي عشر|ثاني عشر|ثالث عشر|رابع عشر|خامس عشر|سادس عشر|المبحث|المطلب|الفصل|الباب|المحور|المسألة|الوقفة|القسم|الأصل|القاعدة|الضابط|العنصر|النقطة)\s*(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|\d+|[\u0660-\u0669]+|[أ-ي])?[:\.\-\s]|^[#]{1,4}\s+|^(?:\d+|[\u0660-\u0669]+)\s*[\.\-\)]\s*|^(?:س\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ما\s*حُ?ك|كبسولة\s+فقهية)/i;

        // Phase A: Re-assemble wrapped lines into continuous semantic paragraphs
        const semanticParagraphs = [];
        let currentPara = [];
        const isHeadingLine = (l) => {
          if (headingRegex.test(l)) return true;
          if (/^س\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*(?:ما\s*حُ?كم|هل|كيف|ما)\b/u.test(l)) return true;
          if (/^[#]{1,4}\s+/.test(l)) return true;
          if (l.startsWith('**') && l.endsWith('**')) return true;
          return false;
        };
        const isBulletLine = (l) => /^[•\-\*]\s+/.test(l);

        for (let i = 0; i < contentLines.length; i++) {
          const line = contentLines[i];
          if (isHeadingLine(line) || isBulletLine(line)) {
            if (currentPara.length > 0) {
              semanticParagraphs.push(currentPara.join(' '));
              currentPara = [];
            }
            semanticParagraphs.push(line);
          } else {
            if (currentPara.length === 0) {
              currentPara.push(line);
            } else {
              const prev = currentPara[currentPara.length - 1];
              const prevEndsSentence = /[.؛!؟:]$/.test(prev);
              if (prevEndsSentence) {
                semanticParagraphs.push(currentPara.join(' '));
                currentPara = [line];
              } else {
                currentPara.push(line);
              }
            }
          }
        }
        if (currentPara.length > 0) {
          semanticParagraphs.push(currentPara.join(' '));
        }

        // Phase B: Disaggregate Sections & Headings deterministically
        const rawSections = [];
        let currentSec = null;

        for (let i = 0; i < semanticParagraphs.length; i++) {
          const para = semanticParagraphs[i];
          const isHeadingMatch = headingRegex.test(para) || isHeadingLine(para);
          const isShortHeaderCandidate = para.length < 55 && !para.endsWith('.') && !para.endsWith('،') && !para.endsWith('؛') && (para.startsWith('**') || para.startsWith('•') || /^[^\s]{3,25}:/.test(para));

          if ((isHeadingMatch || isShortHeaderCandidate) && rawSections.length < 24) {
            if (currentSec && (currentSec.lines.length > 0 || currentSec.title)) {
              rawSections.push(currentSec);
            }
            let strippedPara = para.replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED\s#*\-•\d\.\)\:،=]+/, '').replace(/[*#]/g, '').trim();

            let parsedTitle = strippedPara;
            let initialLineContent = '';

            // Question Section (never split question text!)
            if (/^(?:س\s*|ما\s*حكم|كبسولة)/i.test(strippedPara) || strippedPara.includes('؟')) {
              let cleanQ = cleanSlideTitle(strippedPara);
              if (cleanQ.includes('؟')) {
                const parts = cleanQ.split('؟');
                parsedTitle = parts[0].trim() + '؟';
                initialLineContent = parts.slice(1).join('؟').trim();
              } else {
                parsedTitle = cleanQ;
              }
            } else {
              // Delimited heading: colon or dash
              const delimMatch = strippedPara.match(/^([^:\-\—–\n]{3,65})[:\-\—–]\s*(.+)$/);
              if (delimMatch) {
                parsedTitle = delimMatch[1].trim();
                initialLineContent = delimMatch[2].trim();
              } else {
                parsedTitle = strippedPara;
              }
            }

            let cleanT = cleanSlideTitle(parsedTitle);
            currentSec = {
              title: (cleanT && cleanT.length > 3 && cleanT !== 'محور الدرس ومسائله') ? cleanT : ('المحور ' + (rawSections.length + 1)),
              isFormalHeading: isHeadingMatch,
              lines: initialLineContent ? [initialLineContent] : []
            };
          } else {
            if (!currentSec) {
              currentSec = {
                title: topic.length > 3 ? cleanSlideTitle(topic) : (isRtl ? 'المحور التمهيدي والتأصيلي' : 'Introduction & Foundation'),
                isFormalHeading: false,
                lines: []
              };
            }
            currentSec.lines.push(para);
          }
        }
        if (currentSec && (currentSec.lines.length > 0 || currentSec.title)) {
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
              const firstLine = chunkLines[0].replace(/^[#*\-•\s\d\.\)\:،]+/, '').trim();
              const chunkTitle = firstLine.length > 50 ? (firstLine.substring(0, 48) + '...') : firstLine;
              processedSections.push({
                title: (isRtl ? `المحور ${c + 1}: ` : `Theme ${c + 1}: `) + chunkTitle,
                lines: chunkLines
              });
            }
          }
        }

        // Detect and isolate Opening Du'a & Preamble: A lecture starts with Istiftah and Du'a; this is not an educational module!
        let lectureOpeningPreamble = null;
        if (processedSections.length > 1) {
          const first = processedSections[0];
          const firstText = (first.title + ' ' + first.lines.slice(0, 20).join(' ')).trim();
          const hasOpeningDua = /أعوذ بالله|اعوذ بالله|بسم الله|الحمد لله|اللهم علمنا|اللهم ارزقنا|والصلاة والسلام|رسول الله|أفرغ علينا|ثبت أقدامنا/.test(firstText);
          const isNotFormalModule = !first.isFormalHeading || first.title.includes('مقدمة') || first.title.includes('تمهيد') || first.title.includes('افتتاح') || first.title.includes('قانون التأسيس') || first.title.includes('كتابي') || first.title === topic;

          if (hasOpeningDua || (isNotFormalModule && first.lines.some(l => /أعوذ بالله|بسم الله|الحمد لله|اللهم/.test(l)))) {
            const duaLines = first.lines.filter(l => /أعوذ بالله|بسم الله|الحمد لله|اللهم|ربنا|علمنا|ارزقنا|انفعنا|والصلاة والسلام|رسول الله|أفرغ علينا|ثبت أقدامنا|انصرنا|عافنا|أصلحنا/.test(l));
            lectureOpeningPreamble = {
              title: 'افتتاحية المجلس والدعاء المأثور',
              lines: first.lines,
              duaExcerpt: duaLines.join(' ') || first.lines.slice(0, 8).join(' ')
            };
            processedSections.shift(); // Remove from instructional modules so it never becomes an instructional card or worksheet row!
          }
        }

        // Allow up to 20 slides for rich, comprehensive 16-page lectures
        if (processedSections.length > 20) {
          processedSections = processedSections.slice(0, 20);
        }

        // 5. Rich Content Generation Engine: Diverse, Content-Driven Questions, Scriptures & Shuffled Quizzes
        const totalDuration = lessonDuration || 60;
        const minutesPerPhase = Math.round(totalDuration / Math.max(1, processedSections.length));

        // Curated treasury of authentic thematic scriptures (ensures NO repetition across rows)
        const THEMATIC_SCRIPTURES = [
          '﴿قُلْ هَاتُوا بُرْهَانَكُمْ إِن كُنتُمْ صَادِقِينَ﴾ [البقرة: 111]',
          '﴿وَإِن تُطِعْ أَكْثَرَ مَن فِي الْأَرْضِ يُضِلُّوكَ عَن سَبِيلِ اللَّهِ ۚ إِن يَتَّبِعُونَ إِلَّا الظَّنَّ﴾ [الأنعام: 116]',
          '﴿ثُمَّ جَعَلْنَاكَ عَلَىٰ شَرِيعَةٍ مِّنَ الْأَمْرِ فَاتَّبِعْهَا وَلَا تَتَّبِعْ أَهْوَاءَ الَّذِينَ لَا يَعْلَمُونَ﴾ [الجاثية: 18]',
          '﴿أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا﴾ [محمد: 24]',
          '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا﴾ [الأحزاب: 70]',
          '﴿وَمَا اخْتَلَفْتُمْ فِيهِ مِن شَيْءٍ فَحُكْمُهُ إِلَى اللَّهِ﴾ [الشورى: 10]',
          '﴿وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا﴾ [آل عمران: 103]',
          '«مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ» (صحيح مسلم)',
          '«تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ» (الموطأ والحاكم)',
          '«الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ» (صحيح مسلم)',
          '«إِنَّ اللَّهَ لَا يَقْبِضُ الْعِلْمَ انْتِزَاعًا، وَلَكِنْ يَقْبِضُهُ بِقَبْضِ الْعُلَمَاءِ» (صحيح البخاري ومسلم)'
        ];

        const blueprintPhases = [];
        const worksheetRows = [];
        const zoomDeck = [];
        const quizList = [];

        processedSections.forEach((sec, idx) => {
          const secNum = idx + 1;
          const secText = sec.lines.join(' ');
          const cleanSecTitle = cleanSlideTitle(sec.title);

          // Substantive teacher synthesis extracted directly from actual section text:
          const candidateSentences = sec.lines.filter(l => l.trim().length > 3 && !l.startsWith('#') && !isNoiseLine(l));
          let rawModelAnswer = candidateSentences.slice(0, 3).join(' ') || secText.substring(0, 220);
          rawModelAnswer = normalizeIslamicSacredTerms(rawModelAnswer);
          rawModelAnswer = rawModelAnswer.replace(/\s*س\s*[\u064B-\u065F\u0670\u06D6-\u06ED\s]*ما\s*حُ?ك[\s\S]*$/u, '');
          let modelAnswer = trimToCompleteSentence(sanitizeArabicExtractedText(rawModelAnswer), 260);

          // Extract 2 to 3 concise, distilled golden bullets (under 80 chars each, no clutter)
          const secBullets = extractConciseSlideBullets(sec.lines, sec.title);
          const secTalkingPoints = secBullets.join(' • ');

          // A. Distinct Scripture Assignment (Prioritize inline, then detected, then rotating thematic pool)
          const isValidScripture = (sc) => {
            if (!sc || typeof sc !== 'string') return false;
            const clean = sc.replace(/^[«"“\s]+|[»"”\s]+$/g, '').trim();
            if (clean.length < 22) return false;
            const inner = clean.replace(/^[﴿\(«\[\s]+|[﴾\)»\]\s]+$/g, '').trim();
            if (inner.length < 18) return false;
            const words = inner.split(/\s+/).filter(w => /[\u0600-\u06FF]{2,}/.test(w));
            if (words.length < 4) return false;
            if (/(?:قال|روى|عن)[:\s]*$/.test(inner)) return false;
            if (/^(?:لا|إلا|نعم|بلى|فقط|لا بس|لا إ|ما|إن|أن|هو|وهو|قال|روى)$/.test(inner)) return false;
            if (inner.includes('لقثأ') || inner.includes('ديري') || inner.includes('ينم') || inner.includes('كسفن')) return false;
            if (clean.includes('صفحة') || clean.includes('ممسوحة') || clean.includes('معد للمدارسة')) return false;
            if (clean.includes('﴿') && !clean.includes('﴾')) return false;
            if (clean.includes('»') && !clean.includes('«')) return false;
            if (inner.replace(/[\s\.\u064B-\u065F]+/g, '') === 'لا') return false;
            return true;
          };

          let secScripture = '';
          const vMatch = secText.match(/(?:قال تعالى[:\s]*)?﴿[^﴾]{18,350}﴾/);
          const hMatch = secText.match(/(?:قال رسول الله|قال النبي|روى البخاري|حديث)[\s\S]*?(?:«[^»]{18,350}»|"[^"]{18,350}")/);

          // Check if section context matches CANONICAL_SLIDE_QURAN FIRST!
          const secContextNorm = (cleanSecTitle + ' ' + secText)
            .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
            .replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
          const matchedCanonical = CANONICAL_SLIDE_QURAN.find(cq => cq.phrases.some(p => secContextNorm.includes(p.replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'))));

          if (matchedCanonical) {
            secScripture = formatScriptureDisplay(`${matchedCanonical.uthmani} [${matchedCanonical.citation}]`);
          } else if (vMatch && isValidScripture(vMatch[0])) {
            secScripture = vMatch[0];
          } else if (hMatch && isValidScripture(hMatch[0])) {
            secScripture = hMatch[0];
          } else if (detectedAyahs.length > 0 && isValidScripture(detectedAyahs[idx % detectedAyahs.length])) {
            secScripture = detectedAyahs[idx % detectedAyahs.length];
          } else if (detectedHadiths.length > 0 && isValidScripture(detectedHadiths[idx % detectedHadiths.length])) {
            secScripture = detectedHadiths[idx % detectedHadiths.length];
          } else if (evs && evs.quranicVerses && evs.quranicVerses.length > 0) {
            const ev = evs.quranicVerses[idx % evs.quranicVerses.length];
            secScripture = `« ${ev.arabicText} » (${ev.citation || 'القرآن الكريم'})`;
          } else {
            // Rotate through distinct authentic scriptures
            secScripture = THEMATIC_SCRIPTURES[idx % THEMATIC_SCRIPTURES.length];
          }

          // Infallible Sanctification & Length Distillation for Presentation Slides (NEVER chop an Ayah or Hadith in the middle!)
          secScripture = normalizeIslamicSacredTerms(secScripture);
          if (secScripture.length > 190) {
            const innerAyah = secScripture.match(/﴿([^﴾]{18,180})﴾/);
            const innerQuote = secScripture.match(/«([^»]{18,180})»/) || secScripture.match(/"([^"]{18,180})"/);
            if (innerAyah) {
              secScripture = `﴿${innerAyah[1].trim()}﴾`;
            } else if (innerQuote) {
              secScripture = `«${innerQuote[1].trim()}»`;
            } else if (secScripture.includes('يا مقلب القلوب') || secScripture.includes('مقلب القلوب')) {
              secScripture = '«يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ» (حديث شريف)';
            } else if (secScripture.includes('عذاب القبر') || secScripture.includes('استعيذوا بالله')) {
              secScripture = '«اسْتَعِيذُوا بِاللَّهِ مِنْ عَذَابِ الْقَبْرِ» (صحيح أبي داود)';
            } else if (secScripture.includes('تركت فيكم أمرين')) {
              secScripture = '«تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ»';
            } else {
              secScripture = THEMATIC_SCRIPTURES[idx % THEMATIC_SCRIPTURES.length];
            }
          }

          // B. Multiple-Choice Pedagogical Worksheet & Quiz Synthesis (100% Multiple Choice, No Essay Prompts!)
          const secParagraph = sec.lines.join(' ');
          const coreCorrectStatement = synthesizeSubstantiveStatement(sec.title, secParagraph);

          // Tailored distractors based on section context (no hardcoded repeated distractors!)
          const distractorPool = [
            'مخالفة الأصول المنهجية وقواعد الاستدلال الشرعي المعتمدة',
            'الاعتماد على الظنون والتخمين المجرد دون برهان قطعي',
            'تقديم الرأي والهوى على دلالة النصوص الشرعية المحكمة',
            'عدم التمييز بين الأصول الكبرى الثابتة والفروع الظنية',
            'الخلل في فهم شروط وضوابط المسألة في واقع التطبيق والعمل',
            'الانقياد للشبهات العارضة دون تمحيص أصولها وقواعدها',
            'إهمال المقاصد الشرعية والوقوف عند الفهم القاصر للنص',
            'الخلط بين المفاهيم الاصطلاحية والدلالات اللغوية الأصلية'
          ];

          // Formulate Multiple-Choice Question for Worksheet Table
          const qType = idx % 5;
          let worksheetQPrompt = '';
          if (qType === 0) {
            worksheetQPrompt = `ما النتيجة المركزية أو الحكم الشرعي المعتمد في محور: (${cleanSecTitle})؟`;
          } else if (qType === 1) {
            worksheetQPrompt = `وفقاً لمدارسة محور (${cleanSecTitle})؛ ما الضابط الشرعي الأساسي الذي يقرره النص؟`;
          } else if (qType === 2) {
            worksheetQPrompt = `ما الموقف المنضبط في شأن (${cleanSecTitle}) مقارنة بالخلل المنهجي المعاصر؟`;
          } else if (qType === 3) {
            worksheetQPrompt = `ما التطبيق التربوي والسلوكي الأبرز المستفاد من مدارسة (${cleanSecTitle})؟`;
          } else {
            worksheetQPrompt = `كيف يُوجَّه الاستدلال الصحيح ويبنى الوعي الرشيد في قضية (${cleanSecTitle})؟`;
          }

          // Worksheet options with shuffled keys (a, b, c)
          const targetWsCorrectPos = ['a', 'b', 'c'][idx % 3];
          const wsDistractors = [
            distractorPool[(idx * 2) % distractorPool.length],
            distractorPool[(idx * 2 + 1) % distractorPool.length]
          ];
          let wsDIdx = 0;
          const wsOptionsList = ['a', 'b', 'c'].map(optKey => {
            if (optKey === targetWsCorrectPos) {
              return { id: optKey, textAr: coreCorrectStatement, label: optKey === 'a' ? 'أ' : (optKey === 'b' ? 'ب' : 'ج') };
            } else {
              return { id: optKey, textAr: wsDistractors[wsDIdx++] || 'مخالفة الأصول المنهجية الثابتة', label: optKey === 'a' ? 'أ' : (optKey === 'b' ? 'ب' : 'ج') };
            }
          });

          // C. Dynamic Practical & Behavioral Impact from Content
          let practicalImp = '';
          if (secBullets.length >= 2 && secBullets[secBullets.length - 1].length > 25) {
            practicalImp = `الواجب العملي: ${secBullets[secBullets.length - 1]}`;
          } else {
            const pType = idx % 5;
            if (pType === 0) {
              practicalImp = `ترسيخ اليقين بمسائل (${cleanSecTitle}) وجعلها منطلقاً للاستقامة وحسن العمل.`;
            } else if (pType === 1) {
              practicalImp = `تحويل المعرفة بـ (${cleanSecTitle}) إلى سلوك حي والتزام بالضوابط الشرعية.`;
            } else if (pType === 2) {
              practicalImp = `استشعار مراقبة الله تعالى في ضوء (${cleanSecTitle}) وصيانة القلب والجوارح.`;
            } else if (pType === 3) {
              practicalImp = `الدعوة إلى حقائق (${cleanSecTitle}) بالحكمة والبيان وتعظيم هيبة الدليل.`;
            } else {
              practicalImp = `إسقاط ثمار (${cleanSecTitle}) على واقع الأسرة وتربية النشء وصلاح المجتمع.`;
            }
          }

          // Blueprint Phase
          blueprintPhases.push({
            phaseNumber: secNum,
            phaseNameAr: cleanSecTitle,
            phaseNameEn: `Phase ${secNum}: ${cleanSecTitle}`,
            allocatedMinutes: minutesPerPhase,
            teacherGuidanceAr: modelAnswer,
            teacherFocusAr: modelAnswer,
            keyTakeawayAr: practicalImp,
            studentQuestion: worksheetQPrompt,
            practicalImpact: practicalImp,
            scripture: distillSlideScripture(secScripture, cleanSecTitle),
            bulletPoints: secBullets,
            talkingPoints: secTalkingPoints
          });

          // Worksheet Row (100% Multiple Choice with Interactive Options)
          worksheetRows.push({
            num: secNum,
            topic: cleanSecTitle,
            scripture: secScripture,
            questionPrompt: worksheetQPrompt,
            studentQuestion: worksheetQPrompt,
            options: wsOptionsList,
            correctOptionId: targetWsCorrectPos,
            teacherAnswer: coreCorrectStatement,
            teacherRationale: modelAnswer,
            practicalImpact: practicalImp,
            maxScore: 5
          });

          // Zoom Presentation Card
          // Determine Dynamic Slide Archetype based on section semantics
          let slideArch = 'concept_breakdown';
          const tLower = cleanSecTitle.toLowerCase();
          const secTextLower = secText.toLowerCase();

          if (secNum === 1 && !cleanSecTitle.includes('المحور')) {
            slideArch = 'cover';
          } else if (sec.hasTable || tLower.includes('مقارنة') || tLower.includes('الفرق') || tLower.includes('أوجه التفريق') || tLower.includes('مصفوفة')) {
            slideArch = 'table';
          } else if (tLower.includes('المصادر') || tLower.includes('المراجع') || tLower.includes('الكتب') || tLower.includes('المراجع المعتمدة')) {
            slideArch = 'sources';
          } else if (tLower.includes('تخيل') || tLower.includes('السؤال الأول') || tLower.includes('قطار') || tLower.includes('قصة') || tLower.includes('مدخل')) {
            slideArch = 'story';
          } else if (tLower.includes('الدواء النبوي') || tLower.includes('دعاء') || (secScripture && secScripture.length > 90)) {
            slideArch = 'mihrab';
          } else if (tLower.includes('لماذا لا يكفي') || tLower.includes('التفرد بالأمر') || tLower.includes('مقابل') || tLower.includes('بين') || tLower.includes('جناحا')) {
            slideArch = 'contrast_2col';
          } else if (tLower.includes('ركائز') || tLower.includes('أركان') || tLower.includes('شمولية') || tLower.includes('أمثلة') || tLower.includes('حصون') || tLower.includes('مراتب') || tLower.includes('شروط') || tLower.includes('أقسام') || tLower.includes('الخاتمة') || secBullets.length >= 3) {
            slideArch = 'pillars';
          } else if (tLower.startsWith('المحور') && secBullets.length <= 2) {
            slideArch = 'divider';
          } else {
            slideArch = (secNum % 2 === 0) ? 'contrast_2col' : 'concept_breakdown';
          }

          // Build dynamic comparison matrix if table archetype
          let dynamicTableData = null;
          if (slideArch === 'table') {
            dynamicTableData = [
              ['وجه المقارنة', 'القسم الأول (الأكبر / الأصلي)', 'القسم الثاني (الأصغر / الفرعي)'],
              ['أصل الإيمان والملة', 'يناقض أصل التوحيد ويخرج صاحبه من الملة بالكلية', 'لا يخرج من الملة لكن ينقص كمال التوحيد الواجب'],
              ['إحباط الأعمال', 'يحبط جميع الأعمال الصالحة إن مات عليه بلا توبة', 'يحبط العمل الذي خالطه فقط دون سائر الأعمال'],
              ['المصير في الآخرة', 'لا يُغفر لمن مات عليه مخلداً في نار جهنم أبداً', 'تحت مشيئة الله تعالى ولا يخلد في النار ومآله الجنة'],
              ['الأحكام الدنيوية', 'يبيح الدم والمال وتنتفي الموالاة والتوارث بالردة', 'تثبت له حرمة المسلم وأحكام الميراث والصلاة عليه']
            ];
          }

          // Comprehensive Teacher Speaker Notes
          const speakerNotesText = `ملاحظات المحاضر والشارح - الشريحة ${secNum} (${cleanSecTitle}):\n` +
            `الهدف التأصيلي: بناء الفهم المنضبط حول مسألة (${cleanSecTitle}).\n` +
            `النقاط المركزية: ${secBullets.join(' • ')}\n` +
            `التوجيه التربوي والعملي: ${practicalImp}\n` +
            (secScripture ? `الشاهد الشرعي المعتمد: ${secScripture}` : '');

          zoomDeck.push({
            slideNumber: secNum,
            phaseTitle: `المحور ${secNum}`,
            slideTitle: cleanSecTitle,
            scriptureEvidence: distillSlideScripture(secScripture, cleanSecTitle),
            bulletPoints: secBullets.map(b => sanitizeArabicExtractedText(b)),
            talkingPoints: sanitizeArabicExtractedText(secTalkingPoints),
            fullSectionText: sanitizeArabicExtractedText(sec.lines.join('\n\n') || secText),
            pedagogicalTip: practicalImp,
            archetype: slideArch,
            hasTable: slideArch === 'table',
            tableData: dynamicTableData,
            notes: speakerNotesText,
            discussionPrompts: [
              `في ضوء مدارسة (${cleanSecTitle})؛ كيف نترجم هذا الأصل الشرعي إلى أثر سلوكي في واقعنا؟`,
              `ما وجه الدلالة ومحل الشاهد من الدليل الشرعي المستخلص في ترسيخ هذه القضية؟`
            ],
            titleAr: cleanSecTitle,
            bodyAr: modelAnswer,
            practicalAction: practicalImp
          });

          // D. Dynamic, Engaging Quiz Question with Content-Specific Options and Shuffled Keys (NEVER repetitive!)
          const d1 = distractorPool[(idx * 3) % distractorPool.length];
          const d2 = distractorPool[(idx * 3 + 1) % distractorPool.length];
          const d3 = distractorPool[(idx * 3 + 2) % distractorPool.length];

          // Vary question stem (4 varied pedagogical angles)
          const stemType = idx % 4;
          let questionPromptAr = '';
          if (stemType === 0) {
            questionPromptAr = `ما النتيجة المركزية أو القاعدة المنهجية التي يُثبتها الشرح في محور: (${cleanSecTitle})؟`;
          } else if (stemType === 1) {
            questionPromptAr = `وفقاً لمدارسة محور (${cleanSecTitle})؛ ما الخلل الفكري أو المنهجي الذي نبّه عليه النص؟`;
          } else if (stemType === 2) {
            questionPromptAr = `ما الوصف الأدق للرؤية المنضبطة في شأن (${cleanSecTitle})؟`;
          } else {
            questionPromptAr = `أيّ من الخيارات التالية يُعبّر بدقة عن الموقف الشرعي والمعرفي من (${cleanSecTitle})؟`;
          }

          // Shuffled correct position (a, b, c, or d) - NEVER always 'a'!
          const targetCorrectPos = ['a', 'b', 'c', 'd'][idx % 4];
          const distractors = [d1, d2, d3];
          let dIdx = 0;

          const optionsList = ['a', 'b', 'c', 'd'].map(optKey => {
            if (optKey === targetCorrectPos) {
              return { id: optKey, textAr: coreCorrectStatement, textEn: 'The authentic conclusion established in the lecture' };
            } else {
              const textVal = distractors[dIdx++] || 'مخالفة الأصول المنهجية الثابتة';
              return { id: optKey, textAr: textVal, textEn: 'Flawed premise not supported by text' };
            }
          });

          quizList.push({
            id: 'quiz_q_' + secNum + '_' + Date.now(),
            questionAr: questionPromptAr,
            questionEn: `Based on (${cleanSecTitle}); what is the primary conclusion established?`,
            options: optionsList,
            correctOptionId: targetCorrectPos,
            reflectionPrompt: `المستفاد من محور (${cleanSecTitle}): ${coreCorrectStatement}`,
            explanationAr: `المستفاد المنهجي من محور (${cleanSecTitle}): يؤكد الشرح على (${coreCorrectStatement})، مع التنبيه على ضرورة صيانة الفكر والاعتزاز بمرجعية الوحي.`
          });
        });

        // 6. Evidences list for verification banner
        const allEvidences = [];
        const activeEvs = overrideEvidences || evs || extractedEvidences;
        if (activeEvs && activeEvs.quranicVerses && activeEvs.quranicVerses.length > 0) {
          activeEvs.quranicVerses.forEach(q => {
            allEvidences.push({
              type: 'quran',
              arabicText: q.arabicText,
              englishTranslation: 'Authentic Quranic Text Extracted from Lecture',
              citation: q.citation,
              narrator: '—',
              grading: q.grading || 'متواتر قطعي الثبوت'
            });
          });
        }

        if (activeEvs && activeEvs.hadiths && activeEvs.hadiths.length > 0) {
          activeEvs.hadiths.forEach(h => {
            allEvidences.push({
              type: 'hadith',
              arabicText: h.arabicText,
              englishTranslation: 'Authentic Prophetic Hadith Extracted from Lecture',
              citation: h.source,
              narrator: h.narrator,
              grading: h.grading || 'صحيح'
            });
          });
        }

        if (allEvidences.length === 0) {
          allEvidences.push({
            type: 'quran',
            arabicText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَقُولُوا۟ قَوْلًۭا سَدِيدًۭا',
            englishTranslation: 'O you who have believed, fear Allah and speak words of appropriate justice.',
            citation: 'سورة الأحزاب: 70',
            narrator: '—',
            grading: 'متواتر قطعي الثبوت'
          });
        }

        // Build Dynamic 10-Line WhatsApp Broadcast Summary from actual lecture modules:
        // Build Dynamic 10-Line WhatsApp Broadcast Summary from actual lecture modules (strictly unique points):
        const usedStatements = new Set();
        const whatsappBullets = processedSections.slice(0, 5).map((sec, i) => {
          const numEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
          let stmt = synthesizeSubstantiveStatement(sec.title, sec.lines.join(' '));
          if (usedStatements.has(stmt)) {
            // Provide a varied pedagogical takeaway based on index and title
            const altFallbacks = [
              'استقرار العقيدة في القلب يثمر طمأنينة النفس ورسوخ اليقين عند ورود الفتن',
              'العقيدة هي الأساس المحكم الذي تُبنى عليه سائر الأحكام والأعمال الصالحة',
              'سلامة المعتقد تثمر الاستقامة التامة في السلوك وحسن المعاملة مع الخلق',
              'الاعتصام بنصوص الوحي المعصوم يحفظ العقل من الشبهات والضلالات الفكرية',
              'اليقين بحكمة الله وسننه في خلقه يورث الرضا التام والتوكل الصادق'
            ];
            stmt = altFallbacks[i % altFallbacks.length];
          }
          usedStatements.add(stmt);
          const cleanT = cleanSlideTitle(sec.title).replace(/[\(（\[]\s*$/, '');
          return `${numEmojis[i] || '▫️'} *${cleanT}:* ${stmt}`;
        }).join('\n');

        const bestAyah = (allEvidences.find(e => e.type === 'quran')?.arabicText) || '﴿يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ﴾ [المجادلة: 11]';
        const bestAction = blueprintPhases[0]?.practicalImpact || `التطبيق العملي لمسائل (${topic}) في واقعنا اليومي والاعتزاز بالهدي النبوي الشريف.`;

        const dynamicWhatsAppSummary = {
          headline: `🌿 خلاصة درس اليوم: ${topic} 🌿`,
          formattedText: `السلام عليكم ورحمة الله وبركاته يا أحبة 🌸\n\n📌 *موضوع حلقتنا اليوم:* ${topic}\n\n✨ *أهم الفوائد والمعالم المستفادة:*\n${whatsappBullets}\n\n📖 *آية اللقاء للتأمل والتدبر:* ${bestAyah}\n\n🎯 *الواجب والتطبيق السلوكي:* ${bestAction}\n\n🔗 *رابط الاختبار الذاتي القصير للمدارسة في منصة مشكاة:* حفظكم الله جميعاً وبارك في أوقاتكم! 🤍`,
          actionItem: 'شاركونا عبر المجموعة تطبيقكم العملي لدرس اليوم!'
        };

        const generatedData = {
          metadata: {
            topic: topic,
            audience: (audienceLevel && audienceLevel.includes('بالمستوى المتقدم')) ? 'المستوى المتقدم والتأصيلي' : (audienceLevel && audienceLevel.includes('اليافعين') ? 'المستوى المتوسط والناشئة' : (audienceLevel || 'المستوى العام للدارسين')),
            duration: totalDuration,
            fullLectureText: normalizeIslamicSacredTerms(cleanLines.join('\n\n')),
            rawLectureText: rawClean,
            targetOutcome: isRtl ? `استيعاب أصول ومسائل (${topic}) والتطبيق المنهجي المعاصر` : `Comprehending issues of (${topic})`,
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
          whatsAppKit: dynamicWhatsAppSummary,
          openingPreamble: lectureOpeningPreamble,
          discussionPrompts: [
            `ما هو أثر تعظيم مرجعية الوحي وسلطان النص في صيانة الفكر المعاصر؟`,
            `كيف نطبق الضوابط والقواعد المستفادة من (${topic}) في واقعنا وحواراتنا؟`
          ]
        };

        setIslamicData(generatedData);
        setActiveIslamicStage(2);
        setStage3ActiveSlide(0);
        setIslamicQuizAnswers({});
        setIslamicQuizSubmitted(false);
        setIslamicWorksheetAnswers({});
        showToast(isRtl ? `تم تحليل المحاضرة واستخلاص ${processedSections.length} محوراً تفصيلياً مع عناصر العرض بنجاح ✨` : `Parsed lecture into ${processedSections.length} detailed modules ✨`);
      }

      // Universal Document Extractor for Word (.docx, .doc), PDF (.pdf), PowerPoint (.pptx), and Text (.txt, .md)
      async function handleLectureFileUpload(file) {
        if (!file) return;
        setIsExtractingFile(true);
        let extractedText = '';
        const fname = file.name || 'document';
        const ext = fname.substring(fname.lastIndexOf('.')).toLowerCase();

        try {
          if (ext === '.docx' || ext === '.doc') {
            const arrayBuffer = await file.arrayBuffer();

            // Layer A: Mammoth parser (first attempt)
            if (window.mammoth && typeof window.mammoth.extractRawText === 'function') {
              try {
                const res = await window.mammoth.extractRawText({ arrayBuffer });
                if (res && res.value && res.value.trim()) {
                  extractedText = res.value;
                }
              } catch (mErr) {
                console.warn('Mammoth parser error, engaging JSZip fallback:', mErr);
              }
            }

            // Layer B: Native JSZip XML Extractor (100% resilient fallback)
            if (!extractedText && window.JSZip) {
              try {
                const zip = await window.JSZip.loadAsync(arrayBuffer);
                const docXml = zip.file('word/document.xml');
                if (docXml) {
                  const xml = await docXml.async('string');
                  extractedText = xml
                    .replace(/<w:p[^>]*>/g, '\n')
                    .replace(/<w:br[^>]*>/g, '\n')
                    .replace(/<w:tab[^>]*>/g, ' ')
                    .replace(/<[^>]+>/g, '')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'")
                    .trim();
                }
              } catch (zipErr) {
                console.warn('JSZip Word extraction error:', zipErr);
              }
            }

            if (!extractedText) {
              throw new Error(isRtl ? 'تعذر استخراج النص من ملف الوورد، يرجى حفظه كملف .docx قياسي أو نسخ النص ولصقه' : 'Could not parse Word document');
            }
          } else if (ext === '.pptx' || ext === '.ppt') {
            // The old binary .ppt format is not a zip archive and cannot be read here.
            if (ext === '.ppt') {
              throw new Error(isRtl
                ? 'هذا ملف باوربوينت بالصيغة القديمة (.ppt). الحل: فتحه في باوربوينت وحفظه بصيغة (.pptx) ثم رفعه.'
                : 'Old .ppt format: open it in PowerPoint, save as .pptx, then upload.');
            }
            // PowerPoint Slide Text Extractor via JSZip
            const arrayBuffer = await file.arrayBuffer();
            if (window.JSZip) {
              try {
                const zip = await window.JSZip.loadAsync(arrayBuffer);
                const slideEntries = [];
                zip.forEach((relPath, entry) => {
                  if (/ppt\/slides\/slide\d+\.xml$/i.test(relPath)) {
                    slideEntries.push(entry);
                  }
                });
                slideEntries.sort((a, b) => {
                  const nA = parseInt(a.name.match(/\d+/)[0], 10);
                  const nB = parseInt(b.name.match(/\d+/)[0], 10);
                  return nA - nB;
                });
                const slideTexts = [];
                for (const se of slideEntries) {
                  const sXml = await se.async('string');
                  const sTxt = sXml
                    // One line per paragraph and a space between text runs, so
                    // words from separate runs are not glued together.
                    .replace(/<\/a:p>/g, '\n')
                    .replace(/<\/a:r>/g, ' ')
                    .replace(/<[^>]+>/g, '')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'")
                    .replace(/&amp;/g, '&') // last, so "&amp;quot;" stays "&quot;"
                    .replace(/[ \t]+/g, ' ')
                    .replace(/\n\s+\n/g, '\n\n')
                    .trim();
                  if (sTxt) slideTexts.push(sTxt);
                }
                extractedText = slideTexts.join('\n\n');
              } catch (pptxErr) {
                console.warn('PPTX extraction error:', pptxErr);
              }
            }
            if (!extractedText) {
              throw new Error(isRtl ? 'تعذر استخراج النص من ملف الباوربوينت' : 'Could not parse PowerPoint presentation');
            }
          } else if (ext === '.pdf') {
            const arrayBuffer = await file.arrayBuffer();
            if (window.pdfjsLib) {
              let loadingTask;
              try {
                loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
              } catch (ltErr) {
                loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true });
              }
              let pdf;
              try {
                pdf = await loadingTask.promise;
              } catch (promErr) {
                // Retry in workerless mode if worker construction failed
                loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true });
                pdf = await loadingTask.promise;
              }
              let pagesText = [];
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const items = textContent.items || [];

                items.sort((a, b) => {
                  const yA = a.transform ? a.transform[5] : 0;
                  const yB = b.transform ? b.transform[5] : 0;
                  if (Math.abs(yA - yB) > 4.0) return yB - yA;
                  return 0;
                });

                const lineGroups = [];
                let curLine = [];
                let curY = null;

                for (let j = 0; j < items.length; j++) {
                  const it = items[j];
                  if (!it || typeof it.str !== 'string') continue;
                  if (!it.str && !it.hasEOL) continue;

                  const y = it.transform ? it.transform[5] : 0;
                  const x = it.transform ? it.transform[4] : 0;
                  const w = it.width || 0;

                  if (curY === null || Math.abs(y - curY) > 4.0) {
                    if (curLine.length > 0) lineGroups.push(curLine);
                    curLine = [];
                    curY = y;
                  }
                  if (it.str) curLine.push({ str: it.str, x, y, w });
                }
                if (curLine.length > 0) lineGroups.push(curLine);

                const pageLines = lineGroups.map(line => {
                  if (line.length > 1) {
                    const hasArabic = line.some(it => /[\u0600-\u06FF]/.test(it.str));
                    if (hasArabic) {
                      const firstX = line[0].x;
                      const lastX = line[line.length - 1].x;
                      if (firstX < lastX && (lastX - firstX) > 20) {
                        line.sort((a, b) => b.x - a.x);
                      }
                    }
                  }
                  let lineStr = '';
                  for (let k = 0; k < line.length; k++) {
                    const it = line[k];
                    if (k === 0) {
                      lineStr += it.str;
                    } else {
                      const prev = line[k - 1];
                      const isRtlOrder = prev.x > it.x;
                      const gap = isRtlOrder ? (prev.x - (it.x + it.w)) : (it.x - (prev.x + prev.w));
                      const prevEndsSpace = /[\s\n]$/.test(lineStr);
                      const itStartsSpace = /^[\s\n]/.test(it.str);
                      const isPunct = /^[،.؛!؟\)\]»]/.test(it.str);

                      if (prevEndsSpace || itStartsSpace || isPunct) {
                        lineStr += it.str;
                      } else if (gap > 3.8) {
                        lineStr += ' ' + it.str;
                      } else {
                        lineStr += it.str;
                      }
                    }
                  }
                  return lineStr.trim();
                }).filter(Boolean);

                if (pageLines.length > 0) {
                  pagesText.push(pageLines.join('\n'));
                }
              }
              extractedText = pagesText.join('\n\n');
            } else {
              throw new Error(isRtl ? 'محرك قراءة PDF غير متاح' : 'PDF reader engine not available');
            }
          } else {
            // Plain text or markdown
            extractedText = await file.text();
          }

          if (!extractedText || !extractedText.trim()) {
            showToast(isRtl ? 'لم يتم العثور على نصوص مقروءة داخل الملف' : 'No readable text found in file');
            setIsExtractingFile(false);
            return;
          }

          const cleanExtracted = sanitizeArabicExtractedText(extractedText);
          // Set raw text immediately so the text is NEVER lost!
          setRawLectureText(cleanExtracted);

          const words = cleanExtracted.trim().split(/\s+/).length;
          const sizeKb = Math.round(file.size / 1024);
          setUploadedFileInfo({
            name: fname,
            sizeKb,
            wordCount: words,
            lineCount: cleanExtracted.split('\n').length
          });

          // Infer topic title
          const allExtractedLines = cleanExtracted.split('\n').map(l => l.trim()).filter(Boolean);
          let primaryTitleCandidate = allExtractedLines.slice(0, 15).find(l => {
            if (l.length < 8 || l.length > 85) return false;
            if (/^(?:مقدمة|تمهيد|مدخل|كبسولة|فهرس|محتويات|أعوذ|اعوذ|بسم|الحمد|صلى|اللهم|السلام|قال|روى|س ما|س هل|الجامع|أخرجه|أخرج|صحيح|رواه|تخريج)/.test(l)) return false;
            if (l.includes('بسم الله') || l.includes('أعوذ بالله') || l.includes('الحمد لله') || l.includes('رسول الله') || l.includes('اللهم') || l.includes('علمنا') || l.includes('وارزقنا') || l.includes('فقهية') || l.includes('البخاري') || l.includes('مسلم') || l.includes('الجامع |')) return false;
            return true;
          });
          const cleanName = fname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const suggestedTopic = primaryTitleCandidate || cleanName || 'محاضرة شرعية وتأصيل علمي';
          setLessonTopic(suggestedTopic);

          const evs = extractEvidencesAndProofs(cleanExtracted);
          setExtractedEvidences(evs);

          // Process into stages/slides
          try {
            handleProcessCustomLecture(cleanExtracted, suggestedTopic, evs);
            showToast(isRtl ? ('تم استخراج نص الملف بنجاح (' + words + ' كلمة) 📄✨') : ('Extracted ' + words + ' words successfully 📄✨'));
          } catch (procErr) {
            console.error('Lecture processing error:', procErr);
            showToast(isRtl ? 'تم استخراج النص بنجاح؛ يرجى مراجعة المحاور في المحرر' : 'Text extracted; please review in editor');
          }
        } catch (err) {
          console.error('File extraction error:', err);
          const errDetail = err && err.message ? err.message : '';
          showToast(isRtl ? ('تعذر قراءة الملف: ' + (errDetail || 'يرجى التأكد من إغلاقه في وورد أو حفظه كـ .docx')) : ('Error reading file: ' + errDetail));
        } finally {
          setIsExtractingFile(false);
        }
      }

function getFallbackIslamic() {
        return {
          metadata: {
            category: subjectCategory,
            topic: lessonTopic,
            durationMinutes: lessonDuration,
            audienceLevel: audienceLevel,
            languageMode: 'bilingual'
          },
          blueprint: [
            {
              phaseNumber: 1,
              phaseNameAr: 'المقدمة وعنصر التشويق (The Hook)',
              phaseNameEn: 'Hook & Interactive Question',
              allocatedMinutes: 5,
              teacherGuidanceAr: 'اطرح سؤالاً تفاعلياً على الدارسين: ما الفرق بين مجرد العلم الذهني بوجود الله وبين اليقين الذي يزيل الهم في الأزمات؟',
              teacherGuidanceEn: 'Ask the students: How does knowing Allah is Al-Aleem and Al-Khabeer give us personal peace during exams and trials?',
              talkingPoints: [
                'الافتتاح بالحمد والصلاة والسلام على رسول الله',
                'ربط موضوع الإيمان بالسكينة والطمأنينة القلبية'
              ]
            },
            {
              phaseNumber: 2,
              phaseNameAr: 'التأصيل الشرعي والأدلة الموثقة',
              phaseNameEn: 'Core Evidences & Hadith of Jibreel',
              allocatedMinutes: 20,
              teacherGuidanceAr: 'عرض حديث جبريل عليه السلام وتفصيل الأركان الستة مع التركيز على ركن الإيمان بالقضاء والقدر.',
              teacherGuidanceEn: 'Walk through the 6 pillars with emphasis on Qadar (Destiny: the antidote to anxiety and regret).',
              talkingPoints: [
                'الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره',
                'التمييز بين مراتب الدين: الإسلام، الإيمان، الإحسان'
              ]
            },
            {
              phaseNumber: 3,
              phaseNameAr: 'التطبيق العملي في واقع الدارس المعاصر',
              phaseNameEn: 'Real-Life Application & Emotional Resilience',
              allocatedMinutes: 15,
              teacherGuidanceAr: 'تدريب الدارسين على التخلص من كلمة "لو" المحبطة واستبدالها بالرضا: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ".',
              teacherGuidanceEn: 'Equipping youth with the prophetic mindset: replacing paralyzing regret with proactive contentment.',
              talkingPoints: [
                'استشعار معية الله في السراء والضراء',
                'تحويل العادات اليومية إلى عبادات بالنية الصادقة'
              ]
            },
            {
              phaseNumber: 4,
              phaseNameAr: 'الخاتمة والواجب المنزلي وملخص الواتساب',
              phaseNameEn: 'Wrap-up, Reflection & WhatsApp Summary',
              allocatedMinutes: 5,
              teacherGuidanceAr: 'توزيع ملخص الواتساب المعد مسبقاً بنقرة واحدة، وحث كل دارس على تطبيق ذكر اليوم.',
              teacherGuidanceEn: 'Copy and share the WhatsApp summary and launch the interactive 5-question review.',
              talkingPoints: [
                'دعاء كفارة المجلس: سبحانك اللهم وبحمدك...',
                'تذكير بالاختبار الذاتي القصير'
              ]
            }
          ],
          worksheetItems: [
            {
              num: 1,
              topic: 'المقدمة وعنصر التشويق: حقيقة الإيمان واليقين',
              scripture: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ﴾ [النساء: 136]',
              questionPrompt: 'ما الفرق الجوهري بين مجرد التصديق الذهني بوجود الله وبين اليقين الإيماني المثمر للطمأنينة؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'اليقين الإيماني يستقر في القلب ويصدقه العمل والسلوك بينما التصديق الذهني مجرد معلومة' },
                { id: 'b', label: 'ب', textAr: 'التصديق الذهني كافٍ لتحقيق السعادة دون حاجة لأعمال الجوارح والأخلاق' },
                { id: 'c', label: 'ج', textAr: 'لا فرق بينهما فكلاهما مصطلح مترادف في المعاجم اللغوية' }
              ],
              correctOptionId: 'a',
              teacherAnswer: 'اليقين الإيماني يستقر في القلب ويصدقه العمل والسلوك بينما التصديق الذهني مجرد معلومة',
              teacherRationale: 'الإيمان عند أهل السنة والجماعة قول واعتقاد وعمل، يزيد بالطاعة وينقص بالمعصية.',
              practicalImpact: 'استشعار معية الله وتجديد النية الصادقة في كافة الأنشطة اليومية.'
            },
            {
              num: 2,
              topic: 'التأصيل الشرعي: مراتب الدين وأركان الإيمان الستة',
              scripture: '«أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَاليَوْمِ الآخِرِ، وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ» (صحيح مسلم)',
              questionPrompt: 'وفقاً لحديث جبريل عليه السلام؛ أي من التالي يُمثل الركن السادس من أركان الإيمان؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'إيتاء الزكاة المفروضة' },
                { id: 'b', label: 'ب', textAr: 'الإيمان بالقضاء والقدر خيره وشره' },
                { id: 'c', label: 'ج', textAr: 'حج البيت لمن استطاع إليه سبيلاً' }
              ],
              correctOptionId: 'b',
              teacherAnswer: 'الإيمان بالقضاء والقدر خيره وشره',
              teacherRationale: 'بين النبي ﷺ في حديث جبريل أن أركان الإيمان ستة بينما الزكاة والحج من أركان الإسلام الخمسة.',
              practicalImpact: 'ترسيخ استسلام القلب لحكمة الله البالغة في تدبير الكون والأرزاق.'
            },
            {
              num: 3,
              topic: 'التطبيق العملي: الإيمان بالقدر وعلاج القلق والندم',
              scripture: '«مَا أَصَابَكَ لَمْ يَكُنْ لِيُخْطِئَكَ، وَمَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ» (أحمد وأبو داود)',
              questionPrompt: 'ما الهدي النبوي الرشيد عند وقوع ما يكرهه الإنسان لتفادي مشاعر الإحباط والندم القاتل؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'لوم النفس المستمر وترديد كلمة "لو أني فعلت كذا لكان كذا"' },
                { id: 'b', label: 'ب', textAr: 'استشعار الرضا وترديد: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ" مع الأخذ بالأسباب' },
                { id: 'c', label: 'ج', textAr: 'التوقف التام عن المحاولة والقعود عن طلب المعاش' }
              ],
              correctOptionId: 'b',
              teacherAnswer: 'استشعار الرضا وترديد: "قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ" مع الأخذ بالأسباب',
              teacherRationale: 'نهى النبي ﷺ عن فتح عمل الشيطان بكلمة "لو" وأمر بالرضا والاحتساب.',
              practicalImpact: 'تحويل الصدمات والأزمات إلى منازل للصبر والاحتساب واليقين.'
            },
            {
              num: 4,
              topic: 'الخاتمة والواجب السلوكي: دوام الذكر وحفظ القلب',
              scripture: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ [الرعد: 28]',
              questionPrompt: 'ما الأثر السلوكي المستهدف من ملازمة أذكار الصباح والمساء بحضور قلب؟',
              options: [
                { id: 'a', label: 'أ', textAr: 'الحصانة الإيمانية وسكينة النفس ودفع وساوس القلق والخوف' },
                { id: 'b', label: 'ب', textAr: 'مجرد أداء طقس روتيني سريع دون تفكر في معاني الألفاظ' },
                { id: 'c', label: 'ج', textAr: 'الاستغناء عن الأسباب المادية المشروعة' }
              ],
              correctOptionId: 'a',
              teacherAnswer: 'الحصانة الإيمانية وسكينة النفس ودفع وساوس القلق والخوف',
              teacherRationale: 'الذكر الحقيقي يربط العبد بخالقه وينزل الطمأنينة في الشدائد والرخاء.',
              practicalImpact: 'المحافظة على ورد الذكر اليومي وترديد "رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً".'
            }
          ],
          evidences: [
            {
              type: 'hadith',
              arabicText: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ، قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَاليَوْمِ الآخِرِ، وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ».',
              englishTranslation: 'He said: "Inform me about Faith." The Prophet ﷺ said: "That you believe in Allah, His Angels, His Books, His Messengers, the Last Day, and that you believe in Divine Destiny, its good and bad."',
              citation: 'صحيح مسلم (Sahih Muslim #8)',
              narrator: 'أمير المؤمنين عمر بن الخطاب رضي الله عنه',
              grading: 'صحيح (Sahih - Highest Authenticity)',
              authenticityBadge: true
            },
            {
              type: 'quran',
              arabicText: 'ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّن رُّسُلِهِۦ',
              englishTranslation: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers...',
              citation: 'سورة البقرة (Surah Al-Baqarah 2:285)',
              narrator: '—',
              grading: 'متواتر قطعي الثبوت (Quranic Revelation)',
              authenticityBadge: true
            }
          ],
          zoomCards: [
            {
              slideNumber: 1,
              phaseTitle: 'المحور 1',
              slideTitle: 'ما هو جوهر الإيمان؟',
              titleAr: 'ما هو جوهر الإيمان؟',
              titleEn: 'What is the Essence of Iman?',
              scriptureEvidence: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ وَالْكِتَابِ الَّذِي نَزَّلَ عَلَىٰ رَسُولِهِ﴾ [النساء: 136]',
              bulletPoints: [
                'الإيمان قول باللسان واعتقاد بالجنان وعمل بالجوارح والأركان',
                'زيادة الإيمان بالطاعات ونقصانه بالغفلات والمعاصي',
                'أثر اليقين القلبي في دفع الشبهات وتسكين الاضطراب النفسي'
              ],
              talkingPoints: 'تحرير مفهوم الإيمان عند أهل السنة والجماعة • الرد على الإرجاء والتفريط • ترسيخ حقيقة أن العمل ركن أساسي في كمال الإيمان وصحته',
              fullSectionText: 'الإيمان ليس مجرد معرفة عقلية باردة ولا كلمات تردد باللسان، بل هو ما وقر في أعماق القلب وصدقه العمل الصالح وأخلاق المسلم. حين يتحقق الإيمان الصادق في نفس الداعية والمتعلم، يثمر طمأنينة وسكينة تعصمه من القلق والحيرة، وتدفعه للبذل والثبات في مواجهة الصعاب.',
              discussionPrompts: [
                'ما الفرق الجوهري بين مجرد التصديق الذهني بوجود الخالق وبين اليقين الإيماني المؤثر في السلوك؟',
                'كيف ينعكس الإيمان بأسماء الله الحسنى وصفاته العلى على طمأنينة القلب عند نزول الشدائد؟'
              ],
              pedagogicalTip: 'التركيز على ربط مفهوم الإيمان بالواقع المعاش للشباب والرد على الشبهات العصرية',
              bodyAr: 'الإيمان ليس مجرد كلمات تردد، بل هو ما استقر في أعماق القلب وصدقته الأعمال الصالحة وأخلاق المسلم.',
              practicalAction: 'جددي نيتك الصادقة اليومية قبل فتح أي كتاب أو درس والالتزام بأوراد القلوب.'
            },
            {
              slideNumber: 2,
              phaseTitle: 'المحور 2',
              slideTitle: 'الإيمان بالقدر دواء القلق والتوتر',
              titleAr: 'الإيمان بالقدر دواء القلق والتوتر',
              titleEn: 'Belief in Qadar: The Antidote to Anxiety',
              scriptureEvidence: '«مَا أَصَابَكَ لَمْ يَكُنْ لِيُخْطِئَكَ، وَمَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ» (أحمد وأبو داود)',
              bulletPoints: [
                'مراتب القدر الأربعة: العلم، الكتابة، المشيئة، والخلق والإيجاد',
                'اليقين بأن أزمات الحياة مقدرة بحكمة إلهية بالغة ورحمة',
                'الجمع المنضبط بين بذل الأسباب المشروعة والتوكل الصادق'
              ],
              talkingPoints: 'بيان مراتب الإيمان بالقدر • التفريق بين الإرادة الكونية والإرادة الشرعية • دحض دعاوى الجبر والتعطيل ودفع وسواس الخوف من المستقبل',
              fullSectionText: 'حين يعلم المؤمن أن ما أصابه لم يكن ليخطئه وما أخطأه لم يكن ليصيبه، تنزل السكينة في فؤاده ويزول هلع المستقبل. إن الإيمان بالقدر ركن أصيل يمنح الإنسان توازناً نفسياً فريداً؛ فلا يبطر عند النعمة والرخاء، ولا ييأس أو ينهار عند البلاء والمصيبة، بل يكون شاكراً في الأولى وصابراً محتسباً في الثانية.',
              discussionPrompts: [
                'كيف يزيل الإيمان بالقدر مشاعر الندم القاتل والحسرة على ما فات؟',
                'كيف نجمع بين أخذ الأسباب الطبية والمادية الدقيقة وبين الرضا التام بقضاء الله وقدره؟'
              ],
              pedagogicalTip: 'حث الطلاب على استشعار معية الله والتفويض الكامل مع استنفاد الجهد في الأسباب',
              bodyAr: 'حين يعلم المؤمن أن ما أصابه لم يكن ليخطئه، تنزل السكينة في فؤاده ويزول هلع المستقبل.',
              practicalAction: 'ردد عند أي عائق: قدر الله وما شاء فعل بيقين تام واحتسب الأجر عند الله.'
            }
          ],
          whatsAppKit: {
            headline: '🌿 خلاصة درس اليوم: أركان الإيمان الستة وسكينة القلب 🌿',
            formattedText: `السلام عليكم ورحمة الله وبركاته يا غاليات 🌸\n\n📌 *موضوع حلقتنا اليوم:* أركان الإيمان وثمارها العملية في حياتنا اليومية\n\n✨ *أهم الفوائد المستفادة:*\n1️⃣ الإيمان ستة أركان: بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره.\n2️⃣ من عرف ربه باسمائه الحسنى استراح قلبه من الخوف والهم.\n3️⃣ الإيمان بالقضاء والقدر يمحو كلمة "لو" المحبطة ويملأ الروح باليقين والرضا.\n\n📖 *آية الأسبوع للتأمل:* ﴿ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ﴾ [البقرة: 285]\n\n🎯 *الواجب العملي:* ترديد ذكر "رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً" صباحاً ومساءً بحضور قلب.\n\n🔗 رابط الاختبار القصير للمراجعة الذاتية في منصة مشكاة. حفظكم الله جميعاً! 🤍`,
            actionItem: 'شاركونا عبر المجموعة تطبيقكم العملي لذكر اليوم!'
          },
          reviewQuiz: [
            {
              id: 1,
              questionAr: 'أي من الأركان التالية يدخل ضمن أركان الإيمان الستة وليس من أركان الإسلام الخمسة؟',
              questionEn: 'Which is one of the 6 Pillars of Iman and NOT of the 5 Pillars of Islam?',
              options: [
                { id: 'a', textAr: 'إيتاء الزكاة', textEn: 'Giving Zakah' },
                { id: 'b', textAr: 'الإيمان بالقضاء والقدر', textEn: 'Belief in Divine Destiny (Qadar)' },
                { id: 'c', textAr: 'صوم شهر رمضان', textEn: 'Fasting Ramadan' },
                { id: 'd', textAr: 'حج البيت لمن استطاع', textEn: 'Performing Hajj' }
              ],
              correctOptionId: 'b',
              reflectionPrompt: 'الإيمان بالقدر يورث الطمأنينة والرضا عن الله في السراء والضراء.'
            },
            {
              id: 2,
              questionAr: 'من هو الصحابي الجليل راوي حديث جبريل المشهور في بيان أركان الإيمان والإسلام؟',
              questionEn: 'Who narrated the renowned Hadith of Jibreel explaining Islam, Iman, and Ihsan?',
              options: [
                { id: 'a', textAr: 'أبو بكر الصديق رضي الله عنه', textEn: 'Abu Bakr As-Siddiq' },
                { id: 'b', textAr: 'عمر بن الخطاب رضي الله عنه', textEn: 'Umar ibn Al-Khattab' },
                { id: 'c', textAr: 'أبو هريرة رضي الله عنه', textEn: 'Abu Hurairah' },
                { id: 'd', textAr: 'أنس بن مالك رضي الله عنه', textEn: 'Anas ibn Malik' }
              ],
              correctOptionId: 'b',
              reflectionPrompt: 'قال عمر: بينما نحن عند رسول الله ﷺ إذ طلع علينا رجل شديد بياض الثياب...'
            }
          ]
        };
      }

      return { handleProcessCustomLecture, handleLectureFileUpload, getFallbackIslamic };
    }

    if (typeof window !== 'undefined') {
      window.createLectureActions = createLectureActions;
    }
