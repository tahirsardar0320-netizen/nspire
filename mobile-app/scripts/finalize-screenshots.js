const sharp = require('/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const RAW = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/store-assets/screenshots-raw';
const IOS_OUT = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/store-assets/ios/screenshots-6.7in';
const ANDROID_OUT = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/store-assets/android/screenshots-phone';

const SELECTED = [
  { file: '01-home.png', name: '01-home' },
  { file: '02-login.png', name: '02-login' },
  { file: '04-dashboard.png', name: '03-dashboard' },
  { file: '05-add-property.png', name: '04-add-property' },
];

async function main() {
  fs.mkdirSync(IOS_OUT, { recursive: true });
  fs.mkdirSync(ANDROID_OUT, { recursive: true });

  for (const { file, name } of SELECTED) {
    const src = path.join(RAW, file);
    // Exact Apple 6.7" requirement: 1290x2796 (raw is 430x932, exactly 3x)
    await sharp(src).resize(1290, 2796).png().toFile(path.join(IOS_OUT, `${name}.png`));
    // Play Store phone screenshot -- same asset works, well within their size limits
    await sharp(src).resize(1080, 2340).png().toFile(path.join(ANDROID_OUT, `${name}.png`));
    console.log('done', name);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
