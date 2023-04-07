---
title: 3. Work Queues
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

工作队列(又称任务队列)的主要思想是避免立即执行资源密集型任务，而不得不等待它完成。相反我们安排任务在之后执行。我们把任务封装为消息并将其发送到队列。在后台运行的工作进程将弹出任务并最终执行作业。 当有多个工作线程时，这些工作线程将一起处理这些任务。  

![image-20220121173501919](https://www.itdu.tech/image/image-20220121173501919.png)

## 3.1. 轮训分发消息

在这个案例中我们会启动两个工作线程，一个消息发送线程，我们来看看他们两个工作线程是如何工作的

### 3.1.1. 抽取工具类

```java
public class RabbitMqUtil {

    /**
     * 队列名称 hello
     */
    public static final String QUEUE_NAME = "hello";

    /**
     * 获取一个信道
     */
    public static Channel getChannel() throws Exception {
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
        return connection.createChannel();
    }
}
```

### 3.1.2. 启动两个工作线程

```java
public static void main(String[] args) throws Exception {
    Channel channel = RabbitMqUtil.getChannel();
    System.out.println("---------------------线程2");
    channel.basicConsume(
        RabbitMqUtil.QUEUE_NAME,
        true,
        (consumerTag, message) -> System.out.println("收到消息——————" + new String(message.getBody())),
        (consumerTag) -> System.out.println(consumerTag + "消费者取消消费")
    );
}
```

idea设置运行启动多个实例

![image-20220121203504145](https://www.itdu.tech/image/image-20220121203504145.png)

启动两个消费者

![image-20220121203649436](https://www.itdu.tech/image/image-20220121203649436.png)

![image-20220121203704871](https://www.itdu.tech/image/image-20220121203704871.png)

### 3.1.3. 启动一个发送线程

```java
public static void main(String[] args) throws Exception {
    Channel channel = RabbitMqUtil.getChannel();
    /**
         * 生成一个队列
         * 1.队列名称
         * 2.队列里面的消息是否持久化,默认消息存储在内存中(不持久化)
         * 3.该队列是否只共一个消费者消费 是否进行消息的共享 true可以多个消费者消费
         * 4.是否自动删除 最后一个消费者断开连接后，队列是否自动删除 true自动删除
         * 5.其它参数
         */
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);

    for (int i = 0; i < 10; i++) {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("第").append(i).append("条消息");
        /**
             * 发送一个消息
             * 1.发送到哪个交换机
             * 2.路由的key值是哪个  本次是队列名称
             * 3.其它参数信息
             * 4.发送的消息
             */
        channel.basicPublish("", QUEUE_NAME, null, stringBuffer.toString().getBytes());
    }
    System.out.println("消息发送完毕");
}
```

​	**消费者1收到消息**![image-20220121203810770](https://www.itdu.tech/image/image-20220121203810770.png)

**消费者2收到消息**

![image-20220121203844610](https://www.itdu.tech/image/image-20220121203844610.png)

`消费者收消息是以轮询的方式来接收，先启动的消费者先接收消息，一次一条消息，轮询接收`

## 3.2. 消息应答

### 3.2.1. 概念

消费者完成一个任务可能需要一段时间，如果其中一个消费者处理一个长的任务并仅只完成了部分突然它挂掉了，会发生什么情况。 RabbitMQ 一旦向消费者传递了一条消息，便立即将该消息标记为删除。在这种情况下，突然有个消费者挂掉了，我们将丢失正在处理的消息。以及后续发送给该消费这的消息，因为它无法接收到。

为了保证消息在发送过程中不丢失， rabbitmq 引入消息应答机制，消息应答就是：**消费者在接收到消息并且处理该消息之后，告诉rabbitmq 它已经处理了， rabbitmq 可以把该消息删除了。**  

### 3.2.2. 自动应答

消息发送后立即被认为已经传送成功，这种模式需要在**高吞吐量和数据传输安全性方面做权衡**，因为这种模式如果消息在接收到之前，消费者那边出现连接或者 channel 关闭，那么消息就丢失了，当然另一方面这种模式消费者那边可以传递过载的消息， **没有对传递的消息数量进行限制**，当然这样有可能使得消费者这边由于接收太多还来不及处理的消息，导致这些消息的积压，最终使得内存耗尽，最终这些消费者线程被操作系统杀死， **所以这种模式仅适用在消费者可以高效并以某种速率能够处理这些消息的情况下使用。**  

### 3.2.3. 消息应答的方法

A.Channel.basicAck(用于肯定确认)

​		RabbitMQ 已知道该消息并且成功的处理消息，可以将其丢弃了

B.Channel.basicNack(用于否定确认)

C.Channel.basicReject(用于否定确认)

​		与 Channel.basicNack 相比少一个参数
​		不处理该消息了直接拒绝，可以将其丢弃

### 3.2.4. Multiple 的解释

手动应答的好处是可以批量应答并且减少网络拥堵

![image-20220121205202034](https://www.itdu.tech/image/image-20220121205202034.png)

multiple 的 true 和 false 代表不同意思

​		true 代表批量应答 channel 上未应答的消息

​				比如说 channel 上有传送 tag 的消息 5,6,7,8 当前 tag 是 8 那么此时

​				5-8 的这些还未应答的消息都会被确认收到消息应答

​		false 同上面相比

​				只会应答 tag=8 的消息 5,6,7 这三个消息依然不会被确认收到消息应答  

![image-20220121210447039](https://www.itdu.tech/image/image-20220121210447039.png)

![image-20220121210503394](https://www.itdu.tech/image/image-20220121210503394.png)

### 3.2.5. 消息自动重新入队

如果消费者由于某些原因失去连接(其通道已关闭，连接已关闭或 TCP 连接丢失)， 导致消息未发送 ACK 确认， RabbitMQ 将了解到消息未完全处理，并将对其重新排队。如果此时其他消费者可以处理，它将很快将其重新分发给另一个消费者。这样，即使某个消费者偶尔死亡，也可以确保不会丢失任何消息。  

![image-20220121210616801](https://www.itdu.tech/image/image-20220121210616801.png)

### 3.2.6. 消息手动应答

默认消息采用的是自动应答，所以我们要想实现消息消费过程中不丢失，需要把自动应答改为手动应答

生成者

```java
public static final String TASK_QUEUE_NAME = "ack_queue";

public static void main(String[] args) throws Exception {
    Channel channel = RabbitMqUtil.getChannel();
    channel.queueDeclare(TASK_QUEUE_NAME, false, false, false, null);
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
        String message = scanner.next();
        channel.basicPublish("", TASK_QUEUE_NAME, null, message.getBytes());
    }
}
```

消费者1

```java
public static void main(String[] args) throws Exception {
    System.out.println("消费者01等待接收消息————————————————————————————————————");
    Channel channel = RabbitMqUtil.getChannel();

    // 消息传递的回调
    DeliverCallback deliverCallback = (consumerTag, message) -> {
        System.out.println("消费者1等待接收消息睡眠1秒");
        // 沉睡1s
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("消费者1收到消息——————" + new String(message.getBody()));

        /**
             * 手动应答
             * 1. 消息的标签
             * 2. 是否批量应答 false 不批量应答信道里面的消息
             */
        channel.basicAck(message.getEnvelope().getDeliveryTag(),false);
    };

    // 取消接收消息的回调
    CancelCallback cancelCallback = (consumerTag) -> {
        System.out.println("取消接收消息");
    };

    channel.basicConsume(Producer.TASK_QUEUE_NAME, false, deliverCallback, cancelCallback);
}
```

消费者2

```java
public static void main(String[] args) throws Exception {
    System.out.println("消费者02等待接收消息————————————————————————————————————");
    Channel channel = RabbitMqUtil.getChannel();

    // 消息传递的回调
    DeliverCallback deliverCallback = (consumerTag, message) -> {
        System.out.println("消费者2等待接收消息睡眠30秒");
        // 沉睡30s
        try {
            Thread.sleep(30000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("消费者1收到消息——————" + new String(message.getBody()));

        /**
             * 手动应答
             * 1. 消息的标签
             * 2. 是否批量应答 false 不批量应答信道里面的消息
             */
        channel.basicAck(message.getEnvelope().getDeliveryTag(),false);
    };

    // 取消接收消息的回调
    CancelCallback cancelCallback = (consumerTag) -> {
        System.out.println("取消接收消息");
    };

    channel.basicConsume(Producer.TASK_QUEUE_NAME, false, deliverCallback, cancelCallback);
}
```

> 测试

将生产者和两个消费者启动起来

我们发送第一条消息，消费者1接收到第一条消息

![image-20220123175635108](https://www.itdu.tech/image/image-20220123175635108.png)

发送第二条消息，此时因为消费者2等待30秒接收消息，这个时候将消费者2进程关闭

![image-20220123175644749](https://www.itdu.tech/image/image-20220123175644749.png)

![image-20220123175742573](https://www.itdu.tech/image/image-20220123175742573.png)

可以看到消息重新发给了消费者1，消费者1收到消息

![image-20220123180440648](https://www.itdu.tech/image/image-20220123180440648.png)

在发送者发送消息 dd，发出消息之后的把 C2 消费者停掉，按理说该 C2 来处理该消息，但是由于它处理时间较长，在还未处理完，也就是说 C2 还没有执行 ack 代码的时候， C2 被停掉了，此时会看到消息被 C1 接收到了，说明消息 dd 被重新入队，然后分配给能处理消息的 C1 处理了

![image-20220123180537145](https://www.itdu.tech/image/image-20220123180537145.png)

![image-20220123180557085](https://www.itdu.tech/image/image-20220123180557085.png)

## 3.3. RabbitMQ 持久化  

### 3.3.1. 概念

​		刚刚我们已经看到了如何处理任务不丢失的情况，但是如何保障当 RabbitMQ 服务停掉以后消息生产者发送过来的消息不丢失。默认情况下 RabbitMQ 退出或由于某种原因崩溃时，它忽视队列和消息，除非告知它不要这样做。确保消息不会丢失需要做两件事： **我们需要将队列和消息都标记为持久化**。  

### 3.3.2. 队列如何实现持久化

之前我们创建的队列都是非持久化的， rabbitmq 如果重启的化，该队列就会被删除掉，如果要队列实现持久化 需要在声明队列的时候把 durable 参数设置为持久化

![image-20220123182809159](https://www.itdu.tech/image/image-20220123182809159.png)

**如果我们之前对应的队列不是持久化的需要先删掉它，不然会报错**

```
Caused by: com.rabbitmq.client.ShutdownSignalException: channel error; protocol method: #method<channel.close>(reply-code=406, reply-text=PRECONDITION_FAILED - inequivalent arg 'durable' for queue 'ack_queue' in vhost '/': received 'true' but current is 'false', class-id=50, method-id=10)
```

进入队列详情可以删除队列

![image-20220123183412858](https://www.itdu.tech/image/image-20220123183412858.png)

如果有持久化会在Features(特性)添加一个D

![image-20220123183255960](https://www.itdu.tech/image/image-20220123183255960.png)

![image-20220123183703564](https://www.itdu.tech/image/image-20220123183703564.png)

### 3.3.3. 消息实现持久化

要想让消息实现持久化需要在消息生产者修改代码， MessageProperties.PERSISTENT_TEXT_PLAIN 添加这个属性。  

![image-20220123184123876](https://www.itdu.tech/image/image-20220123184123876.png)

​		将消息标记为持久化并不能完全保证不会丢失消息。尽管它告诉 RabbitMQ 将消息保存到磁盘，但是这里依然存在当消息刚准备存储在磁盘的时候 但是还没有存储完，消息还在缓存的一个间隔点。此时并没有真正写入磁盘。持久性保证并不强，但是对于我们的简单任务队列而言，这已经绰绰有余了。  

### 3.3.4. 不公平分发

​		在最开始的时候我们学习到 RabbitMQ 分发消息采用的轮训分发，但是在某种场景下这种策略并不是很好，比方说有两个消费者在处理任务，其中有个消费者 1 处理任务的速度非常快，而另外一个消费者 2处理速度却很慢，这个时候我们还是采用轮训分发的化就会到这处理速度快的这个消费者很大一部分时间处于空闲状态，而处理慢的那个消费者一直在干活，这种分配方式在这种情况下其实就不太好，但是RabbitMQ 并不知道这种情况它依然很公平的进行分发。

​		为了避免这种情况，我们可以设置参数channel.basicQos(1);  

​		channel.basicQos(1)指该消费者在接收到队列里的消息但没有返回确认结果之前,队列不会将新的消息分发给该消费者。队列中没有被消费的消息不会被删除，还是存在于队列中。

![image-20220123202539564](https://www.itdu.tech/image/image-20220123202539564.png)

![image-20220123202759778](https://www.itdu.tech/image/image-20220123202759778.png)

![image-20220123202809985](https://www.itdu.tech/image/image-20220123202809985.png)

​		意思就是如果这个任务我还没有处理完或者我还没有应答你，你先别分配给我，我目前只能处理一个任务，然后 rabbitmq 就会把该任务分配给没有那么忙的那个空闲消费者，当然如果所有的消费者都没有完成手上任务，队列还在不停的添加新任务，队列有可能就会遇到队列被撑满的情况，这个时候就只能添加新的 worker 或者改变其他存储任务的策略。

### 3.3.5. 预取值

​		本身消息的发送就是异步发送的，所以在任何时候， channel 上肯定不止只有一个消息另外来自消费者的手动确认本质上也是异步的。因此这里就存在一个未确认的消息缓冲区，因此希望开发人员能**限制此缓冲区的大小，以避免缓冲区里面无限制的未确认消息问题。**这个时候就可以通过使用 basic.qos 方法设置“预取计数”值来完成的。 **该值定义通道上允许的未确认消息的最大数量。**一旦数量达到配置的数量，RabbitMQ 将停止在通道上传递更多消息，除非至少有一个未处理的消息被确认，例如，假设在通道上有未确认的消息 5、 6、 7， 8，并且通道的预取计数设置为 4，此时 RabbitMQ 将不会在该通道上再传递任何消息，除非至少有一个未应答的消息被 ack。比方说 tag=6 这个消息刚刚被确认 ACK， RabbitMQ 将会感知这个情况到并再发送一条消息。消息应答和 QoS 预取值对用户吞吐量有重大影响。通常，增加预取将提高向消费者传递消息的速度。 **虽然自动应答传输消息速率是最佳的，但是，在这种情况下已传递但尚未处理的消息的数量也会增加，从而增加了消费者的 RAM 消耗**(随机存取存储器)应该小心使用具有无限预处理的自动确认模式或手动确认模式，消费者消费了大量的消息如果没有确认的话，会导致消费者连接节点的内存消耗变大，所以找到合适的预取值是一个反复试验的过程，不同的负载该值取值也不同 100 到 300 范围内的值通常可提供最佳的吞吐量，并且不会给消费者带来太大的风险。预取值为 1 是最保守的。当然这将使吞吐量变得很低，特别是消费者连接延迟很严重的情况下，特别是在消费者连接等待时间较长的环境中。对于大多数应用来说，稍微高一点的值将是最佳的。  

`prefetchCount的值表示消费者可以囤积的消息个数，当这个值满了，mq就不会给他分发消息`

```java
// 设置prefetchCount的值
channel.basicQos(prefetchCount);
```

![image-20220123203002229](https://www.itdu.tech/image/image-20220123203002229.png)
