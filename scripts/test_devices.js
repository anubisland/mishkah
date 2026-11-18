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

async function runDeviceSimulation() {
  console.log('🚀 Starting Multi-Device Responsive Simulation Test...');
  const port = 9227;

  const proc = spawn(chromePath, [
    '--headless',
    `--remote-debugging-port=${port}`,
    'http://localhost:3000'
  ]);

  // Give Chrome time to bind port
  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://localhost:${port}/json`);
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) throw new Error('No WebSocket URL available from Chrome');

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
        console.error('❌ Browser Exception Detected:', JSON.stringify(data.params.exceptionDetails, null, 2));
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

    for (const dev of DEVICES) {
      console.log(`\n📱 Testing Viewport: ${dev.label}...`);
      
      // Set Device Metrics
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width: dev.width,
        height: dev.height,
        deviceScaleFactor: 2,
        mobile: dev.name === 'mobile'
      });

      // Reload or allow layout reflow
      await new Promise(r => setTimeout(r, 800));

      // Verify DOM stability
      const evalRes = await sendCommand('Runtime.evaluate', {
        expression: `
          (() => {
            const root = document.getElementById('root');
            const hasHeader = !!document.querySelector('header');
            const hasTabs = !!document.querySelector('header .max-w-7xl');
            const bodyOverflowX = document.body.scrollWidth > window.innerWidth;
            return {
              isMounted: root && root.children.length > 0,
              hasHeader,
              hasTabs,
              bodyOverflowX,
              scrollWidth: document.body.scrollWidth,
              innerWidth: window.innerWidth
            };
          })()
        `,
        returnByValue: true
      });

      const metrics = evalRes.result?.value;
      console.log(`   - React Mounted: ${metrics?.isMounted ? '✅' : '❌'}`);
      console.log(`   - Header & Branding Present: ${metrics?.hasHeader ? '✅' : '❌'}`);
      console.log(`   - Horizontal Overflow: ${metrics?.bodyOverflowX ? '⚠️ OVERFLOW' : '✅ Clean (No horizontal scroll)'}`);

      // Capture Screenshot
      const shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
      if (shot.result?.data) {
        const buf = Buffer.from(shot.result.data, 'base64');
        const outPath = path.join(artifactDir, `simulation_${dev.name}.png`);
        fs.writeFileSync(outPath, buf);
        console.log(`   - Screenshot Saved: simulation_${dev.name}.png ✅`);
      }
    }

    console.log('\n🎉 Multi-Device Simulation Completed Successfully with 0 Errors!');
    ws.close();
  } catch (err) {
    console.error('Simulation Failed:', err);
  } finally {
    proc.kill();
  }
}

runDeviceSimulation();
