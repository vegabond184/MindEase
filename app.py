#importing lib
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_cors import CORS
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from uuid import uuid4

# ------------------ LLM ------------------ #
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation"
)
model = ChatHuggingFace(llm=llm)

who_are_you = "you are an excellent psychologist your name is Riya, you are from India, and the length of your reply is according to the query."

who_are_you = """

You are MindEase, a supportive and non-judgmental digital mental health companion. 
Your goals are:
1. Listen empathetically to users and let them express themselves without judgment.  
2. Provide general coping strategies for stress, anxiety, or depression.  
3. Offer short self-help activities (like breathing exercises, journaling, grounding techniques).  
4. Guide users to professional resources if their condition seems severe.  
5. Always prioritize privacy and consent before collecting or analyzing user input.  

Rules:
- You are NOT a medical professional. Do not diagnose or prescribe medication.  
- If the user expresses thoughts of self-harm or suicide, immediately respond with:  
  "I'm really concerned about your safety. You're not alone in this. Please reach out to a trusted friend, family member, or counselor right now. If you are in immediate danger, please call your local emergency number. In India, you can contact the AASRA helpline at +91-22-27546669."  
- Keep the conversation friendly, simple, and supportive.  
- Ask users for consent before starting any mental health check (e.g., PHQ-9 for depression or GAD-7 for anxiety).  
- keep the chat intactive,professional
- don't ask a load of questions simultaneously,keep reply short if possible.

Workflow:
- Step 1: Greet the user warmly and explain what you can help with.  
- Step 2: Ask for consent before starting a mental health screening.  
- Step 3: If consent given, ask screening questions one by one (PHQ-9 for depression or GAD-7 for anxiety).  
- Step 4: At the end, summarize results in plain language (mild, moderate, severe stress/anxiety/depression).  
- Step 5: Suggest healthy coping strategies and direct them to counselors or helplines if needed.  

Tone:
- Empathetic, respectful, non-judgmental.  
- Encouraging but never forceful.-



"""



# ------------------ Flask ------------------ #
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.secret_key = "hellomyanmeisprateek"
CORS(app)

# ------------------ In-memory storage ------------------ #
user_chats = {}      # uid -> list of {"user": "...", "ai": "..."}
user_messages = {}   # uid -> [SystemMessage, HumanMessage, AIMessage]


# Ensure each visitor has a unique session ID
@app.before_request
def ensure_session():
    if "uid" not in session:
        session["uid"] = str(uuid4())

@app.route("/")
def landing():
    return render_template("home.html")
# ------------------ AUTH ------------------ #
@app.route("/login/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["Email"]
        password = request.form["password"]

        if email == "prateek" and password == "hello":
            session["email"] = email
            session["password"] = password

            uid = session["uid"]
            # Reset chat for new login
            user_messages[uid] = [SystemMessage(content=who_are_you)]
            user_chats[uid] = []

            return redirect(url_for("home"))

        elif email == "" or password == "":
            return render_template("login.html")

        else:
            return render_template("login.html", error="Wrong Email or Password")

    return render_template("login.html")
#---------------------Auth----------------------------------------------------------



@app.route("/home/")
def home():
    if not session.get("email"):
        return redirect("/login")
    email = session.get("email")
    return f"Welcome {email}!"


@app.route("/signup/", methods=["GET", "POST"])
def signup():
    return "signup"


@app.route("/anonymous/")
def anonymous():
    return "you are anonymous user"


# ------------------ CHAT ------------------ #
@app.route("/chat/")
def chat():
    uid = session["uid"]
    history = user_chats.get(uid, [])
    return render_template("chatui.html", history=history)


@app.route("/chatback", methods=["POST"])
def chat_backend():
    uid = session["uid"]

    # Ensure user data is initialized
    if uid not in user_messages:
        user_messages[uid] = [SystemMessage(content=who_are_you)]
    if uid not in user_chats:
        user_chats[uid] = []

    data = request.get_json(force=True)
    user_msg = data["message"]

    # Append user message
    msgs = user_messages[uid]
    msgs.append(HumanMessage(content=user_msg))

    # Call model
    result = model.invoke(msgs)
    msgs.append(AIMessage(content=result.content))
    ai_reply = result.content

    # Save history
    user_chats[uid].append({"user": user_msg, "ai": ai_reply})

    return jsonify({"user": user_msg, "ai": ai_reply})


@app.route('/about/')
def about():
    return render_template('about_us.html')


@app.route('/resources/')
def resources():
    return render_template('resources.html')

@app.route('/dashboard/')
def tracking():
    return render_template('dashboard.html')


@app.route('/community/')
def blog():
    return render_template('comunity.html')

@app.route('/self_help_guide/')
def self_help_guide():
    return render_template('self_help_guide.html')


@app.route('/support/')
def support():
    return render_template('support.html')

@app.route('/contact/')
def contect():
    return render_template('contact.html')

if __name__ == "__main__":
    app.run(debug=True)
