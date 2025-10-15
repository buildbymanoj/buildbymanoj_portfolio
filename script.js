document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

// --- MOBILE MENU ---
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// --- SCROLL REVEAL ---
const sections = document.querySelectorAll('section');
const observerOptions = { threshold: window.innerWidth < 768 ? 0.05 : 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
sections.forEach((section) => observer.observe(section));

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            if (!mobileMenu.classList.contains('hidden')) {
                menuToggle.click(); // Close mobile menu
            }
        }
    });
});

// --- THEME TOGGLE (REFACTORED) ---

// --- THEME TOGGLE ---
const toggleSwitch = document.getElementById("toggleSwitch");
const body = document.body;

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.remove("light-mode");
        toggleSwitch.checked = true; // Night mode is checked
    } else {
        body.classList.add("light-mode");
        toggleSwitch.checked = false; // Day mode is unchecked
    }
}

// Show sarcastic toast every time user switches from dark -> light; apply theme immediately
toggleSwitch.addEventListener("change", function (e) {
    const wantsLight = !this.checked; // unchecked -> light

    if (wantsLight) {
        // show toast for 2.5s but apply theme immediately for smoother UX
        showSarcasticToast(3500);
        localStorage.setItem('theme', 'light');
        applyTheme('light');
        return;
    }

    // switching to dark
    if (this.checked) {
        localStorage.setItem('theme', 'dark');
        applyTheme('dark');
    }
});

// Toast helpers
function getSarcasticToast() {
    return document.getElementById('sarcastic-toast');
}

let _sarcasticToastTimer = null;

function showSarcasticToast(duration = 2500) {
    const t = getSarcasticToast();
    if (!t) return;
    // clear previous timer
    if (_sarcasticToastTimer) {
        clearTimeout(_sarcasticToastTimer);
        _sarcasticToastTimer = null;
    }
    t.style.display = 'flex';
    // allow CSS transition
    requestAnimationFrame(() => t.classList.add('show'));

    // auto-hide after duration
    _sarcasticToastTimer = setTimeout(() => {
        hideSarcasticToast();
        _sarcasticToastTimer = null;
    }, duration);
}

function hideSarcasticToast() {
    const t = getSarcasticToast();
    if (!t) return;
    t.classList.remove('show');
    // wait for transition to finish then hide
    setTimeout(() => { t.style.display = 'none'; }, 300);
    if (_sarcasticToastTimer) {
        clearTimeout(_sarcasticToastTimer);
        _sarcasticToastTimer = null;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersLight) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }
}


// --- HOLOGRAPHIC SKILL CARDS ---
function initHolographicCards() {
    // This is now handled by CSS for better performance and touch device compatibility.
}
