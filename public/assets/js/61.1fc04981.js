(window.webpackJsonp=window.webpackJsonp||[]).push([[61],{628:function(s,t,a){"use strict";a.r(t);var n=a(5),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"负载均衡"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#负载均衡"}},[s._v("#")]),s._v(" 负载均衡")]),s._v(" "),a("p",[s._v("配置")]),s._v(" "),a("ol",[a("li",[a("p",[s._v("配置两台tomcat服务器")])]),s._v(" "),a("li",[a("p",[s._v("配置nginx/conf/nginx.conf")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://www.itdu.tech/image//image-20210626100301586.png",alt:"image-20210626100301586"}})]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("upstraem "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("负载均衡name"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("服务器"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#可以配置多台，nginx提供了不同的均衡策略")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\nserver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\tlocation / "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t\tproxy_pass "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("配置代理"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("负载均衡的名字"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("p",[a("strong",[s._v("负载均衡策略：")])]),s._v(" "),a("ol",[a("li",[a("p",[s._v("轮询(默认策略)")]),s._v(" "),a("p",[s._v("不配置其他的策略，默认开启轮询策略")]),s._v(" "),a("p",[s._v("每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。")])]),s._v(" "),a("li",[a("p",[s._v("weight，权重")]),s._v(" "),a("p",[s._v("根据服务器权重比来分配服务器，权重越高访问的概率越大")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("upstraem testLoadBalance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#配置策略为weight")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8080 "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("weight")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8081 "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("weight")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#两台服务器权重一样访问概率一样大")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("ip_hash，ip地址hash")]),s._v(" "),a("p",[s._v("根据ip哈希算法来分配访问的服务器，如果分配到127.0.0.1:8080这台服务器，后面访问一直都是访问这台服务器")]),s._v(" "),a("p",[a("code",[s._v("可以解决session问题")])]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("upstraem testLoadBalance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#配置策略为ip_hash")]),s._v("\n\tip_hash"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8080"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8081"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("第三方策略")]),s._v(" "),a("p",[s._v("需要将第三方策略添加到nginx模块中")]),s._v(" "),a("ul",[a("li",[a("p",[s._v("fair")]),s._v(" "),a("p",[s._v("根据服务器的响应速度来分配请求的服务器")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("upstraem testLoadBalance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#配置策略为fair")]),s._v("\n\tfair"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8080"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8081"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("url_hash")]),s._v(" "),a("p",[s._v("按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("upstraem testLoadBalance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#配置策略为url_hash")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("hash")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$request_uri")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8080"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\tserver "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:8081"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])])])])])]),s._v(" "),a("p",[a("strong",[s._v("server参数")])]),s._v(" "),a("table",[a("thead",[a("tr",[a("th",[s._v("参数")]),s._v(" "),a("th",[s._v("含义")])])]),s._v(" "),a("tbody",[a("tr",[a("td",[s._v("down")]),s._v(" "),a("td",[s._v("当前server不参与负载均衡")])]),s._v(" "),a("tr",[a("td",[s._v("backup")]),s._v(" "),a("td",[s._v("预留的备份服务器，如果有其他服务器宕机，该服务器启动")])]),s._v(" "),a("tr",[a("td",[s._v("max_fails")]),s._v(" "),a("td",[s._v("允许的最大请求失败次数，如果达到最大请求失败次数服务器宕机，默认1次")])]),s._v(" "),a("tr",[a("td",[s._v("fail_timeout")]),s._v(" "),a("td",[s._v("max_fails宕机后重新探测时间，默认10s，到达fail_timeout时间，尝试连接宕机服务器一次，失败继续等待fail_timeout时间，直到服务器恢复")])]),s._v(" "),a("tr",[a("td",[s._v("max_conns")]),s._v(" "),a("td",[s._v("限制最大的接收的连接数")])]),s._v(" "),a("tr",[a("td",[s._v("resolve")]),s._v(" "),a("td",[s._v("将server指令配置的域名，指定域名解析服务器。需要在http模块下配置resolver指令，指定域名解析服务")])])])])]),s._v(" "),a("li",[a("p",[s._v("测试")]),s._v(" "),a("p",[s._v("同一个请求，根据nginx策略请求到不同的服务器上面")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://www.itdu.tech/image//image-20210626100703542.png",alt:"image-20210626100703542"}})])])])])}),[],!1,null,null,null);t.default=e.exports}}]);