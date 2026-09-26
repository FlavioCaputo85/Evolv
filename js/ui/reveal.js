function initTheme() {
  try { const t = localStorage.getItem('evolv:theme'); if (t) document.documentElement.dataset.theme = t; } catch {}
}
function initNav() {
  const nav = $('#navbar');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 6);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  document.querySelectorAll('[data-act="theme"]').forEach(btn => btn.addEventListener('click', () => {
    const r = document.documentElement;
    const prefersDark = window.matchMedia ? matchMedia('(prefers-color-scheme:dark)').matches : false;
    const dark = r.dataset.theme ? r.dataset.theme === 'dark' : prefersDark;
    r.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('evolv:theme', r.dataset.theme); } catch {}
  }));
}
function animateCount(el) {
  const target = parseFloat(el.dataset.count) || 0, dec = el.dataset.dec === '1', dur = 1100, t0 = performance.now();
  function step(t) {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = target * e;
    el.textContent = dec ? v.toFixed(1) : Math.round(v);
    if (p < 1) requestAnimationFrame(step); else el.textContent = dec ? target.toFixed(1) : target;
  }
  requestAnimationFrame(step);
}
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('in'));
    document.querySelectorAll('.stat b[data-count]').forEach(animateCount);
    return;
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .16 });
  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));
  document.querySelectorAll('.stat b[data-count]').forEach(el => {
    const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { animateCount(el); io2.disconnect(); } }), { threshold: .6 });
    io2.observe(el);
  });
}
