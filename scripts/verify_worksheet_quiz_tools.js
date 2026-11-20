const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyTools() {
  const port = 9388;
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=' + port,
    '--window-size=1280,900',
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

    const errors = [];
    ws.addEventListener('message', e => {
      const d = JSON.parse(e.data);
      if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') {
        errors.push(d.params.args.map(a => a.value || a.description || '').join(' '));
      }
      if (d.method === 'Runtime.exceptionThrown') {
        errors.push(d.params.exceptionDetails?.exception?.description || d.params.exceptionDetails?.text);
      }
    });

    await new Promise(r => setTimeout(r, 1500));

    const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';

    // 1. Click Worksheet Tab
    console.log('1. Navigating to Worksheets tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('أوراق العمل والطباعة') || x.textContent.includes('أوراق العمل'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_worksheet_preview.png...');
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_worksheet_preview.png`, Buffer.from(ss1.data, 'base64'));

    // 2. Click Worksheet Builder mode
    console.log('2. Switching Worksheet to Builder Mode...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('محرر وتخصيص البنود'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_worksheet_builder_islamic.png...');
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_worksheet_builder_islamic.png`, Buffer.from(ss2.data, 'base64'));

    // 3. Switch to Tajweed in Worksheet Builder
    console.log('3. Switching to Tajweed Worksheet Builder...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ورقة عمل أحكام التجويد'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_worksheet_builder_tajweed.png...');
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_worksheet_builder_tajweed.png`, Buffer.from(ss3.data, 'base64'));

    // 4. Click Quiz Tab
    console.log('4. Navigating to Quiz tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('الاختبار الذاتي التفاعلي') || x.textContent.includes('الاختبار الذاتي'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_quiz_student_mode.png...');
    const ss4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_quiz_student_mode.png`, Buffer.from(ss4.data, 'base64'));

    // 5. Click Teacher Question Bank Builder mode
    console.log('5. Switching Quiz to Teacher Question Bank Builder...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('محرر وبنك الأسئلة'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_quiz_builder_bank.png...');
    const ss5 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_quiz_builder_bank.png`, Buffer.from(ss5.data, 'base64'));

    console.log('\n=============================================');
    console.log('AUTHORING TOOLS VERIFICATION SUMMARY:');
    console.log('Total console/runtime errors:', errors.length);
    if (errors.length > 0) {
      console.error('Console errors:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: Worksheets and Quiz authoring tools verified with 0 errors!');
    }

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Verification failed:', err);
    proc.kill();
    process.exit(1);
  }
}

verifyTools();
