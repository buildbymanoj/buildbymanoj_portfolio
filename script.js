document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initCircuitBoard();
    initMicrochipParticles();
    initTheme(); // Initialize theme on load
    initHolographicCards(); // Initialize holographic skill cards
});

// --- DYNAMIC STARS ---
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;

    const width = window.innerWidth;
    let numStars = (width < 768) ? 50 : 100;

    starsContainer.innerHTML = ''; // Clear existing stars
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2.5 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

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


// --- THREE.JS ANIMATIONS ---
function initCircuitBoard() {
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas || !window.THREE) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const isMobile = window.innerWidth < 768;
    const geometry = new THREE.PlaneGeometry(isMobile ? 4 : 5, isMobile ? 2 : 3);
    const material = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true, side: THREE.DoubleSide });
    const circuit = new THREE.Mesh(geometry, material);
    scene.add(circuit);
    camera.position.z = 5;
    function animate() { requestAnimationFrame(animate); circuit.rotation.y += 0.01; renderer.render(scene, camera); }
    animate();
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function initMicrochipParticles() {
    const canvas = document.getElementById('microchip-canvas');
    if (!canvas || !window.THREE) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const particles = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const material = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        particle.userData = { velocity: new THREE.Vector3(0, Math.random() * 0.02, 0) };
        particles.add(particle);
    }
    scene.add(particles);
    camera.position.z = 5;
    function animate() { requestAnimationFrame(animate); particles.children.forEach(p => { p.position.add(p.userData.velocity); if (p.position.y > 5) p.position.y = -5; }); particles.rotation.y += 0.005; renderer.render(scene, camera); }
    animate();
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

// --- HOLOGRAPHIC SKILL CARDS ---
function initHolographicCards() {
    var x;
    var $cards = $(".skill-card");
    var $style = $(".hover");

    $cards
        .on("mousemove touchmove", function(e) { 
            // normalise touch/mouse
            var pos = [e.offsetX, e.offsetY];
            e.preventDefault();
            if (e.type === "touchmove") {
                pos = [e.touches[0].clientX, e.touches[0].clientY];
            }
            var $card = $(this);
            // math for mouse position
            var l = pos[0];
            var t = pos[1];
            var h = $card.height();
            var w = $card.width();
            var px = Math.abs(Math.floor(100 / w * l) - 100);
            var py = Math.abs(Math.floor(100 / h * t) - 100);
            var pa = (50 - px) + (50 - py);
            // math for gradient / background positions
            var lp = (50 + (px - 50) / 1.5);
            var tp = (50 + (py - 50) / 1.5);
            var px_spark = (50 + (px - 50) / 7);
            var py_spark = (50 + (py - 50) / 7);
            var p_opc = 20 + (Math.abs(pa) * 1.5);
            var ty = ((tp - 50) / 2) * -1;
            var tx = ((lp - 50) / 1.5) * .5;
            // css to apply for active card
            var grad_pos = `background-position: ${lp}% ${tp};`
            var sprk_pos = `background-position: ${px_spark}% ${py_spark};`
            var opc = `opacity: ${p_opc / 100};`
            var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
            // need to use a <style> tag for pseudo elements
            var style = `
                .skill-card:hover:before { ${grad_pos} }  /* gradient */
                .skill-card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
            `
            // set / apply css class and style
            $cards.removeClass("active");
            $card.removeClass("animated");
            $card.attr("style", tf);
            $style.html(style);
            if (e.type === "touchmove") {
                return false; 
            }
            clearTimeout(x);
        }).on("mouseout touchend touchcancel", function() {
            // remove css, apply custom animation on end
            var $card = $(this);
            $style.html("");
            $card.removeAttr("style");
            x = setTimeout(function() {
                $card.addClass("animated");
            }, 2500);
        });
}

// --- GLOWING BUTTON EFFECTS ---
function initGlowingButtons() {
    // CSS.registerProperty support detection
    if ('CSS' in window && 'registerProperty' in CSS) {
        try {
            // Register custom properties for better animation support
            CSS.registerProperty({
                name: '--bg-size',
                syntax: '<percentage>',
                initialValue: '50%',
                inherits: false
            });
            
            CSS.registerProperty({
                name: '--bg-angle',
                syntax: '<angle>',
                initialValue: '0deg',
                inherits: false
            });
        } catch (e) {
            console.log('CSS.registerProperty already registered or not supported');
        }
    }

    // Enhanced hover effects for glowing buttons
    const glowButtons = document.querySelectorAll('.glow-button');
    
    glowButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const glowBorder = button.querySelector('.glow-border');
            if (glowBorder) {
                glowBorder.style.animationDuration = '2s';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            const glowBorder = button.querySelector('.glow-border');
            if (glowBorder) {
                glowBorder.style.animationDuration = '4s';
            }
        });
        
        // Add click ripple effect
        button.addEventListener('click', (e) => {
            if (!button.querySelector('a').href || button.querySelector('a').href === window.location.href) {
                e.preventDefault();
                return;
            }
            
            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(250, 204, 21, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize glowing buttons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initCircuitBoard();
    initMicrochipParticles();
    initTheme();
    initHolographicCards();
    initGlowingButtons(); // Initialize glowing button effects
});
