from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

conversation_history = []

@app.route("/")
def home():
    return send_file("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    conversation_history.append({
        "role": "user",
        "content": user_message
    })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."}
        ] + conversation_history
    )

    ai_reply = response.choices[0].message.content

    conversation_history.append({
        "role": "assistant",
        "content": ai_reply
    })

    return jsonify({"reply": ai_reply})

@app.route("/reset", methods=["POST"])
def reset():
    conversation_history.clear()
    return jsonify({"status": "cleared"})

if __name__ == "__main__":
    print("Open this in your browser → http://localhost:5000")
    app.run(debug=True, port=5000)