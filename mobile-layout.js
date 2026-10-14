(function () {
  const BASE_WIDTH = 852;
  const BASE_HEIGHT = 393;

  function updateMobileScale() {
    const vw = document.documentElement.clientWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    const scale = Math.min(vw / BASE_WIDTH, vh / BASE_HEIGHT);

    document.documentElement.style.setProperty("--mobile-scale", String(scale));
  }

  updateMobileScale();

  window.addEventListener("resize", updateMobileScale);
  window.addEventListener("orientationchange", updateMobileScale);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateMobileScale);
  }
})();
