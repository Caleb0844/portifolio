/* =============================================
   CALEB PORTFOLIO — script.js
   ============================================= */

// ── RENDER LISTS ──────────────────────────────
function renderList(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = arr.map(item => `<li>${esc(item)}</li>`).join('');
}

// ── ESCAPE HTML ───────────────────────────────
function esc(str) {
  return String(str).replace(/[&<>"']/g, m =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])
  );
}

// ── MODAL ─────────────────────────────────────
const modal     = document.getElementById('modal');
const modalBox  = modal ? modal.querySelector('.modal-box') : null;
const modalCont = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function openModal(project) {
  if (!modal || !modalCont) return;
  const resultsHtml = project.results
    .map(r => `<li>${esc(r)}</li>`)
    .join('');
  modalCont.innerHTML = `
    <div class="modal-tag">// project_details</div>
    <h3>${esc(project.title)}</h3>
    <p class="modal-overview">${esc(project.description)}</p>
    <div class="modal-stack-lbl">TECH_STACK</div>
    <div class="modal-stack">${esc(project.techStack)}</div>
    <div class="modal-results">
      <strong>// KEY_RESULTS</strong>
      <ul>${resultsHtml}</ul>
    </div>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Focus close for accessibility
  setTimeout(() => modalClose && modalClose.focus(), 100);
}

function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ── BUILD PROJECT CARDS ────────────────────────
function buildProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid || typeof PROJECTS === 'undefined') return;
  grid.innerHTML = '';
  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.innerHTML = `
      <div class="project-tag">${esc(p.tag)}</div>
      <div class="project-icon"><i class="fas ${esc(p.icon)}"></i></div>
      <h3 class="project-title">${esc(p.title)}</h3>
      <p class="project-desc">${esc(p.description)}</p>
      <button class="btn-view">View details <i class="fas fa-arrow-right" style="font-size:.7rem"></i></button>
    `;
    card.querySelector('.btn-view').addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

// ── MOBILE MENU ───────────────────────────────
function initMobileMenu() {
  const toggle   = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="fas fa-bars"></i>';
  }

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close on any nav link click (so mobile nav buttons actually navigate)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

// ── SMOOTH SCROLL ─────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── STICKY NAV ────────────────────────────────
function initStickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── ACTIVE NAV HIGHLIGHT ──────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const navH     = document.getElementById('navbar')?.offsetHeight || 70;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: `-${navH}px 0px -60% 0px` });

  sections.forEach(s => observer.observe(s));
}

// ── SCROLL REVEAL ─────────────────────────────
function initReveal() {
  const els = document.querySelectorAll(
    '.project-card, .cap-card, .clink, .about-img-col, .about-content, .stat'
  );
  els.forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── CONTACT FORM ──────────────────────────────
function initForm() {
  const btn    = document.getElementById('sendBtn');
  const okMsg  = document.getElementById('formOk');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name  = document.getElementById('fname')?.value.trim();
    const email = document.getElementById('femail')?.value.trim();
    const msg   = document.getElementById('fmsg')?.value.trim();

    if (!name || !email || !msg) {
      alert('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Show success
    if (okMsg) {
      okMsg.classList.remove('hidden');
      setTimeout(() => okMsg.classList.add('hidden'), 5000);
    }
    document.getElementById('fname').value  = '';
    document.getElementById('femail').value = '';
    document.getElementById('fmsg').value   = '';
  });
}

// ── MODAL EVENTS ──────────────────────────────
function initModal() {
  if (!modal) return;

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildProjects();

  if (typeof SKILLS   !== 'undefined') renderList('skillsList',   SKILLS);
  if (typeof SERVICES !== 'undefined') renderList('servicesList', SERVICES);

  initMobileMenu();
  initSmoothScroll();
  initStickyNav();
  initActiveNav();
  initReveal();
  initForm();
  initModal();
});