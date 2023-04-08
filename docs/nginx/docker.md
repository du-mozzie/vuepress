---
title: Docker部署
date: 2022-5-24
categories:
 - Nginx
tags:
 - Nginx
---

# Docker部署nginx

> 下载nginx

```shell
docker pull nginx:latest
```

docker下nginx配置文件位置

```shell
#	容器id
docker exec -it 7921c7682a39 /bin/bash

#镜像中nginx.conf配置文件路径
/etc/nginx/nginx.conf
#default.conf配置文件的路径
/etc/nginx/conf.d/default.conf
#默认首页文件夹html路径
/usr/share/nginx/html
#日志文件路径
/var/log/nginx
```

1. 在系统中创建四个文件夹

    ```shell
    mkdir -p /export/server/nginx/{conf,html,logs}
    cd /export/server/nginx/conf
    ```

2. 运行一个nginx容器

    ```shell
    docker run -d nginx
    ```

3. 将容器中的配置文件cpoy到系统中

    ```shell
    docker cp 95d:/etc/nginx/ /export/server/nginx/conf/
    mv /export/server/nginx/conf/nginx/* /export/server/nginx/conf/
    rm -rf /export/server/nginx/conf/nginx
    ```

4. 重新运行一个容器将容器配置文件挂载到刚刚创建的文件中

    ```shell
    # 配置文件映射需要绝对路径
    
    docker run --name nginx \
    -p 80:80 \
    -p 443:443 \
    -v /export/server/nginx/conf:/etc/nginx/ \
    -v /export/server/nginx/html:/usr/share/nginx/html \
    -v /export/server/nginx/logs:/var/log/nginx \
    -d nginx
    ```

5. 访问80端口测试

> 基本https的访问配置

```
server {
    listen 443 ssl;
    server_name yuming.cpm; #你的申请过证书的域名
    ssl_certificate     /etc/nginx/conf.d/certs/xxxx.pem;
    ssl_certificate_key /etc/nginx/conf.d/certs/xxxx.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    location / {
        root  /usr/share/nginx/html/admin;
        index  index.html index.htm;
    }
    location /admin {
        alias   /usr/share/ngi nx/html/admin;
        index  index.html index.htm;
    }
	
    location /s {
	proxy_pass http://mallservertest:8080/;
    }
}
```