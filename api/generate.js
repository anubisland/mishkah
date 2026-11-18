/**
 * مِشكاة | Mishkah — نظام التشغيل الشامل للداعية والمعلم الشرعي
 * File: api/generate.js
 * Description: Vercel Serverless Function & Local API Proxy with Pre-loaded Demo Lessons
 */

const https = require('https');

// System Prompts
const TAJWEED_SYSTEM_PROMPT = `You are Mishkah Tajweed Copilot, a master Islamic scholar and certified Senior Qari'ah in Hafs 'an 'Aasim.
Generate a structured, authoritative Tajweed lesson blueprint for online educators (Zoom).
Strict pedagogical rules:
1. Uthmani Quranic text with complete diacritics.
2. Dual Arabic & English terminology.
3. Anatomical accuracy for articulation points (Makharij & Sifat).
4. Pedagogical zoom presentation cards with teacher prompts.
5. Printable student worksheet and teacher answer key.
6. 5-question interactive quiz.
Return ONLY valid JSON matching the requested schema.`;

const ISLAMIC_STUDIES_SYSTEM_PROMPT = `You are Mishkah Islamic Studies Copilot, a verified senior Da'iyah and Islamic curriculum architect.
Generate a structured, time-boxed Zoom lesson plan (30, 45, or 60 min).
Zero Hallucination Guardrail:
1. Every Quranic ayah must cite Surah name and Ayah number accurately.
2. Every Hadith MUST include: Companion narrator, primary source book (Sahih al-Bukhari, Sahih Muslim), and authenticity grade (Sahih).
3. 1-Click WhatsApp Parent/Student broadcast summary (10 lines with emojis).
4. Printable student worksheet and teacher answer key.
Return ONLY valid JSON matching the requested schema.`;

// Pre-loaded Demo Lessons
const PRELOADED_DEMO_TAJWEED = {
  metadata: {
    surah: 'سورة الملك (Al-Mulk)',
    ayahRange: '1–10',
    ruleNameAr: 'الإخفاء الحقيقي (Al-Ikhfaa Al-Haqiqi)',
    ruleNameEn: 'True Concealment (Ikhfaa)',
    languageMode: 'bilingual',
    textbookSource: 'منهاج التدريس المعتمد — الدكتورة كريمة سيربنسكي والدكتور أيمن سويد'
  },
  ruleDefinition: {
    arabic: 'الإخفاء لغةً: السَّتْر. واصطلاحاً: النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام، عارٍ عن التشديد مع بقاء الغُنّة بمقدار حركتين عند ملاقاة أحد حروف الإخفاء الخمسة عشر (صف ذا ثنا كم جاد شخص قد سما دم طيبا زد في تقى ضع ظالما).',
    english: 'Linguistically: Concealment. Technically: Pronouncing Noon Sakinah or Tanween in an intermediate state between Izhar (clarity) and Idgham (merging), without shaddah, while retaining a 2-count nasal Ghunnah when followed by any of the 15 Ikhfaa letters.',
    anatomicalMakhrajAr: 'يخرج صوت الغنة من الخيشوم (أعلى التجويف الأنفي)، مع تجافي طرف اللسان قليلاً عن لثة الأسنان العليا بحيث لا يلتصق بها، وتهيئة مخرج الحرف التالي مباشرة.',
    anatomicalMakhrajEn: 'The Ghunnah resonates in the Khayshoom (nasal cavity). The tip of the tongue is kept slightly away from the upper gums without firm contact, positioning the mouth directly at the articulation point of the upcoming letter.',
    timingOrHarakat: 'حركتان متساويتان (2 counts)',
    commonMistakes: [
      'إلصاق اللسان بالحنك الأعلى أو الأسنان مما يحيل الإخفاء إلى إظهار صريح (Pressing tongue firmly against palate)',
      'المبالغة في مد الحركة السابقة للنون حتى يتولد حرف مد زائد مثل: كُنتم -> كوونتم (Over-saturating prior vowels into long vowels)',
      'خلط تفخيم الغنة وترقيقها، إذ تتبع الغنة الحرف الذي بعدها تفخيماً وترقيقاً (Failing to match Ghunnah heaviness/lightness to next letter)'
    ]
  },
  presentationCards: [
    {
      cardIndex: 1,
      titleAr: 'الشاهد الأول: إخفاء التنوين بغنة مفخمة',
      titleEn: 'Card 1: Ikhfaa with Heavy Ghunnah',
      ayahTextUthmani: 'تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ',
      highlightedPortion: 'شَىْءٍۢ قَدِيرٌ',
      tajweedColor: 'emerald',
      explanationAr: 'تنوين كسر بعده حرف القاف (مفخم من أقصى اللسان). تُفخم الغنة لتناسب استعلاء القاف.',
      explanationEn: 'Tanween followed by heavy letter Qaf. Produce a deep, elevated nasal Ghunnah.',
      teacherPrompt: 'Ensure student elevates the back of tongue for Qaf without rounding the lips.'
    },
    {
      cardIndex: 2,
      titleAr: 'الشاهد الثاني: إخفاء النون بغنة مرققة رقيقة',
      titleEn: 'Card 2: Ikhfaa with Light Delicate Ghunnah',
      ayahTextUthmani: 'مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍۢ',
      highlightedPortion: 'مِن تَفَـٰوُتٍۢ',
      tajweedColor: 'emerald',
      explanationAr: 'نون ساكنة بعدها حرف التاء (حرف مستفل مرقق). ترقق الغنة تماماً.',
      explanationEn: 'Noon Sakinah followed by light letter Taa. Produce a soft, delicate nasal Ghunnah.',
      teacherPrompt: 'Check that student keeps tongue relaxed and mouth opening horizontal.'
    },
    {
      cardIndex: 3,
      titleAr: 'الشاهد الثالث: الإخفاء في كلمة واحدة مع القلقلة',
      titleEn: 'Card 3: Ikhfaa Within a Single Word with Qalqalah',
      ayahTextUthmani: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًۭا',
      highlightedPortion: 'يَنقَلِبْ',
      tajweedColor: 'amber',
      explanationAr: 'نون ساكنة بعدها قاف في كلمة واحدة (يَنقَلِبْ) مع قلقلة صغرى في الباء.',
      explanationEn: 'Noon Sakinah followed by Qaf within single word (Yanqalib) followed by subtle Qalqalah on Baa.',
      teacherPrompt: 'Remind student to transition smoothly from nasal Ghunnah to clear Qalqalah.'
    }
  ],
  worksheet: {
    studentTasks: [
      {
        questionAr: 'استخرجي موضع الإخفاء من قوله تعالى: (تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ) وبيني حرف الإخفاء.',
        questionEn: 'Identify the Ikhfaa in Surah Al-Mulk:1 and state the following letter.',
        type: 'written'
      },
      {
        questionAr: 'هل تفخم الغنة عند ملاقاة حرف التاء في قوله تعالى (مِن تَفَـٰوُتٍۢ)؟ عللي إجابتك.',
        questionEn: 'Is the Ghunnah heavy or light when meeting letter Taa in (Min Tafaawut)? Explain why.',
        type: 'reasoning'
      },
      {
        questionAr: 'كم حركة يمد صوت الغنة في الإخفاء الحقيقي؟',
        questionEn: 'How many counts is the Ghunnah held during True Ikhfaa?',
        type: 'short_answer'
      }
    ],
    teacherAnswerKey: [
      'الموضع: (شَىْءٍۢ قَدِيرٌ) — حرف الإخفاء هو القاف، والغنة هنا مفخمة لأن القاف حرف استعلاء.',
      'ترقق الغنة لأن حرف التاء حرف استفال مرقق، والغنة تتبع ما بعدها تفخيماً وترقيقاً.',
      'يمد صوت الغنة حركتين متساويتين دون زيادة أو تمطيط.'
    ]
  },
  quiz: [
    {
      id: 1,
      questionAr: 'ما هو مخرج صوت الغنة في حكم الإخفاء الحقيقي؟',
      questionEn: 'Where does the sound of Ghunnah originate during Ikhfaa?',
      options: ['الجوف (Oral Cavity)', 'الخيشوم (Nasal Cavity)', 'الشفتان (The Lips)', 'وسط اللسان (Mid-tongue)'],
      correctIndex: 1,
      explanation: 'صوت الغنة يخرج كاملاً من الخيشوم (تجويف الأنف) بمقدار حركتين.'
    },
    {
      id: 2,
      questionAr: 'كم عدد حروف الإخفاء الحقيقي للنون الساكنة والتنوين؟',
      questionEn: 'How many letters trigger True Ikhfaa for Noon Sakinah & Tanween?',
      options: ['6 حروف', '4 حروف', '15 حرفاً', 'حرف واحد'],
      correctIndex: 2,
      explanation: 'حروف الإخفاء خمسة عشر حرفاً جمعت في أوائل كلمات بيت تحفة الأطفال: صف ذا ثنا كم جاد شخص قد سما دم طيبا زد في تقى ضع ظالما.'
    },
    {
      id: 3,
      questionAr: 'تتبع الغنة ما بعدها من حيث التفخيم والترقيق:',
      questionEn: 'The Ghunnah follows the upcoming letter in heaviness and lightness:',
      options: ['صواب (True)', 'خطأ (False)'],
      correctIndex: 0,
      explanation: 'قاعدة التجويد تنص على أن غنة الإخفاء تتبع الحرف الذي يليها، فإن كان مفخماً فخمت وإن كان مرققاً رققت.'
    },
    {
      id: 4,
      questionAr: 'في قوله تعالى (شَىْءٍۢ قَدِيرٌ)، حكم الغنة هو:',
      questionEn: 'In the phrase (Shay-in Qadeer), the Ghunnah must be:',
      options: ['مرققة دائماً', 'مفخمة لاستعلاء القاف', 'تسقط الغنة تماماً', 'تمد 6 حركات'],
      correctIndex: 1,
      explanation: 'القاف حرف استعلاء مفخم، لذا تفخم الغنة قبله لتلائم وضعية اللسان.'
    },
    {
      id: 5,
      questionAr: 'الخطأ الشائع عند نطق الإخفاء بإلصاق اللسان بالحنك الأعلى يؤدي إلى تحويله إلى:',
      questionEn: 'Pressing the tongue against the palate during Ikhfaa mistakenly turns it into:',
      options: ['إدغام بغنة', 'إظهار حلقي', 'إقلاب', 'مد متصل'],
      correctIndex: 1,
      explanation: 'إلصاق اللسان يغلق المخرج الفموي ويقطع الهواء مما ينتج نوناً مظهرة صريحة وهو لحن تجويدي.'
    }
  ]
};

const PRELOADED_DEMO_AQEEDAH = {
  metadata: {
    category: 'العقيدة الإسلامية (Aqeedah)',
    topic: 'أركان الإيمان الستة وأثرها في السكينة النفسية وعلاج القلق المعاصر',
    durationMinutes: 45,
    targetAudience: 'اليافعين، الطالبات، والمهتدين الجدد (Bilingual Youth & Adults)',
    primaryQuranReference: 'سورة البقرة: الآية 285 — (ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ)',
    primaryHadithReference: {
      hadithText: 'أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
      narrator: 'أمير المؤمنين عمر بن الخطاب رضي الله عنه (حديث جبريل الطويل)',
      bookSource: 'صحيح مسلم — كتاب الإيمان — حديث رقم (8)',
      authenticity: 'صحيح مجمع عليه بأعلى درجات التوثيق'
    }
  },
  lessonPlan: [
    {
      timeRange: '00:00 – 00:08',
      phaseNameAr: 'المدخل التربوي وجذب الانتباه (The Hook)',
      phaseNameEn: 'Psychological Hook & Relevance',
      descriptionAr: 'طرح إشكالية القلق المستقبلي والشعور بالضياع في العصر الرقمي، وكيف تقدم عقيدة الإيمان بالله والقدر الحصن النفسي المتين للإنسان.',
      teacherInstructions: 'Ask students via Zoom poll: "What causes you the most anxiety about tomorrow?" Connect answers directly to faith in Allah\'s wisdom.'
    },
    {
      timeRange: '00:08 – 00:25',
      phaseNameAr: 'تأصيل الأركان الستة بالأدلة (Core Evidences)',
      phaseNameEn: 'Core Scriptural Evidence & Meaning',
      descriptionAr: 'استعراض أركان الإيمان الستة: 1. الإيمان بالله 2. الملائكة 3. الكتب 4. الرسل 5. اليوم الآخر 6. القدر خيره وشره، مع شرح آية البقرة وحديث مسلم.',
      teacherInstructions: 'Display the 6 Pillars Infographic slide; pause on belief in Qadar (Divine Decree) as the supreme antidote to regret.'
    },
    {
      timeRange: '00:25 – 00:38',
      phaseNameAr: 'التطبيقات الحياتية المعاصرة (Real-Life Application)',
      phaseNameEn: 'Practical Daily Living & Tazkiyah',
      descriptionAr: 'كيف تترجم الفتاة المسلمة الإيمان بالملائكة (رقابة ذاتية بلا كاميرات)، والإيمان بالقدر (راحة البال بعد بذل الأسباب).',
      teacherInstructions: 'Facilitate a 5-minute Zoom breakout discussion: How does knowing Allah has a plan change how you react to exam stress or rejection?'
    },
    {
      timeRange: '00:38 – 00:45',
      phaseNameAr: 'الخاتمة والتكليف المنزلي (Wrap-up & Homework)',
      phaseNameEn: 'Action Item & Closing Duaa',
      descriptionAr: 'تلخيص النقاط الذهبية الثلاث للحلقة، إطلاق تحدي الأسبوع (ورد التفويض والتوكل اليومي)، والدعاء.',
      teacherInstructions: 'Copy and send the 1-Click WhatsApp Kit directly to students and parents.'
    }
  ],
  discussionQuestions: [
    {
      questionAr: 'ما الفرق بين التوكل الشرعي والتواكل الكسول في ضوء الإيمان بالقدر؟',
      questionEn: 'What is the critical difference between true Tawakkul and passive laziness?'
    },
    {
      questionAr: 'كيف يمنحنا الإيمان باليوم الآخر العدالة النفسية المطلقة عند التعرض للظلم؟',
      questionEn: 'How does firm belief in the Day of Judgement bring absolute emotional peace when wronged?'
    }
  ],
  whatsappBroadcastKit: `🌿 *مِشكاة — ملخص حلقة العقيدة الإسلامية* 🌿
📍 *موضوع الدرس:* أركان الإيمان الستة وأثرها في السكينة النفسية
⏱️ *المدة:* 45 دقيقة تفاعلية عبر زوم

✨ *أهم مخرجات الحلقة:*
1️⃣ ترسيخ أركان الإيمان الستة كما جاءت في صحيح مسلم (حديث جبريل عليه السلام).
2️⃣ الإيمان بالقدر خيره وشره هو البلسم الشافي للقلق والخوف من المجهول.
3️⃣ استشعار مراقبة الله وكتابة الملائكة يورث الطمأنينة وعفة السريرة.

📖 *آية الأسبوع للتأمل والتكرار:*
{ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ} [البقرة: 285]

🎯 *تحدي الأسبوع للطالبات:*
تطبيق سنة النبي ﷺ عند حدوث ما نكره: قول: «قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ» وتدوين أثرها في دفتر السكينة.

🌸 جزاكم الله خيراً ونسأل الله أن يبارك في بناتنا وشبابنا.`
};

// Helper: Call Gemini API
function callGeminiAPI(apiKey, systemPrompt, userPrompt) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];

  return new Promise(async (resolve, reject) => {
    let lastErr = null;

    for (const model of models) {
      try {
        const payload = JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const options = {
          hostname: 'generativelanguage.googleapis.com',
          port: 443,
          path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        };

        const result = await new Promise((resInner, rejInner) => {
          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                  const parsed = JSON.parse(data);
                  const candidate = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (candidate) {
                    resInner(JSON.parse(candidate));
                  } else {
                    rejInner(new Error('Empty candidate received from Gemini'));
                  }
                } catch (parseErr) {
                  rejInner(new Error('Invalid JSON received: ' + parseErr.message));
                }
              } else {
                rejInner(new Error(`Gemini API HTTP ${res.statusCode}: ${data.slice(0, 150)}`));
              }
            });
          });

          req.on('error', rejInner);
          req.setTimeout(12000, () => {
            req.destroy();
            rejInner(new Error('Gemini API timeout after 12s'));
          });
          req.write(payload);
          req.end();
        });

        return resolve({ modelUsed: model, data: result });
      } catch (err) {
        lastErr = err;
        console.warn(`[Mishkah Gemini Fallback] ${model} failed, attempting next model:`, err.message);
      }
    }

    reject(lastErr || new Error('All Gemini fallback models exhausted'));
  });
}

// Universal Handler compatible with both Vercel Serverless Function & standard Node http.Server
module.exports = async function handler(req, res) {
  // CORS Headers
  const setHeaders = () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-mishkah-pin');
  };
  setHeaders();

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Parse Body if not already parsed by Vercel
  let body = req.body;
  if (!body || typeof body === 'string') {
    if (typeof body === 'string' && body.length > 0) {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    } else {
      body = await new Promise(resolve => {
        let raw = '';
        req.on('data', chunk => { raw += chunk; });
        req.on('end', () => {
          try { resolve(JSON.parse(raw || '{}')); } catch (_) { resolve({}); }
        });
      });
    }
  }
  body = body || {};

  const apiKey = process.env.GEMINI_API_KEY || '';
  const configuredPin = (process.env.MISHKAH_TEACHER_PIN || 'MISHKAH2026').toUpperCase();
  const incomingPin = (req.headers['x-mishkah-pin'] || body.pin || '').toString().trim().toUpperCase();
  const isPinValid = (incomingPin === configuredPin);

  const parsedUrl = new URL(req.url, 'http://localhost');
  const queryType = (req.query && req.query.type) || parsedUrl.searchParams.get('type') || '';
  const reqType = (body.type || body.module || queryType).toLowerCase();
  const isAqeedahOrIslamic = reqType.includes('islamic') || reqType.includes('aqeedah') || body.category;

  // 1. Direct Pre-loaded Demo Mode (No PIN required, instant zero-latency return)
  if (body.mode === 'demo' || body.isDemo || req.method === 'GET') {
    if (isAqeedahOrIslamic) {
      const responsePayload = {
        success: true,
        source: 'preloaded_demo_preset',
        data: PRELOADED_DEMO_AQEEDAH
      };
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(responsePayload));
      return;
    } else {
      const responsePayload = {
        success: true,
        source: 'preloaded_demo_preset',
        data: PRELOADED_DEMO_TAJWEED
      };
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(responsePayload));
      return;
    }
  }

  // 2. PIN Security Gate for Live AI Generation
  if (!isPinValid) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    res.end(JSON.stringify({
      success: false,
      error: 'Unauthorized: Valid Teacher PIN required for live AI generation. (Use demo mode for instant preview).'
    }));
    return;
  }

  // 3. Live AI Generation with Gemini
  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured on hosting environment.');
    }

    if (isAqeedahOrIslamic) {
      const userPrompt = `Generate an authentic, high-impact Islamic Studies Zoom lesson:
Subject Category: ${body.category || 'العقيدة الإسلامية (Aqeedah)'}
Lesson Topic: ${body.topic || 'أركان الإيمان الستة وأثرها في السكينة النفسية'}
Duration: ${body.duration || 45} minutes
Audience: ${body.audienceLevel || 'Bilingual Youth & Adults'}
Language: Bilingual (Arabic RTL primary, English LTR secondary)
Ensure strict authentic Hadith citation (Sahih al-Bukhari/Muslim, Companion narrator) and complete time-boxed Zoom breakdown.`;

      const aiRes = await callGeminiAPI(apiKey, ISLAMIC_STUDIES_SYSTEM_PROMPT, userPrompt);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        source: 'gemini_ai',
        model: aiRes.modelUsed,
        data: aiRes.data
      }));
      return;
    } else {
      // Tajweed
      const userPrompt = `Generate a rigorous Tajweed lesson blueprint:
Surah: ${body.surah || 'سورة الملك'}
Ayah Range: ${body.ayahRange || '1–10'}
Target Tajweed Rule: ${body.rule || 'الإخفاء الحقيقي (True Concealment)'}
Language: Bilingual (Arabic & English)
Reference: Czerepinski & Dr. Ayman Suwayd Certified Standard.
Provide exact Uthmani text, 3 Zoom presentation cards, anatomical articulation points, common mistakes, worksheet, and 5-question quiz.`;

      const aiRes = await callGeminiAPI(apiKey, TAJWEED_SYSTEM_PROMPT, userPrompt);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        source: 'gemini_ai',
        model: aiRes.modelUsed,
        data: aiRes.data
      }));
      return;
    }
  } catch (apiErr) {
    console.warn('[Mishkah API Fallback] Serving verified curriculum preset:', apiErr.message);
    // Graceful fallback to verified curriculum preset
    const fallbackData = isAqeedahOrIslamic ? PRELOADED_DEMO_AQEEDAH : PRELOADED_DEMO_TAJWEED;
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      source: 'verified_preset_fallback',
      warning: 'Live AI temporarily unavailable; loaded verified pedagogical curriculum.',
      data: fallbackData
    }));
  }
};

module.exports.PRELOADED_DEMO_TAJWEED = PRELOADED_DEMO_TAJWEED;
module.exports.PRELOADED_DEMO_AQEEDAH = PRELOADED_DEMO_AQEEDAH;
