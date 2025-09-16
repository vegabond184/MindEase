// --- Guides Data ---
const guides = [
    {
        id: 1,
        title: "Deep Breathing Exercises",
        desc: "Step-by-step guide to calm your mind and body.",
        icon: "🫁",
        category: "Anxiety"
    },
    {
        id: 2,
        title: "Progressive Muscle Relaxation",
        desc: "Release tension and relax with this simple exercise.",
        icon: "💪",
        category: "Stress"
    },
    {
        id: 3,
        title: "Mindful Journaling",
        desc: "Reflect on your thoughts and feelings for clarity.",
        icon: "📓",
        category: "Self-Care"
    },
    {
        id: 4,
        title: "Sleep Hygiene Checklist",
        desc: "Improve your sleep with healthy bedtime habits.",
        icon: "🛌",
        category: "Sleep"
    },
    {
        id: 5,
        title: "Pomodoro Productivity Timer",
        desc: "Boost focus and productivity with timed work sessions.",
        icon: "⏲️",
        category: "Productivity"
    },
    {
        id: 6,
        title: "Gratitude Practice",
        desc: "Cultivate positivity with daily gratitude exercises.",
        icon: "🌱",
        category: "Self-Care"
    }
];

// --- Multimedia Resources Data ---
const mediaResources = [
    {
        id: 1,
        type: "Video",
        title: "Guided Meditation for Stress Relief",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        desc: "A calming meditation to help you unwind.",
        icon: "🎬"
    },
    {
        id: 2,
        type: "Audio",
        title: "Relaxation Breathing Audio",
        src: "https://www.w3schools.com/html/horse.mp3",
        desc: "Listen and follow along for instant calm.",
        icon: "🎧"
    },
    {
        id: 3,
        type: "PDF",
        title: "Sleep Improvement Guide",
        src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        desc: "Downloadable checklist for better sleep.",
        icon: "📄"
    }
];

// --- Categories ---
const guideCategories = ["All", ...Array.from(new Set(guides.map(g => g.category)))];

// --- Render Guide Categories ---
const guidesCategories = document.getElementById('guidesCategories');
let activeGuideCat = "All";
function renderGuideCategories() {
    guidesCategories.innerHTML = '';
    guideCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'guide-cat-btn' + (activeGuideCat === cat ? ' active' : '');
        btn.textContent = cat;
        btn.onclick = () => {
            activeGuideCat = cat;
            renderGuideCategories();
            renderGuides();
        };
        guidesCategories.appendChild(btn);
    });
}
renderGuideCategories();

// --- Render Guides ---
const guidesList = document.getElementById('guidesList');
let completedGuides = JSON.parse(localStorage.getItem('completedGuides') || "[]");
function renderGuides() {
    let filtered = guides.filter(g => activeGuideCat === "All" || g.category === activeGuideCat);
    guidesList.innerHTML = '';
    filtered.forEach(g => {
        const completed = completedGuides.includes(g.id);
        guidesList.innerHTML += `
            <div class="guide-card${completed ? ' completed' : ''}">
                <div class="guide-icon">${g.icon}</div>
                <h3>${g.title}</h3>
                <p>${g.desc}</p>
                <button class="cta-btn" onclick="markGuideComplete(${g.id})">${completed ? "Completed" : "Read Guide"}</button>
            </div>
        `;
    });
}
window.markGuideComplete = function(id) {
    if (!completedGuides.includes(id)) {
        completedGuides.push(id);
        localStorage.setItem('completedGuides', JSON.stringify(completedGuides));
        renderGuides();
        updateProgress();
    }
};
renderGuides();

// --- Multimedia Filter ---
const mediaFilter = document.getElementById('mediaFilter');
const mediaList = document.getElementById('mediaList');
let activeMediaType = "All";
mediaFilter.querySelectorAll('.media-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        activeMediaType = this.dataset.type;
        mediaFilter.querySelectorAll('.media-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderMedia();
    });
});
function renderMedia() {
    let filtered = mediaResources.filter(m => activeMediaType === "All" || m.type === activeMediaType);
    mediaList.innerHTML = '';
    filtered.forEach(m => {
        let mediaContent = "";
        if (m.type === "Video") {
            mediaContent = `<video controls src="${m.src}" poster="" preload="metadata"></video>`;
        } else if (m.type === "Audio") {
            mediaContent = `<audio controls src="${m.src}"></audio>`;
        } else if (m.type === "PDF") {
            mediaContent = `<a href="${m.src}" target="_blank" class="cta-btn">Download PDF</a>`;
        }
        mediaList.innerHTML += `
            <div class="media-card">
                <div class="media-icon">${m.icon}</div>
                <h4>${m.title}</h4>
                <p>${m.desc}</p>
                ${mediaContent}
            </div>
        `;
    });
}
renderMedia();

// --- Progress & Certificate ---
const progressBar = document.getElementById('progressBar');
const progressCount = document.getElementById('progressCount');
function updateProgress() {
    const percent = Math.round((completedGuides.length / guides.length) * 100);
    progressBar.style.width = percent + "%";
    progressCount.textContent = completedGuides.length + " / " + guides.length;
}
updateProgress();

// --- Certificate Modal ---
const certModalBg = document.getElementById('certModalBg');
const closeCertBtn = document.getElementById('closeCertBtn');
const downloadCertBtn = document.getElementById('downloadCertBtn');
const downloadCertFileBtn = document.getElementById('downloadCertFileBtn');
const certCount = document.getElementById('certCount');
const certDate = document.getElementById('certDate');

downloadCertBtn.addEventListener('click', function() {
    certModalBg.classList.add('active');
    certCount.textContent = completedGuides.length;
    certDate.textContent = "Date: " + new Date().toLocaleDateString();
});
closeCertBtn.addEventListener('click', function() {
    certModalBg.classList.remove('active');
});
certModalBg.addEventListener('click', function(e) {
    if (e.target === certModalBg) certModalBg.classList.remove('active');
});
downloadCertFileBtn.addEventListener('click', function() {
    const certText = `Certificate of Achievement

This certifies that you have completed ${completedGuides.length} self-help guides on MindEase.

Date: ${new Date().toLocaleDateString()}
`;
    const blob = new Blob([certText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'MindEase_SelfHelp_Certificate.txt';
    link.click();
});