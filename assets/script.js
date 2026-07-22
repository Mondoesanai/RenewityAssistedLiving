// RENEWITY — shared interactions

document.addEventListener('DOMContentLoaded', () => {

  /* nav scroll state (skip pages with a permanently solid nav) */
  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('nav--static')) {
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('nav--scrolled');
      else nav.classList.remove('nav--scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile menu */
  const hamburger = document.querySelector('.hamburger');
  const panel = document.querySelector('.mobile-panel');
  const syncNavForMenu = (open) => {
    if (!nav || nav.classList.contains('nav--static')) return;
    nav.classList.toggle('nav--scrolled', open || window.scrollY > 40);
  };
  hamburger?.addEventListener('click', () => {
    const nowOpen = panel?.classList.toggle('open');
    hamburger.classList.toggle('open', nowOpen);
    syncNavForMenu(nowOpen);
  });
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    panel.classList.remove('open');
    hamburger?.classList.remove('open');
    syncNavForMenu(false);
  }));

  /* scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* count-up stats */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countIO.observe(el));

  /* accordion (FAQ) */
  document.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.acc-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* contact form (demo only — no backend wired yet) */
  const form = document.getElementById('inquiry-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent';
    btn.style.pointerEvents = 'none';
    setTimeout(() => { btn.textContent = original; btn.style.pointerEvents = ''; form.reset(); }, 2600);
  });

  /* animated node-network background canvas */
  document.querySelectorAll('.node-canvas-wrap canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    let w, h, particles, raf;
    const DENSITY = 9000; // px^2 per particle
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      w = canvas.width = wrap.offsetWidth;
      h = canvas.height = wrap.offsetHeight;
      const count = Math.min(70, Math.max(24, Math.round((w * h) / DENSITY)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(134,194,255,${(1 - dist / 140) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!reduced) raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    tick();
    if (reduced) tick(); // draw one static frame
  });

  /* cursor-follow glow bubble within .glow-zone sections */
  document.querySelectorAll('.glow-zone').forEach(zone => {
    const glow = zone.querySelector('.cursor-glow');
    if (!glow) return;
    zone.addEventListener('mousemove', e => {
      const rect = zone.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + 'px';
      glow.style.top = (e.clientY - rect.top) + 'px';
    });
  });

  /* 3D tilt on the award badge seal */
  document.querySelectorAll('.badge-corner').forEach(wrap => {
    const seal = wrap.querySelector('.award-seal');
    if (!seal || window.matchMedia('(hover: none)').matches) return;
    const parent = wrap.closest('section') || document.body;
    parent.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / 220;
      const dy = (e.clientY - cy) / 220;
      const rx = Math.max(-18, Math.min(18, -dy * 18));
      const ry = Math.max(-18, Math.min(18, dx * 18));
      seal.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    parent.addEventListener('mouseleave', () => {
      seal.style.transform = 'perspective(700px) rotateX(0) rotateY(0)';
    });
  });

  /* comments character counter (contact page) */
  const comments = document.getElementById('comments');
  const counter = document.getElementById('comments-count');
  if (comments && counter) {
    const max = comments.getAttribute('maxlength') || 600;
    const update = () => counter.textContent = `${comments.value.length} of ${max} max characters`;
    comments.addEventListener('input', update);
    update();
  }

});
