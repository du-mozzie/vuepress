---
title: 负载均衡
date: 2022-5-24
categories:
 - Nginx
tags:
 - Nginx
---

# 负载均衡

配置

1. 配置两台tomcat服务器

2. 配置nginx/conf/nginx.conf

    ![image-20210626100301586](https://www.itdu.tech/image//image-20210626100301586.png)

    ```bash
    upstraem [负载均衡name] {
    	server [服务器] #可以配置多台，nginx提供了不同的均衡策略
    }
    
    server{
    	location / {
    		proxy_pass [配置代理(负载均衡的名字)]
    	}
    }
    ```

    **负载均衡策略：**

    1. 轮询(默认策略)

        不配置其他的策略，默认开启轮询策略

        每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。

    2. weight，权重

        根据服务器权重比来分配服务器，权重越高访问的概率越大

        ```bash
        upstraem testLoadBalance{
        	#配置策略为weight
        	server 127.0.0.1:8080 weight=10;
        	server 127.0.0.1:8081 weight=10;
        }
        
        #两台服务器权重一样访问概率一样大
        ```

    3. ip_hash，ip地址hash

        根据ip哈希算法来分配访问的服务器，如果分配到127.0.0.1:8080这台服务器，后面访问一直都是访问这台服务器

        `可以解决session问题`

        ```bash
        upstraem testLoadBalance{
        	#配置策略为ip_hash
        	ip_hash;
        	server 127.0.0.1:8080;
        	server 127.0.0.1:8081;
        }
        ```

    4. 第三方策略

        需要将第三方策略添加到nginx模块中

        - fair

            根据服务器的响应速度来分配请求的服务器

            ```bash
            upstraem testLoadBalance{
            	#配置策略为fair
            	fair;
            	server 127.0.0.1:8080;
            	server 127.0.0.1:8081;
            }
            ```

        - url_hash

            按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。

            ```bash
            upstraem testLoadBalance{
            	#配置策略为url_hash
            	hash $request_uri;
            	server 127.0.0.1:8080;
            	server 127.0.0.1:8081;
            }
            ```

    **server参数**

    | 参数         | 含义                                                         |
    | ------------ | ------------------------------------------------------------ |
    | down         | 当前server不参与负载均衡                                     |
    | backup       | 预留的备份服务器，如果有其他服务器宕机，该服务器启动         |
    | max_fails    | 允许的最大请求失败次数，如果达到最大请求失败次数服务器宕机，默认1次 |
    | fail_timeout | max_fails宕机后重新探测时间，默认10s，到达fail_timeout时间，尝试连接宕机服务器一次，失败继续等待fail_timeout时间，直到服务器恢复 |
    | max_conns    | 限制最大的接收的连接数                                       |
    | resolve      | 将server指令配置的域名，指定域名解析服务器。需要在http模块下配置resolver指令，指定域名解析服务 |

3. 测试

    同一个请求，根据nginx策略请求到不同的服务器上面

    ![image-20210626100703542](https://www.itdu.tech/image//image-20210626100703542.png)