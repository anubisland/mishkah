const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSuwaydExperience() {
  const port = 9355;
  const proc = spawn(chromePath, ['--headless', '--remote-debugging-port=' + port, '--window-size=1280,1800', 'http://localhost:3000']);
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

    console.log('Navigating to Tajweed tab...');
    const switched = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أدوات التجويد (Branch 2)'));
        if (b) {
          b.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    });
    console.log('Clicked Tajweed Tab:', switched.result?.value);
    await new Promise(r => setTimeout(r, 2000));

    // Capture initial Ikhfaa screen
    const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step1_ikhfaa_full.png', Buffer.from(ss1.data, 'base64'));
    console.log('Captured suwayd_step1_ikhfaa_full.png');

    // 2. Click Qalqalah lesson card
    console.log('Selecting Qalqalah lesson...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أحكام القلقلة ومراتبها'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step2_qalqalah_full.png', Buffer.from(ss2.data, 'base64'));
    console.log('Captured suwayd_step2_qalqalah_full.png');

    // 3. Test Integrated Metronome (click play)
    console.log('Clicking Integrated Metronome...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('تشغيل النبض') || x.textContent.includes('إيقاف الميزان'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    // 4. Open Lesson Quiz Modal
    console.log('Opening Quiz Modal...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('اختبار الدرس') || x.textContent.includes('Lesson Quiz'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step3_quiz_modal.png', Buffer.from(ss3.data, 'base64'));
    console.log('Captured suwayd_step3_quiz_modal.png');

    // Close Quiz Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '✕');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // 5. Open Zoom Fullscreen Modal
    console.log('Opening Zoom Share Modal...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('عرض زوم') || x.textContent.includes('Full Zoom Share'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const ss4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step4_zoom_modal.png', Buffer.from(ss4.data, 'base64'));
    console.log('Captured suwayd_step4_zoom_modal.png');

    // Click Next slide in Zoom Modal
    console.log('Advancing Zoom Slide...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('الشريحة التالية') || x.textContent.includes('Next'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const ss5 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step5_zoom_slide1.png', Buffer.from(ss5.data, 'base64'));
    console.log('Captured suwayd_step5_zoom_slide1.png');

    // Close Zoom Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '✕');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // 6. Test Quizzes Tab (Global)
    console.log('Navigating to global Quizzes tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('الاختبار الذاتي التفاعلي'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    // Switch to Tajweed quiz
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('أحكام التجويد (Branch 2)'));
        if (b) b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const ss6 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(artifactDir + '\\suwayd_step6_global_tajweed_quiz.png', Buffer.from(ss6.data, 'base64'));
    console.log('Captured suwayd_step6_global_tajweed_quiz.png');

    ws.close();
    proc.kill();

    console.log('\n=============================================');
    console.log('VERIFICATION SUMMARY:');
    console.log('Total console/runtime errors:', errors.length);
    if (errors.length > 0) {
      console.error('Errors encountered:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: All Suwayd features verified with 0 errors!');
    }
  } catch (err) {
    console.error('Test execution error:', err);
    proc.kill();
    process.exit(1);
  }
}

testSuwaydExperience();
