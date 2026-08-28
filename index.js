/* -----------------------------------------
  Scroll Progress Bar + Nav Shadow
 ---------------------------------------- */

(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  const navRow = document.querySelector('.nav-row');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Progress bar
    if (bar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }

    // Nav shadow on scroll
    if (navRow) {
      navRow.classList.toggle('scrolled', scrollTop > 20);
    }
  }, { passive: true });
})();

/* -----------------------------------------
  Typewriter Role Cycler
 ---------------------------------------- */

(function initTypewriter() {
  const el = document.querySelector('.hero-typewriter');
  if (!el) return;

  const roles = [
    'Full-Stack Developer',
    'Vue.js Engineer',
    'PHP / Laravel Dev',
    'Mobile App Builder',
    'UI Craftsman',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED = 70;
  const DELETE_SPEED = 40;
  const PAUSE_END = 1800;
  const PAUSE_START = 300;

  function tick() {
    const current = roles[roleIndex];
    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    }
  }

  // Start after a short delay so page load feels clean
  setTimeout(tick, 600);
})();

/* -----------------------------------------
  Particle Network Canvas
 ---------------------------------------- */

(function initParticles() {
  const canvas = document.querySelector('.hero-portal__particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 55;
  const CONNECTION_DIST = 120;
  const SPEED = 0.35;
  let W, H, particles;

  function resize() {
    const portal = canvas.parentElement;
    W = canvas.width  = portal.offsetWidth;
    H = canvas.height = portal.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.8 + 0.8,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Dots
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  // Only run if not reduced-motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    init();
    draw();
    window.addEventListener('resize', () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
    }, { passive: true });
  }
})();

/* -----------------------------------------
  Active Nav Link on Scroll
 ---------------------------------------- */

(function initActiveNav() {
  const sections = ['work', 'experience', 'about', 'contact'];
  const links = {};
  sections.forEach(id => {
    links[id] = document.querySelector(`.nav__link[href="#${id}"]`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (links[id]) {
        links[id].classList.toggle('nav__link--active', entry.isIntersecting);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

/* -----------------------------------------
  3D Cyber Glass Hero Portal & Parallax
 ---------------------------------------- */

(function init3DHeroPortal() {
  const initGSAP = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const heroHeader = document.querySelector('.header');
    const heroWrapper = document.querySelector('.hero-portal-wrapper');
    const heroPortal = document.querySelector('.hero-portal');
    const textContent = document.querySelector('.header__text');
    const scrollIndicator = document.querySelector('.header__scroll');
    const tags = document.querySelectorAll('.hero-portal__tag');

    if (!heroPortal || !heroHeader || !heroWrapper) return;

    // 1. Mouse 3D Tilt Parallax Effect
    const xTo = gsap.quickTo(heroPortal, 'rotateY', { duration: 0.6, ease: 'power2.out' });
    const yTo = gsap.quickTo(heroPortal, 'rotateX', { duration: 0.6, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * -14;
      xTo(x);
      yTo(y);
    }, { passive: true });

    // 2. GSAP ScrollTrigger Hyperspace Portal Zoom Animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroHeader,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: heroWrapper,
        anticipatePin: 1,
      }
    });

    // Zoom portal outward seamlessly into the portfolio content
    tl.to(heroPortal, {
      scale: 2.2,
      opacity: 0,
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.inOut',
    }, 0)
    .to(textContent, {
      scale: 1.15,
      opacity: 0,
      y: -50,
      ease: 'power2.in',
    }, 0)
    .to(scrollIndicator, {
      opacity: 0,
      y: 40,
      ease: 'power1.out',
    }, 0);

    // Disperse tech tags outward with 3D depth
    tags.forEach((tag, i) => {
      const dirX = (i % 2 === 0 ? -1 : 1) * 220;
      const dirY = (i < 2 ? -1 : 1) * 160;
      tl.to(tag, {
        x: dirX,
        y: dirY,
        opacity: 0,
        scale: 1.6,
        ease: 'power2.in',
      }, 0);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }
})();

/* -----------------------------------------
  Focus outline only for keyboard users
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
};

window.addEventListener('keydown', handleFirstTab);

/* -----------------------------------------
  Back to top button
 ---------------------------------------- */

const backToTopButton = document.querySelector('.back-to-top');
let isBackToTopRendered = false;

window.addEventListener('scroll', () => {
  const visible = window.scrollY > 700;
  if (visible !== isBackToTopRendered) {
    isBackToTopRendered = visible;
    backToTopButton.classList.toggle('visible', visible);
  }
}, { passive: true });

/* -----------------------------------------
  Contact form handler (Mailto)
 ---------------------------------------- */

function handleMailtoForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.contact__submit');

  const name = form.querySelector('#c-name').value;
  const email = form.querySelector('#c-email').value;
  const message = form.querySelector('#c-message').value;

  const subject = `Portfolio Contact from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const mailtoLink = `mailto:abemelwin01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  btn.textContent = 'Opening Email…';
  btn.disabled = true;

  setTimeout(() => {
    window.location.href = mailtoLink;
    btn.textContent = 'Send Message';
    btn.disabled = false;
    form.reset();
  }, 500);
}

/* -----------------------------------------
  Scroll fade-in animation
 ---------------------------------------- */

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly for a cascade effect
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 120;
      });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* -----------------------------------------
  Animated stat counters
 ---------------------------------------- */

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const step = target / (duration / 16);
  let current = 0;

  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target;
    } else {
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.about__stat-num[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutContent = document.querySelector('.about__content');
if (aboutContent) statsObserver.observe(aboutContent);

/* -----------------------------------------
  Footer year
 ---------------------------------------- */

const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* -----------------------------------------
  Apply locked-project badges
 ---------------------------------------- */

// Locked styling is now applied directly during card generation

/* -----------------------------------------
  Auto-fetch GitHub repos (public + private)
  and render project cards with descriptions
 ---------------------------------------- */

(async function loadGitHubProjects() {
  const workSection = document.querySelector('.work[data-github-username]');
  if (!workSection) return;

  const username = workSection.dataset.githubUsername;
  const container = document.getElementById('github-projects');
  const loadingEl = document.getElementById('github-loading');
  if (!container) return;

  const showProjectsMessage = (message) => {
    container.innerHTML = `<p class="github-projects__message">${escapeHtml(message)} <a href="https://github.com/${encodeURIComponent(username)}" target="_blank" rel="noopener noreferrer">View GitHub profile</a>.</p>`;
  };

  // Repos to always skip (config repos, profile readme, portfolio itself)
  const SKIP_REPOS = new Set([
    username.toLowerCase(),
    '.github',
    'portfolio',
  ]);

  let repos = [];
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        repos = await res.json();
        break;
      } finally {
        clearTimeout(timeout);
      }
    }
  } catch (err) {
    console.warn('GitHub projects fetch failed:', err);
  }

  // Hide loading skeleton
  if (loadingEl) loadingEl.classList.add('github-loading--hidden');

  if (!Array.isArray(repos) || repos.length === 0) {
    showProjectsMessage('Projects are temporarily unavailable.');
    return;
  }

  // Filter out skipped repos (portfolio, .github, profile readme)
  const displayRepos = repos.filter(r => !SKIP_REPOS.has(r.name.toLowerCase()));

  if (displayRepos.length === 0) {
    showProjectsMessage('No public projects found yet.');
    return;
  }

  container.innerHTML = '';

  // Build a card for each real repo
  displayRepos.forEach((repo, index) => {
    const isReverse = index % 2 !== 0;
    const isPrivate = repo.private;

    const card = document.createElement('div');
    card.className = `work__box${isReverse ? ' work__box--reverse' : ''} fade-in visible`;
    card.dataset.repo = repo.name;

    // Format project name
    const formattedName = repo.name
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    // Determine tag
    const getTag = (language, isPrivate, topics = []) => {
      if (isPrivate) return 'Private Project';
      const t = topics.map(t => t.toLowerCase());
      // Check topics first for more accurate classification
      if (t.some(t => ['android', 'ios', 'react-native', 'native', 'expo', 'flutter', 'mobile'].includes(t))) return 'Mobile App';
      if (t.some(t => ['cli', 'terminal', 'command-line', 'shell'].includes(t))) return 'CLI Tool';
      if (t.some(t => ['api', 'rest-api', 'graphql', 'backend', 'server'].includes(t))) return 'Backend';
      if (t.some(t => ['fullstack', 'full-stack'].includes(t))) return 'Full-Stack';
      if (!language) return 'Project';
      const l = language.toLowerCase();
      if (['javascript', 'typescript', 'vue', 'react'].includes(l)) return 'Web App';
      if (['php', 'python', 'ruby', 'go'].includes(l)) return 'Full-Stack';
      if (['c#', 'java', 'c++', 'c'].includes(l)) return 'Application';
      if (['html', 'css', 'scss'].includes(l)) return 'Frontend';
      return 'Project';
    };

    // Topics/tags from GitHub
    const topicsHtml = (repo.topics && repo.topics.length > 0)
      ? repo.topics.map(t => `<li>${escapeHtml(t)}</li>`).join('')
      : (repo.language ? `<li>${escapeHtml(repo.language)}</li>` : '');

    // Mockup color
    const mockupColors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];
    const colorIndex = repo.name.length % mockupColors.length;
    const accentColor = mockupColors[colorIndex];

    // Stars & forks
    const stars = repo.stargazers_count > 0
      ? `<span class="github-projects__meta-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
             fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           ${repo.stargazers_count}
         </span>` : '';

    const forks = repo.forks_count > 0
      ? `<span class="github-projects__meta-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
             <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
             <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/>
           </svg>
           ${repo.forks_count}
         </span>` : '';

    const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short'
    });

    // Description — use GitHub About description
    const description = repo.description || 'A development project showcasing technical skills and problem-solving.';

    // Links section — different for private vs public
    const linksHtml = isPrivate
      ? `<button type="button" class="btn btn--outline request-access-btn" data-project="${escapeHtml(formattedName)}">Request Access</button>`
      : `<a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="link__text">
            View on GitHub <span>&rarr;</span>
          </a>`;

    // Mockup screen content — different for private vs public
    const mockupContent = isPrivate
      ? `<div class="mockup-github-card">
              <div class="mockup-github-card__icon" style="color: ${accentColor}">🔒</div>
              <div class="mockup-github-card__name">${escapeHtml(formattedName)}</div>
              <div class="mockup-github-card__desc">${escapeHtml(description)}</div>
              <div class="mockup-github-card__stats">
                <span class="mockup-github-card__lang" style="color: ${accentColor}">Private</span>
              </div>
            </div>`
      : `<div class="mockup-github-card">
              <div class="mockup-github-card__icon" style="color: ${accentColor}">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </div>
              <div class="mockup-github-card__name">${escapeHtml(formattedName)}</div>
              <div class="mockup-github-card__desc">${escapeHtml(description)}</div>
              <div class="mockup-github-card__stats">
                ${repo.language ? `<span class="mockup-github-card__lang" style="color: ${accentColor}">${escapeHtml(repo.language)}</span>` : ''}
                <span>★ ${repo.stargazers_count}</span>
                <span>⑂ ${repo.forks_count}</span>
              </div>
            </div>`;

    card.innerHTML = `
      <div class="work__text">
        <span class="work__tag">${getTag(repo.language, isPrivate, repo.topics || [])}</span>
        <h3>${escapeHtml(formattedName)}</h3>
        <p class="work__desc">${escapeHtml(description)}</p>
        <ul class="work__list">
          ${topicsHtml}
        </ul>
        <div class="github-projects__meta">
          ${stars}
          ${forks}
          <span class="github-projects__meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            ${updatedDate}
          </span>
        </div>
        <div class="work__links">
          ${linksHtml}
        </div>
      </div>
      <div class="work__image-box">
        <div class="mockup-browser">
          <div class="mockup-browser__bar">
            <span class="mockup-browser__dot mockup-browser__dot--red"></span>
            <span class="mockup-browser__dot mockup-browser__dot--yellow"></span>
            <span class="mockup-browser__dot mockup-browser__dot--green"></span>
            <div class="mockup-browser__url">${escapeHtml(repo.name)}</div>
          </div>
          <div class="mockup-browser__screen mockup-github-screen">
            ${mockupContent}
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
    fadeObserver.observe(card);
  });

  // Update project count in subtitle
  const countEl = document.getElementById('project-count');
  if (countEl && displayRepos.length > 0) {
    countEl.textContent = `${displayRepos.length} project${displayRepos.length !== 1 ? 's' : ''} and counting.`;
  }
})();

/* -----------------------------------------
  Request Access modal handling (FormSubmit)
 ---------------------------------------- */
const raModal = document.getElementById('request-access-modal');
const raForm = document.getElementById('request-access-form');
const raProjectInput = document.getElementById('request-project');
const raStatus = document.getElementById('ra-status');

function openRequestModal(project) {
  if (!raModal) return;
  raProjectInput.value = project || '';
  raStatus.textContent = '';
  raModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const nameInput = document.getElementById('ra-name');
  if (nameInput) nameInput.focus();
}

function closeRequestModal() {
  if (!raModal) return;
  raModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.request-access-btn');
  if (btn) {
    const project = btn.dataset.project || '';
    openRequestModal(project);
    return;
  }
  const closers = e.target.closest && e.target.closest('[data-action="close"]');
  if (closers) {
    closeRequestModal();
  }
});

if (raForm) {
  raForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = raForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    const formData = new FormData(raForm);
    // Include the project in the message body if not already present
    const project = formData.get('project');
    const message = `${formData.get('message')}\n\nRequested project: ${project}`;
    formData.set('message', message);

    try {
      const res = await fetch('https://formsubmit.co/ajax/abemelwin01@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      const json = await res.json();
      if (res.ok) {
        raStatus.textContent = 'Request sent — I will reply by email.';
        raForm.reset();
        setTimeout(() => closeRequestModal(), 1500);
      } else {
        raStatus.textContent = json.message || 'Failed to send request.';
      }
    } catch (err) {
      console.error('Request Access send failed', err);
      raStatus.textContent = 'Network error — please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Request';
    }
  });
}

/* -----------------------------------------
  HTML escape helper
 ---------------------------------------- */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* -----------------------------------------
  Hover Video Preview Animation
  Injects animated "playing" overlay into
  each project card's mockup screen
 ---------------------------------------- */

(function initHoverPreviews() {
  // Code snippets by language — looks like a video of dev work
  const codeSnippets = {
    JavaScript: [
      { prompt: '$', command: 'npm run dev' },
      { comment: '// Starting development server...' },
      { code: '<span class="mockup-preview__keyword">const</span> <span class="mockup-preview__variable">app</span> <span class="mockup-preview__operator">=</span> <span class="mockup-preview__function">createApp</span>()' },
      { code: '<span class="mockup-preview__variable">app</span>.<span class="mockup-preview__function">use</span>(<span class="mockup-preview__variable">router</span>)' },
      { code: '<span class="mockup-preview__variable">app</span>.<span class="mockup-preview__function">mount</span>(<span class="mockup-preview__string">\'#app\'</span>)' },
      { comment: '// ✓ Server running on port 3000' },
    ],
    TypeScript: [
      { prompt: '$', command: 'tsc --watch' },
      { comment: '// Compiling TypeScript...' },
      { code: '<span class="mockup-preview__keyword">interface</span> <span class="mockup-preview__function">ApiResponse</span>&lt;T&gt; {' },
      { code: '  <span class="mockup-preview__variable">data</span>: T[]' },
      { code: '  <span class="mockup-preview__variable">status</span>: <span class="mockup-preview__string">number</span>' },
      { code: '}' },
    ],
    Vue: [
      { prompt: '$', command: 'npm run dev' },
      { comment: '// Hot reload enabled' },
      { code: '&lt;<span class="mockup-preview__keyword">template</span>&gt;' },
      { code: '  &lt;<span class="mockup-preview__function">div</span> <span class="mockup-preview__variable">class</span>=<span class="mockup-preview__string">"app"</span>&gt;' },
      { code: '    &lt;<span class="mockup-preview__function">RouterView</span> /&gt;' },
      { code: '  &lt;/<span class="mockup-preview__function">div</span>&gt;' },
    ],
    PHP: [
      { prompt: '$', command: 'php artisan serve' },
      { comment: '// Laravel dev server started' },
      { code: '<span class="mockup-preview__keyword">class</span> <span class="mockup-preview__function">UserController</span>' },
      { code: '{' },
      { code: '  <span class="mockup-preview__keyword">public function</span> <span class="mockup-preview__function">index</span>()' },
      { code: '  { <span class="mockup-preview__keyword">return</span> <span class="mockup-preview__function">view</span>(<span class="mockup-preview__string">\'users\'</span>); }' },
    ],
    Python: [
      { prompt: '$', command: 'python manage.py runserver' },
      { comment: '# Starting Django server...' },
      { code: '<span class="mockup-preview__keyword">class</span> <span class="mockup-preview__function">UserView</span>(APIView):' },
      { code: '  <span class="mockup-preview__keyword">def</span> <span class="mockup-preview__function">get</span>(self, request):' },
      { code: '    <span class="mockup-preview__variable">users</span> <span class="mockup-preview__operator">=</span> User.objects.<span class="mockup-preview__function">all</span>()' },
      { code: '    <span class="mockup-preview__keyword">return</span> <span class="mockup-preview__function">Response</span>(<span class="mockup-preview__variable">users</span>)' },
    ],
    HTML: [
      { prompt: '$', command: 'live-server --port=3000' },
      { comment: '// Building responsive layout...' },
      { code: '&lt;<span class="mockup-preview__keyword">section</span> <span class="mockup-preview__variable">class</span>=<span class="mockup-preview__string">"hero"</span>&gt;' },
      { code: '  &lt;<span class="mockup-preview__function">h1</span>&gt;Welcome&lt;/<span class="mockup-preview__function">h1</span>&gt;' },
      { code: '  &lt;<span class="mockup-preview__function">p</span>&gt;Modern UI&lt;/<span class="mockup-preview__function">p</span>&gt;' },
      { code: '&lt;/<span class="mockup-preview__keyword">section</span>&gt;' },
    ],
    default: [
      { prompt: '$', command: 'git pull && npm install' },
      { comment: '// Setting up project...' },
      { code: '<span class="mockup-preview__keyword">import</span> { <span class="mockup-preview__variable">config</span> } <span class="mockup-preview__keyword">from</span> <span class="mockup-preview__string">\'./config\'</span>' },
      { code: '<span class="mockup-preview__keyword">const</span> <span class="mockup-preview__variable">app</span> <span class="mockup-preview__operator">=</span> <span class="mockup-preview__function">init</span>(<span class="mockup-preview__variable">config</span>)' },
      { code: '<span class="mockup-preview__variable">app</span>.<span class="mockup-preview__function">start</span>()' },
      { comment: '// ✓ Ready' },
    ]
  };

  function getSnippet(language) {
    if (!language) return codeSnippets.default;
    const lang = language.trim();
    if (codeSnippets[lang]) return codeSnippets[lang];
    // Map common languages
    const map = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'vue': 'Vue',
      'php': 'PHP',
      'python': 'Python',
      'html': 'HTML',
      'css': 'HTML',
      'scss': 'HTML',
    };
    const mapped = map[lang.toLowerCase()];
    return mapped ? codeSnippets[mapped] : codeSnippets.default;
  }

  function buildPreviewHTML(snippet) {
    let lines = '';
    snippet.forEach(item => {
      if (item.prompt) {
        lines += `<div class="mockup-preview__line">
          <span class="mockup-preview__prompt">${item.prompt}</span>
          <span class="mockup-preview__command">${item.command}</span>
        </div>`;
      } else if (item.comment) {
        lines += `<div class="mockup-preview__line">
          <span class="mockup-preview__comment">${item.comment}</span>
        </div>`;
      } else if (item.code) {
        lines += `<div class="mockup-preview__line">${item.code}</div>`;
      }
    });

    // Add blinking cursor to last line
    lines += `<div class="mockup-preview__line"><span class="mockup-preview__cursor"></span></div>`;

    return `
      <div class="mockup-preview">
        <span class="mockup-preview__play-indicator">
          <span class="mockup-preview__play-dot"></span>
          LIVE
        </span>
        <div class="mockup-preview__terminal">
          ${lines}
        </div>
        <div class="mockup-preview__activity">
          <div class="mockup-preview__activity-bar">
            <div class="mockup-preview__activity-fill"></div>
          </div>
          <span class="mockup-preview__activity-label">compiling...</span>
        </div>
        <div class="mockup-preview__progress">
          <div class="mockup-preview__progress-bar"></div>
        </div>
      </div>
    `;
  }

  // Watch for project cards being added to the DOM, then inject previews
  function injectPreviews() {
    const cards = document.querySelectorAll('.work__box');
    cards.forEach(card => {
      if (card.dataset.previewInjected) return;
      card.dataset.previewInjected = 'true';

      const screen = card.querySelector('.mockup-browser__screen');
      if (!screen) return;

      // Determine language from the card's tech list or repo data
      let language = null;
      const techList = card.querySelector('.work__list li');
      if (techList) language = techList.textContent.trim();
      // Fallback: check for mockup-github-card__lang
      if (!language) {
        const langEl = card.querySelector('.mockup-github-card__lang');
        if (langEl && langEl.textContent !== 'Private') {
          language = langEl.textContent.trim();
        }
      }

      const snippet = getSnippet(language);
      screen.insertAdjacentHTML('beforeend', buildPreviewHTML(snippet));
    });
  }

  // Initial injection (for any static cards)
  injectPreviews();

  // Observe for dynamically added cards (GitHub fetch)
  const projectContainer = document.getElementById('github-projects');
  if (projectContainer) {
    const observer = new MutationObserver(() => {
      injectPreviews();
    });
    observer.observe(projectContainer, { childList: true, subtree: true });
  }
})();
