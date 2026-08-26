const puppeteer = require('/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/node_modules/puppeteer-core');

const OUT = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/store-assets/screenshots-raw';
const EMAIL = 'qa-store-screenshots-ipad@example.com';
const PASSWORD = 'TempPass1234!';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1366 });

  await page.goto('https://nspireinspectionapp.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 15000 });
  const emailSel = await page.$('input[type="email"]') ? 'input[type="email"]' : 'input[name="email"]';
  await page.type(emailSel, EMAIL, { delay: 20 });
  const pwSel = await page.$('input[type="password"]') ? 'input[type="password"]' : 'input[name="password"]';
  await page.type(pwSel, PASSWORD, { delay: 20 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: `${OUT}/ipad-03-dashboard.png` });
  console.log('ipad dashboard done');

  try {
    const addBtn = await page.waitForSelector('xpath/.//button[contains(., "Add New Property")]', { timeout: 8000 });
    await addBtn.click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: `${OUT}/ipad-04-add-property.png` });
    console.log('ipad add-property done');
  } catch (e) {
    console.log('skip add-property:', e.message);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
