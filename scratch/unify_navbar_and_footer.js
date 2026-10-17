const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const pages = [
  { file: 'index.html', active: 'home', isSub: false },
  { file: 'about.html', active: 'about', isSub: false },
  { file: 'services.html', active: 'services', isSub: false },
  { file: 'work.html', active: 'work', isSub: false },
  { file: 'insights.html', active: 'insights', isSub: false },
  { file: 'contact.html', active: 'contact', isSub: false },
  { file: 'privacy-policy.html', active: 'none', isSub: false },
  { file: 'terms.html', active: 'none', isSub: false },
  { file: 'services/ai-chatbot.html', active: 'services', isSub: true },
  { file: 'services/website-development.html', active: 'services', isSub: true },
  { file: 'services/ui-ux-design.html', active: 'services', isSub: true },
  { file: 'services/ai-call-receptionist.html', active: 'services', isSub: true }
];

function buildHeader(p, active) {
  return `  <header class="site-header" id="siteHeader">
    <div class="container header-container">
      <!-- Brand Logo -->
      <a href="${p}index.html" class="site-logo" aria-label="Hassh Corporation Home">
        <div class="logo-mark" aria-hidden="true"><img src="${p}assets/images/favicon.png" alt="Hassh Corporation HC Logo" class="logo-mark-img"></div>
        <div class="logo-text">
          <span class="brand-name">HASSH</span>
          <span class="brand-sub">CORPORATION</span>
        </div>
      </a>

      <!-- Desktop Navigation Menu (Centrally Aligned with Equal Gaps) -->
      <nav class="desktop-nav" aria-label="Primary Navigation">
        <a href="${p}index.html" class="nav-link ${active === 'home' ? 'active' : ''}">Home</a>
        <a href="${p}about.html" class="nav-link ${active === 'about' ? 'active' : ''}">About</a>

        <!-- Services Dropdown Mega Menu -->
        <div class="nav-dropdown-wrapper">
          <button type="button" class="nav-link dropdown-trigger ${active === 'services' ? 'active' : ''}" aria-expanded="false" aria-haspopup="true">
            <span>Services</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div class="services-mega-menu" role="menu">
            <div class="mega-grid">
              <a href="${p}services/ai-chatbot.html" class="mega-item" role="menuitem">
                <div class="mega-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                  </svg>
                </div>
                <div class="mega-content">
                  <div class="mega-title">
                    <span>AI Chatbot Development</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                  <p class="mega-desc">Automate conversations and capture qualified leads 24/7.</p>
                </div>
              </a>

              <a href="${p}services/website-development.html" class="mega-item" role="menuitem">
                <div class="mega-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div class="mega-content">
                  <div class="mega-title">
                    <span>Website Development</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                  <p class="mega-desc">Build fast, responsive websites that move business forward.</p>
                </div>
              </a>

              <a href="${p}services/ui-ux-design.html" class="mega-item" role="menuitem">
                <div class="mega-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <div class="mega-content">
                  <div class="mega-title">
                    <span>UI/UX Design</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                  <p class="mega-desc">Intuitive, accessible, and visually compelling product experiences.</p>
                </div>
              </a>

              <a href="${p}services/ai-call-receptionist.html" class="mega-item" role="menuitem">
                <div class="mega-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="mega-content">
                  <div class="mega-title">
                    <span>AI Call Receptionist</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                  <p class="mega-desc">Answer calls, manage inquiries, and schedule appointments instantly.</p>
                </div>
              </a>
            </div>

            <div class="mega-footer">
              <a href="${p}services.html" class="mega-all-link">
                <span>Explore All Engineering Capabilities</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </div>

        <a href="${p}work.html" class="nav-link ${active === 'work' ? 'active' : ''}">Our Work</a>
        <a href="${p}insights.html" class="nav-link ${active === 'insights' ? 'active' : ''}">Insights</a>
        <a href="${p}contact.html" class="nav-link ${active === 'contact' ? 'active' : ''}">Contact</a>
      </nav>

      <!-- Header Controls: Search (Cmd+K), Theme Switcher, & CTA -->
      <div class="header-actions">
        <button type="button" class="cmd-k-trigger" aria-label="Open command search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span class="cmd-text">Search</span>
          <span class="cmd-k-key">⌘K</span>
        </button>

        <button type="button" class="sound-toggle-btn" aria-label="Toggle sound feedback" title="Sound: Enabled (Click to mute)">
          <svg class="sound-icon-active" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <svg class="sound-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        </button>

        <button type="button" class="theme-toggle-btn" aria-label="Toggle dark/light color theme">
          <svg class="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          <svg class="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>

        <a href="${p}contact.html" class="btn btn-primary header-cta-desktop">
          <span>Let's Talk</span>
          <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>

        <button type="button" class="mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function buildMobileDrawer(p, active) {
  return `  <!-- Mobile Navigation Drawer -->
  <div class="mobile-backdrop"></div>
  <aside class="mobile-drawer" aria-label="Mobile Navigation Drawer">
    <div class="mobile-nav-links">
      <a href="${p}index.html" class="mobile-nav-link ${active === 'home' ? 'active' : ''}">Home</a>
      <a href="${p}about.html" class="mobile-nav-link ${active === 'about' ? 'active' : ''}">About</a>

      <div>
        <button type="button" class="mobile-accordion-header">
          <span>Services</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="mobile-accordion-content">
          <a href="${p}services.html" class="mobile-sub-link">✦ View All Services</a>
          <a href="${p}services/ai-chatbot.html" class="mobile-sub-link">AI Chatbot Development</a>
          <a href="${p}services/website-development.html" class="mobile-sub-link">Website Development</a>
          <a href="${p}services/ui-ux-design.html" class="mobile-sub-link">UI/UX Design</a>
          <a href="${p}services/ai-call-receptionist.html" class="mobile-sub-link">AI Call Receptionist</a>
        </div>
      </div>

      <a href="${p}work.html" class="mobile-nav-link ${active === 'work' ? 'active' : ''}">Our Work</a>
      <a href="${p}insights.html" class="mobile-nav-link ${active === 'insights' ? 'active' : ''}">Insights</a>
      <a href="${p}contact.html" class="mobile-nav-link ${active === 'contact' ? 'active' : ''}">Contact</a>
    </div>

    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-color);">
      <a href="${p}contact.html" class="btn btn-primary" style="width: 100%;"><span>Let's Talk</span></a>
    </div>
  </aside>`;
}

function buildFooter(p) {
  return `  <!-- Global Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top-grid">
        <div class="footer-brand-col">
          <a href="${p}index.html" class="site-logo">
            <div class="logo-mark" aria-hidden="true"><img src="${p}assets/images/favicon.png" alt="Hassh Corporation HC Logo" class="logo-mark-img"></div>
            <div class="logo-text">
              <span class="brand-name">HASSH</span>
              <span class="brand-sub">CORPORATION</span>
            </div>
          </a>
          <p>
            Intelligent digital solutions company specializing in AI-powered automation, web development, UI/UX design, and AI voice receptionists.
          </p>
          <div class="footer-social-links">
            <a href="https://www.facebook.com/HasshCorporation" class="social-icon-btn" target="_blank" rel="noopener noreferrer" aria-label="Hassh Corporation on Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/hasshcorporation" class="social-icon-btn" target="_blank" rel="noopener noreferrer" aria-label="Hassh Corporation on Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://wa.me/923423951603" class="social-icon-btn js-whatsapp-link" target="_blank" rel="noopener noreferrer" aria-label="Chat with Hassh Corporation on WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="footer-heading">Services</h4>
          <ul class="footer-nav-list">
            <li><a href="${p}services/ai-chatbot.html" class="footer-link">AI Chatbot Development</a></li>
            <li><a href="${p}services/website-development.html" class="footer-link">Website Development</a></li>
            <li><a href="${p}services/ui-ux-design.html" class="footer-link">UI/UX Design</a></li>
            <li><a href="${p}services/ai-call-receptionist.html" class="footer-link">AI Call Receptionist</a></li>
            <li><a href="${p}services.html" class="footer-link">All Services Overview</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-nav-list">
            <li><a href="${p}about.html" class="footer-link">About Us</a></li>
            <li><a href="${p}work.html" class="footer-link">Our Work</a></li>
            <li><a href="${p}insights.html" class="footer-link">Insights & Blog</a></li>
            <li><a href="${p}contact.html" class="footer-link">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Direct Contact</h4>
          <div class="footer-contact-info">
            <div class="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:Suhaibahmed099@gmail.com" class="footer-link">Suhaibahmed099@gmail.com</a>
            </div>
            <div class="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3"></path></svg>
              <span>+92 342 3951603</span>
            </div>
            <div class="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Mon – Fri: 9:00 AM – 6:00 PM EST</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          &copy; <span id="currentYear">2026</span> Hassh Corporation. All rights reserved.
        </div>
        <div class="footer-legal-links">
          <a href="${p}privacy-policy.html">Privacy Policy</a>
          <a href="${p}terms.html">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Floating WhatsApp Widget -->
  <div class="whatsapp-floating-widget">
    <div class="whatsapp-tooltip">Let's talk</div>
    <a href="https://wa.me/923423951603" class="whatsapp-btn js-whatsapp-link" aria-label="Chat with Hassh Corporation on WhatsApp" target="_blank" rel="noopener noreferrer">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </a>
  </div>`;
}

pages.forEach(({ file, active, isSub }) => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  const p = isSub ? '../' : '';

  // 1. Replace <header class="site-header" ...> ... </header>
  const headerRegex = /<header class="site-header"[\s\S]*?<\/header>/i;
  const newHeader = buildHeader(p, active);
  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, newHeader);
  }

  // 2. Replace Mobile Drawer: <div class="mobile-backdrop"></div>[\s\S]*?<\/aside>
  const mobileRegex = /(<div class="mobile-backdrop"><\/div>[\s\S]*?<aside class="mobile-drawer"[\s\S]*?<\/aside>)/i;
  const newMobile = buildMobileDrawer(p, active);
  if (mobileRegex.test(html)) {
    html = html.replace(mobileRegex, newMobile);
  }

  // 3. Clean up double comments before footer
  html = html.replace(/<!--\s*Global Footer\s*-->\s*<!--\s*={5,}[\s\S]*?={5,}\s*-->/gi, '');

  // 4. Replace <footer class="site-footer"> ... </footer> (including floating widget if present after)
  const footerRegex = /<!--\s*Global Footer\s*-->[\s\S]*?<footer class="site-footer"[\s\S]*?<\/footer>(\s*<!-- Floating WhatsApp Widget -->\s*<div class="whatsapp-floating-widget">[\s\S]*?<\/div>)?/i;
  const newFooter = buildFooter(p);
  if (footerRegex.test(html)) {
    html = html.replace(footerRegex, newFooter);
  } else {
    const fallbackFooterRegex = /<footer class="site-footer"[\s\S]*?<\/footer>(\s*<!-- Floating WhatsApp Widget -->\s*<div class="whatsapp-floating-widget">[\s\S]*?<\/div>)?/i;
    if (fallbackFooterRegex.test(html)) {
      html = html.replace(fallbackFooterRegex, newFooter);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Unified navbar & footer in ${file}`);
});

console.log('Finished unifying all 12 files.');
