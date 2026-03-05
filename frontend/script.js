// ====================================
// script.js — Connects frontend to backend
// ====================================

// ====================================
// 1. VISITOR COUNTER
// Calls backend to count every visit
// ====================================
async function countVisitor() {
    try {
      const response = await fetch('/api/visitors');
      const data = await response.json();
      
      // Update the visitor count in the nav
      document.getElementById('visitorCount').textContent = data.count;
    } catch (error) {
      console.error('Visitor count error:', error);
    }
  }
  
  // ====================================
  // 2. LOAD PROJECTS
  // Fetches projects from backend
  // ====================================
  const projects = [
    {
      number: '01',
      name: 'Advanced OCR System with CNN and GAN',
      description: 'Built an advanced Optical Character Recognition system combining CNNs for character detection and Generative AI (GANs) for data augmentation and context-aware interpretation of handwritten text.',
      details: [
        'Developed CNN architecture to extract spatial features and classify handwritten characters with high accuracy',
        'Implemented GAN-based synthetic data generation to augment training dataset and improve model robustness',
        'Integrated context-aware interpretation layer using Generative AI for semantic understanding',
        'Achieved real-time recognition with scalable pipeline adaptable for multi-language datasets'
      ],
      technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'GAN', 'NumPy', 'Pandas', 'Jupyter'],
      github: 'https://github.com/chowhandutta2004-lgtm/Handwritten-Character-Recognition-using-CNN-and-Generative-AI'
    }
  ];
  
  function loadProjects() {
    const container = document.getElementById('projectsContainer');
    
    container.innerHTML = projects.map(project => `
      <div class="project-card reveal">
        <div class="project-number">${project.number}</div>
        <h3 class="project-name">${project.name}</h3>
        <p class="project-desc">${project.description}</p>
        <ul class="project-details">
          ${project.details.map(d => `<li>${d}</li>`).join('')}
        </ul>
        <div class="project-tech">
          ${project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <a href="${project.github}" target="_blank" class="project-link">
          View on GitHub ↗
        </a>
      </div>
    `).join('');
  
    // Trigger reveal animation on loaded projects
    observeElements();
  }
  
  // ====================================
  // 3. CONTACT FORM
  // Sends form data to backend
  // ====================================
  async function sendContact() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    const status = document.getElementById('contactStatus');
  
    // Validate fields
    if (!name || !email || !message) {
      status.textContent = '⚠️ Please fill all fields!';
      status.className = 'status-error';
      return;
    }
  
    // Show loading state
    status.textContent = '⏳ Sending...';
    status.className = '';
  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
  
      const data = await response.json();
  
      if (data.success) {
        status.textContent = '✅ Message sent successfully!';
        status.className = 'status-success';
        // Clear the form
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMessage').value = '';
      } else {
        status.textContent = '❌ Failed to send. Try again!';
        status.className = 'status-error';
      }
    } catch (error) {
      status.textContent = '❌ Something went wrong!';
      status.className = 'status-error';
    }
  }
  
  // ====================================
  // 4. AI CHATBOT
  // Sends messages to Hugging Face via backend
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
  
    // Don't send empty messages
    if (!message) return;
  
    // Show user message
    messages.innerHTML += `
      <div class="chat-msg user">${message}</div>
    `;
  
    // Clear input
    input.value = '';
  
    // Show typing indicator
    messages.innerHTML += `
      <div class="chat-msg typing" id="typing">AI is thinking...</div>
    `;
  
    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
  
      const data = await response.json();
  
      // Remove typing indicator
      document.getElementById('typing').remove();
  
      // Show AI reply
      messages.innerHTML += `
        <div class="chat-msg bot">${data.reply || data.error}</div>
      `;
  
    } catch (error) {
      document.getElementById('typing').remove();
      messages.innerHTML += `
        <div class="chat-msg bot">Sorry, something went wrong! Try again.</div>
      `;
    }
  
    // Scroll to bottom again
    messages.scrollTop = messages.scrollHeight;
  }
  
  // Allow pressing Enter to send chat
  document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendChat();
  });
  
  // ====================================
  // 5. SCROLL REVEAL ANIMATION
  // Elements fade in as you scroll down
  // ====================================
  function observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }
  
  // ====================================
  // INITIALIZE — Run when page loads
  // ====================================
  window.addEventListener('load', () => {
    countVisitor();   // Count this visit
    loadProjects();   // Load projects
    observeElements(); // Start scroll animations
  });