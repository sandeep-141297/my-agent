from google import genai
from dotenv import load_dotenv
import os
load_dotenv()

"""
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Say hello!"
)

print(response.text)
"""

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("AI Agent ready! Type 'quit' to exit")

while True:
    user_input = input("You: ")
    
    if user_input == "quit":
        break
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user_input
    )
    
    print("AI:", response.text)