const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('Browser error:', msg.text());
  });

  const filePath = 'file:///' + path.resolve(__dirname, '..', 'public', 'index.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });

  await new Promise(r => setTimeout(r, 1500));

  // Switch to Hifz branch if not already
  // Click on "عرض وجه المصحف الورقي"
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('عرض وجه المصحف الورقي')) {
      console.log('Clicking "عرض وجه المصحف الورقي"...');
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  // Find and click the Tap-to-Mask lines button
  const buttonsAfter = await page.$$('button');
  for (const btn of buttonsAfter) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('حجب وتسميع الأسطر تفاعلياً')) {
      console.log('Clicking "حجب وتسميع الأسطر تفاعلياً"...');
      await btn.click();
      await new Promise(r => setTimeout(r, 1500));
      break;
    }
  }

  const screenshotPath = path.resolve('C:/Users/melwa/.gemini/antigravity/brain/78c35e43-4acf-4dc4-bff1-631896129904/verified_solid_line_masking.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
})();
