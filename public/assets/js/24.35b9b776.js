(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{592:function(s,t,a){"use strict";a.r(t);var n=a(5),r=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[a("strong",[s._v("滑动窗口算法思想是非常重要的一种思想，可以用来解决数组，字符串的子元素问题。它可以将嵌套循环的问题，转换为单层循环问题，降低时间复杂度，提高效率。")])]),s._v(" "),a("p",[s._v("滑动窗口的思想非常简单，它将子数组（子字符串）理解成一个滑动的窗口，然后将这个窗口在数组上滑动，在窗口滑动的过程中，左边会出一个元素，右边会进一个元素，然后只需要计算当前窗口内的元素值即可。")]),s._v(" "),a("p",[s._v("可用滑动窗口思想解决的问题，一般有如下特点：")]),s._v(" "),a("ol",[a("li",[s._v("窗口内元素是连续的。就是说，抽象出来的这个可滑动的窗口，在原数组或字符串上是连续的。")]),s._v(" "),a("li",[s._v("窗口只能由左向右滑动，不能逆过来滑动。就是说，窗口的左右边界，只能从左到右增加，不能减少，即使局部也不可以。")])]),s._v(" "),a("h4",{attrs:{id:"算法思路"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#算法思路"}},[s._v("#")]),s._v(" 算法思路")]),s._v(" "),a("ol",[a("li",[s._v("使用双指针中的左右指针技巧，初始化 left = right = 0，把索引闭区间 [left, right] 称为一个「窗口」。")]),s._v(" "),a("li",[s._v("先不断地增加 right 指针扩大窗口 [left, right]，直到窗口符合要求")]),s._v(" "),a("li",[s._v("停止增加 right，转而不断增加 left 指针缩小窗口 [left, right]，直到窗口中的字符串不再符合要求。同时，每次增加 left，我们都要更新一轮结果。")]),s._v(" "),a("li",[s._v("重复第 2 和第 3 步，直到 right 到达尽头。")])]),s._v(" "),a("blockquote",[a("p",[s._v("第 2 步相当于在寻找一个「可行解」，然后第 3 步在优化这个「可行解」，最终找到最优解。 左右指针轮流前进，窗口大小增增减减，窗口不断向右滑动。")])]),s._v(" "),a("p",[a("strong",[s._v("代码模板")])]),s._v(" "),a("div",{staticClass:"language-go line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-go"}},[a("code",[s._v("left"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("right "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 左右指针")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 窗口右边界滑动")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" right "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v(" length "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  window"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("s"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("right"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("      "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 右元素进窗")]),s._v("\n  right"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),s._v("                   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 右指针增加")]),s._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 窗口满足条件")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("valid")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("window"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" left"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("right "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("...")]),s._v("                      "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 满足条件后的操作")]),s._v("\n    window"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("remove")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("arr"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("left"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 左元素出窗")]),s._v("\n    left"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),s._v("                   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 左指针移动，直到窗口不满足条件")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br")])]),a("p",[s._v("注意:")]),s._v(" "),a("ul",[a("li",[s._v("滑动窗口适用的题目一般具有单调性")]),s._v(" "),a("li",[s._v("滑动窗口、双指针、单调队列和单调栈经常配合使用")])]),s._v(" "),a("p",[s._v("滑动窗口的思路很简单，但在leetcode上关于滑动窗口的题目一般都是mid甚至hard的题目。其难点在于，如何抽象窗口内元素的操作，验证窗口是否符合要求的过程。\n即上面步骤2，步骤3的两个过程。https://leetcode-cn.com/problems/minimum-size-subarray-sum/)")]),s._v(" "),a("p",[s._v("所谓滑动窗口，"),a("strong",[s._v("就是不断的调节子序列的起始位置和终止位置，从而得出我们要想的结果")])]),s._v(" "),a("p",[s._v("给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。")]),s._v(" "),a("p",[s._v("示例：")]),s._v(" "),a("p",[s._v("输入：s = 7, nums = [2,3,1,2,4,3] 输出：2 解释：子数组 [4,3] 是该条件下的长度最小的子数组。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://coderdu.com/image/%E6%BB%91%E5%8A%A8%E7%AA%97%E5%8F%A3.gif",alt:"滑动窗口"}})]),s._v(" "),a("p",[s._v("最后找到 4，3 是最短距离。")]),s._v(" "),a("p",[s._v("其实从动画中可以发现滑动窗口也可以理解为双指针法的一种！只不过这种解法更像是一个窗口的移动，所以叫做滑动窗口更适合一些。")]),s._v(" "),a("p",[s._v("在本题中实现滑动窗口，主要确定如下三点：")]),s._v(" "),a("ul",[a("li",[s._v("窗口内是什么？")]),s._v(" "),a("li",[s._v("如何移动窗口的起始位置？")]),s._v(" "),a("li",[s._v("如何移动窗口的结束位置？")])]),s._v(" "),a("p",[s._v("窗口就是 满足其和 ≥ s 的长度最小的 连续 子数组。")]),s._v(" "),a("p",[s._v("窗口的起始位置如何移动：如果当前窗口的值大于s了，窗口就要向前移动了（也就是该缩小了）。")]),s._v(" "),a("p",[s._v("窗口的结束位置如何移动：窗口的结束位置就是遍历数组的指针，窗口的起始位置设置为数组的起始位置就可以了。")]),s._v(" "),a("p",[s._v("解题的关键在于 窗口的起始位置如何移动，如图所示：")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://coderdu.com/image/image-20210719172352539.png",alt:"image-20210719172352539"}})]),s._v(" "),a("p",[s._v("可以发现"),a("strong",[s._v("滑动窗口的精妙之处在于根据当前子序列和大小的情况，不断调节子序列的起始位置。从而将O(n^2)的暴力解法降为O(n)。")])]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Solution")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 滑动窗口")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("minSubArrayLen")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" s"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" nums"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" left "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" sum "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" result "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Integer")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("MAX_VALUE"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" right "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" right "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v(" nums"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" right"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            sum "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+=")]),s._v(" nums"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("right"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("while")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("sum "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">=")]),s._v(" s"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                result "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Math")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("min")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("result"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" right "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v(" left "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n                sum "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-=")]),s._v(" nums"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("left"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n            "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" result "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Integer")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("MAX_VALUE "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" result"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br")])])])}),[],!1,null,null,null);t.default=r.exports}}]);