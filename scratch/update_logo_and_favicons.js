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

function updateHtmlFile(relPath, isSub = false) {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  const p = isSub ? '../' : '';

  // 1. Comprehensive Favicon Links in <head>
  const faviconBlock = `  <link rel="icon" type="image/svg+xml" href="${p}favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="${p}favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="256x256" href="${p}favicon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${p}apple-touch-icon.png">`;

  // Remove any previous favicon links
  html = html.replace(/\s*<link rel="icon"[^>]*>/gi, '');
  html = html.replace(/\s*<link rel="apple-touch-icon"[^>]*>/gi, '');

  // Add the new favicon block before </head>
  html = html.replace(/<\/head>/i, `${faviconBlock}\n</head>`);

  // 2. Logo Mark Image
  const logoMarkHtml = `<div class="logo-mark" aria-hidden="true"><img src="${p}assets/images/favicon.png" alt="Hassh Corporation HC Logo" class="logo-mark-img"><span class="sr-only">HC</span></div>`;

  // Replace all occurrences of .logo-mark
  html = html.replace(/<div class="logo-mark" aria-hidden="true">[\s\S]*?<\/div>/g, logoMarkHtml);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${relPath} with new HC logo and multi-size favicons.`);
}

rootHtmlFiles.forEach(f => updateHtmlFile(f, false));
subHtmlFiles.forEach(f => updateHtmlFile(f, true));

console.log('All HTML files updated.');
