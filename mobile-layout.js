(function () {
  // Figmaで作成した画面の基準サイズ
  const BASE_WIDTH = 852;
  const BASE_HEIGHT = 393;

  function updateMobileScale() {
    // ブラウザで実際に使える表示領域を取得
    const viewport = window.visualViewport;

    const width = document.documentElement.clientWidth;
    const height = viewport ? Math.min(viewport.height, window.innerHeight) : window.innerHeight;

    // 画面全体が収まる均等な縮小率を計算
    const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

    // CSSから使えるように値を設定
    document.documentElement.style.setProperty("--mobile-scale", String(scale));

    document.documentElement.style.setProperty("--mobile-scale-800", String(scale));

    document.documentElement.style.setProperty("--mobile-scale-900", String(scale));

    // 現在の表示領域もCSSから参照できるようにする
    document.documentElement.style.setProperty("--viewport-width", width + "px");

    document.documentElement.style.setProperty("--viewport-height", height + "px");
  }

  // 初回表示時
  updateMobileScale();

  // 画面サイズや向きが変わったとき
  window.addEventListener("resize", updateMobileScale);
  window.addEventListener("orientationchange", updateMobileScale);

  // ブラウザのアドレスバーなどで表示領域が変わったとき
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateMobileScale);
  }
})();
