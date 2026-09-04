/**
 * Happy Teacher's Day — script.js
 * Handles: floating petals, hearts, confetti, parallax, burst effect
 */

/* ── Utility ────────────────────────────────────────────── */
const rand  = (min, max) => Math.random() * (max - min) + min;
const randI = (min, max) => Math.floor(rand(min, max));

/* ── Config ─────────────────────────────────────────────── */
const PETAL_COUNT   = 18;
const HEART_RATE_MS = 900;   // one new floating heart every N ms
const CONFETTI_BURST = 55;   // pieces per "Say Thanks" click

// Petal colours / sizes for SVG
const PETAL_COLORS = [
  '#f7c5d0', '#e8849a', '#c0405a', '#d4a046',
  '#f9cdd8', '#fce8d8', '#e8a0b0', '#f0c86a',
];

/* ── 1. SVG Petal Generator ─────────────────────────────── */
(function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  /**
   * Draw a simple 5-petal hibiscus-style flower as an SVG string.
   * r  = petal radius,  fill = colour,  cx/cy = viewBox centre
   */
  function petalSVG(fill, r = 16) {
    const petals = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * 360;
      petals.push(
        `<ellipse cx="0" cy="-${r * 0.9}" rx="${r * 0.38}" ry="${r * 0.72}"
          fill="${fill}" opacity="0.88"
          transform="rotate(${angle})" />`
      );
    }
    // Centre circle
    petals.push(`<circle cx="0" cy="0" r="${r * 0.28}" fill="#f0c86a" opacity="0.9"/>`);
    const size = r * 2.2;
    return `<svg xmlns="http://www.w3.org/2000/svg"
      viewBox="-${size/2} -${size/2} ${size} ${size}"
      width="${size}" height="${size}">
      <g>${petals.join('')}</g>
    </svg>`;
  }

  /**
   * Draw a simple organic petal (single teardrop).
   */
  function singlePetalSVG(fill) {
    const r = randI(10, 22);
    return `<svg xmlns="http://www.w3.org/2000/svg"
      viewBox="-${r} -${r*1.8} ${r*2} ${r*3.2}"
      width="${r*2}" height="${r*3.2}">
      <ellipse cx="0" cy="0" rx="${r}" ry="${r * 1.6}"
        fill="${fill}" opacity="0.72"
        transform="rotate(${randI(-25,25)})" />
    </svg>`;
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    const el     = document.createElement('div');
    const color  = PETAL_COLORS[i % PETAL_COLORS.length];
    const useBig = Math.random() > 0.55;
    el.className = 'petal';
    el.innerHTML = useBig ? petalSVG(color, randI(10, 22)) : singlePetalSVG(color);
    el.style.cssText = `
      left: ${rand(0, 100)}vw;
      animation-duration: ${rand(9, 22)}s;
      animation-delay: ${rand(-18, 2)}s;
      animation-timing-function: linear;
    `;
    canvas.appendChild(el);
  }
})();

/* ── 2. Continuous Floating Hearts ──────────────────────── */
(function initHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const HEARTS = ['💗', '💖', '💕', '🌸', '✨', '💓'];

  function spawnHeart() {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = HEARTS[randI(0, HEARTS.length)];
    const size = rand(0.9, 1.8);
    const dur  = rand(5.5, 9.5);
    el.style.cssText = `
      left: ${rand(5, 95)}%;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: 0s;
    `;
    container.appendChild(el);
    // Remove after animation ends to avoid DOM bloat
    setTimeout(() => el.remove(), (dur + 0.5) * 1000);
  }

  // Stagger initial spawn so they don't all appear at once
  for (let i = 0; i < 5; i++) {
    setTimeout(spawnHeart, i * 700 + 1200);
  }
  setInterval(spawnHeart, HEART_RATE_MS);
})();

/* ── 3. Parallax Background on Scroll ───────────────────── */
(function initParallax() {
  const bg = document.getElementById('bg-layer');
  if (!bg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        bg.style.transform = `translateY(${y * 0.35}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 4. "Say Thanks" Button — Burst Effect ───────────────── */
(function initSayThanks() {
  const btn = document.getElementById('btn-say-thanks');
  if (!btn) return;

  const BURST_EMOJIS = ['💗', '💖', '🌸', '✨', '🌺', '💕', '⭐', '🌷'];

  function fireBurst(originX, originY) {
    const count = 24;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'burst-heart';
      const angle  = (i / count) * 360;
      const dist   = rand(80, 200);
      const dx     = Math.cos((angle * Math.PI) / 180) * dist;
      const dy     = Math.sin((angle * Math.PI) / 180) * dist;
      el.textContent = BURST_EMOJIS[i % BURST_EMOJIS.length];
      el.style.cssText = `
        left: ${originX}px;
        top:  ${originY}px;
        --dx: ${dx}px;
        --dy: ${dy}px;
        font-size: ${rand(1, 2.2)}rem;
        animation-duration: ${rand(0.7, 1.3)}s;
        animation-delay: ${rand(0, 0.15)}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  function fireConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const COLORS = [
      '#f7c5d0', '#e8849a', '#c0405a', '#d4a046',
      '#f0c86a', '#fce8d8', '#a855f7', '#7d1a2e',
    ];
    for (let i = 0; i < CONFETTI_BURST; i++) {
      const el  = document.createElement('div');
      el.className = 'confetti-piece';
      const w   = randI(6, 14);
      const h   = randI(4, 10);
      const dur = rand(2.2, 4.5);
      el.style.cssText = `
        left: ${rand(0, 100)}%;
        width: ${w}px;
        height: ${h}px;
        background: ${COLORS[randI(0, COLORS.length)]};
        border-radius: ${Math.random() > 0.4 ? '50%' : '2px'};
        animation-duration: ${dur}s;
        animation-delay: ${rand(0, 0.8)}s;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), (dur + 1) * 1000);
    }
  }

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    fireBurst(cx, cy);
    fireConfetti();

    // Extra floating hearts spawn
    const container = document.getElementById('hearts-container');
    if (container) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const h   = document.createElement('span');
          h.className = 'floating-heart';
          h.textContent = ['💗', '💖', '💕', '🌸'][randI(0, 4)];
          const dur = rand(4, 7);
          h.style.cssText = `
            left: ${rand(20, 80)}%;
            font-size: ${rand(1.2, 2.2)}rem;
            animation-duration: ${dur}s;
          `;
          container.appendChild(h);
          setTimeout(() => h.remove(), (dur + 0.5) * 1000);
        }, i * 100);
      }
    }
  });
})();

/* ── 5. Big heart click: mini burst ─────────────────────── */
(function initHeartClick() {
  const heart = document.querySelector('.big-heart');
  if (!heart) return;

  heart.addEventListener('click', (e) => {
    const BURST_EMOJIS = ['💗', '💖', '🌸', '✨'];
    for (let i = 0; i < 10; i++) {
      const el = document.createElement('span');
      el.className = 'burst-heart';
      const angle = (i / 10) * 360;
      const dist  = rand(50, 130);
      const dx    = Math.cos((angle * Math.PI) / 180) * dist;
      const dy    = Math.sin((angle * Math.PI) / 180) * dist;
      el.textContent = BURST_EMOJIS[i % BURST_EMOJIS.length];
      el.style.cssText = `
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        --dx: ${dx}px;
        --dy: ${dy}px;
        font-size: ${rand(1, 1.8)}rem;
        animation-duration: ${rand(0.6, 1)}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  });
})();
