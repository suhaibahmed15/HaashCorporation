const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const htmlFiles = [
  'index.html',
  'about.html',
  'services.html',
  'work.html',
  'insights.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html',
  'services/ai-chatbot.html',
  'services/website-development.html',
  'services/ui-ux-design.html',
  'services/ai-call-receptionist.html'
];

htmlFiles.forEach(relPath => {
  const filePath = path.join(projectDir, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add favicon in <head> if not already present
  if (!html.includes('favicon.svg')) {
    const isSub = relPath.startsWith('services/');
    const faviconHref = isSub ? '../favicon.svg' : 'favicon.svg';
    const faviconTag = `  <link rel="icon" type="image/svg+xml" href="${faviconHref}">\n`;
    html = html.replace(/<\/head>/i, `${faviconTag}</head>`);
  }

  // 2. Update WhatsApp link
  html = html.replace(/https:\/\/wa\.me\/15551234567/g, 'https://wa.me/923423951603');

  // 3. Update Facebook link
  html = html.replace(/https:\/\/www\.facebook\.com\/haashcorporation/g, 'https://www.facebook.com/HasshCorporation');

  // 4. Update Instagram link
  html = html.replace(/https:\/\/www\.instagram\.com\/haashcorporation/g, 'https://www.instagram.com/hasshcorporation');

  // 5. Update old SVG logo mark with HC monogram
  html = html.replace(/<div class="logo-mark" aria-hidden="true">[\s\S]*?<\/svg>[\s\S]*?<\/div>/g, '<div class="logo-mark" aria-hidden="true"><span class="hc-monogram">HC</span></div>');

  // 6. In contact.html: update email & phone display
  if (relPath === 'contact.html') {
    html = html.replace(/inquiries@haashcorp\.com/g, 'Suhaibahmed099@gmail.com');
    html = html.replace(/\+1 \(555\) 123-4567/g, '+92 342 3951603');
    html = html.replace(/placeholder="\+1 \(555\) 000-0000"/g, 'placeholder="+92 342 3951603"');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${relPath}`);
});

console.log('All HTML files updated with new branding, HC favicon, social links, and WhatsApp number!');
