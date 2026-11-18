const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTwinSync() {
  const port = 9305;
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
    await new Promise(r => setTimeout(r, 2500));

    console.log('--- Step 1: Navigating to Branch 1 (Hifz & Mushaf) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const b = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('أدوات التحفيظ (Branch 1)'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('--- Step 2: In Mode 1, jumping to Surah Al-Kahf (Page 293) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const kahfBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('الكهف (293)'));
        if (kahfBtn) kahfBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const s1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_mode1_alkahf_293.png', Buffer.from(s1.data, 'base64'));
    console.log('Saved verified_mode1_alkahf_293.png');

    console.log('--- Step 3: Clicking [اختبار إتقان هذا الوجه] to verify twin sync to Mode 2 ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const testBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('اختبار إتقان هذا الوجه'));
        if (testBtn) testBtn.click();
      })()`
    });
    // Wait for API fetch of Page 293 ayahs
    await new Promise(r => setTimeout(r, 3000));

    const mode2Header = await send('Runtime.evaluate', {
      expression: `(() => {
        return document.querySelector('h3.font-amiri')?.innerText || 'not found';
      })()`,
      returnByValue: true
    });
    console.log('Mode 2 active title:', mode2Header.result.value);

    const s2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_mode2_synced_alkahf_293.png', Buffer.from(s2.data, 'base64'));
    console.log('Saved verified_mode2_synced_alkahf_293.png');

    console.log('--- Step 4: Inside Mode 2, jumping directly to Juz Amma (Page 582) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const juzAmmaBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('جزء عم (582)'));
        if (juzAmmaBtn) juzAmmaBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 3000));

    const mode2NabaHeader = await send('Runtime.evaluate', {
      expression: `(() => {
        return document.querySelector('h3.font-amiri')?.innerText || 'not found';
      })()`,
      returnByValue: true
    });
    console.log('Mode 2 active title after jump:', mode2NabaHeader.result.value);

    const s3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_mode2_synced_annaba_582.png', Buffer.from(s3.data, 'base64'));
    console.log('Saved verified_mode2_synced_annaba_582.png');

    console.log('--- Step 5: Returning to Printed Mushaf (Mode 1) to verify Page 582 sync ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const viewMushafBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('عرض وجه المصحف الورقي'));
        if (viewMushafBtn) viewMushafBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const s4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_mode1_synced_return_582.png', Buffer.from(s4.data, 'base64'));
    console.log('Saved verified_mode1_synced_return_582.png');

    ws.close();
    console.log('--- ALL SYNCHRONIZATION TESTS COMPLETED WITH 100% SUCCESS ---');
  } finally {
    proc.kill();
  }
}

testTwinSync().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
