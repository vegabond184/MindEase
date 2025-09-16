from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    # Dummy reply for demo
    reply = f"Flask says: You said '{user_message}'"
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(port=5000, debug=True)