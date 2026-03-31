// ====================================
// script.js — Frontend logic + animations
// ====================================

// ====================================
// 2. PROJECTS DATA + LOADER
// ====================================
const projects = [
  {
    number: '01',
    name: 'Real-Time Weapon Detection — YOLOv11',
    description: 'Full-stack weapon detection app using YOLOv11s with live webcam, CCTV streaming, and video/image upload support for identifying handguns, long guns, knives, and explosives.',
    highlights: [
      'YOLOv11s with ONNX Runtime for fast CPU inference',
      'Live webcam & CCTV stream detection via WebSockets',
      'Deep knife mode with quadrant scanning & test-time augmentation',
      'Alert system with detection thumbnails & confidence tuning'
    ],
    technologies: ['Python', 'FastAPI', 'YOLOv11', 'OpenCV', 'ONNX', 'WebSocket', 'Docker'],
    github: 'https://github.com/chowhandutta2004-lgtm/realtime-weapon-detection-yolov11',
    website: 'https://chowhandutta-realtime-weapon-detection-yolov11.hf.space',
    video: 'ai weapon.mp4',
    gradient: 'linear-gradient(135deg, #b71c1c, #c62828, #ff1744)',
    accentColor: '#ff1744'
  },
  {
    number: '02',
    name: 'Advanced OCR System with CNN and GAN',
    description: 'OCR system combining CNNs for character detection and GANs for data augmentation of handwritten text.',
    highlights: [
      'CNN architecture for spatial feature extraction',
      'GAN-based synthetic data generation',
      'Context-aware interpretation using Gen AI',
      'Real-time recognition pipeline'
    ],
    technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'GAN', 'NumPy'],
    github: 'https://github.com/chowhandutta2004-lgtm/Handwritten-Character-Recognition-using-CNN-and-Generative-AI',
    video: 'ocr-cnn-gan.mp4',
    gradient: 'linear-gradient(135deg, #0d47a1, #1565c0, #00838f)',
    accentColor: '#00e5ff'
  },
  {
    number: '03',
    name: 'RAGs AI — Chat With Your Documents',
    description: 'Full-stack RAG app where users upload documents, which get chunked and embedded into ChromaDB, then chat with them via GPT-4o.',
    highlights: [
      'Google Auth + per-user vector isolation',
      'Supports PDF, DOCX, CSV, PPTX, URLs',
      'Streaming SSE chat with confidence scoring',
      'Session management + document analytics'
    ],
    technologies: ['React', 'FastAPI', 'GPT-4o', 'ChromaDB', 'LangChain', 'Firebase', 'Tailwind'],
    github: 'https://github.com/chowhandutta2004-lgtm/RAGs_AI',
    website: 'https://askmydocs-omega.vercel.app/',
    video: 'rags-ai.mp4',
    gradient: 'linear-gradient(135deg, #4a148c, #7b1fa2, #e040fb)',
    accentColor: '#e040fb'
  },
  {
    number: '04',
    name: 'Local SLM Benchmark — Test Your Own Models',
    description: 'Full-stack benchmarking app that lets you pit small language models against each other locally via Ollama, with real-time performance analytics and detailed reports.',
    highlights: [
      'Live chat with any local model + real-time token/latency stats',
      'Comprehensive 30-prompt benchmarks across 10 categories',
      'Temperature experiments to visualize randomness effects',
      'Auto-generated reports with rankings, charts & memory analysis'
    ],
    technologies: ['Python', 'FastAPI', 'Ollama', 'Pydantic', 'JavaScript', 'HTML/CSS'],
    github: 'https://github.com/chowhandutta2004-lgtm/-local-slm-benchmark',
    video: 'slm-benchmark.mp4',
    gradient: 'linear-gradient(135deg, #1b5e20, #2e7d32, #00e676)',
    accentColor: '#00e676'
  },
  {
    number: '05',
    name: 'X-Ray Vision — Real-Time Webcam X-Ray Effect',
    description: 'Real-time webcam app that creates sci-fi X-ray visuals — raise both hands to activate a scan zone with skeleton tracking, face mesh, glowing particles, and animated scan lines.',
    highlights: [
      'Hand-controlled scan rectangle using MediaPipe hand landmarks',
      'Multi-body tracking: face (468 pts), hands (21 pts each), pose (33 pts)',
      'Optimized particle system with 2,000 object-pooled particles',
      'Edge detection, skeleton overlay, ripple animations & HUD display'
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'MediaPipe', 'Canvas API'],
    github: 'https://github.com/chowhandutta2004-lgtm/x-ray-vision',
    website: 'https://x-ray-vision.vercel.app/',
    video: 'x ray.mp4',
    gradient: 'linear-gradient(135deg, #0d47a1, #01579b, #00b0ff)',
    accentColor: '#00b0ff'
  }
];

function loadProjects() {
  const container = document.getElementById('projectsContainer');

  container.innerHTML = projects.map(project => `
    <div class="project-flashcard reveal" style="--card-accent: ${project.accentColor}">
      <div class="project-flashcard-bg" style="background: ${project.gradient}"></div>
      ${project.video ? `<video src="${project.video}" class="project-flashcard-img" autoplay muted loop playsinline></video>` : project.image ? `<img src="${project.image}" alt="${project.name}" class="project-flashcard-img"/>` : ''}
      <div class="project-flashcard-overlay"></div>
      <span class="project-flashcard-number">${project.number}</span>
      <div class="project-flashcard-content">
        <h3 class="project-flashcard-title">${project.name}</h3>
        <p class="project-flashcard-desc">${project.description}</p>
        ${project.highlights ? `<div class="project-flashcard-highlights">${project.highlights.map(h => `<span class="project-flashcard-highlight">${h}</span>`).join('')}</div>` : ''}
        <div class="project-flashcard-tags">
          ${project.technologies.map(t => `<span class="project-flashcard-tag">${t}</span>`).join('')}
        </div>
        <div class="project-flashcard-links">
          <a href="${project.github}" target="_blank" class="project-flashcard-link">GitHub →</a>
          ${project.website ? `<a href="${project.website}" target="_blank" class="project-flashcard-link project-flashcard-link-site">Visit Site →</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  observeElements();
  initCardTilt();
}

// ====================================
// 3. CONTACT FORM
// ====================================
async function sendContact() {
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  const status = document.getElementById('contactStatus');

  if (!name || !email || !message) {
    status.textContent = 'Please fill all fields.';
    status.className = 'status-error';
    return;
  }

  status.textContent = 'Sending...';
  status.className = '';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();

    if (data.success) {
      status.textContent = 'Message sent successfully!';
      status.className = 'status-success';
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMessage').value = '';
    } else {
      status.textContent = 'Failed to send. Try again!';
      status.className = 'status-error';
    }
  } catch (error) {
    status.textContent = 'Something went wrong!';
    status.className = 'status-error';
  }
}

// ====================================
// 4. AI CHATBOT
// ====================================
function toggleChat() {
  const body = document.getElementById('chatBody');
  const toggle = document.getElementById('chatToggle');
  body.classList.toggle('hidden');
  toggle.textContent = body.classList.contains('hidden') ? '▼' : '▲';
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const message = input.value.trim();

  if (!message) return;

  messages.innerHTML += `<div class="chat-msg user">${message}</div>`;
  input.value = '';
  messages.innerHTML += `<div class="chat-msg typing" id="typing">AI is thinking...</div>`;
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    document.getElementById('typing').remove();
    messages.innerHTML += `<div class="chat-msg bot">${data.reply || data.error}</div>`;
  } catch (error) {
    document.getElementById('typing').remove();
    messages.innerHTML += `<div class="chat-msg bot">Sorry, something went wrong! Try again.</div>`;
  }

  messages.scrollTop = messages.scrollHeight;
}

document.getElementById('chatInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendChat();
});

// ====================================
// 5. SCROLL REVEAL ANIMATION
// ====================================
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ====================================
// 6. CUSTOM CURSOR
// ====================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

// ====================================
// 7. NAVBAR SCROLL EFFECT
// ====================================
function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ====================================
// 8. LOADER ANIMATION
// ====================================
function initLoader() {
  const loader = document.getElementById('loader');
  const line1 = loader.querySelectorAll('.loader-text:first-child span');
  const line2 = loader.querySelectorAll('.loader-text-2 span');

  const tl = gsap.timeline();

  tl.to(line1, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power3.out'
  })
  .to(line2, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power3.out'
  }, '-=0.2')
  .to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 0.4,
    ease: 'power2.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      initHeroAnimation();
    }
  });
}

// ====================================
// 9. HERO ANIMATION (GSAP)
// ====================================
function initHeroAnimation() {
  // Title lines
  gsap.from('#heroLine1', {
    y: 120,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out'
  });

  gsap.from('#heroLine2', {
    y: 120,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: 'power4.out'
  });

  // Hero card
  gsap.from('#heroCard', {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    ease: 'power3.out'
  });

  // Categories
  gsap.from('.hero-cat', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.8,
    ease: 'power3.out'
  });

  // Hero image
  gsap.from('#heroImage', {
    scale: 1.1,
    opacity: 0,
    duration: 1.5,
    delay: 0.3,
    ease: 'power2.out'
  });
}

// ====================================
// 10. GSAP SCROLL ANIMATIONS
// ====================================
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax — image scales down and fades on scroll
  gsap.to('#heroImage', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    scale: 0.85,
    opacity: 0,
    y: -100
  });

  // Hero title parallax
  gsap.to('.hero-title', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: -200,
    opacity: 0
  });

  // About background text parallax
  gsap.to('#aboutBgText', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: -100,
    scale: 1.05
  });

  // About photo parallax
  gsap.to('#aboutPhoto', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: -60
  });

  // About left blocks
  gsap.utils.toArray('.about-left .about-block').forEach((block, i) => {
    gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // About right blocks
  gsap.utils.toArray('.about-right .about-block').forEach((block, i) => {
    gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });

  // About tagline
  gsap.from('#aboutTagline', {
    scrollTrigger: {
      trigger: '#aboutTagline',
      start: 'top 90%',
      toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // Tech stack icons
  gsap.from('.stack-icon', {
    scrollTrigger: {
      trigger: '.tech-stack',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // Projects header
  gsap.from('.projects-title', {
    scrollTrigger: {
      trigger: '.projects-header',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // Contact title reveal
  gsap.from('#contactTitle', {
    scrollTrigger: {
      trigger: '#contactTitle',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  });

  // Contact cards stagger
  gsap.from('.contact-card', {
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out'
  });
}

// ====================================
// 11. 3D CARD TILT EFFECT
// ====================================
function initCardTilt() {
  document.querySelectorAll('.project-flashcard').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
}

// ====================================
// 12. DRAG TO SCROLL (PROJECTS)
// ====================================
function initDragScroll() {
  const slider = document.getElementById('projectsContainer');
  let isDown = false, startX, scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => isDown = false);
  slider.addEventListener('mouseup', () => isDown = false);
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// ====================================
// INITIALIZE
// ====================================
// ====================================
// MOBILE MENU
// ====================================
function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

window.addEventListener('load', () => {
  loadProjects();
  initCursor();
  initNavScroll();
  initLoader();
  initScrollAnimations();
  initDragScroll();
  observeElements();
  initMobileMenu();
});
