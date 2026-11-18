const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testMutashabihat() {
  console.log('Testing Mutashabihat Tool...');
  const port = 9245;
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=' + port,
    '--window-size=1440,1200',
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

    // 2. Scroll to Mutashabihat section
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 900)` });
    await new Promise(r => setTimeout(r, 600));

    // 3. Click "إضافة أو ربط متشابهة جديدة لهذا المقطع"
    console.log('3. Clicking Add Mutashabiha button...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent.includes('إضافة أو ربط متشابهة'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture screenshot of Mutashabihat Workbench
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mutashabihat_workbench.png', Buffer.from(shot1.result.data, 'base64'));
    console.log('Saved mutashabihat_workbench.png');

    // 4. Type search query "عزيز غفور" and search
    console.log('4. Searching for matching ayah in Quran...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const input = document.querySelector('input[placeholder*="عزيز غفور"]');
          if (input) {
            input.value = 'عزيز غفور';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const searchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('بحث'));
          if (searchBtn) searchBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // 5. Click the search result to select it
    console.log('5. Clicking matched search result...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const resultBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('سورة') && b.textContent.includes('آية'));
          if (resultBtns.length > 0) {
            resultBtns[0].click();
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    // 6. Enter Teacher guidance tip and save
    console.log('6. Adding guidance and clicking Save...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const guideInput = document.querySelector('input[placeholder*="فاطر"]');
          if (guideInput) {
            guideInput.value = 'في سورة فاطر بغير تعريف (عَزِيزٌ غَفُورٌ)، وفي الملك معرّفة (ٱلْعَزِيزُ ٱلْغَفُورُ)';
            guideInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('حفظ المتشابهة'));
          if (saveBtn) saveBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    // Capture screenshot of the resulting list
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/mutashabihat_saved_list.png', Buffer.from(shot2.result.data, 'base64'));
    console.log('Saved mutashabihat_saved_list.png');

    console.log('Total exceptions:', caughtExceptions.length);
    ws.close();
  } catch(e) {
    console.error('Test error:', e);
  } finally {
    proc.kill();
  }
}

testMutashabihat();
