# 环境搭建

?>所有环境都会在Linux操作系统下去搭建，所以需要对Linux的基本操作、Docker以及Docker-Compose了解（需要搭建的底层支持有MySQL，Nacos，Redis，rabbitMQ，Elasticsearch，Kibana，Jenkins）

------

## Docker&Docker-Compose

### Docker安装

> * 下载Docker依赖的组件
>
>   ```shell
>   yum -y install yum-utils device-mapper-persistent-data lvm2
>   ```
>
> * 设置下载Docker服务的镜像源，设置为阿里云
>
>   ```shell
>   yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
>   ```
>
> * 安装Docker服务
>
>   ```shell
>   yum -y install docker-ce
>   ```
>
> * 安装成功后，需要启动docker服务，并且设置docker是开机自启项
>
>   ```shell
>   # 启动docker服务
>   systemctl start docker
>   # 设置开机自动启动docker
>   systemctl enable docker
>   ```
>
> * 测试安装结果
>
>   ```shell
>   docker version
>   ```

### Docker-Compose安装

> * 下载Docker-Compose：https://github.com/docker/compose/releases/tag/v2.10.0
>
> * 下载的是：![image.png](imgs\bb725485c765408eb66d06b641d528ce.png)
>
> * 下载完毕后，将脚本直接拖拽到Linux操作系统中
>
> * 先赋予docker-compose文件一个可执行的权限
>
>   ```shell
>   chmod a+x docker-compose-linux-x86_64
>   ```
>
> * 将拥有可执行权限的docker-compose文件移动到系统默认的环境变量的PATH目录中
>
>   ```shell
>   mv docker-compose-linux-x86_64 /usr/bin/docker-compose
>   ```
>
> * 测试一下功能
>
>   ```shell
>   docker-compose version
>   ```
>
>   ![image.png](imgs\e309e3a631e64c17be56f6f0d92bed9e.png)
>

------

## MySQL安装

> MySQL这里选择的5.7.24的版本
>
> 在 `/mydata/docker/` 下构建了 `mysql_docker` 的目录，在里面准备 `docker-compose.yml`
>
> ![](imgs\1682786762.jpg)
>
> ```yml
> version: '3.1'
> services:
>   mysql:
>     image: mysql:5.7.24
>     container_name: mysql
>     ports:
>       - 3306:3306
>     environment:
>       - MYSQL_ROOT_PASSWORD=root
>     volumes:
>       - ./data/:/var/lib/mysql/
> ```
>
> 使用 Compose 命令构建和运行您的应用
>
> ```shell
> # 如果你想在后台执行该服务可以加上 -d 参数
> docker-compose up -d
> ```
>
> **docker安装的MySQL默认root用户是允许远程连接的**
>
> 如果你无法正常连接，需要看两种情况：
>
> * 虚拟机安装的Linux，记得将防火墙直接关闭
>
>   ```shell
>   systemctl stop firewalld
>   systemctl disable firewalld
>   ```
>
> * 云服务的Linux，不需要关闭防火墙的，需要在安装组中对外开放3306端口
>
> MySQL连接
>
> ![](imgs\1682787187.jpg)

!> 开始导入数据

------

## Nacos安装

> Nacos默认的启动方式是集群模式，集群模式占用的内存比较大，默认2G左右，直接采用单机模式的即可standalone模式~~~
>
> 暂时Nacos持久化采用内嵌的数据库derby就足够了。
>
> 在 `/mydata/docker/` 下构建了 `nacos_docker` 的目录，在里面准备 `docker-compose.yml`
>
> ```shell
> version: '3.1'
> services:
>   nacos:
>     image: nacos/nacos-server:v2.1.1
>     container_name: nacos
>     ports:
>       - 8848:8848
>     environment:
>       - MODE=standalone
> ```
>
> 使用 Compose 命令构建和运行您的应用
>
> ```shell
> # 如果你想在后台执行该服务可以加上 -d 参数
> docker-compose up -d
> ```
>
> Nacos 启动成功后，可以查看日志
>
> ```shell
> docker logs -f nacos
> ```
>
> ![](imgs\1682788295.jpg)
>
> 访问：http://192.168.10.130:8848/nacos  默认账户密码（生产环境注意更换）：nacos / nacos
>
> ![](imgs\1682788424.jpg)

------

## Redis安装

> Redis一样单机版的就ok，Redis的6379端口，经常会被作为挖矿的入口，**Redis一定要设置连接密码**，并且不要太简单。
>
> 为了设置密码，需要先准备一个Redis的配置文件，设置好连接密码信息，redis.conf文件编写
>
> 文件创建 `/mydata/docker/redis_docker/data/redis.conf`，redis.conf 文件内容编写
>
> ```shell
> requirepass mmdzYYDS666
> ```
>
> 在 `/mydata/docker/` 下构建了 `redis_docker` 的目录，在里面准备 `docker-compose.yml`
>
> ```shell
> version: '3.1'
> services:
>   redis:
>     image: redis:5.0.9
>     container_name: redis
>     ports:
>       - 6379:6379
>     volumes:
>       - ./data/:/data/
>     command: ["redis-server","redis.conf"]
> ```
>
> 使用 Compose 命令构建和运行您的应用
>
> ```shell
> # 如果你想在后台执行该服务可以加上 -d 参数
> docker-compose up -d
> ```
>
> Redis 启动成功后，测试连接
>
> ![](imgs\1682789152.jpg)

------

## RabbitMQ安装

> RabbitMQ安装成本很低，只需要设置好图形化界面的密码即可
>
> 在 `/mydata/docker/` 下构建了 `rabbit_docker` 的目录，在里面准备 `docker-compose.yml`
>
> ```yml
> version: '3.1'
> services:
>   rabbitmq:
>     image: rabbitmq:3.8.3-management
>     container_name: rabbitmq
>     ports:
>       - 5672:5672
>       - 15672:15672
>     environment:
>       - RABBITMQ_DEFAULT_USER=root
>       - RABBITMQ_DEFAULT_PASS=mmdzYYDS666
> ```
>
> !> RabbitMQ 有2个端口：5672、15672 分别是 连接和图形化
>
> 使用 Compose 命令构建和运行您的应用
>
> ```shell
> # 如果你想在后台执行该服务可以加上 -d 参数
> docker-compose up -d
> ```
>
> 访问：http://192.168.10.130:15672
>
> ![](imgs\1682789691.jpg)

------

## Elasticsearch&Kibana安装

> Elasticsearch和Kibana要一起安装，Kibana要依赖Elasticsearch
>
> **Elasticsearch默认也是集群的方式去搭建，而且占用的内存默认情况下特别大，所以需要设置一下Elasticsearch的占用内存大小 和单机版**
>
> 在 `/mydata/docker/` 下构建了 `elasticsearch_docker` 的目录，在里面准备 `docker-compose.yml`
>
> ```shell
> version: '3.1'
> services:
>   elasticsearch:
>     image: elasticsearch:7.6.2
>     container_name: elasticsearch
>     ports:
>       - 9200:9200
>     environment:
>       - "cluster.name=elasticsearch"
>       - "discovery.type=single-node"
>       - "ES_JAVA_OPTS=-Xms256m -Xmx256m"
>       - "ELASTIC_PASSWORD=mmdzYYDS666"
>       - "xpack.security.enabled=true"
>     volumes:
>       - ./plugins/:/usr/share/elasticsearch/plugins/
>       - ./data/:/usr/share/elasticsearch/data/
>   kibana:
>     image: kibana:7.6.2
>     container_name: kibana
>     ports:
>       - 5601:5601
>     depends_on:
>       - elasticsearch
>     environment:
>       - "elasticsearch.hosts=http://elasticsearch:9200"
>       - "ELASTICSEARCH_USERNAME=elastic"
>       - "ELASTICSEARCH_PASSWORD=mmdzYYDS666"
> ```
>
> 使用 Compose 命令构建和运行您的应用
>
> ```shell
> # 如果你想在后台执行该服务可以加上 -d 参数
> docker-compose up -d
> ```
>
> !> **访问时出现了问题**
>
> 原因：需要向 elasticsearch_docker/data 目录下写入内容，没有权限
>
> 解决：添加权限 `chmod -R a+w data`
>
> 再重新构建 `docker-compose up -d` ；**注意查看日志**
>
> ![](imgs\1682792725.jpg)
>
> ![](imgs\1682792932.jpg)
>
> elasticsearch 访问：http://192.168.10.130:9200
>
> kibana 访问：http://192.168.10.130:5601
>
> ![](imgs\1682793058.jpg)
>
> ![](imgs\1682793108.jpg)
>
> ![](imgs\1682793308.jpg)
>
> ![](imgs\1682793309.jpg)

------

## Jenkins安装

> **Jenkins用于发布整个项目做测试时需要使用。**
>
> Jenkins的版本一定的要选择。Jenkins最新的长期支持版本，不支持JDK1.8，采用的是JDK11。
>
> 经过选择，采用 **jenkins/jenkins:2.350-jdk8**  这个版本
>
> 在 `/mydata/docker/` 下构建了 `jenkins_docker` 的目录，在里面准备 `docker-compose.yml`
>
> ```shell
> version: '3.1'
> services:
> jenkins:
>  image: jenkins/jenkins:2.350-jdk8
>  container_name: jenkins
>  ports:
>       - 8080:8080
>       - 50000:50000
>     volumes:
>       - ./data/:/var/jenkins_home/
> ```
>
> 使用 Compose 命令构建和运行您的应用
>
> ```shell
> # 如果你想在后台执行该服务可以加上 -d 参数
> docker-compose up -d
> ```
>
> 第一次启动后，会发现抛出一个permission的错误，在写入log日志到/var/jenkins_home/时，没有权限，因为宿主机的数据源不允许其他用户写入。给数据卷data复制w权限：
>
> ```shell
> chmod a+w data
> ```
>
> ![](imgs\1682833290.jpg)
>
> 再次启动容器
>
> ```shell
> docker-compose up -d
> ```
>
> 需要稍微等一会，看到Jenkins的首页：http://192.168.10.130:8080/
>
> ![image.png](imgs\e6338247330b49318a1a578d449c0909.png)
>
> 首页的密码需要从容器的日志中查看。
>
> ![image.png](imgs\9fbf09c57b5c486187dd82d57e3bc254.png)
>
> 输入密码后，继续，然后需要指定选择安装插件的方式
>
> ![image.png](imgs\e5a090699aea4baf9be41ceaad4d9046.png)
>
> 额外选择一个Git Parameter的插件
>
> ![image.png](imgs\28b941077fb44761ba2b50abfbe05ffc.png)
>
> 安装插件（听天由命）
>
> ![image.png](imgs\eeff44d243cb4ad2b6ca1af0163b0786.png)
>
> 指定用户（指定后面登录的用户名和密码）
>
> ![image.png](imgs\4b6acfffe1124c4fb5fe6195823a2406.png)
>
> 最终查看到Jenkins的首页
>
> ![image.png](imgs\f5f1d4dfb5b34b33b41757db3e2516d4.png)

------

## docker 批量启动容器⭐

?> 启动全部容器

```shell
# 命令	含义
# docker ps -a	列出所有docker容器
# awk ‘{ print $1 }’	以空格分隔字符并输出第一个 字符串
# tail -n +2	读取从第二行到最后一行

## 启动全部容器
docker start $( docker ps -a | awk '{ print $NF }' | tail -n +2
 )
 
## 将正在运行的容器设为自启动
#___ docker update --restart=always 容器名或容器ID

## 将自启动的容器取消自启动
#___ docker update --restart=no <CONTAINER ID>
```

> | 命令                        | 含义                              |
> | --------------------------- | --------------------------------- |
> | docker ps -a                | 列出所有docker容器                |
> | awk ‘{ print $1 }’          | 以空格分隔字符并输出第一个 字符串 |
> | tail -n +2                  | 读取从第二行到最后一行            |
> | '$NF~/^test*/ { print $NF } | 如果容器名以test开头 输出容器名   |

!> `/^test*/` 为正则表达式，你可以自己自定义正则表达式