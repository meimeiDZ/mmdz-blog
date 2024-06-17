# Spring

## 《对线面试官》Spring基础

**面试官**：为什么使用Spring

> **Spring最根本的使命是解决企业级应用开发的复杂性，即简化Java开发。**
>
> Spring可以做很多事情，它为企业级开发提供给了丰富的功能，但是这些功能的底层都依赖于它的两个核心特性，也就是**依赖注入（dependency injection，DI）**和**面向切面编程（aspect-oriented programming，AOP）**。
>
> 1. 为了降低Java开发的复杂性，Spring采取了以下4种关键策略
>
> 2. 基于POJO的轻量级和最小侵入性编程；
> 3. 通过依赖注入和面向接口实现松耦合；
> 4. 基于切面和惯例进行声明式编程；

**面试官**：**要不你来讲讲Spring 的IOC和AOP你是怎么理解的呗？**

> **候选者**：我就先来讲讲Spring IOC？
>
> **候选者**：我个人理解下：Spring IOC 解决的是对象管理和对象依赖的问题。
>
> **候选者**：本来是我们自己手动new出来的对象，现在则把对象交给Spring的IOC容器管理
>
> **候选者**：IOC容器可以理解为一个对象工厂，我们都把该对象交给工厂，工厂管理这些对象的创建以及依赖关系
>
> **候选者**：等我们需要用对象的时候，从工厂里边获取就好了
>
> ------
>
> **候选者**：说起IOC，就可以在网上或书籍经常看到的两个概念，「控制反转」和「注入依赖」
>
> 
>
> **候选者**：「控制反转」指的就是：把原有自己掌控的事交给别人去处理
>
> **候选者**：它更多的是一种思想或者可以理解为设计模式
>
> **候选者**：比如：本来由我们自己new出来的对象，现在交由IOC容器，把对象的控制权交给它方了
>
> **候选者**：而「依赖注入」在我的理解下，它其实是「控制反转」的实现方式
>
> **候选者**：对象无需自行创建或者管理它的依赖关系，依赖关系将被「自动注入」到需要它们的对象当中去
>
> ------
>
> **候选者**：主要的好处在于「将对象集中统一管理」并且「降低耦合度」
>
> 
>
> **候选者**：**并且Spring核心不仅仅IOC啊，除了把对象创建出来，还有一整套的Bean生命周期管理**
>
> 

![](spring_imgs\20201111101112459.png)

### IOC 容器初始化

IOC 容器初始化包括BeanDefinition的Resource定位、载入和注册三个基本过程，如果我们了解如何编程式的使用 IOC 容器（编程式就是使用DefaultListableBeanFactory来创建容器），就可以清楚的看到Resource定义和载入过程的接口调用，在下面的内容中，我们将会详细分析这三个过程的实现。

IOC 容器的初始化包括的三个过程介绍如下：

1. **Resource定位过程**：这个Resource定位指的是BeanDefinition的资源定位，就是对开发者的配置文件(Xml)进行资源的定位，并将其封装成Resource对象。它由ResourceLoader通过统一的Resource接口来完成，这个Resource对各种形式的BeanDefinition的使用都提供了统一接口。比如：在文件系统中的Bean定义信息可以使用FileSystemResource来进行抽象。在类路径中的Bean定义信息可以使用ClassPathResource来进行抽象等等。这个定位过程类似于容器寻找数据的过程，就像用水捅装水先要把水找到一样。
2. **BeanDefinition的载入**：这个载入过程是将Resource 定位到的信息，表示成IoC容器内部的数据结构，而这个容器内部的数据结构就是BeanDefinition。
3. **BeanDefinition的注册**：这个注册过程把上面载入过程中解析得到的BeanDeftnition向IoC容器进行注册。注册过程是通过调用BeanDefinitionRegistry接口的实现来完成的。在IoC容器内部将BeanDefinition注人到一个HashMap中去，IoC容器就是通过这个HashMap来持有这些BeanDefinition数据的。

**面试官**：**那你继续来聊下Spring AOP呗？**

> **候选者**：Spring AOP 它是为解耦而生的，解决的是 非业务代码抽取的问题
>
> **候选者**：AOP 底层的技术是动态代理，在Spring内实现依赖的是BeanPostProcessor
>
> **候选者**：比如我们需要在方法上注入些「重复性」的非业务代码，就可以利用Spring AOP
>
> **候选者**：所谓的「面向切面编程」在我理解下其实就是在方法前后增加非业务代码
>
> 例如：一个系统都市由不同的组件组成，每个组件负责一块特定的功能，当然会存在很多组件是跟业务无关的，例如：日志、事务、权限等核心服务组件。
>
> 这些核心服务组件经常融入到具体的业务逻辑中，如果我们为每一个具体的业务逻辑操作都添加这样的代码，很明显代码冗余太多，因此我们需要将这些公共的代码逻辑抽象出来变成一个切面，然后注入到目标对象（具体业务）中去，AOP正是基于这样的一个思路实现的。通过动态代理的方式，将需要注入切面的对象进行代理，在进行调用的时候，将公共的逻辑直接添加进去，而不需要修改原有业务的逻辑代码，只需要在原来的业务逻辑基础之上做一些增强功能即可。

**AOP**

- JDK动态代理和CGLIB动态代理的区别

  Spring AOP中的动态代理主要有两种方式，JDK动态代理和CGLIB动态代理：

  - JDK动态代理只提供接口的代理，不支持类的代理。核心InvocationHandler接口和Proxy类，InvocationHandler 通过invoke()方法反射来调用目标类中的代码，动态地将横切逻辑和业务编织在一起；接着，Proxy利用 InvocationHandler动态创建一个符合某一接口的的实例, 生成目标类的代理对象。

  - 如果代理类没有实现 InvocationHandler 接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library），是一个代码生成的类库，可以在运行时动态的生成指定类的一个子类对象，并覆盖其中特定方法并添加增强代码，从而实现AOP。CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为final，那么它是无法使用CGLIB做动态代理的。


  静态代理与动态代理区别在于生成AOP代理对象的时机不同，相对来说AspectJ的静态代理方式具有更好的性能，但是AspectJ需要特定的编译器进行处理，而Spring AOP则无需特定的编译器处理

- 解释一下Spring AOP里面的几个名词

  1. 切面（Aspect）：切面是通知和切点的结合。通知和切点共同定义了切面的全部内容。 在Spring AOP中，切面可以使用通用类（基于模式的风格） 或者在普通类中以 @AspectJ 注解来实现。

  2. 连接点（Join point）：程序执行期间的某一个点，例如执行方法或处理异常时候的点。在 Spring AOP 中，连接点总是表示方法的执行。

  3. 通知（Advice）：程序执行期间的某一个点，例如执行方法或处理异常时候的点。在 Spring AOP 中，连接点总是表示方法的执行。

  4. 切入点（Pointcut）：一个匹配连接点（Join point）的谓词表达式。通知（Advice）与切点表达式关联，并在切点匹配的任何连接点（Join point）（例如，执行具有特定名称的方法）上运行。切点是匹配连接点（Join point）的表达式的概念，是AOP的核心，并且 Spring 默认使用 AspectJ 作为切入点表达式语言。
  5. 引入（Introduction）：引入允许我们向现有类添加新方法或属性。

  6. 目标对象（Target Object）：被一个或者多个切面（Aspect）通知的对象，也就是需要被 AOP 进行拦截对方法进行增强（使用通知）的对象，也称为被通知的对象。由于在 AOP 里面使用运行时代理，所以目标对象一直是被代理的对象。
  7. AOP proxy（AOP 代理）：为了实现切面（Aspect）功能使用 AOP 框架创建一个对象，在 Spring 框架里面一个 AOP 代理要么指 JDK 动态代理，要么指 CgLIB 代理。
  8. 织入（Weaving）：AOP proxy（AOP 代理）：为了实现切面（Aspect）功能使用 AOP 框架创建一个对象，在 Spring 框架里面一个 AOP 代理要么指 JDK 动态代理，要么指 CgLIB 代理。

- Spring通知有哪些类型？

  在AOP术语中，切面的工作被称为通知，实际上是程序执行时要通过SpringAOP框架触发的代码段。

  Spring切面可以应用5种类型的通知：

  1. 前置通知（Before）：在目标方法被调用之前调用通知功能；
  2. 后置通知（After）：在目标方法完成之后调用通知，此时不会关心方法的输出是什么；
  3. 返回通知（After-returning ）：在目标方法成功执行之后调用通知；
  4. 异常通知（After-throwing）：在目标方法抛出异常后调用通知；
  5. 环绕通知（Around）：通知包裹了被通知的方法，在被通知的方法调用之前和调用之后执行自定义的行为。

- 多个切面的执行顺序如何控制？

  1. 通常使用`@Order` 注解直接定义切面顺序
  2. 实现`Ordered` 接口重写 `getOrder` 方法。

------

## Bean生命周期⭐

**面试官**：**今天要不来聊聊Spring对Bean的生命周期管理？**

> 对于 Spring Bean 的生命周期来说：实例化前准备 -> 实例化 -> 属性赋值 -> 初始化 -> 销毁 
>
> - 实例化前准备
>
>   **候选者**：Spring在启动的时候需要「扫描」在XML/注解/JavaConfig 中需要被Spring管理的Bean信息
>
>   **候选者**：随后，会将这些信息封装成BeanDefinition，最后会把这些信息放到一个beanDefinitionMap中
>
>   **候选者**：我记得这个Map的key应该是beanName，value则是BeanDefinition对象
>
>   **候选者**：到这里其实就是把定义的元数据加载起来，目前真实对象还没实例化
>
>   **候选者**：接着会遍历这个beanDefinitionMap，执行BeanFactoryPostProcessor这个Bean工厂后置处理器的逻辑
>
>   **候选者**：比如说，我们平时定义的占位符信息，就是通过BeanFactoryPostProcessor的子类PropertyPlaceholderConfigurer进行注入进去
>
>   **候选者**：当然了，这里我们也可以自定义BeanFactoryPostProcessor来对我们定义好的Bean元数据进行获取或者修改
>
>   **候选者**：只是一般我们不会这样干，实际上也很有少的使用场景
>
>   ![](spring_imgs\640adewfewgadgsfdsgfd.jpg)
>
>   **候选者**：BeanFactoryPostProcessor后置处理器执行完了以后，就到了实例化对象啦
>
>   【其中核心的方法 **真正的创建Bean** 就是 doCreateBean() 】
>
> - 实例化
>
>   createBeanInstance（）
>
>   **候选者**：在Spring里边是通过反射来实现的，一般情况下会通过反射选择合适的构造器来把对象实例化
>
>   **候选者**：但这里把对象实例化，只是把对象给创建出来，而对象具体的属性是还没注入的。
>
>   **候选者**：比如我的对象是UserService，而UserService对象依赖着SendService对象，这时候的SendService还是null的
>
>   **候选者**：所以，下一步就是把对象的相关属性给注入
>
> - 属性赋值
>
>   populateBean（）
>
>   **候选者**：相关属性注入完之后，往下接着就是初始化的工作了
>
> - 初始化
>
>   initializeBean（）
>
>   **候选者**：首先判断该Bean是否实现了Aware相关的接口，如果存在则填充相关的资源
>
>   **候选者**：比如我这边在项目用到的：我希望通过代码程序的方式去获取指定的Spring Bean
>
>   **候选者**：我们这边会抽取成一个工具类，去实现ApplicationContextAware接口，来获取ApplicationContext对象进而获取Spring Bean
>
>   ![图片](spring_imgs\640sadsafdSS.png)
>
>   **候选者**：Aware相关的接口处理完之后，就会到BeanPostProcessor后置处理器啦
>
>   **候选者**：BeanPostProcessor后置处理器有两个方法，一个是before，一个是after（那肯定是before先执行、after后执行）
>
>   ![图片](spring_imgs\640deqfsafafagd.png)
>
>   **候选者**：这个BeanPostProcessor后置处理器是AOP实现的关键（关键子类AnnotationAwareAspectJAutoProxyCreator）
>
>   **候选者**：所以，执行完Aware相关的接口就会执行BeanPostProcessor相关子类的before方法
>
>   **候选者**：BeanPostProcessor相关子类的before方法执行完，则执行init相关的方法，比如说@PostConstruct、实现了InitializingBean接口、定义的init-method方法
>
>   **候选者**：当时我还去官网去看他们的被调用「执行顺序」分别是：@PostConstruct、实现了InitializingBean接口以及init-method方法
>
>   **候选者**：这些都是Spring给我们的「扩展」，像@PostConstruct我就经常用到
>
>   ![图片](spring_imgs\640saegasgfsdagfdsaf.png)
>
>   **候选者**：比如说：对象实例化后，我要做些初始化的相关工作或者就启个线程去Kafka拉取数据
>
>   **候选者**：等到init方法执行完之后，就会执行BeanPostProcessor的after方法
>
>   **候选者**：基本重要的流程已经走完了，我们就可以获取到对象去使用了
>
> - 销毁
>
>   registerDisposableBeanIfNecessary（）
>
>   **如果bean实现了DisposableBean接口，Spring将调用它的destroy()接口方法。同样，如果bean使用destroy-method声明了销毁方法，该方法也会被调用。**
>
> ![](spring_imgs\374544735d0dd4104601ef98749c7f89.jpg)
>
> [(28条消息) 一文读懂 Spring Bean 的生命周期_老周聊架构的博客-CSDN博客_springbean的生命周期](https://blog.csdn.net/riemann_/article/details/118500805)
>
> ```java
>// AbstractAutowireCapableBeanFactory.java
> protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
> throws BeanCreationException {
> 
> // 1. 实例化
>  BeanWrapper instanceWrapper = null;
> if (instanceWrapper == null) {
>      instanceWrapper = createBeanInstance(beanName, mbd, args);
> }
> 
> Object exposedObject = bean;
>  try {
>     // 2. 属性赋值
>      populateBean(beanName, mbd, instanceWrapper);
>     // 3. 初始化
>      exposedObject = initializeBean(beanName, exposedObject, mbd);
> }
> 
> // 4. 销毁-注册回调接口
>  try {
>     registerDisposableBeanIfNecessary(beanName, bean, mbd);
>  }
>
>  return exposedObject;
>}
> ```
> 

**面试官**：**你看过Spring是怎么解决循环依赖的吗？**

> **候选者**：嗯，这块我也是看过的，其实也是在Spring的生命周期里面嘛
>
> **候选者**：从上面我们可以知道，对象属性的注入在对象实例化之后的嘛。
>
> **候选者**：它的大致过程是这样的：
>
> **候选者**：首先A对象实例化，然后对属性进行注入，发现依赖B对象
>
> **候选者**：B对象此时还没创建出来，所以转头去实例化B对象
>
> **候选者：**B对象实例化之后，发现需要依赖A对象，那A对象已经实例化了嘛，所以B对象最终能完成创建
>
> **候选者**：B对象返回到A对象的属性注入的方法上，A对象最终完成创建
>
> **候选者**：上面就是大致的过程；
>
> **面试官**：**听起来你还会原理哦？**
>
> **候选者**：Absolutely
>
> **候选者**：至于原理，其实就是用到了三级的缓存
>
> **候选者**：所谓的三级缓存其实就是三个Map…首先明确一定，我对这里的三级缓存定义是这样的：
>
> **候选者**：singletonObjects（一级，日常实际获取Bean的地方）；
>
> **候选者**：earlySingletonObjects（二级，还没进行属性注入，由三级缓存放进来）；
>
> **候选者**：singletonFactories（三级，Value是一个对象工厂）；
>
> ![图片](spring_imgs\640dsafaewefewa.png)
>
> **候选者**：再回到刚才讲述的过程中，A对象实例化之后，属性注入之前，其实会把A对象放入三级缓存中
>
> **候选者**：key是BeanName，Value是ObjectFactory
>
> **候选者**：等到A对象属性注入时，发现依赖B，又去实例化B时
>
> **候选者**：B属性注入需要去获取A对象，这里就是从三级缓存里拿出ObjectFactory，从ObjectFactory得到对应的Bean（就是对象A）
>
> **候选者**：把三级缓存的A记录给干掉，然后放到二级缓存中
>
> **候选者**：显然，二级缓存存储的key是BeanName，value就是Bean（这里的Bean还没做完属性注入相关的工作）
>
> **候选者**：等到完全初始化之后，就会把二级缓存给remove掉，塞到一级缓存中
>
> **候选者**：我们自己去getBean的时候，实际上拿到的是一级缓存的
>
> **候选者**：大致的过程就是这样
>
> **面试官**：**那我想问一下，为什么是三级缓存？**
>
> **候选者**：首先从第三级缓存说起（就是key是BeanName，Value为ObjectFactory）
>
> **候选者**：我们的对象是单例的，有可能A对象依赖的B对象是有AOP的（B对象需要代理）
>
> **候选者**：假设没有第三级缓存，只有第二级缓存（Value存对象，而不是工厂对象）
>
> **候选者**：那如果有AOP的情况下，岂不是在存入第二级缓存之前都需要先去做AOP代理？这不合适嘛
>
> **候选者**：这里肯定是需要考虑代理的情况的，比如A对象是一个被AOP增量的对象，B依赖A时，得到的A肯定是代理对象的
>
> **候选者**：所以，三级缓存的Value是ObjectFactory，可以从里边拿到代理对象
>
> **候选者**：而二级缓存存在的必要就是为了性能，从三级缓存的工厂里创建出对象，再扔到二级缓存（这样就不用每次都要从工厂里拿）
>
> **候选者**：应该很好懂吧？





### 解释Spring支持的几种bean的作用域

> Spring:框架支持以下五种bean的作用域：
>
> 1. singleton : bean在每个Spring ioc 容器中只有一个实例。
> 2. prototype：一个bean的定义可以有多个实例。
> 3. request：每次http请求都会创建一个bean，该作用域仅在基于web的Spring ApplicationContext情形下有效。
> 4. session：在一个HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。
> 5. global-session：在一个全局的HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。

### BeanFactory 和 FactoryBean 的区别

> BeanFactory：Spring 容器最核心也是最基础的接口，本质是个工厂类，用于管理 bean 的工厂，最核心的功能是加载 bean，也就是 getBean 方法，通常我们不会直接使用该接口，而是使用其子接口。
>
> FactoryBean：该接口以 bean 样式定义，但是它不是一种普通的 bean，它是个工厂 bean，实现该接口的类可以自己定义要创建的 bean 实例，只需要实现它的 getObject 方法即可。
>
> FactoryBean 被广泛应用于 Java 相关的中间件中，如果你看过一些中间件的源码，一定会看到 FactoryBean 的身影。
>
> 一般来说，都是通过 FactoryBean#getObject 来返回一个代理类，当我们触发调用时，会走到代理类中，从而可以在代理类中实现中间件的自定义逻辑，比如：RPC 最核心的几个功能，选址、建立连接、远程调用，还有一些自定义的监控、限流等等。

### BeanFactory 和 ApplicationContext有什么区别？

> BeanFactory和ApplicationContext是Spring的两大核心接口，都可以当做Spring的容器。其中ApplicationContext是BeanFactory的子接口。
>
> 依赖关系
>
> BeanFactory：是Spring里面最底层的接口，包含了各种Bean的定义，读取bean配置文档，管理bean的加载、实例化，控制bean的生命周期，维护bean之间的依赖关系。
>
> ApplicationContext接口作为BeanFactory的派生，除了提供BeanFactory所具有的功能外，还提供了更完整的框架功能：
>
> - 继承MessageSource，因此支持国际化。
>
> - 统一的资源文件访问方式。
>
> - 提供在监听器中注册bean的事件。
>
> - 同时加载多个配置文件。
>
> - 载入多个（有继承关系）上下文 ，使得每一个上下文都专注于一个特定的层次，比如应用的web层。
>
>
> 加载方式
>
> BeanFactroy采用的是延迟加载形式来注入Bean的，即只有在使用到某个Bean时(调用getBean())，才对该Bean进行加载实例化。这样，我们就不能发现一些存在的Spring的配置问题。如果Bean的某一个属性没有注入，BeanFacotry加载后，直至第一次使用调用getBean方法才会抛出异常。
>
> ApplicationContext，它是在容器启动时，一次性创建了所有的Bean。这样，在容器启动时，我们就可以发现Spring中存在的配置错误，这样有利于检查所依赖属性是否注入。 ApplicationContext启动后预载入所有的单实例Bean，通过预载入单实例bean ,确保当你需要的时候，你就不用等待，因为它们已经创建好了。
>
> 相对于基本的BeanFactory，ApplicationContext 唯一的不足是占用内存空间。当应用程序配置Bean较多时，程序启动较慢。





## 事务

### Spring 管理事务的方式有几种？

> **编程式事务** ： 在代码中硬编码(不推荐使用) : 通过 `TransactionTemplate`或者 `TransactionManager` 手动管理事务，实际应用中很少使用，但是对于你理解 Spring 事务管理原理有帮助。
>
> **声明式事务** ： 在 XML 配置文件中配置或者直接基于注解（推荐使用） : 实际是通过 AOP 实现（基于`@Transactional` 的全注解方式使用最多）

### 说一下Spring的事务传播行为

> 1、REQUIRED：Spring 默认的事务传播级别，如果上下文中已经存在事务，那么就加入到事务中执行，如果当前上下文中不存在事务，则新建事务执行。
>
> 2）REQUIRES_NEW：每次都会新建一个事务，如果上下文中有事务，则将上下文的事务挂起，当新建事务执行完成以后，上下文事务再恢复执行。
>
> 3）SUPPORTS：如果上下文存在事务，则加入到事务执行，如果没有事务，则使用非事务的方式执行。
>
> 4）MANDATORY：上下文中必须要存在事务，否则就会抛出异常。
>
> 5）NOT_SUPPORTED ：如果上下文中存在事务，则挂起事务，执行当前逻辑，结束后恢复上下文的事务。
>
> 6）NEVER：上下文中不能存在事务，否则就会抛出异常。
>
> 7）NESTED：嵌套事务。如果上下文中存在事务，则嵌套事务执行，如果不存在事务，则新建事务。

### 说一下 spring 的事务隔离？

> Spring 的事务隔离级别底层其实是基于数据库的，Spring 并没有自己的一套隔离级别。
>
> - DEFAULT：使用数据库的默认隔离级别。
>
> - READ_UNCOMMITTED：读未提交，最低的隔离级别，会读取到其他事务还未提交的内容，存在脏读。
>
> - READ_COMMITTED：读已提交，读取到的内容都是已经提交的，可以解决脏读，但是存在不可重复读。
>
> - REPEATABLE_READ：可重复读，在一个事务中多次读取时看到相同的内容，可以解决不可重复读，但是存在幻读。
>
> - SERIALIZABLE：串行化，最高的隔离级别，对于同一行记录，写会加写锁，读会加读锁。在这种情况下，只有读读能并发执行，其他并行的读写、写读、写写操作都是冲突的，需要串行执行。可以防止脏读、不可重复度、幻读，没有并发事务问题。

### Spring 的事务隔离级别是如何做到和数据库不一致的？

> 比如数据库是可重复读，Spring 是读已提交，这是怎么实现的？
>
> Spring 的事务隔离级别本质上还是通过数据库来控制的，具体是在执行事务前先执行命令修改数据库隔离级别，命令格式如下：
>
> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED

### Spring事务的实现方式和实现原理（如何回滚的）⭐

> Spring事务的本质其实就是数据库对事务的支持，没有数据库的事务支持，spring是无法提供事务功能的。真正的数据库层的事务提交和回滚是通过binlog或者redo log实现的。Spring会在事务开始时，根据当前环境中设置的隔离级别，调整数据库隔离级别，由此保持一致。
>
> **实现方式：**
>
> - 编程式
>
> 在代码中手动设置，比较细致
>
> - 声明式
>
> 使用@Transactional注解，对该注解修饰方法开启事务
>
> **实现原理：**
> 
>    1. 在一个方法上加了@Transactional注解后，Spring会基于这个类生成一个代理对象，会将这个代理对象作为bean提交到IOC容器中
>    2. 在生成这个类的代理对象方法时，如果监测到这个方法上有@Transactional注解，那么代理逻辑会将事务自动提交设置为false
>    3. 然后再去执行原来的业务方法时，如果原来的业务方法没有出现异常，代理逻辑就会将事务提交。如果出现异常，就会回滚。
>    4. 所以说我们平时需要注意的是必须使用Spring容器中被代理的对象才能实现事务，否则事务会失效

### @Transactional(rollbackFor = Exception.class)注解了解吗？

> `Exception` 分为运行时异常 `RuntimeException` 和非运行时异常。事务管理对于企业应用来说是至关重要的，即使出现异常情况，它也可以保证数据的一致性。
>
> 当 `@Transactional` 注解作用于类上时，该类的所有 public 方法将都具有该类型的事务属性，同时，我们也可以在方法级别使用该标注来覆盖类级别的定义。如果类或者方法加了这个注解，那么这个类里面的方法抛出异常，就会回滚，数据库里面的数据也会回滚。
>
> 在 `@Transactional` 注解中如果不配置`rollbackFor`属性,那么事务只会在遇到`RuntimeException`的时候才会回滚，加上 `rollbackFor=Exception.class`,可以让事务在遇到非运行时异常时也回滚。

### Spring事务失效

> 1. 未启用spring事务管理功能
>
>    @EnableTransactionManagement 注解用来启用spring事务自动管理事务的功能，这个注解千万不要忘记写了。
>
> 2. 方法不是public类型的
>
>    @Transaction 可以用在类上、接口上、public方法上，如果将@Trasaction用在了非public方法上，事务将无效。
>
> 3. 数据源未配置事务管理器
>
>    spring是通过事务管理器了来管理事务的，一定不要忘记配置事务管理器了，要注意为每个数据源配置一个事务管理器
>
> 4. 自身调用问题
>
>    spring是通过aop的方式，对需要spring管理事务的bean生成了代理对象，然后通过代理对象拦截了目标方法的执行，在方法前后添加了事务的功能，所以必须通过代理对象调用目标方法的时候，事务才会起效。
>
> 5. 异常类型错误
>
>    spring事务回滚的机制：对业务方法进行try catch，当捕获到有指定的异常时，spring自动对事务进行回滚，那么问题来了，哪些异常spring会回滚事务呢？
>
>    并不是任何异常情况下，spring都会回滚事务，默认情况下，RuntimeException和Error的情况下，spring事务才会回滚。
>
> 6. 异常被吞了
>
>    当业务方法抛出异常，spring感知到异常的时候，才会做事务回滚的操作，若方法内部将异常给吞了，那么事务无法感知到异常了，事务就不会回滚了。
>
> 7. 业务和spring事务代码必须在一个线程中
>
>    spring事务实现中使用了ThreadLocal，ThreadLocal大家应该知道吧，可以实现同一个线程中数据共享，必须是同一个线程的时候，数据才可以共享，这就要求业务代码必须和spring事务的源码执行过程必须在一个线程中，才会受spring事务的控制，比如下面代码，方法内部的子线程内部执行的事务操作将不受m1方法上spring事务的控制，这个大家一定要注意

### Spring 注解

> - 组件
>
>   - @Controller
>   - @Service
>   - @Repository
>   - @Component
>
> - 注入
>
>   - @Autowired
>   - @Qualifier
>   - @Resource
>   - @Value：为对应的属性注入值。
>
> - 配置
>
>   - @Bean
>   - @Configuration：声明当前类为配置类，相当于 xml 形式的 Spring 配置。
>   - @ComponentScan：用于对 Component 组件进行扫描。
>   - @RunWith：运行器，Spring 中通常用于对 Junit 的支持。
>   - @Scope：用来配置 Spring Bean 的作用域，它标识 Bean 的作用域。
>
> - 参数
>
>   - @RequestMapping
>   - @ResponseBody
>   - @RestController
>   - @RequestParam
>
> - 事务（@Transactional）
>
>   通过这个注解可以声明事务，可以添加在类上或者方法上。
>
> - AOP
>
>   - @Aspect：声明一个切面(类上)使用 @After、@Before、@Around 定义通知(advice)，可直接将拦截规则（切点）作为参数。
>   - @PointCut：声明切点，在 java 配置类中使用。
>   - @After：在方法执行之后执行(方法上)。
>   - @Before：在方法执行之前执行(方法上)。
>   - @Around：在方法执行之前与之后执行(方法上)。



### @Resource 和 @Autowire 的区别

> 1、@Resource 和 @Autowired 都可以用来装配 bean
>
> 2、@Autowired 默认按类型装配，默认情况下必须要求依赖对象必须存在，如果要允许null值，可以设置它的required属性为false。
>
> 3、@Resource 如果指定了 name 或 type，则按指定的进行装配；如果都不指定，则优先按名称装配，当找不到与名称匹配的 bean 时才按照类型进行装配。

### @Autowire 怎么使用名称来注入

> 配合 @Qualifier 使用，如下所示：
>
> ```java
> @Component
> public class Test {
>     @Autowired
>     @Qualifier("userService")
>     private UserService userService;
> }
> ```

### @PostConstruct 修饰的方法里用到了其他 bean 实例，会有问题吗

> 该题可以拆解成下面3个问题：
>
> 1、@PostConstruct 修饰的方法被调用的时间
>
> 2、bean 实例依赖的其他 bean 被注入的时间，也可理解为属性的依赖注入时间
>
> 3、步骤2的时间是否早于步骤1：如果是，则没有问题，如果不是，则有问题
>
> 解析：
>
> 1、PostConstruct 注解被封装在 CommonAnnotationBeanPostProcessor中，具体触发时间是在 postProcessBeforeInitialization 方法，从 doCreateBean 维度看，则是在 initializeBean 方法里，属于初始化 bean 阶段。
>
> 2、属性的依赖注入是在 populateBean 方法里，属于属性填充阶段。
>
> 3、属性填充阶段位于初始化之前，所以本题答案为没有问题。

### bean 的 init-method 属性指定的方法里用到了其他 bean 实例，会有问题吗（5分）

> 该题同上面这题类似，只是将 @PostConstruct 换成了 init-method 属性。
>
> 答案是不会有问题。同上面一样，init-method 属性指定的方法也是在 initializeBean 方法里被触发，属于初始化 bean 阶段。
>

### 要在 Spring IoC 容器构建完毕之后执行一些逻辑，怎么实现

> 1、比较常见的方法是使用事件监听器，实现 ApplicationListener 接口，监听 ContextRefreshedEvent 事件。
>
> 2、还有一种比较少见的方法是实现 SmartLifecycle 接口，并且 isAutoStartup 方法返回 true，则会在 finishRefresh() 方法中被触发。
>
> 两种方式都是在 finishRefresh 中被触发，SmartLifecycle在ApplicationListener之前。
>

### Spring 中的常见扩展点有哪些

> 1. ApplicationContextInitializer
>
>    initialize 方法，在 Spring 容器刷新前触发，也就是 refresh 方法前被触发。
>
> 2. BeanFactoryPostProcessor
>
>    postProcessBeanFactory 方法，在加载完 Bean 定义之后，创建 Bean 实例之前被触发，通常使用该扩展点来加载一些自己的 bean 定义。
>
> 3. BeanPostProcessor
>
>    postProcessBeforeInitialization 方法，执行 bean 的初始化方法前被触发；postProcessAfterInitialization 方法，执行 bean 的初始化方法后被触发。
>
> 4. PostConstruct
>
>    该注解被封装在 CommonAnnotationBeanPostProcessor 中，具体触发时间是在 postProcessBeforeInitialization 方法。
>
> 5. InitializingBean
>
>    afterPropertiesSet 方法，在 bean 的属性填充之后，初始化方法（init-method）之前被触发，该方法的作用基本等同于 init-method，主要用于执行初始化相关操作。
>
> 6. ApplicationListener，事件监听器
>
>    onApplicationEvent 方法，根据事件类型触发时间不同，通常使用的 ContextRefreshedEvent 触发时间为上下文刷新完毕，通常用于 IoC 容器构建结束后处理一些自定义逻辑。
>
> 7. PreDestroy
>
>    该注解被封装在 DestructionAwareBeanPostProcessor 中，具体触发时间是在 postProcessBeforeDestruction 方法，也就是在销毁对象之前触发。
>
> 8. DisposableBean
>
>    destroy 方法，在 bean 的销毁阶段被触发，该方法的作用基本等同于
>
>    destroy-method，主用用于执行销毁相关操作。

### Spring中如何让两个bean按顺序加载？

> 1、使用 @DependsOn、depends-on
>
> 2、让后加载的类依赖先加载的类
>
> ```java
> @Component
> public class A {
>     @Autowire
>     private B b;
> }
> ```
>
> 3、使用扩展点提前加载，例如：BeanFactoryPostProcessor
>
> ```java
> @Component
> public class TestBean implements BeanFactoryPostProcessor {
>   @Override
>   public void postProcessBeanFactory(ConfigurableListableBeanFactory 
>           configurableListableBeanFactory) throws BeansException {
>       // 加载bean
>       beanFactory.getBean("a");
>   }
> ｝
> ```

### 使用 Mybatis 时，调用 DAO接口时是怎么调用到 SQL 的

> 详细的解析见：《面试题：mybatis 中的 DAO 接口和 XML 文件里的 SQL 是如何建立关系的？》
>
> 简单点说，当我们使用 Spring+MyBatis 时：
>
> 1、DAO接口会被加载到 Spring 容器中，通过动态代理来创建
>
> 2、XML中的SQL会被解析并保存到本地缓存中，key是SQL 的 namespace + id，value 是SQL的封装
>
> 3、当我们调用DAO接口时，会走到代理类中，通过接口的全路径名，从步骤2的缓存中找到对应的SQL，然后执行并返回结果

