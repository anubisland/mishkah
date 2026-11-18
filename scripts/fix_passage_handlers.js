const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const target = `showToast(isRtl ? 'تم نسخ رسالة وِرد التحفيظ للواتساب بنجاح 📋' : 'Hifz Broadcast Copied to Clipboard 📋');
      }`;

const addition = `showToast(isRtl ? 'تم نسخ رسالة وِرد التحفيظ للواتساب بنجاح 📋' : 'Hifz Broadcast Copied to Clipboard 📋');
      }

      // Passage-Based Testing Handlers (Start, Middle, End, Custom)
      function handleActivatePassageTest(sectionType) {
        if (!hifzAyahs || hifzAyahs.length === 0) return;
        const total = hifzAyahs.length;
        let selectedAyahs = [];
        
        if (sectionType === 'start') {
          const count = Math.max(1, Math.ceil(total / 3));
          selectedAyahs = hifzAyahs.slice(0, count).map(a => a.num);
        } else if (sectionType === 'middle') {
          const startIdx = Math.max(0, Math.floor(total / 3));
          const endIdx = Math.max(startIdx + 1, Math.ceil((2 * total) / 3));
          selectedAyahs = hifzAyahs.slice(startIdx, endIdx).map(a => a.num);
        } else if (sectionType === 'end') {
          const startIdx = Math.max(0, Math.floor((2 * total) / 3));
          selectedAyahs = hifzAyahs.slice(startIdx).map(a => a.num);
        }

        setPassageTestSection(sectionType);
        setPassageMaskedAyahs(new Set(selectedAyahs));
        setPassageStatus('reciting');
        setPassageRetryCount(0);
        showToast(isRtl ? 'تم تفعيل اختبار المقطع — استمع لتسميع الطالب 🎧' : 'Passage test activated 🎧');
      }

      function handlePassageVerdict(verdict) {
        if (verdict === 'correct') {
          setPassageStatus('correct');
          showToast(isRtl ? '✨ أحسنت! تم إظهار المقطع بعد الإتقان' : 'Correct! Passage revealed');
        } else if (verdict === 'error') {
          const nextRetries = passageRetryCount + 1;
          setPassageRetryCount(nextRetries);
          setPassageStatus('error_retry');
          showToast(isRtl ? '⚠️ تم رصد خطأ (محاولة ' + nextRetries + ') — أعد التسميع مرة أخرى' : 'Mistake detected — retry');
        } else if (verdict === 'reveal_review') {
          setPassageStatus('revealed_for_review');
          showToast(isRtl ? '📖 تم إظهار المقطع للتصحيح والمراجعة' : 'Passage revealed for review');
        } else if (verdict === 'reset') {
          setPassageTestSection('none');
          setPassageMaskedAyahs(new Set());
          setPassageStatus('reciting');
          setPassageRetryCount(0);
        }
      }`;

if (html.includes(target)) {
  html = html.replace(target, addition);
  console.log('Successfully placed passage handlers inside App component!');
} else {
  console.error('Target not found');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved public/index.html');
