---
title: 并发
date: 2022-2-21
categories:
 - JavaSE
tags:
 - JavaSE
---
为什么很重要？

并发编程可以充分利用计算机的资源，把计算机的性能发挥到最大，可以最大程度节约公司的成本，提高效率。

### 1、什么是高并发

并发 VS 并行的区别

> 并发 concurrency：多线程“同时”操作同一个资源，并不是真正的同时操作，而是交替操作，单核 CPU 的情况下，资源按时间段分配给多个线程。张三李四王五使用一口锅炒菜，交替

> 并行 parallelism：是真正的多个线程同时执行，多核 CPU，每个线程使用一个 CPU 资源来运行。张三李四王五使用三口锅炒菜，同时进行

并发编程描述的是一种使系统允许多个任务可以在重叠的时间段内执行的设计结构，不是指多个任务在同一时间段内执行，而是指系统具备处理多个任务在同一时间段内同时执行的能力。

高并发是指我们设计的程序，可以支持海量任务的执行在时间段上重叠的情况。

高并发的标准：

- QPS：每秒响应的 HTTP 请求数量，QPS 不是并发数。
- 吞吐量：单位时间内处理的请求数，由 QPS 和并发数来决定。
- 平均响应时间：系统对一个请求作出响应的评价时间。

QPS = 并发数 / 平均响应时间

- 并发用户数：同时承载正常使用系统的用户人数

互联网分布式架构设计，提高系统并发能力的方式：

- 垂直扩展
- 水平扩展

### 2、垂直扩展

提升单机处理能力

1、提升单机的硬件设备，增加 CPU 核数，升级网卡，硬盘扩容，升级内存。

2、提升单机的架构性能，使用 Cache 提高效率，使用异步请求来增加单服务吞吐量，NoSQL 提升数据库访问能力。

### 3、水平扩展

集群：一个厨师搞不定，多雇几个厨师一起炒菜，多个人干同一件事情。

分布式：给厨师雇两个助手，一个负责洗菜，一个负责切菜，厨师只负责炒菜，一件事情拆分成多个步骤，由不同的人去完成。

站点层扩展：Nginx 反向代理，一个 Tomcat 跑不动，那就 10 个 Tomcat 去跑。

服务层扩展：RPC 框架实现远程调用，Spring Boot/Spring Cloud，Dubbo，分布式架构，将业务逻辑拆分到不同的 RPC Client，各自完成对应的业务，如果某项业务并发量很大，增加新的 RPC Client，就能扩展服务层的性能，做到理论上的无限高并发。

数据层扩展：在数据量很大的情况下，将原来的一台数据库服务器，拆分成多台，以达到扩充系统性能的目的，`主从复制`，`读写分离`，`分表分库`。

### 2、JUC

JDK 提供的一个工具包，专门用来帮助开发者完成 Java 并发编程。

### 3、进程和线程

Java 默认的线程数 2 个

- mian 主线程
- GC 垃圾回收机制

Java 本身是无法开启线程的，Java 无法操作硬件，只能通过调用本地方法，C++ 编写的动态函数库。

![image-20220114200558061](https://coderdu.com/typoraImages//image-20220114200558061.png)

> Java 中实现多线程有几种方式？

1、继承 Thread 类

2、实现 Runnable 接口

3、实现 Callable 接口

Callable 和 Runnable 的区别在于 Runnable 的 run 方法**没有返回值**，Callable 的 call 方法**有返回值**。

```java
public class Test {
    public static void main(String[] args) {
        MyCallable myCallable = new MyCallable();
        FutureTask<String> futureTask = new FutureTask(myCallable);
        Thread thread = new Thread(futureTask);
        thread.start();
        try {
            String value = futureTask.get();
            System.out.println(value);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}

class MyCallable implements Callable<String>{

    @Override
    public String call() throws Exception {
        System.out.println("callable");
        return "hello";
    }
}
```

![image-20220114200619150](https://coderdu.com/typoraImages//image-20220114200619150.png)

### 4、sleep 和 wait

sleep 是让当前线程休眠，wait 是让访问当前对象的线程休眠。

sleep 不会释放锁，wait 会释放锁。

### 5、synchronized 锁定的是什么

1、synchronized 修饰非静态方法，锁定方法的调用者

2、synchronized 修饰静态方法，锁定的是类

3、synchronized 静态方法和实例方法同时存在，静态方法锁定的是类，实例方法锁定的是对象

### 6、Lock

JUC 提供的一种锁机制，功能和 synchronized 类似，是对 synchronized 的升级，它是一个接口。

![image-20220114200632710](https://coderdu.com/typoraImages//image-20220114200632710.png)

它的常用实现类是 ReentrantLock。

synchronized 是通过 JVM 实现锁机制，ReentrantLock 是通过 JDK 实现锁机制。

synchronized 是一个关键字，ReentrantLock 是一个类。

重入锁：可以给同一个资源添`加多把锁`。

synchronized 是线程执行完毕之后自动释放锁，ReentrantLock 需要手动解锁。

用 synchronized 实现卖票

```java
public class Test {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();
        new Thread(()->{
            for (int i = 0; i < 40; i++) {
                ticket.sale();
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 40; i++) {
                ticket.sale();
            }
        },"B").start();
    }
}

class Ticket{
    private Integer saleNum = 0;
    private Integer lastNum = 30;

    public synchronized void sale(){
        if(lastNum > 0){
            saleNum++;
            lastNum--;
            try {
                TimeUnit.MILLISECONDS.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"卖出了第"+saleNum+"张票，剩余"+lastNum+"张票");
        }
    }

}
```

用 Lock 完成卖票

```java
package com.du.demo;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Test2 {
    public static void main(String[] args) {
        Ticket2 ticket = new Ticket2();
        new Thread(()->{
            for (int i = 0; i < 40; i++) {
                ticket.sale();
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 40; i++) {
                ticket.sale();
            }
        },"B").start();
    }
}

class Ticket2{
    private Integer saleNum = 0;
    private Integer lastNum = 30;
    private Lock lock = new ReentrantLock();

    public void sale(){

        lock.lock();
        lock.lock();
        if(lastNum > 0){
            saleNum++;
            lastNum--;
            try {
                TimeUnit.MILLISECONDS.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"卖出了第"+saleNum+"张票，剩余"+lastNum+"张票");
        }
        lock.unlock();
        lock.unlock();
    }
}
```

> synchronized 和 lock 的区别

1、synchronized 自动上锁，自动释放锁，Lock 手动上锁，手动释放锁。

2、synchronized 无法判断是否获取到了锁，Lock 可以判断是否拿到了锁。

3、synchronized 拿不到锁就会一直等待，Lock 不一定会一直等待。

4、synchronized 是 Java 关键字，Lock 是接口。

5、synchronized 是非公平锁，Lock 可以设置是否为公平锁。

公平锁：很公平，排队，当锁没有被占用时，当前线程需要判断队列中是否有其他等待线程。

非公平锁：不公平，插队，当锁没有被占用时，当前线程可以直接占用，而不需要判断当前队列中是否有等待线程。

实际开发中推荐使用 Lock 的方式。

ReentrantLock 具备限时性的特点，可以判断某个线程在一定的时间段内能否获取到锁，使用 tryLock 方法，返回值是 boolean 类型，true 表示可以获取到锁，false 表示无法获取到锁。

```java
public class Test {
    public static void main(String[] args) {
        TimeLock timeLock = new TimeLock();
        new Thread(()->{
            timeLock.getLock();
        },"A").start();
        new Thread(()->{
            timeLock.getLock();
        },"B").start();
    }
}

class TimeLock{
    private ReentrantLock lock = new ReentrantLock();

    public void getLock(){
        try {
            if(lock.tryLock(3, TimeUnit.SECONDS)){
                System.out.println(Thread.currentThread().getName()+"拿到了锁");
                TimeUnit.SECONDS.sleep(5);
            }else{
                System.out.println(Thread.currentThread().getName()+"拿不到锁");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            if(lock.isHeldByCurrentThread()){
                lock.unlock();
            }
        }
    }

}
```

### 7、生产者消费者模式

#### 1、synchronized

```java
public class Test {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()->{
            for (int i = 0; i < 30; i++) {
                data.increment();
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 30; i++) {
                data.decrement();
            }
        },"B").start();
    }
}

class Data{
    private Integer num = 0;

    public synchronized void increment(){
        while(num!=0){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        num++;
        this.notify();
        System.out.println(Thread.currentThread().getName()+"生产了汉堡"+num);
    }

    public synchronized void decrement(){
        while(num == 0){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        num--;
        this.notify();
        System.out.println(Thread.currentThread().getName()+"消费了汉堡"+num);
    }
}
```

必须使用 while 判断，不能用 if，因为 if 会存在线程虚假唤醒的问题，虚假唤醒就是一些 wait 方法会在除了 notify 的其他情况被唤醒，不是真正的唤醒，使用 while 完成多重检测，避免这一问题。

#### 2、Lock

```java
public class Test {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()->{
            for (int i = 0; i < 30; i++) {
                data.increment();
            }
        },"A").start();
        new Thread(()->{
            for (int i = 0; i < 30; i++) {
                data.decrement();
            }
        },"B").start();
    }
}

class Data{
    private Integer num = 0;

    private Lock lock = new ReentrantLock();

    private Condition condition = lock.newCondition();

    public void increment(){
        lock.lock();
        while(num!=0){
            try {
                condition.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        num++;
        condition.signal();
        System.out.println(Thread.currentThread().getName()+"生产了汉堡"+num);
        lock.unlock();
    }

    public synchronized void decrement(){
        lock.lock();
        while(num == 0){
            try {
                condition.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        num--;
        condition.signal();
        System.out.println(Thread.currentThread().getName()+"消费了汉堡"+num);
        lock.unlock();
    }
}
```

**使用 Lock 锁，就不能通过 wait 和 notify 来暂停线程和唤醒线程**，而应该使用 Condition 的 `await`和 `signal`来暂停和唤醒线程。

### 8、ConcurrentModificationException

#### 1、并发访问异常

```java
public class Test {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
                try {
                    TimeUnit.MILLISECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                //写
                list.add("a");
                //读
                System.out.println(list);
            },String.valueOf(i)).start();
        }
    }
}
```

#### 2、如何解决？

##### 1、Vector

![image-20220114200952870](https://coderdu.com/typoraImages//image-20220114200952870.png)

##### 2、Collections.synchronizedList

##### 3、JUC：CopyOnWriteArrayList

```java
public class Test2 {
    public static void main(String[] args) {
        List<String> list = new CopyOnWriteArrayList<>();
        for (int i = 0; i < 10; i++) {
            new Thread((()->{
                try {
                    TimeUnit.MILLISECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                list.add("a");
                System.out.println(list);
            })).start();
        }
    }
}
```

CopyOnWrite 写时复制，当我们往一个容器添加元素的时候，不是直接给容器添加，而是先将当前容器复制一份，向新的容器中添加数据，添加完成之后，再将原容器的引用指向新的容器。

![image-20220114201025478](https://coderdu.com/typoraImages//image-20220114201025478.png)

##### 4、Set

```java
public class Test2 {
    public static void main(String[] args) {
        Set<String> set = new CopyOnWriteArraySet<>();
        for (int i = 0; i < 10; i++) {
            final int temp = i;
            new Thread((()->{
                try {
                    TimeUnit.MILLISECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                set.add(String.valueOf(temp)+"a");
                System.out.println(set);
            })).start();
        }
    }
}
```

##### 5、Map

```java
public class Test2 {
    public static void main(String[] args) {
        Map<String,String> map = new ConcurrentHashMap<>();
        for (int i = 0; i < 10; i++) {
            final int temp = i;
            new Thread((()->{
                try {
                    TimeUnit.MILLISECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                map.put(UUID.randomUUID().toString().substring(0,3),UUID.randomUUID().toString().substring(0,2));
                System.out.println(map);
            })).start();
        }
    }
}
```

### 9、JUC 工具类

#### 1、CountDownLatch：减法计数器

可以用来倒计时，当两个线程同时执行时，如果要确保一个线程优先执行，可以使用计数器，当计数器清零的时候，再让另一个线程执行。

```java
public class Test {
    public static void main(String[] args) {
        //创建一个 CountDownLatch
        CountDownLatch countDownLatch = new CountDownLatch(100);

        new Thread(()->{
            for (int i = 0; i < 100; i++) {
                System.out.println("+++++++++++++++Thread");
                countDownLatch.countDown();
            }
        }).start();

        try {
            countDownLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        for (int i = 0; i < 100; i++) {
            System.out.println("main-----------------");
        }
    }
}
```

coutDown()：计数器减一

await()：计数器停止，唤醒其他线程

new CountDownLatch(100)、coutDown()、await() 必须配合起来使用，创建对象的时候赋的值是多少，coutDown() 就必须执行多少次，否则计数器是没有清零的，计数器就不会停止，其他线程也无法唤醒，所以必须保证计数器清零，coutDown() 的调用次数必须大于构造函数的参数值。

#### 2、CyclicBarrier：加法计数器

```java
public class CyclicBarrierTest {
    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(100,()->{
            System.out.println("放行");
        });

        for (int i = 0; i < 100; i++) {
            final int temp = i;
            new Thread(()->{
                System.out.println("-->"+temp);
                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

await()：在其他线程中试图唤醒计数器线程，当其他线程的执行次数达到计数器的临界值时，则唤醒计数器线程，并且计数器是可以重复使用的，当计数器的线程执行完成一次之后，计数器自动清零，等待下一次执行。

new CyclicBarrier(30），for 执行 90 次，则计数器的任务会执行 3 次。

#### 3、Semaphore：计数信号量

实际开发中主要使用它来完成限流操作，限制可以访问某些资源的线程数量。

Semaphore 只有 3 个操作：

- 初始化
- 获取许可
- 释放

```java
public class SemaphoreTest {
    public static void main(String[] args) {
        //初始化
        Semaphore semaphore = new Semaphore(5);
        for (int i = 0; i < 15; i++) {
            new Thread(()->{
                //获得许可
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName()+"进店购物");
                    TimeUnit.SECONDS.sleep(5);
                    System.out.println(Thread.currentThread().getName()+"出店");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    //释放
                    semaphore.release();
                }

            },String.valueOf(i)).start();
        }
    }
}
```

每个线程在执行的时候，首先需要去获取信号量，只有获取到资源才可以执行，执行完毕之后需要释放资源，留给下一个线程。

### 10、读写锁

接口 ReadWriteLock，实现类是 ReentrantReadWriteLock，可以**多线程同时读，但是同一时间内只能有一个线程进行写入操作**。

读写锁也是为了实现线程同步，只不过粒度更细，可以分别给读和写的操作设置不同的锁。

```java
public class ReadWriteLockTest {
    public static void main(String[] args) {
        Cache cache = new Cache();
        for (int i = 0; i < 5; i++) {
            final int temp = i;
            new Thread(()->{

                cache.write(temp,String.valueOf(temp));

            }).start();
        }

        for (int i = 0; i < 5; i++) {
            final int temp = i;
            new Thread(()->{
                cache.read(temp);
            }).start();
        }
    }
}

class Cache{
    //使用hashmap，是因为每个只有一个线程进行写操作
    //如果有多个线程操作，需使用ConcurrentHashMap
    private Map<Integer,String> map = new HashMap<>();
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    /**
     * 写操作
     */
    public void write(Integer key,String value){
        readWriteLock.writeLock().lock();
        System.out.println(key+"开始写入");
        map.put(key,value);
        System.out.println(key+"写入完毕");
        readWriteLock.writeLock().unlock();
    }

    /**
     * 读操作
     */
    public void read(Integer key){
        readWriteLock.readLock().lock();
        System.out.println(key+"开始读取");
        map.get(key);
        System.out.println(key+"读取完毕");
        readWriteLock.readLock().unlock();
    }
}
```

**写入锁也叫独占锁，只能被一个线程占用，读取锁也叫共享锁，多个线程可以同时占用。**

### 11、线程池

预先创建好一定数量的线程对象，存入`缓冲池`中，需要用的时候直接从缓冲池中取出，用完之后不要销毁，还回到缓冲池中，为了提高资源的利用率。

优势：

- 提高线程的利用率
- 提高响应速度
- 便于统一管理线程对象
- 可以控制最大的并发数

1、线程池初始化的时候创建一定数量的线程对象。

2、如果缓冲池中没有空闲的线程对象，则新来的任务进入等待队列。

3、如果缓冲池中没有空闲的线程对象，等待队列也已经填满，可以申请再创建一定数量的新线程对象，直到到达线程池的最大值，这时候如果还有新的任务进来，只能选择拒绝。

无论哪种线程池，都是工具类 Executors 封装的，底层代码都一样，都是通过创建 ThreadPoolExecutor 对象来完成线程池的构建。

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.acc = (System.getSecurityManager() == null)
        ? null
        : AccessController.getContext();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

- corePoolSize：核心池大小，初始化的线程数量
- maximumPoolSize：线程池最大线程数，它决定了线程池容量的上限

corePoolSize 就是线程池的大小，maximumPoolSize 是一种补救措施，任务量突然增大的时候的一种补救措施。

- keepAliveTime：线程对象的存活时间
- unit：线程对象存活时间单位
- workQueue：等待队列
- threadFactory：线程工厂，用来创建线程对象
- handler：拒绝策略

### 12、ThreadPoolExecutor

池化技术 池化思想

优势：

- 提高线程的利用率
- 提高响应速度
- 便于统一管理线程对象
- 可控制最大并发数

线程池的具体设计思想

- 核心池的大小
- 线程池的最大容量
- 等待队列
- 拒绝策略

线程池启动的时候会按照核心池的数来创建初始化的线程对象 2 个。

开始分配任务，如果同时来了多个任务， 2 个线程对象都被占用了，第 3 个以及之后的任务进入等待队列，当前有线程完成任务恢复空闲状态的时候，等待队列中的任务获取线程对象。

如果等待队列也占满了，又有新的任务进来，需要去协调，让线程池再创建新的线程对象，但是线程池不可能无限去创建线程对象，一定会有一个最大上限，就是线程池的最大容量。

如果线程池已经达到了最大上限，并且等待队列也占满了，此时如果有新的任务进来，只能选择拒绝，并且需要根据拒绝策略来选择对应的方案。

![image-20220114201200424](https://coderdu.com/typoraImages//image-20220114201200424.png)

ThreadPoolExecutor

直接实例化 ThreadPoolExecutor ，实现定制化的线程池，而不推荐使用 Executors 提供的封装好的方法，因为这种方式代码不够灵活，无法实现定制化。

ThreadPoolExecutor 核心参数一共有 7 个

```
corePoolSize：核心池的大小
maximumPoolSize：线程池的最大容量
keepAliveTime：线程存活时间（在没有任务可执行的情况下），必须是线程池中的数量大于 corePoolSize，才会生效
TimeUnit：存活时间单位
BlockingQueue：等待队列，存储等待执行的任务
ThreadFactory：线程工厂，用来创建线程对象
RejectedExecutionHandler：拒绝策略
1、AbortPolicy：直接抛出异常
2、DiscardPolicy：放弃任务，不抛出异常
3、DiscardOldestPolicy：尝试与等待队列中最前面的任务去争夺，不抛出异常
4、CallerRunsPolicy：谁调用谁处理
1234567891011
```

单例 1

![image-20220114201217038](https://coderdu.com/typoraImages//image-20220114201217038.png)

固定 5

![image-20220114201229098](https://coderdu.com/typoraImages//image-20220114201229098.png)

缓存

![image-20220114201242673](https://coderdu.com/typoraImages//image-20220114201242673.png)

```java
public class Test {
    public static void main(String[] args) {
        ExecutorService executorService = null;
        try {
            /**
             * 自己写7大参数，完全定制化
             */
            executorService = new ThreadPoolExecutor(
                2,
                3,
                1L,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(2),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy()
            );

            for (int i = 0; i < 6; i++) {
                executorService.execute(()->{
                    try {
                        TimeUnit.MILLISECONDS.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName()+"===>办理业务");
                });
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            executorService.shutdown();
        }
    }
}

```

![image-20220114201300145](https://coderdu.com/typoraImages//image-20220114201300145.png)

new ThreadPoolExecutor.AbortPolicy()

![image-20220114201357327](https://coderdu.com/typoraImages//image-20220114201357327.png)

new ThreadPoolExecutor.CallersunsPolicy()

![image-20220114201429758](https://coderdu.com/typoraImages//image-20220114201429758.png)

new ThreadPoolExecutor.DiscardOldestPolicy()

new ThreadPoolExecutor.DiscardPolicy()

不会抛出异常

线程池 3 大考点：

1、Executors 工具类的 3 种实现

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();
ExecutorService executorService = Executors.newFixedThreadPool(5);
ExecutorService executorService = Executors.newCachedThreadPool();
```

2、7 个参数

```
corePoolSize：核心池的大小
maximumPoolSize：线程池的最大容量
keepAliveTime：线程存活时间（在没有任务可执行的情况下），必须是线程池中的数量大于 corePoolSize，才会生效
TimeUnit：存活时间单位
BlockingQueue：等待队列，存储等待执行的任务
ThreadFactory：线程工厂，用来创建线程对象
RejectedExecutionHandler：拒绝策略
```

3、4 种拒绝策略

```
1、AbortPolicy：直接抛出异常
2、DiscardPolicy：放弃任务，不抛出异常
3、DiscardOldestPolicy：尝试与等待队列中最前面的任务去争夺，不抛出异常
4、CallerRunsPolicy：谁调用谁处
```

### 13、ForkJoin 框架

ForkJoin 是 JDK 1.7 后发布的多线程并发处理框架，功能上和 JUC 类似，JUC 更多时候是使用单个类完成操作，ForkJoin 使用多个类同时完成某项工作，处理上比 JUC 更加丰富，实际开发中使用的场景并不是很多，互联网公司真正有高并发需求的情况才会使用，**面试时候会加分**

本质上是对线程池的一种的补充，对线程池功能的一种扩展，基于线程池的，它的核心思想就是将一个大型的任务拆分成很多个小任务，分别执行，最终将小任务的结果进行汇总，生成最终的结果。

![image-20220114201507075](https://coderdu.com/typoraImages//image-20220114201507075.png)

本质就是把一个线程的任务拆分成多个小任务，然后由多个线程并发执行，最终将结果进行汇总。

比如 A B 两个线程同时还执行，A 的任务比较多，B 的任务相对较少，B 先执行完毕，这时候 B 去帮助 A 完成任务（将 A 的一部分任务拿过来替 A 执行，执行完毕之后再把结果进行汇总），从而提高效率。

**工作窃取**
![image-20220114201558447](https://coderdu.com/typoraImages//image-20220114201558447.png)

ForkJoin 框架，核心是两个类

- ForkJoinTask （描述任务）
- ForkJoinPool（线程池）提供多线程并发工作窃取

使用 ForkJoinTask 最重要的就是要搞清楚如何拆分任务，这里用的是**递归**思想。

1、需要创建一个 ForkJoinTask 任务，ForkJoinTask 是一个抽象类，不能直接创建 ForkJoinTask 的实例化对象，开发者需要自定义一个类，继承 ForkJoinTask 的子类 RecursiveTask ，Recursive 就是递归的意思，该类就提供了实现递归的功能。

![image-20220114201628228](https://coderdu.com/typoraImages//image-20220114201628228.png)

```java
/**
 * 10亿求和
 */
public class ForkJoinDemo extends RecursiveTask<Long> {

    private Long start;
    private Long end;
    private Long temp = 100_0000L;

    public ForkJoinDemo(Long start, Long end) {
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        if((end-start)<temp){
            Long sum = 0L;
            for (Long i = start; i <= end; i++) {
                sum += i;
            }
            return sum;
        }else{
            Long avg = (start+end)/2;
            ForkJoinDemo task1 = new ForkJoinDemo(start,avg);
            task1.fork();
            ForkJoinDemo task2 = new ForkJoinDemo(avg,end);
            task2.fork();
            return task1.join()+task2.join();
        }
    }
}
```

```java
public class Test {
    public static void main(String[] args) {
        Long startTime = System.currentTimeMillis();
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask<Long> task = new ForkJoinDemo(0L,10_0000_0000L);
        forkJoinPool.execute(task);
        Long sum = 0L;
        try {
            sum = task.get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        Long endTime = System.currentTimeMillis();
        System.out.println(sum+"，供耗时"+(endTime-startTime));
    }
}
```

### 14、Volatile 关键字

![image-20220114201657139](https://coderdu.com/typoraImages//image-20220114201657139.png)

Volatile 是 JVM 提供的轻量级同步机制，**可见性**，主内存对象线程可见。

**一个线程执行完任务之后还，会把变量存回到主内存中，并且从主内存中读取当前最新的值，如果是一个空的任务，则不会重新读取主内存中的值**

```java
public class Test {
    private static int num = 0;

    public static void main(String[] args) {
        /**
         * 循环
         */
        new Thread(()->{
            while(num == 0){
                System.out.println("---Thread---");
            }
        }).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        num = 1;
        System.out.println(num);
    }
}
```

```java
package com.du.demo2;

import java.util.concurrent.TimeUnit;

public class Test {
    private static volatile int num = 0;

    public static void main(String[] args) {
        /**
         * 循环
         */
        new Thread(()->{
            while(num == 0){
                
            }
        }).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        num = 1;
        System.out.println(num);
    }
}
```

### 15、线程池 workQueue

一个阻塞队列，用来存储等待执行的任务，常用的阻塞队列有以下几种：

- ArrayBlockingQueue：基于数组的先进先出队列，创建时必须指定大小。
- LinkedBlockingQueue：基于链表的先进先出队列，创建时可以不指定大小，默认值时 Integer.MAX_VALUE。
- SynchronousQueue：它不会保持提交的任务，而是直接新建一个线程来执行新来的任务。
- PriorityBlockingQueue：具有优先级的阻塞队列。
