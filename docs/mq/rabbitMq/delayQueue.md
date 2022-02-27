---
title: 7. 延迟队列
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

## 7.1. 延迟队列概念

​		延时队列,队列内部是有序的，最重要的特性就体现在它的延时属性上，延时队列中的元素是希望在指定时间到了以后或之前取出和处理，简单来说，延时队列就是用来存放需要在指定时间被处理的元素的队列。  

## 7.2. 延迟队列使用场景

1. 订单在十分钟之内未支付则自动取消

2. 新创建的店铺，如果在十天内都没有上传过商品，则自动发送消息提醒

3. 用户注册成功后，如果三天内没有登陆则进行短信提醒。

4. 用户发起退款，如果三天内没有得到处理则通知相关运营人员。

5. 预定会议后，需要在预定的时间点前十分钟通知各个与会人员参加会议

​		这些场景都有一个特点，需要在某个事件发生之后或者之前的指定时间点完成某一项任务，如：发生订单生成事件，在十分钟之后检查该订单支付状态，然后将未支付的订单进行关闭；看起来似乎使用定时任务，一直轮询数据，每秒查一次，取出需要被处理的数据，然后处理不就完事了吗？如果数据量比较少，确实可以这样做，比如：对于“如果账单一周内未支付则进行自动结算”这样的需求，如果对于时间不是严格限制，而是宽松意义上的一周，那么每天晚上跑个定时任务检查一下所有未支付的账单，确实也是一个可行的方案。但对于数据量比较大，并且时效性较强的场景，如：“订单十分钟内未支付则关闭“，短期内未支付的订单数据可能会有很多，活动期间甚至会达到百万甚至千万级别，对这么庞大的数据量仍旧使用轮询的方式显然是不可取的，很可能在一秒内无法完成所有订单的检查，同时会给数据库带来很大压力，无法满足业务要求而且性能低下。  

![image-20220224125721389](https://coderdu.com/image/image-20220224125721389.png)

## 7.3. RabbitMQ 中的 TTL

​		TTL 是什么呢？ TTL 是 RabbitMQ 中一个消息或者队列的属性，表明一条消息或者该队列中的所有消息的最大存活时间。

​		单位是毫秒。换句话说，如果一条消息设置了 TTL 属性或者进入了设置 TTL 属性的队列，那么这条消息如果在 TTL 设置的时间内没有被消费，则会成为"死信"。如果同时配置了队列的 TTL 和消息的TTL，那么较小的那个值将会被使用，有两种方式设置 TTL。  

### 7.3.1. 消息设置 TTL

针对每条消息设置 TTL

```java
AMQP.BasicProperties properties = new AMQP.BasicProperties()
                .builder()
                .expiration("10000")
                .build();
```

### 7.3.2. 队列设置 TTL

在创建队列的时候设置队列的“x-message-ttl”属性

```java
rabbitTemplate.convertAndSend(
    TtlQueueConfig.X_EXCHANGE,
    MsgTtlQueueConfig.QUEUE_C_BIND_EXCHANGE_X,
    "消息来自 ttl 为 " + ttlTime + "毫秒 的队列:" + message,
    messagePostProcessor -> {
        // 设置发送消息的时候 延迟时长
        messagePostProcessor.getMessageProperties().setExpiration(ttlTime);
        return messagePostProcessor;
    }
);
```

### 7.3.3. 两者的区别 

​		如果设置了队列的 TTL 属性，那么一旦消息过期，就会被队列丢弃(如果配置了死信队列被丢到死信队列中)，而第二种方式，消息即使过期，也不一定会被马上丢弃，因为**消息是否过期是在即将投递到消费者之前判定的**，如果当前队列有严重的消息积压情况，则已过期的消息也许还能存活较长时间；另外，还需要注意的一点是，如果不设置 TTL，表示消息永远不会过期，如果将 TTL 设置为 0，则表示除非此时可以直接投递该消息到消费者，否则该消息将会被丢弃。

​		前一小节我们介绍了死信队列，刚刚又介绍了 TTL，至此利用 RabbitMQ 实现延时队列的两大要素已经集齐，接下来只需要将它们进行融合，再加入一点点调味料，延时队列就可以新鲜出炉了。想想看，延时队列，不就是想要消息延迟多久被处理吗， TTL 则刚好能让消息在延迟多久之后成为死信，另一方面，成为死信的消息都会被投递到死信队列里，这样只需要消费者一直消费死信队列里的消息就完事了，因为里面的消息都是希望被立即处理的消息。  

## 7.4. 整合 springboot

1. 创建SpringBoot项目

2. 添加依赖

    ```xml
    <dependencies>
        <!--RabbitMQ 依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-amqp</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.47</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <!--swagger-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>3.0.0</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.9.2</version>
        </dependency>
        <!--RabbitMQ 测试依赖-->
        <dependency>
            <groupId>org.springframework.amqp</groupId>
            <artifactId>spring-rabbit-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    ```

3. 修改配置文件

    ```yaml
    spring:
      rabbitmq:
        host: 192.168.10.40
        port: 5672
        username: admin
        password: 123
        virtual-host: /
    ```

4. 添加swagger配置类

    测试使用

    ```java
    @Configuration
    @EnableSwagger2
    public class SwaggerConfig {
    
        @Bean
        public Docket webApiConfig(){
            return new Docket(DocumentationType.SWAGGER_2)
                    .groupName("webApi")
                    .apiInfo(webApiInfo())
                    .select().build();
        }
        private ApiInfo webApiInfo(){
            return new ApiInfoBuilder()
                    .title("rabbitmq 接口文档")
                    .description("本文档描述了 rabbitmq 微服务接口定义")
                    .version("1.0")
                    .contact(new Contact("Du", "https://www.coderdu.com/",
                            "2548425238@qq.com"))
                    .build();
        }
    }
    ```

## 7.5. 队列 TTL

### 7.5.1. 代码架构图

​		创建两个队列 QA 和 QB，两者队列 TTL 分别设置为 10S 和 40S，然后在创建一个交换机 X 和死信交换机 Y，它们的类型都是 direct，创建一个死信队列 QD，它们的绑定关系如下：

![image-20220224130156457](https://coderdu.com/image/image-20220224130156457.png)

### 7.5.2. 配置文件类代码

```java
@Configuration
public class TtlQueueConfig {

    /**
     * 普通交换机，普通队列
     */
    public static final String X_EXCHANGE = "X";
    public static final String QUEUE_A = "QA";
    public static final String QUEUE_B = "QB";

    /**
     * 死信交换机，死信队列
     */
    public static final String Y_DEAD_LETTER_EXCHANGE = "Y";
    public static final String DEAD_LETTER_QUEUE = "QD";

    /**
     * routingKey
     */
    public static final String QUEUE_A_BIND_EXCHANGE_X = "XA";
    public static final String QUEUE_B_BIND_EXCHANGE_X = "XB";
    public static final String QUEUE_D_BIND_EXCHANGE_Y = "YD";

    // 声明xExchange
    @Bean("xExchange")
    public DirectExchange xExchange() {
        return new DirectExchange(X_EXCHANGE);
    }

    // 声明yExchange
    @Bean("yExchange")
    public DirectExchange yExchange() {
        return new DirectExchange(Y_DEAD_LETTER_EXCHANGE);
    }

    // 声明普通队列queueA
    @Bean("queueA")
    public Queue queueA() {
        return QueueBuilder
                .durable(QUEUE_A)
                // 设置死信交换机
                .deadLetterExchange(Y_DEAD_LETTER_EXCHANGE)
                // 设置死信交换机routingKey
                .deadLetterRoutingKey(QUEUE_D_BIND_EXCHANGE_Y)
                // 设置TTL ms
                .ttl(10000)
                .build();
    }

    // 将普通队列A与交换机Y绑定
    @Bean
    public Binding queueABindingX(
            @Qualifier("queueA") Queue queue,
            @Qualifier("xExchange") DirectExchange xExchange
    ) {
        return BindingBuilder.bind(queue).to(xExchange).with(QUEUE_A_BIND_EXCHANGE_X);
    }

    // 声明普通队列queueB
    @Bean("queueB")
    public Queue queueB() {
        return QueueBuilder
                .durable(QUEUE_B)
                // 设置死信交换机
                .deadLetterExchange(Y_DEAD_LETTER_EXCHANGE)
                // 设置死信交换机routingKey
                .deadLetterRoutingKey(QUEUE_D_BIND_EXCHANGE_Y)
                // 设置TTL ms
                .ttl(40000)
                .build();
    }

    // 将普通队列B与普通交换机X绑定
    @Bean
    public Binding queueBBindX(
            @Qualifier("queueB") Queue queue,
            @Qualifier("xExchange") DirectExchange xExchange
    ) {
        return BindingBuilder.bind(queue).to(xExchange).with(QUEUE_B_BIND_EXCHANGE_X);
    }

    ;

    // 声明死信队列
    @Bean("queueD")
    public Queue queueD() {
        return QueueBuilder.durable(DEAD_LETTER_QUEUE).build();
    }

    // 将死信队列D与死信交换机Y绑定
    @Bean
    public Binding queueDBindY(
            @Qualifier("queueD") Queue queue,
            @Qualifier("yExchange") DirectExchange yExchange
    ) {
        return BindingBuilder.bind(queue).to(yExchange).with(QUEUE_D_BIND_EXCHANGE_Y);
    }
}
```

### 7.5.3. 消息生产者代码

```java
@Slf4j
@RequestMapping("/ttl")
@RestController
@RequiredArgsConstructor
public class SendMsgController {

    private final RabbitTemplate rabbitTemplate;

    public static final String X_EXCHANGE = "X";
    public static final String QUEUE_A_BIND_EXCHANGE_X = "XA";
    public static final String QUEUE_B_BIND_EXCHANGE_X = "XB";

    @GetMapping("/send/{message}")
    public void sendMessage(@PathVariable("message") String message) {
        log.info("当前时间：{},发送一条信息给两个 TTL 队列:{}", LocalDateTime.now(), message);
        rabbitTemplate.convertAndSend(TtlQueueConfig.X_EXCHANGE, TtlQueueConfig.QUEUE_A_BIND_EXCHANGE_X, "消息来自 ttl 为 10S 的队列:" + message);
        rabbitTemplate.convertAndSend(TtlQueueConfig.X_EXCHANGE, TtlQueueConfig.QUEUE_B_BIND_EXCHANGE_X, "消息来自 ttl 为 40S 的队列:" + message);
    }
}
```

### 7.5.4. 消息消费者代码  

```java
package com.du.consumer;

import com.du.config.TtlQueueConfig;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [队列消费者]
 * @Version : [v1.0]
 * @Date : [2022/2/26 13:46]
 */
@Slf4j
@Component
public class DeadLetterQueueConsumer {

    // 接收消息
    @RabbitListener(queues = TtlQueueConfig.DEAD_LETTER_QUEUE)
    public void receiveD(Message message, Channel channel) throws Exception {
        String msg = new String(message.getBody());
        log.info("当前时间：{}，收到死信队列的消息：{}", LocalDateTime.now(), msg);
    }
}

```

发送一个请求http://localhost:8080/ttl/send/hello

![image-20220226151353907](https://coderdu.com/image/image-20220226151353907.png)

​		第一条消息在 10S 后变成了死信消息，然后被消费者消费掉，第二条消息在 40S 之后变成了死信消息，然后被消费掉，这样一个延时队列就打造完成了。

​		不过，如果这样使用的话，岂不是**每增加一个新的时间需求，就要新增一个队列**，这里只有 10S 和 40S两个时间选项，如果需要一个小时后处理，那么就需要增加 TTL 为一个小时的队列，如果是预定会议室然后提前通知这样的场景，岂不是要增加无数个队列才能满足需求？  

## 7.6. 延时队列优化

### 7.6.1. 代码架构图

在这里新增了一个队列 QC,绑定关系如下,该队列不设置 TTL 时间

![image-20220226143845629](https://coderdu.com/image/image-20220226143845629.png)

### 7.6.2. 配置文件代码

```java
package com.du.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [一句话描述该类的功能]
 * @Version : [v1.0]
 * @Date : [2022/2/26 14:42]
 */
@Configuration
public class MsgTtlQueueConfig {

    public static final String QUEUE_C = "QC";

    public static final String QUEUE_C_BIND_EXCHANGE_X = "XC";

    // 声明队列C 死信交换机
    @Bean
    public Queue queueC(){
        return QueueBuilder
                .durable(QUEUE_C)
                .deadLetterExchange(TtlQueueConfig.Y_DEAD_LETTER_EXCHANGE)
                .deadLetterRoutingKey(TtlQueueConfig.QUEUE_D_BIND_EXCHANGE_Y)
                .build();
    }

    // 将队列C与交换机X绑定
    @Bean
    public Binding queueCBindingX(
            @Qualifier("queueC") Queue queue,
            @Qualifier("xExchange")DirectExchange xExchange
            ){
        return BindingBuilder.bind(queue).to(xExchange).with(QUEUE_C_BIND_EXCHANGE_X);
    }
}
```

### 7.6.3. 消息生产者代码

```java
// 发送过期时间，指定延时队列过期时间
@GetMapping("/sendExpirationMsg/{message}/{ttlTime}")
public void sendMessageTtl(@PathVariable("message") String message, @PathVariable("ttlTime") String ttlTime) {
    log.info("当前时间：{},发送一条时长{}毫秒TTL信息给队列QC:{}", LocalDateTime.now(), ttlTime, message);

    rabbitTemplate.convertAndSend(
        TtlQueueConfig.X_EXCHANGE,
        MsgTtlQueueConfig.QUEUE_C_BIND_EXCHANGE_X,
        "消息来自 ttl 为 " + ttlTime + "毫秒 的队列:" + message,
        messagePostProcessor -> {
            // 设置发送消息的时候 延迟时长
            messagePostProcessor.getMessageProperties().setExpiration(ttlTime);
            return messagePostProcessor;
        }
    );
}
```

发送请求

http://localhost:8080/ttl/sendExpirationMsg/hello1/20000

http://localhost:8080/ttl/sendExpirationMsg/hello2/2000

![image-20220226151634041](https://coderdu.com/image/image-20220226151634041.png)

==存在一个问题：==

​		如果使用在消息属性上设置 TTL 的方式，消息可能并不会按时“死亡“，因为**RabbitMQ 只会检查第一个消息是否过期，如果过期则丢到死信队列，如果第一个消息的延时时长很长，而第二个消息的延时时长很短，第二个消息并不会优先得到执行。**

## 7.7. Rabbitmq 插件实现延迟队列

### 7.7.1. 安装延时队列插件

使用RabbitMQ官方提供的插件可以解决我们上面存在的问题

在官网上下载 https://www.rabbitmq.com/community-plugins.html，下载rabbitmq_delayed_message_exchange 插件，然后解压放置到 RabbitMQ 的插件目录。  

https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases

下载对应rabbitmq对应版本，ez后缀文件

![image-20220226160952799](https://coderdu.com/image/image-20220226160952799.png)

进入 RabbitMQ 的安装目录下的 plugins目录，执行下面命令让该插件生效，然后重启 RabbitMQ  

```bash
cd /usr/lib/rabbitmq/lib/rabbitmq_server-3.8.8/plugins
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

![image-20220226161142683](https://coderdu.com/image/image-20220226161142683.png)

重启rabbitmq

```bash
systemctl restart rabbitmq-server.service
```

添加成功，去rabbitmq控制台添加交换机会有一个新的类型x-delayed-message

![image-20220226161416952](https://coderdu.com/image/image-20220226161416952.png)

### 7.7.2. 代码架构图

在这里新增了一个队列 delayed.queue,一个自定义交换机 delayed.exchange，绑定关系如下:

![image-20220226161447888](https://coderdu.com/image/image-20220226161447888.png)

### 7.7.3. 配置文件类代码

​		在我们自定义的交换机中，这是一种新的交换类型，该类型消息支持延迟投递机制 消息传递后并不会立即投递到目标队列中，而是存储在 mnesia(一个分布式数据系统)表中，当达到投递时间时，才投递到目标队列中。  

```java
package com.du.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [延迟交换机]
 * @Version : [v1.0]
 * @Date : [2022/2/26 16:27]
 */
@Configuration
public class DelayedQueueConfig {

    public static final String DELAYED_EXCHANGE_NAME = "delayed.exchange";
    public static final String DELAYED_EXCHANGE_TYPE = "x-delayed-messgae";
    public static final String DELAYED_QUEUE_NAME = "delayed.queue";
    public static final String DELAYED_ROUTING_KEY = "delayed.routingKey";

    // 声明基于插件的交换机
    @Bean
    public CustomExchange delayedExchange() {
        Map<String, Object> arguments = new HashMap<>(1);
        // 延迟类型
        arguments.put("x-delayed-type", "direct");
        /**
         * 1. 交换机名称
         * 2. 交换机类型
         * 3. 是否持久化
         * 4. 是否自动删除
         * 5. 其他参数
         */
        return new CustomExchange(
                DELAYED_EXCHANGE_NAME,
                DELAYED_EXCHANGE_TYPE,
                false,
                false,
                arguments
        );
    }

    // 声明延迟队列
    @Bean
    public Queue delayedQueue() {
        return QueueBuilder.durable(DELAYED_QUEUE_NAME).build();
    }

    // 将延迟交换机跟延迟队列进行绑定
    @Bean
    public Binding delayedQueueBind(
            @Qualifier("delayedQueue") Queue delayedQueue,
            @Qualifier("delayedExchange") CustomExchange delayedExchange
    ) {
        return BindingBuilder.bind(delayedQueue).to(delayedExchange).with(DELAYED_ROUTING_KEY).noargs();
    }
}
```

### 7.7.4. 消息生产者代码

```java
// 基于插件的 消息 延迟时间
@GetMapping("/sendDelayMsg/{message}/{delayTime}")
public void sendMessageDelay(@PathVariable String message, @PathVariable String delayTime) {
    log.info("当前时间：{},发送一条时长{}毫秒信息给延迟队列delayed.queue:{}", LocalDateTime.now(), delayTime, message);
    rabbitTemplate.convertAndSend(
        DelayedQueueConfig.DELAYED_EXCHANGE_NAME,
        DelayedQueueConfig.DELAYED_ROUTING_KEY,
        message,
        messagePostProcessor -> {
            messagePostProcessor.getMessageProperties().setExpiration(delayTime);
            return messagePostProcessor;
        });
}
```

### 7.7.5. 消息消费者代码

```java
package com.du.consumer;

import com.du.config.DelayedQueueConfig;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * @Author : Du YingJie (2548425238@qq.com)
 * @Description : [延迟队列消费者]
 * @Version : [v1.0]
 * @Date : [2022/2/26 16:56]
 */
@Slf4j
@Component
public class DelayQueueConsumer {

    // 监听消息
    @RabbitListener(queues = DelayedQueueConfig.DELAYED_QUEUE_NAME)
    public void receiveDelayQueue(Message message, Channel channel) {
        log.info("当前时间{}，收到队列{}的消息{}", LocalDateTime.now(), DelayedQueueConfig.DELAYED_QUEUE_NAME, new String(message.getBody()));
    }
}
```

发起请求：

http://localhost:8080/ttl/sendDelayMsg/hello1/20000

http://localhost:8080/ttl/sendDelayMsg/hello2/2000

## 7.8. 总结

基于死信的延迟队列流程

![image-20220226162420154](https://coderdu.com/image/image-20220226162420154.png)

基于插件的延迟队列流程

![image-20220226162408042](https://coderdu.com/image/image-20220226162408042.png)

​		延时队列在需要延时处理的场景下非常有用，使用 RabbitMQ 来实现延时队列可以很好的利用RabbitMQ 的特性，如：消息可靠发送、消息可靠投递、死信队列来保障消息至少被消费一次以及未被正确处理的消息不会被丢弃。另外，通过 RabbitMQ 集群的特性，可以很好的解决单点故障问题，不会因为单个节点挂掉导致延时队列不可用或者消息丢失。

​		当然，延时队列还有很多其它选择，比如利用 Java 的 DelayQueue，利用 Redis 的 zset，利用 Quartz或者利用 kafka 的时间轮，这些方式各有特点,看需要适用的场景
