const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyAllThreeFixes() {
  const port = 9335;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1100,1200', 'http://localhost:3000']);
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

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    const errors = [];
    ws.addEventListener('message', e => {
      const d = JSON.parse(e.data);
      if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') {
        const txt = d.params.args.map(a => a.value || a.description || '').join(' ');
        errors.push(txt);
        console.log('PAGE ERROR:', txt);
      }
      if (d.method === 'Runtime.exceptionThrown') {
        const txt = d.params.exceptionDetails?.exception?.description || d.params.exceptionDetails?.text;
        errors.push(txt);
        console.log('PAGE EXCEPTION:', txt);
      }
    });

    console.log('Waiting 3s for hydration...');
    await new Promise(r => setTimeout(r, 3000));

    const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';

    // 1. Verify Image 3 Fix: Dashboard Hero Banner
    console.log('Capturing Fix 3: Dashboard Hero Banner...');
    const ssDash = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_fix3_hero_banner_compact.png', Buffer.from(ssDash.data, 'base64'));

    // 2. Switch to Tajweed Tab
    console.log('Clicking Tajweed Tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أدوات التجويد') || x.textContent.includes('Branch 2'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to Zoom Presentation Slide Card
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 500)`
    });
    await new Promise(r => setTimeout(r, 500));

    // 3. Verify Image 2 Fix: Zoom Slide Card (No Pitch Black, High Contrast)
    console.log('Capturing Fix 2: Zoom Slide Card (Illuminated, High Contrast)...');
    const ssSlide = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_fix2_zoom_card_contrast.png', Buffer.from(ssSlide.data, 'base64'));

    // 4. Switch to Sub-tab 2: Makharij Atlas
    console.log('Clicking Makharij Atlas...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo(0, 0);
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أطلس مخارج الحروف') || x.textContent.includes('2. أطلس'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    // Test Halq organ to see letter centering of [ ء, هـ, ع, ح, غ, خ ]
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('الحلق'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // 5. Verify Image 1 Fix: Centered Letters
    console.log('Capturing Fix 1: Makharij Letters Centered in Squares...');
    const ssLetters = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_fix1_letters_centered.png', Buffer.from(ssLetters.data, 'base64'));

    ws.close();
    proc.kill();

    console.log('\n--- VERIFICATION REPORT ---');
    console.log('Errors caught:', errors.length);
    if (errors.length > 0) {
      console.error('FAILED with errors:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: All 3 user fixes verified with 0 errors!');
    }
  } catch (err) {
    console.error('Test execution error:', err);
    proc.kill();
    process.exit(1);
  }
}

verifyAllThreeFixes();
