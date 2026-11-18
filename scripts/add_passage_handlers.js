const fs = require('fs');

const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Add Passage Testing state variables
if (!html.includes('passageTestSection')) {
  const target = `const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15`;
  const addition = `const [mushafOverlayMode, setMushafOverlayMode] = useState('none'); // 'none', 'ruler', 'mask_bottom', 'mask_top', 'spotlight'
      const [activeRulerLine, setActiveRulerLine] = useState(1); // 1 to 15
      
      // Passage-Based Testing System (Start, Middle, End, Custom)
      const [passageTestSection, setPassageTestSection] = useState('none'); // 'none', 'start', 'middle', 'end', 'custom'
      const [passageMaskedAyahs, setPassageMaskedAyahs] = useState(new Set());
      const [passageStatus, setPassageStatus] = useState('reciting'); // 'reciting', 'correct', 'error_retry', 'revealed_for_review'
      const [passageRetryCount, setPassageRetryCount] = useState(0);`;
  html = html.replace(target, addition);
  console.log('Added passage test state variables');
}

// 2. Add passage selection helper function before return in App component
if (!html.includes('function handleActivatePassageTest')) {
  const targetFn = `// Switch to interactive test with preloaded passage`;
  const additionFn = `// Helper to activate a passage test (Start, Middle, End)
      const handleActivatePassageTest = (sectionType) => {
        if (!hifzAyahs || hifzAyahs.length === 0) return;
        const total = hifzAyahs.length;
        let selectedAyahs = [];
        
        if (sectionType === 'start') {
          // First third (at least 1 ayah)
          const count = Math.max(1, Math.ceil(total / 3));
          selectedAyahs = hifzAyahs.slice(0, count).map(a => a.num);
        } else if (sectionType === 'middle') {
          // Middle third
          const startIdx = Math.max(0, Math.floor(total / 3));
          const endIdx = Math.max(startIdx + 1, Math.ceil((2 * total) / 3));
          selectedAyahs = hifzAyahs.slice(startIdx, endIdx).map(a => a.num);
        } else if (sectionType === 'end') {
          // Last third
          const startIdx = Math.max(0, Math.floor((2 * total) / 3));
          selectedAyahs = hifzAyahs.slice(startIdx).map(a => a.num);
        }

        setPassageTestSection(sectionType);
        setPassageMaskedAyahs(new Set(selectedAyahs));
        setPassageStatus('reciting');
        setPassageRetryCount(0);
        showToast(isRtl ? 'تم تفعيل اختبار المقطع — استمع لتسميع الطالب' : 'Passage test activated');
      };

      const handlePassageVerdict = (verdict) => {
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
      };

      `;
  html = html.replace(targetFn, additionFn + targetFn);
  console.log('Added passage test handlers');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved public/index.html');
