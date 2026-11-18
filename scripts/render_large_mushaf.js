const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Amiri:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: #f3f8f5;
      font-family: 'Cairo', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mushaf-card {
      background-color: #ffffff;
      border: 3px solid #064e3b;
      outline: 2px solid #d97706;
      border-radius: 20px;
      padding: 20px 30px;
      box-shadow: 0 20px 45px rgba(6, 78, 59, 0.12);
      max-width: 900px;
      width: 100%;
      box-sizing: border-box;
    }
    .mushaf-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #d97706;
      padding-bottom: 12px;
      margin-bottom: 16px;
      font-weight: 800;
      font-size: 18px;
      color: #064e3b;
    }
    .mushaf-page-img {
      width: 100%;
      height: auto;
      display: block;
      background-color: #ffffff;
      filter: contrast(1.12);
    }
    .mushaf-bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid #d97706;
      padding-top: 12px;
      margin-top: 16px;
      font-weight: 800;
      font-size: 16px;
      color: #064e3b;
    }
  </style>
</head>
<body>
  <div class="mushaf-card">
    <div class="mushaf-top-bar">
      <span>الجزء التاسع والعشرون</span>
      <span>سورة الملك</span>
    </div>
    <img src="mushaf_page_562.png" class="mushaf-page-img" />
    <div class="mushaf-bottom-bar">
      <span>الحزب السابع والخمسون</span>
      <span style="font-size: 20px; color: #d97706;">- 562 -</span>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_full_page.html', htmlContent);

async function capture() {
  const port = 9255;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1200,1600', 'file:///C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_full_page.html']);
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
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mushaf_full_large_page.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved mushaf_full_large_page.png');
    ws.close();
  } finally {
    proc.kill();
  }
}
capture();
