const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function auditAllTabs() {
  console.log('--- Starting Comprehensive Multi-Device Audit of Mishkah ---');
  const port = 9290;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1200', 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    const calls = new Map();
    let caughtExceptions = [];
    let consoleErrors = [];

    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && calls.has(d.id)) { calls.get(d.id)(d); calls.delete(d.id); }
      if (d.method === 'Runtime.exceptionThrown') {
        caughtExceptions.push(d.params.exceptionDetails);
        console.error('❌ Exception:', d.params.exceptionDetails.text);
      }
      if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') {
        consoleErrors.push(d.params.entry.text);
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
    await send('Log.enable');

    // Navigate
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    const tabsToTest = [
      { name: 'Dashboard', selector: 'لوحة المعلم' },
      { name: 'Branch 1 - Hifz', selector: 'أدوات التحفيظ' },
      { name: 'Branch 2 - Tajweed', selector: 'أدوات التجويد' },
      { name: 'Branch 3 - Islamic', selector: 'العلوم الشرعية' },
      { name: 'Worksheet', selector: 'أوراق العمل' },
      { name: 'Quiz', selector: 'الاختبار الذاتي' }
    ];

    for (const t of tabsToTest) {
      console.log('Testing tab:', t.name);
      await send('Runtime.evaluate', {
        expression: `
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('${t.selector}'));
          if (btn) btn.click();
        `
      });
      await new Promise(r => setTimeout(r, 1000));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/audit_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`, Buffer.from(shot.data, 'base64'));
    }

    console.log('--- Audit Summary ---');
    console.log('Caught Exceptions:', caughtExceptions.length);
    console.log('Console Errors:', consoleErrors.length);
    ws.close();
  } finally {
    proc.kill();
  }
}

auditAllTabs();
