// --- Community Chat (front-end only, not persistent) ---
document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const chatUser = document.getElementById('chatUser');
    const chatInput = document.getElementById('chatInput');

    // Load messages from localStorage (simulate persistence for demo)
    let chatMessages = JSON.parse(localStorage.getItem('mindease_chat')) || [
        {
            user: "Anonymous",
            text: "Welcome to the MindEase community chat! 😊",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
    ];

    function renderChat() {
        chatBox.innerHTML = '';
        chatMessages.forEach(msg => {
            const avatar = msg.user && msg.user.trim() !== "" ? msg.user.trim()[0].toUpperCase() : "A";
            chatBox.innerHTML += `
                <div class="chat-message">
                    <div class="chat-avatar">${avatar}</div>
                    <div>
                        <div class="chat-meta">${msg.user || "Anonymous"} <span style="color:#b0bec5;">· ${msg.time}</span></div>
                        <div class="chat-content">${msg.text}</div>
                    </div>
                </div>
            `;
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = chatUser.value.trim() || "Anonymous";
        const text = chatInput.value.trim();
        if (!text) return;
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        chatMessages.push({ user, text, time });
        // Save to localStorage for demo (not real persistence)
        localStorage.setItem('mindease_chat', JSON.stringify(chatMessages));
        renderChat();
        chatInput.value = '';
    });

    renderChat();
});

// ...existing code...

// Profile Modal Logic (same as home page)
document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menu (if not already present)
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Profile Modal
    const openProfileBtn = document.getElementById('openProfileBtn');
    const profileModalBg = document.getElementById('profileModalBg');
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    if (openProfileBtn && profileModalBg && closeProfileBtn) {
        openProfileBtn.addEventListener('click', () => {
            profileModalBg.classList.add('active');
        });
        closeProfileBtn.addEventListener('click', () => {
            profileModalBg.classList.remove('active');
        });
        window.addEventListener('click', (e) => {
            if (e.target === profileModalBg) profileModalBg.classList.remove('active');
        });
    }

    // Profile Picture Upload
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePic = document.getElementById('profilePic');
    if (profilePicInput && profilePic) {
        profilePicInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePic.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Download Certificate (dummy)
    const downloadCertBtn = document.getElementById('downloadCertBtn');
    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', function () {
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
    }
});