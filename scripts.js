document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#"]');
  if (a) e.preventDefault(); // ничего не делаем для "#"
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lenis = new Lenis({
        duration: 1.2, // общая «вязкость» (1.0–1.6)
        easing: (t) => 1 - Math.pow(1 - t, 4), // плавное затухание
        smoothWheel: true,
        wheelMultiplier: 1.0, // чувствительность колеса
        touchMultiplier: 1.2, // тачпад/тач
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}