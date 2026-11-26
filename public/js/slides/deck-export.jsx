    // Exports a deck as a PDF, a zip of PNG images, or a PowerPoint of slide
    // images with the teacher's notes as speaker notes.
    //
    // Slides are captured with html-to-image, which draws through the browser's
    // own renderer (SVG foreignObject), so Arabic joining and the Uthmani font
    // come out exactly as on screen. Canvas re-implementations such as
    // html2canvas break Arabic shaping, which is why they are not used here.
    // The two capture/PDF libraries load only when the teacher first exports.

    const EXPORT_LIBRARIES = {
      htmlToImage: 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js',
      jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    };

    const loadedScripts = {};
    function loadScriptOnce(url) {
      if (!loadedScripts[url]) {
        loadedScripts[url] = new Promise((resolve, reject) => {
          const tag = document.createElement('script');
          tag.src = url;
          tag.onload = resolve;
          tag.onerror = () => {
            delete loadedScripts[url];
            reject(new Error('تعذّر تحميل أداة التصدير. يلزم الاتصال بالإنترنت، ثم المحاولة مرة أخرى.'));
          };
          document.head.appendChild(tag);
        });
      }
      return loadedScripts[url];
    }

    // html-to-image cannot read the Google Fonts stylesheet (another origin), and
    // without it every slide falls back to a plain font with no error. So the
    // slide fonts are fetched once here and handed over as embedded CSS.
    const SLIDE_FONTS_CSS_URL = 'https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@400;500;700;800&family=Amiri:wght@400;700&family=Amiri+Quran&display=block';
    let slideFontCssPromise = null;

    const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    async function buildSlideFontCss() {
      const response = await fetch(SLIDE_FONTS_CSS_URL);
      if (!response.ok) throw new Error('font css ' + response.status);
      let css = await response.text();
      const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))];
      const embedded = await Promise.all(urls.map(async (url) => {
        const font = await fetch(url);
        if (!font.ok) throw new Error('font file ' + font.status);
        return [url, await blobToDataUrl(await font.blob())];
      }));
      embedded.forEach(([url, data]) => { css = css.split(url).join(data); });
      return css;
    }

    function getSlideFontCss() {
      if (!slideFontCssPromise) {
        slideFontCssPromise = buildSlideFontCss().catch((e) => {
          slideFontCssPromise = null;
          console.warn('Mishkah: slide fonts could not be embedded', e);
          throw new Error('تعذّر تحميل خطوط الشرائح، فلن تظهر الصور بخطوطها الصحيحة. يلزم الاتصال بالإنترنت، ثم المحاولة مرة أخرى.');
        });
      }
      return slideFontCssPromise;
    }

    // A timer, not requestAnimationFrame: browsers pause animation frames in a
    // hidden window, and the teacher may switch windows while exporting.
    const nextFrame = () => new Promise((r) => setTimeout(r, 60));

    // Draws each slide off screen at full size and captures it as an image data
    // URL: PNG for full quality, or JPEG to keep a PDF small enough to share.
    async function captureDeckSlides(deck, onProgress, format) {
      await loadScriptOnce(EXPORT_LIBRARIES.htmlToImage);
      const fontEmbedCSS = await getSlideFontCss();
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:-20000px;top:0;width:1600px;height:900px;pointer-events:none;';
      document.body.appendChild(host);
      const root = ReactDOM.createRoot(host);
      const images = [];
      try {
        for (let i = 0; i < deck.slides.length; i++) {
          onProgress(i, deck.slides.length);
          root.render(<SlideView key={deck.slides[i].id} slide={deck.slides[i]} deck={deck} index={i} total={deck.slides.length} />);
          // Let the slide mount and shrink its text if it overflows.
          for (let f = 0; f < 4; f++) await nextFrame();
          const node = host.firstElementChild;
          const options = { width: 1600, height: 900, pixelRatio: 1.5, cacheBust: true, fontEmbedCSS };
          images.push(format === 'jpeg'
            ? await window.htmlToImage.toJpeg(node, Object.assign({ quality: 0.88, backgroundColor: '#ffffff' }, options))
            : await window.htmlToImage.toPng(node, options));
        }
      } finally {
        root.unmount();
        host.remove();
      }
      return images;
    }

    function safeFileName(deck) {
      return ((deck.title || 'عرض مشكاة').replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 60)) || 'عرض مشكاة';
    }

    function downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    async function exportDeckAsPdf(deck, onProgress) {
      // JPEG keeps a long lecture small enough for WhatsApp and email; PNG pages
      // would be lossless but tens of megabytes.
      const images = await captureDeckSlides(deck, onProgress, 'jpeg');
      await loadScriptOnce(EXPORT_LIBRARIES.jspdf);
      const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'px', format: [1600, 900], compress: true });
      images.forEach((img, i) => {
        if (i > 0) pdf.addPage([1600, 900], 'landscape');
        pdf.addImage(img, 'JPEG', 0, 0, 1600, 900, undefined, 'FAST');
      });
      downloadBlob(pdf.output('blob'), safeFileName(deck) + '.pdf');
    }

    async function exportDeckAsImages(deck, onProgress) {
      const images = await captureDeckSlides(deck, onProgress);
      const zip = new JSZip();
      images.forEach((img, i) => {
        zip.file('شريحة-' + String(i + 1).padStart(2, '0') + '.png', img.split(',')[1], { base64: true });
      });
      downloadBlob(await zip.generateAsync({ type: 'blob' }), safeFileName(deck) + ' - صور.zip');
    }

    // Each slide is one full-size picture, so PowerPoint shows it exactly as
    // designed; the teacher's notes go into PowerPoint's speaker notes.
    async function exportDeckAsPowerPoint(deck, onProgress) {
      const images = await captureDeckSlides(deck, onProgress);
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';
      pptx.rtlMode = true;
      pptx.title = deck.title || 'عرض مشكاة';
      images.forEach((img, i) => {
        const slide = pptx.addSlide();
        slide.addImage({ data: img, x: 0, y: 0, w: 10, h: 5.625 });
        if (deck.slides[i].notes) slide.addNotes(deck.slides[i].notes);
      });
      await pptx.writeFile({ fileName: safeFileName(deck) + '.pptx' });
    }

    const DECK_EXPORTS = [
      { id: 'pdf', label: 'ملف PDF', hint: 'للإرسال للطالبات', run: exportDeckAsPdf },
      { id: 'images', label: 'صور (ملف مضغوط)', hint: 'صورة لكل شريحة', run: exportDeckAsImages },
      { id: 'pptx', label: 'باوربوينت', hint: 'مع ملاحظات المعلم في ملاحظات المتحدث', run: exportDeckAsPowerPoint }
    ];
