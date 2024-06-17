# 并发编程

## 《对线面试官》多线程基础xx

### 进程&线程&协程

> **程序**是计算机的可执行文件；
>
> **什么是进程：资源分配的基本单位（静态概念）**
>
> - 一个在内存中运行的应用程序。每个进程都有自己独立的一块内存空间，一个进程可以有多个线程，比如在Windows系统中，一个运行的xx.exe就是一个进程（qq.exe）。
>
> **什么是线程：资源调度的基本单位（动态概念）**
>
> - 进程中的一个执行任务（控制单元），负责当前进程中程序的执行。一个进程至少有一个线程，一个进程可以运行多个线程，多个线程共享进程中的资源（数据）。

### 什么是守护线程？

> 在Java中有两类线程：User Thread(用户线程)、Daemon Thread(守护线程) 
>
> 所谓守护线程是指在程序运行的时候在后台提供一种通用服务的线程，比如垃圾回收线程就是一个很称职的守护者，并且这种线程并不属于程序中不可或缺的部分。因此，当所有的非守护线程结束时，程序也就终止了，同时会杀死进程中的所有守护线程。反过来说，只要任何非守护线程还在运行，程序就不会终止；
>

### 进程间的通信

> **进程间通信的原理**
>
> 每个进程各自有不同的用户地址空间，任何一个进程的全局变量在另一个进程中都看不到，所以进程之间要交换数据必须通过内核,在内核中开辟一块缓冲区，进程1把数据从用户空间拷到内核缓冲区，进程2再从内核缓冲区把数据读走，内核提供的这种机制称为进程间通信机制。
>
> ![](current_imgs\v2-19d4ac7dccc826737fab858d8e84de52_r.jpg)
>
> 1.  **套接字Socket**：套解口也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同及其间的进程通信。
> 2. **管道pipe**：管道是一种半双工的通信方式，数据只能单向流动，而且只能在具有亲缘关系的进程间使用。进程的亲缘关系通常是指父子进程关系。
> 3. **命名管道FIFO**：有名管道也是半双工的通信方式，但是它允许无亲缘关系进程间的通信。
> 4. **消息队列MessageQueue**：消息队列是由消息的链表，存放在内核中并由消息队列标识符标识。消息队列克服了信号传递信息少、管道只能承载无格式字节流以及缓冲区大小受限等缺点。
> 5. **信号量Semaphore**：信号量是一个计数器，可以用来控制多个进程对共享资源的访问。它常作为一种锁机制，防止某进程正在访问共享资源时，其他进程也访问该资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。
> 6. **信号 ( sinal )** ： 信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生。
> 7. 共享存储SharedMemory：共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。共享内存是最快的 IPC 方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往与其他通信机制，如信号两，配合使用，来实现进程间的同步和通信。

### 什么是上下文切换?

> **上下文**
>
> 首先，需要讲清楚什么是上下文。
>
> 每个任务运行前，CPU 都需要知道任务从哪里加载、又从哪里开始运行，这就涉及到 CPU 寄存器 和 程序计数器（PC）：
>
> CPU 寄存器是 CPU 内置的容量小、但速度极快的内存；
> 程序计数器会存储 CPU 正在执行的指令位置，或者即将执行的指令位置。
> 这两个是 CPU 运行任何任务前都必须依赖的环境，因此叫做 CPU 上下文。
>
> **上下文切换**
>
> 那么，什么是上下文切换呢？下面是一个上下文切换时需要履行的步骤：
>
> 将前一个 CPU 的上下文（也就是 CPU 寄存器和程序计数器里边的内容）保存起来；
> 然后加载新任务的上下文到寄存器和程序计数器；
> 最后跳转到程序计数器所指的新位置，运行新任务。
> 被保存起来的上下文会存储到系统内核中，等待任务重新调度执行时再次加载进来。

### 什么是线程死锁?如何避免死锁?⭐

> `线程死锁描述`的是这样一种情况：多个线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于线程被无限期地阻塞，因此程序不可能正常终止。
>
> 如下图所示，线程 A 持有资源 2，线程 B 持有资源 1，他们同时都想申请对方的资源，所以这两个线程就会互相等待而进入死锁状态。
>
> ![线程死锁示意图 ](current_imgs\2019-4死锁1.png)
>
> `上面的例子符合产生死锁的四个必要条件：`
>
> 1. 互斥条件：该资源任意一个时刻只由一个线程占用。
> 2. 请求与保持条件：一个线程因请求资源而阻塞时，对已获得的资源保持不放。
> 3. 不剥夺条件:线程已获得的资源在未使用完之前不能被其他线程强行剥夺，只有自己使用完毕后才释放资源。
> 4. 循环等待条件:若干线程之间形成一种头尾相接的循环等待资源关系。
>
> `如何预防和避免线程死锁?`
>
> **如何预防死锁？** 破坏死锁的产生的必要条件即可：
>
> 1. **破坏请求与保持条件** ：一次性申请所有的资源。
> 2. **破坏不剥夺条件** ：占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源。
> 3. **破坏循环等待条件** ：靠按序申请资源来预防。按某一顺序申请资源，释放资源则反序释放。破坏循环等待条件。

### 介绍一下线程的生命周期及状态？

> ![](current_imgs\life.jpg)
>
> 1. 创建
>
>    当程序使用new关键字创建了一个线程之后，该线程就处于一个新建状态（初始状态），此时它和其他Java对象一样，仅仅由Java虚拟机为其分配了内存，并初始化了其成员变量值。此时的线程对象没有表现出任何线程的动态特征，程序也不会执行线程的线程执行体。
>
> 2. 就绪
>
>    当线程对象调用了Thread.start()方法之后，该线程处于就绪状态。Java虚拟机会为其创建方法调用栈和程序计数器，处于这个状态的线程并没有开始运行，它只是表示该线程可以运行了。从start()源码中看出，start后添加到了线程列表中，接着在native层添加到VM中，至于该线程何时开始运行，取决于JVM里线程调度器的调度(如果OS调度选中了，就会进入到运行状态)。
>
> 3. 运行
>
>    当线程对象调用了Thread.start()方法之后，该线程处于就绪状态。添加到了线程列表中，如果OS调度选中了，就会进入到运行状态
>
> 4. 阻塞
>
>    阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行。直到线程进入就绪状态，才有机会转到运行状态。阻塞的情况大概三种：
>
>    - 1、**等待阻塞**：运行的线程执行wait()方法，JVM会把该线程放入等待池中。(wait会释放持有的锁)
>    - 2、**同步阻塞**：运行的线程在获取对象的同步锁时，若该同步锁被别的线程占用，则JVM会把该线程放入锁池中。
>    - 3、**其他阻塞**：运行的线程执行sleep()或join()方法，或者发出了I/O请求时，JVM会把该线程置为阻塞状态。当sleep()状态超时、join()等待线程终止或者超时、或者I/O处理完毕时，线程重新转入就绪状态。（注意,sleep是不会释放持有的锁）。
>
> 5. 死亡
>
>    线程会以以下三种方式之一结束，结束后就处于死亡状态:
>
>    - run()方法执行完成，线程正常结束。
>    - 线程抛出一个未捕获的Exception或Error。
>    - 直接调用该线程的stop()方法来结束该线程——该方法容易导致死锁，通常不推荐使用

### 创建线程有四种方式

> - 继承 Thread 类；
> - 实现 Runnable 接口；
> - 实现 Callable 接口；
> - 使用 Executors 工具类创建线程池
>

### 线程的sleep、wait、join、yield如何使用？⭐

> **sleep**：sleep() 是 Thread 类的静态本地方法；sleep() 会休眠当前线程指定时间，释放 CPU 资源，不释放对象锁，休眠时间到自动苏醒继续执行；
>
> **wait**：wait() 是Object类的成员本地方法；wait() 方法放弃持有的对象锁，进入等待队列，当该对象被调用 notify() / notifyAll() 方法后才有机会竞争获取对象锁，进入运行状态；
>
> **join**：线程之间协同方式,使用场景: 线程A必须等待线程B运行完毕后才可以执行,那么就可以在线程A的代码中加入ThreadB.join()；
>
> **yield**：让当前正在运行的线程弃获取CPU的时间片回到可运行状态，以允许具有相同优先级的其他线程获得运行的机会。因此，使用yield()的目的是让具有相同优先级的线程之间能够适当的轮换执行。但是，实际中无法保证yield()达到让步的目的，因为，让步的线程可能被线程调度程序再次选中。

### sleep 和 wait

> 1. sleep() 是 Thread 类的静态本地方法；wait() 是Object类的成员本地方法
> 2. sleep() 方法可以在任何地方使用；wait() 方法则只能在同步方法或同步代码块中使用，否则抛出异常Exception in thread "Thread-0" java.lang.IllegalMonitorStateException
> 3. sleep() 会休眠当前线程指定时间，释放 CPU 资源，不释放对象锁，休眠时间到自动苏醒继续执行；wait() 方法放弃持有的对象锁，进入等待队列，当该对象被调用 notify() / notifyAll() 方法后才有机会竞争获取对象锁，进入运行状态
> 4. JDK1.8 sleep() wait() 均需要捕获 InterruptedException 异常

### 中断线程

**interrupt相关的三个方法**

> ```java
> //Thread.java  
> public void interrupt()            //t.interrupt() 打断t线程（设置t线程某给标志位f=true，并不是打断线程的运行）
> public boolean isInterrupted()     //t.isInterrupted() 查询打断标志位是否被设置（是不是曾经被打断过）
> public static boolean interrupted()//Thread.interrupted() 查看“当前”线程是否被打断，如果被打断，恢复标志位
> ```
>
> 1. interrupt() ：实例方法，设置线程中断标志（打扰一下，你该处理一下中断）
> 2. isInterrupted()：实例方法，有没有人打扰我？
> 3. interrupted()：静态方法，有没有人打扰我（当前线程）？复位！

**interrupt和sleep() wait() join()**

> sleep()方法在睡眠的时候，不到时间是没有办法叫醒的，这个时候可以用interrupt设置标志位，然后呢必须得catch InterruptedException来进行处理，决定继续睡或者是别的逻辑，（自动进行中断标志复位）
>
> ```java
> public class d_Interrupt_and_sleep {
>     public static void main(String[] args) {
>           Thread t = new Thread(() -> {
>               try {
>                   Thread.sleep(10000);
>               } catch (InterruptedException e) {
>                   System.out.println("Thread is interrupted!");
>                   System.out.println(Thread.currentThread().isInterrupted());
>               }
>           });
>           t.start();
>           SleepHelper.sleepSeconds(5);
>           t.interrupt();
>     }
> }
> /**
> Thread is interrupted!
> false   
> */
> ```

**interrupt是否能中断正在竞争锁的线程**

> ```java
> public class d_Interrupt_and_sync {
> private static Object o = new Object();
> 
> public static void main(String[] args) {
>   Thread t1 = new Thread(() -> {
>       synchronized (o) {
>           SleepHelper.sleepSeconds(10);
>       }
>   });
> 
>   t1.start();
>   SleepHelper.sleepSeconds(1);
> 
>   Thread t2 = new Thread(() -> {
>       synchronized (o) {
> 
>       }
>       System.out.println("t2 end!");
>   });
> 
>   t2.start();
>   SleepHelper.sleepSeconds(1);
>   t2.interrupt();
> }
> }
> /**
> t2 end!
> */
> ```
>
> interrupt()不能打断正在竞争锁的线程synchronized()

**如果想打断正在竞争锁的线程，使用ReentrantLock的lockInterruptibly()**

> ```java
> public class d_Interrupt_and_lockInterruptibly {
> private static ReentrantLock lock = new ReentrantLock();
> 
> public static void main(String[] args) {
>   Thread t1 = new Thread(() -> {
>       lock.lock();
>       try {
>           SleepHelper.sleepSeconds(10);
>       } finally {
>           lock.unlock();
>       }
>       System.out.println("t1 end!");
>   });
> 
>   t1.start();
>   SleepHelper.sleepSeconds(1);
> 
>   Thread t2 = new Thread(() -> {
>       System.out.println("t2 start!");
>       try {
>           lock.lockInterruptibly();
>       } catch (InterruptedException e) {
>           e.printStackTrace();
>       } finally {
>           lock.unlock();
>       }
>       System.out.println("t2 end!");
>   });
> 
>   t2.start();
>   SleepHelper.sleepSeconds(1);
>   t2.interrupt();
> }
> }
> /**
> t2 start!
> java.lang.InterruptedException
> t1 end!
> */
> ```

### 优雅的结束线程

> 结束线程的方法：
>
> 1. 使用退出标志，使线程正常退出，也就是当 run() 方法完成后线程中止。
>
>    ```java
>    public class ServerThread extends Thread {
>        //volatile修饰符用来保证其它线程读取的总是该变量的最新的值
>        public volatile boolean exit = false; 
>    
>        @Override
>        public void run() {
>            ServerSocket serverSocket = new ServerSocket(8080);
>            while(!exit){
>                serverSocket.accept(); //阻塞等待客户端消息
>                ...
>            }
>        }
>        
>        public static void main(String[] args) {
>            ServerThread t = new ServerThread();
>            t.start();
>            ...
>            t.exit = true; //修改标志位，退出线程
>        }
>    }
>    ```
>
> 2. 使用 stop() 方法强行终止线程，但是不推荐使用这个方法，该方法已被弃用。
>
> 3. 使用 interrupt 方法中断线程。
>
>    需要明确的一点的是：interrupt() 方法并不像在 for 循环语句中使用 break 语句那样干脆，马上就停止循环。调用 interrupt() 方法仅仅是在当前线程中打一个停止的标记，并不是真的停止线程。
>
>    也就是说，线程中断并不会立即终止线程，而是通知目标线程，有人希望你终止。至于目标线程收到通知后会如何处理，则完全由目标线程自行决定。这一点很重要，如果中断后，线程立即无条件退出，那么我们又会遇到 stop() 方法的老问题。
>
>    事实上，如果一个线程不能被 interrupt，那么 stop 方法也不会起作用。
>
>    ```java
>    public class InterruptThread1 extends Thread{
>                      
>        public static void main(String[] args) {
>            try {
>                InterruptThread1 t = new InterruptThread1();
>                t.start();
>                Thread.sleep(200);
>                t.interrupt();
>            } catch (InterruptedException e) {
>                e.printStackTrace();
>            }
>        }
>                      
>        @Override
>        public void run() {
>            super.run();
>            for(int i = 0; i <= 200000; i++) {
>                System.out.println("i=" + i);
>            }
>        }
>                          
>    }
>    ```

## 《对线面试官》 Java内存模型⭐

?> `Java内存模型`：Java为了屏蔽硬件和操作系统访问内存的各种差异，提出了「Java内存模型」的规范，保证了Java程序在各种平台下对内存的访问都能得到一致效果

### Java内存模型的抽象结构

> **候选者**：Java内存模型规定了：线程对变量的所有操作都必须在「本地内存」进行，「不能直接读写主内存」的变量
>
> **候选者**：Java内存模型定义了8种操作来完成「变量如何从主内存到本地内存，以及变量如何从本地内存到主内存」
>
> **候选者**：分别是read/load/use/assign/store/write/lock/unlock操作

![](current_imgs\v2-92f473a0d68aaf40002ebb774c015d16_1440w.png)

### as-if-serial规则

> as-if-serial语义**保证单线程内程序的执行结果不被改变**

### happens-before规则

> happens-before关系**保证正确同步的多线程程序的执行结果不被改变**
>
> 具体的定义为：
>
> 1. 如果一个操作happens-before另一个操作，那么第一个操作的执行结果将对第二个操作可见，而且第一个操作的执行顺序排在第二个操作之前。
> 2. 两个操作之间存在happens-before关系，并不意味着Java平台的具体实现必须要按照happens-before关系指定的顺序来执行。如果重排序之后的执行结果，与按happens-before关系来执行的结果一致，那么这种重排序并不非法（也就是说，JMM允许这种重排序）。

### 对volatile内存语义

> volatile是Java的关键字，修饰的变量是可见性且有序的（不会被重排序）。可见性由happen-before规则完成，有序性由Java内存模型定义的「内存屏障」完成，实际HotSpot虚拟机实现Java内存模型规范，汇编底层通过Lock指令来实现。

### MESI（缓存一致性协议）

?>**其实MESI协议做的就是判断「对象状态」，根据「对象状态」做不同的策略。关键就在于某个CPU在对数据进行修改时，需要「同步」通知其他CPU，表示这个数据被我修改了，你们不能用了**。

> **候选者**：MESI协议的原理大概就是：当每个CPU读取共享变量之前，会先识别数据的「对象状态」(是修改、还是共享、还是独占、还是无效)。
>
> **候选者**：如果是独占，说明当前CPU将要得到的变量数据是最新的，没有被其他CPU所同时读取
>
> **候选者**：如果是共享，说明当前CPU将要得到的变量数据还是最新的，有其他的CPU在同时读取，但还没被修改
>
> **候选者**：如果是修改，说明当前CPU正在修改该变量的值，同时会向其他CPU发送该数据状态为invalid(无效)的通知，得到其他CPU响应后（其他CPU将数据状态从共享(share)变成invalid(无效)），会当前CPU将高速缓存的数据写到主存，并把自己的状态从modify(修改)变成exclusive(独占)
>
> **候选者**：如果是无效，说明当前数据是被改过了，需要从主存重新读取最新的数据。

## 《对线面试官》CountDownLatch和CyclicBarrier⭐

> **面试官**：我是希望你能讲下什么是CountDownLatch和CyclicBarrier分别是什么意思
>
> **面试官**：比如说：CountDownLatch和CyclicBarrier都是线程同步的工具类
>
> **面试官**：CountDownLatch允许一个或多个线程一直等待，直到这些线程完成它们的操作
>
> **面试官**：而CyclicBarrier不一样，它往往是当线程到达某状态后，暂停下来等待其他线程，等到所有线程均到达以后，才继续执行
>
> **面试官**：可以发现这两者的等待主体是不一样的。
>
> **面试官**：CountDownLatch调用await()通常是主线程/调用线程，而CyclicBarrier调用await()是在任务线程调用的
>
> **面试官**：所以，CyclicBarrier中的阻塞的是任务的线程，而主线程是不受影响的。

<!-- tabs:start -->

#### **CountDownLatch**

```java
	public static void main(String[] args) {
        final CountDownLatch latch = new CountDownLatch(10);
        for (int i = 0; i < 10; i++) {
            //lambda中只能只用final的变量
            final int times = i;
            new Thread(() -> {
                try {
                    System.out.println("子线程" + Thread.currentThread().getName() + "正在赶路");
                    Thread.sleep(1000 * times);
                    System.out.println("子线程" + Thread.currentThread().getName() + "到公司了");
                    //调用latch的countDown方法使计数器-1
                    latch.countDown();
                    System.out.println("子线程" + Thread.currentThread().getName() + "开始工作");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }

        try {
            System.out.println("门卫等待员工上班中...");
            //主线程阻塞等待计数器归零
            latch.await();
            System.out.println("员工都来了,门卫去休息了");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
```

运行后结果如下

```text
子线程Thread-0正在赶路
子线程Thread-2正在赶路
子线程Thread-0到公司了
子线程Thread-0开始工作
子线程Thread-1正在赶路
门卫等待员工上班中...
子线程Thread-4正在赶路
子线程Thread-9正在赶路
子线程Thread-5正在赶路
子线程Thread-6正在赶路
子线程Thread-7正在赶路
子线程Thread-8正在赶路
子线程Thread-3正在赶路
子线程Thread-1到公司了
子线程Thread-1开始工作
子线程Thread-2到公司了
子线程Thread-2开始工作
子线程Thread-3到公司了
子线程Thread-3开始工作
子线程Thread-4到公司了
子线程Thread-4开始工作
子线程Thread-5到公司了
子线程Thread-5开始工作
子线程Thread-6到公司了
子线程Thread-6开始工作
子线程Thread-7到公司了
子线程Thread-7开始工作
子线程Thread-8到公司了
子线程Thread-8开始工作
子线程Thread-9到公司了
子线程Thread-9开始工作
员工都来了,门卫去休息了
```

可以看到子线程并没有因为调用latch.countDown而阻塞,会继续进行该做的工作,只是通知计数器-1,即完成了我们如上说的场景,只需要在所有进程都进行到某一节点后才会执行被阻塞的进程.如果我们想要多个线程在同一时间进行就要用到CyclicBarrier了

#### **CyclicBarrier**

我们重新模拟一个新的场景,就用已经被说烂的跑步场景吧,十名运动员各自准备比赛,需要等待所有运动员都准备好以后,裁判才能说开始然后所有运动员一起跑,代码实现如下

```java
	public static void main(String[] args) {
        final CyclicBarrier cyclicBarrier = new CyclicBarrier(10,()->{
            System.out.println("所有人都准备好了裁判开始了");
        });
        for (int i = 0; i < 10; i++) {
            //lambda中只能只用final的变量
            final int times = i;
            new Thread(() -> {
                try {
                    System.out.println("子线程" + Thread.currentThread().getName() + "正在准备");
                    Thread.sleep(1000 * times);
                    System.out.println("子线程" + Thread.currentThread().getName() + "准备好了");
                    cyclicBarrier.await();
                    System.out.println("子线程" + Thread.currentThread().getName() + "开始跑了");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
```

执行结果如下

```text
子线程Thread-0正在准备
子线程Thread-2正在准备
子线程Thread-1正在准备
子线程Thread-3正在准备
子线程Thread-4正在准备
子线程Thread-0准备好了
子线程Thread-5正在准备
子线程Thread-6正在准备
子线程Thread-7正在准备
子线程Thread-8正在准备
子线程Thread-9正在准备
子线程Thread-1准备好了
子线程Thread-2准备好了
子线程Thread-3准备好了
子线程Thread-4准备好了
子线程Thread-5准备好了
子线程Thread-6准备好了
子线程Thread-7准备好了
子线程Thread-8准备好了
子线程Thread-9准备好了
所有人都准备好了裁判开始了
子线程Thread-9开始跑了
子线程Thread-0开始跑了
子线程Thread-2开始跑了
子线程Thread-1开始跑了
子线程Thread-7开始跑了
子线程Thread-6开始跑了
子线程Thread-5开始跑了
子线程Thread-4开始跑了
子线程Thread-3开始跑了
子线程Thread-8开始跑了
```

可以看到所有线程在其他线程没有准备好之前都在被阻塞中,等到所有线程都准备好了才继续执行 我们在创建CyclicBarrier对象时传入了一个方法,当调用CyclicBarrier的await方法后,当前线程会被阻塞等到所有线程都调用了await方法后 调用传入CyclicBarrier的方法,然后让所有的被阻塞的线程一起运行

<!-- tabs:end -->

**CountDownLatch 原理实现**

> **面试官**：比如说CountDownLatch你就可以回答：前面提到了CountDownLatch也是基于AQS实现的，它的实现机制很简单
>
> **面试官**：当我们在构建CountDownLatch对象时，传入的值其实就会赋值给 AQS 的关键变量state
>
> **面试官**：执行countDown方法时，其实就是利用CAS 将state 减一
>
> **面试官**：执行await方法时，其实就是判断state是否为0，不为0则加入到队列中，将该线程阻塞掉（除了头结点）
>
> **面试官**：因为头节点会一直自旋等待state为0，当state为0时，头节点把剩余的在队列中阻塞的节点也一并唤醒。

**CyclicBarrier 原理实现**

> **面试官**：从源码不难发现的是，它没有像CountDownLatch和ReentrantLock使用AQS的state变量，而CyclicBarrier是直接借助ReentrantLock加上Condition 等待唤醒的功能 进而实现的
>
> **面试官**：在构建CyclicBarrier时，传入的值会赋值给CyclicBarrier内部维护count变量，也会赋值给parties变量（这是可以复用的关键）
>
> **面试官**：每次调用await时，会将count -1 ，操作count值是直接使用ReentrantLock来保证线程安全性
>
> **面试官**：如果count不为0，则添加则condition队列中
>
> **面试官**：如果count等于0时，则把节点从condition队列添加至AQS的队列中进行全部唤醒，并且将parties的值重新赋值为count的值（实现复用）

**总结**

> **面试官**：再简单总结下：CountDownlatch基于AQS实现，会将构造CountDownLatch的入参传递至state，countDown()就是在利用CAS将state减-1，await()实际就是让头节点一直在等待state为0时，释放所有等待的线程
>
> **面试官**：而CyclicBarrier则利用ReentrantLock和Condition，自身维护了count和parties变量。每次调用await将count-1，并将线程加入到condition队列上。等到count为0时，则将condition队列的节点移交至AQS队列，并全部释放。

## 《对线面试官》ThreadLocal⭐

**面试官**：**今天要不来聊聊ThreadLocal吧？**

> **候选者**：我个人对ThreadLocal理解就是
>
> **候选者**：它提供了线程的局部变量，每个线程都可以通过set/get来对这个局部变量进行操作
>
> **候选者**：不会和其他线程的局部变量进行冲突，实现了线程的数据隔离
>
> ![图片](current_imgs\640adfvfhgrhtrhrtjd.png)
>
> #### ThreadLocal的实现原理
>
> ThreadLocal的实现原理：每个Thread 维护一个 **ThreadLocalMap** 映射表，这个映射表的 key 是 **ThreadLocal**实例本身，**value** 是真正需要存储的 Object。
>
> 也就是说 ThreadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value。值得注意的是图中的虚线，表示 ThreadLocalMap 是使用 ThreadLocal 的弱引用作为 Key 的，弱引用的对象在 GC 时会被回收。

**面试官**：**你在工作中有用到过ThreadLocal吗？**

> **候选者**：这块是真不多，项目中是有的（但是并不是我写的，没怎么注意）
>
> **候选者**：在工作中ThreadLocal的应用场景确实不多，但要不我给你讲讲Spring是怎么用的？
>
> -  解决线程安全问题在Spring的Web项目中，我们通常会将业务分为Controller层，Service层，Dao层，我们都知道@Autowired注解默认使用单例模式，那么不同请求线程进来之后，由于Dao层使用单例，那么负责数据库连接的Connection也只有一个，如果每个请求线程都去连接数据库，那么就会造成线程不安全的问题
>
> - Spring是如何解决这个问题的呢？
>
>   在Spring项目中Dao层中装配的Connection肯定是线程安全的，其解决方案就是采用ThreadLocal方法，当每个请求线程使用Connection的时候，都会从ThreadLocal获取一次，如果为null，说明没有进行过数据库连接，连接后存入ThreadLocal中，如此一来，每一个请求线程都保存有一份 自己的Connection。于是便解决了线程安全问题ThreadLocal在设计之初就是为解决并发问题而提供一种方案，每个线程维护一份自己的数据，达到线程隔离的效果。

**面试官**：**你知道ThreadLocal内存泄露这个知识点吗？**

> **候选者**：ThreadLocal内存泄露其实发生的概率非常非常低，我也不知道为什么这么喜欢问。
>
> **候选者**：回到原理上，我们知道Thread在创建的时候，会有栈引用指向Thread对象，Thread对象内部维护了ThreadLocalMap引用
>
> **候选者**：而ThreadLocalMap的Key是ThreadLocal，value是传入的Object
>
> **候选者**：ThreadLocal对象会被对应的栈引用关联，ThreadLocalMap的key也指向着ThreadLocal
>
> **候选者**：ThreadLocalRef && ThreadLocalMap Entry key ->ThreadLocal
>
> **候选者**：ThreadRef->Thread->ThreadLoalMap-> Entry value-> Object
>
> **候选者**：网上大多分析的是ThreadLocalMap的key是弱引用指向ThreadLocal
>
> ------
>
> **候选者**：为什么我说导致内存泄露的概率非常低呢，我觉得是这样的
>
> **候选者**：首先ThreadLocal被两种引用指向
>
> **候选者**：1):ThreadLocalRef->ThreadLocal（强引用）
>
> **候选者**：2):ThreadLocalMap Entry key ->ThreadLocal（弱引用）
>
> **候选者**：只要ThreadLocal没被回收（使用时强引用不置null），那ThreadLocalMap Entry key的指向就不会在GC时断开被回收，也没有内存泄露一说法
>
> **候选者**：通过ThreadLocal了解实现后，又知道ThreadLocalMap是依附在Thread上的，只要Thread销毁，那ThreadLocalMap也会销毁
>
> **候选者**：那非线程池环境下，也不会有长期性的内存泄露问题
>
> **候选者**：而ThreadLocal实现下还做了些”保护“措施，如果在操作ThreadLocal时，发现key为null，会将其清除掉
>
> **候选者**：所以，如果在线程池（线程复用）环境下，如果还会调用ThreadLocal的set/get/remove方法
>
> **候选者**：发现key为null会进行清除，不会有长期性的内存泄露问题
>
> **候选者**：那存在长期性内存泄露需要满足条件：ThreadLocal被回收&&线程被复用&&线程复用后不再调用ThreadLocal的set/get/remove方法
>
> ![图片](current_imgs\640adsafdsfxccvcxvcb.png)
>
> **候选者**：使用ThreadLocal的最佳实践就是：用完了，手动remove掉。就像使用Lock加锁后，要记得解锁
>
> **面试官**：那我想问下，**为什么要将ThreadLocalMap的key设置为弱引用呢？强引用不香吗？**
>
> **候选者**：外界是通过ThreadLocal来对ThreadLocalMap进行操作的，假设外界使用ThreadLocal的对象被置null了，那ThreadLocalMap的强引用指向ThreadLocal也毫无意义啊。
>
> **候选者**：弱引用反而可以预防大多数内存泄漏的情况
>
> **候选者**：毕竟被回收后，下一次调用set/get/remove时ThreadLocal内部会清除掉
>
> **面试官**：**我看网上有很多人说建议把ThreadLocal修饰为static，为什么？**
>
> **候选者**：ThreadLocal能实现了线程的数据隔离，不在于它自己本身，而在于Thread的ThreadLocalMap
>
> **候选者**：所以，ThreadLocal可以只初始化一次，只分配一块存储空间就足以了，没必要作为成员变量多次被初始化。
>
> **面试官**：最后想问个问题：**什么叫做内存泄露？**
>
> **候选者**：…..
>
> **候选者**：意思就是：你申请完内存后，你用完了但没有释放掉，你自己没法用，系统又没法回收。
>
> **面试官**：清楚了

**面试官**：嗯…**要不顺便讲讲Java的4种引用吧**

> **候选者**：强引用是最常见的，只要把一个对象赋给一个引用变量，这个引用变量就是一个强引用
>
> **候选者**：强引用：只要对象没有被置null，在GC时就不会被回收
>
> **候选者**：软引用相对弱化了一些，需要继承 SoftReference实现
>
> **候选者**：软引用：如果内存充足，只有软引用指向的对象不会被回收。如果内存不足了，只有软引用指向的对象就会被回收
>
> **候选者**：弱引用又更弱了一些，需要继承WeakReference实现
>
> **候选者：**弱引用：只要发生GC，只有弱引用指向的对象就会被回收
>
> **候选者**：最后就是虚引用，需要继承PhantomReference实现
>
> **候选者**：虚引用的主要作用是：跟踪对象垃圾回收的状态，当回收时通过引用队列做些「通知类」的工作

## 《对线面试官》线程池⭐

**面试官**：今天来聊聊线程池呗，**你对Java线程池了解多少？** 或者换个问法：**为什么需要线程池？**

> **候选者**：其实是这样子的
>
> **候选者**：JVM在HotSpot的线程模型下，Java线程会一对一映射为内核线程
>
> **候选者**：这意味着，在Java中每次创建以及回收线程都会去内核创建以及回收
>
> **候选者**：这就有可能导致：创建和销毁线程所花费的时间和资源可能比处理的任务花费的时间和资源要更多
>
> **候选者**：线程池的出现是为了提高线程的复用性以及固定线程的数量！！！

![图片](current_imgs\640cxzafewggnvc.png)

**面试官**：**你在项目中用到了线程池吗？**

> **候选者**：定时运行 报表sql，在进行 聚合运算；我把这个过程给异步化，为了提高系统的吞吐量，于是我这里用的线程池。

**面试官**：**那你是怎么用线程池的呢？用 Executors 去创建的吗？**

> **候选者**：不是的，我这边用的ThreadPoolExecutor去创建线程池
>
> **候选者**：其实看阿里巴巴开发手册就有提到，不要使用Executors去创建线程。
>
> **候选者**：最主要的目的就是：使用ThreadPoolExecutor创建的线程你是更能了解线程池运行的规则，避免资源耗尽的风险
>
> - 参数
>
>   ```java
>   public ThreadPoolExecutor(int corePoolSize,
>                                  int maximumPoolSize,
>                                  long keepAliveTime,
>                                  TimeUnit unit,
>                                  BlockingQueue<Runnable> workQueue,
>                                  RejectedExecutionHandler handler) 
>   ```
>
>
> **候选者**：ThreadPoolExecutor在构造的时候有几个重要的参数，分别是：
>
> **候选者**：corePoolSize（核心线程数量）、maximumPoolSize（最大线程数量）、keepAliveTime（线程空余时间）、workQueue（阻塞队列）、handler（任务拒绝策略）
>
> **候选者**：这几个参数应该很好理解哈，我就说下**任务提交的流程**，分别对应着几个参数的作用吧。
>
> **候选者**：1):首先会判断运行线程数是否小于corePoolSize，如果小于，则直接创建新的线程执行任务
>
> **候选者**：2):如果大于corePoolSize，判断workQueue阻塞队列是否已满，如果还没满，则将任务放到阻塞队列中
>
> **候选者**：3):如果workQueue阻塞队列已经满了，则判断当前线程数是否大于maximumPoolSize，如果没大于则创建新的线程执行任务
>
> **候选者**：4):如果大于maximumPoolSize，则执行任务拒绝策略（具体就是你自己实现的handler）
>
> **候选者**：这里有个点需要注意下，就是workQueue阻塞队列满了，但当前线程数小于maximumPoolSize，这时候会创建新的线程执行任务
>
> **候选者**：源码就是这样实现的
>
> **候选者**：不过一般我们都是将corePoolSize和maximumPoolSize设置相同数量
>
> **候选者**：keepAliveTime指的就是，当前运行的线程数大于核心线程数了，只要空闲时间达到了，就会对线程进行回收

**面试官**：那我再问一个问题，**你创建线程池肯定会指定线程数的嘛，你这块是怎么考量的**。

> **候选者**：线程池指定线程数这块，首先要考量自己的业务是什么样的
>
> **候选者**：是cpu密集型的还是io密集型的，假设运行应用的机器CPU核心数是N
>
> **候选者**：那cpu密集型的可以先给到N+1，io密集型的可以给到2N去试试
>
> **候选者**：上面这个只是一个常见的经验做法，具体究竟开多少线程，需要压测才能比较准确地定下来
>
> **候选者**：线程不是说越大越好，在之前的面试我也提到过，多线程是为了充分利用CPU的资源
>
> **候选者**：如果设置的线程过多，线程大量有上下文切换，这一部分也会带来系统的开销，这就得不偿失了

**面试官**：**ThreadPoolExecutor你看过源码吗？**

> **候选者**：看过的，其实上面说的ThreadPoolExecutor几个参数，在源码的顶部注释都有
>
> **候选者**：在执行的时候，重点就在于它维护了一个ctl参数，这个ctl参数的用高3位表示线程池的状态，低29位来表示线程的数量
>
> **候选者**：里边用到了大量的位运算符操作，具体细节我就忘了。但是流程还是上面所讲的
>
> **面试官**：好吧

**线程池中的方法、参数、拒绝策略？**

- `创建四种常见线程池`

  **new SingleThreadExecutor**：创建一个单线程的线程池，此线程池保证所有任务的执行顺序按照任务的提交顺序执行。
  **new FixedThreadPool**：创建固定大小的线程池，每次提交一个任务就创建一个线程，直到线程达到线程池的最大大小。
  **new CachedThreadPool**：创建一个可缓存的线程池，此线程池不会对线程池大小做限制，线程池大小完全依赖于操作系统（或者说JVM）能够创建的最大线程大小。
  **new ScheduledThreadPool**：创建一个大小无限的线程池，此线程池支持定时以及周期性执行任务的求。

- `拒绝策略`

  - AbortPolicy：中止策略。默认的拒绝策略，直接抛出 RejectedExecutionException。调用者可以捕获这个异常，然后根据需求编写自己的处理代码。
  - DiscardPolicy：抛弃策略。什么都不做，直接抛弃被拒绝的任务。
  - DiscardOldestPolicy：抛弃最老策略。抛弃阻塞队列中最老的任务，相当于就是队列中下一个将要被执行的任务，然后重新提交被拒绝的任务。如果阻塞队列是一个优先队列，那么“抛弃最旧的”策略将导致抛弃优先级最高的任务，因此最好不要将该策略和优先级队列放在一起使用。
  - CallerRunsPolicy：调用者运行策略。在调用者线程中执行该任务。该策略实现了一种调节机制，该策略既不会抛弃任务，也不会抛出异常，而是将任务回退到调用者（调用线程池执行任务的主线程），由于执行任务需要一定时间，因此主线程至少在一段时间内不能提交任务，从而使得线程池有时间来处理完正在执行的任务。

- 常见的阻塞队列有以下几种：

  - ArrayBlockingQueue：基于数组结构的有界阻塞队列，按先进先出对元素进行排序。

  - LinkedBlockingQueue：基于链表结构的有界/无界阻塞队列，按先进先出对元素进行排序，吞吐量通常高于 ArrayBlockingQueue。Executors.newFixedThreadPool 使用了该队列。

  - SynchronousQueue：不是一个真正的队列，而是一种在线程之间移交的机制。要将一个元素放入 SynchronousQueue 中，必须有另一个线程正在等待接受这个元素。如果没有线程等待，并且线程池的当前大小小于最大值，那么线程池将创建一个线程，否则根据拒绝策略，这个任务将被拒绝。使用直接移交将更高效，因为任务会直接移交给执行它的线程，而不是被放在队列中，然后由工作线程从队列中提取任务。只有当线程池是无界的或者可以拒绝任务时，该队列才有实际价值。Executors.newCachedThreadPool使用了该队列。

  - PriorityBlockingQueue：具有优先级的无界队列，按优先级对元素进行排序。元素的优先级是通过自然顺序或 Comparator 来定义的。

**使用队列有什么需要注意的吗？**

使用有界队列时，需要注意线程池满了后，被拒绝的任务如何处理。

使用无界队列时，需要注意如果任务的提交速度大于线程池的处理速度，可能会导致内存溢出。

**线程池都有哪些状态？**

- RUNNING：这是最正常的状态，接受新的任务，处理等待队列中的任务。
- SHUTDOWN：不接受新的任务提交，但是会继续处理等待队列中的任务。
- STOP：不接受新的任务提交，不再处理等待队列中的任务，中断正在执行任务的线程。
- TIDYING：所有的任务都销毁了，workCount 为 0，线程池的状态在转换为 TIDYING 状态时，会执行钩子方法 terminated()。
- TERMINATED：terminated()方法结束后，线程池的状态就会变成这个。

**这几个状态之间是怎么流转的？**

![](current_imgs\ZY2FrWkNnLw.png)

**如何终止线程池？**

终止线程池主要有两种方式：

- shutdown：“温柔”的关闭线程池。不接受新任务，但是在关闭前会将之前提交的任务处理完毕。

- shutdownNow：“粗暴”的关闭线程池，也就是直接关闭线程池，通过 Thread#interrupt() 方法终止所有线程，不会等待之前提交的任务执行完毕。但是会返回队列中未处理的任务。

## 《对线面试官》AQS和ReentrantLock⭐

**面试官**：**你知道什么叫做公平和非公平锁吗**

> **候选者**：公平锁指的就是：在竞争环境下，先到临界区的线程比后到的线程一定更快地获取得到锁
>
> **候选者**：那非公平就很好理解了：先到临界区的线程未必比后到的线程更快地获取得到锁

**面试官**：**如果让你实现的话，你怎么实现公平和非公平锁？**

> **候选者**：公平锁可以把竞争的线程放在一个先进先出的队列上
>
> **候选者**：只要持有锁的线程执行完了，唤醒队列的下一个线程去获取锁就好了
>
> **候选者**：非公平锁的概念上面已经提到了：后到的线程可能比前到临界区的线程获取得到锁
>
> **候选者**：那实现也很简单，线程先尝试能不能获取得到锁，如果获取得到锁了就执行同步代码了
>
> **候选者**：如果获取不到锁，那就再把这个线程放到队列呗
>
> **候选者**：所以公平和非公平的区别就是：线程执行同步代码块时，是否会去尝试获取锁。
>
> **候选者**：如果会尝试获取锁，那就是非公平的。如果不会尝试获取锁，直接进队列，再等待唤醒，那就是公平的。

![图片](current_imgs\640cziohrowntokes.png)

**面试官**：**为什么要进队列呢？线程一直尝试获取锁不就行了么？**

> **候选者**：一直尝试获取锁，专业点就叫做自旋，需要耗费资源的。
>
> **候选者**：多个线程一直在自旋，而且大多数都是竞争失败的，哪有人会这样实现的
>
> **候选者**：不会吧，不会吧，你不会就是这样实现的吧

**面试官**：嗯，讲得挺仔细的。**AQS你了解吗？**

> **候选者**：嗯嗯，AQS全称叫做AbstractQueuedSynchronizer
>
> **候选者**：是可以给我们实现锁的一个「框架」，内部实现的关键就是维护了一个先进先出的队列以及state状态变量
>
> **候选者**：先进先出队列存储的载体叫做Node节点，该节点标识着当前的状态值、是独占还是共享模式以及它的前驱和后继节点等等信息
>
> **候选者**：简单理解就是：AQS定义了模板，具体实现由各个子类完成。
>
> **候选者**：总体的流程可以总结为：会把需要等待的线程以Node的形式放到这个先进先出的队列上，state变量则表示为当前锁的状态。
>
> **候选者**：像ReentrantLock、ReentrantReadWriteLock、CountDownLatch、Semaphore这些常用的实现类都是基于AQS实现的
>
> **候选者**：AQS支持两种模式：一种是独占资源，同一个时刻只能有一个 线程获得竞态资源。比如 ReentrantLock 就是使用这种方式实现排他锁。另一种 是共享资源，同一个时刻，多个线程可以同时获得竞态资源。CountDownLatch 或者 Semaphore 就是使用共享资源的方式，实现同时唤醒多个线程。

![](current_imgs\CLH.png)

**面试官**：**你以ReentrantLock来讲讲加锁和解锁的过程呗**

> **候选者**：以非公平锁为了，我们在外界调用lock方法的时候，源码是这样实现的
>
> **候选者**：1):CAS尝试获取锁，获取成功则可以执行同步代码
>
> **候选者**：2):CAS获取失败，则调用acquire方法，acquire方法实际上就是AQS的模板方法
>
> **候选者**：3):acquire首先会调用子类的tryAcquire方法（又回到了ReentrantLock中）
>
> **候选者**：4):tryAcquire方法实际上会判断当前的state是否等于0，等于0说明没有线程持有锁，则又尝试CAS直接获取锁
>
> **候选者**：5):如果CAS获取成功，则可以执行同步代码
>
> **候选者**：6):如果CAS获取失败，那判断当前线程是否就持有锁，如果是持有的锁，那更新state的值，获取得到锁（这里其实就是处理可重入的逻辑）
>
> **候选者**：7):CAS失败&&非重入的情况，则回到tryAcquire方法执行「入队列」的操作
>
> **候选者**：8):将节点入队列之后，会判断「前驱节点」是不是头节点，如果是头结点又会用CAS尝试获取锁
>
> **候选者**：9):如果是「前驱节点」是头节点并获取得到锁，则把当前节点设置为头结点，并且将前驱节点置空（实际上就是原有的头节点已经释放锁了）
>
> **候选者**：10):没获取得到锁，则判断前驱节点的状态是否为SIGNAL，如果不是，则找到合法的前驱节点，并使用CAS将状态设置为SIGNAL
>
> **候选者**：11):最后调用park将当前线程挂起

**面试官**：你说了一大堆，麻烦使用压缩算法压缩下加锁的过程。

> **候选者**：压缩后：当线程CAS获取锁失败，将当前线程入队列，把前驱节点状态设置为SIGNAL状态，并将自己挂起。

![图片](current_imgs\640csaefwroiwqnofnda.png)

**面试官**：**为什么要设置前驱节点为SIGNAL状态，有啥用？**

> **候选者**：其实就是表示后继节点需要被唤醒
>
> **候选者**：我先把解锁的过程说下吧
>
> **候选者**：1):外界调用unlock方法时，实际上会调用AQS的release方法，而release方法会调用子类tryRelease方法（又回到了ReentrantLock中）
>
> **候选者**：2):tryRelease会把state一直减（锁重入可使state>1），直至到0，当前线程说明已经把锁释放了
>
> **候选者**：3):随后从队尾往前找节点状态需要 < 0，并离头节点最近的节点进行唤醒
>
> **候选者**：唤醒之后，被唤醒的线程则尝试使用CAS获取锁，假设获取锁得到则把头节点给干掉，把自己设置为头节点
>
> **候选者**：解锁的逻辑非常简单哈，把state置0，唤醒头结点下一个合法的节点，被唤醒的节点线程自然就会去获取锁
>
> **面试官**：嗯，了解了。
>
> **候选者**：回到上一个问题，为什么要设置前驱节点为SIGNAL状态
>
> **候选者**：其实归终结底就是为了判断节点的状态，去做些处理。
>
> **候选者**：Node 中节点的状态有4种，分别是：CANCELLED(1)、SIGNAL(-1)、CONDITION(-2)、PROPAGATE(-3)和0
>
> **候选者**：在ReentrantLock解锁的时候，会判断节点的状态是否小于0，小于等于0才说明需要被唤醒
>
> **候选者**：另外一提的是：公平锁的实现与非公平锁是很像的，只不过在获取锁时不会直接尝试使用CAS来获取锁。
>
> **候选者**：只有当队列没节点并且state为0时才会去获取锁，不然都会把当前线程放到队列中

**面试官**：最后画个流程图吧，你画好了，他们会给你点赞和转发的

**候选者**：真的假的？

![图片](current_imgs\640adewerwtdoisfbdio.png)

## 《对线面试官》synchronized⭐

**面试官**：**今天我们来聊聊synchronized吧？**

> **候选者**：嗯嗯嗯，没问题
>
> **候选者**：synchronized是一种互斥锁，一次只能允许一个线程进入被锁住的代码块
>
> **候选者**：synchronized是Java的一个关键字，它能够将代码块/方法锁起来
>
> **候选者**：如果synchronized修饰的是实例方法，对应的锁则是对象实例
>
> **候选者**：如果synchronized修饰的是静态方法，对应的锁则是当前类的Class实例
>
> **候选者**：如果synchronized修饰的是代码块，对应的锁则是传入synchronized的对象实例

![图片](current_imgs\640caefwgdisnv.png)

>  **synchronized作用**
>
> 1. 多线程情况下，同步代码的互斥访问
> 2. 有效的解决了共享变量的可见性问题
> 3. 解决了指令重排序的问题

**面试官**：嗯，**要不你来讲讲synchronized的原理呗？**

> （1）依赖底层JVM的指令，线程执行被synchronized修饰的方法时，通过ACC_SYNCHORNIZED关键字，判断方法是否同步
>
> （2）执行被修饰的代码块时先执行monitorEnter指令
>
> （3）monitor中有一个计数器，初始为0
>
> （4）尝试获取monitor的锁，会先判断计数器的值是否为0
>
> （a）如果为0，则上锁，对monitor的计数器+1（可以锁重入）
>
> （b）如果不为0，且当前线程不是自己，进入block阻塞状态等待
>
> （5）执行完代码退出方法后会执行monitorExit指令，monitor的计数器-1（锁重入时，多次-1，直到为0）
>
> （6）其他处于block阻塞状态的线程尝试获取锁（非公平锁）

**面试官**：嗯，听说synchronized锁在 JDK 1.6 之后做了很多的优化，这块你了解多少呢？

> **候选者**：其实是这样的，在JDK 1.6之前是重量级锁，线程进入同步代码块/方法 时
>
> **候选者**：monitor对象就会把当前进入线程的Id进行存储，设置Mark Word的monitor对象地址，并把阻塞的线程存储到monitor的等待线程队列中
>
> **候选者**：它加锁是依赖底层操作系统的 mutex 相关指令实现，所以会有用户态和内核态之间的切换，性能损耗十分明显
>
> **候选者**：而JDK1.6 以后引入偏向锁和轻量级锁在JVM层面实现加锁的逻辑，不依赖底层操作系统，就没有切换的消耗
>
> **候选者**：所以，Mark Word对锁的状态记录一共有4种：无锁、偏向锁、轻量级锁和重量级锁

![图片](current_imgs\640fdasfafdsnvs.png)

**面试官**：简单来说说偏向锁、轻量级锁和重量级锁吧

> **候选者**：嗯，没问题
>
> **候选者**：偏向锁指的就是JVM会认为只有某个线程才会执行同步代码（没有竞争的环境）
>
> **候选者**：所以在Mark Word会直接记录线程ID，只要线程来执行代码了，会比对线程ID是否相等，相等则当前线程能直接获取得到锁，执行同步代码
>
> **候选者**：如果不相等，则用CAS来尝试修改当前的线程ID，如果CAS修改成功，那还是能获取得到锁，执行同步代码
>
> **候选者**：如果CAS失败了，说明有竞争环境，此时会对偏向锁撤销，升级为轻量级锁。
>
> **候选者**：在轻量级锁状态下，当前线程会在栈帧下创建Lock Record，LockRecord 会把Mark Word的信息拷贝进去，且有个Owner指针指向加锁的对象
>
> **候选者**：线程执行到同步代码时，则用CAS试图将Mark Word的指向到线程栈帧的Lock Record，假设CAS修改成功，则获取得到轻量级锁
>
> **候选者**：假设修改失败，则自旋（重试），自旋一定次数后，则升级为重量级锁
>
> **候选者**：简单总结一下
>
> **候选者**：synchronized锁原来只有重量级锁，依赖操作系统的mutex指令，需要用户态和内核态切换，性能损耗十分明显
>
> **候选者**：重量级锁用到monitor对象，而偏向锁则在Mark Word记录线程ID进行比对，轻量级锁则是拷贝Mark Word到Lock Record，用CAS+自旋的方式获取。

![图片](current_imgs\640cageagobfdos.png)

> **候选者**：引入了偏向锁和轻量级锁，就是为了在不同的使用场景使用不同的锁，进而提高效率。锁只有升级，没有降级
>
> **候选者**：1）只有一个线程进入临界区，偏向锁
>
> **候选者**：2）多个线程交替进入临界区，轻量级锁
>
> **候选者**：3）多线程同时进入临界区，重量级锁

- **锁消除**

  为了保证数据的完整性，在进行操作时需要对这部分操作进行同步控制，但是在有些情况下，JVM检测到不可能存在共享数据竞争，这是JVM会对这些同步锁进行锁消除。

- **锁粗化**

  在使用同步锁的时候，需要让同步块的作用范围尽可能小—仅在共享数据的实际作用域中才进行同步，这样做的目的是 为了使需要同步的操作数量尽可能缩小，如果存在锁竞争，那么等待锁的线程也能尽快拿到锁。

  在大多数的情况下，上述观点是正确的。但是如果一系列的连续加锁解锁操作，可能会导致不必要的性能损耗，所以引入锁粗话的概念。

  锁粗话概念比较好理解，就是将多个连续的加锁、解锁操作连接在一起，扩展成一个范围更大的锁

- **synchronized 和 Lock 有什么区别？**

  首先synchronized是Java内置关键字，在JVM层面，Lock是个Java类；
  synchronized 可以给类、方法、代码块加锁；而 lock 只能给代码块加锁。
  synchronized 不需要手动获取锁和释放锁，使用简单，发生异常会自动释放锁，不会造成死锁；而 lock 需要自己加锁和释放锁，如果使用不当没有 unLock()去释放锁就会造成死锁。
  通过 Lock 可以知道有没有成功获取锁，而 synchronized 却无法办到。

- **synchronized 和 ReentrantLock 的区别**
  - 底层实现：synchronized 是 Java 中的关键字，是 JVM 层面的锁；ReentrantLock 是 JDK 层次的锁实现。
  - 是否需要手动释放：synchronized 不需要手动获取锁和释放锁，在发生异常时，会自动释放锁，因此不会导致死锁现象发生；ReentrantLock 在发生异常时，如果没有主动通过 unLock() 去释放锁，很可能会造成死锁现象，因此使用 ReentrantLock 时需要在 finally 块中释放锁。
  - 锁的公平性：synchronized 是非公平锁；ReentrantLock 默认是非公平锁，但是可以通过参数选择公平锁。
  - 是否可中断：synchronized 是不可被中断的；ReentrantLock 则可以被中断。
  - 灵活性：使用 synchronized 时，等待的线程会一直等待下去，直到获取到锁；ReentrantLock 的使用更加灵活，有立即返回是否成功的，有响应中断、有超时时间等。
  - 性能上：随着近些年 synchronized 的不断优化，ReentrantLock 和 synchronized 在性能上已经没有很明显的差距了，所以性能不应该成为我们选择两者的主要原因。官方推荐尽量使用 synchronized，除非 synchronized 无法满足需求时，则可以使用 Lock。

### volatile⭐

> 思路：作用===>JMM角度说可见性、指令重排===>实现
>
> ?>**volatile 关键字的作用**
>
> 1. 内存可见性
> 2. 防止指令重排
> 3. 不能保证原子性
>
> ?>**JMM角度说可见性、指令重排**
>
> - #### **Java内存的可见性问题**
>
>   Java的内存模型如下图所示。
>
>   ![](current_imgs\v2-92f473a0d68aaf40002ebb774c015d16_1440w.png)
>
>   这里的本地内存并不是真实存在的，只是Java内存模型的一个抽象概念，它包含了控制器、运算器、缓存等。同时Java内存模型规定，线程对共享变量的操作必须在自己的本地内存中进行，不能直接在主内存中操作共享变量。这种内存模型会出现什么问题呢？，
>
>   1. 线程A获取到共享变量X的值，此时本地内存A中没有X的值，所以加载主内存中的X值并缓存到本地内存A中，线程A修改X的值为1，并将X的值刷新到主内存中，这时主内存及本地内存A中的X的值都为1。
>   2. 线程B需要获取共享变量X的值，此时本地内存B中没有X的值，加载主内存中的X值并缓存到本地内存B中，此时X的值为1。线程B修改X的值为2，并刷新到主内存中，此时主内存及本地内存B中的X值为2，本地内存A中的X值为1。
>   3. 线程A再次获取共享变量X的值，此时本地内存中存在X的值，所以直接从本地内存中A获取到了X为1的值，但此时主内存中X的值为2，到此出现了所谓内存不可见的问题。
>
> - #### **为什么代码会重排序？**
>
>   计算机在执行程序的过程中，编译器和处理器通常会对指令进行重排序，这样做的目的是为了提高性能。
>
>   指令重排序一般分为编译器优化重排、指令并行重拍和内存系统重排三种。
>
>   - 编译器优化重排：编译器在不改变单线程程序语义的情况下，可以对语句的执行顺序进行重新排序。
>   - 指令并行重排：现代处理器多采用指令级并行技术来将多条指令重叠执行。对于不存在**数据依赖**的程序，处理器可以对机器指令的执行顺序进行重新排列。
>   - 内存系统重排：因为处理器使用缓存和读/写缓冲区，使得加载（load）和存储（store）看上去像是在乱序执行。
>
>   ------
>
>   - #### **as-if-serial规则和happens-before规则的区别？**
>
>     区别：
>
>     - as-if-serial定义：无论编译器和处理器如何进行重排序，单线程程序的执行结果不会改变。
>     - happens-before定义：一个操作happens-before另一个操作，表示第一个的操作结果对第二个操作可见，并且第一个操作的执行顺序也在第二个操作之前。但这并不意味着Java虚拟机必须按照这个顺序来执行程序。如果重排序的后的执行结果与按happens-before关系执行的结果一致，Java虚拟机也会允许重排序的发生。
>     - happens-before关系保证了同步的多线程程序的执行结果不被改变，as-if-serial保证了单线程内程序的执行结果不被改变。
>
>     相同点：happens-before和as-if-serial的作用都是在不改变程序执行结果的前提下，提高程序执行的并行度。
>
> ?>**实现**
>
> - #### **volatile实现内存可见性原理**
>
>   > 导致内存不可见的主要原因就是Java内存模型中的本地内存和主内存之间的值不一致所导致，例如上面所说线程A访问自己本地内存A的X值时，但此时主内存的X值已经被线程B所修改，所以线程A所访问到的值是一个脏数据。那如何解决这种问题呢？
>
>   volatile可以保证内存可见性的关键是volatile的读/写实现了缓存一致性，缓存一致性的主要内容为：
>
>   - 每个处理器会通过嗅探总线上的数据来查看自己的数据是否过期，一旦处理器发现自己缓存对应的内存地址被修改，就会将当前处理器的缓存设为无效状态。此时，如果处理器需要获取这个数据需重新从主内存将其读取到本地内存。
>   - 当处理器写数据时，如果发现操作的是共享变量，会通知其他处理器将该变量的缓存设为无效状态。
>
>   那缓存一致性是如何实现的呢？可以发现通过volatile修饰的变量，生成汇编指令时会比普通的变量多出一个Lock指令，这个Lock指令就是volatile关键字可以保证内存可见性的关键，它主要有两个作用：
>
>   - 将当前处理器缓存的数据刷新到主内存。
>   - 刷新到主内存时会使得其他处理器缓存的该内存地址的数据无效。
>
> - #### **volatile实现有序性原理**
>
>   > 前面提到重排序可以提高代码的执行效率，但在多线程程序中可以导致程序的运行结果不正确，那volatile是如何解决这一问题的呢？
>
>   为了实现volatile的内存语义，编译器在生成字节码时会通过插入内存屏障来禁止指令重排序。
>
>   内存屏障：内存屏障是一种CPU指令，它的作用是对该指令前和指令后的一些操作产生一定的约束，保证一些操作按顺序执行。
>
>   > 为了实现volatile的内存语义，编译器在生成字节码时，会在指令序列中插入内存屏障来禁止特定类型的处理器重排序，下面是基于保守策略的JMM内存平展插入策略。
>
>   ```
>   * 在每个volatile写操作的前面插入一个StoreStore屏障。`
>   `* 在每个volatile写操作的后面插入一个StoreLoad屏障。`
>   `* 在每个volatile读操作的后面插入一个LoadLoad屏障。`
>   `* 在每个volatile读操作的后面插入一个LoadStore屏障。
>   ```

## 《对线面试官》CAS⭐

> ?>**最终回答：先从比较和交换的角度去聊清楚，在Java端聊到native方法，然后再聊到C++中的cmpxchg的指令，再聊到lock指令保证cmpxchg原子性**
>
> - **什么是 CAS**
>
>   CAS 是 compare and swap 的缩写，即我们所说的比较交换。
>
>   cas 是一种基于锁的操作，而且是乐观锁。在 java 中锁分为乐观锁和悲观锁。悲观锁是将资源锁住，等一个之前获得锁的线程释放锁之后，下一个线程才可以访问。而乐观锁采取了一种宽泛的态度，通过某种方式不加锁来处理资源，比如通过给记录加 version 来获取数据，性能较悲观锁有很大的提高。
>
>   CAS 操作包含三个操作数 —— 内存位置（V）、预期原值（A）和新值(B)。如果内存地址里面的值和 A 的值是一样的，那么就将内存里面的值更新成 B。CAS是通过无限循环来获取数据的，若果在第一轮循环中，a 线程获取地址里面的值被b 线程修改了，那么 a 线程需要自旋，到下次循环才有可能机会执行。
>
> - #### CAS原理
>
>   java.util.concurrent.atomic 包下的类大多是使用 CAS 操作来实现的(AtomicInteger，AtomicBoolean，AtomicLong)。
>
>   我们以java.util.concurrent中的AtomicInteger为例
>
>   getAndIncrement采用了CAS操作，每次从内存中读取数据然后将此数据和+1后的结果进行CAS操作，如果成功就返回结果，否则重试直到成功为止。而compareAndSet利用unsafe的compareAndSwapInt方法实现的。
>
>   Unsafe是CAS的核心类。因为Java无法直接访问底层操作系统，而是通过本地（native）方法来访问。不过尽管如此，JVM还是开了一个后门，JDK中有一个类Unsafe，它提供了硬件级别的原子操作。
>   
>   
>
>   而硬件级别的原子操作，
>
>   拿比较常见的x86架构的CPU来说，其实 **CAS 操作通常使用 cmpxchg 指令实现的。**
>
>   可是为啥cmpxchg 指令能保证原子性呢？主要是有以下几个方面的保障：
>
>   \1.  cmpxchg 指令是一条原子指令。**在 CPU 执行 cmpxchg 指令时，处理器会自动锁定总线，防止其他 CPU 访问共享变量，然后执行比较和交换操作，最后释放总线。**
>
>   \2. cmpxchg 指令在执行期间，**CPU 会自动禁止中断**。这样可以确保 CAS 操作的原子性，避免中断或其他干扰对操作的影响。
>
>   \3.  cmpxchg 指令是硬件实现的，可以保证其原子性和正确性。CPU 中的硬件电路确保了 cmpxchg 指令的正确执行，以及对共享变量的访问是原子的。
>
>   **所以，在操作系统层面，CAS还是会加锁的，通过加锁的方式锁定总线，避免其他CPU访问共享变量。**
>
> 
>
> - #### CAS的常见问题
>
>   1、ABA 问题：
>
>   比如说一个线程 one 从内存位置 V 中取出 A，这时候另一个线程 two 也从内存中取出 A，并且 two 进行了一些操作变成了 B，然后 two 又将 V 位置的数据变成 A，这时候线程 one 进行 CAS 操作发现内存中仍然是 A，然后 one 操作成功。尽管线程 one 的 CAS 操作成功，但可能存在潜藏的问题。
>
>   JDK 中 java.util.concurrent.atomic 并发包下，提供了 AtomicStampedReference，通过为引用建立个 Stamp 类似版本号的方式，确保 CAS 操作的正确性。
>
>   2、循环时间长开销大：
>
>   对于资源竞争严重（线程冲突严重）的情况，CAS 自旋的概率会比较大，从而浪费更多的 CPU 资源，效率低于 synchronized。
>
>   3、只能保证一个共享变量的原子操作：
>
>   当对一个共享变量执行操作时，我们可以使用循环 CAS 的方式来保证原子操作，但是对多个共享变量操作时，循环 CAS 就无法保证操作的原子性，这个时候就可以用锁。

------



### ReentrantReadWriteLock如何实现的读写锁

> 如果一个操作写少读多，还用互斥锁的话，性能太低，因为读读不存在并发问题。
>
> 怎么解决啊，有读写锁的出现。
>
> ReentrantReadWriteLock也是基于AQS实现的一个读写锁，但是锁资源用state标识。
>
> 如何基于一个int来标识两个锁信息，有写锁，有读锁，怎么做的？
>
> 一个int，占了32个bit位。
>
> 在写锁获取锁时，基于CAS修改state的低16位的值。
>
> 在读锁获取锁时，基于CAS修改state的高16位的值。
>
> 写锁的重入，基于state低16直接标识，因为写锁是互斥的。
>
> 读锁的重入，无法基于state的高16位去标识，因为读锁是共享的，可以多个线程同时持有。所以读锁的重入用的是ThreadLocal来表示，同时也会对state的高16为进行追加。

### JDK提供的并发容器总结

> JDK提供的这些容器大部分在 java.util.concurrent 包中
>
> - ConcurrentHashMap: 线程安全的HashMap
> - CopyOnWriteArrayList: 线程安全的List，在读多写少的场合性能非常好，远远好于Vector.
> - ConcurrentLinkedQueue: 高效的并发队列，使用链表实现。可以看做一个线程安全的 LinkedList，这是一个非阻塞队列。
> - BlockingQueue: 这是一个接口，JDK内部通过链表、数组等方式实现了这个接口。表示阻塞队列，非常适合用于作为数据共享的通道。
> - ConcurrentSkipListMap: 跳表的实现。这是一个Map，使用跳表的数据结构进行快速查找。

