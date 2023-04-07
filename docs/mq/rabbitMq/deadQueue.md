---
title: 6. 死信队列
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

## 6.1. 死信的概念

​		先从概念解释上搞清楚这个定义，死信，顾名思义就是无法被消费的消息，字面意思可以这样理解，一般来说， producer 将消息投递到 broker 或者直接到 queue 里了，consumer 从 queue 取出消息进行消费，但某些时候由于特定的**原因导致 queue 中的某些消息无法被消费**，这样的消息如果没有后续的处理，就变成了死信，有死信自然就有了死信队列。

​		应用场景:为了保证订单业务的消息数据不丢失，需要使用到 RabbitMQ 的死信队列机制，当消息消费发生异常时，将消息投入死信队列中.还有比如说: 用户在商城下单成功并点击去支付后在指定时间未支付时自动失效

## 6.2. 死信的来源

消息 TTL 过期

队列达到最大长度(队列满了，无法再添加数据到 mq 中)

消息被拒绝(basic.reject 或 basic.nack)并且 requeue=false.

## 6.3. 死信实战

### 6.3.1. 代码架构图

![image-20220223131106064](https://www.itdu.tech/image/image-20220223131106064.png)

### 6.3.2. 消息 TTL 过期

==生产者==

```java
public class Producer {

    // 普通交换机
    public static final String NORMAL_EXCHANGE = "normal_exchange";
    // 死信交换机
    public static final String DEAD_EXCHANGE = "dead_exchange";
    // 普通队列
    public static final String NORMAL_QUEUE = "normal_queue";
    // 死信队列
    public static final String DEAD_QUEUE = "dead_queue";

    public static void main(String[] args) throws Exception{
        Channel channel = RabbitMqUtil.getChannel();
        // 声明普通交换机
        channel.exchangeDeclare(NORMAL_EXCHANGE, BuiltinExchangeType.DIRECT);
        // 声明死信交换机
        channel.exchangeDeclare(DEAD_EXCHANGE, BuiltinExchangeType.DIRECT);

        // 普通队列参数
        Map<String, Object> arguments = new HashMap<>();
        // 过期时间 10s
        //arguments.put("x-message-ttl",10000);
        // 正常队列设置死信交换机
        arguments.put("x-dead-letter-exchange", DEAD_EXCHANGE);
        // 设置死信RoutingKey
        arguments.put("x-dead-letter-routing-key", "lisi");

        // 声明普通队列
        channel.queueDeclare(NORMAL_QUEUE, false, false, false, arguments);

        // 声明死信队列
        channel.queueDeclare(DEAD_QUEUE, false, false, false, null);

        // 绑定普通的交换机与普通的队列
        channel.queueBind(NORMAL_QUEUE,NORMAL_EXCHANGE,"zhangsan");

        // 绑定死信的交换机与普通的队列
        channel.queueBind(DEAD_QUEUE,DEAD_EXCHANGE,"lisi");
        
        // 死信消息 设置TTL时间
        AMQP.BasicProperties properties = new AMQP.BasicProperties()
                .builder()
                .expiration("10000")
                .build();
        for (int i = 0; i < 10; i++) {
            String message = "info" + i;
            channel.basicPublish(NORMAL_EXCHANGE,"zhangsan",properties,message.getBytes(StandardCharsets.UTF_8));
        }
    }
}
```

==消费者1==(启动之后关闭该消费者 模拟其接收不到消息)

```java
public class C1 {

    // 普通队列
    public static final String NORMAL_QUEUE = "normal_queue";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtil.getChannel();
        System.out.println("等待接收消息.....");

        // 消费消息
        DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("Consumer1接收到的消息："+new String(message.getBody(), StandardCharsets.UTF_8));
        channel.basicConsume(NORMAL_QUEUE, deliverCallback, consumerTag -> {
        });
    }
}
```

![image-20220224095637413](https://www.itdu.tech/image/image-20220224095637413.png)

![image-20220224095645328](https://www.itdu.tech/image/image-20220224095645328.png)

![image-20220224095654135](https://www.itdu.tech/image/image-20220224095654135.png)

消费者2(以上步骤完成后 启动 C2 消费者 它消费死信队列里面的消息)

```java
public class C2 {

    // 死信队列
    public static final String DEAD_QUEUE = "dead_queue";

    public static void main(String[] args) throws Exception{
        Channel channel = RabbitMqUtil.getChannel();
        System.out.println("等待接收消息.....");
        // 消费消息
        DeliverCallback deliverCallback = (consumerTag, message) -> System.out.println("Consumer2接收到的消息："+ new String(message.getBody(), StandardCharsets.UTF_8));
        channel.basicConsume(DEAD_QUEUE, deliverCallback, consumerTag -> {
        });
    }
}
```

![image-20220224100005480](https://www.itdu.tech/image/image-20220224100005480.png)

### 6.3.3. 队列达到最大长度

测试队列达到最大长度，

生产者去掉TTL属性

![image-20220224100601412](https://www.itdu.tech/image/image-20220224100601412.png)

添加normal_queue队列最大长度

![image-20220224100457674](https://www.itdu.tech/image/image-20220224100457674.png)

测试之前需要把原来的队列删除，因为属性变了

![image-20220224103321181](https://www.itdu.tech/image/image-20220224103321181.png)

![image-20220224103412594](https://www.itdu.tech/image/image-20220224103412594.png)

### 6.3.4. 消息被拒

1. 取消设置normal_queue队列的长度

![image-20220224111015423](https://www.itdu.tech/image/image-20220224111015423.png)

2. 修改消费者1代码，拒收第一条消息

    ```java
    // 消费消息
    DeliverCallback deliverCallback = (consumerTag, message) -> {
        if ("info5".equals(new String(message.getBody()))) {
            System.out.println("Consumer01 接收到消息" + new String(message.getBody()) + "并拒绝签收该消息");
            //requeue 设置为 false 代表拒绝重新入队 该队列如果配置了死信交换机将发送到死信队列中
            channel.basicReject(message.getEnvelope().getDeliveryTag(), false);
        } else {
            System.out.println("Consumer01 接收到消息" + new String(message.getBody()));
            channel.basicAck(message.getEnvelope().getDeliveryTag(), false);
        }
    };
    ```

3. 删除之前创建的队列

4. 运行生产者代码

![image-20220224123811585](https://www.itdu.tech/image/image-20220224123811585.png)

5. 启动消费者1

![image-20220224125127160](https://www.itdu.tech/image/image-20220224125127160.png)

`消费者1`拒收了一条消息，这条消息被加入到死信队列中

![image-20220224125153434](https://www.itdu.tech/image/image-20220224125153434.png)

6. 启动消费者2

![image-20220224125303590](https://www.itdu.tech/image/image-20220224125303590.png)

`消费者2`接收到刚刚`消费者1`拒收的消息
