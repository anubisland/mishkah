const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Replace the skewed background CSS with the authentic mawaqeet-qibla geometric Khatam
const oldBodyPattern = `    body, #root, .islamic-screen-pattern {
      background-color: #F3EFE6 !important;
      /* Clearly visible ornate Islamic Geometric star & interlaced arabesque pattern */
      background-image: 
        radial-gradient(circle at 50% 10%, rgba(6, 78, 59, 0.08) 0%, transparent 70%),
        url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23064E3B' stroke-width='1.4' stroke-opacity='0.22'%3E%3Cpath d='M40 0L48 24L72 32L48 40L40 64L32 40L8 32L32 24Z' fill='%23064E3B' fill-opacity='0.05'/%3E%3Cpath d='M0 40L24 48L32 72L40 48L64 40L40 32L32 8L24 32Z' fill='%23064E3B' fill-opacity='0.05'/%3E%3Ccircle cx='40' cy='40' r='6' stroke='%23C59B27' stroke-opacity='0.35' stroke-width='1.5' fill='%23C59B27' fill-opacity='0.12'/%3E%3Ccircle cx='0' cy='0' r='6' stroke='%23C59B27' stroke-opacity='0.35' stroke-width='1.5' fill='%23C59B27' fill-opacity='0.12'/%3E%3Ccircle cx='80' cy='0' r='6' stroke='%23C59B27' stroke-opacity='0.35' stroke-width='1.5' fill='%23C59B27' fill-opacity='0.12'/%3E%3Ccircle cx='0' cy='80' r='6' stroke='%23C59B27' stroke-opacity='0.35' stroke-width='1.5' fill='%23C59B27' fill-opacity='0.12'/%3E%3Ccircle cx='80' cy='80' r='6' stroke='%23C59B27' stroke-opacity='0.35' stroke-width='1.5' fill='%23C59B27' fill-opacity='0.12'/%3E%3C/g%3E%3C/svg%3E") !important;
      background-attachment: fixed !important;
      color: #1E293B;
    }`;

const newBodyPattern = `    body, #root, .islamic-screen-pattern {
      background-color: #F3F8F5 !important;
      /* Authentic Balanced Islamic Khatam Geometric Rosette from Mawaqeet & Qibla */
      background-image:
        radial-gradient(circle at 12% 8%, rgba(16, 185, 129, 0.08), transparent 36%),
        radial-gradient(circle at 88% 18%, rgba(217, 119, 6, 0.08), transparent 36%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23064E3B' stroke-opacity='0.12' stroke-width='1.2'%3E%3Cpolygon points='48,6 60,36 90,48 60,60 48,90 36,60 6,48 36,36'/%3E%3Crect x='22' y='22' width='52' height='52'/%3E%3Crect x='22' y='22' width='52' height='52' transform='rotate(45 48 48)'/%3E%3Ccircle cx='48' cy='48' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='0' cy='0' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='96' cy='0' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='0' cy='96' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3Ccircle cx='96' cy='96' r='5' stroke='%23D97706' stroke-opacity='0.22' stroke-width='1' fill='%23D97706' fill-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E") !important;
      background-attachment: fixed !important;
      color: #1E293B;
    }`;

if (html.includes(oldBodyPattern)) {
  html = html.replace(oldBodyPattern, newBodyPattern);
  console.log('1. Replaced body background with authentic Mawaqeet-Qibla geometry');
} else {
  console.log('Note: oldBodyPattern mismatch, performing targeted replacement');
  // target replacement of background-image inside body
  html = html.replace(
    /body,\s*#root,\s*\.islamic-screen-pattern\s*\{[\s\S]*?background-attachment:\s*fixed\s*!important;\s*color:\s*#1E293B;\s*\}/,
    newBodyPattern
  );
  console.log('1. Targeted replacement done');
}

// 2. Also update header and hero card pattern to use 96x96 authentic geometry
const newEmeraldPattern = `.emerald-pattern, .islamic-header-pattern {
      background-color: #04392B !important;
      background-image: 
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23FBBF24' stroke-opacity='0.16' stroke-width='1.2'%3E%3Cpolygon points='48,6 60,36 90,48 60,60 48,90 36,60 6,48 36,36'/%3E%3Crect x='22' y='22' width='52' height='52'/%3E%3Crect x='22' y='22' width='52' height='52' transform='rotate(45 48 48)'/%3E%3Ccircle cx='48' cy='48' r='5' stroke='%23FBBF24' stroke-opacity='0.3' stroke-width='1' fill='%23F59E0B' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E"),
        linear-gradient(135deg, #02241A 0%, #064E3B 50%, #047857 100%) !important;
    }`;

html = html.replace(
  /\.emerald-pattern,\s*\.islamic-header-pattern\s*\{[\s\S]*?\}/,
  newEmeraldPattern
);
console.log('2. Updated emerald header pattern');

// 3. Add ErrorBoundary class definition before App()
const errorBoundaryCode = `
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
      }
      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
              <div className="card-islamic-pearl max-w-lg w-full p-8 rounded-3xl border-2 border-emerald-900/30 shadow-2xl">
                <span className="text-4xl block mb-3">🛡️</span>
                <h2 className="text-xl font-bold text-emerald-950 font-cairo mb-2">تنبيه استعادة أمان النظام</h2>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  تمت حماية الجلسة بأمان من استثناء عارض. يمكنك الضغط على الزر أدناه للعودة الفورية لمتابعة التحفيض والشرح دون فقدان بياناتك.
                </p>
                <button
                  type="button"
                  onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-gold-200 font-bold px-6 py-2.5 rounded-xl shadow-lg transition text-sm"
                >
                  العودة للوحة المعلم 🔄
                </button>
              </div>
            </div>
          );
        }
        return this.props.children;
      }
    }
`;

if (!html.includes('class ErrorBoundary')) {
  html = html.replace('function App() {', errorBoundaryCode + '\n    function App() {');
  console.log('3. ErrorBoundary added');
}

// 4. Wrap ReactDOM.render or root.render with ErrorBoundary
html = html.replace('<App />', '<ErrorBoundary><App /></ErrorBoundary>');
console.log('4. App wrapped in ErrorBoundary');

// 5. Fix all undefined presentationCards in Tajweed view
// Line: {tajweedData.presentationCards.length} -> {(tajweedData.presentationCards || []).length}
html = html.replace(/tajweedData\.presentationCards\.length/g, '(tajweedData.presentationCards || []).length');

// Fix: card.ayahTextUthmani.split(card.highlightedPortion) with defensive fallback
const oldCardUthmaniSplit = `{card.ayahTextUthmani.split(card.highlightedPortion).map((part, i, arr) => (
                                  <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                      <span className="bg-emerald-500/40 text-gold-300 font-bold border-b-4 border-gold-400 px-2 py-0.5 rounded-lg shadow-inner">
                                        {card.highlightedPortion}
                                      </span>
                                    )}
                                  </React.Fragment>
                                ))}`;

const safeCardUthmaniSplit = `{(() => {
                                  const text = card.ayahTextUthmani || '';
                                  const target = card.highlightedPortion || '';
                                  if (!target || !text.includes(target)) {
                                    return <span>{text}</span>;
                                  }
                                  return text.split(target).map((part, i, arr) => (
                                    <React.Fragment key={i}>
                                      {part}
                                      {i < arr.length - 1 && (
                                        <span className="bg-emerald-500/40 text-gold-300 font-bold border-b-4 border-gold-400 px-2 py-0.5 rounded-lg shadow-inner">
                                          {target}
                                        </span>
                                      )}
                                    </React.Fragment>
                                  ));
                                })()}`;

if (html.includes(oldCardUthmaniSplit)) {
  html = html.replace(oldCardUthmaniSplit, safeCardUthmaniSplit);
  console.log('5. Secured card.ayahTextUthmani.split in presentation card');
}

// Also fix in Fullscreen Zoom
const oldZoomSplit = `{card.ayahTextUthmani.split(card.highlightedPortion).map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="bg-emerald-600/80 text-gold-200 font-bold border-b-8 border-gold-400 px-4 py-1 rounded-2xl shadow-2xl">
                                {card.highlightedPortion}
                              </span>
                            )}
                          </React.Fragment>
                        ))}`;

const safeZoomSplit = `{(() => {
                          const text = card.ayahTextUthmani || '';
                          const target = card.highlightedPortion || '';
                          if (!target || !text.includes(target)) {
                            return <span>{text}</span>;
                          }
                          return text.split(target).map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="bg-emerald-600/80 text-gold-200 font-bold border-b-8 border-gold-400 px-4 py-1 rounded-2xl shadow-2xl">
                                  {target}
                                </span>
                              )}
                            </React.Fragment>
                          ));
                        })()}`;

if (html.includes(oldZoomSplit)) {
  html = html.replace(oldZoomSplit, safeZoomSplit);
  console.log('6. Secured card.ayahTextUthmani.split in Fullscreen Zoom');
}

// 7. Fix ruleDefinition.arabic.split('لغةً')[0]
html = html.replace(
  "{tajweedData.ruleDefinition.arabic.split('لغةً')[0]}",
  "{(tajweedData.ruleDefinition?.arabic || '').includes('لغةً') ? tajweedData.ruleDefinition.arabic.split('لغةً')[0] : (tajweedData.ruleDefinition?.arabic || (isRtl ? 'حكم التجويد المستهدف' : 'Target Tajweed Rule'))}"
);

// 8. Fix card index boundary fallback
html = html.replace(
  "const card = tajweedData.presentationCards[activeSlideIndex] || tajweedData.presentationCards[0];",
  "const cardsList = tajweedData.presentationCards || [];\n                        const card = cardsList[activeSlideIndex] || cardsList[0] || { ayahTextUthmani: '', highlightedPortion: '', titleAr: '', titleEn: '', explanationAr: '', explanationEn: '' };"
);

html = html.replace(
  "const card = tajweedData.presentationCards[activeSlideIndex] || tajweedData.presentationCards[0];",
  "const cardsList = tajweedData.presentationCards || [];\n                const card = cardsList[activeSlideIndex] || cardsList[0] || { ayahTextUthmani: '', highlightedPortion: '', titleAr: '', titleEn: '', explanationAr: '', explanationEn: '' };"
);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('All defensive fixes and authentic background patterns applied successfully!');
