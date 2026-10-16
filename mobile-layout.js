(function () {
  // A page can include this script twice; only install one set of listeners.
  if (window.__muchuLayoutReady) return;
  window.__muchuLayoutReady = true;
  function updateLayout() {
    if (!document.querySelector('body > .stage, body > .page') ||
        !Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(link =>
          link.href === new URL('mobile-layout.css', location.href).href && link.media !== 'not all')) return;
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight;
    const hasPaper = !!document.querySelector('body > .stage > .scroll-container, body > .stage > .map-panel');
    const scale = Math.min(hasPaper ? Infinity : 1, width / 900, height / 420);
    const style = document.documentElement.style;
    style.setProperty('--mobile-scale', String(scale));
    style.setProperty('--compass-scale', String(Math.min(1, scale)));
    style.setProperty('--canvas-left', ((width - 900 * scale) / 2) + 'px');
    style.setProperty('--canvas-top', ((height - 420 * scale) / 2) + 'px');
  }
  function refresh() {
    const compass = document.querySelector('body > .stage > .compass');
    if (compass) document.body.appendChild(compass);
    updateLayout();
  }
  window.MuchuLayout = { refresh };
  refresh();
  window.addEventListener('resize', updateLayout);
  window.addEventListener('orientationchange', () => requestAnimationFrame(updateLayout));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', updateLayout);
})();
