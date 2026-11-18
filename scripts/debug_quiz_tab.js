const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function logBtns() {
  const port = 9300;
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

    // Click Quiz Tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الاختبار الذاتي التفاعلي'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
      })()`,
      returnByValue: true
    });
    console.log('All buttons on quiz tab:', res.result.value);

    const htmlSnippet = await send('Runtime.evaluate', {
      expression: `(() => {
        return document.querySelector('main')?.innerHTML?.substring(0, 1000);
      })()`,
      returnByValue: true
    });
    console.log('Main snippet:', htmlSnippet.result.value);

    ws.close();
  } finally {
    proc.kill();
  }
}
logBtns();
