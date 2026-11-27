    // createTajweedActions: handlers moved out of App unchanged. App calls this once
    // per render and passes the state and setters the handlers read.
    function createTajweedActions({ ayahRange, customContext, isRtl, selectedRule, selectedTextbook, setIsGeneratingTajweed, setQuizAnswers, setQuizSubmitted, setTajweedData, showToast, surahName, tajweedMode, teacherPin }) {
      // Generator Handlers via /api/generate
      async function handleGenerateTajweed(isInitial = false) {
        setIsGeneratingTajweed(true);
        try {
          const ruleObj = TAJWEED_RULES.find(r => r.id === selectedRule) || TAJWEED_RULES[0];
          const textbookObj = PRELOADED_TEXTBOOKS.find(b => b.id === selectedTextbook);

          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-mishkah-pin': teacherPin
            },
            body: JSON.stringify({
              type: 'tajweed',
              surah: surahName,
              ayahRange: ayahRange,
              rule: ruleObj.nameAr,
              languageMode: tajweedMode,
              textbookContext: customContext || textbookObj?.nameAr,
              isDemo: isInitial
            })
          });

          if (res.ok) {
            const json = await res.json();
            setTajweedData(json.data);
            setQuizAnswers({});
            setQuizSubmitted(false);
            if (!isInitial) showToast(isRtl ? 'تم توليد خطة درس التجويد بنجاح ✨' : 'Tajweed Lesson Generated Successfully ✨');
          } else {
            throw new Error('Server returned ' + res.status);
          }
        } catch (err) {
          console.warn('Using client fallback:', err.message);
          setTajweedData(getFallbackTajweed());
          if (!isInitial) showToast(isRtl ? 'عُرض نموذج محفوظ: سورة الملك 1–10 على حكم الإخفاء ⚠️' : 'Showing the stored sample: Al-Mulk 1–10, Ikhfaa ⚠️');
        } finally {
          setIsGeneratingTajweed(false);
        }
      }

      function getFallbackTajweed() {
        return {
          metadata: {
            // The stored sample is always Al-Mulk 1–10 on Ikhfaa, whatever was asked.
            surah: 'سورة الملك (Al-Mulk)',
            ayahRange: '1–10',
            ruleNameAr: 'الإخفاء الحقيقي (Al-Ikhfaa Al-Haqiqi)',
            ruleNameEn: 'True Concealment (Ikhfaa)',
            languageMode: tajweedMode,
            textbookSource: 'Czerepinski & Dr. Ayman Suwayd Certified Standard'
          },
          ruleDefinition: {
            arabic: 'الإخفاء لغةً: الستر. واصطلاحاً: النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام عارٍ عن التشديد مع بقاء الغنة بمقدار حركتين.',
            english: 'Linguistically: Concealment. Technically: Pronouncing the Noon Sakinah or Tanween in a state between clear Izhar and merged Idgham, without shaddah, while retaining nasalization (Ghunnah) for 2 counts.',
            anatomicalMakhrajAr: 'يخرج صوت الغنة من الخيشوم (تجويف الأنف) مع إبعاد طرف اللسان قليلاً عن لثة الأسنان العليا وتهيئة الفم لمخرج حرف الإخفاء التالي.',
            anatomicalMakhrajEn: 'The sound of Ghunnah emits from the Khayshoom (nasal cavity). The tip of the tongue is kept slightly distant from the upper gums, preparing the mouth directly for the articulation point of the following letter.',
            timingOrHarakat: 'حركتان (2 counts)',
            commonMistakes: [
              'إلصاق اللسان بالحنك الأعلى مما يحول الإخفاء إلى إظهار (Pressing the tongue against the palate)',
              'المبالغة في إشباع الحركة قبل النون حتى يتولد منها حرف مد (Stretching vowels into extra letters)',
              'تفخيم الغنة عند الحروف المرققة أو ترقيقها عند الحروف المفخمة (Incorrect Ghunnah heaviness/lightness)'
            ]
          },
          presentationCards: [
            {
              cardIndex: 1,
              titleAr: 'تطبيق الإخفاء بغنة مفخمة',
              titleEn: 'Ikhfaa with Heavy Ghunnah',
              ayahTextUthmani: 'تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ',
              highlightedPortion: 'شَىْءٍۢ قَدِيرٌ',
              tajweedColor: 'emerald',
              explanationAr: 'تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء المفخمة). ينطق بإخفاء التنوين وتفخيم الغنة.',
              explanationEn: 'Tanween followed by heavy letter Qaf. Pronounce with concealed Tanween and deep, heavy Ghunnah.',
              teacherPrompt: 'Check student\'s back of tongue elevation; ensure lips do not round prematurely.'
            },
            {
              cardIndex: 2,
              titleAr: 'تطبيق الإخفاء بغنة مرققة رقيقة',
              titleEn: 'Ikhfaa with Light Ghunnah',
              ayahTextUthmani: 'مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍۢ',
              highlightedPortion: 'مِن تَفَـٰوُتٍۢ',
              tajweedColor: 'emerald',
              explanationAr: 'نون ساكنة بعدها حرف التاء (حرف مرقق). ترقق الغنة وتتهيأ الأسنان لنطق التاء.',
              explanationEn: 'Noon Sakinah followed by light letter Taa. Produce a delicate light nasal Ghunnah.',
              teacherPrompt: 'Ensure teeth are gently close together without tongue pressing firmly against incisors.'
            },
            {
              cardIndex: 3,
              titleAr: 'تطبيق الإخفاء في كلمة واحدة',
              titleEn: 'Ikhfaa Within a Single Word',
              ayahTextUthmani: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًۭا',
              highlightedPortion: 'يَنقَلِبْ',
              tajweedColor: 'amber',
              explanationAr: 'نون ساكنة بعدها قاف في كلمة واحدة، مع قلقلة الباء المتطرفة عند الوقف.',
              explanationEn: 'Noon Sakinah followed by Qaf in one word, followed by Qalqalah in letter Baa upon stopping.',
              teacherPrompt: 'Notice the transition from heavy nasal Ghunnah directly to Qaf then Baa Qalqalah.'
            }
          ],
          worksheet: [
            { itemNumber: 1, wordUthmani: 'شَىْءٍۢ قَدِيرٌ', ruleApplied: 'إخفاء حقيقي بغنة مفخمة (Heavy Ikhfaa)', reasonAr: 'تنوين بعده قاف (حرف مفخم)', reasonEn: 'Tanween followed by Qaf', ayahReference: 'الملك: 1' },
            { itemNumber: 2, wordUthmani: 'مِن تَفَـٰوُتٍۢ', ruleApplied: 'إخفاء حقيقي بغنة مرققة (Light Ikhfaa)', reasonAr: 'نون ساكنة بعدها تاء (حرف مرقق)', reasonEn: 'Noon Sakinah followed by Taa', ayahReference: 'الملك: 3' },
            { itemNumber: 3, wordUthmani: 'مِن فُطُورٍۢ', ruleApplied: 'إخفاء حقيقي بغنة مرققة (Light Ikhfaa)', reasonAr: 'نون ساكنة بعدها فاء', reasonEn: 'Noon Sakinah followed by Faa', ayahReference: 'الملك: 3' },
            { itemNumber: 4, wordUthmani: 'يَنقَلِبْ', ruleApplied: 'إخفاء حقيقي في كلمة واحدة (Ikhfaa in one word)', reasonAr: 'نون ساكنة بعدها قاف', reasonEn: 'Noon Sakinah followed by Qaf', ayahReference: 'الملك: 4' }
          ],
          quiz: [
            {
              id: 1,
              questionAr: 'كم عدد حروف الإخفاء الحقيقي في أحكام النون الساكنة والتنوين؟',
              questionEn: 'How many letters cause True Concealment (Ikhfaa)?',
              type: 'mcq',
              options: [
                { id: 'a', textAr: '6 أحرف', textEn: '6 letters' },
                { id: 'b', textAr: '15 حرفاً', textEn: '15 letters' },
                { id: 'c', textAr: '4 أحرف', textEn: '4 letters' },
                { id: 'd', textAr: '8 أحرف', textEn: '8 letters' }
              ],
              correctOptionId: 'b',
              explanationAr: 'حروف الإخفاء 15 حرفاً مجموعة في أوائل كلمات: صف ذا ثنا كم جاد شخص قد سما دم طيبا زد في تقى ضع ظالما.',
              explanationEn: '15 letters assembled in the famous mnemonic opening verse.'
            },
            {
              id: 2,
              questionAr: 'ما هو المخرج الدقيق لصوت الغنة أثناء الإخفاء؟',
              questionEn: 'What is the precise anatomical articulation point of the Ghunnah?',
              type: 'mcq',
              options: [
                { id: 'a', textAr: 'الجوف (Oral Cavity)', textEn: 'Al-Jawf' },
                { id: 'b', textAr: 'الحلق (Throat)', textEn: 'Al-Halq' },
                { id: 'c', textAr: 'الخيشوم (تجويف الأنف)', textEn: 'Al-Khayshoom (Nasal Cavity)' },
                { id: 'd', textAr: 'الشفتان (Lips)', textEn: 'The Lips' }
              ],
              correctOptionId: 'c',
              explanationAr: 'الغنة تخرج فقط من الخيشوم وهو أقصى الأنف.',
              explanationEn: 'Ghunnah strictly resonates from the Khayshoom (nasal passage).'
            },
            {
              id: 3,
              questionAr: 'تكون غنة الإخفاء مفخمة إذا جاء بعد النون الساكنة حرف استعلاء كحرف القاف.',
              questionEn: 'The Ghunnah of Ikhfaa is pronounced heavy when followed by an elevated letter like Qaf.',
              type: 'true_false',
              options: [
                { id: 'true', textAr: 'صحيح (True)', textEn: 'True' },
                { id: 'false', textAr: 'خطأ (False)', textEn: 'False' }
              ],
              correctOptionId: 'true',
              explanationAr: 'نعم، الغنة تتبع الحرف الذي يليها تفخيماً وترقيقاً.',
              explanationEn: 'Correct! The Ghunnah follows the succeeding letter in heavy/light characteristics.'
            }
          ]
        };
      }

      return { handleGenerateTajweed, getFallbackTajweed };
    }
