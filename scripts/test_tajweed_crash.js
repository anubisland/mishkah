const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTajweed() {
  console.log('Testing Tajweed interactions for crashes...');
  const port = 9229;
  const proc = spawn(chromePath, [
    '--headless',
    `--remote-debugging-port=${port}`,
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://localhost:${port}/json`);
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) throw new Error('No WebSocket URL available');

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const pendingCalls = new Map();
    let caughtExceptions = [];

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingCalls.has(data.id)) {
        pendingCalls.get(data.id)(data);
        pendingCalls.delete(data.id);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        caughtExceptions.push(data.params.exceptionDetails);
        console.error('❌ EXCEPTION CAUGHT:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        pendingCalls.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);
    await sendCommand('Runtime.enable');

    // 1. Click Tajweed Tab
    await new Promise(r => setTimeout(r, 800));
    console.log('1. Clicking Tajweed tab...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('header button'));
          const tajweedBtn = btns.find(b => b.textContent.includes('التجويد') || b.textContent.includes('Tajweed'));
          if (tajweedBtn) tajweedBtn.click();
        })()
      `
    });

    // 2. Select different rule from dropdown
    await new Promise(r => setTimeout(r, 800));
    console.log('2. Changing Tajweed rule select...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const select = document.querySelector('select[value]');
          const selects = Array.from(document.querySelectorAll('select'));
          // Find rule select
          const ruleSelect = selects.find(s => s.options && Array.from(s.options).some(o => o.value === 'idgham_ghunnah'));
          if (ruleSelect) {
            ruleSelect.value = 'idgham_ghunnah';
            ruleSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `
    });

    // 3. Click "توليد خطة الدرس وبطاقات زوم" (Generate Tajweed Lesson)
    await new Promise(r => setTimeout(r, 800));
    console.log('3. Clicking Generate Tajweed Lesson button...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const genBtn = btns.find(b => b.textContent.includes('توليد خطة الدرس') || b.textContent.includes('Generate Lesson'));
          if (genBtn) genBtn.click();
        })()
      `
    });

    // Wait for generate to finish or fallback
    await new Promise(r => setTimeout(r, 2000));

    // 4. Click Fullscreen Zoom mode button
    console.log('4. Clicking Fullscreen Zoom mode button...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const zoomBtn = btns.find(b => b.textContent.includes('وضع عرض زوم') || b.textContent.includes('Zoom'));
          if (zoomBtn) zoomBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 800));

    // 5. Navigate slides inside Fullscreen Zoom
    console.log('5. Navigating slides next/previous...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const nextBtn = btns.find(b => b.textContent.includes('التالي') || b.textContent.includes('Next'));
          if (nextBtn) nextBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // Check if root has children
    const checkMounted = await sendCommand('Runtime.evaluate', {
      expression: `document.getElementById('root').children.length > 0`,
      returnByValue: true
    });

    console.log('React is mounted at end:', checkMounted.result?.value);
    console.log('Total exceptions caught:', caughtExceptions.length);

    ws.close();
  } catch(e) {
    console.error('Test error:', e);
  } finally {
    proc.kill();
  }
}

testTajweed();
