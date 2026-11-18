const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureMutashabihatView() {
  const port = 9248;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1100', 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    const calls = new Map();
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && calls.has(d.id)) { calls.get(d.id)(d); calls.delete(d.id); }
    };
    function send(m, p={}) { return new Promise(r => { const i = id++; calls.set(i, r); ws.send(JSON.stringify({id:i, method:m, params:p})); }); }
    await new Promise(r => ws.onopen = r);
    await send('Page.enable');

    // Switch to Hifz
    await send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('التحفيظ')).click()` });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to bottom (Mutashabihat)
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, document.body.scrollHeight)` });
    await new Promise(r => setTimeout(r, 600));

    // Click "إضافة أو ربط متشابهة جديدة"
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('إضافة أو ربط متشابهة'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Scroll slightly so the drawer is fully centered
    await send('Runtime.evaluate', { expression: `window.scrollBy(0, 300)` });
    await new Promise(r => setTimeout(r, 500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mutashabihat_drawer_view.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved mutashabihat_drawer_view.png');
    ws.close();
  } finally {
    proc.kill();
  }
}
captureMutashabihatView();
