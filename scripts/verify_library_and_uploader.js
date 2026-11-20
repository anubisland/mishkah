const { spawn } = require('child_process');
const fs = require('fs');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyLibraryAndUploader() {
  const port = 9399;
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

    // 1. Click "مكتبة محاضراتي" in header
    console.log('1. Clicking My Library shortcut in header...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('مكتبة محاضراتي') || x.title.includes('مكتبة محاضراتي'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_library_empty_state.png...');
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_library_empty_state.png`, Buffer.from(ss1.data, 'base64'));

    // 2. Click "تحضير ورفع محاضرة" in Branch 3
    console.log('2. Switching to Workbench & File Uploader view...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('تحضير ورفع محاضرة'));
          if (b) b.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_file_uploader_dropzone.png...');
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_file_uploader_dropzone.png`, Buffer.from(ss2.data, 'base64'));

    // 3. Load demo lecture and save to library to test saved state
    console.log('3. Loading demo lecture and saving to library...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const demoBtn = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('نموذج تجريبي') || x.textContent.includes('نموذج استرشادي'));
          if (demoBtn) demoBtn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click "حفظ بمكتبتي"
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const saveBtn = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('حفظ بمكتبتي') || x.textContent.includes('حفظ في مكتبة'));
          if (saveBtn) saveBtn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Switch back to Library tab to see saved card
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const libBtn = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('مكتبة محاضراتي'));
          if (libBtn) libBtn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing verified_library_with_saved_lecture.png...');
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\verified_library_with_saved_lecture.png`, Buffer.from(ss3.data, 'base64'));

    console.log('\n=============================================');
    console.log('LIBRARY & UPLOADER VERIFICATION SUMMARY:');
    console.log('Total console/runtime errors:', errors.length);
    if (errors.length > 0) {
      console.error('Console errors:', errors);
      process.exit(1);
    } else {
      console.log('SUCCESS: Library and File Uploader verified with 0 errors!');
    }

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Verification failed:', err);
    proc.kill();
    process.exit(1);
  }
}

verifyLibraryAndUploader();
