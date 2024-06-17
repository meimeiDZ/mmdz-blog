// docsify 配置项
window.$docsify = {
  name: "Mmdz’s Blog",
  // repo: "https://gitee.com/mmdz-blog",
  //切换页面后是否自动跳转到页面顶部。
  auto2top: true,
  //启用封面页
  coverpage: true,
  themeColor: "#25798A",
  //自定义导航栏
  loadNavbar: true,
  //自定义侧边栏
  loadSidebar: true,
  //目录层级
  maxLevel: 3,
  //子目录层级
  subMaxLevel: 4,
  //加载自定义404页面
  notFoundPage: true,
  // 启用相对路径
  relativePath: false,
  // 显示文档更新日期
  formatUpdated: "{YYYY}/{MM}/{DD} {HH}:{mm}",
  // 全文搜索 完整配置参数
  search: "auto", // 默认值
  search: {
    maxAge: 86400000, // 过期时间，单位毫秒，默认一天
    // 支持本地化
    noData: {
      "/zh-cn/": "没有结果!",
      "/": "No results!",
    },
    paths: "auto",
    placeholder: {
      "/zh-cn/": "搜索",
      "/": "Search",
    },
  },
  ga: "UA-166614124-1", //谷歌统计---需要配置 track id 才能使用。
  // 谷歌统计插件
  count: {
    countable: true,
    fontsize: "0.9em",
    color: "rgb(90,90,90)",
    language: "chinese",
  },
  topMargin: 90,
  // 显示选项卡插件
  tabs: {
    persist: true,      // default
    sync: true,      // default
    theme: 'classic', // default
    tabComments: true,      // default
    tabHeadings: true       // default
  },
  // 进度条插件 （影响APP端的 侧边栏 收缩按钮）
  // progress: {
  //   position: "top",
  //   color: "#42b983",
  //   height: "3px",
  // }
  // 文本高亮
  'flexible-alerts': {
    style: 'flat'
  },
};

// 打印 docsify 版本
console.log(
  "\n %c docsify-cli current version %c v4.4.4 \n",
  "color: #fadfa3; background: #030307; padding:5px 0;",
  "background: #fadfa3; padding:5px 0;"
);
// 打印 docsify 官网Github地址
console.log(
  "\n %c docsify github address %c https://github.com/docsifyjs/docsify \n",
  "color: #fadfa3; background: #030307; padding:5px 0;",
  "background: #fadfa3; padding:5px 0;"
);
// 打印 docsify 官网文档地址
console.log(
  "\n %c docsify document address %c https://docsify.js.org/#/zh-cn/ \n",
  "color: #fadfa3; background: #030307; padding:5px 0;",
  "background: #fadfa3; padding:5px 0;"
);