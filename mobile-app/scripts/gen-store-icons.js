const sharp = require('/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app/node_modules/sharp');
const path = require('path');

const ROOT = '/home/ali/Downloads/Websites/FINALINSPIRE APP/mobile-app';
const LOGO = path.join(ROOT, '..', 'public', 'logo.png');
const BRAND_BLUE = { r: 12, g: 31, b: 63, alpha: 1 }; // #0C1F3F, matches nav/footer dark

async function main() {
  // 1024x1024 flat App Store icon (no alpha, logo centered on brand-blue bg)
  const logoMeta = await sharp(LOGO).metadata();
  const targetLogoW = Math.round(1024 * 0.78);
  const scale = targetLogoW / logoMeta.width;
  const targetLogoH = Math.round(logoMeta.height * scale);

  const resizedLogo = await sharp(LOGO).resize(targetLogoW, targetLogoH).toBuffer();

  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: BRAND_BLUE }
  })
    .composite([{ input: resizedLogo, gravity: 'center' }])
    .flatten({ background: BRAND_BLUE })
    .png()
    .toFile(path.join(ROOT, 'store-assets', 'ios', 'app-icon-1024.png'));
  console.log('iOS 1024 icon done');

  // 512x512 Play Store icon
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: BRAND_BLUE }
  })
    .composite([{ input: await sharp(LOGO).resize(Math.round(512 * 0.78)).toBuffer(), gravity: 'center' }])
    .flatten({ background: BRAND_BLUE })
    .png()
    .toFile(path.join(ROOT, 'store-assets', 'android', 'app-icon-512.png'));
  console.log('Android 512 icon done');

  // 1024x500 Play Store feature graphic
  const featureLogoW = 380;
  const featureLogo = await sharp(LOGO).resize(featureLogoW).toBuffer();
  const featureLogoMeta = await sharp(featureLogo).metadata();

  const svgText = `
    <svg width="1024" height="500">
      <style>
        .title { fill: #ffffff; font-size: 44px; font-weight: 800; font-family: Arial, sans-serif; }
        .sub { fill: #7dd3fc; font-size: 22px; font-weight: 600; font-family: Arial, sans-serif; }
      </style>
      <text x="460" y="215" class="title">NSPIRE INSPECTION</text>
      <text x="460" y="270" class="title">(Public)</text>
      <text x="460" y="315" class="sub">Public &amp; Affordable Housing</text>
      <text x="460" y="345" class="sub">Across the U.S.A</text>
    </svg>
  `;

  await sharp({
    create: { width: 1024, height: 500, channels: 4, background: BRAND_BLUE }
  })
    .composite([
      { input: featureLogo, left: 40, top: Math.round((500 - featureLogoMeta.height) / 2) },
      { input: Buffer.from(svgText), left: 0, top: 0 },
    ])
    .flatten({ background: BRAND_BLUE })
    .png()
    .toFile(path.join(ROOT, 'store-assets', 'android', 'feature-graphic-1024x500.png'));
  console.log('Feature graphic done');
}

main().catch(e => { console.error(e); process.exit(1); });
