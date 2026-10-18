# Haash Corporation — Corporate Web Platform

> Intelligent Digital Solutions. Built for What's Next.

A modern, minimalist, premium corporate website engineered for **Haash Corporation**, showcasing AI-powered business automation, web development, UI/UX design, AI call receptionists, CRM systems, and graphic design.

---

## 1. Architectural Highlights

- **Aesthetics & Design System:** Obsidian dark luxury visual identity built upon a black-and-white foundation with an electric-blue accent (`#5B5FF0`), oversized typography (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`), generous whitespace, and restrained glassmorphism.
- **Universal Theme Engine:** Persistent Dark & Light mode toggle with instant zero-flicker CSS variable switches, OS system preference sync (`prefers-color-scheme`), and `localStorage` memory across all 14 pages.
- **Tactile Sound Synthesizer:** Native Web Audio API procedural sound engine with subtle UI clicks, chime progressions, and an accessible header sound toggle (`🔊 / 🔇`).
- **Global Command Search Palette (`Cmd+K` / `Ctrl+K`):** Spotlight-style quick search modal with keyboard arrow navigation (`↑`/`↓`/`Enter`), instant page routing, and direct shortcuts.
- **Multi-Currency Enterprise ROI Calculator:** Dynamic savings calculator with real-time sliders for inquiries and inquiry cost, currency conversion (USD, EUR, GBP, AED, INR, CAD), and one-click executive markdown report copying.
- **AI Concierge Chatbot:** Floating interactive AI assistant anchored on the bottom-right of every page with intelligent qualified lead captures and automated contact routing.
- **Floating WhatsApp Integration:** Dedicated floating WhatsApp button anchored to the bottom-left of every page for instant direct customer engagement.
- **Admin CRM Leads Portal:** Dedicated authenticated dashboard (`admin.html`) with SHA-256 passcode verification, status management, filtering, and live Supabase Cloud database synchronization.

---

## 2. Directory Structure

```
.
├── index.html                           # Homepage (Hero, Holographic Visuals, ROI Calc, Bento)
├── about.html                           # Company culture, mission, technical leadership & values
├── services.html                        # Comprehensive engineering capabilities directory
├── services/
│   ├── ai-chatbot.html                  # AI Chatbot Development (Interactive NLU Simulator)
│   ├── website-development.html         # Custom Web Development (Performance Comparison)
│   ├── ui-ux-design.html                # UI/UX Product Design (Design System Token Inspector)
│   ├── ai-call-receptionist.html        # AI Call Receptionist (Live Voice Simulator)
│   ├── crm-systems.html                 # CRM Systems & Automation (Pipeline & Workflow Sync)
│   └── graphic-design.html              # Graphic Designing (Visual Identity & Design Systems)
├── work.html                            # Case studies & production deployments portfolio
├── insights.html                        # Technical articles, benchmarks, and research papers
├── contact.html                         # Multi-field project consultation inquiry form
├── admin.html                           # Protected Admin CRM Leads & Inquiries Dashboard
├── privacy-policy.html                  # Privacy policy documentation
├── terms.html                           # Terms of service documentation
├── assets/
│   ├── css/
│   │   ├── style.css                    # Design system, tokens, typography, layout & components
│   │   ├── animations.css               # Interactive demo styles, waveforms, and keyframes
│   │   ├── responsive.css               # Tablet and mobile breakpoint queries
│   │   ├── chatbot.css                  # AI Concierge Chatbot floating widget styles
│   │   └── admin.css                    # Admin Leads Portal layout, stats, and modal styling
│   ├── js/
│   │   ├── main.js                      # Sticky header, smooth scrolling, modal & sound logic
│   │   ├── navigation.js                # Mega-dropdown and mobile drawer menu logic
│   │   ├── animations.js                # Interactive canvas & GSAP scroll triggers
│   │   ├── chatbot.js                   # AI Concierge Chatbot widget & conversational engine
│   │   ├── contact-form.js              # Real-time form validation & Supabase cloud submission
│   │   ├── interactive-demos.js         # Interactive simulators & feature showcases
│   │   ├── supabase-client.js           # Zero-dependency Supabase Cloud REST client
│   │   └── admin.js                     # Admin portal PIN authentication & CRM controller
│   └── images/                          # Brand logos, favicons, and graphic assets
├── dev-server.js                        # Zero-dependency native Node.js static server for local preview
├── supabase_schema.sql                  # Supabase database table schema & Row Level Security (RLS)
├── vercel.json                          # Vercel configuration (Clean URLs)
├── package.json                         # Project manifest & npm scripts (No external dependencies)
├── robots.txt                           # Search engine crawling rules
├── sitemap.xml                          # XML search index sitemap
└── README.md                            # Comprehensive platform documentation
```

---

## 3. Cloud Database Integration (Supabase)

The platform is **100% serverless** and communicates directly with Supabase via browser REST APIs:

1. **Table Initialization:**
   Run `supabase_schema.sql` in your **Supabase Dashboard &rarr; SQL Editor** to initialize the `public.leads` table and Row Level Security (RLS) policies.

2. **Keys Configuration:**
   Configure your Supabase credentials in `assets/js/supabase-client.js` or directly inside the **Admin Portal** (`admin.html` &rarr; "Connect Supabase"):
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Anon Public Key:** `eyJhbGciOiJIUzI1Ni...`

---

## 4. Local Development

This project requires **ZERO external packages or `node_modules`**.

To preview locally:
```bash
node dev-server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

*(Alternatively, use any static web extension like VS Code Live Server).*

---

## 5. Deployment (Vercel)

The website is optimized for instant zero-config deployment on **[Vercel](https://vercel.com)**:
1. Push your repository to GitHub.
2. Import the repository into Vercel.
3. Deploy! Vercel serves the entire platform as high-speed static edge assets.

---

## 6. License & Credits

Copyright &copy; 2026 Haash Corporation. All rights reserved.
Built with HTML5, Vanilla CSS, JavaScript, and Supabase Cloud.
