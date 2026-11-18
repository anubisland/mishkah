const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkButtons() {
  const port = 9278;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1440,1200', 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        const handler = (e) => {
          const res = JSON.parse(e.data);
          if (res.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }
    await new Promise(r => { ws.onopen = r; });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    // Click on Branch 1 (Hifz)
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('أدوات التحفيظ (Branch 1)'));
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('button'))
          .filter(b => b.innerText.includes('الوجه') || b.innerText.includes('المصحف') || b.innerText.includes('التسميع'))
          .map(b => ({
            text: b.innerText.replace(/\\s+/g, ' ').trim(),
            x: Math.round(b.getBoundingClientRect().x),
            y: Math.round(b.getBoundingClientRect().y),
            width: Math.round(b.getBoundingClientRect().width),
            html: b.innerHTML
          }))
      `,
      returnByValue: true
    });
    console.log('Nav Buttons Info:');
    console.log(JSON.stringify(evalRes.result.value, null, 2));
    ws.close();
  } finally {
    proc.kill();
  }
}
checkButtons();
