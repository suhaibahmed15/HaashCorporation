const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const rootDir = path.resolve(__dirname, '..');
const srcPath = path.join(rootDir, 'assets/images/hc-logo-dark.png');
const srcBuffer = fs.readFileSync(srcPath);
const srcPng = PNG.sync.read(srcBuffer);

console.log('Source image loaded:', srcPng.width, 'x', srcPng.height);

// Monogram bounds: { minX: 131, maxX: 385, minY: 86, maxY: 304, width: 255, height: 219 }
// Let's create a square crop centered on the monogram (centerX = 258, centerY = 195)
// Let the crop size be 300x300, which gives ~22px padding around 255x219 monogram
const cropSize = 300;
const cropX = Math.round(258 - cropSize / 2); // 258 - 150 = 108
const cropY = Math.round(195 - cropSize / 2); // 195 - 150 = 45

function cropAndResize(targetSize, transparentBg = false, lightMode = false) {
  const outPng = new PNG({ width: targetSize, height: targetSize });

  for (let ty = 0; ty < targetSize; ty++) {
    for (let tx = 0; tx < targetSize; tx++) {
      // Map target (tx, ty) to source (sx, sy) within crop box
      const sx = Math.min(srcPng.width - 1, Math.max(0, Math.round(cropX + (tx / targetSize) * cropSize)));
      const sy = Math.min(srcPng.height - 1, Math.max(0, Math.round(cropY + (ty / targetSize) * cropSize)));

      const srcIdx = (srcPng.width * sy + sx) << 2;
      const targetIdx = (targetSize * ty + tx) << 2;

      let r = srcPng.data[srcIdx];
      let g = srcPng.data[srcIdx + 1];
      let b = srcPng.data[srcIdx + 2];
      let a = srcPng.data[srcIdx + 3];

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (transparentBg) {
        if (brightness < 25) {
          // background is transparent
          outPng.data[targetIdx] = 0;
          outPng.data[targetIdx + 1] = 0;
          outPng.data[targetIdx + 2] = 0;
          outPng.data[targetIdx + 3] = 0;
          continue;
        } else {
          // Antialiased edge fade
          const alphaFade = Math.min(255, Math.max(0, (brightness - 25) * (255 / 100)));
          a = Math.round((a * alphaFade) / 255);
        }
      }

      if (lightMode) {
        // Invert to black letters on white background or cream on white
        if (transparentBg) {
          // Black letters with smooth alpha
          r = 10;
          g = 10;
          b = 14;
        } else {
          // Light background #FBFBFB with dark letters
          const factor = brightness / 255;
          r = Math.round(250 - factor * 238);
          g = Math.round(250 - factor * 238);
          b = Math.round(252 - factor * 238);
        }
      }

      outPng.data[targetIdx] = r;
      outPng.data[targetIdx + 1] = g;
      outPng.data[targetIdx + 2] = b;
      outPng.data[targetIdx + 3] = a;
    }
  }

  return PNG.sync.write(outPng);
}

// 1. Generate favicon 256x256 (dark background as requested by user)
const fav256 = cropAndResize(256, false, false);
fs.writeFileSync(path.join(rootDir, 'favicon.png'), fav256);
fs.writeFileSync(path.join(rootDir, 'assets/images/favicon.png'), fav256);
console.log('Generated favicon.png (256x256)');

// 2. Generate favicon 32x32
const fav32 = cropAndResize(32, false, false);
fs.writeFileSync(path.join(rootDir, 'favicon-32x32.png'), fav32);
console.log('Generated favicon-32x32.png (32x32)');

// 3. Generate apple-touch-icon 180x180
const touchIcon = cropAndResize(180, false, false);
fs.writeFileSync(path.join(rootDir, 'apple-touch-icon.png'), touchIcon);
console.log('Generated apple-touch-icon.png (180x180)');

// 4. Generate transparent dark monogram
const transDark = cropAndResize(300, true, false);
fs.writeFileSync(path.join(rootDir, 'assets/images/hc-monogram-trans-dark.png'), transDark);
console.log('Generated hc-monogram-trans-dark.png');

// 5. Generate transparent light monogram (for light theme)
const transLight = cropAndResize(300, true, true);
fs.writeFileSync(path.join(rootDir, 'assets/images/hc-monogram-trans-light.png'), transLight);
console.log('Generated hc-monogram-trans-light.png');

// 6. Generate SVG favicon embedding this exact logo with light/dark adaptive switching!
const base64Dark = fav256.toString('base64');
const base64Light = cropAndResize(256, false, true).toString('base64');

const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <style>
      .fav-dark { display: block; }
      .fav-light { display: none; }
      @media (prefers-color-scheme: light) {
        .fav-dark { display: none; }
        .fav-light { display: block; }
      }
    </style>
  </defs>
  <!-- Dark theme favicon (matches uploaded image exactly) -->
  <image href="data:image/png;base64,${base64Dark}" width="256" height="256" class="fav-dark" />
  <!-- Light theme favicon -->
  <image href="data:image/png;base64,${base64Light}" width="256" height="256" class="fav-light" />
</svg>
`;

fs.writeFileSync(path.join(rootDir, 'favicon.svg'), svgFavicon, 'utf8');
fs.writeFileSync(path.join(rootDir, 'assets/images/favicon.svg'), svgFavicon, 'utf8');
console.log('Generated adaptive favicon.svg embedding exact logo');

