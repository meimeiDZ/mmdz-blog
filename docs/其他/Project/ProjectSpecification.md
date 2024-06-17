# 项目规范与常用工具

## 规范_表设计

### 字段命名规范     

> 1. 字段**语义须完整**，不允许出现像status这种不明确的字段，应改为check_status
> 2. 表示是否概念的用is开头，如is_delete
> 3. 每个字段都需要加上**注释**，尤其是枚举含义的字段，在有新数据更新时记得及时维护
> 4. **避免使用关键字**，如desc，enable等
> 5. 表字段名全部小写，多个单词用_分开，才可以满足**驼峰映射**

### 字段类型设计

> 1. 主键类型一般情况下使用 unsigned bigint（可以存储42亿条数据）
>
> 使用unsigned的好处有标识数据特点（没有负数），提高空间利用率，在确定不会有负数出现的字段上都应加上此标识。
>
> 2. 整数类型按需求使用int、unsigned int、bigint，在java中分别对应Integer、Long、Long
> 3. 小数类型使用 decimal，使用 float 和 double有精度丢失问题
> 4. 布尔类型使用 tinyint，使用1和0标识是和否，命名使用"is_XX"
> 5. 固定长度字符串使用char(x)，非固定长度使用varchar(x)，x代表字符数（包括汉字）如果长度大于5000使用text类型并另建一张表用主键关联，避免影响效率
> 6. 表必备字段：created, create_id, updated, update_id，这些字段由框架从会话上下文中自动取值填入
> 7. 表必备字段2：is_delete，都是逻辑删除，基本没有物理删除
> 8. 表必备字段3：extend1，extend2……… ，要准备一些备用字段
> 9. 枚举类型使用unsigned tinyint，java对应类型为Integer
> 10. 状态应说明具体是什么状态，不能命名为status，应为“xx_status”，如"check_status","sale_status"

### 类型说明

| 类型             | 表示范围                       | 占用字节 | java对应类型 |
| ---------------- | ------------------------------ | -------- | ------------ |
| tinyint unsigned | 无符号值：0 到 255             | 1        | int          |
| int unsigned     | 无符号值：0 到约 42.9 亿       | 4        | long         |
| bigint unsigned  | 无符号值：0 到约 10 的 19 次方 | 8        | long         |

### 额外说明

> 1. 为方便代码生成工具识别，以下为特别规范
> 2. bool使用tinyint(1) unsigned ，在java中对应boolean
> 3. 枚举使用tinyint unsigned  ，在java中对应int