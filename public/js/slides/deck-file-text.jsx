    // Reads a lecture file for the slide studio, keeping its text and lines as
    // the teacher wrote them (no "repair" that joins or splits words: that
    // breaks Quranic words). Word (.docx), PDF, or plain text.
    async function readLectureFile(file) {
      const name = (file && file.name || '').toLowerCase();
      if (name.endsWith('.docx')) return readDocxText(file);
      if (name.endsWith('.pdf')) return readPdfText(file);
      if (name.endsWith('.txt') || name.endsWith('.md')) return file.text();
      throw new Error('نوع الملف غير مدعوم. المدعوم: وورد (.docx) أو PDF أو نص.');
    }

    async function readDocxText(file) {
      if (!window.mammoth || typeof window.mammoth.extractRawText !== 'function') {
        throw new Error('قارئ ملفات وورد لم يُحمَّل. يلزم الاتصال بالإنترنت مرة، ثم المحاولة مرة أخرى.');
      }
      const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      // Word paragraphs come separated by blank lines; one line per paragraph.
      return (result && result.value || '').split(/\n+/).map((l) => l.trim()).filter(Boolean).join('\n');
    }

    async function readPdfText(file) {
      if (!window.pdfjsLib) throw new Error('قارئ ملفات PDF لم يُحمَّل. يلزم الاتصال بالإنترنت مرة، ثم المحاولة مرة أخرى.');
      // isEvalSupported: false — see the PDF.js security note in lecture-actions.jsx.
      const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false }).promise;
      const lines = [];
      for (let p = 1; p <= pdf.numPages; p++) {
        const content = await (await pdf.getPage(p)).getTextContent();
        // Group the pieces of text into lines by height, then order each line
        // right to left (Arabic).
        const rows = [];
        (content.items || []).forEach((it) => {
          if (!it || typeof it.str !== 'string' || !it.str.trim()) return;
          const y = Math.round(it.transform[5]);
          let row = rows.find((r) => Math.abs(r.y - y) <= 3);
          if (!row) { row = { y, parts: [] }; rows.push(row); }
          row.parts.push({ x: it.transform[4], str: it.str });
        });
        rows.sort((a, b) => b.y - a.y).forEach((r) => {
          lines.push(r.parts.sort((a, b) => b.x - a.x).map((pt) => pt.str).join(' ').replace(/\s+/g, ' ').trim());
        });
      }
      return lines.filter(Boolean).join('\n');
    }
