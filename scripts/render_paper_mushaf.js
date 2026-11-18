const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Create a small HTML file that wraps page562 on authentic warm ivory paper
const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 30px;
      background-color: #f3f8f5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Cairo', sans-serif;
    }
    .mushaf-frame {
      background-color: #FFFDF7;
      border: 8px solid #064e3b;
      outline: 2px solid #d97706;
      border-radius: 20px;
      padding: 30px 40px;
      box-shadow: 0 15px 40px rgba(6, 78, 59, 0.15);
      max-width: 650px;
      width: 100%;
      text-align: center;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #d97706;
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #064e3b;
      font-weight: bold;
      font-size: 16px;
    }
    .mushaf-img {
      width: 100%;
      height: auto;
      display: block;
      background-color: #ffffff;
      filter: contrast(1.1);
    }
    .page-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1.5px solid #d97706;
      padding-top: 10px;
      margin-top: 20px;
      color: #064e3b;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="mushaf-frame">
    <div class="page-header">
      <span>الجزء التاسع والعشرون</span>
      <span>سورة الملك</span>
    </div>
    <img src="mushaf_page_562.png" class="mushaf-img" />
    <div class="page-footer">
      <span>الحزب السابع والخمسون</span>
      <span>- 562 -</span>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_preview.html', htmlContent);

async function capture() {
  const port = 9250;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1000,1400', 'file:///C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_preview.html']);
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
    await new Promise(r => setTimeout(r, 1200));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_page_on_paper.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved mushaf_page_on_paper.png');
    ws.close();
  } finally {
    proc.kill();
  }
}
capture();
