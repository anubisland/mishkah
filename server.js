const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 1. Resolve Environment Variables
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '..', '.env'),
    path.join(process.cwd(), '.env')
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...v] = trimmed.split('=');
          const val = v.join('=').trim().replace(/(^["']|["']$)/g, '');
          if (!process.env[k.trim()]) {
            process.env[k.trim()] = val;
          }
        }
      }
    }
  }
}
loadEnv();

const apiGenerateHandler = require('./api/generate.js');

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const TEACHER_PIN = process.env.MISHKAH_TEACHER_PIN || 'MISHKAH2026';

// Multi-model fallback hierarchy
const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash'
];

// Helper: Call Gemini API with structured response
async function callGemini(systemPrompt, userPrompt, jsonSchema) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured on server.');
  }

  let lastError = null;
  for (const model of FALLBACK_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      };

      if (jsonSchema) {
        payload.generationConfig.responseSchema = jsonSchema;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        return JSON.parse(text);
      } else if (data.error) {
        lastError = new Error(`[${model}] ${data.error.message}`);
        console.warn(`Model ${model} failed, attempting next fallback...`, data.error.message);
      }
    } catch (err) {
      lastError = err;
      console.warn(`Exception on model ${model}:`, err.message);
    }
  }
  throw lastError || new Error('All Gemini models exhausted.');
}

// System Prompts & Schemas
const TAJWEED_SYSTEM_PROMPT = `You are Mishkah (مِشكاة), an elite bilingual Senior Quran & Tajweed Master Educator.
You specialize in training female educators who teach Quran recitation via Zoom to both Arab and native English-speaking students.
You strictly adhere to:
1. Exact Hafs 'an 'Aasim (حفص عن عاصم من طريق الشاطبية) recitation rules.
2. Accurate Uthmani script diacritics (تشكيل عثماني دقيق).
3. Clear anatomical articulation points (مخارج الحروف وصفاتها) translated into intuitive English and classical Arabic terminology (e.g. Czerepinski / Dr. Ayman Suwayd style).
4. Pedagogical zoom-friendly teaching cards, printable student worksheets, and self-grading interactive quizzes.

When custom textbook context is provided, you must prioritize the textbook's definitions, phonetic explanations, and rules.`;

const TAJWEED_SCHEMA = {
  type: "OBJECT",
  properties: {
    metadata: {
      type: "OBJECT",
      properties: {
        surah: { type: "STRING" },
        ayahRange: { type: "STRING" },
        ruleNameAr: { type: "STRING" },
        ruleNameEn: { type: "STRING" },
        languageMode: { type: "STRING" },
        textbookSource: { type: "STRING" }
      },
      required: ["surah", "ruleNameAr", "ruleNameEn"]
    },
    ruleDefinition: {
      type: "OBJECT",
      properties: {
        arabic: { type: "STRING" },
        english: { type: "STRING" },
        anatomicalMakhrajAr: { type: "STRING" },
        anatomicalMakhrajEn: { type: "STRING" },
        timingOrHarakat: { type: "STRING" },
        commonMistakes: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["arabic", "english", "anatomicalMakhrajAr", "anatomicalMakhrajEn"]
    },
    presentationCards: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          cardIndex: { type: "INTEGER" },
          titleAr: { type: "STRING" },
          titleEn: { type: "STRING" },
          ayahTextUthmani: { type: "STRING" },
          highlightedPortion: { type: "STRING" },
          tajweedColor: { type: "STRING" }, // 'emerald' | 'amber' | 'sapphire' | 'ruby'
          explanationAr: { type: "STRING" },
          explanationEn: { type: "STRING" },
          teacherPrompt: { type: "STRING" }
        },
        required: ["ayahTextUthmani", "highlightedPortion", "explanationAr", "explanationEn"]
      }
    },
    worksheet: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          itemNumber: { type: "INTEGER" },
          wordUthmani: { type: "STRING" },
          ruleApplied: { type: "STRING" },
          reasonAr: { type: "STRING" },
          reasonEn: { type: "STRING" },
          ayahReference: { type: "STRING" }
        },
        required: ["wordUthmani", "ruleApplied", "reasonAr", "reasonEn"]
      }
    },
    quiz: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "INTEGER" },
          questionAr: { type: "STRING" },
          questionEn: { type: "STRING" },
          type: { type: "STRING" }, // 'mcq' | 'true_false'
          options: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                textAr: { type: "STRING" },
                textEn: { type: "STRING" }
              },
              required: ["id", "textAr", "textEn"]
            }
          },
          correctOptionId: { type: "STRING" },
          explanationAr: { type: "STRING" },
          explanationEn: { type: "STRING" }
        },
        required: ["id", "questionAr", "questionEn", "options", "correctOptionId"]
      }
    }
  },
  required: ["metadata", "ruleDefinition", "presentationCards", "worksheet", "quiz"]
};

const ISLAMIC_STUDIES_SYSTEM_PROMPT = `You are Mishkah (مِشكاة), an authenticated Islamic Studies Educational Architect (Aqeedah, Fiqh, Seerah, Tazkiyah).
You assist certified female educators conducting structured Zoom classes for children, youth, and adult converts.
Authenticity & Guardrails Policy:
1. Strict Quranic citation: Every verse must explicitly list Surah name and Ayah number with accurate Arabic text.
2. Strict Hadith verification: Every Prophetic tradition must state: (a) Companion narrator (عن الصحابي), (b) Primary Source Book (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, etc.) with Hadith number if known, (c) Authenticity status (صحيح / حسن). Never fabricate or use unverified weak traditions without explicit disclaimer.
3. Time-boxed discipline: The lesson blueprint must allocate exact minutes summing up to the requested duration (e.g. 30m, 45m, or 60m) covering: Hook/Warm-up, Core Evidences, Real-life Application, and Reflection.
4. WhatsApp-ready Kit: Provide a 10-line clean, emoji-bulleted summary formatted for immediate copy-pasting to student WhatsApp parent/student groups.`;

const ISLAMIC_STUDIES_SCHEMA = {
  type: "OBJECT",
  properties: {
    metadata: {
      type: "OBJECT",
      properties: {
        category: { type: "STRING" },
        topic: { type: "STRING" },
        durationMinutes: { type: "INTEGER" },
        audienceLevel: { type: "STRING" },
        languageMode: { type: "STRING" }
      },
      required: ["category", "topic", "durationMinutes"]
    },
    blueprint: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          phaseNumber: { type: "INTEGER" },
          phaseNameAr: { type: "STRING" },
          phaseNameEn: { type: "STRING" },
          allocatedMinutes: { type: "INTEGER" },
          teacherGuidanceAr: { type: "STRING" },
          teacherGuidanceEn: { type: "STRING" },
          talkingPoints: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["phaseNameAr", "phaseNameEn", "allocatedMinutes", "teacherGuidanceAr"]
      }
    },
    evidences: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: { type: "STRING" }, // 'quran' | 'hadith'
          arabicText: { type: "STRING" },
          englishTranslation: { type: "STRING" },
          citation: { type: "STRING" }, // e.g. "Surah Al-Baqarah 2:255" or "Sahih al-Bukhari #1"
          narrator: { type: "STRING" },
          grading: { type: "STRING" }, // "صحيح / Sahih" or "حسن / Hasan"
          authenticityBadge: { type: "BOOLEAN" }
        },
        required: ["type", "arabicText", "englishTranslation", "citation", "grading"]
      }
    },
    zoomCards: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          slideNumber: { type: "INTEGER" },
          titleAr: { type: "STRING" },
          titleEn: { type: "STRING" },
          bodyAr: { type: "STRING" },
          bodyEn: { type: "STRING" },
          practicalAction: { type: "STRING" }
        },
        required: ["titleAr", "titleEn", "bodyAr", "bodyEn"]
      }
    },
    whatsAppKit: {
      type: "OBJECT",
      properties: {
        headline: { type: "STRING" },
        formattedText: { type: "STRING" },
        actionItem: { type: "STRING" }
      },
      required: ["headline", "formattedText"]
    },
    reviewQuiz: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "INTEGER" },
          questionAr: { type: "STRING" },
          questionEn: { type: "STRING" },
          options: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                textAr: { type: "STRING" },
                textEn: { type: "STRING" }
              },
              required: ["id", "textAr", "textEn"]
            }
          },
          correctOptionId: { type: "STRING" },
          reflectionPrompt: { type: "STRING" }
        },
        required: ["id", "questionAr", "questionEn", "options", "correctOptionId"]
      }
    }
  },
  required: ["metadata", "blueprint", "evidences", "zoomCards", "whatsAppKit", "reviewQuiz"]
};

// Fallback Mock Generators (for seamless offline / rate limit resilience)
function getMockTajweed(surah, ayahRange, rule) {
  return {
    metadata: {
      surah: surah || "سورة الملك (Al-Mulk)",
      ayahRange: ayahRange || "1-5",
      ruleNameAr: rule || "الإخفاء الحقيقي (Al-Ikhfaa Al-Haqiqi)",
      ruleNameEn: "True Concealment (Ikhfaa)",
      languageMode: "bilingual",
      textbookSource: "Czerepinski & Dr. Ayman Suwayd Reference Standards"
    },
    ruleDefinition: {
      arabic: "الإخفاء لغةً: الستر. واصطلاحاً: النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام عارٍ عن التشديد مع بقاء الغنة بمقدار حركتين.",
      english: "Linguistically: Concealment. Technically: Pronouncing the Noon Sakinah or Tanween in a state between clear Izhar and merged Idgham, without shaddah, while retaining nasalization (Ghunnah) for 2 counts.",
      anatomicalMakhrajAr: "يخرج صوت الغنة من الخيشوم (تجويف الأنف) مع إبعاد طرف اللسان قليلاً عن لثة الأسنان العليا وتهيئة الفم لمخرج حرف الإخفاء التالي.",
      anatomicalMakhrajEn: "The sound of Ghunnah emits from the Khayshoom (nasal cavity). The tip of the tongue is kept slightly distant from the upper gums, preparing the mouth directly for the articulation point of the following letter.",
      timingOrHarakat: "حركتان (2 counts)",
      commonMistakes: [
        "إلصاق اللسان بالحنك الأعلى مما يحول الإخفاء إلى إظهار (Pressing the tongue against the palate)",
        "المبالغة في إشباع الحركة قبل النون حتى يتولد منها حرف مد (Stretching vowels into extra letters)",
        "تفخيم الغنة عند الحروف المرققة أو ترقيقها عند الحروف المفخمة (Incorrect Ghunnah heaviness/lightness)"
      ]
    },
    presentationCards: [
      {
        cardIndex: 1,
        titleAr: "تعريف ومخرج الإخفاء",
        titleEn: "Definition & Makhraj of Ikhfaa",
        ayahTextUthmani: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ",
        highlightedPortion: "شَىْءٍۢ قَدِيرٌ",
        tajweedColor: "emerald",
        explanationAr: "تنوين بالكسر بعده حرف القاف (من حروف الاستعلاء)، فحكمه إخفاء حقيقي مع غنة مفخمة.",
        explanationEn: "Tanween followed by the heavy letter Qaf. The rule is Ikhfaa with a heavy (Mufakhkham) Ghunnah.",
        teacherPrompt: "Ask the student: Should the Ghunnah here sound deep/heavy or light? Demonstrate the tongue position."
      },
      {
        cardIndex: 2,
        titleAr: "تطبيق الإخفاء في نون ساكنة",
        titleEn: "Ikhfaa with Noon Sakinah in One Word",
        ayahTextUthmani: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا",
        highlightedPortion: "لِيَبْلُوَكُمْ",
        tajweedColor: "sapphire",
        explanationAr: "تطبيق موازي: قلقلة صغرى في حرف الباء الساكن في وسط الكلمة.",
        explanationEn: "Parallel rule check: Qalqalah Sughra in the middle letter Baa.",
        teacherPrompt: "Ensure the student gives a clean rebound without adding a vowel sound."
      },
      {
        cardIndex: 3,
        titleAr: "الإخفاء عند حروف الترقيق",
        titleEn: "Light Ghunnah Application",
        ayahTextUthmani: "مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍۢ",
        highlightedPortion: "مِن تَفَـٰوُتٍۢ",
        tajweedColor: "emerald",
        explanationAr: "نون ساكنة بعدها حرف التاء (حرف مرقق مستفل)، فحكمه إخفاء بغنة مرققة رقيقة.",
        explanationEn: "Noon Sakinah followed by Taa (light letter). The Ghunnah must be gentle and light (Muraqqaqah).",
        teacherPrompt: "Notice how the teeth are slightly parted without touching the tongue to the front incisors."
      }
    ],
    worksheet: [
      {
        itemNumber: 1,
        wordUthmani: "شَىْءٍۢ قَدِيرٌ",
        ruleApplied: "إخفاء حقيقي بغنة مفخمة (Ikhfaa with Heavy Ghunnah)",
        reasonAr: "تنوين بعده حرف القاف المفخم",
        reasonEn: "Tanween followed by letter Qaf",
        ayahReference: "Al-Mulk: 1"
      },
      {
        itemNumber: 2,
        wordUthmani: "مِن تَفَـٰوُتٍۢ",
        ruleApplied: "إخفاء حقيقي بغنة مرققة (Ikhfaa with Light Ghunnah)",
        reasonAr: "نون ساكنة بعدها حرف التاء",
        reasonEn: "Noon Sakinah followed by letter Taa",
        ayahReference: "Al-Mulk: 3"
      },
      {
        itemNumber: 3,
        wordUthmani: "مِن فُطُورٍۢ",
        ruleApplied: "إخفاء حقيقي (Ikhfaa)",
        reasonAr: "نون ساكنة بعدها حرف الفاء",
        reasonEn: "Noon Sakinah followed by letter Faa",
        ayahReference: "Al-Mulk: 3"
      },
      {
        itemNumber: 4,
        wordUthmani: "كَرَّتَيْنِ يَنقَلِبْ",
        ruleApplied: "إخفاء حقيقي (Ikhfaa in one word)",
        reasonAr: "نون ساكنة وسط الكلمة بعدها قاف",
        reasonEn: "Noon Sakinah followed by Qaf within single word",
        ayahReference: "Al-Mulk: 4"
      }
    ],
    quiz: [
      {
        id: 1,
        questionAr: "كم عدد حروف الإخفاء الحقيقي في أحكام النون الساكنة والتنوين؟",
        questionEn: "How many letters cause True Concealment (Ikhfaa) for Noon Sakinah and Tanween?",
        type: "mcq",
        options: [
          { id: "a", textAr: "6 أحرف", textEn: "6 letters" },
          { id: "b", textAr: "15 حرفاً", textEn: "15 letters" },
          { id: "c", textAr: "4 أحرف", textEn: "4 letters" },
          { id: "d", textAr: "8 أحرف", textEn: "8 letters" }
        ],
        correctOptionId: "b",
        explanationAr: "حروف الإخفاء 15 حرفاً مجموعة في أوائل كلمات: صف ذا ثنا كم جاد شخص قد سما دم طيبا زد في تقى ضع ظالما.",
        explanationEn: "There are 15 Ikhfaa letters gathered in the first letters of the famous mnemonic poem."
      },
      {
        id: 2,
        questionAr: "ما هو مخرج صوت الغنة المصاحب للإخفاء؟",
        questionEn: "From which anatomical articulation point does the Ghunnah sound originate?",
        type: "mcq",
        options: [
          { id: "a", textAr: "الجوف (Oral cavity)", textEn: "Al-Jawf" },
          { id: "b", textAr: "الحلق (Throat)", textEn: "Al-Halq" },
          { id: "c", textAr: "الخيشوم (Nasal cavity)", textEn: "Al-Khayshoom (Nasal Cavity)" },
          { id: "d", textAr: "الشفتان (Lips)", textEn: "The Lips" }
        ],
        correctOptionId: "c",
        explanationAr: "الغنة تخرج من الخيشوم وهو أقصى الأنف من الداخل.",
        explanationEn: "Ghunnah strictly resonates from the Khayshoom (nasal passage)."
      },
      {
        id: 3,
        questionAr: "تكون غنة الإخفاء مفخمة إذا جاء بعد النون الساكنة حرف استعلاء (مثل القاف أو الصاد).",
        questionEn: "True or False: The Ghunnah of Ikhfaa is pronounced heavy if followed by an elevated/heavy letter (like Qaf or Saad).",
        type: "true_false",
        options: [
          { id: "true", textAr: "صحيح (True)", textEn: "True" },
          { id: "false", textAr: "خطأ (False)", textEn: "False" }
        ],
        correctOptionId: "true",
        explanationAr: "نعم، الغنة تتبع ما بعدها تفخيماً وترقيقاً.",
        explanationEn: "Yes, the Ghunnah follows the letter that succeeds it in heaviness or lightness."
      }
    ]
  };
}

function getMockIslamicStudies(category, topic, duration) {
  return {
    metadata: {
      category: category || "العقيدة (Aqeedah)",
      topic: topic || "أركان الإيمان الستة وثمارها في الحياة",
      durationMinutes: duration || 45,
      audienceLevel: "Youth & Reverts (Bilingual)",
      languageMode: "bilingual"
    },
    blueprint: [
      {
        phaseNumber: 1,
        phaseNameAr: "المقدمة والتشويق (The Hook)",
        phaseNameEn: "Hook & Engaging Question",
        allocatedMinutes: 5,
        teacherGuidanceAr: "اطرحي سؤالاً تفاعلياً على الطالبات في زوم: ما الفرق بين مجرد التصديق العقلي وبين اليقين الذي يغير سلوكنا اليومي؟",
        teacherGuidanceEn: "Ask a reflective question: How does knowing Allah sees us transform how we feel when alone or stressed?",
        talkingPoints: [
          "الترحيب والافتتاح بالحمد والصلاة على رسول الله",
          "ربط مفهوم الإيمان بالسكينة والطمأنينة النفسية"
        ]
      },
      {
        phaseNumber: 2,
        phaseNameAr: "التأصيل الشرعي والأدلة",
        phaseNameEn: "Core Evidences & Hadith of Jibreel",
        allocatedMinutes: 20,
        teacherGuidanceAr: "عرض حديث جبريل المشهور وتفصيل الأركان الستة مع التركيز على ركن الإيمان بالقدر.",
        teacherGuidanceEn: "Walk through the famous Hadith of Jibreel, breaking down the 6 pillars with emphasis on Qadar (Destiny).",
        talkingPoints: [
          "الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره",
          "الفرق بين الإسلام والإيمان والإحسان"
        ]
      },
      {
        phaseNumber: 3,
        phaseNameAr: "التطبيق العملي في واقع المسلم المعاصر",
        phaseNameEn: "Real-Life Application & Emotional Resilience",
        allocatedMinutes: 15,
        teacherGuidanceAr: "كيف يعالج الإيمان بالقضاء والقدر مشاعر القلق والاكتئاب والندم على ما فات؟",
        teacherGuidanceEn: "Equipping students with the prophetic mindset: 'If something befalls you, say: Qaddar Allah wa ma sha'a fa'al'.",
        talkingPoints: [
          "استشعار معية الله في الدراسة والعمل والصعوبات",
          "التخلص من كلمة 'لو' المحبطة واستبدالها بالرضا والعمل الإيجابي"
        ]
      },
      {
        phaseNumber: 4,
        phaseNameAr: "الخاتمة والواجب المنزلي",
        phaseNameEn: "Reflection, Wrap-up & Family Habit",
        allocatedMinutes: 5,
        teacherGuidanceAr: "توزيع ملخص الواتساب ومطالبة كل طالبة بمشاركة ثمرة واحدة شعرت بها هذا الأسبوع.",
        teacherGuidanceEn: "Share the WhatsApp summary card and prompt each student to write one personal realization.",
        talkingPoints: [
          "دعاء الختام وكفارة المجلس",
          "تذكير باختبار المراجعة التفاعلي"
        ]
      }
    ],
    evidences: [
      {
        type: "hadith",
        arabicText: "قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ، قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَاليَوْمِ الآخِرِ، وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ».",
        englishTranslation: "He said: 'Tell me about Faith.' The Prophet ﷺ replied: 'It is to believe in Allah, His Angels, His Books, His Messengers, the Last Day, and to believe in Divine Destiny, both its good and bad.'",
        citation: "صحيح مسلم (Sahih Muslim #8)",
        narrator: "عمر بن الخطاب رضي الله عنه",
        grading: "صحيح (Sahih - Highest Authenticity)",
        authenticityBadge: true
      },
      {
        type: "quran",
        arabicText: "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ",
        englishTranslation: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers...",
        citation: "سورة البقرة (Surah Al-Baqarah 2:285)",
        narrator: "—",
        grading: "متواتر قطعي الثبوت (Quranic Text)",
        authenticityBadge: true
      }
    ],
    zoomCards: [
      {
        slideNumber: 1,
        titleAr: "ما هو الإيمان الحقيقي؟",
        titleEn: "What is True Iman?",
        bodyAr: "الإيمان ليس مجرد أمنية باللسان، بل هو ما وقر في القلب وصدقه العمل الصالح.",
        bodyEn: "Iman is not a mere passive sentiment; it is that which settles firmly in the heart and is substantiated by righteous actions.",
        practicalAction: "جددي نيتك اليومية في كل طاعة صغيرة تقومين بها."
      },
      {
        slideNumber: 2,
        titleAr: "الإيمان بالقدر راحة للقلوب",
        titleEn: "Destiny: The Antidote to Anxiety",
        bodyAr: "«مَا أَصَابَكَ لَمْ يَكُنْ لِيُخْطِئَكَ، وَمَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ».",
        bodyEn: "What has reached you was never meant to miss you, and what missed you was never meant to reach you.",
        practicalAction: "عند حدوث مكروه، قولي فوراً: قدر الله وما شاء فعل."
      }
    ],
    whatsAppKit: {
      headline: "🌿 خلاصة درس اليوم: أركان الإيمان الستة وسكينة القلب 🌿",
      formattedText: `السلام عليكم ورحمة الله وبركاته يا غاليات 🌸\n\n📌 *موضوع حلقتنا اليوم:* أركان الإيمان وثمارها العملية\n\n✨ *أهم الفوائد المستفادة:*\n1️⃣ الإيمان ستة أركان: بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره.\n2️⃣ من عرف ربه باسمائه وصفاته استراح قلبه من القلق والخوف من المستقبل.\n3️⃣ الإيمان بالقضاء والقدر يمحو كلمة "لو" المحبطة ويملأ الروح بالرضا.\n\n📖 *آية الأسبوع للتأمل:* ﴿ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ﴾ [البقرة: 285]\n\n🎯 *الواجب العملي:* ترديد ذكر "رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً" صباحاً ومساءً باستشعار عميق.\n\n🔗 رابط الاختبار القصير للمراجعة الذاتية في المنصة. دمتم في حفظ الله ورعايته! 🤍`,
      actionItem: "شاركوا أثر الدرس في قلوبكم عبر المجموعة!"
    },
    reviewQuiz: [
      {
        id: 1,
        questionAr: "أي من الأركان التالية يدخل ضمن أركان الإيمان الستة وليس من أركان الإسلام الخمسة؟",
        questionEn: "Which of the following is one of the Six Pillars of Iman and NOT of the Five Pillars of Islam?",
        options: [
          { id: "a", textAr: "إيتاء الزكاة", textEn: "Giving Zakah" },
          { id: "b", textAr: "الإيمان بالقدر خيره وشره", textEn: "Belief in Divine Destiny (Qadar)" },
          { id: "c", textAr: "صوم رمضان", textEn: "Fasting Ramadan" },
          { id: "d", textAr: "حج البيت", textEn: "Hajj pilgrimage" }
        ],
        correctOptionId: "b",
        reflectionPrompt: "الإيمان بالقدر يورث الرضا عند البلاء والشكر عند النعماء."
      },
      {
        id: 2,
        questionAr: "من هو الصحابي الجليل راوي حديث جبريل الطويل في بيان الإسلام والإيمان والإحسان؟",
        questionEn: "Who is the noble Companion who narrated the comprehensive Hadith of Jibreel?",
        options: [
          { id: "a", textAr: "أبو بكر الصديق رضي الله عنه", textEn: "Abu Bakr As-Siddiq" },
          { id: "b", textAr: "عمر بن الخطاب رضي الله عنه", textEn: "Umar ibn Al-Khattab" },
          { id: "c", textAr: "أبو هريرة رضي الله عنه", textEn: "Abu Hurairah" },
          { id: "d", textAr: "عبدالله بن عمر رضي الله عنهما", textEn: "Abdullah ibn Umar" }
        ],
        correctOptionId: "b",
        reflectionPrompt: "قال عمر: بينما نحن عند رسول الله ﷺ ذات يوم إذ طلع علينا رجل شديد بياض الثياب..."
      }
    ]
  };
}

// Request dispatcher
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-mishkah-pin, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Verify PIN Endpoint
  if (req.method === 'POST' && pathname === '/api/verify-pin') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { pin } = JSON.parse(body || '{}');
        const isValid = (pin && pin.trim().toUpperCase() === TEACHER_PIN.toUpperCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: isValid }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  // Generator Endpoints (Unified /api/generate, /api/generate/tajweed, /api/generate/islamic-studies)
  // Shared between Vercel Serverless Function and Local Node HTTP Server
  if (pathname === '/api/generate' || pathname === '/api/generate/tajweed' || pathname === '/api/generate/islamic-studies') {
    return apiGenerateHandler(req, res);
  }

  // Tajweed Generator Endpoint
  if (req.method === 'POST' && pathname === '/api/generate/tajweed') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { surah, ayahRange, rule, languageMode, textbookContext } = payload;

        // If not authorized or demo mode requested
        if (!isPinAuthorized && !payload.isDemo) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized. Teacher PIN required.' }));
          return;
        }

        // Try AI generation, fallback to curated response
        if (GEMINI_API_KEY && !payload.forceOffline) {
          try {
            const userPrompt = `Generate a complete teaching lesson blueprint for:
Surah: ${surah || 'Al-Mulk'}
Ayah Range: ${ayahRange || '1-5'}
Target Tajweed Rule: ${rule || 'Noon Sakinah & Tanween - Ikhfaa'}
Language Mode: ${languageMode || 'bilingual'}
Textbook Reference Context: ${textbookContext || 'Standard Czerepinski / Dr. Ayman Suwayd guidelines'}

Adhere strictly to the requested JSON response schema.`;

            const aiResponse = await callGemini(TAJWEED_SYSTEM_PROMPT, userPrompt, TAJWEED_SCHEMA);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ source: 'gemini_ai', data: aiResponse }));
            return;
          } catch (aiErr) {
            console.warn('AI call failed, serving enriched verified fallback:', aiErr.message);
          }
        }

        // Return instant rich verified fallback
        const mockData = getMockTajweed(surah, ayahRange, rule);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ source: 'verified_preset', data: mockData }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Islamic Studies Generator Endpoint
  if (req.method === 'POST' && pathname === '/api/generate/islamic-studies') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { category, topic, duration, audienceLevel, languageMode, referenceText } = payload;

        if (!isPinAuthorized && !payload.isDemo) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized. Teacher PIN required.' }));
          return;
        }

        if (GEMINI_API_KEY && !payload.forceOffline) {
          try {
            const userPrompt = `Prepare a verified Islamic Studies lesson blueprint:
Subject Category: ${category || 'Aqeedah'}
Lesson Topic: ${topic || 'Pillars of Faith'}
Target Duration: ${duration || 45} minutes
Audience: ${audienceLevel || 'Youth & Reverts'}
Language Mode: ${languageMode || 'bilingual'}
Reference Context: ${referenceText || 'Standard Sahih Hadith & Quranic Tafseer'}

Enforce strict Hadith verification (Narrator + Book + Sahih status) and time-boxed minutes.`;

            const aiResponse = await callGemini(ISLAMIC_STUDIES_SYSTEM_PROMPT, userPrompt, ISLAMIC_STUDIES_SCHEMA);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ source: 'gemini_ai', data: aiResponse }));
            return;
          } catch (aiErr) {
            console.warn('AI call failed, serving enriched verified fallback:', aiErr.message);
          }
        }

        const mockData = getMockIslamicStudies(category, topic, duration);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ source: 'verified_preset', data: mockData }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Health check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', pwa: true, aiConnected: !!GEMINI_API_KEY }));
    return;
  }

  // Static File Serving
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const publicDir = path.join(__dirname, 'public');
  let filePath = path.join(publicDir, relativePath);

  // Fallback to index.html for SPA/PWA routing
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(publicDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✨ Mishkah (مِشكاة) Copilot Server running on port ${PORT}`);
  console.log(`🔒 Security Gate: Teacher PIN protection ACTIVE (PIN: ${TEACHER_PIN})`);
  console.log(`🤖 AI Engine: Gemini 3.1/3.5/3.8 Flash Proxy Ready`);
  console.log(`📱 PWA: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
