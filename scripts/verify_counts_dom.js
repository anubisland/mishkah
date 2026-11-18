const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkVals() {
  const port = 9295;
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
    await new Promise(r => setTimeout(r, 2000));

    // Click Branch 1 (Hifz)
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('أدوات التحفيظ (Branch 1)'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const res1 = await send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('h2')).filter(h => h.innerText.includes('مدارسة مصحف المدينة')).length;`,
      returnByValue: true
    });
    console.log('Hifz headers count (MUST BE 1):', res1.result.value);

    // Screenshot Mode 1
    const s1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_single_mushaf_page.png', Buffer.from(s1.data, 'base64'));

    // Switch to Mode 2: "2. لوحة التسميع واختبار الإتقان"
    await send('Runtime.evaluate', {
      expression: `
        const m2 = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('2. لوحة التسميع'));
        if (m2) m2.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    const res2 = await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('.font-quran').length;`,
      returnByValue: true
    });
    console.log('Ayahs count rendered in Mode 2 (MUST BE 12):', res2.result.value);

    const res3 = await send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('.font-quran')).slice(0, 3).map(el => el.innerText.replace(/\\s+/g, ' ').trim());`,
      returnByValue: true
    });
    console.log('Sample rendered ayahs in Mode 2:', res3.result.value);

    // Screenshot Mode 2
    const s2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_mode2_12_ayahs.png', Buffer.from(s2.data, 'base64'));

    // Click "الوجه التالي" in Mode 2
    await send('Runtime.evaluate', {
      expression: `
        const nextBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الوجه التالي'));
        if (nextBtn) nextBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const res4 = await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('.font-quran').length;`,
      returnByValue: true
    });
    console.log('Ayahs count in Page 563 (MUST BE 14):', res4.result.value);

    const s3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_mode2_page_563.png', Buffer.from(s3.data, 'base64'));

    ws.close();
  } finally {
    proc.kill();
  }
}

checkVals();
