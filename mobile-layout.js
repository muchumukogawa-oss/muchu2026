(function () {
  function updateMobileScale() {
    // 基準となる横画面デザインサイズ（iPhone 16比率）
    var BASE_WIDTH = 852;
    var BASE_HEIGHT = 393;

    // 現在の画面表示領域（アドレスバー等の変動に対応）
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // 幅方向と高さ方向、どちらか限界に達した方の倍率を採用する（比率崩れ・はみ出しを防止）
    var scale = Math.min(vw / BASE_WIDTH, vh / BASE_HEIGHT);

    // 既存のCSS変数（--mobile-scale, --mobile-scale-800, --mobile-scale-900）を一括更新
    document.documentElement.style.setProperty("--mobile-scale", String(scale));
    document.documentElement.style.setProperty("--mobile-scale-800", String(scale));
    document.documentElement.style.setProperty("--mobile-scale-900", String(scale));
  }

  updateMobileScale();

  // 画面リサイズおよび回転時に倍率を再計算
  window.addEventListener("resize", updateMobileScale);
  window.addEventListener("orientationchange", function () {
    setTimeout(updateMobileScale, 100);
  });
})();
