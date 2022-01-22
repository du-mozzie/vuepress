const nav = require("./nav");
const sidebar = require("./sidebar");
module.exports = {
  title: "Coder du",
  description: "This is my personal blog",
  port: "8080",
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
    record: "xxxx",
    startYear: "2022",
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    "@vuepress/back-to-top": true,
    "@vuepress-reco/vuepress-plugin-bgm-player": {
      audios: [
        {
          name: "水星记",
          artist: "郭顶",
          url: "https://m10.music.126.net/20220122182646/cdb8a3e492ecb1d8ec0065e7d829ea17/ymusic/3dd2/3efd/8621/aaf0881569565f9fd2946ad9551ab491.mp3",
          cover: "http://p1.music.126.net/wSMfGvFzOAYRU_yVIfquAA==/2946691248081599.jpg?param=130y130",
        },
      ],
    },
  },
};
