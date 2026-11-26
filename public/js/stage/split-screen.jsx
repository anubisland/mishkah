    // One laptop screen, two windows: the student window (shared on Zoom) takes
    // the left half and the teacher's window the right half. A script may place
    // the window it opened, but browsers do not let it move the teacher's own
    // window, so she is shown the one key press that snaps it into place.
    const SPLIT_HINT_HIDDEN_KEY = 'mishkah_split_hint_hidden';

    function studentWindowBounds() {
      const s = window.screen || {};
      const width = Math.floor((s.availWidth || 1280) / 2);
      const height = s.availHeight || 720;
      return { left: s.availLeft || 0, top: s.availTop || 0, width, height };
    }

    function studentWindowFeatures() {
      const b = studentWindowBounds();
      return 'popup=yes,width=' + b.width + ',height=' + b.height + ',left=' + b.left + ',top=' + b.top +
        ',menubar=no,toolbar=no,location=no,status=no,resizable=yes';
    }

    // Also used when the window is already open (window.open reuses it by name
    // but keeps its old size and place).
    function placeStudentWindow(win) {
      const b = studentWindowBounds();
      try {
        win.moveTo(b.left, b.top);
        win.resizeTo(b.width, b.height);
      } catch (e) {
        console.warn('Mishkah: the browser did not let us place the student window', e);
      }
    }

    function isMacComputer() {
      return /Mac/i.test(navigator.platform || navigator.userAgent || '');
    }

    function splitHintHidden() {
      try { return localStorage.getItem(SPLIT_HINT_HIDDEN_KEY) === '1'; } catch (e) { return false; }
    }

    // Shown to the teacher after the student window opens.
    function SplitScreenHint({ onClose }) {
      const [dontShow, setDontShow] = useState(false);
      const close = () => {
        if (dontShow) {
          try { localStorage.setItem(SPLIT_HINT_HIDDEN_KEY, '1'); } catch (e) { console.warn('Mishkah: could not save the hint setting', e); }
        }
        onClose();
      };
      const mac = isMacComputer();
      return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 border-2 border-gold-400">
            <h3 className="text-xl font-black text-emerald-950">🖥️ فُتحت شاشة الطالب في نصف الشاشة الأيسر</h3>

            {/* A small picture of the arrangement: student left, teacher right. */}
            <div className="flex gap-2 h-28 rounded-xl border-2 border-slate-300 p-2 bg-slate-50" dir="ltr">
              <div className="flex-1 rounded-lg bg-emerald-900 text-gold-200 font-black flex flex-col items-center justify-center text-sm">
                <span>شاشة الطالب</span><span className="text-xs font-bold opacity-80">تُشارَك في زوم</span>
              </div>
              <div className="flex-1 rounded-lg bg-gold-100 border-2 border-gold-400 text-emerald-950 font-black flex flex-col items-center justify-center text-sm">
                <span>مِشكاة (المعلم)</span><span className="text-xs font-bold opacity-80">الأدوات والملاحظات</span>
              </div>
            </div>

            <div className="text-emerald-950 leading-loose">
              <p className="font-bold">لوضع نافذة مِشكاة في النصف الأيمن:</p>
              {mac ? (
                <p>بالضغط مطولاً على الزر الأخضر أعلى نافذة المتصفح، ثم اختيار «وضع النافذة على يمين الشاشة».</p>
              ) : (
                <p>بالضغط على هذه النافذة، ثم الضغط معاً على <kbd className="px-2 py-0.5 rounded bg-slate-200 border font-mono">⊞ Windows</kbd> + <kbd className="px-2 py-0.5 rounded bg-slate-200 border font-mono">→</kbd></p>
              )}
              <p className="text-sm text-slate-600 mt-1">وفي زوم: تُشارَك نافذة «مِشكاة | شاشة الطالب» وحدها.</p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} />
              عدم إظهار هذه الرسالة مرة أخرى
            </label>
            <button type="button" onClick={close} className="w-full py-2.5 rounded-xl bg-emerald-900 text-gold-200 font-black">فهمت</button>
          </div>
        </div>
      );
    }
