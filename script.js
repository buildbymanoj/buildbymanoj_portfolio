// Dynamic Stars
function createStars() {
  const starsContainer = document.querySelector('.stars-container');
  
  // Responsive star count based on screen width
  const width = window.innerWidth;
  let numStars;
  
  if (width < 480) {
    numStars = 30; // Fewer stars on very small screens
  } else if (width < 768) {
    numStars = 50; // Mobile screens
  } else if (width < 1024) {
    numStars = 75; // Tablets
  } else {
    numStars = 100; // Desktops
  }

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    starsContainer.appendChild(star);
  }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Contact Form Submission
const contactForm = document.querySelector('#contact form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      contactForm.reset();
      const successMessage = document.createElement('p');
      successMessage.textContent = 'Message sent successfully!';
      successMessage.className = 'text-yellow-400 mt-4';
      contactForm.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } else {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Something went wrong. Please try again.';
      errorMessage.className = 'text-red-400 mt-4';
      contactForm.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  });
}

// Scroll Reveal with IntersectionObserver - with responsive thresholds
const sections = document.querySelectorAll('section');

// Adjust threshold based on screen size
const getThreshold = () => {
  if (window.innerWidth < 768) {
    return 0.05; // Lower threshold on mobile for quicker reveals
  }
  return 0.1; // Default threshold
};

const observerOptions = {
  threshold: getThreshold(),
  rootMargin: '0px 0px -50px 0px' // Trigger slightly before section is fully visible
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  observerOptions
);

sections.forEach((section) => {
  observer.observe(section);
});

// Smooth Scroll for Anchor Links with offset adjustment
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Get header height for offset (responsive)
      const navHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - navHeight - 20; // Extra padding
      
      // Smooth scroll with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      mobileMenu.classList.add('hidden');
      menuToggle.querySelector('i').classList.remove('fa-times');
      menuToggle.querySelector('i').classList.add('fa-bars');
    }
  });
});

// 3D Circuit Board (Hero Section)
function initCircuitBoard() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Use pixel ratio for better display on high-DPI screens
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Adjust geometry size based on screen width for better responsiveness
  const isMobile = window.innerWidth < 768;
  const geometryWidth = isMobile ? 4 : 5;
  const geometryHeight = isMobile ? 2 : 3;
  
  const geometry = new THREE.PlaneGeometry(geometryWidth, geometryHeight);
  const material = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    wireframe: true,
    side: THREE.DoubleSide,
  });
  const circuit = new THREE.Mesh(geometry, material);
  scene.add(circuit);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    // Adjust rotation speed based on device performance
    circuit.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    // Full responsive resize handling
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update geometry based on new screen size
    const isMobileNow = window.innerWidth < 768;
    circuit.geometry = new THREE.PlaneGeometry(
      isMobileNow ? 4 : 5,
      isMobileNow ? 2 : 3
    );
  });
}

// 3D Drone Model (Projects Section)
function initDrone() {
  const canvas = document.getElementById('drone-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const geometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
  const material = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
  const drone = new THREE.Mesh(geometry, material);
  scene.add(drone);

  // Add propellers (simplified as small cubes)
  const propGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.1);
  const propMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const props = [];
  const propPositions = [
    [0.2, 0.1, 0.2],
    [0.2, 0.1, -0.2],
    [-0.2, 0.1, 0.2],
    [-0.2, 0.1, -0.2],
  ];

  propPositions.forEach((pos) => {
    const prop = new THREE.Mesh(propGeometry, propMaterial);
    prop.position.set(pos[0], pos[1], pos[2]);
    drone.add(prop);
    props.push(prop);
  });

  camera.position.z = 1.5;

  function animate() {
    requestAnimationFrame(animate);
    drone.rotation.y += 0.02;
    props.forEach((prop) => {
      prop.rotation.z += 0.1;
    });
    renderer.render(scene, camera);
  }

  animate();
}

// 3D Microchip Particles (Contact Section)
function initMicrochipParticles() {
  const canvas = document.getElementById('microchip-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particles = new THREE.Group();
  const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  const material = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

  for (let i = 0; i < 50; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    particle.userData = { velocity: new THREE.Vector3(0, Math.random() * 0.02, 0) };
    particles.add(particle);
  }

  scene.add(particles);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    particles.children.forEach((particle) => {
      particle.position.add(particle.userData.velocity);
      if (particle.position.y > 5) particle.position.y = -5;
    });
    particles.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initCircuitBoard();
  initDrone();
  initMicrochipParticles();
});

// Handle window resize events
window.addEventListener('resize', () => {
  // Clear and recreate stars on resize for better responsiveness
  const starsContainer = document.querySelector('.stars-container');
  if (starsContainer) {
    starsContainer.innerHTML = '';
    createStars();
  }
});