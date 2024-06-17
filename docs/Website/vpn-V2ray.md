# 自建VPS翻墙服务器

### 自备服务器

> 1. 一台服务器【地区：香港（推荐，对于国内来说延迟低）、国外（美国、新加坡……）】
>
> 2. 安装 Nginx，配置 域名、https
>
>    - **购买域名（阿里云）**
>
>    - **解析域名**
>
>      ![](imgs\vpn_01.jpg)
>
>    - **配置SSL证书**
>
>      ![](imgs\vpn_02.jpg)
>
>      ![](imgs\vpn_03.jpg)
>
>    - 安装 Nginx
>
>      - [Docker 安装 Nginx](https://blog.csdn.net/BThinker/article/details/123507820)
>
>      - Nginx 配置：<a href="/docs/Website/nginx/default.conf" target="_blank">default.conf</a>、<a href="/docs/Website/nginx/nginx.conf" target="_blank">nginx.conf</a>
>
>        ![](imgs\nginx_01.jpg)
>
> 3. 设置防火墙
>
>    ![](imgs\vpn_07.jpg)

### 安装使用 X-ui

> 安装 X-ui：**https://github.com/vaxilu/x-ui**
>
> 访问地址：`http://ip地址:54321`，登录进入面板,用户名和密码都是`admin`
>
> ![](imgs\vpn_06.jpg)
>
> [搭建X-ui可视化面板搭建教程](https://www.jhxie.com/builweb/v2ray节点搭建X-ui可视化面板搭建详细教程.html)

### 安装使用 Qv2ray

> Qv2ray使用（**下面以 53000 端口为例**）
>
> `资料：`[Qv2ray 文档](https://qv2ray-net.pages.dev/lang/zh/)、[Releases · Qv2ray/Qv2ray (github.com)](https://github.com/Qv2ray/Qv2ray/releases)
>
> **配置防火墙开放端口：53000**
>
> `安装：`
>
> - 安装v2ray-win/qv2ray-2.6.2-win64 .exe   <a href="/docs/Website/V2ray-win.zip" target="_blank">下载 qv2ray-2.6.2-win64.zip</a>
>
> - 配置
>
>   ![](imgs\V2ray_01.jpg)
>
> - 分组
>
>   ![](imgs\V2ray_02.jpg)
>
> - 连接
>
>   ![](imgs\V2ray_03.jpg)

?>   **搭建完成，打开 Goole 访问  youtube**

![](imgs\vpn_05.jpg)

