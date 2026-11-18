const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testCreativeSuite() {
  console.log('Testing Creative Suite & Arrow Directions...');
  const port = 9275;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1200', 'http://localhost:3000']);
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
        console.error('❌ Exception:', d.params.exceptionDetails.text, d.params.exceptionDetails.exception?.description);
      }
    };
    function send(m, p={}) { return new Promise(r => { const i = id++; calls.set(i, r); ws.send(JSON.stringify({id:i, method:m, params:p})); }); }
    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    // Switch to Hifz
    await send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('التحفيظ')).click()` });
    await new Promise(r => setTimeout(r, 1200));

    // Capture Mode 1 Arrows
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/correct_arrows_mushaf.png', Buffer.from(shot1.result.data, 'base64'));
    console.log('Saved correct_arrows_mushaf.png');

    // Switch to Mode 2 (Testing Suite)
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('لوحة التسميع واختبار الإتقان'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Capture Creative Suite Ribbon
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/creative_testing_suite.png', Buffer.from(shot2.result.data, 'base64'));
    console.log('Saved creative_testing_suite.png');

    // Test clicking "طمس مطالع الآيات"
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('طمس مطالع الآيات'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Scroll to see masked starters
    await send('Runtime.evaluate', { expression: `window.scrollBy(0, 350)` });
    await new Promise(r => setTimeout(r, 500));

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/starters_masked_sample.png', Buffer.from(shot3.result.data, 'base64'));
    console.log('Saved starters_masked_sample.png');

    console.log('Total exceptions:', caughtExceptions.length);
    ws.close();
  } finally {
    proc.kill();
  }
}
testCreativeSuite();
