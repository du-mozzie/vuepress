// JavaSE
const JAVA_SE = require("../docs/javase/sidebar")

// Redis
const Redis = require("../docs/redis/sidebar")

// SpringBoot
const SpringBoot = require("../docs/springboot/sidebar")

// Nginx
const Nginx = require("../docs/nginx/sidebar")

// Bug
const BUG = require("../docs/bug/sidebar")

// 数据结构
const DATA_STRUCTURE = require("../docs/dataStructuresAndAlgorithms/dataStructures/sidebar")

// 算法
const ALGORITHMS = require("../docs/dataStructuresAndAlgorithms/algorithms/sidebar")

// RabbitMQ
const RABBIT_MQ = require("../docs/mq/rabbitMq/sidebar")

module.exports = {
    "/docs/javase/": JAVA_SE,
    "/docs/redis/": Redis,
    "/docs/springboot/": SpringBoot,
    "/docs/nginx/": Nginx,
    "/docs/bug/": BUG,
    "/docs/dataStructuresAndAlgorithms/dataStructures/": DATA_STRUCTURE,
    "/docs/dataStructuresAndAlgorithms/algorithms/": ALGORITHMS,
    "/docs/mq/rabbitMq/": RABBIT_MQ,
};
