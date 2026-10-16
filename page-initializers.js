(function () {
'use strict';
const pages = {
"decision.html": function () {
const params = new URLSearchParams(window.location.search);
      const color = params.get("color");
      const example = params.get("example");
      const label = params.get("label");
      const expressions = {
        "#ff0000": "怒る",
        "#000000": "怖い",
        "#0068b7": "びびりびっくり",
        "#ff4e00": "うるさい",
        "#910055": "危ない",
        "#a9a9a9": "不安・心配",
        "#a757a8": "嫌",
        "#d8bfd8": "困る",
        "#db7093": "恥ずかしい",
        "#ff7043": "イライラ",
        "#800080": "しつこい",
        "#333333": "ショック",
        "#c49a6a": "面白くない",
        "#1e90ff": "泣きたい",
        "#90caf9": "可愛想",
        "#4682b4": "寂しい",
        "#000080": "がっかり",
        "#0000ff": "悲しい",
        "#4a148c": "悔しい",
        "#778899": "疲れた",
        "#ffcc00": "嬉しくてびっくり(1)",
        "#ff8c00": "面白い",
        "#ff5a5a": "やる気がある",
        "#ffeb3b": "嬉しい",
        "#ff9f63": "興奮した",
        "#ffff00": "喜ぶ",
        "#ffa500": "楽しい",
        "#ffc0cb": "幸せ",
        "#e91e63": "愛",
        "#f48fb1": "好き",
        "#90ee90": "気楽・のんびり",
        "#ffd700": "素敵",
        "#a5d4ad": "リラックス",
        "#008000": "安心する",
        "#ffdab9": "感謝する",
        "#ccff99": "優しい",
        "#aed581": "穏やか",
        "#ffffff": "気にしない",
        "#00fa9a": "気持ちいい"
      };

      if (color) {
        document.getElementById("selectedColorBox").style.backgroundColor = color;
        const explanationParams = new URLSearchParams({ color });
        if (label) {
          explanationParams.set("label", label);
        }
        if (example) {
          explanationParams.set("example", example);
        }
        const normalizedColor = color.toLowerCase();
        const emotion = label === "かんどう" ? "嬉しくてびっくり" : expressions[normalizedColor];
        if (emotion) {
          const expression = document.getElementById("selectedExpression");
          expression.src = `img/${emotion}.svg`;
          expression.alt = `${label || emotion}の表情`;
          // JavaScriptで感情名をdata属性にセットしてCSSの位置微調整を発動させる
          expression.setAttribute("data-emotion", emotion);
          expression.classList.toggle("expression--white-outline", normalizedColor === "#000000");
          expression.hidden = false;
          explanationParams.set("emotion", emotion);
        }
        document.getElementById("yesBtn").href = "explanation.html?" + explanationParams.toString();
      }
    
},
"explanation.html": function () {
const params = new URLSearchParams(window.location.search);
      const selectedColor = params.get("color") || "#ff0000";
      const emotion = params.get("emotion");
      const emotionLabels = {
        "#ff0000": "おこる",
        "#000000": "こわい",
        "#0068b7": "びびりびっくり",
        "#ff4e00": "うるさい",
        "#910055": "あぶない",
        "#a9a9a9": "ふあん・しんぱい",
        "#a757a8": "いや",
        "#d8bfd8": "こまる",
        "#db7093": "はずかしい",
        "#ff7043": "いらいら",
        "#800080": "しつこい",
        "#333333": "しょっく",
        "#c49a6a": "おもしろくない",
        "#1e90ff": "なきたい",
        "#90caf9": "かわいそう",
        "#4682b4": "さびしい",
        "#000080": "がっかりする",
        "#0000ff": "かなしい",
        "#4a148c": "くやしい",
        "#778899": "つかれた",
        "#ffcc00": "うれしくてびっくり",
        "#ff8c00": "おもしろい",
        "#ff5a5a": "やるきがある",
        "#ffeb3b": "うれしい",
        "#ff9f63": "こうふんした",
        "#ffff00": "よろこぶ",
        "#ffa500": "たのしい",
        "#ffc0cb": "しあわせ",
        "#e91e63": "あい",
        "#f48fb1": "すき",
        "#90ee90": "きらく・のんびり",
        "#ffd700": "すてき",
        "#a5d4ad": "りらっくす",
        "#008000": "あんしん・ほっとする",
        "#ffdab9": "かんしゃ",
        "#ccff99": "やさしい・しんせつ",
        "#aed581": "おだやか",
        "#ffffff": "きにしない",
        "#00fa9a": "きもちいい",
      };
      const emotionLabel = params.get("label") || emotionLabels[selectedColor.toLowerCase()];
      if (emotionLabel) {
        document.getElementById("emotionLabel").textContent = emotionLabel;
        document.title = `${emotionLabel}は こんなときに つかうよ！`;
      }
      const examples = {
        "#ff0000": "とっておいた ぷりんを たべられた",
        "#000000": "ひとりで まっくらな みちを あるいているよ",
        "#0068b7": "えほんを よんでいたら、うしろで 「わっ！」って おおきな こえが して とびあがっちゃった",
        "#ff4e00": "みみもとで おおきな こえで はなしかけられた",
        "#910055": "どうろで あそぶと、くるまが きて ぶつかっちゃうよ",
        "#a9a9a9": "きょうは えんそくなのに あめが ふりそうだよ",
        "#a757a8": "まいにち ずっと あめで、おそとで あそべないよ",
        "#d8bfd8": "あめが ふってるのに、かさが ないよ",
        "#db7093": "みんなの まえで ころんで、かおが まっかに なっちゃった",
        "#ff7043": "じゅんばんを まっているのに、ぬかされた",
        "#800080": "「やめて」と いってるのに、なんども おもちゃを とろうとしてくるよ",
        "#333333": "つみきを がんばって たかく つんだのに くずれちゃった",
        "#c49a6a": "おなじ あそびばかりで、あきちゃったよ",
        "#1e90ff": "おともだちと けんかしちゃったよ",
        "#90caf9": "おともだちが ころんで ないているよ",
        "#4682b4": "いっしょに あそぶ おともだちが いない",
        "#000080": "たのしみにしていた おでかけが なくなったよ",
        "#0000ff": "たからものの おもちゃが こわれちゃった",
        "#4a148c": "ともだちに げーむで まけちゃった",
        "#778899": "たくさん あそんで へとへとだ",
        "#ffcc00": "こうえんで あそんでいたら、だいすきな おともだちに あえた！",
        "#ff8c00": "ともだちが へんな だんすを していたよ",
        "#ff5a5a": "じぶんで くつしたを はこうと がんばるとき",
        "#ffeb3b": "かいた えを ほめてもらったよ",
        "#ff9f63": "だいすきな あにめの きゃらくたーに あえたよ",
        "#ffff00": "ゆうえんちに いくことに なったよ！",
        "#ffa500": "おともだちと えんそくに いったよ",
        "#ffc0cb": "かぞく みんなで ごはんを たべながら いつも わらいあっているよ",
        "#e91e63": "おうちの ひとが やさしく あたまを なでてくれる",
        "#f48fb1": "この ぬいぐるみは おきにいりなんだ",
        "#90ee90": "ごろごろしながら てれびを みる",
        "#ffd700": "おともだちの ふくが とても おしゃれだった",
        "#a5d4ad": "そふぁで ごろごろするよ",
        "#008000": "ままと ぱぱに ぎゅっと してもらったよ",
        "#ffdab9": "ともだちが おとしたものを ひろってくれたよ。",
        "#ccff99": "おともだちがおもちゃをかしてくれた",
        "#aed581": "おひさまが やさしく てらしているよ",
        "#ffffff": "あめで こうえんに いけなくなったけど おうちで あそぼうっと",
        "#00fa9a": "あつい ひに ぷーるに はいるよ"
      };

      const box = document.getElementById("selectedColorBox");
      box.style.backgroundColor = selectedColor;

      if (emotion && /^[^./\\?#]+$/u.test(emotion)) {
        const expression = document.getElementById("expression");
        expression.src = `img/${emotion}.svg`;
        expression.alt = `${emotionLabel || emotion}の表情`;
        expression.classList.toggle(
          "expression--white-outline",
          selectedColor.toLowerCase() === "#000000",
        );
      }

      const example = params.get("example");
      const exampleText =
        example === "moved"
          ? "えほんの しゅじんこうが たすかって、よかったなぁと おもったよ"
          : examples[selectedColor.toLowerCase()];
      const exampleTextElement = document.getElementById("exampleText");
      const isSurpriseExample = selectedColor.toLowerCase() === "#0068b7" && example !== "moved";
      exampleTextElement.textContent = isSurpriseExample
        ? "えほんを よんでいたら、うしろで「わっ！」って\nおおきな こえが して\nとびあがっちゃった"
        : exampleText || "対応する例文が見つかりません。";
      exampleTextElement.classList.toggle("example-text--fixed-lines", isSurpriseExample);
    
}
};
window.MuchuPages = { initialize: function () {
 const name = location.pathname.split('/').pop();
 if (pages[name]) pages[name]();
} };
window.MuchuPages.initialize();
})();
