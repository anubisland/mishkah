const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureZoomSlideOnly() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-zoom-'));
  const port = 9360;
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tmpDir,
    '--window-size=1280,1800',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 6500));

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

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    // Click Tajweed Tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أدوات التجويد (Branch 2)'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    // Open Zoom Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('عرض زوم') || x.textContent.includes('Full Zoom Share'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    // Advance to Slide 1 (Quranic Word)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('الشريحة التالية') || x.textContent.includes('Next'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    // Capture screenshot
    const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step5_zoom_slide1.png', Buffer.from(ss.data, 'base64'));
    console.log('Successfully captured updated suwayd_step5_zoom_slide1.png!');

    ws.close();
    proc.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.exit(1);
  }
}

captureZoomSlideOnly();
