const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureMawaqeet() {
  const port = 9239;
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=' + port,
    '--window-size=1440,900',
    'file:///C:/Users/melwa/OneDrive/Documents/GitHub/mawaqeet-qibla/index.html'
  ]);

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
    await new Promise(r => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mawaqeet_screenshot.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved mawaqeet_screenshot.png');
    ws.close();
  } finally {
    proc.kill();
  }
}

captureMawaqeet();
