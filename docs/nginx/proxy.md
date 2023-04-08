---
title: 反向代理
date: 2022-5-24
categories:
 - Nginx
tags:
 - Nginx
---

# 反向代理

>   测试一

访问linux地址跳转到linux本地tomcat8080端口

1. 在linux中安装tomcat，启动tomcat

2. 开放防火墙

3. 在 nginx 进行请求转发的配置（反向代理配置）

    ![image-20210626082744500](https://www.itdu.tech/image//image-20210626082744500.png)

4. 测试

    ![image-20210626082837419](https://www.itdu.tech/image//image-20210626082837419.png)

>   测试二

访问linux地址，不同url跳转到不同linux本地tomcat端口

1. 添加两个tomcat

2. 修改其中一个端口为8081

    ./tomcat/conf/server.xml

    ![image-20210626084147987](https://www.itdu.tech/image//image-20210626084147987.png)

    ![image-20210626084312239](https://www.itdu.tech/image//image-20210626084312239.png)

3. 创建两个不同页面放到tomcat/webapps下

4. 在nginx/conf/nginx.conf下进行配置

    ![image-20210626093700034](https://www.itdu.tech/image//image-20210626093700034.png)

    location：正则

    - 以 `=` 开头，表示精确匹配

        ```bash
        # 精确匹配，必须是127.0.0.1/
        location = / {
          #规则A
        }
        # 精确匹配，必须是127.0.0.1/login
        location = /login {
          #规则B
        }
        ```

    - 以 `^~` 开头，表示uri以某个常规字符串开头，理解为匹配 url路径即可

        ```bash
        ## 非精确匹配，并且不区分大小写，比如127.0.0.1/static/js.
        location ^~ /static/ {
            #规则C
        }
        ```

    - `~` 开头，表示`区分大小写`的正则匹配

        ```bash
        ## 区分大小写，以gif,jpg,js结尾
        location ~ \.(gif|jpg|png|js|css)$ {
            #规则D
        }
        ```

    - `~*` 开头，表示`不区分大小写`的正则匹配

        ```bash
        ## 不区分大小写，匹配.png结尾的
        location ~* \.png$ {
            #规则E
        }
        ```

    - `!~` 和`!~*` 分别为`区分大小写不匹配`及`不区分大小写不匹配` 的正则

        ```bash
        ## 区分大小写，匹配不以.xhtml结尾的
        location !~ \.xhtml$ {
            #规则F
        }
        location !~* \.xhtml$ {
            #规则G
        }
        ```

    - `/` 通用匹配，任何请求都会匹配到

        ```bash
        ## 什么都可以
        location / {
            #规则H
        }
        ```

        **匹配顺序：**
        首先匹配`=` ；
        其次匹配`^~`；
        再其次是按文件中顺序的正则匹配；
        最后是交给 / 通用匹配；
        当有匹配成功时候，停止匹配，按当前匹配规则处理请求。

5. 测试

    ![image-20210626094118081](https://www.itdu.tech/image//image-20210626094118081.png)

    ![image-20210626094127998](https://www.itdu.tech/image//image-20210626094127998.png)