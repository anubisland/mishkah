const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function listAllButtons() {
  const port = 9348;
  const p = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, 'http://localhost:3000']);
  await new Promise(r => setTimeout(r, 6500));

  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `Array.from(document.querySelectorAll('button')).map((b, i) => ({ i, text: b.textContent.trim().replace(/\\s+/g, ' ') }))`,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.id === 1) {
        console.log('ALL BUTTONS FOUND:');
        console.log(data.result.result.value);
        ws.close();
        p.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    p.kill();
  }
}

listAllButtons();
