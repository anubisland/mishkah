const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original index.html length:', html.length);

// 1. Data constants for Islamic Studies Worksheets & Quizzes
const DATA_CONSTANTS = `
    // ================= BRANCH 3: ISLAMIC STUDIES WORKSHEETS (DATA) =================
    const ISLAMIC_BRANCH_WORKSHEETS = {
      aqeedah: {
        id: 'aqeedah',
        categoryAr: 'العقيدة الإسلامية',
        categoryEn: 'Islamic Creed (Aqeedah)',
        titleAr: 'ورقة عمل وتطبيق: أركان الإيمان الستة وأثرها في السكينة النفسية',
        titleEn: 'Worksheet: The Six Pillars of Faith & Psychological Peace',
        targetAudience: 'اليافعين والطالبات والمهتدين الجدد',
        quranRef: 'سورة البقرة: الآية 285 — ﴿ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ﴾',
        hadithRef: 'حديث جبريل الطويل (صحيح مسلم #8): «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ»',
        items: [
          {
            num: 1,
            topic: 'مراتب الدين الثلاث والفرق بينها',
            scripture: 'حديث جبريل (صحيح مسلم 8)',
            studentQuestion: 'اذكر مراتب الدين الثلاث بالترتيب التصاعدي مع بيان أعلى مرتبة وضابطها الشرعي.',
            teacherAnswer: 'مراتب الدين: 1. الإسلام (الاستسلام الظاهر بالجوارح والأركان الخمسة)، 2. الإيمان (التصديق الباطن بالقلب بالأركان الستة)، 3. الإحسان (أعلى المراتب: أن تعبد الله كأنك تراه فإن لم تكن تراه فإنه يراك).',
            practicalImpact: 'استشعار مراقبة الله في السر والعلن وإخلاص النية في كل عمل خفي.'
          },
          {
            num: 2,
            topic: 'الإيمان بالقضاء والقدر وعلاج القلق والندم',
            scripture: '﴿إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ﴾ [القمر: 49] وحديث مسلم 2664',
            studentQuestion: 'ما هو الهدي النبوي المأثور عند وقوع المكروه؟ وما أثر الإيمان بالقدر في محو كلمة "لو" المحبطة؟',
            teacherAnswer: 'الهدي النبوي: قول: «قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ». أثره: يورث التسليم التام لحكمة الله بعد بذل الأسباب المشروعة، ويقطع تسلط الشيطان وباب الحسرة والندم لأن ما أصابك لم يكن ليخطئك.',
            practicalImpact: 'استبدال الجزع والتسخط بالرضا والسكينة النفسية والبدء من جديد.'
          },
          {
            num: 3,
            topic: 'الإيمان بالملائكة الكرام وأثرها في الورع',
            scripture: '﴿وَإِنَّ عَلَيْكُمْ لَحَافِظِينَ كِرَامًا كَاتِبِينَ﴾ [الانفطار: 10-11]',
            studentQuestion: 'وضح وظائف كل من: (جبريل، ميكائيل، إسرافيل، ملك الموت)، وبيّن كيف يثمر الإيمان بالحفظة رقابة ذاتية؟',
            teacherAnswer: 'جبريل موكل بالوحي، ميكائيل بالقطر والنبات، إسرافيل بالنفخ في الصور، ملك الموت بقبض الأرواح. والإيمان بالكرام الكاتبين يثمر حياءً مستمراً من المعصية ومراقبة ذاتية بلا حاجة لكاميرات أرضية.',
            practicalImpact: 'عفة الجوارح واللسان عن الحرام في الخلوات والعوالم الرقمية.'
          },
          {
            num: 4,
            topic: 'مقتضى الشهادتين ونفي الشرك',
            scripture: '﴿فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ﴾ [محمد: 19]',
            studentQuestion: 'ما هو مقتضى شهادة أن لا إله إلا الله من حيث النفي والإثبات؟ مع ذكر مثال للشرك الأصغر.',
            teacherAnswer: 'النفي: (لا إله) نفي استحقاق العبادة عن كل ما سوى الله، الإثبات: (إلا الله) إثبات العبادة بجميع أنواعها لله وحده لا شريك له. والشرك الأصغر كالرياء الخفي (تحسين العمل لأجل نظر الناس).',
            practicalImpact: 'تجريد القصد لله وحده وعدم انتظار ثناء الناس أو مدحهم.'
          },
          {
            num: 5,
            topic: 'الإيمان باليوم الآخر واليقين بالجزاء',
            scripture: '﴿فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ﴾ [الزلزلة]',
            studentQuestion: 'كيف يحقق الإيمان باليوم الآخر والحساب العدالة النفسية التامة للمظلوم والزاهد في الدنيا؟',
            teacherAnswer: 'اليقين بأن الدنيا دار ابتلاء وفناء، وأن الحقوق المهدورة ستستوفى كاملة بميزان القسط يوم القيامة، مما يزيل الحقد واليأس ويجعل المسلم يستعلي بإيمانه على مغريات الحرام الفانية.',
            practicalImpact: 'العفو والصفح عند المقدرة والاطمئنان إلى عدالة الله المطلقة.'
          }
        ]
      },
      fiqh: {
        id: 'fiqh',
        categoryAr: 'الفقه وأحكام العبادات',
        categoryEn: 'Fiqh & Acts of Worship',
        titleAr: 'ورقة عمل وتطبيق: فقه الطهارة والصلاة وسجود السهو',
        titleEn: 'Worksheet: Purification, Prayer & Sujood As-Sahw',
        targetAudience: 'طلاب الحلقات والدارسين في فقه العبادات',
        quranRef: '﴿حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ﴾ [البقرة: 238]',
        hadithRef: 'حديث المسيء صلاته (صحيح البخاري #757): «ارْجِعْ فَصَلِّ فَإِنَّكَ لَمْ تُصَلِّ»',
        items: [
          {
            num: 1,
            topic: 'الفرق الفقهي بين شرط الصلاة وركنها',
            scripture: 'حديث: «لا يقبل الله صلاة بغير طهور» (مسلم)',
            studentQuestion: 'بيّن الفرق الجوهري بين شروط الصلاة وأركانها مع ذكر مثالين لكل منهما.',
            teacherAnswer: 'الشرط يسبق الدخول في الصلاة ويستمر معها (كالطهارة، ستر العورة، دخول الوقت، استقبال القبلة). الركن هو جزء من ماهية الصلاة وحقيقتها لا يسقط عمداً ولا سهواً (كتكبيرة الإحرام، الفاتحة، الركوع، السجود).',
            practicalImpact: 'التثبت من صحة الوضوء وستر العورة قبل تكبيرة الإحرام.'
          },
          {
            num: 2,
            topic: 'أحكام سجود السهو ومواضعه',
            scripture: 'حديث ابن مسعود وحديث ذي اليدين (صحيح مسلم 571 و 573)',
            studentQuestion: 'متى يكون سجود السهو قبل السلام؟ ومتى يكون بعد السلام؟ وما ضابط الشك؟',
            teacherAnswer: 'يسجد قبل السلام عند: 1. النقص (كنسيان التشهد الأول)، 2. الشك إذا بنى على الأقل (اليقين). ويسجد بعد السلام عند: 1. الزيادة (كركعة خامسة)، 2. الشك إذا ترجح لديه أحد الأمرين بالتحري.',
            practicalImpact: 'إدراك مرونة الشريعة وعدم بطلان الصلاة بالنسيان العارض وجبر الخلل.'
          },
          {
            num: 3,
            topic: 'نواقض الوضوء وما لا ينقضه',
            scripture: 'حديث أبي هريرة: «لا ينصرف حتى يسمع صوتاً أو يجد ريحاً» (البخاري 137)',
            studentQuestion: 'اذكر ثلاثة نواقض مجمع عليها للوضوء، ومسألتين شائعتين لا ينقض فيهما الوضوء.',
            teacherAnswer: 'النواقض: الخارج من السبيلين، زوال العقل بسكر أو إغماء، مس الفرج بشهوة (عند الجمهور). ولا ينقض: الشك الطارئ دون يقين، والنوم الخفيف المستقر الذي لا يزيل الإدراك كالنوم جالساً.',
            practicalImpact: 'قطع الوساوس الشيطانية في الطهارة والتمسك باليقين الثابت.'
          },
          {
            num: 4,
            topic: 'استدراك المسبوق في صلاة الجماعة',
            scripture: 'حديث: «ما أدركتم فصلوا وما فاتكم فأتموا» (متفق عليه)',
            studentQuestion: 'بم تدرك الركعة مع الإمام؟ وكيف يقضي المسبوق ما فاته بعد تسليم الإمام؟',
            teacherAnswer: 'تدرك الركعة بإدراك الركوع التام مع الإمام باطمئنان قبل رفعه. ويقوم المسبوق بعد تسليم الإمام دون تكبير ثانٍ ليتم ما فاته جاعلاً ما أدركه مع الإمام أول صلاته وما يقضيه آخرها على الراجح.',
            practicalImpact: 'السكينة والوقار عند القدوم للمسجد وعدم الجري السريع لإدراك الركوع.'
          }
        ]
      },
      seerah: {
        id: 'seerah',
        categoryAr: 'السيرة النبوية والتاريخ',
        categoryEn: 'Prophetic Biography (Seerah)',
        titleAr: 'ورقة عمل وتطبيق: معالم الهجرة النبوية وبناء مجتمع الأخوة',
        titleEn: 'Worksheet: Milestones of the Hijrah & Building Society',
        targetAudience: 'المستوى المتوسط والمتقدم في السيرة النبوية',
        quranRef: '﴿إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ﴾ [التوبة: 40]',
        hadithRef: 'حديث الغار (صحيح البخاري #3653): «يَا أَبَا بَكْرٍ، مَا ظَنُّكَ بِاثْنَيْنِ اللَّهُ ثَالِثُهُمَا؟»',
        items: [
          {
            num: 1,
            topic: 'التخطيط المحكم والأخذ بالأسباب في الهجرة',
            scripture: 'صحيح البخاري — كتاب مناقب الأنصار (باب هجرة النبي ﷺ)',
            studentQuestion: 'استخرج ثلاثة تدابير نبوية محكمة اتخذها النبي ﷺ في رحلة الهجرة تؤكد وجوب الأخذ بالأسباب.',
            teacherAnswer: '1. استئجار دليل خبير بالطريق (عبد الله بن أريقط ولو كان غير مسلم للأمانة والخبرة)، 2. السير في طريق الساحل الوعر خلافاً للمألوف، 3. توزيع الأدوار بدقة: مبيت علي للتمويه، أسماء للتموين، عبد الله بن أبي بكر للأخبار، عامر بن فهيرة لتعفية الآثار.',
            practicalImpact: 'الجمع بين التخطيط الاستراتيجي الدقيق والتوكل القلبي المطلق على الله.'
          },
          {
            num: 2,
            topic: 'وثيقة المدينة وتأسيس المواطنة العادلة',
            scripture: 'سيرة ابن هشام ومصنف ابن أبي شيبة (كتاب المغازي)',
            studentQuestion: 'ما هي أهم المبادئ الدستورية التي رسختها وثيقة المدينة بين المسلمين وسائر أطياف المجتمع؟',
            teacherAnswer: 'رسخت: 1. حرمة الدماء والأموال، 2. حرية الاعتقاد والتدين (لليهود دينهم وللمسلمين دينهم)، 3. الدفاع المشترك عن المدينة ضد أي عدوان خارجي، 4. مرجعية العدل والاحتكام لله ورسوله لردع الظالم.',
            practicalImpact: 'ترسيخ العدالة والتعايش السلمي والوفاء بالعهود والمواثيق مع الجميع.'
          },
          {
            num: 3,
            topic: 'أخلاق القيادة والعفو عند المقدرة',
            scripture: 'سنن البيهقي الكبرى ودلائل النبوة (فتح مكة)',
            studentQuestion: 'كيف تجلى كمال الخلق النبوي يوم فتح مكة تجاه أهل قريش الذين آذوه وأخرجوه؟',
            teacherAnswer: 'دخل مكة خافضاً رأسه تواضعاً لله حتى كادت لحيته تمس رحله، وخاطبهم قائلاً: «ما تظنون أني فاعل بكم؟ قالوا: أخ كريم وابن أخ كريم، فقال: لا تثريب عليكم اليوم، اذهبوا فأنتم الطلقاء».',
            practicalImpact: 'العفو عند المقدرة وعدم الانتقام للنفس وتغليب التسامح النبوي.'
          }
        ]
      },
      tazkiyah: {
        id: 'tazkiyah',
        categoryAr: 'الآداب والتزكية والأخلاق',
        categoryEn: 'Ethics, Etiquette & Purification (Tazkiyah)',
        titleAr: 'ورقة عمل وتطبيق: حفظ اللسان وبر الوالدين وطهارة السريرة',
        titleEn: 'Worksheet: Guarding the Tongue & Honoring Parents',
        targetAudience: 'كافة المستويات — بناء الشخصية المسلمة المتزنة',
        quranRef: '﴿وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا﴾ [الإسراء: 23]',
        hadithRef: 'حديث معاذ (سنن الترمذي #2616): «وَهَلْ يَكُبُّ النَّاسَ فِي النَّارِ عَلَى وُجُوهِهِمْ إِلَّا حَصَائِدُ أَلْسِنَتِهِمْ؟»',
        items: [
          {
            num: 1,
            topic: 'حفظ اللسان والتحذير من الغيبة والنميمة',
            scripture: '﴿وَلَا يَغْتَب بَّعْضُكُم بَعْضًا﴾ [الحجرات: 12] وحديث مسلم 2584',
            studentQuestion: 'عرّف الغيبة والبهتان كما بيّنهما النبي ﷺ، واذكر كفارة الغيبة المشروعة.',
            teacherAnswer: 'الغيبة: ذكرك أخاك بما يكره وهو فيه، والبهتان: أن تذكر ما ليس فيه كذباً. وكفارتها: التوبة الصادقة، والدعاء والاستغفار للمغتاب في المجالس التي اغتيب فيها وذكره بمحاسنه التي تعرفها.',
            practicalImpact: 'الإمساك عن الخوض في أعراض الناس وتطهير المجموعات الرقمية من السخرية.'
          },
          {
            num: 2,
            topic: 'بر الوالدين في حياتهما وبعد مماتهما',
            scripture: 'حديث: «رغم أنفه من أدرك أبويه عند الكبر أحدهما أو كليهما ثم لم يدخل الجنة» (مسلم 2551)',
            studentQuestion: 'ما هي أوجه الإحسان للوالدين بعد وفاتهما بصريح النصوص النبوية الشريفة؟',
            teacherAnswer: '1. الدعاء والاستغفار الدائم لهما، 2. إنفاذ عهدهما ووصاياهما المشروعة، 3. إكرام صديقهما وصلة الرحم التي لا توصل إلا بهما، 4. الصدقة الجارية وإهداء ثواب الحج والعمرة عنهما.',
            practicalImpact: 'خفض جناح الذل من الرحمة والمسارعة لإدخال السرور على قلوب الآباء والأمهات.'
          },
          {
            num: 3,
            topic: 'تحويل العادات اليومية إلى عبادات بالنية الصالحة',
            scripture: 'أثر معاذ بن جبل: «أما أنا فأنام وأقوم، فأحتسب نومتي كما أحتسب قومتي» (البخاري 4344)',
            studentQuestion: 'كيف يستطيع المسلم تحويل نومه وأكله ورياضته وساعات عمله إلى عبادات مأجورة يثاب عليها؟',
            teacherAnswer: 'باستحضار النية الصالحة القلبية؛ فينوي بنومه وأكله التقوي على طاعة الله ونفع المسلمين، وبدراسته وعمله عفة نفسه وأهله وخدمة دينه وأمته، فتصير العادات المباحة طاعات وعبادات.',
            practicalImpact: 'حضور النية في مطلع كل يوم وتجديد الإخلاص في تفاصيل الروتين اليومي.'
          }
        ]
      }
    };

    // ================= BRANCH 1: HIFZ TRACKING WORKSHEET (DATA) =================
    const HIFZ_BRANCH_WORKSHEET = {
      titleAr: 'سجل المتابعة والتقييم الأسبوعي لحلقة التحفيظ وضبط المتشابهات',
      titleEn: 'Weekly Quran Memorization & Mutashabihat Evaluation Sheet',
      criteria: [
        {
          num: 1,
          domain: 'الحفظ الجديد (New Memorization)',
          description: 'طلاقة الاسترسال وسرعة الاستحضار دون تردد أو تعتعة أو وقفات طويلة.',
          maxScore: 25
        },
        {
          num: 2,
          domain: 'أحكام التجويد ومخارج الحروف (Tajweed Accuracy)',
          description: 'تطبيق أحكام النون والميم الساكنتين، والمدود بأزمنتها، وإخراج الحروف من مخارجها الصحيحة.',
          maxScore: 25
        },
        {
          num: 3,
          domain: 'ضبط المتشابهات وفواصل الآيات (Mutashabihat Precision)',
          description: 'التمييز الدقيق بين الآيات المتطابقة مع السور الأخرى وعدم الخلط بين بدايات ونهايات الآيات.',
          maxScore: 25
        },
        {
          num: 4,
          domain: 'الوقف والابتداء والوقوف الحسن (Waqf & Ibtida)',
          description: 'الوقف على المعاني التامة وتجنب الوقف القبيح الذي يغير المعنى القرآني الجليل.',
          maxScore: 15
        },
        {
          num: 5,
          domain: 'الخشوع وحسن السمت والتأدب مع المصحف (Adab & Decorum)',
          description: 'التلاوة بوقار وسكينة ومراعاة آداب تلاوة كلام رب العالمين.',
          maxScore: 10
        }
      ]
    };

    // ================= INTERACTIVE QUIZZES DATA (BRANCH 3 & BRANCH 1) =================
    const ISLAMIC_BRANCH_QUIZZES = {
      aqeedah: [
        {
          id: 'aq_1',
          questionAr: 'ما هو الركن السادس من أركان الإيمان الستة المذكورة في حديث جبريل المشهور؟',
          questionEn: 'What is the 6th pillar of faith mentioned in the Hadith of Jibreel?',
          options: [
            { id: 'a', textAr: 'إيتاء الزكاة المفروضة', textEn: 'Paying Zakat' },
            { id: 'b', textAr: 'الإيمان بالقضاء والقدر خيره وشره', textEn: 'Belief in Divine Destiny (Qadar) good and bad' },
            { id: 'c', textAr: 'صيام شهر رمضان المبارك', textEn: 'Fasting Ramadan' },
            { id: 'd', textAr: 'الجهاد في سبيل الله', textEn: 'Jihad for the sake of Allah' }
          ],
          correctOptionId: 'b',
          explanationAr: 'أركان الإيمان ستة كما بين النبي ﷺ: أن تؤمن بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، وتؤمن بالقدر خيره وشره (صحيح مسلم #8).'
        },
        {
          id: 'aq_2',
          questionAr: 'من هو الصحابي الجليل راوي حديث جبريل الطويل في بيان مراتب الدين (الإسلام، الإيمان، الإحسان)؟',
          questionEn: 'Which companion narrated the renowned Hadith of Jibreel detailing Islam, Iman and Ihsan?',
          options: [
            { id: 'a', textAr: 'أبو بكر الصديق رضي الله عنه', textEn: 'Abu Bakr As-Siddiq' },
            { id: 'b', textAr: 'عمر بن الخطاب رضي الله عنه', textEn: 'Umar ibn Al-Khattab' },
            { id: 'c', textAr: 'أبو هريرة رضي الله عنه', textEn: 'Abu Hurairah' },
            { id: 'd', textAr: 'عبد الله بن مسعود رضي الله عنه', textEn: 'Abdullah ibn Mas\'ud' }
          ],
          correctOptionId: 'b',
          explanationAr: 'رواه أمير المؤمنين عمر بن الخطاب رضي الله عنه قائلاً: «بينما نحن عند رسول الله ﷺ ذات يوم إذ طلع علينا رجل شديد بياض الثياب...» (صحيح مسلم).'
        },
        {
          id: 'aq_3',
          questionAr: 'ما هو الهدي النبوي المأثور عند وقوع مكروه لطرد الحزن ودفع وسوسة كلمة "لو"؟',
          questionEn: 'What is the prophetic guidance when facing hardship to dispel regret and "if only"?',
          options: [
            { id: 'a', textAr: 'اللوم والشكوى للناس', textEn: 'Complaining to people' },
            { id: 'b', textAr: 'قول: «قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ»', textEn: 'Saying: "Qaddar Allahu wa maa shaa\'a fa\'ala"' },
            { id: 'c', textAr: 'التمني وتكرار لو فعلت كذا', textEn: 'Repeating if only I did that' },
            { id: 'd', textAr: 'ترك العمل والقعود', textEn: 'Abandoning work' }
          ],
          correctOptionId: 'b',
          explanationAr: 'قال النبي ﷺ: «وَإِنْ أَصَابَكَ شَيْءٌ فَلَا تَقُلْ لَوْ أَنِّي فَعَلْتُ كَانَ كَذَا وَكَذَا، وَلَكِنْ قُلْ: قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ، فَإِنَّ لَوْ تَفْتَحُ عَمَلَ الشَّيْطَانِ» (صحيح مسلم 2664).'
        },
        {
          id: 'aq_4',
          questionAr: 'ما هي أعلى وأشرف مراتب الدين الثلاث بعد مرتبتي الإسلام والإيمان؟',
          questionEn: 'What is the highest and noblest station among the three tiers of religion?',
          options: [
            { id: 'a', textAr: 'مرتبة الاستحسان', textEn: 'Station of preference' },
            { id: 'b', textAr: 'مرتبة الإحسان: أن تعبد الله كأنك تراه', textEn: 'Station of Ihsan: to worship Allah as if you see Him' },
            { id: 'c', textAr: 'مرتبة المجادلة والكلام', textEn: 'Station of argumentation' },
            { id: 'd', textAr: 'مرتبة الشكوى', textEn: 'Station of complaint' }
          ],
          correctOptionId: 'b',
          explanationAr: 'الإحسان هو قمة الدين وأعلاه: «أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ».'
        },
        {
          id: 'aq_5',
          questionAr: 'أي من الكتب السماوية التالية أنزله الله تعالى على نبيه داود عليه السلام؟',
          questionEn: 'Which divine book did Allah reveal to Prophet Dawud (David) peace be upon him?',
          options: [
            { id: 'a', textAr: 'التوراة', textEn: 'The Torah' },
            { id: 'b', textAr: 'الإنجيل', textEn: 'The Gospel' },
            { id: 'c', textAr: 'الزبور', textEn: 'The Zabur (Psalms)' },
            { id: 'd', textAr: 'صحف موسى', textEn: 'Scrolls of Moses' }
          ],
          correctOptionId: 'c',
          explanationAr: 'قال الله تعالى في سورة الإسراء والنساء: ﴿وَآتَيْنَا دَاوُودَ زَبُورًا﴾.'
        }
      ],
      fiqh: [
        {
          id: 'fq_1',
          questionAr: 'ما الفرق الجوهري بين "شرط الصلاة" و"ركن الصلاة" في الفقه الإسلامي؟',
          questionEn: 'What is the essential difference between a condition (Shart) and an integral pillar (Rukn) of prayer?',
          options: [
            { id: 'a', textAr: 'كلاهما يصح تركه عمداً وسهواً', textEn: 'Both can be skipped' },
            { id: 'b', textAr: 'الشرط يسبق الصلاة ويستمر معها، والركن جزء من حقيقة الصلاة وماهيتها', textEn: 'Shart precedes prayer and continues; Rukn is an integral part of prayer' },
            { id: 'c', textAr: 'الركن خارج الصلاة والشرط داخلها', textEn: 'Rukn is outside and Shart is inside' },
            { id: 'd', textAr: 'لا يوجد أي فرق بينهما', textEn: 'There is no difference' }
          ],
          correctOptionId: 'b',
          explanationAr: 'الشرط يكون قبل الدخول في الصلاة كالطهارة والوقت وستر العورة، بينما الركن جزء من صلب الصلاة كالركوع والسجود وتبطل الصلاة بتركه عمداً وسهواً إلا بالإتيان به.'
        },
        {
          id: 'fq_2',
          questionAr: 'إذا شك المصلي في صلاته الرباعية هل صلى ثلاثاً أم أربعاً ولم يترجح لديه شيء، فماذا يفعل؟',
          questionEn: 'If a worshipper doubts whether they prayed 3 or 4 rak\'ahs with no preponderance, what should they do?',
          options: [
            { id: 'a', textAr: 'يقطع الصلاة ويعيدها من جديد', textEn: 'Cut the prayer and restart' },
            { id: 'b', textAr: 'يبني على اليقين وهو الأقل (ثلاثاً) ويتم ثم يسجد للسهو قبل السلام', textEn: 'Build on certainty (the lesser: 3), finish and perform Sujood As-Sahw before Tasleem' },
            { id: 'c', textAr: 'يسلم فوراً دون ركعة رابعة', textEn: 'Immediately make Tasleem' },
            { id: 'd', textAr: 'يبني على الأكثر (أربعاً) ولا يسجد للسهو', textEn: 'Build on the greater (4)' }
          ],
          correctOptionId: 'b',
          explanationAr: 'لقول النبي ﷺ: «إذا شك أحدكم في صلاته فلم يدر كم صلى ثلاثاً أم أربعاً، فليطرح الشك وليبن على ما استيقن ثم يسجد سجدتين قبل أن يسلم» (صحيح مسلم 571).'
        },
        {
          id: 'fq_3',
          questionAr: 'ما حكم قراءة سورة الفاتحة في كل ركعة للإمام والمنفرد؟',
          questionEn: 'What is the ruling of reciting Surah Al-Fatihah in every rak\'ah for imam and solitary prayer?',
          options: [
            { id: 'a', textAr: 'سنة مستحبة تجبر بسجود السهو', textEn: 'Recommended Sunnah' },
            { id: 'b', textAr: 'ركن لا تصح الصلاة إلا به', textEn: 'An essential pillar without which prayer is invalid' },
            { id: 'c', textAr: 'مستحب يثاب فاعله ولا إثم على تاركه', textEn: 'Supererogatory' },
            { id: 'd', textAr: 'واجب يسقط بالنسيان', textEn: 'Obligation waived by forgetfulness' }
          ],
          correctOptionId: 'b',
          explanationAr: 'لقول النبي ﷺ في الحديث المتفق عليه: «لَا صَلَاةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الْكِتَابِ» (صحيح البخاري #756).'
        },
        {
          id: 'fq_4',
          questionAr: 'أي من الأمور التالية لا ينقض الوضوء شرعاً؟',
          questionEn: 'Which of the following does NOT invalidate ablution (Wudu)?',
          options: [
            { id: 'a', textAr: 'النوم الخفيف المستقر الذي لا يزول معه الإدراك كالنوم جالساً', textEn: 'Light stable dozing sitting down where consciousness remains' },
            { id: 'b', textAr: 'الخارج من السبيلين من بول أو غائط أو ريح', textEn: 'Discharges from private parts' },
            { id: 'c', textAr: 'زوال العقل بسكر أو إغماء', textEn: 'Loss of intellect' },
            { id: 'd', textAr: 'أكل لحم الإبل على الصحيح', textEn: 'Eating camel meat' }
          ],
          correctOptionId: 'a',
          explanationAr: 'النوم الخفيف الذي يشعر صاحبه بمن حوله لا ينقض الوضوء؛ لأن صحابة رسول الله ﷺ كانوا ينتظرون الصلاة حتى تخفق رؤوسهم ثم يصلون ولا يتوضؤون (مسلم).'
        }
      ],
      seerah: [
        {
          id: 'sr_1',
          questionAr: 'من هو الصحابي الجليل الذي فدى النبي ﷺ وبات في فراشه ليلة الهجرة لرد الأمانات لأهل مكة؟',
          questionEn: 'Which companion sacrificed himself sleeping in the Prophet\'s bed during Hijrah to return trusts?',
          options: [
            { id: 'a', textAr: 'أبو بكر الصديق رضي الله عنه', textEn: 'Abu Bakr As-Siddiq' },
            { id: 'b', textAr: 'علي بن أبي طالب رضي الله عنه', textEn: 'Ali ibn Abi Talib' },
            { id: 'c', textAr: 'عمر بن الخطاب رضي الله عنه', textEn: 'Umar ibn Al-Khattab' },
            { id: 'd', textAr: 'عثمان بن عفان رضي الله عنه', textEn: 'Uthman ibn Affan' }
          ],
          correctOptionId: 'b',
          explanationAr: 'كلف النبي ﷺ علي بن أبي طالب رضي الله عنه بالمبيت في فراشه متلففاً ببرده الأخضر للتمويه على المشركين ورد أمانات قريش المودعة عنده ﷺ.'
        },
        {
          id: 'sr_2',
          questionAr: 'في أي عام هجري وقعت غزوة بدر الكبرى (يوم الفرقان)؟',
          questionEn: 'In which Hijri year did the major Battle of Badr (Yawm Al-Furqan) take place?',
          options: [
            { id: 'a', textAr: 'العام الأول للهجرة', textEn: '1st year AH' },
            { id: 'b', textAr: 'العام الثاني للهجرة (17 رمضان)', textEn: '2nd year AH (17 Ramadan)' },
            { id: 'c', textAr: 'العام الثالث للهجرة', textEn: '3rd year AH' },
            { id: 'd', textAr: 'العام الخامس للهجرة', textEn: '5th year AH' }
          ],
          correctOptionId: 'b',
          explanationAr: 'وقعت غزوة بدر الكبرى في السابع عشر من شهر رمضان في السنة الثانية من الهجرة النبوية الشريفة.'
        },
        {
          id: 'sr_3',
          questionAr: 'ما هو الدليل النبوي على كمال حسن تعامله ﷺ ورفقه بالخدم في بيته؟',
          questionEn: 'What is the prophetic evidence of his gentle exemplary treatment of household helpers?',
          options: [
            { id: 'a', textAr: 'حديث أنس: «خدمت النبي ﷺ عشر سنين فما قال لي أف قط»', textEn: 'Anas said: "I served the Prophet 10 years, he never said Uff to me"' },
            { id: 'b', textAr: 'حديث تبسمك في وجه أخيك صدقة', textEn: 'Smiling in your brother\'s face is charity' },
            { id: 'c', textAr: 'حديث اتقوا النار ولو بشق تمرة', textEn: 'Guard against fire with half a date' },
            { id: 'd', textAr: 'حديث لا تغضب', textEn: 'Do not become angry' }
          ],
          correctOptionId: 'a',
          explanationAr: 'رواه البخاري ومسلم عن أنس بن مالك رضي الله عنه: «خدمت رسول الله ﷺ عشر سنين، والله ما قال لي: أفاً قط، ولا قال لشيء فعلته: لم فعلت كذا؟ ولا لشيء لم أفعله: ألا فعلت كذا؟».'
        }
      ],
      tazkiyah: [
        {
          id: 'tz_1',
          questionAr: 'ما هو الضابط النبوي الفاصل بين "الغيبة" المحرمة و"البهتان"؟',
          questionEn: 'What is the exact prophetic criterion distinguishing backbiting (Gheebah) from slander (Buhtan)?',
          options: [
            { id: 'a', textAr: 'لا فرق بينهما في المعنى واللغة', textEn: 'No difference' },
            { id: 'b', textAr: 'الغيبة ذكرك أخاك بما يكره وهو فيه، والبهتان ذكرك ما ليس فيه كذباً', textEn: 'Gheebah is mentioning what he dislikes while true; Buhtan is falsely stating what is not in him' },
            { id: 'c', textAr: 'البهتان يكون أمام الشخص والغيبة خلفه', textEn: 'Buhtan is to his face and Gheebah behind him' },
            { id: 'd', textAr: 'الغيبة بالقلب والبهتان باللسان', textEn: 'Gheebah is heart and Buhtan tongue' }
          ],
          correctOptionId: 'b',
          explanationAr: 'قال النبي ﷺ: «قيل: أفرأيت إن كان في أخي ما أقول؟ قال: إن كان فيه ما تقول فقد اغتبته، وإن لم يكن فيه فقد بهته» (صحيح مسلم #2584).'
        },
        {
          id: 'tz_2',
          questionAr: 'أي الأعمال الصالحة الآتية يصل ثوابها وأجرها للوالدين بعد وفاتهما بنص الحديث الشريف؟',
          questionEn: 'Which of the following actions reaches parents with reward after their death per the Hadith?',
          options: [
            { id: 'a', textAr: 'كثرة البكاء والنياحة', textEn: 'Wailing and lamenting' },
            { id: 'b', textAr: 'الولد الصالح الذي يدعو لهما، والصدقة الجارية عنهما', textEn: 'Righteous child supplicating for them, and ongoing charity' },
            { id: 'c', textAr: 'ترك العمل والقعود في البيت', textEn: 'Abandoning work' },
            { id: 'd', textAr: 'استئجار من يقرأ القرآن بأجر', textEn: 'Hiring paid reciters' }
          ],
          correctOptionId: 'b',
          explanationAr: 'قال النبي ﷺ: «إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ» (صحيح مسلم 1631).'
        },
        {
          id: 'tz_3',
          questionAr: 'تحويل العادات اليومية (كالنوم والرياضة والأكل) إلى عبادات مأجورة يرتكز بالأساس على:',
          questionEn: 'Transforming daily habits (sleep, exercise, eating) into rewarded acts of worship relies on:',
          options: [
            { id: 'a', textAr: 'كثرة التحدث عنها أمام الناس', textEn: 'Talking about them in public' },
            { id: 'b', textAr: 'استحضار النية الصالحة واحتساب الأجر للتقوي على طاعة الله', textEn: 'Cultivating sincere intention and seeking Allah\'s pleasure to strengthen for worship' },
            { id: 'c', textAr: 'طول مدتها وضخامتها فقط', textEn: 'Their long duration' },
            { id: 'd', textAr: 'إنفاق المال عليها', textEn: 'Spending money on them' }
          ],
          correctOptionId: 'b',
          explanationAr: 'قال معاذ بن جبل رضي الله عنه: «أَمَّا أَنَا فَأَنَامُ وَأَقُومُ، فَأَحْتَسِبُ نَوْمَتِي كَمَا أَحْتَسِبُ قَوْمَتِي» (صحيح البخاري #4344)؛ فالنية الصالحة تقلب المباحات إلى طاعات.'
        }
      ]
    };

    // ================= BRANCH 1: HIFZ MUTASHABIHAT QUIZ (DATA) =================
    const HIFZ_BRANCH_QUIZ = [
      {
        id: 'hifz_1',
        questionAr: 'في قوله تعالى في سورة الملك: ﴿ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ وَهُوَ ٱلْعَزِيزُ ...﴾ ما هو الختام الصحيح؟',
        questionEn: 'In Surah Al-Mulk: (Who created death and life to test which of you is best in deed - and He is the Exalted in Might, ...)?',
        options: [
          { id: 'a', textAr: 'ٱلْغَفُورُ (معرّفة بأل)', textEn: 'Al-Ghafoor (with definite article Al)' },
          { id: 'b', textAr: 'عَزِيزٌ غَفُورٌ (منكّرة)', textEn: 'Azeezun Ghafoor (indefinite)' },
          { id: 'c', textAr: 'ٱلرَّحِيمُ', textEn: 'Ar-Raheem' },
          { id: 'd', textAr: 'ٱلْحَكِيمُ', textEn: 'Al-Hakeem' }
        ],
        correctOptionId: 'a',
        explanationAr: 'في سورة الملك الآية 2: ﴿وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ﴾ بالتعريف، بينما في سورة فاطر (الآية 28): ﴿إِنَّ ٱللَّهَ عَزِيزٌ غَفُورٌ﴾ بالتنكير.'
      },
      {
        id: 'hifz_2',
        questionAr: 'في الآية 5 من سورة الملك: ﴿وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَـٰبِيحَ وَجَعَلْنَـٰهَا رُجُومًۭا لِّلشَّيَـٰطِينِ وَأَعْتَدْنَا لَهُمْ...﴾:',
        questionEn: 'In Ayah 5 of Surah Al-Mulk: (...and We have prepared for them...) what follows?',
        options: [
          { id: 'a', textAr: 'عَذَابَ ٱلسَّعِيرِ', textEn: 'Adhaab As-Sa\'eer' },
          { id: 'b', textAr: 'سَعِيرًا (دون كلمة عذاب)', textEn: 'Sa\'eera (without the word Adhaab)' },
          { id: 'c', textAr: 'عَذَابَ ٱلْجَحِيمِ', textEn: 'Adhaab Al-Jaheem' },
          { id: 'd', textAr: 'عَذَابَ ٱلْحَرِيقِ', textEn: 'Adhaab Al-Hareeq' }
        ],
        correctOptionId: 'a',
        explanationAr: 'في الملك أضيفت كلمة ﴿عَذَابَ﴾: ﴿وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ﴾، بينما في سورة الفرقان (11): ﴿وَأَعْتَدْنَا لِمَن كَذَّبَ بِٱلسَّاعَةِ سَعِيرًا﴾ دون كلمة عذاب.'
      },
      {
        id: 'hifz_3',
        questionAr: 'بداية الوجه الثاني من سورة الملك (الآية 12) تبدأ بقوله تعالى:',
        questionEn: 'The beginning of the second page of Surah Al-Mulk (Ayah 12) starts with:',
        options: [
          { id: 'a', textAr: '﴿إِنَّ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُم بِٱلْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ﴾', textEn: 'Inna allatheena yakhshawna rabbahum bil-ghaybi...' },
          { id: 'b', textAr: '﴿إِنَّ ٱلَّذِينَ كَفَرُوا لَهُمْ عَذَابٌ شَدِيدٌ﴾', textEn: 'Inna allatheena kafaroo...' },
          { id: 'c', textAr: '﴿أَفَمَن يَمْشِى مُكِبًّا عَلَىٰ وَجْهِهِۦٓ أَهْدَىٰ﴾', textEn: 'Afaman yamshee mukibban...' },
          { id: 'd', textAr: '﴿قُلْ هُوَ ٱلَّذِىٓ أَنشَأَكُمْ وَجَعَلَ لَكُمُ ٱلسَّمْعَ﴾', textEn: 'Qul huwa allathee ansha\'akum...' }
        ],
        correctOptionId: 'a',
        explanationAr: 'الآية 12 هي مطلع الوجه 563 في مصحف المدينة المنورة: ﴿إِنَّ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُم بِٱلْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ﴾.'
      },
      {
        id: 'hifz_4',
        questionAr: 'خاتمة سورة الملك الشريفة (الآية 30) تختم بلفظ:',
        questionEn: 'The final word of Surah Al-Mulk (Ayah 30) concludes with:',
        options: [
          { id: 'a', textAr: 'مَّعِينٍۢ', textEn: 'Ma\'een' },
          { id: 'b', textAr: 'فُرَاتٍ', textEn: 'Furaat' },
          { id: 'c', textAr: 'طَهُورٍ', textEn: 'Tahoor' },
          { id: 'd', textAr: 'غَدَقٍ', textEn: 'Ghadaq' }
        ],
        correctOptionId: 'a',
        explanationAr: 'تختم سورة الملك بقوله تعالى: ﴿قُلْ أَرَءَيْتُمْ إِنْ أَصْبَحَ مَآؤُكُمْ غَوْرًۭا فَمَن يَأْتِيكُم بِمَآءٍۢ مَّعِينٍۭ﴾، ويستحب أن يقال بعدها: الله رب العالمين.'
      }
    ];
`;

// Insert DATA_CONSTANTS right before `const PRELOADED_HIFZ_PASSAGES = [`
const hifzPassagesTarget = 'const PRELOADED_HIFZ_PASSAGES = [';
if (!html.includes(hifzPassagesTarget)) {
  console.error('Target hifzPassagesTarget not found!');
  process.exit(1);
}
html = html.replace(hifzPassagesTarget, DATA_CONSTANTS + '\n    ' + hifzPassagesTarget);
console.log('Inserted DATA_CONSTANTS successfully.');

// 2. Add component state variables in App()
// We look for `// Module B: Islamic Studies State`
const islamicStateTarget = `      // Module B: Islamic Studies State
      const [subjectCategory, setSubjectCategory] = useState('العقيدة (Aqeedah)');`;

const replacementIslamicState = `      // Multi-Branch Worksheets & Quizzes Control States
      const [worksheetBranch, setWorksheetBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [worksheetIslamicCategory, setWorksheetIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'
      const [quizBranch, setQuizBranch] = useState('islamic'); // 'islamic', 'tajweed', 'hifz'
      const [quizIslamicCategory, setQuizIslamicCategory] = useState('aqeedah'); // 'aqeedah', 'fiqh', 'seerah', 'tazkiyah'

      // Module B: Islamic Studies State
      const [subjectCategory, setSubjectCategory] = useState('العقيدة (Aqeedah)');`;

if (!html.includes(islamicStateTarget)) {
  console.error('Target islamicStateTarget not found!');
  process.exit(1);
}
html = html.replace(islamicStateTarget, replacementIslamicState);
console.log('Added worksheet and quiz state variables.');

// 3. Update dynamic quiz calculation:
const oldQuizScoreCalc = `      // Quiz Score Calculation
      const quizQuestions = tajweedData?.quiz || [];
      const quizScore = useMemo(() => {
        if (!quizQuestions.length) return 0;
        let correct = 0;
        quizQuestions.forEach(q => {
          if (quizAnswers[q.id] === q.correctOptionId) correct++;
        });
        return Math.round((correct / quizQuestions.length) * 100);
      }, [quizAnswers, quizQuestions]);`;

const newQuizScoreCalc = `      // Dynamic Multi-Branch Quiz Selection
      const activeQuizQuestions = useMemo(() => {
        if (quizBranch === 'islamic') {
          return ISLAMIC_BRANCH_QUIZZES[quizIslamicCategory] || ISLAMIC_BRANCH_QUIZZES.aqeedah;
        } else if (quizBranch === 'tajweed') {
          return tajweedData?.quiz || [];
        } else if (quizBranch === 'hifz') {
          return HIFZ_BRANCH_QUIZ;
        }
        return [];
      }, [quizBranch, quizIslamicCategory, tajweedData]);

      // Dynamic Quiz Score Calculation
      const quizScore = useMemo(() => {
        if (!activeQuizQuestions.length) return 0;
        let correct = 0;
        activeQuizQuestions.forEach(q => {
          if (quizAnswers[q.id] === q.correctOptionId) correct++;
        });
        return Math.round((correct / activeQuizQuestions.length) * 100);
      }, [quizAnswers, activeQuizQuestions]);

      // Switch quiz branch and clear previous answers for clean test
      const handleSwitchQuizBranch = (branch, category = null) => {
        setQuizBranch(branch);
        if (category) setQuizIslamicCategory(category);
        setQuizAnswers({});
        setQuizSubmitted(false);
      };`;

if (!html.includes(oldQuizScoreCalc)) {
  console.error('Target oldQuizScoreCalc not found!');
  process.exit(1);
}
html = html.replace(oldQuizScoreCalc, newQuizScoreCalc);
console.log('Updated dynamic quiz calculation successfully.');

// 4. In activeTab === 'islamic', add the quick action banner to worksheets & quizzes
const oldIslamicEnd = `                          {/* Chat message footer with blue checks */}
                          <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-3">
                            <span>جاهزة للنسخ</span>
                            <span className="text-sky-500 font-bold">✓✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}`;

const newIslamicEnd = `                          {/* Chat message footer with blue checks */}
                          <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-3">
                            <span>جاهزة للنسخ</span>
                            <span className="text-sky-500 font-bold">✓✓</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Cross-Link to Printable Worksheets & Interactive Quiz for Islamic Studies */}
                    <div className="card-islamic-amber rounded-3xl p-6 border-2 border-gold-400/50 shadow-xl flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <span className="w-12 h-12 rounded-2xl bg-gold-400 text-emerald-950 flex items-center justify-center text-2xl font-bold shadow-md">
                          📝
                        </span>
                        <div>
                          <h4 className="font-extrabold text-emerald-950 font-cairo text-base sm:text-lg">
                            {isRtl ? 'أدوات التقييم والواجبات للدرس الشرعي' : 'Assessments & Worksheets for this Lesson'}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">
                            {isRtl ? 'اطبع ورقة العمل بنسختي الطالب والمعلم، أو وجّه الدارسين للاختبار الذاتي الفوري' : 'Printable dual-format worksheet and self-grading interactive quiz'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => {
                            setWorksheetBranch('islamic');
                            if (subjectCategory.includes('Aqeedah') || subjectCategory.includes('العقيدة')) setWorksheetIslamicCategory('aqeedah');
                            else if (subjectCategory.includes('Fiqh') || subjectCategory.includes('الفقه')) setWorksheetIslamicCategory('fiqh');
                            else if (subjectCategory.includes('Seerah') || subjectCategory.includes('السيرة')) setWorksheetIslamicCategory('seerah');
                            else setWorksheetIslamicCategory('tazkiyah');
                            setActiveTab('worksheet');
                          }}
                          className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-extrabold px-5 py-3 rounded-xl text-xs shadow-md transition flex items-center gap-2"
                        >
                          <span>📄</span>
                          <span>{isRtl ? 'ورقة عمل الدرس (طباعة PDF)' : 'Print Lesson Worksheet'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setQuizBranch('islamic');
                            if (subjectCategory.includes('Aqeedah') || subjectCategory.includes('العقيدة')) setQuizIslamicCategory('aqeedah');
                            else if (subjectCategory.includes('Fiqh') || subjectCategory.includes('الفقه')) setQuizIslamicCategory('fiqh');
                            else if (subjectCategory.includes('Seerah') || subjectCategory.includes('السيرة')) setQuizIslamicCategory('seerah');
                            else setQuizIslamicCategory('tazkiyah');
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            setActiveTab('quiz');
                          }}
                          className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-extrabold px-5 py-3 rounded-xl text-xs shadow-md transition flex items-center gap-2"
                        >
                          <span>🎯</span>
                          <span>{isRtl ? 'اختبار الدرس التفاعلي الفوري' : 'Launch Interactive Quiz'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}`;

if (!html.includes(oldIslamicEnd)) {
  console.error('Target oldIslamicEnd not found!');
  process.exit(1);
}
html = html.replace(oldIslamicEnd, newIslamicEnd);
console.log('Added quick action cross-links in Islamic studies tab.');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Saved partial update successfully.');
