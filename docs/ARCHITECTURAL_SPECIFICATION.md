# مِشكاة (Mishkah) — Architectural Specification & Execution Blueprint

**System Identity:** AI Copilot for Quran, Tajweed & Islamic Studies Educators  
**Target User Persona:** Certified female educators conducting structured online classes (via Zoom) to Arab and non-Arab (English-speaking) students.  
**Platform Form Factor:** High-performance, offline-resilient Bilingual (Arabic RTL / English LTR) Progressive Web Application (PWA).

---

## 1. Phased Execution Roadmap

### Phase 1: 50% Core MVP (Immediate Real-World Testing & Classroom Deployment)
- **Module A: Quran & Bilingual Tajweed Copilot:**
  - Surah & Ayah range selection with Hafs 'an 'Aasim Uthmani text.
  - Target Tajweed rules (Noon Sakinah & Tanween, Meem Sakinah, Madd, Qalqalah, Makharij & Sifat).
  - High-contrast Zoom Presentation Cards with rule color-coding (Emerald for Ikhfa, Amber for Idgham, Ruby for Madd, Sapphire for Qalqalah).
  - Anatomical Articulation Points (المخارج والصفات) in Arabic and English.
  - Printable Student Worksheet & Teacher Answer Key (`@media print` clean PDF export).
  - Interactive self-grading 5–10 MCQ & True/False quiz.
- **Module B: Islamic Studies Lesson Planner:**
  - Subject areas: Aqeedah, Fiqh, Seerah, Tazkiyah.
  - Time-boxed Zoom blueprint (30, 45, 60 minutes) divided into Hook, Core Evidences, Real-life Application, and Wrap-up.
  - Strict authenticity guardrails: exact Surah/Ayah references, Hadith companion narrators, primary sources (Sahih al-Bukhari, Sahih Muslim), and authenticity grades.
  - 1-Click WhatsApp Parent/Student Broadcast Kit.
- **Security & Proxy:**
  - Zero API key exposure to client code.
  - Local Serverless/Express proxy reading `process.env.GEMINI_API_KEY`.
  - Passcode/PIN gate protection (`MISHKAH2026`).
  - Multi-model fallback hierarchy (`gemini-3.1-flash-lite` -> `gemini-3.5-flash-lite` -> `gemini-3.8-flash`) + offline verified presets.

### Phase 2: Full SaaS Commercial Expansion
- **Multi-Tenant Teacher Portals:** Personalized educator subdomains (`teacher.mishkah.app`), class rosters, and scheduled recurring Zoom links.
- **Student Submission & Analytics Hub:** Unique shareable quiz links (`mishkah.app/q/xyz123`), student submission capture, automatic gradebook, and common mistakes heatmaps.
- **Speech & Audio Tajweed Recognition:** WebAudio API + Gemini Multimodal Live streaming for automated pronunciation verification and Ghunnah timing checks.
- **Direct PDF & Canva Export:** Automated slide deck compilation to PowerPoint / PDF and synchronized Zoom presentation overlay.
- **Textbook RAG Ingestion:** Direct PDF drag-and-drop parser allowing educators to upload entire Tajweed textbooks for vector-indexed semantic grounding.

---

## 2. System Architecture & Folder Structure

```
C:\Users\melwa\OneDrive\Documents\GitHub\mishkah\
├── .env                          # Server environment (GEMINI_API_KEY, PIN)
├── .env.example                  # Template configuration
├── .gitignore                    # Git ignore file
├── package.json                  # Node.js project manifest & scripts
├── server.js                     # Secure API proxy & static file server
├── public/                       # PWA Frontend Client
│   ├── index.html                # Single-page bilingual application (React 18 + Tailwind)
│   ├── manifest.webmanifest      # PWA App Manifest (Desktop/Mobile installable)
│   ├── sw.js                     # Service Worker for offline resilience
│   └── icons/
│       └── mishkah-icon.svg      # Scalable 3D glowing niche icon
└── docs/
    └── ARCHITECTURAL_SPECIFICATION.md
```

### Serverless Proxy Security Flow
```
[Client PWA] 
      │
      │ 1. Request + 'x-mishkah-pin' Header
      ▼
[Mishkah Proxy Server (/api/generate/*)]
      │
      ├─► 2. Validate PIN (MISHKAH2026)
      │      └─► Reject 401 if unauthorized
      │
      ├─► 3. Assemble Strict System Prompt & JSON Schema
      │
      ├─► 4. Call Gemini 3.1/3.5/3.8 Flash via process.env.GEMINI_API_KEY
      │      ├─► Success: Return structured JSON
      │      └─► Fail / Rate-limit: Fall back to next model or verified preset
      ▼
[Client Interactive UI Component]
```

---

## 3. Database Schema Specification (Supabase / PostgreSQL)

```sql
-- 1. Teachers Profile Table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'ar',
    passcode_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lessons & Blueprints Table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    module_type TEXT NOT NULL CHECK (module_type IN ('tajweed', 'islamic_studies')),
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category TEXT, -- e.g. Aqeedah, Fiqh, Noon Sakinah
    surah_reference TEXT,
    duration_minutes INTEGER,
    structured_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quizzes & Tests Table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    share_slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    questions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student Quiz Submissions Table
CREATE TABLE quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_answers JSONB NOT NULL,
    score_percentage INTEGER NOT NULL,
    common_mistakes JSONB,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
```

---

## 4. Engineered Prompts & Strict JSON Schemas

### Module A: Tajweed System Prompt
```
You are Mishkah (مِشكاة), an elite bilingual Senior Quran & Tajweed Master Educator.
You specialize in training female educators who teach Quran recitation via Zoom to both Arab and native English-speaking students.
You strictly adhere to:
1. Exact Hafs 'an 'Aasim (حفص عن عاصم من طريق الشاطبية) recitation rules.
2. Accurate Uthmani script diacritics (تشكيل عثماني دقيق).
3. Clear anatomical articulation points (مخارج الحروف وصفاتها) translated into intuitive English and classical Arabic terminology.
4. Pedagogical zoom-friendly teaching cards, printable student worksheets, and self-grading interactive quizzes.
```

### Module B: Islamic Studies System Prompt
```
You are Mishkah (مِشكاة), an authenticated Islamic Studies Educational Architect (Aqeedah, Fiqh, Seerah, Tazkiyah).
Authenticity & Guardrails Policy:
1. Strict Quranic citation: Every verse must explicitly list Surah name and Ayah number with accurate Arabic text.
2. Strict Hadith verification: Every Prophetic tradition must state: (a) Companion narrator, (b) Primary Source Book (Sahih al-Bukhari, Sahih Muslim) with Hadith number, (c) Authenticity status (Sahih / Hasan).
3. Time-boxed discipline: The lesson blueprint must allocate exact minutes summing up to the requested duration.
4. WhatsApp-ready Kit: Provide a 10-line clean, emoji-bulleted summary formatted for immediate copy-pasting.
```
