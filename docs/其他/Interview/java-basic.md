# Java基础

## 面向对象

### 面向对象五大基本原则是什么（可选）

1. **单一职责原则**SRP(Single Responsibility Principle)

   类的功能要单一，不能包罗万象，跟杂货铺似的。

2. **开放封闭原则**OCP(Open－Close Principle)

   一个模块对于拓展是开放的，对于修改是封闭的，想要增加功能热烈欢迎，想要修改，哼，一万个不乐意。

3. **里式替换原则**LSP(the Liskov Substitution Principle LSP)

   子类可以替换父类出现在父类能够出现的任何地方。比如你能代表你爸去你姥姥家干活。哈哈~~

4. **依赖倒置原则**DIP(the Dependency Inversion Principle DIP)

   高层次的模块不应该依赖于低层次的模块，他们都应该依赖于抽象。抽象不应该依赖于具体实现，具体实现应该依赖于抽象。就是你出国要说你是中国人，而不能说你是哪个村子的。比如说中国人是抽象的，下面有具体的xx省，xx市，xx县。你要依赖的抽象是中国人，而不是你是xx村的。

5. **接口分离原则**ISP(the Interface Segregation Principle ISP)

   设计时采用多个与特定客户类有关的接口比采用一个通用的接口要好。就比如一个手机拥有打电话，看视频，玩游戏等功能，把这几个功能拆分成不同的接口，比在一个接口里要好的多。

### 接口和抽象类区别？接口的设计在JDK1.8之前和之后有什么变化？

- 抽象类是用来捕捉子类的通用特性的。接口是抽象方法的集合。

  从设计层面来说，抽象类是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。

  - `区别：`

    相同点：

    - 接口和抽象类都不能实例化
    - 都位于继承的顶端，用于被其他实现或继承
    - 都包含抽象方法，其子类都必须覆写这些抽象方法

    不同点：

    - 接口可以多实现，而抽象类只能单继承
    - 抽象类中的方法，可以用protect和abstract修饰，而接口中，都是默认的public abstract修饰
    - 抽象类可以像普通类一样有自己的普通方法，但是接口不可以
    - 属性上，接口中只能是public static final修饰的，抽象类中任意
    - 抽象类中可以拥有静态代码块的，接口中不能拥有静态代码块
    - 抽象类可以拥有自己的构造，接口没有构造，不能拥有
    - 接口之间可以多继承，抽象类只能单继承
    - 接口在1.8之后可以拥有default修饰的方法，抽象类没有

  - `变化：`

    Java8中接口中引入**默认方法和静态方法**，以此来减少抽象类和接口之间的差异。现在，我们可以为接口提供默认实现的方法了，并且不用强制子类来实现它。

### hashCode() 有什么用？

`hashCode()` 的作用是获取哈希码（`int` 整数），也称为散列码。这个哈希码的作用是确定该对象在哈希表中的索引位置。

`hashCode()`定义在 JDK 的 `Object` 类中，这就意味着 Java 中的任何类都包含有 `hashCode()` 函数。另外需要注意的是： `Object` 的 `hashCode()` 方法是本地方法，也就是用 C 语言或 C++ 实现的，该方法通常用来将对象的内存地址转换为整数之后返回。

### 什么是反射

- **描述**：

  反射是指在运行状态中，对于任意一个类都能够知道这个类所有的属性和方法；并且对于任意一个对象，都能够调用它的任意一个方法；这种动态获取信息以及动态调用对象方法的功能称为反射机制。

- **优缺点**：

  由于反射在运行期间根据业务功能动态执行方法、访问属性，可以让我们的代码更加灵活、为各种框架提供开箱即用的功能提供了便利。

  不过，反射让我们在运行时有了分析操作类的能力的同时，也增加了安全问题，比如可以无视泛型参数的安全检查（泛型参数的安全检查发生在编译时）。另外，反射的性能也要稍差点，不过，对于框架来说实际是影响不大的。

- **场景**：

  - 框架

    像咱们平时大部分时候都是在写业务代码，很少会接触到直接使用反射机制的场景。但是！这并不代表反射没有用。相反，正是因为反射，你才能这么轻松地使用各种框架。像 Spring/Spring Boot、MyBatis 等等框架中都大量使用了反射机制。

  - 动态代理

    **这些框架中也大量使用了动态代理，而动态代理的实现也依赖反射。**

    比如下面是通过 JDK 实现动态代理的示例代码，其中就使用了反射类 `Method` 来调用指定的方法。

    ```java
    public class DebugInvocationHandler implements InvocationHandler {
        /**
         * 代理类中的真实对象
         */
        private final Object target;
    
        public DebugInvocationHandler(Object target) {
            this.target = target;
        }
    
        public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
            System.out.println("before method " + method.getName());
            Object result = method.invoke(target, args);
            System.out.println("after method " + method.getName());
            return result;
        }
    }
    ```

  - 注解

    另外，像 Java 中的一大利器 **注解** 的实现也用到了反射。

    为什么你使用 Spring 的时候 ，一个`@Component`注解就声明了一个类为 Spring Bean 呢？为什么你通过一个 `@Value`注解就读取到配置文件中的值呢？究竟是怎么起作用的呢？

    这些都是因为你可以基于反射分析类，然后获取到类/属性/方法/方法的参数上的注解。你获取到注解之后，就可以做进一步的处理。

### 初始化考察

```java
public class InitialTest {
    public static void main(String[] args) {
        A ab = new B();
        ab = new B();
    }
}
class A {
    static { // 父类静态代码块
        System.out.print("A");
    }
    public A() { // 父类构造器
        System.out.print("a");
    }
}
class B extends A {
    static { // 子类静态代码块
        System.out.print("B");
    }
    public B() { // 子类构造器
        System.out.print("b");
    }
}
```

执行结果：ABabab，两个考察点：

1）静态变量只会初始化（执行）一次。

2）当有父类时，完整的初始化顺序为：父类静态变量（静态代码块）->子类静态变量（静态代码块）->父类非静态变量（非静态代码块）->父类构造器 ->子类非静态变量（非静态代码块）->子类构造器 。

关于初始化，这题算入门题，我之前还写过一道有（fei）点（chang）意（bian）思（tai）的进阶题目，有兴趣的可以看看：一道有意思的“初始化”面试题

### 泛型（了解）

- 什么是泛型？泛型的作用？
  - Java 泛型（Generics）是 **JDK 5 中引入的一个新特性**。
  - 使用泛型参数，可以**增强代码的可读性以及稳定性**。编译器可以对泛型参数进行检测，并且通过泛型参数可以指定传入的对象类型。比如 ArrayList< Person > persons = new ArrayList< String >() 这行代码就指明了该ArrayList 对象只能传入 Persion 对象，如果传入其他类型的对象就会报错。
  - 可以用于**构建泛型集合**。原生 List 返回类型是 Object ，需要手动转换类型才能使用，使用泛型后编译器自动转换。
- 什么是泛型擦除机制？为什么要擦除?
  - **Java 的泛型是伪泛型，这是因为 Java 在编译期间，所有的泛型信息都会被擦掉，这也就是通常所说类型擦除** 。
  - 编译器会在编译期间动态将泛型 T 擦除为 Object 或将 T extends xxx 擦除为其限定类型 xxx
  - 泛型本质上是编译器的行为，为了保证引入泛型机制但不创建新的类型，减少虚拟机的运行开销，所以通过擦除将泛型类转化为一般类。
- 既然编译器要把泛型擦除，那为什么还要用泛型呢？用Object代替不行吗？ 该题变相考察泛型的作用。
  - 可在编译期间进行类型检测。
  - 使用 Object 类型需要手动添加强制类型转换，降低代码可读性，提高出错概率
  - 泛型可以使用自限定类型。如 T extends Comparable 还能调用 compareTo(T o) 方法 ，Object 则没有此功能

### 序列化和反序列化（了解）

- 什么是序列化?什么是反序列化? 

  如果我们需要持久化 Java 对象比如将 Java 对象保存在文件中，或者在网络传输 Java 对象，这些场景都需要用到序列化。

  简单来说：

  - **序列化**： 将数据结构或对象转换成二进制字节流的过程
  - **反序列化**：将在序列化过程中所生成的二进制字节流转换成数据结构或者对象的过程

  `序列化的实现`

  将需要被序列化的类实现Serializable接口，该接口没有需要实现的方法，

  implements Serializable只是**为了标注该对象是可被序列化的**，然后使用一个输出流(如:FileOutputStream)来构造一个objectOutputStream(对象流)对象，接着，使用ObjectOutputStream对 象的writeObject(Object obj)方法就可以将参数为obj的对象写出(即保存其状态)，要恢复的话则用输入流。

- serialVersionUID 有何用途？如果没定义会有什么问题？

  我最喜欢的关于Java序列化的问题面试问题之一。serialVersionUID 是一个 private static final long 型 ID, 当它被印在对象上时, 它通常是对象的哈希码,你可以使用 serialver 这个 JDK 工具来查看序列化对象的 serialVersionUID。

  SerialVerionUID 用于**对象的版本控制**。也可以在类文件中指定 serialVersionUID。不指定 serialVersionUID的后果是,当你添加或修改类中的任何字段时, 则已序列化类将无法恢复, 因为为新类和旧序列化对象生成的 serialVersionUID 将有所不同。

  Java 序列化过程依赖于正确的序列化对象恢复状态的，并在序列化对象序列版本不匹配的情况下引发 java.io.InvalidClassException 无效类异常。

- 如果有些字段不想进行序列化怎么办？

  对于不想进行序列化的变量，使用 `transient` 关键字修饰。

- 为什么不推荐使用 JDK 自带的序列化？

  我们很少或者说几乎不会直接使用 JDK 自带的序列化方式，主要原因有下面这些原因：

  - **不支持跨语言调用** : 如果调用的是其他语言开发的服务的时候就不支持了。
  - **性能差** ：相比于其他序列化框架性能更低，主要原因是序列化之后的字节数组体积较大，导致传输成本加大。
  - **存在安全问题** ：序列化和反序列化本身并不存在问题。但当输入的反序列化的数据可被用户控制，那么攻击者即可通过构造恶意输入，让反序列化产生非预期的对象，在此过程中执行构造的任意代码。

### JDK1.8之后有哪些新特性？

- 接口默认方法：Java 8允许我们给接口添加一个非抽象的方法实现，只需要使用 default关键字即可
- Lambda 表达式和函数式接口：Lambda 表达式本质上是一段匿名内部类，也可以是一段可以传递的代码。Lambda 允许把函数作为一个方法的参数（函数作为参数传递到方法中），使用 Lambda 表达式使代码更加简洁，但是也不要滥用，否则会有可读性等问题，《Effective Java》作者 Josh Bloch 建议使用 Lambda 表达式最好不要超过3行。

- Stream API：用函数式编程方式在集合类上进行复杂操作的工具，配合Lambda表达式可以方便的对集合进行处理。Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。

- 方法引用：方法引用提供了非常有用的语法，可以直接引用已有Java类或对象（实例）的方法或构造器。与lambda联合使用，方法引用可以使语言的构造更紧凑简洁，减少冗余代码。

- 日期时间API：Java 8 引入了新的日期时间API改进了日期时间的管理。

- Optional 类：著名的 NullPointerException 是引起系统失败最常见的原因。很久以前 Google Guava 项目引入了 Optional 作为解决空指针异常的一种方式，不赞成代码被 null 检查的代码污染，期望程序员写整洁的代码。受Google Guava的鼓励，Optional 现在是Java 8库的一部分。

- 新工具：新的编译工具，如：Nashorn引擎 jjs、 类依赖分析器 jdeps。







