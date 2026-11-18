const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testBothModes() {
  console.log('Testing Both Modes in Hifz...');
  const port = 9265;
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

    // 1. Switch to Hifz tab
    console.log('1. Switching to Hifz tab...');
    await send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('التحفيظ')).click()` });
    await new Promise(r => setTimeout(r, 1200));

    // Capture screenshot of Mode 1 (Mushaf Page + Switcher Buttons)
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mode1_mushaf_view.png', Buffer.from(shot1.result.data, 'base64'));
    console.log('Saved mode1_mushaf_view.png');

    // 2. Click "2. لوحة التسميع واختبار الإتقان"
    console.log('2. Clicking Mode 2 (Testing Board) button...');
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

    // Capture screenshot of Mode 2 (Testing Board)
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mode2_testing_board.png', Buffer.from(shot2.result.data, 'base64'));
    console.log('Saved mode2_testing_board.png');

    console.log('Total exceptions:', caughtExceptions.length);
    ws.close();
  } finally {
    proc.kill();
  }
}
testBothModes();
