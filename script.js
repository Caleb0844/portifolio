// ======================== SKILLS & SERVICES DATA ========================
const skillsArray = [
  "Python", "LLMs", " Automation)",
  "API Integration REST", "Google CLoud, Prompt Engineering"
];
const servicesArray = [
  "AI Workflow Consulting", "Custom Automation Development", "Chatbot Implementation",
  "System Integration", "Process Mining & Optimization", "Training & Workshops"
];

// ======================== PROJECT CARD COMPONENT (OOP) ========================
class ProjectCard {
  constructor(projectData, containerId, modalController) {
    this.title = projectData.title;
    this.description = projectData.description;
    this.fullDetails = projectData.fullDetails;
    this.container = document.getElementById(containerId);
    this.modalCtrl = modalController; // reference to open modal
  }

  render() {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-content">
        <h3 class="project-title">${this.title}</h3>
        <p class="project-desc">${this.description}</p>
        <button class="btn-view view-details-btn">View More →</button>
      </div>
    `;
    const btn = card.querySelector('.view-details-btn');
    btn.addEventListener('click', () => {
      this.modalCtrl.showDetails(this.title, this.fullDetails);
    });
    return card;
  }

  appendToGrid() {
    if (this.container) {
      this.container.appendChild(this.render());
    }
  }
}

// ======================== MODAL CONTROLLER (same page) ========================
class ModalController {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.modalBody = document.getElementById('modalBody');
    this.closeBtn = this.modal.querySelector('.close-modal');
    this.initEvents();
  }

  initEvents() {
    this.closeBtn.addEventListener('click', () => this.hide());
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });
  }

  showDetails(title, details) {
    this.modalBody.innerHTML = `
      <h3>${title}</h3>
      <p><strong>Overview</strong><br>${details.overview}</p>
      <div class="tech"><strong> Tech Stack</strong><br>${details.techStack}</div>
      <div class="results"><strong>✨ Key Results</strong><br>${details.results.replace(/\n/g, '<br>')}</div>
    `;
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  hide() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ======================== SKILLS MANAGER (reusable) ========================
class SkillsManager {
  constructor(skillsArray, servicesArray) {
    this.skills = skillsArray;
    this.services = servicesArray;
  }

  populateSkills(ulId) {
    const ul = document.getElementById(ulId);
    if (ul) ul.innerHTML = this.skills.map(s => `<li>${s}</li>`).join('');
  }

  populateServices(ulId) {
    const ul = document.getElementById(ulId);
    if (ul) ul.innerHTML = this.services.map(s => `<li>${s}</li>`).join('');
  }
}

// ======================== DARK MODE TOGGLE ========================
function initDarkMode() {
  const toggle = document.getElementById('themeToggle');
  const prefersDark = localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (prefersDark) document.body.classList.add('dark');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('open')) {
      icon.className = 'fas fa-times';
      menuToggle.setAttribute('aria-label', 'Close menu');
    } else {
      icon.className = 'fas fa-bars';
      menuToggle.setAttribute('aria-label', 'Open menu');
    }
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.querySelector('i').className = 'fas fa-bars';
      menuToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

// ======================== HERO BACKGROUND FADE ON SCROLL ========================
function initHeroScrollFade() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight * 0.8;
    let opacity = Math.max(0.3, 1 - (scrollY / maxScroll));
    opacity = Math.min(1, opacity);
    heroBg.style.opacity = opacity;
  });
}

// ======================== SMOOTH SCROLL & STICKY NAV ========================
function initSmoothScroll() {
  document.querySelectorAll('.nav-links a, .btn-primary[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initStickyNav() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 5px 20px rgba(0,0,0,0.1)' : 'none';
  });
}

// ======================== INITIALIZE EVERYTHING ========================
document.addEventListener('DOMContentLoaded', () => {
  // Create modal controller first
  const modalCtrl = new ModalController('projectModal');

  // Render projects using OOP card component
  const projectsGrid = document.getElementById('projectsGrid');
  if (projectsGrid) {
    projectsGrid.innerHTML = '';
    projectsData.forEach(project => {
      const card = new ProjectCard(project, 'projectsGrid', modalCtrl);
      card.appendToGrid();
    });
  }

  // Skills & services
  const skillsManager = new SkillsManager(skillsArray, servicesArray);
  skillsManager.populateSkills('skillsList');
  skillsManager.populateServices('servicesList');

  // Features
  initDarkMode();
  initMobileMenu();
  initHeroScrollFade();
  initSmoothScroll();
  initStickyNav();
});

