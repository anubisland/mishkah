const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyMobileExperience() {
  const port = 9370;
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=' + port,
    '--window-size=412,915',
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

    // Emulate Mobile Device (Samsung Galaxy S20 / Pixel)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 915,
      deviceScaleFactor: 2,
      mobile: true
    });

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

    // 1. Capture Mobile Dashboard
    console.log('Capturing verified_mobile_dashboard.png...');
    const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_mobile_dashboard.png', Buffer.from(ss1.data, 'base64'));

    // 2. Click Islamic Studies Tab (Branch 3)
    console.log('Clicking Islamic Studies tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('العلوم الشرعية'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2000));

    // Capture Clean Slate Islamic Studies Workbench
    console.log('Capturing verified_mobile_islamic_clean.png...');
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_mobile_islamic_clean.png', Buffer.from(ss2.data, 'base64'));

    // 3. Test Pasting Lecture and Transforming
    console.log('Testing custom lecture transformation...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.value = 'أهمية الصدق في المعاملات اليومية\\nقال الله تعالى: يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ\\nقال رسول الله ﷺ: عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ\\nالصدق منجاة وبركة في الرزق والعلاقات الأسرية\\nتطبيق عملي: اجتناب الكذب في المزاح والبيع';
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const transformBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('تحويل وتنسيق المحاضرة'));
        if (transformBtn) transformBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Capturing verified_mobile_islamic_transformed.png...');
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\verified_mobile_islamic_transformed.png', Buffer.from(ss3.data, 'base64'));

    ws.close();
    proc.kill();

    console.log('\n=============================================');
    console.log('MOBILE VERIFICATION SUMMARY:');
    console.log('Total console/runtime errors:', errors.length);
    if (errors.length > 0) {
      console.error('Errors encountered:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: Mobile views and Islamic workbench verified with 0 errors!');
    }
  } catch (err) {
    console.error('Test execution error:', err);
    proc.kill();
    process.exit(1);
  }
}

verifyMobileExperience();
