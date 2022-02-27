---
title: 1.消息队列
date: 2022-2-27
categories:
 - RabbitMQ
tags:
 - RabbitMQ
---

## 1.1. MQ 的相关概念

### 1.1.1. 什么是 MQ

MQ(message queue)，从字面意思上看，本质是个队列， FIFO 先入先出，只不过队列中存放的内容是message 而已，还是一种跨进程的通信机制，用于上下游传递消息。在互联网架构中， MQ 是一种非常常见的上下游“逻辑解耦+物理解耦”的消息通信服务。使用了 MQ 之后，消息发送上游只需要依赖MQ，不用依赖其他服务。

### 1.1.2. 为什么要用 MQ

#### 1.流量消峰

举个例子，如果订单系统最多能处理一万次订单，这个处理能力应付正常时段的下单时绰绰有余，正常时段我们下单一秒后就能返回结果。但是在高峰期，如果有两万次下单操作系统是处理不了的，只能限制订单超过一万后不允许用户下单。使用消息队列做缓冲，我们可以取消这个限制，把一秒内下的订单分散成一段时间来处理，这时有些用户可能在下单十几秒后才能收到下单成功的操作，但是比不能下单的体验要好。

#### 2.应用解耦

以电商应用为例，应用中有订单系统、库存系统、物流系统、支付系统。用户创建订单后，如果耦合调用库存系统、物流系统、支付系统，任何一个子系统出了故障，都会造成下单操作异常。当转变成基于消息队列的方式后，系统间调用的问题会减少很多，比如物流系统因为发生故障，需要几分钟来修复。在这几分钟的时间里，物流系统要处理的内存被缓存在消息队列中，用户的下单操作可以正常完成。当物流系统恢复后，继续处理订单信息即可，中单用户感受不到物流系统的故障， 提升系统的可用性。

![image-20220121141633627](https://coderdu.com/image/image-20220121141633627.png)

#### 3.异步处理

有些服务间调用是异步的，例如 A 调用 B， B 需要花费很长时间执行，但是 A 需要知道 B 什么时候可以执行完，以前一般有两种方式， A 过一段时间去调用 B 的查询 api 查询。或者 A 提供一个 callback api，B 执行完之后调用 api 通知 A 服务。这两种方式都不是很优雅， 使用消息总线，可以很方便解决这个问题，A 调用 B 服务后，只需要监听 B 处理完成的消息，当 B 处理完成后，会发送一条消息给 MQ， MQ 会将此消息转发给 A 服务。这样 A 服务既不用循环调用 B 的查询 api，也不用提供 callback api。同样 B 服务也不用做这些操作。 A 服务还能及时的得到异步处理成功的消息。  

![image-20220121141704195](https://coderdu.com/image/image-20220121141704195.png)

### 1.1.3. MQ 的分类

#### 1.ActiveMQ

优点： 单机吞吐量万级，时效性 ms 级，可用性高，基于主从架构实现高可用性，消息可靠性较低的概率丢失数据

缺点:官方社区现在对 ActiveMQ 5.x **维护越来越少， 高吞吐量场景较少使用**。

#### 2.Kafka

大数据的杀手锏，谈到大数据领域内的消息传输，则绕不开 Kafka，这款为**大数据而生**的消息中间件，以其**百万级 TPS **的吞吐量名声大噪，迅速成为大数据领域的宠儿，在数据采集、传输、存储的过程中发挥着举足轻重的作用。目前已经被 LinkedIn， Uber, Twitter, Netflix 等大公司所采纳。

优点: 性能卓越，单机写入 TPS 约在百万条/秒，最大的优点，就是**吞吐量高**。时效性 ms 级可用性非常高， kafka 是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用,消费者采用 Pull 方式获取消息, 消息有序, 通过控制能够保证所有消息被消费且仅被消费一次;有优秀的第三方Kafka Web 管理界面 Kafka-Manager；在日志领域比较成熟，被多家公司和多个开源项目使用；功能支持：功能较为简单，主要支持简单的 MQ 功能，在大数据领域的**实时计算**以及**日志采集**被大规模使用

缺点： Kafka 单机超过 64 个队列/分区， Load 会发生明显的飙高现象，队列越多， load 越高，发送消息响应时间变长， 使用短轮询方式，实时性取决于轮询间隔时间， 消费失败不支持重试； 支持消息顺序，但是一台代理宕机后，就会产生消息乱序， **社区更新较慢**；

#### 3.RocketMQ

RocketMQ 出自阿里巴巴的开源产品，用 Java 语言实现，在设计时参考了 Kafka，并做出了自己的一些改进。被阿里巴巴广泛应用在订单，交易，充值，流计算，消息推送，日志流式处理， binglog 分发等场景。

优点：**单机吞吐量十万级**，可用性非常高，分布式架构，**消息可以做到 0 丢失**，MQ功能较为完善，还是分布式的，扩展性好，**支持 10 亿级别的消息堆积**，不会因为堆积导致性能下降,源码是 java 我们可以自己阅读源码，定制自己公司的 MQ

缺点： **支持的客户端语言不多**，目前是 java 及 c++，其中 c++不成熟；社区活跃度一般,没有在 MQ核心中去实现 JMS 等接口,有些系统要迁移需要修改大量代码

#### 4.RabbitMQ

2007 年发布，是一个在 AMQP(高级消息队列协议)基础上完成的，可复用的企业消息系统，是**当前最主流的消息中间件之一**。

优点：由于 erlang 语言的**高并发特性**，性能较好； **吞吐量到万级**， MQ 功能比较完备,健壮、稳定、易用、跨平台、 **支持多种语言 **如： Python、 Ruby、 .NET、 Java、 JMS、 C、 PHP、 ActionScript、 XMPP、 STOMP等，支持 AJAX 文档齐全；开源提供的管理界面非常棒，用起来很好用，**社区活跃度高**； 更新频率相当高

[官网](https://www.rabbitmq.com/)

缺点：商业版需要收费,学习成本较高

### 1.1.4. MQ 的选择

#### 1.Kafka

Kafka 主要特点是基于 Pull 的模式来处理消息消费，追求高吞吐量，一开始的目的就是用于日志收集和传输，适合产生**大量数据**的互联网服务的数据收集业务。 **大型公司**建议可以选用，如果有**日志采集**功能，肯定是首选 kafka 了。

#### 2.RocketMQ

天生为**金融互联网**领域而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款， 以及业务削峰，在大量交易涌入时，后端可能无法及时处理的情况。 RoketMQ 在稳定性上可能更值得信赖，这些业务场景在阿里双 11 已经经历了多次考验，如果你的业务有上述并发场景，建议可以选择 RocketMQ。

#### 3.RabbitMQ

结合 erlang 语言本身的并发优势，性能好**时效性微秒级**， **社区活跃度也比较高**，管理界面用起来十分方便， 如果你的**数据量没有那么大**， 中小型公司优先选择功能比较完备的 RabbitMQ。

## 1.2. RabbitMQ

### 1.2.1. RabbitMQ 的概念

RabbitMQ 是一个消息中间件：它接受并转发消息。你可以把它当做一个快递站点，当你要发送一个包裹时，你把你的包裹放到快递站，快递员最终会把你的快递送到收件人那里，按照这种逻辑 RabbitMQ 是一个快递站，一个快递员帮你传递快件。 RabbitMQ 与快递站的主要区别在于，它不处理快件而是接收，存储和转发消息数据。

### 1.2.2. 四大核心概念

生产者

​		产生数据发送消息的程序是生产者

交换机

​		交换机是 RabbitMQ 非常重要的一个部件，一方面它接收来自生产者的消息，另一方面它将消息推送到队列中。交换机必须确切知道如何处理它接收到的消息，是将这些消息推送到特定队列还是推送到多个队列，亦或者是把消息丢弃，这个得有交换机类型决定

队列

​		队列是 RabbitMQ 内部使用的一种数据结构， 尽管消息流经 RabbitMQ 和应用程序，但它们只能存储在队列中。队列仅受主机的内存和磁盘限制的约束，本质上是一个大的消息缓冲区。许多生产者可以将消息发送到一个队列，许多消费者可以尝试从一个队列接收数据。这就是我们使用队列的方式

消费者

​		消费与接收具有相似的含义。消费者大多时候是一个等待接收消息的程序。 请注意生产者，消费者和消息中间件很多时候并不在同一机器上。同一个应用程序既可以是生产者又是可以是消费者。

### 1.2.3. RabbitMQ 核心部分 

![image-20220121142733140](https://coderdu.com/image/image-20220121142733140.png)

### 1.2.4. 各个名词介绍  

![image-20220121142750943](https://coderdu.com/image/image-20220121142750943.png)

**Broker**：接收和分发消息的应用， RabbitMQ Server 就是 Message Broker

**Virtual host**：出于多租户和安全因素设计的，把 AMQP 的基本组件划分到一个虚拟的分组中，类似于网络中的 namespace 概念。当多个不同的用户使用同一个 RabbitMQ server 提供的服务时，可以划分出多个 vhost，每个用户在自己的 vhost 创建 exchange／ queue等

**Connection**： publisher／ consumer 和 broker 之间的 TCP 连接

**Channel**：如果每一次访问 RabbitMQ 都建立一个 Connection，在消息量大的时候建立 TCP Connection 的开销将是巨大的，效率也较低。 Channel 是在 connection 内部建立的逻辑连接，如果应用程序支持多线程，通常每个 thread 创建单独的 channel 进行通讯，AMQP method 包含了 channel id 帮助客户端和 message broker 识别 channel，所以 channel 之间是完全隔离的。 Channel 作为轻量级的**Connection 极大减少了操作系统建立 TCP connection 的开销**

**Exchange**： message 到达 broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到 queue 中去。常用的类型有：direct (point-to-point), topic (publish-subscribe) and fanout (multicast)

**Queue**： 消息最终被送到这里等待 consumer 取走

**Binding**： exchange 和 queue 之间的虚拟连接， binding 中可以包含 routing key， Binding 信息被保存到 exchange 中的查询表中，用于 message 的分发依据

### 1.2.5. 安装

1. 官网地址
    https://www.rabbitmq.com/download.html

2. 文件上传
    上传到/usr/local/software 目录下(如果没有 software 需要自己创建)  

    ![image-20220121144536518](https://coderdu.com/image/image-20220121144536518.png)

3. 安装文件

    由于RabbitMQ是erlang语言写的，我们需要先安装erlang语言环境

    ```bash
    rpm -ivh erlang-21.3-1.el7.x86_64.rpm
    ```

    安装socat网络工具

    ```bash
    yum install socat -y
    ```

    安装RabbitMQ

    ```bash
    rpm -ivh rabbitmq-server-3.8.8-1.el7.noarch.rpm
    ```

4. 启动服务

    添加开机启动 RabbitMQ 服务

    ```bash
    chkconfig rabbitmq-server on
    ```

    启动服务

    ```bash
    /sbin/service rabbitmq-server start
    ```

    查看服务状态

    ```bash
    /sbin/service rabbitmq-server status
    ```

    ![image-20220121145010590](https://coderdu.com/image/image-20220121145010590.png)

    停止服务(选择执行)

    ```bash
    /sbin/service rabbitmq-server stop
    ```

5. 开启web插件管理

    需要先停止服务

    ```bash
    /sbin/service rabbitmq-server stop
    ```

    开启web插件

    ```bash
    rabbitmq-plugins enable rabbitmq_management
    ```

    然后启动服务

    用默认账号密码(guest)访问地址 http://192.168.10.40:15672/出现权限问题  

    ![image-20220121145341381](https://coderdu.com/image/image-20220121145341381.png)

6. 添加一个新的用户

    创建账号

    ```bash
    rabbitmqctl add_user admin 123
    ```

    设置用户角色

    ```bash
    rabbitmqctl set_user_tags admin administrator
    ```

    查看当前用户

    ```bash
    rabbitmqctl list_users
    ```

7. 常用命令

    **虚拟主机**：

                  ```bash
                  # 创建虚拟主机：
                  rabbitmqctl add_vhost vhost_service
                  rabbitmqctl add_vhost vhost_client
                  
                  # 删除虚拟主机：
                  rabbitmqctl delete_vhost vhost_service
                  rabbitmqctl delete_vhost vhost_client
                  
                  # 查看虚拟主机信息：
                  rabbitmqctl list_vhosts
                  ```

    **用户**：

    ```bash
    # 创建用户密码：
    rabbitmqctl add_user root rabbitmq_root
    rabbitmqctl add_user client_publish rabbitmq_publish
    rabbitmqctl add_user client_subscribe rabbitmq_subscribe
    rabbitmqctl add_user service rabbitmq_service
    
    # 删除用户：
    rabbitmqctl delete_user root
    rabbitmqctl delete_user client_publish
    rabbitmqctl delete_user client_subscribe
    rabbitmqctl delete_user service
    
    #查看用户信息：
    rabbitmqctl list_users
    
    # 用户权限：
    rabbitmqctl set_user_tags root administrator
    rabbitmqctl set_user_tags service monitoring
    rabbitmqctl set_user_tags client_publish monitoring
    rabbitmqctl set_user_tags client_subscribe monitoring
    
    tags就是账号权限
    1、超级管理员(administrator)
    可登陆管理控制台，可查看所有的信息，并且可以对用户，策略(policy)进行操作。
    2、监控者(monitoring)
    可登陆管理控制台，同时可以查看rabbitmq节点的相关信息(进程数，内存使用情况，磁盘使用情况等)
    3、策略制定者(policymaker)
    可登陆管理控制台, 同时可以对policy进行管理。但无法查看节点的相关信息(上图红框标识的部分)。
    4、普通管理者(management)
    仅可登陆管理控制台，无法看到节点信息，也无法对策略进行管理。
    5、其他
    无法登陆管理控制台，通常就是普通的生产者和消费者。
    ```

    **设置用户访问虚拟机权限**：

    ​		授予用户可访问虚拟主机，在所有资源上都具备可配置，可写及可读的权限。

    ```bash
    # 设置权限：
    rabbitmqctl set_permissions -p vhost_service root ".*" ".*" ".*"
    rabbitmqctl set_permissions -p vhost_client root ".*" ".*" ".*"
    rabbitmqctl set_permissions -p vhost_service service ".*" ".*" ".*"
    
    rabbitmqctl set_permissions -p vhost_client client_publish ".*" ".*" ".*"
    rabbitmqctl set_permissions -p vhost_client client_subscribe ".*" ".*" ".*"
    
    # 清除权限：
    rabbitmqctl clear_permissions vhost_service -p service
    rabbitmqctl clear_permissions vhost_client -p client_publish
    rabbitmqctl clear_permissions vhost_client -p client_subscribe
    ```

8. 重置命令

    关闭应用的命令为

    ```bash
    rabbitmqctl stop_app
    ```

    清除的命令为

    ```bash
    rabbitmqctl reset
    ```

    重新启动命令为

    ```bash
    rabbitmqctl start_app
    ```
