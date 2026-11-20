const { spawn } = require('child_process');
const fs = require('fs');

async function testMobile() {
  const port = 9411;
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless',
    '--remote-debugging-port=' + port,
    '--window-size=412,915',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 6500));
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

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 412,
    height: 915,
    deviceScaleFactor: 2,
    mobile: true
  });

  await new Promise(r => setTimeout(r, 1000));

  // Click Islamic tab
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('العلوم الشرعية'));
        if (b) b.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904\\verified_mobile_file_uploader.png', Buffer.from(ss.data, 'base64'));
  console.log('Saved verified_mobile_file_uploader.png');

  ws.close();
  proc.kill();
}

testMobile().catch(console.error);
