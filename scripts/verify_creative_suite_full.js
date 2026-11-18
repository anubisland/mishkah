const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyFull() {
  console.log('--- Starting Comprehensive Creative Suite Verification ---');
  const port = 9280;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1300', 'http://localhost:3000']);
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
        console.error('❌ Exception:', d.params.exceptionDetails.text);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        calls.set(curId, (res) => resolve(res.result));
        ws.send(JSON.stringify({ id: curId, method, params }));
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
    await new Promise(r => setTimeout(r, 1500));

    // Screenshot 1: Mushaf page with the new testing toolbar
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_with_testing_toolbar.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved mushaf_with_testing_toolbar.png');

    // 3. Click "المسطرة الكاشفة" (Line Ruler)
    await send('Runtime.evaluate', {
      expression: `
        const rBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('المسطرة الكاشفة'));
        if (rBtn) rBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Advance ruler by 3 lines
    await send('Runtime.evaluate', {
      expression: `
        const nextLineBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('كشف السطر التالي'));
        if (nextLineBtn) {
          nextLineBtn.click();
          nextLineBtn.click();
        }
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_ruler_revealed_3lines.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved mushaf_ruler_revealed_3lines.png');

    // 4. Click "حجب النصف الأسفل"
    await send('Runtime.evaluate', {
      expression: `
        const botBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('حجب النصف الأسفل'));
        if (botBtn) botBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_bottom_half_masked.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved mushaf_bottom_half_masked.png');

    // 5. Switch to Mode 2: "2. لوحة التسميع واختبار الإتقان"
    await send('Runtime.evaluate', {
      expression: `
        const m2Btn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('2. لوحة التسميع'));
        if (m2Btn) m2Btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Click "طمس مطالع الآيات" and "طمس فواصل الآيات"
    await send('Runtime.evaluate', {
      expression: `
        const sBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('طمس مطالع'));
        if (sBtn) sBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const shot4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mode2_creative_testing_active.png', Buffer.from(shot4.data, 'base64'));
    console.log('Saved mode2_creative_testing_active.png');

    console.log('Total caught exceptions:', caughtExceptions.length);
    ws.close();
  } finally {
    proc.kill();
  }
}

verifyFull();
