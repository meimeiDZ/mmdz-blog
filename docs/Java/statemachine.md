# 状态机

> [!tip]
>
> 很多业务对象都是有状态的，且这些对象的状态又多又复杂。硬编码的方式已经不适合管理当前复杂业务对象的状态。为了适配复杂多变的业务，可以使用状态机来管理状态，统一定义业务对象状态和状态的流转。
>
> 状态机是工作流（WorkFlow）的一种类型，包括顺序工作流（Sequential）和状态机工作流（State Machine）。状态机是有限状态自动机的简称，是现实事物运行规则抽象而成的一个数学模型。

------



### 状态机框架选型

> 开源状态机
>
> 着重看了两个状态机引擎的实现，一个是 `Spring StateMachine`，一个是 `Squirrel StateMachine`，他们的优点是功能很完备，缺点也是功能很完备。
>
> 就实际项目而言（**其实大部分项目都是如此**），实在不需要那么多状态机的高级玩法：比如状态的嵌套（Substate），状态的并行（Parallel，Fork，Join）、子状态机等等。
>
> **且开源状态机大多都是有状态的，使用分布式多线程来实现，无法做到线程安全，代码需要用到锁同步**。每一次状态机在接收请求的时候，都不得不重新 Build 一个新的状态机实例，就导致开源状态机性能差。
>
> |                           | 优点                    | 缺点                     |
> | :------------------------ | :---------------------- | :----------------------- |
> | **Spring StateMachine**   | 1.强大的生命周期管理    | 1.学习曲线较陡峭         |
> |                           | 2.易于集成              | 2.可能增加项目复杂性     |
> |                           | 3.良好的文档和社区支持2 |                          |
> | **Squirrel StateMachine** | 1.轻量级                | 1.功能相对有限           |
> |                           | 2.简单易用              |                          |
> |                           | 3.性能高效              |                          |
> | **Cola-StateMachine**     | 1.高度可扩展            | 1.文档和社区支持相对较少 |
> |                           | 2.语义清晰、可读性强    |                          |
> |                           | 3.线程安全              |                          |
>
> ?> **最终我选用了一个开源的状态机引擎 Cola-StateMachine。**

------



### Cola-StateMachine 简介

> github链接: [cola-components](https://github.com/alibaba/COLA/tree/master/cola-components/cola-component-statemachine).		gitcode链接: [cola-components](https://gitcode.net/mirrors/alibaba/cola?utm_source=csdn_github_accelerator).
>
> 
>
> **Cola-StateMachine的核心概念如下：**
>
> 1. State：状态
>
> 2. Event：事件，状态由事件触发，引起变化
> 3. Transition：流转，表示从一个状态到另一个状态
> 4. External Transition：外部流转，两个不同状态之间的流转
> 5. Internal Transition：内部流转，同一个状态之间的流转
> 6. Condition：条件，表示是否允许到达某个状态
> 7. Action：动作，到达某个状态之后，可以做什么
> 8. StateMachine：状态机

`Cola-StateMachine`和其他开源状态机框架最大的一个亮点，就在于**解决了性能问题**，将状态机变成无状态的。

> [!tip]
>
> **Cola-StateMachine为什么是无状态的？**
>
> 首先，我们得知道，为什么其他开源状态机是有状态的，那是因为状态机内部维护了两个状态：**初始状态**与**当前状态**。因为这些状态机需要依靠这两个状态来做出决策。
>
> 但是`Cola-StateMachine`将这两个状态移除了，也就导致无法获取状态机的初始状态与当前状态。但是实际上我们也并不需要知道，只需要接收目标的状态，然后检查条件，解决执行事件即可，然后返回目标状态，然后根据目标状态更新Order状态即可。
>
> 这其实就是一个状态流转的DSL表达式，全过程都是无状态的。
>

------



### Cola-StateMachine 状态流转类型

> [!tip]
>
> 案例：[Cola-StateMachine状态机的实战使用](https://cloud.tencent.com/developer/article/2350454)、[Cola-StateMachine的介绍与使用](https://blog.csdn.net/weixin_51146329/article/details/133010615)



> - ##### **单个起始状态-外部状态流转**
>
>   ```java
>       // 待支付状态->待发货状态 —— 支付
>   	builder.externalTransition() // 外部流转
>               .from(OrderStateEnum.WAIT_PAYMENT)  // 起始状态
>               .to(OrderStateEnum.WAIT_DELIVER)  // 目标状态
>               .on(OrderEventEnum.PAYED)  // 事件
>               .when(checkCondition()) // 流转需要校验的条件，校验不通过不会进行doAction
>               .perform(doAction());  //执行流转操作 这个action 我们可以按自己所需修改
>   ```
>
>   描述：订单起始状态为“初始化”，当发生“创建订单”事件执行状态转义，当满足 CheckCondition 时，执行CreateOrderAction。
>
> - ##### **内部状态流转**
>
>   ```java
>     /**
>      * 部分发货: 部分发货
>      * internalTransition : 内部流转
>      */
>     builder.internalTransition()
>       .within(OrderStatusEnum.PART_DELIVERY)
>       .on(OrderEventEnum.DELIVERY_PART)
>       .when(checkOrder())
>       .perform(deliverOrderAction);
>   ```
>
>   描述：订单起始状态发生在部分发货状态下，当发生发货时执行状态流转，当满足 CheckCondition(订单部分发货条件)时，执行DeliverOrderAction，执行成功则返回状态：部分发货
>
> - ##### **多个起始状态-外部状态流转**
>
>   ```java
>     /**
>      * 取消订单: 待支付、待发货、待收货 -> 待支付
>      * externalTransitions : 用于多个流转的构建器
>      */
>     builder.externalTransitions()
>       .fromAmong(OrderStatusEnum.PAY_ONLINE,OrderStatusEnum.WAITING_FOR_RECEIVED,OrderStatusEnum.WAITING_DELIVERY)
>       .to(OrderStatusEnum.CANCEL)
>       .on(OrderEventEnum.CANCEL_ORDER)
>       .when(checkOrder())
>       .perform(cancelOrderAction);
>   ```
>
>   描述：订单起始状态为：待支付、待发货或待收货下，当发生取消订单事件时，当满足 CheckCondition 时，执行 CancelOrderAction，返回状态 CANCEL_ORDER。

------



### Cola-StateMachine 实战

> 1. ***状态流转***
>
>    ```
>    待支付 ---(支付)--- 待发货 ---(发货)--- 待收货 ---(收货)--- 已完成
>      |                 |
>      | (未支付)         | (退款)
>      |                 |
>    已完成             已完成
>    ```
>
> 2. ***引入依赖***
>
>    ```pom
>    <dependency>
>        <groupId>com.alibaba.cola</groupId>
>        <artifactId>cola-component-statemachine</artifactId>
>        <version>4.3.1</version>
>    </dependency>
>    ```
>
> 3. ***编写`Cola-StateMachine`配置***
>
>    ```java
>    @Slf4j
>    @Configuration
>    public class ColaStatemachineConf {
>    
>        /**
>         * 订单状态流转 （简单绘制）
>         * <p>
>         * 待支付 ---(支付)--- 待发货 ---(发货)--- 待收货 ---(收货)--- 已完成
>         *   |                 |
>         *   | (未支付)         | (退款)
>         *   |                 |
>         * 已完成             已完成
>         * @return
>         */
>        @Bean
>        public StateMachine<OrderStateEnum, OrderEventEnum, Order> orderStateMachine() {
>            String ORDER_STATE_MACHINE = "orderStateMachine";
>            // 第一步：生成一个状态机builder
>            StateMachineBuilder<OrderStateEnum, OrderEventEnum, Order> builder = StateMachineBuilderFactory.create();
>    
>            // 第二步：定义状态
>            // 待支付状态->待发货状态 —— 支付
>            builder.externalTransition() // 外部流转
>                    .from(OrderStateEnum.WAIT_PAYMENT)  // 起始状态
>                    .to(OrderStateEnum.WAIT_DELIVER)  // 目标状态
>                    .on(OrderEventEnum.PAYED)  // 事件
>                    .when(checkCondition()) // 流转需要校验的条件，校验不通过不会进行doAction
>                    .perform(doAction());  //执行流转操作 这个action 我们可以按自己所需修改
>    
>            // 待支付状态->已完成 —— 未支付
>            builder.externalTransition()
>                    .from(OrderStateEnum.WAIT_PAYMENT)
>                    .to(OrderStateEnum.FINISH)
>                    .on(OrderEventEnum.CANCEL_PAYED)
>                    .when(checkCondition())
>                    .perform(doAction());
>    
>            // 待发货状态->待收货状态 —— 发货
>            builder.externalTransition()
>                    .from(OrderStateEnum.WAIT_DELIVER)
>                    .to(OrderStateEnum.WAIT_RECEIVE)
>                    .on(OrderEventEnum.DELIVERY)
>                    .when(checkCondition())
>                    .perform(doAction());
>    
>            // 待发货状态->已完成 —— 退款
>            builder.externalTransition()
>                    .from(OrderStateEnum.WAIT_DELIVER)
>                    .to(OrderStateEnum.FINISH)
>                    .on(OrderEventEnum.REFUND)
>                    .when(checkCondition())
>                    .perform(doAction());
>    
>            // 待收货状态-> 完成 —— 收货
>            builder.externalTransition()
>                    .from(OrderStateEnum.WAIT_RECEIVE)
>                    .to(OrderStateEnum.FINISH)
>                    .on(OrderEventEnum.RECEIVED)
>                    .when(checkCondition())
>                    .perform(doAction());
>    
>            // 创建状态机
>            StateMachine<OrderStateEnum, OrderEventEnum, Order> orderStateMachine = builder.build(ORDER_STATE_MACHINE);
>            String uml = orderStateMachine.generatePlantUML();
>    
>            log.info("{}", uml);
>    
>            log.info(">>>>>>>>>>>>>>>>>>>> 【Cola-Statemachine 配置】订单状态机配置 <<<<<<<<<<<<<<<<<<<<");
>            return orderStateMachine;
>        }
>    
>    
>        private Condition<Order> checkCondition() {
>            return (ctx) -> {
>                log.info("checkCondition:{}", JSONUtil.toJsonStr(ctx));
>                return true;
>            };
>        }
>    
>        private Action<OrderStateEnum, OrderEventEnum, Order> doAction() {
>            return (from, to, event, order) -> {
>                log.info(" 正在操作 " + order.getOrderId() + " from:" + from + " to:" + to + " on:" + event);
>                // 获取当前订单状态
>                Integer status = order.getOrderState();
>                // 校验状态是否合法
>                if (!status.equals(from.getValue())) {
>                    throw new BizException("状态不合法");
>                }
>            };
>        }
>    }
>    ```
>
> 4. ***编写Service层***
>
>    ```java
>    @Slf4j
>    @Service
>    @RequiredArgsConstructor
>    public class OrderServiceImpl extends ServiceImpl<OrderDao, Order> implements OrderService {
>        private final StateMachine<OrderStateEnum, OrderEventEnum, Order> orderStateMachine;
>    
>        @Override
>        public Order create() {
>            Order order = new Order();
>            order.setOrderState(OrderStateEnum.WAIT_PAYMENT.getValue());
>            this.save(order);
>            return order;
>        }
>    
>        @Override
>        public Order pay(Long orderId) {
>            return orderOperation(orderId, OrderStateEnum.WAIT_PAYMENT, OrderEventEnum.PAYED);
>        }
>    
>        @Override
>        public Order nonPay(Long orderId) {
>            return orderOperation(orderId, OrderStateEnum.WAIT_PAYMENT, OrderEventEnum.CANCEL_PAYED);
>        }
>    
>        @Override
>        public Order deliver(Long orderId) {
>            return orderOperation(orderId, OrderStateEnum.WAIT_DELIVER, OrderEventEnum.DELIVERY);
>        }
>    
>        @Override
>        public Order refund(Long orderId) {
>            return orderOperation(orderId, OrderStateEnum.WAIT_DELIVER, OrderEventEnum.REFUND);
>        }
>    
>        @Override
>        public Order receive(Long orderId) {
>            return orderOperation(orderId, OrderStateEnum.WAIT_RECEIVE, OrderEventEnum.RECEIVED);
>        }
>    
>        @Override
>        public List<Order> getOrders() {
>            return this.list();
>        }
>    
>        private Order orderOperation(Long id, OrderStateEnum orderStateEnum, OrderEventEnum orderEventEnum) {
>            String machineId = orderStateMachine.getMachineId();
>            log.info("订单状态机：{}", machineId);
>            Order order = this.getById(id);
>            OrderStateEnum orderState = orderStateMachine.fireEvent(orderStateEnum, orderEventEnum, order);
>            log.info("订单状态:{}", orderState);
>            order.setOrderState(orderState.getValue());
>            this.updateById(order);
>            return this.getById(id);
>        }
>    }
>    ```
>
>    

------



### 踩坑：Cola-StateMachine 事务失效

> [!tip]
>
> [Cola-Statemachine事务失效踩坑](https://blog.csdn.net/qq_34438435/article/details/130730959)