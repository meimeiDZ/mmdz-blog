# SpringBoot

## SpringBoot约定大于配置到底是什么意思？

> Spring Boot 是由 Pivotal 团队提供的全新框架，其设计目的是用来简化新 Spring 应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。spring Boot采用约定大约配置的方式，大量的减少了配置文件的使用。
>
> **使用SpringBoot的同学可能经常看到这几个字“约定大于配置”，那么它到底是什么意思呢？**
>
> 百度一下意思如下：
>
> 约定优于配置（convention over configuration），也称作按约定编程，是一种软件设计范式，旨在减少软件开发人员需做决定的数量，获得简单的好处，而又不失灵活性。
>
> 百度百科
>
> 在SpringBoot中，约定大于配置可以从以下两个方面来理解：
>
> 1. 开发人员仅需规定应用中不符合约定的部分
> 2. 在没有规定配置的地方，采用默认配置，以力求最简配置为核心思想
>
> 总的来说，上面两条都遵循了推荐默认配置的思想。当存在特殊需求的时候，自定义配置即可。这样可以大大的减少配置工作，这就是所谓的“约定”。
>
> **那么SpringBoot中有哪些约定呢？**
>
> 1. Maven的目录结构。默认有resources文件夹,存放资源配置文件。src-main-resources,src-main-java。默认的编译生成的类都在targe文件夹下面
> 2. spring boot默认的配置文件必须是，也只能是application.命名的yml文件或者properties文件，且唯一
> 3. application.yml中默认属性。[数据库](https://cloud.tencent.com/solution/database?from=10680)连接信息必须是以spring: datasource: 为前缀；多环境配置。该属性可以根据运行环境自动读取不同的配置文件；端口号、请求路径等

### SpringBoot与SpringMVC的区别

说得更简便一些：Spring 最初利用“工厂模式”（DI）和“代理模式”（AOP）解耦应用组件。大家觉得挺好用，于是按照这种模式搞了一个 MVC框架（一些用Spring 解耦的组件），用开发 web 应用（ SpringMVC ）。然后有发现每次开发都写很多样板代码，为了简化工作流程，于是开发出了一些“懒人整合包”（starter），这套就是 Spring Boot。

## Spring Boot 自动装配原理与实现

### 什么是 SpringBoot 自动装配？

> 1. **什么是自动装配**
>
>    自动装配就是把别人（官方）写好的config配置类加载到spring[容器](https://cloud.tencent.com/product/tke?from=10680)，然后根据这个配置类生成一些项目需要的bean对象。
>
> 2. **自动装配的过程**
>
>    Spring Boot 通过`@EnableAutoConfiguration`开启自动装配，通过 SpringFactoriesLoader 最终加载`META-INF/spring.factories`中的自动配置类实现自动装配，自动配置类其实就是通过`@Conditional`按需加载的配置类，想要其生效必须引入`spring-boot-starter-xxx`包实现起步依赖

### 如何实现一个 Starter？

> 实现一个Starter
>
> 总结自定义starter的主要流程和注意事项：
>
> 1. 规范是定义一个starter模块和autoconfigure模块，starter模块依赖autoconfigure模块，并提供启动所需的依赖。starter模块不提供服务。
>
>    ```xml
>        <dependencies>
>            <dependency>
>                <groupId>org.springframework.boot</groupId>
>                <artifactId>spring-boot-autoconfigure</artifactId>
>                <version>2.3.0.RELEASE</version>
>            </dependency>
>        </dependencies>
>    ```
>
> 2. 在命名上，一般是前缀-spring-boot-starter和前缀-spring-boot-autoconfigure，比如mybatis-spring-boot-starter。
>
> 3. 可以编写MyServiceProperties配置文件，按照自己的需求，提供可自定义的配置选项。
>
> 4. autoconfigure模块中编写自己的服务类，可以导入配置文件并使用其中的配置。
>
> 5. 自动配置类要标注@Configuration注解，用@EnableConfigurationProperties绑定自己的MyServiceProperties配置文件，可按照自己的需求，给出自动配置的条件、时机、顺序等。用@Bean把自己所要暴露的服务类提供出来，让其注入到Spring容器中。
>
> 6. 新建META-INF/spring.factories文件，把自己的配置类全类名绑定到Spring Boot自动配置类的全类名上。如下所示：
>
>    ```
>    # Auto Configure
>    org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
>    com.mmdz.starter.MyServiceAutoConfiguration
>    ```
