---
title: Controller统一返回封装
date: 2022-4-15
categories:
 - SpringBoot
tags:
 - SpringBoot
---

# Controller统一返回封装

```java
@Data
public class Resp {

    private Integer code;

    private String msg;

    private Object data;


    public static Resp success() {
        return resultData(200, "success", null);
    }

    public static Resp success(Object data) {
        return resultData(200, "success", data);
    }

    public static Resp success(Object data, String msg) {
        return resultData(200, msg, data);
    }

    public static Resp fail(Integer code, String msg) {
        return resultData(code, msg, null);
    }

    public static Resp fail(Integer code, String msg, Object data) {
        return resultData(code, msg, data);
    }


    private static Resp resultData(Integer code, String msg, Object data) {
        Resp resultData = new Resp();
        resultData.setCode(code);
        resultData.setMsg(msg);
        resultData.setData(data);
        return resultData;
    }
}
```