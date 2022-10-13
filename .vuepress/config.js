const nav = require("./nav");
const sidebar = require("./sidebar");
module.exports = {
  title: "Coder Du",
  description: "This is my personal blog",
  port: "80",
  dest: "public",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  // 多语言配置
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  theme: "reco",
  themeConfig: {
    nav: nav,
    sidebar: sidebar,
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分类",
      },
      tag: {
        location: 3,
        text: "标签",
      },
    },
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com",
      },
    ],
    logo: "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "Du", 
    authorAvatar: "/avatar.png",
    record: "蜀ICP备2022003390号-1",
    startYear: "2022",
    recordLink: "https://beian.miit.gov.cn/"
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {

    // 回到顶部插件
    "@vuepress/back-to-top": true,

    // 音乐插件
    "@vuepress-reco/vuepress-plugin-bgm-player": {
      autoplay: false,
      autoShrink: true,
      audios: [
        {
          name: "水星记",
          artist: "郭顶",
          url: "https://coderdu.com/music/%E6%B0%B4%E6%98%9F%E8%AE%B0.mp3",
          cover: "http://p1.music.126.net/wSMfGvFzOAYRU_yVIfquAA==/2946691248081599.jpg?param=130y130",
        },
      ],
    },

    // 复制代码插件
    "vuepress-plugin-nuggets-style-copy": {
      copyText: "复制代码",
      tip: {
        content: "复制成功!",
      },
    },
  },
};
