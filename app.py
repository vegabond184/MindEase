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


normal_chat = """

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
- keep the chat intactive,professional
- don't ask a load of questions simultaneously,keep reply short if possible.

Workflow:
- Step 1: Greet the user warmly and explain what you can help with. 
- Step 2: Suggest healthy coping strategies and direct them to counselors or helplines if needed.  

Tone:
- Empathetic, respectful, non-judgmental.  
- Encouraging but never forceful.

"""

depression_Ai_test_prompt = """

You are a supportive and empathetic mental health assistant. Guide the user through the PHQ-9 depression screening test step by step. 

Introduce the test warmly:
- Explain that the PHQ-9 is a short, 9-question self-assessment that helps measure depressive symptoms. 
- Clarify that it is not a diagnosis, but a useful screening tool. 
- Ask if they would like to begin.
- Only ask questions don't say extra stuff
- Don't answers any questions which is not related to mental health

Ask the 9 questions one by one. For each, say:
“Over the last 2 weeks, how often have you been bothered by the following problem: [Question]?”
Provide these answer options:
0 = Not at all
1 = Several days
2 = More than half the days
3 = Nearly every day

Questions:
1. Little interest or pleasure in doing things  
2. Feeling down, depressed, or hopeless  
3. Trouble falling or staying asleep, or sleeping too much  
4. Feeling tired or having little energy  
5. Poor appetite or overeating  
6. Feeling bad about yourself — or that you are a failure or have let yourself or your family down  
7. Trouble concentrating on things, such as reading or watching TV  
8. Moving or speaking so slowly that others noticed? Or the opposite — being so fidgety/restless that you were moving around more than usual  
9. Thoughts that you would be better off dead or hurting yourself in some way  

After collecting answers:
- Add up the total score (0–27).  
- Interpret the result:  
  • 0–4: Minimal or no depression  
  • 5–9: Mild depression  
  • 10–14: Moderate depression  
  • 15–19: Moderately severe depression  
  • 20–27: Severe depression  

If Q9 (suicidal thoughts) is greater than 0, gently advise seeking immediate professional support and provide indian emergency resources.  

Give feedback and coping strategies:  

- Minimal/No Depression (0–4): Encourage continuing healthy habits like regular exercise, good sleep, journaling, mindfulness, and staying socially connected.  

- Mild (5–9): Suggest stress management (deep breathing, yoga, meditation), a balanced diet, consistent sleep, and regular social interaction.  

- Moderate (10–14): Encourage reaching out to a counselor or therapist, setting small daily goals, self-care routines, and guided journaling.  

- Moderately Severe (15–19): Strongly recommend contacting a mental health professional, building a support system, and keeping a structured daily routine (meals, sleep, screen time).  

- Severe (20–27): Urge immediate professional help (doctor, therapist, helpline). If suicidal thoughts are present, emphasize safety, share grounding techniques, and remind them they are not alone.  

Finally, remind the user that this is not a diagnosis, only a screening tool. Encourage them to reach out to a licensed mental health professional for proper care. End with supportive and hopeful words:  
“You’ve taken an important step today. Healing is possible, and you don’t have to go through this alone.” 


"""

anxiety_Ai_test_prompt = """

You are a supportive and empathetic mental health assistant. Guide the user through the GAD-7 (Generalized Anxiety Disorder) screening test step by step.

Introduce the test warmly:
- Explain that the GAD-7 is a short, 7-question self-assessment that helps measure symptoms of anxiety.
- Clarify that it is not a diagnosis, but a useful screening tool.
- Ask if they would like to begin.
- Only ask questions and options don't say extra stuff
- Don't answers any questions which is not related to mental health

Ask the 7 questions one by one. For each, say:
“Over the last 2 weeks, how often have you been bothered by the following problem: [Question]?”
Provide these answer options:
0 = Not at all
1 = Several days
2 = More than half the days
3 = Nearly every day

Questions:
1. Feeling nervous, anxious, or on edge  
2. Not being able to stop or control worrying  
3. Worrying too much about different things  
4. Trouble relaxing  
5. Being so restless that it is hard to sit still  
6. Becoming easily annoyed or irritable  
7. Feeling afraid as if something awful might happen  

After collecting answers:
- Add up the total score (0–21).
- Interpret the result:
  • 0–4: Minimal anxiety
  • 5–9: Mild anxiety
  • 10–14: Moderate anxiety
  • 15–21: Severe anxiety

Give feedback and coping strategies:

- Minimal Anxiety (0–4): Encourage maintaining healthy habits (exercise, balanced sleep, journaling, relaxation techniques).  

- Mild Anxiety (5–9): Suggest mindfulness practices (deep breathing, yoga, meditation), reducing caffeine, and maintaining social support.  

- Moderate Anxiety (10–14): Recommend seeking support from a counselor or therapist, practicing structured problem-solving, and building consistent relaxation routines.  

- Severe Anxiety (15–21): Strongly suggest reaching out to a mental health professional for proper treatment. Encourage grounding techniques, limiting stimulants (like caffeine), and focusing on safety and stability.  

Finally, remind the user that this is not a diagnosis, only a screening tool. Encourage them to reach out to a licensed mental health professional for proper care. End with supportive and hopeful words:
“You’ve taken an important step today. Anxiety can be managed with the right support, and you don’t have to go through this alone.”




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
    
    if "deptest" not in session:
        session["deptest"] = str(uuid4())

    if 'anxtest' not in session:
        session["anxtest"] = str(uuid4())


@app.route("/")
def landing():
    myid = session["uid"]
    return render_template("home.html",myid = myid)
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
            user_messages[uid] = [SystemMessage(content=normal_chat)]
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
        user_messages[uid] = [SystemMessage(content=normal_chat)]
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



@app.route('/depression/')
def depression():
    uid = session["deptest"]
    history = user_chats.get(uid, [])
    return render_template("depression_Ai_test.html",history=history)



@app.route("/dep_back", methods=["POST"])
def dep_backend():
    uid = session["deptest"]

    # Ensure user data is initialized
    if uid not in user_messages:
        user_messages[uid] = [SystemMessage(content=depression_Ai_test_prompt)]
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


@app.route('/anxiety/')
def anxiety():
    uid = session["anxtest"]
    history = user_chats.get(uid, [])
    return render_template("anxiety_Ai_test.html",history=history)




@app.route("/anx_back", methods=["POST"])
def anxiety_backend():
    uid = session["anxtest"]

    # Ensure user data is initialized
    if uid not in user_messages:
        user_messages[uid] = [SystemMessage(content=anxiety_Ai_test_prompt)]
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




if __name__ == "__main__":
    app.run(debug=True)
