const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkConsole() {
  const port = 9237;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    const calls = new Map();
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && calls.has(d.id)) { calls.get(d.id)(d); calls.delete(d.id); }
      if (d.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE [' + d.params.type + ']:', d.params.args.map(a => a.value || a.description).join(' '));
      }
    };
    function send(m, p={}) { return new Promise(r => { const i = id++; calls.set(i, r); ws.send(JSON.stringify({id:i, method:m, params:p})); }); }
    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');

    // Switch to Hifz tab
    await send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('التحفيظ')).click()` });
    await new Promise(r => setTimeout(r, 1000));

    // Click Quran Picker
    await send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('اختيار سورة')).click()` });
    await new Promise(r => setTimeout(r, 1000));

    ws.close();
  } finally {
    proc.kill();
  }
}
checkConsole();
