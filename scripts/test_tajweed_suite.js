const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTajweedSuite() {
  console.log('--- Testing Tajweed Suite (Makhaarij Atlas + Metronome) ---');
  const port = 9287;
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
    await new Promise(r => setTimeout(r, 2000));

    // 2. Click Branch 2 (Tajweed)
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('أدوات التجويد (Branch 2)'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Screenshot 1: Tajweed Generator with sub-nav
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/tajweed_subnav_generator.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved tajweed_subnav_generator.png');

    // 3. Click "2. أطلس مخارج الحروف الخمسة"
    await send('Runtime.evaluate', {
      expression: `
        const atlasBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('أطلس مخارج'));
        if (atlasBtn) atlasBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Click "الحلق"
    await send('Runtime.evaluate', {
      expression: `
        const halqBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الحلق'));
        if (halqBtn) halqBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 2: Makhaarij Atlas
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/tajweed_makhaarij_atlas.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved tajweed_makhaarij_atlas.png');

    // 4. Click "3. ميزان الأزمنة والحركات الإيقاعي"
    await send('Runtime.evaluate', {
      expression: `
        const metroBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('ميزان الأزمنة'));
        if (metroBtn) metroBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Select 4 counts and start metronome
    await send('Runtime.evaluate', {
      expression: `
        const c4 = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('4 حركات'));
        if (c4) c4.click();
        const playBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('بدء النبض'));
        if (playBtn) playBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Screenshot 3: Timing Metronome
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/tajweed_timing_metronome.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved tajweed_timing_metronome.png');

    console.log('Total caught exceptions:', caughtExceptions.length);
    ws.close();
  } finally {
    proc.kill();
  }
}

testTajweedSuite();
