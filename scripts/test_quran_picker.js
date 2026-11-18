const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testPicker() {
  console.log('Testing Quran Picker...');
  const port = 9235;
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=' + port,
    '--window-size=1440,1100',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await (await fetch('http://localhost:' + port + '/json')).json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    let id = 1;
    const calls = new Map();
    let caughtExceptions = [];

    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && calls.has(d.id)) { calls.get(d.id)(d); calls.delete(d.id); }
      if (d.method === 'Runtime.exceptionThrown') {
        caughtExceptions.push(d.params.exceptionDetails);
        console.error('❌ Exception:', d.params.exceptionDetails.text, d.params.exceptionDetails.exception?.description);
      }
    };
    function send(m, p={}) { return new Promise(r => { const i = id++; calls.set(i, r); ws.send(JSON.stringify({id:i, method:m, params:p})); }); }
    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    // 1. Switch to Hifz tab
    console.log('1. Switching to Hifz tab...');
    await send('Runtime.evaluate', { expression: `Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('التحفيظ')).click()` });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Click "اختيار سورة وآيات من المصحف الشريف ۞"
    console.log('2. Clicking Quran Picker button...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('اختيار سورة'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Take screenshot of Quran Picker dialog
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/quran_picker_dialog.png', Buffer.from(shot1.result.data, 'base64'));
    console.log('Saved quran_picker_dialog.png');

    // 3. Select Surah 18 (Al-Kahf) and Ayahs 1 to 5
    console.log('3. Selecting Surah 18 and Ayahs 1 to 5...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const selects = Array.from(document.querySelectorAll('select'));
          // Find surah select in the drawer
          const surahSelect = selects.find(s => s.options && Array.from(s.options).some(o => o.value === '18'));
          if (surahSelect) {
            surahSelect.value = '18';
            surahSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. Click "جلب الآيات بالرسم العثماني المعتمد"
    console.log('4. Clicking Fetch Sacred Ayahs button...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const fetchBtn = btns.find(b => b.textContent.includes('جلب الآيات بالرسم العثماني'));
          if (fetchBtn) fetchBtn.click();
        })()
      `
    });

    // Wait for network fetch and render
    await new Promise(r => setTimeout(r, 3000));

    // Scroll down slightly to view the recitation board
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 350)` });
    await new Promise(r => setTimeout(r, 600));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/quran_recitation_board.png', Buffer.from(shot2.result.data, 'base64'));
    console.log('Saved quran_recitation_board.png');

    console.log('Total exceptions:', caughtExceptions.length);
    ws.close();
  } catch(e) {
    console.error('Test error:', e);
  } finally {
    proc.kill();
  }
}

testPicker();
