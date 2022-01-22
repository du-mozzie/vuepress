const nav = require("./nav");
const sidebar = require("./sidebar");
module.exports = {
  title: "blog",
  description: "blog",
  port: "9090",
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
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar:
          "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
    ],
    logo: "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "Du",
    authorAvatar: "/avatar.png",
    record: "xxxx",
    startYear: "2017",
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    "@vuepress/back-to-top": true,
    "@vuepress-reco/vuepress-plugin-bgm-player": {
      audios: [
        // 网络文件示例
        {
          name: "강남역 4번 출구",
          artist: "Plastic / Fallin` Dild",
          url: "https://assets.smallsunnyfox.com/music/2.mp3",
          cover: "https://assets.smallsunnyfox.com/music/2.jpg",
        },
      ],
    },
  },
};
