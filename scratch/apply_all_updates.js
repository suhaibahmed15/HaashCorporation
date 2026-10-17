const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const rootHtmlFiles = [
  'index.html',
  'about.html',
  'services.html',
  'work.html',
  'insights.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html'
];

const subHtmlFiles = [
  'services/ai-chatbot.html',
  'services/website-development.html',
  'services/ui-ux-design.html',
  'services/ai-call-receptionist.html'
];

function updateFile(relPath, isSub = false) {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) {
    console.error(`Not found: ${filePath}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const imgPath = isSub ? '../assets/images/hassh-logo.jpg' : 'assets/images/hassh-logo.jpg';
  const favPath = isSub ? '../favicon.svg' : 'favicon.svg';

  // 1. Favicon check/injection
  if (!html.includes('favicon.svg')) {
    html = html.replace(/<\/head>/i, `  <link rel="icon" type="image/svg+xml" href="${favPath}">\n</head>`);
  }

  // 2. Logo Mark update to use official Hassh Corporation HC logo image
  // Replace existing logo marks (either SVG or span monogram) with image inside .logo-mark
  const logoMarkHtml = `<div class="logo-mark" aria-hidden="true"><img src="${imgPath}" alt="Hassh Corporation HC Logo" class="logo-mark-img"><span class="sr-only">HC</span></div>`;
  html = html.replace(/<div class="logo-mark" aria-hidden="true">[\s\S]*?<\/div>/g, logoMarkHtml);

  // 3. Unify Brand spelling to HASSH
  html = html.replace(/<span class="brand-name">HAASH<\/span>/g, '<span class="brand-name">HASSH</span>');
  html = html.replace(/<span class="brand-name">Haash<\/span>/gi, '<span class="brand-name">HASSH</span>');

  // 4. WhatsApp Links and Phone number updates
  html = html.replace(/https:\/\/wa\.me\/15551234567/g, 'https://wa.me/923423951603');
  html = html.replace(/wa\.me\/[0-9]+/g, 'wa.me/923423951603');
  html = html.replace(/\+1 \(555\) 123-4567/g, '+92 342 3951603');
  html = html.replace(/\+1 \(555\) 019-2831/g, '+92 342 3951603');
  html = html.replace(/\+1 \(555\) 019-8432/g, '+92 342 3951603');

  // 5. Facebook & Instagram updates
  html = html.replace(/https:\/\/www\.facebook\.com\/haashcorporation/g, 'https://www.facebook.com/HasshCorporation');
  html = html.replace(/https:\/\/www\.instagram\.com\/haashcorporation/g, 'https://www.instagram.com/hasshcorporation');

  // 6. Direct Contact Email updates
  html = html.replace(/inquiries@haashcorp\.com/g, 'Suhaibahmed099@gmail.com');
  html = html.replace(/mailto:inquiries@haashcorp\.com/g, 'mailto:Suhaibahmed099@gmail.com');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${relPath}`);
}

rootHtmlFiles.forEach(f => updateFile(f, false));
subHtmlFiles.forEach(f => updateFile(f, true));

// Update assets/js/main.js
const mainJsPath = path.join(rootDir, 'assets/js/main.js');
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');
  js = js.replace(/phoneNumber:\s*'\+1 \(555\) 019-8432'/g, "phoneNumber: '+92 342 3951603'");
  js = js.replace(/"fallback_destination":\s*"\+15551234567"/g, '"fallback_destination": "+923423951603"');
  js = js.replace(/showToast\('Network error\. Direct email: inquiries@haashcorp\.com'\);/g, "showToast('Network error. Direct email: Suhaibahmed099@gmail.com');");
  js = js.replace(/inquiries@haashcorp\.com/g, 'Suhaibahmed099@gmail.com');
  js = js.replace(/15551234567/g, '923423951603');
  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('Updated assets/js/main.js');
}

console.log('Completed file updates.');
