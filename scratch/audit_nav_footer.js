const fs = require('fs');
const files = [
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

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasHeader = content.includes('class="site-header"');
  const hasFooter = content.includes('class="site-footer"');
  const hasMobileDrawer = content.includes('class="mobile-drawer"');
  const hasCmdK = content.includes('cmd-k-trigger');
  const hasSound = content.includes('sound-toggle-btn');
  const hasTheme = content.includes('theme-toggle-btn');
  const hasLetsTalk = content.includes("Let's Talk");
  const logoMarkMatch = content.match(/<div class="logo-mark"[^>]*>([\s\S]*?)<\/div>/);
  const logoMarkSrc = logoMarkMatch ? (logoMarkMatch[1].match(/src="([^"]+)"/) || [])[1] : 'NONE';
  const brandName = (content.match(/<span class="brand-name">([^<]+)<\/span>/) || [])[1];
  const fbLink = (content.match(/href="(https:\/\/[^"]*facebook[^"]*)"/) || [])[1];
  const igLink = (content.match(/href="(https:\/\/[^"]*instagram[^"]*)"/) || [])[1];
  const waLink = (content.match(/href="(https:\/\/wa\.me\/[^"]+)"/) || [])[1];
  const emailLink = (content.match(/href="mailto:([^"]+)"/) || [])[1];

  console.log(f, {
    hasHeader,
    hasFooter,
    hasMobileDrawer,
    hasCmdK,
    hasSound,
    hasTheme,
    hasLetsTalk,
    logoMarkSrc,
    brandName,
    fbLink,
    igLink,
    waLink,
    emailLink
  });
});
