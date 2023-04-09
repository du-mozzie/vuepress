---
title: 高可用集群
date: 2022-5-24
categories:
 - Nginx
tags:
 - Nginx
---

# 高可用集群

**nginx宕机，请求无法生效**

![image-20210626131551343](https://www.coderdu.tech/image//image-20210626131551343.png)

**高可用**

1.  需要两台nginx服务器
2.  需要keepalived
3.  需要虚拟ip

![image-20210626132214392](https://www.coderdu.tech/image//image-20210626132214392.png)

1. 在两台服务器安装nginx、keepalived

    ```bash
    #安装keepalived
    $ yum install keepalived -y
    $ rpm -q -a keepalived    #查看是否已经安装上
    ```

    etc/keepalived/keepalived.conf

2. 配置

    修改keepalived.conf

    ```bash
    global_defs {
    	notification_email {
    	  acassen@firewall.loc
    	  failover@firewall.loc
    	  sysadmin@firewall.loc
    	}
    	notification_email_from Alexandre.Cassen@firewall.loc
    	smtp_ server 192.168.17.129
    	smtp_connect_timeout 30
    	router_id LVS_DEVEL	# LVS_DEVEL这字段在/etc/hosts文件中看；通过它访问到主机
    }
    
    vrrp_script chk_http_ port {
    	script "/usr/local/src/nginx_check.sh"
    	interval 2   # (检测脚本执行的间隔)2s
    	weight 2  #权重，如果这个脚本检测为真，服务器权重+2
    }
    
    vrrp_instance VI_1 {
    	state BACKUP   # 备份服务器上将MASTER 改为BACKUP
    	interface ens33 # 网卡名称
    	virtual_router_id 51 # 主、备机的virtual_router_id必须相同
    	priority 100   #主、备机取不同的优先级，主机值较大，备份机值较小
    	advert_int 1	#每隔1s发送一次心跳
    	authentication {	# 校验方式， 类型是密码，密码1111
            auth type PASS
            auth pass 1111
        }
    	virtual_ipaddress { # 虛拟ip
    		192.168.17.50 # VRRP H虛拟ip地址
    	}
    }
    ```

    在路径/usr/local/src/ 下编写检测脚本 nginx_check.sh

    ```bash
    #! /bin/bash
    A=`ps -C nginx -no-header | wc - 1`
    if [ $A -eq 0];then
    	/usr/local/nginx/sbin/nginx
    	sleep 2
    	if [`ps -C nginx --no-header| wc -1` -eq 0 ];then
    		killall keepalived
    	fi
    fi
    ```

3. 把两台服务器上nginx和keepalived启动

    ```bash
    $ systemctl start keepalived.service		#keepalived启动
    $ ps -ef I grep keepalived		#查看keepalived是否启动
    ```

4. 测试

    停止主服务器的nginx、keepalived，从服务器启动，请求仍能正常访问