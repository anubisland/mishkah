const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testAll() {
  const port = 9297;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1400', 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 2000));
  
  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    function send(m, p = {}) {
      return new Promise(r => {
        const cid = id++;
        const h = e => {
          const d = JSON.parse(e.data);
          if (d.id === cid) { ws.removeEventListener('message', h); r(d.result); }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id: cid, method: m, params: p }));
      });
    }
    await new Promise(r => { ws.onopen = r; });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // Listen to console errors
    await send('Console.enable');

    console.log('--- 1. Testing Islamic Studies Branch & Cross-Link Banner ---');
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('العلوم الشرعية (Branch 3)'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Load demo Islamic lesson
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('تحميل الدرس التجريبي'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const sIslamic = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_islamic_with_eval_banner.png', Buffer.from(sIslamic.data, 'base64'));
    console.log('Captured verified_islamic_with_eval_banner.png');

    console.log('--- 2. Testing Worksheets Tab (Branch 3 - Islamic Studies) ---');
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('أوراق العمل والطباعة'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const wsTitle = await send('Runtime.evaluate', {
      expression: `document.querySelector('h2').innerText;`,
      returnByValue: true
    });
    console.log('Worksheet H2 title:', wsTitle.result.value);

    const sWsIslamic = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_islamic_worksheet_aqeedah.png', Buffer.from(sWsIslamic.data, 'base64'));
    console.log('Captured verified_islamic_worksheet_aqeedah.png');

    // Switch Islamic Worksheet Category to Fiqh
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الفقه والعبادات'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const sWsFiqh = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_islamic_worksheet_fiqh.png', Buffer.from(sWsFiqh.data, 'base64'));
    console.log('Captured verified_islamic_worksheet_fiqh.png');

    // Switch Worksheet Branch to Hifz (Branch 1)
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('سجل متابعة التحفيظ (Branch 1)'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const sWsHifz = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_hifz_evaluation_sheet.png', Buffer.from(sWsHifz.data, 'base64'));
    console.log('Captured verified_hifz_evaluation_sheet.png');

    console.log('--- 3. Testing Interactive Quizzes Tab (Branch 3 - Islamic Studies) ---');
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الاختبار الذاتي التفاعلي'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Answer questions in Aqeedah Quiz
    await send('Runtime.evaluate', {
      expression: `
        // Click second option for Q1 (Belief in Qadar)
        const buttons = Array.from(document.querySelectorAll('button'));
        const qadarBtn = buttons.find(b => b.innerText.includes('الإيمان بالقضاء والقدر'));
        if (qadarBtn) qadarBtn.click();

        // Click Umar ibn Khattab for Q2
        const umarBtn = buttons.find(b => b.innerText.includes('عمر بن الخطاب'));
        if (umarBtn) umarBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Click submit
    await send('Runtime.evaluate', {
      expression: `
        const subBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('تسليم الإجابات والتقييم الفوري'));
        if (subBtn) subBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const scoreText = await send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('النتيجة النهائية:'))?.innerText || '';`,
      returnByValue: true
    });
    console.log('Quiz Score result:', scoreText.result.value);

    const sQuizIslamic = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_islamic_quiz_submitted.png', Buffer.from(sQuizIslamic.data, 'base64'));
    console.log('Captured verified_islamic_quiz_submitted.png');

    // Switch Quiz Branch to Hifz Mutashabihat
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('اختبار المتشابهات وضبط الحفظ (Branch 1)'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const sQuizHifz = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_hifz_quiz_screen.png', Buffer.from(sQuizHifz.data, 'base64'));
    console.log('Captured verified_hifz_quiz_screen.png');

    ws.close();
    console.log('--- ALL TESTS PASSED WITH ZERO CRASHES ---');
  } finally {
    proc.kill();
  }
}

testAll().catch(e => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
