# Jvm调优

### 1、排查内存溢出

> - **构建问题环境、并测试**
>
>   ```java
>       // 占用内存的BUG 代码测试
>   	public void test() throws InterruptedException {
>           log.info("创建一个大对象测试");
>           List<byte[]> arr = new ArrayList<>();
>           while (true) {
>               log.info("添加一个对象");
>               arr.add(new byte[1024 * 1024 * 10]);
>               Thread.sleep(300);
>           }
>       }
>   ```
>
>   ![](jvm\01.jpg)
>
> - **排查问题**
>
>   使用`arthas`连接到该应用，先使用`dashboard`查看下当前内存使用情况
>
>   ![](jvm\02.jpg)
>
>   **可以看到堆的使用率，以及老年代的使用率都接近满的状态了，如果我们应用没有大的对象，那就是肯定某个对象站用了大量的空间。**
>
>   `解决`
>
>   1. 使用 arthas 生成内存分区的火焰图
>
>      ```bash
>      # 使用arthas生成内存分区的火焰图
>      [arthas@1]$ profiler start --event alloc
>      Profiling started
>      
>      # 获取已采集的 sample 的数量
>      [arthas@1]$ profiler getSamples
>      377
>      
>      # 停止 profiler，生成 html 格式结果
>      [arthas@1]$ profiler stop --format html --file /arthas-output/output.html
>      OK
>      profiler output file: /arthas-output/output.html
>      ```
>
>      将output.html文件从生产环境导出到本地，用浏览器打开
>
>      ```bash
>      [root@base-frame ~]# docker cp app-account:/arthas-output/output.html ./output.html
>      Successfully copied 37.4kB to /root/output.html
>      [root@base-frame ~]# 
>      ```
>
>      可以看到是一个调用链，下面就要看每个链的末尾，具体时哪个地方占用的内存
>
>      ![](jvm\03.jpg)
>
>      从上面应该可以得到问题所在，是在`com/mmdz/web/user/rest/TestLimiterRest.test`方法，并且和`byte[]`有关，查看这个地方的代码，应该不难看出问题了。
>
>      ![](jvm\04.jpg)
>
>   2. 还可以使用`heapdump`将此时的`hprof`快照文件导出，可以使用 jdk 自带的VisualVM工具（**jvisualvm**）来进行分析工具再进行分析，是不是还是将问题定位到上面的地方
>
>      ```bash
>      # 类似 jmap 命令的 heap dump 功能。
>      [arthas@1]$ heapdump /arthas-output/heapdump.hprof
>      Dumping heap to /arthas-output/heapdump.hprof ...
>      Heap dump file created
>      [arthas@1]$ 
>      ```
>      
>      将heapdump.hprof文件从生产环境导出到本地，用 **jvisualvm** 打开（`注意：测试时间不要太长，否则生成的快照文件很大，分析工具可能打开不了`）
>      
>      ```bash
>      [root@base-frame ~]# docker cp app-account:/arthas-output/heapdump.hprof ./heapdump.hprof
>      Successfully copied 1.09GB to /root/heapdump.hprof
>      [root@base-frame ~]# 
>      ```
>      
>      - **选择文件点击装入，然后加载要分析的hprof文件**
>      
>        ![](jvm\05.jpg)
>      
>        ![](jvm\06.jpg)
>      
>      - **选择类，然后对堆内存大小进行排序，双击可以查看具体类型的实例内存占用情况**
>      
>        ![](jvm\07.jpg)
>      
>      - **线程中显示**
>      
>        ![](jvm\08.jpg)
>      
>        ![](jvm\09.jpg)
>



### 2、排查线程cpu使用率高

> 在实际生产环境应用中，可能还会出现线程的cpu使用率占用也别高，导致资源耗费殆尽，程序运行缓慢，这种情况arthas也可以方便的帮我们定位问题所在。
>
> - **构建问题环境**
>
>   ```java
>       ThreadPoolExecutor executor = new ThreadPoolExecutor(
>               10,
>               15,
>               2,
>               TimeUnit.SECONDS,
>               new LinkedBlockingDeque<>(50),
>               new ThreadPoolExecutor.CallerRunsPolicy()
>       );
>   
>       @SaCheckRole(WeChatConstant.WECHAT_ROLE)
>       @GetMapping("/cpuUsageRate")
>       public String cpuUsageRate() {
>           executor.submit(() -> {
>               int i = 0;
>               while (true) {
>                   i = i++ * 10 + 5;
>                   System.out.println(i);
>               }
>           });
>           return "success";
>       }
>   ```
>
>   上面声明了一个线程池，每次使用线程就从这个里面取，在cpuUsageRate接口中，写了一个死循环，每次都对i进行计算，程序运行起来，肯定cpu的使用率特别高。
>
> - **排查问题**
>
>   启动应用，调用cpuUsageRate接口。
>
>   ![](jvm\10.jpg)
>
>   下面在使用thread 查看下总体线程的使用：
>
>   ![](jvm\11.jpg)
>
>   依然是有一个线程使用率达到100%，查看这个线程的具体信息：
>
>   ![](jvm\12.jpg)
>
>   我们看下程序：
>
>   ![](jvm\13.jpg)
>
>   正是我们这个线程写的死循环占用了大量cpu的资源。
>
>   **我们也可以使用thread -n 2 查看前两个占用高的线程，结果也是一样**



### 3、线程死锁

> 线程死锁也是一个非常头疼的问题，不仅锁住了资源，还会导致线程无法释放，持续占用资源，使用arthas我们可以快速定位问题
>
> - **构建问题环境**
>
>   ```java
>       ThreadPoolExecutor executor = new ThreadPoolExecutor(
>               10,
>               15,
>               2,
>               TimeUnit.SECONDS,
>               new LinkedBlockingDeque<>(50),
>               new ThreadPoolExecutor.CallerRunsPolicy()
>       );
>   
>       @SaCheckRole(WeChatConstant.WECHAT_ROLE)
>       @GetMapping("/threadLock")
>       public String threadLock() {
>           Object resourceA = new Object();
>           Object resourceB = new Object();
>           executor.submit(() -> {
>               synchronized (resourceA) {
>                   try {
>                       TimeUnit.SECONDS.sleep(1);
>                   } catch (InterruptedException e) {
>                       e.printStackTrace();
>                   }
>                   synchronized (resourceB) {
>                   }
>               }
>           });
>           executor.submit(() -> {
>               synchronized (resourceB) {
>                   try {
>                       TimeUnit.SECONDS.sleep(1);
>                   } catch (InterruptedException e) {
>                       e.printStackTrace();
>                   }
>                   synchronized (resourceA) {
>                   }
>               }
>           });
>           return "success";
>       }
>   ```
>
>   上面在第一个线程中首先锁住了resourceA，第二个线程首先锁住了resourceB，然后等待1s的时候，第一个线程再去获取resourceB的锁，第二个线程再去获取resourceA的锁，这显然已经出现死锁了。
>
> - **排查问题**
>
>   调用threadLock接口，使用dashboard查看下总体的情况：
>
>   ![](jvm\14.jpg)
>
>   发现有两个 BLOCKED 状态的线程了。
>
>   这里说下线程的状态：
>
>   ```
>   RUNNABLE 运行中
>   
>   TIMED_WAITIN 调用了以下方法的线程会进入TIMED_WAITING：
>    - Thread#sleep()
>    - Object#wait() 并加了超时参数
>    - Thread#join() 并加了超时参数
>    - LockSupport#parkNanos()
>    - LockSupport#parkUntil()
>    
>   WAITING 当线程调用以下方法时会进入WAITING状态：
>    - Object#wait() 而且不加超时参数
>    - Thread#join() 而且不加超时参数
>    - LockSupport#park()
>   
>   BLOCKED 阻塞，等待锁
>   ```
>
>   下面使用 `thread -b` 让arthas 帮我们定位死锁的位置：
>
>   ![](jvm\15.jpg)
>
>   这里直接定位到了两个线程有死锁，并给出了位置
>
>   ![](jvm\16.jpg)



### 4、 Full GC频率高

> 相对来说，这种情况是最容易出现的，尤其是新功能上线时。对于Full GC较多的情况，其主要有如下两个特征：
>
> - 线上多个线程的CPU都超过了100%，通过jstack命令可以看到这些线程主要是垃圾回收线程
> - 通过jstat命令监控GC情况，可以看到Full GC次数非常多，并且次数在不断增加。



### 5、不定期出现的接口耗时现象

> 对于这种情况，比较典型的例子就是，我们某个接口访问经常需要2~3s才能返回。
>
> 这是比较麻烦的一种情况，因为一般来说，其消耗的CPU不多，而且占用的内存也不高，也就是说，我们通过上述两种方式进行排查是无法解决这种问题的。
>
> 而且由于这样的接口耗时比较大的问题是不定时出现的，这就导致了我们在通过 `jstack`命令即使得到了线程访问的堆栈信息，我们也没法判断具体哪个线程是正在执行比较耗时操作的线程。
>
> 对于不定时出现的接口耗时比较严重的问题，我们的定位思路基本如下：
>
> 首先找到该接口，通过压测工具不断加大访问力度，如果说该接口中有某个位置是比较耗时的，由于我们的访问的频率非常高，那么大多数的线程最终都将阻塞于该阻塞点
>
> 这样通过多个线程具有相同的堆栈日志，我们基本上就可以定位到该接口中比较耗时的代码的位置。
