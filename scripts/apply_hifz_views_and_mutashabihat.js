const fs = require('fs');
const babelParser = require('@babel/parser');

console.log('Reading public/index.html...');
let html = fs.readFileSync('public/index.html', 'utf8');

// =========================================================================
// STEP 1: FIX THE TWO PAGES (MOVE CARDS UNDER INTERACTIVE_TEST ONLY)
// =========================================================================
// Locate closing of interactive_test (around line 6523) and the end of Mutashabihat (around line 6741)
const targetInteractiveTestClose = `                        })}
                      </div>
                    </div>
                )}

                {/* POST-RECITATION WHATSAPP BROADCAST TOOL */}`;

const replacementWithInsideCards = `                        })}
                      </div>
                    </div>

                    {/* POST-RECITATION WHATSAPP BROADCAST TOOL */}`;

if (!html.includes(targetInteractiveTestClose)) {
  console.error('Could not find targetInteractiveTestClose in html');
  process.exit(1);
}

html = html.replace(targetInteractiveTestClose, replacementWithInsideCards);
console.log('Moved start of WhatsApp Broadcast into interactive_test container.');

// Now close interactive_test AFTER the Mutashabihat block
const targetMutaBlockEnd = `                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      {isRtl ? 'لا توجد متشابهات مسجلة لهذا الوجه بعد. اضغط "إضافة أو ربط متشابهة جديدة" لإدراج تنبيهات الحفظ.' : 'No cross-references registered yet.'}
                    </div>
                  )}
                </div>

              </div>
            )}`;

const replacementMutaBlockEnd = `                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      {isRtl ? 'لا توجد متشابهات مسجلة لهذا الوجه بعد. اضغط "إضافة أو ربط متشابهة جديدة" لإدراج تنبيهات الحفظ.' : 'No cross-references registered yet.'}
                    </div>
                  )}
                </div>
                  </div>
                )}

              </div>
            )}`;

if (!html.includes(targetMutaBlockEnd)) {
  console.error('Could not find targetMutaBlockEnd in html');
  process.exit(1);
}

html = html.replace(targetMutaBlockEnd, replacementMutaBlockEnd);
console.log('Successfully closed interactive_test after Mutashabihat and WhatsApp Broadcast!');

// =========================================================================
// STEP 2: BUILD COMPREHENSIVE QURAN_MUTASHABIHAT_REGISTRY & HELPER
// =========================================================================
const registryCode = `  // ================= VERIFIED QURAN MUTASHABIHAT REGISTRY =================
  const QURAN_MUTASHABIHAT_REGISTRY = {
    // 1. Al-Fatihah
    1: [
      {
        ayah: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (الفاتحة: 6)',
        similar: 'وَإِنَّكَ لَتَهْدِي إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ (الشورى: 52)',
        difference: 'في الفاتحة طلب الهداية والتثبيت من العبد، وفي الشورى إثبات هداية الدلالة والبيان للنبي ﷺ.'
      }
    ],
    // 2. Al-Baqarah (Page 2)
    2: [
      {
        ayah: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ (البقرة: 2)',
        similar: 'تِلْكَ آيَاتُ الْقُرْآنِ وَكِتَابٍ مُّبِينٍ * هُدًى وَبُشْرَىٰ لِلْمُؤْمِنِينَ (النمل: 1-2)',
        difference: 'في البقرة (لِّلْمُتَّقِينَ) لأن السورة أصل في بيان معالم التقوى وشرائعها، وفي النمل (لِلْمُؤْمِنِينَ).'
      },
      {
        ayah: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ (البقرة: 5)',
        similar: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ (لقمان: 5)',
        difference: 'تطابق تام في ختام صفات المتقين في البقرة وصفات المحسنين في لقمان.'
      }
    ],
    // 3. Al-Baqarah (Page 3)
    3: [
      {
        ayah: 'وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا وَإِذَا خَلَوْا إِلَىٰ شَيَاطِينِهِمْ (البقرة: 14)',
        similar: 'وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا وَإِذَا خَلَا بَعْضُهُمْ إِلَىٰ بَعْضٍ (البقرة: 76)',
        difference: 'في الآية 14 من البقرة (إِلَىٰ شَيَاطِينِهِمْ) في شأن المنافقين، وفي الآية 76 (إِلَىٰ بَعْضٍ) في شأن يهود.'
      }
    ],
    // 4. Al-Baqarah (Page 4)
    4: [
      {
        ayah: 'فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَافِرِينَ (البقرة: 24)',
        similar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا وَقُودُهَا النَّاسُ وَالْحِجَارَةُ (التحريم: 6)',
        difference: 'في البقرة أمر عام للمشركين المعاندين (فَاتَّقُوا النَّارَ)، وفي التحريم نداء خاص للمؤمنين لحماية أهليهم.'
      }
    ],
    // 5. Al-Baqarah (Page 5)
    5: [
      {
        ayah: 'وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ (البقرة: 25)',
        similar: 'وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا (الكهف: 2)',
        difference: 'في البقرة جاءت بصيغة الفعل الماضي (آمَنُوا وَعَمِلُوا)، وفي الكهف بصيغة المضارع (يَعْمَلُونَ).'
      }
    ],
    // 6. Al-Baqarah (Page 6)
    6: [
      {
        ayah: 'وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا إِلَّا إِبْلِيسَ أَبَىٰ وَاسْتَكْبَرَ (البقرة: 34)',
        similar: 'وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا إِلَّا إِبْلِيسَ أَبَىٰ (طه: 116)',
        difference: 'في البقرة زيادة (وَاسْتَكْبَرَ وَكَانَ مِنَ الْكَافِرِينَ) لبيان أصل كفره، وفي طه اقتصرت على (أَبَىٰ).'
      }
    ],
    // 7. Al-Baqarah (Page 7)
    7: [
      {
        ayah: 'وَاتَّقُوا يَوْمًا لَّا تَجْزِي نَفْسٌ عَن نَّفْسٍ شَيْئًا وَلَا يُقْبَلُ مِنْهَا شَفَاعَةٌ وَلَا يُؤْخَذُ مِنْهَا عَدْلٌ (البقرة: 48)',
        similar: 'وَاتَّقُوا يَوْمًا لَّا تَجْزِي نَفْسٌ عَن نَّفْسٍ شَيْئًا وَلَا يُقْبَلُ مِنْهَا عَدْلٌ وَلَا تَنفَعُهَا شَفَاعَةٌ (البقرة: 123)',
        difference: 'قاعدة الضبط: قدّم الشفاعة في الموضع الأول (الآية 48: شفاعة ثم عدل)، وقدّم العدل في الموضع الثاني (الآية 123: عدل ثم شفاعة).'
      }
    ],
    // 8. Al-Baqarah (Page 8)
    8: [
      {
        ayah: 'وَإِذْ نَجَّيْنَاكُم مِّنْ آلِ فِرْعَوْنَ يَسُومُونَكُمْ سُوءَ الْعَذَابِ (البقرة: 49)',
        similar: 'وَإِذْ أَنجَيْنَاكُم مِّنْ آلِ فِرْعَوْنَ يَسُومُونَكُمْ سُوءَ الْعَذَابِ (الأعراف: 141)',
        difference: 'في البقرة بالتشديد (نَجَّيْنَاكُم)، وفي الأعراف بالألف الخفيفة (أَنجَيْنَاكُم)، وفي إبراهيم: (إِذْ أَنجَاكُم).'
      }
    ],
    // 9. Al-Baqarah (Page 9)
    9: [
      {
        ayah: 'وَإِذْ قُلْنَا ادْخُلُوا هَٰذِهِ الْقَرْيَةَ فَكُلُوا مِنْهَا حَيْثُ شِئْتُمْ رَغَدًا (البقرة: 58)',
        similar: 'وَإِذْ قِيلَ لَهُمُ اسْكُنُوا هَٰذِهِ الْقَرْيَةَ وَكُلُوا مِنْهَا حَيْثُ شِئْتُمْ (الأعراف: 161)',
        difference: 'في البقرة (ادْخُلُوا) وبزيادة (رَغَدًا)، وفي الأعراف (اسْكُنُوا) وبدون رغداً وبتقديم المغفرة على حطة.'
      }
    ],
    // 14. Al-Baqarah (Page 14)
    14: [
      {
        ayah: 'قُلْ إِن كَانَتْ لَكُمُ الدَّارُ الْآخِرَةُ عِندَ اللَّهِ خَالِصَةً مِّن دُونِ النَّاسِ فَتَمَنَّوُا الْمَوْتَ (البقرة: 94)',
        similar: 'قُلْ يَا أَيُّهَا الَّذِينَ هَادُوا إِن زَعَمْتُمْ أَنَّكُمْ أَوْلِيَاءُ لِلَّهِ مِن دُونِ النَّاسِ فَتَمَنَّوُا الْمَوْتَ (الجمعة: 6)',
        difference: 'في البقرة إبطال لدعواهم في الدار الآخرة، وفي الجمعة إبطال لزعمهم الولاية الخاصة لله.'
      }
    ],
    // 20. Al-Baqarah (Page 20)
    20: [
      {
        ayah: 'تِلْكَ أُمَّةٌ قَدْ خَلَتْ ۖ لَهَا مَا كَسَبَتْ وَلَكُم مَّا كَسَبْتُمْ ۖ وَلَا تُسْأَلُونَ عَمَّا كَانُوا يَعْمَلُونَ (البقرة: 134)',
        similar: 'تِلْكَ أُمَّةٌ قَدْ خَلَتْ ۖ لَهَا مَا كَسَبَتْ وَلَكُم مَّا كَسَبْتُمْ ۖ وَلَا تُسْأَلُونَ عَمَّا كَانُوا يَعْمَلُونَ (البقرة: 141)',
        difference: 'تكرار الآية نصاً للتأكيد؛ الأولى بعد ذكر الأنبياء المتقدمين، والثانية رداً على دعوى أن إبراهيم وإسماعيل كانوا هوداً أو نصارى.'
      }
    ],
    // 50. Al-Imran (Page 50)
    50: [
      {
        ayah: 'هُوَ الَّذِي أَنزَلَ عَلَيْكَ الْكِتَابَ مِنْهُ آيَاتٌ مُّحْكَمَاتٌ هُنَّ أُمُّ الْكِتَابِ (آل عمران: 7)',
        similar: 'الر ۚ كِتَابٌ أُحْكِمَتْ آيَاتُهُ ثُمَّ فُصِّلَتْ مِن لَّدُنْ حَكِيمٍ خَبِيرٍ (هود: 1)',
        difference: 'في آل عمران تقسيم الآيات إلى محكم ومتشابه، وفي هود وصف الكتاب كله بأنه محكم متقن.'
      }
    ],
    // 51. Al-Imran (Page 51)
    51: [
      {
        ayah: 'إِنَّ الَّذِينَ كَفَرُوا لَن تُغْنِيَ عَنْهُمْ أَمْوَالُهُمْ وَلَا أَوْلَادُهُم مِّنَ اللَّهِ شَيْئًا ۖ وَأُولَٰئِكَ هُمْ وَقُودُ النَّارِ (آل عمران: 10)',
        similar: 'إِنَّ الَّذِينَ كَفَرُوا لَن تُغْنِيَ عَنْهُمْ أَمْوَالُهُمْ وَلَا أَوْلَادُهُم مِّنَ اللَّهِ شَيْئًا ۖ وَأُولَٰئِكَ أَصْحَابُ النَّارِ (آل عمران: 116)',
        difference: 'في الآية 10 الختام بـ (وَقُودُ النَّارِ)، وفي الآية 116 الختام بـ (أَصْحَابُ النَّارِ هُمْ فِيهَا خَالِدُونَ).'
      }
    ],
    // 293. Al-Kahf (Page 293)
    293: [
      {
        ayah: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا (الكهف: 1)',
        similar: 'الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ (الأنعام: 1)',
        difference: 'افتتحت 5 سور بالحمد: الفاتحة، الأنعام، الكهف، سبأ، فاطر. والكهف تميزت بإنزال الكتاب على العبد.'
      },
      {
        ayah: 'وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا (الكهف: 4)',
        similar: 'وَقَالُوا اتَّخَذَ الرَّحْمَٰنُ وَلَدًا ۗ لَّقَدْ جِئْتُمْ شَيْئًا إِدًّا (مريم: 88)',
        difference: 'في الكهف بلفظ الجلالة (اتَّخَذَ اللَّهُ وَلَدًا)، وفي مريم باسم (الرَّحْمَٰنُ).'
      }
    ],
    // 301. Al-Kahf (Page 301)
    301: [
      {
        ayah: 'قَالَ أَلَمْ أَقُل لَّكَ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا (الكهف: 75)',
        similar: 'قَالَ أَلَمْ أَقُلْ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا (الكهف: 72)',
        difference: 'قاعدة الضبط: في المرة الأولى (الآية 72) جاءت بدون (لَّكَ)، وفي المرة الثانية (الآية 75) زادت كلمة (لَّكَ) لتوكيد العتاب.'
      }
    ],
    // 440. Yaseen (Page 440)
    440: [
      {
        ayah: 'إِنَّمَا تُنذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ بِالْغَيْبِ ۖ فَبَشِّرْهُ بِمَغْفِرَةٍ وَأَجْرٍ كَرِيمٍ (يس: 11)',
        similar: 'إِنَّمَا تُنذِرُ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ وَأَقَامُوا الصَّلَاةَ (فاطر: 18)',
        difference: 'في يس (مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ)، وفي فاطر (الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ وَأَقَامُوا الصَّلَاةَ).'
      }
    ],
    // 441. Yaseen (Page 441)
    441: [
      {
        ayah: 'وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ (يس: 20)',
        similar: 'وَجَاءَ رَجُلٌ مِّنْ أَقْصَى الْمَدِينَةِ يَسْعَىٰ قَالَ يَا مُوسَىٰ إِنَّ الْمَلَأَ يَأْتَمِرُونَ بِكَ (القصص: 20)',
        difference: 'قاعدة الضبط: في يس تقديم الجار والمجرور (مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ)، وفي القصص تقديم الفاعل (رَجُلٌ مِّنْ أَقْصَى الْمَدِينَةِ).'
      }
    ],
    // 562. Al-Mulk (Page 562)
    562: [
      {
        ayah: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ ... وَهُوَ الْعَزِيزُ الْغَفُورُ (الملك: 2)',
        similar: '... إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ ۗ إِنَّ اللَّهَ عَزِيزٌ غَفُورٌ (فاطر: 28)',
        difference: 'في الملك معرّفة باللام (الْعَزِيزُ الْغَفُورُ)، وفي فاطر منكرة (عَزِيزٌ غَفُورٌ).'
      },
      {
        ayah: 'وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ (الملك: 5)',
        similar: '... وَأَعْتَدْنَا لِمَن كَذَّبَ بِالسَّاعَةِ سَعِيرًا (الفرقان: 11)',
        difference: 'في الملك أضيفت كلمة (عذاب) قبل (السعير) لبيان نوع العقوبة للشياطين.'
      }
    ],
    // 563. Al-Mulk (Page 563)
    563: [
      {
        ayah: 'وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ (الملك: 13)',
        similar: 'وَإِن تَجْهَرْ بِالْقَوْلِ فَإِنَّهُ يَعْلَمُ السِّرَّ وَأَخْفَى (طه: 7)',
        difference: 'في الملك تقديم الإسرار على الجهر، وفي طه ذكر الجهر أولاً.'
      },
      {
        ayah: 'قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ (الملك: 24)',
        similar: 'وَهُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ (المؤمنون: 79)',
        difference: 'في الملك بدأت بالأمر (قُلْ هُوَ الَّذِي)، وفي المؤمنون بالواو (وَهُوَ الَّذِي).'
      }
    ],
    // 564. Al-Mulk (Page 564)
    564: [
      {
        ayah: 'قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا (الملك: 29)',
        similar: 'فَقَالُوا عَلَى اللَّهِ تَوَكَّلْنَا رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلْقَوْمِ الظَّالِمِينَ (يونس: 85)',
        difference: 'في الملك إفراد التوكل وتقديمه مع الإيمان بالرحمن (آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا).'
      }
    ],
    // 582. An-Naba (Page 582)
    582: [
      {
        ayah: 'إِنَّ لِلْمُتَّقِينَ مَفَازًا * حَدَائِقَ وَأَعْنَابًا (النبأ: 31-32)',
        similar: 'إِنَّ الْمُتَّقِينَ فِي مَقَامٍ أَمِينٍ * فِي جَنَّاتٍ وَعُيُونٍ (الدخان: 51-52)',
        difference: 'في النبأ التعبير بـ (مَفَازًا) تفصيلاً للنجاة والنعيم، وفي الدخان بـ (فِي مَقَامٍ أَمِينٍ).'
      }
    ],
    // 583. An-Nazi'at (Page 583)
    583: [
      {
        ayah: 'فَإِذَا جَاءَتِ الطَّامَّةُ الْكُبْرَىٰ (النازعات: 34)',
        similar: 'فَإِذَا جَاءَتِ الصَّاخَّةُ (عبس: 33)',
        difference: 'في النازعات وصف القيامة بـ (الطَّامَّةُ الْكُبْرَىٰ) لمناسبتها لأهوال الغرق والنزع، وفي عبس بـ (الصَّاخَّةُ) لشدة الصوت.'
      }
    ],
    // 585. Abasa (Page 585)
    585: [
      {
        ayah: 'فَإِذَا جَاءَتِ الصَّاخَّةُ * يَوْمَ يَفِرُّ الْمَرْءُ مِنْ أَخِيهِ (عبس: 33-34)',
        similar: 'يَوْمَ لَا يَجْزِي وَالِدٌ عَن وَلَدِهِ وَلَا مَوْلُودٌ هُوَ جَازٍ عَن وَالِدِهِ شَيْئًا (لقمان: 33)',
        difference: 'في عبس التدرج التصاعدي في الفرار من الأقرب إلى الألصق: الأخ، ثم الأم والأب، ثم الصاحبة والبنين.'
      }
    ],
    // 586. At-Takwir (Page 586)
    586: [
      {
        ayah: 'وَإِذَا النُّجُومُ انكَدَرَتْ (التكوير: 2)',
        similar: 'وَإِذَا الْكَوَاكِبُ انتَثَرَتْ (الانفطار: 2)',
        difference: 'في التكوير وصف النجوم بالانكدار (تساقط مع انطفاء الضوء)، وفي الانفطار وصف الكواكب بالانتثار وتفكك المدارات.'
      }
    ],
    // 587. Al-Infitar (Page 587)
    587: [
      {
        ayah: 'يَوْمَ لَا تَمْلِكُ نَفْسٌ لِّنَفْسٍ شَيْئًا ۖ وَالْأَمْرُ يَوْمَئِذٍ لِّلَّهِ (الانفطار: 19)',
        similar: 'لِّمَنِ الْمُلْكُ الْيَوْمَ ۖ لِلَّهِ الْوَاحِدِ الْقَهَّارِ (غافر: 16)',
        difference: 'في الانفطار بيان نفي الشفاعة والتملك الذاتي، وفي غافر تقرير انفراد الملك المطلق لله عز وجل.'
      }
    ],
    // 588. Al-Mutaffifin (Page 588)
    588: [
      {
        ayah: 'كَلَّا إِنَّ كِتَابَ الْفُجَّارِ لَفِي سِجِّينٍ (المطففين: 7)',
        similar: 'كَلَّا إِنَّ كِتَابَ الْأَبْرَارِ لَفِي عِلِّيِّينَ (المطففين: 18)',
        difference: 'مقابلة بلاغية تامة في سورة المطففين: سجين للفجار في أسفل درك، وعليين للأبرار في أعلى مقام.'
      }
    ],
    // 591. Al-Fajr (Page 591)
    591: [
      {
        ayah: 'كَلَّا إِذَا دُكَّتِ الْأَرْضُ دَكًّا دَكًّا (الفجر: 21)',
        similar: 'وَحُمِلَتِ الْأَرْضُ وَالْجِبَالُ فَدُكَّتَا دَكَّةً وَاحِدَةً (الحاقة: 14)',
        difference: 'في الفجر تكرار الدك (دَكًّا دَكًّا) لبيان توالي الزلازل وتفتيتها، وفي الحاقة (دَكَّةً وَاحِدَةً) لبيان شدة الصدمة الأولى.'
      }
    ],
    // 594. Al-Balad (Page 594)
    594: [
      {
        ayah: 'لَا أُقْسِمُ بِهَٰذَا الْبَلَدِ * وَأَنتَ حِلٌّ بِهَٰذَا الْبَلَدِ (البلد: 1-2)',
        similar: 'وَهَٰذَا الْبَلَدِ الْأَمِينِ (التين: 3)',
        difference: 'في سورة البلد أقسم بالبلد الحرام مقروناً بحلول النبي ﷺ فيه وشرفه به، وفي التين أقسم به موصوفاً بالأمن.'
      }
    ],
    // 604. Al-Mu'awwidhat (Page 604)
    604: [
      {
        ayah: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (الفلق: 1)',
        similar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ (الناس: 1)',
        difference: 'في الفلق استعاذة بصفة واحدة (رَبِّ الْفَلَقِ) من شرور أربعة، وفي الناس استعاذة بثلاث صفات (رب، ملك، إله) من شر واحد هو الوسواس الخناس.'
      }
    ]
  };

  // Helper to fetch verified mutashabihat for any page (with teacher custom memory)
  function getMutashabihatForPageNumber(pageNum, surahId) {
    const p = parseInt(pageNum) || 1;
    let list = [];
    if (QURAN_MUTASHABIHAT_REGISTRY[p]) {
      list = [...QURAN_MUTASHABIHAT_REGISTRY[p]];
    }
    // Check teacher custom saved entries for this page
    try {
      const customKey = 'mishkah_custom_muta_page_' + p;
      const customSaved = localStorage.getItem(customKey);
      if (customSaved) {
        const parsed = JSON.parse(customSaved);
        if (Array.isArray(parsed)) {
          list = [...list, ...parsed];
        }
      }
    } catch(e) {}
    return list;
  }
`;

// Insert QURAN_MUTASHABIHAT_REGISTRY before PRELOADED_HIFZ_PASSAGES
const targetPreloadedStart = '    const PRELOADED_HIFZ_PASSAGES = [';
if (!html.includes(targetPreloadedStart)) {
  console.error('Could not find targetPreloadedStart in html');
  process.exit(1);
}

html = html.replace(targetPreloadedStart, registryCode + '\n' + targetPreloadedStart);
console.log('Inserted QURAN_MUTASHABIHAT_REGISTRY successfully.');

// =========================================================================
// STEP 3: UPDATE handleNavigateMushafPage TO USE getMutashabihatForPageNumber
// =========================================================================
// In handleNavigateMushafPage:
// Replace preloaded.mutashabihat || [] with getMutashabihatForPageNumber(p, sMatch?.id)
// And replace setHifzMutashabihat([]); with getMutashabihatForPageNumber(p, sMatch?.id)

const targetApiMutaEmpty = `          const pageData = {
            ayahs: mappedAyahs,
            surahName: primarySurah.startsWith('سُورَةُ') ? primarySurah : 'سورة ' + primarySurah,
            ayahRange: rangeStr,
            mutashabihat: []
          };

          try { localStorage.setItem(cacheKey, JSON.stringify(pageData)); } catch(e) {}

          setHifzAyahs(mappedAyahs);
          setHifzSurahName(pageData.surahName);
          setHifzAyahRange(rangeStr);
          setHifzMutashabihat([]);`;

const replacementApiMutaLoaded = `          const pageMutashabihat = getMutashabihatForPageNumber(p, sMatch?.id);
          const pageData = {
            ayahs: mappedAyahs,
            surahName: primarySurah.startsWith('سُورَةُ') ? primarySurah : 'سورة ' + primarySurah,
            ayahRange: rangeStr,
            mutashabihat: pageMutashabihat
          };

          try { localStorage.setItem(cacheKey, JSON.stringify(pageData)); } catch(e) {}

          setHifzAyahs(mappedAyahs);
          setHifzSurahName(pageData.surahName);
          setHifzAyahRange(rangeStr);
          setHifzMutashabihat(pageMutashabihat);`;

if (!html.includes(targetApiMutaEmpty)) {
  console.error('Could not find targetApiMutaEmpty in html');
  process.exit(1);
}

html = html.replace(targetApiMutaEmpty, replacementApiMutaLoaded);
console.log('Updated API page loader to load verified Mutashabihat for any page!');

// Also in preloaded passage check (line 2945):
const targetPreloadedMuta = `setHifzMutashabihat(preloaded.mutashabihat || []);`;
const replacementPreloadedMuta = `setHifzMutashabihat(getMutashabihatForPageNumber(p, sMatch?.id));`;
html = html.replace(targetPreloadedMuta, replacementPreloadedMuta);

// Also in cached page check (line 2966):
const targetCachedMuta = `setHifzMutashabihat(parsed.mutashabihat || []);`;
const replacementCachedMuta = `setHifzMutashabihat(getMutashabihatForPageNumber(p, sMatch?.id));`;
html = html.replace(targetCachedMuta, replacementCachedMuta);

// Also update handleAddCustomMutashabiha to persist to localStorage per page:
const targetAddMutaToast = `showToast(isRtl ? 'تم حفظ المتشابهة وإدراجها في خطة المدارسة بنجاح ✨' : 'Mutashabiha added to lesson ✨');`;
const replacementAddMutaToast = `// Persist custom mutashabiha for this page
        try {
          const customKey = 'mishkah_custom_muta_page_' + mushafPageNumber;
          const existing = JSON.parse(localStorage.getItem(customKey) || '[]');
          existing.push(newEntry);
          localStorage.setItem(customKey, JSON.stringify(existing));
        } catch(e) {}
        showToast(isRtl ? 'تم حفظ المتشابهة وتثبيتها لهذا الوجه في خطة المدارسة والواتساب بنجاح ✨' : 'Mutashabiha saved to page ✨');`;

if (html.includes(targetAddMutaToast)) {
  html = html.replace(targetAddMutaToast, replacementAddMutaToast);
  console.log('Updated handleAddCustomMutashabiha to persist custom mutashabihat per page.');
}

// Bump version to v55.0
html = html.replace(/v54\.0/g, 'v55.0');
console.log('Bumped version to v55.0');

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
