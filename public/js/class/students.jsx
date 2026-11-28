    // The teacher's students and their recitation (تسميع) records, kept on this
    // device. Each record is one page (وجه) recited from memory: how many
    // mistakes of each kind, the limit that applied, and whether the page was
    // passed or is to be repeated.
    //
    // student = { id, name, mistakeLimit }
    // record  = { id, studentId, at (ISO), page, surahName, memo, tash, prompt,
    //             total, limit, result: 'passed' | 'repeat', words: [{ word, ayah, type }] }
    const STUDENTS_KEY = 'mishkah_students';
    const TASMEE_RECORDS_KEY = 'mishkah_tasmee_records';
    const DEFAULT_MISTAKE_LIMIT = 3;

    // A memorisation mistake (a word forgotten or swapped) and a prompt from the
    // teacher count one each; a tashkeel or tajweed mistake counts half.
    const MISTAKE_WEIGHTS = { memo: 1, tash: 0.5, prompt: 1 };
    const MISTAKE_LABELS = { memo: 'خطأ حفظ', tash: 'خطأ تشكيل أو تجويد', prompt: 'تلقين' };

    // An unreadable saved list is copied aside before anything can overwrite
    // it, so a later save never erases the teacher's records.
    function readList(key) {
      let saved = null;
      try {
        saved = localStorage.getItem(key);
        const list = saved ? JSON.parse(saved) : [];
        if (Array.isArray(list)) return list;
        throw new Error('not a list');
      } catch (e) {
        console.warn('Mishkah: saved list is unreadable, kept aside: ' + key, e);
        // Kept once under a fixed name, then the broken value is cleared, so
        // reading again never piles up copies.
        try {
          if (saved && localStorage.getItem(key + '_unreadable') !== saved) localStorage.setItem(key + '_unreadable', saved);
          localStorage.setItem(key, '[]');
        } catch (e2) { console.warn('Mishkah: could not keep the unreadable list aside', e2); }
        return [];
      }
    }

    // Returns an Arabic error message, or null when saved.
    function writeList(key, list) {
      try {
        localStorage.setItem(key, JSON.stringify(list));
        return null;
      } catch (e) {
        console.warn('Mishkah: could not save ' + key, e);
        return 'تعذّر الحفظ على الجهاز (قد تكون الذاكرة ممتلئة).';
      }
    }

    function loadStudents() {
      return readList(STUDENTS_KEY).filter((s) => s && s.id && typeof s.name === 'string' && s.name);
    }

    function saveStudents(list) {
      return writeList(STUDENTS_KEY, list);
    }

    function newStudent(name) {
      return { id: 's' + Date.now().toString(36), name: name.trim(), mistakeLimit: DEFAULT_MISTAKE_LIMIT };
    }

    function loadTasmeeRecords() {
      return readList(TASMEE_RECORDS_KEY).filter((r) => r && r.id && r.studentId && !isNaN(Date.parse(r.at)));
    }

    // The newest records are kept when the list grows very long, so saving
    // never starts failing for lack of space.
    const TASMEE_RECORDS_MAX = 3000;
    function addTasmeeRecord(record) {
      return writeList(TASMEE_RECORDS_KEY, loadTasmeeRecords().concat([record]).slice(-TASMEE_RECORDS_MAX));
    }

    // A student removed from the list takes their record with them.
    function deleteStudentRecords(studentId) {
      return writeList(TASMEE_RECORDS_KEY, loadTasmeeRecords().filter((r) => r.studentId !== studentId));
    }

    function recordsForStudent(studentId) {
      return loadTasmeeRecords().filter((r) => r.studentId === studentId)
        .sort((a, b) => new Date(b.at) - new Date(a.at));
    }

    function mistakeTotal(mistakes) {
      return mistakes.reduce((sum, m) => sum + (MISTAKE_WEIGHTS[m.type] || 0), 0);
    }

    // 1.5 reads «1½», as teachers write it.
    function formatMistakes(n) {
      if (!Number.isFinite(n)) return '—';
      const whole = Math.floor(n);
      const half = n - whole >= 0.5;
      if (!whole && half) return '½';
      return String(whole) + (half ? '½' : '');
    }
