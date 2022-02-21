---
title: 常用类
date: 2022-2-21
categories:
 - JavaSE
tags:
 - JavaSE
---
### 1、Object

Object 是 Java 官方提供的类，存放在 java.lang 包中，该类是所有类的直接父类或者间接父类，无论是 Java 提供的类还是开发者自定义的类，都是 Object 的直接子类或间接子类，Java 中的任何一个类都会继承 Object 中的 public 和 protected 方法。

```java
hashCode();
getClass();
equals(null);
clone();
toString();
notify();
notifyAll();
wait();
wait(1000L);
wait(1000L, 100);
```

Object 类中经常被子类重写的方法：

1、public String toString() 以字符串的形式返回对象的信息

2、public boolean equals(Object obj) 判断两个对象是否相等

3、public native int hashCode() 返回对象的`散列码`

- toString

```java
Object
public String toString() {
  return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
//重写之后
@Override
public String toString() {
  return "People [id=" + id + ", name=" + name + ", score=" + score + "]";
}
```

- equals

```java
Object
public boolean equals(Object obj) {
  return (this == obj);
}
//重写之后
@Override
public boolean equals(Object obj) {
  // TODO Auto-generated method stub
  People people = (People)obj;
  if(this.id == people.id && this.name.equals(people.name) && this.score.equals(people.score)) {
    return true;
  }
  return false;
}
```

- hashCode

```java
Object
public native int hashCode();
//重写之后
@Override
public int hashCode() {
  // TODO Auto-generated method stub
  return (int) (id*name.hashCode()*score);
}
```

### 2、包装类

- 什么是包装类？

包装类是 Java 提供的一组类，专门用来创建 8 种基本数据类型对应的对象，一共有 8 个包装类，存放在 java.lang 包中，基本数据类型对应的包装类。

| byte    | Byte      |
| ------- | --------- |
| short   | Short     |
| int     | Integer   |
| long    | Long      |
| float   | Float     |
| double  | Double    |
| char    | Character |
| boolean | Boolean   |

包装类的体系结构

Java 官方提供的一组类，这组类的作用是将基本数据类型的数据封装成引用类型。

Byte、Integer、Short、Long、Float、Double、Boolean、Characte

![image-20220114195256701](https://coderdu.com/typoraImages//image-20220114195256701.png)

### 3、装箱和拆箱

装箱和拆箱是包装类的特有名词，装箱是指将基本数据类型转为对应的包装类对象，拆箱就是将包装类对象转为对应的基本数据类型。

装箱与拆箱

装箱是指将基本数据类型转换为包装类对象。

拆箱是指将包装类对象转换为基本数据类型。

#### 3.1、构造函数

1、public Type(type value) 【**即原类型**】

每个包装类都提供了一个有参构造函数：public Type(type value)，用来实例化包装类对象。

```java
byte b = 1;
Byte byt = new Byte(b);
short s = 2;
Short shor = new Short(s);
int i = 3;
Integer integer = new Integer(i);
long l = 4;
Long lon = new Long(l);
float f = 5.5f;
Float flo = new Float(f);
double d = 6.6;
Double dou = new Double(d);
char cha = 'J';
Character charac = new Character(cha);
boolean bo = true;
Boolean bool = new Boolean(bo);
System.out.println(byt);
System.out.println(shor);
System.out.println(integer);
System.out.println(lon);
System.out.println(flo);
System.out.println(dou);
System.out.println(charac);
System.out.println(bool);
```

2、public Type(String value)/public Type(char value) 【**即字符/字符串类型**】

每个包装类还有一个重载构造函数：

Character 类的重载构造函数：`public Type(char value)`，其他包装类的重载构造函数：`public Type(String value)`。

```java
Byte byt = new Byte("1");
Short shor = new Short("2");
Integer integer = new Integer("3");
Long lon = new Long("4");
Float flo = new Float("5.5f");
Double dou = new Double("6.6");
Character charac = new Character('J');
Boolean bool = new Boolean("abc");
System.out.println(byt);
System.out.println(shor);
System.out.println(integer);
System.out.println(lon);
System.out.println(flo);
System.out.println(dou);
System.out.println(charac);
```

需要注意的是，Boolean 类的构造函数中，当参数为 “true” 时，Boolean 值为 true，当参数不为 “true”，Boolean 值为 false。

#### 3.2、装箱

1、public Type(type value)

2、public Type(String value)/public Type(char value)

3、**valueOf**(type value) 静态方法，参数是基本数据类型的数据

每一个包装类都有一个 valueOf(type value) 方法

```java
byte b = 1;
Byte byt = Byte.valueOf(b);
short s = 2;
Short shot = Short.valueOf(s);
int i = 3;
Integer integer = Integer.valueOf(i);
long l = 4L;
Long lon = Long.valueOf(l);
float f = 5.5f;
Float floa = Float.valueOf(f);
double d = 6.6;
Double doub = Double.valueOf(d);
boolean boo = true;
Boolean bool = Boolean.valueOf(boo);
char ch = 'J';
Character cha = Character.valueOf(ch);
```

其中：

```java
//valueOf(String value)/valueOf(char value) 专门为 Character 转换使用的，
//其他的 7 个包装类都可以使用 valueOf(String value)。
Byte byt = Byte.valueOf("1");
Short sho = Short.valueOf("2");
Integer integer = Integer.valueOf("3");
Long lon = Long.valueOf("4");
Float flo = Float.valueOf("5.5f");
Double dou = Double.valueOf("6.6");
Boolean boo = Boolean.valueOf("true");
Character cha = Character.valueOf('J');
```

需要注意的是 Boolean.valueOf(String value) 方法中，当 value 为 “true” 时，Boolean 的值为 true，否则，Boolean 的值为 false。

#### 3.3、拆箱

1、`*Value()`
每个包装类都有一个 *Value() 方法，通过该方法可以将包装类转为基本数据类型。

```java
Byte byt = Byte.valueOf("1");
Short sho = Short.valueOf("2");
Integer integer = Integer.valueOf("3");
Long lon = Long.valueOf("4");
Float flo = Float.valueOf("5.5f");
Double dou = Double.valueOf("6.6");
Boolean boo = Boolean.valueOf("true");
Character cha = Character.valueOf('J');
 
byte b = byt.byteValue();
short sh = sho.shortValue();
int i = integer.intValue();
long l = lon.longValue();
float f = flo.floatValue();
double d = dou.doubleValue();
boolean bo = boo.booleanValue();
char c = cha.charValue();
```

2、`parse*(String value)`

除了 `Character` 类以外的每一个包装类都有一个`静态方法`可以将字符串类型转为基本数据类型。

```java
byte b = Byte.parseByte("1");
short s = Short.parseShort("2");
int i = Integer.parseInt("3");
long l = Long.parseLong("4");
float f = Float.parseFloat("5.5");
double d = Double.parseDouble("6.6");
boolean bo = Boolean.parseBoolean("true");
```

3、toString(type value)

每个包装类都有该方法，作用是将基本数据类型转为 String 类型。

```java
byte b = 1;
String bstr = Byte.toString(b);
short s = 2;
String sstr = Short.toString(s);
String i = Integer.toString(3);
long l = 4L;
String lstr = Long.toString(l);
float f = 5.5f;
String fstr = Float.toString(f);
double d = 6.6;
String dstr = Double.toString(d);
boolean bo = true;
String bostr = Boolean.toString(bo);
String chstr = Character.toString('J');
```

### 4、枚举

枚举 Enum，是一种有确定值区间的数据类型，本质上就是一个类，具有简洁、安全、方便等特点。

枚举的值被约束到了一个特定的范围内，只能从这个范围以内取值。

为什么要有枚举？

因为在描述某些对象的属性时，该属性的值不能随便定义，必须在某个特定的区间内取值。

出于对数据的安全性考虑，类似这种有特定取值范围的数据我们就可以使用枚举来描述。

枚举指由一组常量组成的类型，指定一个取值区间，我们只能从该区间中取值。

```java
final class Week extends Enum{
    public static final Week MONDAY;
    public static final Week TUESDAY;
    public static final Week WEDNSDAY;
    public static final Week THURSDAY;
    public static final Week FRIDAY;
    public static final Week SATURDAY;
    public static final Week SUNDAY;
    private static final Week $VALUES[];

    static{
        MONDAY = new Week("MONDAY",0);
        TUESDAY = new Week("TUESDAY",1);
        WEDNSDAY = new Week("WEDNSDAY",2);
        THURSDAY = new Week("THURSDAY",3);
        FRIDAY = new Week("FRIDAY",4);
        SATURDAY = new Week("SATURDAY",5);
        SUNDAY = new Week("SUNDAY",6);
        $VALUES[] = (new Week[]{
            MONDAY,TUESDAY,WEDNSDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY
        })
    }

    public static Week[] values(){
        return $VALUES.clone();
    }

    public static Week valueOf(String s){
        return Enum.valueOf(s);
    }

    private Week(String s,int i){
        super(s,i);
    }

}
```

### 5、Math

Math 类为开发者提供了一系列的数学方法，同时还提供了两个静态常量 E（自然对数的底数）和 PI（圆周率）。

```java
public class Test {
    public static void main(String[] args) {
        System.out.println("常量E"+Math.E);
        System.out.println("常量PI"+Math.PI);
        System.out.println("9的平方根"+Math.sqrt(9));
        System.out.println("8的立方根"+Math.cbrt(8));
        System.out.println("2的3次方"+Math.pow(2,3));
        System.out.println("较大值"+Math.max(6.5,1));
        System.out.println("-10.3的绝对值"+Math.abs(-10.3));
        System.out.println(Math.ceil(10.000001));
        System.out.println(Math.floor(10.999999));
        System.out.println((int)(Math.random()*10));
        System.out.println(Math.rint(5.4));
    }
}
```

### 6、Random

用来产生随机数的类，并且可以任意指定一个区间，在此区间范围内产生一个随机数。

| 方法                         | 描述                                                 |
| ---------------------------- | ---------------------------------------------------- |
| public Random()              | 创建一个无参的随机数构造器，使用系统时间作为默认种子 |
| public Random(long seed)     | 使用 long 数据类型的种子创建一个随机数构造器         |
| public boolean nextBoolean() | 返回一个 boolean 类型的随机数                        |
| public double nextDouble()   | 返回一个 double 类型的随机数，0.0 - 1.0 之间         |
| public float nextFloat()     | 返回一个 float 类型的随机数，0.0 - 1.0 之间          |
| public int nextInt()         | 返回一个 int 类型的随机数                            |
| public int nextInt(n)        | 返回一个 int 类型的随机数，0-n之间                   |
| public long nextLong         | 返回一个 long 类型的随机数，0-1 之间                 |

```java
public class Test {
    public static void main(String[] args) {
        Random random = new Random();
        //生成订单编号（时间戳+随机数）
        for (int i = 1; i <= 10000; i++) {
            //随机生成一个六位数
            System.out.println("订单"+i+"的编号是："+System.currentTimeMillis()+random.nextInt(100000)+100000);
        }

    }
}
```

### 7、String

Java 通过 String 类来创建和操作字符串数据。

- String 实例化

1、直接赋值

```java
String str = "Hello World";
```

2、通过构造函数创建对象

```java
String str = new String("Hello World");
```

![image-20220114202424784](https://coderdu.com/typoraImages//image-20220114202424784.png)

![image-20220114202434963](https://coderdu.com/typoraImages//image-20220114202434963.png)

```java
isLatin1() ? StringLatin1.equals(value, aString.value)
	:StringUTF16.equals(value, aString.value);
```

三目运算符 三元表达式

#### 1、String 常用方法

| 方法                                                 | 描述                                   |
| ---------------------------------------------------- | -------------------------------------- |
| public String()                                      | 创建一个空的字符串对象                 |
| public String(String value)                          | 创建一个值为 value 的字符串对象        |
| public String(char value[])                          | 将一个char数组转换为字符串对象         |
| public String(char value[],int offset, int count)    | 将一个指定范围的char数组转为字符串对象 |
| public String(byte value[])                          | 将一个byte数组转换为字符串对象         |
| public String(byte value[],int offset, int count)    | 将一个指定范围的byte数组转为字符串对象 |
| public int length()                                  | 获取字符串的长度                       |
| public boolean isEmpty()                             | 判断字符串是否为空                     |
| public char charAt(int index)                        | 返回指定下标的字符                     |
| public byte[] getBytes()                             | 返回字符串对应的byte数组               |
| public boolean equals(Object anObject)               | 判断两个字符串值是否相等               |
| public boolean equalsIgnoreCase(Object anObject)     | 判断两个字符串值是否相等（忽略大小写） |
| public int compareTo(String value)                   | 对字符串进行排序                       |
| public int compareToIgnoreCase(String value)         | 忽略大小写进行排序                     |
| public boolean startsWith(String value)              | 判断字符串是否以 value 开头            |
| public boolean endsWith(String value)                | 判断字符串是否以 value 结尾            |
| public int hashCode()                                | 返回字符串的 hash 值                   |
| public int indexOf(String str)                       | 返回 str 在字符串中的下标              |
| public int indexOf(String str,int formIndex)         | 从指定位置查找字符串的下标             |
| public String subString(int beginIndex)              | 从指定位置开始截取字符串               |
| public String subString(int beginIndex,int endIndex) | 截取指定区间的字符串                   |
| public String concat(String str)                     | 追加字符串                             |
| public String replaceAll(String o,String n)          | 将字符串中所有的 o 替换成 n            |
| public String[] split(String regex)                  | 用指定的字符串对目标进行分割，返回数组 |
| public String toLowerCase()                          | 转小写                                 |
| public String toUpperCase()                          | 转大写                                 |
| public char[] toCharArray()                          | 将字符串转为字符数组                   |

null 和空是两个概念。

null 是指对象不存在，引用地址为空。

空是指对象存在，没有内容，长度为零。

![image-20220114202449230](https://coderdu.com/typoraImages//image-20220114202449230.png)

#### 2、StringBuffer

String 对象一旦创建，值不能修改（原来的值不能修改，一旦修改就是一个新的对象，只要一改动，就会创建一个新的对象）

修改之后会重新开辟内存空间来存储新的对象，会修改 String 的引用。

![image-20220114202501971](https://coderdu.com/typoraImages//image-20220114202501971.png)

String 的值为什么不能修改？修改之后会创建一个新的对象？而不是在原有对象的基础上进行修改？

因为 String 底层是用数组来存值的，数组长度一旦创建就不可修改，所以导致上述问题。

StringBuffer 可以解决 String 频繁修改造成的空间资源浪费的问题。

StringBuffer 底层也是使用数组来存值。

- StringBuffer 数组的默认长度为 16，使用无参构造函数来创建对象。

![image-20220114202535624](https://coderdu.com/typoraImages//image-20220114202535624.png)

- 使用有参构造创建对象，数组长度=值的长度+16。
    ![image-20220114202557779](https://coderdu.com/typoraImages//image-20220114202557779.png)

```java
public class Test {
    public static void main(String[] args) {
        StringBuffer stringBuffer = new StringBuffer("Hello");
        StringBuffer stringBuffer1 = new StringBuffer();
        //stringBuffer 底层数组的长度是 21
        //stringBuffer1 底层数组的长度是 16
        stringBuffer1.append("Hello");
        System.out.println(stringBuffer.toString().equals(stringBuffer1.toString()));
        System.out.println(stringBuffer.length());
        System.out.println(stringBuffer1.length());
    }
}
```

length 方法返回的并不是底层数组的长度，而是它的**有效长度**（值的长度）。

StringBuffer 一旦创建，默认会有 16 个字节的空间去修改，但是一旦追加的字符串长度超过 16，如何处理？

StringBuffer 不会重新开辟一块新的内存区域，而是在原有的基础上进行扩容，通过调用父类 ensureCapacityInternal() 方法对底层数组进行扩容，保持引用不变。

![image-20220114202621186](https://coderdu.com/typoraImages//image-20220114202621186.png)

StringBuffer 的常用方法，StringBuffer 是线程安全的，但是效率较低，StringBuilder 是线程不安全的，但是效率较高。

HashMap：线程不安全，效率高

Hashtable：线程安全，效率低

| 方法                                                         | 描述                                  |
| ------------------------------------------------------------ | ------------------------------------- |
| public StringBuffer()                                        | 创建一个空的 StringBuffer对象         |
| public StringBuffer(String str)                              | 创建一个值为 str 的 StringBuffer 对象 |
| public synchronized int length()                             | 返回 StringBuffer 的长度              |
| public synchronized char charAt(int index)                   | 返回指定位置的字符                    |
| public synchronized StringBuffer append(String str)          | 追加内容                              |
| public synchronized StringBuffer delete(int start,int end)   | 删除指定区间的值                      |
| public synchronized StringBuffer deleteCharAt(int index)     | 删除指定位置的字符                    |
| public synchronized StringBuffer replace(int start,int end,String str) | 将指定区间的值替换成 str              |
| public synchronized String substring(int start)              | 截取字符串从指定位置到结尾            |
| public synchronized String substring(int start,int end)      | 截取字符串从start开始，到end结束      |
| public synchronized StringBuffer insert(int offset,String str) | 在指定位置插入 str                    |
| public int indexOf(String str)                               | 从头开始查找指定字符的位置            |
| public int indexOf(String str,int fromIndex)                 | 从fromIndex开始查找指定字符的位置     |
| public synchronized StringBuffer reverse()                   | 进行反转                              |
| public synchronized String toString()                        | 转为 String                           |

读取数据不需要考虑线程安全问题，因为这种操作不存在安全隐患。

### 8、日期类

- java.util.Date

Date 对象表示当前的系统时间

- java.util.Calendar

Calendar 用来完成日期数据的逻辑运算

运算思路：（op+com+t）

1、将日期数据传给 Calendar（Calendar 提供了很多静态常量，专门用来记录日期数据）

| 常量                                 | 描述           |
| ------------------------------------ | -------------- |
| public static final int YEAR         | 年             |
| public static final int MONTH        | 月             |
| public static final int DAY_OF_MONTH | 天，以月为单位 |
| public static final int DAY_OF_YEAR  | 天，以年为单位 |
| public static final int HOUR_OF_DAY  | 小时           |
| public static final int MINUTE       | 分钟           |
| public static final int SECOND       | 秒             |
| public static final int MILLSECOND   | 毫秒           |

2、调用相关方法进行运算

| 方法                                 | 描述                   |
| ------------------------------------ | ---------------------- |
| public static Calendar getInstance() | 获取Calendar实例化对象 |
| public void set(int field,int value) | 给静态常量赋值         |
| public int get(int field)            | 获取静态常量的值       |
| public final Date getTime()          | 将Calendar转为Date对象 |

```java
public class Test {
    public static void main(String[] args) {
        //计算今天所在的周是2020年的第几周
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.YEAR,2020);
        //1月为0，4月为3
        calendar.set(Calendar.MONTH,3);
        calendar.set(Calendar.DAY_OF_MONTH,9);
        int week = calendar.get(Calendar.WEEK_OF_YEAR);
        System.out.println(week);
        
        //今天之后的63天是几月几号
        int days = calendar.get(Calendar.DAY_OF_YEAR);
        days += 63;
        calendar.set(Calendar.DAY_OF_YEAR,days);
        Date date = calendar.getTime();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println(simpleDateFormat.format(date));
        //今天之前的63天是几月几号

        //        calendar.set(Calendar.YEAR,2020);
        //        //1月为0，4月为3
        //        calendar.set(Calendar.MONTH,3);
        //        calendar.set(Calendar.DAY_OF_MONTH,9);

        calendar.set(Calendar.DAY_OF_YEAR,100);
        calendar.set(Calendar.DAY_OF_YEAR,calendar.get(Calendar.DAY_OF_YEAR)-63);
        date = calendar.getTime();
        System.out.println(simpleDateFormat.format(date));
    }
}
```
