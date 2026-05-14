
  const toolIcons = { calculator:'🧮', get_datetime:'🕐', web_search:'🔍', write_file:'💾', read_file:'📁'  };
  // const toolIcons = { calculator:'🧮', get_datetime:'🕐', write_file:'💾', web_search:'🔍' };
  const loading = { chat: false, agent: false };
  let activeTab = 'chat';

  // ── Tab switching ──
  function switchTab(tab, btn) {
    activeTab = tab;
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + tab).classList.add('active');
    btn.classList.add('active');

    if (tab === 'chat') {
      document.getElementById('header-title').textContent = 'My AI Chatbot';
      document.getElementById('header-sub').textContent = 'llama-3.3-70b · groq';
    } else {
      document.getElementById('header-title').textContent = 'AI Agent';
      document.getElementById('header-sub').textContent = 'llama 4 Scout 17B · groq · 4 tools';
    }

    // Focus input
    setTimeout(() => document.getElementById('input-' + tab).focus(), 50);
  }

  // ── Auto-resize textarea ──
  document.querySelectorAll('.chat-input').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.style.height = 'auto';
      inp.style.height = Math.min(inp.scrollHeight, 140) + 'px';
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const tab = inp.id.replace('input-', '');
        sendMessage(tab);
      }
    });
  });

  // ── Remove welcome ──
  function removeWelcome(tab) {
    const w = document.getElementById('welcome-' + tab);
    if (w) w.remove();
  }

  // ── Add message ──
  function addMessage(tab, text, role, toolsUsed = []) {
    removeWelcome(tab);
    const chat = document.getElementById('chat-' + tab);
    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${role}`;
    avatar.textContent = role === 'ai' ? '⚡' : 'U';

    const col = document.createElement('div');
    col.className = 'msg-col';

    // Tool badges (agent tab only)
    if (toolsUsed.length > 0) {
      const badges = document.createElement('div');
      badges.className = 'tools-used';
      toolsUsed.forEach(t => {
        const badge = document.createElement('div');
        badge.className = 'tool-badge';
        badge.textContent = `${toolIcons[t.tool] || '🔧'} ${t.tool}`;
        badges.appendChild(badge);
      });
      col.appendChild(badges);
    }

    const bubble = document.createElement('div');
    bubble.className = `bubble ${role}`;
    bubble.textContent = text;
    col.appendChild(bubble);

    row.appendChild(avatar);
    row.appendChild(col);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
  }

  // ── Typing indicator ──
  function addTyping(tab) {
    removeWelcome(tab);
    const chat = document.getElementById('chat-' + tab);
    const row = document.createElement('div');
    row.className = 'message-row ai';
    row.id = 'typing-' + tab;
    const avatar = document.createElement('div');
    avatar.className = 'avatar ai'; avatar.textContent = '⚡';
    const col = document.createElement('div'); col.className = 'msg-col';
    const bubble = document.createElement('div');
    bubble.className = 'bubble ai typing-bubble';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    col.appendChild(bubble); row.appendChild(avatar); row.appendChild(col);
    chat.appendChild(row); chat.scrollTop = chat.scrollHeight;
  }

  function removeTyping(tab) {
    const t = document.getElementById('typing-' + tab);
    if (t) t.remove();
  }

  // ── Send message ──
  async function sendMessage(tab) {
    if (loading[tab]) return;
    const input = document.getElementById('input-' + tab);
    const sendBtn = document.getElementById('send-' + tab);
    const text = input.value.trim();
    if (!text) return;

    loading[tab] = true;
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';

    addMessage(tab, text, 'user');
    addTyping(tab);

    const endpoint = tab === 'agent' ? '/agent' : '/chat';

    try {
      const res = await fetch('http://localhost:5000' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      removeTyping(tab);
      addMessage(tab, data.reply, 'ai', data.tools_used || []);
    } catch (err) {
      removeTyping(tab);
      addMessage(tab, '⚠️ Cannot connect to server. Make sure server.py is running on port 5000.', 'ai');
    }

    loading[tab] = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── Clear chat ──
  async function clearChat() {
    const tab = activeTab;
    await fetch('http://localhost:5000/reset', { method: 'POST' }).catch(() => {});
    const chat = document.getElementById('chat-' + tab);
    chat.innerHTML = '';

    const welcome = document.createElement('div');
    welcome.className = 'welcome';
    welcome.id = 'welcome-' + tab;

    if (tab === 'chat') {
      welcome.innerHTML = `
        <div class="welcome-icon">💬</div>
        <h2>My AI Chatbot</h2>
        <p>Powered by Llama 3.3 70B running on Groq. Ask me anything.</p>
        <div class="suggestions">
          <div class="suggestion" onclick="sendSuggestion(this,'chat')">What can you do?</div>
          <div class="suggestion" onclick="sendSuggestion(this,'chat')">Write a Python function</div>
          <div class="suggestion" onclick="sendSuggestion(this,'chat')">Explain AI agents</div>
          <div class="suggestion" onclick="sendSuggestion(this,'chat')">Tell me a joke</div>
        </div>`;
    } else {
      welcome.innerHTML = `
        <div class="welcome-icon">🤖</div>
        <h2>AI Agent — with Real Tools</h2>
        <p>Powered by Llama 4 Scout 17B running on Groq. This agent takes real actions using tools, not just chat.</p>
        <div class="tools-grid">
          <span class="tool-chip">🧮 calculator</span>
          <span class="tool-chip">🕐 date & time</span>
          <span class="tool-chip">🔍 web search</span>
          <span class="tool-chip">💾 write file</span>
          <span class="tool-chip">📁 read file</span>
        </div>
        <div class="suggestions">
          <div class="suggestion" onclick="sendSuggestion(this,'agent')">What is 1234 * 5678?</div>
          <div class="suggestion" onclick="sendSuggestion(this,'agent')">What time is it?</div>
          <div class="suggestion" onclick="sendSuggestion(this,'agent')">Search latest AI news</div>
          <div class="suggestion" onclick="sendSuggestion(this,'agent')">Save a note: Buy groceries</div>
          <div class="suggestion" onclick="sendSuggestion(this,'agent')">Read file - C:\my-agent\agent_files\notes.txt</div>
        </div>`;
    }
    chat.appendChild(welcome);
  }

  function sendSuggestion(el, tab) {
    document.getElementById('input-' + tab).value = el.textContent;
    sendMessage(tab);
  }
