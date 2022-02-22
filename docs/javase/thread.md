---
title: 多线程
date: 2022-2-21
categories:
 - JavaSE
tags:
 - JavaSE
---
### 1、多线程

多线程是提升程序性能非常重要的一种方式，必须掌握的技术。

使用多线程可以让程序充分利用 CPU 资源。

> 优点：

- 系统资源得到更合理的利用。
- 程序设计更加简洁。
- 程序响应更快，运行效率更高。

> 缺点:

- 需要更多的内存空间来支持多线程。
- 多线程并发访问的情况可能会影响数据的准确性。
- 数据被多线程共享，可能会出现死锁的情况。

### 2、进程和线程

> 什么是进程：进程就是计算机正在运行的一个独立的应用程序。

进程是一个动态的概念，当我们启动某个应用的时候，进程就产生了，当我们关闭该应用的时候，进程就结束了，进程的生命周期就是我们在使用该软件的整个过程。

> 什么是线程？
> 线程是组成进程的基本单位，可以完成特定的功能，一个进程是由一个或多个线程组成的。
> 应用程序是静态的，进程和线程是动态的，有创建有销毁，存在是暂时的，不是永久的。

进程和线程的区别：

**进程在运行时拥有独立的内存空间，即每个进程所占用的内存空间都是独立的，互不干扰。**

**线程是共享内存空间的，但是每个线程的执行都是相互独立的，单独的线程是无法执行的，由进程来控制多个线程的执行。**

### 3、多线程

多线程是指在一个进程中，多个线程同时执行，这里说的同时执行并不是真正意义的同时执行。

系统会为每个线程分配 CPU 资源，在某个具体的时间段内 CPU 资源会被一个线程占用，在不同的时间段内由不同的线程来占用 CPU 资源，**所以多个线程还是在交替执行，只不过因为 CPU 运行速度太快，我们感觉是在同时执行。**

![image-20220114195522951](https://coderdu.com/image/image-20220114195522951.png)

整个程序如果是一条回路，说明程序只有一个线程。

![image-20220114195535189](https://coderdu.com/image/image-20220114195535189.png)

程序有两条回路，同时向下执行，这种情况就是多线程，两个线程同时在执行。

### 4、Java 中线程的使用

Java 中使用线程有两种方式：

- 继承 Thread 类
- 实现 Runnable 接口

> Java 写程序三部分组成：

1、JDK 系统类库

JRE：Java Runtime Enviroment（Java 运行环境），仅供运行程序的。

JDK：Java Development Kit（Java 开发工具包），如果需要进行程序开发，必须安装 JDK。

String、Scanner、包装类。。。

java.lang.Thread

javax.servlet.Servlet

2、第三方类库

非 Java 官方的组织提供的一些成熟好用的工具，C3P0 数据库连接池、Spring 框架、DBUtils、Dom4J…

3、开发者自定义的代码

根据具体的业务需求编写的业务代码。

### 5、Java 中线程的使用

- 继承 Thread 类

1、创建自定义类并继承 Thread 类。

2、重写 Thread 类中的 run 方法，并编写该线程的业务逻辑代码。

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        // TODO Auto-generated method stub
        //定义业务逻辑
        for(int i = 0;i<10;i++) {
            System.out.println("-------------MyThread");
        }
    }
}
```

3、使用

```java
package com.du.test;
 
public class Test {
     public static void main(String[] args) {
         //开启两个子线程
         MyThread thread1 = new MyThread();
         MyThread2 thread2 = new MyThread2();
         thread1.start();
         thread2.start();
     }
}
```

注意：不能通过 run 方法来调用线程的任务，因为 run 方法调用相当于普通对象的执行，并不会去抢占 CPU 资源。

只有通过`start`方法才能开启线程，进而去抢占 CPU 资源，当某个线程抢占到 CPU 资源后，会自动调用 run 方法。

- 实现 Runnable 接口

1、创建自定义类并实现 Runnable 接口。
2、实现 run 方法，编写该线程的业务逻辑代码。

```java
public class MyRunnable implements Runnable {

    @Override
    public void run() {
        // TODO Auto-generated method stub
        for(int i=0;i<1000;i++) {
            System.out.println("========MyRunnable=======");
        }
    }
}
```

3、使用。

```java
MyRunnable runnable = new MyRunnable();
Thread thread = new Thread(runnable);
thread.start();
MyRunnable2 runnable2 = new MyRunnable2();
Thread thread2 = new Thread(runnable2);
thread2.start();
```

线程和任务：

线程是去抢占 CPU 资源的，任务是具体执行业务逻辑的，线程内部会包含一个任务，线程启动(start)，当抢占到资源之后，任务就开始执行(run)。

两种方式的区别：

1、MyThread，继承 Thread 类的方式，直接在类中重写 run 方法，使用的时候，直接实例化 MyThread，start 即可，因为 Thread 内部存在 Runnable。

2、MyRunnbale，实现 Runnable 接口的方法，在实现类中重写 run 方法，使用的时候，需要先创建 Thread 对象，并将 MyRunnable 注入到 Thread 中，Thread.start。

实际开发中推荐使用第二种方式。

### 6、线程的状态

线程共有 5 种状态，在特定的情况下，线程可以在不同的状态之间切换，5 种状态如下所示。

- 创建状态：实例化一个新的线程对象，还未启动。
- 就绪状态：创建好的线程对象调用 start 方法完成启动，进入线程池等待抢占 CPU 资源。
- 运行状态：线程对象获取了 CPU 资源，在一定的时间内执行任务。
- 阻塞状态：正在运行的线程暂停执行任务，释放所占用的 CPU 资源，**并在解除阻塞状态之后也不能直接回到运行状态，而是重新回到就绪状态，等待获取 CPU 资源。**
- 终止状态：线程运行完毕或因为异常导致该线程终止运行。

线程状态之间的转换图。

![image-20220114195638928](https://coderdu.com/image/image-20220114195638928.png)

### 7、Java 多线程的实现

- 继承 Thread
- 实现 Runnable

### 8、线程调度

#### 8.1、线程休眠

让当前线程暂停执行，从运行状态进入阻塞状态，将 CPU 资源让给其他线程的调度方式，通过 sleep() 来实现。

sleep(long millis)，调用时需要传入休眠时间，单位为豪秒。

```java
public class MyThread extends Thread{
    @Override
    public void run() {
        // TODO Auto-generated method stub
        for(int i=0;i<10;i++) {
            if(i == 5) {
                try {
                    sleep(5000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            System.out.println(i+"---------MyThread");
        }
    }
}
```

也可以在类的外部调用 sleep 方法。

```java
MyThread2 thread = new MyThread2();
try {
    thread.sleep(5000);
} catch (InterruptedException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
thread.start();
```

**在外部调用需要注意，休眠一定要放在启动之前。？？？**

如何让主线程休眠？直接通过静态方式调用 sleep 方法。

```java
public class Test2 {
    public static void main(String[] args) {
        for(int i=0;i<10;i++) {
            if(i == 5) {
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            System.out.println(i+"+++++Test2+++++");
        }
    }
}
```

```java
public static native void sleep(long millis) throws InterruptedException;
```

sleep 是静态本地方法，可以通过类调用，也可以通过对象调用，方法定义抛出 InterruptedException，InterruptedException 继承 Exception，外部调用时必须手动处理异常。

#### 8.2、线程合并

合并是指将指定的某个线程加入到当前线程中，合并为一个线程，由两个线程交替执行变成一个线程中的两个自线程顺序执行。

通过调用 join 方法来实现合并，具体如何合并？

线程甲和线程乙，线程甲执行到某个时间点的时候调用线程乙的 join方法，则表示从当前时间点开始 CPU 资源被线程乙独占，线程甲进入阻塞状态，直到线程乙执行完毕，线程甲进入就绪状态，等待获取 CPU 资源进入运行状态。

join 方法重载，join() 表示乙线程执行完毕之后才能执行其他线程，join(long millis) 表示乙线程执行 millis 毫秒之后，无论是否执行完毕，其他线程都可以和它争夺 CPU 资源。

```java
public class JoinRunnable implements Runnable {

    @Override
    public void run() {
        // TODO Auto-generated method stub
        for(int i=0;i<200;i++) {
            System.out.println(i+"------JoinRunnable");
        }
    }
}
```

```java
public class JoinTest {
    public static void main(String[] args) {
        /**
		 * 两个线程，主线程、join线程
		 * 主线程的逻辑：当i==10，join线程合并到主线程中
		 */
        JoinRunnable joinRunnable = new JoinRunnable();
        Thread thread = new Thread(joinRunnable);
        thread.start();
        for(int i=0;i<100;i++) {
            if(i == 10) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            System.out.println(i+"main+++++++++");
        }
    }
}
```

```java
public class JoinRunnable2 implements Runnable {

	@Override
	public void run() {
		// TODO Auto-generated method stub
		for(int i=0;i<20;i++) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println(i+"--------JoinRunnable");
		}
	}

}
```

```java
public class Test2 {
    public static void main(String[] args) {
        for(int i=0;i<10;i++) {
            if(i == 5) {
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            System.out.println(i+"+++++Test2+++++");
        }
    }
}
```

#### 8.3、线程礼让

线程礼让是指在某个特定的时间点，让线程暂停抢占 CPU 资源的行为，运行状态/就绪状态—》阻塞状态，将 CPU 资源让给其他线程来使用。

假如线程甲和线程乙在交替执行，某个时间点线程甲做出了礼让，所以在这个时间节点线程乙拥有了 CPU 资源，执行业务逻辑，但不代表线程甲一直暂停执行。

线程甲只是在特定的时间节点礼让，过了时间节点，线程甲再次进入就绪状态，和线程乙争夺 CPU 资源。

通过 yield 方法实现。

```java
public class YieldThread1 extends Thread {
	@Override
	public void run() {
		// TODO Auto-generated method stub
		for(int i = 0; i < 10;i++) {
			if(i == 5) {
				yield();
			}
			System.out.println(Thread.currentThread().getName()+"-----"+i);
		}
	}
}
```

```java
public class YieldThread2 extends Thread {
	@Override
	public void run() {
		// TODO Auto-generated method stub
		for(int i=0;i<10;i++) {
			System.out.println(Thread.currentThread().getName()+"======"+i);
		}
	}
}
```

```java
package com.du.yield;

public class Test {
	public static void main(String[] args) {
		YieldThread1 thread = new YieldThread1();
		thread.setName("线程1");
		YieldThread2 thread2 = new YieldThread2();
		thread2.setName("线程2");
		thread.start();
		thread2.start();
	}
}
```

#### 8.4、线程中断

有很多种情况会造成线程停止运行：

线程执行完毕自动停止

线程执行过程中遇到错误抛出异常并停止

线程执行过程中根据需求手动停止

Java 中实现线程中断有如下几个常用方法：

- public void stop()
- public void interrupt()
- public boolean isInterrupted()

> stop 方法在新版本的 JDK 已经不推荐使用，重点关注后两个方法。
>
> interrupt 是一个实例方法，当一个线程对象调用该方法时，表示中断当前线程对象。
>
> 每个线程对象都是通过一个标志位来判断当前是否为中断状态。

isInterrupted函数就是用来获取当前线程对象的标志位：

1、true 表示清除了标志位，当前线程已经中断。

2、false 表示没有清除标志位，当前对象没有中断。

当一个线程对象处于不同的状态时，中断机制也是不同的。

创建状态：实例化线程对象，不启动。

```java
public class Test {
	public static void main(String[] args) {
		Thread thread = new Thread();
		System.out.println(thread.getState());
		thread.interrupt();
		System.out.println(thread.isInterrupted());
	}
}
```

![image-20220114195852674](https://coderdu.com/image/image-20220114195852674.png)

NEW 表示当前线程对象为创建状态，false 表示当前线程并未中断，因为当前线程没有启动，不存在中断，不需要清除标志位。

> 匿名内部类

```java
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        // TODO Auto-generated method stub
        for(int i = 0; i < 10;i++) {
            System.out.println(i+"---main");
        }
    }
});
thread.start();
```

```java
public class Test2 {
	public static void main(String[] args) {
//		MyRunnable runnable = new MyRunnable();
//		Thread thread = new Thread(runnable);
//		thread.start();
		Thread thread = new Thread(new Runnable() {
			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				for(int i = 0; i < 10;i++) {
					System.out.println(i+"---main");
				}
			}
		});
		thread.start();
		System.out.println(thread.getState());
		thread.interrupt();
		System.out.println(thread.isInterrupted());
		System.out.println(thread.getState());
	}
}
```

### 9、线程同步（synchronized）

Java 中允许多线程并行访问，同一时间段内多个线程同时完成各自的操作。

多个线程同时操作**同一个共享数据**时，可能会导致数据不准确的问题。

使用线程同步可以解决上述问题。

可以通过 synchronized 关键字修饰方法实现线程同步，每个Java 对象都有一个`内置锁`，内置锁会保护使用 synchronized 关键字修饰的方法，要调用该方法就必须先获得锁，否则就处于阻塞状态。

> 非线程同步

```java
public class Account implements Runnable {

    private static int num;

    @Override
    public void run() {
        // TODO Auto-generated method stub
        //1.num++操作
        num++;
        //2.休眠1毫秒
        try {
            Thread.currentThread().sleep(1000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //3.打印输出
        System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访问");
    }

}
```

> 线程同步

```java
public class Account implements Runnable {

    private static int num;

    @Override
    public synchronized void run() {
        // TODO Auto-generated method stub
        //1.num++操作
        num++;
        //2.休眠1毫秒
        try {
            Thread.currentThread().sleep(1000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //3.打印输出
        System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访问");
    }

}
```

```java
public class Test {
     public static void main(String[] args) {
         Account account = new Account();
         Thread t1 = new Thread(account,"张三");
         Thread t2 = new Thread(account,"李四");
         t1.start();
         t2.start();
     }
}
```

synchronized 关键字可以修饰实例方法，也可以修饰静态方法，两者在使用的时候是有区别的。

```java
public class SynchronizedTest {

    public static void main(String[] args) {
        for(int i = 0; i < 5;i++) {
            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    SynchronizedTest.test();
                }
            });
            thread.start();
        }
    }

    /**
      * 先输出start...
      * 间隔1s
      * 再输出end...
      * 输出start...
      * ...
      */
    public synchronized static void test() {
        //1.输出start
        System.out.println("start......");
        //2.休眠
        try {
            Thread.currentThread().sleep(1000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //3.输出end
        System.out.println("end......");
    }
}
```

synchronized 修饰非静态方法

```java
package com.du.test;

public class SynchronizedTest2 {
    public static void main(String[] args) {
        for(int i=0;i<5;i++) {
            Thread thread = new Thread(new Runnable() {

                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    SynchronizedTest2 synchronizedTest2 = new SynchronizedTest2();
                    synchronizedTest2.test();
                }
            });
            thread.start();
        }
    }

    public synchronized void test() {
        System.out.println("start......");
        try {
            Thread.currentThread().sleep(1000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("end......");
    }
}
```

给实例方法（非静态方法）添加 synchronized 关键字并不能实现线程同步。

线程同步的本质是锁定多个线程所共享的资源，synchronized 还可以修饰代码块，会为代码块加上`内置锁`，从而实现同步。

```java
public class SynchronizedTest3 {

    public static void main(String[] args) {
        for(int i=0;i<5;i++) {
            Thread thread = new Thread(new Runnable() {

                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    SynchronizedTest3.test();
                }
            });
            thread.start();
        }
    }

    public static void test() {
        synchronized (SynchronizedTest3.class) {
            System.out.println("start...");
            try {
                Thread.currentThread().sleep(1000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            System.out.println("end...");
        }
    }
}
```

**如何判断线程同步或是不同步？**

找到关键点：锁定的资源在内存中是一份还是多份？一份大家需要排队，线程同步，多份（一人一份），线程不同步。

**无论是锁定方法还是锁定对象，锁定类，只需要分析这个方法、对象、类在内存中有几份即可。**

> 对象一般都是多份
> 类一定是一份
> 方法就看是静态方法还是非静态方法，静态方法一定是一份，非静态方法一般是多份

### 10、线程安全的单例模式

单例模式是一种常见的软件设计模式，核心思想是**一个类只有一个实例对象**。

JVM：栈内存、堆内存

单线程模式下的单例模式

```java
package com.du.test;

public class SingletonDemo {

    private static SingletonDemo singletonDemo;

    private SingletonDemo() {
        System.out.println("创建了SingletonDemo...");
    }

    public static SingletonDemo getInstance() {
        if(singletonDemo == null) {
            singletonDemo = new SingletonDemo();
        }
        return singletonDemo;
    }
}
```

多线程模式下的单例模式

```java
package com.du.test;

public class SingletonDemo {

    private static SingletonDemo singletonDemo;

    private SingletonDemo() {
        System.out.println("创建了SingletonDemo...");
    }

    public synchronized static SingletonDemo getInstance() {
        if(singletonDemo == null) {
            singletonDemo = new SingletonDemo();
        }
        return singletonDemo;
    }

}
```

**双重检测**，synchronized 修饰代码块。
1、线程同步是为了实现线程安全，如果只创建一个对象，那么线程就是安全的。
2、如果 synchronized 锁定的是多个线程共享的数据（同一个对象），那么线程就是安全的。

```java
package com.du.test;

public class SingletonDemo {

    private volatile static SingletonDemo singletonDemo;

    private SingletonDemo() {
        System.out.println("创建了SingletonDemo...");
    }

    public static SingletonDemo getInstance() {
        if(singletonDemo == null) {
            synchronized (SingletonDemo.class) {
                if(singletonDemo == null) {
                    singletonDemo = new SingletonDemo();
                }
            }
        }
        return singletonDemo;
    }

}
```

volatile 的作用时候可以使内存中的数据对象线程可见。

主内存对线程是不可见的，添加 volatile 关键字之后，主内存对线程可见。

### 11、线程同步

并发、并行

使用并发编程的目的？为了充分利用计算机的资源，提高性能，企业以盈利为目的。

并发：多个线程访问同一个共享资源，前提是计算机是单核 CPU，多个线程不是同时在访问，而是交替进行，只是因为 CPU 运行速度太快，看起来是同时在运行。

并行：多核 CPU，多个线程是真正的同时在运行，各自占用不同的 CPU，相互之间没有影响，也不会争夺资源。

Java 默认线程有两个，main（主线程），GC（垃圾回收机制）

synchronized 关键字实现线程同步，让在访问同一个资源的多个线程排队去完成业务，避免出现数据错乱的情况。

### 12、死锁 DeadLock

前提：一个线程完成业务需要同时访问两个资源。

死锁：多个线程同时在完成业务，出现争抢资源的情况。

资源类

```java
public class DeadLockRunnable implements Runnable {
	//编号
	public int num;
	//资源
	private static Chopsticks chopsticks1 = new Chopsticks();
	private static Chopsticks chopsticks2 = new Chopsticks();
	
	/**
	 * num = 1 拿到 chopsticks1，等待 chopsticks2
	 * num = 2 拿到 chopsticks2，等待 chopsticks1
	 */
	@Override
	public void run() {
		// TODO Auto-generated method stub
		if(num == 1) {
			System.out.println(Thread.currentThread().getName()+"拿到了chopsticks1，等待获取chopsticks2");
			synchronized (chopsticks1) {
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				synchronized (chopsticks2) {
					System.out.println(Thread.currentThread().getName()+"用餐完毕！");
				}
			}
		}
		if(num == 2) {
			System.out.println(Thread.currentThread().getName()+"拿到了chopsticks2，等待获取chopsticks1");
			synchronized (chopsticks2) {
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				synchronized (chopsticks1) {
					System.out.println(Thread.currentThread().getName()+"用餐完毕！");
				}
			}
		}
	}

}
```

```java
public class DeadLockTest {
    public static void main(String[] args) {
        DeadLockRunnable deadLockRunnable1 = new DeadLockRunnable();
        deadLockRunnable1.num = 1;
        DeadLockRunnable deadLockRunnable2 = new DeadLockRunnable();
        deadLockRunnable2.num = 2;
        new Thread(deadLockRunnable1,"张三").start();
        new Thread(deadLockRunnable2,"李四").start();
    }
}
```

### 13、如何破解死锁

不要让多线程并发访问

```java
public class DeadLockTest {
    public static void main(String[] args) {
        DeadLockRunnable deadLockRunnable1 = new DeadLockRunnable();
        deadLockRunnable1.num = 1;
        DeadLockRunnable deadLockRunnable2 = new DeadLockRunnable();
        deadLockRunnable2.num = 2;
        new Thread(deadLockRunnable1,"张三").start();
        try {
            //确保deadLockRunnable1已经执行完成
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        new Thread(deadLockRunnable2,"李四").start();
    }
}
```

### 14、lambda 表达式

```java
public class Test3 {
    public static void main(String[] args) {
        //lambda表达式
        new Thread(()->{
            for(int i=0;i<100;i++) {
                System.out.println("+++++++++++Runnable");
            }
        }) .start();
    }
}
```

```java
package com.du.demo2;

public class Test3 {
  public static void main(String[] args) {
    new Thread(()->{for(int i=0;i<100;i++) System.out.println("+++++++Runnable");}).start();
    new Thread(()->{for(int i=0;i<100;i++) System.out.println("----Runnable");}).start();
    new Thread(()->{for(int i=0;i<100;i++) System.out.println("++++=====++Runnable");}).start();
  }
}
```

### 15、Lock

java.util.concurrent（JUC）

Lock 是一个接口，用来实现线程同步的，功能与 synchronized 一样。

Lock 使用频率最高的实现类是 ReentrantLock（重入锁），可以重复上锁。

```java
public class Test2 {
    public static void main(String[] args) {
        Account account = new Account();
        new Thread(account,"A").start();
        new Thread(account,"B").start();
    }
}

class Account implements Runnable{
    private static int num;
    private Lock lock = new ReentrantLock();

    @Override
    public void run() {
        // TODO Auto-generated method stub
        lock.lock();
        num++;
        System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访客");
        lock.unlock();
    }
}
```

实现资源和 Runnable 接口的解耦合。

```java
public class Test2 {
    public static void main(String[] args) {
        Account account = new Account();
        new Thread(()->{
            account.count();
        },"A").start(); 
        new Thread(()->{
            account.count();
        },"B").start(); 
    }
}

class Account {
    private int num;
    private Lock lock = new ReentrantLock();

    public void count() {
        lock.lock();
        num++;
        System.out.println(Thread.currentThread().getName()+"是第"+num+"位访客");
        lock.unlock();
    }

}
```

### 16、JUC

java.util.concurrent

Java 并发编程工具包，Java 官方提供的一套专门用来处理并发编程的工具集合（接口+类）

并发：单核 CPU，多个线程“同时”运行，实际是交替执行，只不过速度太快，看起来是同时执行。

```
两个厨师一口锅
```

并行：多核 CPU，真正的多个线程同时运行。

```
两个厨师两口锅
```

重入锁是 JUC 使用频率非常高的一个类 ReentrantLock

ReentrantLock 就是对 synchronized 的升级，目的也是为了实现线程同步。

- ReentrantLock 是一个类，synchronized 是一个关键字。
- ReentrantLock 是 JDK 实现，synchronized 是 JVM 实现。
- synchronized 可以自动释放锁，ReentrantLock 需要手动释放。

ReentrantLock 是 Lock 接口的实现类。

公平锁和非公平锁的区别

公平锁：线程同步时，多个线程排队，依次执行

非公平锁：线程同步时，可以插队

线程的实现有两种方式

- 继承 Thread
- 实现 Runnable

实现 Runnable 的耦合度更低

![image-20220114200212174](https://coderdu.com/image/image-20220114200212174.png)

```java
public class Test {
	public static void main(String[] args) {
		Account account = new Account();
		new Thread(()->{
			account.count();
		},"A") .start();
		new Thread(()->{
			account.count();
		},"B") .start();
	}
}

/**
 * 将资源和 Runnable 进行解耦合
 */
class Account {
	private static int num;
	public void count() {
		num++;
		try {
			TimeUnit.MILLISECONDS.sleep(1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访客");
	}
}
```

```java
public class Test2 {
    public static void main(String[] args) {
        Account2 account = new Account2();
        new Thread(account,"A").start();
        new Thread(account,"B").start();
    }
}

class Account2 implements Runnable{

    private static int num;

    @Override
    public void run() {
        // TODO Auto-generated method stub
        num++;
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访客");
    }

}
```

![image-20220114200302960](https://coderdu.com/image/image-20220114200302960.png)

### 17、Tips

```java
class Account{
    private static Integer num = 0;
    private static Integer id = 0;
    public void count() {
        synchronized (num) {
            num++;
            try {
                TimeUnit.MILLISECONDS.sleep(1000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访客");
        }	
    }
}
```

如果锁定 num 不能同步，锁定 id 可以同步，原因是什么？

**synchronized 必须锁定唯一的元素才可以实现同步**

num 的值每次都在变，所以 num 所指向的引用一直在变，所以不是唯一的元素，肯定无法实现同步。

id 的值永远不变，所以是唯一的元素，可以实现同步。

### 18、中断

```java
public class Test3 {
    public static void main(String[] args) {
        Account3 account = new Account3();
        new Thread(()->{
            account.count();
        },"A").start();
        new Thread(()->{
            account.count();
        },"B").start();
    }
}

class Account3{
    private static int num;
    private ReentrantLock reentrantLock = new ReentrantLock();

    public void count() {
        //上锁
        reentrantLock.lock();
        reentrantLock.lock();
        num++;
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName()+"是当前的第"+num+"位访客");
        //解锁
        reentrantLock.unlock();
        reentrantLock.unlock();
    }
}
```

- Lock 上锁和解锁都需要开发者手动完成。
- 可以重复上锁，上几把锁就需要解几把锁。

ReentrantLock 除了可以重入之外，还有一个可以中断的特点，可中断是指某个线程在等待获取锁的过程中可以主动过终止线程。

```java
public class Test5 {
    public static void main(String[] args) {
        StopLock stopLock = new StopLock();
        Thread t1 = new Thread(()->{
            stopLock.service();
        },"A");
        Thread t2 =new Thread(()->{
            stopLock.service();
        },"B");
        t1.start();
        t2.start();
        try {
            TimeUnit.SECONDS.sleep(1);
            t2.interrupt();
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}

class StopLock{

    private ReentrantLock reentrantLock = new ReentrantLock();

    public void service() {

        try {
            reentrantLock.lockInterruptibly();

            System.out.println(Thread.currentThread().getName()+"get lock");
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

        } catch (InterruptedException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        } finally {
            reentrantLock.unlock();
        }

    }
}
```

### 19、重入锁

ReentrantLock 限时性：判断某个线程**在一定的时间内**能否获取锁，通过 tryLock 方法来实现

tryLock(long time,TimeUnit unit)

time 指时间数值

unit 时间单位

```java
public class Test {
    public static void main(String[] args) {
        TimeLock timeLock = new TimeLock();
        /**
         * A 拿到锁，执行业务代码，休眠 5 秒钟
         * B 尝试拿锁，需要在 3 秒钟之内拿到锁
         */
        new Thread(()->{
            timeLock.lock();
        },"A").start();
        new Thread(()->{
            timeLock.lock();
        },"B").start();
    }
}

class TimeLock{
    private ReentrantLock reentrantLock = new ReentrantLock();
    public void lock(){
        /**
         * 尝试在3S内获取锁
         */
        try {
            if(reentrantLock.tryLock(3, TimeUnit.SECONDS)){
                System.out.println(Thread.currentThread().getName()+" get lock");
                TimeUnit.SECONDS.sleep(5);
            }else{
                System.out.println(Thread.currentThread().getName()+" not lock");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            if(reentrantLock.isHeldByCurrentThread()){
                reentrantLock.unlock();
            }
        }
    }
}
```

### 20、生产者消费者模式

在一个生产环境中，生产者和消费者在同一时间段内共享同一块缓冲区，生产者负责向缓冲区添加数据，消费者负责从缓冲区取出数据。

#### 1、汉堡类

```java
public class Hamburger {
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Hamburger{" +
            "id=" + id +
            '}';
    }
}
```

#### 2、容器类

```java
public class Container {
    public Hamburger[] array = new Hamburger[6];
    public int index = 0;
    /**
     * 向容器中添加汉堡
     */
    public synchronized void push(Hamburger hamburger){
        while(index == array.length){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        this.notify();
        array[index] = hamburger;
        index++;
        System.out.println("生产类一个汉堡"+hamburger);
    }
    /**
     * 从容器中取出汉堡
     */
    public synchronized Hamburger pop(){
        while(index == 0){
            //当前线程暂停
            //让正在访问当前资源的线程暂停
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        //唤醒之前暂停的线程
        this.notify();
        index--;
        System.out.println("消费了一个汉堡"+array[index]);
        return array[index];
    }
}
```

#### 3、生产者

```java
/**
 * 生产者
 */
public class Producer {
    private Container container;
    public Producer(Container container){
        this.container = container;
    }

    public void product(){
        for (int i = 0; i < 30; i++) {
            Hamburger hamburger = new Hamburger(i);
            this.container.push(hamburger);
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

#### 4、消费者

```java
public class Consumer {
    private Container container;

    public Consumer(Container container) {
        this.container = container;
    }

    public void consum(){
        for (int i = 0; i < 30; i++) {
            this.container.pop();
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

#### 5、测试类

```java
public class Test {
    public static void main(String[] args) {
        Container container = new Container();
        Producer producer = new Producer(container);
        Consumer consumer = new Consumer(container);
        new Thread(()->{
            producer.product();
        }).start();
        new Thread(()->{
            producer.product();
        }).start();
        new Thread(()->{
            consumer.consum();
        }).start();
        new Thread(()->{
            consumer.consum();
        }).start();
        new Thread(()->{
            consumer.consum();
        }).start();
    }
}
```

### 21、多线程并发卖票

一场球赛的球票分 3 个窗口出售，共 15 张票，用多线程并发来模拟 3 个窗口的售票情况

```java
public class Ticket {
    //剩余球票
    private int surpluCount = 15;
    //已售出球票
    private int outCount = 0;

    public synchronized void sale(){
        while(surpluCount > 0){
            try {
                TimeUnit.MILLISECONDS.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            if(surpluCount == 0){
                return;
            }
            surpluCount--;
            outCount++;
            if(surpluCount == 0){
                System.out.println(Thread.currentThread().getName()+"售出第"+outCount+"张票，球票已售罄");
            }else{
                System.out.println(Thread.currentThread().getName()+"售出第"+outCount+"张票，剩余"+surpluCount+"张票");
            }
        }
    }
}
```

```java
public class Test {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();
        new Thread(()->{
            ticket.sale();
        },"A").start();

        new Thread(()->{
            ticket.sale();
        },"B").start();

        new Thread(()->{
            ticket.sale();
        },"C").start();
    }
}
```
