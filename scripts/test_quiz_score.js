const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function check() {
  const port = 9299;
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
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الاختبار الذاتي التفاعلي'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click option
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const opt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('الإيمان بالقضاء والقدر'));
        if (opt) { opt.click(); return 'clicked opt'; }
        return 'opt not found';
      })()`,
      returnByValue: true
    });
    console.log('Option click:', clickRes);

    await new Promise(r => setTimeout(r, 500));

    const submitRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const sub = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('تسليم الإجابات والتقييم الفوري'));
        if (sub) {
          const disabled = sub.disabled;
          sub.click();
          return { disabled, clicked: true };
        }
        return { notFound: true };
      })()`,
      returnByValue: true
    });
    console.log('Submit button state:', submitRes);

    await new Promise(r => setTimeout(r, 800));

    const score = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = Array.from(document.querySelectorAll('div')).find(e => e.innerText && e.innerText.includes('النتيجة النهائية:'));
        return el ? el.innerText : 'not found';
      })()`,
      returnByValue: true
    });
    console.log('Score text:', score);

    ws.close();
  } finally {
    proc.kill();
  }
}
check();
