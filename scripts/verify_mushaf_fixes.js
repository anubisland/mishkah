const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyMushafFixes() {
  console.log('--- Verifying Mushaf Fixes (Single Instance + Compact Font + Page Nav) ---');
  const port = 9292;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1400', 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    const calls = new Map();
    let caughtExceptions = [];

    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && calls.has(d.id)) { calls.get(d.id)(d); calls.delete(d.id); }
      if (d.method === 'Runtime.exceptionThrown') {
        caughtExceptions.push(d.params.exceptionDetails);
        console.error('❌ Exception:', d.params.exceptionDetails.text, d.params.exceptionDetails.exception);
      }
    };

    function send(m, p = {}) {
      return new Promise(r => {
        const cid = id++;
        calls.set(cid, res => r(res.result));
        ws.send(JSON.stringify({ id: cid, method: m, params: p }));
      });
    }

    await new Promise(r => { ws.onopen = r; });
    await send('Runtime.enable');
    await send('Page.enable');

    // 1. Navigate
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // 2. Click Branch 1 (Hifz)
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('أدوات التحفيظ (Branch 1)'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Check count of Hifz headers in DOM
    const headerCheck = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('h2')).filter(h => h.innerText.includes('مدارسة مصحف المدينة')).length;
      `,
      returnByValue: true
    });
    console.log('Hifz headers in DOM (should be 1):', headerCheck.value);

    // Screenshot 1: Single Instance Mode 1
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_single_instance.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved mushaf_single_instance.png');

    // 3. Switch to Mode 2: "2. لوحة التسميع واختبار الإتقان"
    await send('Runtime.evaluate', {
      expression: `
        const m2 = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('2. لوحة التسميع'));
        if (m2) m2.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Check count of ayahs rendered in DOM
    const ayahCountCheck = await send('Runtime.evaluate', {
      expression: `
        document.querySelectorAll('.font-quran').length;
      `,
      returnByValue: true
    });
    console.log('Ayahs rendered in Mode 2:', ayahCountCheck.value);

    // Screenshot 2: Mode 2 with full page 562 (12 ayahs) and compact font
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mode2_compact_proportional_ayahs.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved mode2_compact_proportional_ayahs.png');

    // 4. Click "الوجه التالي ➡️" in Mode 2
    await send('Runtime.evaluate', {
      expression: `
        const nextBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الوجه التالي'));
        if (nextBtn) nextBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 3: Mode 2 on Page 563 (Ayahs 13–26)
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mode2_page_563_ayahs.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved mode2_page_563_ayahs.png');

    console.log('Total caught exceptions:', caughtExceptions.length);
    ws.close();
  } finally {
    proc.kill();
  }
}

verifyMushafFixes();
