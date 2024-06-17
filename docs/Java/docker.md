# Docker



### 常用命令

<!-- tabs:start -->

#### **基础命令**

```bash
# 启动docker
systemctl start docker

# 关闭docker
systemctl stop docker

# 重启docker
systemctl restart docker

# docker 设置随服务启动而自启动
systemctl enable docker

# 查看 docker 运行状态
systemctl status docker

# 查看 docker 版本号信息
docker version
docker info

# docker 帮助命令
docker --help
```

#### **镜像命令**

```bash
# 查看自己服务器中docker 镜像列表
docker images

参数：
    -a：列出本地所有的镜像（含中间映像层）
    -q：只显示镜像ID
    --digests：显示镜像的摘要信息
    --no-trunc：显示完整的镜像信息

# 删除镜像
docker rmi -f 镜像id					   # 删除单个镜像
docker rmi -f 镜像名A:tag 镜像名B:tag 	  # 删除单个镜像
docker rmi -f $(docker images -aq) 		# 删除单个镜像

# 下载镜像
docker pull redis 等价于 docker pull redis:latest

# 搜索镜像【在Docker Hub（或其他镜像仓库如阿里镜像）仓库中搜索关键字的镜像】
docker search 镜像id或name

参数：
	--no-trunc： 显示完整的镜像描述
	-s： 列出收藏数 不小于 指字值的镜像
	--automated： 只列出 automated build 类型的镜像

```

#### **容器命令**

```shell
# 查看运行容器
docker ps   		 # 列出运行中的容器
docker ps -a 		# 查看所有容器，包括未运行

# 常用操作
docker start 容器id或name		# 启动已停止的容器
docker inspect 容器id			# 查看容器的所有信息
docker container logs 容器id	 # 查看容器日志
docker top 容器id  			  # 查看容器里的进程

# 删除容器
docker stop 容器id或name 	# 停止容器
docker kill 容器id  		 # 强制停止容器
docker rm 容器id或name       # 删除已停止的容器
docker rm -f 容器id          # 删除正在运行的容器

# 进入/退出 容器
docker exec -it 容器ID sh 			# 进入容器
docker exec -it 容器id /bin/bash 	 # 进入容器
exit 							 	# 退出容器

# 容器内拷贝文件
docker cp  容器ID:容器内路径 目的主机路径

例如： docker cp 3065f084c80d:a.txt a.txt


# 导入/导出
docker export 容器ID > 文件名.tar.gz								# 导出容器
cat 文件名.tar.gz | docker import - 镜像用户/镜像名:镜像版本号		# 导入容器

```

<!-- tabs:end -->



### 占用多少CPU、内存等资源

> - 使用`docker stats`命令查看
>
>   ```bash
>   CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O         PIDS
>   4169e61a371c   xxl-job-admin            0.35%     556.8MiB / 7.622GiB   7.13%     781kB / 593kB    235MB / 0B         50
>   3f6aa78d4ab4   jenkins                 0.39%     487.6MiB / 7.622GiB   6.25%     1.09kB / 0B      298MB / 244kB      56
>   830ea42d2d89   base-rocket-broker1      9.72%     688.1MiB / 7.622GiB   8.82%     105kB / 83.9kB   87.4MB / 40.3MB     98
>   b4b2b5e14497   base-rocket-dashboard    0.39%     691.7MiB / 7.622GiB   8.86%     417kB / 433kB    250MB / 38.5MB      49
>   0f3329520e01   base-rocket-server       0.19%     248.1MiB / 7.622GiB   3.18%     434kB / 417kB    129MB / 0B         41
>   111bb38daf59   base-nacos              0.71%     812.4MiB / 7.622GiB   10.41%    2.09kB / 750B    326MB / 0B         84
>   803e5cd06280   base-redis              0.39%     7.621MiB / 7.622GiB   0.10%     1.09kB / 0B      31MB / 0B          5
>   157d948952fb   base-mysql              0.50%     381.4MiB / 7.622GiB   4.89%     1.09kB / 0B      276MB / 27.9MB     37
>   ```
>
>   *<u>内容解释</u>*
>
>   | 栏名                     | 描述                                       |
>   | ------------------------ | ------------------------------------------ |
>   | `CONTAINER ID` 和 `NAME` | 容器的ID和名称                             |
>   | `CPU %` 和 `MEM %`       | 容器正在使用的主机CPU和内存的百分比        |
>   | `MEM USAGE / LIMIT`      | 容器正在使用的总内存以及允许使用的总内存量 |
>   | `NET I/O`                | 容器通过其网络接口发送和接收的数据量       |
>   | `BLOCK I/O`              | 容器已从主机上的块设备读取和写入的数据量   |
>   | `PIDS`                   | 容器创建的进程或线程数                     |
>
> - 使用`top`命令查看
>
>   ```bash
>   # 找到容器的 container id
>   docker ps -a
>   
>   # 获得容器对应的 pid
>   docker top 容器ID / docker inspect 容器ID
>   
>   # 使用top、pmap、ps等查看进程内存的命令查看容器的内存占用情况
>   top -p 2889
>   
>   
>   # ############################################################
>   # 实际展示信息
>   [root@mmdz-cloud ~]# top -p 2889
>   top - 15:30:09 up  3:41,  2 users,  load average: 0.01, 0.04, 0.12
>   Tasks:   1 total,   0 running,   1 sleeping,   0 stopped,   0 zombie
>   %Cpu(s):  0.2 us,  0.5 sy,  0.0 ni, 99.2 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
>   KiB Mem :  7992340 total,  1997104 free,  4399656 used,  1595580 buff/cache
>   KiB Swap:  4190204 total,  4190204 free,        0 used.  3166580 avail Mem 
>   
>      PID USER      PR  NI    VIRT    RES    SHR  S  %CPU  %MEM  TIME+   COMMAND                                                                                                                     
>     2889 polkitd   20  0   2191488  392220  19476 S   1.0  4.9   2:54.69 mysqld 
>   ```
>
>   *<u>内容解释</u>*
>
>   | **PID**  | **USER**   | **PR**                           | **NInice** | **VIRT**           | **RES**            | **SHR**            |                            **S**                             | **%CPU**            | **%MEM**                           | **TIME+**                                                | **COMMAND**      |
>   | -------- | ---------- | -------------------------------- | ---------- | ------------------ | ------------------ | ------------------ | :----------------------------------------------------------: | ------------------- | ---------------------------------- | -------------------------------------------------------- | ---------------- |
>   | 进程的ID | 进程所有者 | 进程的优先级别，越小越优先被执行 | 值         | 进程占用的虚拟内存 | 进程占用的物理内存 | 进程使用的共享内存 | 进程的状态。S表示休眠，R表示正在运行，Z表示僵死状态，N表示该进程优先值为负数 | 进程占用CPU的使用率 | 进程使用的物理内存和总内存的百分比 | 该进程启动后占用的总的CPU时间，即占用CPU使用时间的累加值 | 进程启动命令名称 |
>
>   



### 网络模式

> [!tip]
>
> 首先Docker网络模式有`Bridge模式`、`Host模式`、`Container模式`、`None模式`，一共四种

<!-- tabs:start -->

#### **Bridge**

> 当Docker进程启动时，会在主机上创建一个名为Docker0的虚拟网桥，此主机上启动的Docker容器默认会连接到这个虚拟网桥上。虚拟网桥的工作方式和物理交换机相似，这样主机上的所有容器就通过交换机连在了一个二层网络中。从docker0子网中分配一个IP给容器使用，并设置docker0的IP地址为容器的默认网关。在主机上创建一对虚拟网卡veth pair设备，Docker将veth pair设备的一端放在新创建的容器中，并命名为eth0(容器内部网卡)，另一端在放在主机中，以vethxxx这样类似的名称命名，并将这个网络设备加入到docker0网桥中。可以使用brctl show命令查看
>

#### **Host**

> 如果启动容器的时候使用host模式，那么这个容器将不会获取一个独立的Network Namespace，而是和宿主机共用一个Network Namespace(这里和我们平常使用的虚拟机的仅主机模式相似)。容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的IP和端口。但是，容器的其他方便，如文件系统、系统进程等还是和宿主机隔离的
>

#### **Container**

> 这个模式指定新创建的容器和已经存在的容器共享一个Network Namespace，而不是和宿主机共享。新创建的容器也不会自己创建网卡，IP等。而是和一个指定的容器共享IP、端口范围等。同样，两个容器除了网络方面，其他的还都是属于隔离。两个容器的进程可以通过宿主机的lo网卡设备进行通信
>

#### **None**

> 使用`none`模式，Docker容器拥有自己的Network Namespace，但是，并不为Docker容器进行任何网络配置。也就是说，这个Docker容器没有网卡、IP、路由等信息。需要我们自己为Docker容器添加网卡、配置IP等
>

<!-- tabs:end -->

?> **如果有多个容器之间需要互相通信，推荐使用`Docker Compose`或者使用`k8s`编排工具**
