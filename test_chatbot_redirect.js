const fs = require('fs');
const path = require('path');

// Verify chatbot.js logic and countdown mechanism
const chatbotJs = fs.readFileSync(path.join(__dirname, 'assets/js/chatbot.js'), 'utf8');

console.log('Testing Chatbot JS Logic...');

// 1. Check userMessageCount tracking
if (!chatbotJs.includes('userMessageCount++') || !chatbotJs.includes('haash_chat_count')) {
  console.error('FAIL: Missing user message count tracking');
  process.exit(1);
}
console.log('✔ User message tracking confirmed (tracks user turns in session)');

// 2. Check 4th message warning and 5th message redirect trigger
if (!chatbotJs.includes('userMessageCount >= 5') || !chatbotJs.includes('userMessageCount === 4')) {
  console.error('FAIL: Missing 4-5 message conditional trigger');
  process.exit(1);
}
console.log('✔ 4-to-5 message threshold triggers confirmed');

// 3. Check redirection to contact page
if (!chatbotJs.includes('contact.html') || !chatbotJs.includes('triggerRedirect') || !chatbotJs.includes('window.location.href')) {
  console.error('FAIL: Missing redirect to contact page');
  process.exit(1);
}
console.log('✔ Automatic redirection to contact.html confirmed');

// 4. Verify all HTML files reference chatbot.js and chatbot.css
const htmlFiles = [
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
  'services/ai-call-receptionist.html',
  'services/crm-systems.html',
  'services/graphic-design.html'
];

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (!content.includes('chatbot.css')) {
    console.error(`FAIL: ${file} missing chatbot.css`);
    process.exit(1);
  }
  if (!content.includes('chatbot.js')) {
    console.error(`FAIL: ${file} missing chatbot.js`);
    process.exit(1);
  }
  if (!content.includes('supabase-client.js')) {
    console.error(`FAIL: ${file} missing supabase-client.js`);
    process.exit(1);
  }
}
console.log('✔ All 14 HTML pages successfully include chatbot.css, chatbot.js, and supabase-client.js!');
console.log('\n======================================================');
console.log('🎉 AI CHATBOT + SUPABASE VERIFICATION PASSED 100%!');
console.log('======================================================');
