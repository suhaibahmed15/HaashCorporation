/**
 * Haash Corporation — Advanced Interactive Showcases & Synthesizers
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Audio Feedback Synthesizer (Native Web Audio API)
  // --------------------------------------------------------------------------
  const playSynthesizedChime = (frequency = 587.33, type = 'sine', duration = 0.12) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext muted or blocked by policy
    }
  };

  // --------------------------------------------------------------------------
  // 1. AI Chatbot Simulator (/services/ai-chatbot.html)
  // --------------------------------------------------------------------------
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSendBtn = document.getElementById('chatbotSendBtn');
  const promptChips = document.querySelectorAll('.prompt-chip');

  if (chatbotMessages && chatbotInput) {
    const responses = {
      lead: "Our AI Chatbots capture user intent in real-time, ask customized qualifying questions (such as operational goals, timeline, and company size), and instantly sync validated leads straight to your CRM or notify your team.",
      crm: "Yes, absolutely! We connect seamlessly with HubSpot, Salesforce, Notion, Zapier, Make, and custom REST APIs to keep all customer conversation records synchronized without manual data entry.",
      timeline: "A standard custom AI chatbot trained on your company knowledge base typically deploys within 2 to 3 weeks, including rigorous safety tuning, tone-of-voice alignment, and team handover.",
      architecture: "We engineer bespoke enterprise AI architectures tailored specifically around your infrastructure and operational workflows. Connect directly with our engineering team to review technical feasibility and deployment architecture!",
      security: "All conversation records and vector embeddings are encrypted in transit and at rest using AES-256 standards. We enforce strict Retrieval-Augmented Generation (RAG) constraints to prevent hallucinations."
    };

    const addMessage = (text, isUser = false) => {
      const row = document.createElement('div');
      row.className = `chat-bubble-row ${isUser ? 'user' : 'bot'}`;
      row.innerHTML = `
        <div class="chat-avatar ${isUser ? 'user-avatar' : 'bot-avatar'}">${isUser ? 'You' : 'AI'}</div>
        <div class="chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}">
          ${text}
        </div>
      `;
      chatbotMessages.appendChild(row);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      if (!isUser) {
        playSynthesizedChime(523.25, 'sine', 0.18);
      }
    };

    const showTyping = () => {
      const typingRow = document.createElement('div');
      typingRow.id = 'botTyping';
      typingRow.className = 'chat-bubble-row bot';
      typingRow.innerHTML = `
        <div class="chat-avatar bot-avatar">AI</div>
        <div class="chat-bubble bot-bubble chat-bubble-typing">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      chatbotMessages.appendChild(typingRow);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      return typingRow;
    };

    const handleBotReply = (userQuery) => {
      const typingEl = showTyping();
      setTimeout(() => {
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        const lower = userQuery.toLowerCase();
        let reply = "That is a great question. Haash Corporation builds tailored conversational solutions designed specifically for your operational goals. Contact our team to explore a custom proof-of-concept!";
        if (lower.includes('lead') || lower.includes('qualif')) reply = responses.lead;
        else if (lower.includes('crm') || lower.includes('integrat') || lower.includes('hubspot')) reply = responses.crm;
        else if (lower.includes('time') || lower.includes('long') || lower.includes('launch') || lower.includes('deploy')) reply = responses.timeline;
        else if (lower.includes('arch') || lower.includes('stack') || lower.includes('custom') || lower.includes('tech')) reply = responses.architecture;
        else if (lower.includes('secur') || lower.includes('privacy') || lower.includes('data')) reply = responses.security;

        addMessage(reply, false);
      }, 700);
    };

    const submitUserMessage = () => {
      const val = chatbotInput.value.trim();
      if (!val) return;
      playSynthesizedChime(659.25, 'triangle', 0.08);
      addMessage(val, true);
      chatbotInput.value = '';
      handleBotReply(val);
    };

    if (chatbotSendBtn) {
      chatbotSendBtn.addEventListener('click', submitUserMessage);
    }
    chatbotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitUserMessage();
      }
    });

    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query') || chip.textContent.trim();
        playSynthesizedChime(659.25, 'triangle', 0.08);
        addMessage(query, true);
        handleBotReply(query);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Website Viewport Switcher with Dynamic Resolution Readout
  // --------------------------------------------------------------------------
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  const previewWindow = document.getElementById('previewBrowserWindow');
  const resolutionPill = document.getElementById('viewportResolutionPill');

  const resolutions = {
    desktop: '1440 × 900 (Desktop Ultra-Wide)',
    tablet: '768 × 1024 (Tablet Fluid)',
    mobile: '375 × 812 (Mobile Ergonomic)'
  };

  if (viewportBtns.length > 0 && previewWindow) {
    viewportBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewportBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode'); // 'desktop', 'tablet', 'mobile'
        previewWindow.className = `preview-browser-window mode-${mode}`;
        if (resolutionPill && resolutions[mode]) {
          resolutionPill.textContent = resolutions[mode];
        }
        playSynthesizedChime(440, 'sine', 0.08);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. UI/UX Design Stage Switcher
  // --------------------------------------------------------------------------
  const stageTabs = document.querySelectorAll('.design-stage-tab');
  const stagePanels = document.querySelectorAll('.design-stage-panel');

  if (stageTabs.length > 0 && stagePanels.length > 0) {
    stageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        stageTabs.forEach(t => t.classList.remove('active'));
        stagePanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
          activePanel.classList.add('active');
        }
        playSynthesizedChime(520, 'sine', 0.08);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. AI Call Receptionist Waveform & Real-Time Voice Simulator
  // --------------------------------------------------------------------------
  const voiceContainer = document.getElementById('voiceSimulator');
  const togglePlayCallBtn = document.getElementById('togglePlayCallBtn');
  const callStatusText = document.getElementById('callStatusText');

  if (voiceContainer && togglePlayCallBtn) {
    let isPlaying = false;
    let audioTimer;

    togglePlayCallBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        voiceContainer.classList.add('is-playing');
        togglePlayCallBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <span>Pause Simulation</span>
        `;
        if (callStatusText) callStatusText.textContent = 'Voice Simulation Active — Call Connected (00:24)';

        // Play synthetic dialing and connected tone
        playSynthesizedChime(440, 'sine', 0.25);
        setTimeout(() => playSynthesizedChime(880, 'sine', 0.2), 300);
      } else {
        voiceContainer.classList.remove('is-playing');
        togglePlayCallBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Play Voice Simulation</span>
        `;
        if (callStatusText) callStatusText.textContent = 'Voice Simulation Paused';
        playSynthesizedChime(350, 'sine', 0.15);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Portfolio Filtering (/work.html)
  // --------------------------------------------------------------------------
  const portfolioFilterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-card-item');

  if (portfolioFilterBtns.length > 0 && projectCards.length > 0) {
    portfolioFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        portfolioFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          const categories = category.split(/\s+/);
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
        playSynthesizedChime(480, 'sine', 0.06);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Insights Search & Filtering (/insights.html)
  // --------------------------------------------------------------------------
  const insightSearch = document.getElementById('insightSearchInput');
  const insightFilterBtns = document.querySelectorAll('.insight-filter-btn');
  const articleCards = document.querySelectorAll('.insight-card-item');

  if (articleCards.length > 0) {
    const filterArticles = () => {
      const query = insightSearch ? insightSearch.value.toLowerCase().trim() : '';
      const activeBtn = document.querySelector('.insight-filter-btn.active');
      const activeCat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

      articleCards.forEach(card => {
        const title = (card.querySelector('.insight-card-title')?.textContent || '').toLowerCase();
        const snippet = (card.querySelector('.insight-card-desc')?.textContent || '').toLowerCase();
        const category = card.getAttribute('data-category') || '';

        const matchesQuery = !query || title.includes(query) || snippet.includes(query);
        const matchesCategory = activeCat === 'all' || category === activeCat;

        if (matchesQuery && matchesCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    };

    if (insightSearch) {
      insightSearch.addEventListener('input', filterArticles);
    }

    if (insightFilterBtns.length > 0) {
      insightFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          insightFilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filterArticles();
          playSynthesizedChime(500, 'sine', 0.06);
        });
      });
    }
  }
});
