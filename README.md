# مِشكاة (Mishkah) — AI Copilot for Quran, Tajweed & Islamic Studies Educators

<div align="center">
  <img src="public/icons/mishkah-icon.svg" width="140" height="140" alt="Mishkah Logo" />
  <h3>المُعين الذكي ثنائي اللغة لمعلمات القرآن والتجويد والعلوم الشرعية عبر زوم</h3>
  <p><strong>Bilingual AI Copilot for Quran, Tajweed, and Islamic Studies Online Educators</strong></p>
  <p>
    <code>Grand Emerald & Soft Gold Aesthetic</code> • <code>Uthmani Script</code> • <code>Zoom Ready</code> • <code>Printable Worksheets</code> • <code>PWA Enabled</code>
  </p>
</div>

---

## 🌟 نظرة عامة على المشروع (Project Overview)

**مِشكاة (Mishkah)** هو تطبيق ويب تقدمي (PWA) ثنائي اللغة (عربي RTL / إنجليزي LTR)، مصمم خصيصاً لتمكين المعلمات المتخصصات اللاتي يقدمن دروس القرآن، وأحكام التجويد، والعلوم الشرعية (العقيدة، الفقه، السيرة، التزكية) عبر برنامج زوم (Zoom) للطالبات العربيات وغير الناطقات بالعربية.

يحقق التطبيق أعلى درجات الدقة المنهجية والأمان الشرعي:
1. **استخراج الشواهد بالرسم العثماني المضبوط:** تلوين تلقائي لمواضع الأحكام (الإخفاء، الإدغام، الإقلاب، الإظهار، المدود، القلقلة) مع بيان المخرج الصوتي والتشريحي الدقيق.
2. **بطاقات عرض تفاعلية لزوم:** وضع الشاشة الكاملة (Fullscreen Zoom Mode) بتباين عالي وخط عثماني مريح للعين بدون تشتيت.
3. **أوراق عمل قابلة للطباعة (PDF):** نسختان جاهزتان للطباعة بضغطة زر (نسخة فارغة لاختبار الطالبة + نموذج إجابة مفصل للمعلمة).
4. **سياج التوثيق الشرعي الصارم (Zero Hallucinated Hadith):** اشتراط عزو كل حديث إلى راويه ومصدره المعتمد (صحيح البخاري، صحيح مسلم) وبيان درجة صحته.
5. **حقيبة الواتساب الفورية (1-Click WhatsApp Kit):** ملخص من 10 أسطر منسق بالإيموجي والواجبات المنزلية جاهز للنسخ المباشر لمجموعات أولياء الأمور.
6. **بوابة أمان وسيطة (Secure Serverless/Node Proxy):** حماية كاملة لمفاتيح الذكاء الاصطناعي (`GEMINI_API_KEY`) مع رمز أمان للمعلمة (`MISHKAH2026`).

---

## 🚀 التشغيل السريع (Quick Start)

### المتطلبات (Prerequisites)
- [Node.js](https://nodejs.org/) الإصدار 18 فما فوق.

### 1. إعداد المتغيرات البيئية (Environment Setup)
ملف `.env` جاهز ومضبوط داخل المستودع:
```env
PORT=3000
GEMINI_API_KEY=your_key_here
MISHKAH_TEACHER_PIN=MISHKAH2026
```

### 2. بدء تشغيل الخادم والتطبيق (Start Server)
```powershell
# الانتقال إلى المجلد
cd C:\Users\melwa\OneDrive\Documents\GitHub\mishkah

# تشغيل الخادم المدمج
npm start
```

### 3. فتح التطبيق في المتصفح (Open Browser)
افتحي الرابط:
👉 **[http://localhost:3000](http://localhost:3000)**

> **ملاحظة:** يمكن أيضاً فتح ملف `public/index.html` مباشرة في أي متصفح دون تشغيل الخادم، حيث يتضمن التطبيق وضع العمل المحلي التلقائي مع بيانات تجويد وعلوم شرعية موثقة بدقة.

---

## 📂 هيكلة المستودع (Repository Structure)

```
C:\Users\melwa\OneDrive\Documents\GitHub\mishkah\
├── .env                          # مفاتيح الخادم المحلية الآمنة
├── .env.example                  # نموذج توضيحي للمتغيرات البيئية
├── .gitignore                    # ملف استبعاد الملفات الحساسة
├── package.json                  # إعدادات المشروع والتشغيل
├── server.js                     # خادم الحماية الوسيط واستدعاء الذكاء الاصطناعي
├── public/                       # واجهة التطبيق التفاعلية
│   ├── index.html                # التطبيق الكامل (React 18 + Tailwind + Lucide)
│   ├── manifest.webmanifest      # ملف تعريف PWA للتثبيت على الأجهزة
│   ├── sw.js                     # عامل الخدمة للعمل دون اتصال (Offline Caching)
│   └── icons/
│       └── mishkah-icon.svg      # أيقونة المشكاة ثلاثية الأبعاد
└── docs/
    └── ARCHITECTURAL_SPECIFICATION.md # وثيقة المواصفات الهندسية الشاملة
```

---

## 🔒 الأمان وبوابة رمز المعلمة (Teacher PIN Gate)
- لا يتم تمرير مفتاح `GEMINI_API_KEY` أبداً إلى كود العميل في المتصفح.
- جميع الطلبات تمر عبر المسارات الآمنة:
  - `POST /api/generate/tajweed`
  - `POST /api/generate/islamic-studies`
  - `POST /api/verify-pin`
- رمز المعلمة الافتراضي: **`MISHKAH2026`** (يمكن تعديله في أي وقت من زر أمان المعلمة في أعلى الصفحة أو عبر `.env`).

---

## 📱 ميزات تثبيت PWA
التطبيق يدعم المعيار الكامل لـ Progressive Web App:
- يمكن تثبيته كبرنامج مستقل على شاشة سطح المكتب في Windows/Mac أو على الشاشة الرئيسية لأجهزة iPad/iPhone وهواتف Android عبر خيار **"Install App / تثبيت التطبيق"** في المتصفح.

---

## ⚖️ الحقوق والتراخيص (License)
مشروع مِشكاة (Mishkah) — منصة تعليمية متخصصة. جميع الحقوق محفوظة لتقنيات التعليم القرآني.
