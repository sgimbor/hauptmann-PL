// Инерционный скролл страницы (wheel + трение)
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const el = document.scrollingElement || document.documentElement;

  let y = el.scrollTop;
  let v = 0;                 // текущая скорость (px/кадр)
  let raf = null;
  const friction = 0.94;     // 0.90–0.98: выше — дольше «катается»
  const boost = 1;           // усиление импульса от колеса (1–2)
  const maxImpulse = 160;    // ограничение одного wheel-импульса

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  function loop(t) {
    const maxY = el.scrollHeight - innerHeight;
    // dt для стабильности на разных FPS
    loop.prev ??= t;
    const dt = (t - loop.prev) / 16.67; // ~кадры
    loop.prev = t;

    // интегрируем скорость
    y = clamp(y + v * dt, 0, maxY);
    el.scrollTo(0, y);

    // трение (экспоненциальное затухание скорости)
    v *= Math.pow(friction, dt);

    // гасим скорость у краёв
    if (y === 0 || y === maxY) v *= 0.5;

    if (Math.abs(v) < 0.1) { v = 0; raf = null; loop.prev = null; return; }
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();

    // нормализация deltaY (px/line/page)
    const line = parseFloat(getComputedStyle(document.documentElement).lineHeight) || 16;
    const unit = e.deltaMode === 1 ? line : (e.deltaMode === 2 ? innerHeight : 1);
    let impulse = e.deltaY * unit * boost;
    impulse = clamp(impulse, -maxImpulse, maxImpulse);

    // добавляем импульс к скорости — вот тут и рождается инерция
    v += impulse;

    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: false });

  // синхронизируемся, если страница прокручена иным способом
  window.addEventListener('scroll', () => { if (!raf) y = el.scrollTop; }, { passive: true });
})();