---
title: Bug整理
date: 2022-2-21
categories:
 - Bug
tags:
 - 
---
# Shiro

## 同类型无法转换

java.lang.ClassCastException: com.du.shiro.Account Profile cannot be cast to com.du.shiro.AccountProfile

>   今天意外发现一个exception:`java.lang.ClassCastException:cn.system.model.User cannot be cast to cn.system.model.User`,一个User对象不能转换成另一个User

在shiro的认证类中的代码：

```
SysUserModel SysUserModel = (SysUserModel)subject.getSession().getAttribute(LOGININFO);1
```

右边的方法的返回值明明是Object，
![image-20220221213520681](https://coderdu.com/typoraImages//image-20220221213520681.png)
按道理是可以强转类型的，却偏偏报异常，虽然已经解决了bug，但还是需要梳理一下思路，以防以后再次入坑。。。后来才发现这与shiro有关

结合网上总结的答案

#### 方案一：不使用spring-boot-devtools热部署

网上说是ClassLoader类加载器的不同导致的类型转换异常，项目启动时加载项目中的类使用的加载器都是`org.springframework.boot.devtools.restart.classloader.RestartClassLoader`
而从shiro session 取出来的对象（从redis中取出经过反序列化）的类加载器都是
`sun.misc.Launcher.AppClassLoader`，
很明显会导致类型转换异常，原来Spring的dev-tools为了实现重新装载class自己实现了一个类加载器，来加载项目中会改变的类，方便重启时将新改动的内容更新进来，其实其中官方文档中是有做说明的：

```text
By default, any open project in your IDE will be loaded using the 
“restart” classloader, and any regular .jar file will be loaded using 
the “base” classloader. If you work on a multi-module project, and not each module is imported into your IDE, you may need to customize 
things. To do this you can create a 
META-INF/spring-devtools.properties file.
The spring-devtools.properties file can contain restart.exclude. and 
restart.include. prefixed properties. The include elements are items 
that should be pulled up into the “restart” classloader, and the 
exclude elements are items that should be pushed down into the “base” 
classloader. The value of the property is a regex pattern that will be 
applied to the classpath.1234567891011
```

所以直接在pom文件中将该devtools的jar包注释即可

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>12345
```

#### 方案二：解决方案就是在resources目录下面创建META_INF文件夹，然后创建spring-devtools.properties文件，文件加上类似下面的配置： (应该是可以的，但我不知道使用了貌似没效果)

```properties
restart.exclude.companycommonlibs=/mycorp-common-[\w-]+.jar 
restart.include.projectcommon=/mycorp-myproj-[\w-]+.jar12
```

All property keys must be unique. As long as a property starts with
restart.include. or restart.exclude. it will be considered. All
META-INF/spring-devtools.properties from the classpath will be loaded.
You can package files inside your project, or in the libraries that
the project consumes.

#### 方案三：直接在代码上修改，效果还可以

```java
Object obj = subject.getSession().getAttribute(LOGININFO);
SysUserModel sysUserModel = new SysUserModel();
     if(obj instanceof SysUserModel) {
         sysUserModel = (SysUserModel) obj;
     } else {
         sysUserModel = JSON.parseObject(JSON.toJSON(obj).toString(), SysUserModel.class);
     }
 return sysUserModel;12345678
```

#### 方案四：利用反射获取属性(单纯作为收藏看看)

```java
我使用笨方法解决了，用反射获取属性，自己写了一个属性；
/**
* 用于redis session 使用了 spring devtools 导致的类型转换异常
* @param redisObj
* @return
*/
public static SysUserEntity convertObjToEntity(Object redisObj) {
SysUserEntity sysUserEntity = new SysUserEntity();
sysUserEntity.setUserId(NumberUtils.toLong(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_USERID)+"",0));
sysUserEntity.setUsername(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_USERNAME)+"");
sysUserEntity.setPassword(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_PASSWORD)+"");
sysUserEntity.setEmail(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_EMAIL)+"");
sysUserEntity.setMobile(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_MOBILE)+"");
sysUserEntity.setStatus(NumberUtils.toInt(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_STATUS)+"",0));
sysUserEntity.setCreateUserId(NumberUtils.toLong(ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_CREATEUSERID)+"",0));
Object dateObj = ReflectUtils.getFieldValue(redisObj, SysUserEntity.FIELD_CREATETIME);
sysUserEntity.setCreateTime(dateObj != null ? (Date) dateObj : null);
return sysUserEntity;
}



try {
        user = (SysUserEntity)principals.getPrimaryPrincipal();
    } catch (Exception e) {
        user = SysUserEntity.convertObjToEntity(principals.getPrimaryPrincipal());
    }
```

# Vue

## 静态资源引入

### vue图片引入的三种方式

>   图片放在 assets目录下 和static 目录下

##### 1. 在template 中直接固定的引入

```vue
<img src="../assets/logo.png">
```

##### 2. 把图片放static 目录,直接通过data引入

```vue
// template
<img v-bind:src=imgSrc>
// srcipt
export default {
  data () {
    return {
      imgSrc: '../static/launch.png'
    };
  }
};
```

##### 3. 如果放在其它目录,直接通过data引入,则需要如下引入

```vue
require('../assets/launch.png')` 或者 `import logo from '../assets/logo.png'
// template
<img v-bind:src=imgSrc>
// srcipt
export default {
  data () {
    return {
      imgSrc: require('../assets/launch.png')
    };
  }
};
import logo from '../assets/logo.png
// template
<img v-bind:src=imgSrc>
// srcipt
export default {
  data () {
    return {
      imgSrc: logo
    };
  }
};
```

# SpringData JPA

## 实体类报错

com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: com.du.entity.User$HibernateProxy$bOI1IGY8["hibernateLazyInitializer"])

>   解决方法

在pojo类上加上如下声明：

@JsonIgnoreProperties(value={"hibernateLazyInitializer","handler","fieldHandler"}) 

@JsonIgnoreProperties(value={"hibernateLazyInitializer"})  （此时只是忽略hibernateLazyInitializer属性）要加载被lazy的，也就是many-to-one的one端的pojo上

这行代码的作用在于告诉你的jsonplug组件，在将你的代理对象转换为json对象时，忽略value对应的数组中的属性，即：

通过java的反射机制将pojo转换成json的，属性，(通过java的反射机制将pojo转换成json的，)

"hibernateLazyInitializer","handler","fieldHandler",（如果你想在转换的时候继续忽略其他属性，可以在数组中继续加入）

