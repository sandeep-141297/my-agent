
  const chat = document.getElementById('chat');
  const input = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  let isLoading = false;

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  });

  // Enter to send
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function removeWelcome() {
    const welcome = document.getElementById('welcome');
    if (welcome) welcome.remove();
  }

  function addMessage(text, role) {
    removeWelcome();
    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${role}`;
    avatar.textContent = role === 'ai' ? '⚡' : 'U';

    const bubble = document.createElement('div');
    bubble.className = `bubble ${role}`;
    bubble.textContent = text;

    row.appendChild(avatar);
    row.appendChild(bubble);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
    return bubble;
  }

  function addTyping() {
    removeWelcome();
    const row = document.createElement('div');
    row.className = 'message-row ai';
    row.id = 'typing-row';

    const avatar = document.createElement('div');
    avatar.className = 'avatar ai';
    avatar.textContent = '⚡';

    const bubble = document.createElement('div');
    bubble.className = 'bubble ai typing-bubble';
    bubble.innerHTML = '<span></span><span></span><span></span>';

    row.appendChild(avatar);
    row.appendChild(bubble);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typing-row');
    if (t) t.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    isLoading = true;
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';

    addMessage(text, 'user');
    addTyping();

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      removeTyping();
      addMessage(data.reply, 'ai');
    } catch (err) {
      removeTyping();
      addMessage('⚠️ Cannot connect to server. Make sure server.py is running on port 5000.', 'ai');
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  async function clearChat() {
    await fetch('http://localhost:5000/reset', { method: 'POST' }).catch(() => {});
    chat.innerHTML = '';
    const welcome = document.createElement('div');
    welcome.className = 'welcome';
    welcome.id = 'welcome';
    welcome.innerHTML = `
      <div class="welcome-icon">🤖</div>
      <h2>Your AI Agent</h2>
      <p>Powered by Llama 3.3 70B running on Groq. Ask me anything.</p>
      <div class="suggestions">
        <div class="suggestion" onclick="sendSuggestion(this)">What can you do?</div>
        <div class="suggestion" onclick="sendSuggestion(this)">Write a Python function</div>
        <div class="suggestion" onclick="sendSuggestion(this)">Explain AI agents</div>
        <div class="suggestion" onclick="sendSuggestion(this)">Tell me a joke</div>
      </div>`;
    chat.appendChild(welcome);
  }

  function sendSuggestion(el) {
    input.value = el.textContent;
    sendMessage();
  }
