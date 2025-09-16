// --- Sidebar Toggle ---
const sidebar = document.getElementById('adminSidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// --- Sidebar Navigation ---
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const page = this.getAttribute('data-page');
        document.querySelectorAll('.admin-page').forEach(p => p.style.display = 'none');
        document.getElementById(page + 'Page').style.display = '';
    });
});

// --- Admin Dropdown ---
const adminDropdownBtn = document.getElementById('adminDropdownBtn');
const adminDropdownMenu = document.getElementById('adminDropdownMenu');
if (adminDropdownBtn) {
    adminDropdownBtn.addEventListener('click', () => {
        adminDropdownMenu.parentElement.classList.toggle('open');
    });
    window.addEventListener('click', (e) => {
        if (!adminDropdownBtn.contains(e.target) && !adminDropdownMenu.contains(e.target)) {
            adminDropdownMenu.parentElement.classList.remove('open');
        }
    });
}

// --- Sample Data ---
const userAnalytics = [
    { id: "ME-1A2B3C", lastLogin: "2025-09-12", tests: 8, engagement: "High", risk: "Moderate" },
    { id: "ME-4D5E6F", lastLogin: "2025-09-10", tests: 2, engagement: "Low", risk: "Severe" },
    { id: "ME-7G8H9I", lastLogin: "2025-09-13", tests: 5, engagement: "Medium", risk: "Mild" },
    { id: "ME-0J1K2L", lastLogin: "2025-09-11", tests: 7, engagement: "High", risk: "Moderate" },
    { id: "ME-3M4N5O", lastLogin: "2025-09-09", tests: 1, engagement: "Low", risk: "Severe" }
];
const bookings = [
    { id: "BK-1001", date: "2025-09-15", time: "10:00", mode: "Online", status: "Pending" },
    { id: "BK-1002", date: "2025-09-16", time: "14:00", mode: "Offline", status: "Confirmed" },
    { id: "BK-1003", date: "2025-09-17", time: "11:00", mode: "Online", status: "Completed" }
];
let resources = [
    { title: "Managing Anxiety", desc: "Tips and exercises for anxiety.", type: "Blog" },
    { title: "Sleep Audio", desc: "Relaxation audio for better sleep.", type: "Audio" }
];
let counsellors = [
    { name: "Dr. Priya Sharma", contact: "priya@mindease.com", avail: "Mon-Fri 10am-4pm" }
];

// --- Overview Charts ---
if (window.Chart) {
    // Active Users Chart
    new Chart(document.getElementById('activeUsersChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Active Users",
                data: [120, 150, 180, 170, 200, 220, 210],
                borderColor: "#6C63FF",
                backgroundColor: "rgba(108,99,255,0.08)",
                tension: 0.4,
                fill: true,
                pointRadius: 4
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { min: 0 } }, responsive: true }
    });
    // Avg Scores Chart
    new Chart(document.getElementById('avgScoresChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ["PHQ-9", "GAD-7"],
            datasets: [{
                label: "Average Score",
                data: [8.2, 6.5],
                backgroundColor: ["#43D8C9", "#6C63FF"]
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 27 } }, responsive: true }
    });
    // Category Pie Chart
    new Chart(document.getElementById('categoryPieChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: ["Mild", "Moderate", "Severe"],
            datasets: [{
                data: [60, 30, 10],
                backgroundColor: ["#43D8C9", "#6C63FF", "#FFB6B6"]
            }]
        },
        options: { plugins: { legend: { position: 'bottom' } }, responsive: true }
    });
    // Chatbot Trends Chart
    new Chart(document.getElementById('chatbotTrendsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ["Stress", "Sleep", "Anxiety", "Productivity", "Relationships"],
            datasets: [{
                label: "Mentions",
                data: [120, 80, 150, 60, 40],
                backgroundColor: ["#6C63FF", "#43D8C9", "#FFB6B6", "#FFD166", "#8D99AE"]
            }]
        },
        options: { plugins: { legend: { display: false } }, responsive: true }
    });
}

// --- User Analytics Table ---
function renderUserAnalytics() {
    const tbody = document.querySelector('#userAnalyticsTable tbody');
    const highRisk = document.getElementById('highRiskFilter').checked;
    tbody.innerHTML = '';
    userAnalytics.forEach(u => {
        if (!highRisk || u.risk === "Severe") {
            tbody.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.lastLogin}</td>
                    <td>${u.tests}</td>
                    <td>${u.engagement}</td>
                    <td>${u.risk}</td>
                </tr>
            `;
        }
    });
}
if (document.getElementById('userAnalyticsTable')) {
    renderUserAnalytics();
    document.getElementById('highRiskFilter').addEventListener('change', renderUserAnalytics);
}

// --- Bookings Table ---
function renderBookings() {
    const tbody = document.querySelector('#bookingsTable tbody');
    tbody.innerHTML = '';
    bookings.forEach((b, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${b.id}</td>
                <td>${b.date}</td>
                <td>${b.time}</td>
                <td>${b.mode}</td>
                <td>
                    <select data-idx="${idx}" class="booking-status">
                        <option${b.status === "Pending" ? " selected" : ""}>Pending</option>
                        <option${b.status === "Confirmed" ? " selected" : ""}>Confirmed</option>
                        <option${b.status === "Completed" ? " selected" : ""}>Completed</option>
                    </select>
                </td>
                <td><button class="cta-btn update-booking" data-idx="${idx}">Update</button></td>
            </tr>
        `;
    });
    document.querySelectorAll('.update-booking').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const sel = document.querySelector(`select.booking-status[data-idx="${idx}"]`);
            bookings[idx].status = sel.value;
            renderBookings();
        });
    });
}
if (document.getElementById('bookingsTable')) renderBookings();

// --- Resources Management ---
function renderResources() {
    const tbody = document.querySelector('#resourcesTable tbody');
    tbody.innerHTML = '';
    resources.forEach((r, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${r.title}</td>
                <td>${r.desc}</td>
                <td>${r.type}</td>
                <td>
                    <button class="cta-btn edit-resource" data-idx="${idx}">Edit</button>
                    <button class="cta-btn delete-resource" data-idx="${idx}">Delete</button>
                </td>
            </tr>
        `;
    });
    document.querySelectorAll('.delete-resource').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            resources.splice(idx, 1);
            renderResources();
        });
    });
    // Edit functionality can be added as needed
}
if (document.getElementById('resourcesTable')) renderResources();

const resourceForm = document.getElementById('resourceForm');
if (resourceForm) {
    resourceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        resources.push({
            title: document.getElementById('resourceTitle').value,
            desc: document.getElementById('resourceDesc').value,
            type: document.getElementById('resourceType').value
        });
        renderResources();
        resourceForm.reset();
    });
}

// --- Counsellor Management ---
function renderCounsellors() {
    const list = document.getElementById('counsellorList');
    list.innerHTML = '';
    counsellors.forEach((c, idx) => {
        list.innerHTML += `
            <div class="counsellor-card">
                <span>${c.name} (${c.contact}) - ${c.avail}</span>
                <button data-idx="${idx}" title="Remove">&times;</button>
            </div>
        `;
    });
    list.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            counsellors.splice(idx, 1);
            renderCounsellors();
        });
    });
}
if (document.getElementById('counsellorList')) renderCounsellors();

const counsellorForm = document.getElementById('counsellorForm');
if (counsellorForm) {
    counsellorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        counsellors.push({
            name: document.getElementById('counsellorName').value,
            contact: document.getElementById('counsellorContact').value,
            avail: document.getElementById('counsellorAvail').value
        });
        renderCounsellors();
        counsellorForm.reset();
    });
}

// --- Platform Settings ---
const langSupport = document.getElementById('langSupport');
const darkTheme = document.getElementById('darkTheme');
if (langSupport) {
    langSupport.addEventListener('change', function() {
        alert(this.checked ? "Regional language support enabled." : "Regional language support disabled.");
    });
}
if (darkTheme) {
    darkTheme.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
    });
}

// --- Admin Auth (Demo Only) ---
if (!sessionStorage.getItem('isAdmin')) {
    const pass = prompt("Admin access only. Enter password:");
    if (pass !== "admin123") {
        alert("Unauthorized. Redirecting...");
        window.location.href = "home.html";
    } else {
        sessionStorage.setItem('isAdmin', 'true');
    }
}