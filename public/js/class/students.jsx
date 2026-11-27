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

    function readList(key) {
      try {
        const saved = localStorage.getItem(key);
        const list = saved ? JSON.parse(saved) : [];
        return Array.isArray(list) ? list : [];
      } catch (e) {
        console.warn('Mishkah: saved list is unreadable: ' + key, e);
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

    function addTasmeeRecord(record) {
      return writeList(TASMEE_RECORDS_KEY, loadTasmeeRecords().concat([record]));
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
      const whole = Math.floor(n);
      const half = n - whole >= 0.5;
      if (!whole && half) return '½';
      return String(whole) + (half ? '½' : '');
    }
