module.exports = [
  {
    text: "主页",
    link: "/",
    icon: "reco-home",
  },
  {
    text: "时间线",
    link: "/timeline/",
    icon: "reco-date",
  },
  {
    text: "文档",
    icon: "reco-message",
    items: [
      {
        //   /docs/theme-reco/ MD
        //  README.md
        text: "java",
        link: "/docs/theme-reco/",
        items: [
          {
            text: "javaSE",
            link: "/docs/java/level-one-se/",
          },
        ],
      },
    ],
  },
  {
    text: "联系",
    icon: "reco-message",
    items: [
      {
        text: "GitHub",
        link: "https://github.com/du-mozzie",
        icon: "reco-github",
      },
    ],
  },
  {
    text: "工具箱",
    items: [
      {
        text: "百度",
        link: "https://www.baidu.com",
      },
    ],
  },
];
