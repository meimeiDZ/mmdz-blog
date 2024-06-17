# 数组算法练习





## [217. 存在重复元素](https://leetcode.cn/problems/contains-duplicate/)

> **题目描述：**给你一个整数数组 `nums` 。如果任一值在数组中出现 **至少两次** ，返回 `true` ；如果数组中每个元素互不相同，返回 `false` 。
>
> **示例 1：**
>
> ```
> 输入：nums = [1,2,3,1]
> 输出：true
> ```
>
> **示例 2：**
>
> ```
> 输入：nums = [1,2,3,4]
> 输出：false
> ```

**解答（个人优先想到hash）：**

```java
public class 存在重复元素_217_hash {

    @Test
    public void Test(){
        int[] arr = {1,2,3,44};
        System.out.println(containsDuplicate(arr));
    }

    /**
     * 哈希表 方式
     * 复杂度分析
     *      时间复杂度：O(N)，其中 N 为数组的长度
     *      空间复杂度：O(N)，其中 N 为数组的长度
     * @param nums
     * @return
     */
    public boolean containsDuplicate(int[] nums) {
        Map map = new HashMap(nums.length);
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i])){
                return true;
            }
            map.put(nums[i], 1);
        }
        return false;
    }
}
```

------

## [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

> 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
>
> 子数组 是数组中的一个连续部分。
>
> 示例 1：
>
> ```
> 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
> 输出：6
> 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
> ```

**解答：**

> `动态规划`：假设 nums 数组的长度是 n，下标从 0 到 n−1，我们用 f(i) 代表以第 i 个数结尾的「连续子数组的最大和」
>
> **推算：** **数组** nums = [-2,1,-3,4,-1,2,1,-5,4]；**连续子数组的最大和** int cur = 0, **最大值** max = nums[0];
>
> | 遍历 | -2   | 1    | -3   | 4    | -1   | 2    | 1    | -5   | 4    |
> | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
> | cur  | -2   | 1    | -2   | 4    | 3    | 5    | 6    | 1    | 5    |
> | max  | -2   | 1    | 1    | 4    | 4    | 5    | 6    | 6    | 6    |

```java
public class 最大子数组和_53_动态规划 {

    @Test
    public void Test(){
        int[] arr = {-2,1,-3,4,-1,2,1,-5,4};
        System.out.println(maxSubArray(arr));
    }

    /**
     * 动态规划 方式：
     * 复杂度分析
     *      时间复杂度：O(N)，其中 n 为  数组的长度。我们只需要遍历一遍数组即可求得答案。
     *      空间复杂度：O(N)，我们只需要常数空间存放若干变量。
     * @param nums
     * @return
     */
    public int maxSubArray(int[] nums) {
        int cur = 0, max = nums[0];
        for (int num : nums) {
            cur = Math.max(num + cur, num);
            max = Math.max(max, cur);
        }
        return max;
    }
}
```

