/**
 * Haash Corporation — Interactive AI Concierge Chatbot
 * Features intelligent multi-turn conversation and automated contact redirection
 * after 4-5 customer interactions.
 */

(function () {
  let userMessageCount = parseInt(sessionStorage.getItem('haash_chat_count') || '0', 10);
  let isRedirecting = false;
  let isOpen = false;

  // Knowledge Base Responses
  const KNOWLEDGE_BASE = [
    {
      keywords: ['crm', 'pipeline', 'customer relationship', 'sales automation', 'lead tracking'],
      response: "At Haash Corporation, our **CRM Systems & Pipeline Automation** discipline builds custom client lifecycle databases, multi-channel lead routing (WhatsApp + Email + Web), and automated deal stages designed around your unique workflow."
    },
    {
      keywords: ['graphic', 'design', 'branding', 'logo', 'visual', 'identity', 'banner', 'creative'],
      response: "Our **Graphic Designing & Brand Identity** team crafts iconic corporate visual identities, scalable vector iconography, pitch decks, and high-impact marketing creatives engineered to establish instant market authority."
    },
    {
      keywords: ['chatbot', 'bot', 'chat', 'assistant', 'nlu', 'conversational', 'ai agent'],
      response: "We engineer production-ready **AI Chatbots** with custom contextual memory, intelligent CRM routing, and 24/7 autonomous support capabilities across web, WhatsApp, and business channels."
    },
    {
      keywords: ['website', 'web dev', 'web development', 'frontend', 'speed', 'seo', 'react', 'next'],
      response: "Our **Website Development** solutions feature high-performance architectures, Core Web Vitals optimization, responsive luxury obsidian aesthetics, and guaranteed sub-second load times."
    },
    {
      keywords: ['voice', 'call', 'receptionist', 'phone', 'telephony', 'booking', 'appointment'],
      response: "Our **AI Call Receptionist** autonomously answers inbound calls 24/7, handles caller qualification, and syncs appointment bookings directly to your Google or Outlook calendar."
    },
    {
      keywords: ['price', 'cost', 'quote', 'budget', 'rate', 'how much', 'pricing'],
      response: "All our engineering solutions are tailored to your exact scope and technical milestones. We provide fixed-scope proposals without hidden costs. Would you like a direct technical consultation?"
    },
    {
      keywords: ['whatsapp', 'contact', 'call', 'email', 'phone', 'reach', 'number', 'address', 'location'],
      response: "You can connect with us directly on **WhatsApp at +92 342 3951603** or via email at **hasshcorporation@gmail.com**. Our headquarters are in Karachi, Pakistan, serving clients worldwide."
    },
    {
      keywords: ['hello', 'hi', 'hey', 'start', 'greetings', 'who are you'],
      response: "Greetings! I am the Haash Corporation AI Concierge. I can assist you with our AI Chatbots, Custom Web Systems, CRM Engineering, UI/UX Design, or Graphic Designing."
    }
  ];

  const getBotResponse = (userInput) => {
    const clean = userInput.toLowerCase();
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(kw => clean.includes(kw))) {
        return item.response;
      }
    }
    return "Thank you for sharing that. At Haash Corporation, we specialize in high-impact AI automation, custom CRM systems, high-speed web development, and iconic visual design.";
  };

  const getContactUrl = () => {
    const isSubdir = window.location.pathname.includes('/services/');
    return (isSubdir ? '../contact.html' : 'contact.html') + '?source=ai_concierge';
  };

  // Build UI
  const initChatbotUI = () => {
    if (document.getElementById('haashChatLauncher')) return;

    // Determine asset path relative to current page
    const isSubdir = window.location.pathname.includes('/services/');
    const faviconPath = isSubdir ? '../assets/images/favicon.png' : 'assets/images/favicon.png';

    // 1. Create Floating Launcher
    const launcher = document.createElement('div');
    launcher.id = 'haashChatLauncher';
    launcher.className = 'haash-chat-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Chat with Haash AI Assistant');
    launcher.innerHTML = `
      <div class="chat-launcher-avatar">
        <img src="${faviconPath}" alt="Haash AI">
        <span class="chat-status-dot"></span>
      </div>
      <div class="chat-launcher-text">
        <span class="chat-launcher-title">Haash AI</span>
        <span class="chat-launcher-sub">Online • Inquire Now</span>
      </div>
    `;
    document.body.appendChild(launcher);

    // 2. Create Chat Window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'haashChatWindow';
    chatWindow.className = 'haash-chat-window';
    chatWindow.innerHTML = `
      <div class="chat-window-header">
        <div class="chat-header-profile">
          <div class="chat-header-avatar">
            <img src="${faviconPath}" alt="HC">
          </div>
          <div class="chat-header-info">
            <h4>Haash AI Concierge</h4>
            <span class="chat-header-status">
              <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span>
              Active • Intelligent Systems
            </span>
          </div>
        </div>
        <button type="button" id="closeChatBtn" class="chat-close-btn" aria-label="Close Chat">&times;</button>
      </div>

      <div class="chat-messages" id="chatMessages">
        <div class="chat-bubble chat-bubble-bot">
          Hello! 👋 Welcome to Haash Corporation. How can our engineering and design team assist your business today?
          <span class="chat-timestamp">Just now</span>
        </div>
      </div>

      <div class="chat-chips" id="chatChips">
        <button type="button" class="chat-chip" data-query="What services do you offer?">Services Overview</button>
        <button type="button" class="chat-chip" data-query="Tell me about your CRM Systems">CRM Systems</button>
        <button type="button" class="chat-chip" data-query="Graphic Designing services">Graphic Design</button>
        <button type="button" class="chat-chip" data-query="Chat on WhatsApp">WhatsApp Direct</button>
      </div>

      <form class="chat-input-bar" id="chatForm">
        <input type="text" id="chatInput" class="chat-input" placeholder="Type a message or inquiry..." autocomplete="off" required>
        <button type="submit" id="chatSendBtn" class="chat-send-btn" aria-label="Send message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    `;
    document.body.appendChild(chatWindow);

    attachEventListeners(launcher, chatWindow);
  };

  const attachEventListeners = (launcher, chatWindow) => {
    const closeBtn = document.getElementById('closeChatBtn');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const chatChips = document.getElementById('chatChips');

    const toggleChat = () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('is-open', isOpen);
      if (isOpen) {
        setTimeout(() => chatInput && chatInput.focus(), 300);
      }
    };

    launcher.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);

    // Chip Click Handlers
    if (chatChips) {
      chatChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chat-chip');
        if (chip) {
          const query = chip.getAttribute('data-query');
          if (query) sendMessage(query);
        }
      });
    }

    // Form Submit
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = (chatInput.value || '').trim();
        if (text) {
          sendMessage(text);
          chatInput.value = '';
        }
      });
    }
  };

  const appendBubble = (text, isUser = false) => {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`;
    bubble.innerHTML = `
      ${escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
      <span class="chat-timestamp">${timeStr}</span>
    `;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const showTypingIndicator = () => {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;

    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'chatTypingIndicator';
    typing.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  };

  const removeTypingIndicator = () => {
    const typing = document.getElementById('chatTypingIndicator');
    if (typing) typing.remove();
  };

  const escapeHtml = (str) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const triggerRedirect = () => {
    if (isRedirecting) return;
    isRedirecting = true;

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatChips = document.getElementById('chatChips');

    if (chatInput) {
      chatInput.disabled = true;
      chatInput.placeholder = 'Redirecting to project inquiry form...';
    }
    if (chatSendBtn) chatSendBtn.disabled = true;
    if (chatChips) chatChips.style.display = 'none';

    const targetUrl = getContactUrl();

    // Append redirect card
    const redirectCard = document.createElement('div');
    redirectCard.className = 'chat-redirect-card';
    redirectCard.innerHTML = `
      <p>🚀 Connecting you to our engineering lead...</p>
      <div id="redirectCountdown" style="font-size: 0.75rem; color: #E4E4E7; margin-bottom: 8px;">
        Redirecting in <strong>3</strong> seconds...
      </div>
      <a href="${targetUrl}" class="chat-redirect-btn">
        <span>Open Contact Page Now</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>
    `;
    chatMessages.appendChild(redirectCard);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let seconds = 3;
    const countdownEl = document.getElementById('redirectCountdown');
    const interval = setInterval(() => {
      seconds--;
      if (countdownEl && seconds > 0) {
        countdownEl.innerHTML = `Redirecting in <strong>${seconds}</strong> seconds...`;
      }
      if (seconds <= 0) {
        clearInterval(interval);
        window.location.href = targetUrl;
      }
    }, 1000);
  };

  const sendMessage = async (userText) => {
    if (isRedirecting) return;

    userMessageCount++;
    sessionStorage.setItem('haash_chat_count', String(userMessageCount));

    // Append user message
    appendBubble(userText, true);

    // Show bot typing
    const typing = showTypingIndicator();

    // Realistic bot delay
    setTimeout(() => {
      removeTypingIndicator();

      const botText = getBotResponse(userText);
      appendBubble(botText, false);

      // Check if limit reached (after 4-5 messages)
      if (userMessageCount >= 5) {
        setTimeout(() => {
          appendBubble("We would love to bring your vision to life! Let's connect you directly with our engineering team to discuss scope and timelines.", false);
          setTimeout(triggerRedirect, 800);
        }, 500);
      } else if (userMessageCount === 4) {
        setTimeout(() => {
          appendBubble("💡 *Quick note:* I can see you have specific goals in mind. After your next question, I'll take you directly to our Project Inquiry page to finalize your custom brief.", false);
        }, 600);
      }
    }, 600);
  };

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
  } else {
    initChatbotUI();
  }
})();
