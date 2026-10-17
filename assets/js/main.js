/**
 * Haash Corporation — Advanced Flagship JavaScript Engine
 * Features:
 *  - Theme Engine (Dark / Light Mode with System Sync & LocalStorage)
 *  - Native Web Audio API Sound Synthesizer & Sound Toggle
 *  - Toast Notification System
 *  - Command Palette (Cmd+K / Ctrl+K) with Full Keyboard Nav & Quick Actions
 *  - Interactive Multi-Currency ROI Calculator & Markdown Report Copier
 *  - Dynamic Spotlight Cursor Lighting & 3D Perspective Card Tilt
 *  - Interactive Architecture Code Playground & Autonomous Terminal Simulator
 *  - Strategy Session Booking Modal & Form Dispatcher
 *  - UI/UX Interactive Split Comparison Slider
 *  - Sticky Header, Smooth Scrolling & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Toast Notification System
  // ==========================================================================
  let toastContainer = document.getElementById('haashToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'haashToastContainer';
    toastContainer.className = 'haash-toast-container';
    document.body.appendChild(toastContainer);
  }

  const showToast = (message, iconSvg = null) => {
    const toast = document.createElement('div');
    toast.className = 'haash-toast';

    const defaultIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    toast.innerHTML = `${iconSvg || defaultIcon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  };
  window.haashToast = showToast;

  // ==========================================================================
  // 2. Web Audio API Sound Synthesizer & Sound Controller
  // ==========================================================================
  const isSoundMuted = () => localStorage.getItem('haash-sound-muted') === 'true';

  const playFx = (type = 'click') => {
    if (isSoundMuted()) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'theme') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'slider') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'success') {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5

        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        gain2.gain.setValueAtTime(0.03, ctx.currentTime + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        osc2.start(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // AudioContext policy bypass
    }
  };
  window.haashPlayFx = playFx;

  // Sound Toggle Buttons
  const soundToggleBtns = document.querySelectorAll('.sound-toggle-btn');
  const syncSoundButtons = () => {
    const muted = isSoundMuted();
    soundToggleBtns.forEach(btn => {
      if (muted) {
        btn.classList.add('is-muted');
        btn.setAttribute('aria-label', 'Unmute sound effects');
        btn.setAttribute('title', 'Sound: Muted (Click to enable)');
      } else {
        btn.classList.remove('is-muted');
        btn.setAttribute('aria-label', 'Mute sound effects');
        btn.setAttribute('title', 'Sound: Enabled (Click to mute)');
      }
    });
  };
  syncSoundButtons();

  soundToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentlyMuted = isSoundMuted();
      localStorage.setItem('haash-sound-muted', currentlyMuted ? 'false' : 'true');
      syncSoundButtons();
      if (currentlyMuted) {
        playFx('success');
        showToast('Tactile audio feedback enabled');
      } else {
        showToast('Tactile audio feedback muted');
      }
    });
  });

  // ==========================================================================
  // 3. Theme Engine: Dark & Light Mode with System Sync & LocalStorage
  // ==========================================================================
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('haash-theme');
    if (saved) return saved;
    return 'dark';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('haash-theme', theme);
  };

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      playFx('theme');
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('haash-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ==========================================================================
  // 4. Command Palette (Cmd+K / Ctrl+K) with Keyboard Navigation
  // ==========================================================================
  const cmdPaletteBackdrop = document.getElementById('cmdPalette');
  const cmdSearchInput = document.getElementById('cmdSearchInput');
  const cmdList = document.getElementById('cmdList');
  const cmdTriggers = document.querySelectorAll('.cmd-k-trigger');
  let selectedCmdIndex = 0;

  const navigationIndex = [
    { title: 'Home', url: 'index.html', tag: 'Page', desc: 'Main corporate overview and intelligent systems' },
    { title: 'About Haash Corporation', url: 'about.html', tag: 'Page', desc: 'Company mission, values, and technology philosophy' },
    { title: 'Services Portfolio', url: 'services.html', tag: 'Portfolio', desc: 'Overview of all four digital engineering disciplines' },
    { title: 'AI Chatbot Development', url: 'services/ai-chatbot.html', tag: 'Service', desc: 'Conversational NLU assistants and CRM workflows' },
    { title: 'Website Development', url: 'services/website-development.html', tag: 'Service', desc: 'High-performance, accessible, Core Web Vitals optimized sites' },
    { title: 'UI/UX Design Systems', url: 'services/ui-ux-design.html', tag: 'Service', desc: 'Human-centered digital interfaces and Figma tokens' },
    { title: 'AI Call Receptionist', url: 'services/ai-call-receptionist.html', tag: 'Service', desc: 'Voice telephony agents and appointment booking' },
    { title: 'Our Work & Selected Demonstrations', url: 'work.html', tag: 'Portfolio', desc: 'Interactive concept prototypes and architecture case studies' },
    { title: 'Insights & Technical Notes', url: 'insights.html', tag: 'Blog', desc: 'Articles on AI automation, web speed, and voice AI' },
    { title: 'Contact & Inquiry', url: 'contact.html', tag: 'Contact', desc: 'Direct outreach, proposal requests, and WhatsApp chat' },
    { title: 'Book 15-Min Strategy Session', action: 'openStrategyModal', tag: 'Action', desc: 'Schedule a direct technical consultation' },
    { title: 'Toggle Dark / Light Theme', action: 'toggleTheme', tag: 'Shortcut', desc: 'Switch interface appearance between dark and light' },
    { title: 'Toggle Tactile Sound FX', action: 'toggleSound', tag: 'Shortcut', desc: 'Enable or disable interactive synthesizer chimes' },
    { title: 'Copy Direct Email', action: 'copyEmail', tag: 'Action', desc: 'Copy Suhaibahmed099@gmail.com to clipboard' },
    { title: 'Chat on WhatsApp', url: 'https://wa.me/923423951603', tag: 'Action', desc: 'Open direct WhatsApp conversation' }
  ];

  let currentFilteredItems = [];

  const renderCmdItems = (filter = '') => {
    if (!cmdList) return;
    const query = filter.toLowerCase().trim();
    currentFilteredItems = navigationIndex.filter(item => 
      !query || 
      item.title.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query) || 
      item.tag.toLowerCase().includes(query)
    );

    selectedCmdIndex = 0;

    if (currentFilteredItems.length === 0) {
      cmdList.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.875rem;">No matching items found. Try "services", "theme", or "contact".</div>`;
      return;
    }

    cmdList.innerHTML = currentFilteredItems.map((item, index) => `
      <div class="cmd-item ${index === 0 ? 'active' : ''}" data-index="${index}" role="option">
        <div class="cmd-item-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          <div>
            <div style="font-weight: 600;">${item.title}</div>
            <div style="font-size: 0.75rem; opacity: 0.75;">${item.desc}</div>
          </div>
        </div>
        <span class="cmd-tag">${item.tag}</span>
      </div>
    `).join('');

    cmdList.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        executeCmdItem(currentFilteredItems[idx]);
      });
      el.addEventListener('mouseenter', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        highlightCmdItem(idx);
      });
    });
  };

  const highlightCmdItem = (index) => {
    selectedCmdIndex = index;
    const items = cmdList.querySelectorAll('.cmd-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
      if (idx === index) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  const executeCmdItem = (item) => {
    if (!item) return;
    playFx('click');
    closeCmdPalette();

    if (item.action === 'openStrategyModal') {
      openStrategyModal();
    } else if (item.action === 'toggleTheme') {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
      showToast(`Switched to ${current === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}`);
    } else if (item.action === 'toggleSound') {
      const muted = isSoundMuted();
      localStorage.setItem('haash-sound-muted', muted ? 'false' : 'true');
      syncSoundButtons();
      showToast(`Sound FX ${muted ? 'Enabled 🔊' : 'Muted 🔇'}`);
    } else if (item.action === 'copyEmail') {
      navigator.clipboard.writeText('Suhaibahmed099@gmail.com');
      showToast('Copied Suhaibahmed099@gmail.com to clipboard');
    } else if (item.url) {
      if (item.url.startsWith('http')) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.url;
      }
    }
  };

  const openCmdPalette = () => {
    if (!cmdPaletteBackdrop) return;
    cmdPaletteBackdrop.classList.add('is-open');
    renderCmdItems('');
    playFx('click');
    if (cmdSearchInput) {
      cmdSearchInput.value = '';
      setTimeout(() => cmdSearchInput.focus(), 60);
    }
  };

  const closeCmdPalette = () => {
    if (!cmdPaletteBackdrop) return;
    cmdPaletteBackdrop.classList.remove('is-open');
  };

  cmdTriggers.forEach(btn => btn.addEventListener('click', openCmdPalette));

  if (cmdPaletteBackdrop) {
    cmdPaletteBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdPaletteBackdrop) closeCmdPalette();
    });
  }

  if (cmdSearchInput) {
    cmdSearchInput.addEventListener('input', (e) => {
      renderCmdItems(e.target.value);
    });

    cmdSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentFilteredItems.length > 0) {
          highlightCmdItem((selectedCmdIndex + 1) % currentFilteredItems.length);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentFilteredItems.length > 0) {
          highlightCmdItem((selectedCmdIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFilteredItems[selectedCmdIndex]) {
          executeCmdItem(currentFilteredItems[selectedCmdIndex]);
        }
      }
    });
  }

  // Keyboard shortcut: Cmd+K / Ctrl+K & Esc
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteBackdrop && cmdPaletteBackdrop.classList.contains('is-open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeStrategyModal();
    }
  });

  // ==========================================================================
  // 5. Dynamic Spotlight Cursor Lighting & 3D Tilt Effect on Cards
  // ==========================================================================
  const interactiveCards = document.querySelectorAll(
    '.service-card, .work-card, .calc-card, .glass-card, .process-step, .stat-card, .spotlight-card'
  );

  interactiveCards.forEach(card => {
    card.classList.add('spotlight-card', 'tilt-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight radial gradient coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Compute subtle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((centerY - y) / centerY) * 4;
      const rotY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // ==========================================================================
  // 6. Interactive Systems Intelligence Matrix Engine (Zero-Pricing Interactive Tech)
  // ==========================================================================
  const matrixNavBtns = document.querySelectorAll('.matrix-nav-btn');
  const matrixActiveTitle = document.getElementById('matrixActiveTitle');
  const matrixActiveDesc = document.getElementById('matrixActiveDesc');
  const matrixLatencyVal = document.getElementById('matrixLatencyVal');
  const matrixThroughputVal = document.getElementById('matrixThroughputVal');
  const matrixPrecisionVal = document.getElementById('matrixPrecisionVal');
  const matrixUptimeVal = document.getElementById('matrixUptimeVal');
  const matrixConsoleLog = document.getElementById('matrixConsoleLog');
  const runDiagnosticsBtn = document.getElementById('runDiagnosticsBtn');

  const matrixModules = {
    voice: {
      title: 'Neural Voice Receptionist & Telephony Pipeline',
      desc: 'Custom low-latency WebRTC and SIP trunking bridge connected to streaming neural speech-to-text, deep semantic intent parser, and sub-120ms text-to-speech engine with human naturalness.',
      latency: '< 82 ms',
      throughput: '50K+ RPS',
      precision: '99.96%',
      uptime: '99.99%',
      logs: '[SYSTEM] Neural Gateway v4.8.2 Online — Status: OPTIMAL\n[ACTIVE] Node: Voice Telephony Core (Region: us-east-edge)\n[TELEMETRY] Acoustic jitter: 0.12ms | Packet loss: 0.00%\n[READY] Awaiting system diagnostic probe...'
    },
    agents: {
      title: 'Autonomous Multi-Agent Workflow Core',
      desc: 'Distributed DAG executor orchestrating autonomous worker agents across CRM updates, calendar synchronizations, ticket triage, and automated resolution pipelines.',
      latency: '< 140 ms',
      throughput: '120K+ Ops/m',
      precision: '99.98%',
      uptime: '99.995%',
      logs: '[ORCHESTRATION] Agent Core Cluster active across 8 nodes.\n[TOPOLOGY] DAG pipeline validated: Intent -> Parser -> Validation -> CRM commit.\n[STATUS] Zero queue backpressure detected.'
    },
    memory: {
      title: 'Enterprise High-Dimension Vector Memory',
      desc: 'Sub-millisecond cosine similarity vector retrieval indexed over domain-specific enterprise knowledge bases with strict zero-hallucination guardrails.',
      latency: '< 34 ms',
      throughput: '1.2M QPS',
      precision: '99.99%',
      uptime: '99.99%',
      logs: '[VECTOR] Index: hnswlib-enterprise-v2 (Dimensions: 1536)\n[CLUSTER] 24 Shards in synch | Re-ranking engine active.\n[GUARDRAIL] Grounded hallucination prevention filters verified.'
    },
    edge: {
      title: 'Global Low-Latency Edge Mesh',
      desc: '35+ Points of Presence routing incoming enterprise traffic at the edge with automated geo-replication, SSL termination, and DDoS mitigation.',
      latency: '< 18 ms',
      throughput: '500Gbps+',
      precision: '100.0%',
      uptime: '100.0%',
      logs: '[EDGE] Anycast routing active across 35 PoPs globally.\n[SECURITY] WAF inspection: 0 threats detected.\n[HEALTH] All health probes returning HTTP 200 OK.'
    }
  };

  let activeMatrixKey = 'voice';

  matrixNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-matrix-target');
      if (!target || !matrixModules[target]) return;

      matrixNavBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeMatrixKey = target;

      const mod = matrixModules[target];
      if (matrixActiveTitle) matrixActiveTitle.textContent = mod.title;
      if (matrixActiveDesc) matrixActiveDesc.textContent = mod.desc;
      if (matrixLatencyVal) matrixLatencyVal.textContent = mod.latency;
      if (matrixThroughputVal) matrixThroughputVal.textContent = mod.throughput;
      if (matrixPrecisionVal) matrixPrecisionVal.textContent = mod.precision;
      if (matrixUptimeVal) matrixUptimeVal.textContent = mod.uptime;
      if (matrixConsoleLog) matrixConsoleLog.textContent = mod.logs;

      playFx('click');
    });
  });

  if (runDiagnosticsBtn && matrixConsoleLog) {
    runDiagnosticsBtn.addEventListener('click', () => {
      playFx('slider');
      runDiagnosticsBtn.disabled = true;
      runDiagnosticsBtn.innerHTML = `
        <svg class="spin-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        <span>Running Neural Probe...</span>
      `;

      const now = new Date().toISOString().substring(11, 23);
      matrixConsoleLog.textContent += `\n[PROBE ${now}] Dispatching diagnostic pulse to ${activeMatrixKey.toUpperCase()} node...`;

      setTimeout(() => {
        const pingTime = Math.floor(Math.random() * 15) + 18;
        matrixConsoleLog.textContent += `\n[PROBE OK] Roundtrip latency confirmed: ${pingTime}ms. Zero anomalies detected.`;
        matrixConsoleLog.scrollTop = matrixConsoleLog.scrollHeight;
        playFx('success');
        showToast(`Diagnostic probe on ${activeMatrixKey.toUpperCase()} cluster verified optimal!`);

        runDiagnosticsBtn.disabled = false;
        runDiagnosticsBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Trigger System Diagnostics Probe</span>
        `;
      }, 750);
    });
  }

  // ==========================================================================
  // 7. Interactive Architecture Code Playground & Autonomous Terminal Simulator
  // ==========================================================================
  const playgroundTabs = document.querySelectorAll('.playground-tab');
  const playgroundCodeArea = document.getElementById('playgroundCodeArea');
  const playgroundRunBtn = document.getElementById('playgroundRunBtn');
  const playgroundConsole = document.getElementById('playgroundConsole');

  const codeSnippets = {
    node: `// Initialize Haash Autonomous Voice & RAG Agent
import { HaashClient } from '@haash/ai-agent';

const client = new HaashClient({
  apiKey: process.env.HAASH_API_KEY,
  cluster: 'iad1-edge'
});

// Deploy 24/7 autonomous telephony receptionist
const receptionist = await client.telephony.deployAgent({
  phoneNumber: '+92 342 3951603',
  knowledgeBaseId: 'kb_haash_corp_v3',
  voiceProfile: 'neural-en-us-professional',
  maxLatencyMs: 250,
  webhook: 'https://api.yourcompany.com/crm/leads'
});

console.log(\`Agent \${receptionist.id} live with 99.99% uptime\`);`,

    python: `# Deploy Haash RAG & Lead Qualification Pipeline
from haash_ai import HaashEngine, AgentConfig

engine = HaashEngine(api_key="haash_live_sec_9942a")

pipeline = engine.create_pipeline(
    model="haash-synapse-v4",
    retrieval_strategy="hybrid_vector_lexical",
    enable_crm_sync=True
)

@pipeline.on_qualified_lead
def handle_lead(lead):
    print(f"Qualified lead captured: {lead.company} (Timeline: {lead.timeline})")

pipeline.start_listening()`,

    curl: `# Haash Autonomous Engine REST Handshake
curl -X POST https://api.haashcorp.com/v1/agents/handshake \\
  -H "Authorization: Bearer haash_live_demo" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_type": "telephony_receptionist",
    "rag_enabled": true,
    "sla_latency_limit_ms": 200,
    "fallback_destination": "+923423951603"
  }'`,

    twilio: `// Twilio Voice SIP Trunk Integration with Haash Neural Edge
const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.handler = function(context, event, callback) {
  const twiml = new VoiceResponse();
  const connect = twiml.connect();
  
  // Stream bi-directional 48kHz audio to Haash Neural Engine
  connect.stream({
    url: 'wss://neural-voice.haashcorp.com/v1/stream',
    track: 'both_tracks'
  });

  callback(null, twiml);
};`
  };

  playgroundTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playgroundTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const lang = tab.getAttribute('data-lang') || 'node';
      if (playgroundCodeArea && codeSnippets[lang]) {
        playgroundCodeArea.textContent = codeSnippets[lang];
      }
      playFx('click');
    });
  });

  if (playgroundRunBtn && playgroundConsole) {
    playgroundRunBtn.addEventListener('click', () => {
      playFx('click');
      playgroundConsole.innerHTML = `<div class="console-line info">⚡ Handshaking with Haash Autonomous Edge Cluster (iad1)...</div>`;

      setTimeout(() => {
        playgroundConsole.innerHTML += `<div class="console-line">✔ Connecting to vector memory RAG index (1,420 chunks loaded)... [12ms]</div>`;
        playFx('slider');
      }, 350);

      setTimeout(() => {
        playgroundConsole.innerHTML += `<div class="console-line">✔ Streaming neural voice synthesizer (48kHz, Opus format)... [Ready]</div>`;
        playFx('slider');
      }, 700);

      setTimeout(() => {
        playgroundConsole.innerHTML += `<div class="console-line" style="color: #10B981; font-weight: 600;">✔ Autonomous Agent online. Latency: 138ms | Status: 200 OK LIVE.</div>`;
        playFx('success');
        showToast('Autonomous Agent simulation executed successfully!');
      }, 1100);
    });
  }

  // ==========================================================================
  // 8. Strategy Session Booking Modal
  // ==========================================================================
  const strategyBackdrop = document.getElementById('strategyModalBackdrop');
  const strategyCloseBtn = document.getElementById('strategyModalClose');
  const strategyForm = document.getElementById('strategyModalForm');

  const openStrategyModal = () => {
    if (!strategyBackdrop) return;
    strategyBackdrop.classList.add('is-open');
    playFx('click');
    const firstInput = strategyBackdrop.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  };
  window.haashOpenStrategyModal = openStrategyModal;

  const closeStrategyModal = () => {
    if (!strategyBackdrop) return;
    strategyBackdrop.classList.remove('is-open');
  };

  document.querySelectorAll('[data-open-strategy-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openStrategyModal();
    });
  });

  if (strategyCloseBtn) {
    strategyCloseBtn.addEventListener('click', closeStrategyModal);
  }

  if (strategyBackdrop) {
    strategyBackdrop.addEventListener('click', (e) => {
      if (e.target === strategyBackdrop) closeStrategyModal();
    });
  }

  if (strategyForm) {
    strategyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = strategyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner"></span> <span>Booking Session...</span>`;
      }

      const payload = {
        name: strategyForm.querySelector('[name="name"]')?.value || '',
        email: strategyForm.querySelector('[name="email"]')?.value || '',
        phone: strategyForm.querySelector('[name="phone"]')?.value || '',
        company: strategyForm.querySelector('[name="company"]')?.value || '',
        service: '15-Minute Strategy Consultation',
        message: `Preferred Time/Focus: ${strategyForm.querySelector('[name="timeSlot"]')?.value || 'Not specified'}. Details: ${strategyForm.querySelector('[name="details"]')?.value || 'N/A'}`
      };

      try {
        const isFileProtocol = window.location.protocol === 'file:';
        const apiEndpoint = isFileProtocol 
          ? 'http://localhost:3000/api/contact' 
          : '/api/contact';

        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
          playFx('success');
          showToast('Strategy consultation requested! We will confirm your slot shortly.');
          strategyForm.reset();
          closeStrategyModal();
        } else {
          showToast(data.error || 'Failed to submit booking. Please try again.');
        }
      } catch (err) {
        showToast('Network error. Direct email: Suhaibahmed099@gmail.com | WhatsApp: +92 342 3951603');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // ==========================================================================
  // 9. Interactive Split Comparison Slider (UI/UX Stage)
  // ==========================================================================
  const splitContainer = document.getElementById('splitCompare');
  const splitHandle = document.getElementById('splitHandle');
  const highfiLayer = document.getElementById('highfiLayer');

  if (splitContainer && splitHandle && highfiLayer) {
    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = splitContainer.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const percentage = pos * 100;

      splitHandle.style.left = `${percentage}%`;
      highfiLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    splitHandle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });

    splitHandle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) setPosition(e.touches[0].clientX);
    });

    splitContainer.addEventListener('click', (e) => {
      if (e.target !== splitHandle && !splitHandle.contains(e.target)) {
        setPosition(e.clientX);
      }
    });
  }

  // ==========================================================================
  // 10. Sticky Header Scroll Effect
  // ==========================================================================
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ==========================================================================
  // 11. Dynamic Copyright Year
  // ==========================================================================
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 12. Smooth Scrolling for Internal Hash Links
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 13. WhatsApp Click-to-Chat Configuration
  // ==========================================================================
  const whatsappButtons = document.querySelectorAll('.js-whatsapp-link');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const number = btn.getAttribute('data-phone') || '923423951603';
      const defaultMsg = encodeURIComponent("Hello Hassh Corporation, I'm interested in learning more about your AI automation and engineering solutions.");
      const url = `https://wa.me/${number}?text=${defaultMsg}`;
      btn.setAttribute('href', url);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });
  });

  // ==========================================================================
  // 14. FAQ Accordion Logic
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const fHeader = item.querySelector('.faq-header');
    if (fHeader) {
      fHeader.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('is-open');
        });
        item.classList.toggle('is-open', !isOpen);
        fHeader.setAttribute('aria-expanded', !isOpen);
        playFx('click');
      });
    }
  });

  // ==========================================================================
  // 15. Cyber Bento Grid Interactive Micro-Widgets
  // ==========================================================================
  // A. NLU Prompt Simulator Chips
  const bentoChips = document.querySelectorAll('.bento-prompt-chip');
  const bentoUserMsg = document.getElementById('bentoUserMsg');
  const bentoBotMsg = document.getElementById('bentoBotMsg');
  const bentoConfidence = document.getElementById('bentoConfidence');

  const bentoResponses = {
    'Schedule Consultation': {
      user: 'Book a 15-min strategy session for next Tuesday at 2 PM EST.',
      bot: 'Calendar slot reserved with Haash Executive Engineering. Pre-brief doc generated and synced to CRM.',
      conf: '99.9% NLU Match • 118ms Latency'
    },
    'Lead Qualification': {
      user: 'We have 8,000 monthly inbound calls requiring automated triage.',
      bot: 'Qualified: Enterprise Tier. Estimated 68% staff time recovered with automated WebRTC SIP dispatch.',
      conf: '99.4% Intent Match • 94ms Latency'
    },
    'Custom API Hook': {
      user: 'Can we stream real-time conversational tokens into our Postgres DB?',
      bot: 'Yes. Webhook payload configured with HMAC SHA-256 signatures and Kafka buffer stream.',
      conf: '100% Schema Match • 62ms Latency'
    }
  };

  bentoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptKey = chip.textContent.trim();
      const data = bentoResponses[promptKey];
      if (!data || !bentoUserMsg || !bentoBotMsg) return;

      playFx('click');
      bentoChips.forEach(c => c.style.borderColor = '');
      chip.style.borderColor = 'var(--accent-cyan)';

      bentoUserMsg.textContent = data.user;
      bentoBotMsg.textContent = 'Generating autonomous response...';
      if (bentoConfidence) bentoConfidence.textContent = 'Processing neural tokens...';

      setTimeout(() => {
        bentoBotMsg.textContent = data.bot;
        if (bentoConfidence) bentoConfidence.textContent = data.conf;
        playFx('success');
      }, 350);
    });
  });

  // B. Telephony Waveform & Call Simulator
  const bentoCallTrigger = document.getElementById('bentoCallTrigger');
  const bentoCallStatus = document.getElementById('bentoCallStatus');
  let bentoCallActive = false;

  if (bentoCallTrigger && bentoCallStatus) {
    bentoCallTrigger.addEventListener('click', () => {
      bentoCallActive = !bentoCallActive;
      playFx('click');
      if (bentoCallActive) {
        bentoCallStatus.textContent = 'ACTIVE CALL // 00:08 (REC)';
        bentoCallStatus.style.color = '#10B981';
        bentoCallStatus.style.background = 'rgba(16, 185, 129, 0.18)';
        showToast('AI Telephony line connected: 68ms Latency');
      } else {
        bentoCallStatus.textContent = 'STANDBY // READY';
        bentoCallStatus.style.color = 'var(--accent-cyan)';
        bentoCallStatus.style.background = 'rgba(6, 182, 212, 0.12)';
        showToast('Call ended. Session log synced.');
      }
    });
  }

  // C. UI/UX Token Swatch Color Picker
  const bentoSwatches = document.querySelectorAll('.bento-swatch');
  const bentoTokenPreview = document.getElementById('bentoTokenPreview');
  const bentoContrastScore = document.getElementById('bentoContrastScore');

  bentoSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      const name = swatch.getAttribute('data-name') || 'Accent';
      if (bentoTokenPreview) {
        bentoTokenPreview.style.borderColor = color;
        bentoTokenPreview.style.boxShadow = `0 0 20px ${color}33`;
      }
      if (bentoContrastScore) {
        bentoContrastScore.textContent = `WCAG AAA • ${name} Active`;
        bentoContrastScore.style.borderColor = color;
      }
      playFx('click');
      showToast(`Design System Token: ${name}`);
    });
  });
});
