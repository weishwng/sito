// Seleziona elementi del DOM
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// --- Logica Dark Mode ---

// Controlla se l'utente aveva già scelto una preferenza
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    // Aggiungi o rimuovi l'attributo data-theme
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// --- Logica Menu Mobile ---
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Chiudi il menu quando si clicca su un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});