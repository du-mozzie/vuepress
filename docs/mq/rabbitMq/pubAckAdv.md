---
title: 8. 发布确认高级
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

​		在生产环境中由于一些不明原因，导致 rabbitmq 重启，在 RabbitMQ 重启期间生产者消息投递失败，导致消息丢失，需要手动处理和恢复。于是，我们开始思考，如何才能进行 RabbitMQ 的消息可靠投递呢？特别是在这样比较极端的情况， RabbitMQ 集群不可用的时候，无法投递的消息该如何处理呢:  

```
应 用 [xxx] 在 [08-1516:36:04] 发 生 [ 错 误 日 志 异 常 ] ， alertId=[xxx] 。 由
[org.springframework.amqp.rabbit.listener.BlockingQueueConsumer:start:620] 触 发 。应用 xxx 可能原因如下
服 务 名 为 ：
异 常 为 ： org.springframework.amqp.rabbit.listener.BlockingQueueConsumer:start:620,
产 生 原 因 如 下 :1.org.springframework.amqp.rabbit.listener.QueuesNotAvailableException:
Cannot prepare queue for listener. Either the queue doesn't exist or the broker will not
allow us to use it.||Consumer received fatal=false exception on startup:
```

## 8.1. 发布确认 springboot 版本

### 8.1.1. 确认机制方案

![image-20220226172032580](https://www.coderdu.tech/image/image-20220226172032580.png)

### 8.1.2. 代码架构图

![image-20220226172046157](https://www.coderdu.tech/image/image-20220226172046157.png)

### 8.1.3. 配置文件

在配置文件当中需要添加

```yaml
spring:
  rabbitmq:
    publisher-confirm-type: correlated
```

- NONE

    禁用发布确认模式，是默认值

- CORRELATED

    发布消息成功到交换器后会触发回调方法

- SIMPLE

    经测试有两种效果，其一效果和 CORRELATED 值一样会触发回调方法，

    其二在发布消息成功后使用 rabbitTemplate 调用 waitForConfirms 或 waitForConfirmsOrDie 方法等待 broker 节点返回发送结果，根据返回结果来判定下一步的逻辑，要注意的点是waitForConfirmsOrDie 方法如果返回 false 则会关闭 channel，则接下来无法发送消息到 broker

```yaml
spring:
  rabbitmq:
    host: 192.168.10.40
    port: 5672
    username: admin
    password: 123
    virtual-host: /
    publisher-confirm-type: correlated
```

### 8.1.4. 添加配置类

```java
package com.du.config;


import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [发布确认高级 配置类]
 * @Version : [v1.0]
 * @Date : [2022/2/26 23:53]
 */
@Configuration
public class ConfirmConfig {
    
    public static final String CONFIRM_EXCHANGE_NAME = "confirm.exchange";
    public static final String CONFIRM_QUEUE_NAME = "confirm.queue";
    
    //声明业务 Exchange
    @Bean("confirmExchange")
    public DirectExchange confirmExchange(){
        return new DirectExchange(CONFIRM_EXCHANGE_NAME);
    }
    
    // 声明确认队列
    @Bean("confirmQueue")
    public Queue confirmQueue(){
        return QueueBuilder.durable(CONFIRM_QUEUE_NAME).build();
    }
    
    // 声明确认队列绑定关系
    @Bean
    public Binding queueBinding(@Qualifier("confirmQueue") Queue queue,
                                @Qualifier("confirmExchange") DirectExchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with("key1");
    }
}
```

### 8.1.5. 消息生产者

```java
package com.du.controller;

import com.du.config.ConfirmConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [发布确认 生产者]
 * @Version : [v1.0]
 * @Date : [2022/2/26 23:55]
 */
@Slf4j
@RestController
@RequestMapping("/confirm")
@RequiredArgsConstructor
public class ProducerController {

    private final RabbitTemplate rabbitTemplate;

    @GetMapping("/sendMessage/{message}")
    public void sendMessage(@PathVariable String message) {
        // 回调时CorrelationData参数需要在发送消息时自己创建
        CorrelationData correlationData = new CorrelationData("1");
        rabbitTemplate.convertAndSend(
                ConfirmConfig.CONFIRM_EXCHANGE_NAME,
                ConfirmConfig.CONFIRM_ROUTING_KEY,
                message,
                correlationData
        );
        log.info("发送消息：{}", message);
    }
}
```

### 8.1.6. 回调接口

```java
package com.du.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [交换机确认回调类]
 * @Version : [v1.0]
 * @Date : [2022/2/27 13:53]
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ConfirmCallBack implements RabbitTemplate.ConfirmCallback {

    private final RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init() {
        // 注入
        rabbitTemplate.setConfirmCallback(this);
    }

    /**
     * 交换机确认回调方法
     *
     * @param correlationData 保存回调消息的ID及相关信息
     * @param ack             交换机是否收到消息
     * @param cause           失败的原因
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
        String id = correlationData != null ? correlationData.getId() : "";
        if (ack) {
            log.info("交换机已收到ID为：{}的消息", id);
        } else {
            log.info("交换机未收到ID为：{}的消息，失败原因：{}", id, cause);
        }
    }
}
```

### 8.1.7. 消息消费者

```java
@Slf4j
@Component
public class ConfirmConsumer {

    @RabbitListener(queues = ConfirmConfig.CONFIRM_QUEUE_NAME)
    public void receiveConfirm(Message message, Channel channel) {
        log.info("收到消息：{}",new String(message.getBody()));
    }
}
```

发送请求：

http://localhost:8080/confirm/sendMessage/hello

成功发送，正常回调

![image-20220227144341130](https://www.coderdu.tech/image/image-20220227144341130.png)

修改交换机名称，测试发送失败，确认回调，打印回调信息

![image-20220227144454725](https://www.coderdu.tech/image/image-20220227144454725.png)

```
2022-02-27 14:44:36.886 ERROR 3292 --- [.168.10.40:5672] o.s.a.r.c.CachingConnectionFactory       : Shutdown Signal: channel error; protocol method: #method<channel.close>(reply-code=404, reply-text=NOT_FOUND - no exchange 'confirm.exchange123' in vhost '/', class-id=60, method-id=40)
```

> 修改队列名称，测试发送一个正确的跟一个失败的

```java
// 发送成功
CorrelationData correlationData = new CorrelationData("1");
rabbitTemplate.convertAndSend(
    ConfirmConfig.CONFIRM_EXCHANGE_NAME,
    ConfirmConfig.CONFIRM_ROUTING_KEY,
    "key1——" + message,
    correlationData
);
log.info("key1发送消息：{}", "key1——" + message);

// 发送失败
CorrelationData correlationData2 = new CorrelationData("2");
rabbitTemplate.convertAndSend(
    ConfirmConfig.CONFIRM_EXCHANGE_NAME,
    ConfirmConfig.CONFIRM_ROUTING_KEY + "2",
    "key12——" + message,
    correlationData2
);
log.info("key12发送消息：{}", "key12——" + message);
```

![image-20220227150014135](https://www.coderdu.tech/image/image-20220227150014135.png)

发送了两条消息，第一条消息的 RoutingKey 为 "key1"，第二条消息的 RoutingKey 为"key12"，两条消息都成功被交换机接收，也收到了交换机的确认回调，但消费者只收到了一条消息，因为第二条消息的 RoutingKey 与队列的 BindingKey 不一致，也没有其它队列能接收这个消息，所有第二条消息被直接丢弃了。  

## 8.2. 回退消息

Mandatory 参数

​		**在仅开启了生产者确认机制的情况下，交换机接收到消息后，会直接给消息生产者发送确认消息，如果发现该消息不可路由，那么消息会被直接丢弃，此时生产者是不知道消息被丢弃这个事件的。**通过设置 mandatory 参数可以在当消息传递过程中不可达目的地时将消息返回给生产者。  

添加配置文件，发布消息回退

```yaml
spring:
  rabbitmq:
    publisher-returns: true
```

**回退消息需要实现接口`RabbitTemplate.ReturnsCallback`**，在之前的`ConfirmCallBack`类添加代码

```java
package com.du.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [交换机确认回调类]
 * @Version : [v1.0]
 * @Date : [2022/2/27 13:53]
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ConfirmCallBack implements RabbitTemplate.ConfirmCallback, RabbitTemplate.ReturnsCallback {

    private final RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init() {
        // 注入
        rabbitTemplate.setConfirmCallback(this);
        rabbitTemplate.setReturnsCallback(this);
    }

    /**
     * 交换机确认回调方法
     *
     * @param correlationData 保存回调消息的ID及相关信息
     * @param ack             交换机是否收到消息
     * @param cause           失败的原因
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
        String id = correlationData != null ? correlationData.getId() : "";
        if (ack) {
            log.info("交换机已收到ID为：{}的消息", id);
        } else {
            log.info("交换机未收到ID为：{}的消息，失败原因：{}", id, cause);
        }
    }

    // 可以在当消息传递过程中不可达目的地时将消息返回给生产者,只有不可达的时候，才进行回退
    @Override
    public void returnedMessage(ReturnedMessage returned) {
        String message = new String(returned.getMessage().getBody());
        String exchange = returned.getExchange();
        String replyText = returned.getReplyText();
        String routingKey = returned.getRoutingKey();
        log.error("消息{},被交换机{}退回,退回原因:{},路由key{}", message, exchange, replyText, routingKey);
    }
}
```

发送请求：

http://localhost:8080/confirm/sendMessage/hello

![image-20220227151503972](https://www.coderdu.tech/image/image-20220227151503972.png)

## 8.3. 备份交换机

​		有了 mandatory 参数和回退消息，我们获得了对无法投递消息的感知能力，有机会在生产者的消息无法被投递时发现并处理。但有时候，我们并不知道该如何处理这些无法路由的消息，最多打个日志，然后触发报警，再来手动处理。而通过日志来处理这些无法路由的消息是很不优雅的做法，特别是当生产者所在的服务有多台机器的时候，手动复制日志会更加麻烦而且容易出错。而且设置 mandatory 参数会增加生产者的复杂性，需要添加处理这些被退回的消息的逻辑。如果既不想丢失消息，又不想增加生产者的复杂性，该怎么做呢？前面在设置死信队列的文章中，我们提到，可以为队列设置死信交换机来存储那些处理失败的消息，可是这些不可路由消息根本没有机会进入到队列，因此无法使用死信队列来保存消息。在 RabbitMQ 中，有一种备份交换机的机制存在，可以很好的应对这个问题。什么是备份交换机呢？备份交换机可以理解为 RabbitMQ 中交换机的“备胎”，当我们为某一个交换机声明一个对应的备份交换机时，就是为它创建一个备胎，当交换机接收到一条不可路由消息时，将会把这条消息转发到备份交换机中，由备份交换机来进行转发和处理，通常备份交换机的类型为 Fanout ，这样就能把所有消息都投递到与其绑定的队列中，然后我们在备份交换机下绑定一个队列，这样所有那些原交换机无法被路由的消息，就会都进入这个队列了。当然，我们还可以建立一个报警队列，用独立的消费者来进行监测和报警。  

### 8.3.1. 代码架构图

![image-20220227151620090](https://www.coderdu.tech/image/image-20220227151620090.png)

### 8.3.2. 备份配置类

```java
package com.du.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [备份、报警交换机配置类]
 * @Version : [v1.0]
 * @Date : [2022/2/27 15:18]
 */
@Configuration
public class BackupConfig {

    // 确认交换机
    public static final String CONFIRM_EXCHANGE = "confirm_exchange";
    // 确认队列
    public static final String CONFIRM_QUEUE = "confirm_queue";
    // 确认队列routingKey
    public static final String CONFIRM_ROUTING_KEY = "confirm_routing_key";

    // 备份交换机
    public static final String BACKUP_EXCHANGE = "backup_exchange";
    // 备份队列
    public static final String BACKUP_QUEUE = "backup_queue";
    // 报警队列
    public static final String WARNING_QUEUE = "warning_queue";

    // 声明确认交换机,绑定备份交换机
    @Bean
    public DirectExchange confirmExchange() {
        return ExchangeBuilder
                .directExchange(CONFIRM_EXCHANGE)
                // 需要持久化
                .durable(true)
                // 设置备份交换机
                .alternate(BACKUP_EXCHANGE)
                .build();
    }

    // 声明确认队列
    @Bean
    public Queue confirmQueue() {
        return QueueBuilder.durable(CONFIRM_QUEUE).build();
    }

    // 绑定确认交换机跟确认队列
    @Bean
    public Binding confirmBind(
            @Qualifier("confirmQueue") Queue queue,
            @Qualifier("confirmExchange") DirectExchange directExchange
    ) {
        return BindingBuilder.bind(queue).to(directExchange).with(CONFIRM_ROUTING_KEY);
    }

    // 声明备份交换机,扇出类型
    @Bean
    public FanoutExchange backupExchange() {
        return new FanoutExchange(BACKUP_EXCHANGE);
    }

    // 声明备份队列
    @Bean
    public Queue backupQueue() {
        return new Queue(BACKUP_QUEUE);
    }

    // 声明报警队列
    @Bean
    public Queue warningQueue() {
        return new Queue(WARNING_QUEUE);
    }

    // 绑定备份交换机跟备份队列
    @Bean
    public Binding backupBind(
            @Qualifier("backupQueue") Queue queue,
            @Qualifier("backupExchange") FanoutExchange fanoutExchange
    ) {
        return BindingBuilder.bind(queue).to(fanoutExchange);
    }

    // 绑定备份交换机跟报警队列
    @Bean
    public Binding warningBind(
            @Qualifier("warningQueue") Queue queue,
            @Qualifier("backupExchange") FanoutExchange fanoutExchange
    ) {
        return BindingBuilder.bind(queue).to(fanoutExchange);
    }
}
```

### 8.3.3 生产者

```java
package com.du.controller;

import com.du.config.BackupConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [备份生产者]
 * @Version : [v1.0]
 * @Date : [2022/2/27 16:08]
 */
@Slf4j
@RestController
@RequestMapping("/backup")
@RequiredArgsConstructor
public class BackupController {

    private final RabbitTemplate rabbitTemplate;

    @GetMapping("/sendMessage/{message}")
    public void sendMessage(@PathVariable String message) {
        rabbitTemplate.convertAndSend(
                BackupConfig.CONFIRM_EXCHANGE,
                BackupConfig.CONFIRM_ROUTING_KEY,
                message
        );
    }
}
```

### 8.3.4. 消费者

```java
package com.du.consumer;

import com.du.config.BackupConfig;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [备份、报警消费者]
 * @Version : [v1.0]
 * @Date : [2022/2/27 15:57]
 */
@Slf4j
@Component
public class BackupConsumer {

    // 备份消费者
    @RabbitListener(queues = BackupConfig.BACKUP_QUEUE)
    public void backupConsumer(Message message, Channel channel) {
        log.info("备份消费者收到消息：{}", message);
    }

    // 报警消费者
    @RabbitListener(queues = BackupConfig.WARNING_QUEUE)
    public void warningConsumer() {
        log.error("确认交换机已经宕机了！！！");
    }
}
```

测试：

修改生产者，让交换机找不到确认队列的key，**消息必须到达确认交换机，当消息发送不到队列时，消息会被转发到备份交换机**

![image-20220227162420741](https://www.coderdu.tech/image/image-20220227162420741.png)

![image-20220227162824377](https://www.coderdu.tech/image/image-20220227162824377.png)

**mandatory(消息回退)**参数与备份交换机可以一起使用的时候，如果两者同时开启，**备份交换机优先级高**
