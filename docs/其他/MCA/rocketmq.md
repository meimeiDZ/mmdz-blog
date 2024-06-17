# ReocketMQ

## docker 安装rocketmq

### 创建namesrv服务

> 1. 拉取镜像
>
>    ?>搜索[RocketMQ](https://so.csdn.net/so/search?q=RocketMQ&spm=1001.2101.3001.7020)的镜像，可以通过docker的hub.docker.com上进行搜索。也可以命令搜索：docker search rocketMq
>
>    ```shell
>    #拉取镜像（官方发布的镜像（foxiswho/rocketmq））
>    docker pull foxiswho/rocketmq:server-4.7.0 
>    docker pull foxiswho/rocketmq:broker-4.7.0 
>    ```
>
> 2. 创建namesrv数据存储路径
>
>    ```shell
>    # 创建namesrv数据存储路径
>    mkdir -p /mydata/rocketmq/data/namesrv/logs /mydata/rocketmq/data/namesrv/store
>    ```
>
> 3. 构建namesrv容器
>    ```she
>    docker run -d \
>    --restart=always \
>    --name rmqnamesrv \
>    -p 9876:9876 \
>    -v /mydata/rocketmq/data/namesrv/logs:/root/logs \
>    -v /mydata/rocketmq/data/namesrv/store:/root/store \
>    -e "MAX_POSSIBLE_HEAP=100000000" \
>    foxiswho/rocketmq:server-4.7.0 \
>    sh mqnamesrv 
>    ```
>
>    !>**参数说明**
>
>    - -restart=always| docker重启时候容器自动重启
>    - -name rmqnamesrv | 把容器的名字设置为rmqnamesrv
>    - -p 9876:9876| 把容器内的端口9876挂载到宿主机9876上面
>    - -v /docker/rocketmq/data/namesrv/logs:/root/logs | 把容器内的/root/logs日志目录挂载到宿主机的 /docker/rocketmq/data/namesrv/logs目录
>    - -v /docker/rocketmq/data/namesrv/store:/root/store | 把容器内的/root/store数据存储目录挂载到宿主机的 /docker/rocketmq/data/namesrv目录
>    - rmqnamesrv | 容器的名字
>    - -e “MAX_POSSIBLE_HEAP=100000000” | 设置容器的最大堆内存为100000000
>    - rocketmqinc/rocketmq | 使用的镜像名称
>    - sh mqnamesrv | 启动namesrv服务

### 创建broker节点

> 1. 创建broker数据存储路径
>
>    ```shell
>    mkdir -p /mydata/rocketmq/data/broker/logs /mydata/rocketmq/data/broker/store /mydata/rocketmq/conf
>    ```
>
> 2. 编辑配置文件
>
>    ```shell
>    vim /mydata/rocketmq/conf/broker.conf
>    ```
>
>    broker.conf
>
>    ```shell
>    # 所属集群名称，如果节点较多可以配置多个
>    brokerClusterName = DefaultCluster
>    #broker名称，master和slave使用相同的名称，表明他们的主从关系
>    brokerName = broker-a
>    #0表示Master，大于0表示不同的slave
>    brokerId = 0
>    #表示几点做消息删除动作，默认是凌晨4点
>    deleteWhen = 04
>    #在磁盘上保留消息的时长，单位是小时
>    fileReservedTime = 48
>    #有三个值：SYNC_MASTER，ASYNC_MASTER，SLAVE；同步和异步表示Master和Slave之间同步数据的机制；
>    brokerRole = ASYNC_MASTER
>    #刷盘策略，取值为：ASYNC_FLUSH，SYNC_FLUSH表示同步刷盘和异步刷盘；SYNC_FLUSH消息写入磁盘后才返回成功状态，ASYNC_FLUSH不需要；
>    flushDiskType = ASYNC_FLUSH
>    # 设置broker节点所在服务器的ip地址
>    brokerIP1 = 192.168.10.110
>    # 磁盘使用达到95%之后,生产者再写入消息会报错 CODE: 14 DESC: service not available now, maybe disk full
>    diskMaxUsedSpaceRatio=95
>    ```
>
> 3. 构建broker容器
>
>    ```shell
>    docker run -d  \
>    --restart=always \
>    --name rmqbroker \
>    --link rmqnamesrv:namesrv \
>    -p 10911:10911 \
>    -p 10909:10909 \
>    -v /mydata/rocketmq/data/broker/logs:/root/logs \
>    -v /mydata/rocketmq/data/broker/store:/root/store \
>    -v /mydata/rocketmq/conf/broker.conf:/opt/rocketmq-4.7.0/conf/broker.conf \
>    -e "NAMESRV_ADDR=namesrv:9876" \
>    -e "MAX_POSSIBLE_HEAP=200000000" \
>    foxiswho/rocketmq:broker-4.7.0 \
>    sh mqbroker -c /opt/rocketmq-4.7.0/conf/broker.conf 
>    ```
>
>    !>**参数说明**
>
>    - -d | 以守护进程的方式启动
>    - –restart=always | docker重启时候镜像自动重启
>    - -name rmqbroker | 把容器的名字设置为rmqbroker
>    - –link rmqnamesrv:namesrv | 和rmqnamesrv容器通信
>    - -p 10911:10911 | 把容器的非vip通道端口挂载到宿主机
>    - -p 10909:10909 | 把容器的vip通道端口挂载到宿主机
>    - -e “NAMESRV_ADDR=namesrv:9876” | 指定namesrv的地址为本机namesrv的ip地址:9876
>    - -e “MAX_POSSIBLE_HEAP=200000000” rocketmqinc/rocketmq sh mqbroker | 指定broker服务的最大堆内存
>    - rocketmqinc/rocketmq | 使用的镜像名称
>    - sh mqbroker -c /opt/rocketmq-4.4.0/conf/broker.conf | 指定配置文件启动broker节点

### 创建rockermq-console服务

> ```shell
> #拉取镜像 
> docker pull styletang/rocketmq-console-ng:1.0.0
> ```
>
> RocketMQ提供了UI管理工具，名为rocketmq-console，我们选择docker安装
>
> ```shell
> # 创建rockermq-console服务
> # 需要把192.168.10.110换成部署namesrv机器地址
> docker run -d \
> --restart=always \
> --name mqconsole \
> -e "JAVA_OPTS=-Drocketmq.namesrv.addr=192.168.10.110:9876 \
> -Dcom.rocketmq.sendMessageWithVIPChannel=false" \
> -p 9999:8080 \
> styletang/rocketmq-console-ng:1.0.0
> ```
>
> !>**参数说明**
>
> - -restart=always| docker重启时候镜像自动重启
> - -name mqconsole| 把容器的名字设置为mqconsole
> - -e “JAVA_OPTS=-Drocketmq.namesrv.addr=192.168.10.110:9876 | 设置namesrv服务的ip地址
> - -Dcom.rocketmq.sendMessageWithVIPChannel=false” | 不使用vip通道发送消息
> - –p 9999:8080 | 把容器内的端口8080挂载到宿主机上的9999端口
>
> 通过浏览器进行访问：http://192.168.10.110:9999/

!>注意：需要关闭防火墙或者开放namesrv和broker端口

> 如果不设置,控制台服务将无法访问namesrv服务，异常信息如下：
> org.apache.rocketmq.remoting.exception.RemotingConnectException: connect to failed
>
> ```shell
> # 关闭防火墙
> systemctl stop firewalld.service
> 
> # 开放指定端口
> firewall-cmd --permanent --zone=public --add-port=9876/tcp
> firewall-cmd --permanent --zone=public --add-port=10911/tcp
> 
> # 立即生效
> firewall-cmd --reload
> ```