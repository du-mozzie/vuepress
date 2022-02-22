// 随笔
const ESSAY = require("../docs/essay/sidebar")

// JavaSE
const JAVA_SE = require("../docs/javase/sidebar")

// Bug
const BUG = require("../docs/bug/sidebar")

// 数据结构
const DATA_STRUCTURE = require("../docs/dataStructuresAndAlgorithms/dataStructures/sidebar")

// 算法
const ALGORITHMS = require("../docs/dataStructuresAndAlgorithms/algorithms/sidebar")

module.exports = {
  "/docs/essay/": ESSAY,
  "/docs/javase/": JAVA_SE,
  "/docs/bug/": BUG,
  "/docs/dataStructuresAndAlgorithms/dataStructures/": DATA_STRUCTURE,
  "/docs/dataStructuresAndAlgorithms/algorithms/": ALGORITHMS,
};
