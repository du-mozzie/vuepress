---
title: 开启Redis缓存
date: 2022-4-15
categories:
 - SpringBoot
tags:
 - SpringBoot
---

# 开启redis缓存

```java
@Bean
public RedisCacheConfiguration redisCacheConfiguration() {
    RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig();
    config=config.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(RedisSerializer.json()));
    return config;
}
```