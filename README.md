# Haash Corporation — Corporate Web Platform

> Intelligent Digital Solutions. Built for What's Next.

A modern, minimalist, premium corporate website engineered for **Haash Corporation**, showcasing AI-powered business automation, web development, UI/UX design, and AI call receptionist solutions.

---

## 1. Architectural Highlights

- **Aesthetics & Design System:** Minimalist luxury visual identity built upon a black-and-white foundation with an electric-blue accent (`#5B5FF0`), oversized typography (`Plus Jakarta Sans`), generous whitespace, and restrained glassmorphism.
- **Universal Theme Engine:** Persistent Dark & Light mode toggle with instant zero-flicker CSS variable switches, OS system preference sync (`prefers-color-scheme`), and `localStorage` memory across all 12 pages.
- **Tactile Sound Synthesizer:** Native Web Audio API procedural sound engine with subtle UI clicks, chime progressions, and an accessible header sound toggle (`🔊 / 🔇`).
- **Global Command Search Palette (`Cmd+K` / `Ctrl+K`):** Spotlight-style quick search modal with keyboard arrow navigation (`↑`/`↓`/`Enter`), instant page routing, and direct shortcuts (Book Strategy Session, Toggle Theme, Toggle Sound, Copy Email).
- **Multi-Currency Enterprise ROI Calculator:** Dynamic savings calculator with real-time sliders for inquiries and inquiry cost, currency conversion (USD, EUR, GBP, AED, INR, CAD), and one-click executive markdown report copying.
- **Dynamic Spotlight & 3D Perspective Tilt:** Real-time cursor coordinates `--mouse-x` / `--mouse-y` lighting on cards with smooth 3D perspective rotation on hover.
- **Interactive Developer Code Playground:** Autonomous integration sandbox with switchable code tabs (TypeScript, Python, cURL, Twilio SIP Voice) and an interactive "Run Simulation" runner that streams realistic execution logs.
- **Live System Operational Health HUD:** Real-time cluster status bar displaying global latency (22ms), Core Web Vitals (99.8%), and 99.99% uptime SLA across 4 edge clusters (`iad1`, `fra1`, `sin1`, `syd1`).
- **Fast-Track 15-Minute Strategy Call Modal:** Direct booking modal with focus-area triage and validation that dispatches straight into the `/api/contact` pipeline.
- **Interactive Service Demonstrations:**
  - **AI Chatbot Simulator:** Dynamic conversational dialogue with instant intelligent answers and lead qualification prompts.
  - **Website Viewport Preview:** Interactive Desktop, Tablet, and Mobile viewport switcher with live resolution readout.
  - **UI/UX Split Comparison Slider:** Interactive drag-to-reveal Before/After wireframe vs high-fidelity design stage comparison.
  - **AI Call Receptionist Waveform:** Procedural synthetic audio tone generation with an interactive dialpad and live waveform animation.
- **Multi-Page Architecture:** Strict separation of concerns (HTML5, Vanilla CSS3, modern modular JavaScript, and backend serverless endpoints). No heavy single-page application framework bloat.
- **Validated Contact API:** Robust server-side endpoint (`api/contact.js`) with input sanitization, honeypot spam protection, inline client feedback, and Resend email delivery.
- **Automated Test Suite:** Comprehensive regression suite (`npm test`) validating HTTP 200 responses, control presence, and API payloads across all pages.

---

## 2. Directory Structure

```
HAC/
├── index.html                           # Home Page
├── about.html                           # About Us Page
├── services.html                        # Services Portfolio Landing Page
├── work.html                            # Selected Work & Concept Demonstrations
├── insights.html                        # Technical Insights & Analysis
├── contact.html                         # Conversion-Focused Contact Page
├── privacy-policy.html                  # Privacy Policy & Data Processing Notice
├── terms.html                           # Terms of Service & IP Agreement
├── services/
│   ├── ai-chatbot.html                  # Dedicated Service: AI Chatbot Development
│   ├── website-development.html         # Dedicated Service: Website Development
│   ├── ui-ux-design.html                # Dedicated Service: UI/UX Design Systems
│   └── ai-call-receptionist.html        # Dedicated Service: AI Call Receptionist
├── assets/
│   ├── css/
│   │   ├── style.css                    # Design system, tokens, typography, layout & components
│   │   ├── animations.css               # Interactive demo styles, waveforms, and keyframes
│   │   └── responsive.css               # Tablet and mobile breakpoint queries
│   └── js/
│       ├── main.js                      # Sticky header, smooth scrolling, and FAQ accordions
│       ├── navigation.js                # Mega-dropdown and mobile drawer menu logic
│       ├── animations.js                # Interactive neural particle canvas & GSAP reveals
│       ├── contact-form.js              # Real-time validation, honeypot, and fetch submission
│       └── interactive-demos.js         # Chatbot, viewport, design stage, & waveform simulators
├── api/
│   └── contact.js                       # Serverless / Node.js contact form handler (Resend API)
├── server.js                            # Express static file and API server for local dev
├── .env.example                         # Environment variable documentation template
├── .gitignore                           # Git ignore rules
├── package.json                         # Node.js project manifest & scripts
├── robots.txt                           # Search engine crawling rules
├── sitemap.xml                          # XML search index sitemap
└── README.md                            # Comprehensive documentation
```

---

## 3. Quick Start & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher; tested on Node.js v24)
- npm (v9.0.0 or higher)

### Setup Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

3. **Launch the Local Development Server:**
   ```bash
   npm start
   ```
   Open your browser to: **[http://localhost:3000](http://localhost:3000)**

---

## 4. Configuration & Email Delivery

The contact form is configured to work out-of-the-box in two modes:

### A. Development / Demonstration Mode (Default)
When no `RESEND_API_KEY` is provided, the API safely logs validated inquiries to your terminal console with complete field metadata and returns a `200 OK` success message to the visitor. No emails will fail or bounce.

### B. Production Live Delivery Mode (Resend API)
To receive live client inquiries in your company email inbox:

1. Create a free account at [Resend.com](https://resend.com) and generate an API Key.
2. In your `.env` file, configure:
   ```env
   PORT=3000
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_RECIPIENT_EMAIL=inquiries@haashcorp.com
   CONTACT_SENDER_EMAIL=website@haashcorp.com
   ```
3. Ensure your sending domain (e.g., `haashcorp.com`) is verified in Resend. The visitor's email will be set as the `reply_to` address so your team can reply directly with one click.

---

## 5. WhatsApp & Social Profile Integration

- **WhatsApp Floating Button:** Configured across every page. To update the international phone number, modify `WHATSAPP_PHONE_NUMBER` in `.env` or the `data-phone` attribute on the widget HTML (format: country code + number with no `+`, `-`, or spaces, e.g. `15551234567`).
- **Official Social Links:** Verified outbound links to Facebook and Instagram include `target="_blank"` and `rel="noopener noreferrer"` attributes for security and performance.

---

## 6. Production Deployment Options

### Option 1: Vercel (Recommended)
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Vercel automatically detects `api/contact.js` as a Serverless Function and serves all static assets with edge caching.
4. Add your environment variables in the Vercel Project Settings (`RESEND_API_KEY`, etc.).

### Option 2: Node.js VPS / Docker
1. Clone to your server: `git clone <repo>`
2. Run `npm install --production`
3. Start via PM2 or systemd:
   ```bash
   pm2 start server.js --name "haash-web"
   ```
4. Put Nginx in front with SSL (Let's Encrypt).

---

## 7. License & Credits

Copyright &copy; 2026 Haash Corporation. All rights reserved.
Built with HTML5, CSS3, JavaScript, GSAP, and Plus Jakarta Sans.
