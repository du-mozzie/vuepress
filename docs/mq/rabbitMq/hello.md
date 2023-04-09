---
title: 2.Hello World
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

在本教程的这一部分中，我们将用 Java 编写两个程序。发送单个消息的生产者和接收消息并打印出来的消费者。我们将介绍 Java API 中的一些细节。

在下图中，“ P”是我们的生产者，“ C”是我们的消费者。中间的框是一个队列-RabbitMQ 代表使用者保留的消息缓冲区  

![image-20220121155925962](https://www.coderdu.tech/image/image-20220121155925962.png)

## 2.1 依赖

```groovy
dependencies {
    // https://mvnrepository.com/artifact/com.rabbitmq/amqp-client
    implementation group: 'com.rabbitmq', name: 'amqp-client', version: '5.10.0'

    // https://mvnrepository.com/artifact/commons-io/commons-io
    implementation group: 'commons-io', name: 'commons-io', version: '2.7'
}
```

## 2.2 生产者

 ```java
public class Producer {

    /**
     * 队列名称 hello
     */
    public static final String QUEUE_NAME = "hello";

    /**
     * 发消息
     *
     * @param args
     */
    public static void main(String[] args) throws IOException, TimeoutException {
        // 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        // 设置ip
        factory.setHost("192.168.10.40");
        // 设置端口 factory.setPort(); 默认为5672 如果没有修改可以不用设置
        // 设置用户名
        factory.setUsername("admin");
        // 设置密码
        factory.setPassword("123");
        // 创建连接
        Connection connection = factory.newConnection();
        // 获取信道
        Channel channel = connection.createChannel();
        /**
         * 生成一个队列
         * 1.队列名称
         * 2.队列里面的消息是否持久化,默认消息存储在内存中(不持久化)
         * 3.该队列是否只共一个消费者消费 是否进行消息的共享 true可以多个消费者消费
         * 4.是否自动删除 最后一个消费者断开连接后，队列是否自动删除 true自动删除
         * 5.其它参数
         */
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        // 创建一个消息
        String message = "hello RabbitMQ";
        /**
         * 发送一个消息
         * 1.发送到哪个交换机
         * 2.路由的key值是哪个  本次是队列名称
         * 3.其它参数信息
         * 4.发送的消息
         */
        channel.basicPublish("",QUEUE_NAME,null,message.getBytes());
        System.out.println("消息发送完毕");
    }
}
 ```

**在控制台可以看到有一个消息等待消费**

![image-20220121171519304](https://www.coderdu.tech/image/image-20220121171519304.png)

## 2.3 消费者

```java
public class Consumer {

    /**
     * 队列名称 hello
     */
    public static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws IOException, TimeoutException {
        // 连接到mq
        // 1.创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        // 2.设置工厂连接配置
        factory.setHost("192.168.10.40");
        factory.setUsername("admin");
        factory.setPassword("123");
        // 3.创建连接
        Connection connection = factory.newConnection();
        // 4.获取信道
        Channel channel = connection.createChannel();
        /**
         * 消费者消费消息
         * 1.消费哪个队列
         * 2.消费成功后是否要自动应答 true自动应答，false手动应答
         * 3.消费者成功消费的回调
         * 4.消费者取消消费的回调
         */
        channel.basicConsume(
                QUEUE_NAME,
                true,
                (consumerTag, message) -> System.out.println(new String(message.getBody())),
                (consumerTag) -> System.out.println("消息消费被中断")
        );
    }
}
```

**消息消费完成**

![image-20220121171620379](https://www.coderdu.tech/image/image-20220121171620379.png)

**控制台已经没有消息等待消费**

![image-20220121171650966](https://www.coderdu.tech/image/image-20220121171650966.png)
