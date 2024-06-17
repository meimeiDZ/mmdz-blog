# Nacos

### 官网文档

> nacos官网文档介绍：[官方文档介绍](https://nacos.io/zh-cn/docs/what-is-nacos.html)

### 集成版本

> 目前推荐使用版本为：[官方版本说明](https://github.com/alibaba/spring-cloud-alibaba/wiki/版本说明)
>
> ![](cloud\nacos_01.jpg)

### 安装

> docker 安装（推荐）：**https://nacos.io/zh-cn/docs/quick-start-docker.html**
>
> 以 docker-compose 部署单体 Nacos 为例：
>
> - 前提：安装**docker**、**docker-compose**、**mysql8**
>
> - 构建 nacos 数据库：以 v2.0.4 为例 [nacos.sql](https://github.com/alibaba/nacos/blob/2.0.4/distribution/conf/nacos-mysql.sql)
>
>   ![](cloud\nacos_02.jpg)
>
> - docker-compose 部署
>
>   docker-compose.yaml
>
>   ```yaml
>   version: '3'
>   services:
>     nacos:
>       restart: always
>       image: 'nacos/nacos-server:v2.0.4'
>       container_name: base-nacos
>       ports:
>         - '8848:8848'
>         - '9848:9848'
>         - '9555:9555'
>       privileged: true
>       volumes:
>         - ./nacos/standalone-logs/:/home/nacos/logs
>       environment:
>         - PREFER_HOST_MODE=hostname # 本机可填写 hostname
>         - MODE=standalone
>         - SPRING_DATASOURCE_PLATFORM=mysql
>         - MYSQL_SERVICE_HOST=192.168.204.100
>         - MYSQL_SERVICE_PORT=3306
>         - MYSQL_SERVICE_DB_NAME=base-nacos
>         - MYSQL_SERVICE_USER=root
>         - MYSQL_SERVICE_PASSWORD=123456
>         - MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false
>         # JVM 内存自行设置（可按默认）
>         # - JVM_XMS=128m
>         # - JVM_XMX=128m
>         # - JVM_XMN=128m
>   ```
>
> - 启动服务
>
>   ```shell
>   # 构建、启动容器
>   docker-compose up -d
>   
>   # 查看容器启动日志
>   docker-compose logs -f [容器]
>   ```
>
> - 访问服务：`http://服务器IP:8848/nacos`   用户名/密码：`nacos/nacos`

!> Nacos v2.2.0.1 以下版本存在`默认密钥漏洞(CNVD-2023-17316)`，官网文档描述地址：**https://nacos.io/zh-cn/docs/v2/guide/user/auth.html**

### 项目使用

> - nacos 配置
>
>   ![](cloud\nacos_03.jpg)
>
> - Maven 依赖（案例）
>
>   ```xml
>           <!--   ******************************   nacos   ******************************    -->
>           <!--
>              在SpringBoot 2.4.x的版本之后，对于bootstrap.properties/bootstrap.yaml配置文件
>              (我们合起来成为Bootstrap配置文件)的支持，需要导入如下的依赖。
>              由于SpringCloud 2020.*以后的版本默认禁用了bootstrap，导致读取配置文件时读取不到该属性。
>          -->
>           <dependency>
>               <groupId>org.springframework.cloud</groupId>
>               <artifactId>spring-cloud-starter-bootstrap</artifactId>
>           </dependency>
>   
>           <!-- SpringCloud Alibaba Nacos -->
>           <dependency>
>               <groupId>com.alibaba.cloud</groupId>
>               <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
>           </dependency>
>   
>           <!-- SpringCloud Alibaba Nacos Config -->
>           <dependency>
>               <groupId>com.alibaba.cloud</groupId>
>               <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
>           </dependency>
>   ```
>
> - yml 配置（案例）
>
>   ```yaml
>   nacos-ip: 192.168.204.100
>   nacos-port: 8848
>   nacos-server: ${nacos-ip}:${nacos-port}
>   group: MMDZ_GROUP_DEV
>     
>   # 配置端口
>   server:
>     port: 8000
>     
>   spring:
>     cloud:
>       nacos:
>         discovery:
>           # 服务注册地址
>           server-addr: ${nacos-server}
>           namespace: 7706f117-087a-41f2-b21b-a50a76f2ca73
>           group: ${group}
>         config:
>           # 配置中心地址
>           server-addr: ${nacos-server}
>           namespace: 7706f117-087a-41f2-b21b-a50a76f2ca73
>           # 配置文件格式
>           file-extension: yml
>           group: ${group}
>           extension-configs:
>             - dataId: mmdz-gateway-dev.yml
>               group: ${group}
>               refresh: true
>             - dataId: mmdz-common-dev.yml
>               group: ${group}
>               refresh: true
>             - dataId: mmdz-redis-dev.yml
>               group: ${group}
>               refresh: true
>   ```

!>  **注意：新版 SpringBoot 已不再需要`@EnableDiscoveryClient`，只要在 pom 里配置了相应的服务发现依赖就可以了**

------

### Nacos原理详解

#### 架构

#### 服务注册原理

#### 服务发现原理

#### 配置中心原理

------

### Nacos内存占用高
