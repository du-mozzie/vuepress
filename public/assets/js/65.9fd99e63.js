(window.webpackJsonp=window.webpackJsonp||[]).push([[65],{632:function(s,a,t){"use strict";t.r(a);var n=t(5),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"高可用集群"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#高可用集群"}},[s._v("#")]),s._v(" 高可用集群")]),s._v(" "),t("p",[t("strong",[s._v("nginx宕机，请求无法生效")])]),s._v(" "),t("p",[t("img",{attrs:{src:"https://www.itdu.tech/image//image-20210626131551343.png",alt:"image-20210626131551343"}})]),s._v(" "),t("p",[t("strong",[s._v("高可用")])]),s._v(" "),t("ol",[t("li",[s._v("需要两台nginx服务器")]),s._v(" "),t("li",[s._v("需要keepalived")]),s._v(" "),t("li",[s._v("需要虚拟ip")])]),s._v(" "),t("p",[t("img",{attrs:{src:"https://www.itdu.tech/image//image-20210626132214392.png",alt:"image-20210626132214392"}})]),s._v(" "),t("ol",[t("li",[t("p",[s._v("在两台服务器安装nginx、keepalived")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#安装keepalived")]),s._v("\n$ yum "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" keepalived -y\n$ "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("rpm")]),s._v(" -q -a keepalived    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#查看是否已经安装上")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("p",[s._v("etc/keepalived/keepalived.conf")])]),s._v(" "),t("li",[t("p",[s._v("配置")]),s._v(" "),t("p",[s._v("修改keepalived.conf")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("global_defs "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\tnotification_email "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t  acassen@firewall.loc\n\t  failover@firewall.loc\n\t  sysadmin@firewall.loc\n\t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tnotification_email_from Alexandre.Cassen@firewall.loc\n\tsmtp_ server "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".17.129\n\tsmtp_connect_timeout "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("30")]),s._v("\n\trouter_id LVS_DEVEL\t"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# LVS_DEVEL这字段在/etc/hosts文件中看；通过它访问到主机")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\nvrrp_script chk_http_ port "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\tscript "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/usr/local/src/nginx_check.sh"')]),s._v("\n\tinterval "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (检测脚本执行的间隔)2s")]),s._v("\n\tweight "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#权重，如果这个脚本检测为真，服务器权重+2")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\nvrrp_instance VI_1 "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\tstate BACKUP   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 备份服务器上将MASTER 改为BACKUP")]),s._v("\n\tinterface ens33 "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 网卡名称")]),s._v("\n\tvirtual_router_id "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("51")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 主、备机的virtual_router_id必须相同")]),s._v("\n\tpriority "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#主、备机取不同的优先级，主机值较大，备份机值较小")]),s._v("\n\tadvert_int "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\t"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#每隔1s发送一次心跳")]),s._v("\n\tauthentication "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\t"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 校验方式， 类型是密码，密码1111")]),s._v("\n        auth "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" PASS\n        auth pass "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1111")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\tvirtual_ipaddress "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 虛拟ip")]),s._v("\n\t\t"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".17.50 "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# VRRP H虛拟ip地址")]),s._v("\n\t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br")])]),t("p",[s._v("在路径/usr/local/src/ 下编写检测脚本 nginx_check.sh")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token shebang important"}},[s._v("#! /bin/bash")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("A")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token variable"}},[t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("`")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v(" -C nginx -no-header "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("wc")]),s._v(" - "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("`")])]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$A")]),s._v(" -eq "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("then")]),s._v("\n\t/usr/local/nginx/sbin/nginx\n\t"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("sleep")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("\n\t"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token variable"}},[t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("`")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v(" -C nginx --no-header"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("wc")]),s._v(" -1"),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("`")])]),s._v(" -eq "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("then")]),s._v("\n\t\t"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("killall")]),s._v(" keepalived\n\t"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("fi")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("fi")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br")])])]),s._v(" "),t("li",[t("p",[s._v("把两台服务器上nginx和keepalived启动")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("$ systemctl start keepalived.service\t\t"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#keepalived启动")]),s._v("\n$ "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v(" -ef I "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" keepalived\t\t"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#查看keepalived是否启动")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])])]),s._v(" "),t("li",[t("p",[s._v("测试")]),s._v(" "),t("p",[s._v("停止主服务器的nginx、keepalived，从服务器启动，请求仍能正常访问")])])])])}),[],!1,null,null,null);a.default=e.exports}}]);