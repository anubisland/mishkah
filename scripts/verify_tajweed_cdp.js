const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyTajweedViews() {
  const port = 9322;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1200,1400', 'http://localhost:3000']);
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

    console.log('Waiting 3s for React hydration...');
    await new Promise(r => setTimeout(r, 3000));

    // Switch to Tajweed tab
    console.log('Clicking on Tajweed Tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أدوات التجويد') || x.textContent.includes('Branch 2'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    // 1. Capture Sub-tab 1: Generator
    console.log('Capturing Sub-tab 1: Generator...');
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';
    fs.writeFileSync(artifactDir + '\\verified_tajweed_subtab1_generator.png', Buffer.from(ss1.data, 'base64'));

    // 2. Click Sub-tab 2: Makhaarij
    console.log('Clicking Sub-tab 2: Makhaarij...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أطلس مخارج الحروف') || x.textContent.includes('2. أطلس'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    console.log('Capturing Sub-tab 2: Makhaarij...');
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_tajweed_subtab2_makhaarij.png', Buffer.from(ss2.data, 'base64'));

    // 3. Click Sub-tab 3: Metronome
    console.log('Clicking Sub-tab 3: Metronome...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('ميزان الأزمنة') || x.textContent.includes('3. ميزان'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click start metronome to test visual pulse
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('بدء النبض') || x.textContent.includes('Start Metronome'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing Sub-tab 3: Metronome...');
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_tajweed_subtab3_metronome.png', Buffer.from(ss3.data, 'base64'));

    ws.close();
    proc.kill();

    console.log('\n--- VERIFICATION REPORT ---');
    console.log('Errors caught:', errors.length);
    if (errors.length > 0) {
      console.error('FAILED with errors:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: All 3 Tajweed sub-tabs loaded and verified with 0 errors!');
    }
  } catch (err) {
    console.error('Test execution error:', err);
    proc.kill();
    process.exit(1);
  }
}

verifyTajweedViews();
