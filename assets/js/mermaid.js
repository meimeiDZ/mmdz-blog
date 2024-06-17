var num = 0;
mermaid.initialize({ startOnLoad: false });
 
window.$docsify = {
  markdown: {
    renderer: {
      code: function(code, lang) {
          // 判断语言是否为 mermaid
        if (lang === "mermaid") {
            // 将div 返回
          return (
            '<div class="mermaid">' + mermaid.render('mermaid-svg-' + num++, code) + "</div>"
          );
        }
        return this.origin.code.apply(this, arguments);
      }
    }
  }
}