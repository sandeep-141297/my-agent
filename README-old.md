# 🤖 AI Agent

<div align="center">

### A Conversational AI Agent Powered by Groq & Flask

Build intelligent conversations using **Llama 3.3 70B** with a clean web-based chat interface.

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge\&logo=python)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black?style=for-the-badge\&logo=flask)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# ✨ Features

✅ Beautiful Chat UI in Browser
✅ Powered by **Llama 3.3 70B** via Groq API
✅ Conversation Memory Support
✅ REST API Backend with Flask
✅ Fast AI Responses
✅ Easy Setup & Deployment

---

# 🛠️ Tech Stack

| Technology    | Usage                |
| ------------- | -------------------- |
| Python        | Backend Programming  |
| Flask         | Web Framework        |
| Groq API      | AI Model Integration |
| Llama 3.3 70B | Large Language Model |
| HTML/CSS/JS   | Frontend UI          |

---

# 📂 Project Structure

```bash
My-Agent/
│
├── static/            # CSS, JS, Images
├── templates/         # HTML Templates
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

## 4️⃣ Create `.env` File

Create a `.env` file in the root folder and add:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

# ▶️ Run the Application

### Note: Ensure to activate the virtual environment first before running any Python file.

```bash
python server.py
```

---

# 🌐 Open in Browser

```bash
http://localhost:5000
```

---

# 📸 Application Preview

```text
+-----------------------------------+
|         AI Agent Chat UI          |
+-----------------------------------+
| User: Hello                       |
| AI: Hi! How can I help you today? |
|                                   |
+-----------------------------------+
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

# 📦 Requirements

Example dependencies:

```txt
Flask
python-dotenv
groq
```

---

# 🧠 Powered By

* Groq API
* Llama 3.3 70B
* Flask Framework

---

# 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ If you like this project, give it a star on GitHub ⭐

</div>

 
