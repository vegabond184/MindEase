document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = document.getElementById('contactMsg');
            msg.textContent = "Thank you for reaching out! We'll get back to you soon.";
            form.reset();
        });
    }
});