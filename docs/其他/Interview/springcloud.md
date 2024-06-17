# SpringCloud

> 提起微服务，不得不提 Spring Cloud 全家桶系列，Spring Cloud 是一个服务治理平台，是若干个框架的集合，提供了全套的分布式系统解决方案。包含了：服务注册与发现、配置中心、服务网关、智能路由、负载均衡、断路器、监控跟踪、分布式消息队列等等。

`SpringCloud包含那些项目`

| 项目           | 项目名称                                         |
| -------------- | ------------------------------------------------ |
| 服务注册于发现 | Alibaba Nacos、Netflix Eureka、Apache Zookper    |
| 分布式配置中心 | Alibaba Nacos、Spring Cloud Config               |
| 网关           | Spring Cloud Gateway、Netflix Zull               |
| 限流熔断器     | Alibaba Sentinel、Netflix Hystrix、 Resilience4j |
| 服务调用       | RestTemplate、Open Feign、Dubbo Spring Cloud     |
| 负载均衡       | Spring Cloud LoadBalancer、Netflix Ribbon        |
| 消息总线       | Spring Cloud Bus                                 |
| ...            | ....                                             |

`SpringCloud版本选择`

> https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E
>
> | Spring Cloud Alibaba Version | Spring Cloud Version       | Spring Boot Version |
> | ---------------------------- | -------------------------- | ------------------- |
> | 2.1.4.RELEASE                | Spring Cloud Greenwich.SR6 | 2.1.13.RELEASE      |
>
> | Spring Cloud Alibaba Version | Sentinel Version | Nacos Version | Seata Version |
> | ---------------------------- | ---------------- | ------------- | ------------: |
> | 2.1.4.RELEASE                | 1.8.0            | 1.4.1         |         1.3.0 |

------

## Nacos

> Nacos（Naming Configuration Service） 是一个易于使用的动态服务发现、配置和服务管理平台，用于构建云原生应用程序
>
> ​	**服务发现是微服务架构中的关键组件之一**。Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。
>
> ​	Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。
>
> `Nacos`
>
> 1. Nacos = **注册中心+配置中心组合**
>
> 2. Nacos支持几乎所有主流类型的“服务”的发现、配置和管理，常见的服务如下：
>
>    **Kubernetes Service**
>
>    **gRPC & Dubbo RPC Service**
>
>    **Spring Cloud RESTful Service**

### 注册中心原理

> [Nacos-注册中心原理解析](https://blog.csdn.net/qq_33375499/article/details/125710182)

**Nacos注册中心流程**

![image.png](springcloud_imgs\706cf73694cb46cda91be6681142c94b.png)

**源码流程图**

![](springcloud_imgs\Nacos源码剖析-服务注册与发现(临时实例AP模式).jpg)

**流程解析**

> 1. **服务启动后**
>
>    SpringCloud集成Nacos实现原理： 服务启动时，找到spring-cloud-alibab-nacos-discovery.jar里的spring.factories配置文件找到具体的实现类名，并装载实例化，完成模块的注入；
>
>    由于nacos自动装配的配置类实现了ApplicationListener 接口的类，spring容器启动时会调用处理事件的方法，Nacos监听相应的事件，最后会调用Nacos的register注册服务；
>
> 2. **客户端服务注册、发送心跳**
>
>    客户端启动时会将当前服务的信息包含ip、端口号、服务名、分组名、集群名等信息封装为一个Instance对象，准备向Nacos服务器注册服务，在注册服务之前，会根据Instance中的信息创建一个BeatInfo对象；
>
>    然后创建一个BeatTask定时任务，每隔5秒时间 调用server的实例发送心跳的接口，向Nacos服务器发送PUT请求并携带相关信息，作为定时心跳连接；
>
>    调用server的实例注册接口，向Nacos服务器发送POST请求注册实例；
>
> 3. **服务器端心跳机制、服务注册**
>
>    `心跳：`
>
>    服务器端在接收到心跳请求后，会去检查当前服务列表中有没有该实例，如果没有的话将当前服务实例重新注册，注册完成后立即开启一个异步任务，更新客户端实例的最后心跳时间，如果当前实例是非健康状态则将其改为健康状态；
>
>    `服务注册：`
>
>    1. 服务器端在接收到注册实例请求后，会将请求携带的数据封装为一个Instance对象，然后为这个服务实例创建一个服务Service，一个Service下可能有多个服务实例，服务在Nacos保存到一个ConcurrentHashMap中，格式为命名空间为key，value为map，分组名和服务名为内层map的key，value为服务数据，Map(namespace,Map(group::serviceName, Service))；
>    2. 服务创建完成之后，开启一个定时任务（5s），检查当前服务中的各个实例是否在线，如果实例上次心跳时间大于15s就将其状态设置为不健康，如果超出30s，则直接将该实例删除；
>    3. 然后将当前实例添加到对应服务列表中，这里会通过synchronized锁住当前服务，然后分两种情况向集群中添加实例，如果是持久化数据，则使用基于CP模式的简单Raft协议，通过leader节点将实例数据更新到内存和磁盘文件中，并且通过CountDownLatch实现了一个简单的raft写入数据的逻辑，必须集群半数以上节点写入成功才会给客户端返回成功；
>    4. 如果是非持久话实例数据，使用的是基于AP模式的Distro协议，首先向任务阻塞队列添加一个本地服务实例改变任务，去更新本地服务列表，然后在遍历集群中所有节点，分别创建数据同步任务放进阻塞队列异步进行集群数据同步，不保证集群节点数据同步完成即可返回；
>    5. 在将服务实例更新到服务注册表中时，为了防止并发读写冲突，采用的是写时复制的思想，将原注册表数据拷贝一份，添加完成之后再替换回真正的注册表，更新完成之后，通过发布服务变化事件，将服务变动通知给客户端，采用的是UDP通信，客户端接收到UDP消息后会返回一个ACK信号，如果一定时间内服务端没有收到ACK信号，还会尝试重发，当超出重发时间后就不在重发，虽然通过UDP通信不能保证消息的可靠抵达，但是由于Nacos客户端会开启定时任务，每隔一段时间更新客户端缓存的服务列表，通过定时轮询更新服务列表做兜底，所以不用担心数据不会更新的情况，这样既保证了实时性，又保证了数据更新的可靠性；
>
> 4. **客户端服务发现**
>
>    客户端通过定时任务定时从服务端拉取服务数据保存在本地缓存，服务端在发生心跳检测、服务列表变更或者健康状态改变时会触发推送事件，在推送事件中会基于UDP通信将服务列表推送到客户端，同时开启定时任务，每隔10s定时获取服务端最新服务数据并更新到本地的任务。

### Distro协议

**源码流程图**

![](D:/mmdz_blog-1/blog/MCA/springcloud_imgs/Distro源码分析.jpg)

> **设计思想**
>
> - nacos每个节点是平等的都可以处理写请求，同时把数据同步到其他节点
> - 每个节点只负责部分数据，定时发送自己负责的数据的校验值到其他节点来保持数据一致性
> - 每个节点独立处理读请求，及时从本地发出响应
>
> **总结：**
>
> Distro 协议是 Nacos 对于临时实例数据开发的⼀致性协议。其数据存储在缓存中，并且会在启动时进行全量数据同步，并定期进行数据校验。
>
> 在 Distro 协议的设计思想下，每个 Distro 节点都可以接收到读写请求。所有的Distro协议的请求场景主要分为三种情况：
>
> 1. 当该节点接收到属于该节点负责的实例的写请求时，直接写入。
> 2. 当该节点接收到不属于该节点负责的实例的写请求时，将在集群内部路由，转发给对应的节点，从而完成读写。
> 3. 当该节点接收到任何读请求时，都直接在本机查询并返回（因为所有实例都被同步到了每台机器上）。
>
> Distro 协议作为 Nacos 的内嵌临时实例⼀致性协议，保证了在分布式环境下每个节点上面的服务信息的状态都能够及时地通知其他节点，可以维持数十万量级服务实例的存储和⼀致性。
>
> **数据初始化**
>
> 新加入的 Distro 节点会进行全量数据拉取。具体操作是轮询所有的 Distro 节点，通过向其他的机器发送请求拉取全量数据。
>
> ![](D:/mmdz_blog-1/blog/MCA/springcloud_imgs/e665afccf9ea40f5933bd609f21ad3b4.png)
>
> **数据校验**
>
> 在Distro集群启动之后，各台机器之间会**定期发送心跳来保证数据一致性**
>
> **写操作**
>
> 对于⼀个已经启动完成的 Distro 集群，在⼀次客户端发起写操作的流程中，当注册非持久化的实例的写请求打到某台 Nacos 服务器时，Distro 集群处理的流程图如下。
>
> `步骤：`
>
> 1. 前置filter拦截请求，根据请求中包含的IP和port信息计算所属的Distro的责任节点，请将请求转发到责任节点
> 2. 责任节点将写请求进行解析
> 3. Distro协议定期执行Sync任务，将所负责的所有实例信息同步到其他节点上
>
> ![](D:/mmdz_blog-1/blog/MCA/springcloud_imgs/54ce524a5bd745ea96c51c1ae0f94536.png)
>
> **读操作**
>
> 由于每台机器上的数据都存放了全量数据，因此每一次读操作，Distro机器会直接从本地拉取数据
>
> ![](D:/mmdz_blog-1/blog/MCA/springcloud_imgs/a29e9cb7b4364c1a824c8dbc3f3b6c4d.png)

### 配置中心原理

> [Nacos-配置中心原理解析](https://blog.csdn.net/qq_33375499/article/details/125703382)

**动态刷新流程图（长轮询机制）**

![](D:/mmdz_blog-1/blog/MCA/springcloud_imgs/Picture.png)

**源码过程**

![image-20221122165815570](D:/mmdz_blog-1/blog/MCA/springcloud_imgs/image-20221122165815570.png)

> nacos 是采用了拉模式是一种特殊的拉模式，也就是我们通常听的**长轮询机制**。（长轮询：指客户端向服务端发起一个带**超时时间(timeout)**的Http请求，并在Http连接超时前，不主动断开连接，需要服务端主动回写数据，否则将一直重复以上过程。）
>
> Nacos就是利用了长轮询机制，客户端会开启一个线程，不断向服务端发起一个配置是否存在变更的请求(30s超时)；Nacos服务端收到请求后检查配置是否发生变化，如果没有则开启定时任务，*建立一个延时任务队列，每隔29.5s处理一个任务，处理任务便是花费0.5s检查配置有没有变更。不管有没有变更，都返回配置数据给客户端。*

#### 长轮询机制

> 在探讨Nacos长轮询机制前，先给大家普及一下几个概念：
>
> - 短轮询：指客户端每隔一段时间向服务器发起一次Http请求，服务端收到请求后，进行处理，然后返回给客户端。
>
> - 长轮询：指客户端向服务端发起一个带**超时时间(timeout)**的Http请求，并在Http连接超时前，不主动断开连接，需要服务端主动回写数据，否则将一直重复以上过程。
>
> Nacos就是利用了长轮询机制，客户端会开启一个线程，不断向服务端发起一个配置是否存在变更的请求(30s超时)，服务端收到请求后，如果配置不存在变更，并不会立即返回，而是当配置发生变更后，主动是否将消息回写给客户端。
>
> 客户端会存在两种情况：
>
> 1. 请求超时：无配置变更，开启下一次轮询请求
> 2. 服务器返回数据：解析服务器返回数据，通过Nameserver、dataId、group重新回去服务器配置，更新本地缓存，触发事件监听，开启下一次轮询请求。
>
> Nacos长轮询原理，分为了客户端 和 服务端

------

## Sentinel



## OpenFeign

在展开讲解工作原理前， 首先捋一下上文中， 我们完成 Feign 调用前所进行的操作：

1. 添加了 Spring Cloud OpenFeign 的依赖
2. 在 SpringBoot 启动类上添加了注解 `@EnableFeignCleints`
3. 按照 Feign 的规则定义接口 `DemoService`， 添加`@FeignClient` 注解
4. 在需要使用 Feign 接口 DemoService 的地方， 直接利用@Autowire 进行注入
5. 使用接口完成对服务端的调用

可以根据上面使用 Feign 的步骤大致猜测出整体的工作流程：

1. SpringBoot 应用启动时， 由针对 `@EnableFeignClient` 这一注解的处理逻辑触发程序扫描 classPath中所有被`@FeignClient` 注解的类， 这里以 `DemoService` 为例， 将这些类解析为 BeanDefinition 注册到 Spring 容器中
2. Sping 容器在为某些用的 Feign 接口的 Bean 注入 `DemoService` 时， Spring 会尝试从容器中查找 DemoService 的实现类
3. 由于我们从来没有编写过 `DemoService` 的实现类， 上面步骤获取到的 DemoService 的实现类必然是 feign 框架通过扩展 spring 的 Bean 处理逻辑， 为 `DemoService` 创建一个动态接口代理对象， 这里我们将其称为 `DemoServiceProxy` 注册到spring 容器中。
4. Spring 最终在使用到 `DemoService` 的 Bean 中注入了 `DemoServiceProxy` 这一实例。
5. 当业务请求真实发生时， 对于 `DemoService` 的调用被统一转发到了由 Feign 框架实现的 `InvocationHandler` 中， `InvocationHandler` 负责将接口中的入参转换为 HTTP 的形式， 发到服务端， 最后再解析 HTTP 响应， 将结果转换为 Java 对象， 予以返回。

## getway

Gateway 的目标，不仅提供统一的路由方式，并且基于 Filter 链的方式提供了网关基本的功能，例如：安全，监控/指标，和限流。

Gateway的三个核心组件： Route（路由）、Predicate（断言）、Filter（过滤器）。

Gateway的客户端回向Spring Cloud Gateway发起请求，请求首先会被HttpWebHandlerAdapter进行提取组装成网关的上下文，然后网关的上下文会传递到DispatcherHandler。DispatcherHandler是所有请求的分发处理器，DispatcherHandler主要负责分发请求对应的处理器，比如将请求分发到对应RoutePredicateHandlerMapping(路由断言处理器映射器）。路由断言处理映射器主要用于路由的查找，以及找到路由后返回对应的FilteringWebHandler。FilteringWebHandler主要负责组装Filter链表并调用Filter执行一系列Filter处理，然后把请求转到后端对应的代理服务处理，处理完毕后，将Response返回到Gateway客户端。

在Filter链中，通过虚线分割Filter的原因是，过滤器可以在转发请求之前处理或者接收到被代理服务的返回结果之后处理。所有的Pre类型的Filter执行完毕之后，才会转发请求到被代理的服务处理。被代理的服务把所有请求完毕之后，才会执行Post类型的过滤器。
![](spring_imgs\20190703211815129.png)