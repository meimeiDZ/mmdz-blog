# SpringCloud

?>一套微服务应该具有的功能

![](springcloud_imgs\1678154580.jpg)

------

## Boot和Colud版本选型

>  查看版本对ces应关系：https://start.spring.io/actuator/info

?>SpringCloud版本选择

> 选用 springboot 和 springCloud 版本有约束，不按照它的约束会有冲突。
>
> **题外话：boot版已经到2.2.4为最新，为什么选2.2.2？**
>
> 1. 如果项目中只用到 boot，直接用最ud，由cloud决定boot版本
> 2. 同时用boot和cloud，需要照顾cloud，由cloud决定boot版本

?>Cloud各种组件的停更/升级/替换 

> 1. Eureka停用,可以使用zk作为服务注册中心
> 2. 服务调用,Ribbon准备停更,代替为LoadBalance
> 3. Feign改为OpenFeign
> 4. Hystrix停更,改为resilence4j,或者阿里巴巴的sentienl
> 5. Zuul改为gateway
> 6. 服务配置Config改为 Nacos
> 7. 服务总线Bus改为Nacos

![](springcloud_imgs\1678155307.jpg)

------

## 微服务架构编码构建

> 构建完成，父工程创建完成执行clean、install将父工程发布到仓库方便子工程继承 

<!-- tabs:start -->

#### **构建父工程**

![](springcloud_imgs\1678155899.jpg)

#### **设置配置**

> 1. 设置Maven
>
> 2. 设置编码：Settings -> File Encodings
>
> 3. 设置注解激活：Settings -> Annotation Processors（勾选Enable annotation processing）
>
> 4. 设置Java版本：Settings -> Java Compiler
>
> 5. File Type过滤：
>
>    ![](springcloud_imgs\1678156687.jpg)
>
> 6. 热部署配置devtools
>
>    1. 添加热部署依赖
>
>       ```xml
>               <!-- 热部署配置devtools -->
>               <dependency>
>                   <groupId>org.springframework.boot</groupId>
>                   <artifactId>spring-boot-devtools</artifactId>
>                   <scope>runtime</scope>
>                   <optional>true</optional>
>               </dependency>
>       ```
>
>    2. 添加插件
>
>       ```xml
>               <plugins>
>                   <plugin>
>                       <groupId>org.springframework.boot</groupId>
>                       <artifactId>spring-boot-maven-plugin</artifactId>
>                       <configuration>
>                           <fork>true</fork>
>                           <addResources>true</addResources>
>                       </configuration>
>                   </plugin>
>               </plugins>
>       ```
>
>    3. 开启Java Compiler的自动build
>
>       ![](D:\mmdz-blog\docs\MCA\springcloud_imgs\1678159929.jpg)
>
>    4. 更新值（按住 `ctrl + shift +alt + /` 选择Registry）
>
>       ![](springcloud_imgs\1678160001.jpg)
>
>       注意：idea 高版本的 running 在setting里
>
>       ![](springcloud_imgs\1678161122.jpg)
>
>    5. 重启IDEA（**热部署只允许在开发阶段使用**）
>
> 7. 

#### **父工程POM配置**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mmdz</groupId>
    <artifactId>SpringCloud_learn</artifactId>
    <version>1.0</version>

    <packaging>pom</packaging>

    <!-- 统一管理 jar 包版本 -->
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <junit.version>4.12</junit.version>
        <log4j.version>1.2.17</log4j.version>
        <lombok.version>1.16.18</lombok.version>
        <mysql.version>5.1.47</mysql.version>
        <druid.version>1.1.16</druid.version>
        <mybatis.spring.boot.version>1.3.0</mybatis.spring.boot.version>
    </properties>


    <!-- 子块基础之后，提供作用：锁定版本 + 子module不用写 groupId 和 version -->
    <dependencyManagement>
        <dependencies>
            <!-- 下面三个基本是微服务架构的标配 -->
            <!--spring boot 2.2.2-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.2.2.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--spring cloud Hoxton.SR1-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--spring cloud 阿里巴巴-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>2.1.0.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!--mysql-->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
                <scope>runtime</scope>
            </dependency>
            <!-- druid-->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>druid</artifactId>
                <version>${druid.version}</version>
            </dependency>
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>${mybatis.spring.boot.version}</version>
            </dependency>
            <!--junit-->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit.version}</version>
            </dependency>
            <!--log4j-->
            <dependency>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
                <version>${log4j.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.2.2.RELEASE</version>
                <configuration>
                    <fork>true</fork>
                    <addResources>true</addResources>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

<!-- tabs:end -->

------

## Rest微服务工程构建/重构

### payment-service模块

<!-- tabs:start -->

#### **POM**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <artifactId>SpringCloud_learn</artifactId>
        <groupId>com.mmdz</groupId>
        <version>1.0</version>
    </parent>

    <artifactId>payment-service</artifactId>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.10</version>
        </dependency>
        <!--mysql-connector-java-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!--jdbc-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- 热部署配置devtools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <fork>true</fork>
                    <addResources>true</addResources>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

#### **application.yml**

```yml
server:
  port: 8001

spring:
  application:
    name: payment-service # 项目名,也是注册的名字

  datasource:
    type: com.alibaba.druid.pool.DruidDataSource  #当前数据源操作类型
    driver-class-name: org.gjt.mm.mysql.Driver    #mysql驱动包
    url: jdbc:mysql://192.168.10.110:3307/cloud_learn?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC
    username: root
    password: 123456

mybatis:
  mapper-locations: classpath:mapper/*.xml
  # 所有Entity 别名类所在包
  type-aliases-package: com.mmdz.payment.entity
```

#### **建表SQL**

```sql
create table `payment`(
    `id` bigint(20) not null auto_increment comment 'ID',
    `serial` varchar(200) default '',
    PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

select * from payment;
```

#### **公共返回类**

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonResult<T> {
    private Integer code;
    private String message;
    private T data;
    public CommonResult(Integer code, String message) {
        this(code, message, null);
    }
}
```

#### **实体**

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment implements Serializable {
    private long id; //数据库是bigint
    private String serial;
}
```

#### **mapper**

```java
@Mapper
public interface PaymentMapper {
    public int insert(Payment payment);
    public Payment getPaymentById(@Param("id") Long id);
}
```

resources/mapper/PaymentMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mmdz.payment.mapper.PaymentMapper">

    <resultMap id="BaseResultMap" type="Payment">
        <id column="id" property="id" jdbcType="BIGINT"/>
        <id column="serial" property="serial" jdbcType="VARCHAR"/>
    </resultMap>

    <insert id="insert" parameterType="Payment" useGeneratedKeys="true" keyProperty="id">
        insert into payment(serial) values(#{serial})
    </insert>

    <select id="getPaymentById" parameterType="Long" resultMap="BaseResultMap">
        select * from payment where id = #{id}
    </select>
</mapper>
```

#### **service**

```java
public interface IPaymentService {
    public int insert(Payment payment);
    public Payment getPaymentById(@Param("id") Long id);
}

// -------------------------------------------------
@Service
public class PaymentServiceImpl implements IPaymentService {
    @Resource
    private PaymentMapper paymentMapper;
    @Override
    public int insert(Payment payment){
        return paymentMapper.insert(payment);
    }
    @Override
    public Payment getPaymentById(Long id){
        return paymentMapper.getPaymentById(id);
    }
}
```

#### **rest**

```java
@Slf4j
@RestController
@RequestMapping("/payment")
public class PaymentRest {
    @Autowired
    private IPaymentService paymentService;

    @PostMapping(value = "/insert")
    public CommonResult create(@RequestBody Payment payment) {
        int result = paymentService.insert(payment);
        log.info("***********插入结果：" + result);

        if (result > 0) {
            return new CommonResult(200, "插入数据库成功", result);
        } else {
            return new CommonResult(444, "插入数据库失败", null);
        }
    }

    @GetMapping(value = "/get/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id) {
        Payment payment = paymentService.getPaymentById(id);
        log.info("***********查询结果：" + payment + "\t" + "oo哈哈");

        if (payment != null) {
            return new CommonResult(200, "查询成功，（测试）", payment);
        } else {
            return new CommonResult(444, "查询失败", null);
        }
    }
}
```

<!-- tabs:end -->

### payment-service模块

<!-- tabs:start -->

#### **POM**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <artifactId>SpringCloud_learn</artifactId>
        <groupId>com.mmdz</groupId>
        <version>1.0</version>
    </parent>

    <artifactId>order-service</artifactId>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.mmdz</groupId>
            <artifactId>common-service</artifactId>
            <version>1.0</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!--热部署-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

#### **application.yml**

```yml
server:
  port: 80
```

#### **RestTemplate配置类**

```java
@Configuration
public class ApplicationContextConfig {
    @Bean
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```

#### **公共返回类**

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonResult<T> {
    private Integer code;
    private String message;
    private T data;
    public CommonResult(Integer code, String message) {
        this(code, message, null);
    }
}
```

#### **实体**

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment implements Serializable {
    private long id; //数据库是bigint
    private String serial;
}
```

#### **rest**

```java
@Slf4j
@RestController
@RequestMapping("/order")
public class OrderRest {
    //远程调用的地址
    public static final String PAYMENT_URL = "http://localhost:8001";
    @Resource
    private RestTemplate restTemplate;

    @PostMapping("/payment/insert")
    public CommonResult<Payment> create(@RequestBody Payment payment) {
        return restTemplate.postForObject(PAYMENT_URL + "/payment/insert",//请求地址
                payment,//请求参数
                CommonResult.class);//返回类型
    }

    @GetMapping("/payment/get/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id) {
        return restTemplate.getForObject(PAYMENT_URL + "/payment/get/" + id,//请求地址
                CommonResult.class);//返回类型
    }
}
```

<!-- tabs:end -->

### 重构

> 把公共的 CommonResult、Payment进去抽取成 common-service，再导入

![](springcloud_imgs\1678170780.jpg)

------

## Eureka 服务注册与发现

> Eureka包含两个组件：**Eureka Server**和**Eureka Client**
>
> - Eureka Server提供服务注册服务
>
>   各个微服务节点通过配置启动后，会在EurekaServer中进行注册，这样EurekaServer中的服务注册表中将会存储所有可用服务节点的信息，服务节点的信息可以在界面中直观看到。
>
> - EurekaClient通过注册中心进行访问
>
>   是一个Java客户端，用于简化Eureka Server的交互，客户端同时也具备一个内置的、使用轮询(round-robin)负载算法的负载均衡器。在应用启动后，将会向Eureka Server发送心跳(默认周期为30秒)。如果Eureka Server在多个心跳周期内没有接收到某个节点的心跳，EurekaServer将会从服务注册表中把这个服务节点移除（默认90秒）

### 单机Eureka构建步骤

?>订单服务端口80，支付服务端口8001，Eureka端口7001

<!-- tabs:start -->

#### **eureka-service**

?>pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <artifactId>SpringCloud_learn</artifactId>
        <groupId>com.mmdz</groupId>
        <version>1.0</version>
    </parent>

    <artifactId>eureka-service</artifactId>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.mmdz</groupId>
            <artifactId>common-service</artifactId>
            <version>1.0</version>
        </dependency>

        <!--eureka-server (SpringBoot2.x)-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <!--SpringBoot1.X-->
        <!--<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka</artifactId>
        </dependency>-->

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

?>application.yml

```yml
server:
  port: 7001

eureka:
  instance:
    hostname: localhost  # eureka 服务端的实例名称

  client:
    # false 代表不向服务注册中心注册自己，因为它本身就是服务中心
    register-with-eureka: false
    # false 代表自己就是服务注册中心，自己的作用就是维护服务实例，并不需要去检索服务
    fetch-registry: false
    service-url:
      # 设置与 Eureka Server 交互的地址，查询服务 和 注册服务都依赖这个地址
      defaultZone: http://localhost:7001/eureka/
```

?>主启动类

```java
@SpringBootApplication
@EnableEurekaServer // 自己是服务注册中心
public class EurekaServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServiceApplication.class, args);
        System.out.println(" Eureka Service is run Success !!! ");
    }
}
```

#### **payment-service**

?>pom.xml

```xml
        <!--eureka-client-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
```

?>application.yml（添加eureka配置）
```yml
eureka:
  client:
    # 注册进 Eureka 的服务中心
    register-with-eureka: true
    # 检索服务中心的其它服务
    # 单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetch-registry: true
    service-url:
      # 设置与 Eureka Server 交互的地址
      defaultZone: http://localhost:7001/eureka/
```


?>主启动类

```java
@SpringBootApplication
@EnableEurekaClient
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
        System.out.println(" Payment Service is run Success !!! ");
    }
}
```

#### **order-service**

> 与 payment-service 模块的改造类同

<!-- tabs:end -->

?>**测试**

![](springcloud_imgs\1678176349.jpg)

### 集群Eureka构建

> **问题：微服务RPC远程服务调用最核心的是什么？**
>
> **高可用**，试想你的注册中心只有一个only one， 它出故障了那就呵呵(￣▽￣)"了，会导致整个为服务环境不可用，所以解决办法：`搭建Eureka注册中心集群 ，实现负载均衡+故障容错`

**操作步骤**

> 1. 修改映射配置
> 2. 仿照 **eureka-service** 模块，创建多个实例
> 3. 修改项目中pom文件：其他注册中心的地址
> 4. 开启负载均衡

<!-- tabs:start -->

#### **修改映射配置**

> 找到`C:\Windows\System32\drivers\etc`路径下的hosts文件，修改映射配置添加进hosts文件，因为浏览器不识别eureka1.com，不添加会导致后面的服务找不到注册中心的地址。
>
> ```txt
> # SpringCloud-Eureka
> 127.0.0.1 eureka1.com
> 127.0.0.1 eureka2.com
> 127.0.0.1 eureka3.com
> ```

#### **修改项目中配置文件**

> application.yml
>
> 与单机版不同的是，defaultZone指向了其他注册中心的地址
>
> - eureka1服务配置
>
>   ```yml
>   server:
>     port: 7001
>   
>   eureka:
>     instance:
>       hostname: eureka1.com  # eureka 服务端的实例名称
>   
>     client:
>       # false 代表不向服务注册中心注册自己，因为它本身就是服务中心
>       register-with-eureka: false
>       # false 代表自己就是服务注册中心，自己的作用就是维护服务实例，并不需要去检索服务
>       fetch-registry: false
>       service-url:
>         # 设置与 Eureka Server 交互的地址，查询服务 和 注册服务都依赖这个地址
>         defaultZone: http://eureka2.com:7002/eureka/,http://eureka3.com:7003/eureka/
>   ```
>
> - eureka2服务配置
>
>   ```yml
>   server:
>     port: 7002
>   
>   eureka:
>     instance:
>       hostname: eureka2.com  # eureka 服务端的实例名称
>   
>     client:
>       # false 代表不向服务注册中心注册自己，因为它本身就是服务中心
>       register-with-eureka: false
>       # false 代表自己就是服务注册中心，自己的作用就是维护服务实例，并不需要去检索服务
>       fetch-registry: false
>       service-url:
>         # 设置与 Eureka Server 交互的地址，查询服务 和 注册服务都依赖这个地址
>         defaultZone: http://eureka1.com:7001/eureka/,http://eureka3.com:7003/eureka/
>   ```
>
> - eureka3服务配置（类推）

#### **其他服务配置修改**

?>`order-service`服务 把单机配置改为集群（`payment-service` 类同）

```yml
server:
  port: 80

spring:
  application:
    name: order-service # 项目名,也是注册的名字

eureka:
  client:
    # 注册进 Eureka 的服务中心
    register-with-eureka: true
    # 检索服务中心的其它服务
    # 单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetch-registry: true
    service-url:
      # 设置与 Eureka Server 交互的地址
      defaultZone: http://eureka1.com:7001/eureka/,http://eureka2.com:7002/eureka/,http://eureka3.com:7003/eureka/
```

#### **开启负载均衡**

?>再次创建一个 支付服务 来实现负载均衡

![](springcloud_imgs\1678180359.jpg)

?>修改 订单服务 **order-service**

- 远程调用的地址

  ```java
  @Slf4j
  @RestController
  @RequestMapping("/order")
  public class OrderRest {
      //远程调用的地址
  //    public static final String PAYMENT_URL = "http://localhost:8001";
      //远程调用的地址，改成提供者在Eureka 上的名称，无需写端口号
      public static final String PAYMENT_URL = "http://payment-service";
      @Resource
      private RestTemplate restTemplate;
  
      @PostMapping("/payment/insert")
      public CommonResult<Payment> create(@RequestBody Payment payment) {
          return restTemplate.postForObject(PAYMENT_URL + "/payment/insert",//请求地址
                  payment,//请求参数
                  CommonResult.class);//返回类型
      }
  
      @GetMapping("/payment/get/{id}")
      public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id) {
          return restTemplate.getForObject(PAYMENT_URL + "/payment/get/" + id,//请求地址
                  CommonResult.class);//返回类型
      }
  }
  ```

- RestTemplate开启负载均衡

  ```java
  @Configuration
  public class ApplicationContextConfig {
      @Bean
      @LoadBalanced // 开启负载均衡
      public RestTemplate getRestTemplate(){
          return new RestTemplate();
      }
  }
  ```

<!-- tabs:end -->

?>测试集群（`搭建好集群后测试，此时没有开启负载均衡`）

![](springcloud_imgs\1678178672.jpg)

![](springcloud_imgs\1678178729.jpg)

?>负载均衡测试

![](springcloud_imgs\1678180628.jpg)

------

### actuator微服务信息完善

?>`当前问题`

> - **含有主机名称**
>
>   ![](springcloud_imgs\1678180907.jpg)
>
> - **访问信息没有IP信息提示**

?>**解决**

> 已支付服务 `payment-service` 为例 （修改配置中的 **eureka** 属性）
>
> ```yml
> eureka:
>   client:
>     # 注册进 Eureka 的服务中心
>     register-with-eureka: true
>     # 检索服务中心的其它服务
>     # 单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
>     fetch-registry: true
>     service-url:
>       # 设置与 Eureka Server 交互的地址
>       defaultZone: http://eureka1.com:7001/eureka/,http://eureka2.com:7002/eureka/,http://eureka3.com:7003/eureka/
>   instance:
>     # 每个提供者的id不同，显示的不再是默认的项目名
>     instance-id: payment8001
>     # 显示 ip 地址
>     prefer-ip-address: true
> ```
>
> ![](springcloud_imgs\1678181297.jpg)

------

### 服务发现Discovery

> `对于注册进eureka里面的微服务，可以通过服务发现来获得该服务的信息。`

<!-- tabs:start -->

#### **修改8001和8002的Controller**

```java
public class PaymentController {
    @Resource
    private DiscoveryClient discoveryClient;
 
    @GetMapping(value = "/payment/discovery")
    public Object discovery(){
        //获得服务清单列表
        List<String> services = discoveryClient.getServices();
        for (String service : services) {
            log.info("*****element:"+service);
        }
        
        // 根据具体服务进一步获得该微服务的信息
        List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
        for (ServiceInstance instance : instances) {
            log.info(instance.getServiceId()+"\t"+instance.getHost()+"\t"+instance.getPort()+"\t"+instance.getUri());
        }
        return this.discoveryClient;
    }
}
```

#### **主启动类**

```java
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient //服务发现
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
        System.out.println(" Payment Service is run Success !!! ");
    }
}
```

#### **测试**

![](springcloud_imgs\1678182488.jpg)

![](springcloud_imgs\1678182525.jpg)

<!-- tabs:end -->

------

### Eureka自我保护

?>**故障现象**

> 保护模式主要用于一组客户端和Eureka Server之间存在网络分区场景下的保护。一旦进入保护模式，Eureka Server将会尝试保护其服务注册表中的信息，不再删除服务注册表中的数据，也就是不会注销任何微服务。
>
> 如果在Eureka Server的首页看到以下这段提示，则说明Eureka进入了保护模式：
>
> ![](springcloud_imgs\1678182717.jpg)

?>**故障原因**

> 什么是自我保护模式？
>
> 默认情况下，如果EurekaServer在一定时间内没有接收到某个微服务实例的心跳，EurekaServer将会注销该实例（默认90秒）。但是当网络分区故障发生(延时、卡顿、拥挤)时，微服务与EurekaServer之间无法正常通信，以上行为可能变得非常危险了——因为微服务本身其实是健康的，此时本不应该注销这个微服务。Eureka通过“自我保护模式”来解决这个问题——当EurekaServer节点在短时间内丢失过多客户端时（可能发生了网络分区故障），那么这个节点就会进入自我保护模式。
>
> 在自我保护模式中，Eureka Server会保护服务注册表中的信息，不再注销任何服务实例。
>
> 综上，自我保护模式是一种应对网络异常的安全保护措施。它的架构哲学是宁可同时保留所有微服务（健康的微服务和不健康的微服务都会保留）也不盲目注销任何健康的微服务。使用自我保护模式，可以让Eureka集群更加的健壮、稳定。

?>**怎么禁止自我保护**

> - **eureakeServer**
>
>   ```yml
>   server:
>    port: 7001
>    
>   eureka:
>    instance:
>      hostname: eureka1.com  # eureka 服务端的实例名称
>    
>    client:
>      # false 代表不向服务注册中心注册自己，因为它本身就是服务中心
>      register-with-eureka: false
>      # false 代表自己就是服务注册中心，自己的作用就是维护服务实例，并不需要去检索服务
>      fetch-registry: false
>      service-url:
>        # 设置与 Eureka Server 交互的地址，查询服务 和 注册服务都依赖这个地址
>        defaultZone: http://eureka7001.com:7001/eureka/
>    server:
>      # 关闭自我保护机制，保证不可用该服务被及时剔除
>      enable-self-preservation: false
>      eviction-interval-timer-in-ms: 2000
>   ```
>
> - **Client**
>
>   ```yml
>   server:
>     port: 8001
>   
>   eureka:
>     client:
>       # 注册进 Eureka 的服务中心
>       register-with-eureka: true
>       # 检索 服务中心 的其它服务
>       fetch-registry: true
>       service-url:
>         # 设置与 Eureka Server 交互的地址
>         # 提供者注册到多个eureka中
>         defaultZone: http://eureka7001.com:7001/eureka/
>   #      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
>     instance:
>       instance-id: payment8001 # 每个提供者的id不同，显示的不再是默认的项目名
>       prefer-ip-address: true # 可以显示ip地址
>       # Eureka客户端像服务端发送心跳的时间间隔，单位s，默认30s
>       least-renewal-interval-in-seconds: 1
>       # Rureka服务端在收到最后一次心跳后等待时间上线，单位为s，默认90s，超时将剔除服务
>       least-expiration-duration-in-seconds: 2
>   ```

------

## Ribbon 负载均衡服务调用

> spring-cloud-starter-netflix-eureka-client 自带了 spring-cloud-starter-ribbon 引用

**使用（order-service）**

> ```java
>     /**
>      * getForObject方法：返回对象为响应体中数据转化成的对象，基本上可以理解为Json
>      * @param id
>      * @return
>      */
>     @GetMapping("/payment/getForObject/{id}")
>     public CommonResult<Payment> getPayment1(@PathVariable("id") Long id) {
>         return restTemplate.getForObject(PAYMENT_URL + "/payment/get/" + id, CommonResult.class);
>     }
> 
>     /**
>      * getForEntity方法：返回对象为ResponseEntity对象，包含了响应中的一些重要信息，比如响应头、响应状态码、响应体
>      * @param id
>      * @return
>      */
>     @GetMapping("/payment/getForEntity/{id}")
>     public CommonResult<Payment> getPayment2(@PathVariable("id") Long id) {
>         ResponseEntity<CommonResult> response = restTemplate.getForEntity(PAYMENT_URL + "/payment/get/" + id, CommonResult.class);
>         if (response.getStatusCode().is2xxSuccessful()) {
>             log.info(response.getStatusCode() + "\t" + response.getHeaders());
>             return response.getBody();
>         } else {
>             return new CommonResult<>(444, "操作失败");
>         }
>     }
> ```

------

## OpenFeign

> Feign是一个声明式WebService客户端，使用Feign能让编写Web Service客户端更加简单。
>
> 它的使用方法是定义一个服务接口然后在上面添加注解，Feign也支持可拔插式的编码器和解码器，Spring Cloud对Feign进行了封装，使其支持了Spring MVC标准注解和HttpMessageConverters，Feign可以与Eureka和Ribbon组合使用以支持负载均衡。
>
> Feign：
>
> - Feign是Spring Cloud组件中的一个轻量级RESTful的HTTP服务客户端
> - Feign内置了Ribbon，用来做客户端负载均衡，去调用服务注册中心的服务
> - Feign的使用方式是：使用Feign的注解定义接口，调用这个接口，就可以调用服务注册中心的服务
>
> OpenFeign：
>
> - OpenFeign是Spring Cloud 在Feign的基础上支持了SpringMVC的注解，如@RequesMapping等等
> - OpenFeign 的 @FeignClient 可以解析 SpringMVC 的 @RequestMapping 注解下的接口，并通过动态代理的方式产生实现类，实现类中做负载均衡并调用其他服务

