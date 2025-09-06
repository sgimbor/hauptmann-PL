let scrollTarget = 0;
let currentScroll = 0;

window.addEventListener("wheel", (e) => {
  e.preventDefault();
  scrollTarget += e.deltaY; // целевая позиция
}, { passive: false });

function animate() {
  currentScroll += (scrollTarget - currentScroll) * 0.1; // "инерция"
  window.scrollTo(0, currentScroll);
  requestAnimationFrame(animate);
}
animate();