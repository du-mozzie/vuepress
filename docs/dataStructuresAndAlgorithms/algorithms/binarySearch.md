---
title: 二分查找
date: 2022-2-22
categories:
 - 算法
tags:
 - 算法
---

[x的平方根](https://leetcode-cn.com/problems/sqrtx/)

有序数组通常使用二分查找

线性表中的元素必须是有序的，线性表必须采用顺序存储；待查找的数是整数，且知道范围，大概可以使用二分查找

https://leetcode-cn.com/problems/sqrtx/

```java
public static int binarySearch(Integer[] srcArray, int des) {
    //定义初始最小、最大索引
    int start = 0;
    int end = srcArray.length - 1;
    //确保不会出现重复查找，越界
    while (start <= end) {
        //计算出中间索引值
        int middle = (end + start)>>>1 ;//防止溢出
        if (des == srcArray[middle]) {
            return middle;
        //判断下限
        } else if (des < srcArray[middle]) {
            end = middle - 1;
        //判断上限
        } else {
            start = middle + 1;
        }
    }
    //若没有，则返回-1
    return -1;
}
```
