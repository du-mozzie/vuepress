---
title: SSL配置
date: 2022-5-24
categories:
 - Nginx
tags:
 - Nginx
---

# SSL配置

1. 下载证书放到linux服务器上

2. 配置文件

    ```shell
    # https
    
    server {
        # 服务器端口使用443，开启ssl, 这里ssl就是上面安装的ssl模块
        listen       443 ssl;
        # 域名，多个以空格分开
        server_name  coderdu.com;
    
        # ssl证书路径
        ssl_certificate /export/servers/nginx/conf/coderdu.com_bundle.crt; #填写您的证书文件名称，例如：cloud.tencent.com_bundle.crt / pem
        ssl_certificate_key /export/servers/nginx/conf/coderdu.com.key; #填写您的私钥文件名称，例如：cloud.tencent.com.key
    
        # ssl验证相关配置
        ssl_session_timeout  5m;    #缓存有效期
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;    #加密算法
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;    #安全链接可选的加密协议
        ssl_prefer_server_ciphers on;   #使用服务器端的首选算法
    
        location / {
        root   /export/servers/vuepress/public;
        index  index.html index.htm;
        }
    }
    
    # http
    
    server {
        listen       80;
        listen       [::]:80;
        server_name  coderdu.com;
        rewrite ^/(.*)$ https://coderdu.com:443/$1 permanent;
    }
    ```