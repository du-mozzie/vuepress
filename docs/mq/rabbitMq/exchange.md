---
title: 5. 交换机
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

​		我们将做一些完全不同的事情-我们将消息传达给多个消费者。这种模式称为 ”发布/订阅”。

​		为了说明这种模式，我们将构建一个简单的日志系统。它将由两个程序组成:第一个程序将发出日志消息，第二个程序是消费者。 其中我们会启动两个消费者，其中一个消费者接收到消息后把日志存储在磁盘，另外一个消费者接收到消息后把消息打印在屏幕上，事实上第一个程序发出的日志消息将广播给所有消费者。

## 5.1. Exchanges

### 5.1.1. Exchanges 概念

​		RabbitMQ 消息传递模型的核心思想是：**生产者生产的消息从不会直接发送到队列**。实际上，通常生产者甚至都不知道这些消息传递传递到了哪些队列中。

​		相反， **生产者只能将消息发送到交换机(exchange)**，交换机工作的内容非常简单， 一方面它接收来自生产者的消息，另一方面将它们推入队列。 交换机必须确切知道如何处理收到的消息。 是应该把这些消息放到特定队列还是说把他们到许多队列中还是说应该丢弃它们。 这就的由交换机的类型来决定。  

![image-20220124203233880](https://www.coderdu.tech/image/image-20220124203233880.png)

### 5.1.2. Exchanges 的类型

总共有以下类型：

​		直接(direct), 主题(topic) ,标题(headers) , 扇出(fanout)  

### 5.1.3. 无名 exchange

之前能实现将消息发送到队列的原因是因为我们使用的是默认交换，我们通过空字符串(“”)进行标识。  

![image-20220124203954470](https://www.coderdu.tech/image/image-20220124203954470.png)

第一个参数是交换机的名称。空字符串表示默认或无名称交换机： 消息能路由发送到队列中其实是由 routingKey(bindingkey)绑定 key 指定的，如果它存在的话。

## 5.2. 临时队列

​		之前的章节我们使用的是具有特定名称的队列(还记得 hello 和 ack_queue 吗？ )。队列的名称我们来说至关重要-我们需要指定我们的消费者去消费哪个队列的消息。

​		每当我们连接到 Rabbit 时，我们都需要一个全新的空队列，为此我们可以创建一个具有**随机名称的队列**，或者能让服务器为我们选择一个随机队列名称那就更好了。其次**一旦我们断开了消费者的连接，队列将被自动删除**。

创建临时队列的方式如下:

```java
String queueName = channel.queueDeclare().getQueue();
```

创建出来之后长成这样  

![image-20220124204157833](https://www.coderdu.tech/image/image-20220124204157833.png)

## 5.3. 绑定(bindings) 

​		什么是 bingding 呢， binding 其实是 exchange 和 queue 之间的桥梁，它告诉我们 exchange 和那个队列进行了绑定关系。比如说下面这张图告诉我们的就是 X 与 Q1 和 Q2 进行了绑定

![image-20220124204456689](https://www.coderdu.tech/image/image-20220124204456689.png)

## 5.4. Fanout

### 5.4.1. Fanout 介绍

​		Fanout 这种类型非常简单。正如从名称中猜到的那样，它是将接收到的所有消息**广播**到它知道的所有队列中。 系统中默认有些 exchange 类型

![image-20220124204822701](https://www.coderdu.tech/image/image-20220124204822701.png)

### 5.4.2. Fanout 实战

![image-20220124210220485](https://www.coderdu.tech/image/image-20220124210220485.png)

Logs 和临时队列的绑定关系如下图

![image-20220124210329086](https://www.coderdu.tech/image/image-20220124210329086.png)

ReceiveLogs01 将接收到的消息打印在控制台

```java
public static final String EXCHANGE_NAME = "logs";

public static void main(String[] args) throws Exception {
    Channel channel = RabbitMqUtil.getChannel();
    // 声明一个交换机, 类型是fanout
    channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
    /**
         * 声明一个队列 临时队列
         * 生成一个临时队列、队列的名称是随机的
         * 当消费者断开与队列的连接时 队列就自动删除
         */
    String queueName = channel.queueDeclare().getQueue();

    // 绑定交换机与队列
    channel.queueBind(queueName, EXCHANGE_NAME, "");
    System.out.println("等待接收消息，把接收的消息打印到屏幕上.......");

    // 接收消息的回调
    DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("收到消息：" + new String(message.getBody(), "UTF-8"));

    // 消费消息
    channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {
    });
}
```

ReceiveLogs02 将接收到的消息存储在磁盘

```java
private static final String EXCHANGE_NAME = "logs";

public static void main(String[] argv) throws Exception {
    Channel channel = RabbitMqUtil.getChannel();
    channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
    /**
         * 生成一个临时的队列 队列的名称是随机的
         * 当消费者断开和该队列的连接时 队列自动删除
         */
    String queueName = channel.queueDeclare().getQueue();
    // 把该临时队列绑定我们的 exchange 其中 routingKey(也称之为 binding key)为空字符串
    channel.queueBind(queueName, EXCHANGE_NAME, "");
    System.out.println("等待接收消息,把接收到的消息写到文件.....");
    DeliverCallback deliverCallback = (consumerTag, delivery) -> {
        String message = new String(delivery.getBody(), "UTF-8");
        File file = new File("F:\\rabbitmq_info.txt");
        FileUtils.writeStringToFile(file, message, "UTF-8");
        System.out.println("数据写入文件成功");
    };
    channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {
    });
}
```

EmitLog 发送消息给两个消费者接收  

```java
public static final String EXCHANGE_NAME = "logs";

public static void main(String[] args) throws Exception {
    Channel channel = RabbitMqUtil.getChannel();
    // 声明交换机
    channel.exchangeDeclare(EXCHANGE_NAME, "fanout");
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
        String message = scanner.next();
        channel.basicPublish(EXCHANGE_NAME, "", null, message.getBytes("UTF-8"));
        System.out.println("生产者发出消息" + message);
    }
}
```

**扇出交换机不受routingKey的影响，只要是在同一个交换机中的消费者都能收到消息，扇出交换机以广播的形式发送消息**

## 5.5. Direct exchange

### 5.5.1. 回顾

​		在上一节中，我们构建了一个简单的日志记录系统。我们能够向许多接收者广播日志消息。在本节我们将向其中添加一些特别的功能-比方说我们只让某个消费者订阅发布的部分消息。例如我们只把严重错误消息定向存储到日志文件(以节省磁盘空间)，同时仍然能够在控制台上打印所有日志消息。

​		我们再次来回顾一下什么是 bindings，绑定是交换机和队列之间的桥梁关系。也可以这么理解：队列只对它绑定的交换机的消息感兴趣。绑定用参数： routingKey 来表示也可称该参数为 binding key，创建绑定我们用代码:channel.queueBind(queueName, EXCHANGE_NAME, "routingKey");绑定之后的意义由其交换类型决定  

### 5.5.2. Direct exchange 介绍

direct这种类型的工作方式是，消息只去到它绑定的routingKey 队列中去  

![image-20220214205003130](https://www.coderdu.tech/image/image-20220214205003130.png)

​		在上面这张图中，我们可以看到 X 绑定了两个队列，绑定类型是 direct。队列 Q1 绑定键为 orange，队列 Q2 绑定键有两个：一个绑定键为 black，另一个绑定键为 green。

​		在这种绑定情况下，生产者发布消息到 exchange 上，绑定键为 orange 的消息会被发布到队列Q1。 绑定键为 blackgreen 和的消息会被发布到队列 Q2， 其他消息类型的消息将被丢弃。

### 5.5.3. 多重绑定

![image-20220222205804358](https://www.coderdu.tech/image/image-20220222205804358.png)

​		当然如果 exchange 的绑定类型是 direct， 但是它绑定的多个队列的 key 如果都相同，在这种情况下虽然绑定类型是 direct 但是它表现的就和 fanout 有点类似了，就跟广播差不多，如上图所示。  

### 5.5.4. 实战

![image-20220222205848493](https://www.coderdu.tech/image/image-20220222205848493.png)

![image-20220222212829501](https://www.coderdu.tech/image/image-20220222212829501.png)

==生产者==

```java
public class EmitLog {

    public static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtil.getChannel();
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String message = scanner.next();
            // routingKey 填写需要接收消息的队列，绑定的key
            channel.basicPublish(EXCHANGE_NAME, "info", null, message.getBytes("UTF-8"));
            System.out.println("生产者发出消息：" + message);
        }
    }
}
```

==消费者1==

```java
public class ReceiveLogsDirect01 {

    public static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception{

        Channel channel = RabbitMqUtil.getChannel();
        // 声明一个交换机
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
        // 声明一个队列
        channel.queueDeclare("console",false,false,false,null);
        // 绑定队列
        channel.queueBind("console",EXCHANGE_NAME,"info");
        channel.queueBind("console",EXCHANGE_NAME,"waring");

        // 接收消息的回调
        DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("ReceiveLogsDirect01控制台打印收到消息：" + new String(message.getBody(), "UTF-8"));

        // 消费消息
        channel.basicConsume("console", true, deliverCallback, consumerTag -> {
        });
    }
}
```

==消费者2==

```java
public class ReceiveLogsDirect02 {

    public static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception{

        Channel channel = RabbitMqUtil.getChannel();
        // 声明一个交换机
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
        // 声明一个队列
        channel.queueDeclare("disk",false,false,false,null);
        // 绑定队列
        channel.queueBind("disk",EXCHANGE_NAME,"error");

        // 接收消息的回调
        DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("ReceiveLogsDirect02控制台打印收到消息：" + new String(message.getBody(), "UTF-8"));

        // 消费消息
        channel.basicConsume("disk", true, deliverCallback, consumerTag -> {
        });
    }
}
```

## 5.6. Topics

​		在上一个小节中，我们改进了日志记录系统。我们没有使用只能进行随意广播的 fanout 交换机，而是使用了 direct 交换机，从而有能实现有选择性地接收日志。

​		尽管使用 direct 交换机改进了我们的系统，但是它仍然存在局限性-比方说我们想接收的日志类型有info.base 和 info.advantage，某个队列只想 info.base 的消息，那这个时候 direct 就办不到了。这个时候就只能使用 topic 类型。

### 5.6.1. Topic 的要求

​		发送到类型是 topic 交换机的消息的 routing_key 不能随意写，必须满足一定的要求，它**必须是一个单词列表，以点号分隔开。**这些单词可以是任意单词，比如说： "stock.usd.nyse", "nyse.vmw","quick.orange.rabbit".这种类型的。当然这个单词列表最多不能超过 255 个字节。

​		在这个规则列表中，其中有两个替换符是大家需要注意的

​		***(星号)可以代替一个单词**

​		**\#(井号)可以替代零个或多个单词**

### 5.6.2. Topic 匹配案例  

下图绑定关系如下

​		Q1-->绑定的是

​				中间带 orange 带 3 个单词的字符串(*.orange.*)

​		Q2-->绑定的是

​				最后一个单词是 rabbit 的 3 个单词(*.*.rabbit)

​				第一个单词是 lazy 的多个单词(lazy.#)  

![image-20220222213556226](https://www.coderdu.tech/image/image-20220222213556226.png)

上图是一个队列绑定关系图，我们来看看他们之间数据接收情况是怎么样的

| quick.orange.rabbit      | 被队列 Q1Q2 接收到                         |
| ------------------------ | ------------------------------------------ |
| lazy.orange.elephant     | 被队列 Q1Q2 接收到                         |
| quick.orange.fox         | 被队列 Q1 接收到                           |
| lazy.brown.fox           | 被队列 Q2 接收到                           |
| lazy.pink.rabbit         | 虽然满足两个绑定但只被队列 Q2 接收一次     |
| quick.brown.fox          | 不匹配任何绑定不会被任何队列接收到会被丢弃 |
| quick.orange.male.rabbit | 是四个单词不匹配任何绑定会被丢弃           |
| lazy.orange.male.rabbit  | 是四个单词但匹配 Q2                        |

当队列绑定关系是下列这种情况时需要引起注意

​		**当一个队列绑定键是#,那么这个队列将接收所有数据，就有点像 fanout 了**

​		**如果队列绑定键当中没有#和*出现，那么该队列绑定类型就是 direct 了**

### 5.6.3. 实战

![image-20220223120130848](https://www.coderdu.tech/image/image-20220223120130848.png)

==生产者==

```java
public class EmitLog {

    public static final String EXCHANGE_NAME = "topic";

    public static void main(String[] args) throws Exception{
        Channel channel = RabbitMqUtil.getChannel();
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()){
            String message = scanner.next();
            // 发送消息 						 routingKdy,符合队列绑定的Key语法,可以同时绑定多个队列,测试时更改key,看接收到的队列
            channel.basicPublish(EXCHANGE_NAME,"qwe.orange.adad",null,message.getBytes(StandardCharsets.UTF_8));
            System.out.println("生产者发出消息：" + message);
        }
    }
}
```

==消费者1==

```java
public class Topic01 {

    public static final String EXCHANGE_NAME = "topic";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtil.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);
        channel.queueDeclare("Q1", false, false, false, null);
        channel.queueBind("Q1", EXCHANGE_NAME, "*.orange.*");

        // 接收消息的回调
        DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("Topic01控制台打印收到消息：" + new String(message.getBody(), "UTF-8"));

        // 消费消息
        channel.basicConsume("console", true, deliverCallback, consumerTag -> {
        });
    }
}
```

==消费者2==

```java
public class Topic02 {

    public static final String EXCHANGE_NAME = "topic";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtil.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);
        channel.queueDeclare("Q2", false, false, false, null);
        channel.queueBind("Q2",EXCHANGE_NAME,"*.*.rabbit");
        channel.queueBind("Q2",EXCHANGE_NAME,"lazy.#");

        // 接收消息的回调
        DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("Topic01控制台打印收到消息：" + new String(message.getBody(), "UTF-8"));

        // 消费消息
        channel.basicConsume("console", true, deliverCallback, consumerTag -> {
        });
    }
}
```
