const pages = [
  '/',
  '/about.html',
  '/services.html',
  '/work.html',
  '/insights.html',
  '/contact.html',
  '/privacy-policy.html',
  '/terms.html',
  '/services/ai-chatbot.html',
  '/services/website-development.html',
  '/services/ui-ux-design.html',
  '/services/ai-call-receptionist.html'
];

async function runTests() {
  console.log('Testing all pages on http://localhost:3000...');
  for (const page of pages) {
    const res = await fetch('http://localhost:3000' + page);
    if (!res.ok) {
      console.error(`FAIL: ${page} returned status ${res.status}`);
      process.exit(1);
    }
    const html = await res.text();
    const hasCmd = html.includes('cmd-k-trigger');
    const hasTheme = html.includes('theme-toggle-btn');
    const hasSound = html.includes('sound-toggle-btn');
    const hasPalette = html.includes('cmdPalette');

    const hasFaviconSvg = html.includes('favicon.svg');
    const hasFaviconPng = html.includes('favicon.png');
    const hasLogoMark = html.includes('logo-mark');

    if (!hasCmd || !hasTheme || !hasSound || !hasPalette || !hasFaviconSvg || !hasFaviconPng || !hasLogoMark) {
      console.error(`FAIL on ${page}: missing elements (cmd=${hasCmd}, theme=${hasTheme}, sound=${hasSound}, palette=${hasPalette}, favSvg=${hasFaviconSvg}, favPng=${hasFaviconPng}, logo=${hasLogoMark})`);
      process.exit(1);
    }
    console.log(`✔ ${page} [200 OK] (cmd-k, sound, theme, palette, favicons, logo verified)`);
  }

  // Verify static favicon endpoints directly
  const staticFiles = ['/favicon.ico', '/favicon.png', '/favicon.svg', '/favicon-32x32.png', '/apple-touch-icon.png'];
  for (const staticFile of staticFiles) {
    const sRes = await fetch('http://localhost:3000' + staticFile);
    if (!sRes.ok) {
      console.error(`FAIL: static asset ${staticFile} returned ${sRes.status}`);
      process.exit(1);
    }
    console.log(`✔ ${staticFile} [200 OK] (served directly)`);
  }

  // Check specific index components
  const indexRes = await fetch('http://localhost:3000/');
  const indexHtml = await indexRes.text();
  const hasPlayground = indexHtml.includes('id="playground"');
  const hasStatusBar = indexHtml.includes('system-status-bar');
  const hasSystemsMatrix = indexHtml.includes('id="systemsMatrix"');
  const hasDiagnosticsBtn = indexHtml.includes('id="runDiagnosticsBtn"');

  if (!hasPlayground || !hasStatusBar || !hasSystemsMatrix || !hasDiagnosticsBtn) {
    console.error('FAIL: index missing advanced widgets', {
      hasPlayground,
      hasStatusBar,
      hasSystemsMatrix,
      hasDiagnosticsBtn
    });
    process.exit(1);
  }
  console.log('✔ index.html Advanced Widgets verified (playground, status bar, systems matrix, diagnostics probe)');

  // Test Contact API POST (Strategy modal payload)
  const contactRes = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Elena Rostova',
      email: 'elena@vanguard.ai',
      phone: '+1 555-0144',
      company: 'Vanguard AI',
      service: '15-Minute Strategy Consultation',
      message: 'Preferred Time/Focus: AI Voice Call Receptionist'
    })
  });
  const contactData = await contactRes.json();
  if (!contactRes.ok || !contactData.success) {
    console.error('FAIL: Contact API failed', contactData);
    process.exit(1);
  }
  // Test Admin Dashboard & Leads API
  const adminPageRes = await fetch('http://localhost:3000/admin.html');
  if (!adminPageRes.ok) {
    console.error('FAIL: admin.html failed to load', adminPageRes.status);
    process.exit(1);
  }
  const adminHtml = await adminPageRes.text();
  const hasLock = adminHtml.includes('id="lockScreen"');
  const hasTable = adminHtml.includes('id="leadsTbody"');
  const hasStats = adminHtml.includes('id="statTotal"');
  if (!hasLock || !hasTable || !hasStats) {
    console.error('FAIL: admin.html missing key components', { hasLock, hasTable, hasStats });
    process.exit(1);
  }
  console.log('✔ admin.html Lead Intelligence Dashboard verified: [200 OK, lock screen, stats, table present]');

  const leadsApiRes = await fetch('http://localhost:3000/api/leads');
  const leadsData = await leadsApiRes.json();
  if (!leadsApiRes.ok || !leadsData.success || !Array.isArray(leadsData.leads)) {
    console.error('FAIL: /api/leads failed', leadsData);
    process.exit(1);
  }
  console.log(`✔ Leads API verified: [200 OK, count: ${leadsData.leads.length}]`);

  const exportRes = await fetch('http://localhost:3000/api/leads/export');
  if (!exportRes.ok || !exportRes.headers.get('content-type')?.includes('csv')) {
    console.error('FAIL: /api/leads/export failed', exportRes.status);
    process.exit(1);
  }
  console.log('✔ Leads CSV Export verified: [200 OK, text/csv stream]');

  console.log('\n======================================================');
  console.log('🚀 ALL AUTOMATED INTEGRATION TESTS & ADMIN CRM VERIFIED!');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
