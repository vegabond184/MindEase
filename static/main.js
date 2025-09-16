// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Profile Modal
const openProfileBtn = document.getElementById('openProfileBtn');
const profileModalBg = document.getElementById('profileModalBg');
const closeProfileBtn = document.getElementById('closeProfileBtn');
openProfileBtn.addEventListener('click', () => {
    profileModalBg.classList.add('active');
});
closeProfileBtn.addEventListener('click', () => {
    profileModalBg.classList.remove('active');
});
window.addEventListener('click', (e) => {
    if (e.target === profileModalBg) profileModalBg.classList.remove('active');
});

// Profile Picture Upload
const profilePicInput = document.getElementById('profilePicInput');
const profilePic = document.getElementById('profilePic');
profilePicInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Download Certificate (dummy)
document.getElementById('downloadCertBtn').addEventListener('click', function() {
    const cert = `
        Certificate of Progress

        This certifies that MindEaseUser is actively tracking their mental health journey with MindEase.

        Date: ${new Date().toLocaleDateString()}
    `;
    const blob = new Blob([cert], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'MindEase_Certificate.txt';
    link.click();
});

// Add to the end of main.js
// About Us Page - js
// Social CTA button (example: open a social link)
document.getElementById('followSocialBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.open('https://twitter.com/', '_blank');
});

// Featured resource card click (optional: open link)
document.querySelectorAll('.resource-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Placeholder: prevent default and show alert
        e.preventDefault();
        alert('Resource details coming soon!');
    });
});

// --- Tracking Page: Chatbot logic ---
if (document.getElementById('chatbotMessages')) {
    const phq9Questions = [
        "Little interest or pleasure in doing things?",
        "Feeling down, depressed, or hopeless?",
        "Trouble falling or staying asleep, or sleeping too much?",
        "Feeling tired or having little energy?",
        "Poor appetite or overeating?",
        "Feeling bad about yourself or that you are a failure?",
        "Trouble concentrating on things?",
        "Moving or speaking slowly or being fidgety/restless?",
        "Thoughts that you would be better off dead or of hurting yourself?"
    ];
    const gad7Questions = [
        "Feeling nervous, anxious, or on edge?",
        "Not being able to stop or control worrying?",
        "Worrying too much about different things?",
        "Trouble relaxing?",
        "Being so restless that it is hard to sit still?",
        "Becoming easily annoyed or irritable?",
        "Feeling afraid as if something awful might happen?"
    ];
    let mode = "phq9";
    let step = 0;
    let answers = [];
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    const switchModeBtn = document.getElementById('switchModeBtn');
    const chatbotHint = document.getElementById('chatbotHint');

    function renderChatbot() {
        chatbotMessages.innerHTML = '';
        for (let i = 0; i < answers.length; i++) {
            chatbotMessages.innerHTML += `
                <div class="chatbot-bubble user-bubble">
                    <span>${mode === "phq9" ? phq9Questions[i] : gad7Questions[i]}</span>
                    <div class="chatbot-answer">Your answer: <b>${answers[i]}</b></div>
                </div>
            `;
        }
        if (step < (mode === "phq9" ? phq9Questions.length : gad7Questions.length)) {
            chatbotMessages.innerHTML += `
                <div class="chatbot-bubble bot-bubble">
                    <span>${mode === "phq9" ? phq9Questions[step] : gad7Questions[step]}</span>
                </div>
            `;
        } else {
            const total = answers.reduce((a, b) => a + Number(b), 0);
            chatbotMessages.innerHTML += `
                <div class="chatbot-bubble bot-bubble">
                    <span>Assessment complete! Your total score: <b>${total}</b></span>
                </div>
                <button class="restart-btn" onclick="restartChatbot()">Restart</button>
            `;
        }
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function sendAnswer() {
        const val = chatbotInput.value.trim();
        if (!["0", "1", "2", "3"].includes(val)) return;
        answers.push(val);
        step++;
        chatbotInput.value = '';
        renderChatbot();
    }
    window.restartChatbot = function() {
        step = 0;
        answers = [];
        renderChatbot();
    }
    chatbotSendBtn.onclick = sendAnswer;
    chatbotInput.onkeydown = e => { if (e.key === "Enter") sendAnswer(); };
    switchModeBtn.onclick = () => {
        mode = mode === "phq9" ? "gad7" : "phq9";
        switchModeBtn.textContent = mode === "phq9" ? "Switch to GAD-7" : "Switch to PHQ-9";
        chatbotHint.textContent = mode === "phq9"
            ? "PHQ-9: 0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day"
            : "GAD-7: 0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day";
        window.restartChatbot();
    };
    renderChatbot();
}

// --- Tracking Page: Chart.js for Progress Dashboard ---
if (typeof Chart !== "undefined" && document.getElementById('phq9Chart') && document.getElementById('gad7Chart')) {
    const phq9Ctx = document.getElementById('phq9Chart').getContext('2d');
    const gad7Ctx = document.getElementById('gad7Chart').getContext('2d');
    const dummyLabels = ["09-01", "09-08", "09-15", "09-22", "09-29"];
    const dummyPHQ9 = [7, 10, 12, 8, 6];
    const dummyGAD7 = [5, 8, 9, 6, 4];
    new Chart(phq9Ctx, {
        type: 'line',
        data: {
            labels: dummyLabels,
            datasets: [{
                label: 'PHQ-9 Score',
                data: dummyPHQ9,
                borderColor: '#6C63FF',
                backgroundColor: 'rgba(108,99,255,0.08)',
                tension: 0.4,
                fill: true,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: 27 } }
        }
    });
    new Chart(gad7Ctx, {
        type: 'line',
        data: {
            labels: dummyLabels,
            datasets: [{
                label: 'GAD-7 Score',
                data: dummyGAD7,
                borderColor: '#43D8C9',
                backgroundColor: 'rgba(67,216,201,0.08)',
                tension: 0.4,
                fill: true,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: 21 } }
        }
    });
}

// --- Tracking Page: Goal Completion Circle ---
if (document.getElementById('goalProgress') && document.getElementById('goalPercent')) {
    const goalPercent = 70;
    const goalCircle = document.getElementById('goalProgress');
    const goalPercentText = document.getElementById('goalPercent');
    const circleLen = 2 * Math.PI * 44;
    goalCircle.setAttribute('stroke-dasharray', circleLen);
    goalCircle.setAttribute('stroke-dashoffset', circleLen * (1 - goalPercent / 100));
    goalPercentText.textContent = goalPercent + "%";
}

// --- Support Page JS ---
document.addEventListener("DOMContentLoaded", function () {
    // Anonymous ID generation
    if (document.getElementById('anonId')) {
        document.getElementById('anonId').value = "ME-" + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // Counselling booking form
    const counsellingForm = document.getElementById('counsellingForm');
    if (counsellingForm) {
        counsellingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            document.getElementById('bookingMsg').textContent = "Your anonymous booking has been received! We'll confirm your slot soon.";
            counsellingForm.reset();
            document.getElementById('anonId').value = "ME-" + Math.random().toString(36).substr(2, 8).toUpperCase();
        });
    }

    // Helplines data
    const helplines = {
        en: [
            { name: "National Helpline", phone: "1800-599-0019" },
            { name: "Student Support", phone: "1800-121-3667" },
            { name: "Emergency", phone: "112" }
        ],
        hi: [
            { name: "राष्ट्रीय हेल्पलाइन", phone: "1800-599-0019" },
            { name: "छात्र सहायता", phone: "1800-121-3667" },
            { name: "आपातकालीन", phone: "112" }
        ],
    };
    function renderHelplines(lang) {
        const list = document.getElementById('helplineList');
        if (!list) return;
        list.innerHTML = '';
        helplines[lang].forEach(h => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${h.name}</span> <a href="tel:${h.phone}" class="helpline-btn">Call</a>`;
            list.appendChild(li);
        });
    }
    const helplineLang = document.getElementById('helplineLang');
    if (helplineLang) {
        renderHelplines(helplineLang.value);
        helplineLang.addEventListener('change', e => renderHelplines(e.target.value));
    }

    // FAQ collapsible
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('open');
            const answer = this.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
});

