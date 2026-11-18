const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testPassageFlow() {
  console.log('--- Testing Passage Recitation & Teacher Verdict Flow ---');
  const port = 9282;
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
        console.error('❌ Exception:', d.params.exceptionDetails.text, d.params.exceptionDetails.exception);
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
    await new Promise(r => setTimeout(r, 1200));

    // 3. Switch to Mode 2: "2. لوحة التسميع واختبار الإتقان"
    await send('Runtime.evaluate', {
      expression: `
        const m2 = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('2. لوحة التسميع'));
        if (m2) m2.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // 4. Click "مقطع بداية الصفحة" (Start Passage)
    await send('Runtime.evaluate', {
      expression: `
        const startBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('مقطع بداية الصفحة'));
        if (startBtn) startBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 1: Passage masked state
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/passage_test_masked.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved passage_test_masked.png');

    // 5. Click "قالها غلط (إعادة المقطع)"
    await send('Runtime.evaluate', {
      expression: `
        const errorBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('قالها غلط'));
        if (errorBtn) errorBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 2: Passage in error / retry state
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/passage_test_retry.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved passage_test_retry.png');

    // 6. Click "قالها صح (إظهار المقطع)" or "أتقن بعد الإعادة"
    await send('Runtime.evaluate', {
      expression: `
        const successBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('قالها صح') || btn.innerText.includes('أتقن بعد الإعادة'));
        if (successBtn) successBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 3: Passage revealed after success
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/passage_test_revealed_success.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved passage_test_revealed_success.png');

    // 7. Click "مقطع وسط الصفحة" (Middle Passage)
    await send('Runtime.evaluate', {
      expression: `
        const midBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('مقطع وسط الصفحة'));
        if (midBtn) midBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const shot4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/passage_test_middle.png', Buffer.from(shot4.data, 'base64'));
    console.log('Saved passage_test_middle.png');

    console.log('Total caught exceptions:', caughtExceptions.length);
    ws.close();
  } finally {
    proc.kill();
  }
}

testPassageFlow();
