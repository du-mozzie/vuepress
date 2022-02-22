---
title: Spring Data JPA
date: 2022-2-22
categories:
 - Bug
tags:
 - Bug
---
## 实体类报错

com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: com.du.entity.User$HibernateProxy$bOI1IGY8["hibernateLazyInitializer"])

>   解决方法

在pojo类上加上如下声明：

@JsonIgnoreProperties(value={"hibernateLazyInitializer","handler","fieldHandler"}) 

@JsonIgnoreProperties(value={"hibernateLazyInitializer"})  （此时只是忽略hibernateLazyInitializer属性）要加载被lazy的，也就是many-to-one的one端的pojo上

这行代码的作用在于告诉你的jsonplug组件，在将你的代理对象转换为json对象时，忽略value对应的数组中的属性，即：

通过java的反射机制将pojo转换成json的，属性，(通过java的反射机制将pojo转换成json的，)

"hibernateLazyInitializer","handler","fieldHandler",（如果你想在转换的时候继续忽略其他属性，可以在数组中继续加入）
