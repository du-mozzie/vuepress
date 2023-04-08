---
title: CentOS 7 部署
date: 2022-5-24
categories:
 - Nginx
tags:
 - Nginx
---

# CentOS 7 部署nginx

```shell
#配置 EPEL 源
sudo yum install -y epel-release
sudo yum -y update

#安装nginx
sudo yum install -y nginx
```

安装成功后，默认的网站目录为： /usr/share/nginx/html

默认的配置文件为：/etc/nginx/nginx.conf

自定义配置文件目录为: /etc/nginx/conf.d/

```shell
# 指定配置文件启动
nginx -c /export/server/nginx/conf/nginx.conf

# 指定配置文件重启
nginx -s reload /export/server/nginx/conf/nginx.conf
```
