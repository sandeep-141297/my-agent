# 🤖 AI Agent

<div align="center">

### A Conversational AI Agent Powered by Groq & Flask

Build intelligent conversations using **Llama 3.3 70B** and **Llama 4 Scout 17B** with a modern web-based chat interface and real AI agent tool calling.

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge\&logo=python)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black?style=for-the-badge\&logo=flask)
![Groq](https://img.shields.io/badge/Groq-AI%20Inference-orange?style=for-the-badge)
![Llama%203.3%2070B](https://img.shields.io/badge/Llama%203.3%2070B-Chat%20Model-8b5cf6?style=for-the-badge)
![Llama%204%20Scout%2017B](https://img.shields.io/badge/Llama%204%20Scout%2017B-Agent%20Model-06b6d4?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# ✨ Features

✅ Beautiful Modern Chat UI  
✅ Separate **Chat** and **AI Agent** Modes  
✅ Powered by **Llama 3.3 70B** & **Llama 4 Scout 17B** via Groq API  
✅ Conversation Memory Support  
✅ REST API Backend with Flask  
✅ Fast AI Responses  
✅ Real AI Agent Tool Calling  
✅ Web Search Integration  
✅ File Read & Write Support  
✅ Calculator Tool Support  
✅ Date & Time Tool Support  
✅ Modern Responsive UI Design  
✅ Easy Setup & Deployment  

---

# 🛠️ Tech Stack

| Technology                                   | Usage                    |
| -------------------------------------------- | ------------------------ |
| Python                                       | Backend Programming      |
| Flask                                        | Web Framework            |
| Groq API                                     | AI Model Integration     |
| Llama 3.3 70B                                | Chat Assistant Model     |
| Llama 4 Scout 17B                            | AI Agent Tool-Use Model  |
| HTML/CSS/JavaScript                          | Frontend UI              |
| BeautifulSoup                                | Web Scraping             |
| DuckDuckGo                                   | Free Web Search          |

---

# 🧠 AI Agent Tools

The AI Agent can perform real actions using tools.

| Tool          | Description                          |
| ------------- | ------------------------------------ |
| Calculator    | Solve mathematical expressions       |
| Date & Time   | Get current date and time            |
| Write File    | Save notes or content into files     |
| Read File     | Read saved files                     |
| Web Search    | Search the internet for live results |

---

# 📂 Project Structure

```bash
My-Agent/
│
├── agent_files/       # Saved files by AI agent
├── static/            # CSS, JS, Images
│
├── templates/
│   └── index.html
│
├── server.py          # Flask Server
├── requirements.txt   # Python Dependencies
├── .env               # Environment Variables
└── README.md
```

---

# 🚀 Setup Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

cd YOUR_REPO_NAME
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 📦 Requirements

Example dependencies:

```txt
Flask
flask-cors
python-dotenv
groq
requests
beautifulsoup4
```

---

## 4️⃣ Create `.env` File

Create a `.env` file in the root folder and add:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

# ▶️ Run the Application

### Note:
Ensure the virtual environment is activated before running the server.

```bash
python server.py
```

---

# 🌐 Open in Browser

```bash
http://localhost:5000
```

---

# 💬 Application Modes

## 💬 Chat Mode

Standard AI chat experience powered by Groq.

Example:
- Ask coding questions
- Explain concepts
- Generate text
- General conversations

---

## 🤖 AI Agent Mode

AI agent with real tool usage.

Example Tasks:
- Calculate math problems
- Search latest news
- Save notes into files
- Read saved files
- Get current date & time

---

# 🔥 Tool Calling Flow

```text
User Request
      ↓
LLM Decides Required Tool
      ↓
Tool Executes in Python
      ↓
Result Sent Back to LLM
      ↓
Final AI Response
```

---

# 📸 Application Preview

```text
+------------------------------------------------+
|                My AI Agent                     |
+------------------------------------------------+
| 💬 Chat | 🤖 AI Agent                          |
+------------------------------------------------+
| User: Search latest AI news                    |
|                                                |
| 🔍 web_search                                  |
| AI: Here are the latest AI news updates...     |
+------------------------------------------------+
```

---

# 🔥 API Example

## Chat Endpoint

```http
POST /chat
```

### Request Body

```json
{
  "message": "Hello AI"
}
```

### Response

```json
{
  "reply": "Hello! How can I help you?"
}
```

---

# 🤖 Agent Endpoint

```http
POST /agent
```

### Request Body

```json
{
  "message": "Search latest AI news"
}
```

### Response

```json
{
  "reply": "Here are the latest AI news updates...",
  "tools_used": [
    {
      "tool": "web_search"
    }
  ]
}
```

---

# 🧪 Example AI Agent Commands

```text
What is 1234 * 5678?

What time is it?

Save a note: Buy groceries

Read file notes.txt

Search latest AI news
```

---

# ⚡ Supported Models

Current Model:

```python
meta-llama/llama-4-scout-17b-16e-instruct
```

Alternative:

```python
llama-3.3-70b-versatile
```

---

# 🔒 Environment Variables

| Variable      | Description       |
| ------------- | ----------------- |
| GROQ_API_KEY  | Your Groq API Key |

---

# 📦 Requirements

Example dependencies:

```txt
Flask
python-dotenv
groq
```

---

# 🧠 Powered By

- Groq API
- Meta Llama Models
- Flask Framework
- DuckDuckGo Search
- BeautifulSoup

---

# 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ If you like this project, give it a star on GitHub ⭐

</div>