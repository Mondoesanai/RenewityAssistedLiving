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

});
