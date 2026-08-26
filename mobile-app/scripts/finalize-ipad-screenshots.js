const sharp = require('/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const RAW = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/store-assets/screenshots-raw';
const IOS_OUT = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/store-assets/ios/screenshots-12.9in-ipad';

const SELECTED = [
  { file: 'ipad-01-home.png', name: '01-home' },
  { file: 'ipad-02-login.png', name: '02-login' },
  { file: 'ipad-03-dashboard.png', name: '03-dashboard' },
  { file: 'ipad-04-add-property.png', name: '04-add-property' },
];

async function main() {
  fs.mkdirSync(IOS_OUT, { recursive: true });
  for (const { file, name } of SELECTED) {
    const src = path.join(RAW, file);
    if (!fs.existsSync(src)) { console.log('missing', file); continue; }
    // Apple 12.9" iPad Pro requirement: 2048x2732 (raw is 1024x1366, exactly 2x)
    await sharp(src).resize(2048, 2732).png().toFile(path.join(IOS_OUT, `${name}.png`));
    console.log('done', name);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
