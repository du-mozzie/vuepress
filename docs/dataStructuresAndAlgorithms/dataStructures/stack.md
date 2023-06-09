---
title: 栈
date: 2022-2-22
categories:
 - 数据结构
tags:
 - 数据结构
---

==栈是限定仅在表尾进行插入和删除的线性表==

允许插入和删除的一端称为栈顶，另一端称为栈底，不含任何数据元素的栈称为空栈。

后进先出LIFO

>   栈的插入操作，叫作进栈，也称压栈、入栈。
>
>   栈的删除操作，叫作出栈，有的也叫作弹栈。

![image-20210419215326952](https://www.coderdu.tech/image/image-20210419215326952.png)

**逆波兰，使用栈结构来帮助计算机处理数学加减乘除计算问题**

​	把生活中数学中缀表示法改成后缀表示法

​	逆波兰记法中，操作符置于操作数的后面。例如表达“三加四”时，写作“3 4 + ”，而不是“3 + 4”。如果有多个操作符，操作符置于第二个操作数的后面，所以常规中缀记法的“3 - 4 + 5”在逆波兰记法中写作“3 4 - 5 + ”：先3减去4，再加上5。使用逆波兰记法的一个好处是不需要使用括号。例如中缀记法中“3 - 4 * 5”与“（3 - 4）*5”不相同，但后缀记法中前者写做“3 4 5 * - ”，无歧义地表示“3 (4 5 *) -”；后者写做“3 4 - 5 * ”。

逆波兰表达式的[解释器](https://zh.wikipedia.org/wiki/解释器)一般是基于[堆栈](https://zh.wikipedia.org/wiki/堆栈)的。解释过程一般是：操作数入栈；遇到操作符时，操作数出栈，求值，将结果入栈；当一遍后，栈顶就是表达式的值。因此逆波兰表达式的求值使用堆栈结构很容易实现，并且能很快求值。
