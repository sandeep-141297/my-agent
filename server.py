from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import os, json, datetime, requests

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

conversation_history = []   # chat tab
agent_history = []          # agent tab

# ─────────────────────────────────────────
# TOOLS — actual implementations
# ─────────────────────────────────────────

def calculator(expression: str) -> str:
    try:
        result = eval(expression, {"__builtins__": {}})
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"

def get_datetime() -> str:
    now = datetime.datetime.now()
    return f"Current date and time: {now.strftime('%A, %d %B %Y %I:%M %p')}"

def read_file(filename: str) -> str:
    try:
        filepath = os.path.join("agent_files", filename)
        with open(filepath, "r") as f:
            return f.read()
    except FileNotFoundError:
        return f"File '{filename}' not found."
    except Exception as e:
        return f"Error reading file: {str(e)}"

def write_file(filename: str, content: str) -> str:
    try:
        os.makedirs("agent_files", exist_ok=True)
        filepath = os.path.join("agent_files", filename)
        with open(filepath, "w") as f:
            f.write(content)
        return f"File '{filename}' saved successfully."
    except Exception as e:
        return f"Error writing file: {str(e)}"

# FIX 1 — replaced Serper with free DuckDuckGo (no API key needed)
def web_search(query: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        url = f"https://html.duckduckgo.com/html/?q={requests.utils.quote(query)}"
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.select(".result__body")[:3]
        if not results:
            return "No results found."
        output = ""
        for r in results:
            title = r.select_one(".result__title")
            snippet = r.select_one(".result__snippet")
            if title and snippet:
                output += f"- {title.get_text().strip()}\n  {snippet.get_text().strip()}\n\n"
        return output if output else "No results found."
    except Exception as e:
        return f"Search error: {str(e)}"

# ─────────────────────────────────────────
# TOOL DEFINITIONS — sent to the LLM
# ─────────────────────────────────────────

tools = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Evaluate a math expression. Use for any calculations.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Math expression to evaluate e.g. '23 * 45 + 10'"
                    }
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_datetime",
            "description": "Get the current date and time.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read contents of a file saved by the agent.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Name of the file to read e.g. 'notes.txt'"
                    }
                },
                "required": ["filename"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Write or save content to a file.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Name of the file e.g. 'notes.txt'"
                    },
                    "content": {
                        "type": "string",
                        "description": "Content to write into the file"
                    }
                },
                "required": ["filename", "content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "web_search",
            # FIX 2 — improved description so LLM picks it correctly
            "description": "Search the web for current information, news, facts, or any topic. Use this when user asks about recent events or anything that needs up to date information.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query string e.g. 'latest AI news'"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

# ─────────────────────────────────────────
# TOOL EXECUTOR
# ─────────────────────────────────────────

def execute_tool(name, args):
    print(f"[TOOL CALLED] {name} → {args}")
    if name == "calculator":
        return calculator(args.get("expression", ""))
    elif name == "get_datetime":
        return get_datetime()
    elif name == "read_file":
        return read_file(args.get("filename", ""))
    elif name == "write_file":
        return write_file(args.get("filename", ""), args.get("content", ""))
    elif name == "web_search":
        return web_search(args.get("query", ""))
    return "Unknown tool."

# ─────────────────────────────────────────
# AGENT LOOP
# ─────────────────────────────────────────

def run_agent(user_message):
    # FIX 3 — was using conversation_history by mistake, now uses agent_history
    agent_history.append({"role": "user", "content": user_message})

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful AI agent. You have access to tools: "
                "calculator (for math), get_datetime (for current date/time), "
                "read_file (to read files), write_file (to save files), "
                "web_search (to search the internet for news or facts). "
                "Always call the right tool with correct arguments instead of guessing. "
                "Think step by step."
            )
        }
    ] + agent_history

    tools_used = []

    # Agent loop — keeps going until no more tool calls
    while True:
        try:
            response = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=messages,
                tools=tools,
                tool_choice="auto"
            )
        except Exception as e:
            return {"reply": f"Agent error: {str(e)}", "tools_used": tools_used}

        msg = response.choices[0].message
        finish_reason = response.choices[0].finish_reason

        # No tool call — final answer
        if finish_reason == "stop" or not msg.tool_calls:
            final_reply = msg.content
            agent_history.append({"role": "assistant", "content": final_reply})
            return {"reply": final_reply, "tools_used": tools_used}

        # Tool calls — execute each one
        messages.append(msg)

        for tool_call in msg.tool_calls:
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            result = execute_tool(name, args)
            tools_used.append({"tool": name, "args": args, "result": result})

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })

# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────

@app.route("/")
def home():
    return send_file("templates/index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    conversation_history.append({"role": "user", "content": user_message})
    messages = [{"role": "system", "content": "You are a helpful AI assistant."}] + conversation_history
    response = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=messages)
    # response = client.chat.completions.create(model="llama3-groq-70b-8192-tool-use-preview", messages=messages)
    reply = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": reply})
    return jsonify({"reply": reply})

@app.route("/agent", methods=["POST"])
def agent():
    data = request.json
    user_message = data.get("message", "")
    result = run_agent(user_message)
    return jsonify(result)

@app.route("/reset", methods=["POST"])
def reset():
    conversation_history.clear()
    agent_history.clear()
    return jsonify({"status": "cleared"})

if __name__ == "__main__":
    print("AI Agent running → http://localhost:5000")
    app.run(debug=True, port=5000)