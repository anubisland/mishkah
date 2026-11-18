const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\melwa\\.gemini\\antigravity\\brain\\78c35e43-4acf-4dc4-bff1-631896129904';

const DEVICES = [
  { name: 'desktop', width: 1440, height: 900, label: 'Desktop (1440x900)' },
  { name: 'tablet', width: 768, height: 1024, label: 'iPad / Tablet (768x1024)' },
  { name: 'mobile', width: 390, height: 844, label: 'Mobile (390x844)' }
];

async function runHifzTest() {
  console.log('🚀 Running Hifz Module Multi-Device Emulation Test...');
  const port = 9228;

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

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingCalls.has(data.id)) {
        pendingCalls.get(data.id)(data);
        pendingCalls.delete(data.id);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('❌ Exception Detected:', JSON.stringify(data.params.exceptionDetails, null, 2));
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
    await sendCommand('Page.enable');

    console.log('✅ Connected to Chrome DevTools Protocol');

    // 1. Click on Hifz Tab
    await new Promise(r => setTimeout(r, 1000));
    const clickTabRes = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('header button'));
          const hifzBtn = btns.find(b => b.textContent.includes('أدوات التحفيظ') || b.textContent.includes('Memorization'));
          if (hifzBtn) {
            hifzBtn.click();
            return 'Hifz tab clicked';
          }
          return 'Hifz tab not found';
        })()
      `,
      returnByValue: true
    });
    console.log('   - Navigation to Hifz Tab:', clickTabRes.result?.value);

    // 2. Click "طمس أواخر الآيات" (Mask Endings)
    await new Promise(r => setTimeout(r, 800));
    const maskRes = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const maskBtn = btns.find(b => b.textContent.includes('طمس أواخر الآيات'));
          if (maskBtn) {
            maskBtn.click();
            return 'Mask Endings Clicked';
          }
          return 'Mask button not found';
        })()
      `,
      returnByValue: true
    });
    console.log('   - Mask Endings Test:', maskRes.result?.value);

    // 3. Increment repetition counter
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const plusBtn = btns.find(b => b.textContent.trim() === '+1');
          if (plusBtn) plusBtn.click();
        })()
      `
    });

    // Run across devices and take screenshots
    for (const dev of DEVICES) {
      console.log(`\n📱 Emulating ${dev.label}...`);
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width: dev.width,
        height: dev.height,
        deviceScaleFactor: 2,
        mobile: dev.name === 'mobile'
      });

      await new Promise(r => setTimeout(r, 800));

      const shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
      if (shot.result?.data) {
        const buf = Buffer.from(shot.result.data, 'base64');
        const outPath = path.join(artifactDir, `hifz_${dev.name}.png`);
        fs.writeFileSync(outPath, buf);
        console.log(`   - Screenshot Saved: hifz_${dev.name}.png ✅`);
      }
    }

    console.log('\n🎉 Hifz Module Multi-Device Emulation Test Completed Successfully!');
    ws.close();
  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    proc.kill();
  }
}

runHifzTest();
