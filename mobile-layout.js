(function () {
  function updateMobileScale() {
    var width = Math.max(window.innerWidth - 24, 1);
    var stageScale = Math.min(1, width / 800);
    var pageScale = Math.min(1, width / 900);

    document.documentElement.style.setProperty(
      "--mobile-scale-800",
      String(stageScale),
    );
    document.documentElement.style.setProperty(
      "--mobile-scale-900",
      String(pageScale),
    );
  }

  updateMobileScale();
  window.addEventListener("resize", updateMobileScale);
})();
