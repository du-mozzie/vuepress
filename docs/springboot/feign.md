---
title: Feign远程调用请求头丢失
date: 2022-4-15
categories:
 - SpringBoot
tags:
 - SpringBoot
---

# Feign远程调用请求头丢失

```java
@Component
public class FeignAuthRequestInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (servletRequestAttributes != null) {
            HttpServletRequest request = servletRequestAttributes.getRequest();
            Enumeration<String> headerNames = request.getHeaderNames();
            if (headerNames != null) {
                while (headerNames.hasMoreElements()) {
                    String name = headerNames.nextElement();
                    String header = request.getHeader(name);
                    template.header(name, header);
                }
            }
        }
    }
}
```