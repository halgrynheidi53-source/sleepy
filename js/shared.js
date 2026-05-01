/* ============================================
   SLEEPY WEBSITE — shared.js
   Nav, animations, data loading utilities
   ============================================ */

// ---- Load site data ----
let siteData = null;

async function loadSiteData() {
  if (siteData) return siteData;
  try {
    const res = await fetch('data/site.json');
    siteData = await res.json();
    return siteData;
  } catch (e) {
    console.error('Could not load site data:', e);
    return null;
  }
}

// ---- Inject Navbar ----
async function injectNav(activePage) {
  const data = await loadSiteData();
  if (!data) return;

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <span class="logo-dot"></span>
        ${data.creator.name}
      </a>
      <ul class="nav-links" id="navLinks">
        ${data.nav.map(item => `
          <li><a href="${item.href}" class="${activePage === item.label ? 'active' : ''}">${item.label}</a></li>
        `).join('')}
      </ul>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  document.body.prepend(nav);

  // Hamburger
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

// ---- Inject Footer ----
async function injectFooter() {
  const data = await loadSiteData();
  if (!data) return;

  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-logo">${data.creator.name}</div>
    <p>© ${new Date().getFullYear()} ${data.creator.name} · All rights reserved · ${data.creator.tagline}</p>
    <div style="margin-top:14px;display:flex;justify-content:center;gap:12px;">
      <a href="${data.socials.youtube.url}" target="_blank" class="social-icon" title="YouTube">▶</a>
      <a href="${data.socials.tiktok.url}" target="_blank" class="social-icon" title="TikTok">♪</a>
    </div>
  `;

  document.body.appendChild(footer);
}

// ---- Scroll reveal ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// ---- Particle canvas background ----
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.15,
    color: Math.random() > 0.5 ? '0,245,255' : '0,128,255'
  }));

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Typewriter effect ----
function typewriter(el, text, speed = 60) {
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    }
  }
  tick();
}

// ---- Number count-up ----
function countUp(el, target, duration = 1800) {
  const isK = typeof target === 'string' && target.includes('K');
  const isPlus = typeof target === 'string' && target.includes('+');
  const isComma = typeof target === 'string' && target.includes(',');
  const num = parseFloat(String(target).replace(/[^0-9.]/g, ''));

  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * num);
    let display = isComma
      ? current.toLocaleString()
      : String(current);
    if (isK) display += 'K';
    if (isPlus) display += '+';
    el.textContent = display;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
